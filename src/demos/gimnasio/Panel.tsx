/*
 * Panel Recepción en una sola pantalla: atajos arriba (Alt+1 a Alt+4), las cuatro cifras del día,
 * el directorio de socios a la izquierda y la talanquera con su bitácora a la derecha.
 */
import { useEffect, useState } from "react";
import { Banknote, CircleAlert, DoorOpen, LogIn, Send, UserPlus, Users, Wallet } from "lucide-react";
import { planDe, qz, type Club } from "./datos";
import { Cobro } from "./Cobro";
import { Directorio, type Filtro } from "./Directorio";
import { Ficha } from "./Ficha";
import { MOTIVOS, Talanquera } from "./Talanquera";
import { CobroRapido, Masivo, Mostrador } from "./VentanasAtajo";

export type { Filtro };

type Abierta = { tipo: "cobro" | "ficha"; id: number } | { tipo: "rapido" | "mostrador" | "masivo" } | null;

export function Panel({ club, filtro, alFiltrar, alVer }: { club: Club; filtro: Filtro; alFiltrar: (f: Filtro) => void; alVer: (id: number) => void }) {
  const [ventana, setVentana] = useState<Abierta>(null);
  const [motivo, setMotivo] = useState(MOTIVOS[0]);
  /* aviso de "puerta abierta", para quien no está viendo la barra lateral */
  const [abrio, setAbrio] = useState<{ motivo: string; vez: number } | null>(null);

  useEffect(() => {
    if (!abrio) return;
    const t = window.setTimeout(() => setAbrio(null), 4000);
    return () => window.clearTimeout(t);
  }, [abrio]);

  function abrir() {
    club.abrirManual(motivo);
    setAbrio((a) => ({ motivo, vez: (a?.vez ?? 0) + 1 }));
  }

  const { socios } = club;
  const deben = socios.filter((s) => s.dias <= 0);
  const conTolerancia = deben.filter((s) => s.tolerancia).length;
  const porCobrar = deben.reduce((t, s) => t + planDe(s.plan).precio, 0);

  const atajos = [
    { nombre: "Abrir talanquera ahora", icono: DoorOpen, clase: "border-[#0F172A] bg-[#0F172A] text-white hover:bg-[#1E293B]", accion: abrir },
    { nombre: "Cobro rápido", icono: Banknote, clase: "border-[#15803D] bg-[#15803D] text-white hover:bg-[#166534]", accion: () => setVentana({ tipo: "rapido" }) },
    { nombre: "Nuevo socio / Visita del día", icono: UserPlus, clase: "border-slate-300 bg-white text-[#0F172A] hover:border-[#0F172A]", accion: () => setVentana({ tipo: "mostrador" }) },
    { nombre: "Recordatorio masivo a vencidos", icono: Send, clase: "border-slate-300 bg-white text-[#0F172A] hover:border-[#0F172A]", accion: () => setVentana({ tipo: "masivo" }) },
  ];

  /* Alt+1 a Alt+4. Se usa la tecla física porque en Mac Opción+número escribe otro símbolo */
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.repeat) return;
      const cual = ["Digit1", "Digit2", "Digit3", "Digit4"].indexOf(e.code);
      if (cual < 0 || document.querySelector("dialog[open]")) return;
      e.preventDefault();
      atajos[cual].accion();
    };
    addEventListener("keydown", tecla);
    return () => removeEventListener("keydown", tecla);
  });

  const cifras = [
    { icono: Users, nombre: "Socios activos", valor: String(socios.length - deben.length), nota: "con mensualidad vigente" },
    { icono: LogIn, nombre: "Entradas hoy", valor: String(club.lecturas.filter((l) => l.resultado !== "rechazo").length), nota: "en las dos sedes" },
    { icono: CircleAlert, nombre: "Por cobrar / vencidos", valor: qz(porCobrar), nota: `${deben.length === 1 ? "1 socio debe" : `${deben.length} socios deben`}${conTolerancia ? ` · ${conTolerancia} con tolerancia` : ""}` },
    { icono: Wallet, nombre: "Ingresos del mes", valor: qz(club.ingresos), nota: "cobrado este mes" },
  ];

  const hoy = new Date().toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" });
  const delSocio = ventana && "id" in ventana ? socios.find((s) => s.id === ventana.id) : undefined;
  const cerrar = () => setVentana(null);

  return (
    <div className="bg-[#F8FAFC] pb-8 pt-4">
      <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="text-[1.5rem] font-extrabold leading-tight tracking-tight">Panel Recepción</h1>
          <p className="text-[0.88rem] text-slate-600 first-letter:uppercase">{hoy}</p>
        </div>

        <div role="group" aria-label="Atajos rápidos" className="mt-3 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-2 lg:grid-cols-[repeat(4,minmax(0,1fr))] lg:gap-3">
          {atajos.map(({ nombre, icono: Icono, clase, accion }, i) => (
            <button key={nombre} type="button" onClick={accion} aria-keyshortcuts={`Alt+${i + 1}`} title={`${nombre} (Alt+${i + 1}; en Mac, Opción+${i + 1})`} className={`flex min-h-12 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-xl border px-2.5 py-2 text-[0.82rem] font-bold leading-tight transition active:scale-[0.98] sm:justify-start sm:px-3 ${clase}`}>
              <Icono size={18} aria-hidden className="shrink-0" />
              <span className="min-w-0 sm:flex-1 sm:text-left">{nombre}</span>
              <kbd aria-hidden className="hidden shrink-0 rounded border border-current/30 px-1.5 py-0.5 font-sans text-[0.68rem] font-bold opacity-80 sm:inline-block">
                Alt+{i + 1}
              </kbd>
            </button>
          ))}
        </div>

        <dl className="mt-3 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-2 lg:grid-cols-[repeat(4,minmax(0,1fr))] lg:gap-3">
          {cifras.map(({ icono: Icono, nombre, valor, nota }) => (
            <div key={nombre} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
              <dt className="flex items-center gap-1.5 text-[0.76rem] font-bold leading-tight text-slate-600">
                <Icono size={15} aria-hidden className="shrink-0 text-[#15803D]" />
                {nombre}
              </dt>
              <dd className="mt-1 break-words text-[1.55rem] font-extrabold leading-none text-[#0F172A]">{valor}</dd>
              <dd className="mt-1 text-[0.72rem] leading-tight text-slate-500">{nota}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)] items-start gap-6 xl:grid-cols-12">
          <Directorio club={club} filtro={filtro} alFiltrar={alFiltrar} alCobrar={(id) => setVentana({ tipo: "cobro", id })} alFicha={(id) => setVentana({ tipo: "ficha", id })} alVer={alVer} />
          <Talanquera club={club} motivo={motivo} alMotivo={setMotivo} alAbrir={abrir} />
        </div>
      </div>

      <div role="status" className="pointer-events-none fixed inset-x-3 bottom-3 z-30 mx-auto max-w-sm">
        {abrio && (
          <p key={abrio.vez} className="flex items-center gap-3 rounded-xl bg-[#15803D] px-4 py-3 text-white shadow-2xl">
            <DoorOpen size={24} aria-hidden className="shrink-0" />
            <span className="min-w-0 text-[0.9rem]">
              <b className="block text-[1rem]">Talanquera abierta</b>
              {abrio.motivo}
            </span>
          </p>
        )}
      </div>

      {ventana?.tipo === "rapido" && <CobroRapido club={club} alElegir={(id) => setVentana({ tipo: "cobro", id })} alCerrar={cerrar} />}
      {ventana?.tipo === "mostrador" && <Mostrador club={club} alCerrar={cerrar} alVerFicha={(id) => setVentana({ tipo: "ficha", id })} />}
      {ventana?.tipo === "masivo" && <Masivo club={club} alCerrar={cerrar} />}
      {ventana?.tipo === "cobro" && delSocio && <Cobro key={delSocio.id} club={club} socio={delSocio} alCerrar={cerrar} alVer={() => alVer(delSocio.id)} />}
      {ventana?.tipo === "ficha" && delSocio && <Ficha key={delSocio.id} club={club} socio={delSocio} alCerrar={cerrar} alVer={() => alVer(delSocio.id)} />}
    </div>
  );
}
