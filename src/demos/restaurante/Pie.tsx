/* Pie en carbón: horarios, dirección, cobertura a domicilio y crédito. */
import { Bike, Clock, MapPin } from "lucide-react";
import { Logo } from "./Piezas";
import { CIUDAD, DIRECCION, ENVIOS, HORARIOS, MAPA, qz } from "./datos";

export function Pie({ conDock }: { conDock: boolean }) {
  return (
    <footer className={`bm-pie bm-oscuro ${conDock ? "bm-pie-dock" : ""}`}>
      <div className="bm-ancho">
        <div className="bm-pie-marca">
          <Logo />
          <p>Cocina a la leña en Zona 10, con entrega hasta Cayalá.</p>
        </div>
        <div className="bm-pie-columnas">
          <section>
            <h2>
              <Clock size={17} aria-hidden /> Horarios
            </h2>
            <dl>
              {HORARIOS.map((h) => (
                <div key={h.nombre}>
                  <dt>{h.nombre}</dt>
                  <dd>
                    {h.abre}:00 – {h.cierra}:00
                  </dd>
                </div>
              ))}
            </dl>
          </section>
          <section>
            <h2>
              <MapPin size={17} aria-hidden /> Dirección
            </h2>
            <p>
              {DIRECCION}
              <br />
              {CIUDAD}
            </p>
            <a href={MAPA} target="_blank" rel="noopener noreferrer">
              Abrir en el mapa
            </a>
          </section>
          <section>
            <h2>
              <Bike size={17} aria-hidden /> A domicilio
            </h2>
            <dl>
              {ENVIOS.map((e) => (
                <div key={e.id}>
                  <dt>{e.nombre}</dt>
                  <dd>{qz(e.precio)}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
        <p className="bm-privacidad">Su nombre, teléfono y dirección se usan únicamente para su pedido o su reserva.</p>
        <div className="bm-pie-final">
          <p>© {new Date().getFullYear()} Brasa &amp; Maíz</p>
          <p>
            Sitio desarrollado por <a href="/">Jzet Labs</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
