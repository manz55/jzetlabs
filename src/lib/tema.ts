/*
 * Modo claro / oscuro de la Home. Se guarda en localStorage ("jz-tema") y se
 * aplica como clase .oscuro en <html>. index.html la pone antes de pintar para
 * que no haya parpadeo. /web no usa esto: siempre es clara.
 */
import { useSyncExternalStore } from "react";

export type Tema = "claro" | "oscuro";
const CLAVE = "jz-tema";
const EVENTO = "jz-tema";

function leer(): Tema {
  return document.documentElement.classList.contains("oscuro") ? "oscuro" : "claro";
}

export function cambiarTema(t: Tema) {
  document.documentElement.classList.toggle("oscuro", t === "oscuro");
  try {
    localStorage.setItem(CLAVE, t);
  } catch {
    /* modo privado: no se guarda, pero igual cambia */
  }
  window.dispatchEvent(new Event(EVENTO));
}

function suscribir(cb: () => void) {
  window.addEventListener(EVENTO, cb);
  return () => window.removeEventListener(EVENTO, cb);
}

export function useTema(): Tema {
  return useSyncExternalStore(suscribir, leer, () => "claro");
}
