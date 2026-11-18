/*
 * Datos de la muestra para Tu Store (Xela). Equipos y precios tomados de su
 * Instagram (Black Week, nov 2026). Las fotos son las de sus propias publicaciones.
 * El S23 queda sin foto: en su publicación subieron la imagen del iPhone 16.
 * Accesorios, reparaciones y testimonios son de ejemplo para enseñar la idea.
 */
import airpods from "@/assets/demo-celulares/airpods.jpg";
import audifonos from "@/assets/demo-celulares/audifonos.jpg";
import cargador from "@/assets/demo-celulares/cargador.jpg";
import cable from "@/assets/demo-celulares/cable.jpg";
import fundas from "@/assets/demo-celulares/fundas-magsafe.jpg";
import bateria from "@/assets/demo-celulares/bateria.jpg";
import reloj from "@/assets/demo-celulares/reloj.jpg";
import r_ip16 from "@/assets/muestra-tustore/ig/rec-ip16.jpg";
import f_ip16 from "@/assets/muestra-tustore/ig/ip16.jpg";
import r_ip15p from "@/assets/muestra-tustore/ig/rec-ip15p.jpg";
import f_ip15p from "@/assets/muestra-tustore/ig/ip15p.jpg";
import r_ip13pm from "@/assets/muestra-tustore/ig/rec-ip13pm.jpg";
import f_ip13pm from "@/assets/muestra-tustore/ig/ip13pm.jpg";
import r_ip13p from "@/assets/muestra-tustore/ig/rec-ip13p.jpg";
import f_ip13p from "@/assets/muestra-tustore/ig/ip13p.jpg";
import r_ip13 from "@/assets/muestra-tustore/ig/rec-ip13.jpg";
import f_ip13 from "@/assets/muestra-tustore/ig/ip13.jpg";
import r_ip12 from "@/assets/muestra-tustore/ig/rec-ip12.jpg";
import f_ip12 from "@/assets/muestra-tustore/ig/ip12.jpg";
import r_s24u from "@/assets/muestra-tustore/ig/rec-s24u.jpg";
import f_s24u from "@/assets/muestra-tustore/ig/s24u.jpg";
import r_s23u from "@/assets/muestra-tustore/ig/rec-s23u.jpg";
import f_s23u from "@/assets/muestra-tustore/ig/s23u.jpg";
import r_s22 from "@/assets/muestra-tustore/ig/rec-s22.jpg";
import f_s22 from "@/assets/muestra-tustore/ig/s22.jpg";
import r_px10 from "@/assets/muestra-tustore/ig/rec-px10.jpg";
import f_px10 from "@/assets/muestra-tustore/ig/px10.jpg";
import r_g06 from "@/assets/muestra-tustore/ig/rec-g06.jpg";
import f_g06 from "@/assets/muestra-tustore/ig/g06.jpg";
export { default as fotoReparacion } from "@/assets/muestra-tustore/reparacion.jpg";
export { default as fotoPiezas } from "@/assets/muestra-tustore/reparacion-piezas.jpg";

export const ROJO = "#e3262e";
export const NEGRO = "#111111";
export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;

export type Opcion = { cap: string; efectivo: number | null; cuotas?: number };
export type Equipo = {
  id: string;
  nombre: string;
  marca: "Apple" | "Samsung" | "Google" | "Motorola";
  estado: string;
  color: string;
  fotos: string[];
  opciones: Opcion[];
  specs: [string, string][];
  nuevo?: boolean;
};

export const EQUIPOS: Equipo[] = [
  { id: "ip16", nombre: "iPhone 16", marca: "Apple", estado: "Seminuevo", color: "Negro", nuevo: true, fotos: [r_ip16, f_ip16], opciones: [{ cap: "256 GB", efectivo: 5650, cuotas: 6900 }],
    specs: [["Pantalla", '6.1" Super Retina XDR'], ["Procesador", "A18"], ["Cámaras", "48 MP + 12 MP gran angular"], ["Batería", "Hasta 22 h de video"], ["Carga", "USB-C"]] },
  { id: "ip15p", nombre: "iPhone 15 Pro", marca: "Apple", estado: "Seminuevo · eSIM", color: "Titanio natural", fotos: [r_ip15p, f_ip15p], opciones: [{ cap: "256 GB", efectivo: 5799 }],
    specs: [["Pantalla", '6.1" ProMotion 120 Hz'], ["Procesador", "A17 Pro"], ["Cámaras", "48 MP + 12 MP + 12 MP (3x)"], ["Cuerpo", "Titanio"], ["Carga", "USB-C"]] },
  { id: "ip13pm", nombre: "iPhone 13 Pro Max", marca: "Apple", estado: "Seminuevo", color: "Celeste", fotos: [r_ip13pm, f_ip13pm], opciones: [{ cap: "Consulte capacidad", efectivo: 4399 }],
    specs: [["Pantalla", '6.7" ProMotion 120 Hz'], ["Procesador", "A15 Bionic"], ["Cámaras", "12 MP + 12 MP + 12 MP (3x)"], ["Batería", "Hasta 28 h de video"]] },
  { id: "ip13p", nombre: "iPhone 13 Pro", marca: "Apple", estado: "Seminuevo", color: "Dorado", fotos: [r_ip13p, f_ip13p], opciones: [{ cap: "128 GB", efectivo: 3600, cuotas: 4300 }],
    specs: [["Pantalla", '6.1" ProMotion 120 Hz'], ["Procesador", "A15 Bionic"], ["Cámaras", "12 MP + 12 MP + 12 MP (3x)"], ["Batería", "Hasta 22 h de video"]] },
  { id: "ip13", nombre: "iPhone 13", marca: "Apple", estado: "Seminuevo", color: "Blanco", fotos: [r_ip13, f_ip13], opciones: [{ cap: "Consulte capacidad", efectivo: 2750 }],
    specs: [["Pantalla", '6.1" Super Retina XDR'], ["Procesador", "A15 Bionic"], ["Cámaras", "12 MP + 12 MP"], ["Batería", "Hasta 19 h de video"]] },
  { id: "ip12", nombre: "iPhone 12", marca: "Apple", estado: "Seminuevo", color: "6 colores", fotos: [r_ip12, f_ip12], opciones: [{ cap: "64 GB", efectivo: 1999 }],
    specs: [["Pantalla", '6.1" Super Retina XDR'], ["Procesador", "A14 Bionic"], ["Cámaras", "12 MP + 12 MP"], ["Batería", "Hasta 17 h de video"]] },
  { id: "s24u", nombre: "Galaxy S24 Ultra", marca: "Samsung", estado: "Seminuevo", color: "Gris", nuevo: true, fotos: [r_s24u, f_s24u], opciones: [{ cap: "256 GB", efectivo: 5700 }, { cap: "512 GB", efectivo: 6100 }],
    specs: [["Pantalla", '6.8" QHD+ 120 Hz'], ["Procesador", "Snapdragon 8 Gen 3"], ["Cámaras", "200 MP + 50 MP (5x) + 10 MP (3x) + 12 MP"], ["Batería", "5,000 mAh"], ["Extra", "S Pen incluido"]] },
  { id: "s23u", nombre: "Galaxy S23 Ultra", marca: "Samsung", estado: "Seminuevo", color: "Negro", fotos: [r_s23u, f_s23u], opciones: [{ cap: "256 GB", efectivo: 4600 }, { cap: "512 GB", efectivo: 5100 }],
    specs: [["Pantalla", '6.8" QHD+ 120 Hz'], ["Procesador", "Snapdragon 8 Gen 2"], ["Cámaras", "200 MP + 10 MP (10x) + 10 MP (3x) + 12 MP"], ["Batería", "5,000 mAh"], ["Extra", "S Pen integrado"]] },
  { id: "s23", nombre: "Galaxy S23", marca: "Samsung", estado: "Seminuevo", color: "Negro", fotos: [], opciones: [{ cap: "Consulte capacidad", efectivo: 2800, cuotas: 3600 }],
    specs: [["Pantalla", '6.1" FHD+ 120 Hz'], ["Procesador", "Snapdragon 8 Gen 2"], ["Cámaras", "50 MP + 12 MP + 10 MP (3x)"], ["Batería", "3,900 mAh"]] },
  { id: "s22", nombre: "Galaxy S22", marca: "Samsung", estado: "Seminuevo", color: "Rosado", fotos: [r_s22, f_s22], opciones: [{ cap: "128 GB", efectivo: 1999, cuotas: 2250 }, { cap: "256 GB", efectivo: 2250, cuotas: 2450 }],
    specs: [["Pantalla", '6.1" FHD+ 120 Hz'], ["Procesador", "Snapdragon 8 Gen 1"], ["Cámaras", "50 MP + 12 MP + 10 MP (3x)"], ["Batería", "3,700 mAh"]] },
  { id: "px10", nombre: "Pixel 10 Pro", marca: "Google", estado: "eSIM", color: "Celeste", nuevo: true, fotos: [r_px10, f_px10], opciones: [{ cap: "Consulte capacidad", efectivo: 5999, cuotas: 7300 }],
    specs: [["Pantalla", '6.3" LTPO 120 Hz'], ["Procesador", "Google Tensor G5"], ["Cámaras", "50 MP + 48 MP + 48 MP (5x)"], ["Extra", "Funciones de IA de Google"]] },
  { id: "g06", nombre: "Moto G06", marca: "Motorola", estado: "Nuevo", color: "Verde", fotos: [r_g06, f_g06], opciones: [{ cap: "Consulte capacidad", efectivo: 1300 }],
    specs: [["Pantalla", '6.88" 120 Hz'], ["Procesador", "MediaTek Helio G81"], ["Cámara", "50 MP"], ["Batería", "5,200 mAh"]] },
];

export type Accesorio = { id: string; nombre: string; precio: number; foto: string };
export const ACCESORIOS: Accesorio[] = [
  { id: "airpods", nombre: "AirPods Pro", precio: 2199, foto: airpods },
  { id: "audif", nombre: "Audífonos inalámbricos", precio: 349, foto: audifonos },
  { id: "carg", nombre: "Cargador USB-C 20 W", precio: 199, foto: cargador },
  { id: "cable", nombre: "Cable USB-C de 1 m", precio: 89, foto: cable },
  { id: "funda", nombre: "Funda MagSafe", precio: 179, foto: fundas },
  { id: "bat", nombre: "Batería portátil 10,000 mAh", precio: 249, foto: bateria },
  { id: "reloj", nombre: "Reloj inteligente", precio: 599, foto: reloj },
];

export const FALLAS = [
  { id: "pantalla", nombre: "Pantalla rota", tiempo: "2 a 3 horas", precio: { alta: 1450, media: 750, basica: 450 } },
  { id: "bateria", nombre: "La batería no dura", tiempo: "1 hora", precio: { alta: 650, media: 400, basica: 275 } },
  { id: "carga", nombre: "No carga", tiempo: "1 a 2 horas", precio: { alta: 450, media: 300, basica: 200 } },
  { id: "camara", nombre: "Cámara dañada", tiempo: "2 horas", precio: { alta: 900, media: 550, basica: 350 } },
  { id: "trasero", nombre: "Vidrio trasero roto", tiempo: "1 día", precio: { alta: 800, media: 500, basica: 300 } },
];
export const GAMAS = [
  { nombre: "iPhone 13 en adelante", gama: "alta" as const },
  { nombre: "iPhone 11 o 12", gama: "media" as const },
  { nombre: "Samsung Galaxy S o Note", gama: "alta" as const },
  { nombre: "Samsung Galaxy A", gama: "media" as const },
  { nombre: "Motorola o Xiaomi", gama: "basica" as const },
];

export const TESTIMONIOS = [
  { nombre: "María José R.", lugar: "Huehuetenango", texto: "Pedí mi S23 un martes y el jueves ya lo tenía por Guatex. Lo revisé antes de pagar y todo bien." },
  { nombre: "Carlos A.", lugar: "Xela", texto: "Fui al kiosko de Torre Pradera, me explicaron todo con paciencia y me fui con mi iPhone 13 el mismo día." },
  { nombre: "Andrea M.", lugar: "San Marcos", texto: "Me daba miedo comprar seminuevo, pero me lo enviaron y pagué al recibir. Llegó como en las fotos." },
];

/* el chat: preguntas listas y sus respuestas */
export const PREGUNTAS: { p: string; r: string; claves: string[] }[] = [
  { p: "¿Hacen envíos?", r: "Sí, enviamos a toda Guatemala por Guatex. Usted paga al recibir y puede revisar el equipo antes de pagar.", claves: ["envio", "envían", "envian", "guatex", "mandan", "llega"] },
  { p: "¿Cómo puedo pagar?", r: "En efectivo al recibir (precio de oferta), o con tarjeta Visa, Mastercard, BAC o Cuik. Con Visacuotas aplica el precio normal.", claves: ["pago", "pagar", "tarjeta", "cuotas", "visacuotas", "efectivo", "cuik", "bac"] },
  { p: "¿Puedo revisar antes de pagar?", r: "Claro. Revise su equipo con calma y pague solo si todo está bien.", claves: ["revisar", "probar", "ver antes"] },
  { p: "¿Tienen garantía?", r: "Sí. Los seminuevos tienen garantía por fallas de funcionamiento. Vea los detalles en Términos y condiciones, al final de la página.", claves: ["garantia", "garantía", "falla", "malo"] },
  { p: "¿Dónde están?", r: "En Torre Pradera Xela, kiosko 1, primer nivel, a un costado de Telus.", claves: ["donde", "dónde", "ubicacion", "ubicación", "direccion", "dirección", "tienda", "kiosko", "pradera"] },
  { p: "¿Qué horario tienen?", r: "Lunes a sábado de 9:00 a 19:00 (horario de ejemplo: en su página va el real).", claves: ["horario", "hora", "abren", "cierran", "domingo"] },
  { p: "¿Qué significa seminuevo?", r: "Es un equipo usado en excelente estado, revisado y funcionando al 100%. El estado de cada uno se lo confirmamos antes de su compra.", claves: ["seminuevo", "semi", "usado"] },
];

export const TERMINOS: { titulo: string; texto: string }[] = [
  { titulo: "Envíos", texto: "Enviamos a toda Guatemala por Guatex. El tiempo de entrega depende de su departamento, normalmente de 1 a 3 días hábiles. Le compartimos el número de guía para que vea dónde va su paquete." },
  { titulo: "Pagos", texto: "Puede pagar en efectivo al recibir (precio de oferta en efectivo) o con tarjeta Visa, Mastercard, BAC o Cuik. Los pagos con Visacuotas usan el precio normal." },
  { titulo: "Revise antes de pagar", texto: "Cuando reciba su pedido puede revisar el equipo antes de pagar. Si no está conforme, no lo recibe y no paga." },
  { titulo: "Garantía", texto: "Los equipos seminuevos tienen garantía por fallas de funcionamiento durante el plazo que le indiquemos al comprar. No cubre golpes, humedad, pantallas rotas ni equipos abiertos por terceros." },
  { titulo: "Cambios y devoluciones", texto: "Si su equipo presenta una falla cubierta por la garantía, lo revisamos y lo reparamos o cambiamos. Para hacer válida la garantía conserve su comprobante de compra." },
  { titulo: "Privacidad", texto: "Sus datos (nombre, teléfono y dirección) se usan solo para preparar y enviar su pedido. No los compartimos con nadie más." },
];
