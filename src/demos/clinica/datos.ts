/*
 * Datos de ejemplo de la clínica Aurora, compartidos por la página de pacientes
 * y el panel de la clínica. Las citas viven en el navegador (localStorage) para
 * que una cita agendada como paciente aparezca en el panel.
 */
import { useEffect, useState } from "react";
import { CalendarCheck, Droplet, ShieldCheck, Smile, Stethoscope } from "lucide-react";
import doctor from "@/assets/demo-clinica/doctor.jpg";
import doctora from "@/assets/demo-clinica/doctora.jpg";

export const TINTA = "#0f2a3a";
export const AZUL = "#1e6fa8";
export const CIELO = "#eaf3f9";
export const MENTA = "#2f9e86";
export const LETRA = '"Plus Jakarta Sans", "Instrument Sans", sans-serif';

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
  "María López", "Carlos Méndez", "Ana Lucía Pérez", "Jorge Ortiz", "Sofía Ramírez", "Luis Hernández", "Gabriela Cruz", "Diego Castillo",
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
  return out;
}

const CLAVE = "aurora-citas-v1";

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
