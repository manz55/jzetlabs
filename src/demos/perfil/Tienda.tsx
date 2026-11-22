/*
 * Promos, buscador de tono y catálogo de Sofía. Resuelve los "¿precio?", "¿hay?", "¿qué tono me queda?"
 * y "¿cómo se usa?" que hoy le preguntan uno por uno por mensaje. Lo que dice si hay o no sale de su inventario.
 * Tres secciones, cada una en su franja. Las columnas crecen con el ancho de la pantalla.
 */
import { useEffect, useMemo, useState } from "react";
import { animate, stagger } from "animejs";
import { Check, Minus, Plus, ShieldCheck, ShoppingBag, X } from "lucide-react";
import { MensajeWhatsApp } from "../comun";
import { Seccion } from "./Seccion";
import { Rev, Ventana, sinMovimiento } from "./Ventana";
import { CAMPANA, CONSULTORA, ENVIOS, LINEA, MARCAS, PRODUCTOS, PROMOS, ROSA, SUAVE, TINTA, TONOS, VINO, producto, qz, useInventario, type Producto } from "./datos";

const SERIF = '"Fraunces", Georgia, serif';
type Linea = { key: string; nombre: string; precio: number; n: number };

function Disponible({ n }: { n: number }) {
  if (n <= 0) return <span className="opacity-70">Bajo pedido · 5 días</span>;
  if (n <= 2) return <span style={{ color: VINO }}>{n === 1 ? "Queda 1" : `Quedan ${n}`}</span>;
  return <span style={{ color: "#2f6b45" }}>Entrega el mismo día</span>;
}

function Cuenta({ fin }: { fin: Date }) {
  const [ahora, setAhora] = useState(() => Date.now());
  useEffect(() => { const t = window.setInterval(() => setAhora(Date.now()), 1000); return () => window.clearInterval(t); }, []);
  const falta = Math.max(0, fin.getTime() - ahora);
  const partes = [[Math.floor(falta / 864e5), "días"], [Math.floor(falta / 36e5) % 24, "horas"], [Math.floor(falta / 6e4) % 60, "min"], [Math.floor(falta / 1e3) % 60, "seg"]] as const;
  return (
    <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-xl px-3 py-2 text-white sm:w-auto sm:flex-nowrap" style={{ background: VINO }} role="timer" aria-label="Tiempo que queda de la campaña">
      <p className="text-[1rem] font-bold leading-tight">Termina en</p>
      <div className="flex w-full gap-2 sm:w-auto sm:gap-2">
        {partes.map(([n, t]) => (
          <div key={t} className="grid min-w-0 flex-1 place-items-center rounded-xl bg-white px-1 py-1.5 sm:min-w-[3.6rem] sm:flex-none sm:px-2" style={{ color: TINTA }}>
            <span className="text-[1.55rem] font-semibold leading-none tabular-nums" style={{ fontFamily: SERIF }}>{String(n).padStart(2, "0")}</span>
            <span className="mt-1 text-[0.8rem] font-semibold uppercase tracking-wide opacity-65">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Las promos en abanico: al pasar el mouse o tocar una, se abre y las demás se hacen angostas */
function Abanico({ alAgregar }: { alAgregar: (key: string, nombre: string, precio: number) => void }) {
  const [a, setA] = useState(0);
  useEffect(() => {
    if (sinMovimiento()) return;
    const q = `.pf-ab [data-on="1"] .pf-ab-in`;
    animate(q, { opacity: [0, 1], translateY: [18, 0], duration: 600, delay: stagger(70, { start: 260 }), ease: "outExpo" });
  }, [a]);
  return (
    <div className="pf-ab">
      {PROMOS.map((p, i) => {
        const on = a === i;
        const items = p.ids.map((id) => producto(id)!);
        const ahorro = p.antes > p.ahora ? p.antes - p.ahora : 0;
        return (
          <article key={p.t} data-on={on ? "1" : "0"} onMouseEnter={() => { if (window.matchMedia?.("(hover: hover)").matches) setA(i); }} onClick={() => setA(i)} className="pf-ab-p relative cursor-pointer overflow-hidden rounded-2xl text-white" style={{ background: VINO }}>
            <img src={items[0].foto} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0" style={{ background: on ? "linear-gradient(180deg, rgba(42,22,51,.15) 0%, rgba(42,22,51,.9) 62%)" : "linear-gradient(180deg, rgba(42,22,51,.25), rgba(42,22,51,.75))" }} />
            {!on && (
              <div className="absolute inset-0 flex items-center justify-between gap-3 px-4 md:flex-col md:justify-end md:px-0 md:py-6">
                <span className="text-[1.2rem] font-semibold leading-tight md:[writing-mode:vertical-rl] md:rotate-180 md:text-[1.3rem]" style={{ fontFamily: SERIF }}>{p.t}</span>
                <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[1rem] font-bold" style={{ color: VINO }}>{qz(p.ahora)}</span>
              </div>
            )}
            <div className={`relative flex h-full flex-col justify-end p-5 md:p-7 ${on ? "" : "pointer-events-none opacity-0"}`} style={{ transition: "opacity .4s .25s" }}>
              <div className="pf-ab-in flex flex-wrap gap-2">
                {p.limitada && <span className="rounded-full px-3 py-1 text-[0.9rem] font-bold uppercase tracking-wide" style={{ background: "#fff", color: VINO }}>Edición limitada</span>}
                <span className="rounded-full px-3 py-1 text-[0.9rem] font-bold" style={{ background: "rgba(229,143,168,.95)", color: TINTA }}>{p.quedan === 1 ? "Queda 1" : `Quedan ${p.quedan}`}</span>
              </div>
              <h3 className="pf-ab-in mt-3 text-[clamp(1.7rem,1.2rem+1.6vw,2.8rem)] font-medium leading-[1.05]" style={{ fontFamily: SERIF, color: "#fff" }}>{p.t}</h3>
              <p className="pf-ab-in mt-2 max-w-xl text-[clamp(1.1rem,1rem+0.4vw,1.35rem)] leading-snug text-white/90">{p.gancho}</p>
              <ul className="pf-ab-in mt-4 grid max-w-xl gap-1.5 sm:grid-cols-2">
                {p.incluye.map((x) => <li key={x} className="flex items-start gap-2 text-[1.05rem] leading-tight"><Check size={18} className="mt-0.5 shrink-0" style={{ color: ROSA }} strokeWidth={3} />{x}</li>)}
              </ul>
              <p className="pf-ab-in mt-3 hidden max-w-xl text-[1rem] text-white/75 sm:block"><b className="text-white">Es para:</b> {p.para}</p>
              <div className="pf-ab-in mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                <p className="flex items-baseline gap-3">
                  <span className="text-[clamp(2rem,1.5rem+1.4vw,3rem)] font-semibold leading-none" style={{ fontFamily: SERIF }}>{qz(p.ahora)}</span>
                  {p.antes > p.ahora && <span className="text-[1.15rem] line-through opacity-60">{qz(p.antes)}</span>}
                  {ahorro > 0 && <span className="rounded-full px-3 py-1 text-[0.95rem] font-bold" style={{ background: ROSA, color: TINTA }}>Ahorras {qz(ahorro)}</span>}
                </p>
                <button type="button" onClick={(e) => { e.stopPropagation(); alAgregar(`promo-${i}`, p.t, p.ahora); }} className="pf-btn min-h-[3.25rem] rounded-full bg-white px-8 text-[1.15rem] font-semibold" style={{ color: VINO }}>La quiero</button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Detalle({ p, stock, alCerrar, alAgregar, alVer }: { p: Producto; stock: number; alCerrar: () => void; alAgregar: () => void; alVer: (p: Producto) => void }) {
  const hermanos = PRODUCTOS.filter((x) => x.id !== p.id && x.marca === p.marca).slice(0, 3);
  return (
    <Ventana titulo={p.nombre} alCerrar={alCerrar} ancho="62rem">
      <div className="grid md:grid-cols-2">
        <div className="relative min-h-[18rem] md:min-h-[34rem]">
          <img src={p.foto} alt={p.nombre} className="pf-zoom absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="flex flex-col p-6 pt-8 md:p-9">
          <p className="text-[1rem] font-bold uppercase tracking-[0.12em]" style={{ color: VINO }}>{p.marca}</p>
          <h3 className="mt-1 text-[clamp(1.9rem,1.4rem+1.5vw,2.8rem)] font-medium leading-[1.05]" style={{ fontFamily: SERIF }}>{p.nombre}</h3>
          <p className="mt-2 text-[1.3rem] opacity-80">{p.corto}</p>
          <p className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1"><span className="text-[2.6rem] font-semibold leading-none" style={{ fontFamily: SERIF }}>{qz(p.precio)}</span><span className="text-[1.1rem] font-semibold"><Disponible n={stock} /></span></p>
          <p className="mt-6 text-[1.15rem] font-bold">Cómo se usa</p>
          <ol className="mt-2 grid gap-2">
            {p.uso.map((u, i) => <li key={i} className="flex gap-3 text-[1.1rem] leading-snug"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.95rem] font-bold text-white" style={{ background: VINO }}>{i + 1}</span>{u}</li>)}
          </ol>
          <ul className="mt-5 grid gap-2 rounded-2xl p-4 text-[1.05rem]" style={{ background: "#fde6da" }}>
            {["Producto original y sellado", "Pagas cuando te llegue", "Si no te gusta, te lo cambio"].map((t) => <li key={t} className="flex items-center gap-2.5 font-semibold"><ShieldCheck size={20} style={{ color: VINO }} />{t}</li>)}
          </ul>
          {hermanos.length > 0 && (
            <div className="mt-5">
              <p className="text-[1.05rem] font-bold">También te puede gustar</p>
              <div className="mt-2 flex gap-3">
                {hermanos.map((h) => <button key={h.id} type="button" onClick={() => alVer(h)} aria-label={`Ver ${h.nombre}`} className="pf-card h-20 w-20 overflow-hidden rounded-xl"><img src={h.foto} alt="" className="h-full w-full object-cover" /></button>)}
              </div>
            </div>
          )}
          <button type="button" onClick={alAgregar} className="pf-btn mt-7 min-h-[3.75rem] w-full rounded-full text-[1.25rem] font-semibold text-white" style={{ background: TINTA }}>Lo quiero · {qz(p.precio)}</button>
        </div>
      </div>
    </Ventana>
  );
}

export function Tienda() {
  const { stock } = useInventario();
  const [marca, setMarca] = useState("Todas");
  const [ver, setVer] = useState<Producto | null>(null);
  const [bolsa, setBolsa] = useState<Linea[]>([]);
  const [envio, setEnvio] = useState(ENVIOS[0].id);
  const [verPedido, setVerPedido] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tono, setTono] = useState("");
  const [sub, setSub] = useState("");

  const agregar = (key: string, nombre: string, precio: number) => {
    setBolsa((b) => (b.some((l) => l.key === key) ? b.map((l) => (l.key === key ? { ...l, n: l.n + 1 } : l)) : [...b, { key, nombre, precio, n: 1 }]));
  };
  const cambiar = (key: string, d: number) => setBolsa((b) => b.map((l) => (l.key === key ? { ...l, n: l.n + d } : l)).filter((l) => l.n > 0));
  const piezas = bolsa.reduce((t, l) => t + l.n, 0);
  const subtotal = bolsa.reduce((t, l) => t + l.n * l.precio, 0);
  const env = ENVIOS.find((e) => e.id === envio)!;
  const total = subtotal + env.precio;

  const marcas = ["Todas", ...MARCAS.filter((m) => PRODUCTOS.some((p) => p.marca === m.nombre)).map((m) => m.nombre)];
  const lista = PRODUCTOS.filter((p) => marca === "Todas" || p.marca === marca);

  const sugerido = useMemo(() => {
    if (!tono || !sub) return null;
    const labial = sub === "Frío" ? producto("labial-rojo")! : producto("labial-nude")!;
    return { base: `${tono}${sub === "No sé" ? "" : `, ${sub.toLowerCase()}`}`, labial };
  }, [tono, sub]);

  const pedir = () => {
    const l = bolsa.map((x) => `- ${x.n} × ${x.nombre}: ${qz(x.n * x.precio)}`);
    setVerPedido(false);
    setMensaje(`Hola, ${CONSULTORA.corto}. Quiero hacer este pedido:\n${l.join("\n")}\n${env.precio ? `Envío (${env.nombre}): ${qz(env.precio)}` : env.nombre}\nTotal: ${qz(total)}\nPago al recibir.`);
  };

  const boton = "inline-flex min-h-[3rem] items-center justify-center rounded-full px-5 py-2.5 text-[1.05rem] font-semibold transition active:scale-[0.98]";

  return (
    <>
      {/* promos */}
      <Seccion id="promos" etiqueta="Promos" titulo="Promos de esta campaña" sub="Pasa el mouse o toca una para verla completa." fondo="#ffffff" bajo={<Cuenta fin={CAMPANA.fin} />}>
        <Abanico alAgregar={agregar} />
      </Seccion>

      {/* 03 tu tono */}
      <Seccion id="tono" etiqueta="Tu tono" titulo="¿Qué tono me queda?" sub="Dos preguntas y listo." fondo="#f9cdb9">
        <div className="grid gap-[clamp(1.5rem,4vw,4rem)] lg:grid-cols-2">
          <div className="grid content-start gap-7">
            <div>
              <p className="text-[clamp(1.15rem,1rem+0.5vw,1.45rem)] font-semibold">1. ¿Cuál se parece más a tu piel?</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-4">
                {TONOS.map((t) => (
                  <button key={t.valor} type="button" aria-pressed={tono === t.valor} onClick={() => setTono(t.valor)} className="flex w-[5.5rem] flex-col items-center gap-2">
                    <span className="h-[4.5rem] w-[4.5rem] rounded-full" style={{ background: t.color, boxShadow: tono === t.valor ? `0 0 0 4px #fff, 0 0 0 7px ${TINTA}` : "inset 0 0 0 1px rgba(0,0,0,.1)" }} />
                    <span className={`text-center text-[1rem] leading-tight ${tono === t.valor ? "font-bold" : ""}`}>{t.valor}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[clamp(1.15rem,1rem+0.5vw,1.45rem)] font-semibold">2. ¿De qué color son las venas de tu muñeca?</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {[["Cálido", "Verdes"], ["Frío", "Azules o moradas"], ["Neutro", "De los dos"]].map(([v, t]) => (
                  <button key={v} type="button" aria-pressed={sub === v} onClick={() => setSub(v)} className="min-h-[3rem] rounded-full border-2 bg-white px-6 text-[1.1rem] font-semibold" style={sub === v ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(42,22,51,.3)" }}>{t}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="self-start rounded-2xl bg-white p-6" style={{ minHeight: 200 }}>
            {sugerido ? (
              <>
                <p className="text-[1.1rem] font-bold uppercase tracking-wide" style={{ color: VINO }}>Te recomiendo</p>
                <ul className="mt-4 grid gap-4">
                  {[{ f: producto("base")!.foto, t: "Base líquida", d: `Tono ${sugerido.base}`, id: `base-${sugerido.base}`, n: `Base líquida, tono ${sugerido.base}`, p: producto("base")!.precio }, { f: sugerido.labial.foto, t: sugerido.labial.nombre, d: "Va con tu subtono", id: sugerido.labial.id, n: sugerido.labial.nombre, p: sugerido.labial.precio }].map((x) => (
                    <li key={x.id} className="flex items-center gap-4">
                      <img src={x.f} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                      <span className="min-w-0 flex-1 leading-tight"><b className="block text-[1.2rem]">{x.t}</b><span className="opacity-70">{x.d}</span></span>
                      <button type="button" onClick={() => agregar(x.id, x.n, x.p)} className={`${boton} shrink-0 text-white`} style={{ background: VINO }}>Agregar</button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-[1.25rem] opacity-60">Escoge tu tono y tus venas. Aquí te sale lo que te queda.</p>
            )}
          </div>
        </div>
      </Seccion>

      {/* catálogo */}
      <Seccion id="catalogo" etiqueta="Catálogo" titulo="Mi catálogo" sub={<><span className="block text-[clamp(1.5rem,1.1rem+1.4vw,2.3rem)] font-semibold leading-tight opacity-100" style={{ fontFamily: SERIF, color: VINO }}>Entrega el mismo día</span><span className="mt-1 block opacity-80">Productos de mi inventario</span></>} fondo="#ffffff">
        <div className="flex flex-wrap gap-3" role="group" aria-label="Filtrar por marca">
          {marcas.map((m) => (
            <button key={m} type="button" aria-pressed={marca === m} onClick={() => setMarca(m)} className="pf-btn min-h-[3rem] rounded-full border-2 px-6 text-[1.1rem] font-semibold" style={marca === m ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(42,22,51,.3)" }}>{m}</button>
          ))}
        </div>
        <div key={marca} className="pf-fill mt-8" style={{ ["--min" as string]: "13.5rem" }}>
          {lista.map((p: Producto, i) => (
            <Rev key={p.id} i={i} className="h-full">
              <article className="pf-card flex h-full flex-col rounded-2xl" style={{ background: "#fde6da" }}>
                <button type="button" onClick={() => setVer(p)} aria-label={`Ver ${p.nombre}`} className="block w-full overflow-hidden text-left">
                  <span className="block overflow-hidden"><img src={p.foto} alt="" className="pf-img aspect-square w-full object-cover" loading="lazy" /></span>
                  <span className="block p-4 pb-2">
                    <span className="block text-[0.9rem] font-medium opacity-60">{p.marca}</span>
                    <span className="block text-[1.15rem] font-semibold leading-tight">{p.nombre}</span>
                    <span className="mt-2 block text-[1.6rem] font-semibold leading-none" style={{ fontFamily: SERIF }}>{qz(p.precio)}</span>
                    <span className="mt-1.5 block text-[0.95rem] font-semibold"><Disponible n={stock[p.id] ?? 0} /></span>
                  </span>
                </button>
                <div className="mt-auto grid gap-1 p-4 pt-2">
                  <button type="button" onClick={() => agregar(p.id, p.nombre, p.precio)} className={`${boton} pf-btn w-full text-white`} style={{ background: TINTA }}>Lo quiero</button>
                  <button type="button" onClick={() => setVer(p)} className="min-h-[2.5rem] text-[1rem] font-semibold underline decoration-1 underline-offset-4">Ver más</button>
                </div>
              </article>
            </Rev>
          ))}
        </div>
      </Seccion>
      {ver && <Detalle p={ver} stock={stock[ver.id] ?? 0} alCerrar={() => setVer(null)} alVer={setVer} alAgregar={() => { agregar(ver.id, ver.nombre, ver.precio); setVer(null); }} />}

      {/* el pedido: barra fija mientras haya algo */}
      {piezas > 0 && !verPedido && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t print:hidden" style={{ borderColor: LINEA, background: "rgba(253,230,218,.97)" }}>
          <div className="pf-cont flex items-center justify-between gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
            <p className="text-[1.15rem]"><b>{piezas}</b> {piezas === 1 ? "producto" : "productos"} · <b>{qz(subtotal)}</b></p>
            <button type="button" onClick={() => setVerPedido(true)} className={`${boton} gap-2 text-white`} style={{ background: VINO }}><ShoppingBag size={20} /> Ver mi pedido</button>
          </div>
        </div>
      )}
      {verPedido && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" onClick={() => setVerPedido(false)}>
          <div role="dialog" aria-label="Tu pedido" className="max-h-[92vh] w-full overflow-y-auto p-5 sm:max-w-lg" style={{ background: "#fde6da" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-[1.7rem] font-medium" style={{ fontFamily: SERIF }}>Tu pedido</h2>
              <button type="button" aria-label="Cerrar" onClick={() => setVerPedido(false)} className="grid h-11 w-11 place-items-center rounded-full" style={{ background: SUAVE }}><X size={20} /></button>
            </div>
            {bolsa.length === 0 ? <p className="mt-4 opacity-60">Todavía no agregas nada.</p> : (
              <ul className="mt-4 border-t" style={{ borderColor: TINTA }}>
                {bolsa.map((l) => (
                  <li key={l.key} className="flex items-center justify-between gap-3 border-b py-3" style={{ borderColor: LINEA }}>
                    <span className="min-w-0 leading-tight"><b className="block">{l.nombre}</b><span className="opacity-60">{qz(l.precio)} c/u</span></span>
                    <span className="flex shrink-0 items-center gap-1">
                      <button type="button" aria-label="Uno menos" onClick={() => cambiar(l.key, -1)} className="grid h-11 w-11 place-items-center rounded-full border-2" style={{ borderColor: "rgba(42,22,51,.25)" }}><Minus size={16} /></button>
                      <span className="w-7 text-center tabular-nums">{l.n}</span>
                      <button type="button" aria-label="Uno más" onClick={() => cambiar(l.key, 1)} className="grid h-11 w-11 place-items-center rounded-full border-2" style={{ borderColor: "rgba(42,22,51,.25)" }}><Plus size={16} /></button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-5 font-semibold">¿A dónde te lo llevo?</p>
            <div className="mt-2 grid gap-2">
              {ENVIOS.map((e) => (
                <button key={e.id} type="button" aria-pressed={envio === e.id} onClick={() => setEnvio(e.id)} className="flex min-h-[3.25rem] items-center justify-between gap-3 border-2 px-4 py-3 text-left" style={{ borderColor: envio === e.id ? TINTA : "rgba(42,22,51,.18)", background: envio === e.id ? "#fff" : "transparent" }}>
                  <span className="leading-tight"><b className="block">{e.nombre}</b><span className="text-[0.92rem] opacity-60">{e.dias}</span></span>
                  <span className="shrink-0 tabular-nums">{e.precio ? qz(e.precio) : "Sin costo"}</span>
                </button>
              ))}
            </div>
            <dl className="mt-5 grid gap-1 text-[1.05rem]">
              <div className="flex justify-between"><dt className="opacity-70">Productos</dt><dd className="tabular-nums">{qz(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="opacity-70">Envío</dt><dd className="tabular-nums">{env.precio ? qz(env.precio) : "Sin costo"}</dd></div>
              <div className="mt-1 flex justify-between border-t pt-2 text-[1.25rem] font-semibold" style={{ borderColor: TINTA }}><dt>Total</dt><dd style={{ fontFamily: SERIF }}>{qz(total)}</dd></div>
            </dl>
            <p className="mt-2 text-[0.95rem] opacity-60">Pagas cuando te llegue.</p>
            <button type="button" disabled={!bolsa.length} onClick={pedir} className={`${boton} mt-5 w-full text-[1.15rem] text-white disabled:opacity-40`} style={{ background: VINO }}>Mandar mi pedido por WhatsApp</button>
          </div>
        </div>
      )}
      <MensajeWhatsApp mensaje={mensaje} alCerrar={() => setMensaje(null)} demo="perfil de belleza" que="cada pedido" />
    </>
  );
}
