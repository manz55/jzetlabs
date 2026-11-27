/* Ficha técnica de cada teléfono: colores, especificaciones y contenido de la caja. */

export type Color = { nombre: string; tono: string };

export type Ficha = {
  colores: Color[];
  pantalla: string;
  procesador: string;
  memoria: string;
  camaras: string;
  frontal: string;
  bateria: string;
  sim: string;
  caja: string[];
};

const c = (nombre: string, tono: string): Color => ({ nombre, tono });

export const FICHAS: Record<string, Ficha> = {
  ip16pro: {
    colores: [c("Titanio Natural", "#B7AFA3"), c("Titanio Negro", "#3C3B3D"), c("Titanio Blanco", "#E8E6E1"), c("Titanio Desierto", "#C4A58B")],
    pantalla: "6.3″ OLED Super Retina XDR, 120 Hz",
    procesador: "Apple A18 Pro",
    memoria: "8 GB",
    camaras: "48 MP principal + 48 MP ultra gran angular + 12 MP teleobjetivo 5x",
    frontal: "12 MP",
    bateria: "Hasta 27 horas de video · carga USB-C",
    sim: "Nano SIM + eSIM",
    caja: ["iPhone 16 Pro", "Cable USB-C a USB-C trenzado", "Documentación"],
  },
  ip15: {
    colores: [c("Negro", "#35383C"), c("Azul", "#C3D3DC"), c("Verde", "#CFDBC9"), c("Rosa", "#F0D3D5"), c("Amarillo", "#EFE6B4")],
    pantalla: "6.1″ OLED Super Retina XDR, 60 Hz",
    procesador: "Apple A16 Bionic",
    memoria: "6 GB",
    camaras: "48 MP principal + 12 MP ultra gran angular",
    frontal: "12 MP",
    bateria: "Hasta 20 horas de video · carga USB-C",
    sim: "Nano SIM + eSIM",
    caja: ["iPhone 15", "Cable USB-C a USB-C", "Documentación"],
  },
  s24ultra: {
    colores: [c("Titanio Gris", "#96928C"), c("Titanio Negro", "#39383A"), c("Titanio Violeta", "#55516A"), c("Titanio Amarillo", "#E3D4A8")],
    pantalla: "6.8″ Dynamic AMOLED 2X QHD+, 120 Hz",
    procesador: "Snapdragon 8 Gen 3 for Galaxy",
    memoria: "12 GB",
    camaras: "200 MP principal + 12 MP ultra gran angular + 10 MP 3x + 50 MP 5x",
    frontal: "12 MP",
    bateria: "5,000 mAh · carga rápida 45W",
    sim: "Nano SIM + eSIM",
    caja: ["Galaxy S24 Ultra con S Pen", "Cable USB-C", "Extractor de SIM", "Guía rápida"],
  },
  s24plus: {
    colores: [c("Violeta Cobalto", "#5B5470"), c("Amarillo Ámbar", "#EADDB0"), c("Gris Mármol", "#C9C9C7"), c("Negro Ónix", "#2E2F31")],
    pantalla: "6.7″ Dynamic AMOLED 2X QHD+, 120 Hz",
    procesador: "Exynos 2400",
    memoria: "12 GB",
    camaras: "50 MP principal + 12 MP ultra gran angular + 10 MP 3x",
    frontal: "12 MP",
    bateria: "4,900 mAh · carga rápida 45W",
    sim: "Nano SIM + eSIM",
    caja: ["Galaxy S24+", "Cable USB-C", "Extractor de SIM", "Guía rápida"],
  },
  magic7: {
    colores: [c("Gris Lunar", "#8D9096"), c("Azul Brisa", "#B9CDDC"), c("Negro", "#232428")],
    pantalla: "6.8″ OLED LTPO, 120 Hz",
    procesador: "Snapdragon 8 Elite",
    memoria: "12 GB",
    camaras: "50 MP principal + 50 MP ultra gran angular + 200 MP teleobjetivo periscopio",
    frontal: "50 MP",
    bateria: "5,270 mAh (según versión) · 100W con cable y 80W inalámbrica",
    sim: "Dual SIM (nano SIM + eSIM)",
    caja: ["Honor Magic 7 Pro", "Cable USB-C", "Extractor de SIM", "Guía rápida"],
  },
  x14t: {
    colores: [c("Gris Titanio", "#77777A"), c("Azul Titanio", "#7F91A6"), c("Negro Titanio", "#2C2C2E"), c("Verde Limón", "#D9E39A")],
    pantalla: "6.67″ AMOLED 1.5K, 144 Hz",
    procesador: "MediaTek Dimensity 8300-Ultra",
    memoria: "12 GB",
    camaras: "50 MP Leica principal + 50 MP teleobjetivo + 12 MP ultra gran angular",
    frontal: "32 MP",
    bateria: "5,000 mAh · carga rápida 67W",
    sim: "Dual SIM (nano SIM + eSIM)",
    caja: ["Xiaomi 14T", "Cable USB-C", "Funda protectora", "Extractor de SIM", "Guía rápida"],
  },
  rn13: {
    colores: [c("Negro Medianoche", "#26272B"), c("Blanco Luz de Luna", "#E6E9E8"), c("Morado Aurora", "#A894C4")],
    pantalla: "6.67″ AMOLED 1.5K, 120 Hz",
    procesador: "MediaTek Dimensity 7200-Ultra",
    memoria: "12 GB",
    camaras: "200 MP principal + 8 MP ultra gran angular + 2 MP macro",
    frontal: "16 MP",
    bateria: "5,000 mAh · carga rápida 120W",
    sim: "Dual nano SIM",
    caja: ["Redmi Note 13 Pro+ 5G", "Cargador de 120W", "Cable USB-C", "Funda protectora", "Extractor de SIM"],
  },
};
