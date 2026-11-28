import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";
import { IDS_SERVICIO, MEDICOS, SERVICIOS, VACUNAS, aplicaA, fechaCorta, fechaRelativa, hora12, hoyIso, qz, sumarMeses, type Especie, type ServicioId } from "./datos";
import { horasLibres, type ClinicaViva, type Recordatorio } from "./estado";
import { Retrato, SelectorEspecie, Ventana } from "./Piezas";

type Props = { clinica: ClinicaViva; alCerrar: () => void; alAvisar: (texto: string) => void };

function OpcionesDeHora({ horas }: { horas: string[] }) {
  return horas.map((h) => (
    <option key={h} value={h}>
      {hora12(h)}
    </option>
  ));
}

export function PacienteNuevo({ clinica, alCerrar, alAvisar }: Props) {
  const [datos, setDatos] = useState({ nombre: "", especie: "perro" as Especie, raza: "", dueno: "", telefono: "" });
  const [elegida, setElegida] = useState<string | null>(null);
  const libres = horasLibres(clinica.citas, "consulta", hoyIso());
  const hora = elegida === "" || (elegida && libres.includes(elegida)) ? elegida : (libres[0] ?? "");
  const completo = datos.nombre.trim() && datos.dueno.trim() && datos.telefono.trim();

  function guardar(e: FormEvent) {
    e.preventDefault();
    const mascota = clinica.registrarPaciente(datos, hora ?? "");
    alAvisar(`${mascota.nombre} quedó registrado${hora ? ` y en la agenda a las ${hora12(hora)}` : ""}.`);
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
              <OpcionesDeHora horas={libres} />
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
  const [fecha, setFecha] = useState(hoyIso());
  const [elegida, setElegida] = useState("");
  const mascota = clinica.mascota(mascotaId) ?? clinica.mascotas[0];
  const servicio = aplicaA(paquete, mascota.especie) ? paquete : "bano-pequeno";
  const libres = horasLibres(clinica.citas, "grooming", fecha);
  const hora = libres.includes(elegida) ? elegida : (libres[0] ?? "");

  function guardar(e: FormEvent) {
    e.preventDefault();
    const cita = clinica.agendar({ nombre: mascota.nombre, especie: mascota.especie, servicio, fecha, hora }, { mascotaId: mascota.id });
    if (!cita) return;
    alAvisar(`Grooming de ${mascota.nombre}: ${fechaRelativa(fecha).toLowerCase()} a las ${hora12(hora)}.`);
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
        <div className="grid grid-cols-2 gap-3">
          <label className="block min-w-0">
            <span className="hv-rotulo">Fecha</span>
            <input type="date" value={fecha} min={hoyIso()} onChange={(e) => setFecha(e.target.value)} className="hv-campo !px-2.5" />
          </label>
          <label className="block min-w-0">
            <span className="hv-rotulo">Horario libre</span>
            <select value={hora} onChange={(e) => setElegida(e.target.value)} disabled={!libres.length} className="hv-campo">
              {libres.length ? <OpcionesDeHora horas={libres} /> : <option value="">Sin horarios</option>}
            </select>
          </label>
        </div>
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

export function VacunaAplicada({ clinica, alCerrar, alAvisar }: Props) {
  const enAtencion = clinica.citasHoy.find((c) => c.estado === "atencion" && SERVICIOS[c.servicio].area === "consulta");
  const [mascotaId, setMascotaId] = useState(enAtencion?.mascotaId ?? clinica.mascotas[0].id);
  const [elegida, setElegida] = useState("");
  const [medico, setMedico] = useState(MEDICOS[0]);
  const [peso, setPeso] = useState("");
  const mascota = clinica.mascota(mascotaId) ?? clinica.mascotas[0];
  const vacuna = VACUNAS[mascota.especie].find((v) => v.nombre === elegida) ?? VACUNAS[mascota.especie][0];
  const kg = Number(peso.replace(",", "."));
  const pesoValido = !peso.trim() || (kg > 0 && kg < 120);

  function guardar(e: FormEvent) {
    e.preventDefault();
    clinica.registrarVacuna(mascota.id, vacuna.nombre, medico, peso.trim() ? Math.round(kg * 10) / 10 : null);
    alAvisar(`${vacuna.nombre} anotada en el expediente de ${mascota.nombre}.`);
    alCerrar();
  }

  return (
    <Ventana titulo="Registrar vacuna aplicada" alCerrar={alCerrar}>
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
        <label className="block min-w-0">
          <span className="hv-rotulo">Aplicación</span>
          <select value={vacuna.nombre} onChange={(e) => setElegida(e.target.value)} className="hv-campo">
            {VACUNAS[mascota.especie].map((v) => (
              <option key={v.nombre}>{v.nombre}</option>
            ))}
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block min-w-0">
            <span className="hv-rotulo">Médico</span>
            <select value={medico} onChange={(e) => setMedico(e.target.value)} className="hv-campo">
              {MEDICOS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <label className="block min-w-0">
            <span className="hv-rotulo">Peso en kg (opcional)</span>
            <input value={peso} onChange={(e) => setPeso(e.target.value)} inputMode="decimal" placeholder="Ej. 12.5" aria-invalid={!pesoValido} className="hv-campo tabular-nums" />
          </label>
        </div>
        {!pesoValido && (
          <p role="alert" className="text-sm font-bold text-[#B91C1C]">
            Escribe el peso en kilos, por ejemplo 12.5.
          </p>
        )}
        <p className="rounded-2xl bg-[#F0FDFA] p-4 text-sm font-semibold text-[#115E59]">Próximo refuerzo: {fechaCorta(sumarMeses(hoyIso(), vacuna.meses))}</p>
        <button type="submit" disabled={!pesoValido} className="hv-boton hv-turquesa">
          Guardar en el expediente
        </button>
      </form>
    </Ventana>
  );
}
