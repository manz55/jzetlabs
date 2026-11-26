/* Selector de cantidad: se puede tocar o escribir (nadie quiere dar 315 toques para pedir block). */
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Producto } from "./datos";

export default function Cantidad({ p, valor, alCambiar, min = 1 }: { p: Producto; valor: number; alCambiar: (n: number) => void; min?: number }) {
  /* mientras escribe se permite dejar el campo vacío */
  const [borrador, setBorrador] = useState<string | null>(null);
  const paso = "grid h-12 w-11 shrink-0 place-items-center text-[#0F172A] hover:bg-slate-100 disabled:opacity-30";
  const poner = (n: number) => alCambiar(Math.max(min, Math.min(n, p.hay)));
  return (
    <div className="inline-flex shrink-0 items-center overflow-hidden rounded-lg border border-slate-300 bg-white">
      <button type="button" className={paso} aria-label={`Quitar uno de ${p.nombre}`} disabled={valor <= min} onClick={() => poner(valor - 1)}>
        <Minus size={16} />
      </button>
      <input
        className="ik-num h-12 w-14 border-x border-slate-200 bg-white text-center text-[1rem] font-bold text-[#0F172A]"
        inputMode="numeric"
        aria-label={`Cantidad de ${p.nombre}`}
        value={borrador ?? valor}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          const t = e.target.value.replace(/\D/g, "");
          const v = Math.min(Number(t), p.hay);
          setBorrador(t === "" ? "" : String(v));
          if (v >= Math.max(min, 1)) alCambiar(v);
        }}
        onBlur={() => {
          if (borrador === "0") poner(0);
          setBorrador(null);
        }}
      />
      <button type="button" className={paso} aria-label={`Agregar uno de ${p.nombre}`} disabled={valor >= p.hay} onClick={() => poner(valor + 1)}>
        <Plus size={16} />
      </button>
    </div>
  );
}
