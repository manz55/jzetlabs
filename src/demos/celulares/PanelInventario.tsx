/* Inventario y precios: edición en vivo, colores disponibles y publicación de productos nuevos. */
import { useRef, useState, type FormEvent } from "react";
import { CircleCheck, ImagePlus, Minus, PackagePlus, Plus, Search, X } from "lucide-react";
import { Foto } from "./Marca";
import { CAPACIDADES, MARCAS, achicarFoto, buscar, claveDe, clavesDe, coloresDe, disponibilidad, foto, nombreDe, type Capacidad, type Marca, type Nexus, type Producto } from "./datos";

/* se escribe con libertad y se guarda al salir del campo o con Enter; si queda vacío o en cero, vuelve el valor anterior */
function Numero({ valor, minimo, etiqueta, alGuardar }: { valor: number; minimo: number; etiqueta: string; alGuardar: (v: number) => void }) {
  const [borrador, setBorrador] = useState<string | null>(null);
  function guardar() {
    if (borrador === null) return;
    const v = Number(borrador);
    if (borrador !== "" && Number.isInteger(v) && v >= minimo) alGuardar(v);
    setBorrador(null);
  }
  return (
    <input
      type="text"
      inputMode="numeric"
      aria-label={etiqueta}
      value={borrador ?? String(valor)}
      onFocus={(e) => e.target.select()}
      onChange={(e) => setBorrador(e.target.value.replace(/\D/g, "").slice(0, 6))}
      onBlur={guardar}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
    />
  );
}

/* si no se sube foto, se usa una genérica del tipo de producto */
const FOTO_TELEFONO = "1695973056909-67189edc1c9e";
const FOTO_ACCESORIO = "1595756630452-736bc8ef3693";

const VACIO = { tipo: "telefono" as "telefono" | "accesorio", nombre: "", marca: "Samsung" as Marca | "Otra", capacidades: ["256 GB"] as Capacidad[], precio: "", stock: "", detalle: "", imagen: "", pantalla: "", chip: "", camaras: "", bateria: "" };

function Publicar({ n, alCerrar }: { n: Nexus; alCerrar: (publicado?: Producto) => void }) {
  const [d, setD] = useState(VACIO);
  const [error, setError] = useState("");
  const archivo = useRef<HTMLInputElement>(null);
  const telefono = d.tipo === "telefono";
  const cambiar = (c: Partial<typeof VACIO>) => {
    setD((x) => ({ ...x, ...c }));
    setError("");
  };

  async function subir(f: File | undefined) {
    if (!f) return;
    try {
      cambiar({ imagen: await achicarFoto(f) });
    } catch {
      setError("Esa imagen no se pudo leer. Prueba con una foto JPG o PNG.");
    }
  }

  function publicar(e: FormEvent) {
    e.preventDefault();
    const nombre = d.nombre.trim();
    if (nombre.length < 3) return setError("Escribe el nombre del producto.");
    if (n.productos.some((p) => p.nombre.toLowerCase() === nombre.toLowerCase())) return setError("Ya hay un producto con ese nombre.");
    if (telefono && !d.capacidades.length) return setError("Marca al menos una capacidad.");
    if (!(Number(d.precio) > 0)) return setError("Escribe el precio de contado.");
    if (d.stock === "") return setError("Escribe las existencias.");
    const nuevo = n.publicar({
      producto: {
        nombre,
        marca: d.marca === "Otra" ? null : d.marca,
        accesorio: !telefono,
        detalle: d.detalle.trim() || (telefono ? "Liberado de fábrica" : "Accesorio con garantía"),
        foto: d.imagen || (telefono ? FOTO_TELEFONO : FOTO_ACCESORIO),
        capacidades: telefono ? CAPACIDADES.filter((c) => d.capacidades.includes(c)) : [],
      },
      ficha: telefono ? { colores: [], pantalla: d.pantalla.trim(), procesador: d.chip.trim(), memoria: "", camaras: d.camaras.trim(), frontal: "", bateria: d.bateria.trim(), sim: "", caja: [] } : null,
      precio: Number(d.precio),
      stock: Number(d.stock),
    });
    alCerrar(nuevo);
  }

  return (
    <form className="nx-publicar" onSubmit={publicar} noValidate aria-labelledby="nx-publicar-titulo">
      <div className="nx-publicar-cabeza">
        <h2 id="nx-publicar-titulo">
          <PackagePlus size={20} aria-hidden /> Publicar equipo o accesorio
        </h2>
        <button type="button" aria-label="Cerrar formulario" onClick={() => alCerrar()}>
          <X size={18} aria-hidden />
        </button>
      </div>
      <div className="nx-segmentos nx-dos" role="group" aria-label="Tipo de producto">
        <button type="button" aria-pressed={telefono} onClick={() => cambiar({ tipo: "telefono" })}>
          Teléfono
        </button>
        <button type="button" aria-pressed={!telefono} onClick={() => cambiar({ tipo: "accesorio" })}>
          Accesorio
        </button>
      </div>
      <div className="nx-publicar-campos">
        <label className="nx-todo">
          <span>Nombre</span>
          <input className="nx-campo" value={d.nombre} maxLength={50} placeholder={telefono ? "Ej. Samsung Galaxy A56" : "Ej. Funda MagSafe"} onChange={(e) => cambiar({ nombre: e.target.value })} />
        </label>
        <label>
          <span>Marca</span>
          <select className="nx-campo" value={d.marca} onChange={(e) => cambiar({ marca: e.target.value as Marca | "Otra" })}>
            {[...MARCAS, "Otra"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Precio contado (Q)</span>
          <input className="nx-campo" inputMode="numeric" value={d.precio} placeholder="0" onChange={(e) => cambiar({ precio: e.target.value.replace(/\D/g, "").slice(0, 6) })} />
        </label>
        <label>
          <span>Existencias</span>
          <input className="nx-campo" inputMode="numeric" value={d.stock} placeholder="0" onChange={(e) => cambiar({ stock: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
        </label>
        <div className="nx-subir">
          <span>Foto</span>
          <button type="button" className="nx-btn nx-contorno" onClick={() => archivo.current?.click()}>
            {d.imagen ? <img src={d.imagen} alt="Foto elegida" /> : <ImagePlus size={18} aria-hidden />}
            {d.imagen ? "Cambiar" : "Subir foto"}
          </button>
          <input ref={archivo} type="file" accept="image/*" aria-label="Foto del producto" className="nx-oculto" tabIndex={-1} onChange={(e) => subir(e.target.files?.[0])} />
        </div>
        <label className="nx-todo">
          <span>Descripción corta</span>
          <input className="nx-campo" value={d.detalle} maxLength={70} placeholder="Lo que el cliente lee en la tarjeta" onChange={(e) => cambiar({ detalle: e.target.value })} />
        </label>
      </div>
      {telefono && (
        <>
          <p className="nx-rotulo">Capacidades (con el mismo precio; luego se ajustan una por una)</p>
          <div className="nx-segmentos" role="group" aria-label="Capacidades a publicar">
            {CAPACIDADES.map((c) => (
              <button key={c} type="button" aria-pressed={d.capacidades.includes(c)} onClick={() => cambiar({ capacidades: d.capacidades.includes(c) ? d.capacidades.filter((x) => x !== c) : [...d.capacidades, c] })}>
                {c}
              </button>
            ))}
          </div>
          <details className="nx-specs-form">
            <summary>Ficha técnica (opcional)</summary>
            <div className="nx-publicar-campos">
              {(
                [
                  ["pantalla", "Pantalla"],
                  ["chip", "Chip"],
                  ["camaras", "Cámaras"],
                  ["bateria", "Batería"],
                ] as const
              ).map(([k, nombre]) => (
                <label key={k}>
                  <span>{nombre}</span>
                  <input className="nx-campo" value={d[k]} maxLength={90} onChange={(e) => cambiar({ [k]: e.target.value })} />
                </label>
              ))}
            </div>
          </details>
        </>
      )}
      {error && (
        <p className="nx-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="nx-btn nx-azul nx-lleno nx-publicar-enviar">
        Publicar en la Tienda
      </button>
    </form>
  );
}

function Ficha({ p, n }: { p: Producto; n: Nexus }) {
  const unidades = clavesDe(p).reduce((s, k) => s + n.inventario[k].stock, 0);
  const colores = coloresDe(p.id);
  return (
    <li className="nx-ficha">
      <div className="nx-inventario-cabeza">
        <Foto src={foto(p.foto, 160, 160)} alt="" />
        <div>
          <h3>{p.nombre}</h3>
          <small>
            {unidades} {unidades === 1 ? "unidad" : "unidades"} en bodega
          </small>
        </div>
      </div>
      <div className="nx-variantes">
        <div className="nx-variante nx-variante-titulos" aria-hidden>
          <span>Presentación</span>
          <span>Contado (Q)</span>
          <span>Bodega</span>
        </div>
        {(p.capacidades.length ? p.capacidades : [null]).map((c) => {
          const k = claveDe(p.id, c);
          const v = n.inventario[k];
          const etiqueta = nombreDe(k);
          const estado = disponibilidad(v.stock);
          return (
            <div className="nx-variante" key={k}>
              <span>
                {c ?? "Única"}
                <em data-tono={estado.tono}>{estado.texto}</em>
              </span>
              <Numero valor={v.precio} minimo={1} etiqueta={`Precio de ${etiqueta} en quetzales`} alGuardar={(precio) => n.editarVariante(k, { precio })} />
              <div className="nx-stock">
                <button type="button" aria-label={`Quitar una unidad de ${etiqueta}`} disabled={v.stock === 0} onClick={() => n.editarVariante(k, { stock: v.stock - 1 })}>
                  <Minus size={15} aria-hidden />
                </button>
                <Numero valor={v.stock} minimo={0} etiqueta={`Existencias de ${etiqueta}`} alGuardar={(stock) => n.editarVariante(k, { stock })} />
                <button type="button" aria-label={`Sumar una unidad de ${etiqueta}`} onClick={() => n.editarVariante(k, { stock: v.stock + 1 })}>
                  <Plus size={15} aria-hidden />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {colores.length > 0 && (
        <div className="nx-colores-stock" role="group" aria-label={`Colores disponibles de ${p.nombre}`}>
          {colores.map((c) => {
            const hay = n.hayColor(p.id, c.nombre);
            return (
              <button key={c.nombre} type="button" aria-pressed={hay} title={hay ? "Toca para marcarlo agotado" : "Toca para volver a ofrecerlo"} onClick={() => n.alternarColor(p.id, c.nombre)}>
                <i style={{ background: c.tono }} aria-hidden />
                {c.nombre}
              </button>
            );
          })}
        </div>
      )}
    </li>
  );
}

export function PanelInventario({ n }: { n: Nexus }) {
  const [publicando, setPublicando] = useState(false);
  const [publicado, setPublicado] = useState<Producto | null>(null);
  const [texto, setTexto] = useState("");
  const lista = buscar(texto, n.productos);
  return (
    <>
      <div className="nx-inventario-barra">
        <label className="nx-busca">
          <Search size={18} aria-hidden />
          <span className="nx-oculto">Buscar en inventario</span>
          <input type="search" value={texto} placeholder="Buscar en inventario" maxLength={40} onChange={(e) => setTexto(e.target.value)} />
        </label>
        {!publicando && (
          <button
            type="button"
            className="nx-btn nx-azul"
            onClick={() => {
              setPublicando(true);
              setPublicado(null);
            }}
          >
            <PackagePlus size={18} aria-hidden /> Publicar equipo o accesorio
          </button>
        )}
      </div>
      {publicando && (
        <Publicar
          n={n}
          alCerrar={(p) => {
            setPublicando(false);
            if (p) {
              setPublicado(p);
              setTexto("");
            }
          }}
        />
      )}
      {publicado && (
        <p className="nx-ingreso-listo" role="status">
          <CircleCheck size={20} aria-hidden />
          <span>
            <b>{publicado.nombre}</b> ya está en la Tienda.
          </span>
        </p>
      )}
      <p className="nx-suave">Los cambios se ven en la Tienda al instante. El precio se guarda al salir del campo; toca un color para marcarlo agotado.</p>
      <ul className="nx-inventario">
        {lista.map((p) => (
          <Ficha key={p.id} p={p} n={n} />
        ))}
      </ul>
      {lista.length === 0 && <p className="nx-vacio">No hay productos con ese nombre.</p>}
    </>
  );
}
