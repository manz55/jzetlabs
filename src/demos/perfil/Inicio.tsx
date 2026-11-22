/*
 * El inicio del panel de la consultora: todo lo que necesita ver al abrir, sin dar vueltas.
 * Lo que llega de su página (mensajes, pedidos, citas, avisos) cae aquí en una sola bandeja.
 * Para una consultora, lo urgente es: quién me escribió, qué debo entregar, qué me deben, qué clases tengo y qué se me acaba.
 */
import { useState, type ReactNode } from "react";
import { Bell, CalendarDays, ChevronRight, MessageCircle, Package, ShoppingBag, Sparkles, UserPlus, Users, Wallet } from "lucide-react";
import { LINEA, MESES, TINTA, TIPOS_BANDEJA, VINO, HISTORIAL_EJ, producto, qz, saldo, totalDe, useBandeja, type Entrada, type Perfil, type Producto, type TipoBandeja } from "./datos";

const SERIF = '"Fraunces", Georgia, serif';
const ICONO: Record<TipoBandeja, typeof Bell> = { chat: MessageCircle, pedido: ShoppingBag, facial: Sparkles, reunion: Users, evento: CalendarDays, aviso: Bell, equipo: UserPlus };

const haceTexto = (iso: string) => {
  const m = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 6e4));
  if (m < 60) return `hace ${m} min`;
  if (m < 60 * 24) return `hace ${Math.round(m / 60)} h`;
  const d = Math.round(m / 1440);
  return `hace ${d} ${d === 1 ? "día" : "días"}`;
};

function Tarjeta({ titulo, nota, derecha, className = "", children }: { titulo: string; nota?: string; derecha?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={`min-w-0 rounded-2xl bg-white p-5 sm:p-6 ${className}`} style={{ border: `1.5px solid ${LINEA}` }}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h2 className="text-[clamp(1.4rem,1.2rem+0.6vw,1.75rem)] font-medium leading-tight" style={{ fontFamily: SERIF }}>{titulo}</h2>
          {nota && <p className="mt-0.5 text-[0.98rem] opacity-60">{nota}</p>}
        </div>
        {derecha}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const vacio = (t: string) => <p className="rounded-xl px-4 py-5 text-center text-[1.05rem] opacity-60" style={{ background: "#fdf3ed" }}>{t}</p>;
const boton = "inline-flex min-h-[2.75rem] items-center justify-center gap-1.5 rounded-full px-4 text-[1rem] font-semibold transition active:scale-[0.97]";

export function Inicio({ perfiles, stock, disponible, porEntregar, porCobrar, vendido, meta, ganancia, vendidos, faltan, cumples, diasCumple, seguimiento, irA, abrir, avisar, entregar }: {
  perfiles: Perfil[]; stock: Record<string, number>; disponible: (id: string) => number; porEntregar: Perfil[]; porCobrar: Perfil[]; vendido: number; meta: number; ganancia: number;
  vendidos: { pr: Producto; n: number }[]; faltan: { pr: Producto; pedir: number }[]; cumples: Perfil[]; diasCumple: (p: Perfil) => number;
  seguimiento: { x: Perfil; e: { cuando: string; que: string } }[];
  irA: (p: "mensajes" | "pedidos" | "inventario" | "clientas") => void; abrir: (id: string) => void; avisar: (t: string) => void; entregar: (x: Perfil) => void;
}) {
  const { lista, cambiar } = useBandeja();
  const [soloNuevos, setSoloNuevos] = useState(false);
  const sinLeer = lista.filter((e) => !e.leido);
  const mostrar = (soloNuevos ? sinLeer : lista).slice(0, 5);
  const pedidosWeb = lista.filter((e) => e.tipo === "pedido" && !e.hecho);
  const citas = lista.filter((e) => ["facial", "reunion", "evento"].includes(e.tipo) && !e.hecho).sort((a, b) => (a.cuando ?? "9").localeCompare(b.cuando ?? "9"));
  const pendientes = porEntregar.length + pedidosWeb.length;
  const montoPendiente = porEntregar.reduce((t, x) => t + totalDe(x.llevo), 0) + pedidosWeb.reduce((t, e) => t + (e.total ?? 0), 0);
  const recurrentes = perfiles.filter((x) => HISTORIAL_EJ[x.id]).sort((a, b) => HISTORIAL_EJ[b.id].compras - HISTORIAL_EJ[a.id].compras);
  const hoy = new Date();
  const canales: [string, number][] = [
    ["Mensajes del chat", lista.filter((e) => e.tipo === "chat").length],
    ["Pedidos", lista.filter((e) => e.tipo === "pedido").length],
    ["Clases y citas", lista.filter((e) => ["facial", "reunion", "evento"].includes(e.tipo)).length],
    ["Avisos y equipo", lista.filter((e) => ["aviso", "equipo"].includes(e.tipo)).length],
  ];
  const maxCanal = Math.max(1, ...canales.map(([, n]) => n));
  const maxVend = Math.max(1, ...vendidos.map((v) => v.n));

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
      {/* lo del mes */}
      <section className="grid gap-5 rounded-2xl p-5 text-white sm:p-7 lg:grid-cols-[1.4fr_1fr]" style={{ background: VINO }}>
        <div>
          <p className="text-[1.05rem] opacity-80">Vendido en {MESES[hoy.getMonth()]}</p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-4 text-[clamp(2.6rem,2rem+2vw,4rem)] font-medium leading-none" style={{ fontFamily: SERIF }}>{qz(vendido)}<span className="text-[1.1rem] font-normal opacity-80" style={{ fontFamily: "inherit" }}>de tu meta de {qz(meta)}</span></p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/25"><div className="h-full rounded-full bg-white" style={{ width: `${Math.min(100, (vendido / meta) * 100)}%` }} /></div>
          <p className="mt-2 text-[1.05rem] opacity-90">{vendido >= meta ? "¡Meta cumplida!" : `Te faltan ${qz(meta - vendido)} · llevas el ${Math.round((vendido / meta) * 100)}%`}</p>
        </div>
        <dl className="grid grid-cols-2 gap-3 self-center">
          <div className="rounded-xl bg-white/15 p-4"><dt className="text-[0.98rem] opacity-85">Te queda de ganancia</dt><dd className="mt-1 text-[1.9rem] font-semibold leading-none" style={{ fontFamily: SERIF }}>{qz(ganancia)}</dd></div>
          <div className="rounded-xl bg-white/15 p-4"><dt className="text-[0.98rem] opacity-85">Pedidos por entregar</dt><dd className="mt-1 text-[1.9rem] font-semibold leading-none" style={{ fontFamily: SERIF }}>{qz(montoPendiente)}</dd></div>
        </dl>
      </section>

      {/* lo urgente */}
      <div className="pf-auto" style={{ ["--min" as string]: "14.5rem" }}>
        {kpi(MessageCircle, String(sinLeer.length), "Mensajes nuevos", "de tu página", sinLeer.length > 0, () => irA("mensajes"))}
        {kpi(Package, String(pendientes), "Pedidos por entregar", qz(montoPendiente), pendientes > 0, () => irA("pedidos"))}
        {kpi(Wallet, qz(porCobrar.reduce((t, x) => t + saldo(x), 0)), "Por cobrar", `${porCobrar.length} ${porCobrar.length === 1 ? "pedido" : "pedidos"}`, porCobrar.length > 0, () => irA("pedidos"))}
        {kpi(CalendarDays, String(citas.length), "Clases y citas", "por atender", citas.length > 0, () => irA("mensajes"))}
        {kpi(ShoppingBag, String(faltan.length), "Se te está acabando", faltan.length === 1 ? "producto" : "productos", faltan.length > 0, () => irA("inventario"))}
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <Tarjeta className="lg:col-span-7" titulo="Lo que llegó de tu página" nota="Chat, pedidos, citas y avisos, en un solo lugar."
          derecha={<div className="flex gap-2">{[["Todo", false], [`Nuevos (${sinLeer.length})`, true]].map(([t, v]) => <button key={String(t)} type="button" aria-pressed={soloNuevos === v} onClick={() => setSoloNuevos(v as boolean)} className={`${boton} border-2`} style={soloNuevos === v ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(42,22,51,.25)" }}>{t as string}</button>)}</div>}>
          {mostrar.length === 0 ? vacio("No tienes mensajes nuevos.") : (
            <ul className="grid gap-2.5">
              {mostrar.map((e) => <Fila key={e.id} e={e} cambiar={cambiar} avisar={avisar} />)}
            </ul>
          )}
          <button type="button" onClick={() => irA("mensajes")} className="mt-4 inline-flex items-center gap-1 text-[1.05rem] font-semibold underline decoration-1 underline-offset-4">Ver todo lo que llegó ({lista.length}) <ChevronRight size={18} /></button>
        </Tarjeta>

        <Tarjeta className="lg:col-span-5" titulo="Pedidos por entregar" nota={`${pendientes} pendientes · ${qz(montoPendiente)}`}>
          {pendientes === 0 ? vacio("No tienes pedidos pendientes.") : (
            <ul className="grid gap-2.5">
              {pedidosWeb.map((e) => (
                <li key={e.id} className="rounded-xl p-4" style={{ background: "#fdf3ed" }}>
                  <div className="flex items-baseline justify-between gap-3"><b className="truncate text-[1.1rem]">{e.nombre}</b><span className="shrink-0 text-[1.2rem] font-semibold" style={{ fontFamily: SERIF }}>{qz(e.total ?? 0)}</span></div>
                  <p className="mt-0.5 text-[0.98rem] opacity-75">{e.texto}</p>
                  <p className="mt-1 text-[0.9rem] font-semibold" style={{ color: VINO }}>Llegó de tu página · {haceTexto(e.fecha)}</p>
                  <button type="button" onClick={() => { cambiar(e.id, { hecho: true, leido: true }); avisar("Pedido marcado como atendido."); }} className={`${boton} mt-3 text-white`} style={{ background: TINTA }}>Marcar entregado</button>
                </li>
              ))}
              {porEntregar.map((x) => (
                <li key={x.id} className="rounded-xl p-4" style={{ background: "#fdf3ed" }}>
                  <div className="flex items-baseline justify-between gap-3"><button type="button" onClick={() => abrir(x.id)} className="truncate text-left text-[1.1rem] font-bold">{x.nombre} {x.apellido}</button><span className="shrink-0 text-[1.2rem] font-semibold" style={{ fontFamily: SERIF }}>{qz(totalDe(x.llevo))}</span></div>
                  <p className="mt-0.5 text-[0.98rem] opacity-75">{x.llevo.map((id) => producto(id)?.nombre).join(", ")}</p>
                  <button type="button" onClick={() => entregar(x)} className={`${boton} mt-3 text-white`} style={{ background: TINTA }}>Marcar entregado</button>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta className="lg:col-span-5" titulo="Clases y citas pendientes" nota="Lo que te pidieron desde tu página.">
          {citas.length === 0 ? vacio("No tienes clases pendientes.") : (
            <ul className="grid gap-2.5">
              {citas.map((e) => {
                const d = e.cuando ? new Date(e.cuando) : null;
                const I = ICONO[e.tipo];
                return (
                  <li key={e.id} className="flex gap-4 rounded-xl p-3.5" style={{ background: "#fdf3ed" }}>
                    <span className="grid w-[4.2rem] shrink-0 place-items-center rounded-xl bg-white py-2 text-center leading-none" style={{ border: `1.5px solid ${LINEA}` }}>
                      {d ? (<><span className="text-[1.7rem] font-semibold" style={{ fontFamily: SERIF }}>{d.getDate()}</span><span className="mt-1 text-[0.8rem] font-bold uppercase tracking-wide" style={{ color: VINO }}>{MESES[d.getMonth()].slice(0, 3)}</span><span className="mt-1 text-[0.8rem] opacity-60">{d.getHours()}:00</span></>) : (<><I size={22} style={{ color: VINO }} /><span className="mt-1.5 text-[0.75rem] font-bold opacity-65">Sin fecha</span></>)}
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <b className="block text-[1.1rem]">{TIPOS_BANDEJA[e.tipo]}</b>
                      <span className="block text-[1rem]">{e.nombre}</span>
                      <span className="mt-0.5 block text-[0.92rem] opacity-65">{e.texto}</span>
                      <span className="mt-2 flex flex-wrap gap-2">
                        <button type="button" onClick={() => avisar(`En su negocio, este botón le confirma la cita a ${e.nombre.split(" ")[0]} por WhatsApp.`)} className={`${boton} border-2`} style={{ borderColor: VINO, color: VINO }}><MessageCircle size={16} /> Confirmar</button>
                        <button type="button" onClick={() => cambiar(e.id, { hecho: true, leido: true })} className={`${boton} text-white`} style={{ background: TINTA }}>Ya la di</button>
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta className="lg:col-span-4" titulo="Clientas que vuelven" nota="Las que ya te compraron más de una vez.">
          {recurrentes.length === 0 ? vacio("Aún no tienes clientas que repitan.") : (
            <ul className="grid gap-2.5">
              {recurrentes.map((x) => {
                const h = HISTORIAL_EJ[x.id];
                const dias = Math.round((Date.now() - new Date(h.ultima).getTime()) / 864e5);
                return (
                  <li key={x.id} className="flex items-center gap-3 rounded-xl p-3.5" style={{ background: "#fdf3ed" }}>
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[1.1rem] font-bold text-white" style={{ background: VINO }}>{(x.nombre[0] ?? "") + (x.apellido[0] ?? "")}</span>
                    <button type="button" onClick={() => abrir(x.id)} className="min-w-0 flex-1 text-left leading-tight">
                      <b className="block truncate text-[1.1rem]">{x.nombre} {x.apellido}</b>
                      <span className="block text-[0.95rem] opacity-70">{h.compras} compras · {qz(h.total)}</span>
                      <span className="block text-[0.9rem] font-semibold" style={{ color: dias > 45 ? VINO : undefined }}>{dias > 45 ? `Hace ${dias} días que no compra` : `Compró hace ${dias} días`}</span>
                    </button>
                    <button type="button" aria-label={`Escribirle a ${x.nombre}`} onClick={() => avisar(`En su negocio, este botón abre WhatsApp con ${x.nombre}.`)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: TINTA }}><MessageCircle size={19} /></button>
                  </li>
                );
              })}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta className="lg:col-span-3" titulo="Se te está acabando" nota="Piensa en pedir a la empresa.">
          {faltan.length === 0 ? vacio("Todo bien con tu inventario.") : (
            <ul className="grid gap-3">
              {faltan.slice(0, 6).map(({ pr }) => {
                const d = Math.max(0, disponible(pr.id));
                return (
                  <li key={pr.id}>
                    <div className="flex items-center justify-between gap-3 text-[1.02rem]"><span className="min-w-0 truncate font-semibold">{pr.nombre}</span><span className="shrink-0 font-bold" style={{ color: VINO }}>{d === 0 ? "Ya no tienes" : `Te queda ${d}`}</span></div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full" style={{ background: LINEA }}><div className="h-full rounded-full" style={{ width: `${Math.max(6, (d / 3) * 100)}%`, background: VINO }} /></div>
                  </li>
                );
              })}
            </ul>
          )}
          <button type="button" onClick={() => irA("inventario")} className={`${boton} mt-5 w-full text-white`} style={{ background: TINTA }}>Ver qué pedir</button>
          <p className="mt-2 text-center text-[0.9rem] opacity-55">Tienes {Object.values(stock).reduce((t, n) => t + n, 0)} piezas en total.</p>
        </Tarjeta>

        <Tarjeta className="lg:col-span-4" titulo="Lo que más vendes">
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

        <Tarjeta className="lg:col-span-4" titulo="De dónde te escriben" nota="Lo que llegó de tu página, por tipo.">
          <ul className="grid gap-3.5">
            {canales.map(([t, n]) => (
              <li key={t}><div className="flex justify-between text-[1.02rem]"><span>{t}</span><b className="tabular-nums">{n}</b></div><div className="mt-1.5 h-2.5 overflow-hidden rounded-full" style={{ background: LINEA }}><div className="h-full rounded-full" style={{ width: `${(n / maxCanal) * 100}%`, background: VINO }} /></div></li>
            ))}
          </ul>
        </Tarjeta>

        <Tarjeta className="lg:col-span-4" titulo="Para escribirles hoy" nota="Seguimientos y cumpleaños.">
          {seguimiento.length + cumples.length === 0 ? vacio("Hoy no hay a quién escribirle.") : (
            <ul className="grid gap-2.5">
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

export function Fila({ e, cambiar, avisar }: { e: Entrada; cambiar: (id: string, c: Partial<Entrada>) => void; avisar: (t: string) => void }) {
  const I = ICONO[e.tipo];
  return (
    <li className="flex gap-3.5 rounded-xl p-3.5" style={{ background: e.leido ? "#fff" : "#fdf3ed", border: `1.5px solid ${e.leido ? LINEA : VINO}` }}>
      <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full text-white" style={{ background: e.leido ? TINTA : VINO }}><I size={22} />{!e.leido && <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white" style={{ background: "#e58fa8" }} />}</span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3"><b className="truncate text-[1.1rem]">{e.nombre}</b><span className="shrink-0 text-[0.9rem] opacity-60">{haceTexto(e.fecha)}</span></span>
        <span className="mt-0.5 block text-[0.88rem] font-bold uppercase tracking-wide" style={{ color: VINO }}>{TIPOS_BANDEJA[e.tipo]}{e.total ? ` · ${qz(e.total)}` : ""}</span>
        <span className="mt-1 block text-[1.02rem] leading-snug opacity-85">{e.texto}</span>
        <span className="mt-2.5 flex flex-wrap gap-2">
          <button type="button" onClick={() => { avisar(`En su negocio, este botón abre WhatsApp con ${e.nombre.split(" ")[0]}.`); cambiar(e.id, { leido: true }); }} className={`${boton} text-white`} style={{ background: TINTA }}><MessageCircle size={16} /> Responder</button>
          {!e.leido && <button type="button" onClick={() => cambiar(e.id, { leido: true })} className={`${boton} border-2`} style={{ borderColor: "rgba(42,22,51,.25)" }}>Ya la vi</button>}
        </span>
      </span>
    </li>
  );
}

/* Todo lo que llegó de la página, con filtro por tipo */
export function Mensajes({ avisar }: { avisar: (t: string) => void }) {
  const { lista, cambiar } = useBandeja();
  const [tipo, setTipo] = useState<"todo" | "nuevos" | TipoBandeja>("todo");
  const filtros: ["todo" | "nuevos" | TipoBandeja, string][] = [["todo", `Todo (${lista.length})`], ["nuevos", `Nuevos (${lista.filter((e) => !e.leido).length})`], ["chat", "Chat"], ["pedido", "Pedidos"], ["facial", "Facial gratis"], ["reunion", "Reuniones"], ["evento", "Eventos"], ["aviso", "Promos"], ["equipo", "Quieren vender"]];
  const ver = lista.filter((e) => (tipo === "todo" ? true : tipo === "nuevos" ? !e.leido : e.tipo === tipo));
  return (
    <div className="mt-6">
      <p className="text-[1.05rem] opacity-70">Todo lo que la gente hace en tu página llega aquí: no se te pierde nada.</p>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar">
        {filtros.map(([v, t]) => <button key={v} type="button" aria-pressed={tipo === v} onClick={() => setTipo(v)} className={`${boton} border-2`} style={tipo === v ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(42,22,51,.25)", background: "#fff" }}>{t}</button>)}
      </div>
      {ver.length === 0 ? <div className="mt-5">{vacio("No hay nada en esta parte.")}</div> : (
        <ul className="pf-auto mt-5" style={{ ["--min" as string]: "26rem" }}>
          {ver.map((e) => <Fila key={e.id} e={e} cambiar={cambiar} avisar={avisar} />)}
        </ul>
      )}
    </div>
  );
}
