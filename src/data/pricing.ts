/*
 * Precios de Jzet Labs. Tienen que cuadrar EXACTO con La tienda
 * (latienda-jzetlabs.vercel.app). Si cambias algo aquí, cámbialo allá.
 * Tiempos = días hábiles desde que el cliente me pasa sus textos y fotos.
 */

export type KindId = "expres" | "landing" | "tienda" | "sistema";
/** los tipos que también salen en la comparación con agencias */
export type KindComparable = Exclude<KindId, "expres">;

export interface Kind {
  id: KindId;
  name: string;
  pitch: string;
  base: number;
  /** días hábiles [mín, máx] en ritmo normal */
  days: [number, number];
}

export const KINDS: Kind[] = [
  { id: "expres", name: "Página exprés", pitch: "Una sola página con tu información, fotos y botón a WhatsApp.", base: 700, days: [1, 2] },
  { id: "landing", name: "Landing page", pitch: "Te presenta bien y te manda clientes al WhatsApp.", base: 1000, days: [2, 4] },
  { id: "tienda", name: "Tienda en línea", pitch: "Catálogo, carrito, pedidos y tu panel para manejarla.", base: 2800, days: [7, 12] },
  { id: "sistema", name: "Sistema a la medida", pitch: "Eso que hoy haces a mano. Precio de entrada: lo afinamos según lo que lleve.", base: 4500, days: [12, 25] },
];

export const CUOTAS = 4;
export const cuota = (k: Kind) => Math.round(k.base / CUOTAS);

export interface Pace {
  id: string;
  name: string;
  note: string;
  priceMult: number;
  timeMult: number;
}

export const PACES: Pace[] = [
  { id: "calma", name: "Con calma", note: "Más barato · −10%", priceMult: 0.9, timeMult: 1.5 },
  { id: "normal", name: "Normal", note: "Precio base", priceMult: 1, timeMult: 1 },
  { id: "ya", name: "Lo necesito ya", note: "Con prioridad · +25%", priceMult: 1.25, timeMult: 0.6 },
];

/** plan de cambios opcional, al mes; es lo único mensual y se cancela cuando quieras */
export const CARE_PLAN = 200;
/** contrato formal: firmado en papel y con firmas legalizadas ante notario */
export const CONTRATO_FORMAL = 250;

export const ACUERDOS = [
  { id: "sencillo", name: "Sencillo", note: "Te mando la propuesta por escrito y la aceptas por WhatsApp. Incluido.", precio: 0 },
  { id: "formal", name: "Con contrato formal", note: `Contrato firmado en papel, con firmas legalizadas ante notario. +Q${CONTRATO_FORMAL}.`, precio: CONTRATO_FORMAL },
];

export const DOMAIN_PRICE = 150;
/** renovación del dominio desde el 2do año */
export const DOMAIN_RENEWAL = 100;

export const roundTo50 = (n: number) => Math.round(n / 50) * 50;

/** días ajustados al ritmo (mismo cálculo que La tienda) */
export function diasConRitmo(k: Kind, p: Pace): [number, number] {
  const min = Math.max(1, Math.round(k.days[0] * p.timeMult));
  const max = Math.max(min + 1, Math.round(k.days[1] * p.timeMult));
  return [min, max];
}
