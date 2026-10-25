/*
 * Vs. agencias: precios públicos reales (con su link) contra los míos.
 * Las barras crecen al aparecer y con el botón de 1 año / 3 años.
 */
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { KINDS, type KindComparable } from "@/data/pricing";
import { MARKET, MARKET_CHECKED, myOffer, totalFor } from "@/data/market";
import { formatQ } from "@/data/site";
import { anime } from "@/lib/anime";

const TIPOS: KindComparable[] = ["landing", "tienda", "sistema"];

export function Mercado() {
  const [kind, setKind] = useState<KindComparable>("tienda");
  const [years, setYears] = useState<1 | 3>(1);
  const [visto, setVisto] = useState(() => anime() === null);
  const lista = useRef<HTMLUListElement>(null);

  const mine = myOffer(kind);
  const myTotal = totalFor(mine, years);
  const rows = MARKET[kind].map((o) => ({ ...o, total: totalFor(o, years) }));
  const max = Math.max(myTotal, ...rows.map((r) => r.total));
  const masBaratos = rows.filter((r) => r.total < myTotal);
  const ahorro3 = (() => {
    const mio3 = totalFor(mine, 3);
    const otros = MARKET[kind].map((o) => totalFor(o, 3));
    return Math.round((otros.reduce((s, v) => s + v, 0) / otros.length - mio3) / 50) * 50;
  })();

  // las barras crecen la primera vez que la tabla aparece en pantalla
  useEffect(() => {
    if (visto || !lista.current) return;
    const io = new IntersectionObserver((e) => {
      if (e.some((x) => x.isIntersecting)) {
        io.disconnect();
        setVisto(true);
      }
    }, { threshold: 0.3 });
    io.observe(lista.current);
    return () => io.disconnect();
  }, [visto]);

  useEffect(() => {
    const a = anime();
    if (!a || !visto || !lista.current) return;
    const barras = lista.current.querySelectorAll<HTMLElement>("[data-ancho]");
    const an = a.animate(barras, { width: (t: HTMLElement) => t.dataset.ancho!, duration: 900, delay: a.stagger(70), ease: "outExpo" });
    return () => {
      an.pause();
    };
  }, [visto, kind, years]);

  const ancho = (v: number) => `${((v / max) * 100).toFixed(1)}%`;
  const inicial = (v: number) => (visto && !anime() ? ancho(v) : visto ? undefined : "0%");

  return (
    <section id="mercado" className="relative px-4 sm:px-6 py-20 scroll-mt-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-6 items-end">
          <div>
            <p className="section-num">vs. agencias</p>
            <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold">
              No te lo digo yo. <span className="serif-i font-normal text-cobalt">Te lo dicen sus precios.</span>
            </h2>
          </div>
          <p className="text-ink-2 text-[1.08rem] max-w-md lg:justify-self-end">
            Estos son los precios que publican agencias de Guate en sus propias páginas. Cada uno lleva su link para que lo revises tú. Fíjate cuántos cobran <span className="marker text-ink">cada año</span>.
          </p>
        </div>

        <div className="mt-10 ink-card p-4 sm:p-7">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="inline-flex flex-wrap p-1 rounded-xl border-2 border-ink bg-paper self-start">
              {TIPOS.map((t) => (
                <button key={t} onClick={() => setKind(t)} aria-pressed={kind === t} className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-[0.95rem] font-semibold transition-colors ${kind === t ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"}`}>
                  {KINDS.find((k) => k.id === t)!.name}
                </button>
              ))}
            </div>
            <div className="inline-flex p-1 rounded-xl border-2 border-ink bg-sun self-start">
              {([1, 3] as const).map((y) => (
                <button key={y} onClick={() => setYears(y)} aria-pressed={years === y} className={`px-4 py-1.5 rounded-lg text-sm font-bold ${years === y ? "bg-ink text-sun" : "text-ink"}`}>
                  {y} año{y > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>

          <ul ref={lista} className="mt-8 space-y-3.5">
            <li>
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className="font-display font-extrabold text-[1.05rem]">
                  Conmigo <span className="font-body font-normal text-ink-2 text-sm">· {KINDS.find((k) => k.id === kind)!.name.toLowerCase()} + dominio</span>
                </span>
                <span className="font-mono font-bold text-[1.05rem]">{formatQ(myTotal)}</span>
              </div>
              <div className="relative h-9 rounded-lg border-2 border-ink bg-paper overflow-hidden">
                <div data-ancho={ancho(myTotal)} className="absolute inset-y-0 left-0 bg-volt border-r-2 border-ink" style={{ width: inicial(myTotal) }} />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 hand text-[1.15rem] leading-none whitespace-nowrap">pago una vez · solo el dominio cada año</span>
              </div>
            </li>
            {rows.map((r) => (
              <li key={`${kind}-${r.who}-${r.plan}`}>
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-baseline gap-1 min-w-0 text-ink no-underline">
                    <span className="font-display font-bold underline decoration-ink/25 decoration-2 underline-offset-4 group-hover:decoration-tomato truncate">{r.who}</span>
                    <span className="text-ink-2 text-sm truncate">· {r.plan}</span>
                    <ArrowUpRight size={14} className="shrink-0 self-center text-ink-3 group-hover:text-tomato" />
                  </a>
                  <span className="font-mono text-ink-2 shrink-0">
                    {r.from && <span className="text-xs">desde </span>}
                    {formatQ(r.total)}
                  </span>
                </div>
                <div className="relative h-7 rounded-lg border-2 border-ink/70 bg-paper overflow-hidden">
                  <div
                    data-ancho={ancho(r.total)}
                    className="absolute inset-y-0 left-0 border-r-2 border-ink/70"
                    style={{ width: inicial(r.total), background: "repeating-linear-gradient(-45deg, rgba(255,106,61,.55) 0 6px, rgba(255,106,61,.25) 6px 12px)" }}
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-ink/80 whitespace-nowrap">{r.note}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-7 border-t-2 border-dashed border-ink/20 pt-5">
            {years === 1 && masBaratos.length > 0 ? (
              <p className="text-ink-2">
                <span className="hand text-[1.35rem] text-tomato">ojo, para ser honesto:</span> el primer año {masBaratos.map((r) => r.who).join(" y ")} sale más barato, pero cobra cada año
                {kind === "tienda" ? " y te limita a 25 productos" : ""}.{" "}
                {ahorro3 > 0 && (
                  <button onClick={() => setYears(3)} className="font-semibold text-cobalt underline underline-offset-4">
                    Míralo a 3 años →
                  </button>
                )}
              </p>
            ) : (
              <p className="text-ink-2">
                <span className="hand text-[1.35rem] text-cobalt">en {years === 1 ? "1 año" : "3 años"},</span> contra el promedio te ahorras{" "}
                <b className="font-display text-[1.6rem] text-ink">{formatQ(Math.max(0, Math.round((rows.reduce((s, r) => s + r.total, 0) / rows.length - myTotal) / 50) * 50))}</b>.
              </p>
            )}
          </div>
        </div>

        <p className="mt-4 text-xs text-ink-3 leading-relaxed max-w-3xl">
          Precios tomados de las páginas públicas de cada agencia el {MARKET_CHECKED}. Pueden cambiar y cada quien incluye cosas distintas, por eso cada uno lleva su link. Los míos son el precio base más dominio.
        </p>
      </div>
    </section>
  );
}
