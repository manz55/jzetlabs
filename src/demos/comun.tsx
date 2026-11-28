/*
 * Piezas que comparten las demos: la banda de arriba, el cierre de Jzet Labs,
 * la vista de "así le llega el mensaje" y el contador de cantidad.
 */
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { ArrowRight, LayoutGrid, Minus, Plus, X } from "lucide-react";
import { Modal } from "@/components/Modal";
import { whatsappLink } from "@/data/site";
import { irADemo, precargar } from "./navegar";

/* avisoSiempre: en celular la banda también dice "Demo de" (para las que parecen un negocio o medio real) */
export type DemoItem = { nombre: string; href: string; para: string; avisoSiempre?: boolean };

/* Todas las demos, en tres tipos de producto: página, tienda o sistema a medida. "para" es una línea: para qué negocio es */
export const GRUPOS_DEMOS: { grupo: string; demos: DemoItem[] }[] = [
  {
    grupo: "Landing pages",
    demos: [
      { nombre: "Fundadora", href: "/demos/fundadora/", para: "Marca personal de una emprendedora" },
      { nombre: "Cosméticos", href: "/demos/cosmeticos/", para: "Marca de maquillaje con cursos" },
      { nombre: "Restaurante", href: "/demos/restaurante/", para: "Menú en línea y pedidos" },
      { nombre: "Hotel boutique", href: "/demos/hotel/", para: "Disponibilidad, habitaciones y reserva con chat" },
      { nombre: "Taller mecánico", href: "/demos/taller-mecanico/", para: "Auxilio 24/7, ¿puedo manejar así?, seguimiento por placa y panel", avisoSiempre: true },
      { nombre: "Diario digital", href: "/demos/medio-comunicacion/", para: "Portada, última hora, secciones y boletín", avisoSiempre: true },
    ],
  },
  {
    grupo: "Tiendas en línea",
    demos: [
      { nombre: "Celulares", href: "/demos/celulares/", para: "Visacuotas, orden por WhatsApp y taller con rastreo" },
      { nombre: "Tienda de ropa", href: "/demos/ropa/", para: "Catálogo por tallas, outfit con descuento y panel de órdenes" },
      { nombre: "Boutique", href: "/demos/boutique/", para: "Piezas únicas, apartados y consignación" },
      { nombre: "Perfil de belleza", href: "/demos/perfil-belleza/", para: "Consultoras de catálogo: perfil de la clienta y pedidos" },
      { nombre: "Pastelería", href: "/demos/pasteleria/", para: "Pasteles por encargo con anticipo" },
      { nombre: "Ferretería", href: "/demos/ferreteria/", para: "Catálogo técnico, calculadora de obra y flete por zona" },
    ],
  },
  {
    grupo: "Sistemas a medida",
    demos: [
      { nombre: "Distribuidora", href: "/demos/distribuidora/", para: "Pedidos de tiendas, rutas y cobros" },
      { nombre: "Planilla y personal", href: "/demos/planilla/", para: "Constructora: panel de oficina y portal del empleado" },
      { nombre: "Gimnasio", href: "/demos/gimnasio/", para: "Planes, clases con cupo y membresías vencidas" },
      { nombre: "Tiempo compartido", href: "/demos/tiempo-compartido/", para: "Planes y semanas apartadas" },
      { nombre: "Clínica dental", href: "/demos/clinica/", para: "Citas, odontograma y saldos" },
      { nombre: "Pediatría", href: "/demos/pediatria/", para: "Vacunas por edad, crecimiento y citas" },
      { nombre: "Medicina general", href: "/demos/medicina/", para: "Control de presión y azúcar, recetas y chequeos" },
      { nombre: "Oftalmología", href: "/demos/oftalmologia/", para: "Turnos que se respetan, sucursales y sala de espera" },
      { nombre: "Veterinaria", href: "/demos/veterinaria/", para: "¿Es urgencia?, carné de vacunas e internados" },
      { nombre: "Salón", href: "/demos/salon/", para: "Salón con sucursales: citas por estilista" },
      { nombre: "Eventos", href: "/demos/eventos/", para: "Alquiler de mobiliario: fechas, paquetes y anticipos" },
    ],
  },
];
export const DEMOS = GRUPOS_DEMOS.flatMap((g) => g.demos);

export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;

/* Cambia de demo sin recargar (o abre normal con Ctrl/Cmd) */
function alTocarDemo(e: ReactMouseEvent<HTMLAnchorElement>, href: string, activa: boolean, cerrar: () => void) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  if (activa) {
    e.preventDefault();
    cerrar();
    return;
  }
  if (irADemo(href)) {
    e.preventDefault();
    cerrar();
  }
}

/* Banda de arriba: dice que es demo, cuál es, y abre un panel ordenado con las otras */
export function BandaDemos() {
  const aqui = location.pathname.endsWith("/") ? location.pathname : location.pathname + "/";
  const actual = DEMOS.find((d) => d.href === aqui);
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        boton.current?.focus();
      }
    };
    const fuera = (e: PointerEvent) => {
      if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false);
    };
    addEventListener("keydown", tecla);
    addEventListener("pointerdown", fuera);
    // precarga todas al abrir, para que el cambio sea inmediato
    DEMOS.forEach((d) => precargar(d.href));
    return () => {
      removeEventListener("keydown", tecla);
      removeEventListener("pointerdown", fuera);
    };
  }, [abierto]);
  return (
    <div ref={caja} className="banda-demos relative z-40 bg-[#1c1714] text-white/85 text-[0.82rem]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
        <a href="/" className="min-w-0 shrink truncate hover:text-white">
          ← <span className={actual?.avisoSiempre ? undefined : "hidden sm:inline"}>Demo de </span><b className="text-white">Jzet Labs</b>
          <span className="hidden sm:inline"> · datos de ejemplo</span>
        </a>
        <div className="flex shrink-0 items-center gap-2">
          {actual && <span className={`pastilla-demo-activa ${actual.avisoSiempre ? "hidden sm:inline-block" : "inline-block"} max-w-[7.5rem] truncate rounded-full bg-white/10 px-3 py-1 font-semibold text-white sm:max-w-none`}>{actual.nombre}</span>}
          <button
            ref={boton}
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="panel-demos"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 font-semibold text-[#1c1714] transition hover:bg-white/90 active:scale-95"
          >
            {abierto ? <X size={15} /> : <LayoutGrid size={15} />} {abierto ? "Cerrar" : <><span className="sm:hidden">Otras demos</span><span className="hidden sm:inline">Ver otras demos</span></>}
          </button>
        </div>
      </div>
      {abierto && (
        <div id="panel-demos" role="dialog" aria-label="Otras demos" className="panel-demos absolute inset-x-0 top-full max-h-[calc(100dvh-3rem)] overflow-y-auto border-t border-white/10 bg-[#1c1714] shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)]">
          <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-6 px-4 py-6 sm:grid-cols-2 lg:grid-cols-5">
            {GRUPOS_DEMOS.map((g) => (
              <div key={g.grupo}>
                <p className="text-[0.78rem] font-semibold text-white/50">{g.grupo}</p>
                <ul className="mt-2 grid gap-1">
                  {g.demos.map((d) => {
                    const activa = aqui === d.href;
                    return (
                      <li key={d.href}>
                        <a
                          href={d.href}
                          aria-current={activa ? "page" : undefined}
                          onMouseEnter={() => precargar(d.href)}
                          onFocus={() => precargar(d.href)}
                          onClick={(e) => alTocarDemo(e, d.href, activa, () => setAbierto(false))}
                          className={`block rounded-lg px-3 py-2 transition ${activa ? "bg-white text-[#1c1714]" : "hover:bg-white/10"}`}
                        >
                          <span className="block text-[0.95rem] font-semibold leading-tight">{d.nombre}</span>
                          <span className={`block text-[0.8rem] leading-snug ${activa ? "text-[#1c1714]/70" : "text-white/55"}`}>{d.para}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <p className="mx-auto max-w-7xl px-4 pb-5 text-[0.8rem] text-white/45">Todos los negocios y precios de las demos son de ejemplo.</p>
        </div>
      )}
    </div>
  );
}

/* Cierre: invita a pedir una página así */
export function CierreJzet({ demo }: { demo: string }) {
  return (
    <footer className="bg-[#1c1714] text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
        <div>
          <p className="text-white/60 text-sm">Esta es una demo de {demo} hecha por Jzet Labs. El negocio y los precios son de ejemplo.</p>
          <p className="mt-2 text-[1.8rem] sm:text-[2.3rem] font-bold leading-tight font-[family-name:var(--font-titulo)]">¿Quiere una página así para su negocio?</p>
        </div>
        <div className="flex flex-col sm:flex-row md:justify-end gap-3">
          <a href={whatsappLink(`Hola, Joshua. Vi la demo de ${demo} y quiero una página así para mi negocio.`)} target="_blank" rel="noopener noreferrer" className="btn btn-principal !rounded-full">
            Escribirle a Joshua
          </a>
          <a href="/web" className="btn !rounded-full border border-white/25 text-white hover:bg-white/10">
            Ver paquetes y precios
          </a>
        </div>
      </div>
    </footer>
  );
}

/* "Así le llega": muestra el mensaje como burbuja de WhatsApp, sin enviarlo */
export function MensajeWhatsApp({
  mensaje,
  alCerrar,
  demo,
  que = "el pedido",
  accion,
}: {
  mensaje: string | null;
  alCerrar: () => void;
  demo: string;
  que?: string;
  accion?: { texto: string; alTocar: () => void };
}) {
  return (
    <Modal abierto={mensaje !== null} alCerrar={alCerrar} titulo="Así le llega el mensaje" ancho="sm:w-[min(26rem,92vw)]">
      <div className="px-6 pt-6 pb-6 text-tinta">
        <p className="etiqueta">Así funciona</p>
        <h3 className="mt-2 text-[1.4rem] pr-8">En su negocio, {que} le llega directo a su WhatsApp:</h3>
        <div className="mt-4 rounded-2xl bg-[#e7ddd3] p-4">
          <p className="ml-auto w-fit max-w-[92%] whitespace-pre-line rounded-[1rem_1rem_0.3rem_1rem] bg-[#d9fdd3] px-3.5 py-2.5 text-[0.92rem] text-[#111b21] shadow-sm">{mensaje}</p>
        </div>
        {accion && (
          <button type="button" onClick={accion.alTocar} className="mt-4 btn btn-secundario !rounded-full w-full">
            {accion.texto} <ArrowRight size={18} />
          </button>
        )}
        <p className="mt-4 text-sm text-suave">Esto es una demo: no se envía nada. ¿Quiere una página así?</p>
        <a href={whatsappLink(`Hola, Joshua. Vi la demo de ${demo} y quiero una página así para mi negocio.`)} target="_blank" rel="noopener noreferrer" className="mt-4 btn btn-principal !rounded-full w-full">
          Quiero una así <ArrowRight size={18} />
        </a>
      </div>
    </Modal>
  );
}

export function Contador({ valor, alCambiar, claro = false }: { valor: number; alCambiar: (v: number) => void; claro?: boolean }) {
  const borde = claro ? "border-white/25" : "border-black/15";
  const hover = claro ? "hover:bg-white/10" : "hover:bg-black/5";
  return (
    <div className={`inline-flex items-center rounded-full border ${borde}`}>
      <button type="button" aria-label="Uno menos" onClick={() => alCambiar(valor - 1)} className={`grid place-items-center w-9 h-9 rounded-full ${hover} active:scale-90`}>
        <Minus size={14} />
      </button>
      <span className="w-6 text-center tabular-nums text-sm font-semibold">{valor}</span>
      <button type="button" aria-label="Uno más" onClick={() => alCambiar(valor + 1)} className={`grid place-items-center w-9 h-9 rounded-full ${hover} active:scale-90`}>
        <Plus size={14} />
      </button>
    </div>
  );
}

/* Bolsa lateral que sale desde la derecha */
export function Cajon({ abierto, alCerrar, children, fondo = "#fbf9f6" }: { abierto: boolean; alCerrar: () => void; children: ReactNode; fondo?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);
  return (
    <dialog
      ref={ref}
      aria-label="Su bolsa"
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar();
      }}
      className="cajon"
    >
      <div className="cajon-caja h-full shadow-[-20px_0_60px_-30px_rgba(0,0,0,.5)]" style={{ background: fondo }}>{children}</div>
    </dialog>
  );
}

/**
 * Barra para cambiar entre las partes de una demo (lo que ve el cliente, lo que ve el negocio...).
 * Cada botón dice qué es y quién lo usa, para que se entienda sin explicar nada.
 */
export function PartesDemo<T extends string>({
  partes,
  actual,
  alCambiar,
  fondo,
}: {
  partes: readonly { id: T; nombre: string; quien: string }[];
  actual: T;
  alCambiar: (id: T) => void;
  fondo: string;
}) {
  const numeros = ["", "", "dos", "tres", "cuatro"];
  return (
    <div className="partes-demo text-white print:hidden" style={{ background: fondo }}>
      <div className="mx-auto max-w-6xl px-4 py-3">
        <p className="text-[0.85rem] text-white/75">
          Esta demo tiene {numeros[partes.length] ?? partes.length} partes. Toque una para verla:
        </p>
        <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${partes.length}, minmax(0, 1fr))` }} role="group" aria-label="Partes de la demo">
          {partes.map((p) => {
            const activa = p.id === actual;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => alCambiar(p.id)}
                aria-pressed={activa}
                className={`rounded-xl border px-3 py-2 text-left transition active:scale-[0.98] ${activa ? "border-white bg-white" : "border-white/25 bg-white/5 hover:bg-white/15"}`}
                style={activa ? { color: fondo } : undefined}
              >
                <span className="block text-[0.92rem] font-bold leading-tight sm:text-[1rem]">{p.nombre}</span>
                <span className={`mt-0.5 block text-[0.75rem] leading-snug sm:text-[0.82rem] ${activa ? "opacity-75" : "text-white/70"}`}>{p.quien}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Para las demos que eran solo página: agrega la segunda parte (el panel del negocio).
 * La página va como "children" y el panel como "panel"; el enlace #panel abre directo el panel.
 */
export function PaginaYPanel({ fondo, pagina, panel: nombrePanel, panelEl, titulo, children }: { fondo: string; pagina: [string, string]; panel: [string, string]; panelEl: ReactNode; titulo: [string, string]; children: ReactNode }) {
  const leer = () => (location.hash === "#panel" ? "panel" : "pagina") as "pagina" | "panel";
  const [vista, setVista] = useState<"pagina" | "panel">(leer);
  useEffect(() => {
    const cambio = () => setVista(leer());
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", vista === "pagina" ? location.pathname : "#panel");
    document.title = vista === "panel" ? titulo[1] : titulo[0];
    window.scrollTo(0, 0);
  }, [vista, titulo]);
  return (
    <>
      <PartesDemo
        fondo={fondo}
        actual={vista}
        alCambiar={setVista}
        partes={[{ id: "pagina", nombre: pagina[0], quien: pagina[1] }, { id: "panel", nombre: nombrePanel[0], quien: nombrePanel[1] }] as const}
      />
      {vista === "pagina" ? children : panelEl}
    </>
  );
}
