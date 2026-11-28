/*
 * Vista "Expediente Capilar": lo que ve la clienta. Su próximo retoque, sus citas y la ficha
 * técnica de colorimetría de cada visita. Lo que el salón guarda en el panel aparece aquí.
 */
import { useRef, useState } from "react";
import { CalendarClock, CalendarPlus, MessageCircle } from "lucide-react";
import { useEscalonado } from "./animar";
import {
  NOMBRE_ESTADO, dia, diaCorto, duraDe, estilista, faltan, fechaCercana, fechaLarga, fechaMedia, hora12, horasLibres, mesCorto, nombresDe, numeroDia, qz, retoqueDe, sucursal, totalDe, whatsapp,
  type Atelier, type Cita, type Porosidad,
} from "./datos";
import { Cifra } from "./Piezas";

export function Expediente({ atelier, clienta, alElegir, alAgendar }: { atelier: Atelier; clienta: string; alElegir: (id: string) => void; alAgendar: () => void }) {
  const ficha = atelier.clientas.find((c) => c.id === clienta) ?? atelier.clientas[0];
  const suyas = atelier.citas.filter((c) => c.clienta === ficha.id && c.estado !== "cancelada");
  const proximas = suyas.filter((c) => c.estado !== "completada" && faltan(c.fecha) >= 0).sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  const formulas = suyas.filter((c) => c.formula).sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
  /* la vigente es la última ya aplicada; las de citas futuras solo están preparadas */
  const vigente = formulas.find((c) => faltan(c.fecha) <= 0)?.id;
  const retoque = retoqueDe(atelier.citas, ficha.id);
  const caja = useRef<HTMLDivElement>(null);
  useEscalonado(caja, ficha.id);

  const avance = retoque ? Math.min(100, Math.max(0, ((retoque.ciclo - retoque.dias) / retoque.ciclo) * 100)) : 0;

  return (
    <div ref={caja} className="al-ancho al-interior">
      <header className="al-cabeza">
        <div>
          <h1>Expediente de {ficha.nombre}</h1>
          <p className="al-suave">Clienta desde {ficha.desde}</p>
        </div>
        <label>
          Ver el expediente de
          <select value={ficha.id} onChange={(e) => alElegir(e.target.value)}>
            {atelier.clientas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="al-exp">
        <div className="al-columna">
          <section className="al-tarjeta" data-entra>
            <h2>Próximo retoque de raíz</h2>
            {retoque ? (
              <div className="al-retoque">
                <div className="al-anillo" style={{ ["--avance" as string]: avance }} role="img" aria-label={retoque.dias >= 0 ? `Faltan ${retoque.dias} días` : `Retoque atrasado ${-retoque.dias} días`}>
                  <span aria-hidden>
                    <b>
                      <Cifra key={ficha.id} valor={Math.abs(retoque.dias)} />
                    </b>
                    <small>{retoque.dias >= 0 ? (retoque.dias === 1 ? "día" : "días") : "días de atraso"}</small>
                  </span>
                </div>
                <div>
                  <p>
                    {retoque.dias > 0 ? "Le toca el " : retoque.dias === 0 ? "Le toca hoy, " : "Le tocaba el "}
                    <b>{fechaLarga(retoque.fecha)}</b>.
                  </p>
                  <p className="al-suave">
                    Ciclo de {retoque.ciclo} días desde su visita del {fechaMedia(retoque.ultima.fecha)}.
                  </p>
                  {!proximas.length && (
                    <button type="button" className="al-btn al-terra" onClick={alAgendar}>
                      <CalendarPlus size={17} aria-hidden /> Agendar retoque
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="al-vacio">El contador empieza después de su primera visita de color.</p>
            )}
          </section>

          <section className="al-tarjeta" data-entra>
            <h2>Citas próximas</h2>
            {proximas.length ? (
              <ul className="al-proximas">
                {proximas.map((c) => (
                  <Proxima key={c.id} cita={c} atelier={atelier} nombre={ficha.nombre} />
                ))}
              </ul>
            ) : (
              <p className="al-vacio">No tiene citas pendientes.</p>
            )}
            <button type="button" className="al-btn al-linea al-lleno" style={{ marginTop: ".9rem" }} onClick={alAgendar}>
              <CalendarPlus size={17} aria-hidden /> Agendar otra cita
            </button>
          </section>
        </div>

        <div className="al-columna">
          <section className="al-tarjeta" data-entra>
            <h2>Su cabello</h2>
            <dl className="al-datos-clienta">
              <div>
                <dt>Base natural</dt>
                <dd>{ficha.base}</dd>
              </div>
              <div>
                <dt>Cuidados</dt>
                <dd>{ficha.cuidado}</dd>
              </div>
            </dl>
          </section>

          <section className="al-tarjeta" data-entra>
            <h2>Ficha técnica de colorimetría</h2>
            {formulas.length ? (
              <ol className="al-formulas">
                {formulas.map((c) => (
                  <li key={c.id} className={`al-formula ${c.id === vigente ? "al-vigente" : ""}`}>
                    <div className="al-fila">
                      <b>{faltan(c.fecha) === 0 ? "Hoy" : fechaMedia(c.fecha)}</b>
                      {c.id === vigente ? (
                        <span className="al-estado" data-estado="en-sillon">
                          Fórmula vigente
                        </span>
                      ) : faltan(c.fecha) > 0 ? (
                        <span className="al-estado" data-estado="por-confirmar">
                          Preparada para esa cita
                        </span>
                      ) : (
                        <span className="al-suave">{sucursal(c.suc).nombre}</span>
                      )}
                    </div>
                    <p className="al-formula-mezcla">{c.formula!.mezcla}</p>
                    <dl className="al-formula-datos">
                      <div>
                        <dt>Oxidante</dt>
                        <dd>{c.formula!.oxidante}</dd>
                      </div>
                      <div>
                        <dt>Tiempo de pose</dt>
                        <dd>{c.formula!.minutos} min</dd>
                      </div>
                      <div>
                        <dt>Porosidad</dt>
                        <dd>
                          <Nivel valor={c.formula!.porosidad} />
                        </dd>
                      </div>
                      <div>
                        <dt>Tratamiento</dt>
                        <dd>{c.formula!.tratamiento || "Ninguno"}</dd>
                      </div>
                    </dl>
                    {c.formula!.nota && <p>{c.formula!.nota}</p>}
                    <p className="al-suave">
                      {nombresDe(c.servicios)} con {estilista(c.estilista).nombre}, {sucursal(c.suc).nombre}.
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="al-vacio">Su fórmula se anota en su primera visita de color y queda disponible aquí.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Nivel({ valor }: { valor: Porosidad }) {
  const n = valor === "Baja" ? 1 : valor === "Media" ? 2 : 3;
  return (
    <span className="al-porosidad">
      {valor}
      <i aria-hidden>
        {[1, 2, 3].map((x) => (
          <span key={x} className={x <= n ? "al-on" : undefined} />
        ))}
      </i>
    </span>
  );
}

function Proxima({ cita, atelier, nombre }: { cita: Cita; atelier: Atelier; nombre: string }) {
  const [modo, setModo] = useState<"" | "mover" | "cancelar">("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const quienes = [cita.estilista, cita.manos].filter(Boolean) as string[];
  const dias =
    modo === "mover"
      ? Array.from({ length: 14 }, (_, n) => ({ f: dia(n), libres: horasLibres(atelier.citas, cita.suc, quienes, dia(n), duraDe(cita.servicios), cita.id) })).filter((d) => d.libres.length)
      : [];
  const elDia = dias.find((d) => d.f === fecha) ?? dias[0];
  const horaValida = elDia?.libres.includes(hora) ? hora : "";
  const mensaje = `Hola, soy ${nombre}. Le escribo por mi cita ${cita.folio} del ${fechaLarga(cita.fecha)} a las ${hora12(cita.hora)} en ${sucursal(cita.suc).nombre}.`;

  return (
    <li>
      <div className="al-fila">
        <b>
          {fechaCercana(cita.fecha)}, {hora12(cita.hora)}
        </b>
        <span className="al-estado" data-estado={cita.estado}>
          {NOMBRE_ESTADO[cita.estado]}
        </span>
      </div>
      <p>{nombresDe(cita.servicios)}</p>
      <p className="al-suave">
        {sucursal(cita.suc).nombre} · {estilista(cita.estilista).nombre} · desde {qz(totalDe(cita.servicios))} · {cita.folio}
      </p>

      {cita.estado !== "en-sillon" && modo === "" && (
        <div className="al-acciones">
          <a className="al-btn al-linea" href={whatsapp(mensaje)} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={15} aria-hidden /> Escribir
          </a>
          <button type="button" className="al-btn al-linea" onClick={() => setModo("mover")}>
            <CalendarClock size={15} aria-hidden /> Reprogramar
          </button>
          <button type="button" className="al-btn al-linea" onClick={() => setModo("cancelar")}>
            Cancelar cita
          </button>
        </div>
      )}

      {modo === "mover" && (
        <div className="al-reprogramar">
          {elDia ? (
            <>
              <div className="al-dias" role="group" aria-label="Nuevo día">
                {dias.map((d) => (
                  <button key={d.f} type="button" aria-pressed={elDia.f === d.f} aria-label={fechaLarga(d.f)} onClick={() => setFecha(d.f)}>
                    <span>{diaCorto(d.f)}</span>
                    <b>{numeroDia(d.f)}</b>
                    <span>{mesCorto(d.f)}</span>
                  </button>
                ))}
              </div>
              <div className="al-horas" role="group" aria-label="Nueva hora">
                {elDia.libres.map((h) => (
                  <button key={h} type="button" aria-pressed={horaValida === h} onClick={() => setHora(h)}>
                    {hora12(h)}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="al-vacio">No hay horas libres en las próximas dos semanas.</p>
          )}
          <div className="al-acciones">
            <button
              type="button"
              className="al-btn al-terra"
              disabled={!horaValida}
              style={horaValida ? undefined : { opacity: 0.5 }}
              onClick={() => {
                atelier.cambiar(cita.id, { fecha: elDia!.f, hora: horaValida, estado: "por-confirmar", estacion: "" });
                setModo("");
                setHora("");
              }}
            >
              Guardar nueva hora
            </button>
            <button type="button" className="al-btn al-linea" onClick={() => setModo("")}>
              Volver
            </button>
          </div>
        </div>
      )}

      {modo === "cancelar" && (
        <div className="al-reprogramar">
          <p>
            <b>¿Cancelar esta cita?</b> La hora queda libre para otra persona.
          </p>
          <div className="al-acciones">
            <button type="button" className="al-btn al-oscuro" onClick={() => atelier.cambiar(cita.id, { estado: "cancelada", estacion: "" })}>
              Sí, cancelar
            </button>
            <button type="button" className="al-btn al-linea" onClick={() => setModo("")}>
              Conservarla
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
