/*
 * La cita: la barra flotante que aparece al elegir servicios y la hoja donde se escoge
 * sucursal, especialista, día y hora. Al confirmar, la cita llega al Panel Salón.
 */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CalendarCheck, Check, MessageCircle, X } from "lucide-react";
import {
  SERVICIOS, SUCURSALES, dia, diaCorto, duraDe, especialistas, estilista, fechaLarga, hora12, horasLibres, llevaPelo, mesCorto, nombresDe, numeroDia, qz, sucursal, tiempo, totalDe, whatsapp,
  type Atelier, type Cita, type ServicioId, type SucId,
} from "./datos";
import { Cifra } from "./Piezas";

export function Dock({ elegidos, suc, alSuc, alElegirHora, alVaciar }: { elegidos: ServicioId[]; suc: SucId; alSuc: (s: SucId) => void; alElegirHora: () => void; alVaciar: () => void }) {
  return (
    <aside className="al-dock" aria-label="Su cita">
      <button type="button" className="al-dock-vaciar" onClick={alVaciar} aria-label="Quitar todos los servicios">
        <X size={16} aria-hidden />
      </button>
      <div className="al-dock-resumen">
        <b>
          <Cifra valor={totalDe(elegidos)} dinero />
        </b>
        <span>
          {elegidos.length} {elegidos.length === 1 ? "servicio" : "servicios"} · {tiempo(duraDe(elegidos))}
        </span>
        <small>{nombresDe(elegidos)}</small>
      </div>
      <div className="al-dock-suc" role="radiogroup" aria-label="Sucursal">
        {SUCURSALES.map((s) => (
          <button key={s.id} type="button" role="radio" aria-checked={suc === s.id} onClick={() => alSuc(s.id)}>
            {s.nombre}
          </button>
        ))}
      </div>
      <button type="button" className="al-btn al-terra al-dock-seguir" onClick={alElegirHora}>
        Elegir especialista y hora <ArrowRight size={17} aria-hidden />
      </button>
    </aside>
  );
}

export function Reserva({
  atelier,
  elegidos,
  alAlternar,
  suc,
  alSuc,
  alCerrar,
  alConfirmada,
  alIr,
}: {
  atelier: Atelier;
  elegidos: ServicioId[];
  alAlternar: (id: ServicioId) => void;
  suc: SucId;
  alSuc: (s: SucId) => void;
  alCerrar: () => void;
  alConfirmada: (clienta: string) => void;
  alIr: (vista: "expediente" | "panel") => void;
}) {
  const hoja = useRef<HTMLDialogElement>(null);
  const [quien, setQuien] = useState("");
  const [fechaElegida, setFecha] = useState("");
  const [horaElegida, setHora] = useState("");
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [intento, setIntento] = useState(false);
  const [lista, setLista] = useState<Cita | null>(null);

  useEffect(() => {
    const d = hoja.current;
    if (d && !d.open) d.showModal();
  }, []);

  const dura = duraDe(elegidos);
  const { lista: pueden, manos } = especialistas(suc, elegidos);
  const especialista = pueden.find((e) => e.id === quien) ?? pueden[0];
  const quienes = [especialista?.id, manos?.id].filter(Boolean) as string[];
  const dias = Array.from({ length: 14 }, (_, n) => {
    const f = dia(n);
    return { f, libres: elegidos.length && especialista ? horasLibres(atelier.citas, suc, quienes, f, dura) : [] };
  });
  const elDia = dias.find((d) => d.f === fechaElegida && d.libres.length) ?? dias.find((d) => d.libres.length);
  const hora = elDia?.libres.includes(horaElegida) ? horaElegida : "";

  const nombreLimpio = nombre.trim().replace(/\s+/g, " ");
  const digitos = tel.replace(/\D/g, "");
  const falta = !elegidos.length
    ? "Elija al menos un servicio."
    : !hora
      ? "Escoja una hora disponible."
      : nombreLimpio.length < 3
        ? "Escriba su nombre y apellido."
        : digitos.length !== 8
          ? "Escriba los 8 dígitos de su teléfono."
          : "";

  function confirmar(e: FormEvent) {
    e.preventDefault();
    setIntento(true);
    if (falta || !elDia || !especialista) return;
    const { cita, clienta } = atelier.agendar({ suc, servicios: elegidos, estilista: especialista.id, manos: manos?.id, fecha: elDia.f, hora, nombre: nombreLimpio, tel: digitos });
    setLista(cita);
    alConfirmada(clienta.id);
    hoja.current?.scrollTo({ top: 0 });
  }

  const comprobante = lista
    ? [
        `Comprobante de cita ${lista.folio} · Atelier L’Art`,
        `Clienta: ${nombreLimpio}`,
        `Servicios: ${nombresDe(lista.servicios)}`,
        `${fechaLarga(lista.fecha)}, ${hora12(lista.hora)}`,
        `Sucursal ${sucursal(lista.suc).nombre}: ${sucursal(lista.suc).direccion}`,
        `Con ${estilista(lista.estilista).nombre}${lista.manos ? ` y ${estilista(lista.manos).nombre}` : ""}`,
        `Inversión desde ${qz(totalDe(lista.servicios))}. El precio se cierra por escrito antes de iniciar.`,
      ].join("\n")
    : "";

  return (
    <dialog
      ref={hoja}
      className="al-hoja"
      aria-labelledby="al-hoja-titulo"
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === hoja.current) hoja.current.close();
      }}
    >
      <div className="al-hoja-caja">
        <header className="al-hoja-cabeza">
          <h2 id="al-hoja-titulo">{lista ? "Cita registrada" : "Agendar cita"}</h2>
          <button type="button" aria-label="Cerrar" onClick={() => hoja.current?.close()}>
            <X size={20} aria-hidden />
          </button>
        </header>

        {lista ? (
          <div className="al-hoja-cuerpo al-listo">
            <span className="al-listo-icono">
              <CalendarCheck size={30} aria-hidden />
            </span>
            <p>
              {nombreLimpio}, su cita <b>{lista.folio}</b> quedó apartada. El salón la confirma por WhatsApp.
            </p>
            <dl className="al-resumen">
              <div>
                <dt>Cuándo</dt>
                <dd>
                  {fechaLarga(lista.fecha)}, {hora12(lista.hora)}
                </dd>
              </div>
              <div>
                <dt>Dónde</dt>
                <dd>{sucursal(lista.suc).nombre}</dd>
              </div>
              <div>
                <dt>Con</dt>
                <dd>
                  {estilista(lista.estilista).nombre}
                  {lista.manos ? ` y ${estilista(lista.manos).nombre}` : ""}
                </dd>
              </div>
              <div>
                <dt>Servicios</dt>
                <dd>{nombresDe(lista.servicios)}</dd>
              </div>
              <div>
                <dt>Inversión desde</dt>
                <dd>{qz(totalDe(lista.servicios))}</dd>
              </div>
            </dl>
            <a className="al-btn al-terra al-lleno al-grande" href={whatsapp(comprobante)} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} aria-hidden /> Enviar comprobante por WhatsApp
            </a>
            <div className="al-listo-botones">
              <button type="button" className="al-btn al-linea" onClick={() => alIr("expediente")}>
                Ver mi expediente
              </button>
              <button type="button" className="al-btn al-linea" onClick={() => alIr("panel")}>
                Verla en Panel Salón
              </button>
            </div>
          </div>
        ) : (
          <form className="al-hoja-cuerpo" onSubmit={confirmar} noValidate>
            <fieldset>
              <legend>Servicios</legend>
              <div className="al-chips">
                {SERVICIOS.map((s) => (
                  <button key={s.id} type="button" aria-pressed={elegidos.includes(s.id)} onClick={() => alAlternar(s.id)}>
                    {elegidos.includes(s.id) && <Check size={14} aria-hidden />}
                    {s.nombre} <small>{qz(s.precio)}</small>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>Sucursal</legend>
              <div className="al-segmentos">
                {SUCURSALES.map((s) => (
                  <label key={s.id}>
                    <input type="radio" name="al-suc" checked={suc === s.id} onChange={() => alSuc(s.id)} />
                    <span>{s.nombre}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {!elegidos.length ? (
              <p className="al-vacio">Elija un servicio para ver especialistas y horas disponibles.</p>
            ) : (
              <>
                <fieldset>
                  <legend>Especialista</legend>
                  <div className="al-opciones al-dos">
                    {pueden.map((e) => (
                      <label key={e.id} className="al-opcion">
                        <input type="radio" name="al-quien" checked={especialista?.id === e.id} onChange={() => setQuien(e.id)} />
                        <span>
                          <b>{e.nombre}</b>
                          <small>
                            {e.rol} · {e.anios} años
                          </small>
                        </span>
                      </label>
                    ))}
                  </div>
                  {manos && llevaPelo(elegidos) && <p className="al-ayuda">La manicure la atiende {manos.nombre} en la misma visita.</p>}
                </fieldset>

                <fieldset>
                  <legend>Día</legend>
                  <div className="al-dias">
                    {dias.map((d) => (
                      <button key={d.f} type="button" disabled={!d.libres.length} aria-pressed={elDia?.f === d.f} aria-label={`${fechaLarga(d.f)}${d.libres.length ? "" : ", sin horas libres"}`} onClick={() => setFecha(d.f)}>
                        <span>{diaCorto(d.f)}</span>
                        <b>{numeroDia(d.f)}</b>
                        <span>{mesCorto(d.f)}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend>Hora</legend>
                  {elDia ? (
                    <div className="al-horas">
                      {elDia.libres.map((h) => (
                        <button key={h} type="button" aria-pressed={hora === h} onClick={() => setHora(h)}>
                          {hora12(h)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="al-vacio">No hay un espacio continuo de {tiempo(dura)}. Pruebe con otra persona, otra sucursal o menos servicios.</p>
                  )}
                </fieldset>
              </>
            )}

            <div className="al-campos">
              <label>
                <span>Nombre y apellido</span>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" maxLength={60} />
              </label>
              <label>
                <span>Teléfono (8 dígitos)</span>
                <input value={tel} onChange={(e) => setTel(e.target.value)} inputMode="tel" autoComplete="tel-national" maxLength={11} />
              </label>
            </div>

            <div className="al-hoja-pie">
              <p>
                <span>{tiempo(dura)}</span>
                <b>desde {qz(totalDe(elegidos))}</b>
              </p>
              {intento && falta && (
                <p className="al-error" role="alert">
                  {falta}
                </p>
              )}
              <button type="submit" className="al-btn al-terra al-lleno al-grande">
                Confirmar cita
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
