/*
 * La palabra que rota en el título de la portada ("su colegio.", "su clínica."...).
 * anime.js: las letras salen hacia arriba y las nuevas entran desde abajo, en cascada.
 * Los lectores de pantalla leen "su negocio." una sola vez.
 */
import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";

const PALABRAS = ["su colegio.", "su clínica.", "su tienda.", "su librería.", "su kermés.", "su gimnasio.", "su empresa."];

export function RubroRotando() {
  const [i, setI] = useState(0);
  const caja = useRef<HTMLSpanElement>(null);
  const primera = useRef(true);

  // cada 2.6 s: sacar las letras y cambiar de palabra
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      const letras = caja.current?.querySelectorAll(".letra");
      if (!letras?.length) return;
      animate(letras, {
        translateY: ["0%", "-110%"],
        opacity: [1, 0],
        duration: 320,
        delay: stagger(18),
        ease: "inQuad",
        onComplete: () => setI((n) => (n + 1) % PALABRAS.length),
      });
    }, 2600);
    return () => window.clearInterval(t);
  }, []);

  // al cambiar de palabra: las letras nuevas entran desde abajo
  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      return;
    }
    const letras = caja.current?.querySelectorAll(".letra");
    if (letras?.length) {
      animate(letras, { translateY: ["110%", "0%"], opacity: [0, 1], duration: 420, delay: stagger(22), ease: "outCubic" });
    }
  }, [i]);

  return (
    <>
      <span className="sr-only">su negocio.</span>
      <span ref={caja} aria-hidden className="relative block w-fit text-acento">
        <span className="block overflow-hidden pb-[0.08em]">
          {Array.from(PALABRAS[i]).map((c, k) => (
            <span key={`${i}-${k}`} className="letra inline-block whitespace-pre">
              {c}
            </span>
          ))}
        </span>
        <svg className="trazo absolute left-0 -bottom-1 w-full h-3" viewBox="0 0 200 12" preserveAspectRatio="none">
          <path d="M3 8c40-5 90-7 194-3" fill="none" stroke="#1a7f4e" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </span>
    </>
  );
}
