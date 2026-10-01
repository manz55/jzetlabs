import gomideliDesk from "@/assets/portfolio/gomideli-desk.jpg";
import gomideliMob from "@/assets/portfolio/gomideli-mob.jpg";
import gomideliFull from "@/assets/portfolio/gomideli-full.jpg";
import efamicDesk from "@/assets/portfolio/efamic-desk.jpg";
import efamicMob from "@/assets/portfolio/efamic-mob.jpg";
import registroDesk from "@/assets/portfolio/proyecto-registro.jpg";
import registroMob from "@/assets/portfolio/registro-login-mob.jpg";
import plomeriaDesk from "@/assets/portfolio/plomeria-danny.jpg";
import coderDesk from "@/assets/portfolio/coder.jpg";

export interface Project {
  id: string;
  name: string;
  kind: string;
  /** frase corta para la etiqueta del cordón y el polaroid */
  tag: string;
  place: string;
  status: string;
  accent: string;
  problem: string;
  built: string;
  result: string;
  stack: string[];
  /** notas que aparecen en el modo rayos X, encima del plano */
  xray: string[];
  desk: string;
  /** captura larga para que la pantalla de la compu haga scroll sola */
  deskTall?: string;
  mob?: string;
  url?: string;
  note?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "gomideli",
    name: "GomiDeli",
    kind: "Tienda en línea + panel",
    tag: "tienda de gomitas",
    place: "Mixco, Zona 3",
    status: "En producción",
    accent: "#ff8a6b",
    problem:
      "Vendían gomitas por mensajes y los pedidos se perdían entre chats. Cambiar un precio era mandarme un audio a mí.",
    built:
      "Una tienda con catálogo, carrito y un checkout cortito. El pedido les cae por WhatsApp y por correo, y tienen su propio panel para cambiar precios, fotos e inventario.",
    result: "Ahora ellos manejan todo desde el cel, sin depender de mí para cada cambio.",
    stack: ["Next.js", "Supabase", "Tailwind", "Framer Motion", "Resend", "Vercel"],
    xray: ["carrito que recuerda tu pedido", "precios validados en el servidor", "panel de admin", "pedido → WhatsApp + correo"],
    desk: gomideliDesk,
    deskTall: gomideliFull,
    mob: gomideliMob,
    url: "https://gomideli-tienda.vercel.app",
  },
  {
    id: "efamic",
    name: "EFAMIC",
    kind: "Sistema interno",
    tag: "marcaje y planilla",
    place: "Empresa metalmecánica",
    status: "En uso diario",
    accent: "#8ce0c3",
    problem:
      "La asistencia se apuntaba en papel y la planilla quincenal se armaba a mano en Excel, con horas extra, IGSS, bonos y descuentos de cada quien.",
    built:
      "Una app donde cada persona marca con su foto y su PIN, aunque no haya señal en la obra. Atrás hay un panel de admin y una planilla que se calcula sola y cuadra con su Excel.",
    result: "Todo el equipo marca desde el cel y la planilla ya no es un dolor de cabeza cada quincena.",
    stack: ["React", "TypeScript", "Supabase", "Cloudflare", "Modo sin internet"],
    xray: ["marca aunque no haya señal", "PIN por persona", "planilla quincenal automática", "respaldos y seguridad revisada"],
    desk: efamicDesk,
    mob: efamicMob,
    note: "Los nombres de la captura son de ejemplo, para cuidar los datos del equipo.",
  },
  {
    id: "registro",
    name: "Maestros de Niños",
    kind: "App de registro",
    tag: "registro de niños",
    place: "Ministerio infantil",
    status: "En uso cada domingo",
    accent: "#c4b5fd",
    problem:
      "El registro de los niños era en hojas, y saber quién faltó o quién llegó con quién era casi imposible.",
    built:
      "Un check-in por equipos y edades, búsqueda por nombre aunque lo escribás mal, reportes de asistencia, fichas de familias y hasta impresión de etiquetas.",
    result: "Los maestros registran en segundos y tienen claro quién vino y quién no.",
    stack: ["React", "TypeScript", "Supabase", "Vercel"],
    xray: ["búsqueda que perdona errores", "grupos por edad", "reportes de ausencias", "etiquetas impresas"],
    desk: registroDesk,
    mob: registroMob,
  },
  {
    id: "plomeria",
    name: "Plomería Danny",
    kind: "Landing page",
    tag: "plomero de confianza",
    place: "Ciudad de Guatemala",
    status: "Lista para clientes",
    accent: "#ffd166",
    problem:
      "Hacía muy buen trabajo pero no tenía nada que enseñar en línea. Todo dependía del boca en boca.",
    built:
      "Una landing oscura con fotos y videos reales de sus trabajos, animaciones al hacer scroll y un botón directo a su WhatsApp.",
    result: "Ya tiene un link que manda a cualquier cliente para que vea lo que hace.",
    stack: ["HTML", "CSS", "JavaScript", "GSAP"],
    xray: ["galería de trabajos reales", "animaciones al hacer scroll", "botón directo a WhatsApp", "carga rápida"],
    desk: plomeriaDesk,
  },
  {
    id: "coder",
    name: "Coder",
    kind: "Asistente de IA",
    tag: "experimento de IA",
    place: "Proyecto del lab",
    status: "Experimento",
    accent: "#d5f05b",
    problem: "Quería un asistente que me escuchara y me respondiera en tiempo real, sin tanto clic.",
    built:
      "Un asistente de voz y texto con memoria. Le podés hablar, escribir o mandar fotos y archivos, y va transcribiendo la plática en vivo.",
    result: "Es mi laboratorio: lo que aprendo aquí después termina en los proyectos de los clientes.",
    stack: ["Gemini", "Supabase", "Node.js", "Web Speech"],
    xray: ["voz en tiempo real", "memoria entre pláticas", "fotos y archivos", "transcripción en vivo"],
    desk: coderDesk,
  },
];
