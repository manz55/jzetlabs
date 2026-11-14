/*
 * Home como vitrina (reestructuración del 13 nov 2026):
 * Estilo de la portada llevado al resto: títulos grandes con una palabra a mano,
 * fotos grandes, mucho aire. Trabajos reales (con filtros) → … → Cómo trabajo.
 * Capturas: Plomería Danny y GomiDeli son sitios publicados; EFAMIC con nombres
 * de ejemplo; Maestros de Niños sin datos de niños.
 */
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Titulo } from "./Titulo";
import dannyDesk from "@/assets/portfolio/danny-desk.jpg";
import dannyMob from "@/assets/portfolio/danny-mob.jpg";
import gomiDesk from "@/assets/portfolio/gomideli-desk.jpg";
import gomiMob from "@/assets/portfolio/gomideli-mob.jpg";
import efamicDesk from "@/assets/portfolio/efamic-desk.jpg";
import efamicMob from "@/assets/portfolio/efamic-mob.jpg";
import maestrosDesk from "@/assets/portfolio/maestros-desk.jpg";
import maestrosMob from "@/assets/portfolio/maestros-mob-grupos.jpg";

/* ---------- marcos ---------- */

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
    cat: "pagina",
    texto: "Una página con fotos de sus trabajos reales, para que la gente lo encuentre y le escriba directo por WhatsApp o le llame. Con su propio dominio.",
    desk: dannyDesk,
    mob: dannyMob,
    url: "https://plomeriadanny.com",
    nota: "",
  },
  {
    nombre: "GomiDeli",
    tipo: "Tienda en línea",
    cat: "pagina",
    texto: "Su tienda en línea: los clientes ven las gomitas, arman su pedido y le llega directo a su WhatsApp.",
    desk: gomiDesk,
    mob: gomiMob,
    url: "https://gomideli-tienda.vercel.app",
    nota: "",
  },
  {
    nombre: "EFAMIC",
    tipo: "Sistema · Empresa metalmecánica",
    cat: "sistema",
    texto: "Antes la planilla se armaba a mano y tomaba de 3 a 5 días. Ahora cada quien marca desde su teléfono y la planilla sale sola. Cuando me piden un ajuste, se lo hago y queda subido.",
    desk: efamicDesk,
    mob: efamicMob,
    url: "",
    nota: "Sistema interno. Capturas con nombres de ejemplo.",
  },
  {
    nombre: "Maestros de Niños",
    tipo: "Sistema · Iglesia",
    cat: "sistema",
    texto: "Lo que el ministerio llevaba en papel ahora lo registran en la página: niños por grupo, asistencia del día y reportes, desde cualquier teléfono o compu.",
    desk: maestrosDesk,
    mob: maestrosMob,
    url: "",
    nota: "Sistema privado: protege los datos de los niños.",
  },
];

const FILTROS = [
  { id: "todos", texto: "Todos" },
  { id: "pagina", texto: "Páginas" },
  { id: "sistema", texto: "Sistemas" },
];

export function Trabajos() {
  const [filtro, setFiltro] = useState("todos");
  const lista = TRABAJOS.filter((t) => filtro === "todos" || t.cat === filtro);

  return (
    <section id="trabajos" className="bg-white py-20 sm:py-28 scroll-mt-16" aria-labelledby="trabajos-titulo">
      <div className="contenedor">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:items-end aparece">
          <Titulo id="trabajos-titulo" antes="Trabajos" acento="reales" cuenta={TRABAJOS.length} />
          <p className="text-suave text-[1.05rem] max-w-md lg:justify-self-end">
            Esto ya lo hice. Cada uno hecho a la medida de cómo trabaja ese negocio, ninguno es una plantilla. Lo puedo hacer para el suyo, y mejor.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-7 gap-y-2" role="group" aria-label="Filtrar trabajos">
          {FILTROS.map((f) => {
            const n = f.id === "todos" ? TRABAJOS.length : TRABAJOS.filter((t) => t.cat === f.id).length;
            const activo = filtro === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFiltro(f.id)}
                aria-pressed={activo}
                className={`text-[1.1rem] ${activo ? "text-tinta underline underline-offset-[6px] decoration-2 decoration-acento" : "text-suave hover:text-tinta"}`}
              >
                {f.texto}
                <sup className="ml-0.5 text-[0.7em]">{n}</sup>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-x-8 gap-y-14">
          {lista.map((t) => (
            <article key={t.nombre} className="group">
              <div className="flex items-center justify-between text-sm text-suave">
                <span>{t.tipo}</span>
                <span>{t.url ? "En línea" : "Privado"}</span>
              </div>
              <div className="mt-3 relative rounded-2xl bg-fondo overflow-hidden aspect-[16/11]">
                <img
                  src={t.desk}
                  alt={`${t.nombre} en la computadora`}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <Celular src={t.mob} alt={`${t.nombre} en el celular`} className="absolute bottom-4 right-4 w-[22%]" />
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[1.5rem] sm:text-[1.7rem]">{t.nombre}</h3>
                  <p className="mt-2 text-suave max-w-lg">{t.texto}</p>
                  {!t.url && <p className="mt-2 text-sm text-suave/80">{t.nota}</p>}
                </div>
                {t.url && (
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ver ${t.nombre} en vivo`}
                    className="shrink-0 grid place-items-center w-12 h-12 rounded-full bg-tinta text-white hover:bg-acento transition-colors"
                  >
                    <ArrowUpRight size={20} />
                  </a>
                )}
              </div>
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
    <section id="como-trabajo" className="py-20 sm:py-28 bg-fondo scroll-mt-16" aria-labelledby="como-titulo">
      <div className="contenedor">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:items-end aparece">
          <Titulo id="como-titulo" antes="Cómo" acento="trabajo" />
          <p className="text-suave text-[1.05rem] max-w-md lg:justify-self-end">
            Trato directo conmigo, de principio a fin. Usted me cuenta, yo lo construyo y yo le enseño cómo funciona. Si tiene alguna duda, no tenga pena, me pregunta.
          </p>
        </div>
        <ol className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {PASOS.map((p, i) => (
            <li key={p.titulo} className="border-t-2 border-tinta pt-5 aparece">
              <span className="font-[family-name:var(--font-titulo)] font-bold text-acento text-[3rem] leading-none">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-[1.25rem]">{p.titulo}</h3>
              <p className="mt-2 text-suave">{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
