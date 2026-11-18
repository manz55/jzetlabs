/*
 * Demo: restaurante "Trattoria Sole" (negocio inventado, datos de ejemplo).
 * Diseño propio, como una carta impresa: portada con el plato al centro,
 * aviso de "abierto ahora", platillo del día, menú por secciones con precios
 * de carta, pedido para llevar o a domicilio, reservación de mesa y ubicación.
 * Fotos libres de Unsplash (src/assets/demo-tienda).
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock, Leaf, MapPin, Phone, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import comidaHero from "@/assets/demo-tienda/comida-hero.jpg";
import comida1 from "@/assets/demo-tienda/comida-1.jpg";
import comida2 from "@/assets/demo-tienda/comida-2.jpg";
import comida3 from "@/assets/demo-tienda/comida-3.jpg";
import comida4 from "@/assets/demo-tienda/comida-4.jpg";
import comida5 from "@/assets/demo-tienda/comida-5.jpg";
import comida6 from "@/assets/demo-tienda/comida-6.jpg";
import { BandaDemos, CierreJzet, Contador, MensajeWhatsApp, qz } from "../comun";

const PAPEL = "#fbe7a8";
const TINTA = "#2b1d16";
const TOMATE = "#c4352a";
const OLIVA = "#5f6b3a";
const SERIF = '"Fraunces", Georgia, serif';

type Platillo = { id: string; nombre: string; detalle: string; precio: number; foto?: string; veg?: boolean };
type Seccion = { id: string; nombre: string; nota: string; platillos: Platillo[] };

const MENU: Seccion[] = [
  {
    id: "entradas",
    nombre: "Entradas",
    nota: "Para compartir mientras llega la pasta.",
    platillos: [
      { id: "bruschetta", nombre: "Bruschetta de tomate", detalle: "Pan tostado, tomate, ajo y albahaca", precio: 45, veg: true },
      { id: "caprese", nombre: "Ensalada caprese", detalle: "Tomate, mozzarella fresca y albahaca", precio: 65, foto: comida5, veg: true },
      { id: "pan-ajo", nombre: "Pan de ajo con queso", detalle: "Recién salido del horno", precio: 35, veg: true },
    ],
  },
  {
    id: "pastas",
    nombre: "Pastas",
    nota: "Pasta fresca, hecha cada mañana.",
    platillos: [
      { id: "bolonesa", nombre: "Penne a la boloñesa", detalle: "Salsa de carne cocida 4 horas", precio: 95, foto: comida1 },
      { id: "pomodoro", nombre: "Spaghetti pomodoro", detalle: "Tomate, albahaca y parmesano", precio: 85, foto: comida2, veg: true },
      { id: "pesto", nombre: "Pasta al pesto", detalle: "Albahaca, nueces y queso", precio: 89, foto: comida3, veg: true },
      { id: "alfredo", nombre: "Fettuccine Alfredo con pollo", detalle: "Crema, mantequilla y parmesano", precio: 105 },
    ],
  },
  {
    id: "pizzas",
    nombre: "Pizzas",
    nota: "Masa madre, horno de leña. 30 cm.",
    platillos: [
      { id: "margarita", nombre: "Margarita", detalle: "Tomate, mozzarella y albahaca", precio: 110, foto: comida4, veg: true },
      { id: "pepperoni", nombre: "Pepperoni", detalle: "Con orégano y un toque de chile", precio: 120 },
      { id: "quesos", nombre: "Cuatro quesos", detalle: "Mozzarella, parmesano, gorgonzola y ricota", precio: 125, veg: true },
    ],
  },
  {
    id: "postres",
    nombre: "Postres",
    nota: "Hechos en casa.",
    platillos: [
      { id: "yogur", nombre: "Yogur con frutos rojos", detalle: "Con granola de la casa", precio: 35, foto: comida6, veg: true },
      { id: "tiramisu", nombre: "Tiramisú", detalle: "Café, mascarpone y cacao", precio: 45, veg: true },
      { id: "pannacotta", nombre: "Panna cotta", detalle: "Con salsa de mora", precio: 40, veg: true },
    ],
  },
  {
    id: "bebidas",
    nombre: "Bebidas",
    nota: "Frías o calientes.",
    platillos: [
      { id: "limonada", nombre: "Limonada con hierbabuena", detalle: "Vaso de 16 oz", precio: 20, veg: true },
      { id: "te", nombre: "Té frío de la casa", detalle: "Jamaica y limón", precio: 18, veg: true },
      { id: "cafe", nombre: "Café americano", detalle: "Café de Huehuetenango", precio: 15, veg: true },
      { id: "agua", nombre: "Agua pura", detalle: "500 ml", precio: 10, veg: true },
    ],
  },
];

const DEL_DIA: Platillo = { id: "del-dia", nombre: "Pappardelle con hongos", detalle: "Hongos salteados, salvia y parmesano. Solo hoy, hasta agotar.", precio: 98, foto: comidaHero, veg: true };

/* horario de ejemplo: martes a domingo, 12:00 a 22:00 */
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
function abiertoAhora(d = new Date()) {
  if (d.getDay() === 1) return false;
  const h = d.getHours() + d.getMinutes() / 60;
  return h >= 12 && h < 22;
}

const HORAS = Array.from({ length: 19 }, (_, i) => {
  const m = 12 * 60 + i * 30;
  return `${Math.floor(m / 60)}:${m % 60 === 0 ? "00" : "30"}`;
});

type Linea = { p: Platillo; cantidad: number };

export default function RestauranteDemo() {
  const [pedido, setPedido] = useState<Linea[]>([]);
  const [verPedido, setVerPedido] = useState(false);
  const [modo, setModo] = useState<"llevar" | "domicilio">("llevar");
  const [notas, setNotas] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [que, setQue] = useState("el pedido");
  const [seccion, setSeccion] = useState(MENU[0].id);
  const abierto = useMemo(() => abiertoAhora(), []);

  useEffect(() => {
    document.title = "Trattoria Sole · Demo de Jzet Labs";
  }, []);

  // marca en las pestañas la sección del menú que se está viendo
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setSeccion(e.target.id.replace("menu-", ""))),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    MENU.forEach((s) => {
      const el = document.getElementById(`menu-${s.id}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const platos = pedido.reduce((s, l) => s + l.cantidad, 0);
  const subtotal = pedido.reduce((s, l) => s + l.p.precio * l.cantidad, 0);
  const envio = modo === "domicilio" ? 20 : 0;

  function agregar(p: Platillo) {
    setPedido((ped) => {
      const i = ped.findIndex((l) => l.p.id === p.id);
      if (i >= 0) return ped.map((l, k) => (k === i ? { ...l, cantidad: l.cantidad + 1 } : l));
      return [...ped, { p, cantidad: 1 }];
    });
  }

  function cambiar(id: string, v: number) {
    setPedido((ped) => (v <= 0 ? ped.filter((l) => l.p.id !== id) : ped.map((l) => (l.p.id === id ? { ...l, cantidad: v } : l))));
  }

  function enviarPedido() {
    const lineas = pedido.map((l) => `• ${l.cantidad} × ${l.p.nombre} — ${qz(l.p.precio * l.cantidad)}`);
    setVerPedido(false);
    setQue("el pedido");
    setMensaje(
      `Hola, Trattoria Sole. Quiero pedir ${modo === "llevar" ? "para llevar" : "a domicilio"}:\n${lineas.join("\n")}${envio ? `\nEnvío: ${qz(envio)}` : ""}\nTotal: ${qz(subtotal + envio)}${notas.trim() ? `\nNotas: ${notas.trim()}` : ""}`,
    );
  }

  return (
    <div style={{ background: PAPEL, color: TINTA }} className="min-h-screen">
      <BandaDemos />

      {/* encabezado */}
      <header className="border-b border-[#2b1d16]/15">
        <div className="mx-auto max-w-6xl px-5 h-[72px] grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <nav className="hidden sm:flex gap-6 text-[0.92rem]">
            <a href="#menu" className="hover:underline underline-offset-4">
              Menú
            </a>
            <a href="#reservar" className="hover:underline underline-offset-4">
              Reservar
            </a>
            <a href="#ubicacion" className="hover:underline underline-offset-4">
              Ubicación
            </a>
          </nav>
          <a href="#inicio" className="col-span-2 sm:col-span-1 sm:col-start-2 text-left sm:text-center leading-none">
            <span className="block whitespace-nowrap text-[1.3rem] sm:text-[1.5rem] font-semibold italic" style={{ fontFamily: SERIF }}>
              Trattoria Sole
            </span>
            <span className="block mt-1 text-[0.65rem] uppercase tracking-[0.22em] opacity-60">Cocina italiana</span>
          </a>
          <div className="flex justify-end">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.78rem] font-semibold ${abierto ? "bg-[#5f6b3a]/12 text-[#4b5530]" : "bg-[#c4352a]/10 text-[#8f2e21]"}`}>
              <span className={`w-2 h-2 rounded-full ${abierto ? "bg-[#5f6b3a]" : "bg-[#c4352a]"}`} />
              {abierto ? "Abierto ahora" : "Cerrado ahora"}
            </span>
          </div>
        </div>
      </header>
      <div aria-hidden className="h-5" style={{ background: "linear-gradient(90deg, rgba(196,53,42,.55) 50%, transparent 0) 0 0/20px 20px, linear-gradient(rgba(196,53,42,.55) 50%, transparent 0) 0 0/20px 20px, #fbe7a8" }} />

      {/* portada: el plato al centro */}
      <section id="inicio" className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pt-12 pb-16 sm:pt-16 sm:pb-20 text-center">
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.24em]" style={{ color: TOMATE }}>
            Desde 2019 · Zona 10
          </p>
          <h1 className="mt-4 !text-[#2b1d16] text-[2.8rem] sm:text-[4.4rem] leading-[1] tracking-[-0.02em] font-semibold" style={{ fontFamily: SERIF }}>
            Pasta fresca,
            <br />
            <span className="italic font-normal" style={{ color: TOMATE }}>
              hecha cada mañana
            </span>
          </h1>
          <div className="relative mx-auto mt-10 w-[min(78vw,380px)] aspect-square">
            <div className="absolute inset-[-14px] rounded-full border border-dashed border-[#2b1d16]/25" />
            <img src={comida1} alt="Plato de penne a la boloñesa visto desde arriba" className="plato-gira w-full h-full rounded-full object-cover shadow-[0_30px_60px_-30px_rgba(43,29,22,.6)]" />
            <span className="absolute -right-2 sm:-right-10 top-6 rotate-6 rounded-full px-4 py-2 text-white text-[0.85rem] font-semibold shadow-lg" style={{ background: TOMATE, fontFamily: SERIF }}>
              Penne · Q95
            </span>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="#menu" className="rounded-full px-6 py-3.5 text-white font-semibold active:scale-[0.97] transition" style={{ background: TOMATE }}>
              Pedir para llevar
            </a>
            <a href="#reservar" className="rounded-full border border-[#2b1d16]/25 px-6 py-3.5 font-semibold hover:border-[#2b1d16] active:scale-[0.97] transition">
              Reservar mesa
            </a>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-[0.9rem] opacity-75">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} /> Mar a dom, 12:00 a 22:00
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} /> Zona 10, Ciudad de Guatemala
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone size={15} /> 2222-0000 (de ejemplo)
            </span>
          </div>
        </div>
      </section>

      {/* platillo del día */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="grid md:grid-cols-[1.1fr_1fr] overflow-hidden rounded-[1.5rem] bg-[#2b1d16] text-[#fbe7a8]">
          <img src={DEL_DIA.foto} alt={DEL_DIA.nombre} className="w-full h-full min-h-[240px] object-cover" loading="lazy" />
          <div className="p-7 sm:p-10 flex flex-col justify-center">
            <span className="w-fit rounded-full bg-[#fbe7a8] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.16em]" style={{ color: TOMATE }}>
              Hoy
            </span>
            <h2 className="mt-4 !text-[#fbe7a8] text-[2rem] sm:text-[2.6rem] leading-tight font-semibold" style={{ fontFamily: SERIF }}>
              {DEL_DIA.nombre}
            </h2>
            <p className="mt-3 text-[#fbe7a8]/75">{DEL_DIA.detalle}</p>
            <div className="mt-6 flex items-center gap-5">
              <span className="text-[1.6rem] font-semibold" style={{ fontFamily: SERIF }}>
                {qz(DEL_DIA.precio)}
              </span>
              <button type="button" onClick={() => agregar(DEL_DIA)} className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-semibold text-white active:scale-95 transition" style={{ background: TOMATE }}>
                <Plus size={16} /> Agregar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* menú */}
      <section id="menu" className="scroll-mt-4 mx-auto max-w-6xl px-5 pt-20 sm:pt-28 pb-10">
        <div className="text-center">
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.24em]" style={{ color: TOMATE }}>
            La carta
          </p>
          <h2 className="mt-3 !text-[#2b1d16] text-[2.6rem] sm:text-[3.4rem] font-semibold" style={{ fontFamily: SERIF }}>
            Menú
          </h2>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm opacity-70">
            <Leaf size={14} style={{ color: OLIVA }} /> = vegetariano · Precios de ejemplo, en quetzales
          </p>
        </div>

        <nav className="sticky top-0 z-20 mt-8 -mx-5 px-5 py-3 bg-[#fbe7a8]/95 backdrop-blur border-y border-[#2b1d16]/10 overflow-x-auto [scrollbar-width:none]" aria-label="Secciones del menú">
          <div className="mx-auto flex w-fit gap-1.5">
            {MENU.map((s) => (
              <a
                key={s.id}
                href={`#menu-${s.id}`}
                aria-current={seccion === s.id ? "true" : undefined}
                className={`shrink-0 rounded-full px-4 py-1.5 text-[0.92rem] font-semibold transition ${seccion === s.id ? "text-white" : "hover:bg-[#2b1d16]/5"}`}
                style={seccion === s.id ? { background: TINTA } : undefined}
              >
                {s.nombre}
              </a>
            ))}
          </div>
        </nav>

        <div className="mt-6 max-w-3xl mx-auto">
          {MENU.map((s) => (
            <div key={s.id} id={`menu-${s.id}`} className="scroll-mt-20 pt-10">
              <div className="flex items-baseline justify-between gap-4 border-b-2 border-[#2b1d16] pb-2">
                <h3 className="!text-[#2b1d16] text-[1.9rem] font-semibold italic" style={{ fontFamily: SERIF }}>
                  {s.nombre}
                </h3>
                <p className="text-sm opacity-60 text-right">{s.nota}</p>
              </div>
              <ul>
                {s.platillos.map((p) => {
                  const enPedido = pedido.find((l) => l.p.id === p.id)?.cantidad ?? 0;
                  return (
                    <li key={p.id} className="flex gap-4 py-4 border-b border-dashed border-[#2b1d16]/20">
                      {p.foto && <img src={p.foto} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shrink-0" loading="lazy" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <p className="font-semibold text-[1.08rem]" style={{ fontFamily: SERIF }}>
                            {p.nombre}
                          </p>
                          {p.veg && <Leaf size={14} className="shrink-0" style={{ color: OLIVA }} aria-label="Vegetariano" />}
                          <span className="flex-1 border-b border-dotted border-[#2b1d16]/35 translate-y-[-4px]" aria-hidden />
                          <span className="font-semibold tabular-nums" style={{ fontFamily: SERIF }}>
                            {qz(p.precio)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[0.92rem] italic opacity-70">{p.detalle}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => agregar(p)}
                        aria-label={`Agregar ${p.nombre}`}
                        className="self-center grid place-items-center w-10 h-10 shrink-0 rounded-full border border-[#2b1d16]/25 hover:text-white hover:border-transparent active:scale-90 transition relative"
                        style={enPedido ? { background: TOMATE, color: "#fff", borderColor: "transparent" } : undefined}
                        onMouseEnter={(e) => !enPedido && (e.currentTarget.style.background = TOMATE)}
                        onMouseLeave={(e) => !enPedido && (e.currentTarget.style.background = "")}
                      >
                        {enPedido ? <span className="text-sm font-bold">{enPedido}</span> : <Plus size={17} />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Reservar
        alReservar={(m) => {
          setQue("la reservación");
          setMensaje(m);
        }}
      />

      {/* ubicación y horario */}
      <section id="ubicacion" className="mx-auto max-w-6xl px-5 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div className="mapa relative aspect-[4/3] rounded-[1.5rem] overflow-hidden border border-[#2b1d16]/15" aria-label="Mapa ilustrado de la ubicación">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
            <span className="rounded-full px-3 py-1 text-white text-xs font-semibold shadow" style={{ background: TOMATE }}>
              Trattoria Sole
            </span>
            <MapPin size={34} style={{ color: TOMATE }} fill={TOMATE} stroke="#fbe7a8" />
          </span>
        </div>
        <div>
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.24em]" style={{ color: TOMATE }}>
            Visítenos
          </p>
          <h2 className="mt-3 !text-[#2b1d16] text-[2.4rem] font-semibold" style={{ fontFamily: SERIF }}>
            Horario y ubicación
          </h2>
          <p className="mt-2 opacity-75">6a avenida, zona 10, Ciudad de Guatemala (dirección de ejemplo). Parqueo para clientes.</p>
          <ul className="mt-6 divide-y divide-[#2b1d16]/10 border-y border-[#2b1d16]/10">
            {[2, 3, 4, 5, 6, 0, 1].map((d) => {
              const hoy = new Date().getDay() === d;
              return (
                <li key={d} className={`flex justify-between py-2.5 ${hoy ? "font-semibold" : ""}`}>
                  <span>
                    {DIAS[d]} {hoy && <span style={{ color: TOMATE }}>· hoy</span>}
                  </span>
                  <span className="tabular-nums">{d === 1 ? "Cerrado" : "12:00 – 22:00"}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CierreJzet demo="restaurante" />

      {/* barra del pedido */}
      {platos > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 p-3 sm:p-4 pointer-events-none">
          <button
            type="button"
            onClick={() => setVerPedido(true)}
            className="pointer-events-auto mx-auto flex w-full max-w-xl items-center justify-between gap-3 rounded-full px-5 py-3.5 text-white shadow-[0_16px_40px_-14px_rgba(43,29,22,.7)] active:scale-[0.98] transition"
            style={{ background: TINTA }}
          >
            <span className="inline-flex items-center gap-2 font-semibold">
              <ShoppingBag size={18} /> Su pedido · {platos} {platos === 1 ? "platillo" : "platillos"}
            </span>
            <span className="inline-flex items-center gap-2 font-semibold tabular-nums">
              {qz(subtotal)} <ArrowRight size={17} />
            </span>
          </button>
        </div>
      )}

      <Modal abierto={verPedido} alCerrar={() => setVerPedido(false)} titulo="Su pedido" ancho="sm:w-[min(30rem,92vw)]">
        <div className="px-6 pt-6 pb-6" style={{ color: TINTA }}>
          <h3 className="!text-[#2b1d16] text-[1.7rem] font-semibold" style={{ fontFamily: SERIF }}>
            Su pedido
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label="Cómo lo quiere">
            {(["llevar", "domicilio"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModo(m)}
                aria-pressed={modo === m}
                className={`rounded-full border py-2 text-sm font-semibold transition ${modo === m ? "text-white border-transparent" : "border-[#2b1d16]/20 hover:border-[#2b1d16]"}`}
                style={modo === m ? { background: TINTA } : undefined}
              >
                {m === "llevar" ? "Para llevar" : "A domicilio · Q20"}
              </button>
            ))}
          </div>
          {pedido.length === 0 ? (
            <p className="mt-6 text-center opacity-70">Todavía no ha agregado nada.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[#2b1d16]/10">
              {pedido.map((l) => (
                <li key={l.p.id} className="flex items-center gap-3 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate" style={{ fontFamily: SERIF }}>
                      {l.p.nombre}
                    </p>
                    <p className="text-sm opacity-60">{qz(l.p.precio)} c/u</p>
                  </div>
                  <Contador valor={l.cantidad} alCambiar={(v) => cambiar(l.p.id, v)} />
                  <button type="button" aria-label={`Quitar ${l.p.nombre}`} onClick={() => cambiar(l.p.id, 0)} className="opacity-40 hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <label className="mt-4 block text-sm font-semibold" htmlFor="notas">
            Notas para la cocina
          </label>
          <textarea
            id="notas"
            rows={2}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Sin cebolla, la pizza bien cocida…"
            className="mt-1.5 w-full resize-none rounded-xl border border-[#2b1d16]/20 bg-white px-3 py-2 text-[0.95rem] focus:outline-none focus:border-[#2b1d16]"
          />
          <div className="mt-4 space-y-1 text-[0.95rem]">
            <p className="flex justify-between opacity-70">
              <span>Subtotal</span>
              <span className="tabular-nums">{qz(subtotal)}</span>
            </p>
            {envio > 0 && (
              <p className="flex justify-between opacity-70">
                <span>Envío</span>
                <span className="tabular-nums">{qz(envio)}</span>
              </p>
            )}
            <p className="flex justify-between text-[1.15rem] font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{qz(subtotal + envio)}</span>
            </p>
          </div>
          <button
            type="button"
            disabled={pedido.length === 0}
            onClick={enviarPedido}
            className="mt-5 w-full rounded-full py-3.5 text-white font-semibold disabled:opacity-40 active:scale-[0.98] transition"
            style={{ background: TOMATE }}
          >
            Pedir por WhatsApp
          </button>
        </div>
      </Modal>

      <MensajeWhatsApp mensaje={mensaje} alCerrar={() => setMensaje(null)} demo="restaurante" que={que} />
    </div>
  );
}

/* Reservar mesa: fecha, hora, personas y nombre */
function Reservar({ alReservar }: { alReservar: (mensaje: string) => void }) {
  const hoy = new Date().toISOString().slice(0, 10);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("19:30");
  const [personas, setPersonas] = useState(2);
  const [nombre, setNombre] = useState("");
  const [errores, setErrores] = useState<{ fecha?: string; nombre?: string }>({});

  function reservar() {
    const e: typeof errores = {};
    if (!fecha) e.fecha = "Elija el día.";
    else if (new Date(`${fecha}T12:00`).getDay() === 1) e.fecha = "Los lunes está cerrado. Elija otro día.";
    if (!nombre.trim()) e.nombre = "Escriba a nombre de quién va la mesa.";
    setErrores(e);
    if (Object.keys(e).length) return;
    const d = new Date(`${fecha}T12:00`);
    const dia = `${DIAS[d.getDay()].toLowerCase()} ${d.getDate()}`;
    alReservar(`Hola, Trattoria Sole. Quiero reservar mesa para ${personas} ${personas === 1 ? "persona" : "personas"} el ${dia} a las ${hora}. A nombre de ${nombre.trim()}.`);
  }

  return (
    <section id="reservar" className="scroll-mt-4 bg-[#2b1d16] text-[#fbe7a8]">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24 grid md:grid-cols-[1fr_1.1fr] gap-10 items-center">
        <div>
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.24em] text-[#f0a08f]">Reservaciones</p>
          <h2 className="mt-3 !text-[#fbe7a8] text-[2.4rem] sm:text-[3rem] leading-tight font-semibold" style={{ fontFamily: SERIF }}>
            Su mesa,
            <br />
            <span className="italic font-normal">lista cuando llegue</span>
          </h2>
          <p className="mt-4 text-[#fbe7a8]/70 max-w-md">Elija día, hora y cuántos son. Le confirmamos por WhatsApp en unos minutos.</p>
        </div>
        <form
          className="rounded-[1.5rem] bg-[#fbe7a8] text-[#2b1d16] p-6 sm:p-8 grid sm:grid-cols-2 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            reservar();
          }}
          noValidate
        >
          <div>
            <label htmlFor="r-fecha" className="text-sm font-semibold">
              Día
            </label>
            <input
              id="r-fecha"
              type="date"
              min={hoy}
              value={fecha}
              onChange={(e) => {
                setFecha(e.target.value);
                setErrores((x) => ({ ...x, fecha: undefined }));
              }}
              className="mt-1.5 w-full rounded-xl border border-[#2b1d16]/20 bg-white px-3 py-2.5 focus:outline-none focus:border-[#2b1d16]"
            />
            {errores.fecha && <p className="mt-1 text-sm text-[#b42318]">{errores.fecha}</p>}
          </div>
          <div>
            <label htmlFor="r-hora" className="text-sm font-semibold">
              Hora
            </label>
            <select id="r-hora" value={hora} onChange={(e) => setHora(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#2b1d16]/20 bg-white px-3 py-2.5 focus:outline-none focus:border-[#2b1d16]">
              {HORAS.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-sm font-semibold">Personas</p>
            <div className="mt-1.5">
              <Contador valor={personas} alCambiar={(v) => setPersonas(Math.min(12, Math.max(1, v)))} />
            </div>
          </div>
          <div>
            <label htmlFor="r-nombre" className="text-sm font-semibold">
              A nombre de
            </label>
            <input
              id="r-nombre"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setErrores((x) => ({ ...x, nombre: undefined }));
              }}
              placeholder="María López"
              className="mt-1.5 w-full rounded-xl border border-[#2b1d16]/20 bg-white px-3 py-2.5 focus:outline-none focus:border-[#2b1d16]"
            />
            {errores.nombre && <p className="mt-1 text-sm text-[#b42318]">{errores.nombre}</p>}
          </div>
          <button type="submit" className="sm:col-span-2 mt-2 rounded-full py-3.5 font-semibold text-white active:scale-[0.98] transition" style={{ background: TOMATE }}>
            Reservar por WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
