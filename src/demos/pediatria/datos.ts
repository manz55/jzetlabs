/*
 * Demo de pediatría: "Pediatría Semillita" con la Dra. Lucía Ordóñez (negocio inventado, datos de ejemplo, fotos de Unsplash).
 *
 * Problema de una clínica de niños -> cómo lo resuelve la demo
 * - Las mamás preguntan por WhatsApp "¿qué vacuna le toca?" -> con la fecha de nacimiento ven qué vacunas lleva, cuáles faltan y cuándo toca la siguiente.
 * - "Mi bebé tiene fiebre, ¿hay espacio hoy?" -> citas separadas: consulta por enfermedad del día y control de niño sano.
 * - Nadie se acuerda del peso y la talla del último control -> curva de crecimiento de cada niño en el teléfono de la mamá.
 * - Una mamá agenda para dos o tres hijos -> un solo perfil familiar con todos sus hijos.
 * - Vacunas atrasadas que nadie recuerda -> la recepción ve la lista y manda el recordatorio.
 * - En la consulta se apunta el peso en papel -> la doctora lo anota y la curva se actualiza sola.
 */
import { useEffect, useState } from "react";
import examen from "@/assets/demo-pediatria/examen.jpg";
import bebe from "@/assets/demo-pediatria/bebe.jpg";
import mama from "@/assets/demo-pediatria/mama.jpg";
import consulta from "@/assets/demo-pediatria/consulta.jpg";
import cinco from "@/assets/demo-pediatria/cinco.jpg";
import peluche from "@/assets/demo-pediatria/peluche.jpg";

export const FOTOS = { examen, bebe, mama, consulta, cinco, peluche };

/* cielo de cuarto de niños, coral y los colores de crayón */
export const CIELO = "#dcf0fa";
export const CIELO2 = "#bfe3f4";
export const MARINO = "#17365d";
export const CORAL = "#f26b4f";
export const LIMA = "#7cbf3a";
export const SOL = "#f6b73c";
export const REDONDA = '"Baloo 2", "Plus Jakarta Sans", sans-serif';

export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;

/* esquema de ejemplo, basado en el esquema público de Guatemala (la doctora lo confirma en consulta) */
export const VACUNAS = [
  { mes: 0, edad: "Al nacer", lista: ["BCG (tuberculosis)", "Hepatitis B"] },
  { mes: 2, edad: "2 meses", lista: ["Pentavalente 1", "Polio 1", "Rotavirus 1", "Neumococo 1"] },
  { mes: 4, edad: "4 meses", lista: ["Pentavalente 2", "Polio 2", "Rotavirus 2", "Neumococo 2"] },
  { mes: 6, edad: "6 meses", lista: ["Pentavalente 3", "Polio 3", "Influenza 1"] },
  { mes: 12, edad: "1 año", lista: ["SPR 1 (sarampión, paperas y rubéola)", "Neumococo refuerzo"] },
  { mes: 18, edad: "1 año y medio", lista: ["DPT refuerzo 1", "Polio refuerzo 1", "SPR 2"] },
  { mes: 48, edad: "4 años", lista: ["DPT refuerzo 2", "Polio refuerzo 2"] },
];

/* peso de referencia (kg) por mes, percentiles 3, 50 y 97, simplificado para la demo */
export const CURVA = [
  [2.5, 3.3, 4.4], [3.4, 4.5, 5.8], [4.4, 5.6, 7.1], [5.1, 6.4, 8.0], [5.6, 7.0, 8.7], [6.1, 7.5, 9.3], [6.4, 7.9, 9.8],
  [6.7, 8.3, 10.3], [6.9, 8.6, 10.7], [7.1, 8.9, 11.0], [7.4, 9.2, 11.4], [7.6, 9.4, 11.7], [7.7, 9.6, 12.0],
];

export type Peso = { mes: number; kg: number; cm: number };
export type Nino = { id: string; nombre: string; nace: string; sexo: "niño" | "niña"; mama: string; tel: string; vacunas: number[]; pesos: Peso[] };

const haceMeses = (m: number, dias = 0) => {
  const d = new Date();
  d.setMonth(d.getMonth() - m);
  d.setDate(d.getDate() - dias);
  return d.toISOString().slice(0, 10);
};
export function mesesDe(nace: string) {
  const n = new Date(nace + "T12:00:00");
  const h = new Date();
  let m = (h.getFullYear() - n.getFullYear()) * 12 + (h.getMonth() - n.getMonth());
  if (h.getDate() < n.getDate()) m--;
  return Math.max(0, m);
}
export function edadTexto(m: number) {
  if (m < 1) return "recién nacido";
  if (m < 24) return `${m} ${m === 1 ? "mes" : "meses"}`;
  const a = Math.floor(m / 12);
  const r = m % 12;
  return `${a} años${r ? ` y ${r} ${r === 1 ? "mes" : "meses"}` : ""}`;
}

function familia(): Nino[] {
  return [
    {
      id: "mateo", nombre: "Mateo", nace: haceMeses(7, 4), sexo: "niño", mama: "Karla Méndez", tel: "5555 2301",
      vacunas: [0, 2, 4, 6],
      pesos: [{ mes: 0, kg: 3.2, cm: 50 }, { mes: 1, kg: 4.3, cm: 54 }, { mes: 2, kg: 5.4, cm: 57.5 }, { mes: 4, kg: 6.9, cm: 63 }, { mes: 6, kg: 7.8, cm: 67 }],
    },
    {
      id: "sofia", nombre: "Sofía", nace: haceMeses(47, 10), sexo: "niña", mama: "Karla Méndez", tel: "5555 2301",
      vacunas: [0, 2, 4, 6, 12, 18],
      pesos: [{ mes: 0, kg: 3.0, cm: 49 }, { mes: 6, kg: 7.3, cm: 65 }, { mes: 12, kg: 9.1, cm: 74 }],
    },
  ];
}

export type Cita = { id: number; hora: string; nino: string; edad: string; mama: string; tipo: "enfermedad" | "control" | "vacuna"; motivo: string; estado: "espera" | "consulta" | "listo" | "agendada"; tel: string; nueva?: boolean };
const AGENDA: Cita[] = [
  { id: 1, hora: "8:00", nino: "Diego Cux", edad: "2 años", mama: "Ana Cux", tipo: "control", motivo: "Control de niño sano", estado: "listo", tel: "5555 1101" },
  { id: 2, hora: "8:30", nino: "Valentina Rivas", edad: "4 meses", mama: "Paola Rivas", tipo: "vacuna", motivo: "Vacunas de 4 meses", estado: "listo", tel: "5555 1102" },
  { id: 3, hora: "9:00", nino: "Emiliano Paz", edad: "3 años", mama: "Gaby Paz", tipo: "enfermedad", motivo: "Fiebre y tos desde ayer", estado: "consulta", tel: "5555 1103" },
  { id: 4, hora: "9:30", nino: "Camila Juárez", edad: "6 meses", mama: "Lucía Juárez", tipo: "vacuna", motivo: "Vacunas de 6 meses", estado: "espera", tel: "5555 1104" },
  { id: 5, hora: "10:00", nino: "Santiago López", edad: "9 meses", mama: "Mónica López", tipo: "control", motivo: "Control y alimentación", estado: "espera", tel: "5555 1105" },
  { id: 6, hora: "11:00", nino: "Isabella Morales", edad: "5 años", mama: "Diana Morales", tipo: "enfermedad", motivo: "Dolor de oído", estado: "agendada", tel: "5555 1106" },
  { id: 7, hora: "15:00", nino: "Lucas Herrera", edad: "1 año", mama: "Jennifer Herrera", tipo: "vacuna", motivo: "Vacunas de 1 año", estado: "agendada", tel: "5555 1107" },
];
export const ATRASADOS = [
  { nino: "Nicolás Barrios", mama: "Andrea Barrios", tel: "5555 1201", falta: "Vacunas de 6 meses", dias: 24 },
  { nino: "Mía Gálvez", mama: "Rocío Gálvez", tel: "5555 1202", falta: "SPR 1 (1 año)", dias: 11 },
  { nino: "Adrián Chávez", mama: "Silvia Chávez", tel: "5555 1203", falta: "Control de 2 años", dias: 37 },
];

export const HORAS = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

type Estado = { ninos: Nino[]; agenda: Cita[]; recordados: string[] };
const CLAVE = "jz-pediatria-v1";

export function usePediatria() {
  const [e, setE] = useState<Estado>(() => {
    try {
      const t = localStorage.getItem(CLAVE);
      if (t) return JSON.parse(t) as Estado;
    } catch {
      /* nada */
    }
    return { ninos: familia(), agenda: AGENDA, recordados: [] };
  });
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(e));
    } catch {
      /* nada */
    }
  }, [e]);
  return {
    ...e,
    agendar: (c: Omit<Cita, "id" | "estado">) => setE((v) => ({ ...v, agenda: [...v.agenda, { ...c, id: Math.max(...v.agenda.map((x) => x.id)) + 1, estado: "agendada" as const, nueva: true }].sort((a, b) => toMin(a.hora) - toMin(b.hora)) })),
    avanzar: (id: number) => setE((v) => ({ ...v, agenda: v.agenda.map((c) => (c.id === id ? { ...c, estado: c.estado === "agendada" ? "espera" : c.estado === "espera" ? "consulta" : "listo" } : c)) })),
    pesar: (nino: string, p: Peso) => setE((v) => ({ ...v, ninos: v.ninos.map((n) => (n.id === nino ? { ...n, pesos: [...n.pesos.filter((x) => x.mes !== p.mes), p].sort((a, b) => a.mes - b.mes) } : n)) })),
    vacunar: (nino: string, mes: number) => setE((v) => ({ ...v, ninos: v.ninos.map((n) => (n.id === nino && !n.vacunas.includes(mes) ? { ...n, vacunas: [...n.vacunas, mes] } : n)) })),
    recordar: (quien: string) => setE((v) => ({ ...v, recordados: [...v.recordados, quien] })),
    reiniciar: () => setE({ ninos: familia(), agenda: AGENDA, recordados: [] }),
  };
}
export type Pedi = ReturnType<typeof usePediatria>;
export const toMin = (h: string) => {
  const [a, b] = h.split(":").map(Number);
  return a * 60 + b;
};
