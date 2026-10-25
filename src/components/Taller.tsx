/*
 * El taller: mis trabajos cuelgan de cordones cortos. Lo jalas (arrastrando
 * hacia abajo, con un toque o con Enter) y baja la ficha del trabajo.
 * El cordón regresa con un resorte de anime.js; sin anime.js regresa con CSS.
 */
import { useRef } from "react";
import { TALLER, type Project } from "@/data/projects";
import { laTienda } from "@/data/site";
import { anime } from "@/lib/anime";

const LARGOS = [70, 110, 85, 125, 95];
const JALON = 55;

function Cordon({ p, i, onPull }: { p: Project; i: number; onPull: (id: string) => void }) {
  const base = LARGOS[i % LARGOS.length];
  const raiz = useRef<HTMLDivElement>(null);
  const estado = useRef({ y: 0, inicio: 0, activo: false, movio: false });

  const pintar = (y: number) => raiz.current?.style.setProperty("--jalon", `${Math.max(0, y)}px`);

  const soltar = () => {
    const s = estado.current;
    const a = anime();
    if (a) {
      a.animate(s, { y: 0, ease: a.createSpring({ stiffness: 320, damping: 7 }), onUpdate: () => pintar(s.y) });
    } else {
      raiz.current?.classList.add("cordon-regresa");
      s.y = 0;
      pintar(0);
      setTimeout(() => raiz.current?.classList.remove("cordon-regresa"), 400);
    }
  };

  const jalar = () => {
    const s = estado.current;
    const a = anime();
    if (!a) return onPull(p.id);
    a.animate(s, {
      y: 90,
      duration: 180,
      ease: "inQuad",
      onUpdate: () => pintar(s.y),
      onComplete: () => {
        onPull(p.id);
        soltar();
      },
    });
  };

  return (
    <div ref={raiz} className="cordon relative w-[64px] sm:w-[120px] shrink-0" style={{ ["--base" as string]: `${base}px` }}>
      <span className="cordon-hilo absolute left-1/2 top-0 -ml-[1.5px] w-[3px] bg-ink rounded-full" aria-hidden />
      <button
        type="button"
        className="cordon-etiqueta group absolute left-1/2 -translate-x-1/2 flex flex-col items-center cursor-grab active:cursor-grabbing touch-none select-none"
        aria-label={`Jalar el cordón de ${p.name}`}
        onPointerDown={(e) => {
          const s = estado.current;
          s.activo = true;
          s.movio = false;
          s.inicio = e.clientY - s.y;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const s = estado.current;
          if (!s.activo) return;
          s.y = Math.min(150, Math.max(0, e.clientY - s.inicio));
          if (s.y > 6) s.movio = true;
          pintar(s.y);
        }}
        onPointerUp={() => {
          const s = estado.current;
          if (!s.activo) return;
          s.activo = false;
          if (s.y > JALON) {
            onPull(p.id);
            soltar();
          } else if (s.movio) soltar();
        }}
        onClick={(e) => {
          // toque sin arrastrar (o Enter con el teclado)
          if (estado.current.movio) return;
          e.preventDefault();
          jalar();
        }}
      >
        <span className="w-4 h-4 rounded-full bg-ink" />
        <span
          className="cordon-tag relative -mt-1 flex flex-col items-center w-[62px] sm:w-[108px] px-1 sm:px-2 pt-3 pb-3 border-2 border-ink rounded-[12px_12px_16px_16px] shadow-[3px_3px_0_var(--color-ink)] group-focus-visible:outline-[3px] group-focus-visible:outline-cobalt group-focus-visible:outline"
          style={{ background: p.accent, animationDuration: `${3 + i * 0.5}s`, animationDelay: `${i * -0.7}s` }}
        >
          <span className="w-3 h-3 rounded-full bg-paper border-2 border-ink" aria-hidden />
          <span className="font-display font-extrabold text-ink text-[0.74rem] sm:text-[1.15rem] leading-tight text-center mt-2 whitespace-nowrap sm:whitespace-normal">
            <span className="sm:hidden">{p.name.split(" ")[0]}</span>
            <span className="hidden sm:inline">{p.name}</span>
          </span>
          <span className="hand text-[1.05rem] text-ink/70 leading-tight text-center mt-0.5 hidden sm:block">{p.tag}</span>
        </span>
      </button>
    </div>
  );
}

export function Taller({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section id="taller" className="relative px-4 sm:px-6 pt-16 pb-16 scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-end">
          <div>
            <p className="section-num">el taller</p>
            <h2 className="mt-3 text-[clamp(2.3rem,5.5vw,4rem)] font-extrabold">
              Mis trabajos. <span className="serif-i font-normal text-cobalt">Jala uno.</span>
            </h2>
          </div>
          <p className="text-ink-2 text-[1.08rem] max-w-md lg:justify-self-end">
            Cada cordón tiene un trabajo real colgado. Jálalo y baja su ficha: cómo era antes, cómo quedó y una lupa para ver cómo funciona por dentro.
          </p>
        </div>

        <div className="relative mt-10">
          <div className="relative h-5 rounded-full bg-ink" aria-hidden>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-paper/80" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-paper/80" />
          </div>
          <div className="flex justify-between sm:justify-around px-0 sm:px-1 min-h-[300px] sm:min-h-[330px]">
            {TALLER.map((p, i) => (
              <Cordon key={p.id} p={p} i={i} onPull={onOpen} />
            ))}
          </div>
          <p className="hand text-[1.4rem] text-tomato -rotate-2 text-center mt-1">jala uno, en serio</p>
        </div>

        <p className="mt-4 text-center text-ink-2">
          ¿Quieres ver todo, con demos para probar?{" "}
          <a href={laTienda("trabajos")} target="_blank" rel="noopener noreferrer" className="hand text-[1.4rem] text-cobalt underline underline-offset-4">
            Está en La tienda →
          </a>
        </p>
      </div>
    </section>
  );
}
