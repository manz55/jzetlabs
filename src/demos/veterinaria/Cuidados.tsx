import { useState, type FormEvent } from "react";
import { NotebookPen, Pill, TriangleAlert } from "lucide-react";
import { colegiadoDe, fechaCorta, hoyIso, type Mascota } from "./datos";
import type { ClinicaViva } from "./estado";

export function Recetas({ mascota }: { mascota: Mascota }) {
  const activas = mascota.indicaciones.filter((i) => i.hasta >= hoyIso());

  return (
    <section aria-labelledby="hv-recetas" className="hv-tarjeta p-5 sm:p-6">
      <h2 id="hv-recetas" className="flex items-center gap-2 text-lg font-extrabold">
        <Pill size={20} aria-hidden className="shrink-0 text-[#0D9488]" /> Recetas e indicaciones activas
      </h2>
      {activas.length ? (
        <ul aria-live="polite" className="mt-4 grid gap-3">
          {activas.map((i) => (
            <li key={i.id} className="rounded-2xl border border-[#E2E8F0] p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-base font-extrabold">{i.medicamento}</h3>
                <span className="hv-chip hv-chip-bien">Hasta el {fechaCorta(i.hasta).replace(/ \d{4}$/, "")}</span>
              </div>
              <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-bold text-[#64748B]">Dosis</dt>
                  <dd className="font-bold text-[#0F172A]">{i.dosis}</dd>
                </div>
                {i.cuidados && (
                  <div>
                    <dt className="text-xs font-bold text-[#64748B]">Cuidados</dt>
                    <dd>{i.cuidados}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-3 border-t border-[#F1F5F9] pt-2 text-xs text-[#64748B]">
                {i.medico} · Colegiado {colegiadoDe(i.medico)} · {fechaCorta(i.fecha)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm">Sin indicaciones activas. Aquí aparece lo que el médico recete en la próxima consulta.</p>
      )}
    </section>
  );
}

export function Notas({ clinica, mascota, alAvisar }: { clinica: ClinicaViva; mascota: Mascota; alAvisar: (texto: string) => void }) {
  const [borrador, setBorrador] = useState<string | null>(null);

  function guardar(e: FormEvent) {
    e.preventDefault();
    clinica.guardarNotas(mascota.id, borrador ?? "");
    setBorrador(null);
    alAvisar(`Nota de ${mascota.nombre} guardada. La clínica ya la ve.`);
  }

  return (
    <section aria-labelledby="hv-notas" className="hv-tarjeta p-5 sm:p-6">
      <h2 id="hv-notas" className="flex items-center gap-2 text-lg font-extrabold">
        <NotebookPen size={20} aria-hidden className="shrink-0 text-[#0D9488]" /> Alergias y notas de manejo
      </h2>
      {borrador === null ? (
        <>
          {mascota.notas ? (
            <p className="mt-3 flex gap-2.5 rounded-2xl bg-[#FFF7ED] p-4 text-sm font-bold text-[#9A3412]">
              <TriangleAlert size={17} aria-hidden className="mt-0.5 shrink-0" />
              <span className="min-w-0 whitespace-pre-line break-words">{mascota.notas}</span>
            </p>
          ) : (
            <p className="mt-3 text-sm">Cuéntanos si tiene alergias o algo que debamos saber antes de atender.</p>
          )}
          <button type="button" onClick={() => setBorrador(mascota.notas)} className="hv-boton hv-linea mt-3">
            {mascota.notas ? "Editar nota" : "Agregar nota"}
          </button>
        </>
      ) : (
        <form onSubmit={guardar} className="mt-3 grid gap-2">
          <textarea autoFocus aria-label={`Alergias y notas de ${mascota.nombre}`} value={borrador} onChange={(e) => setBorrador(e.target.value)} maxLength={200} rows={3} placeholder="Ej. Nerviosa con secadora" className="hv-campo !h-auto py-2.5 !text-sm" />
          <div className="flex gap-2">
            <button type="submit" className="hv-boton hv-turquesa flex-1">
              Guardar nota
            </button>
            <button type="button" onClick={() => setBorrador(null)} className="hv-boton hv-linea">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
