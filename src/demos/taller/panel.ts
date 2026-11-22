/* Datos de ejemplo del panel de Taller Torque (bahías, órdenes, repuestos, auxilio y cobros) */

export const ASFALTO = "#15171c";
export const AMARILLO = "#ffc21a";
export const ACERO = "#e9ecef";
export const ROJO = "#d63b2f";
export const VERDE = "#1f7a46";
export const AMBAR = "#b97800";

export const PASOS = ["Recibido", "Diagnóstico", "Esperando visto bueno", "En reparación", "Listo"] as const;

export type Linea = { id: string; tipo: "repuesto" | "mano de obra"; texto: string; cant: number; precio: number };
export type Orden = {
  id: string; num: number; placa: string; modelo: string; cliente: string; tel: string; km: string; falla: string;
  paso: number; bahia: string | null; lineas: Linea[]; pagado: boolean; entrega: string;
};
export const ORDENES_INICIAL: Orden[] = [
  { id: "o1", num: 1042, placa: "P 482KLM", modelo: "Honda Civic 2016", cliente: "Andrea López", tel: "5544 1290", km: "84,200", falla: "Rechina al frenar", paso: 3, bahia: "Bahía 1", entrega: "Hoy 4:30 pm", pagado: false, lineas: [{ id: "a", tipo: "repuesto", texto: "Pastillas delanteras", cant: 1, precio: 420 }, { id: "b", tipo: "repuesto", texto: "Aceite y filtro", cant: 1, precio: 260 }, { id: "c", tipo: "mano de obra", texto: "Frenos delanteros", cant: 1, precio: 350 }, { id: "d", tipo: "mano de obra", texto: "Cambio de aceite", cant: 1, precio: 150 }] },
  { id: "o2", num: 1043, placa: "P 117TZR", modelo: "Toyota Hilux 2019", cliente: "José Ajú", tel: "3390 1245", km: "61,800", falla: "Golpea la suspensión delantera", paso: 2, bahia: "Bahía 2", entrega: "Mañana", pagado: false, lineas: [{ id: "a", tipo: "repuesto", texto: "Amortiguadores delanteros (par)", cant: 1, precio: 980 }, { id: "b", tipo: "repuesto", texto: "Rótulas", cant: 2, precio: 190 }, { id: "c", tipo: "mano de obra", texto: "Suspensión delantera", cant: 1, precio: 290 }] },
  { id: "o3", num: 1044, placa: "C 904BNW", modelo: "Nissan Sentra 2014", cliente: "Sofía Ramírez", tel: "4120 8855", km: "112,000", falla: "Golpe en la puerta derecha", paso: 3, bahia: "Cabina", entrega: "Jue 27 nov", pagado: false, lineas: [{ id: "a", tipo: "mano de obra", texto: "Enderezado de puerta", cant: 1, precio: 900 }, { id: "b", tipo: "mano de obra", texto: "Pintura y pulido", cant: 1, precio: 1500 }] },
  { id: "o4", num: 1045, placa: "P 650HDS", modelo: "Kia Rio 2018", cliente: "Mario Castillo", tel: "5032 7710", km: "45,300", falla: "Cambio de aceite", paso: 4, bahia: null, entrega: "Hoy", pagado: false, lineas: [{ id: "a", tipo: "repuesto", texto: "Aceite y filtro", cant: 1, precio: 190 }, { id: "b", tipo: "mano de obra", texto: "Cambio de aceite", cant: 1, precio: 50 }] },
  { id: "o5", num: 1046, placa: "P 330DFR", modelo: "Toyota Corolla 2015", cliente: "Pedro Velásquez", tel: "5598 4410", km: "98,700", falla: "Luz amarilla del motor", paso: 0, bahia: null, entrega: "Por definir", pagado: false, lineas: [] },
  { id: "o6", num: 1041, placa: "P 721LKD", modelo: "Mazda 3 2017", cliente: "Elena Soto", tel: "4455 0912", km: "70,100", falla: "Alineación y balanceo", paso: 4, bahia: null, entrega: "Ayer", pagado: true, lineas: [{ id: "a", tipo: "mano de obra", texto: "Alineación y balanceo", cant: 1, precio: 200 }] },
];
export const BAHIAS = [
  { id: "Bahía 1", quien: "Luis", tipo: "Mecánica general" },
  { id: "Bahía 2", quien: "Luis", tipo: "Suspensión y dirección" },
  { id: "Bahía 3", quien: "Óscar", tipo: "Servicios rápidos" },
  { id: "Cabina", quien: "Memo", tipo: "Enderezado y pintura" },
];

export type Repuesto = { id: string; nombre: string; stock: number; minimo: number; proveedor: string; costo: number; pedido: boolean };
export const REPUESTOS_INICIAL: Repuesto[] = [
  { id: "r1", nombre: "Pastillas de freno delanteras (Civic, Corolla)", stock: 2, minimo: 4, proveedor: "Repuestos El Trébol", costo: 280, pedido: false },
  { id: "r2", nombre: "Filtro de aceite (universal chico)", stock: 14, minimo: 8, proveedor: "Importadora Sur", costo: 35, pedido: false },
  { id: "r3", nombre: "Aceite 10W-30 (galón)", stock: 3, minimo: 6, proveedor: "Importadora Sur", costo: 145, pedido: false },
  { id: "r4", nombre: "Batería 12V 45 amp", stock: 1, minimo: 2, proveedor: "Baterías Mixco", costo: 620, pedido: false },
  { id: "r5", nombre: "Rótulas (Hilux, par)", stock: 0, minimo: 2, proveedor: "Repuestos El Trébol", costo: 190, pedido: true },
  { id: "r6", nombre: "Bujías (juego de 4)", stock: 9, minimo: 4, proveedor: "Importadora Sur", costo: 120, pedido: false },
];

export const AUXILIOS_INICIAL = [
  { id: "x1", cliente: "Karla Orozco", tel: "5512 8890", zona: "Mixco zona 1", falla: "No arranca (posible batería)", hora: "10:05", estado: 0, min: "25 a 30 min" },
  { id: "x2", cliente: "Luis Herrera", tel: "4120 1188", zona: "San Cristóbal", falla: "Llanta ponchada, sin repuesto", hora: "08:40", estado: 1, min: "ya va en camino" },
  { id: "x3", cliente: "Mariela Tzul", tel: "3390 7711", zona: "Zona 7", falla: "Se recalentó el motor", hora: "Ayer 22:15", estado: 2, min: "resuelto" },
];
export const ESTADOS_AUXILIO = ["Nueva", "En camino", "Resuelto"];

export const CARROS = [
  { placa: "P 482KLM", modelo: "Honda Civic 2016", cliente: "Andrea López", ultimo: "Hoy", km: "84,200", proximo: "Aceite en 5,000 km", total: 2420, historial: ["Hoy · Frenos delanteros y aceite · Q1,180", "12 jun · Alineación y balanceo · Q200", "3 abr · Aceite y filtro · Q260", "20 ene · Batería nueva (garantía 12 meses) · Q780"] },
  { placa: "P 117TZR", modelo: "Toyota Hilux 2019", cliente: "José Ajú", ultimo: "Hoy", km: "61,800", proximo: "Revisión en 3 meses", total: 5800, historial: ["Hoy · Suspensión delantera (en reparación)", "Sep · Llantas y alineación · Q3,200"] },
  { placa: "P 330DFR", modelo: "Toyota Corolla 2015", cliente: "Pedro Velásquez", ultimo: "Hoy", km: "98,700", proximo: "Aceite vencido hace 2 meses", total: 1350, historial: ["Hoy · Llegó con la luz del motor encendida", "Hace 8 meses · Frenos traseros · Q1,350"] },
  { placa: "P 721LKD", modelo: "Mazda 3 2017", cliente: "Elena Soto", ultimo: "Ayer", km: "70,100", proximo: "Pastillas en 2 meses", total: 1900, historial: ["Ayer · Alineación y balanceo · Q200", "Hace 5 meses · Aceite y pastillas · Q1,700"] },
];

export const INGRESOS = [
  { t: "Lun", v: 4200 }, { t: "Mar", v: 5100 }, { t: "Mié", v: 3900 }, { t: "Jue", v: 6200 }, { t: "Vie", v: 7100 }, { t: "Sáb", v: 5600 },
];
