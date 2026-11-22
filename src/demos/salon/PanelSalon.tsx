/*
 * Agenda del salón Lirio: la cuadrícula por estilista.
 * Identidad propia: ciruela, rosa palo y oro; Bodoni Moda para los títulos y Jost para lo demás.
 * Lo que se ve primero: la columna de cada estilista con sus citas y sus huecos. Lo que se llena: la nota de color y fórmula de cada clienta.
 */
import { useState } from "react";
import { Check, MessageCircle, X } from "lucide-react";
import { MensajeWhatsApp, qz } from "../comun";
import { aHora, aMin, estilista, fechaLarga, hora12, hoyIso, iso, masDias, servicio, sucursal, SERVICIOS, SUCURSALES, ESTILISTAS, type Cita, type useCitas } from "./datos";

const CIRUELA = "#4a1d3f";
const ROSA = "#f3dde0";
const ORO = "#b88a3c";
const MARFIL = "#fbf5f2";
const TINTA = "#2a1425";
const OK = "#3e7a52";
const TITULO = "'Bodoni Moda', Georgia, serif";
const CUERPO = "'Jost', 'Instrument Sans', system-ui, sans-serif";
const PX = 1.25; // píxeles por minuto

const color = (e: Cita["estado"]) => (e === "llego" ? OK : e === "no-vino" ? "#8d8d8d" : CIRUELA);
const COMISION = 0.35;

export default function PanelSalon({ store }: { store: ReturnType<typeof useCitas> }) {
  const { citas, cambiar } = store;
  const [suc, setSuc] = useState("z10");
  const [abierta, setAbierta] = useState<Cita | null>(null);
  const [notas, setNotas] = useState<Record<string, string>>({ e1: "Base 6.1, matiz perla. Alergia a amoniaco: usar sin amoniaco." });
  const [msg, setMsg] = useState<string | null>(null);

  const hoy = hoyIso();
  const manana = iso(masDias(1));
  const s = sucursal(suc);
  const equipo = ESTILISTAS.filter((e) => e.suc === suc);
  const deHoy = citas.filter((c) => c.fecha === hoy && c.suc === suc);
  const deManana = citas.filter((c) => c.fecha === manana && c.suc === suc).sort((a, b) => aMin(a.hora) - aMin(b.hora));
  const ingresos = deHoy.filter((c) => c.estado !== "no-vino").reduce((t, c) => t + servicio(c.servicio).precio, 0);
  const alto = (s.cierra - s.abre) * 60 * PX;
  const horas = Array.from({ length: s.cierra - s.abre }, (_, i) => s.abre + i);

  // a quién ya le toca volver
  const ultimas = new Map<string, Cita>();
  citas.filter((c) => c.estado === "llego" && c.suc === suc).forEach((c) => { const u = ultimas.get(c.tel); if (!u || c.fecha > u.fecha) ultimas.set(c.tel, c); });
  const conFutura = new Set(citas.filter((c) => c.fecha >= hoy && c.estado === "confirmada").map((c) => c.tel));
  const retoque = [...ultimas.values()].map((c) => ({ c, sv: servicio(c.servicio), dias: Math.round((Date.now() - new Date(c.fecha + "T12:00").getTime()) / 864e5) })).filter(({ c, sv, dias }) => sv.retoque && dias >= (sv.retoque ?? 0) - 3 && !conFutura.has(c.tel)).sort((a, b) => b.dias - a.dias);
  const masPedidos = SERVICIOS.map((x) => ({ x, n: citas.filter((c) => c.servicio === x.id && c.suc === suc).length })).filter((q) => q.n).sort((a, b) => b.n - a.n).slice(0, 4);

  return (
    <div className="min-h-[calc(100vh-8rem)]" style={{ background: MARFIL, color: TINTA, fontFamily: CUERPO }}>
      <header style={{ background: CIRUELA }} className="text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end gap-x-8 gap-y-3 px-5 py-5">
          <div><p className="text-[0.8rem] uppercase tracking-[0.2em] opacity-70">Panel de agenda · {fechaLarga(hoy)}</p><h1 className="text-[2.6rem] leading-none" style={{ fontFamily: TITULO }}>Lirio Salón</h1></div>
          <div className="ml-auto flex flex-wrap gap-2" role="tablist" aria-label="Sucursales">
            {SUCURSALES.map((x) => <button key={x.id} type="button" role="tab" aria-selected={suc === x.id} onClick={() => setSuc(x.id)} className="rounded-full border px-4 py-2 font-medium" style={suc === x.id ? { background: ORO, borderColor: ORO, color: "#fff" } : { borderColor: "rgba(255,255,255,.4)" }}>{x.nombre}</button>)}
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 pb-4 text-[0.95rem] sm:grid-cols-4">
          {[[String(deHoy.length), "citas hoy"], [qz(ingresos), "esperado hoy"], [String(equipo.length), "estilistas hoy"], [String(retoque.length), "les toca retoque"]].map(([n, t]) => <p key={t}><b className="mr-1.5 text-[1.5rem] font-normal" style={{ fontFamily: TITULO }}>{n}</b><span className="opacity-70">{t}</span></p>)}
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[1fr_20rem]">
        <section className="min-w-0 overflow-x-auto rounded-xl bg-white p-3" style={{ border: `1.5px solid ${CIRUELA}` }}>
          <p className="mb-2 px-1 text-[0.88rem] opacity-70">Cada columna es una estilista. Los bloques son sus citas; lo vacío es tiempo libre. Toque una cita para ver su ficha.</p>
          <div className="flex min-w-[34rem]">
            <div className="w-12 shrink-0 pt-9" aria-hidden>{horas.map((h) => <div key={h} className="text-right text-[0.75rem] opacity-55" style={{ height: 60 * PX }}>{hora12(aHora(h * 60))}</div>)}</div>
            {equipo.map((e) => {
              const suyas = deHoy.filter((c) => c.estilista === e.id);
              const ocupados = suyas.reduce((t, c) => t + servicio(c.servicio).dura, 0);
              const venta = suyas.filter((c) => c.estado !== "no-vino").reduce((t, c) => t + servicio(c.servicio).precio, 0);
              return (
                <div key={e.id} className="min-w-0 flex-1 px-1">
                  <div className="mb-1 h-8 text-center leading-tight"><b className="block" style={{ fontFamily: TITULO }}>{e.nombre}</b><span className="text-[0.72rem] opacity-60">{e.hace.join(" · ")}</span></div>
                  <div className="relative rounded-md" style={{ height: alto, background: `repeating-linear-gradient(transparent 0 ${60 * PX - 1}px, ${ROSA} ${60 * PX - 1}px ${60 * PX}px), ${MARFIL}` }}>
                    {suyas.map((c) => {
                      const sv = servicio(c.servicio);
                      return (
                        <button key={c.id} type="button" onClick={() => setAbierta(c)} className="absolute inset-x-0.5 overflow-hidden rounded-md px-2 py-1 text-left text-white shadow transition hover:brightness-110" style={{ top: (aMin(c.hora) - s.abre * 60) * PX, height: sv.dura * PX - 2, background: color(c.estado), opacity: c.estado === "no-vino" ? 0.55 : 1 }} aria-label={`${c.nombre}, ${sv.nombre}, ${hora12(c.hora)}`}>
                          <span className="block truncate text-[0.82rem] font-semibold leading-tight">{c.nombre}{c.nueva && " ★"}</span>
                          <span className="block truncate text-[0.72rem] opacity-85">{sv.nombre} · {hora12(c.hora)}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-1 text-center text-[0.78rem] leading-tight opacity-70">{Math.max(0, Math.round(((s.cierra - s.abre) * 60 - ocupados) / 60))} h libres · {qz(venta)}<br />comisión {qz(Math.round(venta * COMISION))}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 px-1 text-[0.8rem]"><span><b style={{ color: CIRUELA }}>■</b> confirmada</span><span><b style={{ color: OK }}>■</b> ya llegó</span><span><b style={{ color: "#8d8d8d" }}>■</b> no vino</span><span>★ agendó en línea</span></p>
        </section>

        <aside className="grid content-start gap-5">
          <section className="rounded-xl bg-white p-4" style={{ border: `1.5px solid ${CIRUELA}` }}>
            <h2 className="text-[1.25rem]" style={{ fontFamily: TITULO }}>Ya les toca retoque</h2>
            <p className="text-[0.85rem] opacity-65">Vinieron hace tiempo y no tienen cita. Una invitación a tiempo llena huecos.</p>
            <ul className="mt-2 divide-y" style={{ borderColor: ROSA }}>
              {retoque.map(({ c, sv, dias }) => (
                <li key={c.id} className="flex items-center justify-between gap-2 py-2.5"><span className="min-w-0"><b className="block truncate">{c.nombre}</b><span className="text-[0.82rem] opacity-65">{sv.nombre}, hace {dias} días</span></span>
                  <button type="button" onClick={() => setMsg(`Hola, ${c.nombre.split(" ")[0]}. Te escribimos de Lirio Salón ${s.nombre}. Ya te toca tu ${sv.nombre.toLowerCase()}. ¿Te agendamos esta semana? Aquí puedes ver las horas libres: lirio.gt/agendar`)} className="inline-flex min-h-[2.5rem] shrink-0 items-center gap-1.5 rounded-full px-3.5 font-semibold text-white" style={{ background: CIRUELA }}><MessageCircle size={15} /> Invitarla</button></li>
              ))}
              {retoque.length === 0 && <li className="py-3 opacity-60">Nadie por ahora en esta sucursal.</li>}
            </ul>
          </section>
          <section className="rounded-xl bg-white p-4" style={{ border: `1.5px solid ${CIRUELA}` }}>
            <h2 className="text-[1.25rem]" style={{ fontFamily: TITULO }}>Mañana, ya recordadas</h2>
            <p className="text-[0.85rem] opacity-65">Los recordatorios salen solos por WhatsApp a las 6 de la tarde.</p>
            <ul className="mt-2 divide-y" style={{ borderColor: ROSA }}>
              {deManana.map((c) => <li key={c.id} className="flex items-center justify-between gap-2 py-2.5"><span className="min-w-0"><b className="block truncate">{c.nombre}</b><span className="text-[0.82rem] opacity-65">{hora12(c.hora)} · {servicio(c.servicio).nombre}</span></span><span className="inline-flex items-center gap-1 text-[0.82rem]" style={{ color: OK }}><Check size={14} /> programado</span></li>)}
              {deManana.length === 0 && <li className="py-3 opacity-60">Mañana no hay citas aquí.</li>}
            </ul>
          </section>
          <section className="rounded-xl bg-white p-4" style={{ border: `1.5px solid ${CIRUELA}` }}>
            <h2 className="text-[1.25rem]" style={{ fontFamily: TITULO }}>Lo más pedido</h2>
            <ul className="mt-2 grid gap-2.5">{masPedidos.map(({ x, n }) => <li key={x.id}><div className="flex justify-between text-[0.92rem]"><span>{x.nombre}</span><b>{n}</b></div><span className="mt-1 block h-1.5 bg-black/10"><span className="block h-full" style={{ width: `${(n / masPedidos[0].n) * 100}%`, background: ORO }} /></span></li>)}</ul>
          </section>
        </aside>
      </main>

      {abierta && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40" onClick={() => setAbierta(null)}>
          <aside role="dialog" aria-label={`Ficha de ${abierta.nombre}`} onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-sm overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3"><div><h2 className="text-[1.8rem] leading-tight" style={{ fontFamily: TITULO }}>{abierta.nombre}</h2><p className="opacity-70">{abierta.tel.replace(/(\d{4})(\d{4})/, "$1 $2")}</p></div><button type="button" aria-label="Cerrar ficha" onClick={() => setAbierta(null)} className="rounded-full border p-2"><X size={18} /></button></div>
            <dl className="mt-4 grid grid-cols-2 gap-3 rounded-lg p-3 text-[0.92rem]" style={{ background: ROSA }}>
              <div><dt className="text-[0.72rem] uppercase opacity-60">Servicio</dt><dd className="font-semibold">{servicio(abierta.servicio).nombre}</dd></div>
              <div><dt className="text-[0.72rem] uppercase opacity-60">Precio</dt><dd className="font-semibold">{qz(servicio(abierta.servicio).precio)}</dd></div>
              <div><dt className="text-[0.72rem] uppercase opacity-60">Hora</dt><dd className="font-semibold">{hora12(abierta.hora)} · {servicio(abierta.servicio).dura} min</dd></div>
              <div><dt className="text-[0.72rem] uppercase opacity-60">Con</dt><dd className="font-semibold">{estilista(abierta.estilista).nombre}</dd></div>
            </dl>
            <label className="mt-4 block text-[0.92rem] font-semibold">Nota de color, fórmula o alergias<textarea value={notas[abierta.id] ?? ""} onChange={(e) => setNotas((n) => ({ ...n, [abierta.id]: e.target.value }))} rows={4} placeholder="Ej. Base 6.1, matiz perla. Sin amoniaco." className="mt-1 w-full rounded-lg border-2 bg-white px-3 py-2.5 font-normal" style={{ borderColor: CIRUELA }} /></label>
            <p className="mt-1 text-[0.8rem] opacity-60">Se guarda sola. La próxima estilista la ve antes de empezar.</p>
            <div className="mt-4 grid gap-2">
              <button type="button" onClick={() => { cambiar(abierta.id, { estado: abierta.estado === "llego" ? "confirmada" : "llego" }); setAbierta({ ...abierta, estado: abierta.estado === "llego" ? "confirmada" : "llego" }); }} className="min-h-[2.75rem] rounded-lg px-4 py-2.5 font-semibold text-white" style={{ background: abierta.estado === "llego" ? "#7a7a7a" : OK }}>{abierta.estado === "llego" ? "Quitar «ya llegó»" : "Ya llegó"}</button>
              <button type="button" onClick={() => { cambiar(abierta.id, { estado: abierta.estado === "no-vino" ? "confirmada" : "no-vino" }); setAbierta({ ...abierta, estado: abierta.estado === "no-vino" ? "confirmada" : "no-vino" }); }} className="min-h-[2.75rem] rounded-lg border-2 px-4 py-2.5 font-semibold" style={{ borderColor: CIRUELA, color: CIRUELA }}>{abierta.estado === "no-vino" ? "Quitar «no vino»" : "No vino"}</button>
              <button type="button" onClick={() => setMsg(`Hola, ${abierta.nombre.split(" ")[0]}. Te escribimos de Lirio Salón. Te recordamos tu cita de ${servicio(abierta.servicio).nombre.toLowerCase()} a las ${hora12(abierta.hora)} con ${estilista(abierta.estilista).nombre}. Si no puedes venir, avísanos para darte otra hora.`)} className="inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-semibold text-white" style={{ background: CIRUELA }}><MessageCircle size={16} /> Escribirle</button>
            </div>
          </aside>
        </div>
      )}
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="salón de belleza" que="el mensaje" />
    </div>
  );
}
