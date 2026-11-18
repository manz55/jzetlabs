/*
 * Demo: "Dulce Abril · pastelería por encargo" (negocio inventado, datos de ejemplo, fotos de Unsplash).
 * Lo que más les cuesta a las pastelerías: enseñar todo lo que hacen y contestar cotizaciones por mensaje.
 * Aquí la clienta ve la vitrina con fotos, escoge tamaño y sabor con el precio a la vista,
 * elige un día con cupo y aparta con la mitad. La pastelería ve en Administración qué preparar,
 * entregas, cobros y lo que queda en la vitrina.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, ChefHat, Clock, MapPin, Store, Truck, X } from "lucide-react";
import { BandaDemos, Cajon, CierreJzet, Contador, MensajeWhatsApp } from "../comun";
import {
  CHOCO, CUPO_DIA, DIAS, ENTREGAS, FRAMBUESA, HORARIOS, LECHE, LINEA, MANTEQUILLA, NATA, OCASIONES, OPINIONES, PASTELES, POSTRES, PREGUNTAS, SABORES, SERIF, TAMANOS,
  anticipacion, desde, fechaLarga, iso, masDias, ocupados, por, precio, qz, usePedidos, useVitrina,
  type Pastel, type Pedido,
} from "./datos";
import portada from "@/assets/demo-pasteleria/portada.jpg";
import decorando from "@/assets/demo-pasteleria/decorando.jpg";
import cocina from "@/assets/demo-pasteleria/cocina.jpg";

const btn = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold transition active:scale-[0.98]";

/* toldo de rayas con borde de festón, como el de una pastelería de barrio */
const ESTILOS = `
.pasteleria h1, .pasteleria h2, .pasteleria h3 { color: inherit; }
.toldo { height: 26px; background: repeating-linear-gradient(90deg, ${FRAMBUESA} 0 26px, ${NATA} 26px 52px);
  -webkit-mask: radial-gradient(13px at 13px 13px, #000 98%, transparent) 0 0/26px 26px repeat-x, linear-gradient(#000 0 0) 0 0/100% 13px no-repeat;
  mask: radial-gradient(13px at 13px 13px, #000 98%, transparent) 0 0/26px 26px repeat-x, linear-gradient(#000 0 0) 0 0/100% 13px no-repeat; }
.feston-abajo { height: 18px; background: radial-gradient(circle at 12px 0, var(--c) 12px, transparent 12.5px) 0 0/24px 18px repeat-x; }
.feston-arriba { height: 18px; background: radial-gradient(circle at 12px 18px, var(--c) 12px, transparent 12.5px) 0 0/24px 18px repeat-x; }
.tarjeta-pastel img { transition: transform .5s cubic-bezier(.2,.8,.2,1); }
.tarjeta-pastel:hover img { transform: scale(1.04); }
.etiqueta-precio { clip-path: polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%); }
.pastel-hero { display: grid; gap: 2.5rem; }
@media (min-width: 900px) { .pastel-hero { grid-template-columns: 1.05fr 1fr; align-items: center; } }
.pastel-admin { display: grid; gap: 3rem; }
@media (min-width: 1024px) { .pastel-admin { grid-template-columns: 1.55fr 1fr; } }
`;

/* ---------------- la página ---------------- */

export default function PasteleriaDemo() {
  const store = usePedidos();
  const vit = useVitrina();
  const [vista, setVista] = useState<"tienda" | "admin">(() => (location.hash === "#admin" ? "admin" : "tienda"));
  useEffect(() => {
    const cambio = () => setVista(location.hash === "#admin" ? "admin" : "tienda");
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", vista === "admin" ? "#admin" : location.pathname);
    document.title = vista === "admin" ? "Administración · Dulce Abril" : "Dulce Abril · Demo de Jzet Labs";
    window.scrollTo(0, 0);
  }, [vista]);

  return (
    <div className="pasteleria min-h-screen" style={{ background: LECHE, color: CHOCO }}>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <div className="text-white" style={{ background: "#241410" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-2 text-[0.82rem] sm:justify-between">
          <p className="hidden text-white/65 sm:block">Dos partes: la tienda que ven las clientas y la administración de la pastelería.</p>
          <div className="flex rounded-full bg-white/10 p-0.5">
            {(
              [
                ["tienda", "La tienda", Store],
                ["admin", "Administración", ChefHat],
              ] as const
            ).map(([v, t, I]) => (
              <button key={v} type="button" onClick={() => setVista(v)} aria-pressed={vista === v} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition ${vista === v ? "bg-white text-black" : "text-white/80"}`}>
                <I size={14} /> {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      {vista === "tienda" ? <Tienda store={store} quedan={vit.quedan} /> : <Administracion store={store} vit={vit} />}
      <CierreJzet demo="pastelería por encargo" />
    </div>
  );
}

function Tienda({ store, quedan }: { store: ReturnType<typeof usePedidos>; quedan: Record<string, number> }) {
  const [ocasion, setOcasion] = useState("todos");
  const [abierto, setAbierto] = useState<Pastel | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const lista = ocasion === "todos" ? PASTELES : PASTELES.filter((p) => p.ocasiones.includes(ocasion));
  const titulo = "text-[2.3rem] leading-[1.05] font-semibold sm:text-[3rem]";

  return (
    <>
      <header className="sticky top-0 z-30" style={{ background: NATA }}>
        <div className="toldo" aria-hidden />
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#inicio" className="leading-none">
            <span className="block text-[1.65rem] font-semibold" style={{ fontFamily: SERIF, color: FRAMBUESA }}>Dulce Abril</span>
            <span className="block text-[0.74rem] opacity-65">pastelería por encargo · zona 13</span>
          </a>
          <nav className="hidden gap-7 font-medium md:flex">
            <a href="#vitrina" className="hover:opacity-60">Pasteles</a>
            <a href="#hoy" className="hover:opacity-60">Para hoy</a>
            <a href="#clientas" className="hover:opacity-60">Clientas</a>
            <a href="#preguntas" className="hover:opacity-60">Preguntas</a>
          </nav>
          <a href="#vitrina" className={`${btn} !px-5 !py-2.5 text-white`} style={{ background: FRAMBUESA }}>
            Ver pasteles
          </a>
        </div>
      </header>

      {/* portada */}
      <section id="inicio" className="text-white" style={{ background: CHOCO }}>
        <div className="pastel-hero mx-auto max-w-6xl px-5 py-12 md:py-16">
          <div>
            <h1 className="text-[2.6rem] font-semibold leading-[1.05] sm:text-[3.5rem]" style={{ fontFamily: SERIF }}>
              Pasteles por encargo, hechos a mano
            </h1>
            <p className="mt-5 max-w-lg text-[1.12rem] leading-relaxed text-white/80">
              Toda nuestra vitrina con fotos y precios por tamaño. Eliges sabor y mensaje, ves qué días tenemos cupo y lo apartas con la mitad. Hacemos {CUPO_DIA} por día, desde {qz(Math.min(...PASTELES.map(desde)))}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#vitrina" className={`${btn}`} style={{ background: LECHE, color: CHOCO }}>
                Ver la vitrina <ArrowRight size={18} />
              </a>
              <button type="button" onClick={() => setMsg("Hola, Dulce Abril. Quiero cotizar un pastel como el de esta foto:\n[foto de referencia]\nPara 25 personas, el sábado.")} className={`${btn} border-2 border-white/40`}>
                Tengo mi propia idea
              </button>
            </div>
          </div>
          <div className="relative mx-auto grid w-full max-w-[480px] grid-cols-[1.4fr_1fr] gap-3">
            <img src={portada} alt="Pastel de chocolate con velas encendidas" className="row-span-2 h-full w-full rounded-[1.6rem] object-cover" style={{ aspectRatio: "3/4" }} />
            <img src={PASTELES[1].foto} alt="Pastel de fresas con crema" className="h-full w-full rounded-[1.2rem] object-cover" />
            <img src={PASTELES[6].foto} alt="Pastel con macarons" className="h-full w-full rounded-[1.2rem] object-cover" />
          </div>
        </div>
      </section>
      <div className="feston-abajo" style={{ ["--c" as string]: CHOCO }} aria-hidden />

      {/* vitrina */}
      <section id="vitrina" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-14 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className={titulo} style={{ fontFamily: SERIF }}>Nuestra vitrina</h2>
            <p className="mt-2 max-w-xl text-[1.05rem] opacity-75">Toca un pastel para ver tamaños, sabores y los días con cupo.</p>
          </div>
        </div>
        <div className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          {OCASIONES.map((o) => {
            const on = ocasion === o.id;
            return (
              <button key={o.id} type="button" onClick={() => setOcasion(o.id)} aria-pressed={on} className="shrink-0 rounded-full border-2 px-4 py-2 font-semibold transition" style={on ? { background: CHOCO, borderColor: CHOCO, color: "#fff" } : { borderColor: "rgba(58,31,23,.25)", background: NATA }}>
                {o.nombre}
              </button>
            );
          })}
        </div>
        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-3 lg:grid-cols-4">
          {lista.map((p) => (
            <button key={p.id} type="button" onClick={() => setAbierto(p)} className="tarjeta-pastel group text-left">
              <span className="relative block overflow-hidden rounded-[1.3rem]" style={{ aspectRatio: "4/5", background: NATA }}>
                <img src={p.foto} alt={p.nombre} loading="lazy" className="h-full w-full object-cover" />
                {p.marca && (
                  <span className="absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[0.78rem] font-semibold" style={{ background: MANTEQUILLA, color: CHOCO }}>
                    {p.marca}
                  </span>
                )}
                <span className="etiqueta-precio absolute bottom-2.5 right-0 py-1.5 pl-4 pr-3 text-[0.92rem] font-semibold text-white" style={{ background: FRAMBUESA }}>
                  desde {qz(desde(p))}
                </span>
              </span>
              <span className="mt-2.5 block text-[1.15rem] font-semibold leading-tight" style={{ fontFamily: SERIF }}>{p.nombre}</span>
              <span className="mt-0.5 block text-[0.9rem] opacity-65">
                {por(TAMANOS, p.tamanos[0]).porciones} a {por(TAMANOS, p.tamanos[p.tamanos.length - 1]).porciones} porciones
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* idea propia */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="grid overflow-hidden rounded-[1.8rem] sm:grid-cols-[1fr_1.3fr]" style={{ background: NATA }}>
          <img src={decorando} alt="Pastelera decorando un pastel rosa" loading="lazy" className="h-56 w-full object-cover sm:h-full" />
          <div className="p-7 sm:p-10">
            <h2 className="text-[1.9rem] font-semibold leading-tight" style={{ fontFamily: SERIF }}>¿Viste un diseño en Instagram?</h2>
            <p className="mt-3 text-[1.05rem] opacity-80">Mándanos la foto de referencia, para cuántas personas y la fecha. Te cotizamos el mismo día y te decimos si tenemos cupo.</p>
            <button type="button" onClick={() => setMsg("Hola, Dulce Abril. Quiero cotizar un pastel como el de esta foto:\n[foto de referencia]\nPara 25 personas, el sábado.")} className={`${btn} mt-6 text-white`} style={{ background: CHOCO }}>
              Mandar mi foto por WhatsApp <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* postres listos */}
      <section id="hoy" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-14 md:py-16">
        <h2 className={titulo} style={{ fontFamily: SERIF }}>Para hoy, sin encargar</h2>
        <p className="mt-2 text-[1.05rem] opacity-75">Lo que salió del horno esta mañana. Apártalo y pasas por él.</p>
        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {POSTRES.map((x) => {
            const n = quedan[x.id] ?? 0;
            return (
              <article key={x.id} className={`overflow-hidden rounded-[1.3rem] ${n ? "" : "opacity-60"}`} style={{ background: NATA }}>
                <img src={x.foto} alt={x.nombre} loading="lazy" className={`h-36 w-full object-cover sm:h-44 ${n ? "" : "grayscale"}`} />
                <div className="p-4">
                  <h3 className="text-[1.1rem] font-semibold leading-tight" style={{ fontFamily: SERIF }}>{x.nombre}</h3>
                  <p className="text-[0.9rem] opacity-65">{x.nota}</p>
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <b className="text-[1.15rem]">{qz(x.precio)}</b>
                    <span className="text-[0.88rem] font-semibold" style={{ color: n && n <= 3 ? FRAMBUESA : undefined }}>
                      {n ? (n <= 3 ? `Quedan ${n}` : "Hay hoy") : "Se acabó"}
                    </span>
                  </div>
                  {n > 0 && (
                    <button type="button" onClick={() => setMsg(`Hola, Dulce Abril. ¿Me apartan ${x.nombre.toLowerCase()} (${x.nota.toLowerCase()})? Paso hoy por la tarde.`)} className="mt-3 w-full rounded-full border-2 py-2 text-[0.95rem] font-semibold" style={{ borderColor: CHOCO }}>
                      Apartar
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* clientas */}
      <div className="feston-arriba" style={{ ["--c" as string]: FRAMBUESA }} aria-hidden />
      <section id="clientas" className="scroll-mt-28 text-white" style={{ background: FRAMBUESA }}>
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
          <h2 className={titulo} style={{ fontFamily: SERIF }}>Así llegaron a la fiesta</h2>
          <p className="mt-2 text-[1.05rem] text-white/80">Fotos que nos mandaron nuestras clientas.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {OPINIONES.map((o) => (
              <figure key={o.quien} className="overflow-hidden rounded-[1.3rem]" style={{ background: NATA, color: CHOCO }}>
                <img src={o.foto} alt={`Fiesta de ${o.quien}`} loading="lazy" className="h-52 w-full object-cover" />
                <div className="p-4">
                  <blockquote className="text-[1rem] leading-relaxed">“{o.d}”</blockquote>
                  <figcaption className="mt-3 text-[0.9rem]">
                    <b>{o.quien}</b>
                    <span className="block opacity-65">{o.que}</span>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <div className="feston-abajo" style={{ ["--c" as string]: FRAMBUESA }} aria-hidden />

      {/* preguntas y cómo pedir */}
      <section id="preguntas" className="mx-auto grid max-w-6xl scroll-mt-28 gap-10 px-5 py-14 md:grid-cols-[1fr_1.3fr] md:py-16">
        <div>
          <h2 className={titulo} style={{ fontFamily: SERIF }}>Cómo pedir</h2>
          <ol className="mt-6 grid gap-4 text-[1.05rem]">
            {["Escoge tu pastel en la vitrina.", "Elige tamaño, sabor y el mensaje.", "Escoge un día con cupo y cómo te lo llevamos.", "Apártalo con la mitad. El resto, al recibirlo."].map((t, i) => (
              <li key={t} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-semibold text-white" style={{ background: CHOCO }}>{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
          <dl className="mt-8 grid gap-4 text-[1rem]">
            {[
              [Truck, "Entregas", "En furgón refrigerado, en el horario que elijas."],
              [MapPin, "Tienda", "15 avenida 10-20, zona 13. Martes a domingo, 9:00 a 18:00."],
            ].map(([I, t, d]) => {
              const Icono = I as typeof Clock;
              return (
                <div key={t as string} className="flex gap-3">
                  <Icono size={22} className="mt-0.5 shrink-0" style={{ color: FRAMBUESA }} />
                  <div>
                    <dt className="font-semibold">{t as string}</dt>
                    <dd className="opacity-75">{d as string}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
        <div className="grid content-start gap-2">
          {PREGUNTAS.map(([q, a]) => (
            <details key={q} className="group rounded-2xl px-5 py-4" style={{ background: NATA }}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[1.08rem] font-semibold">
                {q}
                <span className="text-[1.4rem] leading-none transition group-open:rotate-45" style={{ color: FRAMBUESA }}>+</span>
              </summary>
              <p className="mt-2 text-[1rem] leading-relaxed opacity-80">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <Ficha pastel={abierto} alCerrar={() => setAbierto(null)} store={store} />
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="pastelería por encargo" que="cada pedido" />
    </>
  );
}

/* ---------------- la ficha del pastel: tamaño, sabor, día y apartar ---------------- */

function Ficha({ pastel, alCerrar, store }: { pastel: Pastel | null; alCerrar: () => void; store: ReturnType<typeof usePedidos> }) {
  const [tamano, setTamano] = useState("");
  const [sabor, setSabor] = useState("vainilla");
  const [texto, setTexto] = useState("");
  const [velas, setVelas] = useState(false);
  const [fecha, setFecha] = useState("");
  const [horario, setHorario] = useState("");
  const [entrega, setEntrega] = useState("recoger");
  const [direccion, setDireccion] = useState("");
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [listo, setListo] = useState<Pedido | null>(null);
  const [texto2, setTexto2] = useState("");
  const [verMsg, setVerMsg] = useState(false);

  // cada vez que abren otro pastel, empieza con lo que lleva en la foto
  useEffect(() => {
    if (!pastel) return;
    setTamano(pastel.tamanos[Math.min(1, pastel.tamanos.length - 1)]);
    setSabor(pastel.sabor);
    setFecha("");
    setHorario("");
    setListo(null);
  }, [pastel]);

  const dias = useMemo(() => Array.from({ length: 28 }, (_, i) => masDias(i + 1)), []);
  const minimo = tamano ? anticipacion(tamano) : 3;
  useEffect(() => {
    if (fecha && dias.findIndex((d) => iso(d) === fecha) + 1 < minimo) setFecha("");
  }, [minimo, fecha, dias]);

  const p = pastel;
  const sub = p && tamano ? precio(p, tamano, sabor, velas) : 0;
  const envio = por(ENTREGAS, entrega).precio;
  const total = sub + envio;
  const anticipo = Math.round(total / 2);
  const valido = !!(fecha && horario && nombre.trim().length > 1 && tel.replace(/\D/g, "").length === 8 && (entrega === "recoger" || direccion.trim().length > 4));
  const chip = (on: boolean) => (on ? { background: CHOCO, borderColor: CHOCO, color: "#fff" } : { borderColor: "rgba(58,31,23,.2)", background: "#fff" });
  const campo = "w-full rounded-xl border-2 border-black/15 bg-white px-4 py-3 text-[1.02rem] outline-none focus:border-black/60";

  const apartar = () => {
    if (!p || !valido) return;
    const ped: Pedido = { id: `n${Date.now()}`, pastel: p.id, tamano, sabor, texto: texto.trim(), velas, fecha, horario, entrega, direccion, nombre: nombre.trim(), tel: tel.replace(/\D/g, ""), total, anticipo, pagado: anticipo, estado: "por-hacer", nuevo: true };
    store.agregar(ped);
    setListo(ped);
    const t = por(TAMANOS, tamano);
    setVerMsg(true);
    setTexto2(
      `Pedido nuevo para Dulce Abril:\n${p.nombre}, ${t.nombre.toLowerCase()} (${t.porciones} porciones)\nSabor: ${por(SABORES, sabor).nombre}${texto.trim() ? `\nQue diga: "${texto.trim()}"` : ""}${velas ? "\nCon velas y número" : ""}\n${fechaLarga(fecha)}, ${horario}\n${por(ENTREGAS, entrega).nombre}${direccion ? `: ${direccion}` : ""}\nTotal ${qz(total)} · anticipo ${qz(anticipo)}\n${nombre.trim()}, ${tel}`,
    );
  };

  return (
    <Cajon abierto={!!pastel} alCerrar={alCerrar} fondo={NATA}>
      {p && (
        <div className="h-full overflow-y-auto" style={{ color: CHOCO }}>
          <div className="relative">
            <img src={p.foto} alt={p.nombre} className="h-72 w-full object-cover" />
            <button type="button" onClick={alCerrar} aria-label="Cerrar" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow">
              <X size={20} />
            </button>
          </div>
          {listo ? (
            <div className="p-6">
              <p className="grid h-12 w-12 place-items-center rounded-full text-white" style={{ background: "#3f7a4b" }}>
                <Check size={24} strokeWidth={3} />
              </p>
              <h3 className="mt-4 text-[1.8rem] font-semibold leading-tight" style={{ fontFamily: SERIF }}>
                ¡Listo, {listo.nombre.split(" ")[0]}! Tu pastel quedó apartado.
              </h3>
              <p className="mt-3 text-[1.05rem]">
                {p.nombre}, {por(TAMANOS, listo.tamano).porciones} porciones. {fechaLarga(listo.fecha).replace(/^./, (x) => x.toUpperCase())}, {listo.horario}.
              </p>
              <p className="mt-2 opacity-75">Total {qz(listo.total)}. Te mandamos los datos para el anticipo de {qz(listo.anticipo)}; el resto lo pagas al recibirlo.</p>
              <button type="button" onClick={() => setVerMsg(true)} className={`${btn} mt-6 w-full border-2`} style={{ borderColor: CHOCO }}>
                Ver lo que le llega a la pastelería
              </button>
              <button type="button" onClick={alCerrar} className={`${btn} mt-3 w-full text-white`} style={{ background: CHOCO }}>
                Seguir viendo pasteles
              </button>
            </div>
          ) : (
            <div className="grid gap-7 p-6 pb-36">
              <div>
                <h3 className="text-[1.9rem] font-semibold leading-tight" style={{ fontFamily: SERIF }}>{p.nombre}</h3>
                <p className="mt-2 text-[1rem] leading-relaxed opacity-80">{p.d}</p>
              </div>
              <div>
                <p className="font-semibold">Tamaño</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {p.tamanos.map((id) => {
                    const t = por(TAMANOS, id);
                    return (
                      <button key={id} type="button" onClick={() => setTamano(id)} className="rounded-xl border-2 px-3 py-2.5 text-left" style={chip(tamano === id)}>
                        <b className="block">{t.nombre}</b>
                        <span className="block text-[0.86rem] opacity-75">{t.nota}</span>
                        <span className="mt-0.5 block font-semibold">{qz(precio(p, id, sabor))}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="font-semibold">Sabor por dentro</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SABORES.map((s) => (
                    <button key={s.id} type="button" onClick={() => setSabor(s.id)} className="rounded-full border-2 px-3.5 py-1.5 text-[0.95rem] font-medium" style={chip(sabor === s.id)}>
                      {s.nombre}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">Mensaje en el pastel</p>
                <input value={texto} onChange={(e) => setTexto(e.target.value.slice(0, 26))} placeholder="Ej.: Feliz cumple, Ana (sin costo)" className={`${campo} mt-2`} />
                <label className="mt-3 flex items-center gap-2.5 text-[1rem]">
                  <input type="checkbox" checked={velas} onChange={(e) => setVelas(e.target.checked)} className="h-5 w-5" style={{ accentColor: FRAMBUESA }} />
                  Velas y número <span className="opacity-65">+Q20</span>
                </label>
              </div>
              <div>
                <p className="font-semibold">¿Para cuándo?</p>
                <p className="text-[0.9rem] opacity-65">Este tamaño se pide con {minimo} días de anticipación. Los sabores especiales ya van sumados en el precio.</p>
                <div className="mt-2 grid grid-cols-7 gap-1">
                  {dias.map((d, i) => {
                    const f = iso(d);
                    const quedan = CUPO_DIA - ocupados(store.pedidos, f);
                    const cerrado = d.getDay() === 1;
                    const off = i + 1 < minimo || cerrado || quedan <= 0;
                    return (
                      <button key={f} type="button" disabled={off} onClick={() => setFecha(f)} title={cerrado ? "Cerrado" : quedan <= 0 ? "Lleno" : `Quedan ${quedan}`} className="rounded-lg border-2 py-1.5 text-center disabled:opacity-30" style={chip(fecha === f)}>
                        <span className="block text-[0.68rem] opacity-70">{DIAS[d.getDay()]}</span>
                        <span className="block text-[1.05rem] font-semibold leading-tight">{d.getDate()}</span>
                        {!off && quedan <= 2 && <span className="block h-1.5 w-1.5 justify-self-center rounded-full mx-auto mt-0.5" style={{ background: fecha === f ? "#fff" : FRAMBUESA }} />}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-[0.82rem] opacity-65">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: FRAMBUESA }} /> quedan pocos cupos · los lunes cerramos
                </p>
                {fecha && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {HORARIOS.map((h) => (
                      <button key={h} type="button" onClick={() => setHorario(h)} className="rounded-full border-2 px-3.5 py-1.5 text-[0.95rem] font-medium" style={chip(horario === h)}>
                        {h}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold">¿Cómo te lo llevamos?</p>
                <div className="mt-2 grid gap-2">
                  {ENTREGAS.map((e) => (
                    <button key={e.id} type="button" onClick={() => setEntrega(e.id)} className="flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-2.5 text-left" style={chip(entrega === e.id)}>
                      <span>
                        <b className="block">{e.nombre}</b>
                        <span className="text-[0.86rem] opacity-75">{e.nota}</span>
                      </span>
                      <span className="shrink-0">{e.precio ? qz(e.precio) : "Sin costo"}</span>
                    </button>
                  ))}
                </div>
                {entrega !== "recoger" && <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección de entrega" className={`${campo} mt-2`} />}
                <div className="mt-2 grid gap-2">
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" autoComplete="name" className={campo} />
                  <input value={tel} onChange={(e) => setTel(e.target.value.replace(/[^\d ]/g, "").slice(0, 9))} placeholder="Tu WhatsApp (8 dígitos)" inputMode="numeric" autoComplete="tel" className={campo} />
                </div>
              </div>
            </div>
          )}
          {!listo && (
            <div className="sticky bottom-0 border-t p-4" style={{ background: NATA, borderColor: LINEA }}>
              <div className="flex items-baseline justify-between">
                <span className="opacity-70">Total{envio ? " con entrega" : ""}</span>
                <b className="text-[1.5rem]" style={{ fontFamily: SERIF }}>{qz(total)}</b>
              </div>
              <button type="button" disabled={!valido} onClick={apartar} className={`${btn} mt-2 w-full text-white disabled:opacity-45`} style={{ background: FRAMBUESA }}>
                {valido ? `Apartar con ${qz(anticipo)}` : !fecha ? "Elige el día" : !horario ? "Elige el horario" : "Pon tu nombre y WhatsApp"}
              </button>
            </div>
          )}
        </div>
      )}
      <MensajeWhatsApp mensaje={listo && verMsg ? texto2 : null} alCerrar={() => setVerMsg(false)} demo="pastelería por encargo" que="cada pedido" />
    </Cajon>
  );
}

/* ---------------- administración: pedidos, cocina y cobros ---------------- */

function Administracion({ store, vit }: { store: ReturnType<typeof usePedidos>; vit: ReturnType<typeof useVitrina> }) {
  const { pedidos, cambiar } = store;
  const hoy = iso(masDias(0));
  const semana = Array.from({ length: 7 }, (_, i) => iso(masDias(i)));
  const enSemana = pedidos.filter((x) => semana.includes(x.fecha));
  const cobrado = pedidos.reduce((t, x) => t + x.pagado, 0);
  const porCobrar = pedidos.reduce((t, x) => t + (x.total - x.pagado), 0);
  const proximos = pedidos.filter((x) => x.fecha >= hoy && x.fecha <= iso(masDias(2)) && x.estado === "por-hacer");
  const preparar = SABORES.map((s) => {
    const de = proximos.filter((x) => x.sabor === s.id);
    return { s, n: de.length, porciones: de.reduce((t, x) => t + por(TAMANOS, x.tamano).porciones, 0) };
  }).filter((x) => x.n);
  const ranking = PASTELES.map((p) => ({ p, n: pedidos.filter((x) => x.pastel === p.id).length }))
    .filter((x) => x.n)
    .sort((a, b) => b.n - a.n)
    .slice(0, 4);
  const h2 = "text-[1.7rem] font-semibold leading-tight";
  const caja = { background: NATA };

  return (
    <div className="pb-16">
      <div className="relative h-44 overflow-hidden sm:h-56">
        <img src={cocina} alt="Pastelero decorando en la cocina" className="h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(36,20,16,.88), rgba(36,20,16,.35))" }} />
        <div className="absolute inset-0 mx-auto flex max-w-6xl flex-col justify-end px-5 pb-6 text-white">
          <p className="text-white/75">{fechaLarga(hoy).replace(/^./, (x) => x.toUpperCase())}</p>
          <h1 className="text-[2.6rem] font-semibold leading-none sm:text-[3rem]" style={{ fontFamily: SERIF }}>Administración</h1>
          <p className="mt-1 text-white/80">Pedidos, cocina y cobros de Dulce Abril</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5">
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [String(enSemana.length), "pasteles esta semana", CalendarDays],
            [String(pedidos.filter((x) => x.fecha === hoy).length), "salen hoy", Truck],
            [qz(cobrado), "cobrado en anticipos y pagos", Check],
            [qz(porCobrar), "falta cobrar al entregar", Clock],
          ].map(([n, t, I]) => {
            const Icono = I as typeof Clock;
            return (
              <div key={t as string} className="rounded-2xl p-4" style={caja}>
                <Icono size={18} style={{ color: FRAMBUESA }} />
                <p className="mt-2 text-[1.9rem] font-semibold leading-none" style={{ fontFamily: SERIF }}>{n as string}</p>
                <p className="mt-1.5 text-[0.92rem] opacity-65">{t as string}</p>
              </div>
            );
          })}
        </div>

        <div className="pastel-admin mt-10">
          <section className="min-w-0">
            <h2 className={h2} style={{ fontFamily: SERIF }}>Los próximos 7 días</h2>
            <div className="mt-4 grid gap-6">
              {semana.map((f) => {
                const del = pedidos.filter((x) => x.fecha === f).sort((a, b) => a.horario.localeCompare(b.horario));
                const usados = Math.min(ocupados(pedidos, f), CUPO_DIA);
                const cerrado = new Date(f + "T00:00").getDay() === 1;
                return (
                  <div key={f} className="rounded-2xl p-4" style={caja}>
                    <div className="flex items-center justify-between gap-3">
                      <b className="text-[1.08rem]">{f === hoy ? "Hoy" : fechaLarga(f).replace(/^./, (x) => x.toUpperCase())}</b>
                      {cerrado ? (
                        <span className="text-[0.9rem] opacity-60">Cerrado</span>
                      ) : (
                        <span className="flex items-center gap-2 text-[0.88rem] opacity-75">
                          <span className="flex gap-0.5">
                            {Array.from({ length: CUPO_DIA }, (_, i) => (
                              <span key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: i < usados ? FRAMBUESA : "rgba(58,31,23,.15)" }} />
                            ))}
                          </span>
                          {usados} de {CUPO_DIA}
                        </span>
                      )}
                    </div>
                    {del.length === 0 ? (
                      <p className="pt-2 text-[0.92rem] opacity-55">{cerrado ? "Día de descanso." : "Sin pedidos en línea (los de teléfono cuentan en el cupo)."}</p>
                    ) : (
                      <ul className="mt-2">
                        {del.map((x) => {
                          const pa = por(PASTELES, x.pastel);
                          const t = por(TAMANOS, x.tamano);
                          const saldo = x.total - x.pagado;
                          return (
                            <li key={x.id} className="grid grid-cols-[4rem_1fr] gap-3 border-t py-3 sm:grid-cols-[4rem_1fr_auto] sm:items-center" style={{ borderColor: LINEA }}>
                              <img src={pa.foto} alt={pa.nombre} className="h-16 w-16 rounded-xl object-cover" />
                              <div className="min-w-0">
                                <p className="font-semibold">
                                  {x.nombre} {x.nuevo && <span className="ml-1 rounded-full px-2 py-0.5 text-[0.72rem] text-white" style={{ background: FRAMBUESA }}>pidió en línea</span>}
                                </p>
                                <p className="text-[0.93rem] opacity-80">
                                  {pa.nombre} · {t.porciones} porciones · {por(SABORES, x.sabor).nombre}
                                  {x.texto ? ` · “${x.texto}”` : ""}
                                  {x.velas ? " · velas" : ""}
                                </p>
                                <p className="text-[0.88rem] opacity-60">
                                  {x.horario} · {por(ENTREGAS, x.entrega).nombre}
                                  {x.direccion ? `: ${x.direccion}` : ""} · {saldo > 0 ? `falta ${qz(saldo)}` : "pagado"}
                                </p>
                              </div>
                              <div className="col-span-2 flex flex-wrap gap-2 sm:col-span-1">
                                {x.estado === "por-hacer" && (
                                  <button type="button" onClick={() => cambiar(x.id, { estado: "listo" })} className="rounded-full border-2 px-3.5 py-1.5 text-[0.92rem] font-semibold" style={{ borderColor: CHOCO }}>
                                    Ya está listo
                                  </button>
                                )}
                                {x.estado === "listo" && (
                                  <button type="button" onClick={() => cambiar(x.id, { estado: "entregado", pagado: x.total })} className="rounded-full px-3.5 py-1.5 text-[0.92rem] font-semibold text-white" style={{ background: FRAMBUESA }}>
                                    Entregado y pagado
                                  </button>
                                )}
                                {x.estado === "entregado" && (
                                  <span className="inline-flex items-center gap-1 text-[0.92rem] font-semibold" style={{ color: "#3f7a4b" }}>
                                    <Check size={16} /> Entregado
                                  </span>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="grid min-w-0 content-start gap-10">
            <section>
              <h2 className={h2} style={{ fontFamily: SERIF }}>Qué preparar (3 días)</h2>
              <p className="mt-1 text-[0.95rem] opacity-60">Los pasteles por hacer de hoy a pasado mañana, por sabor.</p>
              <ul className="mt-3 rounded-2xl px-4" style={caja}>
                {preparar.map(({ s, n, porciones }, i) => (
                  <li key={s.id} className={`flex items-baseline justify-between gap-3 py-3 ${i ? "border-t" : ""}`} style={{ borderColor: LINEA }}>
                    <b>{s.nombre}</b>
                    <span className="shrink-0 opacity-75">
                      {n} · {porciones} porc.
                    </span>
                  </li>
                ))}
                {preparar.length === 0 && <li className="py-3 opacity-60">Nada pendiente.</li>}
              </ul>
            </section>
            <section>
              <h2 className={h2} style={{ fontFamily: SERIF }}>Vitrina de hoy</h2>
              <p className="mt-1 text-[0.95rem] opacity-60">Lo que cambies aquí se ve al instante en la tienda.</p>
              <ul className="mt-3 rounded-2xl px-4" style={caja}>
                {POSTRES.map((x, i) => (
                  <li key={x.id} className={`flex items-center gap-3 py-3 ${i ? "border-t" : ""}`} style={{ borderColor: LINEA }}>
                    <img src={x.foto} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1 leading-tight">
                      <b className="block text-[0.95rem]">{x.nombre}</b>
                      <span className="text-[0.85rem]" style={{ color: vit.quedan[x.id] ? undefined : FRAMBUESA }}>{vit.quedan[x.id] ? `quedan ${vit.quedan[x.id]}` : "agotado"}</span>
                    </span>
                    <Contador valor={vit.quedan[x.id] ?? 0} alCambiar={(n) => vit.poner(x.id, n)} />
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className={h2} style={{ fontFamily: SERIF }}>Lo que más piden</h2>
              <ul className="mt-3 grid grid-cols-2 gap-3">
                {ranking.map(({ p, n }) => (
                  <li key={p.id} className="overflow-hidden rounded-2xl" style={caja}>
                    <img src={p.foto} alt={p.nombre} className="h-24 w-full object-cover" />
                    <p className="px-3 pb-3 pt-2 text-[0.92rem] leading-tight">
                      <b className="block">{p.nombre}</b>
                      <span className="opacity-65">{n} {n === 1 ? "pedido" : "pedidos"}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className={h2} style={{ fontFamily: SERIF }}>Entregas de hoy</h2>
              <ul className="mt-3 rounded-2xl px-4" style={caja}>
                {pedidos
                  .filter((x) => x.fecha === hoy && x.entrega !== "recoger")
                  .map((x, i) => (
                    <li key={x.id} className={`py-3 ${i ? "border-t" : ""}`} style={{ borderColor: LINEA }}>
                      <b className="block">{x.horario}</b>
                      <span className="text-[0.93rem] opacity-75">
                        {x.nombre} · {x.direccion}
                      </span>
                    </li>
                  ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
