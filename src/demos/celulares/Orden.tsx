/*
 * "Mi Orden": ventana centrada con forma de ticket. El cliente elige contado o cuotas y la
 * entrega, pone su nombre y la orden sale lista a WhatsApp (queda registrada en el panel).
 */
import { useRef, useState, type FormEvent } from "react";
import { CircleCheck, MessageCircle, Minus, Plus, Store, Trash2, Truck } from "lucide-react";
import { Cifra } from "./Cifra";
import { Foto } from "./Marca";
import { RetomaOrden } from "./Retoma";
import { Ventana } from "./Ventana";
import { COSTO_ENVIO, PLAZOS, abonoDe, coloresDe, enlaceWhatsApp, foto, mensajeOrden, nombreDe, partesDe, producto, qd, qz, subtotalDe, varianteDe, type Entrega, type Nexus, type Orden, type Plazo } from "./datos";

function Cuota({ total, plazo }: { total: number; plazo: Plazo }) {
  return (
    <div className="nx-cuota" aria-live="polite" aria-atomic>
      <span>{total === 0 ? "Tu bono cubre la compra. Pagas" : plazo === 1 ? "Pagas al contado" : `Pagas ${plazo} cuotas de`}</span>
      <strong>
        <Cifra valor={total / plazo} formato={qd} />
      </strong>
      <small>{plazo === 1 ? "Efectivo, transferencia o tarjeta en un solo pago" : `Sin recargo · Total ${qd(total)} con Visacuotas\u00a0/\u00a0Credomatic`}</small>
    </div>
  );
}

export function MiOrden({ abierta, n, alCerrar, alCatalogo }: { abierta: boolean; n: Nexus; alCerrar: () => void; alCatalogo: () => void }) {
  const campo = useRef<HTMLInputElement>(null);
  const [plazo, setPlazo] = useState<Plazo>(12);
  const [entrega, setEntrega] = useState<Entrega>("tienda");
  const [nombre, setNombre] = useState("");
  const [falta, setFalta] = useState(false);
  const [enviada, setEnviada] = useState<Orden | null>(null);

  function cerrar() {
    setEnviada(null);
    setFalta(false);
    alCerrar();
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (nombre.trim().length < 2) {
      setFalta(true);
      campo.current?.focus();
      return;
    }
    const orden = n.crearOrden({ cliente: nombre.trim(), plazo: total > 0 ? plazo : 1, entrega });
    setEnviada(orden);
    window.open(enlaceWhatsApp(mensajeOrden(orden)), "_blank", "noopener");
  }

  const subtotal = subtotalDe(n.lineas);
  const abono = abonoDe(n.lineas, n.retoma);
  const total = subtotal - abono + (entrega === "envio" ? COSTO_ENVIO : 0);

  return (
    <Ventana abierta={abierta} alCerrar={cerrar} titulo="Mi Orden" sub={`Nexus Mobile GT · ${enviada?.id ?? n.siguienteOrden}`}>
          {enviada ? (
            <div className="nx-ticket-listo">
              <CircleCheck size={44} aria-hidden />
              <h3>Orden {enviada.id} registrada</h3>
              <p>Envía el mensaje en WhatsApp para confirmarla. Apartamos tus equipos mientras te respondemos.</p>
              <pre>{mensajeOrden(enviada)}</pre>
              <a className="nx-btn nx-azul nx-lleno" href={enlaceWhatsApp(mensajeOrden(enviada))} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} aria-hidden /> Abrir WhatsApp
              </a>
              <button type="button" className="nx-btn nx-contorno nx-lleno" onClick={cerrar}>
                Seguir viendo equipos
              </button>
            </div>
          ) : n.lineas.length === 0 ? (
            <div className="nx-ticket-listo">
              <h3>Tu orden está vacía</h3>
              <p>Agrega un equipo o accesorio y aquí verás tu cuota.</p>
              <button
                type="button"
                className="nx-btn nx-azul nx-lleno"
                onClick={() => {
                  cerrar();
                  alCatalogo();
                }}
              >
                Ir al catálogo
              </button>
            </div>
          ) : (
            <form onSubmit={enviar} noValidate>
              <ul className="nx-lineas">
                {n.lineas.map((l) => {
                  const { id, color } = partesDe(l.clave);
                  const p = producto(id);
                  const nombreLinea = nombreDe(l.clave);
                  const variante = varianteDe(l.clave);
                  return (
                    <li key={l.clave}>
                      <Foto src={foto(p.foto, 160, 160)} alt="" />
                      <div>
                        <b>{color ? nombreDe(variante) : nombreLinea}</b>
                        <small>{qz(l.precio)} c/u</small>
                        {color && (
                          <select aria-label={`Color de ${nombreDe(variante)}`} value={color} onChange={(e) => n.cambiarColor(l.clave, e.target.value)}>
                            {coloresDe(id).map((c) => (
                              <option key={c.nombre} disabled={!n.hayColor(id, c.nombre)}>
                                {c.nombre}
                              </option>
                            ))}
                          </select>
                        )}
                        <div className="nx-cantidad">
                          <button type="button" aria-label={l.cantidad === 1 ? `Quitar ${nombreLinea}` : `Uno menos de ${nombreLinea}`} onClick={() => n.ponerCantidad(l.clave, l.cantidad - 1)}>
                            {l.cantidad === 1 ? <Trash2 size={15} aria-hidden /> : <Minus size={15} aria-hidden />}
                          </button>
                          <span>{l.cantidad}</span>
                          <button type="button" aria-label={`Uno más de ${nombreLinea}`} disabled={n.unidadesEn(variante) >= n.inventario[variante].stock} onClick={() => n.ponerCantidad(l.clave, l.cantidad + 1)}>
                            <Plus size={15} aria-hidden />
                          </button>
                        </div>
                      </div>
                      <strong>{qz(l.precio * l.cantidad)}</strong>
                    </li>
                  );
                })}
              </ul>

              <RetomaOrden n={n} />

              <fieldset className="nx-bloque">
                <legend>Forma de pago</legend>
                <div className="nx-plazos" hidden={total === 0}>
                  {PLAZOS.map((p) => (
                    <button key={p} type="button" aria-pressed={plazo === p} onClick={() => setPlazo(p)}>
                      {p === 1 ? "Contado" : `${p} cuotas`}
                    </button>
                  ))}
                </div>
                <Cuota total={total} plazo={total > 0 ? plazo : 1} />
              </fieldset>

              <fieldset className="nx-bloque">
                <legend>Entrega</legend>
                <div className="nx-entregas">
                  <button type="button" aria-pressed={entrega === "tienda"} onClick={() => setEntrega("tienda")}>
                    <Store size={20} aria-hidden />
                    <span>
                      <b>Retiro en CC Miraflores</b>
                      <small>Sin costo</small>
                    </span>
                  </button>
                  <button type="button" aria-pressed={entrega === "envio"} onClick={() => setEntrega("envio")}>
                    <Truck size={20} aria-hidden />
                    <span>
                      <b>Envío asegurado</b>
                      <small>En la ciudad · +{qz(COSTO_ENVIO)}</small>
                    </span>
                  </button>
                </div>
              </fieldset>

              <div className="nx-bloque">
                <label htmlFor="nx-nombre">Tu nombre</label>
                <input
                  id="nx-nombre"
                  ref={campo}
                  className="nx-campo"
                  value={nombre}
                  autoComplete="name"
                  maxLength={60}
                  placeholder="Nombre y apellido"
                  aria-invalid={falta}
                  aria-describedby={falta ? "nx-nombre-error" : undefined}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    setFalta(false);
                  }}
                />
                {falta && (
                  <p id="nx-nombre-error" className="nx-error" role="alert">
                    Escribe tu nombre para enviar la orden.
                  </p>
                )}
              </div>

              <div className="nx-ticket-pie">
                <dl>
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{qz(subtotal)}</dd>
                  </div>
                  {abono > 0 && (
                    <div className="nx-descuento">
                      <dt>Bono Plan Retoma</dt>
                      <dd>-{qz(abono)}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Envío</dt>
                    <dd>{entrega === "envio" ? qz(COSTO_ENVIO) : "Sin costo"}</dd>
                  </div>
                  <div className="nx-total">
                    <dt>Total</dt>
                    <dd>{qz(total)}</dd>
                  </div>
                </dl>
                <button type="submit" className="nx-btn nx-azul nx-lleno">
                  <MessageCircle size={18} aria-hidden /> Confirmar orden y enviar por WhatsApp
                </button>
              </div>
            </form>
          )}
    </Ventana>
  );
}
