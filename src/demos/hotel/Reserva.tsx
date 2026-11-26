/*
 * La reserva: una ventana que lleva de la mano en cuatro pasos (fechas, habitación,
 * extras y datos) y una cápsula abajo para volver a ella sin perder nada.
 */
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronUp, Send, X } from "lucide-react";
import { useCifra } from "./animar";
import Calendario from "./Calendario";
import { CasillaFecha, Huespedes } from "./Disponibilidad";
import {
  CANCELACION, EXTRAS, HABITACIONES, HORAS, cuenta, dinero, fechaBreve, fechaCorta, mensajeSolicitud, respuestaSolicitud, revisar, tarifa, textoHuespedes, textoNoches,
  type Datos, type Estancia, type ExtraId, type Habitacion,
} from "./datos";

type Comun = { estancia: Estancia; habitacion: Habitacion | null; extras: ExtraId[] };

export function Capsula({ estancia, habitacion, extras, visible, alContinuar }: Comun & { visible: boolean; alContinuar: () => void }) {
  const c = cuenta(estancia, habitacion, extras);
  const total = useRef<HTMLSpanElement>(null);
  useCifra(total, c.total, dinero);
  return (
    <aside className="pv-capsula pv-oscuro" data-visible={visible} aria-label="Su reserva">
      <div className="min-w-0">
        <p className="pv-num truncate text-[0.8rem] text-white/75">
          {textoNoches(c.noches)} · {fechaBreve(estancia.llegada)} al {fechaBreve(estancia.salida)}
        </p>
        <p className="truncate font-semibold leading-snug">{habitacion ? habitacion.nombre : "Falta elegir habitación"}</p>
      </div>
      <div className={`text-right ${habitacion ? "" : "hidden"}`}>
        <p className="pv-num text-[1.3rem] font-bold leading-tight">
          <span ref={total}>{dinero(c.total)}</span>
        </p>
        <p className="text-[0.74rem] text-white/70">con impuestos</p>
      </div>
      <button type="button" className="pv-btn pv-accion" onClick={alContinuar}>
        {habitacion ? "Revisar reserva" : "Elegir habitación"} <ChevronUp size={18} aria-hidden />
      </button>
    </aside>
  );
}

/* cómo se abre la ventana: la reserva completa en cierto paso, o solo el calendario */
export type Apertura = { modo: "reserva" | "fechas"; paso: number; cual?: "llegada" | "salida" };

const PASOS = [
  { corto: "Fechas", titulo: "¿Cuándo nos visita?" },
  { corto: "Habitación", titulo: "Elija su habitación" },
  { corto: "Extras", titulo: "¿Desea agregar algo?" },
  { corto: "Sus datos", titulo: "Revise y envíe" },
];
const CAMPOS: (keyof Datos)[] = ["nombre", "telefono", "hora"];

function Resumen({ titulo, alCambiar, children }: { titulo: string; alCambiar: () => void; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[#e5e0d8] py-3">
      <div className="min-w-0">
        <p className="pv-suave text-[0.82rem] font-semibold">{titulo}</p>
        <div className="pv-num font-semibold leading-snug">{children}</div>
      </div>
      <button type="button" className="pv-cambiar" onClick={alCambiar} aria-label={`Cambiar ${titulo.toLowerCase()}`}>
        Cambiar
      </button>
    </div>
  );
}

export function Ventana({
  apertura,
  estancia,
  habitacion,
  extras,
  datos,
  aviso,
  alCerrar,
  alEstancia,
  alElegir,
  alExtra,
  alEscribir,
  alFijarFechas,
  alEnviar,
}: Comun & {
  apertura: Apertura;
  datos: Datos;
  aviso: string;
  alCerrar: () => void;
  alEstancia: (e: Estancia) => void;
  alElegir: (id: string) => void;
  alExtra: (id: ExtraId) => void;
  alEscribir: (d: Datos) => void;
  alFijarFechas: () => void;
  alEnviar: (mensaje: string, respuesta: string) => void;
}) {
  const soloFechas = apertura.modo === "fechas";
  const [paso, setPaso] = useState(apertura.paso);
  /* llegada ya tocada, esperando la salida */
  const [pendiente, setPendiente] = useState<string | null>(apertura.cual === "salida" ? estancia.llegada : null);
  const [intento, setIntento] = useState(false);
  const dialogo = useRef<HTMLDialogElement>(null);
  const cuerpo = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const total = useRef<HTMLSpanElement>(null);
  const c = cuenta(estancia, habitacion, extras);
  useCifra(total, c.total, dinero);
  const errores = intento ? revisar(datos) : {};
  const caben = HABITACIONES.filter((h) => estancia.huespedes <= h.personas);

  useEffect(() => {
    const d = dialogo.current;
    if (d && !d.open) d.showModal();
  }, []);

  /* cada paso empieza arriba */
  useEffect(() => {
    if (cuerpo.current) cuerpo.current.scrollTop = 0;
    titulo.current?.focus({ preventScroll: true });
  }, [paso]);

  const cerrar = () => dialogo.current?.close();

  const tocarDia = (iso: string) => {
    if (pendiente && iso > pendiente) {
      alEstancia({ ...estancia, llegada: pendiente, salida: iso });
      setPendiente(null);
    } else setPendiente(iso);
  };

  const seguir = () => {
    if (paso === 0) alFijarFechas();
    if (soloFechas) cerrar();
    else setPaso(paso + 1);
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setIntento(true);
    const faltan = revisar(datos);
    const primero = CAMPOS.find((k) => faltan[k]);
    if (primero) {
      document.getElementById(`pv-${primero}`)?.focus();
      return;
    }
    if (habitacion) alEnviar(mensajeSolicitud(estancia, habitacion, extras, datos), respuestaSolicitud(estancia, habitacion, extras, datos));
  };

  const campo = (k: keyof Datos) => ({
    id: `pv-${k}`,
    className: "pv-campo",
    value: datos[k],
    "aria-invalid": Boolean(errores[k]),
    "aria-describedby": errores[k] ? `pv-error-${k}` : undefined,
  });
  const error = (k: keyof Datos) =>
    errores[k] && (
      <p id={`pv-error-${k}`} className="pv-error">
        {errores[k]}
      </p>
    );

  const falta = paso === 0 && pendiente ? "Elija la salida" : paso === 1 && !habitacion ? "Elija una habitación" : null;

  return (
    <dialog
      ref={dialogo}
      className="pv-ventana"
      data-modo={apertura.modo}
      aria-labelledby="pv-titulo-ventana"
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === dialogo.current) cerrar();
      }}
    >
      <header className="pv-oscuro shrink-0 bg-[#1b2e26] pb-3 pl-5 pr-3 pt-3 text-white sm:pl-7">
        <div className="flex items-center justify-between gap-3">
          <h2 id="pv-titulo-ventana" className="text-[1.35rem]">
            {soloFechas ? "Elija sus fechas" : "Reserve su estadía"}
          </h2>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10" aria-label="Cerrar" onClick={cerrar}>
            <X size={22} aria-hidden />
          </button>
        </div>
        {!soloFechas && (
          <ol className="pv-avance mr-2">
            {PASOS.map((p, i) => (
              <li key={p.corto}>
                <button type="button" data-estado={i < paso ? "hecho" : i === paso ? "actual" : "falta"} aria-current={i === paso ? "step" : undefined} disabled={i > paso} onClick={() => setPaso(i)}>
                  <span>
                    {i + 1}. {p.corto}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        )}
      </header>

      <div ref={cuerpo} className="pv-cuerpo">
        <div key={paso} className="pv-entra">
          <h3 ref={titulo} tabIndex={-1} className="pv-paso-titulo">
            {PASOS[paso].titulo}
          </h3>
          {aviso && paso < 2 && (
            <p role="status" className="mt-3 rounded-lg border border-[#b45309] bg-white px-4 py-3 text-[0.92rem] font-semibold">
              {aviso}
            </p>
          )}

          {paso === 0 && (
            <>
              <p className="pv-suave mt-1 text-[0.95rem]" aria-live="polite">
                {pendiente ? "Ahora toque el día de salida." : "Toque el día que llega y después el día que sale."}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <CasillaFecha rotulo="Llegada" fecha={pendiente ?? estancia.llegada} activa={!pendiente} alTocar={() => setPendiente(null)} />
                <CasillaFecha rotulo="Salida" fecha={pendiente ? null : estancia.salida} activa={Boolean(pendiente)} alTocar={() => setPendiente(pendiente ?? estancia.llegada)} />
              </div>
              <div className="mt-5">
                <Calendario llegada={pendiente ?? estancia.llegada} salida={pendiente ? null : estancia.salida} alTocar={tocarDia} />
              </div>
              {!soloFechas && (
                <div className="mt-5 sm:max-w-[20rem]">
                  <Huespedes id="pv-huespedes-ventana" valor={estancia.huespedes} alCambiar={(huespedes) => alEstancia({ ...estancia, huespedes })} />
                </div>
              )}
            </>
          )}

          {paso === 1 && (
            <>
              <p className="pv-suave mt-1 text-[0.95rem]">
                {caben.length === HABITACIONES.length
                  ? `Todas reciben a ${textoHuespedes(estancia.huespedes)}.`
                  : `Le mostramos las que reciben a ${textoHuespedes(estancia.huespedes)}.`}
              </p>
              <div className="mt-4 grid gap-3" role="group" aria-label="Habitaciones">
                {caben.map((h) => {
                  const puesta = habitacion?.id === h.id;
                  return (
                    <button key={h.id} type="button" className="pv-opcion pv-sala" aria-pressed={puesta} onClick={() => alElegir(h.id)}>
                      <img src={h.foto} alt="" width={900} height={675} />
                      <span className="min-w-0">
                        <span className="pv-opcion-nombre">{h.nombre}</span>
                        <span className="pv-suave block text-[0.82rem] leading-snug">
                          {h.cama} · {h.metros} m² · hasta {h.personas}
                        </span>
                        <span className="pv-num mt-1 block leading-snug">
                          <b className="text-[1.05rem]">{tarifa(h.tarifa)}</b> <span className="pv-suave text-[0.82rem]">por noche</span>
                        </span>
                      </span>
                      <span className="pv-marca" aria-hidden>
                        {puesta && <Check size={16} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {paso === 2 && (
            <>
              <p className="pv-suave mt-1 text-[0.95rem]">Es opcional. Toque lo que quiera sumar, o continúe sin nada.</p>
              <div className="mt-4 grid gap-3" role="group" aria-label="Extras">
                {EXTRAS.map((x) => {
                  const puesto = extras.includes(x.id);
                  return (
                    <button key={x.id} type="button" className="pv-opcion pv-adicional" aria-pressed={puesto} onClick={() => alExtra(x.id)}>
                      <span className="pv-marca" aria-hidden>
                        {puesto && <Check size={16} />}
                      </span>
                      <span className="min-w-0">
                        <span className="pv-opcion-nombre">{x.nombre}</span>
                        <span className="pv-suave block text-[0.85rem] leading-snug">{x.detalle}</span>
                      </span>
                      <span className="pv-num text-[1.05rem] font-bold">+ {tarifa(x.precio)}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {paso === 3 && habitacion && (
            <>
              <div className="mt-2">
                <Resumen titulo="Fechas" alCambiar={() => setPaso(0)}>
                  {fechaCorta(estancia.llegada)} al {fechaCorta(estancia.salida)} · {textoHuespedes(estancia.huespedes)}
                </Resumen>
                <Resumen titulo="Habitación" alCambiar={() => setPaso(1)}>
                  {habitacion.nombre}
                </Resumen>
                <Resumen titulo="Extras" alCambiar={() => setPaso(2)}>
                  {c.extras.length ? c.extras.map((x) => x.nombre).join(", ") : "Sin extras"}
                </Resumen>
              </div>

              <dl className="pv-cuentas pv-num mt-4 text-[0.95rem]">
                <div>
                  <dt>
                    Hospedaje ({textoNoches(c.noches)} × {tarifa(habitacion.tarifa)})
                  </dt>
                  <dd>{dinero(c.hospedaje)}</dd>
                </div>
                {c.extras.map((x) => (
                  <div key={x.id}>
                    <dt>{x.nombre}</dt>
                    <dd>{dinero(x.precio * 100)}</dd>
                  </div>
                ))}
                <div className="border-t border-[#e5e0d8] pt-2">
                  <dt>Subtotal</dt>
                  <dd>{dinero(c.subtotal)}</dd>
                </div>
                <div className="pv-suave">
                  <dt>INGUAT 10% (sobre hospedaje)</dt>
                  <dd>{dinero(c.inguat)}</dd>
                </div>
                <div className="pv-suave">
                  <dt>IVA 12%</dt>
                  <dd>{dinero(c.iva)}</dd>
                </div>
                <div className="items-baseline border-t border-[#1b2e26] pt-3">
                  <dt className="font-semibold">Total</dt>
                  <dd className="text-[1.4rem] !font-bold">{dinero(c.total)}</dd>
                </div>
              </dl>

              <form id="pv-solicitud" className="mt-6 grid gap-4" onSubmit={enviar} noValidate>
                <div>
                  <label htmlFor="pv-nombre" className="pv-rotulo">
                    Nombre y apellido
                  </label>
                  <input {...campo("nombre")} type="text" autoComplete="name" onChange={(e) => alEscribir({ ...datos, nombre: e.target.value })} />
                  {error("nombre")}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pv-telefono" className="pv-rotulo">
                      Teléfono
                    </label>
                    <input {...campo("telefono")} type="tel" inputMode="tel" autoComplete="tel" onChange={(e) => alEscribir({ ...datos, telefono: e.target.value })} />
                    {error("telefono")}
                  </div>
                  <div>
                    <label htmlFor="pv-hora" className="pv-rotulo">
                      Hora estimada de llegada
                    </label>
                    <select {...campo("hora")} onChange={(e) => alEscribir({ ...datos, hora: e.target.value })}>
                      <option value="">Elegir hora</option>
                      {HORAS.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    {error("hora")}
                  </div>
                </div>
              </form>
              <p className="pv-suave mt-5 text-[0.85rem]">
                Su reserva queda confirmada cuando la posada le responda. {CANCELACION} Usamos sus datos solo para atender esta solicitud.
              </p>
            </>
          )}
        </div>
      </div>

      <footer className="pv-ventana-pie">
        <div className="min-w-0">
          <p className={`pv-num text-[1.3rem] font-bold leading-tight ${habitacion ? "" : "hidden"}`}>
            <span ref={total}>{dinero(c.total)}</span>
          </p>
          <p className="pv-suave pv-num truncate text-[0.82rem]">
            {textoNoches(c.noches)}
            {habitacion ? " · con impuestos" : ` · ${fechaBreve(estancia.llegada)} al ${fechaBreve(estancia.salida)}`}
          </p>
        </div>
        <div className="pv-ventana-botones">
          {!soloFechas && paso > 0 && (
            <button type="button" className="pv-btn pv-linea" onClick={() => setPaso(paso - 1)}>
              <ArrowLeft size={18} aria-hidden /> Atrás
            </button>
          )}
          {paso === 3 && !soloFechas ? (
            <button key="enviar" type="submit" form="pv-solicitud" className="pv-btn pv-accion flex-1">
              <Send size={18} aria-hidden /> Enviar solicitud
            </button>
          ) : (
            <button key="seguir" type="button" className="pv-btn pv-accion flex-1" disabled={falta !== null} onClick={seguir}>
              {falta ?? (soloFechas ? "Listo" : paso === 2 && !extras.length ? "Continuar sin extras" : "Continuar")}
              {falta === null && !soloFechas && <ArrowRight size={18} aria-hidden />}
            </button>
          )}
        </div>
      </footer>
    </dialog>
  );
}
