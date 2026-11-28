import { Fragment, useEffect, useState } from "react";
import { Banknote, Check, CircleDollarSign, Copy, Landmark, PackagePlus, ReceiptText, Smartphone, TicketCheck } from "lucide-react";
import { CONVIVIO, STANDS, diaLargo, qz, reporteWhatsApp, resumen, type Feria, type Filtro } from "./datos";
import { FiltroStands } from "./Piezas";

async function copiar(texto: string) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const caja = document.createElement("textarea");
    caja.value = texto;
    document.body.appendChild(caja);
    caja.select();
    const copiado = document.execCommand("copy");
    caja.remove();
    return copiado;
  }
}

export function Cierre({ feria, alCaja, alDespacho, alStock }: { feria: Feria; alCaja: () => void; alDespacho: () => void; alStock: () => void }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [copia, setCopia] = useState<"" | "lista" | "fallo">("");
  const r = resumen(feria);
  const reporte = reporteWhatsApp(feria);
  const visibles = r.stands.filter((s) => filtro === "todos" || s.id === filtro);
  const sumar = (campo: "iniciales" | "vendidas" | "sobrantes" | "total") => visibles.reduce((s, x) => s + x[campo], 0);

  useEffect(() => {
    if (!copia) return;
    const t = window.setTimeout(() => setCopia(""), 3500);
    return () => window.clearTimeout(t);
  }, [copia]);

  const enviar = async () => setCopia((await copiar(reporte)) ? "lista" : "fallo");

  const botonCopiar = (
    <button type="button" onClick={enviar} className="tf-boton tf-verde">
      {copia === "lista" ? <Check size={17} aria-hidden /> : <Copy size={17} aria-hidden />}
      {copia === "lista" ? "Reporte copiado" : "Copiar reporte de cierre para WhatsApp"}
    </button>
  );

  const indicadores = [
    { nombre: "Total recaudado", valor: qz(r.total), nota: `${r.cobrados} tickets cobrados`, icono: CircleDollarSign },
    { nombre: "Efectivo en caja", valor: qz(r.efectivo), nota: "Debe coincidir al contar", icono: Banknote },
    { nombre: "Transferencias BI/BAC", valor: qz(r.bi + r.bac), nota: `BI ${qz(r.bi)} · BAC ${qz(r.bac)}`, icono: Landmark },
    { nombre: "Tickets despachados", valor: `${r.entregados} de ${r.cobrados}`, nota: r.pendientes ? `${r.pendientes} pendientes` : "Ninguno pendiente", icono: TicketCheck },
  ];

  return (
    <div className="tf-ancho !max-w-[90rem] py-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold sm:text-3xl">Cierre del Evento</h1>
          <p className="mt-1 text-sm font-semibold text-[#6B6560] first-letter:uppercase">
            {diaLargo()} · cuadre para la junta directiva de {CONVIVIO.lugar}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={alCaja} className="tf-boton tf-linea">
            <ReceiptText size={16} aria-hidden /> Mesa de Cobros
          </button>
          <button type="button" onClick={alDespacho} className="tf-boton tf-linea">
            <Smartphone size={16} aria-hidden /> Despacho
            {r.pendientes > 0 && <span className="tf-cuenta">{r.pendientes}</span>}
          </button>
          <button type="button" onClick={alStock} className="tf-boton tf-linea">
            <PackagePlus size={16} aria-hidden /> Sumar stock
          </button>
        </div>
      </div>

      <dl className="mt-5 grid gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
        {indicadores.map(({ nombre, valor, nota, icono: Icono }) => (
          <div key={nombre} className="min-w-0 rounded-2xl bg-[#F9F5F0] p-5">
            <dt className="flex items-center justify-between gap-2 text-sm font-bold text-[#52525B]">
              {nombre}
              <Icono size={18} aria-hidden className="shrink-0 text-[#B91C1C]" />
            </dt>
            <dd className="mt-2 text-3xl font-extrabold text-[#18181B]">{valor}</dd>
            <dd className="mt-1 text-xs font-semibold text-[#6B6560]">{nota}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-12">
        <section aria-labelledby="tf-liquidacion" className="tf-tarjeta p-4 sm:p-6 xl:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="tf-liquidacion" className="text-xl font-extrabold">Liquidación por Stand</h2>
            <FiltroStands actual={filtro} alElegir={setFiltro} etiqueta="Filtrar la liquidación por puesto" />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-[#18181B] text-[#18181B]">
                  <th scope="col" className="py-2 pr-2 font-extrabold">Puesto y producto</th>
                  <th scope="col" className="px-1.5 py-2 text-right font-extrabold sm:px-3">
                    <abbr title="Iniciales" className="no-underline sm:hidden">Inic.</abbr>
                    <span className="max-sm:sr-only">Iniciales</span>
                  </th>
                  <th scope="col" className="px-1.5 py-2 text-right font-extrabold sm:px-3">
                    <abbr title="Vendidas" className="no-underline sm:hidden">Vend.</abbr>
                    <span className="max-sm:sr-only">Vendidas</span>
                  </th>
                  <th scope="col" className="px-1.5 py-2 text-right font-extrabold sm:px-3">
                    <abbr title="Sobrantes" className="no-underline sm:hidden">Sobr.</abbr>
                    <span className="max-sm:sr-only">Sobrantes</span>
                  </th>
                  <th scope="col" className="py-2 pl-1.5 text-right font-extrabold sm:pl-3">Vendido</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((s) => (
                  <Fragment key={s.id}>
                    <tr className="bg-[#F9F5F0] font-extrabold text-[#18181B]">
                      <th scope="row" className="rounded-l-lg py-2.5 pl-2 pr-2">{STANDS[s.id].nombre}</th>
                      <td className="px-1.5 py-2.5 text-right sm:px-3">{s.iniciales}</td>
                      <td className="px-1.5 py-2.5 text-right sm:px-3">{s.vendidas}</td>
                      <td className="px-1.5 py-2.5 text-right sm:px-3">{s.sobrantes}</td>
                      <td className="rounded-r-lg py-2.5 pl-1.5 pr-2 text-right sm:pl-3">{qz(s.total)}</td>
                    </tr>
                    {s.productos.map((p) => (
                      <tr key={p.id} className="border-b border-[#F1EAE1]">
                        <th scope="row" className="py-2.5 pl-4 pr-2 font-semibold">{p.nombre}</th>
                        <td className="px-1.5 py-2.5 text-right sm:px-3">{p.iniciales}</td>
                        <td className="px-1.5 py-2.5 text-right sm:px-3">{p.vendidas}</td>
                        <td className={`px-1.5 py-2.5 text-right sm:px-3 ${p.sobrantes ? "" : "font-extrabold text-[#B91C1C]"}`}>{p.sobrantes || "Agotado"}</td>
                        <td className="py-2.5 pl-1.5 pr-2 text-right font-bold text-[#18181B] sm:pl-3">{qz(p.total)}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#18181B] text-sm font-extrabold text-[#18181B] sm:text-base">
                  <th scope="row" className="py-3 pl-2 pr-2">{filtro === "todos" ? "Total del evento" : "Total del puesto"}</th>
                  <td className="px-1.5 py-3 text-right sm:px-3">{sumar("iniciales")}</td>
                  <td className="px-1.5 py-3 text-right sm:px-3">{sumar("vendidas")}</td>
                  <td className="px-1.5 py-3 text-right sm:px-3">{sumar("sobrantes")}</td>
                  <td className="py-3 pl-1.5 pr-2 text-right text-[#15803D] sm:pl-3">{qz(sumar("total"))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-3 text-xs font-semibold text-[#6B6560]">Iniciales incluye lo que cada puesto sumó durante el evento.</p>
        </section>

        <section aria-labelledby="tf-reporte" className="tf-tarjeta grid gap-4 p-5 xl:col-span-4">
          <h2 id="tf-reporte" className="text-xl font-extrabold">Reporte para la directiva</h2>
          {botonCopiar}
          <p role="status" className={copia === "fallo" ? "text-sm font-bold text-[#B91C1C]" : "sr-only"}>
            {copia === "fallo" ? "No se pudo copiar. Selecciona el texto de abajo y cópialo." : copia === "lista" ? "Reporte copiado al portapapeles." : ""}
          </p>
          <pre tabIndex={0} aria-label="Vista previa del mensaje" className="max-h-[26rem] overflow-y-auto whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-[#DCF8C6] p-4 font-[inherit] text-[0.82rem] leading-relaxed text-[#111B21]">{reporte}</pre>
        </section>
      </div>
    </div>
  );
}
