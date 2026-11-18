/*
 * Demo: "Fiestas La Ceiba" (negocio inventado, datos de ejemplo, fotos de Unsplash).
 * Dos partes: la página para el cliente (cotizador por invitados con la fecha libre y el anticipo)
 * y la bodega (eventos del fin de semana, hoja de carga, lo que queda libre y lo que regresó).
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, Minus, Plus, Truck } from "lucide-react";
import { BandaDemos, CierreJzet, MensajeWhatsApp } from "../comun";
import {
  ANIL, ANIL2, CIELO, COLORES, FOTOS, HOJA, INVENTARIO, MAIZ, PASADO, ROSA, SERIF, TINTA, TURQ, ZONAS,
  armar, clave, fechaCorta, fechaLarga, finesDeSemana, porId, qz, subtotal, useEventos,
  type Cot, type Ev,
} from "./datos";

const btn = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold transition active:scale-[0.98]";
const PICADO = [ROSA, MAIZ, HOJA, TURQ, "#ffffff"];

const ESTILOS = `
.fiesta h1, .fiesta h2, .fiesta h3 { color: inherit; }
.fiesta-titulo { font-family: ${SERIF}; line-height: 1.02; letter-spacing: -0.01em; }
.fiesta-hero { display: grid; gap: 2.2rem; }
@media (min-width: 960px) { .fiesta-hero { grid-template-columns: 1fr 1.05fr; align-items: center; } }
.cotizador { display: grid; gap: 1.5rem; }
@media (min-width: 960px) { .cotizador { grid-template-columns: 1.15fr 1fr; align-items: start; } }
.bodega { display: grid; gap: 1.5rem; }
@media (min-width: 1024px) { .bodega { grid-template-columns: 1.4fr 1fr; } }
.banderita { transform-origin: 50% 0; animation: mecer 4.5s ease-in-out infinite; }
@keyframes mecer { 0%,100% { transform: rotate(-2.5deg); } 50% { transform: rotate(2.5deg); } }
@media (prefers-reduced-motion: reduce) { .banderita { animation: none; } }
`;

/* papel picado: banderitas con figuras recortadas colgando de un cordel */
function PapelPicado({ n = 14, alto = 64 }: { n?: number; alto?: number }) {
  return (
    <div aria-hidden className="relative w-full overflow-hidden" style={{ height: alto + 14 }}>
      <svg className="absolute inset-x-0 top-0" width="100%" height="14" preserveAspectRatio="none" viewBox="0 0 100 14">
        <path d="M0 3 Q50 12 100 3" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="absolute inset-x-0 top-[6px] flex justify-around px-2">
        {Array.from({ length: n }, (_, k) => {
          const c = PICADO[k % PICADO.length];
          const caida = Math.sin((k / (n - 1)) * Math.PI) * 6;
          return (
            <svg key={k} className="banderita" style={{ animationDelay: `${(k % 5) * -0.7}s`, marginTop: caida }} width={alto * 0.78} height={alto} viewBox="0 0 39 50">
              <defs>
                <mask id={`m${k}`}>
                  <rect width="39" height="50" fill="#fff" />
                  <circle cx="19.5" cy="18" r="6" fill="#000" />
                  <path d="M19.5 9 l2 5 h-4 z M19.5 27 l2 -5 h-4 z M10.5 18 l5 2 v-4 z M28.5 18 l-5 2 v-4 z" fill="#000" />
                  <circle cx="8" cy="33" r="2" fill="#000" />
                  <circle cx="19.5" cy="35" r="2.4" fill="#000" />
                  <circle cx="31" cy="33" r="2" fill="#000" />
                  <path d="M6 41 h27" stroke="#000" strokeWidth="1.6" strokeDasharray="2.5 2" />
                </mask>
              </defs>
              <path d="M0 0 H39 V44 L35 50 L31 44 L27 50 L23 44 L19.5 50 L16 44 L12 50 L8 44 L4 50 L0 44 Z" fill={c} mask={`url(#m${k})`} opacity={c === "#ffffff" ? 0.92 : 1} />
            </svg>
          );
        })}
      </div>
    </div>
  );
}

/* logo: copa de la ceiba encima de un toldo */
function Logo({ tam = 42 }: { tam?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={tam} height={tam} aria-hidden className="shrink-0">
      <path d="M24 4 C14 4 7 9 7 14 C7 17 10 18 13 17 C14 20 19 21 24 19 C29 21 34 20 35 17 C38 18 41 17 41 14 C41 9 34 4 24 4 Z" fill={HOJA} />
      <path d="M22.5 18 L21 27 H27 L25.5 18 Z" fill="#7a4e2d" />
      <path d="M4 34 L24 25 L44 34 Z" fill="#fff" />
      <path d="M4 34 q3.3 4 6.7 0 q3.3 4 6.6 0 q3.4 4 6.7 0 q3.3 4 6.7 0 q3.3 4 6.6 0 q3.4 4 6.7 0" fill={ROSA} />
      <path d="M8 37 V45 M40 37 V45" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function Marca({ claro = false }: { claro?: boolean }) {
  return (
    <span className="flex items-center gap-2.5" style={{ color: claro ? "#fff" : TINTA }}>
      <Logo />
      <span className="leading-none">
        <span className="fiesta-titulo block text-[1.4rem]">Fiestas La Ceiba</span>
        <span className="block text-[0.72rem] font-semibold opacity-70">Mobiliario, toldos y mantelería · Mixco</span>
      </span>
    </span>
  );
}

type Vista = "pagina" | "bodega";

export default function EventosDemo() {
  const ev = useEventos();
  const leer = (): Vista => (location.hash === "#bodega" ? "bodega" : "pagina");
  const [vista, setVista] = useState<Vista>(leer);
  useEffect(() => {
    const cambio = () => setVista(leer());
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", vista === "pagina" ? location.pathname : "#bodega");
    document.title = vista === "bodega" ? "Bodega · Fiestas La Ceiba" : "Fiestas La Ceiba · Demo de Jzet Labs";
    window.scrollTo(0, 0);
  }, [vista]);

  return (
    <div className="fiesta min-h-screen" style={{ background: CIELO, color: TINTA }}>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <div style={{ background: ANIL2 }} className="text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-2 text-[0.82rem] sm:justify-between">
          <p className="hidden text-white/65 sm:block">Dos partes: la página para sus clientes y la bodega.</p>
          <div className="flex rounded-full bg-white/10 p-0.5">
            {(
              [
                ["pagina", "Página"],
                ["bodega", "Bodega y calendario"],
              ] as const
            ).map(([v, t]) => (
              <button key={v} type="button" onClick={() => setVista(v)} aria-pressed={vista === v} className={`rounded-full px-3.5 py-1.5 font-semibold transition ${vista === v ? "bg-white" : "text-white/80"}`} style={vista === v ? { color: ANIL } : undefined}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      {vista === "pagina" ? <Pagina ev={ev} alApartar={() => setVista("bodega")} /> : <Bodega ev={ev} />}
      <CierreJzet demo="alquiler de mobiliario para eventos" />
    </div>
  );
}

/* ---------------- la página ---------------- */

function Pagina({ ev, alApartar }: { ev: Ev; alApartar: () => void }) {
  const fines = useMemo(() => finesDeSemana(6), []);
  const [fecha, setFecha] = useState(clave(fines[1]));
  const [c, setC] = useState<Cot>({ invitados: 80, silla: "plegable", toldo: true, pista: false, luces: true, color: "rosa", zona: "mixco" });
  const [nombre, setNombre] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const lineas = armar(c);
  const flete = porId(ZONAS, c.zona).flete;
  const total = subtotal(lineas) + flete;
  const anticipo = Math.round(total / 2);
  const faltan = lineas.filter((l) => ev.libres(fecha, l.id) < l.n);
  const set = <K extends keyof Cot>(k: K, v: Cot[K]) => setC((x) => ({ ...x, [k]: v }));
  const fechaD = fines.find((f) => clave(f) === fecha)!;

  function apartar() {
    const quien = nombre.trim() || "Cliente de la página";
    ev.apartar({ fecha, cliente: quien, tipo: "Evento", lugar: porId(ZONAS, c.zona).nombre, montaje: "Por confirmar", lineas, total, anticipo, color: c.color });
    setMsg(
      `Hola, Fiestas La Ceiba. Soy ${quien}. Quiero apartar para el ${fechaLarga(fechaD)}:\n` +
        lineas.map((l) => `- ${l.n} ${porId(INVENTARIO, l.id).nombre.toLowerCase()}`).join("\n") +
        `\nCaminos de mesa en ${porId(COLORES, c.color).nombre.toLowerCase()}. Flete a ${porId(ZONAS, c.zona).nombre}: ${flete ? qz(flete) : "gratis"}.\nTotal ${qz(total)}. Anticipo para apartar: ${qz(anticipo)}.`,
    );
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-black/5 backdrop-blur" style={{ background: "rgba(231,235,247,.94)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#inicio" aria-label="Fiestas La Ceiba">
            <Marca />
          </a>
          <nav className="hidden gap-7 font-semibold md:flex">
            <a href="#cotizar" className="hover:underline">Cotizar</a>
            <a href="#mobiliario" className="hover:underline">Mobiliario</a>
            <a href="#como" className="hover:underline">Cómo apartar</a>
          </nav>
          <a href="#cotizar" className={`${btn} !px-4 !py-2.5 text-white`} style={{ background: ANIL }}>
            Cotizar mi fiesta
          </a>
        </div>
      </header>

      <section id="inicio" style={{ background: ANIL }} className="text-white">
        <PapelPicado />
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-4 md:pb-16">
          <div className="fiesta-hero">
            <div>
              <p className="font-semibold text-white/75">Cumpleaños, primeras comuniones, bodas y fiestas de colonia</p>
              <h1 className="fiesta-titulo mt-4 text-[2.9rem] sm:text-[4.1rem]">Sepa si su fecha está libre y cuánto le sale, sin esperar respuesta.</h1>
              <p className="mt-5 max-w-lg text-[1.08rem] leading-relaxed text-white/80">
                Diga cuántos invitados espera y le armamos sillas, mesas, manteles y toldo. Aparta con la mitad y el resto lo paga el día que montamos.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#cotizar" className={btn} style={{ background: MAIZ, color: TINTA }}>
                  Cotizar mi fiesta <ArrowRight size={18} />
                </a>
                <a href="#mobiliario" className={`${btn} border-2 border-white/40`}>
                  Ver el mobiliario
                </a>
              </div>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
              <img src={FOTOS.carpa} alt="Toldo blanco montado para una recepción" className="row-span-2 h-[380px] w-full rounded-2xl object-cover sm:h-[440px]" />
              <img src={FOTOS.mesa} alt="Mesa redonda con mantel y centro de mesa" className="h-full w-full rounded-2xl object-cover" />
              <img src={FOTOS.sillas} alt="Filas de sillas blancas para una ceremonia" className="h-full w-full rounded-2xl object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* cotizador */}
      <section id="cotizar" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14 md:py-16">
        <h2 className="fiesta-titulo text-[2.4rem] sm:text-[3rem]">Cotice su fiesta</h2>
        <p className="mt-1 opacity-75">Cambie los datos y el total se arma solo. Los precios son por día, con montaje y recogida.</p>
        <div className="cotizador mt-8">
          <div className="grid gap-6 rounded-2xl bg-white p-5 sm:p-7">
            <div>
              <p className="flex items-center gap-2 font-semibold">
                <CalendarDays size={18} /> ¿Para qué fecha?
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {fines.map((f) => {
                  const k = clave(f);
                  const ocupado = ev.eventos.filter((x) => x.fecha === k).length;
                  return (
                    <button key={k} type="button" onClick={() => setFecha(k)} className="rounded-xl border-2 px-2 py-2 text-center text-[0.85rem] leading-tight" style={fecha === k ? { borderColor: ANIL, background: ANIL, color: "#fff" } : { borderColor: "rgba(0,0,0,.1)" }}>
                      <b className="block capitalize">{fechaCorta(f)}</b>
                      <span className="opacity-75">{ocupado ? `${ocupado} evento${ocupado > 1 ? "s" : ""}` : "libre"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between font-semibold">
                <span>¿Cuántos invitados?</span>
                <span className="flex items-center gap-2">
                  <button type="button" aria-label="Diez menos" onClick={() => set("invitados", Math.max(20, c.invitados - 10))} className="grid h-9 w-9 place-items-center rounded-full border border-black/15"><Minus size={14} /></button>
                  <b className="w-10 text-center text-[1.3rem]">{c.invitados}</b>
                  <button type="button" aria-label="Diez más" onClick={() => set("invitados", Math.min(250, c.invitados + 10))} className="grid h-9 w-9 place-items-center rounded-full border border-black/15"><Plus size={14} /></button>
                </span>
              </div>
              <input type="range" min={20} max={250} step={10} value={c.invitados} onChange={(e) => set("invitados", Number(e.target.value))} className="mt-3 w-full" style={{ accentColor: ANIL }} aria-label="Invitados" />
            </div>
            <div>
              <p className="font-semibold">Sillas</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(
                  [
                    ["plegable", "Plegable blanca", "Q5 cada una"],
                    ["tiffany", "Tiffany dorada", "Q15 cada una"],
                  ] as const
                ).map(([v, t, p]) => (
                  <button key={v} type="button" onClick={() => set("silla", v)} className="rounded-xl border-2 px-3 py-2.5 text-left" style={c.silla === v ? { borderColor: ANIL, background: CIELO } : { borderColor: "rgba(0,0,0,.1)" }}>
                    <b className="block">{t}</b>
                    <span className="text-[0.85rem] opacity-70">{p}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {(
                [
                  ["toldo", "Toldo"],
                  ["pista", "Pista de baile"],
                  ["luces", "Series de focos"],
                ] as const
              ).map(([k, t]) => (
                <label key={k} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-black/10 px-3 py-2.5 font-semibold">
                  <input type="checkbox" checked={c[k]} onChange={(e) => set(k, e.target.checked)} className="h-5 w-5" style={{ accentColor: ANIL }} />
                  {t}
                </label>
              ))}
            </div>
            <div>
              <p className="font-semibold">Color de los caminos de mesa</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {COLORES.map((x) => (
                  <button key={x.id} type="button" onClick={() => set("color", x.id)} aria-pressed={c.color === x.id} className="flex items-center gap-2 rounded-full border-2 py-1 pl-1 pr-3 text-[0.9rem] font-semibold" style={{ borderColor: c.color === x.id ? TINTA : "rgba(0,0,0,.1)" }}>
                    <span className="h-6 w-6 rounded-full" style={{ background: x.c }} /> {x.nombre}
                  </button>
                ))}
              </div>
            </div>
            <label className="block font-semibold">
              ¿Dónde es la fiesta?
              <select value={c.zona} onChange={(e) => set("zona", e.target.value)} className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 font-normal">
                {ZONAS.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.nombre} · flete {z.flete ? qz(z.flete) : "gratis"}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* la cotización, como nota de la bodega */}
          <div className="rounded-2xl p-5 text-white sm:p-7 lg:sticky lg:top-24" style={{ background: ANIL2 }}>
            <p className="text-white/70">Su cotización para el</p>
            <p className="fiesta-titulo text-[1.7rem] capitalize">{fechaLarga(fechaD)}</p>
            <ul className="mt-4 grid gap-2 border-y border-white/15 py-4">
              {lineas.map((l) => {
                const a = porId(INVENTARIO, l.id);
                const libres = ev.libres(fecha, l.id);
                return (
                  <li key={l.id} className="flex justify-between gap-3">
                    <span>
                      {l.n} × {a.nombre}
                      {libres < l.n && <span className="block text-[0.85rem]" style={{ color: MAIZ }}>Ese día solo quedan {Math.max(0, libres)}</span>}
                    </span>
                    <b>{qz(a.precio * l.n)}</b>
                  </li>
                );
              })}
              <li className="flex justify-between gap-3">
                <span>Flete, montaje y recogida</span>
                <b>{flete ? qz(flete) : "gratis"}</b>
              </li>
            </ul>
            <div className="mt-4 flex items-end justify-between">
              <span>Total</span>
              <span className="fiesta-titulo text-[2.2rem] leading-none">{qz(total)}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-[0.92rem]">
              <div className="rounded-xl bg-white/10 p-2.5">
                <span className="block text-white/70">Para apartar</span>
                <b className="text-[1.2rem]">{qz(anticipo)}</b>
              </div>
              <div className="rounded-xl bg-white/10 p-2.5">
                <span className="block text-white/70">El día del montaje</span>
                <b className="text-[1.2rem]">{qz(total - anticipo)}</b>
              </div>
            </div>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Su nombre" className="mt-4 w-full rounded-xl bg-white px-3 py-2.5" style={{ color: TINTA }} />
            <button type="button" onClick={apartar} disabled={faltan.length > 0} className={`${btn} mt-3 w-full disabled:opacity-40`} style={{ background: MAIZ, color: TINTA }}>
              Apartar la fecha <ArrowRight size={18} />
            </button>
            {faltan.length > 0 && <p className="mt-2 text-[0.9rem] text-white/80">Escoja otra fecha o cambie las sillas: ese día ya no alcanza lo que pide.</p>}
          </div>
        </div>
      </section>

      {/* mobiliario */}
      <section id="mobiliario" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
          <h2 className="fiesta-titulo text-[2.4rem] sm:text-[3rem]">El mobiliario</h2>
          <p className="mt-1 opacity-75">Todo se entrega limpio, planchado y lo montamos nosotros.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { f: FOTOS.redondas, t: "Mesas redondas para 10", d: "Con mantel y camino del color que escoja." },
              { f: FOTOS.carpa, t: "Toldos", d: "De 6 × 12 m para 60 personas y de 10 × 20 m para 150." },
              { f: FOTOS.salon, t: "Montaje completo", d: "Llegamos temprano, armamos y recogemos al día siguiente." },
            ].map((x) => (
              <figure key={x.t} className="overflow-hidden rounded-2xl" style={{ background: CIELO }}>
                <img src={x.f} alt={x.t} loading="lazy" className="h-56 w-full object-cover" />
                <figcaption className="p-4">
                  <b className="block text-[1.1rem]">{x.t}</b>
                  <span className="opacity-75">{x.d}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-black/10">
            <table className="w-full min-w-[520px] text-left">
              <thead style={{ background: CIELO }}>
                <tr>
                  <th className="px-4 py-3">Artículo</th>
                  <th className="px-4 py-3">Precio por día</th>
                  <th className="px-4 py-3">Tenemos</th>
                </tr>
              </thead>
              <tbody>
                {INVENTARIO.map((a) => (
                  <tr key={a.id} className="border-t border-black/5">
                    <td className="px-4 py-2.5">{a.nombre}</td>
                    <td className="px-4 py-2.5 font-semibold">{qz(a.precio)}</td>
                    <td className="px-4 py-2.5 opacity-70">{a.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* cómo apartar */}
      <section id="como" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14 md:py-16">
        <h2 className="fiesta-titulo text-[2.4rem] sm:text-[3rem]">Cómo apartar</h2>
        <ol className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            ["Cotice y aparte", "Escoja la fecha y lo que necesita. Con la mitad por transferencia o depósito ya es suya."],
            ["Le confirmamos la hora", "Tres días antes le escribimos para acordar la hora de montaje y la dirección exacta."],
            ["Montamos y recogemos", "El saldo se paga al terminar de montar. Al día siguiente pasamos por todo."],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-2xl bg-white p-5">
              <span className="grid h-10 w-10 place-items-center rounded-full font-bold text-white" style={{ background: PICADO[i] === "#ffffff" ? ANIL : PICADO[i] }}>{i + 1}</span>
              <b className="mt-3 block text-[1.15rem]">{t}</b>
              <p className="mt-1 opacity-80">{d}</p>
            </li>
          ))}
        </ol>
      </section>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="alquiler de mobiliario" que="la reservación" accion={{ texto: "Verla en la bodega", alTocar: () => { setMsg(null); alApartar(); } }} />
    </>
  );
}

/* ---------------- bodega ---------------- */

function Bodega({ ev }: { ev: Ev }) {
  const fines = useMemo(() => finesDeSemana(6), []);
  const [fecha, setFecha] = useState(clave(fines[0]));
  const del = ev.eventos.filter((x) => x.fecha === fecha);
  const carga = INVENTARIO.map((a) => ({ a, n: ev.usados(fecha, a.id) })).filter((x) => x.n > 0);
  const fechaD = fines.find((f) => clave(f) === fecha)!;
  const faltante = PASADO.lineas.map((l) => {
    const a = porId(INVENTARIO, l.id);
    const volvio = ev.regreso[l.id] ?? l.n;
    return { a, salio: l.n, volvio, falta: Math.max(0, l.n - volvio) };
  });
  const cobrar = faltante.reduce((s, x) => s + x.falta * x.a.reposicion, 0);

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-semibold opacity-70">Bodega · Fiestas La Ceiba</p>
          <h1 className="fiesta-titulo text-[2.4rem] sm:text-[3rem]">Los fines de semana</h1>
        </div>
        <button type="button" onClick={ev.reiniciar} className="text-[0.9rem] font-semibold underline opacity-70">Volver a los datos de ejemplo</button>
      </div>
      <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
        {fines.map((f) => {
          const k = clave(f);
          const n = ev.eventos.filter((x) => x.fecha === k).length;
          return (
            <button key={k} type="button" onClick={() => setFecha(k)} className="shrink-0 rounded-xl px-4 py-2 text-left leading-tight" style={fecha === k ? { background: ANIL, color: "#fff" } : { background: "#fff" }}>
              <b className="block capitalize">{fechaCorta(f)}</b>
              <span className="text-[0.85rem] opacity-75">{n ? `${n} evento${n > 1 ? "s" : ""}` : "libre"}</span>
            </button>
          );
        })}
      </div>

      <div className="bodega mt-6">
        <div className="grid content-start gap-4">
          {del.length === 0 && <p className="rounded-2xl bg-white p-5 opacity-75">No hay eventos este día. Todo el mobiliario está libre.</p>}
          {del.map((x) => (
            <article key={x.id} className="overflow-hidden rounded-2xl bg-white">
              <div className="h-2" style={{ background: porId(COLORES, x.color).c }} />
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[0.85rem] font-semibold opacity-60">{x.tipo}</p>
                    <b className="text-[1.2rem]">
                      {x.cliente} {x.nuevo && <span className="ml-1 rounded-full px-2 py-0.5 text-[0.72rem] text-white" style={{ background: ROSA }}>desde la página</span>}
                    </b>
                    <p className="text-[0.92rem] opacity-75">{x.lugar} · montaje {x.montaje}</p>
                  </div>
                  <div className="text-right text-[0.92rem]">
                    <b className="block text-[1.1rem]">{qz(x.total)}</b>
                    <span style={{ color: HOJA }}>anticipo {qz(x.anticipo)}</span>
                    <span className="block opacity-70">saldo {qz(x.total - x.anticipo)}</span>
                  </div>
                </div>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {x.lineas.map((l) => (
                    <li key={l.id} className="rounded-full px-2.5 py-1 text-[0.85rem]" style={{ background: CIELO }}>
                      {l.n} {porId(INVENTARIO, l.id).nombre.toLowerCase()}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="grid content-start gap-4">
          <div className="rounded-2xl p-5 text-white" style={{ background: ANIL2 }}>
            <h2 className="flex items-center gap-2 text-[1.2rem] font-semibold">
              <Truck size={20} /> Hoja de carga · <span className="capitalize">{fechaCorta(fechaD)}</span>
            </h2>
            {carga.length === 0 ? (
              <p className="mt-2 text-white/70">Nada que cargar.</p>
            ) : (
              <ul className="mt-3 grid gap-1.5">
                {carga.map(({ a, n }) => {
                  const libres = a.total - n;
                  return (
                    <li key={a.id} className="flex justify-between gap-3">
                      <span>{a.nombre}</span>
                      <span>
                        <b>{n}</b> <span className="text-[0.85rem]" style={{ color: libres < 0 ? MAIZ : "rgba(255,255,255,.6)" }}>{libres < 0 ? `faltan ${-libres}` : `quedan ${libres}`}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-2xl bg-white p-5">
            <h2 className="text-[1.2rem] font-semibold">Lo que regresó del sábado pasado</h2>
            <p className="text-[0.9rem] opacity-70">{PASADO.cliente}</p>
            <ul className="mt-3 grid gap-2">
              {faltante.map(({ a, salio, volvio, falta }) => (
                <li key={a.id} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 flex-1 leading-tight">
                    {a.nombre}
                    <span className="block text-[0.82rem] opacity-60">salieron {salio}</span>
                  </span>
                  <input type="number" min={0} max={salio} value={volvio} onChange={(e) => ev.contar(a.id, Math.max(0, Math.min(salio, Number(e.target.value))))} aria-label={`Regresaron de ${a.nombre}`} className="w-20 rounded-lg border border-black/15 px-2 py-1.5 text-right" />
                  <span className="w-20 text-right text-[0.9rem] font-semibold" style={{ color: falta ? ROSA : HOJA }}>{falta ? `faltan ${falta}` : <Check size={18} className="ml-auto" />}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between border-t border-black/10 pt-3 font-semibold">
              <span>Cobrar por reposición</span>
              <span style={{ color: cobrar ? ROSA : HOJA }}>{qz(cobrar)}</span>
            </p>
            <p className="mt-1 text-[0.85rem] opacity-65">Se descuenta del depósito o se le cobra al cliente con el detalle.</p>
          </div>
          <img src={FOTOS.apiladas} alt="Mesas y sillas guardadas en la bodega" loading="lazy" className="h-44 w-full rounded-2xl object-cover" />
        </div>
      </div>
    </section>
  );
}
