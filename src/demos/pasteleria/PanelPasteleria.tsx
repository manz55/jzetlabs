/*
 * Cocina de Dulce Abril: los tickets de cocina.
 * Identidad propia: cacao oscuro, tickets de papel crema con borde de sierra, frambuesa y mantequilla; DM Serif Display y Nunito.
 * Lo que se ve primero: qué sale primero de la cocina (cada pedido es un ticket con su cuenta regresiva). Lo que se llena: el saldo al entregar y la vitrina del día.
 */
import { useState, type ReactNode } from "react";
import { Check, Truck } from "lucide-react";
import { Contador } from "../comun";
import { CUPO_DIA, ENTREGAS, FRAMBUESA, MANTEQUILLA, PASTELES, POSTRES, SABORES, TAMANOS, fechaLarga, iso, masDias, ocupados, por, qz, type Pedido, type usePedidos, type useVitrina } from "./datos";

const CACAO = "#2b1812";
const CACAO2 = "#3a2219";
const CREMA = "#fff4e6";
const MENTA = "#6fa98a";
const TITULO = "'DM Serif Display', Georgia, serif";
const CUERPO = "'Nunito', 'Instrument Sans', system-ui, sans-serif";

const sierra = { WebkitMask: "conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 14px 100%", mask: "conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 14px 100%" } as const;

function Btn({ children, alTocar, tipo = "frambuesa", ancho = false }: { children: ReactNode; alTocar: () => void; tipo?: "frambuesa" | "mantequilla" | "borde"; ancho?: boolean }) {
  const s = tipo === "frambuesa" ? { background: FRAMBUESA, color: "#fff" } : tipo === "mantequilla" ? { background: MANTEQUILLA, color: CACAO } : { background: "transparent", color: CACAO, border: `2px solid ${CACAO}` };
  return <button type="button" onClick={alTocar} className={`inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-full px-5 py-2 text-[0.95rem] font-extrabold transition hover:brightness-105 active:scale-[0.97] ${ancho ? "w-full" : ""}`} style={s}>{children}</button>;
}

export default function PanelPasteleria({ store, vit }: { store: ReturnType<typeof usePedidos>; vit: ReturnType<typeof useVitrina> }) {
  const { pedidos, cambiar } = store;
  const [vista, setVista] = useState<"cocina" | "cobros" | "vitrina">("cocina");
  const hoy = iso(masDias(0));
  const semana = Array.from({ length: 7 }, (_, i) => iso(masDias(i)));
  const dias = (f: string) => Math.round((new Date(f + "T12:00").getTime() - new Date(hoy + "T12:00").getTime()) / 864e5);
  const orden = (a: Pedido, b: Pedido) => a.fecha.localeCompare(b.fecha) || a.horario.localeCompare(b.horario);
  const porHacer = pedidos.filter((x) => x.estado === "por-hacer").sort(orden);
  const listos = pedidos.filter((x) => x.estado === "listo").sort(orden);
  const entregados = pedidos.filter((x) => x.estado === "entregado").sort(orden).slice(-4);
  const cobrado = pedidos.reduce((t, x) => t + x.pagado, 0);
  const falta = pedidos.reduce((t, x) => t + (x.total - x.pagado), 0);
  const proximos = porHacer.filter((x) => x.fecha <= iso(masDias(2)));
  const producir = SABORES.map((s) => ({ s, n: proximos.filter((x) => x.sabor === s.id).length, porciones: proximos.filter((x) => x.sabor === s.id).reduce((t, x) => t + por(TAMANOS, x.tamano).porciones, 0) })).filter((x) => x.n);

  const ticket = (x: Pedido, acciones: ReactNode) => {
    const pa = por(PASTELES, x.pastel), t = por(TAMANOS, x.tamano), d = dias(x.fecha), saldo = x.total - x.pagado;
    return (
      <article key={x.id} className="pb-5" style={{ background: CREMA, color: CACAO, ...sierra }}>
        <div className="flex items-start justify-between gap-2 px-4 pt-3">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-wider opacity-60">Pedido #{x.id.slice(-3).toUpperCase()}</p>
          <span className="rounded-full px-2.5 py-0.5 text-[0.75rem] font-extrabold text-white" style={{ background: d <= 0 ? FRAMBUESA : d === 1 ? "#c9822b" : MENTA }}>{d < 0 ? "atrasado" : d === 0 ? "SALE HOY" : d === 1 ? "sale mañana" : `en ${d} días`}</span>
        </div>
        <div className="flex gap-3 px-4 pt-1.5">
          <img src={pa.foto} alt={pa.nombre} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0 leading-tight"><p className="text-[1.2rem]" style={{ fontFamily: TITULO }}>{pa.nombre}</p><p className="text-[0.88rem]">{t.porciones} porciones · {por(SABORES, x.sabor).nombre}</p><p className="text-[0.88rem] font-bold">{x.nombre} {x.nuevo && <span className="ml-1 rounded-full px-1.5 py-0.5 text-[0.68rem] text-white" style={{ background: FRAMBUESA }}>en línea</span>}</p></div>
        </div>
        <div className="mx-4 mt-2 border-t-2 border-dashed pt-2 text-[0.88rem]" style={{ borderColor: "rgba(43,24,18,.3)" }}>
          {x.texto && <p><b>Dedicatoria:</b> «{x.texto}»{x.velas ? " · con velas" : ""}</p>}
          <p><b>{fechaLarga(x.fecha).replace(/^./, (c) => c.toUpperCase())}</b> · {x.horario}</p>
          <p>{por(ENTREGAS, x.entrega).nombre}{x.direccion ? `: ${x.direccion}` : ""}</p>
          <p className="mt-1 font-extrabold" style={{ color: saldo > 0 ? FRAMBUESA : "#2f7a4d" }}>{saldo > 0 ? `Falta cobrar ${qz(saldo)} de ${qz(x.total)}` : `Pagado ${qz(x.total)}`}</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 px-4">{acciones}</div>
      </article>
    );
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]" style={{ background: CACAO, color: CREMA, fontFamily: CUERPO }}>
      <header className="border-b" style={{ borderColor: "rgba(255,244,230,.15)" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-end gap-x-8 gap-y-3 px-5 py-5">
          <div><p className="text-[0.8rem] font-extrabold uppercase tracking-[0.2em] opacity-60">Dulce Abril · cocina</p><h1 className="text-[2.6rem] leading-none" style={{ fontFamily: TITULO }}>{fechaLarga(hoy).replace(/^./, (c) => c.toUpperCase())}</h1></div>
          <div className="ml-auto flex gap-6 text-[0.9rem]">{[[String(porHacer.length), "por hornear"], [String(listos.length), "listos"], [qz(cobrado), "cobrado"], [qz(falta), "falta cobrar"]].map(([n, t]) => <p key={t}><b className="block text-[1.7rem] leading-none" style={{ fontFamily: TITULO, color: MANTEQUILLA }}>{n}</b><span className="opacity-65">{t}</span></p>)}</div>
        </div>
        <nav aria-label="Cocina" className="mx-auto flex max-w-7xl gap-1 px-4">
          {([["cocina", "Tickets de cocina"], ["cobros", "Cobros y entregas"], ["vitrina", "Vitrina de hoy"]] as const).map(([id, t]) => <button key={id} type="button" onClick={() => setVista(id)} aria-current={vista === id ? "page" : undefined} className="rounded-t-xl px-5 py-3 text-[1.02rem] font-extrabold" style={vista === id ? { background: CREMA, color: CACAO } : { color: "rgba(255,244,230,.7)" }}>{t}</button>)}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        {vista === "cocina" && (
          <>
            <section aria-label="Cupo de la semana" className="rounded-2xl p-4" style={{ background: CACAO2 }}>
              <h2 className="text-[1.3rem]" style={{ fontFamily: TITULO }}>Cupo de los próximos 7 días</h2>
              <ul className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-7">
                {semana.map((f) => { const u = Math.min(ocupados(pedidos, f), CUPO_DIA), cerrado = new Date(f + "T00:00").getDay() === 1; return (
                  <li key={f} className="rounded-xl p-2 text-center" style={{ background: "rgba(255,244,230,.07)" }}>
                    <p className="text-[0.8rem] font-extrabold">{f === hoy ? "Hoy" : fechaLarga(f).split(" ")[0].slice(0, 3)}</p>
                    {cerrado ? <p className="mt-1 text-[0.8rem] opacity-60">Cerrado</p> : <><p className="mt-1 text-[1.4rem] leading-none" style={{ fontFamily: TITULO, color: u >= CUPO_DIA ? "#ff9aa8" : MANTEQUILLA }}>{u}/{CUPO_DIA}</p><span className="mx-auto mt-1.5 flex w-fit gap-0.5">{Array.from({ length: CUPO_DIA }, (_, i) => <span key={i} className="h-2 w-2 rounded-full" style={{ background: i < u ? FRAMBUESA : "rgba(255,244,230,.2)" }} />)}</span></>}
                  </li>
                ); })}
              </ul>
            </section>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr_16rem]">
              <section aria-label="Por hornear">
                <h2 className="mb-3 text-[1.5rem]" style={{ fontFamily: TITULO }}>Por hornear <span className="text-[1rem] opacity-60">({porHacer.length})</span></h2>
                <div className="grid gap-4">{porHacer.map((x) => ticket(x, <Btn alTocar={() => cambiar(x.id, { estado: "listo" })} tipo="frambuesa">Ya está listo <Check size={16} /></Btn>))}{porHacer.length === 0 && <p className="opacity-60">Nada por hornear.</p>}</div>
              </section>
              <section aria-label="Listos para entregar">
                <h2 className="mb-3 text-[1.5rem]" style={{ fontFamily: TITULO }}>Listos para entregar <span className="text-[1rem] opacity-60">({listos.length})</span></h2>
                <div className="grid gap-4">{listos.map((x) => ticket(x, <Btn alTocar={() => cambiar(x.id, { estado: "entregado", pagado: x.total })} tipo="mantequilla"><Truck size={16} /> Entregado y pagado</Btn>))}{listos.length === 0 && <p className="opacity-60">Todavía ninguno.</p>}</div>
                {entregados.length > 0 && <><h3 className="mb-2 mt-6 text-[1.1rem] opacity-80" style={{ fontFamily: TITULO }}>Ya entregados</h3><ul className="grid gap-1.5 text-[0.9rem] opacity-75">{entregados.map((x) => <li key={x.id} className="flex items-center gap-2"><Check size={15} style={{ color: MENTA }} /> {x.nombre} · {por(PASTELES, x.pastel).nombre}</li>)}</ul></>}
              </section>
              <aside className="rounded-2xl p-4 lg:self-start" style={{ background: CACAO2 }}>
                <h2 className="text-[1.3rem]" style={{ fontFamily: TITULO }}>Hoja de producción</h2>
                <p className="text-[0.85rem] opacity-65">Qué hornear para hoy y los próximos 2 días, por sabor.</p>
                <ul className="mt-3 divide-y" style={{ borderColor: "rgba(255,244,230,.15)" }}>{producir.map(({ s, n, porciones }) => <li key={s.id} className="flex items-baseline justify-between gap-2 py-2.5"><b>{s.nombre}</b><span className="opacity-80">{n} · {porciones} porc.</span></li>)}{producir.length === 0 && <li className="py-3 opacity-60">Nada pendiente.</li>}</ul>
              </aside>
            </div>
          </>
        )}

        {vista === "cobros" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl p-5" style={{ background: CREMA, color: CACAO }}>
              <h2 className="text-[1.5rem]" style={{ fontFamily: TITULO }}>Saldos por cobrar</h2>
              <ul className="mt-2 divide-y" style={{ borderColor: "rgba(43,24,18,.15)" }}>
                {pedidos.filter((x) => x.total > x.pagado).sort(orden).map((x) => (
                  <li key={x.id} className="flex flex-wrap items-center gap-3 py-3"><span className="min-w-[9rem] flex-1"><b>{x.nombre}</b><span className="block text-[0.85rem] opacity-70">{por(PASTELES, x.pastel).nombre} · {fechaLarga(x.fecha)}</span></span><b className="text-[1.15rem]" style={{ color: FRAMBUESA }}>{qz(x.total - x.pagado)}</b><Btn alTocar={() => cambiar(x.id, { pagado: x.total })} tipo="mantequilla"><Check size={16} /> Cobrar saldo</Btn></li>
                ))}
                {pedidos.every((x) => x.total <= x.pagado) && <li className="py-3 opacity-60">Todo cobrado.</li>}
              </ul>
            </section>
            <section className="rounded-2xl p-5" style={{ background: CACAO2 }}>
              <h2 className="text-[1.5rem]" style={{ fontFamily: TITULO }}>Entregas a domicilio de hoy</h2>
              <ul className="mt-2 divide-y" style={{ borderColor: "rgba(255,244,230,.15)" }}>
                {pedidos.filter((x) => x.fecha === hoy && x.entrega !== "recoger").sort(orden).map((x) => <li key={x.id} className="py-3"><b className="block" style={{ color: MANTEQUILLA }}>{x.horario}</b><span className="text-[0.92rem]">{x.nombre} · {x.direccion}</span></li>)}
                {pedidos.every((x) => !(x.fecha === hoy && x.entrega !== "recoger")) && <li className="py-3 opacity-60">Hoy no hay entregas a domicilio.</li>}
              </ul>
            </section>
          </div>
        )}

        {vista === "vitrina" && (
          <section>
            <h2 className="text-[1.6rem]" style={{ fontFamily: TITULO }}>Vitrina de hoy</h2>
            <p className="opacity-70">Lo que cambie aquí se ve al instante en la tienda. Cuando llegue a cero, se marca «agotado».</p>
            <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {POSTRES.map((x) => <li key={x.id} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: CACAO2 }}><img src={x.foto} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" /><span className="min-w-0 flex-1 leading-tight"><b className="block">{x.nombre}</b><span className="text-[0.88rem] font-bold" style={{ color: vit.quedan[x.id] ? MANTEQUILLA : "#ff9aa8" }}>{vit.quedan[x.id] ? `quedan ${vit.quedan[x.id]}` : "agotado"}</span></span><Contador claro valor={vit.quedan[x.id] ?? 0} alCambiar={(n) => vit.poner(x.id, n)} /></li>)}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
