/* Ventana centrada con encabezado oscuro: Esc, el botón y un toque afuera la cierran. */
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = { abierta: boolean; alCerrar: () => void; titulo: string; sub?: string; ancha?: boolean; children: ReactNode };

export function Ventana({ abierta, alCerrar, titulo, sub, ancha, children }: Props) {
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
      className={`nx-modal ${ancha ? "nx-ancha" : ""}`}
      aria-label={titulo}
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === ref.current) ref.current.close();
      }}
    >
      {abierta && (
        <div className="nx-ticket">
          <header className="nx-ticket-cabeza nx-oscuro">
            <div>
              <h2>{titulo}</h2>
              {sub && <p>{sub}</p>}
            </div>
            <button type="button" aria-label="Cerrar" onClick={() => ref.current?.close()}>
              <X size={20} aria-hidden />
            </button>
          </header>
          {children}
        </div>
      )}
    </dialog>
  );
}
