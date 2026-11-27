/*
 * Una cifra que cuenta desde lo que se veía hasta su nuevo valor. Va en <data> para heredar
 * la letra de donde se ponga: un <span> tomaría los estilos de las etiquetas de al lado.
 */
import { useLayoutEffect, useRef } from "react";
import { animate } from "animejs";
import { sinMovimiento } from "./animar";

type Props = {
  valor: number;
  formato: (n: number) => string;
  /* con "desde", la primera vez cuenta a partir de ese número */
  desde?: number;
};

export function Cifra({ valor, formato, desde }: Props) {
  const ref = useRef<HTMLDataElement>(null);
  const actual = useRef(desde ?? valor);
  const comoSeEscribe = useRef(formato);
  comoSeEscribe.current = formato;
  useLayoutEffect(() => {
    const texto = ref.current?.firstChild;
    if (!texto) return;
    const poner = (n: number) => {
      actual.current = n;
      texto.nodeValue = comoSeEscribe.current(n);
    };
    if (actual.current === valor || sinMovimiento()) {
      poner(valor);
      return;
    }
    const paso = { n: actual.current };
    poner(paso.n);
    const a = animate(paso, { n: valor, duration: 620, ease: "outCubic", onUpdate: () => poner(paso.n), onComplete: () => poner(valor) });
    const seguro = window.setTimeout(() => {
      a.cancel();
      poner(valor);
    }, 1100);
    return () => {
      window.clearTimeout(seguro);
      a.cancel();
    };
  }, [valor, formato]);
  return (
    <data ref={ref} value={valor}>
      {formato(valor)}
    </data>
  );
}
