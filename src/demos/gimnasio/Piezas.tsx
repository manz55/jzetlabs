/* Piezas que usan las tres vistas: el logotipo, los botones, las ventanas, las fotos y el código del carné. */
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, Save, X } from "lucide-react";
import { foto } from "./datos";

/* clases de botón: todos grandes y fáciles de tocar */
export const BTN = "inline-flex min-h-12 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-center text-[0.95rem] font-bold leading-tight transition active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100";
export const VERDE = `${BTN} bg-[#15803D] text-white hover:bg-[#166534]`;
export const CARBON = `${BTN} bg-[#0F172A] text-white hover:bg-[#1E293B]`;
export const BORDE = `${BTN} border border-slate-300 bg-white text-[#0F172A] hover:border-[#0F172A]`;

export const AMBAR = `${BTN} bg-amber-700 text-white hover:bg-amber-800`;

export const ANCHO = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
export const CAMPO = "block min-h-12 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3.5 text-base font-medium text-[#0F172A] outline-none focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/30 aria-[invalid=true]:border-red-600";
export const ROTULO = "grid min-w-0 content-start gap-1.5 text-[0.88rem] font-bold text-[#0F172A]";
export const TARJETA = "min-w-0 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7";

/* aviso verde de que algo quedó guardado */
export function Guardado({ texto }: { texto: string }) {
  return (
    <p role="status" className={texto ? "flex items-center gap-2.5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-[0.93rem] font-extrabold text-green-900" : "sr-only"}>
      {texto && (
        <>
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#15803D] text-white">
            <Check size={15} aria-hidden />
          </span>
          <span className="min-w-0">{texto}</span>
        </>
      )}
    </p>
  );
}

/* pie de un formulario: avisa si hay cambios sin guardar y confirma cuando se guardan */
export function BarraGuardar({ sucio, guardado, error, alDescartar }: { sucio: boolean; guardado: string; error?: string; alDescartar: () => void }) {
  return (
    <div className="mt-6 grid gap-3 border-t border-slate-200 pt-5">
      <Guardado texto={sucio ? "" : guardado} />
      {sucio && <p className={`text-[0.9rem] font-bold ${error ? "text-red-700" : "text-amber-800"}`}>{error || "Tiene cambios sin guardar."}</p>}
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <button type="submit" disabled={!sucio} className={`${VERDE} disabled:!bg-slate-200 disabled:!text-slate-500`}>
          <Save size={18} aria-hidden /> Guardar cambios
        </button>
        {sucio && (
          <button type="button" onClick={alDescartar} className={BORDE}>
            Descartar
          </button>
        )}
      </div>
    </div>
  );
}

/* ventana encima de la página; se cierra con la equis, con Escape o tocando afuera */
export function Ventana({ titulo, sub, alCerrar, children }: { titulo: string; sub?: string; alCerrar: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    /* el campo marcado con data-foco recibe el cursor, para escribir de una vez */
    d?.querySelector<HTMLElement>("[data-foco]")?.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar();
      }}
      className="m-auto max-h-[min(92dvh,52rem)] w-[min(34rem,calc(100vw-1.5rem))] max-w-none overflow-y-auto overflow-x-hidden rounded-2xl bg-white p-0 text-left text-slate-700 backdrop:bg-[#0F172A]/70"
    >
      <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h2 id={id} className="text-[1.3rem] font-extrabold leading-tight">
            {titulo}
          </h2>
          {sub && <p className="text-[0.88rem] text-slate-600">{sub}</p>}
        </div>
        <button type="button" onClick={alCerrar} aria-label="Cerrar" className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-lg border border-slate-200 text-[#0F172A]">
          <X size={20} aria-hidden />
        </button>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </dialog>
  );
}

/* la "H" de gimnasio: dos barras verticales unidas al centro, y el nombre al lado */
export function Logo() {
  return (
    <span className="flex w-fit items-center gap-2 whitespace-nowrap sm:gap-2.5">
      <span aria-hidden className="flex items-center">
        <span className="h-6 w-1.5 bg-[#15803D]" />
        <span className="h-1.5 w-3 bg-[#0F172A]" />
        <span className="h-6 w-1.5 bg-[#15803D]" />
      </span>
      <span className="flex flex-col text-left leading-none">
        <span className="text-[1.05rem] font-extrabold tracking-tight text-[#0F172A] sm:text-[1.2rem]">IRONPEAK</span>
        <span className="mt-1 text-[0.5rem] font-bold tracking-[0.16em] text-slate-500 sm:text-[0.55rem] sm:tracking-[0.2em]">PERFORMANCE CLUB</span>
      </span>
    </span>
  );
}

export function Foto({ id, alt, ancho, alto, pronto = false, className = "" }: { id: string; alt: string; ancho: number; alto: number; pronto?: boolean; className?: string }) {
  const [fallo, setFallo] = useState(false);
  return (
    <span className={`block overflow-hidden bg-slate-200 ${className}`}>
      {fallo ? (
        <span role="img" aria-label={alt} className="grid h-full min-h-32 place-items-center text-sm font-bold text-slate-500">
          IronPeak
        </span>
      ) : (
        <img src={foto(id, ancho, alto)} alt={alt} width={ancho} height={alto} loading={pronto ? "eager" : "lazy"} decoding="async" onError={() => setFallo(true)} className="block h-full w-full object-cover" />
      )}
    </span>
  );
}

const LADO = 21;

/* Código del carné dibujado con cuadritos: las tres esquinas de siempre y un patrón propio de cada socio */
export function CodigoQR({ numero, activo }: { numero: number; activo: boolean }) {
  const celdas = useMemo(() => {
    let semilla = numero * 7919 + 17;
    const azar = () => (semilla = (semilla * 16807) % 2147483647) % 100;
    return Array.from({ length: LADO * LADO }, (_, i) => {
      const f = Math.floor(i / LADO);
      const c = i % LADO;
      for (const [y, x] of [[0, 0], [0, LADO - 7], [LADO - 7, 0]]) {
        const dy = f - y;
        const dx = c - x;
        if (dy >= -1 && dy <= 7 && dx >= -1 && dx <= 7) {
          if (dy < 0 || dy > 6 || dx < 0 || dx > 6) return false;
          const orilla = dy === 0 || dy === 6 || dx === 0 || dx === 6;
          return orilla || (dy >= 2 && dy <= 4 && dx >= 2 && dx <= 4);
        }
      }
      return azar() < 48;
    });
  }, [numero]);
  return (
    <div
      role="img"
      aria-label={activo ? `Código de entrada del carné ${numero}` : `Código del carné ${numero}, sin acceso`}
      className={`grid aspect-square w-full ${activo ? "" : "opacity-15"}`}
      style={{ gridTemplateColumns: `repeat(${LADO}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${LADO}, minmax(0, 1fr))` }}
    >
      {celdas.map((on, i) => (
        <span key={i} className={on ? "bg-[#0F172A]" : ""} />
      ))}
    </div>
  );
}

export function Titulo({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="mb-7 max-w-2xl sm:mb-9">
      <h2 className="text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-[2.25rem]">{titulo}</h2>
      <p className="mt-2 text-[1.02rem] text-slate-600">{texto}</p>
    </div>
  );
}
