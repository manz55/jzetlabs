/* Piezas que comparten las vistas: logo de letras, ventana, contador y cifra animada. */
import { useEffect, useRef, type ReactNode } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useCifra } from "./animar";
import { qz } from "./datos";

export function Logo() {
  return (
    <span className="bm-logo">
      BRASA <i>&amp;</i> MAÍZ
    </span>
  );
}

/* Ventana con <dialog>: en el celular sube desde abajo; en compu aparece al centro. */
export function Ventana({ abierta, alCerrar, titulo, nota, children, pie }: { abierta: boolean; alCerrar: () => void; titulo: string; nota?: string; children: ReactNode; pie?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const cuerpo = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierta && !d.open) {
      d.showModal();
      cuerpo.current?.scrollTo({ top: 0 });
    }
    if (!abierta && d.open) d.close();
  }, [abierta]);
  return (
    <dialog
      ref={ref}
      className="bm-ventana"
      aria-label={titulo}
      onClose={() => abierta && alCerrar()}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar();
      }}
    >
      {abierta && (
        <div className="bm-ventana-caja">
          <header className="bm-ventana-alto">
            <div>
              <h2>{titulo}</h2>
              {nota && <p>{nota}</p>}
            </div>
            <button type="button" className="bm-cerrar" onClick={alCerrar} aria-label="Cerrar">
              <X size={20} aria-hidden />
            </button>
          </header>
          <div ref={cuerpo} className="bm-ventana-cuerpo">
            {children}
          </div>
          {pie && <footer className="bm-ventana-pie">{pie}</footer>}
        </div>
      )}
    </dialog>
  );
}

export function Contador({ valor, alCambiar, que, min = 0, max = 20 }: { valor: number; alCambiar: (n: number) => void; que: string; min?: number; max?: number }) {
  return (
    <span className="bm-contador">
      <button type="button" disabled={valor <= min} onClick={() => alCambiar(valor - 1)} aria-label={valor === 1 && min === 0 ? `Quitar ${que}` : `Uno menos: ${que}`}>
        <Minus size={15} aria-hidden />
      </button>
      <b aria-live="polite">{valor}</b>
      <button type="button" disabled={valor >= max} onClick={() => alCambiar(valor + 1)} aria-label={`Uno más: ${que}`}>
        <Plus size={15} aria-hidden />
      </button>
    </span>
  );
}

/* el total cuenta desde la cifra anterior hasta la nueva */
export function Total({ valor, className }: { valor: number; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useCifra(ref, valor, qz);
  /* el texto lo maneja la animación; React solo pone el primero */
  const primero = useRef(qz(valor));
  return (
    <strong ref={ref} className={className}>
      {primero.current}
    </strong>
  );
}
