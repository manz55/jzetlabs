/*
 * Rutina de lunes a sábado: marcar lo hecho y editar cada día (enfoque, descanso, agregar, cambiar
 * o quitar ejercicios). Abajo, las clases que el socio tiene reservadas.
 */
import { useState, type FormEvent } from "react";
import { Check, Moon, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { CLASES, DIAS, sedeDe, type Club, type DiaRutina, type Socio } from "./datos";
import { Interruptor } from "./Pago";
import { BORDE, CAMPO, Guardado, ROTULO, TARJETA, VERDE } from "./Piezas";

const ENFOQUES = ["Empuje", "Jalón", "Pierna", "Cardio y abdomen", "Cuerpo completo"];

type Fila = { id: string; nombre: string; series: string; reps: string; peso: string; hecho: boolean };
type Borrador = { nombre: string; descanso: boolean; ejercicios: Fila[] };

const aBorrador = (d: DiaRutina): Borrador => ({
  nombre: d.descanso ? "" : d.nombre,
  descanso: d.descanso,
  ejercicios: d.ejercicios.map((e) => ({ ...e, series: String(e.series), reps: String(e.reps), peso: String(e.peso) })),
});

const entre = (t: string, min: number, max: number) => t !== "" && Number(t) >= min && Number(t) <= max;

function revisar(b: Borrador) {
  if (b.descanso) return "";
  if (b.nombre.trim().length < 3) return "Escriba el nombre o enfoque del día.";
  if (b.ejercicios.length === 0) return "Agregue al menos un ejercicio, o márquelo como descanso.";
  if (b.ejercicios.some((e) => e.nombre.trim().length < 2)) return "Cada ejercicio necesita un nombre.";
  if (b.ejercicios.some((e) => !entre(e.series, 1, 20) || !entre(e.reps, 1, 200) || !entre(e.peso, 0, 1500))) return "Revise los números: series de 1 a 20, repeticiones de 1 a 200 y peso de 0 a 1,500 lb.";
  return "";
}

/* hoy según el calendario; el domingo muestra el lunes */
const diaQueToca = () => Math.max(0, new Date().getDay() - 1);

function Numero({ nombre, valor, alCambiar }: { nombre: string; valor: string; alCambiar: (v: string) => void }) {
  return (
    <label className="grid min-w-0 content-start gap-1.5 text-[0.78rem] font-bold text-slate-600">
      {nombre}
      <input value={valor} onChange={(e) => alCambiar(e.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" className={`${CAMPO} !px-1 text-center !font-extrabold`} />
    </label>
  );
}

function Editor({ inicial, alGuardar, alCancelar }: { inicial: Borrador; alGuardar: (b: Borrador) => void; alCancelar: () => void }) {
  const [b, setB] = useState(inicial);
  const [intento, setIntento] = useState(false);
  const error = revisar(b);
  const fila = (id: string, parte: Partial<Fila>) => setB((x) => ({ ...x, ejercicios: x.ejercicios.map((e) => (e.id === id ? { ...e, ...parte } : e)) }));

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (error) {
      setIntento(true);
      return;
    }
    alGuardar(b);
  }

  return (
    <form onSubmit={enviar} noValidate className="mt-6 grid min-w-0 gap-6">
      <Interruptor marcado={b.descanso} alCambiar={(v) => setB({ ...b, descanso: v })} titulo="Día de descanso" detalle="Sin ejercicios este día." />

      {!b.descanso && (
        <>
          <div className="grid min-w-0 gap-3">
            <label className={ROTULO}>
              Nombre o enfoque del día
              <input value={b.nombre} onChange={(e) => setB({ ...b, nombre: e.target.value.slice(0, 50) })} placeholder="Ej. Pierna" className={CAMPO} />
            </label>
            <div role="group" aria-label="Enfoques sugeridos" className="flex flex-wrap gap-2">
              {ENFOQUES.map((n) => (
                <button key={n} type="button" aria-pressed={b.nombre === n} onClick={() => setB({ ...b, nombre: n })} className={`min-h-10 cursor-pointer rounded-full border px-3.5 text-[0.85rem] font-bold ${b.nombre === n ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-slate-300 text-[#0F172A] hover:border-[#0F172A]"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <ul className="grid min-w-0 gap-4">
            {b.ejercicios.map((e, i) => (
              <li key={e.id} className="grid min-w-0 gap-4 rounded-xl bg-[#F8FAFC] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-[0.95rem] font-extrabold text-[#0F172A]">Ejercicio {i + 1}</h4>
                  <button type="button" onClick={() => setB((x) => ({ ...x, ejercicios: x.ejercicios.filter((y) => y.id !== e.id) }))} aria-label={`Quitar ${e.nombre || `ejercicio ${i + 1}`}`} className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[0.85rem] font-bold text-slate-700 hover:border-red-700 hover:text-red-700">
                    <Trash2 size={16} aria-hidden /> Quitar
                  </button>
                </div>
                <label className={ROTULO}>
                  Nombre del ejercicio
                  <input autoFocus={e.nombre === ""} value={e.nombre} onChange={(ev) => fila(e.id, { nombre: ev.target.value.slice(0, 50) })} placeholder="Ej. Remo con mancuerna" className={CAMPO} />
                </label>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                  <Numero nombre="Series" valor={e.series} alCambiar={(v) => fila(e.id, { series: v })} />
                  <Numero nombre="Reps" valor={e.reps} alCambiar={(v) => fila(e.id, { reps: v })} />
                  <Numero nombre="Peso (lb)" valor={e.peso} alCambiar={(v) => fila(e.id, { peso: v })} />
                </div>
              </li>
            ))}
          </ul>

          <button type="button" onClick={() => setB((x) => ({ ...x, ejercicios: [...x.ejercicios, { id: `nuevo-${Date.now()}`, nombre: "", series: "3", reps: "10", peso: "0", hecho: false }] }))} className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#15803D] px-4 font-extrabold text-[#15803D] hover:bg-green-50">
            <Plus size={20} aria-hidden /> Agregar ejercicio
          </button>
        </>
      )}

      <div className="grid gap-3 border-t border-slate-200 pt-5">
        {intento && error && (
          <p role="alert" className="text-[0.9rem] font-bold text-red-700">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button type="submit" className={VERDE}>
            <Save size={18} aria-hidden /> Guardar este día
          </button>
          <button type="button" onClick={alCancelar} className={BORDE}>
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}

export function Rutina({ club, socio, alHorarios }: { club: Club; socio: Socio; alHorarios: () => void }) {
  const [dia, setDia] = useState(diaQueToca);
  const [editando, setEditando] = useState<Borrador | null>(null);
  const [aviso, setAviso] = useState("");
  const sesion = socio.rutina[dia];
  const hechos = sesion.ejercicios.filter((e) => e.hecho).length;
  const reservadas = CLASES.filter((c) => club.reservas.includes(`${socio.id}:${c.id}`));

  function editar(borrador: Borrador) {
    setAviso("");
    setEditando(borrador);
  }

  function guardar(b: Borrador) {
    club.guardarDia(socio.id, dia, {
      dia: sesion.dia,
      nombre: b.descanso ? "Descanso" : b.nombre.trim(),
      descanso: b.descanso,
      /* en un día de descanso se conservan los ejercicios que ya estaban bien escritos */
      ejercicios: b.ejercicios.filter((e) => e.nombre.trim()).map((e) => ({ id: e.id, nombre: e.nombre.trim(), series: Number(e.series) || 1, reps: Number(e.reps) || 1, peso: Number(e.peso) || 0, hecho: e.hecho })),
    });
    setEditando(null);
    setAviso(`Rutina del ${sesion.dia.toLowerCase()} guardada.`);
  }

  return (
    <div className="grid min-w-0 gap-6">
      <section aria-labelledby="ip-rutina" className={TARJETA}>
        <h2 id="ip-rutina" className="text-[1.35rem] font-extrabold">
          Mi rutina de la semana
        </h2>
        <p className="mt-1.5 text-[0.93rem] text-slate-600">{editando ? `Editando el ${sesion.dia.toLowerCase()}. Guarde o cancele para cambiar de día.` : "Escoja un día para entrenar o cambiarlo."}</p>
        <div role="group" aria-label="Día de la rutina" className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
          {socio.rutina.map((d, i) => {
            const activo = dia === i;
            const listo = !d.descanso && d.ejercicios.length > 0 && d.ejercicios.every((e) => e.hecho);
            return (
              <button
                key={d.dia}
                type="button"
                aria-pressed={activo}
                disabled={!!editando && !activo}
                onClick={() => {
                  setDia(i);
                  setAviso("");
                }}
                className={`flex min-h-15 min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border px-1 py-1.5 leading-tight disabled:cursor-not-allowed disabled:opacity-40 ${activo ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-slate-300 text-[#0F172A] hover:border-[#0F172A]"}`}
              >
                <span className="text-[0.84rem] font-bold">{d.dia}</span>
                <span className={`flex items-center gap-1 text-[0.7rem] font-semibold ${activo ? "text-slate-300" : "text-slate-500"}`}>
                  {listo && <Check size={13} aria-hidden className="text-[#15803D]" />}
                  {d.descanso ? "Descanso" : listo ? "Listo" : "Entreno"}
                </span>
              </button>
            );
          })}
        </div>

        {aviso && (
          <div className="mt-5">
            <Guardado texto={aviso} />
          </div>
        )}

        {editando ? (
          <Editor key={dia} inicial={editando} alGuardar={guardar} alCancelar={() => setEditando(null)} />
        ) : sesion.descanso ? (
          <div className="mt-6 rounded-xl bg-[#F8FAFC] px-5 py-8 text-center">
            <Moon size={30} aria-hidden className="mx-auto text-slate-500" />
            <h3 className="mt-3 text-[1.15rem] font-extrabold">Día de descanso</h3>
            <p className="mt-1.5 text-[0.93rem] text-slate-600">Recupérese. Si prefiere entrenar, arme este día.</p>
            <button type="button" onClick={() => editar({ ...aBorrador(sesion), descanso: false })} className={`${BORDE} mt-5`}>
              <Pencil size={17} aria-hidden /> Poner entrenamiento este día
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="break-words text-[1.15rem] font-extrabold">{sesion.nombre}</h3>
                <p className="mt-1.5 text-[0.9rem] font-semibold text-slate-600">
                  {hechos} de {sesion.ejercicios.length} ejercicios completados
                </p>
              </div>
              <button type="button" onClick={() => editar(aBorrador(sesion))} className={`${BORDE} w-full sm:w-auto`}>
                <Pencil size={17} aria-hidden /> Editar este día
              </button>
            </div>
            <div aria-hidden className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-[#15803D] transition-[width] duration-300" style={{ width: `${(hechos / Math.max(1, sesion.ejercicios.length)) * 100}%` }} />
            </div>
            <ul className="mt-5 grid gap-3">
              {sesion.ejercicios.map((e) => (
                <li key={e.id}>
                  <button type="button" aria-pressed={e.hecho} onClick={() => club.marcarEjercicio(socio.id, dia, e.id)} className={`flex w-full min-w-0 cursor-pointer items-center gap-4 rounded-xl p-4 text-left ${e.hecho ? "bg-green-50" : "bg-[#F8FAFC] hover:bg-slate-100"}`}>
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border-2 ${e.hecho ? "border-[#15803D] bg-[#15803D] text-white" : "border-slate-300 bg-white text-transparent"}`}>
                      <Check size={22} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className="block break-words leading-snug text-[#0F172A]">{e.nombre}</b>
                      <span className="mt-1.5 block text-[0.88rem] leading-snug text-slate-600">
                        {e.series} series × {e.reps} · {e.peso ? `${e.peso} lb` : "sin peso"}
                      </span>
                    </span>
                    <span className={`hidden shrink-0 text-[0.82rem] font-bold sm:block ${e.hecho ? "text-[#15803D]" : "text-slate-500"}`}>{e.hecho ? "Hecho" : "Marcar"}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section aria-labelledby="ip-reservas" className={TARJETA}>
        <h2 id="ip-reservas" className="text-[1.2rem] font-extrabold">
          Mis clases reservadas
        </h2>
        {reservadas.length === 0 ? (
          <p className="mt-1.5 text-[0.93rem] text-slate-600">Todavía no ha reservado ninguna.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {reservadas.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F8FAFC] p-4">
                <span className="min-w-0 flex-1 basis-40">
                  <b className="block text-[#0F172A]">{c.nombre}</b>
                  <span className="mt-1.5 block text-[0.85rem] leading-snug text-slate-600">
                    {DIAS[c.dia]} {c.hora} · {sedeDe(c.sede).nombre}
                  </span>
                </span>
                <button type="button" onClick={() => club.alternarReserva(socio.id, c.id)} aria-label={`Cancelar cupo en ${c.nombre} del ${DIAS[c.dia]}`} className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[0.85rem] font-bold text-slate-700 hover:border-red-700 hover:text-red-700">
                  <X size={16} aria-hidden /> Cancelar cupo
                </button>
              </li>
            ))}
          </ul>
        )}
        <button type="button" onClick={alHorarios} className={`${BORDE} mt-4 w-full`}>
          Reservar una clase
        </button>
      </section>
    </div>
  );
}
