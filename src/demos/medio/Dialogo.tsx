/* Ventana con <dialog>: el foco queda dentro, Esc la cierra y también un toque afuera. */
import { useEffect, useRef, type ReactNode, type Ref } from "react";

export default function Dialogo({
  abierto,
  alCerrar,
  titulo,
  className,
  children,
  cajaRef,
  alBajar,
}: {
  abierto: boolean;
  alCerrar: () => void;
  titulo: string;
  className: string;
  children: ReactNode;
  cajaRef?: Ref<HTMLDivElement>;
  alBajar?: (caja: HTMLDivElement) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);
  return (
    <dialog
      ref={ref}
      aria-label={titulo}
      className={`cc-dialogo ${className}`}
      onCancel={(e) => {
        e.preventDefault();
        alCerrar();
      }}
      /* solo si el navegador la cerró por su cuenta (el aviso puede llegar tarde, ya reabierta) */
      onClose={() => abierto && !ref.current?.open && alCerrar()}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar();
      }}
    >
      <div ref={cajaRef} className="cc-dialogo-caja" onScroll={alBajar && ((e) => alBajar(e.currentTarget))}>
        {children}
      </div>
    </dialog>
  );
}
