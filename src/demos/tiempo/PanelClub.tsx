/*
 * Oficina de Costa Serena Club: el calendario anual de semanas.
 * Identidad propia: azul mar profundo, turquesa, coral de atardecer y arena; Cormorant Garamond para los títulos e Inter para lo demás.
 * Lo que se ve primero: el año completo en 48 casillas (qué semanas están libres, apartadas o en mantenimiento). Lo que se llena: el apartado de cada socio y su cuota.
 */
import { useState, type ReactNode } from "react";
import { Check, Send } from "lucide-react";
import { MensajeWhatsApp, qz } from "../comun";

const MAR = "#0b3a4a";
const TURQ = "#12a3a8";
const CORAL = "#ef6f4f";
const ARENA = "#f6ead2";
const SAL = "#fdf7ea";
const OK = "#2f8f63";
const TITULO = "'Cormorant Garamond', Georgia, serif";
const CUERPO = "'Inter', 'Instrument Sans', system-ui, sans-serif";
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const ALTA = new Set([2, 3, 11]);

type Estado = "libre" | "apartada" | "mantenimiento";
const SOCIOS = [
  { id: "s1", n: "Familia Méndez", plan: "Todo el año", cuota: 742, al: true, villa: "Villa Mar" },
  { id: "s2", n: "Carlos y Andrea Ruiz", plan: "Semana flexible", cuota: 375, al: true, villa: "Casita Jardín" },
  { id: "s3", n: "Familia Herrera", plan: "Todo el año", cuota: 742, al: false, villa: "Villa Mar" },
  { id: "s4", n: "Daniel Pérez", plan: "Semana flexible", cuota: 375, al: false, villa: "Casita Jardín" },
  { id: "s5", n: "Familia Castillo", plan: "Todo el año", cuota: 742, al: true, villa: "Villa Mar" },
];
const APARTADAS: Record<string, string> = { "0-0": "s1", "0-1": "s1", "1-3": "s2", "2-2": "s3", "2-3": "s5", "3-0": "s1", "5-2": "s2", "6-0": "s5", "6-1": "s5", "7-3": "s4", "10-0": "s1", "11-1": "s3", "11-2": "s1" };
const MANT = new Set(["4-1", "9-2"]);

function Btn({ children, alTocar, color = MAR, ancho = false }: { children: ReactNode; alTocar: () => void; color?: string; ancho?: boolean }) {
  return <button type="button" onClick={alTocar} className={`inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-full px-5 py-2 text-[0.92rem] font-semibold text-white transition hover:brightness-110 active:scale-[0.97] ${ancho ? "w-full" : ""}`} style={{ background: color }}>{children}</button>;
}

export default function PanelClub() {
  const [vista, setVista] = useState<"calendario" | "socios" | "unidades">("calendario");
  const [semanas, setSemanas] = useState<Record<string, string>>(APARTADAS);
  const [mant, setMant] = useState(MANT);
  const [sel, setSel] = useState<string | null>(null);
  const [socios, setSocios] = useState(SOCIOS);
  const [socio, setSocio] = useState("s2");
  const [msg, setMsg] = useState<string | null>(null);

  const estado = (k: string): Estado => (mant.has(k) ? "mantenimiento" : semanas[k] ? "apartada" : "libre");
  const nombre = (id: string) => socios.find((s) => s.id === id)?.n ?? "";
  const todas = Array.from({ length: 48 }, (_, i) => `${Math.floor(i / 4)}-${i % 4}`);
  const n = (e: Estado) => todas.filter((k) => estado(k) === e).length;
  const atrasadas = socios.filter((s) => !s.al);
  const porCobrar = atrasadas.reduce((a, s) => a + s.cuota, 0);
  const fondo = (e: Estado, k: string) => (e === "apartada" ? MAR : e === "mantenimiento" ? "#b7bcc0" : ALTA.has(Number(k.split("-")[0])) ? "#f9cdbd" : "#cfeeee");

  return (
    <div className="min-h-[calc(100vh-8rem)]" style={{ background: SAL, color: MAR, fontFamily: CUERPO }}>
      <header style={{ background: MAR }} className="text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end gap-x-8 gap-y-3 px-5 py-5">
          <div><p className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] opacity-60">Costa Serena Club · oficina</p><h1 className="text-[2.8rem] italic leading-none" style={{ fontFamily: TITULO, fontWeight: 600 }}>Calendario del año</h1></div>
          <div className="ml-auto flex flex-wrap gap-x-8 gap-y-1">{[[String(n("libre")), "semanas libres", "#9fe3e3"], [String(n("apartada")), "apartadas", "#fff"], [String(atrasadas.length), "socios atrasados", "#ffb59f"], [qz(porCobrar), "por cobrar", "#ffb59f"]].map(([x, t, c]) => <p key={t}><b className="block text-[1.9rem] leading-none" style={{ fontFamily: TITULO, color: c }}>{x}</b><span className="text-[0.78rem] opacity-65">{t}</span></p>)}</div>
        </div>
        <nav aria-label="Oficina" className="mx-auto flex max-w-7xl gap-1 px-3">
          {([["calendario", "Calendario"], ["socios", "Socios y cuotas"], ["unidades", "Villas"]] as const).map(([id, t]) => <button key={id} type="button" onClick={() => setVista(id)} aria-current={vista === id ? "page" : undefined} className="rounded-t-xl px-5 py-3 text-[1.02rem] font-semibold" style={vista === id ? { background: SAL, color: MAR } : { color: "rgba(255,255,255,.72)" }}>{t}</button>)}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        {vista === "calendario" && (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <section>
              <p className="opacity-75">Cada casilla es una semana (4 por mes). Toque una para ver quién la tiene o apartarla.</p>
              <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
                {MESES.map((m, i) => (
                  <div key={m}><p className="mb-1 text-center text-[1rem] font-semibold italic" style={{ fontFamily: TITULO }}>{m}{ALTA.has(i) && <span className="ml-1 text-[0.65rem] not-italic" style={{ color: CORAL }}>alta</span>}</p>
                    <div className="grid grid-cols-2 gap-1">{[0, 1, 2, 3].map((w) => { const k = `${i}-${w}`, e = estado(k); return <button key={k} type="button" onClick={() => setSel(k)} aria-pressed={sel === k} aria-label={`${m}, semana ${w + 1}: ${e}`} className="h-9 rounded text-[0.72rem] font-bold" style={{ background: fondo(e, k), color: e === "apartada" ? "#fff" : MAR, outline: sel === k ? `3px solid ${CORAL}` : "none", outlineOffset: 1 }}>{w + 1}</button>; })}</div></div>
                ))}
              </div>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.85rem]"><li><b style={{ color: TURQ }}>■</b> libre</li><li><b style={{ color: "#f0a58f" }}>■</b> libre en temporada alta</li><li><b style={{ color: MAR }}>■</b> apartada</li><li><b style={{ color: "#b7bcc0" }}>■</b> mantenimiento</li></ul>
            </section>
            <aside className="rounded-2xl bg-white p-5" style={{ border: `2px solid ${MAR}20` }}>
              {sel ? (() => { const [mi, w] = sel.split("-").map(Number), e = estado(sel); return (
                <>
                  <p className="text-[0.8rem] font-semibold uppercase tracking-wider opacity-60">{MESES[mi]} · semana {w + 1}{ALTA.has(mi) ? " · temporada alta" : ""}</p>
                  <h2 className="text-[1.8rem] italic leading-tight" style={{ fontFamily: TITULO, fontWeight: 600 }}>{e === "libre" ? "Libre" : e === "mantenimiento" ? "En mantenimiento" : nombre(semanas[sel])}</h2>
                  {e === "apartada" && <div className="mt-3 grid gap-2"><p className="text-[0.92rem] opacity-75">{socios.find((s) => s.id === semanas[sel])?.villa}</p><Btn alTocar={() => setSemanas((x) => { const c = { ...x }; delete c[sel]; return c; })} color={CORAL}>Liberar esta semana</Btn></div>}
                  {e === "libre" && (
                    <div className="mt-3 grid gap-2">
                      <label className="text-[0.88rem] font-semibold">Apartar para el socio<select value={socio} onChange={(ev) => setSocio(ev.target.value)} className="mt-1 w-full rounded-lg border-2 bg-white px-3 py-2.5 font-normal" style={{ borderColor: MAR }}>{socios.map((s) => <option key={s.id} value={s.id}>{s.n}</option>)}</select></label>
                      <Btn alTocar={() => setSemanas((x) => ({ ...x, [sel]: socio }))} color={TURQ}><Check size={16} /> Apartar</Btn>
                      <Btn alTocar={() => setMant((x) => new Set(x).add(sel))} color="#7d868c">Marcar mantenimiento</Btn>
                    </div>
                  )}
                  {e === "mantenimiento" && <div className="mt-3"><Btn alTocar={() => setMant((x) => { const c = new Set(x); c.delete(sel); return c; })} color={TURQ}>Ya quedó lista</Btn></div>}
                </>
              ); })() : <p className="opacity-70">Toque una semana del calendario para ver su detalle.</p>}
            </aside>
          </div>
        )}

        {vista === "socios" && (
          <section>
            <h2 className="text-[2rem] italic" style={{ fontFamily: TITULO, fontWeight: 600 }}>Socios y cuotas</h2>
            <p className="opacity-75">Los atrasados salen primero.</p>
            <ul className="mt-3 grid gap-3 md:grid-cols-2">
              {[...socios].sort((a, b) => Number(a.al) - Number(b.al)).map((s) => (
                <li key={s.id} className="rounded-2xl bg-white p-4" style={{ border: `2px solid ${s.al ? `${MAR}20` : CORAL}` }}>
                  <div className="flex items-start justify-between gap-2"><div><p className="text-[1.3rem] italic leading-tight" style={{ fontFamily: TITULO, fontWeight: 600 }}>{s.n}</p><p className="text-[0.88rem] opacity-70">{s.plan} · {s.villa}</p><p className="text-[0.82rem] opacity-60">{todas.filter((k) => semanas[k] === s.id).length} semanas apartadas</p></div><span className="rounded-full px-3 py-1 text-[0.8rem] font-bold text-white" style={{ background: s.al ? OK : CORAL }}>{s.al ? "Al día" : "Atrasado"}</span></div>
                  <p className="mt-2 text-[0.95rem]">Cuota mensual: <b>{qz(s.cuota)}</b></p>
                  {!s.al && <div className="mt-3 flex flex-wrap gap-2"><Btn alTocar={() => setMsg(`Hola, ${s.n}. Le escribimos de Costa Serena Club. Su cuota de ${qz(s.cuota)} está pendiente. Puede pagar por transferencia o con tarjeta aquí: costaserena.gt/pagar. Gracias por ser parte del club.`)} color={CORAL}><Send size={15} /> Recordar la cuota</Btn><Btn alTocar={() => setSocios((l) => l.map((x) => (x.id === s.id ? { ...x, al: true } : x)))} color={OK}><Check size={15} /> Ya pagó</Btn></div>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {vista === "unidades" && (
          <section>
            <h2 className="text-[2rem] italic" style={{ fontFamily: TITULO, fontWeight: 600 }}>Villas</h2>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {[["Villa Mar", "6 personas · 2 habitaciones", "Pintura de terraza programada"], ["Casita Jardín", "4 personas · 1 habitación", "Revisión del aire acondicionado"]].map(([v, d, nota]) => {
                const ocupadas = todas.filter((k) => semanas[k] && socios.find((s) => s.id === semanas[k])?.villa === v).length;
                return <article key={v} className="rounded-2xl bg-white p-5" style={{ border: `2px solid ${MAR}20` }}><h3 className="text-[1.7rem] italic" style={{ fontFamily: TITULO, fontWeight: 600 }}>{v}</h3><p className="text-[0.9rem] opacity-70">{d}</p><p className="mt-3 text-[2.2rem] font-semibold leading-none" style={{ fontFamily: TITULO, color: TURQ }}>{ocupadas}<span className="text-[1rem] opacity-60"> / 48 semanas apartadas</span></p><span className="mt-2 block h-2.5 overflow-hidden rounded-full bg-black/10"><span className="block h-full rounded-full" style={{ width: `${(ocupadas / 48) * 100}%`, background: TURQ }} /></span><p className="mt-3 rounded-lg p-3 text-[0.9rem]" style={{ background: ARENA }}><b>Mantenimiento:</b> {nota}</p></article>;
              })}
            </div>
          </section>
        )}
      </main>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="tiempo compartido" que="el recordatorio" />
    </div>
  );
}
