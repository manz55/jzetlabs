/*
 * Portada con fotos (idea inspirada en el movimiento de la plantilla Halden, sin copiar su diseño):
 * 1. Entrada: en el centro pasan la foto de Joshua y los 4 trabajos reales, con
 *    "Lo que hoy hace" … "a mano." a los lados.
 * 2. La tarjeta viaja y se vuelve la "pastilla" dentro del título.
 * 3. Al bajar, la pastilla crece hasta llenar la pantalla con la foto de Joshua.
 * La entrada dura menos de 2 s, se salta con un toque y solo sale la primera vez
 * por visita. Con "reducir movimiento" se ve todo quieto.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import foto from "@/assets/joshua.jpg";
import fotoGrande from "@/assets/joshua-grande.jpg";
import dannyDesk from "@/assets/portfolio/danny-desk.jpg";
import gomiDesk from "@/assets/portfolio/gomideli-desk.jpg";
import efamicMob from "@/assets/portfolio/efamic-mob.jpg";
import maestrosMob from "@/assets/portfolio/maestros-mob-grupos.jpg";
import { WA_HOLA } from "@/data/site";
import { IconoWhatsApp } from "./Secciones";

const FOTOS = [
  { src: foto, pos: "50% 42%" },
  { src: dannyDesk, pos: "30% 30%" },
  { src: gomiDesk, pos: "40% 35%" },
  { src: efamicMob, pos: "50% 38%" },
  { src: maestrosMob, pos: "50% 22%" },
];
/* cuánto se queda cada foto en la entrada (ms) */
const TIEMPOS = [650, 260, 260, 260, 300];

function Fotos({ i }: { i: number }) {
  return (
    <>
      {FOTOS.map((f, k) => (
        <img
          key={k}
          src={f.src}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ objectPosition: f.pos, opacity: k === i ? 1 : 0 }}
        />
      ))}
    </>
  );
}

export function PortadaFotos() {
  const escena = useRef<HTMLElement>(null);
  const pegado = useRef<HTMLDivElement>(null);
  const contenido = useRef<HTMLDivElement>(null);
  const pastilla = useRef<HTMLSpanElement>(null);
  const tarjeta = useRef<HTMLDivElement>(null);
  const palabras = useRef<HTMLDivElement>(null);
  const capa = useRef<HTMLDivElement>(null);
  const textoCapa = useRef<HTMLDivElement>(null);
  const saltar = useRef<() => void>(() => {});

  const [mover, setMover] = useState(false);
  const [intro, setIntro] = useState(false);
  const [i, setI] = useState(0);

  // decidir antes de pintar: con movimiento, y la entrada solo la primera vez
  useLayoutEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setMover(true);
    if (!sessionStorage.getItem("jz-entrada")) setIntro(true);
  }, []);

  // 1 y 2: la entrada
  useLayoutEffect(() => {
    if (!intro) return;
    sessionStorage.setItem("jz-entrada", "1");
    const c = pegado.current!.getBoundingClientRect();
    const t = tarjeta.current!;
    const ancho = Math.min(150, c.width * 0.3);
    const alto = ancho * 1.25;
    Object.assign(t.style, { width: `${ancho}px`, height: `${alto}px`, left: `${(c.width - ancho) / 2}px`, top: `${(c.height - alto) / 2}px` });

    animate(t, { scale: [0.7, 1], opacity: [0, 1], duration: 450, ease: "outCubic" });
    animate(palabras.current!.children, { opacity: [0, 1], translateY: [14, 0], delay: stagger(120), duration: 600, ease: "outCubic" });

    let paso = 0;
    let reloj = 0;
    let listo = false;
    const acomodar = () => {
      if (listo) return;
      listo = true;
      window.clearTimeout(reloj);
      const c2 = pegado.current!.getBoundingClientRect();
      const p = pastilla.current!.getBoundingClientRect();
      const r = t.getBoundingClientRect();
      animate(palabras.current!, { opacity: 0, duration: 250 });
      animate(t, {
        left: [r.left - c2.left, p.left - c2.left],
        top: [r.top - c2.top, p.top - c2.top],
        width: [r.width, p.width],
        height: [r.height, p.height],
        borderRadius: [14, p.height / 2],
        duration: 650,
        ease: "inOutCubic",
        onComplete: () => setIntro(false),
      });
      animate(contenido.current!.querySelectorAll(".pieza"), {
        opacity: [0, 1],
        translateY: [18, 0],
        delay: stagger(80, { start: 300 }),
        duration: 550,
        ease: "outCubic",
      });
      // respaldo: si el navegador pausó la animación (pestaña de fondo), mostrar todo igual
      reloj = window.setTimeout(() => {
        contenido.current?.querySelectorAll<HTMLElement>(".pieza").forEach((n) => {
          n.style.opacity = "1";
          n.style.transform = "none";
        });
        setIntro(false);
      }, 1600);
    };
    const siguiente = () => {
      paso += 1;
      if (paso < FOTOS.length) {
        setI(paso);
        reloj = window.setTimeout(siguiente, TIEMPOS[paso]);
      } else acomodar();
    };
    reloj = window.setTimeout(siguiente, TIEMPOS[0]);
    saltar.current = acomodar;
    return () => window.clearTimeout(reloj);
  }, [intro]);

  // la pastilla sigue pasando fotos despacio
  useEffect(() => {
    if (!mover || intro) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % FOTOS.length), 2400);
    return () => window.clearInterval(t);
  }, [mover, intro]);

  // 3: al bajar, la pastilla crece hasta llenar la pantalla
  useEffect(() => {
    if (!mover) return;
    let caja = { t: 0, l: 0, r: 0, b: 0, h: 0 };
    let cuadro = 0;
    const medir = () => {
      const c = pegado.current!.getBoundingClientRect();
      const p = pastilla.current!.getBoundingClientRect();
      caja = { t: p.top - c.top, l: p.left - c.left, r: c.right - p.right, b: c.bottom - p.bottom, h: p.height };
    };
    const pintar = () => {
      cuadro = 0;
      const s = escena.current!;
      const recorrido = Math.max(1, (s.offsetHeight - innerHeight) * 0.8);
      const x = Math.min(1, Math.max(0, -s.getBoundingClientRect().top / recorrido));
      const e = 1 - Math.pow(1 - x, 2); // sale rápido, llega suave
      const f = 1 - e;
      const capaEl = capa.current!;
      capaEl.style.clipPath = `inset(${caja.t * f}px ${caja.r * f}px ${caja.b * f}px ${caja.l * f}px round ${(caja.h / 2) * f + 0}px)`;
      capaEl.style.opacity = x > 0.001 ? "1" : "0";
      capaEl.style.pointerEvents = x > 0.85 ? "auto" : "none";
      contenido.current!.style.opacity = String(Math.max(0, 1 - x * 1.8));
      textoCapa.current!.style.opacity = String(Math.min(1, Math.max(0, (x - 0.7) / 0.25)));
    };
    const pedir = () => {
      if (!cuadro) cuadro = requestAnimationFrame(pintar);
    };
    const alCambiarTamano = () => {
      medir();
      pedir();
    };
    medir();
    pintar();
    addEventListener("scroll", pedir, { passive: true });
    addEventListener("resize", alCambiarTamano);
    return () => {
      removeEventListener("scroll", pedir);
      removeEventListener("resize", alCambiarTamano);
      cancelAnimationFrame(cuadro);
    };
  }, [mover, intro]);

  return (
    <section id="inicio" ref={escena} className={`portada-papel border-b border-linea ${mover ? "h-[220svh]" : ""}`}>
      <div ref={pegado} className={`${mover ? "sticky top-0 h-[100svh] overflow-hidden" : ""} relative`}>
        {/* contenido final */}
        <div
          ref={contenido}
          className={`contenedor flex flex-col items-center justify-center text-center pt-24 pb-14 ${mover ? "h-full" : "min-h-[85svh]"} ${intro ? "[&_.pieza]:opacity-0" : ""}`}
        >
          <p className="pieza etiqueta">Páginas web y sistemas · Guatemala</p>
          <h1 className="pieza mt-4 max-w-5xl text-[2.25rem] sm:text-[3.3rem] lg:text-[4.1rem] leading-[1.1]">
            Lo que hoy hace{" "}
            <span
              ref={pastilla}
              aria-hidden
              className={`relative inline-block align-middle -mt-[0.12em] w-[2.1em] h-[0.92em] rounded-full overflow-hidden bg-linea ring-1 ring-black/10 ${intro ? "invisible" : ""}`}
            >
              <Fotos i={i} />
            </span>{" "}
            <span className="font-[family-name:var(--font-mano)] font-semibold text-acento text-[1.18em] leading-none">a mano,</span>
            <br className="hidden lg:block" />{" "}
            lo pasamos a una página o a un sistema.
          </h1>
          <p className="pieza mt-6 max-w-2xl text-[1.05rem] sm:text-[1.15rem] text-texto">
            Ya lo hice para un plomero, una tienda, una empresa y una iglesia, y con gusto lo hago para su negocio. Usted trata directo conmigo.
          </p>
          <div className="pieza mt-6 flex flex-wrap items-baseline justify-center gap-x-5 gap-y-1 text-marino">
            <span>
              <span className="text-suave text-[0.9rem]">Páginas desde </span>
              <b className="font-[family-name:var(--font-titulo)] text-[1.35rem]">Q1,000</b>
            </span>
            <span>
              <span className="text-suave text-[0.9rem]">Sistemas desde </span>
              <b className="font-[family-name:var(--font-titulo)] text-[1.35rem]">Q2,000</b>
            </span>
            <span className="text-sm font-semibold text-acento">Pago único</span>
          </div>
          <div className="pieza mt-7 flex flex-col sm:flex-row gap-3 w-full sm:w-auto [&>a]:whitespace-nowrap">
            <a href={WA_HOLA} target="_blank" rel="noopener noreferrer" className="btn btn-principal">
              <IconoWhatsApp /> Escribirme por WhatsApp
            </a>
            <a href="#trabajos" className="btn btn-secundario">
              Ver mis trabajos
            </a>
          </div>
        </div>

        {/* 3: foto que crece al bajar */}
        <div
          ref={capa}
          className={mover ? "absolute inset-0 z-10" : "relative h-[75svh]"}
          style={mover ? { opacity: 0, pointerEvents: "none" } : undefined}
        >
          <img src={fotoGrande} alt="Joshua Zet sentado frente a las montañas de Guatemala" className="absolute inset-0 w-full h-full object-cover object-[50%_28%]" loading="eager" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,26,49,.82),rgba(8,26,49,.15)_55%,transparent)]" />
          <div ref={textoCapa} className="absolute inset-x-0 bottom-0 contenedor pb-12 sm:pb-16" style={mover ? { opacity: 0 } : undefined}>
            <p className="nota-mano text-[#9fe0bf] text-[2.1rem] sm:text-[2.6rem]">Hola, soy Joshua.</p>
            <p className="mt-2 max-w-xl text-white text-[1.15rem] sm:text-[1.35rem] leading-snug">
              Trabajo solo, de principio a fin. Usted me cuenta, yo lo construyo y yo le enseño cómo funciona.
            </p>
            <a href="#trabajos" className="mt-6 btn bg-white text-marino hover:bg-white/90">
              Ver mis trabajos
            </a>
          </div>
        </div>

        {/* 1: entrada (se salta con un toque) */}
        {intro && (
          <div className="absolute inset-0 z-20 cursor-pointer" onClick={() => saltar.current()} aria-hidden>
            <div ref={palabras} className="absolute inset-0 flex flex-col items-center justify-center gap-[210px] sm:flex-row sm:gap-[320px] px-4 font-[family-name:var(--font-titulo)] font-bold text-tinta text-[1.15rem] sm:text-[2rem]">
              <span>Lo que hoy hace</span>
              <span className="font-[family-name:var(--font-mano)] text-acento text-[1.5rem] sm:text-[2.6rem]">a mano.</span>
            </div>
            <div ref={tarjeta} className="absolute overflow-hidden rounded-[14px] shadow-[0_20px_40px_-18px_rgba(11,37,69,.5)] bg-linea" style={{ opacity: 0 }}>
              <Fotos i={i} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
