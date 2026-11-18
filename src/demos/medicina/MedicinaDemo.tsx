/*
 * Demo: "Consultorio Dr. Samayoa", medicina general e interna (negocio inventado, datos de ejemplo, fotos de Unsplash).
 *
 * Problema de un consultorio de adultos -> cómo lo resuelve la demo
 * - Los pacientes con presión alta o diabetes apuntan sus lecturas en un cuaderno que nunca traen -> las anotan en su teléfono y el doctor las ve.
 * - "Doctor, ya se me acabó la medicina" y hay que sacar cita solo por la receta -> la receta está en el teléfono y se pide la renovación.
 * - "¿Cuánto cuesta un chequeo y qué incluye?" -> chequeos con sus exámenes de laboratorio y su precio a la vista.
 * - Hay que ir a recoger los resultados -> los resultados llegan a la app, con lo que está fuera de rango marcado.
 * - El doctor no sabe qué paciente crónico se está descompensando -> el consultorio ve primero las lecturas altas.
 */
import { useEffect, useState } from "react";
import { Activity, ArrowRight, CalendarCheck, Check, ClipboardList, FileText, FlaskConical, Pill } from "lucide-react";
import presion from "@/assets/demo-medicina/presion.jpg";
import mayor from "@/assets/demo-medicina/mayor.jpg";
import tension from "@/assets/demo-medicina/tension.jpg";
import lab from "@/assets/demo-medicina/lab.jpg";
import historia from "@/assets/demo-medicina/historia.jpg";
import { BandaDemos, PartesDemo, CierreJzet, MensajeWhatsApp } from "../comun";

/* piedra fría de consultorio, verde pino y el ocre de los sobres de laboratorio */
const PIEDRA = "#e4eae7";
const PINO = "#1d4a42";
const PINO2 = "#2c6458";
const OCRE = "#c47f26";
const ROJO = "#c2412d";
const TINTA = "#16231f";
const LETRA = '"Libre Franklin", "Instrument Sans", sans-serif';
const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;
const btn = "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-semibold transition active:scale-[0.98]";

const ESTILOS = `
.medi h1, .medi h2, .medi h3 { color: inherit; }
.medi-titulo { font-family: ${LETRA}; font-weight: 800; line-height: 1.04; letter-spacing: -0.025em; }
.medi-hero { display: grid; gap: 2rem; }
@media (min-width: 960px) { .medi-hero { grid-template-columns: 1.1fr 1fr; align-items: center; } }
.medi-dos { display: grid; gap: 1.5rem; }
@media (min-width: 960px) { .medi-dos { grid-template-columns: 1fr 1fr; } }
.medi-consul { display: grid; gap: 1.5rem; }
@media (min-width: 1024px) { .medi-consul { grid-template-columns: 1.35fr 1fr; } }
/* hoja de receta: renglones finos y el margen rojo */
.receta { background-color: #fff; background-image: linear-gradient(90deg, transparent 2.6rem, rgba(194,65,45,.35) 2.6rem, rgba(194,65,45,.35) calc(2.6rem + 1px), transparent calc(2.6rem + 1px)),
  repeating-linear-gradient(180deg, transparent 0 1.85rem, rgba(29,74,66,.12) 1.85rem calc(1.85rem + 1px)); }
`;

/* logo: corazón dibujado con el trazo del pulso */
function Logo({ tam = 42 }: { tam?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={tam} height={tam} aria-hidden className="shrink-0">
      <rect width="48" height="48" rx="12" fill={PINO} />
      <path d="M24 38 C14 31 8 25 8 18 C8 13 12 10 16 10 C19.5 10 22 12 24 15 C26 12 28.5 10 32 10 C36 10 40 13 40 18 C40 25 34 31 24 38 Z" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M9 23 H17 L20 17 L24 29 L27 21 L29 23 H39" fill="none" stroke={OCRE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Marca() {
  return (
    <span className="flex items-center gap-2.5">
      <Logo />
      <span className="leading-none">
        <span className="medi-titulo block whitespace-nowrap text-[1.1rem] sm:text-[1.25rem]">Dr. Ricardo Samayoa</span>
        <span className="mt-0.5 block whitespace-nowrap text-[0.72rem] font-semibold opacity-70"><span className="sm:hidden">Medicina general</span><span className="hidden sm:inline">Medicina general e interna · Mixco</span></span>
      </span>
    </span>
  );
}

const CHEQUEOS = [
  { id: "basico", nombre: "Chequeo básico", precio: 350, para: "Para empezar el año", incluye: ["Consulta completa", "Hematología", "Glucosa en ayunas", "Orina"] },
  { id: "completo", nombre: "Chequeo completo", precio: 690, para: "Mayores de 35", incluye: ["Todo el básico", "Colesterol y triglicéridos", "Creatinina y ácido úrico", "Electrocardiograma"], marca: true },
  { id: "diabetes", nombre: "Control de diabetes", precio: 420, para: "Cada 3 meses", incluye: ["Consulta de control", "Hemoglobina glicosilada", "Glucosa en ayunas", "Revisión de pies"] },
];

type Lectura = { dia: string; sis: number; dia2: number; glu: number };
const LECTURAS: Lectura[] = [
  { dia: "lun", sis: 132, dia2: 84, glu: 118 },
  { dia: "mar", sis: 128, dia2: 82, glu: 112 },
  { dia: "mié", sis: 138, dia2: 88, glu: 125 },
  { dia: "jue", sis: 135, dia2: 86, glu: 121 },
  { dia: "vie", sis: 126, dia2: 80, glu: 109 },
  { dia: "sáb", sis: 142, dia2: 90, glu: 131 },
];
const RECETA = [
  { med: "Losartán 50 mg", como: "1 tableta en la mañana", dias: 30, quedan: 4 },
  { med: "Metformina 850 mg", como: "1 tableta con el almuerzo y 1 con la cena", dias: 30, quedan: 4 },
  { med: "Aspirina 100 mg", como: "1 tableta después del almuerzo", dias: 30, quedan: 12 },
];
const RESULTADOS = [
  { examen: "Glucosa en ayunas", valor: "126 mg/dL", rango: "70 a 100", fuera: true },
  { examen: "Hemoglobina glicosilada", valor: "7.1 %", rango: "menos de 6.5", fuera: true },
  { examen: "Colesterol total", valor: "188 mg/dL", rango: "menos de 200", fuera: false },
  { examen: "Triglicéridos", valor: "162 mg/dL", rango: "menos de 150", fuera: true },
  { examen: "Creatinina", valor: "0.9 mg/dL", rango: "0.7 a 1.2", fuera: false },
];
type Cita = { hora: string; quien: string; edad: number; motivo: string; tipo: "control" | "chequeo" | "consulta"; listo?: boolean; nueva?: boolean };
const AGENDA: Cita[] = [
  { hora: "8:00", quien: "Rosa Elvira Tzul", edad: 67, motivo: "Control de presión", tipo: "control", listo: true },
  { hora: "8:30", quien: "Julio César Monzón", edad: 54, motivo: "Chequeo completo", tipo: "chequeo", listo: true },
  { hora: "9:15", quien: "Marta Lidia Ramírez", edad: 58, motivo: "Control de diabetes", tipo: "control" },
  { hora: "10:00", quien: "Óscar Pineda", edad: 41, motivo: "Dolor de garganta y fiebre", tipo: "consulta" },
  { hora: "11:00", quien: "Carmen de León", edad: 72, motivo: "Resultados de laboratorio", tipo: "control" },
  { hora: "15:30", quien: "Edgar Alvarado", edad: 49, motivo: "Chequeo básico", tipo: "chequeo" },
];
const CRONICOS = [
  { quien: "Marta Lidia Ramírez", tiene: "Diabetes e hipertensión", ultima: "142/90 · glucosa 131", alto: true, dias: 0 },
  { quien: "Rosa Elvira Tzul", tiene: "Hipertensión", ultima: "156/96", alto: true, dias: 1 },
  { quien: "Héctor Cifuentes", tiene: "Diabetes", ultima: "sin lecturas", alto: false, dias: 15 },
  { quien: "Carmen de León", tiene: "Hipertensión", ultima: "124/80", alto: false, dias: 0 },
];
const HORAS = ["9:45", "10:30", "11:30", "15:00", "16:00", "16:30", "17:00"];

type Estado = { lecturas: Lectura[]; agenda: Cita[]; renovar: boolean; renovada: boolean };
const CLAVE = "jz-medicina-v1";
function useMedicina() {
  const [e, setE] = useState<Estado>(() => {
    try {
      const t = localStorage.getItem(CLAVE);
      if (t) return JSON.parse(t) as Estado;
    } catch {
      /* nada */
    }
    return { lecturas: LECTURAS, agenda: AGENDA, renovar: false, renovada: false };
  });
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(e));
    } catch {
      /* nada */
    }
  }, [e]);
  return {
    ...e,
    anotar: (l: Lectura) => setE((v) => ({ ...v, lecturas: [...v.lecturas.slice(-6), l] })),
    agendar: (c: Cita) => setE((v) => ({ ...v, agenda: [...v.agenda, { ...c, nueva: true }].sort((a, b) => min(a.hora) - min(b.hora)) })),
    terminar: (hora: string) => setE((v) => ({ ...v, agenda: v.agenda.map((c) => (c.hora === hora ? { ...c, listo: true } : c)) })),
    pedirReceta: () => setE((v) => ({ ...v, renovar: true })),
    firmarReceta: () => setE((v) => ({ ...v, renovar: false, renovada: true })),
    reiniciar: () => setE({ lecturas: LECTURAS, agenda: AGENDA, renovar: false, renovada: false }),
  };
}
type Med = ReturnType<typeof useMedicina>;
const min = (h: string) => Number(h.split(":")[0]) * 60 + Number(h.split(":")[1]);
const presionAlta = (l: Lectura) => l.sis >= 140 || l.dia2 >= 90;

type Vista = "pagina" | "control" | "consultorio";

export default function MedicinaDemo() {
  const m = useMedicina();
  const leer = (): Vista => (location.hash === "#control" ? "control" : location.hash === "#consultorio" ? "consultorio" : "pagina");
  const [vista, setVista] = useState<Vista>(leer);
  useEffect(() => {
    const cambio = () => setVista(leer());
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", vista === "pagina" ? location.pathname : `#${vista}`);
    document.title = vista === "consultorio" ? "Consultorio · Dr. Samayoa" : vista === "control" ? "Mi control · Dr. Samayoa" : "Consultorio Dr. Samayoa · Demo de Jzet Labs";
    window.scrollTo(0, 0);
  }, [vista]);

  return (
    <div className="medi min-h-screen" style={{ background: PIEDRA, color: TINTA, fontFamily: LETRA }}>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <PartesDemo fondo={PINO} actual={vista} alCambiar={setVista} partes={[{ id: "pagina", nombre: "Página", quien: "El paciente ve chequeos y hace su cita" }, { id: "control", nombre: "App del paciente", quien: "Anota su presión y ve su receta" }, { id: "consultorio", nombre: "Consultorio", quien: "El doctor ve la agenda y a sus pacientes" }] as const} />
      {vista === "pagina" && <Pagina m={m} alAgendar={() => setVista("consultorio")} />}
      {vista === "control" && <MiControl m={m} />}
      {vista === "consultorio" && <Consultorio m={m} />}
      <CierreJzet demo="consultorio médico" />
    </div>
  );
}

/* ---------------- la página ---------------- */

function Pagina({ m, alAgendar }: { m: Med; alAgendar: () => void }) {
  const [motivo, setMotivo] = useState<Cita["tipo"]>("consulta");
  const [chequeo, setChequeo] = useState("completo");
  const [hora, setHora] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const libres = HORAS.filter((h) => !m.agenda.some((c) => c.hora === h));
  const ch = CHEQUEOS.find((c) => c.id === chequeo)!;

  function agendar() {
    if (!hora) return;
    const quien = nombre.trim() || "Paciente de la página";
    const txt = motivo === "chequeo" ? ch.nombre : motivo === "control" ? "Control de presión o azúcar" : "Consulta general";
    m.agendar({ hora, quien, edad: 45, motivo: txt, tipo: motivo });
    setMsg(`Hola, doctor Samayoa. Soy ${quien}. Aparté ${txt.toLowerCase()} a las ${hora}.${motivo === "chequeo" ? ` Voy en ayunas de 8 horas como dice la página. Precio: ${qz(ch.precio)}.` : ""}`);
    setHora(null);
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-black/5 backdrop-blur" style={{ background: "rgba(228,234,231,.94)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#inicio" aria-label="Consultorio Dr. Samayoa">
            <Marca />
          </a>
          <nav className="hidden gap-7 font-semibold md:flex">
            <a href="#chequeos" className="hover:underline">Chequeos</a>
            <a href="#cronicos" className="hover:underline">Presión y azúcar</a>
            <a href="#cita" className="hover:underline">Cita</a>
          </nav>
          <a href="#cita" className={`${btn} shrink-0 whitespace-nowrap !px-4 !py-2.5 text-white`} style={{ background: PINO }}>
            Hacer cita
          </a>
        </div>
      </header>

      <section id="inicio" className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <div className="medi-hero">
          <div>
            <h1 className="medi-titulo text-[2.5rem] sm:text-[3.5rem]">Consulta para adultos en Mixco</h1>
            <p className="mt-5 max-w-lg text-[1.08rem] leading-relaxed opacity-85">
              Anote sus lecturas desde el teléfono y el doctor las revisa antes de su cita. Su receta y sus resultados de laboratorio, siempre a la mano.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#cita" className={`${btn} text-white`} style={{ background: PINO }}>
                Hacer una cita <ArrowRight size={18} />
              </a>
              <a href="#chequeos" className={`${btn} border-2`} style={{ borderColor: PINO }}>
                Ver chequeos y precios
              </a>
            </div>
            <p className="mt-6 text-[0.92rem] font-semibold opacity-70">Medicina general e interna · Control de presión y diabetes · Colegiado 00000 (ejemplo)</p>
          </div>
          <div>
            <img src={presion} alt="El doctor le toma la presión a un paciente" className="h-[400px] w-full rounded-2xl object-cover sm:h-[460px]" />
          </div>
        </div>
      </section>

      {/* chequeos */}
      <section id="chequeos" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
          <h2 className="medi-titulo text-[2.3rem] sm:text-[3rem]">Chequeos con precio a la vista</h2>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-4">
            <p className="opacity-75">Los exámenes se toman aquí mismo en la mañana. Venga en ayunas de 8 horas.</p>
            <img src={lab} alt="Tubos de muestras de sangre" loading="lazy" className="h-16 w-40 rounded-lg object-cover" />
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {CHEQUEOS.map((c) => (
              <article key={c.id} className="flex flex-col rounded-xl p-5" style={{ background: PIEDRA, boxShadow: c.marca ? `inset 0 0 0 2px ${PINO}` : undefined }}>
                <p className="text-[0.85rem] font-semibold opacity-70">{c.para}</p>
                <h3 className="medi-titulo mt-1 text-[1.5rem]">{c.nombre}</h3>
                <p className="medi-titulo mt-2 text-[2.2rem]">{qz(c.precio)}</p>
                <ul className="mt-3 grid flex-1 content-start gap-1.5">
                  {c.incluye.map((x) => (
                    <li key={x} className="flex gap-2">
                      <Check size={18} className="mt-0.5 shrink-0" style={{ color: PINO2 }} /> {x}
                    </li>
                  ))}
                </ul>
                <a href="#cita" onClick={() => { setMotivo("chequeo"); setChequeo(c.id); }} className={`${btn} mt-5 w-full`} style={c.marca ? { background: PINO, color: "#fff" } : { background: "#fff" }}>
                  Apartar este chequeo
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* crónicos */}
      <section id="cronicos" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14 md:py-16">
        <div className="medi-dos items-center">
          <img src={tension} alt="Persona tomándose la presión con un tensiómetro digital" loading="lazy" className="h-80 w-full rounded-2xl object-cover" />
          <div>
            <h2 className="medi-titulo text-[2.3rem] sm:text-[3rem]">Si tiene presión alta o diabetes</h2>
            <ul className="mt-5 grid gap-4">
              {[
                [Activity, "Anote su presión y su glucosa", "En su teléfono, en diez segundos. Si sale alta, le avisamos qué hacer."],
                [Pill, "Su receta en el teléfono", "Cuando se le esté acabando la medicina, pide la renovación sin sacar cita."],
                [FlaskConical, "Resultados sin ir a recogerlos", "Le llegan a la app y le marcamos lo que salió fuera de rango."],
              ].map(([I, t, d]) => {
                const Icono = I as typeof Activity;
                return (
                  <li key={t as string} className="flex gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-white" style={{ background: PINO }}><Icono size={20} /></span>
                    <span>
                      <b className="block text-[1.08rem]">{t as string}</b>
                      <span className="opacity-80">{d as string}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* cita */}
      <section id="cita" className="scroll-mt-20" style={{ background: PINO, color: "#fff" }}>
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
          <div className="medi-dos">
            <div>
              <h2 className="medi-titulo text-[2.3rem] sm:text-[3rem]">Haga su cita</h2>
              <div className="mt-6 grid gap-2">
                {(
                  [
                    ["consulta", "Consulta general", "Gripe, dolor, malestar, certificados"],
                    ["control", "Control de presión o azúcar", "Para pacientes que ya vienen"],
                    ["chequeo", `Chequeo: ${ch.nombre.toLowerCase()}`, `${qz(ch.precio)} con exámenes`],
                  ] as const
                ).map(([v, t, d]) => (
                  <button key={v} type="button" onClick={() => setMotivo(v)} className="rounded-xl border-2 p-3 text-left" style={motivo === v ? { borderColor: "#fff", background: "rgba(255,255,255,.12)" } : { borderColor: "rgba(255,255,255,.2)" }}>
                    <b className="block">{t}</b>
                    <span className="text-[0.9rem] text-white/70">{d}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-white p-5" style={{ color: TINTA }}>
              <p className="font-semibold">Horas libres hoy</p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {libres.map((h) => (
                  <button key={h} type="button" onClick={() => setHora(h)} className="rounded-lg py-2.5 font-semibold" style={hora === h ? { background: OCRE, color: "#fff" } : { background: PIEDRA }}>
                    {h}
                  </button>
                ))}
              </div>
              <input aria-label="Su nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Su nombre" className="mt-4 w-full rounded-lg border border-black/15 px-3 py-2.5" />
              <button type="button" disabled={!hora} onClick={agendar} className={`${btn} mt-3 w-full text-white disabled:opacity-40`} style={{ background: PINO }}>
                <CalendarCheck size={18} /> {hora ? `Apartar a las ${hora}` : "Escoja una hora"}
              </button>
            </div>
          </div>
        </div>
      </section>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="consultorio médico" que="la cita" accion={{ texto: "Verla en el consultorio", alTocar: () => { setMsg(null); alAgendar(); } }} />
    </>
  );
}

/* ---------------- mi control (paciente) ---------------- */

function MiControl({ m }: { m: Med }) {
  const [sis, setSis] = useState("130");
  const [dia, setDia] = useState("85");
  const [glu, setGlu] = useState("115");
  const ult = m.lecturas[m.lecturas.length - 1];
  const W = 320, H = 140;
  const x = (i: number) => 20 + (i / Math.max(1, m.lecturas.length - 1)) * (W - 40);
  const y = (v: number) => H - 16 - ((v - 70) / 100) * (H - 28);
  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <Marca />
        <span className="text-[0.9rem] font-semibold opacity-70">Marta Lidia R.</span>
      </div>
      <div className="mt-5 rounded-xl p-4 text-white" style={{ background: presionAlta(ult) ? ROJO : PINO }}>
        <p className="font-semibold text-white/80">Su última lectura</p>
        <p className="medi-titulo mt-1 text-[2.4rem]">{ult.sis}/{ult.dia2} <span className="text-[1rem] font-semibold">mmHg</span></p>
        <p>Glucosa: <b>{ult.glu} mg/dL</b></p>
        {presionAlta(ult) && <p className="mt-2 text-[0.95rem]">Está alta. Siéntese 5 minutos y tómela otra vez. Si sigue arriba de 140/90, el doctor ya la vio y le escribe hoy.</p>}
      </div>

      <div className="mt-4 rounded-xl bg-white p-4">
        <p className="font-semibold">Anotar lectura de hoy</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(
            [
              ["Alta", sis, setSis],
              ["Baja", dia, setDia],
              ["Glucosa", glu, setGlu],
            ] as const
          ).map(([t, v, f]) => (
            <label key={t} className="text-[0.85rem] font-semibold">
              {t}
              <input inputMode="numeric" value={v} onChange={(e) => f(e.target.value.replace(/\D/g, ""))} className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 text-[1.1rem]" />
            </label>
          ))}
        </div>
        <button type="button" onClick={() => m.anotar({ dia: "hoy", sis: Number(sis) || 0, dia2: Number(dia) || 0, glu: Number(glu) || 0 })} className={`${btn} mt-3 w-full text-white`} style={{ background: PINO }}>
          Guardar
        </button>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Presión alta de los últimos días">
          <rect x="0" y={y(170)} width={W} height={y(140) - y(170)} fill="rgba(194,65,45,.08)" />
          <line x1="0" x2={W} y1={y(140)} y2={y(140)} stroke={ROJO} strokeDasharray="4 4" strokeWidth="1" />
          <text x={W - 4} y={y(140) - 4} fontSize="10" textAnchor="end" fill={ROJO}>140</text>
          <path d={m.lecturas.map((l, i) => `${i ? "L" : "M"}${x(i)},${y(l.sis)}`).join(" ")} fill="none" stroke={PINO} strokeWidth="2.5" />
          {m.lecturas.map((l, i) => (
            <g key={i}>
              <circle cx={x(i)} cy={y(l.sis)} r="4" fill={presionAlta(l) ? ROJO : PINO} />
              <text x={x(i)} y={H - 2} fontSize="10" textAnchor="middle" fill={TINTA} opacity=".6">{l.dia}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="receta mt-4 rounded-xl p-4 pl-14">
        <p className="flex items-center gap-2 font-semibold"><FileText size={18} /> Su receta</p>
        <ul className="mt-2 grid gap-2">
          {RECETA.map((r) => (
            <li key={r.med} className="leading-tight">
              <b>{r.med}</b>
              <span className="block text-[0.92rem] opacity-80">{r.como}</span>
              <span className="text-[0.85rem]" style={{ color: r.quedan <= 5 ? ROJO : PINO2 }}>Le quedan {r.quedan} días</span>
            </li>
          ))}
        </ul>
        {m.renovada ? (
          <p className="mt-3 font-semibold" style={{ color: PINO2 }}>El doctor ya firmó su receta nueva. Puede mostrarla en la farmacia desde aquí.</p>
        ) : m.renovar ? (
          <p className="mt-3 font-semibold" style={{ color: OCRE }}>Pedido enviado. El doctor la firma hoy.</p>
        ) : (
          <button type="button" onClick={m.pedirReceta} className={`${btn} mt-3 border-2`} style={{ borderColor: PINO }}>
            Pedir renovación de receta
          </button>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-white p-4">
        <p className="flex items-center gap-2 font-semibold"><FlaskConical size={18} /> Resultados del 12 de noviembre</p>
        <ul className="mt-2 divide-y divide-black/5">
          {RESULTADOS.map((r) => (
            <li key={r.examen} className="flex items-center justify-between gap-3 py-2">
              <span className="leading-tight">
                {r.examen}
                <span className="block text-[0.82rem] opacity-60">normal: {r.rango}</span>
              </span>
              <b style={{ color: r.fuera ? ROJO : PINO2 }}>{r.valor}</b>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[0.85rem] opacity-65">Lo que está en rojo lo revisa con el doctor en su próxima cita.</p>
      </div>
    </section>
  );
}

/* ---------------- consultorio ---------------- */

function Consultorio({ m }: { m: Med }) {
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-semibold opacity-70">Consultorio · Dr. Ricardo Samayoa</p>
          <h1 className="medi-titulo text-[2.3rem] sm:text-[3rem]">Hoy</h1>
        </div>
        <button type="button" onClick={m.reiniciar} className="text-[0.9rem] font-semibold underline opacity-70">Volver a los datos de ejemplo</button>
      </div>
      <div className="medi-consul mt-6">
        <div className="grid content-start gap-4">
          <div className="rounded-xl bg-white p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-[1.2rem] font-bold"><ClipboardList size={20} /> Agenda</h2>
            <ul className="mt-3 divide-y divide-black/5">
              {m.agenda.map((c) => (
                <li key={c.hora} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
                  <b className="w-12">{c.hora}</b>
                  <span className="min-w-[10rem] flex-1 leading-tight">
                    <b className="block">
                      {c.quien} <span className="font-normal opacity-60">· {c.edad} años</span>
                      {c.nueva && <span className="ml-1.5 rounded px-1.5 py-0.5 text-[0.72rem] text-white" style={{ background: OCRE }}>desde la página</span>}
                    </b>
                    <span className="text-[0.88rem] opacity-70">{c.motivo}</span>
                  </span>
                  {c.listo ? (
                    <span className="flex items-center gap-1 text-[0.88rem] font-semibold" style={{ color: PINO2 }}><Check size={16} /> Atendido</span>
                  ) : (
                    <button type="button" onClick={() => m.terminar(c.hora)} className="rounded-lg border-2 px-3 py-1 text-[0.85rem] font-semibold" style={{ borderColor: PINO }}>
                      Terminar consulta
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <img src={historia} alt="El doctor escribe en la historia clínica" loading="lazy" className="h-48 w-full rounded-xl object-cover" />
        </div>

        <div className="grid content-start gap-4">
          <div className="rounded-xl bg-white p-4 sm:p-5">
            <h2 className="text-[1.2rem] font-bold">Pacientes crónicos</h2>
            <p className="text-[0.88rem] opacity-70">Primero los que anotaron lecturas altas.</p>
            <ul className="mt-3 grid gap-3">
              {[...CRONICOS].sort((a, b) => Number(b.alto) - Number(a.alto)).map((p) => (
                <li key={p.quien} className="flex items-center gap-3">
                  <span className="h-10 w-1.5 shrink-0 rounded-full" style={{ background: p.alto ? ROJO : p.dias > 7 ? OCRE : PINO2 }} />
                  <span className="min-w-0 flex-1 leading-tight">
                    <b className="block">{p.quien}</b>
                    <span className="text-[0.86rem] opacity-75">{p.tiene} · {p.ultima}{p.dias > 7 ? ` · no anota hace ${p.dias} días` : ""}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setMsg(p.alto ? `Buenas, ${p.quien.split(" ")[0]}. Le habla el doctor Samayoa. Vi su lectura de hoy (${p.ultima}). Tómese la medicina como siempre y vuelva a medirse en la tarde. Si sigue alta o siente dolor de cabeza fuerte, venga de una vez. Le aparto un espacio mañana a las 9:45.` : `Buenas, ${p.quien.split(" ")[0]}. Le saludamos del consultorio del doctor Samayoa. Hace ${p.dias} días que no anota su glucosa. ¿Cómo se ha sentido? Recuerde anotarla en la app para que el doctor la revise.`)}
                    className="rounded-lg border-2 px-3 py-1.5 text-[0.85rem] font-semibold"
                    style={{ borderColor: PINO }}
                  >
                    Escribirle
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl p-4 text-white sm:p-5" style={{ background: PINO }}>
            <h2 className="flex items-center gap-2 text-[1.2rem] font-bold"><Pill size={20} /> Recetas por renovar</h2>
            {m.renovar ? (
              <div className="mt-3">
                <p><b>Marta Lidia Ramírez</b> pide su receta de losartán, metformina y aspirina. Le quedan 4 días.</p>
                <button type="button" onClick={m.firmarReceta} className="mt-3 rounded-lg bg-white px-4 py-2 font-semibold" style={{ color: PINO }}>
                  Firmar y mandar
                </button>
              </div>
            ) : (
              <p className="mt-2 text-white/75">{m.renovada ? "Receta de Marta Lidia firmada y enviada." : "No hay pedidos. Pruebe pedir una desde «Mi control»."}</p>
            )}
          </div>
          <img src={mayor} alt="El doctor platica con un paciente mayor" loading="lazy" className="h-44 w-full rounded-xl object-cover" />
        </div>
      </div>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="consultorio médico" que="el mensaje para el paciente" />
    </section>
  );
}
