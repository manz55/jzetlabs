/*
 * Panel del dueño de Órbita Celulares. Solo lo ve el dueño (en la tienda real,
 * con usuario y contraseña). Ventas, pedidos, pagos por verificar y rechazados,
 * inventario por sucursal, reparaciones y devoluciones. Lo que hace el cliente
 * en la tienda aparece aquí.
 */
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, BarChart3, Boxes, Check, CreditCard, LogOut, Minus, Package, Plus, RotateCcw, Store, Undo2, Wrench, X,
} from "lucide-react";
import { qz } from "../comun";
import {
  COBALTO, ESTADOS_PEDIDO, FONDO, AMARILLO, PASOS_REPARACION, PRODUCTOS, SUCURSALES, TEXTO_REPARACION, TINTA, TITULO,
  fechaCorta, sucursalPor,
  type EstadoPedido, type Pedido, type Tienda,
} from "./datos";

type Pestana = "resumen" | "pedidos" | "pagos" | "inventario" | "reparaciones" | "devoluciones";
const VENDIDO: EstadoPedido[] = ["pagado", "preparando", "en-camino", "entregado"];
const diaIso = (iso: string) => new Date(iso).toDateString();

export function PanelDueno({ t, alSalir, alTienda }: { t: Tienda; alSalir: () => void; alTienda: () => void }) {
  const [pestana, setPestana] = useState<Pestana>("resumen");
  useEffect(() => {
    document.title = "Panel del dueño · Órbita Celulares · Demo de Jzet Labs";
  }, []);

  const porVerificar = t.pedidos.filter((p) => p.estado === "pago-pendiente");
  const devPend = t.devoluciones.filter((d) => d.estado === "pendiente");
  const bajos = PRODUCTOS.filter((p) => Object.values(t.stock[p.id] ?? {}).reduce((s, n) => s + n, 0) <= 3);
  const repListas = t.reparaciones.filter((r) => r.estado === "listo");

  const menu: [Pestana, string, typeof BarChart3, number?][] = [
    ["resumen", "Resumen", BarChart3],
    ["pedidos", "Pedidos", Package, t.pedidos.filter((p) => p.estado === "pagado").length],
    ["pagos", "Pagos", CreditCard, porVerificar.length],
    ["inventario", "Inventario", Boxes, bajos.length],
    ["reparaciones", "Reparaciones", Wrench, t.reparaciones.filter((r) => r.estado !== "entregado").length],
    ["devoluciones", "Devoluciones", Undo2, devPend.length],
  ];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[230px_1fr]" style={{ background: FONDO, color: TINTA }}>
      <aside className="hidden lg:flex flex-col gap-1 p-4 text-white" style={{ background: TINTA }}>
        <p className="px-2 pt-1 font-extrabold text-[1.15rem]" style={{ fontFamily: TITULO }}>
          órbita · panel
        </p>
        <p className="px-2 pb-4 text-[0.75rem] text-white/50">Solo para el dueño y su equipo</p>
        {menu.map(([id, tx, I, n]) => (
          <button key={id} type="button" onClick={() => setPestana(id)} className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left font-semibold transition ${pestana === id ? "text-black" : "text-white/75 hover:bg-white/5"}`} style={pestana === id ? { background: AMARILLO } : undefined}>
            <I size={18} /> <span className="flex-1">{tx}</span>
            {!!n && <span className={`rounded-full px-2 text-[0.72rem] ${pestana === id ? "bg-black/15" : "bg-white/15"}`}>{n}</span>}
          </button>
        ))}
        <div className="mt-auto space-y-1 pt-6 text-[0.88rem]">
          <button type="button" onClick={alTienda} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-white/70 hover:bg-white/5">
            <Store size={16} /> Ver la tienda
          </button>
          <button type="button" onClick={t.reiniciar} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-white/70 hover:bg-white/5">
            <RotateCcw size={16} /> Reiniciar datos de ejemplo
          </button>
          <button type="button" onClick={alSalir} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-white/70 hover:bg-white/5">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </aside>

      <main className="min-w-0 pb-16">
        {/* pestañas en celular */}
        <div className="lg:hidden sticky top-0 z-20 text-white" style={{ background: TINTA }}>
          <div className="flex items-center justify-between px-4 py-2.5">
            <p className="font-extrabold" style={{ fontFamily: TITULO }}>
              órbita · panel
            </p>
            <button type="button" onClick={alSalir} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-[0.8rem]">
              <LogOut size={14} /> Salir
            </button>
          </div>
          <nav className="flex overflow-x-auto [scrollbar-width:none]">
            {menu.map(([id, tx, I, n]) => (
              <button key={id} type="button" onClick={() => setPestana(id)} className={`relative shrink-0 flex flex-col items-center gap-0.5 px-3.5 py-2 text-[0.7rem] font-semibold ${pestana === id ? "" : "text-white/55"}`} style={pestana === id ? { color: AMARILLO } : undefined}>
                <I size={18} /> {tx}
                {!!n && <span className="absolute right-1.5 top-1 min-w-4 h-4 rounded-full px-1 text-[0.6rem] leading-4 text-black" style={{ background: AMARILLO }}>{n}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="mx-auto max-w-6xl p-4 sm:p-8">
          {pestana === "resumen" && <Resumen t={t} irA={setPestana} porVerificar={porVerificar.length} devPend={devPend.length} bajos={bajos.length} repListas={repListas.length} />}
          {pestana === "pedidos" && <Pedidos t={t} />}
          {pestana === "pagos" && <Pagos t={t} />}
          {pestana === "inventario" && <Inventario t={t} />}
          {pestana === "reparaciones" && <Reparaciones t={t} />}
          {pestana === "devoluciones" && <Devoluciones t={t} />}
          <p className="mt-10 text-center text-xs text-black/45">Panel de demostración con datos de ejemplo. Lo que cambie aquí solo se guarda en este navegador.</p>
        </div>
      </main>
    </div>
  );
}

function Titulo({ children, sub }: { children: string; sub?: string }) {
  return (
    <div>
      <h1 className="text-[1.9rem] sm:text-[2.3rem] font-extrabold tracking-[-0.02em] !text-[#0d1117]" style={{ fontFamily: TITULO }}>
        {children}
      </h1>
      {sub && <p className="text-black/55">{sub}</p>}
    </div>
  );
}

function Tarjeta({ titulo, valor, nota, alerta }: { titulo: string; valor: string | number; nota?: string; alerta?: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-[0.82rem] font-semibold text-black/55">{titulo}</p>
      <p className="mt-1 text-[1.8rem] font-extrabold leading-none" style={alerta ? { color: "#c2410c" } : undefined}>
        {valor}
      </p>
      {nota && <p className="mt-1.5 text-[0.75rem] text-black/50">{nota}</p>}
    </div>
  );
}

function Chip({ estado }: { estado: EstadoPedido }) {
  const e = ESTADOS_PEDIDO[estado];
  return (
    <span className="inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[0.72rem] font-bold" style={{ background: e.fondo, color: e.color }}>
      {e.texto}
    </span>
  );
}

/* ---------------- resumen ---------------- */

function Resumen({ t, irA, porVerificar, devPend, bajos, repListas }: { t: Tienda; irA: (p: Pestana) => void; porVerificar: number; devPend: number; bajos: number; repListas: number }) {
  const vendidos = t.pedidos.filter((p) => VENDIDO.includes(p.estado));
  const hoy = new Date().toDateString();
  const ventasHoy = vendidos.filter((p) => diaIso(p.fecha) === hoy);
  const totalHoy = ventasHoy.reduce((s, p) => s + p.total, 0);
  const total7 = vendidos.reduce((s, p) => s + p.total, 0);
  const ticket = vendidos.length ? Math.round(total7 / vendidos.length) : 0;
  const rechazados = t.pedidos.filter((p) => p.estado === "rechazado").length;

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
  const top = PRODUCTOS.map((p) => ({ p, n: vendidos.reduce((s, x) => s + x.lineas.filter((l) => l.id === p.id).reduce((a, l) => a + l.cantidad, 0), 0) }))
    .filter((x) => x.n)
    .sort((a, b) => b.n - a.n)
    .slice(0, 4);

  const atencion = [
    { n: porVerificar, t: porVerificar === 1 ? "transferencia por verificar" : "transferencias por verificar", ir: "pagos" as Pestana },
    { n: devPend, t: devPend === 1 ? "devolución por revisar" : "devoluciones por revisar", ir: "devoluciones" as Pestana },
    { n: bajos, t: bajos === 1 ? "producto con poco stock" : "productos con poco stock", ir: "inventario" as Pestana },
    { n: repListas, t: repListas === 1 ? "reparación lista para entregar" : "reparaciones listas para entregar", ir: "reparaciones" as Pestana },
  ].filter((x) => x.n);

  return (
    <>
      <Titulo sub="Lo que pasó en su tienda en los últimos 7 días">Resumen</Titulo>
      {atencion.length > 0 && (
        <div className="mt-5 rounded-2xl p-4" style={{ background: "#fff1d6" }}>
          <p className="inline-flex items-center gap-2 font-bold text-[#8a4b00]">
            <AlertTriangle size={18} /> Necesita su atención
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {atencion.map((a) => (
              <button key={a.t} type="button" onClick={() => irA(a.ir)} className="rounded-full bg-white px-3.5 py-1.5 text-[0.85rem] font-semibold hover:shadow">
                <b>{a.n}</b> {a.t} →
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tarjeta titulo="Ventas de hoy" valor={qz(totalHoy)} nota={`${ventasHoy.length} pedidos`} />
        <Tarjeta titulo="Ventas de la semana" valor={qz(total7)} nota={`${vendidos.length} pedidos pagados`} />
        <Tarjeta titulo="Ticket promedio" valor={qz(ticket)} nota="Por pedido" />
        <Tarjeta titulo="Pagos rechazados" valor={rechazados} nota="No se cobró nada" alerta={rechazados > 0} />
      </div>
      <div className="mt-4 grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <div className="rounded-2xl bg-white p-5">
          <p className="font-bold">Ventas por día</p>
          <div className="mt-5 flex h-44 items-end gap-2">
            {dias.map(({ d, q }) => (
              <div key={d.toDateString()} className="flex-1 h-full flex flex-col justify-end items-center gap-1.5">
                <span className="text-[0.62rem] font-semibold text-black/50">{q ? `Q${Math.round(q / 1000)}k` : ""}</span>
                <div className="w-full rounded-t-lg" style={{ height: `${(q / max) * 100}%`, minHeight: 4, background: d.toDateString() === new Date().toDateString() ? COBALTO : "#c9d4f5" }} />
                <span className="text-[0.68rem] text-black/50">{d.toLocaleDateString("es-GT", { weekday: "short" })}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5">
          <p className="font-bold">Por punto de venta</p>
          <ul className="mt-4 space-y-3">
            {porSucursal.map(({ s, q }) => (
              <li key={s.id}>
                <div className="flex justify-between text-[0.9rem]">
                  <span className="font-semibold">{s.nombre}</span>
                  <span>{qz(q)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-black/5">
                  <div className="h-full rounded-full" style={{ width: `${(q / maxS) * 100}%`, background: TINTA }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 font-bold">Cómo pagan</p>
          <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-black/5">
            <div style={{ width: `${total7 ? (tarjeta / total7) * 100 : 0}%`, background: COBALTO }} />
            <div className="flex-1" style={{ background: AMARILLO }} />
          </div>
          <div className="mt-2 flex justify-between text-[0.8rem]">
            <span>
              <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: COBALTO }} />
              Tarjeta {qz(tarjeta)}
            </span>
            <span>
              <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: AMARILLO }} />
              Transferencia {qz(total7 - tarjeta)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-white p-5">
        <p className="font-bold">Lo más vendido</p>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          {top.map(({ p, n }) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: FONDO }}>
              <img src={p.foto} alt="" className="w-11 h-12 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-[0.9rem]">{p.nombre}</p>
                <p className="text-[0.8rem] text-black/55">{n} vendidos</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------------- pedidos ---------------- */

const SIGUIENTE: Partial<Record<EstadoPedido, { a: EstadoPedido; texto: string }>> = {
  pagado: { a: "preparando", texto: "Empezar a preparar" },
  preparando: { a: "en-camino", texto: "Marcar enviado" },
  "en-camino": { a: "entregado", texto: "Marcar entregado" },
};

function Pedidos({ t }: { t: Tienda }) {
  const [filtro, setFiltro] = useState<EstadoPedido | "todos">("todos");
  const [abierto, setAbierto] = useState<string | null>(null);
  const lista = t.pedidos.filter((p) => filtro === "todos" || p.estado === filtro);
  const avanzar = (p: Pedido) => {
    const s = SIGUIENTE[p.estado];
    if (!s) return;
    t.setPedidos((ps) => ps.map((x) => (x.id === p.id ? { ...x, estado: s.a, guia: s.a === "en-camino" ? `GT-${String(Date.now()).slice(-6)}` : x.guia, nuevo: false } : x)));
  };
  return (
    <>
      <Titulo sub="Toque un pedido para ver el detalle y moverlo de estado. El cliente lo ve en Rastreo.">Pedidos</Titulo>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {(["todos", "pago-pendiente", "pagado", "preparando", "en-camino", "entregado", "rechazado", "devuelto"] as const).map((f) => (
          <button key={f} type="button" onClick={() => setFiltro(f)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold ${filtro === f ? "text-white" : "bg-white"}`} style={filtro === f ? { background: TINTA } : undefined}>
            {f === "todos" ? "Todos" : ESTADOS_PEDIDO[f].texto} ({f === "todos" ? t.pedidos.length : t.pedidos.filter((p) => p.estado === f).length})
          </button>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {lista.map((p) => (
          <li key={p.id} className={`rounded-2xl bg-white ${p.nuevo ? "ring-2" : ""}`} style={p.nuevo ? { ["--tw-ring-color" as string]: AMARILLO } : undefined}>
            <button type="button" onClick={() => setAbierto(abierto === p.id ? null : p.id)} className="w-full flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-left">
              <span className="font-mono font-bold">{p.id}</span>
              <span className="flex-1 min-w-[140px]">
                <span className="block font-semibold">{p.cliente}</span>
                <span className="block text-[0.8rem] text-black/55">
                  {fechaCorta(p.fecha)} · {p.metodo === "tarjeta" ? `Tarjeta ···${p.tarjeta}` : "Transferencia"}
                </span>
              </span>
              <span className="font-bold">{qz(p.total)}</span>
              <Chip estado={p.estado} />
              {p.nuevo && <span className="rounded-full px-2 text-[0.7rem] font-bold text-black" style={{ background: AMARILLO }}>Nuevo</span>}
            </button>
            {abierto === p.id && (
              <div className="border-t border-black/8 px-4 py-4 text-[0.9rem]">
                <ul className="space-y-1">
                  {p.lineas.map((l) => (
                    <li key={l.id + l.detalle} className="flex justify-between gap-3">
                      <span>
                        {l.cantidad} × {l.nombre} <span className="text-black/50">{l.detalle}</span>
                      </span>
                      <span>{qz(l.precio * l.cantidad)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-black/60">
                  {p.entrega.tipo === "envio" ? `Envío a: ${p.entrega.direccion}` : `Recoge en ${sucursalPor(p.entrega.sucursal).nombre}`} · Tel. {p.telefono}
                  {p.cuotas && p.cuotas > 1 ? ` · ${p.cuotas} cuotas` : ""}
                  {p.guia ? ` · Guía ${p.guia}` : ""}
                </p>
                {p.motivoRechazo && <p className="mt-1 font-semibold text-[#b42318]">Motivo del rechazo: {p.motivoRechazo}</p>}
                {SIGUIENTE[p.estado] && (
                  <button type="button" onClick={() => avanzar(p)} className="mt-3 rounded-full px-4 py-2 font-bold text-white" style={{ background: COBALTO }}>
                    {SIGUIENTE[p.estado]!.texto}
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
        {!lista.length && <li className="rounded-2xl bg-white px-4 py-8 text-center text-black/50">No hay pedidos en este estado.</li>}
      </ul>
    </>
  );
}

/* ---------------- pagos ---------------- */

function Pagos({ t }: { t: Tienda }) {
  const pendientes = t.pedidos.filter((p) => p.estado === "pago-pendiente");
  const rechazados = t.pedidos.filter((p) => p.estado === "rechazado");
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
      <Titulo sub="Confirme las transferencias contra su estado de cuenta. El cliente se entera en Rastreo.">Pagos</Titulo>
      <p className="mt-6 font-bold">Transferencias por verificar ({pendientes.length})</p>
      <ul className="mt-2 space-y-2">
        {pendientes.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white px-4 py-3">
            <span className="font-mono font-bold">{p.id}</span>
            <span className="flex-1 min-w-[140px]">
              <span className="block font-semibold">{p.cliente}</span>
              <span className="block text-[0.8rem] text-black/55">{fechaCorta(p.fecha)} · comprobante adjunto</span>
            </span>
            <span className="font-bold">{qz(p.total)}</span>
            <button type="button" onClick={() => decidir(p, true)} className="inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[0.85rem] font-bold text-white" style={{ background: "#1f7a3a" }}>
              <Check size={15} /> Confirmar
            </button>
            <button type="button" onClick={() => decidir(p, false)} className="inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[0.85rem] font-bold text-[#b42318] bg-[#fde4e1]">
              <X size={15} /> Rechazar
            </button>
          </li>
        ))}
        {!pendientes.length && <li className="rounded-2xl bg-white px-4 py-6 text-center text-black/50">No hay transferencias pendientes.</li>}
      </ul>
      <p className="mt-8 font-bold">Pagos rechazados ({rechazados.length})</p>
      <p className="text-sm text-black/55">Ningún rechazo se cobró. Puede escribirle al cliente para que intente con otra tarjeta.</p>
      <ul className="mt-2 space-y-2">
        {rechazados.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white px-4 py-3">
            <span className="font-mono font-bold">{p.id}</span>
            <span className="flex-1 min-w-[140px]">
              <span className="block font-semibold">{p.cliente}</span>
              <span className="block text-[0.8rem] text-black/55">
                {fechaCorta(p.fecha)} · {p.metodo === "tarjeta" ? `Tarjeta ···${p.tarjeta}` : "Transferencia"}
              </span>
            </span>
            <span className="font-bold">{qz(p.total)}</span>
            <span className="rounded-full bg-[#fde4e1] px-2.5 py-0.5 text-[0.75rem] font-bold text-[#b42318]">{p.motivoRechazo}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------- inventario ---------------- */

function Inventario({ t }: { t: Tienda }) {
  const cambiar = (id: string, suc: string, d: number) => t.setStock((s) => ({ ...s, [id]: { ...s[id], [suc]: Math.max(0, (s[id]?.[suc] ?? 0) + d) } }));
  const valor = PRODUCTOS.reduce((s, p) => s + Object.values(t.stock[p.id] ?? {}).reduce((a, n) => a + n, 0) * p.variantes[0].precio, 0);
  return (
    <>
      <Titulo sub="Solo usted ve los números. El cliente solo ve si hay, si quedan pocas o si está agotado.">Inventario</Titulo>
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Tarjeta titulo="Unidades en tienda" valor={PRODUCTOS.reduce((s, p) => s + Object.values(t.stock[p.id] ?? {}).reduce((a, n) => a + n, 0), 0)} />
        <Tarjeta titulo="Valor del inventario" valor={qz(valor)} nota="A precio de venta" />
        <Tarjeta titulo="Sucursales" valor={SUCURSALES.length} />
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[620px] text-[0.9rem]">
          <thead>
            <tr className="border-b border-black/8 text-left text-[0.78rem] text-black/50">
              <th className="px-4 py-3 font-semibold">Producto</th>
              {SUCURSALES.map((s) => (
                <th key={s.id} className="px-2 py-3 font-semibold text-center">
                  {s.nombre}
                </th>
              ))}
              <th className="px-4 py-3 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTOS.map((p) => {
              const total = Object.values(t.stock[p.id] ?? {}).reduce((a, n) => a + n, 0);
              return (
                <tr key={p.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-2.5">
                      <img src={p.foto} alt="" className="w-9 h-10 shrink-0 rounded-md object-cover" />
                      <span>
                        <span className="block font-semibold">{p.nombre}</span>
                        <span className="block text-[0.75rem] text-black/50">{p.condicion}</span>
                      </span>
                    </span>
                  </td>
                  {SUCURSALES.map((s) => {
                    const n = t.stock[p.id]?.[s.id] ?? 0;
                    return (
                      <td key={s.id} className="px-2 py-2.5">
                        <span className="mx-auto flex w-fit items-center gap-1">
                          <button type="button" aria-label={`Quitar uno de ${p.nombre} en ${s.nombre}`} onClick={() => cambiar(p.id, s.id, -1)} className="grid place-items-center w-6 h-6 rounded-full bg-black/5 hover:bg-black/10">
                            <Minus size={12} />
                          </button>
                          <span className={`w-7 text-center font-bold tabular-nums ${n === 0 ? "text-[#b42318]" : ""}`}>{n}</span>
                          <button type="button" aria-label={`Agregar uno de ${p.nombre} en ${s.nombre}`} onClick={() => cambiar(p.id, s.id, 1)} className="grid place-items-center w-6 h-6 rounded-full bg-black/5 hover:bg-black/10">
                            <Plus size={12} />
                          </button>
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-4 py-2.5 text-right">
                    <span className={`font-bold ${total <= 3 ? "text-[#c2410c]" : ""}`}>{total}</span>
                    {total <= 3 && <span className="block text-[0.7rem] font-semibold text-[#c2410c]">{total === 0 ? "Agotado" : "Pedir más"}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-black/50">Pruebe a dejar un producto en 0 y vea cómo aparece "Agotado" en la tienda.</p>
    </>
  );
}

/* ---------------- reparaciones ---------------- */

function Reparaciones({ t }: { t: Tienda }) {
  const avanzar = (id: string) =>
    t.setReparaciones((rs) => rs.map((r) => (r.id === id ? { ...r, estado: PASOS_REPARACION[Math.min(PASOS_REPARACION.length - 1, PASOS_REPARACION.indexOf(r.estado) + 1)], nueva: false } : r)));
  return (
    <>
      <Titulo sub="Mueva cada equipo de estado. El cliente lo ve con su código en Rastreo.">Reparaciones</Titulo>
      <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {t.reparaciones.map((r) => (
          <div key={r.id} className={`flex flex-col rounded-2xl bg-white p-4 ${r.nueva ? "ring-2" : ""}`} style={r.nueva ? { ["--tw-ring-color" as string]: AMARILLO } : undefined}>
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold">{r.id}</span>
              <span className="rounded-full px-2.5 py-0.5 text-[0.72rem] font-bold" style={r.estado === "listo" ? { background: "#e1f5e6", color: "#1f7a3a" } : { background: "#e3ebff", color: COBALTO }}>
                {TEXTO_REPARACION[r.estado]}
              </span>
            </div>
            <p className="mt-2 font-semibold">{r.cliente}</p>
            <p className="text-[0.85rem] text-black/60">
              {r.modelo} · {r.falla}
            </p>
            <p className="text-[0.8rem] text-black/50">
              {sucursalPor(r.sucursal).nombre} · {fechaCorta(r.fecha)} · {qz(r.precio)}
            </p>
            {r.estado !== "entregado" && (
              <button type="button" onClick={() => avanzar(r.id)} className="mt-3 rounded-full py-2 text-[0.85rem] font-bold text-white" style={{ background: TINTA }}>
                Pasar a: {TEXTO_REPARACION[PASOS_REPARACION[PASOS_REPARACION.indexOf(r.estado) + 1]]}
              </button>
            )}
          </div>
        ))}
      </div>
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
  return (
    <>
      <Titulo sub="Al aprobar, el pedido queda como devuelto y el producto regresa al inventario.">Devoluciones</Titulo>
      <ul className="mt-5 space-y-2">
        {t.devoluciones.map((d) => {
          const p = t.pedidos.find((x) => x.id === d.pedido);
          return (
            <li key={d.id} className={`rounded-2xl bg-white px-4 py-3 ${d.nueva ? "ring-2" : ""}`} style={d.nueva ? { ["--tw-ring-color" as string]: AMARILLO } : undefined}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono font-bold">{d.id}</span>
                <span className="flex-1 min-w-[160px]">
                  <span className="block font-semibold">
                    {d.motivo} <span className="font-normal text-black/50">· pedido {d.pedido}</span>
                  </span>
                  <span className="block text-[0.82rem] text-black/55">
                    {p ? `${p.cliente} · ${p.lineas.map((l) => l.nombre).join(", ")} · ${qz(p.total)}` : ""} · {fechaCorta(d.fecha)}
                  </span>
                </span>
                {d.estado === "pendiente" ? (
                  <>
                    <button type="button" onClick={() => decidir(d.id, true)} className="inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[0.85rem] font-bold text-white" style={{ background: "#1f7a3a" }}>
                      <Check size={15} /> Aprobar y reembolsar
                    </button>
                    <button type="button" onClick={() => decidir(d.id, false)} className="inline-flex items-center gap-1 rounded-full bg-[#fde4e1] px-3.5 py-1.5 text-[0.85rem] font-bold text-[#b42318]">
                      <X size={15} /> No procede
                    </button>
                  </>
                ) : (
                  <span className="rounded-full px-2.5 py-0.5 text-[0.75rem] font-bold" style={d.estado === "aprobada" ? { background: "#e1f5e6", color: "#1f7a3a" } : { background: "#fde4e1", color: "#b42318" }}>
                    {d.estado === "aprobada" ? "Aprobada" : "No procede"}
                  </span>
                )}
              </div>
              {d.detalle && <p className="mt-1.5 text-[0.85rem] text-black/60">“{d.detalle}”</p>}
            </li>
          );
        })}
      </ul>
    </>
  );
}
