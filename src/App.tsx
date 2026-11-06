import { useEffect } from "react";
import { Caso, Encabezado, Llamado, Pie, PorQue, Portada } from "@/components/Secciones";
import { Planes } from "@/components/Planes";
import { Rubros } from "@/components/Rubros";
import { Centro } from "@/components/Centro";
import { Plataformas } from "@/components/Plataformas";
import { Preguntas, Proceso } from "@/components/Proceso";
import { activarAparecer } from "@/lib/aparecer";

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
        <Centro />
        <Plataformas />
        <Rubros />
        <Caso />
        <Planes />
        <PorQue />
        <Proceso />
        <Preguntas />
        <Llamado />
      </main>
      <Pie />
    </>
  );
}
