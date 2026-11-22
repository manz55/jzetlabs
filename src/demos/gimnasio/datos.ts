/*
 * Demo de gimnasio: "Spartan Force Gym" (negocio inventado, datos de ejemplo, fotos de Unsplash).
 * Lo que preguntan en los gimnasios de barrio: precio, horario, dónde quedan, si hay parqueo y si está lleno.
 * Lo que le cuesta al dueño: membresías vencidas que nadie cobra y no saber quién entró.
 */
import { useEffect, useState } from "react";
import portada from "@/assets/demo-gimnasio/portada.jpg";
import sentadilla from "@/assets/demo-gimnasio/sentadilla.jpg";
import spinning from "@/assets/demo-gimnasio/spinning.jpg";
import funcional from "@/assets/demo-gimnasio/funcional.jpg";
import coach from "@/assets/demo-gimnasio/coach.jpg";
import coach2 from "@/assets/demo-gimnasio/coach2.jpg";
import comunidad from "@/assets/demo-gimnasio/comunidad.jpg";
import alumna1 from "@/assets/demo-gimnasio/alumna1.jpg";
import alumna2 from "@/assets/demo-gimnasio/alumna2.jpg";
import alumno3 from "@/assets/demo-gimnasio/alumno3.jpg";
import alumno4 from "@/assets/demo-gimnasio/alumno4.jpg";
import mancuernas from "@/assets/demo-gimnasio/mancuernas.jpg";
import sala from "@/assets/demo-gimnasio/sala.jpg";
import piso from "@/assets/demo-gimnasio/piso.jpg";
import barra from "@/assets/demo-gimnasio/barra.jpg";

export const FOTOS = { portada, sentadilla, spinning, funcional, coach, coach2, comunidad, mancuernas, sala, piso, barra };

/* colores: piso de hule, tiza y los colores de los discos olímpicos */
export const GOMA = "#16181a";
export const GOMA2 = "#202326";
export const TIZA = "#efeee9";
export const ACERO = "#cdd4da";
export const ROJO = "#d7263d";
export const AZUL = "#1f5fc4";
export const AMARILLO = "#f2c230";
export const VERDE = "#2e9b57";
export const TITULO = '"Big Shoulders Display", "Bricolage Grotesque", sans-serif';

export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;

export const SEDES = [
  { id: "mixco", nombre: "Mixco", dir: "Calzada San Juan 14-50, zona 7 de Mixco", parqueo: "Parqueo propio para 40 carros y motos", foto: sala, capacidad: 60 },
  { id: "villa", nombre: "Villa Nueva", dir: "Plaza Sol, local 12, zona 4 de Villa Nueva", parqueo: "Parqueo de la plaza, 2 horas gratis", foto: piso, capacidad: 45 },
];
export const HORARIO = [
  ["Lunes a viernes", "4:30 a 21:30"],
  ["Sábado", "6:00 a 14:00"],
  ["Domingo", "7:00 a 12:00"],
];

/* los planes van con el color del disco: más peso, más tiempo */
export const PLANES = [
  { id: "dia", nombre: "Día", precio: 25, dias: 1, kg: "10", color: VERDE, texto: "#fff", incluye: ["Todo el equipo por un día", "Entras con tu código QR", "Pagas por transferencia o tarjeta"] },
  { id: "mensual", nombre: "Mensual", precio: 175, dias: 30, kg: "15", color: AMARILLO, texto: GOMA, incluye: ["Sala de pesas y cardio", "Clases Spartan con reserva", "Rutina de inicio con coach", "Regaderas y lockers"] },
  { id: "trimestral", nombre: "Trimestral", precio: 480, dias: 90, kg: "20", color: AZUL, texto: "#fff", incluye: ["Todo lo del mensual", "Entras a las dos sedes", "Inscripción gratis en noviembre"], marca: "El más escogido" },
  { id: "anual", nombre: "Anual", precio: 1650, dias: 365, kg: "25", color: ROJO, texto: "#fff", incluye: ["Todo lo del trimestral", "Congelas hasta 30 días", "Playera de Spartan Force"] },
];
export const INSCRIPCION = 100;
export const porId = <T extends { id: string }>(l: T[], id: string) => l.find((x) => x.id === id)!;

/* aforo típico por hora (de 4 a 21), en personas */
export const AFORO_BASE = [6, 24, 38, 33, 20, 14, 11, 12, 16, 15, 12, 15, 22, 31, 49, 55, 41, 20];
export const horaAhora = () => new Date().getHours();
export function aforo(sede: string, h: number) {
  const i = h - 4;
  if (i < 0 || i >= AFORO_BASE.length) return 0;
  return Math.round(AFORO_BASE[i] * (sede === "villa" ? 0.72 : 1));
}
export function nivel(n: number, cap: number) {
  const p = n / cap;
  return p < 0.12 ? { t: "Vacío", c: VERDE } : p < 0.4 ? { t: "Poco concurrido", c: VERDE } : p < 0.75 ? { t: "Concurrido", c: AMARILLO } : { t: "Muy concurrido", c: ROJO };
}

/* clases de la semana: 0 domingo ... 6 sábado */
export type Clase = { id: string; dia: number; hora: string; nombre: string; coach: string; cupo: number; van: number; foto: string };
const C = (dia: number, hora: string, nombre: string, coach: string, cupo: number, van: number, foto: string): Clase => ({ id: `${dia}-${hora}-${nombre}`, dia, hora, nombre, coach, cupo, van, foto });
export const CLASES: Clase[] = [1, 2, 3, 4, 5].flatMap((d) => [
  C(d, "5:30", "Spinning", "Majo", 18, [14, 16, 11, 18, 9][d - 1], spinning),
  C(d, "6:30", "Funcional", "Ricardo", 16, [12, 9, 15, 10, 13][d - 1], funcional),
  C(d, "18:00", d % 2 ? "Glúteo y pierna" : "Tren superior", "Majo", 14, [13, 8, 14, 7, 11][d - 1], sentadilla),
  C(d, "19:15", d === 5 ? "Zumba" : "Spinning", d === 5 ? "Lucía" : "Ricardo", 18, [17, 12, 18, 10, 15][d - 1], d === 5 ? funcional : spinning),
]).concat([C(6, "7:00", "Funcional en parejas", "Ricardo", 20, 11, funcional), C(6, "9:00", "Spinning", "Majo", 18, 6, spinning), C(0, "8:00", "Movilidad y estiramiento", "Lucía", 15, 4, sentadilla)]);

export const COACHES = [
  { nombre: "Ricardo Méndez", que: "Fuerza y funcional", desde: "Coach desde 2017", foto: coach },
  { nombre: "María José Pérez", que: "Glúteo, pierna y spinning", desde: "Coach desde 2019", foto: coach2 },
];

/* la pizarra del día, según el día de la semana */
export const PIZARRA: Record<number, { titulo: string; lista: string[] }> = {
  0: { titulo: "Movilidad", lista: ["10 min de bici suave", "Estiramiento de cadera", "Plancha 3 x 40 s"] },
  1: { titulo: "Pecho y tríceps", lista: ["Press de banca 4 x 10", "Aperturas 3 x 12", "Fondos 3 x al fallo", "Extensión en polea 3 x 15"] },
  2: { titulo: "Pierna completa", lista: ["Sentadilla 5 x 8", "Prensa 4 x 12", "Peso muerto rumano 4 x 10", "Pantorrilla 4 x 20"] },
  3: { titulo: "Espalda y bíceps", lista: ["Jalón al pecho 4 x 12", "Remo con barra 4 x 10", "Curl con mancuerna 3 x 12", "Face pull 3 x 15"] },
  4: { titulo: "Glúteo", lista: ["Hip thrust 4 x 10", "Patada en polea 3 x 15", "Sentadilla búlgara 3 x 10", "Abductor 4 x 20"] },
  5: { titulo: "Hombro y core", lista: ["Press militar 4 x 8", "Elevaciones laterales 4 x 15", "Rueda abdominal 3 x 12", "Farmer walk 4 vueltas"] },
  6: { titulo: "Funcional en parejas", lista: ["Kettlebell swing", "Cuerdas de batalla", "Burpees", "5 rondas, 40 s cada uno"] },
};

export const AVANCES = [
  { foto: alumna1, quien: "Andrea, 8 meses entrenando", d: "Llegué sin saber agarrar la barra. Ahora hago press sobre la cabeza con 40 kilos y vengo a las 5:30 antes del trabajo." },
  { foto: alumno4, quien: "Wendy y su hermana, 1 año", d: "Venimos juntas después del trabajo. Apartar la clase nos salvó: antes llegábamos y ya no había lugar." },
  { foto: alumna2, quien: "Paola, 5 meses", d: "Lo que más me gusta es ver en el teléfono cuánta gente hay. Si está lleno, mejor vengo más tarde." },
  { foto: alumno3, quien: "Kevin, 3 meses", d: "Me inscribí desde el teléfono un domingo y el lunes ya tenía mi carnet. El coach me armó la rutina de inicio." },
];

export const PREGUNTAS = [
  ["¿Tienen parqueo?", "Sí. En Mixco tenemos parqueo propio para 40 carros y motos. En Villa Nueva usas el de la plaza, con 2 horas gratis."],
  ["¿Cuánto cuesta la inscripción?", `Q${INSCRIPCION}, una sola vez. En noviembre es gratis si pagas el plan trimestral o el anual.`],
  ["¿Puedo congelar mi membresía?", "Con el plan anual, hasta 30 días por viaje o enfermedad. Lo pides en recepción o por WhatsApp."],
  ["¿Hay descuento para estudiantes?", "Sí, 20% en el mensual y el trimestral presentando tu carné vigente."],
  ["¿Me enseñan si nunca he entrenado?", "Sí. Con tu plan va una rutina de inicio con coach la primera semana."],
  ["¿Hay regaderas y lockers?", "Sí, en las dos sedes. Trae tu candado."],
];

/* socios y recepción */
export type Socio = { num: number; nombre: string; plan: string; vence: string; tel: string; sede: string; visitas: number[]; nuevo?: boolean };
export type Entrada = { num: number; hora: string };
export type Pago = { num: number; monto: number; que: string; dia: number; metodo?: string; pendiente?: boolean };

export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const enDias = (n: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return iso(d);
};
export const faltan = (f: string) => Math.round((new Date(f + "T00:00").getTime() - new Date(enDias(0) + "T00:00").getTime()) / 86400000);
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
export const fechaCorta = (f: string) => {
  const [, m, d] = f.split("-").map(Number);
  return `${d} ${MESES[m - 1]}`;
};
export const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function socios(): Socio[] {
  const hoy = new Date().getDate();
  const vis = (cada: number, desde = 0) => Array.from({ length: hoy }, (_, i) => i + 1).filter((d) => (d + desde) % cada === 0 || (d + desde) % cada === 1);
  const s = (num: number, nombre: string, plan: string, vence: number, tel: string, sede: string, cada: number) => ({ num, nombre, plan, vence: enDias(vence), tel, sede, visitas: vis(cada, num) });
  return [
    s(101, "Marvin Estrada", "mensual", 12, "41230987", "mixco", 2),
    s(102, "Lucía Pérez", "mensual", -3, "55013472", "mixco", 3),
    s(103, "Kevin Orellana", "mensual", 2, "47781203", "mixco", 2),
    s(104, "Andrea Cifuentes", "trimestral", 41, "33019876", "mixco", 2),
    s(105, "Diego Marroquín", "mensual", -8, "59920114", "villa", 4),
    s(106, "Sofía Aguilar", "trimestral", 5, "42207731", "villa", 2),
    s(107, "Brayan Tzoc", "mensual", 0, "50317782", "mixco", 2),
    s(108, "Karla Monzón", "mensual", 19, "46612390", "villa", 3),
    s(109, "Josué Barrios", "anual", 210, "31194402", "mixco", 2),
    s(110, "Paola Girón", "mensual", 6, "57718820", "mixco", 2),
    s(111, "Wilmer Chávez", "trimestral", -1, "44102938", "villa", 3),
    s(112, "Daniela Ruiz", "mensual", 23, "52201847", "mixco", 2),
    s(113, "Esteban López", "mensual", -15, "48870021", "mixco", 6),
    s(114, "Mónica Samayoa", "trimestral", 64, "33320918", "villa", 2),
    s(115, "Fernando Cabrera", "anual", 133, "41129985", "mixco", 2),
    s(116, "Gabriela Méndez", "mensual", 4, "56619027", "mixco", 3),
  ];
}
function entradas(lista: Socio[]): Entrada[] {
  const h = horaAhora();
  const horas = ["5:12", "5:20", "5:34", "6:02", "6:15", "6:41", "7:05", "12:10", "12:25", "17:48", "18:03", "18:20", "18:42"];
  const hasta = horas.filter((x) => Number(x.split(":")[0]) <= Math.max(h, 6));
  return lista.filter((x) => faltan(x.vence) >= 0).slice(0, hasta.length).map((x, i) => ({ num: x.num, hora: hasta[i] }));
}
function pagos(): Pago[] {
  const hoy = new Date().getDate();
  const base: [number, number, string][] = [[101, 175, "Mensual"], [104, 480, "Trimestral"], [108, 175, "Mensual"], [112, 175, "Mensual"], [114, 480, "Trimestral"], [110, 175, "Mensual"], [116, 175, "Mensual"], [103, 175, "Mensual"], [0, 25, "Pase de día"], [0, 25, "Pase de día"], [0, 25, "Pase de día"]];
  const metodos = ["tarjeta", "recepción", "transferencia"];
  return base.map(([num, monto, que], i) => {
    const pendiente = i === 2 || i === 5;
    return { num, monto, que, dia: pendiente || i < 2 ? hoy : Math.max(1, Math.min(hoy, 1 + ((i * 3) % hoy))), metodo: pendiente ? "transferencia" : metodos[i % 3] === "transferencia" ? "tarjeta" : metodos[i % 3], pendiente };
  });
}

const CLAVE = "gimnasio:v3";
type Estado = { socios: Socio[]; entradas: Entrada[]; pagos: Pago[]; reservas: Record<string, number> };
export function useGimnasio() {
  const [e, setE] = useState<Estado>(() => {
    try {
      const t = localStorage.getItem(CLAVE);
      if (t) return JSON.parse(t) as Estado;
    } catch {
      /* nada */
    }
    const s = socios();
    return { socios: s, entradas: entradas(s), pagos: pagos(), reservas: {} };
  });
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(e));
    } catch {
      /* nada */
    }
  }, [e]);
  const hora = () => {
    const d = new Date();
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  };
  return {
    ...e,
    inscribir: (x: Omit<Socio, "num" | "visitas">, monto: number, metodo = "tarjeta") => {
      const num = Math.max(...e.socios.map((s) => s.num)) + 1;
      setE((v) => ({ ...v, socios: [...v.socios, { ...x, num, visitas: [], nuevo: true }], pagos: [...v.pagos, { num, monto, que: `Inscripción ${porId(PLANES, x.plan).nombre.toLowerCase()}`, dia: new Date().getDate(), metodo, pendiente: metodo === "transferencia" }] }));
      return num;
    },
    entrar: (num: number) =>
      setE((v) => ({ ...v, entradas: [{ num, hora: hora() }, ...v.entradas], socios: v.socios.map((s) => (s.num === num && !s.visitas.includes(new Date().getDate()) ? { ...s, visitas: [...s.visitas, new Date().getDate()] } : s)) })),
    cobrar: (num: number, metodo = "recepción") =>
      setE((v) => {
        const s = v.socios.find((x) => x.num === num)!;
        const p = porId(PLANES, s.plan);
        const desde = faltan(s.vence) > 0 ? s.vence : enDias(0);
        const d = new Date(desde + "T00:00");
        d.setDate(d.getDate() + p.dias);
        return { ...v, socios: v.socios.map((x) => (x.num === num ? { ...x, vence: iso(d) } : x)), pagos: [...v.pagos, { num, monto: p.precio, que: `Renovación ${p.nombre.toLowerCase()}`, dia: new Date().getDate(), metodo, pendiente: metodo === "transferencia" }] };
      }),
    cambiarPlan: (num: number, plan: string) => setE((v) => ({ ...v, socios: v.socios.map((x) => (x.num === num ? { ...x, plan } : x)) })),
    confirmarPago: (i: number) => setE((v) => ({ ...v, pagos: v.pagos.map((x, k) => (k === i ? { ...x, pendiente: false } : x)) })),
    reservar: (id: string) => setE((v) => ({ ...v, reservas: { ...v.reservas, [id]: v.reservas[id] ? 0 : 1 } })),
    reiniciar: () => {
      const s = socios();
      setE({ socios: s, entradas: entradas(s), pagos: pagos(), reservas: {} });
    },
  };
}
export type Gym = ReturnType<typeof useGimnasio>;
