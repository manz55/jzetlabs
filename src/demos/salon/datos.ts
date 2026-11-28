/*
 * Datos de Atelier L'Art (salón inventado): sucursales, equipo, servicios, diagnóstico capilar,
 * citas, fórmulas de color y expedientes. Las tres vistas leen y escriben el mismo estado, que se
 * guarda en este navegador y vuelve a empezar cada día para que las fechas siempre tengan sentido.
 */
import { useCallback, useEffect, useState } from "react";

export const foto = (id: string, ancho: number, alto: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${ancho}&h=${alto}&q=74`;

export const FOTOS = {
  portada: "1712213396688-c6f2d536671f",
};

/* ---------------- sucursales y equipo ---------------- */

export type SucId = "z10" | "cayala";
export type Sucursal = {
  id: SucId;
  nombre: string;
  direccion: string;
  referencia: string;
  mapa: string;
  horario: [string, string][];
  /* [abre, cierra] de lunes a sábado y de domingo, en horas */
  semana: [number, number];
  domingo: [number, number];
  foto: string;
  alt: string;
};

export const SUCURSALES: Sucursal[] = [
  {
    id: "z10",
    nombre: "Zona 10",
    direccion: "14 calle 3-51, zona 10, Ciudad de Guatemala",
    referencia: "Zona Viva, con parqueo en el edificio",
    mapa: "14 calle zona 10, Ciudad de Guatemala",
    horario: [
      ["Lunes a sábado", "9:00 a 19:00"],
      ["Domingo", "10:00 a 15:00"],
    ],
    semana: [9, 19],
    domingo: [10, 15],
    foto: "1626383137804-ff908d2753a2",
    alt: "Interior luminoso de un salón con sillones y estantería de productos",
  },
  {
    id: "cayala",
    nombre: "Cayalá",
    direccion: "Paseo Cayalá, zona 16, Ciudad de Guatemala",
    referencia: "Nivel 2, con parqueo en el sótano del paseo",
    mapa: "Paseo Cayalá, Ciudad de Guatemala",
    horario: [
      ["Lunes a sábado", "10:00 a 20:00"],
      ["Domingo", "10:00 a 17:00"],
    ],
    semana: [10, 20],
    domingo: [10, 17],
    foto: "1695527081848-1e46c06e6458",
    alt: "Estilista peinando a una clienta junto a un ventanal",
  },
];
export const sucursal = (id: SucId) => SUCURSALES.find((s) => s.id === id)!;

export const CATEGORIAS = ["Colorimetría", "Corte y Styling", "Tratamientos", "Manicure"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export type Estilista = { id: string; nombre: string; rol: string; suc: SucId; hace: Categoria[]; anios: number };
export const EQUIPO: Estilista[] = [
  { id: "andrea", nombre: "Andrea Morales", rol: "Directora de color", suc: "z10", hace: ["Colorimetría", "Corte y Styling", "Tratamientos"], anios: 12 },
  { id: "daniel", nombre: "Daniel Reyes", rol: "Corte y styling", suc: "z10", hace: ["Corte y Styling", "Tratamientos"], anios: 8 },
  { id: "sofia", nombre: "Sofía Lemus", rol: "Manicurista", suc: "z10", hace: ["Manicure"], anios: 6 },
  { id: "mariana", nombre: "Mariana Castillo", rol: "Colorista senior", suc: "cayala", hace: ["Colorimetría", "Corte y Styling", "Tratamientos"], anios: 10 },
  { id: "jose", nombre: "José Pablo Ruiz", rol: "Corte y styling", suc: "cayala", hace: ["Corte y Styling", "Tratamientos"], anios: 7 },
  { id: "fer", nombre: "Fernanda Solís", rol: "Manicurista", suc: "cayala", hace: ["Manicure"], anios: 5 },
];
export const estilista = (id: string) => EQUIPO.find((e) => e.id === id)!;

export const ESTACIONES = ["Sillón 1", "Sillón 2", "Lavacabezas VIP"] as const;
export type Estacion = (typeof ESTACIONES)[number];

/* ---------------- servicios ---------------- */

export type ServicioId = "balayage" | "canas" | "corte" | "ondas" | "kerastase" | "olaplex" | "gel" | "spa";
export type Servicio = {
  id: ServicioId;
  cat: Categoria;
  nombre: string;
  detalle: string;
  dura: number;
  precio: number;
  /* días para volver a retocar */
  retoque?: number;
  foto: string;
  alt: string;
};

export const SERVICIOS: Servicio[] = [
  { id: "balayage", cat: "Colorimetría", nombre: "Balayage e iluminación", detalle: "Aclarado a mano alzada, matizado y protector de enlace.", dura: 180, precio: 950, retoque: 90, foto: "1785456283212-338f5bc44d50", alt: "Cabello largo y ondulado con balayage dorado" },
  { id: "canas", cat: "Colorimetría", nombre: "Cobertura de canas", detalle: "Raíz con fórmula a su tono y brillo en medios y puntas.", dura: 90, precio: 425, retoque: 28, foto: "1707720531504-ce087725861a", alt: "Colorista preparando una mezcla de tinte" },
  { id: "corte", cat: "Corte y Styling", nombre: "Corte de diseño y secado", detalle: "Asesoría según rostro y caída, lavado, corte y secado.", dura: 60, precio: 220, foto: "1700760934268-8aa0ef52ce0a", alt: "Estilista cortando cabello oscuro con tijeras" },
  { id: "ondas", cat: "Corte y Styling", nombre: "Peinado con ondas", detalle: "Lavado, protector térmico y ondas que duran el evento.", dura: 45, precio: 180, foto: "1629397685944-7073f5589754", alt: "Estilista formando ondas con tenaza" },
  { id: "kerastase", cat: "Tratamientos", nombre: "Ritual de hidratación Kérastase", detalle: "Diagnóstico de cuero cabelludo, mascarilla y masaje en lavacabezas.", dura: 60, precio: 375, foto: "1634449571010-02389ed0f9b0", alt: "Clienta en el lavacabezas durante un tratamiento" },
  { id: "olaplex", cat: "Tratamientos", nombre: "Reconstrucción Olaplex", detalle: "Repara enlaces en cabello decolorado o con calor frecuente.", dura: 45, precio: 325, foto: "1793998370304-3308275bc99c", alt: "Aplicación de tratamiento en el lavacabezas" },
  { id: "gel", cat: "Manicure", nombre: "Manicure en gel", detalle: "Preparación, esmaltado en gel y aceite de cutícula.", dura: 60, precio: 175, foto: "1613457492120-4fcfbb7c3a5b", alt: "Aplicación de esmalte en gel" },
  { id: "spa", cat: "Manicure", nombre: "Manicure spa", detalle: "Exfoliación, hidratación, masaje de manos y esmalte.", dura: 45, precio: 135, foto: "1659391542239-9648f307c0b1", alt: "Manicurista trabajando las uñas de una clienta" },
];
export const servicio = (id: ServicioId) => SERVICIOS.find((s) => s.id === id)!;
export const nombresDe = (ids: ServicioId[]) => ids.map((i) => servicio(i).nombre).join(" + ");
export const totalDe = (ids: ServicioId[]) => ids.reduce((n, i) => n + servicio(i).precio, 0);
export const duraDe = (ids: ServicioId[]) => ids.reduce((n, i) => n + servicio(i).dura, 0);
export const llevaPelo = (ids: ServicioId[]) => ids.some((i) => servicio(i).cat !== "Manicure");

/* quién puede atender esos servicios; si hay cabello y uñas, las uñas las toma la manicurista en la misma visita */
export function especialistas(suc: SucId, ids: ServicioId[]) {
  const cats = ids.map((i) => servicio(i).cat);
  const pelo = cats.filter((c) => c !== "Manicure");
  const necesita: Categoria[] = pelo.length ? pelo : cats;
  const lista = EQUIPO.filter((e) => e.suc === suc && necesita.every((c) => e.hace.includes(c)));
  const manos = pelo.length && cats.includes("Manicure") ? EQUIPO.find((e) => e.suc === suc && e.hace.includes("Manicure")) : undefined;
  return { lista, manos };
}

/* ---------------- diagnóstico capilar ---------------- */

export const ESTADOS_PELO = [
  { id: "natural", nombre: "Cabello natural", detalle: "Sin tinte ni decoloración en el último año" },
  { id: "tenido", nombre: "Teñido oscuro", detalle: "Tinte permanente en tonos castaños o negro" },
  { id: "procesado", nombre: "Decolorado / Procesado", detalle: "Decoloración, alisado o keratina reciente" },
] as const;
export type EstadoPelo = (typeof ESTADOS_PELO)[number]["id"];

export const OBJETIVOS = [
  { id: "balayage", nombre: "Balayage / Iluminación" },
  { id: "canas", nombre: "Cobertura de canas" },
  { id: "hidratacion", nombre: "Hidratación profunda" },
  { id: "corte", nombre: "Corte y styling" },
] as const;
export type Objetivo = (typeof OBJETIVOS)[number]["id"];

export type Resultado = { minutos: number; desde: number; hasta: number; titulo: string; recomendacion: string; antes: string; servicios: ServicioId[] };
const r = (minutos: number, desde: number, hasta: number, titulo: string, recomendacion: string, antes: string, servicios: ServicioId[]): Resultado => ({ minutos, desde, hasta, titulo, recomendacion, antes, servicios });

export const DIAGNOSTICO: Record<EstadoPelo, Record<Objetivo, Resultado>> = {
  natural: {
    balayage: r(180, 950, 1350, "Balayage en una sesión", "La base virgen aclara pareja. Trabajamos con 20 volúmenes, protector de enlace y matizado al final.", "Prueba de mechón de 15 minutos.", ["balayage"]),
    canas: r(90, 425, 560, "Cobertura sin amoníaco agresivo", "Igualamos su base natural y difuminamos el crecimiento para que el retoque se note menos.", "Prueba de sensibilidad en piel.", ["canas"]),
    hidratacion: r(60, 375, 475, "Ritual de hidratación", "Mascarilla según porosidad y sellado con vapor. Una vez al mes mantiene brillo y elasticidad.", "Lectura de porosidad en seco.", ["kerastase"]),
    corte: r(60, 220, 300, "Corte de diseño", "Definimos forma según densidad y caída natural, con acabado que pueda repetir en casa.", "Asesoría de 10 minutos frente al espejo.", ["corte"]),
  },
  tenido: {
    balayage: r(270, 1400, 2200, "Aclarado por etapas", "El pigmento oscuro sube por fases. Puede requerir dos visitas separadas tres semanas para no romper la fibra.", "Prueba de mechón y elasticidad obligatoria.", ["balayage", "olaplex"]),
    canas: r(105, 475, 620, "Raíz igualada al color actual", "Formulamos sobre el tinte que ya tiene para evitar bandas más oscuras en medios y puntas.", "Revisión de la fórmula anterior.", ["canas"]),
    hidratacion: r(75, 400, 525, "Hidratación y sellado de color", "El tinte reseca puntas. Combinamos mascarilla nutritiva con sellador de pH ácido.", "Lectura de porosidad en seco.", ["kerastase"]),
    corte: r(60, 220, 325, "Corte y saneado de puntas", "Retiramos puntas con pigmento acumulado y damos movimiento con capas suaves.", "Asesoría de 10 minutos frente al espejo.", ["corte"]),
  },
  procesado: {
    balayage: r(240, 1350, 1900, "Primero salud, luego luz", "Reconstruimos antes de aclarar. Si el mechón no resiste la prueba, no decoloramos ese día.", "Prueba de mechón y elasticidad obligatoria.", ["olaplex", "balayage"]),
    canas: r(105, 525, 690, "Color suave con reconstrucción", "Usamos oxidante de bajo volumen y protector de enlace para no sumar daño.", "Prueba de elasticidad en medios.", ["canas", "olaplex"]),
    hidratacion: r(105, 650, 825, "Reconstrucción e hidratación", "Olaplex para los enlaces y mascarilla Kérastase para la suavidad. Sugerimos tres sesiones, una cada dos semanas.", "Lectura de porosidad y elasticidad.", ["olaplex", "kerastase"]),
    corte: r(90, 450, 600, "Corte con reparación", "Saneamos lo quebradizo sin perder largo de más y cerramos con reconstrucción.", "Prueba de elasticidad en puntas.", ["corte", "olaplex"]),
  },
};

/* ---------------- fechas y formatos ---------------- */

export const qz = (n: number) => `Q${n.toLocaleString("en-US")}`;
export const tiempo = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return [h ? `${h} h` : "", m ? `${m} min` : ""].filter(Boolean).join(" ") || "0 min";
};

export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const masDias = (n: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
};
export const dia = (n: number) => iso(masDias(n));
export const aFecha = (f: string) => {
  const [a, m, d] = f.split("-").map(Number);
  return new Date(a, m - 1, d);
};
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const diaCorto = (f: string) => DIAS[aFecha(f).getDay()].slice(0, 3);
export const mesCorto = (f: string) => MESES[aFecha(f).getMonth()].slice(0, 3);
export const numeroDia = (f: string) => aFecha(f).getDate();
export const fechaLarga = (f: string) => `${DIAS[aFecha(f).getDay()]} ${numeroDia(f)} de ${MESES[aFecha(f).getMonth()]}`;
export const fechaMedia = (f: string) => `${numeroDia(f)} ${mesCorto(f)} ${aFecha(f).getFullYear()}`;
export const fechaCercana = (f: string) => (f === dia(0) ? "Hoy" : f === dia(1) ? "Mañana" : `${diaCorto(f)} ${numeroDia(f)} ${mesCorto(f)}`);
/* días de calendario entre hoy y la fecha (negativo si ya pasó) */
export const faltan = (f: string) => Math.round((aFecha(f).getTime() - masDias(0).getTime()) / 864e5);
export const aMin = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3));
export const aHora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const hora12 = (h: string) => {
  const m = aMin(h);
  const hh = Math.floor(m / 60);
  return `${hh % 12 || 12}:${String(m % 60).padStart(2, "0")} ${hh >= 12 ? "p. m." : "a. m."}`;
};
export const horarioDe = (s: Sucursal, f: string) => (aFecha(f).getDay() === 0 ? s.domingo : s.semana);
export const abiertaAhora = (s: Sucursal) => {
  const ahora = new Date();
  const [abre, cierra] = horarioDe(s, iso(ahora));
  return ahora.getHours() >= abre && ahora.getHours() < cierra;
};
export const whatsapp = (texto: string) => `https://wa.me/?text=${encodeURIComponent(texto)}`;

/* ---------------- citas, fórmulas y clientas ---------------- */

export type EstadoCita = "por-confirmar" | "confirmada" | "en-sillon" | "completada" | "cancelada";
export const NOMBRE_ESTADO: Record<EstadoCita, string> = {
  "por-confirmar": "Por confirmar",
  confirmada: "Confirmada",
  "en-sillon": "En sillón",
  completada: "Completada",
  cancelada: "Cancelada",
};

export const POROSIDADES = ["Baja", "Media", "Alta"] as const;
export type Porosidad = (typeof POROSIDADES)[number];
export const OXIDANTES = ["Sin oxidante", "10 Vol", "20 Vol", "30 Vol", "40 Vol"] as const;
export type Formula = { mezcla: string; oxidante: string; minutos: number; porosidad: Porosidad; tratamiento: string; nota: string };

export type Cita = {
  id: string;
  folio: string;
  clienta: string;
  suc: SucId;
  servicios: ServicioId[];
  estilista: string;
  manos?: string;
  fecha: string;
  hora: string;
  estado: EstadoCita;
  estacion: Estacion | "";
  formula: Formula | null;
  nueva?: boolean;
};

export type Clienta = { id: string; nombre: string; tel: string; desde: number; base: string; cuidado: string };

type Estado = { dia: string; citas: Cita[]; clientas: Clienta[]; folio: number };

const cl = (id: string, nombre: string, tel: string, desde: number, base: string, cuidado: string): Clienta => ({ id, nombre, tel, desde, base, cuidado });

function inicial(): Estado {
  const clientas: Clienta[] = [
    cl("valeria", "Valeria Méndez", "50000001", 2023, "Castaño medio, nivel 5", "Sensibilidad leve en la línea de la frente: aplicar barrera antes del tinte."),
    cl("mariajose", "María José Ruiz", "50000002", 2022, "Castaño claro, nivel 6", "Cabello fino. Evitar tracción con la plancha."),
    cl("gabriela", "Gabriela Pineda", "50000003", 2024, "Castaño oscuro, nivel 4", "Canas resistentes en la parte frontal."),
    cl("lucia", "Lucía Paz", "50000004", 2021, "Rubio oscuro, nivel 7", "Puntas decoloradas, reconstruir cada mes."),
    cl("daniela", "Daniela Ortiz", "50000005", 2025, "Negro natural, nivel 2", "Sin procesos químicos previos."),
    cl("anasofia", "Ana Sofía Herrera", "50000006", 2024, "Castaño medio, nivel 5", "Alisado hace ocho meses: probar elasticidad."),
    cl("monica", "Mónica Aguilar", "50000007", 2023, "Castaño medio, nivel 5", "Prefiere reflejos fríos."),
    cl("paola", "Paola Estrada", "50000008", 2022, "Rubio medio, nivel 8", "Matizar sin violeta intenso."),
  ];
  let folio = 1040;
  const c = (id: string, clienta: string, suc: SucId, servicios: ServicioId[], est: string, enDias: number, hora: string, estado: EstadoCita, estacion: Estacion | "" = "", formula: Formula | null = null): Cita => ({
    id,
    folio: `AL-${folio++}`,
    clienta,
    suc,
    servicios,
    estilista: est,
    fecha: dia(enDias),
    hora,
    estado,
    estacion,
    formula,
  });
  const f = (mezcla: string, oxidante: string, minutos: number, porosidad: Porosidad, tratamiento: string, nota: string): Formula => ({ mezcla, oxidante, minutos, porosidad, tratamiento, nota });

  const citas: Cita[] = [
    /* hoy */
    c("h1", "mariajose", "z10", ["balayage", "olaplex"], "andrea", 0, "09:00", "completada", "Sillón 2", f("30 g polvo decolorante + 60 g oxidante · matiz 9.1 + 9.2 (1:1)", "20 Vol", 40, "Media", "Olaplex No.1 y No.2", "Subió a nivel 8 parejo. Próxima visita: matizar.")),
    c("h2", "gabriela", "z10", ["canas"], "andrea", 0, "13:00", "en-sillon", "Sillón 1"),
    c("h3", "monica", "z10", ["corte"], "daniel", 0, "15:00", "por-confirmar"),
    c("h4", "paola", "z10", ["gel"], "sofia", 0, "16:30", "confirmada"),
    c("h5", "lucia", "cayala", ["kerastase"], "mariana", 0, "11:00", "en-sillon", "Lavacabezas VIP"),
    c("h6", "daniela", "cayala", ["corte", "ondas"], "jose", 0, "12:00", "completada", "Sillón 1"),
    c("h7", "anasofia", "cayala", ["balayage"], "mariana", 0, "16:00", "por-confirmar"),
    /* próximas */
    c("p1", "monica", "cayala", ["spa"], "fer", 1, "11:00", "confirmada"),
    c("p2", "daniela", "z10", ["ondas"], "daniel", 2, "17:00", "por-confirmar"),
    c("p3", "valeria", "z10", ["canas", "kerastase"], "andrea", 6, "10:00", "confirmada"),
    /* historial */
    c("v1", "valeria", "z10", ["canas", "kerastase"], "andrea", -17, "10:00", "completada", "Sillón 1", f("40 g tinte 7.1 + 20 g tinte 8.12", "20 Vol", 35, "Media", "Ritual de hidratación Kérastase", "Cobertura completa en raíz. Emulsionar en medios los últimos 5 minutos.")),
    c("v2", "valeria", "z10", ["balayage", "olaplex"], "andrea", -84, "09:30", "completada", "Sillón 2", f("35 g polvo decolorante + 70 g oxidante · matiz 8.12 + 9.1 (2:1)", "30 Vol", 40, "Media", "Olaplex No.1 y No.2", "Balayage desde medios. Evitar solapar sobre la iluminación anterior.")),
    c("v3", "valeria", "z10", ["canas", "corte"], "andrea", -168, "11:00", "completada", "Sillón 1", f("45 g tinte 6.0 + 15 g tinte 7.1", "20 Vol", 35, "Baja", "Sellador de color", "Primer registro de la fórmula base.")),
    c("v4", "paola", "z10", ["balayage"], "andrea", -76, "09:00", "completada", "Sillón 2", f("30 g polvo decolorante + 60 g oxidante · matiz 10.2", "20 Vol", 35, "Alta", "Olaplex No.2", "Puntas porosas: matizar solo 8 minutos.")),
    c("v5", "monica", "cayala", ["canas"], "mariana", -20, "14:00", "completada", "Sillón 1", f("50 g tinte 5.1 + 10 g tinte 6.11", "20 Vol", 35, "Media", "Mascarilla de brillo", "Reflejo frío estable.")),
    c("v6", "lucia", "cayala", ["balayage", "olaplex"], "mariana", -69, "10:00", "completada", "Sillón 2", f("matiz 9.12 + 10.1 (1:1)", "10 Vol", 20, "Alta", "Olaplex No.1 y No.2", "No decolorar puntas en la próxima visita.")),
    c("v7", "gabriela", "z10", ["canas"], "andrea", -29, "13:00", "completada", "Sillón 1", f("60 g tinte 4.0", "20 Vol", 40, "Baja", "Sellador de color", "Pre-pigmentar canas frontales.")),
  ];
  return { dia: dia(0), citas, clientas, folio };
}

const CLAVE = "atelier-lart-v1";
function leer(): Estado {
  try {
    const t = localStorage.getItem(CLAVE);
    if (t) {
      const e = JSON.parse(t) as Estado;
      if (e.dia === dia(0) && Array.isArray(e.citas) && Array.isArray(e.clientas)) return e;
    }
  } catch {
    /* sin acceso al guardado: se empieza de nuevo */
  }
  return inicial();
}

export type NuevaCita = { suc: SucId; servicios: ServicioId[]; estilista: string; manos?: string; fecha: string; hora: string; nombre: string; tel: string };

export function useAtelier() {
  const [estado, setEstado] = useState<Estado>(leer);
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {
      /* sin guardado, la demo sigue funcionando */
    }
  }, [estado]);

  const agendar = useCallback(
    (n: NuevaCita) => {
      /* mismo teléfono y mismo nombre: es la misma clienta y se usa su expediente */
      const ya = estado.clientas.find((c) => c.tel === n.tel && c.nombre.toLowerCase() === n.nombre.toLowerCase());
      const clienta: Clienta = ya ?? { id: `c${estado.folio}`, nombre: n.nombre, tel: n.tel, desde: new Date().getFullYear(), base: "Se registra en su primera visita", cuidado: "Se anota durante el diagnóstico en sillón." };
      const cita: Cita = {
        id: `n${estado.folio}`,
        folio: `AL-${estado.folio}`,
        clienta: clienta.id,
        suc: n.suc,
        servicios: n.servicios,
        estilista: n.estilista,
        manos: n.manos,
        fecha: n.fecha,
        hora: n.hora,
        estado: "por-confirmar",
        estacion: "",
        formula: null,
        nueva: true,
      };
      setEstado((e) => ({ ...e, folio: e.folio + 1, clientas: ya ? e.clientas : [...e.clientas, clienta], citas: [...e.citas, cita] }));
      return { cita, clienta };
    },
    [estado.clientas, estado.folio],
  );

  const cambiar = useCallback((id: string, x: Partial<Cita>) => setEstado((e) => ({ ...e, citas: e.citas.map((c) => (c.id === id ? { ...c, ...x } : c)) })), []);

  return { citas: estado.citas, clientas: estado.clientas, agendar, cambiar };
}
export type Atelier = ReturnType<typeof useAtelier>;

/* horas libres (cada media hora) en las que quienes atienden no tienen otra cita encima */
export function horasLibres(citas: Cita[], suc: SucId, quienes: string[], fecha: string, dura: number, ignorar = "") {
  const [abre, cierra] = horarioDe(sucursal(suc), fecha);
  const ocupado = citas
    .filter((c) => c.id !== ignorar && c.fecha === fecha && c.estado !== "cancelada" && (quienes.includes(c.estilista) || (c.manos && quienes.includes(c.manos))))
    .map((c) => [aMin(c.hora), aMin(c.hora) + duraDe(c.servicios)]);
  const ahora = new Date();
  const esHoy = fecha === dia(0);
  const libres: string[] = [];
  for (let t = abre * 60; t + dura <= cierra * 60; t += 30) {
    if (esHoy && t <= ahora.getHours() * 60 + ahora.getMinutes() + 30) continue;
    if (ocupado.some(([i, f]) => t < f && t + dura > i)) continue;
    libres.push(aHora(t));
  }
  return libres;
}

/* primera hora disponible de una sucursal, para mostrarla en la portada */
export function proximaHora(citas: Cita[], suc: SucId) {
  for (let n = 0; n < 7; n++) {
    let mejor: { hora: string; quien: Estilista } | null = null;
    for (const e of EQUIPO.filter((x) => x.suc === suc && x.hace.includes("Corte y Styling"))) {
      const [hora] = horasLibres(citas, suc, [e.id], dia(n), 60);
      if (hora && (!mejor || hora < mejor.hora)) mejor = { hora, quien: e };
    }
    if (mejor) return { fecha: dia(n), ...mejor };
  }
  return null;
}

/* el retoque de color más próximo de una clienta, según su última visita de color */
export function retoqueDe(citas: Cita[], clienta: string) {
  const ultima = citas
    .filter((c) => c.clienta === clienta && (c.estado === "completada" || c.estado === "en-sillon") && c.servicios.some((s) => servicio(s).retoque))
    .sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
  if (!ultima) return null;
  const ciclo = Math.min(...ultima.servicios.map((s) => servicio(s).retoque ?? Infinity));
  const toca = aFecha(ultima.fecha);
  toca.setDate(toca.getDate() + ciclo);
  const fecha = iso(toca);
  return { ultima, ciclo, fecha, dias: faltan(fecha) };
}
