/*
 * Vs. agencias — barras con precios públicos reales de agencias de Guate
 * contra lo mío. El selector de años muestra cómo crecen los cobros anuales.
 */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Eye } from "lucide-react";
import { KINDS, type KindId } from "@/data/pricing";
import { MARKET, MARKET_CHECKED, myOffer, totalFor } from "@/data/market";
import { formatQ } from "@/data/site";
import { ArrowCurly, Spark } from "./Doodles";

const EXAMPLES: Record<KindId, { text: string; projectId?: string; url?: string }> = {
  landing: { text: "Ver Plomería Danny", projectId: "plomeria" },
  tienda: { text: "Ver GomiDeli", projectId: "gomideli", url: "https://gomideli-tienda.vercel.app" },
  sistema: { text: "Ver EFAMIC", projectId: "efamic" },
};

export function Mercado({ onOpen }: { onOpen: (id: string) => void }) {
  const [kind, setKind] = useState<KindId>("tienda");
  const [years, setYears] = useState(1);

  const offers = MARKET[kind];
  const mine = myOffer(kind);
  const myTotal = totalFor(mine, years);
  const rows = offers.map((o) => ({ ...o, total: totalFor(o, years) }));
  const max = Math.max(myTotal, ...rows.map((r) => r.total));
  const avg = rows.reduce((s, r) => s + r.total, 0) / rows.length;
  const saving = Math.round((avg - myTotal) / 50) * 50;
  const example = EXAMPLES[kind];

  return (
    <section id="mercado" className="relative px-4 sm:px-6 py-20 scroll-mt-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-end">
          <div>
            <p className="section-num">03 — vs. agencias</p>
            <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold">
              No te lo digo yo. <span className="serif-i font-normal text-cobalt">Te lo dicen sus precios.</span>
            </h2>
          </div>
          <p className="text-ink-2 text-[1.08rem] max-w-md lg:justify-self-end">
            Agarré los precios que las agencias de Guate publican en sus propias páginas y los puse a la par de los míos. Cada uno
            tiene su link para que lo revisés vos. Fijate cuántos cobran <span className="marker text-ink">cada año</span>.
          </p>
        </div>

        <div className="mt-10 ink-card p-4 sm:p-7">
          {/* controles */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="inline-flex flex-wrap p-1 rounded-xl border-2 border-ink bg-paper self-start">
              {KINDS.map((k) => (
                <button
                  key={k.id}
                  onClick={() => setKind(k.id)}
                  aria-pressed={kind === k.id}
                  className={`relative px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-[0.95rem] font-semibold transition-colors ${
                    kind === k.id ? "text-paper" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {kind === k.id && <motion.span layoutId="mk-kind" className="absolute inset-0 rounded-lg bg-ink" />}
                  <span className="relative">{k.name}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="hand text-[1.3rem] text-cobalt leading-none">¿y si lo vemos en…</span>
              <div className="inline-flex p-1 rounded-xl border-2 border-ink bg-sun">
                {[1, 2, 3].map((y) => (
                  <button
                    key={y}
                    onClick={() => setYears(y)}
                    aria-pressed={years === y}
                    className={`relative px-3 py-1.5 rounded-lg text-sm font-bold ${years === y ? "text-sun" : "text-ink"}`}
                  >
                    {years === y && <motion.span layoutId="mk-years" className="absolute inset-0 rounded-lg bg-ink" />}
                    <span className="relative">
                      {y} año{y > 1 ? "s" : ""}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* barras */}
          <ul className="mt-8 space-y-3.5">
            {/* la mía primero */}
            <li>
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className="font-display font-extrabold text-[1.05rem]">
                  Jzet Labs <span className="font-body font-normal text-ink-2 text-sm">· {KINDS.find((k) => k.id === kind)!.name.toLowerCase()} + dominio</span>
                </span>
                <span className="font-mono font-bold text-[1.05rem]">{formatQ(myTotal)}</span>
              </div>
              <div className="relative h-9 rounded-lg border-2 border-ink bg-paper overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-volt border-r-2 border-ink"
                  animate={{ width: `${(myTotal / max) * 100}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 hand text-[1.15rem] leading-none">
                  pago una vez · solo el dominio cada año (~{formatQ(mine.perYear)})
                </span>
              </div>
            </li>

            <AnimatePresence mode="popLayout" initial={false}>
              {rows.map((r, i) => (
                <motion.li
                  key={`${kind}-${r.who}-${r.plan}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-baseline gap-1 min-w-0 text-ink no-underline"
                    >
                      <span className="font-display font-bold underline decoration-ink/25 decoration-2 underline-offset-4 group-hover:decoration-tomato truncate">
                        {r.who}
                      </span>
                      <span className="text-ink-2 text-sm truncate">· {r.plan}</span>
                      <ArrowUpRight size={14} className="shrink-0 self-center text-ink-3 group-hover:text-tomato" />
                    </a>
                    <span className="font-mono text-ink-2 shrink-0">
                      {r.from && <span className="text-xs">desde </span>}
                      {formatQ(r.total)}
                    </span>
                  </div>
                  <div className="relative h-7 rounded-lg border-2 border-ink/70 bg-paper overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 border-r-2 border-ink/70"
                      style={{
                        background:
                          "repeating-linear-gradient(-45deg, rgba(255,106,61,.55) 0 6px, rgba(255,106,61,.25) 6px 12px)",
                      }}
                      animate={{ width: `${(r.total / max) * 100}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    />
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-ink/80 whitespace-nowrap">
                      {r.note}
                    </span>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* resultado */}
          <div className="mt-8 grid md:grid-cols-[auto_1fr] gap-5 items-center border-t-2 border-dashed border-ink/20 pt-6">
            <div className="relative">
              <p className="hand text-[1.35rem] text-ink-2 leading-none">
                en {years} año{years > 1 ? "s" : ""}, contra el promedio te ahorrás
              </p>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={`${kind}-${years}`}
                  initial={{ y: -16, opacity: 0, rotate: -3 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 16, opacity: 0 }}
                  className="font-display font-extrabold text-[2.8rem] sm:text-[3.4rem] leading-none mt-1 text-cobalt"
                >
                  {formatQ(Math.max(0, saving))}
                </motion.p>
              </AnimatePresence>
              <Spark className="absolute -right-8 top-0 w-7 h-7 text-tomato" />
            </div>

            <div className="md:justify-self-end flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="hidden sm:flex items-center gap-1 hand text-[1.2rem] text-ink-2">
                ¿y es de verdad? mirá uno hecho por mí
                <ArrowCurly className="w-12 h-8 -rotate-12" />
              </span>
              <div className="flex flex-wrap gap-2">
                {example.projectId && (
                  <button onClick={() => onOpen(example.projectId!)} className="btn btn-ghost !py-2 !px-3.5 !text-[0.92rem]">
                    <Eye size={16} /> {example.text}
                  </button>
                )}
                {example.url && (
                  <a href={example.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary !py-2 !px-3.5 !text-[0.92rem]">
                    Abrirla en vivo <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-ink-3 leading-relaxed max-w-3xl">
          Precios tomados de las páginas públicas de cada agencia el {MARKET_CHECKED}. Pueden cambiar y cada quien incluye cosas
          distintas, por eso cada uno lleva su link. Los míos son el precio base más dominio; el final depende de lo que lleve tu
          proyecto. La mayoría de sistemas a la medida no publica precio, solo cotiza.
        </p>
      </div>
    </section>
  );
}
