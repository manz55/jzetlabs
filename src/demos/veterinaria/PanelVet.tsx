/*
 * Panel de Veterinaria Huesitos: la hoja de la clínica.
 * Identidad propia: verde botella, papel de libreta con renglones, sellos en mostaza; Young Serif y horas en IBM Plex Mono.
 * Lo que se ve primero: quién espera y qué medicina toca dar a los internados. Lo que se llena: ficha de la mascota y hoja de hospitalización.
 */
import { useState, type ReactNode } from "react";
import { ArrowRight, Bell, Check, ClipboardList, HeartPulse, Pill, Plus, Syringe, X } from "lucide-react";
import { MensajeWhatsApp } from "../comun";
import { AGENDA_INICIAL, PENDIENTES_INICIAL, SERVICIOS, TIENDA, qz, type Cita, type Internado, type Nota, type Pendiente } from "./datos";

const BOTELLA = "#1d4d3f";
const PAPEL = "#fffdf8";
const RENGLON = "#d9d3bf";
const SELLO = "#c98a14";
const ROJO = "#c2402f";
const OK = "#2c7a4b";
const TITULO = "'Young Serif', Georgia, serif";
const MONO = "'IBM Plex Mono', ui-monospace, Menlo, monospace";

const hoja = { background: PAPEL, border: `1.5px solid ${BOTELLA}`, borderRadius: 10, backgroundImage: `repeating-linear-gradient(transparent 0 31px, ${RENGLON} 31px 32px)`, backgroundPosition: "0 8px" } as const;
function Btn({ children, alTocar, tipo = "lleno", ancho = false }: { children: ReactNode; alTocar: () => void; tipo?: "lleno" | "sello" | "borde"; ancho?: boolean }) {
  const s = tipo === "lleno" ? { background: BOTELLA, color: "#fff" } : tipo === "sello" ? { background: SELLO, color: "#fff" } : { background: "#fff", color: BOTELLA, border: `2px solid ${BOTELLA}` };
  return <button type="button" onClick={alTocar} className={`inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.95rem] font-bold transition hover:brightness-110 active:scale-[0.98] ${ancho ? "w-full" : ""}`} style={s}>{children}</button>;
}
const Sello = ({ children, color = SELLO }: { children: ReactNode; color?: string }) => <span className="inline-block -rotate-2 rounded border-2 px-2 py-0.5 text-[0.78rem] font-extrabold uppercase tracking-wide" style={{ borderColor: color, color }}>{children}</span>;

const MEDS: Record<string, { h: string; t: string; d: string }[]> = {
  luna: [{ h: "08:00", t: "Suero Ringer", d: "20 ml por hora" }, { h: "12:00", t: "Antibiótico (amoxicilina)", d: "1 ml" }, { h: "16:00", t: "Suero Ringer", d: "20 ml por hora" }, { h: "20:00", t: "Antibiótico (amoxicilina)", d: "1 ml" }],
  max: [{ h: "12:00", t: "Analgésico", d: "0.5 ml" }, { h: "18:00", t: "Analgésico", d: "0.5 ml" }, { h: "22:00", t: "Revisar la herida", d: "" }],
};
const PACIENTES = [
  { id: "m1", nombre: "Toby", esp: "perro", raza: "Mestizo", peso: "20.9 kg", dueno: "Andrea López", tel: "5544 1290", alergia: "Ninguna", vacunas: "Rabia vence mañana" },
  { id: "m2", nombre: "Luna", esp: "gato", raza: "Siamés", peso: "3.8 kg", dueno: "Andrea López", tel: "5544 1290", alergia: "Penicilina", vacunas: "Al día" },
  { id: "m3", nombre: "Max", esp: "perro", raza: "Labrador", peso: "28 kg", dueno: "Sofía Ramírez", tel: "3390 1245", alergia: "Ninguna", vacunas: "Al día" },
  { id: "m4", nombre: "Kira", esp: "perro", raza: "Pastor", peso: "24 kg", dueno: "Daniel Pérez", tel: "4478 3321", alergia: "Pollo (alimento)", vacunas: "Séxtuple vencida" },
  { id: "m5", nombre: "Simba", esp: "gato", raza: "Mestizo", peso: "4.6 kg", dueno: "Ana Lucía Cruz", tel: "5021 9087", alergia: "Ninguna", vacunas: "Triple felina en 6 días" },
];
const INVENTARIO = [
  { id: "i1", n: "Vacuna de rabia", dosis: 18, min: 10, lote: "R-2291", vence: "mar 2027" },
  { id: "i2", n: "Vacuna séxtuple", dosis: 4, min: 10, lote: "S-1140", vence: "ene 2027" },
  { id: "i3", n: "Vacuna triple felina", dosis: 12, min: 6, lote: "T-0875", vence: "abr 2027" },
  { id: "i4", n: "Suero Ringer (bolsa)", dosis: 3, min: 8, lote: "SR-552", vence: "jun 2027" },
  { id: "i5", n: "Amoxicilina (frasco)", dosis: 5, min: 4, lote: "A-3310", vence: "feb 2027" },
  { id: "i6", n: "Antiparasitario interno", dosis: 40, min: 15, lote: "D-9021", vence: "ago 2027" },
];
const TABS = ["Hoy", "Hospital", "Vacunas", "Pacientes", "Inventario", "Caja"] as const;
type Tab = (typeof TABS)[number];
const estadoColor = (e: Nota["estado"]) => (e === "mejor" ? OK : e === "atento" ? ROJO : SELLO);
const estadoTexto = (e: Nota["estado"]) => (e === "mejor" ? "Mejorando" : e === "atento" ? "Estar atentos" : "Estable");

export default function PanelVet({ internados, setInternados }: { internados: Internado[]; setInternados: (f: (l: Internado[]) => Internado[]) => void }) {
  const [tab, setTab] = useState<Tab>("Hoy");
  const [agenda, setAgenda] = useState<Cita[]>(AGENDA_INICIAL);
  const [pendientes, setPendientes] = useState<(Pendiente & { avisado?: boolean })[]>(PENDIENTES_INICIAL);
  const [dadas, setDadas] = useState<Record<string, string>>({ "luna-08:00": "08:04" });
  const [signos, setSignos] = useState<Record<string, { temp: string; fc: string }>>({ luna: { temp: "38.6", fc: "160" }, max: { temp: "38.2", fc: "110" } });
  const [nota, setNota] = useState<Record<string, { texto: string; estado: Nota["estado"] }>>({});
  const [inv, setInv] = useState(INVENTARIO.map((x) => ({ ...x, pedido: false })));
  const [pacientes, setPacientes] = useState(PACIENTES);
  const [ventas, setVentas] = useState([{ id: "v1", c: "Vacunas · Rocky", m: 120, pago: "Efectivo" }, { id: "v2", c: "Consulta · Michi", m: 150, pago: "Tarjeta" }, { id: "v3", c: "Croquetas gato adulto", m: 385, pago: "Efectivo" }]);
  const [msg, setMsg] = useState<string | null>(null);
  const [nueva, setNueva] = useState(false);

  const vencidas = pendientes.filter((p) => p.dias < 0 && !p.avisado).length;
  const enSala = agenda.filter((c) => c.estado === "llego").length;
  const bajos = inv.filter((i) => i.dosis < i.min && !i.pedido).length;
  const siguiente: Record<Cita["estado"], Cita["estado"]> = { espera: "llego", llego: "atendido", atendido: "atendido" };
  const medsPend = internados.reduce((a, i) => a + (MEDS[i.id] ?? []).filter((m) => !dadas[`${i.id}-${m.h}`]).length, 0);
  const badge = (t: Tab) => (t === "Hospital" ? medsPend : t === "Vacunas" ? vencidas : t === "Inventario" ? bajos : 0);

  function avisar(p: Pendiente) {
    setPendientes((l) => l.map((x) => (x.id === p.id ? { ...x, avisado: true } : x)));
    setMsg(p.dias < 0 ? `Hola ${p.dueno.split(" ")[0]}, te saluda Veterinaria Huesitos. A ${p.mascota} se le venció la vacuna de ${p.vacuna} el ${p.vence}. ¿Te apartamos un horario esta semana? Solo responde con el día que te queda bien.` : `Hola ${p.dueno.split(" ")[0]}, te saluda Veterinaria Huesitos. A ${p.mascota} le toca su vacuna de ${p.vacuna} el ${p.vence}. ¿Te apartamos un horario? Solo responde con el día que te queda bien.`);
  }
  function mandarNota(i: Internado) {
    const n = nota[i.id];
    if (!n?.texto.trim()) return;
    const hora = new Date().toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false });
    setInternados((l) => l.map((x) => (x.id === i.id ? { ...x, notas: [...x.notas, { hora: `Hoy ${hora}`, texto: n.texto.trim(), estado: n.estado }] } : x)));
    setNota((m) => ({ ...m, [i.id]: { texto: "", estado: "estable" } }));
    setMsg(`Hola ${i.dueno.split(" ")[0]}, te saluda Veterinaria Huesitos con noticias de ${i.nombre}: ${n.texto.trim()} (${estadoTexto(n.estado).toLowerCase()}). Puedes ver todo en tu enlace de cliente.`);
  }

  return (
    <div className="panel-demo min-h-[calc(100vh-8rem)]" style={{ background: "#f7f3ea", color: BOTELLA, fontFamily: "'Instrument Sans', system-ui, sans-serif" }}>
      <header style={{ background: BOTELLA }} className="text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 py-3">
          <span className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-full bg-white/10"><HeartPulse size={22} /></span><span className="leading-none"><span className="block text-[1.35rem]" style={{ fontFamily: TITULO }}>Huesitos · Clínica</span><span className="text-[0.72rem] opacity-65">Hoja de hoy · Dr. Rodrigo Pérez</span></span></span>
          <span className="ml-auto text-[0.85rem] opacity-70" style={{ fontFamily: MONO }}>SÁB 21 NOV</span>
        </div>
        <nav aria-label="Panel de la clínica" className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3">
          {TABS.map((t) => <button key={t} type="button" onClick={() => setTab(t)} aria-current={tab === t ? "page" : undefined} className="whitespace-nowrap rounded-t-xl px-4 py-2.5 font-bold" style={tab === t ? { background: "#f7f3ea", color: BOTELLA } : { color: "rgba(255,255,255,.72)" }}>{t}{badge(t) > 0 && <span className="ml-1.5 rounded-full px-1.5 py-0.5 text-[0.7rem] text-white" style={{ background: ROJO }}>{badge(t)}</span>}</button>)}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6">
        {tab === "Hoy" && (
          <>
            <h1 className="text-[2rem]" style={{ fontFamily: TITULO }}>Buenos días, Dr. Pérez</h1>
            <div className="mt-3 grid gap-3 sm:grid-cols-4">
              {[["Citas hoy", agenda.length], ["En sala de espera", enSala], ["Internados", internados.length], ["Medicinas por dar", medsPend]].map(([t, n]) => <div key={t as string} className="rounded-xl bg-white p-3.5" style={{ border: `1.5px solid ${BOTELLA}` }}><p className="text-[0.82rem] opacity-65">{t}</p><p className="text-[1.9rem] leading-tight" style={{ fontFamily: TITULO }}>{n}</p></div>)}
            </div>
            <section className="mt-5 p-5" style={hoja}>
              <h2 className="flex items-center gap-2 text-[1.3rem]" style={{ fontFamily: TITULO }}><ClipboardList size={20} /> Agenda de hoy</h2>
              <p className="text-[0.9rem] opacity-70">Cuando llegue una mascota, toque «Ya llegó». Cuando el doctor la pase, «Atender».</p>
              <ul className="mt-3">
                {agenda.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5">
                    <b className="w-14 text-[1.05rem]" style={{ fontFamily: MONO }}>{c.hora}</b>
                    <span className="min-w-[11rem] flex-1"><b>{c.mascota}</b> <span className="text-[0.85rem] opacity-65">({c.especie})</span><span className="block text-[0.9rem] opacity-75">{c.servicio} · {c.dueno}</span></span>
                    {c.estado === "atendido" ? <Sello color={OK}>Atendido</Sello> : <Btn alTocar={() => setAgenda((l) => l.map((x) => (x.id === c.id ? { ...x, estado: siguiente[x.estado] } : x)))} tipo={c.estado === "llego" ? "sello" : "lleno"}>{c.estado === "llego" ? <>Atender <ArrowRight size={16} /></> : <><Check size={16} /> Ya llegó</>}</Btn>}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        {tab === "Hospital" && (
          <>
            <h1 className="text-[2rem]" style={{ fontFamily: TITULO }}>Hospitalizados</h1>
            <p className="max-w-2xl opacity-75">Cada internado tiene su hoja: la medicina por hora, sus signos y la noticia que le llega al dueño. Marque «Dada» cuando se le ponga.</p>
            <div className="mt-4 grid gap-5 lg:grid-cols-2">
              {internados.map((i) => {
                const n = nota[i.id] ?? { texto: "", estado: "estable" as Nota["estado"] };
                const s = signos[i.id] ?? { temp: "", fc: "" };
                return (
                  <article key={i.id} className="p-5" style={hoja}>
                    <div className="flex items-start justify-between gap-3"><div><h2 className="text-[1.6rem] leading-none" style={{ fontFamily: TITULO }}>{i.nombre}</h2><p className="text-[0.88rem] opacity-70">{i.especie} · dueño: {i.dueno} · {i.tel}</p></div><Sello>Desde {i.desde}</Sello></div>
                    <p className="mt-2 font-semibold">{i.motivo}</p>
                    <h3 className="mt-3 flex items-center gap-2 font-bold"><Pill size={17} /> Medicina por hora</h3>
                    <ul className="mt-1">
                      {(MEDS[i.id] ?? []).map((m) => {
                        const k = `${i.id}-${m.h}`;
                        return (
                          <li key={k} className="flex items-center gap-3 py-1.5">
                            <b className="w-14" style={{ fontFamily: MONO }}>{m.h}</b>
                            <span className="flex-1 text-[0.92rem]"><b>{m.t}</b> <span className="opacity-70">{m.d}</span></span>
                            {dadas[k] ? <span className="text-[0.85rem] font-bold" style={{ color: OK }}>Dada {dadas[k]}</span> : <Btn alTocar={() => setDadas((d) => ({ ...d, [k]: new Date().toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false }) }))} tipo="borde"><Check size={15} /> Dada</Btn>}
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <label className="text-[0.85rem] font-bold">Temperatura °C<input value={s.temp} onChange={(e) => setSignos((m) => ({ ...m, [i.id]: { ...s, temp: e.target.value } }))} inputMode="decimal" className="mt-1 w-full rounded-lg border-2 bg-white px-3 py-2 font-normal" style={{ borderColor: BOTELLA, fontFamily: MONO }} /></label>
                      <label className="text-[0.85rem] font-bold">Latidos por minuto<input value={s.fc} onChange={(e) => setSignos((m) => ({ ...m, [i.id]: { ...s, fc: e.target.value } }))} inputMode="numeric" className="mt-1 w-full rounded-lg border-2 bg-white px-3 py-2 font-normal" style={{ borderColor: BOTELLA, fontFamily: MONO }} /></label>
                    </div>
                    <p className="mt-3"><b>Última noticia:</b> {i.notas[i.notas.length - 1].texto}</p>
                    <label className="mt-2 block text-[0.9rem] font-bold">Noticia nueva para el dueño<input value={n.texto} onChange={(e) => setNota((m) => ({ ...m, [i.id]: { ...n, texto: e.target.value } }))} placeholder="Ej. Ya comió y movió la cola" className="mt-1 w-full rounded-lg border-2 bg-white px-3 py-2.5 font-normal" style={{ borderColor: BOTELLA }} /></label>
                    <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={`Estado de ${i.nombre}`}>{(["mejor", "estable", "atento"] as const).map((e) => <button key={e} type="button" aria-pressed={n.estado === e} onClick={() => setNota((m) => ({ ...m, [i.id]: { ...n, estado: e } }))} className="rounded-full border-2 px-3.5 py-2 text-[0.88rem] font-bold" style={n.estado === e ? { background: estadoColor(e), color: "#fff", borderColor: estadoColor(e) } : { borderColor: BOTELLA, background: "#fff" }}>{estadoTexto(e)}</button>)}</div>
                    <div className="mt-3"><Btn alTocar={() => mandarNota(i)} ancho><Bell size={16} /> Mandar noticia al dueño</Btn></div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {tab === "Vacunas" && (
          <>
            <h1 className="text-[2rem]" style={{ fontFamily: TITULO }}>Vacunas por vencer o vencidas</h1>
            <p className="opacity-75">Cada aviso es una cita que no se pierde.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {pendientes.map((p) => (
                <article key={p.id} className="rounded-xl bg-white p-4" style={{ border: `2px solid ${p.dias < 0 ? ROJO : BOTELLA}` }}>
                  <div className="flex items-start justify-between gap-2"><div><p className="flex items-center gap-2 text-[1.2rem]" style={{ fontFamily: TITULO }}><Syringe size={18} /> {p.mascota} · {p.vacuna}</p><p className="text-[0.9rem] opacity-70">{p.dueno} · {p.tel}</p></div><Sello color={p.dias < 0 ? ROJO : SELLO}>{p.dias < 0 ? `Hace ${-p.dias} días` : p.dias <= 1 ? "Vence mañana" : `En ${p.dias} días`}</Sello></div>
                  <div className="mt-3">{p.avisado ? <p className="flex items-center gap-2 font-bold" style={{ color: OK }}><Check size={18} /> Avisado por WhatsApp</p> : <Btn alTocar={() => avisar(p)} tipo={p.dias < 0 ? "sello" : "lleno"}><Bell size={16} /> Avisar por WhatsApp</Btn>}</div>
                </article>
              ))}
            </div>
          </>
        )}

        {tab === "Pacientes" && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-[2rem]" style={{ fontFamily: TITULO }}>Mascotas</h1><p className="opacity-75">Su ficha: peso, alergias y vacunas.</p></div><Btn alTocar={() => setNueva(true)} tipo="sello"><Plus size={18} /> Ficha nueva</Btn></div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {pacientes.map((m) => (
                <article key={m.id} className="p-4" style={hoja}>
                  <p className="text-[1.3rem] leading-none" style={{ fontFamily: TITULO }}>{m.nombre} <span className="text-[0.85rem] opacity-60">· {m.esp}</span></p>
                  <p className="text-[0.88rem] opacity-70">{m.raza} · {m.peso}</p>
                  <p className="mt-2 text-[0.9rem]"><b>Dueño:</b> {m.dueno} · {m.tel}</p>
                  <p className="text-[0.9rem]"><b>Alergias:</b> {m.alergia}</p>
                  <div className="mt-2"><Sello color={m.vacunas.includes("vencida") ? ROJO : m.vacunas === "Al día" ? OK : SELLO}>{m.vacunas}</Sello></div>
                </article>
              ))}
            </div>
            {nueva && <FichaMascota alCerrar={() => setNueva(false)} alGuardar={(m) => { setPacientes((l) => [m, ...l]); setNueva(false); }} />}
          </>
        )}

        {tab === "Inventario" && (
          <>
            <h1 className="text-[2rem]" style={{ fontFamily: TITULO }}>Vacunas y medicinas</h1>
            <p className="opacity-75">Lo que baja del mínimo sale en rojo. Un toque arma el pedido.</p>
            <div className="mt-4 overflow-x-auto rounded-xl bg-white" style={{ border: `1.5px solid ${BOTELLA}` }}>
              <table className="w-full min-w-[34rem] text-[0.92rem]">
                <thead><tr className="text-left text-[0.75rem] uppercase opacity-60"><th className="p-3">Producto</th><th>Lote</th><th>Vence</th><th className="text-right">Dosis</th><th className="p-3" /></tr></thead>
                <tbody>
                  {inv.map((i) => { const bajo = i.dosis < i.min; return (
                    <tr key={i.id} className="border-t" style={{ borderColor: RENGLON }}>
                      <td className="p-3 font-bold">{i.n}</td><td style={{ fontFamily: MONO }}>{i.lote}</td><td>{i.vence}</td>
                      <td className="text-right text-[1.2rem] font-bold tabular-nums" style={{ color: bajo ? ROJO : BOTELLA }}>{i.dosis}<span className="text-[0.72rem] font-normal opacity-60"> / mín. {i.min}</span></td>
                      <td className="p-3 text-right">{i.pedido ? <span className="font-bold" style={{ color: OK }}>Pedido</span> : bajo ? <Btn alTocar={() => { setInv((l) => l.map((x) => (x.id === i.id ? { ...x, pedido: true } : x))); setMsg(`Buen día. Le escribe Veterinaria Huesitos. Necesitamos ${i.min * 2 - i.dosis} dosis de: ${i.n}. ¿Las tiene disponibles para esta semana?`); }} tipo="sello">Pedir</Btn> : <span className="opacity-50">Suficiente</span>}</td>
                    </tr>
                  ); })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "Caja" && <Caja ventas={ventas} setVentas={setVentas} />}
      </main>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="veterinaria" que="el aviso al dueño" />
    </div>
  );
}

function FichaMascota({ alCerrar, alGuardar }: { alCerrar: () => void; alGuardar: (m: (typeof PACIENTES)[number]) => void }) {
  const [v, setV] = useState({ nombre: "", esp: "perro", raza: "", peso: "", dueno: "", tel: "", alergia: "" });
  const [error, setError] = useState("");
  const c = "mt-1 w-full rounded-lg border-2 bg-white px-3 py-2.5 font-normal";
  const b = { borderColor: BOTELLA };
  return (
    <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-black/50 p-4" onClick={alCerrar}>
      <div role="dialog" aria-label="Ficha nueva" onClick={(e) => e.stopPropagation()} className="w-full max-w-lg p-5" style={hoja}>
        <div className="flex items-center justify-between"><h2 className="text-[1.6rem]" style={{ fontFamily: TITULO }}>Ficha de la mascota</h2><button type="button" aria-label="Cerrar" onClick={alCerrar} className="rounded-full border-2 p-2" style={b}><X size={18} /></button></div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-[0.88rem] font-bold">Nombre<input value={v.nombre} onChange={(e) => setV({ ...v, nombre: e.target.value })} className={c} style={b} /></label>
          <label className="text-[0.88rem] font-bold">Es un…<select value={v.esp} onChange={(e) => setV({ ...v, esp: e.target.value })} className={c} style={b}><option>perro</option><option>gato</option></select></label>
          <label className="text-[0.88rem] font-bold">Raza<input value={v.raza} onChange={(e) => setV({ ...v, raza: e.target.value })} className={c} style={b} /></label>
          <label className="text-[0.88rem] font-bold">Peso<input value={v.peso} onChange={(e) => setV({ ...v, peso: e.target.value })} className={c} style={b} placeholder="12 kg" /></label>
          <label className="text-[0.88rem] font-bold">Dueño<input value={v.dueno} onChange={(e) => setV({ ...v, dueno: e.target.value })} className={c} style={b} /></label>
          <label className="text-[0.88rem] font-bold">Teléfono<input value={v.tel} onChange={(e) => setV({ ...v, tel: e.target.value })} inputMode="tel" className={c} style={b} /></label>
          <label className="text-[0.88rem] font-bold sm:col-span-2">Alergias<input value={v.alergia} onChange={(e) => setV({ ...v, alergia: e.target.value })} className={c} style={b} placeholder="Ninguna" /></label>
        </div>
        {error && <p role="alert" className="mt-3 font-bold" style={{ color: ROJO }}>{error}</p>}
        <div className="mt-4"><Btn ancho alTocar={() => (v.nombre.trim() && v.dueno.trim() ? alGuardar({ id: `m${Date.now()}`, nombre: v.nombre.trim(), esp: v.esp, raza: v.raza || "Mestizo", peso: v.peso || "—", dueno: v.dueno.trim(), tel: v.tel || "—", alergia: v.alergia || "Ninguna", vacunas: "Por revisar" }) : setError("Escriba el nombre de la mascota y del dueño."))}><Check size={18} /> Guardar ficha</Btn></div>
      </div>
    </div>
  );
}

function Caja({ ventas, setVentas }: { ventas: { id: string; c: string; m: number; pago: string }[]; setVentas: (f: (l: { id: string; c: string; m: number; pago: string }[]) => { id: string; c: string; m: number; pago: string }[]) => void }) {
  const catalogo = [...SERVICIOS.map((s) => ({ n: s.nombre, p: s.precio })), ...TIENDA.map((t) => ({ n: t.nombre, p: t.precio }))];
  const [item, setItem] = useState(0);
  const [pago, setPago] = useState("Efectivo");
  const total = ventas.reduce((a, v) => a + v.m, 0);
  const por = (f: string) => ventas.filter((v) => v.pago === f).reduce((a, v) => a + v.m, 0);
  return (
    <>
      <h1 className="text-[2rem]" style={{ fontFamily: TITULO }}>Caja de hoy</h1>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {[["Total del día", qz(total)], ["Efectivo", qz(por("Efectivo"))], ["Tarjeta y transferencia", qz(por("Tarjeta") + por("Transferencia"))]].map(([t, v]) => <div key={t} className="rounded-xl bg-white p-4" style={{ border: `1.5px solid ${BOTELLA}` }}><p className="text-[0.82rem] opacity-65">{t}</p><p className="text-[1.9rem]" style={{ fontFamily: TITULO }}>{v}</p></div>)}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <section className="p-4" style={hoja}>
          <h2 className="text-[1.2rem]" style={{ fontFamily: TITULO }}>Anotar una venta</h2>
          <label className="mt-2 block text-[0.88rem] font-bold">Qué se vendió<select value={item} onChange={(e) => setItem(Number(e.target.value))} className="mt-1 w-full rounded-lg border-2 bg-white px-3 py-2.5 font-normal" style={{ borderColor: BOTELLA }}>{catalogo.map((c, i) => <option key={c.n} value={i}>{c.n} · {qz(c.p)}</option>)}</select></label>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Forma de pago">{["Efectivo", "Tarjeta", "Transferencia"].map((f) => <button key={f} type="button" aria-pressed={pago === f} onClick={() => setPago(f)} className="rounded-full border-2 px-3.5 py-2 text-[0.88rem] font-bold" style={pago === f ? { background: BOTELLA, color: "#fff", borderColor: BOTELLA } : { background: "#fff", borderColor: BOTELLA }}>{f}</button>)}</div>
          <div className="mt-3"><Btn alTocar={() => setVentas((l) => [...l, { id: `v${Date.now()}`, c: catalogo[item].n, m: catalogo[item].p, pago }])} tipo="sello" ancho><Plus size={16} /> Anotar venta</Btn></div>
        </section>
        <section className="rounded-xl bg-white p-4" style={{ border: `1.5px solid ${BOTELLA}` }}>
          <h2 className="text-[1.2rem]" style={{ fontFamily: TITULO }}>Ventas de hoy</h2>
          <ul className="mt-2 divide-y" style={{ borderColor: RENGLON }}>{ventas.map((v) => <li key={v.id} className="flex items-center justify-between gap-3 py-2"><span>{v.c}<span className="block text-[0.8rem] opacity-60">{v.pago}</span></span><b className="tabular-nums">{qz(v.m)}</b></li>)}</ul>
        </section>
      </div>
    </>
  );
}
