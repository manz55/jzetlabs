/* Rutina de la semana (marcar y ajustar) y las clases que el socio tiene reservadas. */
import { useState } from "react";
import { Check, Minus, Pencil, Plus, X } from "lucide-react";
import { CLASES, DIAS, PASO_PESO, sedeDe, type Club, type Socio } from "./datos";
import { BORDE, TARJETA } from "./Piezas";

function Ajuste({ nombre, valor, unidad, alBajar, alSubir, tope }: { nombre: string; valor: number; unidad?: string; alBajar: () => void; alSubir: () => void; tope: boolean }) {
  const boton = "grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-lg border border-slate-300 bg-white text-[#0F172A] active:scale-95 disabled:cursor-not-allowed disabled:opacity-35";
  return (
    <div className="min-w-0 rounded-lg bg-white p-2">
      <p className="text-center text-[0.75rem] font-bold text-slate-500">{nombre}</p>
      <div className="mt-1 flex items-center justify-between gap-1">
        <button type="button" aria-label={`Bajar ${nombre.toLowerCase()}`} disabled={tope} onClick={alBajar} className={boton}>
          <Minus size={18} aria-hidden />
        </button>
        <output className="min-w-0 text-center text-[1.2rem] font-extrabold text-[#0F172A]">
          {valor}
          {unidad && <span className="text-[0.78rem] font-bold text-slate-500"> {unidad}</span>}
        </output>
        <button type="button" aria-label={`Subir ${nombre.toLowerCase()}`} onClick={alSubir} className={boton}>
          <Plus size={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}

/* el día de la rutina que toca hoy; fines de semana y días sin rutina caen en el siguiente */
const diaQueToca = () => [0, 0, 1, 1, 2, 2, 0][new Date().getDay()];

export function Rutina({ club, socio, alHorarios }: { club: Club; socio: Socio; alHorarios: () => void }) {
  const [dia, setDia] = useState(diaQueToca);
  const [editando, setEditando] = useState(false);
  const sesion = socio.rutina[dia];
  const hechos = sesion.ejercicios.filter((e) => e.hecho).length;
  const reservadas = CLASES.filter((c) => club.reservas.includes(`${socio.id}:${c.id}`));

  return (
    <div className="grid min-w-0 gap-5">
      <section aria-labelledby="ip-rutina" className={TARJETA}>
        <h2 id="ip-rutina" className="text-[1.35rem] font-extrabold">
          Mi rutina de la semana
        </h2>
        <div role="group" aria-label="Día de la rutina" className="mt-3 grid grid-cols-3 gap-2">
          {socio.rutina.map((d, i) => {
            const listo = d.ejercicios.every((e) => e.hecho);
            return (
              <button key={d.dia} type="button" aria-pressed={dia === i} onClick={() => setDia(i)} className={`flex min-h-12 min-w-0 cursor-pointer items-center justify-center gap-1 rounded-lg border px-1 text-[0.9rem] font-bold ${dia === i ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-slate-300 text-[#0F172A] hover:border-[#0F172A]"}`}>
                {d.dia}
                {listo && <Check size={16} aria-label="completo" className="shrink-0 text-[#15803D]" />}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[1.1rem] font-extrabold">{sesion.nombre}</h3>
            <p className="text-[0.88rem] font-semibold text-slate-600">
              {hechos} de {sesion.ejercicios.length} ejercicios completados
            </p>
          </div>
          <button type="button" aria-pressed={editando} onClick={() => setEditando((v) => !v)} className={`${BORDE} !min-h-11`}>
            {editando ? <Check size={17} aria-hidden /> : <Pencil size={17} aria-hidden />}
            {editando ? "Listo, guardar" : "Editar series y pesos"}
          </button>
        </div>
        <div aria-hidden className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-[#15803D] transition-[width] duration-300" style={{ width: `${(hechos / sesion.ejercicios.length) * 100}%` }} />
        </div>

        <ul className="mt-4 grid gap-2.5">
          {sesion.ejercicios.map((e, i) => (
            <li key={e.nombre} className={`rounded-xl p-3 ${e.hecho ? "bg-green-50" : "bg-[#F8FAFC]"}`}>
              <button type="button" aria-pressed={e.hecho} onClick={() => club.ejercicio(socio.id, dia, i, (x) => ({ ...x, hecho: !x.hecho }))} className="flex w-full min-w-0 cursor-pointer items-center gap-3 text-left">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border-2 ${e.hecho ? "border-[#15803D] bg-[#15803D] text-white" : "border-slate-300 bg-white text-transparent"}`}>
                  <Check size={22} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block leading-snug text-[#0F172A]">{e.nombre}</b>
                  <span className="text-[0.88rem] text-slate-600">
                    {e.series} series × {e.reps} · {e.peso} lb
                  </span>
                </span>
                <span className={`hidden shrink-0 text-[0.82rem] font-bold sm:block ${e.hecho ? "text-[#15803D]" : "text-slate-500"}`}>{e.hecho ? "Hecho" : "Marcar"}</span>
              </button>
              {editando && (
                <div className="mt-2.5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))] gap-2">
                  <Ajuste nombre="Series" valor={e.series} tope={e.series <= 1} alBajar={() => club.ejercicio(socio.id, dia, i, (x) => ({ ...x, series: Math.max(1, x.series - 1) }))} alSubir={() => club.ejercicio(socio.id, dia, i, (x) => ({ ...x, series: Math.min(10, x.series + 1) }))} />
                  <Ajuste nombre="Peso" unidad="lb" valor={e.peso} tope={e.peso <= PASO_PESO} alBajar={() => club.ejercicio(socio.id, dia, i, (x) => ({ ...x, peso: Math.max(PASO_PESO, x.peso - PASO_PESO) }))} alSubir={() => club.ejercicio(socio.id, dia, i, (x) => ({ ...x, peso: x.peso + PASO_PESO }))} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ip-reservas" className={TARJETA}>
        <h2 id="ip-reservas" className="text-[1.2rem] font-extrabold">
          Mis clases reservadas
        </h2>
        {reservadas.length === 0 ? (
          <p className="mt-1 text-[0.93rem] text-slate-600">Todavía no ha reservado ninguna.</p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {reservadas.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#F8FAFC] px-3.5 py-2.5">
                <span className="min-w-0 flex-1 basis-40">
                  <b className="block text-[#0F172A]">{c.nombre}</b>
                  <span className="text-[0.85rem] text-slate-600">
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
        <button type="button" onClick={alHorarios} className={`${BORDE} mt-3 w-full`}>
          Reservar una clase
        </button>
      </section>
    </div>
  );
}
