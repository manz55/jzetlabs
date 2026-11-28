/* Datos personales, tarjeta guardada, débito automático e historial de pagos del socio. */
import { useState, type FormEvent } from "react";
import { Check, CreditCard, ReceiptText, Save } from "lucide-react";
import { NOMBRE_METODO, qz, type Club, type Pago, type Socio } from "./datos";
import { CamposPersonales, revisarPersonales, soloPersonales } from "./CamposPersonales";
import { CamposTarjeta, Interruptor, Recibo, TARJETA_VACIA, guardable, revisarTarjeta } from "./Pago";
import { BORDE, TARJETA, VERDE, Ventana } from "./Piezas";

export function MisDatos({ club, socio }: { club: Club; socio: Socio }) {
  const [datos, setDatos] = useState(() => soloPersonales(socio));
  const [guardado, setGuardado] = useState(false);
  const [cambiando, setCambiando] = useState(false);
  const [tarjeta, setTarjeta] = useState(TARJETA_VACIA);
  const [intento, setIntento] = useState(false);
  const [recibo, setRecibo] = useState<Pago | null>(null);
  const hayError = Object.values(revisarPersonales(datos)).some(Boolean);
  const errores = revisarTarjeta(tarjeta);

  function guardar(e: FormEvent) {
    e.preventDefault();
    if (hayError) return;
    club.guardar(socio.id, datos);
    setGuardado(true);
  }

  function guardarTarjeta(e: FormEvent) {
    e.preventDefault();
    if (Object.values(errores).some(Boolean)) {
      setIntento(true);
      return;
    }
    club.guardar(socio.id, { tarjeta: guardable(tarjeta) });
    setTarjeta(TARJETA_VACIA);
    setIntento(false);
    setCambiando(false);
  }

  return (
    <div className="grid min-w-0 gap-5">
      <form onSubmit={guardar} noValidate aria-labelledby="ip-datos" className={TARJETA}>
        <h2 id="ip-datos" className="mb-3 text-[1.35rem] font-extrabold">
          Mis datos personales
        </h2>
        <CamposPersonales
          valor={datos}
          alCambiar={(v) => {
            setDatos(v);
            setGuardado(false);
          }}
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={hayError} className={`${VERDE} w-full disabled:opacity-50 sm:w-auto`}>
            <Save size={18} aria-hidden /> Guardar cambios
          </button>
          <p role="status" className="flex items-center gap-1.5 text-[0.9rem] font-bold text-[#15803D]">
            {guardado && (
              <>
                <Check size={17} aria-hidden /> Datos guardados
              </>
            )}
          </p>
        </div>
      </form>

      <section aria-labelledby="ip-tarjeta" className={TARJETA}>
        <h2 id="ip-tarjeta" className="text-[1.2rem] font-extrabold">
          Mi tarjeta y débito automático
        </h2>
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#F8FAFC] p-4">
          <CreditCard size={26} aria-hidden className="shrink-0 text-[#15803D]" />
          {socio.tarjeta ? (
            <p className="min-w-0">
              <b className="block text-[#0F172A]">
                {socio.tarjeta.marca} •••• {socio.tarjeta.ultimos}
              </b>
              <span className="text-[0.86rem] text-slate-600">Vence {socio.tarjeta.vence}</span>
            </p>
          ) : (
            <p className="min-w-0 font-semibold text-slate-600">No tiene tarjeta guardada.</p>
          )}
        </div>

        {cambiando ? (
          <form onSubmit={guardarTarjeta} noValidate className="mt-3 grid gap-3">
            <CamposTarjeta valor={tarjeta} alCambiar={setTarjeta} errores={intento ? errores : undefined} titular={socio.nombre} />
            <div className="grid gap-2 sm:grid-cols-2">
              <button type="submit" className={VERDE}>
                Guardar tarjeta
              </button>
              <button
                type="button"
                onClick={() => {
                  setCambiando(false);
                  setTarjeta(TARJETA_VACIA);
                }}
                className={BORDE}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className={`mt-3 grid gap-2 ${socio.tarjeta ? "sm:grid-cols-2" : ""}`}>
            <button type="button" onClick={() => setCambiando(true)} className={BORDE}>
              {socio.tarjeta ? "Cambiar tarjeta" : "Agregar tarjeta"}
            </button>
            {socio.tarjeta && (
              <button type="button" onClick={() => club.guardar(socio.id, { tarjeta: null, debito: false })} className={`${BORDE} hover:!border-red-700 hover:text-red-700`}>
                Quitar tarjeta
              </button>
            )}
          </div>
        )}
        <div className="mt-3">
          <Interruptor
            marcado={socio.debito}
            apagado={!socio.tarjeta}
            alCambiar={(v) => club.guardar(socio.id, { debito: v })}
            titulo="Débito automático"
            detalle={!socio.tarjeta ? "Agregue una tarjeta para activarlo." : socio.debito ? "Activo: se cobra en cada vencimiento." : "Apagado: usted paga cuando renueva."}
          />
        </div>
      </section>

      <section aria-labelledby="ip-pagos" className={TARJETA}>
        <h2 id="ip-pagos" className="text-[1.2rem] font-extrabold">
          Historial de pagos
        </h2>
        <ul className="mt-3 grid gap-2">
          {socio.pagos.map((p) => (
            <li key={p.recibo}>
              <button type="button" onClick={() => setRecibo(p)} className="flex w-full min-w-0 cursor-pointer items-center justify-between gap-3 rounded-lg bg-[#F8FAFC] px-3.5 py-3 text-left hover:bg-slate-100">
                <span className="flex min-w-0 items-center gap-3">
                  <ReceiptText size={20} aria-hidden className="shrink-0 text-slate-500" />
                  <span className="min-w-0">
                    <b className="block text-[#0F172A]">{p.fecha}</b>
                    <span className="block text-[0.84rem] text-slate-600">
                      {p.periodo} · {NOMBRE_METODO[p.metodo]}
                    </span>
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <b className="block text-[#0F172A]">{qz(p.monto)}</b>
                  <span className="text-[0.78rem] font-bold text-[#15803D]">Ver recibo</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {recibo && (
        <Ventana titulo="Recibo" sub={recibo.recibo} alCerrar={() => setRecibo(null)}>
          <Recibo socio={socio} pago={recibo} />
        </Ventana>
      )}
    </div>
  );
}
