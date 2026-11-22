/*
 * Panel · Pagos: lo que hay que cobrar va arriba, luego las transferencias por confirmar, cuánto entra y por dónde,
 * y una sola tabla con todos los socios (activos e inactivos) y cómo van sus membresías.
 */
import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { AMARILLO, AZUL, PLANES, ROJO, faltan, fechaCorta, matriculaDe, porId, qz, type Gym, type Socio } from "./datos";
import { BORDE, Barra, Btn, Cuadro, GRIS, METODO, MONO, Opciones, TITULO, Tarjeta, h1, norm, type Aj, type Datos } from "./panelPiezas";

type Fil = "todos" | "al-dia" | "por-vencer" | "inactivos";

export default function PanelPagos({ gym, aj, d, avisar, setToast }: { gym: Gym; aj: Aj; d: Datos; avisar: (s: Socio) => void; setToast: (t: string) => void }) {
  const [fil, setFil] = useState<Fil>("todos");
  const ventasPlan = PLANES.map((p) => ({ p, t: d.confirmados.filter((x) => x.que.toLowerCase().includes(p.nombre.toLowerCase())).reduce((t, x) => t + x.monto, 0) })).filter((v) => v.t > 0);
  const maxVenta = Math.max(1, ...ventasPlan.map((v) => v.t));
  const porMetodo = Object.keys(METODO).map((m) => ({ m, t: d.confirmados.filter((x) => norm(x.metodo) === m).reduce((t, x) => t + x.monto, 0), n: d.confirmados.filter((x) => norm(x.metodo) === m).length }));
  const maxMetodo = Math.max(1, ...porMetodo.map((v) => v.t));
  const masUsado = [...porMetodo].sort((a, b) => b.n - a.n)[0];
  const ultimo = (n: number) => [...gym.pagos].reverse().find((x) => x.num === n);
  const filas = gym.socios.filter((s) => fil === "todos" || (fil === "inactivos" ? d.estado(s) === "vencidos" : d.estado(s) === fil));
  const kpi = (t: string, v: string, n: string, alerta = false) => (
    <div className="rounded-xl border bg-[#202326] p-5" style={{ borderColor: alerta ? ROJO : BORDE }}>
      <p className="text-[1rem] opacity-70">{t}</p>
      <p className="mt-1 text-[clamp(2rem,1.7rem+1vw,2.7rem)] font-bold leading-none tabular-nums" style={{ color: alerta ? "#ff9aa8" : undefined, fontFamily: TITULO }}>{v}</p>
      <p className="mt-2 text-[0.95rem] opacity-65">{n}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <div><h1 className={h1}>Pagos</h1><p className="text-[1.05rem] opacity-65">Los pagos de la página, de la app del socio y de recepción llegan aquí, cada uno con su método.</p></div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))" }}>
        {kpi("Cobrado hoy", qz(d.cobradoHoy), "pagos confirmados")}
        {kpi("Cobrado este mes", qz(d.cobradoMes), `${d.confirmados.length} pagos`)}
        {kpi("Por confirmar", qz(d.porConfirmar), `${d.pendientes.length} transferencias`, d.pendientes.length > 0)}
        {kpi("Por cobrar", qz(d.porCobrar), `${d.vencidas.length} membresías vencidas`, d.vencidas.length > 0)}
      </div>

      <section className="rounded-xl border-2 p-5 sm:p-6" style={{ borderColor: d.vencidas.length ? ROJO : BORDE, background: "#202326" }}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-[1.4rem] font-bold">Membresías por cobrar</h2><p className="text-[1rem] opacity-70">{d.vencidas.length ? `${d.vencidas.length} socios con la membresía vencida: ${qz(d.porCobrar)} en total.` : "Nadie debe."}</p></div></div>
        <ul className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 25rem), 1fr))" }}>
          {d.vencidas.map((s) => { const p = porId(PLANES, s.plan); return (
            <li key={s.num} className="flex flex-wrap items-center gap-3 rounded-lg p-4" style={{ background: GRIS, border: `1px solid ${BORDE}` }}>
              <span className="min-w-[8rem] flex-1 leading-tight"><b className="block text-[1.12rem]">{s.nombre}</b><span className="text-[0.98rem]" style={{ color: "#ff9aa8" }}>venció hace {-faltan(s.vence)} días · {qz(p.precio)}</span></span>
              {d.avisadoHoy(s.num) ? <span className="inline-flex items-center gap-1.5 text-[0.98rem] font-semibold opacity-70"><Check size={17} /> Avisado</span> : <Btn tipo="borde" alTocar={() => avisar(s)}><Bell size={16} /> Avisar</Btn>}
              <Btn alTocar={() => { gym.cobrar(s.num); setToast(`Cobro registrado a ${s.nombre.split(" ")[0]}.`); }}>Cobrar</Btn>
            </li>
          ); })}
        </ul>
      </section>

      {d.pendientes.length > 0 && (
        <Tarjeta titulo="Transferencias por confirmar" nota="El socio subió su comprobante. Al confirmar, el pago cuenta en los ingresos.">
          <ul className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 24rem), 1fr))" }}>
            {d.pendientes.map(({ x, i }) => (
              <li key={i} className="flex flex-wrap items-center gap-3 rounded-lg p-4" style={{ background: GRIS, border: `1px solid ${AMARILLO}` }}>
                <span className="min-w-[8rem] flex-1 leading-tight"><b className="block text-[1.15rem]">{d.nombre(x.num)}</b><span className="text-[1rem] opacity-70">{x.que} · día {x.dia}</span></span>
                <b className="text-[1.4rem] tabular-nums" style={{ fontFamily: TITULO }}>{qz(x.monto)}</b>
                <Btn alTocar={() => { gym.confirmarPago(i); setToast("Transferencia confirmada."); }}><Check size={18} /> Confirmar</Btn>
              </li>
            ))}
          </ul>
        </Tarjeta>
      )}

      <div className="grid gap-5 lg:grid-cols-12">
        <Tarjeta className="lg:col-span-4" titulo="Ingresos por método" nota={`Más usado: ${METODO[masUsado.m].t.toLowerCase()} (${masUsado.n} pagos).`}>
          <ul className="grid gap-4">{porMetodo.map(({ m, t, n }) => <li key={m}><div className="flex justify-between text-[1.05rem]"><span>{METODO[m].t} <span className="opacity-55">· {n}</span></span><b className="tabular-nums">{qz(t)}</b></div><div className="mt-1.5"><Barra valor={(t / maxMetodo) * 100} color={m === "tarjeta" ? "#5b7cff" : m === "transferencia" ? AZUL : AMARILLO} alto={12} /></div></li>)}</ul>
        </Tarjeta>
        <Tarjeta className="lg:col-span-4" titulo="Ventas por plan">
          <ul className="grid gap-4">{ventasPlan.map(({ p, t }) => <li key={p.id}><div className="flex justify-between text-[1.05rem]"><span>{p.nombre}</span><b className="tabular-nums">{qz(t)}</b></div><div className="mt-1.5"><Barra valor={(t / maxVenta) * 100} color={p.color} alto={12} /></div></li>)}</ul>
        </Tarjeta>
        <Tarjeta className="lg:col-span-4" titulo="Últimos pagos">
          <ul className="max-h-[17rem] divide-y overflow-y-auto" style={{ borderColor: BORDE }}>{[...gym.pagos].reverse().slice(0, 12).map((x, i) => <li key={i} className="flex items-center justify-between gap-3 py-3"><span className="min-w-0"><b className="block truncate text-[1.08rem]">{d.nombre(x.num)}</b><span className="text-[0.95rem] opacity-65">{x.que} · día {x.dia} · {METODO[norm(x.metodo)]?.t ?? "Recepción"}{x.pendiente ? " · pendiente" : ""}</span></span><b className="tabular-nums text-[1.1rem]">{qz(x.monto)}</b></li>)}</ul>
        </Tarjeta>
      </div>

      <Tarjeta className="overflow-x-auto !p-0">
        <div className="flex flex-wrap items-end justify-between gap-3 p-5 pb-3 sm:p-6 sm:pb-3">
          <div><h2 className="text-[1.3rem] font-bold">Estado de las membresías</h2><p className="mt-0.5 text-[0.98rem] opacity-65">Todos los socios, activos e inactivos, con su último pago.</p></div>
          <Opciones etiqueta="Filtrar" valor={fil} alCambiar={setFil} opciones={[["todos", "Todos", gym.socios.length], ["al-dia", "Al día", gym.socios.filter((s) => d.estado(s) === "al-dia").length], ["por-vencer", "Por vencer", d.porVencer.length], ["inactivos", "Inactivos", d.vencidas.length]]} />
        </div>
        <table className="w-full min-w-[52rem] text-[1.03rem]">
          <thead><tr className="text-left text-[0.88rem] uppercase tracking-wide opacity-55"><th className="p-4 pl-6">Socio</th><th>Plan</th><th>Último pago</th><th>Vence</th><th>Estado</th><th className="p-4" /></tr></thead>
          <tbody>
            {filas.map((s) => { const u = ultimo(s.num), e = d.estado(s), p = porId(PLANES, s.plan); return (
              <tr key={s.num} className="pg-fila border-t" style={{ borderColor: BORDE }}>
                <td className="p-4 pl-6"><b className="block">{s.nombre}</b><span className="text-[0.9rem] opacity-60" style={{ fontFamily: MONO }}>{matriculaDe(s.num)}</span></td>
                <td>{p.nombre} <span className="opacity-55">· {qz(p.precio)}</span></td>
                <td>{u ? <>{qz(u.monto)} <span className="opacity-60">· día {u.dia} · {METODO[norm(u.metodo)]?.t ?? "Recepción"}</span></> : <span className="opacity-55">Sin pagos este mes</span>}</td>
                <td className="tabular-nums">{fechaCorta(s.vence)} <span className="opacity-55">· {faltan(s.vence) < 0 ? `hace ${-faltan(s.vence)} d` : `en ${faltan(s.vence)} d`}</span></td>
                <td><Cuadro socio={s} avisoDias={aj.avisoDias} /></td>
                <td className="p-4"><div className="flex justify-end gap-2">{e === "vencidos" && <Btn alTocar={() => { gym.cobrar(s.num); setToast(`Cobro registrado a ${s.nombre.split(" ")[0]}.`); }}>Cobrar</Btn>}{e === "por-vencer" && (d.avisadoHoy(s.num) ? <span className="inline-flex items-center gap-1.5 px-2 text-[0.98rem] font-semibold opacity-70"><Check size={17} /> Avisado</span> : <Btn tipo="borde" alTocar={() => avisar(s)}><Bell size={16} /> Avisar</Btn>)}</div></td>
              </tr>
            ); })}
            {filas.length === 0 && <tr><td colSpan={6} className="p-8 text-center opacity-60">Nadie en este grupo.</td></tr>}
          </tbody>
        </table>
      </Tarjeta>
    </div>
  );
}
