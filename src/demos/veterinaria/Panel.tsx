import { useState } from "react";
import { BellRing, PawPrint, Scissors, Stethoscope, Syringe, UserPlus, Wallet } from "lucide-react";
import { AREAS, ESTACIONES, ESTADOS, IDS_ESTACION, IDS_ESTADO, METODOS, PRODUCTOS, SERVICIOS, fechaCorta, fechaLarga, hora12, hoyIso, qz, type Area, type Cita, type Estado, type Metodo } from "./datos";
import type { ClinicaViva, PorCobrar } from "./estado";
import { Retrato } from "./Piezas";
import { CitaGrooming, PacienteNuevo, Recordatorios, VacunaAplicada } from "./VentanasPanel";

export type Dia = "hoy" | "proximas";
type Atajo = "paciente" | "grooming" | "recordatorios" | "vacuna" | null;

const ATAJOS = [
  { id: "paciente", texto: "Registrar paciente nuevo", icono: UserPlus },
  { id: "grooming", texto: "Nueva cita de grooming", icono: Scissors },
  { id: "recordatorios", texto: "Enviar recordatorios de vacunas por WhatsApp", icono: BellRing },
] as const;

const PESTANAS: { id: Area | "todos"; nombre: string }[] = [
  { id: "todos", nombre: "Todos" },
  { id: "consulta", nombre: AREAS.consulta.nombre },
  { id: "grooming", nombre: AREAS.grooming.nombre },
];

function Fila({ clinica, cita, alEstado }: { clinica: ClinicaViva; cita: Cita; alEstado: (c: Cita, e: Estado) => void }) {
  const mascota = clinica.mascota(cita.mascotaId);
  if (!mascota) return null;
  const servicio = SERVICIOS[cita.servicio];
  const futura = cita.fecha > hoyIso();
  const Icono = servicio.area === "grooming" ? Scissors : Stethoscope;

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-5 py-3 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.1fr)_4rem_11.5rem]">
      <p className="col-span-2 text-sm font-extrabold tabular-nums text-[#0F172A] md:col-span-1">
        {hora12(cita.hora)}
        {futura && <span className="ml-2 text-xs font-bold text-[#0F766E] md:ml-0 md:block">{fechaCorta(cita.fecha).replace(/ \d{4}$/, "")}</span>}
      </p>
      <div className="flex min-w-0 items-center gap-2.5">
        <Retrato mascota={mascota} className="size-10" />
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 text-sm font-extrabold text-[#0F172A]">
            {mascota.nombre}
            {cita.desdeWeb && <span className="hv-chip hv-chip-pronto">Web</span>}
          </p>
          <p className="truncate text-xs text-[#64748B]">{mascota.dueno}</p>
        </div>
      </div>
      <p className="order-last col-span-2 flex min-w-0 items-start gap-1.5 text-xs font-semibold leading-snug md:order-none md:col-span-1">
        <Icono size={14} aria-hidden className="mt-0.5 shrink-0 text-[#0D9488]" />
        {servicio.nombre}
      </p>
      <p className="text-right text-sm font-extrabold tabular-nums text-[#0F172A]">{qz(servicio.precio)}</p>
      <div className="order-last col-span-2 min-w-0 md:col-span-1">
        <select
          aria-label={`Estado de ${mascota.nombre}`}
          value={cita.estado}
          disabled={futura || Boolean(cita.cobro)}
          onChange={(e) => alEstado(cita, e.target.value as Estado)}
          data-estado={cita.estado}
          className="hv-campo hv-estado !h-11 !px-2.5 !text-[0.8rem]"
        >
          {IDS_ESTADO.map((e) => (
            <option key={e} value={e}>
              {ESTADOS[e].panel}
              {e === "entregada" && cita.cobro ? " · cobrada" : ""}
            </option>
          ))}
        </select>
      </div>
    </li>
  );
}

function Agenda({ clinica, dia, alDia, alEstado }: { clinica: ClinicaViva; dia: Dia; alDia: (d: Dia) => void; alEstado: (c: Cita, e: Estado) => void }) {
  const [area, setArea] = useState<Area | "todos">("todos");
  const base = dia === "hoy" ? clinica.citasHoy : clinica.proximas;
  const visibles = base.filter((c) => area === "todos" || SERVICIOS[c.servicio].area === area);

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
      <div role="group" aria-label="Filtrar por área" className="flex flex-wrap gap-2 border-b border-[#E2E8F0] px-5 py-4">
        {PESTANAS.map((p) => (
          <button key={p.id} type="button" aria-pressed={area === p.id} onClick={() => setArea(p.id)} className="hv-pildora">
            {p.nombre} <span className="tabular-nums opacity-70">{base.filter((c) => p.id === "todos" || SERVICIOS[c.servicio].area === p.id).length}</span>
          </button>
        ))}
      </div>
      {visibles.length ? (
        <ul className="divide-y divide-[#F1F5F9]">
          {visibles.map((c) => (
            <Fila key={c.id} clinica={clinica} cita={c} alEstado={alEstado} />
          ))}
        </ul>
      ) : (
        <p className="px-5 py-10 text-center text-sm">No hay citas en esta vista.</p>
      )}
    </section>
  );
}

function Estaciones({ clinica, alEstado }: { clinica: ClinicaViva; alEstado: (c: Cita, e: Estado) => void }) {
  return (
    <section aria-labelledby="hv-estaciones" className="hv-tarjeta p-5">
      <h2 id="hv-estaciones" className="text-lg font-extrabold">Estaciones activas</h2>
      <ul className="mt-3 grid gap-2.5">
        {IDS_ESTACION.map((id) => {
          const dentro = clinica.citasHoy.filter((c) => c.estado === "atencion" && c.estacion === id);
          return (
            <li key={id} className={`rounded-2xl border p-3 ${dentro.length ? "border-[#FDBA74] bg-[#FFF7ED]" : "border-[#E2E8F0] bg-[#F8FAFC]"}`}>
              <p className="flex items-center justify-between gap-2 text-sm font-extrabold text-[#0F172A]">
                {ESTACIONES[id].nombre}
                <span className={`hv-chip ${dentro.length ? "hv-chip-pronto" : "hv-chip-bien"}`}>
                  {ESTACIONES[id].cupo > 1 ? `${dentro.length} de ${ESTACIONES[id].cupo}` : dentro.length ? "En uso" : "Libre"}
                </span>
              </p>
              {dentro.map((c) => {
                const mascota = clinica.mascota(c.mascotaId);
                return (
                  <div key={c.id} className="mt-2 flex items-center gap-2">
                    <p className="min-w-0 flex-1 text-xs leading-snug">
                      <span className="block font-extrabold text-[#0F172A]">{mascota?.nombre}</span>
                      {SERVICIOS[c.servicio].nombre}
                    </p>
                    <button type="button" onClick={() => alEstado(c, "lista")} aria-label={`Marcar lista a ${mascota?.nombre}`} className="hv-boton hv-linea !px-3 !text-xs">
                      Marcar lista
                    </button>
                  </div>
                );
              })}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Cuenta({ clinica, pendiente, alAvisar }: { clinica: ClinicaViva; pendiente: PorCobrar; alAvisar: (texto: string) => void }) {
  const [metodo, setMetodo] = useState<Metodo>("Efectivo");
  const conceptos = [
    ...pendiente.citas.map((c) => ({ id: c.id, texto: `${clinica.mascota(c.mascotaId)?.nombre} · ${SERVICIOS[c.servicio].nombre}`, monto: SERVICIOS[c.servicio].precio })),
    ...pendiente.cargos.map((c) => {
      const producto = PRODUCTOS.find((p) => p.id === c.productoId);
      return { id: c.id, texto: producto?.nombre ?? "", monto: producto?.precio ?? 0 };
    }),
  ];

  return (
    <li className="rounded-2xl border border-[#E2E8F0] p-3">
      <p className="flex justify-between gap-3 text-sm font-extrabold text-[#0F172A]">
        <span className="min-w-0">{pendiente.dueno}</span>
        <span className="tabular-nums">{qz(pendiente.total)}</span>
      </p>
      <ul className="mt-1.5 grid gap-1 text-xs">
        {conceptos.map((c) => (
          <li key={c.id} className="flex justify-between gap-3">
            <span className="min-w-0">{c.texto}</span>
            <span className="tabular-nums">{qz(c.monto)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex gap-2">
        <select aria-label={`Forma de pago de ${pendiente.dueno}`} value={metodo} onChange={(e) => setMetodo(e.target.value as Metodo)} className="hv-campo !h-11 flex-1 !px-2.5 !text-[0.8rem]">
          {METODOS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            clinica.cobrar(pendiente.dueno, metodo);
            alAvisar(`Cobrado ${qz(pendiente.total)} a ${pendiente.dueno} · ${metodo}.`);
          }}
          className="hv-boton hv-turquesa"
        >
          Cobrar
        </button>
      </div>
    </li>
  );
}

export function Panel({ clinica, dia, alDia, alAvisar }: { clinica: ClinicaViva; dia: Dia; alDia: (d: Dia) => void; alAvisar: (texto: string, alerta?: boolean) => void }) {
  const [atajo, setAtajo] = useState<Atajo>(null);
  const kpis = [
    { texto: "Pacientes hoy", valor: String(clinica.kpis.pacientes), icono: PawPrint },
    { texto: "En grooming ahora", valor: String(clinica.kpis.enGrooming), icono: Scissors },
    { texto: "Ingresos del día", valor: qz(clinica.kpis.ingresos), icono: Wallet },
    { texto: "Vacunas por vencer esta semana", valor: String(clinica.porVencer.length), icono: Syringe },
  ];
  const ventana = { clinica, alAvisar, alCerrar: () => setAtajo(null) };

  function cambiarEstado(cita: Cita, estado: Estado) {
    const nombre = clinica.mascota(cita.mascotaId)?.nombre;
    if (!clinica.cambiarEstado(cita.id, estado)) {
      const lleno = SERVICIOS[cita.servicio].area === "grooming" ? "La estación de grooming está llena" : "Los dos consultorios están ocupados";
      alAvisar(`${lleno}. Marca una mascota como lista primero.`, true);
      return;
    }
    alAvisar(`${nombre}: ${ESTADOS[estado].panel.toLowerCase()}.`);
  }

  return (
    <div className="hv-ancho !max-w-[90rem] py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Panel Veterinaria</h1>
          <p className="text-sm first-letter:uppercase">{fechaLarga(hoyIso())}</p>
        </div>
        <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap">
          {ATAJOS.map(({ id, texto, icono: Icono }, i) => (
            <button key={id} type="button" onClick={() => setAtajo(id)} className={`hv-boton ${i === 0 ? "hv-turquesa" : "hv-linea"}`}>
              <Icono size={17} aria-hidden className="shrink-0" /> {texto}
            </button>
          ))}
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-6">
        {kpis.map(({ texto, valor, icono: Icono }) => (
          <div key={texto} className="min-w-0 rounded-2xl bg-[#F0FDFA] p-4 xl:p-5">
            <dt className="flex items-start justify-between gap-2 text-xs font-bold leading-snug text-[#475569]">
              {texto}
              <Icono size={17} aria-hidden className="shrink-0 text-[#0D9488]" />
            </dt>
            <dd className="mt-1 text-3xl font-extrabold tabular-nums text-[#0F172A]">{valor}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <Agenda clinica={clinica} dia={dia} alDia={alDia} alEstado={cambiarEstado} />
        </div>
        <aside aria-label="Estaciones y cobro" className="grid min-w-0 content-start gap-4 xl:sticky xl:top-20 xl:col-span-4 xl:max-h-[calc(100dvh-6rem)] xl:self-start xl:overflow-y-auto">
          <Estaciones clinica={clinica} alEstado={cambiarEstado} />
          <button type="button" onClick={() => setAtajo("vacuna")} className="hv-boton hv-turquesa min-h-12">
            <Syringe size={18} aria-hidden /> Registrar vacuna aplicada
          </button>
          <section aria-labelledby="hv-cobro" className="hv-tarjeta p-5">
            <h2 id="hv-cobro" className="text-lg font-extrabold">Cobro rápido</h2>
            {clinica.porCobrar.length ? (
              <ul className="mt-3 grid gap-2.5">
                {clinica.porCobrar.map((p) => (
                  <Cuenta key={p.dueno} clinica={clinica} pendiente={p} alAvisar={alAvisar} />
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm">Nada pendiente de cobro.</p>
            )}
          </section>
        </aside>
      </div>

      {atajo === "paciente" && <PacienteNuevo {...ventana} />}
      {atajo === "grooming" && <CitaGrooming {...ventana} />}
      {atajo === "recordatorios" && <Recordatorios {...ventana} />}
      {atajo === "vacuna" && <VacunaAplicada {...ventana} />}
    </div>
  );
}
