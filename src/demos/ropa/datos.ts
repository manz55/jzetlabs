/*
 * Datos de la demo "Vértice Studio": catálogo, existencias por talla, la orden en
 * curso y las órdenes recibidas. Tienda, Outfit y Panel leen y escriben aquí mismo,
 * y se guarda en el navegador (también se actualiza entre pestañas).
 * Fotos libres de Unsplash (src/assets/demo-ropa/FUENTES.md).
 */
import { useEffect, useState } from "react";
import cargo from "@/assets/demo-ropa/cargo.jpg";
import mezclilla from "@/assets/demo-ropa/chaqueta-mezclilla.jpg";
import aviador from "@/assets/demo-ropa/chaqueta-oliva.jpg";
import chino from "@/assets/demo-ropa/chino.jpg";
import gorra from "@/assets/demo-ropa/gorra.jpg";
import jeans from "@/assets/demo-ropa/jeans.jpg";
import mochila from "@/assets/demo-ropa/mochila.jpg";
import blanca from "@/assets/demo-ropa/playera-blanca.jpg";
import negra from "@/assets/demo-ropa/playera-negra.jpg";
import top from "@/assets/demo-ropa/top-crudo.jpg";
import tote from "@/assets/demo-ropa/tote.jpg";

export type Talla = "S" | "M" | "L" | "XL" | "U";
export const TALLAS: Talla[] = ["S", "M", "L", "XL"];
export const tallasDe = (p: Producto): Talla[] => (p.categoria === "accesorios" ? ["U"] : TALLAS);
export const nombreTalla = (t: Talla) => (t === "U" ? "Única" : t);

export type Categoria = "tops" | "pantalones" | "chaquetas" | "accesorios";
export type Filtro = "todo" | Exclude<Categoria, "accesorios">;
export const FILTROS: { id: Filtro; nombre: string }[] = [
  { id: "todo", nombre: "Todo" },
  { id: "tops", nombre: "Playeras y Tops" },
  { id: "pantalones", nombre: "Pantalones" },
  { id: "chaquetas", nombre: "Chaquetas" },
];

export type Producto = {
  id: string;
  nombre: string;
  categoria: Categoria;
  precio: number;
  foto: string;
  /** qué parte de la foto se ve al recortar */
  foco: string;
  detalle: string;
};

export const PRODUCTOS: Producto[] = [
  { id: "playera-negra", nombre: "Playera básica negra", categoria: "tops", precio: 129, foto: negra, foco: "50% 40%", detalle: "Algodón, corte recto y cuello redondo." },
  { id: "chaqueta-oliva", nombre: "Chaqueta aviador oliva", categoria: "chaquetas", precio: 449, foto: aviador, foco: "50% 62%", detalle: "Cuello afelpado, zipper y bolsas al frente." },
  { id: "jeans", nombre: "Jeans slim azul", categoria: "pantalones", precio: 299, foto: jeans, foco: "50% 40%", detalle: "Mezclilla con lavado claro, pierna ajustada." },
  { id: "top-crudo", nombre: "Top acanalado crudo", categoria: "tops", precio: 139, foto: top, foco: "50% 35%", detalle: "Tejido acanalado con ruedo asimétrico." },
  { id: "cargo", nombre: "Pantalón cargo oliva", categoria: "pantalones", precio: 329, foto: cargo, foco: "55% 70%", detalle: "Bolsas laterales y tela resistente." },
  { id: "chaqueta-mezclilla", nombre: "Chaqueta de mezclilla", categoria: "chaquetas", precio: 399, foto: mezclilla, foco: "60% 55%", detalle: "Corte clásico con bolsas al pecho." },
  { id: "playera-blanca", nombre: "Playera básica blanca", categoria: "tops", precio: 119, foto: blanca, foco: "50% 40%", detalle: "Algodón, corte recto y cuello redondo." },
  { id: "chino", nombre: "Pantalón chino arena", categoria: "pantalones", precio: 289, foto: chino, foco: "45% 80%", detalle: "Corte recto, para oficina o fin de semana." },
  { id: "gorra", nombre: "Gorra negra plana", categoria: "accesorios", precio: 99, foto: gorra, foco: "65% 60%", detalle: "Visera plana y cierre ajustable." },
  { id: "tote", nombre: "Tote de lona", categoria: "accesorios", precio: 89, foto: tote, foco: "50% 50%", detalle: "Lona cruda con asas reforzadas." },
  { id: "mochila", nombre: "Mochila urbana", categoria: "accesorios", precio: 229, foto: mochila, foco: "50% 50%", detalle: "Compartimiento principal y bolsa frontal." },
];
export const productoDe = (id: string) => PRODUCTOS.find((p) => p.id === id)!;
/** las 8 prendas del catálogo; los accesorios se ofrecen al armar el outfit */
export const CATALOGO = PRODUCTOS.filter((p) => p.categoria !== "accesorios");

/* ---------- reglas de la tienda ---------- */
export const DESCUENTO_OUTFIT = 0.15;
export type Zona = "ciudad" | "departamentos";
export const ENVIOS: Record<Zona, { nombre: string; precio: number; plazo: string }> = {
  ciudad: { nombre: "Ciudad de Guatemala", precio: 30, plazo: "1 a 2 días hábiles" },
  departamentos: { nombre: "Departamentos", precio: 45, plazo: "2 a 4 días hábiles" },
};
export const DEPARTAMENTOS = [
  "Alta Verapaz", "Baja Verapaz", "Chimaltenango", "Chiquimula", "El Progreso", "Escuintla", "Guatemala (fuera de la ciudad)",
  "Huehuetenango", "Izabal", "Jalapa", "Jutiapa", "Petén", "Quetzaltenango", "Quiché", "Retalhuleu", "Sacatepéquez",
  "San Marcos", "Santa Rosa", "Sololá", "Suchitepéquez", "Totonicapán", "Zacapa",
];
export const PAGOS = ["Contra entrega", "Transferencia bancaria"];
export const HORARIO = "Lunes a sábado, de 9:00 a 18:00";

const redondear = (n: number) => Math.round(n * 100) / 100;
export const qz = (n: number) => `Q${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
/** para las cifras animadas, que cuentan en centavos enteros */
export const enCentavos = (c: number) => qz(c / 100);

/* ---------- estado ---------- */
export type Pieza = { id: string; talla: Talla };
export type Linea = Pieza & { cantidad: number };
export type Combo = { clave: string; piezas: Pieza[]; cantidad: number };
export type Cliente = { nombre: string; telefono: string; zona: Zona; departamento: string; direccion: string; pago: string };
export type EstadoOrden = "nueva" | "confirmada" | "enviada" | "entregada" | "cancelada";
export type ItemOrden = Pieza & { nombre: string; cantidad: number; precio: number; outfit: boolean };
export type Orden = {
  numero: string;
  fecha: number;
  estado: EstadoOrden;
  items: ItemOrden[];
  subtotal: number;
  descuento: number;
  envio: number;
  total: number;
  cliente: Cliente;
};
type Existencias = Record<string, Partial<Record<Talla, number>>>;
export type Estado = {
  precios: Record<string, number>;
  stock: Existencias;
  lineas: Linea[];
  combos: Combo[];
  datos: Cliente;
  ordenes: Orden[];
  siguiente: number;
};

export const SIGUIENTE_ESTADO: Partial<Record<EstadoOrden, { a: EstadoOrden; accion: string }>> = {
  nueva: { a: "confirmada", accion: "Confirmar orden" },
  confirmada: { a: "enviada", accion: "Marcar como enviada" },
  enviada: { a: "entregada", accion: "Marcar como entregada" },
};
export const NOMBRE_ESTADO: Record<EstadoOrden, string> = {
  nueva: "Nueva", confirmada: "Confirmada", enviada: "Enviada", entregada: "Entregada", cancelada: "Cancelada",
};

const DATOS_VACIOS: Cliente = { nombre: "", telefono: "", zona: "ciudad", departamento: "", direccion: "", pago: PAGOS[0] };

const STOCK_INICIAL: Existencias = {
  "playera-negra": { S: 8, M: 12, L: 7, XL: 3 },
  "chaqueta-oliva": { S: 2, M: 4, L: 3, XL: 0 },
  jeans: { S: 5, M: 9, L: 6, XL: 2 },
  "top-crudo": { S: 6, M: 5, L: 2, XL: 0 },
  cargo: { S: 4, M: 7, L: 5, XL: 3 },
  "chaqueta-mezclilla": { S: 0, M: 3, L: 4, XL: 2 },
  "playera-blanca": { S: 10, M: 11, L: 8, XL: 4 },
  chino: { S: 3, M: 6, L: 4, XL: 1 },
  gorra: { U: 14 },
  tote: { U: 18 },
  mochila: { U: 6 },
};

const item = (id: string, talla: Talla, cantidad = 1, outfit = false): ItemOrden => {
  const p = productoDe(id);
  return { id, talla, cantidad, outfit, nombre: p.nombre, precio: p.precio };
};

function armarOrden(numero: string, fecha: number, estado: EstadoOrden, items: ItemOrden[], cliente: Cliente): Orden {
  const subtotal = redondear(items.reduce((s, i) => s + i.precio * i.cantidad, 0));
  const descuento = redondear(items.reduce((s, i) => s + (i.outfit ? i.precio * i.cantidad * DESCUENTO_OUTFIT : 0), 0));
  const envio = ENVIOS[cliente.zona].precio;
  return { numero, fecha, estado, items, subtotal, descuento, envio, total: redondear(subtotal - descuento + envio), cliente };
}

function inicial(): Estado {
  const hace = (horas: number) => Date.now() - horas * 3_600_000;
  return {
    precios: Object.fromEntries(PRODUCTOS.map((p) => [p.id, p.precio])),
    stock: structuredClone(STOCK_INICIAL),
    lineas: [],
    combos: [],
    datos: DATOS_VACIOS,
    ordenes: [
      armarOrden("VS-1042", hace(2), "nueva", [item("cargo", "M", 1, true), item("playera-negra", "M", 1, true), item("gorra", "U", 1, true)], {
        nombre: "Andrea Morales", telefono: "5512 8840", zona: "ciudad", departamento: "", direccion: "12 calle 4-51, zona 10", pago: "Contra entrega",
      }),
      armarOrden("VS-1041", hace(9), "confirmada", [item("chaqueta-mezclilla", "L"), item("playera-blanca", "L", 2)], {
        nombre: "Diego Pérez", telefono: "4478 2093", zona: "departamentos", departamento: "Quetzaltenango", direccion: "4a avenida 9-20, zona 3", pago: "Transferencia bancaria",
      }),
      armarOrden("VS-1040", hace(28), "enviada", [item("jeans", "S"), item("top-crudo", "S")], {
        nombre: "Paola Sierra", telefono: "3021 7765", zona: "ciudad", departamento: "", direccion: "Calzada San Juan 14-06, zona 7", pago: "Contra entrega",
      }),
    ],
    siguiente: 1043,
  };
}

/* ---------- cuentas ---------- */
export const unidadesEnOrden = (e: Estado) =>
  e.lineas.reduce((s, l) => s + l.cantidad, 0) + e.combos.reduce((s, c) => s + c.cantidad * c.piezas.length, 0);

export const apartadas = (e: Estado, id: string, talla: Talla) =>
  e.lineas.reduce((s, l) => s + (l.id === id && l.talla === talla ? l.cantidad : 0), 0) +
  e.combos.reduce((s, c) => s + c.cantidad * c.piezas.filter((p) => p.id === id && p.talla === talla).length, 0);

export const existencia = (e: Estado, id: string, talla: Talla) => e.stock[id]?.[talla] ?? 0;
/** lo que todavía se puede agregar */
export const libres = (e: Estado, id: string, talla: Talla) => Math.max(0, existencia(e, id, talla) - apartadas(e, id, talla));
/** la orden pide más de lo que hay (por ejemplo, si el panel bajó la existencia) */
export const sinCupo = (e: Estado, p: Pieza) => apartadas(e, p.id, p.talla) > existencia(e, p.id, p.talla);

export const precioCombo = (e: Estado, piezas: Pieza[]) => {
  const antes = redondear(piezas.reduce((s, p) => s + e.precios[p.id], 0));
  const ahorro = redondear(antes * DESCUENTO_OUTFIT);
  return { antes, ahorro, ahora: redondear(antes - ahorro) };
};

export function totalesDe(e: Estado) {
  let subtotal = e.lineas.reduce((s, l) => s + e.precios[l.id] * l.cantidad, 0);
  let descuento = 0;
  for (const c of e.combos) {
    const p = precioCombo(e, c.piezas);
    subtotal += p.antes * c.cantidad;
    descuento += p.ahorro * c.cantidad;
  }
  const envio = unidadesEnOrden(e) ? ENVIOS[e.datos.zona].precio : 0;
  return { subtotal: redondear(subtotal), descuento: redondear(descuento), envio, total: redondear(subtotal - descuento + envio) };
}

export function textoDeOrden(o: Orden) {
  const c = o.cliente;
  const lugar = c.zona === "ciudad" ? ENVIOS.ciudad.nombre : c.departamento;
  return [
    `Hola, Vértice Studio. Esta es mi orden ${o.numero}:`,
    ...o.items.map((i) => `- ${i.cantidad} × ${i.nombre}, talla ${nombreTalla(i.talla)}${i.outfit ? " (outfit)" : ""}: ${qz(i.precio * i.cantidad)}`),
    `Subtotal: ${qz(o.subtotal)}`,
    ...(o.descuento ? [`Descuento de outfit: -${qz(o.descuento)}`] : []),
    `Envío a ${lugar}: ${qz(o.envio)}`,
    `Total: ${qz(o.total)}`,
    "",
    `Nombre: ${c.nombre}`,
    `Teléfono: ${c.telefono}`,
    `Dirección: ${c.direccion}`,
    `Pago: ${c.pago}`,
  ].join("\n");
}

/* ---------- guardado ---------- */
const CLAVE = "demo-vertice-v1";

function leerGuardado(texto: string | null): Estado | null {
  if (!texto) return null;
  try {
    const g = JSON.parse(texto) as Estado;
    const completo = PRODUCTOS.every((p) => g.stock?.[p.id] && typeof g.precios?.[p.id] === "number");
    if (!completo || !Array.isArray(g.lineas) || !Array.isArray(g.combos) || !Array.isArray(g.ordenes) || !g.datos) return null;
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

export function useVertice() {
  const [estado, setEstado] = useState<Estado>(leer);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {
      /* sin espacio o en modo privado: sigue funcionando sin guardar */
    }
  }, [estado]);

  useEffect(() => {
    const llega = (ev: StorageEvent) => {
      if (ev.key !== CLAVE) return;
      const nuevo = leerGuardado(ev.newValue);
      if (nuevo) setEstado(nuevo);
    };
    addEventListener("storage", llega);
    return () => removeEventListener("storage", llega);
  }, []);

  const agregar = (id: string, talla: Talla) =>
    setEstado((e) => {
      if (libres(e, id, talla) < 1) return e;
      const hay = e.lineas.some((l) => l.id === id && l.talla === talla);
      const lineas = hay
        ? e.lineas.map((l) => (l.id === id && l.talla === talla ? { ...l, cantidad: l.cantidad + 1 } : l))
        : [...e.lineas, { id, talla, cantidad: 1 }];
      return { ...e, lineas };
    });

  /** cambia una línea; subir solo si queda existencia, 0 la quita */
  const ponerLinea = (id: string, talla: Talla, cantidad: number) =>
    setEstado((e) => {
      const actual = e.lineas.find((l) => l.id === id && l.talla === talla);
      if (!actual || (cantidad > actual.cantidad && libres(e, id, talla) < cantidad - actual.cantidad)) return e;
      const lineas = cantidad < 1 ? e.lineas.filter((l) => l !== actual) : e.lineas.map((l) => (l === actual ? { ...l, cantidad } : l));
      return { ...e, lineas };
    });

  const agregarCombo = (piezas: Pieza[]) =>
    setEstado((e) => {
      if (piezas.some((p) => libres(e, p.id, p.talla) < 1)) return e;
      const clave = piezas.map((p) => `${p.id}.${p.talla}`).join("+");
      const combos = e.combos.some((c) => c.clave === clave)
        ? e.combos.map((c) => (c.clave === clave ? { ...c, cantidad: c.cantidad + 1 } : c))
        : [...e.combos, { clave, piezas, cantidad: 1 }];
      return { ...e, combos };
    });

  const ponerCombo = (clave: string, cantidad: number) =>
    setEstado((e) => {
      const actual = e.combos.find((c) => c.clave === clave);
      if (!actual || (cantidad > actual.cantidad && actual.piezas.some((p) => libres(e, p.id, p.talla) < 1))) return e;
      const combos = cantidad < 1 ? e.combos.filter((c) => c !== actual) : e.combos.map((c) => (c === actual ? { ...c, cantidad } : c));
      return { ...e, combos };
    });

  const ponerDatos = (cambio: Partial<Cliente>) => setEstado((e) => ({ ...e, datos: { ...e.datos, ...cambio } }));

  /** registra la orden en curso, aparta las existencias y deja la bandeja vacía */
  const registrar = (): Orden | null => {
    const e = estado;
    const piezas: Pieza[] = [...e.lineas, ...e.combos.flatMap((c) => c.piezas)];
    if (!piezas.length || piezas.some((p) => sinCupo(e, p))) return null;
    const detalle = (p: Pieza, cantidad: number, outfit: boolean): ItemOrden => ({
      id: p.id, talla: p.talla, cantidad, outfit, nombre: productoDe(p.id).nombre, precio: e.precios[p.id],
    });
    const items = [...e.combos.flatMap((c) => c.piezas.map((p) => detalle(p, c.cantidad, true))), ...e.lineas.map((l) => detalle(l, l.cantidad, false))];
    const t = totalesDe(e);
    const cliente: Cliente = { ...e.datos, nombre: e.datos.nombre.trim(), telefono: e.datos.telefono.trim(), direccion: e.datos.direccion.trim() };
    const orden: Orden = { numero: `VS-${e.siguiente}`, fecha: Date.now(), estado: "nueva", items, ...t, cliente };
    const stock = structuredClone(e.stock);
    for (const i of items) stock[i.id][i.talla] = Math.max(0, (stock[i.id][i.talla] ?? 0) - i.cantidad);
    setEstado({ ...e, stock, lineas: [], combos: [], ordenes: [orden, ...e.ordenes], siguiente: e.siguiente + 1 });
    return orden;
  };

  const avanzar = (numero: string) =>
    setEstado((e) => ({
      ...e,
      ordenes: e.ordenes.map((o) => (o.numero === numero ? { ...o, estado: SIGUIENTE_ESTADO[o.estado]?.a ?? o.estado } : o)),
    }));

  /** cancelar devuelve las prendas a la existencia */
  const cancelar = (numero: string) =>
    setEstado((e) => {
      const orden = e.ordenes.find((o) => o.numero === numero);
      if (!orden || orden.estado === "cancelada" || orden.estado === "entregada") return e;
      const stock = structuredClone(e.stock);
      for (const i of orden.items) stock[i.id][i.talla] = (stock[i.id][i.talla] ?? 0) + i.cantidad;
      return { ...e, stock, ordenes: e.ordenes.map((o) => (o === orden ? { ...o, estado: "cancelada" as const } : o)) };
    });

  const ponerStock = (id: string, talla: Talla, n: number) =>
    setEstado((e) => ({ ...e, stock: { ...e.stock, [id]: { ...e.stock[id], [talla]: Math.min(999, Math.max(0, Math.floor(n) || 0)) } } }));

  const ponerPrecio = (id: string, precio: number) => setEstado((e) => ({ ...e, precios: { ...e.precios, [id]: redondear(precio) } }));

  const restablecer = () => setEstado(inicial());

  return { estado, agregar, ponerLinea, agregarCombo, ponerCombo, ponerDatos, registrar, avanzar, cancelar, ponerStock, ponerPrecio, restablecer };
}
export type Vertice = ReturnType<typeof useVertice>;
