import { cambiar, nuevoId, type Clinica } from "./almacen";
import { AREAS, CLIENTA, ESTACIONES, IDS_ESTACION, SERVICIOS, hoyIso, type Area, type Cita, type Especie, type Estacion, type Estado, type ExtraId, type Horario, type ServicioId } from "./datos";
import { fichaNueva } from "./expediente";

type Ocupacion = Pick<Clinica, "citas" | "bloqueos">;

export const porHorario = (a: Horario, b: Horario) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora);
export const mismoHorario = (a: Horario, b: Horario) => a.fecha === b.fecha && a.hora === b.hora;

export function horasLibres({ citas, bloqueos }: Ocupacion, area: Area, fecha: string, exceptoId?: string) {
  if (!fecha || fecha < hoyIso()) return [];
  return AREAS[area].horas.filter(
    (hora) =>
      !bloqueos.some((b) => mismoHorario(b, { fecha, hora })) &&
      citas.filter((c) => c.id !== exceptoId && mismoHorario(c, { fecha, hora }) && SERVICIOS[c.servicio].area === area).length < AREAS[area].capacidad,
  );
}

export const estaLibre = (c: Ocupacion, cita: Cita, destino: Horario) => horasLibres(c, SERVICIOS[cita.servicio].area, destino.fecha, cita.id).includes(destino.hora);

export const porConfirmar = (cita: Cita) => cita.solicitud?.tipo === "nueva";

export type Solicitud = { nombre: string; especie: Especie; servicio: ServicioId; fecha: string; hora: string };

export const solicitudVacia = (): Solicitud => ({ nombre: "", especie: "perro", servicio: "consulta", fecha: hoyIso(), hora: "" });

const mismoNombre = (a: string, b: string) => a.trim().localeCompare(b.trim(), "es", { sensitivity: "base" }) === 0;

export function agendar({ nombre, especie, servicio, fecha, hora }: Solicitud, opciones: { mascotaId?: string; porAprobar?: boolean } = {}) {
  let creada: Cita | null = null;
  cambiar((c) => {
    if (!horasLibres(c, SERVICIOS[servicio].area, fecha).includes(hora)) return c;
    const existente = c.mascotas.find((m) =>
      opciones.mascotaId ? m.id === opciones.mascotaId : m.dueno === CLIENTA.nombre && m.especie === especie && mismoNombre(m.nombre, nombre),
    );
    const mascota = existente ?? fichaNueva(c.mascotas, { nombre, especie, raza: "", dueno: CLIENTA.nombre, telefono: CLIENTA.telefono });
    creada = {
      id: nuevoId("c"),
      mascotaId: mascota.id,
      servicio,
      fecha,
      hora,
      estado: "espera",
      desdeWeb: !opciones.mascotaId,
      solicitud: opciones.porAprobar ? { tipo: "nueva", fecha, hora } : undefined,
    };
    return { ...c, mascotas: existente ? c.mascotas : [...c.mascotas, mascota], citas: [...c.citas, creada] };
  });
  return creada as Cita | null;
}

function editarCita(citaId: string, editar: (cita: Cita, c: Clinica) => Cita | null) {
  let cambiada = false;
  cambiar((c) => {
    const actual = c.citas.find((x) => x.id === citaId);
    const nueva = actual && editar(actual, c);
    if (!nueva) return c;
    cambiada = true;
    return { ...c, citas: c.citas.map((x) => (x.id === citaId ? nueva : x)) };
  });
  return cambiada;
}

export const pedirHorario = (citaId: string, destino: Horario) =>
  editarCita(citaId, (cita, c) => {
    if (cita.estado !== "espera" || !estaLibre(c, cita, destino)) return null;
    return porConfirmar(cita)
      ? { ...cita, ...destino, solicitud: { tipo: "nueva", ...destino } }
      : { ...cita, confirmadaPorClinica: false, solicitud: { tipo: "cambio", ...destino } };
  });

export function retirarSolicitud(citaId: string) {
  cambiar((c) => ({
    ...c,
    citas: c.citas.flatMap((x) => {
      if (x.id !== citaId || !x.solicitud) return [x];
      return porConfirmar(x) ? [] : [{ ...x, solicitud: undefined }];
    }),
  }));
}

const moverCita = (citaId: string, destinoDe: (cita: Cita) => Horario | undefined) =>
  editarCita(citaId, (cita, c) => {
    const destino = destinoDe(cita);
    if (!destino || cita.estado !== "espera" || !estaLibre(c, cita, destino)) return null;
    return { ...cita, fecha: destino.fecha, hora: destino.hora, solicitud: undefined, confirmadaPorClinica: true };
  });

export const aprobarSolicitud = (citaId: string) => moverCita(citaId, (cita) => cita.solicitud);
export const aceptarPropuesta = (citaId: string) => moverCita(citaId, (cita) => cita.solicitud?.propuesta);

export const proponerHorario = (citaId: string, propuesta: Horario) =>
  editarCita(citaId, (cita, c) => (cita.solicitud && estaLibre(c, cita, propuesta) ? { ...cita, solicitud: { ...cita.solicitud, propuesta } } : null));

export const alternarExtra = (citaId: string, extra: ExtraId) =>
  editarCita(citaId, (cita) => {
    if (cita.estado !== "espera" || cita.cobro || SERVICIOS[cita.servicio].area !== "grooming") return null;
    const actuales = cita.extras ?? [];
    return { ...cita, extras: actuales.includes(extra) ? actuales.filter((e) => e !== extra) : [...actuales, extra] };
  });

function estacionLibre(citas: Cita[], cita: Cita) {
  const area = SERVICIOS[cita.servicio].area;
  const ocupantes = (id: Estacion) => citas.filter((c) => c.id !== cita.id && c.fecha === hoyIso() && c.estado === "atencion" && c.estacion === id).length;
  return IDS_ESTACION.find((id) => ESTACIONES[id].area === area && ocupantes(id) < ESTACIONES[id].cupo);
}

export const cambiarEstado = (citaId: string, estado: Estado) =>
  editarCita(citaId, (cita, c) => {
    if (cita.cobro || porConfirmar(cita)) return null;
    const estacion = estado === "atencion" ? estacionLibre(c.citas, cita) : undefined;
    if (estado === "atencion" && !estacion) return null;
    return { ...cita, estado, estacion, solicitud: estado === "espera" ? cita.solicitud : undefined };
  });

export function alternarBloqueo(horario: Horario) {
  cambiar((c) => ({
    ...c,
    bloqueos: c.bloqueos.some((b) => mismoHorario(b, horario)) ? c.bloqueos.filter((b) => !mismoHorario(b, horario)) : [...c.bloqueos, horario],
  }));
}
