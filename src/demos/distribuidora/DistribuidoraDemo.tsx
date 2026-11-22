/*
 * Demo: "Distribuidora El Volcán" (negocio inventado, datos de ejemplo, fotos de Unsplash).
 * Tres partes: el pedido de la tienda (lista de precios del día), la ruta del piloto
 * (entregado y cobrado) y la oficina (pedidos por ruta, existencias, créditos vencidos y cuadre).
 */
import { useEffect, useState } from "react";
import { ArrowRight, Check, ChevronDown, ChevronUp, MapPin, Package, Search, ShoppingCart, Truck, X } from "lucide-react";
import PanelDespacho from "./PanelDespacho";
import { BandaDemos, PartesDemo, Cajon, CierreJzet, Contador, MensajeWhatsApp } from "../comun";
import {
  CATEGORIAS, DIAS, ETIQUETA, FOTOS, KRAFT, KRAFT2, PEDIDO_MINIMO, PRODUCTOS, RUTAS, SELLO, STENCIL, TIENDAS, TINTA, VERDE,
  existencia, porId, proximaVisita, qz, totalDe, useDistribuidora,
  type Dist, type Linea, type Pedido,
} from "./datos";

const btn = "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-bold transition active:scale-[0.98]";

const ESTILOS = `
.dist h1, .dist h2, .dist h3 { color: inherit; }
.dist-titulo { font-family: ${STENCIL}; letter-spacing: .01em; line-height: .95; }
/* cinta de embalaje cruzando la orilla de la sección */
.cinta { height: 26px; background: repeating-linear-gradient(90deg, rgba(196,160,96,.92) 0 120px, rgba(214,180,118,.92) 120px 240px);
  box-shadow: 0 1px 0 rgba(0,0,0,.08), inset 0 -2px 0 rgba(0,0,0,.06); }
/* fondo de cartón: fibras finas */
.carton { background-color: ${KRAFT}; background-image:
  repeating-linear-gradient(0deg, rgba(120,84,40,.05) 0 1px, transparent 1px 4px),
  repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 2px, transparent 2px 7px); }
/* etiqueta de envío: orilla perforada a la izquierda */
.etiqueta { background: ${ETIQUETA}; position: relative; border-radius: 6px; box-shadow: 0 1px 0 rgba(0,0,0,.08), 0 10px 24px -18px rgba(40,25,5,.6); }
.sello { font-family: ${STENCIL}; border: 3px solid currentColor; border-radius: 6px; padding: 2px 10px; transform: rotate(-6deg); display: inline-block; opacity: .9; }
.dist-hero { display: grid; gap: 2rem; }
@media (min-width: 960px) { .dist-hero { grid-template-columns: 1.1fr 1fr; align-items: center; } }
.dist-oficina { display: grid; gap: 1.5rem; }
@media (min-width: 1024px) { .dist-oficina { grid-template-columns: 1.5fr 1fr; } }
`;

/* logo: costal amarrado con el volcán estampado */
function Logo({ tam = 42 }: { tam?: number }) {
  return (
    <svg viewBox="0 0 48 52" width={tam} height={tam * 1.08} aria-hidden className="shrink-0">
      <path d="M17 8 C19 4 29 4 31 8 L29.5 11 L18.5 11 Z" fill={TINTA} />
      <path d="M16 10.5 Q24 13 32 10.5" fill="none" stroke={SELLO} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M18 11 C8 16 6 30 8 40 C9 46 14 49 24 49 C34 49 39 46 40 40 C42 30 40 16 30 11 Z" fill={ETIQUETA} stroke={TINTA} strokeWidth="2" />
      <path d="M11 39 L20 25 L23 28 L26 22 L37 39 Z" fill={TINTA} />
      <path d="M24.5 23.5 L26 22 L27.6 24.4 L26.2 25.4 L25 24.3 Z" fill={ETIQUETA} />
      <path d="M22 18 q2 -3 4 -1 q2 -3 4 0" fill="none" stroke={TINTA} strokeWidth="1.4" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}
function Marca() {
  return (
    <span className="flex items-center gap-2.5">
      <Logo />
      <span className="leading-none">
        <span className="dist-titulo block text-[1.35rem]">El Volcán</span>
        <span className="block whitespace-nowrap text-[0.7rem] font-bold opacity-70"><span className="sm:hidden">Abarrotes</span><span className="hidden sm:inline">Distribuidora de abarrotes</span></span>
      </span>
    </span>
  );
}

type Vista = "tienda" | "piloto" | "oficina";

export default function DistribuidoraDemo() {
  const d = useDistribuidora();
  const leer = (): Vista => (location.hash === "#piloto" ? "piloto" : location.hash === "#oficina" ? "oficina" : "tienda");
  const [vista, setVista] = useState<Vista>(leer);
  useEffect(() => {
    const cambio = () => setVista(leer());
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", vista === "tienda" ? location.pathname : `#${vista}`);
    document.title = vista === "oficina" ? "Oficina · Distribuidora El Volcán" : vista === "piloto" ? "Mi ruta · El Volcán" : "Distribuidora El Volcán · Demo de Jzet Labs";
    window.scrollTo(0, 0);
  }, [vista]);

  return (
    <div className="dist carton min-h-screen" style={{ color: TINTA }}>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <PartesDemo fondo={TINTA} actual={vista} alCambiar={setVista} partes={[{ id: "tienda", nombre: "Pedido de la tienda", quien: "La tienda ve los precios del día y pide" }, { id: "piloto", nombre: "Ruta del piloto", quien: "El piloto marca lo entregado y lo cobrado" }, { id: "oficina", nombre: "Oficina", quien: "Usted ve pedidos, el camión y los créditos" }] as const} />
      {vista === "tienda" && <PaginaTienda d={d} alPedir={() => setVista("oficina")} />}
      {vista === "piloto" && <Piloto d={d} />}
      {vista === "oficina" && <PanelDespacho d={d} />}
      <CierreJzet demo="distribuidora" />
    </div>
  );
}

/* ---------------- pedido de la tienda ---------------- */

function PaginaTienda({ d, alPedir }: { d: Dist; alPedir: () => void }) {
  const [cat, setCat] = useState("Todo");
  const [busca, setBusca] = useState("");
  const [carro, setCarro] = useState<Record<string, number>>({});
  const [abierto, setAbierto] = useState(false);
  const [tiendaId, setTiendaId] = useState("T-104");
  const [pago, setPago] = useState<Pedido["pago"]>("contado");
  const [nota, setNota] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const lineas: Linea[] = Object.entries(carro).filter(([, n]) => n > 0).map(([id, n]) => ({ id, n }));
  const total = totalDe(lineas);
  const bultos = lineas.reduce((s, l) => s + l.n, 0);
  const t = porId(TIENDAS, tiendaId);
  const r = porId(RUTAS, t.ruta);
  const lista = PRODUCTOS.filter((p) => (cat === "Todo" || p.cat === cat) && p.nombre.toLowerCase().includes(busca.toLowerCase()));
  const poner = (id: string, n: number) => setCarro((c) => ({ ...c, [id]: Math.max(0, Math.min(n, porId(PRODUCTOS, id).hay)) }));

  function enviar() {
    const num = d.pedir(tiendaId, lineas, pago, nota);
    setAbierto(false);
    setMsg(
      `Pedido ${num} · ${t.nombre} (${t.id})\n` +
        lineas.map((l) => `- ${l.n} × ${porId(PRODUCTOS, l.id).nombre}, ${porId(PRODUCTOS, l.id).unidad}`).join("\n") +
        `\nTotal: ${qz(total)} · ${pago === "credito" ? `crédito a ${t.credito} días` : "contado al recibir"}\nEntrega ${proximaVisita(t.ruta)} con la ${r.nombre}` +
        (nota ? `\nNota: ${nota}` : ""),
    );
    setCarro({});
    setNota("");
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-black/10 backdrop-blur" style={{ background: "rgba(214,191,152,.94)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#inicio" aria-label="Distribuidora El Volcán">
            <Marca />
          </a>
          <nav className="hidden gap-7 font-semibold md:flex">
            <a href="#lista" className="hover:underline">Lista de precios</a>
            <a href="#rutas" className="hover:underline">Días de entrega</a>
            <a href="#credito" className="hover:underline">Crédito</a>
          </nav>
          <button type="button" onClick={() => setAbierto(true)} className={`${btn} shrink-0 whitespace-nowrap !px-4 !py-2.5 text-white`} style={{ background: TINTA }}>
            <ShoppingCart size={18} /> {bultos ? `${bultos} bultos · ${qz(total)}` : "Mi pedido"}
          </button>
        </div>
      </header>

      <section id="inicio" className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <div className="dist-hero">
          <div>
            <h1 className="dist-titulo text-[2.7rem] sm:text-[3.8rem]">Abarrotes por mayor para su tienda</h1>
            <p className="mt-5 max-w-lg text-[1.08rem] leading-relaxed opacity-85">
              Vea el precio de hoy y lo que hay en bodega, mande su pedido y le llega con el camión de su ruta. Pedido mínimo de {qz(PEDIDO_MINIMO)}, la entrega no le cuesta.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#lista" className={`${btn} text-white`} style={{ background: TINTA }}>
                Ver la lista de precios <ArrowRight size={18} />
              </a>
              <a href="#rutas" className={`${btn} border-2`} style={{ borderColor: TINTA }}>
                ¿Qué día pasa por mi zona?
              </a>
            </div>
            <p className="mt-6 text-[0.92rem] font-semibold opacity-70">Desde 1998 en la zona 12 · Entregamos en camión a tiendas de la capital y Mixco</p>
          </div>
          <div className="relative">
            <img src={FOTOS.bodega} alt="Cajas plásticas apiladas en la bodega" className="h-[380px] w-full rounded-lg object-cover sm:h-[440px]" />
            <div className="etiqueta mt-4 p-4 sm:ml-auto sm:w-[290px]">
              <p className="text-[0.85rem] font-bold opacity-70">Cambió esta semana</p>
              <ul className="mt-1.5 grid gap-1 text-[0.95rem]">
                {PRODUCTOS.filter((p) => p.antes).map((p) => (
                  <li key={p.id} className="flex justify-between gap-3">
                    <span>{p.nombre}</span>
                    <b className="shrink-0 whitespace-nowrap" style={{ color: p.precio < (p.antes ?? 0) ? VERDE : SELLO }}>
                      {p.precio < (p.antes ?? 0) ? "bajó" : "subió"} {qz(Math.abs(p.precio - (p.antes ?? 0)))}
                    </b>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div className="cinta mt-6" aria-hidden />

      {/* lista de precios */}
      <section id="lista" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-12 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="dist-titulo text-[2.6rem] sm:text-[3.2rem]">Lista de precios de hoy</h2>
            <p className="mt-1 opacity-80">Precios por mayor, ya con IVA. Lo que está agotado no se puede pedir.</p>
          </div>
          <label className="flex items-center gap-2 rounded-md bg-white/70 px-3 py-2">
            <Search size={18} className="opacity-60" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar producto" className="w-44 bg-transparent outline-none" />
          </label>
        </div>
        <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          {["Todo", ...CATEGORIAS].map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} className="shrink-0 rounded-md px-4 py-2 font-bold" style={cat === c ? { background: TINTA, color: "#fff" } : { background: KRAFT2 }}>
              {c}
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {lista.map((p) => {
            const ex = existencia(p.hay);
            const n = carro[p.id] ?? 0;
            return (
              <article key={p.id} className="etiqueta flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[1.08rem] font-bold leading-tight">{p.nombre}</p>
                  <p className="text-[0.9rem] opacity-70">{p.unidad}</p>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-[1.3rem] font-bold">{qz(p.precio)}</span>
                    {p.antes && <s className="text-[0.9rem] opacity-50">{qz(p.antes)}</s>}
                    <span className="text-[0.85rem] font-bold" style={{ color: ex.c }}>{ex.t}</span>
                  </p>
                </div>
                {p.hay === 0 ? (
                  <span className="sello text-[0.9rem]" style={{ color: SELLO }}>Agotado</span>
                ) : n === 0 ? (
                  <button type="button" onClick={() => poner(p.id, 1)} className="rounded-md px-4 py-2.5 font-bold text-white" style={{ background: TINTA }}>
                    Agregar
                  </button>
                ) : (
                  <Contador valor={n} alCambiar={(v) => poner(p.id, v)} />
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* rutas */}
      <section id="rutas" className="scroll-mt-20" style={{ background: TINTA, color: "#fff" }}>
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1fr_1.2fr] md:py-14">
          <div>
            <h2 className="dist-titulo text-[2.6rem] sm:text-[3.2rem]">¿Qué día pasa el camión?</h2>
            <p className="mt-2 text-white/75">Cada colonia tiene su ruta y sus dos días a la semana. Si pide antes de las 6 de la tarde, le llega en la siguiente visita.</p>
            <img src={FOTOS.camion} alt="Camión de reparto en la carretera" loading="lazy" className="mt-6 h-56 w-full rounded-lg object-cover" />
          </div>
          <div className="grid content-start gap-3">
            {RUTAS.map((x) => (
              <div key={x.id} className="rounded-lg bg-white/10 p-4">
                <p className="flex items-center gap-2 text-[1.15rem] font-bold">
                  <Truck size={20} /> {x.nombre}: {x.zona}
                </p>
                <p className="mt-1 text-white/75">
                  Pasa los {x.dias.map((k) => DIAS[k]).join(" y ")} · {x.camion}, con {x.piloto}
                </p>
              </div>
            ))}
            <p className="text-[0.9rem] text-white/60">¿Su colonia no está? Escríbanos y le decimos cuál le toca.</p>
          </div>
        </div>
      </section>

      {/* crédito */}
      <section id="credito" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-12 md:py-14">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <img src={FOTOS.tendero} alt="Dueño de una tienda de barrio detrás del mostrador" loading="lazy" className="h-72 w-full rounded-lg object-cover" />
          <div>
            <h2 className="dist-titulo text-[2.6rem] sm:text-[3.2rem]">Crédito para su tienda</h2>
            <p className="mt-3 text-[1.05rem] opacity-85">Después de tres pedidos de contado le abrimos crédito a 8 o 15 días. Usted ve su saldo y cuándo vence aquí mismo, sin tener que llamar.</p>
            <ul className="mt-4 grid gap-2">
              {["Recibe su factura con cada entrega", "Paga en efectivo al piloto o por transferencia", "Le avisamos por WhatsApp dos días antes de que venza"].map((x) => (
                <li key={x} className="flex gap-2">
                  <Check size={20} className="mt-0.5 shrink-0" style={{ color: VERDE }} /> {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* el pedido */}
      <Cajon abierto={abierto} alCerrar={() => setAbierto(false)} fondo={ETIQUETA}>
        <div className="flex h-full flex-col" style={{ color: TINTA }}>
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <p className="dist-titulo text-[1.6rem]">Nota de pedido</p>
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar" className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <label className="block text-[0.85rem] font-bold">Su tienda</label>
            <select aria-label="Su tienda" value={tiendaId} onChange={(e) => setTiendaId(e.target.value)} className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2.5">
              {TIENDAS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.id} · {x.nombre}
                </option>
              ))}
            </select>
            <p className="mt-2 flex items-start gap-1.5 text-[0.9rem] opacity-80">
              <MapPin size={16} className="mt-0.5 shrink-0" /> {t.dir}. Le llega {proximaVisita(t.ruta)} con la {r.nombre}.
            </p>
            {lineas.length === 0 ? (
              <p className="mt-8 text-center opacity-60">Todavía no ha agregado nada.</p>
            ) : (
              <ul className="mt-5 divide-y divide-black/10 border-y border-black/10">
                {lineas.map((l) => {
                  const p = porId(PRODUCTOS, l.id);
                  return (
                    <li key={l.id} className="flex items-center gap-3 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold leading-tight">{p.nombre}</p>
                        <p className="text-[0.85rem] opacity-65">{p.unidad} · {qz(p.precio)}</p>
                      </div>
                      <Contador valor={l.n} alCambiar={(v) => poner(l.id, v)} />
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="mt-5 grid grid-cols-2 gap-2">
              {(
                [
                  ["contado", "Contado al recibir"],
                  ["credito", t.credito ? `Crédito a ${t.credito} días` : "Crédito (aún no tiene)"],
                ] as const
              ).map(([v, txt]) => (
                <button key={v} type="button" disabled={v === "credito" && !t.credito} onClick={() => setPago(v)} className="rounded-md border-2 px-3 py-2.5 text-[0.92rem] font-bold disabled:opacity-40" style={pago === v ? { borderColor: TINTA, background: TINTA, color: "#fff" } : { borderColor: "rgba(0,0,0,.15)" }}>
                  {txt}
                </button>
              ))}
            </div>
            <label className="mt-4 block text-[0.85rem] font-bold">Nota para el piloto (opcional)</label>
            <input aria-label="Nota para el piloto" value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej.: dejar con la vecina si no estoy" className="mt-1 w-full rounded-md border border-black/15 px-3 py-2.5" />
          </div>
          <div className="border-t border-black/10 px-5 py-4">
            <div className="flex justify-between text-[1.2rem] font-bold">
              <span>Total</span>
              <span>{qz(total)}</span>
            </div>
            {total > 0 && total < PEDIDO_MINIMO && <p className="mt-1 text-[0.9rem]" style={{ color: SELLO }}>Le faltan {qz(PEDIDO_MINIMO - total)} para el pedido mínimo.</p>}
            <button type="button" disabled={total < PEDIDO_MINIMO || (pago === "credito" && !t.credito)} onClick={enviar} className={`${btn} mt-3 w-full text-white disabled:opacity-40`} style={{ background: TINTA }}>
              Mandar pedido <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </Cajon>
      <MensajeWhatsApp
        mensaje={msg}
        alCerrar={() => setMsg(null)}
        demo="distribuidora"
        que="el pedido de cada tienda"
        accion={{ texto: "Verlo en la oficina", alTocar: () => { setMsg(null); alPedir(); } }}
      />
    </>
  );
}

/* ---------------- ruta del piloto ---------------- */

function Piloto({ d }: { d: Dist }) {
  const [ruta, setRuta] = useState("r2");
  const [abierto, setAbierto] = useState<number | null>(null);
  const [monto, setMonto] = useState("");
  const r = porId(RUTAS, ruta);
  const paradas = d.pedidos.filter((p) => porId(TIENDAS, p.tienda).ruta === ruta && p.estado !== "nuevo");
  const efectivo = paradas.reduce((s, p) => s + p.cobrado, 0);
  const porCobrar = paradas.filter((p) => p.pago === "contado" && p.estado !== "entregado").reduce((s, p) => s + totalDe(p.lineas), 0);

  return (
    <section className="mx-auto max-w-md px-4 py-8">
      <div className="etiqueta p-4">
        <div className="flex items-center justify-between gap-2">
          <Marca />
          <select aria-label="Ruta" value={ruta} onChange={(e) => setRuta(e.target.value)} className="rounded-md border border-black/15 px-2 py-1.5 font-bold">
            {RUTAS.map((x) => (
              <option key={x.id} value={x.id}>
                {x.nombre}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-3 text-[0.95rem] opacity-80">
          {r.piloto} · {r.camion} · {r.zona}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-md p-2" style={{ background: KRAFT }}>
            <p className="text-[0.8rem] font-bold opacity-70">Efectivo en mano</p>
            <p className="text-[1.4rem] font-bold">{qz(efectivo)}</p>
          </div>
          <div className="rounded-md p-2" style={{ background: KRAFT }}>
            <p className="text-[0.8rem] font-bold opacity-70">Falta cobrar</p>
            <p className="text-[1.4rem] font-bold">{qz(porCobrar)}</p>
          </div>
        </div>
      </div>

      <p className="mt-6 font-bold">Paradas de hoy ({paradas.length})</p>
      {paradas.length === 0 && <p className="mt-3 opacity-70">No hay pedidos cargados para esta ruta. En la oficina se cargan al camión.</p>}
      <ol className="mt-3 grid gap-3">
        {paradas.map((p, i) => {
          const t = porId(TIENDAS, p.tienda);
          const total = totalDe(p.lineas);
          const listo = p.estado === "entregado";
          const ab = abierto === p.num;
          return (
            <li key={p.num} className="etiqueta overflow-hidden">
              <button type="button" onClick={() => { setAbierto(ab ? null : p.num); setMonto(p.pago === "contado" ? String(total) : "0"); }} className="flex w-full items-center gap-3 p-4 text-left">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-bold text-white" style={{ background: listo ? VERDE : TINTA }}>
                  {listo ? <Check size={18} /> : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block leading-tight">{t.nombre}</b>
                  <span className="block text-[0.88rem] opacity-70">{t.dir}</span>
                  <span className="block text-[0.88rem] font-bold">
                    {qz(total)} · {p.pago === "credito" ? "crédito" : "cobrar al entregar"}
                  </span>
                </span>
                {ab ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {ab && (
                <div className="border-t border-black/10 px-4 pb-4 pt-3">
                  <ul className="grid gap-1 text-[0.95rem]">
                    {p.lineas.map((l) => (
                      <li key={l.id} className="flex justify-between gap-3">
                        <span>{l.n} × {porId(PRODUCTOS, l.id).nombre}</span>
                        <span className="opacity-60">{porId(PRODUCTOS, l.id).unidad.split(" ")[0]}</span>
                      </li>
                    ))}
                  </ul>
                  {p.nota && <p className="mt-2 rounded-md p-2 text-[0.9rem]" style={{ background: KRAFT }}>Nota: {p.nota}</p>}
                  {listo ? (
                    <p className="mt-3"><span className="sello text-[1rem]" style={{ color: VERDE }}>Entregado</span> {p.cobrado ? <span className="ml-3 font-bold">cobró {qz(p.cobrado)}</span> : null}</p>
                  ) : (
                    <div className="mt-3 flex items-end gap-2">
                      <label className="flex-1 text-[0.85rem] font-bold">
                        Cobré en efectivo
                        <input inputMode="decimal" value={monto} onChange={(e) => setMonto(e.target.value.replace(/[^0-9.]/g, ""))} className="mt-1 w-full rounded-md border border-black/15 px-3 py-2.5 text-[1.05rem]" />
                      </label>
                      <button type="button" onClick={() => { d.entregar(p.num, Number(monto) || 0); setAbierto(null); }} className={`${btn} text-white`} style={{ background: VERDE }}>
                        <Package size={18} /> Entregado
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-6 text-center text-[0.9rem] opacity-70">En el teléfono del piloto funciona aunque se vaya la señal: lo marcado se manda al volver a tener internet.</p>
    </section>
  );
}

/* ---------------- oficina ---------------- */
