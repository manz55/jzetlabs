/* Barra de la portada: llegada, salida, huéspedes y la consulta. Las fechas abren el calendario grande. */
import type { FormEvent } from "react";
import { CalendarDays, Minus, Plus, Users } from "lucide-react";
import { MAX_HUESPEDES, fechaCorta, fechaLarga, textoHuespedes, type Estancia } from "./datos";

export function Huespedes({ id, valor, alCambiar }: { id: string; valor: number; alCambiar: (n: number) => void }) {
  return (
    <div role="group" aria-labelledby={id}>
      <span id={id} className="pv-rotulo">
        <Users size={15} aria-hidden /> Huéspedes
      </span>
      <div className="pv-pasos">
        <button type="button" className="pv-paso" aria-label="Un huésped menos" disabled={valor <= 1} onClick={() => alCambiar(valor - 1)}>
          <Minus size={19} aria-hidden />
        </button>
        <span className="pv-num whitespace-nowrap font-semibold" aria-live="polite">
          {textoHuespedes(valor)}
        </span>
        <button type="button" className="pv-paso" aria-label="Un huésped más" disabled={valor >= MAX_HUESPEDES} onClick={() => alCambiar(valor + 1)}>
          <Plus size={19} aria-hidden />
        </button>
      </div>
    </div>
  );
}

export function CasillaFecha({ rotulo, fecha, activa, alTocar }: { rotulo: string; fecha: string | null; activa?: boolean; alTocar: () => void }) {
  return (
    <div>
      <span className="pv-rotulo">
        <CalendarDays size={15} aria-hidden /> {rotulo}
      </span>
      <button type="button" className="pv-fecha pv-num" data-activa={activa || undefined} aria-label={`${rotulo}: ${fecha ? fechaLarga(fecha) : "sin elegir"}. Cambiar`} onClick={alTocar}>
        {fecha ? fechaCorta(fecha) : "Elija el día"}
      </button>
    </div>
  );
}

export default function Disponibilidad({
  estancia,
  alHuespedes,
  alFechas,
  alConsultar,
}: {
  estancia: Estancia;
  alHuespedes: (n: number) => void;
  alFechas: (cual: "llegada" | "salida") => void;
  alConsultar: () => void;
}) {
  const enviar = (e: FormEvent) => {
    e.preventDefault();
    alConsultar();
  };
  return (
    <form id="disponibilidad" className="pv-barra" onSubmit={enviar} aria-label="Consultar disponibilidad">
      <CasillaFecha rotulo="Llegada" fecha={estancia.llegada} alTocar={() => alFechas("llegada")} />
      <CasillaFecha rotulo="Salida" fecha={estancia.salida} alTocar={() => alFechas("salida")} />
      <div className="pv-todo">
        <Huespedes id="pv-huespedes" valor={estancia.huespedes} alCambiar={alHuespedes} />
      </div>
      <button type="submit" className="pv-btn pv-accion pv-todo !min-h-[56px]">
        Consultar disponibilidad
      </button>
    </form>
  );
}
