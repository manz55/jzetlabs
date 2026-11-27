/*
 * Bandeja superior: baja desde arriba con la orden en curso, la entrega y el total.
 * "Enviar por WhatsApp" registra la orden (llega al panel y aparta existencias) y abre
 * el mensaje ya escrito. No lleva número fijo: no le escribe a nadie por su cuenta.
 */
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, ShoppingBag, Trash2, X } from "lucide-react";
import { Cantidad, Cifra, Foto } from "./Piezas";
import {
  DEPARTAMENTOS, ENVIOS, PAGOS, libres, nombreTalla, precioCombo, productoDe, qz, sinCupo, textoDeOrden, totalesDe, unidadesEnOrden,
  type Orden, type Vertice, type Zona,
} from "./datos";

type Campo = "nombre" | "telefono" | "departamento" | "direccion";
type Errores = Partial<Record<Campo, string>>;
const enlace = (o: Orden) => `https://wa.me/?text=${encodeURIComponent(textoDeOrden(o))}`;

export function Bandeja({ abierta, v, alCerrar, alCatalogo }: { abierta: boolean; v: Vertice; alCerrar: () => void; alCatalogo: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [orden, setOrden] = useState<Orden | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const { estado } = v;
  const d = estado.datos;
  const unidades = unidadesEnOrden(estado);
  const t = totalesDe(estado);
  const excedida = [...estado.lineas, ...estado.combos.flatMap((c) => c.piezas)].some((p) => sinCupo(estado, p));

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (abierta && !dlg.open) dlg.showModal();
    if (!abierta && dlg.open) dlg.close();
  }, [abierta]);

  function cerrar() {
    setOrden(null);
    setErrores({});
    alCerrar();
  }

  function editar(campo: Campo, valor: string) {
    v.ponerDatos({ [campo]: valor });
    setErrores((e) => ({ ...e, [campo]: undefined }));
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault();
    const nuevos: Errores = {};
    if (d.nombre.trim().length < 3) nuevos.nombre = "Escribe tu nombre y apellido.";
    if (!/^(\+?502)?\d{8}$/.test(d.telefono.replace(/[\s-]/g, ""))) nuevos.telefono = "Escribe un teléfono de 8 dígitos.";
    if (d.zona === "departamentos" && !d.departamento) nuevos.departamento = "Elige tu departamento.";
    if (d.direccion.trim().length < 8) nuevos.direccion = "Escribe la dirección completa de entrega.";
    setErrores(nuevos);
    const primero = (["nombre", "telefono", "departamento", "direccion"] as const).find((c) => nuevos[c]);
    if (primero) {
      ref.current?.querySelector<HTMLElement>(`#vx-${primero}`)?.focus();
      return;
    }
    const registrada = v.registrar();
    if (!registrada) return;
    setOrden(registrada);
    window.open(enlace(registrada), "_blank", "noopener,noreferrer");
  }

  const aria = (c: Campo) => ({ "aria-invalid": errores[c] ? true : undefined, "aria-describedby": errores[c] ? `vx-${c}-error` : undefined });

  return (
    <dialog
      ref={ref}
      className="vx-bandeja"
      aria-labelledby="vx-bandeja-titulo"
      onClose={cerrar}
      onClick={(e) => {
        if (e.target === ref.current) cerrar();
      }}
    >
      {abierta && (
        <div className="vx-bandeja-caja">
          <div className="vx-bandeja-cabeza vx-oscuro">
            <div>
              <h2 id="vx-bandeja-titulo">Mi orden</h2>
              <p>{orden ? orden.numero : `${unidades} ${unidades === 1 ? "prenda" : "prendas"}`}</p>
            </div>
            <button type="button" onClick={cerrar} aria-label="Cerrar mi orden">
              <X size={22} aria-hidden />
            </button>
          </div>

          {orden ? (
            <div className="vx-listo">
              <CheckCircle2 size={44} aria-hidden />
              <h3>Orden {orden.numero} registrada</h3>
              <p>Total {qz(orden.total)}. Envía el mensaje en WhatsApp para que la confirmemos.</p>
              <pre>{textoDeOrden(orden)}</pre>
              <div className="vx-listo-botones">
                <a className="vx-btn vx-oliva" href={enlace(orden)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} aria-hidden /> Abrir WhatsApp
                </a>
                <button type="button" className="vx-btn vx-contorno" onClick={cerrar}>
                  Seguir comprando
                </button>
              </div>
            </div>
          ) : unidades === 0 ? (
            <div className="vx-listo">
              <ShoppingBag size={40} aria-hidden />
              <h3>Todavía no has agregado prendas</h3>
              <p>Elige tu talla en el catálogo o arma un outfit con 15% menos.</p>
              <button type="button" className="vx-btn vx-negro" onClick={() => { cerrar(); alCatalogo(); }}>
                Ver la colección <ArrowRight size={18} aria-hidden />
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={enviar} className="vx-bandeja-forma">
              <div className="vx-bandeja-cuerpo">
                <ul className="vx-lineas">
                  {estado.combos.map((c) => {
                    const precio = precioCombo(estado, c.piezas);
                    const tope = c.piezas.some((p) => libres(estado, p.id, p.talla) < 1);
                    const falta = c.piezas.some((p) => sinCupo(estado, p));
                    return (
                      <li key={c.clave} className="vx-linea-combo">
                        <div className="vx-linea-cabeza">
                          <b>Outfit completo</b>
                          <span className="vx-sello-claro">15% menos</span>
                          <button type="button" aria-label="Quitar el outfit" onClick={() => v.ponerCombo(c.clave, 0)}>
                            <Trash2 size={17} aria-hidden />
                          </button>
                        </div>
                        <ul>
                          {c.piezas.map((p) => (
                            <li key={p.id}>
                              <Foto p={productoDe(p.id)} className="vx-mini" decorativa />
                              <span>
                                {productoDe(p.id).nombre}
                                <small>Talla {nombreTalla(p.talla)}</small>
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="vx-linea-pie">
                          <Cantidad que="outfit" valor={c.cantidad} tope={tope} alCambiar={(n) => v.ponerCombo(c.clave, n)} />
                          <span>
                            <s>{qz(precio.antes * c.cantidad)}</s>
                            <strong>{qz(precio.ahora * c.cantidad)}</strong>
                          </span>
                        </div>
                        {falta && <p className="vx-error">Ya no hay existencia suficiente. Reduce la cantidad o quita el outfit.</p>}
                      </li>
                    );
                  })}
                  {estado.lineas.map((l) => {
                    const p = productoDe(l.id);
                    return (
                      <li key={`${l.id}-${l.talla}`} className="vx-linea">
                        <Foto p={p} className="vx-mini" decorativa />
                        <div>
                          <b>{p.nombre}</b>
                          <small>Talla {nombreTalla(l.talla)} · {qz(estado.precios[l.id])}</small>
                          <Cantidad que={p.nombre} valor={l.cantidad} tope={libres(estado, l.id, l.talla) < 1} alCambiar={(n) => v.ponerLinea(l.id, l.talla, n)} />
                          {sinCupo(estado, l) && <p className="vx-error">Ya no hay existencia suficiente. Reduce la cantidad.</p>}
                        </div>
                        <div className="vx-linea-lado">
                          <button type="button" aria-label={`Quitar ${p.nombre}`} onClick={() => v.ponerLinea(l.id, l.talla, 0)}>
                            <Trash2 size={17} aria-hidden />
                          </button>
                          <strong>{qz(estado.precios[l.id] * l.cantidad)}</strong>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="vx-entrega">
                  <fieldset>
                    <legend>Entrega</legend>
                    <div className="vx-zonas">
                      {(Object.keys(ENVIOS) as Zona[]).map((z) => (
                        <label key={z} data-activa={d.zona === z}>
                          <input type="radio" name="vx-zona" className="vx-oculto" checked={d.zona === z} onChange={() => { v.ponerDatos({ zona: z }); setErrores((e) => ({ ...e, departamento: undefined })); }} />
                          <b>{ENVIOS[z].nombre}</b>
                          <span>{qz(ENVIOS[z].precio)}</span>
                          <small>{ENVIOS[z].plazo}</small>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {d.zona === "departamentos" && (
                    <Entrada id="departamento" titulo="Departamento" error={errores.departamento}>
                      <select id="vx-departamento" className="vx-campo" value={d.departamento} onChange={(e) => editar("departamento", e.target.value)} {...aria("departamento")}>
                        <option value="">Elige uno</option>
                        {DEPARTAMENTOS.map((x) => <option key={x}>{x}</option>)}
                      </select>
                    </Entrada>
                  )}
                  <div className="vx-dos">
                    <Entrada id="nombre" titulo="Nombre y apellido" error={errores.nombre}>
                      <input id="vx-nombre" className="vx-campo" autoComplete="name" value={d.nombre} onChange={(e) => editar("nombre", e.target.value)} {...aria("nombre")} />
                    </Entrada>
                    <Entrada id="telefono" titulo="Teléfono" error={errores.telefono}>
                      <input id="vx-telefono" className="vx-campo" type="tel" inputMode="tel" autoComplete="tel" value={d.telefono} onChange={(e) => editar("telefono", e.target.value)} {...aria("telefono")} />
                    </Entrada>
                  </div>
                  <Entrada id="direccion" titulo="Dirección de entrega" error={errores.direccion}>
                    <input id="vx-direccion" className="vx-campo" autoComplete="street-address" placeholder="Calle, número, zona o municipio" value={d.direccion} onChange={(e) => editar("direccion", e.target.value)} {...aria("direccion")} />
                  </Entrada>
                  <label className="vx-rotulo" htmlFor="vx-pago">Forma de pago</label>
                  <select id="vx-pago" className="vx-campo" value={d.pago} onChange={(e) => v.ponerDatos({ pago: e.target.value })}>
                    {PAGOS.map((x) => <option key={x}>{x}</option>)}
                  </select>
                </div>
              </div>

              <div className="vx-bandeja-pie">
                <dl>
                  <div><dt>Subtotal</dt><dd>{qz(t.subtotal)}</dd></div>
                  {t.descuento > 0 && <div className="vx-ahorro"><dt>Descuento de outfit</dt><dd>-{qz(t.descuento)}</dd></div>}
                  <div><dt>Envío</dt><dd>{qz(t.envio)}</dd></div>
                  <div className="vx-total"><dt>Total</dt><dd aria-live="polite"><Cifra valor={t.total} /></dd></div>
                </dl>
                <button type="submit" className="vx-btn vx-oliva" disabled={excedida}>
                  <MessageCircle size={18} aria-hidden /> Enviar por WhatsApp
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </dialog>
  );
}

function Entrada({ id, titulo, error, children }: { id: Campo; titulo: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label className="vx-rotulo" htmlFor={`vx-${id}`}>{titulo}</label>
      {children}
      {error && <p id={`vx-${id}-error`} className="vx-error">{error}</p>}
    </div>
  );
}
