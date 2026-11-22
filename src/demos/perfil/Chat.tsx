/*
 * El chat de ejemplo de la consultora: aparece en una esquina, saluda y contesta lo de siempre.
 * En la página real se conecta a un chat de verdad (Tawk.to, por ejemplo) o directo a su WhatsApp.
 */
import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { TINTA, VINO } from "./datos";

type Msj = { de: "ella" | "tu"; t: string };

const RESPUESTAS: Record<string, string> = {
  "Quiero una rutina para mi piel": "Perfecto. Contesta el test de 3 minutos y te digo qué usar en la mañana y en la noche. Si prefieres, mándame una foto sin maquillaje y yo te la armo.",
  "¿Qué promos hay?": "Esta campaña tengo la rutina completa de piel en Q499, dos labiales en Q175 y el kit para regalar en Q420. Todo con entrega el mismo día en la capital.",
  "Maquillaje para un evento": "Claro. Dime la fecha, la hora y si es para ti o para varias. Con eso te mando el precio y reviso que tenga lugar ese día.",
  "¿Cómo pago?": "Pagas cuando te llegue, en efectivo o por transferencia. Si algo no te gusta, te lo cambio.",
};

export function ChatSofia({ alCerrar }: { alCerrar: () => void }) {
  const [msj, setMsj] = useState<Msj[]>([{ de: "ella", t: "Hola, qué gusto que me escribas. Cuéntame, ¿qué estás buscando hoy?" }]);
  const [escribe, setEscribe] = useState(false);
  const [texto, setTexto] = useState("");
  const fin = useRef<HTMLDivElement>(null);
  useEffect(() => { fin.current?.scrollIntoView({ block: "end", behavior: "smooth" }); }, [msj, escribe]);

  const mandar = (t: string) => {
    const limpio = t.trim();
    if (!limpio || escribe) return;
    setMsj((m) => [...m, { de: "tu", t: limpio }]);
    setTexto("");
    setEscribe(true);
    window.setTimeout(() => {
      setMsj((m) => [...m, { de: "ella", t: RESPUESTAS[limpio] ?? "Gracias, ya te leí. Déjame tu número de WhatsApp y te respondo en unos minutos con todo el detalle." }]);
      setEscribe(false);
    }, 1000);
  };

  return (
    <div role="dialog" aria-label="Chat con tu consultora" className="fixed bottom-3 right-3 z-[80] flex max-h-[min(34rem,calc(100svh-1.5rem))] w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl print:hidden" style={{ border: `2px solid ${VINO}`, color: TINTA }}>
      <div className="flex items-center gap-3 px-4 py-3 text-white" style={{ background: VINO }}>
        <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20 text-[1.05rem] font-bold">TC<span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#4ade80]" /></span>
        <span className="min-w-0 flex-1 leading-tight"><b className="block text-[1.1rem]">Tu consultora</b><span className="text-[0.9rem] opacity-85">En línea ahora</span></span>
        <button type="button" aria-label="Cerrar el chat" onClick={alCerrar} className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/15"><X size={20} /></button>
      </div>
      <div className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4" style={{ background: "#fdf3ed", minHeight: "12rem" }}>
        {msj.map((m, i) => (
          <p key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[1.05rem] leading-snug ${m.de === "tu" ? "ml-auto rounded-br-md text-white" : "rounded-bl-md bg-white shadow-sm"}`} style={m.de === "tu" ? { background: TINTA } : undefined}>{m.t}</p>
        ))}
        {escribe && <p className="w-16 rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-[1.3rem] leading-none shadow-sm" aria-label="Escribiendo">···</p>}
        {msj.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {Object.keys(RESPUESTAS).map((q) => <button key={q} type="button" onClick={() => mandar(q)} className="pf-btn min-h-[2.75rem] rounded-full border-2 bg-white px-4 text-[1rem] font-semibold" style={{ borderColor: VINO, color: VINO }}>{q}</button>)}
          </div>
        )}
        <div ref={fin} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); mandar(texto); }} className="flex items-center gap-2 border-t p-3">
        <input aria-label="Escribe tu mensaje" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe aquí" className="min-h-[3rem] min-w-0 flex-1 rounded-full border-2 border-black/15 px-4 text-[1.05rem] outline-none focus:border-black/60" />
        <button type="submit" aria-label="Enviar" disabled={!texto.trim()} className="pf-btn grid h-12 w-12 shrink-0 place-items-center rounded-full text-white disabled:opacity-40" style={{ background: VINO }}><Send size={19} /></button>
      </form>
      <p className="px-4 pb-3 text-center text-[0.85rem] opacity-55">Chat de ejemplo · en su página real se conecta a Tawk.to o a su WhatsApp</p>
    </div>
  );
}
