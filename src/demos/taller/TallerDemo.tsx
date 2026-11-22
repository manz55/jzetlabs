/*
 * Demo: "Taller Torque" (negocio inventado, datos de ejemplo).
 * Dos partes, cada una resuelve un problema real que se vio en talleres de verdad:
 *  - Página: "¿puedo seguir manejando?", precios en rango, auxilio a domicilio por zona,
 *    antes y después de enderezado y pintura, y seguimiento del carro con su placa.
 *  - Taller: las órdenes del día con aviso al cliente en cada paso y recordatorios de aceite.
 * Estructura de cada página: portada, presentación, ventas, reseñas, ubicación y legal.
 */
import { useEffect, useState } from "react";
import PanelTorque from "./PanelTorque";
import { ArrowRight, Bell, Camera, Check, Clock, FileText, MapPin, Phone, ShieldCheck, Star, Wrench } from "lucide-react";
import { BandaDemos, PartesDemo, CierreJzet, MensajeWhatsApp, qz } from "../comun";
import {
  ACERO, AMARILLO, AMBAR, ASFALTO, BLANCO, CARRO, DISTRIBUCION, MODELOS, PASOS, QUE_HACER, RESENAS, ROJO,
  SERVICIOS, SINTOMAS, TITULO, VERDE, ZONAS,
  type Nivel, type ServicioId,
} from "./datos";

const TEL = "2430 5521";
const btn = "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 font-bold uppercase tracking-wide transition active:scale-[0.98]";
const franja = `repeating-linear-gradient(-45deg, ${AMARILLO} 0 14px, ${ASFALTO} 14px 28px)`;

const ESTILOS = `
.torque h1, .torque h2, .torque h3 { color: inherit; }
.torque-titulo { font-family: ${TITULO}; font-weight: 800; text-transform: uppercase; line-height: .98; letter-spacing: .005em; }
.torque-dos { display: grid; gap: 1.5rem; }
@media (min-width: 960px) { .torque-dos { grid-template-columns: 1fr 1fr; } }
.torque-hero { display: grid; gap: 2.5rem; }
@media (min-width: 960px) { .torque-hero { grid-template-columns: 1.1fr 1fr; align-items: center; } }
/* la orden de trabajo: papel con borde de tablilla */
.orden { background: #fff; border: 2px solid ${ASFALTO}; border-radius: 6px; box-shadow: 8px 8px 0 ${AMARILLO}; }
`;

function Logo({ tam = 40 }: { tam?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={tam} height={tam} aria-hidden className="shrink-0">
      <rect width="48" height="48" rx="8" fill={ASFALTO} />
      <path d="M14 14 H34 V20 H27 V36 H21 V20 H14 Z" fill={AMARILLO} />
    </svg>
  );
}
function Marca() {
  return (
    <span className="flex items-center gap-2.5">
      <Logo />
      <span className="leading-none">
        <span className="torque-titulo block text-[1.55rem]">Taller Torque</span>
        <span className="hidden whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-wider opacity-65 min-[480px]:block">Mecánica · Pintura · Auxilio 24 h</span>
      </span>
    </span>
  );
}

type Vista = "pagina" | "taller";

export default function TallerDemo() {
  const leer = (): Vista => (location.hash === "#taller" ? "taller" : "pagina");
  const [vista, setVista] = useState<Vista>(leer);
  useEffect(() => {
    const cambio = () => setVista(leer());
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", vista === "pagina" ? location.pathname : `#${vista}`);
    document.title = vista === "taller" ? "Panel · Taller Torque" : "Taller Torque · Demo de Jzet Labs";
    window.scrollTo(0, 0);
  }, [vista]);

  return (
    <div className="torque min-h-screen" style={{ background: BLANCO, color: ASFALTO, fontFamily: "'Libre Franklin', system-ui, sans-serif" }}>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <PartesDemo
        fondo={ASFALTO}
        actual={vista}
        alCambiar={setVista}
        partes={[
          { id: "pagina", nombre: "Página", quien: "Precios, auxilio a domicilio y seguimiento del carro" },
          { id: "taller", nombre: "Panel del taller", quien: "Hoy, órdenes, clientes, mensajes, reseñas y reportes" },
        ] as const}
      />
      {vista === "pagina" ? <Pagina /> : <PanelTorque />}
      <CierreJzet demo="taller mecánico" />
    </div>
  );
}

/* ---------------- la página ---------------- */

function Pagina() {
  const [marcados, setMarcados] = useState<string[]>([]);
  const [servicio, setServicio] = useState<ServicioId>("frenos");
  const [modelo, setModelo] = useState(MODELOS[0]);
  const [anio, setAnio] = useState("");
  const [nombre, setNombre] = useState("");
  const [falla, setFalla] = useState("");
  const [error, setError] = useState("");
  const [zona, setZona] = useState(ZONAS[0].id);
  const [donde, setDonde] = useState("");
  const [errorAux, setErrorAux] = useState("");
  const [corte, setCorte] = useState(50);
  const [placa, setPlaca] = useState("");
  const [carro, setCarro] = useState(false);
  const [errorPlaca, setErrorPlaca] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const niveles = marcados.map((id) => SINTOMAS.find((s) => s.id === id)!.nivel);
  const nivel: Nivel | null = niveles.includes("rojo") ? "rojo" : niveles.includes("ambar") ? "ambar" : niveles.length ? "verde" : null;
  const color = (n: Nivel) => (n === "rojo" ? ROJO : n === "ambar" ? AMBAR : VERDE);
  const sv = SERVICIOS.find((x) => x.id === servicio)!;
  const z = ZONAS.find((x) => x.id === zona)!;
  const total = DISTRIBUCION.reduce((a, b) => a + b.n, 0);
  const promedio = DISTRIBUCION.reduce((a, b) => a + b.e * b.n, 0) / total;

  function cotizar() {
    if (!nombre.trim()) return setError("Escriba su nombre.");
    setError("");
    setMsg(`Hola, Taller Torque. Soy ${nombre.trim()}. Mi ${modelo}${anio.trim() ? ` ${anio.trim()}` : ""} necesita: ${sv.nombre.toLowerCase()}.${falla.trim() ? `\nLo que le pasa: ${falla.trim()}.` : ""}\n¿Me pueden dar un precio?`);
  }
  function auxilio() {
    if (!donde.trim()) return setErrorAux("Diga dónde está el carro (colonia, calle o punto de referencia).");
    setErrorAux("");
    setMsg(`¡Auxilio! Mi carro está en: ${donde.trim()} (${z.nombre}).${marcados.length ? `\nLo que pasa: ${marcados.map((id) => SINTOMAS.find((s) => s.id === id)!.texto.toLowerCase()).join("; ")}.` : ""}\n¿Cuánto tardan en llegar?`);
  }
  function buscarPlaca() {
    const limpia = placa.replace(/\s/g, "").toUpperCase();
    if (limpia === CARRO.placa.replace(/\s/g, "")) {
      setCarro(true);
      setErrorPlaca("");
    } else {
      setCarro(false);
      setErrorPlaca(`No encontramos esa placa. En la demo pruebe con ${CARRO.placa}.`);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b-2 backdrop-blur" style={{ background: "rgba(250,250,250,.95)", borderColor: ASFALTO }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#inicio" aria-label="Taller Torque"><Marca /></a>
          <nav className="hidden gap-6 text-[0.95rem] font-bold uppercase tracking-wide lg:flex">
            <a href="#manejar" className="hover:underline">¿Puedo manejar?</a>
            <a href="#servicios" className="hover:underline">Precios</a>
            <a href="#domicilio" className="hover:underline">A domicilio</a>
            <a href="#pintura" className="hover:underline">Pintura</a>
            <a href="#seguimiento" className="hover:underline">Mi carro</a>
          </nav>
          <a href={`tel:+502${TEL.replace(" ", "")}`} className={`${btn} shrink-0 whitespace-nowrap !px-4 !py-2.5`} style={{ background: AMARILLO, color: ASFALTO }}>
            <Phone size={16} /> {TEL}
          </a>
        </div>
        <div className="h-2" style={{ background: franja }} aria-hidden />
      </header>

      {/* portada */}
      <section id="inicio" className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <div className="torque-hero">
          <div>
            <p className="inline-flex items-center gap-2 text-[0.9rem] font-bold uppercase tracking-wider"><Clock size={16} /> Auxilio a domicilio las 24 horas</p>
            <h1 className="torque-titulo mt-3 text-[3rem] sm:text-[4.4rem]">Su carro listo, con el precio claro antes de tocarlo.</h1>
            <p className="mt-5 max-w-lg text-[1.08rem] leading-relaxed opacity-85">
              Sepa si puede seguir manejando, pida su cotización por WhatsApp, vea cómo va su carro con la placa y, si se queda botado, vamos a donde esté.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#manejar" className={btn} style={{ background: ASFALTO, color: "#fff" }}>¿Puedo seguir manejando? <ArrowRight size={18} /></a>
              <a href="#cotizar" className={`${btn} border-2`} style={{ borderColor: ASFALTO }}>Pedir cotización</a>
            </div>
          </div>
          <div className="orden p-5" aria-label="Ejemplo de orden de trabajo">
            <div className="flex items-center justify-between border-b-2 border-dashed pb-3" style={{ borderColor: ASFALTO }}>
              <p className="torque-titulo text-[1.5rem]">Orden #1042</p>
              <span className="rounded px-2.5 py-1 text-[0.8rem] font-bold uppercase" style={{ background: AMARILLO }}>En reparación</span>
            </div>
            <dl className="mt-3 space-y-2 text-[0.98rem]">
              <div className="flex justify-between gap-4"><dt className="opacity-65">Placa</dt><dd className="font-bold">{CARRO.placa}</dd></div>
              <div className="flex justify-between gap-4"><dt className="opacity-65">Carro</dt><dd className="font-bold">{CARRO.modelo}</dd></div>
              <div className="flex justify-between gap-4"><dt className="opacity-65">Trabajo</dt><dd className="text-right font-bold">{CARRO.trabajo}</dd></div>
              <div className="flex justify-between gap-4"><dt className="opacity-65">Precio acordado</dt><dd className="font-bold">{qz(CARRO.total)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="opacity-65">Entrega</dt><dd className="font-bold">{CARRO.entrega}</dd></div>
            </dl>
            <p className="mt-4 flex items-center gap-2 rounded px-3 py-2 text-[0.9rem] font-semibold" style={{ background: ACERO }}><Bell size={15} /> Le avisamos por WhatsApp en cada paso.</p>
          </div>
        </div>
      </section>

      {/* presentación */}
      <section className="border-y-2" style={{ background: ACERO, borderColor: ASFALTO }}>
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="torque-dos items-start">
            <div>
              <h2 className="torque-titulo text-[2.4rem]">Un taller de barrio con orden</h2>
              <p className="mt-3 max-w-lg leading-relaxed opacity-85">
                Taller Torque nació hace 9 años en Mixco. Somos 5 mecánicos que arreglan de todo: frenos, suspensión, motor, electricidad, golpes y pintura. Trabajamos con carros de todas las marcas.
              </p>
              <p className="mt-3 max-w-lg leading-relaxed opacity-85">
                Lo que nos hace distintos es simple: le decimos el precio antes de empezar y usted decide.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                { t: "Precio antes de empezar", x: "Le damos el costo por escrito. Si encontramos algo más, le preguntamos antes de hacerlo." },
                { t: "Le devolvemos la pieza vieja", x: "Así comprueba que sí se cambió y ve por qué estaba mala." },
                { t: "Garantía por escrito", x: "De 1 mes a 1 año según el trabajo. Si falla, vuelve y lo vemos sin costo de mano de obra." },
              ].map((c) => (
                <div key={c.t} className="rounded-md border-2 bg-white p-4" style={{ borderColor: ASFALTO }}>
                  <p className="flex items-center gap-2 font-bold uppercase tracking-wide"><Check size={18} style={{ color: VERDE }} /> {c.t}</p>
                  <p className="mt-1 text-[0.95rem] opacity-80">{c.x}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ¿puedo seguir manejando? */}
      <section id="manejar" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-12">
        <div className="torque-dos">
          <div>
            <h2 className="torque-titulo text-[2.4rem]">¿Puedo seguir manejando?</h2>
            <p className="mt-2 max-w-md opacity-80">Marque lo que le pasa al carro y le decimos qué hacer. Es una guía, no un diagnóstico.</p>
            <div className="mt-5 space-y-2" role="group" aria-label="Síntomas del carro">
              {SINTOMAS.map((s) => {
                const on = marcados.includes(s.id);
                return (
                  <label key={s.id} className="flex cursor-pointer items-start gap-3 rounded-md border-2 bg-white px-4 py-3" style={{ borderColor: on ? ASFALTO : "rgba(21,23,28,.15)" }}>
                    <input type="checkbox" className="mt-1 h-5 w-5 accent-[#15171c]" checked={on} onChange={() => setMarcados((l) => (on ? l.filter((x) => x !== s.id) : [...l, s.id]))} />
                    <span>{s.texto}</span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="sticky bottom-3 z-20 self-end lg:top-28 lg:bottom-auto lg:self-start">
            {nivel ? (
              <div className="rounded-md p-5 text-white shadow-[0_12px_40px_-12px_rgba(0,0,0,.45)] lg:p-6 lg:shadow-none" style={{ background: color(nivel) }} role="status">
                <p className="text-[0.9rem] font-bold uppercase tracking-wider opacity-90">{nivel === "rojo" ? "No lo maneje" : nivel === "ambar" ? "Con cuidado" : "Sin prisa"}</p>
                <p className="torque-titulo mt-1 text-[1.9rem] lg:text-[2.3rem]">{QUE_HACER[nivel].titulo}</p>
                <p className="mt-2 leading-relaxed">{QUE_HACER[nivel].texto}</p>
                <a href={nivel === "rojo" ? "#domicilio" : "#cotizar"} className={`${btn} mt-5 w-full bg-white`} style={{ color: color(nivel) }}>{QUE_HACER[nivel].accion} <ArrowRight size={18} /></a>
              </div>
            ) : (
              <div className="rounded-md border-2 border-dashed p-6 text-[1.05rem]" style={{ borderColor: "rgba(21,23,28,.35)" }}>Marque uno o más síntomas y aquí le sale qué hacer.</div>
            )}
          </div>
        </div>
      </section>

      {/* ventas: servicios y precios */}
      <section id="servicios" className="scroll-mt-24 border-y-2" style={{ background: ACERO, borderColor: ASFALTO }}>
        <div className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="torque-titulo text-[2.4rem]">Servicios y precios</h2>
          <p className="mt-1 opacity-75">Rangos para carros de uso diario. El precio final se lo confirmamos antes de empezar.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICIOS.map((x) => (
              <div key={x.id} className="flex flex-col rounded-md border-2 bg-white p-4" style={{ borderColor: ASFALTO }}>
                <p className="flex items-center gap-2 font-bold uppercase tracking-wide"><Wrench size={16} /> {x.nombre}</p>
                <p className="torque-titulo mt-2 text-[1.7rem]">{x.desde === x.hasta ? qz(x.desde) : `${qz(x.desde)} a ${qz(x.hasta)}`}</p>
                <p className="mt-1 flex-1 text-[0.92rem] opacity-80">{x.detalle}</p>
                <p className="mt-3 text-[0.82rem] font-semibold opacity-60">Tarda: {x.tiempo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* cotizar */}
      <section id="cotizar" className="scroll-mt-24" style={{ background: AMARILLO }}>
        <div className="mx-auto max-w-3xl px-5 py-12">
          <h2 className="torque-titulo text-[2.4rem]">Pida su cotización por WhatsApp</h2>
          <p className="mt-1 opacity-85">Cuéntenos qué le pasa y le damos un precio sin que tenga que venir.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="text-[0.95rem] font-bold">Su nombre
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" placeholder="Ej. Luis Herrera" className="mt-1 w-full rounded-md border-2 bg-white px-4 py-3 font-normal" style={{ borderColor: ASFALTO }} />
            </label>
            <label className="text-[0.95rem] font-bold">Qué necesita
              <select value={servicio} onChange={(e) => setServicio(e.target.value as ServicioId)} className="mt-1 w-full rounded-md border-2 bg-white px-4 py-3 font-normal" style={{ borderColor: ASFALTO }}>
                {SERVICIOS.map((x) => <option key={x.id} value={x.id}>{x.nombre}</option>)}
              </select>
            </label>
            <label className="text-[0.95rem] font-bold">Modelo
              <select value={modelo} onChange={(e) => setModelo(e.target.value)} className="mt-1 w-full rounded-md border-2 bg-white px-4 py-3 font-normal" style={{ borderColor: ASFALTO }}>
                {MODELOS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </label>
            <label className="text-[0.95rem] font-bold">Año
              <input value={anio} onChange={(e) => setAnio(e.target.value)} inputMode="numeric" placeholder="Ej. 2016" className="mt-1 w-full rounded-md border-2 bg-white px-4 py-3 font-normal" style={{ borderColor: ASFALTO }} />
            </label>
            <label className="text-[0.95rem] font-bold sm:col-span-2">Qué le pasa (opcional)
              <textarea value={falla} onChange={(e) => setFalla(e.target.value)} rows={3} placeholder="Ej. Rechina al frenar desde hace una semana" className="mt-1 w-full rounded-md border-2 bg-white px-4 py-3 font-normal" style={{ borderColor: ASFALTO }} />
            </label>
          </div>
          <p className="mt-4 rounded-md bg-white p-3 text-[0.95rem]" style={{ border: `2px solid ${ASFALTO}` }}>
            <b>{sv.nombre}:</b> {sv.desde === sv.hasta ? qz(sv.desde) : `entre ${qz(sv.desde)} y ${qz(sv.hasta)}`}, según su carro. <Camera size={14} className="mx-1 inline" /> Si manda una foto por WhatsApp, el precio sale más exacto.
          </p>
          {error && <p role="alert" className="mt-3 rounded-md bg-white p-3 font-bold" style={{ color: ROJO }}>{error}</p>}
          <button type="button" onClick={cotizar} className={`${btn} mt-4 w-full`} style={{ background: ASFALTO, color: "#fff" }}>Pedir mi precio</button>
        </div>
      </section>

      {/* a domicilio */}
      <section id="domicilio" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-12">
        <div className="torque-dos items-start">
          <div>
            <h2 className="torque-titulo text-[2.4rem]">Se quedó botado: vamos a donde esté</h2>
            <p className="mt-2 max-w-md opacity-80">Mecánico a domicilio las 24 horas, todos los días. Escoja su zona y vea cuánto tardamos.</p>
            <div className="mt-5 grid gap-2" role="radiogroup" aria-label="Zona">
              {ZONAS.map((x) => (
                <button key={x.id} type="button" role="radio" aria-checked={zona === x.id} onClick={() => setZona(x.id)} className="flex items-center justify-between gap-3 rounded-md border-2 px-4 py-3 text-left font-bold" style={zona === x.id ? { background: ASFALTO, color: "#fff", borderColor: ASFALTO } : { background: "#fff", borderColor: "rgba(21,23,28,.2)" }}>
                  <span>{x.nombre}</span>
                  <span className="whitespace-nowrap text-[0.88rem] font-semibold opacity-80">{x.min}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-md border-2 p-5" style={{ borderColor: ASFALTO, background: ACERO }}>
            <p className="torque-titulo text-[1.6rem]">{z.nombre}</p>
            <p className="mt-2">Llegamos en <b>{z.min}</b>. Visita: <b>{z.visita === 0 ? "sin costo" : qz(z.visita)}</b>{z.visita > 0 && " (se descuenta si hace la reparación con nosotros)"}.</p>
            <label className="mt-4 block text-[0.95rem] font-bold">¿Dónde está el carro?
              <textarea value={donde} onChange={(e) => setDonde(e.target.value)} rows={2} placeholder="Ej. 3a avenida y 5a calle, zona 1 de Mixco, frente a la farmacia" className="mt-1 w-full rounded-md border-2 bg-white px-4 py-3 font-normal" style={{ borderColor: ASFALTO }} />
            </label>
            {errorAux && <p role="alert" className="mt-3 rounded-md bg-white p-3 font-bold" style={{ color: ROJO }}>{errorAux}</p>}
            <button type="button" onClick={auxilio} className={`${btn} mt-4 w-full text-white`} style={{ background: ROJO }}><Phone size={18} /> Pedir auxilio ahora</button>
          </div>
        </div>
      </section>

      {/* antes y después */}
      <section id="pintura" className="scroll-mt-24 border-y-2" style={{ background: ASFALTO, color: "#fff", borderColor: ASFALTO }}>
        <div className="mx-auto max-w-4xl px-5 py-12">
          <h2 className="torque-titulo text-[2.4rem]">Enderezado y pintura: antes y después</h2>
          <p className="mt-1 text-white/75">Mueva la línea y vea la diferencia. Con cotización por foto, desde {qz(600)}.</p>
          <div className="relative mt-6 overflow-hidden rounded-md border-2 border-white/25 bg-[#2a2d34]">
            <Carro despues />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - corte}% 0 0)` }}><Carro despues={false} /></div>
            <div className="pointer-events-none absolute inset-y-0 w-1" style={{ left: `${corte}%`, background: AMARILLO }} aria-hidden />
            <span className="absolute left-3 top-3 rounded bg-black/70 px-2.5 py-1 text-[0.8rem] font-bold uppercase">Antes</span>
            <span className="absolute right-3 top-3 rounded px-2.5 py-1 text-[0.8rem] font-bold uppercase" style={{ background: AMARILLO, color: ASFALTO }}>Después</span>
          </div>
          <input type="range" min={0} max={100} value={corte} onChange={(e) => setCorte(Number(e.target.value))} aria-label="Comparar antes y después" className="mt-4 w-full accent-[#ffc21a]" />
          <p className="mt-2 text-[0.85rem] text-white/60">Dibujo de ejemplo. En su página van las fotos reales de sus trabajos.</p>
        </div>
      </section>

      {/* seguimiento */}
      <section id="seguimiento" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-12">
        <h2 className="torque-titulo text-[2.4rem]">¿Cómo va mi carro?</h2>
        <p className="mt-1 opacity-80">Escriba su placa y vea en qué paso está, cuánto va a pagar y cuándo se lo entregamos.</p>
        <form onSubmit={(e) => { e.preventDefault(); buscarPlaca(); }} className="mt-5 flex flex-wrap gap-3">
          <input value={placa} onChange={(e) => setPlaca(e.target.value)} placeholder={`Ej. ${CARRO.placa}`} aria-label="Placa del carro" className="min-w-[12rem] flex-1 rounded-md border-2 bg-white px-4 py-3 font-bold uppercase" style={{ borderColor: ASFALTO }} />
          <button type="submit" className={btn} style={{ background: ASFALTO, color: "#fff" }}>Ver mi carro</button>
        </form>
        {errorPlaca && <p role="alert" className="mt-3 font-bold" style={{ color: ROJO }}>{errorPlaca}</p>}
        {carro && (
          <div className="orden mt-6 p-5">
            <p className="torque-titulo text-[1.7rem]">{CARRO.modelo} · {CARRO.placa}</p>
            <p className="opacity-75">{CARRO.trabajo} · Total {qz(CARRO.total)}</p>
            <ol className="mt-5 grid gap-2">
              {PASOS.map((p, i) => (
                <li key={p} className="flex items-center gap-3 font-bold" style={{ opacity: i > CARRO.paso ? 0.4 : 1 }}>
                  <span className="grid h-7 w-7 place-items-center rounded-full text-[0.85rem]" style={i <= CARRO.paso ? { background: i === CARRO.paso ? AMARILLO : VERDE, color: i === CARRO.paso ? ASFALTO : "#fff" } : { border: `2px solid ${ASFALTO}` }}>
                    {i < CARRO.paso ? <Check size={15} /> : i + 1}
                  </span>
                  {p}{i === CARRO.paso && <span className="text-[0.85rem] font-semibold opacity-70">· ahora</span>}
                </li>
              ))}
            </ol>
            <p className="mt-4 rounded px-3 py-2 font-bold" style={{ background: ACERO }}>Entrega: {CARRO.entrega}</p>
            <h3 className="mt-5 font-bold uppercase tracking-wide">Historial de este carro</h3>
            <ul className="mt-2 divide-y" style={{ borderColor: ACERO }}>
              {CARRO.historial.map((h) => (
                <li key={h.fecha} className="flex justify-between gap-3 py-2 text-[0.95rem]"><span>{h.fecha} · {h.trabajo}</span><b>{qz(h.monto)}</b></li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 text-[0.95rem]"><Bell size={16} className="mt-1 shrink-0" /> Próximo: {CARRO.proximo}. Se lo recordamos por WhatsApp.</p>
          </div>
        )}
      </section>

      {/* reseñas */}
      <section id="resenas" className="scroll-mt-24 border-y-2" style={{ background: ACERO, borderColor: ASFALTO }}>
        <div className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="torque-titulo text-[2.4rem]">Lo que dicen nuestros clientes</h2>
          <p className="mt-1 text-[0.9rem] opacity-70">Reseñas de ejemplo. En su página aparecen las reales de Google.</p>
          <div className="mt-6 torque-dos items-start">
            <div className="rounded-md border-2 bg-white p-5" style={{ borderColor: ASFALTO }}>
              <div className="flex items-center gap-4">
                <p className="torque-titulo text-[3.6rem] leading-none">{promedio.toFixed(1)}</p>
                <div>
                  <Estrellas n={5} />
                  <p className="mt-1 text-[0.9rem] opacity-75">{total} opiniones en Google</p>
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                {DISTRIBUCION.map((d) => (
                  <div key={d.e} className="flex items-center gap-2 text-[0.88rem]">
                    <span className="w-4 tabular-nums">{d.e}</span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/10"><span className="block h-full rounded-full" style={{ width: `${(d.n / total) * 100}%`, background: AMARILLO }} /></span>
                    <span className="w-8 text-right tabular-nums opacity-70">{d.n}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded px-3 py-2 text-[0.9rem] font-semibold" style={{ background: ACERO }}>Al entregar su carro le damos un código QR para que deje su reseña en 30 segundos.</p>
            </div>
            <div className="grid gap-3">
              {RESENAS.map((r) => (
                <figure key={r.nombre} className="rounded-md border-2 bg-white p-4" style={{ borderColor: ASFALTO }}>
                  <Estrellas n={5} />
                  <blockquote className="mt-2 leading-relaxed">{r.texto}</blockquote>
                  <figcaption className="mt-2 text-[0.85rem] font-semibold opacity-70">{r.nombre} · {r.fecha}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ubicación */}
      <section id="ubicacion" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-12">
        <div className="torque-dos">
          <div>
            <h2 className="torque-titulo text-[2.4rem]">Dónde estamos</h2>
            <p className="mt-3 flex items-start gap-2 text-[1.05rem]"><MapPin size={20} className="mt-0.5 shrink-0" /> 12 avenida 4-18, zona 5 de Mixco. A una cuadra de la gasolinera, portón negro y amarillo.</p>
            <p className="mt-2 opacity-80">Parqueo para 6 carros. Sala de espera con café y señal de internet.</p>
            <dl className="mt-5 space-y-1.5">
              <div className="flex justify-between gap-4"><dt>Lunes a viernes</dt><dd className="font-bold">7:30 a 18:00</dd></div>
              <div className="flex justify-between gap-4"><dt>Sábado</dt><dd className="font-bold">7:30 a 14:00</dd></div>
              <div className="flex justify-between gap-4"><dt>Auxilio a domicilio</dt><dd className="font-bold" style={{ color: ROJO }}>24 horas, todos los días</dd></div>
            </dl>
            <p className="mt-3 flex items-center gap-2"><Phone size={18} /> <a href={`tel:+502${TEL.replace(" ", "")}`} className="font-bold underline">{TEL}</a></p>
            <a href="https://www.google.com/maps?q=Zona+5+Mixco+Guatemala" target="_blank" rel="noopener noreferrer" className={`${btn} mt-5`} style={{ background: ASFALTO, color: "#fff" }}>Cómo llegar <ArrowRight size={18} /></a>
          </div>
          <iframe title="Mapa del taller en la zona 5 de Mixco" src="https://www.google.com/maps?q=Zona+5+Mixco+Guatemala&output=embed" className="h-80 w-full rounded-md border-2 md:h-full" style={{ borderColor: ASFALTO }} loading="lazy" />
        </div>
      </section>

      {/* derechos y cuestiones legales */}
      <section className="border-t-2" style={{ background: ACERO, borderColor: ASFALTO }}>
        <div className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="torque-titulo text-[2rem]">Garantía y sus derechos</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              { i: <ShieldCheck size={20} />, t: "Garantía por escrito", x: "Cada trabajo sale con su garantía: de 1 mes a 1 año según lo que se hizo. Se la entregamos junto con la factura." },
              { i: <FileText size={20} />, t: "Presupuesto y autorización", x: "No hacemos ningún trabajo que usted no haya aprobado. Si hay un gasto extra, le preguntamos antes y queda por escrito." },
              { i: <Check size={20} />, t: "Sus piezas y sus cosas", x: "Le devolvemos las piezas cambiadas. Anotamos lo que deja dentro del carro al recibirlo. Sus datos solo los usamos para avisarle de su carro." },
            ].map((c) => (
              <div key={c.t} className="rounded-md border-2 bg-white p-5" style={{ borderColor: ASFALTO }}>
                <p className="flex items-center gap-2 font-bold uppercase tracking-wide">{c.i} {c.t}</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed opacity-85">{c.x}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[0.85rem] opacity-65">Textos de ejemplo. En su página se escriben con sus datos reales (nombre legal, NIT y condiciones de garantía) y los revisa su abogado. © Taller Torque · Aviso de privacidad · Términos de servicio.</p>
        </div>
      </section>

      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="taller mecánico" que="la solicitud" />
    </>
  );
}

function Estrellas({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${n} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={17} fill={i <= n ? AMARILLO : "none"} stroke={ASFALTO} />)}
    </span>
  );
}

/* el carro de ejemplo: sin pintar y golpeado, o pintado de rojo */
function Carro({ despues }: { despues: boolean }) {
  const cuerpo = despues ? "#c8281e" : "#8b9097";
  return (
    <svg viewBox="0 0 400 190" role="img" aria-label={despues ? "Carro pintado y enderezado" : "Carro golpeado y sin pintura"} className="block w-full" style={{ background: despues ? "#2a2d34" : "#34373f" }}>
      <path d="M0 160 H400" stroke="#4a4e57" strokeWidth="2" />
      <path d="M20 128 L28 100 Q34 86 56 82 L110 76 L140 44 Q150 36 168 36 L262 36 Q282 36 292 48 L318 78 L352 84 Q376 88 380 108 L384 128 Q386 142 372 142 L28 142 Q18 142 20 128 Z" fill={cuerpo} />
      <path d="M146 76 L166 48 L214 48 L214 76 Z M222 76 L222 48 L260 48 Q268 48 274 56 L292 76 Z" fill="#cfe3ee" fillOpacity={despues ? 0.95 : 0.55} />
      <path d="M214 76 V138" stroke="rgba(0,0,0,.25)" strokeWidth="2" />
      {!despues && (
        <g fill="none" stroke="#3f4349" strokeLinecap="round">
          <path d="M232 96 q14 -10 28 0 q-10 12 -28 0 Z" fill="rgba(0,0,0,.28)" />
          <path d="M60 98 l30 6 M64 110 l22 3 M300 100 l24 -4" strokeWidth="3" />
          <path d="M150 120 q8 -8 16 0" strokeWidth="2.5" />
          <circle cx="330" cy="116" r="7" fill="#8a4b2a" stroke="none" />
        </g>
      )}
      <circle cx="95" cy="142" r="26" fill="#111" />
      <circle cx="95" cy="142" r="13" fill="#9aa1aa" />
      <circle cx="305" cy="142" r="26" fill="#111" />
      <circle cx="305" cy="142" r="13" fill="#9aa1aa" />
      <rect x="370" y="100" width="12" height="9" rx="2" fill="#f5d36a" />
    </svg>
  );
}
