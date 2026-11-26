/* Ventana del chat con recepción y el botón que la abre. */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { HOTEL } from "./datos";
import type { Mensaje } from "./recepcion";

const SUGERENCIAS = ["¿Tienen parqueo?", "¿A qué hora es el check-in?", "¿Cómo puedo cancelar?"];

export function Chat({ mensajes, escribiendo, alEnviar, alCerrar }: { mensajes: Mensaje[]; escribiendo: boolean; alEnviar: (texto: string) => void; alCerrar: () => void }) {
  const [texto, setTexto] = useState("");
  const dialogo = useRef<HTMLDialogElement>(null);
  const lista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = dialogo.current;
    if (d && !d.open) d.showModal();
  }, []);

  useEffect(() => {
    if (lista.current) lista.current.scrollTop = lista.current.scrollHeight;
  }, [mensajes, escribiendo]);

  const cerrar = () => dialogo.current?.close();
  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;
    alEnviar(texto.trim());
    setTexto("");
  };

  return (
    <dialog
      ref={dialogo}
      className="pv-ventana pv-chat"
      aria-labelledby="pv-titulo-chat"
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === dialogo.current) cerrar();
      }}
    >
      <header className="pv-oscuro flex shrink-0 items-center justify-between gap-3 bg-[#1b2e26] py-3 pl-5 pr-3 text-white">
        <div className="min-w-0">
          <h2 id="pv-titulo-chat" className="text-[1.3rem]">
            Recepción
          </h2>
          <p className="truncate text-[0.82rem] text-white/70">{HOTEL}</p>
        </div>
        <button type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-white/10" aria-label="Cerrar el chat" onClick={cerrar}>
          <X size={22} aria-hidden />
        </button>
      </header>

      <div ref={lista} className="pv-cuerpo flex flex-col gap-3" role="log" aria-live="polite">
        <p className="pv-globo" data-de="posada">
          Bienvenido a {HOTEL}. ¿En qué le podemos ayudar?
        </p>
        {mensajes.map((m) => (
          <p key={m.id} className="pv-globo pv-num" data-de={m.de}>
            {m.texto}
          </p>
        ))}
        {escribiendo && <p className="pv-suave text-[0.85rem]">Recepción está escribiendo…</p>}
        {!mensajes.length && (
          <div className="mt-auto flex flex-wrap gap-2">
            {SUGERENCIAS.map((s) => (
              <button key={s} type="button" className="pv-filtro" onClick={() => alEnviar(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form className="pv-chat-pie" onSubmit={enviar}>
        <input className="pv-campo" value={texto} onChange={(e) => setTexto(e.target.value)} aria-label="Escriba su mensaje" placeholder="Escriba su mensaje" autoComplete="off" enterKeyHint="send" />
        <button type="submit" className="pv-btn pv-accion !px-4" aria-label="Enviar mensaje" disabled={!texto.trim()}>
          <Send size={19} aria-hidden />
        </button>
      </form>
    </dialog>
  );
}

/* en celular se quita mientras la barra de fechas está en pantalla, para no taparla */
export function BotonChat({ visible, alAbrir }: { visible: boolean; alAbrir: () => void }) {
  const [sobreBarra, setSobreBarra] = useState(true);
  useEffect(() => {
    const barra = document.getElementById("disponibilidad");
    if (!barra) return;
    const ojo = new IntersectionObserver(([e]) => setSobreBarra(e.isIntersecting));
    ojo.observe(barra);
    return () => ojo.disconnect();
  }, []);
  if (!visible) return null;
  return (
    <button type="button" className="pv-boton-chat pv-btn" data-sobre-barra={sobreBarra} aria-haspopup="dialog" onClick={alAbrir}>
      <MessageCircle size={20} aria-hidden /> Chat
    </button>
  );
}
