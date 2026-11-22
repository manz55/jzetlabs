/*
 * Panel de Spartan Force Gym: el panel maestro del dueño y de recepción, sobrio y claro.
 * Menú lateral negro con amarillo de disco y contenido en gris oscuro. Secciones: Resumen, Acceso, Socios, Clases, Pagos y Ajustes.
 * Controla todo: precios, reglas, socios, cobros, accesos y avisos. Lo que llega de la página y de la app del socio se refleja aquí,
 * y lo que se cambia aquí (precios, reglas, avisos) lo ven ellos.
 */
import { useEffect, useState } from "react";
import { Bell, CalendarDays, Check, CreditCard, IdCard, LayoutDashboard, Mail, MessageCircle, Settings, Smartphone, Users } from "lucide-react";
import { MensajeWhatsApp } from "../comun";
import { AFORO_BASE, AMARILLO, CLASES, DIAS, INSCRIPCION, PLANES, ROJO, SEDES, aforo, enDias, faltan, fechaCorta, horaAhora, nivel, porId, qz, useAjustes, usePrecios, vanEn, type Gym, type Socio } from "./datos";
import { BORDE, Barra, Btn, CUERPO, Cuadro, ESTILOS_PANEL, GRIS, MESES, NEGRO, Tarjeta, TINTA, TITULO, derivar, h1, type Sec } from "./panelPiezas";
import PanelAcceso from "./PanelAcceso";
import PanelAjustes from "./PanelAjustes";
import PanelClases from "./PanelClases";
import PanelPagos from "./PanelPagos";
import PanelSocios, { Alta, Ficha, type Filtro } from "./PanelSocios";

const SECCIONES = [
  { id: "resumen", t: "Resumen", I: LayoutDashboard },
  { id: "acceso", t: "Acceso", I: IdCard },
  { id: "socios", t: "Socios", I: Users },
  { id: "clases", t: "Clases", I: CalendarDays },
  { id: "pagos", t: "Pagos", I: CreditCard },
  { id: "ajustes", t: "Ajustes", I: Settings },
] as const;

export default function PanelGimnasio({ gym }: { gym: Gym }) {
  usePrecios();
  const [aj] = useAjustes();
  const [sec, setSec] = useState<Sec>("resumen");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [ficha, setFicha] = useState<number | null>(null);
  const [alta, setAlta] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 3500); return () => clearTimeout(t); }, [toast]);

  const d = derivar(gym, aj);
  const h = horaAhora();
  const hoyFecha = new Date();
  hoyFecha.setHours(0, 0, 0, 0);
  const ocupacion = (c: (typeof CLASES)[number]) => Math.min(100, Math.round((vanEn(c, hoyFecha, !!gym.reservas[c.id]) / c.cupo) * 100));
  const ocupMedia = Math.round(CLASES.reduce((t, c) => t + ocupacion(c), 0) / CLASES.length);
  const llenas = CLASES.filter((c) => ocupacion(c) >= 90);
  const pico = AFORO_BASE.indexOf(Math.max(...AFORO_BASE)) + 4;
  const valle = AFORO_BASE.slice(2, 16).indexOf(Math.min(...AFORO_BASE.slice(2, 16))) + 6;
  const porDia = Array.from({ length: d.hoy }, (_, i) => ({ n: i + 1, t: d.confirmados.filter((x) => x.dia === i + 1).reduce((t, x) => t + x.monto, 0) }));
  const maxDia = Math.max(1, ...porDia.map((v) => v.t));
  const canales = [aj.canales.whatsapp && "WhatsApp", aj.canales.correo && "correo", aj.canales.app && "notificación en la app"].filter(Boolean) as string[];
  const lista = (l: string[]) => (l.length > 1 ? `${l.slice(0, -1).join(", ")} y ${l[l.length - 1]}` : l[0] ?? "ningún canal");
  const socioFicha = gym.socios.find((s) => s.num === ficha);

  const textoVence = (s: Socio) => {
    const f = faltan(s.vence), p = porId(PLANES, s.plan), n = s.nombre.split(" ")[0];
    return `Hola, ${n}. Le saluda Spartan Force Gym. ${f < 0 ? `Su plan ${p.nombre.toLowerCase()} venció el ${fechaCorta(s.vence)}` : f === 0 ? `Su plan ${p.nombre.toLowerCase()} vence hoy` : `Su plan ${p.nombre.toLowerCase()} vence el ${fechaCorta(s.vence)}`}. Puede renovarlo en recepción o desde la app (${qz(p.precio)}).`;
  };
  const textoRiesgo = (s: Socio) => `Hola, ${s.nombre.split(" ")[0]}. Le saluda Spartan Force Gym. Hace ${d.diasSin(s)} días no registramos su asistencia. Las clases de esta semana tienen lugares disponibles: puede apartar el suyo desde la app.`;
  const avisar = (s: Socio) => { gym.avisar([s.num], faltan(s.vence) < 0 ? "vencida" : "vence", ["WhatsApp"], textoVence); setMsg(textoVence(s)); };
  const extrañar = (s: Socio) => { gym.avisar([s.num], "riesgo", ["WhatsApp"], textoRiesgo); setMsg(textoRiesgo(s)); };
  const masivo = (l: Socio[], tipo: "vence" | "vencida") => {
    if (!canales.length) { setToast("No hay canales activos. Actívelos en Ajustes."); return; }
    gym.avisar(l.map((s) => s.num), tipo, canales, textoVence);
    setToast(`Se enviaron ${l.length} avisos por ${lista(canales)}.`);
  };
  const sinAviso = (l: Socio[]) => l.filter((s) => !d.avisadoHoy(s.num));

  const kpi = (t: string, v: string, n: string, alerta = false, alTocar?: () => void) => (
    <button type="button" onClick={alTocar} disabled={!alTocar} className="pg-btn rounded-xl border bg-[#202326] p-5 text-left disabled:cursor-default" style={{ borderColor: alerta ? ROJO : BORDE }}>
      <p className="text-[1rem] opacity-70">{t}</p>
      <p className="mt-1 text-[clamp(2rem,1.7rem+1vw,2.7rem)] font-bold leading-none tabular-nums" style={{ color: alerta ? "#ff9aa8" : TINTA, fontFamily: TITULO }}>{v}</p>
      <p className="mt-2 text-[0.95rem] opacity-65">{n}</p>
    </button>
  );
  const ir = (s: Sec, f?: Filtro) => () => { if (f) setFiltro(f); setSec(s); };

  const aRevisar = [...d.vencidas, ...d.porVencer];
  const nVence = sinAviso(d.porVencer).length, nVencida = sinAviso(d.vencidas).length;

  return (
    <div className="panel-demo min-h-[calc(100vh-8rem)] md:grid md:grid-cols-[15rem_minmax(0,1fr)]" style={{ background: GRIS, color: TINTA, fontFamily: CUERPO }}>
      <style>{ESTILOS_PANEL}</style>
      <aside className="md:sticky md:top-0 md:h-screen md:self-start" style={{ background: NEGRO, color: "#fff" }}>
        <div className="flex items-center gap-3 px-4 py-4">
          <span className="grid h-10 w-10 place-items-center rounded-lg text-[1.25rem] font-black" style={{ background: AMARILLO, color: NEGRO, fontFamily: TITULO }}>S</span>
          <span className="leading-tight"><span className="block text-[1.25rem] font-extrabold uppercase tracking-wide" style={{ fontFamily: TITULO }}>Spartan Force</span><span className="text-[0.82rem] text-white/60">Panel del gimnasio</span></span>
        </div>
        <nav aria-label="Panel" className="flex gap-1 overflow-x-auto px-2 pb-2 md:block md:space-y-1 md:px-3">
          {SECCIONES.map(({ id, t, I }) => (
            <button key={id} type="button" onClick={() => setSec(id)} aria-current={sec === id ? "page" : undefined} className="flex min-h-[2.9rem] shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-[1.02rem] font-semibold transition-colors hover:bg-white/10 md:w-full" style={sec === id ? { background: AMARILLO, color: NEGRO } : { color: "rgba(255,255,255,.78)" }}>
              <I size={19} /> {t}
              {id === "pagos" && d.vencidas.length + d.pendientes.length > 0 && <span className="ml-auto rounded-full px-2 text-[0.8rem] text-white" style={{ background: ROJO }}>{d.vencidas.length + d.pendientes.length}</span>}
            </button>
          ))}
        </nav>
        <p className="hidden px-4 pt-6 text-[0.9rem] text-white/50 md:block">{DIAS[new Date().getDay()]} {fechaCorta(enDias(0))}<br /><button type="button" onClick={gym.reiniciar} className="mt-2 underline">Reiniciar el ejemplo</button></p>
      </aside>

      <main className="min-w-0 px-[clamp(1rem,3vw,3rem)] py-6">
        {sec === "resumen" && (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
            <div>
              <h1 className={h1}>Resumen de {MESES[new Date().getMonth()]}</h1>
              <p className="text-[1.05rem] opacity-65">Estado del gimnasio al día de hoy. Lo que llega de la página y de la app del socio se refleja aquí.</p>
            </div>

            <section className="grid gap-5 rounded-xl p-5 sm:p-7 lg:grid-cols-[1.5fr_1fr]" style={{ background: AMARILLO, color: NEGRO }}>
              <div>
                <p className="text-[1.1rem] font-semibold opacity-80">Ingresos confirmados del mes</p>
                <p className="gym-titulo mt-1 text-[clamp(3.4rem,2.6rem+3vw,5.6rem)] leading-none">{qz(d.cobradoMes)}</p>
                <div className="mt-3 h-3.5 overflow-hidden rounded-full bg-black/20"><div className="h-full rounded-full bg-black" style={{ width: `${Math.min(100, (d.cobradoMes / aj.meta) * 100)}%` }} /></div>
                <p className="mt-2 text-[1.1rem] font-semibold">{d.cobradoMes >= aj.meta ? "Meta cumplida" : `Faltan ${qz(aj.meta - d.cobradoMes)} para la meta de ${qz(aj.meta)} (${Math.round((d.cobradoMes / aj.meta) * 100)}%)`}</p>
                <button type="button" onClick={() => setSec("ajustes")} className="mt-1 min-h-[2.75rem] text-[1rem] font-semibold underline">Cambiar la meta</button>
              </div>
              <dl className="grid grid-cols-2 gap-3 self-center">
                <div className="rounded-lg bg-black/10 p-4"><dt className="text-[1rem] opacity-80">Cobrado hoy</dt><dd className="gym-titulo mt-1 text-[2.4rem] leading-none">{qz(d.cobradoHoy)}</dd></div>
                <div className="rounded-lg bg-black/10 p-4"><dt className="text-[1rem] opacity-80">Por confirmar</dt><dd className="gym-titulo mt-1 text-[2.4rem] leading-none">{qz(d.porConfirmar)}</dd></div>
              </dl>
            </section>

            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))" }}>
              {kpi("Socios activos", String(d.activos), `de ${gym.socios.length} en total`, false, ir("socios"))}
              {kpi("Por vencer", String(d.porVencer.length), `en ${aj.avisoDias} días o menos`, d.porVencer.length > 0, ir("socios", "por-vencer"))}
              {kpi("Por cobrar", qz(d.porCobrar), `${d.vencidas.length} membresías vencidas`, d.vencidas.length > 0, ir("pagos"))}
              {kpi("Entradas hoy", String(gym.entradas.filter((e) => e.ok !== false).length), `${gym.entradas.filter((e) => e.ok === false).length} bloqueadas por membresía`, false, ir("acceso"))}
              {kpi("Riesgo de abandono", String(d.riesgo.length), `${aj.riesgoDias} días o más sin asistir`, d.riesgo.length > 0, ir("socios", "riesgo"))}
            </div>

            <div className="grid gap-5 lg:grid-cols-12">
              <Tarjeta className="lg:col-span-7" titulo="Membresías por vencer y vencidas" nota="Quién necesita un aviso. Se envía a su teléfono, correo y a la app del socio.">
                {aRevisar.length === 0 ? <p className="rounded-lg px-4 py-6 text-center text-[1.1rem] opacity-60" style={{ background: GRIS }}>Todas las membresías están al día.</p> : (
                  <ul className="grid gap-2">
                    {aRevisar.slice(0, 7).map((s) => (
                      <li key={s.num} className="flex flex-wrap items-center gap-3 rounded-lg px-4 py-2.5" style={{ background: GRIS }}>
                        <span className="min-w-[9rem] flex-1 leading-tight"><b className="block text-[1.08rem]">{s.nombre}</b><span className="text-[0.92rem] opacity-65">{porId(PLANES, s.plan).nombre} · {faltan(s.vence) < 0 ? `venció hace ${-faltan(s.vence)} d` : faltan(s.vence) === 0 ? "vence hoy" : `faltan ${faltan(s.vence)} d`}</span></span>
                        <Cuadro socio={s} avisoDias={aj.avisoDias} />
                        {d.avisadoHoy(s.num) ? <span className="inline-flex w-[6.5rem] items-center gap-1.5 text-[0.95rem] font-semibold opacity-70"><Check size={16} /> Avisado</span> : <Btn tipo="borde" className="w-[6.5rem]" alTocar={() => avisar(s)}><Bell size={15} /> Avisar</Btn>}
                      </li>
                    ))}
                  </ul>
                )}
                {aRevisar.length > 7 && <button type="button" onClick={ir("pagos")} className="mt-3 min-h-[2.75rem] text-[1rem] font-semibold underline">Ver las {aRevisar.length} membresías</button>}
                <div className="mt-5 rounded-lg border p-4" style={{ borderColor: BORDE }}>
                  <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[1rem]"><span className="font-semibold">Se envía por:</span>
                    {([[aj.canales.whatsapp, MessageCircle, "WhatsApp"], [aj.canales.correo, Mail, "Correo"], [aj.canales.app, Smartphone, "App del socio"]] as const).map(([on, I, t]) => <span key={t} className="inline-flex items-center gap-1.5" style={{ opacity: on ? 1 : 0.4, textDecoration: on ? undefined : "line-through" }}><I size={17} /> {t}</span>)}
                    <button type="button" onClick={() => setSec("ajustes")} className="ml-auto min-h-[2.75rem] text-[0.98rem] underline">Cambiar</button></p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <Btn deshabilitado={nVence === 0} alTocar={() => masivo(sinAviso(d.porVencer), "vence")}><Bell size={17} /> Avisar a los {nVence} por vencer</Btn>
                    <Btn tipo="borde" deshabilitado={nVencida === 0} alTocar={() => masivo(sinAviso(d.vencidas), "vencida")}>Avisar a los {nVencida} vencidos</Btn>
                  </div>
                  {aj.auto && <p className="mt-3 text-[0.95rem] opacity-65">Envío automático activo: el sistema avisa {aj.avisoDias} días antes de cada vencimiento.</p>}
                </div>
              </Tarjeta>

              <div className="grid content-start gap-5 lg:col-span-5">
                <Tarjeta titulo="Pendientes de hoy" nota="Lo que requiere una acción de recepción.">
                  <ul className="grid gap-2.5">
                    {([
                      [d.pendientes.length, "transferencias por confirmar", ir("pagos"), d.pendientes.length > 0],
                      [d.vencidas.length, "membresías vencidas por cobrar", ir("pagos"), d.vencidas.length > 0],
                      [d.riesgo.length, "socios en riesgo de abandono", ir("socios", "riesgo"), d.riesgo.length > 0],
                      [llenas.length, "clases con 90% o más de ocupación", ir("clases"), false],
                    ] as const).map(([n, t, alTocar, alerta]) => (
                      <li key={t}><button type="button" onClick={alTocar} className="pg-btn flex min-h-[3.25rem] w-full items-center gap-3 rounded-lg px-4 text-left" style={{ background: GRIS, border: `1px solid ${alerta ? ROJO : BORDE}` }}><span className="grid h-9 min-w-[2.25rem] place-items-center rounded-md px-2 text-[1.2rem] font-bold" style={{ background: alerta ? ROJO : BORDE, fontFamily: TITULO }}>{n}</span><span className="text-[1.05rem]">{t}</span></button></li>
                    ))}
                  </ul>
                </Tarjeta>
                <Tarjeta titulo="Gente en el gimnasio ahora" nota="Estimado por sede. El acceso nunca se niega por aforo.">
                  <ul className="grid gap-4">
                    {SEDES.map((s) => { const n = aforo(s.id, h), p = Math.min(100, Math.round((n / s.capacidad) * 100)), nv = nivel(n, s.capacidad); return (
                      <li key={s.id}><div className="flex flex-wrap items-baseline justify-between gap-2"><b className="text-[1.1rem]">{s.nombre}</b><span className="text-[1rem] tabular-nums">{n === 0 && (h < 4 || h >= 22) ? "Cerrado ahora" : `Unas ${n} de ${s.capacidad} · ${nv.t}`}</span></div><div className="mt-2"><Barra valor={p} color={nv.c} alto={12} /></div></li>
                    ); })}
                  </ul>
                  <p className="mt-3 text-[1rem] opacity-80">Hora pico: <b>{pico}:00</b>. Hora con menos gente: <b>{valle}:00</b>.</p>
                </Tarjeta>
              </div>

              <Tarjeta className="lg:col-span-5" titulo="Ingresos por día" nota={`Días de ${MESES[new Date().getMonth()]} con pagos confirmados.`}>
                <div className="flex h-44 items-end gap-1" aria-label="Ingresos por día">
                  {porDia.map((v) => <span key={v.n} title={`Día ${v.n}: ${qz(v.t)}`} className="flex-1 rounded-sm" style={{ height: `${Math.max(3, (v.t / maxDia) * 100)}%`, background: v.n === d.hoy ? AMARILLO : "rgba(255,255,255,.28)" }} />)}
                </div>
                <div className="mt-1 flex justify-between text-[0.9rem] opacity-60"><span>Día 1</span><span>Día {d.hoy}</span></div>
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
                <button type="button" onClick={() => setSec("clases")} className="mt-4 min-h-[2.75rem] text-[1.05rem] font-semibold underline">Ver el calendario</button>
              </Tarjeta>
            </div>
          </div>
        )}

        {sec === "acceso" && <PanelAcceso gym={gym} aj={aj} d={d} setToast={setToast} />}
        {sec === "socios" && <PanelSocios gym={gym} aj={aj} d={d} filtro={filtro} setFiltro={setFiltro} q={q} setQ={setQ} avisar={avisar} extrañar={extrañar} abrirFicha={setFicha} abrirAlta={() => setAlta(true)} setToast={setToast} />}
        {sec === "clases" && <PanelClases gym={gym} />}
        {sec === "pagos" && <PanelPagos gym={gym} aj={aj} d={d} avisar={avisar} setToast={setToast} />}
        {sec === "ajustes" && <PanelAjustes gym={gym} setSec={setSec} />}
      </main>

      {socioFicha && <Ficha key={socioFicha.num} socio={socioFicha} gym={gym} aj={aj} alCerrar={() => setFicha(null)} avisar={avisar} extrañar={extrañar} diasSin={d.diasSin(socioFicha)} setToast={setToast} />}
      {alta && <Alta alCerrar={() => setAlta(false)} alGuardar={(n, tel, plan, sede) => { const p = porId(PLANES, plan); gym.inscribir({ nombre: n, plan, vence: enDias(p.dias), tel, sede }, p.precio + (plan === "dia" || plan === "trimestral" || plan === "anual" ? 0 : INSCRIPCION), "recepción"); setToast(`${n.split(" ")[0]} quedó registrado como socio.`); }} />}
      {toast && <div role="status" className="fixed inset-x-0 bottom-6 z-[90] mx-auto w-fit max-w-[calc(100vw-2rem)] rounded-lg px-5 py-3 text-[1.05rem] font-semibold shadow-xl" style={{ background: TINTA, color: NEGRO }}>{toast}</div>}
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="gimnasio" que="cada recordatorio" />
    </div>
  );
}
