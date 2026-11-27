/*
 * Demo: Vértice Studio (tienda de ropa urbana inventada). Tres vistas en la misma dirección
 * que comparten datos en vivo: Tienda, Arma tu Outfit (#outfit) y Panel Admin (#admin).
 * De lo compartido entre demos solo usa la banda superior.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LayoutDashboard, Shirt, ShoppingBag, Store } from "lucide-react";
import { BandaDemos } from "../comun";
import { irA } from "../hotel/animar";
import { Admin, type Seccion } from "./Admin";
import { Bandeja } from "./Bandeja";
import { GuiaTallas, type Grupo } from "./GuiaTallas";
import { Logo, Pie } from "./Marca";
import { Outfit, type Eleccion } from "./Outfit";
import { Tienda } from "./Tienda";
import { nombreTalla, qz, totalesDe, unidadesEnOrden, useVertice, type Filtro, type Pieza, type Producto, type Talla } from "./datos";
import { ESTILOS, LETRAS } from "./estilos";

type Vista = "tienda" | "outfit" | "admin";
function leer(): Vista {
  const h = location.hash;
  if (h === "#admin" || h === "#panel") return "admin";
  if (h === "#outfit") return "outfit";
  return "tienda";
}

const VISTAS = [
  { id: "tienda", nombre: "Tienda", icono: Store },
  { id: "outfit", nombre: "Arma tu Outfit", icono: Shirt },
  { id: "admin", nombre: "Panel Admin", icono: LayoutDashboard },
] as const;

const TITULOS: Record<Vista, string> = {
  tienda: "Vértice Studio · Demo de Jzet Labs",
  outfit: "Arma tu Outfit · Vértice Studio",
  admin: "Panel Admin · Vértice Studio",
};

export default function RopaDemo() {
  const v = useVertice();
  const [vista, setVista] = useState<Vista>(leer);
  const [bandeja, setBandeja] = useState(false);
  const [guia, setGuia] = useState<Grupo | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todo");
  const [eleccion, setEleccion] = useState<Eleccion>({});
  const [seccion, setSeccion] = useState<Seccion>("ordenes");
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

  /* atrás y adelante del navegador */
  useEffect(() => {
    const cambio = () => {
      setBandeja(false);
      setGuia(null);
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
    const t = window.setTimeout(() => setAviso(""), 2600);
    return () => window.clearTimeout(t);
  }, [aviso]);

  function ir(nueva: Vista, seccionDestino = "") {
    setBandeja(false);
    if (nueva === vista) {
      if (seccionDestino) irA(seccionDestino);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    destino.current = seccionDestino;
    history.pushState(null, "", nueva === "tienda" ? location.pathname : `#${nueva}`);
    setVista(nueva);
  }

  function agregar(p: Producto, t: Talla) {
    v.agregar(p.id, t);
    setAviso(`Agregado: ${p.nombre}, talla ${nombreTalla(t)}`);
  }

  function pasarOutfit(piezas: Pieza[]) {
    v.agregarCombo(piezas);
    setEleccion({});
    setBandeja(true);
  }

  const verGuia = (p: Producto) => setGuia(p.categoria === "pantalones" ? "pantalones" : "superiores");
  const unidades = unidadesEnOrden(v.estado);
  const { total } = totalesDe(v.estado);
  const conBarra = vista === "tienda" && unidades > 0;

  return (
    <>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <div className="vx">
        <header className="vx-nav">
          <div className="vx-ancho vx-nav-fila">
            <button type="button" className="vx-nav-logo" onClick={() => ir("tienda")} aria-label="Vértice Studio, ir a la tienda">
              <Logo />
            </button>
            <nav className="vx-vistas" aria-label="Secciones">
              {VISTAS.map(({ id, nombre, icono: Icono }) => (
                <button key={id} type="button" aria-current={vista === id ? "page" : undefined} onClick={() => ir(id)}>
                  <Icono size={17} aria-hidden />
                  {nombre}
                </button>
              ))}
            </nav>
            <button type="button" className="vx-miorden" onClick={() => setBandeja(true)} aria-label={`Mi orden, ${unidades} prendas`} aria-haspopup="dialog">
              <ShoppingBag size={18} aria-hidden />
              Mi orden
              <i>{unidades}</i>
            </button>
          </div>
        </header>

        <main key={vista} className="vx-principal">
          {vista === "tienda" && (
            <Tienda v={v} filtro={filtro} alFiltrar={setFiltro} alAgregar={agregar} alGuia={verGuia} alCatalogo={() => irA("vx-catalogo")} alOutfit={() => ir("outfit")} />
          )}
          {vista === "outfit" && <Outfit v={v} eleccion={eleccion} alElegir={setEleccion} alPasar={pasarOutfit} alGuia={verGuia} />}
          {vista === "admin" && <Admin v={v} seccion={seccion} alSeccion={setSeccion} />}
        </main>

        <Pie conBarra={conBarra || vista === "outfit"} />

        <p className="vx-oculto" role="status">{aviso}</p>
        {/* en el celular, la orden queda a la mano mientras se ve el catálogo */}
        {conBarra && (
          <div className="vx-barra vx-oscuro">
            <div>
              <small>{aviso || `${unidades} ${unidades === 1 ? "prenda" : "prendas"} · con envío`}</small>
              <b>{qz(total)}</b>
            </div>
            <button type="button" className="vx-btn vx-blanco" onClick={() => setBandeja(true)}>
              Ver mi orden
            </button>
          </div>
        )}

        <Bandeja abierta={bandeja} v={v} alCerrar={() => setBandeja(false)} alCatalogo={() => ir("tienda", "vx-catalogo")} />
        <GuiaTallas grupo={guia} alCerrar={() => setGuia(null)} />
      </div>
    </>
  );
}
