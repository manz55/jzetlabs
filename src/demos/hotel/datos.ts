/*
 * Posada Casa del Volcán: habitaciones, extras, fechas, cuentas y el mensaje de la solicitud.
 * El dinero se calcula en centavos para que los impuestos siempre cuadren.
 */
import arco from "@/assets/demo-hotel/arco.jpg";
import corredor from "@/assets/demo-hotel/corredor.jpg";
import desayuno from "@/assets/demo-hotel/desayuno.jpg";
import doble from "@/assets/demo-hotel/doble.jpg";
import estandar from "@/assets/demo-hotel/estandar.jpg";
import familiar from "@/assets/demo-hotel/familiar.jpg";
import jardin from "@/assets/demo-hotel/jardin.jpg";
import jardinKing from "@/assets/demo-hotel/jardin-king.jpg";
import junior from "@/assets/demo-hotel/junior.jpg";
import master from "@/assets/demo-hotel/master.jpg";
import portada from "@/assets/demo-hotel/portada.jpg";
import volcan from "@/assets/demo-hotel/volcan.jpg";

export const FOTOS = { arco, corredor, desayuno, jardin, portada, volcan };

export const HOTEL = "Posada Casa del Volcán";
export const CHECK_IN = "15:00";
export const CHECK_OUT = "12:00";
export const CANCELACION = "Cancelación sin costo hasta 72 horas antes de su llegada. Después de ese plazo se cobra la primera noche.";
export const MAPA = "https://www.google.com/maps/search/?api=1&query=Parque+Central+Antigua+Guatemala";

export const MAX_HUESPEDES = 5;
export const MAX_NOCHES = 30;
const MAX_ANTICIPACION = 540;

/* ───────── habitaciones y extras ───────── */

export type Categoria = "habitaciones" | "suites";

export type Habitacion = {
  id: string;
  nombre: string;
  categoria: Categoria;
  tarifa: number;
  personas: number;
  metros: number;
  cama: string;
  resumen: string;
  amenidades: string[];
  foto: string;
  alt: string;
};

export const HABITACIONES: Habitacion[] = [
  {
    id: "estandar-patio",
    nombre: "Habitación Estándar Patio",
    categoria: "habitaciones",
    tarifa: 495,
    personas: 2,
    metros: 20,
    cama: "1 cama matrimonial",
    resumen: "Tranquila y fresca, con salida al patio de la casa.",
    amenidades: ["Baño privado con agua caliente", "Escritorio", "Caja de seguridad"],
    foto: estandar,
    alt: "Habitación con cama de pilares de madera, cómoda antigua y lámpara encendida",
  },
  {
    id: "colonial-doble",
    nombre: "Habitación Colonial Doble",
    categoria: "habitaciones",
    tarifa: 620,
    personas: 3,
    metros: 26,
    cama: "2 camas semimatrimoniales",
    resumen: "Cabeceras de madera torneada y espacio para viajar acompañado.",
    amenidades: ["Baño privado con agua caliente", "Ropero amplio", "Televisor"],
    foto: doble,
    alt: "Dos camas con cabeceras de madera torneada y colchas grises",
  },
  {
    id: "jardin-king",
    nombre: "Habitación Jardín King",
    categoria: "habitaciones",
    tarifa: 690,
    personas: 2,
    metros: 28,
    cama: "1 cama king",
    resumen: "Un ventanal completo hacia las plantas del jardín interior.",
    amenidades: ["Vista al jardín", "Cafetera en la habitación", "Caja de seguridad"],
    foto: jardinKing,
    alt: "Cama king junto a un ventanal con plantas tropicales",
  },
  {
    id: "junior-suite-agua",
    nombre: "Junior Suite Vista Agua",
    categoria: "suites",
    tarifa: 890,
    personas: 3,
    metros: 36,
    cama: "1 cama king y 1 sofá",
    resumen: "Luz de la mañana, sala de descanso y ventanas hacia el Volcán de Agua.",
    amenidades: ["Orientada al Volcán de Agua", "Sala de descanso", "Batas de baño"],
    foto: junior,
    alt: "Suite luminosa con zócalo de madera, sofá claro y dos ventanas altas",
  },
  {
    id: "suite-familiar",
    nombre: "Suite Familiar del Corredor",
    categoria: "suites",
    tarifa: 1150,
    personas: 5,
    metros: 52,
    cama: "1 cama king y 2 camas auxiliares",
    resumen: "Dormitorio y sala en un mismo ambiente, pensado para la familia.",
    amenidades: ["Sala con sofá cama", "Frigobar", "Televisor"],
    foto: familiar,
    alt: "Suite amplia con cama king, sofá verde y mesa de madera",
  },
  {
    id: "master-terraza",
    nombre: "Master Suite con Terraza Privada",
    categoria: "suites",
    tarifa: 1450,
    personas: 2,
    metros: 48,
    cama: "1 cama king",
    resumen: "La más reservada de la casa, con sala propia y terraza solo para usted.",
    amenidades: ["Terraza privada", "Sala independiente", "Batas y frigobar"],
    foto: master,
    alt: "Sala de la suite con sillones y puertas de vidrio hacia la terraza",
  },
];

export type ExtraId = "traslado" | "cena" | "tour";
export type Extra = { id: ExtraId; nombre: string; precio: number; detalle: string };

export const EXTRAS: Extra[] = [
  { id: "traslado", nombre: "Traslado desde Aeropuerto La Aurora", precio: 280, detalle: "Un trayecto, del aeropuerto a la posada. Un cobro por reserva." },
  { id: "cena", nombre: "Cena romántica en el jardín", precio: 450, detalle: "Para dos personas, con mesa reservada en el jardín." },
  { id: "tour", nombre: "Tour cafetalero", precio: 320, detalle: "Visita a una finca de café en los alrededores de Antigua. Un cobro por reserva." },
];

export const habitacion = (id: string | null) => HABITACIONES.find((h) => h.id === id) ?? null;

/* ───────── fechas (siempre "aaaa-mm-dd", sin horas ni zonas) ───────── */

export type Estancia = { llegada: string; salida: string; huespedes: number };

const DIA = 86_400_000;
const aTiempo = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  return Date.UTC(a, m - 1, d);
};
const aTexto = (t: number) => new Date(t).toISOString().slice(0, 10);

export const sumarDias = (iso: string, n: number) => aTexto(aTiempo(iso) + n * DIA);
export const noches = (e: Pick<Estancia, "llegada" | "salida">) => Math.round((aTiempo(e.salida) - aTiempo(e.llegada)) / DIA);
export const esFecha = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && aTexto(aTiempo(v)) === v;

/* el día de hoy según el reloj de quien visita */
export function hoy() {
  const d = new Date();
  return aTexto(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}
export const ultimaLlegada = () => sumarDias(hoy(), MAX_ANTICIPACION);

/* del próximo viernes al domingo */
export function estanciaInicial(): Estancia {
  const base = hoy();
  const dia = new Date(aTiempo(base)).getUTCDay();
  const llegada = sumarDias(base, ((5 - dia + 6) % 7) + 1);
  return { llegada, salida: sumarDias(llegada, 2), huespedes: 2 };
}

/* al mover la llegada, la salida queda siempre después y dentro del máximo */
export function conLlegada(e: Estancia, llegada: string): Estancia {
  const salida = e.salida > llegada && e.salida <= sumarDias(llegada, MAX_NOCHES) ? e.salida : sumarDias(llegada, 1);
  return { ...e, llegada, salida };
}

const CORTA = new Intl.DateTimeFormat("es-GT", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const LARGA = new Intl.DateTimeFormat("es-GT", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
export const fechaCorta = (iso: string) => CORTA.format(aTiempo(iso)).replace(/[.,]/g, "");
const BREVE = new Intl.DateTimeFormat("es-GT", { day: "numeric", month: "short", timeZone: "UTC" });
export const fechaBreve = (iso: string) => BREVE.format(aTiempo(iso)).replace(/[.,]/g, "");
export const fechaLarga = (iso: string) => LARGA.format(aTiempo(iso));

export const textoNoches = (n: number) => `${n} ${n === 1 ? "noche" : "noches"}`;
export const textoHuespedes = (n: number) => `${n} ${n === 1 ? "huésped" : "huéspedes"}`;

/* ───────── cuentas ───────── */

const DOS = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
/* de centavos a "Q1,780.00" */
export const dinero = (centavos: number) => `Q${DOS.format(centavos / 100)}`;
/* tarifas cerradas: "Q1,150" */
export const tarifa = (quetzales: number) => `Q${quetzales.toLocaleString("en-US")}`;

/* INGUAT (10%) solo sobre el hospedaje; IVA (12%) sobre todo; ninguno sobre el otro */
export function cuenta(e: Estancia, h: Habitacion | null, elegidos: ExtraId[]) {
  const n = noches(e);
  const hospedaje = h ? h.tarifa * n * 100 : 0;
  const extras = EXTRAS.filter((x) => elegidos.includes(x.id));
  const subtotal = hospedaje + extras.reduce((s, x) => s + x.precio * 100, 0);
  const inguat = Math.round(hospedaje * 0.1);
  const iva = Math.round(subtotal * 0.12);
  return { noches: n, hospedaje, extras, subtotal, inguat, iva, total: subtotal + inguat + iva };
}

/* ───────── solicitud ───────── */

export type Datos = { nombre: string; telefono: string; hora: string };
export const DATOS_VACIOS: Datos = { nombre: "", telefono: "", hora: "" };

export const HORAS = ["Antes de las 15:00 (dejar equipaje)", "Entre 15:00 y 17:00", "Entre 17:00 y 19:00", "Entre 19:00 y 22:00", "Después de las 22:00"];

export function revisar(d: Datos) {
  const errores: Partial<Record<keyof Datos, string>> = {};
  if (d.nombre.trim().length < 3) errores.nombre = "Escriba su nombre y apellido.";
  const cifras = d.telefono.replace(/\D/g, "");
  if (cifras.length < 8 || cifras.length > 15) errores.telefono = "Escriba un número de 8 dígitos, o con código de país.";
  if (!d.hora) errores.hora = "Elija a qué hora piensa llegar.";
  return errores;
}

export function mensajeSolicitud(e: Estancia, h: Habitacion, elegidos: ExtraId[], d: Datos) {
  const c = cuenta(e, h, elegidos);
  return [
    `*Solicitud de reserva · ${HOTEL}*`,
    "",
    `Nombre: ${d.nombre.trim()}`,
    `Teléfono: ${d.telefono.trim()}`,
    `Hora estimada de llegada: ${d.hora}`,
    "",
    `Llegada: ${fechaLarga(e.llegada)} (check-in ${CHECK_IN})`,
    `Salida: ${fechaLarga(e.salida)} (check-out ${CHECK_OUT})`,
    `${textoNoches(c.noches)} · ${textoHuespedes(e.huespedes)}`,
    `Habitación: ${h.nombre} (${tarifa(h.tarifa)} por noche)`,
    "",
    `Hospedaje: ${dinero(c.hospedaje)}`,
    ...c.extras.map((x) => `${x.nombre}: ${dinero(x.precio * 100)}`),
    `Subtotal: ${dinero(c.subtotal)}`,
    `INGUAT 10%: ${dinero(c.inguat)}`,
    `IVA 12%: ${dinero(c.iva)}`,
    `*Total: ${dinero(c.total)}*`,
    "",
    "¿Me confirman disponibilidad? Gracias.",
  ].join("\n");
}

/* sin número fijo: WhatsApp se abre con el mensaje listo y la persona elige el chat */
export const whatsapp = (texto: string) => `https://wa.me/?text=${encodeURIComponent(texto)}`;
