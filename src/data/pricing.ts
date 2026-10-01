/*
 * Precios de referencia del cotizador. Todo vive aquí para cambiarlo fácil.
 * Los montos son "desde": el precio final se confirma al platicar.
 */

export type KindId = "landing" | "tienda" | "sistema";

export interface Kind {
  id: KindId;
  name: string;
  pitch: string;
  base: number;
  /** días hábiles en ritmo normal [mín, máx] */
  days: [number, number];
  /** lo que suele cobrar el mercado en Guate [mín, máx] */
  market: [number, number];
  includes: string[];
}

export const KINDS: Kind[] = [
  {
    id: "landing",
    name: "Landing page",
    pitch: "Una página que te presente bien y te mande clientes al WhatsApp.",
    base: 1000,
    days: [4, 7],
    market: [1800, 3000],
    includes: ["Diseño a la medida", "Se ve bien en cel y compu", "Botón a WhatsApp", "Hosting gratis"],
  },
  {
    id: "tienda",
    name: "Tienda en línea",
    pitch: "Catálogo, carrito y pedidos, con un panel para que vos lo manejés.",
    base: 2400,
    days: [12, 18],
    market: [5000, 9000],
    includes: ["Catálogo y carrito", "Pedidos a WhatsApp y correo", "Panel de admin", "Hosting gratis"],
  },
  {
    id: "sistema",
    name: "Sistema a la medida",
    pitch: "Asistencia, registros, inventario, planilla… eso que hoy hacés a mano.",
    base: 4500,
    days: [20, 35],
    market: [9000, 30000],
    includes: ["Usuarios y permisos", "Base de datos en la nube", "Reportes", "Manual de uso"],
  },
];

export interface Extra {
  id: string;
  name: string;
  price: number;
  days: number;
  /** tipos donde tiene sentido ofrecerlo */
  for: KindId[];
}

export const EXTRAS: Extra[] = [
  { id: "secciones", name: "Páginas o secciones extra", price: 250, days: 2, for: ["landing"] },
  { id: "panel", name: "Panel para editar textos y fotos", price: 600, days: 3, for: ["landing"] },
  { id: "textos", name: "Te ayudo con los textos", price: 150, days: 1, for: ["landing", "tienda", "sistema"] },
  { id: "formulario", name: "Formulario que llega a tu correo", price: 200, days: 1, for: ["landing"] },
  { id: "pagos", name: "Pagos con tarjeta", price: 700, days: 4, for: ["tienda"] },
  { id: "correos", name: "Correos automáticos al cliente", price: 300, days: 2, for: ["tienda", "sistema"] },
  { id: "offline", name: "Que funcione sin internet", price: 600, days: 4, for: ["sistema", "tienda"] },
  { id: "reportes", name: "Reportes en Excel / PDF", price: 400, days: 2, for: ["sistema", "tienda"] },
  { id: "capacitacion", name: "Capacitación + manual", price: 200, days: 1, for: ["tienda", "sistema"] },
];

export interface Pace {
  id: string;
  name: string;
  note: string;
  priceMult: number;
  timeMult: number;
}

export const PACES: Pace[] = [
  { id: "calma", name: "Con calma", note: "Si no hay prisa, te sale más barato.", priceMult: 0.9, timeMult: 1.5 },
  { id: "normal", name: "Normal", note: "El ritmo de siempre.", priceMult: 1, timeMult: 1 },
  { id: "ya", name: "Lo necesito ya", note: "Le meto prioridad y le doy hasta en la noche.", priceMult: 1.2, timeMult: 0.6 },
];

export const DOMAIN_PRICE = 150;
/** renovación del dominio desde el 2do año; el hosting en Vercel es gratis */
export const DOMAIN_RENEWAL = 100;

export interface PayPlan {
  id: string;
  name: string;
  months: number;
  discount: number;
  note: string;
}

export const PAY_PLANS: PayPlan[] = [
  { id: "unico", name: "Pago único", months: 1, discount: 0.05, note: "5% menos" },
  { id: "2", name: "2 pagos", months: 2, discount: 0, note: "mitad y mitad" },
  { id: "3", name: "3 meses", months: 3, discount: 0, note: "sin recargo" },
  { id: "4", name: "4 meses", months: 4, discount: 0, note: "sin recargo" },
];

export const roundTo50 = (n: number) => Math.round(n / 50) * 50;
