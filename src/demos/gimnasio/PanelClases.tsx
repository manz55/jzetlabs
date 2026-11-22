/*
 * Panel · Clases: el calendario del mes con todas las clases de cada día y qué tan llenas están.
 * Verde tiene lugares, amarillo casi se llena, rojo ya no hay lugar. Al tocar un día se ven sus clases completas.
 */
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AMARILLO, CLASES, DIAS, ROJO, VERDE, vanEn, type Clase, type Gym } from "./datos";
import { BORDE, Barra, GRIS, MESES, NEGRO, Tarjeta, h1 } from "./panelPiezas";

const minutos = (c: Clase) => Number(c.hora.split(":")[0]) * 60 + Number(c.hora.split(":")[1]);
const tono = (p: number) => (p >= 100 ? ROJO : p >= 75 ? AMARILLO : VERDE);
const letra = (p: number) => (p >= 75 && p < 100 ? NEGRO : "#fff");

export default function PanelClases({ gym }: { gym: Gym }) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const [off, setOff] = useState(0);
  const base = new Date(hoy.getFullYear(), hoy.getMonth() + off, 1);
  const diasMes = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const vacios = (base.getDay() + 6) % 7;
  const [selRaw, setSel] = useState(hoy.getDate());
  const sel = Math.min(selRaw, diasMes);

  const delDia = (n: number) => {
    const f = new Date(base.getFullYear(), base.getMonth(), n);
    return { f, lista: CLASES.filter((c) => c.dia === f.getDay()).sort((a, b) => minutos(a) - minutos(b)).map((c) => { const van = vanEn(c, f, !!gym.reservas[c.id]); return { c, van, p: Math.round((van / c.cupo) * 100) }; }) };
  };
  const todas = Array.from({ length: diasMes }, (_, i) => delDia(i + 1)).flatMap((x) => x.lista);
  const llenas = todas.filter((x) => x.p >= 100).length;
  const media = todas.length ? Math.round(todas.reduce((t, x) => t + x.p, 0) / todas.length) : 0;
  const libres = todas.reduce((t, x) => t + (x.c.cupo - x.van), 0);
  const d = delDia(sel);
  const esHoy = d.f.getTime() === hoy.getTime();
  const pasado = d.f < hoy;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className={h1}>Clases Spartan</h1><p className="text-[1.05rem] opacity-65">Todas las clases del mes. Los lugares se llenan cuando los socios los apartan desde la página y la app.</p></div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Mes anterior" onClick={() => setOff(off - 1)} className="pg-btn grid h-12 w-12 place-items-center rounded-lg border" style={{ borderColor: BORDE }}><ChevronLeft size={22} /></button>
          <b className="min-w-[10rem] text-center text-[1.4rem] capitalize">{MESES[base.getMonth()]} {base.getFullYear()}</b>
          <button type="button" aria-label="Mes siguiente" onClick={() => setOff(off + 1)} className="pg-btn grid h-12 w-12 place-items-center rounded-lg border" style={{ borderColor: BORDE }}><ChevronRight size={22} /></button>
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 13rem), 1fr))" }}>
        {[["Clases del mes", String(todas.length), "en todas las sedes"], ["Ocupación promedio", `${media}%`, "de los lugares"], ["Clases llenas", String(llenas), "sin lugares libres"], ["Lugares libres", String(libres), "para apartar"]].map(([t, v, n]) => (
          <div key={t} className="rounded-xl border bg-[#202326] p-5" style={{ borderColor: BORDE }}><p className="text-[1rem] opacity-70">{t}</p><p className="gym-titulo mt-1 text-[2.6rem] leading-none">{v}</p><p className="mt-2 text-[0.95rem] opacity-65">{n}</p></div>
        ))}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
        <Tarjeta titulo="Calendario del mes" derecha={<ul className="flex flex-wrap gap-x-4 gap-y-1 text-[0.95rem]">{[[VERDE, "Con lugares"], [AMARILLO, "Casi llena"], [ROJO, "Llena"]].map(([c, t]) => <li key={t} className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px]" style={{ background: c }} />{t}</li>)}</ul>}>
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((t) => <span key={t} className="pb-1 text-center text-[0.85rem] font-semibold uppercase tracking-wide opacity-55">{t}</span>)}
            {Array.from({ length: vacios }, (_, i) => <span key={`v${i}`} />)}
            {Array.from({ length: diasMes }, (_, i) => {
              const n = i + 1, x = delDia(n), eh = x.f.getTime() === hoy.getTime(), ya = x.f < hoy;
              return (
                <button key={n} type="button" onClick={() => setSel(n)} aria-pressed={sel === n} aria-label={`${DIAS[x.f.getDay()]} ${n}, ${x.lista.length} clases`} className="pg-dia flex min-h-[5rem] flex-col gap-1 rounded-lg border p-1.5 text-left sm:min-h-[8.5rem] sm:p-2" style={{ borderColor: sel === n ? AMARILLO : BORDE, background: sel === n ? "rgba(242,194,48,.1)" : GRIS, opacity: ya ? 0.6 : 1, outline: eh ? `2px solid ${AMARILLO}` : undefined, outlineOffset: -1 }}>
                  <span className="text-[0.95rem] font-bold tabular-nums">{n}</span>
                  {x.lista.map(({ c, van, p }) => (
                    <span key={c.id} className="block min-w-0">
                      <span className="block h-1.5 rounded-sm sm:hidden" style={{ background: ya ? "#5c6166" : tono(p) }} />
                      <span className="hidden items-center justify-between gap-1 rounded-[3px] px-1.5 py-[3px] text-[0.76rem] font-semibold leading-tight sm:flex" style={{ background: ya ? "#3a3f44" : tono(p), color: ya ? "#cfd3d6" : letra(p) }}><span className="truncate">{c.hora} {c.nombre}</span><span className="shrink-0 tabular-nums">{van}/{c.cupo}</span></span>
                    </span>
                  ))}
                </button>
              );
            })}
          </div>
        </Tarjeta>

        <Tarjeta titulo={`${DIAS[d.f.getDay()]} ${d.f.getDate()} de ${MESES[d.f.getMonth()]}`} nota={esHoy ? "Hoy" : pasado ? "Día pasado" : "Próximo día"} >
          {d.lista.length === 0 ? <p className="rounded-lg px-4 py-6 text-center opacity-60" style={{ background: GRIS }}>Ese día no hay clases.</p> : (
            <ul className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 22rem), 1fr))" }}>
              {d.lista.map(({ c, van, p }) => (
                <li key={c.id} className="rounded-lg p-4" style={{ background: GRIS, borderLeft: `6px solid ${tono(p)}` }}>
                  <div className="flex items-start justify-between gap-3"><div><p className="gym-titulo text-[1.9rem] leading-none">{c.nombre}</p><p className="mt-1 text-[1.02rem] opacity-70">{c.hora} · con {c.coach}</p></div><span className="shrink-0 rounded-[4px] px-2.5 py-1 text-[0.9rem] font-bold" style={{ background: tono(p), color: letra(p) }}>{p >= 100 ? "Llena" : `Quedan ${c.cupo - van}`}</span></div>
                  <div className="mt-3"><Barra valor={p} color={tono(p)} alto={10} /></div>
                  <p className="mt-1.5 text-[0.98rem] opacity-70">{van} de {c.cupo} lugares {pasado ? "ocupados" : "apartados"} ({Math.min(100, p)}%)</p>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
      </div>
    </div>
  );
}
