/*
 * /web — página para mandar por DM de Instagram a clínicas y negocios de
 * Guatemala que todavía no tienen página web.
 * Navbar → Portada con maqueta → Comparativa → Portafolio → Paquetes →
 * Por qué conmigo → Cierre. Mismo estilo que la Home (marino + verde, usted).
 */
import { useEffect } from "react";
import { Check, X, ArrowRight, MapPin, Clock, Star } from "lucide-react";
import { Logo } from "@/components/Logo";
import { IconoWhatsApp, Pie } from "@/components/Secciones";
import { activarAparecer } from "@/lib/aparecer";
import { EMAIL, WHATSAPP_DISPLAY, whatsappLink } from "@/data/site";
import { DEMOS, PAQUETES, WA_COTIZAR_WEB } from "@/data/web";

export default function PaginaWeb() {
  useEffect(() => activarAparecer(), []);

  return (
    <>
      <a href="#inicio" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded">
        Ir al contenido
      </a>
      <Barra />
      <main>
        <Portada />
        <Comparativa />
        <Portafolio />
        <Paquetes />
        <Confianza />
        <Cierre />
      </main>
      <Pie />
    </>
  );
}

function Barra() {
  return (
    <header className="sticky top-0 z-40 bg-crema/95 backdrop-blur border-b border-linea">
      <div className="contenedor flex items-center justify-between gap-4 h-16">
        <Logo href="/" />
        <a href="#precios" className="btn btn-principal !min-h-[40px] !px-4 !py-2 !text-[0.92rem]">
          Cotizar mi web
        </a>
      </div>
    </header>
  );
}

function Portada() {
  return (
    <section id="inicio" className="portada-papel border-b border-linea overflow-hidden">
      <div className="contenedor grid lg:grid-cols-[1fr_1fr] gap-14 lg:gap-10 items-center pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div>
          <p className="inline-flex items-center rounded-full border border-acento/30 bg-white px-3.5 py-1.5 text-[0.85rem] font-semibold text-acento">
            Para clínicas y negocios que venden en redes sociales
          </p>
          <h1 className="mt-5 text-[2.3rem] sm:text-[3rem] lg:text-[3.2rem] leading-[1.06]">
            Sus redes sociales atraen clientes. <span className="text-acento">Su página web los cierra.</span>
          </h1>
          <p className="mt-6 text-[1.08rem] sm:text-[1.15rem] text-texto max-w-xl">
            Deje de perder ventas respondiendo precios por DM o usando enlaces genéricos. Diseño su página web profesional, rápida y conectada directo a su WhatsApp para que agende más citas y proyecte la autoridad que su marca merece.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#precios" className="btn btn-principal">
              Ver paquetes y precios
            </a>
            <a href="#ejemplos" className="btn btn-secundario">
              Ver ejemplos reales
            </a>
          </div>
        </div>
        <Maqueta />
      </div>
    </section>
  );
}

/* Maqueta de una clínica de ejemplo: navegador atrás, celular adelante. */
function Maqueta() {
  return (
    <figure className="relative mx-auto w-full max-w-[560px] pb-10 sm:pb-6" aria-label="Ejemplo de página web para una clínica dental, en computadora y en celular">
      {/* navegador */}
      <div className="w-[80%] sm:w-full rounded-xl border border-linea bg-white shadow-[0_20px_50px_-20px_rgba(42,32,27,.3)] overflow-hidden" aria-hidden>
        <div className="flex items-center gap-2 px-3 h-9 bg-fondo border-b border-linea">
          <span className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]" />
          <span className="ml-3 flex-1 max-w-[220px] h-5 rounded bg-white border border-linea text-[0.62rem] text-suave px-2 leading-5 truncate">
            clinicaaurora.com
          </span>
        </div>
        <div className="grid sm:grid-cols-[1.15fr_1fr]">
          <div className="p-4 pr-[28%] sm:p-6">
            <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-acento">Clínica dental y estética</p>
            <p className="mt-1.5 font-[family-name:var(--font-titulo)] font-bold text-tinta text-[1.05rem] sm:text-[1.25rem] leading-tight">
              Una sonrisa sana, sin esperas.
            </p>
            <p className="mt-2 text-[0.68rem] text-suave leading-snug">Limpiezas, blanqueamiento, ortodoncia y diseño de sonrisa.</p>
            <div className="mt-3 flex gap-1.5">
              <span className="rounded-md bg-acento text-white text-[0.6rem] font-semibold px-2.5 py-1.5">Agendar cita</span>
              <span className="rounded-md border border-linea text-marino text-[0.6rem] font-semibold px-2.5 py-1.5">Ver precios</span>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[["Limpieza", "Q250"], ["Blanqueamiento", "Q900"], ["Valoración", "Q150"]].map(([s, p]) => (
                <div key={s} className="rounded-md border border-linea p-1.5 last:hidden sm:last:block">
                  <p className="text-[0.52rem] text-suave truncate">{s}</p>
                  <p className="text-[0.7rem] font-bold text-marino">{p}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden sm:block bg-[linear-gradient(160deg,#dbe7f3,#eef3f8)] relative">
            <div className="absolute inset-4 rounded-lg bg-white/70 border border-white grid place-items-start p-4">
              <svg viewBox="0 0 64 64" className="w-14 h-14 text-marino/70" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c-6 0-10 5-10 12 0 9 4 12 5 22 1 7 3 12 6 12 4 0 3-12 11-12s7 12 11 12c3 0 5-5 6-12 1-10 5-13 5-22 0-7-4-12-10-12-5 0-7 3-12 3s-7-3-12-3Z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 px-4 sm:px-6 py-2.5 border-t border-linea text-[0.6rem] text-suave">
          <span className="inline-flex items-center gap-1"><MapPin size={11} /> Zona 10, Guatemala</span>
          <span className="hidden sm:inline-flex items-center gap-1"><Clock size={11} /> L–S 8:00 a 18:00</span>
          <span className="hidden sm:inline-flex items-center gap-1"><Star size={11} /> Resultados reales</span>
        </div>
      </div>

      {/* celular */}
      <div className="absolute -bottom-2 right-0 sm:-right-4 w-[44%] sm:w-[36%] max-w-[190px] rounded-[1.6rem] border-[5px] border-tinta bg-white shadow-[0_24px_50px_-18px_rgba(42,32,27,.5)] overflow-hidden" aria-hidden>
        <div className="mx-auto mt-1.5 h-1.5 w-10 rounded-full bg-tinta/90" />
        <div className="px-3 pt-3 pb-14">
          <p className="text-[0.5rem] font-semibold uppercase tracking-wider text-acento">Clínica Aurora</p>
          <p className="mt-1 font-[family-name:var(--font-titulo)] font-bold text-tinta text-[0.8rem] leading-tight">Una sonrisa sana, sin esperas.</p>
          <div className="mt-2.5 h-14 rounded-md bg-[linear-gradient(160deg,#dbe7f3,#eef3f8)]" />
          <div className="mt-2 space-y-1">
            {[["Limpieza", "Q250"], ["Blanqueamiento", "Q900"]].map(([s, p]) => (
              <div key={s} className="flex justify-between rounded border border-linea px-1.5 py-1 text-[0.5rem]">
                <span className="text-suave">{s}</span>
                <span className="font-bold text-marino">{p}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-center gap-1 rounded-full bg-[#25d366] text-white text-[0.55rem] font-bold py-1.5 shadow-md whitespace-nowrap">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z" /></svg>
          Agendar por WhatsApp
        </div>
      </div>

      <figcaption className="absolute -bottom-1 left-0 sm:left-1 nota-mano text-[1.15rem] text-suave">Ejemplo de diseño</figcaption>
    </figure>
  );
}

function Comparativa() {
  const hoy = [
    "Le preguntan \"¿precio?\" por DM y, al responder, lo dejan en visto.",
    "El cliente desconfía de transferir sin una página que respalde su negocio.",
    "Su competencia, con página propia, se ve más formal que usted.",
  ];
  const conWeb = [
    "Servicios, precios y ubicación claros las 24 horas, aunque usted esté ocupado.",
    "Botones directo a WhatsApp con el mensaje listo: el cliente solo toca y escribe.",
    "Aparece en Google con una presencia profesional que da confianza.",
  ];
  return (
    <section className="py-16 sm:py-24" aria-labelledby="comparativa-titulo">
      <div className="contenedor">
        <div className="max-w-2xl aparece">
          <p className="etiqueta">Por qué su Instagram necesita una web</p>
          <h2 id="comparativa-titulo" className="mt-3 text-[1.75rem] sm:text-[2.2rem]">
            Instagram le trae la atención. La página le trae la confianza.
          </h2>
        </div>
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-linea bg-fondo p-6 sm:p-8 aparece">
            <h3 className="text-[1.15rem] text-suave">Hoy: solo Instagram / Linktree</h3>
            <ul className="mt-5 space-y-4">
              {hoy.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 grid place-items-center w-6 h-6 shrink-0 rounded-full bg-[#fde8e8] text-[#b42318]"><X size={14} strokeWidth={3} /></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border-2 border-acento bg-white p-6 sm:p-8 aparece">
            <h3 className="text-[1.15rem] text-marino">Con su web de Jzet Labs</h3>
            <ul className="mt-5 space-y-4">
              {conWeb.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 grid place-items-center w-6 h-6 shrink-0 rounded-full bg-acento/10 text-acento"><Check size={14} strokeWidth={3} /></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function VistaPrevia({ estilo }: { estilo: (typeof DEMOS)[number]["estilo"] }) {
  const colores = {
    clinica: { fondo: "bg-[linear-gradient(160deg,#dbe7f3,#eef3f8)]", acento: "bg-acento" },
    tienda: { fondo: "bg-[linear-gradient(160deg,#f6e7d8,#fbf4ec)]", acento: "bg-marino" },
    servicios: { fondo: "bg-[linear-gradient(160deg,#e3e7ee,#f4f6f9)]", acento: "bg-marino" },
  }[estilo];
  return (
    <div className={`aspect-[16/10] ${colores.fondo} p-4 sm:p-5`} aria-hidden>
      <div className="h-full rounded-lg bg-white/85 border border-white p-3 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="h-2 w-12 rounded bg-marino/70" />
          <span className="flex gap-1.5">
            <span className="h-1.5 w-6 rounded bg-linea" />
            <span className="h-1.5 w-6 rounded bg-linea" />
            <span className="h-1.5 w-6 rounded bg-linea" />
          </span>
        </div>
        <span className="mt-4 h-3 w-3/4 rounded bg-tinta/80" />
        <span className="mt-1.5 h-3 w-1/2 rounded bg-tinta/80" />
        <span className="mt-3 h-1.5 w-2/3 rounded bg-linea" />
        <span className={`mt-3 h-4 w-20 rounded ${colores.acento}`} />
        <div className="mt-auto grid grid-cols-3 gap-1.5">
          {estilo === "tienda"
            ? [0, 1, 2].map((i) => <span key={i} className="h-7 rounded bg-[#f1e4d6]" />)
            : [0, 1, 2].map((i) => <span key={i} className="h-7 rounded border border-linea" />)}
        </div>
      </div>
    </div>
  );
}

function Portafolio() {
  return (
    <section id="ejemplos" className="py-16 sm:py-24 bg-fondo border-y border-linea scroll-mt-16" aria-labelledby="ejemplos-titulo">
      <div className="contenedor">
        <div className="max-w-2xl aparece">
          <p className="etiqueta">Ejemplos</p>
          <h2 id="ejemplos-titulo" className="mt-3 text-[1.75rem] sm:text-[2.2rem]">
            Así se verá su negocio en internet
          </h2>
          <p className="mt-3 text-suave">Ábralas desde su celular: así las van a ver sus clientes.</p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMOS.map((d) => (
            <article key={d.categoria} className="rounded-xl border border-linea bg-white overflow-hidden flex flex-col aparece">
              <VistaPrevia estilo={d.estilo} />
              <div className="p-5 flex flex-col flex-1">
                <p className="etiqueta !text-[0.72rem]">{d.categoria}</p>
                <h3 className="mt-1.5 text-[1.1rem]">{d.titulo}</h3>
                {d.url ? (
                  <a href={d.url} target="_blank" rel="noopener noreferrer" className="mt-5 btn btn-secundario !min-h-[44px] self-start">
                    Ver demo en vivo <ArrowRight size={16} />
                  </a>
                ) : (
                  <span className="mt-5 btn btn-secundario !min-h-[44px] self-start opacity-60 cursor-default">Demo muy pronto</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Paquetes() {
  return (
    <section id="precios" className="py-16 sm:py-24 scroll-mt-16" aria-labelledby="precios-titulo">
      <div className="contenedor">
        <div className="max-w-2xl aparece">
          <p className="etiqueta">Paquetes de inversión</p>
          <h2 id="precios-titulo" className="mt-3 text-[1.75rem] sm:text-[2.2rem]">
            Pago único, sin mensualidades obligatorias.
          </h2>
          <p className="mt-3 text-suave">Usted paga una vez y la página es suya. El dominio y el servidor quedan a su nombre.</p>
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-6 items-stretch">
          {PAQUETES.map((p) => (
            <article
              key={p.id}
              className={`relative rounded-xl bg-white p-6 sm:p-7 flex flex-col aparece ${p.destacado ? "border-2 border-acento shadow-[0_18px_40px_-22px_rgba(200,73,15,.45)]" : "border border-linea"}`}
            >
              {p.destacado && (
                <span className="absolute -top-3 left-6 rounded-full bg-acento text-white text-[0.75rem] font-semibold px-3 py-1">Más elegido</span>
              )}
              <h3 className="text-[1.2rem]">{p.nombre}</h3>
              <p className="mt-1.5 text-suave text-[0.95rem]">{p.ideal}</p>
              <p className="mt-5 text-marino">
                <span className="text-[0.9rem] text-suave">desde </span>
                <span className="font-[family-name:var(--font-titulo)] font-bold text-[2.2rem] leading-none">{p.precio}</span>
              </p>
              <p className="mt-1 text-sm text-suave">Entrega en {p.tiempo} hábiles</p>
              <ul className="mt-5 space-y-2.5 flex-1">
                {p.incluye.map((i) => (
                  <li key={i} className="flex gap-2.5 text-[0.97rem]">
                    <Check size={18} className="mt-0.5 shrink-0 text-acento" strokeWidth={2.5} />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <a
                href={whatsappLink(`Hola, Joshua. Me interesa el paquete "${p.nombre}" para mi negocio.`)}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-7 btn ${p.destacado ? "btn-principal" : "btn-secundario"}`}
              >
                <IconoWhatsApp /> Quiero este paquete
              </a>
            </article>
          ))}
        </div>

        <p className="mt-8 text-sm text-suave max-w-3xl aparece">
          Días hábiles desde que recibo sus textos y fotos. Pague en una sola vez (3% de descuento), en 2 pagos o en 3 a 4 meses sin recargo. Precios más 5% de factura. Contrato formal con firmas legalizadas opcional, +Q250.
        </p>
      </div>
    </section>
  );
}

function Confianza() {
  const puntos = [
    { titulo: "Trato directo conmigo de principio a fin", texto: "Usted habla conmigo: yo diseño, yo programo y yo le respondo. Sin intermediarios." },
    { titulo: "Diseñada 100% para celulares", texto: "Sus clientes llegan desde Instagram en el celular. La página está pensada primero para ellos." },
    { titulo: "Capacitación incluida", texto: "Le explico cómo funciona su página al entregarla, y el primer mes los cambios de textos o precios van por mi cuenta." },
  ];
  return (
    <section className="py-16 sm:py-24 bg-fondo border-y border-linea" aria-labelledby="confianza-titulo">
      <div className="contenedor grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-start">
        <div className="aparece">
          <p className="etiqueta">Por qué trabajar conmigo</p>
          <div className="mt-5 flex items-center gap-5">
            {/* FOTO: cuando Josh mande su foto, cambiar este círculo por <img src={foto} … /> */}
            <div className="grid place-items-center w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-full bg-marino text-white font-[family-name:var(--font-titulo)] font-bold text-[2.2rem]" aria-hidden>
              J
            </div>
            <div>
              <p className="nota-mano text-acento text-[2rem]">Hola, soy Joshua.</p>
              <p className="text-suave text-[0.95rem]">Hago páginas web y sistemas para negocios en Guatemala.</p>
            </div>
          </div>
          <h2 id="confianza-titulo" className="mt-6 text-[1.6rem] sm:text-[2rem]">
            Una página hecha para su negocio, no una plantilla más.
          </h2>
        </div>
        <ul className="divide-y divide-linea">
          {puntos.map((r) => (
            <li key={r.titulo} className="py-5 first:pt-0 aparece">
              <h3 className="text-[1.15rem]">{r.titulo}</h3>
              <p className="mt-1.5 text-suave">{r.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Cierre() {
  return (
    <section id="contacto" className="bg-marino text-white" aria-labelledby="cierre-titulo">
      <div className="contenedor py-16 sm:py-20 grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
        <div className="aparece">
          <h2 id="cierre-titulo" className="text-white text-[1.75rem] sm:text-[2.3rem]">
            ¿Listo para que su negocio deje de verse como un perfil más?
          </h2>
          <p className="mt-4 text-white/85 max-w-xl">
            Escríbame por WhatsApp, le hago unas preguntas sobre su negocio y le digo qué paquete le conviene, con tiempo y costo claros.
          </p>
        </div>
        <div className="flex flex-col gap-3 aparece">
          <a href={WA_COTIZAR_WEB} target="_blank" rel="noopener noreferrer" className="btn btn-principal !text-[1.1rem] !min-h-[58px]">
            <IconoWhatsApp /> Escribirme al {WHATSAPP_DISPLAY}
          </a>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("Cotización de página web")}`}
            className="btn !min-h-[50px] bg-white text-marino hover:bg-white/90"
          >
            {EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
