/* Panel Recepción: cifras del día, control de la talanquera y las acciones sobre cada socio. */
import { useState } from "react";
import { Banknote, Check, CircleAlert, Clock3, FileText, LogIn, Mail, MessageCircle, QrCode, Search, Users, Wallet } from "lucide-react";
import { fechaEn, grupoDe, planDe, qz, sedeDe, textoDias, type Club, type Grupo, type Socio } from "./datos";
import { Cobro } from "./Cobro";
import { Ficha } from "./Ficha";
import { Talanquera } from "./Talanquera";
import { AMBAR, ANCHO, BORDE, VERDE } from "./Piezas";

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

/* para buscar sin importar tildes ni mayúsculas */
const plano = (t: string) => t.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/* abre la pasarela de ese socio */
const enlacePago = (s: Socio) => `${location.origin}/demos/gimnasio/?socio=${s.id}#pagar`;

/* mensaje listo; WhatsApp pide escoger el chat antes de enviar */
function enlaceWhatsApp(s: Socio) {
  const plan = planDe(s.plan);
  const cuando = s.dias <= 0 ? `venció el ${fechaEn(s.dias)}` : `vence el ${fechaEn(s.dias)}`;
  const mensaje = `Hola ${s.nombre.split(" ")[0]}, le saluda IronPeak. Su ${plan.nombre} ${cuando}. Monto a pagar: ${qz(plan.precio)}. Puede pagar en línea aquí: ${enlacePago(s)}`;
  return `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
}

function enlaceCorreo(s: Socio) {
  const plan = planDe(s.plan);
  const asunto = `Estado de su membresía IronPeak · N.º ${s.id}`;
  const cuerpo = [
    `Estimado(a) ${s.nombre}:`,
    "",
    `Le compartimos el estado de su membresía.`,
    "",
    `Plan: ${plan.nombre}`,
    `Fecha de corte: ${fechaEn(s.dias, true)}`,
    `Estado: ${s.dias <= 0 ? "mensualidad pendiente de pago" : "próxima a vencer"}`,
    `Monto a pagar: ${qz(plan.precio)}`,
    "",
    `Puede pagar en línea en ${enlacePago(s)} o en recepción.`,
    "",
    "Atentamente,",
    "Recepción · IronPeak Performance Club",
  ].join("\r\n");
  return `mailto:${encodeURIComponent(s.correo).replace("%40", "@")}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
}

export function Panel({ club, filtro, alFiltrar, alVer }: { club: Club; filtro: Filtro; alFiltrar: (f: Filtro) => void; alVer: (id: number) => void }) {
  const [busqueda, setBusqueda] = useState("");
  const [ventana, setVentana] = useState<{ tipo: "cobro" | "ficha"; id: number } | null>(null);

  const { socios } = club;
  const deben = socios.filter((s) => s.dias <= 0);
  const conTolerancia = deben.filter((s) => s.tolerancia).length;
  const porCobrar = deben.reduce((t, s) => t + planDe(s.plan).precio, 0);
  const cuantos = (f: Filtro) => (f === "todos" ? socios.length : socios.filter((s) => grupoDe(s) === f).length);
  const texto = plano(busqueda.trim());
  const lista = socios.filter((s) => (filtro === "todos" || grupoDe(s) === filtro) && plano(s.nombre).includes(texto));
  const abierto = ventana && socios.find((s) => s.id === ventana.id);

  const cifras = [
    { icono: Users, nombre: "Socios activos", valor: String(socios.length - deben.length), nota: "con mensualidad vigente" },
    { icono: LogIn, nombre: "Entradas hoy", valor: String(club.lecturas.filter((l) => l.resultado !== "rechazo").length), nota: "en las dos sedes" },
    { icono: CircleAlert, nombre: "Por cobrar / vencidos", valor: qz(porCobrar), nota: `${deben.length === 1 ? "1 socio debe" : `${deben.length} socios deben`}${conTolerancia ? ` · ${conTolerancia} con tolerancia` : ""}` },
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

        <Talanquera club={club} />

        <h2 className="mt-8 text-[1.35rem] font-extrabold">Socios</h2>
        <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
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
          <label className="relative block w-full min-w-0 xl:w-80">
            <span className="sr-only">Buscar socio por nombre</span>
            <Search size={18} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por nombre" className="min-h-12 w-full min-w-0 rounded-lg border border-slate-300 bg-white pl-11 pr-3 text-base text-[#0F172A] outline-none focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/30" />
          </label>
        </div>

        {lista.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
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
          <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-3">
            {lista.map((s) => {
              const grupo = grupoDe(s);
              const plan = planDe(s.plan);
              const debe = s.dias <= 0;
              const avisar = debe || grupo === "pronto";
              return (
                <li key={s.id} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
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
                      <span className={`rounded-full px-3 py-1 text-[0.8rem] font-extrabold ${ETIQUETA[grupo].clase}`}>{ETIQUETA[grupo].texto}</span>
                      <span className="text-[0.88rem] font-semibold text-slate-700">{textoDias(s.dias)}</span>
                      {s.entrada && <span className="text-[0.82rem] text-slate-500">Entró hoy {s.entrada}</span>}
                    </div>
                  </div>

                  {debe && s.notas[0] && <p className="mt-2 break-words rounded-lg bg-amber-50 px-3 py-2 text-[0.85rem] font-semibold text-amber-950">{s.notas[0].texto}</p>}

                  <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] [&>*]:!px-2 [&>*]:!text-[0.88rem]">
                    {debe && (
                      <button type="button" onClick={() => (s.tolerancia ? club.quitarTolerancia(s.id) : club.tolerar(s.id))} className={`${s.tolerancia ? BORDE : AMBAR} col-span-2 md:col-span-1`}>
                        <Clock3 size={18} aria-hidden className="shrink-0" /> {s.tolerancia ? "Quitar tolerancia" : "Pase de tolerancia (24h)"}
                      </button>
                    )}
                    <button type="button" onClick={() => setVentana({ tipo: "cobro", id: s.id })} className={`${VERDE} col-span-2 md:col-span-1`}>
                      <Banknote size={18} aria-hidden className="shrink-0" /> Registrar cobro
                    </button>
                    {avisar && (
                      <>
                        <a href={enlaceWhatsApp(s)} target="_blank" rel="noopener noreferrer" onClick={() => club.avisar(s.id, "whatsapp")} className={BORDE}>
                          {s.avisos.whatsapp ? <Check size={18} aria-label="ya abierto" className="shrink-0 text-[#15803D]" /> : <MessageCircle size={18} aria-hidden className="shrink-0 text-[#15803D]" />}
                          <span className="min-w-0">Cobrar por WhatsApp</span>
                        </a>
                        <a href={enlaceCorreo(s)} onClick={() => club.avisar(s.id, "correo")} className={BORDE}>
                          {s.avisos.correo ? <Check size={18} aria-label="ya abierto" className="shrink-0 text-[#15803D]" /> : <Mail size={18} aria-hidden className="shrink-0 text-[#15803D]" />}
                          <span className="min-w-0">Enviar estado por Email</span>
                        </a>
                      </>
                    )}
                    <button type="button" onClick={() => setVentana({ tipo: "ficha", id: s.id })} className={`${BORDE} col-span-2 md:col-span-1`}>
                      <FileText size={18} aria-hidden className="shrink-0" /> Ver / Editar ficha
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {abierto && ventana.tipo === "cobro" && <Cobro key={abierto.id} club={club} socio={abierto} alCerrar={() => setVentana(null)} alVer={() => alVer(abierto.id)} />}
      {abierto && ventana.tipo === "ficha" && <Ficha key={abierto.id} club={club} socio={abierto} alCerrar={() => setVentana(null)} alVer={() => alVer(abierto.id)} />}
    </div>
  );
}
