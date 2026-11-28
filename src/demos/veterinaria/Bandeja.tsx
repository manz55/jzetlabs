import { ArrowRight, MapPin, Truck } from "lucide-react";
import { estaLibre, porConfirmar } from "./agenda";
import { totalPedido } from "./cuentas";
import { SERVICIOS, articulo, fechaRelativa, hora12, qz, type Cita, type Horario, type Pedido } from "./datos";
import type { ClinicaViva } from "./estado";

type Avisar = (texto: string, alerta?: boolean) => void;

const cuando = (h: Horario) => `${fechaRelativa(h.fecha)} · ${hora12(h.hora)}`;

function SolicitudDeCita({ clinica, cita, alProponer, alAvisar }: { clinica: ClinicaViva; cita: Cita; alProponer: (c: Cita) => void; alAvisar: Avisar }) {
  const mascota = clinica.mascota(cita.mascotaId);
  const solicitud = cita.solicitud;
  if (!mascota || !solicitud) return null;
  const nueva = porConfirmar(cita);
  const disponible = estaLibre(clinica, cita, solicitud);

  return (
    <li className={`rounded-2xl border p-3.5 ${solicitud.propuesta ? "border-[#E2E8F0] bg-[#F8FAFC]" : "border-[#FCD34D] bg-[#FFFBEB]"}`}>
      <p className="text-xs font-extrabold text-[#92400E]">{nueva ? "Cita nueva solicitada" : "Cambio de horario solicitado"}</p>
      <p className="mt-1 text-sm font-extrabold text-[#0F172A]">
        {mascota.nombre} · {mascota.dueno}
      </p>
      <p className="text-xs">{SERVICIOS[cita.servicio].nombre}</p>
      <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm tabular-nums">
        {!nueva && (
          <>
            <span className="text-[#64748B]">{cuando(cita)}</span>
            <ArrowRight size={14} aria-label="pide cambiar a" className="shrink-0" />
          </>
        )}
        <span className="font-extrabold text-[#0F172A]">{cuando(solicitud)}</span>
      </p>
      {solicitud.propuesta ? (
        <>
          <p className="mt-2 text-xs font-bold text-[#115E59]">Esperando al dueño. Propusiste: {cuando(solicitud.propuesta)}</p>
          <button type="button" onClick={() => alProponer(cita)} className="hv-boton hv-linea mt-2 w-full">
            Cambiar propuesta
          </button>
        </>
      ) : (
        <>
          {!disponible && <p className="mt-2 text-xs font-bold text-[#991B1B]">Ese horario está ocupado o bloqueado. Propón otra hora.</p>}
          <div className="mt-3 grid gap-2">
            <button
              type="button"
              disabled={!disponible}
              onClick={() => {
                if (clinica.aprobarSolicitud(cita.id)) alAvisar(`${mascota.nombre}: ${cuando(solicitud).toLowerCase()} confirmado.`);
              }}
              className="hv-boton hv-turquesa"
            >
              {nueva ? "Aprobar y agendar" : "Aprobar y mover agenda"}
            </button>
            <button type="button" onClick={() => alProponer(cita)} className="hv-boton hv-linea">
              Proponer otra hora
            </button>
          </div>
        </>
      )}
    </li>
  );
}

function PedidoNuevo({ clinica, pedido, alAvisar }: { clinica: ClinicaViva; pedido: Pedido; alAvisar: Avisar }) {
  const mascota = clinica.mascota(pedido.mascotaId);

  return (
    <li className="rounded-2xl border border-[#99F6E4] bg-[#F0FDFA] p-3.5">
      <p className="text-xs font-extrabold text-[#115E59]">Pedido a domicilio</p>
      <p className="mt-1 flex justify-between gap-3 text-sm font-extrabold text-[#0F172A]">
        <span className="min-w-0">
          {mascota?.nombre} · {pedido.dueno}
        </span>
        <span className="tabular-nums">{qz(totalPedido(pedido))}</span>
      </p>
      <ul className="mt-1 text-xs">
        {pedido.articulos.map((id) => (
          <li key={id}>{articulo(id)?.nombre}</li>
        ))}
      </ul>
      <p className="mt-2 flex gap-1.5 text-xs font-semibold">
        <MapPin size={14} aria-hidden className="mt-0.5 shrink-0 text-[#0D9488]" /> {pedido.direccion}
      </p>
      <button
        type="button"
        onClick={() => {
          clinica.despacharPedido(pedido.id);
          alAvisar(`Envío de ${pedido.dueno} en ruta. Se cobra contra entrega.`);
        }}
        className="hv-boton hv-turquesa mt-3 w-full"
      >
        <Truck size={17} aria-hidden /> Despachar envío
      </button>
    </li>
  );
}

export function Bandeja({ clinica, alProponer, alAvisar }: { clinica: ClinicaViva; alProponer: (c: Cita) => void; alAvisar: Avisar }) {
  const vacia = !clinica.solicitudes.length && !clinica.pedidosNuevos.length;

  return (
    <section aria-labelledby="hv-bandeja" className="hv-tarjeta p-5">
      <h2 id="hv-bandeja" className="text-lg font-extrabold">Solicitudes de clientes</h2>
      {vacia ? (
        <p className="mt-2 text-sm">No hay solicitudes pendientes.</p>
      ) : (
        <ul className="mt-3 grid gap-2.5">
          {clinica.solicitudes.map((c) => (
            <SolicitudDeCita key={c.id} clinica={clinica} cita={c} alProponer={alProponer} alAvisar={alAvisar} />
          ))}
          {clinica.pedidosNuevos.map((p) => (
            <PedidoNuevo key={p.id} clinica={clinica} pedido={p} alAvisar={alAvisar} />
          ))}
        </ul>
      )}
    </section>
  );
}
