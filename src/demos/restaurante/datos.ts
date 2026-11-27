/*
 * Brasa & Maíz (restaurante inventado): carta, mesas, envíos y el estado que comparten
 * las tres vistas. Todo se guarda en este navegador, así el panel de cocina y el portal
 * del cliente se ven al día, incluso en dos pestañas. Cada día empieza un turno nuevo.
 */
import { useEffect, useState } from "react";

export const DIRECCION = "2a avenida y 13 calle, Zona 10";
export const CIUDAD = "Ciudad de Guatemala";
export const MAPA = "https://www.google.com/maps/search/?api=1&query=Zona+10+Ciudad+de+Guatemala";

export const foto = (id: string, ancho: number, alto: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${ancho}&h=${alto}&q=72`;

export const FOTOS = {
  portada: "1558030089-02acba3c214e",
  brasa: "1627947063935-55577ec3c2e1",
};

/* ───────── horarios ───────── */

export const HORARIOS = [
  { dias: [1, 2, 3, 4], nombre: "Lunes a jueves", abre: 12, cierra: 22 },
  { dias: [5, 6], nombre: "Viernes y sábado", abre: 12, cierra: 23 },
  { dias: [0], nombre: "Domingo", abre: 12, cierra: 18 },
];

export const horarioDe = (d: Date) => HORARIOS.find((h) => h.dias.includes(d.getDay()))!;

export function abiertoAhora(d = new Date()) {
  const h = horarioDe(d);
  const ahora = d.getHours() + d.getMinutes() / 60;
  return ahora >= h.abre && ahora < h.cierra;
}

/* ───────── fechas y dinero ───────── */

const dos = (n: number) => String(n).padStart(2, "0");
export const aISO = (d: Date) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
export const hoyISO = () => aISO(new Date());
export function masDias(n: number, desde = new Date()) {
  const d = new Date(desde);
  d.setDate(d.getDate() + n);
  return aISO(d);
}
export function fechaLarga(iso: string) {
  const t = new Date(`${iso}T12:00`).toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" });
  return t.charAt(0).toUpperCase() + t.slice(1);
}
export function fechaCorta(iso: string) {
  if (iso === hoyISO()) return "Hoy";
  if (iso === masDias(1)) return "Mañana";
  const t = new Date(`${iso}T12:00`).toLocaleDateString("es-GT", { weekday: "short", day: "numeric", month: "short" });
  return t.charAt(0).toUpperCase() + t.slice(1);
}
export const reloj = (ms: number) => {
  const d = new Date(ms);
  return `${dos(d.getHours())}:${dos(d.getMinutes())}`;
};
export const qz = (n: number) => `Q${Math.round(n).toLocaleString("en-US")}`;

/* ───────── la carta ───────── */

export type Categoria = "entradas" | "fuertes" | "bebidas" | "postres";
export type Filtro = Categoria | "todos";

export const FILTROS: { id: Filtro; nombre: string }[] = [
  { id: "todos", nombre: "Todos" },
  { id: "entradas", nombre: "Entradas" },
  { id: "fuertes", nombre: "Cortes y Fuertes" },
  { id: "bebidas", nombre: "Bebidas" },
  { id: "postres", nombre: "Postres" },
];

export const TERMINOS = ["Rojo", "Medio", "Tres cuartos", "Bien cocido"];
export const GUARNICIONES = ["Papas rústicas", "Elote asado", "Ensalada de la huerta", "Frijoles volteados"];

export type Plato = {
  id: string;
  nombre: string;
  detalle: string;
  precio: number;
  minutos: number;
  categoria: Categoria;
  foto: string;
  alt: string;
  porcion?: string;
  conTermino?: boolean;
  conGuarnicion?: boolean;
};

export const CARTA: Plato[] = [
  {
    id: "elotes",
    nombre: "Elotes a la brasa",
    detalle: "Mantequilla de chile cobanero, queso seco y limón.",
    precio: 48,
    minutos: 12,
    categoria: "entradas",
    foto: "1548365329-6adbd5e89128",
    alt: "Elotes amarillos tostados a la parrilla",
    porcion: "4 piezas",
  },
  {
    id: "guacamol",
    nombre: "Guacamol de molcajete",
    detalle: "Aguacate machacado al momento con totopos de maíz.",
    precio: 58,
    minutos: 8,
    categoria: "entradas",
    foto: "1680992071073-cb1696ba8d3e",
    alt: "Molcajete con guacamol junto a totopos",
    porcion: "Para compartir",
  },
  {
    id: "ribeye",
    nombre: "Ribeye a la leña",
    detalle: "Madurado, sellado sobre encino, con mantequilla de hierbas.",
    precio: 245,
    minutos: 28,
    categoria: "fuertes",
    foto: "1778855400007-37cbd89592ef",
    alt: "Ribeye rebanado con mantequilla de hierbas y papas",
    porcion: "14 oz",
    conTermino: true,
    conGuarnicion: true,
  },
  {
    id: "puyazo",
    nombre: "Puyazo al carbón",
    detalle: "Con su capa de grasa dorada, sal gruesa y chirmol.",
    precio: 185,
    minutos: 25,
    categoria: "fuertes",
    foto: "1529692236671-f1f6cf9683ba",
    alt: "Puyazo al carbón cortado en la tabla",
    porcion: "10 oz",
    conTermino: true,
    conGuarnicion: true,
  },
  {
    id: "costillas",
    nombre: "Costillas ahumadas",
    detalle: "Seis horas al humo, glaseadas con tamarindo y panela.",
    precio: 165,
    minutos: 20,
    categoria: "fuertes",
    foto: "1700077103134-17a454ee5f09",
    alt: "Costillas glaseadas con cebollín sobre tabla",
    porcion: "Medio costillar",
    conGuarnicion: true,
  },
  {
    id: "ahumado",
    nombre: "Ahumado de la casa",
    detalle: "Ron añejo, panela, amargo y cáscara de naranja.",
    precio: 68,
    minutos: 6,
    categoria: "bebidas",
    foto: "1761361371739-546f12a9cee4",
    alt: "Cóctel color ámbar con hielo y cáscara de naranja",
    porcion: "Solo mayores de 18",
  },
  {
    id: "jamaica",
    nombre: "Jamaica con naranja",
    detalle: "Rosa de jamaica en frío, naranja deshidratada y romero.",
    precio: 28,
    minutos: 4,
    categoria: "bebidas",
    foto: "1654922704274-cd34f165c5e7",
    alt: "Vaso de rosa de jamaica con rodaja de naranja y romero",
    porcion: "16 oz",
  },
  {
    id: "flan",
    nombre: "Flan de la casa",
    detalle: "Cremoso, con caramelo oscuro y vainilla.",
    precio: 42,
    minutos: 5,
    categoria: "postres",
    foto: "1702728109878-c61a98d80491",
    alt: "Flan con caramelo sobre plato blanco",
    porcion: "Individual",
  },
];

export const platoDe = (id: string) => CARTA.find((p) => p.id === id)!;

/* ───────── ambientes, mesas y envíos ───────── */

export type ZonaId = "salon" | "terraza" | "privado";
export type Zona = { id: ZonaId; nombre: string; detalle: string; min: number; max: number; cupo: number; foto: string; alt: string };

/* cupo: reservas que caben en el mismo bloque de hora y media */
export const ZONAS: Zona[] = [
  { id: "salon", nombre: "Salón", detalle: "Mesas amplias cerca del bar. De 1 a 8 personas.", min: 1, max: 8, cupo: 4, foto: "1744776411221-702f2848b0b2", alt: "Salón con mesas puestas y copas para la cena" },
  { id: "terraza", nombre: "Terraza", detalle: "Al aire libre, entre plantas. De 1 a 6 personas.", min: 1, max: 6, cupo: 3, foto: "1665758564802-f611df512d8d", alt: "Terraza con mesas entre plantas y sombra" },
  { id: "privado", nombre: "Privado", detalle: "Un salón solo para su grupo. De 6 a 14 personas.", min: 6, max: 14, cupo: 1, foto: "1673081752959-addbc864f678", alt: "Mesa larga puesta en un salón privado" },
];
export const zonaDe = (id: ZonaId) => ZONAS.find((z) => z.id === id)!;

export type EnvioId = "z10" | "z14" | "z15" | "cayala";
export const ENVIOS: { id: EnvioId; nombre: string; precio: number; minutos: number }[] = [
  { id: "z10", nombre: "Zona 10", precio: 20, minutos: 35 },
  { id: "z14", nombre: "Zona 14", precio: 25, minutos: 40 },
  { id: "z15", nombre: "Zona 15", precio: 30, minutos: 45 },
  { id: "cayala", nombre: "Cayalá y Zona 16", precio: 35, minutos: 50 },
];
export const envioDe = (id: EnvioId) => ENVIOS.find((e) => e.id === id)!;

/* ───────── pedidos y reservas ───────── */

export type Modo = "domicilio" | "recoger";
export type Etapa = "recibido" | "parrilla" | "empacado" | "camino" | "entregado";
export const ETAPAS: Etapa[] = ["recibido", "parrilla", "empacado", "camino", "entregado"];

export const nombreEtapa = (e: Etapa, modo: Modo) =>
  ({
    recibido: "Recibido",
    parrilla: "En parrilla",
    empacado: "Empacado",
    camino: modo === "domicilio" ? "En camino" : "Listo para recoger",
    entregado: "Entregado",
  })[e];

export type Linea = { clave: string; id: string; cantidad: number; termino?: string; guarnicion?: string };
export type Cliente = { nombre: string; telefono: string; direccion: string; notas: string };
export type Pedido = {
  codigo: string;
  creado: number;
  modo: Modo;
  envio: EnvioId;
  cliente: Cliente;
  lineas: Linea[];
  subtotal: number;
  costoEnvio: number;
  etapa: Etapa;
  marcas: Partial<Record<Etapa, number>>;
};

export type EstadoReserva = "confirmada" | "sentada" | "cancelada";
export type Reserva = { codigo: string; fecha: string; hora: string; personas: number; zona: ZonaId; nombre: string; telefono: string; estado: EstadoReserva; mesa?: string };
export type Mesa = { id: string; zona: ZonaId; lugares: number; ocupada: boolean };

export const totalPedido = (p: Pedido) => p.subtotal + p.costoEnvio;
/* hora estimada: el platillo más tardado, más el camino si va a domicilio */
export function estimado(p: Pedido) {
  const cocina = Math.max(...p.lineas.map((l) => platoDe(l.id).minutos));
  const minutos = p.modo === "domicilio" ? Math.max(envioDe(p.envio).minutos, cocina + 15) : cocina + 5;
  return p.creado + minutos * 60_000;
}
export const detalleLinea = (l: Linea) => [l.termino, l.guarnicion].filter(Boolean).join(" · ");

export function mensajePedido(p: Pedido) {
  const lineas = p.lineas.map((l) => {
    const d = detalleLinea(l);
    return `• ${l.cantidad} × ${platoDe(l.id).nombre}${d ? ` (${d})` : ""}: ${qz(platoDe(l.id).precio * l.cantidad)}`;
  });
  return [
    `Hola, Brasa & Maíz. Mi pedido ${p.codigo} ${p.modo === "domicilio" ? "es a domicilio" : "lo paso a recoger"}.`,
    ...lineas,
    p.costoEnvio ? `Envío a ${envioDe(p.envio).nombre}: ${qz(p.costoEnvio)}` : "",
    `Total: ${qz(totalPedido(p))}`,
    `Nombre: ${p.cliente.nombre}`,
    `Teléfono: ${p.cliente.telefono}`,
    p.modo === "domicilio" ? `Dirección: ${p.cliente.direccion}` : "",
    p.cliente.notas ? `Notas: ${p.cliente.notas}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export const mensajeReserva = (r: Reserva) =>
  `Hola, Brasa & Maíz. Reservé mesa (${r.codigo}) para ${r.personas} ${r.personas === 1 ? "persona" : "personas"}, ${fechaLarga(r.fecha).toLowerCase()} a las ${r.hora}, en ${zonaDe(r.zona).nombre}. A nombre de ${r.nombre}.`;

export const enlaceWhatsApp = (texto: string) => `https://wa.me/?text=${encodeURIComponent(texto)}`;

/* ───────── horas disponibles ───────── */

const aMinutos = (hora: string) => Number(hora.slice(0, 2)) * 60 + Number(hora.slice(3));

/* Cada media hora, desde que abre hasta una hora antes de cerrar. Hoy solo lo que falta (con 30 min de margen). */
export function horasDe(fecha: string) {
  if (!fecha || fecha < hoyISO()) return [];
  const h = horarioDe(new Date(`${fecha}T12:00`));
  const ahora = new Date();
  const desde = fecha === hoyISO() ? ahora.getHours() * 60 + ahora.getMinutes() + 30 : 0;
  const horas: string[] = [];
  for (let m = h.abre * 60; m <= (h.cierra - 1) * 60; m += 30) {
    if (m >= desde) horas.push(`${dos(Math.floor(m / 60))}:${dos(m % 60)}`);
  }
  return horas;
}

export function horasConCupo(fecha: string, zona: ZonaId, reservas: Reserva[], menos?: string) {
  const z = zonaDe(zona);
  return horasDe(fecha).map((hora) => {
    const juntas = reservas.filter((r) => r.codigo !== menos && r.estado !== "cancelada" && r.fecha === fecha && r.zona === zona && Math.abs(aMinutos(r.hora) - aMinutos(hora)) < 90);
    return { hora, libre: juntas.length < z.cupo };
  });
}

/* ───────── estado compartido ───────── */

export type Estado = {
  dia: string;
  lineas: Linea[];
  modo: Modo;
  envio: EnvioId;
  cliente: Cliente;
  pedidos: Pedido[];
  misPedidos: string[];
  reservas: Reserva[];
  misReservas: string[];
  mesas: Mesa[];
  agotados: string[];
  nPedido: number;
  nReserva: number;
};

/* lo que suma el pedido que se está armando */
export function resumenPedido({ lineas, modo, envio }: Estado) {
  const cantidad = lineas.reduce((s, l) => s + l.cantidad, 0);
  const subtotal = lineas.reduce((s, l) => s + platoDe(l.id).precio * l.cantidad, 0);
  const costoEnvio = modo === "domicilio" && cantidad ? envioDe(envio).precio : 0;
  return { cantidad, subtotal, costoEnvio, total: subtotal + costoEnvio };
}

const SIN_DATOS: Cliente = { nombre: "", telefono: "", direccion: "", notas: "" };

function turnoNuevo(): Estado {
  const ahora = Date.now();
  const hace = (min: number) => ahora - min * 60_000;
  const linea = (id: string, cantidad: number, termino?: string, guarnicion?: string): Linea => ({ clave: [id, termino, guarnicion].join("|"), id, cantidad, termino, guarnicion });
  const pedido = (codigo: string, creado: number, modo: Modo, envio: EnvioId, cliente: Cliente, lineas: Linea[], etapa: Etapa, marcas: Pedido["marcas"]): Pedido => ({
    codigo,
    creado,
    modo,
    envio,
    cliente,
    lineas,
    etapa,
    marcas,
    subtotal: lineas.reduce((s, l) => s + platoDe(l.id).precio * l.cantidad, 0),
    costoEnvio: modo === "domicilio" ? envioDe(envio).precio : 0,
  });

  /* el primer día desde hoy en el que todavía caben cenas */
  const dia = [0, 1, 2, 3].map((n) => masDias(n)).find((f) => horasDe(f).length >= 5) ?? masDias(1);
  const horas = horasDe(dia);
  const cerca = (deseada: string) => (horas.includes(deseada) ? deseada : horas[Math.max(0, horas.length - 3)]);
  const reserva = (codigo: string, hora: string, personas: number, zona: ZonaId, nombre: string, telefono: string): Reserva => ({ codigo, fecha: dia, hora: cerca(hora), personas, zona, nombre, telefono, estado: "confirmada" });
  const mesas = (zona: ZonaId, letra: string, lugares: number[]): Mesa[] => lugares.map((n, i) => ({ id: `${letra}${i + 1}`, zona, lugares: n, ocupada: false }));

  return {
    dia: hoyISO(),
    lineas: [],
    modo: "domicilio",
    envio: "z10",
    cliente: SIN_DATOS,
    pedidos: [
      pedido(
        "PED-207",
        hace(31),
        "recoger",
        "z10",
        { nombre: "Luis Cabrera", telefono: "5500 1207", direccion: "", notas: "" },
        [linea("costillas", 1, undefined, "Elote asado"), linea("jamaica", 2)],
        "empacado",
        { recibido: hace(31), parrilla: hace(27), empacado: hace(6) },
      ),
      pedido(
        "PED-208",
        hace(4),
        "domicilio",
        "cayala",
        { nombre: "Sofía Herrera", telefono: "5500 1208", direccion: "Paseo Cayalá, edificio B, apto. 304", notas: "Cubiertos para dos, por favor." },
        [linea("puyazo", 2, "Tres cuartos", "Papas rústicas"), linea("guacamol", 1)],
        "recibido",
        { recibido: hace(4) },
      ),
      pedido(
        "PED-209",
        hace(16),
        "domicilio",
        "z10",
        { nombre: "Andrea Morales", telefono: "5500 1209", direccion: "12 calle 1-25, Zona 10, apto. 5B", notas: "Avisar en garita." },
        [linea("ribeye", 1, "Medio", "Papas rústicas"), linea("elotes", 1), linea("flan", 2)],
        "parrilla",
        { recibido: hace(16), parrilla: hace(11) },
      ),
    ],
    misPedidos: ["PED-209"],
    reservas: [
      reserva("RES-116", "19:00", 2, "salon", "Marta Lemus", "5500 1116"),
      reserva("RES-117", "19:30", 8, "privado", "Carlos Ruiz", "5500 1117"),
      reserva("RES-118", "20:00", 4, "terraza", "Andrea Morales", "5500 1209"),
    ],
    misReservas: ["RES-118"],
    mesas: [...mesas("salon", "S", [2, 2, 4, 4, 4, 6, 6, 8]), ...mesas("terraza", "T", [2, 2, 4, 4, 6]), ...mesas("privado", "P", [14])].map((m) => ({ ...m, ocupada: ["S2", "S4", "S6", "T3"].includes(m.id) })),
    agotados: [],
    nPedido: 210,
    nReserva: 119,
  };
}

const CLAVE = "brasa-maiz-v1";

function leerGuardado(crudo: string | null): Estado | null {
  try {
    const g = JSON.parse(crudo ?? "null") as Estado | null;
    return g && g.dia === hoyISO() && Array.isArray(g.pedidos) && Array.isArray(g.mesas) ? g : null;
  } catch {
    return null;
  }
}

function leer() {
  try {
    return leerGuardado(localStorage.getItem(CLAVE)) ?? turnoNuevo();
  } catch {
    return turnoNuevo();
  }
}

export function useBrasa() {
  const [estado, setEstado] = useState<Estado>(leer);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {
      /* en modo privado sigue funcionando, sin guardar */
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

  const agregar = (id: string, termino?: string, guarnicion?: string) =>
    setEstado((e) => {
      if (e.agotados.includes(id)) return e;
      const clave = [id, termino, guarnicion].join("|");
      const hay = e.lineas.some((l) => l.clave === clave);
      const lineas = hay ? e.lineas.map((l) => (l.clave === clave ? { ...l, cantidad: Math.min(20, l.cantidad + 1) } : l)) : [...e.lineas, { clave, id, cantidad: 1, termino, guarnicion }];
      return { ...e, lineas };
    });

  const ponerCantidad = (clave: string, n: number) =>
    setEstado((e) => ({ ...e, lineas: n < 1 ? e.lineas.filter((l) => l.clave !== clave) : e.lineas.map((l) => (l.clave === clave ? { ...l, cantidad: Math.min(20, n) } : l)) }));

  const ponerModo = (modo: Modo) => setEstado((e) => ({ ...e, modo }));
  const ponerEnvio = (envio: EnvioId) => setEstado((e) => ({ ...e, envio }));
  const ponerCliente = (cambio: Partial<Cliente>) => setEstado((e) => ({ ...e, cliente: { ...e.cliente, ...cambio } }));

  /* registra la orden: aparece en cocina y en "Mi Pedido", y deja el pedido en blanco */
  const enviarPedido = (): Pedido | null => {
    if (!estado.lineas.length || estado.lineas.some((l) => estado.agotados.includes(l.id))) return null;
    const creado = Date.now();
    const c = estado.cliente;
    const nuevo: Pedido = {
      codigo: `PED-${estado.nPedido}`,
      creado,
      modo: estado.modo,
      envio: estado.envio,
      cliente: { nombre: c.nombre.trim(), telefono: c.telefono.trim(), direccion: c.direccion.trim(), notas: c.notas.trim() },
      lineas: estado.lineas,
      subtotal: estado.lineas.reduce((s, l) => s + platoDe(l.id).precio * l.cantidad, 0),
      costoEnvio: estado.modo === "domicilio" ? envioDe(estado.envio).precio : 0,
      etapa: "recibido",
      marcas: { recibido: creado },
    };
    setEstado((e) => ({ ...e, lineas: [], cliente: { ...e.cliente, notas: "" }, pedidos: [...e.pedidos, nuevo], misPedidos: [nuevo.codigo, ...e.misPedidos], nPedido: e.nPedido + 1 }));
    return nuevo;
  };

  /* paso: 1 avanza, -1 regresa */
  const mover = (codigo: string, paso: 1 | -1) =>
    setEstado((e) => ({
      ...e,
      pedidos: e.pedidos.map((p) => {
        if (p.codigo !== codigo) return p;
        const i = ETAPAS.indexOf(p.etapa);
        const etapa = ETAPAS[Math.min(ETAPAS.length - 1, Math.max(0, i + paso))];
        const marcas = { ...p.marcas };
        if (paso === 1) marcas[etapa] = Date.now();
        else delete marcas[p.etapa];
        return { ...p, etapa, marcas };
      }),
    }));

  const reservar = (datos: Omit<Reserva, "codigo" | "estado" | "mesa">): Reserva => {
    const nueva: Reserva = { ...datos, codigo: `RES-${estado.nReserva}`, estado: "confirmada" };
    setEstado((e) => ({ ...e, reservas: [...e.reservas, nueva], misReservas: [nueva.codigo, ...e.misReservas], nReserva: e.nReserva + 1 }));
    return nueva;
  };

  const cambiarHora = (codigo: string, fecha: string, hora: string) => setEstado((e) => ({ ...e, reservas: e.reservas.map((r) => (r.codigo === codigo ? { ...r, fecha, hora } : r)) }));

  const cancelarReserva = (codigo: string) => setEstado((e) => ({ ...e, reservas: e.reservas.map((r) => (r.codigo === codigo ? { ...r, estado: "cancelada" } : r)) }));

  /* mesa libre más ajustada de la zona para ese grupo */
  const mesaPara = (r: Reserva) => estado.mesas.filter((m) => m.zona === r.zona && !m.ocupada && m.lugares >= r.personas).sort((a, b) => a.lugares - b.lugares)[0];

  const sentar = (codigo: string) => {
    const r = estado.reservas.find((x) => x.codigo === codigo);
    const mesa = r && mesaPara(r);
    if (!mesa) return null;
    setEstado((e) => ({
      ...e,
      mesas: e.mesas.map((m) => (m.id === mesa.id ? { ...m, ocupada: true } : m)),
      reservas: e.reservas.map((x) => (x.codigo === codigo ? { ...x, estado: "sentada", mesa: mesa.id } : x)),
    }));
    return mesa.id;
  };

  const alternarMesa = (id: string) => setEstado((e) => ({ ...e, mesas: e.mesas.map((m) => (m.id === id ? { ...m, ocupada: !m.ocupada } : m)) }));
  const alternarAgotado = (id: string) => setEstado((e) => ({ ...e, agotados: e.agotados.includes(id) ? e.agotados.filter((x) => x !== id) : [...e.agotados, id] }));
  const reiniciar = () => setEstado(turnoNuevo());

  return { estado, agregar, ponerCantidad, ponerModo, ponerEnvio, ponerCliente, enviarPedido, mover, reservar, cambiarHora, cancelarReserva, mesaPara, sentar, alternarMesa, alternarAgotado, reiniciar };
}

export type Brasa = ReturnType<typeof useBrasa>;
