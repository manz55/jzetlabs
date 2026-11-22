/*
 * Base de datos de la consultora: sus clientas (con todo lo que sabe de cada una) y, si es jefa de equipo,
 * las consultoras que vende con ella. Todo se puede agregar y cambiar a su gusto.
 */
import { useState } from "react";
import { Phone, Plus, Search, Trash2, UserPlus } from "lucide-react";
import { HISTORIAL_EJ, LINEA, MESES, TINTA, VACIO, VINO, nuevoId, qz, telTexto, totalDe, useEquipo, type Perfil } from "./datos";
import { Ventana } from "./Ventana";

const SERIF = '"Fraunces", Georgia, serif';
const campo = "min-h-[3.25rem] w-full rounded-xl border-2 bg-white px-4 text-[1.1rem] outline-none focus:border-black/70";
const borde = { borderColor: "rgba(42,22,51,.25)" };

function Nueva({ titulo, campos, alGuardar, alCerrar }: { titulo: string; campos: { k: string; ph: string; ac?: string; tel?: boolean }[]; alGuardar: (v: Record<string, string>) => void; alCerrar: () => void }) {
  const [v, setV] = useState<Record<string, string>>({});
  const ok = (v[campos[0].k] ?? "").trim().length > 1;
  return (
    <Ventana titulo={titulo} alCerrar={alCerrar} ancho="32rem">
      <form onSubmit={(e) => { e.preventDefault(); if (ok) { alGuardar(v); alCerrar(); } }} className="p-6 pt-8">
        <h3 className="pr-14 text-[1.9rem] font-medium leading-tight" style={{ fontFamily: SERIF }}>{titulo}</h3>
        <div className="mt-5 grid gap-3">
          {campos.map((c) => <input key={c.k} aria-label={c.ph} placeholder={c.ph} autoComplete={c.ac} inputMode={c.tel ? "numeric" : undefined} value={v[c.k] ?? ""} onChange={(e) => setV({ ...v, [c.k]: c.tel ? e.target.value.replace(/[^\d ]/g, "").slice(0, 9) : e.target.value })} className={campo} style={borde} />)}
        </div>
        <button type="submit" disabled={!ok} className="pf-btn mt-6 min-h-[3.5rem] w-full rounded-full text-[1.15rem] font-semibold text-white disabled:opacity-40" style={{ background: TINTA }}>Guardar</button>
      </form>
    </Ventana>
  );
}

export function ClientasTab({ perfiles, agregar, abrir, avisar }: { perfiles: Perfil[]; agregar: (p: Perfil) => void; abrir: (id: string) => void; avisar: (t: string) => void }) {
  const [vista, setVista] = useState<"clientas" | "equipo">("clientas");
  const [buscar, setBuscar] = useState("");
  const [nueva, setNueva] = useState(false);
  const [equipo, ponerEquipo] = useEquipo();
  const lista = perfiles.filter((p) => `${p.nombre} ${p.apellido} ${p.telefono} ${p.municipio}`.toLowerCase().includes(buscar.toLowerCase()));
  const totalEquipo = equipo.reduce((t, c) => t + c.ventas, 0);
  const metaEquipo = equipo.reduce((t, c) => t + c.meta, 0) || 1;
  const cambiarC = (id: string, c: Partial<(typeof equipo)[number]>) => ponerEquipo((l) => l.map((x) => (x.id === id ? { ...x, ...c } : x)));

  return (
    <div className="mt-6 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Qué ver">
          {([["clientas", `Clientas (${perfiles.length})`], ["equipo", `Equipo (${equipo.length})`]] as const).map(([v, t]) => <button key={v} type="button" aria-pressed={vista === v} onClick={() => setVista(v)} className="min-h-[2.75rem] rounded-full border-2 px-5 text-[1.05rem] font-semibold" style={vista === v ? { background: TINTA, borderColor: TINTA, color: "#fff" } : { borderColor: "rgba(42,22,51,.25)", background: "#fff" }}>{t}</button>)}
        </div>
        <button type="button" onClick={() => setNueva(true)} className="pf-btn inline-flex min-h-[3rem] items-center gap-2 rounded-full px-6 text-[1.05rem] font-semibold text-white" style={{ background: VINO }}>{vista === "clientas" ? <UserPlus size={19} /> : <Plus size={19} />} {vista === "clientas" ? "Agregar clienta" : "Agregar consultora"}</button>
      </div>

      {vista === "clientas" ? (
        <div className="mt-5 rounded-2xl bg-white p-4 sm:p-5" style={{ border: `1.5px solid ${LINEA}` }}>
          <div className="relative">
            <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 opacity-45" />
            <input aria-label="Buscar clienta" value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar por nombre, teléfono o zona" className={campo} style={{ ...borde, paddingLeft: "2.75rem" }} />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left text-[1.05rem]">
              <thead><tr className="text-[0.9rem] uppercase tracking-wide opacity-60">{["Clienta", "Teléfono", "Zona", "Compras", "Última compra", "Cumpleaños", ""].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
              <tbody>
                {lista.map((p) => {
                  const h = HISTORIAL_EJ[p.id];
                  const dias = h ? Math.round((Date.now() - new Date(h.ultima).getTime()) / 864e5) : p.llevo.length ? Math.round((Date.now() - new Date(p.creado).getTime()) / 864e5) : null;
                  return (
                    <tr key={p.id} className="border-t" style={{ borderColor: LINEA }}>
                      <td className="px-3 py-3"><button type="button" onClick={() => abrir(p.id)} className="flex items-center gap-3 text-left"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[1rem] font-bold text-white" style={{ background: VINO }}>{(p.nombre[0] ?? "") + (p.apellido[0] ?? "")}</span><b className="text-[1.1rem]">{p.nombre} {p.apellido}</b></button></td>
                      <td className="px-3 py-3 tabular-nums">{p.telefono ? telTexto(p.telefono) : "—"}</td>
                      <td className="px-3 py-3">{p.municipio || "—"}</td>
                      <td className="px-3 py-3 tabular-nums">{h ? `${h.compras} · ${qz(h.total)}` : p.llevo.length ? `1 · ${qz(totalDe(p.llevo))}` : "Ninguna"}</td>
                      <td className="px-3 py-3">{dias === null ? "—" : `hace ${dias} días`}</td>
                      <td className="px-3 py-3">{p.cumple.d && p.cumple.m ? `${p.cumple.d} de ${MESES[Number(p.cumple.m) - 1]}` : "—"}</td>
                      <td className="px-3 py-3 text-right"><button type="button" onClick={() => abrir(p.id)} className="inline-flex min-h-[2.75rem] items-center rounded-full border-2 px-4 text-[0.98rem] font-semibold" style={{ borderColor: TINTA }}>Abrir ficha</button></td>
                    </tr>
                  );
                })}
                {lista.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center opacity-60">No hay clientas con esa búsqueda.</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[0.95rem] opacity-60">En la ficha se pueden editar los datos y registrar notas.</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-5">
          <div className="grid gap-4 rounded-2xl p-5 text-white sm:grid-cols-3" style={{ background: VINO }}>
            <div><p className="opacity-85">Consultoras en el equipo</p><p className="text-[2.4rem] font-semibold leading-none" style={{ fontFamily: SERIF }}>{equipo.length}</p></div>
            <div><p className="opacity-85">Vendieron este mes</p><p className="text-[2.4rem] font-semibold leading-none" style={{ fontFamily: SERIF }}>{qz(totalEquipo)}</p></div>
            <div><p className="opacity-85">De la meta del equipo</p><p className="text-[2.4rem] font-semibold leading-none" style={{ fontFamily: SERIF }}>{Math.round((totalEquipo / metaEquipo) * 100)}%</p></div>
          </div>
          {equipo.length === 0 ? <p className="rounded-xl bg-white px-4 py-8 text-center opacity-60">Aún no hay consultoras en el equipo.</p> : (
            <ul className="pf-auto" style={{ ["--min" as string]: "24rem" }}>
              {equipo.map((c) => (
                <li key={c.id} className="rounded-2xl bg-white p-5" style={{ border: `1.5px solid ${LINEA}` }}>
                  <div className="flex items-start gap-3.5">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-[1.2rem] font-bold text-white" style={{ background: TINTA }}>{c.nombre.split(" ").slice(0, 2).map((w) => w[0]).join("")}</span>
                    <span className="min-w-0 flex-1 leading-tight"><b className="block truncate text-[1.3rem]">{c.nombre}</b><span className="mt-0.5 flex items-center gap-1.5 text-[0.98rem] opacity-70"><Phone size={14} /> {telTexto(c.telefono)}</span></span>
                    <button type="button" aria-label={`Quitar a ${c.nombre}`} onClick={() => { if (confirm(`¿Quitar a ${c.nombre} del equipo?`)) ponerEquipo((l) => l.filter((x) => x.id !== c.id)); }} className="grid h-11 w-11 shrink-0 place-items-center rounded-full opacity-50 hover:opacity-100"><Trash2 size={19} /></button>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full" style={{ background: LINEA }}><div className="h-full rounded-full" style={{ width: `${Math.min(100, (c.ventas / Math.max(1, c.meta)) * 100)}%`, background: VINO }} /></div>
                  <p className="mt-1.5 text-[1rem]"><b>{qz(c.ventas)}</b> de {qz(c.meta)} · {Math.round((c.ventas / Math.max(1, c.meta)) * 100)}%</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <label className="grid gap-1 text-[0.92rem] font-semibold">Vendió este mes (Q)<input inputMode="numeric" value={c.ventas} onChange={(e) => cambiarC(c.id, { ventas: Number(e.target.value.replace(/\D/g, "")) || 0 })} className={campo} style={borde} /></label>
                    <label className="grid gap-1 text-[0.92rem] font-semibold">Su meta (Q)<input inputMode="numeric" value={c.meta} onChange={(e) => cambiarC(c.id, { meta: Number(e.target.value.replace(/\D/g, "")) || 0 })} className={campo} style={borde} /></label>
                  </div>
                  <button type="button" onClick={() => avisar(`En su negocio, este botón abre WhatsApp con ${c.nombre.split(" ")[0]}.`)} className="pf-btn mt-4 min-h-[3rem] w-full rounded-full border-2 text-[1.02rem] font-semibold" style={{ borderColor: TINTA }}>Escribirle</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {nueva && vista === "clientas" && (
        <Nueva titulo="Agregar clienta" alCerrar={() => setNueva(false)} campos={[{ k: "nombre", ph: "Nombre", ac: "given-name" }, { k: "apellido", ph: "Apellido", ac: "family-name" }, { k: "tel", ph: "WhatsApp", tel: true }, { k: "dir", ph: "Dirección" }, { k: "mun", ph: "Zona o municipio" }]}
          alGuardar={(v) => agregar({ ...VACIO, id: nuevoId(), creado: new Date().toISOString(), nombre: v.nombre.trim(), apellido: (v.apellido ?? "").trim(), telefono: (v.tel ?? "").replace(/\D/g, ""), direccion: v.dir ?? "", municipio: v.mun ?? "" })} />
      )}
      {nueva && vista === "equipo" && (
        <Nueva titulo="Agregar consultora" alCerrar={() => setNueva(false)} campos={[{ k: "nombre", ph: "Nombre completo", ac: "name" }, { k: "tel", ph: "WhatsApp", tel: true }, { k: "meta", ph: "Su meta del mes (Q)", tel: true }]}
          alGuardar={(v) => ponerEquipo((l) => [...l, { id: nuevoId(), nombre: v.nombre.trim(), telefono: (v.tel ?? "").replace(/\D/g, ""), ventas: 0, meta: Number((v.meta ?? "").replace(/\D/g, "")) || 1500, desde: new Date().toISOString() }])} />
      )}
    </div>
  );
}
