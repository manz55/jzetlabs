/*
 * Demo: "Órbita Celulares" (tienda inventada, datos de ejemplo).
 * Dos partes: la tienda que ve el cliente y el panel que solo ve el dueño
 * (#admin). Lo que hace el cliente (comprar, pagar, pedir reparación o
 * devolución) le aparece al dueño.
 */
import { useEffect, useState } from "react";
import { BarChart3, ShoppingBag } from "lucide-react";
import { BandaDemos, CierreJzet } from "../comun";
import { TiendaCliente } from "./Tienda";
import { PanelDueno } from "./Admin";
import { AMARILLO, useTienda } from "./datos";

type Vista = "tienda" | "admin";

export default function CelularesDemo() {
  const t = useTienda();
  const [vista, setVista] = useState<Vista>(() => (location.hash === "#admin" ? "admin" : "tienda"));

  useEffect(() => {
    const cambio = () => setVista(location.hash === "#admin" ? "admin" : "tienda");
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  function irA(v: Vista) {
    history.replaceState(null, "", v === "admin" ? "#admin" : location.pathname);
    setVista(v);
    window.scrollTo({ top: 0 });
  }

  return (
    <div>
      <BandaDemos />
      <div className="text-white" style={{ background: "#2a1b45" }}>
        <div className="mx-auto max-w-7xl px-4 py-2 flex flex-wrap items-center justify-center sm:justify-between gap-2 text-[0.82rem]">
          <p className="hidden sm:block text-white/65">Dos partes: lo que ve el cliente y lo que solo ve el dueño.</p>
          <div className="flex rounded-full bg-white/10 p-0.5" role="group" aria-label="Vista de la demo">
            {(
              [
                ["tienda", "Tienda (cliente)", ShoppingBag],
                ["admin", "Panel del dueño", BarChart3],
              ] as const
            ).map(([v, tx, I]) => (
              <button key={v} type="button" onClick={() => irA(v)} aria-pressed={vista === v} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition ${vista === v ? "text-black" : "text-white/80 hover:text-white"}`} style={vista === v ? { background: AMARILLO } : undefined}>
                <I size={14} /> {tx}
              </button>
            ))}
          </div>
        </div>
      </div>

      {vista === "tienda" ? (
        <TiendaCliente t={t} alAdmin={() => irA("admin")} />
      ) : (
        // por ahora se entra sin contraseña; en la tienda real cada quien tendrá su usuario
        <PanelDueno t={t} alSalir={() => irA("tienda")} alTienda={() => irA("tienda")} />
      )}

      {vista === "tienda" && <CierreJzet demo="tienda de celulares" />}
    </div>
  );
}
