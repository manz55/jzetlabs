import { CupSoda, Flame, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { useSyncExternalStore } from "react";

export type StandId = "parrilla" | "antojitos" | "bebidas";
export type ProductoId = string;
export type Filtro = StandId | "todos";
export type Banco = "BI" | "BAC";
export type Cesta = Partial<Record<ProductoId, number>>;
export type Pago = { tipo: "efectivo"; recibido: number } | { tipo: "transferencia"; banco: Banco; boleta: string };

export type Producto = { nombre: string; detalle: string; precio: number; stand: StandId; foto: string; alt: string; cargadas: number; agotado: boolean; baja: boolean };
export type PlatilloNuevo = Pick<Producto, "nombre" | "detalle" | "precio" | "stand" | "foto" | "alt" | "cargadas">;
export type Entrega = "salon" | "casa";
export type Cliente = { vecino: string; casa: string; entrega: Entrega };
export type Ticket = Cliente & { numero: number; items: Cesta; pago: Pago; fecha: number; entregas: Partial<Record<StandId, number>> };
type Estado = { dia: string; productos: Record<ProductoId, Producto>; tickets: Ticket[] };

export type Cuenta = Cliente & { items: Cesta; metodo: Pago["tipo"]; recibido: string; banco: Banco; boleta: string };

export const cuentaVacia = (): Cuenta => ({ vecino: "", casa: "", entrega: "salon", items: {}, metodo: "efectivo", recibido: "", banco: "BI", boleta: "" });

export const CONVIVIO = { nombre: "Convivio Navideño", lugar: "Residenciales Villa Real", zona: "Zona 16, Ciudad de Guatemala", horario: "10:00 a.m. – 6:00 p.m." };

export const STANDS: Record<StandId, { nombre: string; corto: string; icono: LucideIcon }> = {
  parrilla: { nombre: "Stand Parrilla", corto: "Parrilla", icono: Flame },
  antojitos: { nombre: "Stand Antojitos", corto: "Antojitos", icono: UtensilsCrossed },
  bebidas: { nombre: "Stand Bebidas", corto: "Bebidas", icono: CupSoda },
};
export const IDS_STAND = Object.keys(STANDS) as StandId[];
export const MAXIMO_PORCIONES = 999;

const platillo = (datos: PlatilloNuevo): Producto => ({ ...datos, agotado: false, baja: false });

const cartaInicial = (): Record<ProductoId, Producto> => ({
  carne: platillo({ nombre: "Carne Asada", detalle: "Con tortillas, chirmol y cebollines", precio: 45, stand: "parrilla", cargadas: 120, foto: "1558030006-450675393462", alt: "Carne asada rebanada sobre una tabla" }),
  choripan: platillo({ nombre: "Choripán", detalle: "Chorizo a la brasa en pan francés", precio: 25, stand: "parrilla", cargadas: 80, foto: "1705512557389-841efbde54db", alt: "Pan con chorizo sobre una tabla de madera" }),
  chuchitos: platillo({ nombre: "2 Chuchitos", detalle: "Con salsa de tomate y queso seco", precio: 15, stand: "antojitos", cargadas: 70, foto: "1732118070605-8c5faa62d284", alt: "Chuchitos envueltos en tusa sobre un plato" }),
  elote: platillo({ nombre: "Elote Loco", detalle: "Mayonesa, queso seco y salsas", precio: 15, stand: "antojitos", cargadas: 40, foto: "1570716774271-ab30ad4924a8", alt: "Elotes en palillo con queso y chile" }),
  ponche: platillo({ nombre: "Ponche Navideño", detalle: "De frutas de temporada", precio: 12, stand: "bebidas", cargadas: 150, foto: "1773809407789-fa0b42b6131c", alt: "Ponche de frutas con rodajas de naranja y limón" }),
  gaseosa: platillo({ nombre: "Gaseosa", detalle: "Vaso con hielo", precio: 10, stand: "bebidas", cargadas: 144, foto: "1629654613528-5d0a2e4166de", alt: "Vaso de gaseosa con hielo" }),
});

export const FOTOS_PLATILLO = [
  ...Object.values(cartaInicial()).map(({ nombre, foto, alt }) => ({ nombre, foto, alt })),
  { nombre: "Hot dog", foto: "1599599810694-b5b37304c041", alt: "Hot dog con salsas" },
  { nombre: "Churros", foto: "1624371414361-e670edf4898d", alt: "Churros con chocolate" },
  { nombre: "Pastel", foto: "1602663491496-73f07481dbea", alt: "Porción de pastel con fresa" },
];

export const SECCIONES = [
  { id: "como-funciona", nombre: "Cómo funciona" },
  { id: "stands-menu", nombre: "Stands y Menú" },
];

export const urlFoto = (id: string, ancho: number, alto: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${ancho}&h=${alto}&q=72`;
export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;
export const codigo = (numero: number) => `#CV-${numero}`;
export const quien = ({ vecino, casa }: Cliente) => (casa ? `${vecino} · ${/^\d/.test(casa) ? "Casa " : ""}${casa}` : vecino);
export const hora = (fecha: number) => new Date(fecha).toLocaleTimeString("es-GT", { hour: "numeric", minute: "2-digit" });
export const diaLargo = () => new Date().toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" });

export const renglones = (cesta: Cesta) =>
  Object.keys(PRODUCTOS).filter((id) => (cesta[id] ?? 0) > 0).map((id) => ({ id, cantidad: cesta[id]!, ...PRODUCTOS[id] }));
export const totalDe = (cesta: Cesta) => renglones(cesta).reduce((s, r) => s + r.cantidad * r.precio, 0);
export const standsDe = (ticket: Ticket) => IDS_STAND.filter((s) => renglones(ticket.items).some((r) => r.stand === s));
export const despachado = (ticket: Ticket) => standsDe(ticket).every((s) => ticket.entregas[s]);
export const pendientesDe = (tickets: Ticket[], filtro: Filtro) =>
  tickets.filter((t) => standsDe(t).some((s) => (filtro === "todos" || s === filtro) && !t.entregas[s]));

function estadoInicial(dia: string): Estado {
  const hace = (minutos: number) => Date.now() - minutos * 60_000;
  const efectivo = (recibido: number): Pago => ({ tipo: "efectivo", recibido });
  const transferencia = (banco: Banco, boleta: string): Pago => ({ tipo: "transferencia", banco, boleta });
  const venta = (numero: number, minutos: number, vecino: string, casa: string, items: Cesta, pago: Pago, entregados: StandId[], entrega: Entrega = "salon"): Ticket => ({
    numero,
    vecino,
    casa,
    entrega,
    items,
    pago,
    fecha: hace(minutos),
    entregas: Object.fromEntries(entregados.map((s) => [s, hace(Math.max(1, minutos - 6))])),
  });
  return {
    dia,
    productos: cartaInicial(),
    tickets: [
      venta(101, 112, "Marta", "3-15", { carne: 5, chuchitos: 2, gaseosa: 5 }, efectivo(320), ["parrilla", "antojitos", "bebidas"]),
      venta(102, 96, "Luis", "22-04", { carne: 6, elote: 6, ponche: 4 }, transferencia("BI", "448210"), ["parrilla", "antojitos", "bebidas"]),
      venta(103, 78, "Ana Lucía", "Mz. B 4-10", { carne: 4, choripan: 3, elote: 8, gaseosa: 4 }, efectivo(500), ["parrilla", "antojitos", "bebidas"]),
      venta(104, 61, "Familia Reyes", "31-08", { carne: 5, chuchitos: 4, elote: 6, ponche: 6 }, transferencia("BAC", "903377"), ["parrilla", "antojitos", "bebidas"]),
      venta(105, 44, "Jorge", "17-12", { carne: 3, choripan: 4, elote: 6, gaseosa: 3 }, efectivo(400), ["parrilla", "antojitos", "bebidas"]),
      venta(106, 19, "Sofía", "5-41", { carne: 6, elote: 6, gaseosa: 6 }, transferencia("BI", "451902"), ["bebidas"]),
      venta(107, 11, "Rafael", "12-23", { carne: 4, choripan: 2, elote: 4, ponche: 5 }, efectivo(400), [], "casa"),
      venta(108, 4, "Claudia", "Mz. C 2-07", { carne: 3, chuchitos: 3, elote: 4, gaseosa: 2 }, transferencia("BAC", "911045"), []),
    ],
  };
}

const CLAVE = "ticketfest-v3";
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
export let PRODUCTOS = estado.productos;
export const productosDe = (stand: StandId) => Object.keys(PRODUCTOS).filter((id) => PRODUCTOS[id].stand === stand && !PRODUCTOS[id].baja);
export const productosEnCarta = () => IDS_STAND.flatMap(productosDe);

const oyentes = new Set<() => void>();
const avisar = () => oyentes.forEach((f) => f());

function fijar(nuevo: Estado) {
  estado = nuevo;
  PRODUCTOS = nuevo.productos;
}

function suscribir(oyente: () => void) {
  const otraPestana = (e: StorageEvent) => {
    if (e.key !== CLAVE) return;
    fijar(guardado() ?? estado);
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
  fijar(fn(guardado() ?? estado));
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    // sin almacenamiento (modo privado) la demo sigue en memoria
  }
  avisar();
}

const vendidoEn = (e: Estado, id: ProductoId) => e.tickets.reduce((s, t) => s + (t.items[id] ?? 0), 0);
const sobranteEn = (e: Estado, id: ProductoId) => e.productos[id].cargadas - vendidoEn(e, id);
const disponibleEn = (e: Estado, id: ProductoId) => (e.productos[id].agotado || e.productos[id].baja ? 0 : sobranteEn(e, id));

function editar(id: ProductoId, cambios: (e: Estado) => Partial<Producto>) {
  cambiar((e) => ({ ...e, productos: { ...e.productos, [id]: { ...e.productos[id], ...cambios(e) } } }));
}

function fijarDisponibles(id: ProductoId, cantidad: number) {
  const nuevas = Math.max(0, Math.min(MAXIMO_PORCIONES, cantidad));
  editar(id, (e) => ({ cargadas: vendidoEn(e, id) + nuevas, agotado: false }));
}

function sumar(id: ProductoId, cantidad: number) {
  editar(id, (e) => ({ cargadas: vendidoEn(e, id) + Math.min(MAXIMO_PORCIONES, sobranteEn(e, id) + cantidad), agotado: false }));
}

const marcarAgotado = (id: ProductoId, agotado: boolean) => editar(id, () => ({ agotado }));
const darDeBaja = (id: ProductoId, baja: boolean) => editar(id, () => ({ baja }));

function crear(datos: PlatilloNuevo) {
  cambiar((e) => ({ ...e, productos: { ...e.productos, [`p${Date.now()}`]: platillo(datos) } }));
}

function cobrar({ vecino, casa, entrega }: Cliente, items: Cesta, pago: Pago): Ticket | null {
  let nuevo: Ticket | null = null;
  cambiar((e) => {
    if (Object.entries(items).some(([id, cantidad]) => (cantidad ?? 0) > disponibleEn(e, id))) return e;
    nuevo = { numero: Math.max(100, ...e.tickets.map((t) => t.numero)) + 1, vecino: vecino.trim(), casa: casa.trim().replace(/^casa\s+/i, ""), entrega, items, pago, fecha: Date.now(), entregas: {} };
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
    productos: e.productos,
    tickets: e.tickets,
    cargado: (id: ProductoId) => e.productos[id].cargadas,
    vendido: (id: ProductoId) => vendidoEn(e, id),
    sobrante: (id: ProductoId) => sobranteEn(e, id),
    quedan: (id: ProductoId) => disponibleEn(e, id),
    fijarDisponibles,
    sumar,
    marcarAgotado,
    darDeBaja,
    crear,
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
    const conMovimiento = Object.keys(PRODUCTOS).filter((p) => PRODUCTOS[p].stand === id && (!PRODUCTOS[p].baja || feria.vendido(p) > 0));
    const productos = conMovimiento.map((p) => ({
      id: p,
      nombre: PRODUCTOS[p].nombre,
      iniciales: feria.cargado(p),
      vendidas: feria.vendido(p),
      sobrantes: feria.sobrante(p),
      baja: PRODUCTOS[p].baja,
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
    `Tickets: ${r.cobrados} cobrados, ${r.entregados} despachados, ${r.pendientes} pendientes`,
    "",
    porStand.join("\n\n"),
  ].join("\n");
}
