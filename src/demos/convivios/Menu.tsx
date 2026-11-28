import { useRef, useState, type FormEvent } from "react";
import { Undo2 } from "lucide-react";
import { PRODUCTOS, IDS_PRODUCTO, STANDS, qz, type Feria, type Filtro, type ProductoId } from "./datos";
import { useCarga, useEscalonado } from "./animar";
import { FiltroStands, Foto } from "./Piezas";

export function Menu({ feria, ajustando, alAjustar }: { feria: Feria; ajustando: boolean; alAjustar: (v: boolean) => void }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const cargando = useCarga(filtro, 300);
  const rejilla = useRef<HTMLUListElement>(null);
  useEscalonado(rejilla, filtro, !cargando);
  const visibles = IDS_PRODUCTO.filter((id) => filtro === "todos" || PRODUCTOS[id].stand === filtro);

  return (
    <section id="stands-menu" className="scroll-mt-32 py-12 lg:scroll-mt-[4.5rem]">
      <div className="tf-ancho">
        <h2 className="text-3xl font-extrabold">Stands y Menú</h2>
        <p className="mt-2">{ajustando ? "Suma las tandas nuevas que llegan a tu puesto. La carta y la caja se actualizan al instante." : "Carta en vivo: las porciones bajan con cada cobro en caja."}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <FiltroStands actual={filtro} alElegir={setFiltro} etiqueta="Filtrar la carta por puesto" />
          <button type="button" role="switch" aria-checked={ajustando} onClick={() => alAjustar(!ajustando)} className="inline-flex min-h-11 items-center gap-3 text-sm font-bold text-[#18181B]">
            <span aria-hidden className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${ajustando ? "bg-[#15803D]" : "bg-[#CFC4B7]"}`}>
              <span className={`absolute left-1 top-1 size-5 rounded-full bg-white shadow transition-transform ${ajustando ? "translate-x-5" : ""}`} />
            </span>
            Ajustar stock de stands
          </button>
        </div>

        <ul ref={rejilla} aria-busy={cargando} className="mt-8 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cargando
            ? visibles.map((id) => (
                <li key={`hueco-${id}`} aria-hidden className="tf-tarjeta animate-pulse overflow-hidden">
                  <div className="aspect-[3/2] bg-[#F1EAE1]" />
                  <div className="grid gap-3 p-5">
                    <div className="h-5 w-2/3 rounded bg-[#F1EAE1]" />
                    <div className="h-4 w-full rounded bg-[#F1EAE1]" />
                    <div className="mt-2 h-2 w-full rounded bg-[#F1EAE1]" />
                    <div className="h-4 w-1/2 rounded bg-[#F1EAE1]" />
                  </div>
                </li>
              ))
            : visibles.map((id) => {
                const p = PRODUCTOS[id];
                const quedan = feria.quedan(id);
                const cargado = feria.cargado(id);
                const agotado = quedan <= 0;
                const poco = !agotado && quedan <= cargado * 0.15;
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
                        <h3 className="text-lg font-bold leading-snug">{p.nombre}</h3>
                        <b className="text-2xl font-extrabold text-[#18181B]">{qz(p.precio)}</b>
                      </div>
                      <p className="mt-1 text-sm text-[#6B6560]">{p.detalle}</p>
                      <div aria-hidden className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F1EAE1]">
                        <div className={`h-full rounded-full transition-[width] duration-500 ${poco ? "bg-[#B91C1C]" : "bg-[#15803D]"}`} style={{ width: `${cargado ? (quedan / cargado) * 100 : 0}%` }} />
                      </div>
                      <p aria-live="polite" className={`mt-2 text-sm font-bold ${agotado || poco ? "text-[#B91C1C]" : "text-[#15803D]"}`}>
                        {agotado ? `Se vendieron las ${cargado}` : `Quedan ${quedan} de ${cargado}`}
                      </p>
                    </div>
                    {ajustando && <AjusteStock feria={feria} id={id} />}
                  </li>
                );
              })}
        </ul>
      </div>
    </section>
  );
}

function AjusteStock({ feria, id }: { feria: Feria; id: ProductoId }) {
  const [cantidad, setCantidad] = useState("");
  const n = Number(cantidad);
  const valida = n >= 1 && n <= 500;
  const { nombre } = PRODUCTOS[id];
  const recargas = feria.cargas.filter((c) => c.producto === id && !c.apertura);
  const sumado = recargas.reduce((s, c) => s + c.cantidad, 0);
  const ultima = recargas.at(-1);

  function sumarExacto(e: FormEvent) {
    e.preventDefault();
    if (!valida) return;
    feria.cargar(id, n);
    setCantidad("");
  }

  return (
    <div className="border-t border-[#EAE2D8] bg-[#F9F5F0] p-4">
      <div className="grid grid-cols-2 gap-2">
        {[10, 20].map((v) => (
          <button key={v} type="button" aria-label={`Sumar ${v} de ${nombre}`} onClick={() => feria.cargar(id, v)} className="tf-boton tf-linea !text-base">
            +{v}
          </button>
        ))}
      </div>
      <form onSubmit={sumarExacto} className="mt-2 flex gap-2">
        <input inputMode="numeric" autoComplete="off" aria-label={`Cantidad exacta de ${nombre}`} placeholder="Cantidad exacta" value={cantidad} onChange={(e) => setCantidad(e.target.value.replace(/\D/g, "").slice(0, 3))} className="tf-campo !h-11 flex-1" />
        <button type="submit" disabled={!valida} aria-label={`Sumar la cantidad exacta de ${nombre}`} className="tf-boton tf-rojo shrink-0">
          Sumar
        </button>
      </form>
      {n > 500 && <p className="mt-2 text-sm font-semibold text-[#B91C1C]">El máximo por tanda es 500.</p>}
      {ultima && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3">
          <span role="status" className="text-sm font-bold text-[#15803D]">Sumado hoy: +{sumado}</span>
          {feria.quedan(id) >= ultima.cantidad && (
            <button type="button" aria-label={`Deshacer la suma de ${ultima.cantidad} de ${nombre}`} onClick={() => feria.anularCarga(ultima.id)} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-[#52525B] underline hover:text-[#B91C1C]">
              <Undo2 size={15} aria-hidden /> Deshacer +{ultima.cantidad}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
