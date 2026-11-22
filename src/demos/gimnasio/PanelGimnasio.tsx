/*
 * Panel de Spartan Force Gym: un dashboard tipo CRM, sobrio y claro.
 * Menú lateral negro con amarillo de disco y contenido en gris claro. Secciones: Resumen, Acceso, Socios, Clases y Pagos.
 * Lo que se ve primero: cuántos socios hay, quién entró y quién debe. Lo que se llena: el cobro de cada renovación.
 */
import { useState, type ReactNode } from "react";
import { Bell, CalendarDays, Check, CreditCard, IdCard, LayoutDashboard, Search, Users } from "lucide-react";
import { MensajeWhatsApp } from "../comun";
import { AMARILLO, CLASES, DIAS, PLANES, ROJO, SEDES, VERDE, aforo, enDias, faltan, fechaCorta, horaAhora, porId, qz, type Gym, type Socio } from "./datos";

const NEGRO = "#111315";
const GRIS = "#f1f2f4";
const BORDE = "#dfe2e6";
const TINTA = "#1b1f23";
const CUERPO = "'Instrument Sans', system-ui, sans-serif";
const TITULO = "'Big Shoulders Display', 'Instrument Sans', sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace";

const SECCIONES = [
  { id: "resumen", t: "Resumen", I: LayoutDashboard },
  { id: "acceso", t: "Acceso", I: IdCard },
  { id: "socios", t: "Socios", I: Users },
  { id: "clases", t: "Clases", I: CalendarDays },
  { id: "pagos", t: "Pagos", I: CreditCard },
] as const;
type Sec = (typeof SECCIONES)[number]["id"];

function Tarjeta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border bg-white p-4 ${className}`} style={{ borderColor: BORDE }}>{children}</div>;
}
function Insignia({ ok, children }: { ok: "bien" | "aviso" | "mal"; children: ReactNode }) {
  const c = ok === "bien" ? { b: "#e3f4ea", t: "#1f6b3f" } : ok === "aviso" ? { b: "#fdf1d3", t: "#8a5a00" } : { b: "#fbe3e5", t: "#a3202f" };
  return <span className="inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[0.8rem] font-semibold" style={{ background: c.b, color: c.t }}>{children}</span>;
}
function Btn({ children, alTocar, tipo = "lleno" }: { children: ReactNode; alTocar: () => void; tipo?: "lleno" | "borde" | "rojo" }) {
  const s = tipo === "lleno" ? { background: NEGRO, color: "#fff" } : tipo === "rojo" ? { background: ROJO, color: "#fff" } : { background: "#fff", color: TINTA, border: `1.5px solid ${TINTA}` };
  return <button type="button" onClick={alTocar} className="inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-lg px-4 py-2 text-[0.92rem] font-semibold transition hover:opacity-90 active:scale-[0.98]" style={s}>{children}</button>;
}

export default function PanelGimnasio({ gym }: { gym: Gym }) {
  const [sec, setSec] = useState<Sec>("resumen");
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "al-dia" | "por-vencer" | "vencidos">("todos");
  const [carnet, setCarnet] = useState("");
  const [adentro, setAdentro] = useState<number | null>(null);
  const [dia, setDia] = useState(new Date().getDay());
  const [msg, setMsg] = useState<string | null>(null);

  const hoy = new Date().getDate();
  const nombre = (n: number) => gym.socios.find((s) => s.num === n)?.nombre ?? "Pase de día";
  const estado = (s: Socio) => { const f = faltan(s.vence); return f < 0 ? "vencidos" : f <= 7 ? "por-vencer" : "al-dia"; };
  const vencidas = gym.socios.filter((s) => estado(s) === "vencidos").sort((a, b) => faltan(a.vence) - faltan(b.vence));
  const porVencer = gym.socios.filter((s) => estado(s) === "por-vencer");
  const activos = gym.socios.length - vencidas.length;
  const porCobrar = vencidas.reduce((t, s) => t + porId(PLANES, s.plan).precio, 0);
  const cobradoHoy = gym.pagos.filter((x) => x.dia === hoy).reduce((t, x) => t + x.monto, 0);
  const cobradoMes = gym.pagos.reduce((t, x) => t + x.monto, 0);
  const h = horaAhora();
  const clasesDia = CLASES.filter((c) => c.dia === dia);
  const ventasPlan = PLANES.map((p) => ({ p, t: gym.pagos.filter((x) => x.que.toLowerCase().includes(p.nombre.toLowerCase())).reduce((t, x) => t + x.monto, 0) })).filter((v) => v.t > 0);
  const maxVenta = Math.max(1, ...ventasPlan.map((v) => v.t));
  const buscados = carnet.trim() ? gym.socios.filter((s) => String(s.num) === carnet.trim() || s.nombre.toLowerCase().includes(carnet.trim().toLowerCase())).slice(0, 3) : [];
  const filas = gym.socios.filter((s) => (filtro === "todos" || estado(s) === filtro) && `${s.nombre} ${s.num} ${s.tel}`.toLowerCase().includes(q.trim().toLowerCase()));

  const recordar = (s: Socio) => {
    const f = faltan(s.vence), p = porId(PLANES, s.plan);
    setMsg(`Hola, ${s.nombre.split(" ")[0]}. Te saluda Spartan Force Gym. ${f < 0 ? `Tu plan ${p.nombre.toLowerCase()} venció el ${fechaCorta(s.vence)}` : f === 0 ? `Tu plan ${p.nombre.toLowerCase()} vence hoy` : `Tu plan ${p.nombre.toLowerCase()} vence el ${fechaCorta(s.vence)}`}. Lo puedes renovar en recepción o aquí: spartanforce.gt/renovar (${qz(p.precio)}). ¡Te esperamos!`);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] md:grid md:grid-cols-[14rem_minmax(0,1fr)]" style={{ background: GRIS, color: TINTA, fontFamily: CUERPO }}>
      <aside className="md:sticky md:top-0 md:h-screen md:self-start" style={{ background: NEGRO, color: "#fff" }}>
        <div className="flex items-center gap-2.5 px-4 py-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg text-[1.15rem] font-black" style={{ background: AMARILLO, color: NEGRO, fontFamily: TITULO }}>S</span>
          <span className="leading-tight"><span className="block text-[1.15rem] font-extrabold uppercase tracking-wide" style={{ fontFamily: TITULO }}>Spartan Force</span><span className="text-[0.72rem] text-white/55">Panel del gimnasio · Mixco</span></span>
        </div>
        <nav aria-label="Panel" className="flex gap-1 overflow-x-auto px-2 pb-2 md:block md:space-y-1 md:px-3">
          {SECCIONES.map(({ id, t, I }) => (
            <button key={id} type="button" onClick={() => setSec(id)} aria-current={sec === id ? "page" : undefined} className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-[0.95rem] font-semibold md:w-full" style={sec === id ? { background: AMARILLO, color: NEGRO } : { color: "rgba(255,255,255,.75)" }}>
              <I size={18} /> {t}{id === "pagos" && vencidas.length > 0 && <span className="ml-auto rounded-full px-1.5 text-[0.72rem] text-white" style={{ background: ROJO }}>{vencidas.length}</span>}
            </button>
          ))}
        </nav>
        <p className="hidden px-4 pt-6 text-[0.8rem] text-white/45 md:block">{DIAS[new Date().getDay()]} {fechaCorta(enDias(0))}<br /><button type="button" onClick={gym.reiniciar} className="mt-2 underline">Reiniciar el ejemplo</button></p>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-7">
        {sec === "resumen" && (
          <>
            <h1 className="text-[1.9rem] font-bold">Spartan Force</h1>
            <p className="text-[0.95rem] opacity-65">Cómo va el gimnasio hoy.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[["Socios activos", String(activos), `de ${gym.socios.length} en total`], ["Entradas hoy", String(gym.entradas.length), "personas que pasaron"], ["Cobrado hoy", qz(cobradoHoy), `Este mes: ${qz(cobradoMes)}`], ["Por cobrar", qz(porCobrar), `${vencidas.length} membresías vencidas`]].map(([t, v, n], i) => (
                <Tarjeta key={t}><p className="text-[0.85rem] opacity-65">{t}</p><p className="mt-1 text-[1.9rem] font-bold leading-none tabular-nums" style={{ color: i === 3 && vencidas.length ? "#a3202f" : TINTA }}>{v}</p><p className="mt-1.5 text-[0.8rem] opacity-60">{n}</p></Tarjeta>
              ))}
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
              <Tarjeta>
                <h2 className="text-[1.1rem] font-bold">Gente en el gimnasio ahora</h2>
                <ul className="mt-3 grid gap-4">{SEDES.map((s) => { const n = aforo(s.id, h), p = Math.min(100, Math.round((n / s.capacidad) * 100)); return (
                  <li key={s.id}><div className="flex items-baseline justify-between"><b>{s.nombre}</b><span className="text-[0.9rem] tabular-nums">{n} de {s.capacidad} personas · {p < 35 ? "Tranquilo" : p < 70 ? "Normal" : "Lleno"}</span></div><span className="mt-1.5 block h-2.5 overflow-hidden rounded-full" style={{ background: BORDE }}><span className="block h-full rounded-full" style={{ width: `${p}%`, background: p < 35 ? VERDE : p < 70 ? AMARILLO : ROJO }} /></span></li>
                ); })}</ul>
              </Tarjeta>
              <Tarjeta>
                <h2 className="text-[1.1rem] font-bold">Vencen esta semana</h2>
                <ul className="mt-2 divide-y" style={{ borderColor: BORDE }}>
                  {porVencer.slice(0, 5).map((s) => <li key={s.num} className="flex items-center gap-2 py-2.5"><span className="min-w-0 flex-1"><b className="block truncate">{s.nombre}</b><span className="text-[0.82rem] opacity-65">{faltan(s.vence) === 0 ? "vence hoy" : `en ${faltan(s.vence)} días`}</span></span><Btn tipo="borde" alTocar={() => recordar(s)}><Bell size={15} /> Avisar</Btn></li>)}
                  {porVencer.length === 0 && <li className="py-3 opacity-60">Ninguno esta semana.</li>}
                </ul>
              </Tarjeta>
            </div>
          </>
        )}

        {sec === "acceso" && (
          <>
            <h1 className="text-[1.9rem] font-bold">Acceso</h1>
            <p className="text-[0.95rem] opacity-65">Escriba el número del carnet o el nombre. Aparece si puede pasar o si debe.</p>
            <Tarjeta className="mt-4">
              <div className="flex items-center gap-3 rounded-lg border px-4" style={{ borderColor: BORDE }}><Search size={20} className="opacity-50" /><input aria-label="Número de carnet o nombre" value={carnet} onChange={(e) => { setCarnet(e.target.value); setAdentro(null); }} placeholder="Número o nombre (pruebe: 102)" className="w-full bg-transparent py-3.5 text-[1.2rem] outline-none" style={{ fontFamily: MONO }} /></div>
              <div className="mt-3 grid gap-3">
                {buscados.map((s) => { const f = faltan(s.vence), ok = f >= 0, p = porId(PLANES, s.plan); return (
                  <div key={s.num} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border-l-8 p-4" style={{ borderColor: ok ? VERDE : ROJO, background: ok ? "#eef8f2" : "#fdf0f1" }}>
                    <div><p className="text-[1.2rem] font-bold">{s.nombre} <span className="font-normal opacity-55" style={{ fontFamily: MONO }}>#{s.num}</span></p><p className="text-[0.92rem]">{ok ? `${p.nombre} al día hasta el ${fechaCorta(s.vence)} · quedan ${f} días` : `Venció hace ${-f} ${-f === 1 ? "día" : "días"} · debe ${qz(p.precio)}`}</p><p className="mt-1 font-bold" style={{ color: ok ? "#1f6b3f" : "#a3202f" }}>{ok ? "Puede pasar" : "Plan vencido"}</p></div>
                    {adentro === s.num ? <span className="inline-flex items-center gap-2 font-bold" style={{ color: "#1f6b3f" }}><Check size={20} /> Ya entró</span> : ok ? <Btn alTocar={() => { gym.entrar(s.num); setAdentro(s.num); }}>Dejar entrar</Btn> : <Btn tipo="rojo" alTocar={() => { gym.cobrar(s.num); gym.entrar(s.num); setAdentro(s.num); }}>Cobrar {qz(p.precio)} y dejar entrar</Btn>}
                  </div>
                ); })}
                {carnet.trim() && buscados.length === 0 && <p className="opacity-65">No hay nadie con ese número o nombre.</p>}
              </div>
            </Tarjeta>
            <Tarjeta className="mt-4">
              <h2 className="text-[1.1rem] font-bold">Entradas de hoy</h2>
              <ul className="mt-2 max-h-[20rem] divide-y overflow-y-auto" style={{ borderColor: BORDE }}>{gym.entradas.map((e, i) => <li key={`${e.num}-${e.hora}-${i}`} className="flex justify-between gap-3 py-2"><span>{nombre(e.num)}</span><span className="opacity-60" style={{ fontFamily: MONO }}>{e.hora}</span></li>)}</ul>
            </Tarjeta>
          </>
        )}

        {sec === "socios" && (
          <>
            <h1 className="text-[1.9rem] font-bold">Socios</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="relative min-w-[14rem] flex-1 md:max-w-sm"><span className="sr-only">Buscar socio</span><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nombre, número o teléfono" className="w-full rounded-lg border bg-white py-3 pl-10 pr-3" style={{ borderColor: BORDE }} /></label>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar">{([["todos", "Todos"], ["al-dia", "Al día"], ["por-vencer", "Por vencer"], ["vencidos", "Vencidos"]] as const).map(([id, t]) => <button key={id} type="button" aria-pressed={filtro === id} onClick={() => setFiltro(id)} className="min-h-[2.5rem] rounded-full border px-3.5 text-[0.88rem] font-semibold" style={filtro === id ? { background: NEGRO, color: "#fff", borderColor: NEGRO } : { background: "#fff", borderColor: BORDE }}>{t}</button>)}</div>
            </div>
            <Tarjeta className="mt-3 overflow-x-auto !p-0">
              <table className="w-full min-w-[38rem] text-[0.92rem]">
                <thead><tr className="text-left text-[0.75rem] uppercase tracking-wide opacity-55"><th className="p-3">Socio</th><th>Plan</th><th>Vence</th><th>Estado</th><th className="text-right">Visitas</th><th className="p-3" /></tr></thead>
                <tbody>
                  {filas.map((s) => { const f = faltan(s.vence), e = estado(s), p = porId(PLANES, s.plan); return (
                    <tr key={s.num} className="border-t" style={{ borderColor: BORDE }}>
                      <td className="p-3"><b className="block">{s.nombre}</b><span className="text-[0.78rem] opacity-55" style={{ fontFamily: MONO }}>#{s.num} · {s.tel}</span></td>
                      <td>{p.nombre}</td><td className="tabular-nums">{fechaCorta(s.vence)}</td>
                      <td><Insignia ok={e === "al-dia" ? "bien" : e === "por-vencer" ? "aviso" : "mal"}>{e === "al-dia" ? "Al día" : e === "por-vencer" ? (f === 0 ? "Vence hoy" : `En ${f} días`) : `Debe ${qz(p.precio)}`}</Insignia></td>
                      <td className="text-right tabular-nums">{s.visitas.length}</td>
                      <td className="p-3"><div className="flex justify-end gap-2">{e !== "al-dia" && <Btn tipo="borde" alTocar={() => recordar(s)}><Bell size={15} /> Avisar</Btn>}{e === "vencidos" && <Btn alTocar={() => gym.cobrar(s.num)}>Cobrar</Btn>}</div></td>
                    </tr>
                  ); })}
                  {filas.length === 0 && <tr><td colSpan={6} className="p-6 text-center opacity-60">Nadie coincide.</td></tr>}
                </tbody>
              </table>
            </Tarjeta>
          </>
        )}

        {sec === "clases" && (
          <>
            <h1 className="text-[1.9rem] font-bold">Clases</h1>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Día">{[1, 2, 3, 4, 5].map((d) => <button key={d} type="button" aria-pressed={dia === d} onClick={() => setDia(d)} className="min-h-[2.5rem] rounded-full border px-4 text-[0.9rem] font-semibold" style={dia === d ? { background: NEGRO, color: "#fff", borderColor: NEGRO } : { background: "#fff", borderColor: BORDE }}>{DIAS[d]}</button>)}</div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {clasesDia.map((c) => { const van = c.van + (gym.reservas[c.id] ? 1 : 0), lleno = van >= c.cupo; return (
                <Tarjeta key={c.id}><div className="flex items-start justify-between gap-3"><div><p className="text-[1.1rem] font-bold">{c.nombre}</p><p className="text-[0.88rem] opacity-65">{c.hora} · {c.coach}</p></div>{lleno ? <Insignia ok="mal">Lleno</Insignia> : <Insignia ok="bien">Quedan {c.cupo - van}</Insignia>}</div><span className="mt-3 block h-2.5 overflow-hidden rounded-full" style={{ background: BORDE }}><span className="block h-full rounded-full" style={{ width: `${Math.min(100, (van / c.cupo) * 100)}%`, background: lleno ? ROJO : AMARILLO }} /></span><p className="mt-1 text-[0.82rem] opacity-60">{van} de {c.cupo} lugares apartados</p></Tarjeta>
              ); })}
              {clasesDia.length === 0 && <p className="opacity-60">Ese día no hay clases.</p>}
            </div>
          </>
        )}

        {sec === "pagos" && (
          <>
            <h1 className="text-[1.9rem] font-bold">Pagos</h1>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[["Cobrado hoy", qz(cobradoHoy)], ["Cobrado este mes", qz(cobradoMes)], ["Por cobrar", qz(porCobrar)]].map(([t, v]) => <Tarjeta key={t}><p className="text-[0.85rem] opacity-65">{t}</p><p className="mt-1 text-[1.8rem] font-bold leading-none tabular-nums">{v}</p></Tarjeta>)}
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Tarjeta><h2 className="text-[1.1rem] font-bold">Ventas por plan</h2><ul className="mt-3 grid gap-3">{ventasPlan.map(({ p, t }) => <li key={p.id}><div className="flex justify-between text-[0.92rem]"><span>{p.nombre}</span><b className="tabular-nums">{qz(t)}</b></div><span className="mt-1 block h-2.5 overflow-hidden rounded-full" style={{ background: BORDE }}><span className="block h-full rounded-full" style={{ width: `${(t / maxVenta) * 100}%`, background: p.color }} /></span></li>)}</ul></Tarjeta>
              <Tarjeta><h2 className="text-[1.1rem] font-bold">Últimos pagos</h2><ul className="mt-2 max-h-[20rem] divide-y overflow-y-auto" style={{ borderColor: BORDE }}>{[...gym.pagos].reverse().slice(0, 12).map((x, i) => <li key={i} className="flex items-center justify-between gap-3 py-2.5"><span className="min-w-0"><b className="block truncate">{nombre(x.num)}</b><span className="text-[0.8rem] opacity-60">{x.que} · día {x.dia}</span></span><b className="tabular-nums">{qz(x.monto)}</b></li>)}</ul></Tarjeta>
            </div>
            <Tarjeta className="mt-4"><h2 className="text-[1.1rem] font-bold">Vencidas: cobrar</h2><ul className="mt-2 divide-y" style={{ borderColor: BORDE }}>{vencidas.map((s) => { const p = porId(PLANES, s.plan); return <li key={s.num} className="flex flex-wrap items-center gap-3 py-2.5"><span className="min-w-[8rem] flex-1"><b>{s.nombre}</b><span className="block text-[0.82rem]" style={{ color: "#a3202f" }}>hace {-faltan(s.vence)} días · {qz(p.precio)}</span></span><Btn tipo="borde" alTocar={() => recordar(s)}><Bell size={15} /> Recordarle</Btn><Btn alTocar={() => gym.cobrar(s.num)}>Cobrar ahora</Btn></li>; })}{vencidas.length === 0 && <li className="py-3 opacity-60">Nadie debe.</li>}</ul></Tarjeta>
          </>
        )}
      </main>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="gimnasio" que="cada recordatorio" />
    </div>
  );
}
