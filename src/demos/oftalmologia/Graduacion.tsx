import { Copy, Eye, MessageCircle } from "lucide-react";
import { fechaCompleta } from "./agenda";
import type { Paciente } from "./datos";
import { columnasOjo, enlaceWhatsApp, textoReceta } from "./recetas";

export function TarjetaGraduacion({ paciente, alAvisar }: { paciente: Paciente; alAvisar: (texto: string, alerta?: boolean) => void }) {
  const g = paciente.graduacion;
  if (!g) {
    return (
      <section aria-label="Graduación digital" className="cv-tarjeta p-6">
        <Eye size={28} aria-hidden className="text-[#1E3A8A]" />
        <h2 className="mt-3 text-2xl">Tu graduación aparece después del examen</h2>
        <p className="mt-2 max-w-xl">En cuanto el optometrista la guarde, vas a poder verla aquí, copiarla o mandarla por WhatsApp.</p>
      </section>
    );
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(textoReceta(paciente, g!));
      alAvisar("Receta copiada.");
    } catch {
      alAvisar("No se pudo copiar. Usa el envío por WhatsApp.", true);
    }
  }

  return (
    <section aria-label="Graduación digital" className="cv-tarjeta overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 p-5 sm:p-6">
        <div className="min-w-0">
          <h2 className="text-2xl">Graduación oftalmológica digital</h2>
          <p className="mt-1 text-sm">
            {paciente.nombre}
            {paciente.edad ? ` · ${paciente.edad} años` : ""} · {g.profesional}
          </p>
        </div>
        <p className="cv-chip cv-chip-bien">Vigente hasta {fechaCompleta(g.vence)}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-center tabular-nums">
          <caption className="sr-only">Graduación por ojo</caption>
          <thead className="bg-[#F1F5F9] text-[0.7rem] font-bold text-[#475569] sm:text-sm">
            <tr>
              <th scope="col" className="w-[22%] py-3 pl-4 text-left sm:pl-6">Ojo</th>
              {columnasOjo(g.od).map((c) => (
                <th key={c.nombre} scope="col" className="px-0.5 py-3">{c.nombre}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm sm:text-xl">
            {([["OD", "Ojo derecho", g.od], ["OI", "Ojo izquierdo", g.oi]] as const).map(([sigla, nombre, ojo]) => (
              <tr key={sigla} className="border-t border-[#E2E8F0]">
                <th scope="row" className="py-4 pl-4 text-left sm:pl-6">
                  <span className="block text-base font-extrabold text-[#1E3A8A] sm:text-xl">{sigla}</span>
                  <span className="block text-[0.65rem] font-semibold leading-tight text-[#475569] sm:text-xs">{nombre}</span>
                </th>
                {columnasOjo(ojo).map((c) => (
                  <td key={c.nombre} className="px-0.5 py-4 font-bold text-[#0F172A]">{c.valor}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 border-t border-[#E2E8F0] p-5 sm:p-6">
        <dl className="grid gap-3 text-sm sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div>
            <dt className="font-semibold text-[#475569]">Cristal recomendado</dt>
            <dd className="font-bold text-[#0F172A]">{g.cristal}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#475569]">Emitida</dt>
            <dd className="font-bold tabular-nums text-[#0F172A]">{fechaCompleta(g.emitida)}</dd>
          </div>
        </dl>
        <div className="grid gap-2 sm:flex">
          <button type="button" onClick={copiar} className="cv-boton cv-zafiro">
            <Copy size={17} aria-hidden /> Copiar receta
          </button>
          <a href={enlaceWhatsApp(textoReceta(paciente, g))} target="_blank" rel="noopener noreferrer" className="cv-boton cv-linea">
            <MessageCircle size={17} aria-hidden /> Enviar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
