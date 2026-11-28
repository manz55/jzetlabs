import { useState } from "react";
import { precioCita, precioDe, totalPedido, type PorCobrar } from "./cuentas";
import { EXTRAS, METODOS, PRODUCTOS, SERVICIOS, articulo, qz, type Metodo } from "./datos";
import type { ClinicaViva } from "./estado";

function Cuenta({ clinica, pendiente, alAvisar }: { clinica: ClinicaViva; pendiente: PorCobrar; alAvisar: (texto: string) => void }) {
  const [metodo, setMetodo] = useState<Metodo>("Efectivo");
  const conceptos = [
    ...pendiente.citas.map((c) => ({
      id: c.id,
      texto: [`${clinica.mascota(c.mascotaId)?.nombre} · ${SERVICIOS[c.servicio].nombre}`, ...(c.extras ?? []).map((e) => EXTRAS[e].nombre.toLowerCase())].join(" + "),
      monto: precioCita(c),
    })),
    ...pendiente.cargos.map((c) => ({ id: c.id, texto: PRODUCTOS.find((p) => p.id === c.productoId)?.nombre ?? "", monto: precioDe(c) })),
    ...pendiente.pedidos.map((p) => ({ id: p.id, texto: `Domicilio en ruta: ${p.articulos.map((id) => articulo(id)?.nombre).join(", ")}`, monto: totalPedido(p) })),
  ];

  return (
    <li className="rounded-2xl border border-[#E2E8F0] p-3">
      <p className="flex justify-between gap-3 text-sm font-extrabold text-[#0F172A]">
        <span className="min-w-0">{pendiente.dueno}</span>
        <span className="tabular-nums">{qz(pendiente.total)}</span>
      </p>
      <ul className="mt-1.5 grid gap-1 text-xs">
        {conceptos.map((c) => (
          <li key={c.id} className="flex justify-between gap-3">
            <span className="min-w-0">{c.texto}</span>
            <span className="tabular-nums">{qz(c.monto)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex gap-2">
        <select aria-label={`Forma de pago de ${pendiente.dueno}`} value={metodo} onChange={(e) => setMetodo(e.target.value as Metodo)} className="hv-campo !h-11 flex-1 !px-2.5 !text-[0.8rem]">
          {METODOS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            clinica.cobrar(pendiente.dueno, metodo);
            alAvisar(`Cobrado ${qz(pendiente.total)} a ${pendiente.dueno} · ${metodo}.`);
          }}
          className="hv-boton hv-turquesa"
        >
          Cobrar
        </button>
      </div>
    </li>
  );
}

export function CobroRapido({ clinica, alAvisar }: { clinica: ClinicaViva; alAvisar: (texto: string) => void }) {
  return (
    <section aria-labelledby="hv-cobro" className="hv-tarjeta p-5">
      <h2 id="hv-cobro" className="text-lg font-extrabold">Cobro rápido</h2>
      {clinica.porCobrar.length ? (
        <ul className="mt-3 grid gap-2.5">
          {clinica.porCobrar.map((p) => (
            <Cuenta key={p.dueno} clinica={clinica} pendiente={p} alAvisar={alAvisar} />
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm">Nada pendiente de cobro.</p>
      )}
    </section>
  );
}
