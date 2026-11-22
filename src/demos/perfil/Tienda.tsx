/*
 * Promos, buscador de tono y catálogo de Sofía. Resuelve los "¿precio?", "¿hay?", "¿qué tono me queda?"
 * y "¿cómo se usa?" que hoy le preguntan uno por uno por mensaje. Lo que dice si hay o no sale de su inventario.
 * Tres secciones, cada una en su franja. Las columnas crecen con el ancho de la pantalla.
 */
import { useMemo, useState } from "react";
import { ChevronDown, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { MensajeWhatsApp } from "../comun";
import { Seccion } from "./Seccion";
import { CAMPANA, CONSULTORA, ENVIOS, LINEA, MARCAS, PRODUCTOS, PROMOS, SUAVE, TINTA, TONOS, VINO, producto, qz, useInventario, type Producto } from "./datos";

const SERIF = '"Fraunces", Georgia, serif';
type Linea = { key: string; nombre: string; precio: number; n: number };

function Disponible({ n }: { n: number }) {
  if (n <= 0) return <span className="opacity-70">Bajo pedido · 5 días</span>;
  if (n <= 2) return <span style={{ color: VINO }}>{n === 1 ? "Queda 1" : `Quedan ${n}`}</span>;
  return <span style={{ color: "#2f6b45" }}>Entrega inmediata</span>;
}

export function Tienda() {
  const { stock } = useInventario();
  const [marca, setMarca] = useState("Todas");
  const [uso, setUso] = useState<string | null>(null);
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
  const diasPromo = Math.max(1, Math.ceil((CAMPANA.fin.getTime() - Date.now()) / 864e5));
  const finTexto = CAMPANA.fin.toLocaleDateString("es-GT", { day: "numeric", month: "long" });

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
      {/* 02 promos */}
      <Seccion id="promos" num="02" etiqueta="Promos" titulo="Promos de esta campaña" fondo="#ffffff" derecha={<p className="rounded-full px-5 py-2.5 text-[1.1rem] font-bold text-white" style={{ background: VINO }}>{diasPromo === 1 ? "Último día" : `Quedan ${diasPromo} días`} · hasta el {finTexto}</p>}>
        <div className="pf-auto" style={{ ["--min" as string]: "19rem" }}>
          {PROMOS.map((p, i) => (
            <article key={p.t} className="flex flex-col overflow-hidden rounded-2xl" style={{ background: "#fde6da", boxShadow: p.limitada ? `inset 0 0 0 3px ${VINO}` : "none" }}>
              <div className="flex">{p.ids.slice(0, 3).map((id) => <img key={id} src={producto(id)!.foto} alt="" className="aspect-square min-w-0 flex-1 object-cover" loading="lazy" />)}</div>
              <div className="flex flex-1 flex-col p-5">
                {p.limitada && <p className="text-[0.95rem] font-bold uppercase tracking-wide" style={{ color: VINO }}>Edición limitada</p>}
                <h3 className="text-[clamp(1.35rem,1.1rem+0.8vw,1.9rem)] font-medium leading-tight" style={{ fontFamily: SERIF }}>{p.t}</h3>
                <p className="mt-3 flex items-baseline gap-3">
                  <span className="text-[clamp(1.8rem,1.4rem+1.2vw,2.5rem)] font-semibold leading-none" style={{ fontFamily: SERIF }}>{qz(p.ahora)}</span>
                  {p.antes > p.ahora && <span className="text-[1.1rem] line-through opacity-50">{qz(p.antes)}</span>}
                </p>
                <button type="button" onClick={() => agregar(`promo-${i}`, p.t, p.ahora)} className={`${boton} mt-auto w-full text-white`} style={{ background: TINTA, marginTop: 18 }}>La quiero</button>
              </div>
            </article>
          ))}
        </div>
      </Seccion>

      {/* 03 tu tono */}
      <Seccion id="tono" num="03" etiqueta="Tu tono" titulo="¿Qué tono me queda?" sub="Dos preguntas y listo." fondo="#f9cdb9">
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

      {/* 04 catálogo */}
      <Seccion id="catalogo" num="04" etiqueta="Catálogo" titulo="Mi catálogo" sub="«Entrega inmediata» es que lo tengo en mano." fondo="#ffffff">
        <div className="flex flex-wrap gap-3" role="group" aria-label="Filtrar por marca">
          {marcas.map((m) => (
            <button key={m} type="button" aria-pressed={marca === m} onClick={() => setMarca(m)} className="min-h-[3rem] rounded-full border-2 px-6 text-[1.1rem] font-semibold" style={marca === m ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(42,22,51,.3)" }}>{m}</button>
          ))}
        </div>
        <div className="pf-fill mt-8" style={{ ["--min" as string]: "13rem" }}>
          {lista.map((p: Producto) => (
            <article key={p.id} className="flex flex-col overflow-hidden rounded-2xl" style={{ background: "#fde6da" }}>
              <img src={p.foto} alt={p.nombre} className="aspect-square w-full object-cover" loading="lazy" />
              <div className="flex flex-1 flex-col p-4">
                <p className="text-[0.9rem] font-medium opacity-60">{p.marca}</p>
                <h3 className="text-[1.15rem] font-semibold leading-tight">{p.nombre}</h3>
                <p className="mt-2 text-[1.6rem] font-semibold leading-none" style={{ fontFamily: SERIF }}>{qz(p.precio)}</p>
                <p className="mt-1.5 text-[0.95rem] font-semibold"><Disponible n={stock[p.id] ?? 0} /></p>
                <button type="button" onClick={() => agregar(p.id, p.nombre, p.precio)} className={`${boton} mt-4 w-full text-white`} style={{ background: TINTA }}>Lo quiero</button>
                <button type="button" aria-expanded={uso === p.id} onClick={() => setUso(uso === p.id ? null : p.id)} className="mt-2 inline-flex min-h-[2.5rem] items-center justify-center gap-1 text-[1rem] font-semibold underline decoration-1 underline-offset-4">Cómo se usa <ChevronDown size={16} className={`transition ${uso === p.id ? "rotate-180" : ""}`} /></button>
                {uso === p.id && <ol className="mt-1 grid gap-1.5 rounded-xl bg-white p-3 text-[1rem] leading-snug">{p.uso.map((u, i) => <li key={i}><b>{i + 1}.</b> {u}</li>)}</ol>}
              </div>
            </article>
          ))}
        </div>
      </Seccion>

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
