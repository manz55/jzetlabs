import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";
import { horasLibres } from "./agenda";
import { CamposHorario } from "./CamposHorario";
import { IDS_SERVICIO, SERVICIOS, aplicaA, fechaCorta, fechaRelativa, hora12, hoyIso, qz, type Cita, type Especie, type ServicioId } from "./datos";
import type { ClinicaViva } from "./estado";
import type { Recordatorio } from "./expediente";
import { SelectorEspecie, Ventana } from "./Piezas";
import { useHorario } from "./useHorario";

type Props = { clinica: ClinicaViva; alCerrar: () => void; alAvisar: (texto: string) => void };

export function PacienteNuevo({ clinica, alCerrar, alAvisar }: Props) {
  const [datos, setDatos] = useState({ nombre: "", especie: "perro" as Especie, raza: "", dueno: "", telefono: "" });
  const [elegida, setElegida] = useState<string | null>(null);
  const libres = horasLibres(clinica, "consulta", hoyIso());
  const hora = elegida === "" || (elegida && libres.includes(elegida)) ? elegida : (libres[0] ?? "");
  const completo = datos.nombre.trim() && datos.dueno.trim() && datos.telefono.trim();

  function guardar(e: FormEvent) {
    e.preventDefault();
    const mascota = clinica.registrarPaciente(datos, hora ?? "");
    alAvisar(`${mascota.nombre} quedó registrado${hora ? ` · agenda de hoy, ${hora12(hora)}` : ""}`);
    alCerrar();
  }

  const campo = (clave: "nombre" | "raza" | "dueno" | "telefono", rotulo: string, extra: { placeholder: string; inputMode?: "tel" }) => (
    <label className="block min-w-0">
      <span className="hv-rotulo">{rotulo}</span>
      <input value={datos[clave]} onChange={(e) => setDatos({ ...datos, [clave]: e.target.value })} maxLength={40} autoComplete="off" className="hv-campo" {...extra} />
    </label>
  );

  return (
    <Ventana titulo="Registrar paciente nuevo" alCerrar={alCerrar}>
      <form onSubmit={guardar} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {campo("nombre", "Nombre de la mascota", { placeholder: "Ej. Canela" })}
          <SelectorEspecie valor={datos.especie} alElegir={(especie) => setDatos({ ...datos, especie })} />
          {campo("raza", "Raza (opcional)", { placeholder: "Ej. Criollo" })}
          {campo("dueno", "Nombre del dueño", { placeholder: "Nombre y apellido" })}
          {campo("telefono", "Teléfono", { placeholder: "0000 0000", inputMode: "tel" })}
          <label className="block min-w-0">
            <span className="hv-rotulo">Consulta de hoy</span>
            <select value={hora ?? ""} onChange={(e) => setElegida(e.target.value)} className="hv-campo">
              <option value="">Solo abrir ficha</option>
              {libres.map((h) => (
                <option key={h} value={h}>
                  {hora12(h)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" disabled={!completo} className="hv-boton hv-turquesa">
          Guardar paciente
        </button>
      </form>
    </Ventana>
  );
}

export function CitaGrooming({ clinica, alCerrar, alAvisar }: Props) {
  const [mascotaId, setMascotaId] = useState(clinica.mascotas[0].id);
  const [paquete, setPaquete] = useState<ServicioId>("bano-pequeno");
  const horario = useHorario(clinica, "grooming");
  const { fecha, hora } = horario;
  const mascota = clinica.mascota(mascotaId) ?? clinica.mascotas[0];
  const servicio = aplicaA(paquete, mascota.especie) ? paquete : "bano-pequeno";

  function guardar(e: FormEvent) {
    e.preventDefault();
    const cita = clinica.agendar({ nombre: mascota.nombre, especie: mascota.especie, servicio, fecha, hora }, { mascotaId: mascota.id });
    if (!cita) return;
    alAvisar(`Grooming de ${mascota.nombre}: ${fechaRelativa(fecha).toLowerCase()}, ${hora12(hora)}`);
    alCerrar();
  }

  return (
    <Ventana titulo="Nueva cita de grooming" alCerrar={alCerrar}>
      <form onSubmit={guardar} className="grid gap-4">
        <label className="block min-w-0">
          <span className="hv-rotulo">Paciente</span>
          <select value={mascota.id} onChange={(e) => setMascotaId(e.target.value)} className="hv-campo">
            {clinica.mascotas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} · {m.dueno}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-0">
          <span className="hv-rotulo">Paquete</span>
          <select value={servicio} onChange={(e) => setPaquete(e.target.value as ServicioId)} className="hv-campo">
            {IDS_SERVICIO.filter((id) => SERVICIOS[id].area === "grooming" && aplicaA(id, mascota.especie)).map((id) => (
              <option key={id} value={id}>
                {SERVICIOS[id].nombre} {qz(SERVICIOS[id].precio)}
              </option>
            ))}
          </select>
        </label>
        <CamposHorario horario={horario} />
        <button type="submit" disabled={!hora} className="hv-boton hv-turquesa">
          Agregar a la agenda
        </button>
      </form>
    </Ventana>
  );
}

const mensajeRecordatorio = (r: Recordatorio) =>
  `Hola, ${r.mascota.dueno.split(" ")[0]}. En Huella Vital vemos que a ${r.mascota.nombre} le toca ${r.vacuna} el ${fechaCorta(r.proxima)}. ¿Te apartamos un horario?`;

export function Recordatorios({ clinica, alCerrar, alAvisar }: Props) {
  const sinEnviar = clinica.porVencer.filter((r) => !r.enviado);

  function enviar(lista: Recordatorio[]) {
    clinica.marcarRecordados(lista.map((r) => r.clave));
    alAvisar(lista.length === 1 ? `Recordatorio enviado a ${lista[0].mascota.dueno}.` : `${lista.length} recordatorios enviados por WhatsApp.`);
  }

  return (
    <Ventana titulo="Recordatorios de vacunas por WhatsApp" alCerrar={alCerrar}>
      {clinica.porVencer.length ? (
        <>
          <ul className="grid gap-3">
            {clinica.porVencer.map((r) => (
              <li key={r.clave} className="rounded-2xl border border-[#E2E8F0] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-extrabold text-[#0F172A]">
                    {r.mascota.dueno} · {r.mascota.telefono}
                  </p>
                  {r.enviado ? (
                    <span className="hv-chip hv-chip-bien">
                      <Check size={13} aria-hidden /> Enviado
                    </span>
                  ) : (
                    <button type="button" onClick={() => enviar([r])} aria-label={`Enviar recordatorio a ${r.mascota.dueno}`} className="hv-boton hv-linea">
                      Enviar
                    </button>
                  )}
                </div>
                <p className="mt-3 rounded-[1rem_1rem_1rem_0.25rem] bg-[#DCF8C6] px-3.5 py-2.5 text-sm text-[#111B21]">{mensajeRecordatorio(r)}</p>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => enviar(sinEnviar)} disabled={!sinEnviar.length} className="hv-boton hv-turquesa mt-5 w-full">
            <Send size={17} aria-hidden /> {sinEnviar.length ? `Enviar ${sinEnviar.length} pendientes` : "Todos enviados"}
          </button>
        </>
      ) : (
        <p className="text-sm">No hay vacunas por vencer en los próximos 7 días.</p>
      )}
    </Ventana>
  );
}

export function ProponerHora({ clinica, cita, alCerrar, alAvisar }: Props & { cita: Cita }) {
  const mascota = clinica.mascota(cita.mascotaId);
  const horario = useHorario(clinica, SERVICIOS[cita.servicio].area, { exceptoId: cita.id, omitir: cita.solicitud });

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!clinica.proponerHorario(cita.id, { fecha: horario.fecha, hora: horario.hora })) return;
    alAvisar(`Propuesta enviada a ${mascota?.dueno}.`);
    alCerrar();
  }

  return (
    <Ventana titulo="Proponer otra hora" alCerrar={alCerrar}>
      <form onSubmit={enviar} className="grid gap-4">
        <p className="text-sm">
          {mascota?.nombre} · {SERVICIOS[cita.servicio].nombre}
          {cita.solicitud && (
            <span className="block font-bold text-[#0F172A]">
              Pidió: {fechaRelativa(cita.solicitud.fecha)} · {hora12(cita.solicitud.hora)}
            </span>
          )}
        </p>
        <CamposHorario horario={horario} />
        <button type="submit" disabled={!horario.hora} className="hv-boton hv-turquesa">
          Enviar propuesta
        </button>
      </form>
    </Ventana>
  );
}
