/*
 * Demo: Autotech · Ingeniería Automotriz (taller inventado). Tres vistas en la misma dirección
 * que comparten datos en vivo: Taller y Auxilio, Seguimiento por Placa (#seguimiento o
 * #seguimiento/P-482JKL) y Panel Taller (#panel). De lo compartido entre demos solo usa la banda superior.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LayoutDashboard, Search, Truck, Wrench } from "lucide-react";
import { BandaDemos } from "../comun";
import { Auxilio } from "./Auxilio";
import { useVista } from "./animar";
import { Cita } from "./Cita";
import { normalizarPlaca, useAutotech, type FallaId, type Filtro, type Tipo } from "./datos";
import { ESTILOS, LETRAS } from "./estilos";
import { Inicio } from "./Inicio";
import { Panel, type FiltroPanel } from "./Panel";
import { Pie } from "./Pie";
import { Logo } from "./Piezas";
import { Seguimiento } from "./Seguimiento";

type Vista = "taller" | "seguimiento" | "panel";
function leer(): { vista: Vista; placa: string } {
  const [ruta, dato = ""] = location.hash.slice(1).split("/");
  if (ruta === "seguimiento") return { vista: "seguimiento", placa: normalizarPlaca(dato) };
  if (ruta === "panel") return { vista: "panel", placa: "" };
  return { vista: "taller", placa: "" };
}

const VISTAS = [
  { id: "taller", nombre: "Taller y Auxilio", corto: "Taller", icono: Wrench },
  { id: "seguimiento", nombre: "Seguimiento por Placa", corto: "Seguimiento", icono: Search },
  { id: "panel", nombre: "Panel Taller", corto: "Panel", icono: LayoutDashboard },
] as const;

const TITULOS: Record<Vista, string> = {
  taller: "Autotech · Demo de Jzet Labs",
  seguimiento: "Seguimiento por placa · Autotech",
  panel: "Panel Taller · Autotech",
};

export default function TallerDemo() {
  const taller = useAutotech();
  const [vista, setVista] = useState<Vista>(() => leer().vista);
  const [placa, setPlaca] = useState(() => leer().placa || "P-482JKL");
  const [tipo, setTipo] = useState<Tipo>("sedan");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [filtroPanel, setFiltroPanel] = useState<FiltroPanel>("todos");
  const [cita, setCita] = useState<string | null>(null);
  const [auxilio, setAuxilio] = useState<FallaId | "" | null>(null);
  const principal = useRef<HTMLElement>(null);
  useVista(principal, vista);

  useLayoutEffect(() => {
    if (document.querySelector(`link[href="${LETRAS}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = LETRAS;
    document.head.appendChild(l);
  }, []);

  /* cada vista empieza arriba, también al volver atrás */
  useLayoutEffect(() => {
    const antes = history.scrollRestoration;
    history.scrollRestoration = "manual";
    return () => {
      history.scrollRestoration = antes;
    };
  }, []);
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [vista]);

  useEffect(() => {
    const cambio = () => {
      const l = leer();
      setCita(null);
      setAuxilio(null);
      setVista(l.vista);
      if (l.placa) setPlaca(l.placa);
    };
    addEventListener("hashchange", cambio);
    addEventListener("popstate", cambio);
    return () => {
      removeEventListener("hashchange", cambio);
      removeEventListener("popstate", cambio);
    };
  }, []);

  useEffect(() => {
    document.title = TITULOS[vista];
  }, [vista]);

  function ir(nueva: Vista, conPlaca = placa) {
    setCita(null);
    setPlaca(conPlaca);
    const direccion = nueva === "taller" ? location.pathname : nueva === "seguimiento" ? `#seguimiento/${conPlaca}` : "#panel";
    if (nueva === vista) {
      history.replaceState(null, "", direccion);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    history.pushState(null, "", direccion);
    setVista(nueva);
  }

  const porAprobar = taller.estado.ordenes.filter((o) => o.etapa === 3).length;

  return (
    <>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <div className="at">
        <header className="at-nav">
          <div className="at-ancho at-nav-fila">
            <button type="button" className="at-nav-logo" onClick={() => ir("taller")} aria-label="Autotech, ir al inicio">
              <Logo />
            </button>
            <nav className="at-vistas" aria-label="Secciones">
              {VISTAS.map(({ id, nombre, corto, icono: Icono }) => (
                <button key={id} type="button" aria-current={vista === id ? "page" : undefined} onClick={() => ir(id)} aria-label={nombre}>
                  <Icono size={17} aria-hidden />
                  <span className="at-largo">{nombre}</span>
                  <span className="at-corto">{corto}</span>
                  {id === "panel" && porAprobar > 0 && <i title="Pendientes de aprobación">{porAprobar}</i>}
                </button>
              ))}
            </nav>
            <button type="button" className="at-btn at-rojo at-nav-auxilio" onClick={() => setAuxilio("")}>
              <Truck size={18} aria-hidden />
              <span>
                Auxilio<span className="at-largo"> vial</span> 24/7
              </span>
            </button>
          </div>
        </header>

        <main ref={principal}>
          {vista === "taller" && <Inicio tipo={tipo} alTipo={setTipo} filtro={filtro} alFiltrar={setFiltro} alAgendar={setCita} alAuxilio={(f) => setAuxilio(f ?? "")} />}
          {vista === "seguimiento" && <Seguimiento taller={taller} placa={placa} alElegir={(p) => ir("seguimiento", p)} alAgendar={() => setCita("km5")} />}
          {vista === "panel" && <Panel taller={taller} filtro={filtroPanel} alFiltrar={setFiltroPanel} alVer={(p) => ir("seguimiento", p)} />}
        </main>

        <Pie alAuxilio={() => setAuxilio("")} />

        {cita !== null && <Cita taller={taller} servicioInicial={cita} tipo={tipo} alTipo={setTipo} alCerrar={() => setCita(null)} alVer={(p) => ir("seguimiento", p)} />}
        {auxilio !== null && <Auxilio fallaInicial={auxilio} alCerrar={() => setAuxilio(null)} />}
      </div>
    </>
  );
}
