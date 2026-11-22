import { useEffect, useState } from "react";
import bolsoCognac from "@/assets/demo-lujo/bolso-cognac.jpg";
import bolsoRosa from "@/assets/demo-lujo/bolso-rosa.jpg";
import bolsoVerde from "@/assets/demo-lujo/bolso-verde.jpg";
import vestidoNegro from "@/assets/demo-lujo/vestido-negro.jpg";
import vestidoMarfil from "@/assets/demo-lujo/vestido-marfil.jpg";
import vestidoRosa from "@/assets/demo-lujo/vestido-rosa.jpg";
import zapatos from "@/assets/demo-lujo/zapatos-crema.jpg";
import collar from "@/assets/demo-lujo/collar.jpg";
import perlas from "@/assets/demo-lujo/perlas.jpg";
import sillon from "@/assets/demo-lujo/sillon.jpg";
import jarron from "@/assets/demo-lujo/jarron.jpg";
import jarrones from "@/assets/demo-lujo/jarrones.jpg";

export type Categoria = "Moda" | "Bolsos" | "Zapatos" | "Joyería" | "Interiores";
export type Estado = "disponible" | "apartada" | "vendida";
export type Pieza = { id: string; nombre: string; categoria: Categoria; foto: string; original: number; precio: number; talla?: string; condicion: string; nota: string; detalles: string[]; duena: string };

/* cada pieza es única; "duena" es quien la dejó en consignación */
export const PIEZAS: Pieza[] = [
  { id: "p01", nombre: "Bolso estructurado en piel coñac", categoria: "Bolsos", foto: bolsoCognac, original: 9800, precio: 5880, condicion: "Como nuevo", nota: "Piel italiana con herrajes dorados. Incluye bandolera y funda.", detalles: ["Piel de becerro", "32 × 22 × 14 cm", "Hecho en Italia"], duena: "Mariana S." },
  { id: "p02", nombre: "Vestido largo negro con abertura", categoria: "Moda", foto: vestidoNegro, original: 3200, precio: 1920, talla: "S", condicion: "Como nuevo", nota: "Usado una sola vez. Caída fluida, ideal para una gala.", detalles: ["Crepé de seda", "Talla S", "Limpieza profesional"], duena: "Lucía R." },
  { id: "p03", nombre: "Collar de perlas con broche de oro", categoria: "Joyería", foto: collar, original: 6400, precio: 3840, condicion: "Excelente", nota: "Perlas cultivadas de 7 mm. Viene en su estuche.", detalles: ["Perlas cultivadas", "Broche de oro 14k", "45 cm de largo"], duena: "Maison Solène" },
  { id: "p04", nombre: "Mini bolso acolchado rosa palo", categoria: "Bolsos", foto: bolsoRosa, original: 5200, precio: 3120, condicion: "Muy bueno", nota: "Leves marcas en la base. Bandolera desmontable.", detalles: ["Piel acolchada", "18 × 14 × 8 cm", "Bandolera de 110 cm"], duena: "Andrea P." },
  { id: "p05", nombre: "Stilettos nude en piel", categoria: "Zapatos", foto: zapatos, original: 2900, precio: 1740, talla: "37", condicion: "Como nuevo", nota: "Suela sin desgaste. Tacón de 9 cm.", detalles: ["Piel napa", "Talla 37", "Incluye caja"], duena: "Lucía R." },
  { id: "p06", nombre: "Butaca de madera clara y lino", categoria: "Interiores", foto: sillon, original: 4800, precio: 2880, condicion: "Excelente", nota: "Diseño escandinavo de mediados de siglo. Tapiz recién renovado.", detalles: ["Roble natural", "68 × 72 × 80 cm", "Entrega en la capital"], duena: "Maison Solène" },
  { id: "p07", nombre: "Vestido marfil asimétrico", categoria: "Moda", foto: vestidoMarfil, original: 2600, precio: 1560, talla: "M", condicion: "Muy bueno", nota: "Drapeado a un hombro. Perfecto para una boda civil.", detalles: ["Satén", "Talla M", "Forro completo"], duena: "Andrea P." },
  { id: "p08", nombre: "Bolso de mano verde petróleo", categoria: "Bolsos", foto: bolsoVerde, original: 4100, precio: 2460, condicion: "Muy bueno", nota: "Cierre dorado en perfecto estado. Interior impecable.", detalles: ["Piel granulada", "26 × 19 × 9 cm", "Asa corta"], duena: "Mariana S." },
  { id: "p09", nombre: "Jarrón escultórico de cerámica", categoria: "Interiores", foto: jarron, original: 950, precio: 570, condicion: "Como nuevo", nota: "Pieza de autor, acabado mate.", detalles: ["Gres", "28 cm de alto", "Hecho a mano"], duena: "Maison Solène" },
  { id: "p10", nombre: "Vestido midi rosa bordado", categoria: "Moda", foto: vestidoRosa, original: 2200, precio: 1320, talla: "S", condicion: "Excelente", nota: "Bordado floral a mano. Cuello halter.", detalles: ["Chifón", "Talla S", "Largo midi"], duena: "Lucía R." },
  { id: "p11", nombre: "Hilo doble de perlas", categoria: "Joyería", foto: perlas, original: 3800, precio: 2280, condicion: "Excelente", nota: "Dos vueltas, se puede usar largo o corto.", detalles: ["Perlas de río", "90 cm", "Broche de plata"], duena: "Mariana S." },
  { id: "p12", nombre: "Trío de vasijas en gres", categoria: "Interiores", foto: jarrones, original: 1400, precio: 840, condicion: "Como nuevo", nota: "Se venden juntas. Tonos arena y hueso.", detalles: ["Gres sin esmaltar", "18 a 24 cm", "Set de 3"], duena: "Maison Solène" },
];
export const CATEGORIAS: ("Todo" | Categoria)[] = ["Todo", "Moda", "Bolsos", "Zapatos", "Joyería", "Interiores"];
export const PARTE_CONSIGNANTE = 0.6; // lo que recibe quien deja la pieza
export const ahorro = (p: Pieza) => Math.round((1 - p.precio / p.original) * 100);

export type Solicitud = { id: string; nombre: string; pieza: string; categoria: Categoria; pagado: number; estado: "nueva" | "aceptada" | "rechazada" };
export type Deseo = { id: string; nombre: string; busca: string };
export type Datos = { estados: Record<string, Estado>; apartadoPor: Record<string, string>; pagadas: string[]; solicitudes: Solicitud[]; deseos: Deseo[] };
export const INICIAL: Datos = {
  estados: { p04: "apartada", p09: "vendida", p11: "vendida" },
  apartadoPor: { p04: "Gabriela M." },
  pagadas: [],
  solicitudes: [{ id: "s1", nombre: "Paola C.", pieza: "Bolso de piel negra con cadena", categoria: "Bolsos", pagado: 7200, estado: "nueva" }],
  deseos: [{ id: "d1", nombre: "Sofía L.", busca: "Bolso negro mediano" }],
};

export function useDatos() {
  const [d, setD] = useState<Datos>(() => {
    try {
      return JSON.parse(localStorage.getItem("solene-v1") ?? "null") ?? INICIAL;
    } catch {
      return INICIAL;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("solene-v1", JSON.stringify(d));
    } catch {
      /* modo privado */
    }
  }, [d]);
  return [d, setD] as const;
}


export const estadoDe = (d: Datos, id: string): Estado => d.estados[id] ?? "disponible";
