/*
 * Consultorio del Dr. Samayoa: la mesa de trabajo del médico.
 * Identidad propia: verde pino y ocre de los sobres de laboratorio; Lora para los títulos y Public Sans para lo demás.
 * Distinto a los demás paneles: es una historia clínica de tres columnas, no pestañas.
 *   Izquierda: quién viene y quién está descompensado. Centro: el paciente (gráfica, nota y receta). Derecha: recetas y laboratorios por revisar.
 */
import { useState, type ReactNode } from "react";
import { Activity, Check, FileText, FlaskConical, Pill, Plus, Send, X } from "lucide-react";
import { MensajeWhatsApp } from "../comun";

const PINO = "#1d4a42";
const PINO2 = "#2c6458";
const OCRE = "#c47f26";
const ROJO = "#c2412d";
const TINTA = "#16231f";
const PAPEL = "#f6f4ec";
const TITULO = "'Lora', Georgia, serif";
const CUERPO = "'Public Sans', 'Instrument Sans', system-ui, sans-serif";

type Lectura = { dia: string; sis: number; dia2: number; glu: number };
type CitaMed = { hora: string; quien: string; edad: number; motivo: string; tipo: string; listo?: boolean; nueva?: boolean };
type Med = { agenda: CitaMed[]; lecturas: Lectura[]; renovar: boolean; renovada: boolean; terminar: (hora: string) => void; firmarReceta: () => void; reiniciar: () => void };

type Paciente = { quien: string; edad: number; tiene: string; alergia: string; lecturas: Lectura[]; meds: string[]; alto: boolean; dias: number };
const serie = (s: number[], d: number[], g: number[]): Lectura[] => ["lun", "mar", "mié", "jue", "vie", "sáb"].map((dia, i) => ({ dia, sis: s[i], dia2: d[i], glu: g[i] }));
const OTROS: Paciente[] = [
  { quien: "Rosa Elvira Tzul", edad: 67, tiene: "Hipertensión", alergia: "Ninguna", lecturas: serie([140, 146, 150, 148, 152, 156], [88, 90, 92, 92, 94, 96], [98, 101, 99, 100, 102, 99]), meds: ["Losartán 50 mg · 1 en la mañana", "Amlodipino 5 mg · 1 en la noche"], alto: true, dias: 1 },
  { quien: "Héctor Cifuentes", edad: 63, tiene: "Diabetes", alergia: "Sulfas", lecturas: serie([124, 0, 0, 0, 0, 0], [80, 0, 0, 0, 0, 0], [132, 0, 0, 0, 0, 0]), meds: ["Metformina 850 mg · con el almuerzo"], alto: false, dias: 15 },
  { quien: "Carmen de León", edad: 72, tiene: "Hipertensión", alergia: "Ninguna", lecturas: serie([128, 126, 124, 125, 122, 124], [82, 80, 80, 81, 79, 80], [96, 98, 95, 97, 96, 95]), meds: ["Losartán 50 mg · 1 en la mañana"], alto: false, dias: 0 },
  { quien: "Julio César Monzón", edad: 54, tiene: "Chequeo completo", alergia: "Ninguna", lecturas: serie([122, 0, 0, 0, 0, 0], [78, 0, 0, 0, 0, 0], [92, 0, 0, 0, 0, 0]), meds: [], alto: false, dias: 0 },
  { quien: "Óscar Pineda", edad: 41, tiene: "Consulta aguda", alergia: "Ninguna", lecturas: serie([118, 0, 0, 0, 0, 0], [76, 0, 0, 0, 0, 0], [90, 0, 0, 0, 0, 0]), meds: [], alto: false, dias: 0 },
  { quien: "Edgar Alvarado", edad: 49, tiene: "Chequeo básico", alergia: "Ninguna", lecturas: serie([130, 0, 0, 0, 0, 0], [84, 0, 0, 0, 0, 0], [101, 0, 0, 0, 0, 0]), meds: [], alto: false, dias: 0 },
];
const LABS_INICIAL = [
  { id: "l1", quien: "Marta Lidia Ramírez", examen: "Hemoglobina glicosilada y glucosa", fuera: 3, visto: false },
  { id: "l2", quien: "Carmen de León", examen: "Perfil de lípidos", fuera: 1, visto: false },
  { id: "l3", quien: "Rosa Elvira Tzul", examen: "Creatinina", fuera: 0, visto: true },
];

function Btn({ children, alTocar, tipo = "lleno", ancho = false }: { children: ReactNode; alTocar: () => void; tipo?: "lleno" | "ocre" | "borde"; ancho?: boolean }) {
  const s = tipo === "lleno" ? { background: PINO, color: "#fff", border: `2px solid ${PINO}` } : tipo === "ocre" ? { background: OCRE, color: "#fff", border: `2px solid ${OCRE}` } : { background: "#fff", color: PINO, border: `2px solid ${PINO}` };
  return <button type="button" onClick={alTocar} className={`inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[0.95rem] font-semibold transition hover:brightness-110 active:scale-[0.98] ${ancho ? "w-full" : ""}`} style={s}>{children}</button>;
}

/* gráfica de presión y azúcar de la semana, con la franja de lo normal */
function Grafica({ datos }: { datos: Lectura[] }) {
  const v = datos.filter((d) => d.sis > 0);
  if (v.length < 2) return <p className="rounded-lg p-4 text-[0.92rem]" style={{ background: "#fff", border: `1.5px dashed ${PINO2}` }}>Aún no hay suficientes lecturas para dibujar la semana. {v[0] ? `Última: ${v[0].sis}/${v[0].dia2} · glucosa ${v[0].glu}.` : "Sin lecturas."}</p>;
  const W = 520, H = 190, x = (i: number) => 36 + (i * (W - 56)) / (v.length - 1), y = (n: number) => H - 24 - ((n - 70) / 100) * (H - 44);
  const linea = (f: (l: Lectura) => number) => v.map((l, i) => `${i ? "L" : "M"}${x(i)} ${y(f(l))}`).join(" ");
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Presión y glucosa de la semana" className="w-full rounded-lg bg-white" style={{ border: `1.5px solid ${PINO}` }}>
        <rect x="36" y={y(130)} width={W - 56} height={y(90) - y(130)} fill="rgba(44,100,88,.12)" />
        {[80, 100, 120, 140, 160].map((n) => <g key={n}><line x1="36" x2={W - 20} y1={y(n)} y2={y(n)} stroke="rgba(22,35,31,.1)" /><text x="4" y={y(n) + 4} fontSize="10" fill="#555">{n}</text></g>)}
        <path d={linea((l) => l.sis)} fill="none" stroke={ROJO} strokeWidth="3" strokeLinejoin="round" /><path d={linea((l) => l.dia2)} fill="none" stroke={PINO} strokeWidth="3" strokeLinejoin="round" /><path d={linea((l) => l.glu)} fill="none" stroke={OCRE} strokeWidth="3" strokeDasharray="6 4" strokeLinejoin="round" />
        {v.map((l, i) => <text key={l.dia} x={x(i)} y={H - 6} fontSize="11" textAnchor="middle" fill="#444">{l.dia}</text>)}
      </svg>
      <figcaption className="mt-1.5 flex flex-wrap gap-x-4 text-[0.82rem]"><span style={{ color: ROJO }}>━ Sistólica</span><span style={{ color: PINO }}>━ Diastólica</span><span style={{ color: OCRE }}>┅ Glucosa</span><span className="opacity-60">Franja verde: lo normal</span></figcaption>
    </figure>
  );
}

export default function PanelConsultorio({ m }: { m: Med }) {
  const marta: Paciente = { quien: "Marta Lidia Ramírez", edad: 58, tiene: "Diabetes e hipertensión", alergia: "Penicilina", lecturas: m.lecturas, meds: ["Losartán 50 mg · 1 en la mañana", "Metformina 850 mg · con almuerzo y cena", "Aspirina 100 mg · después del almuerzo"], alto: true, dias: 0 };
  const pacientes = [marta, ...OTROS];
  const [sel, setSel] = useState(marta.quien);
  const [notas, setNotas] = useState<Record<string, string>>({});
  const [recetas, setRecetas] = useState<Record<string, string[]>>({});
  const [nuevaMed, setNuevaMed] = useState("");
  const [labs, setLabs] = useState(LABS_INICIAL);
  const [pedidos, setPedidos] = useState<string[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [nuevo, setNuevo] = useState(false);

  const p = pacientes.find((x) => x.quien === sel) ?? marta;
  const cita = m.agenda.find((c) => c.quien === p.quien);
  const meds = [...p.meds, ...(recetas[p.quien] ?? [])];
  const ultima = [...p.lecturas].reverse().find((l) => l.sis > 0);
  const altos = pacientes.filter((x) => x.alto).length;
  const crónicos = pacientes.filter((x) => /Diabetes|Hipertensión/.test(x.tiene)).sort((a, b) => Number(b.alto) - Number(a.alto));

  return (
    <div className="min-h-[calc(100vh-8rem)]" style={{ background: PAPEL, color: TINTA, fontFamily: CUERPO }}>
      <header style={{ background: PINO }} className="text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/10"><Activity size={22} /></span>
          <div className="leading-tight"><p className="text-[1.3rem] font-semibold" style={{ fontFamily: TITULO }}>Consultorio · Dr. Ricardo Samayoa</p><p className="text-[0.78rem] opacity-70">Sábado 21 de noviembre · {m.agenda.filter((c) => !c.listo).length} pacientes por ver · {altos} con lectura alta</p></div>
          <button type="button" onClick={m.reiniciar} className="ml-auto text-[0.85rem] font-semibold underline opacity-75">Volver a los datos de ejemplo</button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[17rem_1fr_19rem]">
        {/* izquierda: a quién ver */}
        <aside className="grid content-start gap-5">
          <section>
            <h2 className="text-[1.1rem] font-semibold" style={{ fontFamily: TITULO }}>Agenda de hoy</h2>
            <ul className="mt-2 grid gap-1.5">
              {m.agenda.map((c) => (
                <li key={c.hora + c.quien}>
                  <button type="button" onClick={() => setSel(c.quien)} className="flex w-full items-center gap-3 rounded-lg border-2 bg-white p-2.5 text-left" style={{ borderColor: sel === c.quien ? PINO : "rgba(29,74,66,.15)", opacity: c.listo ? 0.6 : 1 }}>
                    <b className="w-11 text-[0.95rem] tabular-nums">{c.hora}</b>
                    <span className="min-w-0 flex-1 leading-tight"><b className="block truncate text-[0.92rem]">{c.quien}</b><span className="block truncate text-[0.8rem] opacity-70">{c.motivo}</span></span>
                    {c.listo ? <Check size={16} style={{ color: PINO2 }} /> : c.nueva ? <span className="rounded px-1.5 py-0.5 text-[0.68rem] font-bold text-white" style={{ background: OCRE }}>página</span> : null}
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-[1.1rem] font-semibold" style={{ fontFamily: TITULO }}>Crónicos: primero los altos</h2>
            <ul className="mt-2 grid gap-1.5">
              {crónicos.map((c) => (
                <li key={c.quien}><button type="button" onClick={() => setSel(c.quien)} className="flex w-full items-center gap-3 rounded-lg border-2 bg-white p-2.5 text-left" style={{ borderColor: sel === c.quien ? PINO : "rgba(29,74,66,.15)" }}>
                  <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: c.alto ? ROJO : c.dias > 7 ? OCRE : PINO2 }} />
                  <span className="min-w-0 flex-1 leading-tight"><b className="block truncate text-[0.92rem]">{c.quien}</b><span className="block truncate text-[0.8rem] opacity-70">{c.alto ? "Lectura alta" : c.dias > 7 ? `No anota hace ${c.dias} días` : "Estable"}</span></span>
                </button></li>
              ))}
            </ul>
          </section>
        </aside>

        {/* centro: el paciente */}
        <main className="min-w-0 rounded-2xl border-2 bg-white p-5" style={{ borderColor: PINO }}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h1 className="text-[1.9rem] leading-tight" style={{ fontFamily: TITULO, fontWeight: 600 }}>{p.quien}</h1><p className="opacity-75">{p.edad} años · {p.tiene} · Alergia: <b style={{ color: p.alergia !== "Ninguna" ? ROJO : "inherit" }}>{p.alergia}</b></p></div>
            {cita && !cita.listo && <Btn alTocar={() => m.terminar(cita.hora)} tipo="lleno"><Check size={18} /> Terminar consulta de las {cita.hora}</Btn>}
            {cita?.listo && <span className="rounded-full px-3 py-1.5 font-bold text-white" style={{ background: PINO2 }}>Consulta terminada</span>}
          </div>
          {ultima && <p className="mt-3 inline-block rounded-lg px-3 py-1.5 font-bold" style={{ background: p.alto ? "#fbe9e5" : "#e6f1ed", color: p.alto ? ROJO : PINO }}>Última lectura: {ultima.sis}/{ultima.dia2} · glucosa {ultima.glu}{p.alto ? " · ALTA" : ""}</p>}
          <div className="mt-4"><Grafica datos={p.lecturas} /></div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <section>
              <h2 className="flex items-center gap-2 text-[1.1rem] font-semibold" style={{ fontFamily: TITULO }}><FileText size={18} /> Nota de la consulta</h2>
              <label className="sr-only" htmlFor="nota">Nota de la consulta</label>
              <textarea id="nota" value={notas[p.quien] ?? ""} onChange={(e) => setNotas((n) => ({ ...n, [p.quien]: e.target.value }))} rows={7} placeholder="Motivo, examen físico, impresión y plan…" className="mt-2 w-full rounded-lg border-2 bg-white px-3 py-2.5" style={{ borderColor: PINO2 }} />
              <p className="text-[0.8rem] opacity-60">Se guarda sola mientras escribe. El paciente no la ve.</p>
            </section>
            <section>
              <h2 className="flex items-center gap-2 text-[1.1rem] font-semibold" style={{ fontFamily: TITULO }}><Pill size={18} /> Receta</h2>
              <ul className="mt-2 grid gap-1.5 rounded-lg p-3 text-[0.92rem]" style={{ background: PAPEL, border: `1.5px solid ${PINO2}` }}>
                {meds.map((x) => <li key={x} className="flex gap-2"><Check size={15} className="mt-1 shrink-0" style={{ color: PINO2 }} /> {x}</li>)}
                {meds.length === 0 && <li className="opacity-60">Sin medicinas por ahora.</li>}
              </ul>
              <div className="mt-2 flex gap-2"><label className="min-w-0 flex-1"><span className="sr-only">Medicina nueva</span><input value={nuevaMed} onChange={(e) => setNuevaMed(e.target.value)} placeholder="Ej. Enalapril 10 mg · 1 en la noche" className="w-full rounded-lg border-2 bg-white px-3 py-2.5" style={{ borderColor: PINO2 }} /></label><Btn alTocar={() => { if (nuevaMed.trim()) { setRecetas((r) => ({ ...r, [p.quien]: [...(r[p.quien] ?? []), nuevaMed.trim()] })); setNuevaMed(""); } }} tipo="borde"><Plus size={16} /> Agregar</Btn></div>
            </section>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Btn alTocar={() => { setPedidos((l) => [...l, p.quien]); setMsg(`Buenas, ${p.quien.split(" ")[0]}. Le habla el consultorio del doctor Samayoa. Le pedimos estos exámenes: ${p.tiene.includes("Diabetes") ? "hemoglobina glicosilada, glucosa en ayunas y perfil de lípidos" : "hematología, glucosa y creatinina"}. Vaya en ayunas de 8 horas. Los resultados nos llegan directo.`); }} tipo="ocre"><FlaskConical size={18} /> Pedir laboratorios</Btn>
            <Btn alTocar={() => setMsg(p.alto ? `Buenas, ${p.quien.split(" ")[0]}. Le habla el doctor Samayoa. Vi su lectura de hoy (${ultima?.sis}/${ultima?.dia2}). Tómese la medicina como siempre y vuelva a medirse en la tarde. Si sigue alta o siente dolor de cabeza fuerte, venga de una vez. Le aparto un espacio mañana a las 9:45.` : `Buenas, ${p.quien.split(" ")[0]}. Le saludamos del consultorio del doctor Samayoa. ¿Cómo se ha sentido? Recuerde anotar su presión y su glucosa en la app para que yo la revise.`)} tipo="borde"><Send size={16} /> Escribirle</Btn>
          </div>
          {pedidos.includes(p.quien) && <p className="mt-3 flex items-center gap-2 font-semibold" style={{ color: PINO2 }}><Check size={18} /> Laboratorios pedidos a {p.quien.split(" ")[0]}</p>}
          <button type="button" onClick={() => setNuevo(true)} className="mt-4 text-[0.88rem] font-semibold underline opacity-70">Registrar una lectura de hoy</button>
        </main>

        {/* derecha: pendientes del doctor */}
        <aside className="grid content-start gap-5">
          <section className="rounded-2xl p-4 text-white" style={{ background: PINO }}>
            <h2 className="flex items-center gap-2 text-[1.1rem] font-semibold" style={{ fontFamily: TITULO }}><Pill size={18} /> Recetas por renovar</h2>
            {m.renovar ? (<div className="mt-2"><p><b>Marta Lidia Ramírez</b> pide su receta de losartán, metformina y aspirina. Le quedan 4 días.</p><button type="button" onClick={m.firmarReceta} className="mt-3 min-h-[2.75rem] rounded-lg bg-white px-4 py-2 font-bold" style={{ color: PINO }}>Firmar y mandar</button></div>) : <p className="mt-2 text-white/80">{m.renovada ? "Receta de Marta Lidia firmada y enviada." : "No hay pedidos. Pruebe pedir una desde «Mi control»."}</p>}
          </section>
          <section className="rounded-2xl border-2 bg-white p-4" style={{ borderColor: "rgba(29,74,66,.2)" }}>
            <h2 className="flex items-center gap-2 text-[1.1rem] font-semibold" style={{ fontFamily: TITULO }}><FlaskConical size={18} style={{ color: OCRE }} /> Laboratorios por revisar</h2>
            <ul className="mt-2 grid gap-2.5">
              {labs.map((l) => (
                <li key={l.id} className="rounded-lg p-2.5" style={{ background: PAPEL, border: `1.5px solid ${l.fuera > 0 && !l.visto ? OCRE : "rgba(29,74,66,.15)"}` }}>
                  <p className="font-bold leading-tight">{l.quien}</p><p className="text-[0.85rem] opacity-75">{l.examen}</p>
                  <p className="mt-1 text-[0.85rem] font-semibold" style={{ color: l.fuera > 0 ? ROJO : PINO2 }}>{l.fuera > 0 ? `${l.fuera} valores fuera de rango` : "Todo normal"}</p>
                  {l.visto ? <p className="mt-1 text-[0.85rem] font-bold" style={{ color: PINO2 }}>Revisado</p> : <div className="mt-2"><Btn alTocar={() => setLabs((x) => x.map((y) => (y.id === l.id ? { ...y, visto: true } : y)))} tipo="borde"><Check size={15} /> Marcar revisado</Btn></div>}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {nuevo && <LecturaHoy alCerrar={() => setNuevo(false)} />}
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="consultorio médico" que="el mensaje para el paciente" />
    </div>
  );
}

function LecturaHoy({ alCerrar }: { alCerrar: () => void }) {
  const [v, setV] = useState({ sis: "", dia: "", glu: "" });
  const [ok, setOk] = useState(false);
  const c = "mt-1 w-full rounded-lg border-2 bg-white px-3 py-2.5 font-normal";
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4" onClick={alCerrar}>
      <div role="dialog" aria-label="Lectura de hoy" onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-5">
        <div className="flex items-center justify-between"><h2 className="text-[1.4rem] font-semibold" style={{ fontFamily: TITULO }}>Lectura de hoy</h2><button type="button" aria-label="Cerrar" onClick={alCerrar} className="rounded-lg border-2 p-2" style={{ borderColor: PINO }}><X size={18} /></button></div>
        <p className="text-[0.88rem] opacity-70">En consulta, el doctor la anota aquí. En su casa, el paciente la anota desde «Mi control».</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <label className="text-[0.85rem] font-bold">Sistólica<input value={v.sis} onChange={(e) => setV({ ...v, sis: e.target.value })} inputMode="numeric" className={c} style={{ borderColor: PINO2 }} /></label>
          <label className="text-[0.85rem] font-bold">Diastólica<input value={v.dia} onChange={(e) => setV({ ...v, dia: e.target.value })} inputMode="numeric" className={c} style={{ borderColor: PINO2 }} /></label>
          <label className="text-[0.85rem] font-bold">Glucosa<input value={v.glu} onChange={(e) => setV({ ...v, glu: e.target.value })} inputMode="numeric" className={c} style={{ borderColor: PINO2 }} /></label>
        </div>
        {ok && <p className="mt-3 flex items-center gap-2 font-semibold" style={{ color: PINO2 }}><Check size={18} /> Lectura guardada en la historia.</p>}
        <div className="mt-4"><Btn ancho alTocar={() => setOk(true)}><Check size={18} /> Guardar lectura</Btn></div>
      </div>
    </div>
  );
}
