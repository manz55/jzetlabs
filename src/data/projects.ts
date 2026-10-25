import gomideliDesk from "@/assets/portfolio/gomideli-desk.jpg";
import gomideliMob from "@/assets/portfolio/gomideli-mob.jpg";
import efamicDesk from "@/assets/portfolio/efamic-desk.jpg";
import efamicMob from "@/assets/portfolio/efamic-mob.jpg";
import registroDesk from "@/assets/portfolio/proyecto-registro.jpg";
import plomeriaDesk from "@/assets/portfolio/plomeria-danny.jpg";
import coderDesk from "@/assets/portfolio/coder.jpg";

export interface PuntoRayos {
  /** posición en % sobre la captura */
  x: number;
  y: number;
  titulo: string;
  texto: string;
}

export interface Project {
  id: string;
  name: string;
  kind: string;
  tag: string;
  place: string;
  status: string;
  accent: string;
  /** cómo era antes, en una línea */
  antes: string;
  problem: string;
  built: string;
  result: string;
  rayos: PuntoRayos[];
  desk: string;
  mob?: string;
  url?: string;
  note?: string;
  /** sale con cordón en "El taller" */
  taller: boolean;
  /** proyecto mío (no de cliente): no cuenta en "proyectos entregados" */
  personal?: boolean;
  /** el lado "ahora" del deslizador enseña su panel de admin con datos de prueba */
  panel?: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: "gomideli",
    name: "GomiDeli",
    kind: "Tienda en línea",
    tag: "tienda de gomitas",
    place: "Mixco, Zona 3",
    status: "En línea",
    accent: "#ff8a6b",
    antes: "Pedidos por chat, perdidos entre mensajes",
    problem: "Vendían gomitas por mensajes y los pedidos se perdían entre chats. Cambiar un precio era mandarme un audio.",
    built: "Una tienda con catálogo, carrito y checkout cortito. El pedido les cae por WhatsApp y correo, y tienen su panel para cambiar precios, fotos e inventario.",
    result: "Ahora manejan todo desde el cel, sin depender de mí.",
    rayos: [
      { x: 30, y: 40, titulo: "El carrito", texto: "Recuerda tu pedido aunque cierres la página." },
      { x: 72, y: 30, titulo: "El panel", texto: "Ellos cambian precios y fotos sin llamarme." },
      { x: 50, y: 78, titulo: "El pedido", texto: "Llega solito por WhatsApp y por correo." },
    ],
    desk: gomideliDesk,
    mob: gomideliMob,
    url: "https://gomideli-tienda.vercel.app",
    taller: true,
    panel: true,
  },
  {
    id: "efamic",
    name: "EFAMIC",
    kind: "Sistema interno",
    tag: "marcaje y planilla",
    place: "Empresa metalmecánica",
    status: "En uso diario",
    accent: "#8ce0c3",
    antes: "Asistencia en hoja de papel y planilla a mano",
    problem: "La asistencia se apuntaba en papel y la planilla quincenal se armaba a mano en Excel.",
    built: "Una app donde cada persona marca con su foto y su PIN, aunque no haya señal en la obra. Atrás, un panel y una planilla que se calcula sola.",
    result: "Todo el equipo marca desde el cel y la planilla ya no es un dolor de cabeza.",
    rayos: [
      { x: 50, y: 22, titulo: "Sin señal", texto: "El marcaje se guarda en el cel y sube cuando vuelve el internet." },
      { x: 28, y: 55, titulo: "Foto + PIN", texto: "Cada quien marca solo por sí mismo." },
      { x: 72, y: 72, titulo: "La planilla", texto: "Horas extra, IGSS y bonos se calculan solos." },
    ],
    desk: efamicDesk,
    mob: efamicMob,
    note: "Los nombres de la captura son de ejemplo, para cuidar los datos del equipo.",
    taller: true,
    panel: true,
  },
  {
    id: "registro",
    name: "Maestros de Niños",
    kind: "App de registro",
    tag: "registro de niños",
    place: "Ministerio infantil",
    status: "En uso cada domingo",
    accent: "#c4b5fd",
    antes: "Lista en hojas, sin saber quién faltó",
    problem: "El registro de los niños era en hojas, y saber quién faltó era casi imposible.",
    built: "Check-in por equipos y edades, búsqueda que perdona errores, reportes de asistencia, fichas de familias y etiquetas impresas.",
    result: "Los maestros registran en segundos y la app avisa cuando un niño deja de venir.",
    rayos: [
      { x: 50, y: 30, titulo: "La búsqueda", texto: "Escribes \"jose najra\" y encuentra a José Nájera." },
      { x: 30, y: 60, titulo: "Por edades", texto: "Cada niño cae en su grupo solito." },
      { x: 72, y: 82, titulo: "Avisos", texto: "\"¿Y Mateo? Ya van 3 domingos.\"" },
    ],
    desk: registroDesk,
    taller: true,
    panel: true,
  },
  {
    id: "plomeria",
    name: "Plomería Danny",
    kind: "Landing page",
    tag: "plomero de confianza",
    place: "Ciudad de Guatemala",
    status: "Lista",
    accent: "#ffd166",
    antes: "Solo de boca en boca",
    problem: "Hacía muy buen trabajo pero no tenía nada que enseñar en línea.",
    built: "Una landing con fotos y videos reales de sus trabajos y un botón directo a WhatsApp.",
    result: "Ya tiene un link que manda a cualquier cliente.",
    rayos: [
      { x: 30, y: 35, titulo: "Fotos reales", texto: "Sus trabajos de verdad, no fotos de internet." },
      { x: 70, y: 55, titulo: "Al hacer scroll", texto: "Cada sección aparece justo cuando llegas." },
      { x: 40, y: 80, titulo: "WhatsApp", texto: "Un toque y el cliente ya le está escribiendo." },
    ],
    desk: plomeriaDesk,
    taller: true,
  },
  {
    id: "coder",
    name: "Coder",
    kind: "Asistente de IA",
    tag: "mi laboratorio",
    place: "Proyecto propio",
    status: "Experimento",
    accent: "#d5f05b",
    antes: "Mil clics para pedir algo",
    problem: "Quería un asistente que me escuchara y me respondiera en tiempo real, sin tanto clic.",
    built: "Un asistente de voz y texto con memoria. Le puedes hablar, escribir o mandar fotos y archivos.",
    result: "Es mi laboratorio: lo que aprendo aquí termina en los proyectos de mis clientes.",
    rayos: [
      { x: 50, y: 30, titulo: "Voz", texto: "Le hablas y te contesta en tiempo real." },
      { x: 30, y: 65, titulo: "Memoria", texto: "Se acuerda de lo que le contaste otro día." },
      { x: 70, y: 75, titulo: "Fotos y archivos", texto: "Le mandas una foto y te dice qué ve." },
    ],
    desk: coderDesk,
    taller: true,
    personal: true,
  },
];

export const TALLER = PROJECTS.filter((p) => p.taller);
export const CLIENTES = PROJECTS.filter((p) => !p.personal);
