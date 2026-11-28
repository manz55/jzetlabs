import { useState, type FormEvent } from "react";
import { CircleCheck, Minus, PackagePlus, Plus, Undo2 } from "lucide-react";
import { IDS_STAND, PRODUCTOS, STANDS, hora, productosDe, type Feria, type ProductoId, type StandId } from "./datos";

export function CargaStock({ feria }: { feria: Feria }) {
  const [stand, setStand] = useState<StandId>("parrilla");
  const [producto, setProducto] = useState<ProductoId>("carne");
  const [cantidad, setCantidad] = useState("20");
  const [aviso, setAviso] = useState("");
  const n = Number(cantidad);
  const valida = Number.isInteger(n) && n >= 1 && n <= 500;
  const historial = feria.cargas.filter((c) => PRODUCTOS[c.producto].stand === stand).slice().reverse();

  function elegirStand(id: StandId) {
    setStand(id);
    setProducto(productosDe(id)[0]);
    setAviso("");
  }

  function sumar(e: FormEvent) {
    e.preventDefault();
    if (!valida) return;
    feria.cargar(producto, n);
    setAviso(`Se sumaron ${n} de ${PRODUCTOS[producto].nombre}. Ahora quedan ${feria.quedan(producto) + n}.`);
  }

  return (
    <section id="carga-stock" className="scroll-mt-32 bg-[#F9F5F0] py-14 lg:scroll-mt-20">
      <div className="tf-ancho">
        <h2 className="text-3xl font-extrabold">Carga de Stock</h2>
        <p className="mt-2">El encargado de cada puesto registra las porciones que trajo. La carta y la caja se actualizan al instante.</p>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-12">
          <form onSubmit={sumar} className="tf-tarjeta grid gap-6 p-6 lg:col-span-7">
            <fieldset className="min-w-0">
              <legend className="tf-rotulo">1. Tu puesto</legend>
              <div className="flex flex-wrap gap-2">
                {IDS_STAND.map((id) => (
                  <button key={id} type="button" aria-pressed={stand === id} onClick={() => elegirStand(id)} className="tf-pildora">
                    {STANDS[id].nombre}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="min-w-0">
              <legend className="tf-rotulo">2. Platillo o bebida</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {productosDe(stand).map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={producto === id}
                    onClick={() => {
                      setProducto(id);
                      setAviso("");
                    }}
                    className={`min-w-0 rounded-xl border-2 p-4 text-left transition ${producto === id ? "border-[#B91C1C] bg-[#FEF2F2]" : "border-[#EAE2D8] bg-white hover:border-[#18181B]"}`}
                  >
                    <b className="block text-[#18181B]">{PRODUCTOS[id].nombre}</b>
                    <span className={`text-sm font-semibold ${feria.quedan(id) ? "text-[#6B6560]" : "text-[#B91C1C]"}`}>
                      {feria.quedan(id) ? `Quedan ${feria.quedan(id)} de ${feria.cargado(id)}` : "Agotado"}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="min-w-0">
              <label htmlFor="tf-porciones" className="tf-rotulo">3. Porciones que sumas</label>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" aria-label="Una porción menos" onClick={() => setCantidad(String(Math.max(1, (n || 1) - 1)))} className="tf-boton tf-linea size-12 !px-0">
                  <Minus size={17} aria-hidden />
                </button>
                <input
                  id="tf-porciones"
                  inputMode="numeric"
                  value={cantidad}
                  onChange={(e) => {
                    setCantidad(e.target.value.replace(/\D/g, "").slice(0, 3));
                    setAviso("");
                  }}
                  className="tf-campo !w-24 text-center !text-xl"
                />
                <button type="button" aria-label="Una porción más" onClick={() => setCantidad(String(Math.min(500, (n || 0) + 1)))} className="tf-boton tf-linea size-12 !px-0">
                  <Plus size={17} aria-hidden />
                </button>
                {[10, 20, 50].map((v) => (
                  <button key={v} type="button" aria-pressed={n === v} onClick={() => setCantidad(String(v))} className="tf-pildora">
                    +{v}
                  </button>
                ))}
              </div>
              {!valida && <p className="mt-2 text-sm font-semibold text-[#B91C1C]">Escribe una cantidad entre 1 y 500.</p>}
            </div>

            <div>
              <button type="submit" disabled={!valida} className="tf-boton tf-rojo !min-h-12 w-full">
                <PackagePlus size={18} aria-hidden /> Sumar {valida ? n : ""} a {PRODUCTOS[producto].nombre}
              </button>
              <p role="status" className={`mt-3 flex items-start gap-2 text-sm font-bold text-[#15803D] ${aviso ? "" : "sr-only"}`}>
                {aviso && <CircleCheck size={17} aria-hidden className="mt-0.5 shrink-0" />}
                {aviso}
              </p>
            </div>
          </form>

          <div className="tf-tarjeta p-6 lg:col-span-5">
            <h3 className="text-lg font-bold">Movimientos de {STANDS[stand].nombre}</h3>
            <ul className="mt-3 max-h-[24rem] divide-y divide-[#F1EAE1] overflow-y-auto">
              {historial.map((c) => {
                const anulable = !c.apertura && feria.quedan(c.producto) >= c.cantidad;
                return (
                  <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <b className="block text-[#18181B]">{PRODUCTOS[c.producto].nombre}</b>
                      <span className="text-sm text-[#6B6560]">
                        {c.apertura ? "Con esto arrancó" : "Recarga"} · {hora(c.fecha)}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <b className={`text-lg ${c.apertura ? "text-[#18181B]" : "text-[#15803D]"}`}>
                        {c.apertura ? "" : "+"}
                        {c.cantidad}
                      </b>
                      {anulable && (
                        <button type="button" aria-label={`Anular la recarga de ${c.cantidad} de ${PRODUCTOS[c.producto].nombre}`} title="Anular recarga" onClick={() => feria.anularCarga(c.id)} className="tf-boton tf-linea size-11 !px-0">
                          <Undo2 size={16} aria-hidden />
                        </button>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
