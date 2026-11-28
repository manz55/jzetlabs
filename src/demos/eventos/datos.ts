/*
 * Demo de eventos: "Casa Imperial" (negocio inventado; fotos de Unsplash enlazadas).
 * Alquiler de mobiliario y toldos, y caja con stands para convivios. Las tres vistas leen y
 * escriben el mismo estado, que se guarda en el navegador y vuelve a empezar cada día.
 */
import { useCallback, useEffect, useState } from "react";

export const foto = (id: string, ancho: number, alto: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${ancho}&h=${alto}&q=74`;

export const FOTOS = {
  portada: "1775476793931-cb484f197760",
  bodega: "1600694552566-14c3c46aafd5",
  antigua: "1763451346186-2b5b6b5455e7",
};

export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;
export const num = (n: number) => n.toLocaleString("en-US");

/* en el mismo orden en que aparecen en la portada, de arriba hacia abajo */
export const SECCIONES = [
  { id: "garantias", nombre: "Garantías" },
  { id: "mobiliario", nombre: "Mobiliario" },
  { id: "paquetes", nombre: "Paquetes" },
  { id: "cobertura", nombre: "Cobertura" },
];

/* ---------------- fechas (en hora local) ---------------- */

const dos = (n: number) => String(n).padStart(2, "0");
export const iso = (d: Date) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
export const aFecha = (f: string) => new Date(`${f}T12:00:00`);
export const dia = (n: number) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return iso(d);
};
const limpio = (t: string) => t.replace(/[.,]/g, "");
export const diaSemana = (f: string) => limpio(aFecha(f).toLocaleDateString("es-GT", { weekday: "short" }));
export const diaMes = (f: string) => limpio(aFecha(f).toLocaleDateString("es-GT", { day: "numeric", month: "short" }));
export const diaCorto = (f: string) => `${diaSemana(f)} ${diaMes(f)}`;
export const diaLargo = (f: string) => aFecha(f).toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" }).replace(",", "");
export const ahora = () => {
  const d = new Date();
  return `${dos(d.getHours())}:${dos(d.getMinutes())}`;
};

/* los próximos viernes, sábados y domingos, desde mañana */
export function finesDeSemana(n = 8) {
  const out: string[] = [];
  for (let k = 1; out.length < n; k++) {
    const f = dia(k);
    if ([5, 6, 0].includes(aFecha(f).getDay())) out.push(f);
  }
  return out;
}

/* ---------------- inventario ---------------- */

export const CATEGORIAS = ["Sillas y Mesas", "Toldos y Stands", "Cristalería y Mantelería", "Calentadores y Audio"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

type Ficha = {
  nombre: string;
  detalle: string;
  cat: Categoria;
  precio: number;
  total: number;
  /* de cuánto en cuánto suben los botones + y − */
  paso: number;
  /* lo que se descuenta del depósito por pieza que falta o vuelve rota */
  reposicion: number;
  clase?: "silla" | "toldo";
  foto: string;
  alt: string;
};

const ficha = (f: Ficha) => f;

export const ARTICULOS = {
  plegable: ficha({ nombre: "Silla plegable blanca", detalle: "Resina reforzada, apilable", cat: "Sillas y Mesas", precio: 5, total: 2600, paso: 10, reposicion: 125, clase: "silla", foto: "1597451828211-09604cfa296a", alt: "Fila de sillas plegables blancas sobre el césped" }),
  tiffany: ficha({ nombre: "Silla Tiffany dorada", detalle: "Con cojín, para recepciones", cat: "Sillas y Mesas", precio: 16, total: 900, paso: 10, reposicion: 350, clase: "silla", foto: "1768851142314-c4ebf49ad45b", alt: "Sillas doradas alrededor de una mesa con servilletas azules" }),
  crossback: ficha({ nombre: "Silla de madera cruzada", detalle: "Respaldo en equis, tono natural", cat: "Sillas y Mesas", precio: 18, total: 640, paso: 10, reposicion: 420, clase: "silla", foto: "1737131148863-30bdc1f0af49", alt: "Sillas de madera con respaldo cruzado en un jardín" }),
  redonda: ficha({ nombre: "Mesa redonda · 10 personas", detalle: "1.50 m de diámetro", cat: "Sillas y Mesas", precio: 40, total: 320, paso: 1, reposicion: 850, foto: "1751891159950-bf33e1e8705b", alt: "Mesa redonda montada para una cena" }),
  rectangular: ficha({ nombre: "Mesa rectangular · 8 personas", detalle: "2.40 × 0.90 m", cat: "Sillas y Mesas", precio: 35, total: 180, paso: 1, reposicion: 750, foto: "1696805966408-5f92fdb79ae7", alt: "Mesa larga de madera con sillas y cubiertos" }),
  coctel: ficha({ nombre: "Mesa de cóctel alta", detalle: "Con funda blanca ajustada", cat: "Sillas y Mesas", precio: 45, total: 80, paso: 1, reposicion: 600, foto: "1618106494700-4b0049e83ed8", alt: "Mesas altas de cóctel con fundas blancas en un jardín" }),
  toldo3: ficha({ nombre: "Toldo 3 × 3 m", detalle: "Para puesto de venta o mesa de cobro", cat: "Toldos y Stands", precio: 175, total: 40, paso: 1, reposicion: 1800, clase: "toldo", foto: "1786019932386-997dbb5caf21", alt: "Toldos blancos con punta en un campo abierto" }),
  toldo6: ficha({ nombre: "Toldo 6 × 12 m", detalle: "Cubre hasta 60 personas sentadas", cat: "Toldos y Stands", precio: 750, total: 14, paso: 1, reposicion: 9500, clase: "toldo", foto: "1692166927778-056466153552", alt: "Toldo blanco montado en un jardín" }),
  toldo10: ficha({ nombre: "Toldo 10 × 20 m", detalle: "Cubre hasta 200 personas sentadas", cat: "Toldos y Stands", precio: 1850, total: 6, paso: 1, reposicion: 22000, clase: "toldo", foto: "1695393386569-cf141ff2c552", alt: "Carpa blanca grande instalada sobre césped" }),
  stand: ficha({ nombre: "Stand de feria con mostrador", detalle: "Mostrador de madera y repisa", cat: "Toldos y Stands", precio: 225, total: 30, paso: 1, reposicion: 1400, foto: "1779319684873-d2210f31850c", alt: "Vendedora atendiendo en un puesto de madera al aire libre" }),
  mantel: ficha({ nombre: "Mantel de mesa marfil", detalle: "Lavado y planchado, redondo o rectangular", cat: "Cristalería y Mantelería", precio: 22, total: 340, paso: 1, reposicion: 160, foto: "1544576623-d817a825bc64", alt: "Mantel blanco con orilla de encaje" }),
  camino: ficha({ nombre: "Camino de mesa", detalle: "Lino, en tonos de temporada", cat: "Cristalería y Mantelería", precio: 10, total: 300, paso: 1, reposicion: 60, foto: "1762638197960-d1ee50ddcff3", alt: "Camino de mesa con velas y arreglos" }),
  copas: ficha({ nombre: "Cristalería por persona", detalle: "Copa de agua y copa de vino", cat: "Cristalería y Mantelería", precio: 6, total: 1500, paso: 10, reposicion: 55, foto: "1558670426-931963635470", alt: "Copas de tallo largo sobre una mesa" }),
  vajilla: ficha({ nombre: "Vajilla por persona", detalle: "Plato base, plato fuerte y cubiertos", cat: "Cristalería y Mantelería", precio: 9, total: 1200, paso: 10, reposicion: 120, foto: "1637424487264-591425455ba9", alt: "Puesto de mesa con plato, servilleta y cubiertos" }),
  calentador: ficha({ nombre: "Calentador de exterior", detalle: "Tipo torre, con gas para 6 horas", cat: "Calentadores y Audio", precio: 185, total: 36, paso: 1, reposicion: 1900, foto: "1779249245434-9c4fec8aebed", alt: "Calentador de patio encendido de noche" }),
  audio: ficha({ nombre: "Audio con micrófono", detalle: "2 bocinas, consola y micrófono", cat: "Calentadores y Audio", precio: 450, total: 10, paso: 1, reposicion: 4200, foto: "1561314105-e6ac04c2984a", alt: "Bocina negra de sonido profesional" }),
  luces: ficha({ nombre: "Serie de luces cálidas · 10 m", detalle: "Focos para exterior con extensión", cat: "Calentadores y Audio", precio: 65, total: 90, paso: 1, reposicion: 350, foto: "1694726361295-6a188bc577b3", alt: "Focos colgantes encendidos de noche" }),
};

export type ArtId = keyof typeof ARTICULOS;
export const IDS = Object.keys(ARTICULOS) as ArtId[];
export type Cesta = Partial<Record<ArtId, number>>;
export const renglones = (c: Cesta) => IDS.filter((id) => (c[id] ?? 0) > 0).map((id) => ({ id, n: c[id]!, art: ARTICULOS[id] }));
export const unidades = (c: Cesta, clase: "silla" | "toldo") => renglones(c).reduce((s, r) => s + (r.art.clase === clase ? r.n : 0), 0);

/* ---------------- zonas, cuentas y paquetes ---------------- */

export const ZONAS = {
  ciudad: { nombre: "Ciudad de Guatemala", flete: 250, alcance: "Zonas de la capital y colonias cercanas del área metropolitana." },
  carretera: { nombre: "Carretera a El Salvador", flete: 375, alcance: "Santa Catarina Pinula, Fraijanes y condominios sobre la ruta." },
  antigua: { nombre: "Antigua Guatemala", flete: 600, alcance: "Antigua, sus aldeas y fincas de Sacatepéquez." },
};
export type ZonaId = keyof typeof ZONAS;
export const ZONA_IDS = Object.keys(ZONAS) as ZonaId[];

export const INVITADOS = [50, 100, 150, 250] as const;
export type Invitados = (typeof INVITADOS)[number];
export const textoInvitados = (n: Invitados) => (n === 250 ? "250+" : String(n));

export const DEPOSITO = 0.15;
export function cuentas(c: Cesta, zona: ZonaId) {
  const subtotal = renglones(c).reduce((s, r) => s + r.n * r.art.precio, 0);
  const flete = subtotal ? ZONAS[zona].flete : 0;
  const deposito = Math.round(subtotal * DEPOSITO);
  const total = subtotal + flete + deposito;
  return { subtotal, flete, deposito, total, anticipo: Math.round(total / 2) };
}

/* lo que normalmente lleva un evento según los invitados */
export function sugerido(n: Invitados): Cesta {
  const mesas = Math.ceil(n / 10);
  const toldos: Cesta = n <= 50 ? { toldo6: 1 } : n <= 100 ? { toldo6: 2 } : n <= 150 ? { toldo10: 1 } : { toldo10: 1, toldo6: 1 };
  return { plegable: n, redonda: mesas, mantel: mesas, ...toldos, luces: Math.ceil(n / 25) };
}

export const PAQUETES: { id: string; nombre: string; para: string; cesta: Cesta; foto: string; alt: string }[] = [
  { id: "convivio", nombre: "Convivio de Colonia · 4 Stands + Toldos", para: "Kermés, posada o feria de vecinos", cesta: { stand: 4, toldo3: 4, plegable: 100, rectangular: 12, luces: 4, audio: 1 }, foto: "1464047736614-af63643285bf", alt: "Banderines y luces encendidas en una fiesta" },
  { id: "recepcion", nombre: "Recepción Clásica 100 personas", para: "Bautizo, graduación o cena de empresa", cesta: { tiffany: 100, redonda: 10, mantel: 10, camino: 10, copas: 100, vajilla: 100, toldo6: 2 }, foto: "1763553113391-a659bee36e06", alt: "Mesas de recepción con arreglos florales" },
  { id: "boda", nombre: "Boda Imperial 200 personas", para: "Boda completa en jardín o finca", cesta: { crossback: 200, redonda: 20, mantel: 20, camino: 20, copas: 200, vajilla: 200, toldo10: 1, calentador: 6, luces: 12, audio: 1 }, foto: "1772127822525-7eda37383b9f", alt: "Recepción de boda al aire libre con toldo y mesas montadas" },
];

/* ---------------- órdenes de alquiler ---------------- */

export type EstadoOrden = "reservada" | "ruta" | "retorno" | "liquidada";
export const ESTADOS: Record<EstadoOrden, string> = { reservada: "Por cargar", ruta: "En ruta", retorno: "Por revisar", liquidada: "Liquidada" };
export type Dano = { faltan: number; rotas: number };
export type Orden = {
  folio: string;
  cliente: string;
  tel: string;
  evento: string;
  lugar: string;
  zona: ZonaId;
  fecha: string;
  hora: string;
  cesta: Cesta;
  estado: EstadoOrden;
  cargado: ArtId[];
  revision: Partial<Record<ArtId, Dano>>;
  nueva?: boolean;
};

export const horaMontaje = (hora: string) => `${Number(hora.slice(0, 2)) - 6}:${hora.slice(3)}`;
export const cargoDe = (o: Orden) => renglones(o.cesta).reduce((s, r) => s + ((o.revision[r.id]?.faltan ?? 0) + (o.revision[r.id]?.rotas ?? 0)) * r.art.reposicion, 0);
/* lo que se devuelve del depósito y, si los daños lo superan, lo que queda por cobrar */
export function liquidacion(o: Orden) {
  const { deposito } = cuentas(o.cesta, o.zona);
  const cargo = cargoDe(o);
  return { deposito, cargo, devolver: Math.max(0, deposito - cargo), cobrar: Math.max(0, cargo - deposito) };
}

/* ---------------- stands y tickets ---------------- */

export const PUESTOS = ["Parrilla", "Antojitos", "Bebidas"] as const;
export type Puesto = (typeof PUESTOS)[number];

type Producto = { nombre: string; precio: number; puesto: Puesto; foto: string; alt: string };
const producto = (p: Producto) => p;
export const MENU = {
  carne: producto({ nombre: "Carne Asada", precio: 45, puesto: "Parrilla", foto: "1523986490752-c28064f26be3", alt: "Carne asada en rodajas sobre una tabla" }),
  choripan: producto({ nombre: "Choripán", precio: 25, puesto: "Parrilla", foto: "1705512557389-841efbde54db", alt: "Pan con chorizo sobre una tabla" }),
  chuchitos: producto({ nombre: "2 Chuchitos", precio: 15, puesto: "Antojitos", foto: "1732118070605-8c5faa62d284", alt: "Tamalitos en hoja de maíz sobre un plato" }),
  elote: producto({ nombre: "Elote Loco", precio: 15, puesto: "Antojitos", foto: "1570716774271-ab30ad4924a8", alt: "Elote en palillo con queso y chile" }),
  ponche: producto({ nombre: "Ponche Navideño", precio: 12, puesto: "Bebidas", foto: "1773809407789-fa0b42b6131c", alt: "Ponche de frutas con rodajas de naranja" }),
  gaseosa: producto({ nombre: "Gaseosa", precio: 10, puesto: "Bebidas", foto: "1629654613528-5d0a2e4166de", alt: "Vaso de gaseosa con hielo" }),
};
export type ProdId = keyof typeof MENU;
export const PRODUCTOS = Object.keys(MENU) as ProdId[];
export type Cuenta = Partial<Record<ProdId, number>>;
export type Pago = "Efectivo" | "Transferencia";
export type Ticket = { n: number; hora: string; pago: Pago; items: Cuenta; entregado: Partial<Record<Puesto, string>> };

export const codigo = (n: number) => `#CV-${n}`;
export const itemsDe = (c: Cuenta, puesto?: Puesto) => PRODUCTOS.filter((id) => (c[id] ?? 0) > 0 && (!puesto || MENU[id].puesto === puesto)).map((id) => ({ id, n: c[id]!, ...MENU[id] }));
export const totalDe = (c: Cuenta, puesto?: Puesto) => itemsDe(c, puesto).reduce((s, i) => s + i.n * i.precio, 0);
export const puestosDe = (c: Cuenta) => PUESTOS.filter((p) => itemsDe(c, p).length > 0);
export const pendiente = (t: Ticket, puesto?: Puesto) => puestosDe(t.items).some((p) => (!puesto || p === puesto) && !t.entregado[p]);

export const CONVIVIO = { nombre: "Convivio navideño", lugar: "Residenciales Villa Real" };

export function cuadre(tickets: Ticket[]) {
  return PUESTOS.map((puesto) => {
    const suyos = tickets.filter((t) => itemsDe(t.items, puesto).length > 0);
    const por = (pago: Pago) => suyos.filter((t) => t.pago === pago).reduce((s, t) => s + totalDe(t.items, puesto), 0);
    const entregadas = suyos.filter((t) => t.entregado[puesto]).length;
    const vendidos = PRODUCTOS.filter((id) => MENU[id].puesto === puesto).map((id) => ({ nombre: MENU[id].nombre, n: tickets.reduce((s, t) => s + (t.items[id] ?? 0), 0) }));
    const efectivo = por("Efectivo");
    const transferencia = por("Transferencia");
    return { puesto, ordenes: suyos.length, entregadas, pendientes: suyos.length - entregadas, efectivo, transferencia, total: efectivo + transferencia, vendidos };
  });
}

/* ---------------- datos con los que abre el día ---------------- */

function ordenesIniciales(): Orden[] {
  const f = finesDeSemana(8);
  const o = (folio: number, cliente: string, evento: string, lugar: string, zona: ZonaId, fecha: string, hora: string, cesta: Cesta, estado: EstadoOrden = "reservada", revision: Orden["revision"] = {}): Orden => ({
    folio: `CI-${folio}`,
    cliente,
    tel: "",
    evento,
    lugar,
    zona,
    fecha,
    hora,
    cesta,
    estado,
    cargado: estado === "reservada" ? [] : renglones(cesta).map((r) => r.id),
    revision,
  });
  return [
    o(2036, "Colegio San Agustín", "Clausura", "Zona 11", "ciudad", dia(-6), "10:00", { plegable: 180, rectangular: 6, toldo6: 2, audio: 1 }, "liquidada", { plegable: { faltan: 1, rotas: 2 } }),
    o(2038, "Familia Arriola", "Boda civil", "San Pedro El Panorama", "antigua", dia(-1), "16:00", { tiffany: 120, redonda: 12, mantel: 12, copas: 120, vajilla: 120, toldo6: 2, calentador: 4 }, "retorno"),
    o(2041, "Comité de Vecinos Villa Real", CONVIVIO.nombre, CONVIVIO.lugar, "carretera", dia(0), "17:00", { plegable: 220, rectangular: 24, toldo3: 8, stand: 6, luces: 10, audio: 2 }, "ruta"),
    o(2042, "Distribuidora Santa Lucía", "Cena de fin de año", "Zona 14", "ciudad", dia(0), "19:00", { crossback: 90, redonda: 9, mantel: 9, copas: 90, toldo6: 2, calentador: 5 }, "ruta"),
    o(2043, "Asociación de Vecinos El Encinal", "Feria navideña", "Condominio El Encinal", "carretera", f[0], "15:00", { plegable: 900, rectangular: 80, toldo3: 24, stand: 20, luces: 40, audio: 4 }),
    o(2044, "Andrea Méndez y Luis Rosales", "Boda", "Finca en San Miguel Dueñas", "antigua", f[0], "16:00", { tiffany: 220, redonda: 22, mantel: 22, camino: 22, copas: 220, vajilla: 220, toldo10: 2, calentador: 14 }),
    o(2049, "Cooperativa San Cristóbal", "Gala de asociados", "San Cristóbal", "ciudad", f[0], "18:00", { crossback: 460, redonda: 90, mantel: 130, camino: 90, copas: 700, vajilla: 620, toldo10: 2, toldo6: 7, calentador: 8, audio: 3, luces: 20 }),
    o(2045, "Familia Cifuentes", "Primera comunión", "Zona 15", "ciudad", f[1], "12:00", { plegable: 80, redonda: 8, mantel: 8, toldo6: 1 }),
    o(2046, "Grupo Textil La Fuente", "Convivio de empresa", "Zona 12", "ciudad", f[3], "13:00", { plegable: 600, redonda: 60, mantel: 60, toldo10: 3, audio: 3, luces: 20 }),
    o(2047, "María José y Rodrigo", "Boda", "Santa Elena Barillas", "carretera", f[4], "15:00", { crossback: 260, redonda: 26, mantel: 26, copas: 260, vajilla: 260, toldo10: 2, calentador: 18 }),
    o(2048, "Colonia Las Charcas", "Posada de colonia", "Zona 11", "ciudad", f[6], "17:00", { plegable: 1500, rectangular: 120, toldo3: 30, stand: 24, luces: 52, audio: 6 }),
    o(2050, "Municipalidad de Santa Catarina", "Festival navideño", "Santa Catarina Pinula", "carretera", f[6], "16:00", { tiffany: 700, crossback: 430, redonda: 160, mantel: 220, camino: 150, copas: 800, vajilla: 700, toldo10: 6, toldo6: 9, calentador: 28, coctel: 60 }),
  ];
}

/* las horas se cuentan hacia atrás desde que se abre la demo, para que nunca queden "en el futuro" */
function ticketsIniciales(): Ticket[] {
  const hace = (min: number) => {
    const d = new Date(Date.now() - min * 60000);
    return `${dos(d.getHours())}:${dos(d.getMinutes())}`;
  };
  const t = (n: number, min: number, pago: Pago, items: Cuenta, entregas: Partial<Record<Puesto, number>> = {}): Ticket => ({
    n,
    hora: hace(min),
    pago,
    items,
    entregado: Object.fromEntries(Object.entries(entregas).map(([puesto, m]) => [puesto, hace(m)])),
  });
  return [
    t(101, 48, "Efectivo", { carne: 2, gaseosa: 2 }, { Parrilla: 39, Bebidas: 46 }),
    t(102, 41, "Transferencia", { chuchitos: 3, ponche: 3 }, { Antojitos: 35, Bebidas: 38 }),
    t(103, 34, "Efectivo", { choripan: 4, elote: 2 }, { Parrilla: 23, Antojitos: 29 }),
    t(104, 26, "Efectivo", { elote: 3, ponche: 2 }, { Antojitos: 20, Bebidas: 24 }),
    t(105, 19, "Transferencia", { carne: 3, chuchitos: 1, gaseosa: 3 }, { Bebidas: 16 }),
    t(106, 13, "Efectivo", { choripan: 2, ponche: 4 }, { Bebidas: 10 }),
    t(107, 8, "Efectivo", { carne: 1, elote: 2, gaseosa: 1 }),
  ];
}

/* ---------------- estado compartido ---------------- */

type Estado = { dia: string; ordenes: Orden[]; tickets: Ticket[]; folio: number };
const CLAVE = "casa-imperial-v1";
const inicial = (): Estado => ({ dia: dia(0), ordenes: ordenesIniciales(), tickets: ticketsIniciales(), folio: 2051 });

function leer(texto: string | null): Estado | null {
  try {
    const v = texto ? (JSON.parse(texto) as Estado) : null;
    return v && v.dia === dia(0) && Array.isArray(v.ordenes) && Array.isArray(v.tickets) ? v : null;
  } catch {
    return null;
  }
}

export type NuevaReserva = Pick<Orden, "cliente" | "tel" | "evento" | "lugar" | "zona" | "fecha" | "hora" | "cesta">;

export function useImperial() {
  const [estado, setEstado] = useState<Estado>(() => {
    try {
      return leer(localStorage.getItem(CLAVE)) ?? inicial();
    } catch {
      return inicial();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {
      /* sin guardado, la demo sigue funcionando */
    }
  }, [estado]);

  /* dos pestañas abiertas (la caja y un stand) se ven entre sí */
  useEffect(() => {
    const otra = (e: StorageEvent) => {
      if (e.key !== CLAVE) return;
      const v = leer(e.newValue);
      if (v) setEstado(v);
    };
    addEventListener("storage", otra);
    return () => removeEventListener("storage", otra);
  }, []);

  /* piezas libres en bodega para una fecha: lo que no está apartado por otra orden abierta */
  const libres = useCallback(
    (fecha: string, id: ArtId) => Math.max(0, ARTICULOS[id].total - estado.ordenes.filter((o) => o.fecha === fecha && o.estado !== "liquidada").reduce((s, o) => s + (o.cesta[id] ?? 0), 0)),
    [estado.ordenes],
  );

  /* qué parte del inventario (medido por su precio de renta) ya está apartada ese día */
  const ocupacion = useCallback(
    (fecha: string) => {
      const todo = IDS.reduce((s, id) => s + ARTICULOS[id].total * ARTICULOS[id].precio, 0);
      const libre = IDS.reduce((s, id) => s + libres(fecha, id) * ARTICULOS[id].precio, 0);
      return Math.round(((todo - libre) / todo) * 100);
    },
    [libres],
  );

  const cambiarOrden = useCallback((folio: string, fn: (o: Orden) => Orden) => setEstado((e) => ({ ...e, ordenes: e.ordenes.map((o) => (o.folio === folio ? fn(o) : o)) })), []);

  const reservar = useCallback(
    (n: NuevaReserva) => {
      const orden: Orden = { ...n, folio: `CI-${estado.folio}`, estado: "reservada", cargado: [], revision: {}, nueva: true };
      setEstado((e) => ({ ...e, folio: e.folio + 1, ordenes: [...e.ordenes, orden] }));
      return orden;
    },
    [estado.folio],
  );

  const cobrar = useCallback(
    (items: Cuenta, pago: Pago) => {
      const ticket: Ticket = { n: Math.max(100, ...estado.tickets.map((t) => t.n)) + 1, hora: ahora(), pago, items, entregado: {} };
      setEstado((e) => ({ ...e, tickets: [...e.tickets, ticket] }));
      return ticket;
    },
    [estado.tickets],
  );

  /* entregar un puesto de un ticket; con hora vacía se deshace */
  const entregar = useCallback(
    (n: number, puesto: Puesto, hora: string) =>
      setEstado((e) => ({
        ...e,
        tickets: e.tickets.map((t) => {
          if (t.n !== n || (hora && t.entregado[puesto])) return t;
          const entregado = { ...t.entregado };
          if (hora) entregado[puesto] = hora;
          else delete entregado[puesto];
          return { ...t, entregado };
        }),
      })),
    [],
  );

  return { ordenes: estado.ordenes, tickets: estado.tickets, libres, ocupacion, reservar, cambiarOrden, cobrar, entregar };
}
export type Imperial = ReturnType<typeof useImperial>;
