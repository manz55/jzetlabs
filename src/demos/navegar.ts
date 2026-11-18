/*
 * Cambiar de demo sin abrir otra página.
 * Cada demo sigue teniendo su propia dirección (/demos/clinica/, etc.) para compartir el link,
 * pero al tocar otra demo en la barra de arriba solo cambia lo de abajo, con una transición suave.
 */
import type { ComponentType } from "react";

type Demo = { titulo: string; carga: () => Promise<{ default: ComponentType }> };

export const RUTAS: Record<string, Demo> = {
  "/demos/perfil-belleza/": { titulo: "Tu perfil de belleza · Demo de Jzet Labs", carga: () => import("./perfil/PerfilDemo") },
  "/demos/salon/": { titulo: "Lirio Salón · Demo de Jzet Labs", carga: () => import("./salon/SalonDemo") },
  "/demos/cosmeticos/": { titulo: "Ámbar Cosmetics · Demo de Jzet Labs", carga: () => import("./cosmeticos/CosmeticosDemo") },
  "/demos/ropa/": { titulo: "Nómada Studio · Demo de Jzet Labs", carga: () => import("./ropa/RopaDemo") },
  "/demos/boutique/": { titulo: "Maison Solène · Demo de Jzet Labs", carga: () => import("./lujo/LujoDemo") },
  "/demos/fundadora/": { titulo: "Valeria Ríos · Fundadora · Demo de Jzet Labs", carga: () => import("./fundadora/FundadoraDemo") },
  "/demos/clinica/": { titulo: "Clínica Dental Aurora · Demo de Jzet Labs", carga: () => import("./clinica/ClinicaDemo") },
  "/demos/celulares/": { titulo: "Órbita Celulares · Demo de Jzet Labs", carga: () => import("./celulares/CelularesDemo") },
  "/demos/pasteleria/": { titulo: "Dulce Abril · Demo de Jzet Labs", carga: () => import("./pasteleria/PasteleriaDemo") },
  "/demos/gimnasio/": { titulo: "Spartan Force Gym · Demo de Jzet Labs", carga: () => import("./gimnasio/GimnasioDemo") },
  "/demos/restaurante/": { titulo: "Trattoria Sole · Demo de Jzet Labs", carga: () => import("./restaurante/RestauranteDemo") },
  "/demos/tiempo-compartido/": { titulo: "Costa Serena Club · Demo de Jzet Labs", carga: () => import("./tiempo/TiempoDemo") },
  "/demos/distribuidora/": { titulo: "Distribuidora El Volcán · Demo de Jzet Labs", carga: () => import("./distribuidora/DistribuidoraDemo") },
  "/demos/planilla/": { titulo: "Constructora Los Cedros · Demo de Jzet Labs", carga: () => import("./planilla/PlanillaDemo") },
  "/demos/eventos/": { titulo: "Fiestas La Ceiba · Demo de Jzet Labs", carga: () => import("./eventos/EventosDemo") },
  "/demos/pediatria/": { titulo: "Pediatría Semillita · Demo de Jzet Labs", carga: () => import("./pediatria/PediatriaDemo") },
  "/demos/medicina/": { titulo: "Consultorio Dr. Samayoa · Demo de Jzet Labs", carga: () => import("./medicina/MedicinaDemo") },
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
