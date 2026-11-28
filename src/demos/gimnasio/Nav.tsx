/*
 * Barra fija. En pantallas anchas: logotipo, las tres vistas, las secciones de la portada
 * (en el orden en que aparecen) e "Inscribirme hoy". En celular, tableta y laptop angosta: menú.
 */
import { useEffect, useRef, useState } from "react";
import { CalendarCheck, ClipboardList, Menu, QrCode, X } from "lucide-react";
import { Logo, VERDE } from "./Piezas";

export type Vista = "planes" | "pase" | "recepcion";

const VISTAS = [
  { id: "planes", nombre: "Planes y Clases", icono: CalendarCheck },
  { id: "pase", nombre: "Pase de Socio", icono: QrCode },
  { id: "recepcion", nombre: "Panel Recepción", icono: ClipboardList },
] as const;

export const SECCIONES = [
  { id: "instalaciones", nombre: "Instalaciones" },
  { id: "planes", nombre: "Planes" },
  { id: "horarios", nombre: "Horarios" },
  { id: "ubicacion", nombre: "Ubicación" },
];

const ANCHA = "(min-width: 1180px)";

export function Nav({ vista, alVista, alSeccion, alInscribirme }: { vista: Vista; alVista: (v: Vista) => void; alSeccion: (id: string) => void; alInscribirme: () => void }) {
  const [abierto, setAbierto] = useState(false);
  const barra = useRef<HTMLElement>(null);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => setAbierto(false), [vista]);
  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAbierto(false);
      boton.current?.focus();
    };
    const fuera = (e: PointerEvent) => {
      if (!barra.current?.contains(e.target as Node)) setAbierto(false);
    };
    /* al agrandar la ventana el menú deja de hacer falta */
    const ancha = matchMedia(ANCHA);
    const crecio = () => ancha.matches && setAbierto(false);
    addEventListener("keydown", tecla);
    addEventListener("pointerdown", fuera);
    ancha.addEventListener("change", crecio);
    return () => {
      removeEventListener("keydown", tecla);
      removeEventListener("pointerdown", fuera);
      ancha.removeEventListener("change", crecio);
    };
  }, [abierto]);

  const elegir = (accion: () => void) => () => {
    setAbierto(false);
    accion();
  };

  return (
    <header ref={barra} className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[90rem] items-center justify-between gap-2 px-3 sm:px-6">
        <button type="button" onClick={elegir(() => alVista("planes"))} aria-label="IronPeak, ir al inicio" className="shrink-0 cursor-pointer py-1">
          <Logo />
        </button>

        <div className="hidden min-w-0 items-center gap-3 min-[1180px]:flex min-[1360px]:gap-5">
          <nav aria-label="Vistas" className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {VISTAS.map(({ id, nombre, icono: Icono }) => (
              <button
                key={id}
                type="button"
                aria-current={vista === id ? "page" : undefined}
                onClick={elegir(() => alVista(id))}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[0.84rem] font-bold transition ${vista === id ? "bg-[#0F172A] text-white" : "text-slate-600 hover:bg-white hover:text-[#0F172A]"}`}
              >
                <Icono size={16} aria-hidden className="hidden min-[1360px]:block" />
                {nombre}
              </button>
            ))}
          </nav>
          <nav aria-label="Secciones" className="flex">
            {SECCIONES.map((s) => (
              <button key={s.id} type="button" onClick={elegir(() => alSeccion(s.id))} className="min-h-10 cursor-pointer whitespace-nowrap px-2 text-[0.85rem] font-semibold text-slate-600 hover:text-[#15803D] min-[1360px]:px-2.5">
                {s.nombre}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button type="button" onClick={elegir(alInscribirme)} className={`${VERDE} !min-h-11 whitespace-nowrap !px-2.5 !text-[0.78rem] sm:!px-4 sm:!text-[0.88rem]`}>
            Inscribirme hoy
          </button>
          <button
            ref={boton}
            type="button"
            aria-expanded={abierto}
            aria-controls="ip-menu"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAbierto((v) => !v)}
            className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-lg border border-slate-300 text-[#0F172A] min-[1180px]:hidden"
          >
            {abierto ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </div>

      {abierto && (
        <div id="ip-menu" className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-slate-200 bg-white px-4 pb-5 pt-3 shadow-[0_24px_40px_-24px_rgba(15,23,42,.45)] min-[1180px]:hidden">
          <div className="mx-auto max-w-xl">
            <nav aria-label="Vistas" className="grid gap-1.5">
              {VISTAS.map(({ id, nombre, icono: Icono }) => (
                <button
                  key={id}
                  type="button"
                  aria-current={vista === id ? "page" : undefined}
                  onClick={elegir(() => alVista(id))}
                  className={`flex min-h-13 cursor-pointer items-center gap-3 rounded-lg px-4 text-left text-base font-bold ${vista === id ? "bg-[#0F172A] text-white" : "bg-slate-100 text-[#0F172A]"}`}
                >
                  <Icono size={20} aria-hidden />
                  {nombre}
                </button>
              ))}
            </nav>
            <p className="mb-2 mt-5 text-[0.8rem] font-bold text-slate-500">En la página</p>
            <nav aria-label="Secciones" className="grid grid-cols-2 gap-1.5">
              {SECCIONES.map((s) => (
                <button key={s.id} type="button" onClick={elegir(() => alSeccion(s.id))} className="min-h-12 min-w-0 cursor-pointer rounded-lg border border-slate-200 text-[0.92rem] font-semibold text-[#0F172A]">
                  {s.nombre}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
