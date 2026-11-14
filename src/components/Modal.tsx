/*
 * Ventana (modal) con <dialog>: Esc y el botón cerrar la cierran, también un
 * toque afuera. En celular sube desde abajo como una hoja; en compu aparece
 * al centro. El foco queda dentro mientras está abierta.
 */
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  abierto: boolean;
  alCerrar: () => void;
  titulo: string;
  children: ReactNode;
  ancho?: string;
};

export function Modal({ abierto, alCerrar, titulo, children, ancho = "sm:w-[min(38rem,92vw)]" }: Props) {
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
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar();
      }}
      className={`modal w-full ${ancho} mx-auto mt-auto mb-0 sm:my-auto`}
    >
      <div className="modal-caja relative bg-blanco text-texto rounded-t-[1.75rem] sm:rounded-[1.75rem] shadow-[0_30px_80px_-30px_rgba(28,23,20,.6)] max-h-[88svh] overflow-y-auto">
        <span className="sm:hidden block mx-auto mt-3 h-1.5 w-12 rounded-full bg-linea" aria-hidden />
        <button
          type="button"
          onClick={alCerrar}
          aria-label="Cerrar"
          className="absolute top-3.5 right-3.5 grid place-items-center w-10 h-10 rounded-full text-suave hover:bg-tinta/5 hover:text-tinta active:scale-90 transition"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </dialog>
  );
}
