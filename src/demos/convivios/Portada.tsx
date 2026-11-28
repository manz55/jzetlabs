import { Fragment, useEffect, useState } from "react";
import { ArrowRight, Banknote, CalendarClock, ChevronRight, Clock, ReceiptText, Smartphone } from "lucide-react";
import { CONVIVIO, productosDe, productosEnCarta, IDS_STAND, type Feria } from "./datos";
import { Foto } from "./Piezas";

export function Hero({ feria, alCaja, alStands }: { feria: Feria; alCaja: () => void; alStands: () => void }) {
  const [esHoy, setEsHoy] = useState(true);
  const disponibles = productosEnCarta().reduce((s, id) => s + feria.quedan(id), 0);
  const activos = IDS_STAND.filter((s) => productosDe(s).length > 0).length;
  return (
    <section className="bg-[#18181B] text-white">
      <div className="tf-ancho grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
        <div className="min-w-0">
          <h1 className="!text-white">
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
          <Foto id="1505426101273-b50e6f3ff9a7" alt="Vecinos recorriendo una feria con banderines y puestos de comida" ancho={900} alto={380} prioridad className="aspect-[12/5] w-full" />
          <dl aria-live="polite" className="grid grid-cols-2">
            <div className="flex min-w-0 flex-col-reverse justify-end border-r border-[#EAE2D8] px-5 py-4">
              <dt className="text-sm font-semibold text-[#6B6560]">stands activos</dt>
              <dd className="text-3xl font-extrabold leading-tight">{activos}</dd>
            </div>
            <div className="flex min-w-0 flex-col-reverse justify-end px-5 py-4">
              <dt className="text-sm font-semibold text-[#6B6560]">{esHoy ? "Porciones disponibles hoy" : "Porciones preparadas"}</dt>
              <dd className="text-3xl font-extrabold leading-tight">{disponibles}</dd>
            </div>
          </dl>
          <Contador esHoy={esHoy} alCambiar={setEsHoy} />
        </div>
      </div>
    </section>
  );
}

const DIAS_DE_ANTICIPACION = 4;
const HORA_DE_APERTURA = 10;

function aperturaProxima() {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + DIAS_DE_ANTICIPACION);
  fecha.setHours(HORA_DE_APERTURA, 0, 0, 0);
  return fecha;
}

function Contador({ esHoy, alCambiar }: { esHoy: boolean; alCambiar: (v: boolean) => void }) {
  const [ahora, setAhora] = useState(Date.now);
  useEffect(() => {
    const t = window.setInterval(() => setAhora(Date.now()), 30_000);
    return () => window.clearInterval(t);
  }, []);
  const apertura = aperturaProxima();
  const horas = Math.max(0, Math.floor((apertura.getTime() - ahora) / 3_600_000));
  const dias = Math.floor(horas / 24);

  return (
    <div className="border-t border-[#EAE2D8] bg-[#F9F5F0] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold">Contador para el Evento</h2>
        <div role="group" aria-label="Probar la fecha del convivio" className="flex gap-2">
          <button type="button" aria-pressed={esHoy} onClick={() => alCambiar(true)} className="tf-pildora">
            Hoy
          </button>
          <button type="button" aria-pressed={!esHoy} onClick={() => alCambiar(false)} className="tf-pildora">
            Fecha próxima
          </button>
        </div>
      </div>
      <div role="status" className="mt-3">
        {esHoy ? (
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="rounded-xl bg-[#15803D] px-4 py-2 text-lg font-extrabold text-white">¡Es hoy! · En curso</span>
            <span className="flex items-center gap-1.5 font-bold">
              <Clock size={17} aria-hidden className="text-[#B91C1C]" /> {CONVIVIO.horario}
            </span>
          </p>
        ) : (
          <>
            <p className="flex items-center gap-2.5 text-2xl font-extrabold">
              <CalendarClock size={24} aria-hidden className="shrink-0 text-[#B91C1C]" />
              {dias === 1 ? "Falta 1 día" : `Faltan ${dias} días`} · {horas % 24} h
            </p>
            <p className="mt-1 text-sm font-semibold text-[#6B6560]">
              <span className="inline-block first-letter:uppercase">{apertura.toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" })}</span> · {CONVIVIO.horario}
            </p>
          </>
        )}
      </div>
    </div>
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
