import { Clock3, CreditCard, MapPin, ShieldCheck } from "lucide-react";
import { ASEGURADORAS, EQUIPOS, FOTOS, SEDE, qz } from "./datos";
import { Foto } from "./Piezas";

export function Tecnologia() {
  return (
    <section id="tecnologia" className="cv-seccion">
      <div className="cv-ancho">
        <h2 className="text-3xl sm:text-4xl">Tecnología de diagnóstico</h2>
        <p className="mt-2 max-w-2xl">Tres estudios que se hacen en la clínica y quedan guardados en tu expediente.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {EQUIPOS.map((e) => (
            <article key={e.nombre} className="cv-tarjeta flex flex-col overflow-hidden">
              <Foto id={e.foto} alt={e.alt} ancho={720} alto={480} className="aspect-[3/2] h-auto w-full" />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl">{e.nombre}</h3>
                <p className="mt-2 text-sm">{e.detalle}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5">
                  <p className="text-xs font-bold text-[#475569]">{e.dato}</p>
                  <p className="text-lg font-extrabold tabular-nums text-[#B45309]">{qz(e.precio)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SedesSeguros() {
  return (
    <section id="sedes-seguros" className="cv-seccion bg-[#F1F5F9]">
      <div className="cv-ancho">
        <h2 className="text-3xl sm:text-4xl">Sedes y seguros</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="grid content-start gap-6">
            <div className="cv-tarjeta p-6">
              <h3 className="flex items-center gap-2.5 text-xl">
                <ShieldCheck size={20} aria-hidden className="shrink-0 text-[#1E3A8A]" /> Seguros médicos afiliados
              </h3>
              <ul className="mt-4 grid grid-cols-2 gap-3">
                {ASEGURADORAS.map((a) => (
                  <li key={a} className="rounded-xl border border-[#E2E8F0] bg-[#FAFAFA] px-3 py-4 text-center text-base font-extrabold text-[#0F172A]">
                    {a}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm">Presenta tu carné y DPI en recepción. La cobertura depende de tu póliza.</p>
              <p className="mt-3 flex gap-2.5 border-t border-[#E2E8F0] pt-3 text-sm font-semibold text-[#334155]">
                <CreditCard size={18} aria-hidden className="mt-0.5 shrink-0 text-[#1E3A8A]" />
                Pago particular con tarjeta por Visanet o NeoNet, o por transferencia a BI o BAC.
              </p>
            </div>

            <div className="cv-tarjeta grid gap-4 p-6 sm:grid-cols-2">
              <div className="min-w-0">
                <h3 className="flex items-center gap-2.5 text-xl">
                  <MapPin size={20} aria-hidden className="shrink-0 text-[#1E3A8A]" /> Zona 10
                </h3>
                <p className="mt-2 text-sm">{SEDE.direccion}</p>
                <a href={SEDE.mapa} target="_blank" rel="noopener noreferrer" className="cv-boton cv-linea mt-4">
                  Ver en el mapa
                </a>
              </div>
              <div className="min-w-0">
                <h3 className="flex items-center gap-2.5 text-xl">
                  <Clock3 size={20} aria-hidden className="shrink-0 text-[#1E3A8A]" /> Horarios
                </h3>
                <dl className="mt-2 grid gap-1.5 text-sm">
                  {SEDE.horarios.map(([dia, horas]) => (
                    <div key={dia} className="flex justify-between gap-3">
                      <dt>{dia}</dt>
                      <dd className="font-bold tabular-nums text-[#0F172A]">{horas}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
          <Foto id={FOTOS.optica} alt="Paciente probándose unos aros frente a la exhibición de la óptica" ancho={900} alto={900} className="aspect-square h-full w-full rounded-3xl lg:aspect-auto" />
        </div>
      </div>
    </section>
  );
}
