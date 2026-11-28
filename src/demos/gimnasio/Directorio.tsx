/*
 * Directorio de socios en filas compactas: un botón principal según el estado y botones de ícono
 * para lo demás. Se acomoda según el ancho de la propia lista, no el de la pantalla.
 */
import { useState, type FocusEvent, type MouseEvent } from "react";
import { Banknote, Check, Clock3, FileText, Mail, MessageCircle, Search, TimerOff } from "lucide-react";
import { grupoDe, planDe, sedeDe, textoDias, type Club, type Grupo, type Socio } from "./datos";
import { enlaceCorreo, enlaceWhatsApp } from "./avisos";
import { plano } from "./VentanasAtajo";
import { AMBAR, BORDE, VERDE } from "./Piezas";

export type Filtro = "todos" | Grupo;

const FILTROS: { id: Filtro; nombre: string }[] = [
  { id: "todos", nombre: "Todos" },
  { id: "vencido", nombre: "Vencidos" },
  { id: "tolerancia", nombre: "Con tolerancia" },
  { id: "pronto", nombre: "Por vencer" },
  { id: "al-dia", nombre: "Al día" },
];

const ETIQUETA: Record<Grupo, { texto: string; clase: string }> = {
  vencido: { texto: "Vencido", clase: "bg-red-100 text-red-800" },
  tolerancia: { texto: "Tolerancia activa", clase: "bg-amber-700 text-white" },
  pronto: { texto: "Por vencer", clase: "bg-amber-100 text-amber-900" },
  "al-dia": { texto: "Al día", clase: "bg-green-100 text-green-900" },
};

/* en celular cada ícono lleva su palabra debajo */
const ICONO = "flex min-h-12 min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-slate-300 bg-white text-[#0F172A] transition hover:border-[#0F172A] active:scale-95 @xl:h-10 @xl:min-h-10 @xl:w-10";
const PALABRA = "text-[0.68rem] font-bold leading-none @xl:sr-only";

type Pista = { texto: string; x: number; y: number } | null;

export function Directorio({ club, filtro, alFiltrar, alCobrar, alFicha, alVer }: { club: Club; filtro: Filtro; alFiltrar: (f: Filtro) => void; alCobrar: (id: number) => void; alFicha: (id: number) => void; alVer: (id: number) => void }) {
  const [busqueda, setBusqueda] = useState("");
  const [pista, setPista] = useState<Pista>(null);
  const { socios } = club;
  const cuantos = (f: Filtro) => (f === "todos" ? socios.length : socios.filter((s) => grupoDe(s) === f).length);
  const texto = plano(busqueda.trim());
  const lista = socios.filter((s) => (filtro === "todos" || grupoDe(s) === filtro) && plano(s.nombre).includes(texto));

  /* el letrerito sale encima del botón, fuera de la lista para que no se corte */
  const conPista = (t: string) => {
    const mostrar = (e: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
      if (!matchMedia("(hover: hover)").matches) return;
      const r = e.currentTarget.getBoundingClientRect();
      setPista({ texto: t, x: Math.min(r.left + r.width / 2, innerWidth - 90), y: r.top - 6 });
    };
    const quitar = () => setPista(null);
    return { "aria-label": t, onMouseEnter: mostrar, onFocus: mostrar, onMouseLeave: quitar, onBlur: quitar };
  };

  function fila(s: Socio) {
    const grupo = grupoDe(s);
    return (
      <li key={s.id} className="flex min-w-0 flex-col gap-2.5 border-b border-slate-100 px-3 py-2.5 last:border-0 hover:bg-[#F8FAFC] @3xl:flex-row @3xl:items-center @3xl:gap-3 @3xl:py-1.5">
        <div className="flex min-w-0 flex-1 items-start justify-between gap-3 @3xl:items-center">
          <div className="min-w-0 flex-1">
            <button type="button" onClick={() => alVer(s.id)} {...conPista(`Ver el carné de ${s.nombre}`)} className="block max-w-full cursor-pointer truncate text-left text-[0.95rem] font-extrabold leading-snug text-[#0F172A] hover:text-[#15803D]">
              {s.nombre}
            </button>
            <p className="truncate text-[0.78rem] leading-snug text-slate-600">
              {planDe(s.plan).nombre} · {sedeDe(s.sede).nombre}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-0.5 @3xl:w-36 @3xl:items-start">
            <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[0.72rem] font-extrabold ${ETIQUETA[grupo].clase}`}>{ETIQUETA[grupo].texto}</span>
            <span className="whitespace-nowrap text-[0.74rem] font-semibold text-slate-600">{textoDias(s.dias)}</span>
          </div>
        </div>

        <div className="grid shrink-0 gap-2 @xl:flex @xl:items-center @xl:justify-end">
          {grupo === "vencido" ? (
            <button type="button" onClick={() => club.tolerar(s.id)} className={`${AMBAR} !min-h-11 !px-3 !text-[0.85rem] @xl:!min-h-10 @xl:w-40`}>
              <Clock3 size={17} aria-hidden className="shrink-0" /> Tolerancia 24h
            </button>
          ) : (
            <button type="button" onClick={() => alCobrar(s.id)} className={`${grupo === "al-dia" ? BORDE : VERDE} !min-h-11 !px-3 !text-[0.85rem] @xl:!min-h-10 @xl:w-40`}>
              <Banknote size={17} aria-hidden className="shrink-0" /> Registrar cobro
            </button>
          )}
          <div className="grid grid-cols-4 gap-1.5 @xl:flex">
            {grupo === "vencido" ? (
              <button type="button" onClick={() => alCobrar(s.id)} {...conPista("Registrar cobro")} className={`${ICONO} !border-[#15803D] !bg-[#15803D] !text-white`}>
                <Banknote size={18} aria-hidden />
                <span className={PALABRA}>Cobrar</span>
              </button>
            ) : grupo === "tolerancia" ? (
              <button type="button" onClick={() => club.quitarTolerancia(s.id)} {...conPista("Quitar tolerancia")} className={ICONO}>
                <TimerOff size={18} aria-hidden className="text-amber-700" />
                <span className={PALABRA}>Quitar</span>
              </button>
            ) : (
              <span aria-hidden className="@xl:w-10" />
            )}
            <a href={enlaceWhatsApp(s)} target="_blank" rel="noopener noreferrer" onClick={() => club.avisar(s.id, "whatsapp")} {...conPista(s.avisos.whatsapp ? "WhatsApp (ya avisado)" : "Cobrar por WhatsApp")} className={`${ICONO} relative`}>
              <MessageCircle size={18} aria-hidden className="text-[#15803D]" />
              {s.avisos.whatsapp && <Check size={12} aria-hidden className="absolute right-1 top-1 text-[#15803D]" strokeWidth={4} />}
              <span className={PALABRA}>WhatsApp</span>
            </a>
            <a href={enlaceCorreo(s)} onClick={() => club.avisar(s.id, "correo")} {...conPista(s.avisos.correo ? "Email (ya abierto)" : "Enviar estado por Email")} className={`${ICONO} relative`}>
              <Mail size={18} aria-hidden className="text-[#15803D]" />
              {s.avisos.correo && <Check size={12} aria-hidden className="absolute right-1 top-1 text-[#15803D]" strokeWidth={4} />}
              <span className={PALABRA}>Correo</span>
            </a>
            <button type="button" onClick={() => alFicha(s.id)} {...conPista("Ver / Editar ficha")} className={ICONO}>
              <FileText size={18} aria-hidden />
              <span className={PALABRA}>Ficha</span>
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <section aria-label="Directorio de socios" className="min-w-0 xl:col-span-8">
      <div className="flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Filtrar socios" className="flex flex-wrap gap-1.5">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filtro === f.id}
              onClick={() => alFiltrar(f.id)}
              className={`inline-flex min-h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-[0.8rem] font-bold ${filtro === f.id ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-slate-300 bg-white text-[#0F172A] hover:border-[#0F172A]"}`}
            >
              {f.nombre}
              <span className={`rounded-full px-1.5 text-[0.72rem] ${filtro === f.id ? "bg-white/20" : "bg-slate-100 text-slate-600"}`}>{cuantos(f.id)}</span>
            </button>
          ))}
        </div>
        <label className="relative block min-w-0 flex-1 basis-40">
          <span className="sr-only">Buscar socio por nombre</span>
          <Search size={16} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar nombre" className="min-h-10 w-full min-w-0 rounded-full border border-slate-300 bg-white pl-9 pr-3 text-[0.9rem] text-[#0F172A] outline-none focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/30" />
        </label>
      </div>

      <div className="@container mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {lista.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-bold text-[#0F172A]">{texto ? "No hay socios con esa búsqueda." : "No hay socios en este grupo."}</p>
            <button
              type="button"
              onClick={() => {
                setBusqueda("");
                alFiltrar("todos");
              }}
              className={`${BORDE} mt-3`}
            >
              Ver todos los socios
            </button>
          </div>
        ) : (
          /* en pantalla grande la lista se desplaza por dentro y la página se queda quieta */
          <ul onScroll={() => setPista(null)} className="xl:max-h-[max(21.5rem,calc(100dvh-26.5rem))] xl:overflow-y-auto">
            {lista.map(fila)}
          </ul>
        )}
      </div>

      {pista && (
        <span aria-hidden className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-[#0F172A] px-2.5 py-1.5 text-[0.76rem] font-bold text-white shadow-lg" style={{ left: pista.x, top: pista.y }}>
          {pista.texto}
        </span>
      )}
    </section>
  );
}
