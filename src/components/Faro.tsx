/*
 * El "faro" de la portada: Jzet Labs en el centro y los rubros alrededor.
 * Animado con anime.js: las líneas se dibujan, los rubros aparecen,
 * el centro late y unos puntos viajan del rubro al centro (datos que llegan solos).
 * Si se pidió reducir movimiento, se muestra quieto.
 */
import { useEffect, useRef } from "react";
import { animate, createTimeline, stagger, svg } from "animejs";
import { BookOpen, Briefcase, Dumbbell, GraduationCap, Package, Stethoscope, Store, Ticket, type LucideIcon } from "lucide-react";

const NODOS: { nombre: string; Icono: LucideIcon }[] = [
  { nombre: "Colegios", Icono: GraduationCap },
  { nombre: "Clínicas", Icono: Stethoscope },
  { nombre: "Tiendas", Icono: Store },
  { nombre: "Librerías", Icono: BookOpen },
  { nombre: "Eventos", Icono: Ticket },
  { nombre: "Gimnasios", Icono: Dumbbell },
  { nombre: "Bodegas", Icono: Package },
  { nombre: "Empresas", Icono: Briefcase },
];

const C = 250; // centro del dibujo (viewBox 500 x 500)
const R = 190; // radio donde van los rubros

const posiciones = NODOS.map((_, i) => {
  const a = (i / NODOS.length) * Math.PI * 2 - Math.PI / 2;
  return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
});

export function Faro() {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lineas = svg.createDrawable(el.querySelectorAll<SVGLineElement>(".faro-linea"));
    const nodos = el.querySelectorAll<HTMLElement>(".faro-nodo");

    const entrada = createTimeline({ defaults: { ease: "outCubic" } })
      .add(el.querySelector(".faro-centro")!, { scale: [0.6, 1], opacity: [0, 1], duration: 600 })
      .add(lineas, { draw: ["0 0", "0 1"], duration: 700, delay: stagger(70) }, "-=200")
      .add(nodos, { opacity: [0, 1], scale: [0.7, 1], duration: 500, delay: stagger(70) }, "-=800");

    const latido = animate(el.querySelectorAll(".faro-onda"), {
      scale: [1, 2.3],
      opacity: [0.45, 0],
      duration: 2600,
      delay: stagger(1300),
      loop: true,
      ease: "outQuad",
    });

    // un punto viaja de un rubro al centro, cada vez desde otro rubro
    const puntos = el.querySelectorAll<SVGCircleElement>(".faro-punto");
    const viajes = Array.from(puntos).map((p, i) =>
      animate(p, {
        cx: [posiciones[(i * 3) % NODOS.length].x, C],
        cy: [posiciones[(i * 3) % NODOS.length].y, C],
        opacity: [{ to: 1, duration: 200 }, { to: 1, duration: 1000 }, { to: 0, duration: 200 }],
        duration: 1400,
        delay: 1600 + i * 900,
        loopDelay: 2200,
        loop: true,
        ease: "inOutSine",
      }),
    );

    return () => {
      entrada.revert();
      latido.revert();
      viajes.forEach((v) => v.revert());
    };
  }, []);

  return (
    <div ref={raiz} className="relative mx-auto aspect-square w-full max-w-[460px]" aria-hidden>
      <svg viewBox="0 0 500 500" className="absolute inset-0 h-full w-full">
        <circle cx={C} cy={C} r={R} fill="none" stroke="#0b2545" strokeOpacity=".08" strokeDasharray="4 6" />
        <circle cx={C} cy={C} r={R * 0.55} fill="none" stroke="#0b2545" strokeOpacity=".06" />
        {posiciones.map((p, i) => (
          <line key={i} className="faro-linea" x1={C} y1={C} x2={p.x} y2={p.y} stroke="#0b2545" strokeOpacity=".18" strokeWidth="1.5" />
        ))}
        {[0, 1, 2].map((i) => (
          <circle key={i} className="faro-punto" cx={C} cy={C} r="5" fill="#1a7f4e" opacity="0" />
        ))}
      </svg>

      {/* centro */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
       <div className="faro-centro relative">
        <span className="faro-onda absolute inset-0 rounded-full bg-acento/30" />
        <span className="faro-onda absolute inset-0 rounded-full bg-acento/30" />
        <div className="relative grid h-[88px] w-[88px] sm:h-[104px] sm:w-[104px] place-items-center rounded-full bg-marino text-white shadow-xl ring-8 ring-white">
          <div className="text-center leading-tight">
            <span className="block font-titulo text-[1.9rem] sm:text-[2.2rem] font-extrabold">J</span>
            <span className="block text-[0.62rem] sm:text-[0.7rem] font-semibold tracking-wider uppercase text-white/80">Jzet Labs</span>
          </div>
        </div>
       </div>
      </div>

      {/* rubros */}
      {NODOS.map(({ nombre, Icono }, i) => (
        <div
          key={nombre}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(posiciones[i].x / 500) * 100}%`, top: `${(posiciones[i].y / 500) * 100}%` }}
        >
         <div className="faro-nodo flex flex-col items-center gap-1">
          <span className="grid h-11 w-11 sm:h-14 sm:w-14 place-items-center rounded-2xl border border-linea bg-white text-marino shadow-sm">
            <Icono className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.8} />
          </span>
          <span className="rounded-full bg-white/90 px-2 text-[0.72rem] sm:text-[0.82rem] font-semibold text-tinta">{nombre}</span>
         </div>
        </div>
      ))}
    </div>
  );
}
