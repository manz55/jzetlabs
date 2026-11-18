/*
 * Demo: "Constructora Los Cedros" (empresa inventada, datos de ejemplo).
 *
 * Problema -> respuesta (lo que más falla al llevar planilla en Excel en Guatemala):
 * - No hay control real de los días en cada obra -> marcaje con PIN, foto y ubicación.
 * - Horas extra mal calculadas, reclamos después -> se calculan solas por media hora, a hora y media.
 * - Bonificación de Q250 mal aplicada -> va en su propia columna y no paga IGSS.
 * - IGSS: 4.83% del trabajador y 12.67% del patrono -> calculado por mes, con fecha límite.
 * - Aguinaldo, Bono 14, vacaciones e indemnización sin provisionar -> lo acumulado de cada uno, al día.
 * - Nadie sabe de dónde sale el pago -> cada quetzal con su explicación.
 * - Vales, permisos y vacaciones por mensajes -> solicitudes con aprobar o rechazar.
 * - Cada trabajador debe ver solo lo suyo -> portal con código y PIN.
 *
 * Los montos legales son de referencia para la demo; en un cliente real se revisan con su contador.
 */
import { useEffect, useState } from "react";

export const AZUL = "#173a5e";
export const AMARILLO = "#f2b400";
export const FONDO = "#f4f5f7";
export const BORDE = "#e1e5ea";
export const TEXTO = "#1b2430";
export const SUAVE = "#5b6675";
export const ROJO = "#b83a2e";
export const VERDE = "#2e7d4f";
export const NARANJA = "#a86200";

export const qz = (n: number) => `Q${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export type Obra = { id: string; nombre: string; lugar: string };
export const OBRAS: Obra[] = [
  { id: "torre", nombre: "Torre Vista", lugar: "Zona 16, Cayalá" },
  { id: "bodega", nombre: "Bodega San Cristóbal", lugar: "Mixco" },
  { id: "casa", nombre: "Casa familia Ruiz", lugar: "Villa Nueva" },
];
export const obraDe = (id: string) => OBRAS.find((o) => o.id === id)!;
/* Posición de cada obra en el mapa de la demo (0 a 100) y la oficina */
export const EN_MAPA: Record<string, { x: number; y: number }> = { torre: { x: 74, y: 30 }, bodega: { x: 22, y: 38 }, casa: { x: 44, y: 80 }, oficina: { x: 56, y: 48 } };

export type Trabajador = {
  id: string;
  codigo: string;
  nombre: string;
  puesto: string;
  obra: string;
  diario: number;
  ingreso: string; // fecha de ingreso
  vacTomadas: number; // días de vacaciones ya gozados en su periodo
  dpi: string;
};
export const TRABAJADORES: Trabajador[] = [
  { id: "me", codigo: "101", nombre: "Marvin Estrada", puesto: "Maestro de obra", obra: "torre", diario: 260, ingreso: "2019-03-04", vacTomadas: 5, dpi: "2541 •••• 0101" },
  { id: "ko", codigo: "102", nombre: "Kevin Orellana", puesto: "Albañil", obra: "torre", diario: 160, ingreso: "2022-07-11", vacTomadas: 0, dpi: "2987 •••• 0108" },
  { id: "dm", codigo: "103", nombre: "Diego Marroquín", puesto: "Albañil", obra: "torre", diario: 160, ingreso: "2023-01-16", vacTomadas: 8, dpi: "3012 •••• 0101" },
  { id: "bt", codigo: "104", nombre: "Brayan Tzoc", puesto: "Ayudante", obra: "torre", diario: 115, ingreso: "2026-02-02", vacTomadas: 0, dpi: "3355 •••• 0106" },
  { id: "jb", codigo: "105", nombre: "Josué Barrios", puesto: "Electricista", obra: "torre", diario: 190, ingreso: "2021-09-20", vacTomadas: 10, dpi: "2765 •••• 0115" },
  { id: "ra", codigo: "106", nombre: "Rony Ajú", puesto: "Albañil", obra: "bodega", diario: 160, ingreso: "2024-04-08", vacTomadas: 0, dpi: "3121 •••• 0802" },
  { id: "wc", codigo: "107", nombre: "Wilmer Chávez", puesto: "Plomero", obra: "bodega", diario: 180, ingreso: "2020-11-23", vacTomadas: 15, dpi: "2690 •••• 0108" },
  { id: "ec", codigo: "108", nombre: "Edgar Coc", puesto: "Ayudante", obra: "bodega", diario: 115, ingreso: "2025-06-02", vacTomadas: 0, dpi: "3402 •••• 1601" },
  { id: "el", codigo: "109", nombre: "Esteban López", puesto: "Bodeguero", obra: "bodega", diario: 125, ingreso: "2018-05-14", vacTomadas: 12, dpi: "2455 •••• 0101" },
  { id: "fs", codigo: "110", nombre: "Fredy Sic", puesto: "Albañil", obra: "casa", diario: 160, ingreso: "2023-08-21", vacTomadas: 3, dpi: "3077 •••• 0410" },
  { id: "mp", codigo: "111", nombre: "Mario Pérez", puesto: "Ayudante", obra: "casa", diario: 115, ingreso: "2025-10-06", vacTomadas: 0, dpi: "3467 •••• 0108" },
  { id: "ot", codigo: "112", nombre: "Óscar Tun", puesto: "Piloto", obra: "casa", diario: 145, ingreso: "2022-02-14", vacTomadas: 6, dpi: "2933 •••• 1701" },
];
export const PIN_EJEMPLO = "1234";

/* Referencias legales usadas en la demo */
export const BONIF_MES = 250; // bonificación incentivo (Decreto 37-2001), no paga IGSS
export const BONIF_SEMANA = (BONIF_MES * 12) / 52;
export const IGSS_LAB = 0.0483;
export const IGSS_PAT = 0.1267; // incluye IRTRA e INTECAP
export const DIAS_MES = 30;

/* ───── fechas ───── */
const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const fecha = (f: string) => new Date(f + "T12:00");
export const diaCorto = (f: string) => DIAS_CORTOS[fecha(f).getDay()];
export const fechaLarga = (f: string) => `${fecha(f).getDate()} de ${MESES[fecha(f).getMonth()]} de ${fecha(f).getFullYear()}`;
export const mesNombre = (d: Date) => MESES[d.getMonth()];
export const hora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const hoyIso = () => iso(new Date());
export const ahoraMin = () => {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
};
const entre = (a: Date, b: Date) => Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000));

/* Lunes a sábado de la semana actual (si hoy es domingo, la que acaba de pasar) */
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

/* Jornada: lunes a viernes 7:00 a 16:00 (8 h con almuerzo), sábado 7:00 a 11:00 */
export const jornada = (f: string) => (fecha(f).getDay() === 6 ? { entra: 420, sale: 660 } : { entra: 420, sale: 960 });

/* ───── marcas ───── */
export type Marca = { entrada: number; salida: number | null; lejos?: boolean };
export type Dia = { fecha: string; marca: Marca | null };

function marcaDeEjemplo(t: Trabajador, f: string, esHoy: boolean): Marca | null {
  const dow = fecha(f).getDay();
  const n = (t.id.charCodeAt(0) * 31 + t.id.charCodeAt(1) * 7 + fecha(f).getDate() * 13) % 100;
  const j = jornada(f);
  if (t.id === "wc" && dow === 1) return null; // Wilmer faltó el lunes
  if (t.id === "mp" && dow === 3) return null; // Mario no llegó el miércoles
  let entrada = j.entra - 12 + (n % 14);
  if (t.id === "bt" && (dow === 2 || dow === 4)) entrada = j.entra + 38 + (n % 10); // Brayan llega tarde
  let salida = j.sale + (n % 9);
  if (["me", "jb", "ko"].includes(t.id) && dow !== 6) salida = j.sale + 90 + (n % 40); // horas extra en la torre
  const lejos = t.id === "ot" && (dow === 2 || esHoy); // Óscar marca lejos de su obra
  if (esHoy) {
    const ahora = ahoraMin();
    if (ahora < entrada) return null;
    return { entrada, salida: ahora >= salida ? salida : null, lejos };
  }
  return { entrada, salida, lejos };
}

/* ───── solicitudes del trabajador ───── */
export type Tipo = "vale" | "permiso" | "vacaciones";
export type Estado = "pendiente" | "aprobada" | "rechazada";
export type Solicitud = { id: string; trabajador: string; tipo: Tipo; detalle: string; monto?: number; dias?: number; fecha: string; estado: Estado };

type Guardado = { marcas: Record<string, Record<string, Marca>>; solicitudes: Solicitud[]; cerradas: string[] };
const CLAVE = "planilla:v2";
function inicial(): Guardado {
  const s = semana();
  return {
    marcas: {},
    solicitudes: [
      { id: "s1", trabajador: "ko", tipo: "vale", detalle: "Medicina para su hija", monto: 200, fecha: s[1], estado: "aprobada" },
      { id: "s2", trabajador: "ec", tipo: "vale", detalle: "Pasaje de la semana", monto: 150, fecha: s[2], estado: "pendiente" },
      { id: "s3", trabajador: "bt", tipo: "permiso", detalle: "Cita en el IGSS el viernes en la mañana", fecha: s[2], estado: "pendiente" },
      { id: "s4", trabajador: "ra", tipo: "vacaciones", detalle: "Del 22 al 24 de diciembre", dias: 3, fecha: s[0], estado: "pendiente" },
    ],
    cerradas: [],
  };
}

export function usePlanilla() {
  const [g, setG] = useState<Guardado>(() => {
    try {
      return JSON.parse(localStorage.getItem(CLAVE) || "null") ?? inicial();
    } catch {
      return inicial();
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
      return { fecha: f, marca: propia ?? marcaDeEjemplo(t, f, f === hoy) };
    });
  const hoyDe = (t: Trabajador) => diasDe(t).find((d) => d.fecha === hoy)?.marca ?? null;

  const marcar = (t: Trabajador): { tipo: "entrada" | "salida"; min: number } => {
    const ahora = ahoraMin();
    const actual = hoyDe(t);
    const sale = !!actual && actual.salida === null;
    const nueva: Marca = sale ? { ...actual!, salida: ahora } : { entrada: ahora, salida: null };
    setG((x) => ({ ...x, marcas: { ...x.marcas, [t.id]: { ...(x.marcas[t.id] ?? {}), [hoy]: nueva } } }));
    return { tipo: sale ? "salida" : "entrada", min: ahora };
  };

  const pedir = (s: Omit<Solicitud, "id" | "fecha" | "estado">) =>
    setG((x) => ({ ...x, solicitudes: [{ ...s, id: String(Date.now()), fecha: hoy, estado: "pendiente" }, ...x.solicitudes] }));
  const resolver = (id: string, estado: Estado) => setG((x) => ({ ...x, solicitudes: x.solicitudes.map((s) => (s.id === id ? { ...s, estado } : s)) }));
  const cerrar = () => setG((x) => ({ ...x, cerradas: [...x.cerradas, dias[0]] }));
  const reiniciar = () => setG(inicial());

  return { dias, hoy, diasDe, hoyDe, marcar, solicitudes: g.solicitudes, pedir, resolver, cerrada: g.cerradas.includes(dias[0]), cerrar, reiniciar };
}
export type Planilla = ReturnType<typeof usePlanilla>;

/* ───── cálculo de la semana, con cada parte separada para explicarla ───── */
export function semanaDe(t: Trabajador, dias: Dia[], solicitudes: Solicitud[]) {
  const hoy = hoyIso();
  const trabajados = dias.filter((d) => d.marca);
  let minExtra = 0;
  let tardes = 0;
  for (const d of trabajados) {
    const j = jornada(d.fecha);
    if (d.marca!.entrada > j.entra + 10) tardes++;
    if (d.marca!.salida !== null) minExtra += Math.max(0, d.marca!.salida - j.sale);
  }
  const horasExtra = Math.floor(minExtra / 30) / 2;
  const faltas = dias.filter((d) => !d.marca && d.fecha < hoy).length;
  const pendientes = dias.filter((d) => d.fecha > hoy).length;
  const semanaCompleta = dias.every((d) => d.marca);
  const septimoEstado: "si" | "no" | "pendiente" = semanaCompleta ? "si" : faltas > 0 ? "no" : "pendiente";
  const ordinario = trabajados.length * t.diario;
  const septimo = semanaCompleta ? t.diario : 0;
  const extras = horasExtra * (t.diario / 8) * 1.5;
  const afecto = ordinario + septimo + extras;
  const bonificacion = (BONIF_SEMANA * trabajados.length) / 6;
  const igss = afecto * IGSS_LAB;
  const vales = solicitudes.filter((s) => s.trabajador === t.id && s.tipo === "vale" && s.estado === "aprobada");
  const descVales = vales.reduce((a, s) => a + (s.monto ?? 0), 0);
  const liquido = afecto + bonificacion - igss - descVales;
  const lejos = trabajados.filter((d) => d.marca?.lejos).length;
  return { diasTrab: trabajados.length, horasExtra, tardes, faltas, pendientes, septimoEstado, ordinario, septimo, extras, afecto, bonificacion, igss, vales, descVales, liquido, lejos };
}

/* ───── prestaciones acumuladas a hoy ───── */
export function prestacionesDe(t: Trabajador) {
  const hoy = new Date();
  const ingreso = fecha(t.ingreso);
  const mensual = t.diario * DIAS_MES;
  const anio = hoy.getFullYear();
  // Aguinaldo: del 1 de diciembre al 30 de noviembre, se paga a más tardar el 15 de diciembre
  const iniAgu = new Date(hoy.getMonth() === 11 ? anio : anio - 1, 11, 1);
  const diasAgu = Math.min(365, entre(ingreso > iniAgu ? ingreso : iniAgu, hoy));
  const aguinaldo = (mensual * diasAgu) / 365;
  const pagoAgu = new Date(hoy.getMonth() === 11 && hoy.getDate() > 15 ? anio + 1 : anio, 11, 15);
  // Bono 14: del 1 de julio al 30 de junio, se paga a más tardar el 15 de julio
  const iniB14 = new Date(hoy.getMonth() >= 6 ? anio : anio - 1, 6, 1);
  const diasB14 = Math.min(365, entre(ingreso > iniB14 ? ingreso : iniB14, hoy));
  const bono14 = (mensual * diasB14) / 365;
  const pagoB14 = new Date(hoy.getMonth() >= 6 ? anio + 1 : anio, 6, 15);
  // Vacaciones: 15 días hábiles por año trabajado, desde su último aniversario
  const aniv = new Date(anio, ingreso.getMonth(), ingreso.getDate());
  const ultimoAniv = aniv > hoy ? new Date(anio - 1, ingreso.getMonth(), ingreso.getDate()) : aniv;
  const desdeAniv = entre(ultimoAniv > ingreso ? ultimoAniv : ingreso, hoy);
  const vacGanadas = Math.floor(((15 * desdeAniv) / 365) * 10) / 10;
  const vacDisponibles = Math.max(0, Math.round((vacGanadas - t.vacTomadas) * 10) / 10);
  // Indemnización estimada: un salario por año, con la sexta parte de aguinaldo y Bono 14
  const diasTotales = entre(ingreso, hoy);
  const anios = diasTotales / 365;
  const indemnizacion = mensual * (1 + 1 / 6 + 1 / 6) * anios;
  return { mensual, diasAgu, aguinaldo, pagoAgu, diasB14, bono14, pagoB14, vacGanadas, vacDisponibles, anios, indemnizacion };
}

/* IGSS del mes (estimado: 26 días trabajados por mes) */
export function igssMes(t: Trabajador) {
  const base = t.diario * 26;
  return { base, laboral: base * IGSS_LAB, patronal: base * IGSS_PAT };
}
export function fechaLimiteIgss() {
  const h = new Date();
  return new Date(h.getFullYear(), h.getMonth() + 1, 20);
}
export const antiguedad = (t: Trabajador) => {
  const a = entre(fecha(t.ingreso), new Date()) / 365;
  if (a < 1) return `${Math.max(1, Math.round(a * 12))} meses`;
  return `${Math.floor(a)} ${Math.floor(a) === 1 ? "año" : "años"}`;
};
export const iniciales = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("");

/* Boletas de semanas anteriores (inventadas pero estables) */
export function boletasAnteriores(t: Trabajador) {
  const lunes = fecha(semana()[0]);
  return [1, 2, 3, 4].map((k) => {
    const ini = new Date(lunes);
    ini.setDate(lunes.getDate() - 7 * k);
    const fin = new Date(ini);
    fin.setDate(ini.getDate() + 5);
    const dias = t.id === "wc" && k === 2 ? 5 : 6;
    const extra = ["me", "jb", "ko"].includes(t.id) ? 4 + k : 0;
    const afecto = dias * t.diario + (dias === 6 ? t.diario : 0) + extra * (t.diario / 8) * 1.5;
    const liquido = afecto + BONIF_SEMANA * (dias / 6) - afecto * IGSS_LAB;
    return { ini: iso(ini), fin: iso(fin), dias, liquido };
  });
}
