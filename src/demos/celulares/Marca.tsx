/* Piezas fijas de la marca: logotipo (solo letras y un cuadro en CSS), foto con respaldo y pie de página. */
import { useState } from "react";
import { Clock, CreditCard, MapPin, ShieldCheck } from "lucide-react";
import { whatsappLink } from "@/data/site";

export function Logo() {
  return (
    <span className="nx-logo">
      <span className="nx-logo-cuadro" aria-hidden />
      <span className="nx-logo-nombre">
        NEXUS <b>MOBILE</b>
      </span>
      <span className="nx-logo-pais">GT</span>
    </span>
  );
}

/* si la foto no carga, queda el bloque gris y no un icono roto */
export function Foto({ src, alt, className = "", prioridad = false }: { src: string; alt: string; className?: string; prioridad?: boolean }) {
  const [fallo, setFallo] = useState<string | null>(null);
  return (
    <span className={`nx-foto ${className}`}>
      {fallo !== src && <img src={src} alt={alt} loading={prioridad ? "eager" : "lazy"} decoding="async" onError={() => setFallo(src)} />}
    </span>
  );
}

export function Pie({ conBarra, conBandeja }: { conBarra: boolean; conBandeja: boolean }) {
  return (
    <footer className="nx-pie nx-oscuro" data-barra={conBarra} data-bandeja={conBandeja}>
      <div className="nx-ancho">
        <div className="nx-pie-columnas">
          <div>
            <Logo />
            <p>Teléfonos liberados de fábrica, accesorios originales y taller técnico en Ciudad de Guatemala.</p>
          </div>
          <div>
            <h2>
              <MapPin size={16} aria-hidden /> Ubicación
            </h2>
            <p>
              <b>Tienda</b>
              <br />
              CC Miraflores, Zona 11
            </p>
            <p>
              <b>Taller técnico</b>
              <br />
              Zona 10, Ciudad de Guatemala
            </p>
          </div>
          <div>
            <h2>
              <Clock size={16} aria-hidden /> Horarios
            </h2>
            <dl className="nx-horario">
              <div>
                <dt>Tienda, lunes a sábado</dt>
                <dd>10:00 a 20:00</dd>
              </div>
              <div>
                <dt>Tienda, domingo</dt>
                <dd>10:00 a 19:00</dd>
              </div>
              <div>
                <dt>Taller, lunes a viernes</dt>
                <dd>9:00 a 18:00</dd>
              </div>
              <div>
                <dt>Taller, sábado</dt>
                <dd>9:00 a 13:00</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="nx-politicas">
          <details>
            <summary>
              <ShieldCheck size={18} aria-hidden /> Política de garantía
            </summary>
            <p>
              Todos los teléfonos nuevos llevan garantía escrita de 12 meses por defectos de fábrica. No cubre golpes, daño por líquidos, equipos abiertos por
              terceros ni desgaste normal. Presenta tu factura y la hoja de garantía. En el taller, cada reparación indica su propia garantía antes de ingresar el
              equipo.
            </p>
          </details>
          <details>
            <summary>
              <CreditCard size={18} aria-hidden /> Visacuotas y Credomatic
            </summary>
            <p>
              Puedes pagar en 3, 6, 12 o 18 cuotas sin recargo con tarjetas de crédito participantes en Visacuotas o Credomatic. Necesitas disponible suficiente
              para el total de la compra. La aprobación depende de tu banco y el cobro se hace al confirmar la orden: esta página no pide datos de tu tarjeta.
            </p>
          </details>
        </div>

        <div className="nx-pie-final">
          <p>© {new Date().getFullYear()} Nexus Mobile GT. Todos los derechos reservados.</p>
          <a href={whatsappLink("Hola, Joshua. Vi la demo de la tienda de celulares y quiero una página así para mi negocio.")} target="_blank" rel="noopener noreferrer">
            Sitio desarrollado por Jzet Labs
          </a>
        </div>
      </div>
    </footer>
  );
}
