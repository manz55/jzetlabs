/*
 * Hero "Soy Josh". Las polaroids de mis trabajos caen sobre la mesa una por
 * una (con rebote), se agarran y se avientan, y regresan solas a su lugar.
 * Sin anime.js: se ven quietas sobre la mesa y se pueden tocar igual.
 */
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { whatsappLink } from "@/data/site";
import { anime } from "@/lib/anime";
import { ArrowCurly, Underline } from "./Doodles";
import { Gafas } from "./Gafas";
import { Trazo } from "./Trazo";

const SPOTS = [
  { left: "3%", top: "8%", rot: -7 },
  { left: "50%", top: "3%", rot: 5 },
  { left: "8%", top: "52%", rot: 4 },
  { left: "52%", top: "50%", rot: -4 },
  { left: "30%", top: "30%", rot: 2 },
];

export function Hero({ onOpen }: { onOpen: (id: string) => void }) {
  const mesa = useRef<HTMLDivElement>(null);
  const arrastrado = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const a = anime();
    const cont = mesa.current;
    if (!a || !cont) return;
    const tarjetas = [...cont.querySelectorAll<HTMLElement>("[data-polaroid]")];
    const caidas = tarjetas.map((t) => t.querySelector<HTMLElement>(".caida")!);
    let z = 10;
    const regresos = new Map<HTMLElement, number>();
    const draggables: { revert: () => void }[] = [];

    // caen una por una, con rebote
    const caida = a.animate(caidas, {
      translateY: [-520, 0],
      rotate: (_: unknown, i: number) => [SPOTS[i].rot * 4, SPOTS[i].rot],
      opacity: [0, 1],
      duration: 900,
      delay: a.stagger(170, { start: 250 }),
      ease: "outBounce",
    });

    tarjetas.forEach((t) => {
      const id = t.dataset.polaroid!;
      const d = a.createDraggable(t, {
        container: cont,
        containerPadding: 4,
        releaseStiffness: 120,
        releaseDamping: 9,
        releaseContainerFriction: 0.6,
        cursor: { onHover: "grab", onGrab: "grabbing" },
        onGrab: () => {
          arrastrado.current[id] = false;
          t.style.zIndex = String(++z);
          clearTimeout(regresos.get(t));
        },
        onDrag: (self) => {
          if (Math.abs(self.x) + Math.abs(self.y) > 8) arrastrado.current[id] = true;
        },
        onSettle: (self) => {
          // a los 2.5 s regresa sola a su lugar
          clearTimeout(regresos.get(t));
          regresos.set(
            t,
            window.setTimeout(() => {
              if (!self.grabbed) a.animate(self, { x: 0, y: 0, ease: a.createSpring({ stiffness: 90, damping: 11 }) });
            }, 2500),
          );
        },
      });
      draggables.push(d);
    });

    return () => {
      caida.revert();
      draggables.forEach((d) => d.revert());
      regresos.forEach((r) => clearTimeout(r));
    };
  }, []);

  const polaroids = PROJECTS;

  return (
    <section id="top" className="relative pt-28 sm:pt-32 pb-16 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-8 items-center">
        <div>
          <p className="hand text-[1.9rem] text-tomato -rotate-2 leading-none">¡Qué tal!</p>
          <h1 className="mt-2 text-[clamp(3rem,9vw,6rem)] font-extrabold leading-[0.95] flex items-end gap-3 flex-wrap">
            <span>
              Soy{" "}
              <span className="relative inline-block">
                Josh.
                <Trazo className="absolute left-0 -bottom-3 w-full h-4 text-tomato" retraso={700}>
                  <Underline className="w-full h-4" />
                </Trazo>
              </span>
            </span>
            <span className="relative inline-flex flex-col items-center -mb-1 rotate-6">
              <Gafas className="w-24 sm:w-28 h-auto" />
            </span>
          </h1>
          <p className="mt-7 text-[1.15rem] sm:text-[1.25rem] text-ink-2 max-w-xl">
            Hago páginas, tiendas en línea y sistemas para negocios de Guate. Los hago yo, de principio a fin, y te atiendo yo. Aquí te enseño
            lo que he hecho y cómo trabajo.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={whatsappLink("¡Hola Josh! Tengo una idea y quiero ver si me puedes ayudar.")} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Cuéntame tu idea <ArrowRight size={18} strokeWidth={2.5} />
            </a>
            <a href="#taller" className="btn btn-ghost">
              Ver mis trabajos
            </a>
          </div>
          <p className="mt-6 text-sm text-ink-3 font-mono">precio cerrado · Q0 al mes · pago en cuotas</p>
        </div>

        {/* la mesa con las polaroids */}
        <div className="relative">
          <div className="absolute -top-10 right-1 sm:right-6 z-20 pointer-events-none select-none flex items-end gap-1 text-cobalt">
            <span className="hand text-[1.6rem] -rotate-6">agárralas</span>
            <Trazo retraso={1300} duracion={800}>
              <ArrowCurly className="w-16 h-11 -scale-x-100 rotate-[75deg] translate-y-4" />
            </Trazo>
          </div>
          <div
            ref={mesa}
            className="relative h-[430px] sm:h-[500px] rounded-[22px] border-2 border-dashed border-ink/25 bg-[radial-gradient(circle_at_35%_25%,rgba(213,240,91,0.2),transparent_60%)]"
          >
            {polaroids.map((p, i) => (
              <button
                key={p.id}
                type="button"
                data-polaroid={p.id}
                onClick={() => {
                  if (arrastrado.current[p.id]) return;
                  onOpen(p.id);
                }}
                className="absolute w-[46%] sm:w-[42%] max-w-[240px] touch-none text-left"
                style={{ left: SPOTS[i].left, top: SPOTS[i].top, zIndex: i + 1 }}
                aria-label={`Ver el trabajo ${p.name}`}
              >
                <span className="caida block bg-card border-2 border-ink p-2 pb-1 shadow-[5px_5px_0_var(--color-ink)]" style={{ transform: `rotate(${SPOTS[i].rot}deg)` }}>
                  <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-4deg]" aria-hidden />
                  <span className="block aspect-[4/3] overflow-hidden border-2 border-ink bg-paper">
                    <img src={p.desk} alt="" draggable={false} className="w-full h-full object-cover object-top pointer-events-none" />
                  </span>
                  <span className="block hand text-[1.4rem] leading-tight pt-1 px-0.5 text-ink">
                    {p.name}
                    <span className="block text-[1.02rem] text-ink-2 font-medium -mt-0.5">{p.tag}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
          <p className="hand text-[1.25rem] text-ink-2 mt-2 text-center">tócalas para verlas de cerca</p>
        </div>
      </div>
    </section>
  );
}
