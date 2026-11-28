/*
 * Demo: IronPeak Performance Club (gimnasio inventado, fotos de Unsplash). Tres vistas en la misma
 * dirección que comparten datos en vivo: Planes y Clases, Pase de Socio (#pase) y Panel Recepción
 * (#recepcion). El enlace de cobro (?socio=1002#pagar) abre la pasarela de ese socio.
 * De lo compartido entre demos solo usa la banda superior.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BandaDemos } from "../comun";
import { irA } from "./animar";
import { useClub, type PlanId } from "./datos";
import { Inicio } from "./Inicio";
import { Inscripcion } from "./Inscripcion";
import { Nav, SECCIONES, type Vista } from "./Nav";
import { Panel, type Filtro } from "./Panel";
import { Pase } from "./Pase";
import { Pie } from "./Pie";

const LETRAS = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";

/* van en la capa base para que las clases de cada pieza puedan cambiarlas */
const ESTILOS = `
@layer base {
  .ip { font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif; font-size: 1rem; line-height: 1.6; font-variant-numeric: lining-nums tabular-nums; }
  .ip h1, .ip h2, .ip h3 { font-family: inherit; color: #0F172A; }
  .ip :focus-visible { outline-color: #15803D; }
}
`;

/* "#socio" es el enlace de la versión anterior */
const leer = (): Vista => (location.hash === "#recepcion" ? "recepcion" : ["#pase", "#pagar", "#socio"].includes(location.hash) ? "pase" : "planes");

const TITULOS: Record<Vista, string> = {
  planes: "IronPeak Performance Club · Demo de Jzet Labs",
  pase: "Pase de Socio · IronPeak",
  recepcion: "Panel Recepción · IronPeak",
};

export default function GimnasioDemo() {
  const club = useClub();
  const [vista, setVista] = useState<Vista>(leer);
  const [socioId, setSocioId] = useState(() => Number(new URLSearchParams(location.search).get("socio")) || 1001);
  const [pagando, setPagando] = useState(() => location.hash === "#pagar" && club.socios.some((s) => s.id === socioId));
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [alta, setAlta] = useState<PlanId | null>(null);
  /* sección de la portada a la que hay que bajar cuando ya esté pintada */
  const destino = useRef(SECCIONES.find((s) => `#${s.id}` === location.hash)?.id ?? "");
  /* si el número del enlace no existe, se muestra el socio de siempre */
  const socio = club.socios.find((s) => s.id === socioId) ?? club.socios.find((s) => s.id === 1001)!;

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
      setAlta(null);
      setPagando(false);
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
    if (!id || vista !== "planes") return;
    const t = window.setTimeout(() => {
      destino.current = "";
      irA(id);
    }, 150);
    return () => window.clearTimeout(t);
  }, [vista]);

  function ir(nueva: Vista) {
    setAlta(null);
    setPagando(false);
    const direccion = nueva === "planes" ? location.pathname : `#${nueva}`;
    if (nueva === vista) {
      history.replaceState(null, "", direccion);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    history.pushState(null, "", direccion);
    setVista(nueva);
  }

  function irSeccion(id: string) {
    if (vista === "planes") {
      irA(id);
      return;
    }
    destino.current = id;
    ir("planes");
  }

  function verPase(id: number) {
    setSocioId(id);
    ir("pase");
  }

  return (
    <>
      <style>{ESTILOS}</style>
      <div className="relative z-50">
        <BandaDemos />
      </div>
      <div className="ip min-h-screen w-full overflow-x-clip bg-white text-slate-700">
        <Nav vista={vista} alVista={ir} alSeccion={irSeccion} alInscribirme={() => setAlta("ilimitado")} />

        <main className="overflow-x-hidden">
          {vista === "planes" && <Inicio club={club} socio={socio} alElegirPlan={setAlta} alPase={() => ir("pase")} />}
          {vista === "pase" && <Pase club={club} socio={socio} alElegir={setSocioId} alHorarios={() => irSeccion("horarios")} pagando={pagando} alPagar={setPagando} />}
          {vista === "recepcion" && <Panel club={club} filtro={filtro} alFiltrar={setFiltro} alVer={verPase} />}
        </main>

        <Pie />

        {alta && <Inscripcion club={club} planInicial={alta} alCerrar={() => setAlta(null)} alListo={setSocioId} alPase={() => ir("pase")} />}
      </div>
    </>
  );
}
