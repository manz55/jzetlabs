/*
 * Datos de ejemplo de "Órbita Celulares" (tienda inventada). Los pedidos,
 * devoluciones, reparaciones y el stock viven en el navegador (localStorage)
 * para que lo que haga el cliente aparezca en el panel del dueño.
 */
import { useEffect, useState } from "react";
import ip15pro from "@/assets/demo-celulares/ip15pro.jpg";
import ip15 from "@/assets/demo-celulares/ip15.jpg";
import ip13 from "@/assets/demo-celulares/ip13.jpg";
import s24ultra from "@/assets/demo-celulares/s24ultra.jpg";
import s24 from "@/assets/demo-celulares/s24.jpg";
import a55 from "@/assets/demo-celulares/a55.jpg";
import pixel9 from "@/assets/demo-celulares/pixel9.jpg";
import airpods from "@/assets/demo-celulares/airpods.jpg";
import audifonos from "@/assets/demo-celulares/audifonos.jpg";
import cargador from "@/assets/demo-celulares/cargador.jpg";
import cable from "@/assets/demo-celulares/cable.jpg";
import fundas from "@/assets/demo-celulares/fundas-magsafe.jpg";
import bateria from "@/assets/demo-celulares/bateria.jpg";
import reloj from "@/assets/demo-celulares/reloj.jpg";

export const TINTA = "#111318";
export const COBALTO = "#1f4fe0";
export const AMARILLO = "#ffd23f";
export const FONDO = "#f3f3f1";
export const TITULO = "var(--font-titulo)";


export type Condicion = "Nuevo" | "Seminuevo";
export type Categoria = "Celulares" | "Accesorios";
export type Variante = { capacidad?: string; precio: number };
export type Producto = {
  id: string;
  nombre: string;
  marca: string;
  categoria: Categoria;
  condicion: Condicion;
  foto: string;
  colores: { nombre: string; hex: string }[];
  variantes: Variante[];
  antes?: number;
  resumen: string;
  detalles: string[];
  garantia: string;
  origen: string;
  etiqueta?: string;
};

/* cada foto es del modelo real que dice el nombre */
export const PRODUCTOS: Producto[] = [
  {
    id: "ip15pro", nombre: "iPhone 15 Pro", marca: "Apple", categoria: "Celulares", condicion: "Nuevo", foto: ip15pro,
    colores: [{ nombre: "Titanio azul", hex: "#3d4a5c" }],
    variantes: [{ capacidad: "128 GB", precio: 9299 }, { capacidad: "256 GB", precio: 10299 }],
    resumen: "Sellado en su caja, con factura y garantía de 1 año.", detalles: ["Pantalla de 6.1\" a 120 Hz", "Titanio, más liviano", "Cámara de 48 MP con zoom 3x", "Puerto USB-C"],
    garantia: "1 año con nosotros", origen: "Distribuidor autorizado en Miami", etiqueta: "Más vendido",
  },
  {
    id: "ip15", nombre: "iPhone 15", marca: "Apple", categoria: "Celulares", condicion: "Nuevo", foto: ip15,
    colores: [{ nombre: "Azul", hex: "#4b5a78" }],
    variantes: [{ capacidad: "128 GB", precio: 7499 }, { capacidad: "256 GB", precio: 8399 }],
    resumen: "Sellado, con factura y garantía de 1 año.", detalles: ["Pantalla de 6.1\"", "Cámara de 48 MP", "Puerto USB-C", "eSIM y chip físico"],
    garantia: "1 año con nosotros", origen: "Distribuidor autorizado en Miami",
  },
  {
    id: "ip13", nombre: "iPhone 13", marca: "Apple", categoria: "Celulares", condicion: "Seminuevo", foto: ip13,
    colores: [{ nombre: "Verde", hex: "#3b5a46" }],
    variantes: [{ capacidad: "128 GB", precio: 3999 }, { capacidad: "256 GB", precio: 4499 }], antes: 4600,
    resumen: "Batería arriba de 88% y revisión de 30 puntos.", detalles: ["Pantalla de 6.1\"", "Batería 88% o más", "Sin golpes ni rayones", "Incluye cable"],
    garantia: "6 meses con nosotros", origen: "Equipos de primera mano de EE. UU., revisados aquí", etiqueta: "Seminuevo certificado",
  },
  {
    id: "s24ultra", nombre: "Galaxy S24 Ultra", marca: "Samsung", categoria: "Celulares", condicion: "Nuevo", foto: s24ultra,
    colores: [{ nombre: "Titanio gris", hex: "#8f8a80" }],
    variantes: [{ capacidad: "256 GB", precio: 9999 }, { capacidad: "512 GB", precio: 11199 }],
    resumen: "Con su lápiz S Pen. Liberado para cualquier compañía.", detalles: ["Pantalla de 6.8\"", "Cámara de 200 MP", "Zoom óptico 5x", "Lápiz S Pen incluido"],
    garantia: "1 año con nosotros", origen: "Importado de Panamá, liberado", etiqueta: "Nuevo en tienda",
  },
  {
    id: "s24", nombre: "Galaxy S24", marca: "Samsung", categoria: "Celulares", condicion: "Nuevo", foto: s24,
    colores: [{ nombre: "Gris mármol", hex: "#c9cbc8" }],
    variantes: [{ capacidad: "256 GB", precio: 6999 }],
    resumen: "Compacto y potente. Liberado.", detalles: ["Pantalla de 6.2\" a 120 Hz", "Zoom óptico 3x", "8 GB de RAM", "Carga rápida"],
    garantia: "1 año con nosotros", origen: "Importado de Panamá, liberado",
  },
  {
    id: "a55", nombre: "Galaxy A55", marca: "Samsung", categoria: "Celulares", condicion: "Nuevo", foto: a55,
    colores: [{ nombre: "Azul", hex: "#7f9fd6" }],
    variantes: [{ capacidad: "128 GB", precio: 3299 }, { capacidad: "256 GB", precio: 3699 }],
    resumen: "El mejor precio por lo que trae.", detalles: ["Pantalla de 6.6\"", "Batería de 5,000 mAh", "Resistente al agua", "Cámara de 50 MP"],
    garantia: "1 año con nosotros", origen: "Distribuidor regional", etiqueta: "Oferta",
  },
  {
    id: "pixel9", nombre: "Pixel 9 Pro", marca: "Google", categoria: "Celulares", condicion: "Seminuevo", foto: pixel9,
    colores: [{ nombre: "Porcelana", hex: "#ece8e1" }],
    variantes: [{ capacidad: "128 GB", precio: 6299 }], antes: 7200,
    resumen: "Como nuevo, con su caja. Batería 95%.", detalles: ["Pantalla de 6.3\"", "La mejor cámara para fotos de noche", "16 GB de RAM", "7 años de actualizaciones"],
    garantia: "6 meses con nosotros", origen: "Recibido en canje, revisado aquí",
  },
  {
    id: "airpods", nombre: "AirPods Pro (2.ª generación)", marca: "Apple", categoria: "Accesorios", condicion: "Nuevo", foto: airpods,
    colores: [{ nombre: "Blanco", hex: "#f2f2f2" }], variantes: [{ precio: 2199 }],
    resumen: "Cancelación de ruido y estuche USB-C.", detalles: ["Cancelación activa de ruido", "Modo ambiente", "Estuche con carga USB-C", "Sellados"],
    garantia: "1 año con nosotros", origen: "Distribuidor autorizado en Miami",
  },
  {
    id: "audifonos", nombre: "Audífonos inalámbricos", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", foto: audifonos,
    colores: [{ nombre: "Negro", hex: "#2a2a2a" }], variantes: [{ precio: 349 }], antes: 449,
    resumen: "Hasta 6 horas de música por carga.", detalles: ["Estuche con 24 horas extra", "Bluetooth 5.3", "Funcionan con Android y iPhone"],
    garantia: "6 meses", origen: "Importado", etiqueta: "Oferta",
  },
  {
    id: "cargador", nombre: "Cargador USB-C 20 W", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", foto: cargador,
    colores: [{ nombre: "Blanco", hex: "#f2f2f2" }], variantes: [{ precio: 199 }], resumen: "Carga rápida para iPhone y Android.", detalles: ["Carga al 50% en 30 minutos", "Protección contra sobrecarga", "Enchufe para Guatemala"],
    garantia: "6 meses", origen: "Importado",
  },
  {
    id: "cable", nombre: "Cable USB-C de 1 m", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", foto: cable,
    colores: [{ nombre: "Blanco", hex: "#f2f2f2" }], variantes: [{ precio: 89 }], resumen: "Resistente, para carga rápida.", detalles: ["Hasta 60 W", "Cubierta reforzada", "Funciona con iPhone 15 y Android"],
    garantia: "3 meses", origen: "Importado",
  },
  {
    id: "fundas", nombre: "Funda MagSafe para iPhone", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", foto: fundas,
    colores: [{ nombre: "Verde", hex: "#6f8f62" }, { nombre: "Celeste", hex: "#8fb3e0" }, { nombre: "Gris", hex: "#5d6066" }, { nombre: "Rojo", hex: "#b23a3a" }, { nombre: "Azul", hex: "#3b4f8f" }],
    variantes: [{ precio: 179 }], resumen: "Imán para cargadores y accesorios MagSafe.", detalles: ["Textura que no resbala", "Protege la cámara", "Para iPhone 13 a 15"],
    garantia: "30 días", origen: "Importado",
  },
  {
    id: "bateria", nombre: "Batería portátil 10,000 mAh", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", foto: bateria,
    colores: [{ nombre: "Verde azulado", hex: "#2f7d7a" }], variantes: [{ precio: 249 }], resumen: "Dos cargas completas a su celular.", detalles: ["Entrada y salida USB-C", "Cabe en la bolsa", "Carga dos equipos a la vez"],
    garantia: "6 meses", origen: "Importado",
  },
  {
    id: "reloj", nombre: "Reloj inteligente", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", foto: reloj,
    colores: [{ nombre: "Verde menta", hex: "#cfe3d6" }], variantes: [{ precio: 599 }],
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
    p("OR-1039", 0, "Lucía Ramírez", "fundas", 0, "tarjeta", "rechazado", "z10", { motivoRechazo: "Fondos insuficientes", tarjeta: "0002" }),
    p("OR-1038", 1, "Jorge Ortiz", "s24ultra", 0, "tarjeta", "en-camino", "z10", { guia: "GT-558201" }),
    p("OR-1037", 1, "Sofía Hernández", "pixel9", 0, "transferencia", "preparando", "xela"),
    p("OR-1036", 2, "Andrea Castillo", "ip13", 0, "tarjeta", "entregado", "mix"),
    p("OR-1035", 3, "Kevin Orellana", "audifonos", 0, "tarjeta", "entregado", "z10"),
    p("OR-1034", 4, "Gabriela Cruz", "ip15pro", 1, "tarjeta", "entregado", "z10"),
    p("OR-1033", 5, "Pedro Juárez", "ip13", 0, "transferencia", "devuelto", "xela"),
    p("OR-1032", 6, "Valeria Chávez", "a55", 0, "tarjeta", "entregado", "mix"),
  ];
}

const STOCK_INICIAL: Stock = {
  ip15pro: { z10: 5, mix: 2, xela: 1 },
  ip15: { z10: 6, mix: 3, xela: 2 },
  ip13: { z10: 2, mix: 1, xela: 0 },
  s24ultra: { z10: 3, mix: 1, xela: 1 },
  s24: { z10: 4, mix: 2, xela: 2 },
  a55: { z10: 9, mix: 7, xela: 5 },
  pixel9: { z10: 1, mix: 0, xela: 0 },
  airpods: { z10: 6, mix: 3, xela: 2 },
  audifonos: { z10: 3, mix: 2, xela: 0 },
  cargador: { z10: 22, mix: 15, xela: 9 },
  cable: { z10: 40, mix: 25, xela: 18 },
  fundas: { z10: 30, mix: 18, xela: 12 },
  bateria: { z10: 14, mix: 8, xela: 6 },
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
  const [pedidos, setPedidos] = useGuardado("orbita-pedidos-v2", pedidosEjemplo);
  const [devoluciones, setDevoluciones] = useGuardado("orbita-devoluciones-v2", () => DEVOLUCIONES_EJEMPLO);
  const [reparaciones, setReparaciones] = useGuardado("orbita-reparaciones-v2", () => REPARACIONES_EJEMPLO);
  const [stock, setStock] = useGuardado("orbita-stock-v2", () => STOCK_INICIAL);
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
