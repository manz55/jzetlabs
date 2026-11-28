import { useRef, useState } from "react";
import { CalendarPlus, Eye, Glasses, MessageCircle, PackageCheck, Stethoscope, Wallet } from "lucide-react";
import { fechaLarga, hoyIso } from "./agenda";
import { AgendaClinica } from "./AgendaClinica";
import { aroPorId, qz } from "./datos";
import { EditorRapido, type PestanaEditor } from "./Editor";
import type { ClinicaViva } from "./estado";
import { FormularioCita, type Seleccion } from "./FormularioCita";
import { Ventana } from "./Piezas";
import { enlaceWhatsApp } from "./recetas";

type Props = {
  clinica: ClinicaViva;
  activo: string;
  alElegir: (id: string) => void;
  alAvisar: (texto: string, alerta?: boolean) => void;
};

function AvisosDeLentes({ clinica }: { clinica: ClinicaViva }) {
  if (!clinica.listas.length) return <p>No hay lentes listos por entregar. Marca una orden como “Listos para entrega” y aparecerá aquí.</p>;
  return (
    <ul className="grid gap-3">
      {clinica.listas.map((o) => {
        const nombre = clinica.paciente(o.pacienteId)?.nombre ?? "";
        const saldo = o.total - o.abonado;
        const mensaje = `Hola, ${nombre.split(" ")[0]}. Tus lentes (aro ${aroPorId(o.aroId)?.nombre}, ${o.lente}, orden ${o.id}) ya están listos para entrega en CLARAVISTA, Plaza Médica zona 10. ${saldo ? `Saldo pendiente: ${qz(saldo)}.` : "Tu orden está pagada."} Horario: lunes a viernes 8:00 a 18:00 y sábado 8:00 a 13:00.`;
        return (
          <li key={o.id} className="rounded-2xl border border-[#E2E8F0] p-4">
            <p className="text-sm font-extrabold tabular-nums text-[#0F172A]">
              {nombre} · {o.id}
            </p>
            <p className="mt-2 rounded-xl bg-[#F1F5F9] p-3 text-sm">{mensaje}</p>
            <a href={enlaceWhatsApp(mensaje)} target="_blank" rel="noopener noreferrer" onClick={() => clinica.marcarAvisada(o.id)} className={`cv-boton mt-3 w-full ${o.avisada ? "cv-linea" : "cv-zafiro"}`}>
              <MessageCircle size={17} aria-hidden /> {o.avisada ? "Avisado · enviar de nuevo" : "Abrir WhatsApp"}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function Panel({ clinica, activo, alElegir, alAvisar }: Props) {
  const [ventana, setVentana] = useState<"cita" | "avisos" | null>(null);
  const [pestana, setPestana] = useState<PestanaEditor>("graduacion");
  const [enfoque, setEnfoque] = useState(0);
  const [seleccion, setSeleccion] = useState<Seleccion>({ servicio: "visual", area: "" });
  const editor = useRef<HTMLElement>(null);

  const kpis = [
    { texto: "Consultas hoy", valor: String(clinica.kpis.consultas), icono: Stethoscope },
    { texto: "Lentes en taller óptico", valor: String(clinica.kpis.enTaller), icono: Glasses },
    { texto: "Cobrado hoy (Q)", valor: qz(clinica.kpis.cobrado), icono: Wallet },
    { texto: "Lentes listos para entrega", valor: String(clinica.kpis.listas), icono: PackageCheck },
  ];

  const mostrarEditor = () => editor.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });

  function elegirDeAgenda(id: string, tipo: "cita" | "orden") {
    alElegir(id);
    setEnfoque(0);
    setPestana(tipo === "orden" ? "entrega" : "graduacion");
    if (!matchMedia("(min-width: 80rem)").matches) mostrarEditor();
  }

  function actualizarGraduacion() {
    setPestana("graduacion");
    setEnfoque((n) => n + 1);
    mostrarEditor();
  }

  return (
    <div className="cv-ancho !max-w-[90rem] py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Panel Clínica y Taller</h1>
          <p className="text-sm first-letter:uppercase">{fechaLarga(hoyIso())}</p>
        </div>
        <div role="group" aria-label="Atajos rápidos" className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap">
          <button type="button" onClick={() => setVentana("cita")} className="cv-boton cv-zafiro">
            <CalendarPlus size={17} aria-hidden className="shrink-0" /> Nueva cita en recepción
          </button>
          <button type="button" onClick={actualizarGraduacion} className="cv-boton cv-linea">
            <Eye size={17} aria-hidden className="shrink-0" /> Actualizar graduación OD/OI
          </button>
          <button type="button" onClick={() => setVentana("avisos")} className="cv-boton cv-linea">
            <MessageCircle size={17} aria-hidden className="shrink-0" /> Notificar lentes listos por WhatsApp
          </button>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-6">
        {kpis.map(({ texto, valor, icono: Icono }) => (
          <div key={texto} className="min-w-0 rounded-2xl bg-[#F1F5F9] p-4 xl:p-5">
            <dt className="flex items-start justify-between gap-2 text-xs font-bold leading-snug text-[#475569]">
              {texto}
              <Icono size={17} aria-hidden className="shrink-0 text-[#1E3A8A]" />
            </dt>
            <dd className="mt-1 text-3xl font-extrabold tabular-nums text-[#0F172A]">{valor}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <AgendaClinica clinica={clinica} activo={activo} alElegir={elegirDeAgenda} alAvisar={alAvisar} />
        </div>
        <aside ref={editor} aria-label="Editor rápido de graduación y entrega" className="min-w-0 scroll-mt-36 xl:sticky xl:top-20 xl:col-span-4 xl:max-h-[calc(100dvh-6rem)] xl:self-start xl:overflow-y-auto">
          <EditorRapido
            clinica={clinica}
            activo={activo}
            pestana={pestana}
            enfoque={enfoque}
            alElegir={(id) => {
              setEnfoque(0);
              alElegir(id);
            }}
            alPestana={(p) => {
              setEnfoque(0);
              setPestana(p);
            }}
            alAvisar={alAvisar}
          />
        </aside>
      </div>

      {ventana === "cita" && (
        <Ventana titulo="Nueva cita en recepción" alCerrar={() => setVentana(null)}>
          <FormularioCita
            clinica={clinica}
            seleccion={seleccion}
            alSeleccionar={setSeleccion}
            origen="recepcion"
            alAgendar={(cita) => {
              alElegir(cita.pacienteId);
              setVentana(null);
              alAvisar("Cita registrada. Ya aparece en la agenda y en Mi Receta Visual.");
            }}
          />
        </Ventana>
      )}
      {ventana === "avisos" && (
        <Ventana titulo="Lentes listos por avisar" alCerrar={() => setVentana(null)}>
          <AvisosDeLentes clinica={clinica} />
        </Ventana>
      )}
    </div>
  );
}
