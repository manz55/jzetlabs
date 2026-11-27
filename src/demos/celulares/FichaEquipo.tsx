/* Ficha técnica de un teléfono: color, capacidad, cuotas, especificaciones y contenido de la caja. */
import { useState } from "react";
import { ArrowLeftRight, Check, Package, Plus, ShieldCheck, ShoppingBag } from "lucide-react";
import { Cifra } from "./Cifra";
import { Foto } from "./Marca";
import { Ventana } from "./Ventana";
import { CAPACIDADES, PLAZOS, articuloDe, claveDe, disponibilidad, fichaDe, foto, producto, qd, qz, type Capacidad, type Nexus } from "./datos";

export type Abierta = { id: string; cap: Capacidad | null; color?: string };

type Props = {
  n: Nexus;
  abierta: Abierta | null;
  comparados: string[];
  alCerrar: () => void;
  alAgregar: (clave: string) => void;
  alComparar: (id: string) => void;
  alVerOrden: () => void;
};

function Contenido({ n, abierta, comparados, alAgregar, alComparar, alVerOrden }: Props & { abierta: Abierta }) {
  const p = producto(abierta.id);
  const f = fichaDe(p.id)!;
  const [cap, setCap] = useState<Capacidad | null>(abierta.cap);
  const [color, setColor] = useState(abierta.color || n.colorLibre(p.id) || f.colores[0]?.nombre || "");
  const variante = claveDe(p.id, cap);
  const { precio, stock } = n.inventario[variante];
  const enOrden = n.unidadesEn(variante);
  const colorAgotado = !!color && !n.hayColor(p.id, color);
  const agotado = stock === 0 || colorAgotado;
  const estado = disponibilidad(colorAgotado ? 0 : stock);
  const tope = !agotado && enOrden >= stock;
  const comparando = comparados.includes(p.id);

  const filas = [
    ["Pantalla", f.pantalla],
    ["Chip", f.procesador],
    ["Memoria RAM", f.memoria],
    ["Cámaras", f.camaras],
    ["Cámara frontal", f.frontal],
    ["Batería", f.bateria],
    ["Dual SIM / eSIM", f.sim],
    ["Almacenamiento", p.capacidades.join(" · ")],
  ].filter(([, v]) => v);

  return (
    <>
      <div className="nx-ficha-equipo">
        <div className="nx-ficha-compra">
          <figure>
            <Foto src={foto(p.foto, 800, 600)} alt={p.nombre} prioridad />
            <figcaption>Imagen referencial; el color puede variar.</figcaption>
          </figure>

          {f.colores.length > 0 && (
            <>
              <p className="nx-rotulo">
                Color: <span>{color}{colorAgotado ? " (agotado)" : ""}</span>
              </p>
              <div className="nx-colores" role="group" aria-label="Color">
                {f.colores.map((c) => (
                  <button key={c.nombre} type="button" aria-pressed={color === c.nombre} aria-label={c.nombre} title={c.nombre} data-agotado={!n.hayColor(p.id, c.nombre)} onClick={() => setColor(c.nombre)}>
                    <i style={{ background: c.tono }} />
                  </button>
                ))}
              </div>
            </>
          )}

          <p className="nx-rotulo">Capacidad</p>
          <div className="nx-segmentos" role="group" aria-label="Capacidad">
            {CAPACIDADES.map((c) => (
              <button key={c} type="button" disabled={!p.capacidades.includes(c)} aria-pressed={cap === c} onClick={() => setCap(c)}>
                {c}
              </button>
            ))}
          </div>

          <div className="nx-ficha-precio">
            <div className="nx-precio">
              <strong>
                <Cifra valor={precio} formato={qz} />
              </strong>
              <span>contado</span>
            </div>
            <span className="nx-estado" data-tono={estado.tono}>
              {estado.texto}
            </span>
          </div>

          <table className="nx-cuotas">
            <caption>Visacuotas / Credomatic sin recargo</caption>
            <tbody>
              {PLAZOS.filter((x) => x > 1).map((x) => (
                <tr key={x}>
                  <th scope="row">{x} cuotas</th>
                  <td>
                    <Cifra valor={precio / x} formato={qd} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="nx-ficha-datos-equipo">
          <h3>Especificaciones</h3>
          <dl className="nx-specs">
            {filas.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <h3>
            <Package size={18} aria-hidden /> Qué incluye la caja
          </h3>
          <ul className="nx-incluye">
            {f.caja.map((x) => (
              <li key={x}>
                <Check size={16} aria-hidden /> {x}
              </li>
            ))}
          </ul>
          <p className="nx-caja-nota">{f.caja.length ? "El contenido de la caja puede variar según la versión." : "Consúltanos el contenido de la caja."}</p>
          <p className="nx-garantia">
            <ShieldCheck size={20} aria-hidden /> Liberado de fábrica, con garantía escrita de 12 meses y factura.
          </p>
          <button type="button" className="nx-btn nx-contorno nx-lleno" aria-pressed={comparando} disabled={!comparando && comparados.length >= 2} onClick={() => alComparar(p.id)}>
            <ArrowLeftRight size={17} aria-hidden />
            {comparando ? "Quitar de la comparación" : comparados.length >= 2 ? "Ya elegiste 2 equipos para comparar" : "Agregar a la comparación"}
          </button>
        </div>
      </div>

      <div className="nx-ficha-pie">
        <p>
          <b>{qz(precio)}</b>
          <small>{[cap, color].filter(Boolean).join(" · ")}</small>
        </p>
        <div>
          {enOrden > 0 && (
            <button type="button" className="nx-btn nx-contorno" onClick={alVerOrden}>
              <ShoppingBag size={17} aria-hidden /> Ver mi orden
            </button>
          )}
          <button type="button" className="nx-btn nx-azul" disabled={agotado || tope} onClick={() => alAgregar(articuloDe(p.id, cap, color))}>
            {agotado ? (colorAgotado && stock > 0 ? "Elige otro color" : "Sin existencias") : tope ? `En tu orden: ${enOrden} (no hay más)` : enOrden ? <><Check size={17} aria-hidden /> En tu orden ({enOrden}) · Otro</> : <><Plus size={17} aria-hidden /> Agregar a mi orden</>}
          </button>
        </div>
      </div>
    </>
  );
}

export function FichaEquipo(props: Props) {
  const p = props.abierta && producto(props.abierta.id);
  return (
    <Ventana abierta={!!props.abierta} alCerrar={props.alCerrar} titulo={p ? p.nombre : "Ficha técnica"} sub={p ? `Ficha técnica · ${p.marca}` : undefined} ancha>
      {props.abierta && <Contenido key={props.abierta.id} {...props} abierta={props.abierta} />}
    </Ventana>
  );
}
