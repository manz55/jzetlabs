import { useState, type FormEvent } from "react";
import { CalendarCheck, FlaskConical, Stethoscope } from "lucide-react";
import { agendar, horasLibres, proximaFechaLibre, type Solicitud } from "./agenda";
import {
  ASEGURADORAS,
  ESPECIALIDADES,
  EXAMENES,
  IDS_ESPECIALIDAD,
  IDS_EXAMEN,
  MEDICOS,
  esExamen,
  fechaLarga,
  hoyIso,
  nombreServicio,
  precioServicio,
  qz,
  type Cita,
  type Pago,
  type ServicioId,
  type Sexo,
  type Tipo,
} from "./datos";
import type { Altamira } from "./estado";

const TIPOS = [
  { id: "consulta", nombre: "Consulta con Especialista", icono: Stethoscope },
  { id: "laboratorio", nombre: "Examen de Laboratorio", icono: FlaskConical },
] as const;

type Props = {
  clinica: Altamira;
  solicitud: Solicitud;
  alCambiar: (s: Solicitud) => void;
  alReservar: (cita: Cita) => void;
  enPortal: boolean;
  accion: string;
};

export function FormularioCita({ clinica, solicitud, alCambiar, alReservar, enPortal, accion }: Props) {
  const [error, setError] = useState("");
  const { tipo, servicioId } = solicitud;
  const fecha = solicitud.fecha || proximaFechaLibre(clinica.citas, servicioId);
  const horas = horasLibres(clinica.citas, servicioId, fecha);
  const hora = horas.includes(solicitud.hora) ? solicitud.hora : (horas[0] ?? "");
  const siguiente = horas.length ? "" : proximaFechaLibre(clinica.citas, servicioId, fecha > hoyIso() ? fecha : hoyIso());
  const poner = (cambios: Partial<Solicitud>) => {
    setError("");
    alCambiar({ ...solicitud, ...cambios });
  };

  function elegirTipo(nuevo: Tipo) {
    if (nuevo !== tipo) poner({ tipo: nuevo, servicioId: nuevo === "consulta" ? IDS_ESPECIALIDAD[0] : IDS_EXAMEN[0], fecha: "", hora: "" });
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    const edad = Number(solicitud.edad);
    if (solicitud.nombre.trim().length < 3) return setError("Escriba el nombre y apellido del paciente.");
    if (solicitud.edad === "" || !Number.isInteger(edad) || edad < 0 || edad > 110) return setError("Escriba la edad del paciente en años.");
    if (!solicitud.sexo) return setError("Elija el sexo del paciente; define los valores de referencia.");
    if (!hora) return setError("Elija una fecha con horarios disponibles.");
    const cita = agendar({ ...solicitud, fecha, hora }, enPortal);
    if (!cita) return setError("Ese horario se acaba de ocupar. Elija otro.");
    alReservar(cita);
  }

  return (
    <form onSubmit={enviar} noValidate className="grid min-w-0 gap-3.5">
      <fieldset className="grid grid-cols-2 gap-1 rounded-xl bg-[#EFF6FF] p-1">
        <legend className="sr-only">Tipo de cita</legend>
        {TIPOS.map(({ id, nombre, icono: Icono }) => (
          <button
            key={id}
            type="button"
            aria-pressed={tipo === id}
            onClick={() => elegirTipo(id)}
            className={`flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-lg px-2 text-[0.78rem] font-bold leading-tight transition ${tipo === id ? "bg-[#1D4ED8] text-white" : "text-[#1E3A8A] hover:bg-white"}`}
          >
            <Icono size={16} aria-hidden className="shrink-0" />
            {nombre}
          </button>
        ))}
      </fieldset>

      <label className="cm-campo">
        {tipo === "consulta" ? "Especialidad" : "Examen"}
        <select className="cm-control" value={servicioId} onChange={(e) => poner({ servicioId: e.target.value as ServicioId, fecha: "", hora: "" })}>
          {tipo === "consulta"
            ? IDS_ESPECIALIDAD.map((id) => (
                <option key={id} value={id}>
                  {ESPECIALIDADES[id].etiqueta} · {qz(ESPECIALIDADES[id].precio)}
                </option>
              ))
            : IDS_EXAMEN.map((id) => (
                <option key={id} value={id}>
                  {EXAMENES[id].nombre} · {qz(EXAMENES[id].precio)}
                </option>
              ))}
        </select>
      </label>

      <p className="-mt-1.5 text-xs leading-snug text-[#475569]">
        {esExamen(servicioId)
          ? `${EXAMENES[servicioId].preparacion}. Resultado en ${EXAMENES[servicioId].horas} horas.`
          : `${MEDICOS[servicioId].nombre} · ${MEDICOS[servicioId].atiende.toLowerCase()}.`}
      </p>

      <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-3">
        <label className="cm-campo">
          Fecha
          <input type="date" className="cm-control" min={hoyIso()} value={fecha} onChange={(e) => poner({ fecha: e.target.value, hora: "" })} />
        </label>
        <label className="cm-campo">
          Horario disponible
          <select className="cm-control" value={hora} disabled={!horas.length} onChange={(e) => poner({ hora: e.target.value })}>
            {!horas.length && <option value="">Sin horarios</option>}
            {horas.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </label>
      </div>

      {siguiente && (
        <p className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#FEF3C7] px-3 py-2 text-xs font-semibold text-[#92400E]">
          No hay horarios ese día.
          <button type="button" onClick={() => poner({ fecha: siguiente, hora: "" })} className="min-h-8 font-extrabold underline underline-offset-2">
            Ver {fechaLarga(siguiente)}
          </button>
        </p>
      )}

      <label className="cm-campo">
        Nombre del paciente
        <input className="cm-control" autoComplete="off" placeholder="Nombre y apellido" value={solicitud.nombre} onChange={(e) => poner({ nombre: e.target.value })} />
      </label>

      <div className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1.5fr)] gap-3">
        <label className="cm-campo">
          Edad
          <input className="cm-control" inputMode="numeric" placeholder="Años" value={solicitud.edad} onChange={(e) => poner({ edad: e.target.value.replace(/\D/g, "").slice(0, 3) })} />
        </label>
        <label className="cm-campo">
          Sexo
          <select className="cm-control" value={solicitud.sexo} onChange={(e) => poner({ sexo: e.target.value as Sexo })}>
            <option value="" disabled>
              Elegir
            </option>
            <option value="F">Mujer</option>
            <option value="M">Hombre</option>
          </select>
        </label>
        <label className="cm-campo">
          Forma de pago
          <select className="cm-control" value={solicitud.pago} onChange={(e) => poner({ pago: e.target.value as Pago })}>
            <option value="particular">Particular</option>
            {ASEGURADORAS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm font-semibold text-[#B91C1C]">
          {error}
        </p>
      )}

      <button type="submit" className="cm-boton cm-azul !min-h-12 w-full">
        <CalendarCheck size={17} aria-hidden className="shrink-0" />
        {accion} · {qz(precioServicio(servicioId))}
        <span className="sr-only"> por {nombreServicio(servicioId)}</span>
      </button>
    </form>
  );
}
