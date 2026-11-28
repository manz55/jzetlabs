import { fechaCompleta } from "./agenda";
import type { Graduacion, Ojo, Paciente } from "./datos";

export const dioptria = (n: number) => (n > 0 ? `+${n.toFixed(2)}` : n.toFixed(2));

export const columnasOjo = (o: Ojo) => [
  { nombre: "Esfera", valor: dioptria(o.esfera) },
  { nombre: "Cilindro", valor: dioptria(o.cilindro) },
  { nombre: "Eje", valor: o.eje === null ? "—" : `${o.eje}°` },
  { nombre: "Adición", valor: o.adicion === null ? "—" : dioptria(o.adicion) },
  { nombre: "DP", valor: o.dp.toFixed(1) },
];

const lineaOjo = (nombre: string, o: Ojo) => `${nombre}: ${columnasOjo(o).map((c) => `${c.nombre} ${c.valor}`).join(" | ")}`;

export const textoReceta = (p: Paciente, g: Graduacion) =>
  [
    "CLARAVISTA · Receta visual",
    `Paciente: ${p.nombre}${p.edad ? ` (${p.edad} años)` : ""}`,
    lineaOjo("OD", g.od),
    lineaOjo("OI", g.oi),
    `Cristal recomendado: ${g.cristal}`,
    `Emitida: ${fechaCompleta(g.emitida)} · Vigente hasta: ${fechaCompleta(g.vence)}`,
    g.profesional,
  ].join("\n");

export const enlaceWhatsApp = (mensaje: string) => `https://wa.me/?text=${encodeURIComponent(mensaje)}`;

const CAMPOS = [
  { id: "esfera", nombre: "Esfera", min: -20, max: 20, paso: 0.25 },
  { id: "cilindro", nombre: "Cilindro", min: -8, max: 8, paso: 0.25 },
  { id: "eje", nombre: "Eje", min: 0, max: 180, paso: 1 },
  { id: "adicion", nombre: "Adición", min: 0, max: 4, paso: 0.25 },
  { id: "dp", nombre: "DP", min: 20, max: 40, paso: 0.5 },
] as const;

export type CampoOjo = (typeof CAMPOS)[number]["id"];
export type OjoEscrito = Record<CampoOjo, string>;
export const CAMPOS_OJO = CAMPOS;

export const escribirOjo = (o: Ojo | undefined): OjoEscrito => ({
  esfera: o ? dioptria(o.esfera) : "",
  cilindro: o ? dioptria(o.cilindro) : "",
  eje: o?.eje?.toString() ?? "",
  adicion: o?.adicion != null ? dioptria(o.adicion) : "",
  dp: o ? o.dp.toFixed(1) : "",
});

export function leerOjo(escrito: OjoEscrito, lado: "OD" | "OI"): Ojo | string {
  const valores = {} as Record<CampoOjo, number | null>;
  for (const campo of CAMPOS) {
    const texto = escrito[campo.id].trim().replace(",", ".").replace("−", "-");
    if (!texto) {
      valores[campo.id] = null;
      continue;
    }
    const n = Number(texto);
    if (!Number.isFinite(n) || n < campo.min || n > campo.max || !Number.isInteger(n / campo.paso)) {
      return `${lado}: ${campo.nombre} va de ${campo.min} a ${campo.max}, en pasos de ${campo.paso}.`;
    }
    valores[campo.id] = n;
  }
  const { esfera, cilindro, eje, adicion, dp } = valores;
  if (esfera === null) return `${lado}: falta la esfera.`;
  if (cilindro && eje === null) return `${lado}: con cilindro hay que anotar el eje.`;
  if (dp === null) return `${lado}: falta la distancia pupilar (DP).`;
  return { esfera, cilindro: cilindro ?? 0, eje: cilindro ? eje : null, adicion: adicion || null, dp };
}
