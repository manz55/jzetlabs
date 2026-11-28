import { Banknote, Smartphone } from "lucide-react";
import { MesaCobros } from "./Cobros";
import { Despacho } from "./Despacho";
import { pendientesDe, type Cuenta, type Feria } from "./datos";

export type Modo = "cobros" | "despacho";

export function Caja({ feria, modo, alModo, cuenta, alCuenta }: { feria: Feria; modo: Modo; alModo: (m: Modo) => void; cuenta: Cuenta; alCuenta: (c: Cuenta) => void }) {
  const pendientes = pendientesDe(feria.tickets, "todos").length;
  const modos = [
    { id: "cobros", nombre: "Mesa de Cobros", texto: "Caja Central", icono: Banknote },
    { id: "despacho", nombre: "Despacho en Stands", texto: "Pantalla de cada puesto", icono: Smartphone },
  ] as const;
  return (
    <div className="tf-ancho !max-w-[90rem] py-6">
      <h1 className="sr-only">Caja y Despacho</h1>
      <div role="group" aria-label="Modo de trabajo" className="grid grid-cols-2 gap-2 rounded-2xl border border-[#EAE2D8] bg-[#F9F5F0] p-2 sm:gap-3">
        {modos.map(({ id, nombre, texto, icono: Icono }) => {
          const activo = modo === id;
          return (
            <button key={id} type="button" aria-pressed={activo} onClick={() => alModo(id)} className={`flex min-h-16 min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition sm:px-5 ${activo ? "bg-[#18181B] text-white" : "bg-white text-[#18181B] hover:bg-[#FFFDFB]"}`}>
              <Icono size={22} aria-hidden className="hidden shrink-0 sm:block" />
              <span className="min-w-0">
                <span className="block text-sm font-extrabold leading-tight sm:text-base">{nombre}</span>
                <span className={`block text-xs font-medium ${activo ? "text-white/70" : "text-[#6B6560]"}`}>{texto}</span>
              </span>
              {id === "despacho" && (
                <span className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold ${pendientes ? "bg-[#B91C1C] text-white" : "bg-[#DCFCE7] text-[#166534]"}`}>
                  {pendientes}
                  <span className="max-md:sr-only"> {pendientes === 1 ? "pendiente" : "pendientes"}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
      {modo === "cobros" ? <MesaCobros feria={feria} cuenta={cuenta} alCuenta={alCuenta} alDespacho={() => alModo("despacho")} /> : <Despacho feria={feria} />}
    </div>
  );
}
