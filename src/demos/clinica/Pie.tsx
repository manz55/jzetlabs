/* Piezas fijas de la marca: el logotipo (solo letras y un cuadro girado) y el pie de página. */
import { Clock, MapPin } from "lucide-react";

export function Logo() {
  return (
    <span className="vv-logo">
      <span className="vv-marca" aria-hidden />
      <span>
        <span className="vv-logo-tipo">Clínica Dental</span>
        <span className="vv-logo-nombre">Valleverde</span>
      </span>
    </span>
  );
}

export function Pie() {
  return (
    <footer className="vv-pie">
      <div className="vv-ancho">
        <div className="vv-pie-columnas">
          <div>
            <Logo />
            <p>Odontología general, ortodoncia, estética e implantes en un mismo lugar.</p>
          </div>
          <div>
            <h2>Horarios</h2>
            <dl className="vv-horarios">
              <div>
                <dt>Lunes a viernes</dt>
                <dd>8:00 a 13:00 · 14:00 a 18:00</dd>
              </div>
              <div>
                <dt>Sábado</dt>
                <dd>8:00 a 13:00</dd>
              </div>
              <div>
                <dt>Domingo</dt>
                <dd>Cerrado</dd>
              </div>
            </dl>
          </div>
          <div>
            <h2>Ubicación</h2>
            <p className="vv-con-icono">
              <MapPin size={17} aria-hidden /> Zona 14, Ciudad de Guatemala. Le enviamos la dirección exacta y el parqueo al confirmar su cita.
            </p>
            <p className="vv-con-icono">
              <Clock size={17} aria-hidden /> Llegue 10 minutos antes si es su primera visita.
            </p>
          </div>
          <div>
            <h2>Reprogramación</h2>
            <p>Puede cambiar o cancelar su cita sin costo con 24 horas de anticipación. Guardamos su horario 15 minutos.</p>
            <h2>Privacidad</h2>
            <p>Sus datos se usan únicamente para coordinar sus citas y llevar su expediente.</p>
          </div>
        </div>
        <div className="vv-pie-final">
          <p>© {new Date().getFullYear()} Clínica Dental Valleverde. Todos los derechos reservados.</p>
          <p>
            Sitio desarrollado por <a href="/">Jzet Labs</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
