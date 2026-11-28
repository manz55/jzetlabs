import { useState } from "react";
import { horasLibres, mismoHorario } from "./agenda";
import { hoyIso, type Area, type Horario } from "./datos";
import type { ClinicaViva } from "./estado";

type Opciones = { inicial?: Horario; exceptoId?: string; omitir?: Horario };

export function useHorario(clinica: ClinicaViva, area: Area, { inicial, exceptoId, omitir }: Opciones = {}) {
  const [fecha, setFecha] = useState(inicial?.fecha ?? hoyIso());
  const [elegida, setHora] = useState(inicial?.hora ?? "");
  const libres = horasLibres(clinica, area, fecha, exceptoId).filter((h) => !omitir || !mismoHorario(omitir, { fecha, hora: h }));
  const hora = libres.includes(elegida) ? elegida : (libres[0] ?? "");
  return { fecha, hora, libres, setFecha, setHora };
}
