import { hora12, hoyIso } from "./datos";
import type { useHorario } from "./useHorario";

export function CamposHorario({ horario, rotuloFecha = "Fecha", rotuloHora = "Horario libre" }: { horario: ReturnType<typeof useHorario>; rotuloFecha?: string; rotuloHora?: string }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <label className="block min-w-0">
        <span className="hv-rotulo">{rotuloFecha}</span>
        <input type="date" value={horario.fecha} min={hoyIso()} onChange={(e) => horario.setFecha(e.target.value)} className="hv-campo !px-2.5" />
      </label>
      <label className="block min-w-0">
        <span className="hv-rotulo">{rotuloHora}</span>
        <select value={horario.hora} onChange={(e) => horario.setHora(e.target.value)} disabled={!horario.libres.length} className="hv-campo">
          {horario.libres.length ? (
            horario.libres.map((h) => (
              <option key={h} value={h}>
                {hora12(h)}
              </option>
            ))
          ) : (
            <option value="">Sin horarios</option>
          )}
        </select>
      </label>
    </div>
  );
}
