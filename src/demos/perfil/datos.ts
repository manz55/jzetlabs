/*
 * Perfil de belleza: las preguntas, el tipo de cada perfil y cómo se guardan.
 * Todo vive en el teléfono (localStorage). Los perfiles de ejemplo son inventados.
 */
import { useEffect, useState } from "react";
import fotoLimpiador from "@/assets/demo-cosmeticos/limpiador.jpg";
import fotoAceite from "@/assets/demo-cosmeticos/aceite.jpg";
import fotoSerum from "@/assets/demo-cosmeticos/serum.jpg";
import fotoCrema from "@/assets/demo-cosmeticos/crema.jpg";
import fotoBase from "@/assets/demo-cosmeticos/kit.jpg";
import fotoPolvo from "@/assets/demo-cosmeticos/polvo.jpg";
import fotoRubor from "@/assets/demo-cosmeticos/rubor.jpg";
import fotoPaleta from "@/assets/demo-cosmeticos/paleta.jpg";
import fotoLabialNude from "@/assets/demo-cosmeticos/labial-nude.jpg";
import fotoLabialRojo from "@/assets/demo-cosmeticos/labial-rojo.jpg";
import fotoBrochas from "@/assets/demo-cosmeticos/brochas.jpg";

export const VINO = "#8a2c43";
export const SUAVE = "#f1e7de";
export const TINTA = "#1f1a17";
export const PAPEL = "#f8f4ee";
export const LINEA = "rgba(31,26,23,.16)";

export const CONSULTORA = { nombre: "Sofía Morales", corto: "Sofía" };

export type Fecha = { d: string; m: string; a: string };
export type Contacto = { nombre: string; parentesco: string; tel: string };
export type Amiga = { nombre: string; tel: string };

/* El pedido de cada clienta: por entregar → entregado (se descuenta del inventario) → pagado */
export type Estado = "por-entregar" | "entregado" | "pagado";
export const ESTADOS: Record<Estado, string> = { "por-entregar": "Por entregar", entregado: "Entregado, falta cobrar", pagado: "Pagado" };

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
  llevo: string[];
  quiero: string[];
  llevar: string;
  deseos: string;
  saberMas: string[];
  compartir: Contacto[];
  amigas: Amiga[];
  permisoAmigas: boolean;
  notas: string;
  estado: Estado;
  abonos: { monto: number; fecha: string }[];
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
  llevo: [],
  quiero: [],
  llevar: "",
  deseos: "",
  saberMas: [],
  compartir: [{ nombre: "", parentesco: "", tel: "" }],
  amigas: [{ nombre: "", tel: "" }],
  permisoAmigas: false,
  notas: "",
  estado: "por-entregar",
  abonos: [],
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
/* Lo que la consultora lleva a la reunión (productos de ejemplo, sin marca) */
/* precio: lo que paga la clienta · costo: lo que le cuesta a la consultora (de ejemplo) */
export type Producto = { id: string; nombre: string; corto: string; precio: number; costo: number; marca: string; foto: string; piel?: boolean; uso: string[] };
export const MARCAS = [
  { nombre: "Lumière", que: "Cuidado de la piel" },
  { nombre: "Nativa Color", que: "Maquillaje" },
  { nombre: "Casa Ámbar", que: "Fragancias y cuerpo" },
];
export const PRODUCTOS: Producto[] = [
  { id: "limpiador", nombre: "Limpiador en gel", corto: "Limpia sin resecar", precio: 145, costo: 85, marca: "Lumière", foto: fotoLimpiador, piel: true , uso: ["Moja tu cara con agua tibia.", "Masajea una gota del tamaño de una moneda por 30 segundos.", "Enjuaga y seca a toquecitos, sin jalar."] },
  { id: "serum", nombre: "Sérum de vitamina C", corto: "Para manchas y piel opaca", precio: 245, costo: 145, marca: "Lumière", foto: fotoAceite, piel: true , uso: ["Después de limpiar, en la mañana.", "Pon 3 gotas en la palma y aplica a toquecitos.", "Espera un minuto y sigue con tu crema con FPS."] },
  { id: "crema-dia", nombre: "Crema de día con FPS 30", corto: "Hidrata y protege del sol", precio: 210, costo: 125, marca: "Lumière", foto: fotoCrema, piel: true , uso: ["Último paso de la mañana.", "Del centro de la cara hacia afuera, también en el cuello.", "Vuelve a ponerla al mediodía si estás al sol."] },
  { id: "crema-noche", nombre: "Sérum de noche reafirmante", corto: "Para líneas y firmeza", precio: 265, costo: 160, marca: "Lumière", foto: fotoSerum, piel: true , uso: ["Solo en la noche, sobre la piel limpia.", "3 gotas en cara y cuello, de abajo hacia arriba.", "Los primeros días úsalo noche de por medio."] },
  { id: "base", nombre: "Base líquida", corto: "Cobertura que se ajusta", precio: 195, costo: 115, marca: "Nativa Color", foto: fotoBase , uso: ["Sobre la crema ya absorbida.", "Poquita cantidad del centro hacia afuera, con esponja húmeda.", "Si quieres más cobertura, otra capa delgada a los 2 minutos."] },
  { id: "polvo", nombre: "Polvo traslúcido", corto: "Quita el brillo", precio: 150, costo: 90, marca: "Nativa Color", foto: fotoPolvo , uso: ["Después de la base.", "Con brocha grande, solo en frente, nariz y barbilla.", "Para retocar en el día, a toquecitos."] },
  { id: "rubor", nombre: "Rubor", corto: "Color que se difumina fácil", precio: 120, costo: 70, marca: "Nativa Color", foto: fotoRubor , uso: ["Sonríe y busca la parte alta del pómulo.", "Aplica poco y difumina hacia la sien.", "Si te pasaste, pasa la brocha limpia encima."] },
  { id: "paleta", nombre: "Paleta de sombras", corto: "6 tonos, edición de temporada", precio: 230, costo: 140, marca: "Nativa Color", foto: fotoPaleta , uso: ["El tono claro en todo el párpado.", "El medio en la línea del ojo, difuminado.", "El oscuro pegado a las pestañas."] },
  { id: "labial-nude", nombre: "Labial nude", corto: "Para todos los días", precio: 110, costo: 65, marca: "Nativa Color", foto: fotoLabialNude , uso: ["Hidrata tus labios antes.", "Aplica directo desde el centro hacia afuera.", "Para que dure más, una segunda capa."] },
  { id: "labial-rojo", nombre: "Labial rojo", corto: "El clásico de las fiestas", precio: 110, costo: 65, marca: "Nativa Color", foto: fotoLabialRojo , uso: ["Delinea primero el contorno.", "Rellena con el labial.", "Quita el exceso con un pañuelo y repite."] },
  { id: "brochas", nombre: "Set de brochas", corto: "5 brochas para empezar", precio: 285, costo: 170, marca: "Nativa Color", foto: fotoBrochas , uso: ["Una para base, una para polvo, una para rubor y dos para ojos.", "Lávalas cada semana con jabón neutro.", "Sécalas acostadas, nunca paradas."] },
];
export const producto = (id: string) => PRODUCTOS.find((p) => p.id === id);
export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;
export const totalDe = (ids: string[]) => ids.reduce((s, id) => s + (producto(id)?.precio ?? 0), 0);

/* La rutina que le sale a cada clienta según lo que contestó */
export type PasoRutina = { paso: string; cuando: string; producto: Producto; por: string };
export function rutinaPara(p: Perfil) {
  const seca = p.piel === "Reseca" || p.preocupaciones.includes("Piel muy reseca");
  const grasa = p.piel === "Grasosa" || p.piel === "Mixta" || p.preocupaciones.includes("Quitar el brillo") || p.necesidades.includes("Acné o granitos");
  const edad =
    p.necesidades.includes("Primeras arrugas") ||
    p.necesidades.includes("Arrugas marcadas") ||
    p.preocupaciones.includes("Piel más firme") ||
    p.preocupaciones.includes("Arrugas y líneas de expresión");
  const pasos: PasoRutina[] = [
    {
      paso: "Limpia",
      cuando: "Mañana y noche",
      producto: producto("limpiador")!,
      por: seca ? "Limpia sin jalar ni resecar, que en piel seca se irrita fácil." : grasa ? "Controla el brillo desde temprano sin dejarte la piel tirante." : "Deja la piel lista para que lo demás funcione.",
    },
    edad
      ? { paso: "Trata", cuando: "En la noche", producto: producto("crema-noche")!, por: "Mientras duermes ayuda con las líneas y la firmeza." }
      : { paso: "Trata", cuando: "En la mañana", producto: producto("serum")!, por: "Empareja el tono y le da luz a la piel opaca." },
    { paso: "Hidrata y protege", cuando: "Todas las mañanas", producto: producto("crema-dia")!, por: "El sol es lo que más envejece la piel, aunque esté nublado." },
  ];
  const tip = seca
    ? "Ponte la crema con la piel todavía un poco húmeda: así guarda mejor la hidratación, sobre todo con este frío."
    : grasa
      ? "Usa poquita base y el polvo solo en frente, nariz y barbilla. Así no se ve pesada a medio día."
      : "Empieza con poca base y, si necesitas más, agrega otra capa delgada después de un par de minutos.";
  return { pasos, tip };
}

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
    creado: hace(14),
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
    llevo: ["limpiador", "polvo"],
    quiero: ["labial-nude", "paleta"],
    saberMas: ["Cómo aplicarme el maquillaje", "Cómo ganar dinero extra vendiendo"],
    compartir: [{ nombre: "Marta Ruiz", parentesco: "Mamá", tel: "41203387" }],
    amigas: [
      { nombre: "Karla Méndez", tel: "50021934" },
      { nombre: "Daniela Ortiz", tel: "47719022" },
    ],
    permisoAmigas: true,
    estado: "pagado",
  },
  {
    ...VACIO,
    id: "ej-2",
    creado: hace(58),
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
    llevo: ["crema-noche", "crema-dia"],
    quiero: ["labial-rojo"],
    saberMas: ["Más productos para el cuidado de la piel", "Regalos"],
    compartir: [{ nombre: "Gabriela Castillo", parentesco: "Hija", tel: "42139988" }],
    amigas: [{ nombre: "Ana Lucía Pérez", tel: "56104420" }],
    permisoAmigas: true,
    estado: "pagado",
    notas: "Le encantó el sérum de noche. Para su cumpleaños le llevo la muestra del labial rojo.",
  },
  {
    ...VACIO,
    id: "ej-3",
    creado: hace(2),
    anfitriona: "Andrea Gómez",
    nombre: "Mónica",
    apellido: "Herrera",
    telefono: "46027715",
    medio: "WhatsApp",
    hora: "A cualquier hora",
    cumple: { d: "19", m: "3", a: "" },
    sinAniversario: true,
    ocupacion: "Maestra",
    municipio: "Villa Nueva",
    edad: "30 a 39",
    necesidades: ["Primeras arrugas"],
    piel: "Normal",
    preocupaciones: ["Tono más parejo y luminoso", "Más hidratación"],
    ojos: ["Ojeras y ojos hinchados"],
    acabado: "Natural",
    tipoBase: "Media",
    tono: "Moreno",
    subtono: "Cálido",
    looks: ["Natural, para el día a día"],
    llevo: ["serum", "base", "rubor"],
    quiero: ["brochas"],
    saberMas: ["Cómo ganar dinero extra vendiendo", "Cómo ganar regalos por ser anfitriona"],
    amigas: [{ nombre: "Sandra López", tel: "53318890" }],
    permisoAmigas: true,
  },
];

/* Guardado en el teléfono */
const CLAVE = "perfil-belleza:perfiles-v5";
const leer = (): Perfil[] => {
  try {
    const t = localStorage.getItem(CLAVE);
    return t ? (JSON.parse(t) as Perfil[]).map((p) => ({ ...VACIO, ...p })) : EJEMPLOS;
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
  const llevo = p.llevo.map((id) => producto(id)?.nombre).filter(Boolean) as string[];
  if (llevo.length) linea("Me llevo", `${llevo.join(", ")} (${qz(totalDe(p.llevo))})`);
  linea("Para después", p.quiero.map((id) => producto(id)?.nombre ?? "").filter(Boolean));
  linea("Nota", p.llevar);
  linea("Quiero saber de", p.saberMas);
  const comp = p.compartir.filter((c) => c.nombre);
  if (comp.length) linea("Compartir mi lista con", comp.map((c) => `${c.nombre}${c.parentesco ? ` (${c.parentesco})` : ""} ${telTexto(c.tel)}`.trim()));
  const am = p.amigas.filter((a) => a.nombre);
  if (am.length) linea("Amigas para un facial", am.map((a) => `${a.nombre} ${telTexto(a.tel)}`.trim()));
  return l.join("\n");
}

/* Inventario de la consultora: lo que tiene en mano (datos de ejemplo) */
const STOCK_INICIAL: Record<string, number> = {
  limpiador: 4, serum: 2, "crema-dia": 3, "crema-noche": 1, base: 3, polvo: 1, rubor: 2, paleta: 1, "labial-nude": 4, "labial-rojo": 3, brochas: 1,
};
const CLAVE_STOCK = "perfil-belleza:stock-v1";
export function useInventario() {
  const [stock, setStock] = useState<Record<string, number>>(() => {
    try {
      const t = localStorage.getItem(CLAVE_STOCK);
      return t ? { ...STOCK_INICIAL, ...JSON.parse(t) } : STOCK_INICIAL;
    } catch {
      return STOCK_INICIAL;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STOCK, JSON.stringify(stock));
    } catch {
      /* nada */
    }
  }, [stock]);
  return {
    stock,
    sumar: (id: string, n: number) => setStock((s) => ({ ...s, [id]: Math.max(0, (s[id] ?? 0) + n) })),
    descontar: (ids: string[]) =>
      setStock((s) => {
        const c = { ...s };
        ids.forEach((id) => (c[id] = Math.max(0, (c[id] ?? 0) - 1)));
        return c;
      }),
  };
}

/* Lo que falta por cobrar de un pedido, ya con los abonos */
export const abonado = (p: Perfil) => (p.abonos ?? []).reduce((t, a) => t + a.monto, 0);
export const saldo = (p: Perfil) => Math.max(0, totalDe(p.llevo) - abonado(p));

/* Envío por zona, como lo cobran las consultoras */
export const ENVIOS = [
  { id: "capital", nombre: "Ciudad de Guatemala", precio: 25, dias: "24 a 48 horas" },
  { id: "aledanos", nombre: "Mixco, Villa Nueva y alrededores", precio: 30, dias: "24 a 48 horas" },
  { id: "departamentos", nombre: "Otros departamentos", precio: 45, dias: "3 a 5 días" },
  { id: "recoger", nombre: "Paso a recogerlo", precio: 0, dias: "cuando quieras" },
];

/* Promos de la campaña (cambian cada tres semanas) */
export const CAMPANA = { nombre: "Campaña 17", fin: new Date(Date.now() + 9 * 864e5) };
export const PROMOS = [
  { t: "Rutina completa de piel", d: "Limpiador, sérum de vitamina C y crema de día", antes: 600, ahora: 499, ids: ["limpiador", "serum", "crema-dia"], limitada: false },
  { t: "Dos labiales", d: "El nude y el rojo, para el día y la noche", antes: 220, ahora: 175, ids: ["labial-nude", "labial-rojo"], limitada: false },
  { t: "Paleta de temporada", d: "Edición limitada: cuando se acabe, ya no vuelve", antes: 0, ahora: 230, ids: ["paleta"], limitada: true },
];

export const OPINIONES = [
  { quien: "Ana Lucía, 58 años", d: "Me daba pena preguntar cómo se usaba todo. Sofía me lo explicó con calma y ahora ya no se me reseca la cara." },
  { quien: "Karla, 24 años", d: "Pedí el lunes y el martes ya lo tenía. Le pagué al recibir, sin complicaciones." },
  { quien: "Rosa María, 41 años", d: "Encontré mi tono de base a la primera. Antes compraba en la farmacia y nunca me quedaba." },
];

/* Listas que llena la gente desde la página: avisos de promos y las que quieren entrar al equipo */
export type Aviso = { id: string; nombre: string; telefono: string; temas: string[]; fecha: string };
export type Interesada = { id: string; nombre: string; telefono: string; por: string; fecha: string };
export const TEMAS_AVISO = ["Cuidado de la piel", "Maquillaje", "Perfumes"];
export const RAZONES_EQUIPO = ["Quiero ganar dinero extra", "Quiero descuento en mis productos", "Me gusta el maquillaje y enseñar"];
const EJ_AVISOS: Aviso[] = [
  { id: "av-1", nombre: "Sandra López", telefono: "53318890", temas: ["Maquillaje", "Perfumes"], fecha: hace(3) },
  { id: "av-2", nombre: "Gabriela Castillo", telefono: "42139988", temas: ["Cuidado de la piel"], fecha: hace(5) },
  { id: "av-3", nombre: "Karla Méndez", telefono: "50021934", temas: ["Maquillaje"], fecha: hace(6) },
];
const EJ_INTERESADAS: Interesada[] = [{ id: "in-1", nombre: "Paola Méndez", telefono: "31207745", por: "Quiero ganar dinero extra", fecha: hace(1) }];
function useLista<T>(clave: string, inicial: T[]) {
  const [lista, setLista] = useState<T[]>(() => {
    try {
      const t = localStorage.getItem(clave);
      return t ? (JSON.parse(t) as T[]) : inicial;
    } catch {
      return inicial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(lista));
    } catch {
      /* nada */
    }
  }, [clave, lista]);
  return { lista, agregar: (x: T) => setLista((l) => [x, ...l]) };
}
export const useAvisos = () => useLista<Aviso>("perfil-belleza:avisos-v1", EJ_AVISOS);
export const useInteresadas = () => useLista<Interesada>("perfil-belleza:interesadas-v1", EJ_INTERESADAS);
export const nuevoId = () => crypto.randomUUID?.() ?? String(Date.now() + Math.random());
