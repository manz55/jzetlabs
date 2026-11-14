/*
 * Home como vitrina (reestructuración del 13 nov 2026):
 * Portada con precio al frente y trabajos reales a la vista → Trabajos reales
 * (sección oscura) → … → Cómo trabajo.
 * Capturas: Plomería Danny y GomiDeli son sitios publicados; EFAMIC con nombres
 * de ejemplo; Maestros de Niños sin datos de niños.
 */
import { ArrowUpRight } from "lucide-react";
import dannyDesk from "@/assets/portfolio/danny-desk.jpg";
import dannyMob from "@/assets/portfolio/danny-mob.jpg";
import gomiDesk from "@/assets/portfolio/gomideli-desk.jpg";
import gomiMob from "@/assets/portfolio/gomideli-mob.jpg";
import efamicDesk from "@/assets/portfolio/efamic-desk.jpg";
import efamicMob from "@/assets/portfolio/efamic-mob.jpg";
import maestrosDesk from "@/assets/portfolio/maestros-desk.jpg";
import maestrosMob from "@/assets/portfolio/maestros-mob-grupos.jpg";

/* ---------- marcos ---------- */

function Navegador({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`rounded-lg border border-linea bg-white overflow-hidden shadow-[0_18px_40px_-22px_rgba(11,37,69,.45)] ${className}`}>
      <div className="flex items-center gap-1.5 px-2.5 h-6 bg-fondo border-b border-linea" aria-hidden>
        <span className="w-2 h-2 rounded-full bg-[#e5e7eb]" />
        <span className="w-2 h-2 rounded-full bg-[#e5e7eb]" />
        <span className="w-2 h-2 rounded-full bg-[#e5e7eb]" />
      </div>
      <img src={src} alt={alt} className="block w-full aspect-[16/10] object-cover object-top" loading="lazy" />
    </div>
  );
}

function Celular({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`rounded-[1.1rem] border-[4px] border-tinta bg-tinta overflow-hidden shadow-[0_20px_40px_-16px_rgba(11,37,69,.6)] ${className}`}>
      <img src={src} alt={alt} className="block w-full aspect-[9/19] object-cover object-top rounded-[0.8rem]" loading="lazy" />
    </div>
  );
}

/* ---------- trabajos reales ---------- */

const TRABAJOS = [
  {
    nombre: "Plomería Danny",
    tipo: "Página web · Servicios",
    texto: "Una página con fotos de sus trabajos reales, para que la gente lo encuentre y le escriba directo por WhatsApp o le llame. Con su propio dominio.",
    desk: dannyDesk,
    mob: dannyMob,
    url: "https://plomeriadanny.com",
    nota: "",
  },
  {
    nombre: "GomiDeli",
    tipo: "Tienda en línea",
    texto: "Su tienda en línea: los clientes ven las gomitas, arman su pedido y le llega directo a su WhatsApp.",
    desk: gomiDesk,
    mob: gomiMob,
    url: "https://gomideli-tienda.vercel.app",
    nota: "",
  },
  {
    nombre: "EFAMIC",
    tipo: "Sistema · Empresa metalmecánica",
    texto: "Antes la planilla se armaba a mano y tomaba de 3 a 5 días. Ahora cada quien marca desde su teléfono y la planilla sale sola. Cuando me piden un ajuste, se lo hago y queda subido.",
    desk: efamicDesk,
    mob: efamicMob,
    url: "",
    nota: "Sistema interno. Capturas con nombres de ejemplo.",
  },
  {
    nombre: "Maestros de Niños",
    tipo: "Sistema · Iglesia",
    texto: "Lo que el ministerio llevaba en papel ahora lo registran en la página: niños por grupo, asistencia del día y reportes, desde cualquier teléfono o compu.",
    desk: maestrosDesk,
    mob: maestrosMob,
    url: "",
    nota: "Sistema privado: protege los datos de los niños.",
  },
];

export function Trabajos() {
  return (
    <section id="trabajos" className="bg-marino text-white py-16 sm:py-24 scroll-mt-16" aria-labelledby="trabajos-titulo">
      <div className="contenedor">
        <div className="max-w-2xl aparece">
          <p className="etiqueta !text-[#7fd1a8]">Trabajos reales</p>
          <h2 id="trabajos-titulo" className="mt-3 text-white text-[1.85rem] sm:text-[2.5rem]">
            Esto ya lo hice. Lo puedo hacer para su negocio, y mejor.
          </h2>
          <p className="mt-3 text-white/80">Cuatro rubros distintos, cada uno hecho a la medida de cómo trabaja ese negocio. Ninguno es una plantilla.</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8 lg:gap-10">
          {TRABAJOS.map((t) => (
            <article key={t.nombre} className="aparece">
              <div className="relative rounded-2xl bg-white/[0.06] border border-white/10 p-5 sm:p-6 pb-8">
                <Navegador src={t.desk} alt={`${t.nombre} en la computadora`} className="w-[82%]" />
                <Celular src={t.mob} alt={`${t.nombre} en el celular`} className="absolute bottom-4 right-5 w-[26%]" />
              </div>
              <p className="mt-5 text-[0.8rem] font-semibold uppercase tracking-wider text-[#7fd1a8]">{t.tipo}</p>
              <h3 className="mt-1 text-white text-[1.35rem]">{t.nombre}</h3>
              <p className="mt-2 text-white/80">{t.texto}</p>
              {t.url ? (
                <a href={t.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 font-semibold text-white underline underline-offset-4 hover:text-[#7fd1a8]">
                  Ver en vivo <ArrowUpRight size={17} />
                </a>
              ) : (
                <p className="mt-3 text-sm text-white/60">{t.nota}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- cómo trabajo ---------- */

const PASOS = [
  { titulo: "Platicamos", texto: "Me cuenta cómo trabaja hoy y qué le gustaría que fuera más fácil. Por WhatsApp o en persona, sin costo." },
  { titulo: "Le propongo", texto: "Le paso opciones con precio y tiempo claros, por escrito, para que usted decida con calma." },
  { titulo: "Lo construyo", texto: "Le voy enseñando avances. Usted me dice qué tal lo ve y, si hay que hacerle un ajuste, se lo hago. De eso no hay pena." },
  { titulo: "Se lo entrego y le enseño", texto: "Le enseño cómo funciona y quedo a la orden para cualquier cosa. Si después quiere algo nuevo, se lo cotizo antes." },
];

export function ComoTrabajo() {
  return (
    <section className="py-16 sm:py-24 bg-fondo border-y border-linea" aria-labelledby="como-titulo">
      <div className="contenedor grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-start">
        <div className="aparece">
          <p className="etiqueta">Cómo trabajo</p>
          <h2 id="como-titulo" className="mt-3 text-[1.75rem] sm:text-[2.2rem]">
            Trato directo conmigo, de principio a fin.
          </h2>
          <p className="mt-3 text-suave">Sin intermediarios: usted me cuenta, yo lo construyo y yo le enseño cómo funciona. Si tiene alguna duda, no tenga pena, me pregunta.</p>
        </div>
        <ol className="grid sm:grid-cols-2 gap-5">
          {PASOS.map((p, i) => (
            <li key={p.titulo} className="rounded-xl bg-white border border-linea p-5 aparece">
              <span className="font-[family-name:var(--font-titulo)] font-bold text-acento text-[1.6rem] leading-none">{i + 1}</span>
              <h3 className="mt-2 text-[1.1rem]">{p.titulo}</h3>
              <p className="mt-1.5 text-suave text-[0.97rem]">{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
