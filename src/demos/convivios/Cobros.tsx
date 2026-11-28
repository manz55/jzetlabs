import { useRef } from "react";
import { ArrowDown, Banknote, Landmark, Minus, Plus, ReceiptText, Send, Smartphone, Store, Trash2 } from "lucide-react";
import { IDS_STAND, STANDS, productosDe, PRODUCTOS, qz, renglones, totalDe, cuentaVacia, faltaEfectivo, type Cuenta, type Feria, type Pago, type ProductoId, type Rol } from "./datos";
import { irA } from "./animar";
import { Comprobante } from "./Comprobante";
import { Efectivo } from "./Efectivo";
import { Foto } from "./Piezas";
import { PorConfirmar } from "./PorConfirmar";

export type Pedido = {
  feria: Feria;
  cuenta: Cuenta;
  alCuenta: (c: Cuenta) => void;
  rol: Rol;
  alRol: (r: Rol) => void;
  emitido: number | null;
  alEmitir: (numero: number | null) => void;
};

export function MesaCobros({ feria, cuenta, alCuenta, rol, alRol, emitido, alEmitir, alDespacho }: Pedido & { alDespacho: () => void }) {
  const campoNombre = useRef<HTMLInputElement>(null);
  const esCaja = rol === "caja";
  const ticket = feria.ticket(emitido);
  const lineas = renglones(cuenta.items);
  const total = totalDe(cuenta.items);
  const piezas = lineas.reduce((s, l) => s + l.cantidad, 0);
  const recibido = Number(cuenta.recibido);
  const sinStock = lineas.filter((l) => l.cantidad > feria.quedan(l.id));

  const falta = !lineas.length
    ? esCaja
      ? "Toca los productos que piden."
      : "Toca lo que quieres pedir."
    : sinStock.length
      ? `Ya no alcanza ${sinStock.map((l) => l.nombre).join(" ni ")}: baja la cantidad.`
      : !cuenta.vecino.trim()
        ? "Escribe el nombre de quien pide."
        : cuenta.entrega === "casa" && !cuenta.casa.trim()
          ? "Escribe la nomenclatura de la casa para el envío."
          : esCaja && cuenta.metodo === "efectivo"
            ? faltaEfectivo(total, cuenta.recibido)
            : "";

  const cambiar = (parte: Partial<Cuenta>) => {
    alEmitir(null);
    alCuenta({ ...cuenta, ...parte });
  };
  const poner = (id: ProductoId, n: number) => cambiar({ items: { ...cuenta.items, [id]: Math.max(0, Math.min(n, feria.quedan(id))) } });

  function enviar() {
    if (falta) return;
    const pago: Pago = cuenta.metodo === "efectivo" ? { tipo: "efectivo", recibido: esCaja ? recibido : 0 } : { tipo: "transferencia", banco: cuenta.banco, boleta: cuenta.boleta.trim() };
    const items = Object.fromEntries(lineas.map((l) => [l.id, l.cantidad]));
    const nuevo = (esCaja ? feria.cobrar : feria.pedir)(cuenta, items, pago);
    if (!nuevo) return;
    alEmitir(nuevo.numero);
    alCuenta(cuentaVacia());
    window.setTimeout(() => irA("tf-cuenta"), 60);
  }

  function siguiente() {
    alEmitir(null);
    window.setTimeout(() => campoNombre.current?.focus({ preventScroll: true }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mt-6 grid items-start gap-6 xl:grid-cols-12">
      <div className="grid min-w-0 gap-5 xl:col-span-8">
        <div role="group" aria-label="Quién hace el pedido" className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-bold text-[#18181B]">¿Quién está pidiendo?</span>
          <button type="button" aria-pressed={!esCaja} onClick={() => alRol("vecino")} className="tf-pildora">
            <Smartphone size={16} aria-hidden /> Soy vecino
          </button>
          <button type="button" aria-pressed={esCaja} onClick={() => alRol("caja")} className="tf-pildora">
            <Store size={16} aria-hidden /> Soy de caja
            {feria.porConfirmar.length > 0 && (
              <span className="tf-cuenta">
                {feria.porConfirmar.length}
                <span className="sr-only"> por confirmar</span>
              </span>
            )}
          </button>
        </div>

        {esCaja && <PorConfirmar feria={feria} />}

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
          <Comprobante ticket={ticket} rol={rol} alSiguiente={siguiente} alDespacho={alDespacho} />
        ) : (
          <div className="tf-tarjeta p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold">{esCaja ? "Cuenta actual" : "Tu pedido"}</h2>
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
                <Banknote size={17} aria-hidden /> {esCaja ? "Efectivo" : "Efectivo en caja"}
              </button>
              <button type="button" aria-pressed={cuenta.metodo === "transferencia"} onClick={() => cambiar({ metodo: "transferencia" })} className="tf-pildora !rounded-xl">
                <Landmark size={17} aria-hidden /> Transferencia
              </button>
            </div>

            {cuenta.metodo === "efectivo" ? (
              esCaja ? (
                <div className="mt-4">
                  <Efectivo id="tf-recibido" total={total} recibido={cuenta.recibido} alCambiar={(v) => cambiar({ recibido: v })} />
                </div>
              ) : (
                <p className="mt-4 rounded-xl bg-[#F9F5F0] px-4 py-3 text-sm font-bold text-[#18181B]">Pagas {qz(total)} en Caja Central y ahí confirman tu pedido.</p>
              )
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

            <button type="button" disabled={Boolean(falta)} onClick={enviar} aria-describedby="tf-falta" className="tf-boton tf-verde mt-4 !min-h-14 w-full !text-base">
              {esCaja ? <ReceiptText size={19} aria-hidden /> : <Send size={19} aria-hidden />}
              {esCaja ? "Cobrar y generar ticket digital" : "Enviar pedido a caja"}
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
              {esCaja ? "Ir a cobrar" : "Ver mi pedido"} <ArrowDown size={17} aria-hidden />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
