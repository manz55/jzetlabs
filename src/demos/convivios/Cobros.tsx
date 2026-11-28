import { useRef, useState } from "react";
import { ArrowDown, ArrowRight, Banknote, CircleCheck, Landmark, Minus, Plus, ReceiptText, Trash2 } from "lucide-react";
import { IDS_STAND, STANDS, codigo, hora, productosDe, PRODUCTOS, qz, renglones, standsDe, totalDe, cuentaVacia, quien, type Cuenta, type Feria, type Pago, type ProductoId, type Ticket } from "./datos";
import { irA } from "./animar";
import { BadgeEntrega, Foto } from "./Piezas";

const BILLETE_MAYOR = 200;

export function MesaCobros({ feria, cuenta, alCuenta, alDespacho }: { feria: Feria; cuenta: Cuenta; alCuenta: (c: Cuenta) => void; alDespacho: () => void }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const campoNombre = useRef<HTMLInputElement>(null);
  const lineas = renglones(cuenta.items);
  const total = totalDe(cuenta.items);
  const piezas = lineas.reduce((s, l) => s + l.cantidad, 0);
  const recibido = Number(cuenta.recibido);
  const vuelto = recibido - total;
  const sinStock = lineas.filter((l) => l.cantidad > feria.quedan(l.id));

  const falta = !lineas.length
    ? "Toca los productos que piden."
    : sinStock.length
      ? `Ya no alcanza ${sinStock.map((l) => l.nombre).join(" ni ")}: baja la cantidad.`
      : !cuenta.vecino.trim()
        ? "Escribe el nombre de quien pide."
        : cuenta.entrega === "casa" && !cuenta.casa.trim()
          ? "Escribe la nomenclatura de la casa para el envío."
          : cuenta.metodo === "efectivo" && !cuenta.recibido
            ? "Ingresa con cuánto paga."
            : cuenta.metodo === "efectivo" && vuelto < 0
              ? `Faltan ${qz(-vuelto)}.`
              : cuenta.metodo === "efectivo" && vuelto >= BILLETE_MAYOR
                ? `Revisa el monto: el vuelto sería de ${qz(vuelto)}.`
                : "";

  const cambiar = (parte: Partial<Cuenta>) => {
    setTicket(null);
    alCuenta({ ...cuenta, ...parte });
  };
  const poner = (id: ProductoId, n: number) => cambiar({ items: { ...cuenta.items, [id]: Math.max(0, Math.min(n, feria.quedan(id))) } });

  function cobrar() {
    if (falta) return;
    const pago: Pago = cuenta.metodo === "efectivo" ? { tipo: "efectivo", recibido } : { tipo: "transferencia", banco: cuenta.banco, boleta: cuenta.boleta.trim() };
    const nuevo = feria.cobrar(cuenta, Object.fromEntries(lineas.map((l) => [l.id, l.cantidad])), pago);
    if (!nuevo) return;
    setTicket(nuevo);
    alCuenta(cuentaVacia());
    window.setTimeout(() => irA("tf-cuenta"), 60);
  }

  function siguiente() {
    setTicket(null);
    window.setTimeout(() => campoNombre.current?.focus({ preventScroll: true }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mt-6 grid items-start gap-6 xl:grid-cols-12">
      <div className="grid min-w-0 gap-5 xl:col-span-8">
        <div className="grid items-end gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.15fr)]">
          <div className="min-w-0">
            <label htmlFor="tf-nombre" className="tf-rotulo">Nombre</label>
            <input ref={campoNombre} id="tf-nombre" autoComplete="off" maxLength={30} placeholder="Carlos" value={cuenta.vecino} onChange={(e) => cambiar({ vecino: e.target.value })} className="tf-campo" />
          </div>
          <fieldset className="min-w-0">
            <legend className="tf-rotulo">¿Cómo recibe?</legend>
            <div className="flex h-12 gap-1 rounded-xl border border-[#D9CFC3] bg-[#F9F5F0] p-1">
              {(
                [
                  ["salon", "Recoger en salón / evento"],
                  ["casa", "Enviar a mi casa"],
                ] as const
              ).map(([id, nombre]) => (
                <button key={id} type="button" aria-pressed={cuenta.entrega === id} onClick={() => cambiar({ entrega: id })} className={`min-w-0 flex-auto rounded-lg px-2.5 text-[0.78rem] font-bold leading-tight transition ${cuenta.entrega === id ? "bg-[#18181B] text-white" : "text-[#3F3F46] hover:bg-white"}`}>
                  {nombre}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="min-w-0">
            <label htmlFor="tf-casa" className="tf-rotulo">
              Nomenclatura / Casa {cuenta.entrega === "casa" && <span className="text-[#B91C1C]">(obligatoria)</span>}
            </label>
            <input id="tf-casa" autoComplete="off" maxLength={20} required={cuenta.entrega === "casa"} placeholder="Ej. 12-23 o Mz. B 4-10" value={cuenta.casa} onChange={(e) => cambiar({ casa: e.target.value })} className={`tf-campo ${cuenta.entrega === "casa" && !cuenta.casa.trim() ? "!border-[#B91C1C]" : ""}`} />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {IDS_STAND.map((stand) => {
            const Icono = STANDS[stand].icono;
            return (
              <section key={stand} aria-label={STANDS[stand].nombre} className="min-w-0">
                <h2 className="flex items-center gap-2 text-base font-extrabold">
                  <Icono size={17} aria-hidden className="text-[#B91C1C]" /> {STANDS[stand].nombre}
                </h2>
                <div className="mt-2.5 grid gap-3">
                  {productosDe(stand).map((id) => {
                    const p = PRODUCTOS[id];
                    const quedan = feria.quedan(id);
                    const n = cuenta.items[id] ?? 0;
                    const agotado = quedan <= 0;
                    return (
                      <button
                        key={id}
                        type="button"
                        disabled={agotado || n >= quedan}
                        onClick={() => poner(id, n + 1)}
                        className={`tf-tarjeta relative grid grid-cols-[6.5rem_minmax(0,1fr)] overflow-hidden text-left transition enabled:active:scale-[0.98] disabled:cursor-not-allowed md:grid-cols-1 ${n ? "!border-[#B91C1C] ring-2 ring-[#B91C1C]" : "enabled:hover:!border-[#18181B]"} ${agotado ? "!bg-[#F9F5F0]" : ""}`}
                      >
                        <Foto id={p.foto} alt="" ancho={400} alto={240} className={`h-full min-h-24 w-full md:h-28 ${agotado ? "opacity-40 grayscale" : ""}`} />
                        <span className="flex min-w-0 flex-col justify-center p-3.5">
                          <span className="text-base font-bold leading-tight text-[#18181B]">{p.nombre}</span>
                          <span className="mt-1 flex flex-wrap items-baseline justify-between gap-x-2">
                            <span className={`text-2xl font-extrabold ${agotado ? "text-[#8A817A]" : "text-[#B91C1C]"}`}>{qz(p.precio)}</span>
                            <span className={`text-xs font-bold ${agotado ? "text-[#B91C1C]" : "text-[#6B6560]"}`}>{agotado ? "AGOTADO" : `Quedan ${quedan}`}</span>
                          </span>
                        </span>
                        {n > 0 && <span className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-[#18181B] text-base font-extrabold text-white shadow">{n}</span>}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <div id="tf-cuenta" className="min-w-0 scroll-mt-32 lg:scroll-mt-24 xl:sticky xl:top-20 xl:col-span-4 xl:max-h-[calc(100dvh-5.5rem)] xl:overflow-y-auto">
        {ticket ? (
          <TicketDigital ticket={ticket} alSiguiente={siguiente} alDespacho={alDespacho} />
        ) : (
          <div className="tf-tarjeta p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold">Cuenta actual</h2>
              {lineas.length > 0 && (
                <button type="button" onClick={() => cambiar({ items: {} })} className="inline-flex min-h-11 items-center gap-1.5 px-1 text-sm font-bold text-[#6B6560] hover:text-[#B91C1C]">
                  <Trash2 size={15} aria-hidden /> Vaciar
                </button>
              )}
            </div>

            {lineas.length === 0 ? (
              <p className="mt-2 rounded-xl border border-dashed border-[#D9CFC3] p-4 text-sm text-[#6B6560]">Los productos que toques aparecerán aquí.</p>
            ) : (
              <ul className="mt-1 divide-y divide-[#F1EAE1]">
                {lineas.map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-2 py-2">
                    <span className="min-w-0">
                      <b className="block text-[0.95rem] leading-tight text-[#18181B]">{l.nombre}</b>
                      <span className="text-sm font-bold text-[#6B6560]">{qz(l.cantidad * l.precio)}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <button type="button" aria-label={`Quitar un ${l.nombre}`} onClick={() => poner(l.id, l.cantidad - 1)} className="tf-boton tf-linea size-11 !px-0">
                        <Minus size={16} aria-hidden />
                      </button>
                      <b className="w-7 text-center text-lg text-[#18181B]">{l.cantidad}</b>
                      <button type="button" aria-label={`Agregar un ${l.nombre}`} disabled={l.cantidad >= feria.quedan(l.id)} onClick={() => poner(l.id, l.cantidad + 1)} className="tf-boton tf-linea size-11 !px-0">
                        <Plus size={16} aria-hidden />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-3 flex items-baseline justify-between border-t-2 border-[#18181B] pt-3">
              <span className="font-bold text-[#18181B]">Total</span>
              <span className="text-4xl font-extrabold text-[#18181B]">{qz(total)}</span>
            </div>

            <div role="group" aria-label="Forma de pago" className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" aria-pressed={cuenta.metodo === "efectivo"} onClick={() => cambiar({ metodo: "efectivo" })} className="tf-pildora !rounded-xl">
                <Banknote size={17} aria-hidden /> Efectivo
              </button>
              <button type="button" aria-pressed={cuenta.metodo === "transferencia"} onClick={() => cambiar({ metodo: "transferencia" })} className="tf-pildora !rounded-xl">
                <Landmark size={17} aria-hidden /> Transferencia
              </button>
            </div>

            {cuenta.metodo === "efectivo" ? (
              <div className="mt-4">
                <label htmlFor="tf-recibido" className="tf-rotulo">Paga con (Q)</label>
                <input id="tf-recibido" inputMode="numeric" autoComplete="off" placeholder="Billete que entrega" value={cuenta.recibido} onChange={(e) => cambiar({ recibido: e.target.value.replace(/\D/g, "").slice(0, 5) })} className="tf-campo !text-xl" />
                <div className="mt-2 grid grid-cols-4 gap-2">
                  <button type="button" disabled={!total} onClick={() => cambiar({ recibido: String(total) })} className="tf-boton tf-linea !px-1">
                    Exacto
                  </button>
                  {[50, 100, 200].map((b) => (
                    <button key={b} type="button" onClick={() => cambiar({ recibido: String(b) })} className="tf-boton tf-linea !px-1">
                      Q{b}
                    </button>
                  ))}
                </div>
                <p aria-live="polite" className={`mt-3 flex items-baseline justify-between rounded-xl px-4 py-3 ${total && cuenta.recibido && vuelto >= 0 && vuelto < BILLETE_MAYOR ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#F9F5F0] text-[#6B6560]"}`}>
                  <span className="font-bold">Vuelto</span>
                  <span className="text-2xl font-extrabold">{total && cuenta.recibido && vuelto >= 0 ? qz(vuelto) : "Q0"}</span>
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-3">
                <div role="group" aria-label="Banco" className="grid grid-cols-2 gap-2">
                  {(["BI", "BAC"] as const).map((b) => (
                    <button key={b} type="button" aria-pressed={cuenta.banco === b} onClick={() => cambiar({ banco: b })} className="tf-pildora">
                      {b === "BI" ? "Banco Industrial" : "BAC"}
                    </button>
                  ))}
                </div>
                <div>
                  <label htmlFor="tf-boleta" className="tf-rotulo">
                    No. de comprobante <span className="font-medium text-[#6B6560]">(opcional)</span>
                  </label>
                  <input id="tf-boleta" inputMode="numeric" autoComplete="off" placeholder="Del comprobante que te muestran" value={cuenta.boleta} onChange={(e) => cambiar({ boleta: e.target.value.replace(/\D/g, "").slice(0, 12) })} className="tf-campo" />
                </div>
              </div>
            )}

            <button type="button" disabled={Boolean(falta)} onClick={cobrar} aria-describedby="tf-falta" className="tf-boton tf-verde mt-4 !min-h-14 w-full !text-base">
              <ReceiptText size={19} aria-hidden /> Cobrar y generar ticket digital
            </button>
            <p id="tf-falta" aria-live="polite" className="mt-2 min-h-5 text-center text-sm font-semibold text-[#6B6560]">{falta}</p>
          </div>
        )}
      </div>

      {!ticket && piezas > 0 && (
        <div className="fixed inset-x-3 bottom-3 z-30 xl:hidden">
          <button type="button" onClick={() => irA("tf-cuenta")} className="tf-boton mx-auto !min-h-14 w-full max-w-md justify-between !rounded-2xl bg-[#18181B] text-white shadow-2xl">
            <span>
              {piezas} {piezas === 1 ? "producto" : "productos"} · {qz(total)}
            </span>
            <span className="flex items-center gap-1.5">
              Ir a cobrar <ArrowDown size={17} aria-hidden />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function TicketDigital({ ticket, alSiguiente, alDespacho }: { ticket: Ticket; alSiguiente: () => void; alDespacho: () => void }) {
  const total = totalDe(ticket.items);
  return (
    <div role="status" className="tf-tarjeta overflow-hidden">
      <div className="bg-[#15803D] px-5 py-4 text-white">
        <p className="flex items-center gap-2 text-sm font-bold">
          <CircleCheck size={18} aria-hidden /> Pagado · {hora(ticket.fecha)}
        </p>
        <p className="mt-1 text-4xl font-extrabold">{codigo(ticket.numero)}</p>
        <p className="break-words font-semibold">{quien(ticket)}</p>
      </div>
      <div className="border-t-2 border-dashed border-[#D9CFC3] p-5">
        <BadgeEntrega entrega={ticket.entrega} casa={ticket.casa} className="mb-4" />
        {standsDe(ticket).map((stand) => (
          <div key={stand} className="mb-3">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#B91C1C]">
              {ticket.entrega === "casa" ? "Sale de" : "Retira en"} {STANDS[stand].nombre}
            </p>
            <ul>
              {renglones(ticket.items)
                .filter((l) => l.stand === stand)
                .map((l) => (
                  <li key={l.id} className="flex justify-between gap-3 py-0.5 font-semibold text-[#18181B]">
                    <span>
                      {l.cantidad} × {l.nombre}
                    </span>
                    <span>{qz(l.cantidad * l.precio)}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
        <dl className="border-t border-[#EAE2D8] pt-3 text-sm">
          <div className="flex justify-between text-xl font-extrabold text-[#18181B]">
            <dt>Total</dt>
            <dd>{qz(total)}</dd>
          </div>
          {ticket.pago.tipo === "efectivo" ? (
            <>
              <div className="mt-1 flex justify-between">
                <dt>Efectivo recibido</dt>
                <dd className="font-bold">{qz(ticket.pago.recibido)}</dd>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-[#15803D]">
                <dt>Entrega de vuelto</dt>
                <dd>{qz(ticket.pago.recibido - total)}</dd>
              </div>
            </>
          ) : (
            <div className="mt-1 flex justify-between gap-3">
              <dt>Transferencia {ticket.pago.banco}</dt>
              <dd className="font-bold">{ticket.pago.boleta || "Sin número"}</dd>
            </div>
          )}
        </dl>
        <button type="button" onClick={alSiguiente} className="tf-boton tf-rojo mt-5 !min-h-12 w-full">
          Cobrar al siguiente
        </button>
        <button type="button" onClick={alDespacho} className="tf-boton tf-linea mt-2 w-full">
          Verla en los stands <ArrowRight size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}
