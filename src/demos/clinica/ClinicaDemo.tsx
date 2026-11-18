/*
 * Demo: clínica dental "Aurora" (negocio inventado, datos de ejemplo).
 * Diseño propio, tranquilo y claro: portada con foto y tarjetas flotantes,
 * agenda de citas en 4 pasos, servicios con precio, antes y después
 * (imagen ilustrativa), equipo, cómo se recuerdan las citas y horario.
 * Fotos libres de Unsplash (src/assets/demo-clinica).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarCheck, Check, ChevronsLeftRight, Clock, CreditCard, Eye, HeartHandshake, LayoutDashboard, MapPin, Phone, Smile, Target } from "lucide-react";
import paciente from "@/assets/demo-clinica/paciente.jpg";
import sonrisa from "@/assets/demo-clinica/sonrisa.jpg";
import consultorio from "@/assets/demo-clinica/consultorio.jpg";
import { BandaDemos, CierreJzet, MensajeWhatsApp, qz } from "../comun";
import {
  AZUL, CIELO, DOCTORES, ESMALTE, LETRA, MENTA, TITULO, SERVICIOS_PAGINA as SERVICIOS, TINTA,
  DIAS_CORTOS, ROLES, fechaLarga, horasDelDia, iso, mayus, proximosDias, tomado, useCitas, useExtras, usePermisos, yaPaso,
  type Cita, type Doctor, type Servicio, type Sesion,
} from "./datos";
import { PanelClinica } from "./PanelClinica";
import { Entrada, ICONO_ROL, PortalPaciente } from "./Sistema";

export default function ClinicaDemo() {
  const [citas, setCitas, reiniciar] = useCitas();
  const [vista, setVista] = useState<"pacientes" | "panel">(() => (location.hash === "#panel" ? "panel" : "pacientes"));
  const [diaPanel, setDiaPanel] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [ultima, setUltima] = useState<Cita | null>(null);
  const [servicioInicial, setServicioInicial] = useState<string | null>(null);
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [extras, setExtras] = useExtras();
  const [permisos, setPermisos] = usePermisos();

  // la vista se recuerda en la dirección (#panel), para poder compartir el link del panel
  useEffect(() => {
    const cambio = () => setVista(location.hash === "#panel" ? "panel" : "pacientes");
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  function irA(v: "pacientes" | "panel", dia?: string, s?: Sesion | null) {
    if (dia) setDiaPanel(dia);
    if (s !== undefined) setSesion(s);
    history.replaceState(null, "", v === "panel" ? "#panel" : location.pathname);
    setVista(v);
    window.scrollTo({ top: 0 });
  }

  useEffect(() => {
    if (vista === "pacientes") document.title = "Clínica Dental Aurora · Demo de Jzet Labs";
  }, [vista]);

  const proximo = useMemo(() => {
    for (const d of proximosDias())
      for (const h of horasDelDia(d))
        if (!yaPaso(d, h) && DOCTORES.some((doc) => doc.trabaja.includes(d.getDay()) && !tomado(citas, d, h, doc.id))) return { d, h };
    return null;
  }, [citas]);

  if (vista === "panel")
    return (
      <div style={{ fontFamily: TITULO }}>
        <BandaDemos />
        <SelectorVista vista={vista} irA={irA} />
        {!sesion ? (
          <Entrada alEntrar={setSesion} alVolver={() => irA("pacientes")} />
        ) : sesion.rol === "paciente" ? (
          <PortalPaciente
            citas={citas}
            setCitas={setCitas}
            extras={extras}
            alSalir={() => setSesion(null)}
            alAgendar={() => {
              irA("pacientes");
              setTimeout(() => document.getElementById("agenda")?.scrollIntoView(), 50);
            }}
          />
        ) : (
          <PanelClinica
            sesion={sesion}
            citas={citas}
            setCitas={setCitas}
            extras={extras}
            setExtras={setExtras}
            permisos={permisos}
            setPermisos={setPermisos}
            reiniciar={() => {
              reiniciar();
              setExtras({});
            }}
            diaInicial={diaPanel}
            alMensaje={setMensaje}
            irAPagina={() => irA("pacientes")}
            alSalir={() => setSesion(null)}
          />
        )}
        <MensajeWhatsApp mensaje={mensaje} alCerrar={() => setMensaje(null)} demo="clínica dental" que="el mensaje" />
      </div>
    );

  function agendar(id: string) {
    setServicioInicial(id);
    document.getElementById("agenda")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={{ background: ESMALTE, color: TINTA, fontFamily: LETRA }} className="min-h-screen">
      <BandaDemos />
      <SelectorVista vista={vista} irA={irA} />

      {/* encabezado */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#123b40]/10">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
          <a href="#inicio" className="inline-flex items-center gap-2.5">
            <LogoAurora />
            <span className="leading-tight">
              <span className="block text-[1.35rem]" style={{ fontFamily: TITULO }}>Aurora</span>
              <span className="block text-[0.7rem] opacity-60">Clínica dental</span>
            </span>
          </a>
          <nav className="hidden md:flex gap-7 text-[0.92rem] opacity-80">
            <a href="#servicios" className="hover:opacity-100">
              Servicios
            </a>
            <a href="#nosotros" className="hover:opacity-100">
              Nosotros
            </a>
            <a href="#equipo" className="hover:opacity-100">
              Doctores
            </a>
            <a href="#opiniones" className="hover:opacity-100">
              Opiniones
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => irA("panel", undefined, { rol: "paciente" })} className="hidden sm:inline-flex rounded-full px-4 py-2 text-[0.9rem] font-bold hover:bg-[#123b40]/5">
              Mi cuenta
            </button>
            <a href="#agenda" className="rounded-full px-4 py-2 text-[0.9rem] font-bold text-white active:scale-95 transition" style={{ background: AZUL }}>
              Agendar cita
            </a>
          </div>
        </div>
      </header>

      {/* portada */}
      <section id="inicio" style={{ background: CIELO }}>
        <div className="mx-auto max-w-6xl px-5 pt-12 pb-16 sm:pt-16 sm:pb-24 grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[0.82rem] font-semibold shadow-sm" style={{ color: AZUL }}>
              <MapPin size={14} /> Zona 10 · Atención con cita
            </span>
            <h1 className="mt-5 !text-[#123b40] text-[2.7rem] sm:text-[3.8rem] leading-[1.03] tracking-[-0.03em] font-extrabold" style={{ fontFamily: TITULO }}>
              Su cita al dentista, sin esperar a que le contesten.
            </h1>
            <p className="mt-5 max-w-lg text-[1.08rem] opacity-75">Agende en línea en un minuto, sepa el precio antes de venir y reciba un recordatorio por WhatsApp un día antes.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#agenda" className="rounded-full px-6 py-3.5 font-bold text-white active:scale-[0.97] transition" style={{ background: AZUL }}>
                Agendar mi cita
              </a>
              <a href="#servicios" className="rounded-full bg-white px-6 py-3.5 font-bold shadow-sm active:scale-[0.97] transition">
                Ver precios
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.9rem] opacity-80">
              <li className="inline-flex items-center gap-1.5">
                <Check size={16} style={{ color: MENTA }} /> Valoración desde Q150
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check size={16} style={{ color: MENTA }} /> Pago con tarjeta
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check size={16} style={{ color: MENTA }} /> Estacionamiento
              </li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[440px]">
            <img src={paciente} alt="Paciente sonriendo" className="w-full aspect-[4/5] object-cover rounded-[2rem] " />
            {proximo && (
              <div className="absolute left-3 bottom-3 rounded-xl px-4 py-3 text-white" style={{ background: AZUL }}>
                <p className="text-[0.8rem] opacity-75">Próxima cita libre</p>
                <p className="mt-0.5 font-bold">
                  {proximo.d.toDateString() === new Date().toDateString() ? "Hoy" : mayus(fechaLarga(proximo.d))}, {proximo.h}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Odontograma />

      <UnSistema alEntrar={(s) => irA("panel", undefined, s)} />

      <Agenda
        servicioInicial={servicioInicial}
        citas={citas}
        alAgendar={(c, m) => {
          setCitas((x) => [...x.map((y) => ({ ...y, nueva: false })), c]);
          setUltima(c);
          setMensaje(m);
        }}
      />

      {/* servicios */}
      <section id="servicios" className="scroll-mt-16 mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <p className="font-bold text-[0.85rem]" style={{ color: AZUL }}>
          Servicios
        </p>
        <h2 className="mt-2 !text-[#123b40] text-[2.2rem] sm:text-[3rem] font-normal tracking-[-0.01em]" style={{ fontFamily: TITULO }}>
          Precios claros, antes de venir
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICIOS.map((s) => {
            const Icono = s.icono;
            return (
              <article key={s.id} className="rounded-3xl bg-white p-6 shadow-[0_1px_0_rgba(18,59,64,.06)] border border-[#123b40]/8 flex flex-col">
                <span className="grid place-items-center w-11 h-11 rounded-2xl" style={{ background: CIELO, color: AZUL }}>
                  <Icono size={21} />
                </span>
                <h3 className="mt-4 !text-[#123b40] text-[1.2rem] font-bold" style={{ fontFamily: TITULO }}>
                  {s.nombre}
                </h3>
                <p className="mt-1 text-[0.95rem] opacity-70 flex-1">{s.texto}</p>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-[1.4rem] font-extrabold">
                      {s.desde && <span className="text-[0.8rem] font-semibold opacity-60">desde </span>}
                      {qz(s.precio)}
                    </p>
                    <p className="text-[0.8rem] opacity-60 inline-flex items-center gap-1">
                      <Clock size={12} /> {s.minutos} min
                    </p>
                  </div>
                  <button type="button" onClick={() => agendar(s.id)} className="rounded-full px-4 py-2 text-[0.88rem] font-bold active:scale-95 transition" style={{ background: CIELO, color: AZUL }}>
                    Agendar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-4 text-sm opacity-55">Precios de ejemplo, en quetzales.</p>
      </section>

      <AntesDespues />

      <Nosotros />

      {/* equipo */}
      <section id="equipo" className="scroll-mt-16 mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <h2 className="!text-[#123b40] text-[2.2rem] sm:text-[3rem] font-normal tracking-[-0.01em]" style={{ fontFamily: TITULO }}>
          Quién lo atiende
        </h2>
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {DOCTORES.map((d) => (
            <article key={d.id} className="flex gap-5 rounded-3xl bg-white p-5 border border-[#123b40]/8">
              <img src={d.foto} alt={d.nombre} className="w-28 sm:w-36 aspect-[5/6] object-cover rounded-2xl" loading="lazy" />
              <div className="py-1">
                <h3 className="!text-[#123b40] text-[1.3rem] font-bold" style={{ fontFamily: TITULO }}>
                  {d.nombre}
                </h3>
                <p className="mt-1 font-semibold" style={{ color: AZUL }}>
                  {d.area}
                </p>
                <p className="mt-3 text-[0.92rem] opacity-70 inline-flex items-center gap-1.5">
                  <CalendarCheck size={15} /> Atiende {d.dias.toLowerCase()}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm opacity-55">Nombres y fotos de ejemplo.</p>
      </section>

      <Opiniones />

      {/* recordatorio */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:pb-24">
        <div className="grid md:grid-cols-[1fr_1fr] gap-10 items-center rounded-[2rem] p-7 sm:p-12 text-white" style={{ background: TINTA }}>
          <div>
            <h2 className="!text-white text-[2rem] sm:text-[2.6rem] font-normal tracking-[-0.01em] leading-tight" style={{ fontFamily: TITULO }}>
              Menos citas olvidadas
            </h2>
            <p className="mt-4 text-white/75 max-w-md">Un día antes, cada paciente recibe un recordatorio por WhatsApp. Si no puede venir, responde y el espacio queda libre para otra persona.</p>
          </div>
          <div className="mx-auto w-full max-w-[320px] rounded-[2rem] bg-[#e7ddd3] p-4 shadow-2xl">
            <p className="text-center text-[0.72rem] text-black/50">Hoy, 10:00</p>
            <p className="mt-2 max-w-[90%] rounded-[1rem_1rem_1rem_0.3rem] bg-white px-3.5 py-2.5 text-[0.88rem] text-[#111b21] shadow-sm">
              Hola, María. Le recordamos su cita de <b>limpieza</b> mañana a las <b>10:00</b> con la Dra. Morales. Responda <b>1</b> para confirmar o <b>2</b> para cambiarla.
            </p>
            <p className="mt-2 ml-auto w-fit rounded-[1rem_1rem_0.3rem_1rem] bg-[#d9fdd3] px-3.5 py-2 text-[0.88rem] text-[#111b21] shadow-sm">1</p>
            <p className="mt-2 max-w-[90%] rounded-[1rem_1rem_1rem_0.3rem] bg-white px-3.5 py-2.5 text-[0.88rem] text-[#111b21] shadow-sm">¡Listo! Su cita quedó confirmada.</p>
          </div>
        </div>
      </section>

      {/* horario */}
      <section id="horario" className="scroll-mt-16 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
          <img src={consultorio} alt="Consultorio dental limpio y moderno" className="w-full aspect-[4/3] object-cover rounded-[2rem]" loading="lazy" />
          <div>
            <h2 className="!text-[#123b40] text-[2.2rem] font-normal tracking-[-0.01em]" style={{ fontFamily: TITULO }}>
              Horario y ubicación
            </h2>
            <ul className="mt-6 space-y-3">
              <li className="flex gap-3">
                <Clock size={20} style={{ color: AZUL }} /> Lunes a viernes 8:00 a 17:00 · Sábado 8:00 a 12:00
              </li>
              <li className="flex gap-3">
                <MapPin size={20} style={{ color: AZUL }} /> Zona 10, Ciudad de Guatemala (dirección de ejemplo)
              </li>
              <li className="flex gap-3">
                <Phone size={20} style={{ color: AZUL }} /> 2222-0000 (de ejemplo)
              </li>
              <li className="flex gap-3">
                <CreditCard size={20} style={{ color: AZUL }} /> Efectivo, tarjeta y transferencia
              </li>
            </ul>
          </div>
        </div>
      </section>

      <CierreJzet demo="clínica dental" />

      {/* botón flotante */}
      <a
        href="#agenda"
        className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full px-5 py-3.5 font-bold text-white shadow-[0_14px_30px_-12px_rgba(31,157,85,.8)] active:scale-95 transition"
        style={{ background: "#1f9d55" }}
      >
        <CalendarCheck size={18} /> Agendar cita
      </a>

      <MensajeWhatsApp
        mensaje={mensaje}
        alCerrar={() => setMensaje(null)}
        demo="clínica dental"
        que="la cita"
        accion={
          ultima
            ? {
                texto: "Ver la cita como recepción",
                alTocar: () => {
                  setMensaje(null);
                  irA("panel", ultima.dia, { rol: "recepcion" });
                },
              }
            : undefined
        }
      />
    </div>
  );
}

/* Cambia entre la página que ven los pacientes y el panel que usa la clínica */
function SelectorVista({ vista, irA }: { vista: "pacientes" | "panel"; irA: (v: "pacientes" | "panel") => void }) {
  return (
    <div className="bg-[#12344a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-2 flex flex-wrap items-center justify-center sm:justify-between gap-2 text-[0.82rem]">
        <p className="hidden sm:block text-white/70">Esta demo tiene dos partes: la página que ve el público y el sistema por dentro.</p>
        <div className="flex rounded-full bg-white/10 p-0.5" role="group" aria-label="Vista de la demo">
          {(
            [
              ["pacientes", "Página de pacientes", Smile],
              ["panel", "Sistema de la clínica", LayoutDashboard],
            ] as const
          ).map(([v, t, Icono]) => (
            <button
              key={v}
              type="button"
              onClick={() => irA(v)}
              aria-pressed={vista === v}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition ${vista === v ? "bg-white text-[#12344a]" : "text-white/80 hover:text-white"}`}
            >
              <Icono size={14} /> {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Agenda en 4 pasos: servicio, doctor, día y hora, datos */
function Agenda({ servicioInicial, citas, alAgendar }: { servicioInicial: string | null; citas: Cita[]; alAgendar: (c: Cita, mensaje: string) => void }) {
  const dias = useMemo(proximosDias, []);
  const [paso, setPaso] = useState(0);
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [doc, setDoc] = useState<Doctor | null>(null);
  const [dia, setDia] = useState<Date>(dias[0]);
  const libre = (d: Date, h: string, dr: Doctor) => dr.trabaja.includes(d.getDay()) && !yaPaso(d, h) && !tomado(citas, d, h, dr.id);
  // al elegir doctor, empieza en el primer día en que atiende y tiene horarios libres
  useEffect(() => {
    if (!doc) return;
    setDia(dias.find((d) => horasDelDia(d).some((h) => libre(d, h, doc))) ?? dias[0]);
    setHora(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc]);
  const [hora, setHora] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!servicioInicial) return;
    setServicio(SERVICIOS.find((s) => s.id === servicioInicial) ?? null);
    setPaso(1);
  }, [servicioInicial]);

  const pasos = ["Servicio", "Doctor", "Día y hora", "Sus datos"];
  const puedeSeguir = [!!servicio, !!doc, !!hora, true][paso];

  function confirmar() {
    if (!nombre.trim()) {
      setError("Escriba su nombre para la cita.");
      return;
    }
    if (!servicio || !doc || !hora) return;
    alAgendar(
      { id: `${iso(dia)}-${hora}-${doc.id}-${Date.now()}`, dia: iso(dia), hora, doctor: doc.id, servicio: servicio.id, paciente: nombre.trim(), estado: "por-confirmar", nueva: true },
      `Hola, Clínica Aurora. Soy ${nombre.trim()} y quiero agendar ${servicio.nombre.toLowerCase()} con ${doc.nombre} el ${fechaLarga(dia)} a las ${hora}. ¿Me la confirman?`,
    );
    setPaso(0);
    setServicio(null);
    setDoc(null);
    setHora(null);
    setNombre("");
  }

  return (
    <section id="agenda" className="scroll-mt-16 mx-auto max-w-6xl px-5 py-6">
      <div ref={caja} className="rounded-[2rem] bg-white p-6 sm:p-10 shadow-[0_30px_70px_-40px_rgba(18,59,64,.45)] border border-[#123b40]/8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-bold text-[0.85rem]" style={{ color: AZUL }}>
              Agenda en línea
            </p>
            <h2 className="mt-1 !text-[#123b40] text-[1.9rem] sm:text-[2.4rem] font-normal tracking-[-0.01em]" style={{ fontFamily: TITULO }}>
              Su cita en un minuto
            </h2>
          </div>
          <p className="text-sm opacity-60">
            Paso {paso + 1} de 4 · {pasos[paso]}
          </p>
        </div>

        {/* barra de pasos */}
        <div className="mt-6 grid grid-cols-4 gap-2" aria-hidden>
          {pasos.map((p, i) => (
            <div key={p}>
              <div className="h-1.5 rounded-full transition-colors" style={{ background: i <= paso ? AZUL : "#dbe7ef" }} />
              <p className={`mt-1.5 text-[0.75rem] font-semibold ${i <= paso ? "" : "opacity-40"}`}>{p}</p>
            </div>
          ))}
        </div>

        <div key={paso} className="burbuja-entra mt-8 min-h-[220px]">
          {paso === 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SERVICIOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServicio(s)}
                  aria-pressed={servicio?.id === s.id}
                  className={`rounded-2xl border-2 px-4 py-3.5 text-left transition active:scale-[0.98] ${servicio?.id === s.id ? "" : "border-[#123b40]/10 hover:border-[#123b40]/30"}`}
                  style={servicio?.id === s.id ? { borderColor: AZUL, background: CIELO } : undefined}
                >
                  <p className="font-bold">{s.nombre}</p>
                  <p className="text-sm opacity-65">
                    {s.desde ? "desde " : ""}
                    {qz(s.precio)} · {s.minutos} min
                  </p>
                </button>
              ))}
            </div>
          )}

          {paso === 1 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {DOCTORES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDoc(d)}
                  aria-pressed={doc?.id === d.id}
                  className={`flex items-center gap-4 rounded-2xl border-2 p-3 text-left transition active:scale-[0.98] ${doc?.id === d.id ? "" : "border-[#123b40]/10 hover:border-[#123b40]/30"}`}
                  style={doc?.id === d.id ? { borderColor: AZUL, background: CIELO } : undefined}
                >
                  <img src={d.foto} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <p className="font-bold">{d.nombre}</p>
                    <p className="text-sm opacity-65">{d.area}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {paso === 2 && (
            <div>
              <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
                {dias.map((d) => {
                  const activo = d.toDateString() === dia.toDateString();
                  return (
                    <button
                      key={d.toISOString()}
                      type="button"
                      onClick={() => {
                        setDia(d);
                        setHora(null);
                      }}
                      aria-pressed={activo}
                      className={`shrink-0 w-16 rounded-2xl border-2 py-2.5 text-center transition active:scale-95 ${activo ? "text-white border-transparent" : "border-[#123b40]/10 hover:border-[#123b40]/30"}`}
                      style={activo ? { background: AZUL } : undefined}
                    >
                      <span className="block text-[0.72rem] font-semibold uppercase opacity-80">{DIAS_CORTOS[d.getDay()]}</span>
                      <span className="block text-[1.3rem] font-extrabold leading-tight">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
                {doc && !doc.trabaja.includes(dia.getDay()) && (
                  <p className="col-span-full rounded-xl px-4 py-3 text-sm font-semibold" style={{ background: CIELO, color: AZUL }}>
                    {doc.nombre} atiende {doc.dias.toLowerCase()}. Elija otro día.
                  </p>
                )}
                {horasDelDia(dia).map((h) => {
                  const no = !doc || !libre(dia, h, doc);
                  const activa = hora === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={no}
                      onClick={() => setHora(h)}
                      aria-pressed={activa}
                      className={`rounded-xl py-2.5 text-sm font-bold transition active:scale-95 ${no ? "bg-[#123b40]/5 text-[#123b40]/25 line-through cursor-not-allowed" : activa ? "text-white" : "border border-[#123b40]/12 hover:border-[#123b40]/40"}`}
                      style={activa ? { background: AZUL } : undefined}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {paso === 3 && servicio && doc && hora && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl p-5" style={{ background: CIELO }}>
                <p className="text-sm font-semibold opacity-60">Resumen</p>
                <p className="mt-2 text-[1.2rem] font-extrabold">{servicio.nombre}</p>
                <p className="mt-1">{doc.nombre}</p>
                <p className="mt-1">
                  {mayus(fechaLarga(dia))}, {hora}
                </p>
                <p className="mt-3 font-bold" style={{ color: AZUL }}>
                  {servicio.desde ? "desde " : ""}
                  {qz(servicio.precio)}
                </p>
              </div>
              <div>
                <label htmlFor="c-nombre" className="text-sm font-semibold">
                  Su nombre
                </label>
                <input
                  id="c-nombre"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    setError("");
                  }}
                  placeholder="María López"
                  className="mt-1.5 w-full rounded-xl border border-[#123b40]/20 px-3 py-3 focus:outline-none focus:border-[#14555d]"
                />
                {error && <p className="mt-1 text-sm text-[#b42318]">{error}</p>}
                <p className="mt-3 text-sm opacity-65">Le enviamos la confirmación y un recordatorio un día antes por WhatsApp.</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button type="button" onClick={() => setPaso(Math.max(0, paso - 1))} disabled={paso === 0} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 font-bold disabled:opacity-30">
            <ArrowLeft size={17} /> Atrás
          </button>
          {paso < 3 ? (
            <button
              type="button"
              disabled={!puedeSeguir}
              onClick={() => setPaso(paso + 1)}
              className="inline-flex items-center gap-1.5 rounded-full px-6 py-3 font-bold text-white disabled:opacity-35 active:scale-[0.97] transition"
              style={{ background: AZUL }}
            >
              Seguir <ArrowRight size={17} />
            </button>
          ) : (
            <button type="button" onClick={confirmar} className="inline-flex items-center gap-1.5 rounded-full px-6 py-3 font-bold text-white active:scale-[0.97] transition" style={{ background: "#1f9d55" }}>
              Confirmar por WhatsApp
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* Antes y después: se arrastra la línea para comparar (imagen ilustrativa) */
function AntesDespues() {
  const [pos, setPos] = useState(50);
  return (
    <section className="mx-auto max-w-6xl px-5 pb-6">
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 items-center rounded-[2rem] p-7 sm:p-12" style={{ background: CIELO }}>
        <div>
          <p className="font-bold text-[0.85rem]" style={{ color: AZUL }}>
            Blanqueamiento
          </p>
          <h2 className="mt-2 !text-[#123b40] text-[2rem] sm:text-[2.6rem] font-normal tracking-[-0.01em] leading-tight" style={{ fontFamily: TITULO }}>
            Antes y después
          </h2>
          <p className="mt-3 opacity-75 max-w-sm">Arrastre la línea para comparar. Así puede mostrar los resultados de sus pacientes, con su permiso.</p>
          <p className="mt-3 text-xs opacity-55">Imagen ilustrativa.</p>
        </div>
        <div className="relative aspect-[10/7] overflow-hidden rounded-[1.5rem] select-none">
          <img src={sonrisa} alt="Sonrisa después del blanqueamiento" className="absolute inset-0 w-full h-full object-cover" />
          <img
            src={sonrisa}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, filter: "sepia(.55) saturate(.8) brightness(.93)" }}
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold">Antes</span>
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold">Después</span>
          <div className="absolute inset-y-0 w-0.5 bg-white pointer-events-none" style={{ left: `${pos}%` }}>
            <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 grid place-items-center w-10 h-10 rounded-full bg-white shadow-lg" style={{ color: AZUL }}>
              <ChevronsLeftRight size={20} />
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={95}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="Comparar antes y después"
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
          />
        </div>
      </div>
    </section>
  );
}

/* Lo que se entiende en 5 segundos: un solo sistema para todos */
function UnSistema({ alEntrar }: { alEntrar: (s: Sesion) => void }) {
  const tarjetas = [
    { r: ROLES[4], t: "Pacientes", d: "Agendan en línea, ven sus citas, indicaciones y saldo." },
    { r: ROLES[0], t: "Recepción", d: "Agenda de todos, confirma, manda recordatorios y cobra." },
    { r: ROLES[1], t: "Doctores", d: "Su agenda, consultas, odontograma y plan de tratamiento." },
    { r: ROLES[3], t: "Dueño", d: "Ingresos, reportes y qué puede ver cada quien." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10">
      <div className="rounded-[2rem] bg-white p-6 sm:p-8 border border-[#123b40]/8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-bold text-[0.85rem]" style={{ color: AZUL }}>
              Todo en un solo sistema
            </p>
            <h2 className="mt-1 !text-[#123b40] text-[1.6rem] sm:text-[2rem] font-normal tracking-[-0.01em] leading-tight" style={{ fontFamily: TITULO }}>
              Cada quien entra y ve lo suyo
            </h2>
          </div>
          <p className="text-sm opacity-60">Toque uno para entrar como esa persona.</p>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tarjetas.map(({ r, t, d }) => {
            const Icono = ICONO_ROL[r.rol];
            return (
              <button
                key={t}
                type="button"
                onClick={() => alEntrar({ rol: r.rol, doctor: r.doctor })}
                className="group flex flex-col rounded-2xl p-4 text-left transition hover:shadow-md active:scale-[0.98]"
                style={{ background: CIELO }}
              >
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-white" style={{ color: AZUL }}>
                  <Icono size={20} />
                </span>
                <span className="mt-3 font-extrabold text-[1.05rem]">{t}</span>
                <span className="mt-1 flex-1 text-[0.88rem] opacity-70">{d}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-[0.85rem] font-bold" style={{ color: AZUL }}>
                  Entrar <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Quiénes somos: historia, misión, visión y valores (texto de ejemplo) */
function Nosotros() {
  const bloques = [
    { Icono: Target, t: "Misión", d: "Atender a cada paciente con calma, explicarle todo antes de empezar y cobrarle lo justo." },
    { Icono: Eye, t: "Visión", d: "Ser la clínica a la que las familias de la zona vuelven, y a la que mandan a sus conocidos." },
    { Icono: HeartHandshake, t: "Valores", d: "Puntualidad, precios claros, higiene estricta y trato amable, sin regaños." },
  ];
  return (
    <section id="nosotros" className="scroll-mt-16 mx-auto max-w-6xl px-5 pt-16 sm:pt-24">
      <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 items-start">
        <div>
          <p className="font-bold text-[0.85rem]" style={{ color: AZUL }}>
            Quiénes somos
          </p>
          <h2 className="mt-2 !text-[#123b40] text-[2.2rem] sm:text-[3rem] font-normal tracking-[-0.01em] leading-[1.05]" style={{ fontFamily: TITULO }}>
            Una clínica pequeña, a propósito
          </h2>
          <p className="mt-5 text-[1.05rem] opacity-75">
            Aurora abrió en 2016 con un sillón y una idea: que ir al dentista no dé miedo ni sorpresas en la cuenta. Hoy somos dos doctores, una recepcionista y más de 1,500 pacientes que nos conocen por nombre.
          </p>
          <p className="mt-3 text-sm opacity-55">Historia, cifras y textos de ejemplo.</p>
        </div>
        <div className="grid gap-3">
          {bloques.map(({ Icono, t, d }) => (
            <div key={t} className="flex gap-4 rounded-3xl bg-white p-5 border border-[#123b40]/8">
              <span className="grid place-items-center w-11 h-11 shrink-0 rounded-2xl" style={{ background: CIELO, color: AZUL }}>
                <Icono size={21} />
              </span>
              <div>
                <h3 className="!text-[#123b40] text-[1.15rem] font-bold" style={{ fontFamily: TITULO }}>
                  {t}
                </h3>
                <p className="mt-0.5 opacity-70">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Opiniones: de ejemplo, con iniciales (en la real van las de sus pacientes, con su permiso) */
function Opiniones() {
  const lista = [
    { n: "Paola G.", s: "Limpieza dental", t: "Me dijeron el precio desde antes y eso fue lo que pagué. Me llegó el recordatorio y no tuve que esperar." },
    { n: "Ricardo M.", s: "Resina", t: "Le tengo pánico al dentista y la doctora me explicó todo con paciencia. No sentí nada." },
    { n: "Familia Ávila", s: "Ortodoncia", t: "En el portal vemos cuánto llevamos pagado de los brackets de mi hija. Muy ordenado." },
  ];
  return (
    <section id="opiniones" className="scroll-mt-16 mx-auto max-w-6xl px-5 pb-16 sm:pb-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="!text-[#123b40] text-[2.2rem] sm:text-[3rem] font-normal tracking-[-0.01em]" style={{ fontFamily: TITULO }}>
          Lo que dicen los pacientes
        </h2>
        <span className="rounded-full px-3 py-1 text-[0.8rem] font-semibold" style={{ background: CIELO, color: AZUL }}>
          Opiniones de ejemplo
        </span>
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {lista.map((o) => (
          <figure key={o.n} className="flex flex-col rounded-3xl bg-white p-6 border border-[#123b40]/8">
            <blockquote className="flex-1 text-[1.02rem] leading-relaxed">“{o.t}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-full text-[0.85rem] font-bold text-white" style={{ background: AZUL }}>
                {o.n
                  .split(" ")
                  .map((x) => x[0])
                  .join("")}
              </span>
              <span>
                <span className="block font-bold">{o.n}</span>
                <span className="block text-[0.82rem] opacity-60">{o.s}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* logo: un diente con el sol saliendo detrás, la aurora */
function LogoAurora() {
  return (
    <svg viewBox="0 0 44 44" width="40" height="40" aria-hidden className="shrink-0">
      <circle cx="22" cy="22" r="21" fill={AZUL} />
      <path d="M9 27 A13 13 0 0 1 35 27 Z" fill={MENTA} />
      <path d="M15 13 C15 10.5 17 9.5 19 10 C20.5 10.4 21.3 11 22 11 C22.7 11 23.5 10.4 25 10 C27 9.5 29 10.5 29 13 C29 17 28 19 27.4 23 C27 26 26.6 31 25 31 C23.4 31 23.4 25.5 22 25.5 C20.6 25.5 20.6 31 19 31 C17.4 31 17 26 16.6 23 C16 19 15 17 15 13 Z" fill="#fff" />
      <path d="M7 27 H37" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity=".6" />
    </svg>
  );
}

/* tira de odontograma: la arcada de arriba con los dientes numerados, como en la ficha del dentista */
function Odontograma() {
  const nums = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const marcados: Record<number, string> = { 16: MENTA, 24: MENTA, 11: AZUL };
  return (
    <div aria-hidden className="overflow-hidden border-y border-[#123b40]/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-1 px-5 py-3">
        {nums.map((n) => {
          const ancho = [16, 17, 18, 26, 27, 28].includes(n) ? 30 : [14, 15, 24, 25].includes(n) ? 24 : 20;
          return (
            <span key={n} className="flex flex-col items-center gap-1">
              <svg viewBox="0 0 30 34" width={ancho} height={30} className="max-sm:w-[14px]">
                <path d="M4 6 C4 2 8 1 11 2 C13 2.6 14 3 15 3 C16 3 17 2.6 19 2 C22 1 26 2 26 6 C26 12 24.5 16 24 22 C23.6 27 22.6 33 20 33 C17.6 33 17.6 24 15 24 C12.4 24 12.4 33 10 33 C7.4 33 6.4 27 6 22 C5.5 16 4 12 4 6 Z" fill={marcados[n] ? marcados[n] : "#fff"} stroke={TINTA} strokeOpacity=".35" strokeWidth="1.3" />
              </svg>
              <span className="text-[0.62rem] tabular-nums opacity-50 max-sm:hidden">{n}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
