/*
 * Panel · Acceso: el lector de la talanquera (huella, QR o tarjeta), la búsqueda manual por DPI o matrícula
 * y el registro de todo lo que pasó por la puerta, permitido o bloqueado.
 */
import { useEffect, useState } from "react";
import { Check, Fingerprint, IdCard, QrCode, Search } from "lucide-react";
import { PLANES, ROJO, VERDE, dpiDe, faltan, fechaCorta, matriculaDe, porId, qz, type Gym } from "./datos";
import { BORDE, Btn, Cuadro, CuadroSimple, GRIS, MONO, Opciones, Tarjeta, h1, type Aj, type Datos } from "./panelPiezas";
import { coincide } from "./PanelSocios";

type Via = "Huella" | "QR" | "Tarjeta";
const ICONO = { Huella: Fingerprint, QR: QrCode, Tarjeta: IdCard };

function Talanquera({ abierta, ok, esperando }: { abierta: boolean; ok: boolean; esperando: boolean }) {
  const luz = esperando ? "#8a8f94" : ok ? VERDE : ROJO;
  return (
    <svg viewBox="0 0 240 120" className="w-full max-w-[22rem]" role="img" aria-label={esperando ? "Talanquera en espera" : abierta ? "Talanquera abierta" : "Talanquera cerrada"}>
      <rect x="10" y="108" width="220" height="6" rx="3" fill="#2e3236" />
      <rect x="18" y="52" width="34" height="58" rx="5" fill="#2e3236" />
      <rect x="26" y="60" width="18" height="12" rx="2" fill="#16181a" />
      <circle cx="35" cy="84" r="6" fill={luz} style={{ transition: "fill .3s" }} />
      <g style={{ transformOrigin: "46px 58px", transform: `rotate(${abierta ? -72 : 0}deg)`, transition: "transform .6s cubic-bezier(.2,.8,.2,1)" }}>
        <rect x="46" y="54" width="170" height="8" rx="4" fill="#f2c230" />
        {[70, 100, 130, 160, 190].map((x) => <rect key={x} x={x} y="54" width="10" height="8" fill="#16181a" opacity=".85" />)}
      </g>
      <rect x="208" y="70" width="14" height="40" rx="3" fill="#2e3236" />
    </svg>
  );
}

export default function PanelAcceso({ gym, aj, d, setToast }: { gym: Gym; aj: Aj; d: Datos; setToast: (t: string) => void }) {
  const [via, setVia] = useState<Via>("Huella");
  const [simular, setSimular] = useState(gym.socios[0]?.num ?? 101);
  const [res, setRes] = useState<{ num: number; ok: boolean; via: string } | null>(null);
  const [abierta, setAbierta] = useState(false);
  const [q, setQ] = useState("");
  const [adentro, setAdentro] = useState<number | null>(null);
  useEffect(() => { if (!abierta) return; const t = setTimeout(() => setAbierta(false), 3500); return () => clearTimeout(t); }, [abierta]);

  const socioRes = res ? gym.socios.find((s) => s.num === res.num) : undefined;
  const buscados = q.trim() ? gym.socios.filter((s) => coincide(s, q)).slice(0, 4) : [];
  const dentro = gym.entradas.filter((e) => e.ok !== false).length;
  const bloqueadas = gym.entradas.length - dentro;

  const leer = () => {
    const s = gym.socios.find((x) => x.num === simular);
    if (!s) return;
    const ok = faltan(s.vence) >= 0;
    gym.entrar(s.num, via, ok);
    setRes({ num: s.num, ok, via });
    setAbierta(ok);
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <div>
        <h1 className={h1}>Acceso</h1>
        <p className="text-[1.05rem] opacity-65">La talanquera lee la huella, el código QR o la tarjeta del socio. Si la membresía está vigente abre; si está vencida se bloquea y recepción decide.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <Tarjeta className="lg:col-span-7" titulo="Lector de la talanquera" nota="Simulación: elija un socio y cómo se identifica en la puerta.">
          <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="grid justify-items-center gap-2 rounded-xl p-4" style={{ background: GRIS }}>
              <Talanquera abierta={abierta} ok={!!res?.ok} esperando={!res} />
              <p className="text-[1rem] font-semibold opacity-80">{!res ? "Esperando una lectura" : res.ok ? "Puerta abierta" : "Puerta cerrada"}</p>
            </div>
            <div className="grid gap-3">
              <label className="grid gap-1 text-[0.95rem] opacity-90">Socio en la puerta
                <select value={simular} onChange={(e) => { setSimular(Number(e.target.value)); setRes(null); }} className="min-h-[3.25rem] rounded-lg border bg-[#16181a] px-3 text-[1.05rem] text-[#efeee9]" style={{ borderColor: BORDE }}>
                  {gym.socios.map((s) => <option key={s.num} value={s.num}>{matriculaDe(s.num)} · {s.nombre}{faltan(s.vence) < 0 ? " (vencido)" : ""}</option>)}
                </select>
              </label>
              <div><p className="mb-1.5 text-[0.95rem] opacity-90">Cómo se identifica</p><Opciones etiqueta="Lector" valor={via} alCambiar={(v) => { setVia(v); setRes(null); }} opciones={[["Huella", "Huella"], ["QR", "Código QR"], ["Tarjeta", "Tarjeta"]]} /></div>
              <Btn alTocar={leer}>{(() => { const I = ICONO[via]; return <I size={20} />; })()} Simular lectura</Btn>
            </div>
          </div>

          {res && socioRes && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border-l-8 p-5" style={{ borderColor: res.ok ? VERDE : ROJO, background: res.ok ? "rgba(46,155,87,.16)" : "rgba(215,38,61,.18)" }}>
              <div>
                <p className="text-[1.2rem] font-extrabold" style={{ color: res.ok ? "#8be0a8" : "#ff9aa8" }}>{res.ok ? "Acceso permitido" : "Acceso bloqueado: plan vencido"}</p>
                <p className="text-[1.35rem] font-bold">{socioRes.nombre} <span className="font-normal opacity-55" style={{ fontFamily: MONO }}>{matriculaDe(socioRes.num)}</span></p>
                <p className="text-[1.02rem] opacity-80">{res.ok ? `${porId(PLANES, socioRes.plan).nombre} vigente hasta el ${fechaCorta(socioRes.vence)} · lectura por ${res.via.toLowerCase()}` : `Venció hace ${-faltan(socioRes.vence)} ${-faltan(socioRes.vence) === 1 ? "día" : "días"} · lectura por ${res.via.toLowerCase()}`}</p>
              </div>
              {!res.ok && <Btn tipo="rojo" alTocar={() => { const p = porId(PLANES, socioRes.plan); gym.cobrar(socioRes.num); gym.entrar(socioRes.num, "Recepción", true); setRes({ num: socioRes.num, ok: true, via: "recepción" }); setAbierta(true); setToast(`Cobro de ${qz(p.precio)} registrado. Se abrió la puerta.`); }}>Cobrar {qz(porId(PLANES, socioRes.plan).precio)} y dar acceso</Btn>}
            </div>
          )}
        </Tarjeta>

        <div className="grid content-start gap-5 lg:col-span-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border bg-[#202326] p-5" style={{ borderColor: BORDE }}><p className="opacity-70">Entradas de hoy</p><p className="gym-titulo mt-1 text-[3.2rem] leading-none">{dentro}</p></div>
            <div className="rounded-xl border bg-[#202326] p-5" style={{ borderColor: bloqueadas ? ROJO : BORDE }}><p className="opacity-70">Bloqueadas</p><p className="gym-titulo mt-1 text-[3.2rem] leading-none" style={{ color: bloqueadas ? "#ff9aa8" : undefined }}>{bloqueadas}</p></div>
          </div>
          <Tarjeta titulo="Búsqueda manual" nota="Por DPI, matrícula, nombre o teléfono. Sirve si el socio olvidó su código o falla el lector.">
            <div className="flex items-center gap-3 rounded-lg border px-4" style={{ borderColor: BORDE }}><Search size={22} className="opacity-50" /><input aria-label="DPI, matrícula, nombre o teléfono" value={q} onChange={(e) => { setQ(e.target.value); setAdentro(null); }} placeholder="DPI o matrícula (SF-0102)" className="w-full bg-transparent py-4 text-[1.2rem] outline-none" style={{ fontFamily: MONO }} /></div>
            <div className="mt-4 grid gap-3">
              {buscados.map((s) => { const f = faltan(s.vence), ok = f >= 0, p = porId(PLANES, s.plan); return (
                <div key={s.num} className="grid gap-3 rounded-xl border-l-8 p-4" style={{ borderColor: ok ? VERDE : ROJO, background: ok ? "rgba(46,155,87,.16)" : "rgba(215,38,61,.18)" }}>
                  <div><p className="text-[1.25rem] font-bold">{s.nombre}</p><p className="text-[0.95rem] opacity-65" style={{ fontFamily: MONO }}>{matriculaDe(s.num)} · DPI {dpiDe(s.num)}</p><div className="mt-2 flex flex-wrap items-center gap-2"><Cuadro socio={s} avisoDias={aj.avisoDias} /><span className="text-[1rem] opacity-80">{p.nombre}{ok ? ` · quedan ${f} días` : ""}</span></div></div>
                  {adentro === s.num ? <span className="inline-flex items-center gap-2 text-[1.1rem] font-bold" style={{ color: "#8be0a8" }}><Check size={22} /> Entrada registrada</span> : ok ? <Btn alTocar={() => { gym.entrar(s.num, "Manual"); setAdentro(s.num); }}>Registrar entrada</Btn> : <Btn tipo="rojo" alTocar={() => { gym.cobrar(s.num); gym.entrar(s.num, "Recepción"); setAdentro(s.num); }}>Cobrar {qz(p.precio)} y dar acceso</Btn>}
                </div>
              ); })}
              {q.trim() && buscados.length === 0 && <p className="text-[1.1rem] opacity-65">No hay nadie con ese dato.</p>}
            </div>
          </Tarjeta>
        </div>
      </div>

      <Tarjeta className="overflow-x-auto !p-0">
        <div className="p-5 pb-2 sm:p-6 sm:pb-2"><h2 className="text-[1.3rem] font-bold">Registro de entradas de hoy</h2><p className="mt-0.5 text-[0.98rem] opacity-65">Cada lectura de la talanquera queda aquí, también las que se bloquearon.</p></div>
        <table className="w-full min-w-[40rem] text-[1.05rem]">
          <thead><tr className="text-left text-[0.88rem] uppercase tracking-wide opacity-55"><th className="p-4 pl-6">Hora</th><th>Socio</th><th>Matrícula</th><th>Lector</th><th>Resultado</th></tr></thead>
          <tbody>
            {gym.entradas.slice(0, 14).map((e, i) => (
              <tr key={`${e.num}-${e.hora}-${i}`} className="pg-fila border-t" style={{ borderColor: BORDE }}>
                <td className="p-4 pl-6 tabular-nums" style={{ fontFamily: MONO }}>{e.hora}</td><td className="font-semibold">{d.nombre(e.num)}</td><td className="opacity-70" style={{ fontFamily: MONO }}>{matriculaDe(e.num)}</td><td>{e.via ?? "Manual"}</td>
                <td>{e.ok === false ? <CuadroSimple tono="mal">Bloqueado</CuadroSimple> : <CuadroSimple tono="bien">Permitido</CuadroSimple>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Tarjeta>
    </div>
  );
}
