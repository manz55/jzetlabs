/* Portada: el configurador, los compromisos y la cobertura (el catálogo va en Catalogo.tsx). */
import { useEffect, useState } from "react";
import { CalendarCheck, CircleCheck, ClipboardCheck, MapPin, ShieldCheck, Truck } from "lucide-react";
import { FOTOS, INVITADOS, ZONAS, ZONA_IDS, dia, diaLargo, diaMes, diaSemana, finesDeSemana, foto, num, qz, textoInvitados, ARTICULOS, IDS, type Imperial, type Invitados, type ZonaId } from "./datos";
import { ancho, boton, campo, rotulo, tarjeta } from "./estilos";
import { Foto } from "./Piezas";

export type Plan = { fecha: string; invitados: Invitados; zona: ZonaId };

const METRICAS = [
  ["+4,000", "sillas en bodega"],
  ["6 horas", "montaje antes de su evento"],
  ["Cero", "papelitos en convivios"],
];

/* guarda lo que se va escribiendo y solo avisa cuando ya es una fecha futura completa */
function OtraFecha({ fecha, alElegir }: { fecha: string; alElegir: (f: string) => void }) {
  const [escrito, setEscrito] = useState(fecha);
  useEffect(() => setEscrito(fecha), [fecha]);
  return (
    <label className="mt-3 flex min-w-0 items-center gap-3 text-sm font-semibold">
      <span className="shrink-0">Otra fecha</span>
      <input
        type="date"
        value={escrito}
        min={dia(1)}
        onChange={(e) => {
          setEscrito(e.target.value);
          if (e.target.value >= dia(1)) alElegir(e.target.value);
        }}
        onBlur={() => setEscrito(fecha)}
        className={campo}
      />
    </label>
  );
}

export function Hero({ imp, plan, alCambiar, alArmar }: { imp: Imperial; plan: Plan; alCambiar: (p: Partial<Plan>) => void; alArmar: () => void }) {
  const fechas = finesDeSemana(8);
  const libres = (clase: "silla" | "toldo") => IDS.filter((id) => ARTICULOS[id].clase === clase).reduce((s, id) => s + imp.libres(plan.fecha, id), 0);
  return (
    <section className="relative isolate overflow-hidden bg-[#1C1917]">
      <img src={foto(FOTOS.portada, 1800, 1200)} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-[#1C1917]/70 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#1C1917]/90 lg:via-[#1C1917]/70 lg:to-[#1C1917]/35" />
      <div className={`${ancho} grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:py-16`}>
        <div className="min-w-0">
          <h1 className="text-[clamp(1.8rem,4.4vw,3.4rem)] !leading-[1.12] text-white">Alquiler de mobiliario, toldos y control digital de stands para eventos y convivios de colonia</h1>
          <p className="mt-4 max-w-xl text-[#EDE6DC] sm:mt-5 sm:text-lg">Aparte su fecha con el inventario real de bodega y cobre su convivio con tickets digitales que cada stand entrega desde el teléfono.</p>
          <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-white/25 pt-5 sm:mt-9 sm:gap-5 sm:pt-7">
            {METRICAS.map(([n, t]) => (
              <div key={t} className="min-w-0">
                <dt className="whitespace-nowrap font-(family-name:--ci-serif) text-[1.25rem] font-bold text-white min-[360px]:text-2xl sm:text-3xl">{n}</dt>
                <dd className="mt-1 text-xs leading-snug text-[#D6CCBF] sm:text-sm">{t}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div id="cotizar" className={`${tarjeta} grid scroll-mt-24 gap-6 !bg-[#FAF8F5] p-6 shadow-2xl sm:p-7`}>
          <fieldset className="min-w-0">
            <legend className={rotulo}>Fecha del evento</legend>
            <div className="grid grid-cols-4 gap-2">
              {fechas.map((f) => {
                const activa = f === plan.fecha;
                const oc = imp.ocupacion(f);
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={activa}
                    onClick={() => alCambiar({ fecha: f })}
                    className={`min-w-0 rounded-lg border px-1 py-2 text-center leading-tight transition ${activa ? "border-[#1C1917] bg-[#1C1917] text-white" : "border-[#D6CDC1] bg-white text-[#1C1917] hover:border-[#A16207]"}`}
                  >
                    <span className="block text-[0.7rem] font-semibold capitalize opacity-75">{diaSemana(f)}</span>
                    <span className="block text-[0.82rem] font-extrabold">{diaMes(f)}</span>
                    <span className={`mx-auto mt-1.5 block h-1 w-4/5 overflow-hidden rounded-full ${activa ? "bg-white/25" : "bg-[#EAE3DA]"}`} aria-hidden>
                      <span className="block h-full rounded-full bg-[#A16207]" style={{ width: `${oc}%` }} />
                    </span>
                    <span className="mt-1 block text-[0.66rem] font-semibold opacity-75">
                      {oc}%<span className="max-sm:sr-only"> ocup.</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <OtraFecha fecha={plan.fecha} alElegir={(fecha) => alCambiar({ fecha })} />
            <p className="mt-3 text-sm text-[#57534E]" role="status">
              El {diaLargo(plan.fecha)}: bodega {imp.ocupacion(plan.fecha)}% ocupada, quedan <b className="text-[#1C1917]">{num(libres("silla"))} sillas</b> y <b className="text-[#1C1917]">{libres("toldo")} toldos</b>.
            </p>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className={rotulo}>Cantidad de invitados</legend>
            <div className="grid grid-cols-4 gap-2">
              {INVITADOS.map((n) => (
                <button key={n} type="button" aria-pressed={n === plan.invitados} onClick={() => alCambiar({ invitados: n })} className={`h-12 min-w-0 rounded-lg border text-base font-extrabold transition ${n === plan.invitados ? "border-[#1C1917] bg-[#1C1917] text-white" : "border-[#D6CDC1] bg-white text-[#1C1917] hover:border-[#A16207]"}`}>
                  {textoInvitados(n)}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block min-w-0">
            <span className={`${rotulo} flex justify-between gap-3`}>
              Zona <span className="font-semibold text-[#A16207]">Flete {qz(ZONAS[plan.zona].flete)}</span>
            </span>
            <select value={plan.zona} onChange={(e) => alCambiar({ zona: e.target.value as ZonaId })} className={campo}>
              {ZONA_IDS.map((z) => (
                <option key={z} value={z}>
                  {ZONAS[z].nombre}
                </option>
              ))}
            </select>
          </label>

          <button type="button" onClick={alArmar} className={`${boton.bronce} !min-h-13 w-full text-base`}>
            Armar cotización
          </button>
        </div>
      </div>
    </section>
  );
}

const GARANTIAS = [
  { icono: CalendarCheck, titulo: "Stock bloqueado por fecha", texto: "Lo que usted aparta se descuenta de ese día. Si ya no alcanza, el sistema no deja reservarlo: cero sobre-alquiler." },
  { icono: ClipboardCheck, titulo: "Mobiliario pulido e inspeccionado", texto: "Cada pieza se limpia y se revisa antes de subir al camión, y se vuelve a contar cuando regresa a bodega." },
  { icono: ShieldCheck, titulo: "Depósito de garantía transparente", texto: "Es el 15% del mobiliario y es reembolsable. Si algo falta o vuelve roto, usted ve el detalle y recibe el saldo." },
];

export function Garantias() {
  return (
    <section id="garantias" className="scroll-mt-24 py-16 sm:py-20">
      <div className={`${ancho} grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12`}>
        <div className="flex min-w-0 flex-col gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl">Tres compromisos por escrito</h2>
            <p className="mt-3 max-w-md">Para que el día del evento no haya sorpresas con lo que apartó, cómo llega ni cuánto se le devuelve.</p>
          </div>
          <Foto id={FOTOS.bodega} alt="Sillas plegables blancas alineadas en bodega" ancho={900} alto={560} className="aspect-[16/10] rounded-2xl lg:aspect-auto lg:min-h-56 lg:flex-1" />
        </div>
        <ol className="grid gap-6">
          {GARANTIAS.map(({ icono: Icono, titulo, texto }, k) => (
            <li key={titulo} className={`${tarjeta} grid grid-cols-[auto_minmax(0,1fr)] gap-5 p-6 sm:p-7`}>
              <span className="grid size-12 place-items-center rounded-full bg-[#F3EFEA] text-[#A16207]">
                <Icono size={22} aria-hidden />
              </span>
              <div>
                <h3 className="text-xl">
                  {k + 1}. {titulo}
                </h3>
                <p className="mt-2">{texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const CONDICIONES = [
  "El montaje empieza 6 horas antes de la hora de su evento.",
  "El camión necesita llegar hasta el punto de montaje. Si hay gradas o paso angosto, avísenos al reservar.",
  "Los toldos van sobre superficie plana; donde no se puede estacar, se usan contrapesos.",
  "El retiro es al día siguiente, de 7:00 a 11:00.",
  "El saldo se paga al terminar el montaje, antes de que empiecen a llegar sus invitados.",
];

export function Cobertura({ zona, alElegir }: { zona: ZonaId; alElegir: (z: ZonaId) => void }) {
  return (
    <section id="cobertura" className="scroll-mt-24 bg-[#F3EFEA] py-16 sm:py-20">
      <div className={ancho}>
        <h2 className="text-3xl sm:text-4xl">Cobertura y flete por zona</h2>
        <p className="mt-3 max-w-2xl">El flete cubre ida, montaje y retiro. Toque una zona para usarla en su cotización.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {ZONA_IDS.map((z) => {
            const activa = z === zona;
            return (
              <button key={z} type="button" aria-pressed={activa} onClick={() => alElegir(z)} className={`${tarjeta} flex flex-col items-start gap-3 p-6 text-left transition sm:p-7 ${activa ? "!border-[#A16207] ring-2 ring-[#A16207]" : "hover:!border-[#A16207]"}`}>
                <MapPin size={22} aria-hidden className="text-[#A16207]" />
                <span className="font-(family-name:--ci-serif) text-xl font-semibold text-[#1C1917]">{ZONAS[z].nombre}</span>
                <span className="text-sm">{ZONAS[z].alcance}</span>
                <span className="mt-auto flex w-full items-end justify-between gap-3 border-t border-[#E4DDD3] pt-4">
                  <span className="text-2xl font-extrabold text-[#1C1917]">{qz(ZONAS[z].flete)}</span>
                  {activa && (
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#A16207]">
                      <CircleCheck size={16} aria-hidden /> En su cotización
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className={`${tarjeta} p-6 sm:p-7`}>
            <h3 className="flex items-center gap-3 text-xl">
              <Truck size={22} aria-hidden className="shrink-0 text-[#A16207]" /> Condiciones de montaje
            </h3>
            <ul className="mt-5 grid gap-4">
              {CONDICIONES.map((c) => (
                <li key={c} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                  <CircleCheck size={18} aria-hidden className="mt-1 text-[#A16207]" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <Foto id={FOTOS.antigua} alt="Arco de Santa Catalina en Antigua Guatemala" ancho={1000} alto={700} className="min-h-64 rounded-2xl" />
        </div>
      </div>
    </section>
  );
}
