import { useSyncExternalStore } from "react";
import { hoyIso } from "./agenda";
import type { Cita, Orden, Paciente } from "./datos";
import { citasIniciales, cobrosIniciales, ordenesIniciales, pacientesIniciales, type Cobro } from "./semillas";

export type Clinica = {
  dia: string;
  pacientes: Paciente[];
  citas: Cita[];
  ordenes: Orden[];
  cobros: Cobro[];
  porApartar: string[];
  citaDelVisitante: string;
};

const CLAVE = "claravista-v1";

const inicial = (): Clinica => ({
  dia: hoyIso(),
  pacientes: pacientesIniciales(),
  citas: citasIniciales(),
  ordenes: ordenesIniciales(),
  cobros: cobrosIniciales(),
  porApartar: [],
  citaDelVisitante: "",
});

function guardado(): Clinica | null {
  try {
    const c = JSON.parse(localStorage.getItem(CLAVE) ?? "null") as Clinica | null;
    return c?.dia === hoyIso() ? c : null;
  } catch {
    return null;
  }
}

let estado = guardado() ?? inicial();
const oyentes = new Set<() => void>();

function suscribir(oyente: () => void) {
  const otraPestana = (e: StorageEvent) => {
    if (e.key !== CLAVE) return;
    estado = guardado() ?? estado;
    oyente();
  };
  oyentes.add(oyente);
  addEventListener("storage", otraPestana);
  return () => {
    oyentes.delete(oyente);
    removeEventListener("storage", otraPestana);
  };
}

export function cambiar(fn: (c: Clinica) => Clinica) {
  estado = fn(guardado() ?? estado);
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    // sin almacenamiento (modo privado) la demo sigue en memoria
  }
  oyentes.forEach((f) => f());
}

export const useAlmacen = () => useSyncExternalStore(suscribir, () => estado);

export const nuevoId = (prefijo: string) => `${prefijo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
