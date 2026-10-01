import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { MessageCircle, FileText, Hammer, Rocket } from "lucide-react";

const STEPS = [
  {
    icon: MessageCircle,
    t: "Platicamos",
    d: "Me escribís por WhatsApp o nos echamos una llamada. Me contás qué hace tu negocio y qué te está quitando tiempo. Esto no cuesta nada.",
    color: "bg-sun",
  },
  {
    icon: FileText,
    t: "Te mando la propuesta",
    d: "Precio cerrado, tiempo de entrega y la forma de pago que te quede. Clarito y sin letra pequeña.",
    color: "bg-mint",
  },
  {
    icon: Hammer,
    t: "Lo construyo",
    d: "Te voy mandando avances para que lo veás crecer y opinés. Si algo no te late, lo cambio a tiempo.",
    color: "bg-lilac",
  },
  {
    icon: Rocket,
    t: "Lo subo al aire",
    d: "Lo publico, te doy todos los accesos, te enseño a usarlo y te quedan 30 días de soporte por cualquier cosa.",
    color: "bg-volt",
  },
];

export function Proceso() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 20 });
  const pinTop = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <section id="proceso" className="relative px-4 sm:px-6 py-20 scroll-mt-16">
      <div className="mx-auto max-w-4xl">
        <p className="section-num">05 — cómo trabajo</p>
        <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold">
          Cuatro pasos. <span className="serif-i font-normal text-cobalt">Cero sorpresas.</span>
        </h2>

        <div ref={ref} className="relative mt-14 pl-14 sm:pl-20">
          {/* el camino a mano, se va dibujando con el scroll */}
          <svg className="absolute left-4 sm:left-7 top-2 bottom-2 w-8 h-[calc(100%-1rem)]" viewBox="0 0 32 400" preserveAspectRatio="none" aria-hidden>
            <path d="M16 0 C 4 60, 28 110, 16 170 S 4 280, 16 330 S 26 380, 16 400" fill="none" stroke="rgba(23,22,28,.15)" strokeWidth={3} strokeDasharray="2 9" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <motion.path d="M16 0 C 4 60, 28 110, 16 170 S 4 280, 16 330 S 26 380, 16 400" fill="none" stroke="var(--color-tomato)" strokeWidth={3.5} strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ pathLength: progress }} />
          </svg>
          <motion.div
            className="absolute left-[18px] sm:left-[30px] w-6 h-6 -translate-y-1/2 rounded-full bg-tomato border-2 border-ink shadow-[2px_2px_0_var(--color-ink)]"
            style={{ top: pinTop }}
            aria-hidden
          />

          <ol className="space-y-8">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.li
                  key={s.t}
                  initial={{ opacity: 0, x: 30, rotate: i % 2 ? 1.5 : -1.5 }}
                  whileInView={{ opacity: 1, x: 0, rotate: i % 2 ? 0.6 : -0.6 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ type: "spring", stiffness: 140, damping: 16 }}
                  className="ink-card p-5 sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className={`grid place-items-center w-11 h-11 rounded-xl border-2 border-ink ${s.color} shrink-0`}>
                      <Icon size={20} strokeWidth={2.4} />
                    </span>
                    <div>
                      <p className="font-mono text-xs text-ink-3">paso {i + 1}</p>
                      <h3 className="text-[1.4rem] font-bold mt-0.5">{s.t}</h3>
                      <p className="mt-2 text-ink-2">{s.d}</p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
