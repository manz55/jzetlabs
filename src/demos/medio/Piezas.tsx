/* Piezas que se repiten en el diario: logotipo, foto, firma y tarjetas de nota. */
import { Clock } from "lucide-react";
import { foto, hace, lectura, type Nota } from "./datos";

/* Logotipo: solo letras y un filete rojo. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`cc-logo ${className}`}>
      <span>Crónica</span>
      <span className="cc-logo-filete" aria-hidden />
      <span>Central</span>
    </span>
  );
}

/* Foto con proporción fija: el hueco queda reservado desde antes de que cargue. */
export function Foto({
  nota,
  ancho,
  alto,
  tamanos,
  className = "",
  primera = false,
  decorativa = true,
}: {
  nota: Nota;
  ancho: number;
  alto: number;
  tamanos: string;
  className?: string;
  primera?: boolean;
  decorativa?: boolean;
}) {
  if (!nota.foto) return null;
  const { id, alt } = nota.foto;
  const medida = (w: number) => `${foto(id, w, Math.round((w * alto) / ancho))} ${w}w`;
  return (
    <span className={`cc-foto ${className}`} style={{ aspectRatio: `${ancho} / ${alto}` }}>
      <img
        src={foto(id, ancho, alto)}
        srcSet={[medida(Math.round(ancho / 2)), medida(ancho), medida(Math.round(ancho * 1.6))].join(", ")}
        sizes={tamanos}
        width={ancho}
        height={alto}
        alt={decorativa ? "" : alt}
        loading={primera ? "eager" : "lazy"}
        fetchPriority={primera ? "high" : "auto"}
        decoding="async"
        onError={(e) => {
          e.currentTarget.style.visibility = "hidden";
        }}
      />
    </span>
  );
}

export function Meta({ nota, conAutor = true }: { nota: Nota; conAutor?: boolean }) {
  return (
    <p className="cc-meta">
      {conAutor && <span className="cc-meta-autor">{nota.autor}</span>}
      <span>{hace(nota.minutos)}</span>
      <span className="cc-meta-lectura">
        <Clock size={13} aria-hidden /> {lectura(nota)} min de lectura
      </span>
    </p>
  );
}

/*
 * Titular que abre la nota. Es un enlace de verdad (se puede copiar o abrir en otra pestaña)
 * y su área de toque cubre toda la tarjeta.
 */
export function Titular({
  nota,
  alAbrir,
  nivel: Nivel = "h3",
  className = "",
}: {
  nota: Nota;
  alAbrir: (id: string) => void;
  nivel?: "h2" | "h3";
  className?: string;
}) {
  return (
    <Nivel className={`cc-titular ${className}`}>
      <a
        href={`#nota/${nota.id}`}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          alAbrir(nota.id);
        }}
      >
        {nota.titulo}
      </a>
    </Nivel>
  );
}

/* Tarjeta: en celular va en fila (texto y miniatura) y desde tableta con la foto arriba. */
export function Tarjeta({ nota, alAbrir }: { nota: Nota; alAbrir: (id: string) => void }) {
  return (
    <article className="cc-tarjeta" data-entra>
      <Foto nota={nota} ancho={600} alto={400} tamanos="(min-width: 640px) 22rem, 7.5rem" />
      <div className="cc-tarjeta-texto">
        <p className="cc-antetitulo">{nota.antetitulo}</p>
        <Titular nota={nota} alAbrir={alAbrir} />
        <p className="cc-bajada">{nota.bajada}</p>
        <Meta nota={nota} conAutor={false} />
      </div>
    </article>
  );
}
