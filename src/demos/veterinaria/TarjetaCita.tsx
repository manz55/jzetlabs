import { useState } from "react";
import { CalendarCheck2, CalendarClock, CalendarPlus, Check, Clock3, Plus } from "lucide-react";
import { porConfirmar, porHorario } from "./agenda";
import { precioCita } from "./cuentas";
import { ESTADOS, EXTRAS, IDS_EXTRA, SERVICIOS, fechaRelativa, hora12, hoyIso, qz, type Cita, type Estado, type Horario, type Mascota } from "./datos";
import type { ClinicaViva } from "./estado";

const PASOS: Estado[] = ["espera", "atencion", "lista"];
const cuando = (h: Horario) => `${fechaRelativa(h.fecha)} · ${hora12(h.hora)}`;

function Etapas({ cita }: { cita: Cita }) {
  const actual = porConfirmar(cita) ? -1 : PASOS.indexOf(cita.estado);
  return (
    <ol aria-label="Etapas de la cita" aria-live="polite" className="grid grid-cols-3">
      {PASOS.map((paso, i) => {
        const hecho = i < actual;
        const activo = i === actual;
        return (
          <li key={paso} aria-current={activo ? "step" : undefined} className="relative flex min-w-0 flex-col items-center gap-2 text-center">
            {i > 0 && <span aria-hidden className={`absolute right-[calc(50%+1.25rem)] top-[1.1rem] h-0.5 w-[calc(100%-2.5rem)] ${i <= actual ? "bg-[#0D9488]" : "bg-[#E2E8F0]"}`} />}
            <span className={`grid size-9 place-items-center rounded-full border-2 text-xs font-extrabold ${activo ? "border-[#0F766E] bg-[#0F766E] text-white" : hecho ? "border-[#0D9488] bg-[#F0FDFA] text-[#0F766E]" : "border-[#CBD5E1] bg-white text-[#64748B]"}`}>
              {hecho ? <Check size={16} aria-hidden /> : i + 1}
            </span>
            <span className={`px-1 text-xs leading-snug sm:text-sm ${activo ? "font-extrabold text-[#0F172A]" : "font-semibold text-[#64748B]"}`}>{ESTADOS[paso].dueno}</span>
          </li>
        );
      })}
    </ol>
  );
}

type Props = {
  clinica: ClinicaViva;
  mascota: Mascota;
  alSolicitar: () => void;
  alCambiar: (cita: Cita) => void;
  alAvisar: (texto: string, alerta?: boolean) => void;
};

export function TarjetaCita({ clinica, mascota, alSolicitar, alCambiar, alAvisar }: Props) {
  const propias = clinica.citas.filter((c) => c.mascotaId === mascota.id && c.fecha >= hoyIso()).sort(porHorario);
  const pendientes = propias.filter((c) => c.estado !== "entregada");
  const entregada = propias.filter((c) => c.estado === "entregada").at(-1);
  const [elegida, setElegida] = useState("");
  const cita = pendientes.find((c) => c.id === elegida) ?? pendientes.find((c) => c.solicitud?.propuesta) ?? pendientes[0];
  const solicitud = cita?.solicitud;
  const propuesta = solicitud?.propuesta;
  const editable = cita?.estado === "espera";

  return (
    <section aria-labelledby="hv-cita" className="hv-tarjeta p-5 sm:p-6">
      <h2 id="hv-cita" className="flex items-center gap-2 text-lg font-extrabold">
        <CalendarClock size={20} aria-hidden className="text-[#0D9488]" /> Cita activa
      </h2>

      {!cita ? (
        <>
          <p className="mt-3 text-sm">{entregada ? `${mascota.nombre} ya fue entregada hoy: ${SERVICIOS[entregada.servicio].nombre.toLowerCase()}.` : `${mascota.nombre} no tiene citas pendientes.`}</p>
          <button type="button" onClick={alSolicitar} className="hv-boton hv-turquesa mt-4">
            <CalendarPlus size={17} aria-hidden /> Solicitar cita o grooming
          </button>
        </>
      ) : (
        <>
          {pendientes.length > 1 && (
            <div role="group" aria-label={`Citas de ${mascota.nombre}`} className="mt-4 flex flex-wrap gap-2">
              {pendientes.map((c) => (
                <button key={c.id} type="button" aria-pressed={c.id === cita.id} onClick={() => setElegida(c.id)} className="hv-pildora">
                  {cuando(c)}
                  {c.solicitud && <span className="hv-cuenta">!</span>}
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-2xl font-extrabold leading-tight text-[#0F172A]">{cuando(cita)}</p>
              <p className="mt-1 text-sm">
                {SERVICIOS[cita.servicio].nombre}
                {cita.extras?.map((e) => ` + ${EXTRAS[e].nombre.toLowerCase()}`)}
              </p>
            </div>
            <p className="text-2xl font-extrabold tabular-nums text-[#0F172A]">{qz(precioCita(cita))}</p>
          </div>

          <div aria-live="polite">
            {solicitud && !propuesta && (
              <div className="mt-4 rounded-2xl border border-[#FCD34D] bg-[#FFFBEB] p-4">
                <p className="flex items-start gap-2 text-sm font-extrabold text-[#92400E]">
                  <Clock3 size={17} aria-hidden className="mt-0.5 shrink-0" />
                  {porConfirmar(cita) ? "Cita solicitada" : "Cambio solicitado"} · Esperando confirmación de clínica
                </p>
                {!porConfirmar(cita) && <p className="mt-1 pl-6 text-sm text-[#78350F]">Pediste: {cuando(solicitud)}</p>}
                <button type="button" onClick={() => clinica.retirarSolicitud(cita.id)} className="hv-boton mt-2 text-[#92400E] underline underline-offset-4 hover:bg-[#FEF3C7]">
                  {porConfirmar(cita) ? "Cancelar solicitud" : "Mantener mi horario actual"}
                </button>
              </div>
            )}
            {propuesta && (
              <div className="mt-4 rounded-2xl border border-[#FDBA74] bg-[#FFF7ED] p-4">
                <p className="text-sm font-extrabold text-[#9A3412]">La clínica te propone otro horario</p>
                <p className="mt-1 text-lg font-extrabold text-[#0F172A]">{cuando(propuesta)}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!clinica.aceptarPropuesta(cita.id)) alAvisar("Ese horario ya se ocupó. Pide otro.", true);
                    }}
                    className="hv-boton hv-turquesa"
                  >
                    Aceptar horario
                  </button>
                  <button type="button" onClick={() => alCambiar(cita)} className="hv-boton hv-linea">
                    Pedir otro
                  </button>
                </div>
              </div>
            )}
            {!solicitud && cita.confirmadaPorClinica && (
              <p className="mt-4 flex items-center gap-2 rounded-2xl bg-[#F0FDFA] p-3 text-sm font-extrabold text-[#115E59]">
                <CalendarCheck2 size={17} aria-hidden /> Horario confirmado por la clínica
              </p>
            )}
          </div>

          <div className="mt-6">
            <Etapas cita={cita} />
          </div>

          {SERVICIOS[cita.servicio].area === "grooming" && (
            <fieldset className="mt-6 border-t border-[#E2E8F0] pt-4">
              <legend className="sr-only">Extras de grooming</legend>
              <p aria-hidden className="hv-rotulo">Extras de grooming</p>
              <div className="flex flex-wrap gap-2">
                {IDS_EXTRA.map((e) => {
                  const puesto = cita.extras?.includes(e) ?? false;
                  return (
                    <button key={e} type="button" aria-pressed={puesto} disabled={!editable} onClick={() => clinica.alternarExtra(cita.id, e)} className="hv-pildora disabled:opacity-50">
                      {puesto ? <Check size={15} aria-hidden /> : <Plus size={15} aria-hidden />}
                      {EXTRAS[e].nombre} +{qz(EXTRAS[e].precio)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <button type="button" onClick={() => alCambiar(cita)} disabled={!editable} className="hv-boton hv-linea mt-5 w-full">
            Solicitar cambio de horario
          </button>
          {!editable && <p className="mt-2 text-xs text-[#64748B]">{mascota.nombre} ya está en la clínica, así que la cita no se puede modificar desde aquí.</p>}
        </>
      )}
    </section>
  );
}
