import { useState } from "react";
import { CalendarClock, Check, Glasses, X } from "lucide-react";
import { cuando, diaCorto, fechasLibres, horasLibres } from "./agenda";
import { ETAPAS, SERVICIOS, aroPorId, qz, textoPago, type Cita, type Orden } from "./datos";
import type { ClinicaViva } from "./estado";
import { Foto, SelectorHorario } from "./Piezas";

function OrdenEnTaller({ orden }: { orden: Orden }) {
  const aro = aroPorId(orden.aroId)!;
  const saldo = orden.total - orden.abonado;
  const avance = orden.entregada ? 100 : (orden.etapa / ETAPAS.length) * 100;
  return (
    <article className="cv-tarjeta p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Foto id={aro.foto} alt={aro.alt} ancho={200} alto={150} className="h-16 w-20 shrink-0 rounded-xl" />
          <div className="min-w-0">
            <h3 className="text-lg">
              Aro {aro.nombre} · {orden.lente}
            </h3>
            <p className="text-sm tabular-nums">Orden {orden.id}</p>
          </div>
        </div>
        <p className={`cv-chip ${orden.etapa === 4 ? "cv-chip-bien" : "cv-chip-pronto"}`}>{orden.entregada ? "Entregados" : ETAPAS[orden.etapa - 1].estado}</p>
      </div>

      <div role="progressbar" aria-label={`Avance de la orden ${orden.id}`} aria-valuemin={0} aria-valuemax={ETAPAS.length} aria-valuenow={orden.etapa} className="mt-5 h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
        <div className="h-full rounded-full bg-[#1E3A8A] transition-[width] duration-500" style={{ width: `${avance}%` }} />
      </div>
      <ol className="mt-3 grid gap-2 sm:grid-cols-4 sm:gap-3">
        {ETAPAS.map((e) => {
          const hecha = e.etapa < orden.etapa || orden.entregada || orden.etapa === 4;
          const actual = e.etapa === orden.etapa && !orden.entregada;
          return (
            <li key={e.etapa} aria-current={actual ? "step" : undefined} className={`flex items-start gap-2 text-[0.8rem] leading-snug ${hecha || actual ? "font-bold text-[#0F172A]" : "text-[#64748B]"}`}>
              <span className={`grid size-5 shrink-0 place-items-center rounded-full text-[0.68rem] font-extrabold ${hecha ? "bg-[#1E3A8A] text-white" : actual ? "bg-[#B45309] text-white" : "bg-[#E2E8F0] text-[#475569]"}`}>
                {hecha ? <Check size={12} aria-hidden /> : e.etapa}
              </span>
              <span>
                <span className="sr-only">Paso {e.etapa}: </span>
                {e.nombre}
              </span>
            </li>
          );
        })}
      </ol>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-[#E2E8F0] pt-4 text-sm sm:grid-cols-4">
        {[
          ["Total", qz(orden.total)],
          ["Abonado", qz(orden.abonado)],
          ["Saldo", saldo ? qz(saldo) : "Pagado"],
          [orden.etapa === 4 ? "Listos desde" : "Entrega estimada", diaCorto(orden.entrega)],
        ].map(([t, v]) => (
          <div key={t}>
            <dt className="font-semibold text-[#475569]">{t}</dt>
            <dd className={`font-extrabold tabular-nums first-letter:uppercase ${t === "Saldo" && saldo ? "text-[#B45309]" : "text-[#0F172A]"}`}>{v}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export function SeguimientoTaller({ clinica, pacienteId }: { clinica: ClinicaViva; pacienteId: string }) {
  const ordenes = clinica.ordenes.filter((o) => o.pacienteId === pacienteId);
  return (
    <section aria-label="Seguimiento de lentes en taller óptico" className="grid gap-3">
      <h2 className="text-2xl">Tus lentes en el taller óptico</h2>
      {ordenes.length ? (
        ordenes.map((o) => <OrdenEnTaller key={o.id} orden={o} />)
      ) : (
        <p className="cv-tarjeta flex items-start gap-3 p-5 text-sm">
          <Glasses size={20} aria-hidden className="shrink-0 text-[#1E3A8A]" />
          Todavía no tienes lentes encargados. Cuando elijas tu aro en la óptica, aquí vas a ver cada paso hasta que estén listos.
        </p>
      )}
    </section>
  );
}

function CambioDeHorario({ clinica, cita, alCerrar }: { clinica: ClinicaViva; cita: Cita; alCerrar: () => void }) {
  const [horario, setHorario] = useState({ fecha: "", hora: "" });
  const fechas = fechasLibres(clinica.citas);
  const fecha = fechas.includes(horario.fecha) ? horario.fecha : fechas[0];
  const hora = horasLibres(clinica.citas, fecha).includes(horario.hora) ? horario.hora : "";
  return (
    <div className="mt-4 grid gap-4 border-t border-[#E2E8F0] pt-4">
      <SelectorHorario citas={clinica.citas} fecha={fecha} hora={hora} alElegir={(f, h) => setHorario({ fecha: f, hora: h })} nombre="cambio" />
      <p className="text-xs font-semibold text-[#475569]">Sujeto a confirmación de la clínica. Tu horario actual se mantiene hasta que te confirmen.</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={!hora}
          onClick={() => {
            clinica.pedirCambio(cita.id, { fecha, hora });
            alCerrar();
          }}
          className="cv-boton cv-zafiro"
        >
          Enviar solicitud
        </button>
        <button type="button" onClick={alCerrar} className="cv-boton cv-linea">
          Cancelar
        </button>
      </div>
    </div>
  );
}

export function ProximaCita({ clinica, pacienteId, alAgendar }: { clinica: ClinicaViva; pacienteId: string; alAgendar: () => void }) {
  const [cambiando, setCambiando] = useState("");
  const cita = clinica.proximaCita(pacienteId);

  if (!cita) {
    return (
      <section aria-label="Próxima cita de control" className="cv-tarjeta p-5">
        <h2 className="text-xl">Próxima cita de control</h2>
        <p className="mt-2 text-sm">No tienes una cita pendiente.</p>
        <button type="button" onClick={alAgendar} className="cv-boton cv-zafiro mt-4 w-full">
          Agendar examen
        </button>
      </section>
    );
  }

  return (
    <section aria-label="Próxima cita de control" className="cv-tarjeta p-5">
      <h2 className="flex items-center gap-2.5 text-xl">
        <CalendarClock size={20} aria-hidden className="shrink-0 text-[#1E3A8A]" /> Próxima cita de control
      </h2>
      <p className="mt-3 text-2xl font-extrabold tabular-nums text-[#0F172A] first-letter:uppercase">{cuando(cita)}</p>
      <p className="mt-1 text-sm font-bold text-[#0F172A]">{SERVICIOS[cita.servicio].nombre}</p>
      <p className="text-sm tabular-nums">
        {cita.area ? `${cita.area} · ` : ""}
        {textoPago(cita.pago)} · {qz(cita.monto)}
      </p>

      {cita.aros.length > 0 && (
        <div className="mt-4">
          <h3 className="cv-rotulo font-sans">Aros apartados para probar</h3>
          <ul className="grid gap-2">
            {cita.aros.map((id) => {
              const aro = aroPorId(id)!;
              return (
                <li key={id} className="flex items-center gap-3 rounded-xl bg-[#F1F5F9] p-2">
                  <Foto id={aro.foto} alt={aro.alt} ancho={120} alto={90} className="h-11 w-14 shrink-0 rounded-lg" />
                  <span className="min-w-0 flex-1 text-sm font-bold text-[#0F172A]">
                    {aro.nombre} <span className="font-semibold tabular-nums text-[#B45309]">{qz(aro.precio)}</span>
                  </span>
                  <button type="button" onClick={() => clinica.quitarAro(cita.id, id)} aria-label={`Quitar aro ${aro.nombre}`} className="grid size-11 shrink-0 place-items-center rounded-full text-[#475569] hover:bg-white">
                    <X size={16} aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {cita.cambio ? (
        <div className="mt-4 rounded-xl border border-[#FCD34D] bg-[#FFFBEB] p-3 text-sm text-[#92400E]">
          <p className="font-bold">Cambio solicitado: {cuando(cita.cambio).replace(/^./, (l) => l.toLowerCase())}</p>
          <p>Pendiente de confirmación de la clínica.</p>
          <button type="button" onClick={() => clinica.retirarCambio(cita.id)} className="mt-1 min-h-11 font-bold underline underline-offset-4">
            Retirar solicitud
          </button>
        </div>
      ) : cambiando === cita.id ? (
        <CambioDeHorario clinica={clinica} cita={cita} alCerrar={() => setCambiando("")} />
      ) : (
        <button type="button" onClick={() => setCambiando(cita.id)} className="cv-boton cv-linea mt-4 w-full">
          Solicitar cambio de horario
        </button>
      )}
    </section>
  );
}
