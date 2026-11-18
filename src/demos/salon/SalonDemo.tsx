/*
 * Demo: "Lirio Salón · uñas y spa" (negocio inventado, datos de ejemplo).
 * Para salones con varias sucursales que hoy agendan por WhatsApp, un número por sucursal.
 * La clienta agenda sola (sucursal, servicio, con quién, día y hora) y el salón ve su agenda del día,
 * los recordatorios de mañana y a quién ya le toca retoque.
 * Fotos libres de Unsplash ya usadas en otras demos.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarCheck, Check, Clock, LayoutDashboard, MapPin, MessageCircle, Phone, Scissors } from "lucide-react";
import fotoEstudio from "@/assets/demo-cosmeticos/estudio.jpg";
import fotoSpa from "@/assets/demo-fundadora/salon.jpg";
import fotoMaquillaje from "@/assets/demo-cosmeticos/maquillista.jpg";
import fotoPestanas from "@/assets/demo-cosmeticos/delineado.jpg";
import { BandaDemos, CierreJzet, MensajeWhatsApp, qz } from "../comun";
import {
  CATEGORIAS, CREMA, DIAS, ESTILISTAS, LINEA, OPINIONES, SALVIA, SALVIA_SUAVE, SERIF, SERVICIOS, SUCURSALES, TINTA,
  aMin, estilista, fechaLarga, hora12, horasLibres, hoyIso, iso, masDias, puede, servicio, sucursal, useCitas,
  type Categoria, type Cita,
} from "./datos";

type Vista = "salon" | "panel";
const FOTO_CAT: Partial<Record<Categoria, string>> = { Cabello: fotoEstudio, Spa: fotoSpa, Maquillaje: fotoMaquillaje, "Pestañas y cejas": fotoPestanas };
const btn = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold transition active:scale-[0.98]";

export default function SalonDemo() {
  const store = useCitas();
  const [vista, setVista] = useState<Vista>(() => (location.hash === "#panel" ? "panel" : "salon"));
  useEffect(() => {
    const cambio = () => setVista(location.hash === "#panel" ? "panel" : "salon");
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", vista === "panel" ? "#panel" : location.pathname);
    document.title = vista === "panel" ? "Agenda del salón · Lirio" : "Lirio Salón · Demo de Jzet Labs";
    window.scrollTo(0, 0);
  }, [vista]);

  return (
    <div className="min-h-screen" style={{ background: CREMA, color: TINTA }}>
      <BandaDemos />
      <div className="text-white" style={{ background: "#2b2622" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-2 text-[0.82rem] sm:justify-between">
          <p className="hidden text-white/65 sm:block">Dos partes: donde la clienta agenda sola y la agenda que ve el salón.</p>
          <div className="flex rounded-full bg-white/10 p-0.5">
            {(
              [
                ["salon", "Página del salón", Scissors],
                ["panel", "Agenda del salón", LayoutDashboard],
              ] as const
            ).map(([v, t, I]) => (
              <button key={v} type="button" onClick={() => setVista(v)} aria-pressed={vista === v} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition ${vista === v ? "bg-white text-black" : "text-white/80"}`}>
                <I size={14} /> {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      {vista === "salon" ? <Pagina store={store} /> : <Panel store={store} />}
      <CierreJzet demo="salón de belleza" />
    </div>
  );
}

/* ---------------- página para las clientas ---------------- */

function Pagina({ store }: { store: ReturnType<typeof useCitas> }) {
  const [cat, setCat] = useState<Categoria>("Cabello");
  const [pre, setPre] = useState<{ servicio?: string; n: number }>({ n: 0 });
  const ir = (servicioId?: string) => {
    setPre((p) => ({ servicio: servicioId, n: p.n + 1 }));
    document.getElementById("agendar")?.scrollIntoView({ behavior: "smooth" });
  };
  const ahora = new Date();
  const abiertas = SUCURSALES.filter((s) => (ahora.getDay() !== 0 || s.domingo) && ahora.getHours() >= s.abre && ahora.getHours() < s.cierra);

  return (
    <>
      <header className="sticky top-0 z-30 border-b backdrop-blur" style={{ borderColor: LINEA, background: "rgba(229,236,221,.94)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#inicio" className="leading-none">
            <span className="block text-[1.7rem]" style={{ fontFamily: SERIF }}>Lirio</span>
            <span className="block text-[0.7rem] tracking-[0.2em] opacity-60">SALÓN · UÑAS · SPA</span>
          </a>
          <nav className="hidden gap-7 text-[0.95rem] md:flex">
            <a href="#servicios" className="hover:opacity-60">Servicios</a>
            <a href="#novias" className="hover:opacity-60">Novias</a>
            <a href="#equipo" className="hover:opacity-60">Equipo</a>
            <a href="#sucursales" className="hover:opacity-60">Sucursales</a>
          </nav>
          <button type="button" onClick={() => ir()} className={`${btn} !px-5 !py-2.5 text-white`} style={{ background: TINTA }}>
            Agendar
          </button>
        </div>
      </header>

      {/* portada */}
      <section id="inicio" className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.05fr_1fr] md:items-center md:py-20">
        <div>
          <p className="text-[0.95rem] font-semibold" style={{ color: SALVIA }}>3 sucursales en la ciudad</p>
          <h1 className="mt-3 text-[2.9rem] leading-[1.02] sm:text-[4rem]" style={{ fontFamily: SERIF }}>
            Tu cita en un minuto, sin esperar a que te contesten.
          </h1>
          <p className="mt-5 max-w-lg text-[1.12rem] leading-relaxed opacity-75">
            Elige sucursal, servicio y con quién. Ves las horas libres de verdad, apartas la tuya y te recordamos un día antes por WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => ir()} className={`${btn} text-white`} style={{ background: TINTA }}>
              Agendar mi cita <ArrowRight size={18} />
            </button>
            <a href="#servicios" className={`${btn} border-2`} style={{ borderColor: TINTA }}>
              Ver precios
            </a>
          </div>
          <p className="mt-6 flex items-center gap-2 text-[0.98rem]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: abiertas.length ? "#3f8a4f" : "#b9a796" }} />
            {abiertas.length ? `Abierto ahora: ${abiertas.map((s) => s.nombre).join(", ")}` : "Ahora estamos cerrados, pero puedes agendar para mañana."}
          </p>
        </div>
        <div className="relative">
          <img src={fotoEstudio} alt="Estilista peinando a una clienta en el salón" className="aspect-[4/5] w-full object-cover" style={{ borderRadius: "999px 999px 1.25rem 1.25rem" }} />
          <div className="absolute -left-3 bottom-6 bg-white p-4 shadow-[0_18px_40px_-24px_rgba(0,0,0,.6)] sm:-left-8">
            <p className="text-[0.85rem] opacity-60">Próxima hora libre</p>
            <p className="text-[1.25rem]" style={{ fontFamily: SERIF }}>Hoy, con Lucía</p>
            <p className="text-[0.95rem]">Manicure en gel · {qz(160)}</p>
          </div>
        </div>
      </section>

      {/* servicios */}
      <section id="servicios" className="scroll-mt-20 border-t" style={{ borderColor: LINEA }}>
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h2 className="text-[2.3rem] leading-tight sm:text-[2.9rem]" style={{ fontFamily: SERIF }}>Servicios y precios</h2>
          <p className="mt-2 max-w-2xl text-[1.08rem] opacity-70">Con lo que dura cada uno, para que sepas cuánto tiempo apartar. El precio es «desde»: te lo confirmamos antes de empezar.</p>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist">
            {CATEGORIAS.map((c) => (
              <button key={c} type="button" role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className="shrink-0 rounded-full border-2 px-4 py-2 font-medium" style={cat === c ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(22,38,27,.2)" }}>
                {c}
              </button>
            ))}
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1.3fr]">
            {FOTO_CAT[cat] ? <img src={FOTO_CAT[cat]} alt="" className="aspect-[4/3] w-full object-cover md:aspect-[4/5]" /> : <div className="grid aspect-[4/3] place-items-center md:aspect-[4/5]" style={{ background: SALVIA_SUAVE }}><span className="text-[3rem]" style={{ fontFamily: SERIF, color: SALVIA }}>{cat}</span></div>}
            <ul className="border-t" style={{ borderColor: TINTA }}>
              {SERVICIOS.filter((s) => s.cat === cat).map((s) => (
                <li key={s.id} className="grid gap-2 border-b py-5 sm:grid-cols-[1fr_auto] sm:items-center" style={{ borderColor: LINEA }}>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <h3 className="text-[1.35rem]" style={{ fontFamily: SERIF }}>{s.nombre}</h3>
                      <span className="text-[0.95rem] opacity-60">
                        <Clock size={14} className="mr-1 inline" />
                        {s.dura >= 60 ? `${Math.floor(s.dura / 60)} h${s.dura % 60 ? ` ${s.dura % 60} min` : ""}` : `${s.dura} min`}
                      </span>
                    </div>
                    <p className="mt-1 text-[0.98rem] opacity-70">{s.nota}</p>
                  </div>
                  <div className="flex items-center gap-4 sm:justify-end">
                    <span className="text-[1.15rem] font-semibold">desde {qz(s.precio)}</span>
                    <button type="button" onClick={() => ir(s.id)} className="rounded-full border-2 px-4 py-2 font-semibold" style={{ borderColor: TINTA }}>
                      Agendar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Agendar store={store} pre={pre} />

      {/* novias */}
      <section id="novias" className="scroll-mt-20 text-white" style={{ background: SALVIA }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:py-20">
          <img src={fotoMaquillaje} alt="Maquilladora preparando a una novia" className="aspect-[4/3] w-full object-cover" loading="lazy" />
          <div>
            <h2 className="text-[2.3rem] leading-tight !text-white sm:text-[2.9rem]" style={{ fontFamily: SERIF }}>Novias y quinceañeras</h2>
            <p className="mt-3 text-[1.08rem] leading-relaxed text-white/80">Hacemos una prueba antes del día para que no haya sorpresas. El día de tu evento vamos a donde te estés arreglando, con todo tu cortejo.</p>
            <ul className="mt-6 grid gap-2 text-[1.05rem]">
              {["Prueba de maquillaje y peinado", "Maquillaje y peinado el día del evento", "Retoque para la fiesta", "Mamá, damas y cortejo con 15% menos"].map((t) => (
                <li key={t} className="flex gap-2">
                  <Check size={19} className="mt-0.5 shrink-0" /> {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[1.6rem]" style={{ fontFamily: SERIF }}>Paquete desde {qz(1800)}</p>
            <p className="text-[0.95rem] text-white/70">Apartas tu fecha con Q500 de anticipo.</p>
          </div>
        </div>
      </section>

      {/* equipo */}
      <section id="equipo" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:py-20">
        <h2 className="text-[2.3rem] leading-tight sm:text-[2.9rem]" style={{ fontFamily: SERIF }}>Nuestro equipo</h2>
        <p className="mt-2 text-[1.08rem] opacity-70">Puedes agendar con quien ya te conoce, o con quien esté libre.</p>
        <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {ESTILISTAS.map((e) => (
            <li key={e.id}>
              <span className="grid h-16 w-16 place-items-center rounded-full text-[1.5rem] text-white" style={{ background: TINTA, fontFamily: SERIF }}>{e.nombre[0]}</span>
              <p className="mt-3 text-[1.25rem]" style={{ fontFamily: SERIF }}>{e.nombre}</p>
              <p className="text-[0.95rem] opacity-70">{e.hace.join(", ")}</p>
              <p className="text-[0.9rem] opacity-50">
                {sucursal(e.suc).nombre} · {e.anios} años
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* opiniones */}
      <section className="border-t" style={{ borderColor: LINEA }}>
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-3 md:py-20">
          {OPINIONES.map((o) => (
            <figure key={o.quien} className="border-t-2 pt-4" style={{ borderColor: TINTA }}>
              <blockquote className="text-[1.12rem] leading-relaxed">“{o.d}”</blockquote>
              <figcaption className="mt-3 text-[0.95rem] opacity-60">{o.quien}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* sucursales */}
      <section id="sucursales" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h2 className="text-[2.3rem] leading-tight sm:text-[2.9rem]" style={{ fontFamily: SERIF }}>Sucursales</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {SUCURSALES.map((s) => (
              <article key={s.id} className="border-t-2 pt-4" style={{ borderColor: TINTA }}>
                <h3 className="text-[1.5rem]" style={{ fontFamily: SERIF }}>{s.nombre}</h3>
                <p className="mt-2 flex gap-2 opacity-80">
                  <MapPin size={18} className="mt-0.5 shrink-0" /> {s.dir}
                </p>
                <p className="mt-1 flex gap-2 opacity-80">
                  <Clock size={18} className="mt-0.5 shrink-0" /> {s.horario}
                </p>
                <p className="mt-1 flex gap-2 opacity-80">
                  <Phone size={18} className="mt-0.5 shrink-0" /> {s.tel}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------- agendar: sucursal, servicio, con quién, día, hora, datos ---------------- */

function Agendar({ store, pre }: { store: ReturnType<typeof useCitas>; pre: { servicio?: string; n: number } }) {
  const [suc, setSuc] = useState("");
  const [srv, setSrv] = useState("");
  const [est, setEst] = useState<string | null>(null); // "" = con quien esté libre
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [lista, setLista] = useState<Cita | null>(null);
  const [texto, setTexto] = useState("");
  const [verMsg, setVerMsg] = useState(false);

  useEffect(() => {
    if (!pre.n) return;
    setLista(null);
    setSrv(pre.servicio ?? "");
    setEst(null);
    setFecha("");
    setHora("");
  }, [pre]);

  const s = srv ? servicio(srv) : null;
  const quienes = useMemo(() => (srv && suc ? ESTILISTAS.filter((e) => e.suc === suc && puede(e, servicio(srv))) : []), [srv, suc]);
  const dias = useMemo(() => Array.from({ length: 10 }, (_, i) => masDias(i)), []);
  const horas = useMemo(() => {
    if (!s || !fecha || est === null) return [] as { h: string; e: string }[];
    const candidatas = est ? [estilista(est)] : quienes;
    const mapa = new Map<string, string>();
    candidatas.forEach((e) => horasLibres(store.citas, e, s, fecha).forEach((h) => !mapa.has(h) && mapa.set(h, e.id)));
    return [...mapa.entries()].sort((a, b) => aMin(a[0]) - aMin(b[0])).map(([h, e]) => ({ h, e }));
  }, [s, fecha, est, quienes, store.citas]);

  const paso = !suc ? 0 : !s ? 1 : est === null ? 2 : !fecha ? 3 : !hora ? 4 : 5;
  const valido = nombre.trim().length > 1 && tel.replace(/\D/g, "").length === 8;
  const reiniciar = () => {
    setLista(null);
    setSuc("");
    setSrv("");
    setEst(null);
    setFecha("");
    setHora("");
  };

  const confirmar = () => {
    if (!s || !valido) return;
    const quien = horas.find((x) => x.h === hora)?.e ?? est ?? quienes[0].id;
    const c: Cita = { id: `n${Date.now()}`, suc, servicio: s.id, estilista: quien, fecha, hora, nombre: nombre.trim(), tel: tel.replace(/\D/g, ""), estado: "confirmada", nueva: true };
    store.agregar(c);
    setLista(c);
    setVerMsg(true);
    setTexto(`Nueva cita en Lirio ${sucursal(suc).nombre}:\n${s.nombre} con ${estilista(quien).nombre}\n${fechaLarga(fecha)}, ${hora12(hora)}\nClienta: ${c.nombre}, ${tel}\nSe le recuerda por WhatsApp un día antes.`);
  };

  const elegido = (on: boolean) => (on ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(22,38,27,.2)", background: "#fff" });
  const Paso = ({ n, t, valor, alCambiar }: { n: number; t: string; valor?: string; alCambiar?: () => void }) => (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t pt-4" style={{ borderColor: LINEA }}>
      <p className="shrink-0 text-[1.15rem] font-semibold">
        <span className="mr-2 opacity-40">{n}.</span>
        {t}
      </p>
      {valor && alCambiar && (
        <button type="button" onClick={alCambiar} className="ml-auto text-right text-[0.98rem] underline decoration-1 underline-offset-4">
          {valor} · cambiar
        </button>
      )}
    </div>
  );

  return (
    <section id="agendar" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="flex items-center gap-3 text-[2.3rem] leading-tight sm:text-[2.9rem]" style={{ fontFamily: SERIF }}>
          <CalendarCheck size={34} strokeWidth={1.5} /> Agenda tu cita
        </h2>
        {lista ? (
          <div className="mt-8 border-l-4 p-6" style={{ borderColor: SALVIA, background: SALVIA_SUAVE }}>
            <p className="text-[1.6rem]" style={{ fontFamily: SERIF }}>¡Listo, {lista.nombre.split(" ")[0]}! Tu cita quedó apartada.</p>
            <p className="mt-3 text-[1.08rem]">
              {servicio(lista.servicio).nombre} con {estilista(lista.estilista).nombre} en {sucursal(lista.suc).nombre}
              <br />
              {fechaLarga(lista.fecha)}, {hora12(lista.hora)}
            </p>
            <p className="mt-3 opacity-75">Te escribimos un día antes por WhatsApp para recordarte. Si no puedes venir, contesta el mensaje y la cambiamos.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={() => setVerMsg(true)} className={`${btn} border-2`} style={{ borderColor: TINTA }}>
                Ver lo que le llega al salón
              </button>
              <button type="button" onClick={reiniciar} className={`${btn} text-white`} style={{ background: TINTA }}>
                Agendar otra cita
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6">
            <div>
              <Paso n={1} t="¿En qué sucursal?" valor={suc ? sucursal(suc).nombre : undefined} alCambiar={() => { setSuc(""); setEst(null); setFecha(""); setHora(""); }} />
              {!suc && (
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {SUCURSALES.map((x) => (
                    <button key={x.id} type="button" onClick={() => setSuc(x.id)} className="border-2 p-4 text-left" style={elegido(false)}>
                      <b className="block text-[1.1rem]">{x.nombre}</b>
                      <span className="text-[0.92rem] opacity-65">{x.horario}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {paso >= 1 && (
              <div>
                <Paso n={2} t="¿Qué te vas a hacer?" valor={s ? `${s.nombre}, ${qz(s.precio)}` : undefined} alCambiar={() => { setSrv(""); setEst(null); setFecha(""); setHora(""); }} />
                {!s && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {SERVICIOS.map((x) => (
                      <button key={x.id} type="button" onClick={() => setSrv(x.id)} className="flex items-baseline justify-between gap-3 border-2 px-4 py-3 text-left" style={elegido(false)}>
                        <span>
                          <b className="block">{x.nombre}</b>
                          <span className="text-[0.88rem] opacity-60">{x.cat} · {x.dura} min</span>
                        </span>
                        <span className="shrink-0">{qz(x.precio)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {paso >= 2 && s && (
              <div>
                <Paso n={3} t="¿Con quién?" valor={est === null ? undefined : est ? estilista(est).nombre : "Con quien esté libre"} alCambiar={() => { setEst(null); setFecha(""); setHora(""); }} />
                {est === null && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => setEst("")} className="rounded-full border-2 px-4 py-2.5 font-medium" style={elegido(false)}>
                      Con quien esté libre
                    </button>
                    {quienes.map((e) => (
                      <button key={e.id} type="button" onClick={() => setEst(e.id)} className="rounded-full border-2 px-4 py-2.5 font-medium" style={elegido(false)}>
                        {e.nombre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {paso >= 3 && (
              <div>
                <Paso n={4} t="¿Qué día?" valor={fecha ? fechaLarga(fecha) : undefined} alCambiar={() => { setFecha(""); setHora(""); }} />
                {!fecha && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                    {dias.map((d) => {
                      const cerrado = d.getDay() === 0 && !sucursal(suc).domingo;
                      return (
                        <button key={iso(d)} type="button" disabled={cerrado} onClick={() => setFecha(iso(d))} className="w-[4.6rem] shrink-0 border-2 py-3 text-center disabled:opacity-35" style={elegido(false)}>
                          <span className="block text-[0.85rem] opacity-60">{iso(d) === hoyIso() ? "Hoy" : DIAS[d.getDay()]}</span>
                          <span className="block text-[1.4rem]" style={{ fontFamily: SERIF }}>{d.getDate()}</span>
                          {cerrado && <span className="block text-[0.7rem]">cerrado</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            {paso >= 4 && (
              <div>
                <Paso n={5} t="¿A qué hora?" valor={hora ? hora12(hora) : undefined} alCambiar={() => setHora("")} />
                {!hora &&
                  (horas.length ? (
                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {horas.map(({ h }) => (
                        <button key={h} type="button" onClick={() => setHora(h)} className="border-2 py-2.5 font-medium" style={elegido(false)}>
                          {hora12(h)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 opacity-70">Ese día ya no hay horas libres. Prueba otro día o con otra persona.</p>
                  ))}
              </div>
            )}
            {paso >= 5 && s && (
              <div>
                <Paso n={6} t="Tus datos" />
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" autoComplete="name" className="rounded-md border-2 border-black/20 bg-white px-4 py-3 text-[1.08rem] outline-none focus:border-black/70" />
                  <input value={tel} onChange={(e) => setTel(e.target.value.replace(/[^\d ]/g, "").slice(0, 9))} placeholder="Tu WhatsApp" inputMode="numeric" autoComplete="tel" className="rounded-md border-2 border-black/20 bg-white px-4 py-3 text-[1.08rem] outline-none focus:border-black/70" />
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t pt-4" style={{ borderColor: TINTA }}>
                  <p className="text-[1.05rem]">
                    {s.nombre} · <b>desde {qz(s.precio)}</b>
                    <span className="block text-[0.92rem] opacity-60">Pagas en el salón, en efectivo o con tarjeta.</span>
                  </p>
                  <button type="button" disabled={!valido} onClick={confirmar} className={`${btn} text-white disabled:opacity-40`} style={{ background: SALVIA }}>
                    Apartar mi cita <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <MensajeWhatsApp mensaje={lista && verMsg ? texto : null} alCerrar={() => setVerMsg(false)} demo="salón de belleza" que="cada cita nueva" />
    </section>
  );
}

/* ---------------- la agenda que ve el salón ---------------- */

function Panel({ store }: { store: ReturnType<typeof useCitas> }) {
  const { citas, cambiar } = store;
  const [suc, setSuc] = useState("todas");
  const [aviso, setAviso] = useState("");
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(""), 3200);
    return () => clearTimeout(t);
  }, [aviso]);

  const hoy = hoyIso();
  const manana = iso(masDias(1));
  const enSuc = (c: Cita) => suc === "todas" || c.suc === suc;
  const deHoy = citas.filter((c) => c.fecha === hoy && enSuc(c)).sort((a, b) => aMin(a.hora) - aMin(b.hora));
  const deManana = citas.filter((c) => c.fecha === manana && enSuc(c)).sort((a, b) => aMin(a.hora) - aMin(b.hora));
  const ingresos = deHoy.filter((c) => c.estado !== "no-vino").reduce((t, c) => t + servicio(c.servicio).precio, 0);
  const estilistas = ESTILISTAS.filter((e) => suc === "todas" || e.suc === suc);
  const horasTrabajo = estilistas.reduce((t, e) => t + (sucursal(e.suc).cierra - sucursal(e.suc).abre) * 60, 0);
  const ocupado = deHoy.reduce((t, c) => t + servicio(c.servicio).dura, 0);

  // a quién ya le toca volver: la última cita de cada clienta, según cada cuánto se hace ese servicio
  const ultimas = new Map<string, Cita>();
  citas.filter((c) => c.estado === "llego" && enSuc(c)).forEach((c) => {
    const u = ultimas.get(c.tel);
    if (!u || c.fecha > u.fecha) ultimas.set(c.tel, c);
  });
  const conCitaFutura = new Set(citas.filter((c) => c.fecha >= hoy && c.estado === "confirmada").map((c) => c.tel));
  const retoque = [...ultimas.values()]
    .map((c) => {
      const s = servicio(c.servicio);
      const dias = Math.round((Date.now() - new Date(c.fecha + "T12:00").getTime()) / 864e5);
      return { c, s, dias };
    })
    .filter(({ c, s, dias }) => s.retoque && dias >= s.retoque - 3 && !conCitaFutura.has(c.tel))
    .sort((a, b) => b.dias - a.dias);

  const masPedidos = SERVICIOS.map((s) => ({ s, n: citas.filter((c) => c.servicio === s.id && enSuc(c)).length }))
    .filter((x) => x.n)
    .sort((a, b) => b.n - a.n)
    .slice(0, 5);

  const h2 = "text-[1.7rem] leading-tight";
  const estadoBtn = (on: boolean, color: string) => (on ? { background: color, borderColor: color, color: "#fff" } : { borderColor: "rgba(22,38,27,.2)" });

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-8">
      <p className="opacity-65">{fechaLarga(hoy).replace(/^./, (x) => x.toUpperCase())}</p>
      <h1 className="mt-1 text-[2.8rem] leading-none" style={{ fontFamily: SERIF }}>Agenda del salón</h1>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {[{ id: "todas", nombre: "Todas las sucursales" }, ...SUCURSALES].map((x) => (
          <button key={x.id} type="button" onClick={() => setSuc(x.id)} className="shrink-0 rounded-full border-2 px-4 py-2 font-medium" style={suc === x.id ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(22,38,27,.2)" }}>
            {x.nombre}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 border-y md:grid-cols-4 [&>*]:border-l [&>*:nth-child(odd)]:border-l-0 md:[&>*:nth-child(odd)]:border-l md:[&>*:first-child]:border-l-0" style={{ borderColor: TINTA }}>
        {[
          [String(deHoy.length), "citas hoy"],
          [qz(ingresos), "esperado hoy"],
          [`${Math.round((ocupado / horasTrabajo) * 100)}%`, "de la agenda ocupada"],
          [String(retoque.length), "les toca retoque"],
        ].map(([n, t]) => (
          <div key={t} className="px-3 py-4" style={{ borderColor: LINEA }}>
            <p className="text-[2rem] leading-none" style={{ fontFamily: SERIF }}>{n}</p>
            <p className="mt-1.5 text-[0.95rem] opacity-65">{t}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <section className="min-w-0">
          <h2 className={h2} style={{ fontFamily: SERIF }}>Hoy</h2>
          {deHoy.length === 0 ? (
            <p className="mt-3 opacity-60">No hay citas hoy en esta sucursal.</p>
          ) : (
            <ul className="mt-3 border-t" style={{ borderColor: TINTA }}>
              {deHoy.map((c) => {
                const s = servicio(c.servicio);
                return (
                  <li key={c.id} className={`grid gap-3 border-b py-4 sm:grid-cols-[5.5rem_1fr_auto] sm:items-center ${c.estado === "no-vino" ? "opacity-50" : ""}`} style={{ borderColor: LINEA }}>
                    <p className="text-[1.2rem]" style={{ fontFamily: SERIF }}>{hora12(c.hora)}</p>
                    <div className="min-w-0">
                      <p className="font-semibold">
                        {c.nombre} {c.nueva && <span className="ml-1 rounded-full px-2 py-0.5 text-[0.75rem] text-white" style={{ background: SALVIA }}>agendó en línea</span>}
                      </p>
                      <p className="text-[0.95rem] opacity-70">
                        {s.nombre} · {s.dura} min · con {estilista(c.estilista).nombre}
                        {suc === "todas" ? ` · ${sucursal(c.suc).nombre}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => cambiar(c.id, { estado: c.estado === "llego" ? "confirmada" : "llego" })} className="rounded-full border-2 px-3.5 py-1.5 text-[0.95rem] font-semibold" style={estadoBtn(c.estado === "llego", SALVIA)}>
                        Llegó
                      </button>
                      <button type="button" onClick={() => cambiar(c.id, { estado: c.estado === "no-vino" ? "confirmada" : "no-vino" })} className="rounded-full border-2 px-3.5 py-1.5 text-[0.95rem] font-semibold" style={estadoBtn(c.estado === "no-vino", "#9a3b2f")}>
                        No vino
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <h2 className={`${h2} mt-12`} style={{ fontFamily: SERIF }}>Por estilista</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {estilistas.map((e) => {
              const suyas = deHoy.filter((c) => c.estilista === e.id);
              const min = suyas.reduce((t, c) => t + servicio(c.servicio).dura, 0);
              const total = (sucursal(e.suc).cierra - sucursal(e.suc).abre) * 60;
              return (
                <li key={e.id} className="bg-white p-4">
                  <div className="flex items-baseline justify-between">
                    <b>{e.nombre}</b>
                    <span className="text-[0.92rem] opacity-60">{suyas.length} {suyas.length === 1 ? "cita" : "citas"}</span>
                  </div>
                  <div className="mt-2" style={{ background: LINEA, height: 6 }}>
                    <div className="h-full" style={{ width: `${Math.min(100, (min / total) * 100)}%`, background: SALVIA }} />
                  </div>
                  <p className="mt-1.5 text-[0.88rem] opacity-60">{Math.round((total - min) / 60)} h libres hoy</p>
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="grid min-w-0 content-start gap-12">
          <section>
            <h2 className={h2} style={{ fontFamily: SERIF }}>Recordatorios de mañana</h2>
            <p className="mt-1 text-[0.98rem] opacity-60">Se mandan solos por WhatsApp a las 6 de la tarde. Si alguien cancela, te avisamos.</p>
            <ul className="mt-3 border-t" style={{ borderColor: LINEA }}>
              {deManana.map((c) => (
                <li key={c.id} className="flex items-baseline justify-between gap-3 border-b py-3" style={{ borderColor: LINEA }}>
                  <span className="min-w-0">
                    <b className="block truncate">{c.nombre}</b>
                    <span className="text-[0.92rem] opacity-65">
                      {hora12(c.hora)} · {servicio(c.servicio).nombre}
                    </span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[0.92rem]" style={{ color: SALVIA }}>
                    <Check size={15} /> programado
                  </span>
                </li>
              ))}
              {deManana.length === 0 && <li className="py-3 opacity-60">Mañana no hay citas en esta sucursal.</li>}
            </ul>
          </section>

          {retoque.length > 0 && (
            <section>
              <h2 className={h2} style={{ fontFamily: SERIF }}>Ya les toca retoque</h2>
              <p className="mt-1 text-[0.98rem] opacity-60">Vinieron hace tiempo y no tienen cita. Una invitación a tiempo llena huecos en la agenda.</p>
              <ul className="mt-3 border-t" style={{ borderColor: LINEA }}>
                {retoque.map(({ c, s, dias }) => (
                  <li key={c.id} className="flex items-baseline justify-between gap-3 border-b py-3" style={{ borderColor: LINEA }}>
                    <span className="min-w-0">
                      <b className="block truncate">{c.nombre}</b>
                      <span className="text-[0.92rem] opacity-65">
                        {s.nombre}, hace {dias} días
                      </span>
                    </span>
                    <button type="button" onClick={() => setAviso(`En su salón, este botón le escribe a ${c.nombre.split(" ")[0]} por WhatsApp con el link para agendar.`)} className="inline-flex shrink-0 items-center gap-1 text-[0.95rem] font-semibold" style={{ color: SALVIA }}>
                      <MessageCircle size={16} /> Invitarla
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className={h2} style={{ fontFamily: SERIF }}>Lo más pedido</h2>
            <ul className="mt-3 grid gap-3">
              {masPedidos.map(({ s, n }) => (
                <li key={s.id}>
                  <div className="flex justify-between text-[0.98rem]">
                    <span>{s.nombre}</span>
                    <span className="opacity-65">{n}</span>
                  </div>
                  <div className="mt-1" style={{ background: LINEA, height: 6 }}>
                    <div className="h-full" style={{ width: `${(n / masPedidos[0].n) * 100}%`, background: TINTA }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
      {aviso && (
        <div role="status" className="fixed inset-x-4 bottom-6 z-50 mx-auto max-w-md px-5 py-4 text-center text-white shadow-xl" style={{ background: TINTA }}>
          {aviso}
        </div>
      )}
      <p className="mt-12 flex items-center gap-2 text-[0.95rem] opacity-60">
        <ArrowLeft size={15} /> Agenda una cita en la página del salón y aparece aquí con la marca «agendó en línea».
      </p>
    </div>
  );
}
