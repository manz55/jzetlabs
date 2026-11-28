import { ArrowRight, Calculator, CalendarDays, MapPin, PackagePlus, ReceiptText, Smartphone, Store } from "lucide-react";
import { CONVIVIO, EVENTOS, IDS_PRODUCTO, IDS_STAND, diaLargo, qz, resumen, type Feria } from "./datos";
import { Foto } from "./Piezas";

export function Hero({ feria, alCaja, alMenu }: { feria: Feria; alCaja: () => void; alMenu: () => void }) {
  const disponibles = IDS_PRODUCTO.reduce((s, id) => s + feria.quedan(id), 0);
  const r = resumen(feria);
  const metricas = [
    { valor: `${IDS_STAND.length} stands activos`, texto: "Parrilla, antojitos y bebidas" },
    { valor: `${disponibles} porciones`, texto: "Porciones disponibles en vivo" },
    { valor: qz(r.total), texto: "Cuadre automático" },
  ];
  return (
    <section className="tf-ancho grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
      <div className="min-w-0">
        <p className="inline-flex items-center gap-2 text-sm font-bold text-[#B91C1C]">
          <CalendarDays size={16} aria-hidden /> <span className="inline-block first-letter:uppercase">{diaLargo()}</span>
        </p>
        <h1 className="mt-4 text-[2.1rem] font-extrabold leading-[1.08] sm:text-[2.9rem] xl:text-[3.3rem]">Elimina los cuadernos y papelitos de colores en tu convivio, bazar o kermés</h1>
        <p className="mt-5 max-w-xl text-[1.05rem]">Cada puesto sabe cuánto le queda, la caja cobra una sola vez y la directiva recibe el cierre cuadrado al terminar la noche.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button type="button" onClick={alCaja} className="tf-boton tf-rojo !min-h-12 !px-6">
            Abrir Caja Central <ArrowRight size={17} aria-hidden />
          </button>
          <button type="button" onClick={alMenu} className="tf-boton tf-linea !min-h-12 !px-6">
            Ver menú y existencias
          </button>
        </div>
      </div>

      <div className="min-w-0">
        <div className="relative overflow-hidden rounded-3xl">
          <Foto id="1505426101273-b50e6f3ff9a7" alt="Vecinos recorriendo una feria con banderines y puestos de comida" ancho={900} alto={620} prioridad className="aspect-[3/2] w-full lg:aspect-[4/3]" />
          <p className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-xl bg-[#FFFDFB] px-3.5 py-2 text-sm font-bold leading-snug text-[#18181B] shadow">
            {CONVIVIO.nombre}
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
              <span aria-hidden className="size-2 rounded-full bg-[#15803D]" /> En curso · {CONVIVIO.lugar}
            </span>
          </p>
        </div>
        <dl aria-live="polite" className="tf-tarjeta relative -mt-8 mx-3 grid divide-y divide-[#F1EAE1] shadow-lg sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {metricas.map((m) => (
            <div key={m.texto} className="flex min-w-0 flex-col-reverse px-4 py-3.5">
              <dt className="text-xs font-semibold text-[#6B6560]">{m.texto}</dt>
              <dd className="text-lg font-extrabold leading-tight text-[#18181B]">{m.valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const PASOS = [
  { icono: PackagePlus, titulo: "Cada puesto registra con cuánto arrancó", texto: "El encargado anota las porciones que trajo. Si llega otra tanda, la suma y todos la ven al instante." },
  { icono: ReceiptText, titulo: "Caja cobra una sola vez y emite ticket digital numerado", texto: "Efectivo con vuelto calculado o transferencia BI y BAC. Lo agotado ya no se puede vender." },
  { icono: Smartphone, titulo: "Cada stand despacha desde su teléfono sin dobles entregas", texto: "El puesto ve solo lo suyo y marca la orden entregada con un toque. Nadie la reclama dos veces." },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="scroll-mt-32 bg-[#F9F5F0] py-14 lg:scroll-mt-20">
      <div className="tf-ancho">
        <h2 className="text-3xl font-extrabold">Cómo funciona</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {PASOS.map(({ icono: Icono, titulo, texto }, i) => (
            <li key={titulo} className="tf-tarjeta p-6">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-[#B91C1C] text-white">
                  <Icono size={20} aria-hidden />
                </span>
                <span aria-hidden className="text-4xl font-extrabold text-[#E5DBCF]">{i + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold leading-snug">{titulo}</h3>
              <p className="mt-2 text-[0.95rem]">{texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Eventos({ alCaja, alCierre }: { alCaja: () => void; alCierre: () => void }) {
  return (
    <section id="eventos" className="scroll-mt-32 py-14 lg:scroll-mt-20">
      <div className="tf-ancho">
        <h2 className="text-3xl font-extrabold">Eventos</h2>
        <p className="mt-2">Convivios y ferias configurados, cada uno con sus puestos y existencias.</p>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {EVENTOS.map((e) => (
            <li key={e.nombre} className="tf-tarjeta flex flex-col overflow-hidden">
              <Foto id={e.foto} alt={e.alt} ancho={600} alto={380} className="aspect-[8/5] w-full" />
              <div className="flex flex-1 flex-col p-5">
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-extrabold ${e.fecha ? "bg-[#F1EAE1] text-[#52525B]" : "bg-[#DCFCE7] text-[#166534]"}`}>{e.fecha ? "Programado" : "En curso hoy"}</span>
                <h3 className="mt-3 text-lg font-bold">{e.nombre}</h3>
                <p className="font-semibold text-[#B91C1C]">{e.tipo}</p>
                <ul className="mt-3 grid gap-1.5 text-sm">
                  <li className="flex items-center gap-2">
                    <MapPin size={15} aria-hidden className="shrink-0" /> {e.lugar}
                  </li>
                  <li className="flex items-center gap-2">
                    <CalendarDays size={15} aria-hidden className="shrink-0" /> <span className="inline-block first-letter:uppercase">{e.fecha || diaLargo()}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Store size={15} aria-hidden className="shrink-0" /> {e.puestos}
                  </li>
                </ul>
                {!e.fecha && (
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    <button type="button" onClick={alCaja} className="tf-boton tf-rojo flex-1">
                      <ReceiptText size={16} aria-hidden /> Cobrar
                    </button>
                    <button type="button" onClick={alCierre} className="tf-boton tf-linea flex-1">
                      <Calculator size={16} aria-hidden /> Cierre
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
