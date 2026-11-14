/*
 * "Qué hago": las líneas de trabajo en un Bento Grid (21st.dev).
 * Solo lo justo para enganchar; los precios completos viven en La tienda.
 * Si cambia un "desde" en La tienda, cámbielo aquí también.
 */
import { ArrowUpRight, Globe, LayoutGrid, MessageSquareText, Smartphone, Sparkles, Wrench } from "lucide-react";
import { WA_DIAGNOSTICO, laTienda } from "@/data/site";
import { type BentoItem } from "./ui/bento-grid";
import { Titulo } from "./Titulo";

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
  const filas = ITEMS.slice(0, -1);
  const ultimo = ITEMS[ITEMS.length - 1];
  return (
    <section id="que-hago" className="py-20 sm:py-28 bg-crema scroll-mt-16" aria-labelledby="quehago-titulo">
      <div className="contenedor">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:items-end aparece">
          <Titulo id="quehago-titulo" antes="Lo que" acento="hago" cuenta={filas.length} />
          <p className="text-suave text-[1.05rem] max-w-md lg:justify-self-end">
            Todo lo digital de su negocio, con una sola persona. Empiece con una página y crezca hasta un sistema completo, sin cambiar de proveedor.
          </p>
        </div>

        <ul className="mt-14 border-b border-tinta/15">
          {filas.map((it, i) => {
            const externo = it.href?.startsWith("http");
            return (
              <li key={it.title} className="border-t border-tinta/15">
                <a
                  href={it.href}
                  {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-8 py-6 sm:py-8 hover:bg-blanco/70 transition-colors -mx-3 px-3 rounded-xl"
                >
                  <span className="self-start pt-2 text-sm text-suave tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-[family-name:var(--font-titulo)] font-bold text-tinta text-[1.6rem] sm:text-[2.3rem] leading-tight tracking-[-0.02em]">
                      {it.title}
                    </span>
                    <span className="mt-1.5 block text-suave max-w-2xl">{it.description}</span>
                    <span className="mt-2 inline-block text-sm font-semibold text-acento sm:hidden">{it.status}</span>
                  </span>
                  <span className="flex items-center gap-5">
                    <span className="hidden sm:block text-right text-[0.95rem] font-semibold text-acento whitespace-nowrap">{it.status}</span>
                    <span className="grid place-items-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-tinta/20 text-tinta group-hover:bg-acento group-hover:border-acento group-hover:text-white transition-colors">
                      <ArrowUpRight size={20} className="transition-transform group-hover:rotate-45" />
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-texto aparece">
          <b className="text-tinta">{ultimo.title}</b> {ultimo.description}{" "}
          <a href={ultimo.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-acento underline underline-offset-4">
            {ultimo.cta}
          </a>
        </p>
      </div>
    </section>
  );
}
