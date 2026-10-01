import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { whatsappLink } from "@/data/site";
import { ArrowCurly, Spark, Underline } from "./Doodles";

/* posiciones iniciales de los polaroids sobre la mesa (en %) */
const SPOTS = [
  { left: "4%", top: "6%", rotate: -7 },
  { left: "48%", top: "2%", rotate: 5 },
  { left: "26%", top: "34%", rotate: -2 },
  { left: "58%", top: "46%", rotate: 8 },
  { left: "2%", top: "58%", rotate: 4 },
];

function Polaroid({
  index,
  constraints,
  onOpen,
  z,
  bringToFront,
}: {
  index: number;
  constraints: React.RefObject<HTMLDivElement | null>;
  onOpen: (id: string) => void;
  z: number;
  bringToFront: () => void;
}) {
  const p = PROJECTS[index];
  const spot = SPOTS[index];
  const dragged = useRef(false);

  return (
    <motion.button
      type="button"
      drag
      dragConstraints={constraints}
      dragElastic={0.15}
      dragMomentum
      onPointerDown={bringToFront}
      onDragStart={() => (dragged.current = true)}
      onClick={() => {
        if (dragged.current) {
          dragged.current = false;
          return;
        }
        onOpen(p.id);
      }}
      initial={{ opacity: 0, y: -40, rotate: spot.rotate * 2 }}
      animate={{ opacity: 1, y: 0, rotate: spot.rotate }}
      transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.25 + index * 0.12 }}
      whileHover={{ scale: 1.04, rotate: spot.rotate * 0.4 }}
      whileDrag={{ scale: 1.08, rotate: 0, cursor: "grabbing" }}
      className="absolute w-[46%] sm:w-[40%] max-w-[230px] bg-card border-2 border-ink p-2 pb-1 shadow-[5px_5px_0_var(--color-ink)] cursor-grab touch-none text-left"
      style={{ left: spot.left, top: spot.top, zIndex: z }}
      aria-label={`Ver proyecto ${p.name}`}
    >
      <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-4deg]" aria-hidden />
      <span className="block aspect-[4/3] overflow-hidden border-2 border-ink bg-paper">
        <img src={p.desk} alt="" draggable={false} className="w-full h-full object-cover object-top pointer-events-none" />
      </span>
      <span className="block hand text-[1.35rem] leading-tight pt-1 px-0.5 text-ink">
        {p.name}
        <span className="block text-[1rem] text-ink-2 font-medium -mt-0.5">{p.tag}</span>
      </span>
    </motion.button>
  );
}

export function Hero({ onOpen }: { onOpen: (id: string) => void }) {
  const desk = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  /* el primero de la lista queda encima */
  const [order, setOrder] = useState(PROJECTS.map((_, i) => PROJECTS.length - 1 - i));

  const bringToFront = (i: number) => setOrder((o) => [...o.filter((x) => x !== i), i]);

  return (
    <section id="top" className="relative pt-28 sm:pt-32 pb-10 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-6 items-center">
        {/* texto */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, rotate: -6, y: 10 }}
            animate={{ opacity: 1, rotate: -3, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="sticker bg-sun mb-6"
          >
            <MapPin size={13} strokeWidth={2.5} /> Hecho en Guate
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-[clamp(2.6rem,6.4vw,4.6rem)] font-extrabold"
          >
            Páginas y sistemas que tu negocio{" "}
            <span className="relative inline-block">
              <span className="serif-i font-normal">sí</span>
              <Underline className="absolute left-[-8%] -bottom-2 w-[120%] h-4 text-tomato" />
            </span>{" "}
            va a usar.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-[1.12rem] sm:text-[1.2rem] text-ink-2 max-w-xl"
          >
            ¡Qué tal! Soy <strong className="text-ink">Josh</strong>. En Jzet Labs armo tiendas en línea, sistemas para
            el día a día y landing pages a la medida, a precios que <span className="marker text-ink">no te sacan un susto</span>.
            Me contás qué necesitás, lo platicamos y lo armo a tu ritmo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href={whatsappLink("¡Hola Josh! Tengo una idea y quiero ver si me podés ayudar.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Contame tu idea <ArrowRight size={18} strokeWidth={2.5} />
            </a>
            <a href="#precios" className="btn btn-ghost">
              Ver cuánto cuesta
            </a>
          </motion.div>

          <p className="mt-6 text-sm text-ink-3 font-mono">
            sin mensualidades · pago único o en cuotas · con o sin dominio
          </p>
        </div>

        {/* mesa de trabajo con polaroids que se pueden mover */}
        <div className="relative">
          <div className="hand absolute -top-9 right-2 sm:right-6 text-[1.45rem] text-cobalt rotate-[-4deg] z-10 pointer-events-none select-none">
            agarralos y movelos, son proyectos reales
            <ArrowCurly className="w-16 h-11 inline-block ml-1 -scale-x-100 rotate-[70deg] translate-y-3" />
          </div>
          <div
            ref={desk}
            className="relative h-[420px] sm:h-[480px] rounded-[22px] border-2 border-dashed border-ink/30 bg-[radial-gradient(circle_at_30%_20%,rgba(213,240,91,0.22),transparent_55%)]"
          >
            {order.map((i, zi) => (
              <Polaroid
                key={PROJECTS[i].id}
                index={i}
                constraints={desk}
                onOpen={onOpen}
                z={zi + 1}
                bringToFront={() => bringToFront(i)}
              />
            ))}
            <Spark className="absolute right-4 bottom-6 w-8 h-8 text-tomato" />
            {!reduce && (
              <Spark className="absolute left-[44%] top-[30%] w-5 h-5 text-cobalt animate-[sway_3s_ease-in-out_infinite]" />
            )}
          </div>
          <p className="hand text-[1.2rem] text-ink-2 mt-2 text-center">tocá uno para verlo de cerca</p>
        </div>
      </div>

      {/* cinta que corre */}
      <div className="mt-14 -mx-4 sm:-mx-6 border-y-2 border-ink bg-ink text-paper overflow-hidden -rotate-1">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] py-2.5">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center gap-8 pr-8 font-display font-bold text-lg" aria-hidden={k === 1}>
              {["tiendas en línea", "sistemas internos", "landing pages", "paneles de admin", "pedidos por WhatsApp", "funciona sin internet", "pago en cuotas", "trato directo"].map((t) => (
                <span key={t} className="flex items-center gap-8">
                  {t}
                  <Spark className="w-5 h-5 text-volt" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
