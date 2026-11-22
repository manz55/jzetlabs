/*
 * Piezas de movimiento de la página de la clienta:
 * - Ventana: abre encima de la página, difumina el fondo y entra con un movimiento suave.
 * - Rev: hace aparecer lo que lleva dentro, de abajo hacia arriba, cuando llega a la pantalla.
 * Si la persona pidió menos movimiento en su teléfono, no se anima nada.
 */
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { animate } from "animejs";
import { X } from "lucide-react";
import { SUAVE, TINTA } from "./datos";

export const sinMovimiento = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function Rev({ i = 0, className = "", style, children }: { i?: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || sinMovimiento() || typeof IntersectionObserver === "undefined") return;
    el.style.opacity = "0";
    const salvar = window.setTimeout(() => { el.style.opacity = "1"; }, 2500);
    const ver = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      ver.disconnect();
      window.clearTimeout(salvar);
      animate(el, { opacity: [0, 1], translateY: [30, 0], scale: [0.94, 1], duration: 750, delay: (i % 6) * 80, ease: "outExpo" });
    }, { threshold: 0.12 });
    ver.observe(el);
    return () => { ver.disconnect(); window.clearTimeout(salvar); };
  }, [i]);
  return <div ref={ref} className={className} style={style}>{children}</div>;
}

export function Ventana({ titulo, alCerrar, ancho = "56rem", children }: { titulo: string; alCerrar: () => void; ancho?: string; children: ReactNode }) {
  const caja = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => { if (e.key === "Escape") alCerrar(); };
    window.addEventListener("keydown", alTeclear);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (caja.current && !sinMovimiento()) animate(caja.current, { opacity: [0, 1], translateY: [40, 0], scale: [0.94, 1], duration: 520, ease: "outExpo" });
    return () => { window.removeEventListener("keydown", alTeclear); document.body.style.overflow = antes; };
  }, [alCerrar]);
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6 print:hidden" style={{ background: "rgba(42,22,51,.45)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }} onClick={alCerrar}>
      <div ref={caja} role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => e.stopPropagation()} className="relative max-h-[94svh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl" style={{ maxWidth: ancho, color: TINTA }}>
        <button type="button" aria-label="Cerrar" onClick={alCerrar} className="pf-btn absolute right-3 top-3 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/95 shadow-md" style={{ color: TINTA, border: `2px solid ${SUAVE}` }}><X size={22} /></button>
        {children}
      </div>
    </div>
  );
}
