/* Órdenes de venta: desglose completo, avance Pendiente → Confirmada → Entregada y WhatsApp. */
import { useRef, useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { useEscalonado } from "./animar";
import { COSTO_ENVIO, condicion, enlaceWhatsApp, fechaCorta, mensajeConfirmacion, nombreDe, qd, qz, subtotalDe, totalDe, type EstadoOrden, type Nexus, type Orden } from "./datos";

const NOMBRE: Record<EstadoOrden, string> = { nueva: "Pendiente", confirmada: "Confirmada", entregada: "Entregada", anulada: "Anulada" };
const TONO: Record<EstadoOrden, string> = { nueva: "lleno", confirmada: "azul", entregada: "borde", anulada: "gris" };
const RUTA: EstadoOrden[] = ["nueva", "confirmada", "entregada"];
const FILTROS = [
  { id: "todas", nombre: "Todas" },
  { id: "nueva", nombre: "Pendientes" },
  { id: "confirmada", nombre: "Confirmadas" },
  { id: "entregada", nombre: "Entregadas" },
] as const;

function Ficha({ o, n }: { o: Orden; n: Nexus }) {
  const [confirmarAnular, setConfirmarAnular] = useState(false);
  const total = totalDe(o);
  const paso = RUTA.indexOf(o.estado);
  return (
    <li className="nx-ficha" data-nueva={o.estado === "nueva"} data-entra>
      <div className="nx-ficha-cabeza">
        <div>
          <b>{o.id}</b>
          <small>{fechaCorta(o.fecha)}</small>
        </div>
        <span className="nx-estado" data-tono={TONO[o.estado]}>
          {NOMBRE[o.estado]}
        </span>
      </div>
      <h3>{o.cliente}</h3>

      {o.estado !== "anulada" && (
        <ol className="nx-ruta" aria-label={`Estado de la orden ${o.id}`}>
          {RUTA.map((e, i) => (
            <li key={e} data-hecho={i <= paso} aria-current={i === paso ? "step" : undefined}>
              <i aria-hidden>{i < paso || o.estado === "entregada" ? <Check size={12} /> : i + 1}</i>
              {NOMBRE[e]}
            </li>
          ))}
        </ol>
      )}

      <ul className="nx-ficha-lineas">
        {o.lineas.map((l) => (
          <li key={l.clave}>
            <span>
              {l.cantidad} × {nombreDe(l.clave)}
            </span>
            <span>{qz(l.precio * l.cantidad)}</span>
          </li>
        ))}
      </ul>
      <dl className="nx-ficha-datos">
        <div>
          <dt>Subtotal</dt>
          <dd>{qz(subtotalDe(o.lineas))}</dd>
        </div>
        {o.retoma && (
          <div className="nx-descuento">
            <dt>
              Bono retoma: {o.retoma.modelo} ({condicion(o.retoma.estado).nombre.toLowerCase()})
            </dt>
            <dd>-{qz(o.retoma.abono)}</dd>
          </div>
        )}
        <div>
          <dt>{o.entrega === "envio" ? "Envío asegurado" : "Retiro en CC Miraflores"}</dt>
          <dd>{o.entrega === "envio" ? qz(COSTO_ENVIO) : "Sin costo"}</dd>
        </div>
        <div className="nx-total">
          <dt>Total</dt>
          <dd>{qz(total)}</dd>
        </div>
      </dl>
      <p className="nx-ficha-pago">{o.plazo === 1 || total === 0 ? "Pago al contado" : `${o.plazo} cuotas de ${qd(total / o.plazo)}`}</p>

      {o.estado !== "anulada" && (
        <div className="nx-acciones">
          {o.estado === "nueva" && (
            <button type="button" className="nx-btn nx-azul" onClick={() => n.estadoOrden(o.id, "confirmada")}>
              Confirmar orden
            </button>
          )}
          {o.estado === "confirmada" && (
            <button type="button" className="nx-btn nx-negro" onClick={() => n.estadoOrden(o.id, "entregada")}>
              Marcar entregada
            </button>
          )}
          <a className="nx-btn nx-contorno" href={enlaceWhatsApp(mensajeConfirmacion(o))} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={17} aria-hidden /> Confirmar por WhatsApp
          </a>
          {o.estado !== "entregada" &&
            (confirmarAnular ? (
              <button type="button" className="nx-btn nx-peligro" onClick={() => n.estadoOrden(o.id, "anulada")} onBlur={() => setConfirmarAnular(false)}>
                Sí, anular y devolver existencias
              </button>
            ) : (
              <button type="button" className="nx-btn nx-texto" onClick={() => setConfirmarAnular(true)}>
                Anular
              </button>
            ))}
        </div>
      )}
    </li>
  );
}

export function PanelOrdenes({ n }: { n: Nexus }) {
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]["id"]>("todas");
  const lista = useRef<HTMLUListElement>(null);
  useEscalonado(lista, filtro, 35);
  const visibles = n.ordenes.filter((o) => filtro === "todas" || o.estado === filtro);
  return (
    <>
      <div className="nx-filtros" role="group" aria-label="Filtrar órdenes">
        {FILTROS.map((f) => (
          <button key={f.id} type="button" aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}>
            {f.nombre} ({f.id === "todas" ? n.ordenes.length : n.ordenes.filter((o) => o.estado === f.id).length})
          </button>
        ))}
      </div>
      <ul className="nx-fichas" ref={lista}>
        {visibles.map((o) => (
          <Ficha key={o.id} o={o} n={n} />
        ))}
      </ul>
      {visibles.length === 0 && <p className="nx-vacio">No hay órdenes en este estado.</p>}
    </>
  );
}
