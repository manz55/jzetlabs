import { useSyncExternalStore } from "react";
import { hoyIso, type Cita, type Paciente, type Receta } from "./datos";
import { citasIniciales, pacientesIniciales, recetasIniciales } from "./semillas";

export type Expedientes = { dia: string; pacientes: Paciente[]; citas: Cita[]; recetas: Receta[] };

const CLAVE = "altamira-v1";

const inicial = (): Expedientes => ({ dia: hoyIso(), pacientes: pacientesIniciales(), citas: citasIniciales(), recetas: recetasIniciales() });

function guardado(): Expedientes | null {
  try {
    const e = JSON.parse(localStorage.getItem(CLAVE) ?? "null") as Expedientes | null;
    return e?.dia === hoyIso() ? e : null;
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

export const leer = () => guardado() ?? estado;

export function cambiar(fn: (e: Expedientes) => Expedientes) {
  estado = fn(leer());
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    // sin almacenamiento (modo privado) la demo sigue en memoria
  }
  oyentes.forEach((f) => f());
}

export const useExpedientes = () => useSyncExternalStore(suscribir, () => estado);

export const nuevoId = (prefijo: string) => `${prefijo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
