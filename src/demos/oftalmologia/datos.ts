export type ServicioId = "visual" | "completa" | "lasik" | "contacto";

export const SERVICIOS: Record<ServicioId, { nombre: string; corto: string; precio: number }> = {
  visual: { nombre: "Examen Visual Computarizado", corto: "Examen visual", precio: 200 },
  completa: { nombre: "Consulta Oftalmológica Completa", corto: "Consulta completa", precio: 375 },
  lasik: { nombre: "Evaluación Cirugía Láser LASIK", corto: "Evaluación LASIK", precio: 450 },
  contacto: { nombre: "Adaptación Lentes de Contacto", corto: "Lentes de contacto", precio: 250 },
};
export const SERVICIOS_IDS = Object.keys(SERVICIOS) as ServicioId[];

export const ASEGURADORAS = ["El Roble", "G&T", "Pan-American", "MAPFRE"] as const;
export type Pago = "Particular" | (typeof ASEGURADORAS)[number];
export const textoPago = (p: Pago) => (p === "Particular" ? "Particular" : `Seguro · ${p}`);

export type EstadoCita = "espera" | "examen" | "atendida";
export const ESTADOS_CITA: Record<EstadoCita, string> = { espera: "En espera", examen: "En examen", atendida: "Atendida" };

export type Etapa = 1 | 2 | 3 | 4;
export const ETAPAS: { etapa: Etapa; nombre: string; estado: string }[] = [
  { etapa: 1, nombre: "Graduación confirmada", estado: "En espera" },
  { etapa: 2, nombre: "Tallado y antirreflejo en laboratorio", estado: "En tallado" },
  { etapa: 3, nombre: "Control de calidad", estado: "Control de calidad" },
  { etapa: 4, nombre: "Listos para entrega en óptica", estado: "Listos para entrega" },
];

export type Horario = { fecha: string; hora: string };

export type Cita = Horario & {
  id: string;
  pacienteId: string;
  servicio: ServicioId;
  area: string;
  pago: Pago;
  monto: number;
  estado: EstadoCita;
  cobrada: boolean;
  origen: "agenda" | "portada" | "recepcion";
  aros: string[];
  cambio: Horario | null;
};

export type Lente = "Monofocal" | "Antirreflejo Azul" | "Progresivo";

export type Orden = {
  id: string;
  pacienteId: string;
  aroId: string;
  lente: Lente;
  pago: Pago;
  total: number;
  abonado: number;
  etapa: Etapa;
  entrega: string;
  entregada: boolean;
  avisada: boolean;
};

export type Ojo = { esfera: number; cilindro: number; eje: number | null; adicion: number | null; dp: number };

export type Graduacion = {
  od: Ojo;
  oi: Ojo;
  cristal: string;
  emitida: string;
  vence: string;
  profesional: string;
  version: number;
};

export type Paciente = {
  id: string;
  nombre: string;
  edad: number | null;
  telefono: string;
  portal: boolean;
  graduacion: Graduacion | null;
};

export const PROFESIONALES = ["Dr. Luis Fernando Orellana · Oftalmólogo", "Dra. Andrea Mazariegos · Optometrista"];

export const CRISTALES = [
  "Monofocal en policarbonato con antirreflejo y filtro de luz azul",
  "Monofocal con antirreflejo",
  "Progresivo digital con antirreflejo",
  "Monofocal polarizado para sol",
  "Lente de contacto blando de reemplazo mensual",
];

export type Categoria = "Titanio Ultraligero" | "Acetato" | "Sol Polarizado" | "Infantil";
export const CATEGORIAS: Categoria[] = ["Titanio Ultraligero", "Acetato", "Sol Polarizado", "Infantil"];

export type Aro = { id: string; nombre: string; categoria: Categoria; detalle: string; precio: number; lentes: Lente[]; foto: string; alt: string };

const TODOS_LOS_LENTES: Lente[] = ["Monofocal", "Antirreflejo Azul", "Progresivo"];

export const AROS: Aro[] = [
  { id: "cumbre", nombre: "Cumbre", categoria: "Titanio Ultraligero", detalle: "Hexagonal dorado, puente ajustable", precio: 1450, lentes: TODOS_LOS_LENTES, foto: "1646083774155-2a40b675641d", alt: "Aro hexagonal de metal dorado sobre fondo blanco" },
  { id: "brisa", nombre: "Brisa", categoria: "Titanio Ultraligero", detalle: "Doble puente en plata mate", precio: 1325, lentes: TODOS_LOS_LENTES, foto: "1574065557312-b7cc977d8a89", alt: "Aro de metal plateado con doble puente" },
  { id: "ambar", nombre: "Ámbar", categoria: "Acetato", detalle: "Redondeado en tono carey", precio: 975, lentes: TODOS_LOS_LENTES, foto: "1603578119639-798b8413d8d7", alt: "Aro de acetato color carey" },
  { id: "oliva", nombre: "Oliva", categoria: "Acetato", detalle: "Acetato translúcido verde oliva", precio: 1050, lentes: TODOS_LOS_LENTES, foto: "1617791932882-a70117e3564d", alt: "Aro de acetato translúcido verde oliva" },
  { id: "pacifico", nombre: "Pacífico", categoria: "Sol Polarizado", detalle: "Redondo carey, protección UV400", precio: 890, lentes: ["Monofocal", "Progresivo"], foto: "1587310311582-aa7610e90826", alt: "Lentes de sol redondos de aro carey" },
  { id: "arena", nombre: "Arena", categoria: "Sol Polarizado", detalle: "Cristal claro con lente gris, UV400", precio: 940, lentes: ["Monofocal", "Progresivo"], foto: "1542629458-eaa56d608062", alt: "Lentes de sol con aro transparente color champaña" },
  { id: "cometa", nombre: "Cometa", categoria: "Infantil", detalle: "Flexible, en azul o rojo", precio: 575, lentes: ["Monofocal", "Antirreflejo Azul"], foto: "1732674042220-01d08d49b381", alt: "Dos aros infantiles, uno azul y otro con varillas rojas" },
  { id: "fresa", nombre: "Fresa", categoria: "Infantil", detalle: "Liviano y resistente, rosa translúcido", precio: 525, lentes: ["Monofocal", "Antirreflejo Azul"], foto: "1583469009555-3b351b9ccd57", alt: "Niña sonriendo con aros rosados" },
];
export const aroPorId = (id: string) => AROS.find((a) => a.id === id);

export const ESPECIALIDADES: { id: string; nombre: string; detalle: string; incluye: string; servicio: ServicioId }[] = [
  { id: "general", nombre: "Oftalmología general", detalle: "Ojo seco, infecciones, presión ocular y revisión anual con fondo de ojo.", incluye: "Agudeza visual, biomicroscopía y presión intraocular", servicio: "completa" },
  { id: "retina", nombre: "Retina y glaucoma", detalle: "Control de retina en pacientes con diabetes o hipertensión y seguimiento del nervio óptico.", incluye: "Fondo de ojo dilatado y presión intraocular; los estudios se cotizan aparte", servicio: "completa" },
  { id: "refractiva", nombre: "Cirugía refractiva", detalle: "Evaluación para saber si tu córnea permite corregir miopía o astigmatismo con láser.", incluye: "Topografía corneal, paquimetría y refracción", servicio: "lasik" },
  { id: "pediatria", nombre: "Pediatría visual", detalle: "Ojo perezoso, estrabismo y primeros lentes, con pruebas pensadas para niños.", incluye: "Refracción computarizada y pruebas de visión binocular", servicio: "visual" },
];

export const EQUIPOS = [
  { nombre: "Topografía corneal", detalle: "Dibuja la curvatura de tu córnea. Define si eres candidato a cirugía láser y cómo adaptar un lente de contacto.", dato: "10 minutos, sin contacto", precio: 300, foto: "1679496124676-fa7cc1724585", alt: "Equipo computarizado para medir la curvatura de la córnea" },
  { nombre: "Tomografía OCT", detalle: "Muestra las capas de la retina y el nervio óptico para detectar glaucoma y daño por diabetes a tiempo.", dato: "15 minutos, sin dolor", precio: 350, foto: "1682663947178-4f652a459e2b", alt: "Equipo de diagnóstico ocular con pantalla en consultorio" },
  { nombre: "Retinografía digital", detalle: "Fotografía el fondo del ojo y la guarda en tu expediente para comparar cada control.", dato: "Resultado en la misma visita", precio: 225, foto: "1565428766130-572ff8417638", alt: "Cámara oftalmológica y lámpara de hendidura" },
];

export const FOTOS = {
  portada: "1722419136179-991a684eee53",
  especialidades: "1542432389-a40026383873",
  optica: "1604781099561-c70393a38a6d",
};

export const urlFoto = (id: string, ancho: number, alto: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${ancho}&h=${alto}&q=75`;

export const SEDE = {
  corta: "Sede Zona 10 · Plaza Médica",
  direccion: "Plaza Médica, zona 10, Ciudad de Guatemala",
  mapa: "https://www.google.com/maps/search/?api=1&query=Zona+10+Ciudad+de+Guatemala",
  horarios: [
    ["Lunes a viernes", "8:00 a 18:00"],
    ["Sábado", "8:00 a 13:00"],
    ["Domingo", "Cerrado"],
  ],
};

export const SECCIONES = [
  { id: "servicios", nombre: "Servicios" },
  { id: "catalogo-aros", nombre: "Catálogo de Aros" },
  { id: "tecnologia", nombre: "Tecnología" },
  { id: "sedes-seguros", nombre: "Sedes y Seguros" },
];

export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;
