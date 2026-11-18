/*
 * Portada con fotos (idea inspirada en el movimiento de la plantilla Halden, sin copiar su diseño):
 * El texto sale desde el primer momento (prueba de 5 segundos: qué hago, para
 * quién, para qué sirve y cuánto cuesta). La "pastilla" del título va pasando
 * la foto de Joshua y los trabajos reales; al bajar, crece hasta llenar la
 * pantalla con la foto de Joshua. Con "reducir movimiento" se ve todo quieto.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import foto from "@/assets/joshua.jpg";
import fotoGrande from "@/assets/joshua-grande.jpg";
import dannyDesk from "@/assets/portfolio/danny-desk.jpg";
import gomiDesk from "@/assets/portfolio/gomideli-desk.jpg";
import efamicMob from "@/assets/portfolio/efamic-mob.jpg";
import maestrosMob from "@/assets/portfolio/maestros-mob-grupos.jpg";
import { WA_HOLA } from "@/data/site";
import { useTema } from "@/lib/tema";
import InkRidges from "./ui/ink-ridges";
import { abrirChat } from "./ChatWhatsApp";
import { IconoWhatsApp } from "./Secciones";

const FOTOS = [
  { src: foto, pos: "50% 42%" },
  { src: dannyDesk, pos: "30% 30%" },
  { src: gomiDesk, pos: "40% 35%" },
  { src: efamicMob, pos: "50% 38%" },
  { src: maestrosMob, pos: "50% 22%" },
];
/* rubros con demo para probar: el cliente se ve ahí en un vistazo */
const LATIENDA = "https://latienda-jzetlabs.vercel.app/";
const RUBROS = [
  { t: "Clínicas", href: "/demos/clinica/" },
  { t: "Tiendas", href: "/demos/ropa/" },
  { t: "Restaurantes", href: "/demos/restaurante/" },
  { t: "Gimnasios", href: "/demos/gimnasio/" },
  { t: "Empresas", href: `${LATIENDA}asistencia/empleado.html` },
];

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
  const capa = useRef<HTMLDivElement>(null);
  const textoCapa = useRef<HTMLDivElement>(null);

  const tema = useTema();
  const [vecesTema, setVecesTema] = useState(0);
  const temaAntes = useRef(tema);
  const [mover, setMover] = useState(false);
  // en celular: sol más chico y arriba, sin pájaros (pasarían sobre el texto)
  const [cel] = useState(() => typeof window !== "undefined" && matchMedia("(max-width: 640px)").matches);
  const [i, setI] = useState(0);

  // al cambiar de modo, las montañas se vuelven a pintar
  useEffect(() => {
    if (temaAntes.current === tema) return;
    temaAntes.current = tema;
    setVecesTema((n) => n + 1);
  }, [tema]);

  // decidir antes de pintar: con o sin movimiento
  useLayoutEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setMover(true);
  }, []);

  // la pastilla sigue pasando fotos despacio
  useEffect(() => {
    if (!mover) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % FOTOS.length), 2400);
    return () => window.clearInterval(t);
  }, [mover]);

  // al bajar, la pastilla crece hasta llenar la pantalla
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
  }, [mover]);

  return (
    <section id="inicio" ref={escena} className={`portada-papel ${mover ? "h-[220svh]" : ""}`}>
      <div ref={pegado} className={`${mover ? "sticky top-0 h-[100svh] overflow-hidden" : ""} relative`}>
        {/* fondo: montañas de tinta (se repintan al cambiar de modo; con luna en oscuro) */}
        <InkRidges
          className="!absolute inset-0 bg-papel text-marino oscuro:text-[#ead9c8]"
          layers={4}
          seed={11}
          horizon={0.36}
          mist={0.65}
          drift={0.04}
          parallax={0.02}
          paintIn={2600}
          sunPosition={cel ? [0.86, 0.9] : [0.84, 0.82]}
          sunSize={cel ? 0.032 : 0.055}
          sunColor="#b5402a"
          scrollDepth={0}
          clouds={0.3}
          glow={0.4}
          birds={cel ? 0 : 5}
          birdsEvery={16}
          grain={0.25}
          repintar={vecesTema}
        />
        {/* contenido final */}
        <div
          ref={contenido}
          className={`relative z-[1] contenedor flex flex-col items-center justify-center text-center pt-20 sm:pt-24 pb-10 sm:pb-14 ${mover ? "h-full" : "min-h-[85svh]"}`}
        >
          <p className="pieza etiqueta">Páginas web y sistemas · Guatemala</p>
          <h1 className="pieza mt-4 max-w-5xl text-[2.25rem] sm:text-[3.3rem] lg:text-[4.1rem] leading-[1.1]">
            Su página web y su sistema, hechos{" "}
            <span
              ref={pastilla}
              aria-hidden
              className={`relative inline-block align-middle -mt-[0.12em] w-[2.1em] h-[0.92em] rounded-full overflow-hidden bg-linea ring-1 ring-black/10`}
            >
              <Fotos i={i} />
            </span>{" "}
            <span className="font-[family-name:var(--font-mano)] font-semibold text-mano text-[1.18em] leading-none">a mano</span>
            <br className="hidden lg:block" />{" "}
            para su negocio.
          </h1>
          <p className="pieza mt-4 sm:mt-6 max-w-2xl text-[1rem] sm:text-[1.15rem] text-texto">
            Que sus clientes lo encuentren, agenden y le pidan por WhatsApp. Y usted deja el cuaderno y el Excel. Trata directo conmigo.
          </p>
          <div className="pieza mt-5 -mx-5 sm:mx-0 flex w-[calc(100%+2.5rem)] sm:w-auto items-center sm:justify-center gap-2 overflow-x-auto sm:flex-wrap px-5 sm:px-0 [scrollbar-width:none]">
            <span className="shrink-0 text-[0.9rem] text-suave">Pruebe una demo:</span>
            {RUBROS.map((r) => (
              <a
                key={r.t}
                href={r.href}
                {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="shrink-0 rounded-full border border-marino/15 bg-papel/80 backdrop-blur-sm px-3.5 py-1.5 text-[0.92rem] font-semibold text-marino oscuro:text-tinta oscuro:border-white/15 transition hover:border-acento hover:text-acento active:scale-95"
              >
                {r.t}
              </a>
            ))}
          </div>
          <div className="pieza mt-4 sm:mt-6 flex flex-wrap items-baseline justify-center gap-x-5 gap-y-1 rounded-2xl sm:rounded-full bg-papel/80 backdrop-blur-sm px-5 py-1.5 text-marino oscuro:text-tinta">
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
          <div className="pieza mt-5 sm:mt-7 flex flex-col sm:flex-row gap-3 w-full sm:w-auto [&>a]:whitespace-nowrap">
            <a href={WA_HOLA} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); abrirChat(); }} className="btn btn-principal">
              <IconoWhatsApp /> Escribirme por WhatsApp
            </a>
            <a href="#trabajos" className="btn btn-secundario">
              Ver mis trabajos
            </a>
          </div>
        </div>

        {/* foto que crece al bajar */}
        <div
          ref={capa}
          className={`bg-marino ${mover ? "absolute inset-0 z-10" : "relative h-[75svh]"}`}
          style={mover ? { opacity: 0, pointerEvents: "none" } : undefined}
        >
          <img
            src={fotoGrande}
            alt="Joshua Zet sentado frente a las montañas de Guatemala"
            className="absolute inset-y-0 right-0 w-full lg:w-1/2 h-full object-cover object-[50%_28%] lg:object-[50%_40%]"
            loading="eager"
          />
          <div className="absolute inset-0 lg:hidden bg-[linear-gradient(to_top,rgba(28,23,20,.82),rgba(28,23,20,.15)_55%,transparent)]" />
          <div
            ref={textoCapa}
            className="absolute inset-x-0 bottom-0 contenedor pb-12 sm:pb-16 lg:inset-y-0 lg:right-auto lg:w-1/2 lg:max-w-none lg:flex lg:flex-col lg:justify-center lg:pl-[max(4rem,calc((100vw-72rem)/2+2rem))] lg:pr-14 lg:pb-0"
            style={mover ? { opacity: 0 } : undefined}
          >
            <p className="nota-mano text-claro text-[2.1rem] sm:text-[2.6rem] lg:text-[3.4rem]">Hola, soy Joshua.</p>
            <p className="mt-2 max-w-xl text-white text-[1.15rem] sm:text-[1.35rem] lg:text-[1.7rem] leading-snug">
              Trabajo solo, de principio a fin. Usted me cuenta, yo lo construyo y yo le enseño cómo funciona.
            </p>
            <a href="#trabajos" className="mt-6 self-start btn !rounded-full bg-white text-marino hover:bg-white/90">
              Ver mis trabajos
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
