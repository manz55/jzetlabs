/*
 * Demo: Clínica Dental Valleverde (negocio inventado). Dos vistas que comparten datos:
 * el portal del paciente (tratamientos, agenda y estado de cuenta) y el panel de la
 * clínica (citas del día, precios y saldos). El enlace #panel abre directo el panel.
 */
import { useEffect, useLayoutEffect, useState } from "react";
import { LayoutDashboard, UserRound } from "lucide-react";
import { BandaDemos } from "../comun";
import { useClinica } from "./datos";
import { ESTILOS, LETRAS } from "./estilos";
import { Portal } from "./Portal";
import { Panel } from "./Panel";
import { Pie } from "./Pie";

type Vista = "portal" | "panel";
const leer = (): Vista => (location.hash === "#panel" ? "panel" : "portal");

const VISTAS = [
  { id: "portal", nombre: "Portal Paciente", icono: UserRound },
  { id: "panel", nombre: "Panel Clínica", extra: " (Admin)", icono: LayoutDashboard },
] as const;

export default function ClinicaDemo() {
  const clinica = useClinica();
  const [vista, setVista] = useState<Vista>(leer);

  useLayoutEffect(() => {
    if (document.querySelector(`link[href="${LETRAS}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = LETRAS;
    document.head.appendChild(l);
  }, []);

  useEffect(() => {
    const cambio = () => setVista(leer());
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);

  useEffect(() => {
    document.title = vista === "panel" ? "Panel · Clínica Dental Valleverde" : "Clínica Dental Valleverde · Demo de Jzet Labs";
  }, [vista]);

  function cambiar(v: Vista) {
    history.replaceState(null, "", v === "panel" ? "#panel" : location.pathname);
    setVista(v);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <div className="vv">
      <style>{ESTILOS}</style>
      <BandaDemos />
      <div className="vv-franja">
        <div className="vv-pildora" role="group" aria-label="Cambiar de vista">
          {VISTAS.map((v) => (
            <button key={v.id} type="button" aria-pressed={vista === v.id} onClick={() => cambiar(v.id)}>
              <v.icono size={16} aria-hidden />
              <span>
                {v.nombre}
                {"extra" in v && <span className="vv-solo-ancho">{v.extra}</span>}
              </span>
            </button>
          ))}
        </div>
      </div>
      {vista === "portal" ? <Portal clinica={clinica} /> : <Panel clinica={clinica} />}
      <Pie />
    </div>
  );
}
