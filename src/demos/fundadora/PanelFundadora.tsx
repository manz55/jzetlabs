/*
 * Agenda de Valeria Ríos: la agenda de relaciones.
 * Identidad propia: crema, verde salvia y terracota sobre tinta de hoja; Fraunces para los títulos y Karla para lo demás.
 * Lo que se ve primero: a quién le toca escribir esta semana. Lo que se llena: la nota y el siguiente paso de cada persona.
 */
import { useState, type ReactNode } from "react";
import { ArrowRight, Check, Send } from "lucide-react";
import { MensajeWhatsApp, qz } from "../comun";

const CREMA = "#f7f1e3";
const TINTA = "#2b3a2e";
const SALVIA = "#7a8f6a";
const TERRA = "#c4673f";
const HOJA = "#e3ead9";
const TITULO = "'Fraunces', Georgia, serif";
const CUERPO = "'Karla', 'Instrument Sans', system-ui, sans-serif";

const ETAPAS = [
  { t: "Me escribieron", sub: "Preguntaron por mi trabajo", color: TERRA },
  { t: "Llamada agendada", sub: "Ya tienen día y hora", color: "#b8862b" },
  { t: "En mentoría", sub: "Trabajamos juntas", color: SALVIA },
  { t: "Cerradas", sub: "Terminaron el proceso", color: "#5b6f66" },
] as const;
type Persona = { id: string; n: string; de: string; etapa: number; nota: string; siguiente: string; monto?: number; tel: string };
const PERSONAS_INICIAL: Persona[] = [
  { id: "a", n: "Mariela Torres", de: "Instagram", etapa: 0, nota: "Quiere lanzar su marca de velas. Vio el reel del taller.", siguiente: "Contestarle hoy", tel: "5544 1290" },
  { id: "b", n: "Daniela Ortiz", de: "Recomendada por Karla", etapa: 0, nota: "Pregunta cuánto cuesta la mentoría de 3 meses.", siguiente: "Mandarle el paquete", tel: "4478 3321" },
  { id: "c", n: "Andrea Soto", de: "Taller de octubre", etapa: 1, nota: "Duda entre mentoría 1 a 1 o el grupo.", siguiente: "Llamada jueves 4:00 pm", tel: "5021 9087" },
  { id: "d", n: "Lucía Paz", de: "Sitio web", etapa: 2, nota: "Semana 5 de 12. Ya tiene su primer cliente.", siguiente: "Sesión martes 10:00", monto: 2400, tel: "3211 6754" },
  { id: "e", n: "Karla Orozco", de: "Instagram", etapa: 2, nota: "Semana 2 de 12. Trabajando su oferta.", siguiente: "Sesión viernes 9:00", monto: 2400, tel: "5512 8890" },
  { id: "f", n: "Paola Méndez", de: "Taller de agosto", etapa: 3, nota: "Terminó. Dejó una reseña muy bonita.", siguiente: "Pedirle testimonio en video", monto: 2400, tel: "5598 4410" },
];
const SEMANA = [["Lun", "Contestar a Mariela y Daniela"], ["Mar", "Sesión con Lucía · 10:00"], ["Jue", "Llamada con Andrea · 4:00 pm"], ["Vie", "Sesión con Karla · 9:00"]];
const MESES = [{ t: "Jul", v: 2400 }, { t: "Ago", v: 4800 }, { t: "Sep", v: 4800 }, { t: "Oct", v: 7200 }, { t: "Nov", v: 7200 }];

function Btn({ children, alTocar, color = TINTA, ancho = false }: { children: ReactNode; alTocar: () => void; color?: string; ancho?: boolean }) {
  return <button type="button" onClick={alTocar} className={`inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-full px-5 py-2 text-[0.92rem] font-bold text-white transition hover:brightness-110 active:scale-[0.97] ${ancho ? "w-full" : ""}`} style={{ background: color }}>{children}</button>;
}

export default function PanelFundadora() {
  const [personas, setPersonas] = useState(PERSONAS_INICIAL);
  const [notas, setNotas] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const mover = (id: string, d: number) => setPersonas((l) => l.map((p) => (p.id === id ? { ...p, etapa: Math.min(3, Math.max(0, p.etapa + d)) } : p)));
  const activas = personas.filter((p) => p.etapa === 2).length;
  const ingresos = personas.filter((p) => p.monto).reduce((s, p) => s + (p.monto ?? 0), 0);
  const max = Math.max(...MESES.map((m) => m.v));

  return (
    <div className="min-h-[calc(100vh-8rem)]" style={{ background: CREMA, color: TINTA, fontFamily: CUERPO }}>
      <header style={{ background: TINTA }} className="text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end gap-x-8 gap-y-3 px-5 py-5">
          <div><p className="text-[0.78rem] font-bold uppercase tracking-[0.2em] opacity-60">Mi panel</p><h1 className="text-[2.6rem] italic leading-none" style={{ fontFamily: TITULO, fontWeight: 600 }}>Valeria Ríos</h1></div>
          <div className="ml-auto flex flex-wrap gap-x-8 gap-y-1">{[[String(personas.filter((p) => p.etapa === 0).length), "me escribieron", "#f0b89d"], [String(activas), "en mentoría", "#c9d8b6"], [qz(ingresos), "facturado en total", "#fff"]].map(([n, t, c]) => <p key={t}><b className="block text-[1.9rem] leading-none" style={{ fontFamily: TITULO, color: c }}>{n}</b><span className="text-[0.78rem] opacity-65">{t}</span></p>)}</div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-6 xl:grid-cols-[1fr_18rem]">
        <section aria-label="Personas">
          <p className="mb-3 opacity-75">Cada persona es una tarjeta que va avanzando. Anote lo que habló y qué sigue.</p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {ETAPAS.map((e, i) => (
              <div key={e.t} className="rounded-2xl p-2.5" style={{ background: HOJA }}>
                <h2 className="px-1 text-[1.2rem] italic" style={{ fontFamily: TITULO, color: e.color, fontWeight: 600 }}>{e.t} <span className="rounded-full px-2 text-[0.8rem] not-italic text-white" style={{ background: e.color }}>{personas.filter((p) => p.etapa === i).length}</span></h2>
                <p className="px-1 pb-2 text-[0.78rem] opacity-60">{e.sub}</p>
                <div className="grid gap-2.5">
                  {personas.filter((p) => p.etapa === i).map((p) => (
                    <article key={p.id} className="rounded-xl bg-white p-3" style={{ borderLeft: `6px solid ${e.color}` }}>
                      <p className="text-[1.1rem] font-bold leading-tight">{p.n}</p><p className="text-[0.78rem] opacity-60">{p.de}</p>
                      <p className="mt-1.5 text-[0.88rem]">{notas[p.id] ?? p.nota}</p>
                      <p className="mt-1 text-[0.85rem] font-bold" style={{ color: e.color }}>Sigue: {p.siguiente}</p>
                      <label className="mt-2 block text-[0.8rem] font-bold">Mi nota<input value={notas[p.id] ?? ""} onChange={(ev) => setNotas((n) => ({ ...n, [p.id]: ev.target.value }))} placeholder="Lo que hablamos…" className="mt-1 w-full rounded-lg border-2 bg-white px-2.5 py-2 text-[0.9rem] font-normal" style={{ borderColor: `${SALVIA}80` }} /></label>
                      <div className="mt-2 grid gap-1.5">
                        {i < 3 && <Btn alTocar={() => mover(p.id, 1)} color={e.color} ancho>Pasar a: {ETAPAS[i + 1].t} <ArrowRight size={15} /></Btn>}
                        <div className="flex justify-between gap-2"><button type="button" onClick={() => setMsg(i === 0 ? `Hola, ${p.n.split(" ")[0]}. Soy Valeria Ríos. Gracias por escribirme. Cuéntame un poco más de lo que quieres lograr y te propongo una llamada de 20 minutos sin costo.` : i === 1 ? `Hola, ${p.n.split(" ")[0]}. Te confirmo nuestra llamada: ${p.siguiente.replace("Llamada ", "")}. Si necesitas cambiarla, avísame con tiempo. ¡Nos hablamos!` : `Hola, ${p.n.split(" ")[0]}. Te recuerdo nuestra sesión: ${p.siguiente.replace("Sesión ", "")}. Trae lo que avanzaste esta semana.`)} className="inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-full border-2 px-3 text-[0.82rem] font-bold" style={{ borderColor: TINTA }}><Send size={13} /> Escribirle</button>{i > 0 && <button type="button" onClick={() => mover(p.id, -1)} className="text-[0.8rem] font-semibold underline opacity-70">Volver atrás</button>}</div>
                      </div>
                    </article>
                  ))}
                  {personas.filter((p) => p.etapa === i).length === 0 && <p className="rounded-xl border-2 border-dashed p-3 text-center text-[0.85rem] opacity-55" style={{ borderColor: SALVIA }}>Nadie</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="grid content-start gap-5">
          <section className="rounded-2xl bg-white p-4" style={{ border: `2px solid ${SALVIA}60` }}>
            <h2 className="text-[1.3rem] italic" style={{ fontFamily: TITULO, fontWeight: 600 }}>Esta semana</h2>
            <ul className="mt-2 divide-y" style={{ borderColor: `${SALVIA}40` }}>{SEMANA.map(([d, t]) => <li key={d} className="flex gap-3 py-2.5"><b className="w-10" style={{ color: TERRA }}>{d}</b><span className="text-[0.92rem]">{t}</span></li>)}</ul>
          </section>
          <section className="rounded-2xl bg-white p-4" style={{ border: `2px solid ${SALVIA}60` }}>
            <h2 className="text-[1.3rem] italic" style={{ fontFamily: TITULO, fontWeight: 600 }}>Ingresos por mes</h2>
            <div className="mt-3 flex h-36 items-end gap-2">{MESES.map((m) => <div key={m.t} className="flex h-full flex-1 flex-col items-center justify-end gap-1"><span className="text-[0.72rem] font-bold">{(m.v / 1000).toFixed(1)}k</span><span className="w-full rounded-t" style={{ height: `${(m.v / max) * 80}%`, background: SALVIA }} /><span className="text-[0.75rem] opacity-60">{m.t}</span></div>)}</div>
          </section>
          <p className="flex items-center gap-2 rounded-2xl p-4 text-[0.92rem]" style={{ background: HOJA }}><Check size={18} style={{ color: SALVIA }} /> Las cerradas se vuelven testimonios para la página.</p>
        </aside>
      </main>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="página personal de fundadora" que="el mensaje" />
    </div>
  );
}
