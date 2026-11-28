import { CupSoda, Flame, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { useSyncExternalStore } from "react";

export type StandId = "parrilla" | "antojitos" | "bebidas";
export type ProductoId = "carne" | "choripan" | "chuchitos" | "elote" | "ponche" | "gaseosa";
export type Filtro = StandId | "todos";
export type Banco = "BI" | "BAC";
export type Cesta = Partial<Record<ProductoId, number>>;
export type Pago = { tipo: "efectivo"; recibido: number } | { tipo: "transferencia"; banco: Banco; boleta: string };

export type Carga = { id: number; producto: ProductoId; cantidad: number; fecha: number; apertura: boolean };
export type Ticket = { numero: number; vecino: string; items: Cesta; pago: Pago; fecha: number; entregas: Partial<Record<StandId, number>> };
type Estado = { dia: string; cargas: Carga[]; tickets: Ticket[] };

export type Cuenta = { vecino: string; items: Cesta; metodo: Pago["tipo"]; recibido: string; banco: Banco; boleta: string };

export const cuentaVacia = (): Cuenta => ({ vecino: "", items: {}, metodo: "efectivo", recibido: "", banco: "BI", boleta: "" });

export const CONVIVIO = { nombre: "Convivio Navideño", lugar: "Residenciales Villa Real", zona: "Zona 16, Ciudad de Guatemala", obra: "parque infantil", meta: 8000 };

export const STANDS: Record<StandId, { nombre: string; corto: string; icono: LucideIcon }> = {
  parrilla: { nombre: "Stand Parrilla", corto: "Parrilla", icono: Flame },
  antojitos: { nombre: "Stand Antojitos", corto: "Antojitos", icono: UtensilsCrossed },
  bebidas: { nombre: "Stand Bebidas", corto: "Bebidas", icono: CupSoda },
};
export const IDS_STAND = Object.keys(STANDS) as StandId[];

export const PRODUCTOS: Record<ProductoId, { nombre: string; detalle: string; precio: number; stand: StandId; foto: string; alt: string }> = {
  carne: { nombre: "Carne Asada", detalle: "Con tortillas, chirmol y cebollines", precio: 45, stand: "parrilla", foto: "1558030006-450675393462", alt: "Carne asada rebanada sobre una tabla" },
  choripan: { nombre: "Choripán", detalle: "Chorizo a la brasa en pan francés", precio: 25, stand: "parrilla", foto: "1705512557389-841efbde54db", alt: "Pan con chorizo sobre una tabla de madera" },
  chuchitos: { nombre: "2 Chuchitos", detalle: "Con salsa de tomate y queso seco", precio: 15, stand: "antojitos", foto: "1732118070605-8c5faa62d284", alt: "Chuchitos envueltos en tusa sobre un plato" },
  elote: { nombre: "Elote Loco", detalle: "Mayonesa, queso seco y salsas", precio: 15, stand: "antojitos", foto: "1570716774271-ab30ad4924a8", alt: "Elotes en palillo con queso y chile" },
  ponche: { nombre: "Ponche Navideño", detalle: "De frutas de temporada", precio: 12, stand: "bebidas", foto: "1773809407789-fa0b42b6131c", alt: "Ponche de frutas con rodajas de naranja y limón" },
  gaseosa: { nombre: "Gaseosa", detalle: "Vaso con hielo", precio: 10, stand: "bebidas", foto: "1629654613528-5d0a2e4166de", alt: "Vaso de gaseosa con hielo" },
};
export const IDS_PRODUCTO = Object.keys(PRODUCTOS) as ProductoId[];
export const productosDe = (stand: StandId) => IDS_PRODUCTO.filter((id) => PRODUCTOS[id].stand === stand);

export const SECCIONES = [
  { id: "como-funciona", nombre: "Cómo funciona" },
  { id: "stands-menu", nombre: "Stands y Menú" },
  { id: "carga-stock", nombre: "Carga de Stock" },
];

export const urlFoto = (id: string, ancho: number, alto: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${ancho}&h=${alto}&q=72`;
export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;
export const codigo = (numero: number) => `#CV-${numero}`;
export const hora = (fecha: number) => new Date(fecha).toLocaleTimeString("es-GT", { hour: "numeric", minute: "2-digit" });
export const diaLargo = () => new Date().toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" });

export const renglones = (cesta: Cesta) =>
  IDS_PRODUCTO.filter((id) => (cesta[id] ?? 0) > 0).map((id) => ({ id, cantidad: cesta[id]!, ...PRODUCTOS[id] }));
export const totalDe = (cesta: Cesta) => renglones(cesta).reduce((s, r) => s + r.cantidad * r.precio, 0);
export const standsDe = (ticket: Ticket) => IDS_STAND.filter((s) => renglones(ticket.items).some((r) => r.stand === s));
export const despachado = (ticket: Ticket) => standsDe(ticket).every((s) => ticket.entregas[s]);
export const pendientesDe = (tickets: Ticket[], filtro: Filtro) =>
  tickets.filter((t) => standsDe(t).some((s) => (filtro === "todos" || s === filtro) && !t.entregas[s]));

function estadoInicial(dia: string): Estado {
  const hace = (minutos: number) => Date.now() - minutos * 60_000;
  const apertura: [ProductoId, number][] = [["carne", 120], ["choripan", 80], ["chuchitos", 70], ["elote", 40], ["ponche", 150], ["gaseosa", 144]];
  const efectivo = (recibido: number): Pago => ({ tipo: "efectivo", recibido });
  const transferencia = (banco: Banco, boleta: string): Pago => ({ tipo: "transferencia", banco, boleta });
  const venta = (numero: number, minutos: number, vecino: string, items: Cesta, pago: Pago, entregados: StandId[]): Ticket => ({
    numero,
    vecino,
    items,
    pago,
    fecha: hace(minutos),
    entregas: Object.fromEntries(entregados.map((s) => [s, hace(Math.max(1, minutos - 6))])),
  });
  return {
    dia,
    cargas: apertura.map(([producto, cantidad], i) => ({ id: i + 1, producto, cantidad, fecha: hace(150 - i * 3), apertura: true })),
    tickets: [
      venta(101, 112, "Marta · Casa 3", { carne: 5, chuchitos: 2, gaseosa: 5 }, efectivo(320), ["parrilla", "antojitos", "bebidas"]),
      venta(102, 96, "Luis · Casa 22", { carne: 6, elote: 6, ponche: 4 }, transferencia("BI", "448210"), ["parrilla", "antojitos", "bebidas"]),
      venta(103, 78, "Ana Lucía · Casa 8", { carne: 4, choripan: 3, elote: 8, gaseosa: 4 }, efectivo(500), ["parrilla", "antojitos", "bebidas"]),
      venta(104, 61, "Familia Reyes · Casa 31", { carne: 5, chuchitos: 4, elote: 6, ponche: 6 }, transferencia("BAC", "903377"), ["parrilla", "antojitos", "bebidas"]),
      venta(105, 44, "Jorge · Casa 17", { carne: 3, choripan: 4, elote: 6, gaseosa: 3 }, efectivo(400), ["parrilla", "antojitos", "bebidas"]),
      venta(106, 19, "Sofía · Casa 5", { carne: 6, elote: 6, gaseosa: 6 }, transferencia("BI", "451902"), ["bebidas"]),
      venta(107, 11, "Rafael · Casa 12", { carne: 4, choripan: 2, elote: 4, ponche: 5 }, efectivo(400), []),
      venta(108, 4, "Claudia · Casa 27", { carne: 3, chuchitos: 3, elote: 4, gaseosa: 2 }, transferencia("BAC", "911045"), []),
    ],
  };
}

const CLAVE = "ticketfest-v1";
const hoy = () => new Date().toDateString();

function guardado(): Estado | null {
  try {
    const e = JSON.parse(localStorage.getItem(CLAVE) ?? "null") as Estado | null;
    return e?.dia === hoy() ? e : null;
  } catch {
    return null;
  }
}

let estado: Estado = guardado() ?? estadoInicial(hoy());
const oyentes = new Set<() => void>();
const avisar = () => oyentes.forEach((f) => f());

function suscribir(oyente: () => void) {
  const otraPestana = (e: StorageEvent) => {
    if (e.key !== CLAVE) return;
    estado = guardado() ?? estado;
    oyente();
  };
  oyentes.add(oyente);
  addEventListener("storage", otraPestana);
  return () => {
    oyentes.delete(oyente);
    removeEventListener("storage", otraPestana);
  };
}

function cambiar(fn: (e: Estado) => Estado) {
  estado = fn(guardado() ?? estado);
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    // sin almacenamiento (modo privado) la demo sigue en memoria
  }
  avisar();
}

const cargadoEn = (e: Estado, id: ProductoId) => e.cargas.reduce((s, c) => s + (c.producto === id ? c.cantidad : 0), 0);
const vendidoEn = (e: Estado, id: ProductoId) => e.tickets.reduce((s, t) => s + (t.items[id] ?? 0), 0);

function cargar(producto: ProductoId, cantidad: number) {
  cambiar((e) => ({
    ...e,
    cargas: [...e.cargas, { id: Math.max(0, ...e.cargas.map((c) => c.id)) + 1, producto, cantidad, fecha: Date.now(), apertura: false }],
  }));
}

function anularCarga(id: number) {
  cambiar((e) => {
    const carga = e.cargas.find((c) => c.id === id);
    if (!carga || carga.apertura || cargadoEn(e, carga.producto) - carga.cantidad < vendidoEn(e, carga.producto)) return e;
    return { ...e, cargas: e.cargas.filter((c) => c.id !== id) };
  });
}

function cobrar(vecino: string, items: Cesta, pago: Pago): Ticket | null {
  let nuevo: Ticket | null = null;
  cambiar((e) => {
    if (renglones(items).some((r) => r.cantidad > cargadoEn(e, r.id) - vendidoEn(e, r.id))) return e;
    nuevo = { numero: Math.max(100, ...e.tickets.map((t) => t.numero)) + 1, vecino, items, pago, fecha: Date.now(), entregas: {} };
    return { ...e, tickets: [...e.tickets, nuevo] };
  });
  return nuevo;
}

function marcarEntrega(numero: number, stand: StandId, entregado: boolean) {
  cambiar((e) => ({
    ...e,
    tickets: e.tickets.map((t) => {
      if (t.numero !== numero || Boolean(t.entregas[stand]) === entregado) return t;
      const entregas = { ...t.entregas };
      if (entregado) entregas[stand] = Date.now();
      else delete entregas[stand];
      return { ...t, entregas };
    }),
  }));
}

export function useFeria() {
  const e = useSyncExternalStore(suscribir, () => estado);
  return {
    cargas: e.cargas,
    tickets: e.tickets,
    cargado: (id: ProductoId) => cargadoEn(e, id),
    vendido: (id: ProductoId) => vendidoEn(e, id),
    quedan: (id: ProductoId) => cargadoEn(e, id) - vendidoEn(e, id),
    cargar,
    anularCarga,
    cobrar,
    marcarEntrega,
  };
}

export type Feria = ReturnType<typeof useFeria>;

export function resumen(feria: Feria) {
  const suma = (tickets: Ticket[]) => tickets.reduce((s, t) => s + totalDe(t.items), 0);
  const porTransferencia = (banco: Banco) => feria.tickets.filter((t) => t.pago.tipo === "transferencia" && t.pago.banco === banco);
  const vendidoCon = (id: ProductoId, tipo: Pago["tipo"]) => feria.tickets.reduce((s, t) => s + (t.pago.tipo === tipo ? (t.items[id] ?? 0) : 0), 0) * PRODUCTOS[id].precio;
  const stands = IDS_STAND.map((id) => {
    const productos = productosDe(id).map((p) => ({
      id: p,
      nombre: PRODUCTOS[p].nombre,
      iniciales: feria.cargado(p),
      vendidas: feria.vendido(p),
      sobrantes: feria.quedan(p),
      efectivo: vendidoCon(p, "efectivo"),
      transferencia: vendidoCon(p, "transferencia"),
      total: feria.vendido(p) * PRODUCTOS[p].precio,
    }));
    const sumar = (campo: "iniciales" | "vendidas" | "sobrantes" | "efectivo" | "transferencia" | "total") => productos.reduce((s, p) => s + p[campo], 0);
    return {
      id,
      productos,
      iniciales: sumar("iniciales"),
      vendidas: sumar("vendidas"),
      sobrantes: sumar("sobrantes"),
      efectivo: sumar("efectivo"),
      transferencia: sumar("transferencia"),
      total: sumar("total"),
    };
  });
  const entregados = feria.tickets.filter(despachado).length;
  return {
    stands,
    total: suma(feria.tickets),
    efectivo: suma(feria.tickets.filter((t) => t.pago.tipo === "efectivo")),
    bi: suma(porTransferencia("BI")),
    bac: suma(porTransferencia("BAC")),
    cobrados: feria.tickets.length,
    entregados,
    pendientes: feria.tickets.length - entregados,
  };
}

export function reporteWhatsApp(feria: Feria) {
  const r = resumen(feria);
  const porStand = r.stands.map((s) =>
    [
      `*${STANDS[s.id].nombre}: ${qz(s.total)}*`,
      `Efectivo ${qz(s.efectivo)} · Transferencia ${qz(s.transferencia)}`,
      ...s.productos.map((p) => `• ${p.nombre}: ${p.vendidas} de ${p.iniciales} vendidas, sobran ${p.sobrantes} (${qz(p.total)})`),
    ].join("\n"),
  );
  return [
    `*Cierre del ${CONVIVIO.nombre}*`,
    `${CONVIVIO.lugar}, ${CONVIVIO.zona}`,
    `Corte: ${diaLargo()}, ${hora(Date.now())}`,
    "",
    `*Total recaudado: ${qz(r.total)}*`,
    `Efectivo en caja: ${qz(r.efectivo)}`,
    `Transferencias: ${qz(r.bi + r.bac)} (BI ${qz(r.bi)} · BAC ${qz(r.bac)})`,
    `Cuadre: ${qz(r.efectivo)} + ${qz(r.bi + r.bac)} = ${qz(r.total)}`,
    `Meta ${CONVIVIO.obra}: ${qz(r.total)} de ${qz(CONVIVIO.meta)} (${Math.floor((r.total / CONVIVIO.meta) * 100)}%)`,
    `Tickets: ${r.cobrados} cobrados, ${r.entregados} despachados, ${r.pendientes} pendientes`,
    "",
    porStand.join("\n\n"),
  ].join("\n");
}
