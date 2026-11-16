/*
 * Panel de la clínica Aurora: lo que ve recepción o el doctor.
 * Agenda del día por doctor, citas por confirmar, ocupación, ingreso estimado,
 * detalle de cada cita (confirmar, recordar, atender, cancelar), pacientes con
 * expediente y odontograma, y reportes. Datos de ejemplo, guardados en el navegador.
 */
import { useEffect, useMemo, useState } from "react";
import { BarChart3, Bell, CalendarDays, Check, ClipboardList, ExternalLink, Plus, RotateCcw, Search, UserRound, Users, X } from "lucide-react";
import { Modal } from "@/components/Modal";
import { qz } from "../comun";
import {
  AZUL, CIELO, DOCTORES, MENTA, SERVICIOS, TINTA,
  DIAS_CORTOS, DIAS_LARGOS, MESES_LARGOS,
  desdeIso, doctorPor, horasDelDia, iso, proximosDias, servicioPor, tomado, yaPaso,
  type Cita, type Estado,
} from "./datos";

const ESTADOS: Record<Estado, { texto: string; fondo: string; tinta: string; punto: string }> = {
  "por-confirmar": { texto: "Por confirmar", fondo: "#fff4e5", tinta: "#8a4b00", punto: "#f0a020" },
  confirmada: { texto: "Confirmada", fondo: "#e6f4fb", tinta: "#145a87", punto: AZUL },
  atendida: { texto: "Atendida", fondo: "#e7f6f1", tinta: "#1d6b5a", punto: MENTA },
};

type Pestana = "agenda" | "pacientes" | "reportes";

type Props = {
  citas: Cita[];
  setCitas: React.Dispatch<React.SetStateAction<Cita[]>>;
  reiniciar: () => void;
  diaInicial: string | null;
  alMensaje: (m: string) => void;
  irAPagina: () => void;
};

export function PanelClinica({ citas, setCitas, reiniciar, diaInicial, alMensaje, irAPagina }: Props) {
  const dias = useMemo(proximosDias, []);
  const [pestana, setPestana] = useState<Pestana>("agenda");
  const [dia, setDia] = useState<string>(diaInicial ?? iso(dias[0]));
  const [detalle, setDetalle] = useState<Cita | null>(null);
  const [nueva, setNueva] = useState<{ hora?: string; doctor?: string } | null>(null);
  const [expediente, setExpediente] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Panel · Clínica Aurora · Demo de Jzet Labs";
  }, []);

  const cambiar = (id: string, cambio: Partial<Cita> | null) =>
    setCitas((cs) => (cambio === null ? cs.filter((c) => c.id !== id) : cs.map((c) => (c.id === id ? { ...c, ...cambio, nueva: false } : c))));

  const menu: [Pestana, string, typeof CalendarDays][] = [
    ["agenda", "Agenda", CalendarDays],
    ["pacientes", "Pacientes", Users],
    ["reportes", "Reportes", BarChart3],
  ];

  return (
    <div className="min-h-screen bg-[#f2f6f9] text-[#0f2a3a] lg:grid lg:grid-cols-[230px_1fr]">
      {/* menú lateral (compu) */}
      <aside className="hidden lg:flex flex-col gap-1 border-r border-[#0f2a3a]/10 bg-white p-4">
        <div className="px-2 pb-5 pt-1">
          <p className="font-extrabold text-[1.15rem]">Aurora</p>
          <p className="text-[0.78rem] opacity-55">Panel de la clínica</p>
        </div>
        {menu.map(([id, t, Icono]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPestana(id)}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left font-semibold transition ${pestana === id ? "text-white" : "hover:bg-[#0f2a3a]/5"}`}
            style={pestana === id ? { background: AZUL } : undefined}
          >
            <Icono size={18} /> {t}
          </button>
        ))}
        <div className="mt-auto space-y-1 pt-6">
          <button type="button" onClick={irAPagina} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[0.9rem] opacity-75 hover:bg-[#0f2a3a]/5">
            <ExternalLink size={16} /> Ver página de pacientes
          </button>
          <button type="button" onClick={reiniciar} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[0.9rem] opacity-75 hover:bg-[#0f2a3a]/5">
            <RotateCcw size={16} /> Reiniciar datos de ejemplo
          </button>
        </div>
      </aside>

      <main className="min-w-0 pb-24 lg:pb-10">
        {/* pestañas (celular) */}
        <nav className="lg:hidden sticky top-0 z-20 flex border-b border-[#0f2a3a]/10 bg-white" aria-label="Secciones del panel">
          {menu.map(([id, t, Icono]) => (
            <button key={id} type="button" onClick={() => setPestana(id)} className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[0.75rem] font-semibold ${pestana === id ? "" : "opacity-50"}`} style={pestana === id ? { color: AZUL } : undefined}>
              <Icono size={19} /> {t}
            </button>
          ))}
        </nav>

        <div className="mx-auto max-w-6xl p-4 sm:p-8">
          {pestana === "agenda" && (
            <Agenda
              dias={dias}
              dia={dia}
              setDia={setDia}
              citas={citas}
              alAbrir={setDetalle}
              alNueva={(hora, doctor) => setNueva({ hora, doctor })}
            />
          )}
          {pestana === "pacientes" && <Pacientes citas={citas} alAbrir={setExpediente} />}
          {pestana === "reportes" && <Reportes citas={citas} dias={dias} />}
          <p className="mt-8 text-center text-xs opacity-50">Panel de demostración con datos de ejemplo. Lo que cambie aquí solo se guarda en este navegador.</p>
        </div>
      </main>

      {/* detalle de la cita */}
      <Modal abierto={!!detalle} alCerrar={() => setDetalle(null)} titulo="Detalle de la cita" ancho="sm:w-[min(28rem,92vw)]">
        {detalle && (
          <DetalleCita
            cita={citas.find((c) => c.id === detalle.id) ?? detalle}
            alCambiar={(cambio) => {
              cambiar(detalle.id, cambio);
              if (cambio === null) setDetalle(null);
            }}
            alRecordar={(c) => {
              setDetalle(null);
              const d = desdeIso(c.dia);
              alMensaje(
                `Hola, ${c.paciente.split(" ")[0]}. Le recordamos su cita de ${servicioPor(c.servicio).nombre.toLowerCase()} el ${DIAS_LARGOS[d.getDay()].toLowerCase()} ${d.getDate()} a las ${c.hora} con ${doctorPor(c.doctor).nombre}. Responda 1 para confirmar o 2 para cambiarla. Clínica Aurora.`,
              );
            }}
            alExpediente={(p) => {
              setDetalle(null);
              setExpediente(p);
            }}
          />
        )}
      </Modal>

      {/* nueva cita */}
      <Modal abierto={!!nueva} alCerrar={() => setNueva(null)} titulo="Nueva cita" ancho="sm:w-[min(28rem,92vw)]">
        {nueva && (
          <NuevaCita
            dia={desdeIso(dia)}
            citas={citas}
            inicial={nueva}
            alGuardar={(c) => {
              setCitas((cs) => [...cs, c]);
              setNueva(null);
            }}
          />
        )}
      </Modal>

      {/* expediente */}
      <Modal abierto={!!expediente} alCerrar={() => setExpediente(null)} titulo="Expediente" ancho="sm:w-[min(44rem,94vw)]">
        {expediente && <Expediente paciente={expediente} citas={citas} />}
      </Modal>
    </div>
  );
}

/* ---------------- agenda ---------------- */

function Agenda({
  dias,
  dia,
  setDia,
  citas,
  alAbrir,
  alNueva,
}: {
  dias: Date[];
  dia: string;
  setDia: (d: string) => void;
  citas: Cita[];
  alAbrir: (c: Cita) => void;
  alNueva: (hora?: string, doctor?: string) => void;
}) {
  const d = desdeIso(dia);
  const delDia = citas.filter((c) => c.dia === dia);
  const horas = horasDelDia(d);
  const porConfirmar = delDia.filter((c) => c.estado === "por-confirmar").length;
  const atendidas = delDia.filter((c) => c.estado === "atendida").length;
  const ingreso = delDia.reduce((s, c) => s + servicioPor(c.servicio).precio, 0);
  const doctoresHoy = DOCTORES.filter((x) => x.trabaja.includes(d.getDay()));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] opacity-55">
            {dia === iso(new Date()) ? "Hoy · " : ""}
            {DIAS_LARGOS[d.getDay()]}
          </p>
          <h1 className="!text-[#0f2a3a] text-[1.9rem] sm:text-[2.3rem] font-extrabold tracking-[-0.02em]">
            {d.getDate()} de {MESES_LARGOS[d.getMonth()]}
          </h1>
        </div>
        <button type="button" onClick={() => alNueva()} className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-bold text-white active:scale-95 transition" style={{ background: MENTA }}>
          <Plus size={18} /> Nueva cita
        </button>
      </div>

      {/* días */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {dias.map((x) => {
          const activo = iso(x) === dia;
          const n = citas.filter((c) => c.dia === iso(x)).length;
          return (
            <button
              key={iso(x)}
              type="button"
              onClick={() => setDia(iso(x))}
              className={`shrink-0 w-16 rounded-2xl py-2 text-center transition active:scale-95 ${activo ? "text-white" : "bg-white hover:bg-white/70"}`}
              style={activo ? { background: TINTA } : undefined}
            >
              <span className="block text-[0.7rem] font-semibold uppercase opacity-70">{iso(x) === iso(new Date()) ? "Hoy" : DIAS_CORTOS[x.getDay()]}</span>
              <span className="block text-[1.25rem] font-extrabold leading-tight">{x.getDate()}</span>
              <span className={`block text-[0.65rem] ${activo ? "opacity-70" : "opacity-45"}`}>{n} citas</span>
            </button>
          );
        })}
      </div>

      {/* números del día */}
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tarjeta titulo="Citas del día" valor={delDia.length} nota={`${atendidas} atendidas`} />
        <Tarjeta titulo="Por confirmar" valor={porConfirmar} nota={porConfirmar ? "Mándeles recordatorio" : "Todo confirmado"} alerta={porConfirmar > 0} />
        <Tarjeta titulo="Ingreso estimado" valor={qz(ingreso)} nota="Según los servicios" />
        <div className="rounded-2xl bg-white p-4">
          <p className="text-[0.82rem] font-semibold opacity-60">Ocupación</p>
          <div className="mt-2 space-y-2">
            {DOCTORES.map((doc) => {
              const trabaja = doc.trabaja.includes(d.getDay());
              const pct = trabaja ? Math.round((delDia.filter((c) => c.doctor === doc.id).length / horas.length) * 100) : 0;
              return (
                <div key={doc.id}>
                  <div className="flex justify-between text-[0.8rem] font-semibold">
                    <span>{doc.corto}</span>
                    <span className="opacity-60">{trabaja ? `${pct}%` : "No atiende"}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-[#0f2a3a]/8">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: MENTA }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* agenda por doctor */}
      <div className="mt-5 overflow-hidden rounded-2xl bg-white">
        <div className="grid border-b border-[#0f2a3a]/10" style={{ gridTemplateColumns: `64px repeat(${DOCTORES.length}, minmax(0, 1fr))` }}>
          <span />
          {DOCTORES.map((doc) => (
            <div key={doc.id} className="flex items-center gap-2 px-3 py-3 border-l border-[#0f2a3a]/8">
              <img src={doc.foto} alt="" className="w-8 h-8 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate text-[0.88rem] font-bold">{doc.corto}</p>
                <p className="truncate text-[0.72rem] opacity-55">{doctoresHoy.includes(doc) ? doc.area.split(" ")[0] : "No atiende hoy"}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="max-h-[560px] overflow-y-auto">
          {horas.map((h) => (
            <div key={h} className="grid border-b border-[#0f2a3a]/6 last:border-0" style={{ gridTemplateColumns: `64px repeat(${DOCTORES.length}, minmax(0, 1fr))` }}>
              <span className={`px-3 py-2 text-[0.75rem] font-semibold tabular-nums ${yaPaso(d, h, 0) ? "opacity-30" : "opacity-60"}`}>{h}</span>
              {DOCTORES.map((doc) => {
                const c = delDia.find((x) => x.hora === h && x.doctor === doc.id);
                const trabaja = doc.trabaja.includes(d.getDay());
                if (c) {
                  const e = ESTADOS[c.estado];
                  return (
                    <div key={doc.id} className="border-l border-[#0f2a3a]/8 p-1">
                      <button
                        type="button"
                        onClick={() => alAbrir(c)}
                        className={`w-full rounded-lg px-2.5 py-1.5 text-left transition hover:brightness-95 active:scale-[0.98] ${c.nueva ? "ring-2 ring-offset-1" : ""}`}
                        style={{ background: e.fondo, color: e.tinta, ...(c.nueva ? { ["--tw-ring-color" as string]: MENTA } : {}) }}
                      >
                        <span className="flex items-center gap-1.5 text-[0.8rem] font-bold">
                          <span className="w-1.5 h-1.5 shrink-0 rounded-full" style={{ background: e.punto }} />
                          <span className="truncate">{c.paciente}</span>
                          {c.nueva && <span className="ml-auto shrink-0 rounded-full bg-white px-1.5 text-[0.6rem]">Nueva</span>}
                        </span>
                        <span className="block truncate text-[0.7rem] opacity-80">{servicioPor(c.servicio).nombre}</span>
                      </button>
                    </div>
                  );
                }
                return (
                  <div key={doc.id} className="border-l border-[#0f2a3a]/8 p-1">
                    {trabaja && !yaPaso(d, h, 0) ? (
                      <button type="button" onClick={() => alNueva(h, doc.id)} className="group h-full min-h-[38px] w-full rounded-lg text-[0.72rem] font-semibold opacity-0 hover:opacity-100 focus:opacity-100 transition" style={{ background: CIELO, color: AZUL }}>
                        <Plus size={13} className="inline -mt-0.5" /> Agendar
                      </button>
                    ) : (
                      <div className={`min-h-[38px] rounded-lg ${trabaja ? "" : "bg-[repeating-linear-gradient(135deg,rgba(15,42,58,.04)_0_6px,transparent_6px_12px)]"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-[0.78rem] opacity-70">
        {(Object.keys(ESTADOS) as Estado[]).map((k) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: ESTADOS[k].punto }} /> {ESTADOS[k].texto}
          </span>
        ))}
      </div>
    </>
  );
}

function Tarjeta({ titulo, valor, nota, alerta }: { titulo: string; valor: string | number; nota: string; alerta?: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-[0.82rem] font-semibold opacity-60">{titulo}</p>
      <p className="mt-1 text-[1.9rem] font-extrabold leading-none" style={alerta ? { color: "#c27400" } : undefined}>
        {valor}
      </p>
      <p className="mt-1.5 text-[0.75rem] opacity-55">{nota}</p>
    </div>
  );
}

function DetalleCita({
  cita,
  alCambiar,
  alRecordar,
  alExpediente,
}: {
  cita: Cita;
  alCambiar: (c: Partial<Cita> | null) => void;
  alRecordar: (c: Cita) => void;
  alExpediente: (paciente: string) => void;
}) {
  const s = servicioPor(cita.servicio);
  const doc = doctorPor(cita.doctor);
  const d = desdeIso(cita.dia);
  const e = ESTADOS[cita.estado];
  return (
    <div className="px-6 pt-6 pb-6 text-[#0f2a3a]">
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-bold" style={{ background: e.fondo, color: e.tinta }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: e.punto }} /> {e.texto}
      </span>
      <h3 className="mt-3 pr-8 !text-[#0f2a3a] text-[1.6rem] font-extrabold">{cita.paciente}</h3>
      <ul className="mt-4 space-y-1.5 text-[0.95rem]">
        <li>
          <b>{s.nombre}</b> · {s.desde ? "desde " : ""}
          {qz(s.precio)}
        </li>
        <li>
          {DIAS_LARGOS[d.getDay()]} {d.getDate()} de {MESES_LARGOS[d.getMonth()]}, {cita.hora} · {s.minutos} min
        </li>
        <li>{doc.nombre}</li>
      </ul>
      <div className="mt-6 grid grid-cols-2 gap-2">
        {cita.estado === "por-confirmar" && (
          <button type="button" onClick={() => alCambiar({ estado: "confirmada" })} className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl py-3 font-bold text-white active:scale-[0.98]" style={{ background: AZUL }}>
            <Check size={17} /> Confirmar cita
          </button>
        )}
        {cita.estado !== "atendida" && (
          <button type="button" onClick={() => alRecordar(cita)} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#0f2a3a]/15 py-2.5 text-[0.9rem] font-bold active:scale-[0.98]">
            <Bell size={16} /> Recordatorio
          </button>
        )}
        {cita.estado !== "atendida" && (
          <button type="button" onClick={() => alCambiar({ estado: "atendida" })} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#0f2a3a]/15 py-2.5 text-[0.9rem] font-bold active:scale-[0.98]">
            <ClipboardList size={16} /> Atendida
          </button>
        )}
        <button type="button" onClick={() => alExpediente(cita.paciente)} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#0f2a3a]/15 py-2.5 text-[0.9rem] font-bold active:scale-[0.98]">
          <UserRound size={16} /> Expediente
        </button>
        <button type="button" onClick={() => alCambiar(null)} className="inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[0.9rem] font-bold text-[#b42318] hover:bg-[#b42318]/5 active:scale-[0.98]">
          <X size={16} /> Cancelar cita
        </button>
      </div>
    </div>
  );
}

function NuevaCita({ dia, citas, inicial, alGuardar }: { dia: Date; citas: Cita[]; inicial: { hora?: string; doctor?: string }; alGuardar: (c: Cita) => void }) {
  const doctoresDia = DOCTORES.filter((x) => x.trabaja.includes(dia.getDay()));
  const [doctor, setDoctor] = useState(inicial.doctor ?? doctoresDia[0]?.id ?? DOCTORES[0].id);
  const libres = horasDelDia(dia).filter((h) => !yaPaso(dia, h, 0) && !tomado(citas, dia, h, doctor));
  const [hora, setHora] = useState(inicial.hora ?? libres[0] ?? "");
  const [servicio, setServicio] = useState(SERVICIOS[1].id);
  const [paciente, setPaciente] = useState("");
  const [error, setError] = useState("");

  if (!doctoresDia.length)
    return <p className="px-6 py-8 text-center text-[#0f2a3a]">Este día no atiende ningún doctor.</p>;

  return (
    <form
      className="px-6 pt-6 pb-6 space-y-4 text-[#0f2a3a]"
      onSubmit={(e) => {
        e.preventDefault();
        if (!paciente.trim()) return setError("Escriba el nombre del paciente.");
        if (!hora) return setError("No quedan horarios libres con este doctor.");
        alGuardar({ id: `${iso(dia)}-${hora}-${doctor}-${Date.now()}`, dia: iso(dia), hora, doctor, servicio, paciente: paciente.trim(), estado: "confirmada" });
      }}
      noValidate
    >
      <h3 className="pr-8 !text-[#0f2a3a] text-[1.5rem] font-extrabold">Nueva cita</h3>
      <p className="-mt-2 text-sm opacity-60">
        {DIAS_LARGOS[dia.getDay()]} {dia.getDate()} de {MESES_LARGOS[dia.getMonth()]}
      </p>
      <label className="block">
        <span className="text-sm font-semibold">Paciente</span>
        <input
          value={paciente}
          onChange={(e) => {
            setPaciente(e.target.value);
            setError("");
          }}
          placeholder="Nombre y apellido"
          className="mt-1.5 w-full rounded-xl border border-[#0f2a3a]/20 px-3 py-2.5 focus:outline-none focus:border-[#1e6fa8]"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-semibold">Doctor</span>
          <select
            value={doctor}
            onChange={(e) => {
              setDoctor(e.target.value);
              setHora("");
            }}
            className="mt-1.5 w-full rounded-xl border border-[#0f2a3a]/20 bg-white px-3 py-2.5"
          >
            {doctoresDia.map((x) => (
              <option key={x.id} value={x.id}>
                {x.corto}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Hora</span>
          <select value={hora} onChange={(e) => setHora(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#0f2a3a]/20 bg-white px-3 py-2.5">
            <option value="">Elija</option>
            {libres.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-semibold">Servicio</span>
        <select value={servicio} onChange={(e) => setServicio(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#0f2a3a]/20 bg-white px-3 py-2.5">
          {SERVICIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre} · {qz(s.precio)}
            </option>
          ))}
        </select>
      </label>
      {error && <p className="text-sm text-[#b42318]">{error}</p>}
      <button type="submit" className="w-full rounded-xl py-3 font-bold text-white active:scale-[0.98]" style={{ background: MENTA }}>
        Guardar cita
      </button>
    </form>
  );
}

/* ---------------- pacientes ---------------- */

function Pacientes({ citas, alAbrir }: { citas: Cita[]; alAbrir: (p: string) => void }) {
  const [buscar, setBuscar] = useState("");
  const lista = useMemo(() => {
    const m = new Map<string, Cita[]>();
    citas.forEach((c) => m.set(c.paciente, [...(m.get(c.paciente) ?? []), c]));
    return [...m.entries()]
      .map(([nombre, cs]) => ({ nombre, citas: cs.sort((a, b) => (a.dia + a.hora).localeCompare(b.dia + b.hora)) }))
      .filter((p) => p.nombre.toLowerCase().includes(buscar.toLowerCase().trim()))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [citas, buscar]);

  return (
    <>
      <h1 className="!text-[#0f2a3a] text-[1.9rem] sm:text-[2.3rem] font-extrabold tracking-[-0.02em]">Pacientes</h1>
      <label className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-3">
        <Search size={18} className="opacity-50" />
        <input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar por nombre…" className="flex-1 bg-transparent focus:outline-none" />
      </label>
      <ul className="mt-4 grid sm:grid-cols-2 gap-3">
        {lista.map((p) => {
          const proxima = p.citas.find((c) => c.estado !== "atendida");
          return (
            <li key={p.nombre}>
              <button type="button" onClick={() => alAbrir(p.nombre)} className="w-full flex items-center gap-3 rounded-2xl bg-white p-4 text-left hover:shadow-md transition active:scale-[0.99]">
                <span className="grid place-items-center w-11 h-11 shrink-0 rounded-full font-bold text-white" style={{ background: AZUL }}>
                  {p.nombre
                    .split(" ")
                    .map((x) => x[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold truncate">{p.nombre}</span>
                  <span className="block text-[0.8rem] opacity-60">
                    {proxima ? `Próxima: ${DIAS_CORTOS[desdeIso(proxima.dia).getDay()]} ${desdeIso(proxima.dia).getDate()}, ${proxima.hora}` : "Sin citas próximas"} · {p.citas.length} {p.citas.length === 1 ? "cita" : "citas"}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {!lista.length && <p className="mt-6 text-center opacity-60">No hay pacientes con ese nombre.</p>}
    </>
  );
}

/* Odontograma simple: 32 piezas, se toca cada una para marcar su estado */
const PIEZAS = [
  [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
];
const MARCAS = [
  { id: "sano", texto: "Sano", color: "#ffffff", borde: "rgba(15,42,58,.2)" },
  { id: "caries", texto: "Caries", color: "#f6c36b", borde: "#d9971e" },
  { id: "resina", texto: "Resina", color: "#8fc7ea", borde: AZUL },
  { id: "falta", texto: "Extraído", color: "#e5e7eb", borde: "#9ca3af" },
];

function Expediente({ paciente, citas }: { paciente: string; citas: Cita[] }) {
  const clave = `aurora-exp-${paciente}`;
  const [datos, setDatos] = useState<{ notas: string; dientes: Record<number, number> }>(() => {
    try {
      return JSON.parse(localStorage.getItem(clave) ?? "") as { notas: string; dientes: Record<number, number> };
    } catch {
      return { notas: "", dientes: { 16: 2, 26: 1, 36: 2, 48: 3 } };
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(datos));
    } catch {
      /* modo privado */
    }
  }, [clave, datos]);

  const historial = citas.filter((c) => c.paciente === paciente).sort((a, b) => (a.dia + a.hora).localeCompare(b.dia + b.hora));
  const tel = `5${String(paciente.length * 731 + 1000000).slice(0, 3)}-${String(paciente.charCodeAt(0) * 37).padStart(4, "0").slice(0, 4)}`;

  return (
    <div className="px-6 pt-6 pb-7 text-[#0f2a3a]">
      <div className="flex items-center gap-3 pr-8">
        <span className="grid place-items-center w-12 h-12 rounded-full font-bold text-white" style={{ background: AZUL }}>
          {paciente
            .split(" ")
            .map((x) => x[0])
            .slice(0, 2)
            .join("")}
        </span>
        <div>
          <h3 className="!text-[#0f2a3a] text-[1.5rem] font-extrabold leading-tight">{paciente}</h3>
          <p className="text-sm opacity-60">Tel. {tel} (de ejemplo)</p>
        </div>
      </div>

      <p className="mt-6 text-sm font-bold uppercase tracking-[0.1em] opacity-55">Odontograma</p>
      <p className="text-[0.8rem] opacity-55">Toque una pieza para cambiar su estado.</p>
      <div className="mt-3 overflow-x-auto">
        <div className="min-w-[520px] space-y-1.5">
          {PIEZAS.map((fila, k) => (
            <div key={k} className="flex justify-center gap-1">
              {fila.map((n, i) => {
                const m = MARCAS[datos.dientes[n] ?? 0];
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setDatos((x) => ({ ...x, dientes: { ...x.dientes, [n]: ((x.dientes[n] ?? 0) + 1) % MARCAS.length } }))}
                    title={`Pieza ${n}: ${m.texto}`}
                    aria-label={`Pieza ${n}: ${m.texto}`}
                    className={`w-7 h-9 rounded-md border-2 text-[0.6rem] font-bold transition active:scale-90 ${i === 7 ? "mr-2" : ""} ${m.id === "falta" ? "line-through opacity-60" : ""}`}
                    style={{ background: m.color, borderColor: m.borde }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-3 text-[0.75rem]">
        {MARCAS.map((m) => (
          <span key={m.id} className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm border" style={{ background: m.color, borderColor: m.borde }} /> {m.texto}
          </span>
        ))}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.1em] opacity-55">Citas</p>
          <ul className="mt-2 space-y-1.5">
            {historial.map((c) => {
              const d = desdeIso(c.dia);
              return (
                <li key={c.id} className="flex items-center gap-2 text-[0.88rem]">
                  <span className="w-1.5 h-1.5 shrink-0 rounded-full" style={{ background: ESTADOS[c.estado].punto }} />
                  {DIAS_CORTOS[d.getDay()]} {d.getDate()}, {c.hora} · {servicioPor(c.servicio).nombre}
                </li>
              );
            })}
          </ul>
        </div>
        <label className="block">
          <span className="text-sm font-bold uppercase tracking-[0.1em] opacity-55">Notas del doctor</span>
          <textarea
            rows={5}
            value={datos.notas}
            onChange={(e) => setDatos((x) => ({ ...x, notas: e.target.value }))}
            placeholder="Alergias, tratamientos, observaciones…"
            className="mt-2 w-full resize-none rounded-xl border border-[#0f2a3a]/20 px-3 py-2 text-[0.92rem] focus:outline-none focus:border-[#1e6fa8]"
          />
        </label>
      </div>
    </div>
  );
}

/* ---------------- reportes ---------------- */

function Reportes({ citas, dias }: { citas: Cita[]; dias: Date[] }) {
  const porDia = dias.map((d) => ({ d, n: citas.filter((c) => c.dia === iso(d)).length }));
  const max = Math.max(1, ...porDia.map((x) => x.n));
  const conteo = SERVICIOS.map((s) => ({ s, n: citas.filter((c) => c.servicio === s.id).length })).sort((a, b) => b.n - a.n);
  const maxS = Math.max(1, ...conteo.map((x) => x.n));
  const total = citas.reduce((s, c) => s + servicioPor(c.servicio).precio, 0);
  const confirmadas = citas.filter((c) => c.estado !== "por-confirmar").length;

  return (
    <>
      <h1 className="!text-[#0f2a3a] text-[1.9rem] sm:text-[2.3rem] font-extrabold tracking-[-0.02em]">Reportes</h1>
      <p className="mt-1 opacity-60">Próximos 10 días de atención.</p>
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Tarjeta titulo="Citas agendadas" valor={citas.length} nota="En los próximos 10 días" />
        <Tarjeta titulo="Ingreso estimado" valor={qz(total)} nota="Según los servicios" />
        <Tarjeta titulo="Confirmadas" valor={`${Math.round((confirmadas / Math.max(1, citas.length)) * 100)}%`} nota={`${citas.length - confirmadas} por confirmar`} />
      </div>
      <div className="mt-5 grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white p-5">
          <p className="font-bold">Citas por día</p>
          <div className="mt-5 flex h-44 items-end gap-2">
            {porDia.map(({ d, n }) => (
              <div key={iso(d)} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[0.7rem] font-semibold opacity-60">{n}</span>
                <div className="w-full rounded-t-lg transition-all" style={{ height: `${(n / max) * 100}%`, minHeight: 4, background: AZUL }} />
                <span className="text-[0.68rem] opacity-55">{DIAS_CORTOS[d.getDay()]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5">
          <p className="font-bold">Servicios más pedidos</p>
          <ul className="mt-4 space-y-3">
            {conteo.map(({ s, n }) => (
              <li key={s.id}>
                <div className="flex justify-between text-[0.88rem]">
                  <span className="font-semibold">{s.nombre}</span>
                  <span className="opacity-60">{n}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-[#0f2a3a]/8">
                  <div className="h-full rounded-full" style={{ width: `${(n / maxS) * 100}%`, background: MENTA }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
