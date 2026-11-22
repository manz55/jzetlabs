/*
 * Taller de Nómada Studio: el tablero de prendas.
 * Identidad propia: arena, terracota y verde militar; Archivo Black para títulos y Work Sans para lo demás.
 * Lo que se ve primero: la matriz de tallas (qué talla de qué prenda se acabó). Lo que se llena: cuántas piezas entraron y la guía de cada envío.
 */
import { useState, type ReactNode } from "react";
import { Check, Minus, Package, Plus, Send } from "lucide-react";
import { MensajeWhatsApp, qz } from "../comun";

const ARENA = "#dcd9d2";
const VERDE = "#141210";
const TERRA = "#e8470f";
const OLIVA = "#55603a";
const AMBAR = "#c9861a";
const TITULO = "'Bricolage Grotesque', 'Instrument Sans', sans-serif";
const CUERPO = "'Instrument Sans', system-ui, sans-serif";

const PRENDAS = [
  { id: "playera", n: "Playera básica", p: 129, tallas: ["S", "M", "L", "XL"], stock: [6, 3, 0, 2] },
  { id: "camisa", n: "Camisa de franela", p: 279, tallas: ["S", "M", "L", "XL"], stock: [2, 4, 1, 0] },
  { id: "jeans", n: "Jeans rectos", p: 349, tallas: ["28", "30", "32", "34", "36"], stock: [1, 3, 5, 2, 0] },
  { id: "sueter", n: "Suéter tejido", p: 299, tallas: ["S", "M", "L"], stock: [3, 2, 2] },
  { id: "chaqueta", n: "Chaqueta pintada", p: 690, tallas: ["M", "L"], stock: [1, 1] },
];
const PEDIDOS_INICIAL = [
  { id: "p1", num: 54, quien: "Ana Lucía Cruz", tel: "5544 1290", via: "Instagram", items: "Playera M + Jeans 30", total: 478, envio: "Capital", estado: 0 },
  { id: "p2", num: 53, quien: "Daniel Pérez", tel: "4478 3321", via: "WhatsApp", items: "Chaqueta pintada L", total: 725, envio: "Quetzaltenango", estado: 1 },
  { id: "p3", num: 52, quien: "Paola Sierra", tel: "5021 9087", via: "Página", items: "Suéter S + Camisa M", total: 613, envio: "Capital", estado: 2 },
];
const PASOS = ["Por empacar", "En camino", "Entregado"];

function Btn({ children, alTocar, color = VERDE, ancho = false }: { children: ReactNode; alTocar: () => void; color?: string; ancho?: boolean }) {
  return <button type="button" onClick={alTocar} className={`inline-flex min-h-[2.75rem] items-center justify-center gap-2 px-4 py-2 text-[0.88rem] font-bold uppercase tracking-wide text-white transition hover:brightness-110 active:translate-y-px ${ancho ? "w-full" : ""}`} style={{ background: color }}>{children}</button>;
}

export default function PanelRopa() {
  const [stock, setStock] = useState(PRENDAS.map((p) => [...p.stock]));
  const [sel, setSel] = useState<[number, number] | null>(null);
  const [pedidos, setPedidos] = useState(PEDIDOS_INICIAL);
  const [guias, setGuias] = useState<Record<string, string>>({});
  const [cambio, setCambio] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const total = stock.flat().reduce((a, b) => a + b, 0);
  const agotadas = stock.flat().filter((n) => n === 0).length;
  const mover = (i: number, j: number, d: number) => setStock((s) => s.map((fila, a) => (a === i ? fila.map((n, b) => (b === j ? Math.max(0, n + d) : n)) : fila)));
  const color = (n: number) => (n === 0 ? "#b3261e" : n <= 2 ? AMBAR : OLIVA);
  const vendido = pedidos.reduce((s, p) => s + p.total, 0);

  return (
    <div className="panel-demo min-h-[calc(100vh-8rem)]" style={{ background: ARENA, color: VERDE, fontFamily: CUERPO }}>
      <header style={{ background: VERDE }} className="text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end gap-x-8 gap-y-3 px-5 py-5">
          <div><p className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] opacity-60">Panel de la tienda</p><h1 className="text-[2.6rem] uppercase leading-none" style={{ fontFamily: TITULO }}>Nómada Studio</h1></div>
          <div className="ml-auto flex flex-wrap gap-x-8 gap-y-1">{[[String(total), "piezas en stock"], [String(agotadas), "tallas agotadas"], [qz(vendido), "pedidos abiertos"]].map(([n, t]) => <p key={t}><b className="block text-[1.9rem] leading-none" style={{ fontFamily: TITULO, color: "#f0c58a" }}>{n}</b><span className="text-[0.78rem] opacity-65">{t}</span></p>)}</div>
        </div>
        <div className="h-2" style={{ background: `repeating-linear-gradient(90deg, ${TERRA} 0 40px, ${OLIVA} 40px 80px, ${AMBAR} 80px 120px)` }} aria-hidden />
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-5 py-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <section className="min-w-0">
          <h2 className="text-[1.6rem] uppercase" style={{ fontFamily: TITULO }}>Qué talla queda</h2>
          <p className="opacity-75">Toque una cantidad para sumar o restar. En rojo, lo que ya no hay.</p>
          <div className="mt-3 overflow-x-auto bg-white p-3" style={{ border: `2.5px solid ${VERDE}` }}>
            <table className="w-full min-w-[30rem] text-center">
              <thead><tr className="text-[0.72rem] font-bold uppercase tracking-wider opacity-60"><th className="p-2 text-left">Prenda</th>{["S / 28", "M / 30", "L / 32", "XL / 34", "36"].map((t) => <th key={t}>{t}</th>)}</tr></thead>
              <tbody>
                {PRENDAS.map((p, i) => (
                  <tr key={p.id} className="border-t" style={{ borderColor: "rgba(47,58,34,.15)" }}>
                    <td className="p-2 text-left"><b className="block leading-tight">{p.n}</b><span className="text-[0.8rem] opacity-60">{qz(p.p)}</span></td>
                    {[0, 1, 2, 3, 4].map((j) => (
                      <td key={j} className="p-1.5">{j < p.tallas.length ? (
                        <button type="button" onClick={() => setSel([i, j])} aria-label={`${p.n} talla ${p.tallas[j]}: ${stock[i][j]}`} className="mx-auto grid h-12 w-12 place-items-center text-[1.3rem] font-bold text-white" style={{ background: color(stock[i][j]), outline: sel?.[0] === i && sel?.[1] === j ? `3px solid ${VERDE}` : "none", outlineOffset: 2, fontFamily: TITULO }}>{stock[i][j]}</button>
                      ) : <span className="opacity-20">·</span>}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {sel && (
              <div className="mt-3 flex flex-wrap items-center gap-3 p-3" style={{ background: ARENA }}>
                <b>{PRENDAS[sel[0]].n} · talla {PRENDAS[sel[0]].tallas[sel[1]]}</b>
                <span className="ml-auto flex items-center gap-2"><button type="button" aria-label="Una menos" onClick={() => mover(sel[0], sel[1], -1)} className="grid h-11 w-11 place-items-center border-2" style={{ borderColor: VERDE }}><Minus size={18} /></button><b className="w-8 text-center text-[1.4rem]" style={{ fontFamily: TITULO }}>{stock[sel[0]][sel[1]]}</b><button type="button" aria-label="Una más" onClick={() => mover(sel[0], sel[1], 1)} className="grid h-11 w-11 place-items-center text-white" style={{ background: VERDE }}><Plus size={18} /></button></span>
                {stock[sel[0]][sel[1]] === 0 && <span className="w-full text-[0.9rem] font-bold" style={{ color: "#b3261e" }}>Agotada: ya no se ofrece esta talla en la página.</span>}
              </div>
            )}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="bg-white p-4" style={{ border: `2.5px solid ${VERDE}` }}>
              <h3 className="text-[1.15rem] uppercase" style={{ fontFamily: TITULO }}>Apartados</h3>
              <ul className="mt-2 divide-y" style={{ borderColor: "rgba(47,58,34,.15)" }}><li className="py-2 text-[0.92rem]"><b>Karla M.</b> · Chaqueta pintada M<span className="block" style={{ color: TERRA }}>Vence en 2 días · abonó {qz(200)}</span></li><li className="py-2 text-[0.92rem]"><b>Lucía P.</b> · Jeans 32<span className="block opacity-70">Vence en 5 días · abonó {qz(100)}</span></li></ul>
            </div>
            <div className="bg-white p-4" style={{ border: `2.5px solid ${VERDE}` }}>
              <h3 className="text-[1.15rem] uppercase" style={{ fontFamily: TITULO }}>Cambios y devoluciones</h3>
              <p className="mt-2 text-[0.92rem]"><b>Rodrigo A.</b> pide cambiar camisa S por M.</p>
              {cambio ? <p className="mt-2 flex items-center gap-2 font-bold" style={{ color: OLIVA }}><Check size={17} /> Cambio aceptado</p> : <div className="mt-2"><Btn alTocar={() => setCambio(true)} color={OLIVA}><Check size={15} /> Aceptar cambio</Btn></div>}
            </div>
          </div>
        </section>

        <section aria-label="Pedidos" className="min-w-0">
          <h2 className="text-[1.6rem] uppercase" style={{ fontFamily: TITULO }}>Pedidos de hoy</h2>
          <p className="opacity-75">Cada mensaje de Instagram o WhatsApp se vuelve un pedido con su paso.</p>
          <ul className="mt-3 grid gap-3">
            {pedidos.map((p) => (
              <li key={p.id} className="bg-white p-4" style={{ border: `2.5px solid ${VERDE}` }}>
                <div className="flex items-start justify-between gap-2"><div><b className="text-[1.15rem]" style={{ fontFamily: TITULO }}>#{p.num} · {p.quien}</b><p className="text-[0.88rem] opacity-70">{p.items}</p><p className="text-[0.82rem] opacity-60">{p.via} · envío {p.envio}</p></div><b className="tabular-nums">{qz(p.total)}</b></div>
                <div className="mt-2 flex gap-1" aria-hidden>{PASOS.map((_, i) => <span key={i} className="h-2 flex-1" style={{ background: i <= p.estado ? OLIVA : "rgba(47,58,34,.15)" }} />)}</div>
                <p className="mt-1 text-[0.85rem] font-bold uppercase" style={{ color: p.estado === 0 ? TERRA : OLIVA }}>{PASOS[p.estado]}</p>
                {p.estado === 0 && <label className="mt-2 block text-[0.85rem] font-bold">Guía del envío<input value={guias[p.id] ?? ""} onChange={(e) => setGuias((g) => ({ ...g, [p.id]: e.target.value }))} placeholder="Ej. 8840 2211" className="mt-1 w-full border-2 bg-white px-3 py-2.5 font-normal" style={{ borderColor: VERDE }} /></label>}
                <div className="mt-3 grid gap-2">
                  {p.estado < 2 && <Btn alTocar={() => { setPedidos((l) => l.map((x) => (x.id === p.id ? { ...x, estado: x.estado + 1 } : x))); if (p.estado === 0) setMsg(`Hola, ${p.quien.split(" ")[0]}. Tu pedido #${p.num} de Nómada Studio ya salió. Tu guía de envío es ${guias[p.id] || "8840 2211"}. Llega en 1 o 2 días hábiles. ¡Gracias!`); }} color={p.estado === 0 ? TERRA : VERDE} ancho>{p.estado === 0 ? <><Package size={16} /> Empacado: mandar guía</> : <><Check size={16} /> Ya lo recibió</>}</Btn>}
                  {p.estado === 2 && <Btn alTocar={() => setMsg(`Hola, ${p.quien.split(" ")[0]}. ¿Cómo te quedó tu pedido de Nómada Studio? Si te gustó, ¿nos dejas una reseña? Y si algo no te quedó, te lo cambiamos sin costo.`)} color={OLIVA} ancho><Send size={16} /> Pedir reseña</Btn>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="tienda de ropa" que="el aviso" />
    </div>
  );
}
