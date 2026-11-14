/*
 * "Lo que hago": filas grandes; cada una abre una ventana con lo que incluye,
 * precios "desde", ejemplos reales y un botón para cotizar por WhatsApp.
 * Los precios son los mismos de La tienda: si cambian allá, cámbielos aquí.
 */
import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { laTienda } from "@/data/site";
import { Titulo } from "./Titulo";
import { Modal } from "./Modal";
import { abrirChat } from "./ChatWhatsApp";
import { IconoWhatsApp } from "./Secciones";

type Servicio = {
  titulo: string;
  resumen: string;
  estado: string;
  intro: string;
  precios: { nombre: string; precio: string; nota?: string }[];
  incluye: string[];
  ejemplos?: string;
  mensaje: string;
  link: { texto: string; href: string };
};

const SERVICIOS: Servicio[] = [
  {
    titulo: "Páginas web",
    resumen: "Landing, sitio web o tienda en línea: rápidas, que se ven bien en el celular y llevan directo a su WhatsApp.",
    estado: "Desde Q1,000",
    intro: "Para que sus clientes lo encuentren, vean sus servicios y precios, y le escriban directo.",
    precios: [
      { nombre: "Landing", precio: "desde Q1,000", nota: "2 a 4 días" },
      { nombre: "Sitio web", precio: "desde Q1,900", nota: "5 a 8 días" },
      { nombre: "Tienda en línea", precio: "desde Q2,800", nota: "7 a 12 días" },
    ],
    incluye: ["Diseño a la medida, no una plantilla", "Hecha primero para el celular", "Botones a WhatsApp con el mensaje listo", "El dominio queda a su nombre"],
    ejemplos: "Así quedaron Plomería Danny y GomiDeli.",
    mensaje: "Hola, Joshua. Me interesa una página web para mi negocio.",
    link: { texto: "Ver paquetes y ejemplos", href: "/web" },
  },
  {
    titulo: "Sistemas por rubro",
    resumen: "Para colegios, clínicas, tiendas, librerías, eventos, gimnasios y empresas.",
    estado: "Pago único o mensual",
    intro: "Lo que hoy lleva en papel, Excel o WhatsApp, en un solo lugar: personal y planilla, citas, ventas, inventario, cobros.",
    precios: [
      { nombre: "Pago único", precio: "desde Q2,000", nota: "1 usuario + Q50 por usuario" },
      { nombre: "Básico", precio: "Q295/mes", nota: "hasta 5 usuarios" },
      { nombre: "Control", precio: "Q495/mes", nota: "hasta 15 usuarios" },
      { nombre: "Integral", precio: "Q1,450/mes", nota: "hasta 50 usuarios" },
    ],
    incluye: ["Hecho a la medida de cómo trabaja", "Funciona en celular, tablet y compu", "Le enseño a usted y a su equipo a usarlo", "Sus datos se pueden sacar en Excel o PDF"],
    ejemplos: "En uso hoy: EFAMIC (planilla) y Maestros de Niños (iglesia).",
    mensaje: "Hola, Joshua. Quiero un sistema para mi negocio. Hoy hago a mano: ",
    link: { texto: "Ver todos los planes", href: laTienda("planes") },
  },
  {
    titulo: "Apps",
    resumen: "En el celular, en la compu o en Play Store y App Store.",
    estado: "Celular y compu",
    intro: "Su sistema o su página también como app, para abrirla con un toque.",
    precios: [
      { nombre: "Web en celular, tablet y compu", precio: "incluida" },
      { nombre: "App instalable desde el navegador", precio: "incluida" },
      { nombre: "Programa para la compu", precio: "desde Q1,500" },
      { nombre: "App en Play Store o App Store", precio: "desde Q2,500", nota: "por tienda" },
    ],
    incluye: ["La cuenta de desarrollador queda a su nombre", "Google cobra US$25 una vez; Apple, US$99 al año"],
    mensaje: "Hola, Joshua. Me interesa una app para mi negocio.",
    link: { texto: "Ver plataformas", href: laTienda("plataformas") },
  },
  {
    titulo: "Ventas y seguimiento",
    resumen: "Que cada cliente que le escribe quede guardado, con recordatorios y mensajes de WhatsApp.",
    estado: "Desde Q300 al mes",
    intro: "Para que ningún cliente se le pierda entre los mensajes.",
    precios: [{ nombre: "Ventas y seguimiento", precio: "desde Q300/mes" }],
    incluye: ["Cada cliente guardado con su historial", "Recordatorios para darle seguimiento", "Mensajes de WhatsApp listos para enviar"],
    mensaje: "Hola, Joshua. Me interesa llevar mejor el seguimiento de mis clientes.",
    link: { texto: "Ver más", href: laTienda("ventas") },
  },
  {
    titulo: "Mantenimiento",
    resumen: "Cambios, revisiones y todo al día, sin que usted se preocupe.",
    estado: "Desde Q200 al mes",
    intro: "Para que su página o sistema siga al día sin que usted tenga que estar pendiente.",
    precios: [
      { nombre: "Plan de cambios", precio: "Q200/mes" },
      { nombre: "Cuidado total", precio: "Q350/mes" },
    ],
    incluye: ["Cambios de textos, fotos y precios", "Revisiones para que todo funcione", "Me escribe y yo me encargo"],
    mensaje: "Hola, Joshua. Me interesa el mantenimiento para mi página o sistema.",
    link: { texto: "Ver más", href: laTienda("mantenimiento") },
  },
];

export function QueHago() {
  const [abierto, setAbierto] = useState<Servicio | null>(null);

  return (
    <section id="que-hago" className="py-20 sm:py-28 bg-crema scroll-mt-16" aria-labelledby="quehago-titulo">
      <div className="contenedor">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:items-end aparece">
          <Titulo id="quehago-titulo" antes="Lo que" acento="hago" cuenta={SERVICIOS.length} />
          <p className="text-suave text-[1.05rem] max-w-md lg:justify-self-end">
            Todo lo digital de su negocio, con una sola persona. Toque cada uno para ver qué incluye y cuánto cuesta.
          </p>
        </div>

        <ul className="mt-14 border-b border-tinta/15">
          {SERVICIOS.map((it, i) => (
            <li key={it.titulo} className="border-t border-tinta/15">
              <button
                type="button"
                onClick={() => setAbierto(it)}
                aria-haspopup="dialog"
                className="group w-full text-left grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-8 py-6 sm:py-8 -mx-3 px-3 rounded-xl hover:bg-blanco/70 active:scale-[0.99] active:bg-blanco transition"
              >
                <span className="self-start pt-2 text-sm text-suave tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-[family-name:var(--font-titulo)] font-bold text-tinta text-[1.6rem] sm:text-[2.3rem] leading-tight tracking-[-0.02em] transition-transform group-hover:translate-x-1">
                    {it.titulo}
                  </span>
                  <span className="mt-1.5 block text-suave max-w-2xl">{it.resumen}</span>
                  <span className="mt-2 inline-block text-sm font-semibold text-acento sm:hidden">{it.estado}</span>
                </span>
                <span className="flex items-center gap-5">
                  <span className="hidden sm:block text-right text-[0.95rem] font-semibold text-acento whitespace-nowrap">{it.estado}</span>
                  <span className="grid place-items-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-tinta/20 text-tinta group-hover:bg-acento group-hover:border-acento group-hover:text-white transition-colors">
                    <ArrowUpRight size={20} className="transition-transform group-hover:rotate-45" />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-texto aparece">
          <b className="text-tinta">¿No sabe por dónde empezar?</b> Cuénteme qué hace hoy a mano, en Excel o por WhatsApp, y le digo qué le conviene y cuánto cuesta, por escrito.{" "}
          <button type="button" onClick={() => abrirChat()} className="font-semibold text-acento underline underline-offset-4">
            Escribirme por WhatsApp
          </button>
        </p>
      </div>

      <Modal abierto={!!abierto} alCerrar={() => setAbierto(null)} titulo={abierto?.titulo ?? "Detalle"}>
        {abierto && (
          <div className="px-6 sm:px-8 pt-5 sm:pt-8 pb-7">
            <p className="etiqueta">Lo que hago</p>
            <h3 className="mt-2 pr-10 text-[1.9rem] sm:text-[2.3rem] leading-tight">{abierto.titulo}</h3>
            <p className="mt-3 text-texto">{abierto.intro}</p>

            <ul className="mt-6 divide-y divide-linea rounded-2xl border border-linea bg-crema">
              {abierto.precios.map((p) => (
                <li key={p.nombre} className="flex items-baseline justify-between gap-4 px-4 py-3">
                  <span>
                    <span className="text-tinta font-medium">{p.nombre}</span>
                    {p.nota && <span className="block text-sm text-suave">{p.nota}</span>}
                  </span>
                  <span className="shrink-0 font-[family-name:var(--font-titulo)] font-bold text-acento text-[1.1rem]">{p.precio}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-6 space-y-2.5">
              {abierto.incluye.map((x) => (
                <li key={x} className="flex gap-2.5">
                  <Check size={18} className="mt-0.5 shrink-0 text-acento" strokeWidth={2.5} />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            {abierto.ejemplos && <p className="mt-5 nota-mano text-mano text-[1.35rem]">{abierto.ejemplos}</p>}

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  const m = abierto.mensaje;
                  setAbierto(null);
                  abrirChat(m);
                }}
                className="btn btn-principal !rounded-full"
              >
                <IconoWhatsApp /> Cotizar por WhatsApp
              </button>
              <a href={abierto.link.href} className="btn btn-secundario !rounded-full">
                {abierto.link.texto}
              </a>
            </div>
            <p className="mt-4 text-xs text-suave">Precios "desde": más alcance es más tiempo y más costo. Precios más 5% de factura.</p>
          </div>
        )}
      </Modal>
    </section>
  );
}
