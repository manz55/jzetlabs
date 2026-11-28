import { useState, type FormEvent } from "react";
import { Check, MapPin, Truck } from "lucide-react";
import { totalPedido } from "./cuentas";
import { ARTICULOS, articulo, qz, type Mascota } from "./datos";
import type { ClinicaViva } from "./estado";

function Direccion({ clinica }: { clinica: ClinicaViva }) {
  const [borrador, setBorrador] = useState<string | null>(null);

  function guardar(e: FormEvent) {
    e.preventDefault();
    if (!borrador?.trim()) return;
    clinica.guardarDireccion(borrador);
    setBorrador(null);
  }

  if (borrador !== null) {
    return (
      <form onSubmit={guardar} className="grid gap-2">
        <label className="block">
          <span className="hv-rotulo">Dirección de entrega</span>
          <textarea autoFocus value={borrador} onChange={(e) => setBorrador(e.target.value)} maxLength={140} rows={2} className="hv-campo !h-auto py-2.5 !text-sm" />
        </label>
        <div className="flex gap-2">
          <button type="submit" disabled={!borrador.trim()} className="hv-boton hv-turquesa flex-1">
            Guardar dirección
          </button>
          <button type="button" onClick={() => setBorrador(null)} className="hv-boton hv-linea">
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-start gap-2.5 rounded-2xl bg-[#F8FAFC] p-3">
      <MapPin size={17} aria-hidden className="mt-0.5 shrink-0 text-[#0D9488]" />
      <p className="min-w-0 flex-1 text-sm font-semibold text-[#0F172A]">{clinica.direccion}</p>
      <button type="button" onClick={() => setBorrador(clinica.direccion)} aria-label="Editar dirección" className="-m-2 min-h-11 shrink-0 rounded-lg px-2 text-sm font-bold text-[#0F766E] underline underline-offset-4">
        Editar
      </button>
    </div>
  );
}

export function Domicilio({ clinica, mascota, alAvisar }: { clinica: ClinicaViva; mascota: Mascota; alAvisar: (texto: string) => void }) {
  const deSuEspecie = ARTICULOS.filter((a) => a.especie === mascota.especie);
  const alimentos = deSuEspecie.filter((a) => a.tipo === "alimento");
  const preventivo = deSuEspecie.find((a) => a.tipo === "preventivo");
  const alimento = alimentos.find((a) => a.id === mascota.alimento) ?? alimentos[0];
  const [conAlimento, setConAlimento] = useState(true);
  const [conPreventivo, setConPreventivo] = useState(false);
  const elegidos = [...(conAlimento ? [alimento.id] : []), ...(conPreventivo && preventivo ? [preventivo.id] : [])];
  const enCurso = clinica.pedidos.find((p) => p.mascotaId === mascota.id && p.estado !== "entregado");

  return (
    <section aria-labelledby="hv-domicilio" className="hv-tarjeta p-5 sm:p-6">
      <h2 id="hv-domicilio" className="flex items-center gap-2 text-lg font-extrabold">
        <Truck size={20} aria-hidden className="shrink-0 text-[#0D9488]" /> Pedido express a domicilio
      </h2>
      <p className="mt-1 text-sm">Concentrado y farmacia para {mascota.nombre}. Envío gratis en concentrado.</p>

      {enCurso ? (
        <div aria-live="polite" className={`mt-4 rounded-2xl border p-4 ${enCurso.estado === "ruta" ? "border-[#5EEAD4] bg-[#F0FDFA]" : "border-[#FCD34D] bg-[#FFFBEB]"}`}>
          <p className={`text-sm font-extrabold ${enCurso.estado === "ruta" ? "text-[#115E59]" : "text-[#92400E]"}`}>
            {enCurso.estado === "ruta" ? "En ruta · pagas al recibir" : "Pedido enviado · Esperando despacho de la clínica"}
          </p>
          <ul className="mt-2 grid gap-1 text-sm text-[#0F172A]">
            {enCurso.articulos.map((id) => (
              <li key={id} className="flex justify-between gap-3">
                <span>{articulo(id)?.nombre}</span>
                <span className="tabular-nums">{qz(articulo(id)?.precio ?? 0)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 flex justify-between border-t border-black/10 pt-2 font-extrabold text-[#0F172A]">
            <span>Total</span>
            <span className="tabular-nums">{qz(totalPedido(enCurso))}</span>
          </p>
          <p className="mt-2 text-xs">{enCurso.direccion}</p>
          {enCurso.estado === "solicitado" && (
            <button type="button" onClick={() => clinica.cancelarPedido(enCurso.id)} className="hv-boton mt-2 text-[#92400E] underline underline-offset-4 hover:bg-[#FEF3C7]">
              Cancelar pedido
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border border-[#E2E8F0] p-3">
            <label className="flex min-h-8 items-center gap-2.5 text-sm font-bold text-[#0F172A]">
              <input type="checkbox" checked={conAlimento} onChange={(e) => setConAlimento(e.target.checked)} className="size-5 shrink-0 accent-[#0F766E]" />
              <span className="flex-1">Alimento habitual</span>
              <span className="tabular-nums">{qz(alimento.precio)}</span>
            </label>
            <select aria-label={`Alimento habitual de ${mascota.nombre}`} value={alimento.id} onChange={(e) => clinica.elegirAlimento(mascota.id, e.target.value)} className="hv-campo mt-2 !h-11 !text-sm">
              {alimentos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre} · {qz(a.precio)}
                </option>
              ))}
            </select>
          </div>
          {preventivo && (
            <label className="flex min-h-14 items-center gap-2.5 rounded-2xl border border-[#E2E8F0] p-3 text-sm font-bold text-[#0F172A]">
              <input type="checkbox" checked={conPreventivo} onChange={(e) => setConPreventivo(e.target.checked)} className="size-5 shrink-0 accent-[#0F766E]" />
              <span className="min-w-0 flex-1">
                Preventivo mensual
                <span className="block text-xs font-semibold text-[#64748B]">{preventivo.nombre}</span>
              </span>
              <span className="tabular-nums">{qz(preventivo.precio)}</span>
            </label>
          )}
          <Direccion clinica={clinica} />
          <button
            type="button"
            disabled={!elegidos.length}
            onClick={() => {
              clinica.pedirDomicilio(mascota.id, elegidos);
              alAvisar(`Pedido de ${mascota.nombre} enviado a la clínica.`);
            }}
            className="hv-boton hv-turquesa min-h-13 !text-base"
          >
            <Check size={18} aria-hidden /> Pedir entrega a domicilio · {qz(totalPedido({ articulos: elegidos }))}
          </button>
        </div>
      )}
    </section>
  );
}
