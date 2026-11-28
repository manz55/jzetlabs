import { useState, type FormEvent } from "react";
import { Copy, MessageCircle, TestTubes } from "lucide-react";
import { cambiarEstado, cobrar, ingresarMuestra, solicitudVacia } from "./agenda";
import { ASEGURADORAS, EXAMENES, IDS_EXAMEN, METODOS, nombrePago, nombreServicio, precioServicio, qz, type Cita, type ExamenId, type Pago, type Sexo } from "./datos";
import type { Altamira } from "./estado";
import { avisoDeResultado, enlaceWhatsApp, marcarEnviado } from "./expediente";
import { FormularioCita } from "./FormularioCita";
import { Ventana } from "./Piezas";

type Comunes = { clinica: Altamira; alAvisar: (texto: string, alerta?: boolean) => void; alCerrar: () => void };

export function NuevaCita({ clinica, alAvisar, alCerrar, alCreada }: Comunes & { alCreada: (cita: Cita) => void }) {
  const [solicitud, setSolicitud] = useState(solicitudVacia);
  return (
    <Ventana titulo="Nueva cita en recepción" detalle="Queda en la agenda como En espera." alCerrar={alCerrar}>
      <FormularioCita
        clinica={clinica}
        solicitud={solicitud}
        alCambiar={setSolicitud}
        enPortal={false}
        accion="Registrar cita"
        alReservar={(cita) => {
          alAvisar("Cita registrada en la agenda.");
          alCreada(cita);
          alCerrar();
        }}
      />
    </Ventana>
  );
}

export function IngresarMuestra({ clinica, alAvisar, alCerrar }: Comunes) {
  const [pacienteId, setPaciente] = useState("");
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState<Sexo | "">("");
  const [servicioId, setServicio] = useState<ExamenId>("hematologia");
  const [pago, setPago] = useState<Pago>("particular");
  const [error, setError] = useState("");

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!pacienteId && (nombre.trim().length < 3 || edad === "" || Number(edad) > 110 || !sexo)) return setError("Complete nombre, edad y sexo del paciente nuevo.");
    ingresarMuestra({ pacienteId, nuevo: { nombre, edad: Number(edad), sexo: sexo || "F" }, servicioId, pago });
    alAvisar("Muestra ingresada al laboratorio.");
    alCerrar();
  }

  return (
    <Ventana titulo="Ingresar muestra de laboratorio" alCerrar={alCerrar}>
      {clinica.porTomar.length > 0 && (
        <div className="mb-5">
          <h3 className="text-base">Con cita para hoy</h3>
          <ul className="mt-2 grid gap-2">
            {clinica.porTomar.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#EFF6FF] p-3">
                <span className="min-w-0 text-sm">
                  <strong className="block text-[#0F172A]">{clinica.paciente(c.pacienteId)?.nombre}</strong>
                  {c.hora} · {nombreServicio(c.servicioId)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    cambiarEstado(c.id, "muestra");
                    alAvisar("Muestra marcada como tomada.");
                  }}
                  className="cm-boton cm-azul !min-h-10"
                >
                  <TestTubes size={15} aria-hidden /> Muestra tomada
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3 className="text-base">Sin cita previa</h3>
      <form onSubmit={enviar} noValidate className="mt-2 grid gap-3">
        <label className="cm-campo">
          Paciente
          <select
            className="cm-control"
            value={pacienteId}
            onChange={(e) => {
              setError("");
              setPaciente(e.target.value);
            }}
          >
            <option value="">Paciente nuevo</option>
            {clinica.pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} · {p.edad} años
              </option>
            ))}
          </select>
        </label>
        {!pacienteId && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,0.7fr)_minmax(0,1fr)]">
            <label className="cm-campo col-span-2 sm:col-span-1">
              Nombre y apellido
              <input className="cm-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>
            <label className="cm-campo">
              Edad
              <input className="cm-control" inputMode="numeric" value={edad} onChange={(e) => setEdad(e.target.value.replace(/\D/g, "").slice(0, 3))} />
            </label>
            <label className="cm-campo">
              Sexo
              <select className="cm-control" value={sexo} onChange={(e) => setSexo(e.target.value as Sexo)}>
                <option value="" disabled>
                  Elegir
                </option>
                <option value="F">Mujer</option>
                <option value="M">Hombre</option>
              </select>
            </label>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="cm-campo">
            Examen
            <select className="cm-control" value={servicioId} onChange={(e) => setServicio(e.target.value as ExamenId)}>
              {IDS_EXAMEN.map((id) => (
                <option key={id} value={id}>
                  {EXAMENES[id].nombre} · {qz(EXAMENES[id].precio)}
                </option>
              ))}
            </select>
          </label>
          <label className="cm-campo">
            Forma de pago
            <select className="cm-control" value={pago} onChange={(e) => setPago(e.target.value as Pago)}>
              <option value="particular">Particular</option>
              {ASEGURADORAS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>
        {error && (
          <p role="alert" className="text-sm font-semibold text-[#B91C1C]">
            {error}
          </p>
        )}
        <button type="submit" className="cm-boton cm-azul w-full">
          Ingresar muestra
        </button>
      </form>
    </Ventana>
  );
}

export function EnviarResultados({ clinica, alAvisar, alCerrar }: Comunes) {
  async function copiar(texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      alAvisar("Mensaje copiado.");
    } catch {
      alAvisar("No se pudo copiar el mensaje.", true);
    }
  }

  return (
    <Ventana titulo="Enviar resultados listos por WhatsApp" detalle="Abra WhatsApp y elija el chat de cada paciente." alCerrar={alCerrar}>
      {clinica.porEnviar.length === 0 && <p className="rounded-xl bg-[#F0FDF4] p-4 text-sm font-semibold text-[#166534]">Todos los resultados listos ya fueron avisados.</p>}
      <ul className="grid gap-4">
        {clinica.porEnviar.map((c) => {
          const paciente = clinica.paciente(c.pacienteId)!;
          const mensaje = avisoDeResultado(c, paciente);
          return (
            <li key={c.id} className="rounded-xl border border-[#DBE4F0] p-4">
              <p className="font-bold text-[#0F172A]">{paciente.nombre}</p>
              <p className="mt-2 rounded-xl bg-[#DCFCE7] p-3 text-sm text-[#14532D]">{mensaje}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={enlaceWhatsApp(mensaje)} target="_blank" rel="noopener noreferrer" onClick={() => marcarEnviado(c.id)} className="cm-boton cm-verde">
                  <MessageCircle size={16} aria-hidden /> Abrir WhatsApp
                </a>
                <button type="button" onClick={() => copiar(mensaje)} className="cm-boton cm-linea">
                  <Copy size={16} aria-hidden /> Copiar
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </Ventana>
  );
}

export function Cobrar({ clinica, cita, alAvisar, alCerrar }: Comunes & { cita: Cita }) {
  const paciente = clinica.paciente(cita.pacienteId);
  return (
    <Ventana titulo={`Cobrar ${qz(precioServicio(cita.servicioId))}`} detalle={`${paciente?.nombre} · ${nombreServicio(cita.servicioId)} · ${nombrePago(cita.pago)}`} alCerrar={alCerrar}>
      <p className="mb-2 text-sm font-bold text-[#0F172A]">¿Cómo pagó?</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {METODOS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              cobrar(cita.id, m);
              alAvisar(`Cobro registrado: ${qz(precioServicio(cita.servicioId))} en ${m}.`);
              alCerrar();
            }}
            className="cm-boton cm-linea"
          >
            {m}
          </button>
        ))}
      </div>
    </Ventana>
  );
}
