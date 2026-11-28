import { useState, type FormEvent } from "react";
import { FlaskConical, Pill, Plus, Send, Trash2 } from "lucide-react";
import {
  ESPECIALIDADES,
  EXAMENES,
  IDS_ESPECIALIDAD,
  MEDICOS,
  PARAMETROS,
  QUIMICOS,
  fechaCorta,
  folioTexto,
  fueraDeRango,
  nombreServicio,
  textoRango,
  type Cita,
  type EspecialidadId,
  type ExamenId,
  type Medicamento,
  type Paciente,
  type ParametroId,
} from "./datos";
import type { Altamira } from "./estado";
import { agregarReceta, publicarResultado } from "./expediente";

export type Modo = "resultado" | "receta";

type Aviso = (texto: string, pacienteId: string) => void;

function FormularioResultado({ cita, paciente, alPublicar }: { cita: Cita; paciente: Paciente; alPublicar: () => void }) {
  const parametros = EXAMENES[cita.servicioId as ExamenId].parametros;
  const [valores, setValores] = useState<Partial<Record<ParametroId, string>>>(() =>
    Object.fromEntries(parametros.map((id) => [id, PARAMETROS[id].lectura.toFixed(PARAMETROS[id].decimales)])),
  );
  const [quimico, setQuimico] = useState(QUIMICOS[0]);
  const [error, setError] = useState("");
  const numero = (id: ParametroId) => {
    const texto = valores[id]?.trim().replace(",", ".") ?? "";
    return texto === "" ? Number.NaN : Number(texto);
  };

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (parametros.some((id) => !Number.isFinite(numero(id)) || numero(id) < 0)) return setError("Complete todos los parámetros con valores numéricos.");
    publicarResultado(cita.id, Object.fromEntries(parametros.map((id) => [id, numero(id)])), quimico);
    alPublicar();
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-3">
      <fieldset className="grid gap-2">
        <legend className="mb-1 text-xs font-bold text-[#0F172A]">Lecturas del analizador</legend>
        {parametros.map((id) => {
          const p = PARAMETROS[id];
          const fuera = Number.isFinite(numero(id)) && fueraDeRango(id, numero(id), paciente.sexo);
          return (
            <label key={id} className="grid grid-cols-[minmax(0,1fr)_6rem] items-center gap-3">
              <span className="min-w-0 text-xs leading-snug">
                <strong className="block text-[#0F172A]">{p.nombre}</strong>
                <span className={fuera ? "font-bold text-[#B45309]" : ""}>
                  {textoRango(id, paciente.sexo)} {p.unidad}
                  {fuera ? " · Fuera de rango" : ""}
                </span>
              </span>
              <input
                inputMode="decimal"
                className={`cm-control !min-h-10 text-right ${fuera ? "!border-[#D97706] !bg-[#FFFBEB]" : ""}`}
                value={valores[id] ?? ""}
                onChange={(e) => {
                  setError("");
                  setValores((v) => ({ ...v, [id]: e.target.value }));
                }}
              />
            </label>
          );
        })}
      </fieldset>
      <label className="cm-campo">
        Validado por
        <select className="cm-control" value={quimico} onChange={(e) => setQuimico(e.target.value)}>
          {QUIMICOS.map((q) => (
            <option key={q} value={q}>
              {q.split(" · ")[0]}
            </option>
          ))}
        </select>
      </label>
      <p className="-mt-1.5 text-xs">{quimico.split(" · ").slice(1).join(" · ")}</p>
      {error && (
        <p role="alert" className="text-sm font-semibold text-[#B91C1C]">
          {error}
        </p>
      )}
      <button type="submit" className="cm-boton cm-verde w-full">
        <FlaskConical size={16} aria-hidden /> Marcar Resultado listo
      </button>
    </form>
  );
}

const medicamentoVacio = (): Medicamento => ({ nombre: "", dosis: "", duracion: "" });

function FormularioReceta({ clinica, alPublicar }: { clinica: Altamira; alPublicar: Aviso }) {
  const [pacienteId, setPaciente] = useState(clinica.pacientes[0].id);
  const [medicoId, setMedico] = useState<EspecialidadId>("medicina-interna");
  const [medicamentos, setMedicamentos] = useState([medicamentoVacio()]);
  const [indicaciones, setIndicaciones] = useState("");
  const [error, setError] = useState("");

  function editar(i: number, cambios: Partial<Medicamento>) {
    setError("");
    setMedicamentos((lista) => lista.map((m, j) => (j === i ? { ...m, ...cambios } : m)));
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (medicamentos.some((m) => !m.nombre.trim() || !m.dosis.trim() || !m.duracion.trim())) return setError("Complete medicamento, dosis y duración en cada línea.");
    agregarReceta({ pacienteId, medicoId, medicamentos, indicaciones: indicaciones.trim() });
    setMedicamentos([medicamentoVacio()]);
    setIndicaciones("");
    alPublicar(`Receta agregada al expediente de ${clinica.paciente(pacienteId)?.nombre}.`, pacienteId);
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-3">
      <label className="cm-campo">
        Paciente
        <select className="cm-control" value={pacienteId} onChange={(e) => setPaciente(e.target.value)}>
          {clinica.pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} · {p.edad} años
            </option>
          ))}
        </select>
      </label>
      <label className="cm-campo">
        Médico que receta
        <select className="cm-control" value={medicoId} onChange={(e) => setMedico(e.target.value as EspecialidadId)}>
          {IDS_ESPECIALIDAD.map((id) => (
            <option key={id} value={id}>
              {MEDICOS[id].nombre} · {ESPECIALIDADES[id].nombre}
            </option>
          ))}
        </select>
      </label>
      {medicamentos.map((m, i) => (
        <fieldset key={i} className="grid gap-2 rounded-xl bg-[#F8FAFC] p-3">
          <legend className="sr-only">Medicamento {i + 1}</legend>
          <input aria-label={`Medicamento ${i + 1}`} className="cm-control !min-h-10" placeholder="Medicamento y concentración" value={m.nombre} onChange={(e) => editar(i, { nombre: e.target.value })} />
          <input aria-label={`Dosis del medicamento ${i + 1}`} className="cm-control !min-h-10" placeholder="Dosis: 1 tableta cada 12 horas" value={m.dosis} onChange={(e) => editar(i, { dosis: e.target.value })} />
          <div className="flex gap-2">
            <input aria-label={`Duración del medicamento ${i + 1}`} className="cm-control !min-h-10" placeholder="Duración: 7 días" value={m.duracion} onChange={(e) => editar(i, { duracion: e.target.value })} />
            {medicamentos.length > 1 && (
              <button type="button" aria-label={`Quitar medicamento ${i + 1}`} onClick={() => setMedicamentos((lista) => lista.filter((_, j) => j !== i))} className="cm-boton cm-linea !min-h-10 shrink-0 !px-3">
                <Trash2 size={15} aria-hidden />
              </button>
            )}
          </div>
        </fieldset>
      ))}
      <button type="button" onClick={() => setMedicamentos((lista) => [...lista, medicamentoVacio()])} className="flex min-h-9 items-center gap-1.5 justify-self-start text-sm font-bold text-[#1D4ED8]">
        <Plus size={15} aria-hidden /> Agregar otro medicamento
      </button>
      <label className="cm-campo">
        Indicaciones
        <textarea className="cm-control" rows={2} value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)} />
      </label>
      {error && (
        <p role="alert" className="text-sm font-semibold text-[#B91C1C]">
          {error}
        </p>
      )}
      <button type="submit" className="cm-boton cm-azul w-full">
        <Send size={16} aria-hidden /> Agregar receta al expediente
      </button>
    </form>
  );
}

export function Publicar({ clinica, modo, alModo, alPublicar }: { clinica: Altamira; modo: Modo; alModo: (m: Modo) => void; alPublicar: Aviso }) {
  const [elegida, setElegida] = useState("");
  const cita = clinica.muestrasEnLab.find((c) => c.id === elegida) ?? clinica.muestrasEnLab[0];
  const paciente = cita && clinica.paciente(cita.pacienteId);

  return (
    <section aria-labelledby="cm-publicar" className="cm-tarjeta p-4 sm:p-6">
      <h2 id="cm-publicar" className="text-xl">Publicar Resultado de Lab / Receta</h2>
      <div role="group" aria-label="Qué publicar" className="cm-pildoras mt-3">
        <button type="button" aria-pressed={modo === "resultado"} onClick={() => alModo("resultado")} className="cm-pildora">
          <FlaskConical size={14} aria-hidden /> Resultado de lab
        </button>
        <button type="button" aria-pressed={modo === "receta"} onClick={() => alModo("receta")} className="cm-pildora">
          <Pill size={14} aria-hidden /> Receta
        </button>
      </div>

      <div className="mt-4">
        {modo === "receta" ? (
          <FormularioReceta clinica={clinica} alPublicar={alPublicar} />
        ) : cita && paciente ? (
          <div className="grid gap-3">
            <label className="cm-campo">
              Muestra pendiente ({clinica.muestrasEnLab.length})
              <select className="cm-control" value={cita.id} onChange={(e) => setElegida(e.target.value)}>
                {clinica.muestrasEnLab.map((c) => (
                  <option key={c.id} value={c.id}>
                    {clinica.paciente(c.pacienteId)?.nombre} · {nombreServicio(c.servicioId)}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-xs">
              Orden {folioTexto(cita.folio)} · muestra del {fechaCorta(cita.fecha)}, {cita.hora}
            </p>
            <FormularioResultado
              key={cita.id}
              cita={cita}
              paciente={paciente}
              alPublicar={() => alPublicar(`Resultado de ${paciente.nombre} publicado en su portal.`, paciente.id)}
            />
          </div>
        ) : (
          <p className="rounded-xl bg-[#F8FAFC] p-4 text-sm">No hay muestras pendientes. Ingrese una muestra o márquela como tomada en la agenda.</p>
        )}
      </div>
    </section>
  );
}
