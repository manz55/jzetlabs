/*
 * La página de Sofía para sus clientas: se ve más de lo que se lee.
 * Cada parte es una franja de color con su número, usa todo el ancho de la pantalla y se acomoda en cualquier tamaño.
 * Orden de la venta: quién es y qué promete, promos, su tono, catálogo, lo que hace, trabajos, opiniones, cómo pedir y contacto.
 * Todo es de ejemplo (persona y marcas inventadas).
 */
import { useCallback, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Gift, MessageCircle, Package, RefreshCw, ShieldCheck, Sparkles, Truck, Users, Wallet, Clock } from "lucide-react";
import estudio from "@/assets/demo-cosmeticos/estudio.jpg";
import lookGlam from "@/assets/demo-cosmeticos/rostro.jpg";
import lookDelineado from "@/assets/demo-cosmeticos/delineado.jpg";
import lookClase from "@/assets/demo-cosmeticos/academia.jpg";
import lookFiesta from "@/assets/demo-cosmeticos/maquillista.jpg";
import lookGraduacion from "@/assets/demo-cosmeticos/graduada-2.jpg";
import lookGraduacion2 from "@/assets/demo-cosmeticos/graduada-5.jpg";
import grad1 from "@/assets/demo-cosmeticos/graduada-1.jpg";
import grad3 from "@/assets/demo-cosmeticos/graduada-3.jpg";
import grad6 from "@/assets/demo-cosmeticos/graduada-6.jpg";
import espejo from "@/assets/demo-cosmeticos/espejo.jpg";
import kit from "@/assets/demo-cosmeticos/kit.jpg";
import aceite from "@/assets/demo-cosmeticos/aceite.jpg";
import crema from "@/assets/demo-cosmeticos/crema.jpg";
import paleta from "@/assets/demo-cosmeticos/paleta.jpg";
import rubor from "@/assets/demo-cosmeticos/rubor.jpg";
import labialRojo from "@/assets/demo-cosmeticos/labial-rojo.jpg";
import labialNude from "@/assets/demo-cosmeticos/labial-nude.jpg";
import brochas from "@/assets/demo-cosmeticos/brochas.jpg";
import polvoNegro from "@/assets/demo-cosmeticos/polvo-negro.jpg";
import { LINEA, OPINIONES, RAZONES_EQUIPO, ROSA, TEMAS_AVISO, TINTA, VINO, nuevoId, producto, useAvisos, useInteresadas } from "./datos";
import { ChatSofia } from "./Chat";
import { MensajeWhatsApp } from "../comun";
import { Rev, Ventana } from "./Ventana";
import { Seccion } from "./Seccion";
import { Tienda } from "./Tienda";

const SERIF = '"Fraunces", Georgia, serif';

type Experiencia = { id: string; foto: string; t: string; dato: string; d: string; vende: string; puntos: string[]; precios?: [string, string][]; pago: string; cta: string; accion: "chat" | "wa"; msg: string };
const EXPERIENCIAS: Experiencia[] = [
  { id: "facial", foto: estudio, t: "Facial gratis", dato: "45 minutos", d: "Pruebas tu rutina en tu propia cara.", vende: "Sales viendo la diferencia en tu piel, sin comprar nada.", puntos: ["Limpieza y mascarilla en una mitad de tu cara, para que compares", "Te explico para qué sirve cada paso, con calma", "Te llevas una muestra para probar en tu casa", "Voy a tu casa o a la de una amiga"], pago: "No pagas nada. Si te gusta algo, lo pides después.", cta: "Agendar mi facial", accion: "wa", msg: "Hola, quiero agendar mi facial gratis. ¿Qué días tienes libres?" },
  { id: "amigas", foto: lookClase, t: "Reunión con amigas", dato: "Tú ganas regalos", d: "Invitas a 3 amigas o más. Yo llevo todo.", vende: "Una tarde de risas, y la que invita se lleva productos de regalo.", puntos: ["Llevo todo lo necesario: espejos, brochas y muestras", "Cada invitada prueba y se lleva su rutina", "Tú, como anfitriona, eliges regalos según lo que se venda", "Dura 2 horas y no necesitas preparar nada"], pago: "Cada quien paga lo que pida. Tú no pagas por invitar.", cta: "Armar mi reunión", accion: "wa", msg: "Hola, quiero armar una reunión con mis amigas. Somos más o menos 4. ¿Qué día puedes?" },
  { id: "eventos", foto: lookGraduacion, t: "Maquillaje para eventos", dato: "Desde Q250", d: "Bodas, graduaciones y quince años.", vende: "Te ves bien en la foto y aguanta toda la noche.", puntos: ["Prueba previa para que te guste antes del gran día", "Productos que no se corren con el calor ni las lágrimas", "Voy hasta donde te estés arreglando", "Retoque para llevar en la bolsa"], precios: [["Graduación", "Q250"], ["Quince años", "Q400"], ["Novia", "Q650"], ["Invitada", "Q300"]], pago: "Apartas con la mitad y el resto lo pagas el día del evento.", cta: "Cotizar mi evento", accion: "wa", msg: "Hola, quiero cotizar maquillaje para un evento. La fecha es " },
  { id: "whatsapp", foto: lookGlam, t: "Asesoría por WhatsApp", dato: "El mismo día", d: "Mándame una foto y te digo qué usar.", vende: "Respuesta rápida, sin ir a ningún lado y sin pena de preguntar.", puntos: ["Me cuentas qué tipo de piel tienes", "Te digo qué usar en la mañana y en la noche", "Te mando el precio y si lo tengo en mano", "Te contesto el mismo día, de lunes a sábado"], pago: "La asesoría no cuesta. Pagas solo si pides algo.", cta: "Chatear ahora", accion: "chat", msg: "" },
];

type Trabajo = { t: string; desc: string; fotos: { f: string; p: string }[] };
const TRABAJOS: Trabajo[] = [
  { t: "Graduación", desc: "Maquillaje que dura todo el día y se ve bien en las fotos. También enseño a las chicas a maquillarse solas.", fotos: [{ f: lookGraduacion, p: "Lista para la ceremonia" }, { f: grad1, p: "Rizos y piel pareja" }, { f: lookGraduacion2, p: "Labios y ojos suaves" }, { f: grad6, p: "Con toga y sonrisa" }, { f: grad3, p: "Un look natural" }, { f: lookClase, p: "Enseñándole a una clienta cómo aplicarse la sombra" }, { f: estudio, p: "Clase para varias chicas en el estudio" }] },
  { t: "Piel iluminada", desc: "Piel con luz, parejita y sin verse cargada.", fotos: [{ f: lookGlam, p: "Luz en pómulos y nariz" }, { f: kit, p: "Los productos que usé" }, { f: aceite, p: "Sérum antes del maquillaje" }, { f: crema, p: "Hidratación como base" }] },
  { t: "Color para fiesta", desc: "Ojos con color y mucha personalidad para la noche.", fotos: [{ f: lookFiesta, p: "Sombra rosa y delineado" }, { f: paleta, p: "La paleta de la campaña" }, { f: rubor, p: "Rubor que se difumina" }, { f: labialRojo, p: "Labio rojo clásico" }] },
  { t: "Delineado clásico", desc: "Un trazo limpio que alarga la mirada.", fotos: [{ f: lookDelineado, p: "Trazo con colita" }, { f: lookClase, p: "Paso a paso con pincel" }, { f: brochas, p: "Las herramientas" }] },
  { t: "Maquillaje de día", desc: "Fresco, ligero y listo en 10 minutos.", fotos: [{ f: lookClase, p: "Sombra suave" }, { f: lookGlam, p: "Piel de día" }, { f: espejo, p: "Mi espejo de trabajo" }, { f: polvoNegro, p: "Polvo para sellar" }] },
  { t: "Labios intensos", desc: "El color que más piden en las fiestas.", fotos: [{ f: lookGraduacion2, p: "Labios con sonrisa" }, { f: labialRojo, p: "Rojo clásico" }, { f: labialNude, p: "Nude de todos los días" }] },
];

const COMO = [
  { I: Truck, t: "Capital", d: "24 a 48 horas" },
  { I: Package, t: "Departamentos", d: "3 a 5 días" },
  { I: Wallet, t: "Pagas al recibir", d: "Efectivo o transferencia" },
  { I: RefreshCw, t: "¿No te gusta?", d: "Te lo cambio" },
  { I: Clock, t: "Horario", d: "Lun a sáb, 8 a 19" },
];

const NAV = [["promos", "Promos"], ["tono", "Tu tono"], ["catalogo", "Catálogo"], ["hago", "Experiencias"], ["trabajos", "Trabajos"], ["opiniones", "Opiniones"], ["como", "Cómo pido"], ["contacto", "Contacto"]];

function Portada({ alEmpezar }: { alEmpezar: () => void }) {
  const muestra = [producto("limpiador")!, producto("serum")!, producto("crema-dia")!];
  return (
    <section id="inicio" style={{ background: "#fde6da" }}>
      <div className="pf-cont pf-hero gap-[clamp(1.5rem,4vw,5rem)] py-[clamp(1.5rem,4vw,4.5rem)]">
        <div className="flex flex-col justify-center">
          <p className="flex items-center gap-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-[1.15rem] font-bold text-white" style={{ background: VINO }}>SM</span>
            <span className="leading-tight"><span className="block text-[1.25rem] font-semibold">Hola, soy (Tu nombre)</span><span className="block opacity-65">Tu consultora de belleza</span></span>
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

      <Experiencias />
      <Trabajos />

      {/* 07 opiniones */}
      <Seccion id="opiniones" etiqueta="Opiniones" titulo="Lo que dicen mis clientas" fondo={TINTA} oscuro>
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
      <Seccion id="como" etiqueta="Cómo pido" titulo="Así pides" fondo="#f9cdb9">
        <ul className="pf-auto" style={{ ["--min" as string]: "13rem" }}>
          {COMO.map(({ I, t, d }) => (
            <li key={t} className="flex items-center gap-4 rounded-2xl bg-white p-5"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-white" style={{ background: VINO }}><I size={26} /></span><span className="leading-tight"><b className="block text-[1.2rem]">{t}</b><span className="text-[1.05rem] opacity-75">{d}</span></span></li>
          ))}
        </ul>
      </Seccion>

      {/* 09 contacto */}
      <Seccion id="contacto" etiqueta="Contacto" titulo="Hablemos" fondo="#ffffff">
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

function Experiencias() {
  const [abierta, setAbierta] = useState<Experiencia | null>(null);
  const [chat, setChat] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const cerrar = useCallback(() => setAbierta(null), []);
  return (
    <Seccion id="hago" etiqueta="Experiencias" titulo="Las experiencias que te brindo" sub="Toca una para ver qué incluye." fondo="#fde6da">
      <div className="pf-auto" style={{ ["--min" as string]: "16rem" }}>
        {EXPERIENCIAS.map((h, i) => (
          <Rev key={h.id} i={i} className="h-full">
            <button type="button" onClick={() => setAbierta(h)} className="pf-card flex h-full w-full flex-col rounded-2xl bg-white text-left">
              <span className="relative block overflow-hidden"><img src={h.foto} alt="" className="pf-img aspect-[4/3] w-full object-cover" loading="lazy" /><span className="absolute bottom-3 left-3 rounded-full px-4 py-1.5 text-[1rem] font-bold text-white" style={{ background: VINO }}>{h.dato}</span></span>
              <span className="flex flex-1 flex-col p-5">
                <span className="text-[1.4rem] font-medium leading-tight" style={{ fontFamily: SERIF }}>{h.t}</span>
                <span className="mt-1.5 text-[1.1rem] opacity-75">{h.d}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[1.05rem] font-semibold" style={{ color: VINO }}>Ver qué incluye <ArrowRight size={18} /></span>
              </span>
            </button>
          </Rev>
        ))}
      </div>
      {abierta && (
        <Ventana titulo={abierta.t} alCerrar={cerrar} ancho="60rem">
          <div className="grid md:grid-cols-[1fr_1.1fr]">
            <div className="relative min-h-[16rem] md:min-h-[30rem]"><img src={abierta.foto} alt="" className="pf-zoom absolute inset-0 h-full w-full object-cover" /><span className="absolute bottom-4 left-4 rounded-full px-5 py-2 text-[1.1rem] font-bold text-white" style={{ background: VINO }}>{abierta.dato}</span></div>
            <div className="flex flex-col p-6 pt-8 md:p-9">
              <h3 className="text-[clamp(1.9rem,1.4rem+1.5vw,2.8rem)] font-medium leading-[1.05]" style={{ fontFamily: SERIF }}>{abierta.t}</h3>
              <p className="mt-3 text-[1.3rem] leading-snug" style={{ color: VINO }}>{abierta.vende}</p>
              <ul className="mt-5 grid gap-2.5">
                {abierta.puntos.map((x) => <li key={x} className="flex items-start gap-3 text-[1.1rem] leading-snug"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white" style={{ background: VINO }}><Check size={15} strokeWidth={3} /></span>{x}</li>)}
              </ul>
              {abierta.precios && (
                <dl className="mt-5 grid grid-cols-2 gap-2.5">
                  {abierta.precios.map(([n, pr]) => <div key={n} className="rounded-xl px-4 py-3" style={{ background: "#fde6da" }}><dt className="text-[0.95rem] opacity-70">{n}</dt><dd className="text-[1.5rem] font-semibold leading-tight" style={{ fontFamily: SERIF }}>{pr}</dd></div>)}
                </dl>
              )}
              <p className="mt-5 flex items-start gap-2.5 rounded-xl p-4 text-[1.05rem] font-semibold" style={{ background: "#fde6da" }}><Wallet size={22} className="mt-0.5 shrink-0" style={{ color: VINO }} />{abierta.pago}</p>
              <button type="button" onClick={() => { const e = abierta; setAbierta(null); if (e.accion === "chat") setChat(true); else setMensaje(e.msg); }} className="pf-btn mt-6 inline-flex min-h-[3.75rem] w-full items-center justify-center gap-2 rounded-full text-[1.25rem] font-semibold text-white" style={{ background: TINTA }}><MessageCircle size={22} /> {abierta.cta}</button>
            </div>
          </div>
        </Ventana>
      )}
      {chat && <ChatSofia alCerrar={() => setChat(false)} />}
      <MensajeWhatsApp mensaje={mensaje} alCerrar={() => setMensaje(null)} demo="perfil de belleza" que="cada mensaje" />
    </Seccion>
  );
}

function Trabajos() {
  const [t, setT] = useState<Trabajo | null>(null);
  const [n, setN] = useState(0);
  const abrir = (x: Trabajo) => { setT(x); setN(0); };
  const cerrar = useCallback(() => setT(null), []);
  const ir = (d: number) => t && setN((v) => (v + d + t.fotos.length) % t.fotos.length);
  return (
    <Seccion id="trabajos" etiqueta="Trabajos" titulo="Mis trabajos" sub="Toca uno para ver más fotos." fondo="#ffffff">
      <div className="pf-fill" style={{ ["--min" as string]: "15rem" }}>
        {TRABAJOS.map((x, i) => (
          <Rev key={x.t} i={i} className="h-full">
            <button type="button" onClick={() => abrir(x)} className="pf-card relative block h-full w-full rounded-2xl text-left">
              <img src={x.fotos[0].f} alt="" className="pf-img aspect-[4/5] w-full object-cover" loading="lazy" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-4 pb-3 pt-14 text-white" style={{ background: "linear-gradient(transparent, rgba(30,10,30,.8))" }}>
                <span className="text-[1.2rem] font-semibold leading-tight">{x.t}</span>
                <span className="shrink-0 rounded-full px-3 py-1 text-[0.9rem] font-bold" style={{ background: ROSA, color: TINTA }}>{x.fotos.length} fotos</span>
              </span>
            </button>
          </Rev>
        ))}
      </div>
      {t && (
        <Ventana titulo={t.t} alCerrar={cerrar} ancho="64rem">
          <div className="p-5 pt-6 md:p-8">
            <h3 className="pr-14 text-[clamp(1.8rem,1.3rem+1.4vw,2.6rem)] font-medium leading-tight" style={{ fontFamily: SERIF }}>{t.t}</h3>
            <p className="mt-1 text-[1.15rem] opacity-75">{t.desc}</p>
            <figure className="relative mt-5 overflow-hidden rounded-2xl" style={{ background: "#fde6da" }}>
              <img key={n} src={t.fotos[n].f} alt={t.fotos[n].p} className="pf-zoom mx-auto block max-h-[60svh] w-full object-contain" />
              <figcaption className="absolute inset-x-0 bottom-0 px-5 pb-4 pt-12 text-[1.15rem] font-semibold text-white" style={{ background: "linear-gradient(transparent, rgba(30,10,30,.8))" }}>{t.fotos[n].p} · {n + 1} de {t.fotos.length}</figcaption>
              {t.fotos.length > 1 && (<>
                <button type="button" aria-label="Foto anterior" onClick={() => ir(-1)} className="pf-btn absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow-md" style={{ color: TINTA }}><ArrowLeft size={22} /></button>
                <button type="button" aria-label="Foto siguiente" onClick={() => ir(1)} className="pf-btn absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow-md" style={{ color: TINTA }}><ArrowRight size={22} /></button>
              </>)}
            </figure>
            <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1">
              {t.fotos.map((f, i) => <button key={i} type="button" aria-label={`Ver foto ${i + 1}`} aria-pressed={i === n} onClick={() => setN(i)} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl transition" style={{ boxShadow: i === n ? `0 0 0 3px ${VINO}` : "none", opacity: i === n ? 1 : 0.65 }}><img src={f.f} alt="" className="h-full w-full object-cover" /></button>)}
            </div>
          </div>
        </Ventana>
      )}
    </Seccion>
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
      <p className="mt-2 text-[1.15rem] opacity-75">Así empecé yo. Te enseño y te acompaño. — (Tu nombre)</p>
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
