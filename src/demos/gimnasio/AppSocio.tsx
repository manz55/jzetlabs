/*
 * La app del socio de Spartan Force: lo primero que ve es su constancia (racha, entrenos, peso y rutina del día),
 * luego las clases explicadas, su progreso con estimaciones y sugerencias, su plan con el código para invitar amigos
 * y su cuenta completa (datos, experiencia, historial, documentos, apariencia y versión).
 * Todo lo que cambia el socio queda guardado. Tiene tema oscuro y claro.
 */
import { useEffect, useState, type ReactNode } from "react";
import { Bell, Calendar, Check, ChevronRight, CreditCard, Dumbbell, FileText, Flame, Gift, Info, MessageCircle, Minus, Moon, Plus, Scale, Share2, Snowflake, Sun, Target, TrendingUp, User } from "lucide-react";
import { Rev, Ventana } from "../perfil/Ventana";
import { AFORO_BASE, AMARILLO, AZUL, CLASES, CLASE_INFO, DIAS, GOMA, INSCRIPCION, PIZARRA, PLANES, ROJO, SEDES, VERDE, VERSION, aforo, dpiDe, enDias, faltan, fechaCorta, horaAhora, matriculaDe, nivel, porId, qz, useAjustes, usePrecios, type Clase, type Gym, type Socio } from "./datos";
import { Carnet, Mastercard, Visa, btn } from "./piezas";

/* colores del tema: oscuro o claro */
const BORDE = "color-mix(in srgb, var(--sf-tx) 14%, transparent)";
const FD = "var(--sf-fd)";
const TJ = "var(--sf-tj)";
const TZ = "var(--sf-tz)";
const TZT = "var(--sf-tzt)";
const ACE = "var(--sf-ace)";
const INK = GOMA;
const TEMAS = {
  oscuro: { fondo: "transparent", fd: "#16181a", tj: "#202326", tz: "#efeee9", tzt: "#16181a", ace: "#f2c230", tx: "#efeee9" },
  claro: { fondo: "#e8e5dd", fd: "#f2f0ea", tj: "#ffffff", tz: "#16181a", tzt: "#efeee9", ace: "#8a6200", tx: "#16181a" },
};
const ESTILOS_APP = `
.sf-m{color:color-mix(in srgb,var(--sf-tx) 70%,transparent)}
.sf-mm{color:color-mix(in srgb,var(--sf-tx) 52%,transparent)}
.sf-hover{transition:background-color .15s ease}
.sf-hover:hover{background:color-mix(in srgb,var(--sf-tx) 8%,var(--sf-fd))}
`;

type Tab = "inicio" | "clases" | "progreso" | "pagos" | "cuenta";
const TABS: [Tab, string, typeof Bell][] = [["inicio", "Inicio", Dumbbell], ["clases", "Clases", Calendar], ["progreso", "Progreso", TrendingUp], ["pagos", "Plan e invitados", CreditCard], ["cuenta", "Mi cuenta", User]];

/* lo que el socio guarda de sí mismo, aparte para cada socio */
type Medida = { fecha: string; peso: number; cintura: number };
type Invitado = { nombre: string; estado: "Inscrito" | "Pendiente"; fecha: string };
type Tema = "oscuro" | "claro" | "auto";
type Mio = { metaSemana: number; metaPeso: number; medidas: Medida[]; marcas: Record<string, number>; rutina: Record<string, string[]>; whatsapp: boolean; recordatorio: boolean; tema: Tema; nivel: string; objetivo: string; invitados: Invitado[] };
const base = (): Mio => ({
  metaSemana: 3, metaPeso: 70, rutina: {}, whatsapp: true, recordatorio: true, tema: "oscuro", nivel: "Intermedio", objetivo: "Mejor salud",
  medidas: [{ fecha: enDias(-60), peso: 78, cintura: 88 }, { fecha: enDias(-30), peso: 75.5, cintura: 85 }, { fecha: enDias(-3), peso: 73.2, cintura: 82 }],
  marcas: { Sentadilla: 70, "Press de banca": 45, "Peso muerto": 90 },
  invitados: [{ nombre: "Carlos Ruiz", estado: "Inscrito", fecha: enDias(-12) }, { nombre: "Ana Lucía Pérez", estado: "Pendiente", fecha: enDias(-2) }],
});
function useMio(num: number) {
  const clave = `gimnasio:socio:${num}`;
  const [m, setM] = useState<Mio>(() => { try { const t = localStorage.getItem(clave); return t ? { ...base(), ...JSON.parse(t) } : base(); } catch { return base(); } });
  useEffect(() => { try { const t = localStorage.getItem(clave); setM(t ? { ...base(), ...JSON.parse(t) } : base()); } catch { setM(base()); } }, [clave]);
  const poner = (c: Partial<Mio>) => setM((v) => { const n = { ...v, ...c }; try { localStorage.setItem(clave, JSON.stringify(n)); } catch { /* nada */ } return n; });
  return [m, poner] as const;
}

function Caja({ titulo, nota, derecha, className = "", children }: { titulo: string; nota?: string; derecha?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={`min-w-0 rounded-xl p-5 sm:p-6 ${className}`} style={{ background: TJ, border: `1px solid ${BORDE}` }}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div><h2 className="gym-titulo text-[clamp(1.9rem,1.6rem+0.8vw,2.4rem)]">{titulo}</h2>{nota && <p className="sf-m mt-1 text-[1.02rem]">{nota}</p>}</div>
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
/* opciones pegadas en una sola barra; la elegida va en amarillo */
function Opc<T extends string>({ valor, alCambiar, opciones, etiqueta }: { valor: T; alCambiar: (v: T) => void; opciones: readonly (readonly [T, string])[]; etiqueta: string }) {
  return (
    <div role="group" aria-label={etiqueta} className="inline-flex max-w-full overflow-x-auto rounded-md border [scrollbar-width:none]" style={{ borderColor: BORDE, background: FD }}>
      {opciones.map(([id, t], i) => <button key={id} type="button" aria-pressed={valor === id} onClick={() => alCambiar(id)} className="sf-hover min-h-[3rem] shrink-0 whitespace-nowrap px-5 text-[1.05rem] font-semibold" style={{ borderLeft: i ? `1px solid ${BORDE}` : undefined, ...(valor === id ? { background: AMARILLO, color: INK } : {}) }}>{t}</button>)}
    </div>
  );
}
function Interruptor({ activo, alCambiar, children }: { activo: boolean; alCambiar: () => void; children: ReactNode }) {
  return (
    <button type="button" role="switch" aria-checked={activo} onClick={alCambiar} className="sf-hover flex min-h-[3.5rem] w-full items-center justify-between gap-4 rounded-lg px-4 py-3 text-left text-[1.1rem]" style={{ background: FD }}>
      <span>{children}</span>
      <span className="relative h-8 w-14 shrink-0 rounded-full transition" style={{ background: activo ? VERDE : "color-mix(in srgb, var(--sf-tx) 25%, transparent)" }}><span className="absolute top-1 h-6 w-6 rounded-full bg-white transition-all" style={{ left: activo ? "1.9rem" : "0.25rem" }} /></span>
    </button>
  );
}
const campo = "min-h-[3.25rem] w-full rounded-md border px-4 text-[1.1rem] outline-none focus:border-[color:var(--sf-ace)]";
const campoEst = { borderColor: BORDE, background: FD };

/* la próxima fecha en que cae una clase (día de la semana), para mostrar el día real */
const proxima = (dia: number) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + ((dia - d.getDay() + 7) % 7)); return d; };
const fechaClase = (dia: number) => { const d = proxima(dia); const hoy = new Date().getDay() === dia; return hoy ? "Hoy" : `${DIAS[dia]} ${d.getDate()}`; };
const MES_LARGO = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const aDate = (f: string) => new Date(f + "T00:00");
const sumarDias = (n: number) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + Math.round(n)); return d; };
const fechaDe = (d: Date) => `${d.getDate()} ${MES_LARGO[d.getMonth()].slice(0, 3)}`;

export default function AppSocio({ gym, num, setNum }: { gym: Gym; num: number; setNum: (n: number) => void }) {
  usePrecios();
  const [aj] = useAjustes();
  const socio = gym.socios.find((x) => x.num === num) ?? gym.socios[0];
  const [tab, setTab] = useState<Tab>("inicio");
  const [mio, ponerMio] = useMio(socio.num);
  const [pagar, setPagar] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");
  const [dia, setDia] = useState(new Date().getDay());
  const [clase, setClase] = useState<Clase | null>(null);
  const [doc, setDoc] = useState<"privacidad" | "terminos" | "reglas" | null>(null);
  const [auto, setAuto] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-color-scheme: light)").matches);
  useEffect(() => { const m = window.matchMedia?.("(prefers-color-scheme: light)"); if (!m) return; const f = () => setAuto(m.matches); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  const claro = mio.tema === "claro" || (mio.tema === "auto" && auto);
  const t = claro ? TEMAS.claro : TEMAS.oscuro;

  const p = porId(PLANES, socio.plan);
  const f = faltan(socio.vence);
  const hoy = new Date();
  const sede = porId(SEDES, socio.sede);
  const mias = CLASES.filter((c) => gym.reservas[c.id]);
  const piz = PIZARRA[hoy.getDay()];
  const hechos = mio.rutina[enDias(0)] ?? [];
  const color = f < 0 ? ROJO : f <= 5 ? AMARILLO : VERDE;
  const avisos = gym.avisos.filter((a) => a.num === socio.num).slice(-3).reverse();
  useEffect(() => { if (!aviso) return; const x = setTimeout(() => setAviso(""), 3200); return () => clearTimeout(x); }, [aviso]);

  const diasMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
  const primero = new Date(hoy.getFullYear(), hoy.getMonth(), 1).getDay();
  const semana = socio.visitas.filter((d) => d > hoy.getDate() - 7).length;
  let racha = 0;
  for (let d = hoy.getDate(); d >= 1 && socio.visitas.includes(d); d--) racha++;
  let mejorRacha = 0, corrida = 0;
  for (let d = 1; d <= hoy.getDate(); d++) { corrida = socio.visitas.includes(d) ? corrida + 1 : 0; mejorRacha = Math.max(mejorRacha, corrida); }
  const lunes = new Date(hoy); lunes.setHours(0, 0, 0, 0); lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
  const semanaDias = Array.from({ length: 7 }, (_, i) => { const x = new Date(lunes); x.setDate(lunes.getDate() + i); return { x, fue: x.getMonth() === hoy.getMonth() && socio.visitas.includes(x.getDate()), futuro: x > hoy, hoy: x.toDateString() === hoy.toDateString() }; });
  const recientes = [...socio.visitas].sort((a, b) => b - a).slice(0, 5);
  const proyMes = Math.round((socio.visitas.length / Math.max(1, hoy.getDate())) * diasMes);

  const h = horaAhora() >= 4 && horaAhora() < 22 ? horaAhora() : 18;
  const ahora = aforo(socio.sede, h);
  const nv = nivel(ahora, sede.capacidad);
  const mejor = Array.from({ length: 16 }, (_, i) => i + 6).map((x) => ({ x, n: aforo(socio.sede, x) })).sort((a, b) => a.n - b.n)[0];
  const ms = mio.medidas;
  const primera = ms[0], ult = ms[ms.length - 1];
  const marcar = (x: string) => ponerMio({ rutina: { ...mio.rutina, [enDias(0)]: hechos.includes(x) ? hechos.filter((y) => y !== x) : [...hechos, x] } });
  const proximaClase = [...mias].sort((a, b) => ((a.dia - hoy.getDay() + 7) % 7) - ((b.dia - hoy.getDay() + 7) % 7))[0];

  /* estimaciones del progreso */
  const semanas = Math.max(1, (aDate(ult.fecha).getTime() - aDate(primera.fecha).getTime()) / (7 * 86400000));
  const ritmo = Math.round(((ult.peso - primera.peso) / semanas) * 100) / 100;
  const falta = Math.round((ult.peso - mio.metaPeso) * 10) / 10;
  const llegaSem = Math.abs(falta) < 0.05 ? 0 : ritmo !== 0 && Math.sign(ritmo) === -Math.sign(falta) ? Math.abs(falta / ritmo) : null;
  const fechaMeta = llegaSem !== null ? sumarDias(llegaSem * 7) : null;
  const dCin = Math.round((ult.cintura - primera.cintura) * 10) / 10;
  const sinPesar = Math.round((hoy.getTime() - aDate(ult.fecha).getTime()) / 86400000);
  const proy = llegaSem === null || llegaSem === 0 ? [] : [2, 4].map((w) => { const y = Math.round((ult.peso + ritmo * w) * 10) / 10; return { x: fechaDe(sumarDias(w * 7)), y: falta > 0 ? Math.max(y, mio.metaPeso) : Math.min(y, mio.metaPeso) }; });
  const sugerencias: [typeof Target, string, string][] = [];
  sugerencias.push(semana < mio.metaSemana ? [Target, "Meta de la semana", `Lleva ${semana} de ${mio.metaSemana} entrenos. La hora con menos gente hoy es ${mejor.x}:00 (unas ${mejor.n} personas).`] : [Target, "Meta de la semana cumplida", `Completó ${semana} entrenos. Si se siente bien, puede subir la meta a ${mio.metaSemana + 1} por semana.`]);
  if (Math.abs(ritmo) > 1) sugerencias.push([Scale, "Ritmo de peso", `El peso cambia ${Math.abs(ritmo)} kg por semana. Un ritmo de 0.5 a 1 kg suele mantenerse mejor y cuidar el músculo.`]);
  else if (llegaSem === null && Math.abs(falta) >= 0.05) sugerencias.push([Scale, "Ritmo de peso", `Con el ritmo actual no se acerca al objetivo de ${mio.metaPeso} kg. Revise la rutina con un coach o ajuste el objetivo.`]);
  else if (fechaMeta && llegaSem) sugerencias.push([Scale, "Ritmo de peso", `Va bien: al ritmo actual (${ritmo > 0 ? "+" : ""}${ritmo} kg por semana) llegará a ${mio.metaPeso} kg cerca del ${fechaDe(fechaMeta)}.`]);
  if (sinPesar > 14) sugerencias.push([Info, "Registro de peso", `Hace ${sinPesar} días que no registra su peso. Pesarse una vez por semana, a la misma hora, mejora las estimaciones.`]);
  const [mN, mV] = Object.entries(mio.marcas)[0] ?? ["Sentadilla", 0];
  sugerencias.push([Dumbbell, `Marca de ${mN.toLowerCase()}`, `Su marca es ${mV} kg. Un objetivo realista es ${Math.ceil((mV * 1.05) / 2.5) * 2.5} kg en 4 semanas, sumando peso solo si la técnica sale limpia.`]);
  if (mias.length === 0) sugerencias.push([Calendar, "Clases", "Todavía no tiene clases apartadas. Con un coach y un grupo es más fácil mantener la constancia."]);
  if (f >= 0 && f <= 7) sugerencias.push([CreditCard, "Membresía", `Su membresía vence en ${f === 0 ? "menos de un día" : `${f} ${f === 1 ? "día" : "días"}`}. Renueve para no perder la racha de ${racha} ${racha === 1 ? "día" : "días"}.`]);

  const invitados = mio.invitados;
  const inscritos = invitados.filter((i) => i.estado === "Inscrito").length;
  const codigo = `SPARTAN-${socio.num}`;
  const duracion = (d: number) => 45 + ((d * 7 + socio.num) % 40);
  const nombreDia = (d: number) => { const x = new Date(hoy.getFullYear(), hoy.getMonth(), d); return `${DIAS[x.getDay()].slice(0, 3)} ${d}`; };

  return (
    <div className="gy-app" style={{ background: t.fondo, color: t.tx, ["--sf-fd" as string]: t.fd, ["--sf-tj" as string]: t.tj, ["--sf-tz" as string]: t.tz, ["--sf-tzt" as string]: t.tzt, ["--sf-ace" as string]: t.ace, ["--sf-tx" as string]: t.tx }}>
      <style>{ESTILOS_APP}</style>
      <div className="gy-cont pb-20 pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <label className="sf-m flex flex-wrap items-center gap-2 text-[1rem]">Ver como:
              <select value={socio.num} onChange={(e) => setNum(Number(e.target.value))} className="min-h-[2.75rem] rounded-md border bg-transparent px-3" style={{ borderColor: BORDE, color: t.tx }}>
                {gym.socios.map((s) => <option key={s.num} value={s.num} className="text-black">{s.nombre} ({porId(PLANES, s.plan).nombre.toLowerCase()})</option>)}
              </select>
            </label>
            <h1 className="gym-titulo gy-h2 mt-3">Hola, {socio.nombre.split(" ")[0]}</h1>
          </div>
          <span className="rounded-md px-4 py-2 text-[1.1rem] font-bold" style={{ background: color, color: color === AMARILLO ? INK : "#fff" }}>{f < 0 ? `Membresía vencida hace ${-f} ${-f === 1 ? "día" : "días"}` : f === 0 ? "Membresía vence hoy" : `Membresía vigente · ${f} días`}</span>
        </div>

        <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" aria-label="Partes de la app">
          {TABS.map(([id, tt, I]) => <button key={id} type="button" aria-current={tab === id ? "page" : undefined} onClick={() => setTab(id)} className="gy-btn inline-flex min-h-[3.25rem] shrink-0 items-center gap-2 rounded-md px-5 text-[1.1rem] font-bold" style={tab === id ? { background: AMARILLO, color: INK } : { background: TJ, border: `1px solid ${BORDE}` }}><I size={20} /> {tt}</button>)}
        </nav>

        {f <= 5 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl p-4" style={{ background: f < 0 ? "rgba(215,38,61,.2)" : "rgba(242,194,48,.22)", border: `1.5px solid ${color}` }}>
            <p className="flex items-center gap-3 text-[1.15rem] font-semibold"><Bell size={24} style={{ color: f < 0 ? ROJO : ACE }} /> {f < 0 ? "La membresía está vencida. Renueve para volver a entrar por la talanquera." : `La membresía vence el ${fechaCorta(socio.vence)}. Renueve para no perder el acceso.`}</p>
            <button type="button" onClick={() => setPagar(socio.plan)} className={`${btn} gy-btn !py-3`} style={{ background: AMARILLO, color: INK }}>Renovar {qz(p.precio)}</button>
          </div>
        )}

        {tab === "inicio" && (
          <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-12">
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-5 lg:col-span-5">
              <Carnet socio={socio} />
              <p className="sf-m -mt-2 text-[1.02rem]">Este código se lee en la talanquera de {sede.nombre}, igual que su huella.</p>
              <Caja titulo="Tu membresía" nota={`Plan ${p.nombre.toLowerCase()} · vence el ${fechaCorta(socio.vence)}`}>
                <div className="flex items-center gap-5">
                  <svg viewBox="0 0 44 44" width="104" height="104" className="shrink-0 -rotate-90" aria-hidden><circle cx="22" cy="22" r="18" fill="none" stroke="color-mix(in srgb, var(--sf-tx) 14%, transparent)" strokeWidth="5" /><circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="5" strokeDasharray={`${Math.max(0, Math.min(1, f / p.dias)) * 113} 113`} strokeLinecap="round" /></svg>
                  <div><p className="gym-titulo text-[3.4rem]">{f < 0 ? "0" : f}</p><p className="sf-m text-[1.1rem]">{f < 0 ? "días, membresía vencida" : f === 1 ? "día restante" : "días restantes"}</p></div>
                </div>
                <button type="button" onClick={() => setPagar(socio.plan)} className={`${btn} gy-btn mt-5 w-full !py-3.5 text-[1.15rem]`} style={{ background: AMARILLO, color: INK }}>Renovar {qz(p.precio)}</button>
              </Caja>
              <Caja titulo="Entrenamientos" nota="Sus últimas visitas al gimnasio.">
                {recientes.length === 0 ? <p className="sf-m rounded-lg px-4 py-6 text-center text-[1.05rem]" style={{ background: FD }}>Aún no hay entrenos este mes.</p> : (
                  <ul className="grid gap-2">{recientes.map((d) => <li key={d} className="flex items-center justify-between gap-3 rounded-lg px-4 py-3" style={{ background: FD }}><span className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-md" style={{ background: VERDE, color: "#fff" }}><Check size={19} strokeWidth={3} /></span><b className="text-[1.08rem] capitalize">{nombreDia(d)}</b></span><span className="sf-m text-[1rem]">{duracion(d)} min · {sede.nombre}</span></li>)}</ul>
                )}
                </Caja>
              {avisos.length > 0 && (
                <Caja titulo="Mensajes del gimnasio" nota="Avisos que le envió recepción.">
                  <ul className="grid gap-2.5">{avisos.map((a, i) => <li key={i} className="rounded-lg p-3.5" style={{ background: FD }}><p className="text-[1.02rem]">{a.texto}</p><p className="sf-mm mt-1.5 text-[0.9rem]">Hoy {a.hora} · por {a.canales.join(", ")}</p></li>)}</ul>
                </Caja>
              )}
            </div>

            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-5 lg:col-span-7">
              <Caja titulo="Tu asistencia" nota="Cada vez que su huella o código pasa por la talanquera se marca el día.">
                <div className="gy-auto" style={{ ["--min" as string]: "11rem" }}>
                  <div className="flex items-center gap-3 rounded-xl p-4" style={{ background: AMARILLO, color: INK }}><Flame size={34} /><span className="leading-none"><b className="gym-titulo block text-[3.4rem]">{racha}</b><span className="text-[1rem] font-semibold">{racha === 1 ? "día seguido" : "días seguidos"}</span></span></div>
                  {[[Dumbbell, String(socio.visitas.length), "entrenos este mes", `mejor racha: ${mejorRacha}`], [Target, `${semana} de ${mio.metaSemana}`, "esta semana", semana >= mio.metaSemana ? "meta cumplida" : `faltan ${mio.metaSemana - semana}`], [TrendingUp, String(proyMes), "entrenos al cierre del mes", "al ritmo actual"]].map(([I, n, tt, s]) => { const Icono = I as typeof Dumbbell; return (
                    <div key={tt as string} className="flex items-center gap-3 rounded-xl p-4" style={{ background: FD }}><Icono size={26} style={{ color: ACE }} /><span className="leading-tight"><b className="gym-titulo block text-[2.3rem]">{n as string}</b><span className="sf-m block text-[0.98rem]">{tt as string}</span><span className="sf-mm text-[0.88rem]">{s as string}</span></span></div>
                  ); })}
                </div>
                <p className="mt-5 text-[1.08rem] font-bold">Esta semana</p>
                <div className="mt-2 grid grid-cols-7 gap-2 text-center">
                  {semanaDias.map((x, i) => <div key={i} className="grid gap-1.5"><span className="sf-m text-[0.9rem]">{["L", "M", "M", "J", "V", "S", "D"][i]}</span><span className="grid h-12 place-items-center rounded-md text-[1.05rem] font-bold" style={{ background: x.fue ? VERDE : FD, color: x.fue ? "#fff" : undefined, opacity: x.futuro ? 0.45 : 1, outline: x.hoy ? `2px solid ${AMARILLO}` : undefined }}>{x.fue ? <Check size={22} strokeWidth={3} /> : x.x.getDate()}</span></div>)}
                </div>
                <p className="mt-5 text-[1.08rem] font-bold capitalize">{MES_LARGO[hoy.getMonth()]}</p>
                <div className="mt-2 grid grid-cols-7 gap-1.5 text-center text-[0.85rem]">
                  {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => <span key={i} className="sf-mm">{d}</span>)}
                  {Array.from({ length: primero }, (_, i) => <span key={`v${i}`} />)}
                  {Array.from({ length: diasMes }, (_, i) => { const d = i + 1; const fue = socio.visitas.includes(d); const futuro = d > hoy.getDate(); return <span key={d} className="grid h-9 place-items-center rounded-md text-[0.95rem] font-semibold" style={{ background: fue ? VERDE : "transparent", border: fue ? "none" : `1px solid ${futuro ? "transparent" : BORDE}`, color: fue ? "#fff" : futuro ? undefined : undefined, opacity: futuro ? 0.4 : 1, outline: d === hoy.getDate() ? `2px solid ${AMARILLO}` : undefined }}>{d}</span>; })}
                </div>
              </Caja>

              <div>
                <Caja titulo="Tus pesajes" nota={`Último registro: ${fechaCorta(ult.fecha)}`} derecha={<button type="button" onClick={() => setTab("progreso")} className="inline-flex min-h-[2.75rem] items-center gap-1 text-[1.02rem] font-bold" style={{ color: ACE }}>Ver progreso <ChevronRight size={18} /></button>}>
                  <div className="flex flex-wrap items-end gap-x-5 gap-y-1"><p className="gym-titulo text-[3.4rem] leading-none">{ult.peso}<span className="text-[1.4rem]"> kg</span></p><p className="pb-1 text-[1.1rem] font-bold" style={{ color: ult.peso <= primera.peso ? VERDE : ACE }}>{ult.peso - primera.peso > 0 ? "+" : ""}{Math.round((ult.peso - primera.peso) * 10) / 10} kg desde {fechaCorta(primera.fecha)}</p></div>
                  <RegistroRapido ultima={ult} alGuardar={(m) => { ponerMio({ medidas: [...mio.medidas, m] }); setAviso("Peso registrado."); }} />
                </Caja>
              </div>

              <Caja titulo={`Rutina de hoy: ${piz.titulo}`} nota={`${hechos.length} de ${piz.lista.length} ejercicios completados`} derecha={<button type="button" onClick={() => ponerMio({ rutina: { ...mio.rutina, [enDias(0)]: hechos.length === piz.lista.length ? [] : piz.lista } })} className="gy-btn min-h-[2.75rem] rounded-md border px-4 text-[1rem] font-semibold" style={{ borderColor: BORDE }}>{hechos.length === piz.lista.length ? "Desmarcar todo" : "Marcar todo"}</button>}>
                <div className="mb-4 h-2.5 overflow-hidden rounded-full" style={{ background: FD }}><div className="h-full rounded-full" style={{ width: `${(hechos.length / piz.lista.length) * 100}%`, background: VERDE }} /></div>
                <ul className="grid gap-2.5">
                  {piz.lista.map((x) => { const si = hechos.includes(x); return (
                    <li key={x}><button type="button" aria-pressed={si} onClick={() => marcar(x)} className="sf-hover flex min-h-[3.5rem] w-full items-center gap-3.5 rounded-lg px-4 text-left text-[1.2rem]" style={{ background: FD, border: `1px solid ${si ? VERDE : BORDE}` }}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border-2 text-white" style={{ borderColor: si ? VERDE : "color-mix(in srgb, var(--sf-tx) 40%, transparent)", background: si ? VERDE : "transparent" }}>{si && <Check size={20} strokeWidth={3} />}</span><span className={si ? "line-through opacity-60" : ""}>{x}</span></button></li>
                  ); })}
                </ul>
              </Caja>

              <Caja titulo="Próxima clase" derecha={<button type="button" onClick={() => setTab("clases")} className="inline-flex min-h-[2.75rem] items-center gap-1 text-[1.05rem] font-bold" style={{ color: ACE }}>Ver clases <ChevronRight size={18} /></button>}>
                {!proximaClase ? <p className="sf-m rounded-lg px-4 py-5 text-center text-[1.08rem]" style={{ background: FD }}>No hay clases apartadas. Entre a Clases para reservar un lugar.</p> : (
                  <div className="flex items-center gap-4 rounded-lg p-3" style={{ background: FD }}><img src={proximaClase.foto} alt="" className="h-16 w-16 shrink-0 rounded-md object-cover" /><span className="min-w-0 flex-1 leading-tight"><b className="block text-[1.2rem]">{proximaClase.nombre}</b><span className="sf-m text-[1rem]">{fechaClase(proximaClase.dia)} · {proximaClase.hora} · con {proximaClase.coach}</span></span><button type="button" onClick={() => gym.reservar(proximaClase.id)} className="gy-btn min-h-[2.75rem] rounded-md border px-4 text-[1rem] font-semibold" style={{ borderColor: BORDE }}>Cancelar</button></div>
                )}
              </Caja>
            </div>
          </div>
        )}

        {tab === "clases" && (
          <div className="mt-6 grid gap-5">
            <Caja titulo="Para qué sirven las clases" nota="Una clase es una sesión guiada por un coach, con un grupo y a una hora fija.">
              <div className="gy-auto" style={{ ["--min" as string]: "16rem" }}>
                {[["Un coach te guía", "Te corrige la técnica y adapta cada ejercicio a tu nivel. Ideal si no sabes qué rutina hacer."], ["Entrenas en grupo", "La música y el grupo te empujan. Es más fácil dar el último esfuerzo y no faltar."], ["Horario fijo", "Apartas tu lugar y te comprometes. Quien reserva clase entrena más seguido."]].map(([a, b]) => <div key={a} className="rounded-lg p-4" style={{ background: FD }}><b className="gym-titulo block text-[1.7rem]">{a}</b><p className="sf-m mt-1 text-[1.02rem]">{b}</p></div>)}
              </div>
              <ul className="sf-m mt-4 grid gap-1.5 text-[1.02rem] sm:grid-cols-2">
                {["Las clases están incluidas desde el plan mensual.", "Aparta tu lugar desde la app; los cupos son limitados.", "Puedes cancelar hasta 2 horas antes sin perder tu lugar en otras clases.", "Llega 10 minutos antes: después se libera el lugar."].map((x) => <li key={x} className="flex gap-2"><Check size={19} className="mt-0.5 shrink-0" style={{ color: VERDE }} /> {x}</li>)}
              </ul>
            </Caja>

            <Caja titulo="Tipos de clase" nota="Qué es cada una, para qué sirve y qué llevar.">
              <div className="gy-auto" style={{ ["--min" as string]: "21rem" }}>
                {Object.entries(CLASE_INFO).map(([n, i], k) => { const foto = CLASES.find((c) => c.nombre === n)?.foto; return (
                  <Rev key={n} i={k} className="h-full"><div className="gy-card flex h-full flex-col overflow-hidden rounded-xl" style={{ background: FD, border: `1px solid ${BORDE}` }}>
                    {foto && <img src={foto} alt="" className="gy-img h-32 w-full object-cover" />}
                    <div className="flex flex-1 flex-col p-4">
                      <b className="gym-titulo text-[2rem]">{n}</b>
                      <p className="sf-m mt-1 text-[1.02rem]">{i.para}</p>
                      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[0.95rem]">{[["Dura", i.dura], ["Nivel", i.nivel], ["Gasto", `${i.kcal} kcal`], ["Trabaja", i.trabaja]].map(([a, b]) => <div key={a}><dt className="sf-mm">{a}</dt><dd className="font-semibold leading-tight">{b}</dd></div>)}</dl>
                      <p className="sf-m mt-3 text-[0.95rem]"><b>Llevar:</b> {i.llevar}.</p>
                    </div>
                  </div></Rev>
                ); })}
              </div>
            </Caja>

            <div className="grid gap-5 lg:grid-cols-2">
              <Caja titulo={`Cuándo ir a ${sede.nombre}`} nota={`Estimado ahora: ${nv.t.toLowerCase()}, unas ${ahora} personas. Capacidad aproximada ${sede.capacidad}.`} derecha={<span className="rounded px-3 py-1.5 text-[1rem] font-bold" style={{ background: nv.c, color: nv.c === AMARILLO ? INK : "#fff" }}>{nv.t}</span>}>
                <div className="flex h-24 items-end gap-[3px]" aria-label="Gente por hora hoy">
                  {AFORO_BASE.map((_, i) => { const n = aforo(socio.sede, i + 4); return <span key={i} title={`${i + 4}:00, ${n} personas`} className="flex-1 rounded-sm" style={{ height: `${Math.max(8, (n / sede.capacidad) * 100)}%`, background: i + 4 === h ? AMARILLO : "color-mix(in srgb, var(--sf-tx) 28%, transparent)" }} />; })}
                </div>
                <div className="sf-mm mt-1 flex justify-between text-[0.9rem]"><span>4:00</span><span>13:00</span><span>21:00</span></div>
                <p className="mt-3 text-[1.08rem]">Hora con menos gente hoy: <b style={{ color: ACE }}>{mejor.x}:00</b> (unas {mejor.n} personas).</p>
              </Caja>
              <Caja titulo="Mis reservas" nota={mias.length ? `${mias.length} ${mias.length === 1 ? "clase apartada" : "clases apartadas"}` : "Aún no hay clases apartadas."}>
                {mias.length === 0 ? <p className="sf-m rounded-lg px-4 py-5 text-center text-[1.05rem]" style={{ background: FD }}>Aparte una clase de la lista de abajo.</p> : <ul className="grid gap-2.5">{mias.map((c) => <li key={c.id} className="flex items-center gap-3 rounded-lg p-3" style={{ background: FD }}><img src={c.foto} alt="" className="h-14 w-14 rounded-md object-cover" /><span className="min-w-0 flex-1 leading-tight"><b className="block">{c.nombre}</b><span className="sf-m text-[0.98rem]">{fechaClase(c.dia)} · {c.hora}</span></span><button type="button" onClick={() => gym.reservar(c.id)} className="gy-btn min-h-[2.75rem] rounded-md border px-3 text-[0.98rem] font-semibold" style={{ borderColor: BORDE }}>Cancelar</button></li>)}</ul>}
              </Caja>
            </div>

            <div>
              <h2 className="gym-titulo text-[clamp(1.9rem,1.6rem+0.8vw,2.4rem)]">Reservar un lugar</h2>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Día">
                {[1, 2, 3, 4, 5, 6, 0].map((d) => <button key={d} type="button" aria-pressed={dia === d} onClick={() => setDia(d)} className="gy-btn min-h-[3.25rem] flex-1 rounded-md px-4 text-[1.1rem] font-bold" style={dia === d ? { background: TZ, color: TZT } : { background: TJ, border: `1px solid ${BORDE}` }}>{d === hoy.getDay() ? "Hoy" : DIAS[d]}</button>)}
              </div>
              <div className="gy-auto mt-4" style={{ ["--min" as string]: "25rem" }}>
                {CLASES.filter((c) => c.dia === dia).map((c, i) => {
                  const mia = !!gym.reservas[c.id]; const van = c.van + (mia ? 1 : 0); const lleno = van >= c.cupo && !mia;
                  return (
                    <Rev key={c.id} i={i} className="h-full"><div className="gy-card flex h-full overflow-hidden rounded-xl" style={{ background: TJ, border: `1px solid ${BORDE}` }}>
                      <img src={c.foto} alt="" className="gy-img w-[34%] shrink-0 object-cover" />
                      <div className="flex min-w-0 flex-1 flex-col p-4">
                        <span className="text-[1.15rem] font-bold" style={{ color: ACE }}>{fechaClase(c.dia)} · {c.hora}</span>
                        <span className="gym-titulo text-[2.1rem]">{c.nombre}</span>
                        <span className="sf-m text-[1.02rem]">con {c.coach} · quedan {Math.max(0, c.cupo - van)} de {c.cupo}</span>
                        <p className="sf-mm mt-1 text-[0.95rem] leading-snug">{CLASE_INFO[c.nombre]?.para}</p>
                        <div className="mt-3 flex flex-wrap gap-2" style={{ marginTop: "auto", paddingTop: 12 }}>
                          <button type="button" disabled={lleno} onClick={() => gym.reservar(c.id)} className="gy-btn min-h-[3rem] flex-1 rounded-md px-3 text-[1.02rem] font-bold disabled:opacity-40" style={mia ? { background: VERDE, color: "#fff" } : { background: TZ, color: TZT }}>{mia ? "Apartada · cancelar" : lleno ? "Clase llena" : "Apartar lugar"}</button>
                          <button type="button" onClick={() => setClase(c)} className="gy-btn min-h-[3rem] rounded-md border px-3 text-[1.02rem] font-semibold" style={{ borderColor: BORDE }}>Detalles</button>
                        </div>
                      </div>
                    </div></Rev>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "progreso" && (
          <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-12">
            <section className="rounded-xl p-5 sm:p-7 lg:col-span-12" style={{ background: AMARILLO, color: INK }}>
              <p className="text-[1.05rem] font-bold uppercase tracking-[0.12em] opacity-80">Estimación</p>
              <p className="gym-titulo mt-1 text-[clamp(2.2rem,1.6rem+2vw,3.6rem)] leading-[1.02]">{Math.abs(falta) < 0.05 ? `Objetivo de ${mio.metaPeso} kg alcanzado` : fechaMeta && llegaSem ? `Llegará a ${mio.metaPeso} kg cerca del ${fechaDe(fechaMeta)}` : `Con el ritmo actual no se acerca a ${mio.metaPeso} kg`}</p>
              <dl className="mt-4 grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 11rem), 1fr))" }}>
                {[["Ritmo de peso", `${ritmo > 0 ? "+" : ""}${ritmo} kg por semana`], ["Falta para el objetivo", Math.abs(falta) < 0.05 ? "Nada" : `${Math.abs(falta)} kg ${falta > 0 ? "por bajar" : "por subir"}`], ["Cintura", `${dCin > 0 ? "+" : ""}${dCin} cm en ${Math.round(semanas)} semanas`], ["Entrenos al cierre del mes", `${proyMes} al ritmo actual`]].map(([a, b]) => <div key={a} className="rounded-lg bg-black/10 p-4"><dt className="text-[0.98rem] font-semibold opacity-80">{a}</dt><dd className="mt-1 text-[1.3rem] font-extrabold leading-tight">{b}</dd></div>)}
              </dl>
            </section>

            <Caja className="lg:col-span-7" titulo="Peso y cintura" nota={`Último registro: ${ult.peso} kg · ${ult.cintura} cm${proy.length ? ". La línea punteada es la proyección." : ""}`}>
              <Grafica puntos={mio.medidas.map((m) => ({ x: fechaCorta(m.fecha), y: m.peso }))} proy={proy} meta={mio.metaPeso} />
              <RegistroMedida alGuardar={(m) => { ponerMio({ medidas: [...mio.medidas, m] }); setAviso("Medida registrada."); }} ultima={ult} />
              <ul className="mt-5 grid gap-2">{[...mio.medidas].reverse().slice(0, 4).map((m, i) => <li key={i} className="flex justify-between rounded-lg px-4 py-2.5 text-[1.05rem]" style={{ background: FD }}><span>{fechaCorta(m.fecha)}</span><b>{m.peso} kg · {m.cintura} cm</b></li>)}</ul>
            </Caja>
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-5 lg:col-span-5">
              <Caja titulo="Sugerencias para ti" nota="Según su asistencia, peso y marcas.">
                <ul className="grid gap-2.5">{sugerencias.slice(0, 5).map(([I, a, b]) => <li key={a} className="flex gap-3 rounded-lg p-3.5" style={{ background: FD }}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-md" style={{ background: AMARILLO, color: INK }}><I size={21} /></span><span className="leading-snug"><b className="block text-[1.08rem]">{a}</b><span className="sf-m text-[1rem]">{b}</span></span></li>)}</ul>
              </Caja>
              <Caja titulo="Metas" nota="Se pueden cambiar cuando se necesite.">
                <div className="grid gap-5">
                  <div><p className="text-[1.1rem] font-bold">Entrenos por semana</p><div className="mt-2"><Paso valor={mio.metaSemana} alCambiar={(n) => ponerMio({ metaSemana: n })} min={1} max={7} /></div><div className="mt-3 h-2.5 overflow-hidden rounded-full" style={{ background: FD }}><div className="h-full rounded-full" style={{ width: `${Math.min(100, (semana / mio.metaSemana) * 100)}%`, background: AMARILLO }} /></div><p className="sf-m mt-1 text-[1rem]">{semana} de {mio.metaSemana} esta semana</p></div>
                  <div><p className="text-[1.1rem] font-bold">Peso objetivo</p><div className="mt-2"><Paso valor={mio.metaPeso} alCambiar={(n) => ponerMio({ metaPeso: n })} min={30} max={200} paso={0.5} unidad=" kg" /></div></div>
                </div>
              </Caja>
            </div>
            <Caja className="lg:col-span-12" titulo="Marcas personales" nota="El peso máximo en cada ejercicio y un objetivo sugerido para dentro de 4 semanas.">
              <ul className="gy-auto" style={{ ["--min" as string]: "22rem" }}>{Object.entries(mio.marcas).map(([n, v]) => <li key={n} className="grid gap-2 rounded-lg p-4" style={{ background: FD }}><div className="flex items-center justify-between gap-3"><b className="text-[1.2rem]">{n}</b><span className="text-[0.98rem]" style={{ color: ACE }}>Objetivo: {Math.ceil((v * 1.05) / 2.5) * 2.5} kg</span></div><Paso valor={v} alCambiar={(x) => ponerMio({ marcas: { ...mio.marcas, [n]: x } })} min={0} max={500} paso={2.5} unidad=" kg" /></li>)}</ul>
            </Caja>
          </div>
        )}

        {tab === "pagos" && (
          <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-12">
            <section className="grid grid-cols-[minmax(0,1fr)] gap-6 rounded-xl p-5 sm:p-7 lg:col-span-12 lg:grid-cols-[1.2fr_1fr]" style={{ background: AMARILLO, color: INK }}>
              <div>
                <p className="flex items-center gap-2 text-[1.05rem] font-bold uppercase tracking-[0.12em]"><Gift size={22} /> Invita a un amigo</p>
                <h2 className="gym-titulo mt-1 text-[clamp(2.4rem,1.8rem+2.4vw,4rem)] leading-[1.02]">Cada amigo que se inscribe te regala una semana gratis</h2>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="rounded-xl border-4 border-dashed px-5 py-3" style={{ borderColor: INK }}><p className="text-[0.9rem] font-bold uppercase tracking-wide opacity-70">Tu código</p><p className="gym-titulo text-[clamp(2.6rem,2rem+2vw,3.8rem)] leading-none">{codigo}</p></div>
                  <div className="grid gap-2">
                    <button type="button" onClick={() => { void navigator.clipboard?.writeText(codigo).catch(() => undefined); setAviso(`Código ${codigo} copiado.`); }} className="gy-btn inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-md px-5 text-[1.08rem] font-bold" style={{ background: INK, color: "#fff" }}><Gift size={20} /> Copiar código</button>
                    <button type="button" onClick={() => setAviso("Se abrió WhatsApp con el mensaje de invitación (demo).")} className="gy-btn inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-md border-2 px-5 text-[1.08rem] font-bold" style={{ borderColor: INK }}><Share2 size={20} /> Compartir por WhatsApp</button>
                  </div>
                </div>
                <ol className="mt-5 grid gap-2 text-[1.05rem] font-semibold sm:grid-cols-3">{["Comparte tu código", "Tu amigo se inscribe con él", "Tú ganas una semana"].map((x, i) => <li key={x} className="flex items-center gap-2"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[0.95rem] text-white" style={{ background: INK }}>{i + 1}</span>{x}</li>)}</ol>
              </div>
              <div className="rounded-xl bg-black/10 p-5">
                <div className="grid grid-cols-3 gap-3 text-center">{[[String(invitados.length), "invitados"], [String(inscritos), "inscritos"], [String(inscritos), inscritos === 1 ? "semana ganada" : "semanas ganadas"]].map(([n, tt]) => <div key={tt}><p className="gym-titulo text-[2.8rem] leading-none">{n}</p><p className="text-[0.95rem] font-semibold">{tt}</p></div>)}</div>
                <ul className="mt-4 grid gap-2">{invitados.map((i) => <li key={i.nombre} className="flex items-center justify-between gap-3 rounded-lg bg-black/10 px-3.5 py-2.5 text-[1.05rem]"><b>{i.nombre}</b><span className="rounded-[4px] px-2.5 py-1 text-[0.88rem] font-bold" style={{ background: i.estado === "Inscrito" ? VERDE : INK, color: "#fff" }}>{i.estado}</span></li>)}</ul>
                <Invitar alGuardar={(nombre) => { ponerMio({ invitados: [...invitados, { nombre, estado: "Pendiente", fecha: enDias(0) }] }); setAviso(`Invitación enviada a ${nombre}.`); }} />
              </div>
            </section>

            <Caja className="lg:col-span-5" titulo="Plan actual" nota={`Plan ${p.nombre.toLowerCase()} · sede ${sede.nombre}`}>
              <p className="gym-titulo text-[3.6rem]" style={{ color: p.id === "mensual" ? ACE : p.color }}>{p.nombre}</p>
              <p className="text-[1.2rem]">{qz(p.precio)} · {p.dias} {p.dias === 1 ? "día" : "días"}</p>
              <p className="sf-m mt-1 text-[1.05rem]">Vence el {fechaCorta(socio.vence)} ({f < 0 ? "vencida" : `en ${f} días`}).</p>
              <button type="button" onClick={() => setPagar(socio.plan)} className={`${btn} gy-btn mt-5 w-full !py-3.5 text-[1.15rem]`} style={{ background: AMARILLO, color: INK }}>Renovar {qz(p.precio)}</button>
              {socio.plan === "anual" ? <button type="button" onClick={() => setAviso("Membresía congelada hasta 30 días. En su gimnasio, esto se aprueba en recepción.")} className="gy-btn mt-3 inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-md border text-[1.05rem] font-semibold" style={{ borderColor: BORDE }}><Snowflake size={19} /> Congelar membresía</button> : <p className="sf-mm mt-3 text-[0.98rem]">Congelar membresía está disponible en el plan anual.</p>}
            </Caja>
            <Caja className="lg:col-span-7" titulo="Comparar planes" nota="Costo por mes de cada plan, para elegir el que conviene.">
              <ul className="grid gap-2.5">
                {PLANES.filter((x) => x.id !== "dia").map((x) => { const mes = Math.round((x.precio / (x.dias / 30)) * 10) / 10; const ahorro = Math.round((PLANES[1].precio - mes) * (x.dias / 30)); return (
                  <li key={x.id} className="flex flex-wrap items-center gap-4 rounded-lg p-4" style={{ background: FD, border: x.id === socio.plan ? `1.5px solid ${x.color}` : `1px solid ${BORDE}` }}>
                    <span className="disco h-14 w-14 shrink-0" style={{ background: x.color }} />
                    <span className="min-w-0 flex-1 leading-tight"><b className="gym-titulo block text-[1.9rem]">{x.nombre}</b><span className="sf-m text-[1.05rem]">{qz(x.precio)} · {qz(mes)} al mes{ahorro > 0 ? ` · ahorro de ${qz(ahorro)}` : ""}</span></span>
                    {x.id === socio.plan ? <span className="rounded-md px-3 py-1.5 text-[0.95rem] font-bold" style={{ background: x.color, color: x.texto }}>Plan actual</span> : <button type="button" onClick={() => setPagar(x.id)} className="gy-btn min-h-[3rem] rounded-md px-5 text-[1.05rem] font-bold" style={{ background: x.color, color: x.texto }}>Cambiar a {x.nombre.toLowerCase()}</button>}
                  </li>
                ); })}
              </ul>
            </Caja>
            <Caja className="lg:col-span-12" titulo="Historial de pagos">
              {gym.pagos.filter((x) => x.num === socio.num).length === 0 ? <p className="sf-m rounded-lg px-4 py-6 text-center text-[1.1rem]" style={{ background: FD }}>Aún no hay pagos registrados.</p> : (
                <ul className="gy-auto" style={{ ["--min" as string]: "22rem" }}>{[...gym.pagos].filter((x) => x.num === socio.num).reverse().map((x, i) => <li key={i} className="flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-[1.1rem]" style={{ background: FD }}><span><b>{x.que}</b><span className="sf-m block text-[0.95rem]">{x.dia} de {MES_LARGO[hoy.getMonth()]} · {x.metodo ?? "recepción"}{x.pendiente ? " · por confirmar" : ""}</span></span><b>{qz(x.monto)}</b></li>)}</ul>
              )}
            </Caja>
          </div>
        )}

        {tab === "cuenta" && (
          <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-12">
            <Caja className="lg:col-span-6" titulo="Datos personales">
              <dl className="grid gap-2.5 text-[1.12rem]">
                {[["Nombre", socio.nombre], ["Matrícula", matriculaDe(socio.num)], ["DPI", dpiDe(socio.num)], ["WhatsApp", socio.tel.replace(/(\d{4})(\d{4})/, "$1 $2")], ["Correo", socio.correo ?? "—"], ["Sede", sede.nombre], ["Plan", p.nombre], ["Socio desde", socio.desde ? `${fechaCorta(socio.desde)} (${Math.max(1, Math.round((hoy.getTime() - aDate(socio.desde).getTime()) / 86400000 / 30))} meses)` : "—"]].map(([a, b]) => <div key={a} className="flex flex-wrap justify-between gap-x-3 rounded-lg px-4 py-3" style={{ background: FD }}><dt className="sf-m">{a}</dt><dd className="font-bold">{b}</dd></div>)}
              </dl>
            </Caja>
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-5 lg:col-span-6">
              <Caja titulo="Experiencia y objetivo" nota="El coach usa esto para armar su rutina de inicio.">
                <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
                  <div><p className="mb-2 text-[1.05rem] font-bold">Conocimiento del entrenamiento</p><Opc etiqueta="Nivel" valor={mio.nivel} alCambiar={(v) => ponerMio({ nivel: v })} opciones={[["Principiante", "Principiante"], ["Intermedio", "Intermedio"], ["Avanzado", "Avanzado"]]} /></div>
                  <div><p className="mb-2 text-[1.05rem] font-bold">Objetivo principal</p><Opc etiqueta="Objetivo" valor={mio.objetivo} alCambiar={(v) => ponerMio({ objetivo: v })} opciones={[["Bajar de peso", "Bajar de peso"], ["Ganar músculo", "Ganar músculo"], ["Mejor salud", "Mejor salud"]]} /></div>
                </div>
              </Caja>
              <Caja titulo="Apariencia" nota="Cómo se ve la app en este teléfono.">
                <Opc etiqueta="Tema" valor={mio.tema} alCambiar={(v) => ponerMio({ tema: v })} opciones={[["oscuro", "Oscuro"], ["claro", "Claro"], ["auto", "Automático"]]} />
                <p className="sf-m mt-3 flex items-center gap-2 text-[1rem]">{claro ? <Sun size={19} /> : <Moon size={19} />} Tema {claro ? "claro" : "oscuro"} activo{mio.tema === "auto" ? " (sigue al teléfono)" : ""}.</p>
              </Caja>
            </div>

            <Caja className="lg:col-span-6" titulo="Historial de entrenamiento" nota="Visitas por mes, contadas por la talanquera.">
              {(() => { const meses = Array.from({ length: 6 }, (_, i) => { const m = new Date(hoy.getFullYear(), hoy.getMonth() - (5 - i), 1); return { t: MES_LARGO[m.getMonth()].slice(0, 3), n: i === 5 ? socio.visitas.length : 8 + (((socio.num + i * 5) * 7) % 13) }; }); const max = Math.max(...meses.map((x) => x.n)); const total = meses.reduce((s, x) => s + x.n, 0); return (
                <>
                  <div className="flex h-36 items-end gap-3">{meses.map((x, i) => <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1.5" style={{ height: "100%" }}><b className="text-[0.95rem] tabular-nums">{x.n}</b><span className="w-full rounded-t-md" style={{ height: `${Math.max(6, (x.n / max) * 100)}%`, background: i === 5 ? AMARILLO : "color-mix(in srgb, var(--sf-tx) 28%, transparent)" }} /><span className="sf-mm text-[0.9rem] capitalize">{x.t}</span></div>)}</div>
                  <dl className="mt-4 grid grid-cols-3 gap-3 text-center">{[[String(total), "entrenos en 6 meses"], [String(mejorRacha), "mejor racha del mes"], [["Mañana", "Mediodía", "Tarde"][socio.num % 3], "horario favorito"]].map(([n, tt]) => <div key={tt} className="rounded-lg p-3" style={{ background: FD }}><dd className="gym-titulo text-[2rem] leading-none">{n}</dd><dt className="sf-m mt-1 text-[0.92rem]">{tt}</dt></div>)}</dl>
                </>
              ); })()}
            </Caja>
            <Caja className="lg:col-span-6" titulo="Invitados" nota="Amigos que invitó con su código." derecha={<button type="button" onClick={() => setTab("pagos")} className="inline-flex min-h-[2.75rem] items-center gap-1 text-[1.02rem] font-bold" style={{ color: ACE }}>Invitar más <ChevronRight size={18} /></button>}>
              <ul className="grid gap-2.5">{invitados.map((i) => <li key={i.nombre} className="flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-[1.08rem]" style={{ background: FD }}><span><b>{i.nombre}</b><span className="sf-m block text-[0.92rem]">Invitado el {fechaCorta(i.fecha)}</span></span><span className="rounded-[4px] px-2.5 py-1 text-[0.9rem] font-bold" style={{ background: i.estado === "Inscrito" ? VERDE : AMARILLO, color: i.estado === "Inscrito" ? "#fff" : INK }}>{i.estado}</span></li>)}</ul>
              <p className="sf-m mt-3 text-[1rem]">Semanas gratis ganadas: <b style={{ color: ACE }}>{inscritos}</b>.</p>
            </Caja>

            <Caja className="lg:col-span-6" titulo="Documentos">
              <ul className="grid gap-2.5">{([["privacidad", "Política de privacidad"], ["terminos", "Términos de uso"], ["reglas", "Reglas del gimnasio"]] as const).map(([id, tt]) => <li key={id}><button type="button" onClick={() => setDoc(id)} className="sf-hover flex min-h-[3.5rem] w-full items-center justify-between gap-3 rounded-lg px-4 text-left text-[1.12rem] font-semibold" style={{ background: FD }}><span className="flex items-center gap-3"><FileText size={21} style={{ color: ACE }} /> {tt}</span><ChevronRight size={20} /></button></li>)}</ul>
            </Caja>
            <Caja className="lg:col-span-6" titulo="Avisos" nota="Elija qué mensajes recibir por WhatsApp.">
              <ul className="grid gap-3">
                {([["whatsapp", "Aviso 3 días antes de que venza la membresía"], ["recordatorio", "Recordatorio una hora antes de cada clase apartada"]] as const).map(([k, tt]) => <li key={k}><Interruptor activo={mio[k]} alCambiar={() => ponerMio({ [k]: !mio[k] })}>{tt}</Interruptor></li>)}
              </ul>
            </Caja>
            <Caja className="lg:col-span-12" titulo="Versión de la app">
              <div className="flex flex-wrap items-center justify-between gap-4"><p className="text-[1.1rem]"><b>Spartan Force</b> · versión {VERSION} <span className="sf-m">(noviembre de 2026)</span></p><div className="flex flex-wrap gap-3"><button type="button" onClick={() => setAviso("Ya tiene la versión más reciente.")} className="gy-btn min-h-[3rem] rounded-md border px-5 text-[1.05rem] font-semibold" style={{ borderColor: BORDE }}>Buscar actualizaciones</button><button type="button" onClick={() => setAviso("Demo: aquí se cierra la sesión del socio.")} className="gy-btn min-h-[3rem] rounded-md border px-5 text-[1.05rem] font-semibold" style={{ borderColor: BORDE }}>Cerrar sesión</button></div></div>
            </Caja>
          </div>
        )}
      </div>

      {clase && <DetalleClase clase={clase} mia={!!gym.reservas[clase.id]} van={clase.van + (gym.reservas[clase.id] ? 1 : 0)} alCerrar={() => setClase(null)} alReservar={() => gym.reservar(clase.id)} />}
      {doc && <Documento tipo={doc} reglas={aj.reglas} alCerrar={() => setDoc(null)} />}
      {pagar && <Pagar socio={socio} planId={pagar} alCerrar={() => setPagar(null)} alPagar={(metodo) => { if (pagar !== socio.plan) gym.cambiarPlan(socio.num, pagar); gym.cobrar(socio.num, metodo); setPagar(null); setAviso(`Pago registrado (${metodo}). La membresía se actualizó.`); }} />}
      {aviso && <div role="status" className="fixed inset-x-0 bottom-6 z-[90] mx-auto w-fit max-w-[calc(100vw-2rem)] rounded-lg px-5 py-3 text-[1.05rem] font-semibold shadow-xl" style={{ background: TEMAS.oscuro.tz, color: INK }}>{aviso}</div>}
    </div>
  );
}

function Grafica({ puntos, proy, meta }: { puntos: { x: string; y: number }[]; proy: { x: string; y: number }[]; meta: number }) {
  const todos = [...puntos, ...proy];
  const ys = [...todos.map((p) => p.y), meta];
  const min = Math.min(...ys) - 2, max = Math.max(...ys) + 2;
  const X = (i: number) => 30 + (todos.length === 1 ? 280 : (i / (todos.length - 1)) * 560);
  const Y = (v: number) => 20 + ((max - v) / (max - min)) * 150;
  const n = puntos.length;
  return (
    <svg viewBox="0 0 640 210" className="w-full" role="img" aria-label="Peso en el tiempo y proyección">
      <line x1="30" x2="610" y1={Y(meta)} y2={Y(meta)} stroke={VERDE} strokeDasharray="6 5" strokeWidth="2" />
      <text x="34" y={Y(meta) + 18} fontSize="13" fontWeight="700" fill={VERDE}>objetivo {meta} kg</text>
      <polyline fill="none" stroke={AMARILLO} strokeWidth="3.5" strokeLinejoin="round" points={puntos.map((p, i) => `${X(i)},${Y(p.y)}`).join(" ")} />
      {proy.length > 0 && <polyline fill="none" stroke={AMARILLO} strokeWidth="3" strokeDasharray="3 7" strokeLinecap="round" points={[puntos[n - 1], ...proy].map((p, i) => `${X(n - 1 + i)},${Y(p.y)}`).join(" ")} />}
      {todos.map((p, i) => <g key={i}><circle cx={X(i)} cy={Y(p.y)} r="5.5" fill={i < n ? AMARILLO : "none"} stroke={AMARILLO} strokeWidth="2.5" /><text x={X(i)} y={Y(p.y) - 12} textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">{p.y}</text><text x={X(i)} y="200" textAnchor="middle" fontSize="13" fill="currentColor" opacity=".6">{p.x}</text></g>)}
    </svg>
  );
}

function RegistroRapido({ alGuardar, ultima }: { alGuardar: (m: Medida) => void; ultima: Medida }) {
  const [peso, setPeso] = useState("");
  const ok = Number(peso) > 20;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (ok) { alGuardar({ fecha: enDias(0), peso: Number(peso), cintura: ultima.cintura }); setPeso(""); } }} className="mt-4 flex gap-3">
      <input aria-label="Peso de hoy en kilos" inputMode="decimal" value={peso} onChange={(e) => setPeso(e.target.value.replace(/[^\d.]/g, ""))} placeholder="Peso de hoy (kg)" className={campo} style={campoEst} />
      <button type="submit" disabled={!ok} className="gy-btn min-h-[3.25rem] shrink-0 rounded-md px-5 text-[1.05rem] font-bold disabled:opacity-40" style={{ background: AMARILLO, color: INK }}>Registrar</button>
    </form>
  );
}

function RegistroMedida({ alGuardar, ultima }: { alGuardar: (m: Medida) => void; ultima: Medida }) {
  const [peso, setPeso] = useState("");
  const [cin, setCin] = useState("");
  const ok = Number(peso) > 20 && Number(cin) > 30;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (ok) { alGuardar({ fecha: enDias(0), peso: Number(peso), cintura: Number(cin) }); setPeso(""); setCin(""); } }} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <input aria-label="Peso en kilos" inputMode="decimal" value={peso} onChange={(e) => setPeso(e.target.value.replace(/[^\d.]/g, ""))} placeholder={`Peso (kg), último ${ultima.peso}`} className={campo} style={campoEst} />
      <input aria-label="Cintura en centímetros" inputMode="decimal" value={cin} onChange={(e) => setCin(e.target.value.replace(/[^\d.]/g, ""))} placeholder={`Cintura (cm), última ${ultima.cintura}`} className={campo} style={campoEst} />
      <button type="submit" disabled={!ok} className="gy-btn min-h-[3.25rem] rounded-md px-6 text-[1.1rem] font-bold disabled:opacity-40" style={{ background: AMARILLO, color: INK }}>Registrar</button>
    </form>
  );
}

function Invitar({ alGuardar }: { alGuardar: (nombre: string) => void }) {
  const [n, setN] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (n.trim().length > 2) { alGuardar(n.trim()); setN(""); } }} className="mt-4 flex gap-2">
      <input aria-label="Nombre del amigo" value={n} onChange={(e) => setN(e.target.value)} placeholder="Nombre de tu amigo" className="min-h-[3.25rem] min-w-0 flex-1 rounded-md border-2 bg-transparent px-3 text-[1.05rem] outline-none placeholder:text-black/55" style={{ borderColor: INK }} />
      <button type="submit" disabled={n.trim().length < 3} className="gy-btn inline-flex min-h-[3.25rem] shrink-0 items-center gap-2 rounded-md px-4 text-[1.05rem] font-bold text-white disabled:opacity-40" style={{ background: INK }}><MessageCircle size={19} /> Invitar</button>
    </form>
  );
}

function DetalleClase({ clase: c, mia, van, alCerrar, alReservar }: { clase: Clase; mia: boolean; van: number; alCerrar: () => void; alReservar: () => void }) {
  const i = CLASE_INFO[c.nombre];
  const lleno = van >= c.cupo && !mia;
  return (
    <Ventana titulo={c.nombre} alCerrar={alCerrar} fondo={TJ} color="var(--sf-tx)" ancho="44rem">
      <img src={c.foto} alt="" className="h-48 w-full object-cover sm:h-56" />
      <div className="p-6 sm:p-8">
        <p className="text-[1.05rem] font-bold" style={{ color: ACE }}>{fechaClase(c.dia)} · {c.hora} · con {c.coach}</p>
        <h3 className="gym-titulo text-[clamp(2.6rem,2rem+2vw,3.6rem)]">{c.nombre}</h3>
        <p className="sf-m mt-1 text-[1.15rem]">{i?.para}</p>
        {i && <dl className="mt-5 grid gap-3 sm:grid-cols-2">{[["Dura", i.dura], ["Nivel", i.nivel], ["Gasto aproximado", `${i.kcal} kcal`], ["Trabaja", i.trabaja], ["Qué llevar", i.llevar], ["Lugares", `quedan ${Math.max(0, c.cupo - van)} de ${c.cupo}`]].map(([a, b]) => <div key={a} className="rounded-lg p-3.5" style={{ background: FD }}><dt className="sf-mm text-[0.92rem]">{a}</dt><dd className="mt-0.5 text-[1.1rem] font-bold leading-tight">{b}</dd></div>)}</dl>}
        <button type="button" disabled={lleno} onClick={alReservar} className="gy-btn mt-6 min-h-[3.5rem] w-full rounded-md text-[1.15rem] font-bold disabled:opacity-40" style={mia ? { background: VERDE, color: "#fff" } : { background: AMARILLO, color: INK }}>{mia ? "Apartada · tocar para cancelar" : lleno ? "Clase llena" : "Apartar lugar"}</button>
      </div>
    </Ventana>
  );
}

const LEGAL = {
  privacidad: ["Política de privacidad", ["Spartan Force Gym guarda su nombre, DPI, teléfono, correo, huella y datos de entrenamiento solo para administrar su membresía y su acceso.", "Su huella se convierte en un código y no se comparte con otras empresas. Puede pedir que se elimine al darse de baja.", "Sus pagos y su asistencia solo los ve el personal autorizado del gimnasio.", "Puede pedir en recepción una copia de sus datos o su corrección en cualquier momento."]],
  terminos: ["Términos de uso", ["La membresía es personal e intransferible. El código QR y la huella no se prestan.", "El acceso se activa al confirmarse el pago y termina en la fecha de vencimiento.", "Las clases se reservan desde la app. Un lugar no cancelado a tiempo se considera usado.", "El gimnasio puede suspender el acceso si se incumplen las reglas de convivencia."]],
} as const;

function Documento({ tipo, reglas, alCerrar }: { tipo: "privacidad" | "terminos" | "reglas"; reglas: string[]; alCerrar: () => void }) {
  const titulo = tipo === "reglas" ? "Reglas del gimnasio" : LEGAL[tipo][0];
  const lista = tipo === "reglas" ? reglas : [...LEGAL[tipo][1]];
  return (
    <Ventana titulo={titulo} alCerrar={alCerrar} fondo={TJ} color="var(--sf-tx)" ancho="40rem">
      <div className="p-6 pt-8 sm:p-8">
        <h3 className="gym-titulo pr-14 text-[clamp(2.2rem,1.8rem+1.6vw,3rem)]">{titulo}</h3>
        <ol className="mt-4 grid gap-3">{lista.map((x, i) => <li key={i} className="flex gap-3 rounded-lg p-4 text-[1.1rem]" style={{ background: FD }}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-[0.95rem] font-bold" style={{ background: AMARILLO, color: INK }}>{i + 1}</span>{x}</li>)}</ol>
        <p className="sf-mm mt-4 text-[0.95rem]">{tipo === "reglas" ? "Estas reglas las define el gimnasio desde su panel de Ajustes." : "Texto de ejemplo. En su gimnasio se reemplaza por el documento legal real."}</p>
      </div>
    </Ventana>
  );
}

function Pagar({ socio, planId, alCerrar, alPagar }: { socio: Socio; planId: string; alCerrar: () => void; alPagar: (metodo: string) => void }) {
  const [metodo, setMetodo] = useState("tarjeta");
  const pl = porId(PLANES, planId);
  const nombres: Record<string, string> = { tarjeta: "tarjeta", transferencia: "transferencia", recepcion: "recepción" };
  const opciones: [string, string, string, ReactNode][] = [
    ["tarjeta", "Con tarjeta, aquí mismo", "El acceso se activa al instante", <span key="t" className="flex items-center gap-2"><Visa /><Mastercard /></span>],
    ["transferencia", "Por transferencia", "Sube el comprobante y se activa", <span key="b" className="rounded px-2 py-1 text-[0.85rem] font-bold text-white" style={{ background: AZUL }}>BANCA EN LÍNEA</span>],
    ["recepcion", "En recepción", "Se paga al llegar, en efectivo o tarjeta", <span key="r" className="rounded px-2 py-1 text-[0.85rem] font-bold" style={{ background: AMARILLO, color: INK }}>EFECTIVO</span>],
  ];
  const desde = faltan(socio.vence) > 0 ? socio.vence : enDias(0);
  return (
    <Ventana titulo={`Pagar plan ${pl.nombre}`} alCerrar={alCerrar} fondo={TJ} color="var(--sf-tx)" ancho="40rem">
      <div className="p-6 pt-8">
        <p className="text-[1rem] font-bold uppercase tracking-[0.15em]" style={{ color: pl.id === "mensual" ? ACE : pl.color }}>{planId === socio.plan ? "Renovación" : "Cambio de plan"}</p>
        <h3 className="gym-titulo mt-1 text-[3rem]">Plan {pl.nombre}</h3>
        <p className="sf-m mt-1 text-[1.15rem]">{pl.dias} {pl.dias === 1 ? "día" : "días"} desde el {fechaCorta(desde)}. Total: <b style={{ color: ACE }}>{qz(pl.precio)}</b>{planId !== socio.plan && pl.id !== "dia" ? `, sin inscripción (${qz(INSCRIPCION)})` : ""}.</p>
        <div className="mt-5 grid gap-2.5">
          {opciones.map(([id, tt, n, logo]) => (
            <button key={id} type="button" onClick={() => setMetodo(id)} aria-pressed={metodo === id} className="flex items-center justify-between gap-3 rounded-lg border-2 px-4 py-3 text-left" style={metodo === id ? { background: TZ, color: TZT, borderColor: TZ } : { borderColor: BORDE }}>
              <span><b className="block text-[1.1rem]">{tt}</b><span className="text-[0.95rem] opacity-75">{n}</span></span><span className="shrink-0">{logo}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={() => alPagar(nombres[metodo])} className="gy-btn mt-6 min-h-[3.75rem] w-full rounded-md text-[1.25rem] font-bold" style={{ background: AMARILLO, color: INK }}>{metodo === "tarjeta" ? `Pagar ${qz(pl.precio)} con tarjeta` : metodo === "transferencia" ? "Ya hice la transferencia" : "Pagaré en recepción"}</button>
        <p className="sf-mm mt-3 text-[0.95rem]">Demo: no se cobra nada. En su gimnasio se conecta a su banco o pasarela de pago.</p>
      </div>
    </Ventana>
  );
}
