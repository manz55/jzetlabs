/*
 * Panel de Taller Torque: el tablero de bahías.
 * Identidad propia: asfalto, amarillo seguridad y rojo; Barlow Condensed y placas en IBM Plex Mono; esquinas rectas y bordes gruesos.
 * Lo que se ve primero: qué carro está en cada bahía y qué espera visto bueno. Lo que se llena: la orden de trabajo con su presupuesto.
 */
import { useState, type ReactNode } from "react";
import { ArrowRight, Bell, Check, PackageSearch, Phone, Plus, Search, Wrench, X } from "lucide-react";
import { MensajeWhatsApp, qz } from "../comun";
import {
  ACERO, AMARILLO, AMBAR, ASFALTO, AUXILIOS_INICIAL, BAHIAS, CARROS, ESTADOS_AUXILIO, INGRESOS, ORDENES_INICIAL, PASOS, REPUESTOS_INICIAL, ROJO, VERDE,
  type Linea, type Orden, type Repuesto,
} from "./panel";

const TITULO = "'Barlow Condensed', 'Arial Narrow', system-ui, sans-serif";
const MONO = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const franja = `repeating-linear-gradient(-45deg, ${AMARILLO} 0 14px, ${ASFALTO} 14px 28px)`;
const borde = { border: `2px solid ${ASFALTO}` };

function Btn({ children, alTocar, tipo = "negro", ancho = false }: { children: ReactNode; alTocar: () => void; tipo?: "negro" | "amarillo" | "rojo" | "borde"; ancho?: boolean }) {
  const estilos = {
    negro: { background: ASFALTO, color: AMARILLO, border: `2px solid ${ASFALTO}` },
    amarillo: { background: AMARILLO, color: ASFALTO, border: `2px solid ${ASFALTO}` },
    rojo: { background: ROJO, color: "#fff", border: `2px solid ${ASFALTO}` },
    borde: { background: "#fff", color: ASFALTO, border: `2px solid ${ASFALTO}` },
  }[tipo];
  return (
    <button type="button" onClick={alTocar} className={`inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded px-4 py-2.5 text-[0.95rem] font-bold uppercase tracking-wide transition hover:brightness-110 active:translate-y-px ${ancho ? "w-full" : ""}`} style={estilos}>
      {children}
    </button>
  );
}

/* la placa: así la reconoce quien trabaja en el taller */
function Placa({ t }: { t: string }) {
  return <span className="inline-block rounded px-2.5 py-1 text-[0.95rem] font-semibold tracking-wider" style={{ ...borde, background: "#fff", fontFamily: MONO }}>{t}</span>;
}

const subtotal = (o: Orden) => o.lineas.reduce((a, l) => a + l.cant * l.precio, 0);
const TABS = ["Bahías", "Órdenes", "Carros", "Repuestos", "Auxilio 24 h", "Cobros"] as const;
type Tab = (typeof TABS)[number];

function mensajeOrden(o: Orden) {
  const n = o.cliente.split(" ")[0];
  return [
    `Hola, ${n}. Recibimos su ${o.modelo} (${o.placa}). En cuanto lo revisemos le avisamos.`,
    `Hola, ${n}. Estamos revisando su ${o.modelo}. Le damos el precio antes de empezar.`,
    `Hola, ${n}. Ya revisamos su ${o.modelo}. Presupuesto: ${o.lineas.map((l) => `${l.texto.toLowerCase()} ${qz(l.cant * l.precio)}`).join(", ") || "por definir"}. Total ${qz(subtotal(o))}. ¿Nos autoriza? Responda SÍ y empezamos.`,
    `Hola, ${n}. Su ${o.modelo} ya está en reparación. Calculamos que queda listo ${o.entrega.toLowerCase()}.`,
    `Hola, ${n}. Su ${o.modelo} está listo. Total: ${qz(subtotal(o))}. Le esperamos hasta las 6:00 de la tarde y le devolvemos las piezas cambiadas.`,
  ][o.paso];
}

export default function PanelTorque() {
  const [tab, setTab] = useState<Tab>("Bahías");
  const [ordenes, setOrdenes] = useState<Orden[]>(ORDENES_INICIAL);
  const [repuestos, setRepuestos] = useState<Repuesto[]>(REPUESTOS_INICIAL);
  const [auxilios, setAuxilios] = useState(AUXILIOS_INICIAL);
  const [msg, setMsg] = useState<string | null>(null);
  const [sel, setSel] = useState("o2");

  const cambiar = (id: string, f: (o: Orden) => Orden) => setOrdenes((l) => l.map((o) => (o.id === id ? f(o) : o)));
  const porAprobar = ordenes.filter((o) => o.paso === 2).length;
  const auxNuevos = auxilios.filter((a) => a.estado === 0).length;
  const bajos = repuestos.filter((r) => r.stock < r.minimo && !r.pedido).length;
  const porCobrar = ordenes.filter((o) => o.paso === 4 && !o.pagado).length;

  const badge = (t: Tab) => (t === "Órdenes" ? porAprobar : t === "Auxilio 24 h" ? auxNuevos : t === "Repuestos" ? bajos : t === "Cobros" ? porCobrar : 0);

  return (
    <div className="min-h-[calc(100vh-8rem)]" style={{ background: ACERO, color: ASFALTO, fontFamily: "'Libre Franklin', system-ui, sans-serif" }}>
      <header style={{ background: ASFALTO }} className="text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-3">
          <span className="flex items-center gap-2.5">
            <svg viewBox="0 0 48 48" width={36} height={36} aria-hidden><rect width="48" height="48" rx="6" fill={AMARILLO} /><path d="M14 14 H34 V20 H27 V36 H21 V20 H14 Z" fill={ASFALTO} /></svg>
            <span className="leading-none"><span className="block text-[1.5rem] font-extrabold uppercase" style={{ fontFamily: TITULO }}>Torque · Taller</span><span className="text-[0.72rem] uppercase tracking-wider opacity-65">Tablero de Don Chepe</span></span>
          </span>
          <span className="ml-auto text-[0.85rem] opacity-75">Sábado 21 de noviembre · 5 mecánicos</span>
        </div>
        <div className="h-2" style={{ background: franja }} aria-hidden />
        <nav aria-label="Tablero" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 pt-1">
          {TABS.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} aria-current={tab === t ? "page" : undefined} className="whitespace-nowrap px-4 py-3 text-[1.05rem] font-bold uppercase tracking-wide" style={{ fontFamily: TITULO, ...(tab === t ? { background: ACERO, color: ASFALTO } : { color: "rgba(255,255,255,.7)" }) }}>
              {t}{badge(t) > 0 && <span className="ml-1.5 rounded px-1.5 py-0.5 text-[0.72rem]" style={{ background: ROJO, color: "#fff" }}>{badge(t)}</span>}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        {tab === "Bahías" && <Bahias ordenes={ordenes} cambiar={cambiar} avisar={(o) => setMsg(mensajeOrden(o))} abrir={(id) => { setSel(id); setTab("Órdenes"); }} />}
        {tab === "Órdenes" && <Ordenes ordenes={ordenes} setOrdenes={setOrdenes} cambiar={cambiar} sel={sel} setSel={setSel} avisar={(o) => setMsg(mensajeOrden(o))} />}
        {tab === "Carros" && <Carros />}
        {tab === "Repuestos" && <Repuestos repuestos={repuestos} setRepuestos={setRepuestos} avisar={setMsg} />}
        {tab === "Auxilio 24 h" && <Auxilio auxilios={auxilios} setAuxilios={setAuxilios} avisar={setMsg} />}
        {tab === "Cobros" && <Cobros ordenes={ordenes} cambiar={cambiar} />}
      </main>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="taller mecánico" que="el aviso" />
    </div>
  );
}

const H1 = ({ children, sub }: { children: string; sub?: string }) => (
  <div className="mb-5"><h1 className="text-[2.4rem] font-extrabold uppercase leading-none" style={{ fontFamily: TITULO }}>{children}</h1>{sub && <p className="mt-1.5 max-w-2xl opacity-75">{sub}</p>}</div>
);

/* ---------- Bahías ---------- */

function Bahias({ ordenes, cambiar, avisar, abrir }: { ordenes: Orden[]; cambiar: (id: string, f: (o: Orden) => Orden) => void; avisar: (o: Orden) => void; abrir: (id: string) => void }) {
  const fila = ordenes.filter((o) => o.bahia === null && o.paso < 4);
  const listos = ordenes.filter((o) => o.paso === 4 && !o.pagado);
  return (
    <>
      <H1 sub="Cada cuadro es una bahía del taller. Si está libre, asigne un carro de la fila; si tiene carro, avance su paso con el botón amarillo.">Bahías de hoy</H1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {BAHIAS.map((b) => {
          const o = ordenes.find((x) => x.bahia === b.id && x.paso < 4);
          return (
            <section key={b.id} aria-label={b.id} className="flex flex-col rounded bg-white p-4" style={borde}>
              <div className="flex items-center justify-between"><h2 className="text-[1.5rem] font-extrabold uppercase leading-none" style={{ fontFamily: TITULO }}>{b.id}</h2><span className="text-[0.8rem] font-semibold opacity-65">{b.quien}</span></div>
              <p className="text-[0.82rem] opacity-65">{b.tipo}</p>
              {o ? (
                <div className="mt-3 flex flex-1 flex-col">
                  <Placa t={o.placa} />
                  <p className="mt-2 font-bold leading-tight">{o.modelo}</p>
                  <p className="text-[0.88rem] opacity-75">{o.falla}</p>
                  <div className="mt-3 flex gap-1" aria-hidden>{PASOS.map((p, i) => <span key={p} className="h-2.5 flex-1" style={{ background: i <= o.paso ? ASFALTO : "rgba(21,23,28,.15)" }} />)}</div>
                  <p className="mt-1 text-[0.85rem] font-bold uppercase" style={{ color: o.paso === 2 ? AMBAR : ASFALTO }}>{PASOS[o.paso]}</p>
                  <div className="mt-3 grid gap-2">
                    {o.paso < 4 && <Btn alTocar={() => cambiar(o.id, (x) => ({ ...x, paso: x.paso + 1 }))} tipo="amarillo" ancho>Pasar a: {PASOS[o.paso + 1]} <ArrowRight size={16} /></Btn>}
                    <div className="grid grid-cols-2 gap-2"><Btn alTocar={() => avisar(o)} tipo="borde"><Bell size={15} /> Avisar</Btn><Btn alTocar={() => abrir(o.id)} tipo="borde">Ver orden</Btn></div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex flex-1 flex-col items-center justify-center rounded border-2 border-dashed p-4 text-center" style={{ borderColor: "rgba(21,23,28,.3)" }}>
                  <p className="text-[1.3rem] font-extrabold uppercase opacity-50" style={{ fontFamily: TITULO }}>Libre</p>
                  {fila.length > 0 ? <div className="mt-2 grid w-full gap-1.5">{fila.slice(0, 2).map((f) => <Btn key={f.id} alTocar={() => cambiar(f.id, (x) => ({ ...x, bahia: b.id, paso: Math.max(1, x.paso) }))} tipo="negro" ancho>Meter {f.placa}</Btn>)}</div> : <p className="text-[0.85rem] opacity-60">No hay carros en fila.</p>}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded bg-white p-4" style={borde}>
          <h2 className="text-[1.5rem] font-extrabold uppercase" style={{ fontFamily: TITULO }}>Fila de espera <span className="text-[1rem] opacity-60">({fila.length})</span></h2>
          <ul className="mt-2 divide-y" style={{ borderColor: ACERO }}>
            {fila.map((f) => <li key={f.id} className="flex flex-wrap items-center gap-3 py-2.5"><Placa t={f.placa} /><span className="min-w-[8rem] flex-1"><b>{f.modelo}</b><span className="block text-[0.85rem] opacity-70">{f.falla}</span></span></li>)}
            {fila.length === 0 && <li className="py-3 opacity-60">No hay nadie esperando.</li>}
          </ul>
        </section>
        <section className="rounded bg-white p-4" style={borde}>
          <h2 className="text-[1.5rem] font-extrabold uppercase" style={{ fontFamily: TITULO }}>Listos para entregar <span className="text-[1rem] opacity-60">({listos.length})</span></h2>
          <ul className="mt-2 divide-y" style={{ borderColor: ACERO }}>
            {listos.map((o) => <li key={o.id} className="flex flex-wrap items-center gap-3 py-2.5"><Placa t={o.placa} /><span className="min-w-[8rem] flex-1"><b>{o.cliente}</b><span className="block text-[0.85rem] opacity-70">{qz(subtotal(o))}</span></span><Btn alTocar={() => avisar(o)} tipo="amarillo"><Bell size={15} /> Avisar</Btn></li>)}
            {listos.length === 0 && <li className="py-3 opacity-60">Ninguno por ahora.</li>}
          </ul>
        </section>
      </div>
    </>
  );
}

/* ---------- Órdenes: el presupuesto que hay que llenar ---------- */

function Ordenes({ ordenes, setOrdenes, cambiar, sel, setSel, avisar }: { ordenes: Orden[]; setOrdenes: (f: (l: Orden[]) => Orden[]) => void; cambiar: (id: string, f: (o: Orden) => Orden) => void; sel: string; setSel: (id: string) => void; avisar: (o: Orden) => void }) {
  const [nueva, setNueva] = useState(false);
  const [l, setL] = useState({ tipo: "repuesto" as Linea["tipo"], texto: "", cant: "1", precio: "" });
  const o = ordenes.find((x) => x.id === sel) ?? ordenes[0];
  const rep = o.lineas.filter((x) => x.tipo === "repuesto").reduce((a, x) => a + x.cant * x.precio, 0);
  const mo = o.lineas.filter((x) => x.tipo === "mano de obra").reduce((a, x) => a + x.cant * x.precio, 0);
  const campo = "mt-1 w-full rounded border-2 bg-white px-3 py-2.5 font-normal";
  function agregar() {
    if (!l.texto.trim() || !Number(l.precio)) return;
    cambiar(o.id, (x) => ({ ...x, lineas: [...x.lineas, { id: `n${Date.now()}`, tipo: l.tipo, texto: l.texto.trim(), cant: Math.max(1, Number(l.cant) || 1), precio: Number(l.precio) }] }));
    setL({ ...l, texto: "", precio: "", cant: "1" });
  }
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3"><H1 sub="Toque una orden para ver o llenar su presupuesto. Cada línea es un repuesto o una mano de obra.">Órdenes de trabajo</H1><div className="mb-5"><Btn alTocar={() => setNueva(true)} tipo="amarillo"><Plus size={18} /> Orden nueva</Btn></div></div>
      <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
        <ul className="grid content-start gap-2" aria-label="Órdenes">
          {ordenes.map((x) => (
            <li key={x.id}><button type="button" onClick={() => setSel(x.id)} className="w-full rounded p-3 text-left" style={x.id === o.id ? { background: ASFALTO, color: "#fff", ...borde } : { background: "#fff", ...borde }}>
              <span className="flex items-center justify-between gap-2"><span className="text-[1.1rem] font-extrabold" style={{ fontFamily: TITULO }}>#{x.num}</span><span className="text-[0.75rem] font-bold uppercase" style={{ color: x.id === o.id ? AMARILLO : x.paso === 2 ? AMBAR : "inherit" }}>{PASOS[x.paso]}</span></span>
              <span className="block text-[0.9rem] font-semibold" style={{ fontFamily: MONO }}>{x.placa}</span><span className="block text-[0.85rem] opacity-75">{x.modelo}</span>
            </button></li>
          ))}
        </ul>
        <article className="rounded bg-white p-5" style={borde}>
          <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-dashed pb-3" style={{ borderColor: ASFALTO }}>
            <div><p className="text-[0.8rem] font-bold uppercase opacity-60">Orden #{o.num}</p><h2 className="text-[1.9rem] font-extrabold uppercase leading-tight" style={{ fontFamily: TITULO }}>{o.modelo}</h2><div className="mt-1"><Placa t={o.placa} /></div></div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-[0.9rem]"><dt className="opacity-60">Cliente</dt><dd className="font-bold">{o.cliente}</dd><dt className="opacity-60">Teléfono</dt><dd className="font-bold">{o.tel}</dd><dt className="opacity-60">Kilometraje</dt><dd className="font-bold">{o.km} km</dd><dt className="opacity-60">Entrega</dt><dd className="font-bold">{o.entrega}</dd></dl>
          </div>
          <p className="mt-3"><b>Lo que dice el cliente:</b> {o.falla}</p>
          <div className="mt-4 flex gap-1" aria-hidden>{PASOS.map((p, i) => <span key={p} className="h-3 flex-1" style={{ background: i <= o.paso ? ASFALTO : "rgba(21,23,28,.15)" }} />)}</div>
          <p className="mt-1 font-bold uppercase" style={{ color: o.paso === 2 ? AMBAR : ASFALTO }}>Paso: {PASOS[o.paso]}</p>

          <h3 className="mt-5 text-[1.3rem] font-extrabold uppercase" style={{ fontFamily: TITULO }}>Presupuesto</h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-[0.92rem]">
              <thead><tr className="text-left text-[0.75rem] uppercase opacity-60"><th className="py-1">Qué</th><th>Tipo</th><th className="text-right">Cant.</th><th className="text-right">Precio</th><th className="text-right">Subtotal</th><th /></tr></thead>
              <tbody>
                {o.lineas.map((x) => (
                  <tr key={x.id} className="border-t" style={{ borderColor: ACERO }}><td className="py-2 font-semibold">{x.texto}</td><td className="text-[0.82rem] opacity-70">{x.tipo}</td><td className="text-right tabular-nums">{x.cant}</td><td className="text-right tabular-nums">{qz(x.precio)}</td><td className="text-right font-bold tabular-nums">{qz(x.cant * x.precio)}</td><td className="text-right"><button type="button" aria-label={`Quitar ${x.texto}`} onClick={() => cambiar(o.id, (y) => ({ ...y, lineas: y.lineas.filter((z) => z.id !== x.id) }))} className="p-1 opacity-60 hover:opacity-100"><X size={16} /></button></td></tr>
                ))}
                {o.lineas.length === 0 && <tr><td colSpan={6} className="py-4 text-center opacity-60">Todavía no hay líneas. Agregue la primera abajo.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="mt-3 grid gap-2 rounded p-3 sm:grid-cols-[auto_1fr_5rem_7rem_auto] sm:items-end" style={{ background: ACERO }}>
            <label className="text-[0.82rem] font-bold">Tipo<select value={l.tipo} onChange={(e) => setL({ ...l, tipo: e.target.value as Linea["tipo"] })} className={campo} style={borde}><option>repuesto</option><option>mano de obra</option></select></label>
            <label className="text-[0.82rem] font-bold">Qué es<input value={l.texto} onChange={(e) => setL({ ...l, texto: e.target.value })} className={campo} style={borde} placeholder="Ej. Pastillas delanteras" /></label>
            <label className="text-[0.82rem] font-bold">Cant.<input value={l.cant} onChange={(e) => setL({ ...l, cant: e.target.value })} inputMode="numeric" className={campo} style={borde} /></label>
            <label className="text-[0.82rem] font-bold">Precio Q<input value={l.precio} onChange={(e) => setL({ ...l, precio: e.target.value })} inputMode="numeric" className={campo} style={borde} /></label>
            <Btn alTocar={agregar} tipo="negro"><Plus size={16} /> Agregar</Btn>
          </div>
          <dl className="mt-4 ml-auto grid max-w-xs grid-cols-2 gap-1 text-[0.95rem]"><dt>Repuestos</dt><dd className="text-right tabular-nums">{qz(rep)}</dd><dt>Mano de obra</dt><dd className="text-right tabular-nums">{qz(mo)}</dd><dt className="border-t-2 pt-1 text-[1.15rem] font-extrabold uppercase" style={{ borderColor: ASFALTO, fontFamily: TITULO }}>Total</dt><dd className="border-t-2 pt-1 text-right text-[1.3rem] font-extrabold tabular-nums" style={{ borderColor: ASFALTO }}>{qz(rep + mo)}</dd></dl>
          <div className="mt-5 flex flex-wrap gap-2">
            {o.paso < 4 && <Btn alTocar={() => cambiar(o.id, (x) => ({ ...x, paso: x.paso + 1 }))} tipo="amarillo">Pasar a: {PASOS[o.paso + 1]} <ArrowRight size={16} /></Btn>}
            <Btn alTocar={() => avisar(o)} tipo="negro"><Phone size={16} /> {o.paso === 2 ? "Mandar presupuesto al cliente" : "Avisar al cliente"}</Btn>
          </div>
        </article>
      </div>
      {nueva && <OrdenNueva alCerrar={() => setNueva(false)} alCrear={(x) => { setOrdenes((l2) => [x, ...l2]); setSel(x.id); setNueva(false); }} numero={Math.max(...ordenes.map((x) => x.num)) + 1} />}
    </>
  );
}

function OrdenNueva({ alCerrar, alCrear, numero }: { alCerrar: () => void; alCrear: (o: Orden) => void; numero: number }) {
  const [v, setV] = useState({ placa: "", modelo: "", cliente: "", tel: "", km: "", falla: "" });
  const [error, setError] = useState("");
  const campo = "mt-1 w-full rounded border-2 bg-white px-3 py-2.5 font-normal";
  function crear() {
    if (!v.placa.trim() || !v.cliente.trim()) return setError("Escriba al menos la placa y el nombre del cliente.");
    alCrear({ id: `o${Date.now()}`, num: numero, placa: v.placa.trim().toUpperCase(), modelo: v.modelo || "Sin modelo", cliente: v.cliente.trim(), tel: v.tel || "—", km: v.km || "—", falla: v.falla || "Por revisar", paso: 0, bahia: null, lineas: [], pagado: false, entrega: "Por definir" });
  }
  return (
    <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-black/50 p-4" onClick={alCerrar}>
      <div role="dialog" aria-label="Orden nueva" onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded bg-white p-5" style={borde}>
        <div className="flex items-center justify-between"><h2 className="text-[1.8rem] font-extrabold uppercase" style={{ fontFamily: TITULO }}>Orden #{numero}</h2><button type="button" aria-label="Cerrar" onClick={alCerrar} className="rounded border-2 p-2" style={{ borderColor: ASFALTO }}><X size={18} /></button></div>
        <p className="text-[0.9rem] opacity-70">Esto es lo que se anota apenas llega el carro.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-[0.88rem] font-bold">Placa<input value={v.placa} onChange={(e) => setV({ ...v, placa: e.target.value })} className={campo} style={{ ...borde, fontFamily: MONO }} placeholder="P 123ABC" /></label>
          <label className="text-[0.88rem] font-bold">Carro<input value={v.modelo} onChange={(e) => setV({ ...v, modelo: e.target.value })} className={campo} style={borde} placeholder="Toyota Corolla 2015" /></label>
          <label className="text-[0.88rem] font-bold">Cliente<input value={v.cliente} onChange={(e) => setV({ ...v, cliente: e.target.value })} className={campo} style={borde} /></label>
          <label className="text-[0.88rem] font-bold">Teléfono<input value={v.tel} onChange={(e) => setV({ ...v, tel: e.target.value })} inputMode="tel" className={campo} style={borde} /></label>
          <label className="text-[0.88rem] font-bold">Kilometraje<input value={v.km} onChange={(e) => setV({ ...v, km: e.target.value })} inputMode="numeric" className={campo} style={borde} /></label>
          <label className="text-[0.88rem] font-bold sm:col-span-2">Lo que dice el cliente<textarea value={v.falla} onChange={(e) => setV({ ...v, falla: e.target.value })} rows={2} className={campo} style={borde} placeholder="Ej. Rechina al frenar desde hace una semana" /></label>
        </div>
        {error && <p role="alert" className="mt-3 font-bold" style={{ color: ROJO }}>{error}</p>}
        <div className="mt-4"><Btn alTocar={crear} tipo="amarillo" ancho><Check size={18} /> Abrir la orden</Btn></div>
      </div>
    </div>
  );
}

/* ---------- Carros ---------- */

function Carros() {
  const [q, setQ] = useState("");
  const lista = CARROS.filter((c) => `${c.placa} ${c.cliente} ${c.modelo}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <>
      <H1 sub="Busque por placa o por nombre. Cada carro guarda su historial y lo que le toca después.">Carros y clientes</H1>
      <label className="relative block max-w-md"><span className="sr-only">Buscar por placa</span><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-55" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Placa, nombre o carro" className="w-full rounded border-2 bg-white py-3 pl-10 pr-3" style={borde} /></label>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {lista.map((c) => (
          <article key={c.placa} className="rounded bg-white p-4" style={borde}>
            <div className="flex items-start justify-between gap-3"><div><h2 className="text-[1.4rem] font-extrabold uppercase leading-tight" style={{ fontFamily: TITULO }}>{c.modelo}</h2><p className="opacity-75">{c.cliente} · {c.km} km</p></div><Placa t={c.placa} /></div>
            <p className="mt-2 rounded px-3 py-2 text-[0.9rem] font-bold" style={{ background: ACERO }}>Próximo: {c.proximo}</p>
            <ol className="mt-3 space-y-1.5 border-l-4 pl-3 text-[0.9rem]" style={{ borderColor: AMARILLO }}>{c.historial.map((h) => <li key={h}>{h}</li>)}</ol>
            <p className="mt-3 text-[0.85rem] opacity-65">Ha gastado en total: <b>{qz(c.total)}</b></p>
          </article>
        ))}
        {lista.length === 0 && <p className="opacity-65">No hay ningún carro con «{q}».</p>}
      </div>
    </>
  );
}

/* ---------- Repuestos ---------- */

function Repuestos({ repuestos, setRepuestos, avisar }: { repuestos: Repuesto[]; setRepuestos: (f: (l: Repuesto[]) => Repuesto[]) => void; avisar: (m: string) => void }) {
  return (
    <>
      <H1 sub="Lo que está por debajo del mínimo sale en rojo. Un toque arma el pedido al proveedor.">Repuestos</H1>
      <div className="grid gap-3 md:grid-cols-2">
        {repuestos.map((r) => {
          const bajo = r.stock < r.minimo;
          return (
            <article key={r.id} className="rounded bg-white p-4" style={{ border: `2px solid ${bajo && !r.pedido ? ROJO : ASFALTO}` }}>
              <div className="flex items-start gap-3">
                <PackageSearch size={26} style={{ color: bajo ? ROJO : ASFALTO }} className="shrink-0" />
                <div className="min-w-0 flex-1"><p className="font-bold leading-tight">{r.nombre}</p><p className="text-[0.85rem] opacity-70">{r.proveedor} · costo {qz(r.costo)}</p></div>
                <div className="text-right"><p className="text-[1.9rem] font-extrabold leading-none tabular-nums" style={{ fontFamily: TITULO, color: bajo ? ROJO : ASFALTO }}>{r.stock}</p><p className="text-[0.72rem] uppercase opacity-60">mínimo {r.minimo}</p></div>
              </div>
              <div className="mt-3">{r.pedido ? <p className="flex items-center gap-2 font-bold" style={{ color: VERDE }}><Check size={18} /> Pedido enviado al proveedor</p> : bajo ? <Btn alTocar={() => { setRepuestos((l) => l.map((x) => (x.id === r.id ? { ...x, pedido: true } : x))); avisar(`Buen día. Le escribe Taller Torque. Necesitamos ${r.minimo * 2 - r.stock} de: ${r.nombre}. ¿Los tiene disponibles para entrega hoy? Costo anterior: ${qz(r.costo)}.`); }} tipo="rojo"><Wrench size={16} /> Pedir al proveedor</Btn> : <p className="text-[0.88rem] font-semibold" style={{ color: VERDE }}>Stock suficiente</p>}</div>
            </article>
          );
        })}
      </div>
    </>
  );
}

/* ---------- Auxilio 24 horas ---------- */

function Auxilio({ auxilios, setAuxilios, avisar }: { auxilios: typeof AUXILIOS_INICIAL; setAuxilios: (f: (l: typeof AUXILIOS_INICIAL) => typeof AUXILIOS_INICIAL) => void; avisar: (m: string) => void }) {
  const color = ["#d63b2f", "#b97800", "#1f7a46"];
  return (
    <>
      <H1 sub="Las solicitudes llegan desde la página y desde WhatsApp. La roja es la que nadie ha contestado.">Auxilio a domicilio · 24 horas</H1>
      <div className="grid gap-3 lg:grid-cols-3">
        {auxilios.map((a) => (
          <article key={a.id} className="rounded bg-white p-4" style={{ border: `3px solid ${color[a.estado]}` }}>
            <div className="flex items-center justify-between"><span className="rounded px-2.5 py-1 text-[0.8rem] font-bold uppercase text-white" style={{ background: color[a.estado] }}>{ESTADOS_AUXILIO[a.estado]}</span><span className="text-[0.82rem] opacity-65">{a.hora}</span></div>
            <h2 className="mt-2 text-[1.5rem] font-extrabold uppercase leading-tight" style={{ fontFamily: TITULO }}>{a.zona}</h2>
            <p className="mt-1 font-semibold">{a.cliente} · {a.tel}</p>
            <p className="text-[0.92rem] opacity-80">{a.falla}</p>
            <p className="mt-1 text-[0.85rem] font-bold">Llegada: {a.min}</p>
            <div className="mt-3 grid gap-2">
              {a.estado === 0 && <Btn alTocar={() => { setAuxilios((l) => l.map((x) => (x.id === a.id ? { ...x, estado: 1, min: "ya va en camino" } : x))); avisar(`Hola, ${a.cliente.split(" ")[0]}. Ya salimos hacia ${a.zona}. Llegamos en unos 25 minutos. Si puede, deje el carro con las luces de emergencia.`); }} tipo="rojo" ancho>Contestar y salir <ArrowRight size={16} /></Btn>}
              {a.estado === 1 && <Btn alTocar={() => setAuxilios((l) => l.map((x) => (x.id === a.id ? { ...x, estado: 2, min: "resuelto" } : x)))} tipo="amarillo" ancho><Check size={16} /> Ya se resolvió</Btn>}
              {a.estado === 2 && <p className="font-bold" style={{ color: VERDE }}>Resuelto. Se le pide su reseña.</p>}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

/* ---------- Cobros ---------- */

function Cobros({ ordenes, cambiar }: { ordenes: Orden[]; cambiar: (id: string, f: (o: Orden) => Orden) => void }) {
  const [forma, setForma] = useState<Record<string, string>>({});
  const porCobrar = ordenes.filter((o) => o.paso === 4 && !o.pagado);
  const cobradas = ordenes.filter((o) => o.pagado);
  const sumaPorCobrar = porCobrar.reduce((a, o) => a + subtotal(o), 0);
  const sumaCobrado = cobradas.reduce((a, o) => a + subtotal(o), 0);
  const max = Math.max(...INGRESOS.map((i) => i.v));
  return (
    <>
      <H1 sub="Los carros listos que aún no pagan, y lo que ya se cobró.">Cobros</H1>
      <div className="grid gap-3 sm:grid-cols-3">
        {[["Por cobrar", qz(sumaPorCobrar), ROJO], ["Cobrado hoy", qz(sumaCobrado), VERDE], ["Carros listos", String(porCobrar.length), ASFALTO]].map(([t, v, c]) => <div key={t} className="rounded bg-white p-4" style={borde}><p className="text-[0.85rem] opacity-65">{t}</p><p className="text-[2.4rem] font-extrabold leading-none" style={{ fontFamily: TITULO, color: c }}>{v}</p></div>)}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded bg-white p-4" style={borde}>
          <h2 className="text-[1.5rem] font-extrabold uppercase" style={{ fontFamily: TITULO }}>Por cobrar</h2>
          <ul className="mt-2 divide-y" style={{ borderColor: ACERO }}>
            {porCobrar.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center gap-3 py-3"><Placa t={o.placa} /><span className="min-w-[7rem] flex-1"><b>{o.cliente}</b><span className="block text-[0.85rem] opacity-70">Orden #{o.num}</span></span><b className="text-[1.15rem] tabular-nums">{qz(subtotal(o))}</b>
                <select aria-label="Forma de pago" value={forma[o.id] ?? "Efectivo"} onChange={(e) => setForma({ ...forma, [o.id]: e.target.value })} className="rounded border-2 bg-white px-2 py-2" style={borde}><option>Efectivo</option><option>Tarjeta</option><option>Transferencia</option></select>
                <Btn alTocar={() => cambiar(o.id, (x) => ({ ...x, pagado: true }))} tipo="amarillo"><Check size={16} /> Cobrar</Btn></li>
            ))}
            {porCobrar.length === 0 && <li className="py-3 opacity-60">Nada pendiente de cobro.</li>}
          </ul>
        </section>
        <section className="rounded bg-white p-4" style={borde}>
          <h2 className="text-[1.5rem] font-extrabold uppercase" style={{ fontFamily: TITULO }}>Ingresos de la semana</h2>
          <div className="mt-3 flex h-40 items-end gap-2">{INGRESOS.map((i) => <div key={i.t} className="flex h-full flex-1 flex-col items-center justify-end gap-1"><span className="text-[0.72rem] font-bold">{(i.v / 1000).toFixed(1)}k</span><span className="w-full" style={{ height: `${(i.v / max) * 80}%`, background: AMARILLO, border: `2px solid ${ASFALTO}` }} /><span className="text-[0.75rem] opacity-65">{i.t}</span></div>)}</div>
        </section>
      </div>
    </>
  );
}
