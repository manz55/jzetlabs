/*
 * Bodega y calendario de Fiestas La Ceiba: el calendario de fiestas.
 * Identidad propia: anil, magenta y maíz con papel picado; Fraunces para los títulos y Karla para lo demás.
 * Lo que se ve primero: qué fines de semana están llenos y qué hay que cargar. Lo que se llena: la hoja de carga y lo que regresó.
 */
import { useMemo, useState, type ReactNode } from "react";
import { Check, Printer, Truck } from "lucide-react";
import { MensajeWhatsApp } from "../comun";
import { ANIL, ANIL2, CIELO, COLORES, HOJA, INVENTARIO, MAIZ, PASADO, ROSA, TURQ, clave, fechaCorta, fechaLarga, finesDeSemana, porId, qz, type Ev } from "./datos";

const PAPEL = "#fff9ee";
const TINTA = "#1b1f33";
const TITULO = "'Fraunces', Georgia, serif";
const CUERPO = "'Karla', 'Instrument Sans', system-ui, sans-serif";
const PICADO = [ROSA, MAIZ, HOJA, TURQ, "#ffffff"];

function Btn({ children, alTocar, tipo = "anil" }: { children: ReactNode; alTocar: () => void; tipo?: "anil" | "rosa" | "borde" }) {
  const s = tipo === "anil" ? { background: ANIL, color: "#fff" } : tipo === "rosa" ? { background: ROSA, color: "#fff" } : { background: "#fff", color: ANIL, border: `2px solid ${ANIL}` };
  return <button type="button" onClick={alTocar} className="inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-full px-5 py-2 text-[0.95rem] font-bold transition hover:brightness-110 active:scale-[0.97]" style={s}>{children}</button>;
}

export default function PanelFiestas({ ev }: { ev: Ev }) {
  const fines = useMemo(() => finesDeSemana(6), []);
  const [fecha, setFecha] = useState(clave(fines[0]));
  const [cargado, setCargado] = useState<Record<string, boolean>>({});
  const [cobrados, setCobrados] = useState<number[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const del = ev.eventos.filter((x) => x.fecha === fecha);
  const carga = INVENTARIO.map((a) => ({ a, n: ev.usados(fecha, a.id) })).filter((x) => x.n > 0);
  const fechaD = fines.find((f) => clave(f) === fecha)!;
  const faltante = PASADO.lineas.map((l) => { const a = porId(INVENTARIO, l.id); const volvio = ev.regreso[l.id] ?? l.n; return { a, salio: l.n, volvio, falta: Math.max(0, l.n - volvio) }; });
  const cobrarRepo = faltante.reduce((s, x) => s + x.falta * x.a.reposicion, 0);
  const saldos = ev.eventos.filter((x) => x.total > x.anticipo && !cobrados.includes(x.id)).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const porCobrar = saldos.reduce((s, x) => s + x.total - x.anticipo, 0);
  const anticipos = ev.eventos.reduce((s, x) => s + x.anticipo, 0);
  const listoCarga = carga.length > 0 && carga.every(({ a }) => cargado[`${fecha}-${a.id}`]);

  return (
    <div className="min-h-[calc(100vh-8rem)]" style={{ background: PAPEL, color: TINTA, fontFamily: CUERPO }}>
      <header style={{ background: ANIL2 }} className="relative overflow-hidden text-white">
        <div className="flex" aria-hidden>{Array.from({ length: 22 }, (_, i) => <span key={i} className="h-5 flex-1" style={{ background: PICADO[i % 5], clipPath: "polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)" }} />)}</div>
        <div className="mx-auto flex max-w-7xl flex-wrap items-end gap-x-8 gap-y-3 px-5 py-5">
          <div><p className="text-[0.8rem] font-bold uppercase tracking-[0.2em] opacity-70">Panel de bodega y calendario</p><h1 className="text-[2.6rem] leading-none" style={{ fontFamily: TITULO, fontWeight: 600 }}>Fiestas La Ceiba</h1></div>
          <div className="ml-auto flex flex-wrap gap-x-8 gap-y-1">{[[String(ev.eventos.length), "eventos apartados"], [qz(anticipos), "en anticipos"], [qz(porCobrar), "saldos por cobrar"]].map(([n, t]) => <p key={t}><b className="block text-[1.8rem] leading-none" style={{ fontFamily: TITULO, color: MAIZ }}>{n}</b><span className="text-[0.82rem] opacity-70">{t}</span></p>)}<button type="button" onClick={ev.reiniciar} className="self-end text-[0.85rem] underline opacity-70">Volver a los datos de ejemplo</button></div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        <section aria-label="Fines de semana">
          <h2 className="text-[1.4rem]" style={{ fontFamily: TITULO, fontWeight: 600 }}>Los próximos 6 fines de semana</h2>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {fines.map((f) => {
              const k = clave(f), n = ev.eventos.filter((x) => x.fecha === k).length, sel = fecha === k;
              return (
                <li key={k}><button type="button" onClick={() => setFecha(k)} aria-pressed={sel} className="w-full rounded-2xl p-3 text-left transition active:scale-[0.98]" style={sel ? { background: ANIL, color: "#fff", boxShadow: `0 0 0 3px ${MAIZ}` } : { background: "#fff", border: `2px solid ${ANIL}30` }}>
                  <span className="block text-[0.78rem] font-bold uppercase opacity-70">{f.toLocaleDateString("es-GT", { month: "short" })}</span>
                  <span className="block text-[2.4rem] leading-none" style={{ fontFamily: TITULO, fontWeight: 600 }}>{f.getDate()}</span>
                  <span className="mt-1 block text-[0.85rem] font-bold" style={{ color: sel ? MAIZ : n ? ROSA : HOJA }}>{n ? `${n} evento${n > 1 ? "s" : ""}` : "libre"}</span>
                </button></li>
              );
            })}
          </ul>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <section aria-label="Eventos del día" className="grid content-start gap-4">
            <h2 className="text-[1.4rem] capitalize" style={{ fontFamily: TITULO, fontWeight: 600 }}>{fechaLarga(fechaD)}</h2>
            {del.length === 0 && <p className="rounded-2xl bg-white p-5 opacity-75">No hay eventos este día. Todo el mobiliario está libre.</p>}
            {del.map((x) => (
              <article key={x.id} className="overflow-hidden rounded-2xl bg-white" style={{ border: `2px solid ${ANIL}25` }}>
                <div className="h-2.5" style={{ background: porId(COLORES, x.color).c }} />
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div><p className="text-[0.82rem] font-bold uppercase opacity-60">{x.tipo}</p><p className="text-[1.5rem] leading-tight" style={{ fontFamily: TITULO, fontWeight: 600 }}>{x.cliente} {x.nuevo && <span className="ml-1 rounded-full px-2 py-0.5 align-middle text-[0.7rem] text-white" style={{ background: ROSA }}>desde la página</span>}</p><p className="text-[0.92rem] opacity-75">{x.lugar} · montaje {x.montaje}</p></div>
                    <div className="text-right"><b className="block text-[1.4rem]" style={{ fontFamily: TITULO }}>{qz(x.total)}</b><span className="block text-[0.85rem]" style={{ color: HOJA }}>anticipo {qz(x.anticipo)}</span><span className="block text-[0.85rem] font-bold" style={{ color: cobrados.includes(x.id) ? HOJA : ROSA }}>{cobrados.includes(x.id) ? "saldo cobrado" : `saldo ${qz(x.total - x.anticipo)}`}</span></div>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-1.5">{x.lineas.map((l) => <li key={l.id} className="rounded-full px-3 py-1 text-[0.85rem]" style={{ background: CIELO }}>{l.n} {porId(INVENTARIO, l.id).nombre.toLowerCase()}</li>)}</ul>
                </div>
              </article>
            ))}
          </section>

          <aside className="grid content-start gap-5">
            <section className="rounded-2xl p-5 text-white" style={{ background: ANIL2 }}>
              <div className="flex items-start justify-between gap-2"><h2 className="flex items-center gap-2 text-[1.3rem]" style={{ fontFamily: TITULO, fontWeight: 600 }}><Truck size={20} /> Hoja de carga</h2><button type="button" onClick={() => window.print()} className="inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-full border border-white/40 px-3.5 text-[0.85rem] font-bold"><Printer size={15} /> Imprimir</button></div>
              <p className="text-[0.88rem] opacity-75 capitalize">{fechaCorta(fechaD)}. Marque cada cosa al subirla al camión.</p>
              {carga.length === 0 ? <p className="mt-3 opacity-70">Nada que cargar.</p> : (
                <ul className="mt-3 grid gap-1.5">
                  {carga.map(({ a, n }) => { const k = `${fecha}-${a.id}`, libres = a.total - n; return (
                    <li key={a.id}><label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5" style={{ background: cargado[k] ? "rgba(47,148,102,.35)" : "rgba(255,255,255,.08)" }}>
                      <input type="checkbox" checked={!!cargado[k]} onChange={() => setCargado((c) => ({ ...c, [k]: !c[k] }))} className="h-5 w-5" />
                      <span className="flex-1">{a.nombre}</span><b className="text-[1.15rem]">{n}</b><span className="w-20 text-right text-[0.8rem]" style={{ color: libres < 0 ? MAIZ : "rgba(255,255,255,.6)" }}>{libres < 0 ? `faltan ${-libres}` : `quedan ${libres}`}</span>
                    </label></li>
                  ); })}
                </ul>
              )}
              {listoCarga && <p className="mt-3 flex items-center gap-2 font-bold" style={{ color: MAIZ }}><Check size={18} /> Camión cargado</p>}
            </section>

            <section className="rounded-2xl bg-white p-5" style={{ border: `2px solid ${ANIL}25` }}>
              <h2 className="text-[1.3rem]" style={{ fontFamily: TITULO, fontWeight: 600 }}>Lo que regresó del sábado pasado</h2>
              <p className="text-[0.88rem] opacity-70">{PASADO.cliente}. Anote cuánto volvió de cada cosa.</p>
              <ul className="mt-3 grid gap-2">
                {faltante.map(({ a, salio, volvio, falta }) => (
                  <li key={a.id} className="flex items-center justify-between gap-3"><span className="min-w-0 flex-1 leading-tight">{a.nombre}<span className="block text-[0.8rem] opacity-60">salieron {salio}</span></span>
                    <input type="number" min={0} max={salio} value={volvio} onChange={(e) => ev.contar(a.id, Math.max(0, Math.min(salio, Number(e.target.value))))} aria-label={`Regresaron de ${a.nombre}`} className="h-11 w-20 rounded-lg border-2 bg-white px-2 text-center text-[1.05rem] font-bold" style={{ borderColor: ANIL }} />
                    <span className="w-20 text-right text-[0.88rem] font-bold" style={{ color: falta ? ROSA : HOJA }}>{falta ? `faltan ${falta}` : <Check size={18} className="ml-auto" />}</span></li>
                ))}
              </ul>
              <p className="mt-4 flex justify-between border-t pt-3 font-bold" style={{ borderColor: `${ANIL}25` }}><span>Cobrar por reposición</span><span style={{ color: cobrarRepo ? ROSA : HOJA }}>{qz(cobrarRepo)}</span></p>
              {cobrarRepo > 0 && <div className="mt-3"><Btn tipo="rosa" alTocar={() => setMsg(`Hola. Le escribimos de Fiestas La Ceiba. Al revisar lo que regresó de su evento (${PASADO.cliente}) faltaron: ${faltante.filter((x) => x.falta).map((x) => `${x.falta} ${x.a.nombre.toLowerCase()}`).join(", ")}. El cobro por reposición es de ${qz(cobrarRepo)}. Se puede descontar de su depósito. ¿Le parece bien?`)}>Mandar el cobro con el detalle</Btn></div>}
            </section>

            <section className="rounded-2xl bg-white p-5" style={{ border: `2px solid ${ANIL}25` }}>
              <h2 className="text-[1.3rem]" style={{ fontFamily: TITULO, fontWeight: 600 }}>Saldos por cobrar</h2>
              <ul className="mt-2 divide-y" style={{ borderColor: `${ANIL}20` }}>
                {saldos.map((x) => <li key={x.id} className="flex flex-wrap items-center gap-2 py-2.5"><span className="min-w-[8rem] flex-1 leading-tight"><b>{x.cliente}</b><span className="block text-[0.82rem] opacity-65">{x.tipo} · {x.fecha.slice(5)}</span></span><b style={{ color: ROSA }}>{qz(x.total - x.anticipo)}</b><Btn tipo="borde" alTocar={() => setMsg(`Hola, ${x.cliente.split(" ")[0]}. Le escribimos de Fiestas La Ceiba. Su evento (${x.tipo.toLowerCase()}) se acerca. El saldo pendiente es de ${qz(x.total - x.anticipo)}. ¿Le damos los datos para su pago?`)}>Recordar</Btn><Btn alTocar={() => setCobrados((c) => [...c, x.id])}><Check size={15} /> Cobrado</Btn></li>)}
                {saldos.length === 0 && <li className="py-3 opacity-60">Todo cobrado.</li>}
              </ul>
            </section>
          </aside>
        </div>
      </main>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="alquiler de mobiliario para eventos" que="el mensaje" />
    </div>
  );
}
