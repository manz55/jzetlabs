/* Las seis habitaciones, con filtro por tipo, esqueleto de consulta y entrada escalonada. */
import { useRef } from "react";
import { BedDouble, Check, Ruler, Users, X } from "lucide-react";
import { useDemora, useEscalonado } from "./animar";
import { HABITACIONES, dinero, fechaCorta, noches, tarifa, textoHuespedes, textoNoches, type Categoria, type Estancia, type Habitacion } from "./datos";

export type Filtro = "todas" | Categoria;

const FILTROS: { id: Filtro; nombre: string }[] = [
  { id: "todas", nombre: "Todas" },
  { id: "habitaciones", nombre: "Habitaciones" },
  { id: "suites", nombre: "Suites" },
];

function Esqueleto() {
  return (
    <div className="pv-ficha" aria-hidden>
      <span className="pv-hueso w-full !rounded-none" style={{ aspectRatio: "4 / 3" }} />
      <div className="grid gap-3 p-5">
        <span className="pv-hueso h-6 w-4/5" />
        <span className="pv-hueso h-4 w-full" />
        <span className="pv-hueso h-10 w-full" />
        <span className="pv-hueso h-4 w-3/5" />
        <span className="pv-hueso h-4 w-2/3" />
        <span className="pv-hueso mt-2 h-7 w-2/5" />
        <span className="pv-hueso h-12 w-full" />
      </div>
    </div>
  );
}

function Ficha({ h, estancia, elegida, alElegir }: { h: Habitacion; estancia: Estancia; elegida: boolean; alElegir: () => void }) {
  const n = noches(estancia);
  const cabe = estancia.huespedes <= h.personas;
  return (
    <article className="pv-ficha" data-entra data-elegida={elegida} data-cabe={cabe} aria-labelledby={`pv-${h.id}`}>
      <img className="pv-foto" src={h.foto} alt={h.alt} width={900} height={675} loading="lazy" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 id={`pv-${h.id}`} className="text-[1.35rem]">
            {h.nombre}
          </h3>
          <p className="pv-suave mt-1 text-[0.92rem]">{h.resumen}</p>
        </div>
        <ul className="pv-datos">
          <li>
            <Users size={16} aria-hidden /> Hasta {h.personas} personas
          </li>
          <li>
            <Ruler size={16} aria-hidden /> <span className="pv-num">{h.metros} m²</span>
          </li>
          <li>
            <BedDouble size={16} aria-hidden /> {h.cama}
          </li>
        </ul>
        <ul className="pv-lista">
          {h.amenidades.map((a) => (
            <li key={a}>
              <Check size={16} aria-hidden /> {a}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-2">
          <p className="pv-num">
            <span className="text-[1.65rem] font-bold">{tarifa(h.tarifa)}</span> <span className="pv-suave text-[0.9rem]">por noche, más impuestos</span>
          </p>
          <p className="pv-suave pv-num text-[0.85rem]">
            {textoNoches(n)}: {dinero(h.tarifa * n * 100)}
          </p>
          <button type="button" className={`pv-btn mt-3 w-full ${elegida ? "pv-elegido" : "pv-accion"}`} disabled={!cabe} aria-pressed={elegida} onClick={alElegir}>
            {!cabe ? (
              `Recibe hasta ${h.personas} personas`
            ) : elegida ? (
              <>
                <Check size={18} aria-hidden /> Elegida · Quitar <X size={16} aria-hidden />
              </>
            ) : (
              "Seleccionar habitación"
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Habitaciones({
  estancia,
  elegida,
  filtro,
  consulta,
  alFiltrar,
  alElegir,
}: {
  estancia: Estancia;
  elegida: string | null;
  filtro: Filtro;
  consulta: number;
  alFiltrar: (f: Filtro) => void;
  alElegir: (id: string) => void;
}) {
  const clave = `${filtro}|${consulta}`;
  const cargando = useDemora(clave, 300);
  const rejilla = useRef<HTMLDivElement>(null);
  useEscalonado(rejilla, clave, !cargando);

  const delGrupo = HABITACIONES.filter((h) => filtro === "todas" || h.categoria === filtro);
  /* primero las que reciben a todo el grupo */
  const lista = [...delGrupo].sort((a, b) => Number(estancia.huespedes > a.personas) - Number(estancia.huespedes > b.personas));
  const caben = delGrupo.filter((h) => estancia.huespedes <= h.personas).length;

  return (
    <section id="habitaciones" className="pv-arena pv-seccion" aria-labelledby="pv-titulo-habitaciones">
      <div className="pv-ancho">
        <h2 id="pv-titulo-habitaciones" className="pv-h2">
          Habitaciones y suites
        </h2>
        <p className="pv-suave pv-num mt-2" aria-live="polite">
          {cargando
            ? "Consultando sus fechas…"
            : [`${fechaCorta(estancia.llegada)} al ${fechaCorta(estancia.salida)}`, textoNoches(noches(estancia)), textoHuespedes(estancia.huespedes)].map((x) => x.replace(/ /g, "\u00a0")).join(" · ")}
        </p>
        <div className="mt-5 flex gap-2 overflow-x-auto p-1" role="group" aria-label="Filtrar por tipo">
          {FILTROS.map((f) => (
            <button key={f.id} type="button" className="pv-filtro" aria-pressed={filtro === f.id} onClick={() => alFiltrar(f.id)}>
              {f.nombre}
            </button>
          ))}
        </div>
        {!cargando && caben === 0 && (
          <p className="mt-4 font-semibold">
            Ninguna habitación de este grupo recibe a {textoHuespedes(estancia.huespedes)}.{" "}
            <button type="button" className="underline underline-offset-4" onClick={() => alFiltrar("suites")}>
              Ver las suites
            </button>
          </p>
        )}
        <div ref={rejilla} className="pv-rejilla mt-6" aria-busy={cargando}>
          {cargando ? lista.map((h) => <Esqueleto key={h.id} />) : lista.map((h) => <Ficha key={h.id} h={h} estancia={estancia} elegida={elegida === h.id} alElegir={() => alElegir(h.id)} />)}
        </div>
        <p className="pv-suave mt-6 text-[0.9rem]">Todas las tarifas incluyen desayuno chapín, parqueo privado y Wi-Fi. A la tarifa se suman 10% de INGUAT y 12% de IVA.</p>
      </div>
    </section>
  );
}
