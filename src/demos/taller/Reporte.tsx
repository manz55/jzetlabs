/* Reporte de inspección multipunto: recepción, código o falla, mediciones con semáforo y repuestos. */
import { Fuel, Gauge, ShieldCheck, Wrench } from "lucide-react";
import { SEMAFORO, miles, type Nota, type Orden, type Semaforo } from "./datos";

const ORDEN: Semaforo[] = ["critico", "precaucion", "optimo"];

export function Reporte({ orden: o }: { orden: Orden }) {
  const r = o.recepcion;
  const mediciones = o.notas.filter((n): n is Nota & { tipo: Semaforo } => n.tipo !== "repuesto").sort((a, b) => ORDEN.indexOf(a.tipo) - ORDEN.indexOf(b.tipo));
  const repuestos = o.notas.filter((n) => n.tipo === "repuesto");
  /* solo lo que ya se anotó al recibir el vehículo */
  const recibido = [
    r.km !== null && { icono: Gauge, texto: `${miles(r.km)} km` },
    r.combustible && { icono: Fuel, texto: `Combustible ${r.combustible}` },
    r.sinGolpes && { icono: ShieldCheck, texto: "Sin golpes nuevos" },
    r.herramienta && { icono: Wrench, texto: "Herramienta completa" },
  ].filter((x) => !!x);

  return (
    <section className="at-reporte">
      <header className="at-reporte-alto">
        <h3>Reporte de inspección multipunto</h3>
        {mediciones.length > 0 && (
          <ul className="at-resumen" aria-label="Resumen por semáforo">
            {ORDEN.map((s) => {
              const n = mediciones.filter((m) => m.tipo === s).length;
              return (
                <li key={s}>
                  <i className={`at-punto at-${s}`} aria-hidden />
                  {n} {SEMAFORO[s]}
                  {n !== 1 && s !== "precaucion" ? "s" : ""}
                </li>
              );
            })}
          </ul>
        )}
      </header>

      {recibido.length > 0 && (
        <ul className="at-recibido" aria-label="Datos de recepción">
          {recibido.map(({ icono: Icono, texto }) => (
            <li key={texto}>
              <Icono size={15} aria-hidden /> {texto}
            </li>
          ))}
        </ul>
      )}

      {o.falla && (
        <div className={`at-codigo ${o.falla.codigo ? "at-codigo-con" : ""}`}>
          {o.falla.codigo && (
            <div>
              <small>Código OBD-II</small>
              <strong>{o.falla.codigo}</strong>
            </div>
          )}
          <div>
            {!o.falla.codigo && <small>Falla técnica</small>}
            <b>{o.falla.titulo}</b>
            {o.falla.explicacion && <p>{o.falla.explicacion}</p>}
          </div>
        </div>
      )}

      {mediciones.length > 0 && (
        <ul className="at-mediciones">
          {mediciones.map((m) => (
            <li key={m.id} className={`at-medicion at-${m.tipo}`}>
              <span>{m.nombre}</span>
              {m.valor && <strong>{m.valor}</strong>}
              {m.delHallazgo && m.tipo !== "optimo" && o.hallazgo && <small>{o.hallazgo.aprobado ? "Cambio aprobado" : "Cambio por aprobar"}</small>}
              <em>{SEMAFORO[m.tipo]}</em>
            </li>
          ))}
        </ul>
      )}

      {repuestos.length > 0 && (
        <div className="at-repuestos">
          <h4>Repuestos OEM</h4>
          <ul>
            {repuestos.map((n) => (
              <li key={n.id}>
                <span>{n.nombre}</span>
                {n.valor && <b>{n.valor}</b>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!mediciones.length && !repuestos.length && <p className="at-reporte-vacio">Las mediciones aparecen aquí conforme el taller las registra.</p>}
    </section>
  );
}
