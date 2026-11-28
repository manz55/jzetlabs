import { useEffect, useRef, useState, type ReactNode } from "react";
import { Minus, Plus, X } from "lucide-react";
import { foto } from "./datos";
import { boton } from "./estilos";

export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <span className="inline-flex w-fit flex-col whitespace-nowrap leading-none">
      <span className={`font-(family-name:--ci-serif) text-[1.2rem] font-bold tracking-[0.04em] min-[400px]:text-[1.4rem] ${claro ? "text-[#FAF8F5]" : "text-[#1C1917]"}`}>CASA IMPERIAL</span>
      <span className="my-[0.3rem] h-px w-full bg-[#A16207]" aria-hidden />
      <span className={`text-[0.44rem] font-semibold tracking-[0.20em] min-[400px]:text-[0.52rem] ${claro ? "text-[#D6CCBF]" : "text-[#57534E]"}`}>MOBILIARIO &amp; MONTAJE DE EVENTOS</span>
    </span>
  );
}

export function Foto({ id, alt, ancho, alto, pronto = false, className = "" }: { id: string; alt: string; ancho: number; alto: number; pronto?: boolean; className?: string }) {
  const [fallo, setFallo] = useState(false);
  return (
    <span className={`block overflow-hidden bg-[#F3EFEA] ${className}`}>
      {fallo ? (
        <span className="grid h-full w-full place-items-center p-3 text-center text-xs text-[#6B625B]" role="img" aria-label={alt}>
          {alt}
        </span>
      ) : (
        <img src={foto(id, ancho, alto)} alt={alt} width={ancho} height={alto} loading={pronto ? "eager" : "lazy"} decoding="async" onError={() => setFallo(true)} className="h-full w-full object-cover" />
      )}
    </span>
  );
}

export function Contador({ valor, max, paso = 1, nombre, alCambiar }: { valor: number; max: number; paso?: number; nombre: string; alCambiar: (n: number) => void }) {
  const poner = (n: number) => alCambiar(Math.max(0, Math.min(max, Math.round(n) || 0)));
  const tecla = "grid size-11 shrink-0 place-items-center rounded-lg border border-[#CFC6BA] bg-white text-[#1C1917] transition hover:border-[#1C1917] active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#CFC6BA]";
  return (
    <div className="flex min-w-0 items-center gap-2">
      <button type="button" className={tecla} disabled={valor <= 0} onClick={() => poner(valor - paso)} aria-label={`Quitar ${paso} de ${nombre}`}>
        <Minus size={16} aria-hidden />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={valor}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => poner(Number(e.target.value.replace(/\D/g, "")))}
        aria-label={`Cantidad de ${nombre}`}
        className="h-11 w-full min-w-0 rounded-lg border border-[#E4DDD3] bg-[#FAF8F5] text-center text-base font-bold text-[#1C1917]"
      />
      <button type="button" className={tecla} disabled={valor >= max} onClick={() => poner(valor + paso)} aria-label={`Agregar ${paso} de ${nombre}`}>
        <Plus size={16} aria-hidden />
      </button>
    </div>
  );
}

export function Ventana({ titulo, alCerrar, ancho = "34rem", children }: { titulo: string; alCerrar: () => void; ancho?: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    return () => d?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={titulo}
      onCancel={(e) => {
        e.preventDefault();
        alCerrar();
      }}
      style={{ width: `min(${ancho}, calc(100vw - 1.5rem))` }}
      className="m-auto max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-2xl bg-[#FAF8F5] p-0 text-[#44403C] shadow-2xl backdrop:bg-black/55"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h2 className="min-w-0 text-2xl">{titulo}</h2>
          <button type="button" onClick={alCerrar} aria-label="Cerrar" className={`${boton.linea} size-11 shrink-0 !px-0`}>
            <X size={18} aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
