/* Planes y Clases: la portada. Se lee de arriba abajo en el mismo orden que el menú. */
import { useRef, useState, type ReactNode } from "react";
import { ArrowRight, Car, Check, Clock, Dumbbell, HeartPulse, Info, MapPin, Navigation, Ruler, User, Users } from "lucide-react";
import { irA, useCarga, useEscalonado } from "./animar";
import { CLASES, DIAS, FOTOS, HORARIO, PLANES, SEDES, diaDeHoy, estadoDe, libresDe, mapa, planDe, qz, sedeDe, type Club, type PlanId, type Socio } from "./datos";
import { ANCHO, BORDE, Foto, Titulo, VERDE } from "./Piezas";

const INSTALACIONES = [
  { icono: Dumbbell, nombre: "Zona de Peso Libre y Máquinas", texto: "Racks, plataformas, barras olímpicas, mancuernas y máquinas guiadas.", foto: FOTOS.pesas, alt: "Sala amplia con racks, bancos y máquinas de fuerza" },
  { icono: HeartPulse, nombre: "Cardio y Ergómetros", texto: "Caminadoras, bicicletas, elípticas y remos para calentar o quemar.", foto: FOTOS.cardio, alt: "Fila de caminadoras junto a ventanas" },
  { icono: Users, nombre: "Salón de Clases Grupales", texto: "Fuerza, funcional, spinning y baile con coach, de lunes a sábado.", foto: FOTOS.grupal, alt: "Grupo en clase haciendo ejercicio con ligas" },
  { icono: Ruler, nombre: "Evaluación Física Mensual sin costo", texto: "Peso, grasa y masa muscular, y su coach le ajusta la rutina.", foto: FOTOS.evaluacion, alt: "Entrenador revisando el progreso con una socia en una tableta" },
];

const METRICAS = [
  { dato: "+1,200 m²", texto: "equipados" },
  { dato: "Matrícula Q0 hoy", texto: "al inscribirse" },
  { dato: "5:00 a.m. a 10:00 p.m.", texto: "lunes a viernes" },
];

function Seccion({ id, gris = false, children }: { id: string; gris?: boolean; children: ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-24 py-14 sm:py-20 ${gris ? "bg-[#F8FAFC]" : "bg-white"}`}>
      <div className={ANCHO}>{children}</div>
    </section>
  );
}

export function Inicio({ club, socio, alElegirPlan, alPase }: { club: Club; socio: Socio; alElegirPlan: (p: PlanId) => void; alPase: () => void }) {
  return (
    <>
      <section className="bg-[#F8FAFC]">
        <div className={`${ANCHO} grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:py-16`}>
          <div className="min-w-0">
            <p className="flex items-start gap-2 text-[0.9rem] font-bold text-[#15803D]">
              <MapPin size={18} aria-hidden className="mt-0.5 shrink-0" /> Zona 14 y Carretera a El Salvador
            </p>
            <h1 className="mt-4 text-[clamp(1.85rem,1.2rem+2.6vw,3.35rem)] font-extrabold leading-[1.12] tracking-tight">
              Entrenamiento de fuerza, clases grupales y seguimiento físico <span className="text-[#15803D]">sin contratos forzosos ni penalizaciones</span>
            </h1>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => irA("planes")} className={`${VERDE} !min-h-14 !px-8 !text-[1.05rem]`}>
                Elegir mi plan <ArrowRight size={20} aria-hidden />
              </button>
              <button type="button" onClick={() => irA("horarios")} className={`${BORDE} !min-h-14 !px-7 !text-[1.05rem]`}>
                Ver horarios de clases
              </button>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-x-3 gap-y-4 border-t border-slate-200 pt-6 sm:grid-cols-[1fr_1fr_1.35fr]">
              {METRICAS.map((x) => (
                <div key={x.dato} className="min-w-0 max-sm:last:col-span-2">
                  <dt className="text-[1.15rem] font-extrabold text-[#0F172A]">{x.dato}</dt>
                  <dd className="text-[0.9rem] text-slate-600">{x.texto}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Foto id={FOTOS.portada} alt="Socia levantando peso mientras su entrenador revisa la técnica" ancho={1100} alto={1000} pronto className="aspect-[4/3] w-full rounded-2xl lg:aspect-[11/10]" />
        </div>
      </section>

      <Seccion id="instalaciones">
        <Titulo titulo="Lo que incluye el club" texto="Todo esto viene con cualquiera de los planes; las clases grupales, según el plan que elija." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INSTALACIONES.map(({ icono: Icono, nombre, texto, foto, alt }) => (
            <li key={nombre} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
              <Foto id={foto} alt={alt} ancho={640} alto={440} className="aspect-[16/10]" />
              <div className="flex flex-1 flex-col gap-2 p-5">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-green-50 text-[#15803D]">
                  <Icono size={22} aria-hidden />
                </span>
                <h3 className="text-[1.08rem] font-extrabold leading-snug">{nombre}</h3>
                <p className="text-[0.93rem] text-slate-600">{texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </Seccion>

      <Seccion id="planes" gris>
        <Titulo titulo="Elija su plan" texto="Se paga mes a mes. Matrícula Q0 inscribiéndose hoy y puede dejarlo cuando quiera, sin multas." />
        <ul className="grid gap-4 lg:grid-cols-3">
          {PLANES.map((p) => {
            const destacado = p.id === "ilimitado";
            return (
              <li key={p.id} className={`flex min-w-0 flex-col rounded-xl bg-white p-6 ${destacado ? "border-2 border-[#15803D]" : "border border-slate-200"}`}>
                <p className={`mb-3 w-fit rounded-full px-3 py-1 text-[0.75rem] font-bold ${destacado ? "bg-[#15803D] text-white" : "bg-slate-100 text-slate-600"}`}>{destacado ? "Recomendado" : p.id === "duo" ? "Para dos" : "Básico"}</p>
                <h3 className="text-[1.3rem] font-extrabold">{p.nombre}</h3>
                <p className="text-[0.93rem] text-slate-600">{p.para}</p>
                <p className="mt-4 flex items-baseline gap-1 text-[#0F172A]">
                  <span className="text-[2.6rem] font-extrabold leading-none tracking-tight">{qz(p.precio)}</span>
                  <span className="font-semibold text-slate-500">/mes</span>
                </p>
                <ul className="mt-5 grid gap-2.5 border-t border-slate-200 pt-5 text-[0.95rem]">
                  {p.incluye.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <Check size={18} aria-hidden className="mt-1 shrink-0 text-[#15803D]" />
                      <span className="min-w-0">{x}</span>
                    </li>
                  ))}
                  {p.aparte && (
                    <li className="flex gap-2.5 text-slate-600">
                      <Info size={18} aria-hidden className="mt-1 shrink-0" />
                      <span className="min-w-0">{p.aparte}</span>
                    </li>
                  )}
                </ul>
                <div className="mt-auto pt-6">
                  <button type="button" onClick={() => alElegirPlan(p.id)} className={`${destacado ? VERDE : BORDE} w-full`}>
                    Inscribirme en este plan
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </Seccion>

      <Horarios club={club} socio={socio} alPase={alPase} />

      <Seccion id="ubicacion" gris>
        <Titulo titulo="Dos sedes con parqueo" texto="Su plan sirve en las dos. Toque “Cómo llegar” para abrir el mapa." />
        <ul className="grid gap-4 md:grid-cols-2">
          {SEDES.map((s) => (
            <li key={s.id} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
              <Foto id={s.foto} alt={s.alt} ancho={900} alto={480} className="aspect-[16/8.5]" />
              <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                <h3 className="text-[1.35rem] font-extrabold">{s.nombre}</h3>
                <p className="flex gap-2.5">
                  <MapPin size={20} aria-hidden className="mt-1 shrink-0 text-[#15803D]" />
                  <span className="min-w-0">{s.direccion}</span>
                </p>
                <p className="flex gap-2.5">
                  <Car size={20} aria-hidden className="mt-1 shrink-0 text-[#15803D]" />
                  <span className="min-w-0">{s.parqueo}</span>
                </p>
                <dl className="grid gap-1.5 border-y border-slate-200 py-3 text-[0.93rem]">
                  {HORARIO.map((h) => (
                    <div key={h.dias} className="flex flex-wrap justify-between gap-x-4">
                      <dt className="text-slate-600">{h.dias}</dt>
                      <dd className="font-bold text-[#0F172A]">{h.horas}</dd>
                    </div>
                  ))}
                </dl>
                <a href={mapa(s.direccion)} target="_blank" rel="noopener noreferrer" className={`${BORDE} mt-auto w-full`}>
                  <Navigation size={18} aria-hidden /> Cómo llegar
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Seccion>
    </>
  );
}

function Horarios({ club, socio, alPase }: { club: Club; socio: Socio; alPase: () => void }) {
  const [dia, setDia] = useState(diaDeHoy);
  const cargando = useCarga(String(dia), 300);
  const lista = useRef<HTMLUListElement>(null);
  useEscalonado(lista, String(dia), !cargando);

  const clases = CLASES.filter((c) => c.dia === dia);
  const vencido = estadoDe(socio.dias) === "vencido";

  return (
    <Seccion id="horarios">
      <Titulo titulo="Horario de clases" texto="Escoja el día y reserve con un toque. El cupo se aparta al instante." />

      <div role="group" aria-label="Día de la semana" className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {DIAS.map((nombre, i) => (
          <button
            key={nombre}
            type="button"
            aria-pressed={dia === i}
            onClick={() => setDia(i)}
            className={`flex min-h-14 min-w-0 cursor-pointer flex-col items-center justify-center rounded-lg border text-[0.95rem] font-bold leading-tight transition ${dia === i ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-slate-300 bg-white text-[#0F172A] hover:border-[#0F172A]"}`}
          >
            {nombre}
            {i === diaDeHoy() && new Date().getDay() !== 0 && <span className={`text-[0.7rem] font-semibold ${dia === i ? "text-green-300" : "text-[#15803D]"}`}>Hoy</span>}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-lg bg-[#F8FAFC] px-4 py-3 text-[0.93rem]">
        <User size={18} aria-hidden className="mt-1 shrink-0 text-[#15803D]" />
        <p className="min-w-0">
          Las reservas quedan a nombre de <b className="text-[#0F172A]">{socio.nombre}</b> · {planDe(socio.plan).nombre}.{" "}
          <button type="button" onClick={alPase} className="cursor-pointer font-bold text-[#15803D] underline underline-offset-4">
            Ver mi pase
          </button>
        </p>
      </div>

      <ul ref={lista} aria-busy={cargando} className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clases.map((c) => {
          if (cargando)
            return (
              <li key={c.id} aria-hidden className="grid h-[17.5rem] animate-pulse content-between rounded-xl border border-slate-200 p-5 motion-reduce:animate-none">
                <div className="grid gap-3">
                  <span className="h-7 w-28 rounded bg-slate-200" />
                  <span className="h-5 w-3/4 rounded bg-slate-200" />
                  <span className="h-4 w-1/2 rounded bg-slate-100" />
                  <span className="h-4 w-2/3 rounded bg-slate-100" />
                </div>
                <span className="h-12 rounded-lg bg-slate-200" />
              </li>
            );
          const mia = club.reservas.includes(`${socio.id}:${c.id}`);
          const libres = libresDe(c, club.reservas);
          const lleno = libres <= 0 && !mia;
          return (
            <li key={c.id} data-entra className={`flex min-w-0 flex-col rounded-xl border bg-white p-5 ${mia ? "border-[#15803D] ring-1 ring-[#15803D]" : "border-slate-200"}`}>
              <p className="flex items-center gap-2 text-[1.35rem] font-extrabold text-[#0F172A]">
                <Clock size={20} aria-hidden className="text-[#15803D]" /> {c.hora}
              </p>
              <h3 className="mt-1.5 text-[1.15rem] font-extrabold">{c.nombre}</h3>
              <p className="text-[0.93rem] text-slate-600">Coach {c.coach}</p>
              <p className="text-[0.93rem] text-slate-600">
                {c.sala} · {sedeDe(c.sede).nombre}
              </p>
              <div className="mt-auto pt-4">
                <p className="flex items-baseline justify-between gap-2 text-[0.9rem]">
                  <span className="text-slate-600">Cupos disponibles</span>
                  <b className={`text-[1.05rem] ${lleno ? "text-red-700" : "text-[#0F172A]"}`}>
                    {Math.max(libres, 0)}/{c.cupo}
                  </b>
                </p>
                <div aria-hidden className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full bg-[#15803D] transition-[width] duration-300" style={{ width: `${(Math.max(libres, 0) / c.cupo) * 100}%` }} />
                </div>
                {vencido && !mia ? (
                  <button type="button" onClick={alPase} className={`${BORDE} mt-3 w-full`}>
                    Renovar para reservar
                  </button>
                ) : (
                  <button type="button" disabled={lleno} aria-pressed={mia} onClick={() => club.alternarReserva(socio.id, c.id)} className={`${mia ? BORDE : VERDE} mt-3 w-full disabled:!bg-slate-200 disabled:!text-slate-500`}>
                    {mia ? (
                      <>
                        <Check size={18} aria-hidden className="text-[#15803D]" /> Reservado · Cancelar
                      </>
                    ) : lleno ? (
                      "Clase llena"
                    ) : (
                      "Reservar mi lugar"
                    )}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {socio.plan === "esencial" && <p className="mt-4 text-[0.9rem] text-slate-600">Con el Plan Esencial cada clase cuesta Q35 y se paga en recepción.</p>}
    </Seccion>
  );
}
