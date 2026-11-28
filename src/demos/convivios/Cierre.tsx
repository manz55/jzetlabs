import { Fragment, useEffect, useState } from "react";
import { Banknote, Check, ChefHat, CircleCheck, CircleDollarSign, Copy, Landmark, PackagePlus, ReceiptText, TicketCheck } from "lucide-react";
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

const COLUMNAS = ["Iniciales", "Vendidas", "Sobrantes", "Efectivo", "Transferencia", "Total"];

export function Cierre({ feria, alCaja, alDespacho, alStock }: { feria: Feria; alCaja: () => void; alDespacho: () => void; alStock: () => void }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [copia, setCopia] = useState<"" | "lista" | "fallo">("");
  const r = resumen(feria);
  const reporte = reporteWhatsApp(feria);
  const transferencias = r.bi + r.bac;
  const visibles = r.stands.filter((s) => filtro === "todos" || s.id === filtro);
  const sumar = (campo: "iniciales" | "vendidas" | "sobrantes" | "efectivo" | "transferencia" | "total") => visibles.reduce((s, x) => s + x[campo], 0);

  useEffect(() => {
    if (copia !== "lista") return;
    const t = window.setTimeout(() => setCopia(""), 5000);
    return () => window.clearTimeout(t);
  }, [copia]);

  const enviar = async () => setCopia((await copiar(reporte)) ? "lista" : "fallo");

  const indicadores = [
    { nombre: "Efectivo en caja", valor: qz(r.efectivo), nota: "Debe coincidir al contar", icono: Banknote },
    { nombre: "Transferencias BI/BAC", valor: qz(transferencias), nota: `BI ${qz(r.bi)} · BAC ${qz(r.bac)}`, icono: Landmark },
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
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <button type="button" onClick={alCaja} className="tf-boton tf-linea">
            <ReceiptText size={16} aria-hidden /> Hacer Pedido / Caja
          </button>
          <button type="button" onClick={alDespacho} className="tf-boton tf-linea">
            <ChefHat size={16} aria-hidden /> Vista de Stands
            {r.pendientes > 0 && <span className="tf-cuenta">{r.pendientes}</span>}
          </button>
          <button type="button" onClick={alStock} className="tf-boton tf-linea">
            <PackagePlus size={16} aria-hidden /> Cargar porciones
          </button>
          <button type="button" onClick={enviar} className="tf-boton tf-verde !min-h-12 max-sm:order-first max-sm:w-full">
            {copia === "lista" ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />}
            {copia === "lista" ? "Reporte copiado" : "Copiar reporte de cierre para WhatsApp"}
          </button>
        </div>
      </div>

      <div role="status">
        {copia === "lista" && (
          <p className="mt-4 flex items-center gap-2.5 rounded-xl border border-[#86EFAC] bg-[#DCFCE7] px-4 py-3 text-sm font-bold text-[#166534]">
            <CircleCheck size={19} aria-hidden className="shrink-0" /> Listo: el resumen quedó copiado. Pégalo en el grupo de la junta directiva.
          </p>
        )}
        {copia === "fallo" && <p className="mt-4 rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm font-bold text-[#B91C1C]">No se pudo copiar. Selecciona el texto del mensaje y cópialo.</p>}
      </div>

      {r.porConfirmar > 0 && (
        <p className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#F59E0B] bg-[#FEF3C7] px-4 py-2 text-sm font-bold text-[#78350F]">
          <span>
            {r.porConfirmar === 1 ? "1 pedido por confirmar" : `${r.porConfirmar} pedidos por confirmar`} en caja ({qz(r.montoPorConfirmar)}): todavía no cuentan en el cierre.
          </span>
          <button type="button" onClick={alCaja} className="min-h-11 underline">
            Ir a confirmarlos
          </button>
        </p>
      )}

      <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
        <div className="min-w-0 rounded-2xl bg-[#18181B] p-4 text-white lg:p-5">
          <dt className="flex items-start justify-between gap-2 text-sm font-bold text-white/75">
            Total recaudado
            <CircleDollarSign size={18} aria-hidden className="shrink-0" />
          </dt>
          <dd className="mt-2 text-2xl font-extrabold lg:text-3xl">{qz(r.total)}</dd>
          <dd className="mt-1 text-xs font-semibold text-white/65">{r.cobrados} tickets cobrados</dd>
        </div>
        {indicadores.map(({ nombre, valor, nota, icono: Icono }) => (
          <div key={nombre} className="tf-tarjeta p-4 lg:p-5">
            <dt className="flex items-start justify-between gap-2 text-sm font-bold text-[#52525B]">
              {nombre}
              <Icono size={18} aria-hidden className="shrink-0 text-[#B91C1C]" />
            </dt>
            <dd className="mt-2 text-2xl font-extrabold text-[#18181B] lg:text-3xl">{valor}</dd>
            <dd className="mt-1 text-xs font-semibold text-[#6B6560]">{nota}</dd>
          </div>
        ))}
        <div className="tf-tarjeta p-4 lg:p-5">
          <dt className="flex items-start justify-between gap-2 text-sm font-bold text-[#52525B]">
            Tickets despachados vs. pendientes
            <TicketCheck size={18} aria-hidden className="shrink-0 text-[#B91C1C]" />
          </dt>
          <dd className="mt-2 text-2xl font-extrabold lg:text-3xl">
            <span className="text-[#15803D]">{r.entregados}</span> <span className="text-base font-bold text-[#6B6560]">vs.</span> <span className={r.pendientes ? "text-[#B91C1C]" : "text-[#18181B]"}>{r.pendientes}</span>
          </dd>
          <dd className="mt-1 text-xs font-semibold text-[#6B6560]">{r.pendientes ? "Faltan órdenes por entregar" : "Todo entregado"}</dd>
        </div>
      </dl>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-12">
        <section aria-labelledby="tf-liquidacion" className="tf-tarjeta p-4 sm:p-6 xl:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="tf-liquidacion" className="text-xl font-extrabold">Liquidación por Stand</h2>
            <FiltroStands actual={filtro} alElegir={setFiltro} etiqueta="Filtrar la liquidación por puesto" />
          </div>
          <p className="mt-3 text-xs font-semibold text-[#6B6560] md:hidden">Desliza la tabla para ver efectivo, transferencia y total.</p>
          <div tabIndex={0} role="region" aria-labelledby="tf-liquidacion" className="mt-3 overflow-x-auto md:mt-4">
            <table className="w-full min-w-[42rem] border-collapse text-sm tabular-nums">
              <thead>
                <tr className="border-b-2 border-[#18181B] text-xs uppercase tracking-wide text-[#52525B]">
                  <th scope="col" className="sticky left-0 bg-white py-2.5 pl-2 pr-3 text-left font-extrabold">Puesto</th>
                  {COLUMNAS.map((c) => (
                    <th key={c} scope="col" className="px-2.5 py-2.5 text-right font-extrabold last:pr-3">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibles.map((s) => (
                  <Fragment key={s.id}>
                    <tr className="bg-[#F3EFEA] font-extrabold text-[#18181B]">
                      <th scope="row" className="sticky left-0 whitespace-nowrap bg-[#F3EFEA] py-3 pl-2 pr-3 text-left">{STANDS[s.id].nombre}</th>
                      <td className="px-2.5 py-3 text-right">{s.iniciales}</td>
                      <td className="px-2.5 py-3 text-right">{s.vendidas}</td>
                      <td className="px-2.5 py-3 text-right">{s.sobrantes}</td>
                      <td className="px-2.5 py-3 text-right">{qz(s.efectivo)}</td>
                      <td className="px-2.5 py-3 text-right">{qz(s.transferencia)}</td>
                      <td className="py-3 pl-2.5 pr-3 text-right">{qz(s.total)}</td>
                    </tr>
                    {s.productos.map((p) => (
                      <tr key={p.id} className="border-b border-[#F1EAE1]">
                        <th scope="row" className="sticky left-0 whitespace-nowrap bg-white py-2.5 pl-5 pr-3 text-left font-semibold">
                          {p.nombre}
                          {p.baja && <span className="ml-1.5 text-xs font-bold text-[#8A817A]">(de baja)</span>}
                        </th>
                        <td className="px-2.5 py-2.5 text-right">{p.iniciales}</td>
                        <td className="px-2.5 py-2.5 text-right">{p.vendidas}</td>
                        <td className={`px-2.5 py-2.5 text-right ${p.sobrantes ? "" : "font-extrabold text-[#B91C1C]"}`}>{p.sobrantes}</td>
                        <td className="px-2.5 py-2.5 text-right">{qz(p.efectivo)}</td>
                        <td className="px-2.5 py-2.5 text-right">{qz(p.transferencia)}</td>
                        <td className="py-2.5 pl-2.5 pr-3 text-right font-bold text-[#18181B]">{qz(p.total)}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#18181B] text-base font-extrabold text-[#18181B]">
                  <th scope="row" className="sticky left-0 whitespace-nowrap bg-white py-3.5 pl-2 pr-3 text-left">{filtro === "todos" ? "Total del evento" : "Total del puesto"}</th>
                  <td className="px-2.5 py-3.5 text-right">{sumar("iniciales")}</td>
                  <td className="px-2.5 py-3.5 text-right">{sumar("vendidas")}</td>
                  <td className="px-2.5 py-3.5 text-right">{sumar("sobrantes")}</td>
                  <td className="px-2.5 py-3.5 text-right">{qz(sumar("efectivo"))}</td>
                  <td className="px-2.5 py-3.5 text-right">{qz(sumar("transferencia"))}</td>
                  <td className="py-3.5 pl-2.5 pr-3 text-right text-[#15803D]">{qz(sumar("total"))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-3 text-xs font-semibold text-[#6B6560]">Iniciales es el total cargado a cada platillo en Gestión de Menú.</p>
        </section>

        <section aria-labelledby="tf-reporte" className="tf-tarjeta p-5 xl:col-span-4">
          <h2 id="tf-reporte" className="text-xl font-extrabold">Mensaje para la directiva</h2>
          <pre tabIndex={0} aria-label="Vista previa del mensaje" className={`mt-4 max-h-[28rem] overflow-y-auto whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-[#DCF8C6] p-4 font-[inherit] text-[0.82rem] leading-relaxed text-[#111B21] ${copia === "lista" ? "ring-2 ring-[#15803D]" : ""}`}>{reporte}</pre>
        </section>
      </div>
    </div>
  );
}
