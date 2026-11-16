/*
 * Datos de ejemplo de "Órbita Celulares" (tienda inventada). Los pedidos,
 * devoluciones, reparaciones y el stock viven en el navegador (localStorage)
 * para que lo que haga el cliente aparezca en el panel del dueño.
 */
import { useEffect, useState } from "react";
import ip17promaxImg from "@/assets/demo-celulares/ip17promax.jpg";
import ip17proImg from "@/assets/demo-celulares/ip17pro.jpg";
import ipairImg from "@/assets/demo-celulares/ipair.jpg";
import ip17Img from "@/assets/demo-celulares/ip17.jpg";
import s26ultraImg from "@/assets/demo-celulares/s26ultra.jpg";
import s26Img from "@/assets/demo-celulares/s26.jpg";
import ip15proImg from "@/assets/demo-celulares/ip15pro.jpg";
import s24ultraImg from "@/assets/demo-celulares/s24ultra.jpg";
import ip13Img from "@/assets/demo-celulares/ip13.jpg";
import pixel9Img from "@/assets/demo-celulares/pixel9.jpg";
import ipadproImg from "@/assets/demo-celulares/ipadpro.jpg";
import ipadairImg from "@/assets/demo-celulares/ipadair.jpg";
import ipadminiImg from "@/assets/demo-celulares/ipadmini.jpg";
import galaxytabImg from "@/assets/demo-celulares/galaxytab.jpg";
import macbookairImg from "@/assets/demo-celulares/macbookair.jpg";
import macbookproImg from "@/assets/demo-celulares/macbookpro.jpg";
import dellImg from "@/assets/demo-celulares/dell.jpg";
import airpodsImg from "@/assets/demo-celulares/airpods.jpg";
import audifonosImg from "@/assets/demo-celulares/audifonos.jpg";
import cargadorImg from "@/assets/demo-celulares/cargador.jpg";
import cableImg from "@/assets/demo-celulares/cable.jpg";
import fundasImg from "@/assets/demo-celulares/fundas-magsafe.jpg";
import bateriaImg from "@/assets/demo-celulares/bateria.jpg";
import relojImg from "@/assets/demo-celulares/reloj.jpg";

/* morado de marca, como lo usan las tiendas de celulares de aquí */
export const TINTA = "#1c1230";
export const PRIMARIO = "#6d28d9";
export const LAVANDA = "#f1eaff";
export const AMARILLO = "#ffd23f";
export const FONDO = "#f6f4fa";
/* letra del sistema para el panel: la del celular o la compu de cada quien */
export const LETRA_SISTEMA = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/* precio en efectivo o transferencia (como "Oferta efectivo" vs "Precio normal Visacuotas") */
export const efectivo = (precio: number) => Math.max(1, Math.round((precio * 0.9) / 10) * 10 - 1);
export const TITULO = "var(--font-titulo)";


export type Condicion = "Nuevo" | "Seminuevo";
export type Categoria = "Celulares" | "Tablets" | "Laptops" | "Accesorios";
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
  visible?: boolean;
};

/* cada foto es del modelo real que dice el nombre */
export const PRODUCTOS: Producto[] = [
  {
    id: "ip17promax", nombre: "iPhone 17 Pro Max", marca: "Apple", categoria: "Celulares", condicion: "Nuevo", foto: ip17promaxImg,
    colores: [{ nombre: "Naranja cósmico", hex: "#e07a3a" }], variantes: [{ capacidad: "256 GB", precio: 13999 }, { capacidad: "512 GB", precio: 15999 }], etiqueta: "Nuevo en tienda",
    resumen: "Sellado, con factura y 1 año de garantía.", detalles: ["La pantalla más grande de iPhone", "Tres cámaras de 48 MP", "Batería para todo el día", "Puerto USB-C"],
    garantia: "1 año con nosotros", origen: "Distribuidor autorizado en Miami",
  },
  {
    id: "ip17pro", nombre: "iPhone 17 Pro", marca: "Apple", categoria: "Celulares", condicion: "Nuevo", foto: ip17Img,
    colores: [{ nombre: "Azul profundo", hex: "#2c3550" }], variantes: [{ capacidad: "256 GB", precio: 12499 }, { capacidad: "512 GB", precio: 14499 }], etiqueta: "Más vendido",
    resumen: "Sellado, con factura y 1 año de garantía.", detalles: ["Pantalla de 6.3\"", "Tres cámaras de 48 MP", "Aluminio", "Puerto USB-C"],
    garantia: "1 año con nosotros", origen: "Distribuidor autorizado en Miami",
  },
  {
    id: "ipair", nombre: "iPhone Air", marca: "Apple", categoria: "Celulares", condicion: "Nuevo", foto: ipairImg,
    colores: [{ nombre: "Negro espacial", hex: "#2b2b2d" }], variantes: [{ capacidad: "256 GB", precio: 10999 }],
    resumen: "El iPhone más delgado. Sellado.", detalles: ["Pantalla de 6.5\"", "Diseño ultradelgado", "Cámara de 48 MP", "Solo eSIM"],
    garantia: "1 año con nosotros", origen: "Distribuidor autorizado en Miami",
  },
  {
    id: "s26ultra", nombre: "Galaxy S26 Ultra", marca: "Samsung", categoria: "Celulares", condicion: "Nuevo", foto: s26ultraImg,
    colores: [{ nombre: "Violeta", hex: "#6b6fa6" }], variantes: [{ capacidad: "256 GB", precio: 11499 }, { capacidad: "512 GB", precio: 12999 }], etiqueta: "Nuevo en tienda",
    resumen: "Lo más nuevo de Samsung. Liberado.", detalles: ["Pantalla grande y brillante", "Cámara con zoom", "Lápiz S Pen", "Batería para todo el día"],
    garantia: "1 año con nosotros", origen: "Importado de Panamá, liberado",
  },
  {
    id: "s26", nombre: "Galaxy S26", marca: "Samsung", categoria: "Celulares", condicion: "Nuevo", foto: s26Img,
    colores: [{ nombre: "Azul", hex: "#7f9fd6" }], variantes: [{ capacidad: "256 GB", precio: 7299 }],
    resumen: "Compacto, potente y liberado.", detalles: ["Pantalla compacta", "Tres cámaras", "Carga rápida", "Liberado"],
    garantia: "1 año con nosotros", origen: "Importado de Panamá, liberado",
  },
  {
    id: "ip15pro", nombre: "iPhone 15 Pro", marca: "Apple", categoria: "Celulares", condicion: "Seminuevo", foto: ip15proImg,
    colores: [{ nombre: "Titanio azul", hex: "#3d4a5c" }], variantes: [{ capacidad: "128 GB", precio: 6499 }, { capacidad: "256 GB", precio: 6999 }], antes: 7499, etiqueta: "Seminuevo certificado",
    resumen: "Batería arriba de 90% y revisión de 30 puntos.", detalles: ["Titanio", "Cámara de 48 MP con zoom 3x", "Batería 90% o más", "Incluye cable"],
    garantia: "6 meses con nosotros", origen: "Equipos de primera mano de EE. UU., revisados aquí",
  },
  {
    id: "s24ultra", nombre: "Galaxy S24 Ultra", marca: "Samsung", categoria: "Celulares", condicion: "Seminuevo", foto: s24ultraImg,
    colores: [{ nombre: "Titanio gris", hex: "#8f8a80" }], variantes: [{ capacidad: "256 GB", precio: 6499 }], antes: 7499,
    resumen: "Con su S Pen. Revisado y como nuevo.", detalles: ["Cámara de 200 MP", "Zoom óptico 5x", "Lápiz S Pen incluido", "Batería 92%"],
    garantia: "6 meses con nosotros", origen: "Recibido en canje, revisado aquí",
  },
  {
    id: "pixel9", nombre: "Pixel 9 Pro", marca: "Google", categoria: "Celulares", condicion: "Seminuevo", foto: pixel9Img,
    colores: [{ nombre: "Porcelana", hex: "#ece8e1" }], variantes: [{ capacidad: "128 GB", precio: 5799 }], antes: 6600,
    resumen: "Como nuevo, con su caja. Batería 95%.", detalles: ["Pantalla de 6.3\"", "La mejor cámara para fotos de noche", "16 GB de RAM", "7 años de actualizaciones"],
    garantia: "6 meses con nosotros", origen: "Recibido en canje, revisado aquí",
  },
  {
    id: "ip13", nombre: "iPhone 13", marca: "Apple", categoria: "Celulares", condicion: "Seminuevo", foto: ip13Img,
    colores: [{ nombre: "Verde", hex: "#3b5a46" }], variantes: [{ capacidad: "128 GB", precio: 3699 }, { capacidad: "256 GB", precio: 4199 }], antes: 4299, etiqueta: "Oferta",
    resumen: "Batería arriba de 88% y revisión de 30 puntos.", detalles: ["Pantalla de 6.1\"", "Batería 88% o más", "Sin golpes ni rayones", "Incluye cable"],
    garantia: "6 meses con nosotros", origen: "Equipos de primera mano de EE. UU., revisados aquí",
  },
  {
    id: "ipadpro", nombre: "iPad Pro 11\"", marca: "Apple", categoria: "Tablets", condicion: "Nuevo", foto: ipadproImg,
    colores: [{ nombre: "Gris espacial", hex: "#5d6066" }], variantes: [{ capacidad: "256 GB", precio: 9999 }, { capacidad: "512 GB", precio: 11499 }],
    resumen: "Para dibujar, editar y trabajar.", detalles: ["Pantalla de 11\" a 120 Hz", "Funciona con Apple Pencil", "Face ID", "USB-C"],
    garantia: "1 año con nosotros", origen: "Distribuidor autorizado en Miami",
  },
  {
    id: "ipadair", nombre: "iPad Air", marca: "Apple", categoria: "Tablets", condicion: "Nuevo", foto: ipadairImg,
    colores: [{ nombre: "Azul", hex: "#7fa3c4" }], variantes: [{ capacidad: "128 GB", precio: 5999 }, { capacidad: "256 GB", precio: 6999 }], etiqueta: "Más vendido",
    resumen: "Liviano, rápido y en colores.", detalles: ["Pantalla de 11\"", "Chip M", "Funciona con Apple Pencil", "Touch ID"],
    garantia: "1 año con nosotros", origen: "Distribuidor autorizado en Miami",
  },
  {
    id: "ipadmini", nombre: "iPad mini", marca: "Apple", categoria: "Tablets", condicion: "Nuevo", foto: ipadminiImg,
    colores: [{ nombre: "Gris espacial", hex: "#5d6066" }], variantes: [{ capacidad: "128 GB", precio: 4799 }],
    resumen: "Cabe en una mano. Ideal para leer y tomar notas.", detalles: ["Pantalla de 8.3\"", "Funciona con Apple Pencil", "Liviano", "USB-C"],
    garantia: "1 año con nosotros", origen: "Distribuidor autorizado en Miami",
  },
  {
    id: "galaxytab", nombre: "Galaxy Tab S", marca: "Samsung", categoria: "Tablets", condicion: "Nuevo", foto: galaxytabImg,
    colores: [{ nombre: "Grafito", hex: "#3a3c40" }], variantes: [{ capacidad: "128 GB", precio: 4499 }],
    resumen: "Tablet grande con lápiz incluido.", detalles: ["Pantalla grande AMOLED", "Lápiz S Pen incluido", "Resistente al agua", "Liberada"],
    garantia: "1 año con nosotros", origen: "Importado de Panamá, liberado",
  },
  {
    id: "macbookair", nombre: "MacBook Air M4 13\"", marca: "Apple", categoria: "Laptops", condicion: "Nuevo", foto: macbookairImg,
    colores: [{ nombre: "Azul cielo", hex: "#a9c8e6" }], variantes: [{ capacidad: "256 GB", precio: 9499 }, { capacidad: "512 GB", precio: 10999 }], etiqueta: "Nuevo en tienda",
    resumen: "Liviana, silenciosa y con batería de todo el día.", detalles: ["Chip M4", "16 GB de memoria", "Hasta 18 horas de batería", "Teclado en español"],
    garantia: "1 año con nosotros", origen: "Distribuidor autorizado en Miami",
  },
  {
    id: "macbookpro", nombre: "MacBook Pro 14\"", marca: "Apple", categoria: "Laptops", condicion: "Nuevo", foto: macbookproImg,
    colores: [{ nombre: "Gris espacial", hex: "#5d6066" }], variantes: [{ capacidad: "512 GB", precio: 15999 }],
    resumen: "Para diseño, video y programación.", detalles: ["Pantalla Liquid Retina XDR", "Chip M de la serie Pro", "Puertos HDMI y SD", "Teclado en español"],
    garantia: "1 año con nosotros", origen: "Distribuidor autorizado en Miami",
  },
  {
    id: "dell", nombre: "Laptop Dell 14\"", marca: "Dell", categoria: "Laptops", condicion: "Nuevo", foto: dellImg,
    colores: [{ nombre: "Gris", hex: "#5b5f66" }], variantes: [{ capacidad: "512 GB", precio: 5299 }],
    resumen: "Para la oficina y la universidad.", detalles: ["Procesador Intel Core", "16 GB de RAM", "Windows 11", "Teclado en español"],
    garantia: "1 año con nosotros", origen: "Distribuidor regional",
  },
  {
    id: "airpods", nombre: "AirPods Pro (2.ª generación)", marca: "Apple", categoria: "Accesorios", condicion: "Nuevo", foto: airpodsImg,
    colores: [{ nombre: "Blanco", hex: "#f2f2f2" }], variantes: [{ precio: 2199 }],
    resumen: "Cancelación de ruido y estuche USB-C.", detalles: ["Cancelación activa de ruido", "Modo ambiente", "Estuche con carga USB-C", "Sellados"],
    garantia: "1 año con nosotros", origen: "Distribuidor autorizado en Miami",
  },
  {
    id: "audifonos", nombre: "Audífonos inalámbricos", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", foto: audifonosImg,
    colores: [{ nombre: "Negro", hex: "#2a2a2a" }], variantes: [{ precio: 349 }], antes: 449, etiqueta: "Oferta",
    resumen: "Hasta 6 horas de música por carga.", detalles: ["Estuche con 24 horas extra", "Bluetooth 5.3", "Funcionan con Android y iPhone"],
    garantia: "6 meses", origen: "Importado",
  },
  {
    id: "cargador", nombre: "Cargador USB-C 20 W", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", foto: cargadorImg,
    colores: [{ nombre: "Blanco", hex: "#f2f2f2" }], variantes: [{ precio: 199 }],
    resumen: "Carga rápida para iPhone y Android.", detalles: ["Carga al 50% en 30 minutos", "Protección contra sobrecarga", "Enchufe para Guatemala"],
    garantia: "6 meses", origen: "Importado",
  },
  {
    id: "cable", nombre: "Cable USB-C de 1 m", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", foto: cableImg,
    colores: [{ nombre: "Blanco", hex: "#f2f2f2" }], variantes: [{ precio: 89 }],
    resumen: "Resistente, para carga rápida.", detalles: ["Hasta 60 W", "Cubierta reforzada", "Funciona con iPhone 15 en adelante y Android"],
    garantia: "3 meses", origen: "Importado",
  },
  {
    id: "fundas", nombre: "Funda MagSafe para iPhone", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", foto: fundasImg,
    colores: [{ nombre: "Verde", hex: "#6f8f62" }, { nombre: "Celeste", hex: "#8fb3e0" }, { nombre: "Gris", hex: "#5d6066" }, { nombre: "Rojo", hex: "#b23a3a" }, { nombre: "Azul", hex: "#3b4f8f" }], variantes: [{ precio: 179 }],
    resumen: "Imán para cargadores y accesorios MagSafe.", detalles: ["Textura que no resbala", "Protege la cámara", "Para iPhone 13 a 17"],
    garantia: "30 días", origen: "Importado",
  },
  {
    id: "bateria", nombre: "Batería portátil 10,000 mAh", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", foto: bateriaImg,
    colores: [{ nombre: "Verde azulado", hex: "#2f7d7a" }], variantes: [{ precio: 249 }],
    resumen: "Dos cargas completas a su celular.", detalles: ["Entrada y salida USB-C", "Cabe en la bolsa", "Carga dos equipos a la vez"],
    garantia: "6 meses", origen: "Importado",
  },
  {
    id: "reloj", nombre: "Reloj inteligente", marca: "Órbita", categoria: "Accesorios", condicion: "Nuevo", foto: relojImg,
    colores: [{ nombre: "Verde menta", hex: "#cfe3d6" }], variantes: [{ precio: 599 }],
    resumen: "Pasos, ritmo cardíaco y notificaciones.", detalles: ["Batería de 7 días", "Resistente al agua", "Funciona con Android y iPhone"],
    garantia: "6 meses", origen: "Importado",
  },
];
export const FOTO_CELULARES = ip17proImg;
export const productoPor = (id: string) => PRODUCTOS.find((p) => p.id === id)!;
/* busca primero en los productos que el dueño editó */
export const enLista = (lista: Producto[], id: string) => lista.find((p) => p.id === id) ?? productoPor(id);

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
  { nombre: "iPhone 13 a 17", gama: "alta" as const },
  { nombre: "iPhone 11 o 12", gama: "media" as const },
  { nombre: "Samsung Galaxy S", gama: "alta" as const },
  { nombre: "iPad o MacBook", gama: "alta" as const },
  { nombre: "Samsung Galaxy A", gama: "media" as const },
  { nombre: "Xiaomi o Motorola", gama: "basica" as const },
];

/* ---------- estado compartido: pedidos, devoluciones, reparaciones, stock ---------- */

export type EstadoPedido = "pago-pendiente" | "pagado" | "preparando" | "en-camino" | "entregado" | "rechazado" | "devuelto";
export type Metodo = "tarjeta" | "transferencia" | "contra-entrega";
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
export type Reparacion = { id: string; cliente: string; modelo: string; falla: string; precio: number; fecha: string; estado: "recibido" | "diagnostico" | "reparando" | "listo" | "entregado"; sucursal: string; tecnico?: string; nueva?: boolean };
export type Tecnico = { id: string; nombre: string; especialidad: string; sucursal: string; telefono: string; activo: boolean };
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
    p("OR-1041", 0, "Daniela Pérez", "ip17pro", 0, "transferencia", "pago-pendiente", "z10"),
    p("OR-1040", 0, "Carlos Méndez", "s26", 0, "tarjeta", "pagado", "mix"),
    p("OR-1039", 0, "Lucía Ramírez", "fundas", 0, "tarjeta", "rechazado", "z10", { motivoRechazo: "Fondos insuficientes", tarjeta: "0002" }),
    p("OR-1038", 1, "Jorge Ortiz", "s26ultra", 0, "tarjeta", "en-camino", "z10", { guia: "GT-558201" }),
    p("OR-1037", 1, "Sofía Hernández", "pixel9", 0, "transferencia", "preparando", "xela"),
    p("OR-1036", 2, "Andrea Castillo", "ip13", 0, "tarjeta", "entregado", "mix"),
    p("OR-1035", 3, "Kevin Orellana", "ipadair", 0, "tarjeta", "entregado", "z10"),
    p("OR-1034", 4, "Gabriela Cruz", "ip15pro", 1, "tarjeta", "entregado", "z10"),
    p("OR-1033", 5, "Pedro Juárez", "ip13", 0, "transferencia", "devuelto", "xela"),
    p("OR-1032", 6, "Valeria Chávez", "macbookair", 0, "tarjeta", "entregado", "mix"),
  ];
}

const STOCK_INICIAL: Stock = {
  ip17promax: { z10: 8, mix: 4, xela: 2 },
  ip17pro: { z10: 10, mix: 5, xela: 3 },
  ipair: { z10: 4, mix: 2, xela: 1 },
  s26ultra: { z10: 6, mix: 3, xela: 2 },
  s26: { z10: 9, mix: 6, xela: 4 },
  ip15pro: { z10: 3, mix: 1, xela: 1 },
  s24ultra: { z10: 2, mix: 1, xela: 0 },
  pixel9: { z10: 1, mix: 0, xela: 1 },
  ip13: { z10: 5, mix: 3, xela: 2 },
  ipadpro: { z10: 4, mix: 2, xela: 1 },
  ipadair: { z10: 7, mix: 4, xela: 3 },
  ipadmini: { z10: 3, mix: 2, xela: 0 },
  galaxytab: { z10: 5, mix: 3, xela: 2 },
  macbookair: { z10: 6, mix: 3, xela: 1 },
  macbookpro: { z10: 2, mix: 1, xela: 0 },
  dell: { z10: 8, mix: 5, xela: 4 },
  airpods: { z10: 15, mix: 8, xela: 6 },
  audifonos: { z10: 20, mix: 12, xela: 9 },
  cargador: { z10: 45, mix: 30, xela: 22 },
  cable: { z10: 80, mix: 50, xela: 35 },
  fundas: { z10: 60, mix: 40, xela: 25 },
  bateria: { z10: 25, mix: 15, xela: 10 },
  reloj: { z10: 12, mix: 6, xela: 4 },
};

const DEVOLUCIONES_EJEMPLO: Devolucion[] = [
  { id: "DV-208", pedido: "OR-1033", motivo: "No era lo que esperaba", detalle: "El color no era como en la foto.", fecha: hace(4), estado: "aprobada" },
  { id: "DV-209", pedido: "OR-1035", motivo: "Llegó con falla", detalle: "La pantalla tiene un pixel muerto.", fecha: hace(1), estado: "pendiente" },
];
const REPARACIONES_EJEMPLO: Reparacion[] = [
  { id: "RP-512", cliente: "Mario Solís", modelo: "iPhone 11 o 12", falla: "Pantalla rota", precio: 750, fecha: hace(0, 9), estado: "reparando", sucursal: "z10", tecnico: "T1" },
  { id: "RP-511", cliente: "Ana Barrios", modelo: "Samsung Galaxy A", falla: "Batería que no dura", precio: 400, fecha: hace(0, 8), estado: "listo", sucursal: "mix", tecnico: "T3" },
  { id: "RP-510", cliente: "Luis Pineda", modelo: "Xiaomi o Motorola", falla: "Se mojó", precio: 300, fecha: hace(1), estado: "diagnostico", sucursal: "xela" },
];
const TECNICOS_EJEMPLO: Tecnico[] = [
  { id: "T1", nombre: "Byron Gómez", especialidad: "Pantallas y baterías", sucursal: "z10", telefono: "5555 0101", activo: true },
  { id: "T2", nombre: "Erick Ajú", especialidad: "Placas y daños por agua", sucursal: "z10", telefono: "5555 0102", activo: true },
  { id: "T3", nombre: "Mónica Lux", especialidad: "Samsung y Android", sucursal: "mix", telefono: "5555 0103", activo: true },
  { id: "T4", nombre: "José Tzoc", especialidad: "iPad y MacBook", sucursal: "xela", telefono: "5555 0104", activo: false },
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

const productosIniciales = () => PRODUCTOS.map((p) => ({ ...p, visible: true }));

export function useTienda() {
  const [pedidos, setPedidos] = useGuardado("orbita-pedidos-v4", pedidosEjemplo);
  const [devoluciones, setDevoluciones] = useGuardado("orbita-devoluciones-v4", () => DEVOLUCIONES_EJEMPLO);
  const [reparaciones, setReparaciones] = useGuardado("orbita-reparaciones-v4", () => REPARACIONES_EJEMPLO);
  const [stock, setStock] = useGuardado("orbita-stock-v4", () => STOCK_INICIAL);
  const [tecnicos, setTecnicos] = useGuardado("orbita-tecnicos-v4", () => TECNICOS_EJEMPLO);
  const [guardados, setProductos] = useGuardado("orbita-productos-v4", productosIniciales);
  // las fotos de ejemplo se toman siempre del sitio (su dirección cambia al publicar); las que sube el dueño se guardan tal cual
  const productos = guardados.map((p) => {
    const base = PRODUCTOS.find((x) => x.id === p.id);
    return base && !p.foto.startsWith("data:") ? { ...p, foto: base.foto } : p;
  });
  const reiniciar = () => {
    setPedidos(pedidosEjemplo());
    setDevoluciones(DEVOLUCIONES_EJEMPLO);
    setReparaciones(REPARACIONES_EJEMPLO);
    setStock(STOCK_INICIAL);
    setTecnicos(TECNICOS_EJEMPLO);
    setProductos(productosIniciales());
  };
  return { pedidos, setPedidos, devoluciones, setDevoluciones, reparaciones, setReparaciones, stock, setStock, tecnicos, setTecnicos, productos, setProductos, reiniciar };
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
