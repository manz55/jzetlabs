/* Ficha del socio para recepción: datos, débito y notas. */
import { useState, type FormEvent } from "react";
import { QrCode, Save } from "lucide-react";
import { metodoDebito, planDe, qz, sedeDe, textoDias, type Club, type Socio } from "./datos";
import { CamposPersonales, revisarPersonales, soloPersonales } from "./CamposPersonales";
import { Interruptor } from "./Pago";
import { BORDE, CAMPO, ROTULO, VERDE, Ventana } from "./Piezas";

export function Ficha({ club, socio, alCerrar, alVer }: { club: Club; socio: Socio; alCerrar: () => void; alVer: () => void }) {
  const [datos, setDatos] = useState(() => soloPersonales(socio));
  const [debito, setDebito] = useState(socio.debito);
  const [nota, setNota] = useState("");
  const hayError = Object.values(revisarPersonales(datos)).some(Boolean);

  function guardar(e: FormEvent) {
    e.preventDefault();
    if (hayError) return;
    club.guardar(socio.id, { ...datos, nombre: datos.nombre.trim(), debito });
    if (nota.trim()) club.nota(socio.id, nota.trim());
    alCerrar();
  }

  return (
    <Ventana titulo={socio.nombre} sub={`N.º ${socio.id} · ${planDe(socio.plan).nombre} · ${qz(planDe(socio.plan).precio)} · ${sedeDe(socio.sede).nombre}`} alCerrar={alCerrar}>
      <form onSubmit={guardar} noValidate className="grid min-w-0 gap-5">
        <p className="rounded-xl bg-[#F8FAFC] px-4 py-3 text-[0.92rem]">
          <b className="text-[#0F172A]">{textoDias(socio.dias)}.</b> {metodoDebito({ ...socio, debito })}.
        </p>
        <CamposPersonales valor={datos} alCambiar={setDatos} />
        <Interruptor marcado={debito} apagado={!socio.tarjeta} alCambiar={setDebito} titulo="Débito automático" detalle={socio.tarjeta ? `Sobre ${socio.tarjeta.marca} •••• ${socio.tarjeta.ultimos}` : "El socio no tiene tarjeta guardada."} />
        <div className="grid gap-2">
          <label className={ROTULO}>
            Nueva nota de recepción
            <textarea value={nota} onChange={(e) => setNota(e.target.value.slice(0, 240))} rows={2} className={`${CAMPO} py-2.5`} />
          </label>
          {socio.notas.length === 0 ? (
            <p className="text-[0.88rem] text-slate-500">Sin notas todavía.</p>
          ) : (
            <ul className="grid gap-1.5">
              {socio.notas.map((n, i) => (
                <li key={`${n.cuando}-${i}`} className="rounded-lg bg-amber-50 px-3 py-2 text-[0.88rem] text-amber-950">
                  <span className="block text-[0.74rem] font-bold text-amber-800">{n.cuando}</span>
                  <span className="break-words">{n.texto}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="submit" disabled={hayError} className={`${VERDE} disabled:opacity-50 sm:col-span-2`}>
            <Save size={18} aria-hidden /> Guardar ficha
          </button>
          <button type="button" onClick={alVer} className={BORDE}>
            <QrCode size={18} aria-hidden /> Ver su carné
          </button>
          <button type="button" onClick={alCerrar} className={BORDE}>
            Cerrar sin guardar
          </button>
        </div>
      </form>
    </Ventana>
  );
}
