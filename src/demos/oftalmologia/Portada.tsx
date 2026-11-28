import type { ReactNode } from "react";
import { CalendarCheck, Clock3, ScanEye, Zap } from "lucide-react";
import { cuando } from "./agenda";
import { ESPECIALIDADES, FOTOS, SERVICIOS, qz, textoPago, type Cita } from "./datos";
import type { ClinicaViva } from "./estado";
import { Foto } from "./Piezas";

const CREDENCIALES = [
  { icono: ScanEye, texto: "Examen visual computarizado" },
  { icono: Zap, texto: "Cirugía láser y cataratas" },
  { icono: Clock3, texto: "Entrega de lentes en 24–48 h" },
];

export function Hero({ agendador }: { agendador: ReactNode }) {
  return (
    <section className="bg-gradient-to-b from-[#F1F5F9] to-[#FAFAFA] pb-14 pt-8 lg:pb-20 lg:pt-12">
      <div className="cv-ancho grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:grid-rows-[auto_1fr] lg:gap-x-12">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#B45309]">Clínica oftalmológica y óptica boutique en zona 10</p>
          <h1 className="mt-3 text-balance text-[1.75rem] leading-[1.18] sm:text-[2.4rem] xl:text-[2.65rem]">
            Diagnóstico oftalmológico de alta precisión y óptica especializada con tu graduación digital siempre disponible
          </h1>
          <ul className="mt-5 grid gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3">
            {CREDENCIALES.map(({ icono: Icono, texto }) => (
              <li key={texto} className="cv-tarjeta flex items-center gap-3 px-4 py-2.5 sm:p-4">
                <Icono size={22} aria-hidden className="shrink-0 text-[#1E3A8A]" />
                <span className="text-sm font-bold leading-snug text-[#0F172A]">{texto}</span>
              </li>
            ))}
          </ul>
        </div>
        <div id="agendar" className="min-w-0 scroll-mt-36 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:scroll-mt-24">
          {agendador}
        </div>
        <Foto id={FOTOS.portada} alt="Oftalmólogo examinando a una paciente con lámpara de hendidura" ancho={1200} alto={760} prioridad className="aspect-[30/19] h-auto w-full rounded-3xl lg:col-start-1" />
      </div>
    </section>
  );
}

export function CitaRegistrada({ clinica, cita, alVerReceta, alVerPanel, alRepetir }: { clinica: ClinicaViva; cita: Cita; alVerReceta: () => void; alVerPanel: () => void; alRepetir: () => void }) {
  return (
    <div role="status">
      <CalendarCheck size={34} aria-hidden className="text-[#1E3A8A]" />
      <h2 className="mt-3 text-2xl">Tu cita quedó registrada</h2>
      <p className="mt-1">{clinica.paciente(cita.pacienteId)?.nombre}, te esperamos en Plaza Médica, zona 10.</p>
      <dl className="mt-4 grid gap-2 rounded-2xl bg-[#F1F5F9] p-4 text-sm">
        {[
          ["Servicio", SERVICIOS[cita.servicio].nombre],
          ["Cuándo", cuando(cita)],
          ["Pago", textoPago(cita.pago)],
          ["Tarifa", qz(cita.monto)],
        ].map(([t, v]) => (
          <div key={t} className="flex justify-between gap-4">
            <dt className="font-semibold text-[#475569]">{t}</dt>
            <dd className="min-w-0 text-right font-bold tabular-nums text-[#0F172A]">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 grid gap-2">
        <button type="button" onClick={alVerReceta} className="cv-boton cv-zafiro">
          Ver en Mi Receta Visual
        </button>
        <button type="button" onClick={alVerPanel} className="cv-boton cv-linea">
          Ver cómo le llega a la clínica
        </button>
        <button type="button" onClick={alRepetir} className="min-h-11 text-sm font-bold text-[#1E3A8A] underline underline-offset-4">
          Agendar otra cita
        </button>
      </div>
    </div>
  );
}

export function Servicios({ alReservar }: { alReservar: (especialidad: (typeof ESPECIALIDADES)[number]) => void }) {
  return (
    <section id="servicios" className="cv-seccion">
      <div className="cv-ancho">
        <h2 className="text-3xl sm:text-4xl">Especialidades clínicas</h2>
        <p className="mt-2 max-w-2xl">La tarifa de tu consulta la ves antes de reservar.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <Foto id={FOTOS.especialidades} alt="Optometrista ajustando una montura de prueba durante el examen" ancho={900} alto={1000} className="aspect-[3/2] h-full w-full rounded-3xl lg:aspect-auto" />
          <ul className="cv-tarjeta divide-y divide-[#E2E8F0] px-5 sm:px-6">
            {ESPECIALIDADES.map((e) => (
              <li key={e.id} className="grid gap-4 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
                <div className="min-w-0">
                  <h3 className="text-xl">{e.nombre}</h3>
                  <p className="mt-1 text-sm">{e.detalle}</p>
                  <p className="mt-1 text-xs font-semibold text-[#475569]">{e.incluye}</p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:w-44 sm:flex-col sm:items-end sm:gap-2">
                  <p className="sm:text-right">
                    <span className="block text-xs font-semibold text-[#475569]">{SERVICIOS[e.servicio].corto}</span>
                    <span className="text-2xl font-extrabold tabular-nums text-[#0F172A]">{qz(SERVICIOS[e.servicio].precio)}</span>
                  </p>
                  <button type="button" onClick={() => alReservar(e)} className="cv-boton cv-linea whitespace-nowrap">
                    Reservar horario
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
