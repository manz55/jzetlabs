/*
 * Demostración en vivo de la portada (datos de prueba):
 * el empleado marca con huella en el celular → el panel recibe el marcaje
 * → el total de la planilla se actualiza solo. Se repite en ciclo.
 * Con "reducir movimiento" se queda quieta en el estado final.
 */
import { useEffect, useRef, useState } from "react";
import panelPlanilla from "@/assets/sistema/panel-planilla.jpg";

type Fase = "espera" | "leyendo" | "listo";

const ANTES = 5218.23;
const DESPUES = 5283.23;
const q = (n: number) =>
  "Q" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function usarCiclo() {
  const quieto = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [fase, setFase] = useState<Fase>(quieto ? "listo" : "espera");
  const [total, setTotal] = useState(quieto ? DESPUES : ANTES);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (quieto) return;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (ref.current) io.observe(ref.current);
    const timers: number[] = [];
    let raf = 0;
    const contar = () => {
      const t0 = performance.now();
      const paso = (t: number) => {
        const p = Math.min(1, (t - t0) / 900);
        setTotal(ANTES + (DESPUES - ANTES) * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(paso);
      };
      raf = requestAnimationFrame(paso);
    };
    const vuelta = () => {
      if (!visible) { timers.push(window.setTimeout(vuelta, 800)); return; }
      setFase("espera"); setTotal(ANTES);
      timers.push(window.setTimeout(() => setFase("leyendo"), 1400));
      timers.push(window.setTimeout(() => { setFase("listo"); contar(); }, 2900));
      timers.push(window.setTimeout(vuelta, 7600));
    };
    vuelta();
    return () => { timers.forEach(clearTimeout); cancelAnimationFrame(raf); io.disconnect(); };
  }, [quieto]);

  return { fase, total, ref };
}

function Huella({ fase }: { fase: Fase }) {
  const listo = fase === "listo";
  return (
    <div className="relative w-[68px] h-[68px] mx-auto scale-[.8] sm:scale-100">
      <svg viewBox="0 0 68 68" className="absolute inset-0" aria-hidden>
        <circle cx="34" cy="34" r="31" fill={listo ? "#1a7f4e" : "#eef2f7"} style={{ transition: "fill .35s" }} />
        <circle
          cx="34" cy="34" r="31" fill="none" stroke="#1a7f4e" strokeWidth="3" strokeLinecap="round"
          strokeDasharray="195" strokeDashoffset={fase === "espera" ? 195 : 0}
          transform="rotate(-90 34 34)"
          style={{ transition: fase === "leyendo" ? "stroke-dashoffset 1.4s linear" : "none" }}
        />
      </svg>
      {listo ? (
        <svg viewBox="0 0 68 68" className="absolute inset-0" aria-hidden>
          <path d="M22 35l8 8 16-17" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="absolute inset-[18px]" fill="none" stroke="#13315c" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
          <path d="M6.5 8.5a6.5 6.5 0 0 1 11 0" />
          <path d="M5 13c0-4 3.1-6.8 7-6.8s7 2.8 7 6.8v1" />
          <path d="M8.5 19.5c-.6-1.3-1-3-1-5 0-2.7 2-4.6 4.5-4.6s4.5 1.9 4.5 4.6v1.6" />
          <path d="M12 13.5v1.5c0 2.4.6 4.3 1.6 5.6" />
          <path d="M15.5 19c.4-.8.7-1.8.9-2.9" />
        </svg>
      )}
    </div>
  );
}

function Flecha({ className, d }: { className: string; d: string }) {
  return (
    <svg viewBox="0 0 120 70" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export function PortadaVivo() {
  const { fase, total, ref } = usarCiclo();
  const listo = fase === "listo";

  return (
    <figure ref={ref} className="relative pt-7 pb-16 md:pb-28 lg:pl-4">
      {/* Panel del encargado, como una hoja sobre el escritorio */}
      <div className="relative w-[82%] sm:w-[88%] lg:w-full rotate-[-1.5deg] rounded-lg bg-white p-2 sm:p-2.5 shadow-[0_1px_2px_rgba(11,37,69,.08),0_22px_44px_-22px_rgba(11,37,69,.45)]">
        <img
          src={panelPlanilla}
          alt="Panel del encargado con la planilla de la quincena por empleado"
          width={1600} height={1000}
          className="block w-full h-auto rounded"
          fetchPriority="high"
        />
      </div>

      {/* Total que se actualiza solo */}
      <div className="absolute left-[17%] sm:left-[30%] lg:left-[33%] top-0 rotate-[1deg] rounded-lg bg-white border border-linea px-3 py-2 sm:px-4 sm:py-3 shadow-[0_14px_30px_-14px_rgba(11,37,69,.45)]">
        <div className="text-[0.72rem] text-suave">Total de la quincena</div>
        <div className="font-titulo text-[1.35rem] sm:text-[1.6rem] font-bold text-tinta tabular-nums leading-tight">{q(total)}</div>
        <div className={`text-[0.72rem] font-medium text-acento transition-opacity duration-300 ${listo ? "opacity-100" : "opacity-0"}`}>
          + marcaje de Marvin E.
        </div>
      </div>

      {/* Aviso que llega al panel */}
      <div
        className={`absolute z-10 left-0 sm:left-[6%] bottom-0 md:bottom-12 max-w-[57%] sm:max-w-none flex items-center gap-2.5 rounded-lg bg-marino text-white pl-3 pr-4 py-2.5 text-[0.8rem] shadow-[0_14px_30px_-12px_rgba(11,37,69,.6)] transition-all duration-500 ${listo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
        aria-hidden
      >
        <span className="grid place-items-center w-6 h-6 rounded-full bg-acento shrink-0">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>
        </span>
        <span className="leading-snug"><b className="font-semibold">Marvin Estrada</b> <span className="sm:hidden"><br /></span>marcó entrada · 07:02<br /><span className="text-[#c7d2e0]">Taller, zona 12 · con huella</span></span>
      </div>

      {/* Celular del colaborador, con el marcaje en vivo */}
      <div className="absolute right-0 sm:-right-2 top-12 sm:top-8 w-[42%] sm:w-[36%] max-w-[205px] rotate-[3deg] rounded-[1.6rem] border-[6px] border-tinta bg-tinta shadow-[0_24px_44px_-18px_rgba(11,37,69,.6)]">
        <div className="rounded-[1.15rem] bg-white overflow-hidden aspect-[9/17] flex flex-col items-center text-center px-3 pt-4 pb-3">
          <div className="text-[0.6rem] text-suave">Jueves 6 nov.</div>
          <div className="font-titulo text-[1.9rem] sm:text-[2.2rem] font-bold text-tinta leading-none mt-1 tabular-nums">07:02</div>
          <div className="mt-2 text-[0.72rem] text-texto"><span className="hidden sm:inline">Buenos días,</span><span className="sm:hidden">Hola,</span> <b className="text-tinta">Marvin</b></div>
          <div className="mt-2 hidden sm:inline-flex items-center gap-1 rounded-full bg-[#eef2f7] px-2 py-0.5 text-[0.6rem] text-marino-2">
            <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" aria-hidden><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" /></svg>
            Taller, zona 12
          </div>
          <div className="flex-1 grid place-items-center w-full">
            <Huella fase={fase} />
          </div>
          <div className="min-h-[2.4rem] text-[0.62rem] sm:text-[0.68rem] leading-snug">
            {fase === "espera" && <span className="text-suave">Ponga su dedo para marcar entrada</span>}
            {fase === "leyendo" && <span className="text-marino-2 font-medium">Leyendo huella…</span>}
            {listo && (
              <span>
                <b className="block text-acento text-[0.74rem]">Entrada registrada</b>
                <span className="text-suave">Ubicación verificada</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Notas a mano */}
      <div className="hidden md:flex absolute right-0 bottom-0 w-[250px] items-end gap-1 text-marino-2">
        <p className="nota-mano text-right">así marca su equipo, aunque no haya señal</p>
        <Flecha className="w-12 h-14 shrink-0 mb-6" d="M20 64c22-8 34-26 30-56M42 14l8-6 6 9" />
      </div>
      <div className="hidden md:block absolute left-[8%] lg:left-[6%] top-[-3.8rem] w-[230px] text-marino-2"><div className="flex items-start gap-1"><span className="nota-mano">y la planilla se suma sola</span></div>
        <Flecha className="w-14 h-10 ml-[150px] -mt-1" d="M10 8c24 0 40 16 44 46M46 48l8 8 4-10" />
      </div>

      <figcaption className="sr-only">Demostración del sistema con datos de prueba: un colaborador marca entrada con huella y la planilla se actualiza.</figcaption>
    </figure>
  );
}
