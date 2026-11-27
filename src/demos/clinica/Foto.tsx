/* Foto con fondo de respaldo: si no carga, queda el bloque de color y no un icono roto. */
import { useState } from "react";

export function Foto({ src, alt, className = "", prioridad = false }: { src: string; alt: string; className?: string; prioridad?: boolean }) {
  const [fallo, setFallo] = useState(false);
  return (
    <span className={`vv-foto ${className}`}>
      {!fallo && <img src={src} alt={alt} loading={prioridad ? "eager" : "lazy"} decoding="async" onError={() => setFallo(true)} />}
    </span>
  );
}
