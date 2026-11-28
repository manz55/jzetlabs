import { useState, type FormEvent, type ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { MEDICOS, VACUNAS, fechaCorta, hoyIso, sumarMeses } from "./datos";
import type { ClinicaViva } from "./estado";
import { Retrato, Ventana } from "./Piezas";

function Bloque({ titulo, activo, alActivar, children }: { titulo: string; activo: boolean; alActivar: (v: boolean) => void; children: ReactNode }) {
  return (
    <fieldset className={`rounded-2xl border p-4 ${activo ? "border-[#0D9488]" : "border-[#E2E8F0]"}`}>
      <legend className="sr-only">{titulo}</legend>
      <label className="flex min-h-8 items-center gap-2.5 text-sm font-extrabold text-[#0F172A]">
        <input type="checkbox" checked={activo} onChange={(e) => alActivar(e.target.checked)} className="size-5 accent-[#0F766E]" />
        {titulo}
      </label>
      {activo && <div className="mt-3 grid gap-3">{children}</div>}
    </fieldset>
  );
}

type Props = { clinica: ClinicaViva; mascotaInicial?: string; alCerrar: () => void; alAvisar: (texto: string) => void };

export function RegistroClinico({ clinica, mascotaInicial, alCerrar, alAvisar }: Props) {
  const [mascotaId, setMascotaId] = useState(mascotaInicial ?? clinica.mascotas[0].id);
  const [medico, setMedico] = useState(MEDICOS[0].nombre);
  const [peso, setPeso] = useState("");
  const [conVacuna, setConVacuna] = useState(false);
  const [elegida, setElegida] = useState("");
  const [conIndicacion, setConIndicacion] = useState(false);
  const [indicacion, setIndicacion] = useState({ medicamento: "", dosis: "", dias: 7, cuidados: "" });
  const mascota = clinica.mascota(mascotaId) ?? clinica.mascotas[0];
  const vacuna = VACUNAS[mascota.especie].find((v) => v.nombre === elegida) ?? VACUNAS[mascota.especie][0];
  const kg = Number(peso.replace(",", "."));
  const pesoValido = !peso.trim() || (kg > 0 && kg < 120);
  const indicacionCompleta = !conIndicacion || Boolean(indicacion.medicamento.trim() && indicacion.dosis.trim());
  const hayAlgo = Boolean(peso.trim()) || conVacuna || conIndicacion;

  function guardar(e: FormEvent) {
    e.preventDefault();
    clinica.registrarClinico(mascota.id, {
      medico,
      kg: peso.trim() ? Math.round(kg * 10) / 10 : null,
      vacuna: conVacuna ? vacuna.nombre : undefined,
      indicacion: conIndicacion ? indicacion : undefined,
    });
    alAvisar(`Expediente de ${mascota.nombre} actualizado. ${mascota.dueno.split(" ")[0]} ya lo ve en su portal.`);
    alCerrar();
  }

  return (
    <Ventana titulo="Registro clínico rápido" alCerrar={alCerrar}>
      <form onSubmit={guardar} className="grid gap-4">
        <div className="flex items-end gap-3">
          <Retrato mascota={mascota} className="size-12" />
          <label className="block min-w-0 flex-1">
            <span className="hv-rotulo">Paciente</span>
            <select value={mascota.id} onChange={(e) => setMascotaId(e.target.value)} className="hv-campo">
              {clinica.mascotas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} · {m.dueno}
                </option>
              ))}
            </select>
          </label>
        </div>
        {mascota.notas && (
          <p className="flex gap-2 rounded-2xl bg-[#FFF7ED] p-3 text-sm font-bold text-[#9A3412]">
            <TriangleAlert size={17} aria-hidden className="mt-0.5 shrink-0" /> {mascota.notas}
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block min-w-0">
            <span className="hv-rotulo">Médico</span>
            <select value={medico} onChange={(e) => setMedico(e.target.value)} className="hv-campo">
              {MEDICOS.map((m) => (
                <option key={m.nombre} value={m.nombre}>
                  {m.nombre} · Col. {m.colegiado}
                </option>
              ))}
            </select>
          </label>
          <label className="block min-w-0">
            <span className="hv-rotulo">Peso nuevo en kg</span>
            <input value={peso} onChange={(e) => setPeso(e.target.value)} inputMode="decimal" placeholder="Ej. 12.5" aria-invalid={!pesoValido} className="hv-campo tabular-nums" />
          </label>
        </div>
        {!pesoValido && (
          <p role="alert" className="text-sm font-bold text-[#B91C1C]">
            Escribe el peso en kilos, por ejemplo 12.5.
          </p>
        )}

        <Bloque titulo="Vacuna aplicada" activo={conVacuna} alActivar={setConVacuna}>
          <select aria-label="Vacuna aplicada" value={vacuna.nombre} onChange={(e) => setElegida(e.target.value)} className="hv-campo">
            {VACUNAS[mascota.especie].map((v) => (
              <option key={v.nombre}>{v.nombre}</option>
            ))}
          </select>
          <p className="text-sm font-semibold text-[#115E59]">Próximo refuerzo: {fechaCorta(sumarMeses(hoyIso(), vacuna.meses))}</p>
        </Bloque>

        <Bloque titulo="Indicación médica o receta" activo={conIndicacion} alActivar={setConIndicacion}>
          <label className="block">
            <span className="hv-rotulo">Medicamento</span>
            <input value={indicacion.medicamento} onChange={(e) => setIndicacion({ ...indicacion, medicamento: e.target.value })} maxLength={60} placeholder="Ej. Antiinflamatorio oral" className="hv-campo" />
          </label>
          <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
            <label className="block min-w-0">
              <span className="hv-rotulo">Dosis</span>
              <input value={indicacion.dosis} onChange={(e) => setIndicacion({ ...indicacion, dosis: e.target.value })} maxLength={80} placeholder="Ej. 1 tableta cada 24 h" className="hv-campo" />
            </label>
            <label className="block min-w-0">
              <span className="hv-rotulo">Duración</span>
              <select value={indicacion.dias} onChange={(e) => setIndicacion({ ...indicacion, dias: Number(e.target.value) })} className="hv-campo">
                {[3, 5, 7, 10, 14, 30].map((d) => (
                  <option key={d} value={d}>
                    {d} días
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="hv-rotulo">Cuidados (opcional)</span>
            <textarea value={indicacion.cuidados} onChange={(e) => setIndicacion({ ...indicacion, cuidados: e.target.value })} maxLength={180} rows={2} placeholder="Ej. Reposo y sin saltos" className="hv-campo !h-auto py-2.5" />
          </label>
        </Bloque>

        <button type="submit" disabled={!hayAlgo || !pesoValido || !indicacionCompleta} className="hv-boton hv-turquesa">
          Guardar en el expediente
        </button>
      </form>
    </Ventana>
  );
}
