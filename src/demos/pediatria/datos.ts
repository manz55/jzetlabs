/*
 * Centro Pediátrico Los Álamos (negocio inventado). Aquí viven los precios, el esquema de
 * vacunas, las citas, el carné de cada paciente y los horarios que el panel abre o cierra.
 * Inicio, Portal Padres y Panel Pediatra leen y escriben lo mismo.
 * Fotos de Unsplash, servidas desde su servidor.
 */
import { useEffect, useState } from "react";

const foto = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;

export const FOTOS = {
  portada: foto("1632052999485-d748103abf98", 1400),
  revision: foto("1576766125535-b04e15fd0273", 1000),
  bebe: foto("1632053003385-245d2569568a", 1000),
  sala: foto("1759987383760-327efaf5522a", 1400),
  juegos: foto("1761208663763-c4d30657c910", 1000),
};

/* ---------------- formatos y fechas ---------------- */

export const formatoQ = (n: number) => `Q${n.toLocaleString("en-US")}`;
export const mayus = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

const dos = (n: number) => String(n).padStart(2, "0");
export const isoDe = (d: Date) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
export const hoyIso = () => isoDe(new Date());
const aFecha = (iso: string) => new Date(`${iso}T12:00:00`);
export const fechaLarga = (iso: string) => aFecha(iso).toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" });
export const fechaCorta = (iso: string) => aFecha(iso).toLocaleDateString("es-GT", { day: "numeric", month: "short", year: "numeric" });
export const diaCorto = (iso: string) => aFecha(iso).toLocaleDateString("es-GT", { weekday: "short" }).replace(".", "");
export const mesCorto = (iso: string) => aFecha(iso).toLocaleDateString("es-GT", { month: "short" }).replace(".", "");
export const numeroDia = (iso: string) => aFecha(iso).getDate();

export const minutos = (hora: string) => {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
};
export const hora12 = (hora: string) => {
  const [h, m] = hora.split(":").map(Number);
  return `${h % 12 || 12}:${dos(m)} ${h < 12 ? "a. m." : "p. m."}`;
};

const MANANA = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"];
const TARDE = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
export const JORNADAS = [
  { nombre: "Mañana", horas: MANANA },
  { nombre: "Tarde", horas: TARDE },
];
/* domingo cerrado, sábado solo en la mañana */
export const horasDelDia = (iso: string) => {
  const d = aFecha(iso).getDay();
  return d === 0 ? [] : d === 6 ? MANANA : [...MANANA, ...TARDE];
};
export const yaPaso = (iso: string, hora: string) => {
  if (iso !== hoyIso()) return iso < hoyIso();
  const a = new Date();
  return minutos(hora) <= a.getHours() * 60 + a.getMinutes() + 30;
};
/* los próximos días en que la clínica abre, empezando por hoy */
export function proximosDias(n = 12) {
  const dias: string[] = [];
  const d = new Date();
  while (dias.length < n) {
    if (d.getDay() !== 0) dias.push(isoDe(d));
    d.setDate(d.getDate() + 1);
  }
  return dias;
}

/* ---------------- edades ---------------- */

export function mesesDe(nacimiento: string) {
  const n = aFecha(nacimiento);
  const h = new Date();
  let m = (h.getFullYear() - n.getFullYear()) * 12 + (h.getMonth() - n.getMonth());
  if (h.getDate() < n.getDate()) m--;
  return Math.max(0, m);
}
export function edadTexto(meses: number) {
  if (meses < 1) return "recién nacido";
  if (meses < 24) return `${meses} ${meses === 1 ? "mes" : "meses"}`;
  const a = Math.floor(meses / 12);
  const r = meses % 12;
  return `${a} años${r ? ` y ${r} ${r === 1 ? "mes" : "meses"}` : ""}`;
}
const nacidoHace = (meses: number, dias = 5) => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - meses);
  d.setDate(Math.max(1, new Date().getDate() - dias));
  return isoDe(d);
};

/* ---------------- vacunas ---------------- */

export type EtapaId = "rn" | "2-6" | "12-18" | "4-6";
export const ETAPAS: { id: EtapaId; nombre: string; nota: string }[] = [
  { id: "rn", nombre: "Recién nacido", nota: "Las primeras vacunas se ponen en las primeras horas y días de vida." },
  { id: "2-6", nombre: "2-6 meses", nota: "Es la etapa con más dosis. Conviene dejar apartadas las tres visitas: 2, 4 y 6 meses." },
  { id: "12-18", nombre: "12-18 meses", nota: "Se completan refuerzos y empiezan las vacunas contra sarampión, varicela y hepatitis A." },
  { id: "4-6", nombre: "4-6 años", nota: "Refuerzos antes de entrar al colegio. Traiga el carné para revisar lo pendiente." },
];

/* meses: a qué edad toca cada dosis. precio: por dosis */
export type Vacuna = { id: string; etapa: EtapaId; nombre: string; protege: string; meses: number[]; cuando: string; precio: number };
export const VACUNAS: Vacuna[] = [
  { id: "bcg", etapa: "rn", nombre: "BCG", protege: "Formas graves de tuberculosis", meses: [0], cuando: "Al nacer", precio: 175 },
  { id: "hepb", etapa: "rn", nombre: "Hepatitis B", protege: "Infección del hígado por hepatitis B", meses: [0], cuando: "En las primeras 24 horas", precio: 160 },

  { id: "hexa", etapa: "2-6", nombre: "Hexavalente", protege: "Difteria, tétanos, tos ferina, polio, Hib y hepatitis B", meses: [2, 4, 6], cuando: "2, 4 y 6 meses", precio: 625 },
  { id: "neumo", etapa: "2-6", nombre: "Neumococo conjugada", protege: "Neumonía, meningitis y otitis por neumococo", meses: [2, 4, 6], cuando: "2, 4 y 6 meses", precio: 850 },
  { id: "rota", etapa: "2-6", nombre: "Rotavirus (oral)", protege: "Diarrea grave por rotavirus", meses: [2, 4], cuando: "2 y 4 meses", precio: 450 },
  { id: "flu", etapa: "2-6", nombre: "Influenza", protege: "Gripe estacional y sus complicaciones", meses: [6, 7], cuando: "Desde los 6 meses, con 4 semanas entre dosis", precio: 225 },

  { id: "spr", etapa: "12-18", nombre: "SPR (triple viral)", protege: "Sarampión, paperas y rubéola", meses: [12, 18], cuando: "12 y 18 meses", precio: 350 },
  { id: "neumo-r", etapa: "12-18", nombre: "Neumococo, refuerzo", protege: "Mantiene la protección contra neumococo", meses: [12], cuando: "12 meses", precio: 850 },
  { id: "vari", etapa: "12-18", nombre: "Varicela", protege: "Varicela y sus complicaciones", meses: [15], cuando: "Entre 12 y 15 meses", precio: 575 },
  { id: "hepa", etapa: "12-18", nombre: "Hepatitis A", protege: "Infección del hígado por hepatitis A", meses: [12, 18], cuando: "12 y 18 meses", precio: 395 },
  { id: "hexa-r", etapa: "12-18", nombre: "Hexavalente, refuerzo", protege: "Refuerzo de las vacunas de los primeros meses", meses: [18], cuando: "18 meses", precio: 625 },

  { id: "tetra", etapa: "4-6", nombre: "DPT y polio, refuerzo", protege: "Difteria, tétanos, tos ferina y polio", meses: [48], cuando: "4 años", precio: 495 },
  { id: "vari-r", etapa: "4-6", nombre: "Varicela, refuerzo", protege: "Segunda dosis contra varicela", meses: [48], cuando: "Entre 4 y 6 años", precio: 575 },
  { id: "flu-a", etapa: "4-6", nombre: "Influenza anual", protege: "Gripe estacional y sus complicaciones", meses: [60], cuando: "Una dosis cada año", precio: 225 },
  { id: "menin", etapa: "4-6", nombre: "Meningococo", protege: "Meningitis por meningococo (según indicación del pediatra)", meses: [60], cuando: "Según indicación", precio: 950 },
];
export const vacunaPor = (id: string) => VACUNAS.find((v) => v.id === id)!;

/* cada dosis por separado, para el carné */
export type Dosis = { clave: string; vacuna: Vacuna; mes: number; numero: number; de: number };
export const DOSIS: Dosis[] = VACUNAS.flatMap((v) => v.meses.map((mes, i) => ({ clave: `${v.id}-${i + 1}`, vacuna: v, mes, numero: i + 1, de: v.meses.length })));
export const nombreDosis = (d: Dosis) => (d.de > 1 ? `${d.vacuna.nombre} · dosis ${d.numero} de ${d.de}` : d.vacuna.nombre);

/* ---------------- pediatras y motivos ---------------- */

export const PEDIATRAS = [
  { id: "morales", nombre: "Dra. Sofía Morales", area: "Pediatría general y recién nacidos", atiende: "Control del bebé, lactancia y primeros alimentos", foto: foto("1758691462651-611d730c5272", 900) },
  { id: "paiz", nombre: "Dr. Rodrigo Paiz", area: "Alergias y vías respiratorias", atiende: "Tos que no se quita, asma y alergias", foto: foto("1758691463582-11aea602cd4a", 700) },
  { id: "barrios", nombre: "Dra. Ana Lucía Barrios", area: "Crecimiento y desarrollo", atiende: "Peso, talla, sueño y desarrollo escolar", foto: foto("1623854767648-e7bb8009f0db", 700) },
];
export const pediatraPor = (id: string) => PEDIATRAS.find((p) => p.id === id) ?? PEDIATRAS[0];

export type MotivoId = "control" | "vacunacion" | "sintomas" | "recien";
export const MOTIVOS: { id: MotivoId; nombre: string; detalle: string; precio: number }[] = [
  { id: "control", nombre: "Control niño sano", detalle: "Peso, talla, desarrollo y alimentación · 30 min", precio: 350 },
  { id: "vacunacion", nombre: "Vacunación", detalle: "Revisión previa y aplicación · 30 min. La vacuna se suma aparte", precio: 100 },
  { id: "sintomas", nombre: "Consulta por síntomas", detalle: "Fiebre, tos, diarrea, dolor de oído · 30 min", precio: 400 },
  { id: "recien", nombre: "Recién nacido y lactancia", detalle: "Primeras semanas, peso y apoyo para amamantar · 30 min", precio: 425 },
];
export const motivoPor = (id: MotivoId) => MOTIVOS.find((m) => m.id === id)!;
export const totalCita = (motivo: MotivoId, vacunas: string[]) => motivoPor(motivo).precio + vacunas.reduce((s, id) => s + vacunaPor(id).precio, 0);

/* ---------------- citas, carné y horarios ---------------- */

/* desde dónde se apartó la cita en el sitio */
export type Origen = "inicio" | "portal";
export const ESTADOS = ["Confirmada", "En sala", "En consulta", "Atendida"] as const;
export type EstadoCita = (typeof ESTADOS)[number];
export type Cita = {
  id: string; fecha: string; hora: string; pediatraId: string; motivo: MotivoId; pacienteId: string;
  vacunas: string[]; nota: string; estado: EstadoCita; origen?: Origen;
};
export type Aplicada = { clave: string; fecha: string; lote: string; pediatraId: string };
/* familia: los niños cuyo carné se ve en el Portal Padres de este teléfono */
export type Paciente = { id: string; nombre: string; nacimiento: string; tutor: string; telefono: string; aplicadas: Aplicada[]; familia?: boolean };

type Estado = { creado: string; citas: Cita[]; pacientes: Paciente[]; cerrados: Record<string, string[]> };

export const claveDia = (pediatraId: string, fecha: string) => `${pediatraId}|${fecha}`;

/* el carné de ejemplo: todas las dosis de su edad, menos las que se dejan pendientes */
function carne(nacimiento: string, faltan: string[] = []): Aplicada[] {
  const meses = mesesDe(nacimiento);
  return DOSIS.filter((d) => d.mes <= meses && !faltan.includes(d.clave) && d.vacuna.id !== "menin" && d.vacuna.id !== "flu-a").map((d, i) => {
    const f = aFecha(nacimiento);
    f.setMonth(f.getMonth() + d.mes);
    const fecha = isoDe(f) > hoyIso() ? hoyIso() : isoDe(f);
    return { clave: d.clave, fecha, lote: `LA-${2400 + i * 37}`, pediatraId: PEDIATRAS[i % PEDIATRAS.length].id };
  });
}

function inicial(): Estado {
  const paciente = (id: string, nombre: string, meses: number, tutor: string, telefono: string, faltan: string[] = []): Paciente => {
    const nacimiento = nacidoHace(meses);
    return { id, nombre, nacimiento, tutor, telefono, aplicadas: carne(nacimiento, faltan) };
  };
  const pacientes = [
    paciente("p1", "Emma Castellanos", 4, "Paola Castellanos", "5512 8840", ["hexa-2", "neumo-2", "rota-2"]),
    paciente("p2", "Mateo Quiñónez", 12, "Luis Quiñónez", "4187 2256", ["spr-1", "neumo-r-1", "hepa-1"]),
    paciente("p3", "Valeria Castellanos", 49, "Paola Castellanos", "5512 8840", ["tetra-1", "vari-r-1"]),
    paciente("p4", "Santiago Arriola", 7, "Gabriela Arriola", "3344 9018", ["flu-1", "flu-2"]),
    paciente("p5", "Isabella Montenegro", 19, "Carlos Montenegro", "5077 6631", ["hexa-r-1"]),
    paciente("p6", "Diego Lemus", 0, "Mónica Lemus", "4620 3385"),
    paciente("p7", "Camila Orellana", 30, "Diana Orellana", "5841 0927"),
  ];
  for (const p of pacientes) if (p.tutor === "Paola Castellanos") p.familia = true;
  const [d0, d1, d2] = proximosDias(3);
  const c = (id: string, fecha: string, hora: string, pediatraId: string, motivo: MotivoId, pacienteId: string, vacunas: string[] = [], nota = "", estado: EstadoCita = "Confirmada"): Cita =>
    ({ id, fecha, hora, pediatraId, motivo, pacienteId, vacunas, nota, estado });
  const citas = [
    c("A-1041", d0, "08:00", "morales", "control", "p6", [], "Primer control, dudas de lactancia", "Atendida"),
    c("A-1042", d0, "08:30", "paiz", "sintomas", "p7", [], "Tos de 4 días, peor de noche", "En consulta"),
    c("A-1043", d0, "09:30", "morales", "vacunacion", "p1", ["hexa", "neumo", "rota"], "", "En sala"),
    c("A-1044", d0, "10:30", "barrios", "vacunacion", "p2", ["spr", "neumo-r"]),
    c("A-1045", d0, "14:30", "barrios", "control", "p5"),
    c("A-1046", d0, "16:00", "paiz", "vacunacion", "p4", ["flu"]),
    c("A-1047", d1, "09:00", "barrios", "vacunacion", "p3", ["tetra", "vari-r"]),
    c("A-1048", d1, "11:00", "morales", "control", "p1"),
    c("A-1049", d2, "08:30", "paiz", "sintomas", "p4", [], "Revisión de oído"),
  ];
  const cerrados: Record<string, string[]> = {
    [claveDia("morales", d0)]: ["11:30", "12:00"],
    [claveDia("paiz", d1)]: ["14:00", "14:30", "15:00"],
    [claveDia("barrios", d2)]: ["08:00", "08:30"],
  };
  return { creado: hoyIso(), citas, pacientes, cerrados };
}

const CLAVE = "jz-alamos-v2";

export type NuevaCita = {
  fecha: string; hora: string; pediatraId: string; motivo: MotivoId; vacunas: string[]; nota: string;
  nino: string; meses: number; tutor: string; telefono: string; origen: Origen;
};

/* las citas son del día: si lo guardado es de otro día, se empieza de nuevo */
function leerGuardado(texto: string | null) {
  try {
    const g = texto ? (JSON.parse(texto) as Estado) : null;
    return g?.creado === hoyIso() ? g : null;
  } catch {
    return null;
  }
}

export function useClinicaPediatrica() {
  const [e, setE] = useState<Estado>(() => {
    try {
      const g = leerGuardado(localStorage.getItem(CLAVE));
      if (g) return g;
    } catch {
      /* sin almacenamiento, se trabaja en memoria */
    }
    return inicial();
  });
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(e));
    } catch {
      /* nada */
    }
  }, [e]);
  /* si el sitio está abierto en otra pestaña, los cambios llegan solos */
  useEffect(() => {
    const llega = (ev: StorageEvent) => {
      if (ev.key !== CLAVE) return;
      const g = leerGuardado(ev.newValue);
      if (g) setE(g);
    };
    addEventListener("storage", llega);
    return () => removeEventListener("storage", llega);
  }, []);

  /* crea la cita (y la ficha del niño si es nuevo) y devuelve su número */
  function agendar(n: NuevaCita) {
    const limpio = (t: string) => t.trim().toLocaleLowerCase("es");
    const digitos = (t: string) => t.replace(/\D/g, "");
    const conocido = e.pacientes.find((p) => limpio(p.nombre) === limpio(n.nino) && digitos(p.telefono) === digitos(n.telefono));
    const pacienteId = conocido?.id ?? `p${e.pacientes.length + 1}`;
    const id = `A-${Math.max(1040, ...e.citas.map((c) => Number(c.id.slice(2)))) + 1}`;
    setE((v) => ({
      ...v,
      pacientes: conocido
        ? v.pacientes.map((p) => (p.id === pacienteId ? { ...p, familia: true } : p))
        : [...v.pacientes, { id: pacienteId, nombre: n.nino.trim(), nacimiento: nacidoHace(n.meses, 0), tutor: n.tutor.trim(), telefono: n.telefono.trim(), aplicadas: [], familia: true }],
      citas: [...v.citas, { id, fecha: n.fecha, hora: n.hora, pediatraId: n.pediatraId, motivo: n.motivo, pacienteId, vacunas: n.vacunas, nota: n.nota.trim(), estado: "Confirmada", origen: n.origen }],
    }));
    return id;
  }

  return {
    ...e,
    agendar,
    cambiarEstado: (id: string, estado: EstadoCita) => setE((v) => ({ ...v, citas: v.citas.map((c) => (c.id === id ? { ...c, estado } : c)) })),
    aplicar: (pacienteId: string, a: Aplicada) =>
      setE((v) => ({ ...v, pacientes: v.pacientes.map((p) => (p.id === pacienteId ? { ...p, aplicadas: [...p.aplicadas.filter((x) => x.clave !== a.clave), a] } : p)) })),
    anular: (pacienteId: string, clave: string) =>
      setE((v) => ({ ...v, pacientes: v.pacientes.map((p) => (p.id === pacienteId ? { ...p, aplicadas: p.aplicadas.filter((x) => x.clave !== clave) } : p)) })),
    ponerCerrados: (pediatraId: string, fecha: string, horas: string[]) => setE((v) => ({ ...v, cerrados: { ...v.cerrados, [claveDia(pediatraId, fecha)]: horas } })),
  };
}
export type Clinica = ReturnType<typeof useClinicaPediatrica>;

export const citaEn = (clinica: Clinica, pediatraId: string, fecha: string, hora: string) =>
  clinica.citas.find((c) => c.pediatraId === pediatraId && c.fecha === fecha && c.hora === hora);
export const estaLibre = (clinica: Clinica, pediatraId: string, fecha: string, hora: string) =>
  !yaPaso(fecha, hora) && !citaEn(clinica, pediatraId, fecha, hora) && !clinica.cerrados[claveDia(pediatraId, fecha)]?.includes(hora);

/* meningococo e influenza anual dependen de indicación: no cuentan como atraso */
export const aCriterio = (d: Dosis) => d.vacuna.id === "menin" || d.vacuna.id === "flu-a";
export function resumenCarne(p: Paciente) {
  const meses = mesesDe(p.nacimiento);
  const deSuEdad = DOSIS.filter((d) => d.mes <= meses && !aCriterio(d));
  const faltan = deSuEdad.filter((d) => !p.aplicadas.some((a) => a.clave === d.clave));
  return { meses, total: deSuEdad.length, puestas: deSuEdad.length - faltan.length, faltan, pendientes: faltan.length };
}

/* ---------------- formulario de cita ---------------- */

export type CampoCita = "hora" | "nino" | "edad" | "tutor" | "telefono";
export type Unidad = "meses" | "años";
/* null si la edad no sirve (vacía, con decimales o de más de 18 años) */
export function mesesDeEdad(edad: string, unidad: Unidad) {
  const n = Number(edad);
  const meses = unidad === "años" ? n * 12 : n;
  return edad.trim() !== "" && Number.isInteger(n) && n >= 0 && meses <= 216 ? meses : null;
}
/* lo primero que falta para confirmar */
export function faltaEnCita(d: { fecha: string; hora: string; nino: string; edad: string; unidad: Unidad; tutor: string; telefono: string }): [CampoCita, string] | null {
  if (!d.fecha || !d.hora) return ["hora", "Elija una hora disponible."];
  if (d.nino.trim().length < 3) return ["nino", "Escriba el nombre del niño o la niña."];
  if (mesesDeEdad(d.edad, d.unidad) === null) return ["edad", "Escriba la edad en números enteros."];
  if (d.tutor.trim().length < 3) return ["tutor", "Escriba el nombre de mamá, papá o encargado."];
  if (d.telefono.replace(/\D/g, "").length < 8) return ["telefono", "Escriba un teléfono de 8 dígitos."];
  return null;
}
export function mensajeDeCita(c: Cita, paciente: Paciente | undefined) {
  const lista = c.vacunas.map((id) => vacunaPor(id).nombre).join(", ");
  return [
    `Hola, Centro Pediátrico Los Álamos. Confirmo la cita ${c.id}:`,
    `- Paciente: ${paciente?.nombre}`,
    `- Motivo: ${motivoPor(c.motivo).nombre}`,
    `- Pediatra: ${pediatraPor(c.pediatraId).nombre}`,
    `- Fecha: ${fechaLarga(c.fecha)}, ${hora12(c.hora)}`,
    lista && `- Vacunas: ${lista}`,
    `- Total estimado: ${formatoQ(totalCita(c.motivo, c.vacunas))}`,
    `- Encargado: ${paciente?.tutor}, tel. ${paciente?.telefono}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export const enlaceWhatsApp = (texto: string) => `https://wa.me/?text=${encodeURIComponent(texto)}`;

/* número de la línea de emergencias de la clínica (inventado: se cambia por el real) */
export const TEL_EMERGENCIAS = "2200 0000";
