/*
 * Demo de salón: "Lirio Salón · uñas y spa" (negocio inventado, datos de ejemplo).
 * Sucursales, servicios con duración y precio, estilistas y las citas que se guardan en el teléfono.
 */
import { useEffect, useState } from "react";

export const SALVIA = "#55604f";
export const SALVIA_SUAVE = "#e4e7dc";
export const CREMA = "#f6f1ea";
export const TINTA = "#1f1d1a";
export const LINEA = "rgba(31,29,26,.14)";
export const SERIF = '"DM Serif Display", Georgia, serif';

export type Sucursal = { id: string; nombre: string; dir: string; horario: string; abre: number; cierra: number; domingo: boolean; tel: string };
export const SUCURSALES: Sucursal[] = [
  { id: "z10", nombre: "Zona 10", dir: "16 calle 4-20, zona 10", horario: "Lunes a sábado, 8:00 a 19:00", abre: 8, cierra: 19, domingo: false, tel: "5555 0110" },
  { id: "cayala", nombre: "Cayalá", dir: "Paseo Cayalá, local 12", horario: "Todos los días, 10:00 a 20:00", abre: 10, cierra: 20, domingo: true, tel: "5555 0120" },
  { id: "sancris", nombre: "San Cristóbal", dir: "Bulevar San Cristóbal 8-50", horario: "Lunes a sábado, 9:00 a 18:00", abre: 9, cierra: 18, domingo: false, tel: "5555 0130" },
];

export const CATEGORIAS = ["Cabello", "Uñas", "Pestañas y cejas", "Maquillaje", "Spa"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export type Servicio = { id: string; cat: Categoria; nombre: string; dura: number; precio: number; nota: string; retoque?: number };
export const SERVICIOS: Servicio[] = [
  { id: "corte", cat: "Cabello", nombre: "Corte y secado", dura: 45, precio: 150, nota: "Lavado, corte y secado con forma." },
  { id: "balayage", cat: "Cabello", nombre: "Balayage", dura: 180, precio: 950, nota: "Incluye tratamiento y matizado. El precio final depende del largo.", retoque: 90 },
  { id: "raiz", cat: "Cabello", nombre: "Tinte de raíz", dura: 90, precio: 450, nota: "Cubre canas y crecimiento.", retoque: 35 },
  { id: "keratina", cat: "Cabello", nombre: "Keratina", dura: 150, precio: 700, nota: "Cabello liso y sin frizz hasta por 3 meses.", retoque: 90 },
  { id: "gel", cat: "Uñas", nombre: "Manicure en gel", dura: 60, precio: 160, nota: "Dura de 2 a 3 semanas sin despegarse.", retoque: 21 },
  { id: "acrilicas", cat: "Uñas", nombre: "Uñas acrílicas", dura: 90, precio: 280, nota: "Con forma y largo a tu gusto. Diseño aparte.", retoque: 21 },
  { id: "pedicure", cat: "Uñas", nombre: "Pedicure spa", dura: 60, precio: 200, nota: "Exfoliación, masaje y esmalte.", retoque: 30 },
  { id: "lifting", cat: "Pestañas y cejas", nombre: "Lifting de pestañas", dura: 60, precio: 275, nota: "Pestañas curvas por 6 semanas, sin rímel.", retoque: 45 },
  { id: "cejas", cat: "Pestañas y cejas", nombre: "Diseño de cejas", dura: 30, precio: 100, nota: "Con hilo o cera, según tu piel.", retoque: 21 },
  { id: "social", cat: "Maquillaje", nombre: "Maquillaje social", dura: 60, precio: 350, nota: "Para fiestas, graduaciones y fotos." },
  { id: "evento", cat: "Maquillaje", nombre: "Maquillaje y peinado", dura: 90, precio: 550, nota: "Listas en hora y media para tu evento." },
  { id: "facial", cat: "Spa", nombre: "Facial hidratante", dura: 60, precio: 350, nota: "Limpieza profunda y mascarilla." },
  { id: "masaje", cat: "Spa", nombre: "Masaje relajante", dura: 60, precio: 400, nota: "Espalda, cuello y piernas." },
];
export const servicio = (id: string) => SERVICIOS.find((s) => s.id === id)!;

export type Estilista = { id: string; nombre: string; suc: string; hace: Categoria[]; anios: number };
export const ESTILISTAS: Estilista[] = [
  { id: "andrea", nombre: "Andrea", suc: "z10", hace: ["Cabello"], anios: 9 },
  { id: "lucia", nombre: "Lucía", suc: "z10", hace: ["Uñas", "Pestañas y cejas"], anios: 6 },
  { id: "mariela", nombre: "Mariela", suc: "z10", hace: ["Maquillaje", "Spa"], anios: 11 },
  { id: "paola", nombre: "Paola", suc: "cayala", hace: ["Cabello", "Maquillaje"], anios: 7 },
  { id: "dulce", nombre: "Dulce", suc: "cayala", hace: ["Uñas"], anios: 4 },
  { id: "karen", nombre: "Karen", suc: "cayala", hace: ["Pestañas y cejas", "Spa"], anios: 5 },
  { id: "fernanda", nombre: "Fernanda", suc: "sancris", hace: ["Cabello", "Uñas"], anios: 8 },
  { id: "sonia", nombre: "Sonia", suc: "sancris", hace: ["Spa", "Pestañas y cejas", "Maquillaje"], anios: 12 },
];
export const estilista = (id: string) => ESTILISTAS.find((e) => e.id === id)!;
export const sucursal = (id: string) => SUCURSALES.find((s) => s.id === id)!;
export const puede = (e: Estilista, s: Servicio) => e.hace.includes(s.cat);

/* fechas */
export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const hoyIso = () => iso(new Date());
export const masDias = (n: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
};
export const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const fechaLarga = (f: string) => {
  const [a, m, d] = f.split("-").map(Number);
  const dt = new Date(a, m - 1, d);
  return `${["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"][dt.getDay()]} ${d} de ${MESES[m - 1]}`;
};
export const aMin = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3));
export const aHora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const hora12 = (h: string) => {
  const m = aMin(h);
  const hh = Math.floor(m / 60);
  return `${hh > 12 ? hh - 12 : hh}:${String(m % 60).padStart(2, "0")} ${hh >= 12 ? "p. m." : "a. m."}`;
};

export type Estado = "confirmada" | "llego" | "no-vino";
export type Cita = { id: string; suc: string; servicio: string; estilista: string; fecha: string; hora: string; nombre: string; tel: string; estado: Estado; nueva?: boolean };

/* citas de ejemplo alrededor de hoy */
function ejemplos(): Cita[] {
  const d = (n: number) => iso(masDias(n));
  const c = (id: string, suc: string, servicio: string, est: string, dia: number, hora: string, nombre: string, tel: string, estado: Estado = "confirmada"): Cita => ({ id, suc, servicio, estilista: est, fecha: d(dia), hora, nombre, tel, estado });
  return [
    c("e1", "z10", "balayage", "andrea", 0, "09:00", "María José Ruiz", "55120034", "llego"),
    c("e2", "z10", "gel", "lucia", 0, "10:00", "Gabriela Pineda", "42137788"),
    c("e3", "z10", "social", "mariela", 0, "11:30", "Andrea Soto", "50021934"),
    c("e4", "z10", "cejas", "lucia", 0, "15:00", "Karla Méndez", "47719022"),
    c("e5", "z10", "corte", "andrea", 0, "16:00", "Sofía Herrera", "31207745"),
    c("e6", "cayala", "acrilicas", "dulce", 0, "12:00", "Daniela Ortiz", "56104420"),
    c("e7", "cayala", "lifting", "karen", 0, "14:00", "Lucía Paz", "33014477"),
    c("e8", "sancris", "facial", "sonia", 0, "10:30", "Ana Lucía Pérez", "41203387"),
    c("e9", "z10", "gel", "lucia", 1, "09:30", "Paola Méndez", "52219034"),
    c("e10", "z10", "raiz", "andrea", 1, "11:00", "Rosa Elena Castillo", "33014478"),
    c("e11", "cayala", "evento", "paola", 1, "15:00", "Mónica Herrera", "46027715"),
    c("e12", "sancris", "pedicure", "fernanda", 1, "16:30", "Sandra López", "53318890"),
    // historial: para saber a quién le toca retoque
    c("h1", "z10", "gel", "lucia", -23, "10:00", "Claudia Morales", "58807712", "llego"),
    c("h2", "cayala", "acrilicas", "dulce", -22, "13:00", "Fernanda Rivas", "45503321", "llego"),
    c("h3", "z10", "raiz", "andrea", -38, "11:00", "Lorena Aguilar", "31119987", "llego"),
    c("h4", "cayala", "lifting", "karen", -47, "16:00", "Jimena Castro", "40028876", "llego"),
    c("h5", "sancris", "gel", "fernanda", -9, "12:00", "Valeria Solís", "50093312", "llego"),
  ];
}

const CLAVE = "salon:citas-v1";
export function useCitas() {
  const [citas, setCitas] = useState<Cita[]>(() => {
    try {
      const t = localStorage.getItem(CLAVE);
      return t ? (JSON.parse(t) as Cita[]) : ejemplos();
    } catch {
      return ejemplos();
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(citas));
    } catch {
      /* nada */
    }
  }, [citas]);
  return {
    citas,
    agregar: (c: Cita) => setCitas((cs) => [...cs, c]),
    cambiar: (id: string, x: Partial<Cita>) => setCitas((cs) => cs.map((c) => (c.id === id ? { ...c, ...x } : c))),
  };
}

/* horas libres de una estilista en un día, sin chocar con sus citas */
export function horasLibres(citas: Cita[], e: Estilista, s: Servicio, fecha: string) {
  const suc = sucursal(e.suc);
  const [a, m, d] = fecha.split("-").map(Number);
  const dia = new Date(a, m - 1, d).getDay();
  if (dia === 0 && !suc.domingo) return [];
  const ocupadas = citas.filter((c) => c.estilista === e.id && c.fecha === fecha).map((c) => [aMin(c.hora), aMin(c.hora) + servicio(c.servicio).dura]);
  const ahora = new Date();
  const esHoy = fecha === hoyIso();
  const libres: string[] = [];
  for (let t = suc.abre * 60; t + s.dura <= suc.cierra * 60; t += 30) {
    if (esHoy && t <= ahora.getHours() * 60 + ahora.getMinutes() + 30) continue;
    if (ocupadas.some(([i, f]) => t < f && t + s.dura > i)) continue;
    // algunas horas ya apartadas por teléfono, para que la agenda no se vea vacía
    const semilla = (e.id.charCodeAt(0) * 7 + d * 13 + t) % 9;
    if (semilla === 0 || semilla === 4) continue;
    libres.push(aHora(t));
  }
  return libres;
}

export const OPINIONES = [
  { quien: "Gabriela, cliente de uñas", d: "Agendé a las 11 de la noche desde la cama y al día siguiente ya tenía mi cita. Me llegó el recordatorio y todo." },
  { quien: "María José, balayage", d: "Andrea me explicó cuánto iba a costar antes de empezar. Sin sorpresas al pagar." },
  { quien: "Lucía, lifting de pestañas", d: "Me gusta que me escriben cuando ya me toca el retoque. Yo siempre se me olvida." },
];
