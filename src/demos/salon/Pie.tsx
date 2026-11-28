/* Pie de Atelier L'Art: sucursales, horarios, políticas y crédito. */
import { SUCURSALES } from "./datos";
import { Logo } from "./Piezas";

export function Pie() {
  return (
    <footer className="al-pie">
      <div className="al-ancho">
        <div className="al-pie-rejilla">
          <div>
            <Logo />
            <p style={{ marginTop: "1rem" }}>Colorimetría, corte y salud capilar con diagnóstico previo. Zona 10 y Cayalá, Ciudad de Guatemala.</p>
          </div>
          {SUCURSALES.map((s) => (
            <section key={s.id}>
              <h3>{s.nombre}</h3>
              <p style={{ marginBottom: ".6rem" }}>{s.direccion}</p>
              <dl>
                {s.horario.map(([d, h]) => (
                  <div key={d}>
                    <dt>{d}</dt>
                    <dd>{h}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
          <section>
            <h3>Políticas</h3>
            <ul>
              <li>Cambie o cancele su cita con 24 horas de anticipación.</li>
              <li>Pasados 15 minutos de su hora, la cita puede reprogramarse.</li>
              <li>Garantía de tono: ajuste de matiz sin costo dentro de los 7 días.</li>
              <li>Su teléfono y su ficha de color se usan solo para atenderle.</li>
            </ul>
          </section>
        </div>
        <div className="al-pie-final">
          <p>© {new Date().getFullYear()} Atelier L’Art</p>
          <p>
            Sitio desarrollado por <a href="/">Jzet Labs</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
