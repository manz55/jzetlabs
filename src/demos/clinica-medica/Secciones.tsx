import { useState } from "react";
import { ArrowRight, CalendarDays, Car, Check, Clock, CreditCard, MapPin, Utensils } from "lucide-react";
import {
  ASEGURADORAS,
  ESPECIALIDADES,
  EXAMENES,
  FILTROS_LAB,
  FOTOS,
  IDS_ESPECIALIDAD,
  IDS_EXAMEN,
  MEDICOS,
  METODOS,
  PARAMETROS,
  SEDE,
  qz,
  type Categoria,
  type ServicioId,
} from "./datos";
import { Foto } from "./Piezas";

function Encabezado({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl sm:text-4xl">{titulo}</h2>
      <p className="mt-2">{texto}</p>
    </div>
  );
}

export function Especialidades({ alReservar }: { alReservar: (id: ServicioId) => void }) {
  return (
    <section id="especialidades" className="cm-seccion">
      <div className="cm-ancho">
        <Encabezado titulo="Especialidades" texto="La tarifa de la consulta se muestra completa antes de reservar." />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {IDS_ESPECIALIDAD.map((id) => {
            const e = ESPECIALIDADES[id];
            return (
              <article key={id} className="cm-tarjeta flex flex-col overflow-hidden">
                <Foto id={e.foto} alt={e.alt} ancho={640} alto={360} className="aspect-video w-full" />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl">{e.nombre}</h3>
                  <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-2xl font-extrabold text-[#0F172A]">{qz(e.precio)}</span>
                    <span className="flex items-center gap-1 text-sm">
                      <Clock size={14} aria-hidden /> {e.duracion}
                    </span>
                  </p>
                  <ul className="mb-5 mt-4 grid gap-2 text-sm">
                    {e.incluye.map((punto) => (
                      <li key={punto} className="flex items-start gap-2">
                        <Check size={16} aria-hidden className="mt-0.5 shrink-0 text-[#15803D]" />
                        {punto}
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => alReservar(id)} className="cm-boton cm-azul mt-auto w-full">
                    Reservar horario <ArrowRight size={16} aria-hidden />
                    <span className="sr-only"> de {e.nombre}</span>
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

export function Laboratorio({ alReservar }: { alReservar: (id: ServicioId) => void }) {
  const [filtro, setFiltro] = useState<Categoria | "todos">("todos");
  const visibles = IDS_EXAMEN.filter((id) => filtro === "todos" || EXAMENES[id].categoria === filtro);

  return (
    <section id="laboratorio" className="cm-seccion bg-white">
      <div className="cm-ancho">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0">
            <Encabezado titulo="Laboratorio clínico" texto="Toma de muestras de lunes a sábado desde las 7:00. Su informe validado llega al Portal del Paciente el mismo día." />
            <div role="group" aria-label="Filtrar exámenes" className="cm-pildoras mt-6">
              {FILTROS_LAB.map((f) => (
                <button key={f.id} type="button" aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)} className="cm-pildora">
                  {f.nombre}
                </button>
              ))}
            </div>
          </div>
          <Foto id={FOTOS.laboratorio} alt="Profesional de laboratorio observando una muestra al microscopio" ancho={704} alto={400} className="hidden aspect-[704/400] w-full rounded-2xl lg:block" />
        </div>

        <ul className="mt-8 grid gap-4 lg:grid-cols-2">
          {visibles.map((id) => {
            const e = EXAMENES[id];
            return (
              <li key={id} className="cm-tarjeta flex flex-col gap-4 bg-[#F8FAFC] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-lg">{e.nombre}</h3>
                    <p className="mt-1 text-sm leading-snug">{e.parametros.map((p) => PARAMETROS[p].nombre).join(", ")}</p>
                  </div>
                  <p className="shrink-0 text-xl font-extrabold text-[#0F172A]">{qz(e.precio)}</p>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="cm-estado cm-aviso">
                      <Clock size={13} aria-hidden /> Entrega en {e.horas} horas
                    </span>
                    <span className="cm-estado cm-neutro">
                      <Utensils size={13} aria-hidden className="shrink-0" /> {e.preparacion}
                    </span>
                  </div>
                  <button type="button" onClick={() => alReservar(id)} className="cm-boton cm-linea max-sm:w-full">
                    Agendar toma
                    <span className="sr-only"> de {e.nombre}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function Medicos({ alReservar }: { alReservar: (id: ServicioId) => void }) {
  return (
    <section id="medicos" className="cm-seccion">
      <div className="cm-ancho">
        <Encabezado titulo="Nuestros médicos" texto="Cada especialista con su número de colegiado activo y sus días de atención." />
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {IDS_ESPECIALIDAD.map((id) => {
            const m = MEDICOS[id];
            return (
              <li key={id} className="cm-tarjeta flex gap-4 p-4">
                <Foto id={m.foto} alt={m.nombre} ancho={224} alto={280} className="h-36 w-28 shrink-0 rounded-xl" />
                <div className="flex min-w-0 flex-col">
                  <h3 className="text-base leading-snug">{m.nombre}</h3>
                  <p className="text-sm font-bold text-[#1D4ED8]">{ESPECIALIDADES[id].nombre}</p>
                  <p className="mt-1 text-xs">Colegiado activo No. {m.colegiado}</p>
                  <p className="mt-2 flex items-start gap-1.5 text-xs leading-snug">
                    <CalendarDays size={14} aria-hidden className="shrink-0 text-[#15803D]" />
                    {m.atiende}
                  </p>
                  <button type="button" onClick={() => alReservar(id)} className="mt-auto min-h-9 self-start pt-2 text-sm font-bold text-[#1D4ED8] underline underline-offset-4">
                    Ver horarios<span className="sr-only"> de {m.nombre}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function SegurosUbicacion() {
  return (
    <section id="seguros-ubicacion" className="cm-seccion bg-[#EFF6FF]">
      <div className="cm-ancho">
        <Encabezado titulo="Seguros y ubicación" texto="Presente su carné de asegurado y su DPI en recepción antes de pasar a consulta." />
        <ul aria-label="Aseguradoras afiliadas" className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {ASEGURADORAS.map((a) => (
            <li key={a.id} className="cm-tarjeta grid min-h-24 place-items-center p-4 text-center font-['Playfair_Display',serif] text-lg font-bold text-[#0F172A]">
              {a.nombre}
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="cm-tarjeta overflow-hidden">
            <Foto id={FOTOS.consultorio} alt="Consultorio equipado con una doctora y su paciente" ancho={640} alto={300} className="aspect-[640/300] w-full" />
            <div className="p-6">
              <h3 className="flex items-center gap-2 text-lg">
                <MapPin size={18} aria-hidden className="text-[#1D4ED8]" /> Dónde estamos
              </h3>
              <p className="mt-2 text-sm">{SEDE.direccion}</p>
              <a href={SEDE.mapa} target="_blank" rel="noopener noreferrer" className="cm-boton cm-linea mt-4">
                Cómo llegar
              </a>
            </div>
          </div>

          <div className="cm-tarjeta p-6">
            <h3 className="flex items-center gap-2 text-lg">
              <Clock size={18} aria-hidden className="text-[#1D4ED8]" /> Horarios
            </h3>
            <dl className="mt-3 divide-y divide-[#DBE4F0] text-sm">
              {SEDE.horarios.map((h) => (
                <div key={h.dia} className="flex justify-between gap-4 py-3">
                  <dt>{h.dia}</dt>
                  <dd className="shrink-0 font-bold text-[#0F172A]">{h.horas}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid gap-6">
            <div className="cm-tarjeta p-6">
              <h3 className="flex items-center gap-2 text-lg">
                <Car size={18} aria-hidden className="text-[#1D4ED8]" /> Parqueo en sótano
              </h3>
              <p className="mt-2 text-sm">Ingrese al sótano de la torre y suba por elevador al nivel 6. Selle su boleto en recepción.</p>
            </div>
            <div className="cm-tarjeta p-6">
              <h3 className="flex items-center gap-2 text-lg">
                <CreditCard size={18} aria-hidden className="text-[#1D4ED8]" /> Formas de pago
              </h3>
              <p className="mt-2 text-sm">{METODOS.join(", ")}.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
