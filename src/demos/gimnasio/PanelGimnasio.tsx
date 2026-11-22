/*
 * Recepción de Spartan Force: el torniquete.
 * Identidad propia: goma negra, amarillo de disco y semáforo verde y rojo gigantes; Big Shoulders para los números y JetBrains Mono para horas y carnets.
 * Lo que se ve primero: el veredicto de la puerta (pasa o debe) y cuánta gente hay dentro. Lo que se llena: el cobro de la renovación en el momento.
 */
import { useState } from "react";
import { Check, IdCard, Search } from "lucide-react";
import { MensajeWhatsApp } from "../comun";
import { AMARILLO, CLASES, DIAS, GOMA, GOMA2, PLANES, ROJO, SEDES, TIZA, TITULO, VERDE, aforo, enDias, faltan, fechaCorta, horaAhora, nivel, porId, qz, type Gym, type Socio } from "./datos";

const MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace";
const caja = { background: GOMA2 } as const;

/* medidor de aforo: media luna que se llena según la gente que hay */
function Medidor({ n, cap, nombre }: { n: number; cap: number; nombre: string }) {
  const p = Math.min(1, n / cap);
  const nv = nivel(n, cap);
  const R = 60, C = Math.PI * R;
  return (
    <figure className="text-center">
      <svg viewBox="0 0 150 90" className="mx-auto w-full max-w-[13rem]" role="img" aria-label={`${nombre}: ${n} de ${cap} personas, ${nv.t}`}>
        <path d="M15 80 A60 60 0 0 1 135 80" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="14" strokeLinecap="round" />
        <path d="M15 80 A60 60 0 0 1 135 80" fill="none" stroke={nv.c} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${C * p} ${C}`} />
        <text x="75" y="68" textAnchor="middle" fontSize="34" fill={TIZA} style={{ fontFamily: TITULO, fontWeight: 900 }}>{n}</text>
        <text x="75" y="84" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,.6)">de {cap} personas</text>
      </svg>
      <figcaption className="-mt-1 text-[0.95rem] font-bold">{nombre} · <span style={{ color: nv.c }}>{nv.t}</span></figcaption>
    </figure>
  );
}

export default function PanelGimnasio({ gym }: { gym: Gym }) {
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [adentro, setAdentro] = useState<number | null>(null);
  const hoy = new Date().getDate();
  const nombre = (n: number) => gym.socios.find((s) => s.num === n)?.nombre ?? "Pase de día";
  const buscados = q.trim() ? gym.socios.filter((s) => String(s.num) === q.trim() || s.nombre.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 3) : [];
  const vencidas = gym.socios.filter((s) => faltan(s.vence) < 0).sort((a, b) => faltan(a.vence) - faltan(b.vence));
  const porVencer = gym.socios.filter((s) => faltan(s.vence) >= 0 && faltan(s.vence) <= 7).sort((a, b) => faltan(a.vence) - faltan(b.vence));
  const porCobrar = vencidas.reduce((t, s) => t + porId(PLANES, s.plan).precio, 0);
  const cobradoHoy = gym.pagos.filter((x) => x.dia === hoy).reduce((t, x) => t + x.monto, 0);
  const cobradoMes = gym.pagos.reduce((t, x) => t + x.monto, 0);
  const clasesHoy = CLASES.filter((c) => c.dia === new Date().getDay());
  const h = horaAhora();
  const ventasPlan = PLANES.map((p) => ({ p, t: gym.pagos.filter((x) => x.que.toLowerCase().includes(p.nombre.toLowerCase())).reduce((t, x) => t + x.monto, 0) })).filter((v) => v.t > 0);
  const maxVenta = Math.max(1, ...ventasPlan.map((v) => v.t));

  const recordar = (s: Socio) => {
    const f = faltan(s.vence), p = porId(PLANES, s.plan);
    setMsg(`Hola, ${s.nombre.split(" ")[0]}. Te saluda Spartan Force Gym. ${f < 0 ? `Tu plan ${p.nombre.toLowerCase()} venció el ${fechaCorta(s.vence)}` : f === 0 ? `Tu plan ${p.nombre.toLowerCase()} vence hoy` : `Tu plan ${p.nombre.toLowerCase()} vence el ${fechaCorta(s.vence)}`}. Lo puedes renovar en recepción o aquí: spartanforce.gt/renovar (${qz(p.precio)}). ¡Te esperamos!`);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] pb-16" style={{ background: GOMA, color: TIZA }}>
      <header className="border-b-4" style={{ borderColor: AMARILLO, background: "#0d0e0f" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-end gap-x-8 gap-y-2 px-5 py-4">
          <div><p className="text-[0.8rem] uppercase tracking-[0.2em] text-white/55" style={{ fontFamily: MONO }}>{DIAS[new Date().getDay()]} {fechaCorta(enDias(0))} · Sede Mixco</p><h1 className="text-[3.2rem] uppercase leading-[0.9]" style={{ fontFamily: TITULO, fontWeight: 900 }}>Torniquete</h1></div>
          <div className="ml-auto grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-4">
            {[[String(gym.entradas.length), "entradas hoy", VERDE], [qz(cobradoHoy), "cobrado hoy", AMARILLO], [qz(porCobrar), `por cobrar (${vencidas.length})`, ROJO], [String(gym.socios.filter((s) => s.nuevo).length), "nuevos hoy", TIZA]].map(([n, t, c]) => <p key={t}><b className="block text-[2rem] leading-none" style={{ fontFamily: TITULO, fontWeight: 900, color: c }}>{n}</b><span className="text-[0.8rem] text-white/60">{t}</span></p>)}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 pt-6 lg:grid-cols-[1.25fr_1fr]">
        <div className="grid content-start gap-6">
          {/* la puerta */}
          <section className="rounded-xl p-5" style={{ ...caja, boxShadow: `inset 0 0 0 2px ${AMARILLO}` }}>
            <h2 className="flex items-center gap-2 text-[1.8rem] uppercase" style={{ fontFamily: TITULO, fontWeight: 900 }}><IdCard size={26} style={{ color: AMARILLO }} /> Pasar carnet</h2>
            <div className="mt-3 flex items-center gap-3 rounded-lg bg-white px-4 text-black">
              <Search size={22} className="opacity-50" />
              <input aria-label="Número de carnet o nombre" value={q} onChange={(e) => { setQ(e.target.value); setAdentro(null); }} placeholder="Número o nombre (prueba: 102)" className="w-full bg-transparent py-4 text-[1.4rem] outline-none" style={{ fontFamily: MONO }} />
            </div>
            <div className="mt-3 grid gap-3">
              {buscados.map((s) => {
                const f = faltan(s.vence), ok = f >= 0, p = porId(PLANES, s.plan);
                return (
                  <div key={s.num} className="rounded-xl p-5" style={{ background: ok ? "rgba(46,155,87,.2)" : "rgba(215,38,61,.22)", boxShadow: `inset 0 0 0 3px ${ok ? VERDE : ROJO}` }}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-[2.6rem] uppercase leading-none" style={{ fontFamily: TITULO, fontWeight: 900, color: ok ? "#8be0a8" : "#ff9aa8" }}>{ok ? "Puede pasar" : "Plan vencido"}</p>
                        <p className="mt-1 text-[1.25rem] font-bold">{s.nombre} <span className="font-normal text-white/55" style={{ fontFamily: MONO }}>#{s.num}</span></p>
                        <p className="text-[0.98rem] text-white/75">{ok ? `${p.nombre} al día hasta el ${fechaCorta(s.vence)} · quedan ${f} días` : `Venció hace ${-f} ${-f === 1 ? "día" : "días"} · debe ${qz(p.precio)}`}</p>
                      </div>
                      {adentro === s.num ? <span className="inline-flex items-center gap-2 text-[1.3rem] font-bold" style={{ color: "#8be0a8" }}><Check size={24} /> Ya entró</span> : ok ? (
                        <button type="button" onClick={() => { gym.entrar(s.num); setAdentro(s.num); }} className="min-h-[3.5rem] rounded-lg px-8 text-[1.2rem] font-extrabold uppercase text-white" style={{ background: VERDE }}>Dejar entrar</button>
                      ) : (
                        <button type="button" onClick={() => { gym.cobrar(s.num); gym.entrar(s.num); setAdentro(s.num); }} className="min-h-[3.5rem] rounded-lg px-6 text-[1.15rem] font-extrabold uppercase text-white" style={{ background: ROJO }}>Cobrar {qz(p.precio)} y dejar entrar</button>
                      )}
                    </div>
                  </div>
                );
              })}
              {q.trim() && buscados.length === 0 && <p className="text-white/60">No hay nadie con ese número o nombre.</p>}
              {!q.trim() && <p className="text-[0.95rem] text-white/50">Escriba el número del carnet. La pantalla se pone verde si puede pasar y roja si debe.</p>}
            </div>
          </section>

          <section>
            <h2 className="flex items-baseline justify-between text-[1.6rem] uppercase" style={{ fontFamily: TITULO, fontWeight: 900 }}><span>Vencidas: cobrar</span><span className="text-[1.1rem]" style={{ color: "#ff9aa8" }}>{qz(porCobrar)}</span></h2>
            <ul className="mt-2 overflow-hidden rounded-xl" style={caja}>
              {vencidas.map((s, i) => { const p = porId(PLANES, s.plan); return (
                <li key={s.num} className={`flex flex-wrap items-center gap-3 px-4 py-3 ${i ? "border-t border-white/10" : ""}`}>
                  <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: p.color }} />
                  <span className="min-w-[8rem] flex-1"><b className="block truncate">{s.nombre}</b><span className="text-[0.88rem]" style={{ color: "#ff9aa8" }}>hace {-faltan(s.vence)} días · {qz(p.precio)}</span></span>
                  <button type="button" onClick={() => recordar(s)} className="min-h-[2.75rem] rounded-md border border-white/30 px-4 font-semibold">Recordarle</button>
                  <button type="button" onClick={() => gym.cobrar(s.num)} className="min-h-[2.75rem] rounded-md px-4 font-bold text-black" style={{ background: AMARILLO }}>Cobrar ahora</button>
                </li>
              ); })}
              {vencidas.length === 0 && <li className="px-4 py-4 text-white/60">Nadie debe. Bien.</li>}
            </ul>
          </section>

          <section>
            <h2 className="text-[1.6rem] uppercase" style={{ fontFamily: TITULO, fontWeight: 900 }}>Vencen esta semana</h2>
            <ul className="mt-2 overflow-hidden rounded-xl" style={caja}>
              {porVencer.map((s, i) => (
                <li key={s.num} className={`flex items-center gap-3 px-4 py-3 ${i ? "border-t border-white/10" : ""}`}>
                  <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: porId(PLANES, s.plan).color }} />
                  <span className="min-w-0 flex-1"><b className="block truncate">{s.nombre}</b><span className="text-[0.88rem] text-white/60">{faltan(s.vence) === 0 ? "vence hoy" : `en ${faltan(s.vence)} días`} · {porId(PLANES, s.plan).nombre.toLowerCase()}</span></span>
                  <button type="button" onClick={() => recordar(s)} className="min-h-[2.75rem] shrink-0 rounded-md border border-white/30 px-4 font-semibold">Avisarle</button>
                </li>
              ))}
              {porVencer.length === 0 && <li className="px-4 py-4 text-white/60">Ninguno esta semana.</li>}
            </ul>
          </section>
        </div>

        <aside className="grid content-start gap-6">
          <section className="rounded-xl p-5" style={caja}>
            <h2 className="text-[1.6rem] uppercase" style={{ fontFamily: TITULO, fontWeight: 900 }}>Gente dentro ahora</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">{SEDES.map((s) => <Medidor key={s.id} n={aforo(s.id, h)} cap={s.capacidad} nombre={s.nombre} />)}</div>
          </section>
          <section>
            <h2 className="text-[1.6rem] uppercase" style={{ fontFamily: TITULO, fontWeight: 900 }}>Clases de hoy</h2>
            <ul className="mt-2 grid gap-2">
              {clasesHoy.map((c) => { const van = c.van + (gym.reservas[c.id] ? 1 : 0), lleno = van >= c.cupo; return (
                <li key={c.id} className="rounded-xl p-3" style={caja}>
                  <div className="flex items-center justify-between gap-3"><span><b className="block">{c.hora} · {c.nombre}</b><span className="text-[0.85rem] text-white/60">{c.coach}</span></span><b className="text-[1.3rem]" style={{ fontFamily: MONO, color: lleno ? "#ff9aa8" : TIZA }}>{van}/{c.cupo}</b></div>
                  <span className="mt-2 block h-2 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full" style={{ width: `${Math.min(100, (van / c.cupo) * 100)}%`, background: lleno ? ROJO : AMARILLO }} /></span>
                </li>
              ); })}
              {clasesHoy.length === 0 && <li className="text-white/60">Hoy no hay clases.</li>}
            </ul>
          </section>
          <section className="rounded-xl p-5" style={caja}>
            <h2 className="flex items-baseline justify-between text-[1.6rem] uppercase" style={{ fontFamily: TITULO, fontWeight: 900 }}><span>Ventas por plan</span><span className="text-[1rem] text-white/60">mes: {qz(cobradoMes)}</span></h2>
            <ul className="mt-3 grid gap-3">{ventasPlan.map(({ p, t }) => <li key={p.id}><div className="flex justify-between text-[0.95rem]"><span>{p.nombre}</span><b style={{ fontFamily: MONO }}>{qz(t)}</b></div><span className="mt-1 block h-2.5 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full" style={{ width: `${(t / maxVenta) * 100}%`, background: p.color }} /></span></li>)}</ul>
          </section>
          <section>
            <h2 className="text-[1.6rem] uppercase" style={{ fontFamily: TITULO, fontWeight: 900 }}>Entradas de hoy</h2>
            <ul className="mt-2 max-h-[18rem] overflow-y-auto rounded-xl" style={caja}>
              {gym.entradas.map((e, i) => <li key={`${e.num}-${e.hora}-${i}`} className={`flex items-center justify-between gap-3 px-4 py-2.5 ${i ? "border-t border-white/10" : ""}`}><span className="truncate">{nombre(e.num)}</span><span className="shrink-0 text-[0.9rem] text-white/60" style={{ fontFamily: MONO }}>{e.hora}</span></li>)}
            </ul>
            <button type="button" onClick={gym.reiniciar} className="mt-3 text-[0.88rem] text-white/50 underline">Reiniciar el ejemplo</button>
          </section>
        </aside>
      </main>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="gimnasio" que="cada recordatorio" />
    </div>
  );
}
