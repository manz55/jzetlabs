/* Esquema de vacunas por edad: se elige la etapa y se agregan dosis a la cita. */
import { useRef, useState } from "react";
import { ArrowRight, Check, Plus } from "lucide-react";
import { useDemora, useEscalonado } from "../hotel/animar";
import { ETAPAS, VACUNAS, formatoQ, type EtapaId } from "./datos";

export function Vacunas({ elegidas, alAlternar, alAgendar }: { elegidas: string[]; alAlternar: (id: string) => void; alAgendar: () => void }) {
  const [etapa, setEtapa] = useState<EtapaId>("2-6");
  const cargando = useDemora(etapa, 300);
  const lista = useRef<HTMLUListElement>(null);
  useEscalonado(lista, etapa, !cargando);

  const info = ETAPAS.find((e) => e.id === etapa)!;
  const vacunas = VACUNAS.filter((v) => v.etapa === etapa);

  return (
    <section id="pa-vacunas" className="pa-seccion pa-salvia">
      <div className="pa-ancho">
        <div className="pa-titulo">
          <h2>Esquema de vacunas por edad</h2>
          <p>Elija la etapa de su hijo para ver las vacunas recomendadas, sus dosis y el precio de cada una.</p>
        </div>
        <div className="pa-etapas" role="group" aria-label="Etapa">
          {ETAPAS.map((e) => (
            <button key={e.id} type="button" aria-pressed={etapa === e.id} onClick={() => setEtapa(e.id)}>
              {e.nombre}
            </button>
          ))}
        </div>
        <p className="pa-nota-etapa">{info.nota}</p>
        <p className="pa-oculto" role="status">
          {cargando ? "Cargando vacunas" : `${vacunas.length} vacunas para la etapa ${info.nombre}`}
        </p>

        <ul className="pa-vacunas" ref={lista} aria-busy={cargando}>
          {cargando
            ? vacunas.map((v) => (
                <li key={v.id} className="pa-vacuna" aria-hidden>
                  <span className="pa-hueso" style={{ width: "62%", height: 20 }} />
                  <span className="pa-hueso" style={{ width: "92%", height: 13 }} />
                  <span className="pa-hueso" style={{ width: "74%", height: 13 }} />
                  <span className="pa-hueso" style={{ width: "45%", height: 22 }} />
                  <span className="pa-precio">
                    <span className="pa-hueso" style={{ width: 80, height: 30 }} />
                    <span className="pa-hueso" style={{ width: 130, height: 40, borderRadius: 99 }} />
                  </span>
                </li>
              ))
            : vacunas.map((v) => {
                const esta = elegidas.includes(v.id);
                return (
                  <li key={v.id} className="pa-vacuna" data-entra data-elegida={esta}>
                    <h3>{v.nombre}</h3>
                    <p className="pa-suave">{v.protege}</p>
                    <div className="pa-dosis">
                      <span>{v.meses.length} dosis</span>
                      <span>{v.cuando}</span>
                    </div>
                    <div className="pa-precio">
                      <span>
                        <strong>{formatoQ(v.precio)}</strong>
                        <small>por dosis</small>
                      </span>
                      <button type="button" className={`pa-btn pa-chico ${esta ? "pa-bosque" : "pa-contorno"}`} aria-pressed={esta} onClick={() => alAlternar(v.id)}>
                        {esta ? <Check size={16} aria-hidden /> : <Plus size={16} aria-hidden />}
                        {esta ? "En su cita" : "Agregar a la cita"}
                        <span className="pa-oculto">: {v.nombre}</span>
                      </button>
                    </div>
                  </li>
                );
              })}
        </ul>

        <div className="pa-pie-vacunas">
          <p>Esquema orientativo. El pediatra revisa el carné de su hijo y confirma qué dosis le corresponden antes de aplicar cualquier vacuna.</p>
          {elegidas.length > 0 && (
            <button type="button" className="pa-btn pa-cita" onClick={alAgendar}>
              Continuar con {elegidas.length} {elegidas.length === 1 ? "vacuna" : "vacunas"} <ArrowRight size={18} aria-hidden />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
