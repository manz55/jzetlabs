import { BILLETE_MAYOR, qz } from "./datos";

export function Efectivo({ id, total, recibido, alCambiar }: { id: string; total: number; recibido: string; alCambiar: (v: string) => void }) {
  const vuelto = Number(recibido) - total;
  const cuadra = Boolean(total && recibido) && vuelto >= 0 && vuelto < BILLETE_MAYOR;
  return (
    <div>
      <label htmlFor={id} className="tf-rotulo">Paga con (Q)</label>
      <input id={id} inputMode="numeric" autoComplete="off" placeholder="Billete que entrega" value={recibido} onChange={(e) => alCambiar(e.target.value.replace(/\D/g, "").slice(0, 5))} className="tf-campo !text-xl" />
      <div className="mt-2 grid grid-cols-4 gap-2">
        <button type="button" disabled={!total} onClick={() => alCambiar(String(total))} className="tf-boton tf-linea !px-1">
          Exacto
        </button>
        {[50, 100, 200].map((b) => (
          <button key={b} type="button" onClick={() => alCambiar(String(b))} className="tf-boton tf-linea !px-1">
            Q{b}
          </button>
        ))}
      </div>
      <p aria-live="polite" className={`mt-3 flex items-baseline justify-between rounded-xl px-4 py-3 ${cuadra ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#F9F5F0] text-[#6B6560]"}`}>
        <span className="font-bold">Vuelto</span>
        <span className="text-2xl font-extrabold">{total && recibido && vuelto >= 0 ? qz(vuelto) : "Q0"}</span>
      </p>
    </div>
  );
}
