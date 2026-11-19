/*
 * Muestra hecha para Studio Privée (reventa de lujo, Guatemala) con sus piezas,
 * fotos y precios de Instagram, en temporada de Navidad. Lo que se aparta no se
 * envía: se enseña cómo le llegaría el mensaje a su WhatsApp.
 */
import { useEffect, useState } from "react";
import { Gift, Heart, X } from "lucide-react";
import {
  CATEGORIAS, CREMA, ORO, PIEDRA, PIEZAS, PASOS, PREGUNTAS, TINTA, VINO, formato, moneda, navidad, numero, portada,
  type Categoria, type Pieza,
} from "./datos";

const SERIF = "'Bodoni Moda', 'Didot', Georgia, serif";

const MENU: [string, string][] = [
  ["#piezas", "Piezas"],
  ["#navidad", "12 Días de Navidad"],
  ["#como", "Cómo apartar"],
  ["#consigna", "Consigna tus piezas"],
];

function useEscape(alCerrar: () => void) {
  useEffect(() => {
    const f = (ev: KeyboardEvent) => { if (ev.key === "Escape") alCerrar(); };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [alCerrar]);
}

function useDeseos() {
  const [ids, setIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("sp-deseos") || "[]"); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("sp-deseos", JSON.stringify(ids)); }, [ids]);
  const cambiar = (id: string) => setIds((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  return { ids, cambiar };
}

export default function MuestraStudioPrivee() {
  const [cat, setCat] = useState<"Todo" | Categoria>("Todo");
  const [soloRegalo, setSoloRegalo] = useState(false);
  const [ficha, setFicha] = useState<Pieza | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [verDeseos, setVerDeseos] = useState(false);
  const deseos = useDeseos();
  const lista = PIEZAS.filter((p) => (cat === "Todo" || p.categoria === cat) && (!soloRegalo || p.regalo) && (!verDeseos || deseos.ids.includes(p.id)));

  return (
    <div className="sp min-h-screen" style={{ background: CREMA, color: TINTA, fontFamily: "'Jost', system-ui, sans-serif" }}>
      <style>{`.sp h1,.sp h2,.sp h3{color:inherit} .sp .serif{font-family:${SERIF}}`}</style>

      <div className="bg-[#1c1714] px-4 py-2 text-center text-[0.85rem] text-white/85">
        Muestra hecha por <b className="text-white">Jzet Labs</b> para Studio Privée, con sus piezas y precios de Instagram.
      </div>

      {/* encabezado */}
      <header className="sticky top-0 z-20 border-b backdrop-blur" style={{ background: "rgba(246,241,234,.94)", borderColor: PIEDRA }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <a href="#inicio" className="flex items-center gap-3">
            <span className="serif grid h-11 w-11 place-items-center rounded-full border text-[1.05rem]" style={{ borderColor: ORO, color: ORO }}>SP</span>
            <span className="leading-tight">
              <span className="serif block text-[1.25rem]">Studio Privée</span>
              <span className="block text-[0.78rem]" style={{ color: "#7a6d60" }}>Lujo con historia · Guatemala</span>
            </span>
          </a>
          <nav className="hidden gap-1 md:flex">
            {MENU.map(([h, t]) => (
              <a key={h} href={h} className="rounded-full px-3 py-2 text-[0.95rem] hover:bg-black/5">{t}</a>
            ))}
          </nav>
          <button type="button" onClick={() => { setVerDeseos((v) => !v); location.hash = "piezas"; }}
            className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-[0.9rem]" style={{ borderColor: PIEDRA, background: verDeseos ? VINO : "white", color: verDeseos ? "white" : TINTA }}
            aria-pressed={verDeseos} aria-label="Mis favoritas">
            <Heart size={16} fill={verDeseos ? "white" : "none"} /> <span className="hidden sm:inline">Mis favoritas</span> ({deseos.ids.length})
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2 md:hidden">
          {MENU.map(([h, t]) => (
            <a key={h} href={h} className="shrink-0 rounded-full border bg-white px-3 py-1.5 text-[0.85rem]" style={{ borderColor: PIEDRA }}>{t}</a>
          ))}
        </nav>
      </header>

      {/* portada */}
      <section id="inicio" className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
        <div>
          <p className="text-[1rem]" style={{ color: VINO }}>Temporada de Navidad</p>
          <h1 className="serif mt-3 text-[2.6rem] leading-[1.05] md:text-[3.6rem]">Regalos con historia, a precios más accesibles</h1>
          <p className="mt-5 max-w-lg text-[1.15rem] leading-relaxed text-[#5a4f45]">
            Moda, bolsos e interiores de lujo, seleccionados uno por uno. Cada pieza es única: cuando alguien la aparta, se marca sola y ya nadie más la puede pedir.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#piezas" className="rounded-full px-6 py-3.5 text-[1.05rem] font-medium text-white" style={{ background: VINO }}>Ver las piezas</a>
            <button type="button" onClick={() => { setSoloRegalo(true); location.hash = "piezas"; }} className="flex items-center gap-2 rounded-full border bg-white px-6 py-3.5 text-[1.05rem]" style={{ borderColor: PIEDRA }}>
              <Gift size={18} /> Ideas para regalar
            </button>
          </div>
          <p className="mt-5 text-[0.95rem] text-[#7a6d60]">Apartas con el 20% · Envíos a toda Guatemala · Empaque de regalo</p>
        </div>
        <img src={PIEZAS[0].foto} alt="Vestido Wilfred de Aritzia junto a un árbol de Navidad" className="aspect-[4/5] max-h-[620px] w-full rounded-[28px] object-cover md:aspect-[4/5]" />
      </section>

      {/* piezas */}
      <section id="piezas" className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="serif text-[2rem]">{verDeseos ? "Mis favoritas" : soloRegalo ? "Ideas para regalar" : "Piezas de la semana"}</h2>
            <p className="mt-1 text-[1rem] text-[#7a6d60]">Precio original contra precio Studio Privée, como en sus publicaciones.</p>
          </div>
          {(soloRegalo || verDeseos) && (
            <button type="button" onClick={() => { setSoloRegalo(false); setVerDeseos(false); }} className="text-[0.95rem] underline">Ver todas</button>
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo">
          {CATEGORIAS.map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} aria-pressed={cat === c}
              className="rounded-full border px-4 py-2 text-[0.95rem]" style={{ borderColor: cat === c ? TINTA : PIEDRA, background: cat === c ? TINTA : "white", color: cat === c ? "white" : TINTA }}>
              {c}
            </button>
          ))}
        </div>

        {lista.length === 0 ? (
          <p className="mt-10 rounded-2xl bg-white p-8 text-center text-[1.05rem]">Todavía no guardas favoritas. Toca el corazón de una pieza para guardarla aquí.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {lista.map((p) => (
              <Tarjeta key={p.id} p={p} favorita={deseos.ids.includes(p.id)} alFavorita={() => deseos.cambiar(p.id)} alAbrir={() => setFicha(p)} />
            ))}
          </div>
        )}
      </section>

      {/* 12 días */}
      <section id="navidad" className="scroll-mt-28 text-white" style={{ background: VINO }}>
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-[1fr_1.2fr]">
          <img src={navidad} alt="Los 12 Días de Navidad de Studio Privée" className="mx-auto w-full max-w-sm rounded-2xl" />
          <div>
            <h2 className="serif text-[2.2rem] leading-tight">Los 12 Días de Navidad</h2>
            <p className="mt-3 max-w-xl text-[1.1rem] leading-relaxed text-white/85">
              Su campaña de Navidad, también en su página: cada día se destapa una sorpresa nueva y sus clientas entran a ver cuál toca hoy. Así no se pierde entre las historias.
            </p>
            <Calendario />
            <p className="mt-4 text-[0.9rem] text-white/65">Ejemplo: usted decide qué sorpresa va cada día y la página la destapa sola en su fecha.</p>
          </div>
        </div>
      </section>

      {/* cómo apartar */}
      <section id="como" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-14">
        <h2 className="serif text-[2rem]">Cómo apartar una pieza</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PASOS.map(([t, d], i) => (
            <div key={t} className="rounded-2xl border bg-white p-6" style={{ borderColor: PIEDRA }}>
              <p className="serif text-[2rem]" style={{ color: ORO }}>{i + 1}</p>
              <p className="mt-2 text-[1.2rem] font-medium">{t}</p>
              <p className="mt-2 text-[1rem] leading-relaxed text-[#5a4f45]">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* consignación */}
      <Consigna alEnviar={setMensaje} />

      {/* preguntas */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="serif text-[2rem]">Preguntas frecuentes</h2>
        <div className="mt-5 divide-y rounded-2xl border bg-white" style={{ borderColor: PIEDRA }}>
          {PREGUNTAS.map(([p, r]) => (
            <details key={p} className="group p-5">
              <summary className="cursor-pointer list-none text-[1.1rem] font-medium">{p}</summary>
              <p className="mt-3 text-[1rem] leading-relaxed text-[#5a4f45]">{r}</p>
            </details>
          ))}
        </div>
        <p className="mt-3 text-[0.9rem] text-[#7a6d60]">Respuestas de ejemplo: usted pone sus propias reglas.</p>
      </section>

      <footer className="border-t px-4 py-10 text-center text-[0.95rem] text-[#7a6d60]" style={{ borderColor: PIEDRA }}>
        <p className="serif text-[1.4rem]" style={{ color: TINTA }}>Studio Privée</p>
        <p className="mt-2">Moda e interiores de lujo vintage, cuidadosamente seleccionados.</p>
        <p className="mt-6 text-[0.85rem]">Muestra hecha por Jzet Labs. Fotos, piezas y precios tomados de las publicaciones de @studioprivee.co; los estados “Apartada” y las respuestas son de ejemplo.</p>
      </footer>

      {ficha && <Ficha p={ficha} alCerrar={() => setFicha(null)} alApartar={(m) => { setFicha(null); setMensaje(m); }} favorita={deseos.ids.includes(ficha.id)} alFavorita={() => deseos.cambiar(ficha.id)} />}
      {mensaje && <AsiLlega mensaje={mensaje} alCerrar={() => setMensaje(null)} />}
    </div>
  );
}

function Etiqueta({ estado }: { estado: Pieza["estado"] }) {
  const estilos = { Disponible: ["#e8f1e8", "#2f5d34"], Apartada: ["#f6ead0", "#7a5a12"], Vendida: ["#eee", "#666"] }[estado];
  return <span className="rounded-full px-2.5 py-1 text-[0.78rem] font-medium" style={{ background: estilos[0], color: estilos[1] }}>{estado}</span>;
}

function Tarjeta({ p, favorita, alFavorita, alAbrir }: { p: Pieza; favorita: boolean; alFavorita: () => void; alAbrir: () => void }) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: PIEDRA }}>
      <div className="relative">
        <button type="button" onClick={alAbrir} className="block w-full" aria-label={`Ver ${p.titulo}`}>
          <img src={p.foto} alt={`${p.marca}: ${p.titulo}`} loading="lazy" className={`aspect-[4/5] w-full object-cover ${p.estado !== "Disponible" ? "opacity-80" : ""}`} />
        </button>
        <button type="button" onClick={alFavorita} aria-pressed={favorita} aria-label={favorita ? "Quitar de favoritas" : "Guardar en favoritas"}
          className="absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-full bg-white/90">
          <Heart size={18} color={VINO} fill={favorita ? VINO : "none"} />
        </button>
        {p.descuento && <span className="absolute left-2 top-2 rounded-full px-2.5 py-1 text-[0.8rem] text-white" style={{ background: VINO }}>-{p.descuento}%</span>}
      </div>
      <button type="button" onClick={alAbrir} className="block w-full p-3 text-left md:p-4">
        <p className="text-[0.85rem] text-[#7a6d60]">{p.marca}</p>
        <p className="serif mt-0.5 text-[1.05rem] leading-snug md:text-[1.15rem]">{p.titulo}</p>
        <p className="mt-2 text-[0.85rem] text-[#9a8c7e] line-through">{p.original}</p>
        <p className="text-[1.1rem] font-medium" style={{ color: VINO }}>{p.sp ?? "Precio por confirmar"}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Etiqueta estado={p.estado} />
          {p.partes && <span className="text-[0.8rem] text-[#7a6d60]">{p.partes.length} piezas</span>}
        </div>
      </button>
    </article>
  );
}

function Ficha({ p, alCerrar, alApartar, favorita, alFavorita }: { p: Pieza; alCerrar: () => void; alApartar: (m: string) => void; favorita: boolean; alFavorita: () => void }) {
  useEscape(alCerrar);
  const [elegidas, setElegidas] = useState<number[]>(() => (p.partes ? p.partes.map((_, i) => i) : []));
  const [regalo, setRegalo] = useState(false);
  const [tarjeta, setTarjeta] = useState("");
  const [nombre, setNombre] = useState("");

  const partes = p.partes?.filter((_, i) => elegidas.includes(i)) ?? [];
  const m = moneda(p.sp ?? p.original);
  const conPrecio = p.partes ? partes.filter((x) => x.sp) : [];
  const total = p.partes ? conPrecio.reduce((s, x) => s + numero(x.sp!), 0) : p.sp ? numero(p.sp) : 0;
  const pendiente = p.partes ? partes.some((x) => !x.sp) : !p.sp;
  const anticipo = Math.round(total * 0.2 * 100) / 100;
  const puede = p.estado === "Disponible" && (!p.partes || partes.length > 0) && nombre.trim().length > 1;

  function apartar() {
    const lineas = [
      `Hola, soy ${nombre.trim()}. Quiero apartar:`,
      ...(p.partes ? partes.map((x) => `• ${x.marca ? x.marca + " · " : ""}${x.nombre}${x.talla ? ` (talla ${x.talla})` : ""}: ${x.sp ?? "precio por confirmar"}`) : [`• ${p.marca} · ${p.titulo}${p.talla ? ` (talla ${p.talla})` : ""}: ${p.sp}`]),
      `Total: ${formato(total, m)}${pendiente ? " + lo que esté por confirmar" : ""}`,
      `Anticipo para apartar (20%): ${formato(anticipo, m)}`,
      ...(regalo ? [`Es para regalo${tarjeta.trim() ? `. Tarjeta: “${tarjeta.trim()}”` : ""}`] : []),
    ];
    alApartar(lineas.join("\n"));
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/55 sm:items-center sm:p-4" onClick={alCerrar}>
      <div role="dialog" aria-modal="true" aria-label={p.titulo} className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl" onClick={(ev) => ev.stopPropagation()}>
        <div className="grid md:grid-cols-2">
          <div className="relative">
            <img src={p.foto} alt={`${p.marca}: ${p.titulo}`} className="aspect-[4/5] w-full object-cover md:h-full md:rounded-l-3xl" />
            <button type="button" onClick={alCerrar} aria-label="Cerrar" className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/95"><X size={20} /></button>
          </div>
          <div className="p-5 md:p-7">
            <p className="text-[0.95rem] text-[#7a6d60]">{p.marca}</p>
            <h3 className="serif mt-1 text-[1.8rem] leading-tight">{p.titulo}</h3>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-[1.5rem] font-medium" style={{ color: VINO }}>{p.sp ?? "Por confirmar"}</span>
              <span className="text-[1rem] text-[#9a8c7e] line-through">{p.original}</span>
            </div>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-[#5a4f45]">{p.descripcion}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-[0.95rem]">
              {p.talla && <div className="rounded-xl p-3" style={{ background: CREMA }}><dt className="text-[#7a6d60]">Talla</dt><dd className="font-medium">{p.talla}</dd></div>}
              {p.estadoPieza && <div className="rounded-xl p-3" style={{ background: CREMA }}><dt className="text-[#7a6d60]">Estado</dt><dd className="font-medium">{p.estadoPieza}</dd></div>}
              <div className="rounded-xl p-3" style={{ background: CREMA }}><dt className="text-[#7a6d60]">Disponibilidad</dt><dd className="mt-0.5"><Etiqueta estado={p.estado} /></dd></div>
            </dl>

            {p.partes && (
              <fieldset className="mt-5">
                <legend className="text-[1.05rem] font-medium">Llévate el look completo o solo lo que te guste</legend>
                <div className="mt-2 space-y-2">
                  {p.partes.map((x, i) => (
                    <label key={i} className="flex cursor-pointer items-start gap-3 rounded-xl border p-3" style={{ borderColor: elegidas.includes(i) ? TINTA : PIEDRA }}>
                      <input type="checkbox" className="mt-1 h-5 w-5" checked={elegidas.includes(i)} onChange={() => setElegidas((l) => (l.includes(i) ? l.filter((n) => n !== i) : [...l, i]))} />
                      <span className="flex-1">
                        <span className="block text-[0.98rem]">{x.nombre}</span>
                        <span className="block text-[0.85rem] text-[#7a6d60]">{[x.marca, x.talla && `Talla ${x.talla}`].filter(Boolean).join(" · ")}</span>
                      </span>
                      <span className="text-right">
                        <span className="block font-medium" style={{ color: VINO }}>{x.sp ?? "Por confirmar"}</span>
                        <span className="block text-[0.8rem] text-[#9a8c7e] line-through">{x.original}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {p.estado === "Disponible" ? (
              <div className="mt-5 space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-3" style={{ borderColor: regalo ? VINO : PIEDRA }}>
                  <input type="checkbox" className="h-5 w-5" checked={regalo} onChange={(e) => setRegalo(e.target.checked)} />
                  <Gift size={18} color={VINO} /> <span className="text-[1rem]">Es para regalo: va envuelta y con tarjeta</span>
                </label>
                {regalo && (
                  <label className="block text-[0.95rem]">
                    Mensaje para la tarjeta
                    <input value={tarjeta} onChange={(e) => setTarjeta(e.target.value.slice(0, 80))} placeholder="Feliz Navidad, mamá" className="mt-1 w-full rounded-xl border px-3 py-3 text-[1rem]" style={{ borderColor: PIEDRA }} />
                  </label>
                )}
                <label className="block text-[0.95rem]">
                  Tu nombre
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="given-name" placeholder="Ej. Andrea" className="mt-1 w-full rounded-xl border px-3 py-3 text-[1rem]" style={{ borderColor: PIEDRA }} />
                </label>
                <div className="rounded-xl p-4 text-[1rem]" style={{ background: CREMA }}>
                  <div className="flex justify-between"><span>Total</span><b>{formato(total, m)}{pendiente ? " + por confirmar" : ""}</b></div>
                  <div className="mt-1 flex justify-between"><span>Apartas con el 20%</span><b style={{ color: VINO }}>{formato(anticipo, m)}</b></div>
                  <p className="mt-2 text-[0.85rem] text-[#7a6d60]">Queda a tu nombre 48 horas. Pagas el resto al recibir.</p>
                </div>
                <button type="button" disabled={!puede} onClick={apartar} className="w-full rounded-full py-4 text-[1.05rem] font-medium text-white disabled:opacity-50" style={{ background: VINO }}>
                  {nombre.trim().length > 1 ? "Apartar por WhatsApp" : "Escribe tu nombre para apartar"}
                </button>
              </div>
            ) : (
              <p className="mt-5 rounded-xl p-4 text-[1rem]" style={{ background: CREMA }}>
                Esta pieza ya está apartada. Guárdala en favoritas y te avisamos si se libera.
              </p>
            )}
            <button type="button" onClick={alFavorita} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border py-3 text-[1rem]" style={{ borderColor: PIEDRA }}>
              <Heart size={17} color={VINO} fill={favorita ? VINO : "none"} /> {favorita ? "Guardada en favoritas" : "Guardar en favoritas"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Calendario() {
  const [hoy, setHoy] = useState(3);
  return (
    <div className="mt-6">
      <div className="grid grid-cols-6 gap-2" role="group" aria-label="Días de la campaña">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((d) => {
          const abierto = d <= hoy;
          return (
            <button key={d} type="button" onClick={() => setHoy(d)} aria-pressed={d === hoy}
              className="aspect-square rounded-xl border text-[1.1rem]" style={{ borderColor: "rgba(255,255,255,.3)", background: d === hoy ? ORO : abierto ? "rgba(255,255,255,.14)" : "transparent", color: "white" }}>
              <span className="serif">{d}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 rounded-xl bg-white/10 p-3 text-[1rem]">Día {hoy}: {hoy % 3 === 0 ? "sorteo de una pieza entre quienes comenten" : hoy % 2 === 0 ? "envío gratis en la capital por 24 horas" : "una pieza sorpresa con precio especial"}.</p>
    </div>
  );
}

function Consigna({ alEnviar }: { alEnviar: (m: string) => void }) {
  const [tipo, setTipo] = useState("Bolso");
  const [marca, setMarca] = useState("");
  const [precio, setPrecio] = useState("");
  const venta = Math.round(numero(precio || "0") * 0.5);
  const tuyo = Math.round(venta * 0.6);
  return (
    <section id="consigna" className="scroll-mt-28" style={{ background: PIEDRA }}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-2">
        <div>
          <h2 className="serif text-[2rem]">¿Tienes piezas que ya no usas?</h2>
          <p className="mt-3 max-w-md text-[1.1rem] leading-relaxed text-[#5a4f45]">
            Déjalas en consignación. Las fotografiamos, las publicamos y te avisamos cuando se venden. Aquí puedes calcular cuánto te tocaría.
          </p>
          <img src={portada} alt="Sillón crema de la colección de interiores" loading="lazy" className="mt-6 hidden aspect-[4/3] w-full max-w-md rounded-2xl object-cover md:block" />
        </div>
        <div className="rounded-2xl bg-white p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-[0.95rem]">Qué es
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="mt-1 w-full rounded-xl border bg-white px-3 py-3" style={{ borderColor: PIEDRA }}>
                {["Bolso", "Vestido", "Zapatos", "Joyería", "Pieza para el hogar"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="text-[0.95rem]">Marca
              <input value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Ej. Coach" className="mt-1 w-full rounded-xl border px-3 py-3" style={{ borderColor: PIEDRA }} />
            </label>
            <label className="text-[0.95rem] sm:col-span-2">Cuánto costó nueva (Q)
              <input value={precio} inputMode="numeric" onChange={(e) => setPrecio(e.target.value.replace(/[^\d]/g, "").slice(0, 7))} placeholder="Ej. 3000" className="mt-1 w-full rounded-xl border px-3 py-3" style={{ borderColor: PIEDRA }} />
            </label>
          </div>
          <div className="mt-4 rounded-xl p-4" style={{ background: CREMA }}>
            <div className="flex justify-between text-[1rem]"><span>Se vendería en unos</span><b>Q{venta.toLocaleString("es-GT")}</b></div>
            <div className="mt-1 flex justify-between text-[1.1rem]"><span>Para ti (60%)</span><b style={{ color: VINO }}>Q{tuyo.toLocaleString("es-GT")}</b></div>
            <p className="mt-2 text-[0.85rem] text-[#7a6d60]">Cálculo de ejemplo. El precio final depende del estado de la pieza.</p>
          </div>
          <button type="button" disabled={!precio} onClick={() => alEnviar(`Hola, quiero dejar en consignación:\n• ${tipo}${marca ? " " + marca : ""}\n• Costó nueva Q${Number(precio).toLocaleString("es-GT")}\n¿Les puedo mandar fotos?`)}
            className="mt-4 w-full rounded-full py-3.5 text-[1.02rem] font-medium text-white disabled:opacity-50" style={{ background: TINTA }}>
            Enviar fotos de mi pieza
          </button>
        </div>
      </div>
    </section>
  );
}

function AsiLlega({ mensaje, alCerrar }: { mensaje: string; alCerrar: () => void }) {
  useEscape(alCerrar);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" onClick={alCerrar}>
      <div role="dialog" aria-modal="true" aria-label="Así te llega el mensaje" className="w-full max-w-sm rounded-3xl bg-white p-5" onClick={(ev) => ev.stopPropagation()}>
        <p className="serif text-[1.3rem]">Así le llega el mensaje a Studio Privée</p>
        <div className="mt-3 rounded-2xl bg-[#e7ddd3] p-3">
          <p className="ml-auto w-fit max-w-[94%] whitespace-pre-line rounded-2xl rounded-br-sm bg-[#d9fdd3] px-3.5 py-2.5 text-[0.92rem]">{mensaje}</p>
        </div>
        <p className="mt-3 text-[0.85rem] text-[#6b5f55]">Es una muestra: no se envía nada. En su página real, le llega directo a su WhatsApp y la pieza se marca como apartada sola.</p>
        <button type="button" onClick={alCerrar} className="mt-4 w-full rounded-xl py-3 font-medium text-white" style={{ background: VINO }}>Entendido</button>
      </div>
    </div>
  );
}
