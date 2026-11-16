/*
 * Demo: "Órbita Celulares" (tienda inventada, datos de ejemplo).
 * Dos partes: la tienda que ve el cliente y el panel que solo ve el dueño
 * (#admin). Lo que hace el cliente (comprar, pagar, pedir reparación o
 * devolución) le aparece al dueño.
 */
import { useEffect, useState } from "react";
import { BarChart3, Lock, ShoppingBag } from "lucide-react";
import { BandaDemos, CierreJzet } from "../comun";
import { TiendaCliente } from "./Tienda";
import { PanelDueno } from "./Admin";
import { AMARILLO, TINTA, TITULO, useTienda } from "./datos";

type Vista = "tienda" | "admin";

export default function CelularesDemo() {
  const t = useTienda();
  const [vista, setVista] = useState<Vista>(() => (location.hash === "#admin" ? "admin" : "tienda"));
  const [dentro, setDentro] = useState(false);

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
      <div className="text-white" style={{ background: "#1a2230" }}>
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
      ) : dentro ? (
        <PanelDueno t={t} alSalir={() => { setDentro(false); irA("tienda"); }} alTienda={() => irA("tienda")} />
      ) : (
        <Entrada alEntrar={() => setDentro(true)} />
      )}

      {vista === "tienda" && <CierreJzet demo="tienda de celulares" />}
    </div>
  );
}

function Entrada({ alEntrar }: { alEntrar: () => void }) {
  useEffect(() => {
    document.title = "Entrar al panel · Órbita Celulares · Demo de Jzet Labs";
  }, []);
  return (
    <div className="min-h-[calc(100vh-80px)] grid place-items-center px-5 py-16 text-white" style={{ background: TINTA }}>
      <div className="w-full max-w-sm rounded-3xl bg-white/5 p-7 ring-1 ring-white/10">
        <span className="grid place-items-center w-12 h-12 rounded-2xl" style={{ background: AMARILLO, color: TINTA }}>
          <Lock size={22} />
        </span>
        <h1 className="mt-5 text-[1.8rem] font-extrabold leading-tight !text-white" style={{ fontFamily: TITULO }}>
          Panel del dueño
        </h1>
        <p className="mt-2 text-white/65">Aquí ve sus ventas, pagos, inventario, reparaciones y devoluciones. Sus clientes nunca ven esta parte.</p>
        <label className="mt-6 block text-sm font-semibold">
          Usuario
          <input value="dueno@orbita.gt" readOnly className="mt-1.5 w-full rounded-xl bg-white/10 px-3 py-2.5 text-white/70" />
        </label>
        <label className="mt-3 block text-sm font-semibold">
          Contraseña
          <input value="••••••••" readOnly type="text" className="mt-1.5 w-full rounded-xl bg-white/10 px-3 py-2.5 text-white/70" />
        </label>
        <button type="button" onClick={alEntrar} className="mt-6 w-full rounded-full py-3.5 font-bold text-black active:scale-[0.98]" style={{ background: AMARILLO }}>
          Entrar a la demo
        </button>
        <p className="mt-4 text-center text-xs text-white/45">En su tienda real cada persona entra con su propio usuario y contraseña.</p>
      </div>
    </div>
  );
}
