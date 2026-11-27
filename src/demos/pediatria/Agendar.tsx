/*
 * Agenda en vista dividida: a la izquierda se elige; a la derecha, un resumen que acompaña
 * al bajar suma el total, confirma la cita y prepara el mensaje de WhatsApp.
 */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, CalendarCheck, Check, CircleAlert, MessageCircle, X } from "lucide-react";
import { irA, useCifra } from "../hotel/animar";
import {
  JORNADAS, MOTIVOS, PEDIATRAS, TEL_EMERGENCIAS, diaCorto, enlaceWhatsApp, estaLibre, faltaEnCita, fechaLarga, formatoQ, hora12, horasDelDia,
  mayus, mensajeDeCita, mesCorto, mesesDe, mesesDeEdad, motivoPor, numeroDia, pediatraPor, proximosDias, totalCita, vacunaPor,
  type Cita, type Clinica, type MotivoId, type Paciente, type Unidad,
} from "./datos";

/* lo que se va armando desde otras secciones; "vez" cambia cuando alguien pide agendar */
export type Borrador = { motivo: MotivoId; pediatraId: string; meses: number | null; vez: number; pacienteId?: string };

type Props = {
  clinica: Clinica;
  borrador: Borrador;
  alCambiar: (cambio: Partial<Borrador>) => void;
  vacunas: string[];
  alQuitar: (id: string) => void;
  alVaciar: () => void;
};

export function Agendar({ clinica, borrador, alCambiar, vacunas, alQuitar, alVaciar }: Props) {
  const { motivo } = borrador;
  const [fechaElegida, setFecha] = useState("");
  const [horaElegida, setHora] = useState("");
  const [nino, setNino] = useState("");
  const [edad, setEdad] = useState("");
  const [unidad, setUnidad] = useState<Unidad>("meses");
  const [tutor, setTutor] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nota, setNota] = useState("");
  const [aviso, setAviso] = useState("");
  const [confirmadaId, setConfirmada] = useState<string | null>(null);

  // la calculadora manda la edad y el carné manda al hijo; cualquier pedido nuevo vuelve al resumen
  const [vez, setVez] = useState(borrador.vez);
  if (vez !== borrador.vez) {
    setVez(borrador.vez);
    if (borrador.meses !== null) {
      setEdad(String(borrador.meses));
      setUnidad("meses");
    }
    const hijo = clinica.pacientes.find((p) => p.id === borrador.pacienteId);
    if (hijo) llenarCon(hijo);
    setConfirmada(null);
    setAviso("");
  }

  const dias = proximosDias();
  const libresDe = (doc: string, fecha: string) => horasDelDia(fecha).filter((h) => estaLibre(clinica, doc, fecha, h));
  const pediatra = pediatraPor(borrador.pediatraId);
  // sin elección propia (o si ese día se llenó), se propone la primera fecha con espacio
  const fecha = fechaElegida && libresDe(pediatra.id, fechaElegida).length ? fechaElegida : (dias.find((d) => libresDe(pediatra.id, d).length) ?? "");
  const hora = fecha && horaElegida && libresDe(pediatra.id, fecha).includes(horaElegida) ? horaElegida : "";
  const total = totalCita(motivo, vacunas);
  const confirmada = vacunas.length === 0 ? (clinica.citas.find((c) => c.id === confirmadaId) ?? null) : null;

  /* cualquier cambio vuelve de la confirmación al resumen */
  function elegir(cambio: () => void) {
    cambio();
    setConfirmada(null);
    setAviso("");
  }

  /* un hijo que ya está en el carné: no hay que volver a escribir sus datos */
  function llenarCon(p: Paciente) {
    const m = mesesDe(p.nacimiento);
    setNino(p.nombre);
    setEdad(String(m < 24 ? m : Math.floor(m / 12)));
    setUnidad(m < 24 ? "meses" : "años");
    setTutor(p.tutor);
    setTelefono(p.telefono);
  }

  function confirmar(e?: FormEvent) {
    e?.preventDefault();
    const falta = faltaEnCita({ fecha, hora, nino, edad, unidad, tutor, telefono });
    if (falta) {
      setAviso(falta[1]);
      const campo = document.getElementById(falta[0] === "hora" ? "pa-paso-hora" : `pa-${falta[0]}`);
      campo?.scrollIntoView({ block: "center", behavior: "smooth" });
      if (campo instanceof HTMLInputElement) campo.focus({ preventScroll: true });
      return;
    }
    const id = clinica.agendar({
      fecha, hora, pediatraId: pediatra.id, motivo, vacunas, nota: motivo === "sintomas" ? nota : "",
      nino, meses: mesesDeEdad(edad, unidad)!, tutor, telefono, origen: "portal",
    });
    setConfirmada(id);
    setAviso("");
    setHora("");
    setNota("");
    alVaciar();
    window.setTimeout(() => document.getElementById("pa-tarjeta")?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 60);
  }

  return (
    <section id="pa-agenda" className="pa-seccion pa-salvia">
      <div className="pa-ancho">
        <div className="pa-titulo">
          <h2>Agende su cita</h2>
          <p>Elija el motivo, el pediatra y la hora. El resumen con el total le acompaña mientras completa los datos.</p>
        </div>
        <div className="pa-dividida">
          <form className="pa-pasos" onSubmit={confirmar} noValidate>
            <div className="pa-paso">
              <h3>
                <span>1</span> Motivo de la cita
              </h3>
              <div className="pa-opciones" role="radiogroup" aria-label="Motivo">
                {MOTIVOS.map((m) => (
                  <label key={m.id} className="pa-opcion">
                    <input type="radio" name="pa-motivo" checked={motivo === m.id} onChange={() => elegir(() => alCambiar({ motivo: m.id }))} />
                    <span>
                      <strong>{m.nombre}</strong>
                      <small>{m.detalle}</small>
                    </span>
                    <b>{formatoQ(m.precio)}</b>
                  </label>
                ))}
              </div>
              {motivo === "sintomas" && (
                <>
                  <p className="pa-urgente">
                    <CircleAlert size={17} aria-hidden />
                    <span>
                      Si su bebé tiene menos de 3 meses y fiebre, o le cuesta respirar, no espere la cita: llame a emergencias ({TEL_EMERGENCIAS}).
                    </span>
                  </p>
                  <label className="pa-campo">
                    <span>¿Qué síntomas tiene y desde cuándo? (opcional)</span>
                    <textarea rows={3} value={nota} onChange={(e) => elegir(() => setNota(e.target.value))} placeholder="Fiebre desde anoche, tos" />
                  </label>
                </>
              )}
              {vacunas.length > 0 ? (
                <div>
                  <p className="pa-suave">Vacunas agregadas a esta cita:</p>
                  <ul className="pa-fichas">
                    {vacunas.map((id) => (
                      <li key={id}>
                        {vacunaPor(id).nombre}
                        <button type="button" aria-label={`Quitar ${vacunaPor(id).nombre}`} onClick={() => alQuitar(id)}>
                          <X size={15} aria-hidden />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                motivo === "vacunacion" && (
                  <p>
                    <button type="button" className="pa-enlace" onClick={() => irA("pa-vacunas")}>
                      Elegir las vacunas en el esquema por edad
                    </button>
                  </p>
                )
              )}
            </div>

            <div className="pa-paso">
              <h3>
                <span>2</span> Pediatra
              </h3>
              <div className="pa-opciones" role="radiogroup" aria-label="Pediatra">
                {PEDIATRAS.map((p) => (
                  <label key={p.id} className="pa-opcion">
                    <input type="radio" name="pa-pediatra" checked={pediatra.id === p.id} onChange={() => elegir(() => alCambiar({ pediatraId: p.id }))} />
                    <img src={p.foto} alt="" loading="lazy" />
                    <span>
                      <strong>{p.nombre}</strong>
                      <small>{p.area}</small>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pa-paso" id="pa-paso-hora">
              <h3>
                <span>3</span> Fecha y hora
              </h3>
              <div className="pa-fechas" role="group" aria-label="Fecha">
                {dias.map((d) => (
                  <button key={d} type="button" aria-pressed={fecha === d} disabled={!libresDe(pediatra.id, d).length} aria-label={fechaLarga(d)} onClick={() => elegir(() => setFecha(d))}>
                    <span>{diaCorto(d)}</span>
                    <strong>{numeroDia(d)}</strong>
                    <span>{mesCorto(d)}</span>
                  </button>
                ))}
              </div>
              {fecha ? (
                JORNADAS.map((j) => {
                  const horas = j.horas.filter((h) => horasDelDia(fecha).includes(h));
                  if (!horas.length) return null;
                  return (
                    <div key={j.nombre} className="pa-jornada">
                      <p>{j.nombre}</p>
                      <div className="pa-horas" role="group" aria-label={j.nombre}>
                        {horas.map((h) => (
                          <button key={h} type="button" aria-pressed={hora === h} disabled={!estaLibre(clinica, pediatra.id, fecha, h)} onClick={() => elegir(() => { setFecha(fecha); setHora(h); })}>
                            {hora12(h)}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="pa-suave">No quedan horarios en estos días con este pediatra. Pruebe con otro.</p>
              )}
            </div>

            <div className="pa-paso">
              <h3>
                <span>4</span> Datos del paciente
              </h3>
              <div className="pa-fichas pa-elegir-hijo" role="group" aria-label="Llenar con los datos de un hijo registrado">
                {clinica.pacientes
                  .filter((p) => p.familia)
                  .map((p) => (
                    <button key={p.id} type="button" aria-pressed={nino === p.nombre} onClick={() => elegir(() => llenarCon(p))}>
                      {p.nombre}
                    </button>
                  ))}
              </div>
              <div className="pa-dos">
                <label className="pa-campo">
                  <span>Nombre del niño o niña</span>
                  <input id="pa-nino" value={nino} autoComplete="off" onChange={(e) => elegir(() => setNino(e.target.value))} />
                </label>
                <div className="pa-campo">
                  <span>Edad</span>
                  <div className="pa-edad">
                    <input id="pa-edad" aria-label="Edad en números" inputMode="numeric" value={edad} onChange={(e) => elegir(() => setEdad(e.target.value.replace(/\D/g, "")))} />
                    <select aria-label="Meses o años" value={unidad} onChange={(e) => elegir(() => setUnidad(e.target.value as Unidad))}>
                      <option value="meses">meses</option>
                      <option value="años">años</option>
                    </select>
                  </div>
                </div>
                <label className="pa-campo">
                  <span>Mamá, papá o encargado</span>
                  <input id="pa-tutor" value={tutor} autoComplete="name" onChange={(e) => elegir(() => setTutor(e.target.value))} />
                </label>
                <label className="pa-campo">
                  <span>Teléfono</span>
                  <input id="pa-telefono" type="tel" inputMode="tel" value={telefono} autoComplete="tel" onChange={(e) => elegir(() => setTelefono(e.target.value))} />
                </label>
              </div>
            </div>
            <button type="submit" className="pa-oculto" tabIndex={-1}>
              Confirmar cita
            </button>
          </form>

          <Resumen
            confirmada={confirmada}
            clinica={clinica}
            motivo={motivo}
            pediatra={pediatra.nombre}
            fecha={fecha}
            hora={hora}
            nino={nino.trim()}
            vacunas={vacunas}
            total={total}
            aviso={aviso}
            alConfirmar={() => confirmar()}
            alOtra={() => setConfirmada(null)}
          />
        </div>
      </div>
      <Barra total={confirmada ? null : total} />
    </section>
  );
}

type ResumenProps = {
  confirmada: Cita | null; clinica: Clinica; motivo: MotivoId; pediatra: string; fecha: string; hora: string;
  nino: string; vacunas: string[]; total: number; aviso: string; alConfirmar: () => void; alOtra: () => void;
};

function Resumen({ confirmada, clinica, motivo, pediatra, fecha, hora, nino, vacunas, total, aviso, alConfirmar, alOtra }: ResumenProps) {
  const mostrado = confirmada ? totalCita(confirmada.motivo, confirmada.vacunas) : total;

  if (confirmada) {
    const paciente = clinica.pacientes.find((p) => p.id === confirmada.pacienteId);
    const lista = confirmada.vacunas.map((id) => vacunaPor(id).nombre).join(", ");
    const mensaje = mensajeDeCita(confirmada, paciente);
    return (
      <aside id="pa-tarjeta" className="pa-tarjeta" aria-live="polite">
        <span className="pa-sello">
          <Check size={26} aria-hidden />
        </span>
        <h3>Cita apartada</h3>
        <p className="pa-folio">Número {confirmada.id}</p>
        <dl className="pa-resumen">
          <Dato t="Paciente" d={paciente?.nombre ?? ""} />
          <Dato t="Motivo" d={motivoPor(confirmada.motivo).nombre} />
          <Dato t="Pediatra" d={pediatraPor(confirmada.pediatraId).nombre} />
          <Dato t="Fecha" d={mayus(fechaLarga(confirmada.fecha))} />
          <Dato t="Hora" d={hora12(confirmada.hora)} />
          {lista && <Dato t="Vacunas" d={lista} />}
        </dl>
        <p className="pa-total">
          <span>Total estimado</span>
          <strong>{formatoQ(mostrado)}</strong>
        </p>
        <a className="pa-btn pa-cita pa-lleno" href={enlaceWhatsApp(mensaje)} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={18} aria-hidden /> Enviar confirmación por WhatsApp
        </a>
        <button type="button" className="pa-btn pa-claro pa-lleno" onClick={alOtra}>
          Agendar otra cita
        </button>
        <p className="pa-nota">Traiga el carné de vacunas y llegue 10 minutos antes.</p>
      </aside>
    );
  }

  return (
    <aside id="pa-tarjeta" className="pa-tarjeta">
      <h3>Resumen de su cita</h3>
      <dl className="pa-resumen">
        <Dato t="Paciente" d={nino || "Por completar"} />
        <Dato t="Pediatra" d={pediatra} />
        <Dato t="Fecha" d={fecha ? mayus(fechaLarga(fecha)) : "Sin horarios"} />
        <Dato t="Hora" d={hora ? hora12(hora) : "Por elegir"} />
      </dl>
      <dl className="pa-cargos">
        <Dato t={motivoPor(motivo).nombre} d={formatoQ(motivoPor(motivo).precio)} />
        {vacunas.map((id) => (
          <Dato key={id} t={vacunaPor(id).nombre} d={formatoQ(vacunaPor(id).precio)} />
        ))}
      </dl>
      <p className="pa-total">
        <span>Total estimado</span>
        <Cifra valor={total} />
      </p>
      {aviso && (
        <p className="pa-aviso" role="alert">
          <CircleAlert size={16} aria-hidden /> {aviso}
        </p>
      )}
      <button type="button" className="pa-btn pa-cita pa-lleno" onClick={alConfirmar}>
        <CalendarCheck size={18} aria-hidden /> Confirmar cita
      </button>
      <p className="pa-nota">Se paga en la clínica. Puede cambiar su cita sin costo hasta 12 horas antes.</p>
    </aside>
  );
}

/* el total cuenta hasta su nuevo valor */
function Cifra({ valor }: { valor: number }) {
  const ref = useRef<HTMLElement>(null);
  const [inicial] = useState(valor);
  useCifra(ref, valor, formatoQ);
  return <strong ref={ref}>{formatoQ(inicial)}</strong>;
}

function Dato({ t, d }: { t: string; d: string }) {
  return (
    <div>
      <dt>{t}</dt>
      <dd>{d}</dd>
    </div>
  );
}

/* en celular: el total a la vista mientras se llena la agenda y el resumen queda abajo */
function Barra({ total }: { total: number | null }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const seccion = document.getElementById("pa-agenda");
    const tarjeta = document.getElementById("pa-tarjeta");
    if (!seccion || !tarjeta) return;
    let enSeccion = false;
    let enTarjeta = false;
    const ojo = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.target === seccion) enSeccion = e.isIntersecting;
        else enTarjeta = e.isIntersecting;
      }
      setVisible(enSeccion && !enTarjeta);
    });
    ojo.observe(seccion);
    ojo.observe(tarjeta);
    return () => ojo.disconnect();
  }, []);
  return (
    <div className="pa-barra" data-visible={visible && total !== null}>
      <p>
        <span>Total estimado</span>
        <strong>{formatoQ(total ?? 0)}</strong>
      </p>
      <button type="button" className="pa-btn pa-chico pa-cita" onClick={() => irA("pa-tarjeta")}>
        Ver resumen <ArrowDown size={16} aria-hidden />
      </button>
    </div>
  );
}
