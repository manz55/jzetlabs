/* Carné digital: el mismo estado que ve recepción, la prueba de lectura en la talanquera y las entradas del día. */
import { useState } from "react";
import { CircleCheck, CircleX, Clock3, Fingerprint, RefreshCw, ScanLine } from "lucide-react";
import { accesoDe, fechaEn, planDe, sedeDe, textoDias, type Acceso, type Club, type Lectura, type Socio } from "./datos";
import { BORDE, CARBON, CodigoQR, VERDE } from "./Piezas";

const BANDA: Record<Acceso, { texto: string; clase: string; icono: typeof CircleCheck }> = {
  activo: { texto: "ACCESO ACTIVO", clase: "bg-[#15803D]", icono: CircleCheck },
  tolerancia: { texto: "PASE DE TOLERANCIA 24H", clase: "bg-amber-700", icono: Clock3 },
  bloqueado: { texto: "BLOQUEADO POR MORA", clase: "bg-red-700", icono: CircleX },
};

export const RESPUESTA = {
  paso: { titulo: "Talanquera abierta", detalle: "Adelante, buen entreno.", chip: "Entró", clase: "bg-green-100 text-green-900", icono: CircleCheck },
  tolerancia: { titulo: "Abierta con tolerancia", detalle: "Hay un pago pendiente en recepción.", chip: "Tolerancia", clase: "bg-amber-100 text-amber-900", icono: Clock3 },
  rechazo: { titulo: "Paso rechazado", detalle: "La mensualidad está vencida.", chip: "Rechazado", clase: "bg-red-100 text-red-800", icono: CircleX },
  manual: { titulo: "Abierta a mano", detalle: "Apertura desde recepción.", chip: "Manual", clase: "bg-slate-200 text-slate-800", icono: CircleCheck },
} as const;

export function Carne({ club, socio, alRenovar }: { club: Club; socio: Socio; alRenovar: () => void }) {
  const acceso = accesoDe(socio);
  const banda = BANDA[acceso];
  const Icono = banda.icono;
  /* la respuesta de la última prueba; se borra si cambia el estado del socio */
  const [prueba, setPrueba] = useState<{ de: string; lectura: Lectura } | null>(null);
  const clave = `${socio.id}-${acceso}`;
  const lectura = prueba?.de === clave ? prueba.lectura : null;
  const hoy = club.lecturas.filter((l) => l.socio === socio.id);

  return (
    <article aria-label="Carné digital de entrada" className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="bg-[#0F172A] px-5 py-4 text-white">
        <p className="text-[0.72rem] font-bold tracking-[0.18em] text-green-300">CARNÉ DIGITAL · N.º {socio.id}</p>
        <h2 className="mt-1 break-words text-[1.45rem] font-extrabold leading-tight text-white">{socio.nombre}</h2>
        <p className="text-[0.9rem] text-slate-300">
          {planDe(socio.plan).nombre} · {sedeDe(socio.sede).nombre}
        </p>
      </div>
      <div role="status" className={`flex items-center justify-center gap-2.5 px-4 py-4 text-center text-white ${banda.clase}`}>
        <Icono size={28} aria-hidden className="shrink-0" />
        <span className="min-w-0 text-[1.25rem] font-extrabold leading-tight">{banda.texto}</span>
      </div>

      <div className="p-5">
        <div className={`relative mx-auto w-full max-w-[14rem] ${acceso === "tolerancia" ? "rounded-xl p-2 ring-4 ring-amber-500" : ""}`}>
          <CodigoQR numero={socio.id} activo={acceso !== "bloqueado"} />
          {acceso === "bloqueado" && <p className="absolute inset-0 m-auto h-fit w-fit rounded-lg bg-white px-4 py-2 text-center font-extrabold text-red-700 shadow-md">Renueve para entrar</p>}
        </div>
        {acceso === "tolerancia" && <p className="mt-3 text-center text-[0.9rem] font-extrabold text-amber-800">TOLERANCIA ACTIVA</p>}

        <p className="mt-3 flex items-start justify-center gap-2 text-center text-[0.86rem] font-semibold text-slate-600">
          <Fingerprint size={18} aria-hidden className="mt-0.5 shrink-0 text-[#15803D]" />
          <span className="min-w-0">{socio.medidas ? `QR App + Huella Biométrica #${socio.id}` : "QR App · huella por registrar en recepción"}</span>
        </p>

        <div className="mt-3 border-t border-slate-200 pt-3 text-center">
          {acceso === "activo" ? (
            <>
              <p className="text-[2.8rem] font-extrabold leading-none text-[#0F172A]">{socio.dias}</p>
              <p className="mt-1 font-semibold text-slate-600">
                {socio.dias === 1 ? "día restante" : "días restantes"} · hasta el {fechaEn(socio.dias)}
              </p>
            </>
          ) : (
            <>
              <p className={`text-[1.1rem] font-bold ${acceso === "tolerancia" ? "text-amber-800" : "text-red-700"}`}>{textoDias(socio.dias)}</p>
              {socio.tolerancia && <p className="text-[0.88rem] text-slate-600">El pago sigue pendiente. Puede entrar hasta {socio.tolerancia}</p>}
            </>
          )}
        </div>

        <div className="mt-4 grid gap-2.5">
          <button type="button" onClick={() => setPrueba({ de: clave, lectura: club.leer(socio, "QR App") })} className={`${CARBON} !min-h-13 w-full`}>
            <ScanLine size={19} aria-hidden className="shrink-0" /> Simular lectura en talanquera
          </button>
          <div role="status">
            {lectura && (
              <div className={`flex items-start gap-3 rounded-xl p-3.5 ${RESPUESTA[lectura.resultado].clase}`}>
                {(() => {
                  const R = RESPUESTA[lectura.resultado].icono;
                  return <R size={24} aria-hidden className="mt-0.5 shrink-0" />;
                })()}
                <p className="min-w-0 text-[0.9rem]">
                  <b className="block text-[1rem]">{RESPUESTA[lectura.resultado].titulo}</b>
                  {RESPUESTA[lectura.resultado].detalle} Talanquera Zona 14, {lectura.hora}
                </p>
              </div>
            )}
          </div>
          <button type="button" onClick={alRenovar} className={`${acceso === "activo" ? BORDE : VERDE} !min-h-13 w-full`}>
            <RefreshCw size={19} aria-hidden className="shrink-0" /> Renovar membresía
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-[0.95rem] font-extrabold">Mis lecturas de hoy</h3>
          {hoy.length === 0 ? (
            <p className="text-[0.88rem] text-slate-600">Todavía no ha pasado por la talanquera.</p>
          ) : (
            <ul className="mt-1.5 grid max-h-44 gap-1.5 overflow-y-auto">
              {hoy.map((l) => (
                <li key={l.n} className="flex items-center justify-between gap-2 rounded-lg bg-[#F8FAFC] px-3 py-2 text-[0.85rem]">
                  <span className="min-w-0">
                    <b className="text-[#0F172A]">{l.hora}</b> · {l.metodo}
                  </span>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.76rem] font-extrabold ${RESPUESTA[l.resultado].clase}`}>{RESPUESTA[l.resultado].chip}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
