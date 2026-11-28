import { useState } from "react";
import { MessageCircle, Plus, ReceiptText, Truck } from "lucide-react";
import { CLIENTA, FILTROS_TIENDA, PRODUCTOS, enlaceWhatsApp, qz, type Categoria, type Producto } from "./datos";
import { precioDe, type ClinicaViva } from "./estado";
import { Foto } from "./Piezas";

const pedido = (p: Producto) =>
  `Hola, Huella Vital. Quiero pedir: ${p.nombre} (${p.detalle}) por ${qz(p.precio)}. Soy ${CLIENTA.nombre}.${p.envioGratis ? " Con envío a domicilio." : ""}`;

export function PetShop({ clinica, alAvisar, alVerCuenta }: { clinica: ClinicaViva; alAvisar: (texto: string) => void; alVerCuenta: () => void }) {
  const [filtro, setFiltro] = useState<Categoria | "todos">("todos");
  const visibles = PRODUCTOS.filter((p) => filtro === "todos" || p.categorias.includes(filtro));
  const cuenta = clinica.cargos.filter((c) => c.dueno === CLIENTA.nombre && !c.cobro);

  return (
    <section id="pet-shop" className="hv-seccion">
      <div className="hv-ancho">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="text-3xl font-extrabold">Pet Shop y farmacia</h2>
            <p className="mt-2">Pídelo por WhatsApp o súmalo a tu cuenta y págalo en tu próxima visita.</p>
          </div>
          <div role="group" aria-label="Filtrar productos" className="flex flex-wrap gap-2">
            {FILTROS_TIENDA.map((f) => (
              <button key={f.id} type="button" aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)} className="hv-pildora">
                {f.nombre}
              </button>
            ))}
          </div>
        </div>

        {cuenta.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#99F6E4] bg-[#F0FDFA] p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
              <ReceiptText size={18} aria-hidden className="text-[#0F766E]" />
              Tu cuenta: {cuenta.length} {cuenta.length === 1 ? "producto" : "productos"} · {qz(cuenta.reduce((s, c) => s + precioDe(c), 0))}
            </p>
            <button type="button" onClick={alVerCuenta} className="hv-boton hv-linea">
              Ver mi cuenta
            </button>
          </div>
        )}

        <ul className="mt-8 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {visibles.map((p) => (
            <li key={p.id} className="hv-tarjeta flex flex-col overflow-hidden">
              <Foto id={p.foto} alt={p.nombre} ancho={520} alto={390} className="aspect-[4/3] h-auto w-full" />
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-base font-extrabold leading-snug">{p.nombre}</h3>
                <p className="mt-1 text-xs text-[#64748B]">{p.detalle}</p>
                {p.envioGratis && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#0F766E]">
                    <Truck size={14} aria-hidden /> Envío gratis
                  </p>
                )}
                <p className="mt-auto pt-3 text-xl font-extrabold tabular-nums text-[#0F172A]">{qz(p.precio)}</p>
                <div className="mt-3 grid gap-2">
                  <a href={enlaceWhatsApp(pedido(p))} target="_blank" rel="noopener noreferrer" aria-label={`Pedir ${p.nombre} por WhatsApp`} className="hv-boton hv-turquesa">
                    <MessageCircle size={16} aria-hidden /> WhatsApp
                  </a>
                  <button
                    type="button"
                    aria-label={`Cargo a cuenta: ${p.nombre}`}
                    onClick={() => {
                      clinica.cargarACuenta(p.id);
                      alAvisar(`${p.nombre} quedó en la cuenta de ${CLIENTA.nombre}.`);
                    }}
                    className="hv-boton hv-linea"
                  >
                    <Plus size={16} aria-hidden /> Cargo a cuenta
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
