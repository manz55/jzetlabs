/*
 * Entrada al sistema (elegir con qué usuario entrar) y el portal del paciente.
 * En la demo no hay contraseña: se elige el usuario para ver lo que ve cada quien.
 */
import { useEffect, useMemo } from "react";
import { ArrowLeft, CalendarCheck, CalendarPlus, Check, ClipboardList, LogOut, ShieldCheck, Smile, Stethoscope, Wallet, X } from "lucide-react";
import { qz } from "../comun";
import {
  AZUL, CIELO, MENTA, PACIENTE_DEMO, ROLES, TINTA,
  DIAS_LARGOS, MESES_LARGOS, desdeIso, doctorPor, servicioPor, useExpediente,
  type Cita, type CitaExtra, type Rol, type Sesion,
} from "./datos";
import { Odontograma } from "./PanelClinica";

export const ICONO_ROL: Record<Rol, typeof Smile> = { paciente: Smile, recepcion: CalendarCheck, doctor: Stethoscope, admin: ShieldCheck };
const iniciales = (n: string) =>
  n
    .split(" ")
    .filter((x) => !x.endsWith("."))
    .map((x) => x[0])
    .slice(0, 2)
    .join("");

export function Entrada({ alEntrar, alVolver }: { alEntrar: (s: Sesion) => void; alVolver: () => void }) {
  useEffect(() => {
    document.title = "Entrar · Clínica Aurora · Demo de Jzet Labs";
  }, []);
  return (
    <div className="min-h-[calc(100vh-80px)] px-5 py-12 sm:py-16" style={{ background: `${CIELO}` }}>
      <div className="mx-auto max-w-3xl">
        <button type="button" onClick={alVolver} className="inline-flex items-center gap-1.5 text-sm font-semibold opacity-70 hover:opacity-100">
          <ArrowLeft size={16} /> Volver a la página
        </button>
        <div className="mt-6 flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-full text-white" style={{ background: AZUL }}>
            <Smile size={22} />
          </span>
          <div className="leading-tight">
            <p className="font-extrabold text-[1.2rem]">Aurora</p>
            <p className="text-[0.8rem] opacity-60">Sistema de la clínica</p>
          </div>
        </div>
        <h1 className="mt-6 !text-[#123b40] text-[2.1rem] sm:text-[2.7rem] font-extrabold tracking-[-0.03em] leading-tight">¿Con qué usuario quiere entrar?</h1>
        <p className="mt-2 max-w-xl opacity-70">Cada persona ve solo lo que le toca. Pruebe varios: lo que haga uno (agendar, atender, cobrar) le aparece a los demás.</p>

        <ul className="mt-8 grid sm:grid-cols-2 gap-3">
          {ROLES.map((r) => {
            const Icono = ICONO_ROL[r.rol];
            const foto = r.doctor ? doctorPor(r.doctor).foto : null;
            return (
              <li key={r.nombre}>
                <button
                  type="button"
                  onClick={() => alEntrar({ rol: r.rol, doctor: r.doctor })}
                  className="group h-full w-full flex items-start gap-3.5 rounded-2xl border border-[#123b40]/10 bg-white p-4 text-left transition hover:border-[#14555d]/50 hover:shadow-md active:scale-[0.99]"
                >
                  {foto ? (
                    <img src={foto} alt="" className="w-12 h-12 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="grid place-items-center w-12 h-12 shrink-0 rounded-full text-white" style={{ background: r.rol === "paciente" ? MENTA : TINTA }}>
                      <Icono size={20} />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block text-[0.72rem] font-bold uppercase tracking-[0.1em]" style={{ color: AZUL }}>
                      {r.cargo}
                    </span>
                    <span className="block font-bold text-[1.05rem]">{r.nombre}</span>
                    <span className="mt-0.5 block text-[0.85rem] opacity-65">{r.texto}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-sm opacity-55">En su sistema real, cada quien entra con su propio usuario y contraseña. Aquí son usuarios de ejemplo.</p>
      </div>
    </div>
  );
}

/* visitas anteriores de ejemplo, para que el portal no se vea vacío */
const VISITAS_EJEMPLO = [
  { hace: 21, servicio: "limpieza", doctor: "morales", diagnostico: "Encías un poco inflamadas, sarro leve.", indicaciones: "Usar hilo dental todas las noches. Enjuague sin alcohol por 2 semanas." },
  { hace: 64, servicio: "valoracion", doctor: "morales", diagnostico: "Caries pequeña en la pieza 26.", indicaciones: "Agendar resina en la pieza 26. Evitar dulces pegajosos mientras tanto." },
];

export function PortalPaciente({
  citas,
  setCitas,
  extras,
  alAgendar,
  alSalir,
}: {
  citas: Cita[];
  setCitas: React.Dispatch<React.SetStateAction<Cita[]>>;
  extras: Record<string, CitaExtra>;
  alAgendar: () => void;
  alSalir: () => void;
}) {
  const [exp] = useExpediente(PACIENTE_DEMO);
  useEffect(() => {
    document.title = "Mi cuenta · Clínica Aurora · Demo de Jzet Labs";
  }, []);
  const mias = citas.filter((c) => c.paciente === PACIENTE_DEMO).sort((a, b) => (a.dia + a.hora).localeCompare(b.dia + b.hora));
  const proximas = mias.filter((c) => c.estado !== "atendida");
  const atendidas = mias.filter((c) => c.estado === "atendida" && extras[c.id]?.consulta);
  const visitas = useMemo(
    () => [
      ...atendidas.map((c) => ({ id: c.id, fecha: desdeIso(c.dia), servicio: c.servicio, doctor: c.doctor, diagnostico: extras[c.id]!.consulta!.diagnostico, indicaciones: extras[c.id]!.consulta!.indicaciones })),
      ...VISITAS_EJEMPLO.map((v) => {
        const f = new Date();
        f.setDate(f.getDate() - v.hace);
        return { ...v, id: `ej-${v.hace}`, fecha: f };
      }),
    ],
    [atendidas, extras],
  );
  const pendiente = exp.plan.filter((p) => !p.hecho);
  const saldo = pendiente.reduce((s, p) => s + p.costo, 0);
  const total = exp.plan.reduce((s, p) => s + p.costo, 0);
  const cambiar = (id: string, cambio: Partial<Cita> | null) => setCitas((cs) => (cambio === null ? cs.filter((c) => c.id !== id) : cs.map((c) => (c.id === id ? { ...c, ...cambio } : c))));
  const fecha = (d: Date) => `${DIAS_LARGOS[d.getDay()]} ${d.getDate()} de ${MESES_LARGOS[d.getMonth()]}`;
  const caja = "rounded-3xl bg-white p-5 sm:p-6 border border-[#123b40]/8";
  const etiqueta = "text-[0.78rem] font-bold uppercase tracking-[0.12em] opacity-55";

  return (
    <div className="min-h-screen bg-[#f2f6f9] text-[#123b40]">
      <header className="bg-white border-b border-[#123b40]/10">
        <div className="mx-auto max-w-5xl px-5 h-16 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2.5">
            <span className="grid place-items-center w-9 h-9 rounded-full text-white" style={{ background: AZUL }}>
              <Smile size={19} />
            </span>
            <span className="leading-tight">
              <span className="block font-extrabold">Aurora</span>
              <span className="block text-[0.7rem] opacity-60">Mi cuenta</span>
            </span>
          </span>
          <button type="button" onClick={alSalir} className="inline-flex items-center gap-1.5 rounded-full border border-[#123b40]/15 px-3.5 py-1.5 text-[0.85rem] font-semibold">
            <LogOut size={15} /> Cambiar de usuario
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="grid place-items-center w-14 h-14 rounded-full text-[1.1rem] font-bold text-white" style={{ background: MENTA }}>
              {iniciales(PACIENTE_DEMO)}
            </span>
            <div>
              <p className="text-sm opacity-60">Bienvenida,</p>
              <h1 className="!text-[#123b40] text-[1.9rem] sm:text-[2.3rem] font-extrabold tracking-[-0.02em] leading-tight">{PACIENTE_DEMO}</h1>
            </div>
          </div>
          <button type="button" onClick={alAgendar} className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 font-bold text-white active:scale-95 transition" style={{ background: AZUL }}>
            <CalendarPlus size={18} /> Agendar nueva cita
          </button>
        </div>

        <div className="mt-7 grid lg:grid-cols-[1.25fr_1fr] gap-4">
          {/* próximas citas */}
          <section className={caja}>
            <p className={etiqueta}>Mis próximas citas</p>
            {proximas.length ? (
              <ul className="mt-3 space-y-3">
                {proximas.map((c) => {
                  const s = servicioPor(c.servicio);
                  const doc = doctorPor(c.doctor);
                  return (
                    <li key={c.id} className="rounded-2xl p-4" style={{ background: CIELO }}>
                      <div className="flex items-start gap-3">
                        <img src={doc.foto} alt="" className="w-11 h-11 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold">{s.nombre}</p>
                          <p className="text-[0.9rem] opacity-75">
                            {fecha(desdeIso(c.dia))}, {c.hora}
                          </p>
                          <p className="text-[0.85rem] opacity-60">{doc.nombre}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[0.72rem] font-bold ${c.estado === "confirmada" ? "bg-white text-[#145a87]" : "bg-[#fff4e5] text-[#8a4b00]"}`}>
                          {c.estado === "confirmada" ? "Confirmada" : "Por confirmar"}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {c.estado === "por-confirmar" && (
                          <button type="button" onClick={() => cambiar(c.id, { estado: "confirmada" })} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.85rem] font-bold text-white active:scale-95" style={{ background: AZUL }}>
                            <Check size={15} /> Confirmar asistencia
                          </button>
                        )}
                        <button type="button" onClick={() => cambiar(c.id, null)} className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[0.85rem] font-bold text-[#b42318] active:scale-95">
                          <X size={15} /> Cancelar
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-3 rounded-2xl p-5 text-center" style={{ background: CIELO }}>
                <p className="font-semibold">No tiene citas próximas.</p>
                <button type="button" onClick={alAgendar} className="mt-3 rounded-full px-4 py-2 text-[0.88rem] font-bold text-white" style={{ background: AZUL }}>
                  Agendar una
                </button>
              </div>
            )}
          </section>

          {/* saldo y datos */}
          <section className={caja}>
            <p className={etiqueta}>Mi tratamiento</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm opacity-60">Saldo pendiente</p>
                <p className="text-[2rem] font-extrabold leading-none" style={{ color: AZUL }}>
                  {qz(saldo)}
                </p>
              </div>
              <p className="text-sm opacity-60">de {qz(total)}</p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-[#123b40]/8">
              <div className="h-full rounded-full" style={{ width: `${total ? ((total - saldo) / total) * 100 : 0}%`, background: MENTA }} />
            </div>
            <ul className="mt-4 space-y-2">
              {exp.plan.map((p) => (
                <li key={p.id} className="flex items-center gap-2.5 text-[0.92rem]">
                  <span className="grid place-items-center w-5 h-5 shrink-0 rounded-full" style={p.hecho ? { background: MENTA, color: "#fff" } : { border: "2px solid rgba(18,59,64,.2)" }}>
                    {p.hecho && <Check size={12} />}
                  </span>
                  <span className={`flex-1 ${p.hecho ? "opacity-50" : ""}`}>
                    {p.proc}
                    {p.pieza !== "—" ? ` · pieza ${p.pieza}` : ""}
                  </span>
                  <span className="font-semibold tabular-nums">{qz(p.costo)}</span>
                </li>
              ))}
            </ul>
            {exp.alergias && (
              <p className="mt-4 rounded-xl bg-[#fff8ec] px-3 py-2 text-[0.85rem]">
                <b>Alergias registradas:</b> {exp.alergias}
              </p>
            )}
          </section>
        </div>

        {/* indicaciones */}
        <section className={`mt-4 ${caja}`}>
          <p className={etiqueta}>Mis visitas e indicaciones del doctor</p>
          <ul className="mt-3 divide-y divide-[#123b40]/8">
            {visitas.map((v) => (
              <li key={v.id} className="py-3.5 grid sm:grid-cols-[180px_1fr] gap-x-6 gap-y-1">
                <div>
                  <p className="font-bold">{servicioPor(v.servicio).nombre}</p>
                  <p className="text-[0.82rem] opacity-60">
                    {v.fecha.getDate()} de {MESES_LARGOS[v.fecha.getMonth()]} · {doctorPor(v.doctor).corto}
                  </p>
                </div>
                <div className="text-[0.92rem]">
                  <p className="opacity-75">{v.diagnostico}</p>
                  {v.indicaciones && (
                    <p className="mt-1.5 flex gap-2 rounded-xl px-3 py-2" style={{ background: CIELO }}>
                      <ClipboardList size={16} className="mt-0.5 shrink-0" style={{ color: AZUL }} /> {v.indicaciones}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* odontograma, solo de ver */}
        <section className={`mt-4 ${caja}`}>
          <p className={etiqueta}>Mis dientes</p>
          <p className="mt-1 text-sm opacity-60">Así los tiene registrados su doctor.</p>
          <div className="mt-4">
            <Odontograma dientes={exp.dientes} />
          </div>
        </section>

        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div className={`${caja} flex items-center gap-3`}>
            <Wallet size={22} style={{ color: AZUL }} />
            <p className="text-[0.92rem]">Puede pagar en la clínica con efectivo, tarjeta o transferencia.</p>
          </div>
          <div className={`${caja} flex items-center gap-3`}>
            <CalendarCheck size={22} style={{ color: AZUL }} />
            <p className="text-[0.92rem]">Un día antes de cada cita le llega un recordatorio por WhatsApp.</p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs opacity-50">Portal de demostración con datos de ejemplo.</p>
      </main>
    </div>
  );
}
