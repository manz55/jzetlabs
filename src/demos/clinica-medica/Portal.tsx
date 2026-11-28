import { useCallback, useState } from "react";
import { CalendarPlus, ChevronDown } from "lucide-react";
import { horaActual, porHorario } from "./agenda";
import { esExamen, fechaCorta, folioTexto, hoyIso, nombreServicio, tipoDe } from "./datos";
import type { Altamira } from "./estado";
import { HojaDeInforme, Informe } from "./Informe";
import { EstadoOrden, HojaImpresion } from "./Piezas";
import { ProximaCita } from "./ProximaCita";
import { HojaDeReceta, TarjetaReceta } from "./Receta";

type Props = {
  clinica: Altamira;
  activo: string;
  alElegir: (id: string) => void;
  alAvisar: (texto: string, alerta?: boolean) => void;
  alAgendar: () => void;
};

export function Portal({ clinica, activo, alElegir, alAvisar, alAgendar }: Props) {
  const pacientes = clinica.pacientes.filter((p) => p.enPortal);
  const paciente = pacientes.find((p) => p.id === activo) ?? pacientes[0];
  const citas = clinica.citas.filter((c) => c.pacienteId === paciente.id);
  const ordenes = citas.filter((c) => esExamen(c.servicioId)).sort((a, b) => porHorario(b, a));
  const recetas = clinica.recetas.filter((r) => r.pacienteId === paciente.id);
  const proximas = citas.filter(
    (c) => !c.informe && c.estado !== "finalizada" && c.estado !== "muestra" && (c.fecha > hoyIso() || (c.fecha === hoyIso() && (c.hora >= horaActual() || tipoDe(c.servicioId) === "consulta"))),
  );
  const [abierta, setAbierta] = useState<string | null>(null);
  const [imprimiendo, setImprimiendo] = useState<string | null>(null);
  const terminar = useCallback(() => setImprimiendo(null), []);
  const ordenImpresa = ordenes.find((c) => c.id === imprimiendo);
  const recetaImpresa = recetas.find((r) => r.id === imprimiendo);

  return (
    <div className="cm-ancho py-8">
      <h1 className="text-3xl">Portal del Paciente</h1>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Paciente activo" className="cm-pildoras">
          {pacientes.map((p) => (
            <button key={p.id} type="button" aria-pressed={p.id === paciente.id} onClick={() => alElegir(p.id)} className="cm-pildora">
              {p.nombre} · {p.edad} años
            </button>
          ))}
        </div>
        <button type="button" onClick={alAgendar} className="cm-boton cm-azul">
          <CalendarPlus size={16} aria-hidden /> Nueva cita
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section aria-labelledby="cm-resultados" className="min-w-0 lg:col-span-7">
          <h2 id="cm-resultados" className="text-xl">Resultados de Laboratorio en Línea</h2>
          {ordenes.length === 0 && <p className="cm-tarjeta mt-3 p-5 text-sm">Todavía no tiene órdenes de laboratorio.</p>}
          <ul className="mt-3 grid gap-3">
            {ordenes.map((c) => {
              const visible = abierta === c.id && Boolean(c.informe);
              return (
                <li key={c.id} className="cm-tarjeta overflow-hidden">
                  <button
                    type="button"
                    disabled={!c.informe}
                    aria-expanded={c.informe ? visible : undefined}
                    onClick={() => setAbierta(visible ? null : c.id)}
                    className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left enabled:hover:bg-[#F8FAFC] sm:px-6"
                  >
                    <span className="min-w-0">
                      <span className="block font-bold text-[#0F172A]">{nombreServicio(c.servicioId)}</span>
                      <span className="block text-xs">
                        Orden {folioTexto(c.folio)} · {fechaCorta(c.fecha)}, {c.hora}
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <EstadoOrden cita={c} />
                      {c.informe && <ChevronDown size={18} aria-hidden className={`text-[#1D4ED8] transition ${visible ? "rotate-180" : ""}`} />}
                    </span>
                  </button>
                  {visible && <Informe cita={c} paciente={paciente} alAvisar={alAvisar} alDescargar={() => setImprimiendo(c.id)} />}
                </li>
              );
            })}
          </ul>
        </section>

        <div className="grid min-w-0 content-start gap-6 lg:col-span-5">
          <section aria-labelledby="cm-proxima">
            <h2 id="cm-proxima" className="text-xl">Próxima cita</h2>
            <div className="mt-3 grid gap-3">
              {proximas.length === 0 && <p className="cm-tarjeta p-5 text-sm">No tiene citas programadas.</p>}
              {proximas.map((c) => (
                <ProximaCita key={c.id} clinica={clinica} cita={c} alAvisar={alAvisar} />
              ))}
            </div>
          </section>
          <section aria-labelledby="cm-recetas">
            <h2 id="cm-recetas" className="text-xl">Recetas Médicas</h2>
            <div className="mt-3 grid gap-3">
              {recetas.length === 0 && <p className="cm-tarjeta p-5 text-sm">Sus recetas aparecerán aquí al terminar la consulta.</p>}
              {recetas.map((r) => (
                <TarjetaReceta key={r.id} receta={r} alDescargar={() => setImprimiendo(r.id)} />
              ))}
            </div>
          </section>
        </div>
      </div>

      {(ordenImpresa || recetaImpresa) && (
        <HojaImpresion alTerminar={terminar}>
          {ordenImpresa && <HojaDeInforme cita={ordenImpresa} paciente={paciente} />}
          {recetaImpresa && <HojaDeReceta receta={recetaImpresa} paciente={paciente} />}
        </HojaImpresion>
      )}
    </div>
  );
}
