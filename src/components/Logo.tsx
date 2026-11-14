import { MARCA } from "@/data/site";

/*
 * Logo: la J de Joshua con orejas de gato (por su gato naranja) y la curva de
 * abajo que termina en colita. La J toma el color del texto; orejas y colita
 * van en naranja. La colita se mueve una vez al cargar y al pasar el mouse.
 */
export function LogoGato({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 40" className={`logo-gato ${className}`} aria-hidden>
      <path className="colita stroke-mano" d="M7.8 28.2 C8.9 26.3 9.2 23.2 7.2 21.9 C5.5 20.8 3.6 22 4.2 23.9" fill="none" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.6 10.2 L13.9 2.6 L17.4 10.2 Z M18.6 10.2 L22.1 2.6 L24.4 10.2 Z" className="fill-mano stroke-mano" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M10.5 10.2 L25.5 10.2" fill="none" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M21 10.2 L21 26.5 C21 33.6 16 36.8 11 35 C7.6 33.7 6.4 30.6 7.8 28.2" fill="none" stroke="currentColor" strokeWidth="4.2" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ claro = false, href = "#inicio" }: { claro?: boolean; href?: string }) {
  return (
    <a href={href} className="group inline-flex items-center gap-2 no-underline" aria-label={`${MARCA}, inicio`}>
      <LogoGato className={`w-8 h-9 ${claro ? "text-white" : "text-marino oscuro:text-tinta"}`} />
      <span className={`font-[family-name:var(--font-titulo)] font-bold text-[1.2rem] tracking-[-0.02em] ${claro ? "text-white" : "text-marino oscuro:text-tinta"}`}>{MARCA}</span>
    </a>
  );
}
