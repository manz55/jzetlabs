/*
 * Pedido en panel lateral sobre <dialog> (Esc, foco atrapado): materiales, entrega con flete
 * por zona, datos para FEL y la orden formal lista para enviar por WhatsApp. No envía nada sola.
 */
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, MessageCircle, Store, Trash2, Truck, X } from "lucide-react";
import Cantidad from "./Cantidad";
import Foto from "./Foto";
import {
  ACCESOS, FUERA, HORARIOS, PAGOS, TIENDA, ZONAS,
  fleteDe, lineasDe, nuevaOrden, qz, subtotalDe, textoDeOrden, unidades, zonaDe,
  type Carro, type DatosPedido, type Orden, type ProductoId,
} from "./datos";

type Props = {
  abierto: boolean;
  alCerrar: () => void;
  carro: Carro;
  poner: (id: ProductoId, n: number) => void;
  datos: DatosPedido;
  cambiar: (d: Partial<DatosPedido>) => void;
  vaciar: () => void;
};

const REVISADOS = ["zona", "direccion", "nombre", "nit", "correo"] as const;
type Errores = Partial<Record<(typeof REVISADOS)[number], string>>;

function Campo({ id, titulo, error, children }: { id: string; titulo: string; error?: string; children: ReactNode }) {
  return (
    <div className="mt-3">
      <label htmlFor={id} className="mb-1 block text-[0.84rem] font-bold">{titulo}</label>
      {children}
      {error && <p id={`${id}-error`} className="ik-error">{error}</p>}
    </div>
  );
}

function Bloque({ paso, titulo, children }: { paso: number; titulo: string; children: ReactNode }) {
  return (
    <fieldset className="ik-tarjeta mt-3 p-4">
      <legend className="sr-only">{titulo}</legend>
      <p aria-hidden className="flex items-center gap-2 font-bold">
        <span className="ik-num grid h-6 w-6 place-items-center rounded-md bg-[#0F172A] text-[0.75rem] text-white">{paso}</span>
        {titulo}
      </p>
      {children}
    </fieldset>
  );
}

export default function Pedido({ abierto, alCerrar, carro, poner, datos: d, cambiar, vaciar }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const cuerpo = useRef<HTMLDivElement>(null);
  const [errores, setErrores] = useState<Errores>({});
  const [orden, setOrden] = useState<Orden | null>(null);
  const [copiado, setCopiado] = useState<"si" | "no" | null>(null);
  const lineas = lineasDe(carro);
  const sub = subtotalDe(carro);
  const flete = fleteDe(d);
  const total = sub + (flete ?? 0);
  const fuera = d.entrega === "obra" && d.zona === FUERA;
  const zona = zonaDe(d.zona);
  const vista = orden && lineas.length > 0 ? orden : null;
  const texto = vista ? textoDeOrden(vista, carro, d) : "";

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (abierto && !dlg.open) dlg.showModal();
    if (!abierto && dlg.open) dlg.close();
  }, [abierto]);

  useEffect(() => {
    cuerpo.current?.scrollTo(0, 0);
  }, [orden]);

  const volver = () => {
    setOrden(null);
    setCopiado(null);
  };
  const cerrar = () => {
    volver();
    alCerrar();
  };

  function generar(e: FormEvent) {
    e.preventDefault();
    const nuevos: Errores = {};
    if (d.entrega === "obra") {
      if (!d.zona) nuevos.zona = "Seleccione la zona para calcular el flete.";
      else if (d.zona === FUERA) nuevos.zona = "Esa zona requiere cotización. Elija retiro o consúltenos.";
      if (d.direccion.trim().length < 8) nuevos.direccion = "Indique la dirección de la obra (calle, lote o kilómetro).";
    }
    if (d.nombre.trim().length < 3) nuevos.nombre = "Ingrese nombre o razón social.";
    const nit = d.nit.trim().toUpperCase();
    if (nit && nit !== "CF" && !/^\d{4,12}-?[\dK]$/.test(nit)) nuevos.nit = "Revise el NIT (formato 1234567-8) o déjelo vacío para CF.";
    if (d.correo.trim() && !/^\S+@\S+\.\S{2,}$/.test(d.correo.trim())) nuevos.correo = "Revise el correo electrónico.";
    setErrores(nuevos);
    const primero = REVISADOS.find((k) => nuevos[k]);
    if (primero) {
      ref.current?.querySelector<HTMLElement>(`#ik-${primero}`)?.focus();
      return;
    }
    setOrden(nuevaOrden());
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado("si");
    } catch {
      setCopiado("no");
    }
  }

  const aria = (k: keyof Errores) => ({ "aria-invalid": errores[k] ? true : undefined, "aria-describedby": errores[k] ? `ik-${k}-error` : undefined });
  const editar = (k: keyof Errores, v: string) => {
    cambiar({ [k]: v });
    setErrores((x) => ({ ...x, [k]: undefined }));
  };

  return (
    <dialog
      ref={ref}
      className="ik-cajon"
      aria-labelledby="ik-pedido-titulo"
      onClose={cerrar}
      onClick={(e) => {
        if (e.target === ref.current) cerrar();
      }}
    >
      <div className="flex h-full flex-col">
        <div className="ik-oscuro flex items-center justify-between gap-3 bg-[#0F172A] px-4 py-3 text-white">
          <div>
            <h2 id="ik-pedido-titulo" className="text-[1.25rem]">{vista ? "Orden lista para enviar" : "Su pedido"}</h2>
            <p className="ik-num text-[0.75rem] text-slate-300">{lineas.length} {lineas.length === 1 ? "referencia" : "referencias"} · {qz(sub)}</p>
          </div>
          <button type="button" onClick={cerrar} aria-label="Cerrar el pedido" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-white/15">
            <X size={22} />
          </button>
        </div>

        {vista ? (
          <>
            <div ref={cuerpo} className="flex-1 overflow-y-auto p-4">
              <article className="ik-tarjeta overflow-hidden text-[0.86rem]">
                <div className="h-1.5 bg-[#C81E1E]" />
                <div className="p-4">
                  <p className="font-bold">{TIENDA.nombre}</p>
                  <p className="ik-num mt-1 text-[0.76rem]">Orden {vista.numero}<br />{vista.fecha}</p>
                  <ul className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
                    {lineas.map(({ p, n, subtotal }) => (
                      <li key={p.id} className="flex justify-between gap-3 py-2">
                        <span className="min-w-0">
                          <b className="block leading-snug">{p.nombre}</b>
                          <span className="ik-num ik-gris text-[0.74rem]">{p.sku} · {n} {unidades(p, n)} × {qz(p.precio)}</span>
                        </span>
                        <span className="ik-num shrink-0 font-bold">{qz(subtotal)}</span>
                      </li>
                    ))}
                  </ul>
                  <dl className="ik-num mt-3 space-y-1">
                    <div className="flex justify-between"><dt>Materiales</dt><dd>{qz(sub)}</dd></div>
                    <div className="flex justify-between"><dt>{d.entrega === "obra" ? "Flete a obra" : "Retiro"}</dt><dd>{qz(flete ?? 0)}</dd></div>
                    <div className="flex justify-between border-t border-[#0F172A] pt-1.5 text-[1.05rem] font-bold"><dt>Total</dt><dd>{qz(total)}</dd></div>
                  </dl>
                  <div className="mt-4 grid gap-3 border-t border-slate-200 pt-3 sm:grid-cols-2">
                    <div>
                      <p className="font-bold">Entrega</p>
                      {d.entrega === "obra" && zona ? (
                        <p className="ik-gris">{zona.nombre} ({zona.plazo.toLowerCase()})<br />{d.direccion}{d.referencia && <><br />{d.referencia}</>}<br />{d.horario}<br />{ACCESOS.find((a) => a.id === d.acceso)!.texto}</p>
                      ) : (
                        <p className="ik-gris">Retiro en sala de ventas<br />{TIENDA.direccion}</p>
                      )}
                    </div>
                    <div>
                      <p className="font-bold">Facturación FEL</p>
                      <p className="ik-gris break-words">{d.nombre}<br />NIT: {d.nit.trim().toUpperCase() || "CF"}{d.correo && <><br />{d.correo}</>}<br />{d.pago}</p>
                    </div>
                  </div>
                </div>
              </article>
              <p className="ik-gris mt-3 text-[0.82rem]">Un asesor confirma existencia y hora de despacho al recibir su orden.</p>
            </div>
            <div className="grid gap-2 border-t border-slate-200 bg-white p-4">
              <a className="ik-btn ik-rojo" href={`https://wa.me/?text=${encodeURIComponent(texto)}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} aria-hidden /> Enviar orden por WhatsApp
              </a>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" className="ik-btn ik-linea" onClick={volver}><ArrowLeft size={17} aria-hidden /> Editar</button>
                <button type="button" className="ik-btn ik-linea" onClick={copiar}>
                  {copiado === "si" ? <Check size={17} aria-hidden /> : <Copy size={17} aria-hidden />} {copiado === "si" ? "Copiada" : "Copiar orden"}
                </button>
              </div>
              <p role="status" className="ik-error empty:hidden">{copiado === "no" ? "No fue posible copiar. Use el botón de WhatsApp." : ""}</p>
            </div>
          </>
        ) : lineas.length === 0 ? (
          <div className="grid flex-1 content-center justify-items-center gap-2 px-6 text-center">
            <p className="text-[1.2rem] font-bold">Su pedido está vacío</p>
            <p className="ik-gris">Agregue productos del catálogo o pase las cantidades desde la calculadora de obra.</p>
            <a href="#catalogo" className="ik-btn ik-rojo mt-3" onClick={cerrar}>Ir al catálogo</a>
          </div>
        ) : (
          <form onSubmit={generar} noValidate className="flex min-h-0 flex-1 flex-col">
            <div ref={cuerpo} className="flex-1 overflow-y-auto px-4 pb-4 pt-1">
              <Bloque paso={1} titulo="Materiales">
                <ul className="mt-1 divide-y divide-slate-200">
                  {lineas.map(({ p, n, subtotal }) => (
                    <li key={p.id} className="py-3">
                      <div className="flex gap-3">
                        <Foto p={p} decorativa className="block h-14 w-14 shrink-0 rounded-lg bg-slate-100 object-cover" />
                        <p className="min-w-0 flex-1 text-[0.92rem] font-bold leading-snug">
                          {p.nombre}
                          <span className="ik-num ik-gris block text-[0.72rem] font-medium">{p.sku} · {qz(p.precio)}</span>
                        </p>
                        <button type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#C81E1E]" onClick={() => poner(p.id, 0)} aria-label={`Quitar ${p.nombre}`}>
                          <Trash2 size={17} />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <Cantidad p={p} valor={n} min={0} alCambiar={(v) => poner(p.id, v)} />
                        <span className="ik-num text-[1.05rem] font-bold">{qz(subtotal)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <button type="button" className="mt-2 min-h-11 text-[0.84rem] font-bold text-slate-600 underline" onClick={vaciar}>Vaciar pedido</button>
              </Bloque>

              <Bloque paso={2} titulo="Entrega">
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: "tienda", icono: <Store size={20} aria-hidden />, t: "Retiro en sala de ventas", c: "Sin costo" },
                      { id: "obra", icono: <Truck size={20} aria-hidden />, t: "Flete a obra", c: "Según zona" },
                    ] as const
                  ).map((o) => (
                    <label key={o.id} className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-3 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#C81E1E] ${d.entrega === o.id ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-slate-300 bg-white"}`}>
                      <input type="radio" name="ik-entrega" className="sr-only" checked={d.entrega === o.id} onChange={() => { cambiar({ entrega: o.id }); setErrores({}); }} />
                      {o.icono}
                      <span className="text-[0.9rem] font-bold leading-tight">{o.t}</span>
                      <span className="text-[0.76rem] opacity-80">{o.c}</span>
                    </label>
                  ))}
                </div>
                {d.entrega === "tienda" ? (
                  <p className="mt-3 text-[0.9rem]"><b>Retire en:</b> {TIENDA.direccion}.</p>
                ) : (
                  <>
                    <Campo id="ik-zona" titulo="Zona de la obra" error={errores.zona}>
                      <select id="ik-zona" className="ik-campo" value={d.zona} onChange={(e) => editar("zona", e.target.value)} {...aria("zona")}>
                        <option value="">Seleccione una zona</option>
                        {ZONAS.map((z) => <option key={z.id} value={z.id}>{z.nombre} · {qz(z.flete)}</option>)}
                        <option value={FUERA}>Otra ubicación</option>
                      </select>
                    </Campo>
                    {zona && (
                      <p className="mt-2 flex justify-between gap-3 rounded-lg bg-slate-100 px-3 py-2 text-[0.86rem] font-bold">
                        <span>Entrega: {zona.plazo.toLowerCase()}</span>
                        <span className="ik-num">{qz(zona.flete)}</span>
                      </p>
                    )}
                    {fuera ? (
                      <div className="mt-3 rounded-lg border border-slate-300 p-3">
                        <p className="text-[0.9rem]">Su ubicación requiere cotización de flete.</p>
                        <div className="mt-2 grid gap-2">
                          <a className="ik-btn ik-linea" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent("Hola, Industek. Necesito cotizar flete a una zona fuera de su cobertura.")}`}>Cotizar flete por WhatsApp</a>
                          <button type="button" className="ik-btn ik-navy" onClick={() => { cambiar({ entrega: "tienda" }); setErrores({}); }}>Cambiar a retiro sin costo</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Campo id="ik-direccion" titulo="Dirección de la obra" error={errores.direccion}>
                          <input id="ik-direccion" className="ik-campo" autoComplete="street-address" value={d.direccion} onChange={(e) => editar("direccion", e.target.value)} {...aria("direccion")} />
                        </Campo>
                        <Campo id="ik-referencia" titulo="Referencia (opcional)">
                          <input id="ik-referencia" className="ik-campo" placeholder="Nombre del proyecto, portón, garita" value={d.referencia} onChange={(e) => cambiar({ referencia: e.target.value })} />
                        </Campo>
                        <Campo id="ik-horario" titulo="Horario de recepción">
                          <select id="ik-horario" className="ik-campo" value={d.horario} onChange={(e) => cambiar({ horario: e.target.value })}>
                            {HORARIOS.map((h) => <option key={h}>{h}</option>)}
                          </select>
                        </Campo>
                        <Campo id="ik-acceso" titulo="Acceso a la obra">
                          <select id="ik-acceso" className="ik-campo" value={d.acceso} onChange={(e) => cambiar({ acceso: e.target.value })}>
                            {ACCESOS.map((a) => <option key={a.id} value={a.id}>{a.texto}</option>)}
                          </select>
                        </Campo>
                      </>
                    )}
                  </>
                )}
              </Bloque>

              <Bloque paso={3} titulo="Facturación FEL">
                <Campo id="ik-nombre" titulo="Nombre o razón social" error={errores.nombre}>
                  <input id="ik-nombre" className="ik-campo" autoComplete="organization" value={d.nombre} onChange={(e) => editar("nombre", e.target.value)} {...aria("nombre")} />
                </Campo>
                <Campo id="ik-nit" titulo="NIT (vacío es CF)" error={errores.nit}>
                  <input id="ik-nit" className="ik-campo ik-num" placeholder="CF" value={d.nit} onChange={(e) => editar("nit", e.target.value)} {...aria("nit")} />
                </Campo>
                <Campo id="ik-correo" titulo="Correo para su factura (opcional)" error={errores.correo}>
                  <input id="ik-correo" type="email" className="ik-campo" autoComplete="email" value={d.correo} onChange={(e) => editar("correo", e.target.value)} {...aria("correo")} />
                </Campo>
                <Campo id="ik-pago" titulo="Forma de pago">
                  <select id="ik-pago" className="ik-campo" value={d.pago} onChange={(e) => cambiar({ pago: e.target.value })}>
                    {PAGOS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Campo>
              </Bloque>
            </div>

            <div className="border-t border-slate-200 bg-white px-4 py-3">
              <dl className="ik-num space-y-0.5 text-[0.86rem]">
                <div className="flex justify-between"><dt className="ik-gris">Materiales (IVA incl.)</dt><dd>{qz(sub)}</dd></div>
                <div className="flex justify-between"><dt className="ik-gris">{d.entrega === "obra" ? "Flete a obra" : "Retiro"}</dt><dd>{flete === null ? "Elija zona" : qz(flete)}</dd></div>
                <div className="flex items-baseline justify-between"><dt className="font-bold">{flete === null ? "Total sin flete" : "Total"}</dt><dd className="text-[1.4rem] font-bold">{qz(total)}</dd></div>
              </dl>
              <button type="submit" className="ik-btn ik-rojo mt-2 w-full">Generar orden <ArrowRight size={18} aria-hidden /></button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
