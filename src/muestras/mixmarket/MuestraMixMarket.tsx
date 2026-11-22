/*
 * Muestra para MixMarket GT: lo mínimo que necesita una tienda sencilla.
 * La tienda enseña los productos con foto, precio y si hay; el cliente toca "Pedir" y el pedido llega al WhatsApp de la tienda.
 * El panel tiene solo tres partes: Hoy (qué hacer ahora), Pedidos y Productos. Todo se maneja con botones.
 * Los productos son de ejemplo: se cambian por los de la tienda. Lo que se pide no se envía de verdad: se enseña cómo le llegaría.
 */
import { useEffect, useState } from "react";
import { Check, Minus, MessageCircle, Package, Plus, RotateCcw, Store, Truck, X } from "lucide-react";
import ip17pro from "@/assets/demo-celulares/ip17pro.jpg";
import s26 from "@/assets/demo-celulares/s26.jpg";
import pixel9 from "@/assets/demo-celulares/pixel9.jpg";
import airpods from "@/assets/demo-celulares/airpods.jpg";
import cargador from "@/assets/demo-celulares/cargador.jpg";
import fundas from "@/assets/demo-celulares/fundas-magsafe.jpg";
import { achicarFoto } from "../../demos/celulares/fotos";

const NARANJA = "#ea580c";
const TINTA = "#1c1917";
const FONDO = "#f6f5f3";
const BORDE = "#e4e1dc";
const MUTED = "#625c55";
const VERDE = "#15803d";
const ROJO = "#b42318";
const WHATSAPP = "5555 0000";
const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;

type Producto = { id: string; nombre: string; detalle: string; precio: number; stock: number; foto: string; visible: boolean };
type Estado = "nuevo" | "confirmado" | "entregado" | "rechazado";
type Pedido = { id: string; fecha: string; cliente: string; telefono: string; entrega: string; productoId: string; producto: string; cantidad: number; total: number; estado: Estado };

const PRODUCTOS_INICIO: Producto[] = [
  { id: "p1", nombre: "iPhone 17 Pro", detalle: "256 GB · nuevo, sellado, con factura y garantía de 1 año", precio: 12499, stock: 5, foto: ip17pro, visible: true },
  { id: "p2", nombre: "Galaxy S26", detalle: "256 GB · nuevo, con factura y garantía de 1 año", precio: 7299, stock: 8, foto: s26, visible: true },
  { id: "p3", nombre: "Pixel 9 Pro", detalle: "128 GB · seminuevo revisado, garantía de 6 meses", precio: 5799, stock: 2, foto: pixel9, visible: true },
  { id: "p4", nombre: "AirPods Pro", detalle: "2.ª generación · nuevos, con estuche de carga", precio: 1899, stock: 12, foto: airpods, visible: true },
  { id: "p5", nombre: "Cargador USB-C 20 W", detalle: "Carga rápida · sirve para iPhone y Android", precio: 99, stock: 40, foto: cargador, visible: true },
  { id: "p6", nombre: "Funda MagSafe", detalle: "Para iPhone 13 a 17 · varios colores", precio: 129, stock: 0, foto: fundas, visible: true },
];
const hace = (min: number) => new Date(Date.now() - min * 60000).toISOString();
const PEDIDOS_INICIO: Pedido[] = [
  { id: "MM-103", fecha: hace(12), cliente: "Daniela Pérez", telefono: "5512 3344", entrega: "Domicilio · Zona 15, Ciudad de Guatemala", productoId: "p2", producto: "Galaxy S26", cantidad: 1, total: 7299, estado: "nuevo" },
  { id: "MM-102", fecha: hace(95), cliente: "Carlos Méndez", telefono: "4455 6677", entrega: "Recoge en tienda", productoId: "p4", producto: "AirPods Pro", cantidad: 1, total: 1899, estado: "confirmado" },
  { id: "MM-101", fecha: hace(26 * 60), cliente: "Sofía Hernández", telefono: "3010 2020", entrega: "Domicilio · Mixco, zona 4", productoId: "p5", producto: "Cargador USB-C 20 W", cantidad: 2, total: 198, estado: "entregado" },
];

/* todo se guarda en este navegador, para que lo que pide el cliente aparezca en el panel */
const CLAVE = "mixmarket-muestra-v1";
function useMix() {
  const [e, setE] = useState<{ productos: Producto[]; pedidos: Pedido[] }>(() => {
    try { const t = localStorage.getItem(CLAVE); if (t) return JSON.parse(t); } catch { /* nada */ }
    return { productos: PRODUCTOS_INICIO, pedidos: PEDIDOS_INICIO };
  });
  useEffect(() => { try { localStorage.setItem(CLAVE, JSON.stringify(e)); } catch { /* nada */ } }, [e]);
  return {
    ...e,
    setProductos: (f: (p: Producto[]) => Producto[]) => setE((v) => ({ ...v, productos: f(v.productos) })),
    setPedidos: (f: (p: Pedido[]) => Pedido[]) => setE((v) => ({ ...v, pedidos: f(v.pedidos) })),
    reiniciar: () => setE({ productos: PRODUCTOS_INICIO, pedidos: PEDIDOS_INICIO }),
  };
}
type Mix = ReturnType<typeof useMix>;

const hora = (iso: string) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  return m < 1 ? "ahora" : m < 60 ? `hace ${m} min` : m < 1440 ? `hace ${Math.round(m / 60)} h` : "ayer";
};
const mensajeDe = (p: Producto, cantidad: number, nombre: string, tel: string, entrega: string) =>
  `Hola, quiero hacer un pedido:\n• ${cantidad} × ${p.nombre} — ${qz(p.precio * cantidad)}\nNombre: ${nombre || "—"}\nTeléfono: ${tel || "—"}\nEntrega: ${entrega}`;
const hayTexto = (p: Producto) => (p.stock <= 0 ? { t: "Agotado", c: ROJO, f: "#fde4e1" } : p.stock <= 3 ? { t: "Quedan pocas", c: "#8a4b00", f: "#fff1d6" } : { t: "Hay", c: VERDE, f: "#dcfce7" });

export default function MuestraMixMarket() {
  const mix = useMix();
  const leer = () => (location.hash === "#panel" ? "panel" : "tienda");
  const [vista, setVista] = useState<"tienda" | "panel">(leer);
  useEffect(() => { const f = () => setVista(leer()); addEventListener("hashchange", f); return () => removeEventListener("hashchange", f); }, []);
  const ir = (v: "tienda" | "panel") => { history.replaceState(null, "", v === "panel" ? "#panel" : location.pathname); setVista(v); window.scrollTo(0, 0); };
  useEffect(() => { document.title = vista === "panel" ? "Panel · MixMarket GT" : "MixMarket GT · Muestra de Jzet Labs"; }, [vista]);

  return (
    <div className="min-h-screen" style={{ background: FONDO, color: TINTA, fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}>
      <style>{`.mm h1,.mm h2,.mm h3{color:inherit}.mm-btn{transition:transform .15s,filter .15s}.mm-btn:hover:not(:disabled){filter:brightness(.95);transform:translateY(-1px)}.mm-btn:active:not(:disabled){transform:scale(.97)}`}</style>
      <div className="mm">
        <div className="px-4 py-2 text-center text-[0.88rem] text-white/85" style={{ background: "#0c0a09" }}>
          Muestra hecha por <b className="text-white">Jzet Labs</b> para MixMarket GT. Los productos son de ejemplo y se cambian por los suyos.
          <span className="ml-2 inline-flex gap-1.5 align-middle">
            <button type="button" onClick={() => ir("tienda")} className="rounded-full px-3 py-1 text-[0.8rem] font-bold" style={vista === "tienda" ? { background: "#fff", color: TINTA } : { background: "rgba(255,255,255,.15)" }}>La tienda</button>
            <button type="button" onClick={() => ir("panel")} className="rounded-full px-3 py-1 text-[0.8rem] font-bold" style={vista === "panel" ? { background: "#fff", color: TINTA } : { background: "rgba(255,255,255,.15)" }}>Panel del dueño</button>
          </span>
        </div>
        {vista === "tienda" ? <Tienda mix={mix} /> : <Panel mix={mix} alTienda={() => ir("tienda")} />}
      </div>
    </div>
  );
}

/* ---------------- la tienda ---------------- */

function Tienda({ mix }: { mix: Mix }) {
  const [pedir, setPedir] = useState<Producto | null>(null);
  const visibles = mix.productos.filter((p) => p.visible);
  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-white" style={{ borderColor: BORDE }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <span className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-xl text-[1rem] font-black text-white" style={{ background: NARANJA }}>MM</span><span className="leading-tight"><b className="block text-[1.2rem] tracking-tight">MixMarket GT</b><span className="text-[0.78rem]" style={{ color: MUTED }}>Tecnología y accesorios</span></span></span>
          <a href="#catalogo" onClick={(e) => { e.preventDefault(); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }} className="mm-btn inline-flex min-h-[2.8rem] items-center gap-2 rounded-xl px-4 font-bold text-white" style={{ background: "#16a34a" }}><MessageCircle size={18} /> Pedir por WhatsApp</a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h1 className="max-w-2xl text-[clamp(2.1rem,1.6rem+2.4vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">Elija su equipo y pídalo por WhatsApp</h1>
        <p className="mt-3 max-w-xl text-[1.1rem]" style={{ color: MUTED }}>Vea el precio y si hay, toque <b>Pedir</b> y el pedido le llega directo a la tienda. Pague al recibir o por transferencia.</p>
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.98rem] font-semibold">
          {[[Truck, "Envíos a todo el país"], [Check, "Equipos con factura y garantía"], [MessageCircle, "Respuesta rápida por WhatsApp"]].map(([I, t]) => { const Icono = I as typeof Truck; return <li key={t as string} className="flex items-center gap-2"><Icono size={18} style={{ color: NARANJA }} /> {t as string}</li>; })}
        </ul>
      </section>

      <section id="catalogo" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-14">
        <h2 className="mb-4 text-[1.5rem] font-extrabold">Productos</h2>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 17rem), 1fr))" }}>
          {visibles.map((p) => { const h = hayTexto(p); return (
            <article key={p.id} className="flex flex-col overflow-hidden rounded-2xl border bg-white" style={{ borderColor: BORDE }}>
              <button type="button" onClick={() => p.stock > 0 && setPedir(p)} className="relative block aspect-[4/3] w-full overflow-hidden" aria-label={`Ver ${p.nombre}`} style={{ background: FONDO }}>
                <img src={p.foto} alt={p.nombre} loading="lazy" className="h-full w-full object-cover" style={{ opacity: p.stock <= 0 ? 0.45 : 1 }} />
                <span className="absolute left-3 top-3 rounded-md px-2.5 py-1 text-[0.8rem] font-bold" style={{ background: h.f, color: h.c }}>{h.t}</span>
              </button>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-[1.15rem] font-extrabold leading-tight">{p.nombre}</h3>
                <p className="mt-1 text-[0.92rem]" style={{ color: MUTED }}>{p.detalle}</p>
                <p className="mt-3 text-[1.7rem] font-extrabold leading-none">{qz(p.precio)}</p>
                <button type="button" disabled={p.stock <= 0} onClick={() => setPedir(p)} className="mm-btn mt-4 inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-xl font-bold text-white disabled:opacity-40" style={{ background: p.stock <= 0 ? "#78716c" : "#16a34a" }}><MessageCircle size={18} /> {p.stock <= 0 ? "Agotado" : "Pedir por WhatsApp"}</button>
              </div>
            </article>
          ); })}
        </div>
      </section>

      <section className="border-t bg-white" style={{ borderColor: BORDE }}>
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
          {[["Cómo pedir", "Toque Pedir, escriba su nombre y cómo quiere recibirlo. Le abre WhatsApp con el pedido ya escrito."], ["Cómo pagar", "Al recibir su pedido o por transferencia. Se puede revisar el equipo antes de pagar."], ["Dónde estamos", "Ciudad de Guatemala. Entregas a domicilio en todo el país. Lun a sáb, 9:00 a 19:00."]].map(([a, b]) => <div key={a}><h3 className="text-[1.15rem] font-extrabold">{a}</h3><p className="mt-1" style={{ color: MUTED }}>{b}</p></div>)}
        </div>
        <p className="px-4 pb-8 text-center text-[0.85rem]" style={{ color: MUTED }}>WhatsApp {WHATSAPP} (ejemplo) · Página hecha por Jzet Labs</p>
      </section>

      {pedir && <Pedir p={pedir} mix={mix} alCerrar={() => setPedir(null)} />}
    </>
  );
}

function Pedir({ p, mix, alCerrar }: { p: Producto; mix: Mix; alCerrar: () => void }) {
  const [cantidad, setCantidad] = useState(1);
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [modo, setModo] = useState<"domicilio" | "tienda">("domicilio");
  const [direccion, setDireccion] = useState("");
  const [enviado, setEnviado] = useState<string | null>(null);
  useEffect(() => { const f = (e: KeyboardEvent) => e.key === "Escape" && alCerrar(); addEventListener("keydown", f); const o = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { removeEventListener("keydown", f); document.body.style.overflow = o; }; }, [alCerrar]);
  const entrega = modo === "tienda" ? "Recoge en tienda" : `Domicilio · ${direccion.trim() || "—"}`;
  const ok = nombre.trim().length > 2 && tel.replace(/\D/g, "").length >= 8 && (modo === "tienda" || direccion.trim().length > 4);
  const campo = "mt-1 min-h-[3rem] w-full rounded-xl border bg-white px-3.5 text-[1rem] outline-none focus:border-[#ea580c]";
  const enviar = () => {
    const n = Math.max(100, ...mix.pedidos.map((x) => Number(x.id.split("-")[1]) || 0)) + 1;
    const id = `MM-${n}`;
    mix.setPedidos((l) => [{ id, fecha: new Date().toISOString(), cliente: nombre.trim(), telefono: tel.trim(), entrega, productoId: p.id, producto: p.nombre, cantidad, total: p.precio * cantidad, estado: "nuevo" }, ...l]);
    setEnviado(id);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={alCerrar}>
      <div role="dialog" aria-modal="true" aria-label={`Pedir ${p.nombre}`} onClick={(e) => e.stopPropagation()} className="relative max-h-[94svh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7">
        <button type="button" aria-label="Cerrar" onClick={alCerrar} className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full" style={{ background: FONDO }}><X size={20} /></button>
        {enviado ? (
          <div className="py-4 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full text-white" style={{ background: VERDE }}><Check size={34} strokeWidth={3} /></span>
            <h2 className="mt-4 text-[1.6rem] font-extrabold">Pedido enviado</h2>
            <p className="mt-1 text-[1.05rem]" style={{ color: MUTED }}>Código <b className="text-[#1c1917]">{enviado}</b>. La tienda le confirma por WhatsApp.</p>
            <div className="mt-4 rounded-2xl p-4 text-left text-[0.95rem]" style={{ background: "#dcfce7" }}><p className="mb-1 text-[0.8rem] font-bold uppercase tracking-wide" style={{ color: VERDE }}>Así le llega a la tienda</p><p className="whitespace-pre-line">{mensajeDe(p, cantidad, nombre, tel, entrega)}</p></div>
            <p className="mt-3 text-[0.85rem]" style={{ color: MUTED }}>En la tienda real se abre el WhatsApp de la tienda con este mensaje. Aquí se muestra cómo llegaría y el pedido aparece en el panel.</p>
            <button type="button" onClick={alCerrar} className="mm-btn mt-4 min-h-[3rem] w-full rounded-xl font-bold text-white" style={{ background: TINTA }}>Seguir viendo productos</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 pr-12"><img src={p.foto} alt="" className="h-20 w-20 rounded-xl object-cover" /><div><h2 className="text-[1.35rem] font-extrabold leading-tight">{p.nombre}</h2><p className="text-[1.3rem] font-extrabold" style={{ color: NARANJA }}>{qz(p.precio * cantidad)}</p></div></div>
            <div className="mt-4 flex items-center justify-between rounded-xl border p-2" style={{ borderColor: BORDE }}>
              <span className="pl-2 font-semibold">Cantidad</span>
              <span className="flex items-center gap-2"><button type="button" aria-label="Menos" onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="grid h-11 w-11 place-items-center rounded-lg" style={{ background: FONDO }}><Minus size={18} /></button><b className="w-8 text-center text-[1.2rem]">{cantidad}</b><button type="button" aria-label="Más" onClick={() => setCantidad(Math.min(p.stock, cantidad + 1))} className="grid h-11 w-11 place-items-center rounded-lg" style={{ background: FONDO }}><Plus size={18} /></button></span>
            </div>
            <label className="mt-3 block text-[0.92rem] font-semibold">Su nombre<input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre y apellido" className={campo} style={{ borderColor: BORDE }} /></label>
            <label className="mt-3 block text-[0.92rem] font-semibold">Su teléfono<input inputMode="tel" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="5555 5555" className={campo} style={{ borderColor: BORDE }} /></label>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {([["domicilio", "A domicilio"], ["tienda", "Recojo en tienda"]] as const).map(([id, t]) => <button key={id} type="button" aria-pressed={modo === id} onClick={() => setModo(id)} className="min-h-[3rem] rounded-xl border-2 font-bold" style={modo === id ? { borderColor: NARANJA, background: "#fff7ed" } : { borderColor: BORDE }}>{t}</button>)}
            </div>
            {modo === "domicilio" && <label className="mt-3 block text-[0.92rem] font-semibold">Dirección<input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Zona, colonia y calle" className={campo} style={{ borderColor: BORDE }} /></label>}
            <button type="button" disabled={!ok} onClick={enviar} className="mm-btn mt-5 inline-flex min-h-[3.4rem] w-full items-center justify-center gap-2 rounded-xl text-[1.1rem] font-bold text-white disabled:opacity-40" style={{ background: "#16a34a" }}><MessageCircle size={20} /> Enviar pedido por WhatsApp</button>
            <p className="mt-2 text-center text-[0.85rem]" style={{ color: MUTED }}>Se paga al recibir o por transferencia. No se cobra nada aquí.</p>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- el panel: Hoy, Pedidos y Productos ---------------- */

type Pestana = "hoy" | "pedidos" | "productos";
const ESTADO_TXT: Record<Estado, { t: string; c: string; f: string }> = {
  nuevo: { t: "Nuevo", c: "#1d4ed8", f: "#dbeafe" },
  confirmado: { t: "Por entregar", c: "#8a4b00", f: "#fff1d6" },
  entregado: { t: "Entregado", c: VERDE, f: "#dcfce7" },
  rechazado: { t: "Rechazado", c: ROJO, f: "#fde4e1" },
};
const Etiqueta = ({ e }: { e: Estado }) => <span className="inline-block whitespace-nowrap rounded-md px-2.5 py-1 text-[0.82rem] font-bold" style={{ background: ESTADO_TXT[e].f, color: ESTADO_TXT[e].c }}>{ESTADO_TXT[e].t}</span>;
const BTN = "mm-btn inline-flex min-h-[2.9rem] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-4 text-[0.98rem] font-bold";

function Panel({ mix, alTienda }: { mix: Mix; alTienda: () => void }) {
  const [tab, setTab] = useState<Pestana>("hoy");
  const nuevos = mix.pedidos.filter((p) => p.estado === "nuevo");
  const porEntregar = mix.pedidos.filter((p) => p.estado === "confirmado");

  const decidir = (p: Pedido, ok: boolean) => {
    mix.setPedidos((l) => l.map((x) => (x.id === p.id ? { ...x, estado: ok ? "confirmado" : "rechazado" } : x)));
    if (ok) mix.setProductos((l) => l.map((x) => (x.id === p.productoId ? { ...x, stock: Math.max(0, x.stock - p.cantidad) } : x)));
  };
  const entregar = (p: Pedido) => mix.setPedidos((l) => l.map((x) => (x.id === p.id ? { ...x, estado: "entregado" } : x)));

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-xl font-black text-white" style={{ background: NARANJA }}>MM</span><div className="leading-tight"><b className="block text-[1.2rem]">Panel · MixMarket GT</b><span className="text-[0.85rem]" style={{ color: MUTED }}>Todo se maneja con botones</span></div></div>
        <div className="flex gap-2"><button type="button" onClick={alTienda} className={BTN} style={{ background: "#fff", border: `1px solid ${BORDE}` }}><Store size={17} /> Ver la tienda</button><button type="button" onClick={mix.reiniciar} className={BTN} style={{ background: "#fff", border: `1px solid ${BORDE}` }}><RotateCcw size={16} /> Reiniciar</button></div>
      </div>
      <nav className="mt-4 grid grid-cols-3 gap-2" aria-label="Panel">
        {([["hoy", "Hoy", nuevos.length + porEntregar.length], ["pedidos", "Pedidos", 0], ["productos", "Productos", mix.productos.filter((p) => p.stock <= 3).length]] as const).map(([id, t, n]) => (
          <button key={id} type="button" aria-current={tab === id ? "page" : undefined} onClick={() => setTab(id)} className="mm-btn relative min-h-[3.4rem] rounded-xl text-[1.1rem] font-extrabold" style={tab === id ? { background: TINTA, color: "#fff" } : { background: "#fff", border: `1px solid ${BORDE}` }}>
            {t}{n > 0 && <span className="ml-2 rounded-full px-2 py-0.5 text-[0.8rem]" style={{ background: tab === id ? NARANJA : "#fee2c8", color: tab === id ? "#fff" : "#9a3412" }}>{n}</span>}
          </button>
        ))}
      </nav>

      <div className="mt-5">
        {tab === "hoy" && <Hoy mix={mix} nuevos={nuevos} porEntregar={porEntregar} decidir={decidir} entregar={entregar} />}
        {tab === "pedidos" && <Pedidos mix={mix} decidir={decidir} entregar={entregar} />}
        {tab === "productos" && <Productos mix={mix} />}
      </div>
    </div>
  );
}

function Fila({ p, children }: { p: Pedido; children: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-2xl border bg-white p-4" style={{ borderColor: BORDE }}>
      <div className="min-w-[12rem] flex-1 leading-tight">
        <p className="text-[1.1rem] font-extrabold">{p.cliente} <span className="font-normal" style={{ color: MUTED }}>· {p.telefono}</span></p>
        <p className="text-[1rem]">{p.cantidad} × {p.producto} · <b>{qz(p.total)}</b></p>
        <p className="text-[0.88rem]" style={{ color: MUTED }}>{p.entrega} · {p.id} · {hora(p.fecha)}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </li>
  );
}

function Hoy({ mix, nuevos, porEntregar, decidir, entregar }: { mix: Mix; nuevos: Pedido[]; porEntregar: Pedido[]; decidir: (p: Pedido, ok: boolean) => void; entregar: (p: Pedido) => void }) {
  const vendido = mix.pedidos.filter((p) => p.estado === "confirmado" || p.estado === "entregado").reduce((s, p) => s + p.total, 0);
  const pocos = mix.productos.filter((p) => p.stock <= 3);
  const ultimo = nuevos[0];
  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-3 gap-3 text-center">
        {[[nuevos.length, "Pedidos nuevos"], [porEntregar.length, "Por entregar"], [qz(vendido), "Vendido"]].map(([n, t]) => <div key={t as string} className="rounded-2xl border bg-white px-2 py-4" style={{ borderColor: BORDE }}><p className="text-[clamp(1.5rem,1.2rem+1.5vw,2.3rem)] font-extrabold leading-none">{n as string}</p><p className="mt-1 text-[0.92rem]" style={{ color: MUTED }}>{t as string}</p></div>)}
      </div>

      <section>
        <h2 className="mb-2 text-[1.25rem] font-extrabold">Pedidos nuevos</h2>
        <ul className="grid gap-3">
          {nuevos.map((p) => <Fila key={p.id} p={p}><button type="button" onClick={() => decidir(p, true)} className={BTN} style={{ background: VERDE, color: "#fff" }}><Check size={18} /> Confirmar</button><button type="button" onClick={() => decidir(p, false)} className={BTN} style={{ background: "#fde4e1", color: ROJO }}>Rechazar</button></Fila>)}
          {!nuevos.length && <li className="rounded-2xl border border-dashed p-6 text-center" style={{ borderColor: BORDE, color: MUTED }}>No hay pedidos nuevos. Cuando entre uno, aparece aquí y le llega un aviso por WhatsApp.</li>}
        </ul>
      </section>

      {porEntregar.length > 0 && (
        <section>
          <h2 className="mb-2 text-[1.25rem] font-extrabold">Por entregar</h2>
          <ul className="grid gap-3">{porEntregar.map((p) => <Fila key={p.id} p={p}><button type="button" onClick={() => entregar(p)} className={BTN} style={{ background: TINTA, color: "#fff" }}><Truck size={18} /> Marcar entregado</button></Fila>)}</ul>
        </section>
      )}

      {pocos.length > 0 && (
        <section>
          <h2 className="mb-2 text-[1.25rem] font-extrabold">Poco stock</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {pocos.map((p) => <li key={p.id} className="flex items-center gap-3 rounded-2xl border bg-white p-3" style={{ borderColor: BORDE }}><img src={p.foto} alt="" className="h-12 w-12 rounded-lg object-cover" /><span className="min-w-0 flex-1 leading-tight"><b className="block truncate">{p.nombre}</b><span className="text-[0.9rem]" style={{ color: p.stock === 0 ? ROJO : "#8a4b00" }}>{p.stock === 0 ? "Agotado" : `Quedan ${p.stock}`}</span></span><button type="button" onClick={() => mix.setProductos((l) => l.map((x) => (x.id === p.id ? { ...x, stock: x.stock + 5 } : x)))} className={BTN} style={{ background: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa" }}>+5</button></li>)}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border bg-white p-4" style={{ borderColor: BORDE }}>
        <h2 className="flex items-center gap-2 text-[1.1rem] font-extrabold"><MessageCircle size={19} style={{ color: "#16a34a" }} /> Aviso por WhatsApp</h2>
        <p className="mt-1 text-[0.95rem]" style={{ color: MUTED }}>Cada pedido nuevo le llega al dueño por WhatsApp, y desde ahí también se confirma:</p>
        <div className="mt-3 max-w-sm rounded-2xl p-3 text-[0.95rem]" style={{ background: "#efeae2" }}>
          <div className="rounded-xl bg-white p-3 shadow-sm"><p className="whitespace-pre-line">{ultimo ? `🛒 Pedido nuevo ${ultimo.id}\n${ultimo.cliente} · ${ultimo.cantidad} × ${ultimo.producto}\nTotal ${qz(ultimo.total)}\n${ultimo.entrega}` : "🛒 Pedido nuevo\nCuando entre uno, llega aquí."}</p></div>
          <div className="mt-1 grid grid-cols-2 gap-1"><span className="rounded-lg bg-white py-2 text-center font-semibold shadow-sm" style={{ color: "#027eb5" }}>Confirmar</span><span className="rounded-lg bg-white py-2 text-center font-semibold shadow-sm" style={{ color: "#027eb5" }}>Rechazar</span></div>
        </div>
      </section>
    </div>
  );
}

function Pedidos({ mix, decidir, entregar }: { mix: Mix; decidir: (p: Pedido, ok: boolean) => void; entregar: (p: Pedido) => void }) {
  const [f, setF] = useState<"pendientes" | "todos">("pendientes");
  const lista = mix.pedidos.filter((p) => f === "todos" || p.estado === "nuevo" || p.estado === "confirmado");
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-2 sm:w-80">
        {([["pendientes", "Por atender"], ["todos", "Todos"]] as const).map(([id, t]) => <button key={id} type="button" aria-pressed={f === id} onClick={() => setF(id)} className="mm-btn min-h-[3rem] rounded-xl font-bold" style={f === id ? { background: TINTA, color: "#fff" } : { background: "#fff", border: `1px solid ${BORDE}` }}>{t}</button>)}
      </div>
      <ul className="grid gap-3">
        {lista.map((p) => (
          <Fila key={p.id} p={p}>
            <Etiqueta e={p.estado} />
            {p.estado === "nuevo" && <><button type="button" onClick={() => decidir(p, true)} className={BTN} style={{ background: VERDE, color: "#fff" }}>Confirmar</button><button type="button" onClick={() => decidir(p, false)} className={BTN} style={{ background: "#fde4e1", color: ROJO }}>Rechazar</button></>}
            {p.estado === "confirmado" && <button type="button" onClick={() => entregar(p)} className={BTN} style={{ background: TINTA, color: "#fff" }}>Marcar entregado</button>}
          </Fila>
        ))}
        {!lista.length && <li className="rounded-2xl border border-dashed p-8 text-center" style={{ borderColor: BORDE, color: MUTED }}>No hay pedidos aquí.</li>}
      </ul>
    </div>
  );
}

function Productos({ mix }: { mix: Mix }) {
  const [nuevo, setNuevo] = useState(false);
  const editar = (id: string, c: Partial<Producto>) => mix.setProductos((l) => l.map((x) => (x.id === id ? { ...x, ...c } : x)));
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2"><p style={{ color: MUTED }}>Cambie el precio, el stock o escóndalo de la tienda con un toque.</p><button type="button" onClick={() => setNuevo(true)} className={BTN} style={{ background: NARANJA, color: "#fff" }}><Plus size={18} /> Agregar producto</button></div>
      {nuevo && <Nuevo alCerrar={() => setNuevo(false)} alGuardar={(p) => { mix.setProductos((l) => [p, ...l]); setNuevo(false); }} />}
      <ul className="grid gap-3">
        {mix.productos.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-2xl border bg-white p-3" style={{ borderColor: BORDE, opacity: p.visible ? 1 : 0.6 }}>
            <label className="group relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl" title="Cambiar foto"><img src={p.foto} alt="" className="h-full w-full object-cover" /><span className="absolute inset-0 grid place-items-center bg-black/45 text-[0.7rem] font-bold text-white opacity-0 transition group-hover:opacity-100">Cambiar</span><input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; if (f) editar(p.id, { foto: await achicarFoto(f) }); }} /></label>
            <div className="min-w-[10rem] flex-1 leading-tight"><b className="block text-[1.1rem]">{p.nombre}</b><span className="text-[0.88rem]" style={{ color: hayTexto(p).c }}>{hayTexto(p).t}</span></div>
            <label className="flex items-center gap-1 text-[0.95rem] font-semibold">Q<input type="number" aria-label={`Precio de ${p.nombre}`} value={p.precio} onChange={(e) => editar(p.id, { precio: Math.max(0, Number(e.target.value) || 0) })} className="min-h-[2.9rem] w-28 rounded-xl border px-3 text-[1.05rem] font-bold" style={{ borderColor: BORDE }} /></label>
            <span className="flex items-center gap-1.5"><button type="button" aria-label="Quitar uno" onClick={() => editar(p.id, { stock: Math.max(0, p.stock - 1) })} className="grid h-11 w-11 place-items-center rounded-xl border" style={{ borderColor: BORDE }}><Minus size={18} /></button><b className="w-10 text-center text-[1.2rem] tabular-nums" style={{ color: p.stock === 0 ? ROJO : undefined }}>{p.stock}</b><button type="button" aria-label="Agregar uno" onClick={() => editar(p.id, { stock: p.stock + 1 })} className="grid h-11 w-11 place-items-center rounded-xl border" style={{ borderColor: BORDE }}><Plus size={18} /></button></span>
            <button type="button" role="switch" aria-checked={p.visible} onClick={() => editar(p.id, { visible: !p.visible })} className="flex min-h-[2.9rem] items-center gap-2 rounded-xl border px-3 font-semibold" style={{ borderColor: BORDE }}><span className="relative h-6 w-11 rounded-full transition" style={{ background: p.visible ? VERDE : "#c4c0ba" }}><span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" style={{ left: p.visible ? "1.4rem" : "0.15rem" }} /></span>{p.visible ? "Visible" : "Oculto"}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Nuevo({ alCerrar, alGuardar }: { alCerrar: () => void; alGuardar: (p: Producto) => void }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("1");
  const [foto, setFoto] = useState("");
  const [error, setError] = useState("");
  const campo = "mt-1 min-h-[3rem] w-full rounded-xl border bg-white px-3 outline-none focus:border-[#ea580c]";
  return (
    <form className="grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-[9rem_1fr]" style={{ borderColor: BORDE }} onSubmit={(e) => {
      e.preventDefault();
      if (nombre.trim().length < 3 || !Number(precio)) return setError("Escriba el nombre y el precio.");
      if (!foto) return setError("Suba una foto del producto.");
      alGuardar({ id: `p${Date.now()}`, nombre: nombre.trim(), detalle: "Producto nuevo", precio: Number(precio), stock: Math.max(0, Number(stock) || 0), foto, visible: true });
    }}>
      <label className="grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed text-center text-[0.85rem]" style={{ borderColor: BORDE, color: MUTED }}>
        {foto ? <img src={foto} alt="" className="h-full w-full object-cover" /> : <span className="px-2"><Package size={24} className="mx-auto mb-1" />Subir foto</span>}
        <input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setFoto(await achicarFoto(f)); }} />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-[0.92rem] font-semibold sm:col-span-3">Nombre<input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: iPhone 16 128 GB" className={campo} style={{ borderColor: BORDE }} /></label>
        <label className="text-[0.92rem] font-semibold">Precio (Q)<input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} className={campo} style={{ borderColor: BORDE }} /></label>
        <label className="text-[0.92rem] font-semibold">Cuántos hay<input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className={campo} style={{ borderColor: BORDE }} /></label>
        {error && <p className="font-semibold sm:col-span-3" style={{ color: ROJO }}>{error}</p>}
        <div className="flex gap-2 sm:col-span-3"><button type="submit" className={BTN} style={{ background: NARANJA, color: "#fff" }}>Publicar en la tienda</button><button type="button" onClick={alCerrar} className={BTN} style={{ background: FONDO }}>Cancelar</button></div>
      </div>
    </form>
  );
}
