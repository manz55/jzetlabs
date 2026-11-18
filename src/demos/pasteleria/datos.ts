/*
 * Demo de pastelería por encargo: "Dulce Abril" (negocio inventado, datos de ejemplo).
 * Opciones del pastel con su precio, cupos por día y los pedidos guardados en el teléfono.
 */
import { useEffect, useState } from "react";

export const CACAO = "#3b2620";
export const CREMA = "#fbf4ec";
export const ROSA = "#e9b7b0";
export const FRESA = "#b2414a";
export const LINEA = "rgba(59,38,32,.15)";
export const SERIF = '"Fraunces", Georgia, serif';

export type Opcion = { id: string; nombre: string; nota?: string; precio: number };
export const TAMANOS: (Opcion & { pisos: number; porciones: number })[] = [
  { id: "p10", nombre: "Chico", nota: "10 porciones · 1 piso", precio: 225, pisos: 1, porciones: 10 },
  { id: "p20", nombre: "Mediano", nota: "20 porciones · 1 piso alto", precio: 375, pisos: 1, porciones: 20 },
  { id: "p35", nombre: "Grande", nota: "35 porciones · 2 pisos", precio: 650, pisos: 2, porciones: 35 },
  { id: "p60", nombre: "Para fiesta", nota: "60 porciones · 3 pisos", precio: 1150, pisos: 3, porciones: 60 },
];
export const BIZCOCHOS: Opcion[] = [
  { id: "vainilla", nombre: "Vainilla", precio: 0 },
  { id: "chocolate", nombre: "Chocolate", precio: 0 },
  { id: "redvelvet", nombre: "Red velvet", precio: 40 },
  { id: "zanahoria", nombre: "Zanahoria y nuez", precio: 40 },
];
export const RELLENOS: Opcion[] = [
  { id: "arequipe", nombre: "Arequipe", precio: 0 },
  { id: "frutos", nombre: "Frutos rojos", precio: 35 },
  { id: "nutella", nombre: "Nutella", precio: 45 },
  { id: "queso", nombre: "Queso crema", precio: 30 },
];
export const COBERTURAS: (Opcion & { tipo: "buttercream" | "fondant" })[] = [
  { id: "buttercream", nombre: "Buttercream", nota: "Suave, se nota el trabajo a mano", precio: 0, tipo: "buttercream" },
  { id: "fondant", nombre: "Fondant", nota: "Liso, para diseños con figuras", precio: 120, tipo: "fondant" },
];
export const COLORES = [
  { id: "blanco", nombre: "Blanco", hex: "#fbf7f1" },
  { id: "rosa", nombre: "Rosa", hex: "#f2c4c0" },
  { id: "celeste", nombre: "Celeste", hex: "#c8dcea" },
  { id: "salvia", nombre: "Verde salvia", hex: "#c7d2bd" },
  { id: "chocolate", nombre: "Chocolate", hex: "#6d4532" },
];
export const DECORACIONES: Opcion[] = [
  { id: "flores", nombre: "Flores naturales", precio: 90 },
  { id: "frutos", nombre: "Fresas y frutos", precio: 60 },
  { id: "texto", nombre: "Mensaje escrito", precio: 25 },
  { id: "velas", nombre: "Velas y número", precio: 20 },
];
export const ENTREGAS = [
  { id: "recoger", nombre: "Lo paso a recoger", nota: "Zona 13, de 9:00 a 18:00", precio: 0 },
  { id: "capital", nombre: "Entrega en la capital", nota: "En furgón refrigerado", precio: 45 },
  { id: "afueras", nombre: "Mixco, Villa Nueva o Carretera", nota: "En furgón refrigerado", precio: 65 },
];
export const HORARIOS = ["9:00 a 11:00", "11:00 a 13:00", "14:00 a 16:00", "16:00 a 18:00"];

export const por = <T extends { id: string }>(lista: T[], id: string) => lista.find((x) => x.id === id)!;

/* el pastel que arma la clienta */
export type Pastel = { tamano: string; bizcocho: string; relleno: string; cobertura: string; color: string; deco: string[]; texto: string };
export const PASTEL_INICIAL: Pastel = { tamano: "p20", bizcocho: "chocolate", relleno: "arequipe", cobertura: "buttercream", color: "rosa", deco: ["flores", "texto"], texto: "Feliz cumple, Ana" };

export function precioPastel(p: Pastel) {
  const t = por(TAMANOS, p.tamano);
  // los extras cuestan más mientras más grande es el pastel
  const factor = t.porciones / 20;
  const extras = por(BIZCOCHOS, p.bizcocho).precio + por(RELLENOS, p.relleno).precio + por(COBERTURAS, p.cobertura).precio;
  const deco = p.deco.reduce((s, d) => s + por(DECORACIONES, d).precio, 0);
  return Math.round((t.precio + extras * Math.max(1, factor) + deco) / 5) * 5;
}
export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;

/* fechas y cupos */
export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const masDias = (n: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
};
export const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const fechaLarga = (f: string) => {
  const [a, m, d] = f.split("-").map(Number);
  const dt = new Date(a, m - 1, d);
  return `${["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"][dt.getDay()]} ${d} de ${MESES[m - 1]}`;
};
export const CUPO_DIA = 6;
/* días de anticipación según el tamaño */
export const anticipacion = (tamano: string) => (por(TAMANOS, tamano).pisos >= 2 ? 5 : 3);

export type Estado = "por-hacer" | "listo" | "entregado";
export type Pedido = {
  id: string;
  pastel: Pastel;
  fecha: string;
  horario: string;
  entrega: string;
  direccion: string;
  nombre: string;
  tel: string;
  total: number;
  anticipo: number;
  pagado: number;
  estado: Estado;
  nuevo?: boolean;
};

function ejemplos(): Pedido[] {
  const d = (n: number) => iso(masDias(n));
  const mk = (id: string, dia: number, pastel: Partial<Pastel>, nombre: string, tel: string, entrega: string, horario: string, pagadoTodo = false, estado: Estado = "por-hacer", direccion = ""): Pedido => {
    const p = { ...PASTEL_INICIAL, ...pastel };
    const total = precioPastel(p) + por(ENTREGAS, entrega).precio;
    const anticipo = Math.round(total / 2);
    return { id, pastel: p, fecha: d(dia), horario, entrega, direccion, nombre, tel, total, anticipo, pagado: pagadoTodo ? total : anticipo, estado };
  };
  return [
    mk("e1", 0, { tamano: "p10", bizcocho: "vainilla", relleno: "frutos", color: "blanco", deco: ["frutos"], texto: "" }, "Gabriela Pineda", "42137788", "recoger", "11:00 a 13:00", true, "entregado"),
    mk("e2", 0, { tamano: "p20", color: "celeste", deco: ["texto", "velas"], texto: "Feliz 5, Mateo" }, "Karla Méndez", "47719022", "capital", "14:00 a 16:00", false, "listo", "6a avenida 12-30, zona 10"),
    mk("e3", 1, { tamano: "p35", bizcocho: "redvelvet", relleno: "queso", color: "blanco", deco: ["flores"], texto: "" }, "Rosa Elena Castillo", "33014477", "afueras", "11:00 a 13:00", false, "por-hacer", "Condado Naranjo, Mixco"),
    mk("e4", 1, { tamano: "p10", bizcocho: "chocolate", relleno: "nutella", color: "chocolate", deco: ["texto"], texto: "Te quiero, má" }, "Andrea Soto", "50021934", "recoger", "16:00 a 18:00"),
    mk("e5", 2, { tamano: "p60", bizcocho: "vainilla", relleno: "frutos", cobertura: "fondant", color: "salvia", deco: ["flores", "texto"], texto: "Ana y Luis" }, "Mónica Herrera", "46027715", "capital", "9:00 a 11:00", false, "por-hacer", "Hotel en zona 10, salón principal"),
    mk("e6", 3, { tamano: "p20", bizcocho: "zanahoria", relleno: "queso", color: "blanco", deco: ["frutos"], texto: "" }, "Lucía Paz", "33014478", "recoger", "11:00 a 13:00"),
    mk("e7", 3, { tamano: "p20", color: "rosa", deco: ["texto", "velas"], texto: "Feliz cumple, Sofi" }, "Daniela Ortiz", "56104420", "capital", "14:00 a 16:00", false, "por-hacer", "Colonia Las Flores, zona 4"),
  ];
}

const CLAVE = "pasteleria:pedidos-v1";
export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    try {
      const t = localStorage.getItem(CLAVE);
      return t ? (JSON.parse(t) as Pedido[]) : ejemplos();
    } catch {
      return ejemplos();
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(pedidos));
    } catch {
      /* nada */
    }
  }, [pedidos]);
  return {
    pedidos,
    agregar: (p: Pedido) => setPedidos((ps) => [...ps, p]),
    cambiar: (id: string, x: Partial<Pedido>) => setPedidos((ps) => ps.map((p) => (p.id === id ? { ...p, ...x } : p))),
  };
}

/* cuántos pasteles hay ese día, más algunos pedidos por teléfono para que el calendario se vea real */
export function ocupados(pedidos: Pedido[], fecha: string) {
  const [, , d] = fecha.split("-").map(Number);
  const extra = [2, 0, 3, 1, 6, 2, 4][d % 7];
  return pedidos.filter((p) => p.fecha === fecha).length + extra;
}

export const POSTRES = [
  { id: "cheesecake", nombre: "Cheesecake de frutos rojos", nota: "Porción", precio: 38, quedan: 7 },
  { id: "cupcakes", nombre: "Caja de 6 cupcakes", nota: "Vainilla y chocolate", precio: 120, quedan: 3 },
  { id: "brownies", nombre: "Brownies con nuez", nota: "Caja de 4", precio: 75, quedan: 5 },
  { id: "tres-leches", nombre: "Tres leches", nota: "Porción", precio: 32, quedan: 0 },
];

export const OPINIONES = [
  { quien: "Gabriela, pastel de 10 porciones", d: "Vi el precio antes de pedir y no me cobraron nada extra. El pastel quedó igualito al dibujo." },
  { quien: "Mónica, pastel de boda", d: "Me dijeron desde el inicio qué días tenían cupo. Llegó al hotel a la hora y en furgón frío." },
  { quien: "Andrea, red velvet", d: "Pagué la mitad para apartar y el resto cuando lo recogí. Súper fácil." },
];
