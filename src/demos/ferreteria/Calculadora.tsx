/*
 * Calculadora de obra: losa o piso, pared de block y techo. Solo suma productos del catálogo.
 * Al cambiar un dato muestra el esqueleto 350 ms y las cifras cuentan hasta el nuevo valor.
 */
import { useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useCifra, useDemora } from "./animar";
import {
  BASE, CAMPOS, CASOS, MEDIDAS_INICIALES, calcular, entero, leer, m2, producto, qz, totalDe, unidades,
  type Carro, type Caso, type Item, type Medidas,
} from "./datos";

/* cifra animada, con su esqueleto encima mientras se recalcula */
function Cifra({ valor, formato, cargando }: { valor: number; formato: (n: number) => string; cargando: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useCifra(ref, valor, formato);
  return (
    <span className="relative inline-block max-w-full whitespace-nowrap">
      <span ref={ref} className={cargando ? "invisible" : ""}>{formato(valor)}</span>
      {cargando && <span className="ik-hueso absolute inset-x-0 inset-y-[12%]" aria-hidden />}
    </span>
  );
}

type Props = {
  carro: Carro;
  agregar: (items: Item[]) => string;
  verPedido: () => void;
};

export default function Calculadora({ carro, agregar, verPedido }: Props) {
  const [caso, setCaso] = useState<Caso>("losa");
  const [medidas, setMedidas] = useState<Medidas>(MEDIDAS_INICIALES);
  /* cálculos ya pasados al pedido, cada uno con su aviso */
  const [hechos, setHechos] = useState<Record<string, string>>({});

  const [aplicada, cargando] = useDemora(JSON.stringify([caso, medidas]), 350);
  const [c, m] = JSON.parse(aplicada) as [Caso, Medidas];
  const res = calcular(c, m);
  const items = res?.items ?? [];
  const total = totalDe(items);
  /* evita sumar dos veces el mismo cálculo; si quitó algo del pedido, el botón dice que vuelve a sumar */
  const clave = JSON.stringify([c, CAMPOS[c].map((x) => m[x.k])]);
  const aviso = cargando ? undefined : hechos[clave];
  const completo = aviso !== undefined && items.every((i) => (carro[i.id] ?? 0) >= Math.min(i.n, producto(i.id).hay));

  return (
    <section id="calculadora" className="ik-oscuro scroll-mt-16 bg-[#0F172A] text-white">
      <div className="ik-ancho py-12 md:py-16">
        <p className="text-[0.84rem] font-bold text-slate-300">Calculadora de obra</p>
        <h2 className="mt-1 text-[1.9rem] sm:text-[2.4rem]">Cuantifique y pida en el mismo paso</h2>
        <p className="mt-2 max-w-2xl text-[0.95rem] text-slate-300">Ponga dos medidas y vea qué comprar, cuánto cuesta cada material y el total.</p>

        <div className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* datos de entrada */}
          <div className="self-start rounded-xl border border-slate-700 bg-[#111c33] p-4 sm:p-5">
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-[#0b1222] p-1" role="group" aria-label="Qué va a construir">
              {CASOS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={caso === x.id}
                  onClick={() => setCaso(x.id)}
                  className={`min-h-12 rounded-md px-1 text-[0.84rem] font-bold leading-tight transition-colors sm:text-[0.9rem] ${caso === x.id ? "bg-white text-[#0F172A]" : "text-slate-300 hover:bg-white/10"}`}
                >
                  {x.nombre}
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {CAMPOS[caso].map((campo) => {
                const mal = leer(medidas[campo.k], campo.min, campo.max) === null;
                return (
                  <div key={campo.k}>
                    <label htmlFor={`ik-m-${campo.k}`} className="mb-1.5 block text-[0.86rem] font-semibold text-slate-200">{campo.titulo}</label>
                    <div className="ik-campo-obra">
                      <input
                        id={`ik-m-${campo.k}`}
                        className="ik-num"
                        inputMode="decimal"
                        value={medidas[campo.k]}
                        aria-invalid={mal || undefined}
                        aria-describedby={`ik-m-${campo.k}-ayuda`}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setMedidas((x) => ({ ...x, [campo.k]: e.target.value }))}
                      />
                      <span className="shrink-0 pr-3 text-[0.82rem] font-semibold text-slate-400">m</span>
                    </div>
                    <p id={`ik-m-${campo.k}-ayuda`} className={`mt-1 text-[0.78rem] ${mal ? "font-bold text-[#fca5a5]" : "sr-only"}`}>Entre {campo.min} y {campo.max} m.</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-[0.82rem] leading-relaxed text-slate-400">{BASE[caso]}</p>
          </div>

          {/* resultado */}
          <div className="rounded-xl border border-slate-700 bg-[#111c33] p-4 sm:p-6" aria-busy={cargando}>
            <p className="flex items-baseline justify-between gap-3 border-b border-slate-700 pb-4">
              <span className="font-bold">Área total</span>
              <span className="ik-num text-[1.7rem] font-bold" data-cifra="area"><Cifra valor={res?.area ?? 0} formato={m2} cargando={cargando} /></span>
            </p>

            {!res ? (
              <p className="my-4 rounded-lg border border-[#f87171] p-3 text-[0.9rem] font-semibold">Revise las medidas marcadas para calcular.</p>
            ) : (
              <ul className="divide-y divide-slate-700">
                {items.map((i, n) => {
                  const p = producto(i.id);
                  return (
                    /* la posición como llave: así las cifras cuentan también al cambiar de pestaña */
                    <li key={n} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-4 sm:grid-cols-[minmax(0,1fr)_9.5rem_8rem]" data-fila={p.id}>
                      <p className="col-span-2 min-w-0 sm:col-span-1">
                        <span className="block font-bold leading-snug">{p.nombre}</span>
                        <span className="ik-num text-[0.84rem] text-slate-400">{qz(p.precio)} c/u</span>
                      </p>
                      <p className="ik-num sm:text-right">
                        <span className="text-[1.7rem] font-bold" data-cifra="cantidad"><Cifra valor={i.n} formato={entero} cargando={cargando} /></span>{" "}
                        <span className="text-[0.84rem] text-slate-400">{unidades(p, i.n)}</span>
                      </p>
                      <p className="ik-num text-right text-[1.1rem] font-bold" data-cifra="subtotal"><Cifra valor={i.n * p.precio} formato={qz} cargando={cargando} /></p>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-slate-500 pt-4">
              <p className="text-[1.1rem] font-bold">Total<span className="block text-[0.78rem] font-medium text-slate-400">IVA incluido, sin flete</span></p>
              <p className="ik-num text-[2.2rem] font-bold sm:text-[2.7rem]" data-cifra="total"><Cifra valor={total} formato={qz} cargando={cargando} /></p>
            </div>
            <p className="sr-only" role="status">
              {!cargando && res ? `${items.map((i) => `${i.n} ${unidades(producto(i.id), i.n)}`).join(", ")}. Total ${qz(total)}` : ""}
            </p>
            <button
              type="button"
              className="ik-btn ik-rojo mt-4 w-full"
              disabled={cargando || !res || completo}
              onClick={() => {
                const texto = agregar(items);
                setHechos((h) => ({ ...h, [clave]: texto }));
              }}
            >
              {completo ? <><Check size={18} aria-hidden /> Ya está en su pedido</> : <>{aviso === undefined ? "Pasar todo el cálculo al pedido" : "Volver a sumar todo el cálculo"} <ArrowRight size={18} aria-hidden /></>}
            </button>
            {completo && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-3 text-[#0F172A]" role="status">
                <p className="flex items-center gap-2 text-[0.88rem] font-bold"><Check size={18} aria-hidden className="shrink-0 text-[#15803d]" /> {aviso}</p>
                <button type="button" className="min-h-11 text-[0.88rem] font-bold text-[#C81E1E] underline" onClick={verPedido}>Ver mi pedido</button>
              </div>
            )}
            <p className="mt-3 text-[0.78rem] text-slate-400">Estimado sobre los materiales listados. Confirme las cantidades con su maestro de obra.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
