import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";

const FAQS = [
  {
    q: "¿Por qué tan barato? ¿Dónde está el truco?",
    a: "No hay truco. Trabajo directo, sin oficina cara ni vendedores en medio, y uso herramientas que no cobran mensualidad. Eso me deja cobrarte justo.",
    color: "#ffd166",
  },
  {
    q: "¿Tengo que pagar algo cada mes?",
    a: "No es obligatorio. El hosting es gratis y lo único anual es el dominio, si decides tener uno (unos Q100). Si quieres que yo me encargue de los cambios, hay un plan opcional de Q200 al mes.",
    color: "#c4b5fd",
  },
  {
    q: "¿Cuánto se tarda?",
    a: "Depende de lo que lleve. Una landing anda entre 4 y 7 días hábiles; una tienda o un sistema, unas semanas. En la propuesta te doy la fecha.",
    color: "#8ce0c3",
  },
  {
    q: "¿Y si después quiero cambiar algo?",
    a: "Tienes una ronda de ajustes y 30 días de soporte incluidos. Si tiene panel de admin, muchas cosas las cambias tú solo. Y si prefieres que yo lo haga, está el plan de Q200 al mes.",
    color: "#d5f05b",
  },
  {
    q: "¿Cómo funcionan las cuotas?",
    a: "Arrancamos con el primer pago y lo demás lo vas dando mes a mes, hasta 4 cuotas sin recargo. El sitio vive en mi cuenta y con la última cuota te lo paso a tu nombre. Si pagas todo de una vez, 5% menos.",
    color: "#ff9f80",
  },
  {
    q: "No sé nada de tecnología, ¿igual puedo?",
    a: "Claro. La mayoría de mis clientes tampoco. Yo te explico todo en palabras normales y te dejo un manual con capturas.",
    color: "#a8c5ff",
  },
];

function Note({ q, a, color, i }: { q: string; a: string; color: string; i: number }) {
  const [flipped, setFlipped] = useState(false);
  const tilt = [-2.5, 1.8, -1.2, 2.4, -1.8, 1.2][i % 6];

  return (
    <motion.button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-expanded={flipped}
      initial={{ opacity: 0, y: 30, rotate: tilt * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ rotate: 0, y: -4 }}
      transition={{ type: "spring", stiffness: 180, damping: 15, delay: (i % 3) * 0.06 }}
      className="relative h-[230px] text-left [perspective:1000px]"
    >
      <motion.span
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        className="relative block w-full h-full [transform-style:preserve-3d]"
      >
        {/* frente */}
        <span
          className="absolute inset-0 flex flex-col justify-between p-5 border-2 border-ink shadow-[4px_4px_0_var(--color-ink)] [backface-visibility:hidden]"
          style={{ background: color, borderRadius: "4px 4px 18px 4px" }}
        >
          <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[3deg]" aria-hidden />
          <span className="font-display font-extrabold text-[1.35rem] leading-tight">{q}</span>
          <span className="flex items-center gap-1.5 hand text-[1.15rem] text-ink/70">
            <RotateCw size={14} /> toca para voltear
          </span>
        </span>
        {/* reverso */}
        <span
          className="absolute inset-0 flex flex-col p-5 bg-card border-2 border-ink shadow-[4px_4px_0_var(--color-ink)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ borderRadius: "4px 4px 4px 18px" }}
        >
          <span className="hand text-[1.25rem] leading-none" style={{ color: "var(--color-tomato)" }}>
            la respuesta:
          </span>
          <span className="mt-2 text-[0.98rem] text-ink-2 leading-relaxed">{a}</span>
        </span>
      </motion.span>
    </motion.button>
  );
}

export function Preguntas() {
  return (
    <section id="preguntas" className="relative px-4 sm:px-6 py-20 scroll-mt-16">
      <div className="mx-auto max-w-6xl">
        <p className="section-num">06 — preguntas</p>
        <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold max-w-3xl">
          Lo que casi todos me preguntan <span className="serif-i font-normal text-cobalt">antes de escribirme.</span>
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {FAQS.map((f, i) => (
            <Note key={f.q} {...f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
