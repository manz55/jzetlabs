import { useEffect } from "react";
import { Encabezado, Llamado, Pie } from "@/components/Secciones";
import { ComoTrabajo, Trabajos } from "@/components/Vitrina";
import { PortadaFotos } from "@/components/PortadaFotos";
import { QueHago } from "@/components/QueHago";
import { Rubros } from "@/components/Rubros";
import { activarAparecer } from "@/lib/aparecer";

/*
 * Home = vitrina: quién soy, trabajos reales y qué hago. Precios completos en La tienda.
 * Portada → Trabajos reales → Qué hago → Véalo funcionando → Cómo trabajo → Llamado.
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
        <PortadaFotos />
        <Trabajos />
        <QueHago />
        <Rubros />
        <ComoTrabajo />
        <Llamado />
      </main>
      <Pie />
    </>
  );
}
