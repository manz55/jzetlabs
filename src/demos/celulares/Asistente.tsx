/*
 * Asistente de WhatsApp de Órbita (simulación). Funciona con reglas programadas, sin inteligencia artificial:
 * avisa solo cuando pasa algo (con botones), y responde a comandos cortos y a un menú.
 * Todo lo que hace cambia los mismos datos que el panel: pedidos, existencias, precios y reparaciones.
 * En la tienda real el mismo código recibe los mensajes de la API oficial de WhatsApp Business.
 */
import { useEffect, useRef, useState } from "react";
import { Check, Send } from "lucide-react";
import { qz } from "../comun";
import { TINTA, SUCURSALES, TEXTO_REPARACION, sucursalPor, type EstadoPedido, type Pedido, type Reparacion, type Tienda } from "./datos";

const MUTED = "#5b6270";
type Boton = { id: string; t: string };
type Msg = { de: "bot" | "yo"; texto: string; botones?: Boton[]; hora: string; usada?: boolean };

const hora = () => new Date().toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false });
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
const codigo = (s: string, pre: string) => { const m = s.match(new RegExp(`${pre}-?(\\d+)`, "i")); return m ? `${pre.toUpperCase()}-${m[1]}` : null; };
const bot = (texto: string, botones?: Boton[]): Msg => ({ de: "bot", texto, botones, hora: hora() });
const MENU: Boton[] = [{ id: "c:ventas", t: "Ventas de hoy" }, { id: "c:pedidos", t: "Pedidos por atender" }, { id: "c:pagos", t: "Pagos por verificar" }, { id: "c:reparaciones", t: "Reparaciones" }, { id: "c:stock", t: "Consultar stock" }];
const ESTADO_REP: Record<string, Reparacion["estado"]> = { recibido: "recibido", diagnostico: "diagnostico", reparando: "reparando", listo: "listo", entregado: "entregado", entregada: "entregado" };
const PASO_PEDIDO: Record<string, { de: EstadoPedido; a: EstadoPedido; v: string }> = { preparar: { de: "pagado", a: "preparando", v: "Preparar" }, enviar: { de: "preparando", a: "en-camino", v: "Enviar" }, entregado: { de: "en-camino", a: "entregado", v: "Marcar entregado" }, entregar: { de: "en-camino", a: "entregado", v: "Marcar entregado" } };

export function Asistente({ t }: { t: Tienda }) {
  const unidades = (id: string) => Object.values(t.stock[id] ?? {}).reduce((s, n) => s + n, 0);
  const inicial = (): Msg[] => {
    const m: Msg[] = [];
    t.pedidos.filter((p) => p.estado === "pago-pendiente").forEach((p) => m.push(bot(`Transferencia con comprobante.\nPedido ${p.id} · ${p.cliente} · ${qz(p.total)}.`, [{ id: `do:pago:${p.id}`, t: "Confirmar pago" }, { id: `do:rechazar:${p.id}`, t: "Rechazar" }])));
    t.reparaciones.filter((r) => r.estado === "listo").forEach((r) => m.push(bot(`Reparación lista.\n${r.id} · ${r.cliente} · ${r.modelo}.`, [{ id: `do:rep:${r.id}:entregado`, t: "Marcar entregada" }])));
    const bajos = t.productos.filter((p) => unidades(p.id) <= 3);
    if (bajos.length) m.push(bot(`Poco stock: ${bajos.slice(0, 3).map((p) => `${p.nombre} (${unidades(p.id)})`).join(", ")}.`, [{ id: "c:stock", t: "Consultar stock" }]));
    m.push(bot("Escriba *menú* o toque una opción.", MENU.slice(0, 3)));
    return m;
  };
  const [msgs, setMsgs] = useState<Msg[]>(inicial);
  const [texto, setTexto] = useState("");
  const fin = useRef<HTMLDivElement>(null);
  useEffect(() => { fin.current?.parentElement?.scrollTo({ top: fin.current.offsetTop, behavior: "smooth" }); }, [msgs]);

  /* acciones que cambian los datos del panel */
  const moverPedido = (p: Pedido, a: EstadoPedido) => t.setPedidos((ps) => ps.map((x) => (x.id === p.id ? { ...x, estado: a, guia: a === "en-camino" && !x.guia ? `GT-${String(Date.now()).slice(-6)}` : x.guia, nuevo: false } : x)));
  const confirmarPago = (p: Pedido) => {
    moverPedido(p, "pagado");
    t.setStock((s) => { const n = structuredClone(s); p.lineas.forEach((l) => { const suc = Object.keys(n[l.id] ?? {}).find((k) => n[l.id][k] > 0); if (suc) n[l.id][suc] = Math.max(0, n[l.id][suc] - l.cantidad); }); return n; });
  };

  const buscarProductos = (q: string) => {
    const palabras = norm(q).split(" ").filter((w) => w.length > 1);
    const todos = t.productos
      .map((p) => { const nombre = norm(`${p.marca} ${p.nombre}`); return { p, n: palabras.filter((w) => nombre.includes(w)).length }; })
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n || a.p.nombre.length - b.p.nombre.length);
    return todos.filter((x) => x.n === (todos[0]?.n ?? 0));
  };

  /* un botón o un comando devuelve lo que responde el asistente */
  const responder = (entrada: string): Msg[] => {
    const id = entrada.startsWith("do:") || entrada.startsWith("c:") || entrada === "no" ? entrada : "";
    if (id === "no") return [bot("Cancelado. No se hizo ningún cambio.")];
    if (id.startsWith("do:")) {
      const [, que, ref, extra] = id.split(":");
      if (que === "pago" || que === "rechazar") {
        const p = t.pedidos.find((x) => x.id === ref);
        if (!p || p.estado !== "pago-pendiente") return [bot(`El pedido ${ref} ya no tiene un pago por verificar.`)];
        if (que === "pago") { confirmarPago(p); return [bot(`Pago confirmado.\n${p.id} pasó a Pagado y se descontó el stock. El cliente ya lo ve en su rastreo.`, [{ id: `c:paso:preparar:${p.id}`, t: "Preparar ahora" }])]; }
        t.setPedidos((ps) => ps.map((x) => (x.id === p.id ? { ...x, estado: "rechazado", motivoRechazo: "Comprobante no coincide con el depósito", nuevo: false } : x)));
        return [bot(`Pago rechazado.\n${p.id} quedó como rechazado. No se cobró nada.`)];
      }
      if (que === "mover") { const p = t.pedidos.find((x) => x.id === ref); if (!p) return [bot("No encontré ese pedido.")]; moverPedido(p, extra as EstadoPedido); return [bot(`Listo.\n${p.id} ahora está en: ${extra === "preparando" ? "Preparando" : extra === "en-camino" ? "En camino" : "Entregado"}.`)]; }
      if (que === "rep") { t.setReparaciones((rs) => rs.map((r) => (r.id === ref ? { ...r, estado: extra as Reparacion["estado"], nueva: false } : r))); return [bot(`Listo.\n${ref}: ${TEXTO_REPARACION[extra as Reparacion["estado"]]}.${extra === "listo" ? " Se avisó al cliente que puede recoger." : ""}`)]; }
      if (que === "precio") { const [pid, monto] = [ref, Number(extra)]; t.setProductos((ps) => ps.map((p) => (p.id === pid ? { ...p, variantes: p.variantes.map((v, i) => (i === 0 ? { ...v, precio: monto } : v)) } : p))); const p = t.productos.find((x) => x.id === pid); return [bot(`Precio actualizado.\n${p?.nombre}: ${qz(monto)}. Ya se ve en la tienda.`)]; }
    }
    const n = id.startsWith("c:") ? id.slice(2).replace(":", " ") : norm(entrada);

    if (/^(menu|hola|buenas|buen dia|buenos dias|buenas tardes|ayuda|inicio|opciones)/.test(n)) return [bot("Opciones disponibles:", MENU)];
    if (/^(ventas|resumen)/.test(n)) {
      const vend = t.pedidos.filter((p) => ["pagado", "preparando", "en-camino", "entregado"].includes(p.estado));
      const hoy = new Date().toDateString();
      const h = vend.filter((p) => new Date(p.fecha).toDateString() === hoy);
      const tot7 = vend.reduce((s, p) => s + p.total, 0);
      return [bot(`Ventas de hoy: ${qz(h.reduce((s, p) => s + p.total, 0))} (${h.length} ${h.length === 1 ? "pedido" : "pedidos"}).\nÚltimos 7 días: ${qz(tot7)} (${vend.length} pedidos, ticket ${qz(vend.length ? Math.round(tot7 / vend.length) : 0)}).\nPor verificar: ${t.pedidos.filter((p) => p.estado === "pago-pendiente").length}.`)];
    }
    if (/^pedidos/.test(n)) {
      const l = t.pedidos.filter((p) => ["pago-pendiente", "pagado", "preparando", "en-camino"].includes(p.estado));
      if (!l.length) return [bot("No hay pedidos por atender.")];
      return [bot(`Pedidos por atender (${l.length}):\n${l.map((p) => `${p.id} · ${p.cliente} · ${qz(p.total)} · ${p.estado === "pago-pendiente" ? "Verificando pago" : p.estado === "pagado" ? "Pagado" : p.estado === "preparando" ? "Preparando" : "En camino"}`).join("\n")}\n\nEscriba por ejemplo: preparar ${l[0].id}`)];
    }
    if (/^pagos/.test(n)) {
      const l = t.pedidos.filter((p) => p.estado === "pago-pendiente");
      if (!l.length) return [bot("No hay transferencias por verificar.")];
      return l.map((p) => bot(`Transferencia por verificar.\n${p.id} · ${p.cliente} · ${qz(p.total)}.`, [{ id: `c:pago:${p.id}`, t: "Confirmar pago" }, { id: `do:rechazar:${p.id}`, t: "Rechazar" }]));
    }
    if (/^reparaciones/.test(n)) {
      const l = t.reparaciones.filter((r) => r.estado !== "entregado");
      return [bot(l.length ? `Reparaciones en curso (${l.length}):\n${l.map((r) => `${r.id} · ${r.cliente} · ${r.modelo} · ${TEXTO_REPARACION[r.estado]}`).join("\n")}\n\nEscriba por ejemplo: rep ${l[0].id} listo` : "No hay reparaciones en curso.")];
    }
    if (/^stock\b/.test(n)) {
      const q = n.replace(/^stock\s*/, "");
      if (!q) return [bot("Escriba *stock* y el nombre. Ejemplo: stock s26")];
      const r = buscarProductos(q).slice(0, 3);
      if (!r.length) return [bot(`No encontré “${q}” en el inventario.`)];
      return [bot(r.map(({ p }) => `${p.nombre}: ${unidades(p.id)} en total\n${SUCURSALES.map((s) => `   ${s.nombre}: ${t.stock[p.id]?.[s.id] ?? 0}`).join("\n")}`).join("\n\n"))];
    }
    const cp = codigo(n, "or");
    if (cp && /^(pago|confirmar|rechazar)/.test(n) || (cp && n.startsWith("paso"))) {
      const p = t.pedidos.find((x) => x.id === cp);
      if (!p) return [bot(`No encontré el pedido ${cp}.`)];
      if (n.startsWith("paso")) { const k = PASO_PEDIDO[n.split(" ")[1]]; if (k && p.estado === k.de) return [bot(`¿${k.v} el pedido ${p.id} de ${p.cliente}?`, [{ id: `do:mover:${p.id}:${k.a}`, t: k.v }, { id: "no", t: "Cancelar" }])]; }
      if (p.estado !== "pago-pendiente") return [bot(`El pedido ${p.id} no tiene un pago por verificar (estado actual: ${p.estado}).`)];
      return [bot(`¿Confirmar el pago de ${qz(p.total)} del pedido ${p.id} (${p.cliente})? Se descuenta el stock.`, [{ id: `do:pago:${p.id}`, t: "Confirmar" }, { id: "no", t: "Cancelar" }])];
    }
    const paso = n.match(/^(preparar|enviar|entregado|entregar)\s/);
    if (paso && cp) {
      const p = t.pedidos.find((x) => x.id === cp), k = PASO_PEDIDO[paso[1]];
      if (!p) return [bot(`No encontré el pedido ${cp}.`)];
      if (p.estado !== k.de) return [bot(`El pedido ${p.id} está en “${p.estado}”; no se puede ${paso[1]} desde ahí.`)];
      return [bot(`¿${k.v} el pedido ${p.id} de ${p.cliente}?${p.entrega.tipo === "envio" ? "" : ` Recoge en ${sucursalPor(p.entrega.sucursal).nombre}.`}`, [{ id: `do:mover:${p.id}:${k.a}`, t: k.v }, { id: "no", t: "Cancelar" }])];
    }
    const cr = codigo(n, "rp");
    if (cr && /^(rep|reparacion)/.test(n)) {
      const r = t.reparaciones.find((x) => x.id === cr);
      const est = Object.keys(ESTADO_REP).find((e) => n.includes(e));
      if (!r) return [bot(`No encontré la reparación ${cr}.`)];
      if (!est) return [bot(`${r.id} está en: ${TEXTO_REPARACION[r.estado]}.\nPara cambiarla escriba: rep ${r.id} listo`)];
      return [bot(`¿Pasar ${r.id} (${r.cliente}, ${r.modelo}) a “${TEXTO_REPARACION[ESTADO_REP[est]]}”?${ESTADO_REP[est] === "listo" ? " Se avisa al cliente." : ""}`, [{ id: `do:rep:${r.id}:${ESTADO_REP[est]}`, t: "Confirmar" }, { id: "no", t: "Cancelar" }])];
    }
    const pr = n.match(/^precio\s+(.+?)\s+q?\s*(\d[\d,.]*)$/);
    if (pr) {
      const hallados = buscarProductos(pr[1]);
      const monto = Number(pr[2].replace(/[,.]/g, ""));
      if (!hallados.length) return [bot(`No encontré “${pr[1]}”.`)];
      const p = hallados[0].p;
      return [bot(`¿Cambiar el precio de ${p.nombre} de ${qz(p.variantes[0].precio)} a ${qz(monto)}?`, [{ id: `do:precio:${p.id}:${monto}`, t: "Confirmar" }, { id: "no", t: "Cancelar" }])];
    }
    return [bot("No reconocí ese mensaje. Escriba *menú* para ver las opciones.", MENU.slice(0, 3))];
  };

  const enviar = (entrada: string, etiqueta?: string, marcar?: number) => {
    if (!entrada.trim()) return;
    const mio: Msg = { de: "yo", texto: etiqueta ?? entrada.trim(), hora: hora() };
    const resp = responder(entrada.trim());
    setMsgs((m) => [...m.map((x, i) => (i === marcar ? { ...x, usada: true } : x)), mio, ...resp]);
    setTexto("");
  };
  /* los botones "c:" abren el comando equivalente */
  const tocar = (b: Boton, i: number) => {
    if (b.id === "c:stock") return enviar("stock", b.t, i);
    if (b.id.startsWith("c:pago:")) return enviar(`pago ${b.id.split(":")[2]}`, b.t, i);
    if (b.id.startsWith("c:paso:")) return enviar(`${b.id.split(":")[2]} ${b.id.split(":")[3]}`, b.t, i);
    enviar(b.id, b.t, i);
  };

  const ejemplos = ["menú", "ventas", "stock s26", "pago OR-1041", "rep RP-512 listo", "precio s26 7500"];
  return (
    <div className="mx-auto flex w-full max-w-[26rem] flex-col overflow-hidden rounded-[2rem] border-[6px] shadow-lg" style={{ borderColor: "#14101f", background: "#efeae2" }}>
      <header className="flex items-center gap-3 px-4 py-3 text-white" style={{ background: "#075e54" }}>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[1.05rem] font-extrabold" style={{ color: TINTA }}>Ó</span>
        <span className="leading-tight"><b className="block">Órbita · Asistente</b><span className="text-[0.78rem] opacity-80">cuenta de empresa · en línea</span></span>
      </header>
      <div className="h-[34rem] overflow-y-auto px-3 py-3">
        <div className="space-y-2">
          {msgs.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.de === "yo" ? "items-end" : "items-start"}`}>
              <div className="max-w-[88%] rounded-lg px-3 py-2 text-[0.92rem] leading-snug shadow-sm" style={{ background: m.de === "yo" ? "#d9fdd3" : "#fff" }}>
                <p className="whitespace-pre-line">{m.texto.split(/(\*[^*]+\*)/).map((x, k) => (x.startsWith("*") ? <b key={k}>{x.slice(1, -1)}</b> : x))}</p>
                <p className="mt-0.5 text-right text-[0.68rem]" style={{ color: MUTED }}>{m.hora}{m.de === "yo" && <Check size={11} className="ml-1 inline text-[#34b7f1]" />}</p>
              </div>
              {m.botones && (
                <div className="mt-1 grid w-[88%] gap-1">
                  {m.botones.map((b) => <button key={b.id} type="button" disabled={m.usada} onClick={() => tocar(b, i)} className="min-h-[2.6rem] rounded-lg bg-white px-3 text-center text-[0.92rem] font-semibold shadow-sm transition hover:bg-[#f0f9ff] disabled:opacity-45" style={{ color: "#027eb5" }}>{b.t}</button>)}
                </div>
              )}
            </div>
          ))}
          <div ref={fin} />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 px-3 pb-2" style={{ background: "#efeae2" }}>
        {ejemplos.map((e) => <button key={e} type="button" onClick={() => enviar(e)} className="rounded-full bg-white px-2.5 py-1 text-[0.78rem] font-semibold shadow-sm transition hover:bg-[#f0f9ff]" style={{ color: MUTED }}>{e}</button>)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); enviar(texto); }} className="flex items-center gap-2 px-3 pb-3" style={{ background: "#efeae2" }}>
        <input aria-label="Mensaje" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribir un mensaje" className="min-h-[2.8rem] min-w-0 flex-1 rounded-full bg-white px-4 text-[0.95rem] outline-none" />
        <button type="submit" aria-label="Enviar" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white transition hover:brightness-110" style={{ background: "#128c7e" }}><Send size={19} /></button>
      </form>
    </div>
  );
}

