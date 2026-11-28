export type Tipo = "consulta" | "laboratorio";
export type Estado = "espera" | "consulta" | "muestra" | "finalizada";
export type Sexo = "F" | "M";
export type Pago = "particular" | "roble" | "gyt" | "panamerican" | "mapfre";
export type Metodo = "Efectivo" | "Visanet" | "NeoNet" | "Transferencia BI" | "Transferencia BAC";
export type Categoria = "chequeo" | "cardiometabolico" | "hormonal";

export type EspecialidadId = "medicina-interna" | "pediatria" | "ginecologia" | "cardiologia" | "dermatologia" | "traumatologia";
export type ExamenId = "bioquimico" | "hemato-tiroides" | "chequeo" | "lipidico" | "diabetes" | "tiroideo" | "hematologia" | "hormonal";
export type ServicioId = EspecialidadId | ExamenId;

export type ParametroId =
  | "glucosa"
  | "colesterol"
  | "trigliceridos"
  | "hdl"
  | "ldl"
  | "hemoglobina"
  | "hematocrito"
  | "leucocitos"
  | "plaquetas"
  | "creatinina"
  | "acido-urico"
  | "a1c"
  | "tsh"
  | "t3"
  | "t4"
  | "fsh"
  | "lh"
  | "estradiol"
  | "prolactina";

export type Paciente = { id: string; nombre: string; edad: number; sexo: Sexo; enPortal: boolean };

export type Informe = {
  valores: Partial<Record<ParametroId, number>>;
  validadoPor: string;
  fecha: string;
  hora: string;
  enviado: boolean;
};

export type Horario = { fecha: string; hora: string };

export type Cita = Horario & {
  id: string;
  folio: number;
  pacienteId: string;
  servicioId: ServicioId;
  pago: Pago;
  estado: Estado;
  cobro?: { metodo: Metodo; fecha: string };
  informe?: Informe;
  cambio?: Horario;
  respuestaCambio?: "confirmado" | "rechazado";
};

export type Medicamento = { nombre: string; dosis: string; duracion: string };

export type Receta = {
  id: string;
  pacienteId: string;
  medicoId: EspecialidadId;
  fecha: string;
  medicamentos: Medicamento[];
  indicaciones: string;
};

export type Especialidad = {
  nombre: string;
  etiqueta: string;
  precio: number;
  duracion: string;
  incluye: string[];
  foto: string;
  alt: string;
};

export const ESPECIALIDADES: Record<EspecialidadId, Especialidad> = {
  "medicina-interna": {
    nombre: "Medicina Interna",
    etiqueta: "Medicina Interna",
    precio: 350,
    duracion: "40 minutos",
    incluye: ["Historia clínica completa", "Presión, peso y glucosa capilar", "Lectura de exámenes previos", "Receta en su portal"],
    foto: "1758691462123-8a17ae95d203",
    alt: "Médico tomando la presión arterial a una paciente",
  },
  pediatria: {
    nombre: "Pediatría",
    etiqueta: "Pediatría",
    precio: 325,
    duracion: "35 minutos",
    incluye: ["Control de peso y talla", "Revisión de oídos, garganta y pulmones", "Esquema de vacunas al día", "Plan de alimentación según la edad"],
    foto: "1632053005736-6bd9cfc4daf9",
    alt: "Pediatra revisando el oído de un bebé",
  },
  ginecologia: {
    nombre: "Ginecología y Obstetricia",
    etiqueta: "Ginecología + Ultrasonido",
    precio: 475,
    duracion: "45 minutos",
    incluye: ["Consulta ginecológica", "Ultrasonido en el mismo consultorio", "Explicación de las imágenes", "Orden de laboratorio si hace falta"],
    foto: "1706065264583-55f1a8549769",
    alt: "Especialista realizando un ultrasonido en el consultorio",
  },
  cardiologia: {
    nombre: "Cardiología",
    etiqueta: "Cardiología + Electro",
    precio: 550,
    duracion: "45 minutos",
    incluye: ["Evaluación cardiovascular", "Electrocardiograma en reposo", "Cálculo de riesgo", "Plan de control y medicación"],
    foto: "1513224502586-d1e602410265",
    alt: "Monitor de signos vitales mostrando el ritmo cardíaco",
  },
  dermatologia: {
    nombre: "Dermatología",
    etiqueta: "Dermatología",
    precio: 375,
    duracion: "30 minutos",
    incluye: ["Revisión de piel, cabello y uñas", "Dermatoscopía de lunares", "Plan de tratamiento por escrito", "Seguimiento fotográfico"],
    foto: "1676312754401-d97fe43c2c4b",
    alt: "Revisión de un lunar con lente de aumento",
  },
  traumatologia: {
    nombre: "Traumatología y Ortopedia",
    etiqueta: "Traumatología y Ortopedia",
    precio: 400,
    duracion: "35 minutos",
    incluye: ["Evaluación de articulaciones y columna", "Lectura de radiografías", "Indicaciones de rehabilitación", "Orden de estudios si hace falta"],
    foto: "1649751361457-01d3a696c7e6",
    alt: "Especialista evaluando la rodilla de un paciente",
  },
};

export type Examen = {
  nombre: string;
  categoria: Categoria;
  precio: number;
  horas: number;
  preparacion: string;
  parametros: ParametroId[];
};

export const EXAMENES: Record<ExamenId, Examen> = {
  bioquimico: {
    nombre: "Perfil Bioquímico Completo",
    categoria: "chequeo",
    precio: 280,
    horas: 6,
    preparacion: "Ayuno de 12 horas",
    parametros: ["glucosa", "creatinina", "acido-urico", "colesterol", "trigliceridos"],
  },
  "hemato-tiroides": {
    nombre: "Hematología + Tiroides",
    categoria: "hormonal",
    precio: 340,
    horas: 8,
    preparacion: "No requiere ayuno",
    parametros: ["hemoglobina", "leucocitos", "plaquetas", "tsh", "t4"],
  },
  chequeo: {
    nombre: "Chequeo General Altamira",
    categoria: "chequeo",
    precio: 425,
    horas: 8,
    preparacion: "Ayuno de 8 horas",
    parametros: ["glucosa", "colesterol", "trigliceridos", "hemoglobina", "creatinina"],
  },
  lipidico: {
    nombre: "Perfil de Lípidos",
    categoria: "cardiometabolico",
    precio: 160,
    horas: 4,
    preparacion: "Ayuno de 12 horas",
    parametros: ["colesterol", "trigliceridos", "hdl", "ldl"],
  },
  diabetes: {
    nombre: "Glucosa + Hemoglobina Glicosilada",
    categoria: "cardiometabolico",
    precio: 185,
    horas: 4,
    preparacion: "Ayuno de 8 horas",
    parametros: ["glucosa", "a1c"],
  },
  tiroideo: {
    nombre: "Perfil Tiroideo",
    categoria: "hormonal",
    precio: 260,
    horas: 8,
    preparacion: "Sin ayuno. Tome la muestra antes de su medicamento",
    parametros: ["tsh", "t3", "t4"],
  },
  hematologia: {
    nombre: "Hematología Completa",
    categoria: "chequeo",
    precio: 95,
    horas: 2,
    preparacion: "No requiere ayuno",
    parametros: ["hemoglobina", "hematocrito", "leucocitos", "plaquetas"],
  },
  hormonal: {
    nombre: "Perfil Hormonal Femenino",
    categoria: "hormonal",
    precio: 395,
    horas: 10,
    preparacion: "Entre el día 2 y 4 del ciclo",
    parametros: ["fsh", "lh", "estradiol", "prolactina"],
  },
};

export const IDS_ESPECIALIDAD = Object.keys(ESPECIALIDADES) as EspecialidadId[];
export const IDS_EXAMEN = Object.keys(EXAMENES) as ExamenId[];

export const esExamen = (id: ServicioId): id is ExamenId => id in EXAMENES;
export const tipoDe = (id: ServicioId): Tipo => (esExamen(id) ? "laboratorio" : "consulta");
export const nombreServicio = (id: ServicioId) => (esExamen(id) ? EXAMENES[id].nombre : ESPECIALIDADES[id].etiqueta);
export const precioServicio = (id: ServicioId) => (esExamen(id) ? EXAMENES[id].precio : ESPECIALIDADES[id].precio);

export const FILTROS_LAB: { id: Categoria | "todos"; nombre: string }[] = [
  { id: "todos", nombre: "Todos" },
  { id: "chequeo", nombre: "Chequeo General" },
  { id: "cardiometabolico", nombre: "Cardiometabólico" },
  { id: "hormonal", nombre: "Hormonal" },
];

type Rango = { min?: number; max?: number };
type Parametro = { nombre: string; unidad: string; decimales: number; lectura: number; rango: Rango | Record<Sexo, Rango> };

export const PARAMETROS: Record<ParametroId, Parametro> = {
  glucosa: { nombre: "Glucosa en ayunas", unidad: "mg/dL", decimales: 0, lectura: 92, rango: { min: 70, max: 99 } },
  colesterol: { nombre: "Colesterol total", unidad: "mg/dL", decimales: 0, lectura: 188, rango: { max: 199 } },
  trigliceridos: { nombre: "Triglicéridos", unidad: "mg/dL", decimales: 0, lectura: 134, rango: { max: 149 } },
  hdl: { nombre: "Colesterol HDL", unidad: "mg/dL", decimales: 0, lectura: 52, rango: { M: { min: 40 }, F: { min: 50 } } },
  ldl: { nombre: "Colesterol LDL", unidad: "mg/dL", decimales: 0, lectura: 118, rango: { max: 129 } },
  hemoglobina: { nombre: "Hemoglobina", unidad: "g/dL", decimales: 1, lectura: 14.2, rango: { M: { min: 13.5, max: 17.5 }, F: { min: 12, max: 15.5 } } },
  hematocrito: { nombre: "Hematocrito", unidad: "%", decimales: 1, lectura: 42.5, rango: { M: { min: 41, max: 50 }, F: { min: 36, max: 44 } } },
  leucocitos: { nombre: "Leucocitos", unidad: "miles/µL", decimales: 1, lectura: 6.8, rango: { min: 4.5, max: 11 } },
  plaquetas: { nombre: "Plaquetas", unidad: "miles/µL", decimales: 0, lectura: 265, rango: { min: 150, max: 450 } },
  creatinina: { nombre: "Creatinina", unidad: "mg/dL", decimales: 2, lectura: 0.91, rango: { M: { min: 0.7, max: 1.3 }, F: { min: 0.6, max: 1.1 } } },
  "acido-urico": { nombre: "Ácido úrico", unidad: "mg/dL", decimales: 1, lectura: 5.2, rango: { M: { min: 3.4, max: 7 }, F: { min: 2.4, max: 6 } } },
  a1c: { nombre: "Hemoglobina glicosilada", unidad: "%", decimales: 1, lectura: 5.4, rango: { min: 4, max: 5.6 } },
  tsh: { nombre: "TSH", unidad: "µUI/mL", decimales: 2, lectura: 2.15, rango: { min: 0.4, max: 4 } },
  t3: { nombre: "T3 total", unidad: "ng/dL", decimales: 0, lectura: 124, rango: { min: 80, max: 200 } },
  t4: { nombre: "T4 libre", unidad: "ng/dL", decimales: 2, lectura: 1.22, rango: { min: 0.8, max: 1.8 } },
  fsh: { nombre: "FSH (fase folicular)", unidad: "mUI/mL", decimales: 1, lectura: 6.4, rango: { min: 3.5, max: 12.5 } },
  lh: { nombre: "LH (fase folicular)", unidad: "mUI/mL", decimales: 1, lectura: 5.9, rango: { min: 2.4, max: 12.6 } },
  estradiol: { nombre: "Estradiol", unidad: "pg/mL", decimales: 0, lectura: 64, rango: { min: 12, max: 166 } },
  prolactina: { nombre: "Prolactina", unidad: "ng/mL", decimales: 1, lectura: 13.6, rango: { min: 4.8, max: 23.3 } },
};

export function rangoDe(id: ParametroId, sexo: Sexo): Rango {
  const { rango } = PARAMETROS[id];
  return "M" in rango ? rango[sexo] : rango;
}

export function textoRango(id: ParametroId, sexo: Sexo) {
  const { min, max } = rangoDe(id, sexo);
  const { decimales } = PARAMETROS[id];
  if (min === undefined) return `Hasta ${max?.toFixed(decimales)}`;
  if (max === undefined) return `Desde ${min.toFixed(decimales)}`;
  return `${min.toFixed(decimales)} – ${max.toFixed(decimales)}`;
}

export function fueraDeRango(id: ParametroId, valor: number, sexo: Sexo) {
  const { min, max } = rangoDe(id, sexo);
  return (min !== undefined && valor < min) || (max !== undefined && valor > max);
}

export type Medico = { nombre: string; colegiado: number; dias: number[]; atiende: string; foto: string };

export const MEDICOS: Record<EspecialidadId, Medico> = {
  "medicina-interna": { nombre: "Dr. Julio Estrada Morales", colegiado: 90214, dias: [1, 2, 3, 4, 5, 6], atiende: "Lunes a sábado", foto: "1612349317150-e413f6a5b16d" },
  pediatria: { nombre: "Dra. Mariana Castellanos", colegiado: 91358, dias: [1, 2, 4, 6], atiende: "Lunes, martes, jueves y sábado", foto: "1559839734-2b71ea197ec2" },
  ginecologia: { nombre: "Dra. Andrea Recinos Paz", colegiado: 90877, dias: [1, 3, 5, 6], atiende: "Lunes, miércoles, viernes y sábado", foto: "1758691462651-611d730c5272" },
  cardiologia: { nombre: "Dr. Rodrigo Álvarez Cifuentes", colegiado: 92046, dias: [2, 4, 6], atiende: "Martes, jueves y sábado", foto: "1758691463582-11aea602cd4a" },
  dermatologia: { nombre: "Dra. Lucía Barrios Solares", colegiado: 91790, dias: [3, 5], atiende: "Miércoles y viernes", foto: "1770134223774-13b735e29201" },
  traumatologia: { nombre: "Dr. Esteban Monzón Ruiz", colegiado: 92531, dias: [1, 3, 4], atiende: "Lunes, miércoles y jueves", foto: "1712215544003-af10130f8eb3" },
};

export const QUIMICOS = ["Licda. Sofía Herrera · Química Bióloga · Col. 95120", "Lic. Daniel Cojulún · Químico Biólogo · Col. 95486"];

export const ASEGURADORAS: { id: Exclude<Pago, "particular">; nombre: string; corto: string }[] = [
  { id: "roble", nombre: "Seguros El Roble", corto: "Seguro Roble" },
  { id: "gyt", nombre: "Seguros G&T", corto: "Seguro G&T" },
  { id: "panamerican", nombre: "Pan-American Life", corto: "Seguro Pan-American" },
  { id: "mapfre", nombre: "MAPFRE", corto: "Seguro MAPFRE" },
];

export const nombrePago = (pago: Pago) => ASEGURADORAS.find((a) => a.id === pago)?.corto ?? "Particular";

export const METODOS: Metodo[] = ["Efectivo", "Visanet", "NeoNet", "Transferencia BI", "Transferencia BAC"];

export const ESTADOS: Record<Estado, string> = { espera: "En espera", consulta: "En consulta", muestra: "Muestra tomada", finalizada: "Finalizada" };

export const ESTADOS_POR_TIPO: Record<Tipo, Estado[]> = {
  consulta: ["espera", "consulta", "finalizada"],
  laboratorio: ["espera", "muestra", "finalizada"],
};

export const SEDE = {
  corta: "Torre Médica Zona 10 · Nivel 6",
  torre: "Torre Médica Zona 10",
  nivel: "Nivel 6",
  direccion: "Torre Médica, Nivel 6, Zona 10, Ciudad de Guatemala",
  mapa: "https://www.google.com/maps/search/?api=1&query=Torre+M%C3%A9dica+Zona+10+Ciudad+de+Guatemala",
  horarios: [
    { dia: "Consultas, lunes a viernes", horas: "8:00 a 18:00" },
    { dia: "Consultas, sábado", horas: "8:00 a 12:30" },
    { dia: "Toma de muestras, lunes a sábado", horas: "7:00 a 11:30" },
    { dia: "Domingo", horas: "Cerrado" },
  ],
};

export const SECCIONES = [
  { id: "especialidades", nombre: "Especialidades" },
  { id: "laboratorio", nombre: "Laboratorio" },
  { id: "medicos", nombre: "Médicos" },
  { id: "seguros-ubicacion", nombre: "Seguros y Ubicación" },
];

export const FOTOS = {
  portada: "1758691462878-6edc3d3da1be",
  laboratorio: "1582719471384-894fbb16e074",
  consultorio: "1666214277730-e9c7e755e5a3",
};

export const urlFoto = (id: string, ancho: number, alto: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces,center&w=${ancho}&h=${alto}&q=72`;

export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;
export const folioTexto = (folio: number) => `ALT-${folio}`;

export function isoDe(d: Date) {
  const dos = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}

export const hoyIso = () => isoDe(new Date());
export const fechaDe = (iso: string) => new Date(`${iso}T12:00:00`);

export function sumarDias(iso: string, dias: number) {
  const d = fechaDe(iso);
  d.setDate(d.getDate() + dias);
  return isoDe(d);
}

export const fechaLarga = (iso: string) => fechaDe(iso).toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" });
export const fechaCorta = (iso: string) => fechaDe(iso).toLocaleDateString("es-GT", { day: "numeric", month: "short", year: "numeric" });
export const fechaRelativa = (iso: string) => (iso === hoyIso() ? "Hoy" : iso === sumarDias(hoyIso(), 1) ? "Mañana" : fechaLarga(iso));
