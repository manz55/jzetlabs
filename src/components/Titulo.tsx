/*
 * Título grande con una palabra en la letra a mano de Joshua (verde), como el
 * "a mano" de la portada. Opcional: un contador pequeño arriba, por ejemplo (04).
 */
type Props = {
  id: string;
  antes: string;
  acento: string;
  despues?: string;
  cuenta?: number;
  etiqueta?: string;
  claro?: boolean;
  className?: string;
};

export function Titulo({ id, antes, acento, despues = "", cuenta, etiqueta, claro = false, className = "" }: Props) {
  return (
    <div className={className}>
      {etiqueta && <p className={`etiqueta ${claro ? "!text-claro" : ""}`}>{etiqueta}</p>}
      <h2
        id={id}
        className={`${etiqueta ? "mt-3" : ""} text-[2.4rem] sm:text-[3.4rem] lg:text-[4.1rem] leading-[1.04] tracking-[-0.03em] ${claro ? "!text-white" : ""}`}
      >
        {antes}{" "}
        <span className={`font-[family-name:var(--font-mano)] font-semibold text-[1.15em] leading-none tracking-normal whitespace-nowrap ${claro ? "text-claro" : "text-mano"}`}>
          {acento}
        </span>
        {despues}
        {cuenta !== undefined && (
          <sup className={`ml-2 text-[0.3em] font-medium tracking-normal align-top relative top-[0.6em] ${claro ? "text-white/70" : "text-suave"}`}>
            ({String(cuenta).padStart(2, "0")})
          </sup>
        )}
      </h2>
    </div>
  );
}
