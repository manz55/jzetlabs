/*
 * Panel Admin de Vértice Studio: las órdenes que entran desde la tienda y el inventario
 * por talla con sus precios. Lo que se cambia aquí se ve al instante en la tienda.
 */
import { useState } from "react";
import { Check, ClipboardList, Minus, Package, Plus, RotateCcw, Truck } from "lucide-react";
import { Foto } from "./Piezas";
import {
  ENVIOS, NOMBRE_ESTADO, PRODUCTOS, SIGUIENTE_ESTADO, existencia, nombreTalla, qz, tallasDe,
  type EstadoOrden, type Orden, type Producto, type Talla, type Vertice,
} from "./datos";

export type Seccion = "ordenes" | "inventario";
type FiltroOrden = "abiertas" | "todas" | EstadoOrden;
const FILTROS: { id: FiltroOrden; nombre: string }[] = [
  { id: "abiertas", nombre: "Por atender" },
  { id: "entregada", nombre: "Entregadas" },
  { id: "cancelada", nombre: "Canceladas" },
  { id: "todas", nombre: "Todas" },
];
const abierta = (o: Orden) => o.estado === "nueva" || o.estado === "confirmada" || o.estado === "enviada";
const fecha = (ms: number) => new Date(ms).toLocaleString("es-GT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const POCAS = 2;

export function Admin({ v, seccion, alSeccion }: { v: Vertice; seccion: Seccion; alSeccion: (s: Seccion) => void }) {
  const { estado } = v;
  const [filtro, setFiltro] = useState<FiltroOrden>("abiertas");
  const [confirmaReinicio, setConfirmaReinicio] = useState(false);

  const nuevas = estado.ordenes.filter((o) => o.estado === "nueva").length;
  const porCobrar = estado.ordenes.filter(abierta).reduce((s, o) => s + o.total, 0);
  const bajas = PRODUCTOS.flatMap((p) => tallasDe(p).map((t) => existencia(estado, p.id, t)));
  const agotadas = bajas.filter((n) => n === 0).length;
  const pocas = bajas.filter((n) => n > 0 && n <= POCAS).length;
  const lista = estado.ordenes.filter((o) => (filtro === "todas" ? true : filtro === "abiertas" ? abierta(o) : o.estado === filtro));

  return (
    <div className="vx-admin vx-ancho">
      <header className="vx-vista-titulo">
        <h1>Panel de Vértice Studio</h1>
        <p>Órdenes de la tienda y existencias por talla.</p>
      </header>

      <ul className="vx-cifras">
        <li data-fuerte="true"><span>Órdenes nuevas</span><b>{nuevas}</b><small>por confirmar</small></li>
        <li><span>Por cobrar</span><b>{qz(porCobrar)}</b><small>órdenes sin entregar</small></li>
        <li><span>Tallas agotadas</span><b>{agotadas}</b><small>ya no se venden en la tienda</small></li>
        <li><span>Tallas por acabarse</span><b>{pocas}</b><small>con {POCAS} unidades o menos</small></li>
      </ul>

      <div className="vx-segmentos vx-admin-secciones" role="group" aria-label="Secciones del panel">
        <button type="button" aria-pressed={seccion === "ordenes"} onClick={() => alSeccion("ordenes")}>
          <ClipboardList size={17} aria-hidden /> Órdenes
        </button>
        <button type="button" aria-pressed={seccion === "inventario"} onClick={() => alSeccion("inventario")}>
          <Package size={17} aria-hidden /> Inventario y precios
        </button>
      </div>

      {seccion === "ordenes" ? (
        <section aria-label="Órdenes">
          <div className="vx-filtros" role="group" aria-label="Filtrar órdenes">
            {FILTROS.map((f) => (
              <button key={f.id} type="button" aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}>
                {f.nombre}
              </button>
            ))}
          </div>
          {lista.length === 0 ? (
            <p className="vx-vacio">No hay órdenes en esta lista.</p>
          ) : (
            <ul className="vx-ordenes">
              {lista.map((o) => <TarjetaOrden key={o.numero} o={o} v={v} />)}
            </ul>
          )}
        </section>
      ) : (
        <section aria-label="Inventario y precios">
          <p className="vx-nota">Escribe o ajusta las unidades. Una talla en 0 queda deshabilitada en la tienda.</p>
          <ul className="vx-inventario">
            {PRODUCTOS.map((p) => <FilaProducto key={p.id} p={p} v={v} />)}
          </ul>
        </section>
      )}

      <div className="vx-reinicio">
        {confirmaReinicio ? (
          <>
            <span>¿Volver a las órdenes, precios y existencias del inicio?</span>
            <button type="button" className="vx-btn vx-negro" onClick={() => { v.restablecer(); setConfirmaReinicio(false); }}>Sí, restablecer</button>
            <button type="button" className="vx-btn vx-contorno" onClick={() => setConfirmaReinicio(false)}>No</button>
          </>
        ) : (
          <button type="button" className="vx-btn vx-texto" onClick={() => setConfirmaReinicio(true)}>
            <RotateCcw size={16} aria-hidden /> Restablecer datos
          </button>
        )}
      </div>
    </div>
  );
}

function TarjetaOrden({ o, v }: { o: Orden; v: Vertice }) {
  const [cancelando, setCancelando] = useState(false);
  const paso = SIGUIENTE_ESTADO[o.estado];
  const c = o.cliente;
  return (
    <li className="vx-orden">
      <div className="vx-orden-cabeza">
        <div>
          <h2>{o.numero}</h2>
          <p>{fecha(o.fecha)}</p>
        </div>
        <span className="vx-estado" data-estado={o.estado}>{NOMBRE_ESTADO[o.estado]}</span>
      </div>
      <div className="vx-orden-cliente">
        <b>{c.nombre}</b>
        <p>{c.telefono} · {c.pago}</p>
        <p>{c.direccion}, {c.zona === "ciudad" ? ENVIOS.ciudad.nombre : c.departamento}</p>
      </div>
      <ul className="vx-orden-items">
        {o.items.map((i, k) => (
          <li key={k}>
            <span>
              {i.cantidad} × {i.nombre} <em>{nombreTalla(i.talla)}</em>
              {i.outfit && <em>Outfit</em>}
            </span>
            <b>{qz(i.precio * i.cantidad)}</b>
          </li>
        ))}
      </ul>
      <dl>
        {o.descuento > 0 && <div><dt>Descuento de outfit</dt><dd>-{qz(o.descuento)}</dd></div>}
        <div><dt>Envío</dt><dd>{qz(o.envio)}</dd></div>
        <div className="vx-total"><dt>Total</dt><dd>{qz(o.total)}</dd></div>
      </dl>
      {paso && (
        <div className="vx-orden-botones">
          {cancelando ? (
            <>
              <p>Las prendas vuelven al inventario.</p>
              <button type="button" className="vx-btn vx-negro" onClick={() => v.cancelar(o.numero)}>Sí, cancelar {o.numero}</button>
              <button type="button" className="vx-btn vx-contorno" onClick={() => setCancelando(false)}>Volver</button>
            </>
          ) : (
            <>
              <button type="button" className="vx-btn vx-oliva" onClick={() => v.avanzar(o.numero)}>
                {paso.a === "enviada" ? <Truck size={17} aria-hidden /> : <Check size={17} aria-hidden />} {paso.accion}
              </button>
              <button type="button" className="vx-btn vx-texto" onClick={() => setCancelando(true)}>Cancelar orden</button>
            </>
          )}
        </div>
      )}
    </li>
  );
}

function FilaProducto({ p, v }: { p: Producto; v: Vertice }) {
  const precio = v.estado.precios[p.id];
  return (
    <li className="vx-articulo">
      <div className="vx-articulo-quien">
        <Foto p={p} className="vx-mini" decorativa />
        <h2>{p.nombre}</h2>
        {/* la clave vuelve a pintar el campo si el precio cambia desde otra pestaña */}
        <Precio key={precio} nombre={p.nombre} valor={precio} alGuardar={(n) => v.ponerPrecio(p.id, n)} />
      </div>
      <ul className="vx-existencias">
        {tallasDe(p).map((t) => (
          <Existencia key={t} p={p} t={t} v={v} />
        ))}
      </ul>
    </li>
  );
}

function Precio({ nombre, valor, alGuardar }: { nombre: string; valor: number; alGuardar: (n: number) => void }) {
  const escrito = Number.isInteger(valor) ? String(valor) : valor.toFixed(2);
  const [texto, setTexto] = useState(escrito);
  const [error, setError] = useState(false);
  function guardar() {
    const n = Number(texto.replace(",", "."));
    if (!(n >= 1 && n <= 99999)) {
      setError(true);
      setTexto(escrito);
      return;
    }
    setError(false);
    alGuardar(n);
  }
  return (
    <label className="vx-precio-campo">
      <span>Precio Q</span>
      <input
        inputMode="decimal"
        aria-label={`Precio de ${nombre} en quetzales`}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={guardar}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
      />
      {error && <small role="alert">Pon un precio mayor que cero.</small>}
    </label>
  );
}

function Existencia({ p, t, v }: { p: Producto; t: Talla; v: Vertice }) {
  const n = existencia(v.estado, p.id, t);
  const que = `${p.nombre}, talla ${nombreTalla(t)}`;
  return (
    <li data-nivel={n === 0 ? "cero" : n <= POCAS ? "poco" : "bien"}>
      <span>{t === "U" ? "Única" : t}</span>
      <div>
        <button type="button" aria-label={`Una menos: ${que}`} disabled={n === 0} onClick={() => v.ponerStock(p.id, t, n - 1)}>
          <Minus size={14} aria-hidden />
        </button>
        <input inputMode="numeric" aria-label={`Unidades de ${que}`} value={n} onFocus={(e) => e.target.select()} onChange={(e) => v.ponerStock(p.id, t, Number(e.target.value.replace(/\D/g, "").slice(0, 3)))} />
        <button type="button" aria-label={`Una más: ${que}`} onClick={() => v.ponerStock(p.id, t, n + 1)}>
          <Plus size={14} aria-hidden />
        </button>
      </div>
      <small>{n === 0 ? "Agotada" : n <= POCAS ? "Quedan pocas" : "unidades"}</small>
    </li>
  );
}
