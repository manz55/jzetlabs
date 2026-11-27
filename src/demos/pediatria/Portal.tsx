/* Portal Padres: las herramientas de la familia. Carné, vacunas por edad, crecimiento y agenda. */
import { CalendarCheck, ClipboardList, Ruler, Syringe } from "lucide-react";
import { irA } from "../hotel/animar";
import { Agendar, type Borrador } from "./Agendar";
import { Crecimiento } from "./Crecimiento";
import { MiCarne } from "./MiCarne";
import { Vacunas } from "./Vacunas";
import type { Clinica } from "./datos";

const ATAJOS = [
  { id: "pa-micarne", nombre: "Carné de mis hijos", icono: ClipboardList },
  { id: "pa-vacunas", nombre: "Vacunas por edad", icono: Syringe },
  { id: "pa-crecimiento", nombre: "Crecimiento", icono: Ruler },
  { id: "pa-agenda", nombre: "Agendar cita", icono: CalendarCheck },
];

type Props = {
  clinica: Clinica;
  /* lo que se va armando vive arriba, para no perderlo al cambiar de vista */
  borrador: Borrador;
  setBorrador: (cambio: (b: Borrador) => Borrador) => void;
  vacunas: string[];
  setVacunas: (cambio: (v: string[]) => string[]) => void;
};

export function Portal({ clinica, borrador, setBorrador, vacunas, setVacunas }: Props) {
  const cambiar = (c: Partial<Borrador>) => setBorrador((b) => ({ ...b, ...c }));
  const agendar = (c: Partial<Borrador>) => {
    setBorrador((b) => ({ ...b, meses: null, pacienteId: undefined, ...c, vez: b.vez + 1 }));
    irA("pa-agenda");
  };
  function alternar(id: string) {
    const esta = vacunas.includes(id);
    setVacunas((v) => (esta ? v.filter((x) => x !== id) : [...v, id]));
    // al agregar la primera vacuna, la cita pasa a ser de vacunación
    if (!esta && !vacunas.length) cambiar({ motivo: "vacunacion" });
  }

  /* al agregar desde el carné, la cita queda a nombre de ese hijo */
  function agregarDelCarne(vacunaId: string, pacienteId: string) {
    const agrega = !vacunas.includes(vacunaId);
    alternar(vacunaId);
    if (agrega) setBorrador((b) => ({ ...b, meses: null, pacienteId, vez: b.vez + 1 }));
  }

  return (
    <main>
      <div className="pa-bienvenida">
        <div className="pa-ancho">
          <h1>Portal Padres</h1>
          <p>El carné, las vacunas, el crecimiento y las citas de sus hijos en un solo lugar. No necesita contraseña.</p>
          <nav className="pa-atajos" aria-label="Herramientas">
            {ATAJOS.map((a) => (
              <button key={a.id} type="button" onClick={() => irA(a.id)}>
                <a.icono size={20} aria-hidden /> {a.nombre}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <MiCarne clinica={clinica} elegidas={vacunas} alAgregar={agregarDelCarne} />
      <Vacunas elegidas={vacunas} alAlternar={alternar} alAgendar={() => agendar({ motivo: "vacunacion" })} />
      <Crecimiento alAgendar={(meses) => agendar({ motivo: "control", meses })} />
      <Agendar
        clinica={clinica}
        borrador={borrador}
        alCambiar={cambiar}
        vacunas={vacunas}
        alQuitar={(id) => setVacunas((v) => v.filter((x) => x !== id))}
        alVaciar={() => setVacunas(() => [])}
      />
    </main>
  );
}
