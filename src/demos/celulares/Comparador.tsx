/* Comparador de dos teléfonos lado a lado. */
import { useState } from "react";
import { ArrowLeftRight, Check, Plus, X } from "lucide-react";
import { Foto } from "./Marca";
import { Ventana } from "./Ventana";
import { articuloDe, claveDe, fichaDe, foto, producto, qd, qz, type Capacidad, type Nexus } from "./datos";

/* la bandeja de abajo: dice cuántos van elegidos y abre la comparación */
export function BandejaComparar({ ids, alQuitar, alAbrir }: { ids: string[]; alQuitar: (id: string) => void; alAbrir: () => void }) {
  return (
    <div className="nx-bandeja">
      <ul>
        {ids.map((id) => (
          <li key={id}>
            <span>{producto(id).nombre}</span>
            <button type="button" aria-label={`Quitar ${producto(id).nombre} de la comparación`} onClick={() => alQuitar(id)}>
              <X size={14} aria-hidden />
            </button>
          </li>
        ))}
        {ids.length < 2 && <li className="nx-bandeja-falta">Elige otro equipo</li>}
      </ul>
      <button type="button" className="nx-btn nx-negro" disabled={ids.length < 2} onClick={alAbrir}>
        <ArrowLeftRight size={17} aria-hidden /> Comparar
      </button>
    </div>
  );
}

function Tabla({ n, ids, alAgregar, alFicha }: { n: Nexus; ids: string[]; alAgregar: (clave: string) => void; alFicha: (id: string, cap: Capacidad) => void }) {
  const [caps, setCaps] = useState<Record<string, Capacidad>>({});
  const equipos = ids.map((id) => {
    const p = producto(id);
    const cap = caps[id] ?? p.capacidades.find((c) => n.inventario[claveDe(id, c)].stock > 0) ?? p.capacidades[0];
    return { p, cap, f: fichaDe(id)!, color: n.colorLibre(id), ...n.inventario[claveDe(id, cap)], enOrden: n.unidadesEn(claveDe(id, cap)) };
  });
  const menor = Math.min(...equipos.map((e) => e.precio));
  const distintos = new Set(equipos.map((e) => e.precio)).size > 1;

  return (
    <table className="nx-comparar">
      <thead>
        <tr>
          <td />
          {equipos.map(({ p, cap }) => (
            <th key={p.id} scope="col">
              <Foto src={foto(p.foto, 400, 300)} alt="" prioridad />
              <button type="button" onClick={() => alFicha(p.id, cap)}>
                {p.nombre}
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Almacenamiento</th>
          {equipos.map(({ p, cap }) => (
            <td key={p.id}>
              <div className="nx-comparar-caps" role="group" aria-label={`Capacidad de ${p.nombre}`}>
                {p.capacidades.map((c) => (
                  <button key={c} type="button" aria-pressed={cap === c} onClick={() => setCaps({ ...caps, [p.id]: c })}>
                    {c}
                  </button>
                ))}
              </div>
            </td>
          ))}
        </tr>
        <tr>
          <th scope="row">Precio contado</th>
          {equipos.map(({ p, precio }) => (
            <td key={p.id}>
              <strong>{qz(precio)}</strong>
              {distintos && precio === menor && <span className="nx-estado" data-tono="azul">Menor precio</span>}
            </td>
          ))}
        </tr>
        <tr>
          <th scope="row">Cuota mensual</th>
          {equipos.map(({ p, precio }) => (
            <td key={p.id}>
              <b>{qd(precio / 12)}</b> en 12<small>{qd(precio / 18)} en 18</small>
            </td>
          ))}
        </tr>
        {(
          [
            ["Pantalla", "pantalla"],
            ["Cámaras", "camaras"],
            ["Cámara frontal", "frontal"],
            ["Chip", "procesador"],
            ["Batería", "bateria"],
            ["SIM", "sim"],
          ] as const
        ).map(([nombre, campo]) => (
          <tr key={campo}>
            <th scope="row">{nombre}</th>
            {equipos.map(({ p, f }) => (
              <td key={p.id}>{f[campo] || "Consúltanos"}</td>
            ))}
          </tr>
        ))}
        <tr className="nx-comparar-agregar">
          <th scope="row">
            <span className="nx-oculto">Agregar a la orden</span>
          </th>
          {equipos.map(({ p, cap, stock, enOrden, color }) => (
            <td key={p.id}>
              <button type="button" className="nx-btn nx-azul nx-lleno" disabled={enOrden >= stock || color === null} aria-label={`Agregar ${p.nombre} a mi orden`} onClick={() => alAgregar(articuloDe(p.id, cap, color ?? ""))}>
                {stock === 0 || color === null ? "Agotado" : enOrden ? <><Check size={16} aria-hidden /> En orden ({enOrden})</> : <><Plus size={16} aria-hidden /> Agregar</>}
              </button>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export function Comparador({ abierto, n, ids, alCerrar, alAgregar, alFicha }: { abierto: boolean; n: Nexus; ids: string[]; alCerrar: () => void; alAgregar: (clave: string) => void; alFicha: (id: string, cap: Capacidad) => void }) {
  return (
    <Ventana abierta={abierto && ids.length === 2} alCerrar={alCerrar} titulo="Comparar equipos" sub="Precios y cuotas sin recargo" ancha>
      <Tabla n={n} ids={ids} alAgregar={alAgregar} alFicha={alFicha} />
    </Ventana>
  );
}
