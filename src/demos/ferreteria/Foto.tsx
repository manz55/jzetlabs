/* Foto del producto. */
import { FOTOS, type Producto } from "./datos";

export default function Foto({ p, className, decorativa = false }: { p: Producto; className: string; decorativa?: boolean }) {
  /* el taladro viene sobre fondo blanco: se muestra entero */
  return <img src={FOTOS[p.id]} alt={decorativa ? "" : p.nombre} width={800} height={600} loading="lazy" className={`${className} ${p.id === "taladro" ? "!bg-white !object-contain" : ""}`} />;
}
