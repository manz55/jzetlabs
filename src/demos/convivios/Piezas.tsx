import { useState } from "react";
import { ImageOff } from "lucide-react";
import { IDS_STAND, STANDS, urlFoto, type Filtro } from "./datos";

export function Foto({ id, alt, ancho, alto, className = "", prioridad = false }: { id: string; alt: string; ancho: number; alto: number; className?: string; prioridad?: boolean }) {
  const [fallo, setFallo] = useState(false);
  if (fallo) {
    return (
      <span role="img" aria-label={alt} className={`grid place-items-center bg-[#F1EAE1] text-[#8A817A] ${className}`}>
        <ImageOff size={22} aria-hidden />
      </span>
    );
  }
  return (
    <img
      src={urlFoto(id, ancho, alto)}
      alt={alt}
      width={ancho}
      height={alto}
      loading={prioridad ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFallo(true)}
      className={`block bg-[#F1EAE1] object-cover ${className}`}
    />
  );
}

export function FiltroStands({ actual, alElegir, cuentas, etiqueta }: { actual: Filtro; alElegir: (f: Filtro) => void; cuentas?: Record<Filtro, number>; etiqueta: string }) {
  return (
    <div role="group" aria-label={etiqueta} className="flex min-w-0 flex-wrap gap-2">
      {(["todos", ...IDS_STAND] as Filtro[]).map((f) => (
        <button key={f} type="button" aria-pressed={actual === f} onClick={() => alElegir(f)} className="tf-pildora">
          {f === "todos" ? "Todos" : STANDS[f].nombre}
          {cuentas && cuentas[f] > 0 && <span className="tf-cuenta">{cuentas[f]}</span>}
        </button>
      ))}
    </div>
  );
}
