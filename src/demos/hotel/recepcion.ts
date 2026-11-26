/*
 * Lo que pasa en el chat con recepción. Es una muestra: nada sale del navegador y las
 * respuestas son automáticas, por palabras clave. En un hotel real aquí va su chat en vivo.
 */
import { useEffect, useRef, useState } from "react";
import { CANCELACION, CHECK_IN, CHECK_OUT, HABITACIONES, tarifa } from "./datos";

export type Mensaje = { id: number; de: "huesped" | "posada"; texto: string };

const TARIFAS = HABITACIONES.map((h) => h.tarifa);

/* se prueba en orden: la primera que coincida responde */
const SABE: [RegExp, string][] = [
  [/parqueo|estacion|carro|vehiculo/, "Sí, tenemos parqueo privado dentro de la propiedad y va incluido en la tarifa."],
  [/desayun|comida/, "El desayuno chapín va incluido en todas las habitaciones."],
  [/cancel|reembols|devol/, CANCELACION],
  [/\bhora|check|entrada|salida/, `El check-in es desde las ${CHECK_IN} y el check-out hasta las ${CHECK_OUT}.`],
  [/precio|tarifa|cuanto|costo|vale/, `Nuestras habitaciones van de ${tarifa(Math.min(...TARIFAS))} a ${tarifa(Math.max(...TARIFAS))} por noche, más impuestos.`],
  [/wifi|wi-fi|internet/, "Tenemos Wi-Fi de alta velocidad incluido en toda la casa."],
  [/ubica|direccion|donde|parque/, "Estamos en Antigua Guatemala, a cuatro cuadras del Parque Central."],
];

export function responder(texto: string) {
  const limpio = texto.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  return SABE.find(([clave]) => clave.test(limpio))?.[1] ?? "Gracias por escribirnos. Recepción revisa su mensaje y le responde por aquí.";
}

/* la conversación vive en la página: se conserva aunque se cierre la ventana */
export function useRecepcion() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [pendientes, setPendientes] = useState<string[]>([]);
  const siguiente = useRef(0);

  const agregar = (de: Mensaje["de"], texto: string) => {
    const id = ++siguiente.current;
    setMensajes((m) => [...m, { id, de, texto }]);
  };

  useEffect(() => {
    if (!pendientes.length) return;
    const t = window.setTimeout(() => {
      agregar("posada", pendientes[0]);
      setPendientes((p) => p.slice(1));
    }, 1100);
    return () => window.clearTimeout(t);
  }, [pendientes]);

  return {
    mensajes,
    escribiendo: pendientes.length > 0,
    enviar(texto: string, respuesta = responder(texto)) {
      agregar("huesped", texto);
      setPendientes((p) => [...p, respuesta]);
    },
  };
}
