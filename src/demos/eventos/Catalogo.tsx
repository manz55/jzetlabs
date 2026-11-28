/* Catálogo con la disponibilidad de la fecha elegida, y los paquetes armados. */
import { useRef, useState } from "react";
import { Check, CircleCheck, TriangleAlert } from "lucide-react";
import { useCarga, useEscalonado } from "./animar";
import { ARTICULOS, CATEGORIAS, IDS, PAQUETES, cuentas, diaCorto, num, qz, renglones, type ArtId, type Categoria, type Cesta, type Imperial } from "./datos";
import { ancho, boton, pastilla, tarjeta } from "./estilos";
import { Contador, Foto } from "./Piezas";

const FILTROS = ["Todos", ...CATEGORIAS] as const;
export type Filtro = "Todos" | Categoria;

export function Mobiliario({ imp, fecha, cesta, aviso, alPoner }: { imp: Imperial; fecha: string; cesta: Cesta; aviso: string; alPoner: (id: ArtId, n: number) => void }) {
  const [filtro, setFiltro] = useState<Filtro>("Todos");
  const cargando = useCarga(filtro, 300);
  const rejilla = useRef<HTMLDivElement>(null);
  useEscalonado(rejilla, filtro, !cargando);
  const lista = IDS.filter((id) => filtro === "Todos" || ARTICULOS[id].cat === filtro);

  return (
    <section id="mobiliario" className="scroll-mt-24 bg-[#F3EFEA] py-16 sm:py-20">
      <div className={ancho}>
        <h2 className="text-3xl sm:text-4xl">Mobiliario disponible</h2>
        <p className="mt-3 max-w-2xl">
          Existencias para el <b className="text-[#1C1917]">{diaCorto(fecha)}</b>, ya descontando lo apartado por otros eventos. Los precios son por pieza y por evento.
        </p>
        {aviso && (
          <p role="status" className="mt-5 flex items-start gap-3 rounded-xl border border-[#A16207]/40 bg-white p-4 text-[#1C1917]">
            <CircleCheck size={20} aria-hidden className="mt-0.5 shrink-0 text-[#A16207]" />
            <span className="min-w-0">{aviso}</span>
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar mobiliario">
          {FILTROS.map((f) => (
            <button key={f} type="button" aria-pressed={f === filtro} onClick={() => setFiltro(f)} className={pastilla(f === filtro)}>
              {f}
            </button>
          ))}
        </div>

        <div ref={rejilla} className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy={cargando}>
          {cargando
            ? lista.map((id) => (
                <div key={id} className={`${tarjeta} overflow-hidden`} aria-hidden>
                  <div className="aspect-[4/3] animate-pulse bg-[#E8E1D8]" />
                  <div className="grid gap-3 p-6 sm:p-7">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-[#E8E1D8]" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-[#E8E1D8]" />
                    <div className="h-11 animate-pulse rounded-lg bg-[#E8E1D8]" />
                  </div>
                </div>
              ))
            : lista.map((id) => {
                const a = ARTICULOS[id];
                const quedan = imp.libres(fecha, id);
                const n = cesta[id] ?? 0;
                const falta = n > quedan;
                return (
                  <article key={id} data-entra className={`${tarjeta} flex flex-col overflow-hidden ${n ? "!border-[#A16207] ring-1 ring-[#A16207]" : ""}`}>
                    <Foto id={a.foto} alt={a.alt} ancho={640} alto={480} className="aspect-[4/3]" />
                    <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
                      <div>
                        <h3 className="text-lg">{a.nombre}</h3>
                        <p className="mt-1 text-sm text-[#6B625B]">{a.detalle}</p>
                      </div>
                      <div className="mt-auto">
                        <p className={`text-sm font-semibold ${quedan === 0 || falta ? "text-[#9F2F1E]" : "text-[#3F6212]"}`}>
                          {quedan === 0 ? "Agotado para esa fecha" : `${num(quedan)} de ${num(a.total)} disponibles`}
                        </p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EAE3DA]" aria-hidden>
                          <div className="h-full rounded-full bg-[#A16207]" style={{ width: `${(quedan / a.total) * 100}%` }} />
                        </div>
                      </div>
                      <p className="text-[#6B625B]">
                        <span className="text-2xl font-extrabold text-[#1C1917]">{qz(a.precio)}</span> por pieza
                      </p>
                      <Contador valor={n} max={Math.max(quedan, n)} paso={a.paso} nombre={a.nombre} alCambiar={(v) => alPoner(id, Math.min(v, quedan))} />
                      {a.paso > 1 && <p className="-mt-2 text-xs text-[#6B625B]">Sube de {a.paso} en {a.paso}; puede escribir la cantidad exacta.</p>}
                    </div>
                  </article>
                );
              })}
        </div>
      </div>
    </section>
  );
}

export function Paquetes({ imp, fecha, actual, alCargar }: { imp: Imperial; fecha: string; actual: string; alCargar: (id: string) => void }) {
  return (
    <section id="paquetes" className="scroll-mt-24 py-16 sm:py-20">
      <div className={ancho}>
        <h2 className="text-3xl sm:text-4xl">Paquetes listos</h2>
        <p className="mt-3 max-w-2xl">Cargue un paquete a su cotización y después cambie las cantidades a su gusto.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {PAQUETES.map((p) => {
            const cosas = renglones(p.cesta);
            const faltan = cosas.filter((r) => r.n > imp.libres(fecha, r.id));
            const cargado = actual === p.id;
            return (
              <article key={p.id} className={`${tarjeta} flex flex-col overflow-hidden`}>
                <Foto id={p.foto} alt={p.alt} ancho={800} alto={500} className="aspect-[16/10]" />
                <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
                  <div>
                    <h3 className="text-xl">{p.nombre}</h3>
                    <p className="mt-1 text-sm text-[#6B625B]">{p.para}</p>
                  </div>
                  <ul className="grid gap-2 text-[0.95rem]">
                    {cosas.map((r) => (
                      <li key={r.id} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-2">
                        <b className="text-right text-[#1C1917]">{num(r.n)}</b>
                        <span>{r.art.nombre}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto border-t border-[#E4DDD3] pt-5">
                    <p>
                      <span className="text-3xl font-extrabold text-[#1C1917]">{qz(cuentas(p.cesta, "ciudad").subtotal)}</span>
                      <span className="ml-2 text-sm text-[#6B625B]">+ flete y depósito</span>
                    </p>
                    <p className={`mt-2 flex items-start gap-2 text-sm font-semibold ${faltan.length ? "text-[#9F2F1E]" : "text-[#3F6212]"}`}>
                      {faltan.length ? <TriangleAlert size={16} aria-hidden className="mt-0.5 shrink-0" /> : <Check size={16} aria-hidden className="mt-0.5 shrink-0" />}
                      <span className="min-w-0">
                        {faltan.length ? `No alcanza el ${diaCorto(fecha)}: ${faltan.map((r) => r.art.nombre.toLowerCase()).join(", ")}.` : `Disponible el ${diaCorto(fecha)}`}
                      </span>
                    </p>
                  </div>
                  <button type="button" disabled={faltan.length > 0} onClick={() => alCargar(p.id)} className={`${cargado ? boton.oscuro : boton.bronce} w-full`}>
                    {cargado ? "Paquete cargado" : "Cargar paquete"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
