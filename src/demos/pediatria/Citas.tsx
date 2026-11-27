/* Citas del día: quién viene, en qué va cada uno y qué vacunas hay que preparar. */
import { useState } from "react";
import { ClipboardList } from "lucide-react";
import {
  ESTADOS, PEDIATRAS, diaCorto, edadTexto, fechaLarga, formatoQ, hora12, mayus, mesCorto, mesesDe, motivoPor, numeroDia,
  pediatraPor, proximosDias, totalCita, vacunaPor, type Clinica,
} from "./datos";

const ORIGENES = { inicio: "Desde Inicio", portal: "Desde Portal Padres" };

export function Citas({ clinica, alAbrirCarne }: { clinica: Clinica; alAbrirCarne: (pacienteId: string) => void }) {
  const dias = proximosDias();
  const [fecha, setFecha] = useState(dias[0]);
  const [pediatra, setPediatra] = useState("todos");
  const delDia = clinica.citas.filter((c) => c.fecha === fecha && (pediatra === "todos" || c.pediatraId === pediatra)).sort((a, b) => a.hora.localeCompare(b.hora));
  const delSitio = clinica.citas.filter((c) => c.origen).sort((a, b) => b.id.localeCompare(a.id));
  const indicadores = [
    ["Citas del día", delDia.length],
    ["En sala de espera", delDia.filter((c) => c.estado === "En sala").length],
    ["Vacunas por aplicar", delDia.filter((c) => c.estado !== "Atendida").reduce((s, c) => s + c.vacunas.length, 0)],
    ["Atendidas", delDia.filter((c) => c.estado === "Atendida").length],
  ] as const;

  return (
    <>
      <div className="pa-panel-titulo">
        <div>
          <h1>Agenda del día</h1>
          <p className="pa-suave">{mayus(fechaLarga(fecha))}</p>
        </div>
        <label className="pa-campo pa-filtro">
          <span>Pediatra</span>
          <select value={pediatra} onChange={(e) => setPediatra(e.target.value)}>
            <option value="todos">Todos</option>
            {PEDIATRAS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>
      {delSitio.length > 0 && (
        <section className="pa-nuevas" aria-label="Citas apartadas en el sitio">
          <h2>
            Apartadas en el sitio <span>{delSitio.length}</span>
          </h2>
          <ul>
            {delSitio.slice(0, 4).map((c) => {
              const paciente = clinica.pacientes.find((p) => p.id === c.pacienteId)!;
              return (
                <li key={c.id}>
                  <button type="button" onClick={() => { setFecha(c.fecha); setPediatra("todos"); }}>
                    <strong>{paciente.nombre}</strong>
                    <small>
                      {mayus(diaCorto(c.fecha))} {numeroDia(c.fecha)} {mesCorto(c.fecha)} · {hora12(c.hora)}
                    </small>
                    <small>{ORIGENES[c.origen!]}</small>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      <div className="pa-barra-dias" role="group" aria-label="Día">
        {dias.map((d) => {
          const n = clinica.citas.filter((c) => c.fecha === d && (pediatra === "todos" || c.pediatraId === pediatra)).length;
          return (
            <button key={d} type="button" aria-pressed={fecha === d} aria-label={`${fechaLarga(d)}, ${n} citas`} onClick={() => setFecha(d)}>
              <span>
                {mayus(diaCorto(d))} {numeroDia(d)} {mesCorto(d)}
              </span>
              <small>
                {n} {n === 1 ? "cita" : "citas"}
              </small>
            </button>
          );
        })}
      </div>
      <dl className="pa-indicadores">
        {indicadores.map(([t, n]) => (
          <div key={t}>
            <dt>{t}</dt>
            <dd>{n}</dd>
          </div>
        ))}
      </dl>

      <div className="pa-caja">
        {delDia.length === 0 ? (
          <p className="pa-vacio">No hay citas para este día.</p>
        ) : (
          <ul className="pa-citas">
            {delDia.map((c) => {
              const paciente = clinica.pacientes.find((p) => p.id === c.pacienteId)!;
              return (
                <li key={c.id} data-nueva={!!c.origen}>
                  <div className="pa-cita-hora">
                    <strong>{hora12(c.hora)}</strong>
                    <small>{c.id}</small>
                  </div>
                  <div className="pa-cita-quien">
                    <p>
                      <b>{paciente.nombre}</b>
                      <small>{edadTexto(mesesDe(paciente.nacimiento))}</small>
                      {c.origen && <span className="pa-etiqueta">{ORIGENES[c.origen]}</span>}
                    </p>
                    <span>
                      {motivoPor(c.motivo).nombre} · {pediatraPor(c.pediatraId).nombre}
                    </span>
                    {c.vacunas.length > 0 && <small>Preparar: {c.vacunas.map((v) => vacunaPor(v).nombre).join(", ")}</small>}
                    {c.nota && <small>Nota: {c.nota}</small>}
                    <small>
                      {paciente.tutor} · {paciente.telefono} · {formatoQ(totalCita(c.motivo, c.vacunas))}
                    </small>
                  </div>
                  <div className="pa-cita-acciones">
                    <div className="pa-estados" role="group" aria-label={`Estado de la cita de ${paciente.nombre}`}>
                      {ESTADOS.map((e) => (
                        <button key={e} type="button" data-estado={e} aria-pressed={c.estado === e} onClick={() => clinica.cambiarEstado(c.id, e)}>
                          {e}
                        </button>
                      ))}
                    </div>
                    <button type="button" className="pa-enlace" onClick={() => alAbrirCarne(paciente.id)}>
                      <ClipboardList size={16} aria-hidden /> Abrir carné
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
