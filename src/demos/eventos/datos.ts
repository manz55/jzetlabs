/*
 * Demo de eventos: "Fiestas La Ceiba" (negocio inventado, datos de ejemplo, fotos de Unsplash).
 * Alquiler de mobiliario, toldos y mantelería en Mixco: cumpleaños, primeras comuniones, bodas y fiestas de colonia.
 *
 * Problema del rubro -> cómo lo resuelve la demo
 * - "¿Tiene disponible para el 14?" y hay que revisar el cuaderno -> calendario con los fines de semana y lo que queda libre.
 * - Cotizar sillas, mesas, manteles, toldo y flete toma horas por chat -> cotizador por número de invitados con el total al momento.
 * - Se alquila dos veces el mismo mobiliario -> el inventario se descuenta por fecha y avisa si ya no alcanza.
 * - Anticipo y saldo se confunden -> la cotización dice cuánto es el anticipo y cuánto se paga al montar.
 * - Sillas que no regresan y manteles manchados -> en bodega se cuenta lo que salió y lo que regresó, y el faltante sale cobrado.
 * - El camión no sabe a qué hora montar ni qué llevar -> hoja de carga del fin de semana por evento.
 */
import { useEffect, useState } from "react";
import salon from "@/assets/demo-eventos/salon.jpg";
import carpa from "@/assets/demo-eventos/carpa.jpg";
import mesa from "@/assets/demo-eventos/mesa.jpg";
import redondas from "@/assets/demo-eventos/redondas.jpg";
import sillas from "@/assets/demo-eventos/sillas.jpg";
import apiladas from "@/assets/demo-eventos/apiladas.jpg";
import montaje from "@/assets/demo-eventos/montaje.jpg";

export const FOTOS = { salon, carpa, mesa, redondas, sillas, apiladas, montaje };

/* añil de noche de fiesta y los colores del papel picado */
export const ANIL = "#24357a";
export const ANIL2 = "#1a275c";
export const CIELO = "#e7ebf7";
export const ROSA = "#d6457a";
export const MAIZ = "#efb22e";
export const HOJA = "#2f9466";
export const TURQ = "#1f98a6";
export const TINTA = "#1b1f33";
export const SERIF = '"Young Serif", "Fraunces", serif';

export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;
export const porId = <T extends { id: string }>(l: T[], id: string) => l.find((x) => x.id === id)!;

export type Articulo = { id: string; nombre: string; precio: number; total: number; reposicion: number };
export const INVENTARIO: Articulo[] = [
  { id: "plegable", nombre: "Silla plegable blanca", precio: 5, total: 400, reposicion: 150 },
  { id: "tiffany", nombre: "Silla tiffany dorada", precio: 15, total: 120, reposicion: 380 },
  { id: "redonda", nombre: "Mesa redonda (10 personas)", precio: 35, total: 40, reposicion: 900 },
  { id: "mantel", nombre: "Mantel redondo", precio: 18, total: 60, reposicion: 160 },
  { id: "camino", nombre: "Camino de mesa de color", precio: 8, total: 60, reposicion: 60 },
  { id: "toldo6", nombre: "Toldo de 6 × 12 m (60 personas)", precio: 650, total: 4, reposicion: 9000 },
  { id: "toldo10", nombre: "Toldo de 10 × 20 m (150 personas)", precio: 1450, total: 2, reposicion: 21000 },
  { id: "pista", nombre: "Pista de baile 5 × 5 m", precio: 900, total: 2, reposicion: 15000 },
  { id: "luces", nombre: "Serie de focos de 10 m", precio: 75, total: 16, reposicion: 350 },
];

export const ZONAS = [
  { id: "mixco", nombre: "Mixco y San Cristóbal", flete: 0 },
  { id: "capital", nombre: "Ciudad capital", flete: 175 },
  { id: "villa", nombre: "Villa Nueva y Petapa", flete: 250 },
  { id: "fuera", nombre: "Antigua, Chimaltenango y más lejos", flete: 450 },
];
export const COLORES = [
  { id: "rosa", nombre: "Rosa", c: ROSA },
  { id: "maiz", nombre: "Amarillo", c: MAIZ },
  { id: "hoja", nombre: "Verde", c: HOJA },
  { id: "turq", nombre: "Turquesa", c: TURQ },
  { id: "anil", nombre: "Azul", c: ANIL },
];

export type Cot = { invitados: number; silla: "plegable" | "tiffany"; toldo: boolean; pista: boolean; luces: boolean; color: string; zona: string };
export type Linea = { id: string; n: number };

/* arma la lista de mobiliario a partir de los invitados */
export function armar(c: Cot): Linea[] {
  const mesas = Math.ceil(c.invitados / 10);
  const l: Linea[] = [
    { id: c.silla, n: c.invitados },
    { id: "redonda", n: mesas },
    { id: "mantel", n: mesas },
    { id: "camino", n: mesas },
  ];
  if (c.toldo) {
    if (c.invitados <= 60) l.push({ id: "toldo6", n: 1 });
    else if (c.invitados <= 120) l.push({ id: "toldo6", n: 2 });
    else l.push({ id: "toldo10", n: 1 }, ...(c.invitados > 150 ? [{ id: "toldo6", n: 1 }] : []));
  }
  if (c.pista) l.push({ id: "pista", n: 1 });
  if (c.luces) l.push({ id: "luces", n: Math.max(2, Math.ceil(c.invitados / 25)) });
  return l;
}
export const subtotal = (l: Linea[]) => l.reduce((s, x) => s + porId(INVENTARIO, x.id).precio * x.n, 0);

/* fines de semana que vienen */
export function finesDeSemana(n = 6) {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 6 || d.getDay() === 0) out.push(new Date(d));
  }
  return out;
}
export const clave = (d: Date) => d.toISOString().slice(0, 10);
export const fechaLarga = (d: Date) => d.toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" });
export const fechaCorta = (d: Date) => d.toLocaleDateString("es-GT", { weekday: "short", day: "numeric", month: "short" });

export type Evento = { id: number; fecha: string; cliente: string; tipo: string; lugar: string; montaje: string; lineas: Linea[]; total: number; anticipo: number; color: string; nuevo?: boolean; regreso?: Record<string, number> };

function inicio(): Evento[] {
  const f = finesDeSemana(6).map(clave);
  return [
    { id: 701, fecha: f[0], cliente: "Familia Monterroso", tipo: "Primera comunión", lugar: "Colonia El Naranjo, Mixco", montaje: "Sábado 7:00", lineas: [{ id: "plegable", n: 120 }, { id: "redonda", n: 12 }, { id: "mantel", n: 12 }, { id: "camino", n: 12 }, { id: "toldo6", n: 2 }], total: 2696, anticipo: 1348, color: "rosa" },
    { id: 702, fecha: f[0], cliente: "Iglesia Bethel, zona 7", tipo: "Convivio de jóvenes", lugar: "Colonia Kaminal Juyú, zona 7", montaje: "Sábado 13:00", lineas: [{ id: "plegable", n: 200 }, { id: "redonda", n: 20 }, { id: "mantel", n: 20 }, { id: "luces", n: 8 }], total: 2635, anticipo: 1320, color: "turq" },
    { id: 703, fecha: f[1], cliente: "Andrea y Luis", tipo: "Boda", lugar: "Finca en San Lucas Sacatepéquez", montaje: "Sábado 6:00", lineas: [{ id: "tiffany", n: 110 }, { id: "redonda", n: 11 }, { id: "mantel", n: 11 }, { id: "camino", n: 11 }, { id: "toldo10", n: 1 }, { id: "pista", n: 1 }, { id: "luces", n: 6 }], total: 6045, anticipo: 3025, color: "hoja" },
    { id: 704, fecha: f[2], cliente: "Doña Marta Cifuentes", tipo: "Cumpleaños 60", lugar: "Residenciales San Cristóbal", montaje: "Domingo 8:00", lineas: [{ id: "plegable", n: 60 }, { id: "redonda", n: 6 }, { id: "mantel", n: 6 }, { id: "camino", n: 6 }, { id: "toldo6", n: 1 }], total: 1316, anticipo: 660, color: "maiz" },
  ];
}
/* el del fin de semana pasado, para contar lo que regresó */
export const PASADO: Evento = {
  id: 699, fecha: "pasado", cliente: "Comité de vecinos Lomas de Portugal", tipo: "Fiesta de la colonia", lugar: "Lomas de Portugal, Mixco", montaje: "Sábado pasado 7:00",
  lineas: [{ id: "plegable", n: 150 }, { id: "redonda", n: 15 }, { id: "mantel", n: 15 }, { id: "toldo6", n: 2 }], total: 2860, anticipo: 1430, color: "anil",
};

type Estado = { eventos: Evento[]; regreso: Record<string, number> };
const CLAVE = "jz-eventos-v1";

export function useEventos() {
  const [e, setE] = useState<Estado>(() => {
    try {
      const t = localStorage.getItem(CLAVE);
      if (t) {
        const v = JSON.parse(t) as Estado;
        // si las fechas guardadas ya pasaron, se vuelve a empezar
        if (v.eventos.some((x) => x.fecha >= clave(new Date()))) return v;
      }
    } catch {
      /* nada */
    }
    return { eventos: inicio(), regreso: { plegable: 147, redonda: 15, mantel: 14, toldo6: 2 } };
  });
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(e));
    } catch {
      /* nada */
    }
  }, [e]);
  const usados = (fecha: string, id: string) => e.eventos.filter((x) => x.fecha === fecha).reduce((s, x) => s + (x.lineas.find((l) => l.id === id)?.n ?? 0), 0);
  return {
    ...e,
    usados,
    libres: (fecha: string, id: string) => porId(INVENTARIO, id).total - usados(fecha, id),
    apartar: (ev: Omit<Evento, "id">) => {
      const id = Math.max(...e.eventos.map((x) => x.id)) + 1;
      setE((v) => ({ ...v, eventos: [...v.eventos, { ...ev, id, nuevo: true }] }));
      return id;
    },
    contar: (id: string, n: number) => setE((v) => ({ ...v, regreso: { ...v.regreso, [id]: n } })),
    reiniciar: () => setE({ eventos: inicio(), regreso: { plegable: 147, redonda: 15, mantel: 14, toldo6: 2 } }),
  };
}
export type Ev = ReturnType<typeof useEventos>;
