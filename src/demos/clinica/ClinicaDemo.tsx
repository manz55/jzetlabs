/*
 * Demo: clínica dental "Aurora" (negocio inventado, datos de ejemplo).
 * Diseño propio, tranquilo y claro: portada con foto y tarjetas flotantes,
 * agenda de citas en 4 pasos, servicios con precio, antes y después
 * (imagen ilustrativa), equipo, cómo se recuerdan las citas y horario.
 * Fotos libres de Unsplash (src/assets/demo-clinica).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarCheck, Check, ChevronsLeftRight, Clock, CreditCard, Droplet, MapPin, Phone, ShieldCheck, Smile, Stethoscope } from "lucide-react";
import paciente from "@/assets/demo-clinica/paciente.jpg";
import sonrisa from "@/assets/demo-clinica/sonrisa.jpg";
import consultorio from "@/assets/demo-clinica/consultorio.jpg";
import doctor from "@/assets/demo-clinica/doctor.jpg";
import doctora from "@/assets/demo-clinica/doctora.jpg";
import { BandaDemos, CierreJzet, MensajeWhatsApp, qz } from "../comun";

const TINTA = "#0f2a3a";
const AZUL = "#1e6fa8";
const CIELO = "#eaf3f9";
const MENTA = "#2f9e86";
const LETRA = '"Plus Jakarta Sans", "Instrument Sans", sans-serif';

type Servicio = { id: string; nombre: string; precio: number; minutos: number; texto: string; icono: typeof Smile; desde?: boolean };
const SERVICIOS: Servicio[] = [
  { id: "valoracion", nombre: "Valoración", precio: 150, minutos: 30, texto: "Revisión completa y plan de tratamiento por escrito.", icono: Stethoscope },
  { id: "limpieza", nombre: "Limpieza dental", precio: 250, minutos: 45, texto: "Quita sarro y manchas. Recomendada cada 6 meses.", icono: Droplet },
  { id: "blanqueamiento", nombre: "Blanqueamiento", precio: 900, minutos: 60, texto: "Varios tonos más blancos en una sola sesión.", icono: Smile },
  { id: "resina", nombre: "Resina (caries)", precio: 350, minutos: 45, texto: "Arregla caries con material del color del diente.", icono: ShieldCheck },
  { id: "ortodoncia", nombre: "Ortodoncia", precio: 6500, minutos: 45, texto: "Brackets o alineadores. Se paga en cuotas mensuales.", icono: CalendarCheck, desde: true },
  { id: "extraccion", nombre: "Extracción", precio: 300, minutos: 30, texto: "Sin dolor, con anestesia local.", icono: Stethoscope },
];

const DOCTORES = [
  { id: "morales", nombre: "Dra. Ana Morales", area: "Odontología general y estética", dias: "Lunes a viernes", foto: doctora },
  { id: "fuentes", nombre: "Dr. Luis Fuentes", area: "Ortodoncia", dias: "Martes, jueves y sábado", foto: doctor },
];

const DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const HORAS = Array.from({ length: 18 }, (_, i) => {
  const m = 8 * 60 + i * 30;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${m % 60 === 0 ? "00" : "30"}`;
});

/* próximos 10 días hábiles (sin domingo) */
function proximosDias() {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (out.length < 10) {
    if (d.getDay() !== 0) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/* horarios ocupados de ejemplo, siempre los mismos para cada día */
function ocupado(dia: Date, i: number) {
  const n = (dia.getDate() * 7 + i * 13) % 10;
  return n < 3;
}
function yaPaso(dia: Date, hora: string) {
  const ahora = new Date();
  const [h, m] = hora.split(":").map(Number);
  const t = new Date(dia);
  t.setHours(h, m);
  return t.getTime() < ahora.getTime() + 30 * 60 * 1000;
}
const fechaLarga = (d: Date) => `${DIAS_CORTOS[d.getDay()]} ${d.getDate()} de ${MESES_CORTOS[d.getMonth()]}`;
const mayus = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export default function ClinicaDemo() {
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [servicioInicial, setServicioInicial] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Clínica Dental Aurora · Demo de Jzet Labs";
  }, []);

  const proximo = useMemo(() => {
    for (const d of proximosDias()) for (let i = 0; i < HORAS.length; i++) if (!ocupado(d, i) && !yaPaso(d, HORAS[i])) return { d, h: HORAS[i] };
    return null;
  }, []);

  function agendar(id: string) {
    setServicioInicial(id);
    document.getElementById("agenda")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={{ background: "#f7fafc", color: TINTA, fontFamily: LETRA }} className="min-h-screen">
      <BandaDemos />

      {/* encabezado */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#0f2a3a]/10">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
          <a href="#inicio" className="inline-flex items-center gap-2.5">
            <span className="grid place-items-center w-9 h-9 rounded-full text-white" style={{ background: AZUL }}>
              <Smile size={19} />
            </span>
            <span className="leading-tight">
              <span className="block font-extrabold text-[1.05rem]">Aurora</span>
              <span className="block text-[0.7rem] opacity-60">Clínica dental</span>
            </span>
          </a>
          <nav className="hidden md:flex gap-7 text-[0.92rem] opacity-80">
            <a href="#servicios" className="hover:opacity-100">
              Servicios
            </a>
            <a href="#equipo" className="hover:opacity-100">
              Doctores
            </a>
            <a href="#horario" className="hover:opacity-100">
              Horario
            </a>
          </nav>
          <a href="#agenda" className="rounded-full px-4 py-2 text-[0.9rem] font-bold text-white active:scale-95 transition" style={{ background: AZUL }}>
            Agendar cita
          </a>
        </div>
      </header>

      {/* portada */}
      <section id="inicio" style={{ background: `linear-gradient(180deg, ${CIELO}, #f7fafc)` }}>
        <div className="mx-auto max-w-6xl px-5 pt-12 pb-16 sm:pt-16 sm:pb-24 grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[0.82rem] font-semibold shadow-sm" style={{ color: AZUL }}>
              <MapPin size={14} /> Zona 10 · Atención con cita
            </span>
            <h1 className="mt-5 !text-[#0f2a3a] text-[2.7rem] sm:text-[3.8rem] leading-[1.03] tracking-[-0.03em] font-extrabold" style={{ fontFamily: LETRA }}>
              Una sonrisa sana, <span style={{ color: AZUL }}>sin esperas.</span>
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
            <img src={paciente} alt="Paciente sonriendo" className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-[0_30px_60px_-30px_rgba(15,42,58,.45)]" />
            {proximo && (
              <div className="absolute -left-3 sm:-left-10 top-8 rounded-2xl bg-white px-4 py-3 shadow-[0_18px_40px_-18px_rgba(15,42,58,.45)]">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] opacity-50">Próxima cita libre</p>
                <p className="mt-0.5 font-extrabold" style={{ color: AZUL }}>
                  {proximo.d.toDateString() === new Date().toDateString() ? "Hoy" : mayus(fechaLarga(proximo.d))}, {proximo.h}
                </p>
              </div>
            )}
            <div className="absolute -right-2 sm:-right-8 bottom-10 rounded-2xl bg-white px-4 py-3 shadow-[0_18px_40px_-18px_rgba(15,42,58,.45)] flex items-center gap-3">
              <span className="grid place-items-center w-9 h-9 rounded-full text-white" style={{ background: MENTA }}>
                <Check size={18} />
              </span>
              <div>
                <p className="font-bold text-[0.92rem]">Recordatorio enviado</p>
                <p className="text-[0.75rem] opacity-60">Mañana, 10:00 · Limpieza</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Agenda servicioInicial={servicioInicial} alConfirmar={setMensaje} />

      {/* servicios */}
      <section id="servicios" className="scroll-mt-16 mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <p className="font-bold text-[0.85rem] uppercase tracking-[0.14em]" style={{ color: AZUL }}>
          Servicios
        </p>
        <h2 className="mt-2 !text-[#0f2a3a] text-[2.2rem] sm:text-[3rem] font-extrabold tracking-[-0.03em]" style={{ fontFamily: LETRA }}>
          Precios claros, antes de venir
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICIOS.map((s) => {
            const Icono = s.icono;
            return (
              <article key={s.id} className="rounded-3xl bg-white p-6 shadow-[0_1px_0_rgba(15,42,58,.06)] border border-[#0f2a3a]/8 flex flex-col">
                <span className="grid place-items-center w-11 h-11 rounded-2xl" style={{ background: CIELO, color: AZUL }}>
                  <Icono size={21} />
                </span>
                <h3 className="mt-4 !text-[#0f2a3a] text-[1.2rem] font-bold" style={{ fontFamily: LETRA }}>
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

      {/* equipo */}
      <section id="equipo" className="scroll-mt-16 mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <h2 className="!text-[#0f2a3a] text-[2.2rem] sm:text-[3rem] font-extrabold tracking-[-0.03em]" style={{ fontFamily: LETRA }}>
          Quién lo atiende
        </h2>
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {DOCTORES.map((d) => (
            <article key={d.id} className="flex gap-5 rounded-3xl bg-white p-5 border border-[#0f2a3a]/8">
              <img src={d.foto} alt={d.nombre} className="w-28 sm:w-36 aspect-[5/6] object-cover rounded-2xl" loading="lazy" />
              <div className="py-1">
                <h3 className="!text-[#0f2a3a] text-[1.3rem] font-bold" style={{ fontFamily: LETRA }}>
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

      {/* recordatorio */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:pb-24">
        <div className="grid md:grid-cols-[1fr_1fr] gap-10 items-center rounded-[2rem] p-7 sm:p-12 text-white" style={{ background: TINTA }}>
          <div>
            <h2 className="!text-white text-[2rem] sm:text-[2.6rem] font-extrabold tracking-[-0.03em] leading-tight" style={{ fontFamily: LETRA }}>
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
            <h2 className="!text-[#0f2a3a] text-[2.2rem] font-extrabold tracking-[-0.03em]" style={{ fontFamily: LETRA }}>
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

      <MensajeWhatsApp mensaje={mensaje} alCerrar={() => setMensaje(null)} demo="clínica dental" que="la cita" />
    </div>
  );
}

/* Agenda en 4 pasos: servicio, doctor, día y hora, datos */
function Agenda({ servicioInicial, alConfirmar }: { servicioInicial: string | null; alConfirmar: (m: string) => void }) {
  const dias = useMemo(proximosDias, []);
  const [paso, setPaso] = useState(0);
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [doc, setDoc] = useState<(typeof DOCTORES)[number] | null>(null);
  // empieza en el primer día que todavía tiene horarios libres
  const [dia, setDia] = useState<Date>(() => dias.find((d) => HORAS.some((h, i) => (d.getDay() !== 6 || h < "12:00") && !ocupado(d, i) && !yaPaso(d, h))) ?? dias[0]);
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
    alConfirmar(`Hola, Clínica Aurora. Soy ${nombre.trim()} y quiero agendar ${servicio.nombre.toLowerCase()} con ${doc.nombre} el ${fechaLarga(dia)} a las ${hora}. ¿Me la confirman?`);
  }

  return (
    <section id="agenda" className="scroll-mt-16 mx-auto max-w-6xl px-5 py-6">
      <div ref={caja} className="rounded-[2rem] bg-white p-6 sm:p-10 shadow-[0_30px_70px_-40px_rgba(15,42,58,.45)] border border-[#0f2a3a]/8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-bold text-[0.85rem] uppercase tracking-[0.14em]" style={{ color: AZUL }}>
              Agenda en línea
            </p>
            <h2 className="mt-1 !text-[#0f2a3a] text-[1.9rem] sm:text-[2.4rem] font-extrabold tracking-[-0.03em]" style={{ fontFamily: LETRA }}>
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
                  className={`rounded-2xl border-2 px-4 py-3.5 text-left transition active:scale-[0.98] ${servicio?.id === s.id ? "" : "border-[#0f2a3a]/10 hover:border-[#0f2a3a]/30"}`}
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
                  className={`flex items-center gap-4 rounded-2xl border-2 p-3 text-left transition active:scale-[0.98] ${doc?.id === d.id ? "" : "border-[#0f2a3a]/10 hover:border-[#0f2a3a]/30"}`}
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
                      className={`shrink-0 w-16 rounded-2xl border-2 py-2.5 text-center transition active:scale-95 ${activo ? "text-white border-transparent" : "border-[#0f2a3a]/10 hover:border-[#0f2a3a]/30"}`}
                      style={activo ? { background: AZUL } : undefined}
                    >
                      <span className="block text-[0.72rem] font-semibold uppercase opacity-80">{DIAS_CORTOS[d.getDay()]}</span>
                      <span className="block text-[1.3rem] font-extrabold leading-tight">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
                {HORAS.filter((h) => dia.getDay() !== 6 || h < "12:00").map((h) => {
                  const i = HORAS.indexOf(h);
                  const no = ocupado(dia, i) || yaPaso(dia, h);
                  const activa = hora === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={no}
                      onClick={() => setHora(h)}
                      aria-pressed={activa}
                      className={`rounded-xl py-2.5 text-sm font-bold transition active:scale-95 ${no ? "bg-[#0f2a3a]/5 text-[#0f2a3a]/25 line-through cursor-not-allowed" : activa ? "text-white" : "border border-[#0f2a3a]/12 hover:border-[#0f2a3a]/40"}`}
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
                  className="mt-1.5 w-full rounded-xl border border-[#0f2a3a]/20 px-3 py-3 focus:outline-none focus:border-[#1e6fa8]"
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
          <p className="font-bold text-[0.85rem] uppercase tracking-[0.14em]" style={{ color: AZUL }}>
            Blanqueamiento
          </p>
          <h2 className="mt-2 !text-[#0f2a3a] text-[2rem] sm:text-[2.6rem] font-extrabold tracking-[-0.03em] leading-tight" style={{ fontFamily: LETRA }}>
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
