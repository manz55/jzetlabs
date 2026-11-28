import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { animate, stagger } from "animejs";

export const sinMovimiento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function irA(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: sinMovimiento() ? "instant" : "smooth", block: "start" });
}

export function useCarga(clave: string, ms: number) {
  const [lista, setLista] = useState("");
  useEffect(() => {
    const t = window.setTimeout(() => setLista(clave), ms);
    return () => window.clearTimeout(t);
  }, [clave, ms]);
  return lista !== clave;
}

export function useEscalonado(ref: RefObject<HTMLElement | null>, clave: string, listo = true) {
  useLayoutEffect(() => {
    if (!listo || sinMovimiento()) return;
    const piezas = ref.current?.querySelectorAll<HTMLElement>("[data-entra]");
    if (!piezas?.length) return;
    const entrada = animate(piezas, { opacity: [0, 1], translateY: [18, 0], delay: stagger(60), duration: 440, ease: "outCubic" });
    // si el navegador frena los cuadros (pestaña en segundo plano), nada debe quedar invisible
    const seguro = window.setTimeout(() => entrada.complete(), 1600);
    return () => {
      window.clearTimeout(seguro);
      entrada.revert();
    };
  }, [ref, clave, listo]);
}
