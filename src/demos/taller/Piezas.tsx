/* Piezas que comparten las vistas: logo de letras, ventana, cifra animada, placa y campos. */
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { useCifra } from "./animar";

export function Logo() {
  return (
    <span className="at-logo">
      <b>AUTOTECH</b>
      <small>INGENIERÍA AUTOMOTRIZ</small>
    </span>
  );
}

/* Ventana con <dialog>: en el celular sube desde abajo; en compu aparece al centro. */
export function Ventana({ abierta, alCerrar, titulo, nota, urgente, children, pie }: { abierta: boolean; alCerrar: () => void; titulo: string; nota?: string; urgente?: boolean; children: ReactNode; pie?: ReactNode }) {
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
      className={`at-ventana ${urgente ? "at-urgente" : ""}`}
      aria-label={titulo}
      onClose={() => abierta && alCerrar()}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar();
      }}
    >
      {abierta && (
        <div className="at-ventana-caja">
          <header className="at-ventana-alto">
            <div>
              <h2>{titulo}</h2>
              {nota && <p>{nota}</p>}
            </div>
            <button type="button" className="at-cerrar" onClick={alCerrar} aria-label="Cerrar">
              <X size={20} aria-hidden />
            </button>
          </header>
          <div className="at-ventana-cuerpo">{children}</div>
          {pie && <footer className="at-ventana-pie">{pie}</footer>}
        </div>
      )}
    </dialog>
  );
}

/* cuenta desde la cifra anterior hasta la nueva; "formato" debe ser una función fija */
export function Cifra({ valor, formato, desdeCero, className }: { valor: number; formato: (n: number) => string; desdeCero?: boolean; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inicio = desdeCero ? 0 : valor;
  useCifra(ref, valor, formato, inicio);
  /* el texto lo maneja la animación; React solo pone el primero */
  const primero = useRef(formato(inicio));
  return (
    <strong ref={ref} className={className}>
      {primero.current}
    </strong>
  );
}

export function Placa({ valor, grande }: { valor: string; grande?: boolean }) {
  return (
    <span className={`at-placa ${grande ? "at-placa-grande" : ""}`}>
      <small>GUATEMALA</small>
      <b>{valor}</b>
    </span>
  );
}

export function Campo({ nombre, error, ancho, children }: { nombre: string; error?: string; ancho?: boolean; children: ReactNode }) {
  return (
    <label className={`at-campo ${ancho ? "at-campo-ancho" : ""}`}>
      <span>{nombre}</span>
      {children}
      {error && <em role="alert">{error}</em>}
    </label>
  );
}
