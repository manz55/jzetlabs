import { FilePlus2, TriangleAlert } from "lucide-react";
import { ESTACIONES, EXTRAS, IDS_ESTACION, SERVICIOS, type Cita, type Estado } from "./datos";
import type { ClinicaViva } from "./estado";

type Props = { clinica: ClinicaViva; alEstado: (c: Cita, e: Estado) => void; alRegistrar: (mascotaId?: string) => void };

export function Estaciones({ clinica, alEstado, alRegistrar }: Props) {
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
                  <div key={c.id} className="mt-2.5 border-t border-[#FED7AA] pt-2.5">
                    <p className="text-xs leading-snug">
                      <span className="block text-sm font-extrabold text-[#0F172A]">{mascota?.nombre}</span>
                      {SERVICIOS[c.servicio].nombre}
                      {c.extras?.map((e) => ` + ${EXTRAS[e].nombre.toLowerCase()}`)}
                    </p>
                    {mascota?.notas && (
                      <p className="mt-1 flex gap-1.5 text-xs font-bold text-[#9A3412]">
                        <TriangleAlert size={13} aria-hidden className="mt-0.5 shrink-0" /> {mascota.notas}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button type="button" onClick={() => alRegistrar(c.mascotaId)} aria-label={`Registrar vacuna o receta a ${mascota?.nombre}`} className="hv-boton hv-turquesa flex-1 !px-3 !text-xs">
                        Registrar vacuna / receta
                      </button>
                      <button type="button" onClick={() => alEstado(c, "lista")} aria-label={`Marcar lista a ${mascota?.nombre}`} className="hv-boton hv-linea !px-3 !text-xs">
                        Marcar lista
                      </button>
                    </div>
                  </div>
                );
              })}
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={() => alRegistrar()} className="hv-boton hv-linea mt-3 w-full">
        <FilePlus2 size={17} aria-hidden /> Registrar a otro paciente
      </button>
    </section>
  );
}
