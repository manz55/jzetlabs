/*
 * Demo: "Veterinaria Huesitos" (negocio inventado, datos de ejemplo).
 * Tres partes, cada una resuelve un problema real:
 *  - Página: precios a la vista, "¿es urgencia?" y cita sin llamar (el teléfono deja de saturarse).
 *  - Mi mascota: carné de vacunas con la próxima fecha, resultados explicados y noticias del internado.
 *  - Clínica: agenda del día, recordatorios de vacunas vencidas y noticias a los dueños de internados.
 */
import { useEffect, useState } from "react";
import { ArrowRight, Bell, CalendarCheck, Check, ClipboardList, FlaskConical, HeartPulse, Phone, Syringe } from "lucide-react";
import { BandaDemos, PartesDemo, CierreJzet, MensajeWhatsApp } from "../comun";
import {
  AGENDA_INICIAL, AMBAR, BOSQUE, CREMA, EXAMEN, HORAS, INTERNADOS_INICIAL, MENTA, MOSTAZA, PAPEL, PENDIENTES_INICIAL, QUE_HACER, ROJO,
  SERVICIOS, SINTOMAS, TITULO, TOBY, VERDE, diasHasta, edad, fechaLarga, qz, sumarMeses,
  type Cita, type Internado, type Nivel, type Nota, type Pendiente, type ServicioId,
} from "./datos";

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
      {vista === "clinica" && <Clinica internados={internados} setInternados={setInternados} />}
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
    if (!mascota.trim() || !dueno.trim()) return setError("Escriba el nombre de su mascota y el suyo.");
    if (!hora) return setError("Escoja una hora libre.");
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
              Vea los precios antes de venir, revise si lo que tiene su mascota es urgencia y aparte su cita sin llamar.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#urgencia" className={`${btn} text-white`} style={{ background: BOSQUE }}>¿Es urgencia? <ArrowRight size={18} /></a>
              <a href="#cita" className={`${btn} border-2`} style={{ borderColor: BOSQUE }}>Apartar cita</a>
            </div>
            <p className="mt-5 text-[0.95rem] opacity-75">Lunes a sábado de 8:00 a 18:00 · Urgencias hasta las 22:00 · Mariscal, zona 11</p>
          </div>
          <CarneMini />
        </div>
      </section>

      <section id="precios" className="scroll-mt-20 border-y border-black/5" style={{ background: PAPEL }}>
        <div className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="vet-titulo text-[2rem]">Precios</h2>
          <p className="mt-1 opacity-75">Para que sepa cuánto trae antes de salir de su casa.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS.map((s) => (
              <div key={s.id} className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[1.1rem] font-bold">{s.nombre}</p>
                  <p className="whitespace-nowrap text-[1.1rem] font-bold" style={{ color: VERDE }}>{s.dura === 0 || s.detalle.startsWith("Desde") ? "desde " : ""}{qz(s.precio)}</p>
                </div>
                <p className="mt-1.5 text-[0.95rem] opacity-75">{s.detalle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="urgencia" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-12">
        <div className="vet-dos">
          <div>
            <h2 className="vet-titulo text-[2rem]">¿Es urgencia o puede esperar?</h2>
            <p className="mt-1 max-w-md opacity-80">Marque lo que le está pasando a su mascota y le decimos qué hacer. Es una guía, no un diagnóstico: si tiene duda, llámenos.</p>
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
                Marque uno o más síntomas y aquí le sale qué hacer.
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="cita" className="scroll-mt-20" style={{ background: MENTA }}>
        <div className="mx-auto max-w-3xl px-5 py-12">
          <h2 className="vet-titulo text-[2rem]">Apartar cita para hoy</h2>
          <p className="mt-1 opacity-80">Sin llamar ni esperar a que le contesten.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="text-[0.95rem] font-semibold">Nombre de su mascota
              <input value={mascota} onChange={(e) => setMascota(e.target.value)} placeholder="Ej. Toby" className="mt-1 w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-normal" />
            </label>
            <label className="text-[0.95rem] font-semibold">Su nombre
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

      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="veterinaria" que="la cita" />
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
        <Bell size={14} className="mr-1 inline" /> Le avisamos por WhatsApp una semana antes: {prox.nombre.split(" (")[0]}, {fechaLarga(prox.vence)}.
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

function MiMascota({ internados }: { internados: Internado[] }) {
  const [tab, setTab] = useState<"carne" | "resultados" | "internado">("carne");
  const luna = internados.find((i) => i.id === "luna")!;
  const max = Math.max(...TOBY.pesos.map((p) => p.kg));
  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <p className="text-[0.95rem] opacity-75">Así lo ve {TOBY.dueno.split(" ")[0]} en su teléfono, con su número de cliente.</p>
      <div className="mt-3 flex gap-2 overflow-x-auto" role="tablist">
        {([["carne", "Carné de Toby", Syringe], ["resultados", "Resultados", FlaskConical], ["internado", "Luna internada", HeartPulse]] as const).map(([id, t, I]) => (
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
          <p className="mt-5 text-[0.85rem] opacity-60">La franja verde es lo normal. Cualquier duda, pregúntele al doctor en su próxima cita.</p>
        </div>
      )}

      {tab === "internado" && (
        <div className="mt-5 rounded-3xl border border-black/10 bg-white p-5 sm:p-7">
          <p className="text-[0.9rem] opacity-70">Internada desde {luna.desde}</p>
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
          <p className="mt-5 text-[0.9rem] opacity-70">En la parte de "Clínica" puede mandar una noticia nueva y aparece aquí.</p>
        </div>
      )}
    </section>
  );
}

const estadoColor = (e: Nota["estado"]) => (e === "mejor" ? VERDE : e === "estable" ? BOSQUE : AMBAR);
const estadoTexto = (e: Nota["estado"]) => (e === "mejor" ? "Mejorando" : e === "estable" ? "Estable" : "En observación");

/* ---------------- la clínica ---------------- */

function Clinica({ internados, setInternados }: { internados: Internado[]; setInternados: (f: (l: Internado[]) => Internado[]) => void }) {
  const [agenda, setAgenda] = useState<Cita[]>(AGENDA_INICIAL);
  const [pendientes, setPendientes] = useState<(Pendiente & { avisado?: boolean })[]>(PENDIENTES_INICIAL);
  const [msg, setMsg] = useState<string | null>(null);
  const [nota, setNota] = useState<Record<string, { texto: string; estado: Nota["estado"] }>>({});
  const siguiente: Record<Cita["estado"], Cita["estado"]> = { espera: "llego", llego: "atendido", atendido: "atendido" };
  const vencidas = pendientes.filter((p) => p.dias < 0 && !p.avisado).length;

  function avisar(p: Pendiente) {
    setPendientes((l) => l.map((x) => (x.id === p.id ? { ...x, avisado: true } : x)));
    setMsg(
      p.dias < 0
        ? `Hola ${p.dueno.split(" ")[0]}, le saluda Veterinaria Huesitos. A ${p.mascota} se le venció la vacuna de ${p.vacuna} el ${p.vence}. ¿Le apartamos un horario esta semana? Solo responda con el día que le queda bien.`
        : `Hola ${p.dueno.split(" ")[0]}, le saluda Veterinaria Huesitos. A ${p.mascota} le toca su vacuna de ${p.vacuna} el ${p.vence}. ¿Le apartamos un horario? Solo responda con el día que le queda bien.`,
    );
  }

  function mandarNota(i: Internado) {
    const n = nota[i.id];
    if (!n?.texto.trim()) return;
    const hora = new Date().toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false });
    setInternados((l) => l.map((x) => (x.id === i.id ? { ...x, notas: [...x.notas, { hora: `Hoy ${hora}`, texto: n.texto.trim(), estado: n.estado }] } : x)));
    setNota((m) => ({ ...m, [i.id]: { texto: "", estado: "estable" } }));
    setMsg(`Hola ${i.dueno.split(" ")[0]}, le saluda Veterinaria Huesitos con noticias de ${i.nombre}: ${n.texto.trim()} (${estadoTexto(n.estado).toLowerCase()}). Puede ver todo en su enlace de cliente.`);
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <h2 className="vet-titulo text-[2rem]">Buenos días, Dr. Pérez</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Citas hoy", agenda.length],
          ["En sala de espera", agenda.filter((c) => c.estado === "llego").length],
          ["Internados", internados.length],
          ["Vacunas vencidas sin avisar", vencidas],
        ].map(([t, n]) => (
          <div key={t as string} className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-[0.85rem] opacity-70">{t}</p>
            <p className="vet-titulo text-[2rem] tabular-nums">{n}</p>
          </div>
        ))}
      </div>

      <div className="vet-dos mt-6">
        <div className="rounded-3xl border border-black/10 bg-white p-5">
          <h3 className="flex items-center gap-2 text-[1.2rem] font-bold"><ClipboardList size={19} /> Agenda de hoy</h3>
          <ul className="mt-3 divide-y divide-black/10">
            {agenda.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold"><span className="tabular-nums">{c.hora}</span> · {c.mascota} <span className="text-[0.85rem] font-normal opacity-60">({c.especie})</span></p>
                  <p className="text-[0.9rem] opacity-70">{c.servicio} · {c.dueno}</p>
                </div>
                <button type="button" disabled={c.estado === "atendido"} onClick={() => setAgenda((l) => l.map((x) => (x.id === c.id ? { ...x, estado: siguiente[x.estado] } : x)))} className="shrink-0 rounded-full px-3 py-1.5 text-[0.85rem] font-bold disabled:cursor-default" style={c.estado === "atendido" ? { background: MENTA, color: VERDE } : c.estado === "llego" ? { background: MOSTAZA, color: "#fff" } : { background: "#f1f1f1" }}>
                  {c.estado === "atendido" ? <><Check size={14} className="inline" /> Atendido</> : c.estado === "llego" ? "Atender" : "Marcar llegada"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-5">
          <h3 className="flex items-center gap-2 text-[1.2rem] font-bold"><Bell size={19} /> Vacunas por vencer o vencidas</h3>
          <p className="mt-1 text-[0.9rem] opacity-70">Cada aviso es una cita que no se pierde.</p>
          <ul className="mt-3 divide-y divide-black/10">
            {pendientes.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold">{p.mascota} · {p.vacuna}</p>
                  <p className="text-[0.9rem]" style={{ color: p.dias < 0 ? ROJO : AMBAR }}>{p.dias < 0 ? `Vencida hace ${-p.dias} días` : p.dias <= 1 ? "Vence mañana" : `Vence en ${p.dias} días`} · {p.dueno}</p>
                </div>
                <button type="button" disabled={p.avisado} onClick={() => avisar(p)} className="shrink-0 rounded-full px-3 py-1.5 text-[0.85rem] font-bold text-white disabled:opacity-100" style={{ background: p.avisado ? VERDE : BOSQUE }}>
                  {p.avisado ? "Avisado" : "Avisar por WhatsApp"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5">
        <h3 className="flex items-center gap-2 text-[1.2rem] font-bold"><HeartPulse size={19} /> Internados</h3>
        <p className="mt-1 text-[0.9rem] opacity-70">El dueño ve cada noticia en su teléfono y deja de llamar para preguntar.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {internados.map((i) => {
            const n = nota[i.id] ?? { texto: "", estado: "estable" as Nota["estado"] };
            const ult = i.notas[i.notas.length - 1];
            return (
              <div key={i.id} className="rounded-2xl border border-black/10 p-4">
                <p className="font-bold">{i.nombre} <span className="font-normal opacity-60">({i.especie}) · {i.dueno}</span></p>
                <p className="text-[0.9rem] opacity-75">{i.motivo}</p>
                <p className="mt-2 text-[0.9rem]"><span className="font-semibold">Última noticia:</span> {ult.texto}</p>
                <label className="mt-3 block text-[0.9rem] font-semibold">Noticia nueva para el dueño
                  <input value={n.texto} onChange={(e) => setNota((m) => ({ ...m, [i.id]: { ...n, texto: e.target.value } }))} placeholder="Ej. Ya comió y movió la cola" className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2.5 font-normal" />
                </label>
                <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={`Estado de ${i.nombre}`}>
                  {(["mejor", "estable", "atento"] as const).map((e) => (
                    <button key={e} type="button" aria-pressed={n.estado === e} onClick={() => setNota((m) => ({ ...m, [i.id]: { ...n, estado: e } }))} className="rounded-full border px-3 py-1.5 text-[0.85rem] font-bold" style={n.estado === e ? { background: estadoColor(e), color: "#fff", borderColor: estadoColor(e) } : { borderColor: "rgba(0,0,0,.15)" }}>{estadoTexto(e)}</button>
                  ))}
                </div>
                <button type="button" onClick={() => mandarNota(i)} className={`${btn} mt-3 w-full !py-2.5 text-white`} style={{ background: BOSQUE }}>Mandar noticia</button>
              </div>
            );
          })}
        </div>
      </div>

      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="veterinaria" que="el aviso al dueño" />
    </section>
  );
}
