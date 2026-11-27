/* Piezas fijas de la marca: logotipo (letras y tres álamos en CSS), foto con respaldo y pie de página. */
import { useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { TEL_EMERGENCIAS } from "./datos";

export function Logo() {
  return (
    <span className="pa-logo">
      <span className="pa-marca" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <span>
        <span className="pa-logo-tipo">CENTRO PEDIÁTRICO</span>
        <span className="pa-logo-nombre">LOS ÁLAMOS</span>
      </span>
    </span>
  );
}

/* si la foto no carga, queda el bloque de color y no un icono roto */
export function Foto({ src, alt, className = "", prioridad = false }: { src: string; alt: string; className?: string; prioridad?: boolean }) {
  const [fallo, setFallo] = useState(false);
  return (
    <span className={`pa-foto ${className}`}>
      {!fallo && <img src={src} alt={alt} loading={prioridad ? "eager" : "lazy"} decoding="async" onError={() => setFallo(true)} />}
    </span>
  );
}

export function Pie({ conBarra }: { conBarra: boolean }) {
  return (
    <footer className="pa-pie" data-barra={conBarra}>
      <div className="pa-ancho">
        <div className="pa-pie-columnas">
          <div>
            <Logo />
            <p>Control de niño sano, vacunación y consulta pediátrica para recién nacidos, niños y adolescentes.</p>
          </div>
          <div>
            <h2>Horarios</h2>
            <dl className="pa-horario">
              <div>
                <dt>Lunes a viernes</dt>
                <dd>8:00 a 12:30 · 14:00 a 17:30</dd>
              </div>
              <div>
                <dt>Sábado</dt>
                <dd>8:00 a 12:30</dd>
              </div>
              <div>
                <dt>Domingo</dt>
                <dd>Solo línea de emergencias</dd>
              </div>
            </dl>
          </div>
          <div className="pa-emergencia">
            <h2>Emergencias pediátricas</h2>
            <p>Línea para pacientes del centro, las 24 horas.</p>
            <strong>
              <Phone size={22} aria-hidden /> {TEL_EMERGENCIAS}
            </strong>
            <p>Si su hijo no respira bien, convulsiona o no despierta, llame a Bomberos Voluntarios (122) o vaya a la emergencia más cercana.</p>
          </div>
          <div>
            <h2>Ubicación</h2>
            <p className="pa-con-icono">
              <MapPin size={17} aria-hidden /> Zona 15, Ciudad de Guatemala, con fácil acceso desde Carretera a El Salvador. Al confirmar su cita le enviamos la dirección exacta y el parqueo.
            </p>
            <p>Sus datos y los de su hijo se usan solo para coordinar citas y llevar el expediente médico.</p>
          </div>
        </div>
        <div className="pa-pie-final">
          <p>© {new Date().getFullYear()} Centro Pediátrico Los Álamos. Todos los derechos reservados.</p>
          <p>
            Sitio desarrollado por <a href="/">Jzet Labs</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
