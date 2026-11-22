/* Datos de ejemplo del panel CRM de Clínica Visual Lumen */
import type { Automatizacion, Cliente, Conversacion, Persona, Plantilla, ResenaPanel, Tarjeta, Tema } from "../panelcrm";
import { HIELO, NOCHE } from "./datos";

export const TEMA: Tema = {
  fondo: "#f3f7f9",
  menu: NOCHE,
  tinta: NOCHE,
  acento: "#0f7f8c",
  sobreAcento: "#ffffff",
  suave: HIELO,
  borde: "rgba(11,37,69,.14)",
  titulo: "'Fraunces', Georgia, serif",
  bueno: "#1f7a46",
  malo: "#c0392b",
  medio: "#d98e04",
  radio: "14px",
};

export const AVISOS = [
  "Julio Cifuentes lleva 25 minutos en consulta de retina.",
  "Una reseña de 3 estrellas espera respuesta.",
  "Carmen de León no ha confirmado su cita de las 11:00.",
];

export const PACIENTES: Cliente[] = [
  { id: "c1", nombre: "Julio Cifuentes", tel: "5544 3021", etiqueta: "Retina", ultima: "Hoy", proxima: "En 3 meses", total: 2400, datos: [["Sucursal", "Zona 10"], ["Doctor", "Dr. Rivas"], ["Seguro", "Seguro médico"], ["Diabetes", "Sí, tipo 2"]], historial: [{ fecha: "Hoy", texto: "Control de mácula con estudio OCT." }, { fecha: "Agosto", texto: "Inyección en el ojo izquierdo. Sin complicaciones." }, { fecha: "Mayo", texto: "Primera consulta de retina, enviado por su internista." }] },
  { id: "c2", nombre: "Ana Lucía Herrera", tel: "4120 8855", etiqueta: "Cataratas", ultima: "Hoy", proxima: "Cirugía 3 dic", total: 450, datos: [["Sucursal", "Zona 10"], ["Doctor", "Dra. Mejía"], ["Seguro", "Particular"], ["Ojo", "Derecho"]], historial: [{ fecha: "Hoy", texto: "Valoración. Se programó la cirugía del ojo derecho." }, { fecha: "Octubre", texto: "Examen de la vista: catarata madura." }] },
  { id: "c3", nombre: "Roberto Girón", tel: "5032 7710", etiqueta: "Lentes", ultima: "Hoy", proxima: "En 1 año", total: 1150, datos: [["Sucursal", "Zona 10"], ["Doctor", "Lic. Castillo"], ["Seguro", "Particular"], ["Graduación", "OD -1.50 · OI -1.75"]], historial: [{ fecha: "Hoy", texto: "Examen de la vista. Aros apartados." }, { fecha: "Hace 1 año", texto: "Lentes progresivos. Se quejó de 40 minutos de espera." }] },
  { id: "c4", nombre: "Nicolás Ajú (7 años)", tel: "5544 1290", etiqueta: "Niños", ultima: "Primera vez", proxima: "Hoy 10:30", total: 0, datos: [["Sucursal", "Mixco"], ["Doctor", "Lic. Castillo"], ["Responsable", "Andrea López"], ["Motivo", "Se acerca al libro"]], historial: [{ fecha: "Hoy", texto: "Primera cita. Se le pidió traer la libreta de la escuela." }] },
  { id: "c5", nombre: "Carmen de León", tel: "3390 1245", etiqueta: "Glaucoma", ultima: "Hace 6 meses", proxima: "Hoy 11:00", total: 1800, datos: [["Sucursal", "Zona 10"], ["Doctor", "Dra. Mejía"], ["Seguro", "Seguro médico"], ["Presión", "18 mmHg"]], historial: [{ fecha: "Hace 6 meses", texto: "Presión del ojo y campo visual. Gotas sin cambios." }, { fecha: "Hace 1 año", texto: "Diagnóstico de glaucoma inicial." }] },
  { id: "c6", nombre: "Gloria Pineda", tel: "5598 4410", etiqueta: "Lentes", ultima: "Hoy", proxima: "Aros en 5 días", total: 980, datos: [["Sucursal", "Mixco"], ["Doctor", "Lic. Castillo"], ["Seguro", "Particular"], ["Aros", "Gatuno vino"]], historial: [{ fecha: "Hoy", texto: "Examen y aros. Pagó la mitad." }] },
  { id: "c7", nombre: "Edgar Samayoa", tel: "4455 0912", etiqueta: "Cataratas", ultima: "Hace 2 semanas", proxima: "Control mañana", total: 5200, datos: [["Sucursal", "Zona 10"], ["Doctor", "Dra. Mejía"], ["Seguro", "Particular"], ["Ojo", "Ambos"]], historial: [{ fecha: "Hace 2 semanas", texto: "Cirugía de cataratas del ojo izquierdo. Todo salió bien." }, { fecha: "Hace 1 mes", texto: "Cirugía del ojo derecho." }] },
];

export const TARJETAS: Tarjeta[] = [
  { id: "t1", titulo: "Mariela Torres", sub: "Pide examen de la vista", etapa: 0, etiqueta: "WhatsApp" },
  { id: "t2", titulo: "Hugo Barrios", sub: "Pregunta por cataratas", etapa: 0, etiqueta: "Google" },
  { id: "t3", titulo: "Carmen de León", sub: "Glaucoma · 11:00", etapa: 1, monto: 450 },
  { id: "t4", titulo: "Nicolás Ajú", sub: "Vista de niños · 10:30", etapa: 1, monto: 300 },
  { id: "t5", titulo: "Ana Lucía Herrera", sub: "Cataratas · en sala", etapa: 2, monto: 450 },
  { id: "t6", titulo: "Julio Cifuentes", sub: "Retina · en consulta", etapa: 2, monto: 600 },
  { id: "t7", titulo: "Gloria Pineda", sub: "Atendida · aros en 5 días", etapa: 3, monto: 980 },
  { id: "t8", titulo: "Edgar Samayoa", sub: "Control después de la cirugía", etapa: 4 },
];

export const CONVERSACIONES: Conversacion[] = [
  { id: "m1", nombre: "Mariela Torres", hora: "10:12", sinLeer: true, mensajes: [{ de: "cliente", texto: "Buenos días, ¿tienen espacio para un examen de la vista esta semana?" }] },
  { id: "m2", nombre: "Hugo Barrios", hora: "09:40", sinLeer: true, mensajes: [{ de: "cliente", texto: "¿Cuánto cuesta la cirugía de cataratas y aceptan seguro?" }] },
  { id: "m3", nombre: "Edgar Samayoa", hora: "Ayer", mensajes: [{ de: "negocio", texto: "Hola, Edgar. Mañana le toca su control. ¿Nos confirma que viene a las 9:00?" }, { de: "cliente", texto: "Sí, ahí estoy. Gracias." }] },
];
export const PLANTILLAS: Plantilla[] = [
  { id: "p1", nombre: "Confirmar cita", texto: "Hola. Le confirmamos su cita en Clínica Visual Lumen. Llegue 10 minutos antes y traiga su receta anterior. Si no puede venir, avísenos para darle otra hora." },
  { id: "p2", nombre: "Precios", texto: "Hola. El examen de la vista completo cuesta Q350 y dura unos 30 minutos. La cirugía de cataratas se define después de la valoración (Q450). Aceptamos seguros médicos: ¿cuál tiene?" },
  { id: "p3", nombre: "Retraso", texto: "Hola. Hoy llevamos unos minutos de retraso. Su nueva hora aproximada es en 15 minutos. Gracias por su paciencia." },
  { id: "p4", nombre: "Lentes listos", texto: "Hola. Sus lentes ya están listos. Puede pasar a recogerlos en nuestro horario de atención." },
];
export const AUTOMATICOS: Automatizacion[] = [
  { id: "a1", nombre: "Confirmar 24 horas antes", detalle: "Pide al paciente que confirme o cambie su hora.", activa: true },
  { id: "a2", nombre: "Aviso si hay retraso", detalle: "Escribe a los que siguen apenas hay más de 10 minutos.", activa: true },
  { id: "a3", nombre: "Lentes listos", detalle: "Avisa cuando llegan sus aros con los lentes.", activa: true },
  { id: "a4", nombre: "Control cada 6 meses", detalle: "Para glaucoma y pacientes diabéticos.", activa: false },
  { id: "a5", nombre: "Pedir reseña", detalle: "Un día después de la visita, con el link de Google.", activa: true },
];

export const RESENAS_PANEL: ResenaPanel[] = [
  { id: "r1", nombre: "Roberto G.", estrellas: 3, texto: "Esperé 40 minutos aunque tenía cita a las 10:00.", fecha: "Hace 2 días", sugerida: "Tiene razón, Roberto, y le pedimos disculpas. Ese día la doctora tuvo una emergencia y no le avisamos a tiempo. Desde entonces, si hay retraso, le escribimos por WhatsApp antes de que salga de su casa. Le dejamos una consulta de control sin costo." },
  { id: "r2", nombre: "Silvia P.", estrellas: 4, texto: "Todo bien, pero me costó encontrar el parqueo.", fecha: "Hace 5 días", sugerida: "Gracias, Silvia. Ya agregamos en la página cómo llegar y dónde queda el parqueo de cada sucursal." },
  { id: "r3", nombre: "Carolina M.", estrellas: 5, texto: "Me atendieron a la hora de mi cita y me explicaron todo con calma.", fecha: "Hace 1 semana", respondida: true },
];

export const EQUIPO: Persona[] = [
  { nombre: "Dra. Lucía Mejía", rol: "Oftalmóloga · Cataratas", carga: 90, detalle: "5 citas hoy. 1 cirugía el jueves." },
  { nombre: "Dr. Andrés Rivas", rol: "Oftalmólogo · Retina", carga: 70, detalle: "4 citas hoy. Los jueves atiende en Villa Nueva." },
  { nombre: "Lic. Paola Castillo", rol: "Optometrista", carga: 60, detalle: "6 citas hoy. Niños y lentes de contacto." },
  { nombre: "Marta Solís", rol: "Recepción · Zona 10", carga: 45, detalle: "Contesta WhatsApp y confirma citas." },
];

export const PACIENTES_MES = [
  { t: "Sem 1", v: 96 },
  { t: "Sem 2", v: 104 },
  { t: "Sem 3", v: 112 },
  { t: "Sem 4", v: 100 },
];
export const SERVICIOS_TOP = [
  { t: "Examen de la vista", v: 168 },
  { t: "Lentes de contacto", v: 74 },
  { t: "Retina y mácula", v: 61 },
  { t: "Cataratas", v: 48 },
  { t: "Vista de niños", v: 39 },
];
export const POR_SEDE = [
  { t: "Zona 10", v: 188 },
  { t: "Mixco", v: 142 },
  { t: "Villa Nueva", v: 82 },
];
