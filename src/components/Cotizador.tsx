/*
 * Cotizador — el cliente arma su proyecto y ve un estimado al momento:
 * precio según el ritmo (más calma = más barato), con o sin dominio,
 * y pago único o en cuotas. Al final lo manda por WhatsApp ya escrito.
 */
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check as CheckIcon, Plus } from "lucide-react";
import { DOMAIN_PRICE, EXTRAS, KINDS, PACES, PAY_PLANS, roundTo50, type KindId } from "@/data/pricing";
import { formatQ, whatsappLink } from "@/data/site";
import { CircleScribble, Spark } from "./Doodles";

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="grid place-items-center w-8 h-8 rounded-full border-2 border-ink bg-sun font-display font-extrabold text-sm shrink-0">
          {n}
        </span>
        <h3 className="text-xl sm:text-[1.35rem] font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        initial={{ y: -18, opacity: 0, rotate: -4 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: 18, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="inline-block"
      >
        {formatQ(value)}
      </motion.span>
    </AnimatePresence>
  );
}

export function Cotizador() {
  const [kindId, setKindId] = useState<KindId>("landing");
  const [extras, setExtras] = useState<string[]>([]);
  const [paceId, setPaceId] = useState("normal");
  const [domain, setDomain] = useState(true);
  const [planId, setPlanId] = useState("unico");

  const kind = KINDS.find((k) => k.id === kindId)!;
  const pace = PACES.find((p) => p.id === paceId)!;
  const plan = PAY_PLANS.find((p) => p.id === planId)!;
  const available = EXTRAS.filter((e) => e.for.includes(kindId));

  const calc = useMemo(() => {
    const chosen = available.filter((e) => extras.includes(e.id));
    const work = kind.base + chosen.reduce((s, e) => s + e.price, 0);
    const extraDays = chosen.reduce((s, e) => s + e.days, 0);
    const paced = work * pace.priceMult;
    const subtotal = paced + (domain ? DOMAIN_PRICE : 0);
    const total = roundTo50(subtotal * (1 - plan.discount));
    const monthly = Math.round(total / plan.months);
    const dMin = Math.max(3, Math.round((kind.days[0] + extraDays) * pace.timeMult));
    const dMax = Math.max(dMin + 2, Math.round((kind.days[1] + extraDays) * pace.timeMult));
    const marketMin = kind.market[0] + chosen.reduce((s, e) => s + e.price * 2, 0);
    const marketMax = kind.market[1] + chosen.reduce((s, e) => s + e.price * 3, 0);
    return { chosen, total, monthly, dMin, dMax, marketMin, marketMax, saving: marketMin - total };
  }, [available, extras, kind, pace, domain, plan]);

  const toggleExtra = (id: string) => setExtras((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]));

  const message = [
    "¡Hola Josh! Armé esto en tu cotizador:",
    `• ${kind.name}`,
    calc.chosen.length ? `• Extras: ${calc.chosen.map((e) => e.name.toLowerCase()).join(", ")}` : null,
    `• Ritmo: ${pace.name.toLowerCase()}`,
    `• ${domain ? "Con dominio propio" : "Sin dominio por ahora"}`,
    `• Pago: ${plan.name.toLowerCase()}`,
    `Me salió como ${formatQ(calc.total)}${plan.months > 1 ? ` (${plan.months} pagos de ${formatQ(calc.monthly)})` : ""}. ¿Lo platicamos?`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <section id="precios" className="relative px-4 sm:px-6 py-20 scroll-mt-16">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="section-num">02 — precios</p>
          <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold">
            Precios que{" "}
            <span className="relative inline-block px-1">
              no asustan
              <CircleScribble className="absolute -inset-x-3 -inset-y-2 w-[calc(100%+1.5rem)] h-[calc(100%+1rem)] text-tomato" />
            </span>
            . Y que se <span className="serif-i font-normal text-cobalt">acomodan a vos.</span>
          </h2>
          <p className="mt-5 text-ink-2 text-[1.08rem]">
            Armá tu proyecto aquí y te sale un estimado al instante. Si no tenés prisa, te sale más barato. Si lo necesitás ya, le
            meto turbo. Y lo podés pagar de una vez o en cuotas, como te quede mejor.
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1.35fr_1fr] gap-8 lg:gap-10 items-start">
          {/* los pasos */}
          <div className="space-y-10">
            <Step n={1} title="¿Qué necesitás?">
              <div className="grid sm:grid-cols-3 gap-3">
                {KINDS.map((k) => {
                  const active = k.id === kindId;
                  return (
                    <button
                      key={k.id}
                      onClick={() => {
                        setKindId(k.id);
                        setExtras([]);
                      }}
                      className={`relative text-left p-4 rounded-2xl border-2 border-ink transition-all duration-150 ${
                        active ? "bg-volt shadow-[4px_4px_0_var(--color-ink)] -translate-y-0.5" : "bg-card hover:bg-paper shadow-[2px_2px_0_var(--color-ink)]"
                      }`}
                      aria-pressed={active}
                    >
                      <span className="font-display font-extrabold text-[1.1rem] leading-tight block">{k.name}</span>
                      <span className="block text-sm text-ink-2 mt-1.5 leading-snug">{k.pitch}</span>
                      {active && (
                        <motion.span
                          layoutId="kind-check"
                          className="absolute -top-2.5 -right-2.5 grid place-items-center w-7 h-7 rounded-full bg-ink text-volt"
                        >
                          <CheckIcon size={15} strokeWidth={3} />
                        </motion.span>
                      )}
                    </button>
                  );
                })}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-2">
                {kind.includes.map((i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckIcon size={14} strokeWidth={3} className="text-cobalt" /> {i}
                  </li>
                ))}
              </ul>
            </Step>

            <Step n={2} title="¿Le agregamos algo?">
              <div className="flex flex-wrap gap-2">
                {available.map((e) => {
                  const on = extras.includes(e.id);
                  return (
                    <button
                      key={e.id}
                      onClick={() => toggleExtra(e.id)}
                      aria-pressed={on}
                      className={`flex items-center gap-2 pl-2.5 pr-3.5 py-2 rounded-full border-2 border-ink text-[0.92rem] font-medium transition-all ${
                        on ? "bg-ink text-paper" : "bg-card hover:bg-paper"
                      }`}
                    >
                      <motion.span animate={{ rotate: on ? 45 : 0 }} className="grid place-items-center">
                        <Plus size={16} strokeWidth={2.6} />
                      </motion.span>
                      {e.name}
                      <span className={`font-mono text-xs ${on ? "text-volt" : "text-ink-3"}`}>+{formatQ(e.price)}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-sm text-ink-3">Si no ves lo que buscás, igual escribime. Casi todo se puede.</p>
            </Step>

            <Step n={3} title="¿Con qué prisa?">
              <div className="grid sm:grid-cols-3 gap-3">
                {PACES.map((p) => {
                  const active = p.id === paceId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPaceId(p.id)}
                      aria-pressed={active}
                      className={`text-left p-3.5 rounded-xl border-2 border-ink transition-all ${
                        active ? "bg-cobalt text-paper shadow-[3px_3px_0_var(--color-ink)]" : "bg-card hover:bg-paper"
                      }`}
                    >
                      <span className="font-display font-bold block">{p.name}</span>
                      <span className={`block text-sm mt-0.5 ${active ? "text-paper/85" : "text-ink-2"}`}>{p.note}</span>
                      <span className={`block font-mono text-xs mt-2 ${active ? "text-volt" : "text-ink-3"}`}>
                        {p.priceMult < 1 ? "−10% en precio" : p.priceMult > 1 ? "+20% en precio" : "precio base"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Step>

            <div className="grid sm:grid-cols-2 gap-10 sm:gap-6">
              <Step n={4} title="¿Dominio?">
                <div className="flex flex-col gap-2">
                  {[
                    { v: true, t: "Con dominio propio", d: `tunegocio.com · +${formatQ(DOMAIN_PRICE)} el primer año, yo lo configuro` },
                    { v: false, t: "Sin dominio por ahora", d: "tunegocio.vercel.app · gratis, y si después querés, lo cambio" },
                  ].map((o) => (
                    <button
                      key={String(o.v)}
                      onClick={() => setDomain(o.v)}
                      aria-pressed={domain === o.v}
                      className={`text-left p-3 rounded-xl border-2 border-ink transition-all ${
                        domain === o.v ? "bg-mint shadow-[3px_3px_0_var(--color-ink)]" : "bg-card hover:bg-paper"
                      }`}
                    >
                      <span className="font-semibold block">{o.t}</span>
                      <span className="text-sm text-ink-2">{o.d}</span>
                    </button>
                  ))}
                </div>
              </Step>

              <Step n={5} title="¿Cómo te queda pagar?">
                <div className="grid grid-cols-2 gap-2">
                  {PAY_PLANS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlanId(p.id)}
                      aria-pressed={planId === p.id}
                      className={`text-left p-3 rounded-xl border-2 border-ink transition-all ${
                        planId === p.id ? "bg-lilac shadow-[3px_3px_0_var(--color-ink)]" : "bg-card hover:bg-paper"
                      }`}
                    >
                      <span className="font-semibold block">{p.name}</span>
                      <span className="text-sm text-ink-2">{p.note}</span>
                    </button>
                  ))}
                </div>
              </Step>
            </div>
          </div>

          {/* el recibo */}
          <div className="lg:sticky lg:top-24">
            <motion.div layout className="relative bg-card border-2 border-ink border-b-0 rounded-t-2xl px-6 pt-6 receipt-edge shadow-[6px_0_0_var(--color-ink)]">
              <span className="tape -top-3 left-8 rotate-[-6deg]" aria-hidden />
              <div className="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-widest text-ink-3">
                <span>jzet.labs · estimado</span>
                <span>gt</span>
              </div>
              <div className="border-b-2 border-dashed border-ink/25 my-4" />

              <ul className="space-y-1.5 text-[0.95rem]">
                <li className="flex justify-between gap-3">
                  <span>{kind.name}</span>
                  <span className="font-mono">{formatQ(kind.base)}</span>
                </li>
                {calc.chosen.map((e) => (
                  <li key={e.id} className="flex justify-between gap-3 text-ink-2">
                    <span>+ {e.name}</span>
                    <span className="font-mono">{formatQ(e.price)}</span>
                  </li>
                ))}
                {pace.priceMult !== 1 && (
                  <li className="flex justify-between gap-3 text-ink-2">
                    <span>Ritmo: {pace.name.toLowerCase()}</span>
                    <span className="font-mono">{pace.priceMult < 1 ? "−10%" : "+20%"}</span>
                  </li>
                )}
                <li className="flex justify-between gap-3 text-ink-2">
                  <span>{domain ? "Dominio (1er año)" : "Sin dominio"}</span>
                  <span className="font-mono">{domain ? formatQ(DOMAIN_PRICE) : "Q0"}</span>
                </li>
                {plan.discount > 0 && (
                  <li className="flex justify-between gap-3 text-ink-2">
                    <span>Pago único</span>
                    <span className="font-mono">−5%</span>
                  </li>
                )}
              </ul>

              <div className="border-b-2 border-dashed border-ink/25 my-4" />

              <p className="hand text-[1.3rem] text-ink-2 leading-none">más o menos te sale en</p>
              <p className="font-display font-extrabold text-[3rem] sm:text-[3.4rem] leading-none mt-1 tracking-tight overflow-hidden">
                <AnimatedNumber value={calc.total} />
              </p>
              {plan.months > 1 && (
                <p className="mt-1.5 text-[1rem]">
                  o <strong>{plan.months} pagos</strong> de <strong className="marker">{formatQ(calc.monthly)}</strong>
                </p>
              )}
              <p className="mt-3 text-sm text-ink-2">
                Listo en unos <strong className="text-ink">{calc.dMin}–{calc.dMax} días hábiles</strong>, según lo que lleve.
              </p>

              <div className="mt-5 p-3 rounded-xl bg-paper border-2 border-dashed border-ink/30 text-sm">
                <p className="text-ink-2">
                  En agencias de Guate algo así anda por{" "}
                  <span className="line-through decoration-tomato decoration-2 text-ink">
                    {formatQ(calc.marketMin)}–{formatQ(calc.marketMax)}
                  </span>{" "}
                  <a href="#mercado" className="underline decoration-cobalt decoration-2 underline-offset-2 text-cobalt whitespace-nowrap">
                    ver precios reales
                  </a>
                </p>
                {calc.saving > 0 && (
                  <p className="mt-1 font-semibold text-ink flex items-center gap-1.5">
                    <Spark className="w-4 h-4 text-tomato shrink-0" /> Te ahorrás arriba de {formatQ(roundTo50(calc.saving))}
                  </p>
                )}
              </div>

              <a
                href={whatsappLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full justify-center mt-5"
              >
                Mandame esto por WhatsApp
              </a>
              <p className="mt-3 text-xs text-ink-3 leading-relaxed">
                Es un estimado para que tengás una idea. El precio final te lo confirmo después de platicar y queda cerrado: no
                cambia a medio camino.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
