/* Disponibilidad: cada hora se abre o se cierra, y el portal de padres lo respeta. */
import { useState } from "react";
import { Lock, LockOpen, UserRound } from "lucide-react";
import {
  JORNADAS, PEDIATRAS, citaEn, claveDia, diaCorto, fechaLarga, hora12, horasDelDia, mayus, mesCorto, numeroDia, proximosDias, yaPaso,
  type Clinica,
} from "./datos";

export function Horarios({ clinica }: { clinica: Clinica }) {
  const dias = proximosDias();
  const [pediatraId, setPediatra] = useState(PEDIATRAS[0].id);
  // abre en el primer día que todavía tiene horas por delante
  const [fecha, setFecha] = useState(() => dias.find((d) => horasDelDia(d).some((h) => !yaPaso(d, h))) ?? dias[0]);
  const cerradas = clinica.cerrados[claveDia(pediatraId, fecha)] ?? [];
  const horas = horasDelDia(fecha);
  const libres = horas.filter((h) => !yaPaso(fecha, h) && !cerradas.includes(h) && !citaEn(clinica, pediatraId, fecha, h));

  const poner = (lista: string[]) => clinica.ponerCerrados(pediatraId, fecha, lista);
  const alternar = (h: string) => poner(cerradas.includes(h) ? cerradas.filter((x) => x !== h) : [...cerradas, h]);
  const cerrarJornada = (jornada: string[]) => poner([...new Set([...cerradas, ...jornada.filter((h) => !citaEn(clinica, pediatraId, fecha, h))])]);

  return (
    <>
      <div className="pa-panel-titulo">
        <div>
          <h1>Disponibilidad</h1>
          <p className="pa-suave">Toque una hora para cerrarla o abrirla. Lo que cierre deja de ofrecerse en el portal.</p>
        </div>
      </div>
      <div className="pa-selectores" role="group" aria-label="Pediatra">
        {PEDIATRAS.map((p) => (
          <button key={p.id} type="button" aria-pressed={pediatraId === p.id} onClick={() => setPediatra(p.id)}>
            {p.nombre}
          </button>
        ))}
      </div>
      <div className="pa-barra-dias" role="group" aria-label="Día">
        {dias.map((d) => (
          <button key={d} type="button" aria-pressed={fecha === d} aria-label={fechaLarga(d)} onClick={() => setFecha(d)}>
            <span>{mayus(diaCorto(d))}</span>
            <small>
              {numeroDia(d)} {mesCorto(d)}
            </small>
          </button>
        ))}
      </div>

      <div className="pa-caja">
        <h2>{mayus(fechaLarga(fecha))}</h2>
        <p className="pa-suave" role="status">
          {libres.length} {libres.length === 1 ? "hora disponible" : "horas disponibles"} para pacientes
        </p>
        {JORNADAS.map((j) => {
          const delDia = j.horas.filter((h) => horas.includes(h));
          if (!delDia.length) return null;
          return (
            <div key={j.nombre} className="pa-grupo">
              <h3>{j.nombre}</h3>
              <div className="pa-horarios-panel">
                {delDia.map((h) => {
                  const cita = citaEn(clinica, pediatraId, fecha, h);
                  const paciente = cita && clinica.pacientes.find((p) => p.id === cita.pacienteId);
                  const pasada = !cita && yaPaso(fecha, h);
                  const estado = cita ? "cita" : pasada ? "pasada" : cerradas.includes(h) ? "cerrada" : "abierta";
                  const Icono = cita ? UserRound : estado === "cerrada" ? Lock : LockOpen;
                  return (
                    <button key={h} type="button" data-estado={estado} disabled={!!cita || pasada} aria-pressed={cita || pasada ? undefined : estado === "abierta"} onClick={() => alternar(h)}>
                      <strong>{hora12(h)}</strong>
                      <span>
                        <Icono size={13} aria-hidden />
                        {paciente ? paciente.nombre.split(" ")[0] : pasada ? "Ya pasó" : estado === "cerrada" ? "Cerrada" : "Abierta"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="pa-herramientas">
                <button type="button" className="pa-btn pa-chico pa-contorno" onClick={() => cerrarJornada(delDia)}>
                  <Lock size={15} aria-hidden /> Cerrar la {j.nombre.toLowerCase()}
                </button>
                <button type="button" className="pa-btn pa-chico pa-contorno" onClick={() => poner(cerradas.filter((h) => !delDia.includes(h)))}>
                  <LockOpen size={15} aria-hidden /> Abrir la {j.nombre.toLowerCase()}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
