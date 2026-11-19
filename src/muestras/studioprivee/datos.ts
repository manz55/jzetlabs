/*
 * Piezas reales de Studio Privée tomadas de sus publicaciones de Instagram
 * (noviembre 2026): marca, talla, estado y precios tal como los publicaron.
 * Lo que dice "ejemplo" es para enseñar cómo funcionaría.
 */
import aritzia from "@/assets/muestra-studioprivee/aritzia.jpg";
import maude from "@/assets/muestra-studioprivee/maude.jpg";
import ferragamo from "@/assets/muestra-studioprivee/ferragamo.jpg";
import mkTote from "@/assets/muestra-studioprivee/mk-tote.jpg";
import fucsia from "@/assets/muestra-studioprivee/fucsia.jpg";
import paris from "@/assets/muestra-studioprivee/paris.jpg";
import lapin from "@/assets/muestra-studioprivee/lapin.jpg";
import portada from "@/assets/muestra-studioprivee/portada.jpg";
import navidad from "@/assets/muestra-studioprivee/navidad-12-dias.jpg";

export { portada, navidad };

export const VINO = "#5e1222";
export const ORO = "#a8864f";
export const CREMA = "#f6f1ea";
export const PIEDRA = "#e9e1d6";
export const TINTA = "#2b2520";

export type Categoria = "Vestidos" | "Bolsos" | "Looks" | "Interiores";
export type Estado = "Disponible" | "Apartada" | "Vendida";

export interface Parte {
  nombre: string;
  marca: string;
  talla?: string;
  original: string;
  sp: string | null; // null = por confirmar
  nota?: string;
}

export interface Pieza {
  id: string;
  titulo: string;
  marca: string;
  categoria: Categoria;
  foto: string;
  descripcion: string;
  estadoPieza?: string;
  talla?: string;
  original: string;
  sp: string | null;
  descuento?: number;
  estado: Estado;
  partes?: Parte[];
  regalo?: boolean;
}

export const PIEZAS: Pieza[] = [
  {
    id: "aritzia",
    titulo: "Wilfred Engage Dress",
    marca: "Aritzia",
    categoria: "Vestidos",
    foto: aritzia,
    descripcion: "Vestido midi rosa malva con vuelos delicados, ruedo asimétrico y abertura. La flor en el tirante le da un toque especial.",
    estadoPieza: "Como nuevo",
    talla: "M",
    original: "Q1,209",
    sp: "Q725.40",
    descuento: 40,
    estado: "Disponible",
    regalo: true,
  },
  {
    id: "maude",
    titulo: "Blair Dress",
    marca: "Maude Club",
    categoria: "Vestidos",
    foto: maude,
    descripcion: "Silueta sencilla con un lazo negro que la vuelve especial. Para celebraciones y cenas, elegante sin esfuerzo.",
    estadoPieza: "Como nuevo",
    talla: "SP · Small Petite",
    original: "Q856.03",
    sp: "Q513.62",
    descuento: 40,
    estado: "Disponible",
    regalo: true,
  },
  {
    id: "ferragamo",
    titulo: "Bolso con destellos",
    marca: "Salvatore Ferragamo",
    categoria: "Bolsos",
    foto: ferragamo,
    descripcion: "Silueta alargada con frente de destellos en champán, bronce y dorado. Aplicaciones añadidas para hacerla una pieza personalizada.",
    estadoPieza: "Leves rasguños en la parte trasera",
    original: "$2,500",
    sp: "$1,500",
    descuento: 40,
    estado: "Disponible",
    regalo: true,
  },
  {
    id: "mk",
    titulo: "Susannah Large East-West Tote",
    marca: "Michael Kors",
    categoria: "Bolsos",
    foto: mkTote,
    descripcion: "Piel negra Saffiano con herrajes dorados. Estructurada y elegante, para llevar todo lo esencial.",
    original: "Q2,738",
    sp: "Q1,506",
    descuento: 45,
    estado: "Apartada",
    regalo: true,
  },
  {
    id: "fucsia",
    titulo: "Un look que se roba la atención",
    marca: "Varias marcas",
    categoria: "Looks",
    foto: fucsia,
    descripcion: "Bordado blanco, fucsia vibrante y botines negros. Puedes llevarte el look completo o solo la pieza que te guste.",
    original: "Q9,723.15",
    sp: null,
    estado: "Disponible",
    partes: [
      { nombre: "Top con cuello halter y bordado blanco", marca: "White House Black Market", talla: "0", original: "Q749.70", sp: "Q344.25" },
      { nombre: "Pantalón jacquard fucsia, pierna amplia", marca: "Pepa Pombo", talla: "M", original: "Q7,611.75", sp: null },
      { nombre: "Botines de gamuza negra", marca: "Free People", talla: "8", original: "Q1,361.70", sp: "Q680.85", nota: "50% de descuento" },
    ],
  },
  {
    id: "paris",
    titulo: "Una noche en París",
    marca: "Varias marcas",
    categoria: "Looks",
    foto: paris,
    descripcion: "Flores en terracota, punto negro y gamuza chocolate. Tres piezas para tus cenas de temporada.",
    original: "Q5,860",
    sp: "Q2,930",
    descuento: 50,
    estado: "Disponible",
    partes: [
      { nombre: "Blusa floral", marca: "Vince Camuto", original: "Q680", sp: "Q340" },
      { nombre: "Falda negra", marca: "St. John Basics", talla: "2", original: "Q3,800", sp: "Q1,900" },
      { nombre: "Botas altas de gamuza chocolate", marca: "", original: "Q1,380", sp: "Q690" },
    ],
    regalo: true,
  },
  {
    id: "lapin",
    titulo: "Lapin de Lumière",
    marca: "Escultura",
    categoria: "Interiores",
    foto: lapin,
    descripcion: "Un homenaje al niño soñador que sigue en nosotros. Polvo de mármol inyectado, resina y metal. 70 cm de alto, 35 x 28 cm de ancho.",
    original: "$2,300",
    sp: "Q7,200",
    estado: "Disponible",
    regalo: true,
  },
];

export const CATEGORIAS: ("Todo" | Categoria)[] = ["Todo", "Vestidos", "Bolsos", "Looks", "Interiores"];

/** Texto en quetzales o dólares a número (para sumar). */
export function numero(p: string) {
  return Number(p.replace(/[^\d.]/g, ""));
}
export function moneda(p: string) {
  return p.trim().startsWith("$") ? "$" : "Q";
}
export function formato(n: number, m: string) {
  return `${m}${n.toLocaleString("es-GT", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
}

export const PASOS = [
  ["Escoges tu pieza", "Cada pieza es única. Si dice Disponible, todavía es tuya."],
  ["La apartas por 48 horas", "Con el 20% queda a tu nombre y nadie más la puede pedir."],
  ["La recibes o la recoges", "Envío en la capital o entrega en persona. Pagas el resto al recibir."],
];

export const PREGUNTAS = [
  ["¿Las piezas son originales?", "Sí. Cada pieza se revisa antes de publicarse, y en la ficha te decimos su estado tal cual."],
  ["¿Puedo devolver una pieza?", "Como son piezas únicas de segunda mano, no hay cambios. Por eso te mandamos fotos y medidas antes de que pagues."],
  ["¿Hacen envíos?", "Sí, a toda Guatemala. En la capital, entrega el mismo día o al siguiente."],
  ["¿Puedo dejar mis piezas en consignación?", "Sí. Las recibimos, las fotografiamos y te avisamos cuando se venden."],
];
