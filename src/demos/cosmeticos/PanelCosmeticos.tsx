/*
 * Trastienda de Ámbar Cosmetics: la vitrina de tonos.
 * Identidad propia: ámbar, mocca y rosa palo; Playfair Display para títulos y DM Sans para lo demás.
 * Lo que se ve primero: la vitrina de tonos (cuáles se acabaron) y los cursos con cupo. Lo que se llena: las existencias de cada tono y las inscritas.
 */
import { useState, type ReactNode } from "react";
import { Check, Minus, Plus, Send } from "lucide-react";
import { MensajeWhatsApp, qz } from "../comun";

const MOCCA = "#3b241b";
const AMBAR = "#d98a2b";
const ROSA = "#f3d3cb";
const CREMA = "#fff6ef";
const OK = "#3f7a4d";
const ROJO = "#b23a3a";
const TITULO = "'Playfair Display', Georgia, serif";
const CUERPO = "'DM Sans', 'Instrument Sans', system-ui, sans-serif";

const TONOS = [
  { id: "t1", n: "Porcelana", hex: "#f2d9c6", s: 8 }, { id: "t2", n: "Marfil", hex: "#ecc9a8", s: 6 }, { id: "t3", n: "Arena", hex: "#dcae84", s: 2 },
  { id: "t4", n: "Miel", hex: "#c68f5f", s: 5 }, { id: "t5", n: "Canela", hex: "#a8703f", s: 0 }, { id: "t6", n: "Caramelo", hex: "#905a30", s: 3 },
  { id: "t7", n: "Cacao", hex: "#6f4226", s: 1 }, { id: "t8", n: "Café", hex: "#52301c", s: 4 }, { id: "t9", n: "Ébano", hex: "#3a2114", s: 2 },
];
const CURSOS = [
  { id: "c1", n: "Automaquillaje: piel y ojos", fecha: "Sáb 29 nov · 9:00", cupo: 8, inscritas: ["Carolina M.", "Lucía P.", "Andrea S.", "Karla O.", "Mónica R.", "Paola C.", "Gaby L."], precio: 350 },
  { id: "c2", n: "Maquillaje social para eventos", fecha: "Sáb 6 dic · 14:00", cupo: 8, inscritas: ["Sofía H.", "Daniela T."], precio: 450 },
];
const PEDIDOS_INICIAL = [
  { id: "p1", quien: "Ana Lucía Cruz", tel: "5544 1290", items: "Base líquida Miel + corrector Marfil", total: 395, estado: 0 },
  { id: "p2", quien: "Rosa María Pérez", tel: "4478 3321", items: "Kit de brochas + iluminador", total: 310, estado: 1 },
  { id: "p3", quien: "Daniela Ortiz", tel: "5021 9087", items: "Base líquida Cacao", total: 240, estado: 2 },
];
const PASOS = ["Por preparar", "Enviado", "Entregado"];
const FRECUENTES = [{ n: "Carolina M.", d: "5 compras · base Miel" }, { n: "Lucía P.", d: "4 compras · tono Marfil" }, { n: "Karla O.", d: "3 compras y 2 cursos" }];

function Btn({ children, alTocar, color = MOCCA, ancho = false }: { children: ReactNode; alTocar: () => void; color?: string; ancho?: boolean }) {
  return <button type="button" onClick={alTocar} className={`inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-full px-5 py-2 text-[0.92rem] font-bold text-white transition hover:brightness-110 active:scale-[0.97] ${ancho ? "w-full" : ""}`} style={{ background: color }}>{children}</button>;
}

export default function PanelCosmeticos() {
  const [tonos, setTonos] = useState(TONOS);
  const [sel, setSel] = useState<string | null>(null);
  const [cursos, setCursos] = useState(CURSOS);
  const [pedidos, setPedidos] = useState(PEDIDOS_INICIAL);
  const [msg, setMsg] = useState<string | null>(null);
  const t = tonos.find((x) => x.id === sel);
  const ajustar = (id: string, d: number) => setTonos((l) => l.map((x) => (x.id === id ? { ...x, s: Math.max(0, x.s + d) } : x)));
  const agotados = tonos.filter((x) => x.s === 0).length;

  return (
    <div className="min-h-[calc(100vh-8rem)]" style={{ background: CREMA, color: MOCCA, fontFamily: CUERPO }}>
      <header style={{ background: MOCCA }} className="text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end gap-x-8 gap-y-3 px-5 py-5">
          <div><p className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] opacity-60">Panel del dueño</p><h1 className="text-[2.6rem] italic leading-none" style={{ fontFamily: TITULO }}>Ámbar Cosmetics</h1></div>
          <div className="ml-auto flex flex-wrap gap-x-8 gap-y-1">{[[String(tonos.reduce((s, x) => s + x.s, 0)), "bases en stock"], [String(agotados), "tonos agotados"], [String(cursos.reduce((s, c) => s + c.inscritas.length, 0)), "inscritas a cursos"]].map(([n, tx]) => <p key={tx}><b className="block text-[1.9rem] leading-none" style={{ fontFamily: TITULO, color: AMBAR }}>{n}</b><span className="text-[0.78rem] opacity-65">{tx}</span></p>)}</div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="grid content-start gap-6">
          <section>
            <h2 className="text-[1.6rem] italic" style={{ fontFamily: TITULO }}>Base líquida: existencias por tono</h2>
            <p className="opacity-75">Cada círculo es un tono. El anillo rojo es que ya no hay.</p>
            <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {tonos.map((x) => (
                <li key={x.id}><button type="button" onClick={() => setSel(x.id)} aria-pressed={sel === x.id} className="flex w-full flex-col items-center gap-1.5 rounded-2xl p-2.5 transition active:scale-[0.97]" style={{ background: sel === x.id ? ROSA : "#fff", border: `2px solid ${sel === x.id ? AMBAR : "rgba(59,36,27,.12)"}` }}>
                  <span className="grid h-14 w-14 place-items-center rounded-full text-[1.2rem] font-bold" style={{ background: x.hex, color: x.s === 0 ? "#fff" : "rgba(0,0,0,.6)", boxShadow: x.s === 0 ? `0 0 0 4px ${ROJO}` : x.s <= 2 ? `0 0 0 4px ${AMBAR}` : "none" }}>{x.s}</span>
                  <span className="text-[0.85rem] font-bold">{x.n}</span>
                  <span className="text-[0.7rem] font-bold uppercase" style={{ color: x.s === 0 ? ROJO : x.s <= 2 ? AMBAR : OK }}>{x.s === 0 ? "agotado" : x.s <= 2 ? "se acaba" : "hay"}</span>
                </button></li>
              ))}
            </ul>
            {t && <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl p-3" style={{ background: ROSA }}><b>{t.n}</b><span className="ml-auto flex items-center gap-2"><button type="button" aria-label="Una menos" onClick={() => ajustar(t.id, -1)} className="grid h-11 w-11 place-items-center rounded-full border-2" style={{ borderColor: MOCCA }}><Minus size={18} /></button><b className="w-8 text-center text-[1.4rem]" style={{ fontFamily: TITULO }}>{t.s}</b><button type="button" aria-label="Una más" onClick={() => ajustar(t.id, 1)} className="grid h-11 w-11 place-items-center rounded-full text-white" style={{ background: MOCCA }}><Plus size={18} /></button></span>{t.s === 0 && <Btn alTocar={() => setMsg(`Buen día. Le escribe Ámbar Cosmetics. Necesitamos 12 unidades de base líquida en tono ${t.n}. ¿Cuándo nos las pueden entregar?`)} color={ROJO}>Pedir al proveedor</Btn>}</div>}
          </section>

          <section>
            <h2 className="text-[1.6rem] italic" style={{ fontFamily: TITULO }}>Pedidos</h2>
            <ul className="mt-3 grid gap-3">
              {pedidos.map((p) => (
                <li key={p.id} className="rounded-2xl bg-white p-4" style={{ border: "2px solid rgba(59,36,27,.12)" }}>
                  <div className="flex items-start justify-between gap-2"><div><b>{p.quien}</b><p className="text-[0.9rem] opacity-75">{p.items}</p></div><b className="tabular-nums">{qz(p.total)}</b></div>
                  <div className="mt-2 flex gap-1" aria-hidden>{PASOS.map((_, i) => <span key={i} className="h-2 flex-1 rounded-full" style={{ background: i <= p.estado ? AMBAR : "rgba(59,36,27,.12)" }} />)}</div>
                  <p className="mt-1 text-[0.85rem] font-bold" style={{ color: p.estado === 2 ? OK : MOCCA }}>{PASOS[p.estado]}</p>
                  {p.estado < 2 && <div className="mt-2"><Btn alTocar={() => { setPedidos((l) => l.map((x) => (x.id === p.id ? { ...x, estado: x.estado + 1 } : x))); if (p.estado === 0) setMsg(`Hola, ${p.quien.split(" ")[0]}. Tu pedido de Ámbar Cosmetics ya salió. Llega mañana. ¡Gracias por elegirnos!`); }} color={AMBAR}>{p.estado === 0 ? "Marcar como enviado" : "Ya lo recibió"}</Btn></div>}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="grid content-start gap-6">
          <section>
            <h2 className="text-[1.6rem] italic" style={{ fontFamily: TITULO }}>Cursos con cupo</h2>
            <div className="mt-3 grid gap-3">
              {cursos.map((c) => { const llenos = c.inscritas.length, quedan = c.cupo - llenos; return (
                <article key={c.id} className="rounded-2xl bg-white p-4" style={{ border: `2px solid ${quedan === 0 ? OK : "rgba(59,36,27,.12)"}` }}>
                  <p className="text-[1.25rem] italic leading-tight" style={{ fontFamily: TITULO }}>{c.n}</p><p className="text-[0.88rem] opacity-70">{c.fecha} · {qz(c.precio)}</p>
                  <div className="mt-2 flex gap-1" aria-label={`${llenos} de ${c.cupo} lugares`}>{Array.from({ length: c.cupo }, (_, i) => <span key={i} className="h-6 flex-1 rounded" style={{ background: i < llenos ? AMBAR : "rgba(59,36,27,.12)" }} />)}</div>
                  <p className="mt-1 text-[0.88rem] font-bold" style={{ color: quedan <= 1 ? ROJO : MOCCA }}>{quedan === 0 ? "Cupo lleno" : `Quedan ${quedan} lugares`}</p>
                  <p className="mt-1 text-[0.82rem] opacity-65">{c.inscritas.join(", ")}</p>
                  <div className="mt-3 flex flex-wrap gap-2"><Btn alTocar={() => setCursos((l) => l.map((x) => (x.id === c.id && x.inscritas.length < x.cupo ? { ...x, inscritas: [...x.inscritas, `Nueva ${x.inscritas.length + 1}`] } : x)))} color={AMBAR}><Plus size={15} /> Inscribir a una clienta</Btn><Btn alTocar={() => setMsg(`Hola. Te recordamos tu curso «${c.n}» de Ámbar Cosmetics: ${c.fecha}. Lleva tu cara limpia y ganas de aprender. Si no puedes venir, avísanos para darle tu lugar a otra persona.`)} color={MOCCA}><Send size={15} /> Recordar</Btn></div>
                </article>
              ); })}
            </div>
          </section>
          <section className="rounded-2xl p-4" style={{ background: ROSA }}>
            <h2 className="text-[1.3rem] italic" style={{ fontFamily: TITULO }}>Clientas frecuentes</h2>
            <ul className="mt-2 grid gap-1.5">{FRECUENTES.map((f) => <li key={f.n} className="flex items-center gap-2 text-[0.92rem]"><Check size={15} style={{ color: OK }} /> <b>{f.n}</b> <span className="opacity-70">· {f.d}</span></li>)}</ul>
          </section>
        </aside>
      </main>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="tienda de cosméticos" que="el mensaje" />
    </div>
  );
}
