/*
 * Datos de ejemplo de "Órbita Celulares" (tienda inventada). Los pedidos,
 * devoluciones, reparaciones y el stock viven en el navegador (localStorage)
 * para que lo que haga el cliente aparezca en el panel del dueño.
 */
import { useEffect, useState } from "react";

export const TINTA = "#0d1117";
export const COBALTO = "#2456e8";
export const LIMA = "#c8f04a";
export const FONDO = "#f4f5f7";
export const TITULO = "var(--font-titulo)";

export type Condicion = "Nuevo" | "Seminuevo";
export type Categoria = "Celulares" | "Accesorios";
export type Arte = "telefono" | "funda" | "cargador" | "audifonos" | "bateria" | "reloj";
export type Variante = { capacidad?: string; precio: number };
export type Producto = {
  id: string;
  nombre: string;
  marca: string;
  categoria: Categoria;
  condicion: Condicion;
  arte: Arte;
  colores: { nombre: string; hex: string }[];
  variantes: Variante[];
  antes?: number;
  resumen: string;
  detalles: string[];
  garantia: string;
  origen: string;
  etiqueta?: string;
};

export const PRODUCTOS: Producto[] = [
  {
    id: "ip15", nombre: "iPhone 15", marca: "Apple", categoria: "Celulares", condicion: "Nuevo", arte: "telefono",
    colores: [{ nombre: "Negro", hex: "#2b2d31" }, { nombre: "Azul", hex: "#c9dbe9" }, { nombre: "Rosado", hex: "#f2d6d9" }],
    variantes: [{ capacidad: "128 GB", precio: 7499 }, { capacidad: "256 GB", precio: 8399 }],
    resumen: "Sellado, con factura y garantía de 1 año.", detalles: ["Pantalla de 6.1\"", "Cámara de 48 MP", "Puerto USB-C", "eSIM y chip físico"],
    garantia: "1 año con nosotros", origen: "Distribuidor autorizado en Miami", etiqueta: "Más vendido",
  },
  {
    id: "ip13", nombre: "iPhone 13", marca: "Apple", categoria: "Celulares", condicion: "Seminuevo", arte: "telefono",
    colores: [{ nombre: "Blanco", hex: "#eceae6" }, { nombre: "Medianoche", hex: "#22262e" }],
    variantes: [{ capacidad: "128 GB", precio: 3999 }, { capacidad: "256 GB", precio: 4499 }], antes: 4600,
    resumen: "Batería arriba de 88% y revisión de 30 puntos.", detalles: ["Pantalla de 6.1\"", "Batería 88% o más", "Sin golpes ni rayones", "Incluye cable"],
    garantia: "6 meses con nosotros", origen: "Equipos de primera mano de EE. UU., revisados aquí", etiqueta: "Seminuevo certificado",
  },
  {
    id: "s24", nombre: "Galaxy S24", marca: "Samsung", categoria: "Celulares", condicion: "Nuevo", arte: "telefono",
    colores: [{ nombre: "Gris", hex: "#5b5f66" }, { nombre: "Violeta", hex: "#cbbfe0" }, { nombre: "Amarillo", hex: "#efe39a" }],
    variantes: [{ capacidad: "256 GB", precio: 6999 }, { capacidad: "512 GB", precio: 7899 }],
    resumen: "Liberado para cualquier compañía.", detalles: ["Pantalla de 6.2\" a 120 Hz", "Zoom óptico 3x", "8 GB de RAM", "Carga rápida"],
    garantia: "1 año con nosotros", origen: "Importado de Panamá, liberado",
  },
  {
    id: "a55", nombre: "Galaxy A55", marca: "Samsung", categoria: "Celulares", condicion: "Nuevo", arte: "telefono",
    colores: [{ nombre: "Azul hielo", hex: "#cfe3f2" }, { nombre: "Negro", hex: "#2a2c30" }],
    variantes: [{ capacidad: "128 GB", precio: 3299 }, { capacidad: "256 GB", precio: 3699 }],
    resumen: "El mejor precio por lo que trae.", detalles: ["Pantalla de 6.6\"", "Batería de 5,000 mAh", "Resistente al agua", "Cámara de 50 MP"],
    garantia: "1 año con nosotros", origen: "Distribuidor regional", etiqueta: "Oferta",
  },
  {
    id: "redmi", nombre: "Redmi Note 13", marca: "Xiaomi", categoria: "Celulares", condicion: "Nuevo", arte: "telefono",
    colores: [{ nombre: "Verde", hex: "#a8c9b3" }, { nombre: "Negro", hex: "#26282b" }],
    variantes: [{ capacidad: "128 GB", precio: 1899 }, { capacidad: "256 GB", precio: 2199 }],
    resumen: "Buen celular sin gastar de más.", detalles: ["Pantalla AMOLED de 6.67\"", "Cámara de 108 MP", "Carga de 33 W", "Doble chip"],
    garantia: "1 año con nosotros", origen: "Distribuidor regional",
  },
  {
    id: "moto", nombre: "Moto G84", marca: "Motorola", categoria: "Celulares", condicion: "Seminuevo", arte: "telefono",
    colores: [{ nombre: "Magenta", hex: "#b23a6e" }],
    variantes: [{ capacidad: "256 GB", precio: 1499 }], antes: 1799,
    resumen: "Como nuevo, con su caja.", detalles: ["Pantalla pOLED de 6.5\"", "12 GB de RAM", "Batería 92%", "Incluye cargador"],
    garantia: "6 meses con nosotros", origen: "Recibido en canje, revisado aquí",
  },
  {
    id: "funda", nombre: "Funda de silicón", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", arte: "funda",
    colores: [{ nombre: "Naranja", hex: "#f08a4b" }, { nombre: "Azul", hex: "#4a6fd1" }, { nombre: "Verde", hex: "#7fb48f" }, { nombre: "Negro", hex: "#2a2a2a" }],
    variantes: [{ precio: 129 }], resumen: "Para la mayoría de modelos. Pregunte por el suyo.", detalles: ["Silicón suave por dentro", "Bordes que protegen la cámara", "Compatible con carga inalámbrica"],
    garantia: "30 días", origen: "Hecha para nosotros en Guatemala",
  },
  {
    id: "cargador", nombre: "Cargador rápido 30 W", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", arte: "cargador",
    colores: [{ nombre: "Blanco", hex: "#f2f2f2" }], variantes: [{ precio: 199 }], resumen: "Carga al 50% en 30 minutos.", detalles: ["Puerto USB-C", "Protección contra sobrecarga", "Incluye cable de 1 m"],
    garantia: "6 meses", origen: "Importado",
  },
  {
    id: "audifonos", nombre: "Audífonos inalámbricos", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", arte: "audifonos",
    colores: [{ nombre: "Blanco", hex: "#f2f2f2" }, { nombre: "Negro", hex: "#2a2a2a" }], variantes: [{ precio: 349 }], antes: 449,
    resumen: "Hasta 6 horas de música por carga.", detalles: ["Estuche con 24 horas extra", "Cancelación de ruido", "Bluetooth 5.3"],
    garantia: "6 meses", origen: "Importado", etiqueta: "Oferta",
  },
  {
    id: "powerbank", nombre: "Batería portátil 10,000 mAh", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", arte: "bateria",
    colores: [{ nombre: "Gris", hex: "#8a8f98" }], variantes: [{ precio: 249 }], resumen: "Dos cargas completas a su celular.", detalles: ["Entrada y salida USB-C", "Pantalla de carga", "Cabe en la bolsa"],
    garantia: "6 meses", origen: "Importado",
  },
  {
    id: "reloj", nombre: "Reloj inteligente", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", arte: "reloj",
    colores: [{ nombre: "Negro", hex: "#2a2a2a" }, { nombre: "Rosado", hex: "#e6b7b9" }], variantes: [{ precio: 599 }],
    resumen: "Pasos, ritmo cardíaco y notificaciones.", detalles: ["Batería de 7 días", "Resistente al agua", "Funciona con Android y iPhone"],
    garantia: "6 meses", origen: "Importado",
  },
];
export const productoPor = (id: string) => PRODUCTOS.find((p) => p.id === id)!;

export const SUCURSALES = [
  { id: "z10", nombre: "Zona 10", direccion: "Centro comercial de ejemplo, local 12", horario: "Lun a sáb 10:00 a 20:00" },
  { id: "mix", nombre: "Mixco", direccion: "Calzada de ejemplo, local 4", horario: "Lun a sáb 9:00 a 19:00" },
  { id: "xela", nombre: "Quetzaltenango", direccion: "Plaza de ejemplo, local 8", horario: "Lun a sáb 9:00 a 18:00" },
];
export const sucursalPor = (id: string) => SUCURSALES.find((s) => s.id === id)!;

/* reparaciones: precio según la falla y la gama del teléfono */
export const FALLAS = [
  { id: "pantalla", nombre: "Pantalla rota", tiempo: "2 a 3 horas", precio: { alta: 1450, media: 750, basica: 450 } },
  { id: "bateria", nombre: "Batería que no dura", tiempo: "1 hora", precio: { alta: 650, media: 400, basica: 275 } },
  { id: "puerto", nombre: "No carga", tiempo: "1 a 2 horas", precio: { alta: 450, media: 300, basica: 200 } },
  { id: "camara", nombre: "Cámara dañada", tiempo: "2 horas", precio: { alta: 900, media: 550, basica: 350 } },
  { id: "agua", nombre: "Se mojó", tiempo: "24 a 48 horas", precio: { alta: 500, media: 400, basica: 300 } },
];
export const MODELOS_REPARACION = [
  { nombre: "iPhone 13 a 15", gama: "alta" as const },
  { nombre: "iPhone 11 o 12", gama: "media" as const },
  { nombre: "Samsung Galaxy S", gama: "alta" as const },
  { nombre: "Samsung Galaxy A", gama: "media" as const },
  { nombre: "Xiaomi o Motorola", gama: "basica" as const },
];

/* ---------- estado compartido: pedidos, devoluciones, reparaciones, stock ---------- */

export type EstadoPedido = "pago-pendiente" | "pagado" | "preparando" | "en-camino" | "entregado" | "rechazado" | "devuelto";
export type Metodo = "tarjeta" | "transferencia";
export type Linea = { id: string; nombre: string; detalle: string; precio: number; cantidad: number };
export type Pedido = {
  id: string;
  fecha: string; // iso
  cliente: string;
  telefono: string;
  entrega: { tipo: "envio"; direccion: string } | { tipo: "tienda"; sucursal: string };
  lineas: Linea[];
  envio: number;
  total: number;
  metodo: Metodo;
  tarjeta?: string; // últimos 4
  cuotas?: number;
  estado: EstadoPedido;
  motivoRechazo?: string;
  guia?: string;
  sucursal: string; // para reportes de ventas por punto de venta
  nuevo?: boolean;
};
export type Devolucion = { id: string; pedido: string; motivo: string; detalle: string; fecha: string; estado: "pendiente" | "aprobada" | "rechazada"; nueva?: boolean };
export type Reparacion = { id: string; cliente: string; modelo: string; falla: string; precio: number; fecha: string; estado: "recibido" | "diagnostico" | "reparando" | "listo" | "entregado"; sucursal: string; nueva?: boolean };
export type Stock = Record<string, Record<string, number>>; // producto -> sucursal -> unidades

export const ESTADOS_PEDIDO: Record<EstadoPedido, { texto: string; color: string; fondo: string }> = {
  "pago-pendiente": { texto: "Verificando pago", color: "#8a4b00", fondo: "#fff1d6" },
  pagado: { texto: "Pagado", color: "#1d4fd0", fondo: "#e3ebff" },
  preparando: { texto: "Preparando", color: "#5a3fc0", fondo: "#ece6ff" },
  "en-camino": { texto: "En camino", color: "#0f6e6a", fondo: "#dcf3f1" },
  entregado: { texto: "Entregado", color: "#1f7a3a", fondo: "#e1f5e6" },
  rechazado: { texto: "Pago rechazado", color: "#b42318", fondo: "#fde4e1" },
  devuelto: { texto: "Devuelto", color: "#5b5f66", fondo: "#eceef1" },
};
export const PASOS_RASTREO: EstadoPedido[] = ["pagado", "preparando", "en-camino", "entregado"];
export const PASOS_REPARACION: Reparacion["estado"][] = ["recibido", "diagnostico", "reparando", "listo", "entregado"];
export const TEXTO_REPARACION: Record<Reparacion["estado"], string> = {
  recibido: "Recibido",
  diagnostico: "En diagnóstico",
  reparando: "Reparando",
  listo: "Listo para recoger",
  entregado: "Entregado",
};

const hace = (dias: number, horas = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  d.setHours(horas, 15, 0, 0);
  return d.toISOString();
};

function pedidosEjemplo(): Pedido[] {
  const p = (id: string, dias: number, cliente: string, prod: string, cap: number, metodo: Metodo, estado: EstadoPedido, sucursal: string, extra: Partial<Pedido> = {}): Pedido => {
    const pr = productoPor(prod);
    const v = pr.variantes[cap];
    return {
      id, fecha: hace(dias, 9 + (dias % 8)), cliente, telefono: "5555 0000", entrega: { tipo: "envio", direccion: "Ciudad de Guatemala" },
      lineas: [{ id: pr.id, nombre: pr.nombre, detalle: [v.capacidad, pr.colores[0].nombre].filter(Boolean).join(" · "), precio: v.precio, cantidad: 1 }],
      envio: 0, total: v.precio, metodo, tarjeta: metodo === "tarjeta" ? "4242" : undefined, estado, sucursal, ...extra,
    };
  };
  return [
    p("OR-1041", 0, "Daniela Pérez", "ip15", 0, "transferencia", "pago-pendiente", "z10"),
    p("OR-1040", 0, "Carlos Méndez", "a55", 1, "tarjeta", "pagado", "mix"),
    p("OR-1039", 0, "Lucía Ramírez", "funda", 0, "tarjeta", "rechazado", "z10", { motivoRechazo: "Fondos insuficientes", tarjeta: "0002" }),
    p("OR-1038", 1, "Jorge Ortiz", "s24", 0, "tarjeta", "en-camino", "z10", { guia: "GT-558201" }),
    p("OR-1037", 1, "Sofía Hernández", "redmi", 0, "transferencia", "preparando", "xela"),
    p("OR-1036", 2, "Andrea Castillo", "ip13", 0, "tarjeta", "entregado", "mix"),
    p("OR-1035", 3, "Kevin Orellana", "audifonos", 0, "tarjeta", "entregado", "z10"),
    p("OR-1034", 4, "Gabriela Cruz", "ip15", 1, "tarjeta", "entregado", "z10"),
    p("OR-1033", 5, "Pedro Juárez", "moto", 0, "transferencia", "devuelto", "xela"),
    p("OR-1032", 6, "Valeria Chávez", "a55", 0, "tarjeta", "entregado", "mix"),
  ];
}

const STOCK_INICIAL: Stock = {
  ip15: { z10: 6, mix: 2, xela: 1 },
  ip13: { z10: 3, mix: 1, xela: 0 },
  s24: { z10: 4, mix: 2, xela: 2 },
  a55: { z10: 9, mix: 7, xela: 5 },
  redmi: { z10: 12, mix: 10, xela: 8 },
  moto: { z10: 1, mix: 0, xela: 1 },
  funda: { z10: 40, mix: 25, xela: 18 },
  cargador: { z10: 22, mix: 15, xela: 9 },
  audifonos: { z10: 3, mix: 2, xela: 0 },
  powerbank: { z10: 14, mix: 8, xela: 6 },
  reloj: { z10: 5, mix: 2, xela: 2 },
};

const DEVOLUCIONES_EJEMPLO: Devolucion[] = [
  { id: "DV-208", pedido: "OR-1033", motivo: "No era lo que esperaba", detalle: "El color no era como en la foto.", fecha: hace(4), estado: "aprobada" },
  { id: "DV-209", pedido: "OR-1035", motivo: "Llegó con falla", detalle: "El audífono izquierdo no carga.", fecha: hace(1), estado: "pendiente" },
];
const REPARACIONES_EJEMPLO: Reparacion[] = [
  { id: "RP-512", cliente: "Mario Solís", modelo: "iPhone 11 o 12", falla: "Pantalla rota", precio: 750, fecha: hace(0, 9), estado: "reparando", sucursal: "z10" },
  { id: "RP-511", cliente: "Ana Barrios", modelo: "Samsung Galaxy A", falla: "Batería que no dura", precio: 400, fecha: hace(0, 8), estado: "listo", sucursal: "mix" },
  { id: "RP-510", cliente: "Luis Pineda", modelo: "Xiaomi o Motorola", falla: "Se mojó", precio: 300, fecha: hace(1), estado: "diagnostico", sucursal: "xela" },
];

function useGuardado<T>(clave: string, inicial: () => T) {
  const [v, setV] = useState<T>(() => {
    try {
      const x = localStorage.getItem(clave);
      return x ? (JSON.parse(x) as T) : inicial();
    } catch {
      return inicial();
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(v));
    } catch {
      /* modo privado */
    }
  }, [clave, v]);
  return [v, setV] as const;
}

export function useTienda() {
  const [pedidos, setPedidos] = useGuardado("orbita-pedidos-v1", pedidosEjemplo);
  const [devoluciones, setDevoluciones] = useGuardado("orbita-devoluciones-v1", () => DEVOLUCIONES_EJEMPLO);
  const [reparaciones, setReparaciones] = useGuardado("orbita-reparaciones-v1", () => REPARACIONES_EJEMPLO);
  const [stock, setStock] = useGuardado("orbita-stock-v1", () => STOCK_INICIAL);
  const reiniciar = () => {
    setPedidos(pedidosEjemplo());
    setDevoluciones(DEVOLUCIONES_EJEMPLO);
    setReparaciones(REPARACIONES_EJEMPLO);
    setStock(STOCK_INICIAL);
  };
  return { pedidos, setPedidos, devoluciones, setDevoluciones, reparaciones, setReparaciones, stock, setStock, reiniciar };
}
export type Tienda = ReturnType<typeof useTienda>;

/* lo que ve el cliente: solo si hay, pocas o agotado; nunca el número */
export function disponibilidad(stock: Stock, id: string) {
  const total = Object.values(stock[id] ?? {}).reduce((s, n) => s + n, 0);
  if (total === 0) return { texto: "Agotado", tipo: "agotado" as const, total };
  if (total <= 3) return { texto: "Pocas unidades", tipo: "pocas" as const, total };
  return { texto: "Disponible", tipo: "hay" as const, total };
}

export const fechaCorta = (iso: string) => {
  const d = new Date(iso);
  const hoy = new Date();
  const dias = Math.round((new Date(hoy.toDateString()).getTime() - new Date(d.toDateString()).getTime()) / 86400000);
  const hora = d.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" });
  return dias === 0 ? `Hoy, ${hora}` : dias === 1 ? `Ayer, ${hora}` : d.toLocaleDateString("es-GT", { day: "numeric", month: "short" });
};
