/*
 * Demo: página personal de una fundadora con varias empresas de belleza
 * ("Valeria Ríos", inventada; dueña de las marcas Ámbar de /demos/cosmeticos).
 * Pensada para dueñas que hoy usan una lista de enlaces en la bio: une todas
 * sus empresas, su historia, su prensa, sus programas de mentoría y un
 * contacto para marcas y eventos. Le habla de tú a quien la visita.
 * Fotos libres de Unsplash (src/assets/demo-fundadora y demo-cosmeticos).
 */
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Mic, Newspaper } from "lucide-react";
import { BandaDemos, CierreJzet, MensajeWhatsApp, qz } from "../comun";
import retrato from "@/assets/demo-fundadora/retrato.jpg";
import retrato2 from "@/assets/demo-fundadora/retrato-2.jpg";
import escenario from "@/assets/demo-fundadora/escenario.jpg";
import conferencia from "@/assets/demo-fundadora/conferencia.jpg";
import mentoria from "@/assets/demo-fundadora/mentoria.jpg";
import spa from "@/assets/demo-fundadora/spa.jpg";
import salon from "@/assets/demo-fundadora/salon.jpg";
import academia from "@/assets/demo-cosmeticos/estudio.jpg";
import cosmetics from "@/assets/demo-cosmeticos/polvo-negro.jpg";
import studio from "@/assets/demo-cosmeticos/maquillista.jpg";

const NEGRO = "#0e0d0c";
const CREMA = "#f3ede4";
const PAPEL = "#faf8f4";
const DORADO = "#b38b54";
const SERIF = '"Fraunces", Georgia, serif';
const MAYUS = "uppercase tracking-[0.22em]";

type Empresa = { nombre: string; tipo: string; desde: string; texto: string; foto: string; href?: string; boton: string };
const EMPRESAS: Empresa[] = [
  { nombre: "Ámbar Makeup School", tipo: "Educación", desde: "2015", texto: "Academia de maquillaje profesional. Cursos con fechas, cupos y lista de espera.", foto: academia, href: "/demos/cosmeticos/#academia", boton: "Ver cursos" },
  { nombre: "Ámbar Cosmetics", tipo: "Productos", desde: "2020", texto: "Línea propia de makeup y skincare, libre de parabenos e hipoalergénica.", foto: cosmetics, href: "/demos/cosmeticos/#tienda", boton: "Ir a la tienda" },
  { nombre: "Ámbar Studio", tipo: "Servicios", desde: "2014", texto: "Maquillaje social, novias y eventos, hecho por nuestro equipo de maquillistas.", foto: studio, href: "/demos/cosmeticos/#servicios", boton: "Agendar" },
  { nombre: "Glow Lab", tipo: "Salón", desde: "2021", texto: "Faciales, cejas y pestañas en un espacio pensado para que te sientas bien.", foto: salon, boton: "Pedir cita" },
  { nombre: "Casa Alma Spa", tipo: "Bienestar", desde: "2020", texto: "Masajes y rituales de descanso. Ideal para regalar o para un día entre amigas.", foto: spa, boton: "Reservar" },
  { nombre: "Mujeres que Facturan", tipo: "Mentoría", desde: "2023", texto: "Mi programa para mujeres que quieren convertir lo que saben hacer en un negocio.", foto: mentoria, href: "#mentoria", boton: "Conocer el programa" },
];

const HISTORIA = [
  { a: "2014", t: "Un estudio en un cuarto de mi casa", d: "Maquillaba los fines de semana mientras estudiaba." },
  { a: "2015", t: "Abro la academia", d: "Descubrí que me gustaba más enseñar que maquillar." },
  { a: "2018", t: "Cursos en línea", d: "Alumnas de todo el país sin tener que viajar a la capital." },
  { a: "2020", t: "Lanzo mi propia línea", d: "Mis primeras clientas fueron mis alumnas." },
  { a: "2021", t: "Glow Lab y Casa Alma", d: "Salón y spa para cerrar el círculo de la belleza." },
  { a: "2023", t: "Mujeres que Facturan", d: "Ahora enseño lo que más me costó aprender: el negocio." },
];

const PROGRAMAS = [
  { nombre: "Mentoría 1 a 1", precio: 2500, nota: "al mes", d: "Para dueñas que ya venden y quieren ordenar y crecer.", incluye: ["4 sesiones al mes", "Revisión de precios y números", "Acompañamiento por WhatsApp"] },
  { nombre: "Mujeres que Facturan", precio: 1800, nota: "programa de 8 semanas", d: "Grupal, para empezar o profesionalizar tu negocio.", incluye: ["Clases en vivo cada semana", "Plantillas de precios y cobros", "Comunidad de emprendedoras"], destacado: true },
  { nombre: "Conferencias y talleres", precio: 0, nota: "a cotizar", d: "Para empresas, universidades y eventos de mujeres.", incluye: ["Liderazgo y emprendimiento", "Marca personal", "Belleza como negocio"] },
];

const MOTIVOS = ["Colaboración con mi marca", "Conferencia o evento", "Entrevista o prensa", "Mentoría"];

export default function FundadoraDemo() {
  const [mensaje, setMensaje] = useState<{ texto: string; que: string } | null>(null);
  useEffect(() => {
    document.title = "Valeria Ríos · Fundadora · Demo de Jzet Labs";
  }, []);
  const enlace = "hover:text-[#b38b54] transition";

  return (
    <div style={{ background: PAPEL, color: NEGRO }} className="min-h-screen">
      <BandaDemos />

      {/* encabezado */}
      <header className="sticky top-0 z-30 border-b border-white/10 text-white backdrop-blur" style={{ background: "rgba(14,13,12,.92)" }}>
        <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between gap-4">
          <a href="#inicio" className="text-[1.35rem] font-semibold" style={{ fontFamily: SERIF }}>
            Valeria Ríos
          </a>
          <nav className={`hidden md:flex gap-7 text-[0.72rem] ${MAYUS}`}>
            <a href="#empresas" className={enlace}>
              Empresas
            </a>
            <a href="#historia" className={enlace}>
              Historia
            </a>
            <a href="#prensa" className={enlace}>
              Prensa
            </a>
            <a href="#mentoria" className={enlace}>
              Mentoría
            </a>
          </nav>
          <a href="#contacto" className="rounded-full px-4 py-2 text-[0.85rem] font-semibold text-black" style={{ background: DORADO }}>
            Contacto
          </a>
        </div>
      </header>

      {/* portada */}
      <section id="inicio" className="text-white" style={{ background: NEGRO }}>
        <div className="mx-auto max-w-7xl px-5 pt-10 pb-14 sm:pt-14 sm:pb-20 grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center">
          <div>
            <p className={`text-[0.72rem] ${MAYUS}`} style={{ color: DORADO }}>
              Fundadora y CEO · Guatemala
            </p>
            <h1 className="mt-5 text-[3rem] sm:text-[4.8rem] leading-[0.95] tracking-[-0.02em] font-semibold !text-white" style={{ fontFamily: SERIF }}>
              Seis empresas.
              <br />
              <em style={{ color: DORADO }}>Una misma idea.</em>
            </h1>
            <p className="mt-6 max-w-lg text-[1.08rem] text-white/70">
              Soy Valeria. Empecé maquillando en un cuarto de mi casa y hoy dirijo una academia, una línea de cosméticos, un salón, un spa y un programa para mujeres que quieren emprender.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#empresas" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold text-black active:scale-[0.97] transition" style={{ background: DORADO }}>
                Conoce mis empresas <ArrowRight size={17} />
              </a>
              <a href="#mentoria" className="rounded-full px-6 py-3.5 font-semibold border border-white/30 hover:border-white active:scale-[0.97] transition">
                Trabaja conmigo
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[420px]">
            <img src={retrato} alt="Valeria Ríos, fundadora, con traje oscuro" className="w-full aspect-[4/5] object-cover object-[50%_30%]" />
            <div className="absolute -left-3 sm:-left-8 bottom-8 bg-white px-4 py-3 text-black shadow-[0_20px_40px_-20px_rgba(0,0,0,.7)]">
              <p className={`text-[0.6rem] ${MAYUS}`} style={{ color: DORADO }}>
                Desde 2014
              </p>
              <p className="font-semibold leading-tight">De un cuarto de su casa</p>
              <p className="text-sm text-black/60">a seis empresas</p>
            </div>
          </div>
        </div>
        {/* cifras */}
        <div className="border-t border-white/10">
          <dl className="mx-auto max-w-7xl px-5 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ["6", "empresas"],
              ["+300", "graduadas de la academia"],
              ["+250", "mujeres en mentoría"],
              ["12", "años en la industria"],
            ].map(([n, t]) => (
              <div key={t}>
                <dt className="text-[2.2rem] sm:text-[2.8rem] font-semibold leading-none" style={{ fontFamily: SERIF, color: DORADO }}>
                  {n}
                </dt>
                <dd className="mt-1 text-[0.85rem] text-white/60">{t}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* empresas */}
      <section id="empresas" className="scroll-mt-20 mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <p className={`text-[0.7rem] ${MAYUS}`} style={{ color: DORADO }}>
          Mis empresas
        </p>
        <h2 className="mt-2 text-[2.3rem] sm:text-[3.3rem] leading-[1] font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
          Todo lo que hago, en un solo lugar
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMPRESAS.map((e) => (
            <article key={e.nombre} className="group flex flex-col bg-white border border-black/8">
              <div className="relative overflow-hidden aspect-[16/11]">
                <img src={e.foto} alt="" className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
                <span className={`absolute left-0 top-3 px-2.5 py-1 text-[0.58rem] text-white ${MAYUS}`} style={{ background: NEGRO }}>
                  {e.tipo}
                </span>
              </div>
              <div className="flex-1 flex flex-col p-5">
                <p className="text-[0.75rem] text-black/45">Desde {e.desde}</p>
                <h3 className="mt-0.5 text-[1.35rem] leading-tight font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
                  {e.nombre}
                </h3>
                <p className="mt-2 flex-1 text-[0.92rem] text-black/65">{e.texto}</p>
                {e.href ? (
                  <a href={e.href} className="mt-4 inline-flex items-center gap-1.5 self-start text-[0.9rem] font-semibold border-b border-black pb-0.5 hover:text-[#b38b54] hover:border-[#b38b54] transition">
                    {e.boton} <ArrowUpRight size={16} />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMensaje({ que: "la reserva", texto: `Hola, ${e.nombre}. Vi la página de Valeria y quiero ${e.boton.toLowerCase()}. ¿Qué horarios tienen esta semana?` })}
                    className="mt-4 inline-flex items-center gap-1.5 self-start text-[0.9rem] font-semibold border-b border-black pb-0.5 hover:text-[#b38b54] hover:border-[#b38b54] transition"
                  >
                    {e.boton} <ArrowUpRight size={16} />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm text-black/45">Empresas de ejemplo. Las tres primeras llevan a la demo de Ámbar.</p>
      </section>

      {/* historia */}
      <section id="historia" className="scroll-mt-20" style={{ background: CREMA }}>
        <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
          <div>
            <p className={`text-[0.7rem] ${MAYUS}`} style={{ color: DORADO }}>
              Mi historia
            </p>
            <h2 className="mt-2 text-[2.3rem] sm:text-[3.2rem] leading-[1] font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
              Nada pasó de la noche a la mañana
            </h2>
            <img src={retrato2} alt="Valeria Ríos sentada, retrato en fondo oscuro" className="mt-8 hidden lg:block w-full aspect-[4/5] object-cover" loading="lazy" />
          </div>
          <ol className="relative border-l border-black/15 ml-2">
            {HISTORIA.map((h) => (
              <li key={h.a} className="relative pl-8 pb-9 last:pb-0">
                <span className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full" style={{ background: DORADO }} />
                <p className="text-[1.6rem] font-semibold leading-none" style={{ fontFamily: SERIF, color: DORADO }}>
                  {h.a}
                </p>
                <p className="mt-2 text-[1.15rem] font-semibold">{h.t}</p>
                <p className="mt-1 text-black/60">{h.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* prensa */}
      <section id="prensa" className="scroll-mt-20 mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={`text-[0.7rem] ${MAYUS}`} style={{ color: DORADO }}>
              Prensa
            </p>
            <h2 className="mt-2 text-[2.3rem] sm:text-[3.2rem] leading-[1] font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
              Han hablado de nosotras
            </h2>
          </div>
          <p className="max-w-sm text-sm text-black/50">Aquí van tus notas reales: revistas, periódicos y entrevistas, cada una con su enlace.</p>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { m: "Revista de negocios", t: "La academia que convirtió el maquillaje en una carrera", a: "Agosto 2025" },
            { m: "Revista de moda", t: "Valeria Ríos y su imperio de belleza hecho en Guatemala", a: "Marzo 2025" },
            { m: "Periódico nacional", t: "De un cuarto de su casa a seis empresas", a: "Febrero 2024" },
          ].map((n) => (
            <article key={n.t} className="flex flex-col border border-black/10 bg-white p-6">
              <p className={`inline-flex items-center gap-2 text-[0.62rem] text-black/45 ${MAYUS}`}>
                <Newspaper size={14} /> {n.m}
              </p>
              <h3 className="mt-4 flex-1 text-[1.3rem] leading-snug font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
                “{n.t}”
              </h3>
              <p className="mt-5 flex items-center justify-between text-sm">
                <span className="text-black/50">{n.a}</span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  Leer nota <ArrowUpRight size={15} />
                </span>
              </p>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm text-black/45">Notas de ejemplo.</p>
      </section>

      {/* conferencias */}
      <section className="px-5 pb-14 sm:pb-20">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 overflow-hidden text-white" style={{ background: NEGRO }}>
          <img src={escenario} alt="Valeria dando una charla con micrófono ante un grupo" className="w-full h-64 md:h-full object-cover" loading="lazy" />
          <div className="p-7 sm:p-12">
            <p className={`inline-flex items-center gap-2 text-[0.7rem] ${MAYUS}`} style={{ color: DORADO }}>
              <Mic size={14} /> Conferencias
            </p>
            <h2 className="mt-2 text-[2rem] sm:text-[2.6rem] leading-[1.05] font-semibold !text-white" style={{ fontFamily: SERIF }}>
              Llévame a tu evento
            </h2>
            <p className="mt-4 text-white/70">Hablo de emprendimiento femenino, marca personal y belleza como negocio, con lo que me funcionó y lo que no.</p>
            <ul className="mt-5 space-y-2 text-white/85">
              {["Universidades y colegios", "Empresas y equipos de ventas", "Convenciones y eventos de mujeres"].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <Check size={18} className="mt-0.5 shrink-0" style={{ color: DORADO }} /> {t}
                </li>
              ))}
            </ul>
            <a href="#contacto" className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-black" style={{ background: DORADO }}>
              Pedir fecha <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* mentoría */}
      <section id="mentoria" className="scroll-mt-20" style={{ background: CREMA }}>
        <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
          <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end">
            <div>
              <p className={`text-[0.7rem] ${MAYUS}`} style={{ color: DORADO }}>
                Trabaja conmigo
              </p>
              <h2 className="mt-2 text-[2.3rem] sm:text-[3.3rem] leading-[1] font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
                Convierte lo que sabes hacer en un negocio
              </h2>
            </div>
            <img src={conferencia} alt="" className="hidden lg:block w-56 h-40 object-cover" loading="lazy" />
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            {PROGRAMAS.map((p) => (
              <article key={p.nombre} className={`flex flex-col p-6 ${p.destacado ? "text-white" : "bg-white border border-black/10"}`} style={p.destacado ? { background: NEGRO } : undefined}>
                <h3 className={`text-[1.5rem] leading-tight font-semibold ${p.destacado ? "!text-white" : "!text-[#0e0d0c]"}`} style={{ fontFamily: SERIF }}>
                  {p.nombre}
                </h3>
                <p className={`mt-1 text-[0.9rem] ${p.destacado ? "text-white/65" : "text-black/55"}`}>{p.d}</p>
                <p className="mt-4 text-[2rem] font-semibold leading-none tabular-nums">
                  {p.precio ? qz(p.precio) : "A cotizar"}
                  {p.precio > 0 && <span className={`ml-1.5 text-[0.85rem] font-normal ${p.destacado ? "text-white/60" : "text-black/50"}`}>{p.nota}</span>}
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-[0.92rem]">
                  {p.incluye.map((x) => (
                    <li key={x} className="flex gap-2">
                      <Check size={17} className="mt-0.5 shrink-0" style={{ color: DORADO }} /> {x}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setMensaje({ que: "la solicitud", texto: `Hola, Valeria. Me interesa ${p.nombre === "Conferencias y talleres" ? "una conferencia o taller" : `el programa ${p.nombre}`}. ¿Me cuentas cómo funciona y cuándo empieza?` })}
                  className={`mt-6 rounded-full py-3 font-semibold active:scale-[0.98] transition ${p.destacado ? "text-black" : "text-white"}`}
                  style={{ background: p.destacado ? DORADO : NEGRO }}
                >
                  {p.precio ? "Quiero entrar" : "Pedir cotización"}
                </button>
              </article>
            ))}
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { n: "Lorena G.", s: "Dueña de un salón de uñas", t: "Subí mis precios con números en la mano y no perdí clientas. Ahora sé cuánto gano de verdad." },
              { n: "Marisol A.", s: "Maquillista", t: "Pasé de maquillar solo a mis amigas a tener agenda llena los fines de semana." },
              { n: "Paula R.", s: "Vende repostería", t: "Lo que más me sirvió fue ordenar mis cobros. Dejé de fiar." },
            ].map((o) => (
              <figure key={o.n} className="bg-white p-6 border border-black/8">
                <blockquote className="text-[1rem] leading-relaxed">“{o.t}”</blockquote>
                <figcaption className="mt-4">
                  <span className="block font-semibold">{o.n}</span>
                  <span className="block text-sm text-black/50">{o.s}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-4 text-sm text-black/45">Programas, precios y testimonios de ejemplo.</p>
        </div>
      </section>

      <Contacto alEnviar={(t) => setMensaje({ que: "la solicitud", texto: t })} />

      <UnSoloLink />

      <CierreJzet demo="página personal de fundadora" />

      <MensajeWhatsApp mensaje={mensaje?.texto ?? null} que={mensaje?.que} alCerrar={() => setMensaje(null)} demo="página personal de fundadora" />
    </div>
  );
}

/* Contacto para marcas, eventos y prensa: llega ordenado por motivo */
function Contacto({ alEnviar }: { alEnviar: (texto: string) => void }) {
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [motivo, setMotivo] = useState(MOTIVOS[0]);
  const [detalle, setDetalle] = useState("");
  const [error, setError] = useState("");
  const campo = "mt-1.5 w-full border border-black/20 bg-white px-3 py-3 focus:outline-none focus:border-black";
  return (
    <section id="contacto" className="scroll-mt-20 mx-auto max-w-7xl px-5 py-14 sm:py-20 grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
      <div>
        <p className={`text-[0.7rem] ${MAYUS}`} style={{ color: DORADO }}>
          Contacto
        </p>
        <h2 className="mt-2 text-[2.3rem] sm:text-[3.2rem] leading-[1] font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
          ¿Marcas, eventos o prensa?
        </h2>
        <p className="mt-4 max-w-md text-black/60">Cuéntame qué tienes en mente. Me llega directo y te contesto yo o mi equipo en menos de 48 horas.</p>
        <p className="mt-6 text-sm text-black/50">¿Buscas un curso, un producto o una cita? Entra directo a cada empresa, arriba.</p>
      </div>
      <form
        className="space-y-4"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!nombre.trim()) return setError("Escribe tu nombre.");
          setError("");
          alEnviar(`Hola, Valeria. Soy ${nombre.trim()}${empresa.trim() ? `, de ${empresa.trim()}` : ""}.\nMotivo: ${motivo}.${detalle.trim() ? `\n${detalle.trim()}` : ""}`);
        }}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-semibold">Tu nombre</span>
            <input value={nombre} onChange={(e) => { setNombre(e.target.value); setError(""); }} placeholder="Nombre y apellido" className={campo} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Empresa o medio</span>
            <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Opcional" className={campo} />
          </label>
        </div>
        <fieldset>
          <legend className="text-sm font-semibold">Motivo</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {MOTIVOS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMotivo(m)}
                aria-pressed={motivo === m}
                className={`rounded-full px-4 py-2 text-[0.85rem] font-semibold transition ${motivo === m ? "text-white" : "border border-black/15 hover:border-black"}`}
                style={motivo === m ? { background: NEGRO } : undefined}
              >
                {m}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="block">
          <span className="text-sm font-semibold">Cuéntame más</span>
          <textarea rows={3} value={detalle} onChange={(e) => setDetalle(e.target.value)} placeholder="Fecha, lugar, idea de colaboración…" className={`${campo} resize-none`} />
        </label>
        {error && <p className="text-sm text-[#b42318]">{error}</p>}
        <button type="submit" className="w-full rounded-full py-3.5 font-semibold text-white active:scale-[0.98] transition" style={{ background: NEGRO }}>
          Enviar
        </button>
      </form>
    </section>
  );
}

/* Para la dueña: de una lista de enlaces a una página con su nombre */
function UnSoloLink() {
  const enlaces = ["Academia", "Cursos en línea", "Tienda", "Citas del studio", "Salón", "Spa", "Mentoría", "Prensa", "WhatsApp"];
  return (
    <section className="px-5 pb-14 sm:pb-20">
      <div className="mx-auto max-w-7xl p-7 sm:p-12 text-white" style={{ background: NEGRO }}>
        <p className={`text-[0.7rem] ${MAYUS} text-white/55`}>¿Tu bio es una lista de enlaces?</p>
        <h2 className="mt-2 max-w-3xl text-[2rem] sm:text-[2.8rem] leading-[1.05] font-semibold !text-white" style={{ fontFamily: SERIF }}>
          Una CEO con seis empresas merece algo más que una lista de botones.
        </h2>
        <div className="mt-10 grid md:grid-cols-2 gap-8 items-start">
          <div>
            <p className={`text-[0.65rem] ${MAYUS} text-white/50`}>Antes</p>
            <div className="mt-3 mx-auto max-w-[280px] rounded-[1.6rem] border border-white/15 p-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-white/15" />
              <p className="mt-2 text-center text-[0.8rem] text-white/60">@valeriarios</p>
              <ul className="mt-3 space-y-1.5">
                {enlaces.map((e) => (
                  <li key={e} className="rounded-full bg-white/10 py-2 text-center text-[0.78rem] text-white/70">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-3 text-center text-sm text-white/50">Igual que la de cualquier otra cuenta. No sale en Google.</p>
          </div>
          <div>
            <p className={`text-[0.65rem] ${MAYUS}`} style={{ color: DORADO }}>
              Ahora
            </p>
            <ul className="mt-3 space-y-3 text-white/85">
              {[
                "Tu nombre como dirección: valeriarios.com. Te encuentran en Google y en las notas de prensa.",
                "Tus seis empresas con foto, historia y su botón directo: cursos, tienda, citas.",
                "Marcas, eventos y prensa te escriben con el motivo claro, no un “hola, info” perdido entre DMs.",
                "Sabes cuántas personas entran a cada empresa desde tu bio.",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <Check size={18} className="mt-0.5 shrink-0" style={{ color: DORADO }} /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
