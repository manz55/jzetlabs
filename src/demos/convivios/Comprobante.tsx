import { ArrowRight, CircleCheck, CircleX, Clock } from "lucide-react";
import { STANDS, codigo, hora, qz, quien, renglones, standsDe, totalDe, type Rol, type Ticket } from "./datos";
import { BadgeEntrega } from "./Piezas";

export function Comprobante({ ticket, rol, alSiguiente, alDespacho }: { ticket: Ticket; rol: Rol; alSiguiente: () => void; alDespacho: () => void }) {
  const total = totalDe(ticket.items);
  const { pago, estado } = ticket;
  const cabecera = {
    porConfirmar: { titulo: "Por confirmar en caja", icono: Clock, color: "bg-[#F59E0B] text-[#18181B]" },
    pagado: { titulo: `Pagado · ${hora(ticket.fecha)}`, icono: CircleCheck, color: "bg-[#15803D] text-white" },
    anulado: { titulo: "Anulado en caja", icono: CircleX, color: "bg-[#B91C1C] text-white" },
  }[estado];
  const indicacion = {
    porConfirmar:
      pago.tipo === "efectivo"
        ? `Paga ${qz(total)} en Caja Central. Tu orden entra a cocina cuando caja lo confirme.`
        : "Muestra tu comprobante en Caja Central. Tu orden entra a cocina cuando caja confirme la transferencia.",
    pagado: rol === "vecino" ? "Caja confirmó tu pago: la orden ya está en cocina." : "",
    anulado: "Este pedido no entró a cocina. Acércate a Caja Central o haz uno nuevo.",
  }[estado];
  const Icono = cabecera.icono;

  return (
    <div role="status" className="tf-tarjeta overflow-hidden">
      <div className={`px-5 py-4 ${cabecera.color}`}>
        <p className="flex items-center gap-2 text-sm font-extrabold">
          <Icono size={18} aria-hidden /> {cabecera.titulo}
        </p>
        <p className="mt-1 text-4xl font-extrabold">{codigo(ticket.numero)}</p>
        <p className="break-words font-semibold">{quien(ticket)}</p>
      </div>
      <div className="border-t-2 border-dashed border-[#D9CFC3] p-5">
        {indicacion && <p className="mb-4 rounded-xl bg-[#F9F5F0] px-4 py-3 text-sm font-bold text-[#18181B]">{indicacion}</p>}
        <BadgeEntrega entrega={ticket.entrega} casa={ticket.casa} className="mb-4" />
        {standsDe(ticket).map((stand) => (
          <div key={stand} className="mb-3">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#B91C1C]">
              {ticket.entrega === "casa" ? "Sale de" : "Retira en"} {STANDS[stand].nombre}
            </p>
            <ul>
              {renglones(ticket.items)
                .filter((l) => l.stand === stand)
                .map((l) => (
                  <li key={l.id} className="flex justify-between gap-3 py-0.5 font-semibold text-[#18181B]">
                    <span>
                      {l.cantidad} × {l.nombre}
                    </span>
                    <span>{qz(l.cantidad * l.precio)}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
        <dl className="border-t border-[#EAE2D8] pt-3 text-sm">
          <div className="flex justify-between text-xl font-extrabold text-[#18181B]">
            <dt>Total</dt>
            <dd>{qz(total)}</dd>
          </div>
          {pago.tipo === "transferencia" ? (
            <div className="mt-1 flex justify-between gap-3">
              <dt>Transferencia {pago.banco}</dt>
              <dd className="font-bold">{pago.boleta || "Sin número"}</dd>
            </div>
          ) : estado === "pagado" ? (
            <>
              <div className="mt-1 flex justify-between">
                <dt>Efectivo recibido</dt>
                <dd className="font-bold">{qz(pago.recibido)}</dd>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-[#15803D]">
                <dt>Entrega de vuelto</dt>
                <dd>{qz(pago.recibido - total)}</dd>
              </div>
            </>
          ) : (
            <div className="mt-1 flex justify-between">
              <dt>Forma de pago</dt>
              <dd className="font-bold">Efectivo</dd>
            </div>
          )}
        </dl>
        <button type="button" onClick={alSiguiente} className="tf-boton tf-rojo mt-5 !min-h-12 w-full">
          {rol === "vecino" ? "Hacer otro pedido" : "Cobrar al siguiente"}
        </button>
        {rol === "caja" && (
          <button type="button" onClick={alDespacho} className="tf-boton tf-linea mt-2 w-full">
            Verla en los stands <ArrowRight size={16} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
