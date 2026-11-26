/* Barra de la portada: llegada, salida, huéspedes y la consulta. */
import { useState, type FormEvent } from "react";
import { CalendarDays, Minus, Plus, Users } from "lucide-react";
import { MAX_HUESPEDES, MAX_NOCHES, conLlegada, hoy, sumarDias, textoHuespedes, ultimaLlegada, type Estancia } from "./datos";

/*
 * Mientras se escribe a mano la fecha pasa por valores a medias (año 0002...):
 * solo se guarda cuando cae dentro del rango y, si se sale del campo incompleta, vuelve la anterior.
 */
function CampoFecha({ id, rotulo, valor, min, max, alElegir }: { id: string; rotulo: string; valor: string; min: string; max: string; alElegir: (v: string) => void }) {
  const [texto, setTexto] = useState(valor);
  const [previo, setPrevio] = useState(valor);
  if (valor !== previo) {
    setPrevio(valor);
    setTexto(valor);
  }
  return (
    <div>
      <label htmlFor={id} className="pv-rotulo">
        <CalendarDays size={15} aria-hidden /> {rotulo}
      </label>
      <input
        id={id}
        type="date"
        className="pv-campo"
        value={texto}
        min={min}
        max={max}
        required
        onChange={(e) => {
          const v = e.target.value;
          setTexto(v);
          if (v >= min && v <= max) alElegir(v);
        }}
        onBlur={() => setTexto(valor)}
      />
    </div>
  );
}

export default function Disponibilidad({ estancia, alCambiar, alConsultar }: { estancia: Estancia; alCambiar: (e: Estancia) => void; alConsultar: () => void }) {
  const { llegada, salida, huespedes } = estancia;
  const personas = (n: number) => alCambiar({ ...estancia, huespedes: Math.max(1, Math.min(MAX_HUESPEDES, n)) });
  const enviar = (e: FormEvent) => {
    e.preventDefault();
    alConsultar();
  };

  return (
    <form id="disponibilidad" className="pv-barra" onSubmit={enviar} noValidate aria-label="Consultar disponibilidad">
      <CampoFecha id="pv-llegada" rotulo="Llegada" valor={llegada} min={hoy()} max={ultimaLlegada()} alElegir={(v) => alCambiar(conLlegada(estancia, v))} />
      <CampoFecha id="pv-salida" rotulo="Salida" valor={salida} min={sumarDias(llegada, 1)} max={sumarDias(llegada, MAX_NOCHES)} alElegir={(v) => alCambiar({ ...estancia, salida: v })} />
      <div className="pv-todo" role="group" aria-labelledby="pv-huespedes">
        <span id="pv-huespedes" className="pv-rotulo">
          <Users size={15} aria-hidden /> Huéspedes
        </span>
        <div className="pv-pasos">
          <button type="button" className="pv-paso" aria-label="Un huésped menos" disabled={huespedes <= 1} onClick={() => personas(huespedes - 1)}>
            <Minus size={17} aria-hidden />
          </button>
          <span className="pv-num whitespace-nowrap font-semibold" aria-live="polite">
            {textoHuespedes(huespedes)}
          </span>
          <button type="button" className="pv-paso" aria-label="Un huésped más" disabled={huespedes >= MAX_HUESPEDES} onClick={() => personas(huespedes + 1)}>
            <Plus size={17} aria-hidden />
          </button>
        </div>
      </div>
      <button type="submit" className="pv-btn pv-accion pv-todo !min-h-[50px]">
        Consultar disponibilidad
      </button>
    </form>
  );
}
