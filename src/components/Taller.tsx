/*
 * El taller — cada proyecto cuelga de un cordón. Lo jalas (arrastrando hacia
 * abajo o con un click/Enter) y el proyecto baja como pantalla de proyector.
 */
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { PROJECTS, type Project } from "@/data/projects";
import { ArrowDown, Spark } from "./Doodles";

const LENGTHS = [110, 170, 135, 195, 150];
const PULL_AT = 70;

function Cord({ project, index, onPull }: { project: Project; index: number; onPull: (id: string) => void }) {
  const y = useMotionValue(0);
  const base = LENGTHS[index % LENGTHS.length];
  const height = useTransform(y, (v) => base + Math.max(0, v));
  const stretch = useTransform(y, [0, PULL_AT, 160], [1, 1, 0.75]);
  const reduce = useReducedMotion();

  const tug = async () => {
    await animate(y, 95, { duration: 0.18, ease: "easeIn" });
    onPull(project.id);
    animate(y, 0, { type: "spring", stiffness: 380, damping: 9 });
  };

  return (
    <div className="relative w-[62px] sm:w-[96px] shrink-0">
      {/* el cordón */}
      <motion.div style={{ height, scaleX: stretch }} className="absolute left-1/2 top-0 -ml-[1.5px] w-[3px] bg-ink rounded-full origin-top" />
      {/* nudo + etiqueta */}
      <motion.button
        type="button"
        drag="y"
        dragConstraints={{ top: 0, bottom: 150 }}
        dragElastic={0.08}
        dragSnapToOrigin
        dragTransition={{ bounceStiffness: 420, bounceDamping: 9 }}
        style={{ y, top: base - 2 }}
        onDragEnd={() => {
          if (y.get() > PULL_AT) onPull(project.id);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            tug();
          }
        }}
        onClick={(e) => {
          /* tras un arrastre largo el cordón sigue estirado (y alto), así que solo cuenta como toque si casi no se movió */
          if (e.detail > 0 && y.get() < 8) tug();
        }}
        whileHover={{ scale: 1.05 }}
        className="group absolute left-1/2 -translate-x-1/2 flex flex-col items-center cursor-grab active:cursor-grabbing touch-none select-none focus-visible:outline-none"
        aria-label={`Jalar el cordón de ${project.name}`}
      >
        <span className="w-4 h-4 rounded-full bg-ink border-2 border-ink" />
        <span
          className="relative -mt-1 flex flex-col items-center w-[56px] sm:w-[84px] pt-3 pb-3 border-2 border-ink rounded-[12px_12px_14px_14px] shadow-[3px_3px_0_var(--color-ink)] group-focus-visible:outline-[3px] group-focus-visible:outline-cobalt group-focus-visible:outline"
          style={{
            background: project.accent,
            animation: reduce ? undefined : `sway ${3 + index * 0.4}s ease-in-out ${index * -0.7}s infinite`,
            transformOrigin: "top center",
          }}
        >
          <span className="w-3 h-3 rounded-full bg-paper border-2 border-ink" aria-hidden />
          <span className="font-mono text-[0.62rem] mt-1.5 text-ink/70">0{index + 1}</span>
          <span
            className="font-display font-extrabold text-ink text-[0.95rem] sm:text-[1.15rem] leading-none mt-1.5 whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {project.name}
          </span>
        </span>
      </motion.button>
    </div>
  );
}

export function Taller({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section id="taller" className="relative px-4 sm:px-6 pt-20 pb-16 scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-end">
          <div>
            <p className="section-num">01 — el taller</p>
            <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold">
              Nada de galería aburrida.{" "}
              <span className="serif-i font-normal text-cobalt">Jala un cordón.</span>
            </h2>
          </div>
          <p className="text-ink-2 text-[1.08rem] max-w-md lg:justify-self-end">
            Cada cordón tiene colgado un proyecto real. Jálalo hacia abajo (o dale click) y baja para que lo veas en compu o en
            cel, y hasta por dentro con rayos X.
          </p>
        </div>

        <div className="relative mt-12">
          {/* el riel de donde cuelgan */}
          <div className="relative h-5 rounded-full bg-ink border-2 border-ink shadow-[0_4px_0_rgba(23,22,28,0.18)]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-paper/80" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-paper/80" />
          </div>

          <div className="flex justify-between sm:justify-around px-1 sm:px-6 min-h-[360px] sm:min-h-[420px]">
            {PROJECTS.map((p, i) => (
              <Cord key={p.id} project={p} index={i} onPull={onOpen} />
            ))}
          </div>

          <div className="hand absolute right-0 sm:right-4 bottom-2 text-[1.35rem] text-tomato rotate-[-5deg] pointer-events-none hidden sm:flex items-end gap-1">
            <ArrowDown className="w-8 h-12 -scale-x-100 rotate-[160deg] -translate-y-14" />
            jala uno, en serio
          </div>
          <Spark className="absolute left-2 bottom-8 w-7 h-7 text-cobalt hidden sm:block" />
        </div>

        {/* atajo accesible para quien tenga prisa */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-ink-3 mr-1">¿Con prisa? Directo:</span>
          {PROJECTS.map((p) => (
            <button
              key={p.id}
              onClick={() => onOpen(p.id)}
              className="text-sm font-medium px-3 py-1 rounded-full border-2 border-ink/80 bg-card hover:bg-volt transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
