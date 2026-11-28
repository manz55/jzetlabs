import { SEDE, fechaCorta, hoyIso, type Mascota } from "./datos";
import { ultimasAplicaciones } from "./estado";

const vigentes = (mascota: Mascota) => [...ultimasAplicaciones(mascota).values()].sort((a, b) => a.proxima.localeCompare(b.proxima));

export function resumenCarnet(mascota: Mascota) {
  const peso = mascota.pesos.at(-1);
  return [
    `Carnet de ${mascota.nombre} · Huella Vital`,
    `${mascota.raza} · Responsable: ${mascota.dueno}`,
    ...(peso ? [`Último peso: ${peso.kg} kg (${fechaCorta(peso.fecha)})`] : []),
    "",
    ...vigentes(mascota).map((v) => `• ${v.nombre}: aplicada ${fechaCorta(v.aplicada)}, refuerzo ${fechaCorta(v.proxima)}`),
    "",
    `${SEDE.direccion} · Tel. ${SEDE.telefono}`,
  ].join("\n");
}

export async function descargarCarnet(mascota: Mascota) {
  await document.fonts.ready;
  const filas = vigentes(mascota);
  const ancho = 1080;
  const alto = 560 + filas.length * 96;
  const lienzo = document.createElement("canvas");
  lienzo.width = ancho;
  lienzo.height = alto;
  const c = lienzo.getContext("2d");
  if (!c) return false;

  const escribir = (texto: string, x: number, y: number, tamano: number, peso = 600, color = "#0F172A") => {
    c.font = `${peso} ${tamano}px "Plus Jakarta Sans", sans-serif`;
    c.fillStyle = color;
    c.fillText(texto, x, y);
  };

  c.fillStyle = "#FAFAF9";
  c.fillRect(0, 0, ancho, alto);
  c.fillStyle = "#0F172A";
  c.fillRect(0, 0, ancho, 150);
  escribir("HUELLA VITAL", 64, 82, 44, 800, "#FFFFFF");
  escribir("Carnet de vacunas y desparasitación", 64, 120, 26, 600, "#99F6E4");

  escribir(mascota.nombre, 64, 240, 62, 800);
  escribir(`${mascota.raza} · ${mascota.edad}`, 64, 286, 28, 600, "#475569");
  const peso = mascota.pesos.at(-1);
  escribir(`Responsable: ${mascota.dueno}${peso ? ` · Peso: ${peso.kg} kg` : ""}`, 64, 326, 28, 600, "#475569");

  escribir("Aplicación", 64, 396, 22, 800, "#0F766E");
  escribir("Aplicada", 570, 396, 22, 800, "#0F766E");
  escribir("Refuerzo", 820, 396, 22, 800, "#0F766E");
  filas.forEach((v, i) => {
    const y = 420 + i * 96;
    c.fillStyle = "#E2E8F0";
    c.fillRect(64, y, ancho - 128, 2);
    escribir(v.nombre, 64, y + 46, 28, 800);
    escribir(v.medico, 64, y + 76, 21, 500, "#64748B");
    escribir(fechaCorta(v.aplicada), 570, y + 58, 26);
    escribir(fechaCorta(v.proxima), 820, y + 58, 26, 800);
  });

  escribir(`Emitido el ${fechaCorta(hoyIso())} · Tel. ${SEDE.telefono}`, 64, alto - 78, 24, 600, "#475569");
  escribir(SEDE.direccion, 64, alto - 40, 22, 500, "#64748B");

  const imagen = await new Promise<Blob | null>((listo) => lienzo.toBlob(listo, "image/png"));
  if (!imagen) return false;
  const url = URL.createObjectURL(imagen);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = `carnet-${mascota.nombre.toLowerCase().replace(/\s+/g, "-")}-huella-vital.png`;
  enlace.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
