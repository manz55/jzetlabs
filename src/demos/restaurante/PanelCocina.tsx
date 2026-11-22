/*
 * Cocina de Trattoria Sole: la pantalla de cocina.
 * Identidad propia: carbón de horno, rojo tomate y aceituna sobre tickets de papel crema; Playfair Display para títulos e Inter para lo demás.
 * Lo que se ve primero: qué pedido lleva más tiempo esperando (cada ticket tiene su reloj de color). Lo que se llena: qué platillos se agotaron.
 */
import { useState, type ReactNode } from "react";
import { ArrowRight, Bell, Check, Clock, Flame, Truck } from "lucide-react";
import { MensajeWhatsApp, qz } from "../comun";

const CARBON = "#1d1512";
const CARBON2 = "#2a201b";
const CREMA = "#fbf1d8";
const TOMATE = "#c4352a";
const OLIVA = "#7d8a45";
const AMBAR = "#e0a02a";
const TITULO = "'Playfair Display', Georgia, serif";
const CUERPO = "'Inter', 'Instrument Sans', system-ui, sans-serif";

type Tipo = "Domicilio" | "Recoger" | "Mesa";
type Estado = "nuevo" | "horno" | "listo";
type Orden = { id: string; num: number; tipo: Tipo; quien: string; tel: string; min: number; estado: Estado; items: [number, string, string?][]; total: number; pago: string; repartidor?: string };
const ORDENES: Orden[] = [
  { id: "a", num: 118, tipo: "Domicilio", quien: "Carolina Méndez", tel: "5544 1290", min: 3, estado: "nuevo", items: [[1, "Pizza margarita"], [1, "Tiramisú"]], total: 155, pago: "Tarjeta" },
  { id: "b", num: 117, tipo: "Mesa", quien: "Mesa 4", tel: "", min: 7, estado: "nuevo", items: [[2, "Penne a la boloñesa", "sin cebolla"], [1, "Ensalada caprese"], [2, "Limonada con hierbabuena"]], total: 295, pago: "En mesa" },
  { id: "c", num: 116, tipo: "Recoger", quien: "Andrés Pineda", tel: "3390 1245", min: 14, estado: "horno", items: [[1, "Pizza pepperoni", "extra queso"], [1, "Pan de ajo con queso"]], total: 155, pago: "Efectivo" },
  { id: "d", num: 115, tipo: "Domicilio", quien: "Lucía Barrios", tel: "5032 7710", min: 22, estado: "horno", items: [[1, "Fettuccine Alfredo con pollo"], [1, "Pasta al pesto"], [2, "Té frío de la casa"]], total: 230, pago: "Efectivo", repartidor: "Memo" },
  { id: "e", num: 114, tipo: "Domicilio", quien: "Sofía Ramírez", tel: "4120 8855", min: 9, estado: "listo", items: [[2, "Pizza cuatro quesos"]], total: 250, pago: "Tarjeta", repartidor: "Chepe" },
  { id: "f", num: 113, tipo: "Recoger", quien: "Mario Castillo", tel: "5598 4410", min: 4, estado: "listo", items: [[1, "Spaghetti pomodoro"], [1, "Panna cotta"]], total: 125, pago: "Efectivo" },
];
const PLATILLOS = ["Bruschetta de tomate", "Ensalada caprese", "Penne a la boloñesa", "Spaghetti pomodoro", "Pasta al pesto", "Fettuccine Alfredo", "Pizza margarita", "Pizza pepperoni", "Pizza cuatro quesos", "Tiramisú", "Panna cotta", "Pappardelle con hongos (del día)"];
const COLUMNAS: { id: Estado; t: string; sub: string; boton: string; color: string }[] = [
  { id: "nuevo", t: "Nuevos", sub: "Recién entraron", boton: "A cocinar", color: AMBAR },
  { id: "horno", t: "En preparación", sub: "En el horno o la plancha", boton: "Ya está listo", color: TOMATE },
  { id: "listo", t: "Listos", sub: "Esperan al mesero o al repartidor", boton: "", color: OLIVA },
];

function Btn({ children, alTocar, color = TOMATE, ancho = false }: { children: ReactNode; alTocar: () => void; color?: string; ancho?: boolean }) {
  return <button type="button" onClick={alTocar} className={`inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[0.95rem] font-bold text-white transition hover:brightness-110 active:scale-[0.98] ${ancho ? "w-full" : ""}`} style={{ background: color }}>{children}</button>;
}

export default function PanelCocina() {
  const [ordenes, setOrdenes] = useState(ORDENES);
  const [agotados, setAgotados] = useState<string[]>(["Tiramisú"]);
  const [abierto, setAbierto] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const avanzar = (id: string) => setOrdenes((l) => l.map((o) => (o.id === id ? { ...o, estado: o.estado === "nuevo" ? "horno" : "listo" } : o)));
  const activos = ordenes.filter((o) => o.estado !== "listo");
  const promedio = Math.round(ordenes.reduce((s, o) => s + o.min, 0) / ordenes.length);
  const ventas = 4820 + ordenes.reduce((s, o) => s + o.total, 0);
  const reloj = (m: number) => (m >= 20 ? { c: "#ff6b5b", t: "¡tarde!" } : m >= 12 ? { c: AMBAR, t: "va lento" } : { c: "#8fd19a", t: "a tiempo" });
  const porTipo = (t: Tipo) => ordenes.filter((o) => o.tipo === t).reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-[calc(100vh-8rem)]" style={{ background: CARBON, color: CREMA, fontFamily: CUERPO }}>
      <header className="border-b" style={{ borderColor: "rgba(251,241,216,.15)" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4">
          <div><p className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] opacity-60">Panel de cocina</p><h1 className="flex items-center gap-2 text-[2.4rem] italic leading-none" style={{ fontFamily: TITULO }}><Flame size={30} style={{ color: TOMATE }} /> Trattoria Sole</h1></div>
          <div className="ml-auto flex flex-wrap items-center gap-x-8 gap-y-2">
            {[[String(activos.length), "pedidos activos", AMBAR], [`${promedio} min`, "espera promedio", promedio > 12 ? "#ff6b5b" : "#8fd19a"], [qz(ventas), "ventas de hoy", CREMA]].map(([n, t, c]) => <p key={t}><b className="block text-[1.8rem] leading-none" style={{ fontFamily: TITULO, color: c }}>{n}</b><span className="text-[0.78rem] opacity-60">{t}</span></p>)}
            <button type="button" role="switch" aria-checked={abierto} onClick={() => setAbierto((v) => !v)} className="flex min-h-[2.75rem] items-center gap-3 rounded-full border-2 px-4 font-bold" style={{ borderColor: abierto ? OLIVA : TOMATE, color: abierto ? "#b9c97a" : "#ff8a7a" }}><span className="h-3 w-3 rounded-full" style={{ background: abierto ? OLIVA : TOMATE }} /> {abierto ? "Aceptando pedidos" : "Pausa: no se aceptan pedidos"}</button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-5 py-5 xl:grid-cols-[1fr_19rem]">
        <div className="grid gap-4 md:grid-cols-3">
          {COLUMNAS.map((c) => {
            const lista = ordenes.filter((o) => o.estado === c.id).sort((a, b) => b.min - a.min);
            return (
              <section key={c.id} aria-label={c.t} className="rounded-2xl p-3" style={{ background: CARBON2 }}>
                <h2 className="px-1 pb-0.5 text-[1.5rem] italic" style={{ fontFamily: TITULO, color: c.color }}>{c.t} <span className="rounded-full px-2 text-[0.9rem] not-italic" style={{ background: c.color, color: CARBON }}>{lista.length}</span></h2>
                <p className="px-1 pb-3 text-[0.8rem] opacity-60">{c.sub}</p>
                <div className="grid gap-3">
                  {lista.map((o) => {
                    const r = reloj(o.min);
                    return (
                      <article key={o.id} className="overflow-hidden rounded-lg" style={{ background: CREMA, color: CARBON }}>
                        <div className="flex items-center justify-between px-3 py-2 text-white" style={{ background: c.color }}>
                          <b className="text-[1.15rem]" style={{ fontFamily: TITULO }}>#{o.num} · {o.tipo}</b>
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.82rem] font-bold" style={{ background: CARBON, color: r.c }}><Clock size={13} /> {o.min} min · {r.t}</span>
                        </div>
                        <div className="p-3">
                          <p className="font-bold">{o.quien}</p>
                          <ul className="mt-1.5 grid gap-1 text-[0.95rem]">{o.items.map(([n, t, nota], i) => <li key={i}><b>{n}×</b> {t}{nota && <span className="ml-1 rounded px-1.5 py-0.5 text-[0.75rem] font-bold text-white" style={{ background: TOMATE }}>{nota}</span>}</li>)}</ul>
                          <p className="mt-2 flex justify-between border-t border-dashed pt-2 text-[0.85rem]" style={{ borderColor: "rgba(29,21,18,.3)" }}><span>{o.pago}{o.repartidor ? ` · ${o.repartidor}` : ""}</span><b>{qz(o.total)}</b></p>
                          <div className="mt-2 grid gap-2">
                            {c.boton && <Btn alTocar={() => avanzar(o.id)} color={c.color} ancho>{c.boton} <ArrowRight size={16} /></Btn>}
                            {c.id === "listo" && o.tipo !== "Mesa" && <Btn alTocar={() => setMsg(o.tipo === "Domicilio" ? `Hola, ${o.quien.split(" ")[0]}. Tu pedido #${o.num} de Trattoria Sole ya salió${o.repartidor ? ` con ${o.repartidor}` : ""}. Llega en unos 20 minutos. ¡Buen provecho!` : `Hola, ${o.quien.split(" ")[0]}. Tu pedido #${o.num} de Trattoria Sole ya está listo para recoger. Te esperamos.`)} color={OLIVA} ancho>{o.tipo === "Domicilio" ? <Truck size={16} /> : <Bell size={16} />} {o.tipo === "Domicilio" ? "Avisar que salió" : "Avisar que ya está listo"}</Btn>}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                  {lista.length === 0 && <p className="rounded-lg border-2 border-dashed p-4 text-center opacity-50" style={{ borderColor: "rgba(251,241,216,.3)" }}>Ninguno</p>}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="grid content-start gap-5">
          <section className="rounded-2xl p-4" style={{ background: CARBON2 }}>
            <h2 className="text-[1.3rem] italic" style={{ fontFamily: TITULO }}>Platillos agotados</h2>
            <p className="text-[0.82rem] opacity-60">Marque lo que se acabó y deja de ofrecerse en la página.</p>
            <ul className="mt-3 grid gap-1.5">
              {PLATILLOS.map((p) => { const ag = agotados.includes(p); return (
                <li key={p}><button type="button" role="switch" aria-checked={ag} onClick={() => setAgotados((l) => (ag ? l.filter((x) => x !== p) : [...l, p]))} className="flex min-h-[2.75rem] w-full items-center gap-3 rounded-lg px-3 text-left" style={ag ? { background: "rgba(196,53,42,.25)", boxShadow: `inset 0 0 0 1.5px ${TOMATE}` } : { background: "rgba(251,241,216,.06)" }}>
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded" style={{ background: ag ? TOMATE : "transparent", border: `2px solid ${ag ? TOMATE : "rgba(251,241,216,.5)"}` }}>{ag && <Check size={13} />}</span>
                  <span className={`flex-1 text-[0.92rem] ${ag ? "line-through opacity-70" : ""}`}>{p}</span>{ag && <span className="text-[0.72rem] font-bold uppercase" style={{ color: "#ff8a7a" }}>agotado</span>}
                </button></li>
              ); })}
            </ul>
          </section>
          <section className="rounded-2xl p-4" style={{ background: CARBON2 }}>
            <h2 className="text-[1.3rem] italic" style={{ fontFamily: TITULO }}>Caja de hoy</h2>
            <dl className="mt-2 grid grid-cols-2 gap-y-1.5 text-[0.95rem]">{(["Domicilio", "Recoger", "Mesa"] as Tipo[]).map((t) => <div key={t} className="contents"><dt className="opacity-70">{t}</dt><dd className="text-right font-bold tabular-nums">{qz(porTipo(t))}</dd></div>)}<dt className="border-t pt-1.5 font-bold" style={{ borderColor: "rgba(251,241,216,.2)" }}>Pedidos en pantalla</dt><dd className="border-t pt-1.5 text-right text-[1.2rem] font-bold" style={{ borderColor: "rgba(251,241,216,.2)", color: AMBAR }}>{qz(ordenes.reduce((s, o) => s + o.total, 0))}</dd></dl>
          </section>
        </aside>
      </main>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="restaurante" que="el aviso" />
    </div>
  );
}
