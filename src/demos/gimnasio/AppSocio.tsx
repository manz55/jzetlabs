/*
 * La app del socio de Spartan Force: su carnet con código para la talanquera, cuánto le queda de membresía,
 * sus clases, su rutina, su progreso y sus pagos. Todo lo que cambia el socio (meta, medidas, marcas) queda guardado.
 */
import { useEffect, useState, type ReactNode } from "react";
import { Bell, Calendar, Check, ChevronRight, CreditCard, Dumbbell, Flame, Gift, Minus, Plus, Snowflake, Target, TrendingUp, User } from "lucide-react";
import { Rev, Ventana } from "../perfil/Ventana";
import { AFORO_BASE, AMARILLO, AZUL, CLASES, DIAS, GOMA, GOMA2, INSCRIPCION, PIZARRA, PLANES, ROJO, SEDES, TIZA, VERDE, aforo, enDias, faltan, fechaCorta, horaAhora, nivel, porId, qz, type Gym, type Socio } from "./datos";
import { Carnet, Mastercard, Visa, btn } from "./piezas";

const BORDE = "rgba(255,255,255,.12)";
type Tab = "inicio" | "clases" | "progreso" | "pagos" | "cuenta";
const TABS: [Tab, string, typeof Bell][] = [["inicio", "Inicio", Dumbbell], ["clases", "Clases", Calendar], ["progreso", "Progreso", TrendingUp], ["pagos", "Plan y pagos", CreditCard], ["cuenta", "Mi cuenta", User]];

/* lo que el socio guarda de sí mismo, aparte para cada socio */
type Medida = { fecha: string; peso: number; cintura: number };
type Mio = { metaSemana: number; metaPeso: number; medidas: Medida[]; marcas: Record<string, number>; rutina: Record<string, string[]>; whatsapp: boolean; recordatorio: boolean };
const base = (): Mio => ({ metaSemana: 3, metaPeso: 70, medidas: [{ fecha: enDias(-60), peso: 78, cintura: 88 }, { fecha: enDias(-30), peso: 75.5, cintura: 85 }, { fecha: enDias(-3), peso: 73.2, cintura: 82 }], marcas: { Sentadilla: 70, "Press de banca": 45, "Peso muerto": 90 }, rutina: {}, whatsapp: true, recordatorio: true });
function useMio(num: number) {
  const clave = `gimnasio:socio:${num}`;
  const [m, setM] = useState<Mio>(() => { try { const t = localStorage.getItem(clave); return t ? { ...base(), ...JSON.parse(t) } : base(); } catch { return base(); } });
  useEffect(() => { try { const t = localStorage.getItem(clave); setM(t ? { ...base(), ...JSON.parse(t) } : base()); } catch { setM(base()); } }, [clave]);
  const poner = (c: Partial<Mio>) => setM((v) => { const n = { ...v, ...c }; try { localStorage.setItem(clave, JSON.stringify(n)); } catch { /* nada */ } return n; });
  return [m, poner] as const;
}

function Caja({ titulo, nota, derecha, className = "", children }: { titulo: string; nota?: string; derecha?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={`min-w-0 rounded-xl p-5 sm:p-6 ${className}`} style={{ background: GOMA2, border: `1px solid ${BORDE}` }}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div><h2 className="gym-titulo text-[clamp(1.9rem,1.6rem+0.8vw,2.4rem)]">{titulo}</h2>{nota && <p className="mt-1 text-[1.02rem] text-white/65">{nota}</p>}</div>
        {derecha}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
function Paso({ valor, alCambiar, min = 1, max = 99, paso = 1, unidad = "" }: { valor: number; alCambiar: (n: number) => void; min?: number; max?: number; paso?: number; unidad?: string }) {
  const r = (n: number) => Math.round(n * 10) / 10;
  return (
    <span className="inline-flex items-center gap-2">
      <button type="button" aria-label="Menos" onClick={() => alCambiar(Math.max(min, r(valor - paso)))} className="gy-btn grid h-11 w-11 place-items-center rounded-md border" style={{ borderColor: BORDE }}><Minus size={18} /></button>
      <b className="min-w-[3.5rem] text-center text-[1.4rem] tabular-nums">{valor}{unidad}</b>
      <button type="button" aria-label="Más" onClick={() => alCambiar(Math.min(max, r(valor + paso)))} className="gy-btn grid h-11 w-11 place-items-center rounded-md border" style={{ borderColor: BORDE }}><Plus size={18} /></button>
    </span>
  );
}
const campo = "min-h-[3.25rem] w-full rounded-md border bg-[#16181a] px-4 text-[1.1rem] outline-none focus:border-white/60";

/* la próxima fecha en que cae una clase (día de la semana), para mostrar el día real */
const proxima = (dia: number) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + ((dia - d.getDay() + 7) % 7)); return d; };
const fechaClase = (dia: number) => { const d = proxima(dia); const hoy = new Date().getDay() === dia; return hoy ? "Hoy" : `${DIAS[dia]} ${d.getDate()}`; };

export default function AppSocio({ gym, num, setNum }: { gym: Gym; num: number; setNum: (n: number) => void }) {
  const socio = gym.socios.find((x) => x.num === num) ?? gym.socios[0];
  const [tab, setTab] = useState<Tab>("inicio");
  const [mio, ponerMio] = useMio(socio.num);
  const [pagar, setPagar] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");
  const [dia, setDia] = useState(new Date().getDay());
  const p = porId(PLANES, socio.plan);
  const f = faltan(socio.vence);
  const hoy = new Date();
  const sede = porId(SEDES, socio.sede);
  const mias = CLASES.filter((c) => gym.reservas[c.id]);
  const piz = PIZARRA[hoy.getDay()];
  const hechos = mio.rutina[enDias(0)] ?? [];
  const color = f < 0 ? ROJO : f <= 5 ? AMARILLO : VERDE;
  useEffect(() => { if (!aviso) return; const t = setTimeout(() => setAviso(""), 3000); return () => clearTimeout(t); }, [aviso]);

  const semana = socio.visitas.filter((d) => d > hoy.getDate() - 7).length;
  let racha = 0;
  for (let d = hoy.getDate(); d >= 1 && socio.visitas.includes(d); d--) racha++;
  const h = horaAhora() >= 4 && horaAhora() < 22 ? horaAhora() : 18;
  const ahora = aforo(socio.sede, h);
  const nv = nivel(ahora, sede.capacidad);
  const mejor = Array.from({ length: 16 }, (_, i) => i + 6).map((x) => ({ x, n: aforo(socio.sede, x) })).sort((a, b) => a.n - b.n)[0];
  const diasMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
  const primero = new Date(hoy.getFullYear(), hoy.getMonth(), 1).getDay();
  const ultimaMedida = mio.medidas[mio.medidas.length - 1];

  const marcar = (x: string) => ponerMio({ rutina: { ...mio.rutina, [enDias(0)]: hechos.includes(x) ? hechos.filter((y) => y !== x) : [...hechos, x] } });

  return (
    <div className="gy-cont pb-20 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <label className="flex flex-wrap items-center gap-2 text-[1rem] text-white/70">Ver como:
            <select value={socio.num} onChange={(e) => setNum(Number(e.target.value))} className="min-h-[2.75rem] rounded-md border bg-transparent px-3 text-white" style={{ borderColor: BORDE }}>
              {gym.socios.map((s) => <option key={s.num} value={s.num} className="text-black">{s.nombre} ({porId(PLANES, s.plan).nombre.toLowerCase()})</option>)}
            </select>
          </label>
          <h1 className="gym-titulo gy-h2 mt-3">Hola, {socio.nombre.split(" ")[0]}</h1>
        </div>
        <span className="rounded-md px-4 py-2 text-[1.1rem] font-bold" style={{ background: color, color: color === AMARILLO ? GOMA : "#fff" }}>{f < 0 ? `Membresía vencida hace ${-f} ${-f === 1 ? "día" : "días"}` : f === 0 ? "Membresía vence hoy" : `Membresía vigente · ${f} días`}</span>
      </div>

      <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" aria-label="Partes de la app">
        {TABS.map(([id, t, I]) => <button key={id} type="button" aria-current={tab === id ? "page" : undefined} onClick={() => setTab(id)} className="gy-btn inline-flex min-h-[3.25rem] shrink-0 items-center gap-2 rounded-md px-5 text-[1.1rem] font-bold" style={tab === id ? { background: AMARILLO, color: GOMA } : { background: GOMA2 }}><I size={20} /> {t}</button>)}
      </nav>

      {f <= 5 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl p-4" style={{ background: f < 0 ? "rgba(215,38,61,.2)" : "rgba(242,194,48,.18)", border: `1.5px solid ${color}` }}>
          <p className="flex items-center gap-3 text-[1.15rem] font-semibold"><Bell size={24} style={{ color }} /> {f < 0 ? "La membresía está vencida. Renueve para volver a entrar por la talanquera." : `La membresía vence el ${fechaCorta(socio.vence)}. Renueve para no perder el acceso.`}</p>
          <button type="button" onClick={() => setPagar(socio.plan)} className={`${btn} gy-btn !py-3`} style={{ background: AMARILLO, color: GOMA }}>Renovar {qz(p.precio)}</button>
        </div>
      )}

      {tab === "inicio" && (
        <div className="mt-6 grid gap-5 lg:grid-cols-12">
          <div className="grid content-start gap-5 lg:col-span-5">
            <Carnet socio={socio} />
            <p className="-mt-2 text-[1.02rem] text-white/65">Este código se lee en la talanquera de {sede.nombre}. Se actualiza solo al renovar.</p>
            <Caja titulo="Tu membresía" nota={`Plan ${p.nombre.toLowerCase()} · vence el ${fechaCorta(socio.vence)}`}>
              <div className="flex items-center gap-5">
                <svg viewBox="0 0 44 44" width="112" height="112" className="shrink-0 -rotate-90" aria-hidden><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="5" /><circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="5" strokeDasharray={`${Math.max(0, Math.min(1, f / p.dias)) * 113} 113`} strokeLinecap="round" /></svg>
                <div><p className="gym-titulo text-[3.6rem]">{f < 0 ? "0" : f}</p><p className="text-[1.1rem] text-white/70">{f < 0 ? "días, membresía vencida" : f === 1 ? "día restante" : "días restantes"}</p></div>
              </div>
              <button type="button" onClick={() => setPagar(socio.plan)} className={`${btn} gy-btn mt-5 w-full !py-3.5 text-[1.15rem]`} style={{ background: AMARILLO, color: GOMA }}>Renovar {qz(p.precio)}</button>
            </Caja>
          </div>

          <div className="grid content-start gap-5 lg:col-span-7">
            <div className="gy-auto" style={{ ["--min" as string]: "11rem" }}>
              {[[Dumbbell, String(socio.visitas.length), "entrenos este mes"], [Flame, `${racha}`, racha === 1 ? "día seguido" : "días seguidos"], [Target, `${semana} de ${mio.metaSemana}`, "entrenos esta semana"], [Calendar, String(mias.length), mias.length === 1 ? "clase apartada" : "clases apartadas"]].map(([I, n, t]) => { const Icono = I as typeof Dumbbell; return (
                <div key={t as string} className="flex items-center gap-3 rounded-xl p-4" style={{ background: GOMA2, border: `1px solid ${BORDE}` }}><span className="grid h-12 w-12 shrink-0 place-items-center rounded-md" style={{ background: AMARILLO, color: GOMA }}><Icono size={24} /></span><span className="leading-tight"><b className="gym-titulo block text-[2.2rem]">{n as string}</b><span className="text-[0.98rem] text-white/70">{t as string}</span></span></div>
              ); })}
            </div>

            <Caja titulo={`Cuánta gente hay en ${sede.nombre}`} nota={`Estimado ahora: ${nv.t.toLowerCase()}, unas ${ahora} personas. Capacidad aproximada ${sede.capacidad}.`} derecha={<span className="rounded px-3 py-1.5 text-[1rem] font-bold" style={{ background: nv.c, color: nv.c === AMARILLO ? GOMA : "#fff" }}>{nv.t}</span>}>
              <div className="flex h-24 items-end gap-[3px]" aria-label="Gente por hora hoy">
                {AFORO_BASE.map((_, i) => { const n = aforo(socio.sede, i + 4); return <span key={i} title={`${i + 4}:00, ${n} personas`} className="flex-1 rounded-sm" style={{ height: `${Math.max(8, (n / sede.capacidad) * 100)}%`, background: i + 4 === h ? AMARILLO : "rgba(255,255,255,.22)" }} />; })}
              </div>
              <div className="mt-1 flex justify-between text-[0.9rem] text-white/60"><span>4:00</span><span>13:00</span><span>21:00</span></div>
              <p className="mt-3 text-[1.1rem]">Hora con menos gente hoy: <b style={{ color: AMARILLO }}>{mejor.x}:00</b> (unas {mejor.n} personas).</p>
            </Caja>

            <Caja titulo={`Rutina de hoy: ${piz.titulo}`} nota={`${hechos.length} de ${piz.lista.length} ejercicios completados`} derecha={<button type="button" onClick={() => ponerMio({ rutina: { ...mio.rutina, [enDias(0)]: hechos.length === piz.lista.length ? [] : piz.lista } })} className="gy-btn min-h-[2.75rem] rounded-md border px-4 text-[1rem] font-semibold" style={{ borderColor: BORDE }}>{hechos.length === piz.lista.length ? "Desmarcar todo" : "Marcar todo"}</button>}>
              <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${(hechos.length / piz.lista.length) * 100}%`, background: VERDE }} /></div>
              <ul className="grid gap-2.5">
                {piz.lista.map((x) => { const si = hechos.includes(x); return (
                  <li key={x}><button type="button" aria-pressed={si} onClick={() => marcar(x)} className="flex min-h-[3.5rem] w-full items-center gap-3.5 rounded-lg px-4 text-left text-[1.2rem]" style={{ background: GOMA, border: `1px solid ${si ? VERDE : BORDE}` }}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border-2" style={{ borderColor: si ? VERDE : "rgba(255,255,255,.35)", background: si ? VERDE : "transparent" }}>{si && <Check size={20} strokeWidth={3} />}</span><span className={si ? "line-through opacity-60" : ""}>{x}</span></button></li>
                ); })}
              </ul>
            </Caja>
          </div>

          <Caja className="lg:col-span-5" titulo="Asistencia del mes" nota="Cada vez que el código pasa por la talanquera se marca el día.">
            <div className="grid grid-cols-7 gap-1.5 text-center text-[0.85rem] text-white/50">
              {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => <span key={i}>{d}</span>)}
              {Array.from({ length: primero }, (_, i) => <span key={`v${i}`} />)}
              {Array.from({ length: diasMes }, (_, i) => { const d = i + 1; const fue = socio.visitas.includes(d); const futuro = d > hoy.getDate(); return <span key={d} className="grid aspect-square place-items-center rounded-md text-[0.95rem] font-semibold" style={{ background: fue ? VERDE : futuro ? "transparent" : "rgba(255,255,255,.06)", color: fue ? "#fff" : futuro ? "rgba(255,255,255,.25)" : "rgba(255,255,255,.55)", outline: d === hoy.getDate() ? `2px solid ${AMARILLO}` : undefined }}>{d}</span>; })}
            </div>
          </Caja>
          <Caja className="lg:col-span-7" titulo="Clases apartadas" derecha={<button type="button" onClick={() => setTab("clases")} className="inline-flex min-h-[2.75rem] items-center gap-1 text-[1.05rem] font-bold" style={{ color: AMARILLO }}>Ver clases <ChevronRight size={18} /></button>}>
            {mias.length === 0 ? <p className="rounded-lg px-4 py-6 text-center text-[1.1rem] text-white/60" style={{ background: GOMA }}>No hay clases apartadas. Ingrese a Clases para reservar un lugar.</p> : (
              <ul className="grid gap-2.5">{mias.map((c) => (
                <li key={c.id} className="flex items-center gap-4 rounded-lg p-3" style={{ background: GOMA }}><img src={c.foto} alt="" className="h-16 w-16 shrink-0 rounded-md object-cover" /><span className="min-w-0 flex-1 leading-tight"><b className="block text-[1.2rem]">{c.nombre}</b><span className="text-[1rem] text-white/65">{fechaClase(c.dia)} · {c.hora} · con {c.coach}</span></span><button type="button" onClick={() => gym.reservar(c.id)} className="gy-btn min-h-[2.75rem] rounded-md border px-4 text-[1rem] font-semibold" style={{ borderColor: BORDE }}>Cancelar</button></li>
              ))}</ul>
            )}
          </Caja>
        </div>
      )}

      {tab === "clases" && (
        <div className="mt-6 grid gap-5">
          <Caja titulo="Mis reservas" nota={mias.length ? `${mias.length} ${mias.length === 1 ? "clase apartada" : "clases apartadas"}` : "Aún no hay clases apartadas."}>
            {mias.length > 0 && <ul className="gy-auto" style={{ ["--min" as string]: "20rem" }}>{mias.map((c) => <li key={c.id} className="flex items-center gap-3 rounded-lg p-3" style={{ background: GOMA }}><img src={c.foto} alt="" className="h-14 w-14 rounded-md object-cover" /><span className="min-w-0 flex-1 leading-tight"><b className="block">{c.nombre}</b><span className="text-[0.98rem] text-white/65">{fechaClase(c.dia)} · {c.hora}</span></span><button type="button" onClick={() => gym.reservar(c.id)} className="gy-btn min-h-[2.75rem] rounded-md border px-3 text-[0.98rem] font-semibold" style={{ borderColor: BORDE }}>Cancelar</button></li>)}</ul>}
          </Caja>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Día">
            {[1, 2, 3, 4, 5, 6, 0].map((d) => <button key={d} type="button" aria-pressed={dia === d} onClick={() => setDia(d)} className="gy-btn min-h-[3.25rem] flex-1 rounded-md px-4 text-[1.1rem] font-bold" style={dia === d ? { background: TIZA, color: GOMA } : { background: GOMA2 }}>{d === hoy.getDay() ? "Hoy" : DIAS[d]}</button>)}
          </div>
          <div className="gy-auto" style={{ ["--min" as string]: "25rem" }}>
            {CLASES.filter((c) => c.dia === dia).map((c, i) => {
              const mia = !!gym.reservas[c.id]; const van = c.van + (mia ? 1 : 0); const lleno = van >= c.cupo && !mia;
              return (
                <Rev key={c.id} i={i} className="h-full"><div className="gy-card flex h-full overflow-hidden rounded-xl" style={{ background: GOMA2 }}>
                  <img src={c.foto} alt="" className="gy-img w-[34%] shrink-0 object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col p-4">
                    <span className="text-[1.15rem] font-bold" style={{ color: AMARILLO }}>{fechaClase(c.dia)} · {c.hora}</span>
                    <span className="gym-titulo text-[2.1rem]">{c.nombre}</span>
                    <span className="text-[1.02rem] text-white/65">con {c.coach} · quedan {Math.max(0, c.cupo - van)} de {c.cupo}</span>
                    <button type="button" disabled={lleno} onClick={() => gym.reservar(c.id)} className="gy-btn mt-auto min-h-[3rem] rounded-md text-[1.05rem] font-bold disabled:opacity-40" style={{ marginTop: 12, ...(mia ? { background: VERDE, color: "#fff" } : { background: TIZA, color: GOMA }) }}>{mia ? "Apartada · tocar para cancelar" : lleno ? "Clase llena" : "Apartar lugar"}</button>
                  </div>
                </div></Rev>
              );
            })}
          </div>
        </div>
      )}

      {tab === "progreso" && (
        <div className="mt-6 grid gap-5 lg:grid-cols-12">
          <Caja className="lg:col-span-7" titulo="Peso y cintura" nota={`Último registro: ${ultimaMedida.peso} kg · ${ultimaMedida.cintura} cm`}>
            <Grafica puntos={mio.medidas.map((m) => ({ x: fechaCorta(m.fecha), y: m.peso }))} meta={mio.metaPeso} />
            <RegistroMedida alGuardar={(m) => { ponerMio({ medidas: [...mio.medidas, m] }); setAviso("Medida registrada."); }} ultima={ultimaMedida} />
            <ul className="mt-5 grid gap-2">{[...mio.medidas].reverse().slice(0, 4).map((m, i) => <li key={i} className="flex justify-between rounded-lg px-4 py-2.5 text-[1.05rem]" style={{ background: GOMA }}><span>{fechaCorta(m.fecha)}</span><b>{m.peso} kg · {m.cintura} cm</b></li>)}</ul>
          </Caja>
          <div className="grid content-start gap-5 lg:col-span-5">
            <Caja titulo="Metas" nota="Se pueden cambiar cuando se necesite.">
              <div className="grid gap-5">
                <div><p className="text-[1.1rem] font-bold">Entrenos por semana</p><div className="mt-2"><Paso valor={mio.metaSemana} alCambiar={(n) => ponerMio({ metaSemana: n })} min={1} max={7} /></div><div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${Math.min(100, (semana / mio.metaSemana) * 100)}%`, background: AMARILLO }} /></div><p className="mt-1 text-[1rem] text-white/65">{semana} de {mio.metaSemana} esta semana</p></div>
                <div><p className="text-[1.1rem] font-bold">Peso objetivo</p><div className="mt-2"><Paso valor={mio.metaPeso} alCambiar={(n) => ponerMio({ metaPeso: n })} min={30} max={200} paso={0.5} unidad=" kg" /></div><p className="mt-2 text-[1rem] text-white/65">{Math.abs(ultimaMedida.peso - mio.metaPeso) < 0.05 ? "Objetivo alcanzado." : `Faltan ${Math.abs(Math.round((ultimaMedida.peso - mio.metaPeso) * 10) / 10)} kg ${ultimaMedida.peso > mio.metaPeso ? "para bajar" : "para subir"}.`}</p></div>
              </div>
            </Caja>
            <Caja titulo="Marcas personales" nota="El peso máximo en cada ejercicio, en kilos.">
              <ul className="grid gap-3">{Object.entries(mio.marcas).map(([n, v]) => <li key={n} className="flex items-center justify-between gap-3"><b className="text-[1.15rem]">{n}</b><Paso valor={v} alCambiar={(x) => ponerMio({ marcas: { ...mio.marcas, [n]: x } })} min={0} max={500} paso={2.5} unidad=" kg" /></li>)}</ul>
            </Caja>
          </div>
        </div>
      )}

      {tab === "pagos" && (
        <div className="mt-6 grid gap-5 lg:grid-cols-12">
          <Caja className="lg:col-span-5" titulo="Plan actual" nota={`Plan ${p.nombre.toLowerCase()} · sede ${sede.nombre}`}>
            <p className="gym-titulo text-[3.6rem]" style={{ color: p.color }}>{p.nombre}</p>
            <p className="text-[1.2rem]">{qz(p.precio)} · {p.dias} {p.dias === 1 ? "día" : "días"}</p>
            <p className="mt-1 text-[1.05rem] text-white/70">Vence el {fechaCorta(socio.vence)} ({f < 0 ? "vencida" : `en ${f} días`}).</p>
            <button type="button" onClick={() => setPagar(socio.plan)} className={`${btn} gy-btn mt-5 w-full !py-3.5 text-[1.15rem]`} style={{ background: AMARILLO, color: GOMA }}>Renovar {qz(p.precio)}</button>
            {socio.plan === "anual" ? <button type="button" onClick={() => setAviso("Membresía congelada hasta 30 días. En su gimnasio, esto se aprueba en recepción.")} className="gy-btn mt-3 inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-md border text-[1.05rem] font-semibold" style={{ borderColor: BORDE }}><Snowflake size={19} /> Congelar membresía</button> : <p className="mt-3 text-[0.98rem] text-white/55">Congelar membresía está disponible en el plan anual.</p>}
          </Caja>
          <Caja className="lg:col-span-7" titulo="Comparar planes" nota="Costo por mes de cada plan, para elegir el que conviene.">
            <ul className="grid gap-2.5">
              {PLANES.filter((x) => x.id !== "dia").map((x) => { const mes = Math.round((x.precio / (x.dias / 30)) * 10) / 10; const ahorro = Math.round((175 - mes) * (x.dias / 30)); return (
                <li key={x.id} className="flex flex-wrap items-center gap-4 rounded-lg p-4" style={{ background: GOMA, border: x.id === socio.plan ? `1.5px solid ${x.color}` : `1px solid ${BORDE}` }}>
                  <span className="disco h-14 w-14 shrink-0" style={{ background: x.color }} />
                  <span className="min-w-0 flex-1 leading-tight"><b className="gym-titulo block text-[1.9rem]">{x.nombre}</b><span className="text-[1.05rem] text-white/70">{qz(x.precio)} · {qz(mes)} al mes{ahorro > 0 ? ` · ahorro de ${qz(ahorro)}` : ""}</span></span>
                  {x.id === socio.plan ? <span className="rounded-md px-3 py-1.5 text-[0.95rem] font-bold" style={{ background: x.color, color: x.texto }}>Plan actual</span> : <button type="button" onClick={() => setPagar(x.id)} className="gy-btn min-h-[3rem] rounded-md px-5 text-[1.05rem] font-bold" style={{ background: x.color, color: x.texto }}>Cambiar a {x.nombre.toLowerCase()}</button>}
                </li>
              ); })}
            </ul>
          </Caja>
          <Caja className="lg:col-span-7" titulo="Historial de pagos">
            {gym.pagos.filter((x) => x.num === socio.num).length === 0 ? <p className="rounded-lg px-4 py-6 text-center text-[1.1rem] text-white/60" style={{ background: GOMA }}>Aún no hay pagos registrados.</p> : (
              <ul className="grid gap-2">{[...gym.pagos].filter((x) => x.num === socio.num).reverse().map((x, i) => <li key={i} className="flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-[1.1rem]" style={{ background: GOMA }}><span><b>{x.que}</b><span className="block text-[0.95rem] text-white/60">{x.dia} de {["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][hoy.getMonth()]}</span></span><b>{qz(x.monto)}</b></li>)}</ul>
            )}
          </Caja>
          <Caja className="lg:col-span-5" titulo="Invitar a un amigo" nota="Cada amigo que se inscribe suma una semana gratis a la membresía.">
            <p className="gym-titulo text-[2.6rem]" style={{ color: AMARILLO }}>SPARTAN-{socio.num}</p>
            <button type="button" onClick={() => setAviso(`Código SPARTAN-${socio.num} copiado.`)} className={`${btn} gy-btn mt-3 w-full !py-3.5 text-[1.1rem] border`} style={{ borderColor: BORDE }}><Gift size={20} /> Copiar código</button>
          </Caja>
        </div>
      )}

      {tab === "cuenta" && (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Caja titulo="Datos del socio">
            <dl className="grid gap-3 text-[1.15rem]">
              {[["Nombre", socio.nombre], ["Número de socio", String(socio.num)], ["WhatsApp", socio.tel.replace(/(\d{4})(\d{4})/, "$1 $2")], ["Sede", sede.nombre], ["Plan", p.nombre]].map(([a, b]) => <div key={a} className="flex justify-between gap-3 rounded-lg px-4 py-3" style={{ background: GOMA }}><dt className="text-white/65">{a}</dt><dd className="font-bold">{b}</dd></div>)}
            </dl>
          </Caja>
          <Caja titulo="Avisos" nota="Elija qué mensajes recibir por WhatsApp.">
            <ul className="grid gap-3">
              {([["whatsapp", "Aviso 3 días antes de que venza la membresía"], ["recordatorio", "Recordatorio una hora antes de cada clase apartada"]] as const).map(([k, t]) => (
                <li key={k}><button type="button" aria-pressed={mio[k]} onClick={() => ponerMio({ [k]: !mio[k] })} className="flex min-h-[3.5rem] w-full items-center justify-between gap-4 rounded-lg px-4 py-3 text-left text-[1.1rem]" style={{ background: GOMA }}><span>{t}</span><span className="relative h-8 w-14 shrink-0 rounded-full transition" style={{ background: mio[k] ? VERDE : "rgba(255,255,255,.2)" }}><span className="absolute top-1 h-6 w-6 rounded-full bg-white transition-all" style={{ left: mio[k] ? "1.9rem" : "0.25rem" }} /></span></button></li>
              ))}
            </ul>
          </Caja>
        </div>
      )}

      {pagar && <Pagar socio={socio} planId={pagar} alCerrar={() => setPagar(null)} alPagar={(metodo) => { if (pagar !== socio.plan) gym.cambiarPlan(socio.num, pagar); gym.cobrar(socio.num, metodo); setPagar(null); setAviso(`Pago registrado (${metodo}). La membresía se actualizó.`); }} />}
      {aviso && <div role="status" className="fixed inset-x-0 bottom-6 z-[90] mx-auto w-fit max-w-[calc(100vw-2rem)] rounded-lg px-5 py-3 text-[1.05rem] font-semibold shadow-xl" style={{ background: TIZA, color: GOMA }}>{aviso}</div>}
    </div>
  );
}

function Grafica({ puntos, meta }: { puntos: { x: string; y: number }[]; meta: number }) {
  const ys = [...puntos.map((p) => p.y), meta];
  const min = Math.min(...ys) - 2, max = Math.max(...ys) + 2;
  const X = (i: number) => 30 + (puntos.length === 1 ? 280 : (i / (puntos.length - 1)) * 580);
  const Y = (v: number) => 20 + ((max - v) / (max - min)) * 150;
  return (
    <svg viewBox="0 0 640 210" className="w-full" role="img" aria-label="Peso en el tiempo">
      <line x1="30" x2="610" y1={Y(meta)} y2={Y(meta)} stroke={VERDE} strokeDasharray="6 5" strokeWidth="2" />
      <text x="612" y={Y(meta) + 4} fontSize="13" fill={VERDE} textAnchor="end" dy="-6">objetivo {meta} kg</text>
      <polyline fill="none" stroke={AMARILLO} strokeWidth="3.5" strokeLinejoin="round" points={puntos.map((p, i) => `${X(i)},${Y(p.y)}`).join(" ")} />
      {puntos.map((p, i) => <g key={i}><circle cx={X(i)} cy={Y(p.y)} r="5.5" fill={AMARILLO} /><text x={X(i)} y={Y(p.y) - 12} textAnchor="middle" fontSize="14" fontWeight="700" fill={TIZA}>{p.y}</text><text x={X(i)} y="200" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,.6)">{p.x}</text></g>)}
    </svg>
  );
}

function RegistroMedida({ alGuardar, ultima }: { alGuardar: (m: Medida) => void; ultima: Medida }) {
  const [peso, setPeso] = useState("");
  const [cin, setCin] = useState("");
  const ok = Number(peso) > 20 && Number(cin) > 30;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (ok) { alGuardar({ fecha: enDias(0), peso: Number(peso), cintura: Number(cin) }); setPeso(""); setCin(""); } }} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <input aria-label="Peso en kilos" inputMode="decimal" value={peso} onChange={(e) => setPeso(e.target.value.replace(/[^\d.]/g, ""))} placeholder={`Peso (kg), último ${ultima.peso}`} className={campo} style={{ borderColor: BORDE }} />
      <input aria-label="Cintura en centímetros" inputMode="decimal" value={cin} onChange={(e) => setCin(e.target.value.replace(/[^\d.]/g, ""))} placeholder={`Cintura (cm), última ${ultima.cintura}`} className={campo} style={{ borderColor: BORDE }} />
      <button type="submit" disabled={!ok} className="gy-btn min-h-[3.25rem] rounded-md px-6 text-[1.1rem] font-bold disabled:opacity-40" style={{ background: AMARILLO, color: GOMA }}>Registrar</button>
    </form>
  );
}

function Pagar({ socio, planId, alCerrar, alPagar }: { socio: Socio; planId: string; alCerrar: () => void; alPagar: (metodo: string) => void }) {
  const [metodo, setMetodo] = useState("tarjeta");
  const pl = porId(PLANES, planId);
  const nombres: Record<string, string> = { tarjeta: "tarjeta", transferencia: "transferencia", recepcion: "recepción" };
  const opciones: [string, string, string, ReactNode][] = [
    ["tarjeta", "Con tarjeta, aquí mismo", "El acceso se activa al instante", <span key="t" className="flex items-center gap-2"><Visa /><Mastercard /></span>],
    ["transferencia", "Por transferencia", "Sube el comprobante y se activa", <span key="b" className="rounded px-2 py-1 text-[0.85rem] font-bold text-white" style={{ background: AZUL }}>BANCA EN LÍNEA</span>],
    ["recepcion", "En recepción", "Se paga al llegar, en efectivo o tarjeta", <span key="r" className="rounded px-2 py-1 text-[0.85rem] font-bold" style={{ background: AMARILLO, color: GOMA }}>EFECTIVO</span>],
  ];
  const desde = faltan(socio.vence) > 0 ? socio.vence : enDias(0);
  return (
    <Ventana titulo={`Pagar plan ${pl.nombre}`} alCerrar={alCerrar} fondo={GOMA2} color={TIZA} ancho="40rem">
      <div className="p-6 pt-8">
        <p className="text-[1rem] font-bold uppercase tracking-[0.15em]" style={{ color: pl.color === GOMA ? AMARILLO : pl.color }}>{planId === socio.plan ? "Renovación" : "Cambio de plan"}</p>
        <h3 className="gym-titulo mt-1 text-[3rem]">Plan {pl.nombre}</h3>
        <p className="mt-1 text-[1.15rem] text-white/75">{pl.dias} {pl.dias === 1 ? "día" : "días"} desde el {fechaCorta(desde)}. Total: <b style={{ color: AMARILLO }}>{qz(pl.precio)}</b>{planId !== socio.plan && pl.id !== "dia" ? `, sin inscripción (${qz(INSCRIPCION)})` : ""}.</p>
        <div className="mt-5 grid gap-2.5">
          {opciones.map(([id, t, n, logo]) => (
            <button key={id} type="button" onClick={() => setMetodo(id)} aria-pressed={metodo === id} className="flex items-center justify-between gap-3 rounded-lg border-2 px-4 py-3 text-left" style={metodo === id ? { background: TIZA, color: GOMA, borderColor: TIZA } : { borderColor: BORDE }}>
              <span><b className="block text-[1.1rem]">{t}</b><span className="text-[0.95rem] opacity-75">{n}</span></span><span className="shrink-0">{logo}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={() => alPagar(nombres[metodo])} className="gy-btn mt-6 min-h-[3.75rem] w-full rounded-md text-[1.25rem] font-bold" style={{ background: AMARILLO, color: GOMA }}>{metodo === "tarjeta" ? `Pagar ${qz(pl.precio)} con tarjeta` : metodo === "transferencia" ? "Ya hice la transferencia" : "Pagaré en recepción"}</button>
        <p className="mt-3 text-[0.95rem] text-white/55">Demo: no se cobra nada. En su gimnasio se conecta a su banco o pasarela de pago.</p>
      </div>
    </Ventana>
  );
}

