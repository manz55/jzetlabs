/* Comprobante de ingreso y póliza de garantía de una orden, con su código en cuadrícula. */
import { Ventana } from "./Ventana";
import { diasGarantia, falla, fechaLarga, garantiaDe, insignias, nombreCalidad, qz, totalTaller, COSTO_RECOLECCION, type Reparacion } from "./datos";

const LADO = 21;
/* patrón fijo para cada orden, con las tres esquinas de un código de este tipo */
function modulos(texto: string) {
  let semilla = [...texto].reduce((s, c) => (s * 31 + c.charCodeAt(0)) >>> 0, 7);
  return Array.from({ length: LADO * LADO }, (_, i) => {
    const x = i % LADO;
    const y = Math.floor(i / LADO);
    for (const [ex, ey] of [[0, 0], [LADO - 7, 0], [0, LADO - 7]]) {
      const dx = x - ex;
      const dy = y - ey;
      if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) {
        if (dx < 0 || dx > 6 || dy < 0 || dy > 6) return false;
        return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
      }
    }
    semilla = (semilla * 1103515245 + 12345) >>> 0;
    return ((semilla >>> 16) & 1) === 1;
  });
}

function Codigo({ texto }: { texto: string }) {
  return (
    <div className="nx-codigo" role="img" aria-label={`Código de verificación de la orden ${texto}`} style={{ gridTemplateColumns: `repeat(${LADO}, 1fr)` }}>
      {modulos(texto).map((lleno, i) => (
        <i key={i} data-lleno={lleno || undefined} />
      ))}
    </div>
  );
}

function Contenido({ r }: { r: Reparacion }) {
  const entrega = r.historial[5];
  const vence = entrega ? entrega + diasGarantia(r.falla, r.calidad) * 86_400_000 : null;
  const filas: [string, string][] = [
    ["Cliente", r.cliente],
    ...(r.telefono ? ([["Teléfono", r.telefono]] as [string, string][]) : []),
    ["Equipo", r.modelo],
    ["IMEI", r.imei ? `35 •••••• •••• ${r.imei}` : "Se registra al recibir el equipo"],
    ["Servicio", falla(r.falla).nombre],
    ...(r.falla === "humedad" ? [] : ([["Repuesto", nombreCalidad(r.calidad, r.falla)]] as [string, string][])),
    ["Técnico", r.tecnico],
    ["Fecha de ingreso", r.historial[1] ? fechaLarga(r.historial[1]) : "Pendiente"],
  ];
  return (
    <div className="nx-recibo">
      <div className="nx-recibo-cabeza">
        <div>
          <b>Nexus Mobile GT</b>
          <small>Taller técnico · Zona 10, Ciudad de Guatemala</small>
          <p>
            Orden <strong>{r.id}</strong>
          </p>
        </div>
        <Codigo texto={r.id} />
      </div>
      <dl className="nx-recibo-datos">
        {filas.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {r.recepcion && (
        <p className="nx-recibo-recepcion">
          <b>Estado al recibir: </b>
          {insignias(r)
            .map((x) => `${x.nombre}: ${x.valor}`)
            .join(" · ")}
        </p>
      )}
      <dl className="nx-recibo-montos">
        <div>
          <dt>Repuesto y mano de obra</dt>
          <dd>{qz(r.precio)}</dd>
        </div>
        {r.recoleccion && (
          <div>
            <dt>Recolección asegurada</dt>
            <dd>{qz(COSTO_RECOLECCION)}</dd>
          </div>
        )}
        <div className="nx-total">
          <dt>Total</dt>
          <dd>{qz(totalTaller(r))}</dd>
        </div>
      </dl>
      <div className="nx-poliza">
        <h3>Póliza de garantía: {garantiaDe(r.falla, r.calidad)}</h3>
        <p>
          {vence && entrega
            ? `Vigente del ${fechaLarga(entrega)} al ${fechaLarga(vence)}.`
            : `La cobertura empieza el día de la entrega y dura ${r.falla === "humedad" ? "30 días" : r.calidad === "original" ? "6 meses" : "3 meses"}.`}
        </p>
        <ul>
          <li>Cubre defectos del repuesto instalado y de la mano de obra.</li>
          <li>No cubre golpes, daño por líquidos ni equipos abiertos por terceros.</li>
          <li>Presenta este comprobante o tu número de orden.</li>
        </ul>
      </div>
    </div>
  );
}

export function Comprobante({ r, abierto, alCerrar }: { r: Reparacion; abierto: boolean; alCerrar: () => void }) {
  return (
    <Ventana abierta={abierto} alCerrar={alCerrar} titulo="Comprobante y póliza" sub={`Orden ${r.id}`}>
      <Contenido r={r} />
    </Ventana>
  );
}
