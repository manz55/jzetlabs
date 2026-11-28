/*
 * Demo: Atelier L'Art · Salón & Colorimetría (salón inventado). Tres vistas en la misma dirección
 * que comparten datos en vivo: Servicios y Citas, Expediente Capilar (#expediente) y Panel Salón
 * (#panel). De lo compartido entre demos solo usa la banda superior.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BandaDemos } from "../comun";
import { irA, useVista } from "./animar";
import { useAtelier, type ServicioId, type SucId } from "./datos";
import { ESTILOS, LETRAS } from "./estilos";
import { Expediente } from "./Expediente";
import { Inicio, type Filtro } from "./Inicio";
import { Nav, type Vista } from "./Nav";
import { Panel, type FiltroPanel } from "./Panel";
import { Pie } from "./Pie";
import { Dock, Reserva } from "./Reserva";

const leer = (): Vista => (location.hash === "#panel" ? "panel" : location.hash === "#expediente" ? "expediente" : "servicios");

const TITULOS: Record<Vista, string> = {
  servicios: "Atelier L’Art · Demo de Jzet Labs",
  expediente: "Expediente Capilar · Atelier L’Art",
  panel: "Panel Salón · Atelier L’Art",
};

export default function SalonDemo() {
  const atelier = useAtelier();
  const [vista, setVista] = useState<Vista>(leer);
  const [suc, setSuc] = useState<SucId>("z10");
  const [filtro, setFiltro] = useState<Filtro>("Todos");
  const [filtroPanel, setFiltroPanel] = useState<FiltroPanel>("todas");
  const [elegidos, setElegidos] = useState<ServicioId[]>([]);
  const [reservando, setReservando] = useState(false);
  const [clienta, setClienta] = useState("valeria");
  const principal = useRef<HTMLElement>(null);
  /* sección de la portada a la que hay que bajar cuando ya esté pintada */
  const destino = useRef("");
  /* la cita ya quedó registrada: al cerrar la hoja se vacía la selección */
  const confirmada = useRef(false);
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
      setReservando(false);
      setVista(leer());
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

  function cerrarReserva() {
    setReservando(false);
    if (confirmada.current) {
      confirmada.current = false;
      setElegidos([]);
    }
  }

  function ir(nueva: Vista) {
    cerrarReserva();
    const direccion = nueva === "servicios" ? location.pathname : `#${nueva}`;
    if (nueva === vista) {
      history.replaceState(null, "", direccion);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    history.pushState(null, "", direccion);
    setVista(nueva);
  }

  function irSeccion(id: string) {
    if (vista === "servicios") {
      irA(id);
      return;
    }
    destino.current = id;
    ir("servicios");
  }

  const alternar = (id: ServicioId) => setElegidos((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));
  const conDock = vista === "servicios" && elegidos.length > 0;
  const pendientes = atelier.citas.filter((c) => c.estado === "por-confirmar").length;

  return (
    <>
      <style>{ESTILOS}</style>
      <div className="al-banda">
        <BandaDemos />
      </div>
      <div className="al">
        <Nav vista={vista} pendientes={pendientes} alVista={ir} alSeccion={irSeccion} alAgendar={() => setReservando(true)} />

        <main ref={principal}>
          {vista === "servicios" && (
            <Inicio
              citas={atelier.citas}
              suc={suc}
              alSuc={setSuc}
              filtro={filtro}
              alFiltrar={setFiltro}
              elegidos={elegidos}
              alAlternar={alternar}
              alAgregar={(ids) => setElegidos((e) => [...new Set([...e, ...ids])])}
              alAgendar={() => setReservando(true)}
              alDiagnostico={() => irA("al-diagnostico")}
            />
          )}
          {vista === "expediente" && <Expediente atelier={atelier} clienta={clienta} alElegir={setClienta} alAgendar={() => setReservando(true)} />}
          {vista === "panel" && (
            <Panel
              atelier={atelier}
              filtro={filtroPanel}
              alFiltrar={setFiltroPanel}
              alVer={(id) => {
                setClienta(id);
                ir("expediente");
              }}
            />
          )}
        </main>

        <div className={conDock ? "al-con-dock" : undefined}>
          <Pie />
        </div>

        {conDock && !reservando && <Dock elegidos={elegidos} suc={suc} alSuc={setSuc} alElegirHora={() => setReservando(true)} alVaciar={() => setElegidos([])} />}
        {reservando && (
          <Reserva
            atelier={atelier}
            elegidos={elegidos}
            alAlternar={alternar}
            suc={suc}
            alSuc={setSuc}
            alCerrar={cerrarReserva}
            alConfirmada={(id) => {
              confirmada.current = true;
              setClienta(id);
            }}
            alIr={ir}
          />
        )}
      </div>
    </>
  );
}
