/*
 * "¿Qué problema tiene su negocio?": pestañas por rubro.
 * Cada pestaña: el problema de hoy, lo que hace el sistema, una captura de la demo
 * (datos de prueba) y el enlace para probarla. Teclado: flechas, Inicio y Fin.
 */
import { useRef, useState, type KeyboardEvent } from "react";
import { Building2, Dumbbell, MessageCircle, PartyPopper, Sparkles, Stethoscope, Store } from "lucide-react";
import clinicaPanel from "@/assets/demos/clinica-panel.jpg";
import gimnasio from "@/assets/demo-gimnasio/sentadilla.jpg";
import tienda from "@/assets/demos/tienda-dueno.jpg";
import marcaje from "@/assets/sistema/obra-cuadrilla.jpg";
// fotos libres de Unsplash (licencia Unsplash): photo-1624353656309, photo-1621996346565, photo-1623718649591
import fotoRopa from "@/assets/demos/ropa.jpg";
import fotoComida from "@/assets/demos/comida.jpg";
import fotoResort from "@/assets/demos/resort.jpg";
import fotoCosmeticos from "@/assets/demo-cosmeticos/kit.jpg";
import fotoCelulares from "@/assets/demo-celulares/ip17promax.jpg";
import fotoPerfil from "@/assets/demo-cosmeticos/maquillista.jpg";
import fotoBoutique from "@/assets/demo-lujo/percha.jpg";
import fotoSalon from "@/assets/demo-cosmeticos/estudio.jpg";
import fotoDistribuidora from "@/assets/demo-distribuidora/bodega.jpg";
import fotoEventos from "@/assets/demo-eventos/carpa.jpg";
import fotoDental from "@/assets/demo-clinica/paciente.jpg";
import fotoPediatria from "@/assets/demo-pediatria/examen.jpg";
import fotoMedicina from "@/assets/demo-medicina/presion.jpg";
import fotoVeterinaria from "@/assets/demo-veterinaria/hero.jpg";
import fotoOftalmologia from "@/assets/demos/oftalmologia-pagina.jpg";
import fotoTaller from "@/assets/demos/taller-pagina.jpg";
import { whatsappLink } from "@/data/site";
import { Titulo } from "./Titulo";

const DEMOS = "https://latienda-jzetlabs.vercel.app/";

/* Belleza y Tiendas tienen tipos de negocio: cada uno cambia el antes y después y lo que se ve a la derecha */
type Variante = {
  id: string;
  nombre: string;
  foto: string;
  problema: string;
  hoy: string[];
  sistema: string[];
  visual: "foto" | "planes";
  miniatura?: boolean;
  demo: { texto: string; tipo: string };
  panel?: { texto: string; href: string };
};

/* Belleza y moda: consultoras, cosméticos, ropa y boutique */
const VARIANTES_BELLEZA: Variante[] = [
  {
    id: "perfil",
    nombre: "Consultoras",
    foto: fotoPerfil,
    problema: "La hoja de la clienta nadie la vuelve a ver.",
    hoy: ["Hoja de papel con casillas chiquitas.", "Cumpleaños y tonos en un fólder."],
    sistema: ["La clienta responde desde su teléfono.", "Usted la ve ordenada por WhatsApp.", "Sabe quién cumple años este mes."],
    visual: "foto",
    demo: { texto: "Ver la página", tipo: "perfil" },
  },
  {
    id: "ropa",
    nombre: "Ropa",
    foto: fotoRopa,
    problema: "Todo el día: ¿precio? ¿qué talla?",
    hoy: ["Precio “por inbox”, prenda por prenda.", "Apartados anotados en el chat."],
    sistema: ["Catálogo con tallas y precios.", "El pedido le llega armado.", "Sabe qué talla se le acabó."],
    visual: "foto",
    demo: { texto: "Ver la página", tipo: "ropa" },
  },
  {
    id: "cosmeticos",
    nombre: "Cosméticos",
    foto: fotoCosmeticos,
    problema: "Todo el día: ¿precio? ¿qué tono me queda?",
    hoy: ["Cada pedido es una charla larga.", "Cursos apartados uno por uno."],
    sistema: ["Precio y tono a la vista.", "La clienta encuentra su tono sola.", "Cursos con cupo y pedidos por WhatsApp."],
    visual: "foto",
    demo: { texto: "Ver la página", tipo: "cosmeticos" },
  },
  {
    id: "salon",
    nombre: "Salones",
    foto: fotoSalon,
    problema: "Cada sucursal agenda por su WhatsApp.",
    hoy: ["Las citas se cruzan.", "Nadie recuerda el retoque."],
    sistema: ["La clienta escoge su hora sola.", "Recordatorio un día antes.", "Agenda por estilista."],
    visual: "foto",
    demo: { texto: "Ver la página", tipo: "salon" },
  },
  {
    id: "boutique",
    nombre: "Boutique",
    foto: fotoBoutique,
    problema: "Apartados y consignaciones en el chat.",
    hoy: ["Cada pieza se aparta por mensaje.", "Los abonos, en un cuaderno."],
    sistema: ["Cada pieza con foto y precio.", "Apartados con fecha límite.", "Cuentas claras con quien consigna."],
    visual: "foto",
    demo: { texto: "Ver la página", tipo: "boutique" },
  },
];

const VARIANTES_TIENDA: Variante[] = [
  {
    id: "celulares",
    nombre: "Celulares",
    foto: fotoCelulares,
    problema: "¿Precio? ¿Hay en azul? ¿Ya salió?",
    hoy: ["El catálogo dura 24 horas.", "El stock, en un cuaderno."],
    sistema: ["Tienda con carrito y cuotas.", "El cliente sigue su pedido.", "Usted ve ventas y stock."],
    visual: "foto",
    demo: { texto: "Ver la página", tipo: "celulares" },
  },
  {
    id: "comida",
    nombre: "Comida",
    foto: fotoComida,
    problema: "Pedidos por mensaje, y alguno sale mal.",
    hoy: ["Menú viejo, precios que cambiaron.", "Pedidos anotados a mano."],
    sistema: ["Menú en línea con precios al día.", "Pedido completo, con dirección.", "Cocina con reloj por pedido."],
    visual: "foto",
    demo: { texto: "Ver la página", tipo: "restaurante" },
  },
  {
    id: "tiempos",
    nombre: "Tiempos compartidos",
    foto: fotoResort,
    problema: "Explicar planes por chat toma horas.",
    hoy: ["Planes en PDF y audios.", "Semanas apartadas en un Excel."],
    sistema: ["Planes claros.", "Semanas libres a la vista.", "Recordatorio de pago."],
    visual: "planes",
    demo: { texto: "Ver la página", tipo: "tiempo" },
  },
];

/* Empresas: cada tipo de empresa con su propia demo */
const VARIANTES_EMPRESAS: Variante[] = [
  {
    id: "distribuidora",
    nombre: "Distribuidora",
    foto: fotoDistribuidora,
    problema: "Pedidos por llamada y cobros que no cuadran.",
    hoy: ["El pedido se apunta mal.", "Nadie sabe quién debe."],
    sistema: ["La tienda pide desde su teléfono.", "El piloto marca lo entregado.", "La oficina ve créditos y bodega."],
    visual: "foto",
    demo: { texto: "Ver la página", tipo: "distribuidora" },
    panel: { texto: "Ver el panel", href: "/demos/distribuidora/#oficina" },
  },
  {
    id: "personal",
    nombre: "Personal y planilla",
    foto: marcaje,
    problema: "La planilla a mano toma días.",
    hoy: ["Asistencia en papel y WhatsApp.", "Horas extra sumadas a mano."],
    sistema: ["Ve quién llegó y quién faltó.", "La planilla sale sola.", "Las boletas quedan listas."],
    visual: "foto",
    demo: { texto: "Ver la página", tipo: "asistencia" },
    panel: { texto: "Ver el panel", href: "/demos/planilla/#empleado" },
  },
  {
    id: "taller",
    nombre: "Taller mecánico",
    foto: fotoTaller,
    problema: "¿Cuánto cuesta? ¿Ya está mi carro?",
    hoy: ["Precio: “venga y vemos”.", "El cliente llama para preguntar."],
    sistema: ["Precio por WhatsApp.", "Con su placa ve su carro.", "El taller avisa en cada paso."],
    visual: "foto",
    miniatura: true,
    demo: { texto: "Ver la página", tipo: "taller" },
    panel: { texto: "Ver el panel", href: "/demos/taller/#taller" },
  },
];

/* Clínicas: dental, niños y adultos, cada una con lo suyo */
const VARIANTES_CLINICAS: Variante[] = [
  {
    id: "dental",
    nombre: "Dental",
    foto: fotoDental,
    problema: "Citas que se olvidan.",
    hoy: ["Agenda en un cuaderno.", "El paciente no llega."],
    sistema: ["Aparta su cita desde el teléfono.", "Recordatorio por WhatsApp.", "Usted ve el día completo."],
    visual: "foto",
    demo: { texto: "Ver la página", tipo: "clinica" },
    panel: { texto: "Ver el panel", href: "/demos/clinica/#panel" },
  },
  {
    id: "pediatria",
    nombre: "Pediatría",
    foto: fotoPediatria,
    problema: "¿Qué vacuna le toca?",
    hoy: ["Carné de papel que se pierde.", "Vacunas atrasadas sin aviso."],
    sistema: ["La mamá ve qué vacuna toca.", "Curva de peso en su teléfono.", "Usted ve a quién llamar."],
    visual: "foto",
    demo: { texto: "Ver la página", tipo: "pediatria" },
    panel: { texto: "Ver el panel", href: "/demos/pediatria/#consultorio" },
  },
  {
    id: "medicina",
    nombre: "Medicina general",
    foto: fotoMedicina,
    problema: "Pacientes crónicos que vienen ya mal.",
    hoy: ["Presión anotada en un cuaderno.", "Cita solo para la receta."],
    sistema: ["Anotan su presión desde el teléfono.", "Piden su receta en línea.", "Usted ve primero a los altos."],
    visual: "foto",
    demo: { texto: "Ver la página", tipo: "medicina" },
    panel: { texto: "Ver el panel", href: "/demos/medicina/#consultorio" },
  },
  {
    id: "oftalmologia",
    nombre: "Oftalmología",
    foto: fotoOftalmologia,
    problema: "Citas que no se respetan.",
    hoy: ["Esperan horas sin saber.", "Nadie avisa el retraso."],
    sistema: ["Ve su turno y su hora.", "Un toque avisa el retraso.", "Las reseñas tienen respuesta."],
    visual: "foto",
    miniatura: true,
    demo: { texto: "Ver la página", tipo: "oftalmologia" },
    panel: { texto: "Ver el panel", href: "/demos/oftalmologia/#recepcion" },
  },
  {
    id: "veterinaria",
    nombre: "Veterinaria",
    foto: fotoVeterinaria,
    problema: "¿Es urgencia o puede esperar?",
    hoy: ["El teléfono ocupado todo el día.", "Carné de cartón que se pierde."],
    sistema: ["El dueño marca síntomas y ve qué hacer.", "Carné de vacunas en el teléfono.", "Usted ve internados y vacunas."],
    visual: "foto",
    demo: { texto: "Ver la página", tipo: "veterinaria" },
    panel: { texto: "Ver el panel", href: "/demos/veterinaria/#clinica" },
  },
];

const VARIANTES: Record<string, Variante[]> = { belleza: VARIANTES_BELLEZA, tiendas: VARIANTES_TIENDA, empresas: VARIANTES_EMPRESAS, clinicas: VARIANTES_CLINICAS };


/* Cada rubro: su icono para el mosaico */
const ICONO_RUBRO: Record<string, typeof Store> = { empresas: Building2, clinicas: Stethoscope, gimnasios: Dumbbell, belleza: Sparkles, tiendas: Store, eventos: PartyPopper };

/* Cómo se ve el panel de cada demo: su nombre, sus colores y su letra (cada negocio tiene el suyo) */
const PANEL_INFO: Record<string, { n: string; c: string[]; f: string }> = {
  clinica: { n: "Panel de Clínica Aurora", c: ["#0f2a43", "#1f6fb2", "#f0634a"], f: "Outfit" },
  pediatria: { n: "Panel de Pediatría Semillita", c: ["#17365d", "#f26b4f", "#7cbf3a"], f: "Baloo 2" },
  medicina: { n: "Panel del Dr. Samayoa", c: ["#1d4a42", "#c47f26", "#f6f4ec"], f: "Lora" },
  oftalmologia: { n: "Panel de Lumen", c: ["#0b2545", "#0f7f8c", "#d9503f"], f: "Fraunces" },
  veterinaria: { n: "Panel de Huesitos", c: ["#12312b", "#c98a14", "#fbf8ee"], f: "Young Serif" },
  perfil: { n: "Panel de la consultora", c: ["#7a2e5c", "#f7cfbd", "#2a1633"], f: "DM Serif Display" },
  ropa: { n: "Panel de Nómada Studio", c: ["#2f3a22", "#b5532f", "#efe6d6"], f: "Archivo Black" },
  cosmeticos: { n: "Panel de Ámbar", c: ["#3b241b", "#d98a2b", "#f3d3cb"], f: "Playfair Display" },
  salon: { n: "Panel de Lirio Salón", c: ["#4a1d3f", "#b88a3c", "#f3dde0"], f: "Bodoni Moda" },
  boutique: { n: "Panel de Maison Solène", c: ["#14110f", "#8c6a35", "#f6f1e7"], f: "Cormorant Garamond" },
  celulares: { n: "Panel de Órbita", c: ["#1c1230", "#6d28d9", "#b8f23a"], f: "Space Grotesk" },
  restaurante: { n: "Panel de Trattoria Sole", c: ["#1d1512", "#c4352a", "#fbf1d8"], f: "Playfair Display" },
  tiempo: { n: "Panel de Costa Serena", c: ["#0b3a4a", "#12a3a8", "#ef6f4f"], f: "Cormorant Garamond" },
  distribuidora: { n: "Panel de El Volcán", c: ["#1a1a1c", "#b3261e", "#f4ead7"], f: "Archivo Narrow" },
  asistencia: { n: "Panel de Los Cedros", c: ["#2b2f33", "#ff7a1a", "#f4f5f7"], f: "Archivo" },
  taller: { n: "Panel de Taller Torque", c: ["#15171c", "#ffc21a", "#e9ecef"], f: "Barlow Condensed" },
  gimnasios: { n: "Panel de Spartan Force", c: ["#16181a", "#f2c230", "#2e9b57"], f: "Big Shoulders Display" },
  eventos: { n: "Panel de La Ceiba", c: ["#1a275c", "#d6457a", "#efb22e"], f: "Fraunces" },
};

const RUTA_DEMO: Record<string, string> = { distribuidora: "/demos/distribuidora/", asistencia: "/demos/planilla/", clinica: "/demos/clinica/", pediatria: "/demos/pediatria/", medicina: "/demos/medicina/", perfil: "/demos/perfil-belleza/", salon: "/demos/salon/", boutique: "/demos/boutique/", ropa: "/demos/ropa/", cosmeticos: "/demos/cosmeticos/", celulares: "/demos/celulares/", restaurante: "/demos/restaurante/", tiempo: "/demos/tiempo-compartido/", oftalmologia: "/demos/oftalmologia/", veterinaria: "/demos/veterinaria/", taller: "/demos/taller/" };

/* Tipos de negocio: tarjetas que se ven claramente como opciones para escoger */
function TarjetasFoco({ variantes, elegida, alElegir }: { variantes: Variante[]; elegida: number; alElegir: (i: number) => void }) {
  const columnas = variantes.length === 2 ? "sm:grid-cols-2" : variantes.length === 3 ? "sm:grid-cols-3" : variantes.length === 4 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className="md:col-span-2">
      <p className="font-semibold text-tinta">
        Escoja el suyo
      </p>
      <div className={`mt-3 grid gap-2.5 ${columnas}`} role="radiogroup" aria-label="Tipo de negocio">
        {variantes.map((v, i) => {
          const activa = i === elegida;
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={activa}
              onClick={() => alElegir(i)}
              className={`flex items-center gap-3 rounded-xl border bg-blanco p-2.5 pr-3.5 text-left transition active:scale-[0.99] ${activa ? "border-acento shadow-[0_0_0_2px_var(--color-acento)]" : "border-linea hover:border-tinta/30"}`}
            >
              <img src={v.foto} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" loading="lazy" />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-tight text-tinta">{v.nombre}</span>
                <span className="mt-0.5 block text-[0.8rem] leading-snug text-suave line-clamp-2">{v.problema}</span>
              </span>
              <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${activa ? "border-acento" : "border-linea"}`}>
                {activa && <span className="h-2.5 w-2.5 rounded-full bg-acento" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Dos planes de ejemplo para tiempos compartidos (datos de prueba) */
function PlanesEjemplo() {
  const planes = [
    { nombre: "Semana flexible", nota: "Una semana al año, en temporada baja.", precio: "Q4,500", incluye: ["1 semana al año", "Hasta 4 personas", "Piscina y áreas comunes"] },
    { nombre: "Todo el año", nota: "Dos semanas, una en temporada alta.", precio: "Q8,900", incluye: ["2 semanas al año", "Temporada alta incluida", "Hasta 6 personas", "Prioridad para apartar"], destacado: true },
  ];
  return (
    <div className="w-full max-w-[420px] rounded-2xl bg-noche text-white p-4 sm:p-5 shadow-lg">
      <p className="text-center font-[family-name:var(--font-titulo)] font-bold text-[1.15rem]">Dos planes. Sin sorpresas.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {planes.map((p) => (
          <div key={p.nombre} className={`relative rounded-xl p-3 ${p.destacado ? "border border-white/40 bg-white/[0.07]" : "border border-white/10"}`}>
            {p.destacado && <span className="absolute -top-2.5 left-3 rounded-full bg-white px-2 py-0.5 text-[0.6rem] font-semibold tracking-wider text-noche">RECOMENDADO</span>}
            <p className="font-semibold text-[0.95rem]">{p.nombre}</p>
            <p className="mt-0.5 text-[0.7rem] text-white/60 leading-snug">{p.nota}</p>
            <p className="mt-3 font-[family-name:var(--font-titulo)] font-bold text-[1.35rem] leading-none">
              {p.precio} <span className="text-[0.65rem] font-normal text-white/60">al año</span>
            </p>
            <ul className="mt-3 space-y-1 text-[0.7rem] text-white/85">
              {p.incluye.map((x) => (
                <li key={x}>✓ {x}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

type Rubro = {
  id: string;
  nombre: string;
  problema: string;
  hoy: string[];
  sistema: string[];
  img: string;
  alt: string;
  demo?: { texto: string; href: string };
  demo2?: { texto: string; href: string };
  nota?: string;
};

const RUBROS: Rubro[] = [
  {
    id: "empresas",
    nombre: "Empresas",
    problema: "Armar la planilla a mano se lleva días, y siempre falta un dato.",
    hoy: ["La asistencia anda entre papel, Excel y mensajes de WhatsApp.", "Se le van días enteros sumando horas extra, séptimo e IGSS."],
    sistema: [
      "Usted ve dónde está cada quien, quién faltó y cuánto se debe de prestaciones.",
      "La planilla sale sola y las boletas ya quedan listas.",
      "Caja chica y viáticos, todo en el mismo lugar.",
    ],
    img: marcaje,
    alt: "Cuadrilla de trabajadores en una obra",
    demo: { texto: "Ver el panel de la oficina", href: "/demos/planilla/" }, demo2: { texto: "Ver el portal del empleado", href: "/demos/planilla/#empleado" },
  },
  {
    id: "clinicas",
    nombre: "Clínicas y dentistas",
    problema: "Citas que se olvidan y horas que se quedan vacías.",
    hoy: ["La agenda vive en un cuaderno o en el teléfono de recepción.", "El paciente no llega porque nadie le recordó."],
    sistema: [
      "Cada doctor ve su agenda y las citas que faltan por confirmar.",
      "El paciente aparta su cita él mismo y le aparece a recepción.",
      "El expediente de cada paciente, hecho a la medida de su clínica.",
    ],
    img: clinicaPanel,
    alt: "Panel de una clínica dental de prueba con las citas del día por doctor",
    demo: { texto: "Ver el sistema de la clínica", href: "/demos/clinica/#panel" },
    demo2: { texto: "Ver la página de pacientes", href: "/demos/clinica/" },
  },
  {
    id: "gimnasios",
    nombre: "Gimnasios",
    problema: "Membresías vencidas que nadie cobra.",
    hoy: ["Socios en una libreta.", "No se sabe quién debe."],
    sistema: ["Ve quién va entrando.", "Le avisa qué vence.", "Cobros del mes de un vistazo."],
    img: gimnasio,
    alt: "Socia entrenando con la barra en el gimnasio",
    demo: { texto: "Ver el panel", href: "/demos/gimnasio/#recepcion" },
    demo2: { texto: "Ver la página", href: "/demos/gimnasio/" },
  },
  {
    id: "belleza",
    nombre: "Belleza y moda",
    problema: "",
    hoy: [],
    sistema: [],
    img: fotoPerfil,
    alt: "",
  },
  {
    id: "tiendas",
    nombre: "Tiendas",
    problema: "No sabe bien cuánto vendió ni qué se le está acabando.",
    hoy: ["Los pedidos andan regados entre WhatsApp, llamadas y el mostrador.", "El inventario se cuenta a mano, y siempre tarde."],
    sistema: [
      "Todos los pedidos le llegan a un solo lugar.",
      "Ve cuánto vendió, su ticket promedio y lo que más sale.",
      "Sabe qué tiene y qué le falta antes de quedarse sin nada.",
    ],
    img: tienda,
    alt: "Resumen de una tienda de prueba con ventas y pedidos por atender",
    demo: { texto: "Ver la tienda en línea", href: `${DEMOS}tienda/cliente.html` },
  },
  {
    id: "eventos",
    nombre: "Eventos",
    problema: "¿Tiene libre el 14? Y cotizar toma la tarde.",
    hoy: ["Calendario en un cuaderno.", "Sillas que no regresan."],
    sistema: ["El cliente ve si la fecha está libre.", "Aparta con anticipo.", "La bodega ve qué cargar."],
    img: fotoEventos,
    alt: "Toldo blanco montado para una recepción",
    demo: { texto: "Ver la página", href: "/demos/eventos/" },
    demo2: { texto: "Ver el panel", href: "/demos/eventos/#bodega" },
    nota: "Foto de ejemplo.",
  },
];

export function Rubros() {
  const [activo, setActivo] = useState(0);
  const [tipo, setTipo] = useState(0); // tipo de tienda elegido
  const botones = useRef<(HTMLButtonElement | null)[]>([]);
  const lista = useRef<HTMLDivElement>(null);

  const r = RUBROS[activo];
  const variantes = VARIANTES[r.id];
  const v = variantes ? variantes[Math.min(tipo, variantes.length - 1)] : null;
  const problema = v?.problema ?? r.problema;
  const hoy = v?.hoy ?? r.hoy;
  const sistema = v?.sistema ?? r.sistema;

  function teclas(e: KeyboardEvent) {
    const ult = RUBROS.length - 1;
    let n = activo;
    if (e.key === "ArrowRight") n = activo === ult ? 0 : activo + 1;
    else if (e.key === "ArrowLeft") n = activo === 0 ? ult : activo - 1;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = ult;
    else return;
    e.preventDefault();
    setActivo(n);
    setTipo(0);
    botones.current[n]?.focus();
  }

  return (
    <section id="rubros" className="py-20 sm:py-28 bg-blanco" aria-labelledby="rubros-titulo">
      <div className="contenedor">
        <div className="max-w-3xl aparece">
          <Titulo id="rubros-titulo" antes="Véalo" acento="funcionando" />
          <p className="mt-4 text-suave text-[1.05rem]">Escoja su negocio y pruébelo.</p>
        </div>

        <p className="mt-8 text-[1.15rem] font-semibold text-tinta aparece">¿Qué tipo de negocio tiene?</p>
        <p className="mt-1 text-suave aparece">Toque el suyo. Vea la página y el panel.</p>
        <div
          ref={lista}
          role="tablist"
          aria-label="Rubros"
          onKeyDown={teclas}
          className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        >
          {RUBROS.map((x, i) => {
            const Icono = ICONO_RUBRO[x.id] ?? Store;
            const cuenta = VARIANTES[x.id]?.length ?? 1;
            const activa = i === activo;
            return (
              <button
                key={x.id}
                ref={(el) => {
                  botones.current[i] = el;
                }}
                role="tab"
                id={`tab-${x.id}`}
                aria-selected={activa}
                aria-controls={`panel-${x.id}`}
                tabIndex={activa ? 0 : -1}
                onClick={() => {
                  setActivo(i);
                  setTipo(0);
                }}
                className={`flex min-h-[7.5rem] flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left transition active:scale-[0.98] ${activa ? "border-acento bg-acento text-white shadow-lg" : "border-linea bg-blanco text-tinta hover:border-tinta/40 hover:shadow-md"}`}
              >
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${activa ? "bg-white/20" : "bg-acento/10 text-acento"}`}><Icono size={22} aria-hidden /></span>
                <span className="text-[1.05rem] font-semibold leading-tight">{x.nombre}</span>
                <span className={`text-[0.82rem] ${activa ? "text-white/80" : "text-suave"}`}>{cuenta} {cuenta === 1 ? "demo" : "demos"}</span>
              </button>
            );
          })}
        </div>
        <a href={whatsappLink("Hola, Joshua. Mi negocio es de ____ y no lo veo en la lista. ¿Me puede armar una demo?")} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 font-semibold text-acento underline underline-offset-4">
          <MessageCircle size={17} aria-hidden /> ¿No ve su rubro? Cuénteme cuál es y le armo la demo
        </a>

        <div
          key={r.id}
          role="tabpanel"
          id={`panel-${r.id}`}
          aria-labelledby={`tab-${r.id}`}
          className="panel-rubro mt-6 grid md:grid-cols-[1.4fr_1fr] gap-8 md:gap-12 items-center rounded-2xl border border-linea portada-papel p-6 sm:p-10"
        >
          {variantes && v && <TarjetasFoco variantes={variantes} elegida={variantes.indexOf(v)} alElegir={setTipo} />}
          <div key={v?.id}>
            <h3 className="text-[1.5rem] sm:text-[1.9rem]">{problema}</h3>
            <div className="mt-6 grid sm:grid-cols-2 gap-6">
              <div>
                <p className="nota-mano text-[1.6rem] text-suave">Antes, a mano…</p>
                <ul className="mt-2 space-y-2">
                  {hoy.map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <span aria-hidden className="mt-[0.7em] h-0.5 w-3 shrink-0 bg-suave/60" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="nota-mano text-[1.6rem] text-mano">Ya con su sistema</p>
                <ul className="mt-2 space-y-2">
                  {sistema.map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <span aria-hidden className="mt-[0.45em] h-2 w-3.5 shrink-0 -rotate-45 border-b-2 border-l-2 border-acento" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {(() => {
              const info = PANEL_INFO[v?.demo.tipo ?? r.id];
              if (!info) return null;
              return (
                <p className="mt-7 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-linea bg-blanco px-4 py-2.5 text-[0.92rem]">
                  <span className="flex gap-1" aria-hidden>{info.c.map((c) => <span key={c} className="h-5 w-5 rounded-full border border-black/10" style={{ background: c }} />)}</span>
                  <span><b>{info.n}</b></span>
                  <span className="text-suave">Tipografía: {info.f}</span>
                </p>
              );
            })()}
            <p className="mt-4 text-[0.95rem] text-suave">Todo es de ejemplo. Toque lo que quiera.</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {v ? (
                <>
                  <a href={RUTA_DEMO[v.demo.tipo]} target="_blank" rel="noopener" className="btn btn-principal">
                    {v.demo.texto}
                  </a>
                  {v.panel && (
                    <a href={v.panel.href} target="_blank" rel="noopener" className="btn btn-secundario">
                      {v.panel.texto}
                    </a>
                  )}
                </>
              ) : r.demo ? (
                <>
                  <a href={r.demo.href} target="_blank" rel="noopener noreferrer" className="btn btn-principal">
                    {r.demo.texto}
                  </a>
                  {r.demo2 && (
                    <a href={r.demo2.href} target="_blank" rel="noopener noreferrer" className="btn btn-secundario">
                      {r.demo2.texto}
                    </a>
                  )}
                </>
              ) : (
                <a
                  href={whatsappLink(`Hola, Joshua. Me interesa el sistema para ${r.nombre.toLowerCase()}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-principal"
                >
                  Pregunte por su evento
                </a>
              )}
            </div>
          </div>

          {v && v.visual === "planes" ? (
            <figure className="justify-self-center w-full flex flex-col items-center">
              <PlanesEjemplo />
              <figcaption className="mt-3 text-center text-xs text-suave">Planes y precios de ejemplo.</figcaption>
            </figure>
          ) : v ? (
            <figure className="justify-self-center">
              <img src={v.foto} alt={`Foto de ejemplo: ${v.nombre.toLowerCase()}`} className="w-[230px] sm:w-[270px] aspect-[4/5] object-cover rounded-[1.4rem] shadow-lg" loading="lazy" />
              <figcaption className="mt-3 max-w-[270px] text-center text-xs text-suave">{v.miniatura ? "Así se ve la página." : "Foto de ejemplo."}</figcaption>
            </figure>
          ) : (
          <figure className="justify-self-center">
            <img
              src={r.img}
              alt={r.alt}
              width={375}
              height={812}
              className="w-[220px] sm:w-[250px] rounded-[1.6rem] border-[6px] border-marino shadow-lg"
              loading="lazy"
            />
            <figcaption className="mt-3 max-w-[250px] text-center text-xs text-suave">{r.nota ?? "Ejemplo."}</figcaption>
          </figure>
          )}
        </div>
      </div>
    </section>
  );
}
