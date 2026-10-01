/*
 * La pantalla que baja al jalar un cordón. Muestra el proyecto en compu o cel,
 * con una barra de "rayos X" que deja ver el plano y lo que hay por dentro.
 */
import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, Laptop, Smartphone, X } from "lucide-react";
import { PROJECTS, type Project } from "@/data/projects";
import { whatsappLink } from "@/data/site";
import { Spark } from "./Doodles";

/* posiciones de las notas sobre el plano */
/* todas a la derecha, que es la parte que la barra destapa primero */
const NOTE_SPOTS = [
  "right-[4%] top-[9%] -rotate-3",
  "right-[9%] top-[31%] rotate-2",
  "right-[3%] top-[53%] rotate-1",
  "right-[7%] bottom-[9%] -rotate-2",
];

function XrayScreen({ project, src, tall, phone }: { project: Project; src: string; tall?: boolean; phone?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const pos = useMotionValue(100);
  const [clip, setClip] = useState(100);
  const dragging = useRef(false);

  useMotionValueEvent(pos, "change", (v) => setClip(v));

  /* al aparecer, la barra se asoma sola para que se note que existe */
  useEffect(() => {
    pos.set(100);
    const c = animate(pos, phone ? 55 : 62, { delay: 0.7, duration: 1.1, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [src, phone, pos]);

  const setFromEvent = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    pos.set(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={box}
      className="group relative w-full h-full overflow-hidden bg-paper select-none touch-pan-y"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setFromEvent(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFromEvent(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* lo que ve el cliente */}
      <img
        src={src}
        alt={`Captura de ${project.name}`}
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover object-top ${
          tall ? "transition-[object-position] duration-[7000ms] ease-in-out group-hover:object-bottom" : ""
        }`}
      />

      {/* el plano: misma captura invertida sobre azul de plano + cuadrícula + notas */}
      <div className="absolute inset-0 bg-blueprint" style={{ clipPath: `inset(0 0 0 ${clip}%)` }} aria-hidden>
        <img
          src={src}
          alt=""
          draggable={false}
          className={`absolute inset-0 w-full h-full object-cover object-top mix-blend-screen opacity-70 ${
            tall ? "transition-[object-position] duration-[7000ms] ease-in-out group-hover:object-bottom" : ""
          }`}
          style={{ filter: "grayscale(1) invert(1) contrast(1.4) brightness(0.9)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",
            backgroundSize: phone ? "16px 16px" : "22px 22px",
          }}
        />
        {project.xray.slice(0, phone ? 3 : 4).map((n, i) => (
          <span
            key={n}
            className={`absolute ${NOTE_SPOTS[i]} hand text-white ${phone ? "text-[0.95rem]" : "text-[0.8rem] sm:text-[1.1rem] lg:text-[1.25rem]"} leading-none px-2 py-1 border-2 border-dashed border-white/80 rounded-md bg-blueprint/70`}
          >
            {n}
          </span>
        ))}
        <span className="absolute left-2 bottom-2 font-mono text-[0.6rem] text-white/80 tracking-widest uppercase">
          plano · {project.stack.slice(0, 2).join(" + ")}
        </span>
      </div>

      {/* la barra */}
      <div className="absolute top-0 bottom-0 w-[3px] bg-volt -translate-x-1/2 pointer-events-none" style={{ left: `${clip}%` }}>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full bg-volt border-2 border-ink shadow-[2px_2px_0_var(--color-ink)] font-mono text-[0.65rem] font-bold text-ink">
          RX
        </span>
      </div>
    </div>
  );
}

function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[620px] mx-auto">
      <div className="relative rounded-t-[14px] border-[3px] border-ink bg-ink p-[7px] sm:p-[10px] pb-[7px] shadow-[6px_6px_0_rgba(23,22,28,0.25)]">
        <span className="absolute top-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-paper/40" />
        <div className="aspect-[16/10] rounded-[4px] overflow-hidden">{children}</div>
      </div>
      <div className="relative h-4 sm:h-5 -mx-[6%] rounded-b-[14px] border-[3px] border-t-0 border-ink bg-[#d6d1c4]">
        <span className="absolute left-1/2 top-0 -translate-x-1/2 w-20 h-1.5 rounded-b-md bg-ink/30" />
      </div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[210px] sm:w-[240px] mx-auto rounded-[38px] border-[3px] border-ink bg-ink p-[9px] shadow-[6px_6px_0_rgba(23,22,28,0.25)]">
      <span className="absolute top-[14px] left-1/2 -translate-x-1/2 w-16 h-[18px] rounded-full bg-ink z-10" />
      <div className="aspect-[9/19.5] rounded-[29px] overflow-hidden">{children}</div>
    </div>
  );
}

export function ProjectStage({
  projectId,
  onClose,
  onChange,
}: {
  projectId: string | null;
  onClose: () => void;
  onChange: (id: string) => void;
}) {
  const index = PROJECTS.findIndex((p) => p.id === projectId);
  const project = index >= 0 ? PROJECTS[index] : null;
  const [device, setDevice] = useState<"laptop" | "phone">("laptop");
  const closeBtn = useRef<HTMLButtonElement>(null);

  const go = (dir: 1 | -1) => {
    const next = PROJECTS[(index + dir + PROJECTS.length) % PROJECTS.length];
    onChange(next.id);
  };

  useEffect(() => {
    if (!project) return;
    if (!project.mob) setDevice("laptop");
  }, [project]);

  useEffect(() => {
    if (!projectId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, index]);

  const showPhone = device === "phone" && !!project?.mob;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="stage"
          className="fixed inset-0 z-[80] flex items-start justify-center px-3 sm:px-6 pt-6 sm:pt-10 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.15 } }}
          role="dialog"
          aria-modal="true"
          aria-label={project.name}
        >
          <div className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-6xl"
            initial={{ y: "-110vh" }}
            animate={{ y: 0 }}
            exit={{ y: "-110vh", transition: { duration: 0.35, ease: "easeIn" } }}
            transition={{ type: "spring", stiffness: 110, damping: 13, mass: 0.9 }}
          >
            {/* los dos cordones que sostienen la pantalla */}
            <span className="absolute left-[12%] -top-[100vh] h-[100vh] w-[3px] bg-paper/80" aria-hidden />
            <span className="absolute right-[12%] -top-[100vh] h-[100vh] w-[3px] bg-paper/80" aria-hidden />

            <div className="ink-card !rounded-[22px] !shadow-[8px_8px_0_var(--color-ink)] max-h-[calc(100dvh-2.5rem)] sm:max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain">
              {/* barra superior */}
              <div
                className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b-2 border-ink"
                style={{ background: project.accent }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-xs text-ink/70">0{index + 1}/0{PROJECTS.length}</span>
                  <span className="font-display font-extrabold text-lg sm:text-xl truncate">{project.name}</span>
                  <span className="hidden sm:inline sticker !text-[0.62rem] !py-0.5">{project.kind}</span>
                </div>
                <button
                  ref={closeBtn}
                  onClick={onClose}
                  className="flex items-center gap-1.5 font-display font-bold text-sm px-3 py-1.5 rounded-lg border-2 border-ink bg-card shadow-[2px_2px_0_var(--color-ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  Soltar <X size={16} strokeWidth={2.6} />
                </button>
              </div>

              <div className="grid lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-10 p-4 sm:p-7">
                {/* dispositivo */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 self-stretch justify-between mb-5">
                    <div className="inline-flex p-1 rounded-xl border-2 border-ink bg-paper">
                      {(["laptop", "phone"] as const).map((d) => {
                        const disabled = d === "phone" && !project.mob;
                        const active = (d === "phone") === showPhone;
                        return (
                          <button
                            key={d}
                            disabled={disabled}
                            onClick={() => setDevice(d)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                              active ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"
                            } disabled:opacity-35 disabled:cursor-not-allowed`}
                            title={disabled ? "Este proyecto solo tiene vista de compu" : undefined}
                          >
                            {d === "laptop" ? <Laptop size={16} /> : <Smartphone size={16} />}
                            {d === "laptop" ? "Compu" : "Cel"}
                          </button>
                        );
                      })}
                    </div>
                    <span className="hand text-[1.15rem] text-cobalt leading-tight text-right">
                      arrastra la barra <span className="font-mono text-xs bg-volt text-ink px-1 rounded border border-ink">RX</span> para ver por dentro
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${project.id}-${showPhone ? "p" : "l"}`}
                      initial={{ opacity: 0, scale: 0.92, rotate: showPhone ? -4 : 0 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ type: "spring", stiffness: 220, damping: 20 }}
                      className="w-full"
                    >
                      {showPhone ? (
                        <PhoneFrame>
                          <XrayScreen project={project} src={project.mob!} phone />
                        </PhoneFrame>
                      ) : (
                        <LaptopFrame>
                          <XrayScreen project={project} src={project.deskTall ?? project.desk} tall={!!project.deskTall} />
                        </LaptopFrame>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {project.deskTall && !showPhone && (
                    <p className="mt-3 text-xs font-mono text-ink-3 hidden [@media(hover:hover)]:block">pasa el mouse por la pantalla y baja sola</p>
                  )}
                </div>

                {/* la historia */}
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="sticker bg-volt">{project.status}</span>
                    <span className="sticker">{project.place}</span>
                  </div>

                  <dl className="mt-6 space-y-5">
                    {[
                      ["el problema", project.problem],
                      ["lo que hice", project.built],
                      ["cómo quedó", project.result],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="hand text-[1.45rem] leading-none text-tomato">{k}</dt>
                        <dd className="mt-1.5 text-ink-2 text-[1rem] leading-relaxed">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <span key={s} className="font-mono text-[0.7rem] px-2 py-1 rounded-md border border-ink/25 bg-paper">
                        {s}
                      </span>
                    ))}
                  </div>

                  {project.note && <p className="mt-4 text-xs text-ink-3 italic">{project.note}</p>}

                  <div className="mt-7 flex flex-wrap gap-3">
                    {project.url ? (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                        Verlo en vivo <ExternalLink size={16} />
                      </a>
                    ) : (
                      <span className="text-sm text-ink-3 self-center">Es de uso privado, por eso no tiene link público.</span>
                    )}
                    <a
                      href={whatsappLink(`¡Hola Josh! Vi el proyecto ${project.name} y quiero algo parecido para mi negocio.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Quiero algo así
                    </a>
                  </div>

                  <div className="mt-auto pt-8 flex items-center justify-between gap-3 border-t-2 border-dashed border-ink/20">
                    <button onClick={() => go(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-ink-2 hover:text-ink pt-4">
                      <ArrowLeft size={16} /> {PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length].name}
                    </button>
                    <Spark className="w-5 h-5 text-cobalt mt-4" />
                    <button onClick={() => go(1)} className="flex items-center gap-1.5 text-sm font-semibold text-ink-2 hover:text-ink pt-4">
                      {PROJECTS[(index + 1) % PROJECTS.length].name} <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
