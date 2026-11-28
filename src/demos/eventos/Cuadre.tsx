/* Cuadre del convivio: lo que vendió cada stand, sin sumar papelitos a mano. */
import { useState } from "react";
import { Check, Copy, Download, MessageCircle, Send } from "lucide-react";
import { CONVIVIO, MENU, PUESTOS, ahora, codigo, cuadre, dia, diaLargo, itemsDe, qz, totalDe, type Imperial, type Ticket } from "./datos";
import { ICONO_PUESTO, boton } from "./estilos";
import { Ventana } from "./Piezas";

type Fila = ReturnType<typeof cuadre>[number];
const suma = (filas: Fila[], k: "efectivo" | "transferencia" | "total") => filas.reduce((s, f) => s + f[k], 0);

function textoCierre(filas: Fila[], tickets: Ticket[]) {
  const faltan = tickets.filter((t) => PUESTOS.some((p) => itemsDe(t.items, p).length && !t.entregado[p])).length;
  return [
    `CASA IMPERIAL · Cierre de convivio`,
    `${CONVIVIO.nombre}, ${CONVIVIO.lugar}`,
    `${diaLargo(dia(0))}, ${ahora()} h`,
    "",
    ...filas.flatMap((f) => [
      `Stand ${f.puesto}: ${qz(f.total)}`,
      `  Efectivo ${qz(f.efectivo)} · Transferencia ${qz(f.transferencia)}`,
      `  ${f.vendidos.map((v) => `${v.n} × ${v.nombre}`).join(", ")}`,
      `  Órdenes: ${f.entregadas} ${f.entregadas === 1 ? "entregada" : "entregadas"}, ${f.pendientes} ${f.pendientes === 1 ? "pendiente" : "pendientes"}`,
    ]),
    "",
    `TOTAL VENDIDO: ${qz(suma(filas, "total"))}`,
    `Efectivo en caja: ${qz(suma(filas, "efectivo"))}`,
    `Transferencias: ${qz(suma(filas, "transferencia"))}`,
    `Tickets cobrados: ${tickets.length}${faltan ? ` (${faltan} con entrega pendiente)` : " (todos entregados)"}`,
  ].join("\n");
}

function descargar(tickets: Ticket[]) {
  const filas = [
    ["Ticket", "Hora", "Pago", "Stand", "Producto", "Cantidad", "Precio Q", "Subtotal Q", "Entregado"],
    ...tickets.flatMap((t) => itemsDe(t.items).map((i) => [codigo(t.n), t.hora, t.pago, i.puesto, MENU[i.id].nombre, i.n, i.precio, i.n * i.precio, t.entregado[i.puesto] ?? "Pendiente"])),
    ["Total", "", "", "", "", "", "", tickets.reduce((s, t) => s + totalDe(t.items), 0), ""],
  ];
  /* la marca inicial hace que Excel lea bien las tildes */
  const csv = "\uFEFF" + filas.map((f) => f.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `cierre-convivio-${dia(0)}.csv`;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function Cuadre({ imp }: { imp: Imperial }) {
  const [exportando, setExportando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const filas = cuadre(imp.tickets);
  const texto = exportando ? textoCierre(filas, imp.tickets) : "";

  const columnas: [string, (f: Fila) => string][] = [
    ["Órdenes", (f) => String(f.ordenes)],
    ["Entregadas", (f) => String(f.entregadas)],
    ["Pendientes", (f) => String(f.pendientes)],
    ["Efectivo", (f) => qz(f.efectivo)],
    ["Transferencia", (f) => qz(f.transferencia)],
    ["Vendido", (f) => qz(f.total)],
  ];

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl">
            {CONVIVIO.nombre} · {CONVIVIO.lugar}
          </h2>
          <p className="mt-1 text-sm text-[#6B625B]">Se actualiza solo con cada cobro y cada entrega.</p>
        </div>
        <button type="button" onClick={() => setExportando(true)} className={`${boton.bronce} !min-h-12 w-full sm:w-auto`}>
          <Send size={17} aria-hidden /> Exportar cierre / Enviar por WhatsApp
        </button>
      </div>

      <div className="mt-6 hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-right">
          <thead>
            <tr className="border-b-2 border-[#1C1917] text-sm text-[#57534E]">
              <th scope="col" className="py-3 pr-4 text-left font-bold">
                Stand
              </th>
              {columnas.map(([n]) => (
                <th key={n} scope="col" className="py-3 pl-4 font-bold">
                  {n}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => {
              const Icono = ICONO_PUESTO[f.puesto];
              return (
                <tr key={f.puesto} className="border-b border-[#EFE9E1]">
                  <th scope="row" className="py-5 pr-4 text-left">
                    <span className="flex items-center gap-2 font-bold text-[#1C1917]">
                      <Icono size={18} aria-hidden className="text-[#A16207]" /> {f.puesto}
                    </span>
                    <span className="mt-1 block text-sm font-normal text-[#6B625B]">{f.vendidos.map((v) => `${v.n} × ${v.nombre}`).join(" · ")}</span>
                  </th>
                  {columnas.map(([n, ver]) => (
                    <td key={n} className={`py-5 pl-4 ${n === "Vendido" ? "text-lg font-extrabold text-[#1C1917]" : n === "Pendientes" && f.pendientes ? "font-extrabold text-[#9F2F1E]" : "font-semibold"}`}>
                      {ver(f)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-[#F3EFEA] font-extrabold text-[#1C1917]">
              <th scope="row" className="rounded-l-lg px-3 py-4 text-left">
                Total del convivio
              </th>
              <td colSpan={3} className="py-4 pl-4 text-center text-sm font-semibold">
                {imp.tickets.length} tickets
              </td>
              <td className="py-4 pl-4">{qz(suma(filas, "efectivo"))}</td>
              <td className="py-4 pl-4">{qz(suma(filas, "transferencia"))}</td>
              <td className="rounded-r-lg py-4 pl-4 pr-3 text-xl">{qz(suma(filas, "total"))}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <ul className="mt-6 grid gap-4 md:hidden">
        {filas.map((f) => (
          <li key={f.puesto} className="rounded-xl border border-[#E4DDD3] p-4">
            <p className="flex items-baseline justify-between gap-3">
              <b className="text-[#1C1917]">Stand {f.puesto}</b>
              <b className="text-xl text-[#1C1917]">{qz(f.total)}</b>
            </p>
            <p className="mt-1 text-sm text-[#6B625B]">{f.vendidos.map((v) => `${v.n} × ${v.nombre}`).join(" · ")}</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {columnas.slice(0, 5).map(([n, ver]) => (
                <div key={n} className="flex justify-between gap-2 border-t border-[#EFE9E1] pt-2">
                  <dt>{n}</dt>
                  <dd className={`font-bold ${n === "Pendientes" && f.pendientes ? "text-[#9F2F1E]" : "text-[#1C1917]"}`}>{ver(f)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
        <li className="rounded-xl bg-[#1C1917] p-4 text-white">
          <p className="flex items-baseline justify-between gap-3">
            <b>Total del convivio</b>
            <b className="text-2xl">{qz(suma(filas, "total"))}</b>
          </p>
          <p className="mt-1 text-sm text-[#D6CCBF]">
            Efectivo {qz(suma(filas, "efectivo"))} · Transferencia {qz(suma(filas, "transferencia"))}
          </p>
        </li>
      </ul>

      {exportando && (
        <Ventana
          titulo="Cierre del convivio"
          alCerrar={() => {
            setExportando(false);
            setCopiado(false);
          }}
        >
          <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-[#F3EFEA] p-4 font-[inherit] text-sm text-[#1C1917]">{texto}</pre>
          <div className="mt-5 grid gap-3">
            <a href={`https://wa.me/?text=${encodeURIComponent(texto)}`} target="_blank" rel="noopener noreferrer" className={`${boton.bronce} !min-h-12`}>
              <MessageCircle size={17} aria-hidden /> Enviar por WhatsApp
            </a>
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => navigator.clipboard?.writeText(texto).then(() => setCopiado(true), () => {})} className={boton.linea}>
                {copiado ? <Check size={17} aria-hidden /> : <Copy size={17} aria-hidden />} {copiado ? "Texto copiado" : "Copiar texto"}
              </button>
              <button type="button" onClick={() => descargar(imp.tickets)} className={boton.linea}>
                <Download size={17} aria-hidden /> Descargar hoja (CSV)
              </button>
            </div>
          </div>
        </Ventana>
      )}
    </>
  );
}
