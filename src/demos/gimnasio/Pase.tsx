/* Pase de Socio: el carné de entrada, las clases reservadas y el progreso físico. */
import { useState } from "react";
import { CircleCheck, CircleX, Minus, Plus, RefreshCw, TrendingDown, TrendingUp, X } from "lucide-react";
import { CLASES, DIAS, EJERCICIOS, META_VISITAS, PASO_PESO, BARRA, estadoDe, fechaEn, planDe, qz, sedeDe, textoDias, type Club, type Medida, type Socio } from "./datos";
import { ANCHO, BORDE, CodigoQR, VERDE } from "./Piezas";

const uno = (n: number) => Number(n.toFixed(1));

/* cambio contra el mes pasado; "mejor" dice hacia dónde es buena noticia */
function Cambio({ medida, unidad, mejor }: { medida: Medida; unidad: string; mejor: "baja" | "sube" }) {
  const d = uno(medida.ahora - medida.antes);
  const bueno = mejor === "baja" ? d < 0 : d > 0;
  const Icono = d < 0 ? TrendingDown : TrendingUp;
  if (d === 0) return <p className="text-[0.82rem] text-slate-500">Igual que el mes pasado</p>;
  return (
    <p className={`flex items-start gap-1 text-[0.82rem] font-semibold ${bueno ? "text-[#15803D]" : "text-amber-700"}`}>
      <Icono size={15} aria-hidden className="mt-0.5 shrink-0" />
      <span>
        {d < 0 ? "Bajó" : "Subió"} {Math.abs(d)}
        {unidad} este mes
      </span>
    </p>
  );
}

export function Pase({ club, socio, alElegir, alHorarios }: { club: Club; socio: Socio; alElegir: (id: number) => void; alHorarios: () => void }) {
  const activo = estadoDe(socio.dias) !== "vencido";
  const plan = planDe(socio.plan);
  /* el aviso de renovado solo vale para el socio que lo tocó */
  const [renovado, setRenovado] = useState<number | null>(null);
  const reservadas = CLASES.filter((c) => club.reservas.includes(`${socio.id}:${c.id}`));

  return (
    <div className="bg-[#F8FAFC] pb-16 pt-6 sm:pt-10">
      <div className={ANCHO}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[1.75rem] font-extrabold tracking-tight sm:text-[2.2rem]">Pase de Socio</h1>
            <p className="text-slate-600">Muestre su código en la entrada y lleve la cuenta de su avance.</p>
          </div>
          <label className="grid w-full min-w-0 gap-1 text-[0.85rem] font-bold text-slate-600 sm:w-72">
            Cambiar de socio
            <select value={socio.id} onChange={(e) => alElegir(Number(e.target.value))} className="min-h-12 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-base font-semibold text-[#0F172A]">
              {club.socios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                  {estadoDe(s.dias) === "vencido" ? " (vencido)" : ""}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
          <div className="mx-auto grid w-full min-w-0 max-w-[26rem] gap-4 lg:max-w-none">
            <article aria-label="Carné digital de entrada" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="bg-[#0F172A] px-5 py-4 text-white">
                <p className="text-[0.72rem] font-bold tracking-[0.18em] text-green-300">CARNÉ DIGITAL · N.º {socio.id}</p>
                <h2 className="mt-1 break-words text-[1.45rem] font-extrabold leading-tight text-white">{socio.nombre}</h2>
                <p className="text-[0.9rem] text-slate-300">
                  {plan.nombre} · {sedeDe(socio.sede).nombre}
                </p>
              </div>
              <div role="status" className={`flex items-center justify-center gap-2.5 px-4 py-4 text-center text-white ${activo ? "bg-[#15803D]" : "bg-red-700"}`}>
                {activo ? <CircleCheck size={28} aria-hidden className="shrink-0" /> : <CircleX size={28} aria-hidden className="shrink-0" />}
                <span className="text-[1.3rem] font-extrabold leading-tight">{activo ? "ACCESO ACTIVO" : "MENSUALIDAD VENCIDA"}</span>
              </div>
              <div className="p-5">
                <div className="relative mx-auto w-full max-w-[15rem]">
                  <CodigoQR numero={socio.id} activo={activo} />
                  {!activo && <p className="absolute inset-0 m-auto h-fit w-fit rounded-lg bg-white px-4 py-2 text-center font-extrabold text-red-700 shadow-md">Renueve para entrar</p>}
                </div>
                <div className="mt-5 text-center">
                  {activo ? (
                    <>
                      <p className="text-[3.2rem] font-extrabold leading-none text-[#0F172A]">{socio.dias}</p>
                      <p className="mt-1 font-semibold text-slate-600">
                        {socio.dias === 1 ? "día restante" : "días restantes"} · hasta el {fechaEn(socio.dias)}
                      </p>
                    </>
                  ) : (
                    <p className="text-[1.15rem] font-bold text-red-700">{textoDias(socio.dias)}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    club.renovar(socio);
                    setRenovado(socio.id);
                  }}
                  className={`${VERDE} mt-4 !min-h-14 w-full !text-[1.02rem]`}
                >
                  <RefreshCw size={19} aria-hidden /> Renovar 30 días ahora
                </button>
                <p aria-live="polite" className="mt-2 text-center text-[0.9rem]">
                  {renovado === socio.id ? (
                    <span className="font-bold text-[#15803D]">
                      Pago de {qz(plan.precio)} registrado. Vence el {fechaEn(socio.dias)}.
                    </span>
                  ) : (
                    <span className="text-slate-500">{qz(plan.precio)} por 30 días</span>
                  )}
                </p>
              </div>
            </article>

            <section aria-labelledby="ip-reservas" className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 id="ip-reservas" className="text-[1.15rem] font-extrabold">
                Mis clases reservadas
              </h2>
              {reservadas.length === 0 ? (
                <p className="mt-1 text-[0.93rem] text-slate-600">Todavía no ha reservado ninguna.</p>
              ) : (
                <ul className="mt-3 grid gap-2">
                  {reservadas.map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-3 rounded-lg bg-[#F8FAFC] px-3.5 py-2.5">
                      <span className="min-w-0">
                        <b className="block text-[#0F172A]">{c.nombre}</b>
                        <span className="text-[0.85rem] text-slate-600">
                          {DIAS[c.dia]} {c.hora} · {sedeDe(c.sede).nombre}
                        </span>
                      </span>
                      <button type="button" onClick={() => club.alternarReserva(socio.id, c.id)} aria-label={`Cancelar ${c.nombre} del ${DIAS[c.dia]}`} className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-lg border border-slate-300 bg-white text-slate-600 hover:border-red-700 hover:text-red-700">
                        <X size={18} aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button type="button" onClick={alHorarios} className={`${BORDE} mt-3 w-full`}>
                Reservar una clase
              </button>
            </section>
          </div>

          <div className="grid min-w-0 gap-5">
            <section aria-labelledby="ip-progreso" className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 id="ip-progreso" className="text-[1.35rem] font-extrabold">
                Mi progreso físico
              </h2>
              {!socio.medidas && <p className="mt-1 text-[0.95rem] text-slate-600">Su primera evaluación física no tiene costo: pídala en recepción y aquí verá su peso, grasa y músculo.</p>}
              <dl className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
                {(
                  [
                    ["Peso actual", "peso", " lb", "baja"],
                    ["% de grasa", "grasa", "%", "baja"],
                    ["Masa muscular", "musculo", " lb", "sube"],
                  ] as const
                ).map(([nombre, clave, unidad, mejor]) => {
                  const medida = socio.medidas?.[clave];
                  return (
                    <div key={clave} className="flex min-w-0 flex-col gap-1 rounded-xl bg-[#F8FAFC] p-4">
                      <dt className="text-[0.85rem] font-bold text-slate-600">{nombre}</dt>
                      <dd className="text-[1.9rem] font-extrabold leading-none text-[#0F172A]">
                        {medida ? uno(medida.ahora) : "—"}
                        {medida && <span className="text-[1rem] font-bold text-slate-500">{unidad}</span>}
                      </dd>
                      <dd>{medida ? <Cambio medida={medida} unidad={unidad} mejor={mejor} /> : <p className="text-[0.82rem] text-slate-500">Pendiente</p>}</dd>
                    </div>
                  );
                })}
                <div className="flex min-w-0 flex-col gap-1 rounded-xl bg-[#F8FAFC] p-4">
                  <dt className="text-[0.85rem] font-bold text-slate-600">Meta del mes</dt>
                  <dd className="text-[1.9rem] font-extrabold leading-none text-[#0F172A]">
                    {socio.visitas}
                    <span className="text-[1rem] font-bold text-slate-500"> de {META_VISITAS}</span>
                  </dd>
                  <dd>
                    <div aria-hidden className="my-1 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full bg-[#15803D]" style={{ width: `${Math.min(100, (socio.visitas / META_VISITAS) * 100)}%` }} />
                    </div>
                    <p className="text-[0.82rem] text-slate-600">{socio.visitas >= META_VISITAS ? "¡Meta cumplida!" : `Faltan ${META_VISITAS - socio.visitas} entrenos`}</p>
                  </dd>
                </div>
              </dl>
            </section>

            <section aria-labelledby="ip-pesos" className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 id="ip-pesos" className="text-[1.35rem] font-extrabold">
                Mis pesos levantados
              </h2>
              <p className="text-[0.93rem] text-slate-600">Toque + o − para anotar su mejor peso. Se guarda solo.</p>
              <ul className="mt-4 grid gap-3">
                {EJERCICIOS.map((e) => {
                  const m = socio.marcas[e];
                  const d = m.ahora - m.antes;
                  return (
                    <li key={e} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F8FAFC] p-4">
                      <div className="min-w-0">
                        <h3 className="text-[1.1rem] font-extrabold">{e}</h3>
                        <p className={`text-[0.85rem] font-semibold ${d > 0 ? "text-[#15803D]" : "text-slate-500"}`}>{d > 0 ? `+${d} lb este mes` : d < 0 ? `${d} lb este mes` : "Sin cambios este mes"}</p>
                      </div>
                      <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
                        <button type="button" aria-label={`Bajar ${PASO_PESO} libras en ${e}`} disabled={m.ahora <= BARRA} onClick={() => club.marcar(socio.id, e, -PASO_PESO)} className="grid h-14 w-14 shrink-0 cursor-pointer place-items-center rounded-xl border border-slate-300 bg-white text-[#0F172A] active:scale-95 disabled:cursor-not-allowed disabled:opacity-35">
                          <Minus size={24} aria-hidden />
                        </button>
                        <output aria-live="polite" className="min-w-24 text-center text-[1.9rem] font-extrabold leading-none text-[#0F172A]">
                          {m.ahora}
                          <span className="text-[0.95rem] font-bold text-slate-500"> lb</span>
                        </output>
                        <button type="button" aria-label={`Subir ${PASO_PESO} libras en ${e}`} onClick={() => club.marcar(socio.id, e, PASO_PESO)} className="grid h-14 w-14 shrink-0 cursor-pointer place-items-center rounded-xl bg-[#15803D] text-white hover:bg-[#166534] active:scale-95">
                          <Plus size={24} aria-hidden />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
