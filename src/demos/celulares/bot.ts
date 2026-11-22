/*
 * Lo que comparten la tienda, el panel y el bot de WhatsApp: la conversación y los avisos.
 * Cuando un cliente agrega algo al carrito o hace un pedido en la tienda, el bot le escribe al dueño aunque
 * el panel esté en otra sección; por eso la conversación vive aquí y no dentro de la pantalla del chat.
 */
import { useSyncExternalStore } from "react";
import { qz } from "../comun";
import type { Pedido } from "./datos";

export type Boton = { id: string; t: string };
export type Msg = { de: "bot" | "yo"; texto: string; botones?: Boton[]; hora: string; usada?: boolean; fotos?: string[] };
export type Borrador = { fotos: string[]; nombre?: string; precio?: number; unidades?: number; condicion: "Nuevo" | "Seminuevo"; capacidad?: string; sucursal: string };

export const horaAhora = () => new Date().toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false });
export const msgBot = (texto: string, botones?: Boton[]): Msg => ({ de: "bot", texto, botones, hora: horaAhora() });

let mensajes: Msg[] = [];
let borrador: Borrador | null = null;
const oyentes = new Set<() => void>();
const avisar = () => oyentes.forEach((f) => f());
const suscribir = (f: () => void) => { oyentes.add(f); return () => { oyentes.delete(f); }; };

export const useChat = () => useSyncExternalStore(suscribir, () => mensajes);
export const hayChat = () => mensajes.length > 0;
export const chatAgregar = (...m: Msg[]) => { mensajes = [...mensajes, ...m]; avisar(); };
export const chatMarcarUsada = (i: number) => { mensajes = mensajes.map((x, k) => (k === i ? { ...x, usada: true } : x)); avisar(); };
export const chatReiniciar = () => { mensajes = []; borrador = null; vistos.clear(); avisar(); };
export const getBorrador = () => borrador;
export const setBorrador = (b: Borrador | null) => { borrador = b; };

/* avisos que llegan desde la tienda */
const vistos = new Set<string>();
export function avisoInteres(idProducto: string, nombre: string) {
  if (vistos.has(idProducto)) return;
  vistos.add(idProducto);
  chatAgregar(msgBot(`Un cliente agregó al carrito: ${nombre}.`));
}
export function avisoPedido(p: Pedido, agotados: string[]) {
  const donde = p.entrega.tipo === "envio" ? "Envío a domicilio" : "Recoge en tienda";
  const forma = p.metodo === "tarjeta" ? `tarjeta ···${p.tarjeta}` : p.metodo === "transferencia" ? "transferencia" : "pago al recibir";
  const resumen = `${p.id} · ${p.cliente} · ${qz(p.total)}\n${p.lineas.map((l) => `${l.cantidad} × ${l.nombre}`).join(", ")}\n${donde} · ${forma}`;
  if (p.estado === "pago-pendiente") chatAgregar(msgBot(`Pedido nuevo con transferencia por verificar.\n${resumen}`, [{ id: `do:pago:${p.id}`, t: "Confirmar pago" }, { id: `do:rechazar:${p.id}`, t: "Rechazar" }]));
  else chatAgregar(msgBot(`Pedido nuevo, ya pagado.\n${resumen}`, [{ id: `do:mover:${p.id}:preparando`, t: "Pasar a preparación" }]));
  agotados.forEach((n) => chatAgregar(msgBot(`${n} se agotó. En la tienda ya aparece como agotado.`, [{ id: `do:ocultar:${n}`, t: "Ocultar de la tienda" }])));
}
