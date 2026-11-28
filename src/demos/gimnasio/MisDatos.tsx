/* Datos personales y de factura, forma de pago, tarjeta, débito automático e historial de pagos. */
import { useState, type FormEvent } from "react";
import { CreditCard, ReceiptText } from "lucide-react";
import { NOMBRE_METODO, qz, type Club, type Metodo, type Pago, type Socio } from "./datos";
import { CamposPersonales, revisarPersonales, soloPersonales } from "./CamposPersonales";
import { CamposTarjeta, Interruptor, Recibo, TARJETA_VACIA, guardable, revisarTarjeta } from "./Pago";
import { BORDE, BarraGuardar, CAMPO, Guardado, ROTULO, TARJETA, VERDE, Ventana } from "./Piezas";

function Personal({ club, socio }: { club: Club; socio: Socio }) {
  const [datos, setDatos] = useState(() => soloPersonales(socio));
  const [guardado, setGuardado] = useState("");
  const actual = soloPersonales(socio);
  const sucio = (Object.keys(actual) as (keyof typeof actual)[]).some((k) => datos[k] !== actual[k]);
  const error = Object.values(revisarPersonales(datos)).find(Boolean);

  function guardar(e: FormEvent) {
    e.preventDefault();
    if (error) return;
    const limpios = { ...datos, nombre: datos.nombre.trim().replace(/\s+/g, " "), nit: datos.nit || "CF", emergenciaNombre: datos.emergenciaNombre.trim() };
    club.guardar(socio.id, limpios);
    setDatos(limpios);
    setGuardado("Sus datos quedaron guardados.");
  }

  return (
    <form onSubmit={guardar} noValidate aria-labelledby="ip-datos" className={TARJETA}>
      <h2 id="ip-datos" className="text-[1.35rem] font-extrabold">
        Mis datos personales
      </h2>
      <p className="mb-5 mt-1.5 text-[0.93rem] text-slate-600">El NIT se usa para su factura electrónica (FEL).</p>
      <CamposPersonales
        valor={datos}
        alCambiar={(v) => {
          setDatos(v);
          setGuardado("");
        }}
      />
      <BarraGuardar
        sucio={sucio}
        guardado={guardado}
        error={error}
        alDescartar={() => {
          setDatos(actual);
          setGuardado("");
        }}
      />
    </form>
  );
}

function FormaDePago({ club, socio }: { club: Club; socio: Socio }) {
  const [cambiando, setCambiando] = useState(false);
  const [tarjeta, setTarjeta] = useState(TARJETA_VACIA);
  const [intento, setIntento] = useState(false);
  const [aviso, setAviso] = useState("");
  const errores = revisarTarjeta(tarjeta);

  function guardarTarjeta(e: FormEvent) {
    e.preventDefault();
    if (Object.values(errores).some(Boolean)) {
      setIntento(true);
      return;
    }
    const nueva = guardable(tarjeta);
    club.guardar(socio.id, { tarjeta: nueva });
    setAviso(`Tarjeta ${nueva.marca} •••• ${nueva.ultimos} guardada.`);
    cerrar();
  }

  function cerrar() {
    setTarjeta(TARJETA_VACIA);
    setIntento(false);
    setCambiando(false);
  }

  return (
    <section aria-labelledby="ip-tarjeta" className={TARJETA}>
      <h2 id="ip-tarjeta" className="text-[1.2rem] font-extrabold">
        Mi forma de pago
      </h2>
      <div className="mt-5 grid gap-5">
        <label className={ROTULO}>
          Cómo prefiere pagar
          <select
            value={socio.preferido}
            onChange={(e) => {
              const v = e.target.value as Metodo;
              club.guardar(socio.id, { preferido: v });
              setAviso(`Forma de pago guardada: ${NOMBRE_METODO[v].toLowerCase()}.`);
            }}
            className={CAMPO}
          >
            {(Object.keys(NOMBRE_METODO) as Metodo[]).map((m) => (
              <option key={m} value={m}>
                {NOMBRE_METODO[m]}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-4 rounded-xl bg-[#F8FAFC] p-4">
          <CreditCard size={26} aria-hidden className="shrink-0 text-[#15803D]" />
          {socio.tarjeta ? (
            <p className="min-w-0">
              <b className="block text-[#0F172A]">
                {socio.tarjeta.marca} •••• {socio.tarjeta.ultimos}
              </b>
              <span className="mt-1.5 block text-[0.86rem] text-slate-600">Vence {socio.tarjeta.vence}</span>
            </p>
          ) : (
            <p className="min-w-0 font-semibold text-slate-600">No tiene tarjeta guardada.</p>
          )}
        </div>

        {cambiando ? (
          <form onSubmit={guardarTarjeta} noValidate className="grid gap-4">
            <CamposTarjeta valor={tarjeta} alCambiar={setTarjeta} errores={intento ? errores : undefined} titular={socio.nombre} />
            <div className="grid gap-2.5 sm:grid-cols-2">
              <button type="submit" className={VERDE}>
                Guardar tarjeta
              </button>
              <button type="button" onClick={cerrar} className={BORDE}>
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className={`grid gap-2.5 ${socio.tarjeta ? "sm:grid-cols-2" : ""}`}>
            <button
              type="button"
              onClick={() => {
                setAviso("");
                setCambiando(true);
              }}
              className={BORDE}
            >
              {socio.tarjeta ? "Cambiar tarjeta" : "Agregar tarjeta"}
            </button>
            {socio.tarjeta && (
              <button
                type="button"
                onClick={() => {
                  club.guardar(socio.id, { tarjeta: null, debito: false });
                  setAviso("Tarjeta quitada. El débito automático quedó apagado.");
                }}
                className={`${BORDE} hover:!border-red-700 hover:text-red-700`}
              >
                Quitar tarjeta
              </button>
            )}
          </div>
        )}

        <Interruptor
          marcado={socio.debito}
          apagado={!socio.tarjeta}
          alCambiar={(v) => {
            club.guardar(socio.id, { debito: v });
            setAviso(v ? "Débito automático activado." : "Débito automático apagado.");
          }}
          titulo="Débito automático"
          detalle={!socio.tarjeta ? "Agregue una tarjeta para activarlo." : socio.debito ? "Activo: se cobra en cada vencimiento." : "Apagado: usted paga cuando renueva."}
        />
        <Guardado texto={aviso} />
      </div>
    </section>
  );
}

export function MisDatos({ club, socio }: { club: Club; socio: Socio }) {
  const [recibo, setRecibo] = useState<Pago | null>(null);
  return (
    <div className="grid min-w-0 gap-6">
      <Personal club={club} socio={socio} />
      <FormaDePago club={club} socio={socio} />

      <section aria-labelledby="ip-pagos" className={TARJETA}>
        <h2 id="ip-pagos" className="text-[1.2rem] font-extrabold">
          Historial de pagos
        </h2>
        <ul className="mt-5 grid gap-3">
          {socio.pagos.map((p) => (
            <li key={p.recibo}>
              <button type="button" onClick={() => setRecibo(p)} className="flex w-full min-w-0 cursor-pointer flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F8FAFC] p-4 text-left hover:bg-slate-100">
                <span className="flex min-w-0 flex-1 basis-44 items-center gap-3">
                  <ReceiptText size={20} aria-hidden className="shrink-0 text-slate-500" />
                  <span className="min-w-0">
                    <b className="block text-[#0F172A]">{p.fecha}</b>
                    <span className="mt-1.5 block text-[0.84rem] leading-snug text-slate-600">
                      {p.periodo} · {NOMBRE_METODO[p.metodo]}
                    </span>
                  </span>
                </span>
                <span className="ml-auto shrink-0 text-right">
                  <b className="block text-[#0F172A]">{qz(p.monto)}</b>
                  <span className="mt-1.5 block text-[0.78rem] font-bold text-[#15803D]">Ver recibo</span>
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
