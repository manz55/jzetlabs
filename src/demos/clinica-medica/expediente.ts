import { horaActual } from "./agenda";
import { cambiar, nuevoId } from "./almacen";
import { EXAMENES, MEDICOS, PARAMETROS, esExamen, fechaCorta, folioTexto, fueraDeRango, hoyIso, nombreServicio, textoRango, type Cita, type Informe, type Paciente, type Receta } from "./datos";

export function publicarResultado(citaId: string, valores: Informe["valores"], validadoPor: string) {
  cambiar((e) => {
    const pacienteId = e.citas.find((c) => c.id === citaId)?.pacienteId;
    return {
      ...e,
      pacientes: e.pacientes.map((p) => (p.id === pacienteId ? { ...p, enPortal: true } : p)),
      citas: e.citas.map((c) =>
        c.id === citaId ? { ...c, estado: "finalizada", informe: { valores, validadoPor, fecha: hoyIso(), hora: horaActual(), enviado: false } } : c,
      ),
    };
  });
}

export function agregarReceta(receta: Omit<Receta, "id" | "fecha">) {
  cambiar((e) => ({
    ...e,
    pacientes: e.pacientes.map((p) => (p.id === receta.pacienteId ? { ...p, enPortal: true } : p)),
    recetas: [{ ...receta, id: nuevoId("receta"), fecha: hoyIso() }, ...e.recetas],
  }));
}

export function marcarEnviado(citaId: string) {
  cambiar((e) => ({ ...e, citas: e.citas.map((c) => (c.id === citaId && c.informe ? { ...c, informe: { ...c.informe, enviado: true } } : c)) }));
}

export function filasDeInforme(cita: Cita, paciente: Paciente) {
  if (!cita.informe || !esExamen(cita.servicioId)) return [];
  const { valores } = cita.informe;
  return EXAMENES[cita.servicioId].parametros.flatMap((id) => {
    const valor = valores[id];
    if (valor === undefined) return [];
    const { nombre, unidad, decimales } = PARAMETROS[id];
    return [{ id, nombre, unidad, valor: valor.toFixed(decimales), referencia: textoRango(id, paciente.sexo), fuera: fueraDeRango(id, valor, paciente.sexo) }];
  });
}

export function resumenInforme(cita: Cita, paciente: Paciente) {
  const lineas = filasDeInforme(cita, paciente).map((f) => `- ${f.nombre}: ${f.valor} ${f.unidad} (ref. ${f.referencia}) · ${f.fuera ? "Fuera de rango" : "Normal"}`);
  return [
    "Centro Médico Altamira",
    `${nombreServicio(cita.servicioId)} · Orden ${folioTexto(cita.folio)}`,
    `Paciente: ${paciente.nombre}, ${paciente.edad} años`,
    `Muestra: ${fechaCorta(cita.fecha)}`,
    "",
    ...lineas,
    "",
    `Validado por ${cita.informe?.validadoPor}`,
  ].join("\n");
}

export const avisoDeResultado = (cita: Cita, paciente: Paciente) =>
  `Hola ${paciente.nombre.split(" ")[0]}, le saluda Centro Médico Altamira. Su resultado de ${nombreServicio(cita.servicioId)} (orden ${folioTexto(cita.folio)}) ya está listo en el Portal del Paciente.`;

export const medicoDeReceta = (receta: Receta) => MEDICOS[receta.medicoId];

export const enlaceWhatsApp = (texto: string) => `https://wa.me/?text=${encodeURIComponent(texto)}`;
