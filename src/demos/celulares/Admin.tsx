/*
 * Panel del dueño de Órbita Celulares. Solo lo ve el dueño (en la tienda real,
 * con usuario y contraseña). Ventas, pedidos, pagos por verificar y rechazados,
 * inventario por sucursal, reparaciones y devoluciones. Lo que hace el cliente
 * en la tienda aparece aquí.
 */
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, BarChart3, Boxes, Camera, Check, CreditCard, Eye, EyeOff, LogOut, Minus, Package, Phone, Plus, RotateCcw, Store, Undo2, Users, Wrench, X,
} from "lucide-react";
import { qz } from "../comun";
import {
  PRIMARIO, ESTADOS_PEDIDO, FONDO, LAVANDA, PASOS_REPARACION, SUCURSALES, TEXTO_REPARACION, TINTA,
  fechaCorta, sucursalPor,
  type EstadoPedido, type Pedido, type Producto, type Reparacion, type Tienda,
} from "./datos";

/* identidad propia del panel: violeta noche y lima, como el mostrador de una tienda de tecnología */
const AMARILLO = "#b8f23a";
const LETRA_PANEL = "'Space Grotesk', system-ui, sans-serif";

type Pestana = "resumen" | "pedidos" | "pagos" | "inventario" | "reparaciones" | "tecnicos" | "devoluciones";
const VENDIDO: EstadoPedido[] = ["pagado", "preparando", "en-camino", "entregado"];
const diaIso = (iso: string) => new Date(iso).toDateString();

export function PanelDueno({ t, alSalir, alTienda }: { t: Tienda; alSalir: () => void; alTienda: () => void }) {
  const [pestana, setPestana] = useState<Pestana>("resumen");
  useEffect(() => {
    document.title = "Panel del dueño · Órbita Celulares · Demo de Jzet Labs";
  }, []);

  const porVerificar = t.pedidos.filter((p) => p.estado === "pago-pendiente");
  const devPend = t.devoluciones.filter((d) => d.estado === "pendiente");
  const bajos = t.productos.filter((p) => Object.values(t.stock[p.id] ?? {}).reduce((s, n) => s + n, 0) <= 3);
  const repListas = t.reparaciones.filter((r) => r.estado === "listo");

  const menu: [Pestana, string, typeof BarChart3, number?][] = [
    ["resumen", "Resumen", BarChart3],
    ["pedidos", "Pedidos", Package, t.pedidos.filter((p) => p.estado === "pagado").length],
    ["pagos", "Pagos", CreditCard, porVerificar.length],
    ["inventario", "Productos", Boxes, bajos.length],
    ["reparaciones", "Reparaciones", Wrench, t.reparaciones.filter((r) => r.estado !== "entregado").length],
    ["tecnicos", "Técnicos", Users, t.tecnicos.filter((x) => x.activo).length],
    ["devoluciones", "Devoluciones", Undo2, devPend.length],
  ];

  return (
    <div className="min-h-screen" style={{ background: FONDO, color: TINTA, fontFamily: LETRA_PANEL }}>
            <main className="min-w-0 pb-16">
        {/* pestañas en celular */}
        <div className="sticky top-0 z-20 text-white" style={{ background: TINTA }}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
            <p className="flex items-center gap-2 text-[1.35rem] font-bold tracking-tight"><span className="grid h-8 w-8 place-items-center rounded-lg text-[1rem]" style={{ background: AMARILLO, color: TINTA }}>Ó</span> Órbita <span className="text-[0.8rem] font-medium opacity-60">· mostrador del dueño</span></p>
            <div className="ml-auto flex flex-wrap gap-2 text-[0.82rem]">
              <button type="button" onClick={alTienda} className="inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-full border border-white/25 px-3.5"><Store size={15} /> Ver la tienda</button>
              <button type="button" onClick={t.reiniciar} className="inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-full border border-white/25 px-3.5"><RotateCcw size={15} /> Reiniciar ejemplo</button>
              <button type="button" onClick={alSalir} className="inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-full border border-white/25 px-3.5"><LogOut size={15} /> Salir</button>
            </div>
          </div>
          <nav className="flex overflow-x-auto [scrollbar-width:none]">
            {menu.map(([id, tx, I, n]) => (
              <button key={id} type="button" onClick={() => setPestana(id)} className={`relative shrink-0 flex flex-col items-center gap-0.5 px-3.5 py-2 text-[0.7rem] font-semibold ${pestana === id ? "" : "text-white/55"}`} style={pestana === id ? { color: "#c9b3ff" } : undefined}>
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
          {pestana === "tecnicos" && <Tecnicos t={t} />}
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
      <h1 className="text-[1.9rem] sm:text-[2.3rem] font-extrabold tracking-[-0.02em] !text-[#1c1230]">
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
  const top = t.productos.map((p) => ({ p, n: vendidos.reduce((s, x) => s + x.lineas.filter((l) => l.id === p.id).reduce((a, l) => a + l.cantidad, 0), 0) }))
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
                <div className="w-full rounded-t-lg" style={{ height: `${(q / max) * 100}%`, minHeight: 4, background: d.toDateString() === new Date().toDateString() ? PRIMARIO : "#c9d4f5" }} />
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
            <div style={{ width: `${total7 ? (tarjeta / total7) * 100 : 0}%`, background: PRIMARIO }} />
            <div className="flex-1" style={{ background: AMARILLO }} />
          </div>
          <div className="mt-2 flex justify-between text-[0.8rem]">
            <span>
              <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: PRIMARIO }} />
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
  "pago-pendiente": { a: "pagado", texto: "Confirmar pago" },
  pagado: { a: "preparando", texto: "Preparar" },
  preparando: { a: "en-camino", texto: "Enviar" },
  "en-camino": { a: "entregado", texto: "Entregado" },
};
const ESTADOS_ELEGIBLES: EstadoPedido[] = ["pago-pendiente", "pagado", "preparando", "en-camino", "entregado", "rechazado", "devuelto"];
const textoMetodo = (p: Pedido) => (p.metodo === "tarjeta" ? `Tarjeta ···${p.tarjeta}` : p.metodo === "transferencia" ? "Transferencia" : "Paga al recibir");

function Pedidos({ t }: { t: Tienda }) {
  const [filtro, setFiltro] = useState<EstadoPedido | "activos" | "todos">("activos");
  const [abierto, setAbierto] = useState<string | null>(null);
  const activos: EstadoPedido[] = ["pago-pendiente", "pagado", "preparando", "en-camino"];
  const lista = t.pedidos.filter((p) => filtro === "todos" || (filtro === "activos" ? activos.includes(p.estado) : p.estado === filtro));
  const mover = (p: Pedido, a: EstadoPedido) =>
    t.setPedidos((ps) => ps.map((x) => (x.id === p.id ? { ...x, estado: a, guia: a === "en-camino" && !x.guia ? `GT-${String(Date.now()).slice(-6)}` : x.guia, nuevo: false } : x)));
  return (
    <>
      <Titulo sub="Cada pedido avanza con un toque. El cliente lo ve al instante en Rastreo.">Pedidos</Titulo>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {(["activos", "todos", ...ESTADOS_ELEGIBLES] as const).map((f) => (
          <button key={f} type="button" onClick={() => setFiltro(f)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold ${filtro === f ? "text-white" : "bg-white"}`} style={filtro === f ? { background: TINTA } : undefined}>
            {f === "todos" ? "Todos" : f === "activos" ? "Por atender" : ESTADOS_PEDIDO[f].texto} (
            {f === "todos" ? t.pedidos.length : f === "activos" ? t.pedidos.filter((p) => activos.includes(p.estado)).length : t.pedidos.filter((p) => p.estado === f).length})
          </button>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {lista.map((p) => {
          const sig = SIGUIENTE[p.estado];
          return (
            <li key={p.id} className={`rounded-2xl bg-white ${p.nuevo ? "ring-2" : ""}`} style={p.nuevo ? { ["--tw-ring-color" as string]: PRIMARIO } : undefined}>
              <div className="grid grid-cols-2 sm:grid-cols-[1fr_170px_170px] items-center gap-x-3 gap-y-2.5 px-4 py-3">
                <button type="button" onClick={() => setAbierto(abierto === p.id ? null : p.id)} className="col-span-2 sm:col-span-1 min-w-0 text-left">
                  <span className="flex items-center gap-2">
                    <span className="font-mono font-bold">{p.id}</span>
                    {p.nuevo && <span className="rounded-full px-2 text-[0.68rem] font-bold text-white" style={{ background: PRIMARIO }}>Nuevo</span>}
                  </span>
                  <span className="block font-semibold">{p.cliente}</span>
                  <span className="block text-[0.8rem] text-black/55">
                    {fechaCorta(p.fecha)} · {textoMetodo(p)} · <b className="text-black/80">{qz(p.total)}</b>
                  </span>
                </button>
                <select
                  value={p.estado}
                  onChange={(e) => mover(p, e.target.value as EstadoPedido)}
                  aria-label={`Estado del pedido ${p.id}`}
                  className="w-full rounded-full border-0 pl-2.5 pr-1 py-2 text-[0.76rem] sm:text-[0.82rem] font-bold"
                  style={{ background: ESTADOS_PEDIDO[p.estado].fondo, color: ESTADOS_PEDIDO[p.estado].color }}
                >
                  {ESTADOS_ELEGIBLES.map((e) => (
                    <option key={e} value={e}>
                      {ESTADOS_PEDIDO[e].texto}
                    </option>
                  ))}
                </select>
                {sig ? (
                  <button type="button" onClick={() => mover(p, sig.a)} className="w-full rounded-full px-3 py-2 text-[0.85rem] font-bold text-white active:scale-95 transition" style={{ background: PRIMARIO }}>
                    {sig.texto} →
                  </button>
                ) : (
                  <span className="w-full truncate rounded-full px-3 py-2 text-center text-[0.8rem] font-semibold text-black/60 bg-black/[0.03]">Sin pendientes</span>
                )}
              </div>
              {abierto === p.id && (
                <div className="border-t border-black/8 px-4 py-3 text-[0.9rem]">
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
                </div>
              )}
            </li>
          );
        })}
        {!lista.length && <li className="rounded-2xl bg-white px-4 py-8 text-center text-black/50">No hay pedidos aquí.</li>}
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
                {fechaCorta(p.fecha)} · {textoMetodo(p)}
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
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Titulo sub="Cambie fotos, precios y existencias. El cliente nunca ve los números, solo si hay.">Productos</Titulo>
        <button type="button" onClick={() => setNuevo(true)} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 font-bold text-white" style={{ background: PRIMARIO }}>
          <Plus size={17} /> Nuevo producto
        </button>
      </div>
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Tarjeta titulo="Unidades en tienda" valor={t.productos.reduce((s, p) => s + total(p.id), 0)} />
        <Tarjeta titulo="Valor del inventario" valor={qz(valor)} nota="A precio con tarjeta" />
        <Tarjeta titulo="Productos" valor={t.productos.length} nota={`${t.productos.filter((p) => p.visible === false).length} ocultos`} />
      </div>
      {nuevo && <NuevoProducto t={t} alCerrar={() => setNuevo(false)} />}
      <input aria-label="Buscar producto" value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar producto…" className="mt-4 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 focus:outline-none focus:border-[#6d28d9]" />
      <ul className="mt-3 space-y-2">
        {lista.map((p) => {
          const n = total(p.id);
          return (
            <li key={p.id} className={`rounded-2xl bg-white p-3 sm:p-4 ${p.visible === false ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-center gap-3">
                <label className="group relative w-16 h-16 shrink-0 cursor-pointer overflow-hidden rounded-xl" title="Cambiar foto">
                  <img src={p.foto} alt="" className="w-full h-full object-cover" />
                  <span className="absolute inset-0 grid place-items-center bg-black/45 text-white opacity-0 group-hover:opacity-100 transition">
                    <Camera size={18} />
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) editar(p.id, { foto: await achicarFoto(f) });
                    }}
                  />
                </label>
                <div className="flex-1 min-w-[160px]">
                  <p className="font-semibold leading-tight">{p.nombre}</p>
                  <p className="text-[0.78rem] text-black/50">
                    {p.marca} · {p.categoria} · {p.condicion}
                  </p>
                  <label className="mt-1 inline-flex items-center gap-1 text-[0.82rem]">
                    <span className="text-black/50">Precio Q</span>
                    <input
                      type="number"
                      value={p.variantes[0].precio}
                      onChange={(e) => editar(p.id, { variantes: p.variantes.map((v, i) => (i === 0 ? { ...v, precio: Math.max(0, Number(e.target.value) || 0) } : v)) })}
                      className="w-24 rounded-lg border border-black/10 px-2 py-1 font-semibold"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {SUCURSALES.map((s) => {
                    const k = t.stock[p.id]?.[s.id] ?? 0;
                    return (
                      <span key={s.id} className="flex items-center gap-1 rounded-full bg-black/[0.04] px-1.5 py-1 text-[0.78rem]">
                        <span className="px-1 text-black/55">{s.nombre}</span>
                        <button type="button" aria-label={`Quitar uno en ${s.nombre}`} onClick={() => cambiarStock(p.id, s.id, -1)} className="grid place-items-center w-6 h-6 rounded-full bg-white">
                          <Minus size={12} />
                        </button>
                        <span className={`w-6 text-center font-bold tabular-nums ${k === 0 ? "text-[#b42318]" : ""}`}>{k}</span>
                        <button type="button" aria-label={`Agregar uno en ${s.nombre}`} onClick={() => cambiarStock(p.id, s.id, 1)} className="grid place-items-center w-6 h-6 rounded-full bg-white">
                          <Plus size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[0.8rem] font-bold ${n <= 3 ? "text-[#c2410c]" : "text-black/60"}`}>{n === 0 ? "Agotado" : n <= 3 ? `Quedan ${n}` : `${n} en total`}</span>
                  <button
                    type="button"
                    onClick={() => editar(p.id, { visible: p.visible === false })}
                    title={p.visible === false ? "Mostrar en la tienda" : "Ocultar de la tienda"}
                    className="grid place-items-center w-9 h-9 rounded-full bg-black/5 hover:bg-black/10"
                  >
                    {p.visible === false ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm text-black/50">Toque la foto para cambiarla. El ojo oculta o muestra el producto en la tienda.</p>
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

/* ---------------- reparaciones: un toque para avanzar y técnico asignado ---------------- */

function Reparaciones({ t }: { t: Tienda }) {
  const editar = (id: string, cambio: Partial<Reparacion>) => t.setReparaciones((rs) => rs.map((r) => (r.id === id ? { ...r, ...cambio, nueva: false } : r)));
  return (
    <>
      <Titulo sub="Asigne un técnico y avance cada equipo con un toque. El cliente lo ve con su código en Rastreo.">Reparaciones</Titulo>
      <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {t.reparaciones.map((r) => {
          const i = PASOS_REPARACION.indexOf(r.estado);
          const sig = PASOS_REPARACION[i + 1];
          return (
            <div key={r.id} className={`flex flex-col rounded-2xl bg-white p-4 ${r.nueva ? "ring-2" : ""}`} style={r.nueva ? { ["--tw-ring-color" as string]: PRIMARIO } : undefined}>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold">{r.id}</span>
                <span className="rounded-full px-2.5 py-0.5 text-[0.72rem] font-bold" style={r.estado === "listo" ? { background: "#e1f5e6", color: "#1f7a3a" } : { background: LAVANDA, color: PRIMARIO }}>
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
              <label className="mt-3 text-[0.78rem] font-semibold text-black/55">
                Técnico
                <select value={r.tecnico ?? ""} onChange={(e) => editar(r.id, { tecnico: e.target.value || undefined })} className="mt-1 w-full rounded-lg border border-black/10 bg-white px-2 py-2 text-[0.88rem] font-semibold text-black">
                  <option value="">Sin asignar</option>
                  {t.tecnicos.filter((x) => x.activo).map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.nombre} · {x.especialidad}
                    </option>
                  ))}
                </select>
              </label>
              {sig && (
                <button type="button" onClick={() => editar(r.id, { estado: sig })} className="mt-3 rounded-full py-2 text-[0.85rem] font-bold text-white active:scale-95 transition" style={{ background: PRIMARIO }}>
                  {TEXTO_REPARACION[sig]} →
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ---------------- red de técnicos ---------------- */

function Tecnicos({ t }: { t: Tienda }) {
  const [f, setF] = useState({ nombre: "", especialidad: "", sucursal: SUCURSALES[0].id, telefono: "" });
  const carga = (id: string) => t.reparaciones.filter((r) => r.tecnico === id && r.estado !== "entregado").length;
  return (
    <>
      <Titulo sub="Su red de técnicos: quién repara qué, en qué sucursal y cuánto trabajo tiene ahora.">Técnicos</Titulo>
      <div className="mt-5 grid md:grid-cols-2 gap-3">
        {t.tecnicos.map((x) => (
          <div key={x.id} className={`flex items-center gap-3 rounded-2xl bg-white p-4 ${x.activo ? "" : "opacity-55"}`}>
            <span className="grid place-items-center w-11 h-11 shrink-0 rounded-full font-bold text-white" style={{ background: PRIMARIO }}>
              {x.nombre.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{x.nombre}</p>
              <p className="text-[0.8rem] text-black/55">
                {x.especialidad} · {sucursalPor(x.sucursal).nombre}
              </p>
              <p className="text-[0.8rem] text-black/55 inline-flex items-center gap-1">
                <Phone size={12} /> {x.telefono} · {carga(x.id)} {carga(x.id) === 1 ? "equipo" : "equipos"} en curso
              </p>
            </div>
            <button
              type="button"
              onClick={() => t.setTecnicos((ts) => ts.map((y) => (y.id === x.id ? { ...y, activo: !y.activo } : y)))}
              className="rounded-full px-3 py-1.5 text-[0.78rem] font-bold"
              style={x.activo ? { background: "#e1f5e6", color: "#1f7a3a" } : { background: "#eceef1", color: "#5b5f66" }}
            >
              {x.activo ? "Disponible" : "No disponible"}
            </button>
          </div>
        ))}
      </div>
      <form
        className="mt-4 rounded-2xl bg-white p-4 grid sm:grid-cols-[1fr_1fr_auto_auto_auto] gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!f.nombre.trim()) return;
          t.setTecnicos((ts) => [...ts, { id: `T${Date.now()}`, nombre: f.nombre.trim(), especialidad: f.especialidad.trim() || "General", sucursal: f.sucursal, telefono: f.telefono.trim(), activo: true }]);
          setF({ nombre: "", especialidad: "", sucursal: SUCURSALES[0].id, telefono: "" });
        }}
      >
        <input aria-label="Nombre del técnico" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} placeholder="Nombre del técnico" className="rounded-lg border border-black/15 px-3 py-2" />
        <input aria-label="Especialidad" value={f.especialidad} onChange={(e) => setF({ ...f, especialidad: e.target.value })} placeholder="Especialidad" className="rounded-lg border border-black/15 px-3 py-2" />
        <select aria-label="Sucursal" value={f.sucursal} onChange={(e) => setF({ ...f, sucursal: e.target.value })} className="rounded-lg border border-black/15 bg-white px-3 py-2">
          {SUCURSALES.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>
        <input aria-label="Teléfono" value={f.telefono} onChange={(e) => setF({ ...f, telefono: e.target.value })} placeholder="Teléfono" className="rounded-lg border border-black/15 px-3 py-2 sm:w-32" />
        <button type="submit" className="inline-flex items-center justify-center gap-1 rounded-full px-4 py-2 font-bold text-white" style={{ background: PRIMARIO }}>
          <Plus size={16} /> Agregar
        </button>
      </form>
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
            <li key={d.id} className={`rounded-2xl bg-white px-4 py-3 ${d.nueva ? "ring-2" : ""}`} style={d.nueva ? { ["--tw-ring-color" as string]: PRIMARIO } : undefined}>
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
