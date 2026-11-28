/*
 * Barra fija. En pantallas anchas: logotipo, las tres vistas, accesos a la portada y "Agendar cita".
 * En celular, tableta y laptop angosta: logotipo, "Agendar cita" y un menú desplegable.
 */
import { useEffect, useRef, useState } from "react";
import { ClipboardList, LayoutDashboard, Menu, Scissors, X } from "lucide-react";
import { Logo } from "./Piezas";

export type Vista = "servicios" | "expediente" | "panel";

const VISTAS = [
  { id: "servicios", nombre: "Servicios y Citas", icono: Scissors },
  { id: "expediente", nombre: "Expediente Capilar", icono: ClipboardList },
  { id: "panel", nombre: "Panel Salón", icono: LayoutDashboard },
] as const;

const ACCESOS = [
  { id: "al-diagnostico", nombre: "Diagnóstico" },
  { id: "al-servicios", nombre: "Servicios" },
  { id: "al-garantias", nombre: "Garantías" },
  { id: "al-sucursales", nombre: "Sucursales" },
];

export const ANCHA = "(min-width: 1240px)";

export function Nav({ vista, pendientes, alVista, alSeccion, alAgendar }: { vista: Vista; pendientes: number; alVista: (v: Vista) => void; alSeccion: (id: string) => void; alAgendar: () => void }) {
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
    const ancha = matchMedia(ANCHA);
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

  const vistas = VISTAS.map(({ id, nombre, icono: Icono }) => (
    <button key={id} type="button" aria-current={vista === id ? "page" : undefined} onClick={elegir(() => alVista(id))}>
      <Icono size={16} aria-hidden />
      <span>{nombre}</span>
      {id === "panel" && pendientes > 0 && (
        <i title={`${pendientes} por confirmar`}>
          {pendientes}
          <em className="al-oculto"> por confirmar</em>
        </i>
      )}
    </button>
  ));

  const accesos = ACCESOS.map((a) => (
    <button key={a.id} type="button" onClick={elegir(() => alSeccion(a.id))}>
      {a.nombre}
    </button>
  ));

  return (
    <header ref={barra} className="al-nav">
      <div className="al-nav-fila">
        <button type="button" className="al-nav-logo" onClick={elegir(() => alVista("servicios"))} aria-label="Atelier L’Art, ir al inicio">
          <Logo />
        </button>

        <div className="al-nav-centro">
          <nav className="al-vistas" aria-label="Vistas">
            {vistas}
          </nav>
          {vista === "servicios" && (
            <nav className="al-accesos" aria-label="Secciones de la portada">
              {accesos}
            </nav>
          )}
        </div>

        <div className="al-nav-derecha">
          <button type="button" className="al-btn al-terra al-nav-agendar" onClick={elegir(alAgendar)}>
            Agendar cita
          </button>
          <button ref={boton} type="button" className="al-nav-menu" aria-expanded={abierto} aria-controls="al-menu" aria-label={abierto ? "Cerrar menú" : "Abrir menú"} onClick={() => setAbierto((v) => !v)}>
            {abierto ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </div>

      {abierto && (
        <div id="al-menu" className="al-menu">
          <nav className="al-menu-vistas" aria-label="Vistas">
            {vistas}
          </nav>
          <p>En la portada</p>
          <nav className="al-menu-accesos" aria-label="Secciones de la portada">
            {accesos}
          </nav>
        </div>
      )}
    </header>
  );
}
