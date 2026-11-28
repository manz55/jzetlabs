import { useState } from "react";
import { CalendarClock, Hourglass, MapPin } from "lucide-react";
import { horasLibres, pedirCambio, proximaFechaLibre, retirarCambio } from "./agenda";
import { MEDICOS, SEDE, esExamen, EXAMENES, fechaRelativa, hoyIso, nombrePago, nombreServicio, precioServicio, qz, type Cita } from "./datos";
import type { Altamira } from "./estado";

export function ProximaCita({ clinica, cita, alAvisar }: { clinica: Altamira; cita: Cita; alAvisar: (texto: string, alerta?: boolean) => void }) {
  const [editando, setEditando] = useState(false);
  const [fechaElegida, setFecha] = useState("");
  const [horaElegida, setHora] = useState("");
  const fecha = fechaElegida || proximaFechaLibre(clinica.citas, cita.servicioId, cita.fecha);
  const horas = horasLibres(clinica.citas, cita.servicioId, fecha, cita.id).filter((h) => fecha !== cita.fecha || h !== cita.hora);
  const hora = horas.includes(horaElegida) ? horaElegida : (horas[0] ?? "");

  function solicitar() {
    pedirCambio(cita.id, { fecha, hora });
    setEditando(false);
    alAvisar("Solicitud enviada. Recepción confirmará el nuevo horario.");
  }

  return (
    <article className="cm-tarjeta p-5">
      <h3 className="text-lg leading-snug">{nombreServicio(cita.servicioId)}</h3>
      <p className="mt-1 text-2xl font-extrabold text-[#1D4ED8] first-letter:uppercase">{fechaRelativa(cita.fecha)}</p>
      <p className="font-bold text-[#0F172A]">{cita.hora} horas</p>
      <p className="mt-2 text-sm">{esExamen(cita.servicioId) ? EXAMENES[cita.servicioId].preparacion : MEDICOS[cita.servicioId].nombre}</p>
      <p className="text-sm">
        {nombrePago(cita.pago)} · {qz(precioServicio(cita.servicioId))}
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-sm">
        <MapPin size={14} aria-hidden className="shrink-0 text-[#15803D]" /> {SEDE.corta}
      </p>

      {cita.cambio ? (
        <div className="mt-4 rounded-xl bg-[#FEF3C7] p-3 text-sm text-[#92400E]">
          <p className="flex items-start gap-2 font-bold">
            <Hourglass size={16} aria-hidden className="mt-0.5 shrink-0" />
            <span>
              Cambio pendiente de confirmación: {fechaRelativa(cita.cambio.fecha).toLowerCase()}, {cita.cambio.hora}
            </span>
          </p>
          <p className="mt-1">Su horario actual se mantiene hasta que recepción responda.</p>
          <button type="button" onClick={() => retirarCambio(cita.id)} className="mt-1 min-h-9 font-extrabold underline underline-offset-2">
            Retirar solicitud
          </button>
        </div>
      ) : (
        <>
          {cita.respuestaCambio && (
            <p role="status" className={`cm-estado mt-4 !rounded-xl !px-3 !py-2 ${cita.respuestaCambio === "confirmado" ? "cm-listo" : "cm-neutro"}`}>
              {cita.respuestaCambio === "confirmado" ? "Recepción confirmó su nuevo horario." : "No fue posible el cambio. Se mantiene este horario."}
            </p>
          )}
          {cita.estado !== "espera" ? null : editando ? (
            <div className="mt-4 grid gap-3 border-t border-[#DBE4F0] pt-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="cm-campo">
                  Nueva fecha
                  <input type="date" className="cm-control" min={hoyIso()} value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </label>
                <label className="cm-campo">
                  Nuevo horario
                  <select className="cm-control" value={hora} disabled={!horas.length} onChange={(e) => setHora(e.target.value)}>
                    {!horas.length && <option value="">Sin horarios</option>}
                    {horas.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="text-xs">El cambio queda sujeto a confirmación de recepción.</p>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={solicitar} disabled={!hora} className="cm-boton cm-azul">
                  Enviar solicitud
                </button>
                <button type="button" onClick={() => setEditando(false)} className="cm-boton cm-linea">
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setEditando(true)} className="cm-boton cm-linea mt-4 w-full">
              <CalendarClock size={16} aria-hidden /> Solicitar cambio de hora
            </button>
          )}
        </>
      )}
    </article>
  );
}
