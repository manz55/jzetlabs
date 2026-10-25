/*
 * Prueba de que es real: cifras de verdad que cuentan desde cero y capturas
 * de mis trabajos pegadas con cinta (la cinta se despega un poco al pasar).
 * Nada inventado: solo lo que existe.
 */
import { CLIENTES } from "@/data/projects";
import { useAlAparecer } from "@/lib/anime";

const CIFRAS = [
  { valor: 4, texto: "proyectos entregados" },
  { valor: 4, texto: "negocios que lo usan hoy" },
  { valor: 30, texto: "días de soporte incluidos" },
];

export function Prueba() {
  const ref = useAlAparecer<HTMLDivElement>(
    (el, a) => {
      el.querySelectorAll<HTMLElement>("[data-cifra]").forEach((n, i) => {
        const fin = Number(n.dataset.cifra);
        const obj = { v: 0 };
        a.animate(obj, {
          v: fin,
          duration: 1400,
          delay: i * 180,
          ease: "outExpo",
          onUpdate: () => (n.textContent = String(Math.round(obj.v))),
        });
      });
      a.animate(el.querySelectorAll(".foto-pegada"), {
        opacity: [0, 1],
        translateY: [30, 0],
        rotate: (t: HTMLElement) => [Number(t.dataset.rot) * 3, Number(t.dataset.rot)],
        duration: 700,
        delay: a.stagger(120, { start: 400 }),
        ease: "outBack",
      });
    },
    {
      umbral: 0.35,
      preparar: (el) => {
        el.querySelectorAll<HTMLElement>("[data-cifra]").forEach((n) => (n.textContent = "0"));
        el.querySelectorAll<HTMLElement>(".foto-pegada").forEach((n) => (n.style.opacity = "0"));
      },
    },
  );

  return (
    <section className="relative px-4 sm:px-6 pb-20">
      <div ref={ref} className="mx-auto max-w-6xl">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 border-y-2 border-ink py-8 sm:py-10">
          {CIFRAS.map((c) => (
            <div key={c.texto} className="text-center">
              <p className="font-display font-extrabold text-[clamp(3rem,10vw,6rem)] leading-none tabular-nums" data-cifra={c.valor}>
                {c.valor}
              </p>
              <p className="mt-2 text-[0.85rem] sm:text-base text-ink-2 leading-tight">{c.texto}</p>
            </div>
          ))}
        </div>

        <p className="hand text-[1.5rem] text-ink-2 mt-10 text-center">y estos son, pegados en mi pared:</p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-7 px-2">
          {CLIENTES.map((p, i) => {
            const rot = [-3, 2.5, -1.5, 3][i % 4];
            return (
              <figure key={p.id} className="foto-pegada group relative" data-rot={rot} style={{ transform: `rotate(${rot}deg)` }}>
                <span className="tape cinta -top-3 left-1/2 -translate-x-1/2" aria-hidden />
                <div className="bg-card border-2 border-ink p-1.5 shadow-[4px_4px_0_var(--color-ink)]">
                  <img src={p.desk} alt={`Captura de ${p.name}`} loading="lazy" className="block w-full aspect-[16/10] object-cover object-top border border-ink/40" />
                </div>
                <figcaption className="hand text-[1.25rem] mt-1.5 text-center leading-tight">
                  {p.name} <span className="text-ink-3 text-[1rem]">· {p.status.toLowerCase()}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
