/*
 * Datos de ejemplo de la clínica Aurora, compartidos por la página de pacientes
 * y el panel de la clínica. Las citas viven en el navegador (localStorage) para
 * que una cita agendada como paciente aparezca en el panel.
 */
import { useEffect, useState } from "react";
import { CalendarCheck, Droplet, ShieldCheck, Smile, Stethoscope } from "lucide-react";
import doctor from "@/assets/demo-clinica/doctor.jpg";
import doctora from "@/assets/demo-clinica/doctora.jpg";

/* Aurora: petróleo de consultorio, esmalte con menta y el naranja del amanecer */
export const TINTA = "#123b40";
export const AZUL = "#14555d";
export const CIELO = "#dfeee8";
export const MENTA = "#e07a2f";
export const ESMALTE = "#f1f6f3";
export const LETRA = '"Instrument Sans", "Plus Jakarta Sans", sans-serif';
export const TITULO = '"DM Serif Display", Georgia, serif';

export type Servicio = { id: string; nombre: string; precio: number; minutos: number; texto: string; icono: typeof Smile; desde?: boolean; soloPanel?: boolean };
export const SERVICIOS: Servicio[] = [
  { id: "valoracion", nombre: "Valoración", precio: 150, minutos: 30, texto: "Revisión completa y plan de tratamiento por escrito.", icono: Stethoscope },
  { id: "limpieza", nombre: "Limpieza dental", precio: 250, minutos: 45, texto: "Quita sarro y manchas. Recomendada cada 6 meses.", icono: Droplet },
  { id: "blanqueamiento", nombre: "Blanqueamiento", precio: 900, minutos: 60, texto: "Varios tonos más blancos en una sola sesión.", icono: Smile },
  { id: "resina", nombre: "Resina (caries)", precio: 350, minutos: 45, texto: "Arregla caries con material del color del diente.", icono: ShieldCheck },
  { id: "ortodoncia", nombre: "Ortodoncia", precio: 6500, minutos: 45, texto: "Brackets o alineadores. Se paga en cuotas mensuales.", icono: CalendarCheck, desde: true },
  { id: "extraccion", nombre: "Extracción", precio: 300, minutos: 30, texto: "Sin dolor, con anestesia local.", icono: Stethoscope },
  { id: "control", nombre: "Control de ortodoncia", precio: 350, minutos: 30, texto: "Ajuste mensual de brackets.", icono: CalendarCheck, soloPanel: true },
];
/* los que se ofrecen en la página de pacientes */
export const SERVICIOS_PAGINA = SERVICIOS.filter((s) => !s.soloPanel);
export const servicioPor = (id: string) => SERVICIOS.find((s) => s.id === id)!;

export type Doctor = { id: string; nombre: string; corto: string; area: string; dias: string; foto: string; trabaja: number[] };
export const DOCTORES: Doctor[] = [
  { id: "morales", nombre: "Dra. Ana Morales", corto: "Dra. Morales", area: "Odontología general y estética", dias: "Lunes a viernes", foto: doctora, trabaja: [1, 2, 3, 4, 5] },
  { id: "fuentes", nombre: "Dr. Luis Fuentes", corto: "Dr. Fuentes", area: "Ortodoncia", dias: "Martes, jueves y sábado", foto: doctor, trabaja: [2, 4, 6] },
];
export const doctorPor = (id: string) => DOCTORES.find((d) => d.id === id)!;

export const DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
export const DIAS_LARGOS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
export const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
export const MESES_LARGOS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export const HORAS = Array.from({ length: 18 }, (_, i) => {
  const m = 8 * 60 + i * 30;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${m % 60 === 0 ? "00" : "30"}`;
});
/* el sábado se atiende solo en la mañana */
export const horasDelDia = (d: Date) => HORAS.filter((h) => d.getDay() !== 6 || h < "12:00");

/* próximos 10 días de atención (sin domingo) */
export function proximosDias() {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (out.length < 10) {
    if (d.getDay() !== 0) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export function yaPaso(dia: Date, hora: string, margenMin = 30) {
  const [h, m] = hora.split(":").map(Number);
  const t = new Date(dia);
  t.setHours(h, m);
  return t.getTime() < Date.now() + margenMin * 60 * 1000;
}
export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const desdeIso = (s: string) => new Date(`${s}T00:00`);
export const fechaLarga = (d: Date) => `${DIAS_CORTOS[d.getDay()]} ${d.getDate()} de ${MESES_CORTOS[d.getMonth()]}`;
export const mayus = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/* ---------- citas ---------- */

export type Estado = "por-confirmar" | "confirmada" | "atendida";
export type Cita = { id: string; dia: string; hora: string; doctor: string; servicio: string; paciente: string; estado: Estado; nueva?: boolean };

const NOMBRES = [
  "Mariela Soto", "Carlos Méndez", "Ana Lucía Pérez", "Jorge Ortiz", "Sofía Ramírez", "Luis Hernández", "Gabriela Cruz", "Diego Castillo",
  "Andrea Morales", "Kevin Orellana", "Lucía Barrios", "Pedro Juárez", "Valeria Chávez", "Marco Reyes", "Daniela Solís", "José Pineda",
];

/* citas de ejemplo: siempre las mismas para cada día, repartidas entre los dos doctores */
function citasEjemplo(): Cita[] {
  const out: Cita[] = [];
  proximosDias().forEach((d) => {
    horasDelDia(d).forEach((h, i) => {
      const n = (d.getDate() * 7 + i * 13) % 10;
      if (n >= 4) return;
      const doctores = DOCTORES.filter((x) => x.trabaja.includes(d.getDay()));
      if (!doctores.length) return;
      const doc = doctores[(d.getDate() + i) % doctores.length];
      const serv = doc.id === "fuentes" ? (n % 2 === 0 ? "control" : "valoracion") : SERVICIOS_PAGINA[(d.getDate() + i * 3) % 4].id;
      const paciente = NOMBRES[(d.getDate() * 3 + i * 5) % NOMBRES.length];
      const estado: Estado = yaPaso(d, h, 0) ? "atendida" : n === 0 ? "por-confirmar" : n === 3 && d.getDate() % 2 ? "por-confirmar" : "confirmada";
      out.push({ id: `${iso(d)}-${h}-${doc.id}`, dia: iso(d), hora: h, doctor: doc.id, servicio: serv, paciente, estado });
    });
  });
  // la paciente del portal: una sola cita, por confirmar, en el siguiente día de la Dra. Morales
  const dia = proximosDias().find((d, i) => i > 0 && d.getDay() >= 1 && d.getDay() <= 5);
  if (dia) {
    const hora = horasDelDia(dia).find((h) => h >= "10:00" && !out.some((c) => c.dia === iso(dia) && c.hora === h && c.doctor === "morales"));
    if (hora) out.push({ id: `${iso(dia)}-${hora}-morales-maria`, dia: iso(dia), hora, doctor: "morales", servicio: "resina", paciente: "María López", estado: "por-confirmar" });
  }
  return out;
}

const CLAVE = "aurora-citas-v2";

/* las citas de la demo: las de ejemplo más las que se agenden en el navegador */
export function useCitas() {
  const [citas, setCitas] = useState<Cita[]>(() => {
    try {
      const guardadas = JSON.parse(localStorage.getItem(CLAVE) ?? "null") as Cita[] | null;
      const hoy = iso(new Date());
      if (guardadas?.length && guardadas.some((c) => c.dia >= hoy)) return guardadas.filter((c) => c.dia >= hoy);
    } catch {
      /* sin datos guardados */
    }
    return citasEjemplo();
  });
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(citas));
    } catch {
      /* modo privado */
    }
  }, [citas]);
  const reiniciar = () => setCitas(citasEjemplo());
  return [citas, setCitas, reiniciar] as const;
}

/* ¿está tomado ese horario con ese doctor? */
export const tomado = (citas: Cita[], dia: Date, hora: string, doctor?: string) =>
  citas.some((c) => c.dia === iso(dia) && c.hora === hora && (!doctor || c.doctor === doctor));

/* ---------- consultas, cobros, roles y permisos ---------- */

export type Consulta = { motivo: string; diagnostico: string; tratamiento: string; indicaciones: string };
export type Metodo = "efectivo" | "tarjeta" | "transferencia";
/* datos extra de una cita: la consulta del doctor y el cobro de recepción */
export type CitaExtra = { consulta?: Consulta; pago?: Metodo };

export type Rol = "admin" | "recepcion" | "doctor" | "paciente";
export type Sesion = { rol: Rol; doctor?: string };

export const ROLES: { rol: Rol; doctor?: string; nombre: string; cargo: string; texto: string }[] = [
  { rol: "recepcion", nombre: "Karla Estrada", cargo: "Recepción", texto: "Agenda de todos los doctores, confirma citas, manda recordatorios y cobra." },
  { rol: "doctor", doctor: "morales", nombre: "Dra. Ana Morales", cargo: "Doctora", texto: "Su agenda, sus pacientes, consultas, odontograma y plan de tratamiento." },
  { rol: "doctor", doctor: "fuentes", nombre: "Dr. Luis Fuentes", cargo: "Doctor", texto: "Lo mismo, pero ve solo lo que el dueño le permita." },
  { rol: "admin", nombre: "Roberto Paz", cargo: "Dueño de la clínica", texto: "Todo: reportes, ingresos, equipo y qué puede ver cada quien." },
  { rol: "paciente", nombre: "María López", cargo: "Paciente", texto: "Sus citas, indicaciones del doctor, plan de tratamiento y saldo." },
];
export const PACIENTE_DEMO = "María López";

export type Permisos = Record<string, { todos: boolean; reportes: boolean; cobros: boolean }>;
const PERMISOS_INICIALES: Permisos = {
  morales: { todos: true, reportes: true, cobros: true },
  fuentes: { todos: false, reportes: false, cobros: false },
};

function useGuardado<T>(clave: string, inicial: T) {
  const [v, setV] = useState<T>(() => {
    try {
      const x = localStorage.getItem(clave);
      return x ? (JSON.parse(x) as T) : inicial;
    } catch {
      return inicial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(v));
    } catch {
      /* modo privado */
    }
  }, [clave, v]);
  return [v, setV] as const;
}

export const usePermisos = () => useGuardado<Permisos>("aurora-permisos-v1", PERMISOS_INICIALES);
export const useExtras = () => useGuardado<Record<string, CitaExtra>>("aurora-extras-v1", {});

/* expediente de cada paciente */
export type ItemPlan = { id: string; pieza: string; proc: string; costo: number; hecho: boolean };
export type DatosExpediente = { notas: string; dientes: Record<number, number>; alergias: string; antecedentes: string; plan: ItemPlan[] };
export const expedienteInicial = (paciente: string): DatosExpediente => ({
  notas: "",
  dientes: { 16: 2, 26: 1, 36: 2, 48: 3 },
  alergias: paciente === PACIENTE_DEMO ? "Penicilina" : "",
  antecedentes: paciente === PACIENTE_DEMO ? "Ortodoncia en la adolescencia." : "",
  plan: [
    { id: "p1", pieza: "26", proc: "Resina", costo: 350, hecho: false },
    { id: "p2", pieza: "—", proc: "Limpieza profunda", costo: 250, hecho: true },
    { id: "p3", pieza: "—", proc: "Blanqueamiento", costo: 900, hecho: false },
  ],
});
export const useExpediente = (paciente: string) => useGuardado<DatosExpediente>(`aurora-exp2-${paciente}`, expedienteInicial(paciente));
