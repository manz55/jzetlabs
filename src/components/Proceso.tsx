/*
 * Cómo trabajo (detrás de cámaras): línea de tiempo que se dibuja con el
 * scroll (anime.js onScroll) y una "foto de proceso" en cada paso.
 */
import { useEffect, useRef } from "react";
import gomideliDesk from "@/assets/portfolio/gomideli-desk.jpg";
import gomideliMob from "@/assets/portfolio/gomideli-mob.jpg";
import { anime } from "@/lib/anime";

/* foto 1: nota de la plática */
function FotoPlatica() {
  return (
    <div className="relative bg-[#fffdf3] border-2 border-ink p-4 shadow-[4px_4px_0_var(--color-ink)] rotate-[-2deg]" style={{ backgroundImage: "repeating-linear-gradient(#fffdf3 0 24px, #c9d4f2 24px 25px)" }}>
      <span className="tape -top-3 left-6 rotate-[-5deg]" aria-hidden />
      <p className="hand text-[1.35rem] leading-[25px]">Lo que me contaste:</p>
      <ul className="hand text-[1.15rem] leading-[25px] text-ink-2">
        <li>— vendes por WhatsApp</li>
        <li>— se pierden pedidos</li>
        <li>— quieres cambiar precios tú</li>
      </ul>
      <p className="hand text-[1.15rem] leading-[25px] text-tomato">→ tienda + panel ✓</p>
    </div>
  );
}

/* foto 2: boceto a mano */
function FotoBoceto() {
  return (
    <div className="relative bg-card border-2 border-ink p-3 shadow-[4px_4px_0_var(--color-ink)] rotate-[1.5deg]">
      <span className="tape -top-3 right-6 rotate-[4deg]" aria-hidden />
      <svg viewBox="0 0 220 140" className="w-full h-auto text-ink" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-label="Boceto de la página">
        <path d="M8 10 H212 V132 H8 Z" />
        <path d="M8 28 H212" />
        <path d="M16 19 h30 M150 19 h20 M178 19 h26" strokeWidth="3" />
        <path d="M18 44 h90 M18 56 h70" strokeWidth="5" />
        <path d="M18 70 h80 M18 78 h60" opacity=".5" />
        <rect x="18" y="90" width="44" height="14" rx="4" />
        <rect x="130" y="40" width="70" height="64" rx="6" />
        <path d="M140 92 l14 -18 l12 12 l8 -8 l16 14" />
        <circle cx="180" cy="56" r="6" />
        <path d="M18 116 h40 M70 116 h40 M122 116 h40" opacity=".5" />
      </svg>
      <p className="hand text-[1.1rem] text-ink-2 text-center">el boceto, antes de programar</p>
    </div>
  );
}

/* foto 3: mensaje de avance */
function FotoAvance() {
  return (
    <div className="relative bg-[#e9e2d5] border-2 border-ink p-3 shadow-[4px_4px_0_var(--color-ink)] rotate-[-1deg]">
      <div className="relative overflow-hidden rounded-lg border border-ink/30 aspect-[16/9]">
        <img src={gomideliDesk} alt="" className="w-full h-full object-cover object-top" loading="lazy" />
        {/* lo que falta, todavía en gris */}
        <div className="absolute inset-y-0 right-0 w-[45%] bg-paper/85" style={{ backgroundImage: "repeating-linear-gradient(-45deg, transparent 0 8px, rgba(23,22,28,.06) 8px 16px)" }}>
          <span className="absolute inset-0 grid place-items-center hand text-[1.1rem] text-ink-3">en eso ando…</span>
        </div>
      </div>
      <p className="mt-2 ml-auto w-fit max-w-[85%] bg-[#d9fdd3] rounded-xl rounded-br-sm px-3 py-1.5 text-[0.85rem] shadow-sm">
        ¡Qué tal! Ya quedó el catálogo, te mando el link para que lo veas y me digas qué cambiamos 👇
      </p>
      <p className="hand text-[1rem] text-ink-3 text-right mt-0.5">así te voy avisando</p>
    </div>
  );
}

/* foto 4: ya en vivo, en el cel */
function FotoEnVivo() {
  return (
    <div className="relative flex items-end justify-center gap-3">
      <div className="w-[120px] rounded-[22px] border-[3px] border-ink bg-ink p-[5px] shadow-[4px_4px_0_rgba(23,22,28,.3)] rotate-[3deg]">
        <div className="aspect-[9/19] rounded-[16px] overflow-hidden">
          <img src={gomideliMob} alt="La tienda ya publicada en un celular" className="w-full h-full object-cover object-top" loading="lazy" />
        </div>
      </div>
      <span className="sello absolute left-0 sm:-left-6 -top-6 -rotate-12">¡En línea!</span>
    </div>
  );
}

const PASOS = [
  { t: "Platicamos", d: "Me escribes por WhatsApp o nos echamos una llamada. Me cuentas qué hace tu negocio y qué te quita tiempo. No cuesta nada.", Foto: FotoPlatica },
  { t: "Te mando la propuesta", d: "Un boceto de cómo se va a ver, el precio cerrado, el tiempo y la forma de pago que te quede.", Foto: FotoBoceto },
  { t: "Lo construyo", d: "Te voy mandando avances para que lo veas crecer. Si algo no te gusta o lo quieres distinto, lo cambio a tiempo.", Foto: FotoAvance },
  { t: "Lo subo al aire", d: "Lo publico, te enseño a usarlo y te quedan 30 días de soporte. Los accesos quedan a tu nombre.", Foto: FotoEnVivo },
];

export function Proceso() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const a = anime();
    const el = ref.current;
    if (!a || !el) return;
    const linea = a.svg.createDrawable(el.querySelector(".linea-tiempo path")!);
    const dibujo = a.animate(linea, {
      draw: ["0 0", "0 1"],
      ease: "linear",
      autoplay: a.onScroll({ target: el, enter: "85% start", leave: "60% end", sync: 0.3 }),
    });
    const pasos = [...el.querySelectorAll<HTMLElement>(".paso")];
    pasos.forEach((n) => (n.style.opacity = "0"));
    const observadores = pasos.map((n, i) =>
      a.onScroll({
        target: n,
        enter: "80% top",
        repeat: false,
        onEnter: () => a.animate(n, { opacity: [0, 1], translateX: [i % 2 ? 30 : -30, 0], duration: 650, ease: "outBack" }),
      }),
    );
    return () => {
      dibujo.revert();
      observadores.forEach((o) => o.revert());
      pasos.forEach((n) => (n.style.opacity = ""));
    };
  }, []);

  return (
    <section id="proceso" className="relative px-4 sm:px-6 py-20 scroll-mt-16">
      <div className="mx-auto max-w-5xl">
        <p className="section-num">detrás de cámaras</p>
        <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold">
          Así trabajo. <span className="serif-i font-normal text-cobalt">Paso por paso.</span>
        </h2>

        <div ref={ref} className="relative mt-14">
          <svg className="linea-tiempo absolute left-[18px] md:left-1/2 md:-translate-x-1/2 top-0 w-8 h-full" viewBox="0 0 32 400" preserveAspectRatio="none" aria-hidden>
            <path d="M16 0 C 4 60, 28 110, 16 170 S 4 280, 16 330 S 26 380, 16 400" fill="none" stroke="var(--color-tomato)" strokeWidth={3.5} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>

          <ol className="space-y-14">
            {PASOS.map(({ t, d, Foto }, i) => (
              <li key={t} className={`paso relative grid md:grid-cols-2 gap-6 md:gap-14 items-center pl-14 md:pl-0`}>
                <span className="absolute left-[13px] md:left-1/2 md:-translate-x-1/2 top-1 md:top-1/2 md:-translate-y-1/2 grid place-items-center w-11 h-11 -ml-[9px] md:ml-0 rounded-full bg-sun border-2 border-ink font-display font-extrabold z-10">
                  {i + 1}
                </span>
                <div className={i % 2 ? "md:order-2 md:pl-8" : "md:pr-8 md:text-right"}>
                  <h3 className="text-[1.6rem] font-bold">{t}</h3>
                  <p className="mt-2 text-ink-2">{d}</p>
                </div>
                <div className={`max-w-[340px] w-full ${i % 2 ? "md:order-1 md:justify-self-end md:pr-8" : "md:pl-8"}`}>
                  <Foto />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
