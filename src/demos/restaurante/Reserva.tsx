/* Ventana para reservar: zona, personas, fecha, hora (solo las que tienen cupo) y datos. */
import { useState, type FormEvent } from "react";
import { Check, MessageCircle } from "lucide-react";
import { Contador, Ventana } from "./Piezas";
import { ZONAS, enlaceWhatsApp, fechaLarga, foto, horasConCupo, horasDe, hoyISO, masDias, mensajeReserva, zonaDe, type Brasa, type Reserva as TReserva, type ZonaId } from "./datos";

export function Horas({ horas, valor, alElegir }: { horas: { hora: string; libre: boolean }[]; valor: string; alElegir: (h: string) => void }) {
  if (!horas.length) return <p className="bm-nota">Para ese día ya no quedan horas. Elija otra fecha.</p>;
  return (
    <div className="bm-horas" role="group" aria-label="Hora">
      {horas.map(({ hora, libre }) => (
        <button key={hora} type="button" disabled={!libre} aria-pressed={valor === hora} aria-label={libre ? hora : `${hora}, sin cupo`} onClick={() => alElegir(hora)}>
          {hora}
        </button>
      ))}
    </div>
  );
}

/* se monta de nuevo cada vez que se abre, así empieza limpia con la zona elegida */
export function Reserva({ b, zonaInicial, alCerrar, alVer }: { b: Brasa; zonaInicial: ZonaId; alCerrar: () => void; alVer: () => void }) {
  const primerDia = horasDe(hoyISO()).length ? hoyISO() : masDias(1);
  const [zona, setZona] = useState<ZonaId>(zonaInicial);
  const [personas, setPersonas] = useState(Math.max(2, zonaDe(zonaInicial).min));
  const [fecha, setFecha] = useState(primerDia);
  const [hora, setHora] = useState("");
  const [nombre, setNombre] = useState(b.estado.cliente.nombre);
  const [telefono, setTelefono] = useState(b.estado.cliente.telefono);
  const [errores, setErrores] = useState<Partial<Record<"fecha" | "hora" | "nombre" | "telefono", string>>>({});
  const [hecha, setHecha] = useState<TReserva | null>(null);

  const z = zonaDe(zona);
  const horas = horasConCupo(fecha, zona, b.estado.reservas);
  const horaValida = horas.some((h) => h.hora === hora && h.libre) ? hora : "";

  function elegirZona(nueva: ZonaId) {
    const n = zonaDe(nueva);
    setZona(nueva);
    setPersonas((p) => Math.min(n.max, Math.max(n.min, p)));
  }

  function confirmar(ev: FormEvent) {
    ev.preventDefault();
    const e: typeof errores = {};
    if (!fecha || fecha < hoyISO() || fecha > masDias(60)) e.fecha = "Elija un día dentro de los próximos dos meses.";
    else if (!horaValida) e.hora = "Elija una hora.";
    if (nombre.trim().length < 2) e.nombre = "Escriba a nombre de quién va la mesa.";
    if (telefono.replace(/\D/g, "").length !== 8) e.telefono = "Escriba un teléfono de 8 números.";
    setErrores(e);
    const primero = Object.keys(e)[0];
    if (primero) {
      const el = document.getElementById(`bm-r-${primero}`);
      el?.focus();
      el?.scrollIntoView({ block: "center" });
      return;
    }
    b.ponerCliente({ nombre: nombre.trim(), telefono: telefono.trim() });
    setHecha(b.reservar({ zona, personas, fecha, hora: horaValida, nombre: nombre.trim(), telefono: telefono.trim() }));
  }

  if (hecha) {
    return (
      <Ventana abierta alCerrar={alCerrar} titulo="Mesa confirmada">
        <div className="bm-listo">
          <span className="bm-listo-icono">
            <Check size={30} aria-hidden />
          </span>
          <p className="bm-listo-codigo">{hecha.codigo}</p>
          <p>
            <b>
              {fechaLarga(hecha.fecha)}, {hecha.hora}
            </b>
            <br />
            {hecha.personas} {hecha.personas === 1 ? "persona" : "personas"} · {zonaDe(hecha.zona).nombre} · {hecha.nombre}
          </p>
          <button
            type="button"
            className="bm-btn bm-terra"
            onClick={() => {
              alCerrar();
              alVer();
            }}
          >
            Ver mi reserva
          </button>
          <a className="bm-btn bm-linea" href={enlaceWhatsApp(mensajeReserva(hecha))} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} aria-hidden /> Enviar por WhatsApp
          </a>
        </div>
      </Ventana>
    );
  }

  return (
    <Ventana
      abierta
      alCerrar={alCerrar}
      titulo="Reservar mesa"
      nota="Guardamos su mesa 15 minutos."
      pie={
        <button type="submit" form="bm-reserva" className="bm-btn bm-terra bm-lleno">
          Confirmar reserva{horaValida ? ` · ${horaValida}` : ""}
        </button>
      }
    >
      <form id="bm-reserva" className="bm-form" onSubmit={confirmar} noValidate>
        <fieldset>
          <legend>Zona</legend>
          <div className="bm-elige-zona">
            {ZONAS.map((x) => (
              <button key={x.id} type="button" aria-pressed={zona === x.id} onClick={() => elegirZona(x.id)}>
                <img src={foto(x.foto, 320, 220)} alt="" />
                <span>{x.nombre}</span>
              </button>
            ))}
          </div>
          <p className="bm-nota">{z.detalle}</p>
        </fieldset>

        <div className="bm-campos">
          <div className="bm-campo">
            <span>Personas</span>
            <Contador valor={personas} min={z.min} max={z.max} que="personas" alCambiar={setPersonas} />
          </div>
          <label className="bm-campo">
            <span>Fecha</span>
            <input
              id="bm-r-fecha"
              type="date"
              value={fecha}
              min={primerDia}
              max={masDias(60)}
              aria-invalid={!!errores.fecha}
              onChange={(e) => {
                setFecha(e.target.value);
                setErrores((x) => ({ ...x, fecha: undefined }));
              }}
            />
            {errores.fecha && <em role="alert">{errores.fecha}</em>}
          </label>
        </div>

        <fieldset id="bm-r-hora" tabIndex={-1}>
          <legend>Hora</legend>
          <Horas
            horas={horas}
            valor={horaValida}
            alElegir={(h) => {
              setHora(h);
              setErrores((x) => ({ ...x, hora: undefined }));
            }}
          />
          {errores.hora && (
            <em className="bm-error" role="alert">
              {errores.hora}
            </em>
          )}
        </fieldset>

        <div className="bm-campos">
          <label className="bm-campo">
            <span>A nombre de</span>
            <input
              id="bm-r-nombre"
              value={nombre}
              autoComplete="name"
              aria-invalid={!!errores.nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setErrores((x) => ({ ...x, nombre: undefined }));
              }}
            />
            {errores.nombre && <em role="alert">{errores.nombre}</em>}
          </label>
          <label className="bm-campo">
            <span>Teléfono</span>
            <input
              id="bm-r-telefono"
              value={telefono}
              inputMode="tel"
              autoComplete="tel-national"
              aria-invalid={!!errores.telefono}
              onChange={(e) => {
                setTelefono(e.target.value);
                setErrores((x) => ({ ...x, telefono: undefined }));
              }}
            />
            {errores.telefono && <em role="alert">{errores.telefono}</em>}
          </label>
        </div>
      </form>
    </Ventana>
  );
}
