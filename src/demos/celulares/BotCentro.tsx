/*
 * El bot dentro del panel: el centro de control (estado, reglas, números autorizados y registro de todo lo que hace),
 * la franja que aparece arriba de cada sección y el chat flotante que se abre desde cualquier pantalla.
 */
import { useEffect, useState } from "react";
import { MessageCircle, Store, X } from "lucide-react";
import { Asistente, resumenDe, simularCompra } from "./Asistente";
import { REGLAS, getFocoPanel, pedirComando, personaActual, ponerAutorizado, ponerRegla, pedirResumen, publicarResumen, setDock, useAutorizados, useDock, useEnLinea, useNoLeidos, usePeticion, useRegistro, useReglas, type Area, type Origen } from "./bot";
import { BORDE, BTN, Cifras, MUTED, Panel, TD, TH, Titulo, borde, principal } from "./ui";
import type { Tienda } from "./datos";

const VERDE = "#128c7e";
const COLOR_ORIGEN: Record<Origen, [string, string]> = { "Bot automático": ["#0f6e6a", "#dcf3f1"], "Dueño por WhatsApp": ["#1f7a3a", "#e1f5e6"], "Equipo por WhatsApp": ["#8a4b00", "#fff1d6"], "Cliente por WhatsApp": ["#5a3fc0", "#ece6ff"], Panel: ["#4b5563", "#eceef1"], "Cliente en la tienda": ["#5a3fc0", "#ece6ff"] };
const hoyIso = () => new Date().toDateString();
const hora = (iso: string) => new Date(iso).toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false });

export function Interruptor({ activo, alCambiar, etiqueta }: { activo: boolean; alCambiar: () => void; etiqueta: string }) {
  return (
    <button type="button" role="switch" aria-checked={activo} aria-label={etiqueta} onClick={alCambiar} className="relative h-7 w-12 shrink-0 rounded-full transition" style={{ background: activo ? VERDE : "#c4c8d0" }}>
      <span className="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all" style={{ left: activo ? "1.5rem" : "0.25rem" }} />
    </button>
  );
}
const Origen = ({ o }: { o: Origen }) => <span className="inline-block whitespace-nowrap rounded-[3px] px-2 py-0.5 text-[0.76rem] font-bold" style={{ background: COLOR_ORIGEN[o][1], color: COLOR_ORIGEN[o][0] }}>{o}</span>;

/* el dueño le pide cosas al bot desde el panel: se ejecutan igual que si las escribiera por WhatsApp */
const SUGERENCIAS: Record<Area, string[]> = {
  General: ["ventas", "pedidos", "devoluciones"],
  Ventas: ["pedidos", "ventas", "pagos"],
  Tienda: ["subir", "agregar 5 funda magsafe", "quitar 1 galaxy s26", "stock bajo"],
  Taller: ["reparaciones", "rep RP-512 listo"],
  Postventa: ["devoluciones"],
};
function PedirAlBot({ area }: { area: Area }) {
  const [texto, setTexto] = useState("");
  const enviar = (t: string) => { if (t.trim()) { pedirComando(t.trim()); setTexto(""); } };
  return (
    <div className="border-t px-4 py-2.5" style={{ borderColor: BORDE }}>
      <form onSubmit={(e) => { e.preventDefault(); enviar(texto); }} className="flex flex-wrap items-center gap-2">
        <label className="flex min-w-[14rem] flex-1 items-center gap-2"><span className="whitespace-nowrap text-[0.9rem] font-semibold">Pedir al bot:</span><input aria-label="Pedir al bot" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={area === "Tienda" ? "Ej: agregar 5 funda magsafe" : "Escriba lo que necesita"} className="min-h-[2.6rem] w-full rounded-[5px] border bg-white px-3 text-[0.92rem]" style={{ borderColor: BORDE }} /></label>
        <button type="submit" disabled={!texto.trim()} className={`${BTN} disabled:opacity-40`} style={principal}>Enviar</button>
        {SUGERENCIAS[area].map((s) => <button key={s} type="button" onClick={() => enviar(s)} className="rounded-full border px-3 py-1.5 text-[0.82rem] font-semibold transition hover:bg-[#f3f4f6]" style={{ borderColor: BORDE }}>{s}</button>)}
      </form>
    </div>
  );
}

/* franja del bot que va arriba de cada sección: qué hizo hoy y qué reglas aplica ahí */
export function FranjaBot({ area }: { area: Area }) {
  const registro = useRegistro().filter((r) => (area === "General" || r.area === area) && new Date(r.f).toDateString() === hoyIso());
  const reglas = useReglas();
  const lista = REGLAS.filter((r) => r.area === area);
  const por = (o: Origen) => registro.filter((r) => r.origen === o).length;
  const ultimo = registro[0];
  const enLinea = useEnLinea();
  return (
    <section className="rounded-md border bg-white" style={{ borderColor: BORDE, borderLeft: `4px solid ${VERDE}` }}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <p className="flex items-center gap-2 font-bold"><span className="grid h-7 w-7 place-items-center rounded-full text-white" style={{ background: VERDE }}><MessageCircle size={15} /></span> Bot de WhatsApp · {area}</p>
        <p className="text-[0.9rem]" style={{ color: MUTED }}>Hoy: <b className="text-[#14101f]">{por("Bot automático")}</b> acciones del bot · <b className="text-[#14101f]">{por("Dueño por WhatsApp")}</b> pedidas por WhatsApp · <b className="text-[#14101f]">{por("Cliente en la tienda")}</b> eventos de clientes{area === "Tienda" && <> · <b className="text-[#14101f]">{enLinea}</b> en la tienda ahora</>}</p>
        <button type="button" onClick={pedirResumen} className={`${BTN} ml-auto max-sm:hidden`} style={principal}><MessageCircle size={15} /> Abrir chat</button>
      </div>
      <PedirAlBot area={area} />
      <div className="hidden gap-x-6 gap-y-2 border-t px-4 py-2.5 md:grid md:grid-cols-2" style={{ borderColor: BORDE }}>
        {lista.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-3">
            <span className="text-[0.9rem]">{r.t}</span>
            <Interruptor activo={reglas[r.id]} alCambiar={() => ponerRegla(r.id, !reglas[r.id])} etiqueta={r.t} />
          </div>
        ))}
        {ultimo && <p className="text-[0.84rem] md:col-span-2" style={{ color: MUTED }}>Último movimiento: <b className="text-[#14101f]">{hora(ultimo.f)}</b> · {ultimo.origen} · {ultimo.texto}</p>}
      </div>
    </section>
  );
}

/* chat flotante: se abre desde cualquier sección */
export function DockBot({ t }: { t: Tienda }) {
  const abierto = useDock();
  const noLeidos = useNoLeidos();
  const peticion = usePeticion();
  /* al abrir el chat desde una sección, el bot arranca hablando de esa sección */
  useEffect(() => {
    if (!peticion) return;
    const p = personaActual();
    if (p.rol !== "DUENO" && p.rol !== "ENCARGADO") return;
    const foco = getFocoPanel();
    const ms = resumenDe(t, foco);
    publicarResumen(foco + ms.map((m) => m.texto).join("|"), ms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peticion]);
  return (
    <>
      {!abierto && (
        <button type="button" onClick={pedirResumen} aria-label="Abrir el chat del bot" className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full text-white shadow-lg transition hover:scale-105 active:scale-95" style={{ background: VERDE }}>
          <MessageCircle size={26} />
          {noLeidos > 0 && <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-[#d7263d] px-1 text-[0.78rem] font-bold">{noLeidos}</span>}
        </button>
      )}
      {abierto && (
        <aside role="dialog" aria-label="Chat del bot" className="fixed inset-y-0 right-0 z-50 flex w-[min(100%,28rem)] flex-col bg-white shadow-2xl">
          <div className="flex items-center justify-between px-4 py-1.5 text-white" style={{ background: "#054d44" }}>
            <p className="text-[0.92rem] font-semibold">Chat con el bot</p>
            <button type="button" aria-label="Cerrar el chat" onClick={() => setDock(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/15"><X size={20} /></button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col"><Asistente t={t} raiz="min-h-0 flex-1" alto="min-h-0 flex-1" /></div>
        </aside>
      )}
    </>
  );
}


export function PaginaBot({ t, alTienda }: { t: Tienda; alTienda: () => void }) {
  const registro = useRegistro();
  const reglas = useReglas();
  const autorizados = useAutorizados();
  const [msg, setMsg] = useState("");
  const hoy = registro.filter((r) => new Date(r.f).toDateString() === hoyIso());
  const n = (o: Origen) => hoy.filter((r) => r.origen === o).length;
  const avisosCliente = hoy.filter((r) => r.texto.startsWith("Aviso al cliente")).length;
  const acciones = n("Bot automático") + n("Dueño por WhatsApp");
  const areas: Area[] = ["Ventas", "Tienda", "Taller", "Postventa", "General"];
  return (
    <>
      <Titulo sub="Número de empresa conectado. El bot atiende al dueño y a su equipo, aplica las reglas y deja todo registrado.">Bot de WhatsApp</Titulo>
      <Cifras items={[
        { t: "Estado", v: "Conectado", n: "+502 5555 0100 · cuenta de empresa" },
        { t: "Pedidas por WhatsApp hoy", v: n("Dueño por WhatsApp"), n: "acciones del dueño y su equipo" },
        { t: "Acciones del bot hoy", v: n("Bot automático"), n: "avisos y tareas automáticas" },
        { t: "Avisos a clientes", v: avisosCliente, n: "por cambio de estado" },
        { t: "Tiempo ahorrado hoy", v: `${acciones * 2} min`, n: "estimado, 2 min por acción" },
      ]} />
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3">
          <Asistente t={t} />
          <Panel titulo="Modo demostración" nota="Solo para mostrar el recorrido" derecha={<span className="rounded-[3px] bg-[#fff1d6] px-2 py-0.5 text-[0.75rem] font-bold text-[#8a4b00]">Demo</span>}>
            <ol className="list-decimal space-y-1 pl-5 text-[0.92rem]" style={{ color: MUTED }}>
              <li>En el chat, <b className="text-[#14101f]">Adjuntar 3 fotos de ejemplo</b> y luego <b className="text-[#14101f]">Publicar en la tienda</b>.</li>
              <li><b className="text-[#14101f]">Simular compra</b>: el bot avisa y el dueño marca el avance.</li>
              <li>También se puede comprar de verdad en la tienda: el bot avisa igual.</li>
            </ol>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => setMsg(`Compra simulada de ${simularCompra(t)}.`)} className={BTN} style={principal}>Simular compra de un cliente</button>
              <button type="button" onClick={alTienda} className={BTN} style={borde}><Store size={15} /> Abrir la tienda</button>
            </div>
            {msg && <p className="mt-2 text-[0.88rem] font-semibold text-[#1f7a3a]">{msg}</p>}
          </Panel>
        </div>

        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
          <Panel titulo="Reglas del bot" nota={`${REGLAS.filter((r) => reglas[r.id]).length} de ${REGLAS.length} activas`} flush>
            <table className="w-full min-w-[34rem] text-[0.92rem]">
              <thead><tr><th className={TH}>Sección</th><th className={TH}>Regla</th><th className={`${TH} text-right`}>Activa</th></tr></thead>
              <tbody>
                {areas.flatMap((a) => REGLAS.filter((r) => r.area === a)).map((r) => (
                  <tr key={r.id} className="border-t" style={{ borderColor: BORDE }}>
                    <td className={`${TD} font-semibold`}>{r.area}</td>
                    <td className={TD}>{r.t}<span className="block text-[0.82rem]" style={{ color: MUTED }}>{r.d}</span></td>
                    <td className={`${TD} text-right`}><Interruptor activo={reglas[r.id]} alCambiar={() => ponerRegla(r.id, !reglas[r.id])} etiqueta={r.t} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
          <Panel titulo="Números autorizados" nota="El bot solo responde a estos números" flush>
            <table className="w-full min-w-[34rem] text-[0.92rem]">
              <thead><tr><th className={TH}>Persona</th><th className={TH}>Número</th><th className={TH}>Puede pedir</th><th className={`${TH} text-right`}>Activo</th></tr></thead>
              <tbody>{autorizados.map((a) => (
                <tr key={a.id} className="border-t" style={{ borderColor: BORDE, opacity: a.activo ? 1 : 0.55 }}>
                  <td className={`${TD} font-semibold`}>{a.nombre}<span className="block text-[0.8rem] font-normal" style={{ color: MUTED }}>{a.etiqueta}</span></td>
                  <td className={`${TD} tabular-nums`}>{a.numero}</td>
                  <td className={TD} style={{ color: MUTED }}>{a.permisos}</td>
                  <td className={`${TD} text-right`}><Interruptor activo={a.activo} alCambiar={() => ponerAutorizado(a.id, !a.activo)} etiqueta={`Autorizar a ${a.nombre}`} /></td>
                </tr>
              ))}</tbody>
            </table>
          </Panel>
          <Panel titulo="Registro de actividad" nota="Todo lo que hizo el bot, el dueño y los clientes" flush>
            <table className="w-full min-w-[40rem] text-[0.92rem]">
              <thead><tr><th className={TH}>Hora</th><th className={TH}>Sección</th><th className={TH}>Origen</th><th className={TH}>Acción</th></tr></thead>
              <tbody>{registro.slice(0, 14).map((r) => (
                <tr key={r.id} className="border-t" style={{ borderColor: BORDE }}>
                  <td className={`${TD} whitespace-nowrap tabular-nums`} style={{ color: MUTED }}>{hora(r.f)}</td>
                  <td className={`${TD} font-semibold`}>{r.area}</td>
                  <td className={TD}><Origen o={r.origen} /></td>
                  <td className={TD}>{r.texto}</td>
                </tr>
              ))}</tbody>
            </table>
          </Panel>
        </div>
      </div>
    </>
  );
}

