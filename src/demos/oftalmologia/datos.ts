/*
 * Datos de ejemplo de "Clínica Visual Lumen" (negocio inventado).
 * Sale de lo que se vio en clínicas oftalmológicas reales de Mixco, Villa Nueva y zona 10:
 *  - citas que no se respetan y colas de horas (la queja más repetida en las reseñas),
 *  - especialidades como retina y cirugía que nadie encuentra en Google,
 *  - varias sucursales con un solo teléfono y horarios distintos,
 *  - reseñas malas sin una respuesta del negocio.
 */

export const NOCHE = "#0b2545";
export const AZUL = "#13315c";
export const IRIS = "#1b9aaa";
export const CORAL = "#ef6f5e";
export const HIELO = "#eaf4f6";
export const BLANCO = "#fbfdfe";
export const AMBAR = "#d98e04";
export const VERDE = "#2e8b57";
export const ROJO = "#c0392b";
export const TITULO = "'Fraunces', Georgia, serif";

export type SedeId = "z10" | "mixco" | "vn";

export const SEDES: {
  id: SedeId;
  nombre: string;
  dir: string;
  ref: string;
  tel: string;
  horario: [string, string][];
  extras: string[];
  mapa: string;
}[] = [
  {
    id: "z10",
    nombre: "Zona 10",
    dir: "6a avenida 12-30, zona 10",
    ref: "Edificio de clínicas, 2.º nivel, clínica 204",
    tel: "2380 4410",
    horario: [["Lunes a viernes", "8:00 a 17:00"], ["Sábado", "8:00 a 12:00"]],
    extras: ["Ascensor y rampa para silla de ruedas", "Parqueo en el edificio", "Cirugías y estudios de retina"],
    mapa: "6a+avenida+12-30+zona+10+Guatemala",
  },
  {
    id: "mixco",
    nombre: "Mixco",
    dir: "Calzada San Juan 14-00, local 8, zona 4 de Mixco",
    ref: "Centro comercial, primer nivel",
    tel: "2430 7715",
    horario: [["Lunes a sábado", "9:00 a 19:00"], ["Domingo", "9:00 a 17:00"]],
    extras: ["Óptica con más de 200 aros", "Parqueo del centro comercial", "Examen de la vista el mismo día"],
    mapa: "Calzada+San+Juan+zona+4+Mixco+Guatemala",
  },
  {
    id: "vn",
    nombre: "Villa Nueva",
    dir: "Km 15 Carretera al Pacífico, local 6, Villa Nueva",
    ref: "Frente a la gasolinera, plaza comercial",
    tel: "6632 1904",
    horario: [["Lunes a viernes", "9:00 a 18:00"], ["Sábado", "9:00 a 14:00"]],
    extras: ["Rampa de acceso", "Examen de la vista y lentes", "Consulta con retina los jueves"],
    mapa: "Km+15+Carretera+al+Pacifico+Villa+Nueva+Guatemala",
  },
];

export const SERVICIOS = [
  { id: "examen", nombre: "Examen de la vista completo", precio: 350, dura: 30, detalle: "Graduación, presión del ojo y revisión del fondo de ojo." },
  { id: "retina", nombre: "Retina y mácula", precio: 600, dura: 45, detalle: "Con estudio OCT. Para diabéticos y para quien ve manchas o luces." },
  { id: "catarata", nombre: "Cataratas", precio: 450, dura: 30, detalle: "Valoración y fecha de cirugía. Sin cita, no hay lista de espera escondida." },
  { id: "glaucoma", nombre: "Glaucoma", precio: 450, dura: 30, detalle: "Presión del ojo y campo visual, con control cada 3 a 6 meses." },
  { id: "ninos", nombre: "Vista de niños", precio: 300, dura: 30, detalle: "Para niños desde los 3 años. Con juegos para que no se asusten." },
  { id: "contacto", nombre: "Lentes de contacto", precio: 400, dura: 30, detalle: "Medida, prueba y enseñanza para ponérselos y quitárselos." },
] as const;
export type ServicioId = (typeof SERVICIOS)[number]["id"];

export const SEGUROS = ["Seguros médicos privados (consulte el suyo)", "Tarjeta de crédito o débito", "Lentes hasta en 6 cuotas"];

export const HORAS = ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"];
export const OCUPADAS = ["09:00", "10:00", "11:00", "14:30"];

export const DOCTORES = [
  { inicial: "M", nombre: "Dra. Lucía Mejía", titulo: "Oftalmóloga · Cataratas y cirugía", texto: "14 años operando cataratas. Explica cada paso antes de empezar." },
  { inicial: "R", nombre: "Dr. Andrés Rivas", titulo: "Oftalmólogo · Retina y mácula", texto: "Atiende a pacientes diabéticos y hace el seguimiento con estudios al día." },
  { inicial: "C", nombre: "Lic. Paola Castillo", titulo: "Optometrista · Niños y lentes de contacto", texto: "Gradúa a los más chiquitos con calma y paciencia." },
];

export const ARO = [
  { id: "a1", nombre: "Redondo clásico", forma: "redondo", color: "#8a5a2b", precio: 450 },
  { id: "a2", nombre: "Cuadrado liviano", forma: "cuadrado", color: "#1f2a44", precio: 520 },
  { id: "a3", nombre: "Aviador fino", forma: "aviador", color: "#b8962e", precio: 590 },
  { id: "a4", nombre: "Gatuno", forma: "gatuno", color: "#9b2d3f", precio: 560 },
  { id: "a5", nombre: "Rectangular", forma: "rectangular", color: "#2d3436", precio: 480 },
  { id: "a6", nombre: "Pantos", forma: "panto", color: "#3a6b5c", precio: 540 },
] as const;
export type Forma = (typeof ARO)[number]["forma"];

export const OPTOTIPOS = [
  { letras: "E", tam: 3.4, ojo: "20/200" },
  { letras: "F P", tam: 2.4, ojo: "20/100" },
  { letras: "T O Z", tam: 1.7, ojo: "20/50" },
  { letras: "L P E D", tam: 1.2, ojo: "20/30" },
  { letras: "P E C F D", tam: 0.9, ojo: "20/20" },
];

export const RESENAS = [
  { nombre: "Carolina M.", sede: "Mixco", estrellas: 5, texto: "Me atendieron a la hora de mi cita y me explicaron todo con calma. Salí con mis lentes el mismo día." },
  { nombre: "Edgar S.", sede: "Zona 10", estrellas: 5, texto: "Me dieron fecha para la cirugía de cataratas de mi papá y me avisaron por WhatsApp el día anterior. Todo salió como dijeron." },
  { nombre: "Mariela T.", sede: "Villa Nueva", estrellas: 5, texto: "Mi hija de 5 años no quería abrir los ojos y la licenciada se tomó el tiempo de jugar con ella." },
];
export const QUEJA = {
  nombre: "Roberto G.",
  sede: "Zona 10",
  estrellas: 3,
  texto: "Esperé 40 minutos aunque tenía cita a las 10:00.",
  respuesta: "Tiene razón, Roberto, y le pedimos disculpas. Ese día la doctora tuvo una emergencia y no le avisamos a tiempo. Desde entonces, si hay retraso, le escribimos por WhatsApp antes de que salga de su casa. Le dejamos una consulta de control sin costo.",
};
export const DISTRIBUCION = [
  { e: 5, n: 118 },
  { e: 4, n: 21 },
  { e: 3, n: 5 },
  { e: 2, n: 1 },
  { e: 1, n: 1 },
];

/* Recepción: la sala de espera del día */
export type Estado = "cita" | "espera" | "consulta" | "listo";
export type Paciente = { id: string; hora: string; nombre: string; servicio: string; doctor: string; estado: Estado; nota?: string };
export const PACIENTES_INICIAL: Paciente[] = [
  { id: "p1", hora: "08:30", nombre: "Gloria Pineda", servicio: "Examen de la vista", doctor: "Lic. Castillo", estado: "listo" },
  { id: "p2", hora: "09:00", nombre: "Julio Cifuentes", servicio: "Retina y mácula", doctor: "Dr. Rivas", estado: "consulta", nota: "Diabético, trae estudios" },
  { id: "p3", hora: "09:30", nombre: "Ana Lucía Herrera", servicio: "Cataratas", doctor: "Dra. Mejía", estado: "espera" },
  { id: "p4", hora: "10:00", nombre: "Roberto Girón", servicio: "Examen de la vista", doctor: "Lic. Castillo", estado: "espera" },
  { id: "p5", hora: "10:30", nombre: "Nicolás Ajú (7 años)", servicio: "Vista de niños", doctor: "Lic. Castillo", estado: "cita", nota: "Primera vez" },
  { id: "p6", hora: "11:00", nombre: "Carmen de León", servicio: "Glaucoma", doctor: "Dra. Mejía", estado: "cita", nota: "Control de 6 meses" },
];
export const POR_RESPONDER = [
  { id: "r1", nombre: "Roberto G.", estrellas: 3, texto: "Esperé 40 minutos aunque tenía cita a las 10:00.", respuesta: QUEJA.respuesta },
  { id: "r2", nombre: "Silvia P.", estrellas: 4, texto: "Todo bien, pero me costó encontrar el parqueo.", respuesta: "Gracias, Silvia. Ya agregamos en la página cómo llegar y dónde queda el parqueo de cada sede." },
];

