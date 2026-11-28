/* Monitor de la talanquera de Zona 14: estado, apertura manual y últimas lecturas. */
import { useEffect, useState } from "react";
import { DoorClosed, DoorOpen, ShieldAlert, Wifi } from "lucide-react";
import type { Club } from "./datos";
import { RESPUESTA } from "./Carne";
import { CAMPO, CARBON, ROTULO, TARJETA } from "./Piezas";

const MOTIVOS = ["Falló la huella", "Visita", "Proveedor o mantenimiento", "Emergencia"];
/* lo que tarda en cerrarse sola */
const ABIERTA_MS = 6000;

export function Talanquera({ club }: { club: Club }) {
  const [motivo, setMotivo] = useState(MOTIVOS[0]);
  const [, repintar] = useState(0);
  const lecturas = club.lecturas.filter((l) => l.sede === "z14");
  const ultima = lecturas[0];

  useEffect(() => {
    const falta = (ultima?.ts ?? 0) + ABIERTA_MS - Date.now();
    if (falta <= 0) return;
    const t = window.setTimeout(() => repintar((n) => n + 1), falta + 50);
    return () => window.clearTimeout(t);
  }, [ultima?.n, ultima?.ts]);

  const reciente = !!ultima && Date.now() - ultima.ts < ABIERTA_MS;
  const abierta = reciente && ultima.resultado !== "rechazo";
  const rechazo = reciente && ultima.resultado === "rechazo";
  const Puerta = abierta ? DoorOpen : rechazo ? ShieldAlert : DoorClosed;

  return (
    <section aria-label="Control de acceso" className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]">
      <div className={TARJETA}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[1.1rem] font-extrabold">Talanquera Zona 14</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[0.78rem] font-extrabold text-green-900">
            <Wifi size={14} aria-hidden /> En línea
          </span>
        </div>
        <div role="status" className={`mt-3 flex items-center gap-3 rounded-xl p-4 ${abierta ? "bg-[#15803D] text-white" : rechazo ? "bg-red-700 text-white" : "bg-[#F8FAFC] text-[#0F172A]"}`}>
          <Puerta size={32} aria-hidden className="shrink-0" />
          <p className="min-w-0">
            <b className="block text-[1.15rem] leading-tight">{abierta ? "Abierta" : rechazo ? "Paso rechazado" : "Cerrada"}</b>
            <span className="text-[0.85rem] opacity-85">{reciente ? ultima.nombre : "Lista para leer QR o huella"}</span>
          </p>
        </div>
        <label className={`${ROTULO} mt-3`}>
          Motivo de la apertura manual
          <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className={CAMPO}>
            {MOTIVOS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <button type="button" onClick={() => club.abrirManual(motivo)} className={`${CARBON} mt-3 !min-h-14 w-full`}>
          <DoorOpen size={20} aria-hidden className="shrink-0" /> Abrir talanquera manualmente
        </button>
      </div>

      <div className={TARJETA}>
        <h2 className="text-[1.1rem] font-extrabold">Últimas lecturas</h2>
        <ul className="mt-2 divide-y divide-slate-100">
          {lecturas.slice(0, 6).map((l) => (
            <li key={l.n} className="flex items-center gap-3 py-2.5">
              <span className="w-[4.6rem] shrink-0 text-[0.82rem] font-bold leading-tight text-slate-600">{l.hora}</span>
              <span className="min-w-0 flex-1">
                <b className="block truncate text-[0.95rem] text-[#0F172A]">{l.nombre}</b>
                <span className="block text-[0.8rem] text-slate-500">{l.metodo}</span>
              </span>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[0.76rem] font-extrabold ${RESPUESTA[l.resultado].clase}`}>{RESPUESTA[l.resultado].chip}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
