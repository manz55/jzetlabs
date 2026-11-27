/*
 * Demo: Centro Pediátrico Los Álamos (negocio inventado). Tres vistas en la misma dirección
 * que comparten datos en vivo: Inicio (sitio público), Portal Padres (#portal) y
 * Panel Pediatra (#panel).
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { House, LayoutDashboard, UsersRound } from "lucide-react";
import { BandaDemos } from "../comun";
import { irA } from "../hotel/animar";
import type { Borrador } from "./Agendar";
import { CitaRapida, type PedidoRapido } from "./CitaRapida";
import { Inicio } from "./Inicio";
import { Logo, Pie } from "./Marca";
import { Panel } from "./Panel";
import { Portal } from "./Portal";
import { PEDIATRAS, useClinicaPediatrica } from "./datos";
import { ESTILOS, LETRAS } from "./estilos";

type Vista = "inicio" | "portal" | "panel";
/* #consultorio y #hijos son enlaces de la versión anterior */
function leer(): Vista {
  const h = location.hash;
  if (h === "#panel" || h === "#consultorio") return "panel";
  if (h === "#portal" || h === "#hijos") return "portal";
  return "inicio";
}

const VISTAS = [
  { id: "inicio", nombre: "Inicio", icono: House },
  { id: "portal", nombre: "Portal Padres", icono: UsersRound },
  { id: "panel", nombre: "Panel Pediatra", icono: LayoutDashboard },
] as const;

const ENLACES = [
  { id: "pa-servicios", nombre: "Servicios" },
  { id: "pa-doctora", nombre: "Doctora" },
  { id: "pa-ubicacion", nombre: "Ubicación" },
];

const TITULOS: Record<Vista, string> = {
  inicio: "Centro Pediátrico Los Álamos · Demo de Jzet Labs",
  portal: "Portal Padres · Centro Pediátrico Los Álamos",
  panel: "Panel Pediatra · Centro Pediátrico Los Álamos",
};

export default function PediatriaDemo() {
  const clinica = useClinicaPediatrica();
  const [vista, setVista] = useState<Vista>(leer);
  const [rapida, setRapida] = useState<PedidoRapido | null>(null);
  const [vacunas, setVacunas] = useState<string[]>([]);
  const [borrador, setBorrador] = useState<Borrador>({ motivo: "control", pediatraId: PEDIATRAS[0].id, meses: null, vez: 0 });
  /* sección a la que hay que bajar cuando la vista nueva ya esté pintada */
  const destino = useRef("");

  useLayoutEffect(() => {
    if (document.querySelector(`link[href="${LETRAS}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = LETRAS;
    document.head.appendChild(l);
  }, []);

  /* atrás y adelante del navegador */
  useEffect(() => {
    const cambio = () => setVista(leer());
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

  function ir(v: Vista, seccion = "") {
    setRapida(null);
    if (v === vista) {
      if (seccion) irA(seccion);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    destino.current = seccion;
    history.pushState(null, "", v === "inicio" ? location.pathname : `#${v}`);
    setVista(v);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <div className="pa">
      <style>{ESTILOS}</style>
      <BandaDemos />
      <header className="pa-nav">
        <div className="pa-ancho pa-nav-fila">
          <button type="button" aria-label="Centro Pediátrico Los Álamos, ir al inicio" onClick={() => ir("inicio")}>
            <Logo />
          </button>
          {vista === "inicio" && (
            <nav className="pa-nav-enlaces" aria-label="Secciones">
              {ENLACES.map((e) => (
                <button key={e.id} type="button" onClick={() => irA(e.id)}>
                  {e.nombre}
                </button>
              ))}
            </nav>
          )}
          <nav className="pa-vistas" aria-label="Vistas">
            {VISTAS.map((v) => (
              <button key={v.id} type="button" data-vista={v.id} aria-current={vista === v.id ? "page" : undefined} onClick={() => ir(v.id)}>
                <v.icono size={16} aria-hidden />
                {v.nombre}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {vista === "inicio" && (
        <Inicio
          alAgendar={(p) => setRapida({ motivo: "control", pediatraId: PEDIATRAS[0].id, ...p })}
          alPortal={(seccion) => ir("portal", seccion)}
        />
      )}
      {vista === "portal" && <Portal clinica={clinica} borrador={borrador} setBorrador={setBorrador} vacunas={vacunas} setVacunas={setVacunas} />}
      {vista === "panel" && <Panel clinica={clinica} />}
      <Pie conBarra={vista !== "panel"} />

      {rapida && <CitaRapida clinica={clinica} pedido={rapida} alCerrar={() => setRapida(null)} alPortal={() => ir("portal", "pa-micarne")} />}
    </div>
  );
}
