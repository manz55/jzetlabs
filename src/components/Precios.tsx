/*
 * Precios en corto (mismos números que La tienda) + mini cotizador de dos
 * preguntas. Lo largo (extras, dominio, formas de pago) vive en La tienda.
 */
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ACUERDOS, CARE_PLAN, FACTURA, CUOTAS, KINDS, PACES, cuota, diasConRitmo, roundTo50, type KindId } from "@/data/pricing";
import { formatQ, laTienda, whatsappLink } from "@/data/site";
import { useAlAparecer } from "@/lib/anime";
import { CircleScribble } from "./Doodles";
import { Trazo } from "./Trazo";

export function Precios() {
  const [tipo, setTipo] = useState<KindId>("landing");
  const [ritmo, setRitmo] = useState("normal");
  const [acuerdo, setAcuerdo] = useState("sencillo");
  const k = KINDS.find((x) => x.id === tipo)!;
  const p = PACES.find((x) => x.id === ritmo)!;
  const ac = ACUERDOS.find((x) => x.id === acuerdo)!;
  const subtotal = roundTo50(k.base * p.priceMult) + ac.precio;
  const factura = Math.round(subtotal * FACTURA);
  const total = subtotal + factura;
  const [dMin, dMax] = diasConRitmo(k, p);

  // los sellos se estampan cuando aparecen
  const ref = useAlAparecer<HTMLDivElement>(
    (el, a) => {
      a.animate(el.querySelectorAll(".sello-estampa"), {
        scale: [2.6, 1],
        opacity: [0, 1],
        rotate: (t: HTMLElement) => [-30, Number(t.dataset.rot ?? -8)],
        duration: 420,
        delay: a.stagger(260, { start: 200 }),
        ease: "outQuad",
      });
      a.animate(el.querySelectorAll(".plan"), { opacity: [0, 1], translateY: [24, 0], duration: 600, delay: a.stagger(90), ease: "outQuad" });
    },
    {
      preparar: (el) => el.querySelectorAll<HTMLElement>(".sello-estampa, .plan").forEach((n) => (n.style.opacity = "0")),
    },
  );

  return (
    <section id="precios" className="relative px-4 sm:px-6 py-20 scroll-mt-16">
      <div ref={ref} className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end">
          <div>
            <p className="section-num">precios</p>
            <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold">
              Precios que{" "}
              <span className="relative inline-block px-1">
                no asustan
                <Trazo className="absolute -inset-x-3 -inset-y-2" retraso={200}>
                  <CircleScribble className="w-[calc(100%+1.5rem)] h-[calc(100%+1rem)] text-tomato" />
                </Trazo>
              </span>
              .
            </h2>
          </div>
          <div className="flex gap-4 justify-self-start lg:justify-self-end">
            <span className="sello sello-estampa" data-rot="-8" style={{ transform: "rotate(-8deg)" }}>
              Q0 al mes
            </span>
            <span className="sello sello-estampa !text-cobalt !border-cobalt" data-rot="6" style={{ transform: "rotate(6deg)" }}>
              Precio cerrado
            </span>
          </div>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KINDS.map((x) => (
            <article key={x.id} className={`plan ink-card p-5 flex flex-col ${x.id === "expres" ? "bg-[#fff7d6]" : ""}`}>
              <h3 className="font-display font-bold text-[1.25rem]">{x.name}</h3>
              <p className="text-sm text-ink-2 mt-1 flex-1">{x.pitch}</p>
              <p className="font-display font-extrabold text-[2.4rem] leading-none mt-4 tracking-tight">{formatQ(x.base)}</p>
              <p className="text-sm text-ink-2 mt-1 min-h-[1.25rem]">{x.id === "expres" ? "un solo pago" : `o ${CUOTAS} pagos de ${formatQ(cuota(x))}`}</p>
              <p className="font-mono text-xs text-ink-3 mt-3">
                {x.days[0]}–{x.days[1]} días hábiles
              </p>
            </article>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-3">
          Precios más el 5% de la factura. Días hábiles desde que me pasas tus textos y fotos. Pago único con 3% menos, o en 2 pagos, 3 o 4 meses sin recargo. Plan de cambios opcional de {formatQ(CARE_PLAN)} al mes, lo
          cancelas cuando quieras.
        </p>

        {/* mini cotizador */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-stretch [&>*]:min-w-0">
          <div className="ink-card p-5 sm:p-6">
            <p className="hand text-[1.6rem] leading-none text-tomato">¿cuánto me saldría?</p>
            <p className="mt-4 font-semibold">1. ¿Qué necesitas?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {KINDS.map((x) => (
                <button key={x.id} onClick={() => setTipo(x.id)} aria-pressed={tipo === x.id} className={`px-3.5 py-2 rounded-full border-2 border-ink text-[0.95rem] font-medium transition-colors ${tipo === x.id ? "bg-ink text-paper" : "bg-card hover:bg-paper"}`}>
                  {x.name}
                </button>
              ))}
            </div>
            <p className="mt-5 font-semibold">2. ¿Con qué prisa?</p>
            <div className="mt-2 grid grid-cols-3 gap-2 [&>*]:min-w-0">
              {PACES.map((x) => (
                <button key={x.id} onClick={() => setRitmo(x.id)} aria-pressed={ritmo === x.id} className={`p-2.5 rounded-xl border-2 border-ink text-left transition-colors ${ritmo === x.id ? "bg-cobalt text-paper" : "bg-card hover:bg-paper"}`}>
                  <span className="font-bold block text-[0.95rem] leading-tight">{x.name}</span>
                  <span className={`text-xs ${ritmo === x.id ? "text-paper/80" : "text-ink-3"}`}>{x.note}</span>
                </button>
              ))}
            </div>
            <p className="mt-5 font-semibold">3. ¿Cómo lo dejamos por escrito?</p>
            <div className="mt-2 grid sm:grid-cols-2 gap-2">
              {ACUERDOS.map((x) => (
                <button key={x.id} onClick={() => setAcuerdo(x.id)} aria-pressed={acuerdo === x.id} className={`p-2.5 rounded-xl border-2 border-ink text-left transition-colors ${acuerdo === x.id ? "bg-mint" : "bg-card hover:bg-paper"}`}>
                  <span className="font-bold block text-[0.95rem] leading-tight">{x.name}</span>
                  <span className="text-xs text-ink-2">{x.note}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative bg-ink text-paper rounded-[18px] border-2 border-ink p-6 shadow-[6px_6px_0_var(--color-cobalt)] flex flex-col">
            <p className="hand text-[1.3rem] text-volt leading-none">más o menos te sale en</p>
            <p className="font-display font-extrabold text-[3.2rem] leading-none mt-2 tracking-tight" aria-live="polite">
              {formatQ(total)}
            </p>
            <p className="text-paper/80 mt-1">{k.id === "expres" ? "un solo pago" : `o ${CUOTAS} pagos de ${formatQ(Math.round(total / CUOTAS))}`}</p>
            <p className="text-paper/80 mt-3 text-sm">
              Lista en unos <b className="text-paper">{dMin}–{dMax} días hábiles</b>. Y después, Q0 al mes.
            </p>
            <p className="text-paper/70 mt-1 text-sm">
              {formatQ(subtotal)} + {formatQ(factura)} de factura (5%). Siempre con factura.
            </p>
            <p className="text-paper/70 mt-1 text-sm">{ac.precio ? `Incluye contrato formal con firmas legalizadas (+${formatQ(ac.precio)}).` : "Acuerdo por escrito, sin trámites."}</p>
            <div className="mt-auto pt-5 flex flex-col gap-2">
              <a href={laTienda("cotizador")} target="_blank" rel="noopener noreferrer" className="btn btn-primary justify-center !whitespace-normal text-center">
                Arma el tuyo completo en La tienda <ArrowUpRight size={17} />
              </a>
              <a
                href={whatsappLink(`¡Hola Josh! Me interesa ${k.id === "sistema" ? "un" : "una"} ${k.name.toLowerCase()} (${p.name.toLowerCase()}, ${ac.precio ? "con contrato formal" : "acuerdo sencillo"}). En tu página me salía como ${formatQ(total)}. ¿Lo platicamos?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-sm text-paper/80 underline underline-offset-4"
              >
                o mándame esto por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
