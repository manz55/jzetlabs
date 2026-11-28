import { SEDE, colegiadoDe, diasHasta, fechaCorta, type Mascota } from "./datos";
import { ultimasAplicaciones } from "./expediente";

export function vigencia(proxima: string) {
  const dias = diasHasta(proxima);
  if (dias < 0) return { texto: "Vencido", clase: "hv-chip-vencida", borde: "border-l-[#DC2626]" };
  if (dias <= 14) return { texto: "Refuerzo próximo", clase: "hv-chip-pronto", borde: "border-l-[#EA580C]" };
  return { texto: "Vigente", clase: "hv-chip-bien", borde: "border-l-[#0D9488]" };
}

export const pesoActual = (mascota: Mascota) => {
  const ultimo = mascota.pesos.at(-1);
  return ultimo ? `${ultimo.kg} kg` : "Sin registro";
};

export function resumenCarnet(mascota: Mascota) {
  return [
    `*Carnet de ${mascota.nombre} · Huella Vital*`,
    `Expediente ${mascota.expediente}`,
    `${mascota.especie === "perro" ? "Perro" : "Gato"} · ${mascota.raza} · ${mascota.edad}`,
    `Peso actual: ${pesoActual(mascota)}`,
    `Propietario: ${mascota.dueno}`,
    "",
    ...ultimasAplicaciones(mascota).map(
      (v) => `• ${v.nombre} (${vigencia(v.proxima).texto}): aplicada ${fechaCorta(v.aplicada)}, refuerzo ${fechaCorta(v.proxima)}. ${v.medico}, colegiado ${colegiadoDe(v.medico)}.`,
    ),
    "",
    `${SEDE.direccion} · Tel. ${SEDE.telefono}`,
  ].join("\n");
}
