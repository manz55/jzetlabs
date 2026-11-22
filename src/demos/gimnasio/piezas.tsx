/*
 * Piezas que se repiten en la página, la inscripción y la app del socio: el logo, el carnet con su código y los logos de las tarjetas.
 */
import { useMemo } from "react";
import { AMARILLO, GOMA, GOMA2, ROJO, TIZA, VERDE, faltan, fechaCorta, porId, PLANES, SEDES, type Socio } from "./datos";

export const btn = "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 font-bold transition active:scale-[0.98]";

/* logo: casco corintio de frente con la cresta atravesada, como la de los oficiales espartanos */
export function Logo({ tam = 44 }: { tam?: number }) {
  const cerdas = Array.from({ length: 11 }, (_, k) => {
    const a = Math.PI * (1 - (k + 0.5) / 11);
    return { x1: 24 + 13 * Math.cos(a), y1: 19 - 11 * Math.sin(a), x2: 24 + 20.5 * Math.cos(a), y2: 19 - 16.5 * Math.sin(a) };
  });
  return (
    <svg viewBox="0 0 48 50" width={tam} height={tam * 1.04} aria-hidden className="shrink-0">
      {/* cresta de crin */}
      <path d="M2.5 19 C4 0.5 44 0.5 45.5 19 L37.5 19 C36 8.5 12 8.5 10.5 19 Z" fill={ROJO} />
      {cerdas.map((c, k) => (
        <line key={k} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke="#8f1426" strokeWidth="0.9" strokeLinecap="round" />
      ))}
      {/* casco */}
      <path d="M24 11.5 C31.5 11.5 36.6 16 37 23 L37.4 33 C37.4 38.5 34.2 42.6 29.6 45.4 L26.4 46.6 L21.6 46.6 L18.4 45.4 C13.8 42.6 10.6 38.5 10.6 33 L11 23 C11.4 16 16.5 11.5 24 11.5 Z" fill={TIZA} />
      <path d="M12.2 21.6 Q24 17.4 35.8 21.6" fill="none" stroke={GOMA} strokeOpacity=".35" strokeWidth="1" />
      {/* ojos, protector de nariz y la abertura de la boca */}
      <path d="M13.4 26.4 C16.8 24.4 20.4 24.6 22.6 26 L22.6 29.4 C19.6 28.4 16.4 28.8 13.6 30.4 Z" fill={GOMA} />
      <path d="M34.6 26.4 C31.2 24.4 27.6 24.6 25.4 26 L25.4 29.4 C28.4 28.4 31.6 28.8 34.4 30.4 Z" fill={GOMA} />
      <path d="M22.4 34.5 Q24 33.2 25.6 34.5 L26.6 46.8 L21.4 46.8 Z" fill={GOMA} />
      <path d="M15 33 Q17.5 39.5 20.6 42.8 M33 33 Q30.5 39.5 27.4 42.8" fill="none" stroke={GOMA} strokeOpacity=".3" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

export function Marca() {
  return (
    <span className="flex items-center gap-2.5">
      <Logo />
      <span className="leading-none">
        <span className="gym-titulo block text-[1.55rem]">Spartan Force</span>
        <span className="block text-[0.72rem] font-bold tracking-[0.3em] opacity-60">GYM</span>
      </span>
    </span>
  );
}

/* los logos de las tarjetas: los colores y la letra de cada marca, para reconocerlas de un vistazo */
export function Visa() {
  return <span className="inline-flex items-center rounded border px-2 py-0.5" style={{ background: "#fff", borderColor: "#d8dce6" }}><span style={{ fontFamily: '"Barlow", "Arial Black", sans-serif', fontStyle: "italic", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.03em", color: "#1434CB" }}>VISA</span></span>;
}
export function Mastercard() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded border px-2 py-0.5" style={{ background: "#fff", borderColor: "#d8dce6" }}>
      <svg viewBox="0 0 38 24" width="34" height="22" aria-hidden><circle cx="13" cy="12" r="11" fill="#EB001B" /><circle cx="25" cy="12" r="11" fill="#F79E1B" /><path d="M19 3.1a11 11 0 0 1 0 17.8 11 11 0 0 1 0-17.8Z" fill="#FF5F00" /></svg>
      <span style={{ fontFamily: '"Barlow", Arial, sans-serif', fontWeight: 700, fontSize: "0.82rem", letterSpacing: "-0.02em", color: "#1f2937" }}>mastercard</span>
    </span>
  );
}


/* ---------------- carnet con código ---------------- */

export function Codigo({ n, size = 112 }: { n: number; size?: number }) {
  // un código que parece QR, sale siempre igual para el mismo número de socio
  const celdas = useMemo(() => {
    const out: [number, number][] = [];
    let x = n * 9301 + 49297;
    for (let i = 0; i < 21; i++)
      for (let j = 0; j < 21; j++) {
        const esquina = (i < 8 && j < 8) || (i < 8 && j > 12) || (i > 12 && j < 8);
        if (esquina) continue;
        x = (x * 9301 + 49297) % 233280;
        if (x / 233280 > 0.52) out.push([i, j]);
      }
    return out;
  }, [n]);
  const ojo = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill="#000" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="#000" />
    </g>
  );
  return (
    <svg viewBox="-1 -1 23 23" width={size} height={size} className="rounded bg-white" role="img" aria-label={`Código del socio ${n}`}>
      {celdas.map(([i, j]) => (
        <rect key={`${i}-${j}`} x={j} y={i} width="1" height="1" fill="#000" />
      ))}
      {ojo(0, 0)}
      {ojo(14, 0)}
      {ojo(0, 14)}
    </svg>
  );
}

export function Carnet({ socio }: { socio: Socio }) {
  const p = porId(PLANES, socio.plan);
  const f = faltan(socio.vence);
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${GOMA2}, ${GOMA})` }}>
      <span className="disco h-40 w-40 opacity-90" style={{ background: p.color, position: "absolute", right: "-2.5rem", top: "-2.5rem" }} aria-hidden />
      <span className="relative block"><Marca /></span>
      <div className="relative mt-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[0.85rem] text-white/60">Socio {socio.num}</p>
          <p className="truncate text-[1.35rem] font-bold leading-tight">{socio.nombre}</p>
          <p className="mt-1 text-[0.92rem] text-white/75">
            {p.nombre} · {porId(SEDES, socio.sede).nombre}
          </p>
          <p className="mt-2 inline-block rounded px-2 py-0.5 text-[0.85rem] font-bold" style={{ background: f < 0 ? ROJO : f <= 3 ? AMARILLO : VERDE, color: f >= 0 && f <= 3 ? GOMA : "#fff" }}>
            {f < 0 ? `Venció hace ${-f} ${-f === 1 ? "día" : "días"}` : f === 0 ? "Vence hoy" : `Vence el ${fechaCorta(socio.vence)}`}
          </p>
        </div>
        <Codigo n={socio.num} size={96} />
      </div>
    </div>
  );
}

