/*
 * Lo que ve el cliente de Órbita Celulares, con estilo de tienda de verdad:
 * barra de promociones, buscador, banner del equipo del mes (foto real del
 * mismo modelo), catálogo con fotos reales, quiénes son y de dónde traen los
 * equipos, carrito, pago con tarjeta o transferencia, rastreo, reparaciones y
 * devoluciones. El stock nunca se muestra en números.
 */
import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck, Banknote, Check, CreditCard, Lock, MapPin, MessageCircle, PackageSearch, RefreshCcw, Search, ShieldCheck, ShoppingCart, Store, Trash2, Truck, Undo2, Wrench, X,
} from "lucide-react";
import { Modal } from "@/components/Modal";
import { Cajon, Contador, qz } from "../comun";
import tecnico from "@/assets/demo-celulares/tecnico.jpg";
import {
  AMARILLO, PRIMARIO, ESTADOS_PEDIDO, FALLAS, FONDO, LAVANDA, MODELOS_REPARACION, PASOS_RASTREO, PASOS_REPARACION, SUCURSALES, TEXTO_REPARACION, TINTA, TITULO,
  FOTO_CELULARES, disponibilidad, efectivo, enLista, fechaCorta, sucursalPor,
  type Linea, type Metodo, type Pedido, type Producto, type Tienda,
} from "./datos";
import { cobrarConTarjeta } from "./pasarela";

const ENVIO = 35;
const ENVIO_GRATIS = 1000;
const cuota = (precio: number, meses: number) => Math.ceil(precio / meses);
const sigId = (pref: string, lista: { id: string }[], base: number) => `${pref}-${Math.max(base, ...lista.map((x) => Number(x.id.split("-")[1]) || 0)) + 1}`;

type Filtro = "Celulares" | "iPhone" | "Samsung" | "Seminuevos" | "iPad y tablets" | "Mac y laptops" | "Accesorios";
const FILTROS: Filtro[] = ["Celulares", "iPhone", "Samsung", "Seminuevos", "iPad y tablets", "Mac y laptops", "Accesorios"];
const pasa = (p: Producto, f: Filtro) =>
  f === "Accesorios"
    ? p.categoria === "Accesorios"
    : f === "iPad y tablets"
      ? p.categoria === "Tablets"
      : f === "Mac y laptops"
        ? p.categoria === "Laptops"
        : f === "Seminuevos"
          ? p.condicion === "Seminuevo"
          : p.categoria === "Celulares" && (f === "Celulares" || (f === "iPhone" ? p.marca === "Apple" : p.marca === f));

export function TiendaCliente({ t, alAdmin }: { t: Tienda; alAdmin: () => void }) {
  const [filtro, setFiltro] = useState<Filtro>("Celulares");
  const [buscar, setBuscar] = useState("");
  const [ficha, setFicha] = useState<Producto | null>(null);
  const [carro, setCarro] = useState<Linea[]>([]);
  const [carroAbierto, setCarroAbierto] = useState(false);
  const [pagando, setPagando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    document.title = "Órbita Celulares · Demo de Jzet Labs";
  }, []);
  useEffect(() => {
    if (!aviso) return;
    const x = setTimeout(() => setAviso(null), 2200);
    return () => clearTimeout(x);
  }, [aviso]);

  const q = buscar.trim().toLowerCase();
  const lista = t.productos.filter((p) => p.visible !== false && (q ? `${p.marca} ${p.nombre}`.toLowerCase().includes(q) : pasa(p, filtro)));
  const piezas = carro.reduce((s, l) => s + l.cantidad, 0);
  const subtotal = carro.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const destacado = enLista(t.productos, "ip17promax");
  const mac = enLista(t.productos, "macbookair");
  const s26u = enLista(t.productos, "s26ultra");

  function agregar(l: Linea) {
    setCarro((c) => {
      const i = c.findIndex((x) => x.id === l.id && x.detalle === l.detalle);
      if (i >= 0) return c.map((x, k) => (k === i ? { ...x, cantidad: x.cantidad + l.cantidad } : x));
      return [...c, l];
    });
    setAviso(`${l.nombre} está en tu carrito`);
  }
  const verFiltro = (f: Filtro) => {
    setFiltro(f);
    setBuscar("");
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  };
  const rastrear = (c: string) => {
    setCodigo(c);
    document.getElementById("rastreo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: FONDO, color: TINTA }} className="min-h-screen">
      {/* barra de promociones */}
      <div className="text-white text-[0.8rem]" style={{ background: PRIMARIO }}>
        <div className="mx-auto max-w-7xl px-5 py-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center">
          <span><b>Black Week:</b> hasta 20% en seminuevos · Celulares, iPad, Mac y laptops con garantía</span>
          <span className="hidden sm:inline text-white/50">|</span>
          <span className="hidden sm:inline">Envíos a toda Guatemala · Paga al recibir</span>
          <span className="hidden md:inline text-white/50">|</span>
          <span className="hidden md:inline">WhatsApp 5555-0000 (de ejemplo)</span>
        </div>
      </div>

      {/* encabezado */}
      <header className="sticky top-0 z-30 bg-white border-b border-black/10">
        <div className="mx-auto max-w-7xl px-5 h-16 flex items-center gap-4">
          <a href="#inicio" className="shrink-0 leading-none">
            <span className="block text-[1.4rem] font-extrabold tracking-[-0.02em]" style={{ fontFamily: TITULO }}>
              Órbita
            </span>
            <span className="block text-[0.62rem] font-bold uppercase tracking-[0.24em]" style={{ color: PRIMARIO }}>
              Celulares
            </span>
          </a>
          <label className="hidden md:flex flex-1 max-w-xl items-center gap-2 rounded-lg border border-black/15 bg-[#f7f7f6] px-3 focus-within:border-[#6d28d9]">
            <Search size={17} className="text-black/40" />
            <input
              value={buscar}
              onChange={(e) => {
                setBuscar(e.target.value);
                document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
              }}
              placeholder="Buscar iPhone, Galaxy, iPad, MacBook…"
              className="w-full bg-transparent py-2.5 text-[0.92rem] focus:outline-none"
            />
          </label>
          <div className="ml-auto flex items-center gap-2">
            <a href="#rastreo" className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.88rem] font-semibold hover:bg-black/5">
              <PackageSearch size={17} /> Mi pedido
            </a>
            <button type="button" onClick={() => setCarroAbierto(true)} className="relative inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[0.9rem] font-semibold text-white" style={{ background: TINTA }} aria-label={`Carrito, ${piezas} productos`}>
              <ShoppingCart size={17} /> <span className="hidden sm:inline">Carrito</span>
              {piezas > 0 && (
                <span className="grid place-items-center min-w-5 h-5 px-1 rounded-full text-[0.72rem] font-bold text-black" style={{ background: AMARILLO }}>
                  {piezas}
                </span>
              )}
            </button>
          </div>
        </div>
        <nav className="border-t border-black/5" aria-label="Categorías">
          <div className="mx-auto max-w-7xl px-5 flex gap-5 overflow-x-auto [scrollbar-width:none] text-[0.88rem] font-semibold">
            {FILTROS.map((f) => (
              <button key={f} type="button" onClick={() => verFiltro(f)} className={`shrink-0 border-b-2 py-2.5 transition ${!q && filtro === f ? "" : "border-transparent text-black/60 hover:text-black"}`} style={!q && filtro === f ? { borderColor: PRIMARIO, color: PRIMARIO } : undefined}>
                {f}
              </button>
            ))}
            <a href="#reparaciones" className="shrink-0 py-2.5 text-black/60 hover:text-black">
              Reparaciones
            </a>
            <a href="#sucursales" className="shrink-0 py-2.5 text-black/60 hover:text-black">
              Sucursales
            </a>
          </div>
        </nav>
      </header>

      {/* banner del mes y promociones: cada foto es del equipo que nombra */}
      <section id="inicio" className="mx-auto max-w-7xl px-5 pt-5 grid lg:grid-cols-[2fr_1fr] gap-4">
        <div className="overflow-hidden rounded-2xl text-white grid sm:grid-cols-[1.05fr_1fr]" style={{ background: TINTA }}>
          <div className="relative order-2 sm:order-1 flex flex-col justify-center p-6 sm:p-10">
            <span className="self-start rounded px-2 py-1 text-[0.72rem] font-bold uppercase tracking-wider text-black" style={{ background: AMARILLO }}>
              Ya llegó
            </span>
            <h1 className="mt-4 text-[2.4rem] sm:text-[3.4rem] leading-[1] font-extrabold tracking-[-0.02em] !text-white" style={{ fontFamily: TITULO }}>
              iPhone 17 Pro Max
            </h1>
            <p className="mt-3 text-white/80">Sellado, con factura y 1 año de garantía con nosotros. También en azul profundo y plata.</p>
            <p className="mt-5 text-[0.85rem] text-white/60">Oferta en efectivo</p>
            <p className="text-[2.2rem] font-extrabold leading-none">{qz(efectivo(destacado.variantes[0].precio))}</p>
            <p className="mt-1 text-white/75">
              Con tarjeta {qz(destacado.variantes[0].precio)} o 12 cuotas de {qz(cuota(destacado.variantes[0].precio, 12))}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" onClick={() => setFicha(destacado)} className="rounded-lg px-5 py-3 font-bold text-white" style={{ background: PRIMARIO }}>
                Comprarlo
              </button>
              <button type="button" onClick={() => verFiltro("iPhone")} className="rounded-lg px-5 py-3 font-bold bg-white/10 hover:bg-white/20">
                Ver todos los iPhone
              </button>
            </div>
          </div>
          <div className="relative order-1 sm:order-2 min-h-[260px] sm:min-h-[460px]">
            <img src={destacado.foto} alt="iPhone 17 Pro Max naranja en la mano" className="absolute inset-0 w-full h-full object-cover object-[50%_40%]" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {[
            { p: mac, tag: "Nuevo", t: "MacBook Air M4", d: `Desde ${qz(efectivo(mac.variantes[0].precio))} en efectivo`, f: () => setFicha(mac) },
            { p: s26u, tag: "Nuevo", t: "Galaxy S26 Ultra", d: `Desde ${qz(efectivo(s26u.variantes[0].precio))} en efectivo`, f: () => setFicha(s26u) },
          ].map((x) => (
            <button key={x.t} type="button" onClick={x.f} className="group relative overflow-hidden rounded-2xl min-h-[200px] text-left text-white" style={{ background: TINTA }}>
              <img src={x.p.foto} alt={x.p.nombre} className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,19,24,.88),rgba(17,19,24,.1)_65%)]" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="rounded px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-black" style={{ background: AMARILLO }}>
                  {x.tag}
                </span>
                <p className="mt-2 text-[1.35rem] font-extrabold leading-tight">{x.t}</p>
                <p className="text-white/80">{x.d}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* qué vendemos, en 5 segundos */}
      <section className="mx-auto max-w-7xl px-5 pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(
            [
              ["Celulares", FOTO_CELULARES, "iPhone, Samsung y Google", "Celulares"],
              ["iPad y tablets", enLista(t.productos, "ipadair").foto, "iPad Pro, Air, mini y Galaxy Tab", "iPad y tablets"],
              ["Mac y laptops", enLista(t.productos, "macbookpro").foto, "MacBook Air, Pro y Dell", "Mac y laptops"],
              ["Seminuevos", enLista(t.productos, "ip15pro").foto, "Certificados, con garantía", "Seminuevos"],
              ["Audio y accesorios", enLista(t.productos, "airpods").foto, "AirPods, cargadores, fundas", "Accesorios"],
            ] as [string, string, string, Filtro][]
          ).map(([ti, foto, d, f]) => (
            <button key={ti} type="button" onClick={() => verFiltro(f)} className="group overflow-hidden rounded-2xl bg-white text-left border border-black/[0.06] hover:shadow-md transition">
              <span className="block aspect-[4/3] overflow-hidden">
                <img src={foto} alt="" className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
              </span>
              <span className="block p-3">
                <span className="block font-extrabold">{ti}</span>
                <span className="block text-[0.78rem] text-black/55">{d}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 rounded-2xl bg-white border border-black/[0.06] px-5 py-4">
          <span className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-black/40">Marcas que vendemos</span>
          {["Apple", "Samsung", "Google", "Dell"].map((m) => (
            <span key={m} className="text-[1.25rem] font-extrabold tracking-[-0.01em] text-black/75" style={{ fontFamily: TITULO }}>
              {m}
            </span>
          ))}
          <span className="text-[0.85rem] font-semibold text-black/45">y accesorios de varias marcas</span>
        </div>
      </section>

      {/* beneficios */}
      <section className="mx-auto max-w-7xl px-5 pt-4">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl bg-black/10">
          {[
            [CreditCard, "12 cuotas sin recargo", "Con tarjetas participantes"],
            [Truck, "Envío en 24 horas", "En la capital, 48 en departamentos"],
            [ShieldCheck, "Garantía en tienda", "1 año en nuevos, 6 meses en seminuevos"],
            [RefreshCcw, "Paga al recibir", "Revisa tu equipo antes de pagar"],
          ].map(([I, ti, d]) => {
            const Icono = I as typeof Check;
            return (
              <li key={ti as string} className="flex items-start gap-3 bg-white p-4">
                <Icono size={22} className="shrink-0" style={{ color: PRIMARIO }} />
                <span>
                  <span className="block font-bold text-[0.92rem]">{ti as string}</span>
                  <span className="block text-[0.8rem] text-black/55">{d as string}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* catálogo */}
      <section id="catalogo" className="scroll-mt-28 mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-[1.8rem] sm:text-[2.3rem] font-extrabold tracking-[-0.02em] !text-[#1c1230]" style={{ fontFamily: TITULO }}>
            {q ? `Resultados para “${buscar.trim()}”` : filtro === "Celulares" ? "Celulares" : filtro}
          </h2>
          <label className="md:hidden flex w-full items-center gap-2 rounded-lg border border-black/15 bg-white px-3">
            <Search size={17} className="text-black/40" />
            <input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar un modelo…" className="w-full py-2.5 focus:outline-none" />
          </label>
          <p className="text-sm text-black/55">{lista.length} productos</p>
        </div>
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {lista.map((p) => {
            const disp = disponibilidad(t.stock, p.id);
            const desde = p.variantes[0].precio;
            return (
              <article key={p.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-black/[0.06]">
                <button type="button" onClick={() => setFicha(p)} className="relative block aspect-[4/5] overflow-hidden" aria-label={`Ver ${p.nombre}`}>
                  <img src={p.foto} alt={p.nombre} className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
                  {p.etiqueta && (
                    <span className="absolute left-2 top-2 rounded px-2 py-0.5 text-[0.68rem] font-bold" style={p.etiqueta === "Oferta" ? { background: AMARILLO, color: "#000" } : { background: "#fff", color: TINTA }}>
                      {p.etiqueta}
                    </span>
                  )}
                  {p.antes && <span className="absolute right-2 top-2 rounded px-2 py-0.5 text-[0.68rem] font-bold text-white bg-[#c0262d]">-{Math.round((1 - desde / p.antes) * 100)}%</span>}
                </button>
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <p className="text-[0.75rem] font-semibold text-black/45">
                    {p.marca} · {p.condicion}
                  </p>
                  <button type="button" onClick={() => setFicha(p)} className="text-left font-bold leading-tight hover:underline">
                    {p.nombre}
                  </button>
                  <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-wide" style={{ color: PRIMARIO }}>
                    {p.variantes.length > 1 ? "Desde, en efectivo" : "En efectivo"}
                  </p>
                  <p className="text-[1.2rem] font-extrabold leading-none">
                    {qz(efectivo(desde))} {p.antes && <span className="text-[0.8rem] font-normal line-through text-black/35">{qz(p.antes)}</span>}
                  </p>
                  <p className="mt-1 text-[0.76rem] text-black/55">
                    Con tarjeta {qz(desde)}
                    {desde >= 1000 ? ` · 12 cuotas de ${qz(cuota(desde, 12))}` : ""}
                  </p>
                  <p className={`mt-auto pt-2 text-[0.78rem] font-semibold ${disp.tipo === "agotado" ? "text-[#b42318]" : disp.tipo === "pocas" ? "text-[#b25e00]" : "text-[#1f7a3a]"}`}>{disp.texto}</p>
                  <button type="button" onClick={() => setFicha(p)} disabled={disp.tipo === "agotado"} className="mt-2 rounded-lg py-2 text-[0.85rem] font-bold text-white disabled:opacity-40" style={{ background: PRIMARIO }}>
                    {disp.tipo === "agotado" ? "Agotado" : "Comprar"}
                  </button>
                </div>
              </article>
            );
          })}
          {!lista.length && <p className="col-span-full rounded-2xl bg-white p-8 text-center text-black/55">No encontramos ese modelo. Escríbenos y te lo conseguimos.</p>}
        </div>
        <p className="mt-4 text-xs text-black/45">Precios de ejemplo, en quetzales. Las marcas y fotos de productos son de sus dueños.</p>
      </section>

      {/* quiénes somos y de dónde los traemos */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16 grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
          <img src={tecnico} alt="Técnico de Órbita revisando la placa de un celular" className="w-full aspect-[4/3] object-cover rounded-2xl" loading="lazy" />
          <div>
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em]" style={{ color: PRIMARIO }}>
              Quiénes somos
            </p>
            <h2 className="mt-2 text-[1.9rem] sm:text-[2.5rem] leading-[1.05] font-extrabold !text-[#1c1230]" style={{ fontFamily: TITULO }}>
              Sabemos de dónde viene cada equipo que vendemos
            </h2>
            <p className="mt-3 text-black/65">Empezamos en 2016 con un mostrador en zona 10. Hoy tenemos tres sucursales y taller propio, y cada equipo se revisa aquí antes de entregarlo.</p>
            <ul className="mt-6 space-y-4">
              {[
                [BadgeCheck, "Nuevos y sellados", "De distribuidores autorizados en Miami y Panamá, con su caja y factura."],
                [ShieldCheck, "Seminuevos certificados", "De primera mano, con 30 puntos de revisión: batería, pantalla, cámaras, señal y botones."],
                [RefreshCcw, "Canje", "Trae tu celular usado y te lo tomamos como parte de pago, según su estado."],
              ].map(([I, ti, d]) => {
                const Icono = I as typeof Check;
                return (
                  <li key={ti as string} className="flex gap-3">
                    <Icono size={22} className="mt-0.5 shrink-0" style={{ color: PRIMARIO }} />
                    <span>
                      <span className="block font-bold">{ti as string}</span>
                      <span className="block text-black/60">{d as string}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-black/10 pt-5">
              {[
                ["+12,000", "equipos vendidos"],
                ["3", "sucursales"],
                ["4.8", "en Google"],
              ].map(([n, x]) => (
                <div key={x}>
                  <dt className="text-[1.7rem] font-extrabold leading-none" style={{ fontFamily: TITULO }}>
                    {n}
                  </dt>
                  <dd className="mt-1 text-[0.8rem] text-black/55">{x}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-xs text-black/40">Cifras de ejemplo.</p>
          </div>
        </div>
      </section>

      {/* formas de pago */}
      <section className="mx-auto max-w-7xl px-5 pt-12 sm:pt-16">
        <div className="grid md:grid-cols-[1fr_2fr] gap-6 items-center rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
          <div>
            <p className="inline-flex items-center gap-2 text-[1.3rem] font-extrabold">
              <Lock size={20} style={{ color: PRIMARIO }} /> Formas de pago
            </p>
            <p className="mt-1 text-sm text-black/55">El sitio va cifrado. Nunca vemos el número completo de tu tarjeta.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              [CreditCard, "Tarjeta", "Contado o hasta 12 cuotas."],
              [Banknote, "Transferencia", "Sube tu comprobante; lo verificamos en menos de 2 horas."],
              [Store, "En sucursal", "Aparta en línea y paga al recoger."],
            ].map(([I, ti, d]) => {
              const Icono = I as typeof Check;
              return (
                <div key={ti as string} className="rounded-xl p-4" style={{ background: FONDO }}>
                  <Icono size={20} style={{ color: PRIMARIO }} />
                  <p className="mt-2 font-bold">{ti as string}</p>
                  <p className="text-sm text-black/55">{d as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Reparaciones t={t} alAgendado={(id) => setAviso(`Tu reparación quedó con el código ${id}`)} alRastrear={rastrear} />

      <Rastreo t={t} codigo={codigo} setCodigo={setCodigo} />

      <Devoluciones t={t} />

      {/* sucursales */}
      <section id="sucursales" className="scroll-mt-28 mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <h2 className="text-[1.8rem] sm:text-[2.3rem] font-extrabold !text-[#1c1230]" style={{ fontFamily: TITULO }}>
          Sucursales
        </h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {SUCURSALES.map((s) => (
            <div key={s.id} className="rounded-2xl bg-white border border-black/[0.06] p-5">
              <MapPin size={22} style={{ color: PRIMARIO }} />
              <p className="mt-2 text-[1.15rem] font-bold">Órbita {s.nombre}</p>
              <p className="text-black/60">{s.direccion}</p>
              <p className="mt-1 text-sm text-black/50">{s.horario}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-black/45">Direcciones de ejemplo.</p>
      </section>

      {/* opiniones y preguntas */}
      <section className="mx-auto max-w-7xl px-5 pb-14 sm:pb-20 grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-[1.8rem] sm:text-[2.3rem] font-extrabold !text-[#1c1230]" style={{ fontFamily: TITULO }}>
            Lo que dicen
          </h2>
          <div className="mt-5 space-y-3">
            {[
              { n: "Andrea C.", t: "Compré el iPhone 13 seminuevo y la batería venía al 91%. Me llegó al día siguiente y vi dónde iba." },
              { n: "Jorge O.", t: "Me cambiaron la pantalla en dos horas mientras hacía mandados. El precio fue el de la página." },
              { n: "Gabriela C.", t: "Pagué el S24 en 12 cuotas, sin papeleo. Muy fácil todo en línea." },
            ].map((o) => (
              <figure key={o.n} className="rounded-2xl bg-white border border-black/[0.06] p-5">
                <p className="text-[#e5a400] tracking-[0.15em]" aria-label="5 de 5">
                  ★★★★★
                </p>
                <blockquote className="mt-2">“{o.t}”</blockquote>
                <figcaption className="mt-2 text-sm font-semibold text-black/60">{o.n}</figcaption>
              </figure>
            ))}
            <p className="text-xs text-black/45">Opiniones de ejemplo.</p>
          </div>
        </div>
        <div>
          <h2 className="text-[1.8rem] sm:text-[2.3rem] font-extrabold !text-[#1c1230]" style={{ fontFamily: TITULO }}>
            Preguntas frecuentes
          </h2>
          <div className="mt-5 divide-y divide-black/10 rounded-2xl bg-white border border-black/[0.06] px-5">
            {[
              ["¿Los celulares están liberados?", "Sí, todos funcionan con Tigo, Claro y cualquier compañía."],
              ["¿Cuánto tarda el envío?", `En la capital 24 horas, en los departamentos 48. Gratis desde ${qz(ENVIO_GRATIS)}.`],
              ["¿Qué pasa si mi pago con tarjeta es rechazado?", "No se cobra nada. Puedes intentar con otra tarjeta, pagar por transferencia o pagar al recibir."],
              ["¿Puedo devolver un producto?", "Sí, en los primeros 7 días si está sellado o si llegó con falla. Te devolvemos tu dinero o te lo cambiamos."],
            ].map(([qq, a]) => (
              <details key={qq} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {qq}
                  <span className="grid place-items-center w-7 h-7 shrink-0 rounded-full bg-black/5 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-black/65">{a}</p>
              </details>
            ))}
          </div>
          <a href="https://wa.me/" onClick={(e) => e.preventDefault()} className="mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-bold text-white" style={{ background: "#1f9d55" }}>
            <MessageCircle size={18} /> ¿Otra duda? Escríbenos
          </a>
          <button type="button" onClick={alAdmin} className="mt-6 flex items-center gap-2 text-sm font-semibold text-black/45 hover:text-black">
            <Lock size={14} /> Acceso para el dueño
          </button>
        </div>
      </section>

      {/* carrito flotante en celular */}
      {piezas > 0 && !carroAbierto && (
        <button type="button" onClick={() => setCarroAbierto(true)} className="md:hidden fixed bottom-5 inset-x-5 z-30 flex items-center justify-between rounded-xl px-5 py-3.5 font-bold text-white shadow-xl active:scale-[0.98]" style={{ background: TINTA }}>
          <span className="inline-flex items-center gap-2">
            <ShoppingCart size={18} /> Ver carrito ({piezas})
          </span>
          <span>{qz(subtotal)}</span>
        </button>
      )}

      {aviso && (
        <div role="status" className="fixed top-24 left-1/2 -translate-x-1/2 z-40 inline-flex max-w-[92vw] items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[0.9rem] font-semibold shadow-xl border border-black/10">
          <Check size={16} style={{ color: PRIMARIO }} /> {aviso}
        </div>
      )}

      <Modal abierto={!!ficha} alCerrar={() => setFicha(null)} titulo={ficha?.nombre ?? "Producto"} ancho="sm:w-[min(56rem,94vw)]">
        {ficha && (
          <Ficha
            key={ficha.id}
            p={ficha}
            t={t}
            alAgregar={(l) => {
              agregar(l);
              setFicha(null);
              setCarroAbierto(true);
            }}
          />
        )}
      </Modal>

      <Cajon abierto={carroAbierto} alCerrar={() => setCarroAbierto(false)} fondo="#fff">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
            <p className="text-[1.4rem] font-extrabold" style={{ fontFamily: TITULO }}>
              Tu carrito
            </p>
            <button type="button" onClick={() => setCarroAbierto(false)} aria-label="Cerrar" className="grid place-items-center w-9 h-9 rounded-full hover:bg-black/5">
              <X size={20} />
            </button>
          </div>
          {carro.length === 0 ? (
            <div className="flex-1 grid place-items-center px-8 text-center">
              <div>
                <p className="font-semibold text-[1.1rem]">Tu carrito está vacío</p>
                <button type="button" onClick={() => setCarroAbierto(false)} className="mt-4 rounded-lg px-5 py-2.5 font-bold text-white" style={{ background: TINTA }}>
                  Ver catálogo
                </button>
              </div>
            </div>
          ) : (
            <>
              <ul className="flex-1 overflow-y-auto divide-y divide-black/10 px-6">
                {carro.map((l, k) => (
                  <li key={l.id + l.detalle} className="py-4 flex gap-3">
                    <img src={enLista(t.productos, l.id).foto} alt="" className="w-20 h-20 shrink-0 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <p className="font-bold leading-tight">{l.nombre}</p>
                        <button type="button" aria-label={`Quitar ${l.nombre}`} onClick={() => setCarro((c) => c.filter((_, i) => i !== k))} className="text-black/40 hover:text-black">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-black/55">{l.detalle}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <Contador valor={l.cantidad} alCambiar={(v) => setCarro((c) => (v <= 0 ? c.filter((_, i) => i !== k) : c.map((x, i) => (i === k ? { ...x, cantidad: v } : x))))} />
                        <p className="font-bold">{qz(l.precio * l.cantidad)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-black/10 px-6 py-5 space-y-3">
                <p className="flex justify-between text-black/60">
                  <span>Subtotal</span>
                  <span>{qz(subtotal)}</span>
                </p>
                <p className="text-sm text-black/55">{subtotal >= ENVIO_GRATIS ? "Tu envío es gratis." : `Envío ${qz(ENVIO)}, gratis desde ${qz(ENVIO_GRATIS)}. O recoge en sucursal sin costo.`}</p>
                <button
                  type="button"
                  onClick={() => {
                    setCarroAbierto(false);
                    setPagando(true);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg py-3.5 font-bold text-white active:scale-[0.98]"
                  style={{ background: PRIMARIO }}
                >
                  <Lock size={17} /> Ir a pagar
                </button>
              </div>
            </>
          )}
        </div>
      </Cajon>

      <Modal abierto={pagando} alCerrar={() => setPagando(false)} titulo="Pagar" ancho="sm:w-[min(40rem,94vw)]">
        {pagando && (
          <Pago
            t={t}
            carro={carro}
            subtotal={subtotal}
            alTerminar={(p) => {
              if (p.estado !== "rechazado") setCarro([]);
            }}
            alRastrear={(id) => {
              setPagando(false);
              rastrear(id);
            }}
            alCerrar={() => setPagando(false)}
          />
        )}
      </Modal>
    </div>
  );
}

/* ---------------- ficha del producto ---------------- */

function Ficha({ p, t, alAgregar }: { p: Producto; t: Tienda; alAgregar: (l: Linea) => void }) {
  const [color, setColor] = useState(p.colores[0]);
  const [v, setV] = useState(p.variantes[0]);
  const [n, setN] = useState(1);
  const disp = disponibilidad(t.stock, p.id);
  const enSucursal = SUCURSALES.filter((s) => (t.stock[p.id]?.[s.id] ?? 0) > 0);
  return (
    <div className="grid sm:grid-cols-[1fr_1.1fr]">
      <div className="relative min-h-[260px] sm:min-h-full" style={{ background: FONDO }}>
        <img src={p.foto} alt={p.nombre} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-6 sm:p-8">
        <p className="text-sm font-semibold text-black/50">
          {p.marca} · {p.condicion}
        </p>
        <h3 className="pr-8 text-[1.9rem] leading-tight font-extrabold !text-[#1c1230]" style={{ fontFamily: TITULO }}>
          {p.nombre}
        </h3>
        <p className="mt-1 text-black/60">{p.resumen}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl p-3" style={{ background: LAVANDA }}>
            <p className="text-[0.72rem] font-bold uppercase tracking-wide" style={{ color: PRIMARIO }}>
              Efectivo o transferencia
            </p>
            <p className="text-[1.6rem] font-extrabold leading-none mt-1">{qz(efectivo(v.precio))}</p>
          </div>
          <div className="rounded-xl border border-black/10 p-3">
            <p className="text-[0.72rem] font-bold uppercase tracking-wide text-black/50">Con tarjeta</p>
            <p className="text-[1.25rem] font-extrabold leading-none mt-1">{qz(v.precio)}</p>
            {v.precio >= 1000 && <p className="mt-1 text-[0.75rem] text-black/55">12 cuotas de {qz(cuota(v.precio, 12))}</p>}
          </div>
        </div>
        {p.antes && <p className="mt-1 text-sm text-black/45">Antes <span className="line-through">{qz(p.antes)}</span></p>}

        <p className="mt-5 text-sm font-semibold">Color: {color.nombre}{p.colores.length === 1 && p.categoria !== "Accesorios" ? " (el de la foto). Pregunta por otros colores." : ""}</p>
        <div className={`mt-2 flex gap-2 ${p.colores.length > 1 ? "" : "hidden"}`}>
          {p.colores.map((c) => (
            <button key={c.nombre} type="button" onClick={() => setColor(c)} aria-label={c.nombre} aria-pressed={color.nombre === c.nombre} className="w-9 h-9 rounded-full transition active:scale-90" style={{ background: c.hex, boxShadow: color.nombre === c.nombre ? `0 0 0 2px #fff, 0 0 0 4px ${PRIMARIO}` : "inset 0 0 0 1px rgba(0,0,0,.12)" }} />
          ))}
        </div>
        {p.variantes.length > 1 && (
          <>
            <p className="mt-4 text-sm font-semibold">Capacidad</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.variantes.map((x) => (
                <button key={x.capacidad} type="button" onClick={() => setV(x)} aria-pressed={v === x} className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold transition ${v === x ? "" : "border-black/10"}`} style={v === x ? { borderColor: PRIMARIO, background: LAVANDA } : undefined}>
                  {x.capacidad} · {qz(efectivo(x.precio))}
                </button>
              ))}
            </div>
          </>
        )}
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[0.88rem]">
          {p.detalles.map((d) => (
            <li key={d} className="flex gap-1.5">
              <Check size={15} className="mt-0.5 shrink-0" style={{ color: PRIMARIO }} /> {d}
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-2xl p-3 text-[0.85rem]" style={{ background: FONDO }}>
          <p>
            <b>Garantía:</b> {p.garantia}
          </p>
          <p>
            <b>De dónde viene:</b> {p.origen}
          </p>
          <p className={disp.tipo === "agotado" ? "text-[#b42318]" : ""}>
            <b>Disponible en:</b> {enSucursal.length ? enSucursal.map((s) => s.nombre).join(", ") : "agotado por ahora"}
          </p>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <Contador valor={n} alCambiar={(x) => setN(Math.max(1, x))} />
          <button
            type="button"
            disabled={disp.tipo === "agotado"}
            onClick={() => alAgregar({ id: p.id, nombre: p.nombre, detalle: [v.capacidad, color.nombre].filter(Boolean).join(" · "), precio: v.precio, cantidad: n })}
            className="flex-1 rounded-lg py-3 font-bold text-white disabled:opacity-40 active:scale-[0.98] transition"
            style={{ background: TINTA }}
          >
            {disp.tipo === "agotado" ? "Agotado" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- pago ---------------- */

const TARJETAS_PRUEBA = [
  { numero: "4242 4242 4242 4242", texto: "Tarjeta aprobada" },
  { numero: "4000 0000 0000 0002", texto: "Tarjeta rechazada" },
];

function Pago({ t, carro, subtotal, alTerminar, alRastrear, alCerrar }: { t: Tienda; carro: Linea[]; subtotal: number; alTerminar: (p: Pedido) => void; alRastrear: (id: string) => void; alCerrar: () => void }) {
  const [paso, setPaso] = useState<"datos" | "pago" | "procesando" | "listo">("datos");
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [entrega, setEntrega] = useState<"envio" | "tienda">("envio");
  const [direccion, setDireccion] = useState("");
  const [sucursal, setSucursal] = useState(SUCURSALES[0].id);
  const [metodo, setMetodo] = useState<Metodo>("tarjeta");
  const [tarjeta, setTarjeta] = useState({ numero: "", nombre: "", vence: "", cvv: "" });
  const [cuotas, setCuotas] = useState(1);
  const [comprobante, setComprobante] = useState("");
  const [error, setError] = useState("");
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const envio = entrega === "tienda" || subtotal >= ENVIO_GRATIS ? 0 : ENVIO;
  // con tarjeta va el precio normal; en efectivo, transferencia o al recibir, el precio de oferta
  const subEfectivo = carro.reduce((s, l) => s + efectivo(l.precio) * l.cantidad, 0);
  const subMetodo = metodo === "tarjeta" ? subtotal : subEfectivo;
  const total = subMetodo + envio;
  const campo = "mt-1.5 w-full rounded-xl border border-black/15 px-3 py-2.5 focus:outline-none focus:border-[#6d28d9]";

  function crear(estado: Pedido["estado"], extra: Partial<Pedido> = {}) {
    const p: Pedido = {
      id: sigId("OR", t.pedidos, 1041),
      fecha: new Date().toISOString(),
      cliente: nombre.trim(),
      telefono: tel.trim(),
      entrega: entrega === "envio" ? { tipo: "envio", direccion: direccion.trim() } : { tipo: "tienda", sucursal },
      lineas: metodo === "tarjeta" ? carro : carro.map((l) => ({ ...l, precio: efectivo(l.precio) })),
      envio,
      total,
      metodo,
      estado,
      sucursal: entrega === "tienda" ? sucursal : "z10",
      nuevo: true,
      ...extra,
    };
    t.setPedidos((ps) => [p, ...ps.map((x) => ({ ...x, nuevo: false }))]);
    // si se pagó, se descuenta del inventario de la sucursal que despacha
    if (estado === "pagado" || estado === "preparando")
      t.setStock((s) => {
        const n = structuredClone(s);
        carro.forEach((l) => {
          const suc = n[l.id]?.[p.sucursal] ? p.sucursal : Object.keys(n[l.id] ?? {}).find((k) => n[l.id][k] > 0);
          if (suc) n[l.id][suc] = Math.max(0, n[l.id][suc] - l.cantidad);
        });
        return n;
      });
    setPedido(p);
    alTerminar(p);
    setPaso("listo");
  }

  function pagar() {
    setError("");
    if (metodo === "tarjeta") {
      const num = tarjeta.numero.replace(/\D/g, "");
      if (num.length !== 16) return setError("Escribe los 16 dígitos de la tarjeta, o usa una de prueba.");
      if (!/^\d{2}\/\d{2}$/.test(tarjeta.vence)) return setError("Escribe el vencimiento como MM/AA.");
      if (tarjeta.cvv.length < 3) return setError("Escribe el código de 3 dígitos.");
      setPaso("procesando");
      // la pasarela de pago responde aprobado o rechazado; aquí no se guarda la tarjeta
      cobrarConTarjeta({ numero: num, vence: tarjeta.vence, cvv: tarjeta.cvv, monto: total, cuotas }).then((r) =>
        r.aprobado ? crear("pagado", { tarjeta: r.ultimos4, cuotas }) : crear("rechazado", { tarjeta: r.ultimos4, motivoRechazo: r.motivo, cuotas }),
      );
    } else if (metodo === "transferencia") {
      if (!comprobante) return setError("Sube la foto de tu comprobante.");
      crear("pago-pendiente");
    } else {
      crear("preparando");
    }
  }

  if (paso === "procesando")
    return (
      <div className="px-6 py-16 text-center">
        <span className="mx-auto block w-10 h-10 rounded-full border-4 border-black/10 animate-spin" style={{ borderTopColor: PRIMARIO }} />
        <p className="mt-4 font-semibold">Procesando tu pago de forma segura…</p>
        <p className="text-sm text-black/50">No cierres esta ventana.</p>
      </div>
    );

  if (paso === "listo" && pedido) {
    const e = ESTADOS_PEDIDO[pedido.estado];
    return (
      <div className="px-6 pt-8 pb-7 text-center">
        <span className="mx-auto grid place-items-center w-14 h-14 rounded-full" style={{ background: e.fondo, color: e.color }}>
          {pedido.estado === "rechazado" ? <X size={28} /> : <Check size={28} />}
        </span>
        {pedido.estado === "rechazado" ? (
          <>
            <h3 className="mt-4 text-[1.6rem] font-extrabold !text-[#1c1230]" style={{ fontFamily: TITULO }}>
              Tu banco rechazó el pago
            </h3>
            <p className="mt-1 text-black/60">Motivo: {pedido.motivoRechazo}. No se hizo ningún cobro.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
              <button type="button" onClick={() => { setPaso("pago"); setTarjeta({ numero: "", nombre: "", vence: "", cvv: "" }); }} className="rounded-lg px-5 py-3 font-bold text-white" style={{ background: TINTA }}>
                Probar con otra tarjeta
              </button>
              <button type="button" onClick={() => { setPaso("pago"); setMetodo("transferencia"); }} className="rounded-lg px-5 py-3 font-bold border border-black/15">
                Pagar por transferencia
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="mt-4 text-[1.6rem] font-extrabold !text-[#1c1230]" style={{ fontFamily: TITULO }}>
              {pedido.estado === "pagado" ? "¡Pago aprobado!" : pedido.metodo === "contra-entrega" ? "¡Pedido confirmado!" : "Recibimos tu comprobante"}
            </h3>
            <p className="mt-1 text-black/60">
              {pedido.estado === "pagado"
                ? `Tu pedido ${pedido.id} ya está pagado${pedido.cuotas && pedido.cuotas > 1 ? ` en ${pedido.cuotas} cuotas` : ""}. Te avisamos por WhatsApp cuando salga.`
                : pedido.metodo === "contra-entrega"
                  ? `Pagas ${qz(pedido.total)} al recibir, en efectivo o con tarjeta. Revisa tu equipo antes de pagar.`
                  : `Verificamos tu transferencia en menos de 2 horas. Tu pedido es el ${pedido.id}.`}
            </p>
            <p className="mt-4 inline-block rounded-xl px-4 py-2 font-mono text-[1.2rem] font-bold" style={{ background: FONDO }}>
              {pedido.id}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
              <button type="button" onClick={() => alRastrear(pedido.id)} className="rounded-lg px-5 py-3 font-bold text-white" style={{ background: PRIMARIO }}>
                Rastrear mi pedido
              </button>
              <button type="button" onClick={alCerrar} className="rounded-lg px-5 py-3 font-bold border border-black/15">
                Seguir viendo
              </button>
            </div>
            <p className="mt-5 text-xs text-black/45">Entra al panel del dueño para ver cómo le aparece este pedido.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-6">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className={paso === "datos" ? "" : "text-black/40"}>1. Tus datos</span>
        <span className="text-black/25">→</span>
        <span className={paso === "pago" ? "" : "text-black/40"}>2. Pago</span>
      </div>
      {paso === "datos" ? (
        <form
          className="mt-5 space-y-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!nombre.trim()) return setError("Escribe tu nombre.");
            if (tel.replace(/\D/g, "").length < 8) return setError("Escribe tu teléfono de 8 dígitos.");
            if (entrega === "envio" && !direccion.trim()) return setError("Escribe la dirección de entrega.");
            setError("");
            setPaso("pago");
          }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-sm font-semibold">
              Nombre
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre y apellido" className={campo} />
            </label>
            <label className="block text-sm font-semibold">
              Teléfono
              <input value={tel} inputMode="tel" onChange={(e) => setTel(e.target.value.replace(/[^\d -]/g, ""))} placeholder="5555 5555" className={campo} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["envio", Truck, "Envío a domicilio", subtotal >= ENVIO_GRATIS ? "Gratis" : qz(ENVIO)],
              ["tienda", Store, "Recoger en sucursal", "Sin costo"],
            ].map(([id, I, ti, pr]) => {
              const Icono = I as typeof Truck;
              return (
                <button key={id as string} type="button" onClick={() => setEntrega(id as "envio" | "tienda")} aria-pressed={entrega === id} className={`rounded-2xl border-2 p-3 text-left transition ${entrega === id ? "" : "border-black/10"}`} style={entrega === id ? { borderColor: PRIMARIO, background: LAVANDA } : undefined}>
                  <Icono size={18} />
                  <span className="mt-1 block font-semibold text-sm">{ti as string}</span>
                  <span className="block text-xs text-black/55">{pr as string}</span>
                </button>
              );
            })}
          </div>
          {entrega === "envio" ? (
            <label className="block text-sm font-semibold">
              Dirección
              <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Zona, colonia, calle y número" className={campo} />
            </label>
          ) : (
            <label className="block text-sm font-semibold">
              Sucursal
              <select value={sucursal} onChange={(e) => setSucursal(e.target.value)} className={`${campo} bg-white`}>
                {SUCURSALES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </label>
          )}
          {error && <p className="text-sm text-[#b42318]">{error}</p>}
          <Resumen subtotal={subtotal} envio={envio} />
          <button type="submit" className="w-full rounded-lg py-3.5 font-bold text-white" style={{ background: TINTA }}>
            Continuar al pago
          </button>
        </form>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="grid sm:grid-cols-3 gap-2">
            {(
              [
                ["tarjeta", CreditCard, "Tarjeta", `${qz(subtotal + envio)} · hasta 12 cuotas`],
                ["transferencia", Banknote, "Transferencia", `${qz(subEfectivo + envio)} precio efectivo`],
                ["contra-entrega", Truck, "Paga al recibir", `${qz(subEfectivo + envio)} · revisa antes`],
              ] as [Metodo, typeof Truck, string, string][]
            ).map(([id, Icono, ti, d]) => (
              <button key={id} type="button" onClick={() => { setMetodo(id); setError(""); }} aria-pressed={metodo === id} className={`flex flex-col items-start gap-1 rounded-2xl border-2 p-3 text-left transition ${metodo === id ? "" : "border-black/10"}`} style={metodo === id ? { borderColor: PRIMARIO, background: LAVANDA } : undefined}>
                <span className="inline-flex items-center gap-2 font-semibold">
                  <Icono size={18} /> {ti}
                </span>
                <span className="text-[0.75rem] text-black/55">{d}</span>
              </button>
            ))}
          </div>
          {metodo === "tarjeta" ? (
            <>
              <div className="rounded-2xl border border-dashed border-black/20 p-3 text-[0.82rem]">
                <p className="font-semibold">Demo: no escribas datos reales. Usa una tarjeta de prueba:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TARJETAS_PRUEBA.map((x) => (
                    <button key={x.numero} type="button" onClick={() => setTarjeta({ numero: x.numero, nombre: "Cliente de prueba", vence: "12/29", cvv: "123" })} className="rounded-full bg-black/5 px-3 py-1.5 font-semibold hover:bg-black/10">
                      {x.texto}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block text-sm font-semibold">
                Número de tarjeta
                <input
                  value={tarjeta.numero}
                  inputMode="numeric"
                  autoComplete="off"
                  onChange={(e) => setTarjeta({ ...tarjeta, numero: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ") })}
                  placeholder="0000 0000 0000 0000"
                  className={`${campo} font-mono`}
                />
              </label>
              <div className="grid grid-cols-[1fr_90px_80px] gap-3">
                <label className="block text-sm font-semibold">
                  Nombre en la tarjeta
                  <input value={tarjeta.nombre} autoComplete="off" onChange={(e) => setTarjeta({ ...tarjeta, nombre: e.target.value })} className={campo} />
                </label>
                <label className="block text-sm font-semibold">
                  Vence
                  <input
                    value={tarjeta.vence}
                    inputMode="numeric"
                    autoComplete="off"
                    onChange={(e) => {
                      const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setTarjeta({ ...tarjeta, vence: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d });
                    }}
                    placeholder="MM/AA"
                    className={campo}
                  />
                </label>
                <label className="block text-sm font-semibold">
                  CVV
                  <input value={tarjeta.cvv} inputMode="numeric" autoComplete="off" onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="123" className={campo} />
                </label>
              </div>
              {subtotal + envio >= 1000 && (
                <label className="block text-sm font-semibold">
                  Cuotas
                  <select value={cuotas} onChange={(e) => setCuotas(Number(e.target.value))} className={`${campo} bg-white`}>
                    {[1, 3, 6, 12].map((m) => (
                      <option key={m} value={m}>
                        {m === 1 ? `Al contado · ${qz(total)}` : `${m} cuotas de ${qz(cuota(total, m))}`}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </>
          ) : metodo === "contra-entrega" ? (
            <div className="rounded-2xl p-4 text-[0.9rem]" style={{ background: LAVANDA }}>
              <p className="font-semibold">Pagas {qz(total)} cuando te llegue.</p>
              <ul className="mt-2 space-y-1 text-black/70">
                <li>• Revisa tu equipo antes de pagar.</li>
                <li>• Paga en efectivo o con tarjeta al repartidor{entrega === "tienda" ? " o en la sucursal" : ""}.</li>
                <li>• Te escribimos por WhatsApp para confirmar la hora.</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-2xl p-4 text-[0.9rem]" style={{ background: FONDO }}>
                <p className="font-semibold">Transfiere {qz(total)} a:</p>
                <p className="mt-1">Banco de ejemplo · Monetaria</p>
                <p className="font-mono">000-000000-0</p>
                <p>A nombre de Órbita Celulares, S.A.</p>
              </div>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-black/15 p-4">
                <span className="text-sm">
                  <b>{comprobante || "Sube la foto de tu comprobante"}</b>
                  <span className="block text-black/50">{comprobante ? "Listo, lo revisamos al recibir el pedido." : "JPG, PNG o PDF"}</span>
                </span>
                <span className="rounded-full px-3 py-1.5 text-sm font-semibold text-white" style={{ background: TINTA }}>
                  {comprobante ? "Cambiar" : "Elegir"}
                </span>
                <input type="file" accept="image/*,.pdf" className="sr-only" onChange={(e) => setComprobante(e.target.files?.[0]?.name ?? "")} />
              </label>
              <button type="button" onClick={() => setComprobante("comprobante-de-prueba.jpg")} className="text-sm font-semibold underline underline-offset-4 text-black/60">
                Usar un comprobante de prueba
              </button>
            </div>
          )}
          {error && <p className="text-sm text-[#b42318]">{error}</p>}
          <Resumen subtotal={subMetodo} envio={envio} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setPaso("datos")} className="rounded-lg px-5 py-3.5 font-bold border border-black/15">
              Atrás
            </button>
            <button type="button" onClick={pagar} className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg py-3.5 font-bold text-white" style={{ background: PRIMARIO }}>
              <Lock size={16} /> {metodo === "tarjeta" ? `Pagar ${qz(total)}` : metodo === "transferencia" ? "Enviar comprobante" : "Confirmar pedido"}
            </button>
          </div>
          <p className="flex items-center justify-center gap-1.5 text-xs text-black/50">
            <ShieldCheck size={14} /> Pago cifrado. En la tienda real lo procesa una pasarela certificada.
          </p>
        </div>
      )}
    </div>
  );
}

function Resumen({ subtotal, envio }: { subtotal: number; envio: number }) {
  return (
    <div className="rounded-2xl p-4 text-[0.92rem]" style={{ background: FONDO }}>
      <p className="flex justify-between text-black/60">
        <span>Subtotal</span>
        <span>{qz(subtotal)}</span>
      </p>
      <p className="flex justify-between text-black/60">
        <span>Envío</span>
        <span>{envio ? qz(envio) : "Gratis"}</span>
      </p>
      <p className="mt-1 flex justify-between text-[1.1rem] font-extrabold">
        <span>Total</span>
        <span>{qz(subtotal + envio)}</span>
      </p>
    </div>
  );
}

/* ---------------- reparaciones ---------------- */

function Reparaciones({ t, alAgendado, alRastrear }: { t: Tienda; alAgendado: (id: string) => void; alRastrear: (id: string) => void }) {
  const [modelo, setModelo] = useState(MODELOS_REPARACION[0]);
  const [falla, setFalla] = useState(FALLAS[0]);
  const [nombre, setNombre] = useState("");
  const [sucursal, setSucursal] = useState(SUCURSALES[0].id);
  const [hecho, setHecho] = useState<string | null>(null);
  const precio = falla.precio[modelo.gama];
  return (
    <section id="reparaciones" className="scroll-mt-16 mx-auto max-w-7xl px-5 py-14 sm:py-20">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-stretch">
        <div className="relative overflow-hidden rounded-3xl min-h-[260px]">
          <img src={tecnico} alt="Técnico reparando la placa de un celular" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(13,17,23,.9),transparent_60%)]" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <p className="inline-flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-wider" style={{ color: AMARILLO }}>
              <Wrench size={15} /> Taller propio
            </p>
            <p className="mt-1 text-[1.5rem] font-extrabold leading-tight" style={{ fontFamily: TITULO }}>
              Reparamos tu celular, de cualquier marca
            </p>
            <p className="mt-1 text-white/70">Repuestos de calidad y 90 días de garantía en la reparación.</p>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 sm:p-8">
          <h2 className="text-[1.9rem] font-extrabold !text-[#1c1230]" style={{ fontFamily: TITULO }}>
            Cotiza tu reparación
          </h2>
          <p className="mt-4 text-sm font-semibold">1. ¿Qué celular tienes?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {MODELOS_REPARACION.map((m) => (
              <button key={m.nombre} type="button" onClick={() => setModelo(m)} aria-pressed={modelo === m} className={`rounded-full px-3.5 py-2 text-[0.85rem] font-semibold border transition ${modelo === m ? "border-transparent text-white" : "border-black/12"}`} style={modelo === m ? { background: TINTA } : undefined}>
                {m.nombre}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold">2. ¿Qué le pasa?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {FALLAS.map((f) => (
              <button key={f.id} type="button" onClick={() => setFalla(f)} aria-pressed={falla === f} className={`rounded-full px-3.5 py-2 text-[0.85rem] font-semibold border transition ${falla === f ? "border-transparent text-white" : "border-black/12"}`} style={falla === f ? { background: TINTA } : undefined}>
                {f.nombre}
              </button>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-3 rounded-2xl p-4" style={{ background: FONDO }}>
            <div>
              <p className="text-sm text-black/55">Precio aproximado</p>
              <p className="text-[2rem] font-extrabold leading-none">{qz(precio)}</p>
            </div>
            <p className="text-sm text-black/60">Listo en {falla.tiempo}</p>
          </div>
          {hecho ? (
            <div className="mt-4 rounded-2xl border border-black/10 p-4">
              <p className="font-semibold">Listo. Tu código de reparación es <span className="font-mono">{hecho}</span>.</p>
              <p className="text-sm text-black/60">Llévalo a la sucursal de {sucursalPor(sucursal).nombre}. Con ese código ves en qué va tu celular.</p>
              <button type="button" onClick={() => alRastrear(hecho)} className="mt-3 text-sm font-bold underline underline-offset-4">
                Ver en qué va
              </button>
            </div>
          ) : (
            <form
              className="mt-4 grid sm:grid-cols-[1fr_auto_auto] gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!nombre.trim()) return;
                const id = sigId("RP", t.reparaciones, 512);
                t.setReparaciones((r) => [{ id, cliente: nombre.trim(), modelo: modelo.nombre, falla: falla.nombre, precio, fecha: new Date().toISOString(), estado: "recibido", sucursal, nueva: true }, ...r.map((x) => ({ ...x, nueva: false }))]);
                setHecho(id);
                alAgendado(id);
              }}
            >
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" required className="rounded-full border border-black/15 px-4 py-3 focus:outline-none focus:border-[#6d28d9]" />
              <select value={sucursal} onChange={(e) => setSucursal(e.target.value)} className="rounded-full border border-black/15 bg-white px-4 py-3">
                {SUCURSALES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
              <button type="submit" className="rounded-lg px-5 py-3 font-bold text-white" style={{ background: PRIMARIO }}>
                Agendar
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- rastreo ---------------- */

function Rastreo({ t, codigo, setCodigo }: { t: Tienda; codigo: string; setCodigo: (c: string) => void }) {
  const [texto, setTexto] = useState(codigo);
  useEffect(() => setTexto(codigo), [codigo]);
  const c = codigo.trim().toUpperCase();
  const pedido = useMemo(() => t.pedidos.find((p) => p.id === c), [t.pedidos, c]);
  const rep = useMemo(() => t.reparaciones.find((r) => r.id === c), [t.reparaciones, c]);

  return (
    <section id="rastreo" className="scroll-mt-16 px-5">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center rounded-3xl bg-white p-6 sm:p-10">
        <div>
          <p className="inline-flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-[0.14em]" style={{ color: PRIMARIO }}>
            <PackageSearch size={16} /> Rastreo
          </p>
          <h2 className="mt-2 text-[2rem] sm:text-[2.6rem] leading-[1.05] font-extrabold !text-[#1c1230]" style={{ fontFamily: TITULO }}>
            ¿Dónde va mi pedido?
          </h2>
          <p className="mt-2 text-black/60">Escribe tu código de pedido o de reparación.</p>
          <form
            className="mt-5 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setCodigo(texto);
            }}
          >
            <label className="flex-1 flex items-center gap-2 rounded-full border border-black/15 px-4 focus-within:border-[#6d28d9]">
              <Search size={18} className="text-black/40" />
              <input value={texto} onChange={(e) => setTexto(e.target.value.toUpperCase())} placeholder="OR-1038 o RP-512" className="w-full py-3 font-mono focus:outline-none" />
            </label>
            <button type="submit" className="rounded-lg px-5 font-bold text-white" style={{ background: TINTA }}>
              Buscar
            </button>
          </form>
          <p className="mt-2 text-xs text-black/45">Prueba con OR-1038 (en camino) o RP-512 (reparación).</p>
        </div>
        <div className="min-h-[220px]">
          {pedido ? (
            <LineaTiempo
              titulo={`Pedido ${pedido.id}`}
              sub={`${pedido.lineas.map((l) => l.nombre).join(", ")} · ${fechaCorta(pedido.fecha)}`}
              pasos={PASOS_RASTREO.map((x) => ESTADOS_PEDIDO[x].texto)}
              actual={PASOS_RASTREO.indexOf(pedido.estado)}
              aviso={
                pedido.estado === "pago-pendiente"
                  ? "Estamos verificando tu transferencia. Te avisamos al confirmarla."
                  : pedido.estado === "rechazado"
                    ? `El pago fue rechazado (${pedido.motivoRechazo}). No se cobró nada.`
                    : pedido.estado === "devuelto"
                      ? "Este pedido fue devuelto y tu dinero reembolsado."
                      : pedido.guia
                        ? `Guía de envío ${pedido.guia}. Llega hoy o mañana.`
                        : undefined
              }
            />
          ) : rep ? (
            <LineaTiempo titulo={`Reparación ${rep.id}`} sub={`${rep.modelo} · ${rep.falla}`} pasos={PASOS_REPARACION.map((x) => TEXTO_REPARACION[x])} actual={PASOS_REPARACION.indexOf(rep.estado)} aviso={rep.estado === "listo" ? `Ya puede pasar por él a ${sucursalPor(rep.sucursal).nombre}. Total: ${qz(rep.precio)}.` : undefined} />
          ) : c ? (
            <p className="rounded-2xl p-5 text-black/60" style={{ background: FONDO }}>
              No encontramos el código {c}. Revisa que esté bien escrito.
            </p>
          ) : (
            <div className="rounded-2xl p-5 text-[0.92rem]" style={{ background: FONDO }}>
              <p className="font-bold">Así funciona</p>
              <ol className="mt-3 space-y-2 text-black/65">
                <li>1. Al pagar te damos tu código de pedido (OR-…).</li>
                <li>2. Si dejas tu celular a reparar, te damos un código RP-….</li>
                <li>3. Escríbelo aquí y ve en qué paso va, sin llamar ni escribir.</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function LineaTiempo({ titulo, sub, pasos, actual, aviso }: { titulo: string; sub: string; pasos: string[]; actual: number; aviso?: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: FONDO }}>
      <p className="font-extrabold text-[1.2rem]">{titulo}</p>
      <p className="text-sm text-black/55">{sub}</p>
      <ol className="mt-5 space-y-0">
        {pasos.map((p, i) => {
          const hecho = actual >= 0 && i <= actual;
          return (
            <li key={p} className="relative flex items-start gap-3 pb-4 last:pb-0">
              {i < pasos.length - 1 && <span className="absolute left-[11px] top-6 bottom-0 w-0.5" style={{ background: hecho && i < actual ? PRIMARIO : "rgba(0,0,0,.12)" }} />}
              <span className="relative grid place-items-center w-6 h-6 shrink-0 rounded-full text-white" style={{ background: hecho ? PRIMARIO : "#d5d8dd" }}>
                {hecho && <Check size={14} />}
              </span>
              <span className={`pt-0.5 ${i === actual ? "font-bold" : hecho ? "" : "text-black/40"}`}>{p}</span>
            </li>
          );
        })}
      </ol>
      {aviso && <p className="mt-4 rounded-xl bg-white px-3 py-2 text-sm font-semibold">{aviso}</p>}
    </div>
  );
}

/* ---------------- devoluciones ---------------- */

const MOTIVOS = ["Llegó con falla", "No era lo que esperaba", "Me equivoqué de modelo", "Llegó incompleto"];

function Devoluciones({ t }: { t: Tienda }) {
  const [pedido, setPedido] = useState("");
  const [motivo, setMotivo] = useState(MOTIVOS[0]);
  const [detalle, setDetalle] = useState("");
  const [error, setError] = useState("");
  const [hecha, setHecha] = useState<string | null>(null);
  const dev = hecha ? t.devoluciones.find((d) => d.id === hecha) : null;
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20 grid lg:grid-cols-2 gap-8">
      <div>
        <p className="inline-flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-[0.14em]" style={{ color: PRIMARIO }}>
          <Undo2 size={16} /> Devoluciones
        </p>
        <h2 className="mt-2 text-[2rem] sm:text-[2.6rem] leading-[1.05] font-extrabold !text-[#1c1230]" style={{ fontFamily: TITULO }}>
          Si algo no está bien, te lo resolvemos
        </h2>
        <ul className="mt-5 space-y-2.5">
          {[
            "7 días para devolver si está sellado o llegó con falla.",
            "Te devolvemos tu dinero a la misma tarjeta (5 a 10 días hábiles) o por transferencia.",
            "O te lo cambiamos por otro equipo, pagando la diferencia.",
            "Los seminuevos tienen 6 meses de garantía en tienda.",
          ].map((x) => (
            <li key={x} className="flex gap-2.5">
              <Check size={18} className="mt-0.5 shrink-0" style={{ color: PRIMARIO }} /> {x}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-3xl bg-white p-6 sm:p-8">
        {dev ? (
          <div>
            <p className="text-[1.3rem] font-extrabold">Solicitud {dev.id} recibida</p>
            <p className="mt-1 text-black/60">La revisamos en menos de 24 horas y te escribimos por WhatsApp.</p>
            <p className="mt-4 inline-block rounded-full px-3 py-1 text-sm font-bold" style={dev.estado === "aprobada" ? { background: "#e1f5e6", color: "#1f7a3a" } : dev.estado === "rechazada" ? { background: "#fde4e1", color: "#b42318" } : { background: "#fff1d6", color: "#8a4b00" }}>
              {dev.estado === "pendiente" ? "En revisión" : dev.estado === "aprobada" ? "Aprobada" : "No procede"}
            </p>
            <button type="button" onClick={() => { setHecha(null); setPedido(""); setDetalle(""); }} className="mt-4 block text-sm font-semibold underline underline-offset-4">
              Hacer otra solicitud
            </button>
          </div>
        ) : (
          <form
            className="space-y-4"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const id = pedido.trim().toUpperCase();
              if (!t.pedidos.some((p) => p.id === id)) return setError("No encontramos ese pedido. Prueba con OR-1036.");
              const nueva = { id: sigId("DV", t.devoluciones, 209), pedido: id, motivo, detalle: detalle.trim(), fecha: new Date().toISOString(), estado: "pendiente" as const, nueva: true };
              t.setDevoluciones((d) => [nueva, ...d.map((x) => ({ ...x, nueva: false }))]);
              setHecha(nueva.id);
              setError("");
            }}
          >
            <p className="font-bold text-[1.2rem]">Solicitar una devolución</p>
            <label className="block text-sm font-semibold">
              Número de pedido
              <input value={pedido} onChange={(e) => setPedido(e.target.value.toUpperCase())} placeholder="OR-1036" className="mt-1.5 w-full rounded-xl border border-black/15 px-3 py-2.5 font-mono focus:outline-none focus:border-[#6d28d9]" />
            </label>
            <div>
              <p className="text-sm font-semibold">Motivo</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {MOTIVOS.map((m) => (
                  <button key={m} type="button" onClick={() => setMotivo(m)} aria-pressed={motivo === m} className={`rounded-full px-3 py-1.5 text-[0.82rem] font-semibold border transition ${motivo === m ? "border-transparent text-white" : "border-black/12"}`} style={motivo === m ? { background: TINTA } : undefined}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <label className="block text-sm font-semibold">
              Cuéntanos qué pasó
              <textarea rows={2} value={detalle} onChange={(e) => setDetalle(e.target.value)} className="mt-1.5 w-full resize-none rounded-xl border border-black/15 px-3 py-2.5 focus:outline-none focus:border-[#6d28d9]" />
            </label>
            {error && <p className="text-sm text-[#b42318]">{error}</p>}
            <button type="submit" className="w-full rounded-lg py-3 font-bold text-white" style={{ background: TINTA }}>
              Enviar solicitud
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

