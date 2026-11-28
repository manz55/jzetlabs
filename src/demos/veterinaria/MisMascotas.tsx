import { useState } from "react";
import { CalendarPlus, Plus, ReceiptText, Trash2 } from "lucide-react";
import { CarnetResumen, PesoHistorico } from "./CarnetResumen";
import { precioDe } from "./cuentas";
import { VentanaCredencial } from "./Credencial";
import { Notas, Recetas } from "./Cuidados";
import { CLIENTA, PRODUCTOS, qz, type Cita } from "./datos";
import { Domicilio } from "./Domicilio";
import type { ClinicaViva } from "./estado";
import { Retrato } from "./Piezas";
import { TarjetaCita } from "./TarjetaCita";
import { AgregarMascota, PedirCambio, SolicitarCita } from "./VentanasDueno";

type Abierta = { tipo: "agregar" } | { tipo: "solicitar" } | { tipo: "credencial" } | { tipo: "cambio"; cita: Cita } | null;

function Cuenta({ clinica }: { clinica: ClinicaViva }) {
  const cargos = clinica.cargos.filter((c) => c.dueno === CLIENTA.nombre && !c.cobro);
  if (!cargos.length) return null;

  return (
    <section aria-labelledby="hv-cuenta" className="hv-tarjeta p-5 sm:p-6">
      <h2 id="hv-cuenta" className="flex items-center gap-2 text-lg font-extrabold">
        <ReceiptText size={20} aria-hidden className="text-[#0D9488]" /> Mi cuenta
      </h2>
      <ul className="mt-3 divide-y divide-[#F1F5F9]">
        {cargos.map((c) => {
          const nombre = PRODUCTOS.find((p) => p.id === c.productoId)?.nombre;
          return (
            <li key={c.id} className="flex items-center gap-2 py-1.5 text-sm">
              <span className="min-w-0 flex-1 font-semibold text-[#0F172A]">{nombre}</span>
              <span className="font-bold tabular-nums">{qz(precioDe(c))}</span>
              <button type="button" aria-label={`Quitar ${nombre}`} onClick={() => clinica.quitarCargo(c.id)} className="grid size-11 place-items-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#B91C1C]">
                <Trash2 size={16} aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 flex justify-between border-t border-[#E2E8F0] pt-3 font-extrabold text-[#0F172A]">
        <span>Por pagar en clínica</span>
        <span className="tabular-nums">{qz(cargos.reduce((s, c) => s + precioDe(c), 0))}</span>
      </p>
    </section>
  );
}

type Props = {
  clinica: ClinicaViva;
  activa: string;
  alElegir: (id: string) => void;
  alAvisar: (texto: string, alerta?: boolean) => void;
};

export function MisMascotas({ clinica, activa, alElegir, alAvisar }: Props) {
  const propias = clinica.mascotas.filter((m) => m.dueno === CLIENTA.nombre);
  const mascota = propias.find((m) => m.id === activa) ?? propias[0];
  const [abierta, setAbierta] = useState<Abierta>(null);
  const ventana = { clinica, alAvisar, alCerrar: () => setAbierta(null) };

  return (
    <div className="hv-ancho py-8 lg:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#0F766E]">Hola, {CLIENTA.nombre.split(" ")[0]}</p>
          <h1 className="text-3xl font-extrabold">Mis Mascotas</h1>
        </div>
        <div className="grid w-full gap-2 sm:flex sm:w-auto">
          <button type="button" onClick={() => setAbierta({ tipo: "solicitar" })} className="hv-boton hv-turquesa">
            <CalendarPlus size={17} aria-hidden /> Solicitar cita o grooming
          </button>
          <button type="button" onClick={() => setAbierta({ tipo: "agregar" })} className="hv-boton hv-linea">
            <Plus size={17} aria-hidden /> Agregar mascota
          </button>
        </div>
      </div>

      <div role="group" aria-label="Elegir mascota" className="mt-5 flex flex-wrap gap-2">
        {propias.map((m) => (
          <button key={m.id} type="button" aria-pressed={m.id === mascota.id} onClick={() => alElegir(m.id)} className="hv-pildora min-h-13 !pl-1.5">
            <Retrato mascota={m} className="size-10" />
            {m.nombre} · {m.raza}
          </button>
        ))}
      </div>

      <div key={mascota.id} className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="grid min-w-0 gap-6 lg:col-span-7">
          <TarjetaCita clinica={clinica} mascota={mascota} alAvisar={alAvisar} alSolicitar={() => setAbierta({ tipo: "solicitar" })} alCambiar={(cita) => setAbierta({ tipo: "cambio", cita })} />
          <Recetas mascota={mascota} />
          <CarnetResumen mascota={mascota} alAbrir={() => setAbierta({ tipo: "credencial" })} />
        </div>
        <div className="grid min-w-0 gap-6 lg:col-span-5">
          <Domicilio clinica={clinica} mascota={mascota} alAvisar={alAvisar} />
          <Cuenta clinica={clinica} />
          <Notas clinica={clinica} mascota={mascota} alAvisar={alAvisar} />
          <PesoHistorico mascota={mascota} />
        </div>
      </div>

      {abierta?.tipo === "agregar" && <AgregarMascota {...ventana} alAgregar={alElegir} />}
      {abierta?.tipo === "solicitar" && <SolicitarCita {...ventana} mascotaInicial={mascota.id} alSolicitar={(cita) => alElegir(cita.mascotaId)} />}
      {abierta?.tipo === "cambio" && <PedirCambio {...ventana} cita={abierta.cita} />}
      {abierta?.tipo === "credencial" && <VentanaCredencial mascota={mascota} alCerrar={() => setAbierta(null)} />}
    </div>
  );
}
