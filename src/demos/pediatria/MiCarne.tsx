/* El carné de los hijos, como lo dejó la clínica: lo pendiente primero y lo aplicado con su fecha. */
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { DOSIS, edadTexto, fechaCorta, mesesDe, nombreDosis, pediatraPor, resumenCarne, type Clinica } from "./datos";

export function MiCarne({ clinica, elegidas, alAgregar }: { clinica: Clinica; elegidas: string[]; alAgregar: (vacunaId: string, pacienteId: string) => void }) {
  const hijos = clinica.pacientes.filter((p) => p.familia);
  const [id, setId] = useState(hijos[0]?.id ?? "");
  const [todas, setTodas] = useState(false);
  const hijo = hijos.find((p) => p.id === id) ?? hijos[0];
  if (!hijo) return null;

  const r = resumenCarne(hijo);
  const aplicadas = hijo.aplicadas
    .map((a) => ({ ...a, dosis: DOSIS.find((d) => d.clave === a.clave)! }))
    .filter((a) => a.dosis)
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.dosis.mes - a.dosis.mes);
  const visibles = todas ? aplicadas : aplicadas.slice(0, 4);

  return (
    <section id="pa-micarne" className="pa-seccion">
      <div className="pa-ancho">
        <div className="pa-titulo">
          <h2>Carné de vacunas</h2>
          <p>Se actualiza en cuanto la clínica registra una vacuna.</p>
        </div>
        <div className="pa-hijos" role="group" aria-label="Hijo o hija">
          {hijos.map((p) => (
            <button key={p.id} type="button" aria-pressed={p.id === hijo.id} onClick={() => { setId(p.id); setTodas(false); }}>
              <b>{p.nombre}</b>
              <span>{edadTexto(mesesDe(p.nacimiento))}</span>
            </button>
          ))}
        </div>
        <div className="pa-carne">
          <div className="pa-caja">
            <h3>{r.pendientes ? `${r.pendientes} ${r.pendientes === 1 ? "dosis pendiente" : "dosis pendientes"}` : "Vacunas al día"}</h3>
            <div className="pa-avance" role="img" aria-label={`${r.puestas} de ${r.total} dosis de su edad`}>
              <span style={{ width: `${r.total ? (r.puestas / r.total) * 100 : 100}%` }} />
            </div>
            <p className="pa-suave">
              {r.puestas} de {r.total} dosis que corresponden a su edad
            </p>
            <ul>
              {r.faltan.map((d) => {
                const esta = elegidas.includes(d.vacuna.id);
                return (
                  <li key={d.clave}>
                    <span>
                      <strong>{nombreDosis(d)}</strong>
                      <small>{d.mes === 0 ? "Corresponde al nacer" : `Corresponde a los ${edadTexto(d.mes)}`}</small>
                    </span>
                    <button type="button" className={`pa-btn pa-chico ${esta ? "pa-bosque" : "pa-contorno"}`} onClick={() => alAgregar(d.vacuna.id, hijo.id)}>
                      {esta ? <Check size={15} aria-hidden /> : <Plus size={15} aria-hidden />}
                      {esta ? "En su cita" : "Agregar a la cita"}
                      <span className="pa-oculto">: {nombreDosis(d)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="pa-caja">
            <h3>Vacunas aplicadas</h3>
            {aplicadas.length === 0 ? (
              <p className="pa-suave">Todavía no hay vacunas registradas. La clínica las anota en la primera visita; traiga el carné de papel.</p>
            ) : (
              <ul>
                {visibles.map((a) => (
                  <li key={a.clave}>
                    <span>
                      <strong>{nombreDosis(a.dosis)}</strong>
                      <small>
                        {fechaCorta(a.fecha)} · lote {a.lote} · {pediatraPor(a.pediatraId).nombre}
                      </small>
                    </span>
                    <span className="pa-chip" data-tipo="puesta" style={{ flex: "0 0 auto", display: "inline-flex" }}>
                      <Check size={13} aria-hidden /> Aplicada
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {aplicadas.length > 4 && (
              <button type="button" className="pa-enlace" aria-expanded={todas} onClick={() => setTodas((v) => !v)}>
                {todas ? "Ver solo las más recientes" : `Ver las ${aplicadas.length} aplicadas`}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
