/*
 * Barra de navegación fija. En compu: logo, las tres vistas, accesos a la portada y auxilio.
 * En celular y tableta: logo, auxilio y un menú desplegable con todo.
 */
import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, Menu, Search, Truck, Wrench, X } from "lucide-react";
import { Logo } from "./Piezas";

export type Vista = "taller" | "seguimiento" | "panel";

const VISTAS = [
  { id: "taller", nombre: "Taller y Auxilio", icono: Wrench },
  { id: "seguimiento", nombre: "Seguimiento por Placa", icono: Search },
  { id: "panel", nombre: "Panel Taller", icono: LayoutDashboard },
] as const;

const ACCESOS = [
  { id: "at-marcas", nombre: "Marcas" },
  { id: "at-calidad", nombre: "Repuestos" },
  { id: "at-servicios", nombre: "Servicios" },
  { id: "at-ubicacion", nombre: "Ubicación" },
];

export function Nav({
  vista,
  placas,
  porAprobar,
  alVista,
  alSeccion,
  alAuxilio,
}: {
  vista: Vista;
  placas: number;
  porAprobar: number;
  alVista: (v: Vista) => void;
  alSeccion: (id: string) => void;
  alAuxilio: () => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const barra = useRef<HTMLElement>(null);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => setAbierto(false), [vista]);
  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAbierto(false);
      boton.current?.focus();
    };
    const fuera = (e: PointerEvent) => {
      if (!barra.current?.contains(e.target as Node)) setAbierto(false);
    };
    /* al agrandar la ventana el menú deja de hacer falta */
    const ancha = matchMedia("(min-width: 1280px)");
    const crecio = () => ancha.matches && setAbierto(false);
    addEventListener("keydown", tecla);
    addEventListener("pointerdown", fuera);
    ancha.addEventListener("change", crecio);
    return () => {
      removeEventListener("keydown", tecla);
      removeEventListener("pointerdown", fuera);
      ancha.removeEventListener("change", crecio);
    };
  }, [abierto]);

  const elegir = (accion: () => void) => () => {
    setAbierto(false);
    accion();
  };

  const vistas = VISTAS.map(({ id, nombre, icono: Icono }) => {
    const cuenta = id === "seguimiento" ? placas : id === "panel" ? porAprobar : 0;
    const que = id === "seguimiento" ? "placas activas" : "pendientes de aprobación";
    return (
      <button key={id} type="button" aria-current={vista === id ? "page" : undefined} onClick={elegir(() => alVista(id))}>
        <Icono size={17} aria-hidden />
        <span>{nombre}</span>
        {cuenta > 0 && (
          <i className={id === "panel" ? "at-badge-espera" : undefined} title={`${cuenta} ${que}`}>
            {cuenta}
            <em className="at-oculto"> {que}</em>
          </i>
        )}
      </button>
    );
  });

  const accesos = ACCESOS.map((a) => (
    <button key={a.id} type="button" onClick={elegir(() => alSeccion(a.id))}>
      {a.nombre}
    </button>
  ));

  return (
    <header ref={barra} className="at-nav">
      <div className="at-nav-fila">
        <button type="button" className="at-nav-logo" onClick={elegir(() => alVista("taller"))} aria-label="Autotech, servicio certificado: ir al inicio">
          <Logo />
        </button>

        <div className="at-nav-centro">
          <nav className="at-vistas" aria-label="Vistas">
            {vistas}
          </nav>
          {vista === "taller" && (
            <nav className="at-accesos-nav" aria-label="Secciones de la portada">
              {accesos}
            </nav>
          )}
        </div>

        <div className="at-nav-derecha">
          <button type="button" className="at-btn at-rojo at-nav-auxilio" onClick={elegir(alAuxilio)}>
            <Truck size={17} aria-hidden />
            <span>
              <span className="at-nav-palabra">Auxilio </span>24/7
            </span>
          </button>
          <button ref={boton} type="button" className="at-nav-menu" aria-expanded={abierto} aria-controls="at-menu" aria-label={abierto ? "Cerrar menú" : "Abrir menú"} onClick={() => setAbierto((v) => !v)}>
            {abierto ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </div>

      {abierto && (
        <div id="at-menu" className="at-menu">
          <nav className="at-menu-vistas" aria-label="Vistas">
            {vistas}
          </nav>
          <p>En la portada</p>
          <nav className="at-menu-accesos" aria-label="Secciones de la portada">
            {accesos}
          </nav>
          <button type="button" className="at-btn at-rojo at-lleno at-grande" onClick={elegir(alAuxilio)}>
            <Truck size={19} aria-hidden /> Auxilio vial 24/7
          </button>
        </div>
      )}
    </header>
  );
}
