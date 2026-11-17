/*
 * Catálogo de Sofía para sus clientas: lo que resuelve los "¿precio?", "¿hay?", "¿cómo se usa?",
 * "¿qué tono me queda?" y "¿cuánto es el envío?" que hoy le preguntan uno por uno por mensaje.
 * Lo que dice si hay o no sale de su inventario.
 */
import { useMemo, useState } from "react";
import { ChevronDown, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { MensajeWhatsApp } from "../comun";
import { CAMPANA, CONSULTORA, ENVIOS, LINEA, MARCAS, PRODUCTOS, PROMOS, SUAVE, TINTA, TONOS, VINO, producto, qz, useInventario, type Producto } from "./datos";

const SERIF = '"Fraunces", Georgia, serif';
type Linea = { key: string; nombre: string; precio: number; n: number };

function Disponible({ n }: { n: number }) {
  if (n <= 0) return <span className="opacity-70">Bajo pedido · llega en 5 días</span>;
  if (n <= 2) return <span style={{ color: VINO }}>{n === 1 ? "Queda 1" : `Quedan ${n}`} · entrega inmediata</span>;
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
    setMensaje(
      `Hola, ${CONSULTORA.corto}. Quiero hacer este pedido:\n${l.join("\n")}\n${env.precio ? `Envío (${env.nombre}): ${qz(env.precio)}` : env.nombre}\nTotal: ${qz(total)}\nPago al recibir.`,
    );
  };

  const boton = "rounded-full px-4 py-2.5 text-[1rem] font-semibold transition active:scale-[0.98]";

  return (
    <div id="catalogo" className="scroll-mt-24">
      {/* promos de la campaña */}
      <section className="mx-auto max-w-5xl px-5 pt-16 md:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[2rem] font-medium leading-tight sm:text-[2.4rem]" style={{ fontFamily: SERIF }}>
              Promos de la {CAMPANA.nombre.toLowerCase()}
            </h2>
            <p className="mt-2 text-[1.1rem] opacity-70">
              Terminan el {finTexto}. {diasPromo === 1 ? "Queda 1 día." : `Quedan ${diasPromo} días.`}
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PROMOS.map((p, i) => (
            <article key={p.t} className="flex flex-col border-t-2 bg-white p-5" style={{ borderColor: p.limitada ? VINO : TINTA }}>
              {p.limitada && (
                <p className="text-[0.95rem] font-semibold" style={{ color: VINO }}>
                  Edición limitada
                </p>
              )}
              <h3 className="text-[1.3rem] font-medium leading-tight" style={{ fontFamily: SERIF }}>{p.t}</h3>
              <p className="mt-1 text-[1rem] opacity-70">{p.d}</p>
              <div className="mt-3 flex -space-x-2">
                {p.ids.map((id) => (
                  <img key={id} src={producto(id)!.foto} alt="" className="h-12 w-12 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-[1.6rem]" style={{ fontFamily: SERIF }}>{qz(p.ahora)}</span>
                {p.antes > p.ahora && <span className="text-[1rem] line-through opacity-50">{qz(p.antes)}</span>}
              </p>
              <button type="button" onClick={() => agregar(`promo-${i}`, p.t, p.ahora)} className={`${boton} mt-auto text-white`} style={{ background: TINTA, marginTop: 16 }}>
                La quiero
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* buscador de tono */}
      <section className="mx-auto max-w-5xl px-5 pt-16 md:pt-20">
        <h2 className="text-[2rem] font-medium leading-tight sm:text-[2.4rem]" style={{ fontFamily: SERIF }}>
          ¿Qué tono me queda?
        </h2>
        <p className="mt-2 max-w-2xl text-[1.1rem] opacity-70">Dos preguntas y te digo qué tono de base y qué labial pedir. Si te queda duda, en la entrega te lo pruebo.</p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-[1.1rem] font-semibold">1. ¿Cuál se parece más a tu piel?</p>
            <div className="mt-3 grid grid-cols-5 gap-1">
              {TONOS.map((t) => (
                <button key={t.valor} type="button" aria-pressed={tono === t.valor} onClick={() => setTono(t.valor)} className="flex flex-col items-center gap-1.5 py-1">
                  <span className="h-12 w-12 rounded-full" style={{ background: t.color, boxShadow: tono === t.valor ? `0 0 0 3px #fff, 0 0 0 5px ${TINTA}` : "inset 0 0 0 1px rgba(0,0,0,.08)" }} />
                  <span className={`text-center text-[0.9rem] leading-tight ${tono === t.valor ? "font-semibold" : ""}`}>{t.valor}</span>
                </button>
              ))}
            </div>
            <p className="mt-6 text-[1.1rem] font-semibold">2. ¿De qué color se ven las venas de tu muñeca?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                ["Cálido", "Verdes"],
                ["Frío", "Azules o moradas"],
                ["Neutro", "De los dos"],
              ].map(([v, t]) => (
                <button key={v} type="button" aria-pressed={sub === v} onClick={() => setSub(v)} className="rounded-full border-2 px-4 py-2 text-[1rem] font-medium" style={sub === v ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(31,26,23,.25)" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="self-start bg-white p-5" style={{ minHeight: 180 }}>
            {sugerido ? (
              <>
                <p className="text-[1rem] opacity-60">Te recomiendo</p>
                <ul className="mt-3 grid gap-3">
                  <li className="flex items-center gap-3">
                    <img src={producto("base")!.foto} alt="" className="h-14 w-14 object-cover" />
                    <span className="min-w-0 flex-1 leading-tight">
                      <b className="block">Base líquida</b>
                      <span className="opacity-70">Tono {sugerido.base}</span>
                    </span>
                    <button type="button" onClick={() => agregar(`base-${sugerido.base}`, `Base líquida, tono ${sugerido.base}`, producto("base")!.precio)} className="shrink-0 font-semibold underline decoration-1 underline-offset-4">
                      Agregar
                    </button>
                  </li>
                  <li className="flex items-center gap-3">
                    <img src={sugerido.labial.foto} alt="" className="h-14 w-14 object-cover" />
                    <span className="min-w-0 flex-1 leading-tight">
                      <b className="block">{sugerido.labial.nombre}</b>
                      <span className="opacity-70">Le va a tu subtono</span>
                    </span>
                    <button type="button" onClick={() => agregar(sugerido.labial.id, sugerido.labial.nombre, sugerido.labial.precio)} className="shrink-0 font-semibold underline decoration-1 underline-offset-4">
                      Agregar
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <p className="text-[1.05rem] opacity-60">Contesta las dos preguntas y aquí te sale tu tono.</p>
            )}
          </div>
        </div>
      </section>

      {/* catálogo */}
      <section className="mx-auto max-w-5xl px-5 pb-16 pt-16 md:pb-20 md:pt-20">
        <h2 className="text-[2rem] font-medium leading-tight sm:text-[2.4rem]" style={{ fontFamily: SERIF }}>
          Mi catálogo
        </h2>
        <p className="mt-2 max-w-2xl text-[1.1rem] opacity-70">Con precio a la vista. Lo que dice «entrega inmediata» lo tengo en mano; lo demás lo pido y te llega en la semana.</p>
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por marca">
          {marcas.map((m) => (
            <button key={m} type="button" aria-pressed={marca === m} onClick={() => setMarca(m)} className="rounded-full border-2 px-4 py-2 text-[1rem] font-medium" style={marca === m ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(31,26,23,.25)" }}>
              {m}
            </button>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5">
          {lista.map((p: Producto) => (
            <article key={p.id} className="flex flex-col">
              <img src={p.foto} alt="" className="aspect-square w-full object-cover" loading="lazy" />
              <p className="mt-2 text-[0.88rem] opacity-55">{p.marca}</p>
              <h3 className="text-[1.05rem] font-semibold leading-tight">{p.nombre}</h3>
              <p className="mt-0.5 text-[0.95rem] opacity-65">{p.corto}</p>
              <p className="mt-1.5 text-[1.2rem]" style={{ fontFamily: SERIF }}>{qz(p.precio)}</p>
              <p className="mt-1 text-[0.9rem] font-medium">
                <Disponible n={stock[p.id] ?? 0} />
              </p>
              <button type="button" aria-expanded={uso === p.id} onClick={() => setUso(uso === p.id ? null : p.id)} className="mt-2 inline-flex items-center gap-1 self-start text-[0.95rem] font-semibold underline decoration-1 underline-offset-4">
                Cómo se usa <ChevronDown size={15} className={`transition ${uso === p.id ? "rotate-180" : ""}`} />
              </button>
              {uso === p.id && (
                <ol className="mt-2 grid gap-1.5 bg-white p-3 text-[0.95rem] leading-snug">
                  {p.uso.map((u, i) => (
                    <li key={i}>
                      <b>{i + 1}.</b> {u}
                    </li>
                  ))}
                </ol>
              )}
              <button type="button" onClick={() => agregar(p.id, p.nombre, p.precio)} className={`${boton} mt-auto border-2`} style={{ borderColor: TINTA, marginTop: 12 }}>
                Lo quiero
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* el pedido: barra fija mientras haya algo */}
      {piezas > 0 && !verPedido && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t print:hidden" style={{ borderColor: LINEA, background: "rgba(248,244,238,.97)" }}>
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
            <p className="text-[1.05rem]">
              <b>{piezas}</b> {piezas === 1 ? "producto" : "productos"} · {qz(subtotal)}
            </p>
            <button type="button" onClick={() => setVerPedido(true)} className={`${boton} inline-flex items-center gap-2 text-white`} style={{ background: VINO }}>
              <ShoppingBag size={18} /> Ver mi pedido
            </button>
          </div>
        </div>
      )}
      {verPedido && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" onClick={() => setVerPedido(false)}>
          <div role="dialog" aria-label="Tu pedido" className="max-h-[92vh] w-full overflow-y-auto p-5 sm:max-w-lg" style={{ background: "#f8f4ee" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-[1.7rem] font-medium" style={{ fontFamily: SERIF }}>Tu pedido</h2>
              <button type="button" aria-label="Cerrar" onClick={() => setVerPedido(false)} className="grid h-10 w-10 place-items-center rounded-full" style={{ background: SUAVE }}>
                <X size={20} />
              </button>
            </div>
            {bolsa.length === 0 ? (
              <p className="mt-4 opacity-60">Todavía no agregas nada.</p>
            ) : (
              <ul className="mt-4 border-t" style={{ borderColor: TINTA }}>
                {bolsa.map((l) => (
                  <li key={l.key} className="flex items-center justify-between gap-3 border-b py-3" style={{ borderColor: LINEA }}>
                    <span className="min-w-0 leading-tight">
                      <b className="block">{l.nombre}</b>
                      <span className="opacity-60">{qz(l.precio)} c/u</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1">
                      <button type="button" aria-label="Uno menos" onClick={() => cambiar(l.key, -1)} className="grid h-9 w-9 place-items-center rounded-full border-2" style={{ borderColor: "rgba(31,26,23,.25)" }}>
                        <Minus size={15} />
                      </button>
                      <span className="w-7 text-center tabular-nums">{l.n}</span>
                      <button type="button" aria-label="Uno más" onClick={() => cambiar(l.key, 1)} className="grid h-9 w-9 place-items-center rounded-full border-2" style={{ borderColor: "rgba(31,26,23,.25)" }}>
                        <Plus size={15} />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-5 font-semibold">¿A dónde te lo llevo?</p>
            <div className="mt-2 grid gap-2">
              {ENVIOS.map((e) => (
                <button key={e.id} type="button" aria-pressed={envio === e.id} onClick={() => setEnvio(e.id)} className="flex items-center justify-between gap-3 border-2 px-4 py-3 text-left" style={{ borderColor: envio === e.id ? TINTA : "rgba(31,26,23,.18)", background: envio === e.id ? "#fff" : "transparent" }}>
                  <span className="leading-tight">
                    <b className="block">{e.nombre}</b>
                    <span className="text-[0.92rem] opacity-60">{e.dias}</span>
                  </span>
                  <span className="shrink-0 tabular-nums">{e.precio ? qz(e.precio) : "Sin costo"}</span>
                </button>
              ))}
            </div>
            <dl className="mt-5 grid gap-1 text-[1.05rem]">
              <div className="flex justify-between">
                <dt className="opacity-70">Productos</dt>
                <dd className="tabular-nums">{qz(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="opacity-70">Envío</dt>
                <dd className="tabular-nums">{env.precio ? qz(env.precio) : "Sin costo"}</dd>
              </div>
              <div className="mt-1 flex justify-between border-t pt-2 text-[1.25rem] font-semibold" style={{ borderColor: TINTA }}>
                <dt>Total</dt>
                <dd style={{ fontFamily: SERIF }}>{qz(total)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-[0.95rem] opacity-60">Pagas cuando te llegue, en efectivo o transferencia.</p>
            <button type="button" disabled={!bolsa.length} onClick={pedir} className={`${boton} mt-5 w-full py-4 text-[1.15rem] text-white disabled:opacity-40`} style={{ background: VINO }}>
              Mandar mi pedido por WhatsApp
            </button>
          </div>
        </div>
      )}
      <MensajeWhatsApp mensaje={mensaje} alCerrar={() => setMensaje(null)} demo="perfil de belleza" que="cada pedido" />
    </div>
  );
}
