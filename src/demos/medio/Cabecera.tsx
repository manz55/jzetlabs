/*
 * Encabezado. Todo es un solo bloque pegajoso con "top" negativo: el logotipo grande se va al
 * bajar y quedan fijas la franja (fecha, dólar, clima) y la barra de secciones con el buscador.
 * Como nada cambia de tamaño, la página no brinca.
 */
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { CloudSun, DollarSign, Mail, Search } from "lucide-react";
import { Logo } from "./Piezas";
import { CAMBIO, CLIMA, SECCIONES, fechaCorta, fechaLarga, type Vista } from "./datos";

type Props = {
  vista: Vista;
  ahora: Date;
  alElegir: (v: Vista) => void;
  alBuscar: () => void;
  alBoletin: () => void;
};

export default function Cabecera({ vista, ahora, alElegir, alBuscar, alBoletin }: Props) {
  const mancheta = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLUListElement>(null);
  const [fija, setFija] = useState(false);

  /* cuando el logotipo grande ya salió de la pantalla, aparece el pequeño en la barra */
  useEffect(() => {
    const el = mancheta.current;
    if (!el) return;
    const ojo = new IntersectionObserver(([e]) => setFija(e.intersectionRatio < 0.1), { threshold: [0, 0.1, 0.5] });
    ojo.observe(el);
    return () => ojo.disconnect();
  }, []);

  /* en celular el menú se desliza: la sección activa siempre queda a la vista */
  useEffect(() => {
    const caja = menu.current;
    const activo = caja?.querySelector<HTMLElement>("[aria-current]");
    if (!caja || !activo) return;
    caja.scrollTo({ left: activo.offsetLeft - (caja.clientWidth - activo.offsetWidth) / 2, behavior: "smooth" });
  }, [vista, fija]);

  const ir = (e: ReactMouseEvent, v: Vista) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    alElegir(v);
  };

  return (
    <header className="cc-cabeza">
      <div ref={mancheta} className="cc-mancheta">
        <div className="cc-ancho cc-mancheta-fila">
          <button type="button" className="cc-boton-linea cc-solo-ancho" onClick={alBoletin}>
            <Mail size={15} aria-hidden /> Boletín 6:30
          </button>
          <a href={location.pathname} onClick={(e) => ir(e, "portada")} className="cc-mancheta-logo" aria-label="Crónica Central, ir a la portada">
            <Logo />
            <span className="cc-mancheta-lema">Diario digital de Guatemala</span>
          </a>
          <span className="cc-solo-ancho cc-mancheta-edicion">Edición del {fechaLarga(ahora).split(",")[0].toLowerCase()}</span>
        </div>
      </div>

      <div className="cc-franja">
        <div className="cc-ancho cc-franja-fila">
          <p>
            <span className="cc-solo-ancho">{fechaLarga(ahora)}</span>
            <span className="cc-solo-chico">{fechaCorta(ahora)}</span>
          </p>
          <ul className="cc-indicadores">
            <li>
              <DollarSign size={13} aria-hidden />
              <span>
                US$1 <b>{CAMBIO}</b>
              </span>
            </li>
            <li>
              <CloudSun size={14} aria-hidden />
              <span>
                {CLIMA.ciudad} <b>{CLIMA.grados}°</b>
                <span className="cc-solo-ancho"> · {CLIMA.cielo}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <nav className="cc-nav" aria-label="Secciones" data-fija={fija}>
        <div className="cc-ancho cc-nav-fila">
          <a
            href={location.pathname}
            onClick={(e) => ir(e, "portada")}
            className="cc-nav-marca"
            aria-label="Crónica Central, ir a la portada"
            tabIndex={fija ? 0 : -1}
            aria-hidden={!fija}
          >
            <span>CC</span>
          </a>
          <ul ref={menu} className="cc-nav-lista">
            {SECCIONES.map((s) => (
              <li key={s.id}>
                <a href={s.id === "portada" ? location.pathname : `#${s.id}`} onClick={(e) => ir(e, s.id)} aria-current={vista === s.id ? "page" : undefined}>
                  {s.nombre}
                </a>
              </li>
            ))}
          </ul>
          <button type="button" className="cc-nav-buscar" onClick={alBuscar} aria-label="Buscar noticias">
            <Search size={18} aria-hidden /> <span className="cc-solo-ancho">Buscar</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
