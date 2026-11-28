import { useSyncExternalStore } from "react";
import { CLIENTA, hoyIso, type Cargo, type Cita, type Horario, type Mascota, type Pedido } from "./datos";
import { citasIniciales, mascotasIniciales, pedidosIniciales } from "./semillas";

export type Clinica = {
  dia: string;
  mascotas: Mascota[];
  citas: Cita[];
  cargos: Cargo[];
  pedidos: Pedido[];
  bloqueos: Horario[];
  recordados: string[];
  direccion: string;
};

const CLAVE = "huella-vital-v3";

const inicial = (): Clinica => ({
  dia: hoyIso(),
  mascotas: mascotasIniciales(),
  citas: citasIniciales(),
  cargos: [],
  pedidos: pedidosIniciales(),
  bloqueos: [],
  recordados: [],
  direccion: CLIENTA.direccion,
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
