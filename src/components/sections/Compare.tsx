/**
 * Compare — "Por qué elegirme"
 * Adaptado de Compare 2 (21st.dev/@designali-in/components/compare-2, demo id 8958).
 * Se conserva la estructura real del componente: dos columnas persona-checklist
 * (izquierda = elegime a mí, derecha = elegí el estándar del mercado), cada una
 * agrupada en categorías con bullets de check. El ícono `@aliimam/icons` del
 * original se sustituye por lucide-react (ya es dependencia del proyecto) y los
 * tokens `bg-primary`/`bg-secondary` de shadcn se sustituyen por el design system
 * de Jzet Labs. Los datos son reales: Q1,200 todo incluido vs Q1,500+ solo landing.
 */

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";

interface Category {
  title: string;
  points: string[];
}

const JZET_PRICE = "Q1,200";
const MARKET_PRICE = "Q1,500+";

const JZET_CATEGORIES: Category[] = [
  {
    title: "Precio todo incluido",
    points: [
      "Landing page completa por Q1,200",
      "Dominio incluido, sin cargos extra",
      "Precio cerrado desde la propuesta",
    ],
  },
  {
    title: "Proceso definido",
    points: [
      "5 pasos claros: contacto, propuesta, contrato, desarrollo, entrega",
      "Ves el avance en cada etapa",
      "Contrato corto que protege tu inversión",
    ],
  },
  {
    title: "Trato directo",
    points: [
      "Hablás conmigo, no con un vendedor",
      "Sin intermediarios ni coordinadores",
      "Respuesta directa por WhatsApp",
    ],
  },
];

const MARKET_CATEGORIES: Category[] = [
  {
    title: "Precio por partes",
    points: [
      "Landing page desde Q1,500, solo el diseño",
      "El dominio se cobra aparte",
      "La cotización puede variar sobre la marcha",
    ],
  },
  {
    title: "Proceso poco claro",
    points: [
      "Sin pasos ni tiempos definidos",
      "El avance es difícil de rastrear",
    ],
  },
  {
    title: "Intermediarios",
    points: [
      "Hablás con ventas, no con quien construye",
      "Coordinación extra entre áreas",
    ],
  },
];

const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.68rem",
  color: "var(--text-muted)",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

function ComparePanel({
  eyebrow,
  price,
  priceNote,
  categories,
  variant,
  cta,
}: {
  eyebrow: string;
  price: string;
  priceNote: string;
  categories: Category[];
  variant: "jzet" | "market";
  cta?: boolean;
}) {
  const isJzet = variant === "jzet";
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: isJzet ? 0 : 0.1 }}
      viewport={{ once: true }}
      className="flex flex-col gap-8 p-6 sm:p-8 md:p-10 lg:p-12"
      style={{
        background: isJzet ? "rgba(232,168,58,0.06)" : "var(--bg-surface)",
        border: isJzet ? "1px solid rgba(232,168,58,0.28)" : "1px solid var(--border)",
        borderRadius: "20px",
      }}
    >
      <div>
        <p style={{ ...LABEL, color: isJzet ? "var(--amber)" : "var(--text-muted)", marginBottom: "0.75rem" }}>
          {eyebrow}
        </p>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.25rem, 5vw, 3.25rem)",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: isJzet ? "var(--amber)" : "var(--text)",
            }}
          >
            {price}
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-2)" }}>
            {priceNote}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-7 sm:gap-8">
        {categories.map((cat) => (
          <div key={cat.title} className="flex flex-col gap-3.5">
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.01em",
              }}
            >
              {cat.title}
            </h3>
            <div className="flex flex-col gap-2.5">
              {cat.points.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <span
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 18,
                      height: 18,
                      marginTop: 2,
                      borderRadius: "50%",
                      background: isJzet ? "var(--amber)" : "rgba(255,255,255,0.12)",
                    }}
                  >
                    <Check size={11} strokeWidth={3} style={{ color: isJzet ? "#0b1520" : "var(--text-2)" }} />
                  </span>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {cta && (
        <a
          href="https://wa.me/50239915890?text=Hola%20Josh%2C%20vi%20tu%20portafolio%20y%20quiero%20una%20landing%20page"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start group mt-2"
          style={{
            background: "var(--amber)",
            color: "#0b1520",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "0.9rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            textDecoration: "none",
            transition: "box-shadow 0.2s, transform 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(232,168,58,0.35)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
            (e.currentTarget as HTMLElement).style.transform = "none";
          }}
        >
          Hablemos por WhatsApp
          <ArrowRight size={14} />
        </a>
      )}
    </motion.div>
  );
}

export function Compare() {
  return (
    <section
      id="por-que"
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
          className="mb-10 md:mb-14 max-w-2xl"
        >
          <SectionLabel text="por qué elegirme" />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--text)", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            Precio directo.<br />
            <span style={{ color: "var(--amber)" }}>Proceso definido.</span>
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--text-2)", lineHeight: 1.65 }}>
            Así se compara mi propuesta contra lo que suele ofrecer el mercado en Guatemala.
          </p>
        </motion.div>

        {/* Comparison grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          <ComparePanel
            eyebrow="Jzet Labs"
            price={JZET_PRICE}
            priceNote="todo incluido, sin cargos extra"
            categories={JZET_CATEGORIES}
            variant="jzet"
            cta
          />
          <ComparePanel
            eyebrow="Estándar del mercado"
            price={MARKET_PRICE}
            priceNote="solo la landing"
            categories={MARKET_CATEGORIES}
            variant="market"
          />
        </div>
      </div>
    </section>
  );
}
