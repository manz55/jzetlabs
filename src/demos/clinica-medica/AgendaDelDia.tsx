import { useState } from "react";
import { CalendarClock, CircleCheck, Wallet } from "lucide-react";
import { responderCambio, cambiarEstado } from "./agenda";
import { ESTADOS, ESTADOS_POR_TIPO, MEDICOS, esExamen, fechaCorta, fechaRelativa, folioTexto, hoyIso, nombrePago, nombreServicio, precioServicio, qz, tipoDe, type Cita, type Estado, type Tipo } from "./datos";
import type { Altamira } from "./estado";

export type Dia = "hoy" | "proximas";

const PESTANAS: { id: Tipo | "todos"; nombre: string }[] = [
  { id: "todos", nombre: "Todos" },
  { id: "consulta", nombre: "Consultas" },
  { id: "laboratorio", nombre: "Laboratorio" },
];

const colorEstado: Record<Estado, string> = {
  espera: "border-[#CBD5E1] bg-white",
  consulta: "border-[#93C5FD] bg-[#EFF6FF]",
  muestra: "border-[#FCD34D] bg-[#FFFBEB]",
  finalizada: "border-[#86EFAC] bg-[#F0FDF4]",
};

type Props = {
  clinica: Altamira;
  dia: Dia;
  alDia: (d: Dia) => void;
  resaltada: string;
  alCobrar: (cita: Cita) => void;
  alAvisar: (texto: string, alerta?: boolean) => void;
};

export function AgendaDelDia({ clinica, dia, alDia, resaltada, alCobrar, alAvisar }: Props) {
  const [pestana, setPestana] = useState<Tipo | "todos">("todos");
  const base = dia === "hoy" ? clinica.citasHoy : clinica.proximas;
  const filas = base.filter((c) => pestana === "todos" || tipoDe(c.servicioId) === pestana);

  function mover(cita: Cita, estado: Estado) {
    cambiarEstado(cita.id, estado);
    if (cita.fecha > hoyIso() && estado !== "espera") alAvisar(`${clinica.paciente(cita.pacienteId)?.nombre} pasó a la agenda de hoy.`);
  }

  function responder(cita: Cita, aceptar: boolean) {
    if (!responderCambio(cita.id, aceptar)) return alAvisar("Ese horario ya no está libre. Mantenga el actual o llame al paciente.", true);
    alAvisar(aceptar ? "Cambio de hora confirmado en el portal del paciente." : "Se mantuvo el horario original.");
  }

  return (
    <section aria-labelledby="cm-agenda" className="cm-tarjeta p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="cm-agenda" className="text-xl">Agenda del Día y Órdenes de Lab</h2>
        <div role="group" aria-label="Día" className="cm-pildoras">
          {(["hoy", "proximas"] as const).map((d) => (
            <button key={d} type="button" aria-pressed={dia === d} onClick={() => alDia(d)} className="cm-pildora">
              {d === "hoy" ? "Hoy" : `Próximas (${clinica.proximas.length})`}
            </button>
          ))}
        </div>
      </div>
      <div role="group" aria-label="Tipo de atención" className="cm-pildoras mt-3">
        {PESTANAS.map((p) => (
          <button key={p.id} type="button" aria-pressed={pestana === p.id} onClick={() => setPestana(p.id)} className="cm-pildora">
            {p.nombre} ({base.filter((c) => p.id === "todos" || tipoDe(c.servicioId) === p.id).length})
          </button>
        ))}
      </div>

      {clinica.cambiosPendientes.length > 0 && (
        <ul aria-label="Solicitudes de cambio de hora" className="mt-4 grid gap-2">
          {clinica.cambiosPendientes.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#FEF3C7] p-3 text-sm text-[#78350F]">
              <p className="flex min-w-0 items-start gap-2">
                <CalendarClock size={17} aria-hidden className="mt-0.5 shrink-0" />
                <span>
                  <strong>{clinica.paciente(c.pacienteId)?.nombre}</strong> pide pasar de {fechaCorta(c.fecha)}, {c.hora} a{" "}
                  <strong>
                    {fechaCorta(c.cambio!.fecha)}, {c.cambio!.hora}
                  </strong>
                </span>
              </p>
              <span className="flex gap-2">
                <button type="button" onClick={() => responder(c, true)} className="cm-boton cm-verde !min-h-10">
                  Confirmar
                </button>
                <button type="button" onClick={() => responder(c, false)} className="cm-boton cm-linea !min-h-10">
                  Mantener hora
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {filas.length === 0 && <p className="mt-4 rounded-xl bg-[#F8FAFC] p-5 text-sm">No hay atenciones en este filtro.</p>}
      <ul className="mt-4 divide-y divide-[#E2E8F0] border-t border-[#E2E8F0]">
        {filas.map((c) => {
          const paciente = clinica.paciente(c.pacienteId);
          const tipo = tipoDe(c.servicioId);
          return (
            <li
              key={c.id}
              id={`fila-${c.id}`}
              className={`grid grid-cols-[3.75rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 py-3 md:grid-cols-[3.75rem_minmax(0,1fr)_9.5rem_10.5rem] md:gap-x-4 ${resaltada === c.id ? "rounded-xl bg-[#EFF6FF] ring-2 ring-[#1D4ED8]" : ""}`}
            >
              <p className="self-start pl-1 pt-0.5 font-extrabold text-[#0F172A] md:self-center md:pt-0">
                {c.hora}
                {dia === "proximas" && <span className="block text-[0.68rem] font-semibold leading-tight text-[#475569]">{fechaRelativa(c.fecha) === "Mañana" ? "Mañana" : fechaCorta(c.fecha).replace(/ \d{4}$/, "")}</span>}
              </p>
              <div className="min-w-0">
                <p className="truncate font-bold text-[#0F172A]">{paciente?.nombre}</p>
                <p className="text-xs leading-snug">
                  {nombreServicio(c.servicioId)} · {esExamen(c.servicioId) ? `Orden ${folioTexto(c.folio)}` : MEDICOS[c.servicioId].nombre}
                </p>
              </div>
              <div className="col-start-2 flex flex-wrap items-center gap-x-3 gap-y-1 md:col-start-auto md:block">
                <p className="text-sm font-extrabold text-[#0F172A]">
                  {qz(precioServicio(c.servicioId))} <span className="text-xs font-semibold text-[#475569]">· {nombrePago(c.pago)}</span>
                </p>
                {c.pago !== "particular" ? (
                  <p className="text-xs font-semibold text-[#92400E]">Por cobrar al seguro</p>
                ) : c.cobro ? (
                  <p className="flex items-center gap-1 text-xs font-semibold text-[#15803D]">
                    <CircleCheck size={13} aria-hidden /> {c.cobro.metodo}
                  </p>
                ) : (
                  <button type="button" onClick={() => alCobrar(c)} className="flex min-h-8 items-center gap-1 text-xs font-extrabold text-[#1D4ED8] underline underline-offset-2">
                    <Wallet size={13} aria-hidden /> Cobrar<span className="sr-only"> a {paciente?.nombre}</span>
                  </button>
                )}
              </div>
              <select
                aria-label={`Estado de ${paciente?.nombre}, ${c.hora}`}
                value={c.estado}
                disabled={Boolean(c.informe)}
                onChange={(e) => mover(c, e.target.value as Estado)}
                className={`cm-control col-start-2 !min-h-10 !text-xs !font-bold md:col-start-auto ${colorEstado[c.estado]}`}
              >
                {ESTADOS_POR_TIPO[tipo].map((estado) => (
                  <option key={estado} value={estado} disabled={tipo === "laboratorio" && estado === "finalizada" && !c.informe}>
                    {ESTADOS[estado]}
                    {tipo === "laboratorio" && estado === "finalizada" && !c.informe ? " (al publicar)" : ""}
                  </option>
                ))}
              </select>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
