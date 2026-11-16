/*
 * Lo que ve el cliente de Órbita Celulares: portada (quiénes son y de dónde
 * traen los equipos), catálogo, carrito, pago con tarjeta o transferencia,
 * rastreo, reparaciones y devoluciones. El stock nunca se muestra en números.
 */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, BadgeCheck, Banknote, Check, CreditCard, Lock, MapPin, PackageSearch, RefreshCcw, Search, ShieldCheck, ShoppingCart, Store, Trash2, Truck, Undo2, Wrench, X,
} from "lucide-react";
import { Modal } from "@/components/Modal";
import { Cajon, Contador, qz } from "../comun";
import portada from "@/assets/demo-celulares/portada.jpg";
import tecnico from "@/assets/demo-celulares/tecnico.jpg";
import fundas from "@/assets/demo-celulares/fundas.jpg";
import mano from "@/assets/demo-celulares/mano.jpg";
import { Arte } from "./Arte";
import {
  COBALTO, ESTADOS_PEDIDO, FALLAS, FONDO, LIMA, MODELOS_REPARACION, PASOS_RASTREO, PASOS_REPARACION, PRODUCTOS, SUCURSALES, TEXTO_REPARACION, TINTA, TITULO,
  disponibilidad, fechaCorta, sucursalPor,
  type Categoria, type Linea, type Pedido, type Producto, type Tienda,
} from "./datos";

const ENVIO = 35;
const ENVIO_GRATIS = 1000;
const cuota = (precio: number, meses: number) => Math.ceil(precio / meses);
const sigId = (pref: string, lista: { id: string }[], base: number) => `${pref}-${Math.max(base, ...lista.map((x) => Number(x.id.split("-")[1]) || 0)) + 1}`;

export function TiendaCliente({ t, alAdmin }: { t: Tienda; alAdmin: () => void }) {
  const [categoria, setCategoria] = useState<Categoria>("Celulares");
  const [marca, setMarca] = useState("Todas");
  const [condicion, setCondicion] = useState<"Todos" | "Nuevo" | "Seminuevo">("Todos");
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

  const marcas = ["Todas", ...new Set(PRODUCTOS.filter((p) => p.categoria === categoria).map((p) => p.marca))];
  const lista = PRODUCTOS.filter((p) => p.categoria === categoria && (marca === "Todas" || p.marca === marca) && (condicion === "Todos" || p.condicion === condicion));
  const piezas = carro.reduce((s, l) => s + l.cantidad, 0);
  const subtotal = carro.reduce((s, l) => s + l.precio * l.cantidad, 0);

  function agregar(l: Linea) {
    setCarro((c) => {
      const i = c.findIndex((x) => x.id === l.id && x.detalle === l.detalle);
      if (i >= 0) return c.map((x, k) => (k === i ? { ...x, cantidad: x.cantidad + l.cantidad } : x));
      return [...c, l];
    });
    setAviso(`${l.nombre} está en su carrito`);
  }

  const rastrear = (c: string) => {
    setCodigo(c);
    document.getElementById("rastreo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: FONDO, color: TINTA }} className="min-h-screen">
      {/* encabezado */}
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between gap-4">
          <a href="#inicio" className="inline-flex items-center gap-2 font-extrabold text-[1.2rem]" style={{ fontFamily: TITULO }}>
            <span className="relative grid place-items-center w-8 h-8 rounded-full" style={{ background: TINTA }}>
              <span className="w-3 h-3 rounded-full" style={{ background: LIMA }} />
              <span className="absolute inset-[3px] rounded-full border border-white/40" />
            </span>
            órbita
          </a>
          <nav className="hidden lg:flex gap-6 text-[0.92rem] font-medium">
            <a href="#catalogo" onClick={() => setCategoria("Celulares")} className="hover:text-[#2456e8]">
              Celulares
            </a>
            <a href="#catalogo" onClick={() => setCategoria("Accesorios")} className="hover:text-[#2456e8]">
              Accesorios
            </a>
            <a href="#reparaciones" className="hover:text-[#2456e8]">
              Reparaciones
            </a>
            <a href="#rastreo" className="hover:text-[#2456e8]">
              Rastrear pedido
            </a>
            <a href="#sucursales" className="hover:text-[#2456e8]">
              Sucursales
            </a>
          </nav>
          <button
            type="button"
            onClick={() => setCarroAbierto(true)}
            className="relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.9rem] font-semibold text-white active:scale-95 transition"
            style={{ background: TINTA }}
            aria-label={`Carrito, ${piezas} productos`}
          >
            <ShoppingCart size={17} /> Carrito
            {piezas > 0 && (
              <span className="grid place-items-center min-w-5 h-5 px-1 rounded-full text-[0.72rem] font-bold text-black" style={{ background: LIMA }}>
                {piezas}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* portada */}
      <section id="inicio" className="text-white" style={{ background: TINTA }}>
        <div className="mx-auto max-w-7xl px-5 pt-12 pb-14 sm:pt-16 sm:pb-20 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-[0.8rem] text-white/80">
              <span className="w-2 h-2 rounded-full" style={{ background: LIMA }} /> 3 sucursales · Envío a todo el país
            </p>
            <h1 className="mt-5 text-[2.6rem] sm:text-[4rem] leading-[1.02] tracking-[-0.02em] font-extrabold !text-white" style={{ fontFamily: TITULO }}>
              Celulares nuevos y seminuevos, <span style={{ color: LIMA }}>con garantía de verdad.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[1.08rem] text-white/70">Compre en línea con tarjeta o transferencia, pague en cuotas y vea en todo momento dónde va su pedido. Si algo falla, lo reparamos aquí mismo.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#catalogo" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-bold text-black active:scale-[0.97] transition" style={{ background: LIMA }}>
                Ver celulares <ArrowRight size={18} />
              </a>
              <a href="#rastreo" className="rounded-full px-6 py-3.5 font-bold border border-white/25 hover:border-white active:scale-[0.97] transition">
                Rastrear mi pedido
              </a>
            </div>
            <ul className="mt-8 grid grid-cols-3 gap-3 max-w-lg text-[0.85rem]">
              {[
                [CreditCard, "Hasta 12 cuotas"],
                [ShieldCheck, "Garantía en tienda"],
                [RefreshCcw, "Recibimos su celular"],
              ].map(([I, x]) => {
                const Icono = I as typeof Check;
                return (
                  <li key={x as string} className="rounded-2xl bg-white/5 p-3">
                    <Icono size={18} style={{ color: LIMA }} />
                    <span className="mt-1.5 block text-white/80">{x as string}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-[460px]">
            <img src={portada} alt="Mano sosteniendo un celular frente a las montañas" className="w-full aspect-[4/5] object-cover rounded-[2rem]" />
            <button type="button" onClick={() => setFicha(PRODUCTOS[0])} className="absolute -left-3 sm:-left-8 bottom-8 flex items-center gap-3 rounded-2xl bg-white p-2.5 pr-4 text-left text-black shadow-xl active:scale-95 transition">
              <span className="grid place-items-center w-14 h-14 rounded-xl" style={{ background: FONDO }}>
                <Arte tipo="telefono" marca="Apple" color="#c9dbe9" className="w-10 h-12" />
              </span>
              <span>
                <span className="block text-[0.7rem] font-bold uppercase tracking-wider" style={{ color: COBALTO }}>
                  Sellado
                </span>
                <span className="block font-bold leading-tight">iPhone 15</span>
                <span className="block text-sm text-black/60">12 cuotas de {qz(cuota(7499, 12))}</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* quiénes somos y de dónde los traemos */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-end">
          <div>
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em]" style={{ color: COBALTO }}>
              Quiénes somos
            </p>
            <h2 className="mt-2 text-[2.2rem] sm:text-[3rem] leading-[1.03] font-extrabold !text-[#0d1117]" style={{ fontFamily: TITULO }}>
              Sabemos de dónde viene cada celular que vendemos
            </h2>
          </div>
          <p className="text-[1.05rem] text-black/65">Empezamos en 2016 con un mostrador en zona 10. Hoy tenemos tres sucursales y un taller propio. Cada equipo se revisa aquí antes de llegar a sus manos.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {[
            { I: BadgeCheck, t: "Nuevos y sellados", d: "Los traemos de distribuidores autorizados en Miami y Panamá. Llegan con su caja sellada y factura." },
            { I: ShieldCheck, t: "Seminuevos certificados", d: "Equipos de primera mano que pasan 30 puntos de revisión: batería, pantalla, cámaras, señal y botones." },
            { I: RefreshCcw, t: "Canje de su celular", d: "Traiga su teléfono usado y se lo tomamos como parte de pago, según su estado." },
          ].map(({ I, t: ti, d }) => (
            <div key={ti} className="rounded-3xl bg-white p-6">
              <span className="grid place-items-center w-11 h-11 rounded-2xl" style={{ background: "#e3ebff", color: COBALTO }}>
                <I size={21} />
              </span>
              <h3 className="mt-4 text-[1.2rem] font-bold !text-[#0d1117]">{ti}</h3>
              <p className="mt-1 text-black/65">{d}</p>
            </div>
          ))}
        </div>
        <dl className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["+12,000", "equipos vendidos"],
            ["3", "sucursales"],
            ["4.8", "de calificación en Google"],
            ["24 h", "entrega en la capital"],
          ].map(([n, x]) => (
            <div key={x} className="rounded-2xl border border-black/10 p-4">
              <dt className="text-[1.9rem] font-extrabold leading-none" style={{ fontFamily: TITULO }}>
                {n}
              </dt>
              <dd className="mt-1 text-sm text-black/55">{x}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-black/45">Cifras de ejemplo.</p>
      </section>

      {/* catálogo */}
      <section id="catalogo" className="scroll-mt-16 mx-auto max-w-7xl px-5 pb-14 sm:pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[2.2rem] sm:text-[3rem] leading-none font-extrabold !text-[#0d1117]" style={{ fontFamily: TITULO }}>
            Catálogo
          </h2>
          <div className="flex rounded-full bg-white p-1" role="group" aria-label="Categoría">
            {(["Celulares", "Accesorios"] as Categoria[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategoria(c);
                  setMarca("Todas");
                  setCondicion("Todos");
                }}
                aria-pressed={categoria === c}
                className={`rounded-full px-5 py-2 text-[0.92rem] font-semibold transition ${categoria === c ? "text-white" : "text-black/60"}`}
                style={categoria === c ? { background: TINTA } : undefined}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {marcas.map((m) => (
            <button key={m} type="button" onClick={() => setMarca(m)} aria-pressed={marca === m} className={`rounded-full px-3.5 py-1.5 text-[0.85rem] font-semibold border transition ${marca === m ? "border-transparent text-white" : "border-black/12 bg-white hover:border-black/40"}`} style={marca === m ? { background: COBALTO } : undefined}>
              {m}
            </button>
          ))}
          {categoria === "Celulares" && (
            <>
              <span className="mx-1 w-px self-stretch bg-black/10" />
              {(["Todos", "Nuevo", "Seminuevo"] as const).map((c) => (
                <button key={c} type="button" onClick={() => setCondicion(c)} aria-pressed={condicion === c} className={`rounded-full px-3.5 py-1.5 text-[0.85rem] font-semibold border transition ${condicion === c ? "border-transparent text-white" : "border-black/12 bg-white hover:border-black/40"}`} style={condicion === c ? { background: TINTA } : undefined}>
                  {c === "Todos" ? "Nuevos y seminuevos" : c + "s"}
                </button>
              ))}
            </>
          )}
        </div>
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {lista.map((p) => {
            const disp = disponibilidad(t.stock, p.id);
            const desde = p.variantes[0].precio;
            return (
              <button key={p.id} type="button" onClick={() => setFicha(p)} className="group flex flex-col rounded-3xl bg-white p-3 sm:p-4 text-left transition hover:shadow-lg active:scale-[0.99]">
                <div className="relative grid place-items-center rounded-2xl aspect-square" style={{ background: FONDO }}>
                  <Arte tipo={p.arte} marca={p.marca} color={p.colores[0].hex} className="w-[62%] h-[80%] transition duration-500 group-hover:scale-105" />
                  {p.etiqueta && (
                    <span className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[0.68rem] font-bold" style={{ background: p.etiqueta === "Oferta" ? LIMA : "#fff", color: TINTA }}>
                      {p.etiqueta}
                    </span>
                  )}
                  {p.colores.length > 1 && (
                    <span className="absolute right-2 bottom-2 flex gap-1">
                      {p.colores.map((c) => (
                        <span key={c.nombre} className="w-3 h-3 rounded-full ring-1 ring-black/10" style={{ background: c.hex }} />
                      ))}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-[0.75rem] font-semibold text-black/45">
                  {p.marca} · {p.condicion}
                </p>
                <p className="font-bold leading-tight">{p.nombre}</p>
                <p className="mt-1 font-extrabold text-[1.15rem]">
                  {p.variantes.length > 1 && <span className="text-[0.75rem] font-semibold text-black/45">desde </span>}
                  {qz(desde)} {p.antes && <span className="text-[0.8rem] font-normal line-through text-black/35">{qz(p.antes)}</span>}
                </p>
                {desde >= 1000 && <p className="text-[0.78rem] text-black/55">o 12 cuotas de {qz(cuota(desde, 12))}</p>}
                <p className={`mt-auto pt-2 text-[0.78rem] font-semibold ${disp.tipo === "agotado" ? "text-[#b42318]" : disp.tipo === "pocas" ? "text-[#b25e00]" : "text-[#1f7a3a]"}`}>● {disp.texto}</p>
              </button>
            );
          })}
        </div>
        {categoria === "Accesorios" && (
          <div className="mt-6 grid md:grid-cols-[1.2fr_1fr] gap-4 items-center overflow-hidden rounded-3xl bg-white">
            <img src={fundas} alt="Pared con fundas de colores" className="w-full h-48 md:h-full object-cover" loading="lazy" />
            <div className="p-6">
              <p className="font-bold text-[1.2rem]">¿No ve la funda de su modelo?</p>
              <p className="mt-1 text-black/60">Tenemos más de 300 modelos en tienda. Escríbanos el suyo y le decimos si hay.</p>
            </div>
          </div>
        )}
        <p className="mt-4 text-sm text-black/45">Precios de ejemplo, en quetzales. Las marcas son de sus dueños; los dibujos son ilustrativos.</p>
      </section>

      {/* pagos seguros */}
      <section className="px-5">
        <div className="mx-auto max-w-7xl grid md:grid-cols-4 gap-4 rounded-3xl p-6 sm:p-8 text-white" style={{ background: TINTA }}>
          <div className="md:col-span-1">
            <p className="inline-flex items-center gap-2 font-bold text-[1.2rem]">
              <Lock size={20} style={{ color: LIMA }} /> Pague como quiera
            </p>
            <p className="mt-1 text-sm text-white/60">Todo el sitio va cifrado. Nosotros nunca vemos el número completo de su tarjeta.</p>
          </div>
          {[
            [CreditCard, "Tarjeta de crédito o débito", "Al contado o hasta 12 cuotas con tarjetas participantes."],
            [Banknote, "Transferencia o depósito", "Suba su comprobante y lo verificamos en menos de 2 horas."],
            [Store, "Pague en sucursal", "Aparte en línea y pague al recoger."],
          ].map(([I, ti, d]) => {
            const Icono = I as typeof Check;
            return (
              <div key={ti as string} className="rounded-2xl bg-white/5 p-4">
                <Icono size={20} style={{ color: LIMA }} />
                <p className="mt-2 font-semibold">{ti as string}</p>
                <p className="text-sm text-white/60">{d as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      <Reparaciones t={t} alAgendado={(id) => setAviso(`Su reparación quedó con el código ${id}`)} alRastrear={rastrear} />

      <Rastreo t={t} codigo={codigo} setCodigo={setCodigo} />

      <Devoluciones t={t} />

      {/* sucursales */}
      <section id="sucursales" className="scroll-mt-16 mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <h2 className="text-[2.2rem] sm:text-[3rem] leading-none font-extrabold !text-[#0d1117]" style={{ fontFamily: TITULO }}>
          Sucursales
        </h2>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {SUCURSALES.map((s) => (
            <div key={s.id} className="rounded-3xl bg-white p-6">
              <MapPin size={22} style={{ color: COBALTO }} />
              <p className="mt-3 text-[1.2rem] font-bold">{s.nombre}</p>
              <p className="text-black/60">{s.direccion}</p>
              <p className="mt-2 text-sm text-black/50">{s.horario}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-black/45">Direcciones de ejemplo.</p>
      </section>

      {/* opiniones y preguntas */}
      <section className="mx-auto max-w-7xl px-5 pb-14 sm:pb-20 grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-[2rem] sm:text-[2.6rem] leading-none font-extrabold !text-[#0d1117]" style={{ fontFamily: TITULO }}>
            Lo que dicen
          </h2>
          <div className="mt-6 space-y-3">
            {[
              { n: "Andrea C.", t: "Compré el seminuevo y la batería venía al 91%. Me llegó al día siguiente y pude ver dónde iba." },
              { n: "Jorge O.", t: "Me cambiaron la pantalla en dos horas mientras hacía mandados. Precio claro desde el inicio." },
              { n: "Gabriela C.", t: "Pagué en 12 cuotas sin papeleo. Muy fácil todo en línea." },
            ].map((o) => (
              <figure key={o.n} className="rounded-2xl bg-white p-5">
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
          <h2 className="text-[2rem] sm:text-[2.6rem] leading-none font-extrabold !text-[#0d1117]" style={{ fontFamily: TITULO }}>
            Preguntas
          </h2>
          <div className="mt-6 divide-y divide-black/10 rounded-2xl bg-white px-5">
            {[
              ["¿Los celulares están liberados?", "Sí, todos funcionan con Tigo, Claro y cualquier compañía."],
              ["¿Cuánto tarda el envío?", `En la capital 24 horas, en los departamentos 48. Gratis desde ${qz(ENVIO_GRATIS)}.`],
              ["¿Qué pasa si mi pago con tarjeta es rechazado?", "No se cobra nada. Puede intentar con otra tarjeta o pagar por transferencia."],
              ["¿Puedo devolver un producto?", "Sí, en los primeros 7 días si está sellado o si llegó con falla. Le devolvemos su dinero o se lo cambiamos."],
            ].map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {q}
                  <span className="grid place-items-center w-7 h-7 shrink-0 rounded-full bg-black/5 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-black/65">{a}</p>
              </details>
            ))}
          </div>
          <button type="button" onClick={alAdmin} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black/50 hover:text-black">
            <Lock size={14} /> Acceso para el dueño
          </button>
        </div>
      </section>

      {/* carrito flotante en celular */}
      {piezas > 0 && !carroAbierto && (
        <button type="button" onClick={() => setCarroAbierto(true)} className="md:hidden fixed bottom-5 inset-x-5 z-30 flex items-center justify-between rounded-full px-5 py-3.5 font-bold text-white shadow-xl active:scale-[0.98]" style={{ background: TINTA }}>
          <span className="inline-flex items-center gap-2">
            <ShoppingCart size={18} /> Ver carrito ({piezas})
          </span>
          <span>{qz(subtotal)}</span>
        </button>
      )}

      {aviso && (
        <div role="status" className="fixed top-20 left-1/2 -translate-x-1/2 z-40 inline-flex max-w-[92vw] items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[0.9rem] font-semibold shadow-xl">
          <Check size={16} style={{ color: COBALTO }} /> {aviso}
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
              Su carrito
            </p>
            <button type="button" onClick={() => setCarroAbierto(false)} aria-label="Cerrar" className="grid place-items-center w-9 h-9 rounded-full hover:bg-black/5">
              <X size={20} />
            </button>
          </div>
          {carro.length === 0 ? (
            <div className="flex-1 grid place-items-center px-8 text-center">
              <div>
                <p className="font-semibold text-[1.1rem]">Su carrito está vacío</p>
                <button type="button" onClick={() => setCarroAbierto(false)} className="mt-4 rounded-full px-5 py-2.5 font-bold text-white" style={{ background: TINTA }}>
                  Ver catálogo
                </button>
              </div>
            </div>
          ) : (
            <>
              <ul className="flex-1 overflow-y-auto divide-y divide-black/10 px-6">
                {carro.map((l, k) => {
                  const p = PRODUCTOS.find((x) => x.id === l.id)!;
                  const color = p.colores.find((c) => l.detalle.includes(c.nombre)) ?? p.colores[0];
                  return (
                    <li key={l.id + l.detalle} className="py-4 flex gap-3">
                      <span className="grid place-items-center w-20 h-20 shrink-0 rounded-xl" style={{ background: FONDO }}>
                        <Arte tipo={p.arte} marca={p.marca} color={color.hex} className="w-12 h-16" />
                      </span>
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
                  );
                })}
              </ul>
              <div className="border-t border-black/10 px-6 py-5 space-y-3">
                <p className="flex justify-between text-black/60">
                  <span>Subtotal</span>
                  <span>{qz(subtotal)}</span>
                </p>
                <p className="text-sm text-black/55">{subtotal >= ENVIO_GRATIS ? "Su envío es gratis." : `Envío ${qz(ENVIO)}, gratis desde ${qz(ENVIO_GRATIS)}. O recoja en sucursal sin costo.`}</p>
                <button
                  type="button"
                  onClick={() => {
                    setCarroAbierto(false);
                    setPagando(true);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 font-bold text-black active:scale-[0.98]"
                  style={{ background: LIMA }}
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
      <div className="grid place-items-center p-8" style={{ background: FONDO }}>
        <Arte tipo={p.arte} marca={p.marca} color={color.hex} className="w-48 h-60 sm:w-56 sm:h-72" />
      </div>
      <div className="p-6 sm:p-8">
        <p className="text-sm font-semibold text-black/50">
          {p.marca} · {p.condicion}
        </p>
        <h3 className="pr-8 text-[1.9rem] leading-tight font-extrabold !text-[#0d1117]" style={{ fontFamily: TITULO }}>
          {p.nombre}
        </h3>
        <p className="mt-1 text-black/60">{p.resumen}</p>
        <p className="mt-3 text-[1.7rem] font-extrabold">
          {qz(v.precio)} {p.antes && <span className="text-[1rem] font-normal line-through text-black/35">{qz(p.antes)}</span>}
        </p>
        {v.precio >= 1000 && <p className="text-sm text-black/55">o 12 cuotas de {qz(cuota(v.precio, 12))} con tarjetas participantes</p>}

        <p className="mt-5 text-sm font-semibold">Color: {color.nombre}</p>
        <div className="mt-2 flex gap-2">
          {p.colores.map((c) => (
            <button key={c.nombre} type="button" onClick={() => setColor(c)} aria-label={c.nombre} aria-pressed={color.nombre === c.nombre} className="w-9 h-9 rounded-full transition active:scale-90" style={{ background: c.hex, boxShadow: color.nombre === c.nombre ? `0 0 0 2px #fff, 0 0 0 4px ${COBALTO}` : "inset 0 0 0 1px rgba(0,0,0,.12)" }} />
          ))}
        </div>
        {p.variantes.length > 1 && (
          <>
            <p className="mt-4 text-sm font-semibold">Capacidad</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.variantes.map((x) => (
                <button key={x.capacidad} type="button" onClick={() => setV(x)} aria-pressed={v === x} className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold transition ${v === x ? "" : "border-black/10"}`} style={v === x ? { borderColor: COBALTO, background: "#e3ebff" } : undefined}>
                  {x.capacidad} · {qz(x.precio)}
                </button>
              ))}
            </div>
          </>
        )}
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[0.88rem]">
          {p.detalles.map((d) => (
            <li key={d} className="flex gap-1.5">
              <Check size={15} className="mt-0.5 shrink-0" style={{ color: COBALTO }} /> {d}
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
            className="flex-1 rounded-full py-3 font-bold text-white disabled:opacity-40 active:scale-[0.98] transition"
            style={{ background: TINTA }}
          >
            {disp.tipo === "agotado" ? "Agotado" : `Agregar · ${qz(v.precio * n)}`}
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
  const [metodo, setMetodo] = useState<"tarjeta" | "transferencia">("tarjeta");
  const [tarjeta, setTarjeta] = useState({ numero: "", nombre: "", vence: "", cvv: "" });
  const [cuotas, setCuotas] = useState(1);
  const [comprobante, setComprobante] = useState("");
  const [error, setError] = useState("");
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const envio = entrega === "tienda" || subtotal >= ENVIO_GRATIS ? 0 : ENVIO;
  const total = subtotal + envio;
  const campo = "mt-1.5 w-full rounded-xl border border-black/15 px-3 py-2.5 focus:outline-none focus:border-[#2456e8]";

  function crear(estado: Pedido["estado"], extra: Partial<Pedido> = {}) {
    const p: Pedido = {
      id: sigId("OR", t.pedidos, 1041),
      fecha: new Date().toISOString(),
      cliente: nombre.trim(),
      telefono: tel.trim(),
      entrega: entrega === "envio" ? { tipo: "envio", direccion: direccion.trim() } : { tipo: "tienda", sucursal },
      lineas: carro,
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
    if (estado === "pagado")
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
      if (num.length !== 16) return setError("Escriba los 16 dígitos de la tarjeta, o use una de prueba.");
      if (!/^\d{2}\/\d{2}$/.test(tarjeta.vence)) return setError("Escriba el vencimiento como MM/AA.");
      if (tarjeta.cvv.length < 3) return setError("Escriba el código de 3 dígitos.");
      setPaso("procesando");
      setTimeout(() => {
        if (num.endsWith("0002")) crear("rechazado", { tarjeta: num.slice(-4), motivoRechazo: "Fondos insuficientes", cuotas });
        else crear("pagado", { tarjeta: num.slice(-4), cuotas });
      }, 1400);
    } else {
      if (!comprobante) return setError("Suba la foto de su comprobante.");
      crear("pago-pendiente");
    }
  }

  if (paso === "procesando")
    return (
      <div className="px-6 py-16 text-center">
        <span className="mx-auto block w-10 h-10 rounded-full border-4 border-black/10 animate-spin" style={{ borderTopColor: COBALTO }} />
        <p className="mt-4 font-semibold">Procesando su pago de forma segura…</p>
        <p className="text-sm text-black/50">No cierre esta ventana.</p>
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
            <h3 className="mt-4 text-[1.6rem] font-extrabold !text-[#0d1117]" style={{ fontFamily: TITULO }}>
              Su banco rechazó el pago
            </h3>
            <p className="mt-1 text-black/60">Motivo: {pedido.motivoRechazo}. No se hizo ningún cobro.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
              <button type="button" onClick={() => { setPaso("pago"); setTarjeta({ numero: "", nombre: "", vence: "", cvv: "" }); }} className="rounded-full px-5 py-3 font-bold text-white" style={{ background: TINTA }}>
                Probar con otra tarjeta
              </button>
              <button type="button" onClick={() => { setPaso("pago"); setMetodo("transferencia"); }} className="rounded-full px-5 py-3 font-bold border border-black/15">
                Pagar por transferencia
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="mt-4 text-[1.6rem] font-extrabold !text-[#0d1117]" style={{ fontFamily: TITULO }}>
              {pedido.estado === "pagado" ? "¡Pago aprobado!" : "Recibimos su comprobante"}
            </h3>
            <p className="mt-1 text-black/60">
              {pedido.estado === "pagado"
                ? `Su pedido ${pedido.id} ya está pagado${pedido.cuotas && pedido.cuotas > 1 ? ` en ${pedido.cuotas} cuotas` : ""}. Le avisamos por WhatsApp cuando salga.`
                : `Verificamos su transferencia en menos de 2 horas. Su pedido es el ${pedido.id}.`}
            </p>
            <p className="mt-4 inline-block rounded-xl px-4 py-2 font-mono text-[1.2rem] font-bold" style={{ background: FONDO }}>
              {pedido.id}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
              <button type="button" onClick={() => alRastrear(pedido.id)} className="rounded-full px-5 py-3 font-bold text-black" style={{ background: LIMA }}>
                Rastrear mi pedido
              </button>
              <button type="button" onClick={alCerrar} className="rounded-full px-5 py-3 font-bold border border-black/15">
                Seguir viendo
              </button>
            </div>
            <p className="mt-5 text-xs text-black/45">Entre al panel del dueño para ver cómo le aparece este pedido.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-6">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className={paso === "datos" ? "" : "text-black/40"}>1. Sus datos</span>
        <span className="text-black/25">→</span>
        <span className={paso === "pago" ? "" : "text-black/40"}>2. Pago</span>
      </div>
      {paso === "datos" ? (
        <form
          className="mt-5 space-y-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!nombre.trim()) return setError("Escriba su nombre.");
            if (tel.replace(/\D/g, "").length < 8) return setError("Escriba su teléfono de 8 dígitos.");
            if (entrega === "envio" && !direccion.trim()) return setError("Escriba la dirección de entrega.");
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
                <button key={id as string} type="button" onClick={() => setEntrega(id as "envio" | "tienda")} aria-pressed={entrega === id} className={`rounded-2xl border-2 p-3 text-left transition ${entrega === id ? "" : "border-black/10"}`} style={entrega === id ? { borderColor: COBALTO, background: "#e3ebff" } : undefined}>
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
          <button type="submit" className="w-full rounded-full py-3.5 font-bold text-white" style={{ background: TINTA }}>
            Continuar al pago
          </button>
        </form>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              ["tarjeta", CreditCard, "Tarjeta"],
              ["transferencia", Banknote, "Transferencia"],
            ].map(([id, I, ti]) => {
              const Icono = I as typeof Truck;
              return (
                <button key={id as string} type="button" onClick={() => { setMetodo(id as "tarjeta" | "transferencia"); setError(""); }} aria-pressed={metodo === id} className={`flex items-center gap-2 rounded-2xl border-2 p-3 font-semibold transition ${metodo === id ? "" : "border-black/10"}`} style={metodo === id ? { borderColor: COBALTO, background: "#e3ebff" } : undefined}>
                  <Icono size={18} /> {ti as string}
                </button>
              );
            })}
          </div>
          {metodo === "tarjeta" ? (
            <>
              <div className="rounded-2xl border border-dashed border-black/20 p-3 text-[0.82rem]">
                <p className="font-semibold">Demo: no escriba datos reales. Use una tarjeta de prueba:</p>
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
              {total >= 1000 && (
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
          ) : (
            <div className="space-y-3">
              <div className="rounded-2xl p-4 text-[0.9rem]" style={{ background: FONDO }}>
                <p className="font-semibold">Transfiera {qz(total)} a:</p>
                <p className="mt-1">Banco de ejemplo · Monetaria</p>
                <p className="font-mono">000-000000-0</p>
                <p>A nombre de Órbita Celulares, S.A.</p>
              </div>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-black/15 p-4">
                <span className="text-sm">
                  <b>{comprobante || "Suba la foto de su comprobante"}</b>
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
          <Resumen subtotal={subtotal} envio={envio} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setPaso("datos")} className="rounded-full px-5 py-3.5 font-bold border border-black/15">
              Atrás
            </button>
            <button type="button" onClick={pagar} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3.5 font-bold text-black" style={{ background: LIMA }}>
              <Lock size={16} /> {metodo === "tarjeta" ? `Pagar ${qz(total)}` : "Enviar comprobante"}
            </button>
          </div>
          <p className="flex items-center justify-center gap-1.5 text-xs text-black/50">
            <ShieldCheck size={14} /> Pago cifrado. En su tienda real lo procesa una pasarela certificada.
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
            <p className="inline-flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-wider" style={{ color: LIMA }}>
              <Wrench size={15} /> Taller propio
            </p>
            <p className="mt-1 text-[1.5rem] font-extrabold leading-tight" style={{ fontFamily: TITULO }}>
              Reparamos su celular, de cualquier marca
            </p>
            <p className="mt-1 text-white/70">Repuestos de calidad y 90 días de garantía en la reparación.</p>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 sm:p-8">
          <h2 className="text-[1.9rem] font-extrabold !text-[#0d1117]" style={{ fontFamily: TITULO }}>
            Cotice su reparación
          </h2>
          <p className="mt-4 text-sm font-semibold">1. ¿Qué celular tiene?</p>
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
              <p className="font-semibold">Listo. Su código de reparación es <span className="font-mono">{hecho}</span>.</p>
              <p className="text-sm text-black/60">Llévelo a la sucursal de {sucursalPor(sucursal).nombre}. Con ese código ve en qué va su celular.</p>
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
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Su nombre" required className="rounded-full border border-black/15 px-4 py-3 focus:outline-none focus:border-[#2456e8]" />
              <select value={sucursal} onChange={(e) => setSucursal(e.target.value)} className="rounded-full border border-black/15 bg-white px-4 py-3">
                {SUCURSALES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
              <button type="submit" className="rounded-full px-5 py-3 font-bold text-black" style={{ background: LIMA }}>
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
          <p className="inline-flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-[0.14em]" style={{ color: COBALTO }}>
            <PackageSearch size={16} /> Rastreo
          </p>
          <h2 className="mt-2 text-[2rem] sm:text-[2.6rem] leading-[1.05] font-extrabold !text-[#0d1117]" style={{ fontFamily: TITULO }}>
            ¿Dónde va mi pedido?
          </h2>
          <p className="mt-2 text-black/60">Escriba su código de pedido o de reparación.</p>
          <form
            className="mt-5 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setCodigo(texto);
            }}
          >
            <label className="flex-1 flex items-center gap-2 rounded-full border border-black/15 px-4 focus-within:border-[#2456e8]">
              <Search size={18} className="text-black/40" />
              <input value={texto} onChange={(e) => setTexto(e.target.value.toUpperCase())} placeholder="OR-1038 o RP-512" className="w-full py-3 font-mono focus:outline-none" />
            </label>
            <button type="submit" className="rounded-full px-5 font-bold text-white" style={{ background: TINTA }}>
              Buscar
            </button>
          </form>
          <p className="mt-2 text-xs text-black/45">Pruebe con OR-1038 (en camino) o RP-512 (reparación).</p>
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
                  ? "Estamos verificando su transferencia. Le avisamos al confirmarla."
                  : pedido.estado === "rechazado"
                    ? `El pago fue rechazado (${pedido.motivoRechazo}). No se cobró nada.`
                    : pedido.estado === "devuelto"
                      ? "Este pedido fue devuelto y su dinero reembolsado."
                      : pedido.guia
                        ? `Guía de envío ${pedido.guia}. Llega hoy o mañana.`
                        : undefined
              }
            />
          ) : rep ? (
            <LineaTiempo titulo={`Reparación ${rep.id}`} sub={`${rep.modelo} · ${rep.falla}`} pasos={PASOS_REPARACION.map((x) => TEXTO_REPARACION[x])} actual={PASOS_REPARACION.indexOf(rep.estado)} aviso={rep.estado === "listo" ? `Ya puede pasar por él a ${sucursalPor(rep.sucursal).nombre}. Total: ${qz(rep.precio)}.` : undefined} />
          ) : c ? (
            <p className="rounded-2xl p-5 text-black/60" style={{ background: FONDO }}>
              No encontramos el código {c}. Revise que esté bien escrito.
            </p>
          ) : (
            <div className="relative mx-auto max-w-[260px]">
              <img src={mano} alt="" className="w-full" loading="lazy" />
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
              {i < pasos.length - 1 && <span className="absolute left-[11px] top-6 bottom-0 w-0.5" style={{ background: hecho && i < actual ? COBALTO : "rgba(0,0,0,.12)" }} />}
              <span className="relative grid place-items-center w-6 h-6 shrink-0 rounded-full text-white" style={{ background: hecho ? COBALTO : "#d5d8dd" }}>
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
        <p className="inline-flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-[0.14em]" style={{ color: COBALTO }}>
          <Undo2 size={16} /> Devoluciones
        </p>
        <h2 className="mt-2 text-[2rem] sm:text-[2.6rem] leading-[1.05] font-extrabold !text-[#0d1117]" style={{ fontFamily: TITULO }}>
          Si algo no está bien, se lo resolvemos
        </h2>
        <ul className="mt-5 space-y-2.5">
          {[
            "7 días para devolver si está sellado o llegó con falla.",
            "Le devolvemos su dinero a la misma tarjeta (5 a 10 días hábiles) o por transferencia.",
            "O se lo cambiamos por otro equipo, pagando la diferencia.",
            "Los seminuevos tienen 6 meses de garantía en tienda.",
          ].map((x) => (
            <li key={x} className="flex gap-2.5">
              <Check size={18} className="mt-0.5 shrink-0" style={{ color: COBALTO }} /> {x}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-3xl bg-white p-6 sm:p-8">
        {dev ? (
          <div>
            <p className="text-[1.3rem] font-extrabold">Solicitud {dev.id} recibida</p>
            <p className="mt-1 text-black/60">La revisamos en menos de 24 horas y le escribimos por WhatsApp.</p>
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
              if (!t.pedidos.some((p) => p.id === id)) return setError("No encontramos ese pedido. Pruebe con OR-1036.");
              const nueva = { id: sigId("DV", t.devoluciones, 209), pedido: id, motivo, detalle: detalle.trim(), fecha: new Date().toISOString(), estado: "pendiente" as const, nueva: true };
              t.setDevoluciones((d) => [nueva, ...d.map((x) => ({ ...x, nueva: false }))]);
              setHecha(nueva.id);
              setError("");
            }}
          >
            <p className="font-bold text-[1.2rem]">Solicitar una devolución</p>
            <label className="block text-sm font-semibold">
              Número de pedido
              <input value={pedido} onChange={(e) => setPedido(e.target.value.toUpperCase())} placeholder="OR-1036" className="mt-1.5 w-full rounded-xl border border-black/15 px-3 py-2.5 font-mono focus:outline-none focus:border-[#2456e8]" />
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
              Cuéntenos qué pasó
              <textarea rows={2} value={detalle} onChange={(e) => setDetalle(e.target.value)} className="mt-1.5 w-full resize-none rounded-xl border border-black/15 px-3 py-2.5 focus:outline-none focus:border-[#2456e8]" />
            </label>
            {error && <p className="text-sm text-[#b42318]">{error}</p>}
            <button type="submit" className="w-full rounded-full py-3 font-bold text-white" style={{ background: TINTA }}>
              Enviar solicitud
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

