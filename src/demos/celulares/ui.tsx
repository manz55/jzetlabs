/*
 * Piezas comunes del panel del dueño: colores, tablas, botones, estados y franjas de cifras.
 * Las usan el panel y el centro del bot.
 */
import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { PRIMARIO, ESTADOS_PEDIDO, TEXTO_REPARACION, TINTA, type EstadoPedido, type Reparacion } from "./datos";

export const BORDE = "#dde0e6";
export const FONDO = "#f3f4f6";
export const MUTED = "#5b6270";
export const ROJO = "#b42318";

/* piezas sobrias: nada de cajitas redondeadas, líneas finas y tablas */
export const TH = "bg-[#f7f8fa] px-3 py-2 text-left text-[0.72rem] font-bold uppercase tracking-[0.06em] text-[#5b6270]";
export const TD = "px-3 py-2.5 align-middle";
export const BTN = "inline-flex min-h-[2.4rem] items-center justify-center gap-1.5 whitespace-nowrap rounded-[5px] px-3 text-[0.86rem] font-semibold transition hover:brightness-95 active:scale-[0.97]";
export const principal = { background: PRIMARIO, color: "#fff" };
export const borde = { border: `1px solid ${BORDE}`, background: "#fff", color: TINTA };

export function Panel({ titulo, nota, derecha, className = "", flush = false, children }: { titulo?: string; nota?: string; derecha?: ReactNode; className?: string; flush?: boolean; children: ReactNode }) {
  return (
    <section className={`min-w-0 rounded-md border bg-white ${className}`} style={{ borderColor: BORDE }}>
      {(titulo || derecha) && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3" style={{ borderColor: BORDE }}>
          <div className="flex flex-wrap items-baseline gap-x-3"><h2 className="text-[1rem] font-bold">{titulo}</h2>{nota && <p className="text-[0.85rem]" style={{ color: MUTED }}>{nota}</p>}</div>
          {derecha}
        </header>
      )}
      <div className={flush ? "overflow-x-auto" : "p-4"}>{children}</div>
    </section>
  );
}

export function Estado({ texto, color, fondo }: { texto: string; color: string; fondo: string }) {
  return <span className="inline-block whitespace-nowrap rounded-[3px] px-2 py-0.5 text-[0.78rem] font-bold" style={{ background: fondo, color }}>{texto}</span>;
}
export const textoEstadoPanel = (e: EstadoPedido) => (e === "pago-pendiente" ? "Pago por verificar" : ESTADOS_PEDIDO[e].texto);
export const ACCION_REP: Record<Reparacion["estado"], string> = { recibido: "Pasar a diagnóstico", diagnostico: "Iniciar reparación", reparando: "Marcar lista", listo: "Marcar entregada", entregado: "" };
export const EstadoPed = ({ e }: { e: EstadoPedido }) => <Estado texto={textoEstadoPanel(e)} color={ESTADOS_PEDIDO[e].color} fondo={ESTADOS_PEDIDO[e].fondo} />;
export const ESTADO_REP: Record<Reparacion["estado"], [string, string]> = { recibido: ["#4b5563", "#eceef1"], diagnostico: ["#8a4b00", "#fff1d6"], reparando: ["#5a3fc0", "#ece6ff"], listo: ["#1f7a3a", "#e1f5e6"], entregado: ["#4b5563", "#eceef1"] };
export const EstadoRep = ({ e }: { e: Reparacion["estado"] }) => <Estado texto={TEXTO_REPARACION[e]} color={ESTADO_REP[e][0]} fondo={ESTADO_REP[e][1]} />;

/* barra de filtros pegada: una sola pieza */
export function Filtros<T extends string>({ valor, alCambiar, opciones, etiqueta }: { valor: T; alCambiar: (v: T) => void; opciones: readonly (readonly [T, string, number])[]; etiqueta: string }) {
  return (
    <div role="group" aria-label={etiqueta} className="inline-flex max-w-full overflow-x-auto rounded-[5px] border bg-white [scrollbar-width:none]" style={{ borderColor: BORDE }}>
      {opciones.map(([id, t, n], i) => (
        <button key={id} type="button" aria-pressed={valor === id} onClick={() => alCambiar(id)} className="inline-flex min-h-[2.4rem] shrink-0 items-center gap-2 whitespace-nowrap px-3.5 text-[0.86rem] font-semibold transition hover:bg-[#f3f4f6]" style={{ borderLeft: i ? `1px solid ${BORDE}` : undefined, ...(valor === id ? { background: TINTA, color: "#fff" } : {}) }}>{t}<span className="tabular-nums opacity-70">{n}</span></button>
      ))}
    </div>
  );
}
export const Buscar = ({ valor, alCambiar, texto }: { valor: string; alCambiar: (v: string) => void; texto: string }) => (
  <label className="relative block w-full sm:w-72"><span className="sr-only">{texto}</span><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-45" /><input value={valor} onChange={(e) => alCambiar(e.target.value)} placeholder={texto} className="min-h-[2.4rem] w-full rounded-[5px] border bg-white pl-9 pr-3 text-[0.9rem]" style={{ borderColor: BORDE }} /></label>
);

/* franja de cifras: una sola fila con líneas divisorias */
export function Cifras({ items }: { items: { t: string; v: string | number; n?: string; alerta?: boolean }[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-md border" style={{ borderColor: BORDE, background: BORDE, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 9.5rem), 1fr))" }}>
      {items.map((x) => (
        <div key={x.t} className="bg-white px-3 py-3 sm:px-4 sm:py-3.5">
          <p className="text-[0.8rem] font-semibold" style={{ color: MUTED }}>{x.t}</p>
          <p className="mt-0.5 text-[1.4rem] font-extrabold leading-tight tabular-nums sm:text-[1.65rem]" style={{ color: x.alerta ? ROJO : TINTA }}>{x.v}</p>
          {x.n && <p className="text-[0.78rem] leading-snug" style={{ color: MUTED }}>{x.n}</p>}
        </div>
      ))}
    </div>
  );
}

export function Titulo({ children, sub, derecha }: { children: string; sub?: string; derecha?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-[1.6rem] font-extrabold leading-tight tracking-[-0.01em]">{children}</h1>{sub && <p className="text-[0.95rem]" style={{ color: MUTED }}>{sub}</p>}</div>
      {derecha}
    </div>
  );
}

