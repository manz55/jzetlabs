/* La carta: ocho platillos con filtro, esqueleto de carga, entrada escalonada y elección de término y guarnición. */
import { useRef, useState } from "react";
import { Clock, Plus } from "lucide-react";
import { useCarga, useEscalonado } from "./animar";
import { CARTA, FILTROS, GUARNICIONES, TERMINOS, foto, qz, type Brasa, type Filtro, type Plato } from "./datos";

export function Carta({ b, filtro, alFiltrar, alAgregar }: { b: Brasa; filtro: Filtro; alFiltrar: (f: Filtro) => void; alAgregar: (nombre: string) => void }) {
  const rejilla = useRef<HTMLDivElement>(null);
  const cargando = useCarga(filtro, 300);
  const platos = CARTA.filter((p) => filtro === "todos" || p.categoria === filtro);
  useEscalonado(rejilla, filtro, !cargando);

  return (
    <section className="bm-carta" id="bm-carta">
      <div className="bm-ancho">
        <div className="bm-titulo-seccion">
          <h2>La carta</h2>
          <p>Precios en quetzales. El tiempo es lo que tarda en salir de cocina.</p>
        </div>
        <div className="bm-filtros" role="group" aria-label="Filtrar la carta">
          {FILTROS.map((f) => (
            <button key={f.id} type="button" aria-pressed={filtro === f.id} onClick={() => alFiltrar(f.id)}>
              {f.nombre}
            </button>
          ))}
        </div>
        <div ref={rejilla} className="bm-platos" aria-busy={cargando}>
          {cargando
            ? platos.map((p) => (
                <div key={p.id} className="bm-plato bm-esqueleto" aria-hidden>
                  <span className="bm-hueso bm-hueso-foto" />
                  <div className="bm-plato-cuerpo">
                    <span className="bm-hueso" style={{ width: "70%", height: 22 }} />
                    <span className="bm-hueso" style={{ width: "100%" }} />
                    <span className="bm-hueso" style={{ width: "55%" }} />
                    <span className="bm-hueso" style={{ width: "100%", height: 46, marginTop: "auto" }} />
                  </div>
                </div>
              ))
            : platos.map((p) => <Ficha key={p.id} p={p} b={b} alAgregar={alAgregar} />)}
        </div>
      </div>
    </section>
  );
}

function Ficha({ p, b, alAgregar }: { p: Plato; b: Brasa; alAgregar: (nombre: string) => void }) {
  const [termino, setTermino] = useState("Medio");
  const [guarnicion, setGuarnicion] = useState(GUARNICIONES[0]);
  const agotado = b.estado.agotados.includes(p.id);
  const enPedido = b.estado.lineas.filter((l) => l.id === p.id).reduce((s, l) => s + l.cantidad, 0);

  return (
    <article className={`bm-plato ${agotado ? "bm-agotado" : ""}`} data-entra>
      <div className="bm-plato-foto">
        <img src={foto(p.foto, 720, 540)} alt={p.alt} loading="lazy" decoding="async" />
        <span className="bm-tiempo">
          <Clock size={13} aria-hidden /> {p.minutos} min
        </span>
        {agotado && <span className="bm-sello">Agotado por hoy</span>}
      </div>
      <div className="bm-plato-cuerpo">
        <div>
          <h3>{p.nombre}</h3>
          {p.porcion && <small>{p.porcion}</small>}
        </div>
        <p>{p.detalle}</p>

        {p.conTermino && (
          <div className="bm-terminos" role="group" aria-label={`Término de ${p.nombre}`}>
            {TERMINOS.map((t) => (
              <button key={t} type="button" aria-pressed={termino === t} disabled={agotado} onClick={() => setTermino(t)}>
                {t}
              </button>
            ))}
          </div>
        )}
        {p.conGuarnicion && (
          <label className="bm-guarnicion">
            <span>Guarnición</span>
            <select value={guarnicion} disabled={agotado} onChange={(e) => setGuarnicion(e.target.value)}>
              {GUARNICIONES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
        )}

        <div className="bm-plato-pie">
          <strong>{qz(p.precio)}</strong>
          <button
            type="button"
            className="bm-btn bm-carbon"
            disabled={agotado}
            onClick={() => {
              b.agregar(p.id, p.conTermino ? termino : undefined, p.conGuarnicion ? guarnicion : undefined);
              alAgregar(p.nombre);
            }}
            aria-label={agotado ? `${p.nombre}, agotado` : `Agregar ${p.nombre}`}
          >
            {agotado ? (
              "Agotado"
            ) : (
              <>
                <Plus size={17} aria-hidden /> Agregar
                {enPedido > 0 && <i>{enPedido}</i>}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
