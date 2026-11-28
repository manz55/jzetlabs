/* Auxilio vial 24/7: falla, zona y ubicación, y el mensaje listo para WhatsApp. */
import { useState } from "react";
import { BatteryWarning, Check, CircleDot, LocateFixed, Send, Thermometer, Truck } from "lucide-react";
import { Campo, Ventana } from "./Piezas";
import { FALLAS, ZONAS_AUXILIO, enlaceWhatsApp, mensajeAuxilio, type FallaId } from "./datos";

const ICONOS = { bateria: BatteryWarning, pinchazo: CircleDot, calentamiento: Thermometer, grua: Truck };

type Ubicacion = { paso: "no" | "buscando" | "lista" | "fallo"; enlace: string };

export function Auxilio({ fallaInicial, alCerrar }: { fallaInicial: FallaId | ""; alCerrar: () => void }) {
  const [falla, setFalla] = useState<FallaId | "">(fallaInicial);
  const [zona, setZona] = useState("");
  const [referencia, setReferencia] = useState("");
  const [ubicacion, setUbicacion] = useState<Ubicacion>({ paso: "no", enlace: "" });
  const mensaje = mensajeAuxilio(falla, zona, referencia, ubicacion.enlace);
  const listo = falla !== "" && (zona !== "" || ubicacion.paso === "lista");

  function ubicar() {
    if (!navigator.geolocation) {
      setUbicacion({ paso: "fallo", enlace: "" });
      return;
    }
    setUbicacion({ paso: "buscando", enlace: "" });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setUbicacion({ paso: "lista", enlace: `https://maps.google.com/?q=${coords.latitude.toFixed(5)},${coords.longitude.toFixed(5)}` }),
      () => setUbicacion({ paso: "fallo", enlace: "" }),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <Ventana
      abierta
      urgente
      alCerrar={alCerrar}
      titulo="Auxilio vial 24/7"
      nota="Si hay heridos o riesgo en la vía, llame primero a los bomberos (122 o 123)."
      pie={
        listo ? (
          <a className="at-btn at-rojo at-lleno" href={enlaceWhatsApp(mensaje)} target="_blank" rel="noopener noreferrer">
            <Send size={18} aria-hidden /> Enviar por WhatsApp
          </a>
        ) : (
          <button type="button" className="at-btn at-rojo at-lleno" disabled>
            {falla ? "Indique su zona o comparta su ubicación" : "Elija qué le pasó al vehículo"}
          </button>
        )
      }
    >
      <fieldset className="at-fallas">
        <legend>¿Qué le pasó?</legend>
        {FALLAS.map((f) => {
          const Icono = ICONOS[f.id];
          return (
            <button key={f.id} type="button" aria-pressed={falla === f.id} onClick={() => setFalla(f.id)}>
              <Icono size={22} aria-hidden />
              <b>{f.nombre}</b>
              <small>{f.detalle}</small>
            </button>
          );
        })}
      </fieldset>

      <div className="at-formulario">
        <Campo nombre="¿Dónde está?" ancho>
          <select value={zona} onChange={(e) => setZona(e.target.value)}>
            <option value="">Elija su zona</option>
            {ZONAS_AUXILIO.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
        </Campo>
        <div className="at-campo-ancho">
          <button type="button" className="at-btn at-contorno at-lleno" onClick={ubicar} disabled={ubicacion.paso === "buscando"}>
            {ubicacion.paso === "lista" ? <Check size={18} aria-hidden /> : <LocateFixed size={18} aria-hidden />}
            {ubicacion.paso === "buscando" ? "Buscando su ubicación…" : ubicacion.paso === "lista" ? "Ubicación agregada al mensaje" : "Compartir mi ubicación exacta"}
          </button>
          {ubicacion.paso === "fallo" && (
            <p className="at-nota" role="alert">
              No se pudo obtener su ubicación. Elija la zona y escriba una referencia.
            </p>
          )}
        </div>
        <Campo nombre="Referencia (opcional)" ancho>
          <input value={referencia} onChange={(e) => setReferencia(e.target.value)} placeholder="Kilómetro o punto cercano" maxLength={120} />
        </Campo>
      </div>

      <div className="at-burbuja" aria-label="Mensaje que se enviará">
        <p>{mensaje}</p>
      </div>
    </Ventana>
  );
}
