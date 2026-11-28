/*
 * Vista "Panel Salón": lo que usan la dueña y los coloristas. Cifras del día, citas por estado,
 * estación o lavacabezas, la fórmula aplicada (que pasa al expediente) y el aviso por WhatsApp.
 */
import { useRef, useState, type FormEvent } from "react";
import { Check, CheckCircle2, ChevronDown, FlaskConical, MessageCircle } from "lucide-react";
import { useEscalonado } from "./animar";
import {
  ESTACIONES, NOMBRE_ESTADO, OXIDANTES, POROSIDADES, SUCURSALES,
  dia, duraDe, estilista, faltan, fechaCercana, fechaLarga, hora12, llevaPelo, nombresDe, qz, retoqueDe, sucursal, tiempo, totalDe, whatsapp,
  type Atelier, type Cita, type Formula,
} from "./datos";
import { Cifra } from "./Piezas";

export type FiltroPanel = "todas" | "en-sillon" | "por-confirmar" | "completada";

const FILTROS: { id: FiltroPanel; nombre: string }[] = [
  { id: "todas", nombre: "Todas" },
  { id: "en-sillon", nombre: "En sillón" },
  { id: "por-confirmar", nombre: "Por confirmar" },
  { id: "completada", nombre: "Completadas" },
];

export function Panel({ atelier, filtro, alFiltrar, alVer }: { atelier: Atelier; filtro: FiltroPanel; alFiltrar: (f: FiltroPanel) => void; alVer: (clienta: string) => void }) {
  const hoy = dia(0);
  const vigentes = atelier.citas.filter((c) => c.estado !== "cancelada" && c.fecha >= hoy);
  const deHoy = vigentes.filter((c) => c.fecha === hoy);
  const sillones = deHoy.filter((c) => c.estado === "en-sillon").length;
  /* a quiénes les toca color de aquí a un mes (o se les pasó hace menos de un mes) */
  const retoques = atelier.clientas.filter((c) => {
    const r = retoqueDe(atelier.citas, c.id);
    return r && Math.abs(r.dias) <= 30;
  }).length;
  const facturacion = deHoy.reduce((n, c) => n + totalDe(c.servicios), 0);
  const cumple = (c: Cita, f: FiltroPanel) => f === "todas" || c.estado === f;
  const lista = vigentes.filter((c) => cumple(c, filtro)).sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  const rejilla = useRef<HTMLUListElement>(null);
  useEscalonado(rejilla, filtro);

  return (
    <div className="al-ancho al-interior">
      <header className="al-cabeza">
        <div>
          <h1>Panel Salón</h1>
          <p className="al-suave">
            {fechaLarga(hoy).replace(/^./, (l) => l.toUpperCase())} · Zona 10 y Cayalá
          </p>
        </div>
      </header>

      <dl className="al-cifras">
        <div>
          <dt>Citas hoy</dt>
          <dd>
            <Cifra valor={deHoy.length} />
          </dd>
          <small>{vigentes.length - deHoy.length} en próximos días</small>
        </div>
        <div>
          <dt>Sillones activos</dt>
          <dd>
            <Cifra valor={sillones} />
          </dd>
          <small>de {ESTACIONES.length * SUCURSALES.length} estaciones</small>
        </div>
        <div>
          <dt>Retoques del mes</dt>
          <dd>
            <Cifra valor={retoques} />
          </dd>
          <small>les toca color en 30 días</small>
        </div>
        <div>
          <dt>Facturación estimada</dt>
          <dd>
            <Cifra valor={facturacion} dinero />
          </dd>
          <small>citas de hoy, precio inicial</small>
        </div>
      </dl>

      <div className="al-pildoras" role="group" aria-label="Filtrar citas">
        {FILTROS.map((f) => (
          <button key={f.id} type="button" aria-pressed={filtro === f.id} onClick={() => alFiltrar(f.id)}>
            {f.nombre} <i>{vigentes.filter((c) => cumple(c, f.id)).length}</i>
          </button>
        ))}
      </div>

      {lista.length ? (
        <ul ref={rejilla} className="al-citas">
          {lista.map((c) => (
            <Tarjeta key={c.id} cita={c} atelier={atelier} alVer={alVer} />
          ))}
        </ul>
      ) : (
        <p className="al-vacio">No hay citas en este estado.</p>
      )}
    </div>
  );
}

function Tarjeta({ cita, atelier, alVer }: { cita: Cita; atelier: Atelier; alVer: (clienta: string) => void }) {
  const clienta = atelier.clientas.find((c) => c.id === cita.clienta);
  const nombre = clienta?.nombre ?? "Clienta";
  const esHoy = faltan(cita.fecha) === 0;
  /* estaciones que ya tiene otra persona sentada en esta sucursal */
  const ocupadas = new Map(
    atelier.citas.filter((c) => c.id !== cita.id && c.suc === cita.suc && c.fecha === dia(0) && c.estado === "en-sillon" && c.estacion).map((c) => [c.estacion, atelier.clientas.find((x) => x.id === c.clienta)?.nombre.split(" ")[0] ?? ""]),
  );
  const libre = !!cita.estacion && !ocupadas.has(cita.estacion);
  const cuando = `${fechaLarga(cita.fecha)} a las ${hora12(cita.hora)}`;
  const donde = `Atelier L’Art ${sucursal(cita.suc).nombre}`;
  const mensaje =
    cita.estado === "completada"
      ? `Hola, ${nombre.split(" ")[0]}. Gracias por su visita a ${donde}.${cita.formula ? " Su ficha de color quedó guardada para la próxima." : ""}`
      : cita.estado === "en-sillon"
        ? `Hola, ${nombre.split(" ")[0]}. Su servicio en ${donde} ya está en proceso.`
        : `Hola, ${nombre.split(" ")[0]}. Le confirmamos su cita ${cita.folio} en ${donde}: ${cuando}, ${nombresDe(cita.servicios)} con ${estilista(cita.estilista).nombre}. Inversión desde ${qz(totalDe(cita.servicios))}.`;

  return (
    <li className={`al-cita ${cita.nueva && cita.estado === "por-confirmar" ? "al-nueva" : ""}`} data-entra>
      <div className="al-fila">
        <p className="al-cita-hora">
          {hora12(cita.hora)}
          <small>{fechaCercana(cita.fecha)}</small>
        </p>
        <span className="al-estado" data-estado={cita.estado}>
          {NOMBRE_ESTADO[cita.estado]}
        </span>
      </div>

      <div>
        <h3>{nombre}</h3>
        <p>{nombresDe(cita.servicios)}</p>
        <p className="al-cita-detalle">
          {sucursal(cita.suc).nombre} · {estilista(cita.estilista).nombre}
          {cita.manos ? ` y ${estilista(cita.manos).nombre}` : ""} · {tiempo(duraDe(cita.servicios))} · {qz(totalDe(cita.servicios))} · {cita.folio}
          {cita.nueva ? " · agendada en línea" : ""}
        </p>
        <button type="button" className="al-enlace" onClick={() => alVer(cita.clienta)}>
          Ver expediente
        </button>
      </div>

      {cita.estado !== "completada" ? (
        <fieldset>
          <legend>Estación / Lavacabezas</legend>
          <div className="al-segmentos">
            {ESTACIONES.map((e) => {
              const de = esHoy ? ocupadas.get(e) : undefined;
              return (
                <label key={e} title={de ? `Ocupada por ${de}` : undefined}>
                  <input type="radio" name={`al-estacion-${cita.id}`} checked={cita.estacion === e} disabled={!!de} onChange={() => atelier.cambiar(cita.id, { estacion: e })} />
                  <span>{de ? `${e} · ${de}` : e}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : (
        cita.estacion && <p className="al-cita-detalle">Atendida en {cita.estacion}.</p>
      )}

      {llevaPelo(cita.servicios) && <Editor cita={cita} atelier={atelier} nombre={nombre} />}

      <div className="al-acciones">
        {cita.estado === "por-confirmar" ? (
          <a className="al-btn al-terra" href={whatsapp(mensaje)} target="_blank" rel="noopener noreferrer" onClick={() => atelier.cambiar(cita.id, { estado: "confirmada" })}>
            <MessageCircle size={15} aria-hidden /> Confirmar y avisar
          </a>
        ) : (
          <a className="al-btn al-linea" href={whatsapp(mensaje)} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={15} aria-hidden /> Avisar por WhatsApp
          </a>
        )}
        {cita.estado === "confirmada" && esHoy && (
          <button type="button" className="al-btn al-oscuro" disabled={!libre} style={libre ? undefined : { opacity: 0.5 }} onClick={() => atelier.cambiar(cita.id, { estado: "en-sillon" })}>
            {libre ? "Pasar a sillón" : "Elija estación libre"}
          </button>
        )}
        {cita.estado === "en-sillon" && (
          <button type="button" className="al-btn al-oscuro" onClick={() => atelier.cambiar(cita.id, { estado: "completada" })}>
            Marcar completada
          </button>
        )}
      </div>
    </li>
  );
}

const VACIA: Formula = { mezcla: "", oxidante: "20 Vol", minutos: 35, porosidad: "Media", tratamiento: "", nota: "" };

/* fórmulas frecuentes: se guardan con un toque y después se pueden ajustar */
const FRECUENTES: { nombre: string; formula: Pick<Formula, "mezcla" | "oxidante" | "minutos"> & { tratamiento?: string } }[] = [
  { nombre: "Matiz frío 8.12 + 20 Vol", formula: { mezcla: "Matiz frío 8.12", oxidante: "20 Vol", minutos: 20 } },
  { nombre: "Cobertura raíz 6.0 + 20 Vol", formula: { mezcla: "Cobertura de raíz 6.0", oxidante: "20 Vol", minutos: 35 } },
  { nombre: "Hidratación Olaplex 1+2", formula: { mezcla: "Hidratación Olaplex 1+2", oxidante: "Sin oxidante", minutos: 20, tratamiento: "Olaplex No.1 y No.2" } },
];

function Editor({ cita, atelier, nombre }: { cita: Cita; atelier: Atelier; nombre: string }) {
  /* la última fórmula de la clienta, para partir de ella */
  const anterior = atelier.citas
    .filter((c) => c.clienta === cita.clienta && c.id !== cita.id && c.formula && c.fecha <= cita.fecha)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))[0]?.formula;
  /* la porosidad es de la clienta: se parte de la última anotada */
  const enBlanco: Formula = { ...VACIA, porosidad: anterior?.porosidad ?? VACIA.porosidad };
  const [f, setF] = useState<Formula>(cita.formula ?? enBlanco);
  const [error, setError] = useState("");
  const [guardada, setGuardada] = useState(false);
  /* lo que había antes del último toque rápido, para poder deshacerlo */
  const [previa, setPrevia] = useState<{ formula: Formula | null } | null>(null);

  const poner = (x: Partial<Formula>) => {
    setF((v) => ({ ...v, ...x }));
    setGuardada(false);
    setPrevia(null);
    setError("");
  };

  function guardarFrecuente(x: (typeof FRECUENTES)[number]["formula"]) {
    if (cita.formula?.mezcla === x.mezcla) return;
    const nueva: Formula = { ...VACIA, porosidad: f.porosidad, nota: f.nota.trim(), ...x };
    setPrevia({ formula: cita.formula });
    setF(nueva);
    setError("");
    setGuardada(true);
    atelier.cambiar(cita.id, { formula: nueva });
  }

  function deshacer() {
    if (!previa) return;
    atelier.cambiar(cita.id, { formula: previa.formula });
    setF(previa.formula ?? enBlanco);
    setPrevia(null);
    setGuardada(false);
  }

  function guardar(e: FormEvent) {
    e.preventDefault();
    if (!f.mezcla.trim()) return setError("Escriba la mezcla aplicada.");
    if (!(f.minutos > 0 && f.minutos <= 180)) return setError("El tiempo de pose va de 1 a 180 minutos.");
    atelier.cambiar(cita.id, { formula: { ...f, mezcla: f.mezcla.trim(), tratamiento: f.tratamiento.trim(), nota: f.nota.trim() } });
    setPrevia(null);
    setGuardada(true);
  }

  const aviso = guardada && (
    <p className="al-aviso" role="status">
      <CheckCircle2 size={16} aria-hidden /> Guardada en el expediente de {nombre}.
      {previa && (
        <button type="button" className="al-enlace" onClick={deshacer}>
          Deshacer
        </button>
      )}
    </p>
  );

  return (
    <details className="al-editor">
      <summary>
        <span>
          <FlaskConical size={16} aria-hidden /> {cita.formula ? "Fórmula guardada" : faltan(cita.fecha) > 0 ? "Preparar fórmula química" : "Fórmula química aplicada"}
        </span>
        <ChevronDown size={17} aria-hidden />
      </summary>
      <form onSubmit={guardar} noValidate>
        <fieldset>
          <legend>Guardar con un toque</legend>
          <div className="al-chips">
            {FRECUENTES.map((x) => (
              <button key={x.nombre} type="button" aria-pressed={cita.formula?.mezcla === x.formula.mezcla} onClick={() => guardarFrecuente(x.formula)}>
                {cita.formula?.mezcla === x.formula.mezcla && <Check size={14} aria-hidden />}
                {x.nombre}
              </button>
            ))}
          </div>
        </fieldset>
        {previa && aviso}
        {anterior && !cita.formula && (
          <button type="button" className="al-enlace" style={{ justifySelf: "start" }} onClick={() => poner(anterior)}>
            Copiar la fórmula anterior
          </button>
        )}
        <label className="al-campo">
          Mezcla (gramos y tonos)
          <textarea value={f.mezcla} onChange={(e) => poner({ mezcla: e.target.value })} placeholder="40 g tinte 7.1 + 20 g tinte 8.12" maxLength={200} />
        </label>
        <div className="al-dos-campos">
          <label className="al-campo">
            Oxidante
            <select value={f.oxidante} onChange={(e) => poner({ oxidante: e.target.value })}>
              {OXIDANTES.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="al-campo">
            Pose (minutos)
            <input type="number" inputMode="numeric" min={1} max={180} value={f.minutos || ""} onChange={(e) => poner({ minutos: Number(e.target.value) })} />
          </label>
        </div>
        <fieldset>
          <legend>Porosidad</legend>
          <div className="al-segmentos">
            {POROSIDADES.map((p) => (
              <label key={p}>
                <input type="radio" name={`al-poro-${cita.id}`} checked={f.porosidad === p} onChange={() => poner({ porosidad: p })} />
                <span>{p}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="al-campo">
          Tratamiento aplicado
          <input value={f.tratamiento} onChange={(e) => poner({ tratamiento: e.target.value })} placeholder="Olaplex No.1 y No.2" maxLength={80} />
        </label>
        <label className="al-campo">
          Nota para la próxima visita
          <input value={f.nota} onChange={(e) => poner({ nota: e.target.value })} maxLength={140} />
        </label>
        {error && (
          <p className="al-error" role="alert">
            {error}
          </p>
        )}
        {!previa && aviso}
        <button type="submit" className="al-btn al-terra">
          Guardar fórmula
        </button>
      </form>
    </details>
  );
}
