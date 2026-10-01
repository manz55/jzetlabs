/*
 * Precios públicos de agencias en Guatemala, tomados de sus propias páginas
 * (consultados el 1 de octubre de 2026). Si alguno cambia, se actualiza aquí.
 *
 * first   = lo que pagas el primer año
 * perYear = lo que vuelve a cobrarse cada año desde el segundo (0 si no publican)
 */
import { DOMAIN_PRICE, DOMAIN_RENEWAL, KINDS, type KindId } from "./pricing";

export interface Offer {
  who: string;
  plan: string;
  first: number;
  perYear: number;
  note: string;
  url: string;
  /** precio "desde": el real suele ser más alto */
  from?: boolean;
}

export const MARKET_CHECKED = "1 de octubre de 2026";

export const MARKET: Record<KindId, Offer[]> = {
  landing: [
    {
      who: "Trazo",
      plan: "Despegue (landing)",
      first: 1800,
      perYear: 600,
      note: "+Q600 cada año de dominio y hosting",
      url: "https://trazo.gt/",
    },
    {
      who: "Páginas Web Guatemala",
      plan: "Página corporativa",
      first: 1500,
      perYear: 1500,
      note: "se paga cada año",
      url: "https://paginaswebguatemala.net/precios/",
    },
    {
      who: "Digital 11",
      plan: "Paquete web anual",
      first: 2890,
      perYear: 2890,
      note: "se paga cada año",
      url: "https://www.digital11.pro/paginas-web/",
    },
    {
      who: "Estoria",
      plan: "Landing page",
      first: 3000,
      perYear: 0,
      note: "precio de su guía 2026",
      url: "https://estoria.gt/cuanto-cuesta-una-pagina-web-en-guatemala/",
    },
    {
      who: "Grupo Intersat",
      plan: "Sitio web",
      first: 3900,
      perYear: 690,
      note: "desde, +Q690 cada año",
      url: "https://grupointersat.com/creacion-de-paginas-web-en-guatemala/",
      from: true,
    },
  ],
  tienda: [
    {
      who: "Páginas Web Guatemala",
      plan: "Tienda en línea",
      first: 2500,
      perYear: 2500,
      note: "cada año, hasta 25 productos",
      url: "https://paginaswebguatemala.net/precios/",
    },
    {
      who: "Blue Páginas Web",
      plan: "Sitio eCommerce",
      first: 5000,
      perYear: 5000,
      note: "se paga cada año",
      url: "https://bluepaginasweb.com/precios",
    },
    {
      who: "Trazo",
      plan: "Vuelo + tienda",
      first: 8000,
      perYear: 600,
      note: "Q4,500 + Q3,500 de tienda, +Q600/año",
      url: "https://trazo.gt/",
    },
    {
      who: "Estoria",
      plan: "Tienda en línea",
      first: 9000,
      perYear: 0,
      note: "desde, según su guía 2026",
      url: "https://estoria.gt/cuanto-cuesta-una-pagina-web-en-guatemala/",
      from: true,
    },
  ],
  sistema: [
    {
      who: "Estoria",
      plan: "Sistema de reservas",
      first: 7000,
      perYear: 0,
      note: "desde, según su guía 2026",
      url: "https://estoria.gt/cuanto-cuesta-una-pagina-web-en-guatemala/",
      from: true,
    },
    {
      who: "Estoria",
      plan: "Aplicación web",
      first: 12000,
      perYear: 0,
      note: "desde Q12,000 hasta Q30,000",
      url: "https://estoria.gt/cuanto-cuesta-una-pagina-web-en-guatemala/",
      from: true,
    },
  ],
};

export function totalFor(o: { first: number; perYear: number }, years: number) {
  return o.first + o.perYear * (years - 1);
}

export function myOffer(kind: KindId) {
  const k = KINDS.find((x) => x.id === kind)!;
  return { first: k.base + DOMAIN_PRICE, perYear: DOMAIN_RENEWAL };
}
