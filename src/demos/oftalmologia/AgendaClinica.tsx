import { useState } from "react";
import { cuando, diaCorto, hoyIso } from "./agenda";
import { ESTADOS_CITA, ETAPAS, SERVICIOS, aroPorId, qz, textoPago, type Cita, type EstadoCita, type Etapa, type Orden } from "./datos";
import type { ClinicaViva } from "./estado";

type Pestana = "todos" | "consultas" | "ordenes";
type Fila = { tipo: "cita"; cita: Cita } | { tipo: "orden"; orden: Orden };

const PESTANAS: { id: Pestana; nombre: string }[] = [
  { id: "todos", nombre: "Todos" },
  { id: "consultas", nombre: "Consultas Médicas" },
  { id: "ordenes", nombre: "Órdenes en Taller" },
];

const esNueva = (c: Cita) => c.origen !== "agenda" && c.estado === "espera";

function ordenarFilas(clinica: ClinicaViva): Fila[] {
  const hoy = hoyIso();
  const prioridad = (f: Fila) => {
    if (f.tipo === "orden") return f.orden.entregada ? 4 : 2;
    if (f.cita.cambio || esNueva(f.cita)) return 0;
    return f.cita.fecha === hoy ? 1 : 3;
  };
  const filas: Fila[] = [...clinica.citas.map((cita) => ({ tipo: "cita" as const, cita })), ...clinica.ordenes.map((orden) => ({ tipo: "orden" as const, orden }))];
  return filas.sort((a, b) => prioridad(a) - prioridad(b));
}

type Props = {
  clinica: ClinicaViva;
  activo: string;
  alElegir: (pacienteId: string, tipo: Fila["tipo"]) => void;
  alAvisar: (texto: string, alerta?: boolean) => void;
};

export function AgendaClinica({ clinica, activo, alElegir, alAvisar }: Props) {
  const [pestana, setPestana] = useState<Pestana>("todos");
  const filas = ordenarFilas(clinica);
  const deLaPestana = (id: Pestana) => filas.filter((f) => id === "todos" || (id === "consultas" ? f.tipo === "cita" : f.tipo === "orden"));

  function cambiarCita(cita: Cita, estado: EstadoCita) {
    clinica.estadoCita(cita.id, estado);
    alAvisar(`${clinica.paciente(cita.pacienteId)?.nombre}: ${ESTADOS_CITA[estado].toLowerCase()}.`);
  }

  function cambiarOrden(orden: Orden, etapa: Etapa) {
    clinica.etapaOrden(orden.id, etapa);
    alAvisar(`${orden.id}: ${ETAPAS[etapa - 1].estado.toLowerCase()}. Ya se ve en Mi Receta Visual.`);
  }

  function confirmar(cita: Cita) {
    const destino = cuando(cita.cambio!).toLowerCase();
    if (clinica.confirmarCambio(cita.id)) alAvisar(`Cita movida a ${destino}.`);
    else alAvisar("Ese horario ya no está libre. Mantén el actual y coordina otro.", true);
  }

  return (
    <section aria-label="Agenda médica y órdenes de óptica" className="cv-tarjeta overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] p-4 sm:p-5">
        <h2 className="text-xl">Agenda médica y órdenes de óptica</h2>
        <div role="group" aria-label="Filtrar agenda" className="flex w-full min-w-0 flex-wrap gap-2 sm:w-auto">
          {PESTANAS.map((p) => (
            <button key={p.id} type="button" aria-pressed={pestana === p.id} onClick={() => setPestana(p.id)} className="cv-pildora">
              {p.nombre} <span className="tabular-nums opacity-70">{deLaPestana(p.id).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div aria-hidden className="cv-fila bg-[#F1F5F9] !py-2 text-xs font-bold text-[#475569] max-md:!hidden">
        <span>Hora / orden</span>
        <span>Paciente y detalle</span>
        <span>Pago</span>
        <span className="text-right">Monto</span>
        <span>Estado</span>
      </div>

      <ul>
        {deLaPestana(pestana).map((f) => {
          const esCita = f.tipo === "cita";
          const registro = esCita ? f.cita : f.orden;
          const nombre = clinica.paciente(registro.pacienteId)?.nombre ?? "";
          const monto = esCita ? f.cita.monto : f.orden.total;
          const saldo = esCita ? (f.cita.cobrada ? 0 : f.cita.monto) : f.orden.total - f.orden.abonado;
          return (
            <li key={registro.id} className={`cv-fila border-t border-[#E2E8F0] ${activo === registro.pacienteId ? "bg-[#EFF6FF]" : ""}`}>
              <p className="tabular-nums">
                <span className="block text-sm font-extrabold text-[#0F172A]">{esCita ? f.cita.hora : f.orden.id}</span>
                <span className="block text-xs font-semibold text-[#475569] first-letter:uppercase">{esCita ? diaCorto(f.cita.fecha) : f.orden.entregada ? "Entregada" : f.orden.etapa === 4 ? "En óptica" : `Para ${diaCorto(f.orden.entrega).toLowerCase()}`}</span>
              </p>

              <div className="min-w-0 max-md:order-first max-md:col-span-3">
                <p className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => alElegir(registro.pacienteId, f.tipo)} aria-pressed={activo === registro.pacienteId} className="min-h-8 text-left text-sm font-extrabold text-[#1E3A8A] underline-offset-4 hover:underline">
                    {nombre}
                  </button>
                  {esCita && esNueva(f.cita) && <span className="cv-chip cv-chip-pronto">{f.cita.origen === "portada" ? "Nueva en línea" : "Nueva en recepción"}</span>}
                </p>
                <p className="text-xs leading-snug">
                  {esCita
                    ? `${SERVICIOS[f.cita.servicio].corto}${f.cita.area ? ` · ${f.cita.area}` : ""}`
                    : `Aro ${aroPorId(f.orden.aroId)?.nombre} · ${f.orden.lente}`}
                </p>
                {esCita && f.cita.aros.length > 0 && <p className="text-xs font-bold text-[#92400E]">Probará: {f.cita.aros.map((a) => aroPorId(a)?.nombre).join(", ")}</p>}
                {esCita && f.cita.cambio && (
                  <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-[#FCD34D] bg-[#FFFBEB] p-2 text-xs font-bold text-[#92400E]">
                    <span className="min-w-0 flex-1">Pide cambiar a {cuando(f.cita.cambio).toLowerCase()}</span>
                    <button type="button" onClick={() => confirmar(f.cita)} className="cv-boton cv-ambar !min-h-9 !text-xs">
                      Confirmar
                    </button>
                    <button type="button" onClick={() => clinica.retirarCambio(f.cita.id)} className="cv-boton cv-linea !min-h-9 !text-xs">
                      Mantener hora
                    </button>
                  </div>
                )}
              </div>

              <p>
                <span className={`cv-chip ${registro.pago === "Particular" ? "cv-chip-neutro" : "cv-chip-seguro"}`}>{textoPago(registro.pago)}</span>
              </p>

              <p className="text-right tabular-nums">
                <span className="block text-sm font-extrabold text-[#0F172A]">{qz(monto)}</span>
                <span className={`block text-xs font-bold ${saldo ? "text-[#B45309]" : "text-[#166534]"}`}>{saldo ? (esCita ? "Por cobrar" : `Saldo ${qz(saldo)}`) : "Cobrado"}</span>
              </p>

              {f.tipo === "cita" ? (
                <select aria-label={`Estado de la consulta de ${nombre}`} value={f.cita.estado} onChange={(e) => cambiarCita(f.cita, e.target.value as EstadoCita)} data-estado={f.cita.estado} className="cv-estado max-md:col-span-3">
                  {Object.entries(ESTADOS_CITA).map(([id, texto]) => (
                    <option key={id} value={id}>
                      {texto}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  aria-label={`Estado de la orden ${f.orden.id}`}
                  value={f.orden.entregada ? "entregada" : f.orden.etapa}
                  onChange={(e) => cambiarOrden(f.orden, Number(e.target.value) as Etapa)}
                  data-estado={f.orden.entregada ? "atendida" : f.orden.etapa === 4 ? "lista" : f.orden.etapa === 1 ? "espera" : "examen"}
                  className="cv-estado max-md:col-span-3"
                >
                  {ETAPAS.map((e) => (
                    <option key={e.etapa} value={e.etapa}>
                      {e.estado}
                    </option>
                  ))}
                  {f.orden.entregada && <option value="entregada">Entregados</option>}
                </select>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
