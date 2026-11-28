import { CircleAlert, CircleCheck, Copy, Download, MessageCircle, ShieldCheck } from "lucide-react";
import { fechaCorta, folioTexto, nombreServicio, type Cita, type Paciente } from "./datos";
import { enlaceWhatsApp, filasDeInforme, resumenInforme } from "./expediente";
import { LogoMarca } from "./Piezas";

export function HojaDeInforme({ cita, paciente }: { cita: Cita; paciente: Paciente }) {
  const filas = filasDeInforme(cita, paciente);
  const fuera = filas.filter((f) => f.fuera).length;
  const datos = [
    ["Paciente", paciente.nombre],
    ["Edad y sexo", `${paciente.edad} años · ${paciente.sexo === "F" ? "Mujer" : "Hombre"}`],
    ["Orden", folioTexto(cita.folio)],
    ["Toma de muestra", `${fechaCorta(cita.fecha)}, ${cita.hora}`],
  ];

  return (
    <article className="min-w-0">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <LogoMarca />
        <div className="text-right">
          <h3 className="text-lg">Informe Clínico Digital</h3>
          <p className="text-sm font-bold text-[#1D4ED8]">{nombreServicio(cita.servicioId)}</p>
        </div>
      </header>
      <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#EFF6FF] p-4 text-sm sm:grid-cols-4 print:grid-cols-4">
        {datos.map(([nombre, valor]) => (
          <div key={nombre} className="min-w-0">
            <dt className="text-xs">{nombre}</dt>
            <dd className="font-bold text-[#0F172A]">{valor}</dd>
          </div>
        ))}
      </dl>

      <table className="mt-4 w-full text-left text-sm">
        <thead className="max-sm:sr-only">
          <tr className="border-b border-[#CBD5E1] text-xs">
            <th scope="col" className="py-2 pr-3 font-bold">Parámetro</th>
            <th scope="col" className="py-2 pr-3 font-bold">Resultado</th>
            <th scope="col" className="py-2 pr-3 font-bold">Referencia</th>
            <th scope="col" className="py-2 font-bold">Estado</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.id} className="border-b border-[#E2E8F0] max-sm:grid max-sm:grid-cols-2 max-sm:gap-x-3 max-sm:py-3 print:table-row">
              <th scope="row" className="font-bold text-[#0F172A] sm:py-3 sm:pr-3">{f.nombre}</th>
              <td className="max-sm:text-right sm:py-3 sm:pr-3">
                <span className={`text-base font-extrabold ${f.fuera ? "text-[#B45309]" : "text-[#0F172A]"}`}>{f.valor}</span> <span className="text-xs">{f.unidad}</span>
              </td>
              <td className="text-xs sm:py-3 sm:pr-3 sm:text-sm">
                <span className="sm:hidden">Referencia </span>
                {f.referencia}
              </td>
              <td className="max-sm:text-right sm:py-3">
                <span className={`cm-estado ${f.fuera ? "cm-analisis" : "cm-listo"}`}>
                  {f.fuera ? <CircleAlert size={13} aria-hidden /> : <CircleCheck size={13} aria-hidden />}
                  {f.fuera ? "Fuera de rango" : "Normal"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-sm">
        {fuera ? `${fuera} de ${filas.length} parámetros fuera de rango. Revíselos con su médico.` : "Todos los parámetros dentro del rango de referencia."}
      </p>
      {cita.informe && (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-3 text-sm text-[#166534]">
          <ShieldCheck size={18} aria-hidden className="shrink-0" />
          <span>
            <strong>Validado por {cita.informe.validadoPor}</strong>
            <br />
            {fechaCorta(cita.informe.fecha)}, {cita.informe.hora}
          </span>
        </p>
      )}
    </article>
  );
}

export function Informe({ cita, paciente, alAvisar, alDescargar }: { cita: Cita; paciente: Paciente; alAvisar: (texto: string, alerta?: boolean) => void; alDescargar: () => void }) {
  async function copiar() {
    try {
      await navigator.clipboard.writeText(resumenInforme(cita, paciente));
      alAvisar("Resumen copiado.");
    } catch {
      alAvisar("No se pudo copiar. Use el botón de WhatsApp.", true);
    }
  }

  return (
    <div className="border-t border-[#DBE4F0] p-4 sm:p-6">
      <HojaDeInforme cita={cita} paciente={paciente} />
      <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
        <button type="button" onClick={copiar} className="cm-boton cm-linea">
          <Copy size={16} aria-hidden /> Copiar resumen
        </button>
        <a href={enlaceWhatsApp(resumenInforme(cita, paciente))} target="_blank" rel="noopener noreferrer" className="cm-boton cm-verde">
          <MessageCircle size={16} aria-hidden /> Enviar por WhatsApp
        </a>
        <button type="button" onClick={alDescargar} className="cm-boton cm-linea">
          <Download size={16} aria-hidden /> Descargar informe
        </button>
      </div>
    </div>
  );
}
