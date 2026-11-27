/* Taller técnico: ingreso rápido con checklist y control de cada orden. */
import { useRef } from "react";
import { CircleCheck, MessageCircle, Truck } from "lucide-react";
import { useEscalonado } from "./animar";
import { IngresoTaller } from "./IngresoTaller";
import {
  PASOS, PUNTOS, REPUESTOS, SIN_NOTAS, SIN_REVISAR, TECNICOS, enlaceWhatsApp, etiquetaPaso, falla, fechaCorta, mensajeEstado, nombreCalidad, qz, textoCita, totalTaller,
  type Nexus, type Paso, type Reparacion,
} from "./datos";

function Orden({ r, n, alVer }: { r: Reparacion; n: Nexus; alVer: (id: string) => void }) {
  const revisados = r.recepcion ? PUNTOS.filter((p) => r.recepcion![p.id]).length : 0;
  return (
    <li className="nx-ficha" data-nueva={!!r.nueva} data-entra>
      <div className="nx-ficha-cabeza">
        <div>
          <b>{r.id}</b>
          <small>{fechaCorta(r.fecha)}</small>
        </div>
        <span className="nx-estado" data-tono={r.nueva ? "lleno" : r.estado >= 4 ? "borde" : "azul"}>
          {r.nueva ? "Cita nueva" : etiquetaPaso(r.estado)}
        </span>
      </div>
      <h3>
        {r.modelo} · {r.cliente}
      </h3>
      <p className="nx-suave">
        {falla(r.falla).nombre}
        {r.falla === "humedad" ? "" : ` · ${nombreCalidad(r.calidad, r.falla)}`} · {qz(totalTaller(r))} · {r.tiempo}
      </p>
      {(r.telefono || r.imei) && <p className="nx-suave">{[r.telefono && `Tel. ${r.telefono}`, r.imei && `IMEI …${r.imei}`].filter(Boolean).join(" · ")}</p>}
      {r.recoleccion && (
        <p className="nx-recoleccion">
          <Truck size={16} aria-hidden /> Recolección con mensajero
        </p>
      )}
      {r.estado === 0 && r.cita && (
        <p className="nx-nota-clara">
          {r.recoleccion ? "Recoger" : "Llega"} el {textoCita(r.cita)}.
        </p>
      )}
      {r.aprobado ? (
        <p className="nx-aprobado">
          <CircleCheck size={17} aria-hidden /> <span>Presupuesto aprobado el {fechaCorta(r.aprobado)}</span>
        </p>
      ) : (
        r.estado === 2 && <p className="nx-pendiente">Esperando que el cliente apruebe el presupuesto.</p>
      )}

      <p className="nx-rotulo">Disponibilidad de repuesto</p>
      <div className="nx-estados" role="group" aria-label={`Repuesto de ${r.id}`}>
        {REPUESTOS.map((x) => (
          <button key={x.id} type="button" data-repuesto={x.id} aria-pressed={r.repuesto === x.id} onClick={() => n.editarReparacion(r.id, { repuesto: x.id })}>
            {x.nombre}
          </button>
        ))}
      </div>

      <p className="nx-rotulo">Estado que ve el cliente</p>
      <div className="nx-estados" role="group" aria-label={`Estado de ${r.id}`}>
        {PASOS.map(({ corto }, i) => {
          const paso = (i + 1) as Paso;
          return (
            <button key={corto} type="button" aria-pressed={r.estado === paso} onClick={() => n.estadoReparacion(r.id, paso)}>
              {paso}. {corto}
            </button>
          );
        })}
        <button type="button" className="nx-entregado" aria-pressed={r.estado === 5} onClick={() => n.estadoReparacion(r.id, 5)}>
          Marcar entregado
        </button>
      </div>

      <details className="nx-detalle">
        <summary>
          Recepción, técnico y notas
          <small>{r.recepcion ? `${revisados}/${PUNTOS.length} OK` : "Sin revisar"}</small>
        </summary>
        <div className="nx-casillas" role="group" aria-label={`Checklist de ${r.id}`}>
          {PUNTOS.map((p) => (
            <label key={p.id}>
              <input type="checkbox" checked={!!r.recepcion?.[p.id]} onChange={(e) => n.editarReparacion(r.id, { recepcion: { ...(r.recepcion ?? SIN_REVISAR), [p.id]: e.target.checked } })} />
              {p.casilla}
            </label>
          ))}
        </div>
        <label className="nx-ficha-campo">
          <span>Técnico asignado</span>
          <select className="nx-campo" value={r.tecnico} onChange={(e) => n.editarReparacion(r.id, { tecnico: e.target.value })}>
            {TECNICOS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        {/* las notas se guardan mientras se escriben: el cliente las ve en su rastreador */}
        <label className="nx-ficha-campo">
          <span>Notas de diagnóstico</span>
          <textarea className="nx-campo" rows={4} maxLength={280} placeholder={SIN_NOTAS} value={r.notas === SIN_NOTAS ? "" : r.notas} onChange={(e) => n.editarReparacion(r.id, { notas: e.target.value || SIN_NOTAS })} />
        </label>
      </details>

      <div className="nx-acciones">
        <a className="nx-btn nx-azul" href={enlaceWhatsApp(mensajeEstado(r))} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={17} aria-hidden /> Notificar avance por WhatsApp
        </a>
        <button type="button" className="nx-btn nx-texto" onClick={() => alVer(r.id)}>
          Ver como cliente
        </button>
      </div>
    </li>
  );
}

export function PanelTaller({ n, alVer }: { n: Nexus; alVer: (id: string) => void }) {
  const lista = useRef<HTMLUListElement>(null);
  useEscalonado(lista, "taller", 35);
  return (
    <>
      <IngresoTaller n={n} alVer={alVer} />
      <ul className="nx-fichas" ref={lista}>
        {n.reparaciones.map((r) => (
          <Orden key={r.id} r={r} n={n} alVer={alVer} />
        ))}
      </ul>
    </>
  );
}
