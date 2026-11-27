/*
 * Movimiento de la demo (anime.js), siempre con un propósito: la vista que entra, las
 * cifras que cuentan, las listas que aparecen en orden y el avance de una reparación.
 * Si la persona pidió menos movimiento, todo cambia al instante.
 */
import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { animate, stagger } from "animejs";
import { sinMovimiento } from "../hotel/animar";

export { irA, sinMovimiento, useDemora } from "../hotel/animar";

/* entrada suave de la vista cada vez que cambia */
export function useEntradaVista(ref: RefObject<HTMLElement | null>, vista: string) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || sinMovimiento()) return;
    /* al terminar se limpia la transformación para no afectar lo que va fijo adentro */
    const limpiar = () => {
      el.style.removeProperty("transform");
      el.style.removeProperty("opacity");
      el.style.removeProperty("translate");
    };
    const a = animate(el, { opacity: [0, 1], translateY: [10, 0], duration: 340, ease: "outCubic", onComplete: limpiar });
    const seguro = window.setTimeout(() => a.complete(), 900);
    return () => {
      window.clearTimeout(seguro);
      a.revert();
      limpiar();
    };
  }, [ref, vista]);
}

/* los hijos con data-entra aparecen uno tras otro al asomar y cada vez que cambia "clave" */
export function useEscalonado(ref: RefObject<HTMLElement | null>, clave: string, paso: number, listo = true) {
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ojo = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        ojo.disconnect();
        setVisto(true);
      },
      { threshold: 0.01 },
    );
    ojo.observe(el);
    return () => ojo.disconnect();
  }, [ref]);
  useLayoutEffect(() => {
    if (!visto || !listo || sinMovimiento()) return;
    const fichas = ref.current?.querySelectorAll<HTMLElement>("[data-entra]");
    if (!fichas?.length) return;
    const a = animate(fichas, { opacity: [0, 1], translateY: [14, 0], delay: stagger(paso), duration: 420, ease: "outCubic" });
    /* seguro: si el navegador frena los cuadros, nada se queda invisible */
    const seguro = window.setTimeout(() => a.complete(), 600 + fichas.length * paso);
    return () => {
      window.clearTimeout(seguro);
      a.revert();
    };
  }, [ref, clave, paso, listo, visto]);
}
