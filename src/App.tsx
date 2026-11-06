import { useEffect } from "react";
import { Caso, Encabezado, Llamado, Pie, PorQue, Portada } from "@/components/Secciones";
import { QueHago } from "@/components/QueHago";
import { Rubros } from "@/components/Rubros";
import { activarAparecer } from "@/lib/aparecer";

/*
 * Landing = quién soy y qué hago. Los precios completos viven en La tienda.
 * Portada → Qué hago → Véalo funcionando → EFAMIC → Por qué conmigo → Llamado.
 */
export default function App() {
  useEffect(() => activarAparecer(), []);

  return (
    <>
      <a href="#inicio" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded">
        Ir al contenido
      </a>
      <Encabezado />
      <main>
        <Portada />
        <QueHago />
        <Rubros />
        <Caso />
        <PorQue />
        <Llamado />
      </main>
      <Pie />
    </>
  );
}
