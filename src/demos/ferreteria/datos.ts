/*
 * Datos de la demo "Grupo Ferretero Industek" (negocio inventado; la banda de arriba lo dice).
 * Dentro de la página todo se escribe como una tienda en operación. Antes de usarla con un
 * cliente real hay que cambiar precios, existencias, zonas, plazos y condiciones por los suyos.
 */
import cemento from "@/assets/demo-ferreteria/cemento.jpg";
import varilla from "@/assets/demo-ferreteria/varilla.jpg";
import block from "@/assets/demo-ferreteria/block.jpg";
import lamina from "@/assets/demo-ferreteria/lamina.jpg";
import costanera from "@/assets/demo-ferreteria/costanera.jpg";
import tornillo from "@/assets/demo-ferreteria/tornillo.jpg";
import taladro from "@/assets/demo-ferreteria/taladro.jpg";
import pulidora from "@/assets/demo-ferreteria/pulidora.jpg";
import carretilla from "@/assets/demo-ferreteria/carretilla.jpg";
import pala from "@/assets/demo-ferreteria/pala.jpg";
import cinta from "@/assets/demo-ferreteria/cinta.jpg";
import tubo from "@/assets/demo-ferreteria/tubo.jpg";
import llave from "@/assets/demo-ferreteria/llave.jpg";
import portada from "@/assets/demo-ferreteria/portada.jpg";
import tienda from "@/assets/demo-ferreteria/tienda.jpg";
import entrega from "@/assets/demo-ferreteria/entrega.jpg";

export const AMBIENTE = { portada, tienda, entrega };

export const NAVY = "#0F172A";
export const ROJO = "#C81E1E";
export const ACERO = "#F8FAFC";
export const LINEA = "#E2E8F0";
export const TEXTO = "'Plus Jakarta Sans', Inter, system-ui, sans-serif";

export const TIENDA = {
  nombre: "Grupo Ferretero Industek",
  direccion: "Km 14.5 Carretera a El Salvador, Santa Catarina Pinula",
  mapa: "https://www.google.com/maps?q=Carretera+a+El+Salvador+km+14.5+Guatemala",
};

export const qz = (n: number) => `Q${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const entero = (n: number) => Math.round(n).toLocaleString("en-US");
export const m2 = (n: number) => `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²`;

/* ---------------- catálogo ---------------- */

export const CATEGORIAS = ["Obra gris", "Techos", "Herramienta eléctrica", "Herramienta manual", "Plomería"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export type ProductoId =
  | "cemento" | "varilla" | "block" | "lamina" | "costanera" | "tornillo"
  | "taladro" | "pulidora" | "carretilla" | "pala" | "cinta" | "tubo" | "llave";

export const FOTOS: Record<ProductoId, string> = { cemento, varilla, block, lamina, costanera, tornillo, taladro, pulidora, carretilla, pala, cinta, tubo, llave };

export type Producto = {
  id: ProductoId;
  sku: string;
  cat: Categoria;
  nombre: string;
  medida: string;
  uso: string;
  unidad: [string, string];
  precio: number;
  hay: number;
};

const U: [string, string] = ["unidad", "unidades"];

export const PRODUCTOS: Producto[] = [
  { id: "cemento", sku: "IT-OG-001", cat: "Obra gris", nombre: "Cemento Progreso UGC", medida: "42.5 kg · 4060 PSI", uso: "Fundición, levantado y repello", unidad: ["saco", "sacos"], precio: 82, hay: 320 },
  { id: "varilla", sku: "IT-OG-014", cat: "Obra gris", nombre: "Varilla corrugada 3/8\" grado 40", medida: "9.5 mm · 6 m · legítima", uso: "Losas, columnas y soleras", unidad: ["varilla", "varillas"], precio: 31, hay: 600 },
  { id: "block", sku: "IT-OG-030", cat: "Obra gris", nombre: "Block 14 × 19 × 39 cm", medida: "12.5 unidades por m²", uso: "Muros y paredes perimetrales", unidad: ["block", "blocks"], precio: 6.5, hay: 2400 },
  { id: "lamina", sku: "IT-TE-401", cat: "Techos", nombre: "Lámina troquelada aluzinc cal. 26", medida: "12 pies (3.66 m) · ancho útil 1 m", uso: "Cubiertas de casas y bodegas", unidad: ["lámina", "láminas"], precio: 199, hay: 240 },
  { id: "costanera", sku: "IT-TE-415", cat: "Techos", nombre: "Costanera galvanizada 4 × 2\"", medida: "1.0 mm · 6 m", uso: "Estructura para techo de lámina", unidad: ["costanera", "costaneras"], precio: 130, hay: 180 },
  { id: "tornillo", sku: "IT-TE-430", cat: "Techos", nombre: "Tornillo punta broca para lámina", medida: "2\" · arandela de hule", uso: "Fijación de lámina a costanera", unidad: ["tornillo", "tornillos"], precio: 0.85, hay: 5000 },
  { id: "taladro", sku: "IT-HE-102", cat: "Herramienta eléctrica", nombre: "Taladro percutor DeWalt", medida: "Inalámbrico · 18 V · 1/2\"", uso: "Concreto, block, madera y metal", unidad: U, precio: 899, hay: 14 },
  { id: "pulidora", sku: "IT-HE-118", cat: "Herramienta eléctrica", nombre: "Pulidora angular DeWalt 4½\"", medida: "Disco de 115 mm", uso: "Corte y desbaste de metal", unidad: U, precio: 549, hay: 4 },
  { id: "carretilla", sku: "IT-HM-205", cat: "Herramienta manual", nombre: "Carretilla de obra Truper", medida: "Llanta neumática", uso: "Acarreo de mezcla y ripio", unidad: U, precio: 425, hay: 11 },
  { id: "pala", sku: "IT-HM-211", cat: "Herramienta manual", nombre: "Pala redonda Truper", medida: "Mango de madera con puño", uso: "Excavación y mezcla", unidad: U, precio: 79, hay: 35 },
  { id: "cinta", sku: "IT-HM-240", cat: "Herramienta manual", nombre: "Cinta métrica Truper", medida: "8 m", uso: "Trazo y medición en obra", unidad: U, precio: 48, hay: 52 },
  { id: "tubo", sku: "IT-PL-301", cat: "Plomería", nombre: "Tubería PVC Tigre 1/2\"", medida: "Presión · tramo de 6 m", uso: "Instalación de agua fría", unidad: ["tubo", "tubos"], precio: 32, hay: 180 },
  { id: "llave", sku: "IT-PL-322", cat: "Plomería", nombre: "Llave de chorro de bronce", medida: "Rosca de 1/2\"", uso: "Tomas de agua en patio y pila", unidad: U, precio: 38, hay: 27 },
];

export const producto = (id: ProductoId) => PRODUCTOS.find((p) => p.id === id)!;
export const unidades = (p: Producto, n: number) => p.unidad[n === 1 ? 0 : 1];

/* ---------------- entrega ---------------- */

export type Zona = { id: string; nombre: string; plazo: string; flete: number };

const HOY = "En 4 horas";
export const ZONAS: Zona[] = [
  { id: "ces1", nombre: "Carretera a El Salvador, km 9 a 16", plazo: HOY, flete: 50 },
  { id: "pinula", nombre: "Santa Catarina Pinula", plazo: HOY, flete: 50 },
  { id: "z1516", nombre: "Zonas 15 y 16", plazo: HOY, flete: 60 },
  { id: "ces2", nombre: "Carretera a El Salvador, km 17 a 25", plazo: "Siguiente día hábil", flete: 75 },
  { id: "z1014", nombre: "Zonas 9, 10, 13 y 14", plazo: "Siguiente día hábil", flete: 75 },
  { id: "centro", nombre: "Zonas 1 a 8", plazo: "Siguiente día hábil", flete: 90 },
  { id: "sur", nombre: "Zonas 11, 12 y 21", plazo: "Martes, jueves y sábado", flete: 100 },
  { id: "mixco", nombre: "Mixco", plazo: "Lunes, miércoles y viernes", flete: 125 },
  { id: "villanueva", nombre: "Villa Nueva", plazo: "Martes y viernes", flete: 125 },
];
export const FUERA = "fuera";
export const zonaDe = (id: string) => ZONAS.find((z) => z.id === id);

export const HORARIOS = ["Primera hora disponible", "Por la mañana (7:00 a 12:00)", "Por la tarde (13:00 a 17:00)"];
export const ACCESOS = [
  { id: "camion", texto: "Ingresa camión hasta la obra" },
  { id: "picop", texto: "Solo ingresa picop" },
  { id: "mano", texto: "Requiere acarreo desde la calle" },
];
export const PAGOS = ["Transferencia bancaria", "Efectivo contra entrega", "Tarjeta en sala de ventas", "Crédito empresarial"];

/* ---------------- pedido ---------------- */

export type Carro = Partial<Record<ProductoId, number>>;
export type DatosPedido = {
  entrega: "tienda" | "obra";
  zona: string;
  direccion: string;
  referencia: string;
  horario: string;
  acceso: string;
  nombre: string;
  nit: string;
  correo: string;
  pago: string;
};

export const DATOS_VACIOS: DatosPedido = {
  entrega: "obra",
  zona: "",
  direccion: "",
  referencia: "",
  horario: HORARIOS[0],
  acceso: "camion",
  nombre: "",
  nit: "",
  correo: "",
  pago: PAGOS[0],
};

export const lineasDe = (carro: Carro) =>
  PRODUCTOS.filter((p) => (carro[p.id] ?? 0) > 0).map((p) => ({ p, n: carro[p.id]!, subtotal: p.precio * carro[p.id]! }));

export const subtotalDe = (carro: Carro) => lineasDe(carro).reduce((s, l) => s + l.subtotal, 0);

/* el flete solo se conoce cuando ya se eligió la zona */
export const fleteDe = (d: DatosPedido) => (d.entrega === "obra" ? (zonaDe(d.zona)?.flete ?? null) : 0);

export type Orden = { numero: string; fecha: string };

export function nuevaOrden(): Orden {
  const ahora = new Date();
  const dos = (n: number) => String(n).padStart(2, "0");
  const dia = `${ahora.getFullYear()}${dos(ahora.getMonth() + 1)}${dos(ahora.getDate())}`;
  return {
    numero: `IT-${dia}-${String(ahora.getTime()).slice(-4)}`,
    fecha: `${dos(ahora.getDate())}/${dos(ahora.getMonth() + 1)}/${ahora.getFullYear()} ${dos(ahora.getHours())}:${dos(ahora.getMinutes())}`,
  };
}

export function textoDeOrden(o: Orden, carro: Carro, d: DatosPedido) {
  const sub = subtotalDe(carro);
  const flete = fleteDe(d) ?? 0;
  const zona = zonaDe(d.zona);
  const partes = [
    `*ORDEN DE PEDIDO ${o.numero}*`,
    TIENDA.nombre,
    `Fecha: ${o.fecha}`,
    "",
    "*Detalle*",
    ...lineasDe(carro).map((l) => `${l.n} ${unidades(l.p, l.n)} · ${l.p.nombre} [${l.p.sku}] a ${qz(l.p.precio)} = ${qz(l.subtotal)}`),
    "",
    `Materiales (IVA incluido): ${qz(sub)}`,
    d.entrega === "obra" ? `Flete a obra: ${qz(flete)}` : "Retiro en sala de ventas: sin costo",
    `*TOTAL: ${qz(sub + flete)}*`,
  ];
  partes.push("", "*Entrega*");
  if (d.entrega === "obra" && zona) {
    partes.push(
      `Zona: ${zona.nombre} (${zona.plazo.toLowerCase()})`,
      `Dirección: ${d.direccion.trim()}`,
      ...(d.referencia.trim() ? [`Referencia: ${d.referencia.trim()}`] : []),
      `Horario: ${d.horario}`,
      `Acceso: ${ACCESOS.find((a) => a.id === d.acceso)!.texto}`,
    );
  } else {
    partes.push(`Retiro en sala de ventas: ${TIENDA.direccion}`);
  }
  partes.push(
    "",
    "*Facturación FEL*",
    `Nombre o razón social: ${d.nombre.trim()}`,
    `NIT: ${d.nit.trim().toUpperCase() || "CF"}`,
    ...(d.correo.trim() ? [`Correo: ${d.correo.trim()}`] : []),
    `Forma de pago: ${d.pago}`,
  );
  return partes.join("\n");
}

/* ---------------- calculadora de obra ----------------
 * Solo suma productos del catálogo. Rendimientos típicos para estimar;
 * conviene que los confirme el equipo técnico del cliente real.
 */
export type Caso = "losa" | "pared" | "techo";
export const CASOS: { id: Caso; nombre: string }[] = [
  { id: "losa", nombre: "Losa o Piso" },
  { id: "pared", nombre: "Pared de Block" },
  { id: "techo", nombre: "Techo / Lámina" },
];

export const MEDIDAS_INICIALES = { losaLargo: "4", losaAncho: "3", muro: "10", alto: "2.4", techoLargo: "6", techoAncho: "3.5" };
export type Medidas = typeof MEDIDAS_INICIALES;

export const CAMPOS: Record<Caso, { k: keyof Medidas; titulo: string; min: number; max: number }[]> = {
  losa: [
    { k: "losaLargo", titulo: "Largo", min: 0.5, max: 60 },
    { k: "losaAncho", titulo: "Ancho", min: 0.5, max: 60 },
  ],
  pared: [
    { k: "muro", titulo: "Largo", min: 0.4, max: 200 },
    { k: "alto", titulo: "Alto", min: 0.2, max: 8 },
  ],
  techo: [
    { k: "techoLargo", titulo: "Largo", min: 1, max: 60 },
    { k: "techoAncho", titulo: "Ancho (caída)", min: 1, max: 12 },
  ],
};

export const BASE: Record<Caso, string> = {
  losa: "Calculado para 10 cm de espesor y varilla a cada 20 cm, con reserva para desperdicio y traslapes.",
  pared: "12.5 blocks por m² más 5 % de reserva, y el cemento para pegarlos.",
  techo: "Lámina de 12 pies, costanera a cada metro y 4 tornillos por lámina en cada costanera.",
};

export type Item = { id: ProductoId; n: number };
export type Resultado = { area: number; items: Item[] };

/* acepta coma o punto; null si está fuera de rango */
export const leer = (t: string, min: number, max: number) => {
  const n = Number(t.replace(",", "."));
  return t.trim() !== "" && Number.isFinite(n) && n >= min && n <= max ? n : null;
};

const arriba = (n: number) => Math.ceil(n - 1e-9);

/* varillas de 6 m para una parrilla en las dos direcciones, con 10 % de traslape */
function parrilla(largo: number, ancho: number, separacionCm: number) {
  const s = separacionCm / 100;
  const metros = ((Math.floor(ancho / s + 1e-9) + 1) * largo + (Math.floor(largo / s + 1e-9) + 1) * ancho) * 1.1;
  return arriba(metros / 6);
}

export function calcular(caso: Caso, m: Medidas): Resultado | null {
  const v = CAMPOS[caso].map((c) => leer(m[c.k], c.min, c.max));
  if (v.some((x) => x === null)) return null;
  const [largo, ancho] = v as number[];
  const area = largo * ancho;
  if (caso === "losa") {
    return {
      area,
      items: [
        { id: "cemento", n: arriba(area * 0.1 * 1.05 * 8.5) },
        { id: "varilla", n: parrilla(largo, ancho, 20) },
      ],
    };
  }
  if (caso === "pared") {
    return {
      area,
      items: [
        { id: "block", n: arriba(area * 12.5 * 1.05) },
        { id: "cemento", n: arriba(area / 7) },
      ],
    };
  }
  const columnas = arriba(largo);
  const filas = ancho <= 3.66 ? 1 : arriba((ancho - 0.15) / (3.66 - 0.15));
  const lineas = arriba(ancho) + 1;
  return {
    area,
    items: [
      { id: "lamina", n: columnas * filas },
      { id: "costanera", n: arriba((lineas * largo * 1.05) / 6) },
      { id: "tornillo", n: lineas * columnas * 4 },
    ],
  };
}

export const totalDe = (items: Item[]) => items.reduce((s, i) => s + i.n * producto(i.id).precio, 0);
