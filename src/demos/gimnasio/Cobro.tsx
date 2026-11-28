/* Registrar un cobro en recepción: periodo, forma de pago, recibo y, si hubo error, anularlo. */
import { useState, type FormEvent } from "react";
import { Banknote, CircleCheck, CreditCard, Landmark, QrCode, Undo2 } from "lucide-react";
import { montoDe, planDe, qz, textoDias, type Club, type Pago, type PeriodoId, type Socio } from "./datos";
import { Opciones, Periodos, Recibo } from "./Pago";
import { BORDE, CAMPO, ROTULO, VERDE, Ventana } from "./Piezas";

export function Cobro({ club, socio, alCerrar, alVer }: { club: Club; socio: Socio; alCerrar: () => void; alVer: () => void }) {
  const [periodo, setPeriodo] = useState<PeriodoId>("mes");
  const [metodo, setMetodo] = useState<"efectivo" | "pos" | "transferencia">("efectivo");
  const [numero, setNumero] = useState("");
  const [intento, setIntento] = useState(false);
  /* el recibo y el socio tal como estaba antes, para poder anular */
  const [hecho, setHecho] = useState<{ pago: Pago; antes: Socio } | null>(null);

  const falta = metodo === "transferencia" && numero.trim().length < 4;
  const monto = montoDe(socio.plan, periodo);

  function confirmar(e: FormEvent) {
    e.preventDefault();
    if (falta) {
      setIntento(true);
      return;
    }
    const n = numero.trim();
    const detalle = metodo === "efectivo" ? "Efectivo en recepción" : metodo === "pos" ? `POS en recepción${n ? `, voucher ${n}` : ""}` : `Boleta ${n}`;
    setHecho({ antes: socio, pago: club.cobrar(socio, { periodo, metodo, detalle }) });
  }

  if (hecho)
    return (
      <Ventana titulo="Cobro registrado" sub={socio.nombre} alCerrar={alCerrar}>
        <div role="status" className="mb-4 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-[#14532D]">
          <CircleCheck size={30} aria-hidden className="shrink-0" />
          <p className="min-w-0 font-bold">Carné activo hasta el {hecho.pago.hasta}.</p>
        </div>
        <Recibo socio={socio} pago={hecho.pago} />
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={alCerrar} className={`${VERDE} sm:col-span-2`}>
            Listo
          </button>
          <button type="button" onClick={alVer} className={BORDE}>
            <QrCode size={18} aria-hidden /> Ver su carné
          </button>
          <button
            type="button"
            onClick={() => {
              club.anularCobro(hecho.antes, hecho.pago);
              alCerrar();
            }}
            className={`${BORDE} hover:!border-red-700 hover:text-red-700`}
          >
            <Undo2 size={18} aria-hidden /> Anular cobro
          </button>
        </div>
      </Ventana>
    );

  return (
    <Ventana titulo="Registrar cobro" sub={`${socio.nombre} · ${planDe(socio.plan).nombre} · ${textoDias(socio.dias)}`} alCerrar={alCerrar}>
      <form onSubmit={confirmar} noValidate className="grid min-w-0 gap-5">
        <Periodos plan={socio.plan} elegido={periodo} alElegir={setPeriodo} />
        <Opciones
          titulo="Forma de pago"
          elegida={metodo}
          alElegir={(v) => {
            setMetodo(v);
            setNumero("");
            setIntento(false);
          }}
          opciones={[
            { id: "efectivo", nombre: "Efectivo", icono: Banknote },
            { id: "pos", nombre: "POS Tarjeta", icono: CreditCard },
            { id: "transferencia", nombre: "Transferencia", icono: Landmark },
          ]}
        />
        {metodo !== "efectivo" && (
          <label className={ROTULO}>
            {metodo === "pos" ? "Número de voucher (opcional)" : "Número de boleta"}
            <input value={numero} onChange={(e) => setNumero(e.target.value.slice(0, 20))} inputMode="numeric" aria-invalid={intento && falta} className={CAMPO} />
            {intento && falta && <span className="text-[0.8rem] font-semibold text-red-700">Escriba el número de boleta (mínimo 4 caracteres).</span>}
          </label>
        )}
        <div className="grid gap-2">
          <button type="submit" className={`${VERDE} !min-h-14 !text-[1.02rem]`}>
            Confirmar cobro de {qz(monto)}
          </button>
          <button type="button" onClick={alCerrar} className={BORDE}>
            Cancelar
          </button>
        </div>
      </form>
    </Ventana>
  );
}
