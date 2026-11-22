/*
 * Demo: "Lirio Salón · uñas y spa" (negocio inventado, datos de ejemplo).
 * Para salones con varias sucursales que hoy agendan por WhatsApp, un número por sucursal.
 * La clienta agenda sola (sucursal, servicio, con quién, día y hora) y el salón ve su agenda del día,
 * los recordatorios de mañana y a quién ya le toca retoque.
 * Fotos libres de Unsplash ya usadas en otras demos.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarCheck, Check, Clock, MapPin, Phone } from "lucide-react";
import fotoEstudio from "@/assets/demo-cosmeticos/estudio.jpg";
import fotoSpa from "@/assets/demo-fundadora/salon.jpg";
import fotoMaquillaje from "@/assets/demo-cosmeticos/maquillista.jpg";
import fotoPestanas from "@/assets/demo-cosmeticos/delineado.jpg";
import PanelSalon from "./PanelSalon";
import { BandaDemos, PartesDemo, CierreJzet, MensajeWhatsApp, qz } from "../comun";
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
      <PartesDemo fondo={"#2b2622"} actual={vista} alCambiar={setVista} partes={[{ id: "salon", nombre: "Página del salón", quien: "La clienta agenda sola su cita" }, { id: "panel", nombre: "Agenda del salón", quien: "El salón ve las citas de cada estilista" }] as const} />
      {vista === "salon" ? <Pagina store={store} /> : <PanelSalon store={store} />}
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
          <h1 className="text-[2.6rem] leading-[1.05] sm:text-[3.5rem]" style={{ fontFamily: SERIF }}>
            Salón de belleza en zona 10, Cayalá y San Cristóbal
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
        <div>
          <img src={fotoEstudio} alt="Estilista peinando a una clienta en el salón" className="aspect-[4/5] w-full object-cover" style={{ borderRadius: "999px 999px 1.25rem 1.25rem" }} />
          <p className="mt-3 text-[0.98rem]">
            <span className="opacity-60">Próxima hora libre:</span> hoy con Lucía, manicure en gel {qz(160)}
          </p>
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
                  <input aria-label="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" autoComplete="name" className="rounded-md border-2 border-black/20 bg-white px-4 py-3 text-[1.08rem] outline-none focus:border-black/70" />
                  <input aria-label="Tu WhatsApp" value={tel} onChange={(e) => setTel(e.target.value.replace(/[^\d ]/g, "").slice(0, 9))} placeholder="Tu WhatsApp" inputMode="numeric" autoComplete="tel" className="rounded-md border-2 border-black/20 bg-white px-4 py-3 text-[1.08rem] outline-none focus:border-black/70" />
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
