import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { animate, stagger } from "animejs";

export const sinMovimiento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function irA(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: sinMovimiento() ? "instant" : "smooth", block: "start" });
}

// solo opacidad: un transform movería los elementos fijos
export function useVista(ref: RefObject<HTMLElement | null>, vista: string) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || sinMovimiento()) return;
    const a = animate(el, { opacity: [0, 1], duration: 420, ease: "outCubic" });
    // si el navegador frena los cuadros, nada debe quedar invisible
    const seguro = window.setTimeout(() => a.complete(), 800);
    return () => {
      window.clearTimeout(seguro);
      a.revert();
    };
  }, [ref, vista]);
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
    const fichas = ref.current?.querySelectorAll<HTMLElement>("[data-entra]");
    if (!fichas?.length) return;
    const entrada = animate(fichas, { opacity: [0, 1], translateY: [20, 0], delay: stagger(55), duration: 460, ease: "outCubic" });
    const seguro = window.setTimeout(() => entrada.complete(), 1700);
    return () => {
      window.clearTimeout(seguro);
      entrada.revert();
    };
  }, [ref, clave, listo]);
}
