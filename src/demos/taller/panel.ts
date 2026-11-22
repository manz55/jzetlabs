/* Datos de ejemplo del panel CRM de Taller Torque */
import type { Automatizacion, Cliente, Conversacion, Evento, Persona, Plantilla, ResenaPanel, Tarjeta, Tema } from "../panelcrm";
import { ACERO, AMARILLO, AMBAR, ASFALTO, ORDENES_INICIAL, ROJO, TITULO } from "./datos";

export const TEMA: Tema = {
  fondo: "#eef0f2",
  menu: ASFALTO,
  tinta: ASFALTO,
  acento: AMARILLO,
  sobreAcento: ASFALTO,
  suave: ACERO,
  borde: "rgba(21,23,28,.16)",
  titulo: TITULO,
  bueno: "#1f7a46",
  malo: ROJO,
  medio: AMBAR,
  radio: "8px",
};

export const AVISOS = [
  "Honda Civic P 482KLM: el cliente aún no aprueba el presupuesto.",
  "Solicitud de auxilio sin contestar en Mixco zona 1.",
  "3 clientes con el cambio de aceite vencido.",
];

/* Las órdenes del día, como tarjetas del tablero */
export const TARJETAS: Tarjeta[] = [
  ...ORDENES_INICIAL.map((o) => ({ id: o.id, titulo: `${o.modelo} · ${o.placa}`, sub: `${o.cliente} · ${o.trabajo}`, etapa: o.paso, monto: o.monto, extra: { modelo: o.modelo, placa: o.placa, cliente: o.cliente, trabajo: o.trabajo } })),
  { id: "o5", titulo: "Toyota Corolla · P 330DFR", sub: "Pedro Velásquez · Diagnóstico de luz de motor", etapa: 0, extra: { modelo: "Toyota Corolla", placa: "P 330DFR", cliente: "Pedro Velásquez", trabajo: "Diagnóstico de luz de motor" }, etiqueta: "Nuevo" },
];

export const CARROS: Cliente[] = [
  { id: "k1", nombre: "Andrea López", tel: "5544 1290", etiqueta: "Frecuente", ultima: "Hoy", proxima: "Aceite en 5,000 km", total: 2420, datos: [["Placa", "P 482KLM"], ["Carro", "Honda Civic 2016"], ["Kilometraje", "84,200 km"], ["Garantía", "Batería hasta enero"]], historial: [{ fecha: "Hoy", texto: "Frenos delanteros y cambio de aceite. Total Q1,180." }, { fecha: "12 de junio", texto: "Alineación y balanceo." }, { fecha: "3 de abril", texto: "Cambio de aceite y filtro." }, { fecha: "20 de enero", texto: "Batería nueva con garantía de 12 meses." }] },
  { id: "k2", nombre: "José Ajú", tel: "3390 1245", etiqueta: "Frecuente", ultima: "Hoy", proxima: "Revisión en 3 meses", total: 5800, datos: [["Placa", "P 117TZR"], ["Carro", "Toyota Hilux 2019"], ["Kilometraje", "61,800 km"], ["Uso", "Trabajo en carretera"]], historial: [{ fecha: "Hoy", texto: "Suspensión delantera (en reparación)." }, { fecha: "Septiembre", texto: "Cambio de llantas y alineación." }] },
  { id: "k3", nombre: "Sofía Ramírez", tel: "4120 8855", etiqueta: "Nuevo", ultima: "Hoy", proxima: "Entrega en 5 días", total: 0, datos: [["Placa", "C 904BNW"], ["Carro", "Nissan Sentra 2014"], ["Trabajo", "Puerta golpeada"], ["Cotización", "Por foto, Q2,400"]], historial: [{ fecha: "Hoy", texto: "Llegó por una foto que mandó por WhatsApp. Enderezado y pintura de puerta." }] },
  { id: "k4", nombre: "Mario Castillo", tel: "5032 7710", etiqueta: "Aceite vencido", ultima: "Hace 7 meses", proxima: "Vencido", total: 740, datos: [["Placa", "P 650HDS"], ["Carro", "Kia Rio 2018"], ["Último aceite", "Hace 7 meses"], ["Próximo", "Hace 2 meses"]], historial: [{ fecha: "Hoy", texto: "Cambio de aceite. Listo para entregar." }, { fecha: "Hace 7 meses", texto: "Cambio de aceite y filtro de aire." }] },
  { id: "k5", nombre: "Pedro Velásquez", tel: "5598 4410", etiqueta: "Aceite vencido", ultima: "Hace 8 meses", proxima: "Vencido", total: 1350, datos: [["Placa", "P 330DFR"], ["Carro", "Toyota Corolla 2015"], ["Motivo hoy", "Luz de motor encendida"], ["Último aceite", "Hace 8 meses"]], historial: [{ fecha: "Hoy", texto: "Llegó con la luz amarilla del motor." }, { fecha: "Hace 8 meses", texto: "Frenos traseros." }] },
  { id: "k6", nombre: "Elena Soto", tel: "4455 0912", etiqueta: "Frecuente", ultima: "Hace 5 meses", proxima: "Alineación pendiente", total: 1900, datos: [["Placa", "P 721LKD"], ["Carro", "Mazda 3 2017"], ["Pendiente", "Alineación y balanceo"], ["Preferencia", "Escribir por WhatsApp"]], historial: [{ fecha: "Hace 5 meses", texto: "Cambio de aceite y pastillas." }] },
];

export const AGENDA: Evento[] = [
  { id: "g1", hora: "07:30", titulo: "Honda Civic", sub: "Frenos", quien: "Luis (mecánica)", estado: "en curso" },
  { id: "g2", hora: "09:00", titulo: "Toyota Hilux", sub: "Suspensión", quien: "Luis (mecánica)", estado: "en curso" },
  { id: "g3", hora: "08:00", titulo: "Nissan Sentra", sub: "Pintura de puerta", quien: "Memo (pintura)", estado: "en curso" },
  { id: "g4", hora: "10:00", titulo: "Kia Rio", sub: "Aceite", quien: "Óscar (rápidos)", estado: "atendida" },
  { id: "g5", hora: "11:00", titulo: "Toyota Corolla", sub: "Diagnóstico", quien: "Óscar (rápidos)", estado: "confirmada" },
  { id: "g6", hora: "14:00", titulo: "Mazda 3", sub: "Alineación", quien: "Óscar (rápidos)", estado: "pendiente" },
  { id: "g7", hora: "14:00", titulo: "Auxilio · zona 1", sub: "Batería", quien: "Domicilio", estado: "pendiente" },
];

export const CONVERSACIONES: Conversacion[] = [
  { id: "m1", nombre: "Karla Orozco", hora: "10:05", sinLeer: true, mensajes: [{ de: "cliente", texto: "Se me descompuso el carro en la 3a avenida zona 1 de Mixco. No arranca." }] },
  { id: "m2", nombre: "Luis Herrera", hora: "09:20", sinLeer: true, mensajes: [{ de: "cliente", texto: "Buenas, ¿cuánto cuesta cambiar pastillas de un Corolla 2014?" }] },
  { id: "m3", nombre: "Andrea López", hora: "Ayer", mensajes: [{ de: "negocio", texto: "Hola, Andrea. El trabajo de frenos cuesta Q1,180. ¿Nos autoriza?" }, { de: "cliente", texto: "Sí, adelante. Gracias." }] },
];
export const PLANTILLAS: Plantilla[] = [
  { id: "p1", nombre: "Presupuesto", texto: "Hola. Revisamos su carro. El trabajo cuesta Q___ e incluye repuestos y mano de obra. ¿Nos autoriza? Responda SÍ y empezamos." },
  { id: "p2", nombre: "Ya está listo", texto: "Hola. Su carro está listo. Le esperamos hasta las 6:00 de la tarde. Le devolvemos las piezas cambiadas." },
  { id: "p3", nombre: "Auxilio en camino", texto: "Hola. Ya salimos hacia usted. Llegamos en unos 25 minutos. Si puede, deje el carro con las luces de emergencia." },
  { id: "p4", nombre: "Precio de frenos", texto: "Hola. Cambiar pastillas de freno cuesta entre Q350 y Q900 según el carro. Si manda una foto del disco y el año del carro, le damos el precio exacto." },
];
export const AUTOMATICOS: Automatizacion[] = [
  { id: "a1", nombre: "Aviso en cada paso", detalle: "Recibido, presupuesto, en reparación y listo.", activa: true },
  { id: "a2", nombre: "Aceite cada 5,000 km", detalle: "Recuerda el cambio a quien ya le toca.", activa: true },
  { id: "a3", nombre: "Garantía por vencer", detalle: "Avisa un mes antes de que termine.", activa: false },
  { id: "a4", nombre: "Pedir reseña", detalle: "Al entregar, con el link de Google.", activa: true },
];

export const RESENAS_PANEL: ResenaPanel[] = [
  { id: "r1", nombre: "Hugo B.", estrellas: 3, texto: "Buen trabajo, pero me entregaron el carro un día después de lo prometido.", fecha: "Hace 3 días", sugerida: "Tiene razón, Hugo, y le pedimos disculpas: llegaron repuestos tarde y no le avisamos. Ahora le escribimos apenas cambia la fecha. Su próximo cambio de aceite va por nuestra cuenta." },
  { id: "r2", nombre: "Karla O.", estrellas: 5, texto: "Se me descompuso a las 10 de la noche en Mixco y llegaron en media hora.", fecha: "Hace 1 mes", respondida: true },
  { id: "r3", nombre: "Rodrigo M.", estrellas: 5, texto: "Me enderezaron y pintaron la puerta y no se nota dónde estuvo el golpe.", fecha: "Hace 2 meses", respondida: true },
];

export const EQUIPO: Persona[] = [
  { nombre: "Luis Pérez", rol: "Mecánica general y suspensión", carga: 95, detalle: "2 órdenes grandes hoy. Libre hasta las 2 de la tarde." },
  { nombre: "Óscar Méndez", rol: "Servicios rápidos", carga: 65, detalle: "Aceite, alineación y diagnósticos." },
  { nombre: "Memo Girón", rol: "Enderezado y pintura", carga: 80, detalle: "1 puerta en cabina. Entrega en 5 días." },
  { nombre: "Chepe (domicilio)", rol: "Auxilio 24 horas", carga: 30, detalle: "Turno de noche. 1 solicitud pendiente." },
];

export const INGRESOS_SEMANA = [
  { t: "Lun", v: 4200 },
  { t: "Mar", v: 5100 },
  { t: "Mié", v: 3900 },
  { t: "Jue", v: 6200 },
  { t: "Vie", v: 7100 },
  { t: "Sáb", v: 5600 },
];
export const SERVICIOS_TOP = [
  { t: "Cambio de aceite", v: 52 },
  { t: "Frenos", v: 31 },
  { t: "Alineación y balanceo", v: 27 },
  { t: "Suspensión", v: 18 },
  { t: "Enderezado y pintura", v: 10 },
];
export const ORIGEN = [
  { t: "Recomendación", v: 46 },
  { t: "Google Maps", v: 38 },
  { t: "Auxilio a domicilio", v: 31 },
  { t: "Instagram y Facebook", v: 23 },
];
