/*
 * Demo: "Dulce Abril · pastelería por encargo" (negocio inventado, datos de ejemplo).
 * Para pastelerías que hoy cotizan cada pastel por mensaje: la clienta lo arma y ve el dibujo y el precio al instante,
 * elige un día con cupo y aparta con la mitad. La pastelera ve qué hornear cada día, entregas y cobros.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, Clock, LayoutDashboard, MapPin, Truck } from "lucide-react";
import { BandaDemos, CierreJzet, MensajeWhatsApp } from "../comun";
import {
  BIZCOCHOS, CACAO, COBERTURAS, COLORES, CREMA, CUPO_DIA, DECORACIONES, DIAS, ENTREGAS, FRESA, HORARIOS, LINEA, OPINIONES, PASTEL_INICIAL, POSTRES, RELLENOS, ROSA, SERIF, TAMANOS,
  anticipacion, fechaLarga, iso, masDias, ocupados, por, precioPastel, qz, usePedidos,
  type Pastel, type Pedido,
} from "./datos";

const btn = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold transition active:scale-[0.98]";

/* ---------------- el dibujo del pastel ---------------- */

function oscurecer(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.round(v * (1 - f));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

function aclarar(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.round(v + (255 - v) * f);
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

function DibujoPastel({ p, ancho = 300 }: { p: Pastel; ancho?: number }) {
  const t = por(TAMANOS, p.tamano);
  const color = por(COLORES, p.color).hex;
  const borde = oscurecer(color, 0.14);
  const tapa = aclarar(color, 0.35);
  const fondant = p.cobertura === "fondant";
  const pisos =
    t.pisos === 1
      ? [{ w: t.porciones > 10 ? 190 : 170, h: t.porciones > 10 ? 120 : 92 }]
      : t.pisos === 2
        ? [{ w: 220, h: 100 }, { w: 158, h: 82 }]
        : [{ w: 236, h: 82 }, { w: 182, h: 70 }, { w: 128, h: 60 }];
  const base = 300;
  let y = base - 8;
  const capas = pisos.map((pz) => {
    y -= pz.h;
    return { ...pz, x: 150 - pz.w / 2, y };
  });
  const arriba = capas[capas.length - 1];
  const abajo = capas[0];
  const conTexto = p.deco.includes("texto") && p.texto.trim();
  const ry = (w: number) => w * 0.075;
  const ondas = (x: number, yy: number, w: number) => {
    let d = `M${x} ${yy}`;
    for (let i = 0; i < w - 1; i += 13) d += ` q6.5 ${9 + (i % 26 ? 0 : 2)} 13 0`;
    return d;
  };
  const top = Math.max(0, arriba.y - ry(arriba.w) - 52);
  return (
    <svg viewBox={`0 ${top} 300 ${base + 22 - top}`} width={ancho} role="img" aria-label={`Dibujo del pastel: ${t.nombre.toLowerCase()}, ${por(COLORES, p.color).nombre.toLowerCase()}`} style={{ maxWidth: "100%", height: "auto" }}>
      <ellipse cx="150" cy={base + 4} rx="140" ry="16" fill="#e5d8cb" />
      <ellipse cx="150" cy={base} rx="128" ry="12" fill="#f8f2ea" />
      {capas.map((c, i) => {
        const r = ry(c.w);
        return (
          <g key={i}>
            <path d={`M${c.x} ${c.y} L${c.x} ${c.y + c.h} A${c.w / 2} ${r} 0 0 0 ${c.x + c.w} ${c.y + c.h} L${c.x + c.w} ${c.y} Z`} fill={color} stroke={borde} strokeWidth="1.5" />
            <path d={`M${c.x + c.w * 0.62} ${c.y} L${c.x + c.w * 0.62} ${c.y + c.h + r * 0.9} A${c.w / 2} ${r} 0 0 0 ${c.x + c.w} ${c.y + c.h} L${c.x + c.w} ${c.y} Z`} fill="#000" opacity="0.06" />
            {fondant ? <rect x={c.x + 10} y={c.y + 8} width="7" height={c.h - 10} rx="3.5" fill="#fff" opacity="0.4" /> : <path d={ondas(c.x, c.y + c.h - 4, c.w)} fill="none" stroke={tapa} strokeWidth="5" strokeLinecap="round" />}
            <ellipse cx="150" cy={c.y} rx={c.w / 2} ry={r} fill={tapa} stroke={borde} strokeWidth="1.5" />
            {!fondant && <path d={ondas(c.x + 2, c.y + 2, c.w - 4)} fill="none" stroke={borde} strokeWidth="2" strokeLinecap="round" opacity="0.55" />}
          </g>
        );
      })}
      {conTexto && (
        <text x="150" y={abajo.y + abajo.h / 2 + 12} textAnchor="middle" fontFamily="Caveat, cursive" fontSize={abajo.w > 200 ? 26 : 23} fontWeight="600" fill={p.color === "chocolate" ? "#fbf4ec" : CACAO}>
          {p.texto.trim().slice(0, 22)}
        </text>
      )}
      {p.deco.includes("frutos") &&
        [-0.32, -0.16, 0, 0.16, 0.32].map((k, i) => (
          <g key={i} transform={`translate(${150 + k * arriba.w} ${arriba.y + (i % 2 ? 3 : -2)})`}>
            <circle r="8.5" fill={i % 2 ? "#4a2a5e" : FRESA} />
            <circle cx="-2.5" cy="-2.5" r="2" fill="#fff" opacity="0.5" />
            {i % 2 === 0 && <path d="M-4 -7 l4 -5 l4 5" fill="#4f7a3a" />}
          </g>
        ))}
      {p.deco.includes("flores") &&
        [
          [0.18, -4, 1.35],
          [0.3, 4, 1.05],
          [0.06, 5, 1],
        ].map(([k, dy, sc], i) => (
          <g key={i} transform={`translate(${150 + k * arriba.w} ${arriba.y + dy}) scale(${sc})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-7.5" rx="5.5" ry="8.5" fill={i === 0 ? "#fbf7f1" : ROSA} stroke={i === 0 ? "#eadfd2" : "#d99d95"} strokeWidth="0.8" transform={`rotate(${a})`} />
            ))}
            <circle r="3.8" fill="#d9a441" />
          </g>
        ))}
      {p.deco.includes("velas") &&
        [-0.14, 0.02].map((k) => (
          <g key={k} transform={`translate(${150 + k * arriba.w - (p.deco.includes("flores") ? 12 : 0)} ${arriba.y})`}>
            <rect x="-3" y="-34" width="6" height="34" rx="2.5" fill="#fdf9f3" stroke="#d8c9b8" />
            <path d="M-3 -26 l6 -4 M-3 -16 l6 -4 M-3 -6 l6 -4" stroke={FRESA} strokeWidth="1.5" />
            <path d="M0 -48 q6 7 0 12 q-6 -5 0 -12z" fill="#f0a23a" />
          </g>
        ))}
    </svg>
  );
}

/* ---------------- la página ---------------- */

export default function PasteleriaDemo() {
  const store = usePedidos();
  const [vista, setVista] = useState<"tienda" | "panel">(() => (location.hash === "#panel" ? "panel" : "tienda"));
  useEffect(() => {
    const cambio = () => setVista(location.hash === "#panel" ? "panel" : "tienda");
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", vista === "panel" ? "#panel" : location.pathname);
    document.title = vista === "panel" ? "Producción · Dulce Abril" : "Dulce Abril · Demo de Jzet Labs";
    window.scrollTo(0, 0);
  }, [vista]);

  return (
    <div className="min-h-screen" style={{ background: CREMA, color: CACAO }}>
      <BandaDemos />
      <div className="text-white" style={{ background: "#2b2622" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-2 text-[0.82rem] sm:justify-between">
          <p className="hidden text-white/65 sm:block">Dos partes: donde la clienta arma su pastel y lo que ve la pastelería.</p>
          <div className="flex rounded-full bg-white/10 p-0.5">
            {(
              [
                ["tienda", "Pastelería", CalendarDays],
                ["panel", "Producción", LayoutDashboard],
              ] as const
            ).map(([v, t, I]) => (
              <button key={v} type="button" onClick={() => setVista(v)} aria-pressed={vista === v} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition ${vista === v ? "bg-white text-black" : "text-white/80"}`}>
                <I size={14} /> {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      {vista === "tienda" ? <Tienda store={store} /> : <Produccion store={store} />}
      <CierreJzet demo="pastelería por encargo" />
    </div>
  );
}

function Tienda({ store }: { store: ReturnType<typeof usePedidos> }) {
  const [p, setP] = useState<Pastel>(PASTEL_INICIAL);
  const [fecha, setFecha] = useState("");
  const [horario, setHorario] = useState("");
  const [entrega, setEntrega] = useState("recoger");
  const [direccion, setDireccion] = useState("");
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [listo, setListo] = useState<Pedido | null>(null);
  const [texto, setTexto] = useState("");
  const [verMsg, setVerMsg] = useState(false);

  // la barrita del teléfono solo aparece mientras se está armando el pastel
  const [enArma, setEnArma] = useState(false);
  useEffect(() => {
    const el = document.getElementById("arma");
    const res = document.getElementById("resumen");
    if (!el) return;
    const vistos = new Map<Element, boolean>();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => vistos.set(e.target, e.isIntersecting));
      setEnArma(!!vistos.get(el) && !vistos.get(res as Element));
    });
    io.observe(el);
    if (res) io.observe(res);
    return () => io.disconnect();
  }, [listo]);
  const set = (x: Partial<Pastel>) => setP((v) => ({ ...v, ...x }));
  const toggle = (id: string) => set({ deco: p.deco.includes(id) ? p.deco.filter((d) => d !== id) : [...p.deco, id] });
  const precio = precioPastel(p);
  const envio = por(ENTREGAS, entrega).precio;
  const total = precio + envio;
  const anticipo = Math.round(total / 2);
  const minimo = anticipacion(p.tamano);
  const dias = useMemo(() => Array.from({ length: 21 }, (_, i) => masDias(i + 1)), []);
  useEffect(() => {
    // si cambia el tamaño y el día ya no alcanza, se quita
    if (fecha && dias.findIndex((d) => iso(d) === fecha) + 1 < minimo) setFecha("");
  }, [minimo, fecha, dias]);
  const valido = fecha && horario && nombre.trim().length > 1 && tel.replace(/\D/g, "").length === 8 && (entrega === "recoger" || direccion.trim().length > 4);

  const apartar = () => {
    if (!valido) return;
    const ped: Pedido = { id: `n${Date.now()}`, pastel: p, fecha, horario, entrega, direccion, nombre: nombre.trim(), tel: tel.replace(/\D/g, ""), total, anticipo, pagado: anticipo, estado: "por-hacer", nuevo: true };
    store.agregar(ped);
    setListo(ped);
    const t = por(TAMANOS, p.tamano);
    setVerMsg(true);
    setTexto(
      `Pedido nuevo para Dulce Abril:\nPastel ${t.nombre.toLowerCase()} (${t.porciones} porciones)\n${por(BIZCOCHOS, p.bizcocho).nombre} con ${por(RELLENOS, p.relleno).nombre.toLowerCase()}, ${por(COBERTURAS, p.cobertura).nombre.toLowerCase()} ${por(COLORES, p.color).nombre.toLowerCase()}\n${p.deco.length ? `Decoración: ${p.deco.map((d) => por(DECORACIONES, d).nombre.toLowerCase()).join(", ")}` : "Sin decoración"}${p.deco.includes("texto") && p.texto ? `\nTexto: "${p.texto}"` : ""}\n${fechaLarga(fecha)}, ${horario}\n${por(ENTREGAS, entrega).nombre}${direccion ? `: ${direccion}` : ""}\nTotal ${qz(total)} · anticipo ${qz(anticipo)}\n${nombre.trim()}, ${tel}`,
    );
  };

  const chip = (on: boolean) => (on ? { background: CACAO, borderColor: CACAO, color: "#fff" } : { borderColor: "rgba(59,38,32,.2)", background: "#fff" });
  const titulo = "text-[2.2rem] leading-tight sm:text-[2.8rem]";

  return (
    <>
      <header className="sticky top-0 z-30 border-b backdrop-blur" style={{ borderColor: LINEA, background: "rgba(251,244,236,.94)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#inicio" className="leading-none">
            <span className="block text-[1.6rem] font-semibold italic" style={{ fontFamily: SERIF }}>Dulce Abril</span>
            <span className="block text-[0.72rem] opacity-60">pastelería por encargo</span>
          </a>
          <nav className="hidden gap-7 md:flex">
            <a href="#arma" className="hover:opacity-60">Arma tu pastel</a>
            <a href="#hoy" className="hover:opacity-60">Postres de hoy</a>
            <a href="#como" className="hover:opacity-60">Cómo pedir</a>
          </nav>
          <a href="#arma" className={`${btn} !px-5 !py-2.5 text-white`} style={{ background: FRESA }}>
            Pedir
          </a>
        </div>
      </header>

      {/* portada */}
      <section id="inicio" className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.1fr_1fr] md:items-center md:py-20">
        <div>
          <p className="font-semibold" style={{ color: FRESA }}>Pasteles hechos a mano en zona 13</p>
          <h1 className="mt-3 text-[2.8rem] font-semibold leading-[1.03] sm:text-[3.9rem]" style={{ fontFamily: SERIF }}>
            Arma tu pastel y ve el precio al instante.
          </h1>
          <p className="mt-5 max-w-lg text-[1.12rem] leading-relaxed opacity-80">
            Eliges tamaño, sabor, relleno y decoración, y lo vas viendo dibujado. Escoges un día con cupo y lo apartas con la mitad. Sin esperar a que te coticen por mensaje.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#arma" className={`${btn} text-white`} style={{ background: CACAO }}>
              Armar mi pastel <ArrowRight size={18} />
            </a>
            <a href="#hoy" className={`${btn} border-2`} style={{ borderColor: CACAO }}>
              Postres para hoy
            </a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[420px] rounded-[2rem] p-6" style={{ background: "#f3e4d8" }}>
          <DibujoPastel p={PASTEL_INICIAL} ancho={400} />
          <p className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-2 text-[0.98rem] font-semibold shadow-sm">
            20 porciones · {qz(precioPastel(PASTEL_INICIAL))}
          </p>
        </div>
      </section>

      {/* armar */}
      <section id="arma" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h2 className={titulo} style={{ fontFamily: SERIF }}>Arma tu pastel</h2>
          {listo ? (
            <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
              <DibujoPastel p={listo.pastel} ancho={340} />
              <div>
                <p className="text-[1.9rem] leading-tight" style={{ fontFamily: SERIF }}>¡Listo, {listo.nombre.split(" ")[0]}! Tu pastel quedó apartado.</p>
                <p className="mt-3 text-[1.08rem]">
                  {fechaLarga(listo.fecha)}, {listo.horario} · {por(ENTREGAS, listo.entrega).nombre}
                </p>
                <p className="mt-2 opacity-75">
                  Total {qz(listo.total)}. Para confirmarlo te mandamos los datos para el anticipo de {qz(listo.anticipo)}; el resto lo pagas al recibirlo.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={() => setVerMsg(true)} className={`${btn} border-2`} style={{ borderColor: CACAO }}>
                    Ver lo que le llega a la pastelería
                  </button>
                  <button type="button" onClick={() => { setListo(null); setFecha(""); setHorario(""); }} className={`${btn} text-white`} style={{ background: CACAO }}>
                    Armar otro
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div className="grid gap-9">
                <div>
                  <p className="text-[1.15rem] font-semibold">1. Tamaño</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {TAMANOS.map((t) => (
                      <button key={t.id} type="button" onClick={() => set({ tamano: t.id })} className="border-2 p-4 text-left" style={chip(p.tamano === t.id)}>
                        <b className="block text-[1.1rem]">{t.nombre}</b>
                        <span className="text-[0.92rem] opacity-75">{t.nota}</span>
                        <span className="mt-1 block font-semibold">desde {qz(t.precio)}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {(
                  [
                    ["2. Bizcocho", BIZCOCHOS, "bizcocho"],
                    ["3. Relleno", RELLENOS, "relleno"],
                  ] as const
                ).map(([t, lista, campo]) => (
                  <div key={campo}>
                    <p className="text-[1.15rem] font-semibold">{t}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lista.map((o) => (
                        <button key={o.id} type="button" onClick={() => set({ [campo]: o.id } as Partial<Pastel>)} className="rounded-full border-2 px-4 py-2 font-medium" style={chip(p[campo] === o.id)}>
                          {o.nombre}
                          {o.precio > 0 && <span className="ml-1 opacity-70">+{qz(o.precio)}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div>
                  <p className="text-[1.15rem] font-semibold">4. Cobertura y color</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {COBERTURAS.map((c) => (
                      <button key={c.id} type="button" onClick={() => set({ cobertura: c.id })} className="border-2 p-3 text-left" style={chip(p.cobertura === c.id)}>
                        <b className="block">
                          {c.nombre} {c.precio > 0 && <span className="font-normal opacity-70">+{qz(c.precio)}</span>}
                        </b>
                        <span className="text-[0.9rem] opacity-75">{c.nota}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {COLORES.map((c) => (
                      <button key={c.id} type="button" aria-pressed={p.color === c.id} onClick={() => set({ color: c.id })} className="flex flex-col items-center gap-1">
                        <span className="h-11 w-11 rounded-full" style={{ background: c.hex, boxShadow: p.color === c.id ? `0 0 0 3px #fff, 0 0 0 5px ${CACAO}` : "inset 0 0 0 1px rgba(0,0,0,.12)" }} />
                        <span className={`text-[0.85rem] ${p.color === c.id ? "font-semibold" : "opacity-70"}`}>{c.nombre}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[1.15rem] font-semibold">5. Decoración</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {DECORACIONES.map((d) => (
                      <button key={d.id} type="button" aria-pressed={p.deco.includes(d.id)} onClick={() => toggle(d.id)} className="inline-flex items-center gap-1 rounded-full border-2 px-4 py-2 font-medium" style={chip(p.deco.includes(d.id))}>
                        {p.deco.includes(d.id) && <Check size={15} strokeWidth={3} />} {d.nombre} <span className="opacity-70">+{qz(d.precio)}</span>
                      </button>
                    ))}
                  </div>
                  {p.deco.includes("texto") && (
                    <input value={p.texto} onChange={(e) => set({ texto: e.target.value.slice(0, 22) })} placeholder="¿Qué quieres que diga?" className="mt-3 w-full rounded-md border-2 border-black/20 bg-white px-4 py-3 text-[1.05rem] outline-none focus:border-black/70" />
                  )}
                </div>

                {/* día, entrega y datos */}
                <div>
                  <p className="text-[1.15rem] font-semibold">6. ¿Para cuándo?</p>
                  <p className="text-[0.95rem] opacity-65">
                    Este tamaño se pide con {minimo} días de anticipación. Hacemos {CUPO_DIA} pasteles por día.
                  </p>
                  <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
                    {dias.map((d, i) => {
                      const f = iso(d);
                      const llenos = ocupados(store.pedidos, f);
                      const quedan = CUPO_DIA - llenos;
                      const muyPronto = i + 1 < minimo;
                      const cerrado = d.getDay() === 1;
                      const off = muyPronto || cerrado || quedan <= 0;
                      return (
                        <button key={f} type="button" disabled={off} onClick={() => setFecha(f)} className="border-2 py-2 text-center disabled:opacity-35" style={chip(fecha === f)}>
                          <span className="block text-[0.8rem] opacity-70">{DIAS[d.getDay()]}</span>
                          <span className="block text-[1.25rem]" style={{ fontFamily: SERIF }}>{d.getDate()}</span>
                          <span className="block text-[0.7rem]">{cerrado ? "cerrado" : muyPronto ? "muy pronto" : quedan <= 0 ? "lleno" : quedan <= 2 ? `quedan ${quedan}` : "libre"}</span>
                        </button>
                      );
                    })}
                  </div>
                  {fecha && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {HORARIOS.map((h) => (
                        <button key={h} type="button" onClick={() => setHorario(h)} className="rounded-full border-2 px-4 py-2 font-medium" style={chip(horario === h)}>
                          {h}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[1.15rem] font-semibold">7. ¿Cómo te lo llevamos?</p>
                  <div className="mt-3 grid gap-2">
                    {ENTREGAS.map((e) => (
                      <button key={e.id} type="button" onClick={() => setEntrega(e.id)} className="flex items-center justify-between gap-3 border-2 px-4 py-3 text-left" style={chip(entrega === e.id)}>
                        <span>
                          <b className="block">{e.nombre}</b>
                          <span className="text-[0.9rem] opacity-75">{e.nota}</span>
                        </span>
                        <span className="shrink-0">{e.precio ? qz(e.precio) : "Sin costo"}</span>
                      </button>
                    ))}
                  </div>
                  {entrega !== "recoger" && <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección de entrega" className="mt-3 w-full rounded-md border-2 border-black/20 bg-white px-4 py-3 text-[1.05rem] outline-none focus:border-black/70" />}
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" autoComplete="name" className="rounded-md border-2 border-black/20 bg-white px-4 py-3 text-[1.05rem] outline-none focus:border-black/70" />
                    <input value={tel} onChange={(e) => setTel(e.target.value.replace(/[^\d ]/g, "").slice(0, 9))} placeholder="Tu WhatsApp" inputMode="numeric" autoComplete="tel" className="rounded-md border-2 border-black/20 bg-white px-4 py-3 text-[1.05rem] outline-none focus:border-black/70" />
                  </div>
                </div>
              </div>

              {/* resumen que acompaña */}
              <aside id="resumen" className="scroll-mt-20 self-start lg:sticky lg:top-24">
                <div className="rounded-[1.6rem] p-5" style={{ background: "#f3e4d8" }}>
                  <DibujoPastel p={p} ancho={360} />
                </div>
                <dl className="mt-5 grid gap-1.5 text-[1rem]">
                  <div className="flex justify-between">
                    <dt className="opacity-70">Pastel {por(TAMANOS, p.tamano).nombre.toLowerCase()}</dt>
                    <dd>{qz(precio)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="opacity-70">{por(ENTREGAS, entrega).nombre}</dt>
                    <dd>{envio ? qz(envio) : "Sin costo"}</dd>
                  </div>
                  <div className="mt-1 flex justify-between border-t pt-2 text-[1.3rem] font-semibold" style={{ borderColor: CACAO }}>
                    <dt>Total</dt>
                    <dd style={{ fontFamily: SERIF }}>{qz(total)}</dd>
                  </div>
                  <div className="flex justify-between" style={{ color: FRESA }}>
                    <dt>Para apartar (50%)</dt>
                    <dd className="font-semibold">{qz(anticipo)}</dd>
                  </div>
                </dl>
                <p className="mt-2 text-[0.92rem] opacity-65">
                  {fecha ? `${fechaLarga(fecha)}${horario ? `, ${horario}` : ""}` : "Elige el día para apartarlo."}
                </p>
                <button type="button" disabled={!valido} onClick={apartar} className={`${btn} mt-4 w-full text-white disabled:opacity-40`} style={{ background: FRESA }}>
                  Apartar con {qz(anticipo)}
                </button>
              </aside>
            </div>
          )}
        </div>
        {!listo && enArma && (
          <a href="#resumen" className="fixed inset-x-3 bottom-3 z-30 flex items-center gap-3 rounded-2xl bg-white p-2 pr-4 shadow-[0_12px_30px_-12px_rgba(0,0,0,.45)] lg:hidden">
            <span className="w-14 shrink-0 rounded-xl p-1" style={{ background: "#f3e4d8" }}>
              <DibujoPastel p={p} ancho={52} />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <b className="block">{qz(total)}</b>
              <span className="text-[0.88rem] opacity-65">Apartas con {qz(anticipo)}</span>
            </span>
            <span className="shrink-0 font-semibold" style={{ color: FRESA }}>Ver mi pastel</span>
          </a>
        )}
        <MensajeWhatsApp mensaje={listo && verMsg ? texto : null} alCerrar={() => setVerMsg(false)} demo="pastelería por encargo" que="cada pedido" />
      </section>

      {/* postres listos */}
      <section id="hoy" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:py-20">
        <h2 className={titulo} style={{ fontFamily: SERIF }}>Para hoy, sin encargar</h2>
        <p className="mt-2 opacity-70">Lo que salió del horno esta mañana. Pasa a recogerlo o pide que te lo llevemos.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POSTRES.map((x) => (
            <article key={x.id} className={`border-t-2 bg-white p-5 ${x.quedan ? "" : "opacity-55"}`} style={{ borderColor: CACAO }}>
              <h3 className="text-[1.25rem] leading-tight" style={{ fontFamily: SERIF }}>{x.nombre}</h3>
              <p className="mt-1 opacity-70">{x.nota}</p>
              <p className="mt-3 text-[1.3rem] font-semibold">{qz(x.precio)}</p>
              <p className="mt-1 text-[0.95rem]" style={{ color: x.quedan && x.quedan <= 3 ? FRESA : undefined }}>
                {x.quedan ? (x.quedan <= 3 ? `Quedan ${x.quedan}` : "Hay hoy") : "Se acabó por hoy"}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* cómo pedir */}
      <section id="como" className="scroll-mt-20 text-white" style={{ background: CACAO }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-20">
          <div>
            <h2 className={`${titulo} !text-white`} style={{ fontFamily: SERIF }}>Cómo pedir</h2>
            <ol className="mt-6 grid gap-4 text-[1.05rem]">
              {["Arma tu pastel y mira el precio.", "Elige un día con cupo y cómo te lo llevamos.", "Apártalo con la mitad por transferencia.", "El resto lo pagas al recibirlo."].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 font-semibold">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
          </div>
          <dl className="grid content-start gap-5 text-[1.02rem]">
            {[
              [Clock, "Anticipación", "Pasteles de 1 piso, 3 días antes. De 2 y 3 pisos, 5 días antes."],
              [CalendarDays, "Cambios", "Hasta 48 horas antes de la entrega, sin costo."],
              [Truck, "Entregas", "En furgón refrigerado, en el horario que elijas."],
              [MapPin, "Tienda", "15 avenida 10-20, zona 13. Martes a domingo, 9:00 a 18:00."],
            ].map(([I, t, d]) => {
              const Icono = I as typeof Clock;
              return (
                <div key={t as string} className="flex gap-3">
                  <Icono size={22} className="mt-0.5 shrink-0 text-white/70" />
                  <div>
                    <dt className="font-semibold">{t as string}</dt>
                    <dd className="text-white/75">{d as string}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-3 md:py-20">
        {OPINIONES.map((o) => (
          <figure key={o.quien} className="border-t-2 pt-4" style={{ borderColor: CACAO }}>
            <blockquote className="text-[1.1rem] leading-relaxed">“{o.d}”</blockquote>
            <figcaption className="mt-3 text-[0.95rem] opacity-60">{o.quien}</figcaption>
          </figure>
        ))}
      </section>
    </>
  );
}

/* ---------------- lo que ve la pastelería ---------------- */

function Produccion({ store }: { store: ReturnType<typeof usePedidos> }) {
  const { pedidos, cambiar } = store;
  const hoy = iso(masDias(0));
  const semana = Array.from({ length: 7 }, (_, i) => iso(masDias(i)));
  const enSemana = pedidos.filter((x) => semana.includes(x.fecha));
  const cobrado = pedidos.reduce((t, x) => t + x.pagado, 0);
  const porCobrar = pedidos.filter((x) => x.estado !== "entregado" || x.pagado < x.total).reduce((t, x) => t + (x.total - x.pagado), 0);
  const proximos = pedidos.filter((x) => x.fecha >= hoy && x.fecha <= iso(masDias(2)) && x.estado === "por-hacer");
  const hornear = BIZCOCHOS.map((b) => {
    const de = proximos.filter((x) => x.pastel.bizcocho === b.id);
    return { b, n: de.length, porciones: de.reduce((t, x) => t + por(TAMANOS, x.pastel.tamano).porciones, 0) };
  }).filter((x) => x.n);
  const h2 = "text-[1.7rem] leading-tight";

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-8">
      <p className="opacity-65">{fechaLarga(hoy).replace(/^./, (x) => x.toUpperCase())}</p>
      <h1 className="mt-1 text-[2.8rem] font-semibold leading-none" style={{ fontFamily: SERIF }}>Producción</h1>

      <div className="mt-8 grid grid-cols-2 border-y md:grid-cols-4" style={{ borderColor: CACAO }}>
        {[
          [String(enSemana.length), "pasteles esta semana"],
          [String(pedidos.filter((x) => x.fecha === hoy).length), "salen hoy"],
          [qz(cobrado), "cobrado en anticipos y pagos"],
          [qz(porCobrar), "falta cobrar al entregar"],
        ].map(([n, t], i) => (
          <div key={t} className={`px-3 py-4 ${i % 2 ? "border-l" : ""} ${i === 2 ? "md:border-l" : ""}`} style={{ borderColor: LINEA }}>
            <p className="text-[1.9rem] leading-none" style={{ fontFamily: SERIF }}>{n}</p>
            <p className="mt-1.5 text-[0.95rem] opacity-65">{t}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <section className="min-w-0">
          <h2 className={h2} style={{ fontFamily: SERIF }}>Los próximos 7 días</h2>
          <div className="mt-4 grid gap-8">
            {semana.map((f) => {
              const del = pedidos.filter((x) => x.fecha === f).sort((a, b) => a.horario.localeCompare(b.horario));
              const usados = ocupados(pedidos, f);
              return (
                <div key={f}>
                  <div className="flex items-baseline justify-between gap-3 border-b-2 pb-2" style={{ borderColor: CACAO }}>
                    <b className="text-[1.1rem]">{f === hoy ? "Hoy" : fechaLarga(f)}</b>
                    <span className="text-[0.92rem] opacity-65">
                      {Math.min(usados, CUPO_DIA)} de {CUPO_DIA} cupos
                    </span>
                  </div>
                  {del.length === 0 ? (
                    <p className="py-3 text-[0.95rem] opacity-55">Sin pedidos en línea (los de teléfono cuentan en el cupo).</p>
                  ) : (
                    <ul>
                      {del.map((x) => {
                        const t = por(TAMANOS, x.pastel.tamano);
                        const saldo = x.total - x.pagado;
                        return (
                          <li key={x.id} className="grid gap-3 border-b py-3 sm:grid-cols-[4.5rem_1fr_auto] sm:items-center" style={{ borderColor: LINEA }}>
                            <div className="w-[4.5rem]">
                              <DibujoPastel p={x.pastel} ancho={72} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold">
                                {x.nombre} {x.nuevo && <span className="ml-1 rounded-full px-2 py-0.5 text-[0.72rem] text-white" style={{ background: FRESA }}>pidió en línea</span>}
                              </p>
                              <p className="text-[0.95rem] opacity-75">
                                {t.porciones} porciones · {por(BIZCOCHOS, x.pastel.bizcocho).nombre} con {por(RELLENOS, x.pastel.relleno).nombre.toLowerCase()} · {por(COLORES, x.pastel.color).nombre.toLowerCase()}
                                {x.pastel.deco.includes("texto") && x.pastel.texto ? ` · “${x.pastel.texto}”` : ""}
                              </p>
                              <p className="text-[0.9rem] opacity-60">
                                {x.horario} · {por(ENTREGAS, x.entrega).nombre}
                                {x.direccion ? `: ${x.direccion}` : ""} · {saldo > 0 ? `falta ${qz(saldo)}` : "pagado"}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {x.estado === "por-hacer" && (
                                <button type="button" onClick={() => cambiar(x.id, { estado: "listo" })} className="rounded-full border-2 px-3.5 py-1.5 text-[0.95rem] font-semibold" style={{ borderColor: CACAO }}>
                                  Ya está listo
                                </button>
                              )}
                              {x.estado === "listo" && (
                                <button type="button" onClick={() => cambiar(x.id, { estado: "entregado", pagado: x.total })} className="rounded-full px-3.5 py-1.5 text-[0.95rem] font-semibold text-white" style={{ background: FRESA }}>
                                  Entregado y pagado
                                </button>
                              )}
                              {x.estado === "entregado" && (
                                <span className="inline-flex items-center gap-1 text-[0.95rem] font-semibold" style={{ color: "#3f7a4b" }}>
                                  <Check size={16} /> Entregado
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <aside className="grid min-w-0 content-start gap-12">
          <section>
            <h2 className={h2} style={{ fontFamily: SERIF }}>Qué hornear (3 días)</h2>
            <p className="mt-1 text-[0.98rem] opacity-60">Los pasteles por hacer de hoy a pasado mañana, por sabor.</p>
            <ul className="mt-3 border-t" style={{ borderColor: LINEA }}>
              {hornear.map(({ b, n, porciones }) => (
                <li key={b.id} className="flex items-baseline justify-between gap-3 border-b py-3" style={{ borderColor: LINEA }}>
                  <b>{b.nombre}</b>
                  <span className="opacity-75">
                    {n} {n === 1 ? "pastel" : "pasteles"} · {porciones} porciones
                  </span>
                </li>
              ))}
              {hornear.length === 0 && <li className="py-3 opacity-60">Nada pendiente.</li>}
            </ul>
          </section>
          <section>
            <h2 className={h2} style={{ fontFamily: SERIF }}>Entregas de hoy</h2>
            <ul className="mt-3 border-t" style={{ borderColor: LINEA }}>
              {pedidos
                .filter((x) => x.fecha === hoy && x.entrega !== "recoger")
                .map((x) => (
                  <li key={x.id} className="border-b py-3" style={{ borderColor: LINEA }}>
                    <b className="block">{x.horario}</b>
                    <span className="text-[0.95rem] opacity-75">
                      {x.nombre} · {x.direccion}
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
