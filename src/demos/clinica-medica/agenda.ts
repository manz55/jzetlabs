import { cambiar, leer, nuevoId } from "./almacen";
import { MEDICOS, esExamen, fechaDe, hoyIso, sumarDias, tipoDe, type Cita, type Estado, type Horario, type Metodo, type Pago, type Paciente, type ServicioId, type Sexo, type Tipo } from "./datos";

const HORAS_CONSULTA = ["08:00", "08:45", "09:30", "10:15", "11:00", "11:45", "14:00", "14:45", "15:30", "16:15", "17:00"];
const HORAS_SABADO = ["08:00", "08:45", "09:30", "10:15", "11:00", "11:45"];
const HORAS_MUESTRA = ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"];
const SILLAS_DE_TOMA = 2;

export type Solicitud = {
  tipo: Tipo;
  servicioId: ServicioId;
  fecha: string;
  hora: string;
  nombre: string;
  edad: string;
  sexo: Sexo | "";
  pago: Pago;
};

export const solicitudVacia = (): Solicitud => ({ tipo: "consulta", servicioId: "medicina-interna", fecha: "", hora: "", nombre: "", edad: "", sexo: "", pago: "particular" });

export const horaActual = () => new Date().toTimeString().slice(0, 5);

export const porHorario = (a: Horario, b: Horario) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`);

export function horasLibres(citas: Cita[], servicioId: ServicioId, fecha: string, ignorar?: string) {
  const hoy = hoyIso();
  const dia = fechaDe(fecha).getDay();
  if (!fecha || fecha < hoy || dia === 0) return [];
  const examen = esExamen(servicioId);
  if (!examen && !MEDICOS[servicioId].dias.includes(dia)) return [];
  const base = examen ? HORAS_MUESTRA : dia === 6 ? HORAS_SABADO : HORAS_CONSULTA;
  const ocupadas = (hora: string) =>
    citas.filter((c) => c.id !== ignorar && c.fecha === fecha && c.hora === hora && (examen ? esExamen(c.servicioId) : c.servicioId === servicioId)).length;
  return base.filter((hora) => (fecha > hoy || hora > horaActual()) && ocupadas(hora) < (examen ? SILLAS_DE_TOMA : 1));
}

export function proximaFechaLibre(citas: Cita[], servicioId: ServicioId, desde = hoyIso()) {
  for (let i = 0; i < 60; i++) {
    const fecha = sumarDias(desde, i);
    if (horasLibres(citas, servicioId, fecha).length) return fecha;
  }
  return desde;
}

export const normalizarNombre = (nombre: string) => nombre.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-GT");

type DatosPaciente = { nombre: string; edad: number; sexo: Sexo };

function registrar(pacientes: Paciente[], datos: DatosPaciente, enPortal: boolean) {
  const existente = pacientes.find((p) => normalizarNombre(p.nombre) === normalizarNombre(datos.nombre));
  if (existente) {
    return { paciente: existente, pacientes: pacientes.map((p) => (p.id === existente.id && enPortal ? { ...p, enPortal: true } : p)) };
  }
  const paciente: Paciente = { ...datos, nombre: datos.nombre.trim().replace(/\s+/g, " "), id: nuevoId("paciente"), enPortal };
  return { paciente, pacientes: [...pacientes, paciente] };
}

const siguienteFolio = (citas: Cita[]) => Math.max(2030, ...citas.map((c) => c.folio)) + 1;

export function agendar(solicitud: Solicitud, enPortal: boolean) {
  const actual = leer();
  if (!horasLibres(actual.citas, solicitud.servicioId, solicitud.fecha).includes(solicitud.hora)) return null;
  const { paciente, pacientes } = registrar(actual.pacientes, { nombre: solicitud.nombre, edad: Number(solicitud.edad), sexo: solicitud.sexo || "F" }, enPortal);
  const cita: Cita = {
    id: nuevoId("cita"),
    folio: siguienteFolio(actual.citas),
    pacienteId: paciente.id,
    servicioId: solicitud.servicioId,
    fecha: solicitud.fecha,
    hora: solicitud.hora,
    pago: solicitud.pago,
    estado: "espera",
  };
  cambiar((e) => ({ ...e, pacientes, citas: [...e.citas, cita] }));
  return cita;
}

export type Muestra = { pacienteId: string; nuevo: DatosPaciente; servicioId: ServicioId; pago: Pago };

export function ingresarMuestra({ pacienteId, nuevo, servicioId, pago }: Muestra) {
  const actual = leer();
  const alta = pacienteId ? { paciente: actual.pacientes.find((p) => p.id === pacienteId)!, pacientes: actual.pacientes } : registrar(actual.pacientes, nuevo, false);
  const cita: Cita = {
    id: nuevoId("cita"),
    folio: siguienteFolio(actual.citas),
    pacienteId: alta.paciente.id,
    servicioId,
    fecha: hoyIso(),
    hora: horaActual(),
    pago,
    estado: "muestra",
  };
  cambiar((e) => ({ ...e, pacientes: alta.pacientes, citas: [...e.citas, cita] }));
  return cita;
}

const editarCita = (id: string, fn: (c: Cita) => Cita) => cambiar((e) => ({ ...e, citas: e.citas.map((c) => (c.id === id ? fn(c) : c)) }));

export function cambiarEstado(id: string, estado: Estado) {
  editarCita(id, (c) => {
    if (c.informe || (tipoDe(c.servicioId) === "laboratorio" && estado === "finalizada")) return c;
    const llegoAntes = estado !== "espera" && c.fecha > hoyIso();
    return { ...c, estado, ...(llegoAntes ? { fecha: hoyIso(), hora: horaActual(), cambio: undefined } : undefined) };
  });
}

export const cobrar = (id: string, metodo: Metodo) => editarCita(id, (c) => ({ ...c, cobro: { metodo, fecha: hoyIso() } }));

export const pedirCambio = (id: string, cambio: Horario) => editarCita(id, (c) => ({ ...c, cambio, respuestaCambio: undefined }));

export const retirarCambio = (id: string) => editarCita(id, (c) => ({ ...c, cambio: undefined }));

export function responderCambio(id: string, aceptar: boolean) {
  const { citas } = leer();
  const cita = citas.find((c) => c.id === id);
  if (!cita?.cambio) return false;
  if (aceptar && !horasLibres(citas, cita.servicioId, cita.cambio.fecha, id).includes(cita.cambio.hora)) return false;
  editarCita(id, (c) => ({ ...c, ...(aceptar ? c.cambio : undefined), cambio: undefined, respuestaCambio: aceptar ? "confirmado" : "rechazado" }));
  return true;
}
