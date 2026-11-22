/*
 * Panel · Ajustes: lo que el dueño controla. Precios de los planes, reglas del gimnasio, metas y alertas,
 * cómo se avisa a los socios y el acceso a editar a cada uno. Lo que cambia aquí lo ven la página y la app.
 */
import { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { PLANES, SEDES, VERDE, ponerPrecio, qz, useAjustes, usePrecios, type Gym } from "./datos";
import { BORDE, Btn, GRIS, NEGRO, Paso, Tarjeta, h1, type Sec } from "./panelPiezas";

function Interruptor({ activo, alCambiar, children }: { activo: boolean; alCambiar: () => void; children: React.ReactNode }) {
  return (
    <button type="button" role="switch" aria-checked={activo} onClick={alCambiar} className="pg-btn flex min-h-[3.5rem] w-full items-center justify-between gap-4 rounded-lg px-4 py-3 text-left text-[1.08rem]" style={{ background: GRIS }}>
      <span>{children}</span>
      <span className="relative h-8 w-14 shrink-0 rounded-full transition" style={{ background: activo ? VERDE : "rgba(255,255,255,.2)" }}><span className="absolute top-1 h-6 w-6 rounded-full bg-white transition-all" style={{ left: activo ? "1.9rem" : "0.25rem" }} /></span>
    </button>
  );
}

export default function PanelAjustes({ gym, setSec }: { gym: Gym; setSec: (s: Sec) => void }) {
  const [aj, ponerAj] = useAjustes();
  usePrecios();
  const [nueva, setNueva] = useState("");
  const cambiarRegla = (i: number, t: string) => ponerAj({ reglas: aj.reglas.map((r, k) => (k === i ? t : r)) });
  const paso = (id: string) => (id === "anual" ? 50 : id === "trimestral" ? 10 : 5);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <div><h1 className={h1}>Ajustes</h1><p className="text-[1.05rem] opacity-65">Desde aquí se controla todo el gimnasio. Los precios y las reglas cambian también en la página y en la app del socio.</p></div>

      <Tarjeta titulo="Precios de los planes" nota="Cambie el precio y se actualiza en la página, en la app y en los cobros.">
        <ul className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 23rem), 1fr))" }}>
          {PLANES.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg p-4" style={{ background: GRIS, borderLeft: `6px solid ${p.color}` }}>
              <span className="leading-tight"><b className="gym-titulo block text-[1.9rem]">{p.nombre}</b><span className="text-[0.98rem] opacity-65">{p.dias} {p.dias === 1 ? "día" : "días"}</span></span>
              <Paso valor={p.precio} alCambiar={(n) => ponerPrecio(p.id, n)} min={5} max={9999} paso={paso(p.id)} formato={qz} />
            </li>
          ))}
        </ul>
      </Tarjeta>

      <div className="grid gap-5 lg:grid-cols-3">
        <Tarjeta titulo="Meta de ingresos" nota="Se muestra en el resumen del mes."><Paso valor={aj.meta} alCambiar={(n) => ponerAj({ meta: n })} min={1000} max={100000} paso={500} formato={qz} /></Tarjeta>
        <Tarjeta titulo="Aviso de vencimiento" nota="Días antes de que venza para marcar una membresía como por vencer."><Paso valor={aj.avisoDias} alCambiar={(n) => ponerAj({ avisoDias: n })} min={1} max={30} paso={1} formato={(n) => `${n} días`} /></Tarjeta>
        <Tarjeta titulo="Riesgo de abandono" nota="Días sin asistir para marcar a un socio en riesgo."><Paso valor={aj.riesgoDias} alCambiar={(n) => ponerAj({ riesgoDias: n })} min={2} max={30} paso={1} formato={(n) => `${n} días`} /></Tarjeta>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Tarjeta titulo="Avisos a los socios" nota="Por dónde se les avisa cuando su membresía está por vencer o ya venció.">
          <div className="grid gap-3">
            <Interruptor activo={aj.canales.whatsapp} alCambiar={() => ponerAj({ canales: { ...aj.canales, whatsapp: !aj.canales.whatsapp } })}>WhatsApp al número del socio</Interruptor>
            <Interruptor activo={aj.canales.correo} alCambiar={() => ponerAj({ canales: { ...aj.canales, correo: !aj.canales.correo } })}>Correo electrónico</Interruptor>
            <Interruptor activo={aj.canales.app} alCambiar={() => ponerAj({ canales: { ...aj.canales, app: !aj.canales.app } })}>Notificación en la app del socio</Interruptor>
            <Interruptor activo={aj.auto} alCambiar={() => ponerAj({ auto: !aj.auto })}>Enviar el aviso automáticamente {aj.avisoDias} días antes</Interruptor>
          </div>
        </Tarjeta>
        <Tarjeta titulo="Socios" nota={`${gym.socios.length} socios registrados.`}>
          <p className="text-[1.05rem] opacity-80">Para modificar un socio (nombre, teléfono, correo, plan, sede o fecha de vencimiento) o darlo de baja, abra su ficha desde la lista de socios.</p>
          <div className="mt-4 flex flex-wrap gap-3"><Btn alTocar={() => setSec("socios")}><Users size={18} /> Editar socios</Btn></div>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">{SEDES.map((s) => <li key={s.id} className="rounded-lg px-4 py-3 text-[1.05rem]" style={{ background: GRIS }}><b>{s.nombre}</b><span className="block opacity-70">Capacidad aproximada: {s.capacidad} personas</span></li>)}</ul>
        </Tarjeta>
      </div>

      <Tarjeta titulo="Reglas del gimnasio" nota="Los socios las leen en su app, en Mi cuenta, dentro de Documentos.">
        <ol className="grid gap-3">
          {aj.reglas.map((r, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-[1.1rem] font-bold" style={{ background: GRIS }}>{i + 1}</span>
              <input aria-label={`Regla ${i + 1}`} value={r} onChange={(e) => cambiarRegla(i, e.target.value)} className="min-h-[3.25rem] w-full rounded-lg border bg-[#16181a] px-4 text-[1.05rem] outline-none focus:border-white/60" style={{ borderColor: BORDE }} />
              <button type="button" aria-label={`Quitar regla ${i + 1}`} onClick={() => ponerAj({ reglas: aj.reglas.filter((_, k) => k !== i) })} className="pg-btn grid h-12 w-12 shrink-0 place-items-center rounded-lg border" style={{ borderColor: BORDE }}><Trash2 size={19} /></button>
            </li>
          ))}
        </ol>
        <form onSubmit={(e) => { e.preventDefault(); if (nueva.trim()) { ponerAj({ reglas: [...aj.reglas, nueva.trim()] }); setNueva(""); } }} className="mt-4 flex flex-wrap gap-3">
          <input aria-label="Nueva regla" value={nueva} onChange={(e) => setNueva(e.target.value)} placeholder="Escribir una regla nueva" className="min-h-[3.25rem] min-w-[14rem] flex-1 rounded-lg border bg-[#16181a] px-4 text-[1.05rem] outline-none focus:border-white/60" style={{ borderColor: BORDE }} />
          <button type="submit" disabled={!nueva.trim()} className="pg-btn pg-lleno inline-flex min-h-[3.25rem] items-center gap-2 rounded-lg px-5 text-[1.05rem] font-semibold disabled:opacity-40" style={{ background: "#f2c230", color: NEGRO }}><Plus size={19} /> Agregar regla</button>
        </form>
      </Tarjeta>
    </div>
  );
}
