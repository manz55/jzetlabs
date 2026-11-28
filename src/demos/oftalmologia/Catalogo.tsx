import { useState } from "react";
import { Check, Glasses } from "lucide-react";
import { cuando } from "./agenda";
import { AROS, CATEGORIAS, qz, type Categoria } from "./datos";
import { MAXIMO_AROS, type ClinicaViva } from "./estado";
import { Foto } from "./Piezas";

type Filtro = Categoria | "Todos";

export function Catalogo({ clinica, alApartar, alAgendar, alVerReceta }: { clinica: ClinicaViva; alApartar: (aroId: string) => void; alAgendar: () => void; alVerReceta: () => void }) {
  const [filtro, setFiltro] = useState<Filtro>("Todos");
  const visibles = AROS.filter((a) => filtro === "Todos" || a.categoria === filtro);
  const { apartados, citaVisitante } = clinica;

  return (
    <section id="catalogo-aros" className="cv-seccion bg-[#F1F5F9]">
      <div className="cv-ancho">
        <h2 className="text-3xl sm:text-4xl">Catálogo de aros</h2>
        <p className="mt-2 max-w-2xl">Aparta hasta {MAXIMO_AROS} y los tenemos listos para que te los pruebes el día de tu examen. El precio es del aro; los cristales se cotizan según tu graduación.</p>

        <div role="group" aria-label="Filtrar aros" className="mt-6 flex flex-wrap gap-2">
          {(["Todos", ...CATEGORIAS] as Filtro[]).map((f) => (
            <button key={f} type="button" aria-pressed={filtro === f} onClick={() => setFiltro(f)} className="cv-pildora">
              {f}
            </button>
          ))}
        </div>

        {apartados.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#FCD34D] bg-[#FFFBEB] p-4">
            <p className="flex min-w-0 items-start gap-2.5 text-sm font-bold text-[#92400E]">
              <Glasses size={20} aria-hidden className="shrink-0" />
              <span>
                {apartados.map((id) => AROS.find((a) => a.id === id)?.nombre).join(", ")}
                {citaVisitante ? ` · apartado para tu cita de ${cuando(citaVisitante).replace(/^./, (l) => l.toLowerCase())}` : " · elige tu horario para dejarlo en tu cita"}
              </span>
            </p>
            <button type="button" onClick={citaVisitante ? alVerReceta : alAgendar} className="cv-boton cv-linea">
              {citaVisitante ? "Ver en Mi Receta Visual" : "Elegir horario"}
            </button>
          </div>
        )}

        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibles.map((a) => {
            const apartado = apartados.includes(a.id);
            return (
              <li key={a.id} className="cv-tarjeta flex flex-col overflow-hidden">
                <Foto id={a.foto} alt={a.alt} ancho={640} alto={480} className="aspect-[4/3] h-auto w-full" />
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-bold text-[#1E3A8A]">{a.categoria}</p>
                  <div className="mt-1 flex items-baseline justify-between gap-3">
                    <h3 className="text-xl">{a.nombre}</h3>
                    <p className="text-lg font-extrabold tabular-nums text-[#B45309]">{qz(a.precio)}</p>
                  </div>
                  <p className="mt-1 text-sm">{a.detalle}</p>
                  <ul aria-label="Lentes compatibles" className="mb-4 mt-3 flex flex-wrap gap-1.5">
                    {a.lentes.map((l) => (
                      <li key={l} className="cv-chip cv-chip-neutro">
                        {l}
                      </li>
                    ))}
                  </ul>
                  <button type="button" aria-pressed={apartado} onClick={() => alApartar(a.id)} className={`cv-boton mt-auto w-full ${apartado ? "cv-ambar" : "cv-linea"}`}>
                    {apartado && <Check size={16} aria-hidden className="shrink-0" />}
                    {apartado ? "Apartado · quitar" : "Apartar para probar en mi cita"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
