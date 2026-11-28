import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { BandaDemos } from "../comun";
import { irA } from "./animar";
import { Caja, type Modo } from "./Caja";
import { CargaStock } from "./CargaStock";
import { Cierre } from "./Cierre";
import { SECCIONES, cuentaVacia, pendientesDe, useFeria } from "./datos";
import { Menu } from "./Menu";
import { Nav, type Vista } from "./Nav";
import { Pie } from "./Pie";
import { ComoFunciona, Eventos, Hero } from "./Portada";
import "./convivios.css";

const TEMA = {
  "--font-titulo": '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  "--color-tinta": "#18181B",
  "--color-acento": "#B91C1C",
  fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  fontVariantNumeric: "lining-nums tabular-nums",
} as CSSProperties;

const TITULOS: Record<Vista, string> = {
  menu: "TICKETFEST · Demo de Jzet Labs",
  caja: "Caja y Despacho · TICKETFEST",
  cierre: "Cierre del Evento · TICKETFEST",
};

const leerVista = (): Vista => (["#caja", "#despacho"].includes(location.hash) ? "caja" : location.hash === "#cierre" ? "cierre" : "menu");
const leerModo = (): Modo => (location.hash === "#despacho" ? "despacho" : "cobros");
const seccionDeLaDireccion = () => SECCIONES.find((s) => `#${s.id}` === location.hash)?.id ?? "";

export default function ConviviosDemo() {
  const feria = useFeria();
  const [vista, setVista] = useState<Vista>(leerVista);
  const [modo, setModo] = useState<Modo>(leerModo);
  const [cuenta, setCuenta] = useState(cuentaVacia);
  const destino = useRef(seccionDeLaDireccion());

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
      destino.current = seccionDeLaDireccion() || destino.current;
      setVista(leerVista());
      setModo(leerModo());
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
    // se espera a que el esqueleto de la carta cambie por las tarjetas, porque mueve las secciones
    const t = window.setTimeout(() => {
      destino.current = "";
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    }, 450);
    return () => window.clearTimeout(t);
  }, [vista]);

  function ir(nueva: Vista, nuevoModo: Modo = "cobros") {
    const direccion = nueva === "menu" ? location.pathname : nueva === "cierre" ? "#cierre" : nuevoModo === "despacho" ? "#despacho" : "#caja";
    if (nueva === vista) history.replaceState(null, "", direccion);
    else history.pushState(null, "", direccion);
    setModo(nuevoModo);
    if (nueva === vista) window.scrollTo({ top: 0, behavior: "smooth" });
    else setVista(nueva);
  }

  function irSeccion(id: string) {
    if (vista === "menu") {
      irA(id);
      return;
    }
    destino.current = id;
    ir("menu");
  }

  function cambiarModo(nuevo: Modo) {
    history.replaceState(null, "", nuevo === "despacho" ? "#despacho" : "#caja");
    setModo(nuevo);
  }

  return (
    <>
      <div className="relative z-50">
        <BandaDemos />
      </div>
      <div style={TEMA} className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-[#FFFDFB] text-base leading-relaxed text-[#3F3F46]">
        <Nav vista={vista} pendientes={pendientesDe(feria.tickets, "todos").length} alVista={(v) => ir(v)} alSeccion={irSeccion} />
        <main className="flex-1">
          {vista === "menu" && (
            <>
              <Hero feria={feria} alCaja={() => ir("caja")} alMenu={() => irSeccion("stands-menu")} />
              <ComoFunciona />
              <Menu feria={feria} />
              <CargaStock feria={feria} />
              <Eventos alCaja={() => ir("caja")} alCierre={() => ir("cierre")} />
            </>
          )}
          {vista === "caja" && <Caja feria={feria} modo={modo} alModo={cambiarModo} cuenta={cuenta} alCuenta={setCuenta} />}
          {vista === "cierre" && <Cierre feria={feria} alCaja={() => ir("caja")} alDespacho={() => ir("caja", "despacho")} alStock={() => irSeccion("carga-stock")} />}
        </main>
        <Pie />
      </div>
    </>
  );
}
