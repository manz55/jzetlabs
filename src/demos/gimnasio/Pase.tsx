/*
 * Pase de Socio: el carné siempre a la vista y, al lado, tres apartados para no amontonar:
 * rutina y clases, progreso, y datos y pagos. Los tres quedan montados para no perder lo escrito.
 */
import { useState } from "react";
import { Dumbbell, TrendingUp, UserRound } from "lucide-react";
import { grupoDe, type Club, type Socio } from "./datos";
import { Carne } from "./Carne";
import { MisDatos } from "./MisDatos";
import { Pasarela } from "./Pago";
import { Progreso } from "./Progreso";
import { Rutina } from "./Rutina";
import { ANCHO } from "./Piezas";

const APARTADOS = [
  { id: "rutina", nombre: "Rutina y clases", icono: Dumbbell },
  { id: "progreso", nombre: "Progreso", icono: TrendingUp },
  { id: "datos", nombre: "Datos y pagos", icono: UserRound },
] as const;

export function Pase({ club, socio, alElegir, alHorarios, pagando, alPagar }: { club: Club; socio: Socio; alElegir: (id: number) => void; alHorarios: () => void; pagando: boolean; alPagar: (abrir: boolean) => void }) {
  const [apartado, setApartado] = useState<(typeof APARTADOS)[number]["id"]>("rutina");

  return (
    <div className="bg-[#F8FAFC] pb-20 pt-8 sm:pt-12">
      <div className={ANCHO}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-[1.75rem] font-extrabold tracking-tight sm:text-[2.2rem]">Pase de Socio</h1>
            <p className="mt-1.5 text-slate-600">Su entrada, su rutina y sus pagos en un solo lugar.</p>
          </div>
          <label className="grid w-full min-w-0 gap-1.5 text-[0.85rem] font-bold text-slate-600 sm:w-72">
            Cambiar de socio
            <select value={socio.id} onChange={(e) => alElegir(Number(e.target.value))} className="min-h-12 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-base font-semibold text-[#0F172A]">
              {club.socios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                  {grupoDe(s) === "vencido" ? " (bloqueado)" : grupoDe(s) === "tolerancia" ? " (tolerancia)" : ""}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]">
          <div className="mx-auto w-full min-w-0 max-w-[26rem] lg:max-w-none">
            <Carne key={socio.id} club={club} socio={socio} alRenovar={() => alPagar(true)} />
          </div>

          <div className="min-w-0">
            <div role="group" aria-label="Apartados de mi pase" className="mb-6 grid grid-cols-3 gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5">
              {APARTADOS.map(({ id, nombre, icono: Icono }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={apartado === id}
                  onClick={() => setApartado(id)}
                  className={`flex min-h-14 min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-center text-[0.8rem] font-bold leading-tight sm:flex-row sm:gap-2 sm:text-[0.92rem] ${apartado === id ? "bg-[#0F172A] text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <Icono size={18} aria-hidden className="shrink-0" />
                  {nombre}
                </button>
              ))}
            </div>
            <div key={socio.id}>
              <div hidden={apartado !== "rutina"}>
                <Rutina club={club} socio={socio} alHorarios={alHorarios} />
              </div>
              <div hidden={apartado !== "progreso"}>
                <Progreso club={club} socio={socio} />
              </div>
              <div hidden={apartado !== "datos"}>
                <MisDatos club={club} socio={socio} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {pagando && <Pasarela key={socio.id} club={club} socio={socio} alCerrar={() => alPagar(false)} />}
    </div>
  );
}
