/*
 * Datos de la tienda (Nexus Mobile GT, negocio inventado) y el estado que comparten
 * las tres vistas: Tienda, Reparaciones y Panel Admin. Se guarda en este navegador,
 * así que lo que se hace en una vista aparece en las otras, aun en otra pestaña.
 */
import { useEffect, useState } from "react";
import { FICHAS, type Ficha } from "./fichas";

/* ---------- formatos ---------- */

export const qz = (n: number) => `Q${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
/* cuotas: sin centavos cuando son exactas, con dos cuando no */
export const qc = (n: number) => {
  const exacta = Math.abs(n - Math.round(n)) < 0.005;
  return `Q${n.toLocaleString("en-US", { minimumFractionDigits: exacta ? 0 : 2, maximumFractionDigits: exacta ? 0 : 2 })}`;
};
export const qd = (n: number) => `Q${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MESES_LARGOS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const dosCifras = (n: number) => String(n).padStart(2, "0");
export const esDeHoy = (t: number) => new Date(t).toDateString() === new Date().toDateString();
export const fechaLarga = (t: number) => {
  const d = new Date(t);
  return `${d.getDate()} de ${MESES_LARGOS[d.getMonth()]} de ${d.getFullYear()}`;
};
export const fechaCorta = (t: number) => {
  const d = new Date(t);
  return `${d.getDate()} ${MESES[d.getMonth()]}, ${dosCifras(d.getHours())}:${dosCifras(d.getMinutes())}`;
};

export const enlaceWhatsApp = (texto: string) => `https://wa.me/?text=${encodeURIComponent(texto)}`;

/* ---------- fotos (Unsplash) ---------- */

export const foto = (id: string, ancho: number, alto?: number) =>
  id.startsWith("data:") ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${ancho}${alto ? `&h=${alto}` : ""}&q=72`;

/* la foto que sube el dueño se achica antes de guardarla */
export function achicarFoto(archivo: Blob): Promise<string> {
  return new Promise((ok, mal) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onerror = () => {
      URL.revokeObjectURL(url);
      mal(new Error("No se pudo leer la imagen"));
    };
    img.onload = () => {
      const k = Math.min(1, 640 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      ok(c.toDataURL("image/jpeg", 0.78));
    };
    img.src = url;
  });
}

export const FOTOS = {
  destacado: "1772986646440-3c3525bd4eff",
  taller: "1639776738932-956082f0b704",
  banco: "1746005514011-ea00280f3b6e",
  mostrador: "1697545806245-9795b6056141",
};

/* ---------- catálogo ---------- */

export type Marca = "Apple" | "Samsung" | "Honor" | "Xiaomi";
export type Capacidad = "128 GB" | "256 GB" | "512 GB";
export const CAPACIDADES: Capacidad[] = ["128 GB", "256 GB", "512 GB"];

export type Producto = {
  id: string;
  nombre: string;
  marca: Marca | null;
  accesorio: boolean;
  detalle: string;
  foto: string;
  /* vacío en accesorios: se venden en una sola presentación */
  capacidades: Capacidad[];
  /* publicado desde el panel */
  nuevo?: boolean;
};

const BASE: Producto[] = [
  { id: "ip16pro", nombre: "iPhone 16 Pro", marca: "Apple", accesorio: false, detalle: "6.3″ · Chip A18 Pro · Cámara 48 MP", foto: "1726587912121-ea21fcc57ff8", capacidades: ["128 GB", "256 GB", "512 GB"] },
  { id: "ip15", nombre: "iPhone 15", marca: "Apple", accesorio: false, detalle: "6.1″ · Chip A16 Bionic · Cámara 48 MP", foto: "1704380895316-caa2e4d68a7e", capacidades: ["128 GB", "256 GB", "512 GB"] },
  { id: "s24ultra", nombre: "Samsung Galaxy S24 Ultra", marca: "Samsung", accesorio: false, detalle: "6.8″ · Cámara 200 MP · S Pen incluido", foto: "1705585174953-9b2aa8afc174", capacidades: ["256 GB", "512 GB"] },
  { id: "s24plus", nombre: "Samsung Galaxy S24+", marca: "Samsung", accesorio: false, detalle: "6.7″ QHD+ · 12 GB RAM · Cámara 50 MP", foto: "1706300896423-7d08346e8dbb", capacidades: ["256 GB", "512 GB"] },
  { id: "magic7", nombre: "Honor Magic 7 Pro", marca: "Honor", accesorio: false, detalle: "6.8″ · Snapdragon 8 Elite · Teleobjetivo 200 MP", foto: FOTOS.destacado, capacidades: ["256 GB", "512 GB"] },
  { id: "x14t", nombre: "Xiaomi 14T", marca: "Xiaomi", accesorio: false, detalle: "6.67″ 144 Hz · Óptica Leica · Cámara 50 MP", foto: "1702451462735-3f0ba7679641", capacidades: ["256 GB", "512 GB"] },
  { id: "rn13", nombre: "Redmi Note 13 Pro+ 5G", marca: "Xiaomi", accesorio: false, detalle: "6.67″ 120 Hz · Cámara 200 MP · Carga 120W", foto: "1706300896491-ce7d624fb9ce", capacidades: ["256 GB", "512 GB"] },
  { id: "airpods", nombre: "AirPods Pro (2.ª generación)", marca: "Apple", accesorio: true, detalle: "Cancelación de ruido · Estuche USB-C", foto: "1572569511254-d8f925fe2cbb", capacidades: [] },
  { id: "cargador20", nombre: "Cargador Apple USB-C 20W", marca: "Apple", accesorio: true, detalle: "Original, en caja sellada · Carga rápida", foto: "1624275353151-f21e28a7dfaa", capacidades: [] },
  { id: "cable", nombre: "Cable USB-C trenzado 60W", marca: null, accesorio: true, detalle: "1 metro · Carga rápida y datos", foto: "1595756630452-736bc8ef3693", capacidades: [] },
];

/* lo que el dueño publica desde el panel se suma al catálogo de la casa */
export type Publicado = { producto: Producto; ficha: Ficha | null };
let publicados: Publicado[] = [];
const registrar = (lista: Publicado[]) => {
  publicados = lista;
};
export const catalogo = () => [...publicados.map((x) => x.producto), ...BASE];
export const producto = (id: string) => catalogo().find((p) => p.id === id)!;
export const fichaDe = (id: string): Ficha | null => FICHAS[id] ?? publicados.find((x) => x.producto.id === id)?.ficha ?? null;
export const coloresDe = (id: string) => fichaDe(id)?.colores ?? [];

export type Filtro = "Todos" | "Apple" | "Samsung" | "Honor / Xiaomi" | "Accesorios";
export const FILTROS: Filtro[] = ["Todos", "Apple", "Samsung", "Honor / Xiaomi", "Accesorios"];
export function filtrar(f: Filtro, lista: Producto[]) {
  if (f === "Todos") return lista;
  if (f === "Accesorios") return lista.filter((p) => p.accesorio);
  if (f === "Honor / Xiaomi") return lista.filter((p) => p.marca === "Honor" || p.marca === "Xiaomi");
  return lista.filter((p) => p.marca === f);
}
const sinTildes = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
/* todas las palabras buscadas deben aparecer en el nombre, la marca o la descripción */
export function buscar(texto: string, lista: Producto[]) {
  const palabras = sinTildes(texto).split(/\s+/).filter(Boolean);
  return lista.filter((p) => {
    const donde = sinTildes(`${p.nombre} ${p.marca ?? ""} ${p.detalle} ${p.accesorio ? "accesorio" : "telefono celular"}`);
    return palabras.every((x) => donde.includes(x));
  });
}
export const POCAS = 2;
export const disponibilidad = (stock: number) =>
  stock === 0 ? { texto: "Agotado", tono: "gris" } : stock <= POCAS ? { texto: "Pocas unidades", tono: "borde" } : { texto: "Disponible", tono: "azul" };

/*
 * Cada presentación (equipo + capacidad) tiene su precio y sus existencias.
 * En la orden cada artículo lleva además el color: "equipo|capacidad|color".
 */
export const claveDe = (id: string, cap: Capacidad | null) => `${id}|${cap ?? ""}`;
export const articuloDe = (id: string, cap: Capacidad | null, color = coloresDe(id)[0]?.nombre ?? "") => `${id}|${cap ?? ""}|${color}`;
export const partesDe = (clave: string) => {
  const [id, cap, color] = clave.split("|");
  return { id, cap: (cap || null) as Capacidad | null, color: color || null };
};
export const varianteDe = (clave: string) => {
  const { id, cap } = partesDe(clave);
  return claveDe(id, cap);
};
export const nombreDe = (clave: string) => {
  const { id, cap, color } = partesDe(clave);
  return `${producto(id).nombre}${cap ? ` ${cap}` : ""}${color ? ` · ${color}` : ""}`;
};
export const clavesDe = (p: Producto) => (p.capacidades.length ? p.capacidades.map((c) => claveDe(p.id, c)) : [claveDe(p.id, null)]);
/* unidades de una presentación que ya están en la orden, sumando todos los colores */
export const enCarrito = (carrito: Record<string, number>, variante: string, excepto = "") =>
  Object.entries(carrito).reduce((s, [k, n]) => (k !== excepto && varianteDe(k) === variante ? s + n : s), 0);

export type Variante = { precio: number; stock: number };

const INVENTARIO_INICIAL: Record<string, [number, number]> = {
  "ip16pro|128 GB": [8999, 5],
  "ip16pro|256 GB": [9899, 4],
  "ip16pro|512 GB": [11799, 2],
  "ip15|128 GB": [5899, 8],
  "ip15|256 GB": [6799, 4],
  "ip15|512 GB": [8499, 1],
  "s24ultra|256 GB": [7899, 6],
  "s24ultra|512 GB": [8899, 2],
  "s24plus|256 GB": [5999, 4],
  "s24plus|512 GB": [6899, 0],
  "magic7|256 GB": [7182, 6],
  "magic7|512 GB": [8082, 3],
  "x14t|256 GB": [3899, 7],
  "x14t|512 GB": [4399, 3],
  "rn13|256 GB": [2899, 9],
  "rn13|512 GB": [3299, 2],
  "airpods|": [1899, 10],
  "cargador20|": [229, 25],
  "cable|": [99, 40],
};

/* ---------- plan retoma ---------- */

export type Condicion = "impecable" | "normal" | "pantalla";
export const CONDICIONES: { id: Condicion; nombre: string; detalle: string; factor: number }[] = [
  { id: "impecable", nombre: "Impecable", detalle: "Sin rayones, todo funciona y batería en buen estado.", factor: 1 },
  { id: "normal", nombre: "Uso normal", detalle: "Marcas leves de uso. Todo funciona.", factor: 0.8 },
  { id: "pantalla", nombre: "Pantalla dañada", detalle: "Pantalla quebrada o con manchas. El equipo enciende.", factor: 0.45 },
];
export const condicion = (id: Condicion) => CONDICIONES.find((c) => c.id === id)!;

/* abono por un equipo impecable, según el modelo */
export const RETOMAS: Record<string, Record<string, number>> = {
  Apple: { "iPhone 11": 1300, "iPhone 12": 1800, "iPhone 13": 2500, "iPhone 13 Pro": 3200, "iPhone 14": 3200, "iPhone 14 Pro": 4400, "iPhone 15": 4000 },
  Samsung: { "Galaxy S21": 1300, "Galaxy S22": 1800, "Galaxy S23": 2600, "Galaxy S23 Ultra": 3800, "Galaxy A54": 1100 },
  "Honor / Xiaomi": { "Honor 90": 1200, "Honor Magic5 Lite": 700, "Xiaomi 13T": 1400, "Redmi Note 12 Pro": 800 },
};
export type Retoma = { modelo: string; estado: Condicion };
export const valorRetoma = (r: Retoma) => {
  const base = Object.values(RETOMAS).find((g) => r.modelo in g)?.[r.modelo] ?? 0;
  return Math.round((base * condicion(r.estado).factor) / 25) * 25;
};

/* ---------- órdenes de la tienda ---------- */

export const PLAZOS = [1, 3, 6, 12, 18] as const;
export type Plazo = (typeof PLAZOS)[number];
export type Entrega = "tienda" | "envio";
export const COSTO_ENVIO = 35;

export type Linea = { clave: string; precio: number; cantidad: number };
export type EstadoOrden = "nueva" | "confirmada" | "entregada" | "anulada";
export type Orden = { id: string; fecha: number; cliente: string; lineas: Linea[]; plazo: Plazo; entrega: Entrega; estado: EstadoOrden; retoma?: Retoma & { abono: number } };

export const subtotalDe = (lineas: Linea[]) => lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);
/* el abono solo se descuenta del valor de los teléfonos: no se entrega diferencia en efectivo */
export const abonoDe = (lineas: Linea[], r: Retoma | null) =>
  r ? Math.min(valorRetoma(r), subtotalDe(lineas.filter((l) => !producto(partesDe(l.clave).id).accesorio))) : 0;
export const totalDe = (o: { lineas: Linea[]; entrega: Entrega; retoma?: { abono: number } }) =>
  subtotalDe(o.lineas) - (o.retoma?.abono ?? 0) + (o.entrega === "envio" ? COSTO_ENVIO : 0);
export const textoPago = (total: number, plazo: Plazo) => (plazo === 1 ? "Contado" : `${plazo} cuotas de ${qd(total / plazo)}`);

export function mensajeOrden(o: Orden) {
  const total = totalDe(o);
  return [
    `Hola, Nexus Mobile. Quiero confirmar mi orden ${o.id}.`,
    "",
    `Nombre: ${o.cliente}`,
    ...o.lineas.map((l) => `• ${l.cantidad} × ${nombreDe(l.clave)}: ${qz(l.precio * l.cantidad)}`),
    "",
    `Subtotal: ${qz(subtotalDe(o.lineas))}`,
    ...(o.retoma ? [`Bono Plan Retoma, entrego mi ${o.retoma.modelo} (${condicion(o.retoma.estado).nombre.toLowerCase()}): -${qz(o.retoma.abono)}, sujeto a revisión`] : []),
    ...(o.entrega === "envio" ? [`Envío asegurado en la ciudad: ${qz(COSTO_ENVIO)}`] : []),
    `Total: ${qz(total)}`,
    o.plazo === 1 ? "Pago: al contado" : `Pago: ${o.plazo} cuotas de ${qd(total / o.plazo)} (Visacuotas / Credomatic)`,
    o.entrega === "envio" ? "Entrega: envío asegurado en la ciudad. Te comparto mi dirección por este chat." : "Entrega: retiro en tienda, CC Miraflores.",
  ].join("\n");
}

export function mensajeConfirmacion(o: Orden) {
  const total = totalDe(o);
  return [
    `Hola, ${o.cliente}. Confirmamos tu orden ${o.id} en Nexus Mobile.`,
    "",
    ...o.lineas.map((l) => `• ${l.cantidad} × ${nombreDe(l.clave)}`),
    ...(o.retoma ? [`Bono Plan Retoma (${o.retoma.modelo}): -${qz(o.retoma.abono)}`] : []),
    `Total: ${qz(total)}`,
    `Pago: ${textoPago(total, o.plazo)}`,
    o.entrega === "envio" ? "¿Nos confirmas tu dirección para el envío asegurado?" : "¿A qué hora pasas a retirarla a CC Miraflores?",
  ].join("\n");
}

/* ---------- taller ---------- */

export type Falla = "pantalla" | "bateria" | "carga" | "humedad";
export const FALLAS: { id: Falla; nombre: string; garantia: string; pieza: string }[] = [
  { id: "pantalla", nombre: "Cambio de pantalla", garantia: "6 meses en el repuesto", pieza: "Pantalla original o grado OEM certificado." },
  { id: "bateria", nombre: "Reemplazo de batería", garantia: "6 meses en el repuesto", pieza: "Batería certificada y sellado del equipo." },
  { id: "carga", nombre: "Centro de carga", garantia: "6 meses en el repuesto", pieza: "Puerto o flex de carga y prueba de corriente." },
  { id: "humedad", nombre: "Mantenimiento por humedad", garantia: "30 días sobre la limpieza realizada", pieza: "Limpieza de placa, secado y recambio de lo que apruebes." },
];
export const falla = (id: Falla) => FALLAS.find((f) => f.id === id)!;

type Tarifa = Record<Falla, [precio: number, minutos: number]>;
/* la limpieza por humedad toma de uno a dos días */
const DOS_DIAS = 2880;
const tarifa = (p: [number, number], b: [number, number], c: [number, number], h: number): Tarifa => ({ pantalla: p, bateria: b, carga: c, humedad: [h, DOS_DIAS] });
export const textoTiempo = (min: number) => {
  const m = Math.round(min);
  if (m >= 1440) return "24 a 48 h";
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}`;
};

export const MODELOS: Record<Marca, { nombre: string; tarifa: Tarifa }[]> = {
  Apple: [
    { nombre: "iPhone 16 Pro", tarifa: tarifa([3200, 45], [850, 45], [650, 90], 350) },
    { nombre: "iPhone 15", tarifa: tarifa([2100, 45], [650, 35], [450, 60], 300) },
    { nombre: "iPhone 14", tarifa: tarifa([1650, 45], [550, 35], [400, 60], 300) },
    { nombre: "iPhone 13", tarifa: tarifa([1250, 45], [450, 35], [350, 60], 275) },
  ],
  Samsung: [
    { nombre: "Galaxy S24 Ultra", tarifa: tarifa([2950, 120], [650, 60], [450, 60], 350) },
    { nombre: "Galaxy S24+", tarifa: tarifa([2200, 120], [550, 60], [400, 60], 300) },
    { nombre: "Galaxy S23", tarifa: tarifa([1750, 90], [500, 60], [350, 60], 275) },
    { nombre: "Galaxy A55", tarifa: tarifa([850, 90], [350, 60], [250, 45], 225) },
  ],
  Honor: [
    { nombre: "Honor Magic 7 Pro", tarifa: tarifa([2400, 120], [650, 60], [450, 60], 300) },
    { nombre: "Honor X8b", tarifa: tarifa([750, 90], [325, 60], [225, 45], 200) },
  ],
  Xiaomi: [
    { nombre: "Xiaomi 14T", tarifa: tarifa([1150, 90], [450, 60], [300, 60], 250) },
    { nombre: "Redmi Note 13 Pro+", tarifa: tarifa([950, 90], [375, 60], [250, 45], 225) },
  ],
};
export const MARCAS = Object.keys(MODELOS) as Marca[];

/* 0 = agendado (todavía no entra al taller), 1 a 4 son los pasos que ve el cliente y 5 ya se entregó */
export const PASOS = [
  { corto: "Recepción", nombre: "Recepción y checklist físico" },
  { corto: "Diagnóstico", nombre: "Diagnóstico técnico" },
  { corto: "Cambio de pieza", nombre: "Cambio de pieza en curso" },
  { corto: "Calidad y entrega", nombre: "Control de calidad y entrega" },
] as const;
export type Paso = 0 | 1 | 2 | 3 | 4 | 5;
export const nombrePaso = (p: Paso) => (p === 0 ? "Ingreso agendado" : p === 5 ? "Entregado" : PASOS[p - 1].nombre);
export const etiquetaPaso = (p: Paso) => (p === 0 ? "Agendado" : p === 5 ? "Entregado" : PASOS[p - 1].corto);

export const TECNICOS = ["Marvin Ajú", "Kevin Monzón", "Lucía Barrios"];
export const SIN_NOTAS = "El técnico agregará sus notas al terminar la revisión.";

/* calidad del repuesto: cambia el precio y la garantía */
export type Calidad = "original" | "oem";
export const nombreCalidad = (c: Calidad, f: Falla) => (c === "original" ? "Original Certificado" : f === "pantalla" ? "OLED / Calidad OEM" : "Calidad OEM");
export const precioCon = (base: number, c: Calidad, f: Falla) => (c === "oem" && f !== "humedad" ? Math.round((base * 0.7) / 25) * 25 : base);
export const garantiaDe = (f: Falla, c: Calidad) => (f === "humedad" ? "30 días sobre la limpieza realizada" : c === "original" ? "6 meses en el repuesto" : "3 meses en el repuesto");
export const diasGarantia = (f: Falla, c: Calidad) => (f === "humedad" ? 30 : c === "original" ? 182 : 91);
export const COSTO_RECOLECCION = 35;

/* revisión física al recibir el equipo: protege al cliente y al taller */
export type Punto = "enciende" | "biometria" | "camaras" | "sinHumedad";
export type Recepcion = Record<Punto, boolean> & { chasis?: string };
export const PUNTOS: { id: Punto; casilla: string }[] = [
  { id: "enciende", casilla: "Enciende" },
  { id: "biometria", casilla: "Face ID / Huella OK" },
  { id: "camaras", casilla: "Cámaras OK" },
  { id: "sinHumedad", casilla: "Sin humedad" },
];
export const SIN_REVISAR: Recepcion = { enciende: false, biometria: false, camaras: false, sinHumedad: false };
export function insignias(r: { modelo: string; recepcion: Recepcion | null }) {
  const c = r.recepcion;
  if (!c) return [];
  return [
    { nombre: "Enciende", valor: c.enciende ? "Sí" : "No", bien: c.enciende },
    { nombre: /iphone/i.test(r.modelo) ? "Face ID" : "Huella", valor: c.biometria ? "Funcional" : "Con falla", bien: c.biometria },
    { nombre: "Cámaras", valor: c.camaras ? "OK" : "Revisar", bien: c.camaras },
    ...(c.chasis ? [{ nombre: "Chasis", valor: c.chasis, bien: c.chasis === "Sin daño" }] : []),
    { nombre: "Humedad", valor: c.sinHumedad ? "Negativo" : "Positivo", bien: c.sinHumedad },
  ];
}

export type Repuesto = "bodega" | "proveedor";
export const REPUESTOS: { id: Repuesto; nombre: string }[] = [
  { id: "bodega", nombre: "En bodega · listo hoy" },
  { id: "proveedor", nombre: "Solicitado a proveedor" },
];
export const nombreRepuesto = (r: Repuesto) => REPUESTOS.find((x) => x.id === r)!.nombre;

export type Reparacion = {
  id: string;
  fecha: number;
  cliente: string;
  telefono?: string;
  modelo: string;
  falla: Falla;
  calidad: Calidad;
  /* la pasa a traer un mensajero */
  recoleccion: boolean;
  precio: number;
  tiempo: string;
  estado: Paso;
  /* cuándo llegó a cada paso */
  historial: Partial<Record<Paso, number>>;
  tecnico: string;
  notas: string;
  recepcion: Recepcion | null;
  repuesto: Repuesto;
  /* últimos cuatro dígitos */
  imei?: string;
  /* cuándo aprobó el presupuesto el cliente */
  aprobado?: number;
  cita?: { dia: number; hora: string };
  nueva?: boolean;
};

export const totalTaller = (r: { precio: number; recoleccion: boolean }) => r.precio + (r.recoleccion ? COSTO_RECOLECCION : 0);

export const textoCita = (c: { dia: number; hora: string }) => {
  const d = new Date(c.dia);
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES_LARGOS[d.getMonth()]}, de ${c.hora}`;
};

export const mensajeCita = (r: Reparacion) =>
  [
    `Hola, Nexus Mobile. Agendé el ingreso de mi equipo al taller: orden ${r.id}.`,
    "",
    `Nombre: ${r.cliente}`,
    ...(r.telefono ? [`Teléfono: ${r.telefono}`] : []),
    `Equipo: ${r.modelo}`,
    `Servicio: ${falla(r.falla).nombre}${r.falla === "humedad" ? "" : ` (${nombreCalidad(r.calidad, r.falla)})`}`,
    `Total cotizado: ${qz(totalTaller(r))}${r.recoleccion ? `, con recolección de ${qz(COSTO_RECOLECCION)}` : ""}`,
    r.cita
      ? r.recoleccion
        ? `Recolección: ${textoCita(r.cita)}. Te comparto mi dirección por este chat.`
        : `Llego el ${textoCita(r.cita)}, al taller de Zona 10.`
      : "",
  ].join("\n");

/* dirección que abre el rastreador con la orden ya puesta */
export const enlaceRastreo = (id: string) => `${location.origin}${location.pathname}#reparaciones/${id}`;

export function mensajeEstado(r: Reparacion) {
  const espera = r.cita ? `${r.recoleccion ? "pasamos por tu equipo" : "te esperamos"} el ${textoCita(r.cita)}.` : "te esperamos en nuestro taller de Zona 10.";
  const avisos: Record<Paso, string> = {
    0: espera,
    1: "ya recibimos tu equipo y levantamos el checklist físico.",
    2: `terminamos de revisar tu equipo. Presupuesto: ${qz(totalTaller(r))}. Puedes aprobarlo desde el rastreador.`,
    3: "estamos cambiando la pieza de tu equipo.",
    4: `tu equipo está en control de calidad. Coordinemos la entrega. Total: ${qz(totalTaller(r))}.`,
    5: `registramos la entrega de tu equipo. Garantía: ${garantiaDe(r.falla, r.calidad)}.`,
  };
  return [
    `Hola, ${r.cliente}. Te escribimos de Nexus Mobile por la orden ${r.id} (${r.modelo}): ${avisos[r.estado]}`,
    ...(r.estado >= 1 && r.estado <= 3 ? [`Repuesto: ${nombreRepuesto(r.repuesto).toLowerCase()}.`] : []),
    "",
    `Sigue tu reparación con el código ${r.id}:`,
    enlaceRastreo(r.id),
  ].join("\n");
}

export const mensajeAprobacion = (r: Reparacion) =>
  `Hola, Nexus Mobile. Aprobé el presupuesto de la orden ${r.id} (${r.modelo}): ${falla(r.falla).nombre} por ${qz(totalTaller(r))}. Pueden continuar con la reparación.`;

/* ---------- estado ---------- */

export type Estado = {
  inventario: Record<string, Variante>;
  carrito: Record<string, number>;
  ordenes: Orden[];
  reparaciones: Reparacion[];
  /* teléfono que el cliente va a entregar como parte de pago */
  retoma: Retoma | null;
  nuevos: Publicado[];
  /* colores marcados como agotados: "equipo|color" */
  sinColor: string[];
};

const HORA = 3_600_000;

function inicial(): Estado {
  const ahora = Date.now();
  const hace = (h: number) => ahora - h * HORA;
  /* una venta siempre queda fechada hoy, aunque se abra de madrugada */
  const deHoy = Math.max(new Date().setHours(0, 1, 0, 0), hace(3));
  const todo: Recepcion = { enciende: true, biometria: true, camaras: true, sinHumedad: true };
  const base = { calidad: "original" as const, recoleccion: false, repuesto: "bodega" as const };
  return {
    inventario: Object.fromEntries(Object.entries(INVENTARIO_INICIAL).map(([k, [precio, stock]]) => [k, { precio, stock }])),
    carrito: {},
    ordenes: [
      { id: "NXS-1041", fecha: deHoy, cliente: "Mariela Ortiz", lineas: [{ clave: "ip15|128 GB|Azul", precio: 5899, cantidad: 1 }, { clave: "cargador20||", precio: 229, cantidad: 1 }], plazo: 12, entrega: "envio", estado: "confirmada" },
      { id: "NXS-1040", fecha: hace(27), cliente: "Diego Herrera", lineas: [{ clave: "rn13|256 GB|Blanco Luz de Luna", precio: 2899, cantidad: 1 }], plazo: 1, entrega: "tienda", estado: "entregada" },
    ],
    reparaciones: [
      {
        ...base, id: "ORD-414", fecha: hace(1), cliente: "José Cifuentes", modelo: "iPhone 14", falla: "humedad", precio: 300, tiempo: "24 a 48 h", estado: 1, historial: { 1: hace(1) }, tecnico: "Lucía Barrios", notas: SIN_NOTAS,
        recepcion: { enciende: false, biometria: false, camaras: true, sinHumedad: false, chasis: "Sin daño" }, imei: "5506",
      },
      {
        ...base, id: "ORD-412", fecha: hace(5), cliente: "Andrea López", modelo: "Galaxy S23", falla: "bateria", precio: 500, tiempo: "1 h", estado: 3, historial: { 1: hace(5), 2: hace(4), 3: hace(1.5) }, tecnico: "Kevin Monzón",
        notas: "Batería inflada y con 71% de capacidad. Tapa trasera sin daño. Se recomienda reemplazo.", aprobado: hace(3), recepcion: { ...todo, chasis: "Sin daño" }, imei: "1937",
      },
      {
        ...base, id: "ORD-408", fecha: hace(26), cliente: "Carlos Méndez", modelo: "iPhone 13", falla: "pantalla", precio: 1250, tiempo: "45 min", estado: 2, historial: { 1: hace(26), 2: hace(2) }, tecnico: "Marvin Ajú",
        notas: "Pantalla quebrada en la esquina superior, sin respuesta táctil en esa zona. Marco, cámaras y Face ID sin daño. Se recomienda cambio de pantalla.",
        recepcion: { ...todo, chasis: "Rayón leve" }, imei: "4821",
      },
      {
        ...base, id: "ORD-405", fecha: hace(50), cliente: "Sofía Ramírez", modelo: "Redmi Note 13 Pro+", falla: "carga", precio: 250, tiempo: "45 min", estado: 4, historial: { 1: hace(50), 2: hace(49), 3: hace(47), 4: hace(46) }, tecnico: "Kevin Monzón",
        notas: "Puerto de carga con sulfato y pines doblados. Se reemplazó la placa de carga.", aprobado: hace(48), recepcion: { ...todo, chasis: "Rayón leve" }, imei: "7714",
      },
    ],
    retoma: null,
    nuevos: [],
    sinColor: ["ip15|Amarillo", "s24ultra|Titanio Amarillo"],
  };
}

const CLAVE = "demo-nexus-v3";

/* lo guardado solo se usa si tiene la forma esperada; si no, se vuelve a los datos de inicio */
function leerGuardado(texto: string | null): Estado | null {
  if (!texto) return null;
  try {
    const g = JSON.parse(texto) as Estado;
    const bien =
      g &&
      Object.keys(INVENTARIO_INICIAL).every((k) => typeof g.inventario?.[k]?.precio === "number" && typeof g.inventario[k].stock === "number") &&
      typeof g.carrito === "object" &&
      Array.isArray(g.ordenes) &&
      Array.isArray(g.reparaciones) &&
      g.reparaciones.every((r) => typeof r.tecnico === "string" && typeof r.notas === "string" && typeof r.calidad === "string") &&
      Array.isArray(g.sinColor) &&
      Array.isArray(g.nuevos) &&
      g.nuevos.every((x) => clavesDe(x.producto).every((k) => typeof g.inventario[k]?.precio === "number"));
    if (!bien) return null;
    g.carrito = Object.fromEntries(Object.entries(g.carrito).filter(([k]) => varianteDe(k) in g.inventario));
    if (g.retoma && !(valorRetoma(g.retoma) > 0 && CONDICIONES.some((c) => c.id === g.retoma!.estado))) g.retoma = null;
    return g;
  } catch {
    return null;
  }
}

function leer(): Estado {
  try {
    return leerGuardado(localStorage.getItem(CLAVE)) ?? inicial();
  } catch {
    return inicial();
  }
}

const siguiente = (ids: string[], base: number) => ids.reduce((m, id) => Math.max(m, Number(id.split("-")[1]) || 0), base) + 1;

export function useNexus() {
  const [estado, setEstado] = useState<Estado>(leer);
  registrar(estado.nuevos);

  /* nuevo ingreso al taller, asignado al técnico con menos equipos en curso */
  function nuevaReparacion(datos: Omit<Reparacion, "id" | "fecha" | "historial" | "tecnico" | "notas">): Reparacion {
    const ahora = Date.now();
    const carga = (t: string) => estado.reparaciones.filter((r) => r.tecnico === t && r.estado < 5).length;
    const r: Reparacion = {
      ...datos,
      id: `ORD-${siguiente(estado.reparaciones.map((x) => x.id), 400)}`,
      fecha: ahora,
      historial: { [datos.estado]: ahora },
      tecnico: [...TECNICOS].sort((a, b) => carga(a) - carga(b))[0],
      notas: SIN_NOTAS,
    };
    setEstado((e) => ({ ...e, reparaciones: [r, ...e.reparaciones] }));
    return r;
  }

  const hayColor = (id: string, color: string) => !estado.sinColor.includes(`${id}|${color}`);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {
      /* sin espacio o en modo privado: sigue funcionando sin guardar */
    }
  }, [estado]);

  useEffect(() => {
    const llega = (e: StorageEvent) => {
      if (e.key !== CLAVE) return;
      const g = leerGuardado(e.newValue);
      if (g) setEstado(g);
    };
    addEventListener("storage", llega);
    return () => removeEventListener("storage", llega);
  }, []);

  /* la orden en curso nunca pide más de lo que hay, sumando todos los colores */
  const apartadas: Record<string, number> = {};
  const lineas: Linea[] = Object.entries(estado.carrito).flatMap(([clave, n]) => {
    const v = varianteDe(clave);
    const { id, color } = partesDe(clave);
    if (color && !hayColor(id, color)) return [];
    const { precio, stock } = estado.inventario[v];
    const cantidad = Math.min(n, stock - (apartadas[v] ?? 0));
    apartadas[v] = (apartadas[v] ?? 0) + Math.max(0, cantidad);
    return cantidad > 0 ? [{ clave, precio, cantidad }] : [];
  });

  return {
    ...estado,
    lineas,
    articulos: lineas.reduce((s, l) => s + l.cantidad, 0),
    siguienteOrden: `NXS-${siguiente(estado.ordenes.map((o) => o.id), 1000)}`,
    productos: catalogo(),
    hayColor,
    /* primer color con existencias; null si todos están agotados */
    colorLibre: (id: string) => {
      const colores = coloresDe(id);
      return colores.length ? (colores.find((c) => hayColor(id, c.nombre))?.nombre ?? null) : "";
    },
    /* unidades de una presentación que ya están en la orden */
    unidadesEn: (variante: string) => lineas.reduce((s, l) => (varianteDe(l.clave) === variante ? s + l.cantidad : s), 0),

    ponerCantidad(clave: string, cantidad: number) {
      setEstado((e) => {
        const { id, color } = partesDe(clave);
        if (cantidad > 0 && color && e.sinColor.includes(`${id}|${color}`)) return e;
        const carrito = { ...e.carrito };
        const libres = e.inventario[varianteDe(clave)].stock - enCarrito(carrito, varianteDe(clave), clave);
        const n = Math.min(cantidad, libres);
        if (n > 0) carrito[clave] = n;
        else delete carrito[clave];
        return { ...e, carrito };
      });
    },

    /* cambia el color de un artículo sin moverlo de lugar; si ya estaba ese color, se suman */
    cambiarColor(clave: string, color: string) {
      setEstado((e) => {
        const { id, cap } = partesDe(clave);
        const nueva = articuloDe(id, cap, color);
        if (nueva === clave) return e;
        const carrito: Record<string, number> = {};
        Object.entries(e.carrito).forEach(([k, n]) => {
          const destino = k === clave ? nueva : k;
          carrito[destino] = (carrito[destino] ?? 0) + n;
        });
        return { ...e, carrito };
      });
    },

    ponerRetoma(retoma: Retoma | null) {
      setEstado((e) => ({ ...e, retoma }));
    },

    /* registra la orden, aparta las existencias y vacía la orden en curso */
    crearOrden(datos: { cliente: string; plazo: Plazo; entrega: Entrega }): Orden {
      const abono = abonoDe(lineas, estado.retoma);
      const orden: Orden = {
        id: `NXS-${siguiente(estado.ordenes.map((o) => o.id), 1000)}`,
        fecha: Date.now(),
        lineas,
        estado: "nueva",
        ...datos,
        ...(abono > 0 && estado.retoma ? { retoma: { ...estado.retoma, abono } } : {}),
      };
      setEstado((e) => {
        const inventario = { ...e.inventario };
        orden.lineas.forEach((l) => {
          const v = varianteDe(l.clave);
          inventario[v] = { ...inventario[v], stock: Math.max(0, inventario[v].stock - l.cantidad) };
        });
        return { ...e, inventario, carrito: {}, retoma: orden.retoma ? null : e.retoma, ordenes: [orden, ...e.ordenes] };
      });
      return orden;
    },

    estadoOrden(id: string, nuevo: EstadoOrden) {
      setEstado((e) => {
        const o = e.ordenes.find((x) => x.id === id);
        if (!o || o.estado === "anulada") return e;
        const inventario = { ...e.inventario };
        /* anular devuelve las existencias */
        if (nuevo === "anulada")
          o.lineas.forEach((l) => {
            const v = varianteDe(l.clave);
            inventario[v] = { ...inventario[v], stock: inventario[v].stock + l.cantidad };
          });
        return { ...e, inventario, ordenes: e.ordenes.map((x) => (x.id === id ? { ...x, estado: nuevo } : x)) };
      });
    },

    editarVariante(clave: string, cambio: Partial<Variante>) {
      setEstado((e) => ({ ...e, inventario: { ...e.inventario, [clave]: { ...e.inventario[clave], ...cambio } } }));
    },

    alternarColor(id: string, color: string) {
      const k = `${id}|${color}`;
      setEstado((e) => ({ ...e, sinColor: e.sinColor.includes(k) ? e.sinColor.filter((x) => x !== k) : [...e.sinColor, k] }));
    },

    publicar(datos: { producto: Omit<Producto, "id" | "nuevo">; ficha: Ficha | null; precio: number; stock: number }): Producto {
      const nuevo: Producto = { ...datos.producto, id: `p${Date.now().toString(36)}`, nuevo: true };
      setEstado((e) => {
        const inventario = { ...e.inventario };
        clavesDe(nuevo).forEach((k) => (inventario[k] = { precio: datos.precio, stock: datos.stock }));
        return { ...e, inventario, nuevos: [{ producto: nuevo, ficha: datos.ficha }, ...e.nuevos] };
      });
      return nuevo;
    },

    /* cita pedida desde la página: queda agendada hasta que el equipo llegue */
    agendar(datos: Pick<Reparacion, "cliente" | "telefono" | "modelo" | "falla" | "calidad" | "recoleccion" | "precio" | "tiempo" | "cita">): Reparacion {
      return nuevaReparacion({ ...datos, estado: 0, nueva: true, recepcion: null, repuesto: "bodega" });
    },

    /* equipo recibido en el mostrador, registrado desde el panel */
    registrarIngreso(datos: Pick<Reparacion, "cliente" | "modelo" | "falla" | "precio" | "tiempo" | "recepcion" | "imei">): Reparacion {
      return nuevaReparacion({ ...datos, estado: 1, calidad: "original", recoleccion: false, repuesto: "bodega" });
    },

    estadoReparacion(id: string, paso: Paso) {
      setEstado((e) => ({
        ...e,
        reparaciones: e.reparaciones.map((r) => {
          if (r.id !== id) return r;
          const historial: Reparacion["historial"] = {};
          /* al retroceder se borran las horas de los pasos que quedan adelante */
          for (let p = 0; p <= paso; p++) {
            const antes = r.historial[p as Paso];
            if (antes) historial[p as Paso] = antes;
          }
          historial[paso] = historial[paso] ?? Date.now();
          /* si vuelve a antes del cambio de pieza, el presupuesto queda por aprobar */
          return { ...r, estado: paso, historial, nueva: false, aprobado: paso < 3 ? undefined : r.aprobado };
        }),
      }));
    },

    /* el cliente aprueba: queda registrado y pasa al cambio de pieza */
    aprobar(id: string) {
      const ahora = Date.now();
      setEstado((e) => ({
        ...e,
        reparaciones: e.reparaciones.map((r) => (r.id === id && r.estado === 2 ? { ...r, estado: 3, aprobado: ahora, historial: { ...r.historial, 3: ahora } } : r)),
      }));
    },

    editarReparacion(id: string, cambio: Partial<Pick<Reparacion, "tecnico" | "notas" | "recepcion" | "repuesto">>) {
      setEstado((e) => ({ ...e, reparaciones: e.reparaciones.map((r) => (r.id === id ? { ...r, ...cambio } : r)) }));
    },

    reiniciar: () => setEstado(inicial()),
  };
}

export type Nexus = ReturnType<typeof useNexus>;
