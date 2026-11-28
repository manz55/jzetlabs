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

export const MEDICOS = ["Dra. Mariela Ortiz", "Dr. Julio Cabrera"];

export type Vacuna = { id: string; nombre: string; aplicada: string; proxima: string; medico: string };
export type Peso = { fecha: string; kg: number };

export type Mascota = {
  id: string;
  nombre: string;
  especie: Especie;
  raza: string;
  edad: string;
  dueno: string;
  telefono: string;
  foto?: string;
  pesos: Peso[];
  vacunas: Vacuna[];
};

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
};

export type Cargo = { id: string; dueno: string; productoId: string; cobro?: Metodo; cobradoEl?: string };

export const CLIENTA = { nombre: "Andrea Recinos", telefono: "5512 8830" };

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

function vacuna(nombre: string, proximaEn: number, meses: number, medico = MEDICOS[0]): Vacuna {
  const proxima = enDias(proximaEn);
  return { id: `${nombre}-${proximaEn}`, nombre, proxima, aplicada: sumarMeses(proxima, -meses), medico };
}

const pesos = (...kilos: number[]): Peso[] => kilos.map((kg, i) => ({ kg, fecha: sumarMeses(hoyIso(), -3 * (kilos.length - i)) }));

function paciente(id: string, nombre: string, especie: Especie, raza: string, edad: string, dueno: string, telefono: string, foto: string, kg: number, vacunas: Vacuna[]): Mascota {
  return { id, nombre, especie, raza, edad, dueno, telefono, foto, pesos: pesos(kg), vacunas };
}

export function mascotasIniciales(): Mascota[] {
  return [
    {
      id: "max",
      nombre: "Max",
      especie: "perro",
      raza: "Golden Retriever",
      edad: "4 años",
      dueno: CLIENTA.nombre,
      telefono: CLIENTA.telefono,
      foto: FOTOS.max,
      pesos: pesos(29.4, 30.8, 31.6, 31.2),
      vacunas: [
        vacuna("Séxtuple canina", 142, 12),
        vacuna("Antirrábica", 96, 12, MEDICOS[1]),
        vacuna("Bordetella", 58, 12),
        vacuna("Desparasitación interna", 24, 3, MEDICOS[1]),
      ],
    },
    {
      id: "luna",
      nombre: "Luna",
      especie: "gato",
      raza: "Gato Criollo",
      edad: "2 años",
      dueno: CLIENTA.nombre,
      telefono: CLIENTA.telefono,
      foto: FOTOS.luna,
      pesos: pesos(3.6, 3.9, 4.1, 4.2),
      vacunas: [vacuna("Triple felina", 3, 12), vacuna("Antirrábica", 118, 12), vacuna("Leucemia felina", 74, 12, MEDICOS[1]), vacuna("Desparasitación interna", 41, 3)],
    },
    paciente("rocky", "Rocky", "perro", "Bóxer", "5 años", "Carlos Méndez", "4478 1203", "1442605527737-ed62b867591f", 28.5, [vacuna("Séxtuple canina", 210, 12)]),
    paciente("mia", "Mía", "gato", "Siamés", "1 año", "Gabriela Soto", "5901 6624", "1568152950566-c1bf43f4ab28", 3.4, [vacuna("Triple felina", 365, 12)]),
    paciente("bruno", "Bruno", "perro", "Schnauzer miniatura", "3 años", "Luis Paiz", "3015 7789", "1579698374511-6017bd6db7f2", 8.2, [vacuna("Antirrábica", 190, 12)]),
    paciente("kira", "Kira", "perro", "Pastor Alemán", "6 años", "Mónica Arriola", "5236 4410", "1625321483581-e4b662b8abf1", 33.1, [vacuna("Bordetella", 87, 12)]),
    paciente("coco", "Coco", "perro", "French Poodle", "7 años", "Silvia de León", "4152 0937", "1772437883387-8076cf660c65", 6.8, [vacuna("Antirrábica", 5, 12)]),
    paciente("simon", "Simón", "gato", "Persa", "8 años", "Jorge Batres", "5788 2146", "1733783506192-653df6185a7d", 5.1, [vacuna("Triple felina", 132, 12)]),
    paciente("nala", "Nala", "gato", "Gato Criollo", "3 años", "Paola Estrada", "3390 5528", "1719305406153-b0d36aa305ac", 4.4, [vacuna("Triple felina", 6, 12)]),
    paciente("toby", "Toby", "perro", "Cocker Spaniel", "4 años", "Ricardo Alvarado", "4620 8851", "1657088746570-0218626e8f55", 13.7, [vacuna("Séxtuple canina", 2, 12)]),
    paciente("olivia", "Olivia", "perro", "Beagle", "2 años", "Fernanda Cifuentes", "5144 3072", "1685387714443-53931626d59b", 11.3, [vacuna("Séxtuple canina", 19, 12)]),
  ];
}

export function citasIniciales(): Cita[] {
  const hoy = hoyIso();
  const cita = (id: string, mascotaId: string, servicio: ServicioId, hora: string, estado: Estado, extra: Partial<Cita> = {}): Cita => ({ id, mascotaId, servicio, fecha: hoy, hora, estado, ...extra });
  return [
    cita("c1", "rocky", "consulta", "08:00", "entregada", { cobro: "Visanet" }),
    cita("c2", "mia", "consulta", "08:30", "entregada", { cobro: "Efectivo" }),
    cita("c3", "bruno", "bano-pequeno", "09:00", "entregada", { cobro: "NeoNet" }),
    cita("c4", "kira", "consulta", "09:30", "atencion", { estacion: "consultorio1" }),
    cita("c5", "coco", "bano-pequeno", "10:00", "atencion", { estacion: "grooming" }),
    cita("c6", "simon", "consulta", "10:30", "lista"),
    cita("c7", "max", "bano-grande", "11:00", "espera"),
    cita("c8", "nala", "consulta", "11:30", "espera"),
    cita("c9", "toby", "bano-mediano", "14:00", "espera"),
    cita("c10", "olivia", "vacuna", "15:30", "espera"),
    cita("c11", "luna", "consulta", "09:00", "espera", { fecha: enDias(3) }),
  ];
}
