/*
 * Clínica Dental Valleverde (negocio inventado). Tratamientos, especialistas, horarios,
 * citas y cuentas de pacientes, compartidos por el portal del paciente y el panel.
 * Todo se guarda en el navegador, así una cita agendada en el portal aparece en el panel.
 */
import { useEffect, useMemo, useState } from "react";

/* ---------- fotos (Unsplash) ---------- */

const unsplash = (id: string, ancho: number, alto: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${ancho}&h=${alto}&q=75`;

export const FOTOS = {
  portada: unsplash("1606811841689-23dfddce3e95", 1200, 900),
  consultorio: unsplash("1629909613654-28e377c37b09", 1200, 900),
};

/* ---------- tratamientos ---------- */

export const ESPECIALIDADES = ["Preventiva", "Ortodoncia", "Estética", "Implantes"] as const;
export type Especialidad = (typeof ESPECIALIDADES)[number];

export type Tratamiento = {
  id: string;
  nombre: string;
  especialidad: Especialidad;
  precio: number;
  minutos: number;
  visitas: string;
  detalle: string;
  /* el precio final depende de la evaluación */
  desde?: boolean;
  /* pagos mensuales sin recargo que se pueden elegir */
  cuotas?: number[];
};

const BASE: Tratamiento[] = [
  { id: "evaluacion", nombre: "Evaluación y diagnóstico", especialidad: "Preventiva", precio: 150, minutos: 30, visitas: "1 visita", detalle: "Revisión completa, cámara intraoral y plan de tratamiento por escrito." },
  { id: "limpieza", nombre: "Limpieza dental con ultrasonido", especialidad: "Preventiva", precio: 300, minutos: 60, visitas: "1 visita", detalle: "Retiro de sarro y manchas, pulido e indicaciones de higiene." },
  { id: "resina", nombre: "Resina estética por pieza", especialidad: "Preventiva", precio: 375, minutos: 60, visitas: "1 visita", detalle: "Restauración de caries con material del color de su diente." },
  { id: "brackets", nombre: "Brackets metálicos", especialidad: "Ortodoncia", precio: 7500, minutos: 90, visitas: "18 a 24 meses", detalle: "Estudio, colocación y retenedores. Los controles se cobran aparte.", desde: true, cuotas: [6, 12, 18] },
  { id: "alineadores", nombre: "Alineadores transparentes", especialidad: "Ortodoncia", precio: 16500, minutos: 60, visitas: "8 a 18 meses", detalle: "Placas removibles hechas a su medida, con planificación digital.", desde: true, cuotas: [6, 12] },
  { id: "control", nombre: "Control mensual de ortodoncia", especialidad: "Ortodoncia", precio: 350, minutos: 30, visitas: "Cada 4 semanas", detalle: "Ajuste, cambio de ligas y seguimiento del avance." },
  { id: "blanqueamiento", nombre: "Blanqueamiento en consultorio", especialidad: "Estética", precio: 1200, minutos: 90, visitas: "1 visita", detalle: "Aclarado supervisado con protección de encías.", cuotas: [3] },
  { id: "carilla", nombre: "Carilla de porcelana por pieza", especialidad: "Estética", precio: 2400, minutos: 60, visitas: "2 visitas", detalle: "Corrige forma, color y pequeños espacios en dientes frontales.", cuotas: [3, 6] },
  { id: "diseno", nombre: "Diseño digital de sonrisa", especialidad: "Estética", precio: 650, minutos: 60, visitas: "1 visita", detalle: "Fotografías, escaneo y vista previa antes de decidir." },
  { id: "valoracion-implante", nombre: "Valoración para implante", especialidad: "Implantes", precio: 350, minutos: 30, visitas: "1 visita", detalle: "Revisión de hueso y encía, con presupuesto detallado." },
  { id: "implante", nombre: "Implante dental de titanio", especialidad: "Implantes", precio: 5800, minutos: 90, visitas: "2 a 3 visitas", detalle: "Cirugía de colocación y controles de cicatrización.", cuotas: [3, 6, 12] },
  { id: "corona", nombre: "Corona de zirconio sobre implante", especialidad: "Implantes", precio: 3200, minutos: 60, visitas: "2 visitas", detalle: "Pieza final sobre el implante, ajustada a su mordida.", cuotas: [3, 6] },
];

export type Complemento = { id: string; nombre: string; detalle: string; precio: number; minutos: number };
export const COMPLEMENTOS: Complemento[] = [
  { id: "panoramica", nombre: "Radiografía panorámica", detalle: "Imagen completa de dientes y hueso.", precio: 250, minutos: 0 },
  { id: "fluor", nombre: "Aplicación de flúor", detalle: "Refuerza el esmalte al terminar la cita.", precio: 120, minutos: 0 },
  { id: "sedacion", nombre: "Sedación consciente", detalle: "Para pacientes con ansiedad dental.", precio: 650, minutos: 30 },
];

/* ---------- especialistas ---------- */

export type Odontologo = { id: string; nombre: string; area: string; atiende: Especialidad[]; dias: number[]; diasTexto: string; foto: string };
export const ODONTOLOGOS: Odontologo[] = [
  { id: "castellanos", nombre: "Dra. Gabriela Castellanos", area: "Odontología general y preventiva", atiende: ["Preventiva"], dias: [1, 2, 3, 4, 5, 6], diasTexto: "Lunes a sábado", foto: unsplash("1765005204058-10418f5123c5", 600, 700) },
  { id: "batres", nombre: "Dra. Mónica Batres", area: "Ortodoncia", atiende: ["Ortodoncia"], dias: [2, 4, 6], diasTexto: "Martes, jueves y sábado", foto: unsplash("1770134223774-13b735e29201", 600, 700) },
  { id: "montenegro", nombre: "Dra. Lucía Montenegro", area: "Estética y rehabilitación", atiende: ["Estética", "Preventiva"], dias: [1, 3, 5], diasTexto: "Lunes, miércoles y viernes", foto: unsplash("1559839734-2b71ea197ec2", 600, 700) },
  { id: "arriola", nombre: "Dr. Rodrigo Arriola", area: "Implantología y cirugía oral", atiende: ["Implantes"], dias: [1, 2, 4, 5], diasTexto: "Lunes, martes, jueves y viernes", foto: unsplash("1758691463582-11aea602cd4a", 600, 700) },
];
export const odontologoPor = (id: string) => ODONTOLOGOS.find((o) => o.id === id) ?? ODONTOLOGOS[0];

/* ---------- formato y fechas ---------- */

const NUMERO = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const formatoQ = (n: number) => `${n < 0 ? "-" : ""}Q${NUMERO.format(Math.abs(n))}`;

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const desdeIso = (s: string) => new Date(`${s}T00:00`);
export const diaCorto = (s: string) => DIAS[desdeIso(s).getDay()].slice(0, 3);
export const mesCorto = (s: string) => MESES[desdeIso(s).getMonth()].slice(0, 3);
export const fechaLarga = (s: string) => {
  const d = desdeIso(s);
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
};
export const fechaCorta = (s: string) => `${desdeIso(s).getDate()} ${mesCorto(s)}`;
export const mayus = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export const aMinutos = (hora: string) => {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
};
const aHora = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
export const hora12 = (hora: string) => {
  const [h, m] = hora.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")}\u00a0${h < 12 ? "a.\u00a0m." : "p.\u00a0m."}`;
};

/* turnos de atención; el sábado solo por la mañana y el domingo cerrado */
const turnos = (fecha: string): [number, number][] => {
  const dia = desdeIso(fecha).getDay();
  if (dia === 0) return [];
  if (dia === 6) return [[8 * 60, 13 * 60]];
  return [[8 * 60, 13 * 60], [14 * 60, 18 * 60]];
};

export function proximosDias(cuantos = 12) {
  const out: string[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (out.length < cuantos) {
    if (d.getDay() !== 0) out.push(iso(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

const minutosAhora = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

/* ---------- citas y pacientes ---------- */

export const ESTADOS = ["Confirmada", "En sala", "Completada"] as const;
export type EstadoCita = (typeof ESTADOS)[number];

export type Cita = {
  id: string;
  fecha: string;
  hora: string;
  doctorId: string;
  tratamientoId: string;
  complementos: string[];
  minutos: number;
  total: number;
  meses: number;
  pacienteId: string;
  estado: EstadoCita;
  origen: "portal" | "agenda";
  /* cuando la cita corresponde a un punto del plan de tratamiento */
  planId?: string;
  /* ya se pagó en recepción: no suma al saldo */
  cobrada?: boolean;
};

export const ESTADOS_PLAN = ["Pendiente", "En curso", "Realizado"] as const;
export type EstadoPlan = (typeof ESTADOS_PLAN)[number];
export type ItemPlan = { id: string; pieza: number | null; concepto: string; tratamientoId?: string; monto: number; estado: EstadoPlan };
export const CLASE_ESTADO: Record<EstadoPlan, string> = { Pendiente: "pendiente", "En curso": "curso", Realizado: "tratada" };
export const MEDIOS = ["Efectivo", "Tarjeta", "Transferencia"] as const;
export type Medio = (typeof MEDIOS)[number];
export type Abono = { id: string; fecha: string; monto: number; medio: Medio };
export type Paciente = { id: string; nombre: string; telefono: string; plan: ItemPlan[]; abonos: Abono[] };

/* la persona que tiene la sesión abierta en el portal */
export const PACIENTE_SESION = "VV-1042";

const haceDias = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
};

const NOMBRES = ["Carlos Méndez", "Ana Lucía Pérez", "Jorge Ortiz", "Sofía Ramírez", "Luis Hernández", "Gabriela Cruz", "Diego Castillo", "Andrea Juárez", "Kevin Orellana", "Valeria Chávez", "Marco Reyes", "Daniela Solís"];

function pacientesIniciales(): Paciente[] {
  const sesion: Paciente = {
    id: PACIENTE_SESION,
    nombre: "Mariela Soto",
    telefono: "",
    plan: [
      { id: "p1", pieza: 16, concepto: "Resina estética", tratamientoId: "resina", monto: 375, estado: "Realizado" },
      { id: "p2", pieza: null, concepto: "Limpieza dental con ultrasonido", tratamientoId: "limpieza", monto: 300, estado: "Realizado" },
      { id: "p3", pieza: 46, concepto: "Implante dental de titanio", tratamientoId: "implante", monto: 5800, estado: "En curso" },
      { id: "p4", pieza: 46, concepto: "Corona de zirconio sobre implante", tratamientoId: "corona", monto: 3200, estado: "Pendiente" },
      { id: "p5", pieza: 26, concepto: "Resina estética", tratamientoId: "resina", monto: 375, estado: "Pendiente" },
      { id: "p6", pieza: 11, concepto: "Carilla de porcelana", tratamientoId: "carilla", monto: 2400, estado: "Pendiente" },
    ],
    abonos: [
      { id: "a1", fecha: haceDias(48), monto: 675, medio: "Tarjeta" },
      { id: "a2", fecha: haceDias(20), monto: 2900, medio: "Transferencia" },
    ],
  };
  return [sesion, ...NOMBRES.map((nombre, i) => ({ id: `VV-${1043 + i}`, nombre, telefono: "", plan: [], abonos: [] }))];
}

export const precioDe = (precios: Record<string, number>, id: string) => precios[id] ?? BASE.find((t) => t.id === id)?.precio ?? 0;
export const tratamientoPor = (id: string) => BASE.find((t) => t.id === id) ?? BASE[0];

const choca = (citas: Cita[], fecha: string, doctorId: string, inicio: number, minutos: number) =>
  citas.some((c) => c.fecha === fecha && c.doctorId === doctorId && inicio < aMinutos(c.hora) + c.minutos && aMinutos(c.hora) < inicio + minutos);

export type Bloque = { hora: string; libre: boolean };

/* bloques de media hora donde cabe una cita de esa duración con ese especialista */
export function bloques(citas: Cita[], fecha: string, doctorId: string, minutos: number): Bloque[] {
  if (!odontologoPor(doctorId).dias.includes(desdeIso(fecha).getDay())) return [];
  const hoy = iso(new Date());
  const desde = fecha === hoy ? minutosAhora() + 45 : 0;
  const out: Bloque[] = [];
  for (const [abre, cierra] of turnos(fecha))
    for (let m = abre; m + minutos <= cierra; m += 30) out.push({ hora: aHora(m), libre: fecha >= hoy && m >= desde && !choca(citas, fecha, doctorId, m, minutos) });
  return out;
}

/* citas ya reservadas en recepción: siempre las mismas para cada fecha */
function citasIniciales(): Cita[] {
  const out: Cita[] = [];
  const hoy = iso(new Date());
  const ahora = minutosAhora();
  proximosDias().forEach((fecha) => {
    const dia = desdeIso(fecha).getDate();
    ODONTOLOGOS.forEach((doc, d) => {
      if (!doc.dias.includes(desdeIso(fecha).getDay())) return;
      // en ortodoncia la mayoría de visitas son controles
      const suyos = doc.id === "batres"
        ? ["control", "control", "brackets", "control", "alineadores"].map(tratamientoPor)
        : BASE.filter((t) => doc.atiende.includes(t.especialidad));
      const horas = [["08:30", "11:00", "15:00"], ["09:00", "14:00"], ["10:00", "16:00"], ["08:00", "11:30", "14:30"]][(dia + d) % 4];
      horas.forEach((hora, i) => {
        const t = suyos[(dia + d * 2 + i * 3) % suyos.length];
        const inicio = aMinutos(hora);
        const cabe = turnos(fecha).some(([abre, cierra]) => inicio >= abre && inicio + t.minutos <= cierra);
        if (!cabe || choca(out, fecha, doc.id, inicio, t.minutos)) return;
        const estado: EstadoCita = fecha !== hoy || inicio > ahora ? "Confirmada" : inicio + t.minutos <= ahora ? "Completada" : "En sala";
        out.push({
          id: `A-${fecha}-${doc.id}-${hora}`, fecha, hora, doctorId: doc.id, tratamientoId: t.id, complementos: [], minutos: t.minutos,
          total: t.precio, meses: 1, pacienteId: `VV-${1043 + ((dia * 3 + d * 5 + i * 7) % NOMBRES.length)}`, estado, origen: "agenda",
          // casi todo lo atendido ya quedó pagado; una de cada cuatro queda por cobrar
          cobrada: estado === "Completada" && (d + i) % 4 !== 0,
        });
      });
    });
  });
  // el próximo control de la paciente con sesión abierta
  const fecha = proximosDias().find((f) => f > hoy && [1, 3, 5].includes(desdeIso(f).getDay()));
  if (fecha) {
    const libre = bloques(out, fecha, "montenegro", 60).find((b) => b.libre && b.hora >= "09:00");
    if (libre)
      out.push({ id: `A-${fecha}-sesion`, fecha, hora: libre.hora, doctorId: "montenegro", tratamientoId: "resina", complementos: [], minutos: 60, total: 375, meses: 1, pacienteId: PACIENTE_SESION, estado: "Confirmada", origen: "agenda", planId: "p5" });
  }
  return out;
}

/* ---------- cuentas ---------- */

export const estadoDeItem = (citas: Cita[], item: ItemPlan): EstadoPlan =>
  citas.some((c) => c.planId === item.id && c.estado === "Completada") ? "Realizado" : item.estado;

/*
 * Saldo: lo ya realizado o en curso del plan, más las citas completadas que no son parte
 * del plan, menos los abonos. Lo pendiente del plan todavía no se cobra.
 */
export function cuentaDe(citas: Cita[], paciente: Paciente) {
  const plan = paciente.plan.map((i) => ({ ...i, estado: estadoDeItem(citas, i) }));
  const porCitas = citas.filter((c) => c.pacienteId === paciente.id && c.estado === "Completada" && !c.cobrada && !paciente.plan.some((i) => i.id === c.planId));
  const cargado = plan.filter((i) => i.estado !== "Pendiente").reduce((s, i) => s + i.monto, 0) + porCitas.reduce((s, c) => s + c.total, 0);
  const abonado = paciente.abonos.reduce((s, a) => s + a.monto, 0);
  const porRealizar = plan.filter((i) => i.estado === "Pendiente").reduce((s, i) => s + i.monto, 0);
  return { plan, porCitas, cargado, abonado, porRealizar, saldo: cargado - abonado };
}

/* ---------- estado guardado ---------- */

type Estado = { sembrado: string; citas: Cita[]; precios: Record<string, number>; pacientes: Paciente[] };
const CLAVE = "valleverde-v2";

const estadoInicial = (): Estado => ({ sembrado: iso(new Date()), citas: citasIniciales(), precios: {}, pacientes: pacientesIniciales() });

function cargar(): Estado {
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE) ?? "null") as Estado | null;
    if (g && Array.isArray(g.citas) && Array.isArray(g.pacientes) && g.pacientes.some((p) => p.id === PACIENTE_SESION) && g.precios) {
      const hoy = iso(new Date());
      if (g.sembrado === hoy) return g;
      // otro día: se renueva la agenda de recepción y se conservan las reservas del portal
      const delPortal = g.citas.filter((c) => c.origen === "portal" && c.fecha >= hoy);
      const nuevas = citasIniciales().filter((c) => !choca(delPortal, c.fecha, c.doctorId, aMinutos(c.hora), c.minutos));
      return { ...g, sembrado: hoy, citas: [...nuevas, ...delPortal] };
    }
  } catch {
    /* sin datos guardados */
  }
  return estadoInicial();
}

export type Reserva = {
  tratamientoId: string;
  doctorId: string;
  fecha: string;
  hora: string;
  complementos: string[];
  meses: number;
  nombre: string;
  telefono: string;
  planId?: string;
};

export function totalDe(precios: Record<string, number>, tratamientoId: string, complementos: string[]) {
  return precioDe(precios, tratamientoId) + COMPLEMENTOS.filter((c) => complementos.includes(c.id)).reduce((s, c) => s + c.precio, 0);
}
export function minutosDe(tratamientoId: string, complementos: string[]) {
  return tratamientoPor(tratamientoId).minutos + COMPLEMENTOS.filter((c) => complementos.includes(c.id)).reduce((s, c) => s + c.minutos, 0);
}

const mismoNombre = (a: string, b: string) => a.trim().toLocaleLowerCase("es") === b.trim().toLocaleLowerCase("es");

export function useClinica() {
  const [estado, setEstado] = useState<Estado>(cargar);
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {
      /* modo privado */
    }
  }, [estado]);

  const tratamientos = useMemo(() => BASE.map((t) => ({ ...t, precio: precioDe(estado.precios, t.id) })), [estado.precios]);
  const cambiarPaciente = (id: string, cambio: (p: Paciente) => Paciente) =>
    setEstado((e) => ({ ...e, pacientes: e.pacientes.map((p) => (p.id === id ? cambio(p) : p)) }));

  return {
    ...estado,
    tratamientos,
    /* devuelve la cita creada, o null si ese horario ya no está libre */
    agendar(r: Reserva): Cita | null {
      const minutos = minutosDe(r.tratamientoId, r.complementos);
      if (!bloques(estado.citas, r.fecha, r.doctorId, minutos).some((b) => b.hora === r.hora && b.libre)) return null;
      const telefono = r.telefono.replace(/\D/g, "");
      const conocido = estado.pacientes.find((p) => (p.telefono ? p.telefono === telefono : mismoNombre(p.nombre, r.nombre)));
      const numero = Math.max(...estado.pacientes.map((p) => Number(p.id.slice(3)) || 0)) + 1;
      const paciente: Paciente = conocido ? { ...conocido, telefono } : { id: `VV-${numero}`, nombre: r.nombre.trim(), telefono, plan: [], abonos: [] };
      const cita: Cita = {
        id: `VV-C${Date.now().toString(36).slice(-5).toUpperCase()}`,
        fecha: r.fecha, hora: r.hora, doctorId: r.doctorId, tratamientoId: r.tratamientoId, complementos: r.complementos, minutos,
        total: totalDe(estado.precios, r.tratamientoId, r.complementos), meses: r.meses, pacienteId: paciente.id, estado: "Confirmada", origen: "portal",
        planId: paciente.plan.some((i) => i.id === r.planId && i.tratamientoId === r.tratamientoId) ? r.planId : undefined,
      };
      setEstado((e) => ({
        ...e,
        citas: [...e.citas, cita],
        pacientes: conocido ? e.pacientes.map((p) => (p.id === paciente.id ? paciente : p)) : [...e.pacientes, paciente],
      }));
      return cita;
    },
    cambiarEstado: (id: string, nuevo: EstadoCita) => setEstado((e) => ({ ...e, citas: e.citas.map((c) => (c.id === id ? { ...c, estado: nuevo } : c)) })),
    cambiarPrecio: (id: string, precio: number) => setEstado((e) => ({ ...e, precios: { ...e.precios, [id]: precio } })),
    abonar: (pacienteId: string, monto: number, medio: Medio) =>
      cambiarPaciente(pacienteId, (p) => ({ ...p, abonos: [...p.abonos, { id: `a${Date.now()}`, fecha: iso(new Date()), monto, medio }] })),
    cargar: (pacienteId: string, concepto: string, monto: number, pieza: number | null) =>
      cambiarPaciente(pacienteId, (p) => ({ ...p, plan: [...p.plan, { id: `p${Date.now()}`, pieza, concepto, monto, estado: "Realizado" }] })),
    cambiarItem: (pacienteId: string, itemId: string, nuevo: EstadoPlan) =>
      cambiarPaciente(pacienteId, (p) => ({ ...p, plan: p.plan.map((i) => (i.id === itemId ? { ...i, estado: nuevo } : i)) })),
    restaurar: () => setEstado(estadoInicial()),
  };
}

export type Clinica = ReturnType<typeof useClinica>;
export const nombreDe = (clinica: Clinica, pacienteId: string) => clinica.pacientes.find((p) => p.id === pacienteId)?.nombre ?? "Paciente";
export const enlaceWhatsApp = (texto: string) => `https://wa.me/?text=${encodeURIComponent(texto)}`;
