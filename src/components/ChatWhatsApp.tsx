/*
 * Ventanita de chat antes de abrir WhatsApp: Joshua "escribe", saluda y ofrece
 * opciones rápidas que arman el mensaje. El cliente lo edita y se abre WhatsApp
 * con el texto listo. Se abre desde cualquier botón con abrirChat().
 * Sin JavaScript, los botones siguen siendo links directos a WhatsApp.
 */
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/data/site";
import { LogoGato } from "./Logo";
import { Modal } from "./Modal";

const EVENTO = "jz-chat";

export function abrirChat(mensaje = "") {
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: mensaje }));
}

const OPCIONES = [
  { texto: "Una página web", mensaje: "Hola, Joshua. Me interesa una página web para mi negocio." },
  { texto: "Un sistema", mensaje: "Hola, Joshua. Quiero un sistema para mi negocio. Hoy hago a mano: " },
  { texto: "Una app", mensaje: "Hola, Joshua. Me interesa una app para mi negocio." },
  { texto: "Tengo una pregunta", mensaje: "Hola, Joshua. Tengo una pregunta: " },
];

export function ChatWhatsApp() {
  const [abierto, setAbierto] = useState(false);
  const [paso, setPaso] = useState(0); // 0 escribiendo, 1 saludo, 2 pregunta
  const [texto, setTexto] = useState("");
  const [error, setError] = useState("");
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const abrir = (e: Event) => {
      setTexto((e as CustomEvent<string>).detail || "");
      setError("");
      setPaso(0);
      setAbierto(true);
    };
    window.addEventListener(EVENTO, abrir);
    return () => window.removeEventListener(EVENTO, abrir);
  }, []);

  // Joshua "escribe" y luego aparecen los mensajes
  useEffect(() => {
    if (!abierto) return;
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (quieto) {
      setPaso(2);
      return;
    }
    const a = window.setTimeout(() => setPaso(1), 700);
    const b = window.setTimeout(() => setPaso(2), 1300);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [abierto]);

  function elegir(m: string) {
    setTexto(m);
    setError("");
    requestAnimationFrame(() => {
      const el = area.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(m.length, m.length);
    });
  }

  function enviar() {
    const t = texto.trim();
    if (!t) {
      setError("Escriba su mensaje primero.");
      area.current?.focus();
      return;
    }
    window.open(whatsappLink(t), "_blank", "noopener,noreferrer");
    setAbierto(false);
  }

  return (
    <Modal abierto={abierto} alCerrar={() => setAbierto(false)} titulo="Escribirle a Joshua por WhatsApp" ancho="sm:w-[min(26rem,92vw)]">
      <div className="flex items-center gap-3 px-5 pt-4 sm:pt-5 pb-4 pr-14 border-b border-linea">
        <span className="relative grid place-items-center w-11 h-11 rounded-full bg-mano">
          <LogoGato className="w-6 h-7 text-white [&_.fill-mano]:fill-white [&_.stroke-mano]:stroke-white" />
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#25d366] ring-2 ring-blanco" aria-hidden />
        </span>
        <div>
          <p className="font-semibold text-tinta leading-tight">Joshua · Jzet Labs</p>
          <p className="text-sm text-suave">Le responde Joshua directamente</p>
        </div>
      </div>

      <div className="chat-fondo px-5 py-5 space-y-2 min-h-[150px]" aria-live="polite">
        {paso === 0 && (
          <div className="burbuja inline-flex gap-1 items-center px-4 py-3" aria-label="Joshua está escribiendo">
            <span className="punto" />
            <span className="punto [animation-delay:.15s]" />
            <span className="punto [animation-delay:.3s]" />
          </div>
        )}
        {paso >= 1 && <p className="burbuja burbuja-entra">¡Hola! Qué gusto saludarle.</p>}
        {paso >= 2 && <p className="burbuja burbuja-entra">Cuénteme, ¿en qué le puedo ayudar?</p>}
        {paso >= 2 && (
          <div className="flex flex-wrap gap-2 pt-2 burbuja-entra">
            {OPCIONES.map((o) => (
              <button
                key={o.texto}
                type="button"
                onClick={() => elegir(o.mensaje)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition active:scale-95 ${
                  texto === o.mensaje ? "border-acento bg-acento text-white" : "border-acento/40 text-acento hover:bg-acento/10"
                }`}
              >
                {o.texto}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        className="px-5 pb-5"
        onSubmit={(e) => {
          e.preventDefault();
          enviar();
        }}
      >
        <label htmlFor="chat-texto" className="sr-only">
          Su mensaje
        </label>
        <div className="flex items-end gap-2">
          <textarea
            id="chat-texto"
            ref={area}
            rows={2}
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                enviar();
              }
            }}
            placeholder="Escriba su mensaje…"
            className="flex-1 resize-none rounded-2xl border border-linea bg-crema px-4 py-3 text-[0.97rem] text-tinta placeholder:text-suave focus:outline-none focus:border-acento"
          />
          <button
            type="submit"
            aria-label="Enviar por WhatsApp"
            className="grid place-items-center w-12 h-12 shrink-0 rounded-full bg-[#1f9d55] text-white hover:bg-[#178a49] active:scale-90 transition"
          >
            <Send size={19} />
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-[#c0362c]">{error}</p>}
        <p className="mt-3 text-xs text-suave">Se abre WhatsApp con su mensaje listo · {WHATSAPP_DISPLAY}</p>
      </form>
    </Modal>
  );
}
