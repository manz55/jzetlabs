/*
 * El cerebro del bot, compartido por la tienda, el panel y el chat: la conversación, el registro de lo que pasa,
 * las reglas que el dueño enciende o apaga, quién está autorizado y qué piden los clientes.
 * Cuando un cliente entra, busca, agrega al carrito, compra, pide una reparación o una devolución en la tienda,
 * el bot le escribe al dueño aunque el panel esté en otra sección; por eso todo vive aquí y no dentro del chat.
 * Funciona con reglas, estados y permisos; no improvisa respuestas.
 */
import { useSyncExternalStore } from "react";
import { qz } from "../comun";
import type { Pedido } from "./datos";

export type Boton = { id: string; t: string };
export type Msg = { de: "bot" | "yo"; texto: string; botones?: Boton[]; hora: string; usada?: boolean; fotos?: string[] };
export type Borrador = { fotos: string[]; nombre?: string; precio?: number; unidades?: number; condicion: "Nuevo" | "Seminuevo"; capacidad?: string; sucursal: string };
export type Area = "General" | "Ventas" | "Tienda" | "Taller" | "Postventa";
export type Origen = "Bot automático" | "Dueño por WhatsApp" | "Equipo por WhatsApp" | "Cliente por WhatsApp" | "Panel" | "Cliente en la tienda";
export type Registro = { id: number; f: string; area: Area; origen: Origen; texto: string };
/* de qué sección se abrió el chat: el bot arranca hablando de eso */
export type Foco = "general" | "pedidos" | "pagos" | "tienda" | "taller" | "tecnicos" | "devoluciones";
export type Rol = "DUENO" | "ENCARGADO" | "TECNICO" | "CLIENTE";
export type Persona = { id: number; nombre: string; rol: Rol; etiqueta: string; numero: string; permisos: string; activo: boolean };

export const horaAhora = () => new Date().toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false });
export const msgBot = (texto: string, botones?: Boton[]): Msg => ({ de: "bot", texto, botones: botones?.slice(0, 3), hora: horaAhora() });

/* reglas que el dueño enciende o apaga; cada una tiene su sección */
export type ReglaId = "avisarPedido" | "autoPreparar" | "avisarClienteEstado" | "recordarSinAtender" | "avisarCarrito" | "ocultarAgotados" | "avisarStockBajo" | "resumenNocturno" | "avisarReparacionNueva" | "avisarReparacionLista" | "avisarDevolucion";
export const REGLAS: { id: ReglaId; area: Area; t: string; d: string }[] = [
  { id: "avisarPedido", area: "Ventas", t: "Avisar de cada pedido y de cada transferencia", d: "Llega al WhatsApp del dueño con el cliente, el monto y los botones para actuar." },
  { id: "autoPreparar", area: "Ventas", t: "Pasar a preparación los pedidos ya pagados", d: "El bot los mueve solo; el dueño marca después la entrega al transporte." },
  { id: "avisarClienteEstado", area: "Ventas", t: "Avisar al cliente en cada cambio de estado", d: "El cliente recibe el aviso por WhatsApp y lo ve en su rastreo." },
  { id: "recordarSinAtender", area: "Ventas", t: "Recordar pedidos sin atender por más de 2 horas", d: "Un mensaje al dueño con el listado y los botones." },
  { id: "avisarCarrito", area: "Tienda", t: "Avisar cuando un cliente agrega un producto al carrito", d: "Permite saber qué se está mirando antes de que compren." },
  { id: "ocultarAgotados", area: "Tienda", t: "Ocultar de la tienda lo que se agota", d: "El producto deja de mostrarse y el dueño recibe el aviso." },
  { id: "avisarStockBajo", area: "Tienda", t: "Avisar cuando un producto baja a 3 unidades", d: "Con el nombre y las existencias que quedan." },
  { id: "avisarReparacionNueva", area: "Taller", t: "Avisar de cada reparación nueva", d: "Con el cliente, el equipo, la falla y el precio." },
  { id: "avisarReparacionLista", area: "Taller", t: "Avisar al cliente cuando su equipo está listo", d: "Recibe el aviso de que puede recogerlo, con la sucursal y el horario." },
  { id: "avisarDevolucion", area: "Postventa", t: "Avisar de cada devolución nueva", d: "Con el motivo, para revisarla en el panel o responder por WhatsApp." },
  { id: "resumenNocturno", area: "General", t: "Enviar el resumen del día a las 8 pm", d: "Ventas, pedidos pendientes y existencias críticas." },
];
type Reglas = Record<ReglaId, boolean>;
const REGLAS_INICIO = Object.fromEntries(REGLAS.map((r) => [r.id, true])) as Reglas;
const CLAVE_REGLAS = "orbita-bot-reglas-v1";
let reglas: Reglas = REGLAS_INICIO;
try { const t = localStorage.getItem(CLAVE_REGLAS); if (t) reglas = { ...REGLAS_INICIO, ...JSON.parse(t) }; } catch { /* nada */ }

/* ganchos que pone la demo para que el bot pueda cambiar la tienda desde cualquier pantalla */
export const ganchos: { preparar?: (p: Pedido) => void; ocultar?: (nombre: string) => void } = {};

/* quién puede escribirle al bot */
const AUTORIZADOS_INICIO: Persona[] = [
  { id: 1, nombre: "Marco Aguilar", rol: "DUENO", etiqueta: "Dueño", numero: "+502 5555 0100", permisos: "Todo: ventas, stock, precios, reparaciones y devoluciones", activo: true },
  { id: 2, nombre: "Sandra López", rol: "ENCARGADO", etiqueta: "Encargada de Zona 10", numero: "+502 5555 0111", permisos: "Pedidos, existencias y productos (sin precios ni ventas)", activo: true },
  { id: 3, nombre: "Luis Pérez", rol: "ENCARGADO", etiqueta: "Encargado de Mixco", numero: "+502 5555 0122", permisos: "Pedidos, existencias y productos (sin precios ni ventas)", activo: true },
  { id: 4, nombre: "Byron Gómez", rol: "TECNICO", etiqueta: "Técnico", numero: "+502 5555 0101", permisos: "Solo el taller: estado de las reparaciones", activo: true },
];
export const CLIENTE: Persona = { id: 0, nombre: "Cliente", rol: "CLIENTE", etiqueta: "Cliente sin autorizar", numero: "+502 5555 0188", permisos: "Rastreo de su pedido, garantía y asesor", activo: true };

/* lo que más piden los clientes en la tienda: búsquedas y carritos de esta semana */
const DEMANDA_INICIO: Record<string, number> = { fundas: 14, cargador: 9, cable: 7, bateria: 5, audifonos: 4, ipair: 6 };

let mensajes: Msg[] = [];
let borrador: Borrador | null = null;
let visible = false;
let noLeidos = 0;
let dockAbierto = false;
let numero = 1;
let autorizados: Persona[] = AUTORIZADOS_INICIO;
let personaId = 1;
let demanda: Record<string, number> = { ...DEMANDA_INICIO };
let enLinea = 2;
let focoPanel: Foco = "general";
let ultimoResumen = "";
let lenResumen = -1;
let peticion = 0;
/* la actividad de ejemplo siempre cae en el día de hoy */
const hace = (min: number) => { const d = new Date(); const hoyMin = d.getHours() * 60 + d.getMinutes(); const k = Math.min(1, Math.max(0, hoyMin - 2) / 320); return new Date(Date.now() - min * k * 60000).toISOString(); };
const semilla = (): Registro[] => [
  { id: numero++, f: hace(310), area: "Ventas", origen: "Bot automático", texto: "Aviso al dueño: pedido OR-1038 pagado con tarjeta ···4242" },
  { id: numero++, f: hace(300), area: "Ventas", origen: "Dueño por WhatsApp", texto: "Pasó OR-1038 a preparación" },
  { id: numero++, f: hace(240), area: "Tienda", origen: "Cliente en la tienda", texto: "Producto al carrito: Galaxy S26" },
  { id: numero++, f: hace(205), area: "Ventas", origen: "Dueño por WhatsApp", texto: "Entregó OR-1038 al transporte (guía GT-482731)" },
  { id: numero++, f: hace(150), area: "Taller", origen: "Bot automático", texto: "Aviso al cliente: reparación RP-511 lista para recoger" },
  { id: numero++, f: hace(95), area: "Tienda", origen: "Dueño por WhatsApp", texto: "Consultó stock de Galaxy S24 Ultra" },
  { id: numero++, f: hace(60), area: "Postventa", origen: "Bot automático", texto: "Aviso al dueño: devolución DV-209 por revisar" },
  { id: numero++, f: hace(35), area: "Ventas", origen: "Bot automático", texto: "Aviso al dueño: pago por verificar en OR-1041" },
];
let registro: Registro[] = semilla();

const oyentes = new Set<() => void>();
const avisar = () => oyentes.forEach((f) => f());
const suscribir = (f: () => void) => { oyentes.add(f); return () => { oyentes.delete(f); }; };

export const useChat = () => useSyncExternalStore(suscribir, () => mensajes);
export const useRegistro = () => useSyncExternalStore(suscribir, () => registro);
export const useNoLeidos = () => useSyncExternalStore(suscribir, () => noLeidos);
export const useDock = () => useSyncExternalStore(suscribir, () => dockAbierto);
export const useReglas = () => useSyncExternalStore(suscribir, () => reglas);
export const useAutorizados = () => useSyncExternalStore(suscribir, () => autorizados);
export const usePersonaId = () => useSyncExternalStore(suscribir, () => personaId);
export const useDemanda = () => useSyncExternalStore(suscribir, () => demanda);
export const useEnLinea = () => useSyncExternalStore(suscribir, () => enLinea);
export const getReglas = () => reglas;
export const getDemanda = () => demanda;
export const getEnLinea = () => enLinea;
export const personaActual = (): Persona => autorizados.find((p) => p.id === personaId) ?? CLIENTE;
export const setPersona = (id: number) => { personaId = id; avisar(); };
export const ponerAutorizado = (id: number, activo: boolean) => { autorizados = autorizados.map((p) => (p.id === id ? { ...p, activo } : p)); registrar("General", "Panel", `${activo ? "Autorizó" : "Quitó la autorización a"} ${autorizados.find((p) => p.id === id)?.nombre}`); avisar(); };
export const ponerRegla = (id: ReglaId, valor: boolean) => {
  reglas = { ...reglas, [id]: valor };
  try { localStorage.setItem(CLAVE_REGLAS, JSON.stringify(reglas)); } catch { /* nada */ }
  registrar("General", "Panel", `${valor ? "Activó" : "Desactivó"} la regla: ${REGLAS.find((r) => r.id === id)?.t.toLowerCase()}`);
  avisar();
};
export const setDock = (v: boolean) => { dockAbierto = v; if (v) noLeidos = 0; avisar(); };
export const setChatVisible = (v: boolean) => { visible = v; if (v) noLeidos = 0; avisar(); };
export const setFocoPanel = (f: Foco) => { focoPanel = f; };
export const getFocoPanel = () => focoPanel;
/* el resumen de una sección: no se repite si es el mismo y nadie escribió después */
export function publicarResumen(clave: string, ms: Msg[]) {
  if (clave === ultimoResumen && mensajes.length === lenResumen) return;
  ultimoResumen = clave;
  chatAgregar(...ms);
  lenResumen = mensajes.length;
}
/* "Abrir chat" desde cualquier sección: abre el chat y pide el resumen de esa sección */
export const pedirResumen = () => { dockAbierto = true; noLeidos = 0; peticion += 1; avisar(); };
export const usePeticion = () => useSyncExternalStore(suscribir, () => peticion);

export const hayChat = () => mensajes.length > 0;
export const chatAgregar = (...m: Msg[]) => {
  mensajes = [...mensajes, ...m];
  if (!visible) noLeidos += m.filter((x) => x.de === "bot").length;
  avisar();
};
export const chatMarcarUsada = (i: number) => { mensajes = mensajes.map((x, k) => (k === i ? { ...x, usada: true } : x)); avisar(); };
export const registrar = (area: Area, origen: Origen, texto: string) => { registro = [{ id: numero++, f: new Date().toISOString(), area, origen, texto }, ...registro].slice(0, 80); avisar(); };
export const chatReiniciar = () => { mensajes = []; borrador = null; noLeidos = 0; vistos.clear(); numero = 1; registro = semilla(); demanda = { ...DEMANDA_INICIO }; ultimoResumen = ""; lenResumen = -1; personaId = 1; avisar(); };
export const getBorrador = () => borrador;
export const setBorrador = (b: Borrador | null) => { borrador = b; };

/* clientes en la tienda ahora mismo */
export function entroCliente() { enLinea += 1; registrar("Tienda", "Cliente en la tienda", "Un cliente entró a la tienda"); }
export function salioCliente() { enLinea = Math.max(0, enLinea - 1); avisar(); }
export function sumarDemanda(id: string, n = 1) { demanda = { ...demanda, [id]: (demanda[id] ?? 0) + n }; avisar(); }

/* avisos que llegan desde la tienda; el tono es corto y con datos */
const vistos = new Set<string>();
export function avisoInteres(idProducto: string, nombre: string) {
  sumarDemanda(idProducto);
  if (vistos.has(idProducto)) return;
  vistos.add(idProducto);
  registrar("Tienda", "Cliente en la tienda", `Producto al carrito: ${nombre}`);
  if (reglas.avisarCarrito) { chatAgregar(msgBot(`👀 Alguien agregó ${nombre} al carrito.`)); registrar("Tienda", "Bot automático", `Aviso al dueño: ${nombre} está en un carrito`); }
}
export function avisoPedido(p: Pedido, agotados: string[], bajos: { nombre: string; quedan: number }[] = []) {
  registrar("Ventas", "Cliente en la tienda", `Pedido ${p.id} de ${p.cliente} por ${qz(p.total)}`);
  const donde = p.entrega.tipo === "envio" ? "Envío a domicilio" : "Recoge en tienda";
  const forma = p.metodo === "tarjeta" ? `tarjeta ···${p.tarjeta}` : p.metodo === "transferencia" ? "transferencia" : "pago al recibir";
  const resumen = `${p.id} · ${p.cliente} · ${qz(p.total)}\n${p.lineas.map((l) => `${l.cantidad} × ${l.nombre}`).join(", ")}\n${donde} · ${forma}`;
  if (reglas.avisarPedido) {
    if (p.estado === "pago-pendiente") {
      chatAgregar(msgBot(`🧾 Pago por verificar\n${resumen}`, [{ id: `do:pago:${p.id}`, t: "Confirmar pago" }, { id: `do:rechazar:${p.id}`, t: "Rechazar" }]));
      registrar("Ventas", "Bot automático", `Aviso al dueño: pago por verificar en ${p.id}`);
    } else if (reglas.autoPreparar && ganchos.preparar && p.estado === "pagado") {
      ganchos.preparar(p);
      chatAgregar(msgBot(`✅ Pedido pagado\n${resumen}\n📦 Pasó a preparación.`, [{ id: `do:mover:${p.id}:en-camino`, t: "Entregar al transporte" }]));
      registrar("Ventas", "Bot automático", `Aviso al dueño: ${p.id} pagado; pasó a preparación`);
    } else {
      chatAgregar(msgBot(`✅ Pedido pagado\n${resumen}`, [{ id: `do:mover:${p.id}:preparando`, t: "Pasar a preparación" }]));
      registrar("Ventas", "Bot automático", `Aviso al dueño: ${p.id} pagado`);
    }
  } else if (reglas.autoPreparar && ganchos.preparar && p.estado === "pagado") { ganchos.preparar(p); registrar("Ventas", "Bot automático", `${p.id} pasó a preparación`); }
  agotados.forEach((n) => {
    if (reglas.ocultarAgotados && ganchos.ocultar) { ganchos.ocultar(n); chatAgregar(msgBot(`⚠️ ${n} agotado\n🔒 Ocultado de la tienda.`, [{ id: `do:stockmas:${n}`, t: "Agregar 5 uds" }])); registrar("Tienda", "Bot automático", `${n} se agotó y se ocultó de la tienda`); }
    else chatAgregar(msgBot(`⚠️ ${n} agotado`, [{ id: `do:ocultar:${n}`, t: "Ocultar de la tienda" }, { id: `do:stockmas:${n}`, t: "Agregar 5 uds" }]));
  });
  if (reglas.avisarStockBajo) bajos.forEach((b) => { chatAgregar(msgBot(`⚠️ Stock bajo: ${b.nombre} (quedan ${b.quedan})`, [{ id: `do:stockmas:${b.nombre}`, t: "Agregar 5 uds" }])); registrar("Tienda", "Bot automático", `Aviso al dueño: stock bajo de ${b.nombre} (${b.quedan})`); });
}
export function avisoDevolucion(d: { id: string; pedido: string; motivo: string }) {
  registrar("Postventa", "Cliente en la tienda", `Devolución ${d.id} del pedido ${d.pedido}: ${d.motivo}`);
  if (!reglas.avisarDevolucion) return;
  chatAgregar(msgBot(`↩️ Devolución nueva\n${d.id} · pedido ${d.pedido}\nMotivo: ${d.motivo}`, [{ id: `do:dev:${d.id}:ok`, t: "Aprobar" }, { id: `do:dev:${d.id}:no`, t: "No procede" }]));
  registrar("Postventa", "Bot automático", `Aviso al dueño: devolución ${d.id} por revisar`);
}
export function avisoReparacion(r: { id: string; cliente: string; modelo: string; falla: string; precio: number }) {
  registrar("Taller", "Cliente en la tienda", `Reparación ${r.id}: ${r.modelo}, ${r.falla}`);
  if (!reglas.avisarReparacionNueva) return;
  chatAgregar(msgBot(`🔧 Reparación nueva\n${r.id} · ${r.cliente}\n${r.modelo} · ${r.falla} · ${qz(r.precio)}`, [{ id: `do:rep:${r.id}:diagnostico`, t: "Pasar a diagnóstico" }]));
  registrar("Taller", "Bot automático", `Aviso al dueño: reparación nueva ${r.id}`);
}
