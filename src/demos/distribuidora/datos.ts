/*
 * Demo de distribuidora: "Distribuidora El Volcán" (negocio inventado, datos de ejemplo, fotos de Unsplash).
 * Distribuidora de abarrotes por mayor que surte a tiendas de barrio en zona 12, zona 5, Mixco y Villa Nueva.
 *
 * Problema de una distribuidora -> cómo lo resuelve la demo
 * - El tendero pide por llamada o audio y el pedido se apunta mal -> pide solo desde el teléfono, con su código de tienda.
 * - Los precios cambian cada semana (aceite, azúcar) y el vendedor da el precio viejo -> lista de precios al día, con aviso de lo que subió o bajó.
 * - "¿Hay aceite?" -> existencia a la vista: hay, quedan pocas o agotado.
 * - Nadie sabe qué día pasa el camión por su zona -> cada tienda ve su día de entrega según su ruta.
 * - El piloto cobra en efectivo y en la noche no cuadra -> el piloto marca entregado y cobrado, y el cuadre sale solo.
 * - Créditos que se vencen sin que nadie cobre -> la oficina ve los saldos vencidos y manda el recordatorio.
 */
import { useEffect, useState } from "react";
import bodega from "@/assets/demo-distribuidora/bodega.jpg";
import estantes from "@/assets/demo-distribuidora/estantes.jpg";
import camion from "@/assets/demo-distribuidora/camion.jpg";
import tienda from "@/assets/demo-distribuidora/tienda.jpg";
import tendero from "@/assets/demo-distribuidora/tendero.jpg";
import cajas from "@/assets/demo-distribuidora/cajas.jpg";
import montacargas from "@/assets/demo-distribuidora/montacargas.jpg";

export const FOTOS = { bodega, estantes, camion, tienda, tendero, cajas, montacargas };

/* cartón kraft, tinta azul de nota de envío y el rojo del sello de hule */
export const KRAFT = "#d6bf98";
export const KRAFT2 = "#c7aa7c";
export const ETIQUETA = "#ffffff";
export const TINTA = "#1f2d45";
export const SELLO = "#b3261e";
export const VERDE = "#2f6b3a";
export const STENCIL = '"Saira Stencil One", "Bricolage Grotesque", sans-serif';

export const qz = (n: number) => `Q${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export const PEDIDO_MINIMO = 500;

export const RUTAS = [
  { id: "r1", nombre: "Ruta 1", zona: "Zona 12 y zona 5", dias: [1, 4], piloto: "Don Efraín", camion: "Camión C-21" },
  { id: "r2", nombre: "Ruta 2", zona: "Villa Nueva y Bárcenas", dias: [2, 5], piloto: "Byron", camion: "Camión C-34" },
  { id: "r3", nombre: "Ruta 3", zona: "Mixco y San Cristóbal", dias: [3, 6], piloto: "Don Chepe", camion: "Panel P-08" },
];
export const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export type Producto = { id: string; nombre: string; unidad: string; cat: string; precio: number; antes?: number; hay: number };
export const CATEGORIAS = ["Granos", "Abarrotes", "Limpieza", "Higiene"];
export const PRODUCTOS: Producto[] = [
  { id: "frijol", nombre: "Frijol negro", unidad: "quintal (100 lb)", cat: "Granos", precio: 545, antes: 560, hay: 38 },
  { id: "arroz", nombre: "Arroz blanco", unidad: "quintal (100 lb)", cat: "Granos", precio: 430, hay: 52 },
  { id: "azucar", nombre: "Azúcar blanca", unidad: "quintal (100 lb)", cat: "Granos", precio: 345, antes: 330, hay: 6 },
  { id: "maiz", nombre: "Harina de maíz", unidad: "fardo de 20 bolsas de 2 lb", cat: "Granos", precio: 168, hay: 41 },
  { id: "aceite", nombre: "Aceite vegetal 900 ml", unidad: "caja de 12", cat: "Abarrotes", precio: 216, antes: 228, hay: 27 },
  { id: "pasta", nombre: "Pastas surtidas 200 g", unidad: "fardo de 20", cat: "Abarrotes", precio: 88, hay: 64 },
  { id: "sopas", nombre: "Sopas instantáneas", unidad: "caja de 48", cat: "Abarrotes", precio: 122, hay: 0 },
  { id: "cafe", nombre: "Café molido 400 g", unidad: "caja de 24", cat: "Abarrotes", precio: 336, hay: 15 },
  { id: "sal", nombre: "Sal yodada 1 lb", unidad: "fardo de 25", cat: "Abarrotes", precio: 52, hay: 80 },
  { id: "detergente", nombre: "Detergente en polvo 450 g", unidad: "fardo de 24", cat: "Limpieza", precio: 205, hay: 22 },
  { id: "jabon", nombre: "Jabón de barra para ropa", unidad: "caja de 50", cat: "Limpieza", precio: 238, hay: 4 },
  { id: "cloro", nombre: "Cloro 1 litro", unidad: "caja de 12", cat: "Limpieza", precio: 96, hay: 33 },
  { id: "papel", nombre: "Papel higiénico", unidad: "fardo de 48 rollos", cat: "Higiene", precio: 189, hay: 19 },
  { id: "pasta-dental", nombre: "Pasta dental 75 ml", unidad: "caja de 36", cat: "Higiene", precio: 270, hay: 9 },
];
export const porId = <T extends { id: string }>(l: T[], id: string) => l.find((x) => x.id === id)!;
export const existencia = (n: number) => (n === 0 ? { t: "Agotado", c: SELLO } : n < 10 ? { t: `Quedan ${n}`, c: "#a36a00" } : { t: "Hay", c: VERDE });

export type Tienda = { id: string; nombre: string; dueno: string; dir: string; ruta: string; credito: number; saldo: number; vence?: number; tel: string };
export const TIENDAS: Tienda[] = [
  { id: "T-104", nombre: "Tienda Doña Mari", dueno: "María Coc", dir: "Colonia La Reformita, zona 12", ruta: "r1", credito: 15, saldo: 1280, vence: -4, tel: "5555 0104" },
  { id: "T-118", nombre: "Abarrotería El Shaddai", dueno: "Josué Pérez", dir: "Colonia Bárcenas, Villa Nueva", ruta: "r2", credito: 8, saldo: 0, tel: "5555 0118" },
  { id: "T-121", nombre: "Tienda La Bendición", dueno: "Rosa Xitumul", dir: "Colonia Abril, zona 5", ruta: "r1", credito: 15, saldo: 640, vence: 6, tel: "5555 0121" },
  { id: "T-133", nombre: "Depósito Los Pinos", dueno: "Héctor Ajú", dir: "Colonia Primero de Julio, Mixco", ruta: "r3", credito: 15, saldo: 2150, vence: -9, tel: "5555 0133" },
  { id: "T-140", nombre: "Tienda Rosita", dueno: "Rosa de León", dir: "Colonia Roosevelt, zona 11", ruta: "r3", credito: 0, saldo: 0, tel: "5555 0140" },
  { id: "T-152", nombre: "Minisúper San José", dueno: "Walter Gómez", dir: "Ciudad Real, Villa Nueva", ruta: "r2", credito: 8, saldo: 395, vence: 2, tel: "5555 0152" },
];

export type Linea = { id: string; n: number };
export type Pedido = { num: number; tienda: string; lineas: Linea[]; pago: "contado" | "credito"; estado: "nuevo" | "en-ruta" | "entregado"; cobrado: number; hora: string; nota?: string; nuevo?: boolean };
export const totalDe = (l: Linea[]) => l.reduce((s, x) => s + porId(PRODUCTOS, x.id).precio * x.n, 0);

const PEDIDOS_INICIO: Pedido[] = [
  { num: 3051, tienda: "T-104", lineas: [{ id: "frijol", n: 2 }, { id: "aceite", n: 1 }, { id: "maiz", n: 2 }], pago: "credito", estado: "entregado", cobrado: 0, hora: "7:40" },
  { num: 3052, tienda: "T-121", lineas: [{ id: "arroz", n: 1 }, { id: "azucar", n: 1 }, { id: "sal", n: 2 }, { id: "cloro", n: 1 }], pago: "contado", estado: "entregado", cobrado: 975, hora: "8:15" },
  { num: 3053, tienda: "T-118", lineas: [{ id: "detergente", n: 2 }, { id: "papel", n: 1 }, { id: "pasta", n: 3 }], pago: "contado", estado: "en-ruta", cobrado: 0, hora: "8:50" },
  { num: 3054, tienda: "T-152", lineas: [{ id: "aceite", n: 2 }, { id: "cafe", n: 1 }], pago: "credito", estado: "en-ruta", cobrado: 0, hora: "9:05" },
  { num: 3055, tienda: "T-133", lineas: [{ id: "frijol", n: 3 }, { id: "arroz", n: 2 }, { id: "jabon", n: 1 }], pago: "contado", estado: "nuevo", cobrado: 0, hora: "9:30", nota: "Entrar por el portón de atrás" },
  { num: 3056, tienda: "T-140", lineas: [{ id: "sal", n: 1 }, { id: "pasta", n: 2 }, { id: "cloro", n: 2 }, { id: "maiz", n: 1 }], pago: "contado", estado: "nuevo", cobrado: 0, hora: "9:42" },
];

type Estado = { pedidos: Pedido[]; recordados: string[] };
const CLAVE = "jz-distribuidora-v1";

export function useDistribuidora() {
  const [e, setE] = useState<Estado>(() => {
    try {
      const t = localStorage.getItem(CLAVE);
      if (t) return JSON.parse(t) as Estado;
    } catch {
      /* nada */
    }
    return { pedidos: PEDIDOS_INICIO, recordados: [] };
  });
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(e));
    } catch {
      /* nada */
    }
  }, [e]);
  const hora = () => {
    const d = new Date();
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  };
  const cambiar = (num: number, f: (p: Pedido) => Pedido) => setE((v) => ({ ...v, pedidos: v.pedidos.map((p) => (p.num === num ? f(p) : p)) }));
  return {
    ...e,
    pedir: (tienda: string, lineas: Linea[], pago: Pedido["pago"], nota: string) => {
      const num = Math.max(...e.pedidos.map((p) => p.num)) + 1;
      setE((v) => ({ ...v, pedidos: [...v.pedidos, { num, tienda, lineas, pago, estado: "nuevo", cobrado: 0, hora: hora(), nota: nota || undefined, nuevo: true }] }));
      return num;
    },
    cargar: (num: number) => cambiar(num, (p) => ({ ...p, estado: "en-ruta" })),
    entregar: (num: number, cobrado: number) => cambiar(num, (p) => ({ ...p, estado: "entregado", cobrado })),
    recordar: (id: string) => setE((v) => ({ ...v, recordados: [...v.recordados, id] })),
    reiniciar: () => setE({ pedidos: PEDIDOS_INICIO, recordados: [] }),
  };
}
export type Dist = ReturnType<typeof useDistribuidora>;

/* el próximo día que pasa el camión de esa ruta (hoy cuenta si todavía es temprano) */
export function proximaVisita(ruta: string) {
  const r = porId(RUTAS, ruta);
  const hoy = new Date().getDay();
  for (let k = 0; k < 7; k++) {
    const d = (hoy + k) % 7;
    if (r.dias.includes(d) && (k > 0 || new Date().getHours() < 10)) return k === 0 ? "hoy" : k === 1 ? "mañana" : `el ${DIAS[d]}`;
  }
  return "esta semana";
}
