/*
 * Demo: Brasa & Maíz (restaurante inventado). Tres vistas en la misma dirección que
 * comparten datos en vivo: Menú y Mesas, Mi Pedido / Reserva (#pedido) y Panel Cocina
 * y Salón (#cocina). De lo compartido entre demos solo usa la banda superior.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CalendarDays, ChefHat, ReceiptText, UtensilsCrossed } from "lucide-react";
import { BandaDemos } from "../comun";
import { irA } from "./animar";
import { useBrasa, type Filtro, type ZonaId } from "./datos";
import { Dock, Hoja } from "./Dock";
import { ESTILOS, LETRAS } from "./estilos";
import { Inicio } from "./Inicio";
import { Panel, type Seccion } from "./Panel";
import { Pie } from "./Pie";
import { Logo } from "./Piezas";
import { Portal } from "./Portal";
import { Reserva } from "./Reserva";

type Vista = "menu" | "pedido" | "cocina";
function leer(): Vista {
  const h = location.hash;
  if (h === "#pedido") return "pedido";
  if (h === "#cocina" || h === "#panel") return "cocina";
  return "menu";
}

const VISTAS = [
  { id: "menu", nombre: "Menú y Mesas", corto: "Menú y Mesas", icono: UtensilsCrossed },
  { id: "pedido", nombre: "Mi Pedido / Reserva", corto: "Mi Pedido", icono: ReceiptText },
  { id: "cocina", nombre: "Panel Cocina y Salón", corto: "Cocina y Salón", icono: ChefHat },
] as const;

const TITULOS: Record<Vista, string> = {
  menu: "Brasa & Maíz · Demo de Jzet Labs",
  pedido: "Mi pedido y reserva · Brasa & Maíz",
  cocina: "Cocina y salón · Brasa & Maíz",
};

export default function RestauranteDemo() {
  const b = useBrasa();
  const [vista, setVista] = useState<Vista>(leer);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [hoja, setHoja] = useState(false);
  const [reserva, setReserva] = useState<ZonaId | null>(null);
  const [seccion, setSeccion] = useState<Seccion>("cocina");
  const [aviso, setAviso] = useState("");
  /* sección a la que hay que bajar cuando la vista nueva ya esté pintada */
  const destino = useRef("");

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
      setHoja(false);
      setReserva(null);
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
    if (!destino.current) return;
    const id = destino.current;
    const t = window.setTimeout(() => {
      destino.current = "";
      irA(id);
    }, 60);
    return () => window.clearTimeout(t);
  }, [vista]);

  useEffect(() => {
    if (!aviso) return;
    const t = window.setTimeout(() => setAviso(""), 2200);
    return () => window.clearTimeout(t);
  }, [aviso]);

  function ir(nueva: Vista, seccionDestino = "") {
    setHoja(false);
    if (nueva === vista) {
      if (seccionDestino) irA(seccionDestino);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    destino.current = seccionDestino;
    history.pushState(null, "", nueva === "menu" ? location.pathname : `#${nueva}`);
    setVista(nueva);
  }

  const { misPedidos, pedidos, lineas } = b.estado;
  const enCurso = pedidos.filter((p) => misPedidos.includes(p.codigo) && p.etapa !== "entregado").length;
  const conDock = vista === "menu" && lineas.length > 0;

  return (
    <>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <div className="bm">
        <header className="bm-nav">
          <div className="bm-ancho bm-nav-fila">
            <button type="button" className="bm-nav-logo" onClick={() => ir("menu")} aria-label="Brasa & Maíz, ir al menú">
              <Logo />
            </button>
            <nav className="bm-vistas" aria-label="Secciones">
              {VISTAS.map(({ id, nombre, corto, icono: Icono }) => (
                <button key={id} type="button" aria-current={vista === id ? "page" : undefined} onClick={() => ir(id)} aria-label={nombre}>
                  <Icono size={17} aria-hidden />
                  <span className="bm-largo">{nombre}</span>
                  <span className="bm-corto">{corto}</span>
                  {id === "pedido" && enCurso > 0 && <i>{enCurso}</i>}
                </button>
              ))}
            </nav>
            <button type="button" className="bm-btn bm-terra bm-nav-reservar" onClick={() => setReserva("salon")}>
              <CalendarDays size={17} aria-hidden />
              <span>
                Reservar<span className="bm-largo"> mesa</span>
              </span>
            </button>
          </div>
        </header>

        <main key={vista}>
          {vista === "menu" && (
            <Inicio
              b={b}
              filtro={filtro}
              alFiltrar={setFiltro}
              alReservar={(zona) => setReserva(zona ?? "salon")}
              alDomicilio={() => {
                b.ponerModo("domicilio");
                irA("bm-carta");
              }}
              alAgregar={(nombre) => setAviso(`Agregado: ${nombre}`)}
            />
          )}
          {vista === "pedido" && <Portal b={b} alMenu={() => ir("menu", "bm-carta")} alReservar={() => setReserva("salon")} />}
          {vista === "cocina" && <Panel b={b} seccion={seccion} alSeccion={setSeccion} />}
        </main>

        <Pie conDock={conDock} />

        <p className={`bm-aviso ${aviso ? "bm-se-ve" : ""} ${conDock ? "bm-sobre-dock" : ""}`} role="status">
          {aviso}
        </p>
        {conDock && <Dock b={b} alAbrir={() => setHoja(true)} />}
        <Hoja b={b} abierta={hoja} alCerrar={() => setHoja(false)} alSeguir={() => ir("pedido")} />
        {reserva && <Reserva b={b} zonaInicial={reserva} alCerrar={() => setReserva(null)} alVer={() => ir("pedido")} />}
      </div>
    </>
  );
}
