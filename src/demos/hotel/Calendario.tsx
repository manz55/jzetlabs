/*
 * Calendario grande de llegada y salida: se toca un día y luego el otro.
 * Se ven dos meses seguidos: uno debajo del otro en celular y lado a lado en pantallas anchas.
 */
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MAX_NOCHES, diasDelMes, fechaLarga, hoy, mesDe, nombreMes, sumarDias, sumarMeses, ultimaLlegada } from "./datos";

const SEMANA = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];

/* "salida" vacía = ya se tocó la llegada y falta el día de salida */
export default function Calendario({ llegada, salida, alTocar }: { llegada: string; salida: string | null; alTocar: (iso: string) => void }) {
  const [mes, setMes] = useState(mesDe(llegada));
  const desde = hoy();
  const hasta = ultimaLlegada();
  const topeSalida = sumarDias(llegada, MAX_NOCHES);

  const bloqueado = (d: string) => {
    if (d < desde) return true;
    if (salida) return d > hasta;
    return d > llegada ? d > topeSalida : d > hasta;
  };

  return (
    <div className="pv-cal">
      <button type="button" className="pv-cal-flecha left-0" aria-label="Mes anterior" disabled={mes <= mesDe(desde)} onClick={() => setMes(sumarMeses(mes, -1))}>
        <ChevronLeft size={22} aria-hidden />
      </button>
      <button type="button" className="pv-cal-flecha right-0" aria-label="Mes siguiente" disabled={mes >= mesDe(hasta)} onClick={() => setMes(sumarMeses(mes, 1))}>
        <ChevronRight size={22} aria-hidden />
      </button>
      <div className="pv-meses">
        {[mes, sumarMeses(mes, 1)].map((m) => {
          const { huecos, dias } = diasDelMes(m);
          return (
            <div key={m}>
              <p className="pv-cal-mes" aria-live="polite">
                {nombreMes(m)}
              </p>
              <div className="pv-dias" role="group" aria-label={nombreMes(m)}>
                {SEMANA.map((s) => (
                  <span key={s} className="pv-semana" aria-hidden>
                    {s}
                  </span>
                ))}
                {Array.from({ length: huecos }, (_, h) => (
                  <span key={`h${h}`} />
                ))}
                {dias.map((d) => {
                  const punta = d === llegada ? "llegada" : d === salida ? "salida" : null;
                  const medio = Boolean(salida) && d > llegada && d < (salida as string);
                  return (
                    <button
                      key={d}
                      type="button"
                      className="pv-dia"
                      data-fecha={d}
                      data-punta={punta ?? undefined}
                      data-medio={medio || undefined}
                      disabled={bloqueado(d)}
                      aria-pressed={Boolean(punta)}
                      aria-label={`${fechaLarga(d)}${punta ? `, ${punta}` : ""}`}
                      onClick={() => alTocar(d)}
                    >
                      {Number(d.slice(8))}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
