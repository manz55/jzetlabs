/*
 * Panel tipo CRM que comparten las demos (la parte "Recepción" o "Panel del dueño").
 * Sale de cómo ordenan el trabajo HubSpot, Pipedrive, Tekmetric y Cliniko
 * (ver CRM-PANELES-INVESTIGACION.md): menú lateral, barra de arriba con buscador y avisos,
 * "Hoy" con lo que necesita atención, agenda, clientes con ficha e historial, tablero por etapas,
 * mensajes con plantillas, reseñas y reportes. Cada demo pone sus datos y sus colores.
 */
import { createContext, useContext, useState, type ReactNode } from "react";
import { ArrowRight, Bell, CalendarDays, Check, ChevronLeft, ChevronRight, Columns3, House, MessageCircle, Search, Send, Star, TrendingUp, UserCog, Users, X } from "lucide-react";
import { MensajeWhatsApp, qz } from "./comun";

export type Tema = { fondo: string; menu: string; tinta: string; acento: string; sobreAcento: string; suave: string; borde: string; titulo: string; bueno: string; malo: string; medio: string; radio: string };
const TemaCtx = createContext<Tema | null>(null);
const useTema = () => useContext(TemaCtx)!;

export type SeccionId = "hoy" | "agenda" | "clientes" | "tablero" | "mensajes" | "resenas" | "reportes" | "equipo";
const MENU: { id: SeccionId; nombre: string; Icono: typeof House }[] = [
  { id: "hoy", nombre: "Hoy", Icono: House },
  { id: "agenda", nombre: "Agenda", Icono: CalendarDays },
  { id: "clientes", nombre: "Clientes", Icono: Users },
  { id: "tablero", nombre: "Tablero", Icono: Columns3 },
  { id: "mensajes", nombre: "Mensajes", Icono: MessageCircle },
  { id: "resenas", nombre: "Reseñas", Icono: Star },
  { id: "reportes", nombre: "Reportes", Icono: TrendingUp },
  { id: "equipo", nombre: "Equipo", Icono: UserCog },
];

/* ---------- el marco: menú lateral y barra de arriba ---------- */

export function PanelCRM({
  tema, marca, usuario, sedes, avisos, nombresMenu, children,
}: {
  tema: Tema;
  marca: ReactNode;
  usuario: { nombre: string; rol: string };
  sedes?: string[];
  avisos: string[];
  nombresMenu?: Partial<Record<SeccionId, string>>;
  children: (sec: SeccionId, busqueda: string, ir: (s: SeccionId) => void, sede: string) => ReactNode;
}) {
  const [sec, setSec] = useState<SeccionId>("hoy");
  const [q, setQ] = useState("");
  const [abiertos, setAbiertos] = useState(false);
  const [sede, setSede] = useState(sedes?.[0] ?? "");
  const nombre = (id: SeccionId, base: string) => nombresMenu?.[id] ?? base;
  return (
    <TemaCtx.Provider value={tema}>
      <div className="grid min-h-[calc(100vh-8rem)] grid-cols-[minmax(0,1fr)] md:grid-cols-[13.5rem_minmax(0,1fr)]" style={{ background: tema.fondo, color: tema.tinta }}>
        <aside className="md:sticky md:top-0 md:h-screen md:self-start" style={{ background: tema.menu, color: "#fff" }}>
          <div className="hidden px-4 py-5 md:block">{marca}</div>
          <nav aria-label="Menú del panel" className="flex gap-1 overflow-x-auto px-2 py-2 md:block md:space-y-1 md:overflow-visible md:px-3">
            {MENU.map(({ id, nombre: base, Icono }) => {
              const activo = sec === id;
              return (
                <button key={id} type="button" onClick={() => setSec(id)} aria-current={activo ? "page" : undefined} className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-[0.95rem] font-semibold transition md:w-full" style={activo ? { background: tema.acento, color: tema.sobreAcento } : { color: "rgba(255,255,255,.78)" }}>
                  <Icono size={18} /> {nombre(id, base)}
                </button>
              );
            })}
          </nav>
          <p className="hidden px-4 pt-6 text-[0.78rem] text-white/45 md:block">Datos de ejemplo. Nada de aquí se envía ni se guarda.</p>
        </aside>

        <div className="min-w-0">
          <div className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b px-4 py-3" style={{ background: tema.fondo, borderColor: tema.borde }}>
            <label className="relative min-w-[10rem] flex-1 md:max-w-md">
              <span className="sr-only">Buscar</span>
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-55" />
              <input value={q} onChange={(e) => { setQ(e.target.value); if (e.target.value) setSec("clientes"); }} placeholder="Buscar por nombre, teléfono o placa" className="w-full rounded-lg border bg-white py-2.5 pl-9 pr-3" style={{ borderColor: tema.borde }} />
            </label>
            {sedes && (
              <label className="text-[0.85rem] font-semibold">
                <span className="sr-only">Sucursal</span>
                <select value={sede} onChange={(e) => setSede(e.target.value)} className="rounded-lg border bg-white px-3 py-2.5" style={{ borderColor: tema.borde }}>
                  {sedes.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
            )}
            <div className="relative ml-auto flex items-center gap-3">
              <button type="button" onClick={() => setAbiertos((v) => !v)} aria-expanded={abiertos} aria-label={`Avisos: ${avisos.length}`} className="relative grid h-10 w-10 place-items-center rounded-lg border bg-white" style={{ borderColor: tema.borde }}>
                <Bell size={18} />
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.7rem] font-bold text-white" style={{ background: tema.malo }}>{avisos.length}</span>
              </button>
              {abiertos && (
                <div className="absolute right-0 top-12 z-30 w-72 rounded-xl border bg-white p-3 shadow-xl" style={{ borderColor: tema.borde }} role="dialog" aria-label="Avisos">
                  <p className="text-[0.8rem] font-bold uppercase opacity-60">Avisos</p>
                  <ul className="mt-2 space-y-2 text-[0.9rem]">{avisos.map((a) => <li key={a} className="rounded-lg p-2" style={{ background: tema.suave }}>{a}</li>)}</ul>
                </div>
              )}
              <div className="hidden text-right leading-tight sm:block"><p className="text-[0.92rem] font-bold">{usuario.nombre}</p><p className="text-[0.78rem] opacity-65">{usuario.rol}</p></div>
              <span className="grid h-10 w-10 place-items-center rounded-full font-bold" style={{ background: tema.acento, color: tema.sobreAcento }} aria-hidden>{usuario.nombre[0]}</span>
            </div>
          </div>
          <div className="px-4 py-6 sm:px-6">{children(sec, q, setSec, sede)}</div>
        </div>
      </div>
    </TemaCtx.Provider>
  );
}

/* ---------- piezas chicas ---------- */

export function Titulo({ t, sub, derecha }: { t: string; sub?: string; derecha?: ReactNode }) {
  const tema = useTema();
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[1.7rem] leading-tight" style={{ fontFamily: tema.titulo, fontWeight: 700 }}>{t}</h1>
        {sub && <p className="mt-1 max-w-xl text-[0.95rem] opacity-70">{sub}</p>}
      </div>
      {derecha}
    </div>
  );
}
export function Caja({ children, className = "" }: { children: ReactNode; className?: string }) {
  const tema = useTema();
  return <div className={`rounded-xl border bg-white p-4 ${className}`} style={{ borderColor: tema.borde, borderRadius: tema.radio }}>{children}</div>;
}
export function Boton({ children, alTocar, tipo = "lleno", chico = false, ancho = false }: { children: ReactNode; alTocar: () => void; tipo?: "lleno" | "borde"; chico?: boolean; ancho?: boolean }) {
  const tema = useTema();
  return (
    <button
      type="button"
      onClick={alTocar}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-bold shadow-sm transition hover:brightness-95 active:translate-y-px active:scale-[0.98] ${chico ? "min-h-[2.75rem] px-4 py-2.5 text-[0.95rem]" : "min-h-[3rem] px-5 py-3 text-[1rem]"} ${ancho ? "w-full" : ""}`}
      style={tipo === "lleno" ? { background: tema.acento, color: tema.sobreAcento, border: `2px solid ${tema.tinta}` } : { background: "#fff", border: `2px solid ${tema.tinta}`, color: tema.tinta }}
    >
      {children}
    </button>
  );
}

/* Estado en palabras sencillas, con icono y color: no hay que adivinar qué significa */
export function Insignia({ icono, texto, color }: { icono: ReactNode; texto: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[0.88rem] font-bold text-white" style={{ background: color }}>
      {icono} {texto}
    </span>
  );
}

export type Kpi = { t: string; v: string; nota?: string; tono?: "bien" | "alerta" | "normal" };
export function Kpis({ items }: { items: Kpi[] }) {
  const tema = useTema();
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((k) => (
        <Caja key={k.t}>
          <p className="text-[0.85rem] opacity-65">{k.t}</p>
          <p className="mt-1 text-[1.9rem] font-bold leading-none tabular-nums" style={{ fontFamily: tema.titulo, color: k.tono === "alerta" ? tema.malo : k.tono === "bien" ? tema.bueno : tema.tinta }}>{k.v}</p>
          {k.nota && <p className="mt-1.5 text-[0.82rem] opacity-65">{k.nota}</p>}
        </Caja>
      ))}
    </div>
  );
}

export type Atencion = { id: string; texto: string; boton: string; alTocar: () => void; urgencia?: "alta" | "media" };
export function PorAtender({ items, vacio }: { items: Atencion[]; vacio: string }) {
  const tema = useTema();
  return (
    <Caja>
      <h2 className="text-[1.1rem] font-bold" style={{ fontFamily: tema.titulo }}>Lo que necesita atención</h2>
      {items.length === 0 ? (
        <p className="mt-3 flex items-center gap-2 font-semibold" style={{ color: tema.bueno }}><Check size={18} /> {vacio}</p>
      ) : (
        <ul className="mt-3 divide-y" style={{ borderColor: tema.borde }}>
          {items.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
              <p className="flex items-start gap-2 text-[0.95rem]"><span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: a.urgencia === "alta" ? tema.malo : tema.medio }} aria-hidden /> {a.texto}</p>
              <Boton alTocar={a.alTocar} chico>{a.boton} <ArrowRight size={16} /></Boton>
            </li>
          ))}
        </ul>
      )}
    </Caja>
  );
}

/* ---------- agenda del día ---------- */

export type Evento = { id: string; hora: string; titulo: string; sub: string; quien: string; estado: "confirmada" | "pendiente" | "en curso" | "atendida" };
export function Agenda({ eventos, columnas, horas, dia }: { eventos: Evento[]; columnas: string[]; horas: string[]; dia: string }) {
  const tema = useTema();
  const color = (e: Evento["estado"]) => (e === "atendida" ? tema.bueno : e === "en curso" ? tema.acento : e === "pendiente" ? tema.medio : tema.tinta);
  return (
    <Caja className="overflow-x-auto">
      <p className="mb-3 flex items-center gap-2 font-bold"><button type="button" aria-label="Día anterior" className="rounded border p-1" style={{ borderColor: tema.borde }}><ChevronLeft size={16} /></button> {dia} <button type="button" aria-label="Día siguiente" className="rounded border p-1" style={{ borderColor: tema.borde }}><ChevronRight size={16} /></button></p>
      <table className="w-full min-w-[34rem] border-collapse text-[0.9rem]">
        <thead>
          <tr><th className="w-16 p-2" />{columnas.map((c) => <th key={c} className="border-b p-2 text-left font-bold" style={{ borderColor: tema.borde }}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {horas.map((h) => (
            <tr key={h}>
              <td className="border-b p-2 align-top font-semibold tabular-nums opacity-65" style={{ borderColor: tema.borde }}>{h}</td>
              {columnas.map((c) => {
                const e = eventos.find((x) => x.hora === h && x.quien === c);
                return (
                  <td key={c} className="h-14 border-b p-1 align-top" style={{ borderColor: tema.borde }}>
                    {e && (
                      <div className="rounded-lg px-2 py-1.5 text-white" style={{ background: color(e.estado) }}>
                        <p className="font-bold leading-tight">{e.titulo}</p>
                        <p className="text-[0.78rem] leading-tight opacity-85">{e.sub} · {e.estado}</p>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Caja>
  );
}

/* ---------- clientes con su ficha ---------- */

export type Cliente = { id: string; nombre: string; tel: string; etiqueta: string; ultima: string; proxima: string; total: number; datos: [string, string][]; historial: { fecha: string; texto: string }[] };
export function Clientes({ lista, q, colEtiqueta, mensaje, demo }: { lista: Cliente[]; q: string; colEtiqueta: string; mensaje: (c: Cliente) => string; demo: string }) {
  const tema = useTema();
  const [etiqueta, setEtiqueta] = useState("todas");
  const [abierto, setAbierto] = useState<Cliente | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const etiquetas = ["todas", ...Array.from(new Set(lista.map((c) => c.etiqueta)))];
  const buscar = q.trim().toLowerCase();
  const filas = lista.filter((c) => (etiqueta === "todas" || c.etiqueta === etiqueta) && (!buscar || `${c.nombre} ${c.tel} ${c.datos.map((d) => d[1]).join(" ")}`.toLowerCase().includes(buscar)));
  return (
    <>
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Filtrar">
        {etiquetas.map((e) => (
          <button key={e} type="button" aria-pressed={etiqueta === e} onClick={() => setEtiqueta(e)} className="rounded-full border px-3.5 py-1.5 text-[0.88rem] font-semibold capitalize" style={etiqueta === e ? { background: tema.tinta, color: "#fff", borderColor: tema.tinta } : { borderColor: tema.borde, background: "#fff" }}>{e}</button>
        ))}
      </div>
      <Caja className="overflow-x-auto !p-0">
        <table className="w-full min-w-[40rem] border-collapse text-[0.92rem]">
          <thead>
            <tr className="text-left text-[0.8rem] uppercase opacity-60">
              {["Nombre", "Teléfono", colEtiqueta, "Última visita", "Próxima", "Total"].map((h) => <th key={h} className="p-3 font-bold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filas.map((c) => (
              <tr key={c.id} onClick={() => setAbierto(c)} className="cursor-pointer border-t hover:bg-black/[.03]" style={{ borderColor: tema.borde }}>
                <td className="p-3 font-bold"><button type="button" onClick={() => setAbierto(c)} className="text-left underline-offset-2 hover:underline">{c.nombre}</button></td>
                <td className="p-3 tabular-nums">{c.tel}</td>
                <td className="p-3"><span className="rounded-full px-2.5 py-1 text-[0.8rem] font-semibold" style={{ background: tema.suave }}>{c.etiqueta}</span></td>
                <td className="p-3">{c.ultima}</td>
                <td className="p-3">{c.proxima}</td>
                <td className="p-3 font-bold tabular-nums">{qz(c.total)}</td>
              </tr>
            ))}
            {filas.length === 0 && <tr><td colSpan={6} className="p-6 text-center opacity-65">Nadie coincide con «{q}». Pruebe con otro nombre o teléfono.</td></tr>}
          </tbody>
        </table>
      </Caja>
      {abierto && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40" onClick={() => setAbierto(null)}>
          <aside role="dialog" aria-label={`Ficha de ${abierto.nombre}`} onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div><h2 className="text-[1.5rem] font-bold" style={{ fontFamily: tema.titulo }}>{abierto.nombre}</h2><p className="opacity-70">{abierto.tel}</p></div>
              <button type="button" onClick={() => setAbierto(null)} aria-label="Cerrar ficha" className="rounded-lg border p-2" style={{ borderColor: tema.borde }}><X size={18} /></button>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl p-3 text-[0.9rem]" style={{ background: tema.suave }}>
              {abierto.datos.map(([k, v]) => <div key={k}><dt className="text-[0.78rem] uppercase opacity-60">{k}</dt><dd className="font-semibold">{v}</dd></div>)}
              <div><dt className="text-[0.78rem] uppercase opacity-60">Próxima</dt><dd className="font-semibold">{abierto.proxima}</dd></div>
              <div><dt className="text-[0.78rem] uppercase opacity-60">Ha gastado</dt><dd className="font-semibold">{qz(abierto.total)}</dd></div>
            </dl>
            <h3 className="mt-5 font-bold">Historial</h3>
            <ol className="mt-2 space-y-3 border-l-2 pl-4" style={{ borderColor: tema.acento }}>
              {abierto.historial.map((h) => <li key={h.fecha + h.texto}><p className="text-[0.8rem] font-semibold opacity-60">{h.fecha}</p><p>{h.texto}</p></li>)}
            </ol>
            <div className="mt-6"><Boton alTocar={() => setMsg(mensaje(abierto))}><Send size={16} /> Escribirle por WhatsApp</Boton></div>
          </aside>
        </div>
      )}
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo={demo} que="el mensaje" />
    </>
  );
}

/* ---------- tablero por etapas ---------- */

export type Tarjeta = { id: string; titulo: string; sub: string; etapa: number; monto?: number; etiqueta?: string; extra?: Record<string, string> };
export function Tablero({ etapas, tarjetas, setTarjetas, alAvisar }: { etapas: string[]; tarjetas: Tarjeta[]; setTarjetas: (f: (l: Tarjeta[]) => Tarjeta[]) => void; alAvisar?: (t: Tarjeta) => void }) {
  const tema = useTema();
  const mover = (id: string, d: number) => setTarjetas((l) => l.map((t) => (t.id === id ? { ...t, etapa: Math.min(etapas.length - 1, Math.max(0, t.etapa + d)) } : t)));
  return (
    <div className="grid gap-3 overflow-x-auto pb-2" style={{ gridTemplateColumns: `repeat(${etapas.length}, minmax(15rem, 1fr))` }}>
      {etapas.map((e, i) => {
        const col = tarjetas.filter((t) => t.etapa === i);
        const suma = col.reduce((a, t) => a + (t.monto ?? 0), 0);
        return (
          <section key={e} aria-label={e} className="rounded-xl p-2.5" style={{ background: tema.suave }}>
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="text-[0.9rem] font-bold">{e}</h2>
              <span className="rounded-full bg-white px-2 py-0.5 text-[0.78rem] font-bold">{col.length}</span>
            </div>
            {suma > 0 && <p className="mb-2 px-1 text-[0.78rem] opacity-65">{qz(suma)}</p>}
            <div className="space-y-2">
              {col.map((t) => (
                <div key={t.id} className="rounded-lg border bg-white p-3" style={{ borderColor: tema.borde }}>
                  {t.etiqueta && <span className="mb-1 inline-block rounded px-1.5 py-0.5 text-[0.7rem] font-bold uppercase" style={{ background: tema.acento, color: tema.sobreAcento }}>{t.etiqueta}</span>}
                  <p className="font-bold leading-tight">{t.titulo}</p>
                  <p className="text-[0.82rem] opacity-70">{t.sub}{t.monto ? ` · ${qz(t.monto)}` : ""}</p>
                  <div className="mt-3 space-y-2">
                    {i < etapas.length - 1 && <Boton alTocar={() => mover(t.id, 1)} chico ancho>Pasar a: {etapas[i + 1]} <ArrowRight size={16} /></Boton>}
                    <div className="flex items-center justify-between gap-2">
                      {i > 0 ? <button type="button" onClick={() => mover(t.id, -1)} aria-label={`Regresar ${t.titulo} a ${etapas[i - 1]}`} className="inline-flex min-h-[2.25rem] items-center gap-1 whitespace-nowrap text-[0.85rem] font-semibold underline underline-offset-2"><ChevronLeft size={15} /> Volver atrás</button> : <span />}
                      {alAvisar && <button type="button" onClick={() => alAvisar(t)} className="inline-flex min-h-[2.25rem] items-center gap-1.5 rounded-lg border-2 px-2.5 text-[0.85rem] font-bold" style={{ borderColor: tema.tinta }}><Bell size={14} /> Avisar</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ---------- mensajes ---------- */

export type Conversacion = { id: string; nombre: string; hora: string; sinLeer?: boolean; mensajes: { de: "cliente" | "negocio"; texto: string }[] };
export type Plantilla = { id: string; nombre: string; texto: string };
export type Automatizacion = { id: string; nombre: string; detalle: string; activa: boolean };
export function Mensajes({ conversaciones, plantillas, automatizaciones }: { conversaciones: Conversacion[]; plantillas: Plantilla[]; automatizaciones: Automatizacion[] }) {
  const tema = useTema();
  const [lista, setLista] = useState(conversaciones);
  const [sel, setSel] = useState(conversaciones[0].id);
  const [texto, setTexto] = useState("");
  const [auto, setAuto] = useState(automatizaciones);
  const actual = lista.find((c) => c.id === sel)!;
  function enviar() {
    if (!texto.trim()) return;
    setLista((l) => l.map((c) => (c.id === sel ? { ...c, sinLeer: false, mensajes: [...c.mensajes, { de: "negocio", texto: texto.trim() }] } : c)));
    setTexto("");
  }
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <Caja className="grid min-h-[26rem] grid-cols-[minmax(0,1fr)] !p-0 md:grid-cols-[13rem_minmax(0,1fr)]">
        <ul className="border-b md:border-b-0 md:border-r" style={{ borderColor: tema.borde }} aria-label="Conversaciones">
          {lista.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => { setSel(c.id); setLista((l) => l.map((x) => (x.id === c.id ? { ...x, sinLeer: false } : x))); }} className="flex w-full items-center justify-between gap-2 border-b p-3 text-left" style={{ borderColor: tema.borde, background: sel === c.id ? tema.suave : "transparent" }}>
                <span className="min-w-0"><span className="block truncate font-bold">{c.nombre}</span><span className="block truncate text-[0.82rem] opacity-65">{c.mensajes[c.mensajes.length - 1].texto}</span></span>
                <span className="flex shrink-0 flex-col items-end gap-1 text-[0.75rem] opacity-80">{c.hora}{c.sinLeer && <span className="h-2.5 w-2.5 rounded-full" style={{ background: tema.malo }} aria-label="Sin leer" />}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-col p-3">
          <p className="border-b pb-2 font-bold" style={{ borderColor: tema.borde }}>{actual.nombre}</p>
          <div className="flex-1 space-y-2 py-3">
            {actual.mensajes.map((m, i) => (
              <p key={i} className={`max-w-[85%] whitespace-pre-line rounded-xl px-3 py-2 text-[0.92rem] ${m.de === "negocio" ? "ml-auto" : ""}`} style={m.de === "negocio" ? { background: "#d9fdd3", color: "#111b21" } : { background: tema.suave }}>{m.texto}</p>
            ))}
          </div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {plantillas.map((p) => <button key={p.id} type="button" onClick={() => setTexto(p.texto)} className="rounded-full border px-2.5 py-1 text-[0.78rem] font-semibold" style={{ borderColor: tema.borde }}>{p.nombre}</button>)}
          </div>
          <div className="flex gap-2">
            <label className="min-w-0 flex-1"><span className="sr-only">Mensaje</span><textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={2} placeholder="Escriba o escoja una plantilla" className="w-full rounded-lg border p-2.5 text-[0.92rem]" style={{ borderColor: tema.borde }} /></label>
            <Boton alTocar={enviar}><Send size={16} /> Enviar</Boton>
          </div>
        </div>
      </Caja>
      <Caja>
        <h2 className="font-bold" style={{ fontFamily: tema.titulo }}>Mensajes automáticos</h2>
        <p className="text-[0.82rem] opacity-65">Salen solos, sin que nadie los escriba.</p>
        <ul className="mt-3 space-y-3">
          {auto.map((a) => (
            <li key={a.id} className="flex items-start gap-3">
              <button type="button" role="switch" aria-checked={a.activa} aria-label={a.nombre} onClick={() => setAuto((l) => l.map((x) => (x.id === a.id ? { ...x, activa: !x.activa } : x)))} className="mt-0.5 h-6 w-11 shrink-0 rounded-full p-0.5 transition" style={{ background: a.activa ? tema.bueno : "#c9ced6" }}>
                <span className="block h-5 w-5 rounded-full bg-white transition-transform" style={{ transform: a.activa ? "translateX(1.25rem)" : "none" }} />
              </button>
              <div><p className="text-[0.92rem] font-bold leading-tight">{a.nombre}</p><p className="text-[0.8rem] opacity-65">{a.detalle}</p></div>
            </li>
          ))}
        </ul>
      </Caja>
    </div>
  );
}

/* ---------- reseñas ---------- */

export type ResenaPanel = { id: string; nombre: string; estrellas: number; texto: string; fecha: string; sugerida?: string; respondida?: boolean };
export function Resenas({ items, promedio, total, pedirTexto }: { items: ResenaPanel[]; promedio: string; total: number; pedirTexto: string }) {
  const tema = useTema();
  const [lista, setLista] = useState(items);
  const [msg, setMsg] = useState<string | null>(null);
  const pend = lista.filter((r) => !r.respondida).length;
  return (
    <>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Caja><p className="text-[0.85rem] opacity-65">Calificación en Google</p><p className="text-[1.9rem] font-bold leading-none" style={{ fontFamily: tema.titulo }}>{promedio}</p><p className="mt-1.5 text-[0.82rem] opacity-65">{total} opiniones</p></Caja>
        <Caja><p className="text-[0.85rem] opacity-65">Por responder</p><p className="text-[1.9rem] font-bold leading-none" style={{ color: pend ? tema.malo : tema.bueno, fontFamily: tema.titulo }}>{pend}</p></Caja>
        <Caja><p className="text-[0.85rem] opacity-65">Pedir reseñas</p><div className="mt-2"><Boton alTocar={() => setMsg(pedirTexto)} chico><Send size={14} /> Mandar el pedido</Boton></div></Caja>
      </div>
      <div className="space-y-3">
        {lista.map((r) => (
          <Caja key={r.id}>
            <p className="flex items-center gap-2 font-bold">{r.nombre} <span className="inline-flex" role="img" aria-label={`${r.estrellas} estrellas`}>{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={15} fill={i <= r.estrellas ? tema.medio : "none"} stroke={tema.medio} />)}</span><span className="ml-auto text-[0.8rem] font-normal opacity-60">{r.fecha}</span></p>
            <p className="mt-1.5">{r.texto}</p>
            {r.respondida ? <p className="mt-2 flex items-center gap-2 text-[0.9rem] font-bold" style={{ color: tema.bueno }}><Check size={16} /> Respondida</p> : (
              <>
                {r.sugerida && <p className="mt-2 rounded-lg p-2.5 text-[0.9rem]" style={{ background: tema.suave }}>{r.sugerida}</p>}
                <div className="mt-2"><Boton alTocar={() => setLista((l) => l.map((x) => (x.id === r.id ? { ...x, respondida: true } : x)))} chico>Publicar respuesta</Boton></div>
              </>
            )}
          </Caja>
        ))}
      </div>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="negocio" que="el pedido de reseña" />
    </>
  );
}

/* ---------- reportes ---------- */

export function Barras({ titulo, datos, formato = (n: number) => String(n) }: { titulo: string; datos: { t: string; v: number }[]; formato?: (n: number) => string }) {
  const tema = useTema();
  const max = Math.max(...datos.map((d) => d.v));
  return (
    <Caja>
      <h2 className="font-bold" style={{ fontFamily: tema.titulo }}>{titulo}</h2>
      <div className="mt-4 flex h-44 items-end gap-2" role="img" aria-label={titulo}>
        {datos.map((d) => (
          <div key={d.t} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <span className="text-[0.72rem] font-semibold tabular-nums">{formato(d.v)}</span>
            <span className="w-full rounded-t" style={{ height: `${(d.v / max) * 82}%`, background: tema.acento }} />
            <span className="text-[0.75rem] opacity-65">{d.t}</span>
          </div>
        ))}
      </div>
    </Caja>
  );
}
export function Ranking({ titulo, datos, formato = (n: number) => String(n) }: { titulo: string; datos: { t: string; v: number }[]; formato?: (n: number) => string }) {
  const tema = useTema();
  const max = Math.max(...datos.map((d) => d.v));
  return (
    <Caja>
      <h2 className="font-bold" style={{ fontFamily: tema.titulo }}>{titulo}</h2>
      <ul className="mt-3 space-y-2.5">
        {datos.map((d) => (
          <li key={d.t} className="text-[0.9rem]">
            <div className="flex justify-between gap-3"><span>{d.t}</span><b className="tabular-nums">{formato(d.v)}</b></div>
            <span className="mt-1 block h-2 overflow-hidden rounded-full bg-black/10"><span className="block h-full rounded-full" style={{ width: `${(d.v / max) * 100}%`, background: tema.acento }} /></span>
          </li>
        ))}
      </ul>
    </Caja>
  );
}

/* ---------- equipo ---------- */

export type Persona = { nombre: string; rol: string; carga: number; detalle: string };
export function Equipo({ personas }: { personas: Persona[] }) {
  const tema = useTema();
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {personas.map((p) => (
        <Caja key={p.nombre}>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full font-bold" style={{ background: tema.acento, color: tema.sobreAcento }} aria-hidden>{p.nombre.replace(/^(Dra?\.|Lic\.)\s*/, "")[0]}</span>
            <div><p className="font-bold leading-tight">{p.nombre}</p><p className="text-[0.85rem] opacity-65">{p.rol}</p></div>
          </div>
          <p className="mt-3 text-[0.85rem] font-semibold">Carga de hoy: {p.carga}%</p>
          <span className="mt-1 block h-2.5 overflow-hidden rounded-full bg-black/10"><span className="block h-full rounded-full" style={{ width: `${p.carga}%`, background: p.carga > 85 ? tema.malo : tema.acento }} /></span>
          <p className="mt-2 text-[0.85rem] opacity-70">{p.detalle}</p>
        </Caja>
      ))}
    </div>
  );
}
