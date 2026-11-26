/*
 * La reserva vive abajo: una cápsula con noches, habitación y total, y un panel que sube
 * con el desglose, los datos de quien llega y la solicitud por WhatsApp.
 */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, ChevronUp, MessageCircle, X } from "lucide-react";
import { useCifra } from "./animar";
import {
  CANCELACION, EXTRAS, HORAS, cuenta, dinero, fechaBreve, fechaCorta, mensajeSolicitud, revisar, tarifa, textoHuespedes, textoNoches, whatsapp,
  type Datos, type Estancia, type ExtraId, type Habitacion,
} from "./datos";

type Comun = { estancia: Estancia; habitacion: Habitacion | null; extras: ExtraId[] };

export function Capsula({ estancia, habitacion, extras, visible, alRevisar, alVerHabitaciones }: Comun & { visible: boolean; alRevisar: () => void; alVerHabitaciones: () => void }) {
  const c = cuenta(estancia, habitacion, extras);
  const total = useRef<HTMLSpanElement>(null);
  useCifra(total, c.total, dinero);
  return (
    <aside className="pv-capsula pv-oscuro" data-visible={visible} aria-label="Su reserva">
      <div className="min-w-0">
        <p className="pv-num truncate text-[0.8rem] text-white/75">
          {textoNoches(c.noches)} · {fechaBreve(estancia.llegada)} al {fechaBreve(estancia.salida)}
        </p>
        <p className="truncate font-semibold leading-snug">{habitacion ? habitacion.nombre : "Elija una habitación"}</p>
      </div>
      <div className={`text-right ${habitacion ? "" : "hidden"}`}>
        <p className="pv-num text-[1.3rem] font-bold leading-tight">
          <span ref={total}>{dinero(c.total)}</span>
        </p>
        <p className="text-[0.74rem] text-white/70">con impuestos</p>
      </div>
      {habitacion ? (
        <button type="button" className="pv-btn pv-accion" onClick={alRevisar}>
          Revisar reserva <ChevronUp size={18} aria-hidden />
        </button>
      ) : (
        <button type="button" className="pv-btn pv-accion" onClick={alVerHabitaciones}>
          Ver habitaciones <ArrowRight size={18} aria-hidden />
        </button>
      )}
    </aside>
  );
}

const CAMPOS: (keyof Datos)[] = ["nombre", "telefono", "hora"];

export function Panel({
  abierto,
  estancia,
  habitacion,
  extras,
  datos,
  alCerrar,
  alExtra,
  alEscribir,
}: Comun & { abierto: boolean; datos: Datos; alCerrar: () => void; alExtra: (id: ExtraId) => void; alEscribir: (d: Datos) => void }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [intento, setIntento] = useState(false);
  const [enviado, setEnviado] = useState<string | null>(null);
  const c = cuenta(estancia, habitacion, extras);
  const total = useRef<HTMLSpanElement>(null);
  useCifra(total, c.total, dinero);
  const errores = intento ? revisar(datos) : {};
  const mensaje = habitacion ? mensajeSolicitud(estancia, habitacion, extras, datos) : "";

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setIntento(true);
    const faltan = revisar(datos);
    const primero = CAMPOS.find((k) => faltan[k]);
    if (primero) {
      document.getElementById(`pv-${primero}`)?.focus();
      return;
    }
    window.open(whatsapp(mensaje), "_blank", "noopener,noreferrer");
    setEnviado(mensaje);
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

  return (
    <dialog
      ref={dialogo}
      className="pv-panel"
      aria-labelledby="pv-titulo-reserva"
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === dialogo.current) alCerrar();
      }}
    >
      <header className="pv-oscuro flex items-center justify-between gap-3 bg-[#1b2e26] py-3 pl-5 pr-3 text-white sm:pl-7">
        <h2 id="pv-titulo-reserva" className="text-[1.4rem]">
          Su reserva
        </h2>
        <button type="button" className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10" aria-label="Cerrar" onClick={alCerrar}>
          <X size={22} aria-hidden />
        </button>
      </header>
      {habitacion && (
        <div className="pv-cuerpo">
          <div className="flex gap-4">
            <img src={habitacion.foto} alt="" className="h-[5.5rem] w-[5.5rem] shrink-0 rounded-lg object-cover" />
            <div className="min-w-0">
              <h3 className="text-[1.15rem]">{habitacion.nombre}</h3>
              <p className="pv-suave pv-num mt-1 text-[0.9rem]">
                {fechaCorta(estancia.llegada)} al {fechaCorta(estancia.salida)}
                <br />
                {textoNoches(c.noches)} · {textoHuespedes(estancia.huespedes)}
              </p>
            </div>
          </div>

          <fieldset className="mt-6">
            <legend className="font-semibold">Extras opcionales</legend>
            <div className="mt-2 grid gap-2">
              {EXTRAS.map((x) => (
                <label key={x.id} className="pv-extra">
                  <input type="checkbox" checked={extras.includes(x.id)} onChange={() => alExtra(x.id)} />
                  <span className="flex-1 text-[0.92rem] font-medium leading-snug">{x.nombre}</span>
                  <span className="pv-num font-semibold">{tarifa(x.precio)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <dl className="pv-cuentas pv-num mt-6 border-t border-[#e5e0d8] pt-4 text-[0.95rem]">
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
              <dd className="text-[1.6rem] !font-bold">
                <span ref={total}>{dinero(c.total)}</span>
              </dd>
            </div>
          </dl>

          <form className="mt-6 grid gap-4" onSubmit={enviar} noValidate>
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
            <button type="submit" className="pv-btn pv-accion w-full">
              <MessageCircle size={19} aria-hidden /> Enviar solicitud por WhatsApp
            </button>
          </form>
          <p role="status" className="mt-3 text-[0.9rem] font-semibold">
            {enviado === mensaje && (
              <>
                Abrimos WhatsApp con su solicitud lista para enviar.{" "}
                <a href={whatsapp(mensaje)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  Abrir de nuevo
                </a>
              </>
            )}
          </p>
          <p className="pv-suave mt-2 text-[0.85rem]">
            Su reserva queda confirmada cuando la posada le responda. {CANCELACION} Usamos sus datos solo para atender esta solicitud.
          </p>
        </div>
      )}
    </dialog>
  );
}
