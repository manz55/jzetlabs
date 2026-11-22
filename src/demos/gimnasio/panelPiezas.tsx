/*
 * Piezas que comparten las secciones del panel de Spartan Force: colores, tarjetas, botones con reacción,
 * el cuadro de estado (rojo, amarillo, verde), la barra de opciones y los datos que se calculan una vez.
 */
import type { ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { AMARILLO, AZUL, PLANES, ROJO, VERDE, faltan, fechaCorta, porId, qz, type Gym, type Socio } from "./datos";

export const NEGRO = "#0d0e0f";
export const GRIS = "#16181a";
export const BORDE = "#2e3236";
export const TINTA = "#efeee9";
export const CUERPO = "'Instrument Sans', system-ui, sans-serif";
export const TITULO = "'Big Shoulders Display', 'Instrument Sans', sans-serif";
export const MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace";
export const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const h1 = "gym-titulo text-[clamp(2.6rem,2rem+2vw,4rem)]";

export const ESTILOS_PANEL = `
.pg-btn{transition:transform .18s ease,box-shadow .18s ease,background-color .18s ease,color .18s ease,border-color .18s ease}
.pg-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 18px rgba(0,0,0,.4)}
.pg-btn:active:not(:disabled){transform:translateY(0) scale(.97);box-shadow:none}
.pg-btn.pg-lleno:hover:not(:disabled){background:#ffd54a !important}
.pg-btn.pg-borde:hover:not(:disabled){background:${TINTA} !important;color:${NEGRO} !important;border-color:${TINTA} !important}
.pg-btn.pg-rojo:hover:not(:disabled){background:#ef3b52 !important}
.pg-fila{transition:background-color .15s ease}
.pg-fila:hover{background:rgba(255,255,255,.045)}
.pg-dia{transition:transform .18s ease,border-color .18s ease,background-color .18s ease}
.pg-dia:hover{transform:translateY(-2px);border-color:${AMARILLO}}
@media (prefers-reduced-motion: reduce){.pg-btn,.pg-dia{transition:none}.pg-btn:hover:not(:disabled),.pg-dia:hover{transform:none}}
`;

export function Tarjeta({ titulo, nota, derecha, className = "", children }: { titulo?: string; nota?: string; derecha?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={`min-w-0 rounded-xl border bg-[#202326] p-5 sm:p-6 ${className}`} style={{ borderColor: BORDE }}>
      {(titulo || derecha) && <div className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2"><div>{titulo && <h2 className="text-[1.3rem] font-bold leading-tight">{titulo}</h2>}{nota && <p className="mt-0.5 text-[0.98rem] opacity-65">{nota}</p>}</div>{derecha}</div>}
      {children}
    </section>
  );
}

export function Btn({ children, alTocar, tipo = "lleno", deshabilitado = false, className = "" }: { children: ReactNode; alTocar: () => void; tipo?: "lleno" | "borde" | "rojo"; deshabilitado?: boolean; className?: string }) {
  const s = tipo === "lleno" ? { background: AMARILLO, color: NEGRO } : tipo === "rojo" ? { background: ROJO, color: "#fff" } : { background: "transparent", color: TINTA, border: `1.5px solid ${TINTA}` };
  return <button type="button" disabled={deshabilitado} onClick={alTocar} className={`pg-btn pg-${tipo} inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-lg px-4 py-2 text-[1rem] font-semibold disabled:opacity-40 ${className}`} style={s}>{children}</button>;
}

export function Barra({ valor, color, alto = 10 }: { valor: number; color: string; alto?: number }) {
  return <span className="block overflow-hidden rounded-full" style={{ background: BORDE, height: alto }}><span className="block h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, valor))}%`, background: color }} /></span>;
}

export function Paso({ valor, alCambiar, min, max, paso, formato }: { valor: number; alCambiar: (n: number) => void; min: number; max: number; paso: number; formato?: (n: number) => string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <button type="button" aria-label="Menos" onClick={() => alCambiar(Math.max(min, valor - paso))} className="pg-btn grid h-11 w-11 place-items-center rounded-lg border" style={{ borderColor: BORDE }}><Minus size={18} /></button>
      <b className="min-w-[5rem] text-center text-[1.5rem] tabular-nums">{formato ? formato(valor) : valor}</b>
      <button type="button" aria-label="Más" onClick={() => alCambiar(Math.min(max, valor + paso))} className="pg-btn grid h-11 w-11 place-items-center rounded-lg border" style={{ borderColor: BORDE }}><Plus size={18} /></button>
    </span>
  );
}

/* barra de opciones: una sola pieza con las opciones pegadas, la elegida en amarillo */
export function Opciones<T extends string>({ valor, alCambiar, opciones, etiqueta }: { valor: T; alCambiar: (v: T) => void; opciones: readonly (readonly [T, string, number?])[]; etiqueta: string }) {
  return (
    <div role="group" aria-label={etiqueta} className="inline-flex min-w-0 max-w-full overflow-x-auto rounded-lg border [scrollbar-width:none]" style={{ borderColor: BORDE, background: "#202326" }}>
      {opciones.map(([id, t, n], i) => (
        <button key={id} type="button" aria-pressed={valor === id} onClick={() => alCambiar(id)} className="inline-flex min-h-[3rem] shrink-0 items-center gap-2 whitespace-nowrap px-5 text-[1.02rem] font-semibold transition-colors hover:bg-white/10" style={{ borderLeft: i ? `1px solid ${BORDE}` : undefined, ...(valor === id ? { background: AMARILLO, color: NEGRO } : {}) }}>
          {t}{n !== undefined && <span className="rounded px-1.5 text-[0.85rem] tabular-nums" style={{ background: valor === id ? "rgba(0,0,0,.15)" : BORDE }}>{n}</span>}
        </button>
      ))}
    </div>
  );
}

/* cuadro de estado: rojo si debe, amarillo si vence pronto, verde si está al día */
export function Cuadro({ socio, avisoDias }: { socio: Socio; avisoDias: number }) {
  const f = faltan(socio.vence), p = porId(PLANES, socio.plan);
  const [bg, tx, t] = f < 0 ? [ROJO, "#fff", `Debe ${qz(p.precio)}`] : f <= avisoDias ? [AMARILLO, NEGRO, f === 0 ? "Vence hoy" : `Vence el ${fechaCorta(socio.vence)}`] : [VERDE, "#fff", "Al día"];
  return <span className="inline-block whitespace-nowrap rounded-[4px] px-3 py-1.5 text-[0.95rem] font-bold" style={{ background: bg, color: tx }}>{t}</span>;
}
export function CuadroSimple({ tono, children }: { tono: "bien" | "aviso" | "mal"; children: ReactNode }) {
  const [bg, tx] = tono === "bien" ? [VERDE, "#fff"] : tono === "aviso" ? [AMARILLO, NEGRO] : [ROJO, "#fff"];
  return <span className="inline-block whitespace-nowrap rounded-[4px] px-3 py-1.5 text-[0.95rem] font-bold" style={{ background: bg, color: tx }}>{children}</span>;
}

export const norm = (m?: string) => (m ?? "recepción").replace("recepcion", "recepción");
export const METODO: Record<string, { t: string; c: string }> = { tarjeta: { t: "Tarjeta", c: "#5b7cff" }, transferencia: { t: "Transferencia", c: AZUL }, "recepción": { t: "Recepción", c: AMARILLO } };

export type Aj = { meta: number; avisoDias: number; riesgoDias: number };

/* lo que se calcula una sola vez para todas las secciones */
export function derivar(gym: Gym, aj: Aj) {
  const hoy = new Date().getDate();
  const estado = (s: Socio) => { const f = faltan(s.vence); return f < 0 ? "vencidos" : f <= aj.avisoDias ? "por-vencer" : "al-dia"; };
  const diasSin = (s: Socio) => (s.visitas.length ? hoy - Math.max(...s.visitas) : 30);
  const vencidas = gym.socios.filter((s) => estado(s) === "vencidos").sort((a, b) => faltan(a.vence) - faltan(b.vence));
  const porVencer = gym.socios.filter((s) => estado(s) === "por-vencer").sort((a, b) => faltan(a.vence) - faltan(b.vence));
  const riesgo = gym.socios.filter((s) => estado(s) !== "vencidos" && diasSin(s) >= aj.riesgoDias && !s.nuevo);
  const confirmados = gym.pagos.filter((x) => !x.pendiente);
  const pendientes = gym.pagos.map((x, i) => ({ x, i })).filter(({ x }) => x.pendiente);
  return {
    hoy, estado, diasSin, vencidas, porVencer, riesgo, confirmados, pendientes,
    activos: gym.socios.length - vencidas.length,
    porCobrar: vencidas.reduce((t, s) => t + porId(PLANES, s.plan).precio, 0),
    cobradoHoy: confirmados.filter((x) => x.dia === hoy).reduce((t, x) => t + x.monto, 0),
    cobradoMes: confirmados.reduce((t, x) => t + x.monto, 0),
    porConfirmar: pendientes.reduce((t, { x }) => t + x.monto, 0),
    nombre: (n: number) => gym.socios.find((s) => s.num === n)?.nombre ?? "Pase de día",
    avisadoHoy: (n: number) => gym.avisos.some((a) => a.num === n && a.dia === hoy),
  };
}
export type Datos = ReturnType<typeof derivar>;
export type Sec = "resumen" | "acceso" | "socios" | "clases" | "pagos" | "ajustes";
