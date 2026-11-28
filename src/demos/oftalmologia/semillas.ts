import { diaHabil, hoyIso, sumarDias, unAnioDespues } from "./agenda";
import { CRISTALES, PROFESIONALES, SERVICIOS, type Cita, type Graduacion, type Ojo, type Orden, type Paciente } from "./datos";

export type Cobro = { id: string; concepto: string; monto: number };

const ojo = (esfera: number, cilindro: number, eje: number | null, dp: number, adicion: number | null = null): Ojo => ({ esfera, cilindro, eje, adicion, dp });

function graduacion(od: Ojo, oi: Ojo, cristal: string, diasAtras: number): Graduacion {
  const emitida = sumarDias(hoyIso(), -diasAtras);
  return { od, oi, cristal, emitida, vence: unAnioDespues(emitida), profesional: PROFESIONALES[1], version: 1 };
}

const paciente = (id: string, nombre: string, edad: number, grad: Graduacion | null = null): Paciente => ({ id, nombre, edad, telefono: "", portal: false, graduacion: grad });

export function pacientesIniciales(): Paciente[] {
  return [
    { ...paciente("sofia", "Sofía Castellanos", 29, graduacion(ojo(-2.25, -0.75, 180, 31), ojo(-2, -0.5, 175, 31.5), CRISTALES[0], 2)), portal: true },
    paciente("julio", "Julio Ramírez", 54, graduacion(ojo(1.5, -0.5, 90, 32, 2), ojo(1.75, -0.25, 85, 32, 2), CRISTALES[2], 0)),
    paciente("mjose", "María José Aldana", 8, graduacion(ojo(-1, 0, null, 27), ojo(-0.75, 0, null, 27.5), CRISTALES[0], 0)),
    paciente("roberto", "Roberto Xicará", 41),
    paciente("analucia", "Ana Lucía Barrios", 33),
    paciente("carlos", "Carlos Pineda", 67),
    paciente("gabriela", "Gabriela Monzón", 48, graduacion(ojo(0.75, -0.5, 100, 30.5, 1.75), ojo(1, -0.75, 80, 30.5, 1.75), CRISTALES[2], 4)),
    paciente("fernando", "Fernando Lemus", 37, graduacion(ojo(-1.75, 0, null, 32.5), ojo(-1.5, -0.25, 15, 32.5), CRISTALES[3], 2)),
    paciente("diego", "Diego Alvarado", 10, graduacion(ojo(2, -1, 5, 28), ojo(1.75, -1.25, 170, 28), CRISTALES[1], 1)),
    paciente("marta", "Marta Chacón", 59, graduacion(ojo(-3, -1, 95, 31, 2.25), ojo(-2.75, -0.75, 90, 31, 2.25), CRISTALES[2], 5)),
  ];
}

export function citasIniciales(): Cita[] {
  const hoy = hoyIso();
  const cita = (id: string, pacienteId: string, servicio: Cita["servicio"], fecha: string, hora: string, extra: Partial<Cita> = {}): Cita => ({
    id,
    pacienteId,
    servicio,
    area: "",
    fecha,
    hora,
    pago: "Particular",
    monto: SERVICIOS[servicio].precio,
    estado: "espera",
    cobrada: false,
    origen: "agenda",
    aros: [],
    cambio: null,
    ...extra,
  });
  return [
    cita("c-julio", "julio", "completa", hoy, "08:00", { pago: "El Roble", estado: "atendida", cobrada: true }),
    cita("c-mjose", "mjose", "visual", hoy, "08:45", { area: "Pediatría visual", estado: "atendida", cobrada: true }),
    cita("c-roberto", "roberto", "lasik", hoy, "09:30", { area: "Cirugía refractiva", estado: "examen" }),
    cita("c-analucia", "analucia", "contacto", hoy, "10:15", { pago: "MAPFRE" }),
    cita("c-carlos", "carlos", "completa", hoy, "11:45", { area: "Retina y glaucoma", pago: "G&T" }),
    cita("c-sofia", "sofia", "visual", diaHabil(hoy, 12), "10:15", { area: "Control de graduación" }),
  ];
}

export function ordenesIniciales(): Orden[] {
  const hoy = hoyIso();
  const orden = (id: string, pacienteId: string, aroId: string, lente: Orden["lente"], total: number, abonado: number, etapa: Orden["etapa"], entrega: string, pago: Orden["pago"] = "Particular"): Orden => ({
    id,
    pacienteId,
    aroId,
    lente,
    pago,
    total,
    abonado,
    etapa,
    entrega,
    entregada: false,
    avisada: false,
  });
  return [
    orden("OT-2034", "marta", "brisa", "Progresivo", 2625, 1500, 4, hoy),
    orden("OT-2036", "gabriela", "cumbre", "Progresivo", 2750, 2750, 4, hoy, "El Roble"),
    orden("OT-2038", "fernando", "pacifico", "Monofocal", 1340, 700, 3, hoy, "Pan-American"),
    orden("OT-2041", "sofia", "ambar", "Antirreflejo Azul", 1450, 800, 2, diaHabil(hoy, 1)),
    orden("OT-2043", "diego", "cometa", "Monofocal", 875, 400, 1, diaHabil(hoy, 2)),
  ];
}

export function cobrosIniciales(): Cobro[] {
  return [
    { id: "r1", concepto: "Consulta de Julio Ramírez", monto: 375 },
    { id: "r2", concepto: "Examen de María José Aldana", monto: 200 },
    { id: "r3", concepto: "Anticipo OT-2043", monto: 400 },
  ];
}
