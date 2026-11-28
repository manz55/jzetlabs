/*
 * Barra fija. Los accesos a secciones (en el orden en que aparecen en la portada) y "Cotizar fecha"
 * solo salen en la portada. En pantallas angostas todo pasa al menú desplegable.
 */
import { useEffect, useRef, useState } from "react";
import { Armchair, LayoutDashboard, Menu, Receipt, X } from "lucide-react";
import { SECCIONES } from "./datos";
import { Logo } from "./Piezas";
import { ancho, boton } from "./estilos";

export type Vista = "renta" | "caja" | "panel";

const VISTAS = [
  { id: "renta", nombre: "Renta y Convivios", icono: Armchair },
  { id: "caja", nombre: "Caja y Stands", icono: Receipt },
  { id: "panel", nombre: "Panel Organizador", icono: LayoutDashboard },
] as const;

export function Nav({ vista, avisos, alVista, alSeccion, alCotizar }: { vista: Vista; avisos: Record<Vista, number>; alVista: (v: Vista) => void; alSeccion: (id: string) => void; alCotizar: () => void }) {
  const [abierto, setAbierto] = useState(false);
  const barra = useRef<HTMLElement>(null);
  const hamburguesa = useRef<HTMLButtonElement>(null);
  const portada = vista === "renta";

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

  const vistas = (enMenu: boolean) =>
    VISTAS.map(({ id, nombre, icono: Icono }) => {
      const activa = vista === id;
      return (
        <button
          key={id}
          type="button"
          aria-current={activa ? "page" : undefined}
          onClick={elegir(() => alVista(id))}
          className={`inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full px-3.5 text-[0.82rem] font-bold transition ${enMenu ? "min-h-12 w-full justify-start px-4 text-[0.95rem]" : "justify-center"} ${activa ? "bg-[#1C1917] text-white" : "text-[#44403C] hover:bg-white"}`}
        >
          <Icono size={16} aria-hidden className={enMenu ? "" : "hidden xl:block"} />
          {nombre}
          {avisos[id] > 0 && (
            <span className={`grid h-5 min-w-5 place-items-center rounded-full bg-[#A16207] px-1 text-[0.68rem] text-white ${enMenu ? "ml-auto" : ""}`}>
              {avisos[id]}
              <span className="sr-only">{id === "caja" ? " órdenes por entregar" : " reservas nuevas"}</span>
            </span>
          )}
        </button>
      );
    });

  return (
    <header ref={barra} className="sticky top-0 z-40 border-b border-[#E4DDD3] bg-[#FAF8F5]/95 backdrop-blur">
      {/* sin accesos a la derecha, el selector queda centrado en la pantalla */}
      <div className={`${ancho} !max-w-[88rem] flex h-[4.5rem] items-center justify-between gap-3 ${portada ? "" : "lg:grid lg:grid-cols-[1fr_auto_1fr]"}`}>
        <button type="button" onClick={elegir(() => alVista("renta"))} aria-label="Casa Imperial, ir al inicio" className="shrink-0 justify-self-start text-left">
          <Logo />
        </button>

        <nav aria-label="Vistas" className="hidden items-center gap-1 rounded-full border border-[#E4DDD3] bg-[#F3EFEA] p-1 lg:flex">
          {vistas(false)}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          {portada && (
            <>
              <nav aria-label="Secciones de la portada" className="mr-2 hidden items-center min-[1320px]:flex">
                {SECCIONES.map((s) => (
                  <button key={s.id} type="button" onClick={() => alSeccion(s.id)} className="min-h-11 px-2.5 text-[0.82rem] font-semibold text-[#57534E] transition hover:text-[#A16207]">
                    {s.nombre}
                  </button>
                ))}
              </nav>
              <button type="button" onClick={elegir(alCotizar)} className={`${boton.bronce} whitespace-nowrap max-sm:hidden`}>
                Cotizar fecha
              </button>
            </>
          )}
          <button
            ref={hamburguesa}
            type="button"
            aria-expanded={abierto}
            aria-controls="ci-menu"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAbierto((v) => !v)}
            /* en escritorio ancho ya se ve todo; fuera de la portada basta el selector desde lg */
            className={`${boton.linea} size-11 !px-0 ${portada ? "min-[1320px]:hidden" : "lg:hidden"}`}
          >
            {abierto ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      {abierto && (
        <div id="ci-menu" className={`absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-[#E4DDD3] bg-[#FAF8F5] shadow-xl ${portada ? "min-[1320px]:hidden" : "lg:hidden"}`}>
          <div className={`${ancho} grid gap-4 py-5 sm:max-w-md sm:!mr-0 sm:!ml-auto`}>
            <nav aria-label="Vistas" className="grid gap-1 lg:hidden">
              {vistas(true)}
            </nav>
            {portada && (
              <>
                <nav aria-label="Secciones de la portada" className="grid border-t border-[#E4DDD3] pt-2 max-lg:mt-0 lg:border-t-0 lg:pt-0">
                  {SECCIONES.map((s) => (
                    <button key={s.id} type="button" onClick={elegir(() => alSeccion(s.id))} className="min-h-12 px-4 text-left text-[0.95rem] font-semibold text-[#1C1917] hover:text-[#A16207]">
                      {s.nombre}
                    </button>
                  ))}
                </nav>
                <button type="button" onClick={elegir(alCotizar)} className={`${boton.bronce} w-full`}>
                  Cotizar fecha
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
