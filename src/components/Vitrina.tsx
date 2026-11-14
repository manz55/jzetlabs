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
import { WA_HOLA } from "@/data/site";
import { IconoWhatsApp } from "./Secciones";

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

/* ---------- portada ---------- */

export function PortadaVitrina() {
  return (
    <section id="inicio" className="portada-papel border-b border-linea overflow-hidden">
      <div className="contenedor grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-12 items-center pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div>
          <p className="nota-mano text-acento text-[1.9rem]">Hola, soy Joshua.</p>
          <h1 className="mt-3 text-[2.4rem] sm:text-[3.1rem] lg:text-[3.35rem] leading-[1.04]">
            Hago páginas web y sistemas para negocios de Guatemala.
          </h1>
          <p className="mt-6 text-[1.1rem] sm:text-[1.18rem] text-texto max-w-xl">
            Ya lo hice para un plomero, una tienda, una empresa y una iglesia. Lo puedo hacer para su negocio, y mejor. Usted trata conmigo de principio a fin.
          </p>

          <dl className="mt-7 grid grid-cols-2 max-w-md rounded-xl border border-linea bg-white divide-x divide-linea">
            <div className="px-4 py-3">
              <dt className="text-[0.8rem] text-suave">Páginas web</dt>
              <dd className="font-[family-name:var(--font-titulo)] font-bold text-marino text-[1.45rem] leading-tight">
                <span className="text-[0.85rem] font-medium text-suave">desde </span>Q1,000
              </dd>
            </div>
            <div className="px-4 py-3">
              <dt className="text-[0.8rem] text-suave">Sistemas</dt>
              <dd className="font-[family-name:var(--font-titulo)] font-bold text-marino text-[1.45rem] leading-tight">
                <span className="text-[0.85rem] font-medium text-suave">desde </span>Q2,000
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-sm font-semibold text-acento">Pago único, sin mensualidades obligatorias.</p>

          <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3 [&>a]:whitespace-nowrap">
            <a href={WA_HOLA} target="_blank" rel="noopener noreferrer" className="btn btn-principal">
              <IconoWhatsApp /> Escribirme por WhatsApp
            </a>
            <a href="#trabajos" className="btn btn-secundario">
              Ver mis trabajos
            </a>
          </div>
        </div>

        {/* collage de trabajos reales */}
        <figure className="relative mx-auto w-full max-w-[580px] pb-6">
          <Navegador src={dannyDesk} alt="Página de Plomería Danny en la computadora" className="w-[86%]" />
          <Celular src={gomiMob} alt="Tienda en línea de GomiDeli en el celular" className="absolute bottom-0 right-0 w-[30%]" />
          <figcaption className="mt-3 pr-[32%] nota-mano text-[1.2rem] leading-tight text-suave">Trabajos reales: Plomería Danny y GomiDeli</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------- trabajos reales ---------- */

const TRABAJOS = [
  {
    nombre: "Plomería Danny",
    tipo: "Página web · Servicios",
    texto: "Fotos de trabajos reales, emergencias las 24 horas y botones directos a WhatsApp y llamada. Con dominio propio.",
    desk: dannyDesk,
    mob: dannyMob,
    url: "https://plomeriadanny.com",
    nota: "",
  },
  {
    nombre: "GomiDeli",
    tipo: "Tienda en línea",
    texto: "Catálogo de gomitas con fotos y precios, carrito y pedidos que le llegan por WhatsApp.",
    desk: gomiDesk,
    mob: gomiMob,
    url: "https://gomideli-tienda.vercel.app",
    nota: "",
  },
  {
    nombre: "EFAMIC",
    tipo: "Sistema · Empresa metalmecánica",
    texto: "Marcaje desde el celular con ubicación y huella, y planilla que se calcula sola. Antes, armarla tomaba de 3 a 5 días.",
    desk: efamicDesk,
    mob: efamicMob,
    url: "",
    nota: "Sistema interno. Capturas con nombres de ejemplo.",
  },
  {
    nombre: "Maestros de Niños",
    tipo: "Sistema · Iglesia",
    texto: "Registro de niños por grupo, asistencia del día y reportes, desde cualquier celular o computadora.",
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
          <p className="mt-3 text-white/80">Cuatro rubros distintos, cada uno con su propio diseño. Ninguno es una plantilla.</p>
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
  { titulo: "Platicamos", texto: "Por WhatsApp o en una reunión sin costo. Me cuenta cómo funciona su negocio y qué necesita." },
  { titulo: "Le propongo", texto: "Opciones con precio y tiempo claros, por escrito. Lo que se pacta es lo que se entrega." },
  { titulo: "Lo construyo", texto: "Le muestro avances para que opine antes de terminar. Usted habla siempre conmigo." },
  { titulo: "Se lo entrego y le explico", texto: "Le enseño a usarlo y le doy soporte. Si después quiere algo más, se lo cotizo antes." },
];

export function ComoTrabajo() {
  return (
    <section className="py-16 sm:py-24 bg-fondo border-y border-linea" aria-labelledby="como-titulo">
      <div className="contenedor grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-start">
        <div className="aparece">
          <p className="etiqueta">Cómo trabajo</p>
          <h2 id="como-titulo" className="mt-3 text-[1.75rem] sm:text-[2.2rem]">
            Una sola persona, de principio a fin.
          </h2>
          <div className="mt-6 flex items-center gap-4">
            {/* FOTO: cuando Josh mande su foto, cambiar este círculo por <img … /> */}
            <div className="grid place-items-center w-20 h-20 shrink-0 rounded-full bg-marino text-white font-[family-name:var(--font-titulo)] font-bold text-[1.9rem]" aria-hidden>
              J
            </div>
            <p className="text-suave">Sin intermediarios ni centros de llamadas: yo escucho, yo lo construyo y yo le doy soporte.</p>
          </div>
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
