/*
 * Panel del dueño de Órbita Celulares, pensado como un CRM: tablas densas, datos directos y acciones en la misma fila.
 * El dueño también puede pedirle todo esto por WhatsApp al asistente; el panel es la vista de consulta y control.
 * Lo que hace el cliente en la tienda (pedidos, pagos, reparaciones, devoluciones) aparece aquí.
 */
import { Fragment, useEffect, useMemo, useState } from "react";
import { BarChart3, Boxes, Camera, Check, CreditCard, Eye, EyeOff, LogOut, MessageCircle, Minus, Package, Plus, RotateCcw, Store, Undo2, Users, Wrench, X } from "lucide-react";
import { qz } from "../comun";
import { iniciarChat } from "./Asistente";
import { chatReiniciar, registrar, setDock, useRegistro } from "./bot";
import { DockBot, FranjaBot, PaginaBot } from "./BotCentro";
import { achicarFoto } from "./fotos";
import { BORDE, BTN, Buscar, Cifras, Estado, EstadoPed, EstadoRep, FONDO, Filtros, MUTED, Panel, ROJO, TD, TH, Titulo, borde, principal, ACCION_REP, textoEstadoPanel } from "./ui";
import {
  PRIMARIO, LETRA_SISTEMA, PASOS_REPARACION, SUCURSALES, TEXTO_REPARACION, TINTA,
  fechaCorta, sucursalPor,
  type EstadoPedido, type Pedido, type Producto, type Reparacion, type Tienda,
} from "./datos";

type Pestana = "resumen" | "asistente" | "pedidos" | "pagos" | "inventario" | "reparaciones" | "tecnicos" | "devoluciones";
const VENDIDO: EstadoPedido[] = ["pagado", "preparando", "en-camino", "entregado"];
const diaIso = (iso: string) => new Date(iso).toDateString();
const NOMBRE_PESTANA: Record<Pestana, string> = { resumen: "Resumen", asistente: "Bot de WhatsApp", pedidos: "Pedidos", pagos: "Pagos", inventario: "Productos", reparaciones: "Reparaciones", tecnicos: "Técnicos", devoluciones: "Devoluciones" };
const ESTADOS_ELEGIBLES: EstadoPedido[] = ["pago-pendiente", "pagado", "preparando", "en-camino", "entregado", "rechazado", "devuelto"];
const SIGUIENTE: Partial<Record<EstadoPedido, { a: EstadoPedido; texto: string }>> = {
  "pago-pendiente": { a: "pagado", texto: "Confirmar pago" },
  pagado: { a: "preparando", texto: "Pasar a preparación" },
  preparando: { a: "en-camino", texto: "Entregar al transporte" },
  "en-camino": { a: "entregado", texto: "Marcar entregado" },
};
function moverPedido(t: Tienda, p: Pedido, a: EstadoPedido) {
  registrar("Ventas", "Panel", `${p.id} pasó a ${textoEstadoPanel(a).toLowerCase()}`);
  t.setPedidos((ps) => ps.map((x) => (x.id === p.id ? { ...x, estado: a, guia: a === "en-camino" && !x.guia ? `GT-${String(Date.now()).slice(-6)}` : x.guia, nuevo: false } : x)));
}
const textoMetodo = (p: Pedido) => (p.metodo === "tarjeta" ? `Tarjeta ···${p.tarjeta}` : p.metodo === "transferencia" ? "Transferencia" : "Al recibir");

export function PanelDueno({ t, alSalir, alTienda }: { t: Tienda; alSalir: () => void; alTienda: () => void }) {
  const [pestana, setPestana] = useState<Pestana>("resumen");
  useEffect(() => { document.title = "Panel del dueño · Órbita Celulares · Demo de Jzet Labs"; }, []);
  const [v, setV] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { iniciarChat(t); }, [v]);

  const porVerificar = t.pedidos.filter((p) => p.estado === "pago-pendiente");
  const devPend = t.devoluciones.filter((d) => d.estado === "pendiente");
  const bajos = t.productos.filter((p) => Object.values(t.stock[p.id] ?? {}).reduce((s, n) => s + n, 0) <= 3);

  const grupos: { g: string; items: [Pestana, string, typeof BarChart3, number?][] }[] = [
    { g: "General", items: [["resumen", "Resumen", BarChart3], ["asistente", "Bot de WhatsApp", MessageCircle]] },
    { g: "Ventas", items: [["pedidos", "Pedidos", Package, t.pedidos.filter((p) => p.estado === "pagado").length], ["pagos", "Pagos", CreditCard, porVerificar.length]] },
    { g: "Tienda", items: [["inventario", "Productos", Boxes, bajos.length]] },
    { g: "Taller", items: [["reparaciones", "Reparaciones", Wrench, t.reparaciones.filter((r) => r.estado !== "entregado").length], ["tecnicos", "Técnicos", Users]] },
    { g: "Postventa", items: [["devoluciones", "Devoluciones", Undo2, devPend.length]] },
  ];
  const hoy = new Date().toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="min-h-[calc(100vh-8rem)] md:grid md:grid-cols-[14.5rem_minmax(0,1fr)]" style={{ background: FONDO, color: TINTA, fontFamily: LETRA_SISTEMA }}>
      <aside className="text-white md:sticky md:top-0 md:flex md:h-screen md:flex-col md:self-start" style={{ background: "#14101f" }}>
        <p className="flex items-center gap-2.5 px-4 py-4 text-[1.2rem] font-bold tracking-tight"><span className="grid h-8 w-8 place-items-center rounded-[5px] bg-white text-[1rem] font-extrabold" style={{ color: TINTA }}>Ó</span><span className="leading-tight">Órbita<span className="block text-[0.74rem] font-medium opacity-55">Panel del dueño</span></span></p>
        <nav aria-label="Panel" className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-1 md:flex-col md:gap-0 md:overflow-y-auto md:px-0">
          {grupos.map(({ g, items }) => (
            <div key={g} className="flex shrink-0 gap-1 md:mt-3 md:block">
              <p className="hidden px-4 pb-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white/35 md:block">{g}</p>
              {items.map(([id, tx, I, n]) => (
                <button key={id} type="button" onClick={() => setPestana(id)} aria-current={pestana === id ? "page" : undefined} className="flex min-h-[2.7rem] shrink-0 items-center gap-2.5 whitespace-nowrap px-4 text-left text-[0.94rem] font-semibold transition-colors hover:bg-white/10 md:w-full" style={pestana === id ? { background: "rgba(255,255,255,.12)", color: "#fff", boxShadow: "inset 3px 0 0 #ffd23f" } : { color: "rgba(255,255,255,.72)" }}>
                  <I size={18} /> {tx}
                  {!!n && <span className="ml-auto min-w-5 rounded-[3px] px-1.5 text-center text-[0.72rem] font-bold" style={{ background: "#ffd23f", color: TINTA }}>{n}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="hidden border-t border-white/10 px-4 py-3 md:block">
          <p className="flex items-center gap-2 text-[0.82rem] text-white/75"><span className="h-2 w-2 rounded-full bg-[#34d399]" /> Bot de WhatsApp conectado</p>
          <div className="mt-2 grid gap-0.5 text-[0.86rem]">
            <button type="button" onClick={alTienda} className="flex min-h-[2.4rem] items-center gap-2 text-left text-white/75 hover:text-white"><Store size={15} /> Ver la tienda</button>
            <button type="button" onClick={() => { t.reiniciar(); chatReiniciar(); setV((x) => x + 1); }} className="flex min-h-[2.4rem] items-center gap-2 text-left text-white/75 hover:text-white"><RotateCcw size={15} /> Reiniciar el ejemplo</button>
            <button type="button" onClick={alSalir} className="flex min-h-[2.4rem] items-center gap-2 text-left text-white/75 hover:text-white"><LogOut size={15} /> Salir</button>
          </div>
        </div>
      </aside>

      <main className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-white px-[clamp(1rem,3vw,2.5rem)] py-3" style={{ borderColor: BORDE }}>
          <p className="text-[0.92rem]" style={{ color: MUTED }}>Órbita <span className="mx-1">/</span> <b className="text-[#14101f]">{NOMBRE_PESTANA[pestana]}</b></p>
          <p className="text-[0.88rem]" style={{ color: MUTED }}>{hoy.charAt(0).toUpperCase() + hoy.slice(1)} · tres puntos de venta</p>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 px-[clamp(1rem,3vw,2.5rem)] py-5 pb-14">
          {pestana === "resumen" && <Resumen t={t} irA={setPestana} />}
          {pestana === "asistente" && <PaginaBot t={t} alTienda={alTienda} />}
          {pestana === "pedidos" && <Pedidos t={t} />}
          {pestana === "pagos" && <Pagos t={t} />}
          {pestana === "inventario" && <Inventario t={t} />}
          {pestana === "reparaciones" && <Reparaciones t={t} />}
          {pestana === "tecnicos" && <Tecnicos t={t} />}
          {pestana === "devoluciones" && <Devoluciones t={t} />}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 md:hidden">
            <button type="button" onClick={alTienda} className={BTN} style={borde}><Store size={15} /> Ver la tienda</button>
            <button type="button" onClick={() => { t.reiniciar(); chatReiniciar(); setV((x) => x + 1); }} className={BTN} style={borde}><RotateCcw size={15} /> Reiniciar</button>
          </div>
          <p className="text-center text-xs" style={{ color: MUTED }}>Panel de demostración con datos de ejemplo. Lo que cambie aquí solo se guarda en este navegador.</p>
        </div>
      </main>
      {pestana !== "asistente" && <DockBot t={t} />}
    </div>
  );
}

/* ---------------- resumen ---------------- */


function Resumen({ t, irA }: { t: Tienda; irA: (p: Pestana) => void }) {
  const registro = useRegistro();
  const vendidos = t.pedidos.filter((p) => VENDIDO.includes(p.estado));
  const hoy = new Date().toDateString();
  const ventasHoy = vendidos.filter((p) => diaIso(p.fecha) === hoy);
  const totalHoy = ventasHoy.reduce((s, p) => s + p.total, 0);
  const total7 = vendidos.reduce((s, p) => s + p.total, 0);
  const ticket = vendidos.length ? Math.round(total7 / vendidos.length) : 0;
  const pend = t.pedidos.filter((p) => p.estado === "pago-pendiente");
  const rechazados = t.pedidos.filter((p) => p.estado === "rechazado");
  const unidades = (id: string) => Object.values(t.stock[id] ?? {}).reduce((s, n) => s + n, 0);
  const promedioDia = total7 / 7;
  const vsPromedio = promedioDia ? Math.round(((totalHoy - promedioDia) / promedioDia) * 100) : 0;

  const mover = (p: Pedido, a: EstadoPedido) => moverPedido(t, p, a);
  const confirmarPago = (p: Pedido) => {
    mover(p, "pagado");
    t.setStock((s) => { const n = structuredClone(s); p.lineas.forEach((l) => { const suc = Object.keys(n[l.id] ?? {}).find((k) => n[l.id][k] > 0); if (suc) n[l.id][suc] = Math.max(0, n[l.id][suc] - l.cantidad); }); return n; });
  };

  const dias = useMemo(() => {
    const out: { d: Date; q: number; n: number }[] = [];
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const del = vendidos.filter((p) => diaIso(p.fecha) === d.toDateString()); out.push({ d, q: del.reduce((s, p) => s + p.total, 0), n: del.length }); }
    return out;
  }, [vendidos]);
  const max = Math.max(1, ...dias.map((x) => x.q));
  const porSucursal = SUCURSALES.map((s) => { const l = vendidos.filter((p) => p.sucursal === s.id); return { s, n: l.length, q: l.reduce((a, p) => a + p.total, 0) }; });
  const metodos = [["Tarjeta", "tarjeta"], ["Transferencia", "transferencia"]].map(([n, m]) => ({ n, q: vendidos.filter((p) => p.metodo === m).reduce((s, p) => s + p.total, 0) }));
  const alRecibir = total7 - metodos.reduce((s, m) => s + m.q, 0);
  const top = t.productos.map((p) => { const l = vendidos.flatMap((x) => x.lineas.filter((y) => y.id === p.id)); return { p, n: l.reduce((a, y) => a + y.cantidad, 0), q: l.reduce((a, y) => a + y.cantidad * y.precio, 0) }; }).filter((x) => x.n).sort((a, b) => b.q - a.q).slice(0, 6);
  const bajos = t.productos.filter((p) => unidades(p.id) <= 3).sort((a, b) => unidades(a.id) - unidades(b.id));

  type Accion = { tipo: string; ref: string; detalle: string; monto?: string; boton: string; hacer: () => void; urgente?: boolean };
  const acciones: Accion[] = [
    ...pend.map((p) => ({ tipo: "Pago por verificar", ref: p.id, detalle: `${p.cliente} · transferencia con comprobante`, monto: qz(p.total), boton: "Confirmar pago", hacer: () => confirmarPago(p), urgente: true })),
    ...t.pedidos.filter((p) => p.estado === "pagado").map((p) => ({ tipo: "Pedido por preparar", ref: p.id, detalle: `${p.cliente} · ${p.lineas.map((l) => l.nombre).join(", ")}`, monto: qz(p.total), boton: "Pasar a preparación", hacer: () => mover(p, "preparando") })),
    ...t.reparaciones.filter((r) => r.estado === "listo").map((r) => ({ tipo: "Reparación lista", ref: r.id, detalle: `${r.cliente} · ${r.modelo}, ${r.falla}`, monto: qz(r.precio), boton: "Marcar entregada", hacer: () => { registrar("Taller", "Panel", `${r.id} entregada`); t.setReparaciones((rs) => rs.map((x) => (x.id === r.id ? { ...x, estado: "entregado", nueva: false } : x))); } })),
    ...t.devoluciones.filter((d) => d.estado === "pendiente").map((d) => ({ tipo: "Devolución por revisar", ref: d.id, detalle: `Pedido ${d.pedido} · ${d.motivo}`, boton: "Revisar", hacer: () => irA("devoluciones"), urgente: true })),
    ...bajos.slice(0, 3).map((p) => ({ tipo: "Poco stock", ref: "—", detalle: `${p.nombre} · ${unidades(p.id) === 0 ? "agotado" : `quedan ${unidades(p.id)}`}`, boton: "Ver producto", hacer: () => irA("inventario") })),
  ];

  const eventos = [
    ...t.pedidos.map((p) => ({ f: p.fecha, tipo: "Pedido", txt: `${p.id} · ${p.cliente} · ${qz(p.total)}`, est: <EstadoPed e={p.estado} /> })),
    ...t.reparaciones.map((r) => ({ f: r.fecha, tipo: "Reparación", txt: `${r.id} · ${r.cliente} · ${r.modelo}`, est: <EstadoRep e={r.estado} /> })),
    ...t.devoluciones.map((d) => ({ f: d.fecha, tipo: "Devolución", txt: `${d.id} · pedido ${d.pedido} · ${d.motivo}`, est: <Estado texto={d.estado === "pendiente" ? "Por revisar" : d.estado === "aprobada" ? "Aprobada" : "No procede"} color={d.estado === "pendiente" ? "#8a4b00" : d.estado === "aprobada" ? "#1f7a3a" : ROJO} fondo={d.estado === "pendiente" ? "#fff1d6" : d.estado === "aprobada" ? "#e1f5e6" : "#fde4e1"} /> })),
  ].sort((a, b) => +new Date(b.f) - +new Date(a.f)).slice(0, 8);

  return (
    <>
      <Titulo sub="Estado de la tienda en los últimos 7 días.">Resumen</Titulo>
      <FranjaBot area="General" />
      <Cifras items={[
        { t: "Ventas de hoy", v: qz(totalHoy), n: `${ventasHoy.length} ${ventasHoy.length === 1 ? "pedido" : "pedidos"} · ${vsPromedio >= 0 ? "+" : ""}${vsPromedio}% vs promedio diario` },
        { t: "Ventas de 7 días", v: qz(total7), n: `${vendidos.length} pedidos pagados` },
        { t: "Ticket promedio", v: qz(ticket), n: "por pedido pagado" },
        { t: "Por verificar", v: qz(pend.reduce((s, p) => s + p.total, 0)), n: `${pend.length} ${pend.length === 1 ? "transferencia" : "transferencias"}`, alerta: pend.length > 0 },
        { t: "Pagos rechazados", v: rechazados.length, n: "no se cobró nada" },
      ]} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <Panel titulo="Requiere acción" nota={`${acciones.length} pendientes`} flush>
          <table className="w-full min-w-[44rem] text-[0.92rem]">
            <thead><tr><th className={TH}>Tipo</th><th className={TH}>Ref.</th><th className={TH}>Detalle</th><th className={`${TH} text-right`}>Monto</th><th className={TH} /></tr></thead>
            <tbody>
              {acciones.map((a) => (
                <tr key={a.tipo + a.ref + a.detalle} className="border-t hover:bg-[#fafafb]" style={{ borderColor: BORDE }}>
                  <td className={`${TD} font-semibold`} style={{ boxShadow: a.urgente ? `inset 3px 0 0 ${ROJO}` : undefined }}>{a.tipo}</td>
                  <td className={`${TD} font-mono text-[0.86rem]`}>{a.ref}</td>
                  <td className={`${TD} max-w-[22rem] truncate`} style={{ color: MUTED }}>{a.detalle}</td>
                  <td className={`${TD} text-right font-semibold tabular-nums`}>{a.monto ?? ""}</td>
                  <td className={`${TD} text-right`}><button type="button" onClick={a.hacer} className={BTN} style={a.urgente ? principal : borde}>{a.boton}</button></td>
                </tr>
              ))}
              {!acciones.length && <tr><td colSpan={5} className="p-8 text-center" style={{ color: MUTED }}>No hay pendientes.</td></tr>}
            </tbody>
          </table>
        </Panel>
        <Panel titulo="Bot de WhatsApp" nota="Conectado" derecha={<MessageCircle size={18} className="text-[#1f9d55]" />}>
          <p className="text-[0.9rem]" style={{ color: MUTED }}>Lo último que hizo el bot, el dueño por WhatsApp y los clientes:</p>
          <ul className="mt-2 divide-y text-[0.88rem]" style={{ borderColor: BORDE }}>
            {registro.slice(0, 5).map((r) => <li key={r.id} className="py-2" style={{ borderColor: BORDE }}><span className="tabular-nums" style={{ color: MUTED }}>{new Date(r.f).toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false })}</span> · <b>{r.origen}</b><span className="block">{r.texto}</span></li>)}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => irA("asistente")} className={BTN} style={borde}>Ver registro</button>
            <button type="button" onClick={() => setDock(true)} className={BTN} style={principal}><MessageCircle size={15} /> Abrir chat</button>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel titulo="Ventas por día" nota={`Q${Math.round(promedioDia).toLocaleString("en-US")} de promedio`}>
          <div className="relative flex h-52 items-end gap-3 border-b pl-1" style={{ borderColor: BORDE, backgroundImage: `repeating-linear-gradient(to top, ${BORDE} 0 1px, transparent 1px 25%)` }}>
            {dias.map(({ d, q }) => (
              <div key={d.toDateString()} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[0.74rem] font-semibold tabular-nums" style={{ color: MUTED }}>{q ? `Q${(q / 1000).toFixed(1)}k` : "—"}</span>
                <div className="w-full rounded-t-[3px]" style={{ height: `${(q / max) * 80}%`, minHeight: 3, background: d.toDateString() === hoy ? PRIMARIO : "#aab4d6" }} />
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex gap-3 pl-1">{dias.map(({ d }) => <span key={d.toDateString()} className="flex-1 text-center text-[0.8rem] capitalize" style={{ color: MUTED }}>{d.toLocaleDateString("es-GT", { weekday: "short" })}</span>)}</div>
        </Panel>
        <Panel titulo="Ventas por sucursal y forma de pago" flush>
          <table className="w-full text-[0.92rem]">
            <thead><tr><th className={TH}>Sucursal</th><th className={`${TH} text-right`}>Pedidos</th><th className={`${TH} text-right`}>Ventas</th><th className={`${TH} text-right`}>%</th></tr></thead>
            <tbody>
              {porSucursal.map(({ s, n, q }) => <tr key={s.id} className="border-t" style={{ borderColor: BORDE }}><td className={`${TD} font-semibold`}>{s.nombre}</td><td className={`${TD} text-right tabular-nums`}>{n}</td><td className={`${TD} text-right tabular-nums`}>{qz(q)}</td><td className={`${TD} text-right tabular-nums`} style={{ color: MUTED }}>{total7 ? Math.round((q / total7) * 100) : 0}%</td></tr>)}
              <tr className="border-t font-bold" style={{ borderColor: BORDE, background: "#f7f8fa" }}><td className={TD}>Total</td><td className={`${TD} text-right tabular-nums`}>{vendidos.length}</td><td className={`${TD} text-right tabular-nums`}>{qz(total7)}</td><td className={TD} /></tr>
              <tr><td colSpan={4} className="px-3 pb-1 pt-4 text-[0.72rem] font-bold uppercase tracking-[0.06em]" style={{ color: MUTED }}>Forma de pago</td></tr>
              {[...metodos, { n: "Al recibir", q: alRecibir }].filter((m) => m.q > 0 || m.n !== "Al recibir").map((m) => <tr key={m.n} className="border-t" style={{ borderColor: BORDE }}><td className={TD}>{m.n}</td><td className={TD} /><td className={`${TD} text-right tabular-nums`}>{qz(m.q)}</td><td className={`${TD} text-right tabular-nums`} style={{ color: MUTED }}>{total7 ? Math.round((m.q / total7) * 100) : 0}%</td></tr>)}
            </tbody>
          </table>
        </Panel>
        <Panel titulo="Productos más vendidos" flush>
          <table className="w-full text-[0.92rem]">
            <thead><tr><th className={TH}>Producto</th><th className={`${TH} text-right`}>Uds.</th><th className={`${TH} text-right`}>Ingresos</th></tr></thead>
            <tbody>{top.map(({ p, n, q }) => <tr key={p.id} className="border-t" style={{ borderColor: BORDE }}><td className={TD}><span className="flex items-center gap-2.5"><img src={p.foto} alt="" className="h-8 w-8 rounded-[4px] object-cover" /><span className="font-semibold">{p.nombre}</span></span></td><td className={`${TD} text-right tabular-nums`}>{n}</td><td className={`${TD} text-right tabular-nums`}>{qz(q)}</td></tr>)}</tbody>
          </table>
        </Panel>
        <Panel titulo="Existencias críticas" nota="3 unidades o menos" derecha={<button type="button" onClick={() => irA("inventario")} className="text-[0.86rem] font-semibold underline" style={{ color: PRIMARIO }}>Ver productos</button>} flush>
          <table className="w-full text-[0.92rem]">
            <thead><tr><th className={TH}>Producto</th>{SUCURSALES.map((s) => <th key={s.id} className={`${TH} text-right`}>{s.nombre.slice(0, 5)}.</th>)}<th className={`${TH} text-right`}>Total</th></tr></thead>
            <tbody>{bajos.map((p) => <tr key={p.id} className="border-t" style={{ borderColor: BORDE }}><td className={`${TD} font-semibold`}>{p.nombre}</td>{SUCURSALES.map((s) => <td key={s.id} className={`${TD} text-right tabular-nums`}>{t.stock[p.id]?.[s.id] ?? 0}</td>)}<td className={`${TD} text-right font-bold tabular-nums`} style={{ color: unidades(p.id) === 0 ? ROJO : "#c2410c" }}>{unidades(p.id)}</td></tr>)}{!bajos.length && <tr><td colSpan={5} className="p-6 text-center" style={{ color: MUTED }}>Todo con existencias suficientes.</td></tr>}</tbody>
          </table>
        </Panel>
      </div>

      <Panel titulo="Actividad reciente" nota="Pedidos, reparaciones y devoluciones" flush>
        <table className="w-full min-w-[40rem] text-[0.92rem]">
          <thead><tr><th className={TH}>Fecha</th><th className={TH}>Módulo</th><th className={TH}>Detalle</th><th className={TH}>Estado</th></tr></thead>
          <tbody>{eventos.map((e, i) => <tr key={i} className="border-t" style={{ borderColor: BORDE }}><td className={`${TD} whitespace-nowrap tabular-nums`} style={{ color: MUTED }}>{fechaCorta(e.f)}</td><td className={`${TD} font-semibold`}>{e.tipo}</td><td className={TD}>{e.txt}</td><td className={TD}>{e.est}</td></tr>)}</tbody>
        </table>
      </Panel>
    </>
  );
}

/* ---------------- pedidos ---------------- */

type FPed = "activos" | "todos" | EstadoPedido;
function Pedidos({ t }: { t: Tienda }) {
  const [filtro, setFiltro] = useState<FPed>("activos");
  const [q, setQ] = useState("");
  const [abierto, setAbierto] = useState<string | null>(null);
  const activos: EstadoPedido[] = ["pago-pendiente", "pagado", "preparando", "en-camino"];
  const coincide = (p: Pedido) => `${p.id} ${p.cliente} ${p.telefono}`.toLowerCase().includes(q.toLowerCase().trim());
  const lista = t.pedidos.filter((p) => (filtro === "todos" || (filtro === "activos" ? activos.includes(p.estado) : p.estado === filtro)) && coincide(p));
  const mover = (p: Pedido, a: EstadoPedido) => moverPedido(t, p, a);
  const n = (f: FPed) => (f === "todos" ? t.pedidos.length : f === "activos" ? t.pedidos.filter((p) => activos.includes(p.estado)).length : t.pedidos.filter((p) => p.estado === f).length);
  const opciones = (["activos", "todos", "pago-pendiente", "pagado", "preparando", "en-camino", "entregado", "rechazado", "devuelto"] as const).map((f) => [f, f === "todos" ? "Todos" : f === "activos" ? "Por atender" : textoEstadoPanel(f), n(f)] as const);
  return (
    <>
      <Titulo sub="Cada cambio de estado se ve al instante en el rastreo del cliente.">Pedidos</Titulo>
      <FranjaBot area="Ventas" />
      <div className="flex flex-wrap items-center justify-between gap-3"><Filtros etiqueta="Filtrar pedidos" valor={filtro} alCambiar={setFiltro} opciones={opciones} /><Buscar valor={q} alCambiar={setQ} texto="Código, nombre o teléfono" /></div>
      <Panel flush>
        <table className="w-full min-w-[60rem] text-[0.92rem]">
          <thead><tr><th className={TH}>Código</th><th className={TH}>Fecha</th><th className={TH}>Cliente</th><th className={TH}>Entrega</th><th className={TH}>Pago</th><th className={`${TH} text-right`}>Total</th><th className={TH}>Estado</th><th className={TH} /></tr></thead>
          <tbody>
            {lista.map((p) => {
              const sig = SIGUIENTE[p.estado];
              return (
                <Fragment key={p.id}>
                  <tr onClick={() => setAbierto(abierto === p.id ? null : p.id)} className="cursor-pointer border-t hover:bg-[#fafafb]" style={{ borderColor: BORDE, boxShadow: p.nuevo ? `inset 3px 0 0 ${PRIMARIO}` : undefined }}>
                    <td className={`${TD} font-mono font-bold`}>{p.id}{p.nuevo && <span className="ml-2 rounded-[3px] px-1.5 py-0.5 align-middle font-sans text-[0.68rem] text-white" style={{ background: PRIMARIO }}>Nuevo</span>}</td>
                    <td className={`${TD} whitespace-nowrap`} style={{ color: MUTED }}>{fechaCorta(p.fecha)}</td>
                    <td className={`${TD} font-semibold`}>{p.cliente}<span className="block text-[0.8rem] font-normal" style={{ color: MUTED }}>{p.telefono}</span></td>
                    <td className={TD}>{p.entrega.tipo === "envio" ? "Envío a domicilio" : `Recoge en ${sucursalPor(p.entrega.sucursal).nombre}`}</td>
                    <td className={TD}>{textoMetodo(p)}{p.cuotas && p.cuotas > 1 ? ` · ${p.cuotas} cuotas` : ""}</td>
                    <td className={`${TD} text-right font-semibold tabular-nums`}>{qz(p.total)}</td>
                    <td className={TD}><EstadoPed e={p.estado} /></td>
                    <td className={`${TD} text-right`} onClick={(e) => e.stopPropagation()}>{sig ? <button type="button" onClick={() => mover(p, sig.a)} className={BTN} style={principal}>{sig.texto}</button> : <span className="text-[0.84rem]" style={{ color: MUTED }}>—</span>}</td>
                  </tr>
                  {abierto === p.id && (
                    <tr style={{ background: "#fafafb" }}>
                      <td colSpan={8} className="border-t px-4 py-3 text-[0.9rem]" style={{ borderColor: BORDE }}>
                        <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                          <ul className="space-y-1">{p.lineas.map((l) => <li key={l.id + l.detalle} className="flex justify-between gap-3"><span>{l.cantidad} × {l.nombre} <span style={{ color: MUTED }}>{l.detalle}</span></span><span className="tabular-nums">{qz(l.precio * l.cantidad)}</span></li>)}<li className="flex justify-between border-t pt-1 font-semibold" style={{ borderColor: BORDE }}><span>Envío</span><span className="tabular-nums">{p.envio ? qz(p.envio) : "Gratis"}</span></li></ul>
                          <div className="space-y-2">
                            <p style={{ color: MUTED }}>{p.entrega.tipo === "envio" ? `Dirección: ${p.entrega.direccion}` : `Punto de entrega: ${sucursalPor(p.entrega.sucursal).nombre}`}{p.guia ? ` · Guía ${p.guia}` : ""}</p>
                            {p.motivoRechazo && <p className="font-semibold" style={{ color: ROJO }}>Motivo del rechazo: {p.motivoRechazo}</p>}
                            <label className="flex items-center gap-2 text-[0.84rem] font-semibold">Cambiar estado
                              <select value={p.estado} onChange={(e) => mover(p, e.target.value as EstadoPedido)} className="min-h-[2.3rem] rounded-[5px] border bg-white px-2" style={{ borderColor: BORDE }}>{ESTADOS_ELEGIBLES.map((e) => <option key={e} value={e}>{textoEstadoPanel(e)}</option>)}</select>
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {!lista.length && <tr><td colSpan={8} className="p-8 text-center" style={{ color: MUTED }}>No hay pedidos con este filtro.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </>
  );
}

/* ---------------- pagos ---------------- */

function Pagos({ t }: { t: Tienda }) {
  const pendientes = t.pedidos.filter((p) => p.estado === "pago-pendiente");
  const rechazados = t.pedidos.filter((p) => p.estado === "rechazado");
  const vendidos = t.pedidos.filter((p) => VENDIDO.includes(p.estado));
  const suma = (f: (p: Pedido) => boolean) => vendidos.filter(f).reduce((s, p) => s + p.total, 0);
  const decidir = (p: Pedido, ok: boolean) => {
    registrar("Ventas", "Panel", `${ok ? "Confirmó" : "Rechazó"} el pago de ${p.id}`);
    t.setPedidos((ps) => ps.map((x) => (x.id === p.id ? { ...x, estado: ok ? "pagado" : "rechazado", motivoRechazo: ok ? undefined : "Comprobante no coincide con el depósito", nuevo: false } : x)));
    if (ok) t.setStock((s) => { const n = structuredClone(s); p.lineas.forEach((l) => { const suc = Object.keys(n[l.id] ?? {}).find((k) => n[l.id][k] > 0); if (suc) n[l.id][suc] = Math.max(0, n[l.id][suc] - l.cantidad); }); return n; });
  };
  return (
    <>
      <Titulo sub="Los pagos por transferencia se confirman contra el estado de cuenta. El cliente lo ve en el rastreo.">Pagos</Titulo>
      <FranjaBot area="Ventas" />
      <Cifras items={[
        { t: "Por verificar", v: qz(pendientes.reduce((s, p) => s + p.total, 0)), n: `${pendientes.length} transferencias`, alerta: pendientes.length > 0 },
        { t: "Cobrado con tarjeta", v: qz(suma((p) => p.metodo === "tarjeta")) },
        { t: "Cobrado por transferencia", v: qz(suma((p) => p.metodo === "transferencia")) },
        { t: "Pago al recibir", v: qz(suma((p) => p.metodo !== "tarjeta" && p.metodo !== "transferencia")) },
        { t: "Rechazados", v: rechazados.length, n: "no se cobró nada" },
      ]} />
      <Panel titulo="Pagos por verificar" nota="Comparar el comprobante con el depósito" flush>
        <table className="w-full min-w-[40rem] text-[0.92rem]">
          <thead><tr><th className={TH}>Código</th><th className={TH}>Fecha</th><th className={TH}>Cliente</th><th className={`${TH} text-right`}>Monto</th><th className={TH}>Comprobante</th><th className={TH} /></tr></thead>
          <tbody>
            {pendientes.map((p) => <tr key={p.id} className="border-t" style={{ borderColor: BORDE }}><td className={`${TD} font-mono font-bold`}>{p.id}</td><td className={TD} style={{ color: MUTED }}>{fechaCorta(p.fecha)}</td><td className={`${TD} font-semibold`}>{p.cliente}</td><td className={`${TD} text-right font-semibold tabular-nums`}>{qz(p.total)}</td><td className={TD}>Adjunto</td><td className={`${TD} text-right`}><span className="inline-flex gap-2"><button type="button" onClick={() => decidir(p, true)} className={BTN} style={{ background: "#1f7a3a", color: "#fff" }}><Check size={15} /> Confirmar</button><button type="button" onClick={() => decidir(p, false)} className={BTN} style={{ background: "#fde4e1", color: ROJO }}><X size={15} /> Rechazar</button></span></td></tr>)}
            {!pendientes.length && <tr><td colSpan={6} className="p-8 text-center" style={{ color: MUTED }}>No hay transferencias pendientes.</td></tr>}
          </tbody>
        </table>
      </Panel>
      <Panel titulo="Pagos rechazados" nota="Ninguno se cobró. Se puede escribir al cliente para que pague con otra tarjeta." flush>
        <table className="w-full min-w-[40rem] text-[0.92rem]">
          <thead><tr><th className={TH}>Código</th><th className={TH}>Fecha</th><th className={TH}>Cliente</th><th className={TH}>Pago</th><th className={`${TH} text-right`}>Monto</th><th className={TH}>Motivo</th></tr></thead>
          <tbody>
            {rechazados.map((p) => <tr key={p.id} className="border-t" style={{ borderColor: BORDE }}><td className={`${TD} font-mono font-bold`}>{p.id}</td><td className={TD} style={{ color: MUTED }}>{fechaCorta(p.fecha)}</td><td className={`${TD} font-semibold`}>{p.cliente}</td><td className={TD}>{textoMetodo(p)}</td><td className={`${TD} text-right tabular-nums`}>{qz(p.total)}</td><td className={TD}><Estado texto={p.motivoRechazo ?? "Rechazado"} color={ROJO} fondo="#fde4e1" /></td></tr>)}
            {!rechazados.length && <tr><td colSpan={6} className="p-8 text-center" style={{ color: MUTED }}>Sin pagos rechazados.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </>
  );
}

/* ---------------- productos: fotos, precios, existencias y visibilidad ---------------- */

function Inventario({ t }: { t: Tienda }) {
  const [buscar, setBuscar] = useState("");
  const [nuevo, setNuevo] = useState(false);
  const total = (id: string) => Object.values(t.stock[id] ?? {}).reduce((a, n) => a + n, 0);
  const cambiarStock = (id: string, suc: string, d: number) => t.setStock((s) => ({ ...s, [id]: { ...(s[id] ?? {}), [suc]: Math.max(0, (s[id]?.[suc] ?? 0) + d) } }));
  const editar = (id: string, cambio: Partial<Producto>) => t.setProductos((ps) => ps.map((p) => (p.id === id ? { ...p, ...cambio } : p)));
  const lista = t.productos.filter((p) => `${p.marca} ${p.nombre}`.toLowerCase().includes(buscar.toLowerCase().trim()));
  const valor = t.productos.reduce((s, p) => s + total(p.id) * p.variantes[0].precio, 0);
  const paso = "grid h-7 w-7 place-items-center rounded-[4px] border bg-white transition hover:bg-[#ece6ff]";
  return (
    <>
      <Titulo sub="Fotos, precios y existencias por sucursal. El cliente solo ve si hay, nunca los números." derecha={<button type="button" onClick={() => setNuevo(true)} className={BTN} style={principal}><Plus size={16} /> Nuevo producto</button>}>Productos</Titulo>
      <FranjaBot area="Tienda" />
      <Cifras items={[
        { t: "Unidades en tienda", v: t.productos.reduce((s, p) => s + total(p.id), 0) },
        { t: "Valor del inventario", v: qz(valor), n: "a precio con tarjeta" },
        { t: "Productos", v: t.productos.length, n: `${t.productos.filter((p) => p.visible === false).length} ocultos` },
        { t: "Con poco stock", v: t.productos.filter((p) => total(p.id) <= 3).length, n: "3 unidades o menos", alerta: t.productos.some((p) => total(p.id) <= 3) },
      ]} />
      {nuevo && <NuevoProducto t={t} alCerrar={() => setNuevo(false)} />}
      <div className="flex flex-wrap items-center justify-between gap-3"><Buscar valor={buscar} alCambiar={setBuscar} texto="Buscar producto" /><p className="text-[0.84rem]" style={{ color: MUTED }}>Tocar la foto la cambia. El ojo oculta o muestra el producto en la tienda.</p></div>
      <Panel flush>
        <table className="w-full min-w-[62rem] text-[0.92rem]">
          <thead><tr><th className={TH} /><th className={TH}>Producto</th><th className={TH}>Condición</th><th className={TH}>Precio (Q)</th>{SUCURSALES.map((s) => <th key={s.id} className={`${TH} text-center`}>{s.nombre}</th>)}<th className={`${TH} text-right`}>Total</th><th className={TH} /></tr></thead>
          <tbody>
            {lista.map((p) => {
              const n = total(p.id);
              return (
                <tr key={p.id} className="border-t" style={{ borderColor: BORDE, opacity: p.visible === false ? 0.55 : 1 }}>
                  <td className={`${TD} w-16`}>
                    <label className="group relative block h-12 w-12 cursor-pointer overflow-hidden rounded-[5px]" title="Cambiar foto"><img src={p.foto} alt="" className="h-full w-full object-cover" /><span className="absolute inset-0 grid place-items-center bg-black/45 text-white opacity-0 transition group-hover:opacity-100"><Camera size={16} /></span><input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; if (f) editar(p.id, { foto: await achicarFoto(f) }); }} /></label>
                  </td>
                  <td className={TD}><b className="block leading-tight">{p.nombre}</b><span className="text-[0.8rem]" style={{ color: MUTED }}>{p.marca} · {p.categoria}</span></td>
                  <td className={TD}>{p.condicion}</td>
                  <td className={TD}><input type="number" aria-label={`Precio de ${p.nombre}`} value={p.variantes[0].precio} onChange={(e) => editar(p.id, { variantes: p.variantes.map((v, i) => (i === 0 ? { ...v, precio: Math.max(0, Number(e.target.value) || 0) } : v)) })} className="min-h-[2.3rem] w-28 rounded-[5px] border px-2 font-semibold tabular-nums" style={{ borderColor: BORDE }} /></td>
                  {SUCURSALES.map((s) => { const k = t.stock[p.id]?.[s.id] ?? 0; return (
                    <td key={s.id} className={TD}><span className="mx-auto flex w-fit items-center gap-1"><button type="button" aria-label={`Quitar uno en ${s.nombre}`} onClick={() => cambiarStock(p.id, s.id, -1)} className={paso} style={{ borderColor: BORDE }}><Minus size={13} /></button><span className="w-7 text-center font-bold tabular-nums" style={{ color: k === 0 ? ROJO : undefined }}>{k}</span><button type="button" aria-label={`Agregar uno en ${s.nombre}`} onClick={() => cambiarStock(p.id, s.id, 1)} className={paso} style={{ borderColor: BORDE }}><Plus size={13} /></button></span></td>
                  ); })}
                  <td className={`${TD} text-right font-bold tabular-nums`} style={{ color: n === 0 ? ROJO : n <= 3 ? "#c2410c" : undefined }}>{n}{n === 0 ? " · agotado" : ""}</td>
                  <td className={`${TD} text-right`}><button type="button" onClick={() => editar(p.id, { visible: p.visible === false })} title={p.visible === false ? "Mostrar en la tienda" : "Ocultar de la tienda"} aria-label={p.visible === false ? "Mostrar en la tienda" : "Ocultar de la tienda"} className="grid h-9 w-9 place-items-center rounded-[5px] border transition hover:bg-[#ece6ff]" style={{ borderColor: BORDE }}>{p.visible === false ? <EyeOff size={16} /> : <Eye size={16} />}</button></td>
                </tr>
              );
            })}
            {!lista.length && <tr><td colSpan={9} className="p-8 text-center" style={{ color: MUTED }}>Ningún producto coincide.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </>
  );
}

function NuevoProducto({ t, alCerrar }: { t: Tienda; alCerrar: () => void }) {
  const [f, setF] = useState({ nombre: "", marca: "", categoria: "Celulares" as Producto["categoria"], condicion: "Nuevo" as Producto["condicion"], precio: "", stock: "1", foto: "" });
  const [error, setError] = useState("");
  const campo = "mt-1 w-full rounded-lg border border-black/15 px-3 py-2 focus:outline-none focus:border-[#6d28d9]";
  return (
    <form
      style={{ borderColor: BORDE }} className="rounded-md border bg-white p-4 sm:p-5 grid sm:grid-cols-[120px_1fr] gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!f.nombre.trim() || !Number(f.precio)) return setError("Escriba al menos el nombre y el precio.");
        if (!f.foto) return setError("Suba una foto del producto.");
        const id = `p${Date.now()}`;
        t.setProductos((ps) => [
          { id, nombre: f.nombre.trim(), marca: f.marca.trim() || "Órbita", categoria: f.categoria, condicion: f.condicion, foto: f.foto, colores: [{ nombre: "Único", hex: "#999" }], variantes: [{ precio: Number(f.precio) }], resumen: "", detalles: [], garantia: f.condicion === "Nuevo" ? "1 año con nosotros" : "6 meses con nosotros", origen: "Inventario de la tienda", visible: true },
          ...ps,
        ]);
        t.setStock((s) => ({ ...s, [id]: { z10: Number(f.stock) || 0, mix: 0, xela: 0 } }));
        alCerrar();
      }}
    >
      <label className="grid place-items-center aspect-square cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-black/15 text-center text-[0.8rem] text-black/50">
        {f.foto ? <img src={f.foto} alt="" className="w-full h-full object-cover" /> : (<span className="px-2"><Camera size={22} className="mx-auto mb-1" />Subir foto</span>)}
        <input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const x = e.target.files?.[0]; if (x) setF({ ...f, foto: await achicarFoto(x) }); }} />
      </label>
      <div className="grid sm:grid-cols-2 gap-3 text-sm font-semibold">
        <label>Nombre<input value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} placeholder="iPhone 18 Pro Max" className={campo} /></label>
        <label>Marca<input value={f.marca} onChange={(e) => setF({ ...f, marca: e.target.value })} placeholder="Apple" className={campo} /></label>
        <label>Categoría
          <select value={f.categoria} onChange={(e) => setF({ ...f, categoria: e.target.value as Producto["categoria"] })} className={`${campo} bg-white`}>
            {["Celulares", "Tablets", "Laptops", "Accesorios"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Condición
          <select value={f.condicion} onChange={(e) => setF({ ...f, condicion: e.target.value as Producto["condicion"] })} className={`${campo} bg-white`}>
            <option>Nuevo</option>
            <option>Seminuevo</option>
          </select>
        </label>
        <label>Precio con tarjeta (Q)<input type="number" value={f.precio} onChange={(e) => setF({ ...f, precio: e.target.value })} className={campo} /></label>
        <label>Unidades en Zona 10<input type="number" value={f.stock} onChange={(e) => setF({ ...f, stock: e.target.value })} className={campo} /></label>
        {error && <p className="sm:col-span-2 text-[#b42318]">{error}</p>}
        <div className="sm:col-span-2 flex gap-2">
          <button type="submit" className="rounded-full px-5 py-2.5 font-bold text-white" style={{ background: PRIMARIO }}>Publicar en la tienda</button>
          <button type="button" onClick={alCerrar} className="rounded-full px-5 py-2.5 font-bold bg-black/5">Cancelar</button>
        </div>
      </div>
    </form>
  );
}

/* ---------------- reparaciones ---------------- */

type FRep = "activas" | Reparacion["estado"] | "todas";
function Reparaciones({ t }: { t: Tienda }) {
  const [filtro, setFiltro] = useState<FRep>("activas");
  const editar = (id: string, cambio: Partial<Reparacion>) => {
    if (cambio.estado) registrar("Taller", "Panel", `${id} pasó a “${TEXTO_REPARACION[cambio.estado].toLowerCase()}”`);
    else if ("tecnico" in cambio) registrar("Taller", "Panel", `${id}: técnico ${cambio.tecnico ? "asignado" : "sin asignar"}`);
    t.setReparaciones((rs) => rs.map((r) => (r.id === id ? { ...r, ...cambio, nueva: false } : r)));
  };
  const n = (f: FRep) => (f === "todas" ? t.reparaciones.length : f === "activas" ? t.reparaciones.filter((r) => r.estado !== "entregado").length : t.reparaciones.filter((r) => r.estado === f).length);
  const lista = t.reparaciones.filter((r) => (filtro === "todas" ? true : filtro === "activas" ? r.estado !== "entregado" : r.estado === filtro));
  const opciones = (["activas", "recibido", "diagnostico", "reparando", "listo", "entregado", "todas"] as const).map((f) => [f, f === "activas" ? "En curso" : f === "todas" ? "Todas" : TEXTO_REPARACION[f], n(f)] as const);
  return (
    <>
      <Titulo sub="El estado de cada equipo y su técnico. El cliente lo consulta con su código en el rastreo.">Reparaciones</Titulo>
      <FranjaBot area="Taller" />
      <Filtros etiqueta="Filtrar reparaciones" valor={filtro} alCambiar={setFiltro} opciones={opciones} />
      <Panel flush>
        <table className="w-full min-w-[58rem] text-[0.92rem]">
          <thead><tr><th className={TH}>Código</th><th className={TH}>Ingreso</th><th className={TH}>Cliente</th><th className={TH}>Equipo y falla</th><th className={TH}>Sucursal</th><th className={TH}>Técnico</th><th className={`${TH} text-right`}>Precio</th><th className={TH}>Estado</th><th className={TH} /></tr></thead>
          <tbody>
            {lista.map((r) => { const sig = PASOS_REPARACION[PASOS_REPARACION.indexOf(r.estado) + 1]; return (
              <tr key={r.id} className="border-t" style={{ borderColor: BORDE, boxShadow: r.nueva ? `inset 3px 0 0 ${PRIMARIO}` : undefined }}>
                <td className={`${TD} font-mono font-bold`}>{r.id}</td>
                <td className={`${TD} whitespace-nowrap`} style={{ color: MUTED }}>{fechaCorta(r.fecha)}</td>
                <td className={`${TD} font-semibold`}>{r.cliente}</td>
                <td className={TD}>{r.modelo}<span className="block text-[0.82rem]" style={{ color: MUTED }}>{r.falla}</span></td>
                <td className={TD}>{sucursalPor(r.sucursal).nombre}</td>
                <td className={TD}><select aria-label={`Técnico de ${r.id}`} value={r.tecnico ?? ""} onChange={(e) => editar(r.id, { tecnico: e.target.value || undefined })} className="min-h-[2.3rem] w-44 rounded-[5px] border bg-white px-2 text-[0.88rem]" style={{ borderColor: BORDE }}><option value="">Sin asignar</option>{t.tecnicos.filter((x) => x.activo).map((x) => <option key={x.id} value={x.id}>{x.nombre}</option>)}</select></td>
                <td className={`${TD} text-right tabular-nums`}>{qz(r.precio)}</td>
                <td className={TD}><EstadoRep e={r.estado} /></td>
                <td className={`${TD} text-right`}>{sig ? <button type="button" onClick={() => editar(r.id, { estado: sig })} className={BTN} style={principal}>{ACCION_REP[r.estado]}</button> : <span style={{ color: MUTED }}>—</span>}</td>
              </tr>
            ); })}
            {!lista.length && <tr><td colSpan={9} className="p-8 text-center" style={{ color: MUTED }}>No hay reparaciones con este filtro.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </>
  );
}

/* ---------------- técnicos ---------------- */

function Tecnicos({ t }: { t: Tienda }) {
  const [f, setF] = useState({ nombre: "", especialidad: "", sucursal: SUCURSALES[0].id, telefono: "" });
  const carga = (id: string) => t.reparaciones.filter((r) => r.tecnico === id && r.estado !== "entregado").length;
  const campo = "min-h-[2.4rem] w-full rounded-[5px] border bg-white px-3 text-[0.9rem]";
  return (
    <>
      <Titulo sub="Quién repara qué, en qué sucursal y cuánto trabajo tiene.">Técnicos</Titulo>
      <FranjaBot area="Taller" />
      <Panel flush>
        <table className="w-full min-w-[46rem] text-[0.92rem]">
          <thead><tr><th className={TH}>Técnico</th><th className={TH}>Especialidad</th><th className={TH}>Sucursal</th><th className={TH}>Teléfono</th><th className={`${TH} text-right`}>En curso</th><th className={TH}>Disponibilidad</th></tr></thead>
          <tbody>
            {t.tecnicos.map((x) => <tr key={x.id} className="border-t" style={{ borderColor: BORDE, opacity: x.activo ? 1 : 0.6 }}><td className={`${TD} font-semibold`}>{x.nombre}</td><td className={TD}>{x.especialidad}</td><td className={TD}>{sucursalPor(x.sucursal).nombre}</td><td className={`${TD} tabular-nums`}>{x.telefono}</td><td className={`${TD} text-right tabular-nums`}>{carga(x.id)}</td><td className={TD}><button type="button" onClick={() => t.setTecnicos((ts) => ts.map((y) => (y.id === x.id ? { ...y, activo: !y.activo } : y)))} className={BTN} style={x.activo ? { background: "#e1f5e6", color: "#1f7a3a" } : { background: "#eceef1", color: "#4b5563" }}>{x.activo ? "Disponible" : "No disponible"}</button></td></tr>)}
          </tbody>
        </table>
      </Panel>
      <Panel titulo="Agregar técnico">
        <form className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 13rem), 1fr))" }} onSubmit={(e) => { e.preventDefault(); if (!f.nombre.trim()) return; t.setTecnicos((ts) => [...ts, { id: `T${Date.now()}`, nombre: f.nombre.trim(), especialidad: f.especialidad.trim() || "General", sucursal: f.sucursal, telefono: f.telefono.trim(), activo: true }]); setF({ nombre: "", especialidad: "", sucursal: SUCURSALES[0].id, telefono: "" }); }}>
          <input aria-label="Nombre del técnico" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} placeholder="Nombre" className={campo} style={{ borderColor: BORDE }} />
          <input aria-label="Especialidad" value={f.especialidad} onChange={(e) => setF({ ...f, especialidad: e.target.value })} placeholder="Especialidad" className={campo} style={{ borderColor: BORDE }} />
          <select aria-label="Sucursal" value={f.sucursal} onChange={(e) => setF({ ...f, sucursal: e.target.value })} className={campo} style={{ borderColor: BORDE }}>{SUCURSALES.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}</select>
          <input aria-label="Teléfono" value={f.telefono} onChange={(e) => setF({ ...f, telefono: e.target.value })} placeholder="Teléfono" className={campo} style={{ borderColor: BORDE }} />
          <button type="submit" className={BTN} style={principal}><Plus size={16} /> Agregar</button>
        </form>
      </Panel>
    </>
  );
}

/* ---------------- devoluciones ---------------- */

function Devoluciones({ t }: { t: Tienda }) {
  const decidir = (id: string, ok: boolean) => {
    registrar("Postventa", "Panel", `${ok ? "Aprobó" : "Rechazó"} la devolución ${id}`);
    const d = t.devoluciones.find((x) => x.id === id)!;
    t.setDevoluciones((ds) => ds.map((x) => (x.id === id ? { ...x, estado: ok ? "aprobada" : "rechazada", nueva: false } : x)));
    if (ok) {
      const p = t.pedidos.find((x) => x.id === d.pedido);
      t.setPedidos((ps) => ps.map((x) => (x.id === d.pedido ? { ...x, estado: "devuelto" } : x)));
      // el producto vuelve al inventario de la sucursal que lo vendió
      if (p) t.setStock((s) => { const n = structuredClone(s); p.lineas.forEach((l) => { n[l.id] = n[l.id] ?? {}; n[l.id][p.sucursal] = (n[l.id][p.sucursal] ?? 0) + l.cantidad; }); return n; });
    }
  };
  return (
    <>
      <Titulo sub="Al aprobar, el pedido queda como devuelto y el producto regresa al inventario de la sucursal.">Devoluciones</Titulo>
      <FranjaBot area="Postventa" />
      <Panel flush>
        <table className="w-full min-w-[52rem] text-[0.92rem]">
          <thead><tr><th className={TH}>Código</th><th className={TH}>Fecha</th><th className={TH}>Pedido y cliente</th><th className={TH}>Motivo</th><th className={`${TH} text-right`}>Monto</th><th className={TH}>Estado</th><th className={TH} /></tr></thead>
          <tbody>
            {t.devoluciones.map((d) => { const p = t.pedidos.find((x) => x.id === d.pedido); return (
              <tr key={d.id} className="border-t align-top" style={{ borderColor: BORDE, boxShadow: d.nueva ? `inset 3px 0 0 ${PRIMARIO}` : undefined }}>
                <td className={`${TD} font-mono font-bold`}>{d.id}</td>
                <td className={`${TD} whitespace-nowrap`} style={{ color: MUTED }}>{fechaCorta(d.fecha)}</td>
                <td className={TD}><span className="font-mono text-[0.86rem]">{d.pedido}</span> · <b>{p?.cliente}</b><span className="block text-[0.82rem]" style={{ color: MUTED }}>{p?.lineas.map((l) => l.nombre).join(", ")}</span></td>
                <td className={TD}>{d.motivo}{d.detalle && <span className="block text-[0.82rem]" style={{ color: MUTED }}>“{d.detalle}”</span>}</td>
                <td className={`${TD} text-right tabular-nums`}>{p ? qz(p.total) : ""}</td>
                <td className={TD}><Estado texto={d.estado === "pendiente" ? "Por revisar" : d.estado === "aprobada" ? "Aprobada" : "No procede"} color={d.estado === "pendiente" ? "#8a4b00" : d.estado === "aprobada" ? "#1f7a3a" : ROJO} fondo={d.estado === "pendiente" ? "#fff1d6" : d.estado === "aprobada" ? "#e1f5e6" : "#fde4e1"} /></td>
                <td className={`${TD} text-right`}>{d.estado === "pendiente" && <span className="inline-flex gap-2"><button type="button" onClick={() => decidir(d.id, true)} className={BTN} style={{ background: "#1f7a3a", color: "#fff" }}><Check size={15} /> Aprobar</button><button type="button" onClick={() => decidir(d.id, false)} className={BTN} style={{ background: "#fde4e1", color: ROJO }}><X size={15} /> No procede</button></span>}</td>
              </tr>
            ); })}
            {!t.devoluciones.length && <tr><td colSpan={7} className="p-8 text-center" style={{ color: MUTED }}>No hay devoluciones.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
