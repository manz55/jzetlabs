/*
 * Movimiento de la demo: entrada escalonada de las habitaciones, el total que cuenta
 * hasta su nuevo valor (anime.js) y la pausa corta que deja ver el esqueleto de carga.
 * Si la persona pidió menos movimiento, todo cambia al instante.
 */
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { animate, stagger } from "animejs";

export const sinMovimiento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function irA(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: sinMovimiento() ? "instant" : "smooth", block: "start" });
}

/* true mientras la clave nueva todavía "se está consultando" */
export function useDemora(clave: string, ms: number) {
  const [lista, setLista] = useState(clave);
  useEffect(() => {
    if (lista === clave) return;
    const t = window.setTimeout(() => setLista(clave), sinMovimiento() ? 0 : ms);
    return () => window.clearTimeout(t);
  }, [clave, lista, ms]);
  return lista !== clave;
}

/* true desde la primera vez que el elemento asoma en la pantalla */
function useVisto(ref: RefObject<Element | null>) {
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
  return visto;
}

/* Anima los hijos con data-entra al asomar y cada vez que cambia "clave". */
export function useEscalonado(ref: RefObject<HTMLElement | null>, clave: string, listo: boolean) {
  const visto = useVisto(ref);
  useLayoutEffect(() => {
    if (!visto || !listo || sinMovimiento()) return;
    const fichas = ref.current?.querySelectorAll<HTMLElement>("[data-entra]");
    if (!fichas?.length) return;
    const entrada = animate(fichas, { opacity: [0, 1], translateY: [22, 0], delay: stagger(80), duration: 560, ease: "outCubic" });
    /* seguro: si el navegador frena los cuadros, las fichas no se quedan invisibles */
    const seguro = window.setTimeout(() => entrada.complete(), 1600);
    return () => {
      window.clearTimeout(seguro);
      entrada.revert();
    };
  }, [ref, clave, listo, visto]);
}

/*
 * Cuenta desde la cifra que se ve hasta la nueva. El elemento debe tener como único hijo
 * el texto formato(valor), y "formato" debe ser una función fija (no creada en cada pintada).
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
    const a = animate(paso, { n: valor, duration: 650, ease: "outCubic", onUpdate: () => poner(paso.n) });
    const seguro = window.setTimeout(() => {
      a.cancel();
      poner(valor);
    }, 1200);
    return () => {
      window.clearTimeout(seguro);
      a.cancel();
    };
  }, [ref, valor, formato]);
}
