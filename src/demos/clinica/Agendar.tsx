/*
 * Agenda en vista dividida: a la izquierda se elige; a la derecha, una tarjeta que acompaña
 * al bajar calcula el total, confirma la cita y prepara el mensaje de WhatsApp.
 */
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowDown, CalendarCheck, Check, CircleAlert, MessageCircle } from "lucide-react";
import { irA, useCifra } from "../hotel/animar";
import {
  COMPLEMENTOS, ESPECIALIDADES, ODONTOLOGOS, PACIENTE_SESION, bloques, diaCorto, enlaceWhatsApp, fechaLarga, formatoQ, hora12,
  mayus, mesCorto, minutosDe, nombreDe, odontologoPor, proximosDias, totalDe,
  type Cita, type Clinica,
} from "./datos";

/* lo que otra sección pide agendar; "vez" cambia en cada pedido */
export type Pedido = { tratamientoId: string; doctorId?: string; fecha?: string; hora?: string; planId?: string; nombre?: string; vez: number };

export function Agendar({ clinica, pedido }: { clinica: Clinica; pedido: Pedido }) {
  const [tratamientoId, setTratamiento] = useState(pedido.tratamientoId);
  const [doctorElegido, setDoctor] = useState("");
  const [fechaElegida, setFecha] = useState("");
  const [horaElegida, setHora] = useState("");
  const [complementos, setComplementos] = useState<string[]>([]);
  const [mesesElegidos, setMeses] = useState(1);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [planId, setPlan] = useState<string | undefined>();
  const [aviso, setAviso] = useState("");
  const [confirmadaId, setConfirmada] = useState<string | null>(null);

  // llega un pedido desde el catálogo, un especialista o el plan de tratamiento
  const [vez, setVez] = useState(pedido.vez);
  if (vez !== pedido.vez) {
    setVez(pedido.vez);
    setTratamiento(pedido.tratamientoId);
    if (pedido.doctorId) setDoctor(pedido.doctorId);
    setFecha(pedido.fecha ?? "");
    setHora(pedido.hora ?? "");
    setPlan(pedido.planId);
    if (pedido.nombre) setNombre(pedido.nombre);
    setConfirmada(null);
    setAviso("");
  }

  const tratamiento = clinica.tratamientos.find((t) => t.id === tratamientoId) ?? clinica.tratamientos[0];
  const minutos = minutosDe(tratamiento.id, complementos);
  const elegibles = ODONTOLOGOS.filter((o) => o.atiende.includes(tratamiento.especialidad));
  const dias = proximosDias();
  const libresDe = (doc: string, fecha: string) => bloques(clinica.citas, fecha, doc, minutos).filter((b) => b.libre);
  // sin elección propia, se propone quien tenga espacio en la fecha pedida
  const doctor =
    elegibles.find((o) => o.id === doctorElegido) ??
    elegibles.find((o) => fechaElegida && libresDe(o.id, fechaElegida).some((b) => !horaElegida || b.hora === horaElegida)) ??
    elegibles[0];
  const fecha = dias.includes(fechaElegida) && libresDe(doctor.id, fechaElegida).length ? fechaElegida : (dias.find((d) => libresDe(doctor.id, d).length) ?? "");
  const horas = fecha ? bloques(clinica.citas, fecha, doctor.id, minutos) : [];
  const hora = horas.some((b) => b.hora === horaElegida && b.libre) ? horaElegida : "";
  const meses = tratamiento.cuotas?.includes(mesesElegidos) ? mesesElegidos : 1;
  const total = totalDe(clinica.precios, tratamiento.id, complementos);
  const confirmada = clinica.citas.find((c) => c.id === confirmadaId) ?? null;

  /* cualquier cambio vuelve de la confirmación al resumen */
  function elegir(cambio: () => void) {
    cambio();
    setConfirmada(null);
    setAviso("");
  }

  function confirmar(e: FormEvent) {
    e.preventDefault();
    const digitos = telefono.replace(/\D/g, "");
    const falta = !hora ? "Elija un bloque de hora." : nombre.trim().length < 5 ? "Escriba su nombre y apellido." : digitos.length !== 8 ? "Escriba un teléfono de 8 dígitos." : "";
    if (falta) {
      setAviso(falta);
      irA(!hora ? "vv-paso-hora" : "vv-paso-datos");
      if (hora) document.getElementById(nombre.trim().length < 5 ? "vv-nombre" : "vv-telefono")?.focus({ preventScroll: true });
      return;
    }
    const cita = clinica.agendar({ tratamientoId: tratamiento.id, doctorId: doctor.id, fecha, hora, complementos, meses, nombre, telefono: digitos, planId });
    if (!cita) {
      setAviso("Ese horario acaba de ocuparse. Elija otro.");
      return;
    }
    setConfirmada(cita.id);
    setHora("");
    setAviso("");
    // en celular la tarjeta queda abajo: se lleva a la vista
    if (window.matchMedia("(max-width: 959px)").matches) setTimeout(() => irA("vv-tarjeta"), 50);
  }

  function otra() {
    setConfirmada(null);
    setComplementos([]);
    setPlan(undefined);
    irA("agendar");
  }

  /* barra compacta en celular: visible mientras se agenda y la tarjeta aún no se ve */
  const seccion = useRef<HTMLElement>(null);
  const tarjeta = useRef<HTMLElement>(null);
  const [enSeccion, setEnSeccion] = useState(false);
  const [veTarjeta, setVeTarjeta] = useState(false);
  useEffect(() => {
    const ojo = new IntersectionObserver(
      (cambios) => cambios.forEach((c) => (c.target === seccion.current ? setEnSeccion : setVeTarjeta)(c.isIntersecting)),
      { rootMargin: "-80px 0px -90px 0px" },
    );
    if (seccion.current) ojo.observe(seccion.current);
    if (tarjeta.current) ojo.observe(tarjeta.current);
    return () => ojo.disconnect();
  }, []);

  return (
    <section id="agendar" ref={seccion} className="vv-seccion">
      <div className="vv-ancho">
        <div className="vv-titulo">
          <h2>Agende su cita</h2>
          <p>Los horarios que ve son los que están libres ahora mismo.</p>
        </div>
        <form className="vv-dividida" onSubmit={confirmar} noValidate>
          <div className="vv-pasos">
            <Paso numero={1} titulo="Tratamiento">
              <label className="vv-campo">
                <span>¿Qué necesita?</span>
                <select value={tratamiento.id} onChange={(e) => elegir(() => { setTratamiento(e.target.value); setPlan(undefined); })}>
                  {ESPECIALIDADES.map((esp) => (
                    <optgroup key={esp} label={esp}>
                      {clinica.tratamientos.filter((t) => t.especialidad === esp).map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nombre} · {t.desde ? "desde " : ""}
                          {formatoQ(t.precio)}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
              <p className="vv-suave">
                {tratamiento.detalle} Duración de la cita: {minutos} minutos.
              </p>
            </Paso>

            <Paso numero={2} titulo="Odontólogo">
              <div className="vv-doctores" role="radiogroup" aria-label="Odontólogo">
                {elegibles.map((o) => (
                  <label key={o.id} className="vv-opcion">
                    <input type="radio" name="vv-doctor" checked={doctor.id === o.id} onChange={() => elegir(() => setDoctor(o.id))} />
                    <img src={o.foto} alt="" loading="lazy" />
                    <span>
                      <strong>{o.nombre}</strong>
                      <small>
                        {o.area} · {o.diasTexto}
                      </small>
                    </span>
                  </label>
                ))}
              </div>
            </Paso>

            <Paso numero={3} titulo="Fecha">
              <div className="vv-fechas" role="group" aria-label="Fecha">
                {dias.map((d) => {
                  const cupo = libresDe(doctor.id, d).length;
                  return (
                    <button key={d} type="button" disabled={!cupo} aria-pressed={fecha === d} aria-label={`${fechaLarga(d)}${cupo ? "" : ", sin espacios"}`} onClick={() => elegir(() => { setFecha(d); setDoctor(doctor.id); })}>
                      <span>{diaCorto(d)}</span>
                      <strong>{Number(d.slice(8))}</strong>
                      <span>{mesCorto(d)}</span>
                    </button>
                  );
                })}
              </div>
            </Paso>

            <Paso numero={4} titulo="Bloque de hora" id="vv-paso-hora">
              {!fecha && <p className="vv-suave">No quedan espacios en estos días. Pruebe con otro odontólogo o quite complementos.</p>}
              {[
                { nombre: "Mañana", lista: horas.filter((b) => b.hora < "13:00") },
                { nombre: "Tarde", lista: horas.filter((b) => b.hora >= "13:00") },
              ]
                .filter((g) => g.lista.length)
                .map((g) => (
                  <div key={g.nombre} className="vv-jornada">
                    <p>{g.nombre}</p>
                    <div className="vv-horas">
                      {g.lista.map((b) => (
                        <button key={b.hora} type="button" disabled={!b.libre} aria-pressed={hora === b.hora} onClick={() => elegir(() => { setHora(b.hora); setFecha(fecha); setDoctor(doctor.id); })}>
                          {hora12(b.hora)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </Paso>

            <Paso numero={5} titulo="Complementos y forma de pago">
              <div className="vv-complementos">
                {COMPLEMENTOS.map((c) => (
                  <label key={c.id} className="vv-opcion">
                    <input
                      type="checkbox"
                      checked={complementos.includes(c.id)}
                      onChange={(e) => elegir(() => setComplementos((v) => (e.target.checked ? [...v, c.id] : v.filter((x) => x !== c.id))))}
                    />
                    <span>
                      <strong>{c.nombre}</strong>
                      <small>{c.detalle}</small>
                    </span>
                    <b>+ {formatoQ(c.precio)}</b>
                  </label>
                ))}
              </div>
              <div className="vv-pagos" role="group" aria-label="Forma de pago">
                {[1, ...(tratamiento.cuotas ?? [])].map((m) => (
                  <button key={m} type="button" aria-pressed={meses === m} onClick={() => elegir(() => setMeses(m))}>
                    {m === 1 ? "Un solo pago" : `${m} pagos mensuales`}
                  </button>
                ))}
              </div>
              {!tratamiento.cuotas && <p className="vv-suave">Este tratamiento se paga en la cita: efectivo, tarjeta o transferencia.</p>}
            </Paso>

            <Paso numero={6} titulo="Sus datos" id="vv-paso-datos">
              <div className="vv-dos">
                <label className="vv-campo">
                  <span>Nombre y apellido</span>
                  <input id="vv-nombre" type="text" autoComplete="name" value={nombre} onChange={(e) => elegir(() => setNombre(e.target.value))} />
                </label>
                <label className="vv-campo">
                  <span>Teléfono (8 dígitos)</span>
                  <input id="vv-telefono" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={9} value={telefono} onChange={(e) => elegir(() => setTelefono(e.target.value))} />
                </label>
              </div>
              {planId && nombre === nombreDe(clinica, PACIENTE_SESION) && <p className="vv-suave">Esta cita queda ligada a su plan de tratamiento.</p>}
            </Paso>
          </div>

          <aside id="vv-tarjeta" ref={tarjeta} className="vv-tarjeta" aria-live="polite">
            {confirmada ? (
              <Confirmacion clinica={clinica} cita={confirmada} alOtra={otra} />
            ) : (
              <>
                <h3>Resumen de su cita</h3>
                <dl className="vv-resumen">
                  <Dato nombre="Tratamiento" valor={tratamiento.nombre} />
                  <Dato nombre="Odontólogo" valor={doctor.nombre} />
                  <Dato nombre="Fecha" valor={fecha ? mayus(fechaLarga(fecha)) : "Sin espacios"} />
                  <Dato nombre="Hora" valor={hora ? `${hora12(hora)} · ${minutos} min` : "Por elegir"} />
                </dl>
                <dl className="vv-cargos">
                  <Dato nombre={tratamiento.desde ? "Tratamiento (desde)" : "Tratamiento"} valor={formatoQ(tratamiento.precio)} />
                  {COMPLEMENTOS.filter((c) => complementos.includes(c.id)).map((c) => (
                    <Dato key={c.id} nombre={c.nombre} valor={formatoQ(c.precio)} />
                  ))}
                </dl>
                <Total total={total} etiqueta={tratamiento.desde ? "Total estimado" : "Total"} />
                {meses > 1 && (
                  <p className="vv-cuota">
                    {meses} pagos mensuales de <strong>{formatoQ(total / meses)}</strong>, sin recargo
                  </p>
                )}
                {aviso && (
                  <p className="vv-aviso" role="alert">
                    <CircleAlert size={17} aria-hidden /> {aviso}
                  </p>
                )}
                <button type="submit" className="vv-btn vv-accion vv-lleno">
                  <CalendarCheck size={18} aria-hidden /> Confirmar cita
                </button>
                <p className="vv-nota">Puede reprogramar sin costo con 24 horas de anticipación.</p>
              </>
            )}
          </aside>
        </form>
      </div>

      <div className="vv-barra" data-visible={enSeccion && !veTarjeta}>
        <p>
          <span>{confirmada ? "Cita confirmada" : tratamiento.desde ? "Total estimado" : "Total"}</span>
          <strong>{formatoQ(confirmada?.total ?? total)}</strong>
        </p>
        <button type="button" className="vv-btn vv-accion" onClick={() => irA("vv-tarjeta")} tabIndex={enSeccion && !veTarjeta ? 0 : -1}>
          {confirmada ? "Ver cita" : "Revisar"} <ArrowDown size={16} aria-hidden />
        </button>
      </div>
    </section>
  );
}

function Paso({ numero, titulo, id, children }: { numero: number; titulo: string; id?: string; children: ReactNode }) {
  return (
    <fieldset id={id} className="vv-paso">
      <legend className="vv-oculto">{titulo}</legend>
      <h3 aria-hidden>
        <span>{numero}</span> {titulo}
      </h3>
      {children}
    </fieldset>
  );
}

function Dato({ nombre, valor }: { nombre: string; valor: string }) {
  return (
    <div>
      <dt>{nombre}</dt>
      <dd>{valor}</dd>
    </div>
  );
}

function Total({ total, etiqueta }: { total: number; etiqueta: string }) {
  const cifra = useRef<HTMLElement>(null);
  useCifra(cifra, total, formatoQ);
  return (
    <p className="vv-total">
      <span>{etiqueta}</span>
      <strong ref={cifra}>{formatoQ(total)}</strong>
    </p>
  );
}

function Confirmacion({ clinica, cita, alOtra }: { clinica: Clinica; cita: Cita; alOtra: () => void }) {
  const tratamiento = clinica.tratamientos.find((t) => t.id === cita.tratamientoId)!;
  const doctor = odontologoPor(cita.doctorId);
  const extras = COMPLEMENTOS.filter((c) => cita.complementos.includes(c.id)).map((c) => c.nombre);
  const mensaje = [
    "Clínica Dental Valleverde · Cita confirmada",
    `Folio: ${cita.id}`,
    `Paciente: ${nombreDe(clinica, cita.pacienteId)}`,
    `Tratamiento: ${tratamiento.nombre}`,
    ...(extras.length ? [`Complementos: ${extras.join(", ")}`] : []),
    `Con: ${doctor.nombre}`,
    `Fecha: ${fechaLarga(cita.fecha)}, ${hora12(cita.hora)}`,
    `${tratamiento.desde ? "Total estimado" : "Total"}: ${formatoQ(cita.total)}${cita.meses > 1 ? ` en ${cita.meses} pagos de ${formatoQ(cita.total / cita.meses)}` : ""}`,
  ].join("\n");
  return (
    <div className="vv-confirmada">
      <span className="vv-sello">
        <Check size={26} aria-hidden />
      </span>
      <h3>Su cita quedó confirmada</h3>
      <p className="vv-folio">Folio {cita.id}</p>
      <dl className="vv-resumen">
        <Dato nombre="Tratamiento" valor={tratamiento.nombre} />
        <Dato nombre="Odontólogo" valor={doctor.nombre} />
        <Dato nombre="Fecha" valor={mayus(fechaLarga(cita.fecha))} />
        <Dato nombre="Hora" valor={`${hora12(cita.hora)} · ${cita.minutos} min`} />
      </dl>
      <Total total={cita.total} etiqueta={tratamiento.desde ? "Total estimado" : "Total"} />
      {cita.meses > 1 && (
        <p className="vv-cuota">
          {cita.meses} pagos mensuales de <strong>{formatoQ(cita.total / cita.meses)}</strong>
        </p>
      )}
      <a className="vv-btn vv-accion vv-lleno" href={enlaceWhatsApp(mensaje)} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={18} aria-hidden /> Enviar por WhatsApp
      </a>
      <button type="button" className="vv-btn vv-claro vv-lleno" onClick={alOtra}>
        Agendar otra cita
      </button>
    </div>
  );
}
