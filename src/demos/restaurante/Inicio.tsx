/* Vista "Menú y Mesas": portada, la cocina, la carta y los tres ambientes. */
import { ArrowRight, Bike, CalendarDays, Clock, Flame, MapPin, Wheat, Wine } from "lucide-react";
import { Carta } from "./Carta";
import { DIRECCION, FOTOS, ZONAS, abiertoAhora, foto, horarioDe, type Brasa, type Filtro, type ZonaId } from "./datos";

type Props = {
  b: Brasa;
  filtro: Filtro;
  alFiltrar: (f: Filtro) => void;
  alReservar: (zona?: ZonaId) => void;
  alDomicilio: () => void;
  alAgregar: (nombre: string) => void;
};

export function Inicio({ b, filtro, alFiltrar, alReservar, alDomicilio, alAgregar }: Props) {
  const hoy = horarioDe(new Date());
  const abierto = abiertoAhora();
  return (
    <>
      <section className="bm-portada">
        <img src={foto(FOTOS.portada, 1800, 1200)} alt="Corte con hueso dorándose entre las llamas de la parrilla" fetchPriority="high" />
        <div className="bm-ancho bm-portada-texto">
          <p className="bm-sobre">Cocina a la leña en Zona 10</p>
          <h1>
            El fuego hace
            <br />
            <em>lo suyo, sin prisa.</em>
          </h1>
          <p className="bm-portada-bajada">Cortes sobre brasa de encino, elotes tostados y coctelería de la casa. En su mesa o en su puerta.</p>
          <div className="bm-botones">
            <button type="button" className="bm-btn bm-terra" onClick={() => alReservar()}>
              <CalendarDays size={18} aria-hidden /> Reservar mesa
            </button>
            <button type="button" className="bm-btn bm-claro" onClick={alDomicilio}>
              <Bike size={18} aria-hidden /> Pedir a domicilio
            </button>
          </div>
          <ul className="bm-portada-datos">
            <li>
              <Clock size={16} aria-hidden />
              <span>
                <b>{abierto ? "Abierto ahora" : "Cerrado ahora"}</b> · hoy de {hoy.abre}:00 a {hoy.cierra}:00
              </span>
            </li>
            <li>
              <MapPin size={16} aria-hidden />
              <span>{DIRECCION}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="bm-cocina">
        <div className="bm-ancho bm-cocina-fila">
          <h2>Leña, maíz y buena sobremesa.</h2>
          <ul>
            <li>
              <Flame size={22} aria-hidden />
              <div>
                <b>Brasa de encino</b>
                <p>Cada corte se sella al momento y reposa antes de llegar a la mesa.</p>
              </div>
            </li>
            <li>
              <Wheat size={22} aria-hidden />
              <div>
                <b>El maíz de siempre</b>
                <p>Elotes al carbón y totopos hechos en la casa.</p>
              </div>
            </li>
            <li>
              <Wine size={22} aria-hidden />
              <div>
                <b>Barra propia</b>
                <p>Ron añejo, rosa de jamaica y fruta de temporada.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <Carta b={b} filtro={filtro} alFiltrar={alFiltrar} alAgregar={alAgregar} />

      <section className="bm-mesas" id="bm-mesas">
        <div className="bm-ancho">
          <div className="bm-titulo-seccion">
            <h2>Elija dónde sentarse</h2>
            <p>Reserve en línea y su mesa queda confirmada al momento.</p>
          </div>
          <div className="bm-zonas">
            {ZONAS.map((z) => (
              <article key={z.id} className="bm-zona">
                <img src={foto(z.foto, 720, 860)} alt={z.alt} loading="lazy" />
                <div>
                  <h3>{z.nombre}</h3>
                  <p>{z.detalle}</p>
                  <button type="button" className="bm-btn bm-claro" onClick={() => alReservar(z.id)} aria-label={`Reservar en ${z.nombre}`}>
                    Reservar aquí <ArrowRight size={17} aria-hidden />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
