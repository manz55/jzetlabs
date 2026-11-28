/*
 * Datos de IronPeak Performance Club (gimnasio inventado) y el estado que comparten las tres vistas:
 * una inscripción, un cobro o una reserva se ven al instante en la portada, el pase y recepción.
 */
import { useState } from "react";

export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;

export const foto = (id: string, ancho: number, alto: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${ancho}&h=${alto}&q=72`;

export const FOTOS = {
  portada: "1758875569256-f37c438cac65",
  pesas: "1623874514711-0f321325f318",
  cardio: "1721394749382-223a18ce8bb9",
  grupal: "1517130038641-a774d04afb3c",
  evaluacion: "1758875570137-8691b7c55033",
  zona14: "1685633224767-361354e84e2b",
  carretera: "1685633224408-b42cdcff553b",
};

/* ---------- planes ---------- */

export type PlanId = "esencial" | "ilimitado" | "duo";

export type Plan = {
  id: PlanId;
  nombre: string;
  precio: number;
  para: string;
  incluye: string[];
  aparte?: string;
};

export const PLANES: Plan[] = [
  {
    id: "esencial",
    nombre: "Plan Esencial",
    precio: 275,
    para: "Para entrenar por su cuenta.",
    incluye: ["Peso libre y máquinas", "Cardio y ergómetros", "Evaluación física mensual sin costo", "Vestidores y duchas", "Las dos sedes"],
    aparte: "Las clases grupales se pagan sueltas: Q35 cada una.",
  },
  {
    id: "ilimitado",
    nombre: "Plan Ilimitado + Clases",
    precio: 395,
    para: "Sala de pesas y todas las clases.",
    incluye: ["Todo lo del Plan Esencial", "Clases grupales sin límite", "Reserva de cupo desde el celular", "Rutina revisada con su coach cada mes"],
  },
  {
    id: "duo",
    nombre: "Plan Dúo",
    precio: 690,
    para: "Dos personas en un solo pago.",
    incluye: ["Plan Ilimitado + Clases para dos", "Un carné de entrada por persona", "Pueden entrenar a horas distintas", "Ahorran Q100 al mes"],
  },
];

export const planDe = (id: PlanId) => PLANES.find((p) => p.id === id)!;

/* ---------- sedes ---------- */

export type SedeId = "z14" | "caes";

export const HORARIO = [
  { dias: "Lunes a viernes", horas: "5:00 a.m. a 10:00 p.m." },
  { dias: "Sábado", horas: "7:00 a.m. a 6:00 p.m." },
  { dias: "Domingo", horas: "7:00 a.m. a 1:00 p.m." },
];

export const SEDES = [
  {
    id: "z14" as SedeId,
    nombre: "Zona 14",
    direccion: "Boulevard Los Próceres, zona 14, Ciudad de Guatemala",
    parqueo: "Parqueo en sótano, sin costo para socios",
    foto: FOTOS.zona14,
    alt: "Sala de peso libre con racks y plataformas",
  },
  {
    id: "caes" as SedeId,
    nombre: "Carretera a El Salvador",
    direccion: "Km 14.5 Carretera a El Salvador, Santa Catarina Pinula",
    parqueo: "Parqueo propio al aire libre, sin costo",
    foto: FOTOS.carretera,
    alt: "Área de máquinas del gimnasio en dos niveles",
  },
];

export const sedeDe = (id: SedeId) => SEDES.find((s) => s.id === id)!;
export const mapa = (direccion: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${direccion}, Guatemala`)}`;

/* ---------- clases ---------- */

export const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"] as const;

export type Clase = { id: string; dia: number; hora: string; nombre: string; coach: string; sala: string; sede: SedeId; cupo: number; libres: number };

type Molde = [hora: string, nombre: string, coach: string, sala: string, sede: SedeId, cupo: number, libres: number];

const SEMANA: Molde[][] = [
  [
    ["6:00 a.m.", "Fuerza total", "Diego Estrada", "Sala de fuerza", "z14", 18, 14],
    ["7:15 a.m.", "Funcional", "Marcela Ruiz", "Salón grupal", "caes", 20, 7],
    ["12:15 p.m.", "Core y movilidad", "Andrea Morales", "Salón grupal", "z14", 16, 11],
    ["6:00 p.m.", "Spinning", "Luis Barrios", "Sala de ciclismo", "z14", 18, 3],
    ["7:15 p.m.", "Baile fitness", "Marcela Ruiz", "Salón grupal", "caes", 22, 9],
  ],
  [
    ["6:00 a.m.", "Spinning", "Luis Barrios", "Sala de ciclismo", "z14", 18, 8],
    ["8:30 a.m.", "Glúteo y pierna", "Andrea Morales", "Sala de fuerza", "caes", 14, 5],
    ["5:30 p.m.", "Técnica de levantamiento", "Diego Estrada", "Sala de fuerza", "z14", 12, 4],
    ["7:00 p.m.", "Funcional", "Marcela Ruiz", "Salón grupal", "z14", 20, 0],
  ],
  [
    ["6:00 a.m.", "Fuerza total", "Diego Estrada", "Sala de fuerza", "z14", 18, 10],
    ["7:15 a.m.", "Core y movilidad", "Andrea Morales", "Salón grupal", "caes", 16, 12],
    ["12:15 p.m.", "Funcional", "Marcela Ruiz", "Salón grupal", "z14", 20, 15],
    ["6:00 p.m.", "Spinning", "Luis Barrios", "Sala de ciclismo", "caes", 18, 6],
    ["7:15 p.m.", "Glúteo y pierna", "Andrea Morales", "Sala de fuerza", "z14", 14, 2],
  ],
  [
    ["6:00 a.m.", "Spinning", "Luis Barrios", "Sala de ciclismo", "caes", 18, 12],
    ["8:30 a.m.", "Funcional", "Marcela Ruiz", "Salón grupal", "z14", 20, 13],
    ["5:30 p.m.", "Técnica de levantamiento", "Diego Estrada", "Sala de fuerza", "caes", 12, 7],
    ["7:00 p.m.", "Baile fitness", "Marcela Ruiz", "Salón grupal", "z14", 22, 5],
  ],
  [
    ["6:00 a.m.", "Fuerza total", "Diego Estrada", "Sala de fuerza", "z14", 18, 9],
    ["7:15 a.m.", "Funcional", "Marcela Ruiz", "Salón grupal", "caes", 20, 11],
    ["12:15 p.m.", "Core y movilidad", "Andrea Morales", "Salón grupal", "z14", 16, 14],
    ["6:00 p.m.", "Spinning", "Luis Barrios", "Sala de ciclismo", "z14", 18, 4],
  ],
  [
    ["8:00 a.m.", "Fuerza total", "Diego Estrada", "Sala de fuerza", "z14", 18, 6],
    ["9:15 a.m.", "Spinning", "Luis Barrios", "Sala de ciclismo", "caes", 18, 10],
    ["10:30 a.m.", "Baile fitness", "Marcela Ruiz", "Salón grupal", "z14", 22, 13],
  ],
];

export const CLASES: Clase[] = SEMANA.flatMap((lista, dia) => lista.map(([hora, nombre, coach, sala, sede, cupo, libres], i) => ({ id: `${dia}-${i}`, dia, hora, nombre, coach, sala, sede, cupo, libres })));

/* el día de hoy en la lista de arriba; el domingo se muestra el lunes */
export const diaDeHoy = () => {
  const d = new Date().getDay();
  return d === 0 ? 0 : d - 1;
};

/* ---------- socios ---------- */

export const EJERCICIOS = ["Press Banca", "Sentadilla", "Peso Muerto"] as const;
export type Ejercicio = (typeof EJERCICIOS)[number];

export type Medida = { ahora: number; antes: number };

export type Personales = { nombre: string; dpi: string; nit: string; nacimiento: string; telefono: string; correo: string; emergenciaNombre: string; emergenciaTelefono: string };
export type Tarjeta = { marca: string; ultimos: string; vence: string };
export type Nota = { cuando: string; texto: string };

export type Movimiento = { id: string; nombre: string; series: number; reps: number; peso: number; hecho: boolean };
export type DiaRutina = { dia: string; nombre: string; descanso: boolean; ejercicios: Movimiento[] };

export type Cuerpo = "peso" | "grasa" | "musculo";

export type PeriodoId = "mes" | "trimestre" | "anual";
export const PERIODOS = [
  { id: "mes" as PeriodoId, nombre: "1 mes", dias: 30, meses: 1, descuento: 0 },
  { id: "trimestre" as PeriodoId, nombre: "Trimestre", dias: 90, meses: 3, descuento: 0.1 },
  { id: "anual" as PeriodoId, nombre: "Anual", dias: 365, meses: 12, descuento: 0.2 },
];
export const periodoDe = (id: PeriodoId) => PERIODOS.find((p) => p.id === id)!;
export const montoDe = (plan: PlanId, periodo: PeriodoId) => {
  const p = periodoDe(periodo);
  return Math.round(planDe(plan).precio * p.meses * (1 - p.descuento));
};

export type Metodo = "tarjeta" | "transferencia" | "efectivo" | "pos";
export const NOMBRE_METODO: Record<Metodo, string> = { tarjeta: "Tarjeta de crédito o débito", transferencia: "Transferencia bancaria", efectivo: "Efectivo", pos: "POS con tarjeta" };

export const CUENTAS = [
  { banco: "Banco Industrial (BI)", numero: "000-000123-4" },
  { banco: "BAC Credomatic", numero: "000000456" },
];

export type Pago = { recibo: string; fecha: string; periodo: string; metodo: Metodo; detalle: string; monto: number; hasta: string };

export type Cobro = { periodo: PeriodoId; metodo: Metodo; detalle: string; tarjeta?: Tarjeta; debito?: boolean };

export type Socio = Personales & {
  id: number;
  plan: PlanId;
  sede: SedeId;
  /* días que le quedan; cero o menos es mensualidad vencida */
  dias: number;
  /* hasta cuándo dura el pase de tolerancia; null si no tiene */
  tolerancia: string | null;
  /* hora a la que entró hoy */
  entrada: string | null;
  tarjeta: Tarjeta | null;
  debito: boolean;
  notas: Nota[];
  pagos: Pago[];
  avisos: { whatsapp: boolean; correo: boolean };
  /* cómo prefiere pagar el socio */
  preferido: Metodo;
  huella: boolean;
  medidas: Record<Cuerpo, Medida | null>;
  /* entrenos que quiere hacer al mes */
  meta: number;
  visitas: number;
  marcas: Record<Ejercicio, Medida>;
  rutina: DiaRutina[];
};

export const META_INICIAL = 16;
export const PASO_PESO = 5;
export const BARRA = 45;

export type Estado = "vencido" | "pronto" | "al-dia";
export const estadoDe = (dias: number): Estado => (dias <= 0 ? "vencido" : dias <= 7 ? "pronto" : "al-dia");

/* para recepción: el que debe pero tiene pase de tolerancia va aparte */
export type Grupo = Estado | "tolerancia";
export const grupoDe = (s: Socio): Grupo => (s.dias <= 0 && s.tolerancia ? "tolerancia" : estadoDe(s.dias));

export type Acceso = "activo" | "tolerancia" | "bloqueado";
export const accesoDe = (s: Socio): Acceso => (s.dias > 0 ? "activo" : s.tolerancia ? "tolerancia" : "bloqueado");

export function fechaEn(dias: number, conAnio = false) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toLocaleDateString("es-GT", { day: "numeric", month: "long", ...(conAnio ? { year: "numeric" } : {}) });
}

export function horaDe(d = new Date()) {
  const h = d.getHours();
  return `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${h < 12 ? "a.m." : "p.m."}`;
}

const ahora = () => `${fechaEn(0)}, ${horaDe()}`;

export function textoDias(dias: number) {
  if (dias === 0) return "Venció hoy";
  if (dias < 0) return dias === -1 ? "Venció ayer" : `Venció hace ${-dias} días`;
  return dias === 1 ? "Le queda 1 día" : `Le quedan ${dias} días`;
}

/* DPI de 13 números en grupos de 4, 5 y 4 */
export const formatoDpi = (t: string) => [t.slice(0, 4), t.slice(4, 9), t.slice(9, 13)].filter(Boolean).join(" ");
export const formatoTelefono = (t: string) => [t.slice(0, 4), t.slice(4, 8)].filter(Boolean).join(" ");

export const metodoDebito = (s: Socio) => (s.tarjeta ? `${s.tarjeta.marca} •••• ${s.tarjeta.ultimos} · ${s.debito ? "débito automático activo" : "sin débito automático"}` : "Sin tarjeta guardada");

/* ---------- rutina ---------- */

const redondo = (n: number) => Math.max(5, Math.round(n / 5) * 5);

function rutinaDe(banca: number, sentadilla: number, muerto: number): DiaRutina[] {
  const dia = (nombreDia: string, nombre: string, lista: [string, number, number, number][]): DiaRutina => ({
    dia: nombreDia,
    nombre,
    descanso: lista.length === 0,
    ejercicios: lista.map(([n, series, reps, peso], i) => ({ id: `${nombreDia}-${i}`, nombre: n, series, reps, peso: peso ? redondo(peso) : 0, hecho: false })),
  });
  return [
    dia("Lunes", "Empuje · Pecho y hombro", [["Press Banca", 4, 8, banca * 0.8], ["Press militar", 3, 10, banca * 0.5], ["Press inclinado con mancuernas", 3, 10, banca * 0.3], ["Extensión de tríceps", 3, 12, banca * 0.3]]),
    dia("Martes", "Descanso", []),
    dia("Miércoles", "Pierna completa", [["Sentadilla", 4, 8, sentadilla * 0.8], ["Peso muerto rumano", 3, 10, muerto * 0.6], ["Prensa de pierna", 3, 12, sentadilla * 1.3], ["Elevación de pantorrilla", 4, 15, sentadilla * 0.7]]),
    dia("Jueves", "Descanso", []),
    dia("Viernes", "Jalón · Espalda y bíceps", [["Peso Muerto", 4, 5, muerto * 0.8], ["Jalón al pecho", 3, 10, banca * 0.7], ["Remo con barra", 3, 10, banca * 0.65], ["Curl de bíceps", 3, 12, banca * 0.25]]),
    dia("Sábado", "Cardio y abdomen", [["Bicicleta por intervalos", 5, 2, 0], ["Abdominales en banco", 3, 15, 0], ["Elevación de piernas", 3, 12, 0]]),
  ];
}

/* ---------- socios de arranque ---------- */

const m = (ahora: number, antes: number): Medida => ({ ahora, antes });

type Ficha = {
  id: number;
  nombre: string;
  plan: PlanId;
  sede: SedeId;
  dias: number;
  entrada?: string;
  cuerpo: [number, number, number];
  fuerza: [number, number, number];
  visitas: number;
  nacimiento: string;
  contacto: string;
  tarjeta?: Tarjeta;
  debito?: boolean;
  tolerancia?: boolean;
};

function socio(f: Ficha): Socio {
  const [peso, grasa, musculo] = f.cuerpo;
  const [banca, sentadilla, muerto] = f.fuerza;
  const metodo: Metodo = f.debito ? "tarjeta" : f.id % 2 ? "efectivo" : "pos";
  const detalle = f.debito ? `${f.tarjeta!.marca} •••• ${f.tarjeta!.ultimos} (débito automático)` : "Cobrado en recepción";
  /* los dos últimos meses pagados */
  const pagos: Pago[] = [0, 1].map((i) => {
    const hasta = f.dias - i * 30;
    return { recibo: `R-${String(f.id * 10 - i).padStart(6, "0")}`, fecha: fechaEn(hasta - 30, true), periodo: "1 mes", metodo, detalle, monto: planDe(f.plan).precio, hasta: fechaEn(hasta, true) };
  });
  const correo = f.nombre.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/\s+/g, ".") + "@example.com";
  return {
    id: f.id,
    nombre: f.nombre,
    nit: f.id % 3 === 0 ? `${f.id * 7919}-${f.id % 9}` : "CF",
    plan: f.plan,
    sede: f.sede,
    dias: f.dias,
    tolerancia: f.tolerancia ? `mañana a las ${horaDe()}` : null,
    entrada: f.entrada ?? null,
    dpi: `0000${10000 + f.id}0101`,
    nacimiento: f.nacimiento,
    telefono: `0000${f.id}`,
    correo,
    emergenciaNombre: f.contacto,
    emergenciaTelefono: `0000${f.id + 1000}`,
    tarjeta: f.tarjeta ?? null,
    debito: f.debito ?? false,
    notas: f.tolerancia ? [{ cuando: ahora(), texto: "Pase de tolerancia 24h. Promesa de pago mañana." }] : [],
    pagos,
    avisos: { whatsapp: false, correo: false },
    preferido: metodo,
    huella: true,
    medidas: { peso: m(peso, peso + 3), grasa: m(grasa, grasa + 1.2), musculo: m(musculo, musculo - 1) },
    meta: META_INICIAL,
    visitas: f.visitas,
    marcas: { "Press Banca": m(banca, banca - 5), Sentadilla: m(sentadilla, sentadilla - 10), "Peso Muerto": m(muerto, muerto - 10) },
    rutina: rutinaDe(banca, sentadilla, muerto),
  };
}

const visa = (ultimos: string, vence = "08/28"): Tarjeta => ({ marca: "Visa", ultimos, vence });
const master = (ultimos: string, vence = "03/29"): Tarjeta => ({ marca: "Mastercard", ultimos, vence });

/* en orden de urgencia: primero quien debe */
const SOCIOS: Socio[] = [
  socio({ id: 1002, nombre: "Héctor Ruano", plan: "esencial", sede: "z14", dias: -15, cuerpo: [196, 27, 82], fuerza: [135, 185, 225], visitas: 2, nacimiento: "1988-03-14", contacto: "Rosa Ruano (mamá)", tarjeta: visa("1190", "01/27") }),
  socio({ id: 1003, nombre: "José Pablo Ramírez", plan: "duo", sede: "caes", dias: -8, cuerpo: [172, 19.5, 78], fuerza: [155, 225, 275], visitas: 4, nacimiento: "1992-07-02", contacto: "Karla Ramírez (hermana)" }),
  socio({ id: 1004, nombre: "Carlos Méndez", plan: "esencial", sede: "z14", dias: -3, cuerpo: [181, 22, 79], fuerza: [145, 205, 245], visitas: 8, nacimiento: "1985-11-21", contacto: "Elena de Méndez (esposa)" }),
  socio({ id: 1005, nombre: "María Fernanda Ortiz", plan: "ilimitado", sede: "caes", dias: -1, cuerpo: [129, 23, 54], fuerza: [65, 115, 145], visitas: 12, nacimiento: "1996-01-30", contacto: "Luis Ortiz (papá)", tolerancia: true }),
  socio({ id: 1006, nombre: "Lucía Castañeda", plan: "esencial", sede: "caes", dias: 2, entrada: "7:40 a.m.", cuerpo: [144, 28, 55], fuerza: [55, 95, 125], visitas: 9, nacimiento: "1990-05-18", contacto: "Mario Castañeda (hermano)" }),
  socio({ id: 1007, nombre: "Diego Aguilar", plan: "ilimitado", sede: "z14", dias: 4, cuerpo: [165, 15, 76], fuerza: [175, 245, 305], visitas: 13, nacimiento: "1999-09-09", contacto: "Sandra Aguilar (mamá)", tarjeta: master("7732") }),
  socio({ id: 1008, nombre: "Gabriela Monzón", plan: "duo", sede: "z14", dias: 6, entrada: "5:20 a.m.", cuerpo: [133, 22.5, 56], fuerza: [70, 125, 155], visitas: 10, nacimiento: "1994-12-05", contacto: "Julio Monzón (esposo)" }),
  socio({ id: 1001, nombre: "Andrea López", plan: "ilimitado", sede: "z14", dias: 18, entrada: "6:05 a.m.", cuerpo: [138, 24.5, 58], fuerza: [75, 135, 165], visitas: 11, nacimiento: "1995-04-23", contacto: "Claudia de López (mamá)", tarjeta: visa("4821"), debito: true }),
  socio({ id: 1009, nombre: "Roberto Solís", plan: "esencial", sede: "z14", dias: 11, entrada: "5:45 a.m.", cuerpo: [204, 29, 84], fuerza: [125, 165, 215], visitas: 7, nacimiento: "1979-08-12", contacto: "Marta de Solís (esposa)" }),
  socio({ id: 1010, nombre: "Paola Estrada", plan: "ilimitado", sede: "z14", dias: 14, entrada: "8:10 a.m.", cuerpo: [126, 21, 55], fuerza: [75, 145, 175], visitas: 14, nacimiento: "1997-02-27", contacto: "Iván Estrada (hermano)", tarjeta: master("2045"), debito: true }),
  socio({ id: 1011, nombre: "Ana Sofía Barrios", plan: "ilimitado", sede: "caes", dias: 22, entrada: "6:55 a.m.", cuerpo: [141, 25.5, 57], fuerza: [60, 105, 135], visitas: 6, nacimiento: "2001-06-15", contacto: "Patricia Barrios (mamá)" }),
  socio({ id: 1012, nombre: "Fernando Chacón", plan: "ilimitado", sede: "z14", dias: 25, entrada: "9:30 a.m.", cuerpo: [176, 17.5, 80], fuerza: [185, 255, 315], visitas: 12, nacimiento: "1991-10-08", contacto: "Silvia Chacón (hermana)", tarjeta: visa("9034", "11/27"), debito: true }),
  socio({ id: 1013, nombre: "Claudia Herrera", plan: "duo", sede: "caes", dias: 27, cuerpo: [152, 30, 56], fuerza: [50, 85, 115], visitas: 5, nacimiento: "1983-03-03", contacto: "Óscar Herrera (esposo)" }),
  socio({ id: 1014, nombre: "Marvin de León", plan: "esencial", sede: "caes", dias: 29, entrada: "10:05 a.m.", cuerpo: [168, 20, 74], fuerza: [135, 195, 235], visitas: 3, nacimiento: "1987-07-19", contacto: "Irma de León (mamá)" }),
];

/* ---------- talanquera ---------- */

export type Resultado = "paso" | "tolerancia" | "rechazo" | "manual";
export type Lectura = { n: number; ts: number; hora: string; socio: number | null; nombre: string; metodo: string; sede: SedeId; resultado: Resultado };

/* las entradas de la mañana, de la más reciente a la más antigua */
const minutos = (hora: string) => {
  const [h, resto] = hora.split(":");
  return ((Number(h) % 12) + (hora.includes("p.m.") ? 12 : 0)) * 60 + parseInt(resto, 10);
};
const LECTURAS: Lectura[] = SOCIOS.filter((s) => s.entrada)
  .sort((a, b) => minutos(b.entrada!) - minutos(a.entrada!))
  .map((s, i) => ({ n: 100 - i, ts: 0, hora: s.entrada!, socio: s.id, nombre: s.nombre, metodo: i % 3 === 1 ? "QR App" : "Huella", sede: s.sede, resultado: "paso" as const }));

export type Alta = { nombre: string; plan: PlanId; sede: SedeId; telefono: string };

export function useClub() {
  const [socios, setSocios] = useState<Socio[]>(SOCIOS);
  const [ingresos, setIngresos] = useState(() => SOCIOS.filter((s) => s.dias > 0).reduce((t, s) => t + planDe(s.plan).precio, 0));
  const [lecturas, setLecturas] = useState<Lectura[]>(LECTURAS);
  /* cada reserva es "socio:clase" */
  const [reservas, setReservas] = useState<string[]>([]);
  const [recibos, setRecibos] = useState(10200);

  const cambiar = (id: number, cambio: (s: Socio) => Socio) => setSocios((l) => l.map((s) => (s.id === id ? cambio(s) : s)));
  const conNota = (s: Socio, texto: string): Socio => ({ ...s, notas: [{ cuando: ahora(), texto }, ...s.notas] });
  const anotar = (l: Omit<Lectura, "n" | "ts" | "hora">) => {
    const nueva = { ...l, n: Math.max(0, ...lecturas.map((x) => x.n)) + 1, ts: Date.now(), hora: horaDe() };
    setLecturas((todas) => [nueva, ...todas]);
    return nueva;
  };

  return {
    socios,
    ingresos,
    reservas,
    lecturas,

    inscribir({ nombre, plan, sede, telefono }: Alta) {
      const id = Math.max(...socios.map((s) => s.id)) + 1;
      const recibo = recibos + 1;
      const precio = planDe(plan).precio;
      const nuevo: Socio = {
        id,
        nombre,
        plan,
        sede,
        dias: 30,
        tolerancia: null,
        entrada: null,
        dpi: "",
        nacimiento: "",
        nit: "CF",
        telefono,
        correo: "",
        emergenciaNombre: "",
        emergenciaTelefono: "",
        tarjeta: null,
        debito: false,
        notas: [{ cuando: ahora(), texto: "Inscripción en línea. Falta DPI y contacto de emergencia." }],
        pagos: [{ recibo: `R-${String(recibo).padStart(6, "0")}`, fecha: fechaEn(0, true), periodo: "1 mes", metodo: "efectivo", detalle: "Inscripción en línea", monto: precio, hasta: fechaEn(30, true) }],
        avisos: { whatsapp: false, correo: false },
        preferido: "efectivo",
        huella: false,
        medidas: { peso: null, grasa: null, musculo: null },
        meta: META_INICIAL,
        visitas: 0,
        marcas: { "Press Banca": m(BARRA, BARRA), Sentadilla: m(BARRA, BARRA), "Peso Muerto": m(BARRA, BARRA) },
        rutina: rutinaDe(BARRA / 0.8, BARRA / 0.8, BARRA / 0.8),
      };
      setRecibos(recibo);
      setSocios((l) => [nuevo, ...l]);
      setIngresos((t) => t + precio);
      return id;
    },

    /* suma los días del periodo desde hoy (o desde el vencimiento si aún no llega) y devuelve el recibo */
    cobrar(s: Socio, c: Cobro): Pago {
      const periodo = periodoDe(c.periodo);
      const dias = Math.max(s.dias, 0) + periodo.dias;
      const numero = recibos + 1;
      const pago: Pago = { recibo: `R-${String(numero).padStart(6, "0")}`, fecha: fechaEn(0, true), periodo: periodo.nombre, metodo: c.metodo, detalle: c.detalle, monto: montoDe(s.plan, c.periodo), hasta: fechaEn(dias, true) };
      setRecibos(numero);
      cambiar(s.id, (x) => {
        const pagado: Socio = {
          ...x,
          dias,
          tolerancia: null,
          avisos: { whatsapp: false, correo: false },
          pagos: [pago, ...x.pagos],
          tarjeta: c.tarjeta ?? x.tarjeta,
          debito: c.debito ?? x.debito,
        };
        return c.metodo === "transferencia" ? conNota(pagado, `Verificar en banco: ${c.detalle} (${pago.recibo}).`) : pagado;
      });
      setIngresos((t) => t + pago.monto);
      return pago;
    },

    /* "antes" es el socio tal como estaba antes del cobro */
    anularCobro(antes: Socio, pago: Pago) {
      cambiar(antes.id, () => conNota(antes, `Cobro ${pago.recibo} anulado.`));
      setIngresos((t) => t - pago.monto);
    },

    tolerar(id: number) {
      cambiar(id, (x) => conNota({ ...x, tolerancia: `mañana a las ${horaDe()}` }, "Pase de tolerancia 24h. Promesa de pago mañana."));
    },

    quitarTolerancia(id: number) {
      cambiar(id, (x) => conNota({ ...x, tolerancia: null }, "Pase de tolerancia retirado."));
    },

    avisar(id: number, canal: "whatsapp" | "correo") {
      cambiar(id, (x) => ({ ...x, avisos: { ...x.avisos, [canal]: true } }));
    },

    /* lectura de QR o huella: abre si está al día o con tolerancia */
    leer(s: Socio, metodo: string) {
      const acceso = accesoDe(s);
      const lectura = anotar({ socio: s.id, nombre: s.nombre, metodo, sede: "z14", resultado: acceso === "activo" ? "paso" : acceso === "tolerancia" ? "tolerancia" : "rechazo" });
      if (acceso !== "bloqueado") cambiar(s.id, (x) => ({ ...x, entrada: lectura.hora, visitas: x.entrada ? x.visitas : x.visitas + 1 }));
      return lectura;
    },

    abrirManual(motivo: string) {
      anotar({ socio: null, nombre: motivo, metodo: "Apertura manual", sede: "z14", resultado: "manual" });
    },

    guardar(id: number, cambios: Partial<Socio>) {
      cambiar(id, (x) => ({ ...x, ...cambios }));
    },

    nota(id: number, texto: string) {
      cambiar(id, (x) => conNota(x, texto));
    },

    marcarEjercicio(id: number, dia: number, ejercicio: string) {
      cambiar(id, (x) => ({ ...x, rutina: x.rutina.map((d, i) => (i === dia ? { ...d, ejercicios: d.ejercicios.map((e) => (e.id === ejercicio ? { ...e, hecho: !e.hecho } : e)) } : d)) }));
    },

    guardarDia(id: number, dia: number, nuevo: DiaRutina) {
      cambiar(id, (x) => ({ ...x, rutina: x.rutina.map((d, i) => (i === dia ? nuevo : d)) }));
    },

    alternarReserva(socioId: number, claseId: string) {
      const llave = `${socioId}:${claseId}`;
      setReservas((r) => (r.includes(llave) ? r.filter((x) => x !== llave) : [...r, llave]));
    },
  };
}

export type Club = ReturnType<typeof useClub>;

export const libresDe = (c: Clase, reservas: string[]) => c.libres - reservas.filter((r) => r.endsWith(`:${c.id}`)).length;
