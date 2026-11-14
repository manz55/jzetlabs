import { whatsappLink } from "./site";

/*
 * Datos de la página /web (para mandar por DM a clínicas y negocios sin página).
 * Los precios son los mismos de La tienda: si cambian allá, cámbielos aquí también.
 */

export const WA_COTIZAR_WEB = whatsappLink("Hola, Joshua. Vi su página y quiero cotizar una web para mi negocio.");

export const PAQUETES = [
  {
    id: "landing",
    nombre: "Landing Page de Ventas",
    precio: "Q1,000",
    tiempo: "2 a 4 días",
    ideal: "Ideal para convertir seguidores de Instagram en clientes.",
    incluye: [
      "Diseño a la medida, no una plantilla",
      "Versión para celular cuidada al detalle",
      "Botones a WhatsApp con el mensaje listo",
      "Hasta 6 secciones, mapa y formulario de contacto",
    ],
    destacado: false,
  },
  {
    id: "profesional",
    nombre: "Web Profesional + Agenda/Catálogo",
    precio: "Q1,900",
    tiempo: "5 a 8 días",
    ideal: "Ideal para clínicas y negocios en crecimiento.",
    incluye: [
      "Hasta 5 páginas",
      "Catálogo de servicios con precios",
      "Galería de resultados",
      "Mapa de ubicación",
      "Citas y consultas directo a WhatsApp",
      "Perfil de Google y WhatsApp Business listos",
    ],
    destacado: true,
  },
  {
    id: "tienda",
    nombre: "Tienda en Línea / A medida",
    precio: "Q2,800",
    tiempo: "7 a 12 días",
    ideal: "Para negocios que quieren vender en línea o necesitan funciones especiales.",
    incluye: [
      "Catálogo con fotos y precios",
      "Carrito y pedidos que le llegan por WhatsApp",
      "Cobro con tarjeta en línea o funciones especiales: se cotizan según lo que necesite",
    ],
    destacado: false,
  },
] as const;

/*
 * Portafolio: ponga aquí la URL de cada demo (por ejemplo "https://clinica-demo.vercel.app").
 * Mientras quede vacía, el botón dice "Demo muy pronto" y no lleva a ningún lado.
 */
export const DEMOS = [
  { categoria: "Clínica Dental / Estética", titulo: "Citas y servicios claros", url: "", estilo: "clinica" },
  { categoria: "Tienda en Línea", titulo: "Catálogo con pedidos por WhatsApp", url: "", estilo: "tienda" },
  { categoria: "Servicios Profesionales", titulo: "Presencia formal y contacto directo", url: "", estilo: "servicios" },
] as const;
