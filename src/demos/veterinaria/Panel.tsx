import { useState } from "react";
import { BellRing, PawPrint, Scissors, Syringe, UserPlus, Wallet } from "lucide-react";
import { Agenda, type Dia } from "./AgendaDelDia";
import { Bandeja } from "./Bandeja";
import { CobroRapido } from "./Cobro";
import { ESTADOS, SERVICIOS, fechaLarga, hoyIso, qz, type Cita, type Estado } from "./datos";
import { Estaciones } from "./Estaciones";
import type { ClinicaViva } from "./estado";
import { RegistroClinico } from "./RegistroClinico";
import { CitaGrooming, PacienteNuevo, ProponerHora, Recordatorios } from "./VentanasPanel";

type Pestana = "solicitudes" | "estaciones" | "cobro";
type Abierta = { tipo: "paciente" | "grooming" | "recordatorios" } | { tipo: "registro"; mascotaId?: string } | { tipo: "proponer"; cita: Cita } | null;

const ATAJOS = [
  { id: "paciente", texto: "Registrar paciente nuevo", icono: UserPlus },
  { id: "grooming", texto: "Nueva cita de grooming", icono: Scissors },
  { id: "recordatorios", texto: "Enviar recordatorios de vacunas por WhatsApp", icono: BellRing },
] as const;

export function Panel({ clinica, dia, alDia, alAvisar }: { clinica: ClinicaViva; dia: Dia; alDia: (d: Dia) => void; alAvisar: (texto: string, alerta?: boolean) => void }) {
  const [abierta, setAbierta] = useState<Abierta>(null);
  const [pestana, setPestana] = useState<Pestana>(() => (clinica.porAtender ? "solicitudes" : "estaciones"));
  const kpis = [
    { texto: "Pacientes hoy", valor: String(clinica.kpis.pacientes), icono: PawPrint },
    { texto: "En grooming ahora", valor: String(clinica.kpis.enGrooming), icono: Scissors },
    { texto: "Ingresos del día", valor: qz(clinica.kpis.ingresos), icono: Wallet },
    { texto: "Vacunas por vencer esta semana", valor: String(clinica.porVencer.length), icono: Syringe },
  ];
  const pestanas: { id: Pestana; nombre: string; cuenta: number }[] = [
    { id: "solicitudes", nombre: "Solicitudes", cuenta: clinica.porAtender },
    { id: "estaciones", nombre: "Estaciones", cuenta: 0 },
    { id: "cobro", nombre: "Cobro", cuenta: clinica.porCobrar.length },
  ];
  const ventana = { clinica, alAvisar, alCerrar: () => setAbierta(null) };

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
            <button key={id} type="button" onClick={() => setAbierta({ tipo: id })} className={`hv-boton ${i === 0 ? "hv-turquesa" : "hv-linea"}`}>
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
        <div className="order-2 min-w-0 xl:order-1 xl:col-span-8">
          <Agenda clinica={clinica} dia={dia} alDia={alDia} alEstado={cambiarEstado} />
        </div>
        <aside aria-label="Solicitudes, estaciones y cobro" className="order-1 flex min-w-0 flex-col gap-3 xl:sticky xl:top-20 xl:order-2 xl:col-span-4 xl:max-h-[calc(100dvh-6rem)] xl:self-start">
          <div role="group" aria-label="Panel lateral" className="grid grid-cols-3 gap-1 rounded-full border border-[#E2E8F0] bg-white p-1">
            {pestanas.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={pestana === p.id}
                onClick={() => setPestana(p.id)}
                className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-full px-1 text-xs font-extrabold sm:text-sm ${pestana === p.id ? "bg-[#0F172A] text-white" : "text-[#334155] hover:bg-[#F0FDFA]"}`}
              >
                {p.nombre}
                {p.cuenta > 0 && <span className="hv-cuenta">{p.cuenta}</span>}
              </button>
            ))}
          </div>
          <div className="min-h-0 overflow-y-auto rounded-[1.25rem]">
            {pestana === "solicitudes" && <Bandeja clinica={clinica} alAvisar={alAvisar} alProponer={(cita) => setAbierta({ tipo: "proponer", cita })} />}
            {pestana === "estaciones" && <Estaciones clinica={clinica} alEstado={cambiarEstado} alRegistrar={(mascotaId) => setAbierta({ tipo: "registro", mascotaId })} />}
            {pestana === "cobro" && <CobroRapido clinica={clinica} alAvisar={alAvisar} />}
          </div>
        </aside>
      </div>

      {abierta?.tipo === "paciente" && <PacienteNuevo {...ventana} />}
      {abierta?.tipo === "grooming" && <CitaGrooming {...ventana} />}
      {abierta?.tipo === "recordatorios" && <Recordatorios {...ventana} />}
      {abierta?.tipo === "registro" && <RegistroClinico {...ventana} mascotaInicial={abierta.mascotaId} />}
      {abierta?.tipo === "proponer" && <ProponerHora {...ventana} cita={abierta.cita} />}
    </div>
  );
}
