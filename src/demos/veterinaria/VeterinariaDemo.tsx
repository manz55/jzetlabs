/*
 * Demo: "Veterinaria Huesitos" (negocio inventado, datos de ejemplo).
 * Tres partes, cada una resuelve un problema real:
 *  - Página: precios a la vista, "¿es urgencia?" y cita sin llamar (el teléfono deja de saturarse).
 *  - Mi mascota: carné de vacunas con la próxima fecha, resultados explicados y noticias del internado.
 *  - Clínica: agenda del día, recordatorios de vacunas vencidas y noticias a los dueños de internados.
 */
import { useEffect, useState } from "react";
import { ArrowRight, Bell, CalendarCheck, FlaskConical, HeartPulse, Phone, Syringe } from "lucide-react";
import PanelVet from "./PanelVet";
import { BandaDemos, PartesDemo, CierreJzet, MensajeWhatsApp } from "../comun";
import fHero from "@/assets/demo-veterinaria/hero.jpg";
import fConsulta from "@/assets/demo-veterinaria/consulta.jpg";
import fVacunas from "@/assets/demo-veterinaria/vacunas.jpg";
import fGrooming from "@/assets/demo-veterinaria/grooming.jpg";
import fGatos from "@/assets/demo-veterinaria/gatos.jpg";
import fCirugia from "@/assets/demo-veterinaria/cirugia.jpg";
import fDra from "@/assets/demo-veterinaria/dra.jpg";
import fDr from "@/assets/demo-veterinaria/dr.jpg";
import fAlimento from "@/assets/demo-veterinaria/alimento.jpg";
import fComiendo from "@/assets/demo-veterinaria/comiendo.jpg";
import fToby from "@/assets/demo-veterinaria/toby.jpg";
import { Plus, MapPin, ShoppingBag } from "lucide-react";
import {
  AMBAR, BOSQUE, CREMA, EXAMEN, HORAS, INTERNADOS_INICIAL, MENTA, PAPEL, QUE_HACER, ROJO,
  SERVICIOS, SINTOMAS, TIENDA, TITULO, TOBY, VERDE, diasHasta, edad, fechaLarga, qz, sumarMeses,
  type Internado, type Nivel, type Nota, type ServicioId,
} from "./datos";

const FOTO_SERV: Record<string, string> = { consulta: fConsulta, vacuna: fVacunas, desparasitacion: fGatos, grooming: fGrooming, esterilizacion: fCirugia, laboratorio: fConsulta };
const btn = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold transition active:scale-[0.98]";
const TEL = "2440 1180";

const ESTILOS = `
.vet h1, .vet h2, .vet h3 { color: inherit; }
.vet-titulo { font-family: ${TITULO}; font-weight: 400; line-height: 1.05; }
.vet-dos { display: grid; gap: 1.5rem; }
@media (min-width: 960px) { .vet-dos { grid-template-columns: 1fr 1fr; } }
.vet-hero { display: grid; gap: 2rem; }
@media (min-width: 960px) { .vet-hero { grid-template-columns: 1.1fr 1fr; align-items: center; } }
/* el carné de vacunas: cartón con perforaciones y sellos, como el de papel */
.carne { background: ${PAPEL}; border: 1.5px solid ${BOSQUE}; border-radius: 14px; position: relative; }
.sello { border: 2px solid ${VERDE}; color: ${VERDE}; border-radius: 6px; transform: rotate(-4deg); font-weight: 800; letter-spacing: .02em; }
`;

/* logo: hueso dentro de un círculo verde */
function Logo({ tam = 40 }: { tam?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={tam} height={tam} aria-hidden className="shrink-0">
      <circle cx="24" cy="24" r="22" fill={BOSQUE} />
      <g fill={CREMA} transform="rotate(-20 24 24)">
        <rect x="14" y="21.5" width="20" height="5" rx="2.5" />
        <circle cx="13.5" cy="20" r="4.2" />
        <circle cx="13.5" cy="28" r="4.2" />
        <circle cx="34.5" cy="20" r="4.2" />
        <circle cx="34.5" cy="28" r="4.2" />
      </g>
    </svg>
  );
}
function Marca() {
  return (
    <span className="flex items-center gap-2.5">
      <Logo />
      <span className="leading-none">
        <span className="vet-titulo block text-[1.4rem]">Huesitos</span>
        <span className="block whitespace-nowrap text-[0.72rem] font-semibold opacity-70">Veterinaria · zona 11</span>
      </span>
    </span>
  );
}

type Vista = "pagina" | "mascota" | "clinica";

export default function VeterinariaDemo() {
  const leer = (): Vista => (location.hash === "#mascota" ? "mascota" : location.hash === "#clinica" ? "clinica" : "pagina");
  const [vista, setVista] = useState<Vista>(leer);
  const [internados, setInternados] = useState<Internado[]>(INTERNADOS_INICIAL);
  useEffect(() => {
    const cambio = () => setVista(leer());
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", vista === "pagina" ? location.pathname : `#${vista}`);
    document.title = vista === "clinica" ? "Clínica · Huesitos" : vista === "mascota" ? "Mi mascota · Huesitos" : "Veterinaria Huesitos · Demo de Jzet Labs";
    window.scrollTo(0, 0);
  }, [vista]);

  return (
    <div className="vet min-h-screen" style={{ background: CREMA, color: BOSQUE, fontFamily: "'Instrument Sans', system-ui, sans-serif" }}>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <PartesDemo
        fondo={BOSQUE}
        actual={vista}
        alCambiar={setVista}
        partes={[
          { id: "pagina", nombre: "Página", quien: "Precios, ¿es urgencia? y citas sin llamar" },
          { id: "mascota", nombre: "Mi mascota", quien: "Carné, resultados y noticias del internado" },
          { id: "clinica", nombre: "Clínica", quien: "Agenda, vacunas vencidas e internados" },
        ] as const}
      />
      {vista === "pagina" && <Pagina />}
      {vista === "mascota" && <MiMascota internados={internados} />}
      {vista === "clinica" && <PanelVet internados={internados} setInternados={setInternados} />}
      <CierreJzet demo="veterinaria" />
    </div>
  );
}

/* ---------------- la página ---------------- */

function Pagina() {
  const [marcados, setMarcados] = useState<string[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [mascota, setMascota] = useState("");
  const [especie, setEspecie] = useState<"perro" | "gato">("perro");
  const [servicio, setServicio] = useState<ServicioId>("consulta");
  const [hora, setHora] = useState<string | null>(null);
  const [dueno, setDueno] = useState("");
  const [error, setError] = useState("");

  const niveles = marcados.map((id) => SINTOMAS.find((s) => s.id === id)!.nivel);
  const nivel: Nivel | null = niveles.includes("rojo") ? "rojo" : niveles.includes("ambar") ? "ambar" : niveles.length ? "verde" : null;
  const ocupadas = ["09:30", "10:30", "11:30", "14:30"];
  const color = (n: Nivel) => (n === "rojo" ? ROJO : n === "ambar" ? AMBAR : VERDE);

  function apartar() {
    if (!mascota.trim() || !dueno.trim()) return setError("Escribe el nombre de tu mascota y el tuyo.");
    if (!hora) return setError("Escoge una hora libre.");
    const s = SERVICIOS.find((x) => x.id === servicio)!;
    setError("");
    setMsg(`Hola, Huesitos. Soy ${dueno.trim()}. Aparté ${s.nombre.toLowerCase()} para ${mascota.trim()} (${especie}) hoy a las ${hora}.${nivel && nivel !== "verde" ? `\nSíntomas: ${marcados.map((id) => SINTOMAS.find((x) => x.id === id)!.texto.toLowerCase()).join("; ")}.` : ""}`);
    setHora(null);
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-black/5 backdrop-blur" style={{ background: "rgba(247,243,234,.94)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#inicio" aria-label="Veterinaria Huesitos"><Marca /></a>
          <nav className="hidden gap-7 font-semibold md:flex">
            <a href="#precios" className="hover:underline">Precios</a>
            <a href="#urgencia" className="hover:underline">¿Es urgencia?</a>
            <a href="#cita" className="hover:underline">Citas</a>
            <a href="#tienda" className="hover:underline">Alimento</a>
            <a href="#ubicacion" className="hover:underline">Ubicación</a>
          </nav>
          <a href={`tel:+502${TEL.replace(" ", "")}`} className={`${btn} shrink-0 whitespace-nowrap !px-4 !py-2.5 text-white`} style={{ background: ROJO }}>
            <Phone size={16} /> <span className="hidden sm:inline">Urgencias</span> {TEL}
          </a>
        </div>
      </header>

      <section id="inicio" className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <div className="vet-hero">
          <div>
            <h1 className="vet-titulo text-[2.5rem] sm:text-[3.4rem]">Veterinaria para perros y gatos en la zona 11</h1>
            <p className="mt-5 max-w-lg text-[1.1rem] leading-relaxed opacity-85">
              Mira los precios antes de venir, revisa si lo que tiene tu mascota es urgencia y aparta tu cita sin llamar.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#urgencia" className={`${btn} text-white`} style={{ background: BOSQUE }}>¿Es urgencia? <ArrowRight size={18} /></a>
              <a href="#cita" className={`${btn} border-2`} style={{ borderColor: BOSQUE }}>Apartar cita</a>
            </div>
            <p className="mt-5 text-[0.95rem] opacity-75">Lunes a sábado de 8:00 a 18:00 · Urgencias hasta las 22:00 · Mariscal, zona 11</p>
          </div>
          <img src={fHero} alt="Veterinario revisando a un perro en la clínica" className="aspect-[4/3] w-full rounded-[28px] object-cover" />
        </div>
      </section>

      <section id="precios" className="scroll-mt-20 border-y border-black/5" style={{ background: PAPEL }}>
        <div className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="vet-titulo text-[2rem]">Servicios y precios</h2>
          <p className="mt-1 opacity-75">Para que sepas cuánto traer antes de salir de tu casa.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS.map((s) => (
              <div key={s.id} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
                <img src={FOTO_SERV[s.id]} alt={s.nombre} loading="lazy" className="aspect-[16/9] w-full object-cover" />
                <div className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[1.1rem] font-bold">{s.nombre}</p>
                  <p className="whitespace-nowrap text-[1.1rem] font-bold" style={{ color: VERDE }}>{s.dura === 0 || s.detalle.startsWith("Desde") ? "desde " : ""}{qz(s.precio)}</p>
                </div>
                <p className="mt-1.5 text-[0.95rem] opacity-75">{s.detalle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="urgencia" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-12">
        <div className="vet-dos">
          <div>
            <h2 className="vet-titulo text-[2rem]">¿Es urgencia o puede esperar?</h2>
            <p className="mt-1 max-w-md opacity-80">Marca lo que le está pasando a tu mascota y te decimos qué hacer. Es una guía, no un diagnóstico: si tienes duda, llámanos.</p>
            <div className="mt-5 space-y-2" role="group" aria-label="Síntomas">
              {SINTOMAS.map((s) => {
                const on = marcados.includes(s.id);
                return (
                  <label key={s.id} className="flex cursor-pointer items-start gap-3 rounded-xl border bg-white px-4 py-3 text-[1rem]" style={{ borderColor: on ? BOSQUE : "rgba(0,0,0,.1)" }}>
                    <input type="checkbox" className="mt-1 h-5 w-5 accent-[#1d4d3f]" checked={on} onChange={() => setMarcados((l) => (on ? l.filter((x) => x !== s.id) : [...l, s.id]))} />
                    <span>{s.texto}</span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="sticky bottom-3 z-20 self-end lg:top-24 lg:bottom-auto lg:self-start">
            {nivel ? (
              <div className="rounded-3xl p-5 text-white shadow-[0_12px_40px_-12px_rgba(0,0,0,.45)] lg:p-6 lg:shadow-none" style={{ background: color(nivel) }} role="status">
                <p className="text-[0.9rem] font-semibold opacity-90">{nivel === "rojo" ? "Urgente" : nivel === "ambar" ? "Hoy" : "Sin prisa"}</p>
                <p className="vet-titulo mt-1 text-[1.6rem] lg:text-[2rem]">{QUE_HACER[nivel].titulo}</p>
                <p className="mt-2 text-[0.98rem] leading-relaxed lg:mt-3 lg:text-[1.05rem]">{QUE_HACER[nivel].texto}</p>
                {nivel === "rojo" ? (
                  <a href={`tel:+502${TEL.replace(" ", "")}`} className={`${btn} mt-5 w-full bg-white`} style={{ color: ROJO }}><Phone size={18} /> Llamar al {TEL}</a>
                ) : (
                  <a href="#cita" className={`${btn} mt-5 w-full bg-white`} style={{ color: color(nivel) }}>{QUE_HACER[nivel].accion} <ArrowRight size={18} /></a>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border-2 border-dashed p-6 text-[1.05rem]" style={{ borderColor: `${BOSQUE}40` }}>
                Marca uno o más síntomas y aquí te sale qué hacer.
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="cita" className="scroll-mt-20" style={{ background: MENTA }}>
        <div className="mx-auto max-w-3xl px-5 py-12">
          <h2 className="vet-titulo text-[2rem]">Apartar cita para hoy</h2>
          <p className="mt-1 opacity-80">Sin llamar ni esperar a que te contesten.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="text-[0.95rem] font-semibold">Nombre de tu mascota
              <input value={mascota} onChange={(e) => setMascota(e.target.value)} placeholder="Ej. Toby" className="mt-1 w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-normal" />
            </label>
            <label className="text-[0.95rem] font-semibold">Tu nombre
              <input value={dueno} onChange={(e) => setDueno(e.target.value)} autoComplete="name" placeholder="Ej. Andrea López" className="mt-1 w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-normal" />
            </label>
            <div className="text-[0.95rem] font-semibold">Es un…
              <div className="mt-1 grid grid-cols-2 gap-2">
                {(["perro", "gato"] as const).map((e) => (
                  <button key={e} type="button" aria-pressed={especie === e} onClick={() => setEspecie(e)} className="rounded-xl border py-3 font-bold capitalize" style={especie === e ? { background: BOSQUE, color: "#fff", borderColor: BOSQUE } : { background: "#fff", borderColor: "rgba(0,0,0,.15)" }}>{e}</button>
                ))}
              </div>
            </div>
            <label className="text-[0.95rem] font-semibold">Servicio
              <select value={servicio} onChange={(e) => setServicio(e.target.value as ServicioId)} className="mt-1 w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-normal">
                {SERVICIOS.filter((s) => s.id !== "esterilizacion").map((s) => <option key={s.id} value={s.id}>{s.nombre} · {qz(s.precio)}</option>)}
              </select>
            </label>
          </div>
          <p className="mt-5 text-[0.95rem] font-semibold">Horas libres hoy</p>
          <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-7">
            {HORAS.map((h) => {
              const ocupada = ocupadas.includes(h);
              return (
                <button key={h} type="button" disabled={ocupada} onClick={() => setHora(h)} aria-pressed={hora === h} className="rounded-xl border py-2.5 font-bold tabular-nums disabled:cursor-not-allowed disabled:line-through disabled:opacity-40" style={hora === h ? { background: BOSQUE, color: "#fff", borderColor: BOSQUE } : { background: "#fff", borderColor: "rgba(0,0,0,.12)" }}>
                  {h}
                </button>
              );
            })}
          </div>
          {error && <p role="alert" className="mt-4 rounded-xl bg-white p-3 font-semibold" style={{ color: ROJO }}>{error}</p>}
          <button type="button" onClick={apartar} className={`${btn} mt-5 w-full text-white`} style={{ background: BOSQUE }}><CalendarCheck size={19} /> Apartar mi cita</button>
        </div>
      </section>


      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="vet-dos items-center">
          <div>
            <h2 className="vet-titulo text-[2rem]">El carné de tu mascota, en tu teléfono</h2>
            <p className="mt-2 max-w-md opacity-80">Ya no se pierde el carné de cartón. Ves qué vacuna le toca, sus resultados y, si está internado, cómo va. Te avisamos por WhatsApp antes de cada vacuna.</p>
          </div>
          <CarneMini />
        </div>
      </section>

      <section id="tienda" className="scroll-mt-20 border-y border-black/5" style={{ background: PAPEL }}>
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="vet-dos items-center">
            <div>
              <h2 className="vet-titulo text-[2rem]">Alimento y accesorios</h2>
              <p className="mt-2 max-w-md opacity-80">Aparta su comida y la recoges cuando vengas, o te la llevamos si estás en la zona 11.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img src={fAlimento} alt="Plato con croquetas" loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
              <img src={fComiendo} alt="Perro comiendo de su plato" loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TIENDA.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white p-4">
                <div>
                  <p className="font-bold">{t.nombre}</p>
                  <p className="text-[0.9rem] opacity-70">{t.detalle} · <span className="font-bold" style={{ color: VERDE }}>{qz(t.precio)}</span></p>
                </div>
                <button type="button" onClick={() => setMsg(`Hola, Huesitos. Quiero apartar ${t.nombre.toLowerCase()} (${t.detalle.toLowerCase()}, ${qz(t.precio)}) para recogerla.`)} className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[0.85rem] font-bold text-white" style={{ background: BOSQUE }}>
                  <ShoppingBag size={15} /> Apartar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="vet-titulo text-[2rem]">Quiénes te atienden</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {[
            { f: fDr, n: "Dr. Rodrigo Pérez", t: "Medicina general y cirugía. 12 años atendiendo perros y gatos en la zona 11." },
            { f: fDra, n: "Dra. Ana Lucía Morales", t: "Gatos y animales mayores. Sabe calmar a los más nerviosos." },
          ].map((d) => (
            <div key={d.n} className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-4">
              <img src={d.f} alt={d.n} loading="lazy" className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
              <div>
                <p className="vet-titulo text-[1.25rem]">{d.n}</p>
                <p className="mt-1 text-[0.95rem] opacity-80">{d.t}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="ubicacion" className="scroll-mt-20" style={{ background: MENTA }}>
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 md:grid-cols-2">
          <div>
            <h2 className="vet-titulo text-[2rem]">Dónde estamos</h2>
            <p className="mt-3 flex items-start gap-2 text-[1.05rem]"><MapPin size={20} className="mt-0.5 shrink-0" /> 18 avenida 9-40, Mariscal, zona 11. A dos cuadras del Parque de la Mariscal.</p>
            <p className="mt-3 opacity-80">Parqueo para 4 carros frente a la clínica.</p>
            <dl className="mt-5 space-y-1.5 text-[1rem]">
              <div className="flex justify-between gap-4"><dt>Lunes a viernes</dt><dd className="font-bold">8:00 a 18:00</dd></div>
              <div className="flex justify-between gap-4"><dt>Sábado</dt><dd className="font-bold">8:00 a 13:00</dd></div>
              <div className="flex justify-between gap-4"><dt>Urgencias</dt><dd className="font-bold" style={{ color: ROJO }}>Todos los días hasta 22:00</dd></div>
            </dl>
            <a href="https://www.google.com/maps?q=Mariscal+zona+11+Guatemala" target="_blank" rel="noopener noreferrer" className={`${btn} mt-6 text-white`} style={{ background: BOSQUE }}>Cómo llegar <ArrowRight size={18} /></a>
          </div>
          <iframe title="Mapa de la clínica en la Mariscal, zona 11" src="https://www.google.com/maps?q=Mariscal+zona+11+Guatemala&output=embed" className="h-72 w-full rounded-3xl border-0 md:h-full" loading="lazy" />
        </div>
      </section>

      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="veterinaria" que="el pedido" />
    </>
  );
}

/* carné chiquito para la portada: lo primero que el dueño quiere saber */
function CarneMini() {
  const prox = proximaVacuna();
  return (
    <div className="carne mx-auto w-full max-w-md p-5 shadow-[0_20px_50px_-30px_rgba(29,77,63,.6)]">
      <div className="flex items-center justify-between">
        <p className="vet-titulo text-[1.3rem]">Carné de {TOBY.nombre}</p>
        <Syringe size={20} />
      </div>
      <div className="mt-7 space-y-2.5">
        {TOBY.vacunas.map((v) => {
          const vence = sumarMeses(v.puesta, v.cada);
          const d = diasHasta(vence);
          return (
            <div key={v.nombre} className="flex items-center justify-between gap-3 text-[0.95rem]">
              <span>{v.nombre.split(" (")[0]}</span>
              <span className="whitespace-nowrap font-bold" style={{ color: d < 0 ? ROJO : d <= 15 ? AMBAR : VERDE }}>{d < 0 ? "Vencida" : d <= 15 ? (d <= 1 ? "Mañana" : `En ${d} días`) : "Al día"}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 rounded-xl px-3 py-2 text-[0.92rem]" style={{ background: MENTA }}>
        <Bell size={14} className="mr-1 inline" /> Te avisamos por WhatsApp una semana antes: {prox.nombre.split(" (")[0]}, {fechaLarga(prox.vence)}.
      </p>
    </div>
  );
}

function proximaVacuna() {
  return TOBY.vacunas
    .map((v) => ({ ...v, vence: sumarMeses(v.puesta, v.cada) }))
    .sort((a, b) => a.vence.localeCompare(b.vence))[0];
}

/* ---------------- Mi mascota (lo que ve el dueño) ---------------- */

type Ficha = { id: string; nombre: string; especie: "perro" | "gato"; detalle: string; foto?: string };
const FICHAS_INICIAL: Ficha[] = [
  { id: "toby", nombre: "Toby", especie: "perro", detalle: "Perro · 5 años", foto: fToby },
  { id: "luna", nombre: "Luna", especie: "gato", detalle: "Gata · 3 años · internada", foto: fGatos },
];

function MiMascota({ internados }: { internados: Internado[] }) {
  const [fichas, setFichas] = useState<Ficha[]>(FICHAS_INICIAL);
  const [sel, setSel] = useState("toby");
  const [nueva, setNueva] = useState<{ nombre: string; especie: "perro" | "gato" } | null>(null);
  const [tab, setTab] = useState<"carne" | "resultados">("carne");
  const luna = internados.find((i) => i.id === "luna")!;
  const max = Math.max(...TOBY.pesos.map((p) => p.kg));
  const actual = fichas.find((f) => f.id === sel)!;
  function agregar() {
    if (!nueva || !nueva.nombre.trim()) return;
    const id = `m${Date.now()}`;
    setFichas((l) => [...l, { id, nombre: nueva.nombre.trim(), especie: nueva.especie, detalle: nueva.especie === "perro" ? "Perro · nuevo" : "Gato · nuevo" }]);
    setSel(id);
    setNueva(null);
  }
  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <p className="text-[0.95rem] opacity-75">Así lo ve {TOBY.dueno.split(" ")[0]} en su teléfono: una carpeta por cada mascota.</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {fichas.map((f) => (
          <button key={f.id} type="button" onClick={() => { setSel(f.id); setTab("carne"); }} aria-pressed={sel === f.id} className="overflow-hidden rounded-2xl border-2 bg-white text-left" style={{ borderColor: sel === f.id ? BOSQUE : "rgba(0,0,0,.08)" }}>
            {f.foto ? <img src={f.foto} alt="" className="aspect-[4/3] w-full object-cover" /> : <div className="flex aspect-[4/3] w-full items-center justify-center vet-titulo text-[2rem]" style={{ background: MENTA }}>{f.nombre[0]}</div>}
            <div className="p-3">
              <p className="font-bold">{f.nombre}</p>
              <p className="text-[0.82rem] opacity-70">{f.detalle}</p>
            </div>
          </button>
        ))}
        {nueva ? (
          <div className="flex flex-col gap-2 rounded-2xl border-2 border-dashed p-3" style={{ borderColor: BOSQUE }}>
            <input autoFocus value={nueva.nombre} onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })} onKeyDown={(e) => e.key === "Enter" && agregar()} placeholder="Nombre" aria-label="Nombre de la mascota" className="w-full rounded-lg border border-black/15 bg-white px-3 py-2" />
            <div className="flex gap-1">
              {(["perro", "gato"] as const).map((e) => (
                <button key={e} type="button" onClick={() => setNueva({ ...nueva, especie: e })} className="flex-1 rounded-lg border px-2 py-1.5 text-[0.85rem] font-bold capitalize" style={nueva.especie === e ? { background: BOSQUE, color: "#fff", borderColor: BOSQUE } : { borderColor: "rgba(0,0,0,.15)" }}>{e}</button>
              ))}
            </div>
            <button type="button" onClick={agregar} className="rounded-lg px-3 py-2 text-[0.9rem] font-bold text-white" style={{ background: BOSQUE }}>Guardar</button>
          </div>
        ) : (
          <button type="button" onClick={() => setNueva({ nombre: "", especie: "perro" })} className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed font-bold" style={{ borderColor: "rgba(0,0,0,.2)" }}>
            <Plus size={24} /> Agregar mascota
          </button>
        )}
      </div>

      {sel === "toby" && (
      <>
      <div className="mt-6 flex gap-2 overflow-x-auto" role="tablist">
        {([["carne", "Carné", Syringe], ["resultados", "Resultados", FlaskConical]] as const).map(([id, t, I]) => (
          <button key={id} role="tab" aria-selected={tab === id} type="button" onClick={() => setTab(id)} className="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 font-bold" style={tab === id ? { background: BOSQUE, color: "#fff", borderColor: BOSQUE } : { background: "#fff", borderColor: "rgba(0,0,0,.12)" }}>
            <I size={17} /> {t}
          </button>
        ))}
      </div>

      {tab === "carne" && (
        <div className="carne mt-5 p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="vet-titulo text-[1.8rem]">{TOBY.nombre}</p>
              <p className="opacity-75">{TOBY.raza} · {edad(TOBY.nace)} · {TOBY.sexo}</p>
            </div>
            <span className="sello px-2 py-1 text-[0.8rem]">HUESITOS</span>
          </div>
          <h3 className="mt-9 font-bold">Vacunas</h3>
          <div className="mt-2 divide-y divide-black/10">
            {TOBY.vacunas.map((v) => {
              const vence = sumarMeses(v.puesta, v.cada);
              const d = diasHasta(vence);
              return (
                <div key={v.nombre} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="font-semibold">{v.nombre}</p>
                    <p className="text-[0.9rem] opacity-70">Puesta el {fechaLarga(v.puesta)}</p>
                  </div>
                  <span className="rounded-full px-3 py-1 text-[0.9rem] font-bold text-white" style={{ background: d < 0 ? ROJO : d <= 15 ? AMBAR : VERDE }}>
                    {d < 0 ? `Vencida hace ${-d} días` : d <= 1 ? "Le toca mañana" : d <= 15 ? `Le toca en ${d} días` : `Próxima: ${fechaLarga(vence)}`}
                  </span>
                </div>
              );
            })}
            <div className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="font-semibold">Desparasitación</p>
                <p className="text-[0.9rem] opacity-70">Cada 3 meses · última el {fechaLarga(TOBY.desparasitacion.puesta)}</p>
              </div>
              {(() => { const d = diasHasta(sumarMeses(TOBY.desparasitacion.puesta, 3)); return <span className="rounded-full px-3 py-1 text-[0.9rem] font-bold text-white" style={{ background: d < 0 ? ROJO : d <= 15 ? AMBAR : VERDE }}>{d < 0 ? `Atrasada ${-d} días` : `En ${d} días`}</span>; })()}
            </div>
          </div>
          <h3 className="mt-6 font-bold">Peso</h3>
          <div className="mt-3 flex h-36 items-end gap-2" aria-label="Peso de los últimos 6 meses">
            {TOBY.pesos.map((p) => {
              const alto = p.kg > TOBY.pesoIdeal[1];
              return (
                <div key={p.mes} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[0.8rem] font-bold tabular-nums">{p.kg}</span>
                  <div className="w-full rounded-t-md" style={{ height: `${(p.kg / max) * 100}px`, background: alto ? AMBAR : VERDE }} />
                  <span className="text-[0.8rem] opacity-70">{p.mes}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[0.95rem]">Su peso ideal es de {TOBY.pesoIdeal[0]} a {TOBY.pesoIdeal[1]} kg. Lleva 2 meses arriba: el doctor le recomendó menos premios.</p>
        </div>
      )}

      {tab === "resultados" && (
        <div className="mt-5 rounded-3xl border border-black/10 bg-white p-5 sm:p-7">
          <p className="text-[0.9rem] opacity-70">{EXAMEN.fecha} · {EXAMEN.doctor}</p>
          <h3 className="vet-titulo mt-1 text-[1.6rem]">{EXAMEN.nombre} de {TOBY.nombre}</h3>
          <p className="mt-3 rounded-2xl p-4 text-[1.02rem] leading-relaxed" style={{ background: MENTA }}><b>Lo que dice el doctor:</b> {EXAMEN.nota}</p>
          <div className="mt-5 space-y-5">
            {EXAMEN.valores.map((v) => {
              const rango = v.max - v.min;
              const izq = Math.min(98, Math.max(2, ((v.valor - (v.min - rango * 0.3)) / (rango * 1.6)) * 100));
              const fuera = v.valor < v.min || v.valor > v.max;
              return (
                <div key={v.nombre}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold">{v.nombre}</p>
                    <p className="font-bold tabular-nums" style={{ color: fuera ? AMBAR : VERDE }}>{v.valor} <span className="text-[0.8rem] font-normal opacity-70">{v.unidad}</span></p>
                  </div>
                  <div className="relative mt-2 h-3 rounded-full" style={{ background: "#eee" }}>
                    <div className="absolute inset-y-0 rounded-full" style={{ left: `${(0.3 / 1.6) * 100}%`, width: `${(1 / 1.6) * 100}%`, background: `${VERDE}40` }} />
                    <div className="absolute -top-1 h-5 w-1.5 rounded-full" style={{ left: `${izq}%`, background: fuera ? AMBAR : BOSQUE }} />
                  </div>
                  <p className="mt-1.5 text-[0.92rem] opacity-80">{v.explica} <span className="opacity-70">Normal: {v.min} a {v.max}.</span></p>
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-[0.85rem] opacity-60">La franja verde es lo normal. Cualquier duda, pregúntale al doctor en tu próxima cita.</p>
        </div>
      )}

      </>
      )}

      {sel === "luna" && (
        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5 sm:p-7">
          <p className="flex items-center gap-2 text-[0.9rem] opacity-70"><HeartPulse size={16} /> Internada desde {luna.desde}</p>
          <h3 className="vet-titulo mt-1 text-[1.6rem]">¿Cómo está {luna.nombre}?</h3>
          <p className="mt-1 opacity-80">{luna.motivo}.</p>
          <ol className="mt-5 space-y-4 border-l-2 pl-5" style={{ borderColor: MENTA }}>
            {[...luna.notas].reverse().map((n, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full" style={{ background: estadoColor(n.estado) }} />
                <p className="text-[0.85rem] font-semibold opacity-70">{n.hora} · {estadoTexto(n.estado)}</p>
                <p className="mt-0.5 text-[1.02rem]">{n.texto}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[0.9rem] opacity-70">En la parte de "Clínica" puedes mandar una noticia nueva y aparece aquí.</p>
        </div>
      )}

      {sel !== "toby" && sel !== "luna" && (
        <div className="carne mt-6 p-5 sm:p-7">
          <p className="vet-titulo text-[1.8rem]">{actual.nombre}</p>
          <p className="opacity-75">{actual.especie === "perro" ? "Perro" : "Gato"} · carpeta nueva</p>
          <p className="mt-6 rounded-2xl p-4" style={{ background: MENTA }}>Todavía no tiene vacunas anotadas. En su primera cita la doctora le llena el carné y desde ese día te avisamos por WhatsApp cuándo le toca cada una.</p>
        </div>
      )}
    </section>
  );
}

const estadoColor = (e: Nota["estado"]) => (e === "mejor" ? VERDE : e === "estable" ? BOSQUE : AMBAR);
const estadoTexto = (e: Nota["estado"]) => (e === "mejor" ? "Mejorando" : e === "estable" ? "Estable" : "En observación");

/* ---------------- la clínica ---------------- */
