import { Fragment } from "react";
import { ArrowRight, Banknote, ChevronRight, Radio, ReceiptText, Smartphone } from "lucide-react";
import { CONVIVIO, IDS_PRODUCTO, IDS_STAND, qz, resumen, type Feria } from "./datos";
import { Foto } from "./Piezas";

export function Hero({ feria, alCaja, alStands }: { feria: Feria; alCaja: () => void; alStands: () => void }) {
  const disponibles = IDS_PRODUCTO.reduce((s, id) => s + feria.quedan(id), 0);
  const { total } = resumen(feria);
  const avance = Math.floor((total / CONVIVIO.meta) * 100);
  return (
    <section className="bg-[#18181B] text-white">
      <div className="tf-ancho grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#15803D] px-4 py-1.5 text-xs font-extrabold uppercase leading-snug tracking-wide">
            <Radio size={15} aria-hidden className="shrink-0" /> En vivo hoy · {CONVIVIO.lugar}
          </p>
          <h1 className="mt-6 !text-white">
            <span className="tf-editorial block text-[2.75rem] leading-[1.05] sm:text-6xl xl:text-[4.5rem]">{CONVIVIO.nombre}</span>{" "}
            <span className="mt-2 block text-2xl font-extrabold leading-tight text-white/90 sm:text-4xl">
              <span className="tf-editorial font-medium italic text-white/60">&amp;</span> Bazar de Vecinos
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-[1.05rem] text-white/75">Consulta platillos disponibles en tiempo real, pide en Caja Central y recoge en tu stand con tu número de orden.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="button" onClick={alCaja} className="tf-boton tf-rojo !min-h-12 !px-6">
              Abrir Caja Central <ArrowRight size={17} aria-hidden />
            </button>
            <button type="button" onClick={alStands} className="tf-boton !min-h-12 !border-white/30 !px-6 text-white hover:!border-white hover:bg-white/10">
              <Smartphone size={17} aria-hidden /> Ver pantallas de stands
            </button>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-3xl bg-[#FFFDFB] text-[#18181B]">
          <Foto id="1505426101273-b50e6f3ff9a7" alt="Vecinos recorriendo una feria con banderines y puestos de comida" ancho={900} alto={460} prioridad className="aspect-[2/1] w-full" />
          <dl aria-live="polite" className="grid grid-cols-2">
            <div className="flex min-w-0 flex-col-reverse justify-end border-r border-[#EAE2D8] p-5">
              <dt className="text-sm font-semibold text-[#6B6560]">stands activos</dt>
              <dd className="text-4xl font-extrabold leading-tight">{IDS_STAND.length}</dd>
            </div>
            <div className="flex min-w-0 flex-col-reverse justify-end p-5">
              <dt className="text-sm font-semibold text-[#6B6560]">Porciones disponibles hoy</dt>
              <dd className="text-4xl font-extrabold leading-tight">{disponibles}</dd>
            </div>
            <div className="col-span-2 border-t border-[#EAE2D8] p-5">
              <dt className="text-sm font-semibold text-[#6B6560]">Meta recaudación {CONVIVIO.obra}</dt>
              <dd>
                <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span>
                    <b className="text-3xl font-extrabold">{qz(total)}</b> <span className="font-semibold text-[#6B6560]">de {qz(CONVIVIO.meta)}</span>
                  </span>
                  <b className="text-lg text-[#15803D]">{avance}%</b>
                </span>
                <span aria-hidden className="mt-3 block h-2.5 overflow-hidden rounded-full bg-[#F1EAE1]">
                  <span className="block h-full rounded-full bg-[#15803D] transition-[width] duration-500" style={{ width: `${Math.min(100, avance)}%` }} />
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

const PASOS = [
  { icono: Banknote, texto: "Pide y paga en Caja Central (Efectivo o Transferencia)" },
  { icono: ReceiptText, texto: "Recibe tu ticket digital numerado (#CV)" },
  { icono: Smartphone, texto: "Retira tu orden lista en cada stand" },
];

export function Flujo() {
  return (
    <section id="como-funciona" aria-labelledby="tf-flujo" className="scroll-mt-32 border-b border-[#E5DDD3] bg-[#F3EFEA] py-4 lg:scroll-mt-[4.5rem]">
      <h2 id="tf-flujo" className="sr-only">Cómo funciona</h2>
      <ol className="tf-ancho flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {PASOS.map(({ icono: Icono, texto }, i) => (
          <Fragment key={texto}>
            {i > 0 && (
              <li aria-hidden className="hidden text-[#A89F95] md:block">
                <ChevronRight size={20} />
              </li>
            )}
            <li className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#FFFDFB] text-[#B91C1C]">
                <Icono size={19} aria-hidden />
              </span>
              <span className="text-sm font-bold leading-snug text-[#18181B]">
                {i + 1}. {texto}
              </span>
            </li>
          </Fragment>
        ))}
      </ol>
    </section>
  );
}
