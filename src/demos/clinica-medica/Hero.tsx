import { CircleCheck, FileText, ShieldCheck, Stethoscope } from "lucide-react";
import { solicitudVacia, type Solicitud } from "./agenda";
import { ASEGURADORAS, FOTOS, SEDE, fechaRelativa, nombrePago, nombreServicio, precioServicio, qz, type Cita } from "./datos";
import type { Altamira } from "./estado";
import { FormularioCita } from "./FormularioCita";
import { Foto } from "./Piezas";

type Props = {
  clinica: Altamira;
  solicitud: Solicitud;
  alCambiar: (s: Solicitud) => void;
  reservada: string;
  alReservar: (id: string) => void;
  alVerPortal: (cita: Cita) => void;
  alVerPanel: (cita: Cita) => void;
};

export function Hero({ clinica, solicitud, alCambiar, reservada, alReservar, alVerPortal, alVerPanel }: Props) {
  const cita = clinica.citas.find((c) => c.id === reservada);
  const metricas = [
    { dato: "6", texto: "especialidades médicas", icono: Stethoscope },
    { dato: "En línea", texto: "resultados de laboratorio", icono: FileText },
    { dato: `${ASEGURADORAS.length}`, texto: "aseguradoras en convenio", icono: ShieldCheck },
  ];

  return (
    <section className="bg-[#EFF6FF]">
      <div className="cm-ancho grid items-start gap-8 py-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12 lg:py-12">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#1D4ED8]">{SEDE.corta}</p>
          <h1 className="mt-3 text-[2.1rem] leading-[1.12] sm:text-[2.75rem] xl:text-[3.15rem]">Consultas médicas de especialidad y laboratorio clínico con resultados digitales el mismo día</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed">Agende en línea, tome sus muestras por la mañana y revise su informe y su receta desde el Portal del Paciente.</p>

          <ul className="mt-6 grid grid-cols-3 gap-3">
            {metricas.map(({ dato, texto, icono: Icono }) => (
              <li key={texto} className="min-w-0 rounded-2xl bg-white p-3 sm:p-4">
                <Icono size={18} aria-hidden className="text-[#1D4ED8]" />
                <p className="mt-2 text-xl font-extrabold leading-none text-[#0F172A] sm:text-2xl">{dato}</p>
                <p className="mt-1 text-xs font-semibold leading-snug text-[#475569]">{texto}</p>
              </li>
            ))}
          </ul>

          <Foto id={FOTOS.portada} alt="Doctora conversando con un paciente en su consultorio" ancho={900} alto={440} prioridad className="mt-6 hidden aspect-[900/440] w-full rounded-2xl lg:block" />
        </div>

        <div id="agendar" className="cm-tarjeta scroll-mt-32 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,.45)] sm:p-6 lg:scroll-mt-20">
          {cita ? (
            <div role="status">
              <p className="cm-estado cm-listo">
                <CircleCheck size={14} aria-hidden /> Cita registrada
              </p>
              <h2 className="mt-3 text-2xl">{clinica.paciente(cita.pacienteId)?.nombre}</h2>
              <dl className="mt-4 divide-y divide-[#DBE4F0] text-sm">
                {[
                  ["Servicio", nombreServicio(cita.servicioId)],
                  ["Fecha y hora", `${fechaRelativa(cita.fecha)}, ${cita.hora}`],
                  ["Forma de pago", nombrePago(cita.pago)],
                  ["Tarifa", qz(precioServicio(cita.servicioId))],
                  ["Lugar", SEDE.corta],
                ].map(([nombre, valor]) => (
                  <div key={nombre} className="flex justify-between gap-4 py-2.5">
                    <dt className="shrink-0">{nombre}</dt>
                    <dd className="min-w-0 text-right font-bold text-[#0F172A] first-letter:uppercase">{valor}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={() => alVerPortal(cita)} className="cm-boton cm-azul">
                  Ver en mi portal
                </button>
                <button type="button" onClick={() => alVerPanel(cita)} className="cm-boton cm-linea">
                  Ver en la agenda
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  alCambiar(solicitudVacia());
                  alReservar("");
                }}
                className="mt-2 min-h-11 w-full text-sm font-bold text-[#1D4ED8] underline underline-offset-4"
              >
                Agendar otra cita
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl">Agende su cita</h2>
              <p className="mb-4 mt-1 text-sm">Elija el servicio, el día y la hora.</p>
              <FormularioCita clinica={clinica} solicitud={solicitud} alCambiar={alCambiar} alReservar={(c) => alReservar(c.id)} enPortal accion="Confirmar cita" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
