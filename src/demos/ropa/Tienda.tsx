/* Vista "Tienda": portada de temporada, catálogo por categoría y talla. */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Repeat, Ruler, ShoppingBag, Sparkles, Truck, Wallet } from "lucide-react";
import portada from "@/assets/demo-ropa/portada.jpg";
import { sinMovimiento, useDemora, useEscalonado } from "../hotel/animar";
import { Foto, Tallas } from "./Piezas";
import { CATALOGO, ENVIOS, FILTROS, apartadas, libres, qz, tallasDe, type Filtro, type Producto, type Talla, type Vertice } from "./datos";

type Props = {
  v: Vertice;
  filtro: Filtro;
  alFiltrar: (f: Filtro) => void;
  alAgregar: (p: Producto, t: Talla) => void;
  alGuia: (p: Producto) => void;
  alCatalogo: () => void;
  alOutfit: () => void;
};

export function Tienda({ v, filtro, alFiltrar, alAgregar, alGuia, alCatalogo, alOutfit }: Props) {
  const rejilla = useRef<HTMLUListElement>(null);
  /* esqueleto de 300 ms al entrar y en cada cambio de filtro */
  const [arranque, setArranque] = useState(() => !sinMovimiento());
  useEffect(() => {
    if (!arranque) return;
    const t = window.setTimeout(() => setArranque(false), 300);
    return () => window.clearTimeout(t);
  }, [arranque]);
  const cambiando = useDemora(filtro, 300);
  const cargando = arranque || cambiando;
  useEscalonado(rejilla, filtro, !cargando);

  const lista = CATALOGO.filter((p) => filtro === "todo" || p.categoria === filtro);

  return (
    <>
      <section className="vx-portada">
        <div className="vx-portada-texto">
          <p className="vx-antetitulo">Colección Temporada Seca 2026</p>
          <h1>Hecho para la calle.</h1>
          <p className="vx-portada-detalle">
            Básicos que combinan con todo y chaquetas para las mañanas frías. Elige tu talla y recibe en cualquier punto de Guatemala.
          </p>
          <div className="vx-portada-botones">
            <button type="button" className="vx-btn vx-negro" onClick={alCatalogo}>
              Ver la colección <ArrowRight size={18} aria-hidden />
            </button>
            <button type="button" className="vx-btn vx-contorno" onClick={alOutfit}>
              Arma tu outfit, 15% menos
            </button>
          </div>
        </div>
        <span className="vx-portada-foto">
          <img src={portada} alt="Hombre con playera negra y jeans junto a una pared de concreto" fetchPriority="high" />
        </span>
      </section>

      <ul className="vx-pilares vx-ancho">
        <li>
          <Truck size={20} aria-hidden />
          <span>
            <b>Envíos a todo el país</b>
            <small>Ciudad {qz(ENVIOS.ciudad.precio)} · Departamentos {qz(ENVIOS.departamentos.precio)}</small>
          </span>
        </li>
        <li>
          <Repeat size={20} aria-hidden />
          <span>
            <b>Cambio de talla</b>
            <small>Tienes 7 días desde que recibes</small>
          </span>
        </li>
        <li>
          <Wallet size={20} aria-hidden />
          <span>
            <b>Paga como prefieras</b>
            <small>Contra entrega o transferencia</small>
          </span>
        </li>
      </ul>

      <section id="vx-catalogo" className="vx-seccion vx-ancho" aria-labelledby="vx-catalogo-titulo">
        <div className="vx-titulo">
          <div>
            <h2 id="vx-catalogo-titulo">La colección</h2>
            <p aria-live="polite">{lista.length} prendas</p>
          </div>
          <div className="vx-filtros" role="group" aria-label="Filtrar por categoría">
            {FILTROS.map((f) => (
              <button key={f.id} type="button" aria-pressed={filtro === f.id} onClick={() => alFiltrar(f.id)}>
                {f.nombre}
              </button>
            ))}
          </div>
        </div>

        <ul ref={rejilla} className="vx-rejilla" aria-busy={cargando}>
          {cargando
            ? lista.map((p) => (
                <li key={p.id} className="vx-prenda vx-esqueleto" aria-hidden>
                  <i className="vx-prenda-foto" />
                  <i style={{ width: "75%" }} />
                  <i style={{ width: "40%" }} />
                  <i style={{ height: 40 }} />
                </li>
              ))
            : lista.map((p) => <Tarjeta key={p.id} p={p} v={v} alAgregar={alAgregar} alGuia={alGuia} />)}
        </ul>
      </section>

      <section className="vx-ancho vx-promo-caja">
        <div className="vx-promo vx-oscuro">
          <Sparkles size={26} aria-hidden />
          <div>
            <h2>Combina 3 piezas y paga 15% menos</h2>
            <p>Una prenda de arriba, un pantalón y un accesorio. El descuento se aplica solo.</p>
          </div>
          <button type="button" className="vx-btn vx-blanco" onClick={alOutfit}>
            Armar mi outfit <ArrowRight size={18} aria-hidden />
          </button>
        </div>
      </section>
    </>
  );
}

function Tarjeta({ p, v, alAgregar, alGuia }: { p: Producto; v: Vertice; alAgregar: Props["alAgregar"]; alGuia: Props["alGuia"] }) {
  const { estado } = v;
  const [talla, setTalla] = useState<Talla | null>(null);
  const [falta, setFalta] = useState(false);
  const agotada = tallasDe(p).every((t) => (estado.stock[p.id]?.[t] ?? 0) === 0);
  /* si el panel deja en cero la talla elegida, se suelta */
  const elegida = talla && (estado.stock[p.id]?.[talla] ?? 0) > 0 ? talla : null;
  const quedan = elegida ? libres(estado, p.id, elegida) : 0;
  const enOrden = elegida ? apartadas(estado, p.id, elegida) : 0;
  const completa = !!elegida && quedan === 0;

  return (
    <li className="vx-prenda" data-entra>
      <div className="vx-prenda-foto">
        <Foto p={p} />
        {agotada && <span className="vx-sello">Agotada</span>}
      </div>
      <div className="vx-prenda-nombre">
        <h3>{p.nombre}</h3>
        <p>{p.detalle}</p>
      </div>
      <p className="vx-precio">{qz(estado.precios[p.id])}</p>
      <div className="vx-prenda-talla">
        <div>
          <span>Talla</span>
          <button type="button" onClick={() => alGuia(p)}>
            <Ruler size={14} aria-hidden /> Guía de tallas
          </button>
        </div>
        <Tallas
          p={p}
          estado={estado}
          valor={elegida}
          alElegir={(t) => {
            setTalla(t);
            setFalta(false);
          }}
        />
        <p className="vx-nota-talla" role="status">
          {falta ? <b>Elige tu talla primero.</b> : completa ? "Ya tienes en tu orden todas las disponibles." : elegida && quedan <= 3 ? `Quedan ${quedan} en talla ${elegida}.` : enOrden ? `${enOrden} en tu orden.` : ""}
        </p>
      </div>
      <button
        type="button"
        className="vx-btn vx-negro vx-lleno"
        disabled={agotada || completa}
        onClick={() => {
          if (!elegida) {
            setFalta(true);
            return;
          }
          alAgregar(p, elegida);
        }}
      >
        {completa ? <Check size={17} aria-hidden /> : <ShoppingBag size={17} aria-hidden />}
        {agotada ? "Agotada" : completa ? "En tu orden" : "Agregar"}
      </button>
    </li>
  );
}
