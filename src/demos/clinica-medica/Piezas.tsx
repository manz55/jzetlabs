import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CircleCheck, CircleDashed, Hourglass } from "lucide-react";
import { urlFoto, type Cita } from "./datos";

export function Foto({ id, alt, ancho, alto, className = "", prioridad = false }: { id: string; alt: string; ancho: number; alto: number; className?: string; prioridad?: boolean }) {
  return (
    <img
      src={urlFoto(id, ancho, alto)}
      alt={alt}
      width={ancho}
      height={alto}
      loading={prioridad ? "eager" : "lazy"}
      decoding="async"
      className={`block bg-[#DBEAFE] object-cover ${className}`}
    />
  );
}

export function LogoMarca({ claro = false }: { claro?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden className="relative block h-7 w-7 shrink-0 rounded-lg bg-[#1D4ED8] [print-color-adjust:exact]">
        <span className="absolute left-1/2 top-1/2 h-[14px] w-1 -translate-x-1/2 -translate-y-1/2 rounded-[1px] bg-white" />
        <span className="absolute left-1/2 top-1/2 h-1 w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-[1px] bg-white" />
      </span>
      <span className="block leading-none">
        <span className={`block whitespace-nowrap font-['Playfair_Display',serif] text-[1.18rem] font-bold tracking-wide ${claro ? "text-white" : "text-[#0F172A]"}`}>ALTAMIRA</span>
        <span className={`mt-1 block whitespace-nowrap font-['Plus_Jakarta_Sans',sans-serif] text-[0.5rem] font-bold tracking-[0.18em] ${claro ? "text-[#BFDBFE]" : "text-[#475569]"}`}>
          CENTRO MÉDICO &amp; LABORATORIO
        </span>
      </span>
    </span>
  );
}

export function EstadoOrden({ cita }: { cita: Cita }) {
  if (cita.informe)
    return (
      <span className="cm-estado cm-listo">
        <CircleCheck size={13} aria-hidden /> Listo para descargar
      </span>
    );
  if (cita.estado === "muestra")
    return (
      <span className="cm-estado cm-analisis">
        <Hourglass size={13} aria-hidden /> En análisis
      </span>
    );
  return (
    <span className="cm-estado cm-neutro">
      <CircleDashed size={13} aria-hidden /> Toma programada
    </span>
  );
}

export function Ventana({ titulo, detalle, alCerrar, children }: { titulo: string; detalle?: string; alCerrar: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!ref.current?.open) ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={titulo}
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar();
      }}
      className="modal mx-auto mt-auto mb-0 w-full sm:my-auto sm:w-[min(34rem,92vw)]"
    >
      <div className="modal-caja relative max-h-[88svh] overflow-y-auto rounded-t-3xl bg-white p-6 text-[#334155] sm:rounded-3xl">
        <button type="button" onClick={() => ref.current?.close()} className="cm-boton cm-linea absolute right-4 top-4 !min-h-10 !px-3 text-xs">
          Cerrar
        </button>
        <h2 className="pr-20 text-xl">{titulo}</h2>
        {detalle && <p className="mt-1 pr-20 text-sm leading-snug">{detalle}</p>}
        <div className="mt-5">{children}</div>
      </div>
    </dialog>
  );
}

export function HojaImpresion({ alTerminar, children }: { alTerminar: () => void; children: ReactNode }) {
  useEffect(() => {
    addEventListener("afterprint", alTerminar);
    const t = window.setTimeout(() => window.print(), 50);
    return () => {
      window.clearTimeout(t);
      removeEventListener("afterprint", alTerminar);
    };
  }, [alTerminar]);
  return createPortal(<div className="cm-hoja cm-raiz">{children}</div>, document.body);
}
