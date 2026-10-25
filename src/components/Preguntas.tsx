/*
 * Preguntas: 4 notitas que se voltean en 3D (CSS). anime.js solo las hace caer.
 */
import { useState } from "react";
import { RotateCw } from "lucide-react";
import { useAlAparecer } from "@/lib/anime";

const FAQS = [
  {
    q: "¿Tengo que pagar algo cada mes?",
    a: "No. Q0 al mes, garantizado. Lo único aparte: el dominio si quieres uno (unos Q100 al año) y la comisión del banco si vendes con tarjeta. El plan de cambios de Q200 es opcional.",
    color: "#ffd166",
    rot: -2.5,
  },
  {
    q: "¿Cuánto se tarda?",
    a: "Una página exprés, 1–2 días. Una landing, 2–4. Una tienda, 7–12. Un sistema, 12–25. Son días hábiles desde que me pasas tus textos y fotos.",
    color: "#8ce0c3",
    rot: 1.8,
  },
  {
    q: "¿Cómo funcionan las cuotas?",
    a: "Arrancamos con el primer pago y lo demás lo vas dando mes a mes, hasta 4 cuotas sin recargo. Con la última te paso todo a tu nombre. Si pagas de una vez, 3% menos.",
    color: "#c4b5fd",
    rot: -1.2,
  },
  {
    q: "No sé nada de tecnología, ¿igual puedo?",
    a: "Claro. La mayoría de mis clientes tampoco. Te explico todo en palabras normales y te dejo un manual con capturas.",
    color: "#ff9f80",
    rot: 2.4,
  },
];

function Nota({ q, a, color, rot }: (typeof FAQS)[number]) {
  const [vuelta, setVuelta] = useState(false);
  return (
    <button type="button" onClick={() => setVuelta((v) => !v)} aria-expanded={vuelta} className="nota relative h-[230px] text-left [perspective:1000px]" style={{ ["--rot" as string]: `${rot}deg` }}>
      <span className={`relative block w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${vuelta ? "[transform:rotateY(180deg)]" : ""}`}>
        <span className="absolute inset-0 flex flex-col justify-between p-5 border-2 border-ink shadow-[4px_4px_0_var(--color-ink)] [backface-visibility:hidden]" style={{ background: color, borderRadius: "4px 4px 18px 4px" }}>
          <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[3deg]" aria-hidden />
          <span className="font-display font-extrabold text-[1.35rem] leading-tight">{q}</span>
          <span className="flex items-center gap-1.5 hand text-[1.15rem] text-ink/70">
            <RotateCw size={14} /> toca para voltear
          </span>
        </span>
        <span className="absolute inset-0 flex flex-col p-5 bg-card border-2 border-ink shadow-[4px_4px_0_var(--color-ink)] [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ borderRadius: "4px 4px 4px 18px" }}>
          <span className="hand text-[1.25rem] leading-none text-tomato">la respuesta:</span>
          <span className="mt-2 text-[0.98rem] text-ink-2 leading-relaxed">{a}</span>
        </span>
      </span>
    </button>
  );
}

export function Preguntas() {
  const ref = useAlAparecer<HTMLDivElement>(
    (el, a) => {
      a.animate(el.querySelectorAll(".nota"), {
        opacity: [0, 1],
        translateY: [30, 0],
        rotate: (t: HTMLElement) => [parseFloat(t.style.getPropertyValue("--rot")) * 3, parseFloat(t.style.getPropertyValue("--rot"))],
        duration: 650,
        delay: a.stagger(90),
        ease: "outBack",
      });
    },
    { preparar: (el) => el.querySelectorAll<HTMLElement>(".nota").forEach((n) => (n.style.opacity = "0")) },
  );

  return (
    <section id="preguntas" className="relative px-4 sm:px-6 py-20 scroll-mt-16">
      <div className="mx-auto max-w-6xl">
        <p className="section-num">preguntas</p>
        <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold max-w-3xl">
          Lo que casi todos me preguntan <span className="serif-i font-normal text-cobalt">antes de escribirme.</span>
        </h2>
        <div ref={ref} className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FAQS.map((f) => (
            <Nota key={f.q} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
