/*
 * Demo: "Constructora Los Cedros" (empresa inventada, datos de ejemplo).
 * Tres partes: el marcaje en la obra (PIN + foto + ubicación), el panel de la oficina
 * (resumen, planilla, personal, prestaciones e IGSS, solicitudes) y el portal del empleado,
 * donde cada quien entra con su código y su PIN y ve solo lo suyo.
 */
import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, Calendar, Camera, Check, ChevronRight, Delete, FileText, HandCoins, Home, Inbox, LogOut, MapPin, Shield, UserRound, Users, Wallet, X } from "lucide-react";
import { BandaDemos, Cajon, CierreJzet, MensajeWhatsApp, PartesDemo } from "../comun";
import {
  AMARILLO, AZUL, BONIF_MES, BORDE, FONDO, IGSS_LAB, IGSS_PAT, NARANJA, OBRAS, PIN_EJEMPLO, ROJO, SUAVE, TEXTO, TRABAJADORES, VERDE,
  EN_MAPA, antiguedad, boletasAnteriores, diaCorto, fechaLarga, fechaLimiteIgss, hora, igssMes, iniciales, iso, jornada, mesNombre, obraDe, prestacionesDe, qz, semanaDe, usePlanilla,
  type Planilla, type Solicitud, type Tipo, type Trabajador,
} from "./datos";

const ESTILOS = `
.plan h1, .plan h2, .plan h3 { color: inherit; }
.plan .num { font-variant-numeric: tabular-nums; }
.plan .caja { background: #fff; border: 1px solid ${BORDE}; border-radius: 12px; }
.plan table th { font-weight: 600; color: ${SUAVE}; font-size: .8rem; text-align: left; padding: .6rem .75rem; border-bottom: 1px solid ${BORDE}; white-space: nowrap; }
.plan table td { padding: .65rem .75rem; border-bottom: 1px solid ${BORDE}; }
.plan table tr:last-child td { border-bottom: 0; }
`;

const fmtFecha = (d: Date) => fechaLarga(iso(d));
const faltan = (d: Date) => Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86400000));

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 40 40" aria-hidden>
        <rect width="40" height="40" rx="8" fill={AZUL} />
        <path d="M8 27h24v3H8z" fill={AMARILLO} />
        <path d="M10 27c0-6.6 4.5-11.5 10-11.5S30 20.4 30 27z" fill={AMARILLO} />
      </svg>
      <span className="font-bold leading-tight">Constructora Los Cedros</span>
    </span>
  );
}

function Avatar({ t, size = 40 }: { t: Trabajador; size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-full font-semibold" style={{ width: size, height: size, background: "#e6ebf1", color: AZUL, fontSize: size * 0.36 }}>
      {iniciales(t.nombre)}
    </span>
  );
}

function Seccion({ titulo, nota, children }: { titulo: string; nota?: string; children: ReactNode }) {
  return (
    <section className="caja">
      <div className="border-b px-4 py-3" style={{ borderColor: BORDE }}>
        <h2 className="font-bold">{titulo}</h2>
        {nota && <p className="text-[0.85rem]" style={{ color: SUAVE }}>{nota}</p>}
      </div>
      {children}
    </section>
  );
}

function Dato({ etiqueta, valor, nota, color }: { etiqueta: string; valor: string; nota?: string; color?: string }) {
  return (
    <div className="caja p-4">
      <p className="text-[0.85rem]" style={{ color: SUAVE }}>{etiqueta}</p>
      <p className="num mt-1 text-[1.5rem] font-bold leading-tight" style={{ color }}>{valor}</p>
      {nota && <p className="mt-0.5 text-[0.82rem]" style={{ color: SUAVE }}>{nota}</p>}
    </div>
  );
}

type Vista = "obra" | "oficina" | "empleado";

export default function PlanillaDemo() {
  const p = usePlanilla();
  const leer = (): Vista => (location.hash.startsWith("#oficina") ? "oficina" : location.hash === "#empleado" ? "empleado" : "obra");
  const [vista, setVista] = useState<Vista>(leer);
  useEffect(() => {
    const cambio = () => setVista(leer());
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", vista === "obra" ? location.pathname : `#${vista}`);
    document.title = vista === "oficina" ? "Oficina · Los Cedros" : vista === "empleado" ? "Mi portal · Los Cedros" : "Constructora Los Cedros · Demo de Jzet Labs";
    window.scrollTo(0, 0);
  }, [vista]);

  return (
    <div className="plan min-h-screen" style={{ background: FONDO, color: TEXTO }}>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <PartesDemo
        fondo={AZUL}
        actual={vista}
        alCambiar={setVista}
        partes={[
          { id: "obra", nombre: "Marcaje en la obra", quien: "Cada trabajador marca con PIN y foto" },
          { id: "oficina", nombre: "Panel de la oficina", quien: "Planilla, prestaciones, IGSS y solicitudes" },
          { id: "empleado", nombre: "Portal del empleado", quien: "Cada quien entra y ve solo lo suyo" },
        ] as const}
      />
      <div className="border-b bg-white" style={{ borderColor: BORDE }}>
        <p className="mx-auto max-w-6xl px-4 py-2.5 text-[0.9rem]" style={{ color: SUAVE }}>
          <b style={{ color: TEXTO }}>Esto es un ejemplo para una constructora.</b> Cada sistema se arma a la medida de su empresa: si usted necesita inventario, rutas, citas o cualquier otra cosa en vez de marcaje, se hace.
        </p>
      </div>
      {vista === "obra" && <Obra p={p} />}
      {vista === "oficina" && <Oficina p={p} />}
      {vista === "empleado" && <Portal p={p} />}
      <CierreJzet demo="planilla y control de empleados" />
    </div>
  );
}

/* ═════════════ Marcaje en la obra ═════════════ */

function Reloj() {
  const [ahora, setAhora] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-center">
      <p className="num text-[3.5rem] font-bold leading-none sm:text-[4.5rem]" style={{ color: AZUL }}>
        {ahora.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false })}
      </p>
      <p className="mt-2" style={{ color: SUAVE }}>
        {ahora.toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" })}
      </p>
    </div>
  );
}

function Obra({ p }: { p: Planilla }) {
  const [obra, setObra] = useState("torre");
  const [quien, setQuien] = useState<Trabajador | null>(null);
  const gente = TRABAJADORES.filter((t) => t.obra === obra);
  const o = obraDe(obra);

  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Logo />
        <label className="flex items-center gap-2 text-[0.9rem]" style={{ color: SUAVE }}>
          <MapPin size={16} /> Obra
          <select value={obra} onChange={(e) => setObra(e.target.value)} className="rounded-lg border bg-white px-3 py-2 font-semibold" style={{ borderColor: BORDE, color: TEXTO }}>
            {OBRAS.map((x) => (
              <option key={x.id} value={x.id}>
                {x.nombre} · {x.lugar}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="caja mt-6 px-4 py-8">
        <Reloj />
        <h1 className="mt-6 text-center text-[1.6rem] font-bold sm:text-[1.9rem]">Toque su nombre para marcar</h1>
        <p className="mt-1 text-center" style={{ color: SUAVE }}>
          Le pedirá su PIN y una foto. Queda la hora y la ubicación de {o.nombre}.
        </p>
        <ul className="mx-auto mt-6 grid max-w-3xl gap-2 sm:grid-cols-2">
          {gente.map((t) => {
            const m = p.hoyDe(t);
            const tarde = m && m.entrada > jornada(p.hoy).entra + 10;
            return (
              <li key={t.id}>
                <button type="button" onClick={() => setQuien(t)} className="flex w-full items-center gap-3 rounded-lg border bg-white p-3 text-left transition hover:border-[#9fb0c4] active:scale-[0.99]" style={{ borderColor: BORDE }}>
                  <Avatar t={t} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{t.nombre}</span>
                    <span className="block text-[0.85rem]" style={{ color: SUAVE }}>{t.puesto}</span>
                  </span>
                  <span className="num shrink-0 text-[0.85rem] font-semibold" style={{ color: !m ? SUAVE : m.salida !== null ? AZUL : tarde ? ROJO : VERDE }}>
                    {!m ? "Sin marcar" : m.salida !== null ? `Salió ${hora(m.salida)}` : `Entró ${hora(m.entrada)}`}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <Cajon abierto={quien !== null} alCerrar={() => setQuien(null)} fondo="#fff">
        {quien && <Marcar key={quien.id} t={quien} p={p} obra={o.nombre} alCerrar={() => setQuien(null)} />}
      </Cajon>
    </main>
  );
}

function Teclado({ alTocar, alBorrar }: { alTocar: (k: string) => void; alBorrar: () => void }) {
  const tecla = "num h-14 rounded-lg border text-[1.3rem] font-semibold active:bg-[#eef1f5]";
  return (
    <div className="mx-auto grid max-w-[16rem] grid-cols-3 gap-2">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((k) => (
        <button key={k} type="button" onClick={() => alTocar(k)} className={tecla} style={{ borderColor: BORDE }}>
          {k}
        </button>
      ))}
      <span />
      <button type="button" onClick={() => alTocar("0")} className={tecla} style={{ borderColor: BORDE }}>
        0
      </button>
      <button type="button" onClick={alBorrar} aria-label="Borrar" className="grid h-14 place-items-center rounded-lg">
        <Delete size={20} />
      </button>
    </div>
  );
}

function Marcar({ t, p, obra, alCerrar }: { t: Trabajador; p: Planilla; obra: string; alCerrar: () => void }) {
  const [paso, setPaso] = useState<"pin" | "foto" | "listo">("pin");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [hecho, setHecho] = useState<{ tipo: "entrada" | "salida"; min: number } | null>(null);
  const [toca] = useState(() => {
    const m = p.hoyDe(t);
    return m && m.salida === null ? "salida" : "entrada";
  });

  const tocar = (k: string) => {
    setError(false);
    const nuevo = (pin + k).slice(0, 4);
    setPin(nuevo);
    if (nuevo.length === 4) {
      if (nuevo === PIN_EJEMPLO) setTimeout(() => setPaso("foto"), 150);
      else {
        setError(true);
        setTimeout(() => setPin(""), 400);
      }
    }
  };

  return (
    <div className="flex h-full flex-col p-6" style={{ color: TEXTO }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar t={t} size={48} />
          <div>
            <p className="text-[1.1rem] font-bold">{t.nombre}</p>
            <p className="text-[0.9rem]" style={{ color: SUAVE }}>
              Marca su {toca} en {obra}
            </p>
          </div>
        </div>
        <button type="button" onClick={alCerrar} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5">
          <X size={18} />
        </button>
      </div>

      {paso === "pin" && (
        <div className="mt-8">
          <p className="font-semibold">Ponga su PIN</p>
          <p className="text-[0.85rem]" style={{ color: SUAVE }}>En la demo es {PIN_EJEMPLO}.</p>
          <div className="my-5 flex justify-center gap-3" aria-live="polite">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-3.5 w-3.5 rounded-full border-2" style={{ borderColor: error ? ROJO : AZUL, background: pin.length > i ? (error ? ROJO : AZUL) : "transparent" }} />
            ))}
          </div>
          {error && <p className="mb-3 text-center text-[0.9rem] font-semibold" style={{ color: ROJO }}>Ese PIN no es. Intente otra vez.</p>}
          <Teclado alTocar={tocar} alBorrar={() => setPin((x) => x.slice(0, -1))} />
        </div>
      )}

      {paso === "foto" && (
        <div className="mt-8">
          <p className="font-semibold">Ahora una foto</p>
          <p className="text-[0.85rem]" style={{ color: SUAVE }}>Así queda claro que de verdad es usted quien marca.</p>
          <div className="relative mx-auto mt-4 grid aspect-[3/4] w-full max-w-[14rem] place-items-center rounded-xl" style={{ background: "#dfe5ec" }}>
            <Avatar t={t} size={96} />
            <span className="absolute inset-5 rounded-[45%] border-2 border-dashed" style={{ borderColor: "#9fb0c4" }} aria-hidden />
            <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[0.75rem]">
              <MapPin size={12} /> {obra}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setHecho(p.marcar(t));
              setPaso("listo");
            }}
            className="mx-auto mt-5 flex w-full max-w-[14rem] items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white"
            style={{ background: AZUL }}
          >
            <Camera size={18} /> Tomar foto y marcar
          </button>
        </div>
      )}

      {paso === "listo" && hecho && (
        <div className="mt-10 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full text-white" style={{ background: VERDE }}>
            <Check size={28} />
          </span>
          <p className="mt-4 text-[1.5rem] font-bold">
            {hecho.tipo === "entrada" ? "Entrada" : "Salida"} registrada a las {hora(hecho.min)}
          </p>
          <p className="mt-1" style={{ color: SUAVE }}>Con foto y ubicación en {obra}. La oficina ya lo ve.</p>
          <button type="button" onClick={alCerrar} className="mt-8 w-full rounded-lg py-3 font-semibold text-white" style={{ background: AZUL }}>
            Listo
          </button>
        </div>
      )}
    </div>
  );
}

/* ═════════════ Panel de la oficina ═════════════ */

type Sec = "inicio" | "mapa" | "planilla" | "personal" | "prestaciones" | "solicitudes";

function Oficina({ p }: { p: Planilla }) {
  const [sec, setSec] = useState<Sec>("inicio");
  const [detalle, setDetalle] = useState<Trabajador | null>(null);
  const pendientes = p.solicitudes.filter((s) => s.estado === "pendiente").length;
  const menu: [Sec, string, typeof Home, number?][] = [
    ["inicio", "Resumen", Home],
    ["mapa", "Dónde está cada quien", MapPin],
    ["planilla", "Planilla de la semana", FileText],
    ["personal", "Personal", Users],
    ["prestaciones", "Prestaciones e IGSS", Shield],
    ["solicitudes", "Solicitudes", Inbox, pendientes],
  ];
  const ir = (s: Sec) => {
    setSec(s);
    window.scrollTo({ top: 0 });
  };
  const titulo = menu.find((m) => m[0] === sec)![1];

  return (
    <main className="mx-auto max-w-[90rem] pb-16 lg:px-4 lg:pt-4">
      <div className="overflow-hidden lg:grid lg:min-h-[44rem] lg:grid-cols-[15rem_1fr] lg:rounded-2xl lg:border" style={{ borderColor: BORDE }}>
        {/* barra lateral */}
        <aside className="text-white lg:flex lg:flex-col" style={{ background: "#0f2740" }}>
          <div className="flex items-center justify-between gap-3 px-4 py-4 lg:block">
            <span className="flex items-center gap-2.5">
              <svg width="30" height="30" viewBox="0 0 40 40" aria-hidden>
                <rect width="40" height="40" rx="8" fill={AMARILLO} />
                <path d="M8 27h24v3H8z" fill="#0f2740" />
                <path d="M10 27c0-6.6 4.5-11.5 10-11.5S30 20.4 30 27z" fill="#0f2740" />
              </svg>
              <span className="leading-tight">
                <span className="block font-bold">Los Cedros</span>
                <span className="block text-[0.78rem] text-white/60">Panel de la oficina</span>
              </span>
            </span>
          </div>
          <nav aria-label="Secciones" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {menu.map(([id, texto, Icono, badge]) => (
              <button
                key={id}
                type="button"
                onClick={() => ir(id)}
                aria-current={sec === id ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[0.92rem] font-semibold transition ${sec === id ? "bg-white text-[#0f2740]" : "text-white/80 hover:bg-white/10"}`}
              >
                <Icono size={17} />
                <span className="whitespace-nowrap">{texto}</span>
                {!!badge && <span className="ml-auto rounded-full bg-[#d9483b] px-2 text-[0.75rem] font-bold text-white">{badge}</span>}
              </button>
            ))}
          </nav>
          <div className="hidden border-t border-white/10 px-4 py-4 lg:block">
            <p className="text-[0.85rem] font-semibold">Ana Morales</p>
            <p className="text-[0.78rem] text-white/60">Administración</p>
            <button type="button" onClick={p.reiniciar} className="mt-3 text-[0.78rem] text-white/60 underline underline-offset-4">
              Volver a los datos de ejemplo
            </button>
          </div>
        </aside>

        {/* contenido */}
        <div className="min-w-0" style={{ background: FONDO }}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-4 py-3 lg:px-6" style={{ borderColor: BORDE }}>
            <p className="font-bold">{titulo}</p>
            <p className="text-[0.88rem]" style={{ color: SUAVE }}>
              {fechaLarga(p.hoy)} · <span style={{ color: VERDE }}>● En vivo</span>
            </p>
          </div>
          <div className="px-4 py-5 lg:px-6">
            {sec === "inicio" && <Resumen p={p} ir={ir} verTrabajador={setDetalle} />}
            {sec === "mapa" && <Mapa p={p} verTrabajador={setDetalle} />}
            {sec === "planilla" && <PlanillaSemana p={p} verTrabajador={setDetalle} />}
            {sec === "personal" && <Personal verTrabajador={setDetalle} />}
            {sec === "prestaciones" && <Prestaciones />}
            {sec === "solicitudes" && <Solicitudes p={p} />}
          </div>
        </div>
      </div>

      <Cajon abierto={detalle !== null} alCerrar={() => setDetalle(null)} fondo="#fff">
        {detalle && <FichaTrabajador t={detalle} p={p} alCerrar={() => setDetalle(null)} />}
      </Cajon>
    </main>
  );
}

/* Estado de cada trabajador ahorita, según su última marca */
function estadoAhora(t: Trabajador, p: Planilla) {
  const m = p.hoyDe(t);
  const o = obraDe(t.obra);
  if (!m) return { clave: "sin" as const, color: ROJO, texto: "No ha marcado hoy", lugar: `Lo esperan en ${o.nombre}` };
  if (m.salida !== null) return { clave: "salio" as const, color: SUAVE, texto: `Salió a las ${hora(m.salida)}`, lugar: o.nombre };
  if (m.lejos) return { clave: "lejos" as const, color: NARANJA, texto: `Marcó a las ${hora(m.entrada)}, a 2.4 km de la obra`, lugar: `Cerca de Villa Nueva centro, no en ${o.nombre}` };
  return { clave: "obra" as const, color: VERDE, texto: `En la obra desde las ${hora(m.entrada)}`, lugar: `${o.nombre}, ubicación verificada` };
}

function Mapa({ p, verTrabajador }: { p: Planilla; verTrabajador: (t: Trabajador) => void }) {
  const [filtro, setFiltro] = useState<"todos" | "obra" | "lejos" | "sin" | "salio">("todos");
  const [foco, setFoco] = useState<string | null>(null);
  const lista = TRABAJADORES.map((t) => ({ t, e: estadoAhora(t, p) }));
  const cuenta = (k: string) => lista.filter((x) => x.e.clave === k).length;
  const visibles = lista.filter((x) => filtro === "todos" || x.e.clave === filtro);
  // dónde dibujar a cada uno: alrededor de su obra; el que marcó lejos, apartado
  const punto = (t: Trabajador, i: number, clave: string) => {
    const base = EN_MAPA[t.obra];
    if (clave === "lejos") return { x: base.x - 14, y: base.y + 8 };
    const ang = (i / 6) * Math.PI * 2;
    return { x: base.x + Math.cos(ang) * 4.2, y: base.y + Math.sin(ang) * 6.5 };
  };

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["todos", `Todos (${lista.length})`, TEXTO],
            ["obra", `En su obra (${cuenta("obra")})`, VERDE],
            ["lejos", `Fuera de la obra (${cuenta("lejos")})`, NARANJA],
            ["sin", `Sin marcar (${cuenta("sin")})`, ROJO],
            ["salio", `Ya salieron (${cuenta("salio")})`, SUAVE],
          ] as const
        ).map(([id, txt, c]) => (
          <button key={id} type="button" onClick={() => setFiltro(id)} aria-pressed={filtro === id} className="flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-[0.88rem] font-semibold" style={filtro === id ? { borderColor: AZUL, boxShadow: `inset 0 0 0 1px ${AZUL}` } : { borderColor: BORDE }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} /> {txt}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="caja overflow-hidden">
          <div className="relative aspect-[16/11] w-full" style={{ background: "#eef1ec" }}>
            {/* calles y zonas, dibujo simple */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              <path d="M0 55 C 25 50, 45 60, 100 45" stroke="#d6dbd2" strokeWidth="2.2" fill="none" />
              <path d="M30 0 C 35 30, 50 55, 48 100" stroke="#d6dbd2" strokeWidth="2.2" fill="none" />
              <path d="M60 0 C 65 25, 70 40, 100 70" stroke="#dde1d9" strokeWidth="1.4" fill="none" />
              <path d="M0 20 C 30 25, 60 15, 100 22" stroke="#dde1d9" strokeWidth="1.2" fill="none" />
              <path d="M10 100 C 20 75, 15 60, 0 40" stroke="#dde1d9" strokeWidth="1.2" fill="none" />
              <path d="M70 100 C 65 80, 80 70, 100 85" stroke="#dde1d9" strokeWidth="1.2" fill="none" />
            </svg>
            {[
              ["Mixco", 12, 20],
              ["Zona 16", 84, 14],
              ["Zona 10", 62, 60],
              ["Villa Nueva", 30, 92],
            ].map(([n, x, y]) => (
              <span key={n as string} className="absolute text-[0.72rem] font-semibold" style={{ left: `${x}%`, top: `${y}%`, color: "#8a9486" }}>
                {n}
              </span>
            ))}
            {/* oficina */}
            <span className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${EN_MAPA.oficina.x}%`, top: `${EN_MAPA.oficina.y}%` }}>
              <span className="flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-[0.72rem] font-semibold shadow" style={{ color: AZUL }}>
                <Home size={11} /> Oficina
              </span>
            </span>
            {/* obras */}
            {OBRAS.map((o) => (
              <span key={o.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${EN_MAPA[o.id].x}%`, top: `${EN_MAPA[o.id].y}%` }}>
                <span className="block h-16 w-16 rounded-full border-2 border-dashed sm:h-20 sm:w-20" style={{ borderColor: "#9fb0c4", background: "rgba(23,58,94,.06)" }} />
                <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-white px-1.5 text-[0.72rem] font-bold shadow-sm" style={{ color: AZUL }}>
                  {o.nombre}
                </span>
              </span>
            ))}
            {/* trabajadores */}
            {lista.map(({ t, e }) => {
              const i = TRABAJADORES.filter((x) => x.obra === t.obra).indexOf(t);
              const pos = punto(t, i, e.clave);
              const oculto = filtro !== "todos" && e.clave !== filtro;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => verTrabajador(t)}
                  onMouseEnter={() => setFoco(t.id)}
                  onMouseLeave={() => setFoco(null)}
                  title={`${t.nombre}: ${e.texto}`}
                  className="absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white text-[0.6rem] font-bold text-white shadow transition"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, background: e.color, opacity: oculto ? 0.15 : 1, transform: `translate(-50%,-50%) scale(${foco === t.id ? 1.35 : 1})`, zIndex: foco === t.id ? 5 : 1 }}
                >
                  {iniciales(t.nombre)}
                </button>
              );
            })}
          </div>
          <p className="border-t px-4 py-2 text-[0.8rem]" style={{ borderColor: BORDE, color: SUAVE }}>
            Mapa de ejemplo. En su sistema se usa el mapa real con la ubicación que manda el teléfono de cada trabajador al marcar.
          </p>
        </div>

        <div className="caja">
          <ul>
            {visibles.map(({ t, e }) => (
              <li key={t.id} className="border-b last:border-0" style={{ borderColor: BORDE }}>
                <button type="button" onClick={() => verTrabajador(t)} onMouseEnter={() => setFoco(t.id)} onMouseLeave={() => setFoco(null)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[#f7f8fa]">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: e.color }} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{t.nombre}</span>
                    <span className="block text-[0.85rem]" style={{ color: e.clave === "lejos" ? NARANJA : SUAVE }}>{e.texto}</span>
                    <span className="block truncate text-[0.78rem]" style={{ color: SUAVE }}>{e.lugar}</span>
                  </span>
                  <ChevronRight size={16} style={{ color: SUAVE }} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Resumen({ p, ir, verTrabajador }: { p: Planilla; ir: (s: Sec) => void; verTrabajador: (t: Trabajador) => void }) {
  const filas = TRABAJADORES.map((t) => ({ t, c: semanaDe(t, p.diasDe(t), p.solicitudes) }));
  const totalSemana = filas.reduce((a, f) => a + f.c.liquido, 0);
  const adentro = TRABAJADORES.filter((t) => {
    const m = p.hoyDe(t);
    return m && m.salida === null;
  });
  const pendientes = p.solicitudes.filter((s) => s.estado === "pendiente");
  const aguinaldo = TRABAJADORES.reduce((a, t) => a + prestacionesDe(t).aguinaldo, 0);
  const pagoAgu = prestacionesDe(TRABAJADORES[0]).pagoAgu;
  const igss = TRABAJADORES.reduce((a, t) => {
    const x = igssMes(t);
    return a + x.laboral + x.patronal;
  }, 0);
  const alertas = filas.flatMap(({ t, c }) => {
    const vac = prestacionesDe(t).vacDisponibles;
    return [
      ...(c.faltas ? [{ t, texto: `Faltó ${c.faltas === 1 ? "un día" : `${c.faltas} días`} esta semana y pierde el séptimo.` }] : []),
      ...(c.tardes >= 2 ? [{ t, texto: `Llegó tarde ${c.tardes} veces esta semana.` }] : []),
      ...(c.lejos ? [{ t, texto: "Un día marcó lejos de su obra. Revise la ubicación." }] : []),
      ...(vac >= 12 ? [{ t, texto: `Tiene ${vac} días de vacaciones sin tomar.` }] : []),
    ];
  });

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-[1.6rem] font-bold">Resumen</h1>
        <p style={{ color: SUAVE }}>Al {fechaLarga(p.hoy)}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Dato etiqueta="Planilla de esta semana" valor={qz(totalSemana)} nota="Lo trabajado hasta hoy" />
        <Dato etiqueta="Trabajando ahorita" valor={`${adentro.length} de ${TRABAJADORES.length}`} nota="Según el marcaje en las obras" />
        <Dato etiqueta="Solicitudes por aprobar" valor={String(pendientes.length)} nota="Vales, permisos y vacaciones" color={pendientes.length ? ROJO : undefined} />
        <Dato etiqueta="Aguinaldo acumulado" valor={qz(aguinaldo)} nota={`Se paga el 15 de diciembre (faltan ${faltan(pagoAgu)} días)`} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Seccion titulo="Para revisar" nota="Lo que conviene ver antes de pagar">
          {alertas.length === 0 ? (
            <p className="px-4 py-3" style={{ color: SUAVE }}>Todo en orden.</p>
          ) : (
            <ul>
              {alertas.map((a, i) => (
                <li key={i} className="border-b last:border-0" style={{ borderColor: BORDE }}>
                  <button type="button" onClick={() => verTrabajador(a.t)} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[#f7f8fa]">
                    <AlertTriangle size={17} className="mt-0.5 shrink-0" style={{ color: NARANJA }} />
                    <span className="flex-1">
                      <b>{a.t.nombre}</b>
                      <span className="block text-[0.9rem]" style={{ color: SUAVE }}>{a.texto}</span>
                    </span>
                    <ChevronRight size={17} className="mt-0.5" style={{ color: SUAVE }} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Seccion>

        <Seccion titulo="Hoy en cada obra" nota="Quién marcó entrada">
          <ul>
            {OBRAS.map((o) => {
              const gente = TRABAJADORES.filter((t) => t.obra === o.id);
              const sin = gente.filter((t) => !p.hoyDe(t));
              return (
                <li key={o.id} className="border-b px-4 py-3 last:border-0" style={{ borderColor: BORDE }}>
                  <div className="flex justify-between gap-3">
                    <span>
                      <b>{o.nombre}</b> <span className="text-[0.85rem]" style={{ color: SUAVE }}>· {o.lugar}</span>
                    </span>
                    <span className="num font-semibold">
                      {gente.length - sin.length}/{gente.length}
                    </span>
                  </div>
                  {sin.length > 0 && <p className="mt-0.5 text-[0.88rem]" style={{ color: ROJO }}>Sin marcar: {sin.map((t) => t.nombre).join(", ")}</p>}
                </li>
              );
            })}
          </ul>
        </Seccion>
      </div>

      <Seccion titulo="Próximos pagos" nota="Para que no se le pase ninguno">
        <ul>
          {(
            [
              ["Planilla de la semana", "Este sábado", qz(totalSemana), "planilla"],
              [`IGSS de ${mesNombre(new Date())}`, `A más tardar el ${fmtFecha(fechaLimiteIgss())}`, qz(igss), "prestaciones"],
              ["Aguinaldo", `A más tardar el ${fmtFecha(pagoAgu)}`, qz(aguinaldo), "prestaciones"],
            ] as [string, string, string, Sec][]
          ).map(([a, b, c, s]) => (
            <li key={a} className="border-b last:border-0" style={{ borderColor: BORDE }}>
              <button type="button" onClick={() => ir(s)} className="flex w-full flex-wrap items-center justify-between gap-2 px-4 py-3 text-left hover:bg-[#f7f8fa]">
                <span>
                  <b>{a}</b>
                  <span className="block text-[0.88rem]" style={{ color: SUAVE }}>{b}</span>
                </span>
                <span className="num font-semibold">{c}</span>
              </button>
            </li>
          ))}
        </ul>
      </Seccion>
    </div>
  );
}

function PlanillaSemana({ p, verTrabajador }: { p: Planilla; verTrabajador: (t: Trabajador) => void }) {
  const [obra, setObra] = useState("todas");
  const [msg, setMsg] = useState<string | null>(null);
  const filas = TRABAJADORES.filter((t) => obra === "todas" || t.obra === obra).map((t) => ({ t, c: semanaDe(t, p.diasDe(t), p.solicitudes) }));
  const suma = (k: "afecto" | "bonificacion" | "igss" | "descVales" | "liquido") => filas.reduce((a, f) => a + f.c[k], 0);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[1.6rem] font-bold">Planilla de la semana</h1>
          <p style={{ color: SUAVE }}>
            Del {diaCorto(p.dias[0]).toLowerCase()} {Number(p.dias[0].slice(8))} al {diaCorto(p.dias[5]).toLowerCase()} {Number(p.dias[5].slice(8))}, calculada con el marcaje
          </p>
        </div>
        <select value={obra} onChange={(e) => setObra(e.target.value)} className="rounded-lg border bg-white px-3 py-2 font-semibold" style={{ borderColor: BORDE }}>
          <option value="todas">Todas las obras</option>
          {OBRAS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="caja overflow-x-auto">
        <table className="num w-full min-w-[46rem] text-[0.92rem]">
          <thead>
            <tr>
              <th>Trabajador</th>
              <th>Días</th>
              <th>H. extra</th>
              <th>Salario afecto</th>
              <th>Bonificación</th>
              <th>IGSS 4.83%</th>
              <th>Vales</th>
              <th>Líquido a pagar</th>
            </tr>
          </thead>
          <tbody>
            {filas.map(({ t, c }) => (
              <tr key={t.id} onClick={() => verTrabajador(t)} className="cursor-pointer hover:bg-[#f7f8fa]">
                <td>
                  <span className="font-semibold">{t.nombre}</span>
                  <span className="block text-[0.8rem]" style={{ color: SUAVE }}>
                    {t.puesto} · {obraDe(t.obra).nombre}
                  </span>
                </td>
                <td>
                  {c.diasTrab}/6
                  {c.septimoEstado === "no" && <span className="block text-[0.78rem]" style={{ color: ROJO }}>sin séptimo</span>}
                </td>
                <td>{c.horasExtra || "—"}</td>
                <td>{qz(c.afecto)}</td>
                <td>{qz(c.bonificacion)}</td>
                <td>−{qz(c.igss)}</td>
                <td>{c.descVales ? `−${qz(c.descVales)}` : "—"}</td>
                <td className="font-bold">{qz(c.liquido)}</td>
              </tr>
            ))}
            <tr style={{ background: "#f7f8fa" }}>
              <td className="font-bold">Total</td>
              <td />
              <td />
              <td className="font-semibold">{qz(suma("afecto"))}</td>
              <td className="font-semibold">{qz(suma("bonificacion"))}</td>
              <td className="font-semibold">−{qz(suma("igss"))}</td>
              <td className="font-semibold">{suma("descVales") ? `−${qz(suma("descVales"))}` : "—"}</td>
              <td className="font-bold">{qz(suma("liquido"))}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-[0.88rem]" style={{ color: SUAVE }}>
        El salario afecto incluye días, séptimo y horas extra; sobre eso se calcula el IGSS. La bonificación de Q{BONIF_MES} al mes va aparte porque no paga IGSS. El séptimo se suma el sábado a quien complete la semana. Toque a un trabajador para ver el detalle.
      </p>

      <div>
        {p.cerrada ? (
          <p className="flex items-center gap-2 font-semibold" style={{ color: VERDE }}>
            <Check size={18} /> Planilla cerrada. Cada trabajador ya tiene su boleta en su portal.
          </p>
        ) : (
          <button
            type="button"
            onClick={() => {
              p.cerrar();
              const t = TRABAJADORES[1];
              const c = semanaDe(t, p.diasDe(t), p.solicitudes);
              setMsg(`Constructora Los Cedros\nBoleta de ${t.nombre}, semana del ${Number(p.dias[0].slice(8))} al ${Number(p.dias[5].slice(8))}.\n\nDías trabajados: ${c.diasTrab}\nLíquido a recibir: ${qz(c.liquido)}\n\nEl detalle está en su portal con su código y su PIN.`);
            }}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-semibold text-white"
            style={{ background: AZUL }}
          >
            <FileText size={17} /> Cerrar planilla y mandar boletas
          </button>
        )}
      </div>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="planilla y control de empleados" que="la boleta" />
    </div>
  );
}

function Personal({ verTrabajador }: { verTrabajador: (t: Trabajador) => void }) {
  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-[1.6rem] font-bold">Personal</h1>
        <p style={{ color: SUAVE }}>{TRABAJADORES.length} trabajadores en {OBRAS.length} obras. Toque a uno para ver su ficha.</p>
      </div>
      <div className="caja overflow-x-auto">
        <table className="num w-full min-w-[44rem] text-[0.92rem]">
          <thead>
            <tr>
              <th>Código</th>
              <th>Trabajador</th>
              <th>Obra</th>
              <th>Ingreso</th>
              <th>Salario diario</th>
              <th>Vacaciones disponibles</th>
            </tr>
          </thead>
          <tbody>
            {TRABAJADORES.map((t) => {
              const pr = prestacionesDe(t);
              return (
                <tr key={t.id} onClick={() => verTrabajador(t)} className="cursor-pointer hover:bg-[#f7f8fa]">
                  <td style={{ color: SUAVE }}>{t.codigo}</td>
                  <td>
                    <span className="font-semibold">{t.nombre}</span>
                    <span className="block text-[0.8rem]" style={{ color: SUAVE }}>{t.puesto}</span>
                  </td>
                  <td>{obraDe(t.obra).nombre}</td>
                  <td>
                    {fechaLarga(t.ingreso)}
                    <span className="block text-[0.8rem]" style={{ color: SUAVE }}>{antiguedad(t)}</span>
                  </td>
                  <td>{qz(t.diario)}</td>
                  <td style={{ color: pr.vacDisponibles >= 12 ? NARANJA : undefined }}>{pr.vacDisponibles} días</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Prestaciones() {
  const filas = TRABAJADORES.map((t) => ({ t, pr: prestacionesDe(t), ig: igssMes(t) }));
  const s = (f: (x: (typeof filas)[number]) => number) => filas.reduce((a, x) => a + f(x), 0);
  const pagoAgu = filas[0].pr.pagoAgu;
  const pagoB14 = filas[0].pr.pagoB14;

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-[1.6rem] font-bold">Prestaciones e IGSS</h1>
        <p style={{ color: SUAVE }}>Lo que la empresa va debiendo, calculado al día de hoy</p>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Dato etiqueta={`IGSS de ${mesNombre(new Date())}`} valor={qz(s((x) => x.ig.laboral + x.ig.patronal))} nota={`Pagar a más tardar el ${fmtFecha(fechaLimiteIgss())}`} />
        <Dato etiqueta="Aguinaldo acumulado" valor={qz(s((x) => x.pr.aguinaldo))} nota={`Se paga el ${fmtFecha(pagoAgu)}`} />
        <Dato etiqueta="Bono 14 acumulado" valor={qz(s((x) => x.pr.bono14))} nota={`Se paga el ${fmtFecha(pagoB14)}`} />
        <Dato etiqueta="Indemnizaciones" valor={qz(s((x) => x.pr.indemnizacion))} nota="Si todos se fueran hoy" />
      </div>

      <Seccion titulo={`IGSS de ${mesNombre(new Date())}`} nota={`Laboral ${(IGSS_LAB * 100).toFixed(2)}%, que se descuenta al trabajador, y patronal ${(IGSS_PAT * 100).toFixed(2)}%, que pone la empresa (incluye IRTRA e INTECAP). Estimado con 26 días.`}>
        <div className="overflow-x-auto">
          <table className="num w-full min-w-[34rem] text-[0.92rem]">
            <thead>
              <tr>
                <th>Trabajador</th>
                <th>Salario del mes</th>
                <th>Laboral</th>
                <th>Patronal</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filas.map(({ t, ig }) => (
                <tr key={t.id}>
                  <td className="font-semibold">{t.nombre}</td>
                  <td>{qz(ig.base)}</td>
                  <td>{qz(ig.laboral)}</td>
                  <td>{qz(ig.patronal)}</td>
                  <td className="font-semibold">{qz(ig.laboral + ig.patronal)}</td>
                </tr>
              ))}
              <tr style={{ background: "#f7f8fa" }}>
                <td className="font-bold">Total</td>
                <td className="font-semibold">{qz(s((x) => x.ig.base))}</td>
                <td className="font-semibold">{qz(s((x) => x.ig.laboral))}</td>
                <td className="font-semibold">{qz(s((x) => x.ig.patronal))}</td>
                <td className="font-bold">{qz(s((x) => x.ig.laboral + x.ig.patronal))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Seccion>

      <Seccion titulo="Prestaciones por trabajador" nota="Aguinaldo y Bono 14: un salario al año, proporcional a lo trabajado. Vacaciones: 15 días hábiles por año.">
        <div className="overflow-x-auto">
          <table className="num w-full min-w-[40rem] text-[0.92rem]">
            <thead>
              <tr>
                <th>Trabajador</th>
                <th>Aguinaldo</th>
                <th>Bono 14</th>
                <th>Vacaciones</th>
                <th>Indemnización estimada</th>
              </tr>
            </thead>
            <tbody>
              {filas.map(({ t, pr }) => (
                <tr key={t.id}>
                  <td>
                    <span className="font-semibold">{t.nombre}</span>
                    <span className="block text-[0.8rem]" style={{ color: SUAVE }}>{antiguedad(t)}</span>
                  </td>
                  <td>
                    {qz(pr.aguinaldo)}
                    <span className="block text-[0.78rem]" style={{ color: SUAVE }}>{pr.diasAgu} días</span>
                  </td>
                  <td>
                    {qz(pr.bono14)}
                    <span className="block text-[0.78rem]" style={{ color: SUAVE }}>{pr.diasB14} días</span>
                  </td>
                  <td>{pr.vacDisponibles} días</td>
                  <td>{qz(pr.indemnizacion)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Seccion>
      <p className="text-[0.85rem]" style={{ color: SUAVE }}>
        Montos de referencia para la demo. En su empresa se configuran con su contador: salarios, fechas y criterios.
      </p>
    </div>
  );
}

const NOMBRE_TIPO: Record<Tipo, string> = { vale: "Vale", permiso: "Permiso", vacaciones: "Vacaciones" };

function EstadoChip({ s }: { s: Solicitud }) {
  const c = s.estado === "aprobada" ? VERDE : s.estado === "rechazada" ? ROJO : NARANJA;
  return (
    <span className="shrink-0 rounded-full px-2 py-0.5 text-[0.78rem] font-semibold" style={{ color: c, background: `${c}14` }}>
      {s.estado === "pendiente" ? "Pendiente" : s.estado === "aprobada" ? "Aprobada" : "Rechazada"}
    </span>
  );
}

function Solicitudes({ p }: { p: Planilla }) {
  const orden = [...p.solicitudes].sort((a, b) => Number(b.estado === "pendiente") - Number(a.estado === "pendiente"));
  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-[1.6rem] font-bold">Solicitudes</h1>
        <p style={{ color: SUAVE }}>Lo que piden los trabajadores desde su portal. Los vales aprobados se descuentan solos en la planilla.</p>
      </div>
      <div className="caja">
        <ul>
          {orden.map((s) => {
            const t = TRABAJADORES.find((x) => x.id === s.trabajador)!;
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-3 border-b px-4 py-3 last:border-0" style={{ borderColor: BORDE }}>
                <Avatar t={t} size={36} />
                <span className="min-w-[12rem] flex-1">
                  <b>{t.nombre}</b>{" "}
                  <span style={{ color: SUAVE }}>
                    · {NOMBRE_TIPO[s.tipo]}
                    {s.monto ? ` de ${qz(s.monto)}` : ""}
                    {s.dias ? ` · ${s.dias} días` : ""}
                  </span>
                  <span className="block text-[0.88rem]" style={{ color: SUAVE }}>
                    {s.detalle} · pedido el {diaCorto(s.fecha).toLowerCase()} {Number(s.fecha.slice(8))}
                  </span>
                </span>
                {s.estado === "pendiente" ? (
                  <span className="flex gap-2">
                    <button type="button" onClick={() => p.resolver(s.id, "rechazada")} className="rounded-lg border px-3 py-1.5 text-[0.9rem] font-semibold" style={{ borderColor: BORDE }}>
                      Rechazar
                    </button>
                    <button type="button" onClick={() => p.resolver(s.id, "aprobada")} className="rounded-lg px-3 py-1.5 text-[0.9rem] font-semibold text-white" style={{ background: VERDE }}>
                      Aprobar
                    </button>
                  </span>
                ) : (
                  <EstadoChip s={s} />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ═════════════ Piezas compartidas ═════════════ */

function Dias({ t, p }: { t: Trabajador; p: Planilla }) {
  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {p.diasDe(t).map((d) => {
        const futuro = d.fecha > p.hoy;
        const tarde = d.marca && d.marca.entrada > jornada(d.fecha).entra + 10;
        return (
          <li key={d.fecha} className="rounded-lg border p-2 text-center" style={{ borderColor: !d.marca && !futuro && d.fecha < p.hoy ? ROJO : BORDE }}>
            <p className="text-[0.8rem] font-semibold" style={{ color: SUAVE }}>
              {diaCorto(d.fecha)} {Number(d.fecha.slice(8))}
            </p>
            {d.marca ? (
              <>
                <p className="num mt-1 text-[0.88rem] font-semibold" style={{ color: tarde ? ROJO : undefined }}>{hora(d.marca.entrada)}</p>
                <p className="num text-[0.85rem]" style={{ color: SUAVE }}>{d.marca.salida !== null ? hora(d.marca.salida) : "adentro"}</p>
                {d.marca.lejos && <p className="mt-0.5 text-[0.7rem] font-semibold" style={{ color: ROJO }}>fuera de la obra</p>}
              </>
            ) : (
              <p className="mt-2 text-[0.82rem] font-semibold" style={{ color: d.fecha < p.hoy ? ROJO : SUAVE }}>{d.fecha < p.hoy ? "Faltó" : "—"}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Desglose({ t, p }: { t: Trabajador; p: Planilla }) {
  const c = semanaDe(t, p.diasDe(t), p.solicitudes);
  const filas: [string, string, number][] = [
    ["Días trabajados", `${c.diasTrab} × ${qz(t.diario)}`, c.ordinario],
    ["Séptimo día", c.septimoEstado === "si" ? "Completó la semana" : c.septimoEstado === "no" ? "No se paga: faltó un día" : `Se suma si completa la semana (faltan ${c.pendientes} días)`, c.septimo],
    ["Horas extra", c.horasExtra ? `${c.horasExtra} h × ${qz((t.diario / 8) * 1.5)} (hora y media)` : "No hizo", c.extras],
    ["Bonificación incentivo", `Q${BONIF_MES} al mes, no paga IGSS`, c.bonificacion],
    ["IGSS laboral", `${(IGSS_LAB * 100).toFixed(2)}% de ${qz(c.afecto)}`, -c.igss],
    ...c.vales.map((v) => [`Vale: ${v.detalle}`, `Aprobado, pedido el ${diaCorto(v.fecha).toLowerCase()}`, -(v.monto ?? 0)] as [string, string, number]),
  ];
  return (
    <div className="overflow-hidden rounded-lg border" style={{ borderColor: BORDE }}>
      <ul>
        {filas.map(([a, b, n]) => (
          <li key={a} className="flex items-start justify-between gap-3 border-b px-4 py-2.5" style={{ borderColor: BORDE }}>
            <span>
              <span className="block font-semibold">{a}</span>
              <span className="block text-[0.82rem]" style={{ color: SUAVE }}>{b}</span>
            </span>
            <span className="num shrink-0 font-semibold" style={{ color: n < 0 ? ROJO : undefined }}>
              {n < 0 ? `−${qz(-n)}` : qz(n)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between px-4 py-3" style={{ background: "#f7f8fa" }}>
        <span className="font-bold">Líquido a recibir</span>
        <span className="num text-[1.2rem] font-bold">{qz(c.liquido)}</span>
      </div>
    </div>
  );
}

function FichaTrabajador({ t, p, alCerrar }: { t: Trabajador; p: Planilla; alCerrar: () => void }) {
  const pr = prestacionesDe(t);
  return (
    <div className="h-full overflow-y-auto p-6" style={{ color: TEXTO }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar t={t} size={48} />
          <div>
            <p className="text-[1.1rem] font-bold">{t.nombre}</p>
            <p className="text-[0.9rem]" style={{ color: SUAVE }}>
              Código {t.codigo} · {t.puesto} · {obraDe(t.obra).nombre}
            </p>
          </div>
        </div>
        <button type="button" onClick={alCerrar} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5">
          <X size={18} />
        </button>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.92rem]">
        <dt style={{ color: SUAVE }}>Ingreso</dt>
        <dd className="text-right">{fechaLarga(t.ingreso)}</dd>
        <dt style={{ color: SUAVE }}>Salario diario</dt>
        <dd className="num text-right">{qz(t.diario)}</dd>
        <dt style={{ color: SUAVE }}>DPI</dt>
        <dd className="text-right">{t.dpi}</dd>
      </dl>
      <h3 className="mt-6 font-bold">Esta semana</h3>
      <div className="mt-2">
        <Dias t={t} p={p} />
      </div>
      <div className="mt-3">
        <Desglose t={t} p={p} />
      </div>
      <h3 className="mt-6 font-bold">Prestaciones al día de hoy</h3>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.92rem]">
        <dt style={{ color: SUAVE }}>Aguinaldo acumulado</dt>
        <dd className="num text-right">{qz(pr.aguinaldo)}</dd>
        <dt style={{ color: SUAVE }}>Bono 14 acumulado</dt>
        <dd className="num text-right">{qz(pr.bono14)}</dd>
        <dt style={{ color: SUAVE }}>Vacaciones disponibles</dt>
        <dd className="text-right">{pr.vacDisponibles} días</dd>
        <dt style={{ color: SUAVE }}>Indemnización estimada</dt>
        <dd className="num text-right">{qz(pr.indemnizacion)}</dd>
      </dl>
    </div>
  );
}

/* ═════════════ Portal del empleado ═════════════ */

function Portal({ p }: { p: Planilla }) {
  const [sesion, setSesion] = useState<string | null>(null);
  const t = TRABAJADORES.find((x) => x.id === sesion);
  return (
    <main className="mx-auto max-w-md px-4 pb-16 pt-6">
      <div className="overflow-hidden rounded-[1.6rem] border bg-white shadow-[0_20px_50px_-30px_rgba(15,39,64,.45)]" style={{ borderColor: BORDE }}>
        {t ? <MiPortal key={t.id} t={t} p={p} salir={() => setSesion(null)} /> : <Entrar alEntrar={setSesion} />}
      </div>
      <p className="mt-3 text-center text-[0.82rem]" style={{ color: SUAVE }}>Así se ve en el teléfono de cada trabajador.</p>
    </main>
  );
}

function Entrar({ alEntrar }: { alEntrar: (id: string) => void }) {
  const [codigo, setCodigo] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="p-6">
      <Logo />
      <h1 className="mt-8 text-[1.5rem] font-bold">Mi portal</h1>
      <p style={{ color: SUAVE }}>Entre con su código de empleado y su PIN. Solo usted ve su información.</p>
      <form
        className="mt-5 grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const t = TRABAJADORES.find((x) => x.codigo === codigo.trim());
          if (!t) return setError("No encontramos ese código.");
          if (pin !== PIN_EJEMPLO) return setError("El PIN no es correcto.");
          alEntrar(t.id);
        }}
      >
        <label className="text-[0.9rem] font-semibold">
          Código de empleado
          <input inputMode="numeric" value={codigo} onChange={(e) => { setCodigo(e.target.value); setError(""); }} className="mt-1 block w-full rounded-lg border px-3 py-3 text-[1rem]" style={{ borderColor: BORDE }} placeholder="Ej. 102" />
        </label>
        <label className="text-[0.9rem] font-semibold">
          PIN
          <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => { setPin(e.target.value); setError(""); }} className="mt-1 block w-full rounded-lg border px-3 py-3 text-[1rem]" style={{ borderColor: BORDE }} placeholder="••••" />
        </label>
        {error && <p className="text-[0.9rem] font-semibold" style={{ color: ROJO }}>{error}</p>}
        <button type="submit" className="mt-1 rounded-lg py-3 font-semibold text-white" style={{ background: AZUL }}>
          Entrar
        </button>
      </form>
      <p className="mt-4 rounded-lg px-3 py-2 text-[0.88rem]" style={{ background: "#f7f8fa", color: SUAVE }}>
        Para probar: código <b>102</b> y PIN <b>{PIN_EJEMPLO}</b>. Cualquier código del 101 al 112 funciona.
      </p>
    </div>
  );
}

type Pestana = "inicio" | "sueldo" | "solicitudes" | "perfil";

function MiPortal({ t, p, salir }: { t: Trabajador; p: Planilla; salir: () => void }) {
  const [tab, setTab] = useState<Pestana>("inicio");
  const pestanas: [Pestana, string, typeof Home][] = [
    ["inicio", "Inicio", Home],
    ["sueldo", "Mi sueldo", Wallet],
    ["solicitudes", "Solicitudes", Inbox],
    ["perfil", "Mi perfil", UserRound],
  ];
  return (
    <div className="flex min-h-[38rem] flex-col">
      <div className="flex items-center gap-3 px-5 pb-4 pt-5 text-white" style={{ background: "#0f2740" }}>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 font-semibold">{iniciales(t.nombre)}</span>
        <div className="min-w-0">
          <p className="font-bold">Hola, {t.nombre.split(" ")[0]}</p>
          <p className="truncate text-[0.8rem] text-white/70">
            {t.puesto} · {obraDe(t.obra).nombre}
          </p>
        </div>
      </div>
      <div className="flex-1 px-4 py-4">
        {tab === "inicio" && <PInicio t={t} p={p} ir={setTab} />}
        {tab === "sueldo" && <PSueldo t={t} p={p} />}
        {tab === "solicitudes" && <PSolicitudes t={t} p={p} />}
        {tab === "perfil" && <PPerfil t={t} salir={salir} />}
      </div>
      <nav aria-label="Pestañas" className="grid grid-cols-4 border-t" style={{ borderColor: BORDE }}>
        {pestanas.map(([id, txt, I]) => (
          <button key={id} type="button" onClick={() => setTab(id)} aria-current={tab === id ? "page" : undefined} className="flex flex-col items-center gap-0.5 py-2.5 text-[0.75rem] font-semibold" style={{ color: tab === id ? AZUL : SUAVE }}>
            <I size={20} />
            {txt}
          </button>
        ))}
      </nav>
    </div>
  );
}

function PInicio({ t, p, ir }: { t: Trabajador; p: Planilla; ir: (x: Pestana) => void }) {
  const c = semanaDe(t, p.diasDe(t), p.solicitudes);
  const pr = prestacionesDe(t);
  const m = p.hoyDe(t);
  const pend = p.solicitudes.filter((s) => s.trabajador === t.id && s.estado === "pendiente").length;
  return (
    <div className="grid gap-3">
      <div className="rounded-xl border p-4" style={{ borderColor: BORDE }}>
        <p className="text-[0.85rem]" style={{ color: SUAVE }}>Hoy</p>
        <p className="text-[1.25rem] font-bold">{!m ? "Todavía no ha marcado" : m.salida !== null ? `Salió a las ${hora(m.salida)}` : `Entró a las ${hora(m.entrada)}`}</p>
        <p className="mt-0.5 flex items-center gap-1 text-[0.85rem]" style={{ color: m?.lejos ? NARANJA : SUAVE }}>
          <MapPin size={13} /> {m?.lejos ? "Marcó lejos de la obra; la oficina lo va a revisar" : `${obraDe(t.obra).nombre}, ${obraDe(t.obra).lugar}`}
        </p>
      </div>
      <button type="button" onClick={() => ir("sueldo")} className="flex items-center justify-between rounded-xl border p-4 text-left" style={{ borderColor: BORDE }}>
        <span>
          <span className="block text-[0.85rem]" style={{ color: SUAVE }}>Próximo pago, este sábado</span>
          <span className="num block text-[1.6rem] font-bold">{qz(c.liquido)}</span>
          <span className="block text-[0.82rem]" style={{ color: SUAVE }}>Lo que lleva esta semana ({c.diasTrab} de 6 días)</span>
        </span>
        <ChevronRight size={18} style={{ color: SUAVE }} />
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => ir("solicitudes")} className="rounded-xl border p-3 text-left" style={{ borderColor: BORDE }}>
          <span className="block text-[0.82rem]" style={{ color: SUAVE }}>Vacaciones</span>
          <span className="block text-[1.2rem] font-bold">{pr.vacDisponibles} días</span>
        </button>
        <button type="button" onClick={() => ir("solicitudes")} className="rounded-xl border p-3 text-left" style={{ borderColor: BORDE }}>
          <span className="block text-[0.82rem]" style={{ color: SUAVE }}>Solicitudes</span>
          <span className="block text-[1.2rem] font-bold">{pend ? `${pend} en espera` : "Ninguna"}</span>
        </button>
      </div>
      <div className="rounded-xl p-4" style={{ background: "#f7f8fa" }}>
        <p className="font-semibold">Aviso de la empresa</p>
        <p className="mt-0.5 text-[0.9rem]" style={{ color: SUAVE }}>
          El aguinaldo se paga a más tardar el {fmtFecha(pr.pagoAgu)}. Lleva acumulado {qz(pr.aguinaldo)}.
        </p>
      </div>
    </div>
  );
}

function PSueldo({ t, p }: { t: Trabajador; p: Planilla }) {
  const pr = prestacionesDe(t);
  return (
    <div className="grid gap-4">
      <div>
        <p className="font-bold">Esta semana</p>
        <div className="mt-2">
          <Dias t={t} p={p} />
        </div>
        <div className="mt-3">
          <Desglose t={t} p={p} />
        </div>
      </div>
      <div>
        <p className="font-bold">Boletas anteriores</p>
        <ul className="mt-2 overflow-hidden rounded-lg border" style={{ borderColor: BORDE }}>
          {boletasAnteriores(t).map((b) => (
            <li key={b.ini} className="flex items-center justify-between border-b px-4 py-2.5 last:border-0" style={{ borderColor: BORDE }}>
              <span>
                <span className="block font-semibold">
                  Del {Number(b.ini.slice(8))} al {fechaLarga(b.fin).replace(/ de \d{4}$/, "")}
                </span>
                <span className="block text-[0.8rem]" style={{ color: SUAVE }}>{b.dias} días · pagada</span>
              </span>
              <span className="num font-semibold">{qz(b.liquido)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-bold">Lo que lleva acumulado</p>
        <dl className="mt-2 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 rounded-lg border p-4 text-[0.92rem]" style={{ borderColor: BORDE }}>
          <dt>Aguinaldo <span className="block text-[0.78rem]" style={{ color: SUAVE }}>Se paga el {fmtFecha(pr.pagoAgu)}</span></dt>
          <dd className="num text-right font-semibold">{qz(pr.aguinaldo)}</dd>
          <dt>Bono 14 <span className="block text-[0.78rem]" style={{ color: SUAVE }}>Se paga el {fmtFecha(pr.pagoB14)}</span></dt>
          <dd className="num text-right font-semibold">{qz(pr.bono14)}</dd>
        </dl>
      </div>
    </div>
  );
}

function PSolicitudes({ t, p }: { t: Trabajador; p: Planilla }) {
  const pr = prestacionesDe(t);
  const mias = p.solicitudes.filter((s) => s.trabajador === t.id);
  const [tipo, setTipo] = useState<Tipo | null>(null);
  const [monto, setMonto] = useState(150);
  const [dias, setDias] = useState(1);
  const [detalle, setDetalle] = useState("");
  return (
    <div className="grid gap-4">
      {tipo === null ? (
        <div>
          <p className="font-bold">¿Qué necesita pedir?</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(
              [
                ["vale", "Vale", HandCoins],
                ["permiso", "Permiso", Calendar],
                ["vacaciones", "Vacaciones", Calendar],
              ] as const
            ).map(([id, txt, I]) => (
              <button key={id} type="button" onClick={() => setTipo(id)} className="flex flex-col items-center gap-1 rounded-xl border py-3 font-semibold" style={{ borderColor: BORDE }}>
                <I size={18} style={{ color: AZUL }} /> {txt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            p.pedir({ trabajador: t.id, tipo, detalle: detalle.trim() || (tipo === "vale" ? "Adelanto" : tipo === "permiso" ? "Permiso" : "Vacaciones"), monto: tipo === "vale" ? monto : undefined, dias: tipo === "vacaciones" ? dias : undefined });
            setTipo(null);
            setDetalle("");
          }}
        >
          <p className="font-bold">{NOMBRE_TIPO[tipo]}</p>
          {tipo === "vale" && (
            <div className="flex gap-2">
              {[100, 150, 200, 300].map((x) => (
                <button key={x} type="button" onClick={() => setMonto(x)} aria-pressed={monto === x} className="num flex-1 rounded-lg border py-2 font-semibold" style={monto === x ? { background: AZUL, color: "#fff", borderColor: AZUL } : { borderColor: BORDE }}>
                  Q{x}
                </button>
              ))}
            </div>
          )}
          {tipo === "vacaciones" && (
            <label className="text-[0.9rem] font-semibold">
              ¿Cuántos días? (tiene {pr.vacDisponibles})
              <input type="number" min={1} max={Math.max(1, Math.floor(pr.vacDisponibles))} value={dias} onChange={(e) => setDias(Number(e.target.value))} className="mt-1 block w-full rounded-lg border px-3 py-2.5" style={{ borderColor: BORDE }} />
            </label>
          )}
          <label className="text-[0.9rem] font-semibold">
            {tipo === "vale" ? "¿Para qué? (opcional)" : "¿Qué día y por qué?"}
            <input value={detalle} onChange={(e) => setDetalle(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2.5" style={{ borderColor: BORDE }} placeholder={tipo === "vale" ? "Pasaje, medicina…" : "Ej. viernes en la mañana, cita médica"} />
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setTipo(null)} className="flex-1 rounded-lg border py-2.5 font-semibold" style={{ borderColor: BORDE }}>
              Cancelar
            </button>
            <button type="submit" className="flex-1 rounded-lg py-2.5 font-semibold text-white" style={{ background: AZUL }}>
              Enviar
            </button>
          </div>
        </form>
      )}
      <div>
        <p className="font-bold">Mis solicitudes</p>
        {mias.length === 0 ? (
          <p className="mt-1 text-[0.9rem]" style={{ color: SUAVE }}>Todavía no ha pedido nada.</p>
        ) : (
          <ul className="mt-2 grid gap-2">
            {mias.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2" style={{ borderColor: BORDE }}>
                <span className="text-[0.92rem]">
                  <b>{NOMBRE_TIPO[s.tipo]}</b>
                  {s.monto ? ` de ${qz(s.monto)}` : ""}
                  {s.dias ? ` · ${s.dias} días` : ""}
                  <span className="block text-[0.82rem]" style={{ color: SUAVE }}>{s.detalle}</span>
                </span>
                <EstadoChip s={s} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function PPerfil({ t, salir }: { t: Trabajador; salir: () => void }) {
  return (
    <div className="grid gap-4">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 rounded-lg border p-4 text-[0.92rem]" style={{ borderColor: BORDE }}>
        {[
          ["Nombre", t.nombre],
          ["Código", t.codigo],
          ["Puesto", t.puesto],
          ["Obra", `${obraDe(t.obra).nombre}, ${obraDe(t.obra).lugar}`],
          ["Ingreso", `${fechaLarga(t.ingreso)} (${antiguedad(t)})`],
          ["Salario diario", qz(t.diario)],
          ["DPI", t.dpi],
        ].map(([a, b]) => (
          <div key={a} className="contents">
            <dt style={{ color: SUAVE }}>{a}</dt>
            <dd className="text-right font-semibold">{b}</dd>
          </div>
        ))}
      </dl>
      <p className="text-[0.85rem]" style={{ color: SUAVE }}>Si algún dato está mal, avise en la oficina para que lo corrijan.</p>
      <button type="button" onClick={salir} className="flex items-center justify-center gap-2 rounded-lg border py-3 font-semibold" style={{ borderColor: BORDE }}>
        <LogOut size={17} /> Cerrar sesión
      </button>
    </div>
  );
}
