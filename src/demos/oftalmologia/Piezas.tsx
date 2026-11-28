import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { diaCorto, horasLibres, fechasLibres } from "./agenda";
import { urlFoto, type Cita } from "./datos";

export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1E3A8A]">
        <span className="block h-3.5 w-3.5 rounded-full border-2 border-white" />
      </span>
      <span className="block text-left leading-none">
        <span className={`cv-editorial block whitespace-nowrap text-[1.15rem] font-bold tracking-wide ${claro ? "text-white" : "text-[#0F172A]"}`}>CLARAVISTA</span>
        <span className={`mt-1 block whitespace-nowrap text-[0.5rem] font-bold tracking-[0.18em] ${claro ? "text-[#CBD5E1]" : "text-[#475569]"}`}>OFTALMOLOGÍA &amp; ÓPTICA</span>
      </span>
    </span>
  );
}

export function Foto({ id, alt, ancho, alto, className = "", prioridad = false }: { id: string; alt: string; ancho: number; alto: number; className?: string; prioridad?: boolean }) {
  return (
    <img
      src={urlFoto(id, ancho, alto)}
      alt={alt}
      width={ancho}
      height={alto}
      loading={prioridad ? "eager" : "lazy"}
      fetchPriority={prioridad ? "high" : "auto"}
      className={`block bg-[#F1F5F9] object-cover ${className}`}
    />
  );
}

export function SelectorHorario({ citas, fecha, hora, alElegir, nombre }: { citas: Cita[]; fecha: string; hora: string; alElegir: (fecha: string, hora: string) => void; nombre: string }) {
  const fechas = fechasLibres(citas);
  const horas = horasLibres(citas, fecha);
  return (
    <>
      <fieldset className="min-w-0">
        <legend className="cv-rotulo">Fecha</legend>
        <div className="grid grid-cols-3 gap-2">
          {fechas.map((f) => (
            <label key={f} className="cv-opcion first-letter:uppercase">
              <input type="radio" name={`${nombre}-fecha`} className="sr-only" checked={f === fecha} onChange={() => alElegir(f, "")} />
              <span className="inline-block first-letter:uppercase">{diaCorto(f)}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="min-w-0">
        <legend className="cv-rotulo">Horario disponible</legend>
        <div className="grid grid-cols-4 gap-2">
          {horas.map((h) => (
            <label key={h} className="cv-opcion tabular-nums">
              <input type="radio" name={`${nombre}-hora`} className="sr-only" checked={h === hora} onChange={() => alElegir(fecha, h)} />
              {h}
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}

export function Ventana({ titulo, alCerrar, children }: { titulo: string; alCerrar: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={titulo}
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar();
      }}
      className="cv-ventana"
    >
      <div className="cv-ventana-caja">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-2xl">{titulo}</h2>
          <button type="button" onClick={alCerrar} aria-label="Cerrar" className="cv-boton cv-linea size-11 shrink-0 !px-0">
            <X size={18} aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
