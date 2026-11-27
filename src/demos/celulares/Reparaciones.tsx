/*
 * Vista "Reparaciones", de lo urgente a lo informativo: cabecera con los dos accesos,
 * cotizador y rastreador lado a lado, y abajo el respaldo del laboratorio y el tarifario.
 */
import { CalendarCheck, Clock, Search } from "lucide-react";
import { irA } from "./animar";
import { Cotizador } from "./Cotizador";
import { Laboratorio } from "./Laboratorio";
import { Foto } from "./Marca";
import { Rastreador } from "./Rastreador";
import { FOTOS, foto, type Nexus } from "./datos";

export function Reparaciones({ n, codigo, alCodigo }: { n: Nexus; codigo: string; alCodigo: (c: string) => void }) {
  return (
    <>
      <header className="nx-taller-cabeza nx-oscuro">
        <Foto src={foto(FOTOS.banco, 1600, 600)} alt="" prioridad />
        <div className="nx-ancho">
          <div>
            <h1>Taller técnico Zona 10</h1>
            <p>
              <Clock size={18} aria-hidden /> Tiempo promedio de entrega hoy: <b>35–60 min en sucursal</b>
            </p>
          </div>
          <div className="nx-taller-accesos">
            <button type="button" className="nx-btn nx-azul" onClick={() => irA("nx-cotizar")}>
              <CalendarCheck size={18} aria-hidden /> Cotizar y agendar
            </button>
            <button type="button" className="nx-btn nx-claro" onClick={() => irA("nx-rastreo")}>
              <Search size={18} aria-hidden /> Rastrear mi equipo
            </button>
          </div>
        </div>
      </header>
      <div className="nx-ancho nx-taller">
        <Cotizador
          n={n}
          alAgendada={(id) => {
            alCodigo(id);
            /* se espera a que la ventana cierre para poder bajar */
            window.setTimeout(() => irA("nx-rastreo"), 120);
          }}
        />
        <Rastreador n={n} codigo={codigo} alCambiar={alCodigo} />
      </div>
      <Laboratorio />
    </>
  );
}
