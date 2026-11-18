/*
 * La página de Sofía para sus clientas, debajo de la portada:
 * quién es, qué ofrece, sus trabajos, lo que maneja y cómo trabaja.
 * Todo es de ejemplo (persona y marcas inventadas).
 */
import { useState } from "react";
import { ArrowRight, Check, MessageCircle, ShieldCheck } from "lucide-react";
import estudio from "@/assets/demo-cosmeticos/estudio.jpg";
import lookGlam from "@/assets/demo-cosmeticos/rostro.jpg";
import lookDelineado from "@/assets/demo-cosmeticos/delineado.jpg";
import lookClase from "@/assets/demo-cosmeticos/academia.jpg";
import lookFiesta from "@/assets/demo-cosmeticos/maquillista.jpg";
import lookGraduacion from "@/assets/demo-cosmeticos/graduada-2.jpg";
import lookGraduacion2 from "@/assets/demo-cosmeticos/graduada-5.jpg";
import { CONSULTORA, LINEA, MARCAS, OPINIONES, PRODUCTOS, RAZONES_EQUIPO, TEMAS_AVISO, TINTA, VINO, nuevoId, qz, useAvisos, useInteresadas } from "./datos";
import { Tienda } from "./Tienda";

const SERIF = '"Fraunces", Georgia, serif';

const SERVICIOS = [
  { t: "Facial de cortesía", precio: "Gratis", dura: "45 minutos", d: "Te enseño a limpiar, tratar y proteger tu piel con productos que pruebas en tu propia cara. En tu casa o en la mía." },
  { t: "Reunión con tus amigas", precio: "Gratis para ti", dura: "1 hora y media", d: "Invitas a 3 amigas o más, yo llevo todo y les hago su perfil. Tú te ganas productos de regalo." },
  { t: "Maquillaje para eventos", precio: "Desde Q250", dura: "1 hora", d: "Bodas, graduaciones, quince años y fotos. Voy a domicilio y te dejo un retoque para la noche." },
  { t: "Asesoría por WhatsApp", precio: "Siempre", dura: "Respondo el mismo día", d: "¿No sabes qué tono te queda o cómo usar algo? Mándame una foto y te digo." },
];

const TRABAJOS = [
  { foto: lookGraduacion, t: "Graduación", d: "Natural, que aguante el día" },
  { foto: lookGlam, t: "Piel iluminada", d: "Para sesión de fotos" },
  { foto: lookFiesta, t: "Color para fiesta", d: "Sombra rosa y piel mate" },
  { foto: lookDelineado, t: "Delineado clásico", d: "Clase de automaquillaje" },
  { foto: lookClase, t: "Maquillaje de día", d: "En 10 minutos, paso a paso" },
  { foto: lookGraduacion2, t: "Graduación", d: "Labios intensos" },
];

const COMO = [
  ["Horario", "Lunes a sábado, de 8:00 a 19:00. Domingos solo eventos."],
  ["Entregas en la capital", "En 24 a 48 horas, yo misma te lo llevo."],
  ["Envíos a departamentos", "De 3 a 5 días, por paquetería."],
  ["Formas de pago", "Efectivo al recibir, transferencia o depósito."],
  ["Si no te gusta", "Te lo cambio por otro producto, sin problema."],
];

function Titulo({ children, sub }: { children: string; sub?: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-[2rem] font-medium leading-tight sm:text-[2.4rem]" style={{ fontFamily: SERIF }}>
        {children}
      </h2>
      {sub && <p className="mt-2 text-[1.1rem] leading-relaxed opacity-70">{sub}</p>}
    </div>
  );
}

export function PaginaSofia({ alEmpezar }: { alEmpezar: () => void }) {
  const lineas = [
    { t: "Cuidado de la piel", n: PRODUCTOS.filter((p) => p.piel).length, desde: Math.min(...PRODUCTOS.filter((p) => p.piel).map((p) => p.precio)) },
    { t: "Maquillaje", n: PRODUCTOS.filter((p) => !p.piel).length, desde: Math.min(...PRODUCTOS.filter((p) => !p.piel).map((p) => p.precio)) },
    { t: "Fragancias", n: 6, desde: 240 },
    { t: "Cuerpo y manos", n: 5, desde: 95 },
    { t: "Caballeros", n: 4, desde: 130 },
    { t: "Sets de regalo", n: 8, desde: 199 },
  ];

  return (
    <div className="border-t" style={{ borderColor: LINEA }}>
      <Tienda />

      {/* quién es */}
      <section className="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:gap-14 md:py-20">
        <img src={estudio} alt="Sofía maquillando a una clienta" className="aspect-[4/5] w-full object-cover" loading="lazy" />
        <div>
          <Titulo>Soy Sofía, y esto lo hago desde hace 6 años</Titulo>
          <p className="mt-5 text-[1.15rem] leading-relaxed opacity-80">
            Empecé vendiendo a mis vecinas para ayudar en la casa. Hoy acompaño a más de cien clientas en la ciudad, y a muchas las conozco desde su primer facial.
          </p>
          <p className="mt-4 text-[1.15rem] leading-relaxed opacity-80">
            No te voy a vender lo que no necesitas. Primero veo tu piel, te enseño a usar cada producto y después te escribo para saber cómo te fue.
          </p>
          <dl className="mt-8 grid grid-cols-3 border-y" style={{ borderColor: LINEA }}>
            {[
              ["6 años", "como consultora"],
              ["120", "clientas"],
              ["48 h", "para entregar"],
            ].map(([n, t], i) => (
              <div key={t} className={`py-4 ${i ? "border-l pl-4" : "pr-4"}`} style={{ borderColor: LINEA }}>
                <dt className="text-[1.6rem] leading-none" style={{ fontFamily: SERIF }}>{n}</dt>
                <dd className="mt-1.5 text-[0.95rem] leading-tight opacity-65">{t}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* lo que ofrece */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
          <Titulo sub="Todo lo puedes apartar por WhatsApp. Yo voy a tu casa o tú vienes a la mía.">Lo que hago por ti</Titulo>
          <div className="mt-10 grid gap-x-10 md:grid-cols-2">
            {SERVICIOS.map((s) => (
              <article key={s.t} className="border-t py-6" style={{ borderColor: TINTA }}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-[1.35rem] font-medium" style={{ fontFamily: SERIF }}>{s.t}</h3>
                  <span className="text-[1.05rem] font-semibold" style={{ color: VINO }}>{s.precio}</span>
                </div>
                <p className="mt-1 text-[0.95rem] opacity-60">{s.dura}</p>
                <p className="mt-3 text-[1.05rem] leading-relaxed opacity-80">{s.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* trabajos */}
      <section className="mx-auto max-w-5xl px-5 py-16 md:py-20">
        <Titulo sub="Algunos maquillajes de este año. Las fotos son de mis clientas, con su permiso.">Mis trabajos</Titulo>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {TRABAJOS.map((t, i) => (
            <figure key={i}>
              <img src={t.foto} alt={`${t.t}: ${t.d}`} className="aspect-[4/5] w-full object-cover" loading="lazy" />
              <figcaption className="mt-2 leading-tight">
                <span className="block text-[1.05rem] font-semibold">{t.t}</span>
                <span className="block text-[0.95rem] opacity-60">{t.d}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* opiniones y garantía */}
      <section className="mx-auto max-w-5xl px-5 pb-16 md:pb-20">
        <Titulo>Lo que dicen mis clientas</Titulo>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {OPINIONES.map((o) => (
            <figure key={o.quien} className="border-t-2 pt-4" style={{ borderColor: TINTA }}>
              <blockquote className="text-[1.1rem] leading-relaxed">“{o.d}”</blockquote>
              <figcaption className="mt-3 text-[0.98rem] opacity-60">{o.quien}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 flex items-start gap-4 bg-white p-5">
          <ShieldCheck size={28} className="shrink-0" style={{ color: VINO }} />
          <p className="text-[1.05rem] leading-relaxed">
            <b>Todo es original</b>, comprado directo a la marca y con su sello. Si un producto no te gusta o no te queda, te lo cambio por otro.
          </p>
        </div>
      </section>

      {/* lo que maneja */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
          <Titulo sub="Productos originales, con su garantía. Si algo no lo tengo en mano, te lo consigo en la semana.">Lo que manejo</Titulo>
          <ul className="mt-10 grid grid-cols-2 border-l border-t md:grid-cols-3" style={{ borderColor: LINEA }}>
            {lineas.map((l) => (
              <li key={l.t} className="border-b border-r p-4 sm:p-5" style={{ borderColor: LINEA }}>
                <p className="text-[1.2rem] font-medium leading-tight" style={{ fontFamily: SERIF }}>{l.t}</p>
                <p className="mt-1.5 text-[0.95rem] opacity-65">
                  {l.n} productos · desde {qz(l.desde)}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-[1rem] opacity-60">Marcas con las que trabajo</p>
          <ul className="mt-3 flex flex-wrap gap-x-10 gap-y-4">
            {MARCAS.map((m) => (
              <li key={m.nombre} className="leading-tight">
                <span className="block text-[1.5rem]" style={{ fontFamily: SERIF }}>{m.nombre}</span>
                <span className="block text-[0.92rem] opacity-60">{m.que}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* cómo trabaja */}
      <section className="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.3fr] md:py-20">
        <Titulo sub="Lo que me preguntan antes de pedir.">Cómo trabajo</Titulo>
        <dl className="border-t" style={{ borderColor: TINTA }}>
          {COMO.map(([k, v]) => (
            <div key={k} className="grid gap-1 border-b py-4 sm:grid-cols-[12rem_1fr] sm:gap-4" style={{ borderColor: LINEA }}>
              <dt className="font-semibold">{k}</dt>
              <dd className="leading-relaxed opacity-80">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* avisos de promos y equipo */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-5xl gap-14 px-5 py-16 md:grid-cols-2 md:py-20">
          <Avisame />
          <Unete />
        </div>
      </section>

      {/* cierre */}
      <section className="text-white" style={{ background: TINTA }}>
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-[2rem] font-medium leading-tight !text-white" style={{ fontFamily: SERIF }}>
              ¿Empezamos con tu perfil?
            </h2>
            <p className="mt-2 text-[1.1rem] text-white/70">En 3 minutos sabes qué usar en la mañana y en la noche. Y te llevo tu muestra gratis.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={alEmpezar} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-[1.15rem] font-semibold text-black">
              Hacer mi perfil <ArrowRight size={20} />
            </button>
            <span className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-7 py-4 text-[1.1rem] font-semibold">
              <MessageCircle size={19} /> 5555 0101
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

const claseCampo = "w-full rounded-md border-2 border-black/20 bg-white px-4 py-3 text-[1.1rem] outline-none focus:border-black/80 placeholder:text-black/35";

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
        <h2 className="text-[2rem] font-medium leading-tight" style={{ fontFamily: SERIF }}>¡Listo, {nombre.split(" ")[0]}!</h2>
        <p className="mt-3 text-[1.1rem] leading-relaxed opacity-75">Te aviso por WhatsApp solo de {temas.join(", ").toLowerCase()}. Nada más.</p>
      </div>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!valido) return;
        agregar({ id: nuevoId(), nombre: nombre.trim(), telefono: tel.replace(/\D/g, ""), temas, fecha: new Date().toISOString() });
        setListo(true);
      }}
    >
      <h2 className="text-[2rem] font-medium leading-tight" style={{ fontFamily: SERIF }}>Avísame de las promos</h2>
      <p className="mt-2 text-[1.05rem] leading-relaxed opacity-70">Cada campaña trae ofertas que duran tres semanas. Elige de qué quieres saber y te escribo solo de eso.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {TEMAS_AVISO.map((t) => {
          const si = temas.includes(t);
          return (
            <button key={t} type="button" aria-pressed={si} onClick={() => setTemas(si ? temas.filter((x) => x !== t) : [...temas, t])} className="inline-flex items-center gap-1 rounded-full border-2 px-4 py-2 font-medium" style={si ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(42,22,51,.25)" }}>
              {si && <Check size={15} strokeWidth={3} />} {t}
            </button>
          );
        })}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" autoComplete="given-name" className={claseCampo} />
        <input value={tel} onChange={(e) => setTel(e.target.value.replace(/[^\d ]/g, "").slice(0, 9))} placeholder="Tu WhatsApp" inputMode="numeric" autoComplete="tel" className={claseCampo} />
      </div>
      <button type="submit" disabled={!valido} className="mt-4 rounded-full px-6 py-3.5 text-[1.05rem] font-semibold text-white disabled:opacity-40" style={{ background: TINTA }}>
        Quiero que me avises
      </button>
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
        <h2 className="text-[2rem] font-medium leading-tight" style={{ fontFamily: SERIF }}>Gracias, {nombre.split(" ")[0]}</h2>
        <p className="mt-3 text-[1.1rem] leading-relaxed opacity-75">Te escribo esta semana para contarte cómo funciona, sin compromiso.</p>
      </div>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!valido) return;
        agregar({ id: nuevoId(), nombre: nombre.trim(), telefono: tel.replace(/\D/g, ""), por, fecha: new Date().toISOString() });
        setListo(true);
      }}
    >
      <h2 className="text-[2rem] font-medium leading-tight" style={{ fontFamily: SERIF }}>¿Te gustaría vender conmigo?</h2>
      <p className="mt-2 text-[1.05rem] leading-relaxed opacity-70">
        Así empecé yo. Tú pones tus horarios, yo te enseño y te acompaño en tus primeras reuniones. Cuéntame qué te llama la atención y te explico, sin compromiso. — {CONSULTORA.corto}
      </p>
      <div className="mt-5 grid gap-2">
        {RAZONES_EQUIPO.map((r) => (
          <button key={r} type="button" aria-pressed={por === r} onClick={() => setPor(r)} className="flex items-center gap-3 border-2 px-4 py-3 text-left font-medium" style={{ borderColor: por === r ? TINTA : "rgba(42,22,51,.18)", background: por === r ? "#fde6da" : "transparent" }}>
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2" style={{ borderColor: por === r ? VINO : "rgba(42,22,51,.4)", background: por === r ? VINO : "transparent" }}>
              {por === r && <Check size={14} strokeWidth={3} className="text-white" />}
            </span>
            {r}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" autoComplete="given-name" className={claseCampo} />
        <input value={tel} onChange={(e) => setTel(e.target.value.replace(/[^\d ]/g, "").slice(0, 9))} placeholder="Tu WhatsApp" inputMode="numeric" autoComplete="tel" className={claseCampo} />
      </div>
      <button type="submit" disabled={!valido} className="mt-4 rounded-full px-6 py-3.5 text-[1.05rem] font-semibold text-white disabled:opacity-40" style={{ background: VINO }}>
        Quiero saber más
      </button>
    </form>
  );
}
