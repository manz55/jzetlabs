/*
 * Los pedidos de la consultora: cada uno es una tarjeta con quién lo pidió, qué lleva, cuánto gana,
 * a dónde va y en qué paso está. Si tiene mensajero, el pedido pasa por "en proceso" y "enviado";
 * si lo entrega ella misma, solo está pendiente o entregado.
 */
import { useState, type ReactNode } from "react";
import { Check, MapPin, MessageCircle, Phone, Truck } from "lucide-react";
import { LINEA, TINTA, VINO, producto, qz, telTexto, totalDe, type Entrada, type Fase, type Extra, type Perfil } from "./datos";

const SERIF = '"Fraunces", Georgia, serif';
export type PedidoV = { id: string; nombre: string; telefono: string; direccion: string; items: { nombre: string; n: number; foto?: string }[]; total: number; ganancia: number; origen: "pagina" | "clienta"; fase: Fase; mensajero: boolean; fecha: string; perfil?: Perfil; entrada?: Entrada };

const costoIds = (ids: string[]) => ids.reduce((t, id) => t + (producto(id)?.costo ?? 0), 0);

export function construirPedidos(perfiles: Perfil[], entradas: Entrada[], extras: Record<string, Extra>, mensajeroPorDefecto: boolean): PedidoV[] {
  const deClientas = perfiles.filter((x) => x.llevo.length).map((x): PedidoV => {
    const cuenta: Record<string, number> = {};
    x.llevo.forEach((id) => (cuenta[id] = (cuenta[id] ?? 0) + 1));
    const e = extras[x.id];
    return {
      id: x.id, nombre: `${x.nombre} ${x.apellido}`.trim(), telefono: x.telefono, direccion: [x.direccion, x.municipio].filter(Boolean).join(", "),
      items: Object.entries(cuenta).map(([id, n]) => ({ nombre: producto(id)?.nombre ?? id, n, foto: producto(id)?.foto })),
      total: totalDe(x.llevo), ganancia: totalDe(x.llevo) - costoIds(x.llevo), origen: "clienta",
      fase: x.estado !== "por-entregar" ? "entregado" : e?.fase ?? "pendiente", mensajero: e?.mensajero ?? mensajeroPorDefecto, fecha: x.creado, perfil: x,
    };
  });
  const deLaPagina = entradas.filter((e) => e.tipo === "pedido").map((e): PedidoV => {
    const x = extras[e.id];
    return {
      id: e.id, nombre: e.nombre, telefono: e.telefono ?? "", direccion: e.direccion ?? "", items: [{ nombre: e.texto, n: 1 }], total: e.total ?? 0,
      ganancia: (e.total ?? 0) - (e.costo ?? Math.round((e.total ?? 0) * 0.6)), origen: "pagina", fase: e.hecho ? "entregado" : x?.fase ?? "pendiente", mensajero: x?.mensajero ?? mensajeroPorDefecto, fecha: e.fecha, entrada: e,
    };
  });
  return [...deLaPagina, ...deClientas];
}

export const NOMBRE_FASE: Record<Fase, string> = { pendiente: "Pendiente de entregar", proceso: "En proceso", enviado: "Enviado", entregado: "Entregado" };
export const pasos = (mensajero: boolean): Fase[] => (mensajero ? ["pendiente", "proceso", "enviado", "entregado"] : ["pendiente", "entregado"]);
const siguiente = (p: PedidoV): Fase | null => { const l = pasos(p.mensajero); const i = l.indexOf(p.fase); return i >= 0 && i < l.length - 1 ? l[i + 1] : null; };
const TEXTO_BOTON: Record<Fase, string> = { pendiente: "", proceso: "Pasar a en proceso", enviado: "Marcar enviado", entregado: "Marcar entregado" };

export function InsigniaFase({ fase }: { fase: Fase }) {
  const hecho = fase === "entregado";
  return <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[0.92rem] font-bold" style={hecho ? { background: "#dff1e5", color: "#1f5a37" } : fase === "pendiente" ? { background: "#fde6da", color: VINO, border: `1.5px solid ${VINO}` } : { background: VINO, color: "#fff" }}>{hecho ? <Check size={15} strokeWidth={3} /> : fase === "pendiente" ? null : <Truck size={15} />}{NOMBRE_FASE[fase]}</span>;
}

export function PedidosTab({ pedidos, cambiarFase, ponerMensajero, avisar, abrir, abono }: {
  pedidos: PedidoV[]; cambiarFase: (p: PedidoV, f: Fase) => void; ponerMensajero: (p: PedidoV, v: boolean) => void; avisar: (t: string) => void; abrir: (id: string) => void; abono: (x: Perfil) => ReactNode;
}) {
  const [ver, setVer] = useState<"por" | "ruta" | "entregados" | "todos">("por");
  const filtro = (p: PedidoV) => (ver === "todos" ? true : ver === "por" ? p.fase === "pendiente" : ver === "ruta" ? p.fase === "proceso" || p.fase === "enviado" : p.fase === "entregado");
  const lista = pedidos.filter(filtro);
  const cuenta = (f: (p: PedidoV) => boolean) => pedidos.filter(f).length;
  const filtros: ["por" | "ruta" | "entregados" | "todos", string][] = [["por", `Pendientes (${cuenta((p) => p.fase === "pendiente")})`], ["ruta", `En camino (${cuenta((p) => p.fase === "proceso" || p.fase === "enviado")})`], ["entregados", `Entregados (${cuenta((p) => p.fase === "entregado")})`], ["todos", `Todos (${pedidos.length})`]];
  const porGanar = pedidos.filter((p) => p.fase !== "entregado").reduce((t, p) => t + p.ganancia, 0);
  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar pedidos">
          {filtros.map(([v, t]) => <button key={v} type="button" aria-pressed={ver === v} onClick={() => setVer(v)} className="min-h-[2.75rem] rounded-full border-2 px-4 text-[1rem] font-semibold" style={ver === v ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(42,22,51,.25)", background: "#fff" }}>{t}</button>)}
        </div>
        <p className="rounded-xl bg-white px-4 py-2.5 text-[1.05rem]" style={{ border: `1.5px solid ${LINEA}` }}>Total por ganar: <b style={{ fontFamily: SERIF, fontSize: "1.3rem" }}>{qz(porGanar)}</b></p>
      </div>
      {lista.length === 0 ? <p className="mt-5 rounded-xl bg-white px-4 py-8 text-center text-[1.1rem] opacity-60">No hay pedidos en esta parte.</p> : (
        <ul className="pf-auto mt-5" style={{ ["--min" as string]: "27rem" }}>
          {lista.map((p) => {
            const sig = siguiente(p);
            const l = pasos(p.mensajero);
            const iFase = l.indexOf(p.fase);
            return (
              <li key={p.id} className="flex min-w-0 flex-col rounded-2xl bg-white p-5" style={{ border: `1.5px solid ${p.fase === "pendiente" ? VINO : LINEA}` }}>
                <div className="flex items-start gap-3.5">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-[1.2rem] font-bold text-white" style={{ background: VINO }}>{p.nombre.split(" ").slice(0, 2).map((w) => w[0]).join("")}</span>
                  <span className="min-w-0 flex-1 leading-tight">
                    {p.perfil ? <button type="button" onClick={() => abrir(p.perfil!.id)} className="block max-w-full truncate text-left text-[1.3rem] font-bold">{p.nombre}</button> : <b className="block truncate text-[1.3rem]">{p.nombre}</b>}
                    <span className="mt-0.5 block text-[0.92rem] font-semibold" style={{ color: VINO }}>{p.origen === "pagina" ? "Llegó desde tu página" : "Clienta tuya"}</span>
                  </span>
                  <span className="shrink-0 text-right leading-tight"><span className="block text-[1.9rem] font-semibold leading-none" style={{ fontFamily: SERIF }}>{qz(p.total)}</span><span className="mt-1 block text-[0.95rem] font-bold" style={{ color: "#1f5a37" }}>Ganas {qz(p.ganancia)}</span></span>
                </div>

                <ol className="mt-4 flex items-center" aria-label="Paso del pedido">
                  {l.map((f, i) => (
                    <li key={f} className="flex flex-1 items-center last:flex-none">
                      <span className="flex flex-col items-center gap-1">
                        <span className="grid h-8 w-8 place-items-center rounded-full text-[0.9rem] font-bold" style={i <= iFase ? { background: i === iFase && f !== "entregado" ? VINO : "#2f6b45", color: "#fff" } : { background: LINEA, color: TINTA }}>{i < iFase || f === p.fase && f === "entregado" ? <Check size={16} strokeWidth={3} /> : i + 1}</span>
                        <span className={`max-w-[5.5rem] text-center text-[0.8rem] leading-tight ${i === iFase ? "font-bold" : "opacity-60"}`}>{f === "pendiente" ? "Pendiente" : NOMBRE_FASE[f]}</span>
                      </span>
                      {i < l.length - 1 && <span className="mx-1 mb-5 h-1 flex-1 rounded-full" style={{ background: i < iFase ? "#2f6b45" : LINEA }} />}
                    </li>
                  ))}
                </ol>

                <ul className="mt-4 grid gap-2 rounded-xl p-3" style={{ background: "#fdf3ed" }}>
                  {p.items.map((it, i) => (
                    <li key={i} className="flex items-center gap-3">
                      {it.foto && <img src={it.foto} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />}
                      <span className="min-w-0 flex-1 text-[1.02rem] leading-snug">{it.n > 1 && <b>{it.n} × </b>}{it.nombre}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 grid gap-1.5 text-[1rem]">
                  <p className="flex items-start gap-2"><MapPin size={18} className="mt-0.5 shrink-0" style={{ color: VINO }} /><span>{p.direccion || "Sin dirección todavía"}</span></p>
                  <p className="flex items-center gap-2"><Phone size={18} className="shrink-0" style={{ color: VINO }} /><span>{p.telefono ? telTexto(p.telefono) : "Sin teléfono"}</span>
                    <button type="button" onClick={() => avisar(`En su negocio, este botón abre WhatsApp con ${p.nombre.split(" ")[0]}.`)} className="ml-auto inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-full border-2 px-3 text-[0.95rem] font-semibold" style={{ borderColor: VINO, color: VINO }}><MessageCircle size={15} /> Escribirle</button></p>
                </div>

                <div className="mt-auto pt-4">
                  {p.fase !== "entregado" && (
                    <button type="button" aria-pressed={p.mensajero} onClick={() => ponerMensajero(p, !p.mensajero)} className="mb-3 flex w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-[1rem] font-semibold" style={{ borderColor: "rgba(42,22,51,.2)" }}>
                      <span className="flex items-center gap-2"><Truck size={19} style={{ color: VINO }} /> Lo lleva mi mensajero</span>
                      <span className="relative h-7 w-12 rounded-full transition" style={{ background: p.mensajero ? VINO : "rgba(42,22,51,.25)" }}><span className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all" style={{ left: p.mensajero ? "1.4rem" : "0.15rem" }} /></span>
                    </button>
                  )}
                  {sig && <button type="button" onClick={() => cambiarFase(p, sig)} className="pf-btn min-h-[3.25rem] w-full rounded-full text-[1.1rem] font-semibold text-white" style={{ background: sig === "entregado" ? "#2f6b45" : TINTA }}>{TEXTO_BOTON[sig]}</button>}
                  {p.fase === "entregado" && p.perfil && p.perfil.estado === "entregado" && <div className="mt-1">{abono(p.perfil)}</div>}
                  {p.fase === "entregado" && !(p.perfil && p.perfil.estado === "entregado") && <p className="text-center text-[1.05rem] font-bold" style={{ color: "#1f5a37" }}>Entregado</p>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
