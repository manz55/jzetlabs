import { useState } from "react";
import { Check, CircleCheck, Landmark } from "lucide-react";
import { codigo, faltaEfectivo, hora, qz, quien, renglones, totalDe, type Feria, type Pago, type Ticket } from "./datos";
import { Efectivo } from "./Efectivo";
import { BadgeEntrega } from "./Piezas";

export function PorConfirmar({ feria }: { feria: Feria }) {
  const [aviso, setAviso] = useState("");

  function confirmar(t: Ticket, pago: Pago) {
    feria.confirmarPago(t.numero, pago);
    const vuelto = pago.tipo === "efectivo" ? pago.recibido - totalDe(t.items) : 0;
    setAviso(`${codigo(t.numero)} confirmado${vuelto ? `, entrega ${qz(vuelto)} de vuelto` : ""}. Ya está en cocina.`);
  }

  function anular(t: Ticket) {
    feria.anular(t.numero);
    setAviso(`${codigo(t.numero)} anulado. Sus porciones volvieron a la carta.`);
  }

  return (
    <section aria-labelledby="tf-por-confirmar" className="rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] p-4">
      <h2 id="tf-por-confirmar" className="flex flex-wrap items-center gap-2 text-lg font-extrabold">
        Por confirmar en caja
        <span className="rounded-full bg-[#F59E0B] px-2.5 py-0.5 text-sm text-[#18181B]">{feria.porConfirmar.length}</span>
      </h2>
      <p role="status" className={aviso ? "mt-3 flex items-start gap-2 rounded-xl bg-[#DCFCE7] px-4 py-3 text-sm font-bold text-[#166534]" : "sr-only"}>
        {aviso && <CircleCheck size={17} aria-hidden className="mt-0.5 shrink-0" />}
        {aviso}
      </p>
      {feria.porConfirmar.length === 0 ? (
        <p className="mt-2 text-sm font-semibold text-[#6B6560]">Aquí caen los pedidos que los vecinos envían desde su teléfono.</p>
      ) : (
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {feria.porConfirmar.map((t) => (
            <Solicitud key={t.numero} ticket={t} alConfirmar={(pago) => confirmar(t, pago)} alAnular={() => anular(t)} />
          ))}
        </ul>
      )}
    </section>
  );
}

function Solicitud({ ticket, alConfirmar, alAnular }: { ticket: Ticket; alConfirmar: (p: Pago) => void; alAnular: () => void }) {
  const [recibido, setRecibido] = useState("");
  const [anulando, setAnulando] = useState(false);
  const total = totalDe(ticket.items);
  const { pago } = ticket;
  const falta = pago.tipo === "efectivo" ? faltaEfectivo(total, recibido) : "";

  return (
    <li className="tf-tarjeta flex flex-col gap-3 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-lg font-extrabold text-[#18181B]">Pedido {codigo(ticket.numero)}</p>
        <p className="text-xs font-semibold text-[#6B6560]">{hora(ticket.fecha)}</p>
      </div>
      <p className="break-words font-bold text-[#18181B]">{quien(ticket)}</p>
      <BadgeEntrega entrega={ticket.entrega} casa={ticket.casa} />
      <ul className="font-semibold text-[#18181B]">
        {renglones(ticket.items).map((l) => (
          <li key={l.id}>
            {l.cantidad} × {l.nombre}
          </li>
        ))}
      </ul>
      <div className="mt-auto grid gap-3 border-t border-[#EAE2D8] pt-3">
        <p className="flex items-baseline justify-between font-bold text-[#18181B]">
          {pago.tipo === "efectivo" ? "Cobrar en efectivo" : "Transferencia"}
          <span className="text-3xl font-extrabold">{qz(total)}</span>
        </p>
        {pago.tipo === "efectivo" ? (
          <Efectivo id={`tf-paga-${ticket.numero}`} total={total} recibido={recibido} alCambiar={setRecibido} />
        ) : (
          <p className="flex items-center gap-2 rounded-xl bg-[#F9F5F0] px-4 py-3 text-sm font-bold text-[#18181B]">
            <Landmark size={17} aria-hidden className="shrink-0" /> {pago.banco} · {pago.boleta ? `comprobante ${pago.boleta}` : "sin número de comprobante"}
          </p>
        )}
        <button type="button" disabled={Boolean(falta)} onClick={() => alConfirmar(pago.tipo === "efectivo" ? { tipo: "efectivo", recibido: Number(recibido) } : pago)} className="tf-boton tf-verde !min-h-12">
          <Check size={18} aria-hidden /> {pago.tipo === "efectivo" ? "Confirmar pago" : "Ya vi el depósito, confirmar"}
        </button>
        {pago.tipo === "efectivo" && recibido && falta && <p className="text-center text-sm font-semibold text-[#B91C1C]">{falta}</p>}
        {anulando ? (
          <div className="flex gap-2">
            <button type="button" onClick={alAnular} className="tf-boton tf-rojo flex-1">
              Sí, anular
            </button>
            <button type="button" onClick={() => setAnulando(false)} className="tf-boton tf-linea flex-1">
              Conservar
            </button>
          </div>
        ) : (
          <button type="button" aria-label={`Anular el pedido ${codigo(ticket.numero)}`} onClick={() => setAnulando(true)} className="min-h-11 text-sm font-bold text-[#6B6560] underline hover:text-[#B91C1C]">
            Anular pedido
          </button>
        )}
      </div>
    </li>
  );
}
