/* Progreso físico y mejores pesos levantados. */
import { Minus, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { BARRA, EJERCICIOS, META_VISITAS, PASO_PESO, type Club, type Medida, type Socio } from "./datos";
import { TARJETA } from "./Piezas";

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

export function Progreso({ club, socio }: { club: Club; socio: Socio }) {
  return (
    <div className="grid min-w-0 gap-5">
      <section aria-labelledby="ip-progreso" className={TARJETA}>
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

      <section aria-labelledby="ip-pesos" className={TARJETA}>
        <h2 id="ip-pesos" className="text-[1.35rem] font-extrabold">
          Mis pesos levantados
        </h2>
        <p className="text-[0.93rem] text-slate-600">Toque + o − para anotar su mejor peso. Se guarda solo.</p>
        <ul className="mt-4 grid gap-3">
          {EJERCICIOS.map((e) => {
            const marca = socio.marcas[e];
            const d = marca.ahora - marca.antes;
            return (
              <li key={e} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F8FAFC] p-4">
                <div className="min-w-0">
                  <h3 className="text-[1.1rem] font-extrabold">{e}</h3>
                  <p className={`text-[0.85rem] font-semibold ${d > 0 ? "text-[#15803D]" : "text-slate-500"}`}>{d > 0 ? `+${d} lb este mes` : d < 0 ? `${d} lb este mes` : "Sin cambios este mes"}</p>
                </div>
                <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
                  <button type="button" aria-label={`Bajar ${PASO_PESO} libras en ${e}`} disabled={marca.ahora <= BARRA} onClick={() => club.marcar(socio.id, e, -PASO_PESO)} className="grid h-14 w-14 shrink-0 cursor-pointer place-items-center rounded-xl border border-slate-300 bg-white text-[#0F172A] active:scale-95 disabled:cursor-not-allowed disabled:opacity-35">
                    <Minus size={24} aria-hidden />
                  </button>
                  <output aria-live="polite" className="min-w-24 text-center text-[1.9rem] font-extrabold leading-none text-[#0F172A]">
                    {marca.ahora}
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
  );
}
