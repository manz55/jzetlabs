import { MARCA } from "@/data/site";

/*
 * Logo: la J de Joshua con orejas de gato (por su gato naranja) y la curva de
 * abajo que termina en colita. La J toma el color del texto; orejas y colita
 * van en naranja. La colita se mueve una vez al cargar y al pasar el mouse.
 */
export function LogoGato({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 40" className={`logo-gato ${className}`} aria-hidden>
      <path d="M11.5 9.6 L13.6 2.2 L17.6 7.4 Z M18.4 7.4 L22.4 2.2 L24.5 9.6 Z" className="fill-mano" />
      <path
        d="M10.5 10.2 L25.5 10.2 M21 10.2 L21 26.5 C21 33.6 16 36.8 11 35 C7.6 33.7 6.4 30.6 7.8 28.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path className="colita stroke-mano" d="M7.8 28.2 C6.2 26.2 7.2 23.8 9.6 24.3" fill="none" strokeWidth="2.6" strokeLinecap="round" />
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
