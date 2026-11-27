/*
 * Demo: Nexus Mobile GT (tienda de celulares inventada). Tres vistas en la misma dirección
 * que comparten datos en vivo: Tienda, Reparaciones (#reparaciones) y Panel Admin (#admin).
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LayoutDashboard, ShoppingBag, Store, Wrench } from "lucide-react";
import { BandaDemos } from "../comun";
import { irA, useEntradaVista } from "./animar";
import { BandejaComparar, Comparador } from "./Comparador";
import { FichaEquipo, type Abierta } from "./FichaEquipo";
import { Logo, Pie } from "./Marca";
import { MiOrden } from "./Orden";
import { Panel, type Seccion } from "./Panel";
import { Reparaciones } from "./Reparaciones";
import { Tienda } from "./Tienda";
import { abonoDe, nombreDe, qz, totalDe, useNexus } from "./datos";
import { ESTILOS, LETRAS } from "./estilos";

type Vista = "tienda" | "reparaciones" | "admin";
function leer(): Vista {
  const h = location.hash;
  if (h === "#admin" || h === "#panel") return "admin";
  if (h.startsWith("#reparaciones") || h === "#taller") return "reparaciones";
  return "tienda";
}
/* enlace que se manda por WhatsApp: #reparaciones/ORD-408 */
const ordenDelEnlace = () => location.hash.match(/^#reparaciones\/(ORD-\d+)$/i)?.[1].toUpperCase();

const VISTAS = [
  { id: "tienda", nombre: "Tienda", icono: Store },
  { id: "reparaciones", nombre: "Reparaciones", icono: Wrench },
  { id: "admin", nombre: "Panel Admin", icono: LayoutDashboard },
] as const;

const TITULOS: Record<Vista, string> = {
  tienda: "Nexus Mobile GT · Demo de Jzet Labs",
  reparaciones: "Taller técnico · Nexus Mobile GT",
  admin: "Panel Admin · Nexus Mobile GT",
};

export default function CelularesDemo() {
  const n = useNexus();
  const [vista, setVista] = useState<Vista>(leer);
  const [ordenAbierta, setOrdenAbierta] = useState(false);
  /* el rastreador abre con una orden en curso a la vista */
  const [codigo, setCodigo] = useState(() => ordenDelEnlace() ?? "ORD-408");
  const [ficha, setFicha] = useState<Abierta | null>(null);
  const [comparados, setComparados] = useState<string[]>([]);
  const [comparando, setComparando] = useState(false);
  const [seccion, setSeccion] = useState<Seccion>("ordenes");
  const [aviso, setAviso] = useState("");
  /* sección a la que hay que bajar cuando la vista nueva ya esté pintada */
  const destino = useRef(ordenDelEnlace() ? "nx-rastreo" : "");
  const principal = useRef<HTMLElement>(null);
  useEntradaVista(principal, vista);

  useLayoutEffect(() => {
    if (document.querySelector(`link[href="${LETRAS}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = LETRAS;
    document.head.appendChild(l);
  }, []);

  /* cada vista empieza arriba: sin esto, al volver atrás o recargar el título queda bajo el menú */
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
      setOrdenAbierta(false);
      setFicha(null);
      setComparando(false);
      setVista(leer());
      const orden = ordenDelEnlace();
      if (orden) setCodigo(orden);
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

  /* lo que se anuncia al agregar un equipo se quita solo */
  useEffect(() => {
    if (!aviso) return;
    const t = window.setTimeout(() => setAviso(""), 2600);
    return () => window.clearTimeout(t);
  }, [aviso]);

  function ir(v: Vista, seccionDestino = "") {
    setOrdenAbierta(false);
    setFicha(null);
    setComparando(false);
    if (v === vista) {
      if (seccionDestino) irA(seccionDestino);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    destino.current = seccionDestino;
    history.pushState(null, "", v === "tienda" ? location.pathname : `#${v}`);
    setVista(v);
  }

  function agregar(clave: string) {
    n.ponerCantidad(clave, (n.lineas.find((l) => l.clave === clave)?.cantidad ?? 0) + 1);
    setAviso(`Agregado: ${nombreDe(clave)}`);
  }

  const comparar = (id: string) => setComparados((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length < 2 ? [...c, id] : c));
  const verOrden = () => {
    setFicha(null);
    setComparando(false);
    setOrdenAbierta(true);
  };
  const verFicha = (id: string, cap: Abierta["cap"], color?: string) => {
    setComparando(false);
    setFicha({ id, cap, color });
  };

  const conBarra = vista === "tienda" && n.articulos > 0;
  const conBandeja = vista === "tienda" && comparados.length > 0;

  return (
    <>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <div className="nx">
        <header className="nx-nav">
          <div className="nx-ancho nx-nav-fila">
            <button type="button" className="nx-nav-logo" onClick={() => ir("tienda")} aria-label="Nexus Mobile GT, ir a la tienda">
              <Logo />
            </button>
            <nav className="nx-vistas" aria-label="Secciones">
              {VISTAS.map(({ id, nombre, icono: Icono }) => (
                <button key={id} type="button" aria-current={vista === id ? "page" : undefined} onClick={() => ir(id)}>
                  <Icono size={17} aria-hidden />
                  {nombre}
                </button>
              ))}
            </nav>
            <button type="button" className="nx-miorden" onClick={() => setOrdenAbierta(true)} aria-label={`Mi Orden, ${n.articulos} artículos`}>
              <ShoppingBag size={18} aria-hidden />
              Mi Orden
              <i>{n.articulos}</i>
            </button>
          </div>
        </header>

        <main ref={principal}>
          {vista === "tienda" && <Tienda n={n} alAgregar={agregar} alFicha={verFicha} alComparar={comparar} comparados={comparados} alVerOrden={verOrden} alTaller={() => ir("reparaciones")} />}
          {vista === "reparaciones" && <Reparaciones n={n} codigo={codigo} alCodigo={setCodigo} />}
          {vista === "admin" && (
            <Panel
              n={n}
              seccion={seccion}
              alSeccion={setSeccion}
              alVerOrden={(id) => {
                setCodigo(id);
                ir("reparaciones", "nx-rastreo");
              }}
            />
          )}
        </main>

        <Pie conBarra={conBarra} conBandeja={conBandeja} />

        <p className="nx-oculto" role="status">
          {aviso}
        </p>
        {/* abajo, a la mano: la comparación en curso y, en el celular, la orden */}
        {(conBarra || conBandeja) && (
          <div className="nx-flotante">
            {conBandeja && <BandejaComparar ids={comparados} alQuitar={comparar} alAbrir={() => setComparando(true)} />}
            {conBarra && (
              <div className="nx-barra nx-oscuro">
                <div>
                  <small>{aviso || `${n.articulos} ${n.articulos === 1 ? "artículo" : "artículos"}`}</small>
                  <b>{qz(totalDe({ lineas: n.lineas, entrega: "tienda", retoma: { abono: abonoDe(n.lineas, n.retoma) } }))}</b>
                </div>
                <button type="button" className="nx-btn nx-azul" onClick={verOrden}>
                  Ver mi orden
                </button>
              </div>
            )}
          </div>
        )}

        <FichaEquipo n={n} abierta={ficha} comparados={comparados} alCerrar={() => setFicha(null)} alAgregar={agregar} alComparar={comparar} alVerOrden={verOrden} />
        <Comparador abierto={comparando} n={n} ids={comparados} alCerrar={() => setComparando(false)} alAgregar={agregar} alFicha={verFicha} />
        <MiOrden abierta={ordenAbierta} n={n} alCerrar={() => setOrdenAbierta(false)} alCatalogo={() => ir("tienda", "nx-catalogo")} />
      </div>
    </>
  );
}
