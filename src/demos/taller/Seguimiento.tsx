/* Vista "Seguimiento por Placa": lo que ve el cliente de su orden, con aprobación en vivo. */
import { useRef, useState, type FormEvent } from "react";
import { CalendarClock, Check, CircleAlert, Fuel, Gauge, MessageCircle, Search, ShieldCheck, ThumbsUp, UserRound, Wrench } from "lucide-react";
import { useLinea } from "./animar";
import { Cifra, Placa } from "./Piezas";
import { ETAPAS, enlaceWhatsApp, fechaCorta, miles, nombreEtapa, normalizarPlaca, ordenDe, qz, reloj, totalDe, type Orden, type Taller } from "./datos";

const PRINCIPALES = ["P-482JKL", "P-915MTR"];

export function Seguimiento({ taller, placa, alElegir, alAgendar }: { taller: Taller; placa: string; alElegir: (placa: string) => void; alAgendar: () => void }) {
  const [texto, setTexto] = useState("");
  const [aviso, setAviso] = useState("");
  const orden = ordenDe(taller.estado.ordenes, placa);
  const accesos = PRINCIPALES.includes(placa) || !orden ? PRINCIPALES : [...PRINCIPALES, placa];

  function buscar(e: FormEvent) {
    e.preventDefault();
    const p = normalizarPlaca(texto);
    if (!p) {
      setAviso("Escriba la placa como aparece en el vehículo: letra, tres números y tres letras.");
      return;
    }
    setAviso("");
    setTexto("");
    alElegir(p);
  }

  return (
    <>
      <section className="at-buscador">
        <div className="at-ancho">
          <h1>Siga su vehículo por la placa</h1>
          <p>Vea la etapa, quién lo atiende y apruebe trabajos adicionales desde su teléfono.</p>
          <form onSubmit={buscar} role="search">
            <label className="at-oculto" htmlFor="at-buscar">
              Número de placa
            </label>
            <input id="at-buscar" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="P-123BCD" autoCapitalize="characters" maxLength={9} />
            <button type="submit" className="at-btn at-naranja">
              <Search size={18} aria-hidden /> Buscar
            </button>
          </form>
          {aviso && (
            <p className="at-buscar-aviso" role="alert">
              {aviso}
            </p>
          )}
          <div className="at-accesos" role="group" aria-label="Placas activas">
            {accesos.map((p) => {
              const o = ordenDe(taller.estado.ordenes, p);
              return (
                <button key={p} type="button" aria-pressed={p === placa} onClick={() => alElegir(p)}>
                  <b>{p}</b>
                  <span>{o?.vehiculo}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="at-seccion at-acero">
        <div className="at-ancho">
          {orden ? (
            <Ficha taller={taller} orden={orden} />
          ) : (
            <div className="at-vacio" role="status">
              <Search size={30} aria-hidden />
              <h2>No hay una orden activa para {placa}</h2>
              <p>Revise la placa o agende el ingreso de su vehículo.</p>
              <button type="button" className="at-btn at-naranja" onClick={alAgendar}>
                Agendar servicio
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Ficha({ taller, orden: o }: { taller: Taller; orden: Orden }) {
  const linea = useRef<HTMLOListElement>(null);
  const avance = o.etapa === 0 ? 0 : Math.min(o.etapa, 5) - 1;
  useLinea(linea, o.codigo, avance);
  const h = o.hallazgo;
  const r = o.recepcion;
  const porAprobar = o.etapa === 3;

  const checklist = [
    { listo: r.sinGolpes, texto: "Sin golpes nuevos", falta: "Carrocería por revisar", icono: ShieldCheck },
    { listo: r.herramienta, texto: "Herramienta completa", falta: "Herramienta por verificar", icono: Wrench },
    { listo: !!r.combustible, texto: `Nivel combustible: ${r.combustible}`, falta: "Combustible por anotar", icono: Fuel },
    { listo: r.km !== null, texto: `Kilometraje: ${miles(r.km ?? 0)} km`, falta: "Kilometraje por anotar", icono: Gauge },
  ];

  return (
    <article className="at-ficha">
      <header className="at-ficha-alto">
        <Placa valor={o.placa} grande />
        <div>
          <h2>{o.vehiculo}</h2>
          <p>
            {o.cliente} · Orden {o.codigo}
          </p>
        </div>
        <span className={`at-estado ${porAprobar ? "at-estado-espera" : ""}`}>{nombreEtapa(o.etapa)}</span>
      </header>

      {o.etapa === 0 && o.cita && (
        <p className="at-franja">
          <CalendarClock size={19} aria-hidden /> Cita {fechaCorta(o.cita.fecha)} a las {o.cita.hora}. El seguimiento empieza cuando recibamos su vehículo.
        </p>
      )}
      {o.etapa === 6 && (
        <p className="at-franja">
          <Check size={19} aria-hidden /> Vehículo entregado. Su garantía queda registrada en esta orden.
        </p>
      )}

      <ol ref={linea} className="at-linea">
        {ETAPAS.map((nombre, i) => {
          const n = i + 1;
          const hecho = o.etapa > n;
          const actual = o.etapa === n;
          return (
            <li key={nombre} className={hecho ? "at-hecho" : actual ? "at-actual" : ""} style={{ "--i": i } as React.CSSProperties} aria-current={actual ? "step" : undefined}>
              {n < 5 && <i className="at-tramo" aria-hidden />}
              <span data-punto>{hecho ? <Check size={17} aria-label="Completada" /> : n}</span>
              <div>
                <b>{nombre}</b>
                <small>{o.marcas[n] ? reloj(o.marcas[n]) : "Pendiente"}</small>
              </div>
            </li>
          );
        })}
      </ol>

      {porAprobar && (
        <div className="at-aprobar">
          <CircleAlert size={26} aria-hidden />
          <div>
            <p className="at-aprobar-rotulo">{h ? "Hallazgo adicional" : "Presupuesto por aprobar"}</p>
            <h3>
              {h ? h.nombre : o.servicio} — {qz(h ? h.precio : o.costo)}
            </h3>
            <p>{h ? h.detalle : "Revise el precio y autorice para que su vehículo pase a la bahía."}</p>
          </div>
          <button type="button" className="at-btn at-naranja at-grande" onClick={() => taller.aprobar(o.codigo)}>
            <ThumbsUp size={19} aria-hidden /> {h ? "Aprobar trabajo adicional" : "Aprobar presupuesto"}
          </button>
        </div>
      )}
      {h?.aprobado && (
        <p className="at-franja at-franja-ok" role="status">
          <Check size={19} aria-hidden /> Usted aprobó: {h.nombre}, {qz(h.precio)}.
        </p>
      )}

      <div className="at-ficha-columnas">
        <section>
          <h3>Checklist de recepción</h3>
          <ul className="at-checklist">
            {checklist.map(({ listo, texto, falta, icono: Icono }) => (
              <li key={falta} className={listo ? "at-ok" : ""}>
                <Icono size={19} aria-hidden />
                <span>{listo ? texto : falta}</span>
                {listo && <Check size={17} aria-label="Verificado" />}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Presupuesto</h3>
          <dl className="at-cuentas">
            <div>
              <dt>{o.servicio}</dt>
              <dd>{qz(o.costo)}</dd>
            </div>
            {h && (
              <div className={h.aprobado ? "" : "at-tenue"}>
                <dt>
                  {h.nombre}
                  {!h.aprobado && " (sin aprobar)"}
                </dt>
                <dd>{qz(h.precio)}</dd>
              </div>
            )}
            <div className="at-total">
              <dt>Total con IVA</dt>
              <dd>
                <Cifra valor={totalDe(o)} formato={qz} key={o.codigo} />
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h3>Jefe de bahía</h3>
          <p className="at-jefe">
            <span>
              <UserRound size={22} aria-hidden />
            </span>
            <b>{o.jefe || "Por asignar"}</b>
          </p>
          <a
            className="at-btn at-contorno at-lleno"
            href={enlaceWhatsApp(`Hola, Autotech. Consulto por la orden ${o.codigo}, placa ${o.placa}.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} aria-hidden /> Consultar por WhatsApp
          </a>
        </section>
      </div>
    </article>
  );
}
