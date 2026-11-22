import { CIELO, CIELO2, CORAL, CURVA, MARINO, type Nino } from "./datos";

export function Curva({ n }: { n: Nino }) {
  const W = 320, H = 190, maxM = 12, maxKg = 13;
  const x = (m: number) => 28 + (m / maxM) * (W - 40);
  const y = (kg: number) => H - 24 - ((kg - 2) / (maxKg - 2)) * (H - 36);
  const banda = (i: number) => CURVA.map((c, m) => `${m ? "L" : "M"}${x(m)},${y(c[i])}`).join(" ");
  const arriba = CURVA.map((c, m) => `${x(m)},${y(c[2])}`).join(" ");
  const abajo = [...CURVA].reverse().map((c, k) => `${x(12 - k)},${y(c[0])}`).join(" ");
  const puntos = n.pesos.filter((p) => p.mes <= maxM);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Curva de peso de ${n.nombre}`}>
      <polygon points={`${arriba} ${abajo}`} fill={CIELO} />
      <path d={banda(1)} fill="none" stroke={CIELO2} strokeWidth="2" strokeDasharray="4 4" />
      {[0, 3, 6, 9, 12].map((m) => (
        <text key={m} x={x(m)} y={H - 6} fontSize="10" textAnchor="middle" fill={MARINO} opacity=".6">{m}m</text>
      ))}
      {[4, 7, 10, 13].map((k) => (
        <text key={k} x={4} y={y(k) + 3} fontSize="10" fill={MARINO} opacity=".6">{k}kg</text>
      ))}
      <path d={puntos.map((p, i) => `${i ? "L" : "M"}${x(p.mes)},${y(p.kg)}`).join(" ")} fill="none" stroke={CORAL} strokeWidth="2.5" strokeLinecap="round" />
      {puntos.map((p) => (
        <circle key={p.mes} cx={x(p.mes)} cy={y(p.kg)} r="4.5" fill="#fff" stroke={CORAL} strokeWidth="2.5" />
      ))}
    </svg>
  );
}
