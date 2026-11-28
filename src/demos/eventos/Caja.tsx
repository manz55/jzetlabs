/* Caja y Stands: se cobra en una sola mesa y cada puesto entrega desde su pantalla, sin papelitos. */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Banknote, Check, Landmark, Minus, Plus, Undo2 } from "lucide-react";
import { useEscalonado } from "./animar";
import { CONVIVIO, MENU, PRODUCTOS, PUESTOS, ahora, codigo, itemsDe, pendiente, puestosDe, qz, totalDe, type Cuenta, type Imperial, type Pago, type ProdId, type Puesto, type Ticket } from "./datos";
import { ICONO_PUESTO, ancho, boton, pastilla, tarjeta } from "./estilos";
import { Foto } from "./Piezas";

export type Modo = "caja" | "entrega";

export function Caja({ imp, modo, alModo, cuenta, alCuenta }: { imp: Imperial; modo: Modo; alModo: (m: Modo) => void; cuenta: Cuenta; alCuenta: (c: Cuenta) => void }) {
  const porEntregar = imp.tickets.filter((t) => pendiente(t)).length;
  return (
    <div className={`${ancho} py-8 sm:py-10`}>
      <h1 className="text-3xl sm:text-4xl">Caja y Stands</h1>
      <p className="mt-2">
        {CONVIVIO.nombre} · {CONVIVIO.lugar}
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2" role="group" aria-label="Modo de trabajo">
        {(
          [
            ["caja", "Mesa de Cobros", "Caja central: cobra y entrega el ticket"],
            ["entrega", "Entrega en Stands", `${porEntregar} ${porEntregar === 1 ? "orden pendiente" : "órdenes pendientes"} de entregar`],
          ] as const
        ).map(([id, nombre, texto]) => (
          <button key={id} type="button" aria-pressed={modo === id} onClick={() => alModo(id)} className={`min-w-0 rounded-2xl border-2 p-5 text-left transition ${modo === id ? "border-[#1C1917] bg-[#1C1917] text-white" : "border-[#E4DDD3] bg-white text-[#1C1917] hover:border-[#A16207]"}`}>
            <span className="block font-(family-name:--ci-serif) text-xl font-bold">{nombre}</span>
            <span className={`mt-1 block text-sm ${modo === id ? "text-[#D6CCBF]" : "text-[#6B625B]"}`}>{texto}</span>
          </button>
        ))}
      </div>
      {modo === "caja" ? <Cobros imp={imp} cuenta={cuenta} alCuenta={alCuenta} alEntrega={() => alModo("entrega")} /> : <Entrega imp={imp} />}
    </div>
  );
}

function Cobros({ imp, cuenta, alCuenta, alEntrega }: { imp: Imperial; cuenta: Cuenta; alCuenta: (c: Cuenta) => void; alEntrega: () => void }) {
  const [pago, setPago] = useState<Pago | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const lineas = itemsDe(cuenta);
  const total = totalDe(cuenta);
  const piezas = lineas.reduce((s, l) => s + l.n, 0);

  const poner = (id: ProdId, n: number) => {
    setTicket(null);
    alCuenta({ ...cuenta, [id]: Math.max(0, Math.min(99, n)) });
  };
  function cobrar() {
    if (!pago || !total) return;
    setTicket(imp.cobrar(Object.fromEntries(lineas.map((l) => [l.id, l.n])), pago));
    alCuenta({});
    setPago(null);
    window.setTimeout(() => panel.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 50);
  }

  return (
    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
      <div className="grid gap-8">
        {PUESTOS.map((puesto) => {
          const Icono = ICONO_PUESTO[puesto];
          return (
            <section key={puesto} aria-label={`Stand ${puesto}`}>
              <h2 className="flex items-center gap-2.5 text-xl">
                <Icono size={20} aria-hidden className="text-[#A16207]" /> Stand {puesto}
              </h2>
              <div className="mt-3 grid gap-4 min-[480px]:grid-cols-2">
                {PRODUCTOS.filter((id) => MENU[id].puesto === puesto).map((id) => {
                  const p = MENU[id];
                  const n = cuenta[id] ?? 0;
                  return (
                    <button key={id} type="button" onClick={() => poner(id, n + 1)} className={`${tarjeta} relative grid grid-cols-[6rem_minmax(0,1fr)] items-stretch overflow-hidden text-left transition active:scale-[0.98] sm:grid-cols-[7.5rem_minmax(0,1fr)] ${n ? "!border-[#A16207] ring-1 ring-[#A16207]" : "hover:!border-[#1C1917]"}`}>
                      <Foto id={p.foto} alt={p.alt} ancho={300} alto={300} className="h-full min-h-28" />
                      <span className="flex flex-col justify-center gap-1 p-4 pr-11">
                        <span className="font-bold leading-tight text-[#1C1917]">{p.nombre}</span>
                        <span className="text-2xl font-extrabold text-[#A16207]">{qz(p.precio)}</span>
                      </span>
                      <span className={`absolute right-3 top-3 grid size-8 place-items-center rounded-full text-sm font-extrabold ${n ? "bg-[#1C1917] text-white" : "bg-[#F3EFEA] text-[#1C1917]"}`}>
                        {n || <Plus size={16} aria-label="Agregar" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div ref={panel} className="min-w-0 scroll-mt-24 lg:sticky lg:top-24">
        {ticket ? (
          <TicketDigital ticket={ticket} alNuevo={() => setTicket(null)} alEntrega={alEntrega} />
        ) : (
          <div className={`${tarjeta} p-6 sm:p-7`}>
            <h2 className="text-2xl">Cuenta actual</h2>
            {lineas.length === 0 ? (
              <p className="mt-4 text-[#6B625B]">Toque los productos que le piden y aparecerán aquí.</p>
            ) : (
              <ul className="mt-4 divide-y divide-[#EFE9E1]">
                {lineas.map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <b className="block leading-tight text-[#1C1917]">{l.nombre}</b>
                      <span className="text-sm text-[#6B625B]">
                        <b className="text-base text-[#1C1917]">{qz(l.n * l.precio)}</b> · {qz(l.precio)} c/u
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <button type="button" aria-label={`Quitar un ${l.nombre}`} onClick={() => poner(l.id, l.n - 1)} className={`${boton.linea} size-11 !px-0`}>
                        <Minus size={16} aria-hidden />
                      </button>
                      <b className="w-7 text-center text-lg text-[#1C1917]">{l.n}</b>
                      <button type="button" aria-label={`Agregar un ${l.nombre}`} onClick={() => poner(l.id, l.n + 1)} className={`${boton.linea} size-11 !px-0`}>
                        <Plus size={16} aria-hidden />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 flex items-end justify-between gap-4 border-t-2 border-[#1C1917] pt-4">
              <span className="font-bold text-[#1C1917]">Total</span>
              <span className="text-4xl font-extrabold text-[#1C1917]">{qz(total)}</span>
            </p>
            <fieldset className="mt-5">
              <legend className="mb-2 text-sm font-bold text-[#1C1917]">¿Cómo paga?</legend>
              <div className="grid grid-cols-2 gap-3">
                {(["Efectivo", "Transferencia"] as const).map((m) => {
                  const Icono = m === "Efectivo" ? Banknote : Landmark;
                  return (
                    <button key={m} type="button" aria-pressed={pago === m} onClick={() => setPago(m)} className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl border-2 px-2 py-2 text-sm font-bold transition ${pago === m ? "border-[#A16207] bg-[#FBF3E4] text-[#1C1917]" : "border-[#E4DDD3] bg-white text-[#44403C] hover:border-[#1C1917]"}`}>
                      <Icono size={20} aria-hidden /> {m}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <button type="button" disabled={!total || !pago} onClick={cobrar} className={`${boton.bronce} mt-5 !min-h-14 w-full text-base`}>
              Cobrar y generar ticket digital
            </button>
            {total > 0 && !pago && <p className="mt-2 text-center text-sm text-[#6B625B]">Elija efectivo o transferencia para cobrar.</p>}
          </div>
        )}
      </div>

      {/* en celular la cuenta queda abajo: esta barra la deja siempre a un toque */}
      {total > 0 && <BarraCobro piezas={piezas} total={total} panel={panel} />}
    </div>
  );
}

function BarraCobro({ piezas, total, panel }: { piezas: number; total: number; panel: React.RefObject<HTMLDivElement | null> }) {
  const [seVe, setSeVe] = useState(false);
  useEffect(() => {
    if (!panel.current || !("IntersectionObserver" in window)) return;
    const o = new IntersectionObserver(([e]) => setSeVe(e.isIntersecting), { threshold: 0.15 });
    o.observe(panel.current);
    return () => o.disconnect();
  }, [panel]);
  if (seVe) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 p-3 lg:hidden">
      <button type="button" onClick={() => panel.current?.scrollIntoView({ behavior: "smooth", block: "start" })} className="flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl bg-[#1C1917] px-5 text-left font-bold text-white shadow-xl">
        <span>
          {piezas} en la cuenta · {qz(total)}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[#F0CC85]">
          Cobrar <ArrowRight size={17} aria-hidden />
        </span>
      </button>
    </div>
  );
}

function TicketDigital({ ticket, alNuevo, alEntrega }: { ticket: Ticket; alNuevo: () => void; alEntrega: () => void }) {
  const caja = useRef<HTMLDivElement>(null);
  useEscalonado(caja, String(ticket.n));
  return (
    <div ref={caja} role="status">
      <div data-entra className={`${tarjeta} overflow-hidden`}>
        <div className="bg-[#1C1917] p-6 text-center text-white sm:p-7">
          <p className="text-sm text-[#D6CCBF]">Pago recibido · entregue este número</p>
          <p className="mt-1 font-(family-name:--ci-serif) text-5xl font-bold">{codigo(ticket.n)}</p>
          <p className="mt-2 text-sm text-[#D6CCBF]">
            {ticket.hora} h · {ticket.pago}
          </p>
        </div>
        <div className="grid gap-4 p-6 sm:p-7">
          {puestosDe(ticket.items).map((p) => (
            <div key={p} className="border-b border-dashed border-[#CFC6BA] pb-4">
              <p className="flex justify-between gap-3 font-bold text-[#1C1917]">
                <span>Stand {p}</span>
                <span>{qz(totalDe(ticket.items, p))}</span>
              </p>
              <ul className="mt-1 text-[0.95rem]">
                {itemsDe(ticket.items, p).map((i) => (
                  <li key={i.id}>
                    {i.n} × {i.nombre}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="flex items-end justify-between gap-3">
            <span className="font-bold text-[#1C1917]">Total pagado</span>
            <span className="text-3xl font-extrabold text-[#1C1917]">{qz(totalDe(ticket.items))}</span>
          </p>
          <button type="button" onClick={alNuevo} className={`${boton.bronce} !min-h-13 w-full`}>
            Nueva venta
          </button>
          <button type="button" onClick={alEntrega} className={`${boton.linea} w-full`}>
            Ver en Entrega en Stands
          </button>
        </div>
      </div>
    </div>
  );
}

type FiltroPuesto = "Todos" | Puesto;

function Entrega({ imp }: { imp: Imperial }) {
  const [filtro, setFiltro] = useState<FiltroPuesto>("Todos");
  const [ultimo, setUltimo] = useState<{ n: number; puesto: Puesto } | null>(null);
  const mio = filtro === "Todos" ? undefined : filtro;
  const suyos = imp.tickets.filter((t) => !mio || itemsDe(t.items, mio).length > 0);
  const faltan = suyos.filter((t) => pendiente(t, mio));
  const hechos = suyos.filter((t) => !pendiente(t, mio)).reverse();
  const cuantos = (p?: Puesto) => imp.tickets.filter((t) => pendiente(t, p)).length;

  const marcar = (n: number, puesto: Puesto) => {
    imp.entregar(n, puesto, ahora());
    setUltimo({ n, puesto });
  };

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por stand">
        {(["Todos", ...PUESTOS] as const).map((f) => (
          <button key={f} type="button" aria-pressed={filtro === f} onClick={() => setFiltro(f)} className={pastilla(filtro === f)}>
            {f === "Todos" ? "Todos" : `Stand ${f}`}
            <span className={`grid h-6 min-w-6 place-items-center rounded-full px-1 text-xs ${filtro === f ? "bg-[#A16207] text-white" : "bg-[#F3EFEA]"}`}>{cuantos(f === "Todos" ? undefined : f)}</span>
          </button>
        ))}
      </div>

      {ultimo && (
        <div role="status" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#4D7C0F]/40 bg-[#F4F8EC] px-5 py-3 text-[#1C1917]">
          <p className="flex min-w-0 items-center gap-2 font-semibold">
            <Check size={18} aria-hidden className="shrink-0 text-[#3F6212]" /> {codigo(ultimo.n)} entregado en {ultimo.puesto}
          </p>
          <button
            type="button"
            onClick={() => {
              imp.entregar(ultimo.n, ultimo.puesto, "");
              setUltimo(null);
            }}
            className={boton.linea}
          >
            <Undo2 size={16} aria-hidden /> Deshacer
          </button>
        </div>
      )}

      <h2 className="mt-8 text-2xl">Pagadas, por entregar</h2>
      {faltan.length === 0 ? (
        <p className={`${tarjeta} mt-4 p-6 sm:p-7`}>No hay órdenes pendientes{mio ? ` en ${mio}` : ""}. Las nuevas aparecen aquí en cuanto la caja cobra.</p>
      ) : (
        <ul className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {faltan.map((t) => (
            <li key={t.n} className={`${tarjeta} flex flex-col gap-4 p-6 sm:p-7`}>
              <p className="flex items-baseline justify-between gap-3">
                <span className="font-(family-name:--ci-serif) text-3xl font-bold text-[#1C1917]">{codigo(t.n)}</span>
                <span className="text-sm text-[#6B625B]">
                  {t.hora} h · {t.pago}
                </span>
              </p>
              {puestosDe(t.items)
                .filter((p) => !mio || p === mio)
                .map((p) => {
                  const Icono = ICONO_PUESTO[p];
                  const hora = t.entregado[p];
                  return (
                    <div key={p} className="grid gap-3 border-t border-[#EFE9E1] pt-4">
                      <p className="flex items-center gap-2 text-sm font-bold text-[#A16207]">
                        <Icono size={16} aria-hidden /> Stand {p}
                      </p>
                      <ul className={`text-lg font-semibold ${hora ? "text-[#8A8078]" : "text-[#1C1917]"}`}>
                        {itemsDe(t.items, p).map((i) => (
                          <li key={i.id}>
                            {i.n} × {i.nombre}
                          </li>
                        ))}
                      </ul>
                      {hora ? (
                        <p className="flex items-center gap-2 text-sm font-bold text-[#3F6212]">
                          <Check size={16} aria-hidden /> Entregado a las {hora}
                        </p>
                      ) : (
                        <button type="button" onClick={() => marcar(t.n, p)} className={`${boton.oscuro} !min-h-13 w-full`}>
                          <Check size={18} aria-hidden /> Marcar entregado
                        </button>
                      )}
                    </div>
                  );
                })}
            </li>
          ))}
        </ul>
      )}

      {hechos.length > 0 && (
        <details className={`${tarjeta} mt-8 p-6 sm:p-7`}>
          <summary className="cursor-pointer font-bold text-[#1C1917]">Entregadas ({hechos.length})</summary>
          <ul className="mt-4 divide-y divide-[#EFE9E1]">
            {hechos.map((t) => (
              <li key={t.n} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                <b className="text-[#1C1917]">{codigo(t.n)}</b>
                <span className="min-w-0 flex-1 text-sm">
                  {itemsDe(t.items, mio)
                    .map((i) => `${i.n} × ${i.nombre}`)
                    .join(", ")}
                </span>
                <span className="text-sm text-[#6B625B]">
                  {puestosDe(t.items)
                    .filter((p) => !mio || p === mio)
                    .map((p) => `${p} ${t.entregado[p]}`)
                    .join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
