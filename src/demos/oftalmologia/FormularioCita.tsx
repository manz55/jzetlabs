import { useState, type FormEvent } from "react";
import { fechasLibres, horasLibres } from "./agenda";
import { ASEGURADORAS, SERVICIOS, SERVICIOS_IDS, qz, type Cita, type Pago, type ServicioId } from "./datos";
import type { ClinicaViva } from "./estado";
import { SelectorHorario } from "./Piezas";

export type Seleccion = { servicio: ServicioId; area: string };

type Props = {
  clinica: ClinicaViva;
  seleccion: Seleccion;
  alSeleccionar: (s: Seleccion) => void;
  origen: "portada" | "recepcion";
  alAgendar: (cita: Cita) => void;
};

export function FormularioCita({ clinica, seleccion, alSeleccionar, origen, alAgendar }: Props) {
  const [horario, setHorario] = useState({ fecha: "", hora: "" });
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pago, setPago] = useState<Pago>("Particular");
  const [error, setError] = useState("");

  const fechas = fechasLibres(clinica.citas);
  const fecha = fechas.includes(horario.fecha) ? horario.fecha : fechas[0];
  const hora = horasLibres(clinica.citas, fecha).includes(horario.hora) ? horario.hora : "";

  function enviar(e: FormEvent) {
    e.preventDefault();
    const digitos = telefono.replace(/\D/g, "");
    if (!hora) return setError("Elige un horario disponible.");
    if (nombre.trim().length < 3) return setError("Escribe el nombre del paciente.");
    if (digitos.length !== 8) return setError("El WhatsApp debe tener 8 dígitos.");
    const cita = clinica.agendar({ ...seleccion, fecha, hora, nombre, telefono: digitos, pago, origen });
    if (!cita) return setError("Ese horario se acaba de ocupar. Elige otro.");
    alAgendar(cita);
  }

  return (
    <form onSubmit={enviar} onChange={() => setError("")} noValidate className="grid min-w-0 gap-4">
      <fieldset className="min-w-0">
        <legend className="cv-rotulo">Servicio</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {SERVICIOS_IDS.map((id) => (
            <label key={id} className="cv-opcion !justify-between gap-2 !px-3 !text-left">
              <input type="radio" name={`${origen}-servicio`} className="sr-only" checked={seleccion.servicio === id} onChange={() => alSeleccionar({ servicio: id, area: "" })} />
              <span className="min-w-0 text-[0.8rem] leading-snug">{SERVICIOS[id].nombre}</span>
              <span className="shrink-0 text-sm font-extrabold tabular-nums text-[#B45309]">{qz(SERVICIOS[id].precio)}</span>
            </label>
          ))}
        </div>
        {seleccion.area && <p className="mt-2 text-sm font-semibold text-[#1E3A8A]">Motivo: {seleccion.area}</p>}
      </fieldset>

      <SelectorHorario citas={clinica.citas} fecha={fecha} hora={hora} alElegir={(f, h) => setHorario({ fecha: f, hora: h })} nombre={origen} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="min-w-0">
          <span className="cv-rotulo">Nombre del paciente</span>
          <input className="cv-campo" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete={origen === "portada" ? "name" : "off"} placeholder="Nombre y apellido" />
        </label>
        <label className="min-w-0">
          <span className="cv-rotulo">WhatsApp</span>
          <input className="cv-campo tabular-nums" value={telefono} onChange={(e) => setTelefono(e.target.value)} inputMode="numeric" maxLength={9} autoComplete={origen === "portada" ? "tel-national" : "off"} placeholder="8 dígitos" />
        </label>
      </div>

      <label className="min-w-0">
        <span className="cv-rotulo">Forma de pago</span>
        <select className="cv-campo" value={pago} onChange={(e) => setPago(e.target.value as Pago)}>
          <option value="Particular">Particular</option>
          {ASEGURADORAS.map((a) => (
            <option key={a} value={a}>
              Seguro médico · {a}
            </option>
          ))}
        </select>
      </label>

      {clinica.porApartar.length > 0 && origen === "portada" && (
        <p className="rounded-xl bg-[#FFFBEB] px-3 py-2 text-sm font-semibold text-[#92400E]">
          {clinica.porApartar.length === 1 ? "Tu aro apartado se suma a esta cita." : `Tus ${clinica.porApartar.length} aros apartados se suman a esta cita.`}
        </p>
      )}

      <p role="alert" className="text-sm font-bold text-[#B91C1C] empty:hidden">
        {error}
      </p>
      <button type="submit" className="cv-boton cv-zafiro min-h-12 w-full">
        <span className="tabular-nums">Confirmar cita · {qz(SERVICIOS[seleccion.servicio].precio)}</span>
      </button>
    </form>
  );
}
