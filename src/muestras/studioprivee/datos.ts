/*
 * Piezas reales de Studio Privée tomadas de sus publicaciones de Instagram
 * (noviembre 2026): marca, talla, estado y precios tal como los publicaron.
 * Lo que dice "ejemplo" es para enseñar cómo funcionaría.
 */
const ARCHIVOS = import.meta.glob("../../assets/muestra-studioprivee/*.jpg", { eager: true, import: "default" }) as Record<string, string>;
const foto = (n: string) => ARCHIVOS[`../../assets/muestra-studioprivee/${n}.jpg`];
/** La foto principal y las otras vistas que haya de la misma pieza. */
const fotos = (n: string) => [n, `${n}-2`, `${n}-3`].map(foto).filter(Boolean);

export const portada = foto("portada");
export const navidad = foto("navidad-12-dias");


export const VINO = "#5e1222";
export const ORO = "#a8864f";
export const CREMA = "#f6f1ea";
export const PIEDRA = "#e9e1d6";
export const TINTA = "#2b2520";

export type Categoria = "Vestidos" | "Looks" | "Bolsos" | "Zapatos" | "Interiores";
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
  fotos: string[];
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
    fotos: fotos("aritzia"),
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
    fotos: fotos("maude"),
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
    fotos: fotos("ferragamo"),
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
    fotos: fotos("mk-tote"),
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
    fotos: fotos("fucsia"),
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
    fotos: fotos("paris"),
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
    id: "reiss",
    titulo: "Milo Belted Jumpsuit",
    marca: "Reiss",
    categoria: "Vestidos",
    fotos: fotos("reiss"),
    descripcion: "Cuello drapeado, pierna amplia y cinturón que define la cintura. Negro. Para celebrar esta temporada y mucho más allá.",
    estadoPieza: "Como nuevo",
    talla: "USA 2",
    original: "Q2,944",
    sp: "Q1,766",
    descuento: 40,
    estado: "Disponible",
    regalo: true,
  },
  {
    id: "leiber",
    titulo: "Crystal Evening Clutch",
    marca: "Judith Leiber",
    categoria: "Bolsos",
    fotos: fotos("leiber"),
    descripcion: "Silueta estructurada con cristales en tonos champagne y un elegante marco metálico. Una pieza para destacar.",
    estadoPieza: "Excelente, con leves señales de uso",
    original: "US$4,000",
    sp: null,
    estado: "Disponible",
    regalo: true,
  },
  {
    id: "stuart",
    titulo: "Sandalias Rockstar",
    marca: "Stuart Weitzman",
    categoria: "Zapatos",
    fotos: fotos("stuart"),
    descripcion: "Tono plateado con tiras adornadas con cristales y silueta slingback. Para un vestido de fiesta o un look de noche.",
    estadoPieza: "Preloved, con señales de uso",
    talla: "6 US",
    original: "Q3,018 aprox.",
    sp: "Q1,600",
    descuento: 47,
    estado: "Disponible",
    regalo: true,
  },
  {
    id: "reformation",
    titulo: "Un look para brillar esta temporada",
    marca: "Varias marcas",
    categoria: "Looks",
    fotos: fotos("reformation"),
    descripcion: "Lo romántico y lo sofisticado: top de mangas abullonadas y falda con acabado brillante.",
    original: "$266",
    sp: "Q1,138",
    estado: "Disponible",
    partes: [
      { nombre: "Top de mangas abullonadas", marca: "Reformation", talla: "2", original: "$128", sp: "Q539" },
      { nombre: "Falda con acabado brillante", marca: "Commando", talla: "S", original: "$138", sp: "Q599" },
    ],
    regalo: true,
  },
  {
    id: "burberry",
    titulo: "Un look, tres piezas",
    marca: "Varias marcas",
    categoria: "Looks",
    fotos: fotos("burberry"),
    descripcion: "Clásico y elegante: camisa de cuadros, jeans de corte recto y blazer tipo capa. Cada pieza con 45% de descuento.",
    original: "Q7,519.19",
    sp: "Q4,135.55",
    descuento: 45,
    estado: "Disponible",
    partes: [
      { nombre: "Camisa de cuadros", marca: "Burberry London", talla: "42", original: "Q5,469.75", sp: "Q3,008.36" },
      { nombre: "Lisa High Rise Straight Jeans", marca: "Reformation", talla: "25", original: "Q1,285.20", sp: "Q706.86" },
      { nombre: "Blazer tipo capa", marca: "Zara", talla: "XS", original: "Q764.24", sp: "Q420.33" },
    ],
  },
  {
    id: "brownie",
    titulo: "Dos piezas, un look",
    marca: "Varias marcas",
    categoria: "Looks",
    fotos: fotos("brownie"),
    descripcion: "Suéter de rayas cuello alto en café y azul claro, con pantalón wide leg azul grisáceo. 45% de descuento en cada pieza.",
    original: "Q1,568.25",
    sp: "Q862.54",
    descuento: 45,
    estado: "Disponible",
    partes: [
      { nombre: "Suéter de rayas cuello alto", marca: "Brownie", talla: "XXS", original: "Q497.25", sp: "Q273.49" },
      { nombre: "Pantalón wide leg", marca: "Vicolo", talla: "S", original: "Q1,071", sp: "Q589.05" },
    ],
  },
  {
    id: "artefacto",
    titulo: "Jarrón escultórico",
    marca: "Artefacto",
    categoria: "Interiores",
    fotos: fotos("artefacto"),
    descripcion: "De la casa de diseño Artefacto: silueta elegante con textura escultórica. Para destacar solo o acompañar tu decoración de fiestas.",
    original: "Q1,489.80",
    sp: "Q744.90",
    descuento: 50,
    estado: "Disponible",
    regalo: true,
  },
  {
    id: "globo",
    titulo: "Globo terráqueo decorativo",
    marca: "Decoración",
    categoria: "Interiores",
    fotos: fotos("globo"),
    descripcion: "Acabado metálico y base negra. Un toque clásico para una biblioteca, oficina o sala, y un regalo para quien sueña con viajar.",
    estadoPieza: "Como nuevo",
    original: "Q649.40",
    sp: "Q324.70",
    descuento: 50,
    estado: "Vendida",
    regalo: true,
  },
  {
    id: "lapin",
    titulo: "Lapin de Lumière",
    marca: "Escultura",
    categoria: "Interiores",
    fotos: fotos("lapin"),
    descripcion: "Un homenaje al niño soñador que sigue en nosotros. Polvo de mármol inyectado, resina y metal. 70 cm de alto, 35 x 28 cm de ancho.",
    original: "$2,300",
    sp: "Q7,200",
    estado: "Disponible",
    regalo: true,
  },
];

export const CATEGORIAS: ("Todo" | Categoria)[] = ["Todo", "Vestidos", "Looks", "Bolsos", "Zapatos", "Interiores"];

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

/** Pedido de ejemplo para enseñar el rastreo. */
export const PEDIDO_EJEMPLO = {
  codigo: "SP-2041",
  nombre: "Andrea",
  piezas: ["Vince Camuto · Blusa floral", "Botas altas de gamuza chocolate"],
  regalo: true,
  pasos: [
    ["Apartada", "1 de diciembre, 10:24"],
    ["Anticipo recibido", "1 de diciembre, 10:40"],
    ["Envuelta para regalo", "2 de diciembre"],
    ["En camino", "3 de diciembre · zona 15"],
    ["Entregada", ""],
  ] as [string, string][],
  actual: 3,
};

/** Respuestas listas del chat. La primera palabra clave que coincida gana. */
export const CHAT: { pregunta: string; claves: string[]; respuesta: string }[] = [
  { pregunta: "¿Cómo aparto una pieza?", claves: ["apart", "reserv", "como compro", "comprar"], respuesta: "Abres la pieza, escribes tu nombre y tocas Apartar. Con el 20% queda a tu nombre por 48 horas y pagas el resto al recibir." },
  { pregunta: "¿Las piezas son originales?", claves: ["original", "autentic", "falso", "replica"], respuesta: "Sí. Cada pieza se revisa antes de publicarse y en la ficha te decimos su estado tal cual, con fotos reales." },
  { pregunta: "¿Hacen envíos?", claves: ["envio", "envían", "envian", "entrega", "domicilio", "llega"], respuesta: "Sí, a toda Guatemala. En la capital se entrega en 1 o 2 días. También puedes recogerla en persona." },
  { pregunta: "¿Me la envuelven para regalo?", claves: ["regalo", "envuel", "tarjeta"], respuesta: "Sí. Al apartar marca “Es para regalo” y escribe el mensaje de la tarjeta. Va envuelta sin precio." },
  { pregunta: "¿Puedo devolver una pieza?", claves: ["devol", "cambio", "cambiar", "reembolso"], respuesta: "Como son piezas únicas de segunda mano no hay cambios. Por eso te mandamos fotos y medidas antes de que pagues." },
  { pregunta: "¿Dónde va mi pedido?", claves: ["pedido", "rastre", "donde va", "mi orden"], respuesta: "En “Mi pedido” escribes tu código (por ejemplo SP-2041) y ves en qué paso va." },
  { pregunta: "¿Cómo dejo mis piezas en consignación?", claves: ["consign", "vender mis", "dejar mis", "tengo piezas"], respuesta: "En “Consigna tus piezas” calculas cuánto te tocaría y nos mandas fotos. Te avisamos cuando se vende." },
  { pregunta: "¿Cómo pago?", claves: ["pago", "pagar", "tarjeta de", "transfer", "efectivo"], respuesta: "Transferencia o depósito para el anticipo, y el resto al recibir en efectivo o transferencia." },
];
