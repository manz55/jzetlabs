/*
 * Demo: Autotech · Ingeniería Automotriz (taller inventado). Tres vistas en la misma dirección
 * que comparten datos en vivo: Taller y Auxilio, Seguimiento por Placa (#seguimiento o
 * #seguimiento/P-482JKL) y Panel Taller (#panel). De lo compartido entre demos solo usa la banda superior.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BandaDemos } from "../comun";
import { Auxilio } from "./Auxilio";
import { irA, useVista } from "./animar";
import { Cita } from "./Cita";
import { enTaller, normalizarPlaca, useAutotech, type FallaId, type Filtro, type Tipo } from "./datos";
import { ESTILOS, LETRAS } from "./estilos";
import { Inicio } from "./Inicio";
import { Nav, type Vista } from "./Nav";
import { Panel, type FiltroPanel } from "./Panel";
import { Pie } from "./Pie";
import { Seguimiento } from "./Seguimiento";

function leer(): { vista: Vista; placa: string } {
  const [ruta, dato = ""] = location.hash.slice(1).split("/");
  if (ruta === "seguimiento") return { vista: "seguimiento", placa: normalizarPlaca(dato) };
  if (ruta === "panel") return { vista: "panel", placa: "" };
  return { vista: "taller", placa: "" };
}

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
  /* sección de la portada a la que hay que bajar cuando ya esté pintada */
  const destino = useRef("");
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
    const id = destino.current;
    if (!id) return;
    const t = window.setTimeout(() => {
      destino.current = "";
      irA(id);
    }, 120);
    return () => window.clearTimeout(t);
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

  function irSeccion(id: string) {
    if (vista === "taller") {
      irA(id);
      return;
    }
    destino.current = id;
    ir("taller");
  }

  const porAprobar = taller.estado.ordenes.filter((o) => o.etapa === 3).length;
  const placasActivas = taller.estado.ordenes.filter(enTaller).length;

  return (
    <>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <div className="at">
        <Nav vista={vista} placas={placasActivas} porAprobar={porAprobar} alVista={(v) => ir(v)} alSeccion={irSeccion} alAuxilio={() => setAuxilio("")} />

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
