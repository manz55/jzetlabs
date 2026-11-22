/*
 * El inicio del panel de la consultora: resúmenes cortos (4 cosas cada uno) y un botón para ver todo en su sección.
 * Lo que llega de su página (mensajes, pedidos, citas) cae aquí. La meta y el regalo por compras los ajusta ella.
 */
import { useState, type ReactNode } from "react";
import { Bell, CalendarDays, ChevronRight, Gift, MapPin, Minus, MessageCircle, Package, Pencil, Plus, ShoppingBag, Sparkles, UserPlus, Users, Wallet } from "lucide-react";
import { LINEA, MESES, TINTA, TIPOS_BANDEJA, VINO, HISTORIAL_EJ, qz, saldo, useBandeja, type Entrada, type Perfil, type Producto, type TipoBandeja } from "./datos";
import { cuandoTexto } from "./Conversacion";
import { InsigniaFase, type PedidoV } from "./Pedidos";
import type { Nivel } from "./Inventario";

const SERIF = '"Fraunces", Georgia, serif';
const ICONO: Record<TipoBandeja, typeof Bell> = { chat: MessageCircle, pedido: ShoppingBag, facial: Sparkles, reunion: Users, evento: CalendarDays, aviso: Bell, equipo: UserPlus };
export type Pestana = "inicio" | "mensajes" | "pedidos" | "inventario" | "clientas";

export const haceTexto = (iso: string) => {
  const m = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 6e4));
  if (m < 60) return `hace ${m} min`;
  if (m < 60 * 24) return `hace ${Math.round(m / 60)} h`;
  const d = Math.round(m / 1440);
  return `hace ${d} ${d === 1 ? "día" : "días"}`;
};

function Tarjeta({ titulo, nota, derecha, className = "", pie, children }: { titulo: string; nota?: string; derecha?: ReactNode; className?: string; pie?: ReactNode; children: ReactNode }) {
  return (
    <section className={`flex min-w-0 flex-col rounded-2xl bg-white p-5 sm:p-6 ${className}`} style={{ border: `1.5px solid ${LINEA}` }}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h2 className="text-[clamp(1.4rem,1.2rem+0.6vw,1.75rem)] font-medium leading-tight" style={{ fontFamily: SERIF }}>{titulo}</h2>
          {nota && <p className="mt-0.5 text-[0.98rem] opacity-65">{nota}</p>}
        </div>
        {derecha}
      </div>
      <div className="mt-4 flex-1">{children}</div>
      {pie && <div className="mt-4">{pie}</div>}
    </section>
  );
}

const vacio = (t: string) => <p className="rounded-xl px-4 py-5 text-center text-[1.05rem] opacity-60" style={{ background: "#fdf3ed" }}>{t}</p>;
const boton = "inline-flex min-h-[2.75rem] items-center justify-center gap-1.5 rounded-full px-4 text-[1rem] font-semibold transition active:scale-[0.97]";
const verMas = (t: string, alTocar: () => void) => (
  <button type="button" onClick={alTocar} className="pf-btn inline-flex min-h-[3rem] w-full items-center justify-center gap-1.5 rounded-full border-2 px-5 text-[1.05rem] font-semibold" style={{ borderColor: TINTA }}>{t} <ChevronRight size={18} /></button>
);

export function Paso({ valor, alCambiar, etiqueta, min = 1 }: { valor: number; alCambiar: (n: number) => void; etiqueta: string; min?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <button type="button" aria-label={`Menos ${etiqueta}`} onClick={() => alCambiar(Math.max(min, valor - 1))} className="grid h-9 w-9 place-items-center rounded-full border-2 bg-white" style={{ borderColor: "rgba(42,22,51,.25)" }}><Minus size={15} /></button>
      <b className="w-6 text-center text-[1.15rem] tabular-nums">{valor}</b>
      <button type="button" aria-label={`Más ${etiqueta}`} onClick={() => alCambiar(valor + 1)} className="grid h-9 w-9 place-items-center rounded-full border-2 bg-white" style={{ borderColor: "rgba(42,22,51,.25)" }}><Plus size={15} /></button>
    </span>
  );
}

export function Inicio({ perfiles, pedidos, filas, meta, ponerMeta, regaloCada, ponerRegalo, vendido, ganancia, vendidos, cumples, diasCumple, seguimiento, irA, abrir, avisar, abrirChat, cambiarFase, porCobrar }: {
  perfiles: Perfil[]; pedidos: PedidoV[]; filas: { pr: Producto; disp: number; dias: number; nivel: Nivel }[]; meta: number; ponerMeta: (n: number) => void; regaloCada: number; ponerRegalo: (n: number) => void;
  vendido: number; ganancia: number; vendidos: { pr: Producto; n: number }[]; cumples: Perfil[]; diasCumple: (p: Perfil) => number; seguimiento: { x: Perfil; e: { cuando: string; que: string } }[];
  irA: (p: Pestana) => void; abrir: (id: string) => void; avisar: (t: string) => void; abrirChat: (id: string) => void; cambiarFase: (p: PedidoV, f: "entregado") => void; porCobrar: Perfil[];
}) {
  const { lista, cambiar } = useBandeja();
  const [editaMeta, setEditaMeta] = useState(false);
  const [metaTexto, setMetaTexto] = useState(String(meta));
  const sinLeer = lista.filter((e) => !e.leido);
  const citas = lista.filter((e) => ["facial", "reunion", "evento"].includes(e.tipo) && !e.hecho).sort((a, b) => (a.cuando ?? "9").localeCompare(b.cuando ?? "9"));
  const pendientes = pedidos.filter((p) => p.fase !== "entregado");
  const orden = [...pedidos].sort((a, b) => Number(a.fase === "entregado") - Number(b.fase === "entregado") || b.fecha.localeCompare(a.fecha));
  const porGanar = pendientes.reduce((t, p) => t + p.ganancia, 0);
  const recurrentes = perfiles.filter((x) => HISTORIAL_EJ[x.id]).sort((a, b) => HISTORIAL_EJ[b.id].compras - HISTORIAL_EJ[a.id].compras);
  const alertas = filas.filter((f) => f.nivel !== "bien").sort((a, b) => a.dias - b.dias);
  const hoy = new Date();
  const maxVend = Math.max(1, ...vendidos.map((v) => v.n));
  const guardarMeta = () => { const n = Math.round(Number(metaTexto.replace(/[^\d]/g, ""))); if (n > 0) ponerMeta(n); setEditaMeta(false); };

  const kpi = (I: typeof Bell, valor: string, titulo: string, nota: string, alerta: boolean, alTocar: () => void) => (
    <button type="button" onClick={alTocar} className="pf-card flex items-center gap-4 rounded-2xl bg-white p-5 text-left" style={{ border: `1.5px solid ${alerta ? VINO : LINEA}` }}>
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-white" style={{ background: alerta ? VINO : TINTA }}><I size={26} /></span>
      <span className="min-w-0 leading-tight">
        <span className="block text-[clamp(1.9rem,1.5rem+1vw,2.6rem)] font-semibold leading-none" style={{ fontFamily: SERIF }}>{valor}</span>
        <b className="mt-1 block text-[1.1rem]">{titulo}</b>
        <span className="block text-[0.95rem] opacity-65">{nota}</span>
      </span>
    </button>
  );

  return (
    <div className="mt-6 grid gap-5">
      <section className="grid gap-5 rounded-2xl p-5 text-white sm:p-7 lg:grid-cols-[1.4fr_1fr]" style={{ background: VINO }}>
        <div>
          <p className="text-[1.05rem] opacity-80">Vendido en {MESES[hoy.getMonth()]}</p>
          <p className="mt-1 text-[clamp(2.6rem,2rem+2vw,4rem)] font-medium leading-none" style={{ fontFamily: SERIF }}>{qz(vendido)}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[1.1rem]">
            <span className="opacity-85">Tu meta del mes:</span>
            {editaMeta ? (
              <form onSubmit={(e) => { e.preventDefault(); guardarMeta(); }} className="flex items-center gap-2">
                <span className="text-[1.2rem] font-bold">Q</span>
                <input autoFocus aria-label="Meta del mes" inputMode="numeric" value={metaTexto} onChange={(e) => setMetaTexto(e.target.value)} className="min-h-[2.75rem] w-32 rounded-lg px-3 text-[1.15rem] font-semibold outline-none" style={{ color: TINTA }} />
                <button type="submit" className={`${boton} bg-white`} style={{ color: VINO }}>Guardar</button>
              </form>
            ) : (
              <>
                <b className="text-[1.5rem]" style={{ fontFamily: SERIF }}>{qz(meta)}</b>
                <button type="button" onClick={() => { setMetaTexto(String(meta)); setEditaMeta(true); }} className={`${boton} border-2 border-white/60 text-white`}><Pencil size={15} /> Cambiar</button>
              </>
            )}
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/25"><div className="h-full rounded-full bg-white" style={{ width: `${Math.min(100, (vendido / meta) * 100)}%` }} /></div>
          <p className="mt-2 text-[1.05rem] opacity-90">{vendido >= meta ? "¡Meta cumplida!" : `Te faltan ${qz(meta - vendido)} · llevas el ${Math.round((vendido / meta) * 100)}%`}</p>
        </div>
        <dl className="grid grid-cols-2 gap-3 self-center">
          <div className="rounded-xl bg-white/15 p-4"><dt className="text-[0.98rem] opacity-85">Te queda de ganancia</dt><dd className="mt-1 text-[1.9rem] font-semibold leading-none" style={{ fontFamily: SERIF }}>{qz(ganancia)}</dd></div>
          <div className="rounded-xl bg-white/15 p-4"><dt className="text-[0.98rem] opacity-85">Total por ganar</dt><dd className="mt-1 text-[1.9rem] font-semibold leading-none" style={{ fontFamily: SERIF }}>{qz(porGanar)}</dd></div>
        </dl>
      </section>

      <div className="pf-auto" style={{ ["--min" as string]: "14.5rem" }}>
        {kpi(MessageCircle, String(sinLeer.length), "Mensajes nuevos", "de tu página", sinLeer.length > 0, () => irA("mensajes"))}
        {kpi(Package, String(pendientes.length), "Pedidos por entregar", `ganas ${qz(porGanar)}`, pendientes.length > 0, () => irA("pedidos"))}
        {kpi(Wallet, qz(porCobrar.reduce((t, x) => t + saldo(x), 0)), "Por cobrar", `${porCobrar.length} ${porCobrar.length === 1 ? "pedido" : "pedidos"}`, porCobrar.length > 0, () => irA("pedidos"))}
        {kpi(CalendarDays, String(citas.length), "Clases y citas", "por atender", citas.length > 0, () => irA("mensajes"))}
        {kpi(ShoppingBag, String(alertas.length), "Por reponer", alertas.length === 1 ? "producto" : "productos", alertas.length > 0, () => irA("inventario"))}
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <Tarjeta className="lg:col-span-7" titulo="Resumen de mensajería" nota="Lo más reciente que llegó de tu página." pie={verMas(lista.length > 4 ? `Ver más mensajes (${lista.length - 4} más)` : "Ir a mensajería", () => irA("mensajes"))}>
          {lista.length === 0 ? vacio("No tienes mensajes.") : <ul className="grid gap-2.5">{lista.slice(0, 4).map((e) => <Fila key={e.id} e={e} abrirChat={abrirChat} />)}</ul>}
        </Tarjeta>

        <Tarjeta className="lg:col-span-5" titulo="Pedidos por entregar" nota={`Total por ganar: ${qz(porGanar)}`} pie={verMas(`Ver todos los pedidos (${pedidos.length})`, () => irA("pedidos"))}>
          {orden.length === 0 ? vacio("No tienes pedidos.") : (
            <ul className="grid gap-2.5">
              {orden.slice(0, 4).map((p) => (
                <li key={p.id} className="rounded-xl p-3.5" style={{ background: "#fdf3ed" }}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="min-w-0 leading-tight"><b className="block truncate text-[1.1rem]">{p.nombre}</b><span className="text-[0.92rem] opacity-65">{p.origen === "pagina" ? "Llegó de tu página" : "Clienta tuya"} · {qz(p.total)}</span></span>
                    <span className="shrink-0 text-right leading-tight"><span className="block text-[0.8rem] opacity-65">Ganas</span><b className="text-[1.3rem]" style={{ fontFamily: SERIF, color: "#1f5a37" }}>{qz(p.ganancia)}</b></span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <InsigniaFase fase={p.fase} />
                    {p.fase === "pendiente" && !p.mensajero && <button type="button" onClick={() => cambiarFase(p, "entregado")} className={`${boton} text-white`} style={{ background: TINTA }}>Marcar entregado</button>}
                    {p.fase !== "entregado" && p.mensajero && <button type="button" onClick={() => irA("pedidos")} className={`${boton} border-2`} style={{ borderColor: TINTA }}>Ver paso</button>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta className="lg:col-span-5" titulo="Resumen de citas y clases" nota="Lo que te pidieron desde tu página: cuándo y dónde." pie={verMas(`Ver todas (${citas.length})`, () => irA("mensajes"))}>
          {citas.length === 0 ? vacio("No tienes clases pendientes.") : (
            <ul className="grid gap-2.5">
              {citas.slice(0, 4).map((e) => {
                const d = e.cuando ? new Date(e.cuando) : null;
                const I = ICONO[e.tipo];
                return (
                  <li key={e.id} className="flex gap-4 rounded-xl p-3.5" style={{ background: "#fdf3ed" }}>
                    <span className="grid w-[4.2rem] shrink-0 place-items-center self-start rounded-xl bg-white py-2 text-center leading-none" style={{ border: `1.5px solid ${LINEA}` }}>
                      {d ? (<><span className="text-[1.7rem] font-semibold" style={{ fontFamily: SERIF }}>{d.getDate()}</span><span className="mt-1 text-[0.8rem] font-bold uppercase tracking-wide" style={{ color: VINO }}>{MESES[d.getMonth()].slice(0, 3)}</span><span className="mt-1 text-[0.8rem] opacity-60">{d.getHours() % 12 || 12}:{String(d.getMinutes()).padStart(2, "0")} {d.getHours() >= 12 ? "pm" : "am"}</span></>) : (<><I size={22} style={{ color: VINO }} /><span className="mt-1.5 text-[0.75rem] font-bold opacity-65">Sin fecha</span></>)}
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <b className="block text-[1.1rem]">{TIPOS_BANDEJA[e.tipo]}</b>
                      <span className="block text-[1rem]">{e.nombre}</span>
                      <span className="mt-1 flex items-start gap-1 text-[0.92rem] opacity-70"><MapPin size={14} className="mt-0.5 shrink-0" />{e.lugar || "Aún sin lugar: ponlo hablando con ella"}</span>
                      <span className="mt-2 flex flex-wrap gap-2">
                        {e.confirmada ? <span className="inline-flex min-h-[2.75rem] items-center rounded-full px-3 text-[0.95rem] font-bold" style={{ background: "#dff1e5", color: "#1f5a37" }}>Confirmada</span> : <button type="button" onClick={() => abrirChat(e.id)} className={`${boton} border-2`} style={{ borderColor: VINO, color: VINO }}><MessageCircle size={16} /> Confirmar</button>}
                        <button type="button" onClick={() => abrirChat(e.id)} className={`${boton} border-2`} style={{ borderColor: "rgba(42,22,51,.25)" }}>Hablar</button>
                        <button type="button" onClick={() => cambiar(e.id, { hecho: true, leido: true })} className={`${boton} text-white`} style={{ background: TINTA }}>Ya la di</button>
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta className="lg:col-span-4" titulo="Clientas recurrentes" nota="Las que ya te compraron más de una vez." pie={verMas("Ver todas mis clientas", () => irA("clientas"))}
          derecha={<span className="flex flex-col items-end gap-1 text-[0.9rem]"><span className="opacity-70">Regalo cada</span><span className="flex items-center gap-1.5"><Paso valor={regaloCada} alCambiar={ponerRegalo} etiqueta="compras" /><span>compras</span></span></span>}>
          {recurrentes.length === 0 ? vacio("Aún no tienes clientas que repitan.") : (
            <ul className="grid gap-2.5">
              {recurrentes.slice(0, 4).map((x) => {
                const h = HISTORIAL_EJ[x.id];
                const dias = Math.round((Date.now() - new Date(h.ultima).getTime()) / 864e5);
                const faltan = regaloCada - (h.compras % regaloCada);
                const toca = h.compras % regaloCada === 0;
                return (
                  <li key={x.id} className="rounded-xl p-3.5" style={{ background: "#fdf3ed" }}>
                    <div className="flex items-center gap-3">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[1.1rem] font-bold text-white" style={{ background: VINO }}>{(x.nombre[0] ?? "") + (x.apellido[0] ?? "")}</span>
                      <button type="button" onClick={() => abrir(x.id)} className="min-w-0 flex-1 text-left leading-tight">
                        <b className="block truncate text-[1.1rem]">{x.nombre} {x.apellido}</b>
                        <span className="block text-[0.95rem] opacity-70">{h.compras} compras · {qz(h.total)}</span>
                        <span className="block text-[0.92rem] font-semibold" style={{ color: dias > 45 ? VINO : undefined }}>Última compra: hace {dias} días</span>
                      </button>
                      <button type="button" aria-label={`Escribirle a ${x.nombre}`} onClick={() => avisar(`En su negocio, este botón abre WhatsApp con ${x.nombre}.`)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: TINTA }}><MessageCircle size={19} /></button>
                    </div>
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.92rem] font-bold" style={toca ? { background: "#e58fa8", color: TINTA } : { background: "#fff", color: TINTA, border: `1.5px solid ${LINEA}` }}><Gift size={15} /> {toca ? "Le toca regalo" : `Le ${faltan === 1 ? "falta 1 compra" : `faltan ${faltan} compras`} para su regalo`}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta className="lg:col-span-3" titulo="Control de inventario" nota="Productos con menor cobertura." pie={verMas("Ver inventario completo", () => irA("inventario"))}>
          {alertas.length === 0 ? vacio("Todo bien con tu inventario.") : (
            <ul className="grid gap-3.5">
              {alertas.slice(0, 4).map((f) => (
                <li key={f.pr.id}>
                  <div className="flex items-center justify-between gap-2 text-[1.02rem]"><span className="min-w-0 truncate font-semibold">{f.pr.nombre}</span><span className="shrink-0 font-bold" style={{ color: VINO }}>{f.disp <= 0 ? "Sin existencias" : `${f.disp} disponibles`}</span></div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full" style={{ background: LINEA }}><div className="h-full rounded-full" style={{ width: `${Math.max(6, Math.min(100, (f.dias / 45) * 100))}%`, background: f.nivel === "ya" ? "#a4262c" : "#c98a00" }} /></div>
                  <p className="mt-0.5 text-[0.88rem] opacity-65">{f.dias <= 0 ? "Reponer hoy" : `Cobertura: ${f.dias} días`}</p>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta className="lg:col-span-4" titulo="Lo más vendido">
          {vendidos.length === 0 ? vacio("Aún no hay ventas.") : (
            <ul className="grid gap-3">
              {vendidos.slice(0, 5).map(({ pr, n }) => (
                <li key={pr.id} className="flex items-center gap-3">
                  <img src={pr.foto} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1"><b className="block truncate text-[1.02rem]">{pr.nombre}</b><span className="mt-1 block h-2.5 overflow-hidden rounded-full" style={{ background: LINEA }}><span className="block h-full rounded-full" style={{ width: `${(n / maxVend) * 100}%`, background: TINTA }} /></span></span>
                  <span className="shrink-0 tabular-nums">{n}</span>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta className="lg:col-span-8" titulo="Recordatorios" nota="Para escribirles hoy">
          {seguimiento.length + cumples.length === 0 ? vacio("Hoy no hay a quién escribirle.") : (
            <ul className="pf-auto" style={{ ["--min" as string]: "21rem" }}>
              {seguimiento.map(({ x, e }) => (
                <li key={x.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: "#fdf3ed" }}>
                  <span className="min-w-0 flex-1 leading-tight"><b className="block truncate">{x.nombre} {x.apellido}</b><span className="text-[0.92rem] opacity-70">Compró hace {e.cuando}: {e.que}</span></span>
                  <button type="button" aria-label={`Escribirle a ${x.nombre}`} onClick={() => avisar(`En su negocio, este botón abre WhatsApp con ${x.nombre}.`)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: TINTA }}><MessageCircle size={19} /></button>
                </li>
              ))}
              {cumples.map((c) => { const d = diasCumple(c); return (
                <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl p-3" style={{ background: "#fdf3ed" }}><span className="font-semibold">Cumpleaños de {c.nombre}</span><span className="shrink-0 font-bold" style={{ color: VINO }}>{d === 0 ? "hoy" : d === 1 ? "mañana" : `en ${d} días`}</span></li>
              ); })}
            </ul>
          )}
        </Tarjeta>
      </div>
    </div>
  );
}

export function Fila({ e, abrirChat }: { e: Entrada; abrirChat: (id: string) => void }) {
  const { cambiar } = useBandeja();
  const I = ICONO[e.tipo];
  const ultimo = e.hilo?.[e.hilo.length - 1];
  return (
    <li className="flex gap-3.5 rounded-xl p-3.5" style={{ background: e.leido ? "#fff" : "#fdf3ed", border: `1.5px solid ${e.leido ? LINEA : VINO}` }}>
      <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full text-white" style={{ background: e.leido ? TINTA : VINO }}><I size={22} />{!e.leido && <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white" style={{ background: "#e58fa8" }} />}</span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3"><b className="truncate text-[1.1rem]">{e.nombre}</b><span className="shrink-0 text-[0.9rem] opacity-60">{haceTexto(e.fecha)}</span></span>
        <span className="mt-0.5 block text-[0.88rem] font-bold uppercase tracking-wide" style={{ color: VINO }}>{TIPOS_BANDEJA[e.tipo]}{e.total ? ` · ${qz(e.total)}` : ""}{e.cuando ? ` · ${cuandoTexto(e.cuando)}` : ""}</span>
        <span className="mt-1 block text-[1.02rem] leading-snug opacity-85">{ultimo ? <>{ultimo.de === "ella" && <b>Tú: </b>}{ultimo.t}</> : e.texto}</span>
        <span className="mt-2.5 flex flex-wrap gap-2">
          <button type="button" onClick={() => abrirChat(e.id)} className={`${boton} text-white`} style={{ background: TINTA }}><MessageCircle size={16} /> {e.hilo && e.hilo.length > 1 ? `Ver chat (${e.hilo.length})` : "Responder"}</button>
          {!e.leido && <button type="button" onClick={() => cambiar(e.id, { leido: true })} className={`${boton} border-2`} style={{ borderColor: "rgba(42,22,51,.25)" }}>Ya la vi</button>}
        </span>
      </span>
    </li>
  );
}

/* Todo lo que llegó de la página, con filtro por tipo */
export function Mensajes({ abrirChat }: { abrirChat: (id: string) => void }) {
  const { lista } = useBandeja();
  const [tipo, setTipo] = useState<"todo" | "nuevos" | TipoBandeja>("todo");
  const filtros: ["todo" | "nuevos" | TipoBandeja, string][] = [["todo", `Todo (${lista.length})`], ["nuevos", `Nuevos (${lista.filter((e) => !e.leido).length})`], ["chat", "Chat"], ["pedido", "Pedidos"], ["facial", "Facial gratis"], ["reunion", "Reuniones"], ["evento", "Eventos"], ["aviso", "Promos"], ["equipo", "Quieren vender"]];
  const ver = lista.filter((e) => (tipo === "todo" ? true : tipo === "nuevos" ? !e.leido : e.tipo === tipo));
  return (
    <div className="mt-6">
      <p className="text-[1.05rem] opacity-70">Todo lo que la gente hace en tu página llega aquí: no se te pierde nada. Toca "Ver chat" para hablar con ella.</p>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar">
        {filtros.map(([v, t]) => <button key={v} type="button" aria-pressed={tipo === v} onClick={() => setTipo(v)} className={`${boton} border-2`} style={tipo === v ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(42,22,51,.25)", background: "#fff" }}>{t}</button>)}
      </div>
      {ver.length === 0 ? <div className="mt-5">{vacio("No hay nada en esta parte.")}</div> : (
        <ul className="pf-auto mt-5" style={{ ["--min" as string]: "26rem" }}>
          {ver.map((e) => <Fila key={e.id} e={e} abrirChat={abrirChat} />)}
        </ul>
      )}
    </div>
  );
}
