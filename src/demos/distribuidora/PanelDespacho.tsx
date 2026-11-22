/*
 * Oficina de Distribuidora El Volcán: la mesa de despacho.
 * Identidad propia: negro de camión, rojo volcán y papel kraft; Archivo Narrow para títulos y números y Archivo para lo demás.
 * Lo que se ve primero: cada camión con sus paradas y cuánto lleva cargado. Lo que se llena: la carga y el cobro de los créditos.
 */
import { useMemo, useState, type ReactNode } from "react";
import { Banknote, Check, PackageSearch, Truck } from "lucide-react";
import { MensajeWhatsApp } from "../comun";
import { DIAS, KRAFT, KRAFT2, PEDIDO_MINIMO, PRODUCTOS, RUTAS, SELLO, TIENDAS, VERDE, porId, qz, totalDe, type Dist, type Pedido } from "./datos";

const NEGRO = "#1a1a1c";
const PAPEL = "#f4ead7";
const TITULO = "'Archivo Narrow', 'Barlow Condensed', system-ui, sans-serif";
const CUERPO = "'Archivo', 'Instrument Sans', system-ui, sans-serif";
const MONO = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const AMBAR = "#a36a00";

function Btn({ children, alTocar, tipo = "negro", ancho = false }: { children: ReactNode; alTocar: () => void; tipo?: "negro" | "rojo" | "borde"; ancho?: boolean }) {
  const s = tipo === "negro" ? { background: NEGRO, color: PAPEL } : tipo === "rojo" ? { background: SELLO, color: "#fff" } : { background: "transparent", color: NEGRO, border: `2px solid ${NEGRO}` };
  return <button type="button" onClick={alTocar} className={`inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded px-4 py-2 text-[0.92rem] font-bold uppercase tracking-wide transition hover:brightness-125 active:translate-y-px ${ancho ? "w-full" : ""}`} style={s}>{children}</button>;
}

export default function PanelDespacho({ d }: { d: Dist }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [vista, setVista] = useState<"camiones" | "creditos" | "bodega">("camiones");
  const vendido = d.pedidos.reduce((s, p) => s + totalDe(p.lineas), 0);
  const cobrado = d.pedidos.reduce((s, p) => s + p.cobrado, 0);
  const contadoPend = d.pedidos.filter((p) => p.pago === "contado" && p.estado !== "entregado").reduce((s, p) => s + totalDe(p.lineas), 0);
  const nuevos = d.pedidos.filter((p) => p.estado === "nuevo").length;
  const vencido = TIENDAS.filter((t) => (t.vence ?? 1) < 0).reduce((s, t) => s + t.saldo, 0);
  const creditos = TIENDAS.filter((t) => t.saldo > 0).sort((a, b) => (a.vence ?? 99) - (b.vence ?? 99));
  const bajos = PRODUCTOS.filter((p) => p.hay < 10).sort((a, b) => a.hay - b.hay);
  const estado = (p: Pedido) => (p.estado === "nuevo" ? { t: "Por cargar", c: SELLO } : p.estado === "en-ruta" ? { t: "En ruta", c: AMBAR } : { t: "Entregado", c: VERDE });

  const porRuta = useMemo(() => RUTAS.map((r) => {
    const pedidos = d.pedidos.filter((p) => porId(TIENDAS, p.tienda).ruta === r.id);
    const carga: Record<string, number> = {};
    pedidos.filter((p) => p.estado === "nuevo").forEach((p) => p.lineas.forEach((l) => (carga[l.id] = (carga[l.id] ?? 0) + l.n)));
    const cargados = pedidos.filter((p) => p.estado !== "nuevo").length;
    return { r, pedidos, carga: Object.entries(carga), cargados, total: pedidos.reduce((s, p) => s + totalDe(p.lineas), 0), efectivo: pedidos.reduce((s, p) => s + p.cobrado, 0) };
  }), [d.pedidos]);

  return (
    <div className="min-h-[calc(100vh-8rem)]" style={{ background: PAPEL, color: NEGRO, fontFamily: CUERPO }}>
      <header style={{ background: NEGRO }} className="text-white">
        <div className="h-3" style={{ background: `repeating-linear-gradient(90deg, ${SELLO} 0 32px, ${NEGRO} 32px 64px)` }} aria-hidden />
        <div className="mx-auto flex max-w-7xl flex-wrap items-end gap-x-8 gap-y-3 px-5 py-4">
          <div><p className="text-[0.78rem] font-bold uppercase tracking-[0.2em] opacity-60" style={{ fontFamily: MONO }}>Panel de oficina · {DIAS[new Date().getDay()]}</p><h1 className="text-[3rem] font-extrabold uppercase leading-[0.9]" style={{ fontFamily: TITULO }}>Distribuidora El Volcán</h1></div>
          <div className="ml-auto flex flex-wrap gap-x-8 gap-y-1">{[[qz(vendido), "vendido hoy", "#fff"], [qz(cobrado), "cobrado por pilotos", "#8be0a8"], [String(nuevos), "pedidos por cargar", "#ffd37a"], [qz(vencido), "crédito vencido", "#ff9aa8"]].map(([n, t, c]) => <p key={t}><b className="block text-[1.9rem] leading-none" style={{ fontFamily: TITULO, color: c }}>{n}</b><span className="text-[0.78rem] opacity-65">{t}</span></p>)}</div>
        </div>
        <nav aria-label="Oficina" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3">
          {([["camiones", "Camiones y rutas"], ["creditos", "Créditos"], ["bodega", "Bodega"]] as const).map(([id, t]) => <button key={id} type="button" onClick={() => setVista(id)} aria-current={vista === id ? "page" : undefined} className="px-5 py-3 text-[1.1rem] font-extrabold uppercase tracking-wide" style={{ fontFamily: TITULO, ...(vista === id ? { background: PAPEL, color: NEGRO } : { color: "rgba(255,255,255,.7)" }) }}>{t}</button>)}
          <button type="button" onClick={d.reiniciar} className="ml-auto shrink-0 self-center whitespace-nowrap px-3 text-[0.85rem] underline opacity-60">Volver a los datos de ejemplo</button>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        {vista === "camiones" && (
          <>
            <p className="mb-4 max-w-3xl opacity-75">Cada columna es un camión. Cargue los pedidos nuevos y la hoja de carga se arma sola. El efectivo que sube es el que el piloto va marcando.</p>
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {porRuta.map(({ r, pedidos, carga, cargados, total, efectivo }) => (
                <section key={r.id} aria-label={r.nombre} className="flex flex-col rounded" style={{ background: "#fff", border: `3px solid ${NEGRO}` }}>
                  <div className="p-4 text-white" style={{ background: NEGRO }}>
                    <div className="flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-[1.8rem] font-extrabold uppercase leading-none" style={{ fontFamily: TITULO }}><Truck size={24} style={{ color: "#ffd37a" }} /> {r.nombre}</h2><span className="rounded px-2 py-0.5 text-[0.78rem] font-bold" style={{ background: SELLO, fontFamily: MONO }}>{r.camion}</span></div>
                    <p className="mt-1 text-[0.88rem] opacity-75">{r.piloto} · {r.zona}</p>
                    <div className="mt-3 flex gap-1" aria-label={`${cargados} de ${pedidos.length} pedidos cargados`}>{pedidos.map((p) => <span key={p.num} className="h-2.5 flex-1" style={{ background: p.estado === "entregado" ? VERDE : p.estado === "en-ruta" ? "#ffd37a" : "rgba(255,255,255,.25)" }} />)}</div>
                    <p className="mt-1 text-[0.8rem] opacity-70" style={{ fontFamily: MONO }}>{cargados}/{pedidos.length} cargados · {qz(total)} en pedidos · {qz(efectivo)} en efectivo</p>
                  </div>
                  <ul className="flex-1 divide-y px-4" style={{ borderColor: KRAFT }}>
                    {pedidos.map((p, i) => { const t = porId(TIENDAS, p.tienda), e = estado(p); return (
                      <li key={p.num} className="py-3">
                        <div className="flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded text-[0.9rem] font-bold text-white" style={{ background: p.estado === "entregado" ? VERDE : NEGRO, fontFamily: MONO }}>{i + 1}</span>
                          <div className="min-w-0 flex-1"><b className="block leading-tight">{t.nombre} {p.nuevo && <span className="ml-1 rounded px-1.5 py-0.5 text-[0.68rem] text-white" style={{ background: SELLO }}>recién llegado</span>}</b><span className="text-[0.82rem] opacity-65">#{p.num} · {p.hora} · {p.lineas.length} productos · {p.pago === "credito" ? "crédito" : "contado"}</span></div>
                          <div className="text-right"><b className="block tabular-nums">{qz(totalDe(p.lineas))}</b><span className="text-[0.75rem] font-bold uppercase" style={{ color: e.c }}>{e.t}</span></div></div>
                        {p.estado === "nuevo" && <div className="mt-2 pl-11"><Btn alTocar={() => d.cargar(p.num)} tipo="negro"><Truck size={15} /> Cargar al camión</Btn></div>}
                      </li>
                    ); })}
                    {pedidos.length === 0 && <li className="py-4 opacity-60">Sin pedidos para esta ruta.</li>}
                  </ul>
                  <div className="m-4 mt-0 rounded p-3" style={{ background: PAPEL, border: `1.5px dashed ${NEGRO}` }}>
                    <p className="text-[0.75rem] font-bold uppercase tracking-wider opacity-60">Hoja de carga</p>
                    {carga.length === 0 ? <p className="mt-1 flex items-center gap-2 text-[0.9rem] font-bold" style={{ color: VERDE }}><Check size={16} /> Todo cargado</p> : <ul className="mt-1 grid gap-0.5 text-[0.9rem]">{carga.map(([id, n]) => <li key={id} className="flex justify-between"><span>{porId(PRODUCTOS, id).nombre}</span><b style={{ fontFamily: MONO }}>{n}</b></li>)}</ul>}
                  </div>
                </section>
              ))}
            </div>
            <p className="mt-4 text-[0.88rem] opacity-65">Pedido mínimo: {qz(PEDIDO_MINIMO)}. Contado por cobrar en la calle: <b>{qz(contadoPend)}</b>.</p>
          </>
        )}

        {vista === "creditos" && (
          <section>
            <h1 className="text-[2.2rem] font-extrabold uppercase leading-none" style={{ fontFamily: TITULO }}>Créditos por cobrar</h1>
            <p className="mt-1 opacity-70">Lo vencido va primero. Un toque arma el recordatorio con el monto y los días.</p>
            <div className="mt-4 overflow-x-auto rounded" style={{ background: "#fff", border: `3px solid ${NEGRO}` }}>
              <table className="w-full min-w-[40rem] text-[0.95rem]">
                <thead><tr className="text-left text-[0.72rem] font-bold uppercase tracking-wider opacity-60"><th className="p-3">Tienda</th><th>Dueño</th><th className="text-right">Límite</th><th className="text-right">Saldo</th><th>Vence</th><th className="p-3" /></tr></thead>
                <tbody>
                  {creditos.map((t) => { const v = t.vence ?? 0, ya = d.recordados.includes(t.id); return (
                    <tr key={t.id} className="border-t" style={{ borderColor: KRAFT }}>
                      <td className="p-3 font-bold">{t.nombre}</td><td>{t.dueno}</td><td className="text-right tabular-nums" style={{ fontFamily: MONO }}>{qz(t.credito)}</td><td className="text-right font-bold tabular-nums" style={{ fontFamily: MONO }}>{qz(t.saldo)}</td>
                      <td><span className="rounded px-2 py-0.5 text-[0.78rem] font-bold uppercase text-white" style={{ background: v < 0 ? SELLO : v < 3 ? AMBAR : VERDE }}>{v < 0 ? `hace ${-v} días` : `en ${v} días`}</span></td>
                      <td className="p-3 text-right"><Btn tipo={v < 0 ? "rojo" : "borde"} alTocar={() => { d.recordar(t.id); setMsg(`Buen día, ${t.dueno.split(" ")[0]}. Le saludamos de Distribuidora El Volcán. Su saldo de ${qz(t.saldo)} ${v < 0 ? `venció hace ${-v} días` : `vence en ${v} días`}. Puede pasar a pagar o se lo recogemos con el piloto en la próxima visita.`); }}><Banknote size={15} /> {ya ? "Recordado" : "Recordarle"}</Btn></td>
                    </tr>
                  ); })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {vista === "bodega" && (
          <section>
            <h1 className="text-[2.2rem] font-extrabold uppercase leading-none" style={{ fontFamily: TITULO }}>Por acabarse en bodega</h1>
            <p className="mt-1 opacity-70">Lo que baja de 10 sale primero. Un toque arma el pedido al proveedor.</p>
            <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {bajos.map((p) => (
                <li key={p.id} className="rounded p-4" style={{ background: "#fff", border: `3px solid ${p.hay === 0 ? SELLO : NEGRO}` }}>
                  <div className="flex items-start gap-3"><PackageSearch size={26} style={{ color: p.hay === 0 ? SELLO : AMBAR }} className="shrink-0" /><div className="min-w-0 flex-1"><b className="block leading-tight">{p.nombre}</b><span className="text-[0.82rem] opacity-65">{p.unidad}</span></div><b className="text-[2rem] leading-none" style={{ fontFamily: TITULO, color: p.hay === 0 ? SELLO : AMBAR }}>{p.hay}</b></div>
                  <div className="mt-3"><Btn tipo={p.hay === 0 ? "rojo" : "negro"} alTocar={() => setMsg(`Buen día. Le escribe Distribuidora El Volcán. Necesitamos ${Math.max(20, 40 - p.hay)} de: ${p.nombre} (${p.unidad}). ¿Tiene disponible para entrega esta semana? Costo anterior: ${qz(p.precio)}.`)} ancho>Pedir al proveedor</Btn></div>
                </li>
              ))}
              {bajos.length === 0 && <li className="opacity-60">Nada por acabarse.</li>}
            </ul>
            <p className="mt-6 text-[0.85rem] uppercase tracking-wider opacity-50" style={{ background: KRAFT2, height: 6 }} aria-hidden />
          </section>
        )}
      </main>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="distribuidora" que="el mensaje" />
    </div>
  );
}
