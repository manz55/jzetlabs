/**
 * Portfolio — Elastic Gallery (acordeón horizontal)
 * Adaptado del patrón real de "Elastic Gallery" (21st.dev/@daiwiikharihar/
 * components/elastic-gallery, demo id 9859): acordeón horizontal de imágenes
 * donde la tarjeta activa se expande con overlay degradado, categoría en
 * chip, título y CTA, mientras las demás se colapsan. No se pudo traer el
 * código real hoy (límite diario del MCP agotado) — esta es una recreación
 * propia fiel a la preview pública, a ajustar cuando se pueda traer el
 * componente original. Fondo: --bg-base. Imágenes: capturas reales de cada
 * proyecto (src/assets/portfolio/), comprimidas a JPEG ~1400px con sips.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, MapPin, Code2 } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import plomeriaDannyImg from "@/assets/portfolio/plomeria-danny.jpg";
import proyectoRegistroImg from "@/assets/portfolio/proyecto-registro.jpg";
import coderImg from "@/assets/portfolio/coder.jpg";

interface Project {
  id: string;
  name: string;
  category: string;
  location?: string;
  description: string;
  stack: string[];
  url?: string;
  image: string;
}

const PROJECTS: Project[] = [
  {
    id: "plomeria-danny",
    name: "Plomería Danny",
    category: "Landing Page",
    location: "Ciudad de Guatemala",
    description:
      "Sitio web para plomería residencial e industrial en Ciudad de Guatemala. Dark-themed, con galería de fotos y videos reales de trabajos terminados. Construido con HTML, CSS y JS vanilla + GSAP ScrollTrigger para animaciones al hacer scroll.",
    stack: ["HTML", "CSS", "JS", "GSAP", "Tailwind"],
    url: "#",
    image: plomeriaDannyImg,
  },
  {
    id: "proyecto-registro",
    name: "Proyecto Registro",
    category: "App Web",
    description:
      "Sistema de registro y control de asistencia para ministerio infantil. Organiza niños por equipos y grupos de edad, con búsqueda por nombre, encargados por día y padrón completo.",
    stack: [],
    image: proyectoRegistroImg,
  },
  {
    id: "coder",
    name: "Coder",
    category: "Asistente de IA",
    description:
      "Asistente de voz con IA para conversación en tiempo real. Podés hablar o escribir, adjuntar fotos o archivos, con transcripción en vivo de la conversación.",
    stack: [],
    image: coderImg,
  },
];

const ProjectCard = ({
  project,
  isActive,
  onClick,
}: {
  project: Project;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      layout
      animate={{ flexGrow: isActive ? 3.5 : 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
      onClick={onClick}
      className="relative overflow-hidden cursor-pointer flex-shrink-0"
      style={{
        borderRadius: "16px",
        minWidth: 0,
        border: isActive ? "1px solid var(--border-amber)" : "1px solid var(--border)",
      }}
    >
      {/* Stock image background */}
      <img
        src={project.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: isActive
            ? "linear-gradient(to top, rgba(16,16,16,0.93) 40%, rgba(16,16,16,0.3) 100%)"
            : "linear-gradient(to top, rgba(16,16,16,0.85), rgba(16,16,16,0.5))",
          transition: "all 0.4s ease",
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
        <motion.span
          animate={{ opacity: 1 }}
          className="self-start"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--amber)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "0.6rem",
            padding: "0.25rem 0.65rem",
            borderRadius: 99,
            background: "var(--amber-dim)",
            border: "1px solid var(--border-amber)",
            whiteSpace: "nowrap",
          }}
        >
          {project.category}
        </motion.span>

        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: isActive ? "clamp(1.4rem, 3vw, 2.2rem)" : "1rem",
            color: "var(--text)",
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
            whiteSpace: isActive ? "normal" : "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            transition: "font-size 0.3s ease",
          }}
        >
          {project.name}
        </h3>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="overflow-hidden"
            >
              {project.location && (
                <div className="flex items-center gap-1.5 mt-2" style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-2)" }}>
                  <MapPin size={11} />
                  {project.location}
                </div>
              )}
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "rgba(232,227,218,0.75)", lineHeight: 1.65, marginTop: "0.75rem", maxWidth: "480px" }}>
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.stack.map((tech) => (
                  <span key={tech} style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-2)", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "0.2rem 0.55rem" }}>
                    {tech}
                  </span>
                ))}
              </div>
              {project.url && project.url !== "#" && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 mt-5 group"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    color: "#141414",
                    background: "var(--amber)",
                    padding: "0.55rem 1.1rem",
                    borderRadius: 8,
                    textDecoration: "none",
                  }}
                >
                  Ver sitio
                  <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!isActive && (
          <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem", opacity: 0.4 }}>
            <Code2 size={11} style={{ color: "var(--amber)" }} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export function Portfolio() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);

  return (
    <section
      id="portafolio"
      style={{ background: "var(--bg-base)" }}
      className="w-full py-16 sm:py-20 md:py-24 lg:py-28 px-6 sm:px-10 md:px-16"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-12"
        >
          <SectionLabel text="portafolio" />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--text)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            Proyectos reales,<br />
            <span style={{ color: "var(--amber)" }}>en producción.</span>
          </h2>
        </motion.div>

        {/* Elastic gallery */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex gap-3"
          style={{ height: "clamp(340px, 52vh, 480px)" }}
        >
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isActive={activeId === project.id}
              onClick={() => setActiveId(project.id)}
            />
          ))}
        </motion.div>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "1rem", textAlign: "right" }}>
          toca un proyecto para ver detalles
        </p>
      </div>
    </section>
  );
}
