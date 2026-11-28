export type Especie = "perro" | "gato";
export type Area = "consulta" | "grooming";
export type Estado = "espera" | "atencion" | "lista" | "entregada";
export type Estacion = "consultorio1" | "consultorio2" | "grooming";
export type Metodo = "Efectivo" | "Visanet" | "NeoNet" | "Transferencia BI" | "Transferencia BAC";

export type ServicioId = "consulta" | "bano-pequeno" | "bano-mediano" | "bano-grande" | "vacuna";

export type Servicio = {
  nombre: string;
  precio: number;
  area: Area;
  paraGatos: boolean;
  soloTarifario?: boolean;
};

export const SERVICIOS: Record<ServicioId, Servicio> = {
  consulta: { nombre: "Consulta General", precio: 225, area: "consulta", paraGatos: true },
  "bano-pequeno": { nombre: "Baño y Corte Raza Pequeña", precio: 180, area: "grooming", paraGatos: true },
  "bano-mediano": { nombre: "Baño y Corte Raza Mediana", precio: 215, area: "grooming", paraGatos: false, soloTarifario: true },
  "bano-grande": { nombre: "Baño y Corte Raza Grande", precio: 250, area: "grooming", paraGatos: false },
  vacuna: { nombre: "Refuerzo Vacuna Séxtuple", precio: 195, area: "consulta", paraGatos: false },
};

export const IDS_SERVICIO = Object.keys(SERVICIOS) as ServicioId[];
export const aplicaA = (servicio: ServicioId, especie: Especie) => especie === "perro" || SERVICIOS[servicio].paraGatos;

export const AREAS: Record<Area, { nombre: string; capacidad: number; horas: string[] }> = {
  consulta: {
    nombre: "Consulta Médica",
    capacidad: 2,
    horas: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"],
  },
  grooming: { nombre: "Grooming", capacidad: 1, horas: ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"] },
};

export const ESTACIONES: Record<Estacion, { nombre: string; area: Area; cupo: number }> = {
  consultorio1: { nombre: "Consultorio 1", area: "consulta", cupo: 1 },
  consultorio2: { nombre: "Consultorio 2", area: "consulta", cupo: 1 },
  grooming: { nombre: "Estación Grooming", area: "grooming", cupo: 2 },
};

export const IDS_ESTACION = Object.keys(ESTACIONES) as Estacion[];

export const ESTADOS: Record<Estado, { panel: string; dueno: string }> = {
  espera: { panel: "En espera", dueno: "Confirmada" },
  atencion: { panel: "En atención", dueno: "En baño / consulta" },
  lista: { panel: "Lista para recoger", dueno: "Lista para recoger" },
  entregada: { panel: "Entregada", dueno: "Entregada" },
};

export const IDS_ESTADO = Object.keys(ESTADOS) as Estado[];
export const METODOS: Metodo[] = ["Efectivo", "Visanet", "NeoNet", "Transferencia BI", "Transferencia BAC"];

export const SEDE = {
  corta: "Sede Zona 15 · Vista Hermosa",
  direccion: "14 avenida 12-45, Vista Hermosa II, Zona 15, Ciudad de Guatemala",
  telefono: "2369 4040",
  enlaceTelefono: "tel:+50223694040",
  mapa: "https://www.google.com/maps/search/?api=1&query=Vista+Hermosa+II+Zona+15+Ciudad+de+Guatemala",
};

export const SECCIONES = [
  { id: "servicios", nombre: "Servicios" },
  { id: "grooming", nombre: "Grooming" },
  { id: "pet-shop", nombre: "Pet Shop" },
  { id: "urgencias", nombre: "Urgencias 24h" },
];

export const FOTOS = {
  portada: "1654895716780-b4664497420d",
  consulta: "1770836037949-c5e8db65aa86",
  grooming: "1719464454959-9cf304ef4774",
  hotel: "1717616729494-10c4c47c1e23",
  pequeno: "1772437883387-8076cf660c65",
  mediano: "1581887936036-3f4f7f0b6679",
  grande: "1693615775129-f2004d6e3e0b",
  urgencias: "1733783506192-653df6185a7d",
  max: "1633722715463-d30f4f325e24",
  luna: "1612126258173-85375840a9ff",
};

export const urlFoto = (id: string, ancho: number, alto: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${ancho}&h=${alto}&q=72`;

export type Categoria = "perros" | "gatos" | "farmacia";
export type Producto = { id: string; nombre: string; detalle: string; precio: number; categorias: Categoria[]; foto: string; envioGratis?: boolean };

export const FILTROS_TIENDA: { id: Categoria | "todos"; nombre: string }[] = [
  { id: "todos", nombre: "Todos" },
  { id: "perros", nombre: "Perros" },
  { id: "gatos", nombre: "Gatos" },
  { id: "farmacia", nombre: "Farmacia" },
];

export const PRODUCTOS: Producto[] = [
  { id: "adulto-perro", nombre: "Concentrado perro adulto", detalle: "Raza mediana y grande · 15 kg", precio: 465, categorias: ["perros"], foto: "1589924691995-400dc9ecc119", envioGratis: true },
  { id: "cachorro", nombre: "Concentrado cachorro", detalle: "Todas las razas · 8 kg", precio: 325, categorias: ["perros"], foto: "1714068691210-073dc52c6c1d", envioGratis: true },
  { id: "adulto-gato", nombre: "Concentrado gato adulto", detalle: "Control de bolas de pelo · 7.5 kg", precio: 345, categorias: ["gatos"], foto: "1580238169544-86bf7cd8c84c", envioGratis: true },
  { id: "premios", nombre: "Premios dentales", detalle: "Bolsa de 500 g", precio: 68, categorias: ["perros"], foto: "1568640347023-a616a30bc3bd" },
  { id: "correa", nombre: "Correa impermeable", detalle: "1.5 m · fácil de lavar", precio: 125, categorias: ["perros"], foto: "1708062270853-ee7c66b69f07" },
  { id: "cama", nombre: "Cama acolchada", detalle: "Talla grande · funda lavable", precio: 385, categorias: ["perros"], foto: "1581888227599-779811939961" },
  { id: "rascador", nombre: "Rascador de poste", detalle: "Sisal natural · 45 cm", precio: 165, categorias: ["gatos"], foto: "1545249390-6bdfa286032f" },
  { id: "shampoo", nombre: "Shampoo dermatológico", detalle: "Avena coloidal · 500 ml", precio: 115, categorias: ["farmacia", "perros"], foto: "1647002380358-fc70ed2f04e0" },
  { id: "articular", nombre: "Suplemento articular", detalle: "60 cápsulas · con indicación médica", precio: 210, categorias: ["farmacia", "perros", "gatos"], foto: "1763668331599-487470fb85b2" },
  { id: "desparasitante", nombre: "Desparasitante interno", detalle: "Tabletas según el peso", precio: 85, categorias: ["farmacia", "perros", "gatos"], foto: "1544991875-5dc1b05f607d" },
];

export const VACUNAS: Record<Especie, { nombre: string; meses: number }[]> = {
  perro: [
    { nombre: "Séxtuple canina", meses: 12 },
    { nombre: "Antirrábica", meses: 12 },
    { nombre: "Bordetella", meses: 12 },
    { nombre: "Desparasitación interna", meses: 3 },
    { nombre: "Antipulgas y garrapatas", meses: 1 },
  ],
  gato: [
    { nombre: "Triple felina", meses: 12 },
    { nombre: "Antirrábica", meses: 12 },
    { nombre: "Leucemia felina", meses: 12 },
    { nombre: "Desparasitación interna", meses: 3 },
    { nombre: "Antipulgas", meses: 1 },
  ],
};

export const MEDICOS = [
  { nombre: "Dra. Mariela Ortiz", colegiado: "1482" },
  { nombre: "Dr. Julio Cabrera", colegiado: "2067" },
];

export const colegiadoDe = (medico: string) => MEDICOS.find((m) => m.nombre === medico)?.colegiado ?? "";

export type Vacuna = { id: string; nombre: string; aplicada: string; proxima: string; medico: string };
export type Peso = { fecha: string; kg: number };
export type Indicacion = { id: string; fecha: string; hasta: string; medico: string; medicamento: string; dosis: string; cuidados: string };

export type Mascota = {
  id: string;
  nombre: string;
  especie: Especie;
  raza: string;
  edad: string;
  dueno: string;
  telefono: string;
  foto?: string;
  expediente: string;
  notas: string;
  alimento?: string;
  pesos: Peso[];
  vacunas: Vacuna[];
  indicaciones: Indicacion[];
};

export type ExtraId = "unas" | "deslanado";

export const EXTRAS: Record<ExtraId, { nombre: string; precio: number }> = {
  unas: { nombre: "Corte de uñas", precio: 35 },
  deslanado: { nombre: "Deslanado", precio: 60 },
};

export const IDS_EXTRA = Object.keys(EXTRAS) as ExtraId[];

export type Horario = { fecha: string; hora: string };
export type SolicitudCita = Horario & { tipo: "nueva" | "cambio"; propuesta?: Horario };

export type Cita = {
  id: string;
  mascotaId: string;
  servicio: ServicioId;
  fecha: string;
  hora: string;
  estado: Estado;
  estacion?: Estacion;
  cobro?: Metodo;
  desdeWeb?: boolean;
  extras?: ExtraId[];
  solicitud?: SolicitudCita;
  confirmadaPorClinica?: boolean;
};

export type Cargo = { id: string; dueno: string; productoId: string; cobro?: Metodo; cobradoEl?: string };

export type Articulo = { id: string; nombre: string; precio: number; tipo: "alimento" | "preventivo"; especie: Especie };

export const ARTICULOS: Articulo[] = [
  { id: "proplan", nombre: "Pro Plan Adulto 15 kg", precio: 540, tipo: "alimento", especie: "perro" },
  { id: "perro-adulto", nombre: "Concentrado perro adulto 15 kg", precio: 465, tipo: "alimento", especie: "perro" },
  { id: "cachorro", nombre: "Concentrado cachorro 8 kg", precio: 325, tipo: "alimento", especie: "perro" },
  { id: "royal-indoor", nombre: "Royal Canin Indoor 3 kg", precio: 265, tipo: "alimento", especie: "gato" },
  { id: "gato-adulto", nombre: "Concentrado gato adulto 7.5 kg", precio: 345, tipo: "alimento", especie: "gato" },
  { id: "nexgard", nombre: "NexGard masticable · 1 mes", precio: 135, tipo: "preventivo", especie: "perro" },
  { id: "nexgard-combo", nombre: "NexGard Combo para gato · 1 mes", precio: 145, tipo: "preventivo", especie: "gato" },
];

export const articulo = (id: string) => ARTICULOS.find((a) => a.id === id);

export type EstadoPedido = "solicitado" | "ruta" | "entregado";
export type Pedido = { id: string; mascotaId: string; dueno: string; articulos: string[]; direccion: string; estado: EstadoPedido; cobro?: Metodo; cobradoEl?: string };

export const CLIENTA = { nombre: "Andrea Recinos", telefono: "5512 8830", direccion: "Condominio Las Luces, casa 14, Vista Hermosa III, zona 15" };

const dosCifras = (n: number) => String(n).padStart(2, "0");
const aIso = (d: Date) => `${d.getFullYear()}-${dosCifras(d.getMonth() + 1)}-${dosCifras(d.getDate())}`;
const aFecha = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d);
};

export const hoyIso = () => aIso(new Date());

export function enDias(dias: number) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return aIso(d);
}

export function sumarMeses(iso: string, meses: number) {
  const base = aFecha(iso);
  const destino = new Date(base.getFullYear(), base.getMonth() + meses, 1);
  const ultimoDia = new Date(destino.getFullYear(), destino.getMonth() + 1, 0).getDate();
  destino.setDate(Math.min(base.getDate(), ultimoDia));
  return aIso(destino);
}

export const diasHasta = (iso: string) => Math.round((aFecha(iso).getTime() - aFecha(hoyIso()).getTime()) / 86_400_000);
export const fechaCorta = (iso: string) => aFecha(iso).toLocaleDateString("es-GT", { day: "numeric", month: "short", year: "numeric" });
export const fechaLarga = (iso: string) => aFecha(iso).toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" });
export const fechaRelativa = (iso: string) => (iso === hoyIso() ? "Hoy" : iso === enDias(1) ? "Mañana" : fechaLarga(iso).replace(/^./, (l) => l.toUpperCase()));

export function hora12(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return `${h % 12 || 12}:${dosCifras(m)} ${h < 12 ? "a. m." : "p. m."}`;
}

export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;
export const enlaceWhatsApp = (mensaje: string) => `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
