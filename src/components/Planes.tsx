/*
 * Planes: Propio · Control · Integral, con las tres frases rotando
 * (cambio suave cada 4 s; quieto si se pidió reducir movimiento).
 */
import { useEffect, useState } from "react";
import { FRASES, NOTA_USUARIOS, PLANES } from "@/data/planes";
import { laTienda, whatsappLink } from "@/data/site";

function FraseRotando() {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let espera: number | undefined;
    const ciclo = window.setInterval(() => {
      setVisible(false);
      espera = window.setTimeout(() => {
        setI((n) => (n + 1) % FRASES.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => {
      window.clearInterval(ciclo);
      window.clearTimeout(espera);
    };
  }, []);

  return (
    <p className="mt-3 min-h-[1.6em] text-[1.15rem] font-semibold text-acento" aria-live="polite">
      <span className="inline-block transition-opacity duration-400" style={{ opacity: visible ? 1 : 0 }}>
        {FRASES[i]}
      </span>
    </p>
  );
}

export function Planes() {
  return (
    <section id="planes" className="py-16 sm:py-24 bg-fondo border-y border-linea" aria-labelledby="planes-titulo">
      <div className="contenedor">
        <div className="max-w-2xl aparece">
          <p className="etiqueta">Planes</p>
          <h2 id="planes-titulo" className="mt-3 text-[1.75rem] sm:text-[2.2rem]">
            Tres formas de tener su sistema.
          </h2>
          <FraseRotando />
          <p className="mt-2 text-suave">Pague una sola vez o cada mes. En el diagnóstico gratis vemos cuál le queda mejor.</p>
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-6 items-start">
          {PLANES.map((p) => (
            <article
              key={p.nombre}
              className={`relative flex flex-col rounded-xl bg-white p-7 aparece ${p.destacado ? "border-2 border-marino" : "border border-linea"}`}
            >
              {p.destacado && (
                <span className="absolute -top-3 left-6 rounded bg-marino px-2 py-0.5 text-xs font-semibold text-white">El más completo</span>
              )}
              <h3 className="text-[1.45rem]">{p.nombre}</h3>
              <p className="mt-1.5 text-suave">{p.para}</p>
              <p className="mt-5 text-[2.1rem] font-bold leading-none text-marino">
                {p.monto} <span className="text-base font-medium text-suave">{p.periodo}</span>
              </p>
              <p className="mt-2 text-[0.92rem] text-suave">{p.nota}</p>
              <ul className="mt-5 space-y-2 border-t border-linea pt-4">
                {p.incluye.map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <span aria-hidden className="mt-[0.45em] h-2 w-3.5 shrink-0 -rotate-45 border-b-2 border-l-2 border-acento" />
                    {x}
                  </li>
                ))}
              </ul>
              <a
                href={whatsappLink(`Hola, Joshua. Me interesa el plan ${p.nombre} para mi empresa.`)}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn mt-6 w-full ${p.destacado ? "btn-principal" : "btn-secundario"}`}
              >
                Consultar {p.nombre}
              </a>
            </article>
          ))}
        </div>

        <p className="mt-8 text-suave aparece">
          {NOTA_USUARIOS} Todos los planes se facturan (FEL). Si paga Control o Integral por año, le regalo 2 meses.{" "}
          <a href={laTienda("planes")} className="font-semibold text-marino underline underline-offset-4 hover:text-acento">
            Ver la comparación completa
          </a>
        </p>
      </div>
    </section>
  );
}
