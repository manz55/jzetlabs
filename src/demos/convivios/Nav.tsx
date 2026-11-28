import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChartColumn, Menu, ReceiptText, Store, X } from "lucide-react";
import { CONVIVIO, SECCIONES } from "./datos";

export type Vista = "menu" | "caja" | "admin";

const VISTAS = [
  { id: "menu", nombre: "Menú y Stands", icono: Store },
  { id: "caja", nombre: "Caja y Despacho", icono: ReceiptText },
  { id: "admin", nombre: "Admin y Cierre", icono: ChartColumn },
] as const;

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden className="flex h-7 w-7 shrink-0 flex-col items-start justify-center gap-[3px] rounded-lg bg-[#B91C1C] pl-[6px]">
        <span className="block h-[6px] w-4 rounded-[2px] bg-white" />
        <span className="block h-[3px] w-2.5 rounded-[1px] bg-white" />
      </span>
      <span className="block leading-none">
        <span className="block text-[1.05rem] font-extrabold tracking-tight text-[#18181B]">TICKETFEST</span>
        <span className="mt-1 block whitespace-nowrap text-[0.5rem] font-bold uppercase tracking-[0.05em] text-[#6B6560] sm:text-[0.55rem] sm:tracking-[0.08em]">Control de convivios y ferias</span>
      </span>
    </span>
  );
}

export function Nav({ vista, pendientes, alVista, alSeccion }: { vista: Vista; pendientes: number; alVista: (v: Vista) => void; alSeccion: (id: string) => void }) {
  const [abierto, setAbierto] = useState(false);
  const barra = useRef<HTMLElement>(null);
  const hamburguesa = useRef<HTMLButtonElement>(null);
  const portada = vista === "menu";

  useEffect(() => setAbierto(false), [vista]);
  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAbierto(false);
      hamburguesa.current?.focus();
    };
    const fuera = (e: PointerEvent) => {
      if (!barra.current?.contains(e.target as Node)) setAbierto(false);
    };
    addEventListener("keydown", tecla);
    addEventListener("pointerdown", fuera);
    return () => {
      removeEventListener("keydown", tecla);
      removeEventListener("pointerdown", fuera);
    };
  }, [abierto]);

  const elegir = (accion: () => void) => () => {
    setAbierto(false);
    accion();
  };

  return (
    <header ref={barra} className="sticky top-0 z-40 border-b border-[#EAE2D8] bg-[#FFFDFB]/95 backdrop-blur">
      <div className="tf-ancho !max-w-[90rem] grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 py-2.5 lg:grid-cols-[auto_1fr_auto] min-[1280px]:gap-x-5">
        <button type="button" onClick={elegir(() => alVista("menu"))} aria-label="TICKETFEST, ir a la portada" className="min-h-11 justify-self-start text-left">
          <Logo />
        </button>

        <nav aria-label="Vistas" className="order-last col-span-2 grid grid-cols-3 gap-1 rounded-full border border-[#EAE2D8] bg-[#F9F5F0] p-1 lg:order-none lg:col-span-1 lg:flex lg:justify-self-center">
          {VISTAS.map(({ id, nombre, icono: Icono }) => (
            <button
              key={id}
              type="button"
              aria-current={vista === id ? "page" : undefined}
              onClick={elegir(() => alVista(id))}
              className={`relative flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-full px-2 text-[0.7rem] font-bold leading-tight transition sm:text-[0.8rem] lg:whitespace-nowrap lg:px-3.5 ${vista === id ? "bg-[#18181B] text-white" : "text-[#3F3F46] hover:bg-white"}`}
            >
              <Icono size={15} aria-hidden className="hidden shrink-0 sm:block lg:hidden min-[1360px]:block" />
              {nombre}
              {id === "caja" && pendientes > 0 && (
                <span className="tf-cuenta max-sm:absolute max-sm:-top-1.5 max-sm:right-0">
                  {pendientes}
                  <span className="sr-only"> órdenes por entregar</span>
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="flex min-w-0 items-center justify-end gap-2">
          {portada ? (
            <>
              <nav aria-label="Secciones de la portada" className="hidden items-center min-[1200px]:flex">
                {SECCIONES.map((s) => (
                  <button key={s.id} type="button" onClick={() => alSeccion(s.id)} className="min-h-11 whitespace-nowrap px-1.5 text-[0.76rem] font-semibold text-[#52525B] transition hover:text-[#B91C1C] min-[1360px]:px-2 min-[1360px]:text-[0.8rem]">
                    {s.nombre}
                  </button>
                ))}
              </nav>
              <button type="button" onClick={elegir(() => alVista("caja"))} className="tf-boton tf-rojo whitespace-nowrap !px-4 max-sm:hidden">
                Ir a Caja
              </button>
              <button
                ref={hamburguesa}
                type="button"
                aria-expanded={abierto}
                aria-controls="tf-menu"
                aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
                onClick={() => setAbierto((v) => !v)}
                className="tf-boton tf-linea size-11 !px-0 min-[1200px]:!hidden"
              >
                {abierto ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
              </button>
            </>
          ) : (
            <p className="flex min-w-0 items-center justify-end gap-1.5 text-right text-[0.66rem] font-semibold sm:text-[0.72rem] leading-snug text-[#6B6560]">
              <CalendarDays size={13} aria-hidden className="hidden shrink-0 text-[#B91C1C] sm:block" />
              <span>{CONVIVIO.nombre}</span>
            </p>
          )}
        </div>
      </div>

      {portada && abierto && (
        <div id="tf-menu" className="absolute inset-x-0 top-full border-b border-[#EAE2D8] bg-[#FFFDFB] shadow-xl min-[1200px]:hidden">
          <div className="tf-ancho grid gap-3 py-4 sm:!mr-0 sm:max-w-sm">
            <nav aria-label="Secciones de la portada" className="grid">
              {SECCIONES.map((s) => (
                <button key={s.id} type="button" onClick={elegir(() => alSeccion(s.id))} className="min-h-12 border-b border-[#F1EAE1] px-2 text-left text-[0.95rem] font-semibold text-[#18181B] hover:text-[#B91C1C]">
                  {s.nombre}
                </button>
              ))}
            </nav>
            <button type="button" onClick={elegir(() => alVista("caja"))} className="tf-boton tf-rojo w-full">
              Ir a Caja
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
