/*
 * Perfil de belleza: las preguntas, el tipo de cada perfil y cómo se guardan.
 * Todo vive en el teléfono (localStorage). Los perfiles de ejemplo son inventados.
 */
import { useEffect, useState } from "react";

export const VINO = "#8a2c43";
export const SUAVE = "#f1e7de";
export const TINTA = "#1f1a17";
export const PAPEL = "#f8f4ee";
export const LINEA = "rgba(31,26,23,.16)";

export const CONSULTORA = { nombre: "Sofía Morales", corto: "Sofía" };

export type Fecha = { d: string; m: string; a: string };
export type Contacto = { nombre: string; parentesco: string; tel: string };
export type Amiga = { nombre: string; tel: string };

export type Perfil = {
  id: string;
  creado: string;
  anfitriona: string;
  nombre: string;
  apellido: string;
  telefono: string;
  medio: string;
  hora: string;
  cumple: Fecha;
  aniversario: Fecha;
  sinAniversario: boolean;
  correo: string;
  ocupacion: string;
  direccion: string;
  municipio: string;
  departamento: string;
  edad: string;
  necesidades: string[];
  piel: string;
  preocupaciones: string[];
  ojos: string[];
  labios: string[];
  acabado: string;
  tipoBase: string;
  tono: string;
  subtono: string;
  looks: string[];
  llevar: string;
  deseos: string;
  saberMas: string[];
  compartir: Contacto[];
  amigas: Amiga[];
  permisoAmigas: boolean;
  notas: string;
};

export const VACIO: Perfil = {
  id: "",
  creado: "",
  anfitriona: "",
  nombre: "",
  apellido: "",
  telefono: "",
  medio: "",
  hora: "",
  cumple: { d: "", m: "", a: "" },
  aniversario: { d: "", m: "", a: "" },
  sinAniversario: false,
  correo: "",
  ocupacion: "",
  direccion: "",
  municipio: "",
  departamento: "Guatemala",
  edad: "",
  necesidades: [],
  piel: "",
  preocupaciones: [],
  ojos: [],
  labios: [],
  acabado: "",
  tipoBase: "",
  tono: "",
  subtono: "",
  looks: [],
  llevar: "",
  deseos: "",
  saberMas: [],
  compartir: [{ nombre: "", parentesco: "", tel: "" }],
  amigas: [{ nombre: "", tel: "" }],
  permisoAmigas: false,
  notas: "",
};

export type Opcion = { valor: string; ayuda?: string };

export const MEDIOS: Opcion[] = [{ valor: "WhatsApp" }, { valor: "Llamada" }, { valor: "Correo" }];
export const HORAS: Opcion[] = [
  { valor: "En la mañana", ayuda: "Antes de las 12" },
  { valor: "En la tarde", ayuda: "Después de las 12" },
  { valor: "A cualquier hora" },
];
export const EDADES: Opcion[] = [
  { valor: "Menos de 20" },
  { valor: "20 a 29" },
  { valor: "30 a 39" },
  { valor: "40 a 49" },
  { valor: "50 a 59" },
  { valor: "60 a 69" },
  { valor: "70 o más" },
];
export const NECESIDADES: Opcion[] = [
  { valor: "Piel sensible", ayuda: "Se irrita o se pone roja fácil" },
  { valor: "Rutina básica", ayuda: "Quiero cuidar mi piel, sin pensar en arrugas" },
  { valor: "Primeras arrugas", ayuda: "Líneas finas o leves" },
  { valor: "Arrugas marcadas", ayuda: "Señales de la edad más visibles" },
  { valor: "Acné o granitos", ayuda: "De leve a moderado" },
];
export const PIELES: Opcion[] = [
  { valor: "Reseca", ayuda: "Me jala, se siente tirante o con pellejitos" },
  { valor: "Normal", ayuda: "Me siento cómoda, ni seca ni grasosa" },
  { valor: "Grasosa", ayuda: "Brilla en toda la cara" },
  { valor: "Mixta", ayuda: "Brilla solo en frente, nariz y barbilla" },
];
export const PREOCUPACIONES: Opcion[] = [
  { valor: "Tono más parejo y luminoso", ayuda: "Manchas o piel opaca" },
  { valor: "Mejorar la textura", ayuda: "Piel más suave al tacto" },
  { valor: "Piel más firme", ayuda: "Menos flacidez" },
  { valor: "Más hidratación" },
  { valor: "Quitar el brillo", ayuda: "Exceso de grasa" },
  { valor: "Poros menos visibles" },
  { valor: "Arrugas y líneas de expresión" },
  { valor: "Piel muy reseca", ayuda: "Necesito máxima hidratación" },
];
export const OJOS: Opcion[] = [
  { valor: "Ojeras y ojos hinchados", ayuda: "Ojos cansados" },
  { valor: "Líneas finas en los ojos", ayuda: "Patitas de gallo" },
  { valor: "Arrugas, bolsas o flacidez en los ojos" },
  { valor: "Desmaquillante suave para ojos" },
];
export const LABIOS: Opcion[] = [{ valor: "Labios resecos" }, { valor: "Líneas finas en los labios" }];
export const ACABADOS: Opcion[] = [
  { valor: "Mate", ayuda: "Sin brillo, piel aterciopelada" },
  { valor: "Natural", ayuda: "Como mi piel, pero mejor" },
  { valor: "Luminoso", ayuda: "Piel fresca, con brillo sano" },
];
export const COBERTURAS: Opcion[] = [
  { valor: "Ligera", ayuda: "Que casi no se note" },
  { valor: "Media", ayuda: "Cubre un poco las manchas" },
  { valor: "Completa", ayuda: "Cubre todo" },
];
export const TONOS = [
  { valor: "Muy claro", color: "#f3d9c6" },
  { valor: "Claro", color: "#e8c2a3" },
  { valor: "Medio", color: "#cf9f78" },
  { valor: "Moreno", color: "#a87550" },
  { valor: "Oscuro", color: "#7a4f33" },
];
export const SUBTONOS: Opcion[] = [
  { valor: "Cálido", ayuda: "Las venas de mi muñeca se ven verdes; me queda el dorado" },
  { valor: "Frío", ayuda: "Las venas se ven azules o moradas; me queda el plateado" },
  { valor: "Neutro", ayuda: "Se ven de los dos colores; me quedan ambos" },
  { valor: "No sé", ayuda: "Mi consultora me ayuda" },
];
export const LOOKS: Opcion[] = [
  { valor: "Natural, para el día a día" },
  { valor: "A la moda" },
  { valor: "Para boda u ocasión especial" },
  { valor: "Glamuroso, para salir de noche" },
];
export const SABER_MAS: Opcion[] = [
  { valor: "Más productos para el cuidado de la piel" },
  { valor: "Cómo aplicarme el maquillaje" },
  { valor: "Fragancias y cuidado del cuerpo" },
  { valor: "Productos para caballeros" },
  { valor: "Regalos" },
  { valor: "Maquillaje para bodas" },
  { valor: "Cómo ganar regalos por ser anfitriona" },
  { valor: "Cómo ganar dinero extra vendiendo" },
];
export const PARENTESCOS = ["Mamá", "Papá", "Esposo", "Hija", "Hijo", "Hermana", "Amiga", "Otro"];
export const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export const fechaTexto = (f: Fecha) => {
  if (!f.d || !f.m) return "";
  return `${Number(f.d)} de ${MESES[Number(f.m) - 1]}${f.a ? ` de ${f.a}` : ""}`;
};

export const telTexto = (t: string) => {
  const n = t.replace(/\D/g, "");
  return n.length === 8 ? `${n.slice(0, 4)} ${n.slice(4)}` : t;
};

/* Perfiles de ejemplo: personas inventadas */
const hace = (dias: number) => new Date(Date.now() - dias * 864e5).toISOString();
export const EJEMPLOS: Perfil[] = [
  {
    ...VACIO,
    id: "ej-1",
    creado: hace(1),
    anfitriona: "Lucía Paz",
    nombre: "Andrea",
    apellido: "Gómez Ruiz",
    telefono: "55128840",
    medio: "WhatsApp",
    hora: "En la tarde",
    cumple: { d: "4", m: "12", a: "1999" },
    sinAniversario: true,
    correo: "andrea.gomez@correo.com",
    ocupacion: "Estudiante",
    direccion: "Colonia Las Flores, zona 4",
    municipio: "Mixco",
    edad: "20 a 29",
    necesidades: ["Piel sensible", "Rutina básica"],
    piel: "Mixta",
    preocupaciones: ["Poros menos visibles", "Quitar el brillo"],
    labios: ["Labios resecos"],
    acabado: "Mate",
    tipoBase: "Ligera",
    tono: "Medio",
    subtono: "Neutro",
    looks: ["Natural, para el día a día", "A la moda"],
    llevar: "Limpiador y gel para poros",
    deseos: "Labial rosado",
    saberMas: ["Cómo aplicarme el maquillaje", "Cómo ganar dinero extra vendiendo"],
    compartir: [{ nombre: "Marta Ruiz", parentesco: "Mamá", tel: "41203387" }],
    amigas: [
      { nombre: "Karla Méndez", tel: "50021934" },
      { nombre: "Daniela Ortiz", tel: "47719022" },
    ],
    permisoAmigas: true,
  },
  {
    ...VACIO,
    id: "ej-2",
    creado: hace(3),
    anfitriona: "Lucía Paz",
    nombre: "Rosa Elena",
    apellido: "Castillo",
    telefono: "33014477",
    medio: "Llamada",
    hora: "En la mañana",
    cumple: { d: String(new Date(Date.now() + 6 * 864e5).getDate()), m: String(new Date(Date.now() + 6 * 864e5).getMonth() + 1), a: "1961" },
    aniversario: { d: "15", m: "8", a: "1985" },
    ocupacion: "Ama de casa",
    municipio: "Guatemala",
    edad: "60 a 69",
    necesidades: ["Arrugas marcadas"],
    piel: "Reseca",
    preocupaciones: ["Piel más firme", "Piel muy reseca"],
    ojos: ["Arrugas, bolsas o flacidez en los ojos"],
    labios: ["Líneas finas en los labios"],
    acabado: "Luminoso",
    tipoBase: "Media",
    tono: "Claro",
    subtono: "Cálido",
    looks: ["Para boda u ocasión especial"],
    llevar: "Crema de noche",
    saberMas: ["Más productos para el cuidado de la piel", "Regalos"],
    compartir: [{ nombre: "Gabriela Castillo", parentesco: "Hija", tel: "42139988" }],
    amigas: [{ nombre: "Ana Lucía Pérez", tel: "56104420" }],
    permisoAmigas: true,
    notas: "Le encantó la crema de noche. Llamarla el lunes para entregar.",
  },
];

/* Guardado en el teléfono */
const CLAVE = "perfil-belleza:perfiles";
const leer = (): Perfil[] => {
  try {
    const t = localStorage.getItem(CLAVE);
    return t ? (JSON.parse(t) as Perfil[]) : EJEMPLOS;
  } catch {
    return EJEMPLOS;
  }
};

export function usePerfiles() {
  const [perfiles, setPerfiles] = useState<Perfil[]>(leer);
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(perfiles));
    } catch {
      /* sin almacenamiento: queda en memoria */
    }
  }, [perfiles]);
  return {
    perfiles,
    agregar: (p: Perfil) => setPerfiles((ps) => [p, ...ps]),
    cambiar: (id: string, cambios: Partial<Perfil>) => setPerfiles((ps) => ps.map((p) => (p.id === id ? { ...p, ...cambios } : p))),
    borrar: (id: string) => setPerfiles((ps) => ps.filter((p) => p.id !== id)),
  };
}

/* El mensaje que le llega a la consultora */
export function mensajePerfil(p: Perfil) {
  const l: string[] = [];
  const linea = (t: string, v: string | string[] | undefined) => {
    const s = Array.isArray(v) ? v.join(", ") : v;
    if (s) l.push(`${t}: ${s}`);
  };
  l.push(`Hola, ${CONSULTORA.corto}. Este es mi perfil de belleza.`);
  l.push("");
  linea("Nombre", `${p.nombre} ${p.apellido}`.trim());
  linea("Teléfono", telTexto(p.telefono));
  linea("Prefiero", [p.medio, p.hora.toLowerCase()].filter(Boolean).join(", "));
  linea("Cumpleaños", fechaTexto(p.cumple));
  if (!p.sinAniversario) linea("Aniversario", fechaTexto(p.aniversario));
  linea("Me invitó", p.anfitriona);
  l.push("");
  linea("Edad", p.edad);
  linea("Mi piel necesita", p.necesidades);
  linea("Sin crema mi piel es", p.piel);
  linea("Me gustaría", p.preocupaciones);
  linea("Ojos", p.ojos);
  linea("Labios", p.labios);
  linea("Base", [p.acabado, p.tipoBase && `cobertura ${p.tipoBase.toLowerCase()}`, p.tono && `tono ${p.tono.toLowerCase()}`, p.subtono && p.subtono !== "No sé" ? p.subtono.toLowerCase() : ""].filter(Boolean).join(", "));
  linea("Looks", p.looks);
  linea("Me llevo", p.llevar);
  linea("Lista de deseos", p.deseos);
  linea("Quiero saber de", p.saberMas);
  const comp = p.compartir.filter((c) => c.nombre);
  if (comp.length) linea("Compartir mi lista con", comp.map((c) => `${c.nombre}${c.parentesco ? ` (${c.parentesco})` : ""} ${telTexto(c.tel)}`.trim()));
  const am = p.amigas.filter((a) => a.nombre);
  if (am.length) linea("Amigas para un facial", am.map((a) => `${a.nombre} ${telTexto(a.tel)}`.trim()));
  return l.join("\n");
}
