/*
 * Demo: tienda de ropa "Nómada Studio" (negocio inventado, datos de ejemplo).
 * Diseño propio, tipo revista: portada partida con foto alta, cinta de avisos,
 * colección con filtros, ficha de cada prenda con tallas, guía de tallas,
 * lookbook y bolsa lateral que arma el pedido de WhatsApp.
 * Fotos libres de Unsplash (src/assets/demo-tienda).
 */
import { useEffect, useState } from "react";
import { ArrowRight, ShoppingBag, Trash2, X } from "lucide-react";
import { Modal } from "@/components/Modal";
import { whatsappLink } from "@/data/site";
import { BandaDemos, Cajon, CierreJzet, Contador, qz } from "../comun";
import ropa1 from "@/assets/demo-tienda/ropa-1.jpg";
import ropa2 from "@/assets/demo-tienda/ropa-2.jpg";
import ropa3 from "@/assets/demo-tienda/ropa-3.jpg";
import ropa4 from "@/assets/demo-tienda/ropa-4.jpg";
import ropa5 from "@/assets/demo-tienda/ropa-5.jpg";
import ropa6 from "@/assets/demo-tienda/ropa-6.jpg";
import ropaHero from "@/assets/demo-tienda/ropa-hero.jpg";
import ropaLook from "@/assets/demo-tienda/ropa-look.jpg";

const TINTA = "#141210";
const ACENTO = "#e8470f";
const FONDO = "#dcd9d2";

type Categoria = "Camisas" | "Pantalones" | "Abrigos" | "Accesorios";
type Prenda = {
  id: string;
  nombre: string;
  categoria: Categoria;
  precio: number;
  foto: string;
  detalle: string;
  tallas: string[];
  colores: { nombre: string; hex: string }[];
  nuevo?: boolean;
  unica?: boolean;
};

const PRENDAS: Prenda[] = [
  { id: "playera", nombre: "Playera básica", categoria: "Camisas", precio: 129, foto: ropa1, detalle: "Algodón grueso de 220 g, corte recto. Se lava y no pierde la forma.", tallas: ["S", "M", "L", "XL"], colores: [{ nombre: "Blanco", hex: "#f3f1ec" }, { nombre: "Negro", hex: "#1b1b1b" }] },
  { id: "camisa", nombre: "Camisa de franela", categoria: "Camisas", precio: 279, foto: ropa3, detalle: "Manga larga, franela suave. Para las mañanas frías de la capital.", tallas: ["S", "M", "L"], colores: [{ nombre: "Naranja", hex: "#e8470f" }], nuevo: true },
  { id: "jeans", nombre: "Jeans rectos", categoria: "Pantalones", precio: 349, foto: ropa2, detalle: "Mezclilla de 12 oz, tiro medio y pierna recta.", tallas: ["28", "30", "32", "34", "36"], colores: [{ nombre: "Azul claro", hex: "#8fb0d3" }, { nombre: "Azul oscuro", hex: "#2d4462" }] },
  { id: "sueter", nombre: "Suéter tejido", categoria: "Abrigos", precio: 299, foto: ropa4, detalle: "Tejido grueso en colores de otoño. Holgado, para ponerlo encima de todo.", tallas: ["S", "M", "L"], colores: [{ nombre: "Ladrillo", hex: "#9a4b32" }, { nombre: "Café", hex: "#5b4033" }], nuevo: true },
  { id: "chaqueta", nombre: "Chaqueta pintada", categoria: "Abrigos", precio: 690, foto: ropa6, detalle: "Pintada a mano, una por una. No hay dos iguales.", tallas: ["M", "L"], colores: [{ nombre: "Única", hex: "#e2873b" }], unica: true },
  { id: "kit", nombre: "Kit de verano", categoria: "Accesorios", precio: 389, foto: ropa5, detalle: "Lentes de sol, bolso de palma y blusa ligera, en un solo paquete.", tallas: ["Única"], colores: [{ nombre: "Multicolor", hex: "#e8b44c" }] },
];

const CATEGORIAS: ("Todo" | Categoria)[] = ["Todo", "Camisas", "Pantalones", "Abrigos", "Accesorios"];

const LOOKS = [
  { n: "01", titulo: "Para la oficina sin corbata", piezas: ["camisa", "jeans"] },
  { n: "02", titulo: "Fin de semana en Antigua", piezas: ["playera", "kit"] },
  { n: "03", titulo: "Noche fría en la capital", piezas: ["sueter", "jeans"] },
];

const ENVIOS = [
  { id: "capital", nombre: "Capital", precio: 35 },
  { id: "departamentos", nombre: "Departamentos", precio: 50 },
];

type Linea = { prenda: Prenda; talla: string; cantidad: number };

export default function RopaDemo() {
  const [filtro, setFiltro] = useState<(typeof CATEGORIAS)[number]>("Todo");
  const [ficha, setFicha] = useState<Prenda | null>(null);
  const [guia, setGuia] = useState(false);
  const [bolsaAbierta, setBolsaAbierta] = useState(false);
  const [bolsa, setBolsa] = useState<Linea[]>([]);
  const [envio, setEnvio] = useState(ENVIOS[0]);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Nómada Studio · Demo de Jzet Labs";
  }, []);

  const lista = PRENDAS.filter((p) => filtro === "Todo" || p.categoria === filtro);
  const piezas = bolsa.reduce((s, l) => s + l.cantidad, 0);
  const subtotal = bolsa.reduce((s, l) => s + l.prenda.precio * l.cantidad, 0);

  function agregar(prenda: Prenda, talla: string, cantidad: number) {
    setBolsa((b) => {
      const i = b.findIndex((l) => l.prenda.id === prenda.id && l.talla === talla);
      if (i >= 0) return b.map((l, k) => (k === i ? { ...l, cantidad: l.cantidad + cantidad } : l));
      return [...b, { prenda, talla, cantidad }];
    });
    setFicha(null);
    setBolsaAbierta(true);
  }

  function pedir() {
    const lineas = bolsa.map((l) => `• ${l.cantidad} × ${l.prenda.nombre}, talla ${l.talla} — ${qz(l.prenda.precio * l.cantidad)}`);
    setBolsaAbierta(false);
    setMensaje(`Hola, Nómada Studio. Quiero hacer este pedido:\n${lineas.join("\n")}\nEnvío a ${envio.nombre}: ${qz(envio.precio)}\nTotal: ${qz(subtotal + envio.precio)}`);
  }

  return (
    <div style={{ background: FONDO, color: TINTA }} className="min-h-screen">
      <BandaDemos />

      {/* encabezado */}
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#dcd9d2]/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between gap-4">
          <a href="#inicio" className="font-[family-name:var(--font-titulo)] font-extrabold tracking-[0.32em] text-[1.05rem]">
            NÓMADA
          </a>
          <nav className="hidden md:flex gap-7 text-[0.92rem]">
            {CATEGORIAS.slice(1).map((c) => (
              <a
                key={c}
                href="#coleccion"
                onClick={() => setFiltro(c)}
                className="hover:underline underline-offset-4"
              >
                {c}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setBolsaAbierta(true)}
            className="relative inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-[0.9rem] font-semibold hover:border-black active:scale-95 transition"
            aria-label={`Bolsa, ${piezas} prendas`}
          >
            <ShoppingBag size={17} /> Bolsa
            {piezas > 0 && (
              <span className="grid place-items-center min-w-5 h-5 px-1 rounded-full text-[0.7rem] text-white" style={{ background: ACENTO }}>
                {piezas}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* portada partida */}
      <section id="inicio" className="mx-auto max-w-7xl px-5 pt-10 pb-16 sm:pt-16 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
        <div>
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.2em]" style={{ color: ACENTO }}>
            Drop 04 · Temporada seca 2026
          </p>
          <h1 className="mt-5 !text-[#141210] font-[family-name:var(--font-titulo)] font-extrabold text-[3.4rem] sm:text-[5rem] lg:text-[6.2rem] leading-[0.92] tracking-[-0.045em]">
            Hecho para
            <br />
            andar.
          </h1>
          <p className="mt-6 max-w-md text-[1.05rem] text-black/70">
            Ropa cómoda y con carácter, hecha en lotes pequeños en Guatemala. Elija su talla, arme su bolsa y le llega el pedido por WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a href="#coleccion" className="inline-flex items-center gap-2 rounded-full bg-[#141210] px-6 py-3.5 text-white font-semibold hover:bg-black active:scale-[0.97] transition">
              Ver la colección <ArrowRight size={18} />
            </a>
            <button type="button" onClick={() => setGuia(true)} className="font-semibold underline underline-offset-4 decoration-black/30 hover:decoration-black">
              Guía de tallas
            </button>
          </div>
        </div>

        <div className="relative">
          <button type="button" onClick={() => setFicha(PRENDAS.find((p) => p.id === "chaqueta")!)} className="group block w-full overflow-hidden rounded-[4px]" aria-label="Ver la chaqueta pintada">
            <img src={ropaLook} alt="Persona de espaldas con una chaqueta pintada a mano" className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          </button>
          <div className="absolute left-4 bottom-4 sm:-left-6 sm:bottom-8 rounded-[4px] bg-white px-4 py-3 shadow-[0_16px_40px_-18px_rgba(0,0,0,.4)]">
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-black/50">Pieza única</p>
            <p className="font-semibold">Chaqueta pintada · Q690</p>
          </div>
        </div>
      </section>

      {/* cinta de avisos */}
      <div className="bg-[#e8470f] text-[#141210] overflow-hidden border-y-2 border-[#141210]">
        <div className="cinta flex whitespace-nowrap py-3 text-[0.85rem] font-semibold tracking-[0.06em]">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex shrink-0" aria-hidden={k === 1}>
              {["Envíos a toda Guatemala", "Pago contra entrega en la capital", "Cambio de talla gratis en 7 días", "Hecho en lotes pequeños"].map((t) => (
                <span key={t} className="px-8">
                  {t} <span className="ml-8 opacity-40">/</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* colección */}
      <section id="coleccion" className="scroll-mt-16 mx-auto max-w-7xl px-5 py-16 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="!text-[#141210] font-[family-name:var(--font-titulo)] font-extrabold text-[2.4rem] sm:text-[3.4rem] tracking-[-0.04em] leading-none">
            La colección <sup className="text-[0.35em] font-medium text-black/50 align-top">({lista.length})</sup>
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2" role="group" aria-label="Filtrar por tipo de prenda">
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFiltro(c)}
                aria-pressed={filtro === c}
                className={`text-[0.95rem] ${filtro === c ? "font-semibold underline underline-offset-[6px] decoration-2" : "text-black/55 hover:text-black"}`}
                style={filtro === c ? { textDecorationColor: ACENTO } : undefined}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-10">
          {lista.map((p) => (
            <button key={p.id} type="button" onClick={() => setFicha(p)} className="group text-left">
              <div className="relative overflow-hidden rounded-[4px] bg-black/5">
                <img src={p.foto} alt={p.nombre} className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
                {(p.nuevo || p.unica) && (
                  <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em]">
                    {p.unica ? "Pieza única" : "Nuevo"}
                  </span>
                )}
                <span className="absolute inset-x-3 bottom-3 rounded-full bg-white/95 py-2 text-center text-[0.85rem] font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
                  Ver prenda
                </span>
              </div>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold leading-tight">{p.nombre}</p>
                  <div className="mt-1.5 flex gap-1.5">
                    {p.colores.map((c) => (
                      <span key={c.nombre} title={c.nombre} className="w-3.5 h-3.5 rounded-full border border-black/15" style={{ background: c.hex }} />
                    ))}
                  </div>
                </div>
                <p className="font-semibold tabular-nums">{qz(p.precio)}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* lookbook */}
      <section className="bg-[#141210] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24 grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
          <img src={ropaHero} alt="Percheros con camisas en la tienda" className="w-full aspect-[16/10] object-cover rounded-[4px]" loading="lazy" />
          <div>
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.2em]" style={{ color: "#f08a55" }}>
              Lookbook
            </p>
            <h2 className="mt-3 !text-white font-[family-name:var(--font-titulo)] font-extrabold text-[2.4rem] sm:text-[3rem] tracking-[-0.04em] leading-none">Cómo se usa</h2>
            <ul className="mt-8 divide-y divide-white/15 border-y border-white/15">
              {LOOKS.map((l) => {
                const piezasLook = l.piezas.map((id) => PRENDAS.find((p) => p.id === id)!);
                return (
                  <li key={l.n} className="py-4 flex items-center gap-4">
                    <span className="text-white/40 tabular-nums">{l.n}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{l.titulo}</p>
                      <p className="text-sm text-white/60">{piezasLook.map((p) => p.nombre).join(" + ")}</p>
                    </div>
                    <button type="button" onClick={() => setFicha(piezasLook[0])} className="rounded-full border border-white/25 px-3.5 py-1.5 text-sm hover:bg-white hover:text-black transition">
                      Ver
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* beneficios */}
      <section className="mx-auto max-w-7xl px-5 py-14 grid sm:grid-cols-3 gap-8 border-b border-black/10">
        {[
          ["Envíos", "Capital Q35 y departamentos Q50. Le llega en 1 a 3 días hábiles."],
          ["Pago contra entrega", "En la capital paga cuando recibe. También transferencia o tarjeta."],
          ["Cambios de talla", "Si no le quedó, la cambiamos gratis en los primeros 7 días."],
        ].map(([t, d]) => (
          <div key={t}>
            <p className="font-[family-name:var(--font-titulo)] font-bold text-[1.25rem]">{t}</p>
            <p className="mt-1.5 text-black/65">{d}</p>
          </div>
        ))}
      </section>

      <CierreJzet demo="tienda de ropa" />

      {/* ficha de la prenda */}
      <Modal abierto={!!ficha} alCerrar={() => setFicha(null)} titulo={ficha?.nombre ?? "Prenda"} ancho="sm:w-[min(56rem,94vw)]">
        {ficha && <Ficha key={ficha.id} p={ficha} alAgregar={agregar} alVerGuia={() => setGuia(true)} />}
      </Modal>

      {/* guía de tallas */}
      <Modal abierto={guia} alCerrar={() => setGuia(false)} titulo="Guía de tallas" ancho="sm:w-[min(30rem,92vw)]">
        <div className="px-6 pt-6 pb-7 text-[#141210]">
          <h3 className="!text-[#141210] text-[1.5rem]">Guía de tallas</h3>
          <p className="mt-1 text-sm text-black/60">Medidas de la prenda en centímetros, tomadas en plano.</p>
          <table className="mt-5 w-full text-left text-[0.95rem]">
            <thead>
              <tr className="border-b border-black/15 text-black/55 text-sm">
                <th className="py-2 font-medium">Talla</th>
                <th className="py-2 font-medium">Pecho</th>
                <th className="py-2 font-medium">Largo</th>
                <th className="py-2 font-medium">Manga</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {[
                ["S", "50", "70", "20"],
                ["M", "53", "72", "21"],
                ["L", "56", "74", "22"],
                ["XL", "59", "76", "23"],
              ].map((f) => (
                <tr key={f[0]} className="border-b border-black/10">
                  {f.map((c, i) => (
                    <td key={i} className={`py-2.5 ${i === 0 ? "font-semibold" : ""}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm text-black/60">¿Duda entre dos tallas? Escríbanos su altura y peso y le recomendamos una.</p>
        </div>
      </Modal>

      {/* bolsa lateral */}
      <Cajon abierto={bolsaAbierta} alCerrar={() => setBolsaAbierta(false)}>
        <div className="flex h-full flex-col text-[#141210]">
          <div className="flex items-center justify-between px-6 h-16 border-b border-black/10">
            <p className="font-[family-name:var(--font-titulo)] font-bold text-[1.2rem]">Su bolsa ({piezas})</p>
            <button type="button" onClick={() => setBolsaAbierta(false)} aria-label="Cerrar la bolsa" className="grid place-items-center w-10 h-10 rounded-full hover:bg-black/5 active:scale-90">
              <X size={20} />
            </button>
          </div>
          {bolsa.length === 0 ? (
            <div className="flex-1 grid place-items-center px-8 text-center">
              <div>
                <p className="font-semibold text-[1.1rem]">Su bolsa está vacía</p>
                <p className="mt-1 text-black/60">Elija una prenda de la colección para empezar.</p>
                <button type="button" onClick={() => setBolsaAbierta(false)} className="mt-5 rounded-full bg-[#141210] px-5 py-2.5 text-white font-semibold">
                  Ver la colección
                </button>
              </div>
            </div>
          ) : (
            <>
              <ul className="flex-1 overflow-y-auto divide-y divide-black/10 px-6">
                {bolsa.map((l, k) => (
                  <li key={l.prenda.id + l.talla} className="py-4 flex gap-3">
                    <img src={l.prenda.foto} alt="" className="w-20 aspect-[4/5] object-cover rounded-[4px]" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <p className="font-semibold leading-tight">{l.prenda.nombre}</p>
                        <button
                          type="button"
                          aria-label={`Quitar ${l.prenda.nombre}`}
                          onClick={() => setBolsa((b) => b.filter((_, i) => i !== k))}
                          className="text-black/40 hover:text-black"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-black/55">Talla {l.talla}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <Contador
                          valor={l.cantidad}
                          alCambiar={(v) => setBolsa((b) => (v <= 0 ? b.filter((_, i) => i !== k) : b.map((x, i) => (i === k ? { ...x, cantidad: v } : x))))}
                        />
                        <p className="font-semibold tabular-nums">{qz(l.prenda.precio * l.cantidad)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-black/10 px-6 py-5 space-y-3">
                <div className="flex gap-2" role="group" aria-label="Envío">
                  {ENVIOS.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setEnvio(e)}
                      aria-pressed={envio.id === e.id}
                      className={`flex-1 rounded-full border px-3 py-2 text-sm transition ${envio.id === e.id ? "border-[#141210] bg-[#141210] text-white" : "border-black/15 hover:border-black"}`}
                    >
                      {e.nombre} · {qz(e.precio)}
                    </button>
                  ))}
                </div>
                <p className="flex justify-between text-black/65">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{qz(subtotal)}</span>
                </p>
                <p className="flex justify-between text-[1.15rem] font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">{qz(subtotal + envio.precio)}</span>
                </p>
                <button type="button" onClick={pedir} className="w-full rounded-full py-3.5 font-semibold text-white active:scale-[0.98] transition" style={{ background: ACENTO }}>
                  Pedir por WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </Cajon>

      {/* así le llega el pedido */}
      <Modal abierto={mensaje !== null} alCerrar={() => setMensaje(null)} titulo="Así le llega el pedido" ancho="sm:w-[min(26rem,92vw)]">
        <div className="px-6 pt-6 pb-6 text-tinta">
          <p className="etiqueta">Así funciona</p>
          <h3 className="mt-2 text-[1.4rem] pr-8">En su tienda, el pedido le llega directo a su WhatsApp:</h3>
          <div className="mt-4 rounded-2xl bg-[#e7ddd3] p-4">
            <p className="ml-auto w-fit max-w-[92%] whitespace-pre-line rounded-[1rem_1rem_0.3rem_1rem] bg-[#d9fdd3] px-3.5 py-2.5 text-[0.92rem] text-[#111b21] shadow-sm">{mensaje}</p>
          </div>
          <p className="mt-4 text-sm text-suave">Esto es una demo: el pedido no se envía. ¿Quiere una tienda así?</p>
          <a
            href={whatsappLink("Hola, Joshua. Vi la demo de la tienda de ropa y quiero una página así para mi negocio.")}
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

function Ficha({ p, alAgregar, alVerGuia }: { p: Prenda; alAgregar: (p: Prenda, t: string, c: number) => void; alVerGuia: () => void }) {
  const [talla, setTalla] = useState(p.tallas.length === 1 ? p.tallas[0] : "");
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState("");
  return (
    <div className="grid sm:grid-cols-2 text-[#141210]">
      <img src={p.foto} alt={p.nombre} className="w-full h-full max-h-[50svh] sm:max-h-none aspect-[4/5] object-cover sm:rounded-l-[1.75rem]" />
      <div className="px-6 sm:px-8 pt-6 sm:pt-10 pb-7 flex flex-col">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-black/50">{p.categoria}</p>
        <h3 className="mt-2 pr-10 !text-[#141210] font-[family-name:var(--font-titulo)] font-extrabold text-[2rem] leading-tight tracking-[-0.03em]">{p.nombre}</h3>
        <p className="mt-2 text-[1.3rem] font-semibold tabular-nums">{qz(p.precio)}</p>
        <p className="mt-4 text-black/70">{p.detalle}</p>

        <p className="mt-6 text-sm font-semibold">
          Color: <span className="font-normal text-black/65">{p.colores.map((c) => c.nombre).join(" / ")}</span>
        </p>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm font-semibold">Talla</p>
          {p.tallas.length > 1 && (
            <button type="button" onClick={alVerGuia} className="text-sm underline underline-offset-4 text-black/60 hover:text-black">
              Guía de tallas
            </button>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {p.tallas.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTalla(t);
                setError("");
              }}
              aria-pressed={talla === t}
              className={`min-w-12 rounded-full border px-3 py-2 text-sm font-semibold transition active:scale-95 ${talla === t ? "border-[#141210] bg-[#141210] text-white" : "border-black/20 hover:border-black"}`}
            >
              {t}
            </button>
          ))}
        </div>
        {error && <p className="mt-2 text-sm text-[#b42318]">{error}</p>}

        <div className="mt-6 flex items-center gap-3">
          <Contador valor={cantidad} alCambiar={(v) => setCantidad(Math.max(1, v))} />
          <button
            type="button"
            onClick={() => {
              if (!talla) {
                setError("Elija su talla primero.");
                return;
              }
              alAgregar(p, talla, cantidad);
            }}
            className="flex-1 rounded-full bg-[#141210] py-3.5 text-white font-semibold hover:bg-black active:scale-[0.98] transition"
          >
            Agregar a la bolsa
          </button>
        </div>
        <p className="mt-4 text-xs text-black/50">Envío a toda Guatemala · Cambio de talla gratis en 7 días</p>
      </div>
    </div>
  );
}

/* Panel que entra desde la derecha (la bolsa) */
