/*
 * Consultorio de Pediatría Semillita: la pared del consultorio.
 * Identidad propia: marino, coral, sol y lima como los crayones; Baloo 2 para títulos y Nunito para lo demás.
 * Lo que se ve primero: los niños de hoy en carriles (agendada, en sala, en consulta, atendida) y a quién hay que llamar.
 * Lo que se llena: peso y talla en cada control y la vacuna puesta.
 */
import { useState, type ReactNode } from "react";
import { ArrowRight, Baby, Bell, Check, Syringe, Thermometer } from "lucide-react";
import { MensajeWhatsApp } from "../comun";
import { Curva } from "./Curva";
import { ATRASADOS, CIELO, CIELO2, CORAL, LIMA, MARINO, REDONDA, SOL, VACUNAS, edadTexto, mesesDe, type Cita, type Pedi } from "./datos";

const CUERPO = "'Nunito', 'Plus Jakarta Sans', system-ui, sans-serif";

const TIPO: Record<Cita["tipo"], { t: string; c: string; i: ReactNode }> = {
  enfermedad: { t: "Enfermedad", c: CORAL, i: <Thermometer size={20} /> },
  control: { t: "Niño sano", c: LIMA, i: <Baby size={20} /> },
  vacuna: { t: "Vacuna", c: SOL, i: <Syringe size={20} /> },
};
const CARRILES: { id: Cita["estado"]; t: string; boton: string }[] = [
  { id: "agendada", t: "Todavía no llegan", boton: "Ya llegó" },
  { id: "espera", t: "En sala de espera", boton: "Pasar a consulta" },
  { id: "consulta", t: "Con la doctora", boton: "Terminó la consulta" },
  { id: "listo", t: "Ya atendidos", boton: "" },
];

function Btn({ children, alTocar, color = MARINO, ancho = false, claro = false }: { children: ReactNode; alTocar: () => void; color?: string; ancho?: boolean; claro?: boolean }) {
  return <button type="button" onClick={alTocar} className={`inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.95rem] font-extrabold transition hover:brightness-105 active:scale-[0.97] ${ancho ? "w-full" : ""}`} style={claro ? { background: "#fff", color: MARINO, border: `2.5px solid ${MARINO}` } : { background: color, color: color === SOL ? MARINO : "#fff" }}>{children}</button>;
}

export default function PanelPediatria({ p }: { p: Pedi }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [quien, setQuien] = useState(p.ninos[0].id);
  const nino = p.ninos.find((n) => n.id === quien) ?? p.ninos[0];
  const mes = mesesDe(nino.nace);
  const [kg, setKg] = useState("8.3");
  const [cm, setCm] = useState("69");
  const [guardado, setGuardado] = useState(false);
  const debidas = VACUNAS.filter((v) => v.mes <= mes && !nino.vacunas.includes(v.mes));
  const hoy = {
    sala: p.agenda.filter((c) => c.estado === "espera").length,
    vacunas: p.agenda.filter((c) => c.tipo === "vacuna" && c.estado !== "listo").length,
    enf: p.agenda.filter((c) => c.tipo === "enfermedad" && c.estado !== "listo").length,
    listos: p.agenda.filter((c) => c.estado === "listo").length,
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]" style={{ background: CIELO, color: MARINO, fontFamily: CUERPO }}>
      <header style={{ background: MARINO }} className="text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-3.5">
          <span className="grid h-11 w-11 place-items-center rounded-full" style={{ background: SOL, color: MARINO }}><Baby size={24} /></span>
          <div className="leading-tight"><p className="text-[1.5rem] font-extrabold" style={{ fontFamily: REDONDA }}>Consultorio · Dra. Lucía Ordóñez</p><p className="text-[0.82rem] opacity-70">Pediatría Semillita · sábado 21 de noviembre</p></div>
          <button type="button" onClick={p.reiniciar} className="ml-auto text-[0.85rem] font-bold underline opacity-75">Volver a los datos de ejemplo</button>
        </div>
        <div className="h-3" style={{ background: `linear-gradient(90deg, ${SOL} 0 20%, ${LIMA} 20% 40%, ${CIELO2} 40% 60%, ${CORAL} 60% 80%, ${SOL} 80%)` }} aria-hidden />
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[["En sala de espera", hoy.sala, LIMA], ["Vacunas por poner", hoy.vacunas, SOL], ["Niños con fiebre o dolor", hoy.enf, CORAL], ["Ya atendidos", hoy.listos, MARINO]].map(([t, n, c]) => (
            <div key={t as string} className="rounded-3xl bg-white p-4" style={{ boxShadow: `inset 0 -6px 0 ${c}` }}><p className="text-[0.85rem] font-bold opacity-65">{t}</p><p className="text-[2.2rem] font-extrabold leading-none" style={{ fontFamily: REDONDA }}>{n}</p></div>
          ))}
        </div>

        <p className="mt-5 text-[0.95rem] font-semibold opacity-75">Cada niño es una tarjeta. Cuando pase algo, toque el botón de color de su tarjeta.</p>
        <div className="mt-3 grid gap-3 lg:grid-cols-4">
          {CARRILES.map((k) => {
            const lista = p.agenda.filter((c) => c.estado === k.id);
            return (
              <section key={k.id} aria-label={k.t} className="rounded-3xl bg-white/70 p-3">
                <h2 className="flex items-center justify-between px-1 pb-2 text-[1.1rem] font-extrabold" style={{ fontFamily: REDONDA }}>{k.t}<span className="rounded-full px-2.5 py-0.5 text-[0.85rem] text-white" style={{ background: MARINO }}>{lista.length}</span></h2>
                <div className="space-y-2.5">
                  {lista.map((c) => (
                    <article key={c.id} className="rounded-2xl bg-white p-3" style={{ borderLeft: `8px solid ${TIPO[c.tipo].c}` }}>
                      <div className="flex items-start gap-2.5">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: TIPO[c.tipo].c }}>{TIPO[c.tipo].i}</span>
                        <div className="min-w-0 leading-tight"><p className="font-extrabold">{c.nino} {c.nueva && <span className="ml-1 rounded-full px-1.5 py-0.5 text-[0.68rem] text-white" style={{ background: CORAL }}>desde la página</span>}</p><p className="text-[0.82rem] opacity-70">{c.edad} · {c.hora}</p></div>
                      </div>
                      <p className="mt-1.5 text-[0.88rem]">{c.motivo}</p>
                      <p className="text-[0.8rem] opacity-65">Mamá: {c.mama}</p>
                      {k.boton && <div className="mt-2"><Btn alTocar={() => p.avanzar(c.id)} color={TIPO[c.tipo].c} ancho>{k.boton} <ArrowRight size={16} /></Btn></div>}
                    </article>
                  ))}
                  {lista.length === 0 && <p className="rounded-2xl border-2 border-dashed p-4 text-center text-[0.88rem] opacity-60" style={{ borderColor: MARINO }}>Ninguno</p>}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <section className="rounded-3xl bg-white p-5">
            <h2 className="text-[1.5rem] font-extrabold" style={{ fontFamily: REDONDA }}>Control de peso, talla y vacunas</h2>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Niño">
              {p.ninos.map((n) => <button key={n.id} type="button" aria-pressed={quien === n.id} onClick={() => { setQuien(n.id); setGuardado(false); }} className="rounded-full border-[2.5px] px-4 py-2 font-extrabold" style={quien === n.id ? { background: MARINO, color: "#fff", borderColor: MARINO } : { borderColor: MARINO }}>{n.nombre} · {edadTexto(mesesDe(n.nace))}</button>)}
            </div>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-[0.88rem] font-extrabold">Peso (kg)<input inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} className="mt-1 w-full rounded-2xl border-[2.5px] bg-white px-3 py-2.5 text-[1.1rem] font-bold" style={{ borderColor: MARINO }} /></label>
                  <label className="text-[0.88rem] font-extrabold">Talla (cm)<input inputMode="decimal" value={cm} onChange={(e) => setCm(e.target.value)} className="mt-1 w-full rounded-2xl border-[2.5px] bg-white px-3 py-2.5 text-[1.1rem] font-bold" style={{ borderColor: MARINO }} /></label>
                </div>
                <div className="mt-3"><Btn alTocar={() => { p.pesar(nino.id, { mes, kg: Number(kg) || 0, cm: Number(cm) || 0 }); setGuardado(true); }} ancho>Guardar control</Btn></div>
                {guardado && <p className="mt-2 flex items-center gap-2 font-extrabold" style={{ color: "#2f7d27" }}><Check size={18} /> Guardado. Se actualizó la curva de la mamá.</p>}
                <h3 className="mt-5 font-extrabold">Vacunas que le tocan y no lleva</h3>
                <ul className="mt-2 grid gap-2">
                  {debidas.map((v) => (
                    <li key={v.mes} className="rounded-2xl p-3" style={{ background: "#fff6dc", border: `2px solid ${SOL}` }}>
                      <p className="font-extrabold">{v.edad}</p><p className="text-[0.85rem] opacity-80">{v.lista.join(", ")}</p>
                      <div className="mt-2"><Btn alTocar={() => p.vacunar(nino.id, v.mes)} color={SOL}><Syringe size={16} /> Marcar vacuna puesta</Btn></div>
                    </li>
                  ))}
                  {debidas.length === 0 && <li className="flex items-center gap-2 font-extrabold" style={{ color: "#2f7d27" }}><Check size={18} /> Lleva todas las vacunas de su edad.</li>}
                </ul>
              </div>
              <div><p className="mb-1 text-[0.85rem] font-extrabold opacity-70">Curva de peso de {nino.nombre}</p><Curva n={nino} /></div>
            </div>
          </section>

          <section className="rounded-3xl p-5 text-white" style={{ background: MARINO }}>
            <h2 className="text-[1.5rem] font-extrabold" style={{ fontFamily: REDONDA }}>A quién hay que llamar</h2>
            <p className="text-[0.9rem] opacity-75">Vacunas y controles atrasados. Mientras más días, más largo el cuadro.</p>
            <ul className="mt-3 grid gap-3">
              {ATRASADOS.map((a) => {
                const ya = p.recordados.includes(a.nino);
                return (
                  <li key={a.nino} className="rounded-2xl bg-white/10 p-3">
                    <p className="font-extrabold">{a.nino} <span className="font-normal opacity-70">· mamá {a.mama}</span></p>
                    <p className="text-[0.88rem]" style={{ color: SOL }}>{a.falta} · hace {a.dias} días</p>
                    <span className="mt-1.5 block h-2.5 overflow-hidden rounded-full bg-white/20"><span className="block h-full rounded-full" style={{ width: `${Math.min(100, (a.dias / 40) * 100)}%`, background: a.dias > 30 ? CORAL : SOL }} /></span>
                    <div className="mt-2">{ya ? <p className="flex items-center gap-2 font-extrabold" style={{ color: LIMA }}><Check size={17} /> Ya se le recordó</p> : <Btn alTocar={() => { p.recordar(a.nino); setMsg(`Hola, ${a.mama.split(" ")[0]}. Le saludamos de Pediatría Semillita. A ${a.nino.split(" ")[0]} le toca: ${a.falta.toLowerCase()}. ¿Le apartamos una hora esta semana? Puede escoger la hora aquí mismo en la página.`); }} color={SOL}><Bell size={16} /> Recordar a la mamá</Btn>}</div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </main>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="clínica pediátrica" que="el recordatorio para la mamá" />
    </div>
  );
}
