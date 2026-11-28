import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, MapPin, Menu, PawPrint, Store, X } from "lucide-react";
import { SECCIONES, SEDE } from "./datos";

export type Vista = "inicio" | "mascotas" | "panel";

const VISTAS = [
  { id: "inicio", nombre: "Servicios y Tienda", icono: Store },
  { id: "mascotas", nombre: "Mis Mascotas", icono: PawPrint },
  { id: "panel", nombre: "Panel Veterinaria", icono: LayoutDashboard },
] as const;

export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden className="relative block h-7 w-7 shrink-0 rounded-xl bg-[#0D9488]">
        <span className="absolute left-[5px] top-[5px] size-2 rounded-full bg-white" />
        <span className="absolute bottom-[5px] right-[5px] h-[9px] w-[14px] -rotate-[24deg] rounded-full bg-white" />
      </span>
      <span className="block leading-none">
        <span className={`block whitespace-nowrap text-[1.02rem] font-extrabold tracking-tight ${claro ? "text-white" : "text-[#0F172A]"}`}>HUELLA VITAL</span>
        <span className={`mt-1 block whitespace-nowrap text-[0.5rem] font-bold uppercase tracking-[0.18em] ${claro ? "text-[#99F6E4]" : "text-[#475569]"}`}>Veterinaria &amp; Grooming</span>
      </span>
    </span>
  );
}

export function Nav({ vista, alVista, alSeccion, alAgendar }: { vista: Vista; alVista: (v: Vista) => void; alSeccion: (id: string) => void; alAgendar: () => void }) {
  const [abierto, setAbierto] = useState(false);
  const barra = useRef<HTMLElement>(null);
  const hamburguesa = useRef<HTMLButtonElement>(null);
  const portada = vista === "inicio";

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
    <header ref={barra} className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#FAFAF9]/95 backdrop-blur">
      <div className="hv-ancho !max-w-[90rem] grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 py-2.5 lg:grid-cols-[auto_1fr_auto] min-[1300px]:gap-x-5">
        <button type="button" onClick={elegir(() => alVista("inicio"))} aria-label="Huella Vital, ir a la portada" className="min-h-11 justify-self-start text-left">
          <Logo />
        </button>

        <nav aria-label="Vistas" className="order-last col-span-2 grid grid-cols-3 gap-1 rounded-full border border-[#E2E8F0] bg-white p-1 lg:order-none lg:col-span-1 lg:flex lg:justify-self-center">
          {VISTAS.map(({ id, nombre, icono: Icono }) => (
            <button
              key={id}
              type="button"
              aria-current={vista === id ? "page" : undefined}
              onClick={elegir(() => alVista(id))}
              className={`flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-full px-2 text-[0.7rem] font-bold leading-tight transition sm:text-[0.8rem] lg:whitespace-nowrap lg:px-3.5 ${vista === id ? "bg-[#0F172A] text-white" : "text-[#334155] hover:bg-[#F0FDFA]"}`}
            >
              <Icono size={15} aria-hidden className="hidden shrink-0 sm:block lg:hidden min-[1400px]:block" />
              {nombre}
            </button>
          ))}
        </nav>

        <div className="flex min-w-0 items-center justify-end gap-2">
          {portada ? (
            <>
              <nav aria-label="Secciones de la portada" className="hidden items-center min-[1200px]:flex">
                {SECCIONES.map((s) => (
                  <button key={s.id} type="button" onClick={() => alSeccion(s.id)} className="min-h-11 whitespace-nowrap px-1.5 text-[0.76rem] font-semibold text-[#475569] transition hover:text-[#0F766E] min-[1300px]:px-2 min-[1300px]:text-[0.8rem]">
                    {s.nombre}
                  </button>
                ))}
              </nav>
              <button type="button" onClick={elegir(alAgendar)} className="hv-boton hv-turquesa whitespace-nowrap max-sm:hidden">
                Agendar cita
              </button>
              <button
                ref={hamburguesa}
                type="button"
                aria-expanded={abierto}
                aria-controls="hv-menu"
                aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
                onClick={() => setAbierto((v) => !v)}
                className="hv-boton hv-linea size-11 !px-0 min-[1200px]:!hidden"
              >
                {abierto ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
              </button>
            </>
          ) : (
            <p className="flex min-w-0 items-center gap-1.5 rounded-full border border-[#99F6E4] bg-[#F0FDFA] px-3 py-1.5 text-[0.68rem] font-bold leading-snug text-[#115E59] sm:text-[0.75rem]">
              <MapPin size={13} aria-hidden className="shrink-0" />
              <span>{SEDE.corta}</span>
            </p>
          )}
        </div>
      </div>

      {portada && abierto && (
        <div id="hv-menu" className="absolute inset-x-0 top-full border-b border-[#E2E8F0] bg-[#FAFAF9] shadow-xl min-[1200px]:hidden">
          <div className="hv-ancho grid gap-3 py-4 sm:!mr-0 sm:max-w-sm">
            <nav aria-label="Secciones de la portada" className="grid">
              {SECCIONES.map((s) => (
                <button key={s.id} type="button" onClick={elegir(() => alSeccion(s.id))} className="min-h-12 border-b border-[#E2E8F0] px-2 text-left text-[0.95rem] font-semibold text-[#0F172A] hover:text-[#0F766E]">
                  {s.nombre}
                </button>
              ))}
            </nav>
            <button type="button" onClick={elegir(alAgendar)} className="hv-boton hv-turquesa w-full">
              Agendar cita
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
