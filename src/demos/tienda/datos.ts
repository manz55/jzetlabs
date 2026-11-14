/*
 * Datos de ejemplo de la demo de tienda. Negocios inventados; precios de prueba.
 * Fotos libres de Unsplash (licencia Unsplash), bajadas y recortadas en src/assets/demo-tienda.
 */
import ropaHero from "@/assets/demo-tienda/ropa-hero.jpg";
import ropa1 from "@/assets/demo-tienda/ropa-1.jpg";
import ropa2 from "@/assets/demo-tienda/ropa-2.jpg";
import ropa3 from "@/assets/demo-tienda/ropa-3.jpg";
import ropa4 from "@/assets/demo-tienda/ropa-4.jpg";
import ropa5 from "@/assets/demo-tienda/ropa-5.jpg";
import ropa6 from "@/assets/demo-tienda/ropa-6.jpg";
import comidaHero from "@/assets/demo-tienda/comida-hero.jpg";
import comida1 from "@/assets/demo-tienda/comida-1.jpg";
import comida2 from "@/assets/demo-tienda/comida-2.jpg";
import comida3 from "@/assets/demo-tienda/comida-3.jpg";
import comida4 from "@/assets/demo-tienda/comida-4.jpg";
import comida5 from "@/assets/demo-tienda/comida-5.jpg";
import comida6 from "@/assets/demo-tienda/comida-6.jpg";
import tiempoHero from "@/assets/demo-tienda/tiempo-hero.jpg";
import tiempo1 from "@/assets/demo-tienda/tiempo-1.jpg";
import tiempo2 from "@/assets/demo-tienda/tiempo-2.jpg";
import tiempo3 from "@/assets/demo-tienda/tiempo-3.jpg";
import tiempo4 from "@/assets/demo-tienda/tiempo-4.jpg";
import tiempo5 from "@/assets/demo-tienda/tiempo-5.jpg";
import tiempo6 from "@/assets/demo-tienda/tiempo-6.jpg";

export type Tipo = "ropa" | "restaurante" | "tiempo";

export type Item = { nombre: string; detalle: string; precio?: number; foto: string; opciones?: string[] };

export type Negocio = {
  tipo: Tipo;
  etiqueta: string; // para el selector de la banda
  marca: string;
  menu: string[];
  cta: string;
  titulo: string;
  bajada: string;
  botones: [string, string];
  hero: string;
  seccion: { etiqueta: string; titulo: string; texto: string };
  items: Item[];
  verbo: string; // "Agregar", "Pedir"
  tema: {
    fondo: string;
    tinta: string;
    suave: string;
    acento: string;
    titulos: string; // familia de letra de los títulos
  };
};

export const NEGOCIOS: Record<Tipo, Negocio> = {
  ropa: {
    tipo: "ropa",
    etiqueta: "Tienda de ropa",
    marca: "Nómada Studio",
    menu: ["Catálogo", "Tallas", "Envíos"],
    cta: "Ver catálogo",
    titulo: "Ropa para andar la ciudad a su ritmo",
    bajada: "Prendas cómodas y con carácter, hechas en lotes pequeños. Elija su talla, arme su pedido y le llega por WhatsApp.",
    botones: ["Ver catálogo", "Cómo comprar"],
    hero: ropaHero,
    seccion: { etiqueta: "Catálogo", titulo: "Lo nuevo de la semana", texto: "Pase el mouse por una prenda para verla de cerca." },
    items: [
      { nombre: "Playera básica", detalle: "Algodón grueso, corte recto", precio: 129, foto: ropa1, opciones: ["S", "M", "L", "XL"] },
      { nombre: "Jeans rectos", detalle: "Mezclilla de 12 oz", precio: 349, foto: ropa2, opciones: ["28", "30", "32", "34"] },
      { nombre: "Camisa naranja", detalle: "Manga larga, franela suave", precio: 279, foto: ropa3, opciones: ["S", "M", "L"] },
      { nombre: "Suéteres tejidos", detalle: "Lana suave, colores de otoño", precio: 299, foto: ropa4, opciones: ["S", "M", "L"] },
      { nombre: "Kit de verano", detalle: "Lentes, bolso y blusa", precio: 389, foto: ropa5 },
      { nombre: "Chaqueta pintada", detalle: "Pieza única, pintada a mano", precio: 690, foto: ropa6, opciones: ["M", "L"] },
    ],
    verbo: "Agregar",
    tema: { fondo: "#f4efe8", tinta: "#1d1a17", suave: "#6b625a", acento: "#c2410c", titulos: '"Bricolage Grotesque", sans-serif' },
  },
  restaurante: {
    tipo: "restaurante",
    etiqueta: "Restaurante",
    marca: "Trattoria Sole",
    menu: ["Menú", "Horario", "Ubicación"],
    cta: "Ver menú",
    titulo: "Pasta fresca, hecha cada mañana",
    bajada: "Cocina italiana sencilla, con ingredientes de aquí. Pida desde su teléfono y le avisamos cuando su pedido salga.",
    botones: ["Ver menú", "Reservar mesa"],
    hero: comidaHero,
    seccion: { etiqueta: "Menú", titulo: "Lo más pedido", texto: "Precios al día. Toque un platillo para agregarlo a su pedido." },
    items: [
      { nombre: "Penne a la boloñesa", detalle: "Salsa de carne de 4 horas", precio: 95, foto: comida1 },
      { nombre: "Spaghetti pomodoro", detalle: "Tomate, albahaca y parmesano", precio: 85, foto: comida2 },
      { nombre: "Pasta al pesto", detalle: "Albahaca, nueces y queso", precio: 89, foto: comida3 },
      { nombre: "Pizza margarita", detalle: "Masa madre, horno de leña", precio: 110, foto: comida4 },
      { nombre: "Ensalada caprese", detalle: "Tomate, mozzarella y albahaca", precio: 65, foto: comida5 },
      { nombre: "Yogur con frutos rojos", detalle: "Con granola de la casa", precio: 35, foto: comida6 },
    ],
    verbo: "Pedir",
    tema: { fondo: "#fbf6ee", tinta: "#2b1d16", suave: "#6e5a4c", acento: "#b23a2a", titulos: '"Fraunces", Georgia, serif' },
  },
  tiempo: {
    tipo: "tiempo",
    etiqueta: "Tiempo compartido",
    marca: "Costa Serena Club",
    menu: ["El club", "Planes", "Semanas"],
    cta: "Ver planes",
    titulo: "Su semana frente al mar, todos los años",
    bajada: "Un club de playa con villas, piscina y atención todo el año. Elija su plan, vea qué semanas hay libres y apártela en línea.",
    botones: ["Ver planes", "Semanas libres"],
    hero: tiempoHero,
    seccion: { etiqueta: "El club", titulo: "Lo que incluye su semana", texto: "Pase el mouse por cada foto para verla de cerca." },
    items: [
      { nombre: "Piscina y tumbonas", detalle: "Abierta de 7:00 a 22:00", foto: tiempo1 },
      { nombre: "Villa con vista al mar", detalle: "2 habitaciones y terraza", foto: tiempo2 },
      { nombre: "Playa privada", detalle: "Sombrillas y servicio de bebidas", foto: tiempo3 },
      { nombre: "Casitas de madera", detalle: "Para grupos y familias", foto: tiempo4 },
      { nombre: "Habitaciones", detalle: "Aire acondicionado y ropa de cama", foto: tiempo5 },
      { nombre: "Senderos", detalle: "Caminatas al atardecer", foto: tiempo6 },
    ],
    verbo: "",
    tema: { fondo: "#f3f7f6", tinta: "#10302f", suave: "#4d6664", acento: "#0f766e", titulos: '"Bricolage Grotesque", sans-serif' },
  },
};

export const PLANES = [
  {
    nombre: "Semana flexible",
    nota: "Una semana al año, en temporada baja.",
    precio: "Q4,500",
    incluye: ["1 semana al año", "Hasta 4 personas", "Piscina y áreas comunes", "Cambio de fecha gratis"],
  },
  {
    nombre: "Todo el año",
    nota: "Dos semanas, una en temporada alta.",
    precio: "Q8,900",
    incluye: ["2 semanas al año", "Temporada alta incluida", "Hasta 6 personas", "Prioridad para apartar", "Traslado desde la capital"],
    destacado: true,
  },
];

/* semanas ocupadas de ejemplo (siempre las mismas) */
export const OCUPADAS = new Set([1, 2, 6, 7, 12, 13, 14, 15, 18, 22, 26, 27, 28, 29, 31, 33, 36, 40, 44, 45, 50, 51, 52]);
