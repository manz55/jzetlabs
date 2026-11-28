import { ChartColumn, UtensilsCrossed } from "lucide-react";
import { Cierre } from "./Cierre";
import { GestionMenu } from "./GestionMenu";
import type { Feria } from "./datos";

export type Pestana = "cierre" | "gestion";

export function Admin({ feria, pestana, ir }: { feria: Feria; pestana: Pestana; ir: (direccion: string) => void }) {
  const pestanas = [
    { id: "cierre", nombre: "Cierre del Evento", direccion: "#cierre", icono: ChartColumn },
    { id: "gestion", nombre: "Gestión de Menú (Altas y Bajas)", direccion: "#gestion-menu", icono: UtensilsCrossed },
  ] as const;
  return (
    <>
      <div className="border-b border-[#EAE2D8] bg-[#F9F5F0]">
        <div role="group" aria-label="Secciones del panel" className="tf-ancho !max-w-[90rem] flex flex-wrap gap-2 py-3">
          {pestanas.map(({ id, nombre, direccion, icono: Icono }) => (
            <button key={id} type="button" aria-pressed={pestana === id} onClick={() => ir(direccion)} className="tf-pildora !whitespace-normal">
              <Icono size={16} aria-hidden className="shrink-0" /> {nombre}
            </button>
          ))}
        </div>
      </div>
      {pestana === "cierre" ? (
        <Cierre feria={feria} alCaja={() => ir("#caja")} alDespacho={() => ir("#despacho")} alStock={() => ir("#gestion-menu")} />
      ) : (
        <GestionMenu feria={feria} alCaja={() => ir("#caja")} alCarta={() => ir("#stands-menu")} />
      )}
    </>
  );
}
