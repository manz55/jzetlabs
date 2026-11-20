/*
 * Datos de ejemplo de "Veterinaria Huesitos" (negocio inventado).
 * Los problemas que resuelve salen de lo que más le cuesta a una veterinaria pequeña:
 * el teléfono saturado, dueños que no saben si es urgencia, vacunas olvidadas,
 * resultados de laboratorio que nadie entiende y mascotas internadas sin noticias.
 */

export const BOSQUE = "#1d4d3f";
export const MENTA = "#d5ebdf";
export const MOSTAZA = "#e8a33d";
export const CREMA = "#f7f3ea";
export const PAPEL = "#fffdf8";
export const ROJO = "#c8392b";
export const AMBAR = "#d9861a";
export const VERDE = "#2f7d4f";
export const TITULO = "'Young Serif', Georgia, serif";

export type Especie = "perro" | "gato";

export const SERVICIOS = [
  { id: "consulta", nombre: "Consulta general", precio: 150, dura: 30, detalle: "Revisión completa, peso y diagnóstico." },
  { id: "vacuna", nombre: "Vacunas", precio: 120, dura: 15, detalle: "Desde Q120 según la vacuna. Queda anotada en tu carné." },
  { id: "desparasitacion", nombre: "Desparasitación", precio: 60, dura: 15, detalle: "Interna o externa, por peso." },
  { id: "grooming", nombre: "Baño y corte", precio: 125, dura: 90, detalle: "Desde Q125 según tamaño y pelo." },
  { id: "esterilizacion", nombre: "Esterilización", precio: 650, dura: 0, detalle: "Desde Q650. Incluye anestesia y control a los 8 días." },
  { id: "laboratorio", nombre: "Exámenes de laboratorio", precio: 180, dura: 15, detalle: "Hemograma y química. Resultados el mismo día." },
] as const;
export type ServicioId = (typeof SERVICIOS)[number]["id"];

/* ¿Es urgencia? Guía de qué hacer, no un diagnóstico. */
export type Nivel = "rojo" | "ambar" | "verde";
export const SINTOMAS: { id: string; texto: string; nivel: Nivel }[] = [
  { id: "respira", texto: "Le cuesta respirar o tiene las encías moradas o blancas", nivel: "rojo" },
  { id: "veneno", texto: "Comió veneno, chocolate, uvas, medicina de personas o algo tóxico", nivel: "rojo" },
  { id: "atropello", texto: "Lo atropellaron, se cayó de alto o sangra mucho", nivel: "rojo" },
  { id: "convulsion", texto: "Convulsiona, se desmayó o no se puede parar", nivel: "rojo" },
  { id: "parto", texto: "Está pariendo y lleva más de 1 hora pujando sin que salga un cachorro", nivel: "rojo" },
  { id: "vomito", texto: "Vomita o tiene diarrea varias veces hoy", nivel: "ambar" },
  { id: "come", texto: "No quiere comer ni tomar agua desde ayer", nivel: "ambar" },
  { id: "cojea", texto: "Cojea o se queja al tocarlo", nivel: "ambar" },
  { id: "orina", texto: "Se esfuerza para orinar y no le sale (sobre todo gatos)", nivel: "rojo" },
  { id: "rasca", texto: "Se rasca mucho, tiene pulgas o se le cae el pelo", nivel: "verde" },
  { id: "oreja", texto: "Le huelen las orejas o mueve mucho la cabeza", nivel: "verde" },
  { id: "control", texto: "Le toca vacuna, desparasitación o un chequeo", nivel: "verde" },
];

export const QUE_HACER: Record<Nivel, { titulo: string; texto: string; accion: string }> = {
  rojo: {
    titulo: "Tráelo ya y llámanos en camino",
    texto: "Esto no puede esperar. Llámanos mientras vienes para tenerlo todo listo. No le des medicinas de personas.",
    accion: "Llamar a la clínica",
  },
  ambar: {
    titulo: "Tráelo hoy",
    texto: "No es para correr, pero sí para hoy. Aparta el primer horario libre. Si empeora, ven sin cita.",
    accion: "Apartar para hoy",
  },
  verde: {
    titulo: "Puede esperar a una cita normal",
    texto: "Aparta el día que mejor te quede. Si notas algo nuevo, vuelve a revisar esta lista.",
    accion: "Apartar cita",
  },
};

export const HORAS = ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

/* La mascota de ejemplo para "Mi mascota" */
export const TOBY = {
  nombre: "Toby",
  especie: "perro" as Especie,
  raza: "Mestizo, tamaño mediano",
  nace: "2021-03-14",
  sexo: "Macho, esterilizado",
  dueno: "Andrea López",
  tel: "5544 1290",
  pesos: [
    { mes: "jun", kg: 17.8 },
    { mes: "jul", kg: 18.4 },
    { mes: "ago", kg: 19.1 },
    { mes: "sep", kg: 19.6 },
    { mes: "oct", kg: 20.3 },
    { mes: "nov", kg: 20.9 },
  ],
  pesoIdeal: [17, 20] as [number, number],
  vacunas: [
    { nombre: "Rabia", puesta: "2025-11-20", cada: 12 },
    { nombre: "Séxtuple (moquillo, parvovirus y otras)", puesta: "2025-12-04", cada: 12 },
    { nombre: "Tos de las perreras", puesta: "2026-05-10", cada: 12 },
  ],
  desparasitacion: { puesta: "2026-08-25", cada: 3 },
};

/* Resultados de laboratorio de Toby, explicados para el dueño */
export const EXAMEN = {
  nombre: "Química sanguínea",
  fecha: "17 de noviembre de 2026",
  doctor: "Dr. Rodrigo Pérez",
  nota: "Todo sale bien menos el azúcar, que está un poco alta. Puede ser por nervios del día del examen. Lo repetimos en 3 meses y mientras, menos premios y más paseos.",
  valores: [
    { nombre: "Azúcar (glucosa)", valor: 128, unidad: "mg/dL", min: 70, max: 120, explica: "Un poco alta. Puede subir por nervios o premios." },
    { nombre: "Riñones (creatinina)", valor: 1.1, unidad: "mg/dL", min: 0.5, max: 1.5, explica: "Normal. Sus riñones trabajan bien." },
    { nombre: "Hígado (ALT)", valor: 48, unidad: "U/L", min: 10, max: 100, explica: "Normal." },
    { nombre: "Glóbulos rojos", valor: 6.8, unidad: "millones/µL", min: 5.5, max: 8.5, explica: "Normal. No tiene anemia." },
  ],
};

/* Internados: la clínica manda noticias y el dueño las ve */
export type Nota = { hora: string; texto: string; estado: "estable" | "mejor" | "atento" };
export type Internado = { id: string; nombre: string; especie: Especie; dueno: string; tel: string; motivo: string; desde: string; notas: Nota[] };

export const INTERNADOS_INICIAL: Internado[] = [
  {
    id: "luna",
    nombre: "Luna",
    especie: "gato",
    dueno: "Andrea López",
    tel: "5544 1290",
    motivo: "Le están poniendo suero por deshidratación",
    desde: "ayer 18:40",
    notas: [
      { hora: "Ayer 19:10", texto: "Llegó deshidratada. Le pusimos suero y está tranquila.", estado: "atento" },
      { hora: "Hoy 07:30", texto: "Pasó buena noche. Ya tomó un poco de agua sola.", estado: "mejor" },
    ],
  },
  {
    id: "max",
    nombre: "Max",
    especie: "perro",
    dueno: "Sofía Ramírez",
    tel: "3390 1245",
    motivo: "Recuperándose de una esterilización",
    desde: "hoy 09:00",
    notas: [{ hora: "Hoy 11:15", texto: "La cirugía salió bien. Está despertando de la anestesia.", estado: "estable" }],
  },
];

/* Agenda del día en la clínica */
export type Cita = { id: string; hora: string; mascota: string; especie: Especie; dueno: string; servicio: string; estado: "espera" | "llego" | "atendido" };
export const AGENDA_INICIAL: Cita[] = [
  { id: "c1", hora: "08:30", mascota: "Rocky", especie: "perro", dueno: "José Ajú", servicio: "Vacunas", estado: "atendido" },
  { id: "c2", hora: "09:30", mascota: "Michi", especie: "gato", dueno: "Paola Sierra", servicio: "Consulta general", estado: "llego" },
  { id: "c3", hora: "10:30", mascota: "Canela", especie: "perro", dueno: "Lucía Barrios", servicio: "Baño y corte", estado: "espera" },
  { id: "c4", hora: "11:30", mascota: "Bruno", especie: "perro", dueno: "Mario Chen", servicio: "Exámenes de laboratorio", estado: "espera" },
  { id: "c5", hora: "14:30", mascota: "Nala", especie: "gato", dueno: "Gaby Morales", servicio: "Desparasitación", estado: "espera" },
];

/* Vacunas que vencen o ya vencieron (para mandar recordatorios) */
export type Pendiente = { id: string; mascota: string; especie: Especie; dueno: string; tel: string; vacuna: string; vence: string; dias: number };
export const PENDIENTES_INICIAL: Pendiente[] = [
  { id: "p1", mascota: "Toby", especie: "perro", dueno: "Andrea López", tel: "5544 1290", vacuna: "Rabia", vence: "20 nov", dias: 1 },
  { id: "p2", mascota: "Kira", especie: "perro", dueno: "Daniel Pérez", tel: "4478 3321", vacuna: "Séxtuple", vence: "12 nov", dias: -7 },
  { id: "p3", mascota: "Simba", especie: "gato", dueno: "Ana Lucía Cruz", tel: "5021 9087", vacuna: "Triple felina", vence: "25 nov", dias: 6 },
  { id: "p4", mascota: "Lola", especie: "perro", dueno: "Fernando Ruiz", tel: "3211 6754", vacuna: "Rabia", vence: "3 nov", dias: -16 },
];

export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;

/** Fecha en "20 de noviembre de 2026" */
export function fechaLarga(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-GT", { day: "numeric", month: "long", year: "numeric" });
}
/** Suma meses a una fecha ISO y devuelve ISO */
export function sumarMeses(iso: string, meses: number) {
  const d = new Date(iso + "T12:00:00");
  d.setMonth(d.getMonth() + meses);
  return d.toISOString().slice(0, 10);
}
/** Días desde hoy hasta la fecha (negativo = ya pasó) */
export function diasHasta(iso: string) {
  const hoy = new Date();
  hoy.setHours(12, 0, 0, 0);
  return Math.round((new Date(iso + "T12:00:00").getTime() - hoy.getTime()) / 86_400_000);
}
export function edad(iso: string) {
  const n = new Date(iso + "T12:00:00");
  const h = new Date();
  let a = h.getFullYear() - n.getFullYear();
  if (h.getMonth() < n.getMonth() || (h.getMonth() === n.getMonth() && h.getDate() < n.getDate())) a--;
  return `${a} años`;
}

export const TIENDA = [
  { id: "c15", nombre: "Croquetas perro adulto", detalle: "Bolsa de 15 kg", precio: 520, para: "perro" },
  { id: "c8", nombre: "Croquetas cachorro", detalle: "Bolsa de 8 kg", precio: 340, para: "perro" },
  { id: "g7", nombre: "Croquetas gato adulto", detalle: "Bolsa de 7.5 kg", precio: 385, para: "gato" },
  { id: "ar", nombre: "Arena para gato", detalle: "Saco de 10 kg", precio: 95, para: "gato" },
  { id: "pi", nombre: "Pipeta antipulgas", detalle: "Según el peso", precio: 120, para: "ambos" },
  { id: "pr", nombre: "Premios dentales", detalle: "Paquete de 7", precio: 75, para: "perro" },
];
