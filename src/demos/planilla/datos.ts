/*
 * Demo: "Constructora Los Cedros" (empresa inventada, datos de ejemplo).
 * Problema -> respuesta:
 * - Un compañero marca por otro -> marcaje con PIN, foto y ubicación de la obra.
 * - La planilla se arma a mano en Excel y se lleva días -> se calcula sola con lo marcado.
 * - Nadie entiende de dónde sale el pago -> cada quetzal con su explicación (días, séptimo, extras, bonificación, IGSS, vales).
 * - Los vales y adelantos se olvidan -> el trabajador lo pide desde el teléfono y se descuenta solo.
 * - No se sabe cuánto cuesta la mano de obra de cada obra -> costo por obra.
 * - Boletas en papel que se pierden -> boleta en el teléfono de cada trabajador.
 */
import { useEffect, useState } from "react";

export const PLANO = "#173a5e";
export const PLANO2 = "#0f2a45";
export const PAPEL = "#e9eff5";
export const CASCO = "#f2b400";
export const ROJO = "#c8372d";
export const VERDE = "#2f7d4f";
export const TINTA = "#14202c";
export const TITULO = "'Barlow Condensed', system-ui, sans-serif";

export const qz = (n: number) => `Q${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export type Obra = { id: string; nombre: string; lugar: string };
export const OBRAS: Obra[] = [
  { id: "torre", nombre: "Torre Vista", lugar: "Zona 16, Cayalá" },
  { id: "bodega", nombre: "Bodega San Cristóbal", lugar: "Mixco" },
  { id: "casa", nombre: "Casa familia Ruiz", lugar: "Villa Nueva" },
];

export type Trabajador = { id: string; nombre: string; puesto: string; obra: string; diario: number; color: string };
export const TRABAJADORES: Trabajador[] = [
  { id: "me", nombre: "Marvin Estrada", puesto: "Maestro de obra", obra: "torre", diario: 260, color: "#173a5e" },
  { id: "ko", nombre: "Kevin Orellana", puesto: "Albañil", obra: "torre", diario: 160, color: "#8a5a14" },
  { id: "dm", nombre: "Diego Marroquín", puesto: "Albañil", obra: "torre", diario: 160, color: "#2f7d4f" },
  { id: "bt", nombre: "Brayan Tzoc", puesto: "Ayudante", obra: "torre", diario: 115, color: "#7a3b5c" },
  { id: "jb", nombre: "Josué Barrios", puesto: "Electricista", obra: "torre", diario: 190, color: "#b5481f" },
  { id: "ra", nombre: "Rony Ajú", puesto: "Albañil", obra: "bodega", diario: 160, color: "#3d5a80" },
  { id: "wc", nombre: "Wilmer Chávez", puesto: "Plomero", obra: "bodega", diario: 180, color: "#5b6b2f" },
  { id: "ec", nombre: "Edgar Coc", puesto: "Ayudante", obra: "bodega", diario: 115, color: "#8c4a2f" },
  { id: "el", nombre: "Esteban López", puesto: "Bodeguero", obra: "bodega", diario: 125, color: "#4a4e69" },
  { id: "fs", nombre: "Fredy Sic", puesto: "Albañil", obra: "casa", diario: 160, color: "#2a6f6f" },
  { id: "mp", nombre: "Mario Pérez", puesto: "Ayudante", obra: "casa", diario: 115, color: "#6d4c41" },
  { id: "ot", nombre: "Óscar Tun", puesto: "Piloto", obra: "casa", diario: 145, color: "#37474f" },
];

export const PIN_EJEMPLO = "1234";
export const BONIF_MES = 250; // bonificación incentivo (Decreto 37-2001)
export const BONIF_SEMANA = (BONIF_MES * 12) / 52;
export const IGSS = 0.0483; // cuota laboral

/* Marca de un día: horas en minutos desde las 00:00 */
export type Marca = { entrada: number; salida: number | null; lejos?: boolean };
export type Dia = { fecha: string; marca: Marca | null };

const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const diaCorto = (f: string) => DIAS_CORTOS[new Date(f + "T12:00").getDay()];
export const hora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/* Lunes a sábado de la semana actual (si hoy es domingo, la semana que acaba de pasar) */
export function semana(): string[] {
  const hoy = new Date();
  const lunes = new Date(hoy);
  const d = hoy.getDay();
  lunes.setDate(hoy.getDate() - (d === 0 ? 6 : d - 1));
  return Array.from({ length: 6 }, (_, i) => {
    const x = new Date(lunes);
    x.setDate(lunes.getDate() + i);
    return iso(x);
  });
}
export const hoyIso = () => iso(new Date());
export const ahoraMin = () => {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
};

/* Jornada: lunes a viernes 7:00 a 16:00 (8 h con almuerzo), sábado 7:00 a 11:00 */
export const jornada = (f: string) => (new Date(f + "T12:00").getDay() === 6 ? { entra: 420, sale: 660, horas: 4 } : { entra: 420, sale: 960, horas: 8 });

/* Historial inventado pero estable: cada trabajador tiene sus mañas */
function marcasDeEjemplo(t: Trabajador, f: string, esHoy: boolean): Marca | null {
  const n = (t.id.charCodeAt(0) * 31 + t.id.charCodeAt(1) * 7 + new Date(f + "T12:00").getDate() * 13) % 100;
  const j = jornada(f);
  const dow = new Date(f + "T12:00").getDay();
  if (t.id === "wc" && dow === 1) return null; // Wilmer faltó el lunes
  if (t.id === "mp" && dow === 3) return null; // Mario no llegó el miércoles
  let entrada = j.entra - 12 + (n % 14);
  if (t.id === "bt" && (dow === 2 || dow === 4)) entrada = j.entra + 38 + (n % 10); // Brayan llega tarde
  let salida = j.sale + (n % 9);
  if (["me", "jb", "ko"].includes(t.id) && dow !== 6) salida = j.sale + 90 + (n % 40); // horas extra en la torre
  if (t.id === "wc" && dow === 3) salida = j.sale + 120;
  const lejos = t.id === "ot" && dow === 2; // Óscar marcó lejos de la obra
  if (esHoy) {
    const ahora = ahoraMin();
    if (ahora < entrada) return null;
    return { entrada, salida: ahora >= salida ? salida : null, lejos };
  }
  return { entrada, salida, lejos };
}

export type Vale = { id: string; trabajador: string; monto: number; motivo: string; fecha: string };
type Guardado = { marcas: Record<string, Record<string, Marca>>; vales: Vale[]; cerrada: boolean };
const CLAVE = "planilla:v1";
const VACIO: Guardado = {
  marcas: {},
  vales: [{ id: "v1", trabajador: "ko", monto: 200, motivo: "Medicina para su hija", fecha: semana()[1] }],
  cerrada: false,
};

export function usePlanilla() {
  const [g, setG] = useState<Guardado>(() => {
    try {
      const x = JSON.parse(localStorage.getItem(CLAVE) || "null");
      return x ?? VACIO;
    } catch {
      return VACIO;
    }
  });
  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(g));
  }, [g]);

  const dias = semana();
  const hoy = hoyIso();

  const diasDe = (t: Trabajador): Dia[] =>
    dias.map((f) => {
      if (f > hoy) return { fecha: f, marca: null };
      const propia = g.marcas[t.id]?.[f];
      if (f === hoy) return { fecha: f, marca: propia ?? marcasDeEjemplo(t, f, true) };
      return { fecha: f, marca: propia ?? marcasDeEjemplo(t, f, false) };
    });

  const marcar = (t: Trabajador): { tipo: "entrada" | "salida"; min: number } => {
    const ahora = ahoraMin();
    const actual = diasDe(t).find((d) => d.fecha === hoy)?.marca ?? null;
    const nueva: Marca = actual && actual.salida === null ? { ...actual, salida: ahora } : { entrada: ahora, salida: null };
    setG((x) => ({ ...x, marcas: { ...x.marcas, [t.id]: { ...(x.marcas[t.id] ?? {}), [hoy]: nueva } } }));
    return { tipo: actual && actual.salida === null ? "salida" : "entrada", min: ahora };
  };

  const pedirVale = (t: Trabajador, monto: number, motivo: string) =>
    setG((x) => ({ ...x, vales: [...x.vales, { id: String(Date.now()), trabajador: t.id, monto, motivo, fecha: hoy }] }));

  const cerrar = () => setG((x) => ({ ...x, cerrada: true }));
  const reiniciar = () => setG(VACIO);

  return { dias, hoy, diasDe, marcar, vales: g.vales, pedirVale, cerrada: g.cerrada, cerrar, reiniciar };
}
export type Planilla = ReturnType<typeof usePlanilla>;

/* El cálculo, con cada parte separada para poder explicarla */
export function calcular(t: Trabajador, dias: Dia[], vales: Vale[]) {
  const trabajados = dias.filter((d) => d.marca);
  const completos = trabajados.filter((d) => d.marca?.salida !== null);
  let minExtra = 0;
  let tardes = 0;
  for (const d of trabajados) {
    const j = jornada(d.fecha);
    if (d.marca!.entrada > j.entra + 10) tardes++;
    if (d.marca!.salida !== null) minExtra += Math.max(0, d.marca!.salida - j.sale);
  }
  const horasExtra = Math.floor(minExtra / 30) / 2; // por media hora completa
  const ordinario = trabajados.length * t.diario;
  const semanaCompleta = dias.every((d) => d.marca);
  const septimo = semanaCompleta ? t.diario : 0;
  const extras = horasExtra * (t.diario / 8) * 1.5;
  const bonificacion = (BONIF_SEMANA * trabajados.length) / 6;
  const igss = (ordinario + septimo + extras) * IGSS;
  const misVales = vales.filter((v) => v.trabajador === t.id);
  const descVales = misVales.reduce((s, v) => s + v.monto, 0);
  const total = ordinario + septimo + extras + bonificacion - igss - descVales;
  const lejos = trabajados.filter((d) => d.marca?.lejos).length;
  const faltas = dias.filter((d) => !d.marca && d.fecha < hoyIso()).length;
  const pendientes = dias.filter((d) => d.fecha > hoyIso()).length;
  const septimoEstado: "si" | "no" | "pendiente" = semanaCompleta ? "si" : faltas > 0 ? "no" : "pendiente";
  return { pendientes, septimoEstado, diasTrab: trabajados.length, completos: completos.length, horasExtra, ordinario, septimo, semanaCompleta, extras, bonificacion, igss, misVales, descVales, total, tardes, faltas, lejos };
}

export const obraDe = (id: string) => OBRAS.find((o) => o.id === id)!;
export const iniciales = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("");
