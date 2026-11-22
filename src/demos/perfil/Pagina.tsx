/*
 * La página de Sofía para sus clientas: se ve más de lo que se lee.
 * Cada parte es una franja de color con su número, usa todo el ancho de la pantalla y se acomoda en cualquier tamaño.
 * Orden de la venta: quién es y qué promete, promos, su tono, catálogo, lo que hace, trabajos, opiniones, cómo pedir y contacto.
 * Todo es de ejemplo (persona y marcas inventadas).
 */
import { useState } from "react";
import { ArrowRight, Check, Gift, MessageCircle, Package, RefreshCw, ShieldCheck, Sparkles, Truck, Users, Wallet, Clock } from "lucide-react";
import estudio from "@/assets/demo-cosmeticos/estudio.jpg";
import lookGlam from "@/assets/demo-cosmeticos/rostro.jpg";
import lookDelineado from "@/assets/demo-cosmeticos/delineado.jpg";
import lookClase from "@/assets/demo-cosmeticos/academia.jpg";
import lookFiesta from "@/assets/demo-cosmeticos/maquillista.jpg";
import lookGraduacion from "@/assets/demo-cosmeticos/graduada-2.jpg";
import lookGraduacion2 from "@/assets/demo-cosmeticos/graduada-5.jpg";
import { CONSULTORA, LINEA, OPINIONES, RAZONES_EQUIPO, TEMAS_AVISO, TINTA, VINO, nuevoId, producto, useAvisos, useInteresadas } from "./datos";
import { Seccion } from "./Seccion";
import { Tienda } from "./Tienda";

const SERIF = '"Fraunces", Georgia, serif';

const HAGO = [
  { foto: estudio, t: "Facial gratis", dato: "45 minutos", d: "Pruebas tu rutina en tu propia cara." },
  { foto: lookClase, t: "Reunión con amigas", dato: "Tú ganas regalos", d: "Invitas a 3 amigas o más. Yo llevo todo." },
  { foto: lookGraduacion, t: "Maquillaje para eventos", dato: "Desde Q250", d: "Bodas, graduaciones y quince años." },
  { foto: lookGlam, t: "Asesoría por WhatsApp", dato: "El mismo día", d: "Mándame una foto y te digo qué usar." },
];

const TRABAJOS = [
  { foto: lookGraduacion, t: "Graduación" },
  { foto: lookGlam, t: "Piel iluminada" },
  { foto: lookFiesta, t: "Color para fiesta" },
  { foto: lookDelineado, t: "Delineado clásico" },
  { foto: lookClase, t: "Maquillaje de día" },
  { foto: lookGraduacion2, t: "Labios intensos" },
];

const COMO = [
  { I: Truck, t: "Capital", d: "24 a 48 horas" },
  { I: Package, t: "Departamentos", d: "3 a 5 días" },
  { I: Wallet, t: "Pagas al recibir", d: "Efectivo o transferencia" },
  { I: RefreshCw, t: "¿No te gusta?", d: "Te lo cambio" },
  { I: Clock, t: "Horario", d: "Lun a sáb, 8 a 19" },
];

const NAV = [["promos", "Promos"], ["tono", "Tu tono"], ["catalogo", "Catálogo"], ["hago", "Lo que hago"], ["trabajos", "Trabajos"], ["opiniones", "Opiniones"], ["como", "Cómo pido"], ["contacto", "Contacto"]];

function Portada({ alEmpezar }: { alEmpezar: () => void }) {
  const muestra = [producto("limpiador")!, producto("serum")!, producto("crema-dia")!];
  return (
    <section id="inicio" style={{ background: "#fde6da" }}>
      <div className="pf-cont pf-hero gap-[clamp(1.5rem,4vw,5rem)] py-[clamp(1.5rem,4vw,4.5rem)]">
        <div className="flex flex-col justify-center">
          <p className="flex items-center gap-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-[1.15rem] font-bold text-white" style={{ background: VINO }}>SM</span>
            <span className="leading-tight"><span className="block text-[1.25rem] font-semibold">Hola, soy {CONSULTORA.corto}</span><span className="block opacity-65">Tu consultora de belleza</span></span>
          </p>
          <h1 className="mt-6 font-medium leading-[1.02] tracking-[-0.015em]" style={{ fontFamily: SERIF, fontSize: "clamp(2.6rem, 1.2rem + 4.4vw, 5.6rem)", color: "inherit" }}>
            Tu rutina de piel, en 3 minutos.
          </h1>
          <p className="mt-4 max-w-xl text-[clamp(1.15rem,1rem+0.7vw,1.6rem)] leading-snug opacity-80">Contesta desde tu teléfono y te digo qué usar en la mañana y en la noche.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={alEmpezar} className="inline-flex min-h-[3.75rem] items-center justify-center gap-2 rounded-full px-9 text-[1.3rem] font-semibold text-white transition active:scale-[0.99]" style={{ background: TINTA }}>Hacer mi rutina <ArrowRight size={22} /></button>
            <a href="#promos" className="inline-flex min-h-[3.75rem] items-center justify-center rounded-full border-2 px-8 text-[1.2rem] font-semibold" style={{ borderColor: TINTA }}>Ver promos</a>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {[[Sparkles, "Tu rutina en 3 pasos"], [Gift, "Muestra gratis"], [Gift, "Regalo en tu cumpleaños"]].map(([I, t], i) => { const Icono = I as typeof Gift; return (
              <li key={i} className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: VINO }}><Icono size={21} /></span><span className="text-[1.1rem] font-semibold leading-tight">{t as string}</span></li>
            ); })}
          </ul>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t-2 pt-5" style={{ borderColor: LINEA }}>
            {[["6 años", "como consultora"], ["120", "clientas"], ["48 h", "para entregar"]].map(([n, t]) => <div key={t}><dt className="text-[clamp(1.8rem,1.3rem+1.5vw,2.8rem)] font-medium leading-none" style={{ fontFamily: SERIF }}>{n}</dt><dd className="mt-1 text-[1rem] opacity-70">{t}</dd></div>)}
          </dl>
        </div>
        <figure className="relative min-h-[22rem]">
          <img src={lookFiesta} alt="Sofía maquillando a una clienta" className="absolute inset-0 h-full w-full rounded-3xl object-cover" />
          <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/95 p-4 shadow-lg sm:inset-x-auto sm:left-4 sm:w-[min(24rem,calc(100%-2rem))]">
            <p className="text-[1.05rem] font-bold">Así queda tu rutina</p>
            <ol className="mt-3 grid grid-cols-3 gap-3">
              {muestra.map((pr, i) => <li key={pr.id} className="text-center leading-tight"><img src={pr.foto} alt="" className="mx-auto aspect-square w-full max-w-[6rem] rounded-xl object-cover" /><span className="mt-1 block text-[0.85rem] opacity-60">Paso {i + 1}</span><span className="block text-[0.95rem] font-semibold">{pr.nombre.split(" ").slice(0, 2).join(" ")}</span></li>)}
            </ol>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function PaginaSofia({ alEmpezar }: { alEmpezar: () => void }) {
  return (
    <div>
      <Portada alEmpezar={alEmpezar} />
      <nav aria-label="Secciones de la página" className="sticky top-[4.6rem] z-10 border-y print:hidden" style={{ background: "rgba(255,255,255,.96)", borderColor: LINEA }}>
        <ul className="pf-cont flex gap-2 overflow-x-auto py-2.5 [scrollbar-width:none]">
          {NAV.map(([id, t]) => <li key={id} className="shrink-0"><a href={`#${id}`} className="inline-flex min-h-[2.75rem] items-center rounded-full px-5 text-[1.05rem] font-semibold hover:bg-[#fde6da]">{t}</a></li>)}
        </ul>
      </nav>

      <Tienda />

      {/* 05 lo que hago */}
      <Seccion id="hago" num="05" etiqueta="Lo que hago" titulo="Lo que hago por ti" fondo="#fde6da">
        <div className="pf-auto" style={{ ["--min" as string]: "16rem" }}>
          {HAGO.map((h) => (
            <article key={h.t} className="overflow-hidden rounded-2xl bg-white">
              <div className="relative"><img src={h.foto} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" /><span className="absolute bottom-3 left-3 rounded-full px-4 py-1.5 text-[1rem] font-bold text-white" style={{ background: VINO }}>{h.dato}</span></div>
              <div className="p-5"><h3 className="text-[1.4rem] font-medium leading-tight" style={{ fontFamily: SERIF }}>{h.t}</h3><p className="mt-1.5 text-[1.1rem] opacity-75">{h.d}</p></div>
            </article>
          ))}
        </div>
      </Seccion>

      {/* 06 trabajos */}
      <Seccion id="trabajos" num="06" etiqueta="Trabajos" titulo="Mis trabajos" sub="Fotos de mis clientas, con su permiso." fondo="#ffffff">
        <div className="pf-fill" style={{ ["--min" as string]: "15rem" }}>
          {TRABAJOS.map((t, i) => (
            <figure key={i} className="relative overflow-hidden rounded-2xl">
              <img src={t.foto} alt={t.t} className="aspect-[4/5] w-full object-cover" loading="lazy" />
              <figcaption className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-10 text-[1.15rem] font-semibold text-white" style={{ background: "linear-gradient(transparent, rgba(30,10,30,.75))" }}>{t.t}</figcaption>
            </figure>
          ))}
        </div>
      </Seccion>

      {/* 07 opiniones */}
      <Seccion id="opiniones" num="07" etiqueta="Opiniones" titulo="Lo que dicen mis clientas" fondo={TINTA} oscuro>
        <div className="pf-auto" style={{ ["--min" as string]: "18rem" }}>
          {OPINIONES.map((o) => (
            <figure key={o.quien} className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,.08)" }}>
              <div className="flex gap-1" aria-label="5 estrellas">{[1, 2, 3, 4, 5].map((i) => <span key={i} style={{ color: "#f2c230" }} aria-hidden>★</span>)}</div>
              <blockquote className="mt-3 text-[clamp(1.15rem,1.05rem+0.4vw,1.4rem)] leading-snug">“{o.d}”</blockquote>
              <figcaption className="mt-4 text-[1.05rem] font-semibold opacity-70">{o.quien}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-8 flex items-center gap-4 rounded-2xl bg-white/10 p-5 text-[clamp(1.15rem,1.05rem+0.4vw,1.4rem)]"><ShieldCheck size={32} className="shrink-0" style={{ color: "#f2c230" }} /><span><b>Todo es original.</b> Si no te gusta, te lo cambio.</span></p>
      </Seccion>

      {/* 08 cómo pido */}
      <Seccion id="como" num="08" etiqueta="Cómo pido" titulo="Así pides" fondo="#f9cdb9">
        <ul className="pf-auto" style={{ ["--min" as string]: "13rem" }}>
          {COMO.map(({ I, t, d }) => (
            <li key={t} className="flex items-center gap-4 rounded-2xl bg-white p-5"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-white" style={{ background: VINO }}><I size={26} /></span><span className="leading-tight"><b className="block text-[1.2rem]">{t}</b><span className="text-[1.05rem] opacity-75">{d}</span></span></li>
          ))}
        </ul>
      </Seccion>

      {/* 09 contacto */}
      <Seccion id="contacto" num="09" etiqueta="Contacto" titulo="Hablemos" fondo="#ffffff">
        <div className="grid gap-[clamp(1rem,3vw,2.5rem)] lg:grid-cols-2">
          <div className="rounded-3xl p-[clamp(1.25rem,3vw,2.5rem)]" style={{ background: "#fde6da" }}><Avisame /></div>
          <div className="rounded-3xl p-[clamp(1.25rem,3vw,2.5rem)]" style={{ background: "#f9cdb9" }}><Unete /></div>
        </div>
      </Seccion>

      {/* cierre */}
      <section className="text-white" style={{ background: VINO, borderTop: `6px solid ${TINTA}` }}>
        <div className="pf-cont flex flex-col gap-6 py-[clamp(2.5rem,5vw,5rem)] md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="pf-h2" style={{ color: "#fff" }}>¿Empezamos?</h2>
            <p className="mt-2 text-[clamp(1.1rem,1rem+0.5vw,1.4rem)] text-white/80">Tu rutina en 3 minutos y tu muestra gratis.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={alEmpezar} className="inline-flex min-h-[3.75rem] items-center justify-center gap-2 rounded-full bg-white px-9 text-[1.25rem] font-semibold" style={{ color: TINTA }}>Hacer mi rutina <ArrowRight size={22} /></button>
            <span className="inline-flex min-h-[3.75rem] items-center justify-center gap-2 rounded-full border-2 border-white/40 px-8 text-[1.2rem] font-semibold"><MessageCircle size={21} /> 5555 0101</span>
          </div>
        </div>
      </section>
    </div>
  );
}

const claseCampo = "w-full min-h-[3.25rem] rounded-xl border-2 border-black/20 bg-white px-4 text-[1.15rem] outline-none focus:border-black/80 placeholder:text-black/40";

/* Avísame de las promos: en lugar del grupo de WhatsApp donde se pierde todo */
function Avisame() {
  const { agregar } = useAvisos();
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [temas, setTemas] = useState<string[]>([]);
  const [listo, setListo] = useState(false);
  const valido = nombre.trim().length > 1 && tel.replace(/\D/g, "").length === 8 && temas.length > 0;
  if (listo)
    return (
      <div>
        <h3 className="text-[2rem] font-medium leading-tight" style={{ fontFamily: SERIF }}>¡Listo, {nombre.split(" ")[0]}!</h3>
        <p className="mt-3 text-[1.2rem] opacity-80">Te aviso solo de {temas.join(", ").toLowerCase()}.</p>
      </div>
    );
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!valido) return; agregar({ id: nuevoId(), nombre: nombre.trim(), telefono: tel.replace(/\D/g, ""), temas, fecha: new Date().toISOString() }); setListo(true); }}>
      <h3 className="text-[clamp(1.6rem,1.3rem+1vw,2.2rem)] font-medium leading-tight" style={{ fontFamily: SERIF }}>Avísame de las promos</h3>
      <p className="mt-2 text-[1.15rem] opacity-75">Elige de qué quieres saber.</p>
      <div className="mt-5 flex flex-wrap gap-2.5">
        {TEMAS_AVISO.map((t) => { const si = temas.includes(t); return (
          <button key={t} type="button" aria-pressed={si} onClick={() => setTemas(si ? temas.filter((x) => x !== t) : [...temas, t])} className="inline-flex min-h-[3rem] items-center gap-1.5 rounded-full border-2 px-5 text-[1.05rem] font-semibold" style={si ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(42,22,51,.3)", background: "#fff" }}>{si && <Check size={16} strokeWidth={3} />} {t}</button>
        ); })}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input aria-label="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" autoComplete="given-name" className={claseCampo} />
        <input aria-label="Tu WhatsApp" value={tel} onChange={(e) => setTel(e.target.value.replace(/[^\d ]/g, "").slice(0, 9))} placeholder="Tu WhatsApp" inputMode="numeric" autoComplete="tel" className={claseCampo} />
      </div>
      <button type="submit" disabled={!valido} className="mt-4 min-h-[3.25rem] rounded-full px-8 text-[1.15rem] font-semibold text-white disabled:opacity-40" style={{ background: TINTA }}>Avísame</button>
    </form>
  );
}

/* Únete a mi equipo: para las directoras que buscan consultoras */
function Unete() {
  const { agregar } = useInteresadas();
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [por, setPor] = useState("");
  const [listo, setListo] = useState(false);
  const valido = nombre.trim().length > 1 && tel.replace(/\D/g, "").length === 8 && por;
  if (listo)
    return (
      <div>
        <h3 className="text-[2rem] font-medium leading-tight" style={{ fontFamily: SERIF }}>Gracias, {nombre.split(" ")[0]}</h3>
        <p className="mt-3 text-[1.2rem] opacity-80">Te escribo esta semana, sin compromiso.</p>
      </div>
    );
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!valido) return; agregar({ id: nuevoId(), nombre: nombre.trim(), telefono: tel.replace(/\D/g, ""), por, fecha: new Date().toISOString() }); setListo(true); }}>
      <h3 className="flex items-center gap-2 text-[clamp(1.6rem,1.3rem+1vw,2.2rem)] font-medium leading-tight" style={{ fontFamily: SERIF }}><Users size={28} /> Vende conmigo</h3>
      <p className="mt-2 text-[1.15rem] opacity-75">Así empecé yo. Te enseño y te acompaño. — {CONSULTORA.corto}</p>
      <div className="mt-5 grid gap-2.5">
        {RAZONES_EQUIPO.map((r) => (
          <button key={r} type="button" aria-pressed={por === r} onClick={() => setPor(r)} className="flex min-h-[3.25rem] items-center gap-3 rounded-xl border-2 bg-white px-4 py-2.5 text-left text-[1.05rem] font-semibold" style={{ borderColor: por === r ? TINTA : "rgba(42,22,51,.18)" }}>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2" style={{ borderColor: por === r ? VINO : "rgba(42,22,51,.4)", background: por === r ? VINO : "transparent" }}>{por === r && <Check size={15} strokeWidth={3} className="text-white" />}</span>
            {r}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input aria-label="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" autoComplete="given-name" className={claseCampo} />
        <input aria-label="Tu WhatsApp" value={tel} onChange={(e) => setTel(e.target.value.replace(/[^\d ]/g, "").slice(0, 9))} placeholder="Tu WhatsApp" inputMode="numeric" autoComplete="tel" className={claseCampo} />
      </div>
      <button type="submit" disabled={!valido} className="mt-4 min-h-[3.25rem] rounded-full px-8 text-[1.15rem] font-semibold text-white disabled:opacity-40" style={{ background: VINO }}>Quiero saber más</button>
    </form>
  );
}
