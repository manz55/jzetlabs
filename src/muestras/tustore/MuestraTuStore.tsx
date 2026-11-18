/*
 * Muestra hecha para Tu Store (tienda real de Xela) con sus equipos y precios
 * de Instagram. Lo que se pide no se envía: se enseña cómo le llegaría el
 * mensaje a su WhatsApp. Accesorios, reparaciones y testimonios son de ejemplo.
 */
import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, MessageCircle, Package, Search, Send, ShieldCheck, Star, Truck, Wallet, Wrench, X } from "lucide-react";
import {
  ACCESORIOS, EQUIPOS, FALLAS, GAMAS, NEGRO, PREGUNTAS, ROJO, TERMINOS, TESTIMONIOS, fotoPiezas, fotoReparacion, qz,
  type Equipo,
} from "./datos";

const MENU: [string, string][] = [
  ["#equipos", "Equipos"],
  ["#accesorios", "Accesorios"],
  ["#reparaciones", "Reparaciones"],
  ["#pedido", "Mi pedido"],
  ["#ubicacion", "Ubicación"],
];

export default function MuestraTuStore() {
  const [marca, setMarca] = useState("Todas");
  const [buscar, setBuscar] = useState("");
  const [ficha, setFicha] = useState<Equipo | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [terminos, setTerminos] = useState(false);
  const lista = EQUIPOS.filter((e) => (marca === "Todas" || e.marca === marca) && e.nombre.toLowerCase().includes(buscar.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-[#111]">
      <style>{`.ts h1,.ts h2,.ts h3{color:inherit}`}</style>
      <div className="ts">
        <div className="bg-[#1c1714] px-4 py-2 text-center text-[0.85rem] text-white/85">
          Muestra hecha por <b className="text-white">Jzet Labs</b> para Tu Store, con sus equipos, fotos y precios de Instagram.
        </div>

        {/* encabezado */}
        <header className="sticky top-0 z-20 bg-[#111] text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <a href="#inicio" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full text-[0.8rem] font-black" style={{ background: ROJO }}>TU</span>
              <span className="leading-tight">
                <span className="block text-[1.15rem] font-black tracking-tight">TU STORE</span>
                <span className="block text-[0.75rem] text-white/60">Tecnología · Xela</span>
              </span>
            </a>
            <nav className="hidden gap-1 md:flex">
              {MENU.map(([h, t]) => (
                <a key={h} href={h} className="rounded-full px-3 py-2 text-[0.92rem] font-semibold text-white/80 hover:bg-white/10 hover:text-white">{t}</a>
              ))}
            </nav>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-2 md:hidden">
            {MENU.map(([h, t]) => (
              <a key={h} href={h} className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-[0.85rem] font-semibold">{t}</a>
            ))}
          </nav>
        </header>

        {/* portada */}
        <section id="inicio" className="text-white" style={{ background: NEGRO }}>
          <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-10 pt-8 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <span className="inline-block rounded-md px-2.5 py-1 text-[0.85rem] font-black" style={{ background: ROJO }}>BLACK WEEK</span>
              <h1 className="mt-3 text-[2.2rem] font-black leading-tight sm:text-[3rem]">Celulares de alta gama, al mejor precio de Xela</h1>
              <p className="mt-3 max-w-xl text-white/75">iPhone, Samsung y Google Pixel, nuevos y seminuevos. Vea el precio en efectivo y con Visacuotas, y pida el suyo por WhatsApp.</p>
              <ul className="mt-6 grid gap-2 text-[0.95rem] sm:grid-cols-3">
                <li className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5"><Wallet size={18} style={{ color: ROJO }} /> Paga al recibir</li>
                <li className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5"><ShieldCheck size={18} style={{ color: ROJO }} /> Revise antes de pagar</li>
                <li className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5"><Truck size={18} style={{ color: ROJO }} /> Envíos por Guatex</li>
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[EQUIPOS[0], EQUIPOS[6], EQUIPOS[10]].map((e) => (
                <button key={e.id} type="button" onClick={() => setFicha(e)} className="overflow-hidden rounded-2xl bg-white/5 text-left">
                  <img src={e.fotos[0]} alt={e.nombre} className="aspect-[3/4] w-full object-cover" />
                  <span className="block px-2 py-1.5 text-[0.78rem] font-bold">{e.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* equipos */}
        <main className="mx-auto max-w-6xl px-4">
          <section id="equipos" className="scroll-mt-28 py-10">
            <h2 className="text-[1.7rem] font-black">Equipos disponibles</h2>
            <p className="text-black/60">{EQUIPOS.length} equipos · toque uno para ver fotos y especificaciones</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {["Todas", "Apple", "Samsung", "Google", "Motorola"].map((m) => (
                <button key={m} type="button" onClick={() => setMarca(m)} aria-pressed={marca === m} className="rounded-full border-2 px-4 py-2 text-[0.95rem] font-bold" style={marca === m ? { background: NEGRO, color: "#fff", borderColor: NEGRO } : { background: "#fff", borderColor: "#ddd" }}>
                  {m}
                </button>
              ))}
              <label className="flex w-full items-center gap-2 rounded-full border-2 bg-white px-4 py-2 sm:ml-auto sm:w-64" style={{ borderColor: "#ddd" }}>
                <Search size={17} className="text-black/40" />
                <input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar equipo" className="w-full bg-transparent outline-none" />
              </label>
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {lista.map((e) => (
                <li key={e.id}>
                  <TarjetaEquipo e={e} alAbrir={() => setFicha(e)} />
                </li>
              ))}
            </ul>
          </section>

          {/* accesorios */}
          <section id="accesorios" className="scroll-mt-28 py-10">
            <h2 className="text-[1.7rem] font-black">Accesorios</h2>
            <p className="text-black/60">Cargadores, audífonos, fundas y más. Precios de ejemplo: en su página van los suyos.</p>
            <ul className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2">
              {ACCESORIOS.map((a) => (
                <li key={a.id} className="w-40 shrink-0 snap-start sm:w-48">
                  <div className="overflow-hidden rounded-2xl bg-white">
                    <img src={a.foto} alt={a.nombre} className="aspect-square w-full object-cover" loading="lazy" />
                    <div className="p-3">
                      <p className="text-[0.92rem] font-bold leading-tight">{a.nombre}</p>
                      <p className="mt-1 font-black" style={{ color: ROJO }}>{qz(a.precio)}</p>
                      <button type="button" onClick={() => setMensaje(`Hola Tu Store, quiero este accesorio:\n\n${a.nombre} · ${qz(a.precio)}\n\n¿Lo tienen disponible?`)} className="mt-2 w-full rounded-lg py-2 text-[0.85rem] font-bold text-white" style={{ background: NEGRO }}>
                        Lo quiero
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <Reparaciones alPedir={setMensaje} />
          <Testimonios />
          <MiPedido />
          <Ubicacion />
        </main>

        <footer className="mt-10 bg-[#111] px-4 py-8 text-center text-[0.88rem] text-white/70">
          <p className="font-black text-white">TU STORE · Tecnología</p>
          <p className="mt-1">Torre Pradera Xela, kiosko 1, primer nivel</p>
          <button type="button" onClick={() => setTerminos(true)} className="mt-3 underline underline-offset-4">Términos y condiciones</button>
          <p className="mt-4 text-white/45">Muestra hecha por Joshua Zet · Jzet Labs · jzetlabs.vercel.app</p>
        </footer>
      </div>

      {ficha && <Ficha e={ficha} alCerrar={() => setFicha(null)} alPedir={setMensaje} />}
      {mensaje && <AsiLlega mensaje={mensaje} alCerrar={() => setMensaje(null)} />}
      {terminos && <Terminos alCerrar={() => setTerminos(false)} />}
      {!ficha && !mensaje && !terminos && <Chat alHablar={() => setMensaje("Hola Tu Store, tengo una pregunta sobre un equipo.")} />}
    </div>
  );
}

function TarjetaEquipo({ e, alAbrir }: { e: Equipo; alAbrir: () => void }) {
  const o = e.opciones[0];
  return (
    <button type="button" onClick={alAbrir} className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white text-left shadow-[0_1px_0_rgba(0,0,0,.06)] transition hover:shadow-md">
      <span className="relative grid aspect-square place-items-center bg-[#eee]">
        {e.fotos[0] ? <img src={e.fotos[0]} alt="" className="h-full w-full object-cover" loading="lazy" /> : <span className="px-3 text-center text-[0.85rem] font-bold text-black/40">Foto pendiente</span>}
        <span className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[0.7rem] font-black text-white" style={{ background: e.nuevo ? NEGRO : ROJO }}>{e.nuevo ? "RECIÉN LLEGADO" : "OFERTA"}</span>
        {e.fotos.length > 1 && <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[0.7rem] font-bold text-white">{e.fotos.length} fotos</span>}
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
  );
}

function Ficha({ e, alCerrar, alPedir }: { e: Equipo; alCerrar: () => void; alPedir: (m: string) => void }) {
  const [op, setOp] = useState(0);
  const [foto, setFoto] = useState(0);
  const o = e.opciones[op];
  const fotos = e.fotos;
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/55 sm:items-center sm:p-4" onClick={alCerrar}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl" onClick={(ev) => ev.stopPropagation()}>
        <div className="relative bg-[#eee]">
          {fotos.length ? (
            <img src={fotos[foto]} alt={`${e.nombre}, foto ${foto + 1}`} className="aspect-[4/3] w-full object-contain bg-black" />
          ) : (
            <div className="grid aspect-[4/3] place-items-center px-6 text-center font-bold text-black/40">Foto pendiente: aquí va la foto real de su equipo</div>
          )}
          {fotos.length > 1 && (
            <>
              <button type="button" onClick={() => setFoto((foto - 1 + fotos.length) % fotos.length)} aria-label="Foto anterior" className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90"><ChevronLeft size={20} /></button>
              <button type="button" onClick={() => setFoto((foto + 1) % fotos.length)} aria-label="Foto siguiente" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90"><ChevronRight size={20} /></button>
            </>
          )}
          <button type="button" onClick={alCerrar} aria-label="Cerrar" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90"><X size={18} /></button>
        </div>
        {fotos.length > 1 && (
          <div className="flex gap-2 px-5 pt-3">
            {fotos.map((f, i) => (
              <button key={i} type="button" onClick={() => setFoto(i)} className="h-14 w-14 overflow-hidden rounded-lg border-2" style={{ borderColor: i === foto ? NEGRO : "transparent" }}>
                <img src={f} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="p-5">
          <p className="text-[0.82rem] font-semibold text-black/50">{e.marca} · {e.estado} · {e.color}</p>
          <p className="text-[1.5rem] font-black leading-tight">{e.nombre}</p>
          {e.opciones.length > 1 && (
            <div className="mt-3 flex gap-2">
              {e.opciones.map((x, i) => (
                <button key={x.cap} type="button" onClick={() => setOp(i)} className="flex-1 rounded-xl border-2 py-2 font-bold" style={op === i ? { borderColor: NEGRO, background: NEGRO, color: "#fff" } : { borderColor: "#ddd" }}>
                  {x.cap}
                </button>
              ))}
            </div>
          )}
          <div className="mt-4 rounded-2xl bg-[#f4f4f4] p-4">
            {o.efectivo ? (
              <>
                <p className="text-[0.85rem] text-black/55">Oferta en efectivo{e.opciones.length === 1 && o.cap !== "Consulte capacidad" ? ` · ${o.cap}` : ""}</p>
                <p className="text-[2rem] font-black leading-none" style={{ color: ROJO }}>{qz(o.efectivo)}</p>
                {o.cuotas && <p className="mt-1 text-[0.95rem] text-black/65">Precio normal o con Visacuotas: {qz(o.cuotas)}</p>}
              </>
            ) : (
              <p className="font-bold">Escríbanos y le damos el precio de oferta.</p>
            )}
            <p className="mt-2 text-[0.85rem] text-black/60">Envío por Guatex · paga al recibir · revise antes de pagar</p>
          </div>
          <h3 className="mt-5 font-black">Especificaciones</h3>
          <dl className="mt-2 overflow-hidden rounded-xl border" style={{ borderColor: "#e5e5e5" }}>
            {e.specs.map(([a, b]) => (
              <div key={a} className="flex justify-between gap-4 border-b px-4 py-2.5 text-[0.92rem] last:border-0" style={{ borderColor: "#eee" }}>
                <dt className="text-black/55">{a}</dt>
                <dd className="text-right font-semibold">{b}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-[0.78rem] text-black/45">Especificaciones de referencia del modelo. En su página pueden subir varias fotos de cada equipo: frente, atrás y lados.</p>
          <button
            type="button"
            onClick={() =>
              alPedir(
                `Hola Tu Store, quiero este equipo:\n\n${e.nombre}${o.cap !== "Consulte capacidad" ? ` ${o.cap}` : ""} · ${e.color}\n${o.efectivo ? `Precio en efectivo: ${qz(o.efectivo)}` : "Precio: por favor me lo confirman"}${o.cuotas ? `\nCon Visacuotas: ${qz(o.cuotas)}` : ""}\n\n¿Lo tienen disponible? Lo quiero con envío por Guatex y pago al recibir.`,
              )
            }
            className="mt-4 w-full rounded-xl py-3.5 font-black text-white"
            style={{ background: "#1fa855" }}
          >
            Pedir por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

function Reparaciones({ alPedir }: { alPedir: (m: string) => void }) {
  const [gama, setGama] = useState(0);
  const [falla, setFalla] = useState(0);
  const g = GAMAS[gama];
  const f = FALLAS[falla];
  return (
    <section id="reparaciones" className="scroll-mt-28 py-10">
      <div className="grid gap-5 overflow-hidden rounded-3xl bg-white md:grid-cols-2">
        <div className="grid grid-cols-2 gap-1">
          <img src={fotoReparacion} alt="Técnico reparando un celular" className="h-40 w-full object-cover md:h-full" loading="lazy" />
          <img src={fotoPiezas} alt="Piezas de un celular abierto" className="h-40 w-full object-cover md:h-full" loading="lazy" />
        </div>
        <div className="p-5 sm:p-6">
          <p className="flex items-center gap-2 font-bold" style={{ color: ROJO }}><Wrench size={18} /> Reparaciones</p>
          <h2 className="mt-1 text-[1.6rem] font-black leading-tight">Cotice su reparación en un minuto</h2>
          <p className="mt-1 text-[0.9rem] text-black/55">Si ustedes reparan, así se vería. Precios de ejemplo.</p>
          <label className="mt-4 block text-[0.9rem] font-bold">
            Su teléfono
            <select value={gama} onChange={(e) => setGama(Number(e.target.value))} className="mt-1 block w-full rounded-xl border-2 bg-white px-3 py-2.5" style={{ borderColor: "#ddd" }}>
              {GAMAS.map((x, i) => <option key={x.nombre} value={i}>{x.nombre}</option>)}
            </select>
          </label>
          <p className="mt-3 text-[0.9rem] font-bold">¿Qué le pasa?</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {FALLAS.map((x, i) => (
              <button key={x.id} type="button" onClick={() => setFalla(i)} className="rounded-full border-2 px-3 py-1.5 text-[0.88rem] font-bold" style={falla === i ? { background: NEGRO, color: "#fff", borderColor: NEGRO } : { borderColor: "#ddd" }}>
                {x.nombre}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-end justify-between rounded-2xl bg-[#f4f4f4] p-4">
            <div>
              <p className="text-[0.85rem] text-black/55">Precio aproximado</p>
              <p className="text-[1.7rem] font-black leading-none" style={{ color: ROJO }}>{qz(f.precio[g.gama])}</p>
            </div>
            <p className="text-right text-[0.88rem] text-black/60">Listo en<br /><b className="text-black">{f.tiempo}</b></p>
          </div>
          <button type="button" onClick={() => alPedir(`Hola Tu Store, quiero cotizar una reparación:\n\nTeléfono: ${g.nombre}\nFalla: ${f.nombre}\nPrecio aproximado: ${qz(f.precio[g.gama])}\n\n¿Cuándo lo puedo llevar?`)} className="mt-3 w-full rounded-xl py-3 font-black text-white" style={{ background: NEGRO }}>
            Agendar reparación
          </button>
        </div>
      </div>
    </section>
  );
}

function Testimonios() {
  return (
    <section className="py-10">
      <h2 className="text-[1.7rem] font-black">Lo que dicen nuestros clientes</h2>
      <p className="text-black/60">Testimonios de ejemplo: en su página van las reseñas reales de sus clientes.</p>
      <ul className="mt-5 grid gap-3 md:grid-cols-3">
        {TESTIMONIOS.map((t) => (
          <li key={t.nombre} className="rounded-2xl bg-white p-5">
            <p className="flex gap-0.5" aria-label="5 estrellas">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={16} fill={ROJO} color={ROJO} />)}</p>
            <p className="mt-3 text-[0.98rem]">“{t.texto}”</p>
            <p className="mt-3 font-bold">{t.nombre}</p>
            <p className="text-[0.85rem] text-black/50">{t.lugar}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MiPedido() {
  const [codigo, setCodigo] = useState("");
  const [visto, setVisto] = useState<string | null>(null);
  const pasos = ["Pedido recibido", "Equipo revisado y empacado", "Enviado por Guatex", "Entregado"];
  const actual = 2;
  return (
    <section id="pedido" className="scroll-mt-28 py-10">
      <div className="rounded-3xl bg-white p-5 sm:p-6">
        <p className="flex items-center gap-2 font-bold" style={{ color: ROJO }}><Package size={18} /> Mi pedido</p>
        <h2 className="mt-1 text-[1.6rem] font-black">¿Cómo va mi entrega?</h2>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setVisto(codigo.trim().toUpperCase() || "TS-1042");
          }}
        >
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Número de pedido, ej. TS-1042" className="min-w-0 flex-1 rounded-xl border-2 px-3 py-2.5" style={{ borderColor: "#ddd" }} />
          <button type="submit" className="rounded-xl px-4 font-bold text-white" style={{ background: NEGRO }}>Buscar</button>
        </form>
        {visto && (
          <div className="mt-5">
            <p className="font-bold">Pedido {visto} · Galaxy S23 Ultra 256 GB</p>
            <p className="text-[0.88rem] text-black/55">Guía de Guatex: 7420 1185 · llega a Huehuetenango</p>
            <ol className="mt-4 grid gap-3">
              {pasos.map((p, i) => (
                <li key={p} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.8rem] font-black text-white" style={{ background: i <= actual ? ROJO : "#ccc" }}>{i + 1}</span>
                  <span className={i <= actual ? "font-bold" : "text-black/45"}>{p}</span>
                  {i === actual && <span className="rounded-full px-2 py-0.5 text-[0.75rem] font-bold text-white" style={{ background: NEGRO }}>Aquí va</span>}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[0.85rem] text-black/50">Ejemplo: en su página cada cliente ve el estado real de su pedido.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function Ubicacion() {
  return (
    <section id="ubicacion" className="scroll-mt-28 py-10">
      <div className="grid gap-0 overflow-hidden rounded-3xl bg-white md:grid-cols-2">
        <iframe title="Mapa de Torre Pradera Xela" src="https://www.google.com/maps?q=Pradera+Xela+Quetzaltenango&output=embed" className="h-64 w-full md:h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        <div className="p-5 sm:p-6">
          <p className="flex items-center gap-2 font-bold" style={{ color: ROJO }}><MapPin size={18} /> Ubicación</p>
          <h2 className="mt-1 text-[1.6rem] font-black">Visítenos en Xela</h2>
          <p className="mt-2">Torre Pradera Xela, kiosko 1, primer nivel, a un costado de Telus.</p>
          <p className="mt-2 text-[0.92rem] text-black/60">Lunes a sábado de 9:00 a 19:00 (horario de ejemplo)</p>
          <a href="https://www.google.com/maps/search/?api=1&query=Pradera+Xela+Quetzaltenango" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-xl px-5 py-3 font-black text-white" style={{ background: NEGRO }}>
            Cómo llegar
          </a>
          <h3 className="mt-6 font-black">¿Cómo compro?</h3>
          <ol className="mt-2 grid gap-1 text-[0.95rem] text-black/75">
            <li>1. Escoja su equipo y la capacidad.</li>
            <li>2. Le llega el pedido a Tu Store por WhatsApp, ya armado.</li>
            <li>3. Se lo enviamos por Guatex y paga al recibir, después de revisarlo.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

function AsiLlega({ mensaje, alCerrar }: { mensaje: string; alCerrar: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" onClick={alCerrar}>
      <div className="w-full max-w-sm rounded-3xl bg-white p-5" onClick={(ev) => ev.stopPropagation()}>
        <p className="text-[1.15rem] font-black">Así le llega el mensaje a Tu Store</p>
        <div className="mt-3 rounded-2xl bg-[#e7ddd3] p-3">
          <p className="ml-auto w-fit max-w-[92%] whitespace-pre-line rounded-2xl rounded-br-sm bg-[#d9fdd3] px-3.5 py-2.5 text-[0.92rem]">{mensaje}</p>
        </div>
        <p className="mt-3 text-[0.85rem] text-black/55">Es una muestra: no se envía nada. En su página real, le llega directo a su WhatsApp.</p>
        <button type="button" onClick={alCerrar} className="mt-4 w-full rounded-xl py-3 font-bold text-white" style={{ background: NEGRO }}>Entendido</button>
      </div>
    </div>
  );
}

function Terminos({ alCerrar }: { alCerrar: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 sm:items-center sm:p-4" onClick={alCerrar}>
      <div className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl" onClick={(ev) => ev.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[1.4rem] font-black">Términos y condiciones</h2>
          <button type="button" onClick={alCerrar} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-full bg-black/5"><X size={18} /></button>
        </div>
        {TERMINOS.map((t) => (
          <div key={t.titulo} className="mt-4">
            <h3 className="font-black">{t.titulo}</h3>
            <p className="mt-1 text-[0.95rem] text-black/70">{t.texto}</p>
          </div>
        ))}
        <p className="mt-6 rounded-xl bg-[#f4f4f4] p-3 text-[0.85rem] text-black/55">Texto de ejemplo. En su página se ajusta con ustedes: plazos de garantía, cambios y lo que aplique a su negocio.</p>
      </div>
    </div>
  );
}

/* Chat con preguntas y respuestas listas, sin servicios externos */
function Chat({ alHablar }: { alHablar: () => void }) {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const [hilo, setHilo] = useState<{ de: "yo" | "tienda"; t: string }[]>([{ de: "tienda", t: "¡Hola! Soy el asistente de Tu Store. Toque una pregunta o escriba la suya." }]);
  const responder = (pregunta: string) => {
    const q = pregunta.toLowerCase();
    const r = PREGUNTAS.find((x) => x.p === pregunta || x.claves.some((c) => q.includes(c)));
    setHilo((h) => [...h, { de: "yo", t: pregunta }, { de: "tienda", t: r ? r.r : "Esa pregunta se la responde una persona del equipo. Toque “Hablar con una persona” y le contestamos por WhatsApp." }]);
  };
  return (
    <>
      {abierto && (
        <div className="fixed bottom-24 right-4 z-40 flex max-h-[70vh] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: NEGRO }}>
            <span>
              <span className="block font-black">Tu Store</span>
              <span className="block text-[0.78rem] text-white/60">Respuestas al instante</span>
            </span>
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar chat"><X size={20} /></button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {hilo.map((m, i) => (
              <p key={i} className={`max-w-[85%] rounded-2xl px-3 py-2 text-[0.92rem] ${m.de === "yo" ? "ml-auto text-white" : "bg-[#f1f1f1]"}`} style={m.de === "yo" ? { background: ROJO } : undefined}>
                {m.t}
              </p>
            ))}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PREGUNTAS.map((x) => (
                <button key={x.p} type="button" onClick={() => responder(x.p)} className="rounded-full border px-2.5 py-1 text-[0.8rem] font-semibold" style={{ borderColor: "#ddd" }}>
                  {x.p}
                </button>
              ))}
              <button type="button" onClick={alHablar} className="rounded-full px-2.5 py-1 text-[0.8rem] font-bold text-white" style={{ background: "#1fa855" }}>
                Hablar con una persona
              </button>
            </div>
          </div>
          <form
            className="flex gap-2 border-t p-2"
            style={{ borderColor: "#eee" }}
            onSubmit={(e) => {
              e.preventDefault();
              if (texto.trim()) responder(texto.trim());
              setTexto("");
            }}
          >
            <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escriba su pregunta" className="min-w-0 flex-1 rounded-full bg-[#f1f1f1] px-3 py-2 outline-none" />
            <button type="submit" aria-label="Enviar" className="grid h-10 w-10 place-items-center rounded-full text-white" style={{ background: ROJO }}><Send size={17} /></button>
          </form>
        </div>
      )}
      <button type="button" onClick={() => setAbierto((x) => !x)} aria-label="Abrir chat" className="fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full px-4 py-3 font-black text-white shadow-xl" style={{ background: ROJO }}>
        <MessageCircle size={20} /> {abierto ? "Cerrar" : "¿Tiene preguntas?"}
      </button>
    </>
  );
}
