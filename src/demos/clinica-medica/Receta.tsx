import { Download, Pill } from "lucide-react";
import { ESPECIALIDADES, SEDE, fechaCorta, type Paciente, type Receta } from "./datos";
import { medicoDeReceta } from "./expediente";
import { LogoMarca } from "./Piezas";

function Medicamentos({ receta }: { receta: Receta }) {
  return (
    <>
      <ul className="grid gap-3">
        {receta.medicamentos.map((m, i) => (
          <li key={`${m.nombre}-${i}`} className="flex gap-3">
            <Pill size={17} aria-hidden className="mt-0.5 shrink-0 text-[#1D4ED8]" />
            <div className="min-w-0">
              <p className="font-bold leading-snug text-[#0F172A]">{m.nombre}</p>
              <p className="text-sm leading-snug">
                {m.dosis} · {m.duracion}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {receta.indicaciones && <p className="mt-4 rounded-xl bg-[#F8FAFC] p-3 text-sm leading-relaxed">{receta.indicaciones}</p>}
    </>
  );
}

function Firma({ receta }: { receta: Receta }) {
  const medico = medicoDeReceta(receta);
  return (
    <p className="text-sm leading-snug">
      <strong className="text-[#0F172A]">{medico.nombre}</strong>
      <br />
      {ESPECIALIDADES[receta.medicoId].nombre} · Colegiado No. {medico.colegiado}
    </p>
  );
}

export function HojaDeReceta({ receta, paciente }: { receta: Receta; paciente: Paciente }) {
  return (
    <article>
      <header className="flex items-center justify-between gap-4 border-b border-[#CBD5E1] pb-3">
        <LogoMarca />
        <div className="text-right">
          <h3 className="text-lg">Receta médica</h3>
          <p className="text-sm">{fechaCorta(receta.fecha)}</p>
        </div>
      </header>
      <p className="my-4 text-sm">
        Paciente: <strong className="text-[#0F172A]">{paciente.nombre}</strong> · {paciente.edad} años
      </p>
      <Medicamentos receta={receta} />
      <div className="mt-16 w-72 border-t border-[#0F172A] pt-2">
        <Firma receta={receta} />
      </div>
      <p className="mt-6 text-xs">{SEDE.direccion}</p>
    </article>
  );
}

export function TarjetaReceta({ receta, alDescargar }: { receta: Receta; alDescargar: () => void }) {
  return (
    <article className="cm-tarjeta p-5">
      <p className="mb-4 text-xs font-bold text-[#475569]">Emitida el {fechaCorta(receta.fecha)}</p>
      <Medicamentos receta={receta} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-[#DBE4F0] pt-4">
        <Firma receta={receta} />
        <button type="button" onClick={alDescargar} className="cm-boton cm-linea">
          <Download size={16} aria-hidden /> Descargar receta
        </button>
      </div>
    </article>
  );
}
