/*
 * El sticker de los lentes de Josh (mismo dibujo que La tienda).
 * Con `dibujar`, el armazón se traza solo cuando aparece en pantalla.
 */
import { useId } from "react";
import { useAlAparecer } from "@/lib/anime";

const MICA_IZQ = "M12 14C24 10 46 10 55 14C58 17 57 22 54 30C50 42 44 50 34 50C20 50 9 40 8 26C7.5 19 9 15.5 12 14Z";
const MICA_DER = "M112 14C100 10 78 10 69 14C66 17 67 22 70 30C74 42 80 50 90 50C104 50 115 40 116 26C116.5 19 115 15.5 112 14Z";

export function Gafas({ className = "", dibujar = false }: { className?: string; dibujar?: boolean }) {
  const id = useId().replace(/:/g, "");

  const ref = useAlAparecer<SVGSVGElement>(
    (el, a) => {
      if (!dibujar) return;
      const lineas = a.svg.createDrawable(el.querySelectorAll(".armazon path"));
      a.animate(lineas, { draw: ["0 0", "0 1"], duration: 1100, delay: a.stagger(180), ease: "inOutQuad" });
      a.animate(el.querySelectorAll(".relleno"), { opacity: [0, 1], duration: 500, delay: 900 });
    },
    {
      umbral: 0.6,
      preparar: (el) => {
        if (!dibujar) return;
        el.querySelectorAll<SVGElement>(".relleno").forEach((n) => (n.style.opacity = "0"));
      },
    },
  );

  return (
    <svg ref={ref} viewBox="0 0 124 60" className={className} aria-hidden>
      <defs>
        <filter id={`sombra-${id}`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#2a2318" floodOpacity=".28" />
        </filter>
      </defs>
      <g className="relleno" filter={`url(#sombra-${id})`}>
        <g fill="#fff" stroke="#fff" strokeWidth="11" strokeLinejoin="round" strokeLinecap="round">
          <path d={MICA_IZQ} />
          <path d={MICA_DER} />
          <path d="M50 12C56 9.6 68 9.6 74 12M3 15L12 14M121 15L112 14" />
        </g>
      </g>
      <g className="relleno">
        <path d={MICA_IZQ} fill="#dcebf2" fillOpacity=".55" />
        <path d={MICA_DER} fill="#dcebf2" fillOpacity=".55" />
        <path d="M15 22C20 18 28 17 34 17.5M74 21C79 17.5 87 16.8 93 17.3" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity=".9" />
      </g>
      <g className="armazon" fill="none" stroke="#151513" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <path d={MICA_IZQ} />
        <path d={MICA_DER} />
        <path d="M50 12C56 9.6 68 9.6 74 12" />
        <path d="M55 18Q62 14.5 69 18" />
        <path d="M3 15L12 14M121 15L112 14" />
      </g>
      <g className="relleno">
        <circle cx="56" cy="31" r="1.6" fill="#cfe3ea" stroke="#9fb4bb" strokeWidth=".6" />
        <circle cx="68" cy="31" r="1.6" fill="#cfe3ea" stroke="#9fb4bb" strokeWidth=".6" />
      </g>
    </svg>
  );
}
