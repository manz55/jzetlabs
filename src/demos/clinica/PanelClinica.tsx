/*
 * Sistema de la clínica Aurora: lo que ven recepción, los doctores y el dueño.
 * Cada rol ve solo lo suyo:
 *  - Recepción: agenda de todos, confirmar, recordatorios, cobros, pacientes.
 *  - Doctor: su agenda, consultas, expediente con odontograma y plan de
 *    tratamiento. Lo demás (todos los pacientes, cobros, reportes), solo si el
 *    dueño se lo permite.
 *  - Dueño: todo, más reportes y "Equipo y permisos".
 * Datos de ejemplo, guardados en el navegador.
 */
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3, Bell, CalendarDays, Check, ClipboardList, ExternalLink, LogOut, Plus, RotateCcw, Search, ShieldCheck, Stethoscope, Trash2, UserRound, Users, Wallet, X,
} from "lucide-react";
import { Modal } from "@/components/Modal";
import { qz } from "../comun";
import {
  AZUL, CIELO, DOCTORES, MENTA, SERVICIOS, TINTA,
  DIAS_CORTOS, DIAS_LARGOS, MESES_LARGOS, ROLES,
  desdeIso, doctorPor, horasDelDia, iso, proximosDias, servicioPor, tomado, useExpediente, yaPaso,
  type Cita, type CitaExtra, type Consulta, type Doctor, type Estado, type Metodo, type Permisos, type Sesion,
} from "./datos";

const ESTADOS: Record<Estado, { texto: string; fondo: string; tinta: string; punto: string }> = {
  "por-confirmar": { texto: "Por confirmar", fondo: "#fff4e5", tinta: "#8a4b00", punto: "#f0a020" },
  confirmada: { texto: "Confirmada", fondo: "#e6f4fb", tinta: "#145a87", punto: AZUL },
  atendida: { texto: "Atendida", fondo: "#e7f6f1", tinta: "#1d6b5a", punto: MENTA },
};
const METODOS: { id: Metodo; texto: string }[] = [
  { id: "efectivo", texto: "Efectivo" },
  { id: "tarjeta", texto: "Tarjeta" },
  { id: "transferencia", texto: "Transferencia" },
];
const iniciales = (n: string) =>
  n
    .split(" ")
    .filter((x) => !x.endsWith("."))
    .map((x) => x[0])
    .slice(0, 2)
    .join("");

type Pestana = "agenda" | "pacientes" | "cobros" | "reportes" | "equipo";
type SetExtras = React.Dispatch<React.SetStateAction<Record<string, CitaExtra>>>;

type Props = {
  sesion: Sesion;
  citas: Cita[];
  setCitas: React.Dispatch<React.SetStateAction<Cita[]>>;
  extras: Record<string, CitaExtra>;
  setExtras: SetExtras;
  permisos: Permisos;
  setPermisos: React.Dispatch<React.SetStateAction<Permisos>>;
  reiniciar: () => void;
  diaInicial: string | null;
  alMensaje: (m: string) => void;
  irAPagina: () => void;
  alSalir: () => void;
};

export function PanelClinica({ sesion, citas, setCitas, extras, setExtras, permisos, setPermisos, reiniciar, diaInicial, alMensaje, irAPagina, alSalir }: Props) {
  const dias = useMemo(proximosDias, []);
  const esDoc = sesion.rol === "doctor";
  const yo = esDoc ? doctorPor(sesion.doctor!) : null;
  const perm = esDoc ? permisos[sesion.doctor!] : { todos: true, reportes: sesion.rol === "admin", cobros: true };
  const usuario = ROLES.find((r) => r.rol === sesion.rol && r.doctor === sesion.doctor)!;

  const [pestana, setPestana] = useState<Pestana>("agenda");
  const [dia, setDia] = useState<string>(diaInicial ?? iso(dias[0]));
  const [detalle, setDetalle] = useState<string | null>(null);
  const [consulta, setConsulta] = useState<string | null>(null);
  const [nueva, setNueva] = useState<{ hora?: string; doctor?: string } | null>(null);
  const [expediente, setExpediente] = useState<string | null>(null);

  useEffect(() => {
    document.title = `${usuario.cargo} · Clínica Aurora · Demo de Jzet Labs`;
  }, [usuario.cargo]);

  // si le quitan un permiso mientras está en esa pestaña, vuelve a la agenda
  useEffect(() => {
    if ((pestana === "reportes" && !perm.reportes) || (pestana === "cobros" && !perm.cobros) || (pestana === "equipo" && sesion.rol !== "admin")) setPestana("agenda");
  }, [pestana, perm.reportes, perm.cobros, sesion.rol]);

  const cambiar = (id: string, cambio: Partial<Cita> | null) =>
    setCitas((cs) => (cambio === null ? cs.filter((c) => c.id !== id) : cs.map((c) => (c.id === id ? { ...c, ...cambio, nueva: false } : c))));
  const extra = (id: string, cambio: Partial<CitaExtra>) => setExtras((x) => ({ ...x, [id]: { ...x[id], ...cambio } }));

  const menu: [Pestana, string, typeof CalendarDays][] = [
    ["agenda", esDoc ? "Mi agenda" : "Agenda", CalendarDays],
    ["pacientes", esDoc && !perm.todos ? "Mis pacientes" : "Pacientes", Users],
    ...(perm.cobros ? ([["cobros", "Cobros", Wallet]] as [Pestana, string, typeof CalendarDays][]) : []),
    ...(perm.reportes ? ([["reportes", "Reportes", BarChart3]] as [Pestana, string, typeof CalendarDays][]) : []),
    ...(sesion.rol === "admin" ? ([["equipo", "Equipo y permisos", ShieldCheck]] as [Pestana, string, typeof CalendarDays][]) : []),
  ];

  const citaDetalle = detalle ? citas.find((c) => c.id === detalle) : null;
  const citaConsulta = consulta ? citas.find((c) => c.id === consulta) : null;

  return (
    <div className="min-h-screen bg-[#f2f6f9] text-[#0f2a3a] lg:grid lg:grid-cols-[240px_1fr]">
      {/* menú lateral (compu) */}
      <aside className="hidden lg:flex flex-col gap-1 border-r border-[#0f2a3a]/10 bg-white p-4">
        <div className="px-2 pb-4 pt-1">
          <p className="font-extrabold text-[1.15rem]">Aurora</p>
          <p className="text-[0.78rem] opacity-55">Sistema de la clínica</p>
        </div>
        <Usuario nombre={usuario.nombre} cargo={usuario.cargo} foto={yo?.foto} />
        <div className="h-3" />
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
          <button type="button" onClick={alSalir} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[0.9rem] font-semibold hover:bg-[#0f2a3a]/5">
            <LogOut size={16} /> Cambiar de usuario
          </button>
          <button type="button" onClick={irAPagina} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[0.9rem] opacity-75 hover:bg-[#0f2a3a]/5">
            <ExternalLink size={16} /> Ver página de pacientes
          </button>
          <button type="button" onClick={reiniciar} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[0.9rem] opacity-75 hover:bg-[#0f2a3a]/5">
            <RotateCcw size={16} /> Reiniciar datos de ejemplo
          </button>
        </div>
      </aside>

      <main className="min-w-0 pb-24 lg:pb-10">
        {/* barra de usuario y pestañas (celular) */}
        <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-[#0f2a3a]/10">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5">
            <Usuario nombre={usuario.nombre} cargo={usuario.cargo} foto={yo?.foto} />
            <button type="button" onClick={alSalir} className="inline-flex items-center gap-1.5 rounded-full border border-[#0f2a3a]/15 px-3 py-1.5 text-[0.78rem] font-semibold">
              <LogOut size={14} /> Cambiar
            </button>
          </div>
          <nav className="flex overflow-x-auto [scrollbar-width:none]" aria-label="Secciones del sistema">
            {menu.map(([id, t, Icono]) => (
              <button key={id} type="button" onClick={() => setPestana(id)} className={`flex-1 min-w-[76px] flex flex-col items-center gap-0.5 py-2 text-[0.7rem] font-semibold ${pestana === id ? "" : "opacity-50"}`} style={pestana === id ? { color: AZUL } : undefined}>
                <Icono size={18} /> {t.split(" ")[0] === "Equipo" ? "Equipo" : t}
              </button>
            ))}
          </nav>
        </div>

        <div className="mx-auto max-w-6xl p-4 sm:p-8">
          {pestana === "agenda" && (
            <Agenda
              dias={dias}
              dia={dia}
              setDia={setDia}
              citas={yo ? citas.filter((c) => c.doctor === yo.id) : citas}
              doctores={yo ? [yo] : DOCTORES}
              verIngreso={perm.cobros}
              alAbrir={(c) => setDetalle(c.id)}
              alNueva={(hora, doctor) => setNueva({ hora, doctor: doctor ?? yo?.id })}
            />
          )}
          {pestana === "pacientes" && <Pacientes citas={esDoc && !perm.todos ? citas.filter((c) => c.doctor === yo!.id) : citas} soloMios={esDoc && !perm.todos} alAbrir={setExpediente} />}
          {pestana === "cobros" && <Cobros dias={dias} dia={dia} setDia={setDia} citas={yo ? citas.filter((c) => c.doctor === yo.id) : citas} extras={extras} alCobrar={(id, m) => extra(id, { pago: m })} />}
          {pestana === "reportes" && <Reportes citas={citas} dias={dias} extras={extras} />}
          {pestana === "equipo" && <Equipo permisos={permisos} setPermisos={setPermisos} citas={citas} />}
          <p className="mt-8 text-center text-xs opacity-50">Sistema de demostración con datos de ejemplo. Lo que cambie aquí solo se guarda en este navegador.</p>
        </div>
      </main>

      {/* detalle de la cita */}
      <Modal abierto={!!citaDetalle} alCerrar={() => setDetalle(null)} titulo="Detalle de la cita" ancho="sm:w-[min(28rem,92vw)]">
        {citaDetalle && (
          <DetalleCita
            cita={citaDetalle}
            extra={extras[citaDetalle.id]}
            sesion={sesion}
            puedeCobrar={perm.cobros}
            alCambiar={(cambio) => {
              cambiar(citaDetalle.id, cambio);
              if (cambio === null) setDetalle(null);
            }}
            alCobrar={(m) => extra(citaDetalle.id, { pago: m })}
            alConsulta={() => {
              setDetalle(null);
              setConsulta(citaDetalle.id);
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

      {/* consulta del doctor */}
      <Modal abierto={!!citaConsulta} alCerrar={() => setConsulta(null)} titulo="Consulta" ancho="sm:w-[min(34rem,94vw)]">
        {citaConsulta && (
          <FormConsulta
            cita={citaConsulta}
            inicial={extras[citaConsulta.id]?.consulta}
            soloLeer={!esDoc && sesion.rol !== "admin"}
            alGuardar={(c) => {
              extra(citaConsulta.id, { consulta: c });
              cambiar(citaConsulta.id, { estado: "atendida" });
              setConsulta(null);
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
            doctores={yo ? [yo] : DOCTORES}
            alGuardar={(c) => {
              setCitas((cs) => [...cs, c]);
              setNueva(null);
            }}
          />
        )}
      </Modal>

      {/* expediente */}
      <Modal abierto={!!expediente} alCerrar={() => setExpediente(null)} titulo="Expediente" ancho="sm:w-[min(48rem,94vw)]">
        {expediente && <Expediente paciente={expediente} citas={citas} extras={extras} editable={esDoc || sesion.rol === "admin"} />}
      </Modal>
    </div>
  );
}

function Usuario({ nombre, cargo, foto }: { nombre: string; cargo: string; foto?: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">
      {foto ? (
        <img src={foto} alt="" className="w-9 h-9 rounded-full object-cover" />
      ) : (
        <span className="grid place-items-center w-9 h-9 rounded-full text-white text-[0.8rem] font-bold" style={{ background: TINTA }}>
          {iniciales(nombre)}
        </span>
      )}
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[0.88rem] font-bold">{nombre}</p>
        <p className="truncate text-[0.72rem] opacity-55">{cargo}</p>
      </div>
    </div>
  );
}

/* ---------------- agenda ---------------- */

function Agenda({
  dias,
  dia,
  setDia,
  citas,
  doctores,
  verIngreso,
  alAbrir,
  alNueva,
}: {
  dias: Date[];
  dia: string;
  setDia: (d: string) => void;
  citas: Cita[];
  doctores: Doctor[];
  verIngreso: boolean;
  alAbrir: (c: Cita) => void;
  alNueva: (hora?: string, doctor?: string) => void;
}) {
  const d = desdeIso(dia);
  const delDia = citas.filter((c) => c.dia === dia);
  const horas = horasDelDia(d);
  const porConfirmar = delDia.filter((c) => c.estado === "por-confirmar").length;
  const atendidas = delDia.filter((c) => c.estado === "atendida").length;
  const ingreso = delDia.reduce((s, c) => s + servicioPor(c.servicio).precio, 0);
  const columnas = `64px repeat(${doctores.length}, minmax(0, 1fr))`;

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
      <div className={`mt-5 grid grid-cols-2 gap-3 ${verIngreso ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        <Tarjeta titulo="Citas del día" valor={delDia.length} nota={`${atendidas} atendidas`} />
        <Tarjeta titulo="Por confirmar" valor={porConfirmar} nota={porConfirmar ? "Mándeles recordatorio" : "Todo confirmado"} alerta={porConfirmar > 0} />
        {verIngreso && <Tarjeta titulo="Ingreso estimado" valor={qz(ingreso)} nota="Según los servicios" />}
        <div className="rounded-2xl bg-white p-4 col-span-2 lg:col-span-1">
          <p className="text-[0.82rem] font-semibold opacity-60">Ocupación</p>
          <div className="mt-2 space-y-2">
            {doctores.map((doc) => {
              const trabaja = doc.trabaja.includes(d.getDay());
              const pct = trabaja ? Math.round((delDia.filter((c) => c.doctor === doc.id).length / horas.length) * 100) : 0;
              return (
                <div key={doc.id}>
                  <div className="flex justify-between gap-2 text-[0.8rem] font-semibold">
                    <span className="truncate">{doc.corto}</span>
                    <span className="shrink-0 opacity-60">{trabaja ? `${pct}%` : "No atiende"}</span>
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
        <div className="grid border-b border-[#0f2a3a]/10" style={{ gridTemplateColumns: columnas }}>
          <span />
          {doctores.map((doc) => (
            <div key={doc.id} className="flex items-center gap-2 px-3 py-3 border-l border-[#0f2a3a]/8">
              <img src={doc.foto} alt="" className="w-8 h-8 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate text-[0.88rem] font-bold">{doc.corto}</p>
                <p className="truncate text-[0.72rem] opacity-55">{doc.trabaja.includes(d.getDay()) ? doc.area.split(" ")[0] : "No atiende hoy"}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="max-h-[560px] overflow-y-auto">
          {horas.map((h) => (
            <div key={h} className="grid border-b border-[#0f2a3a]/6 last:border-0" style={{ gridTemplateColumns: columnas }}>
              <span className={`px-3 py-2 text-[0.75rem] font-semibold tabular-nums ${yaPaso(d, h, 0) ? "opacity-30" : "opacity-60"}`}>{h}</span>
              {doctores.map((doc) => {
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
                      <button type="button" onClick={() => alNueva(h, doc.id)} className="h-full min-h-[38px] w-full rounded-lg text-[0.72rem] font-semibold opacity-0 hover:opacity-100 focus:opacity-100 transition" style={{ background: CIELO, color: AZUL }}>
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
  extra,
  sesion,
  puedeCobrar,
  alCambiar,
  alCobrar,
  alConsulta,
  alRecordar,
  alExpediente,
}: {
  cita: Cita;
  extra?: CitaExtra;
  sesion: Sesion;
  puedeCobrar: boolean;
  alCambiar: (c: Partial<Cita> | null) => void;
  alCobrar: (m: Metodo) => void;
  alConsulta: () => void;
  alRecordar: (c: Cita) => void;
  alExpediente: (paciente: string) => void;
}) {
  const s = servicioPor(cita.servicio);
  const doc = doctorPor(cita.doctor);
  const d = desdeIso(cita.dia);
  const e = ESTADOS[cita.estado];
  const esDoc = sesion.rol === "doctor";
  const boton = "inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#0f2a3a]/15 py-2.5 text-[0.9rem] font-bold active:scale-[0.98]";
  return (
    <div className="px-6 pt-6 pb-6 text-[#0f2a3a]">
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-bold" style={{ background: e.fondo, color: e.tinta }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: e.punto }} /> {e.texto}
        </span>
        {extra?.pago && <span className="rounded-full bg-[#e7f6f1] px-2.5 py-1 text-[0.75rem] font-bold text-[#1d6b5a]">Pagado · {METODOS.find((m) => m.id === extra.pago)!.texto}</span>}
      </div>
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
      {extra?.consulta && (
        <div className="mt-4 rounded-xl p-3 text-[0.88rem]" style={{ background: CIELO }}>
          <p className="font-bold">Diagnóstico</p>
          <p className="opacity-80">{extra.consulta.diagnostico || "—"}</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2">
        {/* lo del doctor */}
        {(esDoc || sesion.rol === "admin") && (
          <button type="button" onClick={alConsulta} className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl py-3 font-bold text-white active:scale-[0.98]" style={{ background: MENTA }}>
            <Stethoscope size={17} /> {extra?.consulta ? "Ver o editar la consulta" : "Atender: abrir consulta"}
          </button>
        )}
        {/* lo de recepción */}
        {!esDoc && cita.estado === "por-confirmar" && (
          <button type="button" onClick={() => alCambiar({ estado: "confirmada" })} className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl py-3 font-bold text-white active:scale-[0.98]" style={{ background: AZUL }}>
            <Check size={17} /> Confirmar cita
          </button>
        )}
        {!esDoc && cita.estado !== "atendida" && (
          <button type="button" onClick={() => alRecordar(cita)} className={boton}>
            <Bell size={16} /> Recordatorio
          </button>
        )}
        {!esDoc && cita.estado !== "atendida" && (
          <button type="button" onClick={() => alCambiar({ estado: "atendida" })} className={boton}>
            <ClipboardList size={16} /> Atendida
          </button>
        )}
        <button type="button" onClick={() => alExpediente(cita.paciente)} className={boton}>
          <UserRound size={16} /> Expediente
        </button>
        {!esDoc && (
          <button type="button" onClick={() => alCambiar(null)} className="inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[0.9rem] font-bold text-[#b42318] hover:bg-[#b42318]/5 active:scale-[0.98]">
            <X size={16} /> Cancelar cita
          </button>
        )}
      </div>

      {puedeCobrar && cita.estado === "atendida" && !extra?.pago && (
        <div className="mt-5 border-t border-[#0f2a3a]/10 pt-4">
          <p className="text-sm font-bold">Cobrar {qz(s.precio)}</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {METODOS.map((m) => (
              <button key={m.id} type="button" onClick={() => alCobrar(m.id)} className="rounded-xl py-2.5 text-[0.85rem] font-bold active:scale-95" style={{ background: CIELO, color: AZUL }}>
                {m.texto}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* La consulta: lo que escribe el doctor al atender */
function FormConsulta({ cita, inicial, soloLeer, alGuardar }: { cita: Cita; inicial?: Consulta; soloLeer: boolean; alGuardar: (c: Consulta) => void }) {
  const [c, setC] = useState<Consulta>(inicial ?? { motivo: "", diagnostico: "", tratamiento: servicioPor(cita.servicio).nombre, indicaciones: "" });
  const [error, setError] = useState("");
  const campo = (k: keyof Consulta, t: string, ph: string, filas = 2) => (
    <label className="block">
      <span className="text-sm font-semibold">{t}</span>
      <textarea
        rows={filas}
        value={c[k]}
        readOnly={soloLeer}
        onChange={(e) => {
          setC({ ...c, [k]: e.target.value });
          setError("");
        }}
        placeholder={ph}
        className="mt-1.5 w-full resize-none rounded-xl border border-[#0f2a3a]/20 px-3 py-2 text-[0.95rem] focus:outline-none focus:border-[#1e6fa8]"
      />
    </label>
  );
  return (
    <form
      className="px-6 pt-6 pb-6 space-y-3 text-[#0f2a3a]"
      onSubmit={(e) => {
        e.preventDefault();
        if (!c.diagnostico.trim()) return setError("Escriba el diagnóstico.");
        alGuardar(c);
      }}
      noValidate
    >
      <p className="text-sm font-semibold opacity-60">Consulta</p>
      <h3 className="-mt-2 pr-8 !text-[#0f2a3a] text-[1.5rem] font-extrabold">{cita.paciente}</h3>
      {campo("motivo", "Motivo de la visita", "Dolor en una muela de arriba…")}
      {campo("diagnostico", "Diagnóstico", "Caries en la pieza 26…")}
      {campo("tratamiento", "Tratamiento realizado", "Resina en la pieza 26…")}
      {campo("indicaciones", "Indicaciones para el paciente", "No comer en 2 horas. Volver en 6 meses…", 3)}
      {error && <p className="text-sm text-[#b42318]">{error}</p>}
      {!soloLeer && (
        <button type="submit" className="w-full rounded-xl py-3 font-bold text-white active:scale-[0.98]" style={{ background: MENTA }}>
          Guardar y marcar como atendida
        </button>
      )}
      <p className="text-xs opacity-55">Las indicaciones le aparecen al paciente en su portal.</p>
    </form>
  );
}

function NuevaCita({
  dia,
  citas,
  inicial,
  doctores,
  alGuardar,
}: {
  dia: Date;
  citas: Cita[];
  inicial: { hora?: string; doctor?: string };
  doctores: Doctor[];
  alGuardar: (c: Cita) => void;
}) {
  const doctoresDia = doctores.filter((x) => x.trabaja.includes(dia.getDay()));
  const [doctor, setDoctor] = useState(inicial.doctor && doctoresDia.some((x) => x.id === inicial.doctor) ? inicial.doctor : doctoresDia[0]?.id ?? "");
  const libres = horasDelDia(dia).filter((h) => !yaPaso(dia, h, 0) && !tomado(citas, dia, h, doctor));
  const [hora, setHora] = useState(inicial.hora ?? libres[0] ?? "");
  const [servicio, setServicio] = useState(SERVICIOS[1].id);
  const [paciente, setPaciente] = useState("");
  const [error, setError] = useState("");

  if (!doctoresDia.length) return <p className="px-6 py-10 text-center text-[#0f2a3a]">Este día no hay doctores atendiendo.</p>;

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

function Pacientes({ citas, soloMios, alAbrir }: { citas: Cita[]; soloMios: boolean; alAbrir: (p: string) => void }) {
  const [buscar, setBuscar] = useState("");
  const lista = useMemo(() => {
    const m = new Map<string, Cita[]>();
    citas.forEach((c) => m.set(c.paciente, [...(m.get(c.paciente) ?? []), c]));
    return [...m.entries()]
      .map(([nombre, cs]) => ({ nombre, citas: [...cs].sort((a, b) => (a.dia + a.hora).localeCompare(b.dia + b.hora)) }))
      .filter((p) => p.nombre.toLowerCase().includes(buscar.toLowerCase().trim()))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [citas, buscar]);

  return (
    <>
      <h1 className="!text-[#0f2a3a] text-[1.9rem] sm:text-[2.3rem] font-extrabold tracking-[-0.02em]">{soloMios ? "Mis pacientes" : "Pacientes"}</h1>
      {soloMios && <p className="mt-1 text-sm opacity-60">Solo ve a sus pacientes. El dueño de la clínica puede darle acceso a todos.</p>}
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
                  {iniciales(p.nombre)}
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
export const MARCAS = [
  { id: "sano", texto: "Sano", color: "#ffffff", borde: "rgba(15,42,58,.2)" },
  { id: "caries", texto: "Caries", color: "#f6c36b", borde: "#d9971e" },
  { id: "resina", texto: "Resina", color: "#8fc7ea", borde: AZUL },
  { id: "falta", texto: "Extraído", color: "#e5e7eb", borde: "#9ca3af" },
];

export function Odontograma({ dientes, alTocar }: { dientes: Record<number, number>; alTocar?: (n: number) => void }) {
  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[520px] space-y-1.5">
          {PIEZAS.map((fila, k) => (
            <div key={k} className="flex justify-center gap-1">
              {fila.map((n, i) => {
                const m = MARCAS[dientes[n] ?? 0];
                return (
                  <button
                    key={n}
                    type="button"
                    disabled={!alTocar}
                    onClick={() => alTocar?.(n)}
                    title={`Pieza ${n}: ${m.texto}`}
                    aria-label={`Pieza ${n}: ${m.texto}`}
                    className={`w-7 h-9 rounded-md border-2 text-[0.6rem] font-bold transition ${alTocar ? "active:scale-90" : "cursor-default"} ${i === 7 ? "mr-2" : ""} ${m.id === "falta" ? "line-through opacity-60" : ""}`}
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
    </>
  );
}

function Expediente({ paciente, citas, extras, editable }: { paciente: string; citas: Cita[]; extras: Record<string, CitaExtra>; editable: boolean }) {
  const [datos, setDatos] = useExpediente(paciente);
  const [nuevoProc, setNuevoProc] = useState({ pieza: "", proc: "", costo: "" });
  const historial = citas.filter((c) => c.paciente === paciente).sort((a, b) => (a.dia + a.hora).localeCompare(b.dia + b.hora));
  const tel = `5${String(paciente.length * 731 + 1000000).slice(0, 3)}-${String(paciente.charCodeAt(0) * 37).padStart(4, "0").slice(0, 4)}`;
  const saldo = datos.plan.filter((p) => !p.hecho).reduce((s, p) => s + p.costo, 0);
  const etiqueta = "text-[0.78rem] font-bold uppercase tracking-[0.1em] opacity-55";

  return (
    <div className="px-6 pt-6 pb-7 text-[#0f2a3a]">
      <div className="flex items-center gap-3 pr-8">
        <span className="grid place-items-center w-12 h-12 rounded-full font-bold text-white" style={{ background: AZUL }}>
          {iniciales(paciente)}
        </span>
        <div>
          <h3 className="!text-[#0f2a3a] text-[1.5rem] font-extrabold leading-tight">{paciente}</h3>
          <p className="text-sm opacity-60">Tel. {tel} (de ejemplo)</p>
        </div>
      </div>
      {!editable && <p className="mt-3 rounded-xl px-3 py-2 text-[0.82rem] font-semibold" style={{ background: CIELO, color: AZUL }}>Recepción ve el expediente, pero solo el doctor puede cambiarlo.</p>}

      <div className="mt-5 grid sm:grid-cols-2 gap-4">
        {(
          [
            ["alergias", "Alergias", "Ninguna conocida"],
            ["antecedentes", "Antecedentes", "Tratamientos o enfermedades previas"],
          ] as const
        ).map(([k, t, ph]) => (
          <label key={k} className="block">
            <span className={etiqueta}>{t}</span>
            <input
              value={datos[k]}
              readOnly={!editable}
              onChange={(e) => setDatos((x) => ({ ...x, [k]: e.target.value }))}
              placeholder={ph}
              className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 text-[0.95rem] focus:outline-none ${k === "alergias" && datos.alergias ? "border-[#f0a020] bg-[#fff8ec] font-semibold" : "border-[#0f2a3a]/20"}`}
            />
          </label>
        ))}
      </div>

      <p className={`mt-6 ${etiqueta}`}>Odontograma</p>
      {editable && <p className="text-[0.8rem] opacity-55">Toque una pieza para cambiar su estado.</p>}
      <div className="mt-3">
        <Odontograma dientes={datos.dientes} alTocar={editable ? (n) => setDatos((x) => ({ ...x, dientes: { ...x.dientes, [n]: ((x.dientes[n] ?? 0) + 1) % MARCAS.length } })) : undefined} />
      </div>

      <div className="mt-6 flex items-end justify-between gap-3">
        <p className={etiqueta}>Plan de tratamiento</p>
        <p className="text-sm font-bold">
          Saldo pendiente: <span style={{ color: AZUL }}>{qz(saldo)}</span>
        </p>
      </div>
      <ul className="mt-2 divide-y divide-[#0f2a3a]/10 rounded-xl border border-[#0f2a3a]/10">
        {datos.plan.map((p) => (
          <li key={p.id} className="flex items-center gap-3 px-3 py-2.5 text-[0.92rem]">
            <button
              type="button"
              disabled={!editable}
              onClick={() => setDatos((x) => ({ ...x, plan: x.plan.map((y) => (y.id === p.id ? { ...y, hecho: !y.hecho } : y)) }))}
              aria-label={p.hecho ? "Marcar pendiente" : "Marcar hecho"}
              className="grid place-items-center w-6 h-6 shrink-0 rounded-md border-2"
              style={p.hecho ? { background: MENTA, borderColor: MENTA, color: "#fff" } : { borderColor: "rgba(15,42,58,.25)" }}
            >
              {p.hecho && <Check size={14} />}
            </button>
            <span className={`flex-1 ${p.hecho ? "line-through opacity-50" : ""}`}>
              {p.proc} {p.pieza !== "—" && <span className="opacity-60">· pieza {p.pieza}</span>}
            </span>
            <span className="font-semibold tabular-nums">{qz(p.costo)}</span>
            {editable && (
              <button type="button" aria-label="Quitar" onClick={() => setDatos((x) => ({ ...x, plan: x.plan.filter((y) => y.id !== p.id) }))} className="opacity-40 hover:opacity-100">
                <Trash2 size={15} />
              </button>
            )}
          </li>
        ))}
      </ul>
      {editable && (
        <form
          className="mt-2 grid grid-cols-[70px_1fr_90px_auto] gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!nuevoProc.proc.trim()) return;
            setDatos((x) => ({ ...x, plan: [...x.plan, { id: `p${Date.now()}`, pieza: nuevoProc.pieza.trim() || "—", proc: nuevoProc.proc.trim(), costo: Number(nuevoProc.costo) || 0, hecho: false }] }));
            setNuevoProc({ pieza: "", proc: "", costo: "" });
          }}
        >
          <input value={nuevoProc.pieza} onChange={(e) => setNuevoProc({ ...nuevoProc, pieza: e.target.value })} placeholder="Pieza" className="rounded-lg border border-[#0f2a3a]/20 px-2 py-2 text-sm" />
          <input value={nuevoProc.proc} onChange={(e) => setNuevoProc({ ...nuevoProc, proc: e.target.value })} placeholder="Procedimiento" className="rounded-lg border border-[#0f2a3a]/20 px-2 py-2 text-sm" />
          <input value={nuevoProc.costo} inputMode="numeric" onChange={(e) => setNuevoProc({ ...nuevoProc, costo: e.target.value.replace(/\D/g, "") })} placeholder="Q" className="rounded-lg border border-[#0f2a3a]/20 px-2 py-2 text-sm" />
          <button type="submit" className="rounded-lg px-3 text-sm font-bold text-white" style={{ background: AZUL }}>
            Agregar
          </button>
        </form>
      )}

      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        <div>
          <p className={etiqueta}>Citas</p>
          <ul className="mt-2 space-y-2">
            {historial.map((c) => {
              const d = desdeIso(c.dia);
              const cons = extras[c.id]?.consulta;
              return (
                <li key={c.id} className="text-[0.88rem]">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 shrink-0 rounded-full" style={{ background: ESTADOS[c.estado].punto }} />
                    {DIAS_CORTOS[d.getDay()]} {d.getDate()}, {c.hora} · {servicioPor(c.servicio).nombre}
                  </span>
                  {cons && <span className="block pl-3.5 text-[0.8rem] opacity-65">{cons.diagnostico}</span>}
                </li>
              );
            })}
          </ul>
        </div>
        <label className="block">
          <span className={etiqueta}>Notas privadas del doctor</span>
          <textarea
            rows={5}
            value={datos.notas}
            readOnly={!editable}
            onChange={(e) => setDatos((x) => ({ ...x, notas: e.target.value }))}
            placeholder="Solo las ven los doctores y el dueño."
            className="mt-2 w-full resize-none rounded-xl border border-[#0f2a3a]/20 px-3 py-2 text-[0.92rem] focus:outline-none focus:border-[#1e6fa8]"
          />
        </label>
      </div>
    </div>
  );
}

/* ---------------- cobros ---------------- */

function Cobros({
  dias,
  dia,
  setDia,
  citas,
  extras,
  alCobrar,
}: {
  dias: Date[];
  dia: string;
  setDia: (d: string) => void;
  citas: Cita[];
  extras: Record<string, CitaExtra>;
  alCobrar: (id: string, m: Metodo) => void;
}) {
  const delDia = citas.filter((c) => c.dia === dia).sort((a, b) => a.hora.localeCompare(b.hora));
  const pagadas = delDia.filter((c) => extras[c.id]?.pago);
  const cobrado = pagadas.reduce((s, c) => s + servicioPor(c.servicio).precio, 0);
  const porCobrar = delDia.filter((c) => !extras[c.id]?.pago).reduce((s, c) => s + servicioPor(c.servicio).precio, 0);
  return (
    <>
      <h1 className="!text-[#0f2a3a] text-[1.9rem] sm:text-[2.3rem] font-extrabold tracking-[-0.02em]">Cobros</h1>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {dias.map((x) => (
          <button
            key={iso(x)}
            type="button"
            onClick={() => setDia(iso(x))}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold ${iso(x) === dia ? "text-white" : "bg-white"}`}
            style={iso(x) === dia ? { background: TINTA } : undefined}
          >
            {DIAS_CORTOS[x.getDay()]} {x.getDate()}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tarjeta titulo="Cobrado" valor={qz(cobrado)} nota={`${pagadas.length} pagos`} />
        <Tarjeta titulo="Por cobrar" valor={qz(porCobrar)} nota="Del día" alerta={porCobrar > 0} />
        {METODOS.slice(0, 2).map((m) => (
          <Tarjeta key={m.id} titulo={m.texto} valor={qz(pagadas.filter((c) => extras[c.id]?.pago === m.id).reduce((s, c) => s + servicioPor(c.servicio).precio, 0))} nota="Cobrado hoy" />
        ))}
      </div>
      <ul className="mt-5 divide-y divide-[#0f2a3a]/8 overflow-hidden rounded-2xl bg-white">
        {delDia.map((c) => {
          const pago = extras[c.id]?.pago;
          return (
            <li key={c.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="w-12 text-sm font-semibold tabular-nums opacity-60">{c.hora}</span>
              <span className="flex-1 min-w-[140px]">
                <span className="block font-bold">{c.paciente}</span>
                <span className="block text-[0.8rem] opacity-60">
                  {servicioPor(c.servicio).nombre} · {doctorPor(c.doctor).corto}
                </span>
              </span>
              <span className="font-bold tabular-nums">{qz(servicioPor(c.servicio).precio)}</span>
              {pago ? (
                <span className="rounded-full bg-[#e7f6f1] px-3 py-1 text-[0.78rem] font-bold text-[#1d6b5a]">{METODOS.find((m) => m.id === pago)!.texto}</span>
              ) : (
                <span className="flex gap-1">
                  {METODOS.map((m) => (
                    <button key={m.id} type="button" onClick={() => alCobrar(c.id, m.id)} className="rounded-full px-2.5 py-1 text-[0.75rem] font-bold active:scale-95" style={{ background: CIELO, color: AZUL }}>
                      {m.texto}
                    </button>
                  ))}
                </span>
              )}
            </li>
          );
        })}
        {!delDia.length && <li className="px-4 py-8 text-center opacity-60">No hay citas este día.</li>}
      </ul>
    </>
  );
}

/* ---------------- reportes ---------------- */

function Reportes({ citas, dias, extras }: { citas: Cita[]; dias: Date[]; extras: Record<string, CitaExtra> }) {
  const porDia = dias.map((d) => ({ d, n: citas.filter((c) => c.dia === iso(d)).length }));
  const max = Math.max(1, ...porDia.map((x) => x.n));
  const conteo = SERVICIOS.map((s) => ({ s, n: citas.filter((c) => c.servicio === s.id).length })).filter((x) => x.n).sort((a, b) => b.n - a.n);
  const maxS = Math.max(1, ...conteo.map((x) => x.n));
  const total = citas.reduce((s, c) => s + servicioPor(c.servicio).precio, 0);
  const confirmadas = citas.filter((c) => c.estado !== "por-confirmar").length;
  const porDoctor = DOCTORES.map((d) => ({ d, n: citas.filter((c) => c.doctor === d.id).length, q: citas.filter((c) => c.doctor === d.id).reduce((s, c) => s + servicioPor(c.servicio).precio, 0) }));
  const cobrado = citas.filter((c) => extras[c.id]?.pago).reduce((s, c) => s + servicioPor(c.servicio).precio, 0);

  return (
    <>
      <h1 className="!text-[#0f2a3a] text-[1.9rem] sm:text-[2.3rem] font-extrabold tracking-[-0.02em]">Reportes</h1>
      <p className="mt-1 opacity-60">Próximos 10 días de atención.</p>
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tarjeta titulo="Citas agendadas" valor={citas.length} nota="En los próximos 10 días" />
        <Tarjeta titulo="Ingreso estimado" valor={qz(total)} nota="Según los servicios" />
        <Tarjeta titulo="Ya cobrado" valor={qz(cobrado)} nota="Registrado en cobros" />
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
        <div className="rounded-2xl bg-white p-5 lg:col-span-2">
          <p className="font-bold">Por doctor</p>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {porDoctor.map(({ d, n, q }) => (
              <div key={d.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: CIELO }}>
                <img src={d.foto} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="font-bold">{d.nombre}</p>
                  <p className="text-sm opacity-65">{n} citas</p>
                </div>
                <p className="font-extrabold">{qz(q)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- equipo y permisos (solo el dueño) ---------------- */

function Equipo({ permisos, setPermisos, citas }: { permisos: Permisos; setPermisos: React.Dispatch<React.SetStateAction<Permisos>>; citas: Cita[] }) {
  const opciones: { k: keyof Permisos[string]; t: string; d: string }[] = [
    { k: "todos", t: "Ver a todos los pacientes", d: "Si no, solo ve a los suyos." },
    { k: "cobros", t: "Ver cobros e ingresos", d: "Montos del día y formas de pago." },
    { k: "reportes", t: "Ver reportes", d: "Ingresos, citas y servicios de toda la clínica." },
  ];
  return (
    <>
      <h1 className="!text-[#0f2a3a] text-[1.9rem] sm:text-[2.3rem] font-extrabold tracking-[-0.02em]">Equipo y permisos</h1>
      <p className="mt-1 opacity-65 max-w-2xl">Cada quien entra con su usuario y ve solo lo que le toca. Cambie un permiso aquí y entre como ese doctor para ver la diferencia.</p>

      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        {DOCTORES.map((d) => (
          <div key={d.id} className="rounded-2xl bg-white p-5">
            <div className="flex items-center gap-3">
              <img src={d.foto} alt="" className="w-11 h-11 rounded-full object-cover" />
              <div>
                <p className="font-bold">{d.nombre}</p>
                <p className="text-sm opacity-60">
                  {d.area} · {citas.filter((c) => c.doctor === d.id).length} citas
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-3">
              {opciones.map((o) => {
                const on = permisos[d.id][o.k];
                return (
                  <li key={o.k} className="flex items-center justify-between gap-4">
                    <span>
                      <span className="block text-[0.92rem] font-semibold">{o.t}</span>
                      <span className="block text-[0.78rem] opacity-55">{o.d}</span>
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={on}
                      aria-label={`${o.t} para ${d.nombre}`}
                      onClick={() => setPermisos((p) => ({ ...p, [d.id]: { ...p[d.id], [o.k]: !on } }))}
                      className="relative w-12 h-7 shrink-0 rounded-full transition"
                      style={{ background: on ? MENTA : "rgba(15,42,58,.18)" }}
                    >
                      <span className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: on ? 26 : 4 }} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-white p-5">
        <p className="font-bold">Todos los usuarios</p>
        <ul className="mt-3 divide-y divide-[#0f2a3a]/8">
          {ROLES.map((r) => (
            <li key={r.nombre} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <span>
                <span className="block font-semibold">{r.nombre}</span>
                <span className="block text-[0.8rem] opacity-60">{r.texto}</span>
              </span>
              <span className="rounded-full px-3 py-1 text-[0.75rem] font-bold" style={{ background: CIELO, color: AZUL }}>
                {r.cargo}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
