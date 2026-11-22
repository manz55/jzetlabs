/*
 * Panel de Clínica Visual Lumen: la pantalla de turnos de recepción, más pacientes, cirugías y óptica.
 * Identidad propia: azul noche, turquesa y coral; Fraunces para los títulos y números grandes tipo turno de banco.
 * Lo que se ve primero: el retraso del día y quién espera. Lo que se llena: ficha con graduación, cirugía con requisitos y orden de lentes.
 */
import { useState, type ReactNode } from "react";
import { ArrowRight, Bell, Check, CircleCheck, Glasses, Plus, Search, UserCheck, X } from "lucide-react";
import { MensajeWhatsApp, qz } from "../comun";
import {
  AROS, AVISO, CIRUGIAS_INICIAL, CORAL, ETAPAS_LENTES, FICHAS_INICIAL, HIELO, LENTES_INICIAL, MICAS, NOCHE, OK, PAPEL, PRECIO_ARO, REQUISITOS, RESENAS_PANEL, SEDES_ESPERA, SEMANAS, TURNOS_INICIAL, TURQ,
  type Cirugia, type EstadoTurno, type Ficha, type Lentes, type Turno,
} from "./panel";

const TITULO = "'Fraunces', Georgia, serif";
const NUM = "'Libre Franklin', system-ui, sans-serif";

const btnBase = "inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[0.95rem] font-bold shadow-sm transition hover:brightness-95 active:scale-[0.98]";
function Btn({ children, alTocar, color = TURQ, ancho = false, borde = false }: { children: ReactNode; alTocar: () => void; color?: string; ancho?: boolean; borde?: boolean }) {
  return (
    <button type="button" onClick={alTocar} className={`${btnBase} ${ancho ? "w-full" : ""}`} style={borde ? { background: "#fff", color: NOCHE, border: `2px solid ${NOCHE}` } : { background: color, color: "#fff", border: `2px solid ${color}` }}>
      {children}
    </button>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 48 48" width={34} height={34} aria-hidden className="shrink-0">
      <circle cx="24" cy="24" r="22" fill="#fff" />
      <circle cx="24" cy="24" r="12.5" fill={TURQ} />
      <circle cx="24" cy="24" r="6" fill={NOCHE} />
    </svg>
  );
}

const TABS = ["Turnos", "Pacientes", "Cirugías", "Óptica", "Reseñas", "Reportes"] as const;
type Tab = (typeof TABS)[number];

function suma(h: string, min: number) {
  const [a, b] = h.split(":").map(Number);
  const t = a * 60 + b + min;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

export default function PanelLumen() {
  const [tab, setTab] = useState<Tab>("Turnos");
  const [turnos, setTurnos] = useState<Turno[]>(TURNOS_INICIAL);
  const [retraso, setRetraso] = useState(0);
  const [fichas, setFichas] = useState<Ficha[]>(FICHAS_INICIAL);
  const [cirugias, setCirugias] = useState<Cirugia[]>(CIRUGIAS_INICIAL);
  const [lentes, setLentes] = useState<Lentes[]>(LENTES_INICIAL);
  const [msg, setMsg] = useState<string | null>(null);
  const [sede, setSede] = useState("Zona 10");

  const enSala = turnos.filter((t) => t.estado === "espera");
  const sinResponder = RESENAS_PANEL.length;

  function avanzar(id: string) {
    const orden: EstadoTurno[] = ["cita", "espera", "consulta", "listo"];
    setTurnos((l) => l.map((t) => (t.id === id ? { ...t, estado: orden[Math.min(3, orden.indexOf(t.estado) + 1)], llego: t.estado === "cita" ? "09:55" : t.llego } : t)));
  }
  function avisarRetraso() {
    const nuevo = retraso + 15;
    setRetraso(nuevo);
    const prox = turnos.find((t) => t.estado === "espera" || t.estado === "cita");
    if (prox) setMsg(`Hola, ${prox.nombre.split(" ")[0]}. Le avisamos de Clínica Visual Lumen: hoy llevamos ${nuevo} minutos de retraso. Su nueva hora aproximada es ${suma(prox.hora, nuevo)}. No tiene que apurarse, le esperamos.`);
  }

  return (
    <div className="panel-demo min-h-[calc(100vh-8rem)]" style={{ background: PAPEL, color: NOCHE, fontFamily: "'Instrument Sans', system-ui, sans-serif" }}>
      {/* barra de arriba: marca, sucursal y pestañas */}
      <header style={{ background: NOCHE }} className="text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3">
          <span className="flex items-center gap-2.5"><Logo /><span className="leading-none"><span className="block text-[1.25rem] font-semibold" style={{ fontFamily: TITULO }}>Lumen</span><span className="text-[0.72rem] opacity-70">Recepción</span></span></span>
          <label className="text-[0.85rem]"><span className="sr-only">Sucursal</span>
            <select value={sede} onChange={(e) => setSede(e.target.value)} className="rounded-lg border-0 bg-white/10 px-3 py-2 font-semibold text-white">
              {["Zona 10", "Mixco", "Villa Nueva"].map((s) => <option key={s} className="text-black">{s}</option>)}
            </select>
          </label>
          <span className="ml-auto text-[0.85rem] opacity-80">Sábado 21 de noviembre · Marta Solís</span>
        </div>
        <nav aria-label="Panel" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3">
          {TABS.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} aria-current={tab === t ? "page" : undefined} className="relative whitespace-nowrap px-4 py-3 text-[0.98rem] font-bold" style={tab === t ? { color: "#fff", borderBottom: `4px solid ${CORAL}` } : { color: "rgba(255,255,255,.62)", borderBottom: "4px solid transparent" }}>
              {t}{t === "Reseñas" && sinResponder > 0 && <span className="ml-1.5 rounded-full px-1.5 py-0.5 text-[0.7rem]" style={{ background: CORAL }}>{sinResponder}</span>}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        {tab === "Turnos" && <Turnos turnos={turnos} retraso={retraso} enSala={enSala.length} avanzar={avanzar} avisar={avisarRetraso} alDia={() => setRetraso(0)} ir={setTab} />}
        {tab === "Pacientes" && <Pacientes fichas={fichas} setFichas={setFichas} avisar={setMsg} />}
        {tab === "Cirugías" && <Cirugias cirugias={cirugias} setCirugias={setCirugias} avisar={setMsg} />}
        {tab === "Óptica" && <Optica lentes={lentes} setLentes={setLentes} avisar={setMsg} />}
        {tab === "Reseñas" && <Resenas />}
        {tab === "Reportes" && <Reportes />}
      </main>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="clínica oftalmológica" que="el mensaje" />
    </div>
  );
}

/* ---------- Turnos: la pantalla de la sala de espera ---------- */

function Turnos({ turnos, retraso, enSala, avanzar, avisar, alDia, ir }: { turnos: Turno[]; retraso: number; enSala: number; avanzar: (id: string) => void; avisar: () => void; alDia: () => void; ir: (t: Tab) => void }) {
  const columnas: { id: EstadoTurno; titulo: string; color: string }[] = [
    { id: "cita", titulo: "Por llegar", color: "#4a5a70" },
    { id: "espera", titulo: "En sala de espera", color: AVISO },
    { id: "consulta", titulo: "Con el doctor", color: TURQ },
  ];
  const boton: Record<EstadoTurno, { t: string; i: ReactNode }> = {
    cita: { t: "Ya llegó", i: <UserCheck size={18} /> },
    espera: { t: "Pasar a consulta", i: <ArrowRight size={18} /> },
    consulta: { t: "Terminó la consulta", i: <Check size={18} /> },
    listo: { t: "", i: null },
  };
  const atendidos = turnos.filter((t) => t.estado === "listo");
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-wrap items-center gap-5 rounded-2xl p-5 text-white" style={{ background: retraso ? CORAL : NOCHE }}>
          <div>
            <p className="text-[0.85rem] font-semibold opacity-80">Retraso del día</p>
            <p className="text-[3.4rem] font-semibold leading-none" style={{ fontFamily: TITULO }}>{retraso ? `${retraso} min` : "Al día"}</p>
          </div>
          <div className="flex-1 min-w-[12rem]">
            <p className="text-[0.95rem] leading-snug opacity-90">{enSala > 0 ? `${enSala} paciente${enSala > 1 ? "s" : ""} esperando en sala.` : "Nadie esperando."} {retraso ? "Ya se avisó a los que siguen." : "Si hay retraso, avise antes de que se desesperen."}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={avisar} className={`${btnBase} bg-white`} style={{ color: NOCHE }}><Bell size={18} /> Hay retraso: avisar a los que siguen</button>
              {retraso > 0 && <button type="button" onClick={alDia} className={`${btnBase} border-2 border-white/60 text-white`}>Ya nos pusimos al día</button>}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[["Citas de hoy", String(turnos.length)], ["Atendidos", String(atendidos.length)], ["Espera promedio", "14 min"], ["Reseñas por responder", String(RESENAS_PANEL.length)]].map(([t, v]) => (
            <button key={t} type="button" onClick={t.startsWith("Reseñas") ? () => ir("Reseñas") : undefined} className="rounded-2xl border bg-white p-4 text-left" style={{ borderColor: "rgba(11,37,69,.14)" }}>
              <span className="block text-[0.82rem] opacity-65">{t}</span>
              <span className="text-[2rem] font-semibold leading-tight" style={{ fontFamily: TITULO }}>{v}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-[0.92rem] opacity-70">Cuando pase algo, toque el botón de color del paciente. El número grande es su turno.</p>
      <div className="mt-3 grid gap-4 md:grid-cols-3">
        {columnas.map((c) => {
          const lista = turnos.filter((t) => t.estado === c.id);
          return (
            <section key={c.id} aria-label={c.titulo} className="rounded-2xl p-3" style={{ background: HIELO }}>
              <h2 className="flex items-center justify-between px-1 pb-2 text-[1.05rem] font-bold" style={{ color: c.color }}>{c.titulo}<span className="rounded-full bg-white px-2.5 py-0.5 text-[0.85rem]" style={{ color: NOCHE }}>{lista.length}</span></h2>
              <div className="space-y-3">
                {lista.map((t) => (
                  <article key={t.id} className="rounded-xl border-2 bg-white p-3" style={{ borderColor: c.color }}>
                    <div className="flex items-start gap-3">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg text-[1.55rem] font-extrabold text-white" style={{ background: c.color, fontFamily: NUM }} aria-label={`Turno ${t.num}`}>{String(t.num).padStart(2, "0")}</span>
                      <div className="min-w-0">
                        <p className="font-bold leading-tight">{t.nombre}</p>
                        <p className="text-[0.85rem] opacity-70">{t.servicio} · {t.doctor}</p>
                        <p className="mt-0.5 text-[0.82rem] font-semibold tabular-nums opacity-80">Cita {t.hora}{t.llego ? ` · llegó ${t.llego}` : ""}</p>
                      </div>
                    </div>
                    {t.etiquetas.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{t.etiquetas.map((e) => <span key={e} className="rounded-full px-2 py-0.5 text-[0.75rem] font-semibold" style={{ background: HIELO }}>{e}</span>)}</div>}
                    <div className="mt-3"><Btn alTocar={() => avanzar(t.id)} color={c.color} ancho>{boton[t.estado].i} {boton[t.estado].t}</Btn></div>
                  </article>
                ))}
                {lista.length === 0 && <p className="rounded-xl border-2 border-dashed p-4 text-center text-[0.9rem] opacity-60" style={{ borderColor: "rgba(11,37,69,.2)" }}>Nadie aquí.</p>}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-5 rounded-2xl border bg-white p-4" style={{ borderColor: "rgba(11,37,69,.14)" }}>
        <h2 className="font-bold" style={{ fontFamily: TITULO }}>Ya atendidos hoy</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {atendidos.map((t) => <li key={t.id} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.88rem] font-semibold text-white" style={{ background: OK }}><CircleCheck size={15} /> {String(t.num).padStart(2, "0")} · {t.nombre}</li>)}
          {atendidos.length === 0 && <li className="opacity-60">Todavía nadie.</li>}
        </ul>
      </section>
    </>
  );
}

/* ---------- Pacientes: la ficha que hay que llenar ---------- */

function Pacientes({ fichas, setFichas, avisar }: { fichas: Ficha[]; setFichas: (f: (l: Ficha[]) => Ficha[]) => void; avisar: (m: string) => void }) {
  const [q, setQ] = useState("");
  const [abierta, setAbierta] = useState<Ficha | null>(null);
  const [nueva, setNueva] = useState(false);
  const filas = fichas.filter((f) => `${f.nombre} ${f.tel}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[14rem] flex-1 md:max-w-md"><span className="sr-only">Buscar paciente</span><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-55" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre o teléfono" className="w-full rounded-lg border bg-white py-3 pl-10 pr-3" style={{ borderColor: "rgba(11,37,69,.2)" }} /></label>
        <Btn alTocar={() => setNueva(true)} color={CORAL}><Plus size={18} /> Llenar ficha nueva</Btn>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filas.map((f) => (
          <button key={f.id} type="button" onClick={() => setAbierta(f)} className="rounded-2xl border bg-white p-4 text-left transition hover:shadow-md" style={{ borderColor: "rgba(11,37,69,.14)" }}>
            <p className="text-[1.15rem] font-semibold" style={{ fontFamily: TITULO }}>{f.nombre}</p>
            <p className="text-[0.85rem] opacity-70">{f.edad} años · {f.tel} · {f.seguro}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg p-2.5 text-[0.82rem] tabular-nums" style={{ background: HIELO }}>
              <p><span className="block text-[0.7rem] font-bold uppercase opacity-60">Ojo derecho</span>{f.od}</p>
              <p><span className="block text-[0.7rem] font-bold uppercase opacity-60">Ojo izquierdo</span>{f.oi}</p>
            </div>
            <p className="mt-2 text-[0.85rem]"><b>Próxima:</b> {f.proxima}{f.diabetes && <span className="ml-2 rounded-full px-2 py-0.5 text-[0.72rem] font-bold text-white" style={{ background: AVISO }}>Diabético</span>}</p>
          </button>
        ))}
        {filas.length === 0 && <p className="opacity-65">Nadie coincide con «{q}».</p>}
      </div>
      {abierta && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40" onClick={() => setAbierta(null)}>
          <aside role="dialog" aria-label={`Ficha de ${abierta.nombre}`} onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3"><h2 className="text-[1.6rem] font-semibold" style={{ fontFamily: TITULO }}>{abierta.nombre}</h2><button type="button" aria-label="Cerrar ficha" onClick={() => setAbierta(null)} className="rounded-lg border p-2"><X size={18} /></button></div>
            <p className="opacity-70">{abierta.edad} años · {abierta.tel} · {abierta.seguro}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl p-3 text-[0.9rem]" style={{ background: HIELO }}>
              <div><dt className="text-[0.72rem] font-bold uppercase opacity-60">Ojo derecho</dt><dd className="font-semibold tabular-nums">{abierta.od}</dd></div>
              <div><dt className="text-[0.72rem] font-bold uppercase opacity-60">Ojo izquierdo</dt><dd className="font-semibold tabular-nums">{abierta.oi}</dd></div>
              <div><dt className="text-[0.72rem] font-bold uppercase opacity-60">Presión del ojo</dt><dd className="font-semibold">{abierta.pio}</dd></div>
              <div><dt className="text-[0.72rem] font-bold uppercase opacity-60">Diabetes</dt><dd className="font-semibold">{abierta.diabetes ? "Sí" : "No"}</dd></div>
            </dl>
            <p className="mt-4 rounded-xl border p-3 text-[0.92rem]" style={{ borderColor: "rgba(11,37,69,.14)" }}><b>Nota del doctor:</b> {abierta.nota}</p>
            <h3 className="mt-5 font-bold">Historial</h3>
            <ol className="mt-2 space-y-3 border-l-4 pl-4" style={{ borderColor: TURQ }}>{abierta.historial.map((h) => <li key={h.fecha + h.texto}><p className="text-[0.8rem] font-semibold opacity-60">{h.fecha}</p><p>{h.texto}</p></li>)}</ol>
            <div className="mt-6"><Btn alTocar={() => avisar(`Hola, ${abierta.nombre.split(" ")[0]}. Le escribimos de Clínica Visual Lumen. Su próxima cita: ${abierta.proxima.toLowerCase()}. Si necesita cambiarla, responda a este mensaje.`)}>Escribirle por WhatsApp</Btn></div>
          </aside>
        </div>
      )}
      {nueva && <FichaNueva alCerrar={() => setNueva(false)} alGuardar={(f) => { setFichas((l) => [f, ...l]); setNueva(false); }} />}
    </>
  );
}

function FichaNueva({ alCerrar, alGuardar }: { alCerrar: () => void; alGuardar: (f: Ficha) => void }) {
  const [v, setV] = useState({ nombre: "", tel: "", edad: "", seguro: "Particular", diabetes: false, od: "", oi: "", pio: "", nota: "" });
  const [error, setError] = useState("");
  const campo = "mt-1 w-full rounded-lg border bg-white px-3 py-2.5 font-normal";
  const bor = { borderColor: "rgba(11,37,69,.25)" };
  function guardar() {
    if (!v.nombre.trim()) return setError("Escriba el nombre del paciente.");
    alGuardar({ id: `f${Date.now()}`, nombre: v.nombre.trim(), tel: v.tel || "—", edad: Number(v.edad) || 0, seguro: v.seguro, diabetes: v.diabetes, od: v.od || "Pendiente", oi: v.oi || "Pendiente", pio: v.pio || "—", ultima: "Hoy", proxima: "Por agendar", nota: v.nota || "Sin notas.", historial: [{ fecha: "Hoy", texto: "Ficha creada en recepción." }] });
  }
  return (
    <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-black/40 p-4" onClick={alCerrar}>
      <div role="dialog" aria-label="Ficha nueva" onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between"><h2 className="text-[1.5rem] font-semibold" style={{ fontFamily: TITULO }}>Ficha del paciente</h2><button type="button" aria-label="Cerrar" onClick={alCerrar} className="rounded-lg border p-2"><X size={18} /></button></div>
        <p className="text-[0.9rem] opacity-70">Esto es lo que recepción y el doctor llenan la primera vez.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-[0.9rem] font-bold sm:col-span-2">Nombre<input value={v.nombre} onChange={(e) => setV({ ...v, nombre: e.target.value })} className={campo} style={bor} placeholder="Ej. Marta López" /></label>
          <label className="text-[0.9rem] font-bold">Teléfono<input value={v.tel} onChange={(e) => setV({ ...v, tel: e.target.value })} inputMode="tel" className={campo} style={bor} /></label>
          <label className="text-[0.9rem] font-bold">Edad<input value={v.edad} onChange={(e) => setV({ ...v, edad: e.target.value })} inputMode="numeric" className={campo} style={bor} /></label>
          <label className="text-[0.9rem] font-bold">Seguro<select value={v.seguro} onChange={(e) => setV({ ...v, seguro: e.target.value })} className={campo} style={bor}><option>Particular</option><option>Seguro médico</option></select></label>
          <label className="flex items-center gap-2 pt-6 text-[0.95rem] font-bold"><input type="checkbox" checked={v.diabetes} onChange={(e) => setV({ ...v, diabetes: e.target.checked })} className="h-5 w-5" /> Tiene diabetes</label>
          <label className="text-[0.9rem] font-bold">Ojo derecho (graduación)<input value={v.od} onChange={(e) => setV({ ...v, od: e.target.value })} className={campo} style={bor} placeholder="-1.50 -0.50 x 180" /></label>
          <label className="text-[0.9rem] font-bold">Ojo izquierdo (graduación)<input value={v.oi} onChange={(e) => setV({ ...v, oi: e.target.value })} className={campo} style={bor} placeholder="-1.75" /></label>
          <label className="text-[0.9rem] font-bold">Presión del ojo<input value={v.pio} onChange={(e) => setV({ ...v, pio: e.target.value })} className={campo} style={bor} placeholder="15 / 16" /></label>
          <label className="text-[0.9rem] font-bold sm:col-span-2">Nota del doctor<textarea value={v.nota} onChange={(e) => setV({ ...v, nota: e.target.value })} rows={2} className={campo} style={bor} /></label>
        </div>
        {error && <p role="alert" className="mt-3 font-bold" style={{ color: CORAL }}>{error}</p>}
        <div className="mt-4"><Btn alTocar={guardar} ancho><Check size={18} /> Guardar ficha</Btn></div>
      </div>
    </div>
  );
}

/* ---------- Cirugías: requisitos que hay que cumplir ---------- */

function Cirugias({ cirugias, setCirugias, avisar }: { cirugias: Cirugia[]; setCirugias: (f: (l: Cirugia[]) => Cirugia[]) => void; avisar: (m: string) => void }) {
  const alternar = (id: string, i: number) => setCirugias((l) => l.map((c) => (c.id === id ? { ...c, listo: c.listo.map((x, j) => (j === i ? !x : x)) } : c)));
  return (
    <>
      <h1 className="text-[1.8rem] font-semibold" style={{ fontFamily: TITULO }}>Cirugías de las próximas semanas</h1>
      <p className="mt-1 max-w-2xl opacity-75">Cada cirugía tiene cinco cosas que deben estar listas. Marque lo que ya se cumplió; lo que falte se ve en rojo.</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {cirugias.map((c) => {
          const hechos = c.listo.filter(Boolean).length;
          const completo = hechos === REQUISITOS.length;
          return (
            <article key={c.id} className="rounded-2xl border-2 bg-white p-4" style={{ borderColor: completo ? OK : "rgba(11,37,69,.18)" }}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div><p className="text-[0.82rem] font-bold uppercase" style={{ color: TURQ }}>{c.fecha} · {c.hora}</p><h2 className="text-[1.25rem] font-semibold" style={{ fontFamily: TITULO }}>{c.paciente}</h2><p className="text-[0.9rem] opacity-75">{c.procedimiento} · {c.doctor} · {qz(c.total)}</p></div>
                <span className="rounded-full px-3 py-1 text-[0.85rem] font-bold text-white" style={{ background: completo ? OK : hechos >= 3 ? AVISO : CORAL }}>{completo ? "Todo listo" : `Faltan ${REQUISITOS.length - hechos}`}</span>
              </div>
              <ul className="mt-3 grid gap-1.5">
                {REQUISITOS.map((r, i) => (
                  <li key={r}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5" style={{ borderColor: c.listo[i] ? OK : CORAL, background: c.listo[i] ? "#eef8f1" : "#fff6f4" }}>
                      <input type="checkbox" checked={c.listo[i]} onChange={() => alternar(c.id, i)} className="h-5 w-5" />
                      <span className="flex-1 font-semibold">{r}</span>
                      {c.listo[i] ? <Check size={18} style={{ color: OK }} /> : <span className="text-[0.82rem] font-bold" style={{ color: CORAL }}>Falta</span>}
                    </label>
                  </li>
                ))}
              </ul>
              {!completo && <div className="mt-3"><Btn alTocar={() => avisar(`Hola, ${c.paciente.split(" ")[0]}. Le escribimos de Clínica Visual Lumen sobre su cirugía del ${c.fecha.toLowerCase()} a las ${c.hora}. Nos falta: ${REQUISITOS.filter((_, i) => !c.listo[i]).join(", ").toLowerCase()}. ¿Nos ayuda a completarlo?`)} borde>Avisarle lo que falta</Btn></div>}
            </article>
          );
        })}
      </div>
    </>
  );
}

/* ---------- Óptica: de la orden a la entrega ---------- */

function Optica({ lentes, setLentes, avisar }: { lentes: Lentes[]; setLentes: (f: (l: Lentes[]) => Lentes[]) => void; avisar: (m: string) => void }) {
  const [form, setForm] = useState({ paciente: "", aro: AROS[0], mica: MICAS[0][0], abono: "" });
  const [error, setError] = useState("");
  const total = (PRECIO_ARO[form.aro] ?? 0) + (MICAS.find((m) => m[0] === form.mica)?.[1] ?? 0);
  const abono = Math.min(total, Number(form.abono) || 0);
  function crear() {
    if (!form.paciente.trim()) return setError("Escriba el nombre del paciente.");
    setError("");
    setLentes((l) => [{ id: `l${Date.now()}`, paciente: form.paciente.trim(), aro: form.aro, mica: form.mica, total, abono, etapa: 0, prometido: "Vie 28 nov" }, ...l]);
    setForm({ paciente: "", aro: AROS[0], mica: MICAS[0][0], abono: "" });
  }
  return (
    <>
      <h1 className="text-[1.8rem] font-semibold" style={{ fontFamily: TITULO }}>Lentes: del pedido a la entrega</h1>
      <div className="mt-4 rounded-2xl border bg-white p-4" style={{ borderColor: "rgba(11,37,69,.14)" }}>
        <h2 className="flex items-center gap-2 font-bold"><Glasses size={20} style={{ color: TURQ }} /> Orden de lentes nueva</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-[0.88rem] font-bold">Paciente<input value={form.paciente} onChange={(e) => setForm({ ...form, paciente: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2.5 font-normal" style={{ borderColor: "rgba(11,37,69,.25)" }} /></label>
          <label className="text-[0.88rem] font-bold">Aro<select value={form.aro} onChange={(e) => setForm({ ...form, aro: e.target.value })} className="mt-1 w-full rounded-lg border bg-white px-3 py-2.5 font-normal" style={{ borderColor: "rgba(11,37,69,.25)" }}>{AROS.map((a) => <option key={a}>{a}</option>)}</select></label>
          <label className="text-[0.88rem] font-bold">Mica<select value={form.mica} onChange={(e) => setForm({ ...form, mica: e.target.value })} className="mt-1 w-full rounded-lg border bg-white px-3 py-2.5 font-normal" style={{ borderColor: "rgba(11,37,69,.25)" }}>{MICAS.map((m) => <option key={m[0]}>{m[0]}</option>)}</select></label>
          <label className="text-[0.88rem] font-bold">Abono (Q)<input value={form.abono} onChange={(e) => setForm({ ...form, abono: e.target.value })} inputMode="numeric" className="mt-1 w-full rounded-lg border px-3 py-2.5 font-normal" style={{ borderColor: "rgba(11,37,69,.25)" }} /></label>
          <div className="rounded-lg p-3 text-[0.88rem]" style={{ background: HIELO }}><p>Total <b>{qz(total)}</b></p><p>Saldo <b>{qz(total - abono)}</b></p></div>
        </div>
        {error && <p role="alert" className="mt-2 font-bold" style={{ color: CORAL }}>{error}</p>}
        <div className="mt-3"><Btn alTocar={crear}><Plus size={18} /> Crear la orden</Btn></div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {ETAPAS_LENTES.map((e, i) => (
          <section key={e} aria-label={e} className="rounded-2xl p-3" style={{ background: HIELO }}>
            <h2 className="px-1 pb-2 font-bold">{e} <span className="ml-1 rounded-full bg-white px-2 text-[0.82rem]">{lentes.filter((l) => l.etapa === i).length}</span></h2>
            <div className="space-y-2.5">
              {lentes.filter((l) => l.etapa === i).map((l) => (
                <article key={l.id} className="rounded-xl border bg-white p-3" style={{ borderColor: "rgba(11,37,69,.14)" }}>
                  <p className="font-bold leading-tight">{l.paciente}</p>
                  <p className="text-[0.85rem] opacity-75">{l.aro} · {l.mica}</p>
                  <p className="mt-1 text-[0.85rem] tabular-nums">Total {qz(l.total)} · {l.total - l.abono > 0 ? <b style={{ color: CORAL }}>debe {qz(l.total - l.abono)}</b> : <b style={{ color: OK }}>pagado</b>}</p>
                  <p className="text-[0.8rem] opacity-60">Prometido: {l.prometido}</p>
                  <div className="mt-2 grid gap-1.5">
                    {i < 3 && <Btn alTocar={() => setLentes((x) => x.map((y) => (y.id === l.id ? { ...y, etapa: y.etapa + 1 } : y)))} ancho>Pasar a: {ETAPAS_LENTES[i + 1]} <ArrowRight size={16} /></Btn>}
                    {i === 2 && <Btn alTocar={() => avisar(`Hola, ${l.paciente.split(" ")[0]}. Sus lentes ya están listos en Clínica Visual Lumen. ${l.total - l.abono > 0 ? `Queda un saldo de ${qz(l.total - l.abono)}. ` : ""}Puede pasar a recogerlos en nuestro horario de atención.`)} borde><Bell size={16} /> Avisar que están listos</Btn>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

/* ---------- Reseñas y reportes ---------- */

function Resenas() {
  const [hechas, setHechas] = useState<string[]>([]);
  return (
    <>
      <h1 className="text-[1.8rem] font-semibold" style={{ fontFamily: TITULO }}>Reseñas por responder</h1>
      <p className="mt-1 opacity-75">La queja no se queda sola en Google: se responde desde aquí, con un texto listo que puede cambiar.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {RESENAS_PANEL.map((r) => (
          <article key={r.id} className="rounded-2xl border bg-white p-4" style={{ borderColor: "rgba(11,37,69,.14)" }}>
            <p className="font-bold">{r.nombre} <span className="font-normal opacity-60">· {r.fecha} · {r.estrellas} de 5 estrellas</span></p>
            <p className="mt-1.5">{r.texto}</p>
            {hechas.includes(r.id) ? <p className="mt-3 flex items-center gap-2 font-bold" style={{ color: OK }}><Check size={18} /> Respondida</p> : (<><p className="mt-3 rounded-xl p-3 text-[0.92rem]" style={{ background: HIELO }}>{r.sugerida}</p><div className="mt-3"><Btn alTocar={() => setHechas((l) => [...l, r.id])}>Publicar respuesta</Btn></div></>)}
          </article>
        ))}
      </div>
    </>
  );
}

function Reportes() {
  const max = Math.max(...SEMANAS.map((s) => s.v));
  return (
    <>
      <h1 className="text-[1.8rem] font-semibold" style={{ fontFamily: TITULO }}>Cómo va noviembre</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[["Pacientes del mes", "412", "+8% que octubre"], ["Inasistencias", "6%", "Antes de recordar: 14%"], ["Espera promedio", "14 min", "Meta: menos de 15"], ["Ingresos", qz(186400), "Consultas, cirugías y lentes"]].map(([t, v, n]) => (
          <div key={t} className="rounded-2xl border bg-white p-4" style={{ borderColor: "rgba(11,37,69,.14)" }}><p className="text-[0.82rem] opacity-65">{t}</p><p className="text-[1.9rem] font-semibold" style={{ fontFamily: TITULO }}>{v}</p><p className="text-[0.8rem] opacity-60">{n}</p></div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border bg-white p-4" style={{ borderColor: "rgba(11,37,69,.14)" }}>
          <h2 className="font-bold">Pacientes por semana</h2>
          <div className="mt-4 flex h-40 items-end gap-3">{SEMANAS.map((s) => <div key={s.t} className="flex h-full flex-1 flex-col items-center justify-end gap-1"><span className="text-[0.75rem] font-semibold">{s.v}</span><span className="w-full rounded-t" style={{ height: `${(s.v / max) * 80}%`, background: TURQ }} /><span className="text-[0.75rem] opacity-60">{s.t}</span></div>)}</div>
        </section>
        <section className="rounded-2xl border bg-white p-4" style={{ borderColor: "rgba(11,37,69,.14)" }}>
          <h2 className="font-bold">Espera promedio por sucursal (minutos)</h2>
          <ul className="mt-4 space-y-3">{SEDES_ESPERA.map((s) => <li key={s.t}><div className="flex justify-between"><span>{s.t}</span><b>{s.v} min</b></div><span className="mt-1 block h-2.5 overflow-hidden rounded-full bg-black/10"><span className="block h-full rounded-full" style={{ width: `${(s.v / 20) * 100}%`, background: s.v > 12 ? AVISO : OK }} /></span></li>)}</ul>
        </section>
      </div>
    </>
  );
}
