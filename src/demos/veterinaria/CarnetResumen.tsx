import { IdCard } from "lucide-react";
import { vigencia } from "./carnet";
import { fechaCorta, type Mascota } from "./datos";
import { ultimasAplicaciones } from "./expediente";

export function CarnetResumen({ mascota, alAbrir }: { mascota: Mascota; alAbrir: () => void }) {
  const aplicaciones = ultimasAplicaciones(mascota);

  return (
    <section aria-labelledby="hv-carnet" className="hv-tarjeta overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0F172A] p-5 sm:p-6">
        <div className="min-w-0">
          <h2 id="hv-carnet" className="text-lg font-extrabold !text-white">
            Carnet Digital de {mascota.nombre}
          </h2>
          <p className="text-sm font-bold tabular-nums text-[#99F6E4]">{mascota.expediente}</p>
        </div>
        <button type="button" onClick={alAbrir} className="hv-boton w-full bg-white text-[#0F172A] hover:bg-[#F0FDFA] sm:w-auto">
          <IdCard size={18} aria-hidden /> Ver credencial
        </button>
      </div>
      {aplicaciones.length ? (
        <ul className="divide-y divide-[#F1F5F9] px-5 sm:px-6">
          {aplicaciones.map((v) => {
            const estado = vigencia(v.proxima);
            return (
              <li key={v.id} className="flex items-center justify-between gap-3 py-3">
                <p className="min-w-0 text-sm font-bold text-[#0F172A]">
                  {v.nombre}
                  <span className="block text-xs font-medium tabular-nums text-[#64748B]">Refuerzo {fechaCorta(v.proxima)}</span>
                </p>
                <span className={`hv-chip ${estado.clase}`}>{estado.texto}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="p-5 text-sm sm:p-6">El carnet se llena en la primera visita, cuando el médico registra cada aplicación.</p>
      )}
    </section>
  );
}

export function PesoHistorico({ mascota }: { mascota: Mascota }) {
  const pesos = [...mascota.pesos].reverse();

  return (
    <section aria-labelledby="hv-pesos" className="hv-tarjeta p-5 sm:p-6">
      <h2 id="hv-pesos" className="text-lg font-extrabold">Peso histórico</h2>
      {pesos.length ? (
        <ol className="mt-4 grid grid-cols-2 gap-3">
          {pesos.slice(0, 4).map((p, i) => {
            const anterior = pesos[i + 1];
            const cambio = anterior ? Math.round((p.kg - anterior.kg) * 10) / 10 : 0;
            return (
              <li key={p.fecha} className={`rounded-2xl p-3.5 ${i === 0 ? "bg-[#F0FDFA]" : "bg-[#F8FAFC]"}`}>
                <p className="text-xs font-bold text-[#64748B]">{fechaCorta(p.fecha)}</p>
                <p className="mt-1 text-xl font-extrabold tabular-nums text-[#0F172A]">{p.kg} kg</p>
                <p className="text-xs font-semibold tabular-nums text-[#475569]">
                  {!anterior ? "Primer registro" : cambio === 0 ? "Sin cambio" : `${cambio > 0 ? "Subió" : "Bajó"} ${Math.abs(cambio)} kg`}
                </p>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-2 text-sm">Se anota en la primera visita.</p>
      )}
    </section>
  );
}
