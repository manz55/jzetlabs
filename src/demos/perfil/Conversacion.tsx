/*
 * La conversación entre la consultora y una persona que le escribió desde su página.
 * Si es una cita o una clase, aquí se acuerda el día, la hora y el lugar, y eso queda guardado
 * para que el panel y la página lo muestren. En su negocio, los mensajes salen por WhatsApp.
 */
import { useEffect, useRef, useState } from "react";
import { CalendarDays, Check, MapPin, Phone, Send } from "lucide-react";
import { MESES, TINTA, TIPOS_BANDEJA, VINO, telTexto, useBandeja, type Mensaje } from "./datos";
import { Ventana } from "./Ventana";

const SERIF = '"Fraunces", Georgia, serif';
const esCita = (t: string) => t === "facial" || t === "reunion" || t === "evento";
const dosDig = (n: number) => String(n).padStart(2, "0");
export const cuandoTexto = (iso?: string) => { if (!iso) return "Sin fecha"; const d = new Date(iso); return `${d.getDate()} de ${MESES[d.getMonth()]}, ${d.getHours() % 12 || 12}:${dosDig(d.getMinutes())} ${d.getHours() >= 12 ? "pm" : "am"}`; };
const RAPIDAS: Record<string, string[]> = {
  chat: ["Claro, te mando el precio.", "Sí lo tengo en mano.", "¿Me pasas tu dirección?"],
  pedido: ["Recibí tu pedido, gracias.", "Te lo llevo mañana.", "¿Me confirmas tu dirección?"],
  facial: ["¿Te queda bien ese día?", "¿Me das tu dirección?", "Ahí nos vemos."],
  reunion: ["¿Cuántas amigas vienen?", "¿Me das tu dirección?", "Ahí nos vemos."],
  evento: ["¿A qué hora necesitas estar lista?", "¿Dónde es?", "Te aparto la fecha."],
  aviso: ["Gracias por anotarte."], equipo: ["Me da gusto, te cuento cómo empezar."],
};

export function Conversacion({ id, alCerrar, avisar }: { id: string; alCerrar: () => void; avisar: (t: string) => void }) {
  const { lista, cambiar } = useBandeja();
  const e = lista.find((x) => x.id === id);
  const [texto, setTexto] = useState("");
  const fin = useRef<HTMLDivElement>(null);
  useEffect(() => { if (e && !e.leido) cambiar(e.id, { leido: true }); }, [e, cambiar]);
  const hilo: Mensaje[] = e ? e.hilo ?? [{ de: "clienta", t: e.texto, fecha: e.fecha }] : [];
  useEffect(() => { fin.current?.scrollIntoView({ block: "end" }); }, [hilo.length]);
  if (!e) return null;
  const cita = esCita(e.tipo);
  const d = e.cuando ? new Date(e.cuando) : null;
  const dia = d ? `${d.getFullYear()}-${dosDig(d.getMonth() + 1)}-${dosDig(d.getDate())}` : "";
  const hora = d ? `${dosDig(d.getHours())}:${dosDig(d.getMinutes())}` : "";
  const poner = (nuevoDia: string, nuevaHora: string) => { if (!nuevoDia) return; const [a, m, di] = nuevoDia.split("-").map(Number); const [h, mi] = (nuevaHora || "09:00").split(":").map(Number); cambiar(e.id, { cuando: new Date(a, m - 1, di, h, mi).toISOString(), confirmada: false }); };
  const mandar = (t: string) => { const limpio = t.trim(); if (!limpio) return; cambiar(e.id, { hilo: [...hilo, { de: "ella", t: limpio, fecha: new Date().toISOString() }], leido: true }); setTexto(""); };
  const confirmar = () => {
    if (!e.cuando) { avisar("Primero elige el día y la hora."); return; }
    const m = `Quedamos el ${cuandoTexto(e.cuando)}${e.lugar ? ` en ${e.lugar}` : ""}. ¡Te espero!`;
    cambiar(e.id, { confirmada: true, hilo: [...hilo, { de: "ella", t: m, fecha: new Date().toISOString() }], leido: true });
  };
  const campo = "min-h-[3rem] w-full rounded-xl border-2 bg-white px-3 text-[1.05rem] outline-none focus:border-black/70";
  return (
    <Ventana titulo={`Conversación con ${e.nombre}`} alCerrar={alCerrar} ancho="46rem">
      <div className="p-5 pt-6 sm:p-7">
        <p className="text-[0.9rem] font-bold uppercase tracking-wide" style={{ color: VINO }}>{TIPOS_BANDEJA[e.tipo]}</p>
        <h3 className="pr-14 text-[clamp(1.7rem,1.3rem+1.2vw,2.3rem)] font-medium leading-tight" style={{ fontFamily: SERIF }}>{e.nombre}</h3>
        {e.telefono && <p className="mt-1 flex items-center gap-2 text-[1.05rem] opacity-75"><Phone size={16} /> {telTexto(e.telefono)}</p>}

        {cita && (
          <div className="mt-4 grid gap-3 rounded-2xl p-4 sm:grid-cols-3" style={{ background: "#fdf3ed" }}>
            <label className="grid gap-1 text-[0.95rem] font-semibold"><span className="flex items-center gap-1.5"><CalendarDays size={16} /> Día</span><input type="date" value={dia} onChange={(ev) => poner(ev.target.value, hora)} className={campo} style={{ borderColor: "rgba(42,22,51,.25)" }} /></label>
            <label className="grid gap-1 text-[0.95rem] font-semibold"><span>Hora</span><input type="time" value={hora} onChange={(ev) => poner(dia || new Date().toISOString().slice(0, 10), ev.target.value)} className={campo} style={{ borderColor: "rgba(42,22,51,.25)" }} /></label>
            <label className="grid gap-1 text-[0.95rem] font-semibold"><span className="flex items-center gap-1.5"><MapPin size={16} /> Dónde</span><input value={e.lugar ?? ""} onChange={(ev) => cambiar(e.id, { lugar: ev.target.value })} placeholder="Dirección o lugar" className={campo} style={{ borderColor: "rgba(42,22,51,.25)" }} /></label>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-3">
              <button type="button" onClick={confirmar} className="pf-btn inline-flex min-h-[3rem] items-center gap-2 rounded-full px-6 text-[1.05rem] font-semibold text-white" style={{ background: e.confirmada ? "#2f6b45" : TINTA }}>{e.confirmada && <Check size={18} strokeWidth={3} />}{e.confirmada ? "Cita confirmada" : "Confirmar con la clienta"}</button>
              <span className="text-[0.95rem] opacity-70">{e.cuando ? `${cuandoTexto(e.cuando)}${e.lugar ? ` · ${e.lugar}` : ""}` : "Aún sin fecha"}</span>
            </div>
          </div>
        )}

        <div className="mt-4 max-h-[40svh] space-y-2.5 overflow-y-auto rounded-2xl p-4" style={{ background: "#fdf3ed" }}>
          {hilo.map((m, i) => (
            <div key={i} className={m.de === "ella" ? "ml-auto max-w-[85%]" : "max-w-[85%]"}>
              <p className={`rounded-2xl px-4 py-2.5 text-[1.05rem] leading-snug ${m.de === "ella" ? "rounded-br-md text-white" : "rounded-bl-md bg-white shadow-sm"}`} style={m.de === "ella" ? { background: TINTA } : undefined}>{m.t}</p>
              <p className={`mt-0.5 text-[0.8rem] opacity-55 ${m.de === "ella" ? "text-right" : ""}`}>{m.de === "ella" ? "Tú" : e.nombre.split(" ")[0]} · {new Date(m.fecha).toLocaleTimeString("es-GT", { hour: "numeric", minute: "2-digit" })}</p>
            </div>
          ))}
          <div ref={fin} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">{(RAPIDAS[e.tipo] ?? []).map((q) => <button key={q} type="button" onClick={() => mandar(q)} className="min-h-[2.5rem] rounded-full border-2 bg-white px-3.5 text-[0.95rem] font-semibold" style={{ borderColor: VINO, color: VINO }}>{q}</button>)}</div>
        <form onSubmit={(ev) => { ev.preventDefault(); mandar(texto); }} className="mt-3 flex items-center gap-2">
          <input aria-label="Tu respuesta" value={texto} onChange={(ev) => setTexto(ev.target.value)} placeholder="Escribe tu respuesta" className="min-h-[3.25rem] min-w-0 flex-1 rounded-full border-2 px-5 text-[1.05rem] outline-none focus:border-black/70" style={{ borderColor: "rgba(42,22,51,.25)" }} />
          <button type="submit" aria-label="Enviar" disabled={!texto.trim()} className="pf-btn grid h-[3.25rem] w-[3.25rem] shrink-0 place-items-center rounded-full text-white disabled:opacity-40" style={{ background: VINO }}><Send size={20} /></button>
        </form>
        <p className="mt-2 text-[0.88rem] opacity-55">En su negocio, estos mensajes salen por WhatsApp.</p>
      </div>
    </Ventana>
  );
}
