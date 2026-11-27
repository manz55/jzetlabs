/* Rastreador: aprobación del presupuesto, checklist de recepción y línea de tiempo que se llena. */
import { useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { animate, stagger } from "animejs";
import { Check, CircleCheck, FileText, MessageCircle, Package, Search, ShieldCheck, ThumbsUp, TriangleAlert } from "lucide-react";
import { sinMovimiento } from "./animar";
import { Comprobante } from "./Comprobante";
import {
  PASOS, enlaceWhatsApp, etiquetaPaso, falla, fechaCorta, garantiaDe, insignias, mensajeAprobacion, mensajeCita, nombreCalidad, nombreRepuesto, qz, textoCita, totalTaller,
  type Nexus, type Reparacion,
} from "./datos";

const iniciales = (nombre: string) => nombre.split(" ").map((p) => p[0]).slice(0, 2).join("");

/*
 * Llena la línea de avance de arriba hacia abajo y hace latir el paso en curso. Al abrir una
 * orden se llena completa; si solo avanza, se anima el tramo nuevo.
 */
function useAvance(ref: React.RefObject<HTMLOListElement | null>, estado: number) {
  const antes = useRef<number | null>(null);
  useLayoutEffect(() => {
    const lista = ref.current;
    if (!lista) return;
    const desde = antes.current !== null && estado > antes.current ? Math.max(antes.current, 1) : 1;
    antes.current = estado;
    if (sinMovimiento()) return;
    const tramos = [...lista.querySelectorAll<HTMLElement>("[data-tramo]")].filter((t) => t.dataset.lleno === "true" && Number(t.dataset.tramo) >= desde);
    const activo = lista.querySelector<HTMLElement>('[data-estado="actual"] .nx-paso-texto');
    const espera = tramos.length * 220;
    const llenado = tramos.length ? animate(tramos, { scaleY: [0, 1], delay: stagger(220), duration: 380, ease: "inOutQuad" }) : null;
    const latido = activo ? animate(activo, { scale: [1, 1.025, 1], delay: espera + 120, duration: 620, loop: 1, ease: "inOutSine" }) : null;
    const seguro = window.setTimeout(() => {
      llenado?.complete();
      latido?.complete();
    }, espera + 2200);
    return () => {
      window.clearTimeout(seguro);
      llenado?.revert();
      latido?.revert();
    };
  }, [ref, estado]);
}

function Aprobacion({ n, r }: { n: Nexus; r: Reparacion }) {
  return (
    <div className="nx-aprobar nx-oscuro">
      <p>
        <TriangleAlert size={18} aria-hidden /> Tu aprobación está pendiente
      </p>
      <small>
        {falla(r.falla).nombre}
        {r.falla === "humedad" ? "" : ` con repuesto ${nombreCalidad(r.calidad, r.falla)}`} · {garantiaDe(r.falla, r.calidad)}. No cambiamos ninguna pieza sin tu autorización.
      </small>
      <button type="button" className="nx-btn nx-azul nx-lleno" onClick={() => n.aprobar(r.id)}>
        <ThumbsUp size={18} aria-hidden /> Aprobar presupuesto ({qz(totalTaller(r))}) y autorizar reparación
      </button>
    </div>
  );
}

function Avance({ n, r }: { n: Nexus; r: Reparacion }) {
  const lista = useRef<HTMLOListElement>(null);
  const [comprobante, setComprobante] = useState(false);
  useAvance(lista, r.estado);
  const revision = insignias(r);

  return (
    <div className="nx-avance">
      <div className="nx-avance-cabeza">
        <div>
          <p className="nx-suave">Orden {r.id}</p>
          <h3>{r.modelo}</h3>
          <p>
            {falla(r.falla).nombre} · a nombre de {r.cliente.split(" ")[0]}
          </p>
        </div>
        <span className="nx-estado" data-tono={r.estado >= 4 ? "lleno" : "azul"}>
          {etiquetaPaso(r.estado)}
        </span>
      </div>

      {r.estado === 2 && !r.aprobado && <Aprobacion n={n} r={r} />}
      {r.aprobado && r.estado >= 3 && (
        <div className="nx-aprobado" role="status">
          <CircleCheck size={18} aria-hidden />
          <span>Presupuesto aprobado el {fechaCorta(r.aprobado)}</span>
          {r.estado === 3 && (
            <a href={enlaceWhatsApp(mensajeAprobacion(r))} target="_blank" rel="noopener noreferrer">
              Avisar por WhatsApp
            </a>
          )}
        </div>
      )}
      {r.estado === 0 && r.cita && (
        <div className="nx-agendada" role="status">
          <p>
            <b>Ingreso agendado: guarda tu número {r.id}.</b> {r.recoleccion ? "El mensajero pasa" : "Te esperamos"} el {textoCita(r.cita)}.
          </p>
          <a className="nx-btn nx-azul nx-lleno" href={enlaceWhatsApp(mensajeCita(r))} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} aria-hidden /> Enviar mi cita por WhatsApp
          </a>
        </div>
      )}

      <p className="nx-tecnico">
        <i aria-hidden>{iniciales(r.tecnico)}</i>
        <span>
          <small>Técnico asignado</small>
          <b>{r.tecnico}</b>
        </span>
      </p>
      {r.estado >= 1 && r.estado <= 3 && (
        <p className="nx-repuesto" data-repuesto={r.repuesto}>
          <Package size={17} aria-hidden /> Repuesto: {nombreRepuesto(r.repuesto)}
        </p>
      )}

      <div className="nx-recepcion">
        <p>
          <ShieldCheck size={17} aria-hidden /> Checklist de recepción física
        </p>
        {revision.length ? (
          <ul>
            {revision.map((x) => (
              <li key={x.nombre} data-bien={x.bien}>
                {x.nombre}: <b>{x.valor}</b>
              </li>
            ))}
          </ul>
        ) : (
          <small>Se llena contigo presente al recibir el equipo.</small>
        )}
      </div>

      <ol className="nx-pasos" ref={lista} aria-label="Avance de la reparación">
        {PASOS.map(({ nombre }, i) => {
          const paso = (i + 1) as 1 | 2 | 3 | 4;
          const estado = r.estado > paso ? "hecho" : r.estado === paso ? "actual" : "pendiente";
          return (
            <li key={nombre} data-estado={estado} aria-current={estado === "actual" ? "step" : undefined}>
              {paso < 4 && (
                <span className="nx-tramo" aria-hidden>
                  <span data-tramo={paso} data-lleno={r.estado > paso} />
                </span>
              )}
              <span className="nx-paso-marca">{estado === "hecho" ? <Check size={16} aria-hidden /> : paso}</span>
              <div className="nx-paso-texto">
                <b>{nombre}</b>
                <small>
                  {estado === "actual" ? "En curso" : estado === "hecho" ? "Completado" : "Pendiente"}
                  {r.historial[paso] ? ` · ${fechaCorta(r.historial[paso]!)}` : ""}
                </small>
                {paso === 2 && estado !== "pendiente" && (
                  <p className="nx-notas">
                    <span>Notas de diagnóstico</span>
                    {r.notas}
                  </p>
                )}
                {paso === 3 && <p>{falla(r.falla).pieza}</p>}
                {paso === 4 && <p>{r.estado === 5 && r.historial[5] ? `Equipo entregado el ${fechaCorta(r.historial[5])}.` : "Probamos táctil, cámaras, audio, carga y señal antes de entregarte el equipo."}</p>}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="nx-avance-pie">
        <p>
          <span>Total de la orden</span>
          <strong>{qz(totalTaller(r))}</strong>
        </p>
        <button type="button" className="nx-btn nx-negro nx-lleno" onClick={() => setComprobante(true)}>
          <FileText size={18} aria-hidden /> Ver comprobante y póliza de garantía
        </button>
        <a className="nx-btn nx-contorno nx-lleno" href={enlaceWhatsApp(`Hola, Nexus Mobile. Quiero consultar mi orden ${r.id} (${r.modelo}).`)} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={18} aria-hidden /> Consultar por WhatsApp
        </a>
      </div>
      <Comprobante r={r} abierto={comprobante} alCerrar={() => setComprobante(false)} />
    </div>
  );
}

export function Rastreador({ n, codigo, alCambiar }: { n: Nexus; codigo: string; alCambiar: (c: string) => void }) {
  const [texto, setTexto] = useState(codigo);
  /* cada búsqueda vuelve a mostrar el avance, aunque sea la misma orden */
  const [vez, setVez] = useState(0);
  /* si la orden llega desde otro lado (cotizador o panel), el campo se pone al día */
  const [visto, setVisto] = useState(codigo);
  if (visto !== codigo) {
    setVisto(codigo);
    setTexto(codigo);
  }
  const orden = n.reparaciones.find((r) => r.id === codigo);
  const recientes = [...new Set(["ORD-408", "ORD-412", ...n.reparaciones.slice(0, 1).map((r) => r.id)])];
  const abrir = (c: string) => {
    alCambiar(c);
    setTexto(c);
    setVez((v) => v + 1);
  };

  function buscar(e: FormEvent) {
    e.preventDefault();
    const limpio = texto.trim().toUpperCase();
    /* acepta "408", "ord408" y "ORD-408" */
    const numero = limpio.match(/^(?:ORD)?[-\s]*(\d+)$/)?.[1];
    abrir(numero ? `ORD-${numero}` : limpio);
  }

  return (
    <section className="nx-caja" id="nx-rastreo" aria-labelledby="nx-rastreo-titulo">
      <h2 id="nx-rastreo-titulo">Rastrea tu equipo</h2>
      <p className="nx-suave">Escribe el número que aparece en tu comprobante de ingreso.</p>
      <form className="nx-buscar" onSubmit={buscar}>
        <label htmlFor="nx-codigo" className="nx-oculto">
          Número de orden
        </label>
        <input id="nx-codigo" className="nx-campo" value={texto} placeholder="ORD-408" autoComplete="off" autoCapitalize="characters" maxLength={20} onChange={(e) => setTexto(e.target.value)} />
        <button type="submit" className="nx-btn nx-negro">
          <Search size={18} aria-hidden /> Buscar
        </button>
      </form>
      <div className="nx-recientes">
        <span>Recientes:</span>
        {recientes.map((c) => (
          <button key={c} type="button" aria-pressed={codigo === c} onClick={() => abrir(c)}>
            {c}
          </button>
        ))}
      </div>
      {orden ? (
        <Avance key={`${orden.id}-${vez}`} n={n} r={orden} />
      ) : (
        <p className="nx-vacio" role="status">
          {codigo ? (
            <>
              No encontramos la orden <b>{codigo}</b>. Revisa el número o escríbenos por WhatsApp.
            </>
          ) : (
            "Aquí verás en qué paso va tu equipo."
          )}
        </p>
      )}
    </section>
  );
}
