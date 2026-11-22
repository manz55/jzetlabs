/*
 * Demo: "Spartan Force Gym" (negocio inventado, datos de ejemplo, fotos de Unsplash).
 * Tres partes: la página que ve la gente (cuánta gente hay, planes, clases, sedes con parqueo),
 * la membresía del socio (carnet, días que le quedan, asistencias) y recepción (quién entró y a quién cobrarle).
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Car, Check, Clock, MapPin, Users, X } from "lucide-react";
import PanelGimnasio from "./PanelGimnasio";
import { BandaDemos, PartesDemo, Cajon, CierreJzet, MensajeWhatsApp } from "../comun";
import {
  ACERO, AFORO_BASE, AMARILLO, AVANCES, AZUL, CLASES, COACHES, DIAS, FOTOS, GOMA, GOMA2, HORARIO, INSCRIPCION, PIZARRA, PLANES, PREGUNTAS, ROJO, SEDES, TITULO, TIZA, VERDE,
  aforo, enDias, faltan, fechaCorta, horaAhora, nivel, porId, qz, useGimnasio,
  type Gym, type Socio,
} from "./datos";

const btn = "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 font-bold transition active:scale-[0.98]";

const ESTILOS = `
.gym h1, .gym h2, .gym h3 { color: inherit; }
.gym-titulo { font-family: ${TITULO}; text-transform: uppercase; letter-spacing: -0.01em; line-height: .92; font-weight: 900; }
/* moleteado de la barra olímpica, como divisor */
.moleteado { height: 22px; background:
  repeating-linear-gradient(45deg, rgba(0,0,0,.28) 0 1.5px, transparent 1.5px 6px),
  repeating-linear-gradient(-45deg, rgba(0,0,0,.28) 0 1.5px, transparent 1.5px 6px),
  linear-gradient(#9aa3ab, #e3e7ea 45%, #8b949c); }
.disco { border-radius: 9999px; display: grid; place-items: center; position: relative; box-shadow: inset 0 0 0 6px rgba(0,0,0,.18), inset 0 0 0 14px rgba(255,255,255,.08); }
.disco::after { content: ""; position: absolute; width: 22%; height: 22%; border-radius: 9999px; background: #d4d9dd; box-shadow: inset 0 0 0 3px #9aa3ab; }
.pizarra { background: radial-gradient(120% 80% at 30% 20%, #2f3a35, #1f2724); box-shadow: inset 0 0 0 10px #6b4a2f, inset 0 0 0 12px #3d2a1a; }
.gym-hero { display: grid; gap: 2rem; }
@media (min-width: 960px) { .gym-hero { grid-template-columns: 1.05fr 1fr; align-items: center; } }
.gym-recep { display: grid; gap: 2rem; }
@media (min-width: 1024px) { .gym-recep { grid-template-columns: 1.3fr 1fr; } }
`;

/* logo: casco corintio de frente con la cresta atravesada, como la de los oficiales espartanos */
function Logo({ tam = 44 }: { tam?: number }) {
  const cerdas = Array.from({ length: 11 }, (_, k) => {
    const a = Math.PI * (1 - (k + 0.5) / 11);
    return { x1: 24 + 13 * Math.cos(a), y1: 19 - 11 * Math.sin(a), x2: 24 + 20.5 * Math.cos(a), y2: 19 - 16.5 * Math.sin(a) };
  });
  return (
    <svg viewBox="0 0 48 50" width={tam} height={tam * 1.04} aria-hidden className="shrink-0">
      {/* cresta de crin */}
      <path d="M2.5 19 C4 0.5 44 0.5 45.5 19 L37.5 19 C36 8.5 12 8.5 10.5 19 Z" fill={ROJO} />
      {cerdas.map((c, k) => (
        <line key={k} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke="#8f1426" strokeWidth="0.9" strokeLinecap="round" />
      ))}
      {/* casco */}
      <path d="M24 11.5 C31.5 11.5 36.6 16 37 23 L37.4 33 C37.4 38.5 34.2 42.6 29.6 45.4 L26.4 46.6 L21.6 46.6 L18.4 45.4 C13.8 42.6 10.6 38.5 10.6 33 L11 23 C11.4 16 16.5 11.5 24 11.5 Z" fill={TIZA} />
      <path d="M12.2 21.6 Q24 17.4 35.8 21.6" fill="none" stroke={GOMA} strokeOpacity=".35" strokeWidth="1" />
      {/* ojos, protector de nariz y la abertura de la boca */}
      <path d="M13.4 26.4 C16.8 24.4 20.4 24.6 22.6 26 L22.6 29.4 C19.6 28.4 16.4 28.8 13.6 30.4 Z" fill={GOMA} />
      <path d="M34.6 26.4 C31.2 24.4 27.6 24.6 25.4 26 L25.4 29.4 C28.4 28.4 31.6 28.8 34.4 30.4 Z" fill={GOMA} />
      <path d="M22.4 34.5 Q24 33.2 25.6 34.5 L26.6 46.8 L21.4 46.8 Z" fill={GOMA} />
      <path d="M15 33 Q17.5 39.5 20.6 42.8 M33 33 Q30.5 39.5 27.4 42.8" fill="none" stroke={GOMA} strokeOpacity=".3" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

function Marca() {
  return (
    <span className="flex items-center gap-2.5">
      <Logo />
      <span className="leading-none">
        <span className="gym-titulo block text-[1.55rem]">Spartan Force</span>
        <span className="block text-[0.72rem] font-bold tracking-[0.3em] opacity-60">GYM</span>
      </span>
    </span>
  );
}

type Vista = "pagina" | "socio" | "recepcion";

export default function GimnasioDemo() {
  const gym = useGimnasio();
  const leer = (): Vista => (location.hash === "#socio" ? "socio" : location.hash === "#recepcion" ? "recepcion" : "pagina");
  const [vista, setVista] = useState<Vista>(leer);
  const [socio, setSocio] = useState(104);
  useEffect(() => {
    const cambio = () => setVista(leer());
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", vista === "pagina" ? location.pathname : `#${vista}`);
    document.title = vista === "recepcion" ? "Panel · Spartan Force" : vista === "socio" ? "Mi membresía · Spartan Force" : "Spartan Force Gym · Demo de Jzet Labs";
    window.scrollTo(0, 0);
  }, [vista]);

  return (
    <div className="gym min-h-screen" style={{ background: GOMA, color: TIZA }}>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <PartesDemo fondo={"#0d0e0f"} actual={vista} alCambiar={setVista} partes={[{ id: "pagina", nombre: "Página", quien: "Cuánta gente hay, planes y clases" }, { id: "socio", nombre: "App del socio", quien: "Su carnet, sus días y su rutina" }, { id: "recepcion", nombre: "Panel de Spartan Force", quien: "Socios, acceso, clases y pagos" }] as const} />
      {vista === "pagina" && <Pagina gym={gym} alInscribir={(n) => { setSocio(n); setVista("socio"); }} />}
      {vista === "socio" && <MiMembresia gym={gym} num={socio} setNum={setSocio} />}
      {vista === "recepcion" && <PanelGimnasio gym={gym} />}
      <CierreJzet demo="gimnasio" />
    </div>
  );
}

/* ---------------- la página ---------------- */

function Pagina({ gym, alInscribir }: { gym: Gym; alInscribir: (n: number) => void }) {
  const [sede, setSede] = useState("mixco");
  const [plan, setPlan] = useState<string | null>(null);
  const [estudiante, setEstudiante] = useState(false);
  const [dia, setDia] = useState(() => new Date().getDay());
  const [msg, setMsg] = useState<string | null>(null);
  const hReal = horaAhora();
  const abierto = hReal >= 4 && hReal < 22;
  // fuera de horario se muestra la hora pico, para que la demo siempre se entienda
  const h = abierto ? hReal : 18;
  const s = porId(SEDES, sede);
  const ahora = aforo(sede, h);
  const nv = nivel(ahora, s.capacidad);
  const hoy = new Date().getDay();
  const piz = PIZARRA[hoy];
  const precio = (p: (typeof PLANES)[number]) => (estudiante && (p.id === "mensual" || p.id === "trimestral") ? Math.round((p.precio * 0.8) / 5) * 5 : p.precio);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur" style={{ background: "rgba(22,24,26,.92)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#inicio" aria-label="Spartan Force Gym">
            <Marca />
          </a>
          <nav className="hidden gap-7 font-semibold text-white/80 md:flex">
            <a href="#planes" className="hover:text-white">Planes</a>
            <a href="#clases" className="hover:text-white">Clases</a>
            <a href="#sedes" className="hover:text-white">Sedes</a>
            <a href="#avances" className="hover:text-white">Avances</a>
          </nav>
          <a href="#planes" className={`${btn} !px-4 !py-2.5`} style={{ background: AMARILLO, color: GOMA }}>
            Inscribirme
          </a>
        </div>
      </header>

      {/* portada: cuánta gente hay ahora */}
      <section id="inicio" className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <div className="gym-hero">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[0.92rem] font-bold" style={{ background: GOMA2 }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: abierto ? VERDE : ROJO }} /> {abierto ? "Abierto ahora" : "Cerrado, abrimos a las 4:30"} · Mixco y Villa Nueva
            </p>
            <h1 className="gym-titulo mt-5 text-[3.6rem] sm:text-[5.2rem]">Mira cuánta gente hay antes de venir.</h1>
            <p className="mt-5 max-w-lg text-[1.1rem] leading-relaxed text-white/75">
              Planes desde {qz(25)} el día, abierto desde las 4:30 de la mañana y te inscribes desde el teléfono. Sin filas en recepción.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#planes" className={btn} style={{ background: AMARILLO, color: GOMA }}>
                Ver planes y precios <ArrowRight size={18} />
              </a>
              <button type="button" onClick={() => setMsg("Hola, Spartan Force. Quiero mi pase de un día gratis para conocer el gym. ¿Puedo ir mañana a las 6:00 a la sede de Mixco?")} className={`${btn} border-2 border-white/25`}>
                Pase de un día gratis
              </button>
            </div>
          </div>
          <div className="relative">
            <img src={FOTOS.portada} alt="Mujer levantando una barra en el rack" className="h-[420px] w-full rounded-xl object-cover sm:h-[480px]" />
            <div className="absolute inset-x-3 bottom-3 rounded-xl p-4 sm:inset-x-auto sm:left-4 sm:w-[300px]" style={{ background: "rgba(22,24,26,.94)" }}>
              <div className="flex gap-1 rounded-md bg-white/10 p-0.5 text-[0.85rem]">
                {SEDES.map((x) => (
                  <button key={x.id} type="button" onClick={() => setSede(x.id)} className={`flex-1 rounded px-2 py-1 font-semibold ${sede === x.id ? "bg-white text-black" : "text-white/75"}`}>
                    {x.nombre}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-end justify-between">
                <p>
                  <span className="gym-titulo text-[3rem]">{ahora}</span>
                  <span className="ml-1.5 text-white/70">{abierto ? "personas ahora" : "personas a las 18:00"}</span>
                </p>
                <span className="rounded px-2 py-1 text-[0.85rem] font-bold" style={{ background: nv.c, color: nv.c === AMARILLO ? GOMA : "#fff" }}>{nv.t}</span>
              </div>
              <div className="mt-3 flex h-14 items-end gap-[3px]" aria-label="Gente por hora hoy">
                {AFORO_BASE.map((_, i) => {
                  const n = aforo(sede, i + 4);
                  const esta = i + 4 === h;
                  return <span key={i} className="flex-1 rounded-sm" title={`${i + 4}:00, ${n} personas`} style={{ height: `${Math.max(8, (n / s.capacidad) * 100)}%`, background: esta ? AMARILLO : "rgba(255,255,255,.22)" }} />;
                })}
              </div>
              <div className="mt-1 flex justify-between text-[0.72rem] text-white/50">
                <span>4:00</span>
                <span>13:00</span>
                <span>21:00</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="moleteado" aria-hidden />

      {/* planes como discos */}
      <section id="planes" className="scroll-mt-20" style={{ background: GOMA2 }}>
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="gym-titulo text-[3rem] sm:text-[4rem]">Planes</h2>
              <p className="mt-1 text-white/70">Inscripción {qz(INSCRIPCION)}. En noviembre, gratis con el trimestral o el anual.</p>
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-md border border-white/20 px-4 py-2.5 font-semibold">
              <input type="checkbox" checked={estudiante} onChange={(e) => setEstudiante(e.target.checked)} className="h-5 w-5" style={{ accentColor: AMARILLO }} />
              Soy estudiante (20% menos)
            </label>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLANES.map((p) => (
              <article key={p.id} className="relative flex flex-col rounded-xl p-5" style={{ background: GOMA, boxShadow: p.marca ? `inset 0 0 0 2px ${p.color}` : "inset 0 0 0 1px rgba(255,255,255,.1)" }}>
                {p.marca && <span className="absolute -top-3 left-5 rounded px-2 py-0.5 text-[0.8rem] font-bold" style={{ background: p.color, color: p.texto }}>{p.marca}</span>}
                <div className="flex items-center gap-4">
                  <span className="disco h-24 w-24 shrink-0" style={{ background: p.color }}>
                    <span className="absolute top-2 text-[0.62rem] font-bold" style={{ color: p.texto, opacity: 0.8 }}>{p.kg} KG</span>
                  </span>
                  <div>
                    <h3 className="gym-titulo text-[2rem]">{p.nombre}</h3>
                    <p className="text-[1.6rem] font-bold leading-none">
                      {qz(precio(p))}
                      {precio(p) !== p.precio && <s className="ml-2 text-[1rem] font-normal text-white/45">{qz(p.precio)}</s>}
                    </p>
                  </div>
                </div>
                <ul className="mt-5 grid flex-1 content-start gap-2 text-[0.98rem] text-white/80">
                  {p.incluye.map((x) => (
                    <li key={x} className="flex gap-2">
                      <Check size={18} className="mt-0.5 shrink-0" style={{ color: p.color }} /> {x}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => setPlan(p.id)} className={`${btn} mt-5 w-full`} style={{ background: p.color, color: p.texto }}>
                  {p.id === "dia" ? "Comprar pase" : "Inscribirme"}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* clases con cupo */}
      <section id="clases" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14 md:py-16">
        <h2 className="gym-titulo text-[3rem] sm:text-[4rem]">Clases con cupo</h2>
        <p className="mt-1 text-white/70">Aparta tu bici o tu lugar desde aquí. Ya no llegas a que no haya espacio.</p>
        <div className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          {[1, 2, 3, 4, 5, 6, 0].map((d) => (
            <button key={d} type="button" onClick={() => setDia(d)} className="shrink-0 rounded-md px-4 py-2 font-bold" style={dia === d ? { background: TIZA, color: GOMA } : { background: GOMA2 }}>
              {d === hoy ? "Hoy" : DIAS[d]}
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {CLASES.filter((c) => c.dia === dia).map((c) => {
            const mia = !!gym.reservas[c.id];
            const van = c.van + (mia ? 1 : 0);
            const lleno = van >= c.cupo && !mia;
            return (
              <div key={c.id} className="flex items-center gap-4 rounded-xl p-3" style={{ background: GOMA2 }}>
                <img src={c.foto} alt="" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-[0.9rem] font-bold" style={{ color: AMARILLO }}>{c.hora}</p>
                  <p className="text-[1.15rem] font-bold leading-tight">{c.nombre}</p>
                  <p className="text-[0.88rem] text-white/60">con {c.coach}</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full" style={{ width: `${Math.min(100, (van / c.cupo) * 100)}%`, background: van >= c.cupo ? ROJO : van / c.cupo > 0.75 ? AMARILLO : VERDE }} />
                  </div>
                  <p className="mt-1 text-[0.8rem] text-white/55">{lleno ? "Lleno" : `Quedan ${c.cupo - van} de ${c.cupo}`}</p>
                </div>
                <button type="button" disabled={lleno} onClick={() => gym.reservar(c.id)} className="shrink-0 rounded-md px-3.5 py-2 text-[0.92rem] font-bold disabled:opacity-35" style={mia ? { background: VERDE, color: "#fff" } : { background: TIZA, color: GOMA }}>
                  {mia ? "Apartado" : lleno ? "Lleno" : "Apartar"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* pizarra y coaches */}
      <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-14 md:grid-cols-[1fr_1.15fr] md:pb-16">
        <div className="pizarra rounded-lg p-8 text-white">
          <p className="text-white/60">La pizarra de hoy, {DIAS[hoy].toLowerCase()}</p>
          <p className="mt-2 text-[2.6rem] leading-none" style={{ fontFamily: "Caveat, cursive" }}>{piz.titulo}</p>
          <ul className="mt-4 grid gap-1.5 text-[1.5rem] leading-tight text-white/90" style={{ fontFamily: "Caveat, cursive" }}>
            {piz.lista.map((x) => (
              <li key={x}>– {x}</li>
            ))}
          </ul>
          <p className="mt-5 text-[0.9rem] text-white/55">Los socios la ven también en su app, con los pesos que llevan.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {COACHES.map((c) => (
            <figure key={c.nombre} className="overflow-hidden rounded-xl" style={{ background: GOMA2 }}>
              <img src={c.foto} alt={`Coach ${c.nombre}`} loading="lazy" className="h-56 w-full object-cover" />
              <figcaption className="p-3">
                <b className="block leading-tight">{c.nombre}</b>
                <span className="block text-[0.9rem] text-white/65">{c.que}</span>
                <span className="block text-[0.8rem] text-white/45">{c.desde}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* avances */}
      <section id="avances" className="scroll-mt-20" style={{ background: AMARILLO, color: GOMA }}>
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
          <h2 className="gym-titulo text-[3rem] sm:text-[4rem]">Los de aquí</h2>
          <p className="mt-1 font-semibold opacity-75">Socios que entrenan con nosotros, en sus palabras.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AVANCES.map((a) => (
              <figure key={a.quien} className="overflow-hidden rounded-xl bg-white">
                <img src={a.foto} alt={a.quien} loading="lazy" className="h-60 w-full object-cover" />
                <div className="p-4">
                  <blockquote className="text-[0.98rem] leading-relaxed">“{a.d}”</blockquote>
                  <figcaption className="mt-2 text-[0.9rem] font-bold">{a.quien}</figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* sedes con parqueo */}
      <section id="sedes" className="scroll-mt-20" style={{ background: ACERO, color: GOMA }}>
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
          <h2 className="gym-titulo text-[3rem] sm:text-[4rem]">Dónde estamos</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {SEDES.map((x) => (
              <article key={x.id} className="overflow-hidden rounded-xl bg-white">
                <img src={x.foto} alt={`Sede ${x.nombre}`} loading="lazy" className="h-48 w-full object-cover" />
                <div className="grid gap-2.5 p-5">
                  <h3 className="gym-titulo text-[2.2rem]">{x.nombre}</h3>
                  <p className="flex gap-2"><MapPin size={20} className="mt-0.5 shrink-0" style={{ color: ROJO }} /> {x.dir}</p>
                  <p className="flex gap-2 font-semibold"><Car size={20} className="mt-0.5 shrink-0" style={{ color: AZUL }} /> {x.parqueo}</p>
                  <p className="flex gap-2"><Users size={20} className="mt-0.5 shrink-0" style={{ color: VERDE }} /> {abierto ? `Ahora hay ${aforo(x.id, h)} personas` : `Capacidad para ${x.capacidad} personas`}</p>
                </div>
              </article>
            ))}
          </div>
          <dl className="mt-6 grid gap-2 rounded-xl bg-white p-5 sm:grid-cols-3">
            {HORARIO.map(([d, hh]) => (
              <div key={d} className="flex items-center gap-2">
                <Clock size={18} className="shrink-0 opacity-60" />
                <dt className="font-semibold">{d}</dt>
                <dd className="opacity-75">{hh}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* preguntas */}
      <section className="mx-auto max-w-6xl px-5 py-14 md:py-16">
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="gym-titulo text-[3rem] sm:text-[4rem]">Lo que más nos preguntan</h2>
            <img src={FOTOS.comunidad} alt="Socios chocando las manos después de entrenar" loading="lazy" className="mt-6 hidden h-56 w-full rounded-xl object-cover md:block" />
          </div>
          <div className="grid content-start gap-2">
            {PREGUNTAS.map(([q, a]) => (
              <details key={q} className="group rounded-lg px-5 py-4" style={{ background: GOMA2 }}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[1.08rem] font-bold">
                  {q}
                  <span className="text-[1.5rem] leading-none transition group-open:rotate-45" style={{ color: AMARILLO }}>+</span>
                </summary>
                <p className="mt-2 leading-relaxed text-white/75">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Inscripcion gym={gym} plan={plan} alCerrar={() => setPlan(null)} estudiante={estudiante} alListo={alInscribir} />
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="gimnasio" que="cada mensaje" />
    </>
  );
}

/* ---------------- inscripción en línea ---------------- */

function Inscripcion({ gym, plan, alCerrar, estudiante, alListo }: { gym: Gym; plan: string | null; alCerrar: () => void; estudiante: boolean; alListo: (n: number) => void }) {
  const [sede, setSede] = useState("mixco");
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [inicio, setInicio] = useState(0);
  const [pago, setPago] = useState("tarjeta");
  const [num, setNum] = useState<number | null>(null);
  useEffect(() => {
    if (plan) setNum(null);
  }, [plan]);
  if (!plan) return <Cajon abierto={false} alCerrar={alCerrar}>{null}</Cajon>;
  const p = porId(PLANES, plan);
  const precio = estudiante && (p.id === "mensual" || p.id === "trimestral") ? Math.round((p.precio * 0.8) / 5) * 5 : p.precio;
  const insc = p.id === "dia" || p.id === "trimestral" || p.id === "anual" ? 0 : INSCRIPCION;
  const total = precio + insc;
  const valido = nombre.trim().length > 2 && tel.replace(/\D/g, "").length === 8;
  const campo = "w-full rounded-md border-2 border-black/15 bg-white px-4 py-3 text-[1.02rem] outline-none focus:border-black/60";
  const chip = (on: boolean) => (on ? { background: GOMA, color: "#fff", borderColor: GOMA } : { borderColor: "rgba(0,0,0,.15)", background: "#fff" });
  const vence = enDias(inicio + p.dias);

  return (
    <Cajon abierto alCerrar={alCerrar} fondo="#f1f3f4">
      <div className="h-full overflow-y-auto" style={{ color: GOMA }}>
        <div className="flex items-center justify-between gap-3 p-5" style={{ background: p.color, color: p.texto }}>
          <div>
            <p className="font-semibold opacity-80">Plan</p>
            <p className="gym-titulo text-[2.6rem]">{p.nombre}</p>
          </div>
          <button type="button" onClick={alCerrar} aria-label="Cerrar" className="grid h-10 w-10 place-items-center rounded-full bg-black/15">
            <X size={20} />
          </button>
        </div>
        {num ? (
          <div className="p-6">
            <Carnet socio={gym.socios.find((x) => x.num === num)!} />
            <h3 className="mt-6 text-[1.6rem] font-bold leading-tight">¡Bienvenido a Spartan Force, {nombre.trim().split(" ")[0]}!</h3>
            <p className="mt-2 opacity-75">Muestra este carnet en recepción. Tu plan vence el {fechaCorta(vence)} y te avisamos por WhatsApp 3 días antes.</p>
            <button type="button" onClick={() => { alCerrar(); alListo(num); }} className={`${btn} mt-6 w-full text-white`} style={{ background: GOMA }}>
              Ver mi membresía <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="grid gap-6 p-6 pb-32">
            <div>
              <p className="font-bold">¿En qué sede?</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {SEDES.map((x) => (
                  <button key={x.id} type="button" onClick={() => setSede(x.id)} className="rounded-md border-2 px-3 py-2.5 text-left font-semibold" style={chip(sede === x.id)}>
                    {x.nombre}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-bold">¿Cuándo empiezas?</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  [0, "Hoy"],
                  [1, "Mañana"],
                  [(8 - new Date().getDay()) % 7 || 7, "El lunes"],
                ].map(([n, t]) => (
                  <button key={t} type="button" onClick={() => setInicio(n as number)} className="rounded-md border-2 px-3 py-2.5 font-semibold" style={chip(inicio === n)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <p className="font-bold">Tus datos</p>
              <input aria-label="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo" autoComplete="name" className={campo} />
              <input aria-label="WhatsApp" value={tel} onChange={(e) => setTel(e.target.value.replace(/[^\d ]/g, "").slice(0, 9))} placeholder="WhatsApp (8 dígitos)" inputMode="numeric" autoComplete="tel" className={campo} />
            </div>
            <div>
              <p className="font-bold">¿Cómo pagas?</p>
              <div className="mt-2 grid gap-2">
                {[
                  ["tarjeta", "Con tarjeta, aquí mismo", "Visa o Mastercard"],
                  ["recepcion", "En recepción", "Efectivo o tarjeta al llegar"],
                ].map(([id, t, n]) => (
                  <button key={id} type="button" onClick={() => setPago(id)} className="rounded-md border-2 px-4 py-2.5 text-left" style={chip(pago === id)}>
                    <b className="block">{t}</b>
                    <span className="text-[0.88rem] opacity-70">{n}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {!num && (
          <div className="sticky bottom-0 border-t border-black/10 bg-white p-4">
            <div className="flex justify-between text-[0.95rem]">
              <span className="opacity-70">{p.nombre}{insc ? ` + inscripción ${qz(insc)}` : p.id === "dia" ? "" : " · inscripción gratis"}</span>
              <b className="text-[1.3rem]">{qz(total)}</b>
            </div>
            <button
              type="button"
              disabled={!valido}
              onClick={() => setNum(gym.inscribir({ nombre: nombre.trim(), plan: p.id, vence, tel: tel.replace(/\D/g, ""), sede }, total))}
              className={`${btn} mt-2 w-full disabled:opacity-40`}
              style={{ background: AMARILLO, color: GOMA }}
            >
              {valido ? (pago === "tarjeta" ? `Pagar ${qz(total)}` : "Apartar mi inscripción") : "Pon tu nombre y WhatsApp"}
            </button>
          </div>
        )}
      </div>
    </Cajon>
  );
}

/* ---------------- carnet con código ---------------- */

function Codigo({ n, size = 112 }: { n: number; size?: number }) {
  // un código que parece QR, sale siempre igual para el mismo número de socio
  const celdas = useMemo(() => {
    const out: [number, number][] = [];
    let x = n * 9301 + 49297;
    for (let i = 0; i < 21; i++)
      for (let j = 0; j < 21; j++) {
        const esquina = (i < 8 && j < 8) || (i < 8 && j > 12) || (i > 12 && j < 8);
        if (esquina) continue;
        x = (x * 9301 + 49297) % 233280;
        if (x / 233280 > 0.52) out.push([i, j]);
      }
    return out;
  }, [n]);
  const ojo = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill="#000" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="#000" />
    </g>
  );
  return (
    <svg viewBox="-1 -1 23 23" width={size} height={size} className="rounded bg-white" role="img" aria-label={`Código del socio ${n}`}>
      {celdas.map(([i, j]) => (
        <rect key={`${i}-${j}`} x={j} y={i} width="1" height="1" fill="#000" />
      ))}
      {ojo(0, 0)}
      {ojo(14, 0)}
      {ojo(0, 14)}
    </svg>
  );
}

function Carnet({ socio }: { socio: Socio }) {
  const p = porId(PLANES, socio.plan);
  const f = faltan(socio.vence);
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${GOMA2}, ${GOMA})` }}>
      <span className="disco h-40 w-40 opacity-90" style={{ background: p.color, position: "absolute", right: "-2.5rem", top: "-2.5rem" }} aria-hidden />
      <span className="relative block"><Marca /></span>
      <div className="relative mt-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[0.85rem] text-white/60">Socio {socio.num}</p>
          <p className="truncate text-[1.35rem] font-bold leading-tight">{socio.nombre}</p>
          <p className="mt-1 text-[0.92rem] text-white/75">
            {p.nombre} · {porId(SEDES, socio.sede).nombre}
          </p>
          <p className="mt-2 inline-block rounded px-2 py-0.5 text-[0.85rem] font-bold" style={{ background: f < 0 ? ROJO : f <= 3 ? AMARILLO : VERDE, color: f >= 0 && f <= 3 ? GOMA : "#fff" }}>
            {f < 0 ? `Venció hace ${-f} ${-f === 1 ? "día" : "días"}` : f === 0 ? "Vence hoy" : `Vence el ${fechaCorta(socio.vence)}`}
          </p>
        </div>
        <Codigo n={socio.num} size={96} />
      </div>
    </div>
  );
}

/* ---------------- la app del socio ---------------- */

function MiMembresia({ gym, num, setNum }: { gym: Gym; num: number; setNum: (n: number) => void }) {
  const socio = gym.socios.find((x) => x.num === num) ?? gym.socios[0];
  const p = porId(PLANES, socio.plan);
  const f = faltan(socio.vence);
  const hoy = new Date();
  const diasMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
  const primero = new Date(hoy.getFullYear(), hoy.getMonth(), 1).getDay();
  const mias = CLASES.filter((c) => gym.reservas[c.id]);
  const piz = PIZARRA[hoy.getDay()];
  const total = p.dias;
  const pct = Math.max(0, Math.min(1, f / total));

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16 pt-8">
      <label className="flex flex-wrap items-center gap-2 text-[0.92rem] text-white/65">
        Ver como:
        <select value={socio.num} onChange={(e) => setNum(Number(e.target.value))} className="rounded-md border border-white/20 bg-transparent px-3 py-1.5 text-white">
          {gym.socios.map((s) => (
            <option key={s.num} value={s.num} className="text-black">
              {s.nombre} ({porId(PLANES, s.plan).nombre.toLowerCase()})
            </option>
          ))}
        </select>
      </label>
      <h1 className="gym-titulo mt-4 text-[3rem] sm:text-[4rem]">Hola, {socio.nombre.split(" ")[0]}</h1>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <Carnet socio={socio} />
          <div className="mt-4 flex items-center gap-4 rounded-xl p-4" style={{ background: GOMA2 }}>
            <svg viewBox="0 0 44 44" width="76" height="76" className="shrink-0 -rotate-90">
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="5" />
              <circle cx="22" cy="22" r="18" fill="none" stroke={f < 0 ? ROJO : f <= 3 ? AMARILLO : VERDE} strokeWidth="5" strokeDasharray={`${pct * 113} 113`} strokeLinecap="round" />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-[1.6rem] font-bold leading-none">{f < 0 ? "Vencida" : `${f} ${f === 1 ? "día" : "días"}`}</p>
              <p className="text-[0.92rem] text-white/60">{f < 0 ? "Renuévala para seguir entrando" : "le quedan a tu plan"}</p>
            </div>
            <button type="button" onClick={() => gym.cobrar(socio.num)} className="shrink-0 rounded-md px-4 py-2.5 font-bold" style={{ background: AMARILLO, color: GOMA }}>
              Renovar {qz(p.precio)}
            </button>
          </div>
        </div>
        <div className="rounded-xl p-5" style={{ background: GOMA2 }}>
          <div className="flex items-baseline justify-between">
            <h2 className="text-[1.3rem] font-bold">Tus entrenos este mes</h2>
            <span className="gym-titulo text-[2.2rem]" style={{ color: AMARILLO }}>{socio.visitas.length}</span>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1.5 text-center text-[0.72rem] text-white/45">
            {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
            {Array.from({ length: primero }, (_, i) => (
              <span key={`v${i}`} />
            ))}
            {Array.from({ length: diasMes }, (_, i) => {
              const d = i + 1;
              const fue = socio.visitas.includes(d);
              const futuro = d > hoy.getDate();
              return (
                <span key={d} className="grid aspect-square place-items-center rounded-md text-[0.82rem] font-semibold" style={{ background: fue ? VERDE : futuro ? "transparent" : "rgba(255,255,255,.06)", color: fue ? "#fff" : futuro ? "rgba(255,255,255,.25)" : "rgba(255,255,255,.55)", outline: d === hoy.getDate() ? `2px solid ${AMARILLO}` : undefined }}>
                  {d}
                </span>
              );
            })}
          </div>
          <p className="mt-3 text-[0.9rem] text-white/60">Cada vez que pasas tu carnet en recepción se marca aquí.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="pizarra rounded-lg p-6 text-white">
          <p className="text-white/60">Tu rutina de hoy</p>
          <p className="mt-1 text-[2.2rem] leading-none" style={{ fontFamily: "Caveat, cursive" }}>{piz.titulo}</p>
          <ul className="mt-3 grid gap-1 text-[1.35rem]" style={{ fontFamily: "Caveat, cursive" }}>
            {piz.lista.map((x) => (
              <li key={x}>– {x}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl p-5" style={{ background: GOMA2 }}>
          <h2 className="text-[1.3rem] font-bold">Tus clases apartadas</h2>
          {mias.length === 0 ? (
            <p className="mt-2 text-white/60">Todavía no apartas ninguna. Ve a la página y aparta tu lugar en spinning o funcional.</p>
          ) : (
            <ul className="mt-3 grid gap-2">
              {mias.map((c) => (
                <li key={c.id} className="flex items-center gap-3">
                  <img src={c.foto} alt="" className="h-12 w-12 rounded-md object-cover" />
                  <span className="flex-1">
                    <b className="block">{c.nombre}</b>
                    <span className="text-[0.88rem] text-white/60">{DIAS[c.dia]} {c.hora} · {c.coach}</span>
                  </span>
                  <button type="button" onClick={() => gym.reservar(c.id)} className="text-[0.88rem] text-white/60 underline">
                    Soltar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- recepción ---------------- */
