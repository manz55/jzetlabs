/*
 * Piezas que comparten las demos: la banda de arriba, el cierre de Jzet Labs,
 * la vista de "así le llega el mensaje" y el contador de cantidad.
 */
import { useEffect, useRef, type ReactNode } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { Modal } from "@/components/Modal";
import { whatsappLink } from "@/data/site";

export const DEMOS = [
  { nombre: "Clínica", href: "/demos/clinica/" },
  { nombre: "Tienda de ropa", href: "/demos/ropa/" },
  { nombre: "Cosméticos", href: "/demos/cosmeticos/" },
  { nombre: "Fundadora", href: "/demos/fundadora/" },
  { nombre: "Celulares", href: "/demos/celulares/" },
  { nombre: "Restaurante", href: "/demos/restaurante/" },
  { nombre: "Tiempo compartido", href: "/demos/tiempo-compartido/" },
];

export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;

/* Banda de arriba: dice que es demo y lleva a las otras */
export function BandaDemos() {
  const aqui = location.pathname.endsWith("/") ? location.pathname : location.pathname + "/";
  return (
    <div className="relative z-40 bg-[#1c1714] text-white/85 text-[0.8rem]">
      <div className="mx-auto max-w-7xl px-4 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <a href="/" className="hover:text-white">
          ← Demo de <b className="text-white">Jzet Labs</b> · datos de ejemplo
        </a>
        <nav className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-white/10 p-0.5 [scrollbar-width:none]" aria-label="Otras demos">
          {DEMOS.map((d) => {
            const activa = aqui === d.href;
            return (
              <a
                key={d.href}
                href={d.href}
                aria-current={activa ? "page" : undefined}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 transition ${activa ? "bg-white text-[#1c1714] font-semibold" : "hover:text-white"}`}
              >
                {d.nombre}
              </a>
            );
          })}
        </nav>
      </div>
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
