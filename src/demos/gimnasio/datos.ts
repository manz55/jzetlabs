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

export type Socio = {
  id: number;
  nombre: string;
  plan: PlanId;
  sede: SedeId;
  /* días que le quedan; cero o menos es mensualidad vencida */
  dias: number;
  /* hora a la que entró hoy */
  entrada: string | null;
  recordado: boolean;
  medidas: { peso: Medida; grasa: Medida; musculo: Medida } | null;
  visitas: number;
  marcas: Record<Ejercicio, Medida>;
};

export const META_VISITAS = 16;
export const PASO_PESO = 5;
export const BARRA = 45;

export type Estado = "vencido" | "pronto" | "al-dia";
export const estadoDe = (dias: number): Estado => (dias <= 0 ? "vencido" : dias <= 7 ? "pronto" : "al-dia");

export function fechaEn(dias: number) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toLocaleDateString("es-GT", { day: "numeric", month: "long" });
}

export function textoDias(dias: number) {
  if (dias === 0) return "Venció hoy";
  if (dias < 0) return dias === -1 ? "Venció ayer" : `Venció hace ${-dias} días`;
  return dias === 1 ? "Le queda 1 día" : `Le quedan ${dias} días`;
}

const m = (ahora: number, antes: number): Medida => ({ ahora, antes });

function socio(
  id: number,
  nombre: string,
  plan: PlanId,
  sede: SedeId,
  dias: number,
  entrada: string | null,
  [peso, grasa, musculo]: [number, number, number],
  [banca, sentadilla, muerto]: [number, number, number],
  visitas: number,
): Socio {
  return {
    id,
    nombre,
    plan,
    sede,
    dias,
    entrada,
    recordado: false,
    medidas: { peso: m(peso, peso + 3), grasa: m(grasa, grasa + 1.2), musculo: m(musculo, musculo - 1) },
    visitas,
    marcas: { "Press Banca": m(banca, banca - 5), Sentadilla: m(sentadilla, sentadilla - 10), "Peso Muerto": m(muerto, muerto - 10) },
  };
}

const SOCIOS: Socio[] = [
  socio(1001, "Andrea López", "ilimitado", "z14", 18, "6:05 a.m.", [138, 24.5, 58], [75, 135, 165], 11),
  socio(1002, "Héctor Ruano", "esencial", "z14", -15, null, [196, 27, 82], [135, 185, 225], 2),
  socio(1003, "José Pablo Ramírez", "duo", "caes", -8, null, [172, 19.5, 78], [155, 225, 275], 4),
  socio(1004, "Carlos Méndez", "esencial", "z14", -3, null, [181, 22, 79], [145, 205, 245], 8),
  socio(1005, "María Fernanda Ortiz", "ilimitado", "caes", -1, null, [129, 23, 54], [65, 115, 145], 12),
  socio(1006, "Lucía Castañeda", "esencial", "caes", 2, "7:40 a.m.", [144, 28, 55], [55, 95, 125], 9),
  socio(1007, "Diego Aguilar", "ilimitado", "z14", 4, null, [165, 15, 76], [175, 245, 305], 13),
  socio(1008, "Gabriela Monzón", "duo", "z14", 6, "5:20 a.m.", [133, 22.5, 56], [70, 125, 155], 10),
  socio(1009, "Roberto Solís", "esencial", "z14", 11, "5:45 a.m.", [204, 29, 84], [125, 165, 215], 7),
  socio(1010, "Paola Estrada", "ilimitado", "z14", 14, "8:10 a.m.", [126, 21, 55], [75, 145, 175], 14),
  socio(1011, "Ana Sofía Barrios", "ilimitado", "caes", 22, "6:55 a.m.", [141, 25.5, 57], [60, 105, 135], 6),
  socio(1012, "Fernando Chacón", "ilimitado", "z14", 25, "9:30 a.m.", [176, 17.5, 80], [185, 255, 315], 12),
  socio(1013, "Claudia Herrera", "duo", "caes", 27, null, [152, 30, 56], [50, 85, 115], 5),
  socio(1014, "Marvin de León", "esencial", "caes", 29, "10:05 a.m.", [168, 20, 74], [135, 195, 235], 3),
];

export type Alta = { nombre: string; plan: PlanId; sede: SedeId };

export function useClub() {
  const [socios, setSocios] = useState<Socio[]>(SOCIOS);
  const [ingresos, setIngresos] = useState(() => SOCIOS.filter((s) => s.dias > 0).reduce((t, s) => t + planDe(s.plan).precio, 0));
  /* cada reserva es "socio:clase" */
  const [reservas, setReservas] = useState<string[]>([]);

  const cambiar = (id: number, cambio: (s: Socio) => Socio) => setSocios((l) => l.map((s) => (s.id === id ? cambio(s) : s)));

  return {
    socios,
    ingresos,
    reservas,

    inscribir({ nombre, plan, sede }: Alta) {
      const id = Math.max(...socios.map((s) => s.id)) + 1;
      const nuevo: Socio = {
        id,
        nombre,
        plan,
        sede,
        dias: 30,
        entrada: null,
        recordado: false,
        medidas: null,
        visitas: 0,
        marcas: { "Press Banca": m(BARRA, BARRA), Sentadilla: m(BARRA, BARRA), "Peso Muerto": m(BARRA, BARRA) },
      };
      setSocios((l) => [nuevo, ...l]);
      setIngresos((t) => t + planDe(plan).precio);
      return id;
    },

    /* suma 30 días a partir de hoy (o de la fecha de vencimiento si aún no llega) */
    renovar(s: Socio) {
      cambiar(s.id, (x) => ({ ...x, dias: Math.max(x.dias, 0) + 30, recordado: false }));
      setIngresos((t) => t + planDe(s.plan).precio);
    },

    /* "antes" es el socio tal como estaba antes del cobro */
    deshacerCobro(antes: Socio) {
      cambiar(antes.id, (x) => ({ ...x, dias: antes.dias, recordado: antes.recordado }));
      setIngresos((t) => t - planDe(antes.plan).precio);
    },

    recordar(id: number) {
      cambiar(id, (x) => ({ ...x, recordado: true }));
    },

    alternarReserva(socioId: number, claseId: string) {
      const llave = `${socioId}:${claseId}`;
      setReservas((r) => (r.includes(llave) ? r.filter((x) => x !== llave) : [...r, llave]));
    },

    marcar(id: number, ejercicio: Ejercicio, cambio: number) {
      cambiar(id, (x) => ({ ...x, marcas: { ...x.marcas, [ejercicio]: { ...x.marcas[ejercicio], ahora: Math.max(BARRA, x.marcas[ejercicio].ahora + cambio) } } }));
    },
  };
}

export type Club = ReturnType<typeof useClub>;

export const libresDe = (c: Clase, reservas: string[]) => c.libres - reservas.filter((r) => r.endsWith(`:${c.id}`)).length;
