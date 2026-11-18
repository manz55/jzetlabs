/*
 * Demo: "Constructora Los Cedros" (empresa inventada, datos de ejemplo).
 * Tres partes: el marcaje en la obra (PIN + foto + ubicación), la planilla de la semana
 * en la oficina (se calcula sola y explica cada quetzal) y la boleta en el teléfono del trabajador.
 */
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, Camera, Check, Clock, Delete, FileText, HandCoins, MapPin, X } from "lucide-react";
import { BandaDemos, Cajon, CierreJzet, MensajeWhatsApp, PartesDemo } from "../comun";
import {
  BONIF_MES, CASCO, IGSS, OBRAS, PAPEL, PIN_EJEMPLO, PLANO, PLANO2, ROJO, TINTA, TITULO, TRABAJADORES, VERDE,
  calcular, diaCorto, hora, iniciales, jornada, obraDe, qz, usePlanilla,
  type Planilla, type Trabajador,
} from "./datos";

const ESTILOS = `
.plan h1, .plan h2, .plan h3 { color: inherit; }
.plan-titulo { font-family: ${TITULO}; font-weight: 800; line-height: .95; letter-spacing: -.005em; }
/* papel de plano: cuadrícula fina y gruesa */
.plano { background-color: ${PAPEL}; background-image:
  linear-gradient(rgba(23,58,94,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(23,58,94,.07) 1px, transparent 1px),
  linear-gradient(rgba(23,58,94,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(23,58,94,.035) 1px, transparent 1px);
  background-size: 80px 80px, 80px 80px, 16px 16px, 16px 16px; }
/* línea de cota, como en los planos: |—— texto ——| */
.cota { display: flex; align-items: center; gap: .6rem; color: ${PLANO}; font-size: .85rem; font-weight: 600; }
.cota::before, .cota::after { content: ""; flex: 1; height: 1px; background: currentColor; opacity: .5; }
.cota > span { white-space: nowrap; }
.cota-borde { border-left: 1.5px solid ${PLANO}; border-right: 1.5px solid ${PLANO}; padding: 0 .4rem; }
.ficha { background: #fff; border: 1px solid rgba(23,58,94,.14); border-radius: 10px; }
.num { font-variant-numeric: tabular-nums; }
`;

function Casco({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="8" fill={CASCO} />
      <path d="M8 27h24v3H8z" fill={TINTA} />
      <path d="M10 27c0-6.6 4.5-11.5 10-11.5S30 20.4 30 27z" fill={TINTA} />
      <path d="M18.4 15.6h3.2v6.4h-3.2z" fill={CASCO} />
    </svg>
  );
}

function Marca() {
  return (
    <span className="flex items-center gap-2.5">
      <Casco />
      <span className="leading-none">
        <span className="plan-titulo block text-[1.35rem]">Los Cedros</span>
        <span className="block text-[0.72rem] font-semibold opacity-70">Constructora</span>
      </span>
    </span>
  );
}

function Avatar({ t, size = 44 }: { t: Trabajador; size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-full font-bold text-white" style={{ width: size, height: size, background: t.color, fontSize: size * 0.36 }}>
      {iniciales(t.nombre)}
    </span>
  );
}

type Vista = "obra" | "oficina" | "boleta";

export default function PlanillaDemo() {
  const p = usePlanilla();
  const leer = (): Vista => (location.hash === "#oficina" ? "oficina" : location.hash === "#boleta" ? "boleta" : "obra");
  const [vista, setVista] = useState<Vista>(leer);
  useEffect(() => {
    const cambio = () => setVista(leer());
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", vista === "obra" ? location.pathname : `#${vista}`);
    document.title = vista === "oficina" ? "Planilla · Los Cedros" : vista === "boleta" ? "Mi boleta · Los Cedros" : "Constructora Los Cedros · Demo de Jzet Labs";
    window.scrollTo(0, 0);
  }, [vista]);

  return (
    <div className="plan plano min-h-screen" style={{ color: TINTA }}>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <PartesDemo
        fondo={PLANO2}
        actual={vista}
        alCambiar={setVista}
        partes={[
          { id: "obra", nombre: "Marcaje en la obra", quien: "Cada trabajador marca con PIN y foto" },
          { id: "oficina", nombre: "Planilla de la semana", quien: "La oficina la ve calculada sola" },
          { id: "boleta", nombre: "Mi boleta", quien: "El trabajador ve su pago y pide vales" },
        ] as const}
      />
      {vista === "obra" && <Obra p={p} />}
      {vista === "oficina" && <Oficina p={p} />}
      {vista === "boleta" && <Boleta p={p} />}
      <CierreJzet demo="planilla y control de empleados" />
    </div>
  );
}

/* ───────────── Marcaje en la obra ───────────── */

function Reloj() {
  const [ahora, setAhora] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-center">
      <p className="font-semibold opacity-70">{ahora.toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" })}</p>
      <p className="plan-titulo num mt-1 text-[4.5rem] sm:text-[5.5rem]" style={{ color: PLANO }}>
        {ahora.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false })}
      </p>
    </div>
  );
}

function Obra({ p }: { p: Planilla }) {
  const [obra, setObra] = useState("torre");
  const [quien, setQuien] = useState<Trabajador | null>(null);
  const gente = TRABAJADORES.filter((t) => t.obra === obra);
  const o = obraDe(obra);
  const estado = (t: Trabajador) => p.diasDe(t).find((d) => d.fecha === p.hoy)?.marca ?? null;
  const adentro = gente.filter((t) => {
    const m = estado(t);
    return m && m.salida === null;
  }).length;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Marca />
        <p className="flex items-center gap-1.5 text-[0.9rem] font-semibold">
          <MapPin size={16} style={{ color: ROJO }} /> Tablet de la obra
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Obra">
        {OBRAS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setObra(x.id)}
            aria-pressed={obra === x.id}
            className="rounded-lg border px-3.5 py-2 text-left transition"
            style={obra === x.id ? { background: PLANO, color: "#fff", borderColor: PLANO } : { background: "#fff", borderColor: "rgba(23,58,94,.2)" }}
          >
            <span className="block font-bold leading-tight">{x.nombre}</span>
            <span className="block text-[0.8rem] opacity-75">{x.lugar}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <Reloj />
        <h1 className="plan-titulo mt-3 text-center text-[2.4rem] sm:text-[3rem]">Toque su nombre para marcar</h1>
        <p className="mt-2 text-center opacity-75">
          {o.nombre} · {adentro} de {gente.length} adentro ahorita
        </p>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gente.map((t) => {
          const m = estado(t);
          const j = jornada(p.hoy);
          const tarde = m && m.entrada > j.entra + 10;
          return (
            <li key={t.id}>
              <button type="button" onClick={() => setQuien(t)} className="ficha flex w-full items-center gap-3 p-3 text-left transition hover:shadow-md active:scale-[0.99]">
                <Avatar t={t} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold">{t.nombre}</span>
                  <span className="block text-[0.85rem] opacity-70">{t.puesto}</span>
                </span>
                <span
                  className="num shrink-0 rounded-md px-2 py-1 text-[0.8rem] font-bold"
                  style={
                    !m ? { background: "#eef1f4", color: "#5b6672" } : m.salida !== null ? { background: "#e6eef7", color: PLANO } : tarde ? { background: "#fbe6e3", color: ROJO } : { background: "#e3f2e8", color: VERDE }
                  }
                >
                  {!m ? "Sin marcar" : m.salida !== null ? `Salió ${hora(m.salida)}` : `Entró ${hora(m.entrada)}`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-center text-[0.9rem] opacity-70">
        Cada marca guarda la hora, una foto y la ubicación. Nadie puede marcar por otro.
      </p>

      <Cajon abierto={quien !== null} alCerrar={() => setQuien(null)} fondo="#fff">
        {quien && <Marcar t={quien} p={p} obra={o.nombre} alCerrar={() => setQuien(null)} />}
      </Cajon>
    </main>
  );
}

function Marcar({ t, p, obra, alCerrar }: { t: Trabajador; p: Planilla; obra: string; alCerrar: () => void }) {
  const [paso, setPaso] = useState<"pin" | "foto" | "listo">("pin");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [hecho, setHecho] = useState<{ tipo: "entrada" | "salida"; min: number } | null>(null);
  const [toca] = useState(() => {
    const m = p.diasDe(t).find((d) => d.fecha === p.hoy)?.marca ?? null;
    return m && m.salida === null ? "salida" : "entrada";
  });

  const tecla = (k: string) => {
    setError(false);
    const nuevo = (pin + k).slice(0, 4);
    setPin(nuevo);
    if (nuevo.length === 4) {
      if (nuevo === PIN_EJEMPLO) setTimeout(() => setPaso("foto"), 150);
      else {
        setError(true);
        setTimeout(() => setPin(""), 400);
      }
    }
  };

  return (
    <div className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar t={t} size={52} />
          <div>
            <p className="text-[1.15rem] font-bold">{t.nombre}</p>
            <p className="text-[0.9rem] opacity-70">
              {t.puesto} · marca su {toca}
            </p>
          </div>
        </div>
        <button type="button" onClick={alCerrar} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5">
          <X size={18} />
        </button>
      </div>

      {paso === "pin" && (
        <div className="mt-8">
          <p className="font-semibold">Ponga su PIN</p>
          <p className="text-[0.85rem] opacity-60">En la demo es {PIN_EJEMPLO}.</p>
          <div className="mt-4 flex justify-center gap-3" aria-live="polite">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-4 w-4 rounded-full border-2" style={{ borderColor: error ? ROJO : PLANO, background: pin.length > i ? (error ? ROJO : PLANO) : "transparent" }} />
            ))}
          </div>
          {error && <p className="mt-2 text-center text-[0.9rem] font-semibold" style={{ color: ROJO }}>Ese PIN no es. Intente otra vez.</p>}
          <div className="mx-auto mt-6 grid max-w-[16rem] grid-cols-3 gap-2.5">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((k) => (
              <button key={k} type="button" onClick={() => tecla(k)} className="num h-14 rounded-xl border text-[1.4rem] font-bold active:scale-95" style={{ borderColor: "rgba(23,58,94,.2)" }}>
                {k}
              </button>
            ))}
            <span />
            <button type="button" onClick={() => tecla("0")} className="num h-14 rounded-xl border text-[1.4rem] font-bold active:scale-95" style={{ borderColor: "rgba(23,58,94,.2)" }}>
              0
            </button>
            <button type="button" onClick={() => setPin((x) => x.slice(0, -1))} aria-label="Borrar" className="grid h-14 place-items-center rounded-xl active:scale-95">
              <Delete size={22} />
            </button>
          </div>
        </div>
      )}

      {paso === "foto" && (
        <div className="mt-8">
          <p className="font-semibold">Ahora una foto</p>
          <p className="text-[0.85rem] opacity-60">Así se sabe que de verdad es usted.</p>
          <div className="relative mx-auto mt-4 grid aspect-[3/4] w-full max-w-[15rem] place-items-center overflow-hidden rounded-2xl" style={{ background: PLANO2 }}>
            <span className="rounded-full ring-4 ring-white/80">
              <Avatar t={t} size={110} />
            </span>
            <span className="absolute inset-6 rounded-[45%] border-2 border-dashed border-white/50" aria-hidden />
            <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded bg-black/40 px-2 py-0.5 text-[0.75rem] text-white">
              <MapPin size={12} /> {obra}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setHecho(p.marcar(t));
              setPaso("listo");
            }}
            className="mx-auto mt-5 flex w-full max-w-[15rem] items-center justify-center gap-2 rounded-xl py-3.5 font-bold active:scale-[0.98]"
            style={{ background: CASCO, color: TINTA }}
          >
            <Camera size={18} /> Tomar foto y marcar
          </button>
        </div>
      )}

      {paso === "listo" && hecho && (
        <div className="mt-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full text-white" style={{ background: VERDE }}>
            <Check size={32} />
          </span>
          <p className="plan-titulo mt-4 text-[2.2rem]">
            {hecho.tipo === "entrada" ? "Entrada" : "Salida"} a las {hora(hecho.min)}
          </p>
          <p className="mt-2 opacity-75">Con foto y ubicación en {obra}.</p>
          <p className="mt-1 text-[0.9rem] opacity-60">La oficina ya lo ve en la planilla.</p>
          <button type="button" onClick={alCerrar} className="mt-8 w-full rounded-xl py-3.5 font-bold text-white" style={{ background: PLANO }}>
            Listo
          </button>
        </div>
      )}
    </div>
  );
}

/* ───────────── Planilla de la semana (oficina) ───────────── */

function Oficina({ p }: { p: Planilla }) {
  const [obra, setObra] = useState<string>("todas");
  const [detalle, setDetalle] = useState<Trabajador | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const filas = TRABAJADORES.map((t) => ({ t, c: calcular(t, p.diasDe(t), p.vales) }));
  const visibles = filas.filter((f) => obra === "todas" || f.t.obra === obra);
  const total = visibles.reduce((s, f) => s + f.c.total, 0);
  const horasExtra = visibles.reduce((s, f) => s + f.c.horasExtra, 0);
  const adentro = TRABAJADORES.filter((t) => {
    const m = p.diasDe(t).find((d) => d.fecha === p.hoy)?.marca;
    return m && m.salida === null;
  }).length;
  const alertas = filas.flatMap(({ t, c }) => [
    ...(c.faltas ? [{ t, texto: `faltó ${c.faltas === 1 ? "un día" : `${c.faltas} días`} y pierde el séptimo`, color: ROJO }] : []),
    ...(c.tardes >= 2 ? [{ t, texto: `llegó tarde ${c.tardes} veces esta semana`, color: "#b26a00" }] : []),
    ...(c.lejos ? [{ t, texto: "marcó lejos de su obra un día; revise la ubicación", color: ROJO }] : []),
  ]);
  const porObra = OBRAS.map((o) => ({ o, total: filas.filter((f) => f.t.obra === o.id).reduce((s, f) => s + f.c.total + f.c.igss + f.c.descVales, 0) }));
  const maxObra = Math.max(...porObra.map((x) => x.total));
  const rango = `${diaCorto(p.dias[0])} ${p.dias[0].slice(8)} al ${diaCorto(p.dias[5])} ${p.dias[5].slice(8)}`;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Marca />
        <button type="button" onClick={p.reiniciar} className="text-[0.85rem] font-semibold underline underline-offset-4 opacity-70">
          Volver a los datos de ejemplo
        </button>
      </header>

      <h1 className="plan-titulo mt-6 text-[2.6rem] sm:text-[3.2rem]">Planilla de la semana</h1>
      <p className="cota mt-2 max-w-md">
        <span className="cota-borde">{rango}</span>
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["A pagar esta semana", qz(total)],
          ["Trabajadores", String(visibles.length)],
          ["En obra ahorita", String(adentro)],
          ["Horas extra", `${horasExtra} h`],
        ].map(([a, b]) => (
          <div key={a} className="ficha p-4">
            <p className="text-[0.85rem] opacity-70">{a}</p>
            <p className="plan-titulo num mt-1 text-[1.9rem]">{b}</p>
          </div>
        ))}
      </div>

      {alertas.length > 0 && (
        <section className="mt-6 ficha p-4">
          <h2 className="flex items-center gap-2 font-bold">
            <AlertTriangle size={18} style={{ color: ROJO }} /> Para revisar antes de pagar
          </h2>
          <ul className="mt-2 grid gap-1.5">
            {alertas.map((a, i) => (
              <li key={i}>
                <button type="button" onClick={() => setDetalle(a.t)} className="text-left hover:underline">
                  <b>{a.t.nombre}</b> <span style={{ color: a.color }}>{a.texto}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por obra">
        {[{ id: "todas", nombre: "Todas las obras" }, ...OBRAS].map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setObra(x.id)}
            aria-pressed={obra === x.id}
            className="rounded-full border px-3.5 py-1.5 text-[0.9rem] font-semibold"
            style={obra === x.id ? { background: PLANO, color: "#fff", borderColor: PLANO } : { background: "#fff", borderColor: "rgba(23,58,94,.2)" }}
          >
            {x.nombre}
          </button>
        ))}
      </div>

      {/* tabla en compu */}
      <div className="ficha mt-4 hidden overflow-x-auto md:block">
        <table className="num w-full text-[0.92rem]">
          <thead>
            <tr className="text-left" style={{ background: PLANO, color: "#fff" }}>
              {["Trabajador", "Días", "H. extra", "Ordinario", "Séptimo", "Extras", "Bonificación", "IGSS", "Vales", "A pagar"].map((h) => (
                <th key={h} className="px-3 py-2.5 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.map(({ t, c }) => (
              <tr key={t.id} onClick={() => setDetalle(t)} className="cursor-pointer border-t hover:bg-[#f4f7fa]" style={{ borderColor: "rgba(23,58,94,.1)" }}>
                <td className="px-3 py-2.5">
                  <span className="font-bold">{t.nombre}</span>
                  <span className="block text-[0.8rem] opacity-60">
                    {t.puesto} · {obraDe(t.obra).nombre}
                  </span>
                </td>
                <td className="px-3">{c.diasTrab}/6</td>
                <td className="px-3">{c.horasExtra || "—"}</td>
                <td className="px-3">{qz(c.ordinario)}</td>
                <td className="px-3" style={{ color: c.septimoEstado === "no" ? ROJO : undefined, opacity: c.septimoEstado === "pendiente" ? 0.55 : 1 }}>
                  {c.septimoEstado === "si" ? qz(c.septimo) : c.septimoEstado === "no" ? "Lo perdió" : "Pendiente"}
                </td>
                <td className="px-3">{c.extras ? qz(c.extras) : "—"}</td>
                <td className="px-3">{qz(c.bonificacion)}</td>
                <td className="px-3">−{qz(c.igss)}</td>
                <td className="px-3">{c.descVales ? `−${qz(c.descVales)}` : "—"}</td>
                <td className="px-3 font-bold">{qz(c.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* tarjetas en teléfono */}
      <ul className="mt-4 grid gap-2.5 md:hidden">
        {visibles.map(({ t, c }) => (
          <li key={t.id}>
            <button type="button" onClick={() => setDetalle(t)} className="ficha flex w-full items-center gap-3 p-3 text-left">
              <Avatar t={t} size={40} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{t.nombre}</span>
                <span className="num block text-[0.82rem] opacity-70">
                  {c.diasTrab}/6 días{c.horasExtra ? ` · ${c.horasExtra} h extra` : ""}
                  {c.septimoEstado === "no" ? " · sin séptimo" : ""}
                </span>
              </span>
              <span className="num font-bold">{qz(c.total)}</span>
            </button>
          </li>
        ))}
      </ul>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="ficha p-4">
          <h2 className="font-bold">Lo que cuesta la mano de obra en cada obra</h2>
          <ul className="mt-3 grid gap-3">
            {porObra.map(({ o, total: x }) => (
              <li key={o.id}>
                <div className="flex justify-between text-[0.92rem]">
                  <span>{o.nombre}</span>
                  <b className="num">{qz(x)}</b>
                </div>
                <div className="mt-1 h-2.5 rounded-full bg-[#e3e9f0]">
                  <div className="h-full rounded-full" style={{ width: `${(x / maxObra) * 100}%`, background: PLANO }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.82rem] opacity-60">Incluye IGSS y vales, para que sepa cuánto le está costando cada proyecto.</p>
        </div>
        <div className="ficha p-4">
          <h2 className="flex items-center gap-2 font-bold">
            <HandCoins size={18} /> Vales y adelantos de la semana
          </h2>
          {p.vales.length === 0 ? (
            <p className="mt-2 opacity-70">Nadie ha pedido vale esta semana.</p>
          ) : (
            <ul className="mt-2 grid gap-1.5 text-[0.92rem]">
              {p.vales.map((v) => {
                const t = TRABAJADORES.find((x) => x.id === v.trabajador)!;
                return (
                  <li key={v.id} className="flex justify-between gap-3">
                    <span>
                      <b>{t.nombre}</b> <span className="opacity-70">· {v.motivo}</span>
                    </span>
                    <span className="num font-semibold">{qz(v.monto)}</span>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-3 text-[0.82rem] opacity-60">Se descuentan solos de la planilla. Ya no se olvida ninguno.</p>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {p.cerrada ? (
          <p className="flex items-center gap-2 font-semibold" style={{ color: VERDE }}>
            <Check size={18} /> Planilla cerrada. Cada trabajador ya tiene su boleta en el teléfono.
          </p>
        ) : (
          <button
            type="button"
            onClick={() => {
              p.cerrar();
              const t = TRABAJADORES[1];
              const c = calcular(t, p.diasDe(t), p.vales);
              setMsg(`Hola ${t.nombre.split(" ")[0]}, ya está su boleta de esta semana.\n\nDías: ${c.diasTrab}\nHoras extra: ${c.horasExtra}\nA recibir: ${qz(c.total)}\n\nVea el detalle aquí: loscedros.gt/boleta`);
            }}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-bold active:scale-[0.98]"
            style={{ background: CASCO, color: TINTA }}
          >
            <FileText size={18} /> Cerrar planilla y mandar boletas
          </button>
        )}
      </div>

      <Cajon abierto={detalle !== null} alCerrar={() => setDetalle(null)} fondo="#fff">
        {detalle && <Detalle t={detalle} p={p} alCerrar={() => setDetalle(null)} />}
      </Cajon>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="planilla y control de empleados" que="la boleta" />
    </main>
  );
}

function Desglose({ t, p }: { t: Trabajador; p: Planilla }) {
  const c = calcular(t, p.diasDe(t), p.vales);
  const filas: [string, string, number, boolean?][] = [
    ["Días trabajados", `${c.diasTrab} × ${qz(t.diario)}`, c.ordinario],
    ["Séptimo día", c.septimoEstado === "si" ? "Trabajó la semana completa" : c.septimoEstado === "no" ? "No se paga: le faltó un día" : `Se suma si completa la semana (faltan ${c.pendientes} días)`, c.septimo],
    ["Horas extra", c.horasExtra ? `${c.horasExtra} h × ${qz((t.diario / 8) * 1.5)} (hora y media)` : "No hizo", c.extras],
    ["Bonificación incentivo", `Q${BONIF_MES} al mes, por días trabajados`, c.bonificacion],
    ["IGSS", `${(IGSS * 100).toFixed(2)}% de lo ganado`, -c.igss, true],
    ...c.misVales.map((v) => [`Vale: ${v.motivo}`, `Pedido el ${diaCorto(v.fecha)}`, -v.monto, true] as [string, string, number, boolean]),
  ];
  return (
    <div className="ficha overflow-hidden">
      <ul>
        {filas.map(([a, b, n, menos]) => (
          <li key={a} className="flex items-start justify-between gap-3 border-b px-4 py-2.5" style={{ borderColor: "rgba(23,58,94,.1)" }}>
            <span>
              <span className="block font-semibold">{a}</span>
              <span className="block text-[0.82rem] opacity-65">{b}</span>
            </span>
            <span className="num font-semibold" style={{ color: menos ? ROJO : undefined }}>
              {menos ? `−${qz(-n)}` : qz(n)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between px-4 py-3 text-white" style={{ background: PLANO }}>
        <span className="font-bold">A recibir</span>
        <span className="plan-titulo num text-[1.5rem]">{qz(c.total)}</span>
      </div>
    </div>
  );
}

function Dias({ t, p }: { t: Trabajador; p: Planilla }) {
  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {p.diasDe(t).map((d) => {
        const futuro = d.fecha > p.hoy;
        const j = jornada(d.fecha);
        const tarde = d.marca && d.marca.entrada > j.entra + 10;
        return (
          <li key={d.fecha} className="ficha p-2 text-center" style={!d.marca && !futuro ? { borderColor: ROJO } : undefined}>
            <p className="text-[0.8rem] font-semibold opacity-70">
              {diaCorto(d.fecha)} {d.fecha.slice(8)}
            </p>
            {d.marca ? (
              <>
                <p className="num mt-1 text-[0.85rem] font-bold" style={{ color: tarde ? ROJO : undefined }}>
                  {hora(d.marca.entrada)}
                </p>
                <p className="num text-[0.85rem] opacity-75">{d.marca.salida !== null ? hora(d.marca.salida) : "adentro"}</p>
                {d.marca.lejos && (
                  <p className="mt-1 flex items-center justify-center gap-0.5 text-[0.7rem] font-semibold" style={{ color: ROJO }}>
                    <MapPin size={10} /> lejos
                  </p>
                )}
              </>
            ) : (
              <p className="mt-2 text-[0.82rem] font-semibold" style={{ color: futuro ? undefined : ROJO, opacity: futuro ? 0.4 : 1 }}>
                {futuro ? "—" : "Faltó"}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Detalle({ t, p, alCerrar }: { t: Trabajador; p: Planilla; alCerrar: () => void }) {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar t={t} size={52} />
          <div>
            <p className="text-[1.15rem] font-bold">{t.nombre}</p>
            <p className="text-[0.9rem] opacity-70">
              {t.puesto} · {obraDe(t.obra).nombre} · {qz(t.diario)} al día
            </p>
          </div>
        </div>
        <button type="button" onClick={alCerrar} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5">
          <X size={18} />
        </button>
      </div>
      <h3 className="mt-6 flex items-center gap-2 font-bold">
        <Clock size={16} /> Entradas y salidas
      </h3>
      <div className="mt-2">
        <Dias t={t} p={p} />
      </div>
      <h3 className="mt-6 font-bold">De dónde sale cada quetzal</h3>
      <div className="mt-2">
        <Desglose t={t} p={p} />
      </div>
    </div>
  );
}

/* ───────────── Mi boleta (teléfono del trabajador) ───────────── */

function Boleta({ p }: { p: Planilla }) {
  const [id, setId] = useState("ko");
  const t = TRABAJADORES.find((x) => x.id === id)!;
  const [pidiendo, setPidiendo] = useState(false);
  const [monto, setMonto] = useState(150);
  const [motivo, setMotivo] = useState("");
  const [listo, setListo] = useState(false);
  const c = calcular(t, p.diasDe(t), p.vales);

  return (
    <main className="mx-auto max-w-md px-4 pb-16 pt-6">
      <label className="block text-[0.85rem] font-semibold opacity-70">
        Ver como
        <select value={id} onChange={(e) => { setId(e.target.value); setListo(false); }} className="mt-1 block w-full rounded-lg border bg-white px-3 py-2.5 text-[1rem] font-semibold" style={{ borderColor: "rgba(23,58,94,.25)", color: TINTA }}>
          {TRABAJADORES.map((x) => (
            <option key={x.id} value={x.id}>
              {x.nombre} ({x.puesto})
            </option>
          ))}
        </select>
      </label>

      <div className="mt-5 rounded-2xl p-5 text-white" style={{ background: PLANO }}>
        <div className="flex items-center gap-3">
          <Avatar t={t} size={48} />
          <div>
            <p className="text-[0.9rem] opacity-75">Hola,</p>
            <p className="plan-titulo text-[1.8rem]">{t.nombre.split(" ")[0]}</p>
          </div>
        </div>
        <p className="mt-4 text-[0.9rem] opacity-75">Lo que lleva ganado esta semana, hasta hoy</p>
        <p className="plan-titulo num text-[3rem]" style={{ color: CASCO }}>
          {qz(c.total)}
        </p>
        <p className="num text-[0.9rem] opacity-75">
          {c.diasTrab} de 6 días · {c.horasExtra} h extra · {c.septimoEstado === "si" ? "con séptimo" : c.septimoEstado === "no" ? "sin séptimo" : "séptimo pendiente"}
        </p>
      </div>

      <h2 className="mt-6 font-bold">Mis días</h2>
      <div className="mt-2">
        <Dias t={t} p={p} />
      </div>

      <h2 className="mt-6 font-bold">Mi boleta</h2>
      <div className="mt-2">
        <Desglose t={t} p={p} />
      </div>

      <div className="mt-6 ficha p-4">
        {listo ? (
          <p className="flex items-start gap-2 font-semibold" style={{ color: VERDE }}>
            <Check size={18} className="mt-0.5 shrink-0" /> Listo. La oficina ya ve su vale y se descuenta solo en la planilla.
          </p>
        ) : !pidiendo ? (
          <button type="button" onClick={() => setPidiendo(true)} className="flex w-full items-center justify-between font-bold">
            <span className="flex items-center gap-2">
              <HandCoins size={18} /> Pedir un vale o adelanto
            </span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              p.pedirVale(t, monto, motivo.trim() || "Adelanto");
              setPidiendo(false);
              setMotivo("");
              setListo(true);
            }}
          >
            <p className="font-bold">¿Cuánto necesita?</p>
            <div className="mt-2 flex gap-2">
              {[100, 150, 200, 300].map((m) => (
                <button key={m} type="button" onClick={() => setMonto(m)} aria-pressed={monto === m} className="num flex-1 rounded-lg border py-2 font-bold" style={monto === m ? { background: PLANO, color: "#fff", borderColor: PLANO } : { borderColor: "rgba(23,58,94,.2)" }}>
                  Q{m}
                </button>
              ))}
            </div>
            <label className="mt-3 block text-[0.9rem] font-semibold">
              ¿Para qué? (opcional)
              <input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Pasaje, medicina…" className="mt-1 block w-full rounded-lg border px-3 py-2.5" style={{ borderColor: "rgba(23,58,94,.25)" }} />
            </label>
            <button type="submit" className="mt-3 w-full rounded-lg py-3 font-bold" style={{ background: CASCO, color: TINTA }}>
              Pedir {`Q${monto}`}
            </button>
          </form>
        )}
      </div>
      <p className="mt-4 text-center text-[0.85rem] opacity-60">Sin papeles: su boleta queda aquí cada semana.</p>
    </main>
  );
}
