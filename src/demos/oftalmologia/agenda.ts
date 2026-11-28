import type { Cita, Horario } from "./datos";

const HORAS_SEMANA = ["08:00", "08:45", "09:30", "10:15", "11:00", "11:45", "14:00", "14:45", "15:30", "16:15", "17:00"];
const HORAS_SABADO = ["08:00", "08:45", "09:30", "10:15", "11:00", "11:45", "12:15"];

const dos = (n: number) => String(n).padStart(2, "0");
const aIso = (d: Date) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
const deIso = (iso: string) => new Date(`${iso}T12:00:00`);

export const hoyIso = () => aIso(new Date());

export function sumarDias(iso: string, dias: number) {
  const d = deIso(iso);
  d.setDate(d.getDate() + dias);
  return aIso(d);
}

export function diaHabil(iso: string, dias: number) {
  const fecha = sumarDias(iso, dias);
  return deIso(fecha).getDay() === 0 ? sumarDias(fecha, 1) : fecha;
}

export function unAnioDespues(iso: string) {
  const d = deIso(iso);
  d.setFullYear(d.getFullYear() + 1);
  return aIso(d);
}

const formato = (iso: string, opciones: Intl.DateTimeFormatOptions) => deIso(iso).toLocaleDateString("es-GT", opciones).replace(/[,.]/g, "");

export function diaCorto(iso: string) {
  if (iso === hoyIso()) return "Hoy";
  if (iso === sumarDias(hoyIso(), 1)) return "Mañana";
  return formato(iso, { weekday: "short", day: "numeric", month: "short" });
}

export const fechaLarga = (iso: string) => formato(iso, { weekday: "long", day: "numeric", month: "long" });
export const fechaCompleta = (iso: string) => deIso(iso).toLocaleDateString("es-GT", { day: "numeric", month: "long", year: "numeric" });

export const cuando = (h: Horario) => `${diaCorto(h.fecha)} a las ${h.hora}`;

export function horasLibres(citas: Cita[], fecha: string) {
  const dia = deIso(fecha).getDay();
  if (dia === 0) return [];
  const ahora = new Date();
  const reloj = `${dos(ahora.getHours())}:${dos(ahora.getMinutes())}`;
  return (dia === 6 ? HORAS_SABADO : HORAS_SEMANA).filter(
    (hora) => (fecha !== hoyIso() || hora > reloj) && !citas.some((c) => c.fecha === fecha && c.hora === hora),
  );
}

export function fechasLibres(citas: Cita[], cuantas = 6) {
  const fechas: string[] = [];
  for (let i = 0; fechas.length < cuantas && i < 40; i++) {
    const fecha = sumarDias(hoyIso(), i);
    if (horasLibres(citas, fecha).length) fechas.push(fecha);
  }
  return fechas;
}

export const porHorario = (a: Horario, b: Horario) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`);
