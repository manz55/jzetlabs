/*
 * Panel · Socios: una sola tabla con todos, el estado en cuadro de color, la ficha editable y el alta.
 */
import { useState } from "react";
import { Bell, Check, Search, UserPlus } from "lucide-react";
import { Ventana } from "../perfil/Ventana";
import { AMARILLO, INSCRIPCION, PLANES, SEDES, dpiDe, enDias, faltan, fechaCorta, matriculaDe, porId, qz, type Gym, type Socio } from "./datos";
import { BORDE, Btn, Cuadro, GRIS, MONO, NEGRO, Opciones, Paso, Tarjeta, TINTA, h1, norm, METODO, type Aj, type Datos } from "./panelPiezas";

export type Filtro = "todos" | "al-dia" | "por-vencer" | "vencidos" | "riesgo";

/* busca por nombre, matrícula (SF-0101 o 101), DPI o teléfono */
export const coincide = (s: Socio, q: string) => {
  const t = q.trim().toLowerCase();
  if (!t) return true;
  const num = t.replace(/\D/g, "");
  return s.nombre.toLowerCase().includes(t) || matriculaDe(s.num).toLowerCase().includes(t) || (num.length >= 3 && (String(s.num) === num || dpiDe(s.num).replace(/\D/g, "").includes(num) || s.tel.includes(num)));
};

export default function PanelSocios({ gym, aj, d, filtro, setFiltro, q, setQ, avisar, extrañar, abrirFicha, abrirAlta, setToast }: {
  gym: Gym; aj: Aj; d: Datos; filtro: Filtro; setFiltro: (f: Filtro) => void; q: string; setQ: (q: string) => void;
  avisar: (s: Socio) => void; extrañar: (s: Socio) => void; abrirFicha: (n: number) => void; abrirAlta: () => void; setToast: (t: string) => void;
}) {
  const filas = gym.socios.filter((s) => (filtro === "todos" || (filtro === "riesgo" ? d.riesgo.includes(s) : d.estado(s) === filtro)) && coincide(s, q));
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className={h1}>Socios</h1><p className="text-[1.05rem] opacity-65">{gym.socios.length} socios registrados. Toque un socio para ver y editar su ficha.</p></div>
        <Btn alTocar={abrirAlta}><UserPlus size={19} /> Agregar socio</Btn>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[14rem] flex-1 md:max-w-md"><span className="sr-only">Buscar socio</span><Search size={19} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nombre, matrícula, DPI o teléfono" className="min-h-[3.25rem] w-full rounded-lg border bg-[#202326] pl-11 pr-3 text-[1.1rem] text-[#efeee9]" style={{ borderColor: BORDE }} /></label>
        <Opciones etiqueta="Filtrar socios" valor={filtro} alCambiar={setFiltro} opciones={[["todos", "Todos", gym.socios.length], ["al-dia", "Al día", gym.socios.filter((s) => d.estado(s) === "al-dia").length], ["por-vencer", "Por vencer", d.porVencer.length], ["vencidos", "Vencidos", d.vencidas.length], ["riesgo", "En riesgo", d.riesgo.length]]} />
      </div>
      <Tarjeta className="overflow-x-auto !p-0">
        <table className="w-full min-w-[54rem] text-[1.05rem]">
          <thead><tr className="text-left text-[0.88rem] uppercase tracking-wide opacity-55"><th className="p-4">Socio</th><th>Plan</th><th>Vence</th><th>Estado</th><th className="pr-6 text-right">Visitas</th><th>Última visita</th><th className="p-4" /></tr></thead>
          <tbody>
            {filas.map((s) => { const e = d.estado(s), p = porId(PLANES, s.plan), av = d.avisadoHoy(s.num); return (
              <tr key={s.num} className="pg-fila border-t" style={{ borderColor: BORDE }}>
                <td className="p-4"><button type="button" onClick={() => abrirFicha(s.num)} className="text-left"><b className="block text-[1.12rem]">{s.nombre}{s.nuevo && <span className="ml-2 rounded bg-white/15 px-1.5 py-0.5 align-middle text-[0.72rem]">NUEVO</span>}</b><span className="text-[0.92rem] opacity-60" style={{ fontFamily: MONO }}>{matriculaDe(s.num)} · {s.tel}</span></button></td>
                <td>{p.nombre}</td><td className="tabular-nums">{fechaCorta(s.vence)}</td>
                <td><Cuadro socio={s} avisoDias={aj.avisoDias} /></td>
                <td className="pr-6 text-right tabular-nums">{s.visitas.length}</td>
                <td className="pl-5 text-[1rem]" style={{ color: d.riesgo.includes(s) ? "#ff9aa8" : undefined }}>{s.visitas.length ? (d.diasSin(s) === 0 ? "hoy" : `hace ${d.diasSin(s)} ${d.diasSin(s) === 1 ? "día" : "días"}`) : "sin visitas"}</td>
                <td className="p-4"><div className="flex justify-end gap-2">
                  {e !== "al-dia" && (av ? <span className="inline-flex min-h-[2.75rem] items-center gap-1.5 px-3 text-[0.98rem] font-semibold opacity-70"><Check size={17} /> Avisado hoy</span> : <Btn tipo="borde" alTocar={() => avisar(s)}><Bell size={16} /> Avisar</Btn>)}
                  {e === "vencidos" && <Btn alTocar={() => { gym.cobrar(s.num); setToast(`Cobro registrado a ${s.nombre.split(" ")[0]}.`); }}>Cobrar</Btn>}
                  {d.riesgo.includes(s) && <Btn tipo="borde" alTocar={() => extrañar(s)}>Escribirle</Btn>}
                </div></td>
              </tr>
            ); })}
            {filas.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-[1.1rem] opacity-60">Nadie coincide.</td></tr>}
          </tbody>
        </table>
      </Tarjeta>
    </div>
  );
}

const campo = "min-h-[3.25rem] w-full rounded-lg border bg-[#16181a] px-4 text-[1.1rem] outline-none focus:border-white/60";

export function Ficha({ socio, gym, aj, alCerrar, avisar, extrañar, diasSin, setToast }: { socio: Socio; gym: Gym; aj: Aj; alCerrar: () => void; avisar: (s: Socio) => void; extrañar: (s: Socio) => void; diasSin: number; setToast: (t: string) => void }) {
  const f = faltan(socio.vence), p = porId(PLANES, socio.plan);
  const [nombre, setNombre] = useState(socio.nombre);
  const [tel, setTel] = useState(socio.tel);
  const [correo, setCorreo] = useState(socio.correo ?? "");
  const [plan, setPlan] = useState(socio.plan);
  const [sede, setSede] = useState(socio.sede);
  const [dias, setDias] = useState(f);
  const [baja, setBaja] = useState(false);
  const pagos = gym.pagos.filter((x) => x.num === socio.num);
  const cambio = nombre !== socio.nombre || tel !== socio.tel || correo !== (socio.correo ?? "") || plan !== socio.plan || sede !== socio.sede || dias !== f;
  const ok = nombre.trim().length > 2 && tel.replace(/\D/g, "").length === 8;
  return (
    <Ventana titulo={`Ficha de ${socio.nombre}`} alCerrar={alCerrar} fondo="#202326" color={TINTA} ancho="56rem">
      <div className="p-6 pt-8 sm:p-8">
        <p className="text-[1rem] font-bold uppercase tracking-[0.15em]" style={{ color: AMARILLO }}>Socio · {matriculaDe(socio.num)}</p>
        <h3 className="gym-titulo pr-14 text-[clamp(2.4rem,2rem+1.6vw,3.4rem)]">{socio.nombre}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-3"><Cuadro socio={socio} avisoDias={aj.avisoDias} /><span className="text-[1.05rem] opacity-75">DPI {dpiDe(socio.num)} · socio desde {socio.desde ? fechaCorta(socio.desde) : "—"}</span></div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          {[["Plan", p.nombre], ["Vence", `${fechaCorta(socio.vence)} (${f < 0 ? `vencida hace ${-f} d` : `${f} d`})`], ["Visitas del mes", `${socio.visitas.length} · última ${socio.visitas.length ? (diasSin === 0 ? "hoy" : `hace ${diasSin} d`) : "—"}`]].map(([a, b]) => <div key={a} className="rounded-lg p-4" style={{ background: GRIS }}><dt className="text-[0.95rem] opacity-65">{a}</dt><dd className="mt-1 text-[1.2rem] font-bold leading-tight">{b}</dd></div>)}
        </dl>

        <p className="mt-7 text-[1.15rem] font-bold">Datos del socio</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-[0.95rem] opacity-90">Nombre completo<input value={nombre} onChange={(e) => setNombre(e.target.value)} className={campo} style={{ borderColor: BORDE }} /></label>
          <label className="grid gap-1 text-[0.95rem] opacity-90">WhatsApp<input inputMode="numeric" value={tel} onChange={(e) => setTel(e.target.value.replace(/\D/g, "").slice(0, 8))} className={campo} style={{ borderColor: BORDE }} /></label>
          <label className="grid gap-1 text-[0.95rem] opacity-90 sm:col-span-2">Correo<input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className={campo} style={{ borderColor: BORDE }} /></label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><p className="mb-2 text-[0.95rem]">Plan</p><Opciones etiqueta="Plan" valor={plan} alCambiar={setPlan} opciones={PLANES.map((x) => [x.id, x.nombre] as const)} /></div>
          <div><p className="mb-2 text-[0.95rem]">Sede</p><Opciones etiqueta="Sede" valor={sede} alCambiar={setSede} opciones={SEDES.map((x) => [x.id, x.nombre] as const)} /></div>
        </div>
        <div className="mt-4"><p className="mb-2 text-[0.95rem]">Vencimiento</p><Paso valor={dias} alCambiar={setDias} min={-90} max={400} paso={1} formato={(n) => fechaCorta(enDias(n))} /></div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Btn deshabilitado={!cambio || !ok} alTocar={() => { gym.editar(socio.num, { nombre: nombre.trim(), tel, correo, plan, sede, vence: enDias(dias) }); setToast("Datos del socio actualizados."); alCerrar(); }}><Check size={18} /> Guardar cambios</Btn>
          {baja ? <Btn tipo="rojo" alTocar={() => { gym.baja(socio.num); setToast(`${socio.nombre.split(" ")[0]} fue dado de baja.`); alCerrar(); }}>Confirmar baja</Btn> : <Btn tipo="borde" alTocar={() => setBaja(true)}>Dar de baja</Btn>}
        </div>

        <p className="mt-8 text-[1.15rem] font-bold">Pagos</p>
        <ul className="mt-2 grid gap-2">{pagos.length === 0 ? <li className="opacity-60">Sin pagos registrados.</li> : [...pagos].reverse().map((x, i) => <li key={i} className="flex justify-between gap-3 rounded-lg px-4 py-2.5 text-[1.05rem]" style={{ background: GRIS }}><span>{x.que} · día {x.dia} · {METODO[norm(x.metodo)]?.t ?? "Recepción"}{x.pendiente ? " (pendiente)" : ""}</span><b>{qz(x.monto)}</b></li>)}</ul>
        <div className="mt-6 flex flex-wrap gap-3">
          {f < 0 ? <Btn alTocar={() => { gym.cobrar(socio.num); setToast("Cobro registrado."); alCerrar(); }}>Cobrar {qz(p.precio)}</Btn> : <Btn alTocar={() => { gym.entrar(socio.num); setToast("Entrada registrada."); }}>Registrar entrada</Btn>}
          <Btn tipo="borde" alTocar={() => { alCerrar(); avisar(socio); }}><Bell size={17} /> Avisar por WhatsApp</Btn>
          {diasSin >= 5 && <Btn tipo="borde" alTocar={() => { alCerrar(); extrañar(socio); }}>Escribirle por inasistencia</Btn>}
        </div>
      </div>
    </Ventana>
  );
}

export function Alta({ alCerrar, alGuardar }: { alCerrar: () => void; alGuardar: (nombre: string, tel: string, plan: string, sede: string) => void }) {
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [plan, setPlan] = useState("mensual");
  const [sede, setSede] = useState("mixco");
  const ok = nombre.trim().length > 2 && tel.replace(/\D/g, "").length === 8;
  const p = porId(PLANES, plan);
  const total = p.precio + (plan === "dia" || plan === "trimestral" || plan === "anual" ? 0 : INSCRIPCION);
  return (
    <Ventana titulo="Agregar socio" alCerrar={alCerrar} fondo="#202326" color={TINTA} ancho="38rem">
      <form onSubmit={(e) => { e.preventDefault(); if (ok) { alGuardar(nombre.trim(), tel.replace(/\D/g, ""), plan, sede); alCerrar(); } }} className="grid gap-4 p-6 pt-8">
        <h3 className="gym-titulo pr-14 text-[2.6rem]">Agregar socio</h3>
        <input aria-label="Nombre completo" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} className={campo} style={{ borderColor: BORDE }} />
        <input aria-label="WhatsApp" placeholder="WhatsApp (8 dígitos)" inputMode="numeric" value={tel} onChange={(e) => setTel(e.target.value.replace(/[^\d ]/g, "").slice(0, 9))} className={campo} style={{ borderColor: BORDE }} />
        <div><p className="mb-2 font-bold">Plan</p><Opciones etiqueta="Plan" valor={plan} alCambiar={setPlan} opciones={PLANES.map((x) => [x.id, `${x.nombre} · ${qz(x.precio)}`] as const)} /></div>
        <div><p className="mb-2 font-bold">Sede</p><Opciones etiqueta="Sede" valor={sede} alCambiar={setSede} opciones={SEDES.map((x) => [x.id, x.nombre] as const)} /></div>
        <button type="submit" disabled={!ok} className="pg-btn pg-lleno min-h-[3.5rem] rounded-lg text-[1.15rem] font-bold disabled:opacity-40" style={{ background: AMARILLO, color: NEGRO }}>Registrar y cobrar {qz(total)} en recepción</button>
      </form>
    </Ventana>
  );
}

