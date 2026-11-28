/* Inscripción rápida: tres datos y el socio queda activo, con su carné listo. */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, QrCode, X } from "lucide-react";
import { PLANES, SEDES, fechaEn, planDe, qz, type Club, type PlanId, type SedeId } from "./datos";
import { BORDE, VERDE } from "./Piezas";

const CAMPO = "block min-h-13 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3.5 text-base text-[#0F172A] outline-none focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/30 aria-[invalid=true]:border-red-600";

export function Inscripcion({ club, planInicial, alCerrar, alListo, alPase }: { club: Club; planInicial: PlanId; alCerrar: () => void; alListo: (id: number) => void; alPase: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [planId, setPlanId] = useState(planInicial);
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [sede, setSede] = useState<SedeId>("z14");
  const [intento, setIntento] = useState(false);
  const [hecho, setHecho] = useState("");

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  const plan = planDe(planId);
  const malNombre = nombre.trim().length < 3;
  const malTel = tel.length !== 8;

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (malNombre || malTel) {
      setIntento(true);
      ref.current?.querySelector<HTMLElement>(malNombre ? "#ip-nombre" : "#ip-tel")?.focus();
      return;
    }
    const limpio = nombre.trim().replace(/\s+/g, " ");
    alListo(club.inscribir({ nombre: limpio, plan: planId, sede }));
    setHecho(limpio.split(" ")[0]);
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="ip-alta-titulo"
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar();
      }}
      className="ip m-auto max-h-[min(92dvh,46rem)] w-[min(30rem,calc(100vw-1.5rem))] max-w-none overflow-y-auto overflow-x-hidden rounded-2xl bg-white p-0 text-slate-700 backdrop:bg-[#0F172A]/70"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 id="ip-alta-titulo" className="text-[1.4rem] font-extrabold leading-tight">
            {hecho ? `¡Listo, ${hecho}!` : "Inscripción rápida"}
          </h2>
          <button type="button" onClick={alCerrar} aria-label="Cerrar" className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-lg border border-slate-200 text-[#0F172A]">
            <X size={20} aria-hidden />
          </button>
        </div>

        {hecho ? (
          <div className="mt-4 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-50 text-[#15803D]">
              <Check size={34} aria-hidden />
            </span>
            <p className="mt-4 text-[1.05rem]">
              Su carné ya está <b className="text-[#15803D]">activo</b> hasta el {fechaEn(30)}.
            </p>
            <p className="text-[0.93rem] text-slate-600">
              {plan.nombre} · {qz(plan.precio)}
              {planId === "duo" && " · La segunda persona se registra en recepción."}
            </p>
            <div className="mt-6 grid gap-2.5">
              <button type="button" onClick={alPase} className={VERDE}>
                <QrCode size={19} aria-hidden /> Ver mi pase de entrada
              </button>
              <button type="button" onClick={alCerrar} className={BORDE}>
                Seguir viendo
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={enviar} noValidate className="mt-4 grid min-w-0 gap-4">
            <div role="group" aria-label="Plan" className="grid grid-cols-3 gap-1.5 rounded-xl bg-slate-100 p-1.5">
              {PLANES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={planId === p.id}
                  onClick={() => setPlanId(p.id)}
                  className={`min-h-14 min-w-0 cursor-pointer rounded-lg px-1 py-1.5 text-[0.8rem] font-bold leading-tight ${planId === p.id ? "bg-[#0F172A] text-white" : "text-[#0F172A] hover:bg-white"}`}
                >
                  {p.id === "esencial" ? "Esencial" : p.id === "duo" ? "Dúo" : "Ilimitado"}
                  <span className={`block text-[0.78rem] font-semibold ${planId === p.id ? "text-green-300" : "text-slate-500"}`}>{qz(p.precio)}</span>
                </button>
              ))}
            </div>

            <label className="grid min-w-0 gap-1.5 text-[0.92rem] font-bold text-[#0F172A]">
              Nombre completo
              <input id="ip-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" aria-invalid={intento && malNombre} className={CAMPO} />
              {intento && malNombre && <span className="text-[0.85rem] font-semibold text-red-700">Escriba su nombre y apellido.</span>}
            </label>
            <label className="grid min-w-0 gap-1.5 text-[0.92rem] font-bold text-[#0F172A]">
              WhatsApp (8 números)
              <input id="ip-tel" value={tel} onChange={(e) => setTel(e.target.value.replace(/\D/g, "").slice(0, 8))} inputMode="numeric" autoComplete="tel-national" aria-invalid={intento && malTel} className={CAMPO} />
              {intento && malTel && <span className="text-[0.85rem] font-semibold text-red-700">Faltan números: deben ser 8.</span>}
            </label>
            <label className="grid min-w-0 gap-1.5 text-[0.92rem] font-bold text-[#0F172A]">
              Sede donde entrenará
              <select value={sede} onChange={(e) => setSede(e.target.value as SedeId)} className={CAMPO}>
                {SEDES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </label>

            <dl className="grid gap-1.5 rounded-xl bg-[#F8FAFC] p-4 text-[0.93rem]">
              <div className="flex justify-between gap-3">
                <dt className="min-w-0">{plan.nombre}, primer mes</dt>
                <dd className="font-bold text-[#0F172A]">{qz(plan.precio)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Matrícula</dt>
                <dd className="font-bold text-[#15803D]">Q0</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t border-slate-200 pt-2">
                <dt className="font-bold text-[#0F172A]">Total de hoy</dt>
                <dd className="text-[1.35rem] font-extrabold text-[#0F172A]">{qz(plan.precio)}</dd>
              </div>
            </dl>

            <button type="submit" className={`${VERDE} !min-h-14 !text-[1.02rem]`}>
              Activar mi membresía
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
