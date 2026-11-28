import { useRef, useState } from "react";
import { Check, CircleCheck, Undo2 } from "lucide-react";
import { IDS_STAND, STANDS, codigo, hora, pendientesDe, quien, renglones, standsDe, type Feria, type Filtro, type StandId, type Ticket } from "./datos";
import { useEscalonado } from "./animar";
import { BadgeEntrega, FiltroStands } from "./Piezas";

export function Despacho({ feria }: { feria: Feria }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [entregadas, setEntregadas] = useState(false);
  const [ultima, setUltima] = useState<{ numero: number; stand: StandId } | null>(null);
  const tablero = useRef<HTMLDivElement>(null);
  useEscalonado(tablero, `${filtro}-${entregadas}`);

  const comandasDe = (stand: StandId) => {
    const delStand = feria.tickets.filter((t) => standsDe(t).includes(stand) && Boolean(t.entregas[stand]) === entregadas);
    return entregadas ? delStand.reverse() : delStand;
  };
  const visibles = filtro === "todos" ? IDS_STAND : [filtro];
  const filas = Math.max(2, ...visibles.flatMap((s) => comandasDe(s).map((t) => renglones(t.items).filter((l) => l.stand === s).length)));
  const cuentas = Object.fromEntries((["todos", ...IDS_STAND] as Filtro[]).map((f) => [f, pendientesDe(feria.tickets, f).length])) as Record<Filtro, number>;

  function marcar(numero: number, stand: StandId, entregado: boolean) {
    feria.marcarEntrega(numero, stand, entregado);
    setUltima(entregado ? { numero, stand } : null);
  }

  const comanda = (t: Ticket, stand: StandId) => (
    <li key={t.numero} data-entra className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border-2 bg-white ${t.entrega === "casa" ? "border-[#F59E0B]" : "border-[#EAE2D8]"}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 bg-[#18181B] px-3 py-2.5 text-white xl:px-4">
        <p className="whitespace-nowrap text-base font-extrabold leading-tight lg:text-lg">Ticket {codigo(t.numero)}</p>
        <p className="whitespace-nowrap text-xs font-semibold text-white/75">{hora(t.fecha)}</p>
      </div>
      <div className="flex flex-1 flex-col p-3 xl:p-4">
        <p className="break-words text-sm font-bold text-[#18181B] lg:text-base">{quien(t)}</p>
        <BadgeEntrega entrega={t.entrega} casa={t.casa} className="mt-2" />
        <ul className="mb-3 mt-3 text-lg font-extrabold leading-8 text-[#18181B] lg:text-xl" style={{ minHeight: `${filas * 2}rem` }}>
          {renglones(t.items)
            .filter((l) => l.stand === stand)
            .map((l) => (
              <li key={l.id}>
                {l.cantidad} × {l.nombre}
              </li>
            ))}
        </ul>
        {entregadas ? (
          <button type="button" aria-label={`Regresar a pendientes ${codigo(t.numero)} en ${STANDS[stand].nombre}`} onClick={() => marcar(t.numero, stand, false)} className="tf-boton tf-linea mt-auto !min-h-12 w-full !px-2">
            <Undo2 size={16} aria-hidden /> Regresar · entregado {hora(t.entregas[stand]!)}
          </button>
        ) : (
          <button type="button" aria-label={`Listo y entregado ${codigo(t.numero)} en ${STANDS[stand].nombre}`} onClick={() => marcar(t.numero, stand, true)} className="tf-boton tf-verde mt-auto !min-h-12 w-full !px-2">
            <Check size={18} aria-hidden /> Listo y entregado
          </button>
        )}
      </div>
    </li>
  );

  const vacio = (
    <p className="rounded-2xl border border-dashed border-[#D9CFC3] p-6 text-center text-sm font-semibold text-[#6B6560]">{entregadas ? "Todavía no se ha entregado nada." : "Sin comandas pendientes."}</p>
  );

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FiltroStands actual={filtro} alElegir={setFiltro} cuentas={cuentas} etiqueta="Ver las comandas de un puesto" />
        <div role="group" aria-label="Estado de las comandas" className="flex gap-2">
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
              <CircleCheck size={17} aria-hidden /> {codigo(ultima.numero)} entregado en {STANDS[ultima.stand].nombre}
            </span>
            <button type="button" onClick={() => marcar(ultima.numero, ultima.stand, false)} className="inline-flex min-h-11 items-center gap-1.5 px-2 underline">
              <Undo2 size={15} aria-hidden /> Deshacer
            </button>
          </p>
        )}
      </div>

      <div ref={tablero} className="mt-5">
        {filtro === "todos" ? (
          <div className="grid items-start gap-2 md:grid-cols-3 xl:gap-4">
            {IDS_STAND.map((stand) => {
              const Icono = STANDS[stand].icono;
              const comandas = comandasDe(stand);
              return (
                <section key={stand} aria-label={STANDS[stand].nombre} className="min-w-0 rounded-2xl bg-[#F3EFEA] p-2 xl:p-3">
                  <h2 className="flex items-center gap-2 px-1 pb-3 text-base font-extrabold">
                    <Icono size={18} aria-hidden className="shrink-0 text-[#B91C1C]" /> {STANDS[stand].nombre}
                    <span className="ml-auto rounded-full bg-white px-2.5 py-0.5 text-sm text-[#18181B]">{comandas.length}</span>
                  </h2>
                  {comandas.length ? <ul className="grid gap-3">{comandas.map((t) => comanda(t, stand))}</ul> : vacio}
                </section>
              );
            })}
          </div>
        ) : comandasDe(filtro).length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">{comandasDe(filtro).map((t) => comanda(t, filtro))}</ul>
        ) : (
          vacio
        )}
      </div>
    </div>
  );
}
