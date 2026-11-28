import { aceptarPropuesta, agendar, alternarBloqueo, alternarExtra, aprobarSolicitud, cambiarEstado, pedirHorario, porConfirmar, porHorario, proponerHorario, retirarSolicitud } from "./agenda";
import { useAlmacen } from "./almacen";
import { cancelarPedido, cargarACuenta, cobrar, despacharPedido, guardarDireccion, ingresosDeHoy, pedirDomicilio, pendientesDeCobro, quitarCargo } from "./cuentas";
import { SERVICIOS, hoyIso } from "./datos";
import { agregarMascota, elegirAlimento, guardarNotas, marcarRecordados, registrarClinico, registrarPaciente, vacunasPorVencer } from "./expediente";

const acciones = {
  aceptarPropuesta,
  agendar,
  agregarMascota,
  alternarBloqueo,
  alternarExtra,
  aprobarSolicitud,
  cambiarEstado,
  cancelarPedido,
  cargarACuenta,
  cobrar,
  despacharPedido,
  elegirAlimento,
  guardarDireccion,
  guardarNotas,
  marcarRecordados,
  pedirDomicilio,
  pedirHorario,
  proponerHorario,
  quitarCargo,
  registrarClinico,
  registrarPaciente,
  retirarSolicitud,
};

export function useClinica() {
  const c = useAlmacen();
  const hoy = hoyIso();
  const citasHoy = c.citas.filter((x) => x.fecha === hoy).sort(porHorario);
  const solicitudes = c.citas.filter((x) => x.solicitud).sort(porHorario);
  const pedidosNuevos = c.pedidos.filter((p) => p.estado === "solicitado");
  return {
    ...c,
    ...acciones,
    citasHoy,
    proximas: c.citas.filter((x) => x.fecha > hoy).sort(porHorario),
    mascota: (id: string) => c.mascotas.find((m) => m.id === id),
    solicitudes,
    pedidosNuevos,
    porAtender: solicitudes.filter((x) => !x.solicitud?.propuesta).length + pedidosNuevos.length,
    porCobrar: pendientesDeCobro(c),
    porVencer: vacunasPorVencer(c),
    kpis: {
      pacientes: new Set(citasHoy.filter((x) => !porConfirmar(x)).map((x) => x.mascotaId)).size,
      enGrooming: citasHoy.filter((x) => x.estado === "atencion" && SERVICIOS[x.servicio].area === "grooming").length,
      ingresos: ingresosDeHoy(c),
    },
  };
}

export type ClinicaViva = ReturnType<typeof useClinica>;
