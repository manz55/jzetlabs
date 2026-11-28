import { useState } from "react";
import { Ban, Scissors, Stethoscope, TriangleAlert } from "lucide-react";
import { mismoHorario, porConfirmar, porHorario } from "./agenda";
import { precioCita } from "./cuentas";
import { AREAS, ESTADOS, EXTRAS, IDS_ESTADO, SERVICIOS, fechaCorta, fechaRelativa, hora12, hoyIso, qz, type Area, type Cita, type Estado, type Horario } from "./datos";
import type { ClinicaViva } from "./estado";
import { Retrato } from "./Piezas";

export type Dia = "hoy" | "proximas";

const PESTANAS: { id: Area | "todos"; nombre: string }[] = [
  { id: "todos", nombre: "Todos" },
  { id: "consulta", nombre: AREAS.consulta.nombre },
  { id: "grooming", nombre: AREAS.grooming.nombre },
];

const HORAS_DEL_DIA = [...new Set([...AREAS.consulta.horas, ...AREAS.grooming.horas])].sort();
const diaCorto = (fecha: string) => fechaCorta(fecha).replace(/ \d{4}$/, "");

function Momento({ horario }: { horario: Horario }) {
  return (
    <p className="col-span-2 text-sm font-extrabold tabular-nums text-[#0F172A] md:col-span-1">
      {hora12(horario.hora)}
      {horario.fecha > hoyIso() && <span className="ml-2 text-xs font-bold text-[#0F766E] md:ml-0 md:block">{diaCorto(horario.fecha)}</span>}
    </p>
  );
}

function Fila({ clinica, cita, alEstado }: { clinica: ClinicaViva; cita: Cita; alEstado: (c: Cita, e: Estado) => void }) {
  const mascota = clinica.mascota(cita.mascotaId);
  if (!mascota) return null;
  const servicio = SERVICIOS[cita.servicio];
  const Icono = servicio.area === "grooming" ? Scissors : Stethoscope;

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-5 py-3 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.1fr)_4rem_11.5rem]">
      <Momento horario={cita} />
      <div className="flex min-w-0 items-center gap-2.5">
        <Retrato mascota={mascota} className="size-10" />
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-extrabold text-[#0F172A]">
            {mascota.nombre}
            {cita.desdeWeb && <span className="hv-chip hv-chip-neutro">Web</span>}
            {cita.solicitud && <span className="hv-chip hv-chip-pronto">{porConfirmar(cita) ? "Por confirmar" : "Pide cambio"}</span>}
          </p>
          <p className="truncate text-xs text-[#64748B]">{mascota.dueno}</p>
        </div>
      </div>
      <div className="order-last col-span-2 min-w-0 text-xs leading-snug md:order-none md:col-span-1">
        <p className="flex items-start gap-1.5 font-semibold">
          <Icono size={14} aria-hidden className="mt-0.5 shrink-0 text-[#0D9488]" />
          <span>
            {servicio.nombre}
            {cita.extras?.map((e) => <span key={e} className="font-extrabold text-[#0F766E]"> + {EXTRAS[e].nombre}</span>)}
          </span>
        </p>
        {mascota.notas && (
          <p className="mt-1 flex items-start gap-1.5 font-bold text-[#9A3412]">
            <TriangleAlert size={13} aria-hidden className="mt-0.5 shrink-0" /> {mascota.notas}
          </p>
        )}
      </div>
      <p className="text-right text-sm font-extrabold tabular-nums text-[#0F172A]">{qz(precioCita(cita))}</p>
      <div className="order-last col-span-2 min-w-0 md:col-span-1">
        <select
          aria-label={`Estado de ${mascota.nombre}`}
          value={cita.estado}
          disabled={cita.fecha > hoyIso() || Boolean(cita.cobro) || porConfirmar(cita)}
          onChange={(e) => alEstado(cita, e.target.value as Estado)}
          data-estado={cita.estado}
          className="hv-campo hv-estado !h-11 !px-2.5 !text-[0.8rem]"
        >
          {IDS_ESTADO.map((e) => (
            <option key={e} value={e}>
              {porConfirmar(cita) ? "Sin confirmar" : ESTADOS[e].panel}
              {e === "entregada" && cita.cobro ? " · cobrada" : ""}
            </option>
          ))}
        </select>
      </div>
    </li>
  );
}

function FilaBloqueada({ clinica, bloqueo }: { clinica: ClinicaViva; bloqueo: Horario }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 border-l-4 border-l-[#C2410C] bg-[#FFF7ED] py-3 pl-4 pr-5 md:grid-cols-[5rem_minmax(0,1fr)_11.5rem]">
      <Momento horario={bloqueo} />
      <p className="flex min-w-0 items-center gap-2 text-sm font-extrabold text-[#9A3412]">
        <Ban size={16} aria-hidden className="shrink-0" /> Bloqueado por cirugía / emergencia
      </p>
      <button type="button" onClick={() => clinica.alternarBloqueo(bloqueo)} aria-label={`Liberar ${hora12(bloqueo.hora)}`} className="hv-boton hv-linea">
        Liberar
      </button>
    </li>
  );
}

function Bloqueador({ clinica }: { clinica: ClinicaViva }) {
  const [fecha, setFecha] = useState(hoyIso());

  return (
    <div className="grid gap-3 border-b border-[#E2E8F0] bg-[#FFF7ED] px-5 py-4">
      <label className="flex flex-wrap items-center gap-3 text-sm font-bold text-[#0F172A]">
        Día a bloquear
        <input type="date" value={fecha} min={hoyIso()} onChange={(e) => setFecha(e.target.value)} className="hv-campo !h-11 !w-auto" />
      </label>
      {fecha >= hoyIso() && (
        <div role="group" aria-label="Horarios a bloquear" className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {HORAS_DEL_DIA.map((hora) => {
            const bloqueada = clinica.bloqueos.some((b) => mismoHorario(b, { fecha, hora }));
            const citas = clinica.citas.filter((c) => mismoHorario(c, { fecha, hora }) && c.estado !== "entregada").length;
            return (
              <button
                key={hora}
                type="button"
                aria-pressed={bloqueada}
                onClick={() => clinica.alternarBloqueo({ fecha, hora })}
                className={`min-h-12 rounded-xl border px-1 py-1 text-xs font-extrabold tabular-nums ${bloqueada ? "border-[#C2410C] bg-[#C2410C] text-white" : "border-[#CBD5E1] bg-white text-[#0F172A] hover:border-[#C2410C]"}`}
              >
                {hora12(hora)}
                <span className={`block text-[0.68rem] font-semibold ${bloqueada ? "text-white" : "text-[#64748B]"}`}>
                  {bloqueada ? "Bloqueado" : citas ? `${citas} ${citas === 1 ? "cita" : "citas"}` : "Abierto"}
                </span>
              </button>
            );
          })}
        </div>
      )}
      <p className="text-xs font-semibold text-[#9A3412]">
        Un horario bloqueado deja de ofrecerse a los clientes{fecha >= hoyIso() ? ` (${fechaRelativa(fecha).toLowerCase()})` : ""}. Las citas ya agendadas se mantienen.
      </p>
    </div>
  );
}

export function Agenda({ clinica, dia, alDia, alEstado }: { clinica: ClinicaViva; dia: Dia; alDia: (d: Dia) => void; alEstado: (c: Cita, e: Estado) => void }) {
  const [area, setArea] = useState<Area | "todos">("todos");
  const [bloqueando, setBloqueando] = useState(false);
  const base = dia === "hoy" ? clinica.citasHoy : clinica.proximas;
  const bloqueos = clinica.bloqueos.filter((b) => (dia === "hoy" ? b.fecha === hoyIso() : b.fecha > hoyIso()));
  const filas = [
    ...base.filter((c) => area === "todos" || SERVICIOS[c.servicio].area === area).map((cita) => ({ ...cita, cita })),
    ...bloqueos.map((bloqueo) => ({ ...bloqueo, cita: undefined })),
  ].sort(porHorario);

  return (
    <section aria-labelledby="hv-agenda" className="hv-tarjeta overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
        <div>
          <h2 id="hv-agenda" className="text-lg font-extrabold">Agenda del Día</h2>
          <p className="text-xs text-[#64748B]">Clínica y peluquería</p>
        </div>
        <div role="group" aria-label="Día de la agenda" className="flex gap-2">
          <button type="button" aria-pressed={dia === "hoy"} onClick={() => alDia("hoy")} className="hv-pildora">
            Hoy
          </button>
          <button type="button" aria-pressed={dia === "proximas"} onClick={() => alDia("proximas")} className="hv-pildora">
            Próximos días <span className="hv-cuenta">{clinica.proximas.length}</span>
          </button>
        </div>
      </div>
      <div className="px-5 pt-4">
        <button type="button" role="switch" aria-checked={bloqueando} onClick={() => setBloqueando((v) => !v)} className="flex min-h-11 w-full items-center gap-3 text-left text-sm font-bold text-[#0F172A]">
          <span aria-hidden className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition ${bloqueando ? "justify-end bg-[#C2410C]" : "justify-start bg-[#CBD5E1]"}`}>
            <span className="size-5 rounded-full bg-white shadow" />
          </span>
          <span className="min-w-0">Bloquear horario por cirugía / emergencia</span>
          {clinica.bloqueos.length > 0 && <span className="hv-chip hv-chip-pronto ml-auto">{clinica.bloqueos.length} bloqueados</span>}
        </button>
      </div>
      <div role="group" aria-label="Filtrar por área" className="flex flex-wrap gap-2 border-b border-[#E2E8F0] px-5 py-4">
        {PESTANAS.map((p) => (
          <button key={p.id} type="button" aria-pressed={area === p.id} onClick={() => setArea(p.id)} className="hv-pildora">
            {p.nombre} <span className="tabular-nums opacity-70">{base.filter((c) => p.id === "todos" || SERVICIOS[c.servicio].area === p.id).length}</span>
          </button>
        ))}
      </div>
      {bloqueando && <Bloqueador clinica={clinica} />}
      {filas.length ? (
        <ul className="divide-y divide-[#F1F5F9]">
          {filas.map((f) => (f.cita ? <Fila key={f.cita.id} clinica={clinica} cita={f.cita} alEstado={alEstado} /> : <FilaBloqueada key={`${f.fecha}-${f.hora}`} clinica={clinica} bloqueo={{ fecha: f.fecha, hora: f.hora }} />))}
        </ul>
      ) : (
        <p className="px-5 py-10 text-center text-sm">No hay citas en esta vista.</p>
      )}
    </section>
  );
}
