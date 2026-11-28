/*
 * Cambiar de demo sin abrir otra página.
 * Cada demo sigue teniendo su propia dirección (/demos/clinica/, etc.) para compartir el link,
 * pero al tocar otra demo en la barra de arriba solo cambia lo de abajo, con una transición suave.
 */
import type { ComponentType } from "react";

type Demo = { titulo: string; carga: () => Promise<{ default: ComponentType }> };

export const RUTAS: Record<string, Demo> = {
  "/demos/perfil-belleza/": { titulo: "Tu perfil de belleza · Demo de Jzet Labs", carga: () => import("./perfil/PerfilDemo") },
  "/demos/salon/": { titulo: "Atelier L’Art · Demo de Jzet Labs", carga: () => import("./salon/SalonDemo") },
  "/demos/cosmeticos/": { titulo: "Ámbar Cosmetics · Demo de Jzet Labs", carga: () => import("./cosmeticos/CosmeticosDemo") },
  "/demos/ropa/": { titulo: "Vértice Studio · Demo de Jzet Labs", carga: () => import("./ropa/RopaDemo") },
  "/demos/boutique/": { titulo: "Maison Solène · Demo de Jzet Labs", carga: () => import("./lujo/LujoDemo") },
  "/demos/fundadora/": { titulo: "Valeria Ríos · Fundadora · Demo de Jzet Labs", carga: () => import("./fundadora/FundadoraDemo") },
  "/demos/clinica/": { titulo: "Clínica Dental Valleverde · Demo de Jzet Labs", carga: () => import("./clinica/ClinicaDemo") },
  "/demos/celulares/": { titulo: "Nexus Mobile GT · Demo de Jzet Labs", carga: () => import("./celulares/CelularesDemo") },
  "/demos/pasteleria/": { titulo: "Dulce Abril · Demo de Jzet Labs", carga: () => import("./pasteleria/PasteleriaDemo") },
  "/demos/gimnasio/": { titulo: "IronPeak Performance Club · Demo de Jzet Labs", carga: () => import("./gimnasio/GimnasioDemo") },
  "/demos/restaurante/": { titulo: "Brasa & Maíz · Demo de Jzet Labs", carga: () => import("./restaurante/RestauranteDemo") },
  "/demos/tiempo-compartido/": { titulo: "Costa Serena Club · Demo de Jzet Labs", carga: () => import("./tiempo/TiempoDemo") },
  "/demos/distribuidora/": { titulo: "Distribuidora El Volcán · Demo de Jzet Labs", carga: () => import("./distribuidora/DistribuidoraDemo") },
  "/demos/planilla/": { titulo: "Constructora Los Cedros · Demo de Jzet Labs", carga: () => import("./planilla/PlanillaDemo") },
  "/demos/eventos/": { titulo: "Casa Imperial · Demo de Jzet Labs", carga: () => import("./eventos/EventosDemo") },
  "/demos/convivios/": { titulo: "TICKETFEST · Demo de Jzet Labs", carga: () => import("./convivios/ConviviosDemo") },
  "/demos/veterinaria/": { titulo: "Huella Vital · Demo de Jzet Labs", carga: () => import("./veterinaria/VeterinariaDemo") },
  "/demos/pediatria/": { titulo: "Centro Pediátrico Los Álamos · Demo de Jzet Labs", carga: () => import("./pediatria/PediatriaDemo") },
  "/demos/medicina/": { titulo: "Consultorio Dr. Samayoa · Demo de Jzet Labs", carga: () => import("./medicina/MedicinaDemo") },
  "/demos/oftalmologia/": { titulo: "Clínica Visual Lumen · Demo de Jzet Labs", carga: () => import("./oftalmologia/OftalmologiaDemo") },
  "/demos/taller-mecanico/": { titulo: "Autotech · Demo de Jzet Labs", carga: () => import("./taller/TallerDemo") },
  "/demos/hotel/": { titulo: "Posada Casa del Volcán · Demo de Jzet Labs", carga: () => import("./hotel/HotelDemo") },
  "/demos/medio-comunicacion/": { titulo: "Crónica Central · Demo de Jzet Labs", carga: () => import("./medio/MedioDemo") },
  "/demos/ferreteria/": { titulo: "Grupo Ferretero Industek · Demo de Jzet Labs", carga: () => import("./ferreteria/FerreteriaDemo") },
};

export const normalizar = (ruta: string) => (ruta.endsWith("/") ? ruta : ruta + "/");

const cargadas = new Map<string, ComponentType>();
type Mostrar = (ruta: string, C: ComponentType) => void;
let mostrar: Mostrar | null = null;

export function registrar(ruta: string, C: ComponentType, fn: Mostrar) {
  cargadas.set(ruta, C);
  mostrar = fn;
}

/* Trae el código de una demo antes de que la toquen, para que el cambio sea inmediato */
export function precargar(href: string) {
  const ruta = normalizar(new URL(href, location.href).pathname);
  const d = RUTAS[ruta];
  if (!d || cargadas.has(ruta)) return;
  d.carga()
    .then((m) => cargadas.set(ruta, m.default))
    .catch(() => {});
}

/* Cambia a otra demo. Devuelve false si no la conoce (entonces el link abre normal). */
export function irADemo(href: string, empujar = true) {
  const url = new URL(href, location.href);
  const ruta = normalizar(url.pathname);
  const d = RUTAS[ruta];
  if (!d || !mostrar || url.origin !== location.origin) return false;
  const pintar = mostrar;
  void (async () => {
    let C = cargadas.get(ruta);
    if (!C) {
      try {
        C = (await d.carga()).default;
      } catch {
        location.href = url.href;
        return;
      }
      cargadas.set(ruta, C);
    }
    const cambiar = () => {
      if (empujar) history.pushState(null, "", url.pathname + url.hash);
      document.title = d.titulo;
      pintar(ruta, C);
      window.scrollTo(0, 0);
    };
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !quieto) document.startViewTransition(cambiar);
    else cambiar();
  })();
  return true;
}
