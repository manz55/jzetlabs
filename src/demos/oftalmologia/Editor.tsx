import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, PackageCheck, Wallet } from "lucide-react";
import { cuando } from "./agenda";
import { CRISTALES, ETAPAS, PROFESIONALES, SERVICIOS, aroPorId, qz, type Paciente } from "./datos";
import type { ClinicaViva } from "./estado";
import { CAMPOS_OJO, escribirOjo, leerOjo, type CampoOjo } from "./recetas";

export type PestanaEditor = "graduacion" | "entrega";

type Avisar = (texto: string, alerta?: boolean) => void;

function FormularioGraduacion({ clinica, paciente, enfoque, alAvisar }: { clinica: ClinicaViva; paciente: Paciente; enfoque: number; alAvisar: Avisar }) {
  const g = paciente.graduacion;
  const [ojos, setOjos] = useState(() => ({ od: escribirOjo(g?.od), oi: escribirOjo(g?.oi) }));
  const [cristal, setCristal] = useState(g?.cristal ?? CRISTALES[0]);
  const [profesional, setProfesional] = useState(g?.profesional ?? PROFESIONALES[1]);
  const [error, setError] = useState("");
  const primero = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (enfoque) primero.current?.focus({ preventScroll: true });
  }, [enfoque]);

  const escribir = (lado: "od" | "oi", campo: CampoOjo, valor: string) => setOjos((o) => ({ ...o, [lado]: { ...o[lado], [campo]: valor } }));

  function guardar(e: FormEvent) {
    e.preventDefault();
    const od = leerOjo(ojos.od, "OD");
    if (typeof od === "string") return setError(od);
    const oi = leerOjo(ojos.oi, "OI");
    if (typeof oi === "string") return setError(oi);
    clinica.guardarGraduacion(paciente.id, { od, oi, cristal, profesional });
    alAvisar(`Graduación de ${paciente.nombre} guardada. Ya se ve en Mi Receta Visual.`);
  }

  return (
    <form onSubmit={guardar} onChange={() => setError("")} noValidate className="grid gap-3">
      <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-2 gap-y-2">
        <span />
        <span className="text-center text-sm font-extrabold text-[#1E3A8A]">OD · derecho</span>
        <span className="text-center text-sm font-extrabold text-[#1E3A8A]">OI · izquierdo</span>
        {CAMPOS_OJO.map((campo, i) => (
          <div key={campo.id} className="contents">
            <span className="text-sm font-bold text-[#475569]">{campo.nombre}</span>
            {(["od", "oi"] as const).map((lado) => (
              <input
                key={lado}
                ref={i === 0 && lado === "od" ? primero : undefined}
                aria-label={`${campo.nombre} ${lado.toUpperCase()}`}
                value={ojos[lado][campo.id]}
                onChange={(e) => escribir(lado, campo.id, e.target.value)}
                inputMode="text"
                autoComplete="off"
                placeholder={campo.id === "adicion" || campo.id === "eje" ? "—" : campo.id === "dp" ? "31.0" : "0.00"}
                className="cv-campo !h-11 text-center tabular-nums"
              />
            ))}
          </div>
        ))}
      </div>
      <label>
        <span className="cv-rotulo">Cristal recomendado</span>
        <select className="cv-campo !h-11 !text-sm" value={cristal} onChange={(e) => setCristal(e.target.value)}>
          {CRISTALES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="cv-rotulo">Firma</span>
        <select className="cv-campo !h-11 !text-sm" value={profesional} onChange={(e) => setProfesional(e.target.value)}>
          {PROFESIONALES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <p role="alert" className="text-sm font-bold text-[#B91C1C] empty:hidden">
        {error}
      </p>
      <button type="submit" className="cv-boton cv-zafiro">
        <Check size={17} aria-hidden /> Guardar graduación
      </button>
    </form>
  );
}

function EntregaYCobro({ clinica, paciente, alAvisar }: { clinica: ClinicaViva; paciente: Paciente; alAvisar: Avisar }) {
  const ordenes = clinica.ordenes.filter((o) => o.pacienteId === paciente.id);
  const consultas = clinica.citas.filter((c) => c.pacienteId === paciente.id && !c.cobrada);

  if (!ordenes.length && !consultas.length) return <p className="text-sm">Este paciente no tiene órdenes de lentes ni cobros pendientes.</p>;

  return (
    <div className="grid gap-3">
      {ordenes.map((o) => {
        const saldo = o.total - o.abonado;
        return (
          <div key={o.id} className="rounded-2xl border border-[#E2E8F0] p-3">
            <p className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-extrabold tabular-nums text-[#0F172A]">
                {o.id} · Aro {aroPorId(o.aroId)?.nombre}
              </span>
              <span className={`cv-chip ${o.etapa === 4 ? "cv-chip-bien" : "cv-chip-pronto"}`}>{o.entregada ? "Entregados" : ETAPAS[o.etapa - 1].estado}</span>
            </p>
            <p className="mt-1 text-xs tabular-nums">
              {o.lente} · {qz(o.total)} · {saldo ? `saldo ${qz(saldo)}` : "pagado"}
            </p>
            {!o.entregada && (
              <div className="mt-3 grid gap-2">
                {o.etapa < 4 && (
                  <button
                    type="button"
                    onClick={() => {
                      clinica.etapaOrden(o.id, 4);
                      alAvisar(`${o.id} marcada como lista. ${paciente.nombre} ya lo ve en su portal.`);
                    }}
                    className="cv-boton cv-zafiro"
                  >
                    <PackageCheck size={17} aria-hidden /> Marcar Listos para entrega
                  </button>
                )}
                {saldo > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      clinica.cobrarSaldo(o.id);
                      alAvisar(`Saldo de ${qz(saldo)} registrado.`);
                    }}
                    className="cv-boton cv-linea"
                  >
                    <Wallet size={17} aria-hidden /> Registrar saldo {qz(saldo)}
                  </button>
                )}
                {o.etapa === 4 && (
                  <button
                    type="button"
                    disabled={saldo > 0}
                    onClick={() => {
                      clinica.entregar(o.id);
                      alAvisar(`${o.id} entregada.`);
                    }}
                    className="cv-boton cv-linea"
                  >
                    <Check size={17} aria-hidden /> {saldo > 0 ? "Cobra el saldo para entregar" : "Marcar como entregados"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      {consultas.map((c) => (
        <div key={c.id} className="rounded-2xl border border-[#E2E8F0] p-3">
          <p className="text-sm font-extrabold text-[#0F172A]">{SERVICIOS[c.servicio].corto}</p>
          <p className="text-xs">{cuando(c)}</p>
          <button
            type="button"
            onClick={() => {
              clinica.cobrarCita(c.id);
              alAvisar(`Consulta de ${qz(c.monto)} registrada.`);
            }}
            className="cv-boton cv-linea mt-3 w-full"
          >
            <Wallet size={17} aria-hidden /> Registrar cobro {qz(c.monto)}
          </button>
        </div>
      ))}
    </div>
  );
}

type Props = {
  clinica: ClinicaViva;
  activo: string;
  pestana: PestanaEditor;
  enfoque: number;
  alElegir: (id: string) => void;
  alPestana: (p: PestanaEditor) => void;
  alAvisar: Avisar;
};

export function EditorRapido({ clinica, activo, pestana, enfoque, alElegir, alPestana, alAvisar }: Props) {
  const paciente = clinica.paciente(activo) ?? clinica.pacientes[0];
  return (
    <div className="cv-tarjeta p-4 sm:p-5">
      <h2 className="text-xl">Graduación y entrega</h2>
      <label className="mt-3 block">
        <span className="cv-rotulo">Paciente activo</span>
        <select className="cv-campo !h-11" value={paciente.id} onChange={(e) => alElegir(e.target.value)}>
          {clinica.pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
              {p.edad ? ` · ${p.edad} años` : ""}
            </option>
          ))}
        </select>
      </label>
      <div role="group" aria-label="Editor rápido" className="my-4 grid grid-cols-2 gap-2">
        <button type="button" aria-pressed={pestana === "graduacion"} onClick={() => alPestana("graduacion")} className="cv-pildora">
          Graduación OD/OI
        </button>
        <button type="button" aria-pressed={pestana === "entrega"} onClick={() => alPestana("entrega")} className="cv-pildora">
          Entrega y cobro
        </button>
      </div>
      {pestana === "graduacion" ? (
        <FormularioGraduacion key={`${paciente.id}-${paciente.graduacion?.version ?? 0}`} clinica={clinica} paciente={paciente} enfoque={enfoque} alAvisar={alAvisar} />
      ) : (
        <EntregaYCobro clinica={clinica} paciente={paciente} alAvisar={alAvisar} />
      )}
    </div>
  );
}
