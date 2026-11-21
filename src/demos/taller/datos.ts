/*
 * Datos de ejemplo de "Taller Torque" (negocio inventado).
 * Sale de lo que se vio en talleres reales de Mixco y Villa Nueva:
 *  - el cliente no sabe si es seguro seguir manejando,
 *  - cotizar siempre es "venga y vemos", y nadie da un rango por WhatsApp,
 *  - el servicio a domicilio 24 horas existe pero nadie sabe hasta dónde llega,
 *  - el trabajo de enderezado y pintura es lo más vendedor y vive escondido en Instagram,
 *  - la ficha de Google está incompleta y las reseñas son de hace años.
 */

export const ASFALTO = "#15171c";
export const AMARILLO = "#ffc21a";
export const ACERO = "#e9ecef";
export const GRIS = "#5b6470";
export const ROJO = "#d63b2f";
export const VERDE = "#2f9e5a";
export const AMBAR = "#d98e04";
export const BLANCO = "#fafafa";
export const TITULO = "'Barlow Condensed', 'Libre Franklin', system-ui, sans-serif";

export const SERVICIOS = [
  { id: "aceite", nombre: "Cambio de aceite y filtro", desde: 180, hasta: 320, tiempo: "40 min", detalle: "Aceite según el motor, filtro nuevo y revisión de niveles." },
  { id: "frenos", nombre: "Frenos", desde: 350, hasta: 900, tiempo: "2 a 3 horas", detalle: "Pastillas, discos o tambores. Le enseñamos la pieza gastada." },
  { id: "suspension", nombre: "Suspensión y dirección", desde: 400, hasta: 1800, tiempo: "Medio día", detalle: "Amortiguadores, rótulas, terminales y bujes." },
  { id: "alineacion", nombre: "Alineación y balanceo", desde: 150, hasta: 250, tiempo: "1 hora", detalle: "Para que el carro no se jale y las llantas duren más." },
  { id: "electro", nombre: "Electromecánica", desde: 200, hasta: 1200, tiempo: "Según el caso", detalle: "Batería, alternador, arranque y luces del tablero." },
  { id: "diagnostico", nombre: "Diagnóstico con escáner", desde: 150, hasta: 150, tiempo: "30 min", detalle: "Se descuenta si hace la reparación con nosotros." },
  { id: "pintura", nombre: "Enderezado y pintura", desde: 600, hasta: 6500, tiempo: "2 a 7 días", detalle: "Desde un rayón hasta un golpe fuerte. Con cotización por foto." },
  { id: "detallado", nombre: "Detallado completo", desde: 250, hasta: 450, tiempo: "Medio día", detalle: "Interior y exterior, pulido y encerado." },
] as const;
export type ServicioId = (typeof SERVICIOS)[number]["id"];

/* ¿Puedo seguir manejando? Guía, no un diagnóstico. */
export type Nivel = "rojo" | "ambar" | "verde";
export const SINTOMAS: { id: string; texto: string; nivel: Nivel }[] = [
  { id: "freno", texto: "El pedal del freno se va al fondo o el carro no frena como antes", nivel: "rojo" },
  { id: "temp", texto: "La temperatura está en rojo o sale humo o vapor del motor", nivel: "rojo" },
  { id: "aceite", texto: "Se encendió la luz roja del aceite", nivel: "rojo" },
  { id: "gasolina", texto: "Huele a gasolina dentro o debajo del carro", nivel: "rojo" },
  { id: "ruido", texto: "Hace ruido o rechina al frenar", nivel: "ambar" },
  { id: "vibra", texto: "Vibra el volante o el carro se jala a un lado", nivel: "ambar" },
  { id: "motor", texto: "Se encendió la luz amarilla del motor (check engine)", nivel: "ambar" },
  { id: "arranca", texto: "Le cuesta arrancar o la batería se descarga", nivel: "ambar" },
  { id: "toca", texto: "Ya le toca cambio de aceite o revisión de 5,000 km", nivel: "verde" },
  { id: "viaje", texto: "Quiere revisarlo antes de un viaje", nivel: "verde" },
  { id: "aire", texto: "El aire acondicionado no enfría bien", nivel: "verde" },
];
export const QUE_HACER: Record<Nivel, { titulo: string; texto: string; accion: string }> = {
  rojo: {
    titulo: "No lo maneje: pida auxilio",
    texto: "Seguir manejando puede dañar el motor o ser peligroso. Si puede, apáguelo en un lugar seguro y llámenos: vamos a donde esté.",
    accion: "Pedir auxilio a domicilio",
  },
  ambar: {
    titulo: "Puede llegar al taller, con cuidado",
    texto: "Maneje despacio y evite carretera. Venga hoy o mañana: mientras más pronto, más barato sale.",
    accion: "Pedir cotización",
  },
  verde: {
    titulo: "Puede esperar a una cita normal",
    texto: "Escoja el día que le quede mejor. Si nota algo nuevo, vuelva a revisar esta lista.",
    accion: "Agendar mi cita",
  },
};

export const MODELOS = ["Toyota Corolla", "Honda Civic", "Nissan Sentra", "Hyundai Accent", "Kia Rio", "Mazda 3", "Suzuki Swift", "Toyota Hilux", "Otro"];

/* Servicio a domicilio, por zona */
export const ZONAS = [
  { id: "mixco-1", nombre: "Mixco, zonas 1 a 5", min: "20 a 30 min", visita: 0 },
  { id: "sancristobal", nombre: "San Cristóbal y El Naranjo", min: "25 a 40 min", visita: 50 },
  { id: "z7", nombre: "Ciudad de Guatemala, zonas 7 y 11", min: "30 a 45 min", visita: 50 },
  { id: "vn", nombre: "Villa Nueva", min: "40 a 60 min", visita: 75 },
  { id: "otra", nombre: "Otra zona", min: "Le confirmamos por WhatsApp", visita: 100 },
];

/* El carro de ejemplo para el seguimiento */
export const PASOS = ["Recibido", "Diagnóstico", "Esperando su visto bueno", "En reparación", "Listo para entregar"];
export const CARRO = {
  placa: "P 482KLM",
  modelo: "Honda Civic 2016",
  dueno: "Andrea López",
  trabajo: "Frenos delanteros y cambio de aceite",
  paso: 3,
  total: 1180,
  entrega: "Hoy a las 4:30 de la tarde",
  historial: [
    { fecha: "12 de junio", trabajo: "Alineación y balanceo", monto: 200 },
    { fecha: "3 de abril", trabajo: "Cambio de aceite y filtro", monto: 260 },
    { fecha: "20 de enero", trabajo: "Batería nueva (garantía 12 meses)", monto: 780 },
  ],
  proximo: "Cambio de aceite: a los 5,000 km o el 3 de diciembre",
};

export const RESENAS = [
  { nombre: "Luis H.", texto: "Me dijeron el precio antes de tocar el carro y me devolvieron las pastillas viejas. Así da gusto.", fecha: "hace 2 semanas" },
  { nombre: "Karla O.", texto: "Se me descompuso a las 10 de la noche en Mixco y llegaron en media hora. Me explicaron qué tenía.", fecha: "hace 1 mes" },
  { nombre: "Rodrigo M.", texto: "Me enderezaron y pintaron la puerta y no se nota dónde estuvo el golpe.", fecha: "hace 2 meses" },
];
export const DISTRIBUCION = [
  { e: 5, n: 64 },
  { e: 4, n: 11 },
  { e: 3, n: 2 },
  { e: 2, n: 1 },
  { e: 1, n: 0 },
];

/* Panel del taller: órdenes del día */
export type Orden = { id: string; placa: string; modelo: string; cliente: string; trabajo: string; paso: number; monto: number };
export const ORDENES_INICIAL: Orden[] = [
  { id: "o1", placa: "P 482KLM", modelo: "Honda Civic 2016", cliente: "Andrea López", trabajo: "Frenos delanteros y aceite", paso: 3, monto: 1180 },
  { id: "o2", placa: "P 117TZR", modelo: "Toyota Hilux 2019", cliente: "José Ajú", trabajo: "Suspensión delantera", paso: 2, monto: 1650 },
  { id: "o3", placa: "C 904BNW", modelo: "Nissan Sentra 2014", cliente: "Sofía Ramírez", trabajo: "Enderezado y pintura de puerta", paso: 1, monto: 2400 },
  { id: "o4", placa: "P 650HDS", modelo: "Kia Rio 2018", cliente: "Mario Castillo", trabajo: "Cambio de aceite", paso: 4, monto: 240 },
];
export const RECORDATORIOS = [
  { id: "m1", cliente: "Pedro Velásquez", modelo: "Toyota Corolla 2015", texto: "Su cambio de aceite venció hace 2 semanas." },
  { id: "m2", cliente: "Elena Soto", modelo: "Mazda 3 2017", texto: "Le toca la alineación y balanceo." },
  { id: "m3", cliente: "Víctor Mejía", modelo: "Suzuki Swift 2020", texto: "Su revisión de 20,000 km es la semana que viene." },
];
