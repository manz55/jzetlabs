/* Panel Recepción: cuatro cifras del día y la lista de socios para cobrar y recordar. */
import { useEffect, useState } from "react";
import { Check, LogIn, MessageCircle, QrCode, Search, Undo2, Users, Wallet, CircleAlert, X } from "lucide-react";
import { estadoDe, fechaEn, planDe, qz, sedeDe, textoDias, type Club, type Estado, type Socio } from "./datos";
import { ANCHO, BORDE, VERDE } from "./Piezas";

export type Filtro = "todos" | Estado;

const FILTROS: { id: Filtro; nombre: string }[] = [
  { id: "todos", nombre: "Todos" },
  { id: "vencido", nombre: "Vencidos" },
  { id: "pronto", nombre: "Por vencer pronto" },
  { id: "al-dia", nombre: "Al día" },
];

const ETIQUETA: Record<Estado, { texto: string; clase: string }> = {
  vencido: { texto: "Vencido", clase: "bg-red-100 text-red-800" },
  pronto: { texto: "Por vencer", clase: "bg-amber-100 text-amber-900" },
  "al-dia": { texto: "Al día", clase: "bg-green-100 text-green-900" },
};

/* para buscar sin importar tildes ni mayúsculas */
const plano = (t: string) => t.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/* mensaje listo; WhatsApp pide escoger el chat antes de enviar */
function enlaceRecordatorio(s: Socio) {
  const nombre = s.nombre.split(" ")[0];
  const plan = planDe(s.plan);
  const cuando = s.dias <= 0 ? "ya venció" : `vence el ${fechaEn(s.dias)}`;
  const mensaje = `Hola ${nombre}, le saludamos de IronPeak. Su ${plan.nombre} (${qz(plan.precio)}) ${cuando}. Puede renovarlo en recepción cuando guste. ¡Le esperamos!`;
  return `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
}

export function Panel({ club, filtro, alFiltrar, alVer }: { club: Club; filtro: Filtro; alFiltrar: (f: Filtro) => void; alVer: (id: number) => void }) {
  const [busqueda, setBusqueda] = useState("");
  /* el socio tal como estaba antes del último cobro, para avisar y poder deshacer */
  const [cobro, setCobro] = useState<Socio | null>(null);

  useEffect(() => {
    if (!cobro) return;
    const t = window.setTimeout(() => setCobro(null), 12000);
    return () => window.clearTimeout(t);
  }, [cobro]);

  const { socios } = club;
  const vencidos = socios.filter((s) => estadoDe(s.dias) === "vencido");
  const porCobrar = vencidos.reduce((t, s) => t + planDe(s.plan).precio, 0);
  const cuantos = (f: Filtro) => (f === "todos" ? socios.length : socios.filter((s) => estadoDe(s.dias) === f).length);
  const texto = plano(busqueda.trim());
  const lista = socios.filter((s) => (filtro === "todos" || estadoDe(s.dias) === filtro) && plano(s.nombre).includes(texto));

  const cifras = [
    { icono: Users, nombre: "Socios activos", valor: String(socios.length - vencidos.length), nota: "con mensualidad vigente" },
    { icono: LogIn, nombre: "Entradas hoy", valor: String(socios.filter((s) => s.entrada).length), nota: "en las dos sedes" },
    { icono: CircleAlert, nombre: "Por cobrar / vencidos", valor: qz(porCobrar), nota: vencidos.length === 1 ? "1 socio vencido" : `${vencidos.length} socios vencidos` },
    { icono: Wallet, nombre: "Ingresos del mes", valor: qz(club.ingresos), nota: "mensualidades cobradas" },
  ];

  const hoy = new Date().toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="bg-[#F8FAFC] pb-16 pt-6 sm:pt-10">
      <div className={ANCHO}>
        <h1 className="text-[1.75rem] font-extrabold tracking-tight sm:text-[2.2rem]">Panel Recepción</h1>
        <p className="text-slate-600 first-letter:uppercase">{hoy}</p>

        <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cifras.map(({ icono: Icono, nombre, valor, nota }) => (
            <div key={nombre} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <dt className="flex items-start gap-2 text-[0.85rem] font-bold leading-snug text-slate-600">
                <Icono size={17} aria-hidden className="mt-0.5 shrink-0 text-[#15803D]" />
                {nombre}
              </dt>
              <dd className="mt-1.5 break-words text-[clamp(1.55rem,1.1rem+1.8vw,2.3rem)] font-extrabold leading-tight text-[#0F172A]">{valor}</dd>
              <dd className="text-[0.8rem] text-slate-500">{nota}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filtrar socios" className="flex flex-wrap gap-2">
            {FILTROS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filtro === f.id}
                onClick={() => alFiltrar(f.id)}
                className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-[0.9rem] font-bold ${filtro === f.id ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-slate-300 bg-white text-[#0F172A] hover:border-[#0F172A]"}`}
              >
                {f.nombre}
                <span className={`rounded-full px-2 py-0.5 text-[0.78rem] ${filtro === f.id ? "bg-white/20" : "bg-slate-100 text-slate-600"}`}>{cuantos(f.id)}</span>
              </button>
            ))}
          </div>
          <label className="relative block w-full min-w-0 lg:w-80">
            <span className="sr-only">Buscar socio por nombre</span>
            <Search size={18} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por nombre" className="min-h-12 w-full min-w-0 rounded-lg border border-slate-300 bg-white pl-11 pr-3 text-base text-[#0F172A] outline-none focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/30" />
          </label>
        </div>

        {lista.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="font-bold text-[#0F172A]">No hay socios con esa búsqueda.</p>
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
          <ul className="mt-4 grid gap-3">
            {lista.map((s) => {
              const estado = estadoDe(s.dias);
              const plan = planDe(s.plan);
              return (
                <li key={s.id} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,auto)] md:items-center xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto]">
                  <div className="min-w-0">
                    <button type="button" onClick={() => alVer(s.id)} aria-label={`Ver el carné de ${s.nombre}`} className="inline-flex max-w-full cursor-pointer items-center gap-2 text-left text-[1.1rem] font-extrabold text-[#0F172A] hover:text-[#15803D]">
                      <span className="min-w-0 break-words">{s.nombre}</span>
                      <QrCode size={17} aria-hidden className="shrink-0 text-slate-400" />
                    </button>
                    <p className="text-[0.88rem] text-slate-600">
                      {plan.nombre} · {qz(plan.precio)} · {sedeDe(s.sede).nombre}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className={`rounded-full px-3 py-1 text-[0.8rem] font-extrabold ${ETIQUETA[estado].clase}`}>{ETIQUETA[estado].texto}</span>
                    <span className="text-[0.88rem] font-semibold text-slate-700">{textoDias(s.dias)}</span>
                    {s.entrada && <span className="text-[0.82rem] text-slate-500">Entró hoy {s.entrada}</span>}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 md:col-span-2 xl:col-span-1 xl:w-[33rem]">
                    <button
                      type="button"
                      onClick={() => {
                        setCobro(s);
                        club.renovar(s);
                      }}
                      className={VERDE}
                    >
                      Cobrar y renovar 1 mes
                    </button>
                    <a href={enlaceRecordatorio(s)} target="_blank" rel="noopener noreferrer" onClick={() => club.recordar(s.id)} className={BORDE}>
                      {s.recordado ? <Check size={18} aria-hidden className="shrink-0 text-[#15803D]" /> : <MessageCircle size={18} aria-hidden className="shrink-0 text-[#15803D]" />}
                      {s.recordado ? "Recordar otra vez" : "Recordar por WhatsApp"}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {cobro && (
        <div role="status" className="fixed inset-x-3 bottom-3 z-30 mx-auto max-w-xl rounded-xl bg-[#0F172A] p-4 text-white shadow-2xl">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#15803D]">
              <Check size={20} aria-hidden />
            </span>
            <p className="min-w-0 flex-1 text-[0.93rem]">
              <b className="block">
                Cobrado {qz(planDe(cobro.plan).precio)} a {cobro.nombre}
              </b>
              <span className="text-slate-300">Su carné quedó activo.</span>
            </p>
            <button type="button" onClick={() => setCobro(null)} aria-label="Cerrar aviso" className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg bg-white/10">
              <X size={17} aria-hidden />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => alVer(cobro.id)} className="inline-flex min-h-11 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-3 text-[0.9rem] font-bold text-[#0F172A]">
              <QrCode size={17} aria-hidden /> Ver su carné
            </button>
            <button
              type="button"
              onClick={() => {
                club.deshacerCobro(cobro);
                setCobro(null);
              }}
              className="inline-flex min-h-11 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/30 px-3 text-[0.9rem] font-bold"
            >
              <Undo2 size={17} aria-hidden /> Deshacer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
