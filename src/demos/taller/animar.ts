/*
 * Movimiento de la demo (anime.js): el cambio de vista, la entrada escalonada del catálogo,
 * las cifras que cuentan y el avance de la línea de tiempo.
 * Si la persona pidió menos movimiento, todo cambia al instante.
 */
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { animate, stagger } from "animejs";

export const sinMovimiento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function irA(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: sinMovimiento() ? "instant" : "smooth", block: "start" });
}

/* la vista nueva entra subiendo y apareciendo */
export function useVista(ref: RefObject<HTMLElement | null>, vista: string) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || sinMovimiento()) return;
    const a = animate(el, { opacity: [0, 1], translateY: [18, 0], duration: 460, ease: "outCubic" });
    /* seguro: si el navegador frena los cuadros, nada se queda invisible */
    const seguro = window.setTimeout(() => a.complete(), 900);
    return () => {
      window.clearTimeout(seguro);
      a.revert();
    };
  }, [ref, vista]);
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
    const entrada = animate(fichas, { opacity: [0, 1], translateY: [22, 0], delay: stagger(65), duration: 500, ease: "outCubic" });
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
export function useCifra(ref: RefObject<HTMLElement | null>, valor: number, formato: (n: number) => string, desde: number) {
  const actual = useRef(desde);
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
    const a = animate(paso, { n: valor, duration: 700, ease: "outCubic", onUpdate: () => poner(paso.n) });
    const seguro = window.setTimeout(() => {
      a.cancel();
      poner(valor);
    }, 1100);
    return () => {
      window.clearTimeout(seguro);
      a.cancel();
    };
  }, [ref, valor, formato]);
}

/*
 * Línea de tiempo: la variable --av va de 0 a 4 (un tramo por unidad). Al cambiar de orden
 * se llena desde cero; al avanzar de etapa, desde donde estaba.
 */
export function useLinea(ref: RefObject<HTMLElement | null>, orden: string, avance: number) {
  const antes = useRef({ orden: "", valor: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nueva = antes.current.orden !== orden;
    const paso = { n: nueva ? 0 : antes.current.valor };
    const poner = (n: number) => {
      antes.current = { orden, valor: n };
      el.style.setProperty("--av", String(n));
    };
    if (sinMovimiento()) {
      poner(avance);
      return;
    }
    poner(paso.n);
    const linea = animate(paso, { n: avance, duration: 900, ease: "inOutCubic", onUpdate: () => poner(paso.n) });
    const puntos = nueva ? animate(el.querySelectorAll("[data-punto]"), { scale: [0.4, 1], opacity: [0, 1], delay: stagger(110), duration: 420, ease: "outBack" }) : null;
    const actual = !nueva ? el.querySelector('[aria-current="step"] [data-punto]') : null;
    const latido = actual ? animate(actual, { scale: [1.45, 1], delay: 650, duration: 520, ease: "outBack" }) : null;
    const seguro = window.setTimeout(() => {
      linea.cancel();
      puntos?.complete();
      latido?.complete();
      poner(avance);
    }, 1600);
    return () => {
      window.clearTimeout(seguro);
      linea.cancel();
      puntos?.revert();
      latido?.revert();
    };
  }, [ref, orden, avance]);
}
