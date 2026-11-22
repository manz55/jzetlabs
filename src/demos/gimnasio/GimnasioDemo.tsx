/*
 * Demo: "Spartan Force Gym" (negocio inventado, datos de ejemplo, fotos de Unsplash).
 * Tres partes: la página que ve la gente (cuánta gente hay, planes, clases, sedes con parqueo),
 * la membresía del socio (carnet, días que le quedan, asistencias) y recepción (quién entró y a quién cobrarle).
 */
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Car, Check, Clock, Dumbbell, MapPin, Navigation, Users, X } from "lucide-react";
import PanelGimnasio from "./PanelGimnasio";
import { Rev, Ventana } from "../perfil/Ventana";
import { BandaDemos, PartesDemo, Cajon, CierreJzet, MensajeWhatsApp } from "../comun";
import {
  ACERO, AFORO_BASE, AMARILLO, AVANCES, AZUL, CLASES, COACHES, DIAS, FOTOS, GOMA, GOMA2, HORARIO, INSCRIPCION, PIZARRA, PLANES, PREGUNTAS, ROJO, SEDES, TITULO, TIZA, VERDE,
  aforo, enDias, faltan, fechaCorta, horaAhora, nivel, porId, qz, useGimnasio,
  type Clase, type Gym, type Socio,
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
.gym-hero { display: grid; gap: clamp(1.5rem,3vw,3rem); }
@media (min-width: 960px) { .gym-hero { grid-template-columns: minmax(0,1.05fr) minmax(0,1fr); align-items: center; } }
.gy-cont { width: min(100% - 2 * clamp(1rem, 4vw, 5rem), 140rem); margin-inline: auto; }
.gy-sec { padding-block: clamp(3rem, 6vw, 7rem); }
.gy-h1 { font-size: clamp(3.6rem, 1.4rem + 6.2vw, 9rem); }
.gy-h2 { font-size: clamp(2.8rem, 1.4rem + 3.6vw, 5.6rem); }
.gy-eyebrow { display: flex; align-items: center; gap: .75rem; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; font-size: .95rem; }
.gy-eyebrow::after { content: ""; height: 3px; flex: 1; background: currentColor; opacity: .3; }
.gy-auto { display: grid; gap: clamp(.75rem,1.6vw,1.75rem); grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--min, 16rem)), 1fr)); }
.gy-fill { display: grid; gap: clamp(.75rem,1.6vw,1.75rem); grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--min, 16rem)), 1fr)); }
.gy-card { position: relative; overflow: hidden; transition: transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .4s; }
.gy-card::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(115deg, transparent 40%, rgba(242,194,48,.28) 50%, transparent 60%); transform: translateX(-130%); transition: transform .8s ease; }
.gy-card:hover, .gy-card:focus-within { transform: translateY(-7px); box-shadow: 0 20px 40px -14px rgba(242,194,48,.55), 0 0 0 3px #f2c230; }
.gy-card:hover::after { transform: translateX(130%); }
.gy-card .gy-img { transition: transform .8s cubic-bezier(.2,.8,.2,1); }
.gy-card:hover .gy-img { transform: scale(1.1); }
.gy-card .gy-disco { transition: transform 1s cubic-bezier(.2,.8,.2,1); }
.gy-card:hover .gy-disco { transform: rotate(180deg); }
.gy-btn { transition: transform .2s, box-shadow .2s, filter .2s; }
.gy-btn:hover { transform: translateY(-2px); filter: brightness(1.08); box-shadow: 0 0 0 3px rgba(242,194,48,.6); }
.gy-btn:active { transform: scale(.97); }
.gy-flip { perspective: 1600px; }
.gy-flip-in { position: relative; height: 100%; transition: transform .9s cubic-bezier(.2,.8,.2,1); transform-style: preserve-3d; }
.gy-flip[data-vuelta="1"] .gy-flip-in { transform: rotateY(180deg); }
.gy-face { position: absolute; inset: 0; width: 100%; height: 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.gy-back { transform: rotateY(180deg); }
.pf-zoom { animation: pfzoom 1s cubic-bezier(.2,.8,.2,1) both; }
@keyframes pfzoom { from { transform: scale(1.15); opacity: .4; } to { transform: scale(1); opacity: 1; } }
@media (hover: none) { .gy-card:hover { transform: none; box-shadow: none; } .gy-card:hover .gy-img, .gy-card:hover .gy-disco { transform: none; } }
@media (prefers-reduced-motion: reduce) { .gy-card, .gy-card::after, .gy-card .gy-img, .gy-card .gy-disco, .gy-btn { transition: none; } .pf-zoom { animation: none; } }
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

const INFO_CLASE: Record<string, { nivel: string; dura: string; trae: string[]; que: string; intensidad: number }> = {
  Spinning: { nivel: "Todos los niveles", dura: "45 min", trae: ["Toalla", "Agua", "Tenis o zapatos de spinning"], que: "Bici con música y ritmo. Subes, bajas y sudas sin lesionarte.", intensidad: 4 },
  Funcional: { nivel: "Todos los niveles", dura: "50 min", trae: ["Toalla", "Agua", "Tenis"], que: "Circuitos con peso corporal, kettlebell y cuerdas. Cada ronda se adapta a tu nivel.", intensidad: 5 },
  "Glúteo y pierna": { nivel: "Intermedio", dura: "55 min", trae: ["Toalla", "Agua", "Ligas si tienes"], que: "Hip thrust, sentadillas y trabajo con barra guiado por la coach.", intensidad: 4 },
  "Tren superior": { nivel: "Intermedio", dura: "55 min", trae: ["Toalla", "Agua"], que: "Espalda, hombro y brazo con mancuernas y poleas.", intensidad: 4 },
  Zumba: { nivel: "Todos los niveles", dura: "50 min", trae: ["Toalla", "Agua", "Ropa cómoda"], que: "Baile y cardio al ritmo de la música. Cero complicaciones.", intensidad: 3 },
  "Funcional en parejas": { nivel: "Todos los niveles", dura: "50 min", trae: ["Toalla", "Agua", "A tu pareja o amigo"], que: "Rondas en parejas: uno trabaja y el otro anima.", intensidad: 4 },
  "Movilidad y estiramiento": { nivel: "Principiante", dura: "40 min", trae: ["Toalla", "Ropa cómoda"], que: "Estiramiento y movilidad de cadera, espalda y hombro.", intensidad: 1 },
};
const INFO_COACH: Record<string, { alias: string; frase: string; certs: string[]; fotos: { f: string; p: string }[] }> = {
  "Ricardo Méndez": { alias: "Ricardo", frase: "Primero la técnica, después el peso.", certs: ["Entrenador de fuerza certificado", "Funcional y kettlebell", "Primeros auxilios"], fotos: [{ f: FOTOS.coach, p: "Ricardo corrigiendo la postura de una socia" }, { f: FOTOS.funcional, p: "En su clase de funcional" }, { f: FOTOS.spinning, p: "Dirigiendo spinning" }, { f: FOTOS.mancuernas, p: "En la sala de pesas" }] },
  "María José Pérez": { alias: "Majo", frase: "Todos pueden empezar. Yo te acompaño.", certs: ["Entrenadora personal certificada", "Especialista en glúteo y pierna", "Instructora de spinning"], fotos: [{ f: FOTOS.coach2, p: "Majo guiando un ejercicio de suelo" }, { f: FOTOS.sentadilla, p: "Clase de glúteo y pierna" }, { f: FOTOS.spinning, p: "Spinning de las 5:30" }, { f: FOTOS.funcional, p: "Entrenamiento funcional" }] },
};
const RESULTADOS = [
  { n: "-12 kg", t: "en 5 meses", d: "Llegué con miedo a los aparatos. Con la rutina de inicio y las clases de las 5:30 cambió mi energía y hasta mi ropa.", q: "Andrea, socia desde hace 8 meses", foto: AVANCES[0].foto },
  { n: "3 veces", t: "por semana", d: "Antes pagaba otro gimnasio y no iba. Aquí apartar la clase me obliga a llegar, y vengo con mi hermana.", q: "Wendy, socia desde hace 1 año", foto: AVANCES[1].foto },
  { n: "+20 kg", t: "en sentadilla", d: "En tres meses subí mi peso. El coach me corrige la técnica y no me he lesionado ni una vez.", q: "Kevin, socio desde hace 3 meses", foto: AVANCES[3].foto },
  { n: "5 meses", t: "sin faltar", d: "Ver cuánta gente hay antes de salir me ahorra tiempo. El gimnasio ya es parte de mi día.", q: "Paola, socia desde hace 5 meses", foto: AVANCES[2].foto },
];
const NAV = [["planes", "Planes"], ["clases", "Clases"], ["entrenadores", "Entrenadores"], ["socios", "Resultados"], ["sedes", "Sedes"], ["preguntas", "Preguntas"]];

function Seccion({ id, etiqueta, titulo, sub, fondo, color = TIZA, borde = AMARILLO, derecha, logo = false, children }: { id: string; etiqueta: string; titulo: string; sub?: string; fondo: string; color?: string; borde?: string; derecha?: ReactNode; logo?: boolean; children: ReactNode }) {
  return (
    <section id={id} className="gy-sec scroll-mt-32" style={{ background: fondo, color, borderTop: `8px solid ${borde}` }}>
      <div className="gy-cont">
        <p className="gy-eyebrow" style={{ color: borde === ACERO ? GOMA : borde }}>{etiqueta}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <h2 className="gym-titulo gy-h2 flex items-center gap-[0.25em]">{logo && <Logo tam={72} />}{titulo}</h2>
            {sub && <p className="mt-2 max-w-2xl text-[clamp(1.1rem,1rem+0.5vw,1.4rem)] opacity-75">{sub}</p>}
          </div>
          {derecha}
        </div>
        <div className="mt-[clamp(1.5rem,3vw,3rem)]">{children}</div>
      </div>
    </section>
  );
}

function Pagina({ gym, alInscribir }: { gym: Gym; alInscribir: (n: number) => void }) {
  const [sede, setSede] = useState("mixco");
  const [plan, setPlan] = useState<string | null>(null);
  const [estudiante, setEstudiante] = useState(false);
  const [dia, setDia] = useState(() => new Date().getDay());
  const [msg, setMsg] = useState<string | null>(null);
  const [clase, setClase] = useState<Clase | null>(null);
  const [coach, setCoach] = useState<(typeof COACHES)[number] | null>(null);
  const [fotoCoach, setFotoCoach] = useState(0);
  const [vueltas, setVueltas] = useState<Record<string, boolean>>({});
  const cerrarClase = useCallback(() => setClase(null), []);
  const cerrarCoach = useCallback(() => setCoach(null), []);
  const hReal = horaAhora();
  const abierto = hReal >= 4 && hReal < 22;
  // fuera de horario se muestra la hora pico, para que la demo siempre se entienda
  const h = abierto ? hReal : 18;
  const s = porId(SEDES, sede);
  const ahora = aforo(sede, h);
  const nv = nivel(ahora, s.capacidad);
  const hoy = new Date().getDay();
  const precio = (p: (typeof PLANES)[number]) => (estudiante && (p.id === "mensual" || p.id === "trimestral") ? Math.round((p.precio * 0.8) / 5) * 5 : p.precio);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur" style={{ background: "rgba(22,24,26,.94)" }}>
        <div className="gy-cont flex h-[4.25rem] items-center justify-between gap-4">
          <a href="#inicio" aria-label="Spartan Force Gym"><Marca /></a>
          <nav className="hidden gap-8 text-[1.1rem] font-semibold text-white/80 lg:flex" aria-label="Secciones">
            {NAV.map(([id, t]) => <a key={id} href={`#${id}`} className="hover:text-white">{t}</a>)}
          </nav>
          <a href="#planes" className={`${btn} gy-btn !px-5 !py-3`} style={{ background: AMARILLO, color: GOMA }}>Inscribirme</a>
        </div>
        <nav className="gy-cont flex gap-2 overflow-x-auto pb-2.5 lg:hidden [scrollbar-width:none]" aria-label="Secciones">
          {NAV.map(([id, t]) => <a key={id} href={`#${id}`} className="inline-flex min-h-[2.75rem] shrink-0 items-center rounded-md px-4 text-[1.05rem] font-bold" style={{ background: GOMA2 }}>{t}</a>)}
        </nav>
      </header>

      {/* portada: cuánta gente hay ahora */}
      <section id="inicio" className="gy-sec" style={{ paddingBlock: "clamp(1.5rem,4vw,5rem)" }}>
        <div className="gy-cont">
          <div className="gym-hero">
            <div>
              <h1 className="gym-titulo gy-h1">Mira cuánta gente hay antes de venir.</h1>
              <p className="mt-5 max-w-xl text-[clamp(1.2rem,1.05rem+0.6vw,1.6rem)] leading-snug text-white/80">Desde {qz(25)} el día. Abierto desde las 4:30 de la mañana. Te inscribes desde el teléfono.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#planes" className={`${btn} gy-btn !px-8 !py-4 text-[1.2rem]`} style={{ background: AMARILLO, color: GOMA }}>Ver planes y precios <ArrowRight size={20} /></a>
                <button type="button" onClick={() => setPlan("dia")} className={`${btn} gy-btn !px-8 !py-4 text-[1.2rem] border-2 border-white/30`}>Pagar pase del día</button>
              </div>
              <ul className="mt-9 grid gap-3 sm:grid-cols-3">
                {[[Clock, "4:30 am", "primera clase"], [MapPin, "2 sedes", "con parqueo"], [Dumbbell, "Desde Q25", "pase del día con QR"]].map(([I, a, b]) => { const Icono = I as typeof Clock; return (
                  <li key={a as string} className="flex items-center gap-3 rounded-lg p-3.5" style={{ background: GOMA2 }}><span className="grid h-12 w-12 shrink-0 place-items-center rounded-md" style={{ background: AMARILLO, color: GOMA }}><Icono size={24} /></span><span className="leading-tight"><b className="block text-[1.25rem]">{a as string}</b><span className="text-[1rem] text-white/65">{b as string}</span></span></li>
                ); })}
              </ul>
            </div>
            <div className="relative">
              <img src={FOTOS.portada} alt="Mujer levantando una barra en el rack" className="h-[clamp(26rem,52vw,46rem)] w-full rounded-xl object-cover" />
              <div className="absolute inset-x-3 bottom-3 rounded-xl p-5 sm:inset-x-auto sm:left-5 sm:bottom-5 sm:w-[min(24rem,calc(100%-2.5rem))]" style={{ background: "rgba(22,24,26,.95)" }}>
                <div className="flex gap-1 rounded-md bg-white/10 p-1 text-[1rem]">
                  {SEDES.map((x) => (
                    <button key={x.id} type="button" onClick={() => setSede(x.id)} className={`min-h-[2.75rem] flex-1 rounded px-2 font-bold ${sede === x.id ? "bg-white text-black" : "text-white/80"}`}>{x.nombre}</button>
                  ))}
                </div>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <p><span className="gym-titulo text-[clamp(3.4rem,3rem+1.4vw,4.6rem)]">{ahora}</span><span className="ml-2 text-[1.05rem] text-white/75">{abierto ? "personas aprox. ahora" : "personas aprox. a las 18:00"}</span></p>
                  <span className="rounded px-3 py-1.5 text-[1rem] font-bold" style={{ background: nv.c, color: nv.c === AMARILLO ? GOMA : "#fff" }}>{nv.t}</span>
                </div>
                <div className="mt-3 flex h-16 items-end gap-[3px]" aria-label="Gente por hora hoy">
                  {AFORO_BASE.map((_, i) => {
                    const n = aforo(sede, i + 4);
                    const esta = i + 4 === h;
                    return <span key={i} className="flex-1 rounded-sm" title={`${i + 4}:00, ${n} personas`} style={{ height: `${Math.max(8, (n / s.capacidad) * 100)}%`, background: esta ? AMARILLO : "rgba(255,255,255,.22)" }} />;
                  })}
                </div>
                <div className="mt-1 flex justify-between text-[0.9rem] text-white/60"><span>4:00</span><span>13:00</span><span>21:00</span></div>
                <p className="mt-2 text-[0.95rem] text-white/70">Capacidad aproximada: {s.capacidad} personas. Nunca se niega la entrada.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="moleteado" aria-hidden />

      {/* planes como discos */}
      <Seccion id="planes" etiqueta="Planes" titulo="Elige tu plan" sub={`Inscripción ${qz(INSCRIPCION)}. En noviembre, gratis con el trimestral o el anual.`} fondo={GOMA2} derecha={
        <label className="gy-btn flex min-h-[3.25rem] cursor-pointer items-center gap-3 rounded-md border-2 border-white/25 px-5 text-[1.1rem] font-bold">
          <input type="checkbox" checked={estudiante} onChange={(e) => setEstudiante(e.target.checked)} className="h-6 w-6" style={{ accentColor: AMARILLO }} /> Soy estudiante (20% menos)
        </label>}>
        <div className="gy-auto" style={{ ["--min" as string]: "17rem" }}>
          {PLANES.map((p, i) => (
            <Rev key={p.id} i={i} className="h-full">
              <article className="gy-card relative flex h-full flex-col rounded-xl p-6 pt-9" style={{ background: GOMA, boxShadow: p.marca ? `inset 0 0 0 3px ${p.color}` : "inset 0 0 0 1px rgba(255,255,255,.12)" }}>
                {p.marca && <span className="absolute left-5 top-0 rounded-b px-3 py-1 text-[0.95rem] font-bold" style={{ background: p.color, color: p.texto }}>{p.marca}</span>}
                <div className="flex items-center gap-4">
                  <span className="disco gy-disco h-28 w-28 shrink-0" style={{ background: p.color }}><span className="absolute top-2.5 text-[0.75rem] font-bold" style={{ color: p.texto, opacity: 0.85 }}>{p.kg} KG</span></span>
                  <div>
                    <h3 className="gym-titulo text-[clamp(2.2rem,2rem+0.8vw,2.8rem)]">{p.nombre}</h3>
                    <p className="text-[clamp(1.8rem,1.6rem+0.8vw,2.3rem)] font-bold leading-none">{qz(precio(p))}{precio(p) !== p.precio && <s className="ml-2 text-[1.1rem] font-normal text-white/50">{qz(p.precio)}</s>}</p>
                  </div>
                </div>
                <ul className="mt-6 grid flex-1 content-start gap-2.5 text-[1.1rem] text-white/85">
                  {p.incluye.map((x) => <li key={x} className="flex gap-2.5"><Check size={20} className="mt-0.5 shrink-0" style={{ color: p.color }} /> {x}</li>)}
                </ul>
                <button type="button" onClick={() => setPlan(p.id)} className={`${btn} gy-btn mt-6 w-full !py-4 text-[1.15rem]`} style={{ background: p.color, color: p.texto }}>{p.id === "dia" ? "Comprar pase" : "Inscribirme"}</button>
              </article>
            </Rev>
          ))}
        </div>
      </Seccion>

      {/* clases Spartan */}
      <Seccion id="clases" etiqueta="Clases" titulo="Clases Spartan" logo sub="Aparta tu lugar desde aquí. Toca una clase para ver de qué trata." fondo={GOMA} borde={ROJO}>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Día de la semana">
          {[1, 2, 3, 4, 5, 6, 0].map((d) => (
            <button key={d} type="button" aria-pressed={dia === d} onClick={() => setDia(d)} className="gy-btn min-h-[3.5rem] flex-1 rounded-md px-5 text-[1.2rem] font-bold" style={dia === d ? { background: TIZA, color: GOMA } : { background: GOMA2 }}>{d === hoy ? "Hoy" : DIAS[d]}</button>
          ))}
        </div>
        <div key={dia} className="gy-auto mt-6" style={{ ["--min" as string]: "27rem" }}>
          {CLASES.filter((c) => c.dia === dia).map((c, i) => {
            const mia = !!gym.reservas[c.id];
            const van = c.van + (mia ? 1 : 0);
            const lleno = van >= c.cupo && !mia;
            return (
              <Rev key={c.id} i={i} className="h-full">
                <div className="gy-card flex h-full flex-col overflow-hidden rounded-xl sm:flex-row" style={{ background: GOMA2 }}>
                  <button type="button" onClick={() => setClase(c)} aria-label={`Ver ${c.nombre}`} className="relative block h-48 shrink-0 overflow-hidden sm:h-auto sm:w-[38%]"><img src={c.foto} alt="" className="gy-img absolute inset-0 h-full w-full object-cover" /></button>
                  <div className="flex min-w-0 flex-1 flex-col p-5">
                    <button type="button" onClick={() => setClase(c)} className="text-left">
                      <span className="block text-[1.3rem] font-bold" style={{ color: AMARILLO }}>{c.hora}</span>
                      <span className="gym-titulo mt-1 block text-[clamp(2rem,1.7rem+0.8vw,2.6rem)]">{c.nombre}</span>
                      <span className="block text-[1.1rem] text-white/70">con {c.coach}</span>
                    </button>
                    <span className="mt-3 block h-2.5 overflow-hidden rounded-full bg-white/10"><span className="block h-full" style={{ width: `${Math.min(100, (van / c.cupo) * 100)}%`, background: van >= c.cupo ? ROJO : van / c.cupo > 0.75 ? AMARILLO : VERDE }} /></span>
                    <span className="mt-1.5 block text-[1.05rem] text-white/75">{lleno ? "Clase llena" : `Quedan ${c.cupo - van} de ${c.cupo} lugares`}</span>
                    <button type="button" disabled={lleno} onClick={() => gym.reservar(c.id)} className="gy-btn mt-auto min-h-[3.25rem] w-full rounded-md pt-0 text-[1.15rem] font-bold disabled:opacity-35" style={{ marginTop: 16, ...(mia ? { background: VERDE, color: "#fff" } : { background: TIZA, color: GOMA }) }}>{mia ? "Apartado" : lleno ? "Lleno" : "Apartar mi lugar"}</button>
                  </div>
                </div>
              </Rev>
            );
          })}
        </div>
      </Seccion>

      {/* coaches */}
      <Seccion id="entrenadores" etiqueta="Entrenadores" titulo="Quién te entrena" sub="Toca un coach para ver sus fotos, sus clases y cómo trabaja." fondo="#0e0f10" borde={AZUL}>
        <div className="gy-auto" style={{ ["--min" as string]: "26rem" }}>
          {COACHES.map((c, i) => (
            <Rev key={c.nombre} i={i} className="h-full">
              <button type="button" onClick={() => { setCoach(c); setFotoCoach(0); }} className="gy-card flex h-full w-full flex-col overflow-hidden rounded-xl text-left sm:flex-row" style={{ background: GOMA2 }}>
                <span className="block h-[clamp(18rem,30vw,28rem)] overflow-hidden sm:h-auto sm:w-1/2"><img src={c.foto} alt={`Coach ${c.nombre}`} loading="lazy" className="gy-img h-full w-full object-cover" /></span>
                <span className="flex flex-1 flex-col justify-center p-6">
                  <span className="text-[1rem] font-bold uppercase tracking-[0.12em]" style={{ color: AMARILLO }}>{c.desde}</span>
                  <b className="gym-titulo mt-1 block text-[clamp(2.2rem,1.9rem+1vw,3rem)]">{c.nombre}</b>
                  <span className="mt-1 block text-[1.2rem] text-white/80">{c.que}</span>
                  <span className="mt-4 text-[1.15rem] italic text-white/70">“{INFO_COACH[c.nombre].frase}”</span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[1.1rem] font-bold" style={{ color: AMARILLO }}>Conocerlo <ArrowRight size={18} /></span>
                </span>
              </button>
            </Rev>
          ))}
        </div>
      </Seccion>

      {/* resultados de los socios */}
      <Seccion id="socios" etiqueta="Resultados" titulo="Lo que cambia entrenando aquí" sub="Lo que cuentan los socios después de unos meses en Spartan Force." fondo={AMARILLO} color={GOMA} borde={GOMA}>
        <dl className="gy-auto mb-8" style={{ ["--min" as string]: "11rem" }}>
          {[["800", "socios activos"], ["2", "sedes con parqueo"], ["7 días", "de clases"], ["4:30 am", "abrimos"]].map(([n, t]) => <div key={t} className="rounded-xl p-5 text-center" style={{ background: GOMA, color: TIZA }}><dt className="gym-titulo text-[clamp(2.6rem,2.2rem+1.2vw,3.4rem)]" style={{ color: AMARILLO }}>{n}</dt><dd className="text-[1.1rem] opacity-80">{t}</dd></div>)}
        </dl>
        <div className="gy-auto" style={{ ["--min" as string]: "19rem" }}>
          {RESULTADOS.map((a, i) => (
            <Rev key={a.q} i={i} className="h-full">
              <figure className="gy-card flex h-full flex-col overflow-hidden rounded-xl bg-white">
                <span className="relative block overflow-hidden"><img src={a.foto} alt={a.q} loading="lazy" className="gy-img h-[clamp(13rem,17vw,18rem)] w-full object-cover" /><span className="absolute bottom-0 left-0 rounded-tr-xl px-4 py-2" style={{ background: GOMA, color: AMARILLO }}><span className="gym-titulo text-[2.6rem]">{a.n}</span> <span className="text-[1rem] font-semibold text-white">{a.t}</span></span></span>
                <div className="flex flex-1 flex-col p-5">
                  <blockquote className="text-[1.2rem] leading-snug">“{a.d}”</blockquote>
                  <figcaption className="mt-auto pt-4 text-[1.1rem] font-bold">{a.q}</figcaption>
                </div>
              </figure>
            </Rev>
          ))}
        </div>
      </Seccion>

      {/* sedes con parqueo */}
      <Seccion id="sedes" etiqueta="Sedes" titulo="Dónde estamos" sub="Toca una sede para ver el mapa y cómo llegar." fondo={ACERO} color={GOMA} borde={GOMA}>
        <div className="gy-auto" style={{ ["--min" as string]: "26rem" }}>
          {SEDES.map((x, i) => {
            const vuelta = !!vueltas[x.id];
            const nvx = nivel(aforo(x.id, h), x.capacidad);
            const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Spartan Force Gym ${x.nombre}, ${x.dir}`)}`;
            return (
              <Rev key={x.id} i={i} className="h-full">
                <div className="gy-flip h-[clamp(32rem,38vw,38rem)]" data-vuelta={vuelta ? "1" : "0"}>
                  <div className="gy-flip-in">
                    <button type="button" tabIndex={vuelta ? -1 : 0} onClick={() => setVueltas({ ...vueltas, [x.id]: true })} className="gy-face gy-card flex flex-col overflow-hidden rounded-xl bg-white text-left" aria-label={`Ver el mapa de la sede ${x.nombre}`}>
                      <span className="relative block h-[48%] overflow-hidden"><img src={x.foto} alt={`Sede ${x.nombre}`} loading="lazy" className="gy-img h-full w-full object-cover" /><span className="absolute left-4 top-4 rounded-md px-3 py-1.5 text-[1.05rem] font-bold" style={abierto ? { background: VERDE, color: "#fff" } : { background: ROJO, color: "#fff" }}>{abierto ? "Abierto ahora" : "Cerrado ahora"}</span></span>
                      <span className="grid flex-1 content-start gap-2.5 p-6">
                        <span className="gym-titulo text-[clamp(2.4rem,2rem+1vw,3rem)]">{x.nombre}</span>
                        <span className="flex gap-2.5 text-[1.15rem]"><MapPin size={24} className="mt-0.5 shrink-0" style={{ color: ROJO }} /> {x.dir}</span>
                        <span className="flex gap-2.5 text-[1.15rem] font-semibold"><Car size={24} className="mt-0.5 shrink-0" style={{ color: AZUL }} /> {x.parqueo}</span>
                        <span className="flex gap-2.5 text-[1.15rem]"><Users size={24} className="mt-0.5 shrink-0" style={{ color: VERDE }} /> Ahora: {nvx.t.toLowerCase()}, unas {aforo(x.id, h)} personas</span>
                        <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[1.1rem] font-bold" style={{ color: AZUL }}>Ver mapa <ArrowRight size={18} /></span>
                      </span>
                    </button>
                    <div className="gy-face gy-back flex flex-col overflow-hidden rounded-xl bg-white" aria-hidden={!vuelta}>
                      <iframe title={`Mapa de ${x.nombre}`} loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent(x.dir + ", Guatemala")}&output=embed`} className="min-h-0 w-full flex-1 border-0" tabIndex={vuelta ? 0 : -1} />
                      <div className="grid gap-3 p-5">
                        <p className="flex gap-2.5 text-[1.1rem]"><MapPin size={22} className="mt-0.5 shrink-0" style={{ color: ROJO }} /><span><b>Spartan Force {x.nombre}</b><br />{x.dir}</span></p>
                        <div className="grid grid-cols-[1fr_auto] gap-3">
                          <a href={maps} target="_blank" rel="noopener noreferrer" tabIndex={vuelta ? 0 : -1} className={`${btn} gy-btn !py-3.5 text-[1.15rem] text-white`} style={{ background: AZUL }}><Navigation size={20} /> Cómo llegar</a>
                          <button type="button" tabIndex={vuelta ? 0 : -1} onClick={() => setVueltas({ ...vueltas, [x.id]: false })} className={`${btn} gy-btn !py-3.5 text-[1.1rem] border-2`} style={{ borderColor: GOMA }}>Volver</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Rev>
            );
          })}
        </div>
        <dl className="gy-auto mt-6 rounded-xl bg-white p-6" style={{ ["--min" as string]: "15rem" }}>
          {HORARIO.map(([d, hh]) => (
            <div key={d} className="flex items-center gap-3"><Clock size={22} className="shrink-0 opacity-60" /><span><dt className="text-[1.1rem] font-bold">{d}</dt><dd className="text-[1.05rem] opacity-75">{hh}</dd></span></div>
          ))}
        </dl>
      </Seccion>

      {/* preguntas */}
      <Seccion id="preguntas" etiqueta="Preguntas" titulo="Lo que más nos preguntan" fondo={GOMA2} borde={VERDE}>
        <div className="grid gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-[1fr_1.5fr]">
          <img src={FOTOS.comunidad} alt="Socios chocando las manos después de entrenar" loading="lazy" className="hidden h-full max-h-[32rem] w-full rounded-xl object-cover lg:block" />
          <div className="grid content-start gap-3">
            {PREGUNTAS.map(([q, a]) => (
              <details key={q} className="group rounded-lg px-6 py-5" style={{ background: GOMA }}>
                <summary className="flex min-h-[2.75rem] cursor-pointer list-none items-center justify-between gap-3 text-[1.25rem] font-bold">{q}<span className="text-[1.8rem] leading-none transition group-open:rotate-45" style={{ color: AMARILLO }}>+</span></summary>
                <p className="mt-3 text-[1.15rem] leading-relaxed text-white/80">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </Seccion>

      {/* cierre */}
      <section style={{ background: AMARILLO, color: GOMA, borderTop: `8px solid ${GOMA}` }}>
        <div className="gy-cont flex flex-col gap-6 py-[clamp(2.5rem,5vw,5rem)] md:flex-row md:items-center md:justify-between">
          <div><h2 className="gym-titulo gy-h2">Entra hoy mismo</h2><p className="mt-2 text-[clamp(1.1rem,1rem+0.5vw,1.4rem)] font-semibold opacity-80">Paga tu pase del día y entra a la talanquera con tu código QR.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => setPlan("dia")} className={`${btn} gy-btn !px-9 !py-4 text-[1.25rem]`} style={{ background: GOMA, color: TIZA }}>Pagar pase del día</button><a href="#planes" className={`${btn} gy-btn !px-9 !py-4 text-[1.25rem] border-2`} style={{ borderColor: GOMA }}>Ver planes</a></div>
        </div>
      </section>

      {clase && (() => {
        const inf = INFO_CLASE[clase.nombre] ?? INFO_CLASE.Funcional;
        const mia = !!gym.reservas[clase.id];
        const van = clase.van + (mia ? 1 : 0);
        const lleno = van >= clase.cupo && !mia;
        return (
          <Ventana titulo={clase.nombre} alCerrar={cerrarClase} fondo={GOMA2} color={TIZA} ancho="58rem">
            <div className="grid md:grid-cols-[1fr_1.1fr]">
              <div className="relative min-h-[16rem] md:min-h-[30rem]"><img src={clase.foto} alt="" className="pf-zoom absolute inset-0 h-full w-full object-cover" /><span className="absolute bottom-4 left-4 rounded-md px-4 py-2 text-[1.2rem] font-bold" style={{ background: AMARILLO, color: GOMA }}>{DIAS[clase.dia]} · {clase.hora}</span></div>
              <div className="flex flex-col p-6 pt-8 md:p-9">
                <h3 className="gym-titulo text-[clamp(2.6rem,2rem+2vw,4rem)]">{clase.nombre}</h3>
                <p className="mt-2 text-[1.3rem] text-white/85">{inf.que}</p>
                <dl className="mt-5 grid grid-cols-3 gap-2.5 text-center">
                  {[["Con", clase.coach], ["Dura", inf.dura], ["Nivel", inf.nivel]].map(([a, b]) => <div key={a} className="rounded-lg p-3" style={{ background: GOMA }}><dt className="text-[0.9rem] text-white/60">{a}</dt><dd className="mt-0.5 text-[1.05rem] font-bold leading-tight">{b}</dd></div>)}
                </dl>
                <p className="mt-5 text-[1.05rem] font-bold">Intensidad</p>
                <div className="mt-1.5 flex gap-1.5" aria-label={`Intensidad ${inf.intensidad} de 5`}>{[1, 2, 3, 4, 5].map((n) => <span key={n} className="h-3 flex-1 rounded-sm" style={{ background: n <= inf.intensidad ? ROJO : "rgba(255,255,255,.15)" }} />)}</div>
                <p className="mt-5 text-[1.05rem] font-bold">Qué traer</p>
                <ul className="mt-1.5 flex flex-wrap gap-2">{inf.trae.map((t) => <li key={t} className="rounded-md px-3 py-1.5 text-[1rem]" style={{ background: GOMA }}>{t}</li>)}</ul>
                <p className="mt-5 text-[1.05rem]">{lleno ? "Clase llena" : `Quedan ${clase.cupo - van} de ${clase.cupo} lugares`}</p>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10"><div className="h-full" style={{ width: `${Math.min(100, (van / clase.cupo) * 100)}%`, background: van >= clase.cupo ? ROJO : van / clase.cupo > 0.75 ? AMARILLO : VERDE }} /></div>
                <button type="button" disabled={lleno} onClick={() => gym.reservar(clase.id)} className="gy-btn mt-7 min-h-[3.75rem] w-full rounded-md text-[1.25rem] font-bold disabled:opacity-40" style={mia ? { background: VERDE, color: "#fff" } : { background: AMARILLO, color: GOMA }}>{mia ? "Apartado, toca para soltarlo" : lleno ? "Clase llena" : "Apartar mi lugar"}</button>
              </div>
            </div>
          </Ventana>
        );
      })()}
      {coach && (() => {
        const inf = INFO_COACH[coach.nombre];
        const f = inf.fotos[fotoCoach];
        const sus: Record<string, { dias: Set<number>; horas: Set<string> }> = {};
        CLASES.filter((c) => c.coach === inf.alias).forEach((c) => { (sus[c.nombre] ??= { dias: new Set(), horas: new Set() }); sus[c.nombre].dias.add(c.dia); sus[c.nombre].horas.add(c.hora); });
        return (
          <Ventana titulo={coach.nombre} alCerrar={cerrarCoach} fondo={GOMA2} color={TIZA} ancho="70rem">
            <div className="grid lg:grid-cols-[1.1fr_1fr]">
              <div className="p-4 pt-5 sm:p-6">
                <figure className="relative overflow-hidden rounded-xl" style={{ background: GOMA }}>
                  <img key={fotoCoach} src={f.f} alt={f.p} className="pf-zoom block max-h-[62svh] w-full object-cover" style={{ aspectRatio: "4 / 3" }} />
                  <figcaption className="absolute inset-x-0 bottom-0 px-5 pb-4 pt-12 text-[1.15rem] font-bold" style={{ background: "linear-gradient(transparent, rgba(0,0,0,.8))" }}>{f.p} · {fotoCoach + 1} de {inf.fotos.length}</figcaption>
                  <button type="button" aria-label="Foto anterior" onClick={() => setFotoCoach((fotoCoach + inf.fotos.length - 1) % inf.fotos.length)} className="gy-btn absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-black shadow-md"><ArrowLeft size={22} /></button>
                  <button type="button" aria-label="Foto siguiente" onClick={() => setFotoCoach((fotoCoach + 1) % inf.fotos.length)} className="gy-btn absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-black shadow-md"><ArrowRight size={22} /></button>
                </figure>
                <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
                  {inf.fotos.map((x, i) => <button key={i} type="button" aria-label={`Ver foto ${i + 1}`} aria-pressed={i === fotoCoach} onClick={() => setFotoCoach(i)} className="h-20 w-24 shrink-0 overflow-hidden rounded-lg transition" style={{ boxShadow: i === fotoCoach ? `0 0 0 3px ${AMARILLO}` : "none", opacity: i === fotoCoach ? 1 : 0.6 }}><img src={x.f} alt="" className="h-full w-full object-cover" /></button>)}
                </div>
              </div>
              <div className="flex flex-col p-6 pt-4 lg:p-9 lg:pt-10">
                <p className="text-[1rem] font-bold uppercase tracking-[0.15em]" style={{ color: AMARILLO }}>{coach.desde}</p>
                <h3 className="gym-titulo mt-1 text-[clamp(2.6rem,2rem+2vw,4rem)]">{coach.nombre}</h3>
                <p className="mt-1 text-[1.3rem] text-white/80">{coach.que}</p>
                <p className="mt-4 text-[1.4rem] font-semibold leading-snug" style={{ color: AMARILLO }}>“{inf.frase}”</p>
                <p className="mt-5 text-[1.05rem] font-bold">Certificaciones</p>
                <ul className="mt-2 grid gap-2">{inf.certs.map((c) => <li key={c} className="flex gap-2.5 text-[1.1rem]"><Check size={20} className="mt-0.5 shrink-0" style={{ color: VERDE }} /> {c}</li>)}</ul>
                <p className="mt-5 text-[1.05rem] font-bold">Clases que imparte</p>
                <ul className="mt-2 grid gap-2">
                  {Object.entries(sus).map(([n, v]) => <li key={n} className="rounded-lg px-4 py-2.5 text-[1.05rem]" style={{ background: GOMA }}><b>{n}</b> · {[...v.horas].join(" y ")} · {[...v.dias].sort((a, b) => ((a || 7) - (b || 7))).map((d) => DIAS[d].slice(0, 3)).join(", ")}</li>)}
                </ul>
                <button type="button" onClick={() => { cerrarCoach(); setMsg(`Hola, Spartan Force. Quiero entrenar con ${coach.nombre.split(" ")[0]}. ¿Qué clases tiene esta semana?`); }} className="gy-btn mt-6 min-h-[3.75rem] w-full rounded-md text-[1.25rem] font-bold" style={{ background: AMARILLO, color: GOMA }}>Escribirle a {coach.nombre.split(" ")[0]}</button>
              </div>
            </div>
          </Ventana>
        );
      })()}

      <Inscripcion gym={gym} plan={plan} alCerrar={() => setPlan(null)} estudiante={estudiante} alListo={alInscribir} />
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="gimnasio" que="cada mensaje" />
    </>
  );
}

/* ---------------- inscripción en línea ---------------- */

/* los logos de las tarjetas: los colores y la letra de cada marca, para reconocerlas de un vistazo */
function Visa() {
  return <span className="inline-flex items-center rounded border px-2 py-0.5" style={{ background: "#fff", borderColor: "#d8dce6" }}><span style={{ fontFamily: '"Barlow", "Arial Black", sans-serif', fontStyle: "italic", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.03em", color: "#1434CB" }}>VISA</span></span>;
}
function Mastercard() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded border px-2 py-0.5" style={{ background: "#fff", borderColor: "#d8dce6" }}>
      <svg viewBox="0 0 38 24" width="34" height="22" aria-hidden><circle cx="13" cy="12" r="11" fill="#EB001B" /><circle cx="25" cy="12" r="11" fill="#F79E1B" /><path d="M19 3.1a11 11 0 0 1 0 17.8 11 11 0 0 1 0-17.8Z" fill="#FF5F00" /></svg>
      <span style={{ fontFamily: '"Barlow", Arial, sans-serif', fontWeight: 700, fontSize: "0.82rem", letterSpacing: "-0.02em", color: "#1f2937" }}>mastercard</span>
    </span>
  );
}


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
            <p className="mt-2 opacity-75">Pasa el código QR por la talanquera para entrar. Tu plan vence el {fechaCorta(vence)} y te avisamos por WhatsApp 3 días antes.</p>
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
                  [(8 - new Date().getDay()) % 7 || 7, "Lunes"],
                ].map(([n, t]) => (
                  <button key={t} type="button" onClick={() => setInicio(n as number)} className="rounded-md border-2 px-2 py-2.5 leading-tight" style={chip(inicio === n)}>
                    <b className="block">{t}</b>
                    <span className="text-[0.92rem] opacity-80">{fechaCorta(enDias(n as number))}</span>
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
                {([
                  ["tarjeta", "Con tarjeta, aquí mismo", "Entras hoy con tu código QR", <span key="t" className="flex items-center gap-2"><Visa /><Mastercard /></span>],
                  ["transferencia", "Por transferencia", "Sube tu comprobante y listo", <span key="b" className="rounded px-2 py-1 text-[0.85rem] font-bold text-white" style={{ background: AZUL }}>BANCA EN LÍNEA</span>],
                  ["recepcion", "En recepción", "Paga al llegar, en efectivo o tarjeta", <span key="r" className="rounded px-2 py-1 text-[0.85rem] font-bold" style={{ background: AMARILLO, color: GOMA }}>EFECTIVO</span>],
                ] as [string, string, string, ReactNode][]).map(([id, t, n, logo]) => (
                  <button key={id} type="button" onClick={() => setPago(id)} className="flex items-center justify-between gap-3 rounded-md border-2 px-4 py-3 text-left" style={chip(pago === id)}>
                    <span><b className="block text-[1.05rem]">{t}</b><span className="text-[0.92rem] opacity-80">{n}</span></span>
                    <span className="shrink-0">{logo}</span>
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
              {valido ? (pago === "tarjeta" ? `Pagar ${qz(total)} con tarjeta` : pago === "transferencia" ? "Ya hice la transferencia" : "Apartar mi inscripción") : "Pon tu nombre y WhatsApp"}
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
    <div className="gy-cont pb-16 pt-8">
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
