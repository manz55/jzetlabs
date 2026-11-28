import { useRef, useState } from "react";
import { Check, CircleCheck, Clock, Undo2 } from "lucide-react";
import { IDS_STAND, STANDS, codigo, hora, pendientesDe, renglones, standsDe, type Feria, type Filtro, type StandId, type Ticket } from "./datos";
import { useEscalonado } from "./animar";
import { FiltroStands } from "./Piezas";

export function Despacho({ feria }: { feria: Feria }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [entregadas, setEntregadas] = useState(false);
  const [ultima, setUltima] = useState<{ numero: number; stand: StandId } | null>(null);
  const rejilla = useRef<HTMLUListElement>(null);
  useEscalonado(rejilla, `${filtro}-${entregadas}`);

  const delFiltro = (t: Ticket) => standsDe(t).filter((s) => filtro === "todos" || s === filtro);
  const lista = entregadas
    ? feria.tickets.filter((t) => delFiltro(t).some((s) => t.entregas[s])).reverse()
    : pendientesDe(feria.tickets, filtro);
  const cuentas = Object.fromEntries((["todos", ...IDS_STAND] as Filtro[]).map((f) => [f, pendientesDe(feria.tickets, f).length])) as Record<Filtro, number>;

  function marcar(numero: number, stand: StandId, entregado: boolean) {
    feria.marcarEntrega(numero, stand, entregado);
    setUltima(entregado ? { numero, stand } : null);
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FiltroStands actual={filtro} alElegir={setFiltro} cuentas={cuentas} etiqueta="Ver las órdenes de un puesto" />
        <div role="group" aria-label="Estado de las órdenes" className="flex gap-2">
          <button type="button" aria-pressed={!entregadas} onClick={() => setEntregadas(false)} className="tf-pildora">
            Pendientes
          </button>
          <button type="button" aria-pressed={entregadas} onClick={() => setEntregadas(true)} className="tf-pildora">
            Entregadas
          </button>
        </div>
      </div>

      <div role="status">
        {ultima && (
          <p className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#DCFCE7] px-4 py-2 text-sm font-bold text-[#166534]">
            <span className="flex items-center gap-2">
              <CircleCheck size={17} aria-hidden /> {codigo(ultima.numero)} entregada en {STANDS[ultima.stand].nombre}
            </span>
            <button type="button" onClick={() => marcar(ultima.numero, ultima.stand, false)} className="inline-flex min-h-11 items-center gap-1.5 px-2 underline">
              <Undo2 size={15} aria-hidden /> Deshacer
            </button>
          </p>
        )}
      </div>

      {lista.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-[#D9CFC3] bg-[#F9F5F0] p-10 text-center font-semibold">
          {entregadas ? "Todavía no se ha entregado nada en este puesto." : "Todo entregado. Las órdenes nuevas aparecen aquí al cobrarse en caja."}
        </p>
      ) : (
        <ul ref={rejilla} className="mt-5 grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {lista.map((t) => (
            <li key={t.numero} data-entra className="tf-tarjeta overflow-hidden">
              <div className="flex items-start justify-between gap-3 bg-[#18181B] px-5 py-3.5 text-white">
                <div className="min-w-0">
                  <p className="text-2xl font-extrabold leading-tight">{codigo(t.numero)}</p>
                  <p className="truncate font-semibold text-white/85">{t.vecino}</p>
                </div>
                <p className="flex shrink-0 items-center gap-1.5 pt-1 text-xs font-semibold text-white/70">
                  <Clock size={13} aria-hidden /> Pagado {hora(t.fecha)}
                </p>
              </div>
              <div className="divide-y divide-[#F1EAE1]">
                {delFiltro(t)
                  .filter((s) => (entregadas ? t.entregas[s] : !t.entregas[s]))
                  .map((stand) => (
                    <div key={stand} className="p-5">
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#B91C1C]">{STANDS[stand].nombre}</p>
                      <ul className="mt-1.5">
                        {renglones(t.items)
                          .filter((l) => l.stand === stand)
                          .map((l) => (
                            <li key={l.id} className="text-xl font-bold leading-relaxed text-[#18181B]">
                              {l.cantidad} × {l.nombre}
                            </li>
                          ))}
                      </ul>
                      {t.entregas[stand] ? (
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5 text-sm font-bold text-[#15803D]">
                            <CircleCheck size={16} aria-hidden /> Entregado {hora(t.entregas[stand])}
                          </span>
                          <button type="button" aria-label={`Regresar a pendientes ${codigo(t.numero)} en ${STANDS[stand].nombre}`} onClick={() => marcar(t.numero, stand, false)} className="tf-boton tf-linea">
                            <Undo2 size={15} aria-hidden /> Regresar
                          </button>
                        </div>
                      ) : (
                        <button type="button" aria-label={`Marcar entregado ${codigo(t.numero)} en ${STANDS[stand].nombre}`} onClick={() => marcar(t.numero, stand, true)} className="tf-boton tf-verde mt-3 !min-h-12 w-full">
                          <Check size={18} aria-hidden /> Marcar entregado
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
