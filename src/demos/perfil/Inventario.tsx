/*
 * El inventario explicado sin vueltas: cuánto te queda de cada cosa, cuántos días te alcanza,
 * qué reponer a la empresa, qué se vende más y cómo van los ingresos y gastos al ritmo actual.
 * Los ritmos de venta son de ejemplo; en su negocio salen de sus ventas reales.
 */
import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, Minus, Plus, TrendingUp } from "lucide-react";
import { HISTORIA, LINEA, MESES, PRODUCTOS, RITMO, ROSA, TINTA, VINO, qz, type Producto } from "./datos";

const SERIF = '"Fraunces", Georgia, serif';
export type Nivel = "ya" | "pronto" | "bien";
const NIVELES: Record<Nivel, { t: string; color: string; fondo: string }> = {
  ya: { t: "Reponer ya", color: "#a4262c", fondo: "#fde4e4" },
  pronto: { t: "Reponer pronto", color: "#8a5a00", fondo: "#fdf0cf" },
  bien: { t: "Stock suficiente", color: "#1f5a37", fondo: "#dff1e5" },
};

export function filasInventario(disponible: (id: string) => number, minimo: number) {
  return PRODUCTOS.map((pr) => {
    const disp = disponible(pr.id);
    const ritmo = RITMO[pr.id] ?? 3;
    const dias = ritmo > 0 ? Math.round(disp / (ritmo / 30)) : 99;
    const nivel: Nivel = disp <= minimo || dias < 7 ? "ya" : dias < 14 ? "pronto" : "bien";
    const sugerido = nivel === "bien" ? 0 : Math.max(1, Math.ceil(ritmo) - disp);
    return { pr, disp, ritmo, dias, nivel, sugerido };
  });
}

export function InventarioTab({ stock, disponible, apartado, sumar, minimo, ponerMinimo, vendido, meta, avisar }: {
  stock: Record<string, number>; disponible: (id: string) => number; apartado: (id: string) => number; sumar: (id: string, n: number) => void;
  minimo: number; ponerMinimo: (n: number) => void; vendido: number; meta: number; avisar: (t: string) => void;
}) {
  const [filtro, setFiltro] = useState<"todos" | Nivel>("todos");
  const [cant, setCant] = useState<Record<string, number>>({});
  const hoy = new Date();
  const diaDelMes = Math.max(1, hoy.getDate());

  const filas = useMemo(() => filasInventario(disponible, minimo), [disponible, minimo]);

  const pedir = filas.filter((f) => f.nivel !== "bien").map((f) => ({ ...f, n: cant[f.pr.id] ?? f.sugerido }));
  const totalPedido = pedir.reduce((t, f) => t + f.n * f.pr.costo, 0);
  const enMano = PRODUCTOS.reduce((t, pr) => t + (stock[pr.id] ?? 0) * pr.costo, 0);
  const siVendes = PRODUCTOS.reduce((t, pr) => t + (stock[pr.id] ?? 0) * pr.precio, 0);
  const piezas = PRODUCTOS.reduce((t, pr) => t + (stock[pr.id] ?? 0), 0);
  const ritmoTotal = PRODUCTOS.reduce((t, pr) => t + (RITMO[pr.id] ?? 3), 0);
  const diasTodo = Math.round(piezas / (ritmoTotal / 30));
  const primero = [...filas].sort((a, b) => a.dias - b.dias)[0];
  const ritmoVenta = [...filas].sort((a, b) => b.ritmo - a.ritmo);

  // lo que pasa si sigues a este ritmo
  const cierreNov = Math.round((vendido / diaDelMes) * 30);
  const gastoNov = 980;
  const dic = Math.round(cierreNov * 1.12);
  const barras = [...HISTORIA, { mes: MESES[hoy.getMonth()].slice(0, 3), ingresos: vendido, gastos: gastoNov, actual: true }, { mes: MESES[(hoy.getMonth() + 1) % 12].slice(0, 3), ingresos: dic, gastos: Math.round(dic * 0.62), prevision: true }] as { mes: string; ingresos: number; gastos: number; actual?: boolean; prevision?: boolean }[];
  const tope = Math.max(...barras.map((b) => Math.max(b.ingresos, b.gastos))) * 1.1;
  const visibles = filas.filter((f) => filtro === "todos" || f.nivel === filtro);

  const stat = (titulo: string, valor: string, nota: string, alerta = false) => (
    <div className="rounded-2xl bg-white p-5" style={{ border: `1.5px solid ${alerta ? VINO : LINEA}` }}>
      <p className="text-[1rem] opacity-70">{titulo}</p>
      <p className="mt-1 text-[clamp(1.9rem,1.5rem+1vw,2.6rem)] font-semibold leading-none" style={{ fontFamily: SERIF, color: alerta ? VINO : undefined }}>{valor}</p>
      <p className="mt-1.5 text-[0.95rem] opacity-65">{nota}</p>
    </div>
  );

  return (
    <div className="mt-6 grid gap-5">
      <div className="pf-auto" style={{ ["--min" as string]: "15rem" }}>
        {stat("Inventario disponible", qz(enMano), `${piezas} unidades, valoradas a costo`)}
        {stat("Valor a precio de venta", qz(siVendes), `Utilidad potencial: ${qz(siVendes - enMano)}`)}
        {stat("Cobertura estimada", `${diasTodo} días`, "según el ritmo de ventas actual")}
        {stat("Productos por reponer", `${pedir.length} productos`, `Inversión requerida: ${qz(totalPedido)}`, pedir.length > 0)}
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <section className="min-w-0 rounded-2xl bg-white p-5 sm:p-6 lg:col-span-5" style={{ border: `1.5px solid ${LINEA}` }}>
          <h2 className="text-[1.7rem] font-medium leading-tight" style={{ fontFamily: SERIF }}>Pedido sugerido a la empresa</h2>
          <p className="mt-0.5 text-[1rem] opacity-65">Productos con menos de 14 días de cobertura. Las cantidades se pueden modificar.</p>
          {pedir.length === 0 ? <p className="mt-4 rounded-xl px-4 py-5 text-center opacity-65" style={{ background: "#fdf3ed" }}>No hay productos por reponer en este momento.</p> : (
            <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-2.5">
              {pedir.map((f) => (
                <li key={f.pr.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: "#fdf3ed" }}>
                  <img src={f.pr.foto} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1 leading-tight"><b className="block truncate text-[1.05rem]">{f.pr.nombre}</b><span className="text-[0.9rem] opacity-65">{qz(f.pr.costo)} c/u · {f.dias <= 0 ? "sin existencias" : `cobertura de ${f.dias} días`}</span></span>
                  <span className="flex shrink-0 items-center gap-1">
                    <button type="button" aria-label={`Uno menos de ${f.pr.nombre}`} onClick={() => setCant({ ...cant, [f.pr.id]: Math.max(0, f.n - 1) })} className="grid h-10 w-10 place-items-center rounded-full border-2 bg-white" style={{ borderColor: "rgba(42,22,51,.25)" }}><Minus size={16} /></button>
                    <span className="w-7 text-center text-[1.15rem] font-bold tabular-nums">{f.n}</span>
                    <button type="button" aria-label={`Uno más de ${f.pr.nombre}`} onClick={() => setCant({ ...cant, [f.pr.id]: f.n + 1 })} className="grid h-10 w-10 place-items-center rounded-full border-2 bg-white" style={{ borderColor: "rgba(42,22,51,.25)" }}><Plus size={16} /></button>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 flex items-baseline justify-between border-t pt-3 text-[1.15rem] font-semibold" style={{ borderColor: TINTA }}><span>Total del pedido sugerido</span><span className="text-[1.7rem]" style={{ fontFamily: SERIF }}>{qz(totalPedido)}</span></p>
          <button type="button" onClick={() => avisar("En su negocio, este botón copia la lista para pasarla a la empresa.")} className="pf-btn mt-4 min-h-[3.25rem] w-full rounded-full text-[1.1rem] font-semibold text-white" style={{ background: TINTA }}>Copiar el pedido</button>
        </section>

        <section className="min-w-0 rounded-2xl bg-white p-5 sm:p-6 lg:col-span-7" style={{ border: `1.5px solid ${LINEA}` }}>
          <h2 className="flex items-center gap-2 text-[1.7rem] font-medium leading-tight" style={{ fontFamily: SERIF }}><TrendingUp size={26} style={{ color: VINO }} /> Proyección al ritmo actual</h2>
          <ul className="mt-3 grid gap-2 text-[1.08rem] leading-snug">
            <li>Se proyecta cerrar {MESES[hoy.getMonth()]} en <b>{qz(cierreNov)}</b>{cierreNov >= meta ? <>, con lo que <b style={{ color: "#1f5a37" }}>se supera la meta</b> de {qz(meta)}.</> : <>. Faltarían <b style={{ color: VINO }}>{qz(meta - cierreNov)}</b> para alcanzar la meta de {qz(meta)}.</>}</li>
            <li>El primer producto en agotarse será <b>{primero.pr.nombre}</b>, en aproximadamente <b>{Math.max(0, primero.dias)} días</b>.</li>
            <li>{MESES[(hoy.getMonth() + 1) % 12][0].toUpperCase() + MESES[(hoy.getMonth() + 1) % 12].slice(1)} registra mayor demanda: se estiman <b>{qz(dic)}</b> en ventas. Se recomienda reponer con anticipación.</li>
          </ul>
          <svg viewBox="0 0 640 250" className="mt-4 w-full" role="img" aria-label="Ingresos y gastos por mes">
            {[0, 0.5, 1].map((r) => <line key={r} x1="40" x2="636" y1={200 - r * 170} y2={200 - r * 170} stroke={LINEA} />)}
            {barras.map((b, i) => {
              const x = 56 + i * 82;
              const hI = (b.ingresos / tope) * 170;
              const hG = (b.gastos / tope) * 170;
              return (
                <g key={b.mes}>
                  <rect x={x} y={200 - hI} width="30" height={hI} rx="4" fill={b.prevision ? "none" : VINO} stroke={VINO} strokeWidth="2" strokeDasharray={b.prevision ? "5 4" : undefined} />
                  <rect x={x + 33} y={200 - hG} width="30" height={hG} rx="4" fill={b.prevision ? "none" : ROSA} stroke={ROSA} strokeWidth="2" strokeDasharray={b.prevision ? "5 4" : undefined} />
                  <text x={x + 31} y="222" textAnchor="middle" fontSize="15" fontWeight={b.actual ? 700 : 400} fill={TINTA}>{b.mes}{b.prevision ? "*" : ""}</text>
                  <text x={x + 15} y={196 - hI} textAnchor="middle" fontSize="12" fill={TINTA}>{(b.ingresos / 1000).toFixed(1)}k</text>
                </g>
              );
            })}
          </svg>
          <p className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.95rem]"><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm" style={{ background: VINO }} /> Ventas</span><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm" style={{ background: ROSA }} /> Gasto en mercadería</span><span className="opacity-65">* proyección</span></p>
        </section>
      </div>

      <section className="rounded-2xl bg-white p-5 sm:p-6" style={{ border: `1.5px solid ${LINEA}` }}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[1.7rem] font-medium leading-tight" style={{ fontFamily: SERIF }}>Productos con mayor demanda</h2>
            <p className="mt-0.5 text-[1rem] opacity-65">Unidades vendidas por mes.</p>
          </div>
        </div>
        <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2 xl:grid-cols-3">
          {ritmoVenta.slice(0, 6).map((f, i) => (
            <li key={f.pr.id} className="flex items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[0.95rem] font-bold text-white" style={{ background: i < 3 ? VINO : TINTA }}>{i + 1}</span>
              <span className="min-w-0 flex-1"><span className="flex justify-between gap-2 text-[1.02rem]"><b className="truncate">{f.pr.nombre}</b><span className="shrink-0 tabular-nums">{f.ritmo} u./mes</span></span><span className="mt-1 block h-2.5 overflow-hidden rounded-full" style={{ background: LINEA }}><span className="block h-full rounded-full" style={{ width: `${(f.ritmo / ritmoVenta[0].ritmo) * 100}%`, background: VINO }} /></span></span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[1.7rem] font-medium leading-tight" style={{ fontFamily: SERIF }}>Detalle por producto</h2>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar productos">
            {([["todos", "Todos"], ["ya", "Reponer ya"], ["pronto", "Reponer pronto"], ["bien", "Stock suficiente"]] as const).map(([v, t]) => <button key={v} type="button" aria-pressed={filtro === v} onClick={() => setFiltro(v)} className="min-h-[2.75rem] rounded-full border-2 px-4 text-[1rem] font-semibold" style={filtro === v ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(42,22,51,.25)", background: "#fff" }}>{t}</button>)}
            <span className="ml-1 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1" style={{ border: `1.5px solid ${LINEA}` }}>
              <span className="text-[0.95rem]">Alertar con</span>
              <button type="button" aria-label="Menos" onClick={() => ponerMinimo(Math.max(0, minimo - 1))} className="grid h-9 w-9 place-items-center rounded-full border-2" style={{ borderColor: "rgba(42,22,51,.25)" }}><Minus size={15} /></button>
              <b className="w-5 text-center text-[1.1rem]">{minimo}</b>
              <button type="button" aria-label="Más" onClick={() => ponerMinimo(minimo + 1)} className="grid h-9 w-9 place-items-center rounded-full border-2" style={{ borderColor: "rgba(42,22,51,.25)" }}><Plus size={15} /></button>
              <span className="text-[0.95rem]">o menos unidades</span>
            </span>
          </div>
        </div>
        <ul className="pf-auto mt-4" style={{ ["--min" as string]: "21rem" }}>
          {visibles.map((f) => <Tarjeta key={f.pr.id} f={f} apartado={apartado(f.pr.id)} stockReal={stock[f.pr.id] ?? 0} sumar={sumar} />)}
        </ul>
      </section>
    </div>
  );
}

function Tarjeta({ f, apartado, stockReal, sumar }: { f: { pr: Producto; disp: number; ritmo: number; dias: number; nivel: Nivel }; apartado: number; stockReal: number; sumar: (id: string, n: number) => void }) {
  const N = NIVELES[f.nivel];
  const Icono = f.nivel === "ya" ? AlertTriangle : f.nivel === "pronto" ? Clock : CheckCircle2;
  return (
    <li className="flex min-w-0 flex-col rounded-2xl bg-white p-4" style={{ border: `1.5px solid ${f.nivel === "ya" ? N.color : LINEA}` }}>
      <div className="flex items-center gap-3">
        <img src={f.pr.foto} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
        <span className="min-w-0 flex-1 leading-tight"><b className="block text-[1.12rem]">{f.pr.nombre}</b><span className="text-[0.92rem] opacity-65">{f.pr.marca} · {qz(f.pr.precio)}</span></span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[0.85rem] font-bold" style={{ background: N.fondo, color: N.color }}><Icono size={14} /> {N.t}</span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="leading-none"><span className="text-[2.6rem] font-semibold" style={{ fontFamily: SERIF }}>{stockReal}</span><span className="ml-1.5 text-[1rem] opacity-65">disponibles</span></div>
        <span className="flex items-center gap-1">
          <button type="button" aria-label={`Uno menos de ${f.pr.nombre}`} onClick={() => sumar(f.pr.id, -1)} className="grid h-11 w-11 place-items-center rounded-full border-2" style={{ borderColor: "rgba(42,22,51,.25)" }}><Minus size={18} /></button>
          <button type="button" aria-label={`Uno más de ${f.pr.nombre}`} onClick={() => sumar(f.pr.id, 1)} className="grid h-11 w-11 place-items-center rounded-full border-2" style={{ borderColor: "rgba(42,22,51,.25)" }}><Plus size={18} /></button>
        </span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full" style={{ background: LINEA }}><div className="h-full rounded-full" style={{ width: `${Math.max(5, Math.min(100, (f.dias / 45) * 100))}%`, background: N.color }} /></div>
      <p className="mt-2 text-[0.98rem] leading-snug"><b>{f.dias <= 0 ? "Sin cobertura" : `Cobertura: ${f.dias} días`}</b> · Ventas: {f.ritmo} u./mes{apartado ? ` · ${apartado} apartada${apartado > 1 ? "s" : ""}` : ""}</p>
    </li>
  );
}
