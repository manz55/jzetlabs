import { useState, type FormEvent } from "react";
import { CalendarCheck2, CalendarPlus } from "lucide-react";
import { IDS_SERVICIO, SERVICIOS, aplicaA, fechaRelativa, hora12, hoyIso, qz, type Cita, type Especie, type ServicioId } from "./datos";
import { horasLibres, solicitudVacia, type ClinicaViva, type Solicitud } from "./estado";
import { Retrato, SelectorEspecie } from "./Piezas";

type Props = {
  clinica: ClinicaViva;
  solicitud: Solicitud;
  alCambiar: (s: Solicitud) => void;
  reservada: string;
  alReservar: (cita: Cita | null) => void;
  alVerCarnet: (cita: Cita) => void;
  alVerAgenda: (cita: Cita) => void;
};

export function Agendador({ clinica, solicitud, alCambiar, reservada, alReservar, alVerCarnet, alVerAgenda }: Props) {
  const [error, setError] = useState("");
  const { nombre, especie, servicio, fecha } = solicitud;
  const libres = horasLibres(clinica.citas, SERVICIOS[servicio].area, fecha);
  const hora = libres.includes(solicitud.hora) ? solicitud.hora : (libres[0] ?? "");
  const cita = clinica.citas.find((c) => c.id === reservada);
  const mascota = cita && clinica.mascota(cita.mascotaId);

  const cambiar = (cambios: Partial<Solicitud>) => {
    setError("");
    alCambiar({ ...solicitud, ...cambios });
  };
  const cambiarEspecie = (nueva: Especie) => cambiar({ especie: nueva, servicio: aplicaA(servicio, nueva) ? servicio : "consulta" });

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("Escribe el nombre de tu mascota.");
      return;
    }
    const nueva = clinica.agendar({ ...solicitud, hora });
    if (!nueva) {
      setError("Ese horario ya no está disponible. Elige otro.");
      return;
    }
    alReservar(nueva);
    alCambiar({ ...solicitudVacia(), especie });
  }

  if (cita && mascota) {
    return (
      <div className="hv-tarjeta p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)]" role="status">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#F0FDFA] text-[#0F766E]">
          <CalendarCheck2 size={24} aria-hidden />
        </span>
        <h2 className="mt-4 text-2xl font-extrabold">Cita confirmada</h2>
        <p className="mt-1 text-sm">Ya está en el carnet de {mascota.nombre} y en la agenda de la clínica.</p>

        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#F0FDFA] p-4">
          <Retrato mascota={mascota} className="size-14" />
          <div className="min-w-0">
            <p className="font-extrabold text-[#0F172A]">{mascota.nombre}</p>
            <p className="text-sm">{SERVICIOS[cita.servicio].nombre}</p>
            <p className="text-sm font-semibold text-[#115E59]">
              {fechaRelativa(cita.fecha)} · {hora12(cita.hora)}
            </p>
          </div>
          <p className="ml-auto text-lg font-extrabold text-[#0F172A]">{qz(SERVICIOS[cita.servicio].precio)}</p>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => alVerCarnet(cita)} className="hv-boton hv-turquesa">
            Ver en Mis Mascotas
          </button>
          <button type="button" onClick={() => alVerAgenda(cita)} className="hv-boton hv-linea">
            Ver en la agenda
          </button>
        </div>
        <button type="button" onClick={() => alReservar(null)} className="hv-boton mt-2 w-full text-[#0F766E] hover:bg-[#F0FDFA]">
          Agendar otra cita
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="hv-tarjeta grid gap-4 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)]">
      <h2 className="flex items-center gap-2 text-xl font-extrabold">
        <CalendarPlus size={22} aria-hidden className="text-[#0D9488]" /> Agenda en un minuto
      </h2>

      <label className="block min-w-0">
        <span className="hv-rotulo">Servicio</span>
        <select value={servicio} onChange={(e) => cambiar({ servicio: e.target.value as ServicioId })} className="hv-campo">
          {IDS_SERVICIO.filter((id) => !SERVICIOS[id].soloTarifario || id === servicio).map((id) => (
            <option key={id} value={id} disabled={!aplicaA(id, especie)}>
              {SERVICIOS[id].nombre} {qz(SERVICIOS[id].precio)}
              {aplicaA(id, especie) ? "" : " (solo perros)"}
            </option>
          ))}
        </select>
      </label>

      <label className="block min-w-0">
        <span className="hv-rotulo">Nombre de tu mascota</span>
        <input value={nombre} onChange={(e) => cambiar({ nombre: e.target.value })} maxLength={24} placeholder="Ej. Rocco" autoComplete="off" aria-invalid={Boolean(error) && !nombre.trim()} className="hv-campo" />
      </label>

      <SelectorEspecie valor={especie} alElegir={cambiarEspecie} />

      <div className="grid grid-cols-2 gap-3">
        <label className="block min-w-0">
          <span className="hv-rotulo">Fecha</span>
          <input type="date" value={fecha} min={hoyIso()} onChange={(e) => cambiar({ fecha: e.target.value })} className="hv-campo !px-2.5" />
        </label>
        <label className="block min-w-0">
          <span className="hv-rotulo">Horario disponible</span>
          <select value={hora} onChange={(e) => cambiar({ hora: e.target.value })} disabled={!libres.length} className="hv-campo">
            {libres.length ? (
              libres.map((h) => (
                <option key={h} value={h}>
                  {hora12(h)}
                </option>
              ))
            ) : (
              <option value="">Sin horarios</option>
            )}
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm font-bold text-[#B91C1C]">
          {error}
        </p>
      )}

      <button type="submit" disabled={!hora} className="hv-boton hv-turquesa min-h-13 !text-base">
        Agendar cita · {qz(SERVICIOS[servicio].precio)}
      </button>
      <p className="text-center text-xs font-semibold text-[#64748B]">Pagas en clínica: efectivo, Visanet, NeoNet, BI o BAC.</p>
    </form>
  );
}
