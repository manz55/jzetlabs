/*
 * "Qué hago": las líneas de trabajo en un Bento Grid (21st.dev).
 * Solo lo justo para enganchar; los precios completos viven en La tienda.
 * Si cambia un "desde" en La tienda, cámbielo aquí también.
 */
import { Globe, LayoutGrid, MessageSquareText, Smartphone, Sparkles, Wrench } from "lucide-react";
import { WA_DIAGNOSTICO, laTienda } from "@/data/site";
import { BentoGrid, type BentoItem } from "./ui/bento-grid";

const ic = "h-5 w-5";

const ITEMS: BentoItem[] = [
  {
    title: "Páginas web",
    description: "Landing, sitio web o tienda en línea: rápidas, que se ven bien en el celular y llevan directo a su WhatsApp.",
    icon: <Globe className={ic} />,
    status: "Desde Q1,000",
    statusTone: "verde",
    tags: ["Landing", "Sitio web", "Tienda en línea"],
    cta: "Ver paquetes y ejemplos",
    href: "/web",
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Sistemas por rubro",
    description: "Para colegios, clínicas, tiendas, librerías, eventos, gimnasios y empresas.",
    icon: <LayoutGrid className={ic} />,
    status: "Pago único o mensual",
    statusTone: "marino",
    tags: ["Ventas", "Citas", "Planilla"],
    cta: "Ver planes",
    href: laTienda("planes"),
  },
  {
    title: "Apps",
    description: "En el celular, en la compu o en Play Store y App Store.",
    icon: <Smartphone className={ic} />,
    status: "Celular y compu",
    statusTone: "marino",
    cta: "Ver plataformas",
    href: laTienda("plataformas"),
  },
  {
    title: "Ventas y seguimiento",
    description: "Que cada cliente que le escribe quede guardado, con recordatorios y mensajes de WhatsApp.",
    icon: <MessageSquareText className={ic} />,
    status: "Desde Q300 al mes",
    statusTone: "verde",
    cta: "Ver más",
    href: laTienda("ventas"),
  },
  {
    title: "Mantenimiento",
    description: "Cambios, revisiones y todo al día, sin que usted se preocupe.",
    icon: <Wrench className={ic} />,
    status: "Desde Q200 al mes",
    statusTone: "verde",
    cta: "Ver más",
    href: laTienda("mantenimiento"),
  },
  {
    title: "¿No sabe por dónde empezar?",
    description: "Cuénteme qué hace hoy a mano, en Excel o por WhatsApp. En el diagnóstico gratis le digo qué le conviene y cuánto cuesta, por escrito.",
    icon: <Sparkles className={ic} />,
    status: "Diagnóstico gratis",
    statusTone: "verde",
    cta: "Escribirme por WhatsApp",
    href: WA_DIAGNOSTICO,
    colSpan: 3,
  },
];

export function QueHago() {
  return (
    <section id="que-hago" className="py-16 sm:py-24 bg-fondo border-b border-linea" aria-labelledby="quehago-titulo">
      <div className="contenedor">
        <div className="max-w-2xl aparece">
          <p className="etiqueta">Qué hago</p>
          <h2 id="quehago-titulo" className="mt-3 text-[1.75rem] sm:text-[2.2rem]">
            Todo lo digital de su negocio, con una sola persona.
          </h2>
          <p className="mt-3 text-suave">Empiece con una página y crezca hasta un sistema completo, sin cambiar de proveedor.</p>
        </div>
        <div className="mt-10">
          <BentoGrid items={ITEMS} />
        </div>
      </div>
    </section>
  );
}
