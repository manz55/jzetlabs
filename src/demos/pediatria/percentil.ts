/*
 * Percentil de peso y estatura de 0 a 5 años.
 * Referencia: Patrones de crecimiento infantil de la OMS, valores de -2 DE, mediana y +2 DE
 * en edades clave; entre una edad y otra se interpola. Es una orientación, no un diagnóstico.
 */
export type Sexo = "nina" | "nino";
type Fila = [mes: number, bajo: number, medio: number, alto: number];

/* peso en kg */
const PESO: Record<Sexo, Fila[]> = {
  nino: [[0, 2.5, 3.3, 4.4], [1, 3.4, 4.5, 5.8], [2, 4.3, 5.6, 7.1], [3, 5.0, 6.4, 8.0], [4, 5.6, 7.0, 8.7], [6, 6.4, 7.9, 9.8], [9, 7.1, 8.9, 11.0], [12, 7.7, 9.6, 12.0], [18, 8.8, 10.9, 13.7], [24, 9.7, 12.2, 15.3], [36, 11.3, 14.3, 18.3], [48, 12.7, 16.3, 21.2], [60, 14.1, 18.3, 24.2]],
  nina: [[0, 2.4, 3.2, 4.2], [1, 3.2, 4.2, 5.5], [2, 3.9, 5.1, 6.6], [3, 4.5, 5.8, 7.5], [4, 5.0, 6.4, 8.2], [6, 5.7, 7.3, 9.3], [9, 6.5, 8.2, 10.5], [12, 7.0, 8.9, 11.5], [18, 8.1, 10.2, 13.2], [24, 9.0, 11.5, 14.8], [36, 10.8, 13.9, 18.1], [48, 12.3, 16.1, 21.5], [60, 13.7, 18.2, 24.9]],
};
/* estatura en cm (acostado antes de los 2 años, de pie después) */
const TALLA: Record<Sexo, Fila[]> = {
  nino: [[0, 46.1, 49.9, 53.7], [1, 50.8, 54.7, 58.6], [2, 54.4, 58.4, 62.4], [3, 57.3, 61.4, 65.5], [4, 59.7, 63.9, 68.0], [6, 63.3, 67.6, 71.9], [9, 67.5, 72.0, 76.5], [12, 71.0, 75.7, 80.5], [18, 76.9, 82.3, 87.7], [24, 81.0, 87.1, 93.2], [36, 88.7, 96.1, 103.5], [48, 94.9, 103.3, 111.7], [60, 100.7, 110.0, 119.2]],
  nina: [[0, 45.4, 49.1, 52.9], [1, 49.8, 53.7, 57.6], [2, 53.0, 57.1, 61.1], [3, 55.6, 59.8, 64.0], [4, 57.8, 62.1, 66.4], [6, 61.2, 65.7, 70.3], [9, 65.3, 70.1, 75.0], [12, 68.9, 74.0, 79.2], [18, 74.9, 80.7, 86.5], [24, 79.3, 85.7, 92.2], [36, 87.4, 95.1, 102.7], [48, 94.1, 102.7, 111.3], [60, 99.9, 109.4, 118.9]],
};

export const KG_POR_LB = 0.45359237;

function referencia(tabla: Fila[], mes: number) {
  const j = Math.max(1, tabla.findIndex((f) => f[0] >= mes));
  const [m0, b0, c0, a0] = tabla[j - 1];
  const [m1, b1, c1, a1] = tabla[j];
  const t = (mes - m0) / (m1 - m0);
  const entre = (x: number, y: number) => x + (y - x) * t;
  return { bajo: entre(b0, b1), medio: entre(c0, c1), alto: entre(a0, a1) };
}

/* probabilidad acumulada de la normal (aproximación de Abramowitz y Stegun) */
function acumulada(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const cola = 0.3989423 * Math.exp((-z * z) / 2) * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - cola : cola;
}

export type Medida = { percentil: number; zona: "bajo" | "esperado" | "alto"; desde: number; hasta: number };

function medir(tabla: Fila[], mes: number, valor: number): Medida {
  const r = referencia(tabla, mes);
  const z = (valor - r.medio) / (((valor < r.medio ? r.medio - r.bajo : r.alto - r.medio)) / 2);
  return { percentil: acumulada(z) * 100, zona: z < -2 ? "bajo" : z > 2 ? "alto" : "esperado", desde: r.bajo, hasta: r.alto };
}

export const medirPeso = (sexo: Sexo, mes: number, kg: number) => medir(PESO[sexo], mes, kg);
export const medirTalla = (sexo: Sexo, mes: number, cm: number) => medir(TALLA[sexo], mes, cm);

export const textoPercentil = (p: number) => (p < 1 ? "menor a 1" : p > 99 ? "mayor a 99" : String(Math.round(p)));
