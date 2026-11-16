/*
 * Demo: "Ámbar Cosmetics & Makeup School" (negocio inventado, datos de ejemplo).
 * Pensada para marcas de maquillaje que tienen línea propia, academia y
 * servicios, y hoy venden solo por Instagram. Estética negro, crema y dorado.
 * Tienda con tonos, buscador de tono de base, tips en carrusel (como sus
 * publicaciones), cursos con fechas y cupos, servicios en estudio, tienda
 * física y bolsa que arma el pedido de WhatsApp.
 * Fotos libres de Unsplash, sin marcas visibles (src/assets/demo-cosmeticos).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Bell, Brush, CalendarDays, Check, Clock, GraduationCap, Leaf, Link2, MapPin, MessageCircle, ShoppingBag, Sparkles, Trash2, X } from "lucide-react";
import { Modal } from "@/components/Modal";
import { BandaDemos, Cajon, CierreJzet, Contador, MensajeWhatsApp, qz } from "../comun";
import rostro from "@/assets/demo-cosmeticos/rostro.jpg";
import polvoNegro from "@/assets/demo-cosmeticos/polvo-negro.jpg";
import academiaFoto from "@/assets/demo-cosmeticos/academia.jpg";
import estudio from "@/assets/demo-cosmeticos/estudio.jpg";
import maquillista from "@/assets/demo-cosmeticos/maquillista.jpg";
import delineado from "@/assets/demo-cosmeticos/delineado.jpg";
import espejo from "@/assets/demo-cosmeticos/espejo.jpg";
import baseFoto from "@/assets/demo-cosmeticos/kit.jpg";
import rubor from "@/assets/demo-cosmeticos/rubor.jpg";
import polvo from "@/assets/demo-cosmeticos/polvo.jpg";
import paleta from "@/assets/demo-cosmeticos/paleta.jpg";
import brochas from "@/assets/demo-cosmeticos/brochas.jpg";
import labialNude from "@/assets/demo-cosmeticos/labial-nude.jpg";
import labialRojo from "@/assets/demo-cosmeticos/labial-rojo.jpg";
import serum from "@/assets/demo-cosmeticos/serum.jpg";
import crema from "@/assets/demo-cosmeticos/crema.jpg";
import limpiador from "@/assets/demo-cosmeticos/limpiador.jpg";
import aceite from "@/assets/demo-cosmeticos/aceite.jpg";
import graduada1 from "@/assets/demo-cosmeticos/graduada-1.jpg";
import graduada2 from "@/assets/demo-cosmeticos/graduada-2.jpg";
import graduada3 from "@/assets/demo-cosmeticos/graduada-3.jpg";
import graduada4 from "@/assets/demo-cosmeticos/graduada-4.jpg";
import graduada5 from "@/assets/demo-cosmeticos/graduada-5.jpg";
import graduada6 from "@/assets/demo-cosmeticos/graduada-6.jpg";

const NEGRO = "#0e0d0c";
const CREMA = "#f3ede4";
const PAPEL = "#faf8f4";
const DORADO = "#b38b54";
const SERIF = '"Fraunces", Georgia, serif';
const MAYUS = "uppercase tracking-[0.22em]";

type Categoria = "Makeup" | "Skincare" | "Brochas";
type Tono = { nombre: string; hex: string };
type Producto = {
  id: string;
  nombre: string;
  categoria: Categoria;
  precio: number;
  foto: string;
  corto: string;
  sirve: string;
  uso: string;
  tonos?: Tono[];
  etiqueta?: string;
};

const TONOS_BASE: Tono[] = [
  { nombre: "Porcelana", hex: "#f1d6c2" },
  { nombre: "Marfil", hex: "#e8c3a4" },
  { nombre: "Beige", hex: "#d7a882" },
  { nombre: "Miel", hex: "#c08c62" },
  { nombre: "Canela", hex: "#a06d48" },
  { nombre: "Cacao", hex: "#6f4a32" },
];
const TONOS_RUBOR: Tono[] = [
  { nombre: "Durazno", hex: "#eb9373" },
  { nombre: "Coral", hex: "#e2675a" },
  { nombre: "Rosa", hex: "#d97f95" },
];
const TONOS_LABIAL: Tono[] = [
  { nombre: "Nude", hex: "#c98b7c" },
  { nombre: "Canela", hex: "#a2493f" },
  { nombre: "Malva", hex: "#b75d8c" },
];

const PRODUCTOS: Producto[] = [
  { id: "base", nombre: "Base HD líquida", categoria: "Makeup", precio: 245, foto: baseFoto, corto: "Cobertura media, acabado natural.", sirve: "Unifica el tono sin verse pesada. Dura todo el día y no tapa los poros.", uso: "Con brocha o esponja húmeda, del centro de la cara hacia afuera.", tonos: TONOS_BASE, etiqueta: "Más vendido" },
  { id: "rubor", nombre: "Rubor en polvo", categoria: "Makeup", precio: 135, foto: rubor, corto: "Color que se difumina fácil.", sirve: "Da color y vida a la cara. Se construye por capas, sin manchar.", uso: "Sonríe y aplícalo en la parte alta del pómulo, hacia la sien.", tonos: TONOS_RUBOR },
  { id: "polvo", nombre: "Polvo traslúcido", categoria: "Makeup", precio: 155, foto: polvo, corto: "Sella la base, quita el brillo.", sirve: "Fija el maquillaje y controla el brillo sin dejar la cara blanca en fotos.", uso: "Poca cantidad, con brocha grande, a toquecitos en la zona T." },
  { id: "contorno", nombre: "Paleta de contorno", categoria: "Makeup", precio: 195, foto: paleta, corto: "8 tonos para esculpir.", sirve: "Contorno, iluminador y corrector en una sola paleta, para pieles claras y morenas.", uso: "Tonos oscuros bajo el pómulo, claros en lo alto. Difumina bien.", etiqueta: "Nuevo" },
  { id: "labial", nombre: "Labial mate", categoria: "Makeup", precio: 89, foto: labialNude, corto: "Dura hasta 8 horas.", sirve: "Color intenso que no se corre ni reseca los labios.", uso: "Aplícalo directo o con pincel. Para más duración, una segunda capa.", tonos: TONOS_LABIAL },
  { id: "rojo", nombre: "Labial rojo clásico", categoria: "Makeup", precio: 95, foto: labialRojo, corto: "El rojo que le queda a todas.", sirve: "Rojo con base azul que hace ver los dientes más blancos.", uso: "Delinea primero el contorno y rellena." },
  { id: "serum", nombre: "Sérum de vitamina C", categoria: "Skincare", precio: 189, foto: serum, corto: "Ilumina y empareja el tono.", sirve: "Ayuda a bajar manchas. Con extractos de naranja y camu camu.", uso: "En la mañana, 3 gotas antes de la crema." },
  { id: "crema", nombre: "Crema hidratante botánica", categoria: "Skincare", precio: 165, foto: crema, corto: "Hidrata sin dejar brillo.", sirve: "Con aloe y caléndula. Prepara la piel para que la base se vea mejor.", uso: "Mañana y noche, después del sérum." },
  { id: "limpiador", nombre: "Limpiador en gel", categoria: "Skincare", precio: 99, foto: limpiador, corto: "Quita todo el maquillaje.", sirve: "Limpia sin resecar, con té verde y pepino.", uso: "En la noche, masajea 30 segundos y enjuaga." },
  { id: "aceite", nombre: "Aceite facial de noche", categoria: "Skincare", precio: 145, foto: aceite, corto: "Repara mientras duerme.", sirve: "Rosa mosqueta y jojoba para la piel seca o cansada.", uso: "En la noche, 2 o 3 gotas al final de la rutina." },
  { id: "brochas", nombre: "Set de 12 brochas", categoria: "Brochas", precio: 320, foto: brochas, corto: "Las mismas de la academia.", sirve: "Todo lo que necesitas para base, polvo, rubor, ojos y cejas. Pelo sintético suave.", uso: "Lávalas una vez por semana con jabón neutro.", etiqueta: "Kit de alumna" },
];
const porId = (id: string) => PRODUCTOS.find((p) => p.id === id)!;
const CATEGORIAS: ("Todo" | Categoria)[] = ["Todo", "Makeup", "Skincare", "Brochas"];
const SELLOS: Record<Categoria, string[]> = {
  Makeup: ["Libre de parabenos", "Hipoalergénico", "No comedogénico"],
  Skincare: ["Ingredientes botánicos", "Libre de parabenos"],
  Brochas: ["Pelo sintético", "Libre de crueldad"],
};

/* buscador de tono: tono de piel + subtono → tono de base y rubor */
const PIELES = ["Clara", "Media", "Trigueña", "Morena"] as const;
const SUBTONOS = [
  { id: "calido", t: "Verdes", d: "Subtono cálido" },
  { id: "frio", t: "Azules o moradas", d: "Subtono frío" },
  { id: "neutro", t: "No sé, de las dos", d: "Subtono neutro" },
] as const;
function tonoPara(piel: (typeof PIELES)[number], sub: (typeof SUBTONOS)[number]["id"]) {
  const i = PIELES.indexOf(piel);
  const base = TONOS_BASE[Math.min(5, i + (sub === "calido" && i > 0 ? 1 : 0) + (i >= 2 ? 1 : 0))];
  const rub = sub === "frio" ? TONOS_RUBOR[2] : i >= 2 ? TONOS_RUBOR[1] : TONOS_RUBOR[0];
  return { base, rub };
}

/* tips como los de sus publicaciones */
const TIPS = [
  { t: "Aplicarlo demasiado abajo", d: "Llevar el rubor a la parte baja de la mejilla hace ver la cara más caída. Aplícalo hacia arriba, hacia la sien." },
  { t: "Usar mucho producto", d: "Empieza con poquito y ve subiendo. Quitar rubor de más es mucho más difícil que agregar." },
  { t: "No difuminar los bordes", d: "Si se nota dónde empieza y dónde termina, falta difuminar. Usa una brocha limpia con movimientos circulares." },
  { t: "Un tono que no es para ti", d: "Si tu subtono es cálido, busca durazno o coral. Si es frío, rosas. Nuestro buscador de tono te ayuda." },
  { t: "Ponerlo sobre la piel seca", d: "Sobre piel sin hidratar el polvo se pega en parches. Hidrata primero y espera un minuto." },
];

const CURSOS = [
  { id: "auto", nombre: "Automaquillaje", nivel: "Para principiantes", dura: "1 sábado · 9:00 a 13:00", precio: 450, cupos: 4, fechas: ["Sáb 28 de noviembre", "Sáb 12 de diciembre"], incluye: ["Aprendes con tu propio maquillaje", "Mini kit de regalo", "Grupo de máximo 10"] },
  { id: "pro", nombre: "Maquillaje profesional", nivel: "Para trabajar de esto", dura: "8 semanas · sábados", precio: 3200, cupos: 6, fechas: ["Inicia 9 de enero", "Inicia 6 de febrero"], incluye: ["Set de 12 brochas incluido", "Prácticas con modelos", "Certificado de la academia"], destacado: true },
  { id: "novias", nombre: "Masterclass novias y eventos", nivel: "Si ya maquillas", dura: "1 domingo · 9:00 a 15:00", precio: 900, cupos: 2, fechas: ["Dom 6 de diciembre"], incluye: ["Maquillaje que dura 12 horas", "Fotos con flash sin brillo", "Cómo cobrar tus servicios"] },
];

const SERVICIOS = [
  { nombre: "Maquillaje social", precio: 350, d: "Para fiestas, graduaciones y sesiones de fotos." },
  { nombre: "Maquillaje y peinado", precio: 550, d: "Todo listo en 1 hora y media, en el estudio." },
  { nombre: "Novias", precio: 1200, d: "Incluye prueba previa y maquillaje el día de la boda." },
];

const ENVIOS = [
  { id: "capital", nombre: "Capital", precio: 30 },
  { id: "departamentos", nombre: "Departamentos", precio: 45 },
  { id: "tienda", nombre: "Recoger en tienda", precio: 0 },
];
const GRATIS = 400;

type Linea = { p: Producto; tono?: string; cantidad: number; precio: number };

export default function CosmeticosDemo() {
  const [filtro, setFiltro] = useState<(typeof CATEGORIAS)[number]>("Todo");
  const [ficha, setFicha] = useState<{ p: Producto; tono?: string } | null>(null);
  const [bolsaAbierta, setBolsaAbierta] = useState(false);
  const [bolsa, setBolsa] = useState<Linea[]>([]);
  const [envio, setEnvio] = useState(ENVIOS[0]);
  const [mensaje, setMensaje] = useState<{ texto: string; que: string } | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Ámbar Cosmetics · Demo de Jzet Labs";
  }, []);
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 2200);
    return () => clearTimeout(t);
  }, [aviso]);

  const lista = PRODUCTOS.filter((p) => filtro === "Todo" || p.categoria === filtro);
  const piezas = bolsa.reduce((s, l) => s + l.cantidad, 0);
  const subtotal = bolsa.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const costoEnvio = envio.precio === 0 || subtotal >= GRATIS ? 0 : envio.precio;

  function agregar(p: Producto, tono?: string, cantidad = 1, precio = p.precio) {
    setBolsa((b) => {
      const i = b.findIndex((l) => l.p.id === p.id && l.tono === tono && l.precio === precio);
      if (i >= 0) return b.map((l, k) => (k === i ? { ...l, cantidad: l.cantidad + cantidad } : l));
      return [...b, { p, tono, cantidad, precio }];
    });
    setAviso(`${p.nombre}${tono ? `, ${tono}` : ""} está en tu bolsa`);
  }

  function pedir() {
    const lineas = bolsa.map((l) => `• ${l.cantidad} × ${l.p.nombre}${l.tono ? ` (${l.tono})` : ""}: ${qz(l.precio * l.cantidad)}`);
    setBolsaAbierta(false);
    setMensaje({
      que: "el pedido",
      texto: `Hola, Ámbar. Quiero hacer este pedido:\n${lineas.join("\n")}\n${envio.id === "tienda" ? "Lo paso a recoger a la tienda" : `Envío a ${envio.nombre}: ${costoEnvio ? qz(costoEnvio) : "gratis"}`}\nTotal: ${qz(subtotal + costoEnvio)}`,
    });
  }

  const enlace = "hover:text-[#b38b54] transition";

  return (
    <div style={{ background: PAPEL, color: NEGRO }} className="min-h-screen">
      <BandaDemos />

      {/* cinta con los sellos de la línea */}
      <div className={`text-center text-[0.7rem] sm:text-[0.72rem] py-2 px-4 text-white/80 ${MAYUS}`} style={{ background: NEGRO }}>
        Libre de parabenos · Hipoalergénico · No comedogénico
      </div>

      {/* encabezado */}
      <header className="sticky top-0 z-30 border-b border-black/10 backdrop-blur" style={{ background: "rgba(250,248,244,.92)" }}>
        <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between gap-4">
          <a href="#inicio" className="leading-none text-center">
            <span className="block text-[1.5rem] font-semibold" style={{ fontFamily: SERIF }}>
              Ámbar
            </span>
            <span className="block text-[0.52rem] tracking-[0.42em] uppercase -mt-0.5">cosmetics</span>
          </a>
          <nav className={`hidden lg:flex gap-7 text-[0.75rem] ${MAYUS}`}>
            <a href="#tienda" className={enlace}>
              Tienda
            </a>
            <a href="#tono" className={enlace}>
              Tu tono
            </a>
            <a href="#tips" className={enlace}>
              Tips
            </a>
            <a href="#academia" className={enlace}>
              Academia
            </a>
            <a href="#servicios" className={enlace}>
              Servicios
            </a>
            <a href="#visitenos" className={enlace}>
              Visítanos
            </a>
          </nav>
          <button
            type="button"
            onClick={() => setBolsaAbierta(true)}
            className="relative inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-[0.85rem] font-semibold hover:border-black active:scale-95 transition"
            aria-label={`Bolsa, ${piezas} productos`}
          >
            <ShoppingBag size={17} /> Bolsa
            {piezas > 0 && (
              <span className="grid place-items-center min-w-5 h-5 px-1 rounded-full text-[0.7rem] text-white" style={{ background: DORADO }}>
                {piezas}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* portada negra */}
      <section id="inicio" className="text-white" style={{ background: NEGRO }}>
        <div className="mx-auto max-w-7xl px-5 pt-12 pb-14 sm:pt-16 sm:pb-20 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
          <div>
            <p className={`text-[0.72rem] ${MAYUS}`} style={{ color: DORADO }}>
              Cosmetics & Makeup School · Guatemala
            </p>
            <h1 className="mt-5 text-[2.9rem] sm:text-[4.4rem] leading-[0.98] tracking-[-0.02em] font-semibold !text-white" style={{ fontFamily: SERIF }}>
              Maquillaje que <em style={{ color: DORADO }}>cuida</em> tu piel.
            </h1>
            <p className="mt-6 max-w-lg text-[1.06rem] text-white/70">
              Nuestra propia línea de makeup y skincare, y una academia donde te enseñamos a usarla. Compra en línea, aprende con nosotras o ven a maquillarte al estudio.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#tienda" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold text-black active:scale-[0.97] transition" style={{ background: DORADO }}>
                Comprar <ArrowRight size={17} />
              </a>
              <a href="#academia" className="rounded-full px-6 py-3.5 font-semibold border border-white/30 hover:border-white active:scale-[0.97] transition">
                Ver cursos
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[440px]">
            <img src={rostro} alt="Mujer con maquillaje natural y piel luminosa" className="w-full aspect-[4/5] object-cover" />
            <button
              type="button"
              onClick={() => setFicha({ p: porId("base") })}
              className="absolute -left-3 sm:-left-10 bottom-8 flex items-center gap-3 bg-white p-2.5 pr-4 text-left text-black shadow-[0_20px_40px_-20px_rgba(0,0,0,.7)] active:scale-95 transition"
            >
              <img src={baseFoto} alt="" className="w-14 h-14 object-cover" />
              <span>
                <span className={`block text-[0.62rem] ${MAYUS}`} style={{ color: DORADO }}>
                  6 tonos
                </span>
                <span className="block font-semibold leading-tight">Base HD líquida</span>
                <span className="block text-sm text-black/60">{qz(245)}</span>
              </span>
            </button>
          </div>
        </div>

        {/* accesos como los destacados de Instagram */}
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-5 py-6 flex gap-5 sm:gap-8 overflow-x-auto sm:justify-center [scrollbar-width:none]">
            {[
              { t: "Makeup", href: "#tienda", I: Sparkles, f: () => setFiltro("Makeup") },
              { t: "Skincare", href: "#tienda", I: Leaf, f: () => setFiltro("Skincare") },
              { t: "Tu tono", href: "#tono", I: Brush },
              { t: "Tips", href: "#tips", I: Check },
              { t: "Academia", href: "#academia", I: GraduationCap },
              { t: "Servicios", href: "#servicios", I: CalendarDays },
            ].map(({ t, href, I, f }) => (
              <a key={t} href={href} onClick={f} className="group shrink-0 flex flex-col items-center gap-2">
                <span className="grid place-items-center w-16 h-16 rounded-full border border-white/25 transition group-hover:border-[#b38b54]">
                  <I size={22} strokeWidth={1.5} />
                </span>
                <span className={`text-[0.62rem] ${MAYUS} text-white/75`}>{t}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* tienda */}
      <section id="tienda" className="scroll-mt-20 mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={`text-[0.7rem] ${MAYUS}`} style={{ color: DORADO }}>
              Nuestra línea
            </p>
            <h2 className="mt-2 text-[2.3rem] sm:text-[3.2rem] leading-none font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
              Tienda
            </h2>
          </div>
          <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]" role="group" aria-label="Filtrar">
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFiltro(c)}
                aria-pressed={filtro === c}
                className={`shrink-0 rounded-full px-4 py-2 text-[0.85rem] font-semibold transition ${filtro === c ? "text-white" : "border border-black/15 hover:border-black"}`}
                style={filtro === c ? { background: NEGRO } : undefined}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-9">
          {lista.map((p) => (
            <article key={p.id} className="group flex flex-col">
              <button type="button" onClick={() => setFicha({ p })} className="relative block overflow-hidden bg-white text-left" aria-label={`Ver ${p.nombre}`}>
                <img src={p.foto} alt={p.nombre} className="w-full aspect-[4/5] object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
                {p.etiqueta && <span className={`absolute left-0 top-3 px-2.5 py-1 text-[0.6rem] text-white ${MAYUS}`} style={{ background: NEGRO }}>{p.etiqueta}</span>}
              </button>
              <div className="mt-3 flex-1">
                <p className={`text-[0.6rem] text-black/45 ${MAYUS}`}>{SELLOS[p.categoria][0]}</p>
                <h3 className="mt-1 text-[1.02rem] font-semibold leading-tight !text-[#0e0d0c]">{p.nombre}</h3>
                <p className="mt-0.5 text-[0.86rem] text-black/55">{p.corto}</p>
                {p.tonos && (
                  <div className="mt-2 flex gap-1.5" aria-label={`${p.tonos.length} tonos`}>
                    {p.tonos.map((t) => (
                      <button key={t.nombre} type="button" title={t.nombre} aria-label={`${p.nombre}, tono ${t.nombre}`} onClick={() => setFicha({ p, tono: t.nombre })} className="w-4 h-4 rounded-full ring-1 ring-black/10 hover:scale-125 transition" style={{ background: t.hex }} />
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="font-semibold tabular-nums">{qz(p.precio)}</p>
                <button
                  type="button"
                  onClick={() => (p.tonos ? setFicha({ p }) : agregar(p))}
                  className="rounded-full px-3.5 py-2 text-[0.8rem] font-semibold active:scale-95 transition border border-black/15 hover:bg-black hover:text-white"
                >
                  {p.tonos ? "Elegir tono" : "Agregar"}
                </button>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-black/45">Productos y precios de ejemplo, en quetzales.</p>
      </section>

      <BuscadorTono
        alAgregar={(base, rub) => {
          agregar(porId("base"), base, 1, Math.round(porId("base").precio * 0.9));
          agregar(porId("rubor"), rub, 1, Math.round(porId("rubor").precio * 0.9));
          agregar(porId("polvo"), undefined, 1, Math.round(porId("polvo").precio * 0.9));
          setAviso("Tu kit ya está en la bolsa, con 10% de descuento");
          setBolsaAbierta(true);
        }}
      />

      <Tips alVerRubor={() => setFicha({ p: porId("rubor") })} />

      <Academia alReservar={(curso, fecha) => setMensaje({ que: "la reserva", texto: `Hola, Ámbar. Quiero reservar un cupo en el curso de ${curso} (${fecha}). ¿Cómo lo aparto?` })} />

      <ListaEspera
        alAvisar={(curso) =>
          setMensaje({
            que: "el aviso",
            texto: `Hola, te escribimos de Ámbar Makeup School. Ya abrimos fechas para ${curso}: inicia el sábado 9 de enero y hay 8 cupos. Como estabas en la lista de espera, tienes 48 horas para apartar el tuyo antes que nadie. ¿Te lo guardamos?`,
          })
        }
      />

      <Graduadas />

      {/* servicios en estudio */}
      <section id="servicios" className="scroll-mt-20 mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
          <img src={maquillista} alt="Maquillista aplicando sombra a una clienta" className="w-full aspect-[4/3] object-cover" loading="lazy" />
          <div>
            <p className={`text-[0.7rem] ${MAYUS}`} style={{ color: DORADO }}>
              En el estudio
            </p>
            <h2 className="mt-2 text-[2.2rem] sm:text-[3rem] leading-[1.02] font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
              Te maquillamos nosotras
            </h2>
            <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
              {SERVICIOS.map((s) => (
                <li key={s.nombre} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
                  <div className="flex-1 min-w-[180px]">
                    <p className="font-semibold text-[1.05rem]">{s.nombre}</p>
                    <p className="text-[0.88rem] text-black/55">{s.d}</p>
                  </div>
                  <p className="font-semibold tabular-nums">{qz(s.precio)}</p>
                  <button
                    type="button"
                    onClick={() => setMensaje({ que: "la cita", texto: `Hola, Ámbar. Quiero agendar ${s.nombre.toLowerCase()} (${qz(s.precio)}). ¿Qué fechas tienen disponibles?` })}
                    className="rounded-full px-4 py-2 text-[0.82rem] font-semibold text-white active:scale-95 transition"
                    style={{ background: NEGRO }}
                  >
                    Agendar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <DeInstagram />

      {/* opiniones */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-[2.3rem] sm:text-[3rem] leading-none font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
            Lo que dicen
          </h2>
          <span className={`border border-black/15 px-3 py-1 text-[0.62rem] ${MAYUS}`}>Opiniones de ejemplo</span>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { n: "Andrea R.", s: "Clienta", t: "Usé el buscador y la base me quedó exacta. Tengo piel sensible y no me sacó nada." },
            { n: "Fernanda L.", s: "Alumna de automaquillaje", t: "En una mañana aprendí lo que llevaba años haciendo mal. Y me regalaron un mini kit." },
            { n: "Sofía M.", s: "Novia 2026", t: "Me maquillaron para mi boda y aguantó toda la fiesta. Las fotos con flash salieron perfectas." },
          ].map((o) => (
            <figure key={o.n} className="bg-white p-6 border border-black/8">
              <p className="tracking-[0.2em]" style={{ color: DORADO }} aria-label="5 de 5">
                ★★★★★
              </p>
              <blockquote className="mt-3 text-[1.02rem] leading-relaxed">“{o.t}”</blockquote>
              <figcaption className="mt-4">
                <span className="block font-semibold">{o.n}</span>
                <span className="block text-sm text-black/50">{o.s}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* visítenos */}
      <section id="visitenos" className="scroll-mt-20" style={{ background: CREMA }}>
        <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className={`text-[0.7rem] ${MAYUS}`} style={{ color: DORADO }}>
              Tienda y academia
            </p>
            <h2 className="mt-2 text-[2.2rem] sm:text-[3rem] leading-[1.02] font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
              Prueba los tonos antes de comprar
            </h2>
            <ul className="mt-6 space-y-3">
              <li className="flex gap-3">
                <MapPin size={20} style={{ color: DORADO }} /> Zona 10, Ciudad de Guatemala (dirección de ejemplo)
              </li>
              <li className="flex gap-3">
                <Clock size={20} style={{ color: DORADO }} /> Lunes a sábado, 10:00 a 19:00
              </li>
              <li className="flex gap-3">
                <Sparkles size={20} style={{ color: DORADO }} /> Te ayudamos a escoger tu tono, sin compromiso
              </li>
            </ul>
          </div>
          <img src={espejo} alt="Tocador con espejo de luces y maquillaje" className="w-full aspect-[4/3] object-cover" loading="lazy" />
        </div>
      </section>

      {/* preguntas */}
      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <h2 className="text-[2.3rem] sm:text-[3rem] leading-none font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
          Preguntas frecuentes
        </h2>
        <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
          {[
            ["¿Sirve para piel sensible?", "Sí. Todo el maquillaje es hipoalergénico, no comedogénico y libre de parabenos."],
            ["¿Cuánto tarda el envío?", `En la capital, 24 horas. A los departamentos, 48 horas. Desde ${qz(GRATIS)} el envío es gratis, o puedes recogerlo en tienda.`],
            ["¿Necesito experiencia para el curso?", "Para automaquillaje no. Para la masterclass de novias sí conviene que ya maquilles."],
            ["¿Cómo aparto mi cupo?", "Con el 50% del curso por transferencia. El resto lo pagas el primer día."],
          ].map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[1.05rem]">
                {q}
                <span className="grid place-items-center w-7 h-7 shrink-0 rounded-full border border-black/15 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-black/65">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <CierreJzet demo="tienda de cosméticos" />

      {/* bolsa flotante en celular */}
      {piezas > 0 && (
        <button
          type="button"
          onClick={() => setBolsaAbierta(true)}
          className="md:hidden fixed bottom-5 inset-x-5 z-30 flex items-center justify-between rounded-full px-5 py-3.5 font-semibold text-white shadow-[0_14px_30px_-12px_rgba(0,0,0,.7)] active:scale-[0.98] transition"
          style={{ background: NEGRO }}
        >
          <span className="inline-flex items-center gap-2">
            <ShoppingBag size={18} /> Ver bolsa ({piezas})
          </span>
          <span className="tabular-nums">{qz(subtotal)}</span>
        </button>
      )}

      {/* aviso de agregado */}
      {aviso && (
        <div role="status" className="fixed top-20 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-2 bg-white px-4 py-2.5 text-[0.88rem] font-semibold shadow-[0_14px_30px_-12px_rgba(0,0,0,.5)] max-w-[92vw]">
          <Check size={16} style={{ color: DORADO }} /> {aviso}
        </div>
      )}

      {/* ficha */}
      <Modal abierto={!!ficha} alCerrar={() => setFicha(null)} titulo={ficha?.p.nombre ?? "Producto"} ancho="sm:w-[min(52rem,94vw)]">
        {ficha && (
          <Ficha
            key={ficha.p.id + (ficha.tono ?? "")}
            p={ficha.p}
            tonoInicial={ficha.tono}
            alAgregar={(tono, n) => {
              agregar(ficha.p, tono, n);
              setFicha(null);
            }}
          />
        )}
      </Modal>

      {/* bolsa */}
      <Cajon abierto={bolsaAbierta} alCerrar={() => setBolsaAbierta(false)} fondo={PAPEL}>
        <div className="flex h-full flex-col" style={{ color: NEGRO }}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
            <p className="text-[1.5rem] font-semibold" style={{ fontFamily: SERIF }}>
              Tu bolsa
            </p>
            <button type="button" onClick={() => setBolsaAbierta(false)} aria-label="Cerrar" className="grid place-items-center w-9 h-9 rounded-full hover:bg-black/5">
              <X size={20} />
            </button>
          </div>
          {bolsa.length === 0 ? (
            <div className="flex-1 grid place-items-center px-8 text-center">
              <div>
                <p className="font-semibold text-[1.1rem]">Tu bolsa está vacía</p>
                <p className="mt-1 text-black/55">Elige un producto o busca tu tono.</p>
                <button type="button" onClick={() => setBolsaAbierta(false)} className="mt-5 rounded-full px-5 py-2.5 text-white font-semibold" style={{ background: NEGRO }}>
                  Ver la tienda
                </button>
              </div>
            </div>
          ) : (
            <>
              <ul className="flex-1 overflow-y-auto divide-y divide-black/10 px-6">
                {bolsa.map((l, k) => (
                  <li key={l.p.id + (l.tono ?? "") + l.precio} className="py-4 flex gap-3">
                    <img src={l.p.foto} alt="" className="w-20 h-24 object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <p className="font-semibold leading-tight">{l.p.nombre}</p>
                        <button type="button" aria-label={`Quitar ${l.p.nombre}`} onClick={() => setBolsa((b) => b.filter((_, i) => i !== k))} className="text-black/40 hover:text-black">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-black/55">
                        {l.tono ? `Tono ${l.tono}` : l.p.categoria}
                        {l.precio < l.p.precio ? " · precio de kit" : ""}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Contador valor={l.cantidad} alCambiar={(v) => setBolsa((b) => (v <= 0 ? b.filter((_, i) => i !== k) : b.map((x, i) => (i === k ? { ...x, cantidad: v } : x))))} />
                        <p className="font-semibold tabular-nums">{qz(l.precio * l.cantidad)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-black/10 px-6 py-5 space-y-3">
                {envio.id !== "tienda" &&
                  (subtotal < GRATIS ? (
                    <div>
                      <p className="text-sm">
                        Te faltan <b>{qz(GRATIS - subtotal)}</b> para el envío gratis
                      </p>
                      <div className="mt-1.5 h-1.5 rounded-full bg-black/10">
                        <div className="h-full rounded-full transition-all" style={{ width: `${(subtotal / GRATIS) * 100}%`, background: DORADO }} />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-semibold" style={{ color: DORADO }}>
                      Tu envío es gratis
                    </p>
                  ))}
                <div className="grid grid-cols-3 gap-2" role="group" aria-label="Entrega">
                  {ENVIOS.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setEnvio(e)}
                      aria-pressed={envio.id === e.id}
                      className={`rounded-xl border px-2 py-2 text-[0.78rem] leading-tight transition ${envio.id === e.id ? "text-white border-transparent" : "border-black/15 hover:border-black"}`}
                      style={envio.id === e.id ? { background: NEGRO } : undefined}
                    >
                      {e.nombre}
                      <span className="block opacity-70">{e.precio === 0 || subtotal >= GRATIS ? "gratis" : qz(e.precio)}</span>
                    </button>
                  ))}
                </div>
                <p className="flex justify-between text-black/60">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{qz(subtotal)}</span>
                </p>
                <p className="flex justify-between text-[1.15rem] font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">{qz(subtotal + costoEnvio)}</span>
                </p>
                <button type="button" onClick={pedir} className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 font-semibold text-white active:scale-[0.98] transition" style={{ background: "#1f9d55" }}>
                  <MessageCircle size={18} /> Pedir por WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </Cajon>

      <MensajeWhatsApp mensaje={mensaje?.texto ?? null} que={mensaje?.que} alCerrar={() => setMensaje(null)} demo="tienda de cosméticos" />
    </div>
  );
}

function Ficha({ p, tonoInicial, alAgregar }: { p: Producto; tonoInicial?: string; alAgregar: (tono: string | undefined, n: number) => void }) {
  const [tono, setTono] = useState(p.tonos?.find((t) => t.nombre === tonoInicial) ?? p.tonos?.[0]);
  const [n, setN] = useState(1);
  return (
    <div className="grid sm:grid-cols-2" style={{ color: NEGRO }}>
      <div className="relative">
        <img src={p.foto} alt={p.nombre} className="w-full h-64 sm:h-full object-cover" />
        {tono && (
          <span className="absolute left-4 bottom-4 inline-flex items-center gap-2 bg-white px-3 py-1.5 text-sm font-semibold">
            <span className="w-4 h-4 rounded-full ring-1 ring-black/10" style={{ background: tono.hex }} /> {tono.nombre}
          </span>
        )}
      </div>
      <div className="p-6 sm:p-8">
        <p className={`text-[0.62rem] ${MAYUS}`} style={{ color: DORADO }}>
          {p.categoria}
        </p>
        <h3 className="mt-1 pr-8 text-[1.9rem] leading-tight font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
          {p.nombre}
        </h3>
        <p className="mt-2 text-[1.3rem] font-semibold tabular-nums">{qz(p.precio)}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SELLOS[p.categoria].map((s) => (
            <span key={s} className="border border-black/15 px-2 py-0.5 text-[0.72rem]">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-5 space-y-3 text-[0.95rem]">
          <p>
            <b>Para qué sirve.</b> <span className="text-black/70">{p.sirve}</span>
          </p>
          <p>
            <b>Cómo usarlo.</b> <span className="text-black/70">{p.uso}</span>
          </p>
        </div>
        {p.tonos && (
          <div className="mt-5">
            <p className="text-sm font-semibold">Tono: {tono?.nombre}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.tonos.map((t) => (
                <button
                  key={t.nombre}
                  type="button"
                  onClick={() => setTono(t)}
                  aria-label={t.nombre}
                  aria-pressed={tono?.nombre === t.nombre}
                  className="w-9 h-9 rounded-full transition active:scale-90"
                  style={{ background: t.hex, boxShadow: tono?.nombre === t.nombre ? `0 0 0 2px #fff, 0 0 0 4px ${NEGRO}` : "inset 0 0 0 1px rgba(0,0,0,.1)" }}
                />
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 flex items-center gap-3">
          <Contador valor={n} alCambiar={(v) => setN(Math.max(1, v))} />
          <button type="button" onClick={() => alAgregar(tono?.nombre, n)} className="flex-1 rounded-full py-3 font-semibold text-white active:scale-[0.98] transition" style={{ background: NEGRO }}>
            Agregar · {qz(p.precio * n)}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Buscador de tono de base: dos preguntas y le dice su tono de base y de rubor */
function BuscadorTono({ alAgregar }: { alAgregar: (base: string, rubor: string) => void }) {
  const [piel, setPiel] = useState<(typeof PIELES)[number] | null>(null);
  const [sub, setSub] = useState<(typeof SUBTONOS)[number]["id"] | null>(null);
  const r = useMemo(() => (piel && sub ? tonoPara(piel, sub) : null), [piel, sub]);
  const kit = [porId("base"), porId("rubor"), porId("polvo")];
  const total = kit.reduce((s, p) => s + p.precio, 0);
  const opcion = (activo: boolean) => `rounded-full px-4 py-2.5 text-[0.9rem] font-semibold transition active:scale-95 ${activo ? "text-white" : "border border-black/15 bg-white hover:border-black"}`;

  return (
    <section id="tono" className="scroll-mt-20" style={{ background: CREMA }}>
      <div className="mx-auto max-w-7xl grid lg:grid-cols-[0.85fr_1.2fr]">
        <img src={polvoNegro} alt="Brochas con polvo en el aire" className="w-full h-56 sm:h-72 lg:h-full object-cover" loading="lazy" />
        <div className="px-5 py-12 sm:p-12">
          <p className={`text-[0.7rem] ${MAYUS}`} style={{ color: DORADO }}>
            Encuentra tu tono
          </p>
          <h2 className="mt-2 text-[2rem] sm:text-[2.8rem] leading-[1.04] font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
            ¿No sabes qué tono de base pedir?
          </h2>
          <p className="mt-6 font-semibold">1. ¿Cómo es tu piel?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PIELES.map((x) => (
              <button key={x} type="button" onClick={() => setPiel(x)} aria-pressed={piel === x} className={opcion(piel === x)} style={piel === x ? { background: NEGRO } : undefined}>
                {x}
              </button>
            ))}
          </div>
          <p className="mt-5 font-semibold">2. ¿De qué color se ven las venas de tu muñeca?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SUBTONOS.map((x) => (
              <button key={x.id} type="button" onClick={() => setSub(x.id)} aria-pressed={sub === x.id} className={opcion(sub === x.id)} style={sub === x.id ? { background: NEGRO } : undefined}>
                {x.t}
              </button>
            ))}
          </div>

          {r ? (
            <div key={`${piel}-${sub}`} className="burbuja-entra mt-7 bg-white p-5">
              <p className="text-sm text-black/55">{SUBTONOS.find((x) => x.id === sub)!.d}. Tu kit:</p>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                {[
                  { t: "Base", v: r.base.nombre, hex: r.base.hex },
                  { t: "Rubor", v: r.rub.nombre, hex: r.rub.hex },
                  { t: "Polvo", v: "Traslúcido", hex: "#f4ece4" },
                ].map((x) => (
                  <div key={x.t}>
                    <span className="mx-auto block w-14 h-14 rounded-full ring-1 ring-black/10" style={{ background: x.hex }} />
                    <p className={`mt-2 text-[0.6rem] text-black/45 ${MAYUS}`}>{x.t}</p>
                    <p className="font-semibold leading-tight">{x.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-4">
                <p>
                  <span className="line-through text-black/40 mr-2">{qz(total)}</span>
                  <b className="text-[1.25rem]">{qz(kit.reduce((s, p) => s + Math.round(p.precio * 0.9), 0))}</b>
                  <span className="ml-2 text-sm font-semibold" style={{ color: DORADO }}>
                    10% por llevar el kit
                  </span>
                </p>
                <button type="button" onClick={() => alAgregar(r.base.nombre, r.rub.nombre)} className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-white active:scale-95 transition" style={{ background: NEGRO }}>
                  <ShoppingBag size={17} /> Llevar mi kit
                </button>
              </div>
              <p className="mt-3 text-[0.8rem] text-black/50">Si tienes duda, ven a la tienda y te lo probamos.</p>
            </div>
          ) : (
            <p className="mt-7 text-black/55">Elige una opción en cada pregunta.</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* Tips en carrusel, como los de sus publicaciones: enseñan y venden */
function Tips({ alVerRubor }: { alVerRubor: () => void }) {
  const fila = useRef<HTMLDivElement>(null);
  const mover = (dir: number) => fila.current?.scrollBy({ left: dir * (fila.current.clientWidth * 0.8), behavior: "smooth" });
  return (
    <section id="tips" className="scroll-mt-20 text-white py-14 sm:py-20" style={{ background: NEGRO }}>
      <div className="mx-auto max-w-7xl px-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={`text-[0.7rem] ${MAYUS}`} style={{ color: DORADO }}>
            Tips de la academia
          </p>
          <h2 className="mt-2 text-[2.2rem] sm:text-[3rem] leading-[1.02] font-semibold !text-white" style={{ fontFamily: SERIF }}>
            5 errores al aplicarte rubor
          </h2>
          <p className="mt-2 text-white/60">Que quizás cometes sin darte cuenta.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => mover(-1)} aria-label="Anterior" className="grid place-items-center w-11 h-11 rounded-full border border-white/25 hover:border-white active:scale-90">
            <ArrowLeft size={18} />
          </button>
          <button type="button" onClick={() => mover(1)} aria-label="Siguiente" className="grid place-items-center w-11 h-11 rounded-full border border-white/25 hover:border-white active:scale-90">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <div ref={fila} className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory px-5 sm:px-[max(1.25rem,calc((100vw-80rem)/2+1.25rem))] pb-2 [scrollbar-width:none]">
        {TIPS.map((t, i) => (
          <article key={t.t} className="relative snap-start shrink-0 w-[78vw] sm:w-[340px] aspect-[4/5] overflow-hidden">
            <img src={i % 2 ? delineado : academiaFoto} alt="" className="absolute inset-0 w-full h-full object-cover opacity-45" loading="lazy" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,13,12,.95),rgba(14,13,12,.3))]" />
            <div className="relative h-full flex flex-col p-6">
              <p className="text-[3.4rem] leading-none font-semibold" style={{ fontFamily: SERIF, color: DORADO }}>
                {i + 1}.
              </p>
              <p className={`mt-auto text-[1.05rem] font-semibold ${MAYUS} !tracking-[0.14em]`}>{t.t}</p>
              <p className="mt-3 rounded-2xl bg-white/90 px-4 py-3 text-[0.88rem] text-black">{t.d}</p>
            </div>
          </article>
        ))}
        <article className="snap-start shrink-0 w-[78vw] sm:w-[340px] aspect-[4/5] flex flex-col justify-center p-7" style={{ background: CREMA, color: NEGRO }}>
          <p className={`text-[0.7rem] ${MAYUS}`} style={{ color: DORADO }}>
            El que usamos en clase
          </p>
          <img src={rubor} alt="" className="mt-4 w-full aspect-[4/3] object-cover" loading="lazy" />
          <p className="mt-4 text-[1.4rem] font-semibold" style={{ fontFamily: SERIF }}>
            Rubor en polvo · {qz(135)}
          </p>
          <button type="button" onClick={alVerRubor} className="mt-4 rounded-full py-3 font-semibold text-white active:scale-95 transition" style={{ background: NEGRO }}>
            Ver tonos
          </button>
        </article>
      </div>
    </section>
  );
}

/* Academia: cursos con fechas y cupos; reservar manda el mensaje armado */
function Academia({ alReservar }: { alReservar: (curso: string, fecha: string) => void }) {
  const [fechas, setFechas] = useState<Record<string, string>>(() => Object.fromEntries(CURSOS.map((c) => [c.id, c.fechas[0]])));
  return (
    <section id="academia" className="scroll-mt-20 mx-auto max-w-7xl px-5 py-14 sm:py-20">
      <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-end">
        <div>
          <p className={`text-[0.7rem] ${MAYUS}`} style={{ color: DORADO }}>
            Makeup School
          </p>
          <h2 className="mt-2 text-[2.3rem] sm:text-[3.4rem] leading-[1] font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
            Aprende a maquillarte, o a vivir de esto
          </h2>
          <p className="mt-4 max-w-lg text-black/65">Grupos pequeños, práctica desde la primera clase y con los mismos productos de la tienda.</p>
        </div>
        <img src={estudio} alt="Maquillista trabajando en el estudio de la academia" className="hidden lg:block w-full h-64 object-cover" loading="lazy" />
      </div>
      <div className="mt-10 grid md:grid-cols-3 gap-4">
        {CURSOS.map((c) => (
          <article key={c.id} className={`flex flex-col p-6 ${c.destacado ? "text-white" : "bg-white border border-black/10"}`} style={c.destacado ? { background: NEGRO } : undefined}>
            <p className={`text-[0.62rem] ${MAYUS}`} style={{ color: DORADO }}>
              {c.nivel}
            </p>
            <h3 className={`mt-2 text-[1.6rem] leading-tight font-semibold ${c.destacado ? "!text-white" : "!text-[#0e0d0c]"}`} style={{ fontFamily: SERIF }}>
              {c.nombre}
            </h3>
            <p className={`mt-1 text-[0.9rem] ${c.destacado ? "text-white/65" : "text-black/55"}`}>{c.dura}</p>
            <p className="mt-4 text-[2rem] font-semibold leading-none tabular-nums">{qz(c.precio)}</p>
            <ul className="mt-5 space-y-2 flex-1 text-[0.92rem]">
              {c.incluye.map((x) => (
                <li key={x} className="flex gap-2">
                  <Check size={17} className="mt-0.5 shrink-0" style={{ color: DORADO }} /> {x}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {c.fechas.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFechas((x) => ({ ...x, [c.id]: f }))}
                  aria-pressed={fechas[c.id] === f}
                  className={`rounded-full px-3 py-1.5 text-[0.78rem] font-semibold transition ${fechas[c.id] === f ? (c.destacado ? "bg-white text-black" : "bg-black text-white") : c.destacado ? "border border-white/25" : "border border-black/15"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[0.82rem] font-semibold" style={{ color: c.cupos <= 2 ? "#c2410c" : DORADO }}>
              Quedan {c.cupos} cupos
            </p>
            <button
              type="button"
              onClick={() => alReservar(c.nombre, fechas[c.id])}
              className={`mt-4 rounded-full py-3 font-semibold active:scale-[0.98] transition ${c.destacado ? "text-black" : "text-white"}`}
              style={{ background: c.destacado ? DORADO : NEGRO }}
            >
              Reservar mi cupo
            </button>
          </article>
        ))}
      </div>
      <p className="mt-4 text-sm text-black/45">Cursos, fechas y cupos de ejemplo.</p>
    </section>
  );
}

/* Para la marca que hoy vende solo por Instagram */
function DeInstagram() {
  const fotos = [polvoNegro, labialRojo, rostro, rubor, academiaFoto, brochas];
  return (
    <section className="px-5 pb-14 sm:pb-20">
      <div className="mx-auto max-w-7xl grid md:grid-cols-[1fr_1.1fr] gap-10 items-center p-7 sm:p-12 text-white" style={{ background: NEGRO }}>
        <div className="mx-auto w-full max-w-[300px] bg-white p-4 text-black shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-14 h-14 rounded-full border border-black/15 text-[1.3rem] font-semibold" style={{ fontFamily: SERIF }}>
              Á
            </span>
            <div className="text-[0.8rem] leading-tight">
              <p className="font-bold">ambar.cosmetics</p>
              <p className="text-black/55">Makeup · Skincare · Academia</p>
              <p className="mt-1 inline-flex items-center gap-1 font-semibold" style={{ color: DORADO }}>
                <Link2 size={13} /> ambar.gt/tienda
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-0.5">
            {fotos.map((f, i) => (
              <img key={i} src={f} alt="" className="aspect-square w-full object-cover" loading="lazy" />
            ))}
          </div>
          <p className="mt-3 text-center text-[0.68rem] text-black/45">Perfil de ejemplo</p>
        </div>
        <div>
          <p className={`text-[0.7rem] ${MAYUS} text-white/55`}>¿Vendes por Instagram?</p>
          <h2 className="mt-2 text-[2rem] sm:text-[2.8rem] leading-[1.05] font-semibold !text-white" style={{ fontFamily: SERIF }}>
            Tus tips atraen. Tu página vende.
          </h2>
          <ul className="mt-6 space-y-3 text-white/80">
            {[
              "El link de tu bio lleva a la tienda, los cursos y los servicios.",
              "Cada producto con precio, tono y cómo usarlo: ya no contestas “¿precio?”.",
              "Las alumnas ven fechas y cupos, y reservan con un mensaje.",
              "El pedido o la reserva te llega armada a tu WhatsApp.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <Check size={19} className="mt-0.5 shrink-0" style={{ color: DORADO }} /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* Graduadas: la prueba de que la academia funciona */
const GRADUADAS = [
  { foto: graduada1, n: "Daniela M.", g: "Generación 2026", hoy: "Maquilla novias en Antigua" },
  { foto: graduada2, n: "Lucía P.", g: "Generación 2026", hoy: "Abrió su estudio en zona 14" },
  { foto: graduada3, n: "Ana Sofía R.", g: "Generación 2025", hoy: "Maquillista de televisión" },
  { foto: graduada4, n: "Karla G.", g: "Generación 2025", hoy: "Da clases de automaquillaje" },
  { foto: graduada5, n: "Mónica F.", g: "Generación 2025", hoy: "Maquilla quinceañeras y eventos" },
  { foto: graduada6, n: "Paola C.", g: "Generación 2024", hoy: "Vende la línea en Xela" },
];

function Graduadas() {
  return (
    <section id="graduadas" className="scroll-mt-20 py-14 sm:py-20" style={{ background: CREMA }}>
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end">
          <div>
            <p className={`text-[0.7rem] ${MAYUS}`} style={{ color: DORADO }}>
              Nuestras graduadas
            </p>
            <h2 className="mt-2 text-[2.3rem] sm:text-[3.2rem] leading-[1] font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
              Se gradúan con toga, <em style={{ color: DORADO }}>y trabajan.</em>
            </h2>
            <p className="mt-4 max-w-xl text-black/65">Porque esto es una carrera de verdad. Así están hoy algunas de nuestras alumnas.</p>
          </div>
          <dl className="grid grid-cols-3 gap-6 text-center lg:text-left">
            {[
              ["+300", "graduadas"],
              ["4", "generaciones al año"],
              ["9 de 10", "trabajan maquillando"],
            ].map(([n, t]) => (
              <div key={t}>
                <dt className="text-[2rem] sm:text-[2.4rem] font-semibold leading-none" style={{ fontFamily: SERIF }}>
                  {n}
                </dt>
                <dd className="mt-1 text-[0.82rem] text-black/55">{t}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {GRADUADAS.map((g) => (
            <figure key={g.n} className="group relative overflow-hidden aspect-[4/5]">
              <img src={g.foto} alt={`${g.n}, graduada`} className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,13,12,.85),transparent_55%)]" />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-white">
                <p className={`text-[0.58rem] ${MAYUS}`} style={{ color: DORADO }}>
                  {g.g}
                </p>
                <p className="mt-0.5 font-semibold sm:text-[1.1rem]">{g.n}</p>
                <p className="text-[0.78rem] sm:text-[0.85rem] text-white/75">{g.hoy}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 text-sm text-black/45">Nombres, fotos y cifras de ejemplo.</p>
      </div>
    </section>
  );
}

/* Lista de espera: nadie se pierde cuando no hay fecha que le quede */
const ANOTADAS_EJEMPLO = [
  { n: "Gabriela R.", c: "Maquillaje profesional", d: "hace 2 días" },
  { n: "Silvia M.", c: "Automaquillaje", d: "hace 3 días" },
  { n: "Andrea L.", c: "Maquillaje profesional", d: "hace 5 días" },
  { n: "Rocío P.", c: "Masterclass novias y eventos", d: "hace 1 semana" },
  { n: "Mariana T.", c: "Maquillaje profesional", d: "hace 1 semana" },
];

function ListaEspera({ alAvisar }: { alAvisar: (curso: string) => void }) {
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [curso, setCurso] = useState(CURSOS[1].nombre);
  const [error, setError] = useState("");
  const [lista, setLista] = useState<{ n: string; c: string; d: string; nueva?: boolean }[]>(ANOTADAS_EJEMPLO);
  const [lista0, setLista0] = useState<string | null>(null);
  const porCurso = CURSOS.map((c) => ({ c: c.nombre, n: lista.filter((x) => x.c === c.nombre).length }));
  const campo = "mt-1.5 w-full border border-black/20 bg-white px-3 py-3 focus:outline-none focus:border-black";

  return (
    <section id="lista" className="scroll-mt-20 mx-auto max-w-7xl px-5 pb-14 sm:pb-20">
      <div className="grid lg:grid-cols-2 border border-black/10">
        {/* lo que ve la alumna */}
        <div className="p-6 sm:p-10 bg-white">
          <p className={`inline-flex items-center gap-1.5 text-[0.7rem] ${MAYUS}`} style={{ color: DORADO }}>
            <Bell size={14} /> Lista de espera
          </p>
          <h3 className="mt-2 text-[1.8rem] sm:text-[2.2rem] leading-[1.05] font-semibold !text-[#0e0d0c]" style={{ fontFamily: SERIF }}>
            ¿Ninguna fecha te queda?
          </h3>
          <p className="mt-2 text-black/60">Anótate y te avisamos por WhatsApp antes que a nadie cuando abramos nuevas fechas.</p>
          {lista0 ? (
            <div className="burbuja-entra mt-6 p-5" style={{ background: CREMA }}>
              <p className="font-semibold text-[1.1rem]">Listo, {lista0}. Ya estás en la lista.</p>
              <p className="mt-1 text-black/60">Te escribimos en cuanto haya fechas de {curso.toLowerCase()}. Tendrás 48 horas para apartar tu cupo antes que nadie.</p>
              <button
                type="button"
                onClick={() => {
                  setLista0(null);
                  setNombre("");
                  setTel("");
                }}
                className="mt-4 text-sm font-semibold underline underline-offset-4"
              >
                Anotar a otra persona
              </button>
            </div>
          ) : (
            <form
              className="mt-6 space-y-4"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (!nombre.trim()) return setError("Escribe tu nombre.");
                if (tel.replace(/\D/g, "").length < 8) return setError("Escribe tu WhatsApp de 8 dígitos.");
                const primero = nombre.trim().split(" ")[0];
                setLista((l) => [{ n: nombre.trim(), c: curso, d: "ahora", nueva: true }, ...l.map((x) => ({ ...x, nueva: false }))]);
                setLista0(primero);
                setError("");
              }}
            >
              <label className="block">
                <span className="text-sm font-semibold">Tu nombre</span>
                <input value={nombre} onChange={(e) => { setNombre(e.target.value); setError(""); }} placeholder="Nombre y apellido" className={campo} />
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold">Tu WhatsApp</span>
                  <input value={tel} inputMode="tel" onChange={(e) => { setTel(e.target.value.replace(/[^\d -]/g, "")); setError(""); }} placeholder="5555 5555" className={campo} />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Curso</span>
                  <select value={curso} onChange={(e) => setCurso(e.target.value)} className={campo}>
                    {CURSOS.map((c) => (
                      <option key={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </label>
              </div>
              {error && <p className="text-sm text-[#b42318]">{error}</p>}
              <button type="submit" className="w-full rounded-full py-3.5 font-semibold text-white active:scale-[0.98] transition" style={{ background: NEGRO }}>
                Anotarme
              </button>
              <p className="text-xs text-black/45">Demo: no se guarda ni se envía nada.</p>
            </form>
          )}
        </div>

        {/* lo que ve la academia */}
        <div className="p-6 sm:p-10 text-white" style={{ background: NEGRO }}>
          <p className={`text-[0.7rem] ${MAYUS} text-white/55`}>Así lo ve la academia</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {porCurso.map((x) => (
              <div key={x.c} className="border border-white/15 p-3">
                <p className="text-[1.8rem] font-semibold leading-none" style={{ fontFamily: SERIF, color: DORADO }}>
                  {x.n}
                </p>
                <p className="mt-1 text-[0.72rem] leading-tight text-white/65">{x.c}</p>
              </div>
            ))}
          </div>
          <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
            {lista.slice(0, 6).map((x, i) => (
              <li key={x.n + i} className="flex items-center gap-3 py-2.5 text-[0.88rem]">
                <span className="grid place-items-center w-8 h-8 shrink-0 rounded-full text-[0.75rem] font-semibold" style={{ background: x.nueva ? DORADO : "rgba(255,255,255,.1)", color: x.nueva ? "#000" : "#fff" }}>
                  {x.n
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold truncate">{x.n}</span>
                  <span className="block text-white/55 truncate">{x.c}</span>
                </span>
                <span className="shrink-0 text-[0.75rem]" style={{ color: x.nueva ? DORADO : "rgba(255,255,255,.45)" }}>
                  {x.nueva ? "Nueva" : x.d}
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => alAvisar(CURSOS[1].nombre)}
            className="mt-5 w-full rounded-full py-3 font-semibold text-black active:scale-[0.98] transition"
            style={{ background: DORADO }}
          >
            Abrir fechas y avisarles a las {porCurso[1].n} de {CURSOS[1].nombre.toLowerCase()}
          </button>
          <p className="mt-3 text-[0.78rem] text-white/50">Con un toque les llega el aviso a todas. Nombres de ejemplo.</p>
        </div>
      </div>
    </section>
  );
}
