import { useRef, useState } from "react";
import { PRODUCTOS, STANDS, productosEnCarta, qz, type Feria, type Filtro } from "./datos";
import { useCarga, useEscalonado } from "./animar";
import { FiltroStands, Foto } from "./Piezas";

export function Menu({ feria, enVivo, alCambiar }: { feria: Feria; enVivo: boolean; alCambiar: (v: boolean) => void }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const cargando = useCarga(filtro, 300);
  const rejilla = useRef<HTMLUListElement>(null);
  useEscalonado(rejilla, filtro, !cargando);
  const visibles = productosEnCarta().filter((id) => filtro === "todos" || PRODUCTOS[id].stand === filtro);

  return (
    <section id="stands-menu" className="scroll-mt-32 py-12 lg:scroll-mt-[4.5rem]">
      <div className="tf-ancho">
        <h2 className="text-3xl font-extrabold">Stands y Menú</h2>
        <p className="mt-2">{enVivo ? "Existencias en tiempo real: bajan con cada cobro en Caja Central." : "La carta del convivio, puesto por puesto."}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <FiltroStands actual={filtro} alElegir={setFiltro} etiqueta="Filtrar la carta por puesto" />
          <button type="button" role="switch" aria-checked={enVivo} onClick={() => alCambiar(!enVivo)} className="inline-flex min-h-11 items-center gap-3 text-sm font-bold text-[#18181B]">
            <span aria-hidden className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${enVivo ? "bg-[#15803D]" : "bg-[#CFC4B7]"}`}>
              <span className={`absolute left-1 top-1 size-5 rounded-full bg-white shadow transition-transform ${enVivo ? "translate-x-5" : ""}`} />
            </span>
            Ver stock en vivo
          </button>
        </div>

        {!cargando && visibles.length === 0 && <p className="mt-8 rounded-2xl border border-dashed border-[#D9CFC3] bg-[#F9F5F0] p-10 text-center font-semibold">Este puesto no tiene platillos en la carta por ahora.</p>}

        <ul ref={rejilla} aria-busy={cargando} className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cargando
            ? visibles.map((id) => (
                <li key={`hueco-${id}`} aria-hidden className="tf-tarjeta animate-pulse overflow-hidden">
                  <div className="aspect-[3/2] bg-[#F1EAE1]" />
                  <div className="grid gap-3 p-5">
                    <div className="h-5 w-2/3 rounded bg-[#F1EAE1]" />
                    <div className="h-4 w-full rounded bg-[#F1EAE1]" />
                  </div>
                </li>
              ))
            : visibles.map((id) => {
                const p = PRODUCTOS[id];
                const quedan = feria.quedan(id);
                const cargado = feria.cargado(id);
                const agotado = enVivo && quedan <= 0;
                const poco = quedan <= cargado * 0.15;
                const Icono = STANDS[p.stand].icono;
                return (
                  <li key={id} data-entra className="tf-tarjeta overflow-hidden">
                    <div className="relative">
                      <Foto id={p.foto} alt={p.alt} ancho={640} alto={427} className={`aspect-[3/2] w-full ${agotado ? "grayscale" : ""}`} />
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFFDFB] px-3 py-1 text-xs font-bold text-[#18181B]">
                        <Icono size={13} aria-hidden className="text-[#B91C1C]" /> {STANDS[p.stand].corto}
                      </span>
                      {agotado && (
                        <span className="absolute inset-0 grid place-items-center bg-[#18181B]/45">
                          <span className="rounded-lg bg-[#B91C1C] px-5 py-2 text-base font-extrabold tracking-wide text-white">AGOTADO</span>
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="min-w-0 break-words text-lg font-bold leading-snug">{p.nombre}</h3>
                        <b className="text-2xl font-extrabold text-[#18181B]">{qz(p.precio)}</b>
                      </div>
                      {p.detalle && <p className="mt-1 text-sm text-[#6B6560]">{p.detalle}</p>}
                      {enVivo && (
                        <>
                          <div aria-hidden className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F1EAE1]">
                            <div className={`h-full rounded-full transition-[width] duration-500 ${poco ? "bg-[#B91C1C]" : "bg-[#15803D]"}`} style={{ width: `${cargado ? (quedan / cargado) * 100 : 0}%` }} />
                          </div>
                          <p aria-live="polite" className={`mt-2 text-sm font-bold ${poco ? "text-[#B91C1C]" : "text-[#15803D]"}`}>
                            Quedan {quedan} de {cargado}
                          </p>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
        </ul>
      </div>
    </section>
  );
}
