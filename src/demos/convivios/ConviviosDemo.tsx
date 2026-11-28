import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { BandaDemos } from "../comun";
import { irA } from "./animar";
import { Admin, type Pestana } from "./Admin";
import { Caja, type Modo } from "./Caja";
import { SECCIONES, cuentaVacia, pendientesDe, useFeria } from "./datos";
import { Menu } from "./Menu";
import { Nav, type Vista } from "./Nav";
import { Pie } from "./Pie";
import { Flujo, Hero } from "./Portada";
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
  admin: "Admin y Cierre · TICKETFEST",
};

const leerVista = (): Vista => (["#caja", "#despacho"].includes(location.hash) ? "caja" : ["#cierre", "#gestion-menu"].includes(location.hash) ? "admin" : "menu");
const leerModo = (): Modo => (location.hash === "#despacho" ? "despacho" : "cobros");
const leerPestana = (): Pestana => (location.hash === "#gestion-menu" ? "gestion" : "cierre");
const seccionDeLaDireccion = () => SECCIONES.find((s) => `#${s.id}` === location.hash)?.id ?? "";
const DIRECCIONES: Record<Vista, string> = { menu: "", caja: "#caja", admin: "#cierre" };

export default function ConviviosDemo() {
  const feria = useFeria();
  const [vista, setVista] = useState<Vista>(leerVista);
  const [modo, setModo] = useState<Modo>(leerModo);
  const [cuenta, setCuenta] = useState(cuentaVacia);
  const [pestana, setPestana] = useState<Pestana>(leerPestana);
  const [enVivo, setEnVivo] = useState(false);
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
      setPestana(leerPestana());
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

  function ir(direccion: string) {
    const seccion = SECCIONES.find((s) => `#${s.id}` === direccion)?.id;
    if (seccion) {
      irSeccion(seccion);
      return;
    }
    const antes = leerVista();
    const url = direccion || location.pathname;
    history[direccion === location.hash ? "replaceState" : "pushState"](null, "", url);
    setModo(leerModo());
    setPestana(leerPestana());
    if (leerVista() === antes) window.scrollTo({ top: 0, behavior: "smooth" });
    setVista(leerVista());
  }

  function irSeccion(id: string) {
    if (vista === "menu") {
      irA(id);
      return;
    }
    destino.current = id;
    history.pushState(null, "", location.pathname);
    setVista("menu");
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
        <Nav vista={vista} pendientes={pendientesDe(feria.tickets, "todos").length} alVista={(v) => ir(DIRECCIONES[v])} alSeccion={irSeccion} />
        <main className="flex-1">
          {vista === "menu" && (
            <>
              <Hero feria={feria} alCaja={() => ir("#caja")} alStands={() => ir("#despacho")} />
              <Flujo />
              <Menu feria={feria} enVivo={enVivo} alCambiar={setEnVivo} />
            </>
          )}
          {vista === "caja" && <Caja feria={feria} modo={modo} alModo={cambiarModo} cuenta={cuenta} alCuenta={setCuenta} />}
          {vista === "admin" && <Admin feria={feria} pestana={pestana} ir={ir} />}
        </main>
        <Pie />
      </div>
    </>
  );
}
