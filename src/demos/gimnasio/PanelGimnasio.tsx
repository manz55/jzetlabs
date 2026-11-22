/*
 * Panel de Spartan Force Gym: el tablero del dueño y de recepción, sobrio y claro.
 * Menú lateral negro con amarillo de disco y contenido en gris oscuro. Secciones: Resumen, Acceso, Socios, Clases, Pagos y Ajustes.
 * Lo que se ve primero: ingresos contra la meta, quién debe, qué transferencias confirmar, quién está por abandonar y cuánta gente hay.
 * Lo que llega de la página y de la app del socio (inscripciones, pagos, reservas) se refleja aquí.
 */
import { useEffect, useState, type ReactNode } from "react";
import { Bell, CalendarDays, Check, CreditCard, IdCard, LayoutDashboard, Minus, Plus, Search, Settings, UserPlus, Users } from "lucide-react";
import { MensajeWhatsApp } from "../comun";
import { Ventana } from "../perfil/Ventana";
import { AFORO_BASE, AMARILLO, AZUL, CLASES, DIAS, INSCRIPCION, PLANES, ROJO, SEDES, VERDE, aforo, enDias, faltan, fechaCorta, horaAhora, nivel, porId, qz, type Gym, type Socio } from "./datos";

const NEGRO = "#0d0e0f";
const GRIS = "#16181a";
const BORDE = "#2e3236";
const TINTA = "#efeee9";
const CUERPO = "'Instrument Sans', system-ui, sans-serif";
const TITULO = "'Big Shoulders Display', 'Instrument Sans', sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace";
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const SECCIONES = [
  { id: "resumen", t: "Resumen", I: LayoutDashboard },
  { id: "acceso", t: "Acceso", I: IdCard },
  { id: "socios", t: "Socios", I: Users },
  { id: "clases", t: "Clases", I: CalendarDays },
  { id: "pagos", t: "Pagos", I: CreditCard },
  { id: "ajustes", t: "Ajustes", I: Settings },
] as const;
type Sec = (typeof SECCIONES)[number]["id"];

/* lo que la administración ajusta a su gusto */
type Ajustes = { meta: number; avisoDias: number; riesgoDias: number };
const AJ0: Ajustes = { meta: 12000, avisoDias: 7, riesgoDias: 3 };
function useAjustes() {
  const [a, setA] = useState<Ajustes>(() => { try { const t = localStorage.getItem("gimnasio:ajustes-v2"); return t ? { ...AJ0, ...JSON.parse(t) } : AJ0; } catch { return AJ0; } });
  const poner = (c: Partial<Ajustes>) => setA((v) => { const n = { ...v, ...c }; try { localStorage.setItem("gimnasio:ajustes-v2", JSON.stringify(n)); } catch { /* nada */ } return n; });
  return [a, poner] as const;
}

function Tarjeta({ titulo, nota, derecha, className = "", children }: { titulo?: string; nota?: string; derecha?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={`min-w-0 rounded-xl border bg-[#202326] p-5 sm:p-6 ${className}`} style={{ borderColor: BORDE }}>
      {(titulo || derecha) && <div className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2"><div>{titulo && <h2 className="text-[1.3rem] font-bold leading-tight">{titulo}</h2>}{nota && <p className="mt-0.5 text-[0.98rem] opacity-65">{nota}</p>}</div>{derecha}</div>}
      {children}
    </section>
  );
}
function Insignia({ ok, children }: { ok: "bien" | "aviso" | "mal"; children: ReactNode }) {
  const c = ok === "bien" ? { b: "rgba(46,155,87,.22)", t: "#8be0a8" } : ok === "aviso" ? { b: "rgba(242,194,48,.2)", t: "#f2c230" } : { b: "rgba(215,38,61,.25)", t: "#ff9aa8" };
  return <span className="inline-block whitespace-nowrap rounded-full px-3 py-1 text-[0.9rem] font-semibold" style={{ background: c.b, color: c.t }}>{children}</span>;
}
function Btn({ children, alTocar, tipo = "lleno", deshabilitado = false }: { children: ReactNode; alTocar: () => void; tipo?: "lleno" | "borde" | "rojo"; deshabilitado?: boolean }) {
  const s = tipo === "lleno" ? { background: AMARILLO, color: NEGRO } : tipo === "rojo" ? { background: ROJO, color: "#fff" } : { background: "transparent", color: TINTA, border: `1.5px solid ${TINTA}` };
  return <button type="button" disabled={deshabilitado} onClick={alTocar} className="inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-lg px-4 py-2 text-[1rem] font-semibold transition hover:opacity-90 active:scale-[0.98] disabled:opacity-40" style={s}>{children}</button>;
}
function Barra({ valor, color, alto = 10 }: { valor: number; color: string; alto?: number }) {
  return <span className="block overflow-hidden rounded-full" style={{ background: BORDE, height: alto }}><span className="block h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, valor))}%`, background: color }} /></span>;
}
function Paso({ valor, alCambiar, min, max, paso, formato }: { valor: number; alCambiar: (n: number) => void; min: number; max: number; paso: number; formato?: (n: number) => string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <button type="button" aria-label="Menos" onClick={() => alCambiar(Math.max(min, valor - paso))} className="grid h-11 w-11 place-items-center rounded-lg border" style={{ borderColor: BORDE }}><Minus size={18} /></button>
      <b className="min-w-[5rem] text-center text-[1.5rem] tabular-nums">{formato ? formato(valor) : valor}</b>
      <button type="button" aria-label="Más" onClick={() => alCambiar(Math.min(max, valor + paso))} className="grid h-11 w-11 place-items-center rounded-lg border" style={{ borderColor: BORDE }}><Plus size={18} /></button>
    </span>
  );
}
const norm = (m?: string) => (m ?? "recepción").replace("recepcion", "recepción");
const METODO: Record<string, { t: string; c: string }> = { tarjeta: { t: "Tarjeta", c: "#1434CB" }, transferencia: { t: "Transferencia", c: AZUL }, "recepción": { t: "Recepción", c: "#8a6d00" } };

export default function PanelGimnasio({ gym }: { gym: Gym }) {
  const [sec, setSec] = useState<Sec>("resumen");
  const [aj, ponerAj] = useAjustes();
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "al-dia" | "por-vencer" | "vencidos" | "riesgo">("todos");
  const [carnet, setCarnet] = useState("");
  const [adentro, setAdentro] = useState<number | null>(null);
  const [dia, setDia] = useState(new Date().getDay());
  const [msg, setMsg] = useState<string | null>(null);
  const [ficha, setFicha] = useState<number | null>(null);
  const [alta, setAlta] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 3000); return () => clearTimeout(t); }, [toast]);

  const hoy = new Date().getDate();
  const nombre = (n: number) => gym.socios.find((s) => s.num === n)?.nombre ?? "Pase de día";
  const estado = (s: Socio) => { const f = faltan(s.vence); return f < 0 ? "vencidos" : f <= aj.avisoDias ? "por-vencer" : "al-dia"; };
  const diasSin = (s: Socio) => (s.visitas.length ? hoy - Math.max(...s.visitas) : 30);
  const vencidas = gym.socios.filter((s) => estado(s) === "vencidos").sort((a, b) => faltan(a.vence) - faltan(b.vence));
  const porVencer = gym.socios.filter((s) => estado(s) === "por-vencer");
  const riesgo = gym.socios.filter((s) => estado(s) !== "vencidos" && diasSin(s) >= aj.riesgoDias && !s.nuevo);
  const activos = gym.socios.length - vencidas.length;
  const porCobrar = vencidas.reduce((t, s) => t + porId(PLANES, s.plan).precio, 0);
  const confirmados = gym.pagos.filter((x) => !x.pendiente);
  const pendientes = gym.pagos.map((x, i) => ({ x, i })).filter(({ x }) => x.pendiente);
  const cobradoHoy = confirmados.filter((x) => x.dia === hoy).reduce((t, x) => t + x.monto, 0);
  const cobradoMes = confirmados.reduce((t, x) => t + x.monto, 0);
  const porConfirmar = pendientes.reduce((t, { x }) => t + x.monto, 0);
  const altas = gym.socios.filter((s) => s.nuevo).length;
  const h = horaAhora();
  const clasesDia = CLASES.filter((c) => c.dia === dia);
  const ocupacion = (c: (typeof CLASES)[number]) => Math.min(100, Math.round(((c.van + (gym.reservas[c.id] ? 1 : 0)) / c.cupo) * 100));
  const ocupMedia = Math.round(CLASES.reduce((t, c) => t + ocupacion(c), 0) / CLASES.length);
  const llenas = CLASES.filter((c) => ocupacion(c) >= 90);
  const ventasPlan = PLANES.map((p) => ({ p, t: confirmados.filter((x) => x.que.toLowerCase().includes(p.nombre.toLowerCase())).reduce((t, x) => t + x.monto, 0) })).filter((v) => v.t > 0);
  const maxVenta = Math.max(1, ...ventasPlan.map((v) => v.t));
  const porMetodo = Object.keys(METODO).map((m) => ({ m, t: confirmados.filter((x) => norm(x.metodo) === m).reduce((t, x) => t + x.monto, 0) }));
  const maxMetodo = Math.max(1, ...porMetodo.map((v) => v.t));
  const porDia = Array.from({ length: hoy }, (_, i) => ({ d: i + 1, t: confirmados.filter((x) => x.dia === i + 1).reduce((t, x) => t + x.monto, 0) }));
  const maxDia = Math.max(1, ...porDia.map((v) => v.t));
  const pico = AFORO_BASE.indexOf(Math.max(...AFORO_BASE)) + 4;
  const valle = AFORO_BASE.slice(2, 16).indexOf(Math.min(...AFORO_BASE.slice(2, 16))) + 6;
  const buscados = carnet.trim() ? gym.socios.filter((s) => String(s.num) === carnet.replace(/\D/g, "") || s.nombre.toLowerCase().includes(carnet.trim().toLowerCase())).slice(0, 3) : [];
  const filas = gym.socios.filter((s) => (filtro === "todos" || (filtro === "riesgo" ? riesgo.includes(s) : estado(s) === filtro)) && `${s.nombre} ${s.num} ${s.tel}`.toLowerCase().includes(q.trim().toLowerCase()));
  const socioFicha = gym.socios.find((s) => s.num === ficha);

  const recordar = (s: Socio) => {
    const f = faltan(s.vence), p = porId(PLANES, s.plan);
    setMsg(`Hola, ${s.nombre.split(" ")[0]}. Le saluda Spartan Force Gym. ${f < 0 ? `Su plan ${p.nombre.toLowerCase()} venció el ${fechaCorta(s.vence)}` : f === 0 ? `Su plan ${p.nombre.toLowerCase()} vence hoy` : `Su plan ${p.nombre.toLowerCase()} vence el ${fechaCorta(s.vence)}`}. Puede renovarlo en recepción o desde la app (${qz(p.precio)}).`);
  };
  const extrañar = (s: Socio) => setMsg(`Hola, ${s.nombre.split(" ")[0]}. Le saluda Spartan Force Gym. Hace ${diasSin(s)} días no registramos su asistencia. Las clases de esta semana tienen lugares disponibles: puede apartar el suyo desde la app.`);

  const kpi = (t: string, v: string, n: string, alerta = false, alTocar?: () => void) => (
    <button type="button" onClick={alTocar} disabled={!alTocar} className="rounded-xl border bg-[#202326] p-5 text-left disabled:cursor-default" style={{ borderColor: alerta ? ROJO : BORDE }}>
      <p className="text-[1rem] opacity-70">{t}</p>
      <p className="mt-1 text-[clamp(2rem,1.7rem+1vw,2.7rem)] font-bold leading-none tabular-nums" style={{ color: alerta ? "#ff9aa8" : TINTA, fontFamily: TITULO }}>{v}</p>
      <p className="mt-2 text-[0.95rem] opacity-65">{n}</p>
    </button>
  );

  return (
    <div className="panel-demo min-h-[calc(100vh-8rem)] md:grid md:grid-cols-[15rem_minmax(0,1fr)]" style={{ background: GRIS, color: TINTA, fontFamily: CUERPO }}>
      <aside className="md:sticky md:top-0 md:h-screen md:self-start" style={{ background: NEGRO, color: "#fff" }}>
        <div className="flex items-center gap-3 px-4 py-4">
          <span className="grid h-10 w-10 place-items-center rounded-lg text-[1.25rem] font-black" style={{ background: AMARILLO, color: NEGRO, fontFamily: TITULO }}>S</span>
          <span className="leading-tight"><span className="block text-[1.25rem] font-extrabold uppercase tracking-wide" style={{ fontFamily: TITULO }}>Spartan Force</span><span className="text-[0.82rem] text-white/60">Panel del gimnasio</span></span>
        </div>
        <nav aria-label="Panel" className="flex gap-1 overflow-x-auto px-2 pb-2 md:block md:space-y-1 md:px-3">
          {SECCIONES.map(({ id, t, I }) => (
            <button key={id} type="button" onClick={() => setSec(id)} aria-current={sec === id ? "page" : undefined} className="flex min-h-[2.9rem] shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-[1.02rem] font-semibold md:w-full" style={sec === id ? { background: AMARILLO, color: NEGRO } : { color: "rgba(255,255,255,.78)" }}>
              <I size={19} /> {t}
              {id === "pagos" && vencidas.length + pendientes.length > 0 && <span className="ml-auto rounded-full px-2 text-[0.8rem] text-white" style={{ background: ROJO }}>{vencidas.length + pendientes.length}</span>}
            </button>
          ))}
        </nav>
        <p className="hidden px-4 pt-6 text-[0.9rem] text-white/50 md:block">{DIAS[new Date().getDay()]} {fechaCorta(enDias(0))}<br /><button type="button" onClick={gym.reiniciar} className="mt-2 underline">Reiniciar el ejemplo</button></p>
      </aside>

      <main className="min-w-0 px-[clamp(1rem,3vw,3rem)] py-6">
        {sec === "resumen" && (
          <div className="grid gap-5">
            <div>
              <h1 className="gym-titulo text-[clamp(2.6rem,2rem+2vw,4rem)]">Resumen de {MESES[new Date().getMonth()]}</h1>
              <p className="text-[1.05rem] opacity-65">Estado del gimnasio al día de hoy. Lo que llega de la página y de la app del socio se refleja aquí.</p>
            </div>

            <section className="grid gap-5 rounded-xl p-5 sm:p-7 lg:grid-cols-[1.5fr_1fr]" style={{ background: AMARILLO, color: NEGRO }}>
              <div>
                <p className="text-[1.1rem] font-semibold opacity-80">Ingresos confirmados del mes</p>
                <p className="gym-titulo mt-1 text-[clamp(3.4rem,2.6rem+3vw,5.6rem)] leading-none">{qz(cobradoMes)}</p>
                <div className="mt-3 h-3.5 overflow-hidden rounded-full bg-black/20"><div className="h-full rounded-full bg-black" style={{ width: `${Math.min(100, (cobradoMes / aj.meta) * 100)}%` }} /></div>
                <p className="mt-2 text-[1.1rem] font-semibold">{cobradoMes >= aj.meta ? "Meta cumplida" : `Faltan ${qz(aj.meta - cobradoMes)} para la meta de ${qz(aj.meta)} (${Math.round((cobradoMes / aj.meta) * 100)}%)`}</p>
                <button type="button" onClick={() => setSec("ajustes")} className="mt-1 text-[1rem] font-semibold underline">Cambiar la meta</button>
              </div>
              <dl className="grid grid-cols-2 gap-3 self-center">
                <div className="rounded-lg bg-black/10 p-4"><dt className="text-[1rem] opacity-80">Cobrado hoy</dt><dd className="gym-titulo mt-1 text-[2.4rem] leading-none">{qz(cobradoHoy)}</dd></div>
                <div className="rounded-lg bg-black/10 p-4"><dt className="text-[1rem] opacity-80">Por confirmar</dt><dd className="gym-titulo mt-1 text-[2.4rem] leading-none">{qz(porConfirmar)}</dd></div>
              </dl>
            </section>

            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))" }}>
              {kpi("Socios activos", String(activos), `de ${gym.socios.length} en total`, false, () => setSec("socios"))}
              {kpi("Altas del mes", String(altas), "inscritos desde la página", false, () => setSec("socios"))}
              {kpi("Entradas hoy", String(gym.entradas.length), "lecturas de la talanquera", false, () => setSec("acceso"))}
              {kpi("Por cobrar", qz(porCobrar), `${vencidas.length} membresías vencidas`, vencidas.length > 0, () => setSec("pagos"))}
              {kpi("Riesgo de abandono", String(riesgo.length), `${aj.riesgoDias} días o más sin asistir`, riesgo.length > 0, () => { setFiltro("riesgo"); setSec("socios"); })}
            </div>

            <div className="grid gap-5 lg:grid-cols-12">
              <Tarjeta className="lg:col-span-7" titulo="Gente en el gimnasio ahora" nota="Estimado por sede. El acceso nunca se niega por aforo: la cifra sirve para planear.">
                <ul className="grid gap-5">
                  {SEDES.map((s) => { const n = aforo(s.id, h), p = Math.min(100, Math.round((n / s.capacidad) * 100)), nv = nivel(n, s.capacidad); return (
                    <li key={s.id}><div className="flex flex-wrap items-baseline justify-between gap-2"><b className="text-[1.2rem]">{s.nombre}</b><span className="text-[1.05rem] tabular-nums">Unas {n} de {s.capacidad} personas · {nv.t}</span></div><div className="mt-2"><Barra valor={p} color={nv.c} alto={12} /></div></li>
                  ); })}
                </ul>
                <p className="mt-4 text-[1.05rem] opacity-80">Hora pico del día: <b>{pico}:00</b>. Hora con menos gente: <b>{valle}:00</b>. Conviene reforzar la atención en la hora pico.</p>
              </Tarjeta>
              <Tarjeta className="lg:col-span-5" titulo="Pendientes de hoy" nota="Lo que requiere una acción de recepción.">
                <ul className="grid gap-2.5">
                  {[
                    [pendientes.length, "transferencias por confirmar", () => setSec("pagos"), pendientes.length > 0],
                    [vencidas.length, "membresías vencidas por cobrar", () => setSec("pagos"), vencidas.length > 0],
                    [porVencer.length, `membresías vencen en ${aj.avisoDias} días o menos`, () => { setFiltro("por-vencer"); setSec("socios"); }, porVencer.length > 0],
                    [riesgo.length, "socios en riesgo de abandono", () => { setFiltro("riesgo"); setSec("socios"); }, riesgo.length > 0],
                    [llenas.length, "clases con 90% o más de ocupación", () => setSec("clases"), false],
                  ].map(([n, t, alTocar, alerta]) => (
                    <li key={t as string}><button type="button" onClick={alTocar as () => void} className="flex min-h-[3.25rem] w-full items-center gap-3 rounded-lg px-4 text-left" style={{ background: GRIS, border: `1px solid ${alerta ? ROJO : BORDE}` }}><span className="grid h-9 min-w-[2.25rem] place-items-center rounded-md px-2 text-[1.2rem] font-bold" style={{ background: alerta ? ROJO : BORDE, fontFamily: TITULO }}>{n as number}</span><span className="text-[1.05rem]">{t as string}</span></button></li>
                  ))}
                </ul>
              </Tarjeta>

              <Tarjeta className="lg:col-span-5" titulo="Ingresos por día" nota={`Días de ${MESES[new Date().getMonth()]} con pagos confirmados.`}>
                <div className="flex h-44 items-end gap-1" aria-label="Ingresos por día">
                  {porDia.map((v) => <span key={v.d} title={`Día ${v.d}: ${qz(v.t)}`} className="flex-1 rounded-sm" style={{ height: `${Math.max(3, (v.t / maxDia) * 100)}%`, background: v.d === hoy ? AMARILLO : "rgba(255,255,255,.28)" }} />)}
                </div>
                <div className="mt-1 flex justify-between text-[0.9rem] opacity-60"><span>Día 1</span><span>Día {hoy}</span></div>
              </Tarjeta>
              <Tarjeta className="lg:col-span-4" titulo="Asistencia por hora" nota="Personas promedio por hora, sede Mixco.">
                <div className="flex h-44 items-end gap-[3px]" aria-label="Asistencia por hora">
                  {AFORO_BASE.map((n, i) => <span key={i} title={`${i + 4}:00, ${n} personas`} className="flex-1 rounded-sm" style={{ height: `${(n / 55) * 100}%`, background: i + 4 === pico ? ROJO : i + 4 === h ? AMARILLO : "rgba(255,255,255,.28)" }} />)}
                </div>
                <div className="mt-1 flex justify-between text-[0.9rem] opacity-60"><span>4:00</span><span>13:00</span><span>21:00</span></div>
              </Tarjeta>
              <Tarjeta className="lg:col-span-3" titulo="Clases" nota="Ocupación de la semana.">
                <p className="gym-titulo text-[3.6rem] leading-none" style={{ color: AMARILLO }}>{ocupMedia}%</p>
                <p className="mt-1 text-[1.05rem] opacity-75">de ocupación promedio</p>
                <button type="button" onClick={() => setSec("clases")} className="mt-4 min-h-[2.75rem] text-[1.05rem] font-semibold underline">Ver clases</button>
              </Tarjeta>
            </div>
          </div>
        )}

        {sec === "acceso" && (
          <div className="grid gap-5">
            <div>
              <h1 className="gym-titulo text-[clamp(2.6rem,2rem+2vw,4rem)]">Acceso</h1>
              <p className="text-[1.05rem] opacity-65">La talanquera lee el código QR del socio. Aquí se puede buscar a mano por número o nombre.</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-12">
              <Tarjeta className="lg:col-span-7" titulo="Búsqueda manual">
                <div className="flex items-center gap-3 rounded-lg border px-4" style={{ borderColor: BORDE }}><Search size={22} className="opacity-50" /><input aria-label="Número de carnet o nombre" value={carnet} onChange={(e) => { setCarnet(e.target.value); setAdentro(null); }} placeholder="Número o nombre (por ejemplo: 102)" className="w-full bg-transparent py-4 text-[1.3rem] outline-none" style={{ fontFamily: MONO }} /></div>
                <div className="mt-4 grid gap-3">
                  {buscados.map((s) => { const f = faltan(s.vence), ok = f >= 0, p = porId(PLANES, s.plan); return (
                    <div key={s.num} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border-l-8 p-5" style={{ borderColor: ok ? VERDE : ROJO, background: ok ? "rgba(46,155,87,.16)" : "rgba(215,38,61,.18)" }}>
                      <div><p className="text-[1.35rem] font-bold">{s.nombre} <span className="font-normal opacity-55" style={{ fontFamily: MONO }}>#{s.num}</span></p><p className="text-[1.05rem]">{ok ? `${p.nombre} al día hasta el ${fechaCorta(s.vence)} · quedan ${f} días` : `Venció hace ${-f} ${-f === 1 ? "día" : "días"} · debe ${qz(p.precio)}`}</p><p className="mt-1 text-[1.1rem] font-bold" style={{ color: ok ? "#8be0a8" : "#ff9aa8" }}>{ok ? "Acceso permitido" : "Plan vencido"}</p></div>
                      {adentro === s.num ? <span className="inline-flex items-center gap-2 text-[1.1rem] font-bold" style={{ color: "#8be0a8" }}><Check size={22} /> Entrada registrada</span> : ok ? <Btn alTocar={() => { gym.entrar(s.num); setAdentro(s.num); }}>Registrar entrada</Btn> : <Btn tipo="rojo" alTocar={() => { gym.cobrar(s.num); gym.entrar(s.num); setAdentro(s.num); }}>Cobrar {qz(p.precio)} y dar acceso</Btn>}
                    </div>
                  ); })}
                  {carnet.trim() && buscados.length === 0 && <p className="text-[1.1rem] opacity-65">No hay nadie con ese número o nombre.</p>}
                </div>
              </Tarjeta>
              <Tarjeta className="lg:col-span-5" titulo="Entradas de hoy" nota={`${gym.entradas.length} lecturas registradas`}>
                <ul className="max-h-[28rem] divide-y overflow-y-auto" style={{ borderColor: BORDE }}>{gym.entradas.map((e, i) => <li key={`${e.num}-${e.hora}-${i}`} className="flex items-center justify-between gap-3 py-3 text-[1.1rem]"><span>{nombre(e.num)}</span><span className="opacity-65" style={{ fontFamily: MONO }}>{e.hora}</span></li>)}</ul>
              </Tarjeta>
            </div>
          </div>
        )}

        {sec === "socios" && (
          <div className="grid gap-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><h1 className="gym-titulo text-[clamp(2.6rem,2rem+2vw,4rem)]">Socios</h1><p className="text-[1.05rem] opacity-65">{gym.socios.length} socios registrados. Toque un socio para ver su ficha.</p></div>
              <Btn alTocar={() => setAlta(true)}><UserPlus size={19} /> Agregar socio</Btn>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="relative min-w-[14rem] flex-1 md:max-w-md"><span className="sr-only">Buscar socio</span><Search size={19} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nombre, número o teléfono" className="min-h-[3.25rem] w-full rounded-lg border bg-[#202326] pl-11 pr-3 text-[1.1rem] text-[#efeee9]" style={{ borderColor: BORDE }} /></label>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar">{([["todos", "Todos"], ["al-dia", "Al día"], ["por-vencer", "Por vencer"], ["vencidos", "Vencidos"], ["riesgo", "En riesgo"]] as const).map(([id, t]) => <button key={id} type="button" aria-pressed={filtro === id} onClick={() => setFiltro(id)} className="min-h-[2.9rem] rounded-full border px-4 text-[1rem] font-semibold" style={filtro === id ? { background: AMARILLO, color: NEGRO, borderColor: AMARILLO } : { background: "transparent", borderColor: BORDE }}>{t}</button>)}</div>
            </div>
            <Tarjeta className="overflow-x-auto !p-0">
              <table className="w-full min-w-[46rem] text-[1.05rem]">
                <thead><tr className="text-left text-[0.88rem] uppercase tracking-wide opacity-55"><th className="p-4">Socio</th><th>Plan</th><th>Vence</th><th>Estado</th><th className="pr-6 text-right">Visitas</th><th>Última visita</th><th className="p-4" /></tr></thead>
                <tbody>
                  {filas.map((s) => { const f = faltan(s.vence), e = estado(s), p = porId(PLANES, s.plan); return (
                    <tr key={s.num} className="border-t" style={{ borderColor: BORDE }}>
                      <td className="p-4"><button type="button" onClick={() => setFicha(s.num)} className="text-left"><b className="block text-[1.12rem]">{s.nombre}{s.nuevo && <span className="ml-2 rounded bg-white/15 px-1.5 py-0.5 align-middle text-[0.72rem]">NUEVO</span>}</b><span className="text-[0.92rem] opacity-60" style={{ fontFamily: MONO }}>#{s.num} · {s.tel}</span></button></td>
                      <td>{p.nombre}</td><td className="tabular-nums">{fechaCorta(s.vence)}</td>
                      <td><Insignia ok={e === "al-dia" ? "bien" : e === "por-vencer" ? "aviso" : "mal"}>{e === "al-dia" ? "Al día" : e === "por-vencer" ? (f === 0 ? "Vence hoy" : `En ${f} días`) : `Debe ${qz(p.precio)}`}</Insignia></td>
                      <td className="pr-6 text-right tabular-nums">{s.visitas.length}</td>
                      <td className="pl-5 text-[1rem]" style={{ color: riesgo.includes(s) ? "#ff9aa8" : undefined }}>{s.visitas.length ? (diasSin(s) === 0 ? "hoy" : `hace ${diasSin(s)} ${diasSin(s) === 1 ? "día" : "días"}`) : "sin visitas"}</td>
                      <td className="p-4"><div className="flex justify-end gap-2">{e !== "al-dia" && <Btn tipo="borde" alTocar={() => recordar(s)}><Bell size={16} /> Avisar</Btn>}{e === "vencidos" && <Btn alTocar={() => { gym.cobrar(s.num); setToast(`Cobro registrado a ${s.nombre.split(" ")[0]}.`); }}>Cobrar</Btn>}{riesgo.includes(s) && <Btn tipo="borde" alTocar={() => extrañar(s)}>Escribirle</Btn>}</div></td>
                    </tr>
                  ); })}
                  {filas.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-[1.1rem] opacity-60">Nadie coincide.</td></tr>}
                </tbody>
              </table>
            </Tarjeta>
          </div>
        )}

        {sec === "clases" && (
          <div className="grid gap-5">
            <div><h1 className="gym-titulo text-[clamp(2.6rem,2rem+2vw,4rem)]">Clases Spartan</h1><p className="text-[1.05rem] opacity-65">Los lugares apartados desde la página y la app del socio. Ocupación promedio de la semana: {ocupMedia}%.</p></div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Día">{[1, 2, 3, 4, 5, 6, 0].map((d) => <button key={d} type="button" aria-pressed={dia === d} onClick={() => setDia(d)} className="min-h-[3rem] flex-1 rounded-lg border px-4 text-[1.05rem] font-semibold" style={dia === d ? { background: AMARILLO, color: NEGRO, borderColor: AMARILLO } : { background: "transparent", borderColor: BORDE }}>{DIAS[d]}</button>)}</div>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 22rem), 1fr))" }}>
              {clasesDia.map((c) => { const van = c.van + (gym.reservas[c.id] ? 1 : 0), lleno = van >= c.cupo, o = ocupacion(c); return (
                <Tarjeta key={c.id}>
                  <div className="flex items-start justify-between gap-3"><div><p className="gym-titulo text-[2.2rem]">{c.nombre}</p><p className="text-[1.1rem] opacity-70">{c.hora} · con {c.coach}</p></div>{lleno ? <Insignia ok="mal">Llena</Insignia> : o >= 75 ? <Insignia ok="aviso">Casi llena</Insignia> : <Insignia ok="bien">Quedan {c.cupo - van}</Insignia>}</div>
                  <div className="mt-4"><Barra valor={o} color={lleno ? ROJO : o >= 75 ? AMARILLO : VERDE} alto={12} /></div>
                  <p className="mt-2 text-[1.05rem] opacity-70">{van} de {c.cupo} lugares apartados ({o}%)</p>
                </Tarjeta>
              ); })}
              {clasesDia.length === 0 && <p className="opacity-60">Ese día no hay clases.</p>}
            </div>
          </div>
        )}

        {sec === "pagos" && (
          <div className="grid gap-5">
            <div><h1 className="gym-titulo text-[clamp(2.6rem,2rem+2vw,4rem)]">Pagos</h1><p className="text-[1.05rem] opacity-65">Los pagos hechos desde la página y la app del socio llegan aquí, con su método.</p></div>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))" }}>
              {kpi("Cobrado hoy", qz(cobradoHoy), "pagos confirmados")}
              {kpi("Cobrado este mes", qz(cobradoMes), `${confirmados.length} pagos`)}
              {kpi("Por confirmar", qz(porConfirmar), `${pendientes.length} transferencias`, pendientes.length > 0)}
              {kpi("Por cobrar", qz(porCobrar), `${vencidas.length} membresías vencidas`, vencidas.length > 0)}
            </div>

            <Tarjeta titulo="Transferencias por confirmar" nota="El socio subió su comprobante. Al confirmar, el pago cuenta en los ingresos.">
              {pendientes.length === 0 ? <p className="rounded-lg px-4 py-6 text-center text-[1.1rem] opacity-60" style={{ background: GRIS }}>No hay transferencias pendientes.</p> : (
                <ul className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 24rem), 1fr))" }}>
                  {pendientes.map(({ x, i }) => (
                    <li key={i} className="flex flex-wrap items-center gap-3 rounded-lg p-4" style={{ background: GRIS, border: `1px solid ${AMARILLO}` }}>
                      <span className="min-w-[8rem] flex-1 leading-tight"><b className="block text-[1.15rem]">{nombre(x.num)}</b><span className="text-[1rem] opacity-70">{x.que} · día {x.dia}</span></span>
                      <b className="text-[1.4rem] tabular-nums" style={{ fontFamily: TITULO }}>{qz(x.monto)}</b>
                      <Btn alTocar={() => { gym.confirmarPago(i); setToast("Transferencia confirmada."); }}><Check size={18} /> Confirmar</Btn>
                    </li>
                  ))}
                </ul>
              )}
            </Tarjeta>

            <div className="grid gap-5 lg:grid-cols-12">
              <Tarjeta className="lg:col-span-4" titulo="Ingresos por método">
                <ul className="grid gap-4">{porMetodo.map(({ m, t }) => <li key={m}><div className="flex justify-between text-[1.05rem]"><span>{METODO[m].t}</span><b className="tabular-nums">{qz(t)}</b></div><div className="mt-1.5"><Barra valor={(t / maxMetodo) * 100} color={m === "tarjeta" ? "#5b7cff" : m === "transferencia" ? AZUL : AMARILLO} alto={12} /></div></li>)}</ul>
              </Tarjeta>
              <Tarjeta className="lg:col-span-4" titulo="Ventas por plan">
                <ul className="grid gap-4">{ventasPlan.map(({ p, t }) => <li key={p.id}><div className="flex justify-between text-[1.05rem]"><span>{p.nombre}</span><b className="tabular-nums">{qz(t)}</b></div><div className="mt-1.5"><Barra valor={(t / maxVenta) * 100} color={p.color} alto={12} /></div></li>)}</ul>
              </Tarjeta>
              <Tarjeta className="lg:col-span-4" titulo="Últimos pagos">
                <ul className="max-h-[22rem] divide-y overflow-y-auto" style={{ borderColor: BORDE }}>{[...gym.pagos].reverse().slice(0, 12).map((x, i) => <li key={i} className="flex items-center justify-between gap-3 py-3"><span className="min-w-0"><b className="block truncate text-[1.08rem]">{nombre(x.num)}</b><span className="text-[0.95rem] opacity-65">{x.que} · día {x.dia} · {METODO[norm(x.metodo)]?.t ?? "Recepción"}{x.pendiente ? " · pendiente" : ""}</span></span><b className="tabular-nums text-[1.1rem]">{qz(x.monto)}</b></li>)}</ul>
              </Tarjeta>
            </div>

            <Tarjeta titulo="Membresías vencidas: cobrar">
              <ul className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 26rem), 1fr))" }}>
                {vencidas.map((s) => { const p = porId(PLANES, s.plan); return (
                  <li key={s.num} className="flex flex-wrap items-center gap-3 rounded-lg p-4" style={{ background: GRIS, border: `1px solid ${BORDE}` }}>
                    <span className="min-w-[8rem] flex-1 leading-tight"><b className="block text-[1.12rem]">{s.nombre}</b><span className="text-[1rem]" style={{ color: "#ff9aa8" }}>hace {-faltan(s.vence)} días · {qz(p.precio)}</span></span>
                    <Btn tipo="borde" alTocar={() => recordar(s)}><Bell size={16} /> Recordar</Btn><Btn alTocar={() => { gym.cobrar(s.num); setToast(`Cobro registrado a ${s.nombre.split(" ")[0]}.`); }}>Cobrar ahora</Btn>
                  </li>
                ); })}
                {vencidas.length === 0 && <li className="py-3 opacity-60">Nadie debe.</li>}
              </ul>
            </Tarjeta>
          </div>
        )}

        {sec === "ajustes" && (
          <div className="grid gap-5">
            <div><h1 className="gym-titulo text-[clamp(2.6rem,2rem+2vw,4rem)]">Ajustes</h1><p className="text-[1.05rem] opacity-65">Cada gimnasio trabaja distinto: estos valores se pueden cambiar y el panel se adapta.</p></div>
            <div className="grid gap-5 lg:grid-cols-3">
              <Tarjeta titulo="Meta de ingresos" nota="Se muestra en el resumen del mes."><Paso valor={aj.meta} alCambiar={(n) => ponerAj({ meta: n })} min={1000} max={100000} paso={500} formato={qz} /></Tarjeta>
              <Tarjeta titulo="Aviso de vencimiento" nota="Días antes de que venza para marcar una membresía como “por vencer”."><Paso valor={aj.avisoDias} alCambiar={(n) => ponerAj({ avisoDias: n })} min={1} max={30} paso={1} formato={(n) => `${n} días`} /></Tarjeta>
              <Tarjeta titulo="Riesgo de abandono" nota="Días sin asistir para marcar a un socio en riesgo."><Paso valor={aj.riesgoDias} alCambiar={(n) => ponerAj({ riesgoDias: n })} min={2} max={30} paso={1} formato={(n) => `${n} días`} /></Tarjeta>
            </div>
            <Tarjeta titulo="Sedes y capacidad" nota="La capacidad aproximada de cada sede para calcular qué tan concurrida está.">
              <ul className="grid gap-3 sm:grid-cols-2">{SEDES.map((s) => <li key={s.id} className="rounded-lg px-4 py-3 text-[1.1rem]" style={{ background: GRIS }}><b>{s.nombre}</b><span className="block opacity-70">Capacidad aproximada: {s.capacidad} personas</span></li>)}</ul>
            </Tarjeta>
          </div>
        )}
      </main>

      {socioFicha && <Ficha socio={socioFicha} gym={gym} alCerrar={() => setFicha(null)} avisar={recordar} extrañar={extrañar} diasSin={diasSin(socioFicha)} setToast={setToast} />}
      {alta && <Alta alCerrar={() => setAlta(false)} alGuardar={(n, tel, plan, sede) => { const p = porId(PLANES, plan); gym.inscribir({ nombre: n, plan, vence: enDias(p.dias), tel, sede }, p.precio + (plan === "dia" || plan === "trimestral" || plan === "anual" ? 0 : INSCRIPCION), "recepción"); setToast(`${n.split(" ")[0]} quedó registrado como socio.`); }} />}
      {toast && <div role="status" className="fixed inset-x-0 bottom-6 z-[90] mx-auto w-fit max-w-[calc(100vw-2rem)] rounded-lg px-5 py-3 text-[1.05rem] font-semibold shadow-xl" style={{ background: TINTA, color: NEGRO }}>{toast}</div>}
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="gimnasio" que="cada recordatorio" />
    </div>
  );
}

function Ficha({ socio, gym, alCerrar, avisar, extrañar, diasSin, setToast }: { socio: Socio; gym: Gym; alCerrar: () => void; avisar: (s: Socio) => void; extrañar: (s: Socio) => void; diasSin: number; setToast: (t: string) => void }) {
  const f = faltan(socio.vence), p = porId(PLANES, socio.plan), sede = porId(SEDES, socio.sede);
  const pagos = gym.pagos.filter((x) => x.num === socio.num);
  return (
    <Ventana titulo={`Ficha de ${socio.nombre}`} alCerrar={alCerrar} fondo="#202326" color={TINTA} ancho="48rem">
      <div className="p-6 pt-8 sm:p-8">
        <p className="text-[1rem] font-bold uppercase tracking-[0.15em]" style={{ color: AMARILLO }}>Socio #{socio.num}</p>
        <h3 className="gym-titulo pr-14 text-[clamp(2.4rem,2rem+1.6vw,3.4rem)]">{socio.nombre}</h3>
        <p className="text-[1.15rem] opacity-75">{socio.tel.replace(/(\d{4})(\d{4})/, "$1 $2")} · sede {sede.nombre}</p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          {[["Plan", p.nombre], ["Vence", `${fechaCorta(socio.vence)} (${f < 0 ? `vencida hace ${-f} d` : `${f} d`})`], ["Visitas del mes", `${socio.visitas.length} · última hace ${socio.visitas.length ? diasSin : "—"} d`]].map(([a, b]) => <div key={a} className="rounded-lg p-4" style={{ background: GRIS }}><dt className="text-[0.95rem] opacity-65">{a}</dt><dd className="mt-1 text-[1.2rem] font-bold leading-tight">{b}</dd></div>)}
        </dl>
        <p className="mt-6 text-[1.1rem] font-bold">Pagos</p>
        <ul className="mt-2 grid gap-2">{pagos.length === 0 ? <li className="opacity-60">Sin pagos registrados.</li> : [...pagos].reverse().map((x, i) => <li key={i} className="flex justify-between gap-3 rounded-lg px-4 py-2.5 text-[1.05rem]" style={{ background: GRIS }}><span>{x.que} · día {x.dia} · {METODO[norm(x.metodo)]?.t ?? "Recepción"}{x.pendiente ? " (pendiente)" : ""}</span><b>{qz(x.monto)}</b></li>)}</ul>
        <div className="mt-6 flex flex-wrap gap-3">
          {f < 0 ? <Btn alTocar={() => { gym.cobrar(socio.num); setToast("Cobro registrado."); alCerrar(); }}>Cobrar {qz(p.precio)}</Btn> : <Btn alTocar={() => { gym.entrar(socio.num); setToast("Entrada registrada."); }}>Registrar entrada</Btn>}
          <Btn tipo="borde" alTocar={() => { alCerrar(); avisar(socio); }}><Bell size={17} /> Avisar por WhatsApp</Btn>
          {diasSin >= 5 && <Btn tipo="borde" alTocar={() => { alCerrar(); extrañar(socio); }}>Escribirle por inasistencia</Btn>}
        </div>
      </div>
    </Ventana>
  );
}

function Alta({ alCerrar, alGuardar }: { alCerrar: () => void; alGuardar: (nombre: string, tel: string, plan: string, sede: string) => void }) {
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [plan, setPlan] = useState("mensual");
  const [sede, setSede] = useState("mixco");
  const ok = nombre.trim().length > 2 && tel.replace(/\D/g, "").length === 8;
  const campo = "min-h-[3.25rem] w-full rounded-lg border bg-[#16181a] px-4 text-[1.1rem] outline-none focus:border-white/60";
  const chip = (on: boolean) => (on ? { background: AMARILLO, color: NEGRO, borderColor: AMARILLO } : { borderColor: BORDE });
  return (
    <Ventana titulo="Agregar socio" alCerrar={alCerrar} fondo="#202326" color={TINTA} ancho="38rem">
      <form onSubmit={(e) => { e.preventDefault(); if (ok) { alGuardar(nombre.trim(), tel.replace(/\D/g, ""), plan, sede); alCerrar(); } }} className="grid gap-4 p-6 pt-8">
        <h3 className="gym-titulo pr-14 text-[2.6rem]">Agregar socio</h3>
        <input aria-label="Nombre completo" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} className={campo} style={{ borderColor: BORDE }} />
        <input aria-label="WhatsApp" placeholder="WhatsApp (8 dígitos)" inputMode="numeric" value={tel} onChange={(e) => setTel(e.target.value.replace(/[^\d ]/g, "").slice(0, 9))} className={campo} style={{ borderColor: BORDE }} />
        <div><p className="mb-2 font-bold">Plan</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{PLANES.map((p) => <button key={p.id} type="button" onClick={() => setPlan(p.id)} className="min-h-[3.25rem] rounded-lg border px-2 text-[1rem] font-semibold leading-tight" style={chip(plan === p.id)}>{p.nombre}<span className="block text-[0.88rem] font-normal opacity-80">{qz(p.precio)}</span></button>)}</div></div>
        <div><p className="mb-2 font-bold">Sede</p><div className="grid grid-cols-2 gap-2">{SEDES.map((s) => <button key={s.id} type="button" onClick={() => setSede(s.id)} className="min-h-[3.25rem] rounded-lg border px-3 text-[1.05rem] font-semibold" style={chip(sede === s.id)}>{s.nombre}</button>)}</div></div>
        <button type="submit" disabled={!ok} className="min-h-[3.5rem] rounded-lg text-[1.15rem] font-bold disabled:opacity-40" style={{ background: AMARILLO, color: NEGRO }}>Registrar y cobrar en recepción</button>
      </form>
    </Ventana>
  );
}

