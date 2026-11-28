import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, Printer } from "lucide-react";
import { pesoActual, resumenCarnet, vigencia } from "./carnet";
import { SEDE, colegiadoDe, fechaCorta, hoyIso, type Mascota } from "./datos";
import { ultimasAplicaciones } from "./expediente";
import { Logo } from "./Nav";
import { Retrato, Ventana } from "./Piezas";
import { TEMA } from "./tema";

const LADO_QR = 21;
const ESQUINAS = [
  [0, 0],
  [0, LADO_QR - 7],
  [LADO_QR - 7, 0],
];

function modulosQr(semilla: string) {
  let n = [...semilla].reduce((h, letra) => (Math.imul(h, 31) + letra.charCodeAt(0)) >>> 0, 7);
  return Array.from({ length: LADO_QR * LADO_QR }, (_, i) => {
    const fila = Math.floor(i / LADO_QR);
    const columna = i % LADO_QR;
    n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
    for (const [f, c] of ESQUINAS) {
      const y = fila - f;
      const x = columna - c;
      if (y >= -1 && y <= 7 && x >= -1 && x <= 7) {
        const anillo = Math.max(Math.abs(y - 3), Math.abs(x - 3));
        return anillo === 3 || anillo <= 1;
      }
    }
    return n >>> 31 === 1;
  });
}

function CodigoQr({ semilla }: { semilla: string }) {
  return (
    <span aria-hidden className="grid size-16 shrink-0 sm:size-24 grid-cols-[repeat(21,minmax(0,1fr))] grid-rows-[repeat(21,minmax(0,1fr))] rounded-lg bg-white p-1 sm:rounded-xl sm:p-1.5">
      {modulosQr(semilla).map((lleno, i) => (
        <span key={i} className={lleno ? "bg-[#0F172A]" : ""} />
      ))}
    </span>
  );
}

function Credencial({ mascota }: { mascota: Mascota }) {
  const aplicaciones = ultimasAplicaciones(mascota);
  const datos = [
    ["Especie", mascota.especie === "perro" ? "Perro" : "Gato"],
    ["Raza", mascota.raza],
    ["Edad", mascota.edad],
    ["Peso actual", pesoActual(mascota)],
    ["Propietario", mascota.dueno],
  ];

  return (
    <article className="overflow-hidden rounded-3xl border border-[#CBD5E1] bg-white text-[#334155]">
      <header className="flex items-start justify-between gap-4 bg-[#0F172A] p-5 text-white sm:p-6">
        <div className="min-w-0">
          <Logo claro />
          <p className="mt-4 text-xs font-bold text-[#CBD5E1]">Credencial Veterinaria Digital · Carnet de vacunación</p>
          <p className="mt-1 whitespace-nowrap text-xl font-extrabold tabular-nums tracking-wide sm:text-2xl">{mascota.expediente}</p>
        </div>
        <CodigoQr semilla={mascota.expediente} />
      </header>

      <div className="flex flex-col gap-5 border-b-2 border-dashed border-[#CBD5E1] bg-[#F0FDFA] p-5 sm:flex-row sm:items-center sm:p-6">
        <Retrato mascota={mascota} className="size-24 border-4 border-white" />
        <div className="min-w-0 flex-1">
          <h3 className="text-3xl font-extrabold">{mascota.nombre}</h3>
          <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3">
            {datos.map(([nombre, valor]) => (
              <div key={nombre} className="min-w-0">
                <dt className="text-[0.7rem] font-bold uppercase tracking-wider text-[#0F766E]">{nombre}</dt>
                <dd className="break-words text-sm font-extrabold text-[#0F172A]">{valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <h4 className="text-sm font-extrabold text-[#0F172A]">Vacunas y desparasitación</h4>
        {aplicaciones.length ? (
          <ul className="mt-3 grid gap-2.5">
            {aplicaciones.map((v) => {
              const estado = vigencia(v.proxima);
              return (
                <li key={v.id} className={`break-inside-avoid rounded-xl border border-l-4 border-[#E2E8F0] p-3.5 ${estado.borde}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-extrabold text-[#0F172A]">{v.nombre}</p>
                    <span className={`hv-chip ${estado.clase}`}>{estado.texto}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-[1fr_1fr_1.6fr]">
                    <p>
                      Aplicada
                      <span className="block text-sm font-bold tabular-nums text-[#0F172A]">{fechaCorta(v.aplicada)}</span>
                    </p>
                    <p>
                      Próximo refuerzo
                      <span className="block text-sm font-bold tabular-nums text-[#0F172A]">{fechaCorta(v.proxima)}</span>
                    </p>
                    <p className="col-span-2 sm:col-span-1">
                      <span className="block text-sm font-bold text-[#0F172A]">{v.medico}</span>
                      <span className="tabular-nums">Colegiado activo No. {colegiadoDe(v.medico)}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 text-sm">Todavía no hay aplicaciones registradas en este expediente.</p>
        )}
      </div>

      <footer className="flex break-inside-avoid flex-wrap items-center justify-between gap-5 border-t border-[#E2E8F0] bg-[#FAFAF9] p-5 sm:p-6">
        <div className="min-w-0 flex-1 basis-56 text-xs">
          <p className="font-extrabold text-[#0F172A]">Huella Vital · Veterinaria & Grooming</p>
          <p className="mt-1">{SEDE.direccion}</p>
          <p className="tabular-nums">Tel. {SEDE.telefono}</p>
          <p className="mt-2 tabular-nums">Emitido el {fechaCorta(hoyIso())}</p>
        </div>
        <div className="grid size-32 shrink-0 -rotate-6 place-items-center rounded-full border-[3px] border-[#0F766E] p-1">
          <p className="grid size-full place-content-center rounded-full border border-dashed border-[#0F766E] text-center leading-tight text-[#0F766E]">
            <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.14em]">Validación</span>
            <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.14em]">clínica</span>
            <Check size={20} aria-hidden className="mx-auto my-0.5" strokeWidth={3} />
            <span className="text-[0.62rem] font-extrabold">HUELLA VITAL</span>
          </p>
        </div>
      </footer>
    </article>
  );
}

export function VentanaCredencial({ mascota, alCerrar }: { mascota: Mascota; alCerrar: () => void }) {
  const [copia, setCopia] = useState<"" | "lista" | "manual">("");
  const resumen = resumenCarnet(mascota);

  useEffect(() => {
    const antes = document.title;
    document.title = `Carnet ${mascota.nombre} ${mascota.expediente} · Huella Vital`;
    return () => {
      document.title = antes;
    };
  }, [mascota.nombre, mascota.expediente]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(resumen);
      setCopia("lista");
    } catch {
      setCopia("manual");
    }
  }

  return (
    <Ventana titulo="Carnet Digital de Vacunación" alCerrar={alCerrar} amplia>
      <Credencial mascota={mascota} />
      <div className="sticky -bottom-6 -mx-6 -mb-6 mt-5 grid gap-2 border-t border-[#E2E8F0] bg-white px-6 py-4 sm:grid-cols-2">
        <button type="button" onClick={copiar} className="hv-boton hv-turquesa">
          {copia === "lista" ? <Check size={17} aria-hidden /> : <Copy size={17} aria-hidden />}
          {copia === "lista" ? "Resumen copiado" : "Copiar resumen para WhatsApp"}
        </button>
        <button type="button" onClick={() => window.print()} className="hv-boton hv-linea">
          <Printer size={17} aria-hidden /> Imprimir / Guardar PDF
        </button>
        {copia === "manual" && (
          <label className="block sm:col-span-2">
            <span className="hv-rotulo">Selecciona y copia el resumen</span>
            <textarea readOnly autoFocus rows={5} value={resumen} onFocus={(e) => e.target.select()} className="hv-campo !h-auto py-2 !text-sm" />
          </label>
        )}
      </div>
      {createPortal(
        <div className="hv-impresion" style={TEMA}>
          <Credencial mascota={mascota} />
        </div>,
        document.body,
      )}
    </Ventana>
  );
}
