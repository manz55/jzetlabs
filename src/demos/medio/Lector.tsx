/*
 * Lectura de una nota a pantalla completa: tamaño de letra, copiar enlace, compartir por
 * WhatsApp, barra de avance y notas relacionadas. El "atrás" del celular la cierra.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Clock, Link2, MessageCircle } from "lucide-react";
import Dialogo from "./Dialogo";
import { Foto, Logo, Titular } from "./Piezas";
import { NOTICIAS, TAMANOS, fechaNota, hora, iniciales, instante, lectura, nombreSeccion, recientes, type Nota } from "./datos";

type Props = {
  nota: Nota | undefined;
  abierto: number;
  paso: number;
  alCambiarPaso: (p: number) => void;
  alCerrar: () => void;
  alAbrir: (id: string) => void;
};

async function copiar(texto: string, dentro: HTMLElement) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    /* navegadores sin permiso de portapapeles: se copia desde un campo temporal */
    const campo = document.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("readonly", "");
    campo.style.position = "fixed";
    campo.style.opacity = "0";
    dentro.appendChild(campo);
    campo.select();
    const listo = document.execCommand("copy");
    campo.remove();
    return listo;
  }
}

export default function Lector({ nota, abierto, paso, alCambiarPaso, alCerrar, alAbrir }: Props) {
  const caja = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLSpanElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const [copiado, setCopiado] = useState<"" | "si" | "no">("");
  const id = nota?.id;

  /* cada nota empieza arriba */
  useLayoutEffect(() => {
    setCopiado("");
    if (!id) return;
    caja.current?.scrollTo({ top: 0, behavior: "instant" });
    if (barra.current) barra.current.style.transform = "scaleX(0)";
    /* un instante después, cuando la ventana ya está abierta */
    const t = window.setTimeout(() => titulo.current?.focus({ preventScroll: true }), 60);
    return () => window.clearTimeout(t);
  }, [id]);

  useEffect(() => {
    if (copiado !== "si") return;
    const t = window.setTimeout(() => setCopiado(""), 2600);
    return () => window.clearTimeout(t);
  }, [copiado]);

  const enlace = nota ? `${location.origin}${location.pathname}#nota/${nota.id}` : "";
  const whatsapp = nota ? `https://wa.me/?text=${encodeURIComponent(`${nota.titulo}\nCrónica Central (demo de Jzet Labs)\n${enlace}`)}` : "";
  const copiarEnlace = async () => setCopiado((await copiar(enlace, caja.current!)) ? "si" : "no");

  const relacionadas = nota
    ? [...recientes(NOTICIAS.filter((n) => n.seccion === nota.seccion && n.id !== nota.id)), ...recientes(NOTICIAS.filter((n) => n.seccion !== nota.seccion && n.id !== nota.id))].slice(0, 3)
    : [];
  const cuando = nota ? instante(abierto, nota.minutos) : null;

  const compartir = (
    <>
      <button type="button" className="cc-herramienta" onClick={copiarEnlace} aria-label="Copiar enlace">
        {copiado === "si" ? <Check size={17} aria-hidden /> : <Link2 size={17} aria-hidden />}
        <span>{copiado === "si" ? "Copiado" : "Copiar enlace"}</span>
      </button>
      <a className="cc-herramienta cc-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Compartir por WhatsApp">
        <MessageCircle size={17} aria-hidden />
        <span>WhatsApp</span>
      </a>
    </>
  );

  return (
    <Dialogo
      abierto={Boolean(nota)}
      alCerrar={alCerrar}
      titulo={nota?.titulo ?? "Nota"}
      className="cc-lector"
      cajaRef={caja}
      alBajar={(c) => {
        const total = c.scrollHeight - c.clientHeight;
        if (barra.current) barra.current.style.transform = `scaleX(${total > 0 ? Math.min(1, c.scrollTop / total) : 0})`;
      }}
    >
      {nota && cuando && (
        <>
          <div className="cc-lector-barra">
            <div className="cc-lector-herramientas">
              <button type="button" className="cc-herramienta cc-volver" onClick={alCerrar}>
                <ArrowLeft size={18} aria-hidden /> <span>Volver</span>
              </button>
              <Logo className="cc-lector-logo" />
              <div className="cc-lector-acciones">
                <div className="cc-letra" role="group" aria-label="Tamaño de letra">
                  <button type="button" onClick={() => alCambiarPaso(paso - 1)} disabled={paso === 0} aria-label="Letra más pequeña">
                    A-
                  </button>
                  <button type="button" onClick={() => alCambiarPaso(paso + 1)} disabled={paso === TAMANOS.length - 1} aria-label="Letra más grande">
                    A+
                  </button>
                </div>
                {compartir}
              </div>
            </div>
            <span ref={barra} className="cc-avance" aria-hidden />
          </div>

          <article className="cc-nota" key={nota.id}>
            <p className="cc-antetitulo">
              {nombreSeccion(nota.seccion)} · {nota.antetitulo}
            </p>
            <h1 ref={titulo} tabIndex={-1}>
              {nota.titulo}
            </h1>
            <p className="cc-nota-bajada">{nota.bajada}</p>
            <div className="cc-nota-firma">
              <span className="cc-iniciales" aria-hidden>
                {iniciales(nota.autor)}
              </span>
              <div>
                <p className="cc-firma">
                  {nota.autor} <span>· {nota.cargo}</span>
                </p>
                <p className="cc-meta">
                  <time dateTime={cuando.toISOString()}>
                    {fechaNota(cuando)}, {hora(cuando)}
                  </time>
                  <span className="cc-meta-lectura">
                    <Clock size={13} aria-hidden /> {lectura(nota)} min de lectura
                  </span>
                </p>
              </div>
            </div>

            {nota.foto && (
              <figure>
                <Foto nota={nota} ancho={1200} alto={750} tamanos="(min-width: 900px) 52rem, 100vw" primera decorativa={false} />
                <figcaption>
                  {nota.foto.pie} <span>Foto de archivo: Unsplash.</span>
                </figcaption>
              </figure>
            )}

            <div className="cc-cuerpo" style={{ fontSize: TAMANOS[paso] }}>
              {nota.cuerpo.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="cc-nota-compartir">
              <p>Comparta esta nota</p>
              <div>{compartir}</div>
              <p className="cc-aviso" role="status">
                {copiado === "si" ? "El enlace quedó copiado." : ""}
              </p>
              {copiado === "no" && (
                <label className="cc-enlace-manual">
                  No se pudo copiar solo. Mantenga presionado el enlace para copiarlo:
                  <input readOnly value={enlace} onFocus={(e) => e.currentTarget.select()} />
                </label>
              )}
            </div>
          </article>

          <section className="cc-relacionadas" aria-label="Notas relacionadas">
            <div>
              <div className="cc-rotulo">
                <h2>Notas relacionadas</h2>
              </div>
              <ul>
                {relacionadas.map((n) => (
                  <li key={n.id}>
                    <Foto nota={n} ancho={600} alto={400} tamanos="(min-width: 700px) 16rem, 7rem" />
                    <div>
                      <p className="cc-antetitulo">{n.antetitulo}</p>
                      <Titular nota={n} alAbrir={alAbrir} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </Dialogo>
  );
}
