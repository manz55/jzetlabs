import type { ClinicaViva } from "./estado";
import { TarjetaGraduacion } from "./Graduacion";
import { ProximaCita, SeguimientoTaller } from "./Seguimiento";

type Props = {
  clinica: ClinicaViva;
  activo: string;
  alElegir: (id: string) => void;
  alAvisar: (texto: string, alerta?: boolean) => void;
  alAgendar: () => void;
};

export function MiReceta({ clinica, activo, alElegir, alAvisar, alAgendar }: Props) {
  const paciente = clinica.paciente(activo) ?? clinica.pacientes[0];
  const visibles = clinica.pacientes.filter((p) => p.portal || p.id === paciente.id);
  return (
    <div className="cv-ancho py-6 lg:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl">Mi Receta Visual</h1>
        <div role="group" aria-label="Paciente activo" className="flex w-full min-w-0 flex-wrap gap-2 sm:w-auto">
          {visibles.map((p) => (
            <button key={p.id} type="button" aria-pressed={p.id === paciente.id} onClick={() => alElegir(p.id)} className="cv-pildora">
              {p.nombre}
              {p.edad ? ` · ${p.edad} años` : ""}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="grid min-w-0 content-start gap-6 xl:col-span-8">
          <TarjetaGraduacion paciente={paciente} alAvisar={alAvisar} />
          <SeguimientoTaller clinica={clinica} pacienteId={paciente.id} />
        </div>
        <aside className="min-w-0 xl:sticky xl:top-20 xl:col-span-4 xl:self-start">
          <ProximaCita key={paciente.id} clinica={clinica} pacienteId={paciente.id} alAgendar={alAgendar} />
        </aside>
      </div>
    </div>
  );
}
