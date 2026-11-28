/*
 * Piezas del cobro que usan el socio y recepción: escoger periodo, la pasarela del socio y el recibo.
 */
import { useState, type FormEvent } from "react";
import { CircleCheck, CreditCard, Landmark, Lock, QrCode } from "lucide-react";
import { CUENTAS, NOMBRE_METODO, PERIODOS, montoDe, planDe, qz, type Club, type Pago, type PeriodoId, type PlanId, type Socio, type Tarjeta } from "./datos";
import { BORDE, CAMPO, ROTULO, VERDE, Ventana } from "./Piezas";

export function Periodos({ plan, elegido, alElegir }: { plan: PlanId; elegido: PeriodoId; alElegir: (p: PeriodoId) => void }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-[0.95rem] font-extrabold text-[#0F172A]">¿Cuánto tiempo?</legend>
      <div className="grid grid-cols-3 gap-2">
        {PERIODOS.map((p) => {
          const activo = elegido === p.id;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={activo}
              onClick={() => alElegir(p.id)}
              className={`flex min-h-20 min-w-0 cursor-pointer flex-col items-center justify-center rounded-xl border px-1 py-2 leading-tight ${activo ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-slate-300 text-[#0F172A] hover:border-[#0F172A]"}`}
            >
              <span className="text-[0.85rem] font-bold">{p.nombre}</span>
              <span className="text-[1.1rem] font-extrabold">{qz(montoDe(plan, p.id))}</span>
              <span className={`text-[0.72rem] font-bold ${activo ? "text-green-300" : "text-[#15803D]"}`}>{p.descuento ? `-${p.descuento * 100}%` : `${p.dias} días`}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Opciones<T extends string>({ titulo, opciones, elegida, alElegir }: { titulo: string; opciones: { id: T; nombre: string; icono: typeof Lock }[]; elegida: T; alElegir: (v: T) => void }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-[0.95rem] font-extrabold text-[#0F172A]">{titulo}</legend>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${opciones.length}, minmax(0, 1fr))` }}>
        {opciones.map(({ id, nombre, icono: Icono }) => (
          <button
            key={id}
            type="button"
            aria-pressed={elegida === id}
            onClick={() => alElegir(id)}
            className={`flex min-h-16 min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-center text-[0.76rem] font-bold leading-tight sm:text-[0.85rem] ${elegida === id ? "border-[#15803D] bg-green-50 text-[#14532D] ring-1 ring-[#15803D]" : "border-slate-300 text-[#0F172A] hover:border-[#0F172A]"}`}
          >
            <Icono size={20} aria-hidden />
            {nombre}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Recibo({ socio, pago }: { socio: Pick<Socio, "nombre" | "plan" | "id">; pago: Pago }) {
  const filas = [
    ["Recibo", pago.recibo],
    ["Fecha", pago.fecha],
    ["Socio", `${socio.nombre} · N.º ${socio.id}`],
    ["Plan", `${planDe(socio.plan).nombre} · ${pago.periodo}`],
    ["Forma de pago", NOMBRE_METODO[pago.metodo]],
    ["Detalle", pago.detalle],
    ["Válido hasta", pago.hasta],
  ];
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-[#F8FAFC] p-4">
      <dl className="grid gap-1.5 text-[0.9rem]">
        {filas.map(([a, b]) => (
          <div key={a} className="flex justify-between gap-3">
            <dt className="shrink-0 text-slate-500">{a}</dt>
            <dd className="min-w-0 break-words text-right font-bold text-[#0F172A]">{b}</dd>
          </div>
        ))}
        <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-slate-200 pt-2">
          <dt className="font-bold text-[#0F172A]">Total</dt>
          <dd className="text-[1.5rem] font-extrabold text-[#0F172A]">{qz(pago.monto)}</dd>
        </div>
      </dl>
    </div>
  );
}

/* ---------- tarjeta ---------- */

export type DatosTarjeta = { numero: string; nombre: string; vence: string; cvv: string };
export const TARJETA_VACIA: DatosTarjeta = { numero: "", nombre: "", vence: "", cvv: "" };

export function revisarTarjeta(t: DatosTarjeta) {
  const [mes, anio] = t.vence.split("/").map(Number);
  const hoy = new Date();
  const vigente = t.vence.length === 5 && mes >= 1 && mes <= 12 && new Date(2000 + anio, mes) > hoy;
  return {
    numero: t.numero.length < 15 ? "El número debe tener 15 o 16 dígitos." : "",
    nombre: t.nombre.trim().length < 3 ? "Escriba el nombre como sale en la tarjeta." : "",
    vence: vigente ? "" : "Use mes y año vigentes (MM/AA).",
    cvv: t.cvv.length < 3 ? "Son 3 o 4 dígitos." : "",
  };
}

/* solo se conservan la marca, los últimos cuatro y el vencimiento */
export const guardable = (t: DatosTarjeta): Tarjeta => ({
  marca: t.numero.startsWith("4") ? "Visa" : t.numero.startsWith("3") ? "American Express" : "Mastercard",
  ultimos: t.numero.slice(-4),
  vence: t.vence,
});

export function CamposTarjeta({ valor, alCambiar, errores, titular }: { valor: DatosTarjeta; alCambiar: (v: DatosTarjeta) => void; errores?: ReturnType<typeof revisarTarjeta>; titular: string }) {
  const poner = (parte: Partial<DatosTarjeta>) => alCambiar({ ...valor, ...parte });
  const error = (k: keyof DatosTarjeta) => errores?.[k] && <span className="text-[0.8rem] font-semibold text-red-700">{errores[k]}</span>;
  return (
    <div className="grid min-w-0 grid-cols-2 gap-3">
      <p className="col-span-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-lg bg-amber-50 px-3 py-2 text-[0.82rem] font-semibold text-amber-900">
        <span className="min-w-0">No escriba una tarjeta real: nada se cobra ni se envía.</span>
        <button type="button" onClick={() => alCambiar({ numero: "4242424242424242", nombre: titular, vence: "12/29", cvv: "123" })} className="min-h-9 cursor-pointer font-extrabold underline underline-offset-4">
          Usar tarjeta de prueba
        </button>
      </p>
      <label className={`${ROTULO} col-span-2`}>
        Número de tarjeta
        <input value={valor.numero.replace(/(.{4})(?=.)/g, "$1 ")} onChange={(e) => poner({ numero: e.target.value.replace(/\D/g, "").slice(0, 16) })} inputMode="numeric" autoComplete="off" placeholder="0000 0000 0000 0000" aria-invalid={!!errores?.numero} className={CAMPO} />
        {error("numero")}
      </label>
      <label className={`${ROTULO} col-span-2`}>
        Nombre en la tarjeta
        <input value={valor.nombre} onChange={(e) => poner({ nombre: e.target.value })} autoComplete="off" aria-invalid={!!errores?.nombre} className={CAMPO} />
        {error("nombre")}
      </label>
      <label className={ROTULO}>
        Vence
        <input
          value={valor.vence}
          onChange={(e) => {
            const n = e.target.value.replace(/\D/g, "").slice(0, 4);
            poner({ vence: n.length > 2 ? `${n.slice(0, 2)}/${n.slice(2)}` : n });
          }}
          inputMode="numeric"
          autoComplete="off"
          placeholder="MM/AA"
          aria-invalid={!!errores?.vence}
          className={CAMPO}
        />
        {error("vence")}
      </label>
      <label className={ROTULO}>
        CVV
        <input value={valor.cvv} onChange={(e) => poner({ cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} inputMode="numeric" autoComplete="off" type="password" placeholder="123" aria-invalid={!!errores?.cvv} className={CAMPO} />
        {error("cvv")}
      </label>
    </div>
  );
}

export function Interruptor({ marcado, alCambiar, titulo, detalle, apagado = false }: { marcado: boolean; alCambiar: (v: boolean) => void; titulo: string; detalle: string; apagado?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={marcado}
      disabled={apagado}
      onClick={() => alCambiar(!marcado)}
      className="flex w-full min-w-0 cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left disabled:cursor-not-allowed disabled:opacity-55"
    >
      <span className="min-w-0">
        <b className="block text-[0.95rem] text-[#0F172A]">{titulo}</b>
        <span className="block text-[0.83rem] leading-snug text-slate-600">{detalle}</span>
      </span>
      <span aria-hidden className={`flex h-7 w-12 shrink-0 rounded-full p-1 transition ${marcado ? "justify-end bg-[#15803D]" : "justify-start bg-slate-300"}`}>
        <span className="h-5 w-5 rounded-full bg-white" />
      </span>
    </button>
  );
}

/* ---------- pasarela del socio ---------- */

export function Pasarela({ club, socio, alCerrar }: { club: Club; socio: Socio; alCerrar: () => void }) {
  const [periodo, setPeriodo] = useState<PeriodoId>("mes");
  const [metodo, setMetodo] = useState<"tarjeta" | "transferencia">("tarjeta");
  const [usarGuardada, setUsarGuardada] = useState(!!socio.tarjeta);
  const [tarjeta, setTarjeta] = useState(TARJETA_VACIA);
  const [debito, setDebito] = useState(socio.debito);
  const [banco, setBanco] = useState(0);
  const [referencia, setReferencia] = useState("");
  const [intento, setIntento] = useState(false);
  const [pago, setPago] = useState<Pago | null>(null);

  const monto = montoDe(socio.plan, periodo);
  const nueva = metodo === "tarjeta" && !(usarGuardada && socio.tarjeta);
  const errores = revisarTarjeta(tarjeta);

  function confirmar(e: FormEvent) {
    e.preventDefault();
    if ((nueva && Object.values(errores).some(Boolean)) || (metodo === "transferencia" && referencia.trim().length < 4)) {
      setIntento(true);
      return;
    }
    if (metodo === "transferencia") {
      setPago(club.cobrar(socio, { periodo, metodo, detalle: `${CUENTAS[banco].banco}, boleta ${referencia.trim()}` }));
      return;
    }
    const usada = nueva ? guardable(tarjeta) : socio.tarjeta!;
    setPago(
      club.cobrar(socio, {
        periodo,
        metodo,
        detalle: `${usada.marca} •••• ${usada.ultimos}${debito ? " (débito automático)" : ""}`,
        /* la tarjeta nueva solo se guarda si queda para el débito */
        tarjeta: nueva && debito ? usada : undefined,
        debito,
      }),
    );
    setTarjeta(TARJETA_VACIA);
  }

  if (pago)
    return (
      <Ventana titulo="Pago recibido" sub="Su acceso ya está activo." alCerrar={alCerrar}>
        <div role="status" className="mb-4 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-[#14532D]">
          <CircleCheck size={30} aria-hidden className="shrink-0" />
          <p className="min-w-0 font-bold">
            Puede entrar hasta el {pago.hasta}.{pago.metodo === "transferencia" && " Recepción confirmará su boleta en el banco."}
          </p>
        </div>
        <Recibo socio={socio} pago={pago} />
        <button type="button" onClick={alCerrar} className={`${VERDE} mt-4 w-full`}>
          <QrCode size={19} aria-hidden /> Ver mi carné
        </button>
      </Ventana>
    );

  return (
    <Ventana titulo="Renovar membresía" sub={`${socio.nombre} · ${planDe(socio.plan).nombre}`} alCerrar={alCerrar}>
      <form onSubmit={confirmar} noValidate className="grid min-w-0 gap-5">
        <Periodos plan={socio.plan} elegido={periodo} alElegir={setPeriodo} />
        <Opciones
          titulo="¿Cómo va a pagar?"
          elegida={metodo}
          alElegir={(v) => {
            setMetodo(v);
            setIntento(false);
          }}
          opciones={[
            { id: "tarjeta", nombre: "Tarjeta de crédito o débito", icono: CreditCard },
            { id: "transferencia", nombre: "Transferencia BI / BAC", icono: Landmark },
          ]}
        />

        {metodo === "tarjeta" ? (
          <div className="grid min-w-0 gap-3">
            {socio.tarjeta && (
              <div className="grid gap-2 sm:grid-cols-2">
                {[true, false].map((g) => (
                  <button key={String(g)} type="button" aria-pressed={usarGuardada === g} onClick={() => setUsarGuardada(g)} className={`min-h-12 min-w-0 cursor-pointer rounded-lg border px-3 text-[0.9rem] font-bold ${usarGuardada === g ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-slate-300 text-[#0F172A]"}`}>
                    {g ? `${socio.tarjeta!.marca} •••• ${socio.tarjeta!.ultimos}` : "Otra tarjeta"}
                  </button>
                ))}
              </div>
            )}
            {nueva && <CamposTarjeta valor={tarjeta} alCambiar={setTarjeta} errores={intento ? errores : undefined} titular={socio.nombre} />}
            <Interruptor marcado={debito} alCambiar={setDebito} titulo="Débito automático" detalle="Se cobra solo en cada vencimiento. Se puede apagar cuando quiera." />
          </div>
        ) : (
          <div className="grid min-w-0 gap-3">
            <div role="radiogroup" aria-label="Cuenta para depositar" className="grid gap-2">
              {CUENTAS.map((c, i) => (
                <button key={c.banco} type="button" role="radio" aria-checked={banco === i} onClick={() => setBanco(i)} className={`min-w-0 cursor-pointer rounded-xl border px-4 py-3 text-left ${banco === i ? "border-[#15803D] bg-green-50 ring-1 ring-[#15803D]" : "border-slate-300"}`}>
                  <span className="block text-[0.85rem] font-bold text-slate-600">{c.banco} · Monetaria</span>
                  <span className="block text-[1.25rem] font-extrabold text-[#0F172A]">{c.numero}</span>
                  <span className="block text-[0.82rem] text-slate-600">IronPeak Performance Club, S.A.</span>
                </button>
              ))}
            </div>
            <label className={ROTULO}>
              Número de boleta o referencia
              <input value={referencia} onChange={(e) => setReferencia(e.target.value.slice(0, 20))} inputMode="numeric" aria-invalid={intento && referencia.trim().length < 4} className={CAMPO} />
              {intento && referencia.trim().length < 4 && <span className="text-[0.8rem] font-semibold text-red-700">Escriba el número de su boleta (mínimo 4 caracteres).</span>}
            </label>
            <p className="text-[0.85rem] text-slate-600">El débito automático solo funciona con tarjeta.</p>
          </div>
        )}

        <div className="grid gap-2">
          <button type="submit" className={`${VERDE} !min-h-14 !text-[1.02rem]`}>
            <Lock size={18} aria-hidden /> {metodo === "tarjeta" ? `Pagar ${qz(monto)}` : `Confirmar transferencia de ${qz(monto)}`}
          </button>
          <button type="button" onClick={alCerrar} className={BORDE}>
            Cancelar
          </button>
        </div>
      </form>
    </Ventana>
  );
}
