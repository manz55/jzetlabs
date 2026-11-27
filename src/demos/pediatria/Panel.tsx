/* Panel Pediatra: agenda del día, registro de vacunas aplicadas y disponibilidad de horarios. */
import { useState } from "react";
import { CalendarDays, ClipboardList, Clock } from "lucide-react";
import { Carne } from "./Carne";
import { Citas } from "./Citas";
import { Horarios } from "./Horarios";
import type { Clinica } from "./datos";

const PESTANAS = [
  { id: "citas", nombre: "Agenda", extra: " del día", icono: CalendarDays },
  { id: "carne", nombre: "Vacunas", extra: " aplicadas", icono: ClipboardList },
  { id: "horarios", nombre: "Horarios", extra: "", icono: Clock },
] as const;
type Pestana = (typeof PESTANAS)[number]["id"];

export function Panel({ clinica }: { clinica: Clinica }) {
  const [pestana, setPestana] = useState<Pestana>("citas");
  const [pacienteId, setPaciente] = useState(clinica.pacientes[0].id);

  function abrirCarne(id: string) {
    setPaciente(id);
    setPestana("carne");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <>
      <div className="pa-subbarra">
        <div className="pa-ancho">
          <p>
            <b>Panel Pediatra</b>
            <span>Sistema de la clínica</span>
          </p>
          <nav className="pa-pestanas" aria-label="Secciones del panel">
            {PESTANAS.map((p) => (
              <button key={p.id} type="button" aria-pressed={pestana === p.id} onClick={() => setPestana(p.id)}>
                <p.icono size={16} aria-hidden />
                <span>
                  {p.nombre}
                  <span className="pa-solo-ancho">{p.extra}</span>
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      <main className="pa-panel-fondo">
        <div className="pa-ancho">
          {pestana === "citas" && <Citas clinica={clinica} alAbrirCarne={abrirCarne} />}
          {pestana === "carne" && <Carne clinica={clinica} pacienteId={pacienteId} alElegir={setPaciente} />}
          {pestana === "horarios" && <Horarios clinica={clinica} />}
        </div>
      </main>
    </>
  );
}
