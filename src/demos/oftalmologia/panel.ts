/* Datos de ejemplo del panel de Clínica Visual Lumen (recepción, cirugías y óptica) */

export const NOCHE = "#0b2545";
export const TURQ = "#0f7f8c";
export const CORAL = "#d9503f";
export const HIELO = "#eaf4f6";
export const PAPEL = "#f6fafb";
export const OK = "#1f7a46";
export const AVISO = "#b97800";

export type EstadoTurno = "cita" | "espera" | "consulta" | "listo";
export type Turno = { id: string; num: number; hora: string; nombre: string; servicio: string; doctor: string; estado: EstadoTurno; llego?: string; etiquetas: string[] };
export const TURNOS_INICIAL: Turno[] = [
  { id: "t1", num: 1, hora: "08:30", nombre: "Gloria Pineda", servicio: "Examen de la vista", doctor: "Lic. Castillo", estado: "listo", etiquetas: [] },
  { id: "t2", num: 2, hora: "09:00", nombre: "Julio Cifuentes", servicio: "Retina y mácula", doctor: "Dr. Rivas", estado: "consulta", llego: "08:52", etiquetas: ["Diabético", "Trae estudios"] },
  { id: "t3", num: 3, hora: "09:30", nombre: "Ana Lucía Herrera", servicio: "Cataratas", doctor: "Dra. Mejía", estado: "espera", llego: "09:20", etiquetas: ["Seguro médico"] },
  { id: "t4", num: 4, hora: "10:00", nombre: "Roberto Girón", servicio: "Examen de la vista", doctor: "Lic. Castillo", estado: "espera", llego: "09:48", etiquetas: ["Se quejó de la espera"] },
  { id: "t5", num: 5, hora: "10:30", nombre: "Nicolás Ajú (7 años)", servicio: "Vista de niños", doctor: "Lic. Castillo", estado: "cita", etiquetas: ["Primera vez", "Con su mamá"] },
  { id: "t6", num: 6, hora: "11:00", nombre: "Carmen de León", servicio: "Glaucoma", doctor: "Dra. Mejía", estado: "cita", etiquetas: ["Sin confirmar"] },
];

export type Ficha = {
  id: string; nombre: string; tel: string; edad: number; seguro: string; diabetes: boolean;
  od: string; oi: string; pio: string; ultima: string; proxima: string; nota: string;
  historial: { fecha: string; texto: string }[];
};
export const FICHAS_INICIAL: Ficha[] = [
  { id: "f1", nombre: "Julio Cifuentes", tel: "5544 3021", edad: 61, seguro: "Seguro médico", diabetes: true, od: "+1.25 -0.75 x 90", oi: "+1.50 -0.50 x 85", pio: "15 / 16", ultima: "Hoy", proxima: "En 3 meses", nota: "Retinopatía leve. Control de mácula con OCT.", historial: [{ fecha: "Hoy", texto: "Control de mácula con estudio OCT." }, { fecha: "Agosto", texto: "Inyección en el ojo izquierdo. Sin complicaciones." }, { fecha: "Mayo", texto: "Primera consulta, lo envió su internista." }] },
  { id: "f2", nombre: "Ana Lucía Herrera", tel: "4120 8855", edad: 68, seguro: "Particular", diabetes: false, od: "+2.00 -1.00 x 100", oi: "+1.75 -0.75 x 80", pio: "14 / 14", ultima: "Hoy", proxima: "Cirugía 3 dic", nota: "Catarata madura en el ojo derecho.", historial: [{ fecha: "Hoy", texto: "Valoración. Se programó la cirugía del ojo derecho." }, { fecha: "Octubre", texto: "Examen de la vista: catarata madura." }] },
  { id: "f3", nombre: "Roberto Girón", tel: "5032 7710", edad: 52, seguro: "Particular", diabetes: false, od: "-1.50 -0.25 x 175", oi: "-1.75 -0.50 x 5", pio: "13 / 13", ultima: "Hoy", proxima: "En 1 año", nota: "Lentes progresivos. La vez pasada esperó 40 minutos.", historial: [{ fecha: "Hoy", texto: "Examen de la vista. Aros apartados." }, { fecha: "Hace 1 año", texto: "Lentes progresivos." }] },
  { id: "f4", nombre: "Nicolás Ajú (7 años)", tel: "5544 1290", edad: 7, seguro: "Particular", diabetes: false, od: "Pendiente", oi: "Pendiente", pio: "—", ultima: "Primera vez", proxima: "Hoy 10:30", nota: "Se acerca mucho al libro. Traer la libreta de la escuela.", historial: [{ fecha: "Hoy", texto: "Primera cita." }] },
  { id: "f5", nombre: "Carmen de León", tel: "3390 1245", edad: 64, seguro: "Seguro médico", diabetes: false, od: "+0.75", oi: "+1.00 -0.25 x 95", pio: "19 / 18", ultima: "Hace 6 meses", proxima: "Hoy 11:00", nota: "Glaucoma inicial. Gotas sin cambios.", historial: [{ fecha: "Hace 6 meses", texto: "Presión del ojo y campo visual." }, { fecha: "Hace 1 año", texto: "Diagnóstico de glaucoma inicial." }] },
];

export const REQUISITOS = ["Consentimiento firmado", "Estudios al día", "Ayuno indicado", "Viene acompañado", "Anticipo pagado"] as const;
export type Cirugia = { id: string; fecha: string; hora: string; paciente: string; procedimiento: string; doctor: string; listo: boolean[]; total: number };
export const CIRUGIAS_INICIAL: Cirugia[] = [
  { id: "c1", fecha: "Mar 25 nov", hora: "08:00", paciente: "Edgar Samayoa", procedimiento: "Catarata, ojo derecho", doctor: "Dra. Mejía", listo: [true, true, true, true, true], total: 4800 },
  { id: "c2", fecha: "Jue 27 nov", hora: "09:30", paciente: "Rosa Elvira Tzul", procedimiento: "Catarata, ojo izquierdo", doctor: "Dra. Mejía", listo: [true, true, false, true, false], total: 4800 },
  { id: "c3", fecha: "Mié 3 dic", hora: "08:00", paciente: "Ana Lucía Herrera", procedimiento: "Catarata, ojo derecho", doctor: "Dra. Mejía", listo: [false, true, false, false, false], total: 4800 },
  { id: "c4", fecha: "Vie 5 dic", hora: "10:00", paciente: "Héctor Cifuentes", procedimiento: "Inyección en el ojo", doctor: "Dr. Rivas", listo: [true, false, true, true, true], total: 2200 },
];

export const ETAPAS_LENTES = ["Pedido", "En laboratorio", "Listos", "Entregados"] as const;
export type Lentes = { id: string; paciente: string; aro: string; mica: string; total: number; abono: number; etapa: number; prometido: string };
export const LENTES_INICIAL: Lentes[] = [
  { id: "l1", paciente: "Gloria Pineda", aro: "Gatuno vino", mica: "Antirreflejo", total: 980, abono: 490, etapa: 0, prometido: "Mar 25 nov" },
  { id: "l2", paciente: "Roberto Girón", aro: "Rectangular negro", mica: "Progresivo", total: 1850, abono: 900, etapa: 1, prometido: "Lun 24 nov" },
  { id: "l3", paciente: "Mariela Torres", aro: "Redondo café", mica: "Filtro de luz azul", total: 720, abono: 720, etapa: 2, prometido: "Hoy" },
  { id: "l4", paciente: "Hugo Barrios", aro: "Aviador fino", mica: "Fotocromático", total: 1240, abono: 600, etapa: 2, prometido: "Hoy" },
  { id: "l5", paciente: "Silvia Paz", aro: "Panto verde", mica: "Sencilla", total: 640, abono: 640, etapa: 3, prometido: "Ayer" },
];
export const AROS = ["Redondo clásico", "Cuadrado liviano", "Aviador fino", "Gatuno", "Rectangular", "Panto"];
export const MICAS: [string, number][] = [["Sencilla", 150], ["Antirreflejo", 280], ["Filtro de luz azul", 320], ["Fotocromático", 520], ["Progresivo", 1100]];
export const PRECIO_ARO: Record<string, number> = { "Redondo clásico": 450, "Cuadrado liviano": 520, "Aviador fino": 590, "Gatuno": 560, "Rectangular": 480, "Panto": 540 };

export const RESENAS_PANEL = [
  { id: "r1", nombre: "Roberto G.", estrellas: 3, texto: "Esperé 40 minutos aunque tenía cita a las 10:00.", fecha: "Hace 2 días", sugerida: "Tiene razón, Roberto, y le pedimos disculpas. Ese día la doctora tuvo una emergencia y no le avisamos a tiempo. Desde entonces, si hay retraso, le escribimos por WhatsApp antes de que salga de su casa. Le dejamos una consulta de control sin costo." },
  { id: "r2", nombre: "Silvia P.", estrellas: 4, texto: "Todo bien, pero me costó encontrar el parqueo.", fecha: "Hace 5 días", sugerida: "Gracias, Silvia. Ya agregamos en la página cómo llegar y dónde queda el parqueo de cada sucursal." },
];

export const SEDES_ESPERA = [
  { t: "Zona 10", v: 14 },
  { t: "Mixco", v: 9 },
  { t: "Villa Nueva", v: 11 },
];
export const SEMANAS = [
  { t: "Sem 1", v: 96 },
  { t: "Sem 2", v: 104 },
  { t: "Sem 3", v: 112 },
  { t: "Sem 4", v: 100 },
];
