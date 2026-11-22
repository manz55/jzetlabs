/*
 * Panel del dueño de Órbita Celulares. Solo lo ve el dueño (en la tienda real, con usuario y contraseña).
 * Menú lateral agrupado (Ventas, Tienda, Taller, Postventa) y cada sección a todo el ancho:
 * los pedidos y las reparaciones van en columnas por estado y cada cambio es de un toque.
 * Lo que hace el cliente en la tienda aparece aquí.
 */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowRight, BarChart3, Boxes, Camera, Check, ChevronDown, CreditCard, Eye, EyeOff, LogOut, Minus, Package, Phone, Plus, RotateCcw, Search, Store, Undo2, Users, Wrench, X } from "lucide-react";
import { qz } from "../comun";
import {
  PRIMARIO, ESTADOS_PEDIDO, FONDO, AMARILLO, LAVANDA, LETRA_SISTEMA, PASOS_REPARACION, SUCURSALES, TEXTO_REPARACION, TINTA,
  fechaCorta, sucursalPor,
  type EstadoPedido, type Pedido, type Producto, type Reparacion, type Tienda,
} from "./datos";

type Pestana = "resumen" | "pedidos" | "pagos" | "inventario" | "reparaciones" | "tecnicos" | "devoluciones";
const VENDIDO: EstadoPedido[] = ["pagado", "preparando", "en-camino", "entregado"];
const diaIso = (iso: string) => new Date(iso).toDateString();
const BORDE = "#e4dff0";
const auto = (min: string) => ({ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}), 1fr))` });

export function PanelDueno({ t, alSalir, alTienda }: { t: Tienda; alSalir: () => void; alTienda: () => void }) {
  const [pestana, setPestana] = useState<Pestana>("resumen");
  useEffect(() => {
    document.title = "Panel del dueño · Órbita Celulares · Demo de Jzet Labs";
  }, []);

  const porVerificar = t.pedidos.filter((p) => p.estado === "pago-pendiente");
  const devPend = t.devoluciones.filter((d) => d.estado === "pendiente");
  const bajos = t.productos.filter((p) => Object.values(t.stock[p.id] ?? {}).reduce((s, n) => s + n, 0) <= 3);
  const repListas = t.reparaciones.filter((r) => r.estado === "listo");

  const grupos: { g: string; items: [Pestana, string, typeof BarChart3, number?][] }[] = [
    { g: "General", items: [["resumen", "Resumen", BarChart3]] },
    { g: "Ventas", items: [["pedidos", "Pedidos", Package, t.pedidos.filter((p) => p.estado === "pagado").length], ["pagos", "Pagos", CreditCard, porVerificar.length]] },
    { g: "Tienda", items: [["inventario", "Productos", Boxes, bajos.length]] },
    { g: "Taller", items: [["reparaciones", "Reparaciones", Wrench, t.reparaciones.filter((r) => r.estado !== "entregado").length], ["tecnicos", "Técnicos", Users, t.tecnicos.filter((x) => x.activo).length]] },
    { g: "Postventa", items: [["devoluciones", "Devoluciones", Undo2, devPend.length]] },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] md:grid md:grid-cols-[15.5rem_minmax(0,1fr)]" style={{ background: FONDO, color: TINTA, fontFamily: LETRA_SISTEMA }}>
      <aside className="text-white md:sticky md:top-0 md:flex md:h-screen md:flex-col md:self-start" style={{ background: TINTA }}>
        <p className="flex items-center gap-2.5 px-4 py-4 text-[1.3rem] font-bold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-lg text-[1.05rem]" style={{ background: AMARILLO, color: TINTA }}>Ó</span><span className="leading-tight">Órbita<span className="block text-[0.78rem] font-medium opacity-60">Panel del dueño</span></span></p>
        <nav aria-label="Panel" className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-1 md:flex-col md:gap-0 md:overflow-y-auto md:px-3">
          {grupos.map(({ g, items }) => (
            <div key={g} className="flex shrink-0 gap-1 md:mt-3 md:block md:space-y-1">
              <p className="hidden px-3 pb-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white/40 md:block">{g}</p>
              {items.map(([id, tx, I, n]) => (
                <button key={id} type="button" onClick={() => setPestana(id)} aria-current={pestana === id ? "page" : undefined} className="flex min-h-[2.9rem] shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 text-left text-[0.98rem] font-semibold transition-colors hover:bg-white/10 md:w-full" style={pestana === id ? { background: AMARILLO, color: TINTA } : { color: "rgba(255,255,255,.8)" }}>
                  <I size={19} /> {tx}
                  {!!n && <span className="ml-auto min-w-5 rounded-full px-1.5 text-center text-[0.72rem] font-bold" style={pestana === id ? { background: TINTA, color: "#fff" } : { background: AMARILLO, color: TINTA }}>{n}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="hidden gap-2 border-t border-white/10 p-3 text-[0.88rem] md:grid">
          <button type="button" onClick={alTienda} className="inline-flex min-h-[2.6rem] items-center gap-2 rounded-lg px-3 hover:bg-white/10"><Store size={16} /> Ver la tienda</button>
          <button type="button" onClick={t.reiniciar} className="inline-flex min-h-[2.6rem] items-center gap-2 rounded-lg px-3 hover:bg-white/10"><RotateCcw size={16} /> Reiniciar el ejemplo</button>
          <button type="button" onClick={alSalir} className="inline-flex min-h-[2.6rem] items-center gap-2 rounded-lg px-3 hover:bg-white/10"><LogOut size={16} /> Salir</button>
        </div>
      </aside>

      <main className="min-w-0 px-[clamp(1rem,3vw,3rem)] py-6 pb-16">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
          {pestana === "resumen" && <Resumen t={t} irA={setPestana} porVerificar={porVerificar.length} devPend={devPend.length} bajos={bajos} repListas={repListas.length} />}
          {pestana === "pedidos" && <Pedidos t={t} />}
          {pestana === "pagos" && <Pagos t={t} />}
          {pestana === "inventario" && <Inventario t={t} />}
          {pestana === "reparaciones" && <Reparaciones t={t} />}
          {pestana === "tecnicos" && <Tecnicos t={t} />}
          {pestana === "devoluciones" && <Devoluciones t={t} />}
          <p className="mt-6 text-center text-xs text-black/45">Panel de demostración con datos de ejemplo. Lo que cambie aquí solo se guarda en este navegador.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 md:hidden">
          <button type="button" onClick={alTienda} className="inline-flex min-h-[2.6rem] items-center gap-2 rounded-lg border px-3 text-sm font-semibold" style={{ borderColor: BORDE }}><Store size={16} /> Ver la tienda</button>
          <button type="button" onClick={t.reiniciar} className="inline-flex min-h-[2.6rem] items-center gap-2 rounded-lg border px-3 text-sm font-semibold" style={{ borderColor: BORDE }}><RotateCcw size={16} /> Reiniciar</button>
        </div>
      </main>
    </div>
  );
}

function Titulo({ children, sub, derecha }: { children: string; sub?: string; derecha?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[clamp(1.9rem,1.5rem+1.5vw,2.8rem)] font-extrabold leading-tight tracking-[-0.02em] text-[#1c1230]">{children}</h1>
        {sub && <p className="text-[1rem] text-black/60">{sub}</p>}
      </div>
      {derecha}
    </div>
  );
}

/* caja blanca de una sección */
function Caja({ titulo, nota, derecha, className = "", children }: { titulo?: string; nota?: string; derecha?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={`min-w-0 rounded-2xl border bg-white p-4 sm:p-5 ${className}`} style={{ borderColor: BORDE }}>
      {(titulo || derecha) && (
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>{titulo && <h2 className="text-[1.12rem] font-bold leading-tight">{titulo}</h2>}{nota && <p className="text-[0.88rem] text-black/55">{nota}</p>}</div>
          {derecha}
        </div>
      )}
      {children}
    </section>
  );
}

function Tarjeta({ titulo, valor, nota, alerta }: { titulo: string; valor: string | number; nota?: string; alerta?: boolean }) {
  return (
    <div className="rounded-2xl border bg-white p-4" style={{ borderColor: alerta ? "#f0b8a0" : BORDE }}>
      <p className="text-[0.88rem] font-semibold text-black/55">{titulo}</p>
      <p className="mt-1 text-[1.9rem] font-extrabold leading-none" style={alerta ? { color: "#c2410c" } : undefined}>{valor}</p>
      {nota && <p className="mt-1.5 text-[0.8rem] text-black/50">{nota}</p>}
    </div>
  );
}

/* botones de un toque, con reacción al pasar encima */
const BTN = "inline-flex min-h-[2.6rem] items-center justify-center gap-1.5 rounded-lg px-3.5 text-[0.9rem] font-bold transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.97]";
const principal = { background: PRIMARIO, color: "#fff" };

/* ---------------- resumen ---------------- */

function Resumen({ t, irA, porVerificar, devPend, bajos, repListas }: { t: Tienda; irA: (p: Pestana) => void; porVerificar: number; devPend: number; bajos: Producto[]; repListas: number }) {
  const vendidos = t.pedidos.filter((p) => VENDIDO.includes(p.estado));
  const hoy = new Date().toDateString();
  const ventasHoy = vendidos.filter((p) => diaIso(p.fecha) === hoy);
  const totalHoy = ventasHoy.reduce((s, p) => s + p.total, 0);
  const total7 = vendidos.reduce((s, p) => s + p.total, 0);
  const ticket = vendidos.length ? Math.round(total7 / vendidos.length) : 0;
  const rechazados = t.pedidos.filter((p) => p.estado === "rechazado").length;
  const unidades = (id: string) => Object.values(t.stock[id] ?? {}).reduce((s, n) => s + n, 0);

  const dias = useMemo(() => {
    const out: { d: Date; q: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      out.push({ d, q: vendidos.filter((p) => diaIso(p.fecha) === d.toDateString()).reduce((s, p) => s + p.total, 0) });
    }
    return out;
  }, [vendidos]);
  const max = Math.max(1, ...dias.map((x) => x.q));
  const porSucursal = SUCURSALES.map((s) => ({ s, q: vendidos.filter((p) => p.sucursal === s.id).reduce((a, p) => a + p.total, 0) }));
  const maxS = Math.max(1, ...porSucursal.map((x) => x.q));
  const tarjeta = vendidos.filter((p) => p.metodo === "tarjeta").reduce((s, p) => s + p.total, 0);
  const top = t.productos.map((p) => ({ p, n: vendidos.reduce((s, x) => s + x.lineas.filter((l) => l.id === p.id).reduce((a, l) => a + l.cantidad, 0), 0) }))
    .filter((x) => x.n)
    .sort((a, b) => b.n - a.n)
    .slice(0, 5);

  const atencion = [
    { n: porVerificar, t: porVerificar === 1 ? "transferencia por verificar" : "transferencias por verificar", ir: "pagos" as Pestana, I: CreditCard },
    { n: devPend, t: devPend === 1 ? "devolución por revisar" : "devoluciones por revisar", ir: "devoluciones" as Pestana, I: Undo2 },
    { n: bajos.length, t: bajos.length === 1 ? "producto con poco stock" : "productos con poco stock", ir: "inventario" as Pestana, I: Boxes },
    { n: repListas, t: repListas === 1 ? "reparación lista para entregar" : "reparaciones listas para entregar", ir: "reparaciones" as Pestana, I: Wrench },
  ];

  return (
    <>
      <Titulo sub="Lo que pasó en la tienda en los últimos 7 días.">Resumen</Titulo>

      <section className="grid grid-cols-[minmax(0,1fr)] gap-5 rounded-2xl p-5 text-white sm:p-7 lg:grid-cols-[1.4fr_1fr]" style={{ background: PRIMARIO }}>
        <div>
          <p className="text-[1.05rem] font-semibold opacity-85">Ventas de la semana</p>
          <p className="mt-1 text-[clamp(3rem,2.4rem+3vw,5rem)] font-extrabold leading-none">{qz(total7)}</p>
          <p className="mt-2 text-[1.02rem] opacity-85">{vendidos.length} pedidos pagados · ticket promedio {qz(ticket)}</p>
        </div>
        <dl className="grid grid-cols-2 gap-3 self-center">
          <div className="rounded-xl bg-black/15 p-4"><dt className="text-[0.95rem] opacity-85">Ventas de hoy</dt><dd className="mt-1 text-[1.9rem] font-extrabold leading-none">{qz(totalHoy)}</dd><dd className="mt-1 text-[0.85rem] opacity-75">{ventasHoy.length} {ventasHoy.length === 1 ? "pedido" : "pedidos"}</dd></div>
          <div className="rounded-xl bg-black/15 p-4"><dt className="text-[0.95rem] opacity-85">Pagos rechazados</dt><dd className="mt-1 text-[1.9rem] font-extrabold leading-none">{rechazados}</dd><dd className="mt-1 text-[0.85rem] opacity-75">No se cobró nada</dd></div>
        </dl>
      </section>

      <div className="grid gap-3" style={auto("15rem")}>
        {atencion.map((a) => (
          <button key={a.t} type="button" onClick={() => irA(a.ir)} className="flex min-h-[4.5rem] items-center gap-3 rounded-2xl border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: a.n ? "#f0b8a0" : BORDE }}>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl" style={a.n ? { background: "#fff1d6", color: "#8a4b00" } : { background: LAVANDA, color: PRIMARIO }}><a.I size={22} /></span>
            <span className="min-w-0 flex-1 leading-tight"><b className="block text-[1.6rem]">{a.n}</b><span className="text-[0.88rem] text-black/60">{a.t}</span></span>
            <ArrowRight size={18} className="shrink-0 text-black/35" />
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <Caja className="lg:col-span-7" titulo="Ventas por día">
          <div className="flex h-48 items-end gap-2">
            {dias.map(({ d, q }) => (
              <div key={d.toDateString()} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <span className="text-[0.68rem] font-semibold text-black/50">{q ? `Q${Math.round(q / 1000)}k` : ""}</span>
                <div className="w-full rounded-t-lg" style={{ height: `${(q / max) * 100}%`, minHeight: 4, background: d.toDateString() === new Date().toDateString() ? PRIMARIO : "#c9d4f5" }} />
                <span className="text-[0.74rem] text-black/50">{d.toLocaleDateString("es-GT", { weekday: "short" })}</span>
              </div>
            ))}
          </div>
        </Caja>
        <Caja className="lg:col-span-5" titulo="Por punto de venta y forma de pago">
          <ul className="space-y-3">
            {porSucursal.map(({ s, q }) => (
              <li key={s.id}>
                <div className="flex justify-between text-[0.95rem]"><span className="font-semibold">{s.nombre}</span><span>{qz(q)}</span></div>
                <div className="mt-1 h-2.5 rounded-full bg-black/5"><div className="h-full rounded-full" style={{ width: `${(q / maxS) * 100}%`, background: TINTA }} /></div>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.95rem] font-bold">Cómo pagan</p>
          <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-black/5"><div style={{ width: `${total7 ? (tarjeta / total7) * 100 : 0}%`, background: PRIMARIO }} /><div className="flex-1" style={{ background: AMARILLO }} /></div>
          <div className="mt-2 flex justify-between text-[0.85rem]">
            <span><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: PRIMARIO }} />Tarjeta {qz(tarjeta)}</span>
            <span><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: AMARILLO }} />Transferencia {qz(total7 - tarjeta)}</span>
          </div>
        </Caja>
        <Caja className="lg:col-span-7" titulo="Lo más vendido">
          <div className="grid gap-3" style={auto("13rem")}>
            {top.map(({ p, n }) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: FONDO }}>
                <img src={p.foto} alt="" className="h-12 w-11 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0"><p className="truncate text-[0.92rem] font-semibold">{p.nombre}</p><p className="text-[0.82rem] text-black/55">{n} vendidos</p></div>
              </div>
            ))}
          </div>
        </Caja>
        <Caja className="lg:col-span-5" titulo="Poco stock" nota="Productos con 3 unidades o menos en total." derecha={<button type="button" onClick={() => irA("inventario")} className="text-[0.88rem] font-bold underline" style={{ color: PRIMARIO }}>Ver productos</button>}>
          {bajos.length === 0 ? <p className="rounded-xl py-5 text-center text-black/50" style={{ background: FONDO }}>Todo con existencias suficientes.</p> : (
            <ul className="space-y-2">{bajos.slice(0, 5).map((p) => <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2" style={{ background: FONDO }}><span className="flex min-w-0 items-center gap-2.5"><img src={p.foto} alt="" className="h-9 w-9 shrink-0 rounded-md object-cover" /><span className="truncate text-[0.92rem] font-semibold">{p.nombre}</span></span><span className="shrink-0 rounded px-2 py-0.5 text-[0.8rem] font-bold" style={{ background: unidades(p.id) === 0 ? "#fde4e1" : "#fff1d6", color: unidades(p.id) === 0 ? "#b42318" : "#8a4b00" }}>{unidades(p.id) === 0 ? "Agotado" : `Quedan ${unidades(p.id)}`}</span></li>)}</ul>
          )}
        </Caja>
      </div>
    </>
  );
}

/* ---------------- pedidos: columnas por estado ---------------- */

const SIGUIENTE: Partial<Record<EstadoPedido, { a: EstadoPedido; texto: string }>> = {
  "pago-pendiente": { a: "pagado", texto: "Confirmar pago" },
  pagado: { a: "preparando", texto: "Preparar" },
  preparando: { a: "en-camino", texto: "Enviar" },
  "en-camino": { a: "entregado", texto: "Entregado" },
};
const COLUMNAS: EstadoPedido[] = ["pago-pendiente", "pagado", "preparando", "en-camino", "entregado"];
const textoMetodo = (p: Pedido) => (p.metodo === "tarjeta" ? `Tarjeta ···${p.tarjeta}` : p.metodo === "transferencia" ? "Transferencia" : "Paga al recibir");

function Pedidos({ t }: { t: Tienda }) {
  const [q, setQ] = useState("");
  const [abierto, setAbierto] = useState<string | null>(null);
  const coincide = (p: Pedido) => `${p.id} ${p.cliente} ${p.telefono}`.toLowerCase().includes(q.toLowerCase().trim());
  const mover = (p: Pedido, a: EstadoPedido) =>
    t.setPedidos((ps) => ps.map((x) => (x.id === p.id ? { ...x, estado: a, guia: a === "en-camino" && !x.guia ? `GT-${String(Date.now()).slice(-6)}` : x.guia, nuevo: false } : x)));
  const otros = t.pedidos.filter((p) => (p.estado === "rechazado" || p.estado === "devuelto") && coincide(p));
  return (
    <>
      <Titulo sub="Cada pedido avanza de columna con un toque. El cliente lo ve al instante en Rastreo." derecha={<label className="relative w-full sm:w-72"><span className="sr-only">Buscar pedido</span><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por código, nombre o teléfono" className="min-h-[2.8rem] w-full rounded-lg border bg-white pl-9 pr-3 text-[0.92rem]" style={{ borderColor: BORDE }} /></label>}>Pedidos</Titulo>
      <div className="grid items-start gap-4" style={auto("14.5rem")}>
        {COLUMNAS.map((est) => {
          const lista = t.pedidos.filter((p) => p.estado === est && coincide(p));
          const e = ESTADOS_PEDIDO[est];
          return (
            <section key={est} className="min-w-0 rounded-2xl p-3" style={{ background: "#ece8f5" }}>
              <h2 className="mb-3 flex items-center justify-between gap-2 px-1 text-[0.98rem] font-bold"><span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: e.color }} />{est === "pago-pendiente" ? "Por confirmar pago" : e.texto}</span><span className="rounded-md bg-white px-2 text-[0.85rem]">{lista.length}</span></h2>
              <ul className="space-y-2.5">
                {lista.map((p) => {
                  const sig = SIGUIENTE[p.estado];
                  return (
                    <li key={p.id} className={`rounded-xl bg-white p-3.5 ${p.nuevo ? "ring-2" : ""}`} style={p.nuevo ? { ["--tw-ring-color" as string]: PRIMARIO } : undefined}>
                      <button type="button" onClick={() => setAbierto(abierto === p.id ? null : p.id)} aria-expanded={abierto === p.id} className="w-full text-left">
                        <span className="flex items-center justify-between gap-2"><span className="flex items-center gap-2"><span className="font-mono font-bold">{p.id}</span>{p.nuevo && <span className="rounded px-1.5 text-[0.68rem] font-bold text-white" style={{ background: PRIMARIO }}>Nuevo</span>}</span><ChevronDown size={16} className={`text-black/40 transition ${abierto === p.id ? "rotate-180" : ""}`} /></span>
                        <span className="mt-0.5 block font-semibold leading-tight">{p.cliente}</span>
                        <span className="block text-[0.82rem] text-black/55">{fechaCorta(p.fecha)} · {textoMetodo(p)}</span>
                        <span className="mt-1 block text-[1.15rem] font-extrabold">{qz(p.total)}</span>
                      </button>
                      {abierto === p.id && (
                        <div className="mt-2 border-t pt-2 text-[0.86rem]" style={{ borderColor: BORDE }}>
                          <ul className="space-y-1">{p.lineas.map((l) => <li key={l.id + l.detalle} className="flex justify-between gap-2"><span>{l.cantidad} × {l.nombre} <span className="text-black/50">{l.detalle}</span></span><span>{qz(l.precio * l.cantidad)}</span></li>)}</ul>
                          <p className="mt-2 text-black/60">{p.entrega.tipo === "envio" ? `Envío a: ${p.entrega.direccion}` : `Recoge en ${sucursalPor(p.entrega.sucursal).nombre}`} · Tel. {p.telefono}{p.cuotas && p.cuotas > 1 ? ` · ${p.cuotas} cuotas` : ""}{p.guia ? ` · Guía ${p.guia}` : ""}</p>
                        </div>
                      )}
                      {sig && <button type="button" onClick={() => mover(p, sig.a)} className={`${BTN} mt-3 w-full`} style={principal}>{sig.texto} <ArrowRight size={16} /></button>}
                    </li>
                  );
                })}
                {!lista.length && <li className="rounded-xl border border-dashed px-3 py-6 text-center text-[0.88rem] text-black/45" style={{ borderColor: "#cfc7e0" }}>Sin pedidos</li>}
              </ul>
            </section>
          );
        })}
      </div>
      <Caja titulo="Rechazados y devueltos" nota="No se cobró ningún pago rechazado.">
        {otros.length === 0 ? <p className="py-3 text-center text-black/50">No hay pedidos en este grupo.</p> : (
          <ul className="grid gap-2" style={auto("22rem")}>{otros.map((p) => <li key={p.id} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5" style={{ background: FONDO }}><span className="font-mono font-bold">{p.id}</span><span className="min-w-0 flex-1 leading-tight"><b className="block truncate">{p.cliente}</b><span className="text-[0.82rem] text-black/55">{fechaCorta(p.fecha)} · {qz(p.total)}</span></span><span className="shrink-0 rounded px-2 py-0.5 text-[0.78rem] font-bold" style={{ background: ESTADOS_PEDIDO[p.estado].fondo, color: ESTADOS_PEDIDO[p.estado].color }}>{ESTADOS_PEDIDO[p.estado].texto}</span></li>)}</ul>
        )}
      </Caja>
    </>
  );
}

/* ---------------- pagos ---------------- */

function Pagos({ t }: { t: Tienda }) {
  const pendientes = t.pedidos.filter((p) => p.estado === "pago-pendiente");
  const rechazados = t.pedidos.filter((p) => p.estado === "rechazado");
  const vendidos = t.pedidos.filter((p) => VENDIDO.includes(p.estado));
  const tarjeta = vendidos.filter((p) => p.metodo === "tarjeta").reduce((s, p) => s + p.total, 0);
  const transf = vendidos.filter((p) => p.metodo === "transferencia").reduce((s, p) => s + p.total, 0);
  const alRecibir = vendidos.filter((p) => p.metodo !== "tarjeta" && p.metodo !== "transferencia").reduce((s, p) => s + p.total, 0);
  const decidir = (p: Pedido, ok: boolean) => {
    t.setPedidos((ps) => ps.map((x) => (x.id === p.id ? { ...x, estado: ok ? "pagado" : "rechazado", motivoRechazo: ok ? undefined : "Comprobante no coincide con el depósito", nuevo: false } : x)));
    if (ok)
      t.setStock((s) => {
        const n = structuredClone(s);
        p.lineas.forEach((l) => {
          const suc = Object.keys(n[l.id] ?? {}).find((k) => n[l.id][k] > 0);
          if (suc) n[l.id][suc] = Math.max(0, n[l.id][suc] - l.cantidad);
        });
        return n;
      });
  };
  return (
    <>
      <Titulo sub="Confirme las transferencias contra el estado de cuenta. El cliente se entera en Rastreo.">Pagos</Titulo>
      <div className="grid gap-3" style={auto("14rem")}>
        <Tarjeta titulo="Por verificar" valor={pendientes.length} nota={qz(pendientes.reduce((s, p) => s + p.total, 0))} alerta={pendientes.length > 0} />
        <Tarjeta titulo="Cobrado con tarjeta" valor={qz(tarjeta)} />
        <Tarjeta titulo="Cobrado por transferencia" valor={qz(transf)} />
        <Tarjeta titulo="Pagos rechazados" valor={rechazados.length} nota="No se cobró nada" alerta={rechazados.length > 0} />
        {alRecibir > 0 && <Tarjeta titulo="Pago al recibir" valor={qz(alRecibir)} />}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Caja titulo={`Transferencias por verificar (${pendientes.length})`} nota="Compare el comprobante con el depósito.">
          <ul className="space-y-2">
            {pendientes.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl p-3.5" style={{ background: FONDO }}>
                <span className="font-mono font-bold">{p.id}</span>
                <span className="min-w-[8rem] flex-1 leading-tight"><b className="block">{p.cliente}</b><span className="text-[0.82rem] text-black/55">{fechaCorta(p.fecha)} · comprobante adjunto</span></span>
                <b className="text-[1.1rem]">{qz(p.total)}</b>
                <button type="button" onClick={() => decidir(p, true)} className={BTN} style={{ background: "#1f7a3a", color: "#fff" }}><Check size={16} /> Confirmar</button>
                <button type="button" onClick={() => decidir(p, false)} className={BTN} style={{ background: "#fde4e1", color: "#b42318" }}><X size={16} /> Rechazar</button>
              </li>
            ))}
            {!pendientes.length && <li className="rounded-xl py-6 text-center text-black/50" style={{ background: FONDO }}>No hay transferencias pendientes.</li>}
          </ul>
        </Caja>
        <Caja titulo={`Pagos rechazados (${rechazados.length})`} nota="Ningún rechazo se cobró. Puede escribirle al cliente para que intente con otra tarjeta.">
          <ul className="space-y-2">
            {rechazados.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl p-3.5" style={{ background: FONDO }}>
                <span className="font-mono font-bold">{p.id}</span>
                <span className="min-w-[8rem] flex-1 leading-tight"><b className="block">{p.cliente}</b><span className="text-[0.82rem] text-black/55">{fechaCorta(p.fecha)} · {textoMetodo(p)}</span></span>
                <b className="text-[1.1rem]">{qz(p.total)}</b>
                <span className="rounded px-2 py-0.5 text-[0.78rem] font-bold" style={{ background: "#fde4e1", color: "#b42318" }}>{p.motivoRechazo}</span>
              </li>
            ))}
            {!rechazados.length && <li className="rounded-xl py-6 text-center text-black/50" style={{ background: FONDO }}>Sin pagos rechazados.</li>}
          </ul>
        </Caja>
      </div>
    </>
  );
}

/* ---------------- productos: fotos, precios, stock y visibilidad ---------------- */

/* la foto que sube el dueño se achica en el navegador antes de guardarla */
function achicarFoto(archivo: File): Promise<string> {
  return new Promise((ok, mal) => {
    const lector = new FileReader();
    lector.onerror = mal;
    lector.onload = () => {
      const img = new Image();
      img.onerror = mal;
      img.onload = () => {
        const max = 700;
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
        ok(c.toDataURL("image/jpeg", 0.8));
      };
      img.src = String(lector.result);
    };
    lector.readAsDataURL(archivo);
  });
}

function Inventario({ t }: { t: Tienda }) {
  const [buscar, setBuscar] = useState("");
  const [nuevo, setNuevo] = useState(false);
  const total = (id: string) => Object.values(t.stock[id] ?? {}).reduce((a, n) => a + n, 0);
  const cambiarStock = (id: string, suc: string, d: number) => t.setStock((s) => ({ ...s, [id]: { ...(s[id] ?? {}), [suc]: Math.max(0, (s[id]?.[suc] ?? 0) + d) } }));
  const editar = (id: string, cambio: Partial<Producto>) => t.setProductos((ps) => ps.map((p) => (p.id === id ? { ...p, ...cambio } : p)));
  const lista = t.productos.filter((p) => `${p.marca} ${p.nombre}`.toLowerCase().includes(buscar.toLowerCase().trim()));
  const valor = t.productos.reduce((s, p) => s + total(p.id) * p.variantes[0].precio, 0);
  const fila = "lg:grid-cols-[4rem_minmax(0,1fr)_8rem_minmax(0,3.2fr)_6.5rem_2.6rem]";
  return (
    <>
      <Titulo sub="Cambie fotos, precios y existencias. El cliente nunca ve los números, solo si hay." derecha={<button type="button" onClick={() => setNuevo(true)} className={BTN} style={principal}><Plus size={17} /> Nuevo producto</button>}>Productos</Titulo>
      <div className="grid gap-3" style={auto("14rem")}>
        <Tarjeta titulo="Unidades en tienda" valor={t.productos.reduce((s, p) => s + total(p.id), 0)} />
        <Tarjeta titulo="Valor del inventario" valor={qz(valor)} nota="A precio con tarjeta" />
        <Tarjeta titulo="Productos" valor={t.productos.length} nota={`${t.productos.filter((p) => p.visible === false).length} ocultos`} />
        <Tarjeta titulo="Con poco stock" valor={t.productos.filter((p) => total(p.id) <= 3).length} nota="3 unidades o menos" alerta={t.productos.some((p) => total(p.id) <= 3)} />
      </div>
      {nuevo && <NuevoProducto t={t} alCerrar={() => setNuevo(false)} />}
      <Caja className="!p-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <label className="relative w-full sm:w-80"><span className="sr-only">Buscar producto</span><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" /><input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar producto" className="min-h-[2.8rem] w-full rounded-lg border bg-white pl-9 pr-3" style={{ borderColor: BORDE }} /></label>
          <p className="text-[0.85rem] text-black/50">Toque la foto para cambiarla. El ojo oculta o muestra el producto en la tienda.</p>
        </div>
        <div className={`hidden gap-3 border-y px-4 py-2 text-[0.75rem] font-bold uppercase tracking-wide text-black/45 lg:grid ${fila}`} style={{ borderColor: BORDE, background: FONDO }}><span /><span>Producto</span><span>Precio</span><span>Existencias por sucursal</span><span>Estado</span><span /></div>
        <ul>
          {lista.map((p) => {
            const n = total(p.id);
            return (
              <li key={p.id} className={`grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-x-3 gap-y-3 border-b px-4 py-3 last:border-0 ${fila} ${p.visible === false ? "opacity-60" : ""}`} style={{ borderColor: BORDE }}>
                <label className="group relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl" title="Cambiar foto">
                  <img src={p.foto} alt="" className="h-full w-full object-cover" />
                  <span className="absolute inset-0 grid place-items-center bg-black/45 text-white opacity-0 transition group-hover:opacity-100"><Camera size={18} /></span>
                  <input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; if (f) editar(p.id, { foto: await achicarFoto(f) }); }} />
                </label>
                <div className="min-w-0"><p className="font-semibold leading-tight">{p.nombre}</p><p className="text-[0.8rem] text-black/50">{p.marca} · {p.categoria} · {p.condicion}</p></div>
                <label className="col-span-2 inline-flex items-center gap-1 text-[0.85rem] lg:col-span-1"><span className="text-black/50">Q</span><input type="number" aria-label={`Precio de ${p.nombre}`} value={p.variantes[0].precio} onChange={(e) => editar(p.id, { variantes: p.variantes.map((v, i) => (i === 0 ? { ...v, precio: Math.max(0, Number(e.target.value) || 0) } : v)) })} className="w-28 rounded-lg border px-2 py-1.5 font-semibold" style={{ borderColor: BORDE }} /></label>
                <div className="col-span-2 flex flex-wrap items-center gap-2 lg:col-span-1">
                  {SUCURSALES.map((s) => {
                    const k = t.stock[p.id]?.[s.id] ?? 0;
                    return (
                      <span key={s.id} className="flex items-center gap-1 rounded-lg px-1.5 py-1 text-[0.8rem]" style={{ background: FONDO }}>
                        <span className="px-1 text-black/55">{s.nombre}</span>
                        <button type="button" aria-label={`Quitar uno en ${s.nombre}`} onClick={() => cambiarStock(p.id, s.id, -1)} className="grid h-7 w-7 place-items-center rounded-md bg-white transition hover:bg-[#ece6ff]"><Minus size={13} /></button>
                        <span className={`w-6 text-center font-bold tabular-nums ${k === 0 ? "text-[#b42318]" : ""}`}>{k}</span>
                        <button type="button" aria-label={`Agregar uno en ${s.nombre}`} onClick={() => cambiarStock(p.id, s.id, 1)} className="grid h-7 w-7 place-items-center rounded-md bg-white transition hover:bg-[#ece6ff]"><Plus size={13} /></button>
                      </span>
                    );
                  })}
                </div>
                <span className="col-span-1 text-[0.85rem] font-bold lg:col-span-1" style={{ color: n === 0 ? "#b42318" : n <= 3 ? "#c2410c" : "#4b4560" }}>{n === 0 ? "Agotado" : n <= 3 ? `Quedan ${n}` : `${n} en total`}</span>
                <button type="button" onClick={() => editar(p.id, { visible: p.visible === false })} title={p.visible === false ? "Mostrar en la tienda" : "Ocultar de la tienda"} aria-label={p.visible === false ? "Mostrar en la tienda" : "Ocultar de la tienda"} className="grid h-10 w-10 place-items-center justify-self-end rounded-lg transition hover:bg-[#ece6ff]" style={{ background: FONDO }}>{p.visible === false ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </li>
            );
          })}
          {!lista.length && <li className="p-8 text-center text-black/50">Ningún producto coincide.</li>}
        </ul>
      </Caja>
    </>
  );
}

function NuevoProducto({ t, alCerrar }: { t: Tienda; alCerrar: () => void }) {
  const [f, setF] = useState({ nombre: "", marca: "", categoria: "Celulares" as Producto["categoria"], condicion: "Nuevo" as Producto["condicion"], precio: "", stock: "1", foto: "" });
  const [error, setError] = useState("");
  const campo = "mt-1 w-full rounded-lg border border-black/15 px-3 py-2 focus:outline-none focus:border-[#6d28d9]";
  return (
    <form
      className="mt-4 rounded-2xl bg-white p-4 sm:p-5 grid sm:grid-cols-[120px_1fr] gap-4"
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

/* ---------------- reparaciones: columnas por estado, técnico asignado ---------------- */

function Reparaciones({ t }: { t: Tienda }) {
  const editar = (id: string, cambio: Partial<Reparacion>) => t.setReparaciones((rs) => rs.map((r) => (r.id === id ? { ...r, ...cambio, nueva: false } : r)));
  const columnas = PASOS_REPARACION.slice(0, 4);
  const entregadas = t.reparaciones.filter((r) => r.estado === "entregado");
  return (
    <>
      <Titulo sub="Asigne un técnico y avance cada equipo de columna con un toque. El cliente lo ve con su código en Rastreo.">Reparaciones</Titulo>
      <div className="grid items-start gap-4" style={auto("17rem")}>
        {columnas.map((est) => {
          const lista = t.reparaciones.filter((r) => r.estado === est);
          const sig = PASOS_REPARACION[PASOS_REPARACION.indexOf(est) + 1];
          return (
            <section key={est} className="min-w-0 rounded-2xl p-3" style={{ background: "#ece8f5" }}>
              <h2 className="mb-3 flex items-center justify-between px-1 text-[0.98rem] font-bold"><span>{TEXTO_REPARACION[est]}</span><span className="rounded-md bg-white px-2 text-[0.85rem]">{lista.length}</span></h2>
              <ul className="space-y-2.5">
                {lista.map((r) => (
                  <li key={r.id} className={`rounded-xl bg-white p-3.5 ${r.nueva ? "ring-2" : ""}`} style={r.nueva ? { ["--tw-ring-color" as string]: PRIMARIO } : undefined}>
                    <div className="flex items-center justify-between"><span className="font-mono font-bold">{r.id}</span><span className="text-[0.8rem] text-black/50">{fechaCorta(r.fecha)}</span></div>
                    <p className="mt-1 font-semibold leading-tight">{r.cliente}</p>
                    <p className="text-[0.86rem] text-black/60">{r.modelo} · {r.falla}</p>
                    <p className="text-[0.8rem] text-black/50">{sucursalPor(r.sucursal).nombre} · {qz(r.precio)}</p>
                    <label className="mt-2.5 block text-[0.78rem] font-semibold text-black/55">Técnico
                      <select value={r.tecnico ?? ""} onChange={(e) => editar(r.id, { tecnico: e.target.value || undefined })} className="mt-1 w-full rounded-lg border bg-white px-2 py-2 text-[0.88rem] font-semibold text-black" style={{ borderColor: BORDE }}>
                        <option value="">Sin asignar</option>
                        {t.tecnicos.filter((x) => x.activo).map((x) => <option key={x.id} value={x.id}>{x.nombre} · {x.especialidad}</option>)}
                      </select>
                    </label>
                    {sig && <button type="button" onClick={() => editar(r.id, { estado: sig })} className={`${BTN} mt-3 w-full`} style={principal}>{TEXTO_REPARACION[sig]} <ArrowRight size={16} /></button>}
                  </li>
                ))}
                {!lista.length && <li className="rounded-xl border border-dashed px-3 py-6 text-center text-[0.88rem] text-black/45" style={{ borderColor: "#cfc7e0" }}>Sin equipos</li>}
              </ul>
            </section>
          );
        })}
      </div>
      <Caja titulo={`Entregadas (${entregadas.length})`}>
        {entregadas.length === 0 ? <p className="py-3 text-center text-black/50">Todavía no hay entregas.</p> : <ul className="grid gap-2" style={auto("20rem")}>{entregadas.map((r) => <li key={r.id} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5" style={{ background: FONDO }}><span className="font-mono font-bold">{r.id}</span><span className="min-w-0 flex-1 leading-tight"><b className="block truncate">{r.cliente}</b><span className="text-[0.82rem] text-black/55">{r.modelo} · {qz(r.precio)}</span></span></li>)}</ul>}
      </Caja>
    </>
  );
}

/* ---------------- red de técnicos ---------------- */

function Tecnicos({ t }: { t: Tienda }) {
  const [f, setF] = useState({ nombre: "", especialidad: "", sucursal: SUCURSALES[0].id, telefono: "" });
  const carga = (id: string) => t.reparaciones.filter((r) => r.tecnico === id && r.estado !== "entregado").length;
  const campo = "min-h-[2.8rem] w-full rounded-lg border bg-white px-3";
  return (
    <>
      <Titulo sub="La red de técnicos: quién repara qué, en qué sucursal y cuánto trabajo tiene ahora.">Técnicos</Titulo>
      <div className="grid gap-4" style={auto("22rem")}>
        {t.tecnicos.map((x) => (
          <div key={x.id} className={`flex items-center gap-3 rounded-2xl border bg-white p-4 ${x.activo ? "" : "opacity-60"}`} style={{ borderColor: BORDE }}>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full font-bold text-white" style={{ background: PRIMARIO }}>{x.nombre.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{x.nombre}</p>
              <p className="text-[0.85rem] text-black/55">{x.especialidad} · {sucursalPor(x.sucursal).nombre}</p>
              <p className="inline-flex items-center gap-1 text-[0.85rem] text-black/55"><Phone size={12} /> {x.telefono} · {carga(x.id)} {carga(x.id) === 1 ? "equipo" : "equipos"} en curso</p>
            </div>
            <button type="button" onClick={() => t.setTecnicos((ts) => ts.map((y) => (y.id === x.id ? { ...y, activo: !y.activo } : y)))} className="min-h-[2.4rem] rounded-lg px-3 text-[0.8rem] font-bold transition hover:-translate-y-0.5 hover:shadow" style={x.activo ? { background: "#e1f5e6", color: "#1f7a3a" } : { background: "#eceef1", color: "#5b5f66" }}>{x.activo ? "Disponible" : "No disponible"}</button>
          </div>
        ))}
      </div>
      <Caja titulo="Agregar técnico">
        <form className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 13rem), 1fr))" }} onSubmit={(e) => { e.preventDefault(); if (!f.nombre.trim()) return; t.setTecnicos((ts) => [...ts, { id: `T${Date.now()}`, nombre: f.nombre.trim(), especialidad: f.especialidad.trim() || "General", sucursal: f.sucursal, telefono: f.telefono.trim(), activo: true }]); setF({ nombre: "", especialidad: "", sucursal: SUCURSALES[0].id, telefono: "" }); }}>
          <input aria-label="Nombre del técnico" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} placeholder="Nombre del técnico" className={campo} style={{ borderColor: BORDE }} />
          <input aria-label="Especialidad" value={f.especialidad} onChange={(e) => setF({ ...f, especialidad: e.target.value })} placeholder="Especialidad" className={campo} style={{ borderColor: BORDE }} />
          <select aria-label="Sucursal" value={f.sucursal} onChange={(e) => setF({ ...f, sucursal: e.target.value })} className={campo} style={{ borderColor: BORDE }}>{SUCURSALES.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}</select>
          <input aria-label="Teléfono" value={f.telefono} onChange={(e) => setF({ ...f, telefono: e.target.value })} placeholder="Teléfono" className={campo} style={{ borderColor: BORDE }} />
          <button type="submit" className={BTN} style={principal}><Plus size={16} /> Agregar</button>
        </form>
      </Caja>
    </>
  );
}

/* ---------------- devoluciones ---------------- */

function Devoluciones({ t }: { t: Tienda }) {
  const decidir = (id: string, ok: boolean) => {
    const d = t.devoluciones.find((x) => x.id === id)!;
    t.setDevoluciones((ds) => ds.map((x) => (x.id === id ? { ...x, estado: ok ? "aprobada" : "rechazada", nueva: false } : x)));
    if (ok) {
      const p = t.pedidos.find((x) => x.id === d.pedido);
      t.setPedidos((ps) => ps.map((x) => (x.id === d.pedido ? { ...x, estado: "devuelto" } : x)));
      // el producto vuelve al inventario de la sucursal que lo vendió
      if (p)
        t.setStock((s) => {
          const n = structuredClone(s);
          p.lineas.forEach((l) => {
            n[l.id] = n[l.id] ?? {};
            n[l.id][p.sucursal] = (n[l.id][p.sucursal] ?? 0) + l.cantidad;
          });
          return n;
        });
    }
  };
  const fila = (d: (typeof t.devoluciones)[number]) => {
    const p = t.pedidos.find((x) => x.id === d.pedido);
    return (
      <li key={d.id} className={`rounded-xl p-3.5 ${d.nueva ? "ring-2" : ""}`} style={{ background: FONDO, ...(d.nueva ? { ["--tw-ring-color" as string]: PRIMARIO } : {}) }}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono font-bold">{d.id}</span>
          <span className="min-w-[10rem] flex-1 leading-tight"><b className="block">{d.motivo} <span className="font-normal text-black/50">· pedido {d.pedido}</span></b><span className="text-[0.84rem] text-black/55">{p ? `${p.cliente} · ${p.lineas.map((l) => l.nombre).join(", ")} · ${qz(p.total)}` : ""} · {fechaCorta(d.fecha)}</span></span>
          {d.estado === "pendiente" ? (
            <>
              <button type="button" onClick={() => decidir(d.id, true)} className={BTN} style={{ background: "#1f7a3a", color: "#fff" }}><Check size={16} /> Aprobar y reembolsar</button>
              <button type="button" onClick={() => decidir(d.id, false)} className={BTN} style={{ background: "#fde4e1", color: "#b42318" }}><X size={16} /> No procede</button>
            </>
          ) : (
            <span className="rounded px-2.5 py-1 text-[0.8rem] font-bold" style={d.estado === "aprobada" ? { background: "#e1f5e6", color: "#1f7a3a" } : { background: "#fde4e1", color: "#b42318" }}>{d.estado === "aprobada" ? "Aprobada" : "No procede"}</span>
          )}
        </div>
        {d.detalle && <p className="mt-1.5 text-[0.88rem] text-black/60">“{d.detalle}”</p>}
      </li>
    );
  };
  const pend = t.devoluciones.filter((d) => d.estado === "pendiente");
  const hechas = t.devoluciones.filter((d) => d.estado !== "pendiente");
  return (
    <>
      <Titulo sub="Al aprobar, el pedido queda como devuelto y el producto regresa al inventario.">Devoluciones</Titulo>
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <Caja titulo={`Por revisar (${pend.length})`}>{pend.length ? <ul className="space-y-2.5">{pend.map(fila)}</ul> : <p className="rounded-xl py-6 text-center text-black/50" style={{ background: FONDO }}>No hay devoluciones pendientes.</p>}</Caja>
        <Caja titulo={`Resueltas (${hechas.length})`}>{hechas.length ? <ul className="space-y-2.5">{hechas.map(fila)}</ul> : <p className="rounded-xl py-6 text-center text-black/50" style={{ background: FONDO }}>Aún no hay devoluciones resueltas.</p>}</Caja>
      </div>
    </>
  );
}
