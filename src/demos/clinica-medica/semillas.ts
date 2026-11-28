import { MEDICOS, QUIMICOS, fechaDe, hoyIso, sumarDias, type Cita, type EspecialidadId, type Metodo, type Paciente, type Receta } from "./datos";

export const pacientesIniciales = (): Paciente[] => [
  { id: "carlos", nombre: "Carlos Ramírez", edad: 38, sexo: "M", enPortal: true },
  { id: "maria", nombre: "María Fernanda López", edad: 29, sexo: "F", enPortal: false },
  { id: "jose", nombre: "José Antonio Pérez", edad: 54, sexo: "M", enPortal: false },
  { id: "valeria", nombre: "Valeria Gómez Ríos", edad: 6, sexo: "F", enPortal: false },
  { id: "luis", nombre: "Luis Fernando Chávez", edad: 47, sexo: "M", enPortal: false },
  { id: "gabriela", nombre: "Gabriela Méndez", edad: 33, sexo: "F", enPortal: false },
  { id: "hector", nombre: "Héctor Solís Aguilar", edad: 61, sexo: "M", enPortal: false },
  { id: "ana", nombre: "Ana Lucía Orellana", edad: 42, sexo: "F", enPortal: false },
];

function proximoDiaDe(dias: number[], desde: number) {
  let fecha = sumarDias(hoyIso(), desde);
  while (!dias.includes(fechaDe(fecha).getDay())) fecha = sumarDias(fecha, 1);
  return fecha;
}

const deTurno = (id: EspecialidadId): EspecialidadId => (MEDICOS[id].dias.includes(fechaDe(hoyIso()).getDay()) ? id : "medicina-interna");

const pagado = (metodo: Metodo, fecha = hoyIso()) => ({ metodo, fecha });

export function citasIniciales(): Cita[] {
  const hoy = hoyIso();
  const base: Omit<Cita, "id" | "folio">[] = [
    {
      pacienteId: "carlos",
      servicioId: "hematologia",
      fecha: sumarDias(hoy, -94),
      hora: "07:30",
      pago: "particular",
      estado: "finalizada",
      cobro: pagado("Visanet", sumarDias(hoy, -94)),
      informe: {
        valores: { hemoglobina: 15.4, hematocrito: 45.1, leucocitos: 7.2, plaquetas: 248 },
        validadoPor: QUIMICOS[1],
        fecha: sumarDias(hoy, -94),
        hora: "10:05",
        enviado: true,
      },
    },
    {
      pacienteId: "carlos",
      servicioId: "chequeo",
      fecha: sumarDias(hoy, -2),
      hora: "07:00",
      pago: "particular",
      estado: "finalizada",
      cobro: pagado("NeoNet", sumarDias(hoy, -2)),
      informe: {
        valores: { glucosa: 108, colesterol: 186, trigliceridos: 172, hemoglobina: 15.1, creatinina: 0.98 },
        validadoPor: QUIMICOS[0],
        fecha: sumarDias(hoy, -2),
        hora: "13:40",
        enviado: true,
      },
    },
    { pacienteId: "carlos", servicioId: "tiroideo", fecha: hoy, hora: "07:00", pago: "particular", estado: "muestra", cobro: pagado("Visanet") },
    {
      pacienteId: "gabriela",
      servicioId: "hematologia",
      fecha: hoy,
      hora: "07:30",
      pago: "gyt",
      estado: "finalizada",
      informe: {
        valores: { hemoglobina: 11.4, hematocrito: 35.2, leucocitos: 6.1, plaquetas: 302 },
        validadoPor: QUIMICOS[0],
        fecha: hoy,
        hora: "09:25",
        enviado: false,
      },
    },
    { pacienteId: "hector", servicioId: "bioquimico", fecha: hoy, hora: "08:00", pago: "roble", estado: "muestra" },
    { pacienteId: "maria", servicioId: deTurno("ginecologia"), fecha: hoy, hora: "08:45", pago: "particular", estado: "finalizada", cobro: pagado("Transferencia BI") },
    { pacienteId: "jose", servicioId: deTurno("cardiologia"), fecha: hoy, hora: "09:30", pago: "roble", estado: "consulta" },
    { pacienteId: "valeria", servicioId: deTurno("pediatria"), fecha: hoy, hora: "10:15", pago: "panamerican", estado: "espera" },
    { pacienteId: "ana", servicioId: "lipidico", fecha: hoy, hora: "10:30", pago: "particular", estado: "espera" },
    { pacienteId: "luis", servicioId: "medicina-interna", fecha: hoy, hora: "11:00", pago: "particular", estado: "espera" },
    { pacienteId: "ana", servicioId: deTurno("dermatologia"), fecha: hoy, hora: "11:45", pago: "mapfre", estado: "espera" },
    { pacienteId: "carlos", servicioId: "medicina-interna", fecha: proximoDiaDe(MEDICOS["medicina-interna"].dias, 3), hora: "09:30", pago: "particular", estado: "espera" },
    { pacienteId: "hector", servicioId: "cardiologia", fecha: proximoDiaDe(MEDICOS.cardiologia.dias, 1), hora: "08:45", pago: "roble", estado: "espera" },
  ];
  return base.map((c, i) => ({ ...c, id: `cita-${i + 1}`, folio: 2031 + i }));
}

export const recetasIniciales = (): Receta[] => [
  {
    id: "receta-1",
    pacienteId: "carlos",
    medicoId: "medicina-interna",
    fecha: sumarDias(hoyIso(), -2),
    medicamentos: [
      { nombre: "Omega 3 de 1,000 mg", dosis: "1 cápsula con el almuerzo", duracion: "60 días" },
      { nombre: "Vitamina D3 de 2,000 UI", dosis: "1 tableta cada mañana", duracion: "90 días" },
      { nombre: "Omeprazol de 20 mg", dosis: "1 cápsula en ayunas", duracion: "14 días" },
    ],
    indicaciones: "Reducir azúcares y harinas, caminar 30 minutos cinco días a la semana y repetir glucosa y triglicéridos en 3 meses.",
  },
];
