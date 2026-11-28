import { useState, type FormEvent } from "react";
import { porConfirmar } from "./agenda";
import { CamposHorario } from "./CamposHorario";
import { CLIENTA, IDS_SERVICIO, SERVICIOS, aplicaA, fechaRelativa, hora12, qz, type Cita, type Especie, type ServicioId } from "./datos";
import type { ClinicaViva } from "./estado";
import { SelectorEspecie, Ventana } from "./Piezas";
import { useHorario } from "./useHorario";

type Props = { clinica: ClinicaViva; alCerrar: () => void; alAvisar: (texto: string, alerta?: boolean) => void };

export function AgregarMascota({ clinica, alCerrar, alAvisar, alAgregar }: Props & { alAgregar: (id: string) => void }) {
  const [datos, setDatos] = useState({ nombre: "", especie: "perro" as Especie, raza: "", edad: "", kg: "", notas: "" });
  const kg = Number(datos.kg.replace(",", "."));
  const pesoValido = !datos.kg.trim() || (kg > 0 && kg < 120);
  const repetida = clinica.mascotas.some(
    (m) => m.dueno === CLIENTA.nombre && m.especie === datos.especie && m.nombre.localeCompare(datos.nombre.trim(), "es", { sensitivity: "base" }) === 0,
  );

  function guardar(e: FormEvent) {
    e.preventDefault();
    const mascota = clinica.agregarMascota({ ...datos, kg: datos.kg.trim() ? Math.round(kg * 10) / 10 : null });
    alAgregar(mascota.id);
    alAvisar(`${mascota.nombre} ya tiene expediente ${mascota.expediente}.`);
    alCerrar();
  }

  const campo = (clave: "nombre" | "raza" | "edad" | "kg", rotulo: string, placeholder: string) => (
    <label className="block min-w-0">
      <span className="hv-rotulo">{rotulo}</span>
      <input value={datos[clave]} onChange={(e) => setDatos({ ...datos, [clave]: e.target.value })} maxLength={24} autoComplete="off" inputMode={clave === "kg" ? "decimal" : undefined} placeholder={placeholder} className="hv-campo" />
    </label>
  );

  return (
    <Ventana titulo="Agregar mascota" alCerrar={alCerrar}>
      <form onSubmit={guardar} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {campo("nombre", "Nombre", "Ej. Canela")}
          <SelectorEspecie valor={datos.especie} alElegir={(especie) => setDatos({ ...datos, especie })} />
          {campo("raza", "Raza (opcional)", "Ej. Criollo")}
          {campo("edad", "Edad (opcional)", "Ej. 2 años")}
          {campo("kg", "Peso en kg (opcional)", "Ej. 8.5")}
        </div>
        <label className="block min-w-0">
          <span className="hv-rotulo">Alergias o notas de manejo (opcional)</span>
          <textarea value={datos.notas} onChange={(e) => setDatos({ ...datos, notas: e.target.value })} maxLength={200} rows={2} placeholder="Ej. Se asusta con ruidos fuertes" className="hv-campo !h-auto py-2.5" />
        </label>
        {(repetida || !pesoValido) && (
          <p role="alert" className="text-sm font-bold text-[#B91C1C]">
            {repetida ? `Ya tienes una mascota llamada ${datos.nombre.trim()}.` : "Escribe el peso en kilos, por ejemplo 8.5."}
          </p>
        )}
        <button type="submit" disabled={!datos.nombre.trim() || repetida || !pesoValido} className="hv-boton hv-turquesa">
          Guardar mascota
        </button>
      </form>
    </Ventana>
  );
}

export function SolicitarCita({ clinica, alCerrar, alAvisar, mascotaInicial, alSolicitar }: Props & { mascotaInicial: string; alSolicitar: (cita: Cita) => void }) {
  const propias = clinica.mascotas.filter((m) => m.dueno === CLIENTA.nombre);
  const [mascotaId, setMascotaId] = useState(mascotaInicial);
  const [elegido, setElegido] = useState<ServicioId>("consulta");
  const mascota = propias.find((m) => m.id === mascotaId) ?? propias[0];
  const servicio = aplicaA(elegido, mascota.especie) ? elegido : "consulta";
  const horario = useHorario(clinica, SERVICIOS[servicio].area);

  function enviar(e: FormEvent) {
    e.preventDefault();
    const cita = clinica.agendar({ nombre: mascota.nombre, especie: mascota.especie, servicio, fecha: horario.fecha, hora: horario.hora }, { mascotaId: mascota.id, porAprobar: true });
    if (!cita) {
      alAvisar("Ese horario ya no está disponible. Elige otro.", true);
      return;
    }
    alSolicitar(cita);
    alAvisar("Solicitud enviada. La clínica confirma el horario.");
    alCerrar();
  }

  return (
    <Ventana titulo="Solicitar cita o grooming" alCerrar={alCerrar}>
      <form onSubmit={enviar} className="grid gap-4">
        <label className="block min-w-0">
          <span className="hv-rotulo">Mascota</span>
          <select value={mascota.id} onChange={(e) => setMascotaId(e.target.value)} className="hv-campo">
            {propias.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} · {m.raza}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-0">
          <span className="hv-rotulo">Servicio</span>
          <select value={servicio} onChange={(e) => setElegido(e.target.value as ServicioId)} className="hv-campo">
            {IDS_SERVICIO.filter((id) => aplicaA(id, mascota.especie)).map((id) => (
              <option key={id} value={id}>
                {SERVICIOS[id].nombre} {qz(SERVICIOS[id].precio)}
              </option>
            ))}
          </select>
        </label>
        <CamposHorario horario={horario} rotuloFecha="Fecha preferida" rotuloHora="Hora preferida" />
        <button type="submit" disabled={!horario.hora} className="hv-boton hv-turquesa">
          Enviar solicitud
        </button>
        <p className="text-center text-xs font-semibold text-[#64748B]">La cita queda pendiente hasta que la clínica la confirme.</p>
      </form>
    </Ventana>
  );
}

export function PedirCambio({ clinica, cita, alCerrar, alAvisar }: Props & { cita: Cita }) {
  const horario = useHorario(clinica, SERVICIOS[cita.servicio].area, { exceptoId: cita.id, omitir: cita });
  const nueva = porConfirmar(cita);

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!clinica.pedirHorario(cita.id, { fecha: horario.fecha, hora: horario.hora })) {
      alAvisar("Ese horario ya no está disponible. Elige otro.", true);
      return;
    }
    alAvisar("Enviado. La clínica confirma tu nuevo horario.");
    alCerrar();
  }

  return (
    <Ventana titulo="Solicitar cambio de horario" alCerrar={alCerrar}>
      <form onSubmit={enviar} className="grid gap-4">
        <p className="rounded-2xl bg-[#F8FAFC] p-4 text-sm">
          {SERVICIOS[cita.servicio].nombre}
          <span className="block font-bold text-[#0F172A]">
            {nueva ? "Pediste" : "Horario actual"}: {fechaRelativa(cita.fecha)} · {hora12(cita.hora)}
          </span>
        </p>
        <CamposHorario horario={horario} rotuloFecha="Fecha preferida" rotuloHora="Hora preferida" />
        <button type="submit" disabled={!horario.hora} className="hv-boton hv-turquesa">
          Enviar a la clínica
        </button>
        {!nueva && <p className="text-center text-xs font-semibold text-[#64748B]">Tu cita actual se mantiene hasta que la clínica apruebe el cambio.</p>}
      </form>
    </Ventana>
  );
}
