/*
 * Demo: tiempo compartido "Costa Serena Club" (negocio inventado, datos de ejemplo).
 * Diseño propio, tipo hotel: portada a pantalla completa con buscador de semana,
 * galería en mosaico con visor, villas, cómo funciona, planes con pago anual o
 * en cuotas, calendario de semanas por mes (temporada alta marcada), preguntas
 * frecuentes y agendar visita. Fotos libres de Unsplash (src/assets/demo-tienda).
 */
import { useEffect, useMemo, useState } from "react";
import { BedDouble, Bath, Check, ChevronDown, ChevronLeft, ChevronRight, Sun, Users, Waves } from "lucide-react";
import { Modal } from "@/components/Modal";
import hero from "@/assets/demo-tienda/tiempo-hero.jpg";
import f1 from "@/assets/demo-tienda/tiempo-1.jpg";
import f2 from "@/assets/demo-tienda/tiempo-2.jpg";
import f3 from "@/assets/demo-tienda/tiempo-3.jpg";
import f4 from "@/assets/demo-tienda/tiempo-4.jpg";
import f5 from "@/assets/demo-tienda/tiempo-5.jpg";
import f6 from "@/assets/demo-tienda/tiempo-6.jpg";
import { BandaDemos, CierreJzet, Contador, MensajeWhatsApp } from "../comun";

const MAR = "#0e3b3a";
const ARENA = "#d9eee8";
const ATARDECER = "#d9693f";
const SERIF = '"DM Serif Display", Georgia, serif';

const GALERIA = [
  { foto: hero, titulo: "La piscina principal" },
  { foto: f1, titulo: "Tumbonas junto al agua" },
  { foto: f3, titulo: "Playa con servicio" },
  { foto: f2, titulo: "Villa con vista al mar" },
  { foto: f6, titulo: "Senderos al atardecer" },
  { foto: f5, titulo: "Habitaciones" },
];

const VILLAS = [
  { nombre: "Villa Mar", foto: f2, texto: "Terraza frente al océano, cocina equipada y sala para toda la familia.", habitaciones: 2, banos: 2, personas: 6 },
  { nombre: "Casita Jardín", foto: f4, texto: "Rodeada de palmeras, a pasos de la piscina. Ideal para parejas o grupos pequeños.", habitaciones: 1, banos: 1, personas: 4 },
];

type Plan = { id: string; nombre: string; nota: string; anual: number; incluye: string[]; destacado?: boolean };
const PLANES: Plan[] = [
  { id: "flexible", nombre: "Semana flexible", nota: "Una semana al año, en temporada baja.", anual: 4500, incluye: ["1 semana al año", "Casita Jardín, hasta 4 personas", "Piscina y áreas comunes", "Cambio de fecha gratis"] },
  { id: "todo", nombre: "Todo el año", nota: "Dos semanas, una en temporada alta.", anual: 8900, incluye: ["2 semanas al año", "Villa Mar, hasta 6 personas", "Temporada alta incluida", "Prioridad para apartar", "Traslado desde la capital"], destacado: true },
];

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
/* semanas de ejemplo 2027: cuatro por mes, algunas apartadas; marzo-abril y diciembre son temporada alta */
const APARTADAS = new Set(["0-0", "0-1", "1-3", "2-2", "2-3", "3-0", "3-1", "5-2", "6-0", "6-1", "6-2", "7-3", "9-1", "10-0", "11-1", "11-2", "11-3"]);
const ALTA = new Set([2, 3, 11]);

const PREGUNTAS = [
  { p: "¿Puedo cambiar mi semana?", r: "Sí. En el plan Semana flexible el cambio de fecha es gratis, con 30 días de aviso y según las semanas libres." },
  { p: "¿Puedo prestar o rentar mi semana?", r: "Sí, a familiares o amigos. Solo avísenos el nombre de quien llega para tener todo listo." },
  { p: "¿Qué pasa si un año no la uso?", r: "Puede guardarla para el siguiente año una sola vez, sin costo." },
  { p: "¿Hay que pagar mantenimiento?", r: "No aparte: el mantenimiento ya va incluido en el precio del plan." },
  { p: "¿Cómo puedo pagar?", r: "En un solo pago al año o en 12 cuotas mensuales. Transferencia, depósito o tarjeta." },
];

type Semana = { mes: number; n: number };
const etiquetaSemana = (s: Semana) => `semana ${s.n + 1} de ${MESES[s.mes].toLowerCase()}`;

export default function TiempoDemo() {
  const [visor, setVisor] = useState<number | null>(null);
  const [cuotas, setCuotas] = useState(false);
  const [plan, setPlan] = useState(PLANES[1].id);
  const [personas, setPersonas] = useState(4);
  const [mesBuscado, setMesBuscado] = useState(6);
  const [semana, setSemana] = useState<Semana | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [que, setQue] = useState("la solicitud");

  useEffect(() => {
    document.title = "Costa Serena Club · Demo de Jzet Labs";
  }, []);

  const planElegido = PLANES.find((p) => p.id === plan)!;
  const precio = (p: Plan) => (cuotas ? `Q${Math.round(p.anual / 12).toLocaleString("en-US")}` : `Q${p.anual.toLocaleString("en-US")}`);

  function buscar() {
    document.getElementById("semanas")?.scrollIntoView({ behavior: "smooth" });
  }

  function apartar() {
    if (!semana) return;
    setQue("la solicitud");
    setMensaje(
      `Hola, Costa Serena Club. Quiero apartar la ${etiquetaSemana(semana)} del 2027 con el plan "${planElegido.nombre}", para ${personas} ${personas === 1 ? "persona" : "personas"}. ¿Me confirman?`,
    );
  }

  return (
    <div style={{ background: ARENA, color: MAR }} className="min-h-screen">
      <BandaDemos />

      {/* portada a pantalla completa con buscador */}
      <section className="relative min-h-[92svh] flex flex-col text-white">
        <img src={hero} alt="Piscina del club rodeada de palmeras" className="demo-hero absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,28,27,.55),rgba(6,28,27,.15)_40%,rgba(6,28,27,.8))]" />
        <header className="relative z-10 mx-auto w-full max-w-7xl px-5 py-5 flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-[1.35rem]" style={{ fontFamily: SERIF }}>
            <Waves size={22} /> Costa Serena
          </span>
          <nav className="hidden md:flex gap-8 text-white/85 text-[0.95rem]">
            <a href="#galeria" className="hover:text-white">
              El club
            </a>
            <a href="#villas" className="hover:text-white">
              Villas
            </a>
            <a href="#planes" className="hover:text-white">
              Planes
            </a>
            <a href="#preguntas" className="hover:text-white">
              Preguntas
            </a>
          </nav>
          <a href="#visita" className="rounded-full bg-white px-4 py-2 text-[0.9rem] font-semibold active:scale-95 transition" style={{ color: MAR }}>
            Agendar visita
          </a>
        </header>

        <div className="relative z-10 flex-1 flex flex-col justify-end mx-auto w-full max-w-7xl px-5 pb-14 sm:pb-20">
          <p className="text-[0.95rem] text-white/85">Pacífico de Guatemala · a 2 horas de la capital</p>
          <h1 className="mt-3 max-w-4xl !text-white text-[2.8rem] sm:text-[4.6rem] lg:text-[5.4rem] leading-[0.98]" style={{ fontFamily: SERIF }}>
            Su semana frente al mar, <span>todos los años.</span>
          </h1>

          {/* buscador tipo hotel */}
          <div className="mt-8 grid sm:grid-cols-[1.2fr_1fr_1fr_auto] gap-2 sm:gap-0 rounded-2xl bg-white/95 p-2 text-[#0e3b3a] shadow-[0_24px_60px_-24px_rgba(0,0,0,.6)] backdrop-blur">
            <label className="flex flex-col px-4 py-2 sm:border-r border-black/10">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] opacity-60">Plan</span>
              <select value={plan} onChange={(e) => setPlan(e.target.value)} className="bg-transparent font-semibold focus:outline-none">
                {PLANES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-col px-4 py-2 sm:border-r border-black/10">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] opacity-60">Personas</span>
              <div className="mt-0.5">
                <Contador valor={personas} alCambiar={(v) => setPersonas(Math.min(6, Math.max(1, v)))} />
              </div>
            </div>
            <label className="flex flex-col px-4 py-2">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] opacity-60">Mes</span>
              <select value={mesBuscado} onChange={(e) => setMesBuscado(Number(e.target.value))} className="bg-transparent font-semibold focus:outline-none">
                {MESES.map((m, i) => (
                  <option key={m} value={i}>
                    {m} 2027
                  </option>
                ))}
              </select>
            </label>
            <button type="button" onClick={buscar} className="rounded-xl px-6 py-3.5 font-semibold text-white active:scale-[0.97] transition" style={{ background: ATARDECER }}>
              Ver semanas libres
            </button>
          </div>
        </div>
        <svg aria-hidden viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px z-10 block h-8 w-full sm:h-12">
          <path d="M0 34 C180 6 360 6 540 30 S900 58 1080 32 S1320 8 1440 26 V60 H0Z" fill={ARENA} />
        </svg>
      </section>

      {/* datos del club */}
      <section className="border-b" style={{ borderColor: "rgba(14,59,58,.15)" }}>
        <div className="mx-auto max-w-7xl px-5 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            ["12", "villas y casitas"],
            ["2", "piscinas"],
            ["300 m", "de playa"],
            ["24/7", "seguridad en el club"],
          ].map(([n, t]) => (
            <div key={t}>
              <p className="text-[2.2rem] leading-none" style={{ fontFamily: SERIF }}>
                {n}
              </p>
              <p className="mt-1 text-sm opacity-70">{t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* galería en mosaico */}
      <section id="galeria" className="scroll-mt-4 mx-auto max-w-7xl px-5 py-16 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="!text-[#0e3b3a] text-[2.4rem] sm:text-[3.4rem] leading-none" style={{ fontFamily: SERIF }}>
            Así es el club
          </h2>
          <p className="opacity-70">Toque una foto para verla en grande.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 md:h-[560px]">
          {GALERIA.slice(0, 5).map((g, i) => (
            <button
              key={g.titulo}
              type="button"
              onClick={() => setVisor(i)}
              className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2 aspect-[4/3] md:aspect-auto" : "aspect-square md:aspect-auto"}`}
            >
              <img src={g.foto} alt={g.titulo} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <span className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-left text-white text-[0.9rem] font-semibold bg-[linear-gradient(to_top,rgba(0,0,0,.6),transparent)] opacity-0 group-hover:opacity-100 transition">
                {g.titulo}
              </span>
              {i === 4 && (
                <span className="absolute inset-0 grid place-items-center bg-black/45 text-white font-semibold">Ver las {GALERIA.length} fotos</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* villas */}
      <section id="villas" className="scroll-mt-4 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <h2 className="!text-[#0e3b3a] text-[2.4rem] sm:text-[3.4rem] leading-none" style={{ fontFamily: SERIF }}>
            Dónde se queda
          </h2>
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            {VILLAS.map((v) => (
              <article key={v.nombre}>
                <img src={v.foto} alt={v.nombre} className="w-full aspect-[16/10] object-cover rounded-2xl" loading="lazy" />
                <h3 className="mt-5 !text-[#0e3b3a] text-[1.8rem]" style={{ fontFamily: SERIF }}>
                  {v.nombre}
                </h3>
                <p className="mt-1.5 opacity-75">{v.texto}</p>
                <div className="mt-4 flex flex-wrap gap-5 text-sm font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    <BedDouble size={17} /> {v.habitaciones} {v.habitaciones === 1 ? "habitación" : "habitaciones"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Bath size={17} /> {v.banos} {v.banos === 1 ? "baño" : "baños"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={17} /> Hasta {v.personas}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* cómo funciona */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
        <h2 className="!text-[#0e3b3a] text-[2.4rem] sm:text-[3.4rem] leading-none" style={{ fontFamily: SERIF }}>
          Cómo funciona
        </h2>
        <ol className="mt-10 grid md:grid-cols-3 gap-8">
          {[
            ["Elija su plan", "Una o dos semanas al año, en la temporada que le guste."],
            ["Aparte su semana", "Vea qué semanas hay libres y apártela desde su teléfono."],
            ["Llegue y descanse", "Su villa está lista cuando llega. Nosotros nos encargamos del resto."],
          ].map(([t, d], i) => (
            <li key={t} className="border-t-2 pt-5" style={{ borderColor: MAR }}>
              <span className="text-[2.6rem] leading-none" style={{ fontFamily: SERIF, color: ATARDECER }}>
                0{i + 1}
              </span>
              <p className="mt-3 text-[1.25rem] font-semibold">{t}</p>
              <p className="mt-1.5 opacity-75">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* planes */}
      <section id="planes" className="scroll-mt-4 text-white" style={{ background: MAR }}>
        <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
          <div className="text-center">
            <h2 className="!text-white text-[2.4rem] sm:text-[3.4rem] leading-none" style={{ fontFamily: SERIF }}>
              Dos planes. Sin sorpresas.
            </h2>
            <p className="mt-3 text-white/70">El mantenimiento ya va incluido.</p>
            <div className="mt-6 inline-flex rounded-full bg-white/10 p-1" role="group" aria-label="Forma de pago">
              {[
                [false, "Pago anual"],
                [true, "12 cuotas"],
              ].map(([v, t]) => (
                <button
                  key={String(t)}
                  type="button"
                  onClick={() => setCuotas(v as boolean)}
                  aria-pressed={cuotas === v}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${cuotas === v ? "bg-white text-[#0e3b3a]" : "text-white/80 hover:text-white"}`}
                >
                  {t as string}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-10 grid md:grid-cols-2 gap-5">
            {PLANES.map((p) => (
              <div key={p.id} className={`relative rounded-2xl p-7 flex flex-col ${p.destacado ? "bg-white text-[#0e3b3a]" : "border border-white/20"}`}>
                {p.destacado && (
                  <span className="absolute -top-3 left-7 rounded-full px-3 py-0.5 text-[0.7rem] font-bold tracking-[0.14em] text-white" style={{ background: ATARDECER }}>
                    RECOMENDADO
                  </span>
                )}
                <p className="text-[1.6rem]" style={{ fontFamily: SERIF }}>
                  {p.nombre}
                </p>
                <p className="mt-1 opacity-70">{p.nota}</p>
                <p className="mt-6 text-[3rem] leading-none" style={{ fontFamily: SERIF }}>
                  {precio(p)}
                  <span className="text-[1rem] opacity-60" style={{ fontFamily: "inherit" }}>
                    {" "}
                    {cuotas ? "al mes" : "al año"}
                  </span>
                </p>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {p.incluye.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <Check size={18} className="mt-0.5 shrink-0" style={{ color: ATARDECER }} /> {x}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    setPlan(p.id);
                    buscar();
                  }}
                  className={`mt-7 rounded-xl py-3 font-semibold active:scale-[0.98] transition ${p.destacado ? "text-white" : "bg-white/10 hover:bg-white/20"}`}
                  style={p.destacado ? { background: ATARDECER } : undefined}
                >
                  Elegir y ver semanas
                </button>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-white/50">Planes y precios de ejemplo.</p>
        </div>
      </section>

      {/* calendario por mes */}
      <Calendario mesInicial={mesBuscado} semana={semana} setSemana={setSemana} plan={planElegido.nombre} personas={personas} alApartar={apartar} />

      {/* preguntas */}
      <Preguntas />

      {/* agendar visita */}
      <Visita
        alEnviar={(m) => {
          setQue("la cita");
          setMensaje(m);
        }}
      />

      <CierreJzet demo="tiempo compartido" />

      {/* visor de la galería */}
      <Modal abierto={visor !== null} alCerrar={() => setVisor(null)} titulo="Galería" ancho="sm:w-[min(64rem,94vw)]">
        {visor !== null && (
          <div className="relative">
            <img src={GALERIA[visor].foto} alt={GALERIA[visor].titulo} className="w-full max-h-[78svh] object-cover sm:rounded-t-[1.75rem]" />
            <div className="flex items-center justify-between px-5 py-4 text-tinta">
              <button type="button" aria-label="Foto anterior" onClick={() => setVisor((visor + GALERIA.length - 1) % GALERIA.length)} className="grid place-items-center w-10 h-10 rounded-full border border-black/15 active:scale-90">
                <ChevronLeft size={20} />
              </button>
              <p className="font-semibold">
                {GALERIA[visor].titulo} <span className="opacity-50 font-normal">· {visor + 1} de {GALERIA.length}</span>
              </p>
              <button type="button" aria-label="Foto siguiente" onClick={() => setVisor((visor + 1) % GALERIA.length)} className="grid place-items-center w-10 h-10 rounded-full border border-black/15 active:scale-90">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </Modal>

      <MensajeWhatsApp mensaje={mensaje} alCerrar={() => setMensaje(null)} demo="tiempo compartido" que={que} />
    </div>
  );
}

function Calendario({
  mesInicial,
  semana,
  setSemana,
  plan,
  personas,
  alApartar,
}: {
  mesInicial: number;
  semana: Semana | null;
  setSemana: (s: Semana | null) => void;
  plan: string;
  personas: number;
  alApartar: () => void;
}) {
  const [inicio, setInicio] = useState(Math.min(mesInicial, 9));
  useEffect(() => setInicio(Math.min(mesInicial, 9)), [mesInicial]);
  const visibles = useMemo(() => [inicio, inicio + 1, inicio + 2], [inicio]);

  return (
    <section id="semanas" className="scroll-mt-4 mx-auto max-w-7xl px-5 py-16 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="!text-[#0e3b3a] text-[2.4rem] sm:text-[3.4rem] leading-none" style={{ fontFamily: SERIF }}>
            Semanas 2027
          </h2>
          <p className="mt-2 opacity-70">Las tachadas ya están apartadas. Los meses con sol son temporada alta.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Meses anteriores" disabled={inicio === 0} onClick={() => setInicio(Math.max(0, inicio - 3))} className="grid place-items-center w-11 h-11 rounded-full border disabled:opacity-30 active:scale-90" style={{ borderColor: "rgba(14,59,58,.25)" }}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" aria-label="Meses siguientes" disabled={inicio >= 9} onClick={() => setInicio(Math.min(9, inicio + 3))} className="grid place-items-center w-11 h-11 rounded-full border disabled:opacity-30 active:scale-90" style={{ borderColor: "rgba(14,59,58,.25)" }}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {visibles.map((m) => (
          <div key={m} className="rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-[1.4rem]" style={{ fontFamily: SERIF }}>
                {MESES[m]}
              </p>
              {ALTA.has(m) && (
                <span className="rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold" style={{ background: "#fde4d6", color: "#9a3f1d" }}>
                  <Sun size={12} className="inline -mt-0.5" /> Temporada alta
                </span>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((n) => {
                const apartada = APARTADAS.has(`${m}-${n}`);
                const activa = semana?.mes === m && semana?.n === n;
                return (
                  <button
                    key={n}
                    type="button"
                    disabled={apartada}
                    onClick={() => setSemana(activa ? null : { mes: m, n })}
                    aria-pressed={activa}
                    className={`rounded-xl px-3 py-3 text-left text-sm font-semibold transition active:scale-95 ${
                      apartada ? "bg-black/[0.04] text-black/30 line-through cursor-not-allowed" : activa ? "text-white" : "border hover:border-[#0e3b3a]"
                    }`}
                    style={activa ? { background: MAR } : !apartada ? { borderColor: "rgba(14,59,58,.18)" } : undefined}
                  >
                    Semana {n + 1}
                    <span className="block text-[0.72rem] font-normal opacity-70">{apartada ? "Apartada" : activa ? "Elegida" : "Libre"}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl p-5 text-white" style={{ background: MAR }}>
        <p>
          {semana ? (
            <>
              <b className="capitalize">{etiquetaSemana(semana)}</b> · {plan} · {personas} {personas === 1 ? "persona" : "personas"}
            </>
          ) : (
            "Elija una semana libre para apartarla."
          )}
        </p>
        <button type="button" disabled={!semana} onClick={alApartar} className="rounded-full px-6 py-3 font-semibold disabled:opacity-40 active:scale-[0.97] transition" style={{ background: ATARDECER }}>
          Apartar por WhatsApp
        </button>
      </div>
    </section>
  );
}

function Preguntas() {
  const [abierta, setAbierta] = useState<number | null>(0);
  return (
    <section id="preguntas" className="scroll-mt-4 bg-white">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        <h2 className="!text-[#0e3b3a] text-[2.4rem] sm:text-[3.4rem] leading-none text-center" style={{ fontFamily: SERIF }}>
          Preguntas frecuentes
        </h2>
        <ul className="mt-10 divide-y border-y" style={{ borderColor: "rgba(14,59,58,.15)" }}>
          {PREGUNTAS.map((q, i) => (
            <li key={q.p} style={{ borderColor: "rgba(14,59,58,.15)" }}>
              <button type="button" onClick={() => setAbierta(abierta === i ? null : i)} aria-expanded={abierta === i} className="w-full flex items-center justify-between gap-4 py-5 text-left text-[1.08rem] font-semibold">
                {q.p}
                <ChevronDown size={20} className={`shrink-0 transition-transform ${abierta === i ? "rotate-180" : ""}`} />
              </button>
              <div className={`grid transition-all duration-300 ${abierta === i ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}>
                <p className="overflow-hidden opacity-75">{q.r}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Visita({ alEnviar }: { alEnviar: (m: string) => void }) {
  const [nombre, setNombre] = useState("");
  const [cuando, setCuando] = useState("Este fin de semana");
  const [error, setError] = useState("");
  return (
    <section id="visita" className="scroll-mt-4 mx-auto max-w-7xl px-5 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
      <img src={f6} alt="Sendero de palmeras hacia el mar" className="w-full aspect-[4/3] object-cover rounded-2xl" loading="lazy" />
      <div>
        <h2 className="!text-[#0e3b3a] text-[2.4rem] sm:text-[3.2rem] leading-none" style={{ fontFamily: SERIF }}>
          Venga a conocerlo
        </h2>
        <p className="mt-3 opacity-75">Le damos un recorrido por el club, sin compromiso. Si le gusta, ese mismo día puede apartar su semana.</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!nombre.trim()) {
              setError("Escriba su nombre.");
              return;
            }
            alEnviar(`Hola, Costa Serena Club. Soy ${nombre.trim()} y me gustaría visitar el club ${cuando.toLowerCase()}. ¿Qué horarios tienen?`);
          }}
          noValidate
        >
          <div>
            <label htmlFor="v-nombre" className="text-sm font-semibold">
              Su nombre
            </label>
            <input
              id="v-nombre"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setError("");
              }}
              placeholder="Carlos Méndez"
              className="mt-1.5 w-full rounded-xl border bg-white px-3 py-2.5 focus:outline-none"
              style={{ borderColor: "rgba(14,59,58,.25)" }}
            />
            {error && <p className="mt-1 text-sm text-[#b42318]">{error}</p>}
          </div>
          <div>
            <p className="text-sm font-semibold">¿Cuándo le gustaría venir?</p>
            <div className="mt-1.5 flex flex-wrap gap-2" role="group" aria-label="Cuándo">
              {["Este fin de semana", "El próximo mes", "Solo quiero información"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCuando(c)}
                  aria-pressed={cuando === c}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${cuando === c ? "text-white border-transparent" : "hover:border-[#0e3b3a]"}`}
                  style={cuando === c ? { background: MAR } : { borderColor: "rgba(14,59,58,.25)" }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="rounded-full px-6 py-3.5 font-semibold text-white active:scale-[0.97] transition" style={{ background: ATARDECER }}>
            Agendar visita por WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
