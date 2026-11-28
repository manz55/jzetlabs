import { porHorario } from "./agenda";
import { useExpedientes } from "./almacen";
import { hoyIso, precioServicio, tipoDe } from "./datos";

export function useAltamira() {
  const e = useExpedientes();
  const hoy = hoyIso();
  const citas = [...e.citas].sort(porHorario);
  const citasHoy = citas.filter((c) => c.fecha === hoy);
  const laboratorio = citas.filter((c) => tipoDe(c.servicioId) === "laboratorio");
  const total = (lista: typeof citas) => lista.reduce((suma, c) => suma + precioServicio(c.servicioId), 0);
  const muestrasEnLab = laboratorio.filter((c) => c.estado === "muestra" && !c.informe);

  return {
    ...e,
    citas,
    citasHoy,
    proximas: citas.filter((c) => c.fecha > hoy),
    cambiosPendientes: citas.filter((c) => c.cambio),
    muestrasEnLab,
    porTomar: laboratorio.filter((c) => c.estado === "espera" && c.fecha <= hoy),
    porEnviar: laboratorio.filter((c) => c.informe && !c.informe.enviado),
    paciente: (id: string) => e.pacientes.find((p) => p.id === id),
    kpis: {
      consultas: citasHoy.filter((c) => tipoDe(c.servicioId) === "consulta").length,
      muestras: muestrasEnLab.length,
      cobrado: total(citas.filter((c) => c.cobro?.fecha === hoy)),
      porSeguro: total(citas.filter((c) => c.pago !== "particular" && c.fecha <= hoy && !c.cobro)),
    },
  };
}

export type Altamira = ReturnType<typeof useAltamira>;
