/* Pie en pizarra: línea de emergencias, ubicación y horarios. */
import { Clock, MapPin, Truck } from "lucide-react";
import { Logo } from "./Piezas";
import { HORARIOS, SEDES } from "./datos";

export function Pie({ alAuxilio }: { alAuxilio: () => void }) {
  return (
    <footer className="at-pie">
      <div className="at-ancho">
        <div className="at-pie-emergencia">
          <div>
            <h2>Línea de emergencias 24/7</h2>
            <p>Grúa y auxilio vial en la ciudad y sus salidas, todos los días.</p>
          </div>
          <button type="button" className="at-btn at-rojo at-grande" onClick={alAuxilio}>
            <Truck size={20} aria-hidden /> Pedir auxilio por WhatsApp
          </button>
        </div>
        <div className="at-pie-columnas">
          <section>
            <Logo />
            <p>Ingeniería automotriz con garantía escrita, repuestos originales y OEM, y factura FEL.</p>
          </section>
          <section>
            <h3>
              <MapPin size={17} aria-hidden /> Ubicación
            </h3>
            {SEDES.map((s) => (
              <p key={s.nombre}>
                <a href={s.mapa} target="_blank" rel="noopener noreferrer">
                  {s.direccion}
                </a>
              </p>
            ))}
          </section>
          <section>
            <h3>
              <Clock size={17} aria-hidden /> Horarios
            </h3>
            <dl>
              {HORARIOS.map((h) => (
                <div key={h.dias}>
                  <dt>{h.dias}</dt>
                  <dd>{h.horas}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
        <p className="at-pie-demo">Esta es una página de demostración: el negocio, los precios, las reseñas y los datos son de muestra.</p>
        <div className="at-pie-final">
          <p>© {new Date().getFullYear()} Autotech. Sus datos se usan únicamente para atender su orden.</p>
          <p>
            Sitio desarrollado por <a href="/">Jzet Labs</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
