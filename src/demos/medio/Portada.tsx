/* La portada asimétrica, las páginas de sección y su esqueleto de carga. */
import { ArrowRight } from "lucide-react";
import { Foto, Meta, Tarjeta, Titular } from "./Piezas";
import { NOTICIAS, OPINION, SECCIONES, hace, hora, iniciales, instante, porId, recientes, type Nota, type SeccionId, type Vista } from "./datos";

type Comunes = { abierto: number; alAbrir: (id: string) => void };

/* orden de la portada, decidido por la redacción */
const PRINCIPAL = porId("paso-elevado-ingreso-sur")!;
const SECUNDARIAS = ["exportadores-adelantan-embarques", "tejedoras-solola-exportacion", "software-servicios-exterior"].map((id) => porId(id)!);
const EN_PORTADA = new Set([PRINCIPAL, ...SECUNDARIAS].map((n) => n.id));
const BLOQUES: SeccionId[] = ["economia", "tecnologia", "deportes"];

/* Columna de lo último: hora exacta, hace cuánto y el titular */
function UltimaHora({ notas, titulo, abierto, alAbrir }: Comunes & { notas: Nota[]; titulo: string }) {
  return (
    <aside className="cc-ultima" aria-label={titulo}>
      <div className="cc-rotulo">
        <h2>{titulo}</h2>
        <span className="cc-envivo">En vivo</span>
      </div>
      <ol>
        {notas.map((n) => {
          const cuando = instante(abierto, n.minutos);
          return (
            <li key={n.id} data-entra>
              <p className="cc-marca">
                <time dateTime={cuando.toISOString()}>{hora(cuando)}</time>
                <span>{hace(n.minutos)}</span>
              </p>
              <Titular nota={n} alAbrir={alAbrir} />
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

function Principal({ nota, alAbrir, deSeccion = false }: { nota: Nota; alAbrir: (id: string) => void; deSeccion?: boolean }) {
  return (
    <article className="cc-principal" data-entra>
      <Foto nota={nota} ancho={deSeccion ? 1200 : 1280} alto={deSeccion ? 675 : 640} tamanos="(min-width: 1024px) 48rem, 100vw" primera decorativa={false} />
      <p className="cc-antetitulo cc-antetitulo-principal">{nota.antetitulo}</p>
      <Titular nota={nota} alAbrir={alAbrir} nivel="h2" />
      <p className="cc-bajada">{nota.bajada}</p>
      <Meta nota={nota} />
    </article>
  );
}

function Opinion({ alAbrir }: { alAbrir: (id: string) => void }) {
  return (
    <aside className="cc-opinion" aria-labelledby="cc-opinion-titulo" data-entra>
      <div className="cc-rotulo">
        <h2 id="cc-opinion-titulo">Opinión y análisis</h2>
      </div>
      <ul>
        {OPINION.map((n) => (
          <li key={n.id}>
            <span className="cc-iniciales" aria-hidden>
              {iniciales(n.autor)}
            </span>
            <div>
              <p className="cc-firma">{n.autor}</p>
              <Titular nota={n} alAbrir={alAbrir} />
              <p className="cc-cargo">{n.cargo}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function Portada({ abierto, alAbrir }: Comunes) {
  const ultimas = recientes(NOTICIAS.filter((n) => !EN_PORTADA.has(n.id))).slice(0, 6);
  return (
    <>
      <div className="cc-ancho">
        <h1 className="sr-only">Crónica Central: portada</h1>
        <div className="cc-grilla cc-grilla-alta">
          <Principal nota={PRINCIPAL} alAbrir={alAbrir} />
          <UltimaHora notas={ultimas} titulo="Última hora" abierto={abierto} alAbrir={alAbrir} />
        </div>
        <div className="cc-grilla cc-grilla-baja">
          <div className="cc-secundarias">
            {SECUNDARIAS.map((n) => (
              <Tarjeta key={n.id} nota={n} alAbrir={alAbrir} />
            ))}
          </div>
          <Opinion alAbrir={alAbrir} />
        </div>
      </div>
    </>
  );
}

/* Lo que va después del boletín: un bloque por sección y más de Nacionales */
export function PortadaBaja({ alAbrir, alElegir }: { alAbrir: (id: string) => void; alElegir: (v: Vista) => void }) {
  return (
    <>
      <div className="cc-ancho cc-bloques">
        {BLOQUES.map((id) => {
          const [primera, ...resto] = recientes(NOTICIAS.filter((n) => n.seccion === id && !EN_PORTADA.has(n.id))).slice(0, 3);
          const nombre = SECCIONES.find((s) => s.id === id)!.nombre;
          return (
            <section key={id} aria-label={nombre}>
              <div className="cc-rotulo">
                <h2>{nombre}</h2>
                <button type="button" className="cc-ver" onClick={() => alElegir(id)}>
                  Ver sección <ArrowRight size={14} aria-hidden />
                </button>
              </div>
              <article className="cc-bloque-primera" data-entra>
                <Foto nota={primera} ancho={600} alto={338} tamanos="(min-width: 768px) 24rem, 100vw" />
                <Titular nota={primera} alAbrir={alAbrir} />
                <Meta nota={primera} conAutor={false} />
              </article>
              <ul>
                {resto.map((n) => (
                  <li key={n.id} data-entra>
                    <Titular nota={n} alAbrir={alAbrir} />
                    <Meta nota={n} conAutor={false} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="cc-ancho cc-mas">
        <div className="cc-rotulo">
          <h2>Más de Nacionales</h2>
          <button type="button" className="cc-ver" onClick={() => alElegir("nacionales")}>
            Ver sección <ArrowRight size={14} aria-hidden />
          </button>
        </div>
        <div className="cc-rejilla">
          {recientes(NOTICIAS.filter((n) => n.seccion === "nacionales" && !EN_PORTADA.has(n.id)))
            .slice(0, 4)
            .map((n) => (
              <Tarjeta key={n.id} nota={n} alAbrir={alAbrir} />
            ))}
        </div>
      </div>
    </>
  );
}

export function Seccion({ id, abierto, alAbrir }: Comunes & { id: SeccionId }) {
  const seccion = SECCIONES.find((s) => s.id === id)!;
  const [primera, ...resto] = recientes(NOTICIAS.filter((n) => n.seccion === id));
  const deOtras = recientes(NOTICIAS.filter((n) => n.seccion !== id)).slice(0, 5);
  return (
    <>
      <div className="cc-ancho">
        <div className="cc-seccion-titulo" data-entra>
          <h1>{seccion.nombre}</h1>
          <p>{seccion.lema}</p>
        </div>
        <div className="cc-grilla cc-grilla-alta">
          <div>
            <Principal nota={primera} alAbrir={alAbrir} deSeccion />
            <div className="cc-rejilla cc-rejilla-seccion">
              {resto.map((n) => (
                <Tarjeta key={n.id} nota={n} alAbrir={alAbrir} />
              ))}
            </div>
          </div>
          <UltimaHora notas={deOtras} titulo="En otras secciones" abierto={abierto} alAbrir={alAbrir} />
        </div>
      </div>
    </>
  );
}

/* Mientras llega la sección: la misma forma de la página, en gris */
export function Esqueleto() {
  return (
    <div className="cc-ancho cc-esqueleto" role="status">
      <span className="sr-only">Cargando las noticias</span>
      <div className="cc-grilla cc-grilla-alta" aria-hidden>
        <div>
          <i className="cc-hueso" style={{ aspectRatio: "16 / 9" }} />
          <i className="cc-hueso" style={{ height: 12, width: "22%", marginTop: 18 }} />
          <i className="cc-hueso" style={{ height: 30, width: "94%", marginTop: 14 }} />
          <i className="cc-hueso" style={{ height: 30, width: "68%", marginTop: 10 }} />
          <i className="cc-hueso" style={{ height: 14, width: "88%", marginTop: 18 }} />
          <i className="cc-hueso" style={{ height: 14, width: "56%", marginTop: 8 }} />
        </div>
        <div className="cc-esqueleto-lista">
          {[0, 1, 2, 3, 4].map((n) => (
            <div key={n}>
              <i className="cc-hueso" style={{ height: 10, width: "34%" }} />
              <i className="cc-hueso" style={{ height: 17, width: "96%", marginTop: 10 }} />
              <i className="cc-hueso" style={{ height: 17, width: "62%", marginTop: 7 }} />
            </div>
          ))}
        </div>
      </div>
      <div className="cc-rejilla cc-esqueleto-rejilla" aria-hidden>
        {[0, 1, 2].map((n) => (
          <div key={n}>
            <i className="cc-hueso" style={{ aspectRatio: "3 / 2" }} />
            <i className="cc-hueso" style={{ height: 18, width: "92%", marginTop: 12 }} />
            <i className="cc-hueso" style={{ height: 18, width: "60%", marginTop: 8 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
