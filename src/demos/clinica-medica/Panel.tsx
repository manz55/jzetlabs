import { useState } from "react";
import { CalendarPlus, FlaskConical, MessageCircle, ShieldCheck, Stethoscope, TestTubes, Wallet } from "lucide-react";
import { AgendaDelDia, type Dia } from "./AgendaDelDia";
import { fechaLarga, hoyIso, qz, type Cita } from "./datos";
import type { Altamira } from "./estado";
import { Publicar, type Modo } from "./Publicar";
import { Cobrar, EnviarResultados, IngresarMuestra, NuevaCita } from "./VentanasPanel";

type Abierta = { tipo: "cita" | "muestra" | "enviar" } | { tipo: "cobro"; cita: Cita } | null;

type Props = {
  clinica: Altamira;
  dia: Dia;
  alDia: (d: Dia) => void;
  resaltada: string;
  alResaltar: (cita: Cita) => void;
  alAvisar: (texto: string, alerta?: boolean) => void;
  alPublicado: (texto: string, pacienteId: string) => void;
};

export function Panel({ clinica, dia, alDia, resaltada, alResaltar, alAvisar, alPublicado }: Props) {
  const [abierta, setAbierta] = useState<Abierta>(null);
  const [modo, setModo] = useState<Modo>("resultado");
  const ventana = { clinica, alAvisar, alCerrar: () => setAbierta(null) };
  const kpis = [
    { texto: "Consultas hoy", valor: String(clinica.kpis.consultas), icono: Stethoscope },
    { texto: "Muestras en laboratorio", valor: String(clinica.kpis.muestras), icono: FlaskConical },
    { texto: "Cobrado hoy", valor: qz(clinica.kpis.cobrado), icono: Wallet },
    { texto: "Pendiente por seguro", valor: qz(clinica.kpis.porSeguro), icono: ShieldCheck },
  ];

  return (
    <div className="cm-ancho !max-w-[92rem] py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Panel Médico y Caja</h1>
          <p className="text-sm first-letter:uppercase">{fechaLarga(hoyIso())}</p>
        </div>
        <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap">
          <button type="button" onClick={() => setAbierta({ tipo: "cita" })} className="cm-boton cm-azul">
            <CalendarPlus size={17} aria-hidden className="shrink-0" /> Nueva cita en recepción
          </button>
          <button type="button" onClick={() => setAbierta({ tipo: "muestra" })} className="cm-boton cm-linea">
            <TestTubes size={17} aria-hidden className="shrink-0" /> Ingresar muestra de laboratorio
          </button>
          <button type="button" onClick={() => setAbierta({ tipo: "enviar" })} className="cm-boton cm-linea">
            <MessageCircle size={17} aria-hidden className="shrink-0 text-[#15803D]" /> Enviar resultados listos por WhatsApp
            {clinica.porEnviar.length > 0 && <span className="cm-estado cm-listo !px-2 !py-0">{clinica.porEnviar.length}</span>}
          </button>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-6">
        {kpis.map(({ texto, valor, icono: Icono }) => (
          <div key={texto} className="min-w-0 rounded-2xl bg-[#EFF6FF] p-4 xl:p-5">
            <dt className="flex items-start justify-between gap-2 text-xs font-bold leading-snug text-[#475569]">
              {texto}
              <Icono size={17} aria-hidden className="shrink-0 text-[#1D4ED8]" />
            </dt>
            <dd className="mt-1 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">{valor}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <AgendaDelDia clinica={clinica} dia={dia} alDia={alDia} resaltada={resaltada} alCobrar={(cita) => setAbierta({ tipo: "cobro", cita })} alAvisar={alAvisar} />
        </div>
        <div className="min-w-0 xl:sticky xl:top-20 xl:col-span-4 xl:max-h-[calc(100dvh-6rem)] xl:self-start xl:overflow-y-auto xl:rounded-[1.1rem]">
          <Publicar clinica={clinica} modo={modo} alModo={setModo} alPublicar={alPublicado} />
        </div>
      </div>

      {abierta?.tipo === "cita" && <NuevaCita {...ventana} alCreada={alResaltar} />}
      {abierta?.tipo === "muestra" && <IngresarMuestra {...ventana} />}
      {abierta?.tipo === "enviar" && <EnviarResultados {...ventana} />}
      {abierta?.tipo === "cobro" && <Cobrar {...ventana} cita={abierta.cita} />}
    </div>
  );
}
