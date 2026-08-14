/**
 * Faq — Preguntas frecuentes
 * Reemplaza el "FAQ roller" por un grid de tarjetas estilo Features 8
 * (21st.dev/@meschacirung/components/features-8: grid de features con
 * ícono + título + descripción). No se pudo traer el código real del
 * componente hoy (límite diario del MCP de 21st.dev agotado) — esta es
 * una recreación propia fiel al patrón de esa preview, a ajustar cuando
 * se pueda traer el componente original.
 */

import { motion } from "framer-motion";
import { Clock, Package, CreditCard, RefreshCw, MapPin } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";

interface FaqItem {
  icon: typeof Clock;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    icon: Clock,
    question: "¿Cuánto tarda un proyecto?",
    answer: "Una landing page típica está lista en 3 a 5 días hábiles desde que arrancamos el desarrollo.",
  },
  {
    icon: Package,
    question: "¿Qué incluye el precio de Q1,200?",
    answer: "Landing page completa y dominio incluido, sin cargos extra. El precio queda cerrado desde la propuesta.",
  },
  {
    icon: CreditCard,
    question: "¿Cómo es el proceso de pago?",
    answer: "50% de anticipo para arrancar y 50% contra entrega del sitio terminado.",
  },
  {
    icon: RefreshCw,
    question: "¿Puedo pedir cambios después de la entrega?",
    answer: "Sí, incluyo una ronda de ajustes gratis después de la entrega. Cambios más grandes se cotizan aparte.",
  },
  {
    icon: MapPin,
    question: "¿Trabajás con negocios fuera de Ciudad de Guatemala?",
    answer: "Sí, todo el proceso es remoto — trabajo con negocios de cualquier parte de Guatemala sin problema.",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      style={{ background: "var(--bg-surface)" }}
      className="w-full py-16 sm:py-20 md:py-24 lg:py-28 px-6 sm:px-10 md:px-16"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-14 max-w-2xl"
        >
          <SectionLabel text="preguntas frecuentes" />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--text)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            Antes de escribirme,<br />
            <span style={{ color: "var(--amber)" }}>esto ya lo sabés.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FAQ_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
                viewport={{ once: true }}
                className="flex flex-col gap-4 p-6 sm:p-7"
                style={{ background: "var(--bg-base)", border: "1px solid var(--border)", borderRadius: "16px" }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ width: 40, height: 40, borderRadius: 10, background: "var(--amber-dim)", border: "1px solid var(--border-amber)" }}
                >
                  <Icon size={18} style={{ color: "var(--amber)" }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.02rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                  {item.question}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.65 }}>
                  {item.answer}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
