/*
 * Movimiento del diario: una pausa corta que deja ver el esqueleto al cambiar de sección
 * y la entrada escalonada de las notas (anime.js). Si la persona pidió menos movimiento,
 * todo cambia al instante.
 */
import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { animate, stagger } from "animejs";

export const sinMovimiento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Devuelve la clave ya "cargada" y si todavía está cargando la nueva. */
export function useDemora<T extends string>(clave: T, ms: number) {
  const [lista, setLista] = useState(clave);
  useEffect(() => {
    if (lista === clave) return;
    const t = window.setTimeout(() => setLista(clave), ms);
    return () => window.clearTimeout(t);
  }, [clave, lista, ms]);
  return [lista, lista !== clave] as const;
}

/* Anima los elementos con data-entra cada vez que cambia "clave". */
export function useEscalonado(ref: RefObject<HTMLElement | null>, clave: string, listo: boolean) {
  useLayoutEffect(() => {
    if (!listo || sinMovimiento()) return;
    const piezas = ref.current?.querySelectorAll<HTMLElement>("[data-entra]");
    if (!piezas?.length) return;
    const entrada = animate(piezas, { opacity: [0, 1], translateY: [12, 0], delay: stagger(45), duration: 420, ease: "outCubic" });
    /* seguro: si el navegador frena los cuadros, las notas no se quedan invisibles */
    const seguro = window.setTimeout(() => entrada.complete(), 1600);
    return () => {
      window.clearTimeout(seguro);
      entrada.revert();
    };
  }, [ref, clave, listo]);
}
