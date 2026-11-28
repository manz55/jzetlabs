import { horasLibres, hoyIso, porHorario, unAnioDespues } from "./agenda";
import { cambiar, nuevoId, useAlmacen, type Clinica } from "./almacen";
import { SERVICIOS, type Cita, type EstadoCita, type Etapa, type Graduacion, type Horario, type Orden, type Paciente, type Pago, type ServicioId } from "./datos";

export type SolicitudCita = Horario & {
  nombre: string;
  telefono: string;
  servicio: ServicioId;
  area: string;
  pago: Pago;
  origen: "portada" | "recepcion";
};

export const MAXIMO_AROS = 3;

const normalizar = (nombre: string) => nombre.trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");

const enCita = (c: Clinica, id: string, fn: (x: Cita) => Cita): Clinica => ({ ...c, citas: c.citas.map((x) => (x.id === id ? fn(x) : x)) });
const enOrden = (c: Clinica, id: string, fn: (x: Orden) => Orden): Clinica => ({ ...c, ordenes: c.ordenes.map((x) => (x.id === id ? fn(x) : x)) });
const alternar = (aros: string[], aroId: string) => (aros.includes(aroId) ? aros.filter((a) => a !== aroId) : [...aros, aroId].slice(-MAXIMO_AROS));

function agendar(s: SolicitudCita): Cita | null {
  let creada: Cita | null = null;
  cambiar((c) => {
    if (!horasLibres(c.citas, s.fecha).includes(s.hora)) return c;
    const existente = c.pacientes.find((p) => normalizar(p.nombre) === normalizar(s.nombre));
    const paciente: Paciente = existente
      ? { ...existente, portal: true, telefono: s.telefono }
      : { id: nuevoId("p"), nombre: s.nombre.trim(), edad: null, telefono: s.telefono, portal: true, graduacion: null };
    const desdePortada = s.origen === "portada";
    const cita: Cita = {
      id: nuevoId("c"),
      pacienteId: paciente.id,
      servicio: s.servicio,
      area: s.area,
      fecha: s.fecha,
      hora: s.hora,
      pago: s.pago,
      monto: SERVICIOS[s.servicio].precio,
      estado: "espera",
      cobrada: false,
      origen: s.origen,
      aros: desdePortada ? c.porApartar : [],
      cambio: null,
    };
    creada = cita;
    return {
      ...c,
      pacientes: existente ? c.pacientes.map((p) => (p.id === paciente.id ? paciente : p)) : [...c.pacientes, paciente],
      citas: [...c.citas, cita],
      porApartar: desdePortada ? [] : c.porApartar,
      citaDelVisitante: desdePortada ? cita.id : c.citaDelVisitante,
    };
  });
  return creada;
}

const apartarAro = (aroId: string) =>
  cambiar((c) => {
    const cita = c.citas.find((x) => x.id === c.citaDelVisitante && x.estado !== "atendida");
    return cita ? enCita(c, cita.id, (x) => ({ ...x, aros: alternar(x.aros, aroId) })) : { ...c, porApartar: alternar(c.porApartar, aroId) };
  });

const quitarAro = (citaId: string, aroId: string) => cambiar((c) => enCita(c, citaId, (x) => ({ ...x, aros: x.aros.filter((a) => a !== aroId) })));

const pedirCambio = (citaId: string, horario: Horario) => cambiar((c) => enCita(c, citaId, (x) => ({ ...x, cambio: horario })));
const retirarCambio = (citaId: string) => cambiar((c) => enCita(c, citaId, (x) => ({ ...x, cambio: null })));

function confirmarCambio(citaId: string) {
  let movida = false;
  cambiar((c) => {
    const cita = c.citas.find((x) => x.id === citaId);
    if (!cita?.cambio || !horasLibres(c.citas, cita.cambio.fecha).includes(cita.cambio.hora)) return c;
    movida = true;
    return enCita(c, citaId, (x) => ({ ...x, ...cita.cambio!, estado: "espera", cambio: null }));
  });
  return movida;
}

const estadoCita = (citaId: string, estado: EstadoCita) => cambiar((c) => enCita(c, citaId, (x) => ({ ...x, estado })));

const etapaOrden = (ordenId: string, etapa: Etapa) =>
  cambiar((c) => enOrden(c, ordenId, (x) => ({ ...x, etapa, entregada: false, avisada: etapa === 4 && x.avisada, entrega: etapa === 4 ? hoyIso() : x.entrega })));

const entregar = (ordenId: string) => cambiar((c) => enOrden(c, ordenId, (x) => ({ ...x, entregada: true })));
const marcarAvisada = (ordenId: string) => cambiar((c) => enOrden(c, ordenId, (x) => ({ ...x, avisada: true })));

const cobrarCita = (citaId: string) =>
  cambiar((c) => {
    const cita = c.citas.find((x) => x.id === citaId);
    if (!cita || cita.cobrada) return c;
    const nombre = c.pacientes.find((p) => p.id === cita.pacienteId)?.nombre ?? "";
    return { ...enCita(c, citaId, (x) => ({ ...x, cobrada: true })), cobros: [...c.cobros, { id: nuevoId("r"), concepto: `${SERVICIOS[cita.servicio].corto} de ${nombre}`, monto: cita.monto }] };
  });

const cobrarSaldo = (ordenId: string) =>
  cambiar((c) => {
    const orden = c.ordenes.find((x) => x.id === ordenId);
    if (!orden || orden.abonado >= orden.total) return c;
    return { ...enOrden(c, ordenId, (x) => ({ ...x, abonado: x.total })), cobros: [...c.cobros, { id: nuevoId("r"), concepto: `Saldo ${orden.id}`, monto: orden.total - orden.abonado }] };
  });

const guardarGraduacion = (pacienteId: string, datos: Pick<Graduacion, "od" | "oi" | "cristal" | "profesional">) =>
  cambiar((c) => ({
    ...c,
    pacientes: c.pacientes.map((p) =>
      p.id === pacienteId ? { ...p, graduacion: { ...datos, emitida: hoyIso(), vence: unAnioDespues(hoyIso()), version: (p.graduacion?.version ?? 0) + 1 } } : p,
    ),
  }));

const acciones = {
  agendar,
  apartarAro,
  quitarAro,
  pedirCambio,
  retirarCambio,
  confirmarCambio,
  estadoCita,
  etapaOrden,
  entregar,
  marcarAvisada,
  cobrarCita,
  cobrarSaldo,
  guardarGraduacion,
};

export function useClinica() {
  const c = useAlmacen();
  const hoy = hoyIso();
  const citas = [...c.citas].sort(porHorario);
  const citaVisitante = c.citas.find((x) => x.id === c.citaDelVisitante && x.estado !== "atendida");
  const listas = c.ordenes.filter((o) => o.etapa === 4 && !o.entregada);
  return {
    ...c,
    ...acciones,
    citas,
    citaVisitante,
    apartados: citaVisitante?.aros ?? c.porApartar,
    listas,
    paciente: (id: string) => c.pacientes.find((p) => p.id === id),
    proximaCita: (pacienteId: string) => citas.find((x) => x.pacienteId === pacienteId && x.fecha >= hoy && x.estado !== "atendida"),
    kpis: {
      consultas: citas.filter((x) => x.fecha === hoy).length,
      enTaller: c.ordenes.filter((o) => o.etapa < 4).length,
      cobrado: c.cobros.reduce((suma, r) => suma + r.monto, 0),
      listas: listas.length,
    },
  };
}

export type ClinicaViva = ReturnType<typeof useClinica>;
