/*
 * Barra fija, según la vista. En la portada: logotipo, las tres vistas, las secciones (en el orden
 * en que aparecen) e "Inscribirme hoy". En el pase y en recepción: logotipo, las vistas al centro y
 * un aviso discreto de dónde se está. En pantallas angostas las vistas van en el menú.
 */
import { useEffect, useRef, useState } from "react";
import { CalendarCheck, CircleCheck, CircleX, ClipboardList, Clock3, MapPin, Menu, QrCode, X } from "lucide-react";
import type { Acceso } from "./datos";
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

/* el aviso de la derecha; en celulares angostos se oculta la primera palabra ("corte") */
const SOCIO: Record<Acceso, { antes: string; texto: string; corte: string; icono: typeof MapPin; clase: string }> = {
  activo: { antes: "Socio ", texto: "activo", corte: "max-[389px]:hidden", icono: CircleCheck, clase: "bg-green-50 text-green-900" },
  tolerancia: { antes: "Con ", texto: "tolerancia", corte: "max-[389px]:hidden", icono: Clock3, clase: "bg-amber-50 text-amber-900" },
  bloqueado: { antes: "Acceso ", texto: "bloqueado", corte: "max-[389px]:hidden", icono: CircleX, clase: "bg-red-50 text-red-800" },
};
const SEDE = { antes: "Sede ", texto: "Zona 14", corte: "max-[359px]:hidden", icono: MapPin, clase: "bg-slate-100 text-slate-700" };

export function Nav({ vista, acceso, alVista, alSeccion, alInscribirme }: { vista: Vista; acceso: Acceso; alVista: (v: Vista) => void; alSeccion: (id: string) => void; alInscribirme: () => void }) {
  const [abierto, setAbierto] = useState(false);
  const portada = vista === "planes";
  /* sin secciones ni botón, las vistas caben desde una pantalla más angosta */
  const ancha = portada ? "(min-width: 1180px)" : "(min-width: 860px)";
  const aviso = vista === "recepcion" ? SEDE : SOCIO[acceso];
  const Aviso = aviso.icono;
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
    const medida = matchMedia(ancha);
    const crecio = () => medida.matches && setAbierto(false);
    addEventListener("keydown", tecla);
    addEventListener("pointerdown", fuera);
    medida.addEventListener("change", crecio);
    return () => {
      removeEventListener("keydown", tecla);
      removeEventListener("pointerdown", fuera);
      medida.removeEventListener("change", crecio);
    };
  }, [abierto, ancha]);

  const elegir = (accion: () => void) => () => {
    setAbierto(false);
    accion();
  };

  const vistas = (iconos: string) => (
    <nav aria-label="Vistas" className="flex gap-1 rounded-xl bg-slate-100 p-1">
      {VISTAS.map(({ id, nombre, icono: Icono }) => (
        <button
          key={id}
          type="button"
          aria-current={vista === id ? "page" : undefined}
          onClick={elegir(() => alVista(id))}
          className={`inline-flex min-h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[0.84rem] font-bold transition ${vista === id ? "bg-[#0F172A] text-white" : "text-slate-600 hover:bg-white hover:text-[#0F172A]"}`}
        >
          <Icono size={16} aria-hidden className={iconos} />
          {nombre}
        </button>
      ))}
    </nav>
  );

  const hamburguesa = (
    <button
      ref={boton}
      type="button"
      aria-expanded={abierto}
      aria-controls="ip-menu"
      aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
      onClick={() => setAbierto((v) => !v)}
      className={`grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-lg border border-slate-300 text-[#0F172A] ${portada ? "min-[1180px]:hidden" : "min-[860px]:hidden"}`}
    >
      {abierto ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
    </button>
  );

  const logo = (
    <button type="button" onClick={elegir(() => alVista("planes"))} aria-label="IronPeak, ir al inicio" className="shrink-0 cursor-pointer justify-self-start py-1">
      <Logo />
    </button>
  );

  return (
    <header ref={barra} className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      {portada ? (
        <div className="mx-auto flex h-[4.5rem] w-full max-w-[90rem] items-center justify-between gap-2 px-3 sm:px-6">
          {logo}
          <div className="hidden min-w-0 items-center gap-3 min-[1180px]:flex min-[1360px]:gap-5">
            {vistas("hidden min-[1360px]:block")}
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
            {hamburguesa}
          </div>
        </div>
      ) : (
        <div className="mx-auto grid h-[4.5rem] w-full max-w-[90rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 sm:px-6 min-[860px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          {logo}
          <div className="hidden min-[860px]:block">{vistas("hidden min-[1100px]:block")}</div>
          <div className="flex shrink-0 items-center gap-1.5 justify-self-end sm:gap-2">
            <p role="status" className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[0.75rem] font-bold sm:px-3 sm:text-[0.82rem] ${aviso.clase}`}>
              <Aviso size={15} aria-hidden className="shrink-0" />
              <span>
                <span className={aviso.corte}>{aviso.antes}</span>
                <span className="max-[389px]:capitalize">{aviso.texto}</span>
              </span>
            </p>
            {hamburguesa}
          </div>
        </div>
      )}

      {abierto && (
        <div id="ip-menu" className={`absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-slate-200 bg-white px-4 pb-5 pt-3 shadow-[0_24px_40px_-24px_rgba(15,23,42,.45)] ${portada ? "min-[1180px]:hidden" : "min-[860px]:hidden"}`}>
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
            {portada && (
              <>
                <p className="mb-2 mt-5 text-[0.8rem] font-bold text-slate-500">En la página</p>
                <nav aria-label="Secciones" className="grid grid-cols-2 gap-1.5">
                  {SECCIONES.map((s) => (
                    <button key={s.id} type="button" onClick={elegir(() => alSeccion(s.id))} className="min-h-12 min-w-0 cursor-pointer rounded-lg border border-slate-200 text-[0.92rem] font-semibold text-[#0F172A]">
                      {s.nombre}
                    </button>
                  ))}
                </nav>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
