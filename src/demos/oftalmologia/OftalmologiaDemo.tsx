/*
 * Demo: "Clínica Visual Lumen" (negocio inventado, datos de ejemplo).
 * Dos partes, cada una resuelve un problema real que se vio en clínicas de verdad:
 *  - Página: turnos que se respetan, especialidades y seguros a la vista, sucursales con su propio
 *    horario y teléfono, y reseñas con respuesta (la queja no se queda sola en Google).
 *  - Recepción: la sala de espera del día, con aviso por WhatsApp cuando hay retraso.
 * Estructura de cada página: portada, presentación, ventas, reseñas, ubicación y sucursales, y legal.
 */
import { useEffect, useState } from "react";
import PanelLumen from "./PanelLumen";
import { ArrowRight, Bell, CalendarCheck, Check, Clock, Eye, FileText, Glasses, Lock, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { BandaDemos, PartesDemo, CierreJzet, MensajeWhatsApp, qz } from "../comun";
import {
  ARO, AZUL, BLANCO, CORAL, DISTRIBUCION, DOCTORES, HIELO, HORAS, IRIS, NOCHE, OCUPADAS, OPTOTIPOS, 
  QUEJA, RESENAS, ROJO, SEDES, SEGUROS, SERVICIOS, TITULO, VERDE,
  type Forma, type SedeId, type ServicioId,
} from "./datos";

const btn = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold transition active:scale-[0.98]";

const ESTILOS = `
.lumen h1, .lumen h2, .lumen h3 { color: inherit; }
.lumen-titulo { font-family: ${TITULO}; font-weight: 600; line-height: 1.08; letter-spacing: -0.01em; }
.lumen-dos { display: grid; gap: 1.5rem; }
@media (min-width: 960px) { .lumen-dos { grid-template-columns: 1fr 1fr; } }
.lumen-hero { display: grid; gap: 2.5rem; }
@media (min-width: 960px) { .lumen-hero { grid-template-columns: 1.05fr 1fr; align-items: center; } }
/* el cartel de optotipos: letras que se achican, como el de verdad */
.optotipo { font-family: 'Libre Franklin', system-ui, sans-serif; font-weight: 800; letter-spacing: .35em; text-align: center; line-height: 1.15; }
`;

function Logo({ tam = 40 }: { tam?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={tam} height={tam} aria-hidden className="shrink-0">
      <circle cx="24" cy="24" r="22" fill={NOCHE} />
      <circle cx="24" cy="24" r="12.5" fill={IRIS} />
      <circle cx="24" cy="24" r="6" fill={NOCHE} />
      <path d="M5 24 Q24 6 43 24 Q24 42 5 24" fill="none" stroke={BLANCO} strokeWidth="1.8" />
    </svg>
  );
}
function Marca() {
  return (
    <span className="flex items-center gap-2.5">
      <Logo />
      <span className="leading-none">
        <span className="lumen-titulo block text-[1.35rem]">Lumen</span>
        <span className="block whitespace-nowrap text-[0.72rem] font-semibold opacity-70">Clínica Visual · Oftalmología</span>
      </span>
    </span>
  );
}

function Aro({ forma, color }: { forma: Forma; color: string }) {
  const lente = (cx: number) => {
    switch (forma) {
      case "redondo": return <circle cx={cx} cy={30} r={17} />;
      case "cuadrado": return <rect x={cx - 17} y={14} width={34} height={30} rx={7} />;
      case "rectangular": return <rect x={cx - 18} y={17} width={36} height={24} rx={4} />;
      case "aviador": return <path d={`M${cx - 18} 15 H${cx + 18} Q${cx + 18} 46 ${cx} 46 Q${cx - 18} 46 ${cx - 18} 15 Z`} />;
      case "gatuno": return <path d={`M${cx - 18} 22 Q${cx - 18} 14 ${cx - 8} 15 L${cx + 19} 11 Q${cx + 18} 44 ${cx} 44 Q${cx - 18} 44 ${cx - 18} 22 Z`} />;
      case "panto": return <ellipse cx={cx} cy={30} rx={18} ry={15} />;
    }
  };
  return (
    <svg viewBox="0 0 100 60" role="img" aria-label={`Aro ${forma}`} className="w-full">
      <g fill="rgba(27,154,170,.14)" stroke={color} strokeWidth="3.2" strokeLinejoin="round">
        {lente(27)}
        {lente(73)}
      </g>
      <path d="M44 28 Q50 23 56 28" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M9 24 L2 20 M91 24 L98 20" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

type Vista = "pagina" | "recepcion";

export default function OftalmologiaDemo() {
  const leer = (): Vista => (location.hash === "#recepcion" ? "recepcion" : "pagina");
  const [vista, setVista] = useState<Vista>(leer);
  useEffect(() => {
    const cambio = () => setVista(leer());
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", vista === "pagina" ? location.pathname : `#${vista}`);
    document.title = vista === "recepcion" ? "Panel · Clínica Visual Lumen" : "Clínica Visual Lumen · Demo de Jzet Labs";
    window.scrollTo(0, 0);
  }, [vista]);

  return (
    <div className="lumen min-h-screen" style={{ background: BLANCO, color: NOCHE, fontFamily: "'Instrument Sans', system-ui, sans-serif" }}>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <PartesDemo
        fondo={NOCHE}
        actual={vista}
        alCambiar={setVista}
        partes={[
          { id: "pagina", nombre: "Página", quien: "Turnos que se respetan, sucursales y reseñas" },
          { id: "recepcion", nombre: "Panel de la clínica", quien: "Hoy, agenda, pacientes, mensajes, reseñas y reportes" },
        ] as const}
      />
      {vista === "pagina" ? <Pagina /> : <PanelLumen />}
      <CierreJzet demo="clínica oftalmológica" />
    </div>
  );
}

/* ---------------- la página ---------------- */

function Pagina() {
  const [sede, setSede] = useState<SedeId>("z10");
  const [mapaSede, setMapaSede] = useState<SedeId>("z10");
  const [servicio, setServicio] = useState<ServicioId>("examen");
  const [hora, setHora] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const s = SEDES.find((x) => x.id === sede)!;
  const sm = SEDES.find((x) => x.id === mapaSede)!;
  const sv = SERVICIOS.find((x) => x.id === servicio)!;
  const total = DISTRIBUCION.reduce((a, b) => a + b.n, 0);
  const promedio = DISTRIBUCION.reduce((a, b) => a + b.e * b.n, 0) / total;

  function pedir() {
    if (!nombre.trim() || tel.replace(/\D/g, "").length < 8) return setError("Escriba su nombre y un teléfono de 8 números.");
    if (!hora) return setError("Escoja una hora libre.");
    setError("");
    setMsg(`Hola, Lumen ${s.nombre}. Soy ${nombre.trim()} (${tel.trim()}). Quiero mi turno de ${sv.nombre.toLowerCase()} hoy a las ${hora}.`);
    setHora(null);
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-black/5 backdrop-blur" style={{ background: "rgba(251,253,254,.94)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#inicio" aria-label="Clínica Visual Lumen"><Marca /></a>
          <nav className="hidden gap-6 font-semibold lg:flex">
            <a href="#servicios" className="hover:underline">Servicios</a>
            <a href="#turno" className="hover:underline">Su turno</a>
            <a href="#optica" className="hover:underline">Óptica</a>
            <a href="#resenas" className="hover:underline">Reseñas</a>
            <a href="#sedes" className="hover:underline">Sucursales</a>
          </nav>
          <a href="#turno" className={`${btn} shrink-0 whitespace-nowrap !px-4 !py-2.5 text-white`} style={{ background: IRIS }}>
            <CalendarCheck size={16} /> Pedir turno
          </a>
        </div>
      </header>

      {/* portada */}
      <section id="inicio" className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <div className="lumen-hero">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.85rem] font-bold" style={{ background: HIELO, color: AZUL }}>
              <Clock size={14} /> Le atendemos a la hora de su cita
            </p>
            <h1 className="lumen-titulo mt-4 text-[2.5rem] sm:text-[3.5rem]">Su vista, con turno que se respeta.</h1>
            <p className="mt-5 max-w-lg text-[1.1rem] leading-relaxed opacity-85">
              Ve su hora, cuántas personas hay antes que usted y, si hay un retraso, le avisamos por WhatsApp antes de que salga de su casa.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#turno" className={`${btn} text-white`} style={{ background: NOCHE }}>Pedir mi turno <ArrowRight size={18} /></a>
              <a href="#servicios" className={`${btn} border-2`} style={{ borderColor: NOCHE }}>Ver especialidades</a>
            </div>
            <ul className="mt-6 grid gap-2 text-[0.98rem]">
              {["Cirugía de cataratas y retina con doctores especialistas", "Tres sucursales: zona 10, Mixco y Villa Nueva", "Acepta seguros médicos y tarjeta"].map((t) => (
                <li key={t} className="flex items-start gap-2"><Check size={18} className="mt-0.5 shrink-0" style={{ color: VERDE }} /> {t}</li>
              ))}
            </ul>
          </div>
          <Cartel />
        </div>
      </section>

      {/* presentación */}
      <section className="border-y border-black/5" style={{ background: HIELO }}>
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="lumen-dos items-start">
            <div>
              <h2 className="lumen-titulo text-[2rem]">Una clínica que le explica todo</h2>
              <p className="mt-3 max-w-lg leading-relaxed opacity-85">
                Somos una clínica de ojos con tres sucursales. Empezamos hace 12 años en la zona 10 y hoy atendemos a más de 400 pacientes al mes: niños, adultos mayores, diabéticos y quien solo necesita sus lentes.
              </p>
              <p className="mt-3 max-w-lg leading-relaxed opacity-85">
                Nos importa que sepa qué le van a hacer, cuánto cuesta y a qué hora le toca. Por eso lo ponemos todo aquí.
              </p>
            </div>
            <div className="grid gap-3">
              {DOCTORES.map((d) => (
                <div key={d.nombre} className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-4">
                  <span className="lumen-titulo grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-[1.7rem] text-white" style={{ background: AZUL }} aria-hidden>{d.inicial}</span>
                  <div>
                    <p className="lumen-titulo text-[1.15rem]">{d.nombre}</p>
                    <p className="text-[0.88rem] font-semibold" style={{ color: IRIS }}>{d.titulo}</p>
                    <p className="mt-1 text-[0.93rem] opacity-80">{d.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ventas: servicios y precios */}
      <section id="servicios" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-12">
        <h2 className="lumen-titulo text-[2rem]">Especialidades y precios</h2>
        <p className="mt-1 opacity-75">Para que sepa cuánto cuesta antes de venir.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICIOS.map((x) => (
            <div key={x.id} className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[1.08rem] font-bold">{x.nombre}</p>
                <p className="whitespace-nowrap text-[1.08rem] font-bold" style={{ color: IRIS }}>{qz(x.precio)}</p>
              </div>
              <p className="mt-1.5 text-[0.95rem] opacity-75">{x.detalle}</p>
              <p className="mt-3 text-[0.82rem] font-semibold opacity-60">Dura unos {x.dura} minutos</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <ShieldCheck size={18} style={{ color: VERDE }} />
          {SEGUROS.map((t) => <span key={t} className="rounded-full border border-black/10 bg-white px-3 py-1 text-[0.88rem] font-semibold">{t}</span>)}
        </div>
      </section>

      {/* turno */}
      <section id="turno" className="scroll-mt-20" style={{ background: NOCHE }}>
        <div className="mx-auto max-w-3xl px-5 py-12 text-white">
          <h2 className="lumen-titulo text-[2rem]">Pida su turno para hoy</h2>
          <p className="mt-1 text-white/75">Sin llamar. Le confirmamos por WhatsApp y le avisamos si hay retraso.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="text-[0.95rem] font-semibold">Sucursal
              <select value={sede} onChange={(e) => setSede(e.target.value as SedeId)} className="mt-1 w-full rounded-xl border-0 bg-white px-4 py-3 font-normal text-[#0b2545]">
                {SEDES.map((x) => <option key={x.id} value={x.id}>{x.nombre}</option>)}
              </select>
            </label>
            <label className="text-[0.95rem] font-semibold">Qué necesita
              <select value={servicio} onChange={(e) => setServicio(e.target.value as ServicioId)} className="mt-1 w-full rounded-xl border-0 bg-white px-4 py-3 font-normal text-[#0b2545]">
                {SERVICIOS.map((x) => <option key={x.id} value={x.id}>{x.nombre} · {qz(x.precio)}</option>)}
              </select>
            </label>
            <label className="text-[0.95rem] font-semibold">Su nombre
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" placeholder="Ej. Carolina Méndez" className="mt-1 w-full rounded-xl border-0 bg-white px-4 py-3 font-normal text-[#0b2545]" />
            </label>
            <label className="text-[0.95rem] font-semibold">Su teléfono
              <input value={tel} onChange={(e) => setTel(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="Ej. 5544 1290" className="mt-1 w-full rounded-xl border-0 bg-white px-4 py-3 font-normal text-[#0b2545]" />
            </label>
          </div>
          <p className="mt-5 text-[0.95rem] font-semibold">Horas libres hoy en {s.nombre}</p>
          <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {HORAS.map((h) => {
              const ocupada = OCUPADAS.includes(h);
              return (
                <button key={h} type="button" disabled={ocupada} onClick={() => setHora(h)} aria-pressed={hora === h} className="rounded-xl py-2.5 font-bold tabular-nums disabled:cursor-not-allowed disabled:line-through disabled:opacity-35" style={hora === h ? { background: CORAL, color: "#fff" } : { background: "#fff", color: NOCHE }}>
                  {h}
                </button>
              );
            })}
          </div>
          <ul className="mt-5 grid gap-1.5 text-[0.93rem] text-white/80 sm:grid-cols-3">
            <li className="flex gap-2"><Clock size={16} className="mt-0.5 shrink-0" /> Llegue 10 minutos antes</li>
            <li className="flex gap-2"><Bell size={16} className="mt-0.5 shrink-0" /> Aviso por WhatsApp si hay retraso</li>
            <li className="flex gap-2"><FileText size={16} className="mt-0.5 shrink-0" /> Traiga su receta anterior</li>
          </ul>
          {error && <p role="alert" className="mt-4 rounded-xl bg-white p-3 font-semibold" style={{ color: ROJO }}>{error}</p>}
          <button type="button" onClick={pedir} className={`${btn} mt-5 w-full text-white`} style={{ background: CORAL }}><CalendarCheck size={19} /> Pedir mi turno</button>
          <p className="mt-3 text-[0.85rem] text-white/60">Si le ponen gotas para dilatar la pupila, no maneje de regreso. Venga acompañado.</p>
        </div>
      </section>

      {/* óptica */}
      <section id="optica" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-12">
        <div className="flex items-center gap-2"><Glasses size={26} style={{ color: IRIS }} /><h2 className="lumen-titulo text-[2rem]">Óptica: aros y lentes</h2></div>
        <p className="mt-1 opacity-75">Con lentes incluidos para su graduación. Apártelo y lo prueba en la sucursal.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {ARO.map((a) => (
            <div key={a.id} className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="rounded-xl px-3 py-4" style={{ background: HIELO }}><Aro forma={a.forma} color={a.color} /></div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <p className="font-bold">{a.nombre}</p>
                <p className="whitespace-nowrap font-bold" style={{ color: IRIS }}>{qz(a.precio)}</p>
              </div>
              <button type="button" onClick={() => setMsg(`Hola, Lumen ${s.nombre}. Quiero apartar el aro ${a.nombre.toLowerCase()} (${qz(a.precio)}) para probármelo.`)} className="mt-3 w-full rounded-full border-2 py-2 text-[0.9rem] font-bold" style={{ borderColor: NOCHE }}>Apartar para probarlo</button>
            </div>
          ))}
        </div>
      </section>

      {/* reseñas */}
      <section id="resenas" className="scroll-mt-20 border-y border-black/5" style={{ background: HIELO }}>
        <div className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="lumen-titulo text-[2rem]">Lo que dicen nuestros pacientes</h2>
          <p className="mt-1 text-[0.9rem] opacity-70">Reseñas de ejemplo. En su página aparecen las reales de Google.</p>
          <div className="mt-6 lumen-dos items-start">
            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="flex items-center gap-4">
                <p className="lumen-titulo text-[3.2rem] leading-none">{promedio.toFixed(1)}</p>
                <div>
                  <Estrellas n={5} />
                  <p className="mt-1 text-[0.9rem] opacity-75">{total} opiniones en Google</p>
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                {DISTRIBUCION.map((d) => (
                  <div key={d.e} className="flex items-center gap-2 text-[0.88rem]">
                    <span className="w-4 tabular-nums">{d.e}</span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/10"><span className="block h-full rounded-full" style={{ width: `${(d.n / total) * 100}%`, background: IRIS }} /></span>
                    <span className="w-8 text-right tabular-nums opacity-70">{d.n}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              {RESENAS.map((r) => (
                <figure key={r.nombre} className="rounded-2xl border border-black/10 bg-white p-4">
                  <Estrellas n={r.estrellas} />
                  <blockquote className="mt-2 text-[0.98rem] leading-relaxed">{r.texto}</blockquote>
                  <figcaption className="mt-2 text-[0.85rem] font-semibold opacity-70">{r.nombre} · {r.sede}</figcaption>
                </figure>
              ))}
              <figure className="rounded-2xl border-2 bg-white p-4" style={{ borderColor: IRIS }}>
                <Estrellas n={QUEJA.estrellas} />
                <blockquote className="mt-2 text-[0.98rem]">{QUEJA.texto}</blockquote>
                <figcaption className="mt-1 text-[0.85rem] font-semibold opacity-70">{QUEJA.nombre} · {QUEJA.sede}</figcaption>
                <p className="mt-3 rounded-xl p-3 text-[0.93rem] leading-relaxed" style={{ background: HIELO }}>
                  <b>Respuesta de la clínica:</b> {QUEJA.respuesta}
                </p>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ubicación y sucursales */}
      <section id="sedes" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-12">
        <h2 className="lumen-titulo text-[2rem]">Tres sucursales, cada una con su horario y su teléfono</h2>
        <div role="tablist" aria-label="Sucursales" className="mt-5 flex flex-wrap gap-2">
          {SEDES.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={mapaSede === x.id} onClick={() => setMapaSede(x.id)} className="rounded-full border-2 px-5 py-2 font-bold" style={mapaSede === x.id ? { background: NOCHE, color: "#fff", borderColor: NOCHE } : { borderColor: "rgba(11,37,69,.2)" }}>{x.nombre}</button>
          ))}
        </div>
        <div className="mt-5 lumen-dos">
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h3 className="lumen-titulo text-[1.5rem]">Sucursal {sm.nombre}</h3>
            <p className="mt-3 flex items-start gap-2"><MapPin size={20} className="mt-0.5 shrink-0" style={{ color: IRIS }} /> {sm.dir}. {sm.ref}.</p>
            <p className="mt-3 flex items-center gap-2"><Phone size={18} style={{ color: IRIS }} /> <a href={`tel:+502${sm.tel.replace(" ", "")}`} className="font-bold underline">{sm.tel}</a></p>
            <dl className="mt-4 space-y-1.5">
              {sm.horario.map(([d, h]) => <div key={d} className="flex justify-between gap-4"><dt>{d}</dt><dd className="font-bold">{h}</dd></div>)}
            </dl>
            <ul className="mt-4 grid gap-1.5 text-[0.95rem]">
              {sm.extras.map((t) => <li key={t} className="flex items-start gap-2"><Check size={17} className="mt-0.5 shrink-0" style={{ color: VERDE }} /> {t}</li>)}
            </ul>
            <a href={`https://www.google.com/maps?q=${sm.mapa}`} target="_blank" rel="noopener noreferrer" className={`${btn} mt-5 text-white`} style={{ background: NOCHE }}>Cómo llegar <ArrowRight size={18} /></a>
          </div>
          <iframe title={`Mapa de la sucursal ${sm.nombre}`} src={`https://www.google.com/maps?q=${sm.mapa}&output=embed`} className="h-80 w-full rounded-2xl border-0 md:h-full" loading="lazy" />
        </div>
      </section>

      {/* derechos y cuestiones legales */}
      <section className="border-t border-black/5" style={{ background: HIELO }}>
        <div className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="lumen-titulo text-[1.6rem]">Sus datos y sus derechos</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              { i: <Lock size={20} />, t: "Sus datos de salud", x: "Solo los ven su doctor y la recepción. No los compartimos ni los usamos para anuncios. Puede pedir una copia de su expediente o que lo corrijamos." },
              { i: <FileText size={20} />, t: "Antes de una cirugía", x: "Le damos por escrito en qué consiste, qué riesgos tiene y cuánto cuesta. Usted firma si está de acuerdo. Puede cambiar de opinión antes." },
              { i: <ShieldCheck size={20} />, t: "Precios y facturas", x: "Los precios de esta página son los que cobramos. Le damos factura de cada pago. Si no queda conforme, escríbanos y revisamos su caso." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-black/10 bg-white p-5">
                <p className="flex items-center gap-2 font-bold" style={{ color: IRIS }}>{c.i} <span style={{ color: NOCHE }}>{c.t}</span></p>
                <p className="mt-2 text-[0.95rem] leading-relaxed opacity-85">{c.x}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[0.85rem] opacity-65">Textos de ejemplo. En su página se escriben con sus datos reales (nombre legal, colegiado de cada doctor y NIT) y los revisa su abogado. © Clínica Visual Lumen, S. A. · Aviso de privacidad · Términos de uso.</p>
        </div>
      </section>

      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="clínica oftalmológica" que="el turno" />
    </>
  );
}

function Estrellas({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${n} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={17} fill={i <= n ? "#e8a317" : "none"} stroke="#e8a317" />)}
    </span>
  );
}

/* el cartel de letras de la portada, con la tarjeta del turno encima */
function Cartel() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="rounded-[28px] px-6 py-8 text-white" style={{ background: AZUL }} aria-hidden>
        {OPTOTIPOS.map((o) => (
          <div key={o.ojo} className="flex items-center gap-3">
            <div className="optotipo flex-1" style={{ fontSize: `${o.tam}rem` }}>{o.letras}</div>
            <span className="w-14 text-right text-[0.72rem] font-semibold text-white/50">{o.ojo}</span>
          </div>
        ))}
      </div>
      <div className="-mt-5 ml-auto mr-3 w-[17.5rem] rounded-2xl bg-white p-4 shadow-[0_18px_40px_-20px_rgba(11,37,69,.6)]" role="status">
        <p className="flex items-center gap-1.5 text-[0.8rem] font-bold" style={{ color: IRIS }}><Eye size={15} /> Su turno de hoy</p>
        <p className="lumen-titulo mt-1 text-[1.6rem]">10:00 · Dra. Mejía</p>
        <p className="mt-1 text-[0.9rem] opacity-75">Hay 1 persona antes que usted.</p>
        <p className="mt-2 rounded-lg px-2.5 py-1.5 text-[0.85rem] font-semibold" style={{ background: HIELO }}>Sin retraso. Le avisamos si cambia.</p>
      </div>
    </div>
  );
}
