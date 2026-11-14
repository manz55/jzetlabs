/*
 * Demo de tienda: una sola página que cambia según el tipo de negocio
 * (?tipo=ropa | restaurante | tiempo). Ideas tomadas de las referencias de Josh,
 * sin copiar ningún sitio: portada con foto a pantalla completa y botones de
 * vidrio, tarjetas que desenfocan a las demás al pasar el mouse, y para tiempo
 * compartido, dos planes y semanas libres. Datos de ejemplo.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Modal } from "@/components/Modal";
import { whatsappLink } from "@/data/site";
import { NEGOCIOS, OCUPADAS, PLANES, type Item, type Negocio, type Tipo } from "./datos";

const TIPOS: Tipo[] = ["ropa", "restaurante", "tiempo"];
const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;

function tipoInicial(): Tipo {
  const t = new URLSearchParams(location.search).get("tipo");
  return t === "restaurante" || t === "tiempo" ? t : "ropa";
}

type Linea = { item: Item; opcion?: string; cantidad: number };

export default function TiendaDemo() {
  const [tipo, setTipo] = useState<Tipo>(tipoInicial);
  const n = NEGOCIOS[tipo];
  const [carrito, setCarrito] = useState<Linea[]>([]);
  const [verCarrito, setVerCarrito] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // al cambiar de tipo: URL, título y carrito nuevos
  useEffect(() => {
    const u = new URL(location.href);
    u.searchParams.set("tipo", tipo);
    history.replaceState(null, "", u);
    document.title = `${n.marca} · Demo de Jzet Labs`;
    setCarrito([]);
    window.scrollTo({ top: 0 });
  }, [tipo, n.marca]);

  const total = carrito.reduce((s, l) => s + (l.item.precio ?? 0) * l.cantidad, 0);
  const piezas = carrito.reduce((s, l) => s + l.cantidad, 0);

  function agregar(item: Item, opcion?: string) {
    setCarrito((c) => {
      const i = c.findIndex((l) => l.item.nombre === item.nombre && l.opcion === opcion);
      if (i >= 0) return c.map((l, k) => (k === i ? { ...l, cantidad: l.cantidad + 1 } : l));
      return [...c, { item, opcion, cantidad: 1 }];
    });
  }

  function cambiar(k: number, d: number) {
    setCarrito((c) => c.map((l, i) => (i === k ? { ...l, cantidad: l.cantidad + d } : l)).filter((l) => l.cantidad > 0));
  }

  function enviarPedido() {
    const lineas = carrito.map((l) => `• ${l.cantidad} × ${l.item.nombre}${l.opcion ? ` (${tipo === "ropa" ? "talla " : ""}${l.opcion})` : ""} — ${qz((l.item.precio ?? 0) * l.cantidad)}`);
    setVerCarrito(false);
    setMensaje(`Hola, ${n.marca}. Quiero hacer este pedido:\n${lineas.join("\n")}\nTotal: ${qz(total)}`);
  }

  const estilo = {
    "--d-fondo": n.tema.fondo,
    "--d-tinta": n.tema.tinta,
    "--d-suave": n.tema.suave,
    "--d-acento": n.tema.acento,
    "--d-titulos": n.tema.titulos,
    background: n.tema.fondo,
    color: n.tema.tinta,
  } as React.CSSProperties;

  return (
    <div style={estilo} className="min-h-screen">
      <Banda tipo={tipo} setTipo={setTipo} />
      <Portada n={n} />
      <Tarjetas n={n} alAgregar={agregar} />
      {tipo === "tiempo" && <Planes alApartar={(p) => setMensaje(`Hola, ${n.marca}. Me interesa el plan "${p}". ¿Qué semanas tienen libres?`)} />}
      {tipo === "tiempo" && <Semanas alApartar={(s) => setMensaje(`Hola, ${n.marca}. Quiero apartar la semana ${s} del 2027.`)} />}
      <Cierre n={n} />

      {/* carrito flotante */}
      {tipo !== "tiempo" && piezas > 0 && (
        <button
          type="button"
          onClick={() => setVerCarrito(true)}
          className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2.5 rounded-full px-5 py-3.5 text-white font-semibold shadow-[0_12px_30px_-10px_rgba(0,0,0,.5)] active:scale-95 transition"
          style={{ background: "var(--d-acento)" }}
        >
          <ShoppingBag size={19} /> Ver pedido · {piezas} · {qz(total)}
        </button>
      )}

      <Modal abierto={verCarrito} alCerrar={() => setVerCarrito(false)} titulo="Su pedido" ancho="sm:w-[min(28rem,92vw)]">
        <div className="px-6 pt-6 pb-6" style={{ color: "var(--d-tinta)" }}>
          <h3 className="text-[1.5rem]" style={{ fontFamily: "var(--d-titulos)", color: "var(--d-tinta)" }}>
            Su pedido
          </h3>
          <ul className="mt-4 divide-y divide-black/10">
            {carrito.map((l, k) => (
              <li key={l.item.nombre + l.opcion} className="flex items-center gap-3 py-3">
                <img src={l.item.foto} alt="" className="w-12 h-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{l.item.nombre}</p>
                  <p className="text-sm" style={{ color: "var(--d-suave)" }}>
                    {l.opcion ? `${tipo === "ropa" ? "Talla " : ""}${l.opcion} · ` : ""}
                    {qz(l.item.precio ?? 0)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" aria-label="Quitar uno" onClick={() => cambiar(k, -1)} className="grid place-items-center w-8 h-8 rounded-full border border-black/15 active:scale-90">
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center tabular-nums">{l.cantidad}</span>
                  <button type="button" aria-label="Agregar uno" onClick={() => cambiar(k, 1)} className="grid place-items-center w-8 h-8 rounded-full border border-black/15 active:scale-90">
                    <Plus size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between text-[1.1rem] font-semibold">
            <span>Total</span>
            <span>{qz(total)}</span>
          </p>
          <button type="button" onClick={enviarPedido} className="mt-5 w-full rounded-full py-3.5 text-white font-semibold active:scale-[0.98] transition" style={{ background: "var(--d-acento)" }}>
            Enviar pedido por WhatsApp
          </button>
        </div>
      </Modal>

      <Modal abierto={mensaje !== null} alCerrar={() => setMensaje(null)} titulo="Así le llega el mensaje" ancho="sm:w-[min(26rem,92vw)]">
        <div className="px-6 pt-6 pb-6 text-tinta">
          <p className="etiqueta">Así funciona</p>
          <h3 className="mt-2 text-[1.4rem] pr-8">En su negocio, este mensaje le llega directo a su WhatsApp:</h3>
          <div className="mt-4 rounded-2xl bg-[#e7ddd3] p-4">
            <p className="ml-auto w-fit max-w-[92%] whitespace-pre-line rounded-[1rem_1rem_0.3rem_1rem] bg-[#d9fdd3] px-3.5 py-2.5 text-[0.92rem] text-[#111b21] shadow-sm">{mensaje}</p>
          </div>
          <p className="mt-4 text-sm text-suave">Esto es una demo: el pedido no se envía. ¿Quiere una así para su negocio?</p>
          <a
            href={whatsappLink(`Hola, Joshua. Vi la demo de ${n.etiqueta.toLowerCase()} y quiero una página así para mi negocio.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 btn btn-principal !rounded-full w-full"
          >
            Quiero una así <ArrowRight size={18} />
          </a>
        </div>
      </Modal>
    </div>
  );
}

/* Banda de arriba: dice que es demo y deja cambiar de tipo de negocio */
function Banda({ tipo, setTipo }: { tipo: Tipo; setTipo: (t: Tipo) => void }) {
  return (
    <div className="relative z-40 bg-[#1c1714] text-white/85 text-[0.8rem]">
      <div className="mx-auto max-w-6xl px-4 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <a href="/" className="hover:text-white">
          ← Demo de <b className="text-white">Jzet Labs</b> · datos de ejemplo
        </a>
        <div className="flex items-center gap-1 rounded-full bg-white/10 p-0.5" role="group" aria-label="Ver la demo como">
          {TIPOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              aria-pressed={t === tipo}
              className={`rounded-full px-3 py-1 transition ${t === tipo ? "bg-white text-[#1c1714] font-semibold" : "hover:text-white"}`}
            >
              {NEGOCIOS[t].etiqueta}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Portada: foto a pantalla completa, menú y botones de vidrio */
function Portada({ n }: { n: Negocio }) {
  const vidrio = "rounded-xl border border-white/25 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition active:scale-[0.97]";
  return (
    <section className="relative min-h-[88svh] flex flex-col overflow-hidden">
      <img key={n.hero} src={n.hero} alt="" className="demo-hero absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,12,14,.55),rgba(10,12,14,.35)_40%,rgba(10,12,14,.75))]" />
      <header className="relative z-10 mx-auto w-full max-w-6xl px-5 py-5 flex items-center justify-between gap-4">
        <span className="text-white font-bold text-[1.15rem] tracking-tight" style={{ fontFamily: "var(--d-titulos)" }}>
          {n.marca}
        </span>
        <nav className="hidden md:flex gap-7 text-white/80 text-[0.95rem]">
          {n.menu.map((m) => (
            <a key={m} href="#tarjetas" className="hover:text-white">
              {m}
            </a>
          ))}
        </nav>
        <a href="#tarjetas" className={`${vidrio} px-4 py-2 text-[0.92rem] font-semibold`}>
          {n.cta}
        </a>
      </header>
      <div className="relative z-10 flex-1 flex items-center">
        <div className="mx-auto w-full max-w-6xl px-5 pb-16">
          <h1 key={n.titulo} className="demo-sube max-w-3xl !text-white text-[2.6rem] sm:text-[4rem] lg:text-[4.6rem] leading-[1.02] tracking-[-0.03em]" style={{ fontFamily: "var(--d-titulos)" }}>
            {n.titulo}
          </h1>
          <p className="mt-5 max-w-xl text-white/85 text-[1.05rem] sm:text-[1.2rem]">{n.bajada}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#tarjetas" className={`${vidrio} px-6 py-3 font-semibold`}>
              {n.botones[0]}
            </a>
            <a href={n.tipo === "tiempo" ? "#semanas" : "#cierre"} className={`${vidrio} px-6 py-3 font-semibold`}>
              {n.botones[1]}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Tarjetas: al pasar el mouse por una, las demás se desenfocan; sin mouse, todas nítidas */
function Tarjetas({ n, alAgregar }: { n: Negocio; alAgregar: (i: Item, o?: string) => void }) {
  const [encima, setEncima] = useState<number | null>(null);
  const [opciones, setOpciones] = useState<Record<string, string>>({});
  useEffect(() => setOpciones({}), [n.tipo]);

  return (
    <section id="tarjetas" className="scroll-mt-4 mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <p className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--d-acento)" }}>
        {n.seccion.etiqueta}
      </p>
      <h2 className="mt-2 text-[2rem] sm:text-[2.8rem]" style={{ fontFamily: "var(--d-titulos)", color: "var(--d-tinta)" }}>
        {n.seccion.titulo}
      </h2>
      <p className="mt-2" style={{ color: "var(--d-suave)" }}>
        {n.seccion.texto}
      </p>

      <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" onMouseLeave={() => setEncima(null)}>
        {n.items.map((it, i) => {
          const borrosa = encima !== null && encima !== i;
          const elegida = opciones[it.nombre] ?? it.opciones?.[1] ?? it.opciones?.[0];
          return (
            <article
              key={n.tipo + it.nombre}
              onMouseEnter={() => setEncima(i)}
              className={`group relative overflow-hidden rounded-2xl aspect-[4/5] transition-all duration-300 ease-out ${borrosa ? "blur-[4px] scale-[0.98] opacity-75" : ""}`}
            >
              <img src={it.foto} alt={it.nombre} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.78),rgba(0,0,0,.1)_55%,transparent)]" />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 text-white">
                <p className="font-semibold text-[1rem] sm:text-[1.3rem] leading-tight" style={{ fontFamily: "var(--d-titulos)" }}>
                  {it.nombre}
                </p>
                <p className="mt-0.5 text-[0.75rem] sm:text-[0.9rem] text-white/75">{it.detalle}</p>
                {it.opciones && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {it.opciones.map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setOpciones((s) => ({ ...s, [it.nombre]: o }))}
                        aria-pressed={o === elegida}
                        className={`min-w-7 rounded-md px-1.5 py-0.5 text-[0.7rem] sm:text-[0.78rem] border transition ${o === elegida ? "bg-white text-black border-white" : "border-white/40 text-white/85 hover:border-white"}`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                )}
                {it.precio !== undefined && (
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="font-semibold text-[0.95rem] sm:text-[1.1rem]">{qz(it.precio)}</span>
                    <button
                      type="button"
                      onClick={() => alAgregar(it, it.opciones ? elegida : undefined)}
                      className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[0.75rem] sm:text-[0.85rem] font-semibold text-white active:scale-90 transition"
                      style={{ background: "var(--d-acento)" }}
                    >
                      <Plus size={14} /> {n.verbo}
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* Dos planes, oscuro, como la referencia */
function Planes({ alApartar }: { alApartar: (plan: string) => void }) {
  return (
    <section id="planes" className="bg-[#0f1514] text-white py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <h2 className="!text-white text-[2.2rem] sm:text-[3rem] tracking-[-0.03em]" style={{ fontFamily: "var(--d-titulos)" }}>
          Dos planes. Sin sorpresas.
        </h2>
        <p className="mt-3 text-white/65">Pague una vez al año. Lo que ve es lo que incluye.</p>
      </div>
      <div className="mx-auto mt-12 max-w-4xl px-5 grid md:grid-cols-2 gap-5">
        {PLANES.map((p) => (
          <div key={p.nombre} className={`relative rounded-2xl p-6 sm:p-7 text-left flex flex-col ${p.destacado ? "border border-white/40 bg-white/[0.06]" : "border border-white/10 bg-white/[0.03]"}`}>
            {p.destacado && <span className="absolute -top-3 left-6 rounded-full bg-white px-3 py-0.5 text-[0.7rem] font-semibold tracking-[0.14em] text-[#0f1514]">RECOMENDADO</span>}
            <p className="text-[1.25rem] font-semibold">{p.nombre}</p>
            <p className="mt-1 text-white/60">{p.nota}</p>
            <div className="my-5 border-t border-white/10" />
            <p className="text-[2.6rem] font-bold leading-none" style={{ fontFamily: "var(--d-titulos)" }}>
              {p.precio} <span className="text-[0.95rem] font-normal text-white/55">al año</span>
            </p>
            <div className="my-5 border-t border-white/10" />
            <ul className="space-y-2.5 flex-1">
              {p.incluye.map((x) => (
                <li key={x} className="flex gap-2.5 text-white/85">
                  <Check size={18} className="shrink-0 mt-0.5" /> {x}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => alApartar(p.nombre)}
              className={`mt-7 rounded-xl py-3 font-semibold inline-flex items-center justify-center gap-2 active:scale-[0.98] transition ${p.destacado ? "bg-white text-[#0f1514] hover:bg-white/90" : "bg-black/40 border border-white/15 hover:bg-white/10"}`}
            >
              Quiero este plan <ArrowRight size={17} />
            </button>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-white/45">Planes y precios de ejemplo.</p>
    </section>
  );
}

/* Semanas del año: libres y apartadas */
function Semanas({ alApartar }: { alApartar: (s: number) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const semanas = useMemo(() => Array.from({ length: 52 }, (_, i) => i + 1), []);
  return (
    <section id="semanas" className="scroll-mt-4 mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <p className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--d-acento)" }}>
        Semanas 2027
      </p>
      <h2 className="mt-2 text-[2rem] sm:text-[2.8rem]" style={{ fontFamily: "var(--d-titulos)", color: "var(--d-tinta)" }}>
        Elija su semana
      </h2>
      <p className="mt-2" style={{ color: "var(--d-suave)" }}>
        Las grises ya están apartadas. Toque una libre.
      </p>
      <div className="mt-8 grid grid-cols-7 sm:grid-cols-13 gap-1.5 sm:gap-2">
        {semanas.map((s) => {
          const ocupada = OCUPADAS.has(s);
          const activa = sel === s;
          return (
            <button
              key={s}
              type="button"
              disabled={ocupada}
              onClick={() => setSel(s)}
              aria-pressed={activa}
              aria-label={`Semana ${s}${ocupada ? ", apartada" : ""}`}
              className={`aspect-square rounded-lg text-[0.8rem] font-semibold transition active:scale-90 ${
                ocupada ? "bg-black/5 text-black/25 line-through cursor-not-allowed" : activa ? "text-white" : "bg-white border border-black/10 hover:border-[var(--d-acento)]"
              }`}
              style={activa ? { background: "var(--d-acento)" } : undefined}
            >
              {s}
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={sel === null}
          onClick={() => sel && alApartar(sel)}
          className="rounded-full px-6 py-3 font-semibold text-white disabled:opacity-40 active:scale-[0.97] transition"
          style={{ background: "var(--d-acento)" }}
        >
          {sel ? `Apartar la semana ${sel}` : "Elija una semana"}
        </button>
        {sel && (
          <button type="button" onClick={() => setSel(null)} className="inline-flex items-center gap-1 text-sm" style={{ color: "var(--d-suave)" }}>
            <X size={15} /> Quitar
          </button>
        )}
      </div>
    </section>
  );
}

function Cierre({ n }: { n: Negocio }) {
  return (
    <footer id="cierre" className="bg-[#1c1714] text-white">
      <div className="mx-auto max-w-6xl px-5 py-14 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
        <div>
          <p className="text-white/60 text-sm">Esta es una demo de {n.etiqueta.toLowerCase()} hecha por Jzet Labs.</p>
          <p className="mt-2 text-[1.8rem] sm:text-[2.3rem] font-bold leading-tight" style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}>
            ¿Quiere una así para su negocio?
          </p>
        </div>
        <div className="flex flex-col sm:flex-row md:justify-end gap-3">
          <a
            href={whatsappLink(`Hola, Joshua. Vi la demo de ${n.etiqueta.toLowerCase()} y quiero una página así para mi negocio.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-principal !rounded-full"
          >
            Escribirle a Joshua
          </a>
          <a href="/web" className="btn !rounded-full border border-white/25 text-white hover:bg-white/10">
            Ver paquetes y precios
          </a>
        </div>
      </div>
    </footer>
  );
}
