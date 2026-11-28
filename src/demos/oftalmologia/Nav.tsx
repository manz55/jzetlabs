import { useEffect, useRef, useState } from "react";
import { MapPin, Menu, X } from "lucide-react";
import { SECCIONES, SEDE } from "./datos";
import { Logo } from "./Piezas";

export type Vista = "inicio" | "receta" | "panel";

const VISTAS: { id: Vista; nombre: string }[] = [
  { id: "inicio", nombre: "Consulta y Óptica" },
  { id: "receta", nombre: "Mi Receta Visual" },
  { id: "panel", nombre: "Panel Clínica y Taller" },
];

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
    <header ref={barra} className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#FAFAFA]/95 backdrop-blur">
      <div className="cv-ancho !max-w-[90rem] grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-2 py-2.5 lg:grid-cols-[auto_1fr_auto]">
        <button type="button" onClick={elegir(() => alVista("inicio"))} aria-label="CLARAVISTA, ir a la portada" className="min-h-11 justify-self-start">
          <Logo />
        </button>

        <nav aria-label="Vistas" className="order-last col-span-2 grid grid-cols-3 gap-1 rounded-full border border-[#E2E8F0] bg-[#F1F5F9] p-1 lg:order-none lg:col-span-1 lg:flex lg:justify-self-center">
          {VISTAS.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-current={vista === v.id ? "page" : undefined}
              onClick={elegir(() => alVista(v.id))}
              className={`min-h-10 min-w-0 rounded-full px-2 text-[0.7rem] font-bold leading-tight transition sm:text-[0.75rem] lg:whitespace-nowrap lg:px-3.5 ${vista === v.id ? "bg-[#0F172A] text-white" : "text-[#334155] hover:bg-white"}`}
            >
              {v.nombre}
            </button>
          ))}
        </nav>

        <div className="flex min-w-0 items-center justify-end gap-2">
          {portada ? (
            <>
              <nav aria-label="Secciones de la portada" className="hidden items-center min-[1240px]:flex">
                {SECCIONES.map((s) => (
                  <button key={s.id} type="button" onClick={() => alSeccion(s.id)} className="min-h-11 whitespace-nowrap px-1.5 text-[0.76rem] font-semibold text-[#475569] transition hover:text-[#1E3A8A] min-[1360px]:px-2.5 min-[1360px]:text-[0.8rem]">
                    {s.nombre}
                  </button>
                ))}
              </nav>
              <button type="button" onClick={elegir(alAgendar)} className="cv-boton cv-zafiro whitespace-nowrap max-sm:hidden">
                Agendar examen
              </button>
              <button
                ref={hamburguesa}
                type="button"
                aria-expanded={abierto}
                aria-controls="cv-menu"
                aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
                onClick={() => setAbierto((v) => !v)}
                className="cv-boton cv-linea size-11 !px-0 min-[1240px]:!hidden"
              >
                {abierto ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
              </button>
            </>
          ) : (
            <p className="flex min-w-0 items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[0.7rem] font-bold leading-snug text-[#1E3A8A] sm:text-[0.75rem]">
              <MapPin size={13} aria-hidden className="shrink-0" />
              <span>{SEDE.corta}</span>
            </p>
          )}
        </div>
      </div>

      {portada && abierto && (
        <div id="cv-menu" className="absolute inset-x-0 top-full border-b border-[#E2E8F0] bg-[#FAFAFA] shadow-xl min-[1240px]:hidden">
          <div className="cv-ancho grid gap-3 py-4 sm:!mr-0 sm:max-w-sm">
            <nav aria-label="Secciones de la portada" className="grid">
              {SECCIONES.map((s) => (
                <button key={s.id} type="button" onClick={elegir(() => alSeccion(s.id))} className="min-h-12 border-b border-[#E2E8F0] px-2 text-left text-[0.95rem] font-semibold text-[#0F172A] hover:text-[#1E3A8A]">
                  {s.nombre}
                </button>
              ))}
            </nav>
            <button type="button" onClick={elegir(alAgendar)} className="cv-boton cv-zafiro w-full">
              Agendar examen
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
