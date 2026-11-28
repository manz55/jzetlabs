/* Barra lateral de recepción: la talanquera de Zona 14 y su bitácora en vivo. */
import { useEffect, useState } from "react";
import { DoorClosed, DoorOpen, ShieldAlert, Wifi } from "lucide-react";
import type { Club } from "./datos";
import { RESPUESTA } from "./Carne";
import { CAMPO, CARBON, ROTULO } from "./Piezas";

export const MOTIVOS = ["Falló la huella", "Visita", "Proveedor o mantenimiento", "Emergencia"];
/* lo que tarda en cerrarse sola */
const ABIERTA_MS = 6000;

export function Talanquera({ club, motivo, alMotivo, alAbrir }: { club: Club; motivo: string; alMotivo: (m: string) => void; alAbrir: () => void }) {
  const [, repintar] = useState(0);
  const lecturas = club.lecturas.filter((l) => l.sede === "z14");
  const ultima = lecturas[0];
  /* el nombre actual, por si el socio lo corrigió después de pasar */
  const nombreDe = (l: (typeof lecturas)[number]) => club.socios.find((s) => s.id === l.socio)?.nombre ?? l.nombre;

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
    <aside aria-label="Control de acceso" className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-4 md:grid-cols-[repeat(2,minmax(0,1fr))] xl:sticky xl:top-20 xl:col-span-4 xl:grid-cols-[minmax(0,1fr)] xl:gap-3">
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 xl:p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-[1.02rem] font-extrabold leading-tight">Talanquera Zona 14</h2>
            <p className="text-[0.75rem] text-slate-500">Control de acceso ZKTeco</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-[0.74rem] font-extrabold text-green-900">
            <Wifi size={13} aria-hidden /> En línea
          </span>
        </div>
        <div role="status" className={`mt-2.5 flex items-center gap-3 rounded-xl px-3.5 py-2 ${abierta ? "bg-[#15803D] text-white" : rechazo ? "bg-red-700 text-white" : "bg-[#F8FAFC] text-[#0F172A]"}`}>
          <Puerta size={28} aria-hidden className="shrink-0" />
          <p className="min-w-0">
            <b className="block text-[1.05rem] leading-tight">{abierta ? "Abierta" : rechazo ? "Paso rechazado" : "Cerrada"}</b>
            <span className="block truncate text-[0.8rem] opacity-85">{reciente ? nombreDe(ultima) : "Lista para leer QR o huella"}</span>
          </p>
        </div>
        <label className={`${ROTULO} mt-2.5 !gap-1 !text-[0.8rem]`}>
          Motivo de la apertura manual
          <select value={motivo} onChange={(e) => alMotivo(e.target.value)} className={`${CAMPO} !min-h-11 !text-[0.92rem]`}>
            {MOTIVOS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <button type="button" onClick={alAbrir} className={`${CARBON} mt-2 !min-h-11 w-full !px-3`}>
          <DoorOpen size={18} aria-hidden className="shrink-0" /> Abrir talanquera manualmente
        </button>
      </section>

      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 xl:px-3.5 xl:py-3">
        <h2 className="text-[1.02rem] font-extrabold">Bitácora en vivo</h2>
        <ul aria-label="Últimas lecturas" className="mt-1 max-h-72 divide-y divide-slate-100 overflow-y-auto xl:max-h-[max(8rem,calc(100dvh-44rem))]">
          {lecturas.slice(0, 12).map((l) => (
            <li key={l.n} className="flex items-center gap-2.5 py-1.5">
              <span className="w-[4.2rem] shrink-0 text-[0.76rem] font-bold leading-tight text-slate-600">{l.hora}</span>
              <span className="min-w-0 flex-1 leading-tight">
                <b className="block truncate text-[0.86rem] text-[#0F172A]">{nombreDe(l)}</b>
                <span className="block truncate text-[0.74rem] text-slate-500">{l.metodo}</span>
              </span>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[0.7rem] font-extrabold ${RESPUESTA[l.resultado].clase}`}>{RESPUESTA[l.resultado].chip}</span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
