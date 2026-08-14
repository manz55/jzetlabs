/**
 * PrismaHero — adaptado para Jzet Labs
 * Fuente original: 21st.dev/@rahil1202/prisma-hero (id 12200)
 *
 * Layout fix: sin rounded corners (eliminan el efecto de "tarjeta en negro"),
 * hero verdaderamente full-bleed edge-to-edge.
 * Tipografía: Space Grotesk para headline, Inter para description.
 */

import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

/* ── WordsPullUp ─────────────────────────────────── */
interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({
  text,
  className = "",
  showAsterisk = false,
  style,
}: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ── WordsPullUpMultiStyle ───────────────────────── */
interface Segment {
  text: string;
  className?: string;
}
interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
}

export const WordsPullUpMultiStyle = ({
  segments,
  className = "",
  style,
}: WordsPullUpMultiStyleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
          className={`inline-block ${w.className ?? ""}`}
          style={{ marginRight: "0.25em" }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};

/* ── PrismaHero ──────────────────────────────────── */
const PrismaHero = ({ id = "hero" }: { id?: string }) => {
  return (
    /* FIX: sin rounded corners, true full-bleed edge-to-edge */
    <section id={id} className="relative h-screen w-full overflow-hidden">

      {/* Video de fondo cinemático */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
      />

      {/* Ruido de película */}
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.6] mix-blend-overlay" />

      {/* Duotono frío — preserva la calidez del video sin forzar azul puro */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "rgba(9, 20, 50, 0.50)", mixBlendMode: "color" }}
      />

      {/* Gradiente de oscurecimiento — más ligero arriba, más oscuro abajo */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/5 to-black/80" />

      {/* ── Contenido hero — anchored bottom, full width ─── */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 sm:px-10 md:px-16 lg:px-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8">

          {/* Wordmark grande — lado izquierdo en desktop */}
          <div className="flex-shrink-0">
            <h1
              className="font-semibold leading-[0.85] tracking-[-0.06em]"
              style={{
                fontSize: "clamp(4.5rem, 20vw, 20rem)",
                color: "#E1E0CC",
                fontFamily: "var(--font-heading)",
              }}
            >
              <WordsPullUp text="Jzet" />
            </h1>
          </div>

          {/* Headline + Descripción + CTA — lado derecho en desktop */}
          <div
            className="flex flex-col gap-4 pb-4 md:pb-10 md:max-w-xs lg:max-w-sm xl:max-w-md"
          >
            {/* Headline — Space Grotesk, no mono */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                color: "#E1E0CC",
              }}
            >
              Construyo sitios que{" "}
              <span style={{ color: "#e8a83a" }}>trabajan para ti.</span>
            </motion.h2>

            {/* Description — Inter body font */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.88rem, 1.5vw, 1rem)",
                color: "rgba(225, 224, 204, 0.75)",
                lineHeight: 1.6,
              }}
            >
              Estudiante de ingeniería en sistemas con clientes reales en
              producción. Landing pages, sistemas web y tiendas en línea para
              negocios locales en Guatemala.
            </motion.p>

            {/* CTA */}
            <motion.a
              href="#portafolio"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              className="group inline-flex items-center gap-2 self-start rounded-full py-1 pl-5 pr-1 font-medium transition-all hover:gap-3"
              style={{
                background: "#e8a83a",
                color: "#0b1520",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              Ver mi trabajo
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                style={{ background: "#0b1520" }}
              >
                <ArrowRight className="h-4 w-4" style={{ color: "#e8a83a" }} />
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PrismaHero };
