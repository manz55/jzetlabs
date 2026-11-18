/*
 * Muestra hecha para Tu Store (tienda real de Xela) con los equipos y precios
 * que publicaron en su Instagram en su Black Week. Las fotos son de referencia.
 * Los pedidos no se envían: se enseña cómo le llegaría el mensaje a su WhatsApp.
 */
import { useState } from "react";
import { MapPin, Search, ShieldCheck, Truck, Wallet, X } from "lucide-react";
import ip16 from "@/assets/demo-celulares/ip17.jpg";
import ip15pro from "@/assets/demo-celulares/ip15pro.jpg";
import ip12 from "@/assets/demo-celulares/ip13.jpg";
import s24u from "@/assets/demo-celulares/s24ultra.jpg";
import s23 from "@/assets/demo-celulares/s26.jpg";
import pixel from "@/assets/demo-celulares/pixel9.jpg";

const ROJO = "#e3262e";
const NEGRO = "#111111";
const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;

type Opcion = { cap: string; efectivo: number | null; cuotas?: number };
type Equipo = { id: string; nombre: string; marca: "Apple" | "Samsung" | "Google" | "Motorola"; estado: string; color: string; foto?: string; opciones: Opcion[] };

const EQUIPOS: Equipo[] = [
  { id: "ip16", nombre: "iPhone 16", marca: "Apple", estado: "Seminuevo", color: "Negro", foto: ip16, opciones: [{ cap: "256 GB", efectivo: 5650, cuotas: 6900 }] },
  { id: "ip15p", nombre: "iPhone 15 Pro", marca: "Apple", estado: "Seminuevo · eSIM", color: "Gris", foto: ip15pro, opciones: [{ cap: "256 GB", efectivo: 5799 }] },
  { id: "ip12", nombre: "iPhone 12", marca: "Apple", estado: "Disponible", color: "Varios", foto: ip12, opciones: [{ cap: "64 GB", efectivo: null }] },
  { id: "s24u", nombre: "Galaxy S24 Ultra", marca: "Samsung", estado: "Seminuevo", color: "Gris", foto: s24u, opciones: [{ cap: "256 GB", efectivo: 5700 }, { cap: "512 GB", efectivo: 6100 }] },
  { id: "s23", nombre: "Galaxy S23", marca: "Samsung", estado: "Seminuevo", color: "Negro", foto: s23, opciones: [{ cap: "Única", efectivo: 2800, cuotas: 3600 }] },
  { id: "s22", nombre: "Galaxy S22", marca: "Samsung", estado: "Seminuevo", color: "Rosado", foto: s23, opciones: [{ cap: "128 GB", efectivo: 1999, cuotas: 2250 }, { cap: "256 GB", efectivo: 2250, cuotas: 2450 }] },
  { id: "px10", nombre: "Pixel 10 Pro", marca: "Google", estado: "eSIM", color: "Celeste", foto: pixel, opciones: [{ cap: "Única", efectivo: 5999, cuotas: 7300 }] },
  { id: "g06", nombre: "Moto G06", marca: "Motorola", estado: "Nuevo", color: "Varios", opciones: [{ cap: "Única", efectivo: 1300 }] },
];

export default function MuestraTuStore() {
  const [marca, setMarca] = useState<string>("Todas");
  const [buscar, setBuscar] = useState("");
  const [ficha, setFicha] = useState<Equipo | null>(null);
  const [op, setOp] = useState(0);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const lista = EQUIPOS.filter((e) => (marca === "Todas" || e.marca === marca) && e.nombre.toLowerCase().includes(buscar.toLowerCase()));

  const pedir = (e: Equipo, o: Opcion) =>
    setMensaje(
      `Hola Tu Store, quiero este equipo:\n\n${e.nombre} ${o.cap !== "Única" ? o.cap : ""} · ${e.color}\n${o.efectivo ? `Precio en efectivo: ${qz(o.efectivo)}` : "Precio: por favor me lo confirman"}${o.cuotas ? `\nCon Visacuotas: ${qz(o.cuotas)}` : ""}\n\n¿Lo tienen disponible? Lo quiero con envío por Guatex y pago al recibir.`,
    );

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-[#111]">
      {/* aviso de muestra */}
      <div className="bg-[#1c1714] px-4 py-2 text-center text-[0.85rem] text-white/85">
        Muestra hecha por <b className="text-white">Jzet Labs</b> para Tu Store, con sus equipos y precios de Instagram. Las fotos son de referencia.
      </div>

      {/* encabezado */}
      <header className="sticky top-0 z-20 bg-[#111] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full text-[0.8rem] font-black" style={{ background: ROJO }}>TU</span>
            <span className="leading-tight">
              <span className="block text-[1.15rem] font-black tracking-tight">TU STORE</span>
              <span className="block text-[0.75rem] text-white/60">Tecnología · Xela</span>
            </span>
          </div>
          <a href="#equipos" className="rounded-full px-4 py-2 text-[0.9rem] font-bold" style={{ background: ROJO }}>
            Ver equipos
          </a>
        </div>
      </header>

      {/* portada */}
      <section className="text-white" style={{ background: NEGRO }}>
        <div className="mx-auto max-w-5xl px-4 pb-10 pt-8">
          <span className="inline-block rounded-md px-2.5 py-1 text-[0.85rem] font-black" style={{ background: ROJO }}>BLACK WEEK</span>
          <h1 className="mt-3 text-[2.2rem] font-black leading-tight sm:text-[3rem]" style={{ color: "#fff" }}>Celulares de alta gama, al mejor precio de Xela</h1>
          <p className="mt-3 max-w-xl text-white/75">iPhone, Samsung y Google Pixel, nuevos y seminuevos. Vea el precio en efectivo y con Visacuotas, y pida el suyo por WhatsApp.</p>
          <ul className="mt-6 grid gap-2 text-[0.95rem] sm:grid-cols-3">
            <li className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5"><Wallet size={18} style={{ color: ROJO }} /> Paga al recibir</li>
            <li className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5"><ShieldCheck size={18} style={{ color: ROJO }} /> Revise antes de pagar</li>
            <li className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5"><Truck size={18} style={{ color: ROJO }} /> Envíos por Guatex</li>
          </ul>
        </div>
      </section>

      {/* equipos */}
      <main id="equipos" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-8">
        <div className="flex flex-wrap items-center gap-2">
          {["Todas", "Apple", "Samsung", "Google", "Motorola"].map((m) => (
            <button key={m} type="button" onClick={() => setMarca(m)} aria-pressed={marca === m} className="rounded-full border-2 px-4 py-2 text-[0.95rem] font-bold" style={marca === m ? { background: NEGRO, color: "#fff", borderColor: NEGRO } : { background: "#fff", borderColor: "#ddd" }}>
              {m}
            </button>
          ))}
          <label className="ml-auto flex w-full items-center gap-2 rounded-full border-2 bg-white px-4 py-2 sm:w-64" style={{ borderColor: "#ddd" }}>
            <Search size={17} className="text-black/40" />
            <input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar equipo" className="w-full bg-transparent outline-none" />
          </label>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {lista.map((e) => {
            const o = e.opciones[0];
            return (
              <li key={e.id}>
                <button type="button" onClick={() => { setFicha(e); setOp(0); }} className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white text-left shadow-[0_1px_0_rgba(0,0,0,.06)] transition hover:shadow-md">
                  <span className="relative grid aspect-square place-items-center bg-[#eee]">
                    {e.foto ? <img src={e.foto} alt="" className="h-full w-full object-cover" loading="lazy" /> : <span className="text-[0.85rem] font-bold text-black/40">{e.marca}</span>}
                    <span className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[0.7rem] font-black text-white" style={{ background: ROJO }}>OFERTA</span>
                  </span>
                  <span className="flex flex-1 flex-col p-3">
                    <span className="text-[0.75rem] font-semibold text-black/50">{e.marca} · {e.estado}</span>
                    <span className="font-bold leading-tight">{e.nombre}</span>
                    <span className="mt-auto pt-2">
                      {o.efectivo ? (
                        <>
                          <span className="block text-[0.72rem] text-black/50">Efectivo{e.opciones.length > 1 ? ", desde" : ""}</span>
                          <span className="block text-[1.25rem] font-black" style={{ color: ROJO }}>{qz(o.efectivo)}</span>
                          {o.cuotas && <span className="block text-[0.78rem] text-black/55">Visacuotas {qz(o.cuotas)}</span>}
                        </>
                      ) : (
                        <span className="block font-bold" style={{ color: ROJO }}>Pregunte el precio de oferta</span>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* tienda */}
        <section className="mt-10 grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-2">
          <div>
            <h2 className="text-[1.3rem] font-black" style={{ color: NEGRO }}>Visítenos</h2>
            <p className="mt-2 flex items-start gap-2"><MapPin size={18} className="mt-1 shrink-0" style={{ color: ROJO }} /> Torre Pradera Xela, kiosko 1, primer nivel, a un costado de Telus.</p>
          </div>
          <div>
            <h2 className="text-[1.3rem] font-black" style={{ color: NEGRO }}>¿Cómo compro?</h2>
            <ol className="mt-2 grid gap-1 text-[0.95rem] text-black/75">
              <li>1. Escoja su equipo y la capacidad.</li>
              <li>2. Le llega el pedido a Tu Store por WhatsApp, ya armado.</li>
              <li>3. Se lo enviamos por Guatex y paga al recibir, después de revisarlo.</li>
            </ol>
          </div>
        </section>
      </main>

      {/* ficha del equipo */}
      {ficha && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/50 sm:items-center" onClick={() => setFicha(null)}>
          <div className="w-full max-w-md rounded-t-3xl bg-white p-5 sm:rounded-3xl" onClick={(ev) => ev.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.8rem] font-semibold text-black/50">{ficha.marca} · {ficha.estado} · {ficha.color}</p>
                <p className="text-[1.4rem] font-black leading-tight">{ficha.nombre}</p>
              </div>
              <button type="button" onClick={() => setFicha(null)} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-full bg-black/5"><X size={18} /></button>
            </div>
            {ficha.opciones.length > 1 && (
              <div className="mt-4 flex gap-2">
                {ficha.opciones.map((o, i) => (
                  <button key={o.cap} type="button" onClick={() => setOp(i)} className="flex-1 rounded-xl border-2 py-2 font-bold" style={op === i ? { borderColor: NEGRO, background: NEGRO, color: "#fff" } : { borderColor: "#ddd" }}>
                    {o.cap}
                  </button>
                ))}
              </div>
            )}
            {(() => {
              const o = ficha.opciones[op];
              return (
                <div className="mt-4 rounded-2xl bg-[#f4f4f4] p-4">
                  {o.efectivo ? (
                    <>
                      <p className="text-[0.85rem] text-black/55">Oferta en efectivo</p>
                      <p className="text-[2rem] font-black leading-none" style={{ color: ROJO }}>{qz(o.efectivo)}</p>
                      {o.cuotas && <p className="mt-1 text-[0.95rem] text-black/65">Precio normal o con Visacuotas: {qz(o.cuotas)}</p>}
                    </>
                  ) : (
                    <p className="font-bold">Escríbanos y le damos el precio de oferta.</p>
                  )}
                  <p className="mt-3 text-[0.88rem] text-black/60">Envío por Guatex · paga al recibir · revise antes de pagar</p>
                  <button type="button" onClick={() => pedir(ficha, o)} className="mt-4 w-full rounded-xl py-3.5 font-black text-white" style={{ background: "#1fa855" }}>
                    Pedir por WhatsApp
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* así le llega el mensaje */}
      {mensaje && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" onClick={() => setMensaje(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-5" onClick={(ev) => ev.stopPropagation()}>
            <p className="text-[1.15rem] font-black">Así le llega el pedido a Tu Store</p>
            <div className="mt-3 rounded-2xl bg-[#e7ddd3] p-3">
              <p className="ml-auto w-fit max-w-[92%] whitespace-pre-line rounded-2xl rounded-br-sm bg-[#d9fdd3] px-3.5 py-2.5 text-[0.92rem]">{mensaje}</p>
            </div>
            <p className="mt-3 text-[0.85rem] text-black/55">Es una muestra: no se envía nada. En su página real, el pedido le llega directo a su WhatsApp.</p>
            <button type="button" onClick={() => setMensaje(null)} className="mt-4 w-full rounded-xl py-3 font-bold text-white" style={{ background: NEGRO }}>
              Entendido
            </button>
          </div>
        </div>
      )}

      <footer className="bg-[#1c1714] px-4 py-6 text-center text-[0.85rem] text-white/70">
        Hecho por Joshua Zet · Jzet Labs · jzetlabs.vercel.app
      </footer>
    </div>
  );
}
