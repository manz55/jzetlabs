import { useSyncExternalStore } from "react";
import {
  AREAS,
  CLIENTA,
  ESTACIONES,
  IDS_ESTACION,
  PRODUCTOS,
  SERVICIOS,
  citasIniciales,
  diasHasta,
  hoyIso,
  mascotasIniciales,
  sumarMeses,
  VACUNAS,
  type Area,
  type Cargo,
  type Cita,
  type Especie,
  type Estacion,
  type Estado,
  type Mascota,
  type Metodo,
  type ServicioId,
} from "./datos";

type Clinica = {
  dia: string;
  mascotas: Mascota[];
  citas: Cita[];
  cargos: Cargo[];
  recordados: string[];
};

const CLAVE = "huella-vital-v2";

const inicial = (): Clinica => ({ dia: hoyIso(), mascotas: mascotasIniciales(), citas: citasIniciales(), cargos: [], recordados: [] });

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

function cambiar(fn: (c: Clinica) => Clinica) {
  estado = fn(guardado() ?? estado);
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    // sin almacenamiento (modo privado) la demo sigue en memoria
  }
  oyentes.forEach((f) => f());
}

const nuevoId = (prefijo: string) => `${prefijo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export const porHorario = (a: Cita, b: Cita) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora);

export function horasLibres(citas: Cita[], area: Area, fecha: string, exceptoId?: string) {
  if (!fecha || fecha < hoyIso()) return [];
  return AREAS[area].horas.filter(
    (hora) => citas.filter((c) => c.id !== exceptoId && c.fecha === fecha && c.hora === hora && SERVICIOS[c.servicio].area === area).length < AREAS[area].capacidad,
  );
}

export type Solicitud = { nombre: string; especie: Especie; servicio: ServicioId; fecha: string; hora: string };

export const solicitudVacia = (): Solicitud => ({ nombre: "", especie: "perro", servicio: "consulta", fecha: hoyIso(), hora: "" });

export type DatosPaciente = { nombre: string; especie: Especie; raza: string; dueno: string; telefono: string };

const mismoNombre = (a: string, b: string) => a.trim().localeCompare(b.trim(), "es", { sensitivity: "base" }) === 0;

function fichaNueva({ nombre, especie, raza, dueno, telefono }: DatosPaciente): Mascota {
  return {
    id: nuevoId("m"),
    nombre: nombre.trim().replace(/^./, (l) => l.toUpperCase()),
    especie,
    raza: raza.trim() || (especie === "perro" ? "Perro" : "Gato"),
    edad: "Paciente nuevo",
    dueno: dueno.trim(),
    telefono: telefono.trim(),
    pesos: [],
    vacunas: [],
  };
}

function agendar({ nombre, especie, servicio, fecha, hora }: Solicitud, desdeClinica: { mascotaId?: string } = {}) {
  let creada: Cita | null = null;
  cambiar((c) => {
    if (!horasLibres(c.citas, SERVICIOS[servicio].area, fecha).includes(hora)) return c;
    const existente = c.mascotas.find((m) =>
      desdeClinica.mascotaId ? m.id === desdeClinica.mascotaId : m.dueno === CLIENTA.nombre && m.especie === especie && mismoNombre(m.nombre, nombre),
    );
    const mascota = existente ?? fichaNueva({ nombre, especie, raza: "", dueno: CLIENTA.nombre, telefono: CLIENTA.telefono });
    creada = { id: nuevoId("c"), mascotaId: mascota.id, servicio, fecha, hora, estado: "espera", desdeWeb: !desdeClinica.mascotaId };
    return { ...c, mascotas: existente ? c.mascotas : [...c.mascotas, mascota], citas: [...c.citas, creada] };
  });
  return creada as Cita | null;
}

function registrarPaciente(datos: DatosPaciente, horaDeHoy: string) {
  const mascota = fichaNueva(datos);
  cambiar((c) => ({
    ...c,
    mascotas: [...c.mascotas, mascota],
    citas: horaDeHoy ? [...c.citas, { id: nuevoId("c"), mascotaId: mascota.id, servicio: "consulta", fecha: hoyIso(), hora: horaDeHoy, estado: "espera" }] : c.citas,
  }));
  return mascota;
}

export function estacionLibre(citas: Cita[], cita: Cita) {
  const area = SERVICIOS[cita.servicio].area;
  const ocupantes = (id: Estacion) => citas.filter((c) => c.id !== cita.id && c.fecha === hoyIso() && c.estado === "atencion" && c.estacion === id).length;
  return IDS_ESTACION.find((id) => ESTACIONES[id].area === area && ocupantes(id) < ESTACIONES[id].cupo);
}

function cambiarEstado(citaId: string, nuevo: Estado) {
  let cambiado = false;
  cambiar((c) => {
    const cita = c.citas.find((x) => x.id === citaId);
    if (!cita || cita.cobro) return c;
    const estacion = nuevo === "atencion" ? estacionLibre(c.citas, cita) : undefined;
    if (nuevo === "atencion" && !estacion) return c;
    cambiado = true;
    return { ...c, citas: c.citas.map((x) => (x.id === citaId ? { ...x, estado: nuevo, estacion } : x)) };
  });
  return cambiado;
}

function reprogramar(citaId: string, fecha: string, hora: string) {
  cambiar((c) => {
    const cita = c.citas.find((x) => x.id === citaId);
    if (!cita || cita.estado !== "espera" || !horasLibres(c.citas, SERVICIOS[cita.servicio].area, fecha, citaId).includes(hora)) return c;
    return { ...c, citas: c.citas.map((x) => (x.id === citaId ? { ...x, fecha, hora } : x)) };
  });
}

function registrarVacuna(mascotaId: string, nombre: string, medico: string, kg: number | null) {
  const hoy = hoyIso();
  cambiar((c) => ({
    ...c,
    mascotas: c.mascotas.map((m) => {
      if (m.id !== mascotaId) return m;
      const meses = VACUNAS[m.especie].find((v) => v.nombre === nombre)?.meses ?? 12;
      return {
        ...m,
        vacunas: [{ id: nuevoId("v"), nombre, medico, aplicada: hoy, proxima: sumarMeses(hoy, meses) }, ...m.vacunas],
        pesos: kg ? [...m.pesos.filter((p) => p.fecha !== hoy), { fecha: hoy, kg }] : m.pesos,
      };
    }),
  }));
}

function cargarACuenta(productoId: string) {
  cambiar((c) => ({ ...c, cargos: [...c.cargos, { id: nuevoId("p"), dueno: CLIENTA.nombre, productoId }] }));
}

function quitarCargo(cargoId: string) {
  cambiar((c) => ({ ...c, cargos: c.cargos.filter((x) => x.id !== cargoId || x.cobro) }));
}

export type PorCobrar = { dueno: string; citas: Cita[]; cargos: Cargo[]; total: number };

export const precioDe = (cargo: Cargo) => PRODUCTOS.find((p) => p.id === cargo.productoId)?.precio ?? 0;

function pendientesDeCobro(c: Clinica): PorCobrar[] {
  const grupos = new Map<string, PorCobrar>();
  const grupo = (dueno: string) => {
    const actual = grupos.get(dueno) ?? { dueno, citas: [], cargos: [], total: 0 };
    grupos.set(dueno, actual);
    return actual;
  };
  c.citas
    .filter((x) => x.fecha === hoyIso() && !x.cobro && (x.estado === "lista" || x.estado === "entregada"))
    .forEach((x) => {
      const mascota = c.mascotas.find((m) => m.id === x.mascotaId);
      if (!mascota) return;
      const g = grupo(mascota.dueno);
      g.citas.push(x);
      g.total += SERVICIOS[x.servicio].precio;
    });
  c.cargos
    .filter((x) => !x.cobro)
    .forEach((x) => {
      const g = grupo(x.dueno);
      g.cargos.push(x);
      g.total += precioDe(x);
    });
  return [...grupos.values()];
}

function cobrar(dueno: string, metodo: Metodo) {
  cambiar((c) => {
    const pendiente = pendientesDeCobro(c).find((p) => p.dueno === dueno);
    if (!pendiente) return c;
    const citas = new Set(pendiente.citas.map((x) => x.id));
    const cargos = new Set(pendiente.cargos.map((x) => x.id));
    return {
      ...c,
      citas: c.citas.map((x) => (citas.has(x.id) ? { ...x, cobro: metodo, estado: "entregada", estacion: undefined } : x)),
      cargos: c.cargos.map((x) => (cargos.has(x.id) ? { ...x, cobro: metodo, cobradoEl: hoyIso() } : x)),
    };
  });
}

export type Recordatorio = { clave: string; mascota: Mascota; vacuna: string; proxima: string; enviado: boolean };

export function ultimasAplicaciones(mascota: Mascota) {
  const porNombre = new Map<string, Mascota["vacunas"][number]>();
  mascota.vacunas.forEach((v) => {
    const actual = porNombre.get(v.nombre);
    if (!actual || v.proxima > actual.proxima) porNombre.set(v.nombre, v);
  });
  return porNombre;
}

function vacunasPorVencer(c: Clinica): Recordatorio[] {
  return c.mascotas
    .flatMap((mascota) =>
      [...ultimasAplicaciones(mascota).values()]
        .filter((v) => diasHasta(v.proxima) >= 0 && diasHasta(v.proxima) <= 7)
        .map((v) => {
          const clave = `${mascota.id}|${v.nombre}`;
          return { clave, mascota, vacuna: v.nombre, proxima: v.proxima, enviado: c.recordados.includes(clave) };
        }),
    )
    .sort((a, b) => a.proxima.localeCompare(b.proxima));
}

function marcarRecordados(claves: string[]) {
  cambiar((c) => ({ ...c, recordados: [...new Set([...c.recordados, ...claves])] }));
}

export function useClinica() {
  const c = useSyncExternalStore(suscribir, () => estado);
  const hoy = hoyIso();
  const citasHoy = c.citas.filter((x) => x.fecha === hoy).sort(porHorario);
  return {
    mascotas: c.mascotas,
    citas: c.citas,
    cargos: c.cargos,
    citasHoy,
    proximas: c.citas.filter((x) => x.fecha > hoy).sort(porHorario),
    mascota: (id: string) => c.mascotas.find((m) => m.id === id),
    porCobrar: pendientesDeCobro(c),
    porVencer: vacunasPorVencer(c),
    kpis: {
      pacientes: new Set(citasHoy.map((x) => x.mascotaId)).size,
      enGrooming: citasHoy.filter((x) => x.estado === "atencion" && SERVICIOS[x.servicio].area === "grooming").length,
      ingresos:
        citasHoy.filter((x) => x.cobro).reduce((s, x) => s + SERVICIOS[x.servicio].precio, 0) +
        c.cargos.filter((x) => x.cobradoEl === hoy).reduce((s, x) => s + precioDe(x), 0),
    },
    agendar,
    registrarPaciente,
    cambiarEstado,
    reprogramar,
    registrarVacuna,
    cargarACuenta,
    quitarCargo,
    cobrar,
    marcarRecordados,
  };
}

export type ClinicaViva = ReturnType<typeof useClinica>;
