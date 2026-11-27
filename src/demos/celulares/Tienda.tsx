/*
 * Vista "Tienda" en cuatro niveles: equipo estrella, catálogo, Plan Retoma y, al final,
 * el acceso al taller. "Mi Orden" se abre desde el menú.
 */
import { useRef, useState } from "react";
import { ArrowLeftRight, ArrowRight, Check, Clock, CreditCard, FileText, MapPin, Plus, Search, ShieldCheck, Truck, Wrench, X } from "lucide-react";
import { irA, useDemora, useEscalonado } from "./animar";
import { Cifra } from "./Cifra";
import { Foto } from "./Marca";
import { SeccionRetoma } from "./Retoma";
import { CAPACIDADES, FILTROS, FOTOS, articuloDe, buscar, claveDe, clavesDe, coloresDe, disponibilidad, filtrar, foto, producto, qc, qz, type Capacidad, type Filtro, type Nexus, type Producto } from "./datos";

const CONFIANZA = [
  { icono: ShieldCheck, titulo: "Garantía escrita de 12 meses", texto: "Equipos liberados de fábrica, con factura." },
  { icono: CreditCard, titulo: "Hasta 18 Visacuotas sin recargo", texto: "También cuotas Credomatic, al precio de contado." },
  { icono: Truck, titulo: "Entrega asegurada en ciudad", texto: "Hoy mismo con pedidos confirmados antes de las 14:00." },
];

/* lo que la tienda puede hacer con un equipo, además de verlo */
export type Acciones = {
  alAgregar: (clave: string) => void;
  alFicha: (id: string, cap: Capacidad | null, color?: string) => void;
  alComparar: (id: string) => void;
  comparados: string[];
};

/* la presentación disponible más económica; si no queda ninguna, la más económica */
function preferida(p: Producto, n: Nexus) {
  const claves = clavesDe(p);
  const hay = claves.filter((k) => n.inventario[k].stock > 0);
  return [...(hay.length ? hay : claves)].sort((a, b) => n.inventario[a].precio - n.inventario[b].precio)[0];
}
/* la capacidad con la que abre cada tarjeta: la primera con existencias */
const capInicial = (p: Producto, n: Nexus) => p.capacidades.find((c) => n.inventario[claveDe(p.id, c)].stock > 0) ?? p.capacidades[0] ?? null;

function Destacado({ n, alAgregar, alFicha }: { n: Nexus } & Acciones) {
  const p = producto("magic7");
  const clave = preferida(p, n);
  const { precio, stock } = n.inventario[clave];
  const color = n.colorLibre(p.id);
  const enOrden = n.unidadesEn(clave);
  const cap = clave.split("|")[1] as Capacidad;
  const agotado = stock === 0 || color === null;
  return (
    <section className="nx-ancho nx-portada">
      <div className="nx-destacado nx-oscuro">
        <div className="nx-destacado-texto">
          <p className="nx-sello">Equipo estrella</p>
          <h1>{p.nombre}</h1>
          <p className="nx-destacado-detalle">Teleobjetivo de 200 MP y Snapdragon 8 Elite, en {cap}.</p>
          <div className="nx-destacado-precios">
            <p className="nx-destacado-cuota">
              <span>18 Visacuotas de</span>
              <strong>
                <Cifra valor={precio / 18} formato={qc} />
              </strong>
              <small>al mes, sin recargo</small>
            </p>
            <p>
              <span>Precio contado</span>
              <b>
                <Cifra valor={precio} formato={qz} />
              </b>
              <small>{disponibilidad(stock).texto}</small>
            </p>
          </div>
          <div className="nx-destacado-botones">
            <button type="button" className="nx-btn nx-azul" disabled={agotado || enOrden >= stock} onClick={() => alAgregar(articuloDe(p.id, cap, color ?? ""))}>
              {agotado ? (
                "Agotado"
              ) : enOrden ? (
                <>
                  <Check size={18} aria-hidden /> En tu orden ({enOrden})
                </>
              ) : (
                <>
                  <Plus size={18} aria-hidden /> Agregar a mi orden
                </>
              )}
            </button>
            <button type="button" className="nx-btn nx-claro" onClick={() => irA("nx-catalogo")}>
              Ver catálogo <ArrowRight size={18} aria-hidden />
            </button>
          </div>
        </div>
        <button type="button" className="nx-destacado-foto" aria-label={`Ver ficha técnica de ${p.nombre}`} onClick={() => alFicha(p.id, cap)}>
          <Foto src={foto(FOTOS.destacado, 900, 1000)} alt={`${p.nombre} visto por detrás, con su módulo de cámaras`} prioridad />
        </button>
      </div>

      <ul className="nx-pilares">
        {CONFIANZA.map(({ icono: Icono, titulo, texto }) => (
          <li key={titulo}>
            <Icono size={22} aria-hidden />
            <span>
              <b>{titulo}</b>
              <small>{texto}</small>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Tarjeta({ p, n, alAgregar, alFicha, alComparar, comparados }: { p: Producto; n: Nexus } & Acciones) {
  const [cap, setCap] = useState<Capacidad | null>(() => capInicial(p, n));
  const colores = coloresDe(p.id);
  const [color, setColor] = useState(() => n.colorLibre(p.id) || colores[0]?.nombre || "");
  const clave = claveDe(p.id, cap);
  const { precio, stock } = n.inventario[clave];
  const colorAgotado = !!color && !n.hayColor(p.id, color);
  const enOrden = n.unidadesEn(clave);
  const comparando = comparados.includes(p.id);
  const agotado = stock === 0 || colorAgotado;
  const tope = !agotado && enOrden >= stock;
  const estado = disponibilidad(colorAgotado ? 0 : stock);
  const ver = () => alFicha(p.id, cap, color);
  return (
    <article className="nx-producto" data-entra>
      <div className="nx-producto-cabeza">
        {p.accesorio ? (
          <Foto src={foto(p.foto, 640, 480)} alt={p.nombre} className="nx-producto-foto" />
        ) : (
          <button type="button" className="nx-producto-ver" aria-label={`Ver ficha técnica de ${p.nombre}`} onClick={ver}>
            <Foto src={foto(p.foto, 640, 480)} alt={p.nombre} className="nx-producto-foto" />
          </button>
        )}
        <div className="nx-producto-nombre">
          <p className="nx-etiquetas">
            <span className="nx-estado" data-tono={estado.tono} title={estado.texto === "Pocas unidades" ? `Quedan ${stock}` : undefined}>
              {estado.texto}
            </span>
            {p.nuevo && (
              <span className="nx-estado" data-tono="lleno">
                Nuevo
              </span>
            )}
          </p>
          <h3>
            {p.accesorio ? (
              p.nombre
            ) : (
              <button type="button" onClick={ver}>
                {p.nombre}
              </button>
            )}
          </h3>
          <p>{p.detalle}</p>
        </div>
      </div>

      {colores.length > 0 ? (
        <div className="nx-puntos">
          <div role="group" aria-label={`Color de ${p.nombre}`}>
            {colores.map((c) => {
              const hay = n.hayColor(p.id, c.nombre);
              return (
                <button key={c.nombre} type="button" aria-pressed={color === c.nombre} aria-label={hay ? c.nombre : `${c.nombre}, agotado`} title={hay ? c.nombre : `${c.nombre} (agotado)`} data-agotado={!hay} onClick={() => setColor(c.nombre)}>
                  <i style={{ background: c.tono }} />
                </button>
              );
            })}
          </div>
          <small>
            {color}
            {colorAgotado && " · agotado"}
          </small>
        </div>
      ) : p.accesorio ? (
        /* deja los precios a la misma altura que en los teléfonos */
        <div className="nx-puntos nx-sin-puntos" aria-hidden />
      ) : (
        <p className="nx-puntos">
          <small>Color según existencias</small>
        </p>
      )}

      {p.capacidades.length > 0 ? (
        <div className="nx-segmentos" role="group" aria-label={`Capacidad de ${p.nombre}`}>
          {CAPACIDADES.map((c) => {
            const existe = p.capacidades.includes(c);
            return (
              <button key={c} type="button" disabled={!existe} aria-pressed={cap === c} title={existe ? undefined : "No disponible en esta capacidad"} onClick={() => setCap(c)}>
                {c}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="nx-presentacion">Presentación única</p>
      )}

      <div className="nx-precio">
        <strong>
          <Cifra valor={precio} formato={qz} />
        </strong>
        <span>contado</span>
        <p>
          o{" "}
          <b>
            12 cuotas de <Cifra valor={precio / 12} formato={qc} />
          </b>{" "}
          sin recargo
        </p>
      </div>

      <button type="button" className={`nx-btn nx-lleno ${enOrden ? "nx-contorno" : "nx-azul"}`} disabled={agotado || tope} onClick={() => alAgregar(articuloDe(p.id, cap, color))}>
        {agotado ? (
          colorAgotado && stock > 0 ? "Elige otro color" : "Sin existencias"
        ) : tope ? (
          `En tu orden: ${enOrden} (no hay más)`
        ) : enOrden ? (
          <>
            <Check size={18} aria-hidden /> En tu orden ({enOrden}) · Otro
          </>
        ) : (
          <>
            <Plus size={18} aria-hidden /> Agregar a mi orden
          </>
        )}
      </button>

      {p.accesorio ? (
        <p className="nx-original">Producto original con garantía</p>
      ) : (
        <div className="nx-herramientas">
          <button type="button" onClick={ver}>
            <FileText size={16} aria-hidden /> Ficha técnica
          </button>
          <button
            type="button"
            aria-pressed={comparando}
            disabled={!comparando && comparados.length >= 2}
            title={!comparando && comparados.length >= 2 ? "Ya elegiste 2 equipos" : undefined}
            onClick={() => alComparar(p.id)}
          >
            {comparando ? <Check size={16} aria-hidden /> : <ArrowLeftRight size={16} aria-hidden />} {comparando ? "Elegido" : "Comparar"}
          </button>
        </div>
      )}
    </article>
  );
}

const ORDENES = [
  { id: "destacados", nombre: "Destacados" },
  { id: "menor", nombre: "Precio: de menor a mayor" },
  { id: "mayor", nombre: "Precio: de mayor a menor" },
] as const;
type Orden = (typeof ORDENES)[number]["id"];

function Catalogo({ n, ...acciones }: { n: Nexus } & Acciones) {
  const [filtro, setFiltro] = useState<Filtro>("Todos");
  const [texto, setTexto] = useState("");
  const [orden, setOrden] = useState<Orden>("destacados");
  const clave = `${filtro}|${orden}|${texto.trim().toLowerCase()}`;
  const cargando = useDemora(clave, 300);
  const rejilla = useRef<HTMLDivElement>(null);
  useEscalonado(rejilla, clave, 35, !cargando);

  /* se ordena por el precio que muestra la tarjeta al abrir */
  const precioDe = (p: Producto) => n.inventario[claveDe(p.id, capInicial(p, n))].precio;
  const encontrados = buscar(texto, filtrar(filtro, n.productos));
  const lista = orden === "destacados" ? encontrados : [...encontrados].sort((a, b) => (precioDe(a) - precioDe(b)) * (orden === "menor" ? 1 : -1));

  return (
    <section id="nx-catalogo" className="nx-seccion nx-ancho">
      <div className="nx-titulo">
        <h2>Equipos y accesorios</h2>
        <p>Precios en quetzales, con IVA incluido. Toca un equipo para ver su ficha técnica o compara hasta dos.</p>
      </div>
      <div className="nx-buscador">
        <label className="nx-busca">
          <Search size={18} aria-hidden />
          <span className="nx-oculto">Buscar en el catálogo</span>
          <input type="search" value={texto} placeholder="Buscar equipo o accesorio" maxLength={40} onChange={(e) => setTexto(e.target.value)} />
          {texto && (
            <button type="button" aria-label="Borrar búsqueda" onClick={() => setTexto("")}>
              <X size={16} aria-hidden />
            </button>
          )}
        </label>
        <label className="nx-ordenar">
          <span className="nx-oculto">Ordenar</span>
          <select className="nx-campo" value={orden} onChange={(e) => setOrden(e.target.value as Orden)}>
            {ORDENES.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="nx-filtros" role="group" aria-label="Filtrar por marca">
        {FILTROS.map((f) => (
          <button key={f} type="button" aria-pressed={filtro === f} onClick={() => setFiltro(f)}>
            {f}
          </button>
        ))}
      </div>
      <p className="nx-conteo" role="status">
        {cargando ? "Buscando…" : `${lista.length} ${lista.length === 1 ? "producto" : "productos"}`}
      </p>
      <div className="nx-rejilla" ref={rejilla} aria-busy={cargando}>
        {cargando
          ? Array.from({ length: Math.max(1, Math.min(lista.length, 10)) }, (_, i) => (
              <div key={i} className="nx-producto nx-esqueleto" aria-hidden>
                <div className="nx-producto-cabeza">
                  <i className="nx-producto-foto" />
                  <div className="nx-producto-nombre">
                    <i style={{ width: "35%" }} />
                    <i style={{ width: "80%", height: 20 }} />
                    <i style={{ width: "95%" }} />
                  </div>
                </div>
                <i style={{ height: 44 }} />
                <i style={{ height: 56, width: "70%" }} />
                <i style={{ height: 48 }} />
              </div>
            ))
          : lista.map((p) => <Tarjeta key={p.id} p={p} n={n} {...acciones} />)}
      </div>
      {!cargando && lista.length === 0 && (
        <div className="nx-vacio">
          <p>No encontramos “{texto.trim()}” en {filtro === "Todos" ? "el catálogo" : filtro}.</p>
          <button
            type="button"
            className="nx-btn nx-contorno"
            onClick={() => {
              setTexto("");
              setFiltro("Todos");
            }}
          >
            Ver todo el catálogo
          </button>
        </div>
      )}
    </section>
  );
}

export function Tienda({ n, alTaller, alVerOrden, ...acciones }: { n: Nexus; alTaller: () => void; alVerOrden: () => void } & Acciones) {
  return (
    <>
      <Destacado n={n} {...acciones} />
      <Catalogo n={n} {...acciones} />
      <SeccionRetoma n={n} alVerOrden={alVerOrden} alCatalogo={() => irA("nx-catalogo")} />

      <section className="nx-ancho nx-aviso-taller">
        <div className="nx-aviso-caja">
          <Foto src={foto(FOTOS.taller, 900, 650)} alt="Técnico con guantes reparando la pantalla de un teléfono" />
          <div>
            <h2>¿Pantalla rota o batería agotada?</h2>
            <p>Cotiza tu reparación en un minuto, agenda tu ingreso y sigue el avance con tu número de orden.</p>
            <ul>
              <li>
                <Clock size={18} aria-hidden /> Pantallas y baterías de iPhone desde 35 minutos
              </li>
              <li>
                <MapPin size={18} aria-hidden /> Taller técnico en Zona 10
              </li>
            </ul>
            <button type="button" className="nx-btn nx-negro" onClick={alTaller}>
              <Wrench size={18} aria-hidden /> Cotizar reparación
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
