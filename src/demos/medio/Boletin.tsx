/*
 * Boletín matutino. Valida el correo mientras se escribe, sugiere la corrección de los dominios
 * mal tecleados y confirma con una entrada animada. En la demo no se envía ni se guarda nada.
 */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, ArrowRight, Check, LoaderCircle } from "lucide-react";
import { animate, stagger } from "animejs";
import { sinMovimiento } from "./animar";

const CORREO = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i;
const ERRATAS: Record<string, string> = {
  "gmail.con": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gamil.com": "gmail.com",
  "hotmail.con": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "outlook.con": "outlook.com",
  "yahoo.con": "yahoo.com",
};

function revisar(correo: string) {
  const c = correo.trim();
  if (!c) return "Escriba su correo para recibir el resumen.";
  if (!c.includes("@")) return "Al correo le falta la arroba (@).";
  if (!CORREO.test(c)) return "Revise la parte final: debe verse como nombre@correo.com";
  return "";
}

function Confirmacion({ correo, alVolver }: { correo: string; alVolver: () => void }) {
  const caja = useRef<HTMLDivElement>(null);
  useEffect(() => {
    caja.current?.focus({ preventScroll: true });
    if (sinMovimiento() || !caja.current) return;
    const sello = animate(caja.current.querySelectorAll("[data-sello]"), { scale: [0.4, 1], opacity: [0, 1], duration: 520, ease: "outBack" });
    const lineas = animate(caja.current.querySelectorAll("[data-linea]"), { opacity: [0, 1], translateY: [10, 0], delay: stagger(90, { start: 160 }), duration: 420, ease: "outCubic" });
    const seguro = window.setTimeout(() => {
      sello.complete();
      lineas.complete();
    }, 1400);
    return () => {
      window.clearTimeout(seguro);
      sello.revert();
      lineas.revert();
    };
  }, []);
  return (
    <div ref={caja} className="cc-confirmado" tabIndex={-1} role="status">
      <span className="cc-sello" data-sello aria-hidden>
        <Check size={26} strokeWidth={3} />
      </span>
      <div>
        <p className="cc-confirmado-titulo" data-linea>
          Suscripción confirmada
        </p>
        <p data-linea>
          Su resumen ejecutivo llegará a <b>{correo}</b> de lunes a viernes a las <b>6:30 AM</b>.
        </p>
        <button type="button" className="cc-ver" onClick={alVolver} data-linea>
          Usar otro correo
        </button>
      </div>
    </div>
  );
}

export default function Boletin() {
  const [correo, setCorreo] = useState("");
  const [tocado, setTocado] = useState(false);
  const [estado, setEstado] = useState<"escribiendo" | "enviando" | "listo">("escribiendo");
  const campo = useRef<HTMLInputElement>(null);
  const espera = useRef(0);
  useEffect(() => () => window.clearTimeout(espera.current), []);

  const falla = revisar(correo);
  const dominio = correo.trim().split("@")[1]?.toLowerCase() ?? "";
  const arreglo = ERRATAS[dominio] ? `${correo.trim().split("@")[0]}@${ERRATAS[dominio]}` : "";
  const mostrarFalla = tocado && falla !== "";
  const valido = falla === "" && !arreglo;

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setTocado(true);
    if (falla) {
      campo.current?.focus();
      return;
    }
    setEstado("enviando");
    espera.current = window.setTimeout(() => setEstado("listo"), 600);
  };

  return (
    <section id="boletin" className="cc-boletin" aria-labelledby="cc-boletin-titulo">
      <div className="cc-ancho cc-boletin-fila">
        <div>
          <p className="cc-antetitulo">Boletín matutino</p>
          <h2 id="cc-boletin-titulo">Resumen ejecutivo a las 6:30&nbsp;AM</h2>
          <p className="cc-boletin-texto">Las cinco notas que mueven el día, el tipo de cambio y el estado de las principales rutas, en una lectura de cuatro minutos.</p>
        </div>

        <div className="cc-boletin-caja">
          {estado === "listo" ? (
            <Confirmacion
              correo={correo.trim()}
              alVolver={() => {
                setCorreo("");
                setTocado(false);
                setEstado("escribiendo");
                requestAnimationFrame(() => campo.current?.focus());
              }}
            />
          ) : (
            <form onSubmit={enviar} noValidate>
              <label htmlFor="cc-correo">Correo electrónico</label>
              <div className="cc-campo-fila">
                <span className="cc-campo" data-estado={mostrarFalla ? "mal" : valido ? "bien" : ""}>
                  <input
                    ref={campo}
                    id="cc-correo"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="nombre@correo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    onBlur={() => correo && setTocado(true)}
                    aria-invalid={mostrarFalla}
                    aria-describedby="cc-correo-ayuda"
                    disabled={estado === "enviando"}
                  />
                  {valido && <Check size={18} className="cc-campo-bien" aria-hidden />}
                  {mostrarFalla && <AlertCircle size={18} className="cc-campo-mal" aria-hidden />}
                </span>
                <button type="submit" className="cc-boton" disabled={estado === "enviando"}>
                  {estado === "enviando" ? (
                    <>
                      <LoaderCircle size={16} className="cc-gira" aria-hidden /> Suscribiendo
                    </>
                  ) : (
                    <>
                      Suscribirme <ArrowRight size={16} aria-hidden />
                    </>
                  )}
                </button>
              </div>
              <p id="cc-correo-ayuda" className="cc-ayuda" data-mal={mostrarFalla} aria-live="polite">
                {arreglo ? (
                  <>
                    ¿Quiso escribir{" "}
                    <button type="button" onClick={() => setCorreo(arreglo)}>
                      {arreglo}
                    </button>
                    ?
                  </>
                ) : mostrarFalla ? (
                  falla
                ) : valido ? (
                  "El correo está bien escrito."
                ) : (
                  "Sin costo. Puede darse de baja cuando quiera."
                )}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
