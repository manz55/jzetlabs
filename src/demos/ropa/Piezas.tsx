/* Piezas que comparten las tres vistas: foto, selector de talla, cantidad, cifra animada y ventana. */
import { useEffect, useRef, type ReactNode } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useCifra } from "../hotel/animar";
import { enCentavos, existencia, nombreTalla, tallasDe, type Estado, type Producto, type Talla } from "./datos";

export function Foto({ p, className = "", decorativa = false, pronto = false }: { p: Producto; className?: string; decorativa?: boolean; pronto?: boolean }) {
  return (
    <span className={`vx-foto ${className}`}>
      <img src={p.foto} alt={decorativa ? "" : p.nombre} loading={pronto ? "eager" : "lazy"} decoding="async" style={{ objectPosition: p.foco }} />
    </span>
  );
}

export function Tallas({ p, estado, valor, alElegir }: { p: Producto; estado: Estado; valor: Talla | null; alElegir: (t: Talla) => void }) {
  return (
    <div className="vx-tallas" role="group" aria-label={`Talla de ${p.nombre}`}>
      {tallasDe(p).map((t) => {
        const hay = existencia(estado, p.id, t);
        return (
          <button
            key={t}
            type="button"
            disabled={hay === 0}
            aria-pressed={valor === t}
            aria-label={`Talla ${nombreTalla(t)}${hay === 0 ? ", agotada" : ""}`}
            onClick={() => alElegir(t)}
          >
            {t === "U" ? "Talla única" : t}
          </button>
        );
      })}
    </div>
  );
}

export function Cantidad({ valor, alCambiar, tope, que }: { valor: number; alCambiar: (n: number) => void; tope: boolean; que: string }) {
  return (
    <span className="vx-cantidad">
      <button type="button" onClick={() => alCambiar(valor - 1)} aria-label={valor === 1 ? `Quitar ${que}` : `Uno menos de ${que}`}>
        <Minus size={15} aria-hidden />
      </button>
      <b>{valor}</b>
      <button type="button" disabled={tope} onClick={() => alCambiar(valor + 1)} aria-label={`Uno más de ${que}`}>
        <Plus size={15} aria-hidden />
      </button>
    </span>
  );
}

/* el total cuenta desde la cifra anterior hasta la nueva */
export function Cifra({ valor, className }: { valor: number; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const centavos = Math.round(valor * 100);
  useCifra(ref, centavos, enCentavos);
  /* el texto lo maneja la animación; React solo pone el primero */
  const primero = useRef(enCentavos(centavos));
  return (
    <strong ref={ref} className={className}>
      {primero.current}
    </strong>
  );
}

/* Ventana sobre <dialog>: Esc, toque afuera y foco atrapado. */
export function Ventana({ abierta, alCerrar, titulo, nota, clase = "vx-modal", children }: { abierta: boolean; alCerrar: () => void; titulo: string; nota?: string; clase?: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierta && !d.open) d.showModal();
    if (!abierta && d.open) d.close();
  }, [abierta]);
  return (
    <dialog
      ref={ref}
      className={clase}
      aria-label={titulo}
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar();
      }}
    >
      {abierta && (
        <div className="vx-ventana">
          <div className="vx-ventana-cabeza">
            <div>
              <h2>{titulo}</h2>
              {nota && <p>{nota}</p>}
            </div>
            <button type="button" onClick={alCerrar} aria-label="Cerrar">
              <X size={21} aria-hidden />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
