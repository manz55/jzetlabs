/*
 * Cómo trabajamos (4 pasos) y Preguntas frecuentes.
 * Pasos con anime.js: al llegar a la sección, la línea se dibuja y cada paso
 * aparece en orden. Si se pidió reducir movimiento, se ve todo quieto.
 * Los textos son los mismos de La tienda: si cambia uno, cambie el otro.
 */
import { useEffect, useRef } from "react";
import { animate, createTimeline, stagger } from "animejs";
import { ChevronDown } from "lucide-react";

const PASOS = [
  { titulo: "Diagnóstico", texto: "Una reunión sin costo para entender cómo trabaja hoy su negocio y qué le está costando tiempo." },
  { titulo: "Propuesta con opciones", texto: "Le presento qué módulos necesita, el plan que le conviene y el precio final por escrito." },
  { titulo: "Implementación y capacitación", texto: "Configuro el sistema con sus datos y capacito a su equipo hasta que lo usen sin ayuda." },
  { titulo: "Soporte", texto: "Acompañamiento continuo: dudas, ajustes y mejoras según su plan." },
];

const PREGUNTAS = [
  {
    p: "¿Necesito comprar un servidor o un dominio?",
    r: "No. Los planes incluyen dominio, servidor y base de datos con respaldos diarios (en el plan Propio, el primer año; después, Q600 al año). Usted solo usa el sistema.",
  },
  {
    p: "¿Mis datos están seguros?",
    r: "Sí. Cada persona entra con su propio acceso y ve solo lo que le corresponde. La conexión va cifrada, la información se respalda todos los días y la bitácora registra cada cambio.",
  },
  {
    p: "¿Funciona sin internet?",
    r: "Depende de la parte del sistema. El marcaje, por ejemplo, se guarda en el celular y se envía cuando vuelve la señal. Si en su negocio la señal falla, lo vemos en el diagnóstico.",
  },
  {
    p: "¿Qué pasa si mi negocio crece?",
    r: "Puede pasar de Control a Integral y agregar módulos cuando lo necesite, sin empezar de cero. Si tiene el plan Propio, también puede pasarse a un plan mensual.",
  },
  {
    p: "¿Puedo cancelar?",
    r: "Sí. Los planes mensuales se cancelan con un mes de aviso, y le entregamos toda su información en Excel.",
  },
];

export function Proceso() {
  const raiz = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const horizontal = matchMedia("(min-width: 768px)").matches;
    // en compu, una línea horizontal; en celular, un tramo vertical entre cada paso
    const linea = horizontal ? el.querySelectorAll(".proceso-linea") : el.querySelectorAll(".proceso-tramo");
    const bolas = el.querySelectorAll(".proceso-num");
    const textos = el.querySelectorAll(".proceso-texto");
    // estado inicial: todo escondido hasta que la sección entre en pantalla
    const inicio = animate([...bolas, ...textos], { opacity: 0, duration: 0 });
    const lineaInicio = animate(linea, horizontal ? { scaleX: 0, duration: 0 } : { scaleY: 0, duration: 0 });

    let tl: ReturnType<typeof createTimeline> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        tl = createTimeline({ defaults: { ease: "outCubic" } });
        tl.add(linea, horizontal ? { scaleX: [0, 1], duration: 1100 } : { scaleY: [0, 1], duration: 300, delay: stagger(260) });
        tl.add(bolas, { opacity: [0, 1], scale: [0.4, 1], duration: 450, delay: stagger(260), ease: "outBack(2)" }, 0).add(
          textos,
          { opacity: [0, 1], translateY: [10, 0], duration: 500, delay: stagger(260) },
          150,
        );
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      inicio.revert();
      lineaInicio.revert();
      tl?.revert();
    };
  }, []);

  return (
    <section id="proceso" className="py-16 sm:py-24 border-t border-linea" aria-labelledby="proceso-titulo">
      <div className="contenedor">
        <div className="max-w-2xl aparece">
          <p className="etiqueta">Cómo trabajamos</p>
          <h2 id="proceso-titulo" className="mt-3 text-[1.75rem] sm:text-[2.2rem]">
            De la primera plática a su sistema funcionando.
          </h2>
        </div>

        <ol ref={raiz} className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
          {/* línea que une los pasos: vertical en celular, horizontal en compu */}
          <span
            aria-hidden
            className="proceso-linea absolute hidden md:block left-[22px] right-[calc(25%-40px)] top-[21px] h-0.5 origin-left bg-acento/40"
          />
          {PASOS.map((p, i) => (
            <li key={p.titulo} className="relative flex gap-5 md:block">
              {i < PASOS.length - 1 && (
                <span aria-hidden className="proceso-tramo absolute left-[21px] top-11 -bottom-8 w-0.5 origin-top bg-acento/40 md:hidden" />
              )}
              <span className="proceso-num relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-marino text-[1.05rem] font-bold text-white ring-4 ring-white">
                {i + 1}
              </span>
              <div className="proceso-texto md:mt-5">
                <h3 className="text-[1.15rem]">{p.titulo}</h3>
                <p className="mt-1.5 text-suave">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Preguntas() {
  return (
    <section id="preguntas" className="py-16 sm:py-24 bg-fondo border-y border-linea" aria-labelledby="preguntas-titulo">
      <div className="contenedor grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="aparece">
          <p className="etiqueta">Preguntas frecuentes</p>
          <h2 id="preguntas-titulo" className="mt-3 text-[1.75rem] sm:text-[2.2rem]">
            Lo que más nos preguntan.
          </h2>
          <p className="mt-3 text-suave">¿Tiene otra duda? Escríbame por WhatsApp y se la respondo.</p>
        </div>
        <div className="divide-y divide-linea rounded-xl border border-linea bg-white aparece">
          {PREGUNTAS.map((q) => (
            <details key={q.p} className="group px-5 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold text-tinta [&::-webkit-details-marker]:hidden">
                {q.p}
                <ChevronDown aria-hidden className="h-5 w-5 shrink-0 text-suave transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="pb-5 -mt-1 text-suave">{q.r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
