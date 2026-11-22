/*
 * Demo: "Pediatría Semillita" (negocio inventado, datos de ejemplo, fotos de Unsplash).
 * Tres partes: la página para las familias (vacunas por edad y citas), "Mis hijos" (vacunas,
 * curva de peso y próxima cita de cada hijo) y el consultorio (agenda del día, vacunas atrasadas y peso).
 */
import { useEffect, useState } from "react";
import { ArrowRight, Baby, CalendarCheck, Check, Phone, Syringe, Thermometer } from "lucide-react";
import { BandaDemos, PartesDemo, CierreJzet, MensajeWhatsApp } from "../comun";
import { Curva } from "./Curva";
import PanelPediatria from "./PanelPediatria";
import {
  CIELO, CIELO2, CORAL, FOTOS, HORAS, LIMA, MARINO, REDONDA, SOL, VACUNAS,
  edadTexto, mesesDe, toMin, usePediatria,
  type Cita, type Pedi,
} from "./datos";

const btn = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold transition active:scale-[0.98]";

const ESTILOS = `
.pedi h1, .pedi h2, .pedi h3 { color: inherit; }
.pedi-titulo { font-family: ${REDONDA}; font-weight: 800; line-height: 1.02; letter-spacing: -0.01em; }
.pedi-hero { display: grid; gap: 2rem; }
@media (min-width: 960px) { .pedi-hero { grid-template-columns: 1.05fr 1fr; align-items: center; } }
.pedi-dos { display: grid; gap: 1.5rem; }
@media (min-width: 960px) { .pedi-dos { grid-template-columns: 1fr 1fr; } }
.pedi-consul { display: grid; gap: 1.5rem; }
@media (min-width: 1024px) { .pedi-consul { grid-template-columns: 1.4fr 1fr; } }
/* la regla para medir estatura que va pegada en la pared del consultorio */
.regla { height: 34px; background:
  repeating-linear-gradient(90deg, ${MARINO} 0 2px, transparent 2px 10px) 0 0 / 100% 10px no-repeat,
  repeating-linear-gradient(90deg, ${MARINO} 0 2px, transparent 2px 50px) 0 0 / 100% 18px no-repeat,
  linear-gradient(90deg, ${SOL} 0 20%, ${LIMA} 20% 40%, ${CIELO2} 40% 60%, ${CORAL} 60% 80%, ${SOL} 80%); }
`;

/* logo: semillita con dos hojas que sale de una tierra redonda */
function Logo({ tam = 42 }: { tam?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={tam} height={tam} aria-hidden className="shrink-0">
      <circle cx="24" cy="24" r="22" fill="#fff" />
      <path d="M24 36 C24 30 24 26 24 21" stroke={LIMA} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M24 23 C17 23 12 19 12 12 C19 12 24 16 24 23 Z" fill={LIMA} />
      <path d="M24 21 C30 21 35 17.5 36 11 C29.5 11 24.5 14.5 24 21 Z" fill={CORAL} />
      <path d="M12 36 Q24 30 36 36 Q34 42 24 42 Q14 42 12 36 Z" fill={MARINO} />
    </svg>
  );
}
function Marca() {
  return (
    <span className="flex items-center gap-2.5">
      <Logo />
      <span className="leading-none">
        <span className="pedi-titulo block text-[1.45rem]">Semillita</span>
        <span className="block whitespace-nowrap text-[0.72rem] font-bold opacity-70"><span className="sm:hidden">Pediatría</span><span className="hidden sm:inline">Pediatría · Dra. Lucía Ordóñez</span></span>
      </span>
    </span>
  );
}

type Vista = "pagina" | "hijos" | "consultorio";

export default function PediatriaDemo() {
  const p = usePediatria();
  const leer = (): Vista => (location.hash === "#hijos" ? "hijos" : location.hash === "#consultorio" ? "consultorio" : "pagina");
  const [vista, setVista] = useState<Vista>(leer);
  useEffect(() => {
    const cambio = () => setVista(leer());
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", vista === "pagina" ? location.pathname : `#${vista}`);
    document.title = vista === "consultorio" ? "Consultorio · Semillita" : vista === "hijos" ? "Mis hijos · Semillita" : "Pediatría Semillita · Demo de Jzet Labs";
    window.scrollTo(0, 0);
  }, [vista]);

  return (
    <div className="pedi min-h-screen" style={{ background: CIELO, color: MARINO }}>
      <style>{ESTILOS}</style>
      <BandaDemos />
      <PartesDemo fondo={MARINO} actual={vista} alCambiar={setVista} partes={[{ id: "pagina", nombre: "Página", quien: "Las familias ven vacunas y apartan cita" }, { id: "hijos", nombre: "App de la mamá", quien: "Vacunas, peso y carné de cada hijo" }, { id: "consultorio", nombre: "Consultorio", quien: "La doctora ve la agenda y anota peso" }] as const} />
      {vista === "pagina" && <Pagina p={p} alAgendar={() => setVista("hijos")} />}
      {vista === "hijos" && <MisHijos p={p} />}
      {vista === "consultorio" && <PanelPediatria p={p} />}
      <CierreJzet demo="clínica pediátrica" />
    </div>
  );
}

/* ---------------- la página ---------------- */

function Pagina({ p, alAgendar }: { p: Pedi; alAgendar: () => void }) {
  const [nace, setNace] = useState(p.ninos[0].nace);
  const [tipo, setTipo] = useState<Cita["tipo"]>("enfermedad");
  const [hijo, setHijo] = useState(p.ninos[0].id);
  const [hora, setHora] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const meses = mesesDe(nace);
  const ocupadas = p.agenda.map((c) => c.hora);
  const ahora = new Date().getHours() * 60 + new Date().getMinutes();
  // si ya pasó la hora, el horario libre se muestra para mañana
  const libres = HORAS.filter((h) => !ocupadas.includes(h));
  const hoyLibres = libres.filter((h) => toMin(h) > ahora + 30);
  const mostrar = hoyLibres.length ? hoyLibres : libres;
  const dia = hoyLibres.length ? "hoy" : "mañana";
  const n = p.ninos.find((x) => x.id === hijo)!;

  function agendar() {
    if (!hora) return;
    const motivo = tipo === "enfermedad" ? "Consulta por enfermedad" : tipo === "vacuna" ? "Vacunas" : "Control de niño sano";
    p.agendar({ hora, nino: n.nombre + " Méndez", edad: edadTexto(mesesDe(n.nace)), mama: n.mama, tipo, motivo, tel: n.tel });
    setMsg(`Hola, Semillita. Soy ${n.mama.split(" ")[0]}, mamá de ${n.nombre} (${edadTexto(mesesDe(n.nace))}). Aparté ${motivo.toLowerCase()} para ${dia} a las ${hora}.`);
    setHora(null);
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-black/5 backdrop-blur" style={{ background: "rgba(220,240,250,.94)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#inicio" aria-label="Pediatría Semillita">
            <Marca />
          </a>
          <nav className="hidden gap-7 font-bold md:flex">
            <a href="#vacunas" className="hover:underline">Vacunas</a>
            <a href="#citas" className="hover:underline">Citas</a>
            <a href="#alarma" className="hover:underline">¿Cuándo venir ya?</a>
          </nav>
          <a href="#citas" className={`${btn} shrink-0 whitespace-nowrap !px-4 !py-2.5 text-white`} style={{ background: CORAL }}>
            Agendar cita
          </a>
        </div>
      </header>

      <section id="inicio" className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <div className="pedi-hero">
          <div>
            <h1 className="pedi-titulo text-[2.6rem] sm:text-[3.6rem]">Pediatra en la Roosevelt para niños de 0 a 15 años</h1>
            <p className="mt-5 max-w-lg text-[1.1rem] leading-relaxed opacity-85">
              Vea qué vacuna le toca según su edad, aparte cita para hoy si está enfermito y lleve su curva de crecimiento sin buscar el carné.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#citas" className={`${btn} text-white`} style={{ background: CORAL }}>
                Apartar una cita <ArrowRight size={18} />
              </a>
              <a href="#vacunas" className={`${btn} border-2 bg-white`} style={{ borderColor: MARINO }}>
                ¿Qué vacuna le toca?
              </a>
            </div>
            <p className="mt-6 text-[0.92rem] font-semibold opacity-70">Colonia Roosevelt, zona 11 · Lunes a viernes 8:00 a 12:00 y 15:00 a 18:00 · Sábado 8:00 a 12:00</p>
          </div>
          <div>
            <img src={FOTOS.examen} alt="La doctora revisa a un bebé con el estetoscopio" className="h-[400px] w-full rounded-[2rem] object-cover sm:h-[460px]" />
          </div>
        </div>
      </section>
      <div className="regla mt-6" aria-hidden />

      {/* calculadora de vacunas */}
      <section id="vacunas" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14 md:py-16">
        <h2 className="pedi-titulo text-[2.5rem] sm:text-[3.2rem]">¿Qué vacuna le toca?</h2>
        <p className="mt-1 opacity-80">Ponga la fecha en que nació y le decimos cuáles ya debería tener y cuál sigue.</p>
        <label className="mt-6 flex w-fit items-center gap-3 rounded-2xl bg-white px-4 py-3 font-bold">
          Nació el
          <input type="date" value={nace} max={new Date().toISOString().slice(0, 10)} onChange={(e) => e.target.value && setNace(e.target.value)} className="rounded-lg border border-black/15 px-2 py-1.5 font-semibold" />
          <span className="opacity-70">({edadTexto(meses)})</span>
        </label>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {VACUNAS.map((v) => {
            const ya = v.mes <= meses;
            const sigue = !ya && VACUNAS.find((x) => x.mes > meses)?.mes === v.mes;
            return (
              <li key={v.mes} className="rounded-2xl p-4" style={{ background: sigue ? CORAL : ya ? "#fff" : "rgba(255,255,255,.5)", color: sigue ? "#fff" : MARINO }}>
                <p className="flex items-center justify-between font-bold">
                  {v.edad}
                  {ya ? <Check size={20} style={{ color: LIMA }} /> : sigue ? <span className="rounded-full bg-white px-2 py-0.5 text-[0.75rem]" style={{ color: CORAL }}>sigue</span> : null}
                </p>
                <ul className="mt-2 grid gap-1 text-[0.92rem]">
                  {v.lista.map((x) => (
                    <li key={x} className={ya || sigue ? "" : "opacity-60"}>{x}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-[0.9rem] opacity-70">Esquema de ejemplo. En la consulta la doctora revisa el carné y le confirma cuáles faltan.</p>
      </section>

      {/* citas */}
      <section id="citas" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
          <div className="pedi-dos">
            <div>
              <h2 className="pedi-titulo text-[2.5rem] sm:text-[3.2rem]">Aparte su cita</h2>
              <p className="mt-1 opacity-80">Si está enfermito, le damos espacio el mismo día. Los controles y las vacunas se apartan con tiempo.</p>
              <div className="mt-6 grid gap-2">
                {(
                  [
                    ["enfermedad", "Está enfermo", "Fiebre, tos, diarrea, dolor de oído", Thermometer],
                    ["control", "Control de niño sano", "Peso, talla, desarrollo y alimentación", Baby],
                    ["vacuna", "Vacunas", "Las que le tocan según su edad", Syringe],
                  ] as const
                ).map(([v, t, d, I]) => (
                  <button key={v} type="button" onClick={() => setTipo(v)} className="flex items-center gap-3 rounded-2xl border-2 p-3 text-left" style={tipo === v ? { borderColor: CORAL, background: "#fff4f1" } : { borderColor: "rgba(0,0,0,.08)" }}>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full" style={{ background: CIELO }}><I size={20} /></span>
                    <span>
                      <b className="block">{t}</b>
                      <span className="text-[0.9rem] opacity-75">{d}</span>
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-6 font-bold">¿Para cuál de sus hijos?</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.ninos.map((x) => (
                  <button key={x.id} type="button" onClick={() => setHijo(x.id)} className="rounded-full border-2 px-4 py-2 font-bold" style={hijo === x.id ? { borderColor: MARINO, background: MARINO, color: "#fff" } : { borderColor: "rgba(0,0,0,.12)" }}>
                    {x.nombre} · {edadTexto(mesesDe(x.nace))}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-[1.6rem] p-5 sm:p-6" style={{ background: CIELO }}>
              <p className="font-bold">Horas libres {dia}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {mostrar.map((h) => (
                  <button key={h} type="button" onClick={() => setHora(h)} className="rounded-xl py-2.5 font-bold" style={hora === h ? { background: CORAL, color: "#fff" } : { background: "#fff" }}>
                    {h}
                  </button>
                ))}
              </div>
              <button type="button" disabled={!hora} onClick={agendar} className={`${btn} mt-5 w-full text-white disabled:opacity-40`} style={{ background: MARINO }}>
                <CalendarCheck size={18} /> {hora ? `Apartar ${dia} a las ${hora}` : "Escoja una hora"}
              </button>
              <img src={FOTOS.mama} alt="Mamá cargando a su bebé" loading="lazy" className="mt-5 h-48 w-full rounded-2xl object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* señales de alarma */}
      <section id="alarma" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14 md:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="pedi-titulo text-[2.5rem] sm:text-[3.2rem]">¿Cuándo llamar de una vez?</h2>
            <p className="mt-2 opacity-80">Si su hijo tiene alguna de estas señales, no espere la cita: llame a la clínica o vaya a la emergencia más cercana.</p>
            <ul className="mt-5 grid gap-2">
              {["Bebé menor de 3 meses con fiebre", "Le cuesta respirar o se le hunden las costillas", "No quiere comer ni tomar y casi no moja el pañal", "Está muy decaído o no despierta bien", "Convulsiones o manchas moradas en la piel"].map((x) => (
                <li key={x} className="flex gap-2.5 rounded-xl bg-white px-4 py-2.5 font-semibold">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: CORAL }} /> {x}
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-2 font-bold"><Phone size={18} /> Clínica: 2222 0000 (número de ejemplo)</p>
          </div>
          <img src={FOTOS.cinco} alt="La doctora choca los cinco con un niño" loading="lazy" className="h-80 w-full rounded-[2rem] object-cover" />
        </div>
      </section>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="clínica pediátrica" que="la cita" accion={{ texto: "Ver la app de la mamá", alTocar: () => { setMsg(null); alAgendar(); } }} />
    </>
  );
}

/* ---------------- curva de peso ---------------- */

/* ---------------- mis hijos ---------------- */

function MisHijos({ p }: { p: Pedi }) {
  const [id, setId] = useState(p.ninos[0].id);
  const n = p.ninos.find((x) => x.id === id)!;
  const meses = mesesDe(n.nace);
  const sig = VACUNAS.find((v) => !n.vacunas.includes(v.mes));
  const atrasada = sig && sig.mes <= meses;
  const ult = n.pesos[n.pesos.length - 1];
  const cita = p.agenda.find((c) => c.nino.startsWith(n.nombre) && c.estado !== "listo");

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <Marca />
        <span className="text-[0.9rem] font-bold opacity-70">Hola, Karla</span>
      </div>
      <div className="mt-5 flex gap-2">
        {p.ninos.map((x) => (
          <button key={x.id} type="button" onClick={() => setId(x.id)} className="flex-1 rounded-2xl p-3 text-left" style={id === x.id ? { background: MARINO, color: "#fff" } : { background: "#fff" }}>
            <b className="pedi-titulo block text-[1.4rem]">{x.nombre}</b>
            <span className="text-[0.9rem] opacity-80">{edadTexto(mesesDe(x.nace))}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl p-4 text-white" style={{ background: atrasada ? CORAL : LIMA }}>
          <p className="flex items-center gap-2 font-bold"><Syringe size={18} /> {sig ? (atrasada ? "Vacuna pendiente" : "Siguiente vacuna") : "Vacunas al día"}</p>
          {sig ? (
            <>
              <p className="pedi-titulo mt-1 text-[1.5rem]">{sig.edad}</p>
              <p className="text-[0.92rem]">{sig.lista.join(", ")}</p>
            </>
          ) : (
            <p className="mt-1">Tiene todas las de su edad.</p>
          )}
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="flex items-center gap-2 font-bold"><CalendarCheck size={18} style={{ color: CORAL }} /> Próxima cita</p>
          {cita ? (
            <>
              <p className="pedi-titulo mt-1 text-[1.5rem]">A las {cita.hora}</p>
              <p className="text-[0.92rem] opacity-80">{cita.motivo}</p>
            </>
          ) : (
            <p className="mt-1 opacity-75">No tiene cita apartada. Puede apartarla desde la página.</p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-bold">Peso de {n.nombre}</p>
          <p className="text-[0.92rem] opacity-80">Último control: <b>{ult.kg} kg</b> y <b>{ult.cm} cm</b> a los {edadTexto(ult.mes)}</p>
        </div>
        {meses <= 14 ? (
          <>
            <Curva n={n} />
            <p className="text-[0.85rem] opacity-70">La franja celeste es el rango esperado para su edad. La línea coral es {n.nombre}.</p>
          </>
        ) : (
          <ul className="mt-3 grid gap-1">
            {n.pesos.map((x) => (
              <li key={x.mes} className="flex justify-between border-b border-black/5 py-1.5">
                <span>{edadTexto(x.mes)}</span>
                <b>{x.kg} kg · {x.cm} cm</b>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4">
        <p className="font-bold">Carné de vacunas</p>
        <ul className="mt-2 grid gap-1.5">
          {VACUNAS.map((v) => {
            const ya = n.vacunas.includes(v.mes);
            const toca = !ya && v.mes <= meses;
            return (
              <li key={v.mes} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white" style={{ background: ya ? LIMA : toca ? CORAL : "#cfd8e0" }}>
                  {ya ? <Check size={14} /> : null}
                </span>
                <span className="text-[0.95rem]">
                  <b>{v.edad}</b> <span className="opacity-75">· {v.lista.join(", ")}</span>
                  {toca && <b className="ml-1" style={{ color: CORAL }}>falta</b>}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- consultorio ---------------- */
