/* Progreso físico, meta del mes y mejores pesos: todo se escribe y se guarda. */
import { useState, type FormEvent } from "react";
import { Minus, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { EJERCICIOS, PASO_PESO, type Club, type Cuerpo, type Ejercicio, type Medida, type Socio } from "./datos";
import { BarraGuardar, CAMPO, TARJETA } from "./Piezas";

const uno = (n: number) => Number(n.toFixed(1));
const texto = (n: number | undefined) => (n === undefined ? "" : String(uno(n)));
/* solo números y un punto decimal */
const limpiar = (t: string) => t.replace(",", ".").replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1").slice(0, 6);
const entre = (t: string, min: number, max: number) => t !== "" && Number(t) >= min && Number(t) <= max;

const CUERPO: { clave: Cuerpo; nombre: string; unidad: string; mejor: "baja" | "sube"; min: number; max: number }[] = [
  { clave: "peso", nombre: "Peso actual", unidad: "lb", mejor: "baja", min: 50, max: 600 },
  { clave: "grasa", nombre: "% de grasa", unidad: "%", mejor: "baja", min: 3, max: 70 },
  { clave: "musculo", nombre: "Masa muscular", unidad: "lb", mejor: "sube", min: 20, max: 300 },
];

/* cambio contra el mes pasado; "mejor" dice hacia dónde es buena noticia */
function Cambio({ medida, unidad, mejor }: { medida: Medida | null; unidad: string; mejor: "baja" | "sube" }) {
  if (!medida) return <p className="text-[0.82rem] text-slate-500">Pendiente de anotar</p>;
  const d = uno(medida.ahora - medida.antes);
  const bueno = mejor === "baja" ? d < 0 : d > 0;
  const Icono = d < 0 ? TrendingDown : TrendingUp;
  if (d === 0) return <p className="text-[0.82rem] text-slate-500">Igual que el mes pasado</p>;
  return (
    <p className={`flex items-start gap-1 text-[0.82rem] font-semibold ${bueno ? "text-[#15803D]" : "text-amber-700"}`}>
      <Icono size={15} aria-hidden className="mt-0.5 shrink-0" />
      <span>
        {d < 0 ? "Bajó" : "Subió"} {Math.abs(d)}
        {unidad === "%" ? "%" : " lb"} este mes
      </span>
    </p>
  );
}

function Medidas({ club, socio }: { club: Club; socio: Socio }) {
  const delSocio = () => ({ peso: texto(socio.medidas.peso?.ahora), grasa: texto(socio.medidas.grasa?.ahora), musculo: texto(socio.medidas.musculo?.ahora), meta: String(socio.meta) });
  const [b, setB] = useState(delSocio);
  const [guardado, setGuardado] = useState("");
  const actual = delSocio();
  const sucio = (Object.keys(b) as (keyof typeof b)[]).some((k) => b[k] !== actual[k]);
  const malo = CUERPO.find((c) => b[c.clave] !== "" && !entre(b[c.clave], c.min, c.max));
  const error = malo ? `${malo.nombre}: escriba un número entre ${malo.min} y ${malo.max}.` : !entre(b.meta, 1, 31) || !Number.isInteger(Number(b.meta)) ? "La meta del mes va de 1 a 31 entrenos." : "";
  const poner = (k: keyof typeof b, v: string) => {
    setB((x) => ({ ...x, [k]: limpiar(v) }));
    setGuardado("");
  };

  function guardar(e: FormEvent) {
    e.preventDefault();
    if (error) return;
    const medida = (k: Cuerpo): Medida | null => {
      if (b[k] === "") return null;
      const n = uno(Number(b[k]));
      return { ahora: n, antes: socio.medidas[k]?.antes ?? n };
    };
    const medidas = { peso: medida("peso"), grasa: medida("grasa"), musculo: medida("musculo") };
    club.guardar(socio.id, { medidas, meta: Number(b.meta) });
    setB({ peso: texto(medidas.peso?.ahora), grasa: texto(medidas.grasa?.ahora), musculo: texto(medidas.musculo?.ahora), meta: String(Number(b.meta)) });
    setGuardado("Progreso guardado.");
  }

  const campo = `${CAMPO} !min-h-14 !text-[1.5rem] !font-extrabold`;

  return (
    <form onSubmit={guardar} noValidate aria-labelledby="ip-progreso" className={TARJETA}>
      <h2 id="ip-progreso" className="text-[1.35rem] font-extrabold">
        Mi progreso físico
      </h2>
      <p className="mt-1.5 text-[0.93rem] text-slate-600">Toque un número para corregirlo y guarde los cambios.</p>
      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))] gap-4">
        {CUERPO.map((c) => (
          <div key={c.clave} className="grid min-w-0 content-start gap-2.5 rounded-xl bg-[#F8FAFC] p-4">
            <label htmlFor={`ip-${c.clave}`} className="text-[0.85rem] font-bold text-slate-600">
              {c.nombre}
            </label>
            <div className="flex items-center gap-2">
              <input id={`ip-${c.clave}`} value={b[c.clave]} onChange={(e) => poner(c.clave, e.target.value)} inputMode="decimal" placeholder="—" aria-invalid={malo?.clave === c.clave} className={campo} />
              <span className="shrink-0 font-bold text-slate-500">{c.unidad}</span>
            </div>
            <Cambio medida={socio.medidas[c.clave]} unidad={c.unidad} mejor={c.mejor} />
          </div>
        ))}
        <div className="grid min-w-0 content-start gap-2.5 rounded-xl bg-[#F8FAFC] p-4">
          <label htmlFor="ip-meta" className="text-[0.85rem] font-bold text-slate-600">
            Meta del mes
          </label>
          <div className="flex items-center gap-2">
            <input id="ip-meta" value={b.meta} onChange={(e) => poner("meta", e.target.value.replace(/\D/g, "").slice(0, 2))} inputMode="numeric" className={campo} />
            <span className="shrink-0 font-bold text-slate-500">entrenos</span>
          </div>
          <div aria-hidden className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full bg-[#15803D]" style={{ width: `${Math.min(100, (socio.visitas / socio.meta) * 100)}%` }} />
          </div>
          <p className="text-[0.82rem] text-slate-600">
            Lleva {socio.visitas}. {socio.visitas >= socio.meta ? "¡Meta cumplida!" : `Faltan ${socio.meta - socio.visitas}.`}
          </p>
        </div>
      </div>
      <BarraGuardar
        sucio={sucio}
        guardado={guardado}
        error={error}
        alDescartar={() => {
          setB(delSocio());
          setGuardado("");
        }}
      />
    </form>
  );
}

function Marcas({ club, socio }: { club: Club; socio: Socio }) {
  const delSocio = () => Object.fromEntries(EJERCICIOS.map((e) => [e, String(socio.marcas[e].ahora)])) as Record<Ejercicio, string>;
  const [b, setB] = useState(delSocio);
  const [guardado, setGuardado] = useState("");
  const sucio = EJERCICIOS.some((e) => b[e] !== String(socio.marcas[e].ahora));
  const malo = EJERCICIOS.find((e) => !entre(b[e], 0, 1500));
  const error = malo ? `${malo}: escriba un peso entre 0 y 1,500 lb.` : "";
  const poner = (e: Ejercicio, v: string) => {
    setB((x) => ({ ...x, [e]: v }));
    setGuardado("");
  };
  const mover = (e: Ejercicio, paso: number) => {
    setB((x) => ({ ...x, [e]: String(Math.min(1500, Math.max(0, (Number(x[e]) || 0) + paso))) }));
    setGuardado("");
  };

  function guardar(ev: FormEvent) {
    ev.preventDefault();
    if (error) return;
    const marcas = Object.fromEntries(EJERCICIOS.map((e) => [e, { ahora: uno(Number(b[e])), antes: socio.marcas[e].antes }])) as Socio["marcas"];
    club.guardar(socio.id, { marcas });
    setB(Object.fromEntries(EJERCICIOS.map((e) => [e, String(marcas[e].ahora)])) as Record<Ejercicio, string>);
    setGuardado("Récords guardados.");
  }

  const boton = "grid h-14 w-12 shrink-0 cursor-pointer place-items-center rounded-xl active:scale-95 sm:w-14";

  return (
    <form onSubmit={guardar} noValidate aria-labelledby="ip-pesos" className={TARJETA}>
      <h2 id="ip-pesos" className="text-[1.35rem] font-extrabold">
        Mis récords (PR)
      </h2>
      <p className="mt-1.5 text-[0.93rem] text-slate-600">Su mejor peso en cada ejercicio. Escríbalo o use − y +.</p>
      <ul className="mt-5 grid gap-4">
        {EJERCICIOS.map((e) => {
          const d = uno(socio.marcas[e].ahora - socio.marcas[e].antes);
          return (
            <li key={e} className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#F8FAFC] p-4">
              <div className="min-w-0">
                <h3 className="text-[1.1rem] font-extrabold">{e}</h3>
                <p className={`mt-1.5 text-[0.85rem] font-semibold ${d > 0 ? "text-[#15803D]" : "text-slate-500"}`}>{d > 0 ? `+${d} lb este mes` : d < 0 ? `${d} lb este mes` : "Sin cambios este mes"}</p>
              </div>
              <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
                <button type="button" aria-label={`Bajar ${PASO_PESO} libras en ${e}`} onClick={() => mover(e, -PASO_PESO)} className={`${boton} border border-slate-300 bg-white text-[#0F172A]`}>
                  <Minus size={22} aria-hidden />
                </button>
                <input aria-label={`Récord en ${e}, en libras`} value={b[e]} onChange={(ev) => poner(e, limpiar(ev.target.value))} inputMode="decimal" className={`${CAMPO} !min-h-14 flex-1 !px-1 text-center !text-[1.5rem] !font-extrabold sm:w-28 sm:flex-none`} />
                <span className="shrink-0 font-bold text-slate-500">lb</span>
                <button type="button" aria-label={`Subir ${PASO_PESO} libras en ${e}`} onClick={() => mover(e, PASO_PESO)} className={`${boton} bg-[#15803D] text-white hover:bg-[#166534]`}>
                  <Plus size={22} aria-hidden />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <BarraGuardar
        sucio={sucio}
        guardado={guardado}
        error={error}
        alDescartar={() => {
          setB(delSocio());
          setGuardado("");
        }}
      />
    </form>
  );
}

export function Progreso({ club, socio }: { club: Club; socio: Socio }) {
  return (
    <div className="grid min-w-0 gap-6">
      <Medidas club={club} socio={socio} />
      <Marcas club={club} socio={socio} />
    </div>
  );
}
