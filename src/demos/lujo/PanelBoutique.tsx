/*
 * Libro de la dueña de Maison Solène: el libro de registro.
 * Identidad propia: papel marfil con filetes dobles, negro tinta y bronce; Cormorant Garamond en versalitas y Karla para lo demás.
 * Lo que se ve primero: qué piezas hay, cuáles están apartadas y a quién se le debe. Lo que se llena: el estado de cada pieza y el pago al consignante.
 */
import { useState } from "react";
import { Check, X } from "lucide-react";
import { MensajeWhatsApp, qz } from "../comun";
import { PARTE_CONSIGNANTE, PIEZAS, estadoDe, type Datos, type Estado, type Pieza } from "./datos";

const MARFIL = "#e6ebe3";
const TINTA = "#0f2a21";
const BRONCE = "#9a7440";
const FILETE = "rgba(15,42,33,.25)";
const VERDE = "#2f6b4a";
const ROJO = "#9c3b2e";
const TITULO = "'Bodoni Moda', Georgia, serif";
const CUERPO = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

const doble = { borderTop: `3px double ${TINTA}`, borderBottom: `3px double ${TINTA}` } as const;
const versal = "uppercase tracking-[0.18em]";
const TABS = ["Piezas", "Apartados", "Consignantes", "Ofertas", "Deseos", "Cuentas"] as const;
type Tab = (typeof TABS)[number];
const ESTADO: Record<Estado, string> = { disponible: "Disponible", apartada: "Apartada", vendida: "Vendida" };

function Btn({ children, alTocar, solido = false }: { children: React.ReactNode; alTocar: () => void; solido?: boolean }) {
  return <button type="button" onClick={alTocar} className={`inline-flex min-h-[2.75rem] items-center justify-center gap-2 px-4 py-2 text-[0.82rem] font-bold ${versal} transition hover:opacity-85 active:translate-y-px`} style={solido ? { background: TINTA, color: MARFIL, border: `1.5px solid ${TINTA}` } : { border: `1.5px solid ${TINTA}`, color: TINTA }}>{children}</button>;
}

export default function PanelBoutique({ d, setD, inicial, alSalir }: { d: Datos; setD: React.Dispatch<React.SetStateAction<Datos>>; inicial: Datos; alSalir: () => void }) {
  const [tab, setTab] = useState<Tab>("Piezas");
  const [filtro, setFiltro] = useState<"todas" | Estado>("todas");
  const [msg, setMsg] = useState<string | null>(null);

  const poner = (id: string, e: Estado) => setD((x) => ({ ...x, estados: { ...x.estados, [id]: e } }));
  const propias = (p: Pieza) => p.duena === "Maison Solène";
  const vendidas = PIEZAS.filter((p) => estadoDe(d, p.id) === "vendida");
  const apartadas = PIEZAS.filter((p) => estadoDe(d, p.id) === "apartada");
  const ventas = vendidas.reduce((s, p) => s + p.precio, 0);
  const ganancia = vendidas.reduce((s, p) => s + (propias(p) ? p.precio : Math.round(p.precio * (1 - PARTE_CONSIGNANTE))), 0);
  const porPagar = vendidas.filter((p) => !propias(p) && !d.pagadas.includes(p.id));
  const duenas = [...new Set(PIEZAS.filter((p) => !propias(p)).map((p) => p.duena))];
  const nuevas = d.solicitudes.filter((s) => s.estado === "nueva");
  const lista = PIEZAS.filter((p) => filtro === "todas" || estadoDe(d, p.id) === filtro);
  const porCat = ["Moda", "Bolsos", "Zapatos", "Joyería", "Interiores"].map((c) => ({ c, v: vendidas.filter((p) => p.categoria === c).reduce((s, p) => s + p.precio, 0) })).filter((x) => x.v > 0);
  const maxCat = Math.max(1, ...porCat.map((x) => x.v));
  const aviso = (t: Tab) => (t === "Apartados" ? apartadas.length : t === "Consignantes" ? porPagar.length : t === "Ofertas" ? nuevas.length : 0);

  return (
    <div className="panel-demo min-h-[calc(100vh-8rem)] pb-14" style={{ background: MARFIL, color: TINTA, fontFamily: CUERPO }}>
      <header className="mx-auto max-w-6xl px-5 pt-8 text-center">
        <p className={`text-[0.75rem] ${versal} opacity-70`} style={{ color: BRONCE }}>Panel de la dueña</p>
        <h1 className="mt-1 text-[3.2rem] italic leading-none" style={{ fontFamily: TITULO, fontWeight: 500 }}>Maison Solène</h1>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 py-3" style={doble}>
          {[["Piezas disponibles", String(PIEZAS.filter((p) => estadoDe(d, p.id) === "disponible").length)], ["Apartadas", String(apartadas.length)], ["Vendido", qz(ventas)], ["Ganancia de la Maison", qz(ganancia)]].map(([t, v]) => <p key={t} className="text-center"><b className="block text-[1.9rem] leading-none" style={{ fontFamily: TITULO, fontWeight: 600 }}>{v}</b><span className={`text-[0.68rem] ${versal} opacity-65`}>{t}</span></p>)}
        </div>
        <nav aria-label="Libro" className="mt-4 flex flex-wrap items-center justify-center gap-1">
          {TABS.map((t) => <button key={t} type="button" onClick={() => setTab(t)} aria-current={tab === t ? "page" : undefined} className={`min-h-[2.75rem] px-4 text-[0.8rem] font-bold ${versal}`} style={tab === t ? { borderBottom: `3px solid ${BRONCE}`, color: TINTA } : { color: "rgba(20,17,15,.55)", borderBottom: "3px solid transparent" }}>{t}{aviso(t) > 0 && <sup className="ml-1" style={{ color: ROJO }}>{aviso(t)}</sup>}</button>)}
          <button type="button" onClick={() => setD(inicial)} className="ml-4 text-[0.82rem] underline opacity-60">Reiniciar ejemplo</button>
          <button type="button" onClick={alSalir} className="text-[0.82rem] underline opacity-60">Ver la boutique</button>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 pt-6">
        {tab === "Piezas" && (
          <>
            <div className="mb-3 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por estado">
              {(["todas", "disponible", "apartada", "vendida"] as const).map((f) => <button key={f} type="button" aria-pressed={filtro === f} onClick={() => setFiltro(f)} className={`min-h-[2.5rem] px-3.5 text-[0.75rem] font-bold ${versal}`} style={filtro === f ? { background: TINTA, color: MARFIL } : { border: `1px solid ${FILETE}` }}>{f === "todas" ? "Todas" : ESTADO[f]}</button>)}
              <span className="ml-auto text-[0.85rem] opacity-60">Un toque cambia el estado y la boutique se actualiza sola.</span>
            </div>
            <div className="overflow-x-auto" style={{ borderTop: `1px solid ${FILETE}` }}>
              <table className="w-full min-w-[44rem] text-[0.92rem]">
                <thead><tr className={`text-left text-[0.68rem] ${versal} opacity-60`}><th className="py-2">N.º</th><th /><th>Pieza</th><th>Origen</th><th className="text-right">Original</th><th className="text-right">Precio</th><th className="text-center">Estado</th></tr></thead>
                <tbody>
                  {lista.map((p) => { const e = estadoDe(d, p.id); return (
                    <tr key={p.id} className="border-t" style={{ borderColor: FILETE }}>
                      <td className="py-2 pr-2 italic opacity-60" style={{ fontFamily: TITULO, fontSize: "1.1rem" }}>{p.id.slice(1)}</td>
                      <td className="pr-3"><img src={p.foto} alt="" className="h-14 w-11 object-cover" /></td>
                      <td className="max-w-[16rem] py-2 pr-3"><b className="block leading-tight">{p.nombre}</b><span className="text-[0.8rem] opacity-60">{p.categoria}{p.talla ? ` · talla ${p.talla}` : ""} · {p.condicion}</span></td>
                      <td className="pr-3 text-[0.85rem]">{propias(p) ? "Propia" : p.duena}{e === "apartada" && d.apartadoPor[p.id] && <span className="block" style={{ color: BRONCE }}>Apartó {d.apartadoPor[p.id]}</span>}</td>
                      <td className="text-right tabular-nums line-through opacity-45">{qz(p.original)}</td>
                      <td className="text-right text-[1.05rem] font-bold tabular-nums">{qz(p.precio)}</td>
                      <td className="py-2 pl-3"><div className="mx-auto grid w-[16rem] grid-cols-3" role="group" aria-label={`Estado de ${p.nombre}`}>{(["disponible", "apartada", "vendida"] as Estado[]).map((x) => <button key={x} type="button" onClick={() => poner(p.id, x)} aria-pressed={e === x} className="min-h-[2.5rem] text-[0.7rem] font-bold uppercase tracking-wide" style={e === x ? { background: x === "vendida" ? TINTA : x === "apartada" ? BRONCE : VERDE, color: "#fff", border: `1px solid ${TINTA}` } : { border: `1px solid ${FILETE}`, opacity: 0.7 }}>{ESTADO[x]}</button>)}</div></td>
                    </tr>
                  ); })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "Apartados" && (
          <section>
            <h2 className="text-[2rem] italic" style={{ fontFamily: TITULO }}>Piezas apartadas</h2>
            <p className="opacity-70">Cada apartado tiene fecha límite. Si no concretan, la pieza vuelve a la vitrina.</p>
            <ul className="mt-3 grid gap-3 md:grid-cols-2">
              {apartadas.map((p, i) => (
                <li key={p.id} className="flex gap-4 p-4" style={{ border: `1px solid ${FILETE}`, background: "#fffdf8" }}>
                  <img src={p.foto} alt="" className="h-28 w-22 shrink-0 object-cover" style={{ width: 88 }} />
                  <div className="min-w-0 flex-1"><p className="text-[1.3rem] italic leading-tight" style={{ fontFamily: TITULO }}>{p.nombre}</p><p className="text-[0.88rem]">Apartó <b>{d.apartadoPor[p.id] ?? "una clienta"}</b> · abono {qz(Math.round(p.precio * 0.2))} de {qz(p.precio)}</p><p className="text-[0.85rem] font-bold" style={{ color: i === 0 ? ROJO : BRONCE }}>Vence en {i === 0 ? 2 : 5} días</p>
                    <div className="mt-2 flex flex-wrap gap-2"><Btn alTocar={() => setMsg(`Hola, ${(d.apartadoPor[p.id] ?? "").split(" ")[0] || "buenas"}. Te escribimos de Maison Solène. Tu apartado de «${p.nombre}» vence en ${i === 0 ? 2 : 5} días. Quedan ${qz(p.precio - Math.round(p.precio * 0.2))} para completar. ¿Pasas por ella esta semana?`)}>Recordarle</Btn><Btn alTocar={() => poner(p.id, "vendida")} solido><Check size={14} /> Se concretó</Btn></div></div>
                </li>
              ))}
              {apartadas.length === 0 && <li className="opacity-60">No hay piezas apartadas.</li>}
            </ul>
          </section>
        )}

        {tab === "Consignantes" && (
          <section>
            <h2 className="text-[2rem] italic" style={{ fontFamily: TITULO }}>Cuentas con quienes consignan</h2>
            <p className="opacity-70">Reciben el {PARTE_CONSIGNANTE * 100}% de cada pieza vendida.</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {duenas.map((n) => {
                const suyas = PIEZAS.filter((p) => p.duena === n), vend = suyas.filter((p) => estadoDe(d, p.id) === "vendida"), pend = vend.filter((p) => !d.pagadas.includes(p.id));
                const total = pend.reduce((s, p) => s + Math.round(p.precio * PARTE_CONSIGNANTE), 0);
                return (
                  <article key={n} className="p-4" style={{ border: `1px solid ${FILETE}`, background: "#fffdf8" }}>
                    <p className="text-[1.4rem] italic leading-tight" style={{ fontFamily: TITULO }}>{n}</p>
                    <p className="text-[0.88rem] opacity-70">{suyas.length} piezas dejadas · {vend.length} vendidas</p>
                    <div className="mt-2 flex items-end justify-between gap-3"><p><span className={`block text-[0.68rem] ${versal} opacity-60`}>Se le debe</span><b className="text-[1.8rem] leading-none" style={{ fontFamily: TITULO, color: total ? ROJO : VERDE }}>{qz(total)}</b></p>
                      {total > 0 ? <Btn alTocar={() => setD((x) => ({ ...x, pagadas: [...x.pagadas, ...pend.map((p) => p.id)] }))} solido><Check size={14} /> Marcar pagado</Btn> : <span className="font-bold" style={{ color: VERDE }}>Al día</span>}</div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {tab === "Ofertas" && (
          <section>
            <h2 className="text-[2rem] italic" style={{ fontFamily: TITULO }}>Piezas que les ofrecen</h2>
            <ul className="mt-3 grid gap-3 md:grid-cols-2">
              {d.solicitudes.map((s) => (
                <li key={s.id} className="p-4" style={{ border: `1px solid ${FILETE}`, background: "#fffdf8" }}>
                  <p className="text-[1.3rem] italic leading-tight" style={{ fontFamily: TITULO }}>{s.pieza}</p>
                  <p className="text-[0.88rem] opacity-70">{s.nombre} · {s.categoria} · le costó {qz(s.pagado)}</p>
                  {s.estado === "nueva" ? <div className="mt-3 flex gap-2"><Btn alTocar={() => setD((x) => ({ ...x, solicitudes: x.solicitudes.map((y) => (y.id === s.id ? { ...y, estado: "aceptada" } : y)) }))} solido><Check size={14} /> Aceptar</Btn><Btn alTocar={() => setD((x) => ({ ...x, solicitudes: x.solicitudes.map((y) => (y.id === s.id ? { ...y, estado: "rechazada" } : y)) }))}><X size={14} /> No entra</Btn></div> : <p className="mt-2 font-bold" style={{ color: s.estado === "aceptada" ? VERDE : "#777" }}>{s.estado === "aceptada" ? "Aceptada: coordinar revisión" : "No entra"}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === "Deseos" && (
          <section>
            <h2 className="text-[2rem] italic" style={{ fontFamily: TITULO }}>Lista de deseos</h2>
            <p className="opacity-70">Escríbales antes de publicar la pieza.</p>
            <ul className="mt-3 grid gap-3 md:grid-cols-2">
              {d.deseos.map((x) => <li key={x.id} className="flex items-center justify-between gap-3 p-4" style={{ border: `1px solid ${FILETE}`, background: "#fffdf8" }}><span><b className="block">{x.nombre}</b><span className="text-[0.9rem] opacity-75">Busca: {x.busca}</span></span><Btn alTocar={() => setMsg(`Hola, ${x.nombre.split(" ")[0]}. Te escribimos de Maison Solène. Acaba de llegar algo parecido a lo que buscabas (${x.busca.toLowerCase()}). ¿Te mandamos fotos antes de publicarlo?`)}>Avisarle</Btn></li>)}
            </ul>
          </section>
        )}

        {tab === "Cuentas" && (
          <section className="grid gap-5 lg:grid-cols-2">
            <div className="p-5" style={{ border: `1px solid ${FILETE}`, background: "#fffdf8" }}>
              <h2 className="text-[1.8rem] italic" style={{ fontFamily: TITULO }}>Lo vendido</h2>
              <dl className="mt-2 grid grid-cols-2 gap-y-2 text-[1rem]"><dt>Ventas</dt><dd className="text-right font-bold tabular-nums">{qz(ventas)}</dd><dt>Pagado a consignantes</dt><dd className="text-right tabular-nums">{qz(vendidas.filter((p) => !propias(p) && d.pagadas.includes(p.id)).reduce((s, p) => s + Math.round(p.precio * PARTE_CONSIGNANTE), 0))}</dd><dt>Por pagar a consignantes</dt><dd className="text-right tabular-nums" style={{ color: porPagar.length ? ROJO : "inherit" }}>{qz(porPagar.reduce((s, p) => s + Math.round(p.precio * PARTE_CONSIGNANTE), 0))}</dd><dt className="pt-2 font-bold" style={{ borderTop: `3px double ${TINTA}` }}>Ganancia de la Maison</dt><dd className="pt-2 text-right text-[1.4rem] font-bold tabular-nums" style={{ borderTop: `3px double ${TINTA}`, fontFamily: TITULO }}>{qz(ganancia)}</dd></dl>
            </div>
            <div className="p-5" style={{ border: `1px solid ${FILETE}`, background: "#fffdf8" }}>
              <h2 className="text-[1.8rem] italic" style={{ fontFamily: TITULO }}>Ventas por categoría</h2>
              <ul className="mt-3 grid gap-3">{porCat.map((x) => <li key={x.c}><div className="flex justify-between"><span>{x.c}</span><b className="tabular-nums">{qz(x.v)}</b></div><span className="mt-1 block h-2 bg-black/10"><span className="block h-full" style={{ width: `${(x.v / maxCat) * 100}%`, background: BRONCE }} /></span></li>)}{porCat.length === 0 && <li className="opacity-60">Todavía no hay ventas.</li>}</ul>
            </div>
          </section>
        )}
      </main>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="boutique de reventa de lujo" que="el mensaje" />
    </div>
  );
}
