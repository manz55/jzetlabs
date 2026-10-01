import { motion } from "framer-motion";
import { Squiggle } from "./Doodles";

const ROWS = [
  { k: "Precio", us: "Cerrado desde el inicio y sin mensualidades", them: "Cotización que va creciendo, y muchas veces se cobra cada año" },
  { k: "Quién te atiende", us: "Yo, el mismo que lo construye", them: "Un vendedor que pasa el mensaje" },
  { k: "Forma de pago", us: "Pago único o hasta 4 cuotas sin recargo", them: "50% adelantado y 50% al final, sin opciones" },
  { k: "Dominio", us: "Vos decidís: con o sin", them: "Obligatorio y cobrado aparte" },
  { k: "Tiempo", us: "Según la carga real, y si no hay prisa sale más barato", them: "\"Para la otra semana\" (pero de otro mes)" },
  { k: "Después de entregar", us: "Ronda de ajustes + 30 días de soporte incluidos", them: "Cada cambio se cobra" },
  { k: "Tu proyecto", us: "Es tuyo: te doy accesos y código", them: "Quedás amarrado al que lo hizo" },
];

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number) => ({ pathLength: 1, opacity: 1, transition: { delay: 0.15 + i * 0.08, duration: 0.45 } }),
};

export function Comparar() {
  return (
    <section id="comparar" className="relative px-4 sm:px-6 py-20 scroll-mt-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="section-num">04 — comparar</p>
            <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold">
              Lo de siempre <span className="serif-i font-normal">vs.</span>
              <br />
              <span className="marker">como lo hago yo.</span>
            </h2>
            <p className="mt-5 text-ink-2 text-[1.08rem] max-w-md">
              No es para hablar mal de nadie. Es que ya me tocó escuchar a varios clientes contarme cómo les fue antes, y la idea
              es que conmigo no pase.
            </p>
            <Squiggle className="mt-6 w-32 h-6 text-cobalt" />
          </div>

          <div className="ink-card overflow-hidden">
            <div className="grid grid-cols-[0.9fr_1.2fr_1.2fr] text-sm sm:text-base border-b-2 border-ink">
              <div className="p-3 sm:p-4" />
              <div className="p-3 sm:p-4 bg-volt border-l-2 border-ink font-display font-extrabold">Jzet Labs</div>
              <div className="p-3 sm:p-4 bg-paper border-l-2 border-ink font-display font-bold text-ink-2">Lo de siempre</div>
            </div>
            {ROWS.map((r, i) => (
              <motion.div
                key={r.k}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className={`grid grid-cols-[0.9fr_1.2fr_1.2fr] text-[0.86rem] sm:text-[0.98rem] ${i < ROWS.length - 1 ? "border-b-2 border-dashed border-ink/20" : ""}`}
              >
                <div className="p-3 sm:p-4 font-display font-bold leading-snug">{r.k}</div>
                <div className="p-3 sm:p-4 border-l-2 border-ink flex gap-2 items-start bg-volt/15">
                  <motion.svg viewBox="0 0 32 32" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-cobalt mt-0.5" fill="none" stroke="currentColor" strokeWidth={3.4} strokeLinecap="round">
                    <motion.path d="M5 17c3 2 6 5 8 9 4-9 9-16 15-22" variants={draw} custom={i} />
                  </motion.svg>
                  <span className="leading-snug">{r.us}</span>
                </div>
                <div className="p-3 sm:p-4 border-l-2 border-ink flex gap-2 items-start text-ink-2">
                  <motion.svg viewBox="0 0 32 32" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-tomato mt-0.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
                    <motion.path d="M7 6c6 7 12 13 19 21" variants={draw} custom={i + 0.5} />
                    <motion.path d="M25 6c-7 6-12 12-18 21" variants={draw} custom={i + 1} />
                  </motion.svg>
                  <span className="leading-snug">{r.them}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
