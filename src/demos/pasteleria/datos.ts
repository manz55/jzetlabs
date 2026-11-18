/*
 * Demo de pastelería por encargo: "Dulce Abril" (negocio inventado, datos de ejemplo).
 * La vitrina de pasteles con foto, tamaños y sabores con su precio, cupos por día
 * y los pedidos guardados en el teléfono.
 * Fotos de Unsplash (licencia libre de Unsplash).
 */
import { useEffect, useState } from "react";
import chocoRosetas from "@/assets/demo-pasteleria/choco-rosetas.jpg";
import fresasCrema from "@/assets/demo-pasteleria/fresas-crema.jpg";
import galletaCrema from "@/assets/demo-pasteleria/galleta-crema.jpg";
import macarons from "@/assets/demo-pasteleria/macarons.jpg";
import rosaOro from "@/assets/demo-pasteleria/rosa-oro.jpg";
import bodaFlores from "@/assets/demo-pasteleria/boda-flores.jpg";
import bodaFrutos from "@/assets/demo-pasteleria/boda-frutos.jpg";
import bodaRosas from "@/assets/demo-pasteleria/boda-rosas.jpg";
import higos from "@/assets/demo-pasteleria/higos.jpg";
import selvaNegra from "@/assets/demo-pasteleria/selva-negra.jpg";
import mousse from "@/assets/demo-pasteleria/mousse.jpg";
import miniMora from "@/assets/demo-pasteleria/mini-mora.jpg";
import vainillaMoras from "@/assets/demo-pasteleria/vainilla-moras.jpg";
import frutosPisos from "@/assets/demo-pasteleria/frutos-pisos.jpg";
import dripBlanco from "@/assets/demo-pasteleria/drip-blanco.jpg";
import chispasRosa from "@/assets/demo-pasteleria/chispas-rosa.jpg";
import helado from "@/assets/demo-pasteleria/helado.jpg";
import miniBlanco from "@/assets/demo-pasteleria/mini-blanco.jpg";
import cheesecake from "@/assets/demo-pasteleria/cheesecake.jpg";
import cupcakes from "@/assets/demo-pasteleria/cupcakes.jpg";
import brownies from "@/assets/demo-pasteleria/brownies.jpg";
import cupcake from "@/assets/demo-pasteleria/cupcake.jpg";
import tQuince from "@/assets/demo-pasteleria/t-quince.jpg";
import tNino from "@/assets/demo-pasteleria/t-nino.jpg";
import tCortando from "@/assets/demo-pasteleria/t-cortando.jpg";
import tBoda from "@/assets/demo-pasteleria/t-boda.jpg";

/* colores de la casa: chocolate, leche de fresa, frambuesa y mantequilla */
export const CHOCO = "#3a1f17";
export const LECHE = "#f8ddd6";
export const NATA = "#fff7f0";
export const FRAMBUESA = "#b52a4b";
export const MANTEQUILLA = "#f3d27f";
export const LINEA = "rgba(58,31,23,.14)";
export const SERIF = '"Fraunces", Georgia, serif';

export const por = <T extends { id: string }>(lista: T[], id: string) => lista.find((x) => x.id === id)!;
export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;

/* tamaños: el precio de cada pastel se multiplica según el tamaño */
export const TAMANOS = [
  { id: "mini", nombre: "Mini", porciones: 5, nota: "4 a 6 porciones", factor: 0.5, pisos: 1 },
  { id: "p12", nombre: "Chico", porciones: 12, nota: "12 porciones", factor: 1, pisos: 1 },
  { id: "p25", nombre: "Mediano", porciones: 25, nota: "25 porciones", factor: 1.8, pisos: 1 },
  { id: "p40", nombre: "Grande", porciones: 40, nota: "40 porciones, 2 pisos", factor: 2.9, pisos: 2 },
  { id: "p80", nombre: "Para fiesta", porciones: 80, nota: "80 porciones, 3 pisos", factor: 5.3, pisos: 3 },
];

export const SABORES = [
  { id: "vainilla", nombre: "Vainilla con arequipe", precio: 0 },
  { id: "chocolate", nombre: "Chocolate con Nutella", precio: 30 },
  { id: "redvelvet", nombre: "Red velvet con queso crema", precio: 40 },
  { id: "tresleches", nombre: "Tres leches", precio: 25 },
  { id: "zanahoria", nombre: "Zanahoria y nuez", precio: 40 },
  { id: "limon", nombre: "Limón con frutos rojos", precio: 35 },
];

export const OCASIONES = [
  { id: "todos", nombre: "Todos" },
  { id: "cumple", nombre: "Cumpleaños" },
  { id: "infantil", nombre: "Infantiles" },
  { id: "quince", nombre: "Quince años" },
  { id: "boda", nombre: "Bodas" },
  { id: "baby", nombre: "Baby shower" },
  { id: "compartir", nombre: "Para compartir" },
];

export type Pastel = {
  id: string;
  nombre: string;
  foto: string;
  base: number; // precio del tamaño chico
  ocasiones: string[];
  tamanos: string[];
  sabor: string; // el que lleva en la foto
  d: string;
  marca?: string;
};

export const PASTELES: Pastel[] = [
  { id: "choco-rosetas", nombre: "Chocolate con rosetas", foto: chocoRosetas, base: 260, ocasiones: ["cumple", "compartir"], tamanos: ["mini", "p12", "p25", "p40"], sabor: "chocolate", d: "Ganache que escurre por los lados, rosetas de buttercream y el mensaje escrito a mano.", marca: "El más pedido" },
  { id: "fresas-crema", nombre: "Fresas con crema", foto: fresasCrema, base: 280, ocasiones: ["cumple", "baby"], tamanos: ["mini", "p12", "p25", "p40"], sabor: "vainilla", d: "Crema batida rosa, fresas de temporada y chocolate blanco por encima." },
  { id: "rosa-oro", nombre: "Rosa con hoja de oro", foto: rosaOro, base: 340, ocasiones: ["quince", "cumple"], tamanos: ["p12", "p25", "p40", "p80"], sabor: "redvelvet", d: "Buttercream rosa con un toque de hoja de oro comestible y flores frescas.", marca: "Para quince" },
  { id: "boda-flores", nombre: "Semidesnudo con flores", foto: bodaFlores, base: 380, ocasiones: ["boda"], tamanos: ["p25", "p40", "p80"], sabor: "vainilla", d: "Tres pisos con la capa de crema delgadita para que se vea el bizcocho, y flores naturales." },
  { id: "galleta-crema", nombre: "Galleta y crema", foto: galletaCrema, base: 295, ocasiones: ["infantil", "cumple"], tamanos: ["p12", "p25", "p40"], sabor: "chocolate", d: "Alto, con galletas de chocolate, chispas de colores y un chorrito rosa. Los niños lo aman." },
  { id: "boda-frutos", nombre: "Blanco con frutos rojos", foto: bodaFrutos, base: 360, ocasiones: ["boda", "quince"], tamanos: ["p40", "p80"], sabor: "limon", d: "Cuatro pisos de crema blanca con frutos rojos y peonías." },
  { id: "macarons", nombre: "Macarons pastel", foto: macarons, base: 320, ocasiones: ["baby", "quince", "cumple"], tamanos: ["mini", "p12", "p25"], sabor: "vainilla", d: "Rayas rosa pastel, chocolate blanco que escurre y macarons de colores encima." },
  { id: "selva-negra", nombre: "Selva negra", foto: selvaNegra, base: 250, ocasiones: ["compartir", "cumple"], tamanos: ["mini", "p12", "p25"], sabor: "chocolate", d: "Capas de chocolate, crema y cerezas en almíbar. El de siempre, hecho bien." },
  { id: "helado", nombre: "Barquillo de helado", foto: helado, base: 290, ocasiones: ["infantil", "cumple"], tamanos: ["p12", "p25"], sabor: "vainilla", d: "Rosa con chispas, un barquillo de cono encima y sorpresa de colores por dentro." },
  { id: "boda-rosas", nombre: "Rosas de azúcar", foto: bodaRosas, base: 420, ocasiones: ["boda", "quince"], tamanos: ["p40", "p80"], sabor: "vainilla", d: "Fondant blanco con rosas de azúcar hechas una por una y hojas verdes." },
  { id: "mousse", nombre: "Mousse de tres chocolates", foto: mousse, base: 270, ocasiones: ["compartir"], tamanos: ["mini", "p12", "p25"], sabor: "chocolate", d: "Bizcocho húmedo, mousse de chocolate de leche y un baño de ganache con perlas." },
  { id: "chispas-rosa", nombre: "Chispas y rosa", foto: chispasRosa, base: 285, ocasiones: ["infantil", "baby"], tamanos: ["p12", "p25"], sabor: "vainilla", d: "Blanco con chorrito rosa, cerezas y chispas de colores en la base." },
  { id: "higos", nombre: "Higos y miel", foto: higos, base: 330, ocasiones: ["compartir", "boda"], tamanos: ["p25", "p40"], sabor: "zanahoria", d: "Dos pisos semidesnudos con higos, miel y nueces. Para reuniones más tranquilas." },
  { id: "frutos-pisos", nombre: "Dos pisos de frutos rojos", foto: frutosPisos, base: 310, ocasiones: ["cumple", "quince"], tamanos: ["p25", "p40"], sabor: "limon", d: "Crema blanca con ondas hechas a mano, fresas y moras." },
  { id: "drip-blanco", nombre: "Drip de chocolate", foto: dripBlanco, base: 275, ocasiones: ["cumple"], tamanos: ["p12", "p25"], sabor: "vainilla", d: "Blanco con chocolate oscuro que escurre, fresas y el adorno de “Feliz cumpleaños”." },
  { id: "mini-mora", nombre: "Mini de moras", foto: miniMora, base: 240, ocasiones: ["compartir", "baby"], tamanos: ["mini", "p12"], sabor: "limon", d: "Lila, con arándanos frescos. Para dos o para regalar." },
  { id: "vainilla-moras", nombre: "Vainilla y arándanos", foto: vainillaMoras, base: 230, ocasiones: ["compartir", "baby"], tamanos: ["mini", "p12", "p25"], sabor: "vainilla", d: "Sencillo y rico: vainilla, crema y arándanos encima." },
  { id: "mini-blanco", nombre: "Mini con frambuesa", foto: miniBlanco, base: 220, ocasiones: ["cumple", "compartir"], tamanos: ["mini", "p12"], sabor: "tresleches", d: "Pequeño, con frambuesas y una vela. Para soplar en casa." },
];

/* lo que se cobra por el pastel, ya con el tamaño y el sabor */
export function precio(p: Pastel, tamano: string, sabor: string, velas = false) {
  const t = por(TAMANOS, tamano);
  const s = por(SABORES, sabor);
  return Math.round((p.base * t.factor + s.precio * Math.max(0.6, t.factor)) / 5) * 5 + (velas ? 20 : 0);
}
export const desde = (p: Pastel) => precio(p, p.tamanos[0], "vainilla");

export const ENTREGAS = [
  { id: "recoger", nombre: "Lo paso a recoger", nota: "Zona 13, de 9:00 a 18:00", precio: 0 },
  { id: "capital", nombre: "A domicilio en la capital", nota: "En furgón refrigerado", precio: 45 },
  { id: "afueras", nombre: "Mixco, Villa Nueva o Carretera", nota: "En furgón refrigerado", precio: 65 },
];
export const HORARIOS = ["9:00 a 11:00", "11:00 a 13:00", "14:00 a 16:00", "16:00 a 18:00"];

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
export const anticipacion = (tamano: string) => (por(TAMANOS, tamano).pisos >= 2 ? 5 : tamano === "mini" ? 2 : 3);

export type Estado = "por-hacer" | "listo" | "entregado";
export type Pedido = {
  id: string;
  pastel: string;
  tamano: string;
  sabor: string;
  texto: string;
  velas: boolean;
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
  const mk = (id: string, dia: number, pastel: string, tamano: string, sabor: string, texto: string, nombre: string, tel: string, entrega: string, horario: string, pagadoTodo = false, estado: Estado = "por-hacer", direccion = "", velas = false): Pedido => {
    const total = precio(por(PASTELES, pastel), tamano, sabor, velas) + por(ENTREGAS, entrega).precio;
    const anticipo = Math.round(total / 2);
    return { id, pastel, tamano, sabor, texto, velas, fecha: iso(masDias(dia)), horario, entrega, direccion, nombre, tel, total, anticipo, pagado: pagadoTodo ? total : anticipo, estado };
  };
  return [
    mk("e1", 0, "mini-blanco", "mini", "tresleches", "", "Gabriela Pineda", "42137788", "recoger", "11:00 a 13:00", true, "entregado"),
    mk("e2", 0, "galleta-crema", "p25", "chocolate", "Feliz 5, Mateo", "Karla Méndez", "47719022", "capital", "14:00 a 16:00", false, "listo", "6a avenida 12-30, zona 10", true),
    mk("e3", 1, "rosa-oro", "p40", "redvelvet", "Mis 15, Valeria", "Rosa Elena Castillo", "33014477", "afueras", "11:00 a 13:00", false, "por-hacer", "Condado Naranjo, Mixco"),
    mk("e4", 1, "choco-rosetas", "p12", "chocolate", "Te quiero, má", "Andrea Soto", "50021934", "recoger", "16:00 a 18:00"),
    mk("e5", 2, "boda-flores", "p80", "vainilla", "", "Mónica Herrera", "46027715", "capital", "9:00 a 11:00", false, "por-hacer", "Hotel en zona 10, salón principal"),
    mk("e6", 3, "fresas-crema", "p25", "vainilla", "Bienvenida, Emilia", "Lucía Paz", "33014478", "recoger", "11:00 a 13:00"),
    mk("e7", 3, "choco-rosetas", "p25", "chocolate", "Feliz cumple, Sofi", "Daniela Ortiz", "56104420", "capital", "14:00 a 16:00", false, "por-hacer", "Colonia Las Flores, zona 4", true),
    mk("e8", 4, "selva-negra", "p12", "chocolate", "", "Jorge Aldana", "41239087", "recoger", "9:00 a 11:00"),
  ];
}

const CLAVE = "pasteleria:pedidos-v2";
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

/* vitrina del día: lo que hay listo sin encargar */
export const POSTRES = [
  { id: "cheesecake", nombre: "Cheesecake de frutos rojos", nota: "Porción", precio: 38, quedan: 7, foto: cheesecake },
  { id: "cupcakes", nombre: "Caja de 6 cupcakes", nota: "Surtidos", precio: 120, quedan: 3, foto: cupcakes },
  { id: "brownies", nombre: "Brownies con nuez", nota: "Caja de 4", precio: 75, quedan: 5, foto: brownies },
  { id: "cupcake", nombre: "Cupcake de fresa", nota: "Unidad", precio: 18, quedan: 0, foto: cupcake },
];
const CLAVE_VITRINA = "pasteleria:vitrina-v1";
export function useVitrina() {
  const [quedan, setQuedan] = useState<Record<string, number>>(() => {
    try {
      const t = localStorage.getItem(CLAVE_VITRINA);
      if (t) return JSON.parse(t);
    } catch {
      /* nada */
    }
    return Object.fromEntries(POSTRES.map((p) => [p.id, p.quedan]));
  });
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_VITRINA, JSON.stringify(quedan));
    } catch {
      /* nada */
    }
  }, [quedan]);
  return { quedan, poner: (id: string, n: number) => setQuedan((q) => ({ ...q, [id]: Math.max(0, n) })) };
}

/* lo que dicen las clientas, con la foto que mandaron de su fiesta */
export const OPINIONES = [
  { foto: tQuince, quien: "Familia Rodas", que: "Rosa con hoja de oro, 80 porciones", d: "Lo pedimos con un mes de anticipación y el día de los quince llegó a la hora. Todos preguntaron de dónde era." },
  { foto: tNino, quien: "Karla M.", que: "Mini con frambuesa", d: "Vi el precio antes de pedir y no me cobraron nada extra. Mi hijo sopló las velas feliz." },
  { foto: tCortando, quien: "Ana Lucía", que: "Fresas con crema, 25 porciones", d: "Pagué la mitad para apartar y el resto cuando lo recogí. Súper fácil y el pastel, buenísimo." },
  { foto: tBoda, quien: "Mónica y Luis", que: "Semidesnudo con flores", d: "Nos dijeron desde el inicio qué días tenían cupo. Llegó al salón en furgón frío y perfecto." },
];

export const PREGUNTAS = [
  ["¿Con cuánto tiempo pido?", "Los mini, 2 días antes. Los de un piso, 3 días. Los de 2 y 3 pisos, 5 días. Para bodas y quince, mejor con un mes para asegurar el día."],
  ["¿Cómo aparto mi pastel?", "Con la mitad por transferencia o depósito. El resto lo pagas al recibirlo, en efectivo o transferencia."],
  ["¿Puedo pedir un diseño que vi en Instagram?", "Sí. Mándanos la foto de referencia por WhatsApp y te cotizamos el mismo día."],
  ["¿Cómo cuido mi pastel?", "Guárdalo en refrigeración y sácalo 30 minutos antes de servir. Si lleva fondant, lejos del sol."],
  ["¿Puedo cambiar algo del pedido?", "Hasta 48 horas antes de la entrega, sin costo."],
  ["¿Hacen entregas?", "Sí, en furgón refrigerado a la capital, Mixco, Villa Nueva y Carretera a El Salvador."],
];
