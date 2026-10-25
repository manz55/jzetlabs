import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Prueba } from "@/components/Prueba";
import { Taller } from "@/components/Taller";
import { Ficha } from "@/components/Ficha";
import { Proceso } from "@/components/Proceso";
import { Confianza } from "@/components/Confianza";
import { Precios } from "@/components/Precios";
import { Mercado } from "@/components/Mercado";
import { Preguntas } from "@/components/Preguntas";
import { Cierre } from "@/components/Cierre";

export default function App() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      <Nav />
      <main>
        <Hero onOpen={setOpenId} />
        <Prueba />
        <Taller onOpen={setOpenId} />
        <Proceso />
        <Confianza />
        <Precios />
        <Mercado />
        <Preguntas />
      </main>
      <Cierre />
      <Ficha projectId={openId} onClose={() => setOpenId(null)} onChange={setOpenId} />
    </>
  );
}
