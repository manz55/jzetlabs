/* Movimiento de la demo (anime.js). Si la persona pidió menos movimiento, todo cambia al instante. */
import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { animate, stagger } from "animejs";

const sinMovimiento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function irA(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: sinMovimiento() ? "instant" : "smooth", block: "start" });
}

/* true mientras la clave nueva todavía "se está cargando" (también la primera vez) */
export function useCarga(clave: string, ms: number) {
  const [lista, setLista] = useState("");
  useEffect(() => {
    const t = window.setTimeout(() => setLista(clave), ms);
    return () => window.clearTimeout(t);
  }, [clave, ms]);
  return lista !== clave;
}

/* anima los hijos con data-entra cada vez que cambia "clave" y ya están pintados */
export function useEscalonado(ref: RefObject<HTMLElement | null>, clave: string, listo = true) {
  useLayoutEffect(() => {
    if (!listo || sinMovimiento()) return;
    const fichas = ref.current?.querySelectorAll<HTMLElement>("[data-entra]");
    if (!fichas?.length) return;
    const entrada = animate(fichas, { opacity: [0, 1], translateY: [18, 0], delay: stagger(60), duration: 450, ease: "outCubic" });
    /* seguro: si el navegador frena los cuadros, nada se queda invisible */
    const seguro = window.setTimeout(() => entrada.complete(), 1400);
    return () => {
      window.clearTimeout(seguro);
      entrada.revert();
    };
  }, [ref, clave, listo]);
}
