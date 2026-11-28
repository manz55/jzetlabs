import { useCallback, useEffect, useState } from "react";

export const foto = (id: string, ancho: number, alto: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${ancho}&h=${alto}&q=74`;

export const FOTOS = {
  portada: "1775476793931-cb484f197760",
  bodega: "1600694552566-14c3c46aafd5",
  antigua: "1763451346186-2b5b6b5455e7",
};

export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;
export const num = (n: number) => n.toLocaleString("en-US");

export const SECCIONES = [
  { id: "garantias", nombre: "Garantías" },
  { id: "mobiliario", nombre: "Mobiliario" },
  { id: "paquetes", nombre: "Paquetes" },
  { id: "cobertura", nombre: "Cobertura" },
];

const dos = (n: number) => String(n).padStart(2, "0");
export const iso = (d: Date) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
export const aFecha = (f: string) => new Date(`${f}T12:00:00`);
export const mas = (f: string, n: number) => {
  const d = aFecha(f);
  d.setDate(d.getDate() + n);
  return iso(d);
};
export const dia = (n: number) => mas(iso(new Date()), n);
const limpio = (t: string) => t.replace(/[.,]/g, "");
export const diaSemana = (f: string) => limpio(aFecha(f).toLocaleDateString("es-GT", { weekday: "short" }));
export const diaMes = (f: string) => limpio(aFecha(f).toLocaleDateString("es-GT", { day: "numeric", month: "short" }));
export const diaCorto = (f: string) => `${diaSemana(f)} ${diaMes(f)}`;
export const diaLargo = (f: string) => aFecha(f).toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" }).replace(",", "");
export const ahora = () => {
  const d = new Date();
  return `${dos(d.getHours())}:${dos(d.getMinutes())}`;
};
export const antes = (hora: string, horas: number) => `${dos(Number(hora.slice(0, 2)) - horas)}:${hora.slice(3)}`;

export function finesDeSemana(n = 8) {
  const out: string[] = [];
  for (let k = 1; out.length < n; k++) {
    const f = dia(k);
    if ([5, 6, 0].includes(aFecha(f).getDay())) out.push(f);
  }
  return out;
}

export function sabado() {
  let f = dia(0);
  while (aFecha(f).getDay() !== 6) f = mas(f, 1);
  return f;
}
export const finDeSemana = () => [mas(sabado(), -1), sabado(), mas(sabado(), 1)].filter((f) => f >= dia(0));

export const CATEGORIAS = ["Sillas y Mesas", "Toldos y Carpas", "Cristalería y Mantelería", "Calentadores y Audio"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

type Ficha = {
  nombre: string;
  detalle: string;
  cat: Categoria;
  precio: number;
  total: number;
  paso: number;
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
  toldo3: ficha({ nombre: "Toldo 3 × 3 m", detalle: "Para mesa de regalos, bar o cabina de DJ", cat: "Toldos y Carpas", precio: 175, total: 40, paso: 1, reposicion: 1800, clase: "toldo", foto: "1786019932386-997dbb5caf21", alt: "Toldos blancos con punta en un campo abierto" }),
  toldo6: ficha({ nombre: "Toldo 6 × 12 m", detalle: "Cubre hasta 60 personas sentadas", cat: "Toldos y Carpas", precio: 750, total: 14, paso: 1, reposicion: 9500, clase: "toldo", foto: "1692166927778-056466153552", alt: "Toldo blanco montado en un jardín" }),
  toldo10: ficha({ nombre: "Toldo 10 × 20 m", detalle: "Cubre hasta 200 personas sentadas", cat: "Toldos y Carpas", precio: 1850, total: 6, paso: 1, reposicion: 22000, clase: "toldo", foto: "1695393386569-cf141ff2c552", alt: "Carpa blanca grande instalada sobre césped" }),
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

export const ZONAS = {
  ciudad: { nombre: "Ciudad de Guatemala", corto: "la capital", flete: 250, alcance: "Zonas de la capital y colonias cercanas del área metropolitana." },
  carretera: { nombre: "Carretera a El Salvador", corto: "Carretera a El Salvador", flete: 375, alcance: "Santa Catarina Pinula, Fraijanes y fincas sobre la ruta." },
  antigua: { nombre: "Antigua Guatemala", corto: "Antigua GT", flete: 600, alcance: "Antigua, sus aldeas y fincas de Sacatepéquez." },
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

export function sugerido(n: number): Cesta {
  const mesas = Math.ceil(n / 10);
  const toldos: Cesta = n <= 50 ? { toldo6: 1 } : n <= 100 ? { toldo6: 2 } : n <= 150 ? { toldo10: 1 } : { toldo10: 1, toldo6: 1 };
  return { plegable: n, redonda: mesas, mantel: mesas, ...toldos, luces: Math.ceil(n / 25) };
}

export const PAQUETES: { id: string; nombre: string; para: string; cesta: Cesta; foto: string; alt: string }[] = [
  { id: "corporativo", nombre: "Cóctel Corporativo 120 personas", para: "Lanzamiento, aniversario o cena de empresa", cesta: { coctel: 20, tiffany: 60, redonda: 6, mantel: 26, copas: 120, toldo6: 2, luces: 8, audio: 1 }, foto: "1618106494700-4b0049e83ed8", alt: "Mesas altas de cóctel con fundas blancas en un jardín" },
  { id: "recepcion", nombre: "Recepción Clásica 100 personas", para: "Bautizo, graduación o primera comunión", cesta: { tiffany: 100, redonda: 10, mantel: 10, camino: 10, copas: 100, vajilla: 100, toldo6: 2 }, foto: "1763553113391-a659bee36e06", alt: "Mesas de recepción con arreglos florales" },
  { id: "boda", nombre: "Boda Imperial 200 personas", para: "Boda completa en jardín o finca", cesta: { crossback: 200, redonda: 20, mantel: 20, camino: 20, copas: 200, vajilla: 200, toldo10: 1, calentador: 6, luces: 12, audio: 1 }, foto: "1772127822525-7eda37383b9f", alt: "Recepción de boda al aire libre con toldo y mesas montadas" },
];

export const MEDIOS = ["Visanet", "NeoNet", "Transferencia BI", "Transferencia BAC"] as const;
export type Medio = (typeof MEDIOS)[number];
export const esTarjeta = (m: Medio) => m === "Visanet" || m === "NeoNet";
export type Pago = { id: number; monto: number; medio: Medio; ref: string; fecha: string; verificado: boolean };

export type EstadoCamion = "bodega" | "carga" | "ruta" | "montaje" | "regreso" | "taller";
export const ESTADOS_CAMION: Record<EstadoCamion, string> = {
  bodega: "En bodega, listo para carga",
  carga: "Cargando en andén",
  ruta: "En ruta",
  montaje: "Montando en el lugar",
  regreso: "Regresando a bodega",
  taller: "En taller",
};
export type Camion = { id: string; nombre: string; ton: string; placa: string; piloto: string; pilotoCompleto: string; dpi: string; estado: EstadoCamion; orden?: string };

export type Entrega = { mapa: string; recibe: string; notas: string };
export type EstadoOrden = "reservada" | "evento" | "retorno" | "liquidada";
export const ESTADOS: Record<EstadoOrden, string> = { reservada: "Por cargar", evento: "En montaje / evento", retorno: "Retorno y revisión", liquidada: "Liquidada" };
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
  pagos: Pago[];
  camion?: string;
  entrega?: Entrega;
  origen: "web" | "manual";
  mia?: boolean;
  nueva?: boolean;
};

export const pagado = (o: Orden) => o.pagos.filter((p) => p.verificado).reduce((s, p) => s + p.monto, 0);
export const porVerificar = (o: Orden) => o.pagos.filter((p) => !p.verificado).reduce((s, p) => s + p.monto, 0);
export const saldo = (o: Orden) => Math.max(0, cuentas(o.cesta, o.zona).total - pagado(o));

export const cronograma = (o: Orden) => ({ llegada: antes(o.hora, 6), listo: antes(o.hora, 1), recoleccion: mas(o.fecha, 1) });

export const cargoDe = (o: Orden) => renglones(o.cesta).reduce((s, r) => s + ((o.revision[r.id]?.faltan ?? 0) + (o.revision[r.id]?.rotas ?? 0)) * r.art.reposicion, 0);
export function liquidacion(o: Orden) {
  const { deposito } = cuentas(o.cesta, o.zona);
  const cargo = cargoDe(o);
  return { deposito, cargo, devolver: Math.max(0, deposito - cargo), cobrar: Math.max(0, cargo - deposito) };
}

function iniciales(): { ordenes: Orden[]; camiones: Camion[] } {
  const s = sabado();
  let n = 0;
  const pago = (monto: number, medio: Medio, ref: string, fecha: string, verificado = true): Pago => ({ id: ++n, monto, medio, ref, fecha, verificado });
  const o = (folio: number, cliente: string, evento: string, lugar: string, zona: ZonaId, fecha: string, hora: string, cesta: Cesta, estado: EstadoOrden, cobro: "todo" | "anticipo" | "nada", extra: Partial<Orden> = {}): Orden => {
    const c = cuentas(cesta, zona);
    const pagos = cobro === "nada" ? [] : [pago(c.anticipo, "Transferencia BI", `BI-${44710 + folio}`, mas(fecha, -20))];
    if (cobro === "todo") pagos.push(pago(c.total - c.anticipo, "Visanet", `Aut. ${300100 + folio * 7}`, mas(fecha, -1)));
    return { folio: `EVT-${folio}`, cliente, tel: "", evento, lugar, zona, fecha, hora, cesta, estado, cargado: estado === "reservada" ? [] : renglones(cesta).map((r) => r.id), revision: {}, pagos, origen: "web", ...extra };
  };
  const ordenes = [
    o(795, "Colegio Montessori del Valle", "Graduación", "Gimnasio del colegio, zona 16", "ciudad", dia(-6), "10:00", { plegable: 180, rectangular: 6, toldo6: 2, audio: 1 }, "liquidada", "todo", { revision: { plegable: { faltan: 1, rotas: 2 } } }),
    o(798, "Familia Arriola", "Boda civil", "Jardín en San Pedro El Panorama", "antigua", dia(-1), "16:00", { tiffany: 120, redonda: 12, mantel: 12, copas: 120, vajilla: 120, toldo6: 2, calentador: 4 }, "retorno", "todo"),
    o(799, "Distribuidora Santa Lucía", "Cena de fin de año", "Terraza corporativa, zona 14", "ciudad", dia(-1), "19:00", { crossback: 90, redonda: 9, mantel: 9, copas: 90, toldo6: 2, calentador: 5 }, "retorno", "todo"),
    o(801, "Grupo Textil La Fuente", "Lanzamiento de producto", "Plaza corporativa, zona 10", "ciudad", dia(0), "18:00", { coctel: 30, plegable: 120, toldo6: 2, audio: 1, luces: 8 }, "evento", "todo", { camion: "c3" }),
    o(802, "Familia Cifuentes", "Recepción de bodas de plata", "Hacienda en San Juan del Obispo", "antigua", dia(0), "17:00", { tiffany: 150, redonda: 15, mantel: 15, copas: 150, vajilla: 150, toldo6: 3, calentador: 4 }, "evento", "todo", { camion: "c1" }),
    o(804, "Daniela Herrera y Andrés Monzón", "Boda", "Finca San Cayetano", "antigua", s, "16:00", { crossback: 220, redonda: 22, mantel: 22, camino: 22, copas: 220, vajilla: 220, toldo10: 2, calentador: 10, luces: 12, audio: 1 }, "reservada", "anticipo", { camion: "c2", mia: true, entrega: { mapa: "", recibe: "5512 3487 · Sofía Herrera (coordinadora)", notas: "Ingreso por portón de proveedores. Jardín plano, el toldo va junto a la capilla." } }),
    o(806, "Agroindustrial Los Volcanes", "Cena de gala de fin de año", "Jardín Las Lomas, zona 15", "ciudad", s, "19:00", { tiffany: 420, redonda: 50, mantel: 50, copas: 600, vajilla: 450, toldo10: 2, toldo6: 4, calentador: 12, coctel: 30, audio: 2 }, "reservada", "anticipo", { origen: "manual" }),
    o(807, "María José Pineda y Rodrigo Estrada", "Boda", "Finca en Santa Elena Barillas", "carretera", s, "15:00", { crossback: 300, redonda: 30, mantel: 30, camino: 30, copas: 300, vajilla: 300, toldo10: 1, calentador: 8 }, "reservada", "anticipo"),
    o(808, "Familia Godoy", "Bautizo", "Casa familiar, zona 15", "ciudad", mas(s, 1), "12:00", { tiffany: 80, redonda: 8, mantel: 8, camino: 8, copas: 80, toldo6: 2 }, "reservada", "anticipo"),
    o(809, "Cámara de Comercio Regional", "Almuerzo de asociados", "Salón al aire libre, Fraijanes", "carretera", mas(s, 7), "12:00", { tiffany: 250, redonda: 25, mantel: 25, copas: 250, vajilla: 250, toldo10: 1, audio: 1 }, "reservada", "anticipo", { origen: "manual" }),
    o(810, "Lucía Barrios", "XV años", "Jardín en Santa Catarina Pinula", "carretera", mas(s, 8), "18:00", { tiffany: 150, redonda: 15, mantel: 15, camino: 15, copas: 150, toldo10: 1, luces: 10, audio: 1 }, "reservada", "nada"),
  ];
  const gala = ordenes.find((x) => x.folio === "EVT-806")!;
  gala.pagos.push(pago(cuentas(gala.cesta, gala.zona).total - cuentas(gala.cesta, gala.zona).anticipo, "Visanet", "Aut. 552019", dia(0), false));
  const camiones: Camion[] = [
    { id: "c1", nombre: "Camión 1", ton: "5 Ton", placa: "C-217FKM", piloto: "Carlos M.", pilotoCompleto: "Carlos Morales Pérez", dpi: "2384 51762 0101", estado: "ruta", orden: "EVT-802" },
    { id: "c2", nombre: "Camión 2", ton: "3.5 Ton", placa: "C-482BJR", piloto: "Edwin R.", pilotoCompleto: "Edwin Ramírez López", dpi: "2915 30448 0108", estado: "bodega" },
    { id: "c3", nombre: "Camión 3", ton: "3.5 Ton", placa: "C-356HTV", piloto: "Julio P.", pilotoCompleto: "Julio Pérez Ajú", dpi: "1846 92035 0115", estado: "montaje", orden: "EVT-801" },
    { id: "c4", nombre: "Camión 4", ton: "1.5 Ton", placa: "C-903KRD", piloto: "Marvin L.", pilotoCompleto: "Marvin López Chávez", dpi: "3017 64289 0101", estado: "taller" },
  ];
  return { ordenes, camiones };
}

type Estado = { dia: string; ordenes: Orden[]; camiones: Camion[]; folio: number; pago: number };
const CLAVE = "casa-imperial-v3";
const inicial = (): Estado => ({ dia: dia(0), ...iniciales(), folio: 812, pago: 100 });

function leer(texto: string | null): Estado | null {
  try {
    const v = texto ? (JSON.parse(texto) as Estado) : null;
    return v && v.dia === dia(0) && Array.isArray(v.ordenes) && Array.isArray(v.camiones) ? v : null;
  } catch {
    return null;
  }
}

export type NuevaReserva = Pick<Orden, "cliente" | "tel" | "evento" | "lugar" | "zona" | "fecha" | "hora" | "cesta" | "origen"> & { mia?: boolean };

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
      // almacenamiento bloqueado: el estado vive solo en memoria
    }
  }, [estado]);

  useEffect(() => {
    const otra = (e: StorageEvent) => {
      if (e.key !== CLAVE) return;
      const v = leer(e.newValue);
      if (v) setEstado(v);
    };
    addEventListener("storage", otra);
    return () => removeEventListener("storage", otra);
  }, []);

  const libres = useCallback(
    (fecha: string, id: ArtId) => Math.max(0, ARTICULOS[id].total - estado.ordenes.filter((o) => o.fecha === fecha && o.estado !== "liquidada").reduce((s, o) => s + (o.cesta[id] ?? 0), 0)),
    [estado.ordenes],
  );

  // la ocupación se pondera por precio de renta, no por cantidad de piezas
  const ocupacion = useCallback(
    (fecha: string) => {
      const todo = IDS.reduce((s, id) => s + ARTICULOS[id].total * ARTICULOS[id].precio, 0);
      const libre = IDS.reduce((s, id) => s + libres(fecha, id) * ARTICULOS[id].precio, 0);
      return Math.round(((todo - libre) / todo) * 100);
    },
    [libres],
  );

  const cambiarOrden = useCallback((folio: string, fn: (o: Orden) => Orden) => setEstado((e) => ({ ...e, ordenes: e.ordenes.map((o) => (o.folio === folio ? fn(o) : o)) })), []);
  const cambiarCamion = useCallback((id: string, fn: (c: Camion) => Camion) => setEstado((e) => ({ ...e, camiones: e.camiones.map((c) => (c.id === id ? fn(c) : c)) })), []);

  const reservar = useCallback(
    (n: NuevaReserva) => {
      const orden: Orden = { ...n, folio: `EVT-${estado.folio}`, estado: "reservada", cargado: [], revision: {}, pagos: [], nueva: true };
      setEstado((e) => ({ ...e, folio: e.folio + 1, ordenes: [...e.ordenes, orden] }));
      return orden;
    },
    [estado.folio],
  );

  const reportarPago = useCallback(
    (folio: string, p: Omit<Pago, "id" | "fecha" | "verificado">) =>
      setEstado((e) => ({ ...e, pago: e.pago + 1, ordenes: e.ordenes.map((o) => (o.folio === folio ? { ...o, pagos: [...o.pagos, { ...p, id: e.pago, fecha: dia(0), verificado: false }] } : o)) })),
    [],
  );
  const verificarPagos = useCallback((folio: string) => setEstado((e) => ({ ...e, ordenes: e.ordenes.map((o) => (o.folio === folio ? { ...o, pagos: o.pagos.map((p) => ({ ...p, verificado: true })) } : o)) })), []);

  const despachar = useCallback(
    (folio: string, camion: string) =>
      setEstado((e) => ({
        ...e,
        ordenes: e.ordenes.map((o) => (o.folio === folio ? { ...o, estado: "evento", camion, nueva: false } : o)),
        camiones: e.camiones.map((c) => (c.id === camion ? { ...c, estado: "ruta", orden: folio } : c)),
      })),
    [],
  );

  const recibir = useCallback(
    (folio: string) =>
      setEstado((e) => ({
        ...e,
        ordenes: e.ordenes.map((o) => (o.folio === folio ? { ...o, estado: "retorno" } : o)),
        camiones: e.camiones.map((c) => (c.orden === folio ? { ...c, estado: "bodega", orden: undefined } : c)),
      })),
    [],
  );

  return { ordenes: estado.ordenes, camiones: estado.camiones, libres, ocupacion, reservar, cambiarOrden, cambiarCamion, reportarPago, verificarPagos, despachar, recibir };
}
export type Imperial = ReturnType<typeof useImperial>;
