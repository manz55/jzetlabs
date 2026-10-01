import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Taller } from "@/components/Taller";
import { ProjectStage } from "@/components/ProjectStage";
import { Cotizador } from "@/components/Cotizador";
import { Comparar } from "@/components/Comparar";
import { Mercado } from "@/components/Mercado";
import { Proceso } from "@/components/Proceso";
import { Preguntas } from "@/components/Preguntas";
import { Contacto } from "@/components/Contacto";

export default function App() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      <Nav />
      <main>
        <Hero onOpen={setOpenId} />
        <Taller onOpen={setOpenId} />
        <Cotizador />
        <Mercado onOpen={setOpenId} />
        <Comparar />
        <Proceso />
        <Preguntas />
      </main>
      <Contacto />
      <ProjectStage projectId={openId} onClose={() => setOpenId(null)} onChange={setOpenId} />
    </>
  );
}
