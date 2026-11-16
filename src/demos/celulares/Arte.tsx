/*
 * Dibujos simples de los productos (sin logos ni marcas): así se ven en el
 * color que el cliente elige y nunca muestran la marca de nadie.
 */
import type { Arte as TipoArte } from "./datos";

function oscurecer(hex: string, f = 0.78) {
  const n = parseInt(hex.slice(1), 16);
  const c = (x: number) => Math.round(Math.max(0, Math.min(255, x * f)));
  return `rgb(${c(n >> 16)}, ${c((n >> 8) & 255)}, ${c(n & 255)})`;
}

export function Arte({ tipo, color, marca, className = "" }: { tipo: TipoArte; color: string; marca?: string; className?: string }) {
  const borde = oscurecer(color);
  const vidrio = "#1b1e24";
  if (tipo === "telefono") {
    // cámaras distintas según la marca, para que no se vean todos iguales
    const lentes =
      marca === "Apple" ? (
        <>
          <rect x="62" y="40" width="58" height="58" rx="16" fill={oscurecer(color, 0.9)} stroke={borde} />
          <circle cx="78" cy="56" r="10" fill={vidrio} />
          <circle cx="104" cy="82" r="10" fill={vidrio} />
          <circle cx="104" cy="56" r="3" fill="#d9d9d9" />
        </>
      ) : marca === "Samsung" ? (
        <>
          <circle cx="76" cy="54" r="10" fill={vidrio} stroke={borde} strokeWidth="2" />
          <circle cx="76" cy="80" r="10" fill={vidrio} stroke={borde} strokeWidth="2" />
          <circle cx="76" cy="106" r="10" fill={vidrio} stroke={borde} strokeWidth="2" />
        </>
      ) : (
        <>
          <rect x="62" y="40" width="40" height="70" rx="14" fill={oscurecer(color, 0.9)} stroke={borde} />
          <circle cx="82" cy="58" r="11" fill={vidrio} />
          <circle cx="82" cy="88" r="8" fill={vidrio} />
        </>
      );
    return (
      <svg viewBox="0 0 240 300" className={className} aria-hidden>
        <ellipse cx="120" cy="288" rx="70" ry="7" fill="rgba(0,0,0,.08)" />
        <rect x="50" y="24" width="140" height="256" rx="30" fill={color} stroke={borde} strokeWidth="3" />
        <rect x="56" y="30" width="128" height="244" rx="25" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2" />
        {lentes}
      </svg>
    );
  }
  if (tipo === "funda")
    return (
      <svg viewBox="0 0 240 300" className={className} aria-hidden>
        <ellipse cx="120" cy="288" rx="70" ry="7" fill="rgba(0,0,0,.08)" />
        <rect x="50" y="24" width="140" height="256" rx="32" fill={color} stroke={borde} strokeWidth="3" />
        <rect x="64" y="40" width="58" height="62" rx="16" fill="none" stroke={borde} strokeWidth="5" />
        <rect x="190" y="90" width="5" height="34" rx="2.5" fill={borde} />
      </svg>
    );
  if (tipo === "cargador")
    return (
      <svg viewBox="0 0 240 300" className={className} aria-hidden>
        <ellipse cx="120" cy="268" rx="62" ry="7" fill="rgba(0,0,0,.08)" />
        <rect x="70" y="110" width="100" height="120" rx="20" fill={color} stroke="#cfd2d6" strokeWidth="3" />
        <rect x="96" y="70" width="10" height="42" rx="3" fill="#b8bcc2" />
        <rect x="134" y="70" width="10" height="42" rx="3" fill="#b8bcc2" />
        <rect x="104" y="196" width="32" height="10" rx="5" fill="#9aa0a8" />
        <path d="M120 230 C120 260 180 250 190 220" fill="none" stroke="#d6d9dd" strokeWidth="7" strokeLinecap="round" />
      </svg>
    );
  if (tipo === "audifonos")
    return (
      <svg viewBox="0 0 240 300" className={className} aria-hidden>
        <ellipse cx="120" cy="262" rx="72" ry="7" fill="rgba(0,0,0,.08)" />
        <rect x="58" y="150" width="124" height="96" rx="40" fill={color} stroke={oscurecer(color, 0.85)} strokeWidth="3" />
        <line x1="62" y1="182" x2="178" y2="182" stroke={oscurecer(color, 0.8)} strokeWidth="2" />
        <circle cx="120" cy="214" r="4" fill="#7fd18b" />
        <g fill={color} stroke={oscurecer(color, 0.8)} strokeWidth="3">
          <rect x="72" y="58" width="34" height="58" rx="17" />
          <rect x="82" y="104" width="14" height="44" rx="7" />
          <rect x="134" y="58" width="34" height="58" rx="17" />
          <rect x="144" y="104" width="14" height="44" rx="7" />
        </g>
      </svg>
    );
  if (tipo === "bateria")
    return (
      <svg viewBox="0 0 240 300" className={className} aria-hidden>
        <ellipse cx="120" cy="276" rx="66" ry="7" fill="rgba(0,0,0,.08)" />
        <rect x="64" y="40" width="112" height="226" rx="26" fill={color} stroke={oscurecer(color)} strokeWidth="3" />
        <rect x="92" y="196" width="56" height="26" rx="6" fill="#1b1e24" />
        <text x="120" y="215" textAnchor="middle" fontSize="15" fill="#7fd18b" fontFamily="monospace">87%</text>
        <rect x="104" y="248" width="32" height="8" rx="4" fill={oscurecer(color, 0.6)} />
      </svg>
    );
  // reloj
  return (
    <svg viewBox="0 0 240 300" className={className} aria-hidden>
      <ellipse cx="120" cy="282" rx="56" ry="7" fill="rgba(0,0,0,.08)" />
      <rect x="92" y="14" width="56" height="90" rx="14" fill={color} />
      <rect x="92" y="196" width="56" height="80" rx="14" fill={color} />
      <rect x="70" y="86" width="100" height="124" rx="30" fill="#1b1e24" stroke={oscurecer(color, 0.9)} strokeWidth="5" />
      <text x="120" y="146" textAnchor="middle" fontSize="28" fill="#fff" fontFamily="sans-serif" fontWeight="600">10:09</text>
      <text x="120" y="172" textAnchor="middle" fontSize="13" fill="#7fd18b" fontFamily="sans-serif">8,412 pasos</text>
    </svg>
  );
}
