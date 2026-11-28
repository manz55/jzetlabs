/*
 * Autotech · Ingeniería Automotriz (taller inventado): servicios, síntomas y las órdenes
 * que comparten las tres vistas. Todo se guarda en este navegador, así el panel del taller
 * y el seguimiento por placa se ven al día, incluso en dos pestañas. Cada día empieza de nuevo.
 */
import { useEffect, useState } from "react";

export const foto = (id: string, ancho: number, alto: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${ancho}&h=${alto}&q=72`;

export const FOTOS = {
  portada: "1771340012319-0b4fca008b54",
  recepcion: "1727893119356-1702fe921cf9",
};

export const SEDES = [
  { nombre: "Taller Zona 9", direccion: "7a avenida, Zona 9, Ciudad de Guatemala", mapa: "https://www.google.com/maps/search/?api=1&query=7a+avenida+zona+9+Ciudad+de+Guatemala" },
  { nombre: "Taller Aguilar Batres", direccion: "Calzada Aguilar Batres, Zona 11, Ciudad de Guatemala", mapa: "https://www.google.com/maps/search/?api=1&query=Calzada+Aguilar+Batres+zona+11+Guatemala" },
];

export const HORARIOS = [
  { dias: "Lunes a viernes", horas: "7:30 – 17:30" },
  { dias: "Sábado", horas: "8:00 – 13:00" },
  { dias: "Domingo", horas: "Cerrado" },
  { dias: "Auxilio vial y grúa", horas: "24 / 7" },
];

/* ───────── fechas y dinero ───────── */

const dos = (n: number) => String(n).padStart(2, "0");
export const aISO = (d: Date) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
export const hoyISO = () => aISO(new Date());
export function masDias(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return aISO(d);
}
export function fechaCorta(iso: string) {
  if (iso === hoyISO()) return "hoy";
  if (iso === masDias(1)) return "mañana";
  return new Date(`${iso}T12:00`).toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" });
}
export const reloj = (ms: number) => {
  const d = new Date(ms);
  return `${dos(d.getHours())}:${dos(d.getMinutes())}`;
};
export const qz = (n: number) => `Q${Math.round(n).toLocaleString("en-US")}`;
export const miles = (n: number) => n.toLocaleString("en-US");

/* Citas cada hora: entre semana de 7:30 a 16:30, sábado de 8:00 a 12:00. Hoy solo lo que falta. */
export function horasDe(fecha: string) {
  if (!fecha || fecha < hoyISO()) return [];
  const dia = new Date(`${fecha}T12:00`).getDay();
  if (dia === 0) return [];
  const [abre, ultima] = dia === 6 ? [8 * 60, 12 * 60] : [7 * 60 + 30, 16 * 60 + 30];
  const ahora = new Date();
  const desde = fecha === hoyISO() ? ahora.getHours() * 60 + ahora.getMinutes() + 60 : 0;
  const horas: string[] = [];
  for (let m = abre; m <= ultima; m += 60) if (m >= desde) horas.push(`${dos(Math.floor(m / 60))}:${dos(m % 60)}`);
  return horas;
}
export const primerDiaConCupo = () => [0, 1, 2, 3].map(masDias).find((f) => horasDe(f).length > 0) ?? masDias(1);

/* ───────── vehículos y servicios ───────── */

export type Tipo = "sedan" | "suv" | "pickup";
export const TIPOS: { id: Tipo; nombre: string }[] = [
  { id: "sedan", nombre: "Sedán" },
  { id: "suv", nombre: "SUV / Camioneta" },
  { id: "pickup", nombre: "Pick-up" },
];
export const tipoDe = (id: Tipo) => TIPOS.find((t) => t.id === id)!;
type Precios = Record<Tipo, number>;
const precios = (sedan: number, suv: number, pickup: number): Precios => ({ sedan, suv, pickup });

export type Categoria = "km" | "frenos" | "electronica" | "aire";
export type Filtro = Categoria | "todos";
export const FILTROS: { id: Filtro; nombre: string }[] = [
  { id: "todos", nombre: "Todos" },
  { id: "km", nombre: "Servicios por Km" },
  { id: "frenos", nombre: "Frenos y Suspensión" },
  { id: "electronica", nombre: "Electrónica y Escáner" },
  { id: "aire", nombre: "Aire Acondicionado" },
];

export type Servicio = { id: string; nombre: string; detalle: string; categoria: Categoria; tiempo: string; precios: Precios; foto: string; alt: string };

export const SERVICIOS: Servicio[] = [
  { id: "km5", nombre: "Servicio de 5,000 km", detalle: "Aceite sintético, filtro y revisión de 20 puntos.", categoria: "km", tiempo: "45 min", precios: precios(395, 485, 545), foto: "1487754180451-c456f719a1fc", alt: "Técnico vertiendo aceite nuevo en el motor" },
  { id: "km20", nombre: "Servicio de 20,000 km", detalle: "Aceite, filtros de aire y cabina, limpieza de frenos y rotación.", categoria: "km", tiempo: "2.5 horas", precios: precios(895, 1075, 1195), foto: "1771340012378-3c86cb649193", alt: "Mecánico revisando un motor con el capó abierto" },
  { id: "km40", nombre: "Servicio mayor de 40,000 km", detalle: "Bujías, fluidos de freno y refrigerante, fajas y escáner completo.", categoria: "km", tiempo: "1 día", precios: precios(1850, 2250, 2550), foto: "1625047509248-ec889cbff17f", alt: "Mecánico de uniforme inspeccionando un motor" },
  { id: "pastillas", nombre: "Pastillas de freno delanteras", detalle: "Pastillas OEM, limpieza de discos y prueba de frenado.", categoria: "frenos", tiempo: "1.5 horas", precios: precios(525, 645, 725), foto: "1696494561430-de087dd0bd69", alt: "Disco y mordaza de freno desmontados para revisión" },
  { id: "alineacion", nombre: "Alineación y balanceo", detalle: "Cuatro ruedas, con reporte de medidas antes y después.", categoria: "frenos", tiempo: "1 hora", precios: precios(225, 275, 325), foto: "1645445522156-9ac06bc7a767", alt: "Manos con guantes montando una llanta" },
  { id: "amortiguadores", nombre: "Amortiguadores delanteros", detalle: "Par de amortiguadores, revisión de bujes y alineación.", categoria: "frenos", tiempo: "4 horas", precios: precios(1450, 1850, 2150), foto: "1764015805414-df7de89d405b", alt: "Técnico desmontando una rueda con herramienta de impacto" },
  { id: "escaner", nombre: "Diagnóstico con escáner", detalle: "Lectura de códigos, datos en vivo e informe por escrito.", categoria: "electronica", tiempo: "40 min", precios: precios(175, 200, 225), foto: "1795165317596-ebadd73937c3", alt: "Escáner de diagnóstico conectado y montado en el timón" },
  { id: "carga", nombre: "Batería, alternador y arranque", detalle: "Prueba de carga, consumo en reposo y bornes.", categoria: "electronica", tiempo: "30 min", precios: precios(125, 150, 175), foto: "1486262715619-67b85e0b08d3", alt: "Poleas y faja del alternador en un motor" },
  { id: "gas", nombre: "Revisión y carga de aire acondicionado", detalle: "Prueba de fugas, vacío del sistema y carga de gas.", categoria: "aire", tiempo: "1 hora", precios: precios(350, 425, 475), foto: "1790714103247-11610c21d248", alt: "Controles de aire acondicionado en el tablero" },
  { id: "evaporador", nombre: "Limpieza de evaporador y filtro", detalle: "Desinfección de ductos y filtro de cabina nuevo.", categoria: "aire", tiempo: "1 hora", precios: precios(295, 345, 375), foto: "1773962375418-9f13f00553e7", alt: "Panel digital de climatización encendido" },
];

/* ───────── ¿Puedo manejar así? (guía de orientación, no reemplaza la revisión) ───────── */

export type Riesgo = "seguro" | "precaucion" | "detener";
export const RIESGOS: Record<Riesgo, string> = {
  seguro: "Seguro circular",
  precaucion: "Precaución — revisar pronto",
  detener: "Detener vehículo de inmediato",
};
export type SintomaId = "check" | "frenos" | "temperatura" | "vibracion" | "arranque";
export type Sintoma = { id: SintomaId; nombre: string; riesgo: Riesgo; resumen: string; causa: string; hacer: string[]; revision: string; precios: Precios; falla?: FallaId };

export const SINTOMAS: Sintoma[] = [
  {
    id: "check",
    nombre: "Luz Check Engine",
    riesgo: "precaucion",
    resumen: "Puede circular con suavidad mientras la luz esté fija.",
    causa: "Sensor de oxígeno, bobina de encendido o una fuga de vacío.",
    hacer: ["Evite acelerones y carga pesada.", "Si la luz parpadea, deténgase y pida auxilio."],
    revision: "Diagnóstico con escáner",
    precios: precios(175, 200, 225),
  },
  {
    id: "frenos",
    nombre: "Chirrido al frenar",
    riesgo: "precaucion",
    resumen: "El freno responde, pero el material está por acabarse.",
    causa: "Pastillas en su límite de desgaste o discos cristalizados.",
    hacer: ["Deje más distancia al frenar.", "Si el pedal se hunde o rechina metal con metal, no lo maneje."],
    revision: "Revisión de frenos",
    precios: precios(150, 175, 200),
  },
  {
    id: "temperatura",
    nombre: "Temperatura alta",
    riesgo: "detener",
    resumen: "Seguir manejando puede dañar el motor.",
    causa: "Fuga de refrigerante, termostato pegado o ventilador sin funcionar.",
    hacer: ["Apague el motor en un lugar seguro.", "No abra el tapón del radiador en caliente."],
    revision: "Revisión del sistema de enfriamiento",
    precios: precios(200, 250, 275),
    falla: "calentamiento",
  },
  {
    id: "vibracion",
    nombre: "Vibración en timón",
    riesgo: "seguro",
    resumen: "Puede circular a velocidad moderada y programar su revisión.",
    causa: "Llantas desbalanceadas o alineación fuera de medida.",
    hacer: ["Revise la presión de las llantas.", "Si vibra al frenar o el carro se jala, pida revisión pronto."],
    revision: "Revisión de balanceo y suspensión",
    precios: precios(125, 150, 175),
  },
  {
    id: "arranque",
    nombre: "No arranca",
    riesgo: "detener",
    resumen: "No insista con la llave: puede dañar el motor de arranque.",
    causa: "Batería descargada, bornes sulfatados, motor de arranque o bomba de combustible.",
    hacer: ["Deje el freno de mano puesto.", "Anote si las luces del tablero encienden."],
    revision: "Revisión de batería y arranque",
    precios: precios(125, 150, 175),
    falla: "bateria",
  },
];

/* todo lo que se puede agendar: catálogo más las revisiones por síntoma */
export const AGENDABLES = [
  ...SERVICIOS.map((s) => ({ id: s.id, nombre: s.nombre, precios: s.precios, grupo: "Servicios" })),
  ...SINTOMAS.map((s) => ({ id: `sintoma-${s.id}`, nombre: s.revision, precios: s.precios, grupo: "Revisiones por síntoma" })),
];
export const agendableDe = (id: string) => AGENDABLES.find((a) => a.id === id) ?? AGENDABLES[0];

/* ───────── auxilio vial ───────── */

export type FallaId = "bateria" | "pinchazo" | "calentamiento" | "grua";
export const FALLAS: { id: FallaId; nombre: string; detalle: string }[] = [
  { id: "bateria", nombre: "Batería muerta", detalle: "Paso de corriente o cambio" },
  { id: "pinchazo", nombre: "Pinchazo", detalle: "Cambio de llanta en el lugar" },
  { id: "calentamiento", nombre: "Calentamiento", detalle: "Revisión antes de moverlo" },
  { id: "grua", nombre: "Necesito grúa", detalle: "Traslado hasta el taller" },
];
export const ZONAS_AUXILIO = [
  "Zona 1",
  "Zona 4",
  "Zona 7",
  "Zona 9",
  "Zona 10",
  "Zona 11",
  "Zona 12",
  "Zona 13",
  "Zona 14",
  "Zona 15",
  "Zona 16",
  "Calzada Aguilar Batres",
  "Calzada Roosevelt",
  "Mixco",
  "Villa Nueva",
  "San Miguel Petapa",
  "Carretera a El Salvador",
  "Ruta al Pacífico",
  "Ruta al Atlántico",
];

export function mensajeAuxilio(falla: FallaId | "", zona: string, referencia: string, punto: string) {
  return [
    "*AUTOTECH · AUXILIO VIAL*",
    `Falla: ${FALLAS.find((f) => f.id === falla)?.nombre ?? "por indicar"}`,
    `Zona: ${zona || "por indicar"}`,
    referencia.trim() ? `Referencia: ${referencia.trim()}` : "",
    punto ? `Mi ubicación: ${punto}` : "",
    "Necesito asistencia, por favor.",
  ]
    .filter(Boolean)
    .join("\n");
}

/* ───────── órdenes de trabajo ───────── */

/* 0 cita agendada · 1 a 5 las etapas del taller · 6 entregado */
export const ETAPAS = ["Recepción e inventario físico", "Escáner y diagnóstico", "Esperando aprobación", "Reparación en bahía", "Prueba en ruta y entrega"];
export const nombreEtapa = (etapa: number) => (etapa === 0 ? "Cita agendada" : etapa === 6 ? "Entregado" : ETAPAS[etapa - 1]);

export const JEFES = ["Mario Cifuentes", "Rudy Alvarado", "Estuardo Paz", "Karla Monzón"];
export const COMBUSTIBLE = ["Reserva", "1/4", "1/2", "3/4", "Lleno"];
export const BAHIAS = ["Elevador 1 · Mecánica", "Elevador 2 · Mecánica", "Elevador 3 · Suspensión", "Bahía 1 · Recepción", "Bahía 2 · Electrónica", "Bancada 3D · Alineación", "Estación A/C y Frenos"];

/* ───────── inspección técnica: falla, mediciones y repuestos ───────── */

export type Semaforo = "optimo" | "precaucion" | "critico";
export const SEMAFORO: Record<Semaforo, string> = { optimo: "Óptimo", precaucion: "Precaución", critico: "Crítico" };
export type TipoNota = Semaforo | "repuesto" | "falla";
export const TIPOS_NOTA: { id: TipoNota; nombre: string; guia: string }[] = [
  { id: "optimo", nombre: "Medición · Óptimo", guia: "Discos traseros: 11.8 mm" },
  { id: "precaucion", nombre: "Medición · Precaución", guia: "Llantas traseras: 3.0 mm" },
  { id: "critico", nombre: "Medición · Crítico", guia: "Faja de accesorios: agrietada" },
  { id: "repuesto", nombre: "Repuesto OEM", guia: "Pieza: número de parte" },
  { id: "falla", nombre: "Código OBD-II o falla", guia: "P0300 o describa la falla" },
];
export type Nota = { id: string; tipo: Semaforo | "repuesto"; nombre: string; valor: string; delHallazgo?: boolean };
export type Falla = { codigo: string; titulo: string; explicacion: string };

/* códigos frecuentes, explicados para el dueño del vehículo */
const CODIGOS: Record<string, Omit<Falla, "codigo">> = {
  P0128: { titulo: "Temperatura del refrigerante bajo lo esperado", explicacion: "El motor tarda en llegar a su temperatura de trabajo, casi siempre por un termostato que no cierra bien." },
  P0171: { titulo: "Sistema demasiado pobre (Banco 1)", explicacion: "El motor está recibiendo más aire o menos gasolina de lo debido. Puede dar tirones, marcha inestable y mayor consumo. Lo usual es una fuga de vacío, un sensor de flujo de aire sucio o baja presión de combustible." },
  P0300: { titulo: "Fallo de encendido en varios cilindros", explicacion: "Uno o más cilindros no queman bien. Conviene revisar bujías, bobinas e inyectores antes de que dañe el catalizador." },
  P0420: { titulo: "Eficiencia del catalizador baja (Banco 1)", explicacion: "El catalizador no está limpiando los gases como debe. Antes de cambiarlo se revisan los sensores de oxígeno y las fugas de escape." },
  P0562: { titulo: "Voltaje del sistema bajo", explicacion: "La computadora detecta poca corriente. Se revisan la batería, el alternador y los bornes." },
};

export function leerFalla(texto: string): Falla {
  const m = texto.trim().match(/^([PBCU][0-3][0-9A-F]{3})(?![0-9A-Z])[\s·:–-]*(.*)$/i);
  if (!m) return { codigo: "", titulo: texto.trim(), explicacion: "" };
  const codigo = m[1].toUpperCase();
  const conocido = CODIGOS[codigo];
  return { codigo, titulo: m[2] || conocido?.titulo || "Código registrado por el taller", explicacion: conocido?.explicacion ?? "" };
}
export const textoFalla = (f: Falla) => [f.codigo, f.titulo].filter(Boolean).join(" · ");

export type Recepcion = { sinGolpes: boolean; herramienta: boolean; combustible: string; km: number | null };
export type Hallazgo = { nombre: string; detalle: string; precio: number; aprobado: boolean };
export type Orden = {
  codigo: string;
  placa: string;
  cliente: string;
  telefono: string;
  vehiculo: string;
  servicio: string;
  costo: number;
  etapa: number;
  jefe: string;
  recepcion: Recepcion;
  hallazgo?: Hallazgo;
  cita?: { fecha: string; hora: string };
  marcas: Record<number, number>;
  bahia: string;
  falla: Falla | null;
  notas: Nota[];
};

export const totalDe = (o: Orden) => o.costo + (o.hallazgo?.aprobado ? o.hallazgo.precio : 0);
export const enTaller = (o: Orden) => o.etapa >= 1 && o.etapa <= 5;

export function normalizarPlaca(texto: string) {
  const m = texto
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .match(/^([PCMA])?(\d{3})([A-Z]{3})$/);
  return m ? `${m[1] ?? "P"}-${m[2]}${m[3]}` : "";
}
/* la orden abierta de esa placa; si ya se entregó, la más reciente */
export const ordenDe = (ordenes: Orden[], placa: string) => ordenes.find((o) => o.placa === placa && o.etapa < 6) ?? ordenes.find((o) => o.placa === placa);

export const enlaceWhatsApp = (texto: string, telefono = "") => {
  const n = telefono.replace(/\D/g, "");
  return `https://wa.me/${n.length === 8 ? `502${n}` : ""}?text=${encodeURIComponent(texto)}`;
};

export function mensajeEstado(o: Orden, enlace: string) {
  const h = o.hallazgo;
  return [
    `*AUTOTECH · Orden ${o.codigo}*`,
    `Hola, ${o.cliente.split(" ")[0]}. Le actualizamos su ${o.vehiculo} (${o.placa}).`,
    "",
    o.etapa === 0 && o.cita ? `Su cita: ${fechaCorta(o.cita.fecha)} a las ${o.cita.hora}.` : `Etapa: ${nombreEtapa(o.etapa)}${o.etapa >= 1 && o.etapa <= 5 ? ` (${o.etapa} de 5)` : ""}.`,
    `Servicio: ${o.servicio}`,
    h && !h.aprobado ? `Hallazgo adicional: ${h.nombre}, ${qz(h.precio)}. Pendiente de su aprobación.` : "",
    h?.aprobado ? `Trabajo adicional aprobado: ${h.nombre}, ${qz(h.precio)}.` : "",
    `Total: ${qz(totalDe(o))}`,
    o.jefe ? `Jefe de bahía: ${o.jefe}` : "",
    "",
    `Siga su orden aquí: ${enlace}`,
  ]
    .filter((l, i, t) => l !== "" || t[i - 1] !== "")
    .join("\n");
}

/* ───────── estado compartido ───────── */

export type Estado = { dia: string; ordenes: Orden[]; siguiente: number };
export type NuevaOrden = { placa: string; cliente: string; telefono: string; vehiculo: string; servicio: string; costo: number; km?: number | null; cita?: Orden["cita"]; falla?: Falla | null };

const SIN_RECIBIR: Recepcion = { sinGolpes: false, herramienta: false, combustible: "", km: null };

/* inspección de las órdenes con las que abre el día */
function inspecciones(): Record<string, { bahia: string; falla: Falla | null; notas: Nota[] }> {
  const nota = (id: string, tipo: Nota["tipo"], nombre: string, valor: string, delHallazgo?: boolean): Nota => ({ id, tipo, nombre, valor, delHallazgo });
  return {
    "P-482JKL": {
      bahia: "Elevador 1 · Mecánica",
      falla: leerFalla("P0171"),
      notas: [
        nota("a1", "critico", "Pastillas traseras", "2.0 mm", true),
        nota("a2", "precaucion", "Batería", "12.1V · 62% vida útil"),
        nota("a3", "optimo", "Discos delanteros", "26.4 mm"),
        nota("a4", "optimo", "Fluido de frenos", "<1% humedad"),
      ],
    },
    "P-915MTR": {
      bahia: "Elevador 3 · Suspensión",
      falla: { codigo: "", titulo: "Fuga en amortiguadores delanteros", explicacion: "Pierden aceite y ya no controlan el rebote: el vehículo frena en más distancia y gasta las llantas." },
      notas: [nota("b1", "critico", "Amortiguadores delanteros", "Con fuga de aceite"), nota("b2", "precaucion", "Bujes de barra estabilizadora", "Con desgaste"), nota("b3", "optimo", "Llantas delanteras", "5.5 mm de grabado")],
    },
    "P-307HDN": { bahia: "Bahía 2 · Electrónica", falla: leerFalla("P0420"), notas: [nota("c1", "optimo", "Voltaje de carga", "14.2V")] },
    "P-761BQF": {
      bahia: "Bancada 3D · Alineación",
      falla: { codigo: "", titulo: "Sin códigos almacenados", explicacion: "El escáner no reporta fallas en los módulos del vehículo." },
      notas: [nota("d1", "optimo", "Pastillas delanteras", "7.5 mm"), nota("d2", "optimo", "Presión de llantas", "33 psi")],
    },
    "P-128FGT": { bahia: "Estación A/C y Frenos", falla: { codigo: "", titulo: "Aire acondicionado enfría poco", explicacion: "Se medirán presiones y se buscarán fugas antes de cargar gas." }, notas: [] },
  };
}

function diaNuevo(): Estado {
  const ahora = Date.now();
  const tecnica = inspecciones();
  /* marcas de hora repartidas hacia atrás, una por cada etapa ya alcanzada */
  const marcas = (etapa: number, hace: number) => Object.fromEntries(Array.from({ length: etapa }, (_, i) => [i + 1, ahora - Math.round((hace * (etapa - i)) / etapa) * 60_000]));
  const orden = (n: number, placa: string, cliente: string, vehiculo: string, servicio: string, costo: number, etapa: number, jefe: string, km: number, combustible: string, hace: number, hallazgo?: Hallazgo): Orden => ({
    codigo: `OT-${n}`,
    placa,
    cliente,
    telefono: "",
    vehiculo,
    servicio,
    costo,
    etapa,
    jefe,
    recepcion: { sinGolpes: true, herramienta: true, combustible, km },
    hallazgo,
    marcas: marcas(etapa, hace),
    ...tecnica[placa],
  });
  return {
    dia: hoyISO(),
    ordenes: [
      orden(2418, "P-482JKL", "Andrea Morales", "Mazda CX-5 2021", "Servicio de 70,000 km", 1450, 3, "Mario Cifuentes", 68420, "1/2", 150, {
        nombre: "Cambio de pastillas traseras",
        detalle: "Quedan 2 mm de material. Recomendamos cambiarlas en esta misma visita.",
        precio: 680,
        aprobado: false,
      }),
      orden(2419, "P-915MTR", "Carlos Ruiz", "Toyota Hilux 2019", "Amortiguadores delanteros", 2150, 4, "Rudy Alvarado", 104310, "3/4", 260),
      orden(2420, "P-307HDN", "Luis Cabrera", "Honda Civic 2018", "Diagnóstico con escáner", 175, 2, "Karla Monzón", 81265, "1/4", 55),
      orden(2417, "P-761BQF", "Sofía Herrera", "Kia Sportage 2022", "Servicio de 20,000 km", 1075, 5, "Estuardo Paz", 20180, "1/2", 310),
      orden(2421, "P-128FGT", "Marta Lemus", "Nissan Frontier 2017", "Revisión y carga de aire acondicionado", 475, 1, "Estuardo Paz", 132900, "1/4", 20),
      {
        codigo: "OT-2422",
        placa: "P-554CVB",
        cliente: "Pedro Velásquez",
        telefono: "",
        vehiculo: "Hyundai Accent 2020",
        servicio: "Alineación y balanceo",
        costo: 225,
        etapa: 0,
        jefe: "",
        recepcion: SIN_RECIBIR,
        cita: { fecha: masDias(1), hora: horasDe(masDias(1))[1] ?? "08:30" },
        marcas: {},
        bahia: "",
        falla: { codigo: "", titulo: "Cliente reporta: el vehículo se jala a un lado", explicacion: "" },
        notas: [],
      },
    ],
    siguiente: 2423,
  };
}

const CLAVE = "autotech-v2";

function leerGuardado(crudo: string | null): Estado | null {
  try {
    const g = JSON.parse(crudo ?? "null") as Estado | null;
    return g && g.dia === hoyISO() && Array.isArray(g.ordenes) ? g : null;
  } catch {
    return null;
  }
}

function leer() {
  try {
    return leerGuardado(localStorage.getItem(CLAVE)) ?? diaNuevo();
  } catch {
    return diaNuevo();
  }
}

export function useAutotech() {
  const [estado, setEstado] = useState<Estado>(leer);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {
      /* sin almacenamiento la demo sigue funcionando en esta pestaña */
    }
  }, [estado]);

  useEffect(() => {
    const otraPestana = (e: StorageEvent) => {
      if (e.key !== CLAVE) return;
      const nuevo = leerGuardado(e.newValue);
      if (nuevo) setEstado(nuevo);
    };
    addEventListener("storage", otraPestana);
    return () => removeEventListener("storage", otraPestana);
  }, []);

  const cambiar = (codigo: string, fn: (o: Orden) => Orden) => setEstado((e) => ({ ...e, ordenes: e.ordenes.map((o) => (o.codigo === codigo ? fn(o) : o)) }));
  const pasar = (o: Orden, etapa: number): Orden => ({ ...o, etapa, marcas: { ...o.marcas, [etapa]: Date.now() } });

  return {
    estado,
    /* crea la orden: con cita queda por recibir; sin cita entra de una vez a recepción */
    crear(d: NuevaOrden) {
      const codigo = `OT-${estado.siguiente}`;
      const etapa = d.cita ? 0 : 1;
      const orden: Orden = {
        codigo,
        placa: d.placa,
        cliente: d.cliente.trim(),
        telefono: d.telefono.trim(),
        vehiculo: d.vehiculo.trim(),
        servicio: d.servicio.trim(),
        costo: d.costo,
        etapa,
        jefe: "",
        recepcion: { ...SIN_RECIBIR, km: d.km ?? null },
        cita: d.cita,
        marcas: etapa ? { 1: Date.now() } : {},
        bahia: "",
        falla: d.falla ?? null,
        notas: [],
      };
      setEstado((e) => ({ ...e, siguiente: e.siguiente + 1, ordenes: [orden, ...e.ordenes] }));
      return orden;
    },
    /* siguiente etapa; en "esperando aprobación" solo se pasa aprobando */
    avanzar: (codigo: string) => cambiar(codigo, (o) => (o.etapa === 3 || o.etapa >= 6 ? o : pasar(o, o.etapa + 1))),
    aprobar: (codigo: string) => cambiar(codigo, (o) => (o.etapa !== 3 ? o : pasar({ ...o, hallazgo: o.hallazgo && { ...o.hallazgo, aprobado: true } }, 4))),
    asignar: (codigo: string, jefe: string) => cambiar(codigo, (o) => ({ ...o, jefe })),
    recibir: (codigo: string, parte: Partial<Recepcion>) => cambiar(codigo, (o) => ({ ...o, recepcion: { ...o.recepcion, ...parte } })),
    ubicar: (codigo: string, bahia: string) => cambiar(codigo, (o) => ({ ...o, bahia })),
    /* anotación del mecánico; "Pieza: valor". Volver a medir la misma pieza actualiza el dato */
    anotar(codigo: string, tipo: TipoNota, texto: string) {
      const limpio = texto.trim();
      if (!limpio) return;
      if (tipo === "falla") {
        cambiar(codigo, (o) => ({ ...o, falla: leerFalla(limpio) }));
        return;
      }
      const corte = limpio.indexOf(":");
      const nombre = (corte > 0 ? limpio.slice(0, corte) : limpio).trim();
      const valor = corte > 0 ? limpio.slice(corte + 1).trim() : "";
      const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      cambiar(codigo, (o) => {
        const igual = (n: Nota) => n.nombre.toLowerCase() === nombre.toLowerCase() && (n.tipo === "repuesto") === (tipo === "repuesto");
        const previa = o.notas.find(igual);
        const nueva: Nota = { id, tipo, nombre, valor, delHallazgo: previa?.delHallazgo };
        return { ...o, notas: previa ? o.notas.map((n) => (n === previa ? nueva : n)) : [...o.notas, nueva] };
      });
    },
    borrarNota: (codigo: string, id: string) => cambiar(codigo, (o) => ({ ...o, notas: o.notas.filter((n) => n.id !== id) })),
  };
}
export type Taller = ReturnType<typeof useAutotech>;
