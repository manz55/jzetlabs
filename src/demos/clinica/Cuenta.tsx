/* Mi cuenta: odontograma de 32 piezas, plan de tratamiento, abonos y saldo pendiente. */
import { useState } from "react";
import { ArrowRight, CalendarCheck, ShieldCheck } from "lucide-react";
import type { Pedido } from "./Agendar";
import {
  CLASE_ESTADO, PACIENTE_SESION, cuentaDe, fechaCorta, fechaLarga, formatoQ, hora12, iso, mayus, odontologoPor, tratamientoPor,
  type Clinica, type ItemPlan,
} from "./datos";

/* numeración dental internacional, vista de frente */
const CUADRANTES = [
  { nombre: "Superior derecho", piezas: [18, 17, 16, 15, 14, 13, 12, 11] },
  { nombre: "Superior izquierdo", piezas: [21, 22, 23, 24, 25, 26, 27, 28] },
  { nombre: "Inferior derecho", piezas: [48, 47, 46, 45, 44, 43, 42, 41] },
  { nombre: "Inferior izquierdo", piezas: [31, 32, 33, 34, 35, 36, 37, 38] },
];

const nombrePieza = (n: number) => {
  const tipos = ["Incisivo central", "Incisivo lateral", "Canino", "Primer premolar", "Segundo premolar", "Primer molar", "Segundo molar", "Tercer molar"];
  const cuadrante = CUADRANTES.find((c) => c.piezas.includes(n))!;
  return `${tipos[(n % 10) - 1]} ${cuadrante.nombre.toLowerCase()}`;
};

type Marca = "sana" | "pendiente" | "curso" | "tratada";
const MARCAS: Record<Marca, string> = { sana: "Sin observaciones", pendiente: "Por tratar", curso: "En tratamiento", tratada: "Tratada" };
const marcaDe = (items: ItemPlan[]): Marca =>
  !items.length ? "sana" : items.some((i) => i.estado === "En curso") ? "curso" : items.some((i) => i.estado === "Pendiente") ? "pendiente" : "tratada";

export function Cuenta({ clinica, alAgendar }: { clinica: Clinica; alAgendar: (p: Omit<Pedido, "vez">) => void }) {
  const [pieza, setPieza] = useState(26);
  const paciente = clinica.pacientes.find((p) => p.id === PACIENTE_SESION)!;
  const cuenta = cuentaDe(clinica.citas, paciente);
  const deLaPieza = cuenta.plan.filter((i) => i.pieza === pieza);
  const hoy = iso(new Date());
  const proximas = clinica.citas
    .filter((c) => c.pacienteId === paciente.id && c.fecha >= hoy && c.estado !== "Completada")
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));

  const botonAgendar = (i: ItemPlan) => {
    if (i.estado !== "Pendiente" || !i.tratamientoId) return null;
    if (clinica.citas.some((c) => c.planId === i.id && c.fecha >= hoy)) return <span className="vv-suave">Cita reservada</span>;
    return (
      <button type="button" className="vv-enlace" onClick={() => alAgendar({ tratamientoId: i.tratamientoId!, planId: i.id, nombre: paciente.nombre })}>
        Agendar <ArrowRight size={15} aria-hidden />
      </button>
    );
  };

  return (
    <section id="cuenta" className="vv-seccion vv-hielo">
      <div className="vv-ancho">
        <div className="vv-titulo">
          <h2>Mi cuenta</h2>
          <p className="vv-con-icono">
            <ShieldCheck size={17} aria-hidden /> Sesión de {paciente.nombre} · Expediente {paciente.id}
          </p>
        </div>

        <dl className="vv-saldos">
          <div className="vv-saldo-principal">
            <dt>{cuenta.saldo < 0 ? "Saldo a favor" : "Saldo pendiente"}</dt>
            <dd>{formatoQ(Math.abs(cuenta.saldo))}</dd>
          </div>
          <div>
            <dt>Abonado</dt>
            <dd>{formatoQ(cuenta.abonado)}</dd>
          </div>
          <div>
            <dt>Por realizar</dt>
            <dd>{formatoQ(cuenta.porRealizar)}</dd>
          </div>
          <div>
            <dt>Próxima cita</dt>
            <dd className="vv-dd-texto">{proximas[0] ? `${mayus(fechaLarga(proximas[0].fecha))}, ${hora12(proximas[0].hora)}` : "Sin cita reservada"}</dd>
            {proximas[0] && (
              <dd className="vv-dd-nota">
                {tratamientoPor(proximas[0].tratamientoId).nombre} con {odontologoPor(proximas[0].doctorId).nombre}
              </dd>
            )}
          </div>
        </dl>

        <div className="vv-boca">
          <div className="vv-panel">
            <h3>Odontograma</h3>
            <p className="vv-suave">Toque una pieza para ver su detalle.</p>
            <div className="vv-arcadas">
              {CUADRANTES.map((c, n) => (
                <div key={c.nombre} className={`vv-cuadrante ${n > 1 ? "vv-abajo" : ""}`}>
                  <p>{c.nombre}</p>
                  <div>
                    {c.piezas.map((p) => {
                      const marca = marcaDe(cuenta.plan.filter((i) => i.pieza === p));
                      return (
                        <button key={p} type="button" className="vv-pieza" data-marca={marca} aria-pressed={pieza === p} aria-label={`Pieza ${p}, ${MARCAS[marca]}`} onClick={() => setPieza(p)}>
                          <i aria-hidden />
                          <span>{p}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <ul className="vv-leyenda">
              {(Object.keys(MARCAS) as Marca[]).map((m) => (
                <li key={m} data-marca={m}>
                  <i aria-hidden /> {MARCAS[m]}
                </li>
              ))}
            </ul>
          </div>

          <div className="vv-panel vv-detalle" aria-live="polite">
            <p className="vv-especialidad">Pieza {pieza}</p>
            <h3>{nombrePieza(pieza)}</h3>
            <p className="vv-estado" data-marca={marcaDe(deLaPieza)}>
              {MARCAS[marcaDe(deLaPieza)]}
            </p>
            {deLaPieza.length ? (
              <ul>
                {deLaPieza.map((i) => (
                  <li key={i.id}>
                    <span>
                      <strong>{i.concepto}</strong>
                      <small>
                        {i.estado} · {formatoQ(i.monto)}
                      </small>
                    </span>
                    {botonAgendar(i)}
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p className="vv-suave">No hay tratamientos anotados en esta pieza.</p>
                <button type="button" className="vv-btn vv-contorno" onClick={() => alAgendar({ tratamientoId: "evaluacion", nombre: paciente.nombre })}>
                  <CalendarCheck size={17} aria-hidden /> Agendar revisión
                </button>
              </>
            )}
          </div>
        </div>

        <div className="vv-boca">
          <div className="vv-panel">
            <h3>Plan de tratamiento</h3>
            <ul className="vv-plan">
              {cuenta.plan.map((i) => (
                <li key={i.id}>
                  <button type="button" className="vv-plan-pieza" disabled={i.pieza === null} onClick={() => setPieza(i.pieza!)} aria-label={i.pieza === null ? "Tratamiento general" : `Ver pieza ${i.pieza}`}>
                    {i.pieza ?? "—"}
                  </button>
                  <span>
                    <strong>{i.concepto}</strong>
                    <small className="vv-estado" data-marca={CLASE_ESTADO[i.estado]}>
                      {i.estado}
                    </small>
                  </span>
                  <b>{formatoQ(i.monto)}</b>
                </li>
              ))}
              {cuenta.porCitas.map((c) => (
                <li key={c.id}>
                  <span className="vv-plan-pieza">—</span>
                  <span>
                    <strong>{tratamientoPor(c.tratamientoId).nombre}</strong>
                    <small className="vv-estado" data-marca="tratada">
                      Cita del {fechaCorta(c.fecha)}
                    </small>
                  </span>
                  <b>{formatoQ(c.total)}</b>
                </li>
              ))}
            </ul>
          </div>
          <div className="vv-panel">
            <h3>Abonos registrados</h3>
            <ul className="vv-abonos">
              {[...paciente.abonos].reverse().map((a) => (
                <li key={a.id}>
                  <span>
                    <strong>{fechaCorta(a.fecha)}</strong>
                    <small>{a.medio}</small>
                  </span>
                  <b>{formatoQ(a.monto)}</b>
                </li>
              ))}
              {!paciente.abonos.length && <li className="vv-suave">Aún no hay abonos.</li>}
            </ul>
            <p className="vv-cuadre">
              <span>
                Realizado y en curso <b>{formatoQ(cuenta.cargado)}</b>
              </span>
              <span>
                Menos abonos <b>{formatoQ(cuenta.abonado)}</b>
              </span>
              <span>
                {cuenta.saldo < 0 ? "A su favor" : "Pendiente"} <b>{formatoQ(Math.abs(cuenta.saldo))}</b>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
