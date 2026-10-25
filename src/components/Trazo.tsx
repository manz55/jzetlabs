/*
 * Envuelve un garabato SVG (flecha, subrayado, círculo) para que se dibuje
 * solo cuando aparece. Sin anime.js o con "reducir movimiento" se ve completo.
 */
import type { ReactNode } from "react";
import { useAlAparecer } from "@/lib/anime";

export function Trazo({ children, className = "", retraso = 0, duracion = 900 }: { children: ReactNode; className?: string; retraso?: number; duracion?: number }) {
  const ref = useAlAparecer<HTMLSpanElement>(
    (el, a) => {
      const lineas = a.svg.createDrawable(el.querySelectorAll("path"));
      a.animate(lineas, { draw: ["0 0", "0 1"], duration: duracion, delay: a.stagger(140, { start: retraso }), ease: "inOutQuad" });
    },
    {
      umbral: 0.5,
      preparar: (el, a) => {
        a.svg.createDrawable(el.querySelectorAll("path"), 0, 0);
      },
    },
  );
  return (
    <span ref={ref} className={`inline-block ${className}`} aria-hidden>
      {children}
    </span>
  );
}
