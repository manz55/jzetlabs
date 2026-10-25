/*
 * anime.js 4.4.1 llega por CDN (index.html, con SRI) como `window.anime`.
 * Reglas: si no cargó o la persona pidió "reducir movimiento", `anime()`
 * devuelve null y cada componente se queda quieto y completo.
 */
import { useEffect, useRef } from "react";

type Anime = typeof import("animejs");

declare global {
  interface Window {
    anime?: Anime;
  }
}

export function reduceMovimiento(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** anime.js listo para usar, o null si no hay que animar */
export function anime(): Anime | null {
  if (typeof window === "undefined" || reduceMovimiento()) return null;
  return window.anime ?? null;
}

/**
 * Corre `alAparecer` una sola vez, cuando el elemento entra en pantalla.
 * Así cada efecto arranca en su momento y no todos a la vez.
 */
export function useAlAparecer<T extends Element>(
  alAparecer: (el: T, a: Anime) => void | (() => void),
  opciones: { umbral?: number; preparar?: (el: T, a: Anime) => void } = {},
) {
  const umbral = opciones.umbral ?? 0.25;
  const ref = useRef<T>(null);
  const cb = useRef(alAparecer);
  const prep = useRef(opciones.preparar);
  cb.current = alAparecer;
  prep.current = opciones.preparar;

  useEffect(() => {
    const el = ref.current;
    const a = anime();
    if (!el || !a) return;
    // el estado "antes de aparecer" solo se pone si de verdad vamos a animar
    prep.current?.(el, a);
    let limpiar: void | (() => void);
    const io = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          io.disconnect();
          limpiar = cb.current(el, a);
        }
      },
      { threshold: umbral },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (typeof limpiar === "function") limpiar();
    };
  }, [umbral]);

  return ref;
}
