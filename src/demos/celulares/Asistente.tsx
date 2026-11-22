/*
 * Bot de WhatsApp de Órbita (simulación de la conversación). Trabaja con reglas programadas:
 * el dueño le manda fotos y datos y el bot publica el producto; cuando un cliente lo mira o lo compra, el bot avisa;
 * y el dueño solo va marcando cómo avanza el pedido (preparación, transporte, entregado).
 * Todo lo que hace cambia los mismos datos que el panel: productos, existencias, pedidos y reparaciones.
 */
import { useEffect, useRef, useState } from "react";
import { Check, Paperclip, Send } from "lucide-react";
import { qz } from "../comun";
import ipairFoto from "@/assets/demo-celulares/ipair.jpg";
import ip17Foto from "@/assets/demo-celulares/ip17.jpg";
import ip17proFoto from "@/assets/demo-celulares/ip17pro.jpg";
import { efectivo, SUCURSALES, TEXTO_REPARACION, sucursalPor, type EstadoPedido, type Pedido, type Producto, type Reparacion, type Tienda } from "./datos";
import { avisoInteres, avisoPedido, chatAgregar, chatMarcarUsada, getBorrador, hayChat, horaAhora, msgBot, setBorrador, useChat, type Borrador, type Boton, type Msg } from "./bot";
import { achicarFoto, urlAFoto } from "./fotos";

const MUTED = "#5b6270";
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
const codigo = (s: string, pre: string) => { const m = s.match(new RegExp(`${pre}-?(\\d+)`, "i")); return m ? `${pre.toUpperCase()}-${m[1]}` : null; };
const MENU: Boton[] = [{ id: "c:subir", t: "Subir un producto con fotos" }, { id: "c:ventas", t: "Ventas de hoy" }, { id: "c:pedidos", t: "Pedidos por atender" }, { id: "c:pagos", t: "Pagos por verificar" }, { id: "c:reparaciones", t: "Reparaciones" }, { id: "c:stock", t: "Consultar stock" }];
const ESTADO_REP: Record<string, Reparacion["estado"]> = { recibido: "recibido", diagnostico: "diagnostico", reparando: "reparando", listo: "listo", entregado: "entregado", entregada: "entregado" };
const PASO_PEDIDO: Record<string, { de: EstadoPedido; a: EstadoPedido; v: string }> = { preparar: { de: "pagado", a: "preparando", v: "Pasar a preparación" }, enviar: { de: "preparando", a: "en-camino", v: "Entregar al transporte" }, transporte: { de: "preparando", a: "en-camino", v: "Entregar al transporte" }, entregado: { de: "en-camino", a: "entregado", v: "Marcar entregado" }, entregar: { de: "en-camino", a: "entregado", v: "Marcar entregado" } };
const SUC_ID: [RegExp, string][] = [[/mixco/, "mix"], [/xela|quetzal/, "xela"], [/zona\s*10|z10/, "z10"]];
const EJEMPLO_PRODUCTO = "iPhone Air 256 GB seminuevo Q8,900 2 unidades";

const bonito = (s: string) => s.split(" ").filter(Boolean).map((w) => ({ iphone: "iPhone", ipad: "iPad", macbook: "MacBook", airpods: "AirPods" } as Record<string, string>)[w.toLowerCase()] ?? w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const marcaDe = (n: string) => (/iphone|ipad|mac|airpods|watch/i.test(n) ? "Apple" : /galaxy|samsung/i.test(n) ? "Samsung" : /pixel/i.test(n) ? "Google" : "Órbita");
const categoriaDe = (n: string): Producto["categoria"] => (/ipad|tab\b|tablet/i.test(n) ? "Tablets" : /macbook|laptop|notebook/i.test(n) ? "Laptops" : /funda|cable|cargador|audifon|reloj|bateria|airpods/i.test(norm(n)) ? "Accesorios" : "Celulares");

/* lee el texto que acompaña las fotos: nombre, precio, unidades, estado y sucursal */
function leerDatos(texto: string, base: Borrador): Borrador {
  let t = texto;
  const quitar = (re: RegExp) => { const m = t.match(re); if (m) t = t.replace(re, " "); return m; };
  const n = norm(texto);
  const out = { ...base };
  const u = quitar(/(\d+)\s*(unidades|unidad|piezas|pieza|uds?)\b/i); if (u) out.unidades = Number(u[1]);
  const c = quitar(/(\d+)\s*(gb|tb)\b/i); if (c) out.capacidad = `${c[1]} ${c[2].toUpperCase()}`;
  const p = quitar(/\bq\.?\s*(\d[\d.,]*)/i) ?? quitar(/\b(\d{3,6})\b/); if (p) out.precio = Number(p[1].replace(/[.,]/g, ""));
  if (/seminuevo|usado/.test(n)) { out.condicion = "Seminuevo"; t = t.replace(/seminuevo|usado/gi, " "); }
  else if (/\bnuevo\b/.test(n)) { out.condicion = "Nuevo"; t = t.replace(/\bnuevo\b/gi, " "); }
  for (const [re, id] of SUC_ID) if (re.test(n)) { out.sucursal = id; t = t.replace(/\b(en|a|de)?\s*(zona\s*10|z10|mixco|xela|quetzaltenango)\b/gi, " "); }
  const nombre = t.replace(/\b(sube|subir|publica|publicar|estas|estos|esta|fotos?|con|un|una|unos|unas|de|del|el|la|las|los|y|tengo|tiene|tienen|hay|a|en|total)\b/gi, " ").replace(/[,.:;]/g, " ").replace(/\s+/g, " ").trim();
  if (nombre.length > 2) out.nombre = bonito(nombre);
  return out;
}

export function Asistente({ t }: { t: Tienda }) {
  const msgs = useChat();
  const unidades = (id: string) => Object.values(t.stock[id] ?? {}).reduce((s, n) => s + n, 0);
  const [texto, setTexto] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const archivo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hayChat()) return;
    t.pedidos.filter((p) => p.estado === "pago-pendiente").forEach((p) => chatAgregar(msgBot(`Transferencia con comprobante.\n${p.id} · ${p.cliente} · ${qz(p.total)}.`, [{ id: `do:pago:${p.id}`, t: "Confirmar pago" }, { id: `do:rechazar:${p.id}`, t: "Rechazar" }])));
    t.reparaciones.filter((r) => r.estado === "listo").forEach((r) => chatAgregar(msgBot(`Reparación lista.\n${r.id} · ${r.cliente} · ${r.modelo}.`, [{ id: `do:rep:${r.id}:entregado`, t: "Marcar entregada" }])));
    const bajos = t.productos.filter((p) => unidades(p.id) <= 3);
    if (bajos.length) chatAgregar(msgBot(`Poco stock: ${bajos.slice(0, 3).map((p) => `${p.nombre} (${unidades(p.id)})`).join(", ")}.`, [{ id: "c:stock", t: "Consultar stock" }]));
    chatAgregar(msgBot("Para empezar, toque una opción o escriba *menú*.", MENU.slice(0, 3)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { const c = caja.current; if (c) c.scrollTo({ top: c.scrollHeight, behavior: "smooth" }); }, [msgs]);

  /* acciones que cambian los datos del panel */
  const moverPedido = (p: Pedido, a: EstadoPedido, guia?: string) => t.setPedidos((ps) => ps.map((x) => (x.id === p.id ? { ...x, estado: a, guia: a === "en-camino" ? guia ?? x.guia : x.guia, nuevo: false } : x)));
  const confirmarPago = (p: Pedido) => {
    moverPedido(p, "pagado");
    t.setStock((s) => { const n = structuredClone(s); p.lineas.forEach((l) => { const suc = Object.keys(n[l.id] ?? {}).find((k) => n[l.id][k] > 0); if (suc) n[l.id][suc] = Math.max(0, n[l.id][suc] - l.cantidad); }); return n; });
  };
  const buscarProductos = (q: string) => {
    const palabras = norm(q).split(" ").filter((w) => w.length > 1);
    const todos = t.productos.map((p) => { const nombre = norm(`${p.marca} ${p.nombre}`); return { p, n: palabras.filter((w) => nombre.includes(w)).length }; }).filter((x) => x.n > 0).sort((a, b) => b.n - a.n || a.p.nombre.length - b.p.nombre.length);
    return todos.filter((x) => x.n === (todos[0]?.n ?? 0));
  };
  const detalleStock = (p: Producto) => `${p.nombre}: ${unidades(p.id)} en total\n${SUCURSALES.map((s) => `   ${s.nombre}: ${t.stock[p.id]?.[s.id] ?? 0}`).join("\n")}`;

  /* lo que falta para publicar un producto con fotos */
  const avanzar = (b: Borrador): Msg[] => {
    setBorrador(b);
    if (!b.nombre) return [msgBot(`Recibí ${b.fotos.length} ${b.fotos.length === 1 ? "foto" : "fotos"}. ¿Cómo se llama el producto?\nEjemplo: ${EJEMPLO_PRODUCTO}`)];
    if (!b.precio) return [msgBot(`${b.nombre}. ¿Qué precio con tarjeta tiene? Ejemplo: Q8,900`)];
    const u = b.unidades ?? 1;
    return [msgBot(`Voy a publicar:\n${b.nombre}${b.capacidad ? ` ${b.capacidad}` : ""} · ${b.condicion}\n${qz(b.precio)} con tarjeta · ${qz(efectivo(b.precio))} en efectivo\n${u} ${u === 1 ? "unidad" : "unidades"} en ${sucursalPor(b.sucursal).nombre}\n${b.fotos.length} ${b.fotos.length === 1 ? "foto" : "fotos"}`, [{ id: "do:publicar", t: "Publicar en la tienda" }, { id: "do:descartar", t: "Descartar" }])];
  };

  const responder = (entrada: string): Msg[] => {
    const id = /^(do:|c:)/.test(entrada) || entrada === "no" ? entrada : "";
    if (id === "no") return [msgBot("Cancelado. No se hizo ningún cambio.")];
    if (id === "do:descartar") { setBorrador(null); return [msgBot("Descartado. No se publicó nada.")]; }
    if (id === "do:publicar") {
      const b = getBorrador();
      if (!b?.nombre || !b.precio) return [msgBot("No hay ningún producto por publicar. Adjunte las fotos con el clip.")];
      const pid = `p${Date.now()}`, u = b.unidades ?? 1;
      const p: Producto = { id: pid, nombre: b.nombre, marca: marcaDe(b.nombre), categoria: categoriaDe(b.nombre), condicion: b.condicion, foto: b.fotos[0], fotos: b.fotos, colores: [{ nombre: "Único", hex: "#999999" }], variantes: [{ capacidad: b.capacidad, precio: b.precio }], resumen: b.condicion === "Nuevo" ? "Nuevo, sellado, con factura y garantía." : "Seminuevo revisado, con factura y garantía.", detalles: [], garantia: b.condicion === "Nuevo" ? "1 año con nosotros" : "6 meses con nosotros", origen: "Publicado desde WhatsApp", visible: true };
      t.setProductos((ps) => [{ ...p, visible: true }, ...ps]);
      t.setStock((s) => ({ ...s, [pid]: { z10: 0, mix: 0, xela: 0, [b.sucursal]: u } }));
      setBorrador(null);
      return [msgBot(`Publicado.\n${b.nombre} ya aparece en la tienda con ${b.fotos.length} ${b.fotos.length === 1 ? "foto" : "fotos"} y ${u} ${u === 1 ? "unidad" : "unidades"}. Le aviso cuando un cliente lo mire o lo compre.`)];
    }
    if (id.startsWith("do:")) {
      const [, que, ref, extra] = id.split(":");
      if (que === "pago" || que === "rechazar") {
        const p = t.pedidos.find((x) => x.id === ref);
        if (!p || p.estado !== "pago-pendiente") return [msgBot(`El pedido ${ref} ya no tiene un pago por verificar.`)];
        if (que === "pago") { confirmarPago(p); return [msgBot(`Pago confirmado.\n${p.id} pasó a Pagado y se descontó el stock. El cliente lo ve en su rastreo.`, [{ id: `do:mover:${p.id}:preparando`, t: "Pasar a preparación" }])]; }
        t.setPedidos((ps) => ps.map((x) => (x.id === p.id ? { ...x, estado: "rechazado", motivoRechazo: "Comprobante no coincide con el depósito", nuevo: false } : x)));
        return [msgBot(`Pago rechazado.\n${p.id} quedó como rechazado. No se cobró nada.`)];
      }
      if (que === "mover") {
        const p = t.pedidos.find((x) => x.id === ref);
        if (!p) return [msgBot("No encontré ese pedido.")];
        const guia = `GT-${String(Date.now()).slice(-6)}`;
        moverPedido(p, extra as EstadoPedido, guia);
        if (extra === "preparando") return [msgBot(`${p.id} en preparación.\nEl cliente ya lo ve en su rastreo.`, [{ id: `do:mover:${p.id}:en-camino`, t: "Entregar al transporte" }])];
        if (extra === "en-camino") return [msgBot(`${p.id} entregado al transporte.\nGuía ${p.guia ?? guia}. El cliente recibe el aviso de que va en camino.`, [{ id: `do:mover:${p.id}:entregado`, t: "Marcar entregado" }])];
        return [msgBot(`${p.id} entregado.\nPedido cerrado. Gracias.`)];
      }
      if (que === "rep") { t.setReparaciones((rs) => rs.map((r) => (r.id === ref ? { ...r, estado: extra as Reparacion["estado"], nueva: false } : r))); return [msgBot(`Listo.\n${ref}: ${TEXTO_REPARACION[extra as Reparacion["estado"]]}.${extra === "listo" ? " Se avisó al cliente que puede recoger." : ""}`)]; }
      if (que === "precio") { const monto = Number(extra); t.setProductos((ps) => ps.map((p) => (p.id === ref ? { ...p, variantes: p.variantes.map((v, i) => (i === 0 ? { ...v, precio: monto } : v)) } : p))); const p = t.productos.find((x) => x.id === ref); return [msgBot(`Precio actualizado.\n${p?.nombre}: ${qz(monto)}. Ya se ve en la tienda.`)]; }
      if (que === "ocultar") { const p = t.productos.find((x) => x.nombre === ref); if (p) t.setProductos((ps) => ps.map((x) => (x.id === p.id ? { ...x, visible: false } : x))); return [msgBot(`Listo. ${ref} ya no se ve en la tienda.`)]; }
      if (que === "stock") {
        const [, , pid, suc, signo, cant] = id.split(":");
        const k = Number(cant);
        t.setStock((s) => ({ ...s, [pid]: { ...(s[pid] ?? {}), [suc]: Math.max(0, (s[pid]?.[suc] ?? 0) + (signo === "+" ? k : -k)) } }));
        const p = t.productos.find((x) => x.id === pid)!;
        return [msgBot(`Hecho.\n${p.nombre}: ${Math.max(0, unidades(pid) + (signo === "+" ? k : -k))} en total.`)];
      }
    }
    const n = id.startsWith("c:") ? id.slice(2).replace(":", " ") : norm(entrada);

    if (/^(menu|hola|buenas|buen dia|buenos dias|buenas tardes|ayuda|inicio|opciones)/.test(n)) return [msgBot("Opciones disponibles:", MENU)];
    if (/^subir/.test(n)) return [msgBot(`Para subir un producto, adjunte las fotos con el clip (una o varias) y escriba el nombre, el precio y las unidades.\nEjemplo: ${EJEMPLO_PRODUCTO}\nSi falta algún dato, el bot lo pregunta.`)];
    if (/^(ventas|resumen)/.test(n)) {
      const vend = t.pedidos.filter((p) => ["pagado", "preparando", "en-camino", "entregado"].includes(p.estado));
      const hoy = new Date().toDateString();
      const h = vend.filter((p) => new Date(p.fecha).toDateString() === hoy);
      const tot7 = vend.reduce((s, p) => s + p.total, 0);
      return [msgBot(`Ventas de hoy: ${qz(h.reduce((s, p) => s + p.total, 0))} (${h.length} ${h.length === 1 ? "pedido" : "pedidos"}).\nÚltimos 7 días: ${qz(tot7)} (${vend.length} pedidos, ticket ${qz(vend.length ? Math.round(tot7 / vend.length) : 0)}).\nPor verificar: ${t.pedidos.filter((p) => p.estado === "pago-pendiente").length}.`)];
    }
    if (/^pedidos/.test(n)) {
      const l = t.pedidos.filter((p) => ["pago-pendiente", "pagado", "preparando", "en-camino"].includes(p.estado));
      if (!l.length) return [msgBot("No hay pedidos por atender.")];
      return l.slice(0, 5).map((p) => {
        const sig = p.estado === "pago-pendiente" ? { id: `c:pago:${p.id}`, t: "Confirmar pago" } : p.estado === "pagado" ? { id: `do:mover:${p.id}:preparando`, t: "Pasar a preparación" } : p.estado === "preparando" ? { id: `do:mover:${p.id}:en-camino`, t: "Entregar al transporte" } : { id: `do:mover:${p.id}:entregado`, t: "Marcar entregado" };
        return msgBot(`${p.id} · ${p.cliente} · ${qz(p.total)}\n${p.estado === "pago-pendiente" ? "Verificando pago" : p.estado === "pagado" ? "Pagado, sin preparar" : p.estado === "preparando" ? "En preparación" : "Con el transporte"}`, [sig]);
      });
    }
    if (/^pagos/.test(n)) {
      const l = t.pedidos.filter((p) => p.estado === "pago-pendiente");
      if (!l.length) return [msgBot("No hay transferencias por verificar.")];
      return l.map((p) => msgBot(`Transferencia por verificar.\n${p.id} · ${p.cliente} · ${qz(p.total)}.`, [{ id: `c:pago:${p.id}`, t: "Confirmar pago" }, { id: `do:rechazar:${p.id}`, t: "Rechazar" }]));
    }
    if (/^reparaciones/.test(n)) {
      const l = t.reparaciones.filter((r) => r.estado !== "entregado");
      return [msgBot(l.length ? `Reparaciones en curso (${l.length}):\n${l.map((r) => `${r.id} · ${r.cliente} · ${r.modelo} · ${TEXTO_REPARACION[r.estado]}`).join("\n")}\n\nEscriba por ejemplo: rep ${l[0].id} listo` : "No hay reparaciones en curso.")];
    }
    if (/^stock\b/.test(n)) {
      const q = n.replace(/^stock\s*/, "");
      if (!q) return [msgBot("Escriba *stock* y el nombre. Ejemplo: stock iphone air")];
      const r = buscarProductos(q).slice(0, 3);
      if (!r.length) return [msgBot(`No encontré “${q}” en el inventario.`)];
      return [msgBot(r.map(({ p }) => detalleStock(p)).join("\n\n"))];
    }
    const mov = n.match(/^(agregar|sumar|aumentar|quitar|restar|sacar)\s+(\d+)\s+(.+)$/);
    if (mov) {
      let resto = mov[3], suc = "z10";
      for (const [re, sid] of SUC_ID) if (re.test(resto)) { suc = sid; resto = resto.replace(/\b(en|a|de)?\s*(zona\s*10|z10|mixco|xela|quetzaltenango)\b/, " ").trim(); }
      const r = buscarProductos(resto);
      if (!r.length) return [msgBot(`No encontré “${resto}” en el inventario.`)];
      const p = r[0].p, suma = /^(agregar|sumar|aumentar)/.test(mov[1]);
      return [msgBot(`¿${suma ? "Agregar" : "Quitar"} ${mov[2]} ${Number(mov[2]) === 1 ? "unidad" : "unidades"} de ${p.nombre} en ${sucursalPor(suc).nombre}?`, [{ id: `do:stock:${p.id}:${suc}:${suma ? "+" : "-"}:${mov[2]}`, t: "Confirmar" }, { id: "no", t: "Cancelar" }])];
    }
    const cp = codigo(n, "or");
    if (cp && /^(pago|confirmar|rechazar)/.test(n)) {
      const p = t.pedidos.find((x) => x.id === cp);
      if (!p) return [msgBot(`No encontré el pedido ${cp}.`)];
      if (p.estado !== "pago-pendiente") return [msgBot(`El pedido ${p.id} no tiene un pago por verificar.`)];
      return [msgBot(`¿Confirmar el pago de ${qz(p.total)} del pedido ${p.id} (${p.cliente})? Se descuenta el stock.`, [{ id: `do:pago:${p.id}`, t: "Confirmar" }, { id: "no", t: "Cancelar" }])];
    }
    const paso = n.match(/^(preparar|enviar|transporte|entregado|entregar)\s/);
    if (paso && cp) {
      const p = t.pedidos.find((x) => x.id === cp), k = PASO_PEDIDO[paso[1]];
      if (!p) return [msgBot(`No encontré el pedido ${cp}.`)];
      if (p.estado !== k.de) return [msgBot(`El pedido ${p.id} está en “${p.estado}”; no se puede hacer eso desde ahí.`)];
      return [msgBot(`¿${k.v} el pedido ${p.id} de ${p.cliente}?`, [{ id: `do:mover:${p.id}:${k.a}`, t: k.v }, { id: "no", t: "Cancelar" }])];
    }
    const cr = codigo(n, "rp");
    if (cr && /^(rep|reparacion)/.test(n)) {
      const r = t.reparaciones.find((x) => x.id === cr);
      const est = Object.keys(ESTADO_REP).find((e) => n.includes(e));
      if (!r) return [msgBot(`No encontré la reparación ${cr}.`)];
      if (!est) return [msgBot(`${r.id} está en: ${TEXTO_REPARACION[r.estado]}.\nPara cambiarla escriba: rep ${r.id} listo`)];
      return [msgBot(`¿Pasar ${r.id} (${r.cliente}, ${r.modelo}) a “${TEXTO_REPARACION[ESTADO_REP[est]]}”?${ESTADO_REP[est] === "listo" ? " Se avisa al cliente." : ""}`, [{ id: `do:rep:${r.id}:${ESTADO_REP[est]}`, t: "Confirmar" }, { id: "no", t: "Cancelar" }])];
    }
    const pr = n.match(/^precio\s+(.+?)\s+q?\s*(\d[\d,.]*)$/);
    if (pr) {
      const hallados = buscarProductos(pr[1]);
      const monto = Number(pr[2].replace(/[,.]/g, ""));
      if (!hallados.length) return [msgBot(`No encontré “${pr[1]}”.`)];
      const p = hallados[0].p;
      return [msgBot(`¿Cambiar el precio de ${p.nombre} de ${qz(p.variantes[0].precio)} a ${qz(monto)}?`, [{ id: `do:precio:${p.id}:${monto}`, t: "Confirmar" }, { id: "no", t: "Cancelar" }])];
    }
    const b = getBorrador();
    if (b) return avanzar(leerDatos(entrada, b));
    return [msgBot("No reconocí ese mensaje. Escriba *menú* para ver las opciones.", MENU.slice(0, 3))];
  };

  const enviar = (entrada: string, etiqueta?: string, marcar?: number) => {
    if (!entrada.trim()) return;
    if (marcar !== undefined) chatMarcarUsada(marcar);
    chatAgregar({ de: "yo", texto: etiqueta ?? entrada.trim(), hora: horaAhora() }, ...responder(entrada.trim()));
    setTexto("");
  };
  const tocar = (b: Boton, i: number) => {
    if (b.id === "c:stock") return enviar("stock", b.t, i);
    if (b.id.startsWith("c:pago:")) return enviar(`pago ${b.id.split(":")[2]}`, b.t, i);
    enviar(b.id, b.t, i);
  };

  /* fotos adjuntas: se leen, se achican y el bot arma el producto con lo que dice el texto */
  const recibirFotos = (lista: string[], pie: string) => {
    chatAgregar({ de: "yo", texto: pie, hora: horaAhora(), fotos: lista });
    setTexto("");
    const previo = getBorrador();
    const base: Borrador = previo ? { ...previo, fotos: [...previo.fotos, ...lista] } : { fotos: lista, condicion: "Nuevo", sucursal: "z10" };
    chatAgregar(...avanzar(pie ? leerDatos(pie, base) : base));
  };
  const alElegir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = Array.from(e.target.files ?? []).slice(0, 6);
    e.target.value = "";
    if (!f.length) return;
    setOcupado(true);
    try { recibirFotos(await Promise.all(f.map((x) => achicarFoto(x))), texto.trim()); } finally { setOcupado(false); }
  };
  const fotosEjemplo = async () => {
    setOcupado(true);
    try { recibirFotos(await Promise.all([ipairFoto, ip17proFoto, ip17Foto].map(urlAFoto)), texto.trim() || EJEMPLO_PRODUCTO); } finally { setOcupado(false); }
  };

  const ejemplos = ["menú", "ventas", "stock iphone air", "agregar 2 iphone air", "precio s26 7500"];
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-md border bg-[#efeae2]" style={{ borderColor: "#dde0e6" }}>
      <header className="flex items-center gap-3 px-4 py-3 text-white" style={{ background: "#075e54" }}>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[1.05rem] font-extrabold text-[#14101f]">Ó</span>
        <span className="leading-tight"><b className="block">Bot de Órbita</b><span className="text-[0.78rem] opacity-80">cuenta de empresa · en línea</span></span>
      </header>
      <div ref={caja} className="h-[min(36rem,68vh)] overflow-y-auto px-3 py-3 sm:px-5">
        <div className="space-y-2">
          {msgs.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.de === "yo" ? "items-end" : "items-start"}`}>
              <div className="max-w-[88%] rounded-lg px-3 py-2 text-[0.94rem] leading-snug shadow-sm sm:max-w-[75%]" style={{ background: m.de === "yo" ? "#d9fdd3" : "#fff" }}>
                {m.fotos && <div className="mb-1.5 grid grid-cols-3 gap-1">{m.fotos.map((f, k) => <img key={k} src={f} alt="" className="aspect-square w-full rounded object-cover" />)}</div>}
                {m.texto && <p className="whitespace-pre-line">{m.texto.split(/(\*[^*]+\*)/).map((x, k) => (x.startsWith("*") ? <b key={k}>{x.slice(1, -1)}</b> : x))}</p>}
                <p className="mt-0.5 text-right text-[0.68rem]" style={{ color: MUTED }}>{m.hora}{m.de === "yo" && <Check size={11} className="ml-1 inline text-[#34b7f1]" />}</p>
              </div>
              {m.botones && (
                <div className="mt-1 grid w-[88%] gap-1 sm:w-[75%]">
                  {m.botones.map((b) => <button key={b.id} type="button" disabled={m.usada} onClick={() => tocar(b, i)} className="min-h-[2.6rem] rounded-lg bg-white px-3 text-center text-[0.94rem] font-semibold shadow-sm transition hover:bg-[#f0f9ff] disabled:opacity-45" style={{ color: "#027eb5" }}>{b.t}</button>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 bg-[#f0f2f5] px-3 pb-1 pt-2">
        <button type="button" disabled={ocupado} onClick={fotosEjemplo} className="rounded-full px-3 py-1 text-[0.8rem] font-bold text-white transition hover:brightness-110 disabled:opacity-50" style={{ background: "#128c7e" }}>Adjuntar 3 fotos de ejemplo</button>
        {ejemplos.map((e) => <button key={e} type="button" onClick={() => enviar(e)} className="rounded-full bg-white px-2.5 py-1 text-[0.8rem] font-semibold shadow-sm transition hover:bg-[#f0f9ff]" style={{ color: MUTED }}>{e}</button>)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); enviar(texto); }} className="flex items-center gap-2 bg-[#f0f2f5] px-3 pb-3 pt-1">
        <input ref={archivo} type="file" accept="image/*" multiple className="sr-only" onChange={alElegir} />
        <button type="button" aria-label="Adjuntar fotos" disabled={ocupado} onClick={() => archivo.current?.click()} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#54656f] transition hover:bg-black/5 disabled:opacity-50"><Paperclip size={21} /></button>
        <input aria-label="Mensaje" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribir un mensaje" className="min-h-[2.8rem] min-w-0 flex-1 rounded-full bg-white px-4 text-[0.95rem] outline-none" />
        <button type="submit" aria-label="Enviar" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white transition hover:brightness-110" style={{ background: "#128c7e" }}><Send size={19} /></button>
      </form>
    </div>
  );
}

/* para la demostración: un cliente compra el último producto publicado (o el iPhone Air) y el bot avisa */
export function simularCompra(t: Tienda) {
  const p = t.productos.find((x) => x.origen === "Publicado desde WhatsApp" && x.visible !== false) ?? t.productos.find((x) => x.id === "ipair") ?? t.productos[0];
  const precio = p.variantes[0].precio;
  const n = Math.max(1041, ...t.pedidos.map((x) => Number(x.id.split("-")[1]) || 0)) + 1;
  const total = Object.values(t.stock[p.id] ?? {}).reduce((s, x) => s + x, 0);
  const pedido: Pedido = {
    id: `OR-${n}`, fecha: new Date().toISOString(), cliente: "Ricardo Morales", telefono: "5555 0188",
    entrega: { tipo: "envio", direccion: "Zona 15, Ciudad de Guatemala" },
    lineas: [{ id: p.id, nombre: p.nombre, detalle: p.variantes[0].capacidad ?? "", precio, cantidad: 1 }],
    envio: 0, total: precio, metodo: "tarjeta", tarjeta: "4242", estado: "pagado", sucursal: "z10", nuevo: true,
  };
  avisoInteres(p.id, p.nombre);
  setTimeout(() => {
    t.setPedidos((ps) => [pedido, ...ps.map((x) => ({ ...x, nuevo: false }))]);
    t.setStock((s) => { const c = structuredClone(s); const suc = Object.keys(c[p.id] ?? {}).find((k) => c[p.id][k] > 0); if (suc) c[p.id][suc] = Math.max(0, c[p.id][suc] - 1); return c; });
    avisoPedido(pedido, total - 1 <= 0 ? [p.nombre] : []);
  }, 1200);
  return p.nombre;
}
