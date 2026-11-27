/* Logo (solo letras, con un corte oliva en CSS) y pie de página. */
import { Clock, Repeat, ShieldCheck, Truck } from "lucide-react";
import { ENVIOS, HORARIO, qz } from "./datos";

export function Logo() {
  return (
    <span className="vx-logo">
      <span className="vx-logo-corte" aria-hidden />
      <span className="vx-logo-nombre">VÉRTICE</span>
      <span className="vx-logo-giro">STUDIO</span>
    </span>
  );
}

export function Pie({ conBarra }: { conBarra: boolean }) {
  return (
    <footer className={`vx-pie vx-oscuro ${conBarra ? "vx-pie-barra" : ""}`}>
      <div className="vx-ancho">
        <div className="vx-pie-marca">
          <Logo />
          <p>Ropa urbana y casual, pensada para el día a día en Guatemala.</p>
        </div>
        <div className="vx-pie-columnas">
          <section>
            <h2><Repeat size={17} aria-hidden /> Cambios de talla</h2>
            <ul>
              <li>Tienes 7 días desde que recibes tu pedido.</li>
              <li>La prenda va sin uso, sin lavar y con sus etiquetas.</li>
              <li>El cambio depende de la existencia en tu nueva talla.</li>
              <li>Escríbenos con tu número de orden para coordinarlo.</li>
            </ul>
          </section>
          <section>
            <h2><Clock size={17} aria-hidden /> Horarios</h2>
            <ul>
              <li>{HORARIO}.</li>
              <li>Domingos cerrado.</li>
              <li>Las órdenes que entren fuera de horario se confirman el siguiente día hábil.</li>
            </ul>
          </section>
          <section>
            <h2><Truck size={17} aria-hidden /> Envíos y pagos</h2>
            <ul>
              <li>{ENVIOS.ciudad.nombre}: {qz(ENVIOS.ciudad.precio)}, {ENVIOS.ciudad.plazo}.</li>
              <li>{ENVIOS.departamentos.nombre}: {qz(ENVIOS.departamentos.precio)}, {ENVIOS.departamentos.plazo}.</li>
              <li>Pago contra entrega o transferencia bancaria.</li>
            </ul>
          </section>
          <section>
            <h2><ShieldCheck size={17} aria-hidden /> Tu privacidad</h2>
            <p>Usamos tu nombre, teléfono y dirección únicamente para preparar, entregar y dar seguimiento a tu pedido. Puedes pedirnos que los borremos.</p>
          </section>
        </div>
        <div className="vx-pie-final">
          <p>© 2026 Vértice Studio · Guatemala</p>
          <p>
            Sitio desarrollado por <a href="/">Jzet Labs</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
