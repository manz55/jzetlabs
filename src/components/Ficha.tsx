/*
 * Ficha de un trabajo: baja como pantalla de proyector. Trae un deslizador
 * de antes/después y una lupa de "rayos X" que enseña cómo funciona por dentro.
 */
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, X } from "lucide-react";
import { PROJECTS, type Project } from "@/data/projects";
import { laTienda, whatsappLink } from "@/data/site";
import { anime } from "@/lib/anime";
import { Antes } from "./Antes";
import { PanelPrueba } from "./PanelPrueba";

/* ── deslizador antes / después ── */
function AntesDespues({ p }: { p: Project }) {
  const caja = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const arrastrando = useRef(false);

  useEffect(() => {
    const a = anime();
    if (!a) return;
    // se asoma solo para que se note que se puede arrastrar
    const estado = { v: 88 };
    setPos(88);
    const an = a.animate(estado, { v: 50, delay: 650, duration: 1200, ease: "outElastic(1, .6)", onUpdate: () => setPos(estado.v) });
    return () => {
      an.pause();
    };
  }, [p.id]);

  const mover = (clientX: number) => {
    const r = caja.current?.getBoundingClientRect();
    if (r) setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div>
      <div
        ref={caja}
        className="relative aspect-[16/10] overflow-hidden rounded-xl border-2 border-ink bg-paper select-none touch-pan-y cursor-ew-resize"
        onPointerDown={(e) => {
          arrastrando.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          mover(e.clientX);
        }}
        onPointerMove={(e) => arrastrando.current && mover(e.clientX)}
        onPointerUp={() => (arrastrando.current = false)}
        onPointerCancel={() => (arrastrando.current = false)}
        role="slider"
        aria-label="Comparar antes y después"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((v) => Math.max(0, v - 5));
          if (e.key === "ArrowRight") setPos((v) => Math.min(100, v + 5));
        }}
      >
        {p.panel ? <PanelPrueba id={p.id} /> : <img src={p.desk} alt={`${p.name} hoy`} draggable={false} className="absolute inset-0 w-full h-full object-cover object-top" />}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Antes id={p.id} />
        </div>
        <span className="absolute left-2 top-2 hand text-[0.95rem] sm:text-[1.15rem] bg-card/90 border border-ink/30 rounded px-2">antes</span>
        <span className="absolute right-2 top-2 hand text-[0.95rem] sm:text-[1.15rem] bg-volt border border-ink rounded px-2">{p.panel ? "ahora · su panel" : "ahora"}</span>
        <div className="absolute top-0 bottom-0 w-[3px] bg-ink -translate-x-1/2 pointer-events-none" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-volt border-2 border-ink shadow-[2px_2px_0_var(--color-ink)] text-ink font-bold">
            ⇆
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-ink-2">
        <b>Antes:</b> {p.antes.toLowerCase()}.{p.panel && " Ahora: su panel de admin, con datos de prueba."} <span className="hand text-[1.1rem] text-cobalt">arrastra la barra ⇆</span>
      </p>
    </div>
  );
}

/* ── lupa de rayos X ── */
function RayosX({ p }: { p: Project }) {
  const caja = useRef<HTMLDivElement>(null);
  const [lupa, setLupa] = useState({ x: p.rayos[0]?.x ?? 50, y: p.rayos[0]?.y ?? 50 });
  const arrastrando = useRef(false);

  const cercano = p.rayos.reduce((mejor, pt, i) => {
    const d = Math.hypot(pt.x - lupa.x, pt.y - lupa.y);
    return d < mejor.d ? { i, d } : mejor;
  }, { i: 0, d: Infinity });
  const activo = p.rayos[cercano.i];

  useEffect(() => {
    const a = anime();
    if (!a || p.rayos.length < 2) return;
    // recorre los puntos para enseñar que la lupa se mueve
    const estado = { x: p.rayos[0].x, y: p.rayos[0].y };
    const tl = a.createTimeline({ delay: 500, onUpdate: () => setLupa({ x: estado.x, y: estado.y }) });
    p.rayos.slice(1).forEach((pt) => tl.add(estado, { x: pt.x, y: pt.y, duration: 900, ease: "inOutQuad" }, "+=500"));
    const cancelar = () => tl.pause();
    caja.current?.addEventListener("pointerdown", cancelar, { once: true });
    return () => {
      tl.pause();
    };
  }, [p]);

  const mover = (cx: number, cy: number) => {
    const r = caja.current?.getBoundingClientRect();
    if (!r) return;
    setLupa({ x: Math.min(100, Math.max(0, ((cx - r.left) / r.width) * 100)), y: Math.min(100, Math.max(0, ((cy - r.top) / r.height) * 100)) });
  };

  return (
    <div>
      <div
        ref={caja}
        className="relative aspect-[16/10] overflow-hidden rounded-xl border-2 border-ink bg-paper select-none touch-none cursor-none"
        onPointerDown={(e) => {
          arrastrando.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          mover(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => (arrastrando.current || e.pointerType === "mouse") && mover(e.clientX, e.clientY)}
        onPointerUp={() => (arrastrando.current = false)}
        onPointerCancel={() => (arrastrando.current = false)}
      >
        <img src={p.desk} alt={`Captura de ${p.name}`} draggable={false} className="absolute inset-0 w-full h-full object-cover object-top" />
        {/* lo de adentro: plano azul con las piezas */}
        <div className="absolute inset-0 bg-blueprint" style={{ clipPath: `circle(21.5% at ${lupa.x}% ${lupa.y}%)` }} aria-hidden>
          <img src={p.desk} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover object-top mix-blend-screen opacity-60" style={{ filter: "grayscale(1) invert(1) contrast(1.4)" }} />
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.14) 1px,transparent 1px)", backgroundSize: "18px 18px" }} />
          {p.rayos.map((pt) => (
            <span key={pt.titulo} className="absolute -translate-x-1/2 -translate-y-1/2 hand text-white text-[clamp(0.95rem,2.6vw,1.35rem)] whitespace-nowrap px-2 py-0.5 border-2 border-dashed border-white/80 rounded bg-blueprint/70" style={{ left: `${pt.x}%`, top: `${pt.y}%` }}>
              {pt.titulo}
            </span>
          ))}
        </div>
        {/* aro de la lupa */}
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-ink shadow-[0_0_0_3px_var(--color-volt),4px_6px_0_rgba(23,22,28,.35)] pointer-events-none"
          style={{ left: `${lupa.x}%`, top: `${lupa.y}%`, width: "36%", aspectRatio: "1" }}
          aria-hidden
        >
          <span className="absolute right-[-22%] bottom-[-22%] w-[38%] h-[12%] bg-ink rounded-full rotate-45 origin-left" />
        </span>
        {/* pines para invitar a explorar */}
        {p.rayos.map((pt, i) => (
          <span key={i} className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center w-6 h-6 rounded-full bg-volt border-2 border-ink text-[0.7rem] font-bold pointer-events-none" style={{ left: `${pt.x}%`, top: `${pt.y}%` }}>
            {i + 1}
          </span>
        ))}
      </div>
      {activo && (
        <p className="mt-2 text-sm text-ink-2 min-h-[2.6em]">
          <b className="text-ink">
            {cercano.i + 1}. {activo.titulo}:
          </b>{" "}
          {activo.texto} <span className="hand text-[1.1rem] text-cobalt">pasa la lupa 🔍</span>
        </p>
      )}
    </div>
  );
}

export function Ficha({ projectId, onClose, onChange }: { projectId: string | null; onClose: () => void; onChange: (id: string) => void }) {
  const lista = PROJECTS;
  const index = lista.findIndex((p) => p.id === projectId);
  const p = index >= 0 ? lista[index] : null;
  const [vista, setVista] = useState<"antes" | "rayos">("antes");
  const panel = useRef<HTMLDivElement>(null);
  const cerrarBtn = useRef<HTMLButtonElement>(null);

  const go = (dir: 1 | -1) => onChange(lista[(index + dir + lista.length) % lista.length].id);

  useEffect(() => {
    if (!projectId) return;
    setVista("antes");
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cerrarBtn.current?.focus({ preventScroll: true });
    const a = anime();
    const an = a && panel.current ? a.animate(panel.current, { translateY: ["-110vh", "0vh"], ease: a.createSpring({ stiffness: 70, damping: 11 }) }) : null;
    return () => {
      document.body.style.overflow = prev;
      an?.revert();
    };
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && !(e.target instanceof HTMLElement && e.target.getAttribute("role") === "slider")) go(1);
      if (e.key === "ArrowLeft" && !(e.target instanceof HTMLElement && e.target.getAttribute("role") === "slider")) go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!p) return null;
  const tieneRayos = p.rayos.length > 0;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-3 sm:px-6 pt-5 sm:pt-10 pb-4" role="dialog" aria-modal="true" aria-label={p.name}>
      <div className="absolute inset-0 bg-ink/55" onClick={onClose} />
      <div ref={panel} className="relative w-full max-w-5xl">
        <span className="absolute left-[14%] -top-[100vh] h-[100vh] w-[3px] bg-paper/80" aria-hidden />
        <span className="absolute right-[14%] -top-[100vh] h-[100vh] w-[3px] bg-paper/80" aria-hidden />
        <div className="ink-card !rounded-[22px] !shadow-[8px_8px_0_var(--color-ink)] max-h-[calc(100dvh-2.5rem)] sm:max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain">
          <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b-2 border-ink" style={{ background: p.accent }}>
            <div className="min-w-0">
              <p className="font-display font-extrabold text-xl sm:text-2xl leading-tight truncate">{p.name}</p>
              <p className="text-sm text-ink/75 truncate">
                {p.kind} · {p.place} · {p.status}
              </p>
            </div>
            <button
              ref={cerrarBtn}
              onClick={onClose}
              className="shrink-0 flex items-center gap-1.5 font-display font-bold text-sm px-3 py-1.5 rounded-lg border-2 border-ink bg-card shadow-[2px_2px_0_var(--color-ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Soltar <X size={16} strokeWidth={2.6} />
            </button>
          </div>

          <div className="grid lg:grid-cols-[1.35fr_1fr] gap-7 p-4 sm:p-6">
            <div>
              {tieneRayos && (
                <div className="inline-flex p-1 rounded-xl border-2 border-ink bg-paper mb-3">
                  {(
                    [
                      ["antes", "Antes y ahora"],
                      ["rayos", "Rayos X"],
                    ] as const
                  ).map(([v, t]) => (
                    <button key={v} onClick={() => setVista(v)} aria-pressed={vista === v} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${vista === v ? "bg-ink text-paper" : "text-ink-2"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              )}
              {vista === "antes" || !tieneRayos ? <AntesDespues key={p.id} p={p} /> : <RayosX key={p.id} p={p} />}
            </div>

            <div className="flex flex-col">
              <dl className="space-y-4">
                {[
                  ["el problema", p.problem],
                  ["lo que hice", p.built],
                  ["cómo quedó", p.result],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="hand text-[1.5rem] leading-none text-tomato">{k}</dt>
                    <dd className="mt-1 text-ink-2 leading-relaxed">{v}</dd>
                  </div>
                ))}
              </dl>
              {p.note && <p className="mt-3 text-xs text-ink-3 italic">{p.note}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    Verla en vivo <ExternalLink size={16} />
                  </a>
                ) : (
                  <span className="text-sm text-ink-3 self-center">Es de uso privado, por eso no tiene link público.</span>
                )}
                <a href={whatsappLink(`¡Hola Josh! Vi ${p.name} y quiero algo parecido para mi negocio.`)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Quiero algo así
                </a>
              </div>
              <div className="mt-auto pt-6 flex items-center justify-between gap-3 border-t-2 border-dashed border-ink/20">
                <button onClick={() => go(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-ink-2 hover:text-ink pt-4">
                  <ArrowLeft size={16} /> {lista[(index - 1 + lista.length) % lista.length].name}
                </button>
                <a href={laTienda("trabajos")} target="_blank" rel="noopener noreferrer" className="hand text-[1.15rem] text-cobalt pt-4 hidden sm:block">
                  ver todo en La tienda →
                </a>
                <button onClick={() => go(1)} className="flex items-center gap-1.5 text-sm font-semibold text-ink-2 hover:text-ink pt-4">
                  {lista[(index + 1) % lista.length].name} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
