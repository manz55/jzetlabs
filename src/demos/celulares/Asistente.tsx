/*
 * Bot de WhatsApp de Órbita (simulación de la conversación). Trabaja con reglas, estados y permisos:
 * valida primero quién escribe (dueño, encargado, técnico o cliente), responde seco y con datos exactos
 * y todo lo que hace cambia los mismos datos que el panel: productos, existencias, pedidos, reparaciones y devoluciones.
 * Al abrir el chat desde una sección del panel, arranca hablando de esa sección.
 */
import { useEffect, useRef, useState } from "react";
import { Check, Paperclip, Send } from "lucide-react";
import { qz } from "../comun";
import ipairFoto from "@/assets/demo-celulares/ipair.jpg";
import ip17Foto from "@/assets/demo-celulares/ip17.jpg";
import ip17proFoto from "@/assets/demo-celulares/ip17pro.jpg";
import { ESTADOS_PEDIDO, efectivo, SUCURSALES, TEXTO_REPARACION, sucursalPor, type EstadoPedido, type Pedido, type Producto, type Reparacion, type Tienda } from "./datos";
import { CLIENTE, avisoInteres, avisoPedido, chatAgregar, chatMarcarUsada, getBorrador, getDemanda, getEnLinea, getReglas, hayChat, horaAhora, msgBot, personaActual, registrar, setBorrador, setChatVisible, setPersona, useAutorizados, useChat, useComando, useEnLinea, usePersonaId, type Area, type Borrador, type Boton, type Foco, type Msg, type Origen } from "./bot";
import { achicarFoto, urlAFoto } from "./fotos";

const MUTED = "#5b6270";
let ordenProcesada = 0;
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
const codigo = (s: string, pre: string) => { const m = s.match(new RegExp(`${pre}-?(\\d+)`, "i")); return m ? `${pre.toUpperCase()}-${m[1]}` : null; };
/* WhatsApp permite 3 botones por mensaje */
const MENU: Boton[] = [{ id: "c:stock", t: "Consultar stock" }, { id: "c:subir", t: "Subir producto" }, { id: "c:ventas", t: "Ventas de hoy" }];
const MENU_CLIENTE: Boton[] = [{ id: "c:rastrear", t: "Rastrear pedido" }, { id: "c:garantia", t: "Garantía" }, { id: "c:asesor", t: "Hablar con asesor" }];
const ESTADO_REP: Record<string, Reparacion["estado"]> = { recibido: "recibido", diagnostico: "diagnostico", reparando: "reparando", listo: "listo", entregado: "entregado", entregada: "entregado" };
const PASO_PEDIDO: Record<string, { de: EstadoPedido; a: EstadoPedido; v: string }> = { preparar: { de: "pagado", a: "preparando", v: "Pasar a preparación" }, enviar: { de: "preparando", a: "en-camino", v: "Entregar al transporte" }, transporte: { de: "preparando", a: "en-camino", v: "Entregar al transporte" }, entregado: { de: "en-camino", a: "entregado", v: "Marcar entregado" }, entregar: { de: "en-camino", a: "entregado", v: "Marcar entregado" } };
const SUC_ID: [RegExp, string][] = [[/mixco/, "mix"], [/xela|quetzal/, "xela"], [/zona\s*10|z10/, "z10"]];
const EJEMPLO_PRODUCTO = "iPhone Air 256 GB seminuevo Q8,900 2 unidades";
const MENU_TEXTO = "📋 Menú\nstock [nombre] · agregar [n] [nombre]\nprecio [nombre] [monto]\npedidos · pagos · devoluciones · reparaciones";

const bonito = (s: string) => s.split(" ").filter(Boolean).map((w) => ({ iphone: "iPhone", ipad: "iPad", macbook: "MacBook", airpods: "AirPods" } as Record<string, string>)[w.toLowerCase()] ?? w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const marcaDe = (n: string) => (/iphone|ipad|mac|airpods|watch/i.test(n) ? "Apple" : /galaxy|samsung/i.test(n) ? "Samsung" : /pixel/i.test(n) ? "Google" : "Órbita");
const categoriaDe = (n: string): Producto["categoria"] => (/ipad|tab\b|tablet/i.test(n) ? "Tablets" : /macbook|laptop|notebook/i.test(n) ? "Laptops" : /funda|cable|cargador|audifon|reloj|bateria|airpods/i.test(norm(n)) ? "Accesorios" : "Celulares");
const corto = (n: string) => n.split(" ").slice(0, 2).join(" ");

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

/* los primeros avisos de la conversación, con lo que hay pendiente en el panel */
export function iniciarChat(t: Tienda) {
  if (hayChat()) return;
  const unidades = (id: string) => Object.values(t.stock[id] ?? {}).reduce((s, n) => s + n, 0);
  t.pedidos.filter((p) => p.estado === "pago-pendiente").forEach((p) => chatAgregar(msgBot(`🧾 Pago por verificar\n${p.id} · ${p.cliente} · ${qz(p.total)}`, [{ id: `do:pago:${p.id}`, t: "Confirmar pago" }, { id: `do:rechazar:${p.id}`, t: "Rechazar" }])));
  t.reparaciones.filter((r) => r.estado === "listo").forEach((r) => chatAgregar(msgBot(`🔧 Reparación lista\n${r.id} · ${r.cliente} · ${r.modelo}`, [{ id: `do:rep:${r.id}:entregado`, t: "Marcar entregada" }])));
  const bajos = t.productos.filter((p) => unidades(p.id) <= 3);
  if (bajos.length && getReglas().avisarStockBajo) chatAgregar(msgBot(`⚠️ Stock bajo: ${bajos.slice(0, 3).map((p) => `${p.nombre} (${unidades(p.id)})`).join(", ")}`, [{ id: "c:stock", t: "Consultar stock" }]));
  chatAgregar(msgBot(MENU_TEXTO, MENU));
}

/* lo que el bot dice primero según la sección desde donde se abrió el chat */
export function resumenDe(t: Tienda, foco: Foco): Msg[] {
  const unidades = (id: string) => Object.values(t.stock[id] ?? {}).reduce((s, n) => s + n, 0);
  const vend = t.pedidos.filter((p) => ["pagado", "preparando", "en-camino", "entregado"].includes(p.estado));
  const hoy = new Date().toDateString();
  const hoyV = vend.filter((p) => new Date(p.fecha).toDateString() === hoy);
  const porVerificar = t.pedidos.filter((p) => p.estado === "pago-pendiente");
  const devPend = t.devoluciones.filter((d) => d.estado === "pendiente");
  const bajos = t.productos.filter((p) => unidades(p.id) <= 3);
  const listas = t.reparaciones.filter((r) => r.estado === "listo");
  const enLinea = getEnLinea();

  if (foco === "general") {
    const lineas = [porVerificar.length && `🧾 ${porVerificar.length} ${porVerificar.length === 1 ? "pago por verificar" : "pagos por verificar"}`, devPend.length && `↩️ ${devPend.length} ${devPend.length === 1 ? "devolución por revisar" : "devoluciones por revisar"}`, bajos.length && `⚠️ ${bajos.length} ${bajos.length === 1 ? "producto con stock ≤3" : "productos con stock ≤3"}`, listas.length && `🔧 ${listas.length} ${listas.length === 1 ? "reparación lista" : "reparaciones listas"}`, `👥 ${enLinea} en la tienda ahora`].filter(Boolean);
    const botones: Boton[] = [porVerificar.length && { id: "c:pagos", t: "Pagos por verificar" }, devPend.length && { id: "c:devoluciones", t: "Devoluciones" }, bajos.length && { id: "c:stockbajo", t: "Stock bajo" }, { id: "c:ventas", t: "Ventas de hoy" }].filter(Boolean) as Boton[];
    return [msgBot(`📊 Resumen\nHoy: ${qz(hoyV.reduce((s, p) => s + p.total, 0))} (${hoyV.length} ${hoyV.length === 1 ? "pedido" : "pedidos"})\n7 días: ${qz(vend.reduce((s, p) => s + p.total, 0))}\n\nPendiente:\n${lineas.join("\n")}`, botones)];
  }
  if (foco === "pedidos") {
    const atender = t.pedidos.filter((p) => ["pago-pendiente", "pagado", "preparando", "en-camino"].includes(p.estado));
    const n = (e: EstadoPedido) => atender.filter((p) => p.estado === e).length;
    const viejo = [...atender].sort((a, b) => +new Date(a.fecha) - +new Date(b.fecha))[0];
    const horas = viejo ? Math.max(0, Math.round((Date.now() - +new Date(viejo.fecha)) / 3600000)) : 0;
    return [msgBot(`🧾 Pedidos por atender: ${atender.length}\n• Pago por verificar: ${n("pago-pendiente")}\n• Pagados, sin preparar: ${n("pagado")}\n• En preparación: ${n("preparando")}\n• Con el transporte: ${n("en-camino")}${viejo ? `\n⏱️ Más antiguo: ${viejo.id} (hace ${horas} h)` : ""}`, [{ id: "c:pedidos", t: "Ver pedidos" }, { id: "c:pagos", t: "Pagos por verificar" }, { id: "c:ventas", t: "Ventas de hoy" }])];
  }
  if (foco === "pagos") {
    if (!porVerificar.length) return [msgBot(`✅ Sin pagos por verificar\nCobrado con tarjeta hoy: ${qz(hoyV.filter((p) => p.metodo === "tarjeta").reduce((s, p) => s + p.total, 0))}`, [{ id: "c:pedidos", t: "Ver pedidos" }])];
    return [msgBot(`🧾 Pagos por verificar: ${porVerificar.length} (${qz(porVerificar.reduce((s, p) => s + p.total, 0))})`), ...porVerificar.map((p) => msgBot(`${p.id} · ${p.cliente} · ${qz(p.total)}\nTransferencia con comprobante`, [{ id: `do:pago:${p.id}`, t: "Confirmar pago" }, { id: `do:rechazar:${p.id}`, t: "Rechazar" }]))];
  }
  if (foco === "tienda") {
    const dem = getDemanda();
    const top = Object.entries(dem).flatMap(([id, n]) => { const p = t.productos.find((x) => x.id === id); return p ? [{ p, n }] : []; }).sort((a, b) => b.n - a.n).slice(0, 3);
    const critico = top.find((x) => unidades(x.p.id) <= 5);
    const ocultos = t.productos.filter((p) => p.visible === false).length;
    const botones: Boton[] = [critico && { id: `do:stockmas:${critico.p.nombre}`, t: `Agregar 5 · ${corto(critico.p.nombre)}` }, { id: "c:subir", t: "Subir producto" }, { id: "c:stockbajo", t: "Stock bajo" }].filter(Boolean) as Boton[];
    return [msgBot(`📦 Tienda\n👥 ${enLinea} clientes en línea\n👀 Lo que más piden esta semana:\n${top.map((x) => `• ${x.p.nombre}: ${x.n} consultas · ${unidades(x.p.id)} uds`).join("\n")}${bajos.length ? `\n⚠️ Stock ≤3: ${bajos.slice(0, 3).map((p) => `${corto(p.nombre)} (${unidades(p.id)})`).join(", ")}` : ""}${ocultos ? `\n🔒 Ocultos: ${ocultos}` : ""}${critico ? `\n💡 Conviene más stock de ${critico.p.nombre}: lo piden y quedan ${unidades(critico.p.id)}.` : ""}`, botones)];
  }
  if (foco === "taller") {
    const curso = t.reparaciones.filter((r) => r.estado !== "entregado");
    const sinTec = curso.filter((r) => !r.tecnico).length;
    const carga = t.tecnicos.map((x) => ({ x, n: curso.filter((r) => r.tecnico === x.id).length })).sort((a, b) => b.n - a.n)[0];
    const l = listas[0];
    return [msgBot(`🔧 Taller\nEn curso: ${curso.length} | Listas: ${listas.length} | Sin técnico: ${sinTec}${l ? `\n✅ Para entregar: ${l.id} · ${l.cliente} (${l.modelo})` : ""}${carga && carga.n ? `\n👷 Más carga: ${carga.x.nombre} (${carga.n})` : ""}`, [l && { id: `do:rep:${l.id}:entregado`, t: `Entregar ${l.id}` }, { id: "c:reparaciones", t: "Ver reparaciones" }].filter(Boolean) as Boton[])];
  }
  if (foco === "tecnicos") {
    const curso = t.reparaciones.filter((r) => r.estado !== "entregado");
    return [msgBot(`👷 Técnicos: ${t.tecnicos.filter((x) => x.activo).length} de ${t.tecnicos.length} disponibles\n${t.tecnicos.map((x) => `• ${x.nombre}: ${curso.filter((r) => r.tecnico === x.id).length} equipos${x.activo ? "" : " (no disponible)"}`).join("\n")}`, [{ id: "c:reparaciones", t: "Ver reparaciones" }])];
  }
  /* devoluciones */
  const mes = t.devoluciones.filter((d) => Date.now() - +new Date(d.fecha) < 30 * 86400000);
  const motivos = mes.reduce<Record<string, number>>((m, d) => ({ ...m, [d.motivo]: (m[d.motivo] ?? 0) + 1 }), {});
  const top = Object.entries(motivos).sort((a, b) => b[1] - a[1])[0];
  const nombreDe = (d: (typeof devPend)[number]) => { const p = t.pedidos.find((x) => x.id === d.pedido); return p ? `${p.lineas.map((l) => l.nombre).join(", ")} (${qz(p.total)})` : d.pedido; };
  if (!devPend.length) return [msgBot(`✅ Sin devoluciones por revisar\nÚltimos 30 días: ${mes.length}${top ? ` · motivo más repetido: ${top[0]}` : ""}`)];
  return [
    msgBot(`↩️ ${devPend.length} ${devPend.length === 1 ? "cliente quiere devolver" : "clientes quieren devolver"}:\n${devPend.map((d) => `• ${nombreDe(d)}\n  Motivo: ${d.motivo}`).join("\n")}\n\nÚltimos 30 días: ${mes.length}${top ? ` · más repetido: ${top[0]}` : ""}`),
    ...devPend.slice(0, 2).map((d) => msgBot(`${d.id} · pedido ${d.pedido}\n“${d.detalle || d.motivo}”`, [{ id: `do:dev:${d.id}:ok`, t: "Aprobar" }, { id: `do:dev:${d.id}:no`, t: "No procede" }])),
  ];
}

export function Asistente({ t, alto = "h-[min(36rem,68vh)]", raiz = "" }: { t: Tienda; alto?: string; raiz?: string }) {
  const msgs = useChat();
  const autorizados = useAutorizados();
  const personaId = usePersonaId();
  useEnLinea();
  const orden = useComando();
  const persona = personaActual();
  const esEquipo = persona.rol === "DUENO" || persona.rol === "ENCARGADO";
  const unidades = (id: string) => Object.values(t.stock[id] ?? {}).reduce((s, n) => s + n, 0);
  const [texto, setTexto] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const archivo = useRef<HTMLInputElement>(null);

  useEffect(() => { setChatVisible(true); return () => setChatVisible(false); }, []);
  useEffect(() => { iniciarChat(t); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { const c = caja.current; if (c) c.scrollTo({ top: c.scrollHeight, behavior: "smooth" }); }, [msgs]);

  const origen: Origen = persona.rol === "DUENO" ? "Dueño por WhatsApp" : persona.rol === "CLIENTE" ? "Cliente por WhatsApp" : "Equipo por WhatsApp";
  /* todo lo que se pide por WhatsApp queda en el registro; si la regla está activa, el cliente recibe su aviso */
  const hizo = (area: Area, texto: string, aviso?: string) => { registrar(area, origen, `${persona.rol === "DUENO" ? "" : `${persona.nombre}: `}${texto}`); if (aviso && getReglas().avisarClienteEstado) registrar(area, "Bot automático", `Aviso al cliente: ${aviso}`); };
  const avisoCliente = () => (getReglas().avisarClienteEstado ? "📲 Cliente avisado." : "🔎 El cliente lo ve en su rastreo.");

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
  const detalleStock = (p: Producto) => `📦 ${p.nombre}: ${SUCURSALES.map((s) => `${t.stock[p.id]?.[s.id] ?? 0} ${(t.stock[p.id]?.[s.id] ?? 0) === 1 ? "ud" : "uds"} en ${s.nombre}`).join(" | ")}${p.visible === false ? "\n🔒 Oculto en la tienda" : ""}`;
  const sumarStock = (p: Producto, suc: string, k: number) => {
    t.setStock((s) => ({ ...s, [p.id]: { z10: 0, mix: 0, xela: 0, ...(s[p.id] ?? {}), [suc]: Math.max(0, (s[p.id]?.[suc] ?? 0) + k) } }));
    const nuevo = Math.max(0, unidades(p.id) + k);
    const reaparece = k > 0 && p.visible === false;
    if (reaparece) t.setProductos((ps) => ps.map((x) => (x.id === p.id ? { ...x, visible: true } : x)));
    return { nuevo, reaparece };
  };

  /* pasos para publicar un producto: fotos, nombre y precio, unidades */
  const avanzar = (b: Borrador): Msg[] => {
    setBorrador(b);
    if (!b.fotos.length) return [msgBot("📸 Paso 1/3 · Envíe las fotos del producto (clip).")];
    if (!b.nombre || !b.precio) return [msgBot(`✅ ${b.fotos.length} ${b.fotos.length === 1 ? "foto recibida" : "fotos recibidas"}\n🏷️ Paso 2/3 · Nombre y precio\nEj: ${EJEMPLO_PRODUCTO.replace(" 2 unidades", "")}`)];
    if (b.unidades === undefined) return [msgBot(`${b.nombre} · ${qz(b.precio)}\n📦 Paso 3/3 · Unidades en stock\nEj: 2`)];
    return [msgBot(`Publicar:\n• ${b.nombre}${b.capacidad ? ` ${b.capacidad}` : ""} · ${b.condicion}\n• ${qz(b.precio)} tarjeta | ${qz(efectivo(b.precio))} efectivo\n• ${b.unidades} ${b.unidades === 1 ? "ud" : "uds"} en ${sucursalPor(b.sucursal).nombre}\n• ${b.fotos.length} ${b.fotos.length === 1 ? "foto" : "fotos"}`, [{ id: "do:publicar", t: "Publicar" }, { id: "do:descartar", t: "Descartar" }])];
  };

  const respuestaCliente = (entrada: string): Msg[] => {
    const n = /^c:/.test(entrada) ? entrada.slice(2) : norm(entrada);
    const cp = codigo(entrada, "or");
    if (cp) {
      const p = t.pedidos.find((x) => x.id === cp);
      registrar("Ventas", "Cliente por WhatsApp", `Consultó el pedido ${cp}`);
      if (!p) return [msgBot(`⛔ ${cp} no existe.\nRevise el número de orden.`)];
      return [msgBot(`🚚 ${p.id}\nEstado: ${ESTADOS_PEDIDO[p.estado].texto}\n${p.guia ? `Guía: ${p.guia}\n` : ""}Total: ${qz(p.total)}`)];
    }
    if (/^(menu|hola|buenas|ayuda|inicio)/.test(n)) return [msgBot("📋 Menú de cliente", MENU_CLIENTE)];
    if (/^rastrear/.test(n)) return [msgBot("🔎 Envíe su número de orden.\nEj: OR-1041")];
    if (/^garantia/.test(n)) return [msgBot("🛡️ Garantía\n• Nuevos: 1 año\n• Seminuevos: 6 meses\nPresente su factura.")];
    if (/^(asesor|hablar)/.test(n)) { registrar("General", "Cliente por WhatsApp", "Pidió hablar con un asesor"); return [msgBot("👤 Solicitud enviada\nUn asesor responde en horario de tienda.")]; }
    return [msgBot("⛔ Comando no disponible.", MENU_CLIENTE)];
  };

  const responder = (entrada: string): Msg[] => {
    if (persona.rol !== "CLIENTE" && !persona.activo) { registrar("General", "Equipo por WhatsApp", `Mensaje bloqueado de ${persona.nombre}: número sin autorización`); return [msgBot("⛔ Número no autorizado.")]; }
    if (persona.rol === "CLIENTE") return respuestaCliente(entrada);
    const id = /^(do:|c:)/.test(entrada) || entrada === "no" ? entrada : "";
    const n = id.startsWith("c:") ? id.slice(2).replace(":", " ") : norm(entrada);

    /* el técnico solo ve el taller */
    const esTaller = /^(menu|hola|ayuda|inicio|reparaciones|rep\b|reparacion)/.test(n) || id.startsWith("do:rep:");
    if (persona.rol === "TECNICO" && !esTaller) return [msgBot("⛔ Acceso denegado.\nSu número solo tiene permisos de Taller.")];
    /* el encargado no ve ventas ni cambia precios */
    if (persona.rol === "ENCARGADO" && (/^(ventas|resumen|precio)/.test(n) || id.startsWith("do:precio:"))) return [msgBot("⛔ Acceso denegado.\nSolo el dueño ve ventas y cambia precios.")];

    if (id === "no") return [msgBot("↩️ Cancelado. Sin cambios.")];
    if (id === "do:descartar") { setBorrador(null); return [msgBot("↩️ Descartado. No se publicó nada.")]; }
    if (id === "do:publicar") {
      const b = getBorrador();
      if (!b?.nombre || !b.precio || !b.fotos.length) return [msgBot("⛔ No hay producto por publicar.\nEscriba *subir* para empezar.")];
      const pid = `p${Date.now()}`, u = b.unidades ?? 1;
      const p: Producto = { id: pid, nombre: b.nombre, marca: marcaDe(b.nombre), categoria: categoriaDe(b.nombre), condicion: b.condicion, foto: b.fotos[0], fotos: b.fotos, colores: [{ nombre: "Único", hex: "#999999" }], variantes: [{ capacidad: b.capacidad, precio: b.precio }], resumen: b.condicion === "Nuevo" ? "Nuevo, sellado, con factura y garantía." : "Seminuevo revisado, con factura y garantía.", detalles: [], garantia: b.condicion === "Nuevo" ? "1 año con nosotros" : "6 meses con nosotros", origen: "Publicado desde WhatsApp", visible: true };
      t.setProductos((ps) => [{ ...p, visible: true }, ...ps]);
      t.setStock((s) => ({ ...s, [pid]: { z10: 0, mix: 0, xela: 0, [b.sucursal]: u } }));
      setBorrador(null);
      hizo("Tienda", `Publicó ${b.nombre} con ${b.fotos.length} ${b.fotos.length === 1 ? "foto" : "fotos"} y ${u} ${u === 1 ? "unidad" : "unidades"}`);
      return [msgBot(`✅ Publicado\n${b.nombre}\n${u} ${u === 1 ? "ud" : "uds"} · ${b.fotos.length} ${b.fotos.length === 1 ? "foto" : "fotos"}\n🛒 Ya está en la tienda.\nLe aviso si alguien lo mira o lo compra.`)];
    }
    if (id.startsWith("do:")) {
      const [, que, ref, extra] = id.split(":");
      if (que === "pago" || que === "rechazar") {
        const p = t.pedidos.find((x) => x.id === ref);
        if (!p || p.estado !== "pago-pendiente") return [msgBot(`⛔ ${ref} ya no tiene pago por verificar.`)];
        if (que === "pago") { confirmarPago(p); hizo("Ventas", `Confirmó el pago de ${p.id} (${qz(p.total)})`, `pago de ${p.id} recibido`); return [msgBot(`✅ Pago confirmado\n${p.id} → Pagado\n📦 Stock descontado\n${avisoCliente()}`, [{ id: `do:mover:${p.id}:preparando`, t: "Pasar a preparación" }])]; }
        t.setPedidos((ps) => ps.map((x) => (x.id === p.id ? { ...x, estado: "rechazado", motivoRechazo: "Comprobante no coincide con el depósito", nuevo: false } : x)));
        hizo("Ventas", `Rechazó el pago de ${p.id}`, `pago de ${p.id} no coincide con el depósito`);
        return [msgBot(`⛔ Pago rechazado\n${p.id}. No se cobró nada.`)];
      }
      if (que === "mover") {
        const p = t.pedidos.find((x) => x.id === ref);
        if (!p) return [msgBot("⛔ Pedido no encontrado.")];
        const guia = `GT-${String(Date.now()).slice(-6)}`;
        moverPedido(p, extra as EstadoPedido, guia);
        if (extra === "preparando") { hizo("Ventas", `Pasó ${p.id} a preparación`, `${p.id} en preparación`); return [msgBot(`📦 ${p.id} en preparación\n${avisoCliente()}`, [{ id: `do:mover:${p.id}:en-camino`, t: "Entregar al transporte" }])]; }
        if (extra === "en-camino") { hizo("Ventas", `Entregó ${p.id} al transporte (guía ${p.guia ?? guia})`, `${p.id} va en camino, guía ${p.guia ?? guia}`); return [msgBot(`🚚 ${p.id} con Forza\nGuía: ${p.guia ?? guia}\n${avisoCliente()}`, [{ id: `do:mover:${p.id}:entregado`, t: "Marcar entregado" }])]; }
        hizo("Ventas", `Marcó ${p.id} como entregado`, `${p.id} entregado`);
        return [msgBot(`✅ ${p.id} entregado\nPedido cerrado.`)];
      }
      if (que === "rep") { hizo("Taller", `Pasó ${ref} a “${TEXTO_REPARACION[extra as Reparacion["estado"]]}”`, extra === "listo" && getReglas().avisarReparacionLista ? `${ref} lista para recoger` : undefined); t.setReparaciones((rs) => rs.map((r) => (r.id === ref ? { ...r, estado: extra as Reparacion["estado"], nueva: false } : r))); return [msgBot(`🔧 ${ref} → ${TEXTO_REPARACION[extra as Reparacion["estado"]]}${extra === "listo" && getReglas().avisarReparacionLista ? "\n📲 Cliente avisado." : ""}`)]; }
      if (que === "precio") { const monto = Number(extra); t.setProductos((ps) => ps.map((p) => (p.id === ref ? { ...p, variantes: p.variantes.map((v, i) => (i === 0 ? { ...v, precio: monto } : v)) } : p))); const p = t.productos.find((x) => x.id === ref); hizo("Tienda", `Cambió el precio de ${p?.nombre} a ${qz(monto)}`); return [msgBot(`✅ Precio actualizado\n${p?.nombre}: ${qz(monto)}`)]; }
      if (que === "ocultar") { const p = t.productos.find((x) => x.nombre === ref); if (p) t.setProductos((ps) => ps.map((x) => (x.id === p.id ? { ...x, visible: false } : x))); hizo("Tienda", `Ocultó ${ref} de la tienda`); return [msgBot(`🔒 ${ref} oculto de la tienda`)]; }
      if (que === "stockmas") {
        const p = t.productos.find((x) => x.nombre === ref);
        if (!p) return [msgBot("⛔ Producto no encontrado.")];
        const r = sumarStock(p, "z10", 5);
        hizo("Tienda", `Agregó 5 unidades de ${p.nombre} (Zona 10)`);
        return [msgBot(`✅ Stock actualizado\n${p.nombre}: ${r.nuevo} uds${r.reaparece ? "\n👁️ Visible otra vez en la tienda" : ""}`)];
      }
      if (que === "stock") {
        const [, , pid, suc, signo, cant] = id.split(":");
        const p = t.productos.find((x) => x.id === pid);
        if (!p) return [msgBot("⛔ Producto no encontrado.")];
        const r = sumarStock(p, suc, signo === "+" ? Number(cant) : -Number(cant));
        hizo("Tienda", `${signo === "+" ? "Agregó" : "Quitó"} ${cant} ${Number(cant) === 1 ? "unidad" : "unidades"} de ${p.nombre} (${sucursalPor(suc).nombre})`);
        return [msgBot(`✅ Stock actualizado\n${p.nombre}: ${r.nuevo} uds`)];
      }
      if (que === "dev") {
        const d = t.devoluciones.find((x) => x.id === ref);
        if (!d || d.estado !== "pendiente") return [msgBot(`⛔ ${ref} ya fue resuelta.`)];
        const ok = extra === "ok";
        t.setDevoluciones((ds) => ds.map((x) => (x.id === ref ? { ...x, estado: ok ? "aprobada" : "rechazada", nueva: false } : x)));
        if (ok) {
          const p = t.pedidos.find((x) => x.id === d.pedido);
          t.setPedidos((ps) => ps.map((x) => (x.id === d.pedido ? { ...x, estado: "devuelto" } : x)));
          if (p) t.setStock((s) => { const c = structuredClone(s); p.lineas.forEach((l) => { c[l.id] = c[l.id] ?? {}; c[l.id][p.sucursal] = (c[l.id][p.sucursal] ?? 0) + l.cantidad; }); return c; });
        }
        hizo("Postventa", `${ok ? "Aprobó" : "Rechazó"} la devolución ${ref}`, ok ? `devolución ${ref} aprobada` : `devolución ${ref} no procede`);
        return [msgBot(ok ? `✅ Devolución ${ref} aprobada\n${d.pedido} → Devuelto\n📦 Producto repuesto en inventario\n${avisoCliente()}` : `⛔ Devolución ${ref}: no procede\n${avisoCliente()}`)];
      }
    }

    if (/^(menu|hola|buenas|buen dia|buenos dias|buenas tardes|ayuda|inicio|opciones)/.test(n)) return persona.rol === "TECNICO" ? [msgBot("📋 Menú de taller\nreparaciones · rep [código] [estado]", [{ id: "c:reparaciones", t: "Reparaciones" }])] : [msgBot(MENU_TEXTO, MENU)];
    if (/^subir/.test(n)) { setBorrador({ fotos: [], condicion: "Nuevo", sucursal: "z10" }); return [msgBot("📸 Paso 1/3 · Envíe las fotos del producto (clip).\nPuede escribir el nombre y el precio junto con las fotos.")]; }
    if (/^stock\s*bajo/.test(n)) {
      const bajos = t.productos.filter((p) => unidades(p.id) <= 3);
      return [msgBot(bajos.length ? `⚠️ Stock bajo\n${bajos.map((p) => `• ${p.nombre}: ${unidades(p.id)} uds`).join("\n")}` : "✅ Sin productos con stock bajo.", bajos[0] ? [{ id: `do:stockmas:${bajos[0].nombre}`, t: `Agregar 5 · ${corto(bajos[0].nombre)}` }] : undefined)];
    }
    if (/^(ventas|resumen)/.test(n)) {
      const vend = t.pedidos.filter((p) => ["pagado", "preparando", "en-camino", "entregado"].includes(p.estado));
      const hoy = new Date().toDateString();
      const h = vend.filter((p) => new Date(p.fecha).toDateString() === hoy);
      const tot7 = vend.reduce((s, p) => s + p.total, 0);
      return [msgBot(`📊 Ventas de hoy: ${qz(h.reduce((s, p) => s + p.total, 0))} (${h.length})\n7 días: ${qz(tot7)} (${vend.length} pedidos)\nTicket: ${qz(vend.length ? Math.round(tot7 / vend.length) : 0)}\n🧾 Pagos por verificar: ${t.pedidos.filter((p) => p.estado === "pago-pendiente").length}`)];
    }
    if (/^pedidos/.test(n)) {
      const l = t.pedidos.filter((p) => ["pago-pendiente", "pagado", "preparando", "en-camino"].includes(p.estado));
      if (!l.length) return [msgBot("✅ Sin pedidos por atender.")];
      return l.slice(0, 5).map((p) => {
        const sig = p.estado === "pago-pendiente" ? { id: `do:pago:${p.id}`, t: "Confirmar pago" } : p.estado === "pagado" ? { id: `do:mover:${p.id}:preparando`, t: "Pasar a preparación" } : p.estado === "preparando" ? { id: `do:mover:${p.id}:en-camino`, t: "Entregar al transporte" } : { id: `do:mover:${p.id}:entregado`, t: "Marcar entregado" };
        return msgBot(`${p.id} · ${p.cliente} · ${qz(p.total)}\n${p.estado === "pago-pendiente" ? "🧾 Pago por verificar" : p.estado === "pagado" ? "✅ Pagado, sin preparar" : p.estado === "preparando" ? "📦 En preparación" : "🚚 Con el transporte"}`, [sig]);
      });
    }
    if (/^pagos/.test(n)) return resumenDe(t, "pagos");
    if (/^devoluciones/.test(n)) return resumenDe(t, "devoluciones");
    if (/^reparaciones/.test(n)) {
      const l = t.reparaciones.filter((r) => r.estado !== "entregado");
      return [msgBot(l.length ? `🔧 En curso: ${l.length}\n${l.map((r) => `• ${r.id} · ${r.cliente} · ${r.modelo} · ${TEXTO_REPARACION[r.estado]}`).join("\n")}\n\nEj: rep ${l[0].id} listo` : "✅ Sin reparaciones en curso.")];
    }
    if (/^stock\b/.test(n)) {
      const q = n.replace(/^stock\s*/, "");
      if (!q) return [msgBot("Escriba *stock* y el nombre.\nEj: stock iphone air")];
      const r = buscarProductos(q).slice(0, 3);
      hizo("Tienda", `Consultó stock de ${q}`);
      if (!r.length) return [msgBot(`⛔ Sin resultados para “${q}”.`)];
      return [msgBot(r.map(({ p }) => detalleStock(p)).join("\n"))];
    }
    const mov = n.match(/^(agregar|sumar|aumentar|quitar|restar|sacar)\s+(\d+)\s+(.+)$/);
    if (mov) {
      let resto = mov[3], suc = "z10";
      for (const [re, sid] of SUC_ID) if (re.test(resto)) { suc = sid; resto = resto.replace(/\b(en|a|de)?\s*(zona\s*10|z10|mixco|xela|quetzaltenango)\b/, " ").trim(); }
      const r = buscarProductos(resto);
      if (!r.length) return [msgBot(`⛔ Sin resultados para “${resto}”.`)];
      const p = r[0].p, suma = /^(agregar|sumar|aumentar)/.test(mov[1]), k = Number(mov[2]);
      if (!suma) return [msgBot(`¿Quitar ${k} ${k === 1 ? "ud" : "uds"} de ${p.nombre} en ${sucursalPor(suc).nombre}?`, [{ id: `do:stock:${p.id}:${suc}:-:${k}`, t: "Confirmar" }, { id: "no", t: "Cancelar" }])];
      const res = sumarStock(p, suc, k);
      hizo("Tienda", `Agregó ${k} ${k === 1 ? "unidad" : "unidades"} de ${p.nombre} (${sucursalPor(suc).nombre})`);
      return [msgBot(`✅ Stock actualizado\n${p.nombre}: ${res.nuevo} uds${res.reaparece ? "\n👁️ Visible otra vez en la tienda" : ""}`)];
    }
    const cp = codigo(n, "or");
    if (cp && /^(pago|confirmar|rechazar)/.test(n)) {
      const p = t.pedidos.find((x) => x.id === cp);
      if (!p) return [msgBot(`⛔ ${cp} no existe.`)];
      if (p.estado !== "pago-pendiente") return [msgBot(`⛔ ${p.id} no tiene pago por verificar.`)];
      return [msgBot(`¿Confirmar ${qz(p.total)} de ${p.id} (${p.cliente})?\n📦 Se descuenta el stock.`, [{ id: `do:pago:${p.id}`, t: "Confirmar" }, { id: "no", t: "Cancelar" }])];
    }
    const paso = n.match(/^(preparar|enviar|transporte|entregado|entregar)\s/);
    if (paso && cp) {
      const p = t.pedidos.find((x) => x.id === cp), k = PASO_PEDIDO[paso[1]];
      if (!p) return [msgBot(`⛔ ${cp} no existe.`)];
      if (p.estado !== k.de) return [msgBot(`⛔ ${p.id} está en “${ESTADOS_PEDIDO[p.estado].texto}”.\nNo aplica esa acción.`)];
      return [msgBot(`¿${k.v} ${p.id} (${p.cliente})?`, [{ id: `do:mover:${p.id}:${k.a}`, t: k.v }, { id: "no", t: "Cancelar" }])];
    }
    const cr = codigo(n, "rp");
    if (cr && /^(rep|reparacion)/.test(n)) {
      const r = t.reparaciones.find((x) => x.id === cr);
      const est = Object.keys(ESTADO_REP).find((e) => n.includes(e));
      if (!r) return [msgBot(`⛔ ${cr} no existe.`)];
      if (!est) return [msgBot(`🔧 ${r.id}: ${TEXTO_REPARACION[r.estado]}\nPara cambiar: rep ${r.id} listo`)];
      return [msgBot(`¿Pasar ${r.id} (${r.cliente}, ${r.modelo}) a “${TEXTO_REPARACION[ESTADO_REP[est]]}”?`, [{ id: `do:rep:${r.id}:${ESTADO_REP[est]}`, t: "Confirmar" }, { id: "no", t: "Cancelar" }])];
    }
    const pr = n.match(/^precio\s+(.+?)\s+q?\s*(\d[\d,.]*)$/);
    if (pr) {
      const hallados = buscarProductos(pr[1]);
      const monto = Number(pr[2].replace(/[,.]/g, ""));
      if (!hallados.length) return [msgBot(`⛔ Sin resultados para “${pr[1]}”.`)];
      const p = hallados[0].p;
      return [msgBot(`¿Cambiar el precio de ${p.nombre}?\n${qz(p.variantes[0].precio)} → ${qz(monto)}`, [{ id: `do:precio:${p.id}:${monto}`, t: "Confirmar" }, { id: "no", t: "Cancelar" }])];
    }
    const b = getBorrador();
    if (b) {
      if (/^\d{1,3}$/.test(entrada.trim()) && b.nombre && b.precio && b.unidades === undefined) return avanzar({ ...b, unidades: Number(entrada.trim()) });
      return avanzar(leerDatos(entrada, b));
    }
    return [msgBot("⛔ Comando no reconocido.\nEscriba *menú*.", MENU)];
  };

  const enviar = (entrada: string, etiqueta?: string, marcar?: number) => {
    if (!entrada.trim()) return;
    if (marcar !== undefined) chatMarcarUsada(marcar);
    chatAgregar({ de: "yo", texto: etiqueta ?? entrada.trim(), hora: horaAhora() }, ...responder(entrada.trim()));
    setTexto("");
  };
  const tocar = (b: Boton, i: number) => {
    if (b.id === "c:stock") return enviar("stock", b.t, i);
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
  /* al cambiar quién escribe, el bot saluda con el menú de esa persona */
  const previa = useRef(personaId);
  useEffect(() => {
    if (previa.current === personaId) return;
    previa.current = personaId;
    chatAgregar(...responder("menu"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaId]);
  const cambiarPersona = (id: number) => setPersona(id);
  /* una orden que el dueño le pidió al bot desde el panel: se ejecuta como si la escribiera por WhatsApp */
  useEffect(() => {
    if (orden.n === ordenProcesada) return;
    ordenProcesada = orden.n;
    if (persona.rol === "DUENO") enviar(orden.texto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orden.n]);

  const ejemplos = persona.rol === "CLIENTE" ? ["menú", "OR-1041", "garantía"] : persona.rol === "TECNICO" ? ["menú", "reparaciones", "rep RP-512 listo", "ventas"] : ["menú", "stock iphone", "agregar 2 iphone air", "devoluciones", "ventas"];
  return (
    <div className={`flex w-full flex-col overflow-hidden rounded-md border bg-[#efeae2] ${raiz}`} style={{ borderColor: "#dde0e6" }}>
      <header className="flex flex-wrap items-center gap-3 px-4 py-3 text-white" style={{ background: "#075e54" }}>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[1.05rem] font-extrabold text-[#14101f]">Ó</span>
        <span className="min-w-0 flex-1 leading-tight"><b className="block">Bot de Órbita</b><span className="text-[0.78rem] opacity-80">cuenta de empresa · en línea</span></span>
        <label className="flex items-center gap-1.5 text-[0.78rem]"><span className="opacity-80">Escribe:</span>
          <select aria-label="Quién escribe" value={personaId} onChange={(e) => cambiarPersona(Number(e.target.value))} className="max-w-[10rem] rounded bg-white/15 px-1.5 py-1 text-[0.82rem] text-white outline-none [&>option]:text-black">
            {autorizados.map((p) => <option key={p.id} value={p.id}>{p.nombre.split(" ")[0]} · {p.rol === "DUENO" ? "Dueño" : p.rol === "ENCARGADO" ? "Encargado" : "Técnico"}</option>)}
            <option value={CLIENTE.id}>Cliente (sin autorizar)</option>
          </select>
        </label>
      </header>
      <div ref={caja} className={`${alto} overflow-y-auto px-3 py-3 sm:px-5`}>
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
        {esEquipo && <button type="button" disabled={ocupado} onClick={fotosEjemplo} className="rounded-full px-3 py-1 text-[0.8rem] font-bold text-white transition hover:brightness-110 disabled:opacity-50" style={{ background: "#128c7e" }}>Adjuntar 3 fotos de ejemplo</button>}
        {ejemplos.map((e) => <button key={e} type="button" onClick={() => enviar(e)} className="rounded-full bg-white px-2.5 py-1 text-[0.8rem] font-semibold shadow-sm transition hover:bg-[#f0f9ff]" style={{ color: MUTED }}>{e}</button>)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); enviar(texto); }} className="flex items-center gap-2 bg-[#f0f2f5] px-3 pb-3 pt-1">
        <input ref={archivo} type="file" accept="image/*" multiple className="sr-only" onChange={alElegir} />
        {esEquipo && <button type="button" aria-label="Adjuntar fotos" disabled={ocupado} onClick={() => archivo.current?.click()} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#54656f] transition hover:bg-black/5 disabled:opacity-50"><Paperclip size={21} /></button>}
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
    const quedan = total - 1;
    avisoPedido(pedido, quedan <= 0 ? [p.nombre] : [], quedan > 0 && quedan <= 3 ? [{ nombre: p.nombre, quedan }] : []);
  }, 1200);
  return p.nombre;
}
