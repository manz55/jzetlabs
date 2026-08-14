/**
 * Process — Cómo trabajo
 * Adaptado del patrón real de "How It Works" (21st.dev/@chamaac/components/
 * how-it-works, demo id 19861): sección de proceso paso a paso con tarjetas
 * conectadas por una línea vertical. No se pudo traer el código real hoy
 * (límite diario del MCP agotado) — esta es una recreación propia fiel a la
 * preview pública, a ajustar cuando se pueda traer el componente original.
 * Fondo: --bg-surface.
 */

import { motion } from "framer-motion";
import { MessageCircle, FileText, FileSignature, Code2, Rocket } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";

const STEPS = [
  { num: "01", icon: MessageCircle, title: "Contacto",       desc: "Hablamos de qué necesitás: qué tiene que hacer tu sitio, a quién va dirigido, cuándo lo necesitás." },
  { num: "02", icon: FileText,      title: "Propuesta",      desc: "Te mando una propuesta clara: alcance, precio exacto, tiempo estimado. Sin letra chica." },
  { num: "03", icon: FileSignature, title: "Contrato corto", desc: "Firmamos un acuerdo simple que protege tu inversión y define mis responsabilidades." },
  { num: "04", icon: Code2,         title: "Desarrollo",     desc: "Construyo el sitio con actualizaciones regulares. Podés ver el avance en todo momento." },
  { num: "05", icon: Rocket,        title: "Entrega",        desc: "Lanzamos, te entrego todos los accesos y te explico cómo funciona tu nuevo sitio." },
];

export function Process() {
  return (
    <section
      id="proceso"
      style={{ background: "var(--bg-surface)" }}
      className="w-full py-16 sm:py-20 md:py-24 lg:py-28 px-6 sm:px-10 md:px-16"
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true }}
          className="mb-14 md:mb-20"
        >
          <SectionLabel text="cómo trabajo" />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--text)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            Proceso definido.<br />
            <span style={{ color: "var(--amber)" }}>Sin sorpresas.</span>
          </h2>
        </motion.div>

        {/* Timeline vertical, tarjetas conectadas */}
        <div className="relative">
          {/* Línea conectora */}
          <div
            className="absolute top-0 bottom-0"
            style={{ left: 23, width: 1, background: "var(--border)" }}
          />

          <div className="flex flex-col gap-8 md:gap-10">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
                  viewport={{ once: true }}
                  className="relative flex items-start gap-5 md:gap-7"
                >
                  {/* Nodo numerado */}
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "var(--bg-base)",
                      border: "1px solid var(--border-amber)",
                      zIndex: 1,
                    }}
                  >
                    <Icon size={19} style={{ color: "var(--amber)" }} />
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 flex flex-col gap-2 p-6"
                    style={{ background: "var(--bg-base)", border: "1px solid var(--border)", borderRadius: 14 }}
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--amber)", opacity: 0.75 }}>
                        {step.num}
                      </span>
                      <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>
                        {step.title}
                      </p>
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.65 }}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
