/*
 * Una sección de la página de la clienta: una franja de color con su número y su título,
 * para que cada parte se note separada de la otra. Usa todo el ancho de la pantalla.
 */
import type { ReactNode } from "react";
import { TINTA, VINO } from "./datos";

export function Seccion({ id, num, etiqueta, titulo, sub, fondo, oscuro = false, derecha, children }: { id: string; num: string; etiqueta: string; titulo: string; sub?: string; fondo: string; oscuro?: boolean; derecha?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="pf-sec scroll-mt-32" style={{ background: fondo, color: oscuro ? "#fff" : TINTA, borderTop: `6px solid ${oscuro ? "#d9a3c2" : VINO}` }}>
      <div className="pf-cont">
        <p className="pf-eyebrow" style={{ color: oscuro ? "#e9bfd6" : VINO }}>{num} · {etiqueta}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <h2 className="pf-h2" style={{ color: "inherit" }}>{titulo}</h2>
            {sub && <p className="mt-2 text-[clamp(1.05rem,0.95rem+0.5vw,1.35rem)] opacity-75">{sub}</p>}
          </div>
          {derecha}
        </div>
        <div className="mt-[clamp(1.5rem,3vw,3rem)]">{children}</div>
      </div>
    </section>
  );
}
