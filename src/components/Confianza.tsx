/*
 * Por qué confiar en mí: stickers que se voltean al tocarlos.
 * El volteo es CSS 3D (funciona sin anime.js); anime.js solo los hace caer.
 */
import { useState } from "react";
import { RotateCw } from "lucide-react";
import { useAlAparecer } from "@/lib/anime";

const RAZONES = [
  { frente: "Precio cerrado", atras: "Te digo el precio antes de empezar y no cambia a medio camino. Lo que dice la propuesta es lo que pagas.", color: "#ffd166", rot: -3 },
  { frente: "Q0 al mes, garantizado", atras: "Tu página vive en herramientas gratis. Si alguna empieza a cobrar, la cambio a otra gratis sin costo para ti.", color: "#d5f05b", rot: 2 },
  { frente: "Todo queda a tu nombre", atras: "El código y los accesos son tuyos. No quedas amarrado a mí ni a nadie.", color: "#8ce0c3", rot: -1.5 },
  { frente: "30 días de soporte", atras: "Después de entregar tienes 30 días de soporte y una ronda de ajustes incluida.", color: "#c4b5fd", rot: 2.5 },
  { frente: "Te atiendo yo", atras: "El mismo que lo construye. Sin vendedores en medio: me escribes a mí y te contesto yo.", color: "#ff9f80", rot: -2 },
];

function Sticker({ frente, atras, color, rot }: (typeof RAZONES)[number]) {
  const [vuelta, setVuelta] = useState(false);
  return (
    <button type="button" onClick={() => setVuelta((v) => !v)} aria-pressed={vuelta} className="razon group relative h-[200px] text-left [perspective:900px]" style={{ ["--rot" as string]: `${rot}deg` }}>
      <span className={`relative block w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${vuelta ? "[transform:rotateY(180deg)]" : ""}`}>
        <span className="absolute inset-0 flex flex-col justify-between p-5 border-2 border-ink rounded-[18px] shadow-[4px_4px_0_var(--color-ink)] [backface-visibility:hidden]" style={{ background: color }}>
          <span className="font-display font-extrabold text-[1.55rem] leading-tight">{frente}</span>
          <span className="flex items-center gap-1.5 hand text-[1.15rem] text-ink/70">
            <RotateCw size={14} /> tócalo
          </span>
        </span>
        <span className="absolute inset-0 p-5 bg-card border-2 border-ink rounded-[18px] shadow-[4px_4px_0_var(--color-ink)] [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center">
          <span className="text-ink-2 leading-relaxed">{atras}</span>
        </span>
      </span>
    </button>
  );
}

export function Confianza() {
  const ref = useAlAparecer<HTMLDivElement>(
    (el, a) => {
      a.animate(el.querySelectorAll(".razon"), {
        opacity: [0, 1],
        translateY: [-40, 0],
        rotate: (t: HTMLElement) => [0, parseFloat(t.style.getPropertyValue("--rot"))],
        duration: 700,
        delay: a.stagger(110),
        ease: "outBounce",
      });
    },
    { preparar: (el) => el.querySelectorAll<HTMLElement>(".razon").forEach((n) => (n.style.opacity = "0")) },
  );

  return (
    <section id="confianza" className="relative px-4 sm:px-6 py-20 scroll-mt-16">
      <div className="mx-auto max-w-6xl">
        <p className="section-num">por qué confiar en mí</p>
        <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold max-w-3xl">
          Lo que te prometo, <span className="serif-i font-normal text-cobalt">por escrito.</span>
        </h2>
        <div ref={ref} className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {RAZONES.map((r) => (
            <Sticker key={r.frente} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}
