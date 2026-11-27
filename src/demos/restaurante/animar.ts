/*
 * Movimiento de la demo (anime.js): la entrada escalonada de la carta, el total que
 * cuenta hasta su cifra nueva y la pausa corta que deja ver el esqueleto de carga.
 * Si la persona pidió menos movimiento, todo cambia al instante.
 */
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { animate, stagger } from "animejs";

export const sinMovimiento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
export function useEscalonado(ref: RefObject<HTMLElement | null>, clave: string, listo: boolean) {
  useLayoutEffect(() => {
    if (!listo || sinMovimiento()) return;
    const fichas = ref.current?.querySelectorAll<HTMLElement>("[data-entra]");
    if (!fichas?.length) return;
    const entrada = animate(fichas, { opacity: [0, 1], translateY: [24, 0], delay: stagger(70), duration: 520, ease: "outCubic" });
    /* seguro: si el navegador frena los cuadros, nada se queda invisible */
    const seguro = window.setTimeout(() => entrada.complete(), 1500);
    return () => {
      window.clearTimeout(seguro);
      entrada.revert();
    };
  }, [ref, clave, listo]);
}

/*
 * Cuenta desde la cifra que se ve hasta la nueva. El elemento debe tener como único hijo
 * el texto formato(valor), y "formato" debe ser una función fija.
 */
export function useCifra(ref: RefObject<HTMLElement | null>, valor: number, formato: (n: number) => string) {
  const actual = useRef(valor);
  useLayoutEffect(() => {
    const texto = ref.current?.firstChild;
    if (!texto) return;
    const poner = (n: number) => {
      actual.current = n;
      texto.nodeValue = formato(Math.round(n));
    };
    if (actual.current === valor || sinMovimiento()) {
      poner(valor);
      return;
    }
    const paso = { n: actual.current };
    poner(paso.n);
    const a = animate(paso, { n: valor, duration: 600, ease: "outCubic", onUpdate: () => poner(paso.n) });
    const seguro = window.setTimeout(() => {
      a.cancel();
      poner(valor);
    }, 1000);
    return () => {
      window.clearTimeout(seguro);
      a.cancel();
    };
  }, [ref, valor, formato]);
}

/* un pequeño salto cuando cambia el número (no la primera vez) */
export function useSalto(ref: RefObject<HTMLElement | null>, valor: number) {
  const antes = useRef(valor);
  useLayoutEffect(() => {
    if (antes.current === valor) return;
    antes.current = valor;
    if (!ref.current || sinMovimiento()) return;
    const a = animate(ref.current, { scale: [1.35, 1], duration: 420, ease: "outBack" });
    return () => {
      a.revert();
    };
  }, [ref, valor]);
}
