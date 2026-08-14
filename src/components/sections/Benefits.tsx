/**
 * Benefits — Beneficios de estar conmigo
 * Reemplaza la sección "Construyendo mi propio negocio" (bio + code snippet)
 * por un bento grid de beneficios, adaptado del patrón real de "Bento"
 * (21st.dev/@kinfe123/components/bento, demo id 6541). No se pudo traer el
 * código real hoy (límite diario del MCP agotado) — esta es una recreación
 * propia fiel al patrón bento, a ajustar cuando se pueda traer el componente
 * original. Fondo: --bg-base.
 */

import { motion } from "framer-motion";
import { MessageSquare, Lock, Zap, RefreshCw, MapPinned, GraduationCap } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";

const CARD: React.CSSProperties = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: "18px",
};

export function Benefits() {
  return (
    <section
      id="beneficios"
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
          <SectionLabel text="beneficios" />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--text)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            Esto es lo que ganás<br />
            <span style={{ color: "var(--amber)" }}>al trabajar conmigo.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(160px,auto)]">

          {/* Card 1 — Trato directo, grande */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="sm:col-span-2 p-7 md:p-8 flex flex-col justify-between gap-6"
            style={{ ...CARD, background: "var(--amber-dim)", borderColor: "var(--border-amber)" }}
          >
            <MessageSquare size={26} style={{ color: "var(--amber)" }} />
            <div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
                Hablás directo conmigo.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 480 }}>
                Sin vendedores ni coordinadores en el medio. Soy tu contacto único de principio a fin, por WhatsApp.
              </p>
            </div>
          </motion.div>

          {/* Card 2 — Precio cerrado */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            viewport={{ once: true }}
            className="p-7 flex flex-col justify-between gap-5"
            style={CARD}
          >
            <Lock size={22} style={{ color: "var(--amber)" }} />
            <div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", marginBottom: "0.4rem" }}>
                Precio cerrado.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                Q1,200 desde la propuesta. Sin sorpresas ni cargos que aparecen a mitad de camino.
              </p>
            </div>
          </motion.div>

          {/* Card 3 — Entrega rápida */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="p-7 flex flex-col justify-between gap-5"
            style={CARD}
          >
            <Zap size={22} style={{ color: "var(--amber)" }} />
            <div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", marginBottom: "0.4rem" }}>
                Entrega rápida.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                3 a 5 días hábiles desde que arrancamos el desarrollo.
              </p>
            </div>
          </motion.div>

          {/* Card 4 — Ajustes incluidos */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            className="p-7 flex flex-col justify-between gap-5"
            style={CARD}
          >
            <RefreshCw size={22} style={{ color: "var(--amber)" }} />
            <div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", marginBottom: "0.4rem" }}>
                Ajustes incluidos.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                Una ronda de ajustes gratis después de la entrega.
              </p>
            </div>
          </motion.div>

          {/* Card 5 — Estudiante con clientes reales, ancho */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="sm:col-span-2 lg:col-span-2 p-7 md:p-8 flex flex-col justify-between gap-5"
            style={CARD}
          >
            <GraduationCap size={22} style={{ color: "var(--amber)" }} />
            <div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", marginBottom: "0.4rem" }}>
                Estudiante con clientes reales.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 480 }}>
                Estudio ingeniería en sistemas en Guatemala y construí mi propio negocio de desarrollo web freelance. No cobro por promesas — cobro por resultados que ya tengo en producción.
              </p>
            </div>
          </motion.div>

          {/* Card 6 — Cobertura remota */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            viewport={{ once: true }}
            className="p-7 flex flex-col justify-between gap-5"
            style={CARD}
          >
            <MapPinned size={22} style={{ color: "var(--amber)" }} />
            <div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", marginBottom: "0.4rem" }}>
                Cobertura remota.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                Trabajo con negocios de cualquier parte de Guatemala, no solo Ciudad de Guatemala.
              </p>
            </div>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 md:mt-12"
        >
          <a
            href="https://wa.me/50239915890?text=Hola%20Josh%2C%20quiero%20saber%20más%20sobre%20tu%20trabajo"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--amber)",
              color: "#141414",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "0.9rem",
              padding: "0.8rem 1.75rem",
              borderRadius: "8px",
              textDecoration: "none",
              transition: "box-shadow 0.2s, transform 0.15s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px var(--amber-glow)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.transform = "none";
            }}
          >
            Hablemos
          </a>
        </motion.div>
      </div>
    </section>
  );
}
