/* Clases y letras de Casa Imperial. Marfil #FAF8F5, piedra #F3EFEA, carbón #1C1917, bronce #A16207. */
import type { CSSProperties } from "react";
import { CupSoda, Flame, UtensilsCrossed } from "lucide-react";

export const ICONO_PUESTO = { Parrilla: Flame, Antojitos: UtensilsCrossed, Bebidas: CupSoda };

export const LETRAS = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";

/* variables que usan los estilos base del sitio (títulos y contorno de foco) */
export const TEMA = {
  "--ci-serif": '"Playfair Display", Georgia, serif',
  "--font-titulo": '"Playfair Display", Georgia, serif',
  "--color-tinta": "#1C1917",
  "--color-acento": "#A16207",
  fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  fontVariantNumeric: "lining-nums tabular-nums",
} as CSSProperties;

const base = "inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border px-5 py-2 text-center text-sm font-bold leading-tight transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45";

export const boton = {
  bronce: `${base} border-transparent bg-[#A16207] text-white hover:bg-[#854D0E]`,
  oscuro: `${base} border-transparent bg-[#1C1917] text-white hover:bg-[#38332F]`,
  linea: `${base} border-[#CFC6BA] bg-white text-[#1C1917] hover:border-[#1C1917]`,
};

export const ancho = "mx-auto w-full max-w-7xl px-5 sm:px-8";
export const tarjeta = "min-w-0 rounded-2xl border border-[#E4DDD3] bg-white";
export const campo = "h-12 w-full min-w-0 rounded-lg border border-[#CFC6BA] bg-white px-3 text-base text-[#1C1917]";
export const rotulo = "mb-2 block text-sm font-bold text-[#1C1917]";
/* botón de filtro o pestaña */
export const pastilla = (activa: boolean) =>
  `inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-bold leading-tight transition ${activa ? "border-[#1C1917] bg-[#1C1917] text-white" : "border-[#D6CDC1] bg-white text-[#44403C] hover:border-[#1C1917]"}`;
