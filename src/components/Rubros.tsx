/*
 * "¿Qué problema tiene su negocio?": pestañas por rubro.
 * Cada pestaña: el problema de hoy, lo que hace el sistema, una captura de la demo
 * (datos de prueba) y el enlace para probarla. Teclado: flechas, Inicio y Fin.
 */
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import clinicaPanel from "@/assets/demos/clinica-panel.jpg";
import gimnasio from "@/assets/demo-gimnasio/sentadilla.jpg";
import tienda from "@/assets/demos/tienda-dueno.jpg";
import marcaje from "@/assets/sistema/cel-marcaje.jpg";
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
  demo: { texto: string; tipo: string };
  panel?: { texto: string; href: string };
};

/* Belleza y moda: consultoras, cosméticos, ropa y boutique */
const VARIANTES_BELLEZA: Variante[] = [
  {
    id: "perfil",
    nombre: "Consultoras",
    foto: fotoPerfil,
    problema: "La hoja de perfil de la clienta confunde, y al final nadie la vuelve a ver.",
    hoy: ["La clienta llena una hoja de papel con casillas chiquitas.", "Cumpleaños, tonos y amigas recomendadas se quedan en un fólder."],
    sistema: ["La clienta responde en su teléfono, una pregunta a la vez y con letra grande.", "Su perfil le llega ordenado por WhatsApp.", "Usted ve sus clientas, los cumpleaños del mes y a quién ofrecerle un facial."],
    visual: "foto",
    demo: { texto: "Ver el cuestionario de la clienta", tipo: "perfil" },
  },
  {
    id: "ropa",
    nombre: "Ropa",
    foto: fotoRopa,
    problema: "Le preguntan talla y precio por DM, prenda por prenda.",
    hoy: ["Fotos en Instagram y el precio “por inbox”.", "Apartados y pagos anotados en el chat, y ahí se pierden."],
    sistema: ["Catálogo con tallas, colores y precios a la vista.", "El cliente arma su pedido y le llega por WhatsApp.", "Ve qué prenda se vende más y qué talla se le acabó."],
    visual: "foto",
    demo: { texto: "Ver la tienda de ropa en línea", tipo: "ropa" },
  },
  {
    id: "cosmeticos",
    nombre: "Cosméticos",
    foto: fotoCosmeticos,
    problema: "Todo el día contestando “¿precio?” y “¿qué tono me queda?”.",
    hoy: ["Vende por Instagram y cada pedido es una conversación larga.", "Cursos y citas se apartan por mensaje, uno por uno."],
    sistema: ["Precio, tono y cómo usarlo, a la vista.", "La clienta encuentra su tono de base en dos preguntas.", "Cursos con fechas y cupos, y pedidos que le llegan armados a WhatsApp."],
    visual: "foto",
    demo: { texto: "Ver la tienda de cosméticos", tipo: "cosmeticos" },
  },
  {
    id: "salon",
    nombre: "Salones",
    foto: fotoSalon,
    problema: "Cada sucursal agenda por su propio WhatsApp, y las citas se cruzan.",
    hoy: ["La clienta escribe para preguntar si hay hora y espera a que le contesten.", "Las que no llegan dejan huecos, y nadie se acuerda de invitar a las que ya les toca retoque."],
    sistema: ["La clienta elige sucursal, servicio, con quién y la hora libre, sola y a cualquier hora.", "Recordatorio por WhatsApp un día antes de cada cita.", "La agenda del día por estilista y la lista de quién ya necesita retoque."],
    visual: "foto",
    demo: { texto: "Ver la página donde agendan", tipo: "salon" },
  },
  {
    id: "boutique",
    nombre: "Boutique",
    foto: fotoBoutique,
    problema: "Apartados, consignaciones y piezas únicas anotados en el chat.",
    hoy: ["Cada pieza se ofrece por historia y se aparta por mensaje.", "Las consignaciones y los abonos se llevan en un cuaderno."],
    sistema: ["Cada pieza con fotos, estado y su precio a la vista.", "Apartados con abonos y fecha límite, sin perder la cuenta.", "Consignaciones claras: qué se vendió y cuánto le toca a cada quien."],
    visual: "foto",
    demo: { texto: "Ver la boutique en línea", tipo: "boutique" },
  },
];

const VARIANTES_TIENDA: Variante[] = [
  {
    id: "celulares",
    nombre: "Celulares",
    foto: fotoCelulares,
    problema: "“¿Precio? ¿Hay en azul? ¿Ya salió mi pedido?”, todo el día por mensaje.",
    hoy: ["El catálogo es una historia que dura 24 horas.", "El stock se lleva en un cuaderno y se vende lo que ya no hay."],
    sistema: ["Tienda con carrito, pago con tarjeta o transferencia y cuotas.", "El cliente rastrea su pedido o su reparación con un código.", "Usted ve ventas, stock por sucursal y devoluciones en su panel."],
    visual: "foto",
    demo: { texto: "Ver la tienda de celulares", tipo: "celulares" },
  },
  {
    id: "comida",
    nombre: "Comida",
    foto: fotoComida,
    problema: "Pedidos por mensaje, y alguno siempre sale mal.",
    hoy: ["El menú es una foto vieja y los precios ya cambiaron.", "Los pedidos se toman a mano entre mensajes y llamadas."],
    sistema: ["Menú en línea con fotos y precios al día.", "El pedido le llega completo, con dirección y forma de pago.", "Sabe qué platillo se vende más cada semana."],
    visual: "foto",
    demo: { texto: "Ver el menú con pedidos", tipo: "restaurante" },
  },
  {
    id: "tiempos",
    nombre: "Tiempos compartidos",
    foto: fotoResort,
    problema: "Explicar planes y fechas por chat se lleva horas.",
    hoy: ["Los planes y precios se mandan en PDFs y audios.", "Las semanas apartadas viven en un Excel que nadie actualiza."],
    sistema: ["Planes claros, con lo que incluye cada uno.", "Las semanas disponibles y apartadas, a la vista.", "Recordatorios de pago para cada socio."],
    visual: "planes",
    demo: { texto: "Ver la página del club", tipo: "tiempo" },
  },
];

/* Empresas: cada tipo de empresa con su propia demo */
const VARIANTES_EMPRESAS: Variante[] = [
  {
    id: "distribuidora",
    nombre: "Distribuidora",
    foto: fotoDistribuidora,
    problema: "Pedidos por llamada, rutas en la cabeza del piloto y cobros que no cuadran.",
    hoy: ["El tendero pide por audio y el pedido se apunta mal.", "En la noche nadie sabe cuánto cobró cada piloto ni quién debe."],
    sistema: ["Las tiendas piden desde el teléfono con la lista de precios del día.", "El piloto marca lo entregado y lo cobrado en su ruta.", "La oficina ve lo que hay que cargar, los créditos vencidos y lo que se acaba en bodega."],
    visual: "foto",
    demo: { texto: "Ver el pedido de la tienda", tipo: "distribuidora" },
    panel: { texto: "Ver el sistema de la oficina", href: "/demos/distribuidora/#oficina" },
  },
  {
    id: "personal",
    nombre: "Personal y planilla",
    foto: marcaje,
    problema: "Armar la planilla a mano se lleva días, y siempre falta un dato.",
    hoy: ["La asistencia anda entre papel, Excel y mensajes de WhatsApp.", "Se le van días enteros sumando horas extra, séptimo e IGSS."],
    sistema: ["Su gente marca con PIN, foto y ubicación de la obra. Nadie marca por otro.", "La planilla sale sola y las boletas ya quedan listas.", "Caja chica y viáticos, todo en el mismo lugar."],
    visual: "foto",
    demo: { texto: "Ver el marcaje en la obra", tipo: "asistencia" },
    panel: { texto: "Ver la planilla de la semana", href: "/demos/planilla/#oficina" },
  },
];

/* Clínicas: dental, niños y adultos, cada una con lo suyo */
const VARIANTES_CLINICAS: Variante[] = [
  {
    id: "dental",
    nombre: "Dental",
    foto: fotoDental,
    problema: "Citas que se olvidan y horas que se quedan vacías.",
    hoy: ["La agenda vive en un cuaderno o en el teléfono de recepción.", "El paciente no llega porque nadie le recordó."],
    sistema: ["El paciente aparta su cita y ve el precio antes de venir.", "Cada doctor ve su agenda, el odontograma y quién tiene saldo.", "Recordatorio por WhatsApp un día antes."],
    visual: "foto",
    demo: { texto: "Ver la página de pacientes", tipo: "clinica" },
    panel: { texto: "Ver el sistema de la clínica", href: "/demos/clinica/#panel" },
  },
  {
    id: "pediatria",
    nombre: "Pediatría",
    foto: fotoPediatria,
    problema: "“¿Qué vacuna le toca?” y “¿hay espacio hoy?”, todo el día por WhatsApp.",
    hoy: ["El peso y la talla se apuntan en un carné que se pierde.", "Las vacunas atrasadas nadie las recuerda."],
    sistema: ["La mamá ve qué vacuna le toca según la edad y aparta cita.", "La curva de peso de cada hijo, en su teléfono.", "Recepción ve la agenda del día y a quién recordarle su vacuna."],
    visual: "foto",
    demo: { texto: "Ver la página para las mamás", tipo: "pediatria" },
    panel: { texto: "Ver el sistema del consultorio", href: "/demos/pediatria/#consultorio" },
  },
  {
    id: "medicina",
    nombre: "Medicina general",
    foto: fotoMedicina,
    problema: "Pacientes con presión o diabetes que solo vienen cuando ya están mal.",
    hoy: ["Las lecturas viven en un cuaderno que nunca traen.", "Hay que sacar cita solo para renovar una receta."],
    sistema: ["El paciente anota su presión y su azúcar desde el teléfono.", "Pide su receta y ve sus resultados de laboratorio.", "El doctor ve primero a los que salieron altos."],
    visual: "foto",
    demo: { texto: "Ver la página de pacientes", tipo: "medicina" },
    panel: { texto: "Ver el sistema del consultorio", href: "/demos/medicina/#consultorio" },
  },
];

const VARIANTES: Record<string, Variante[]> = { belleza: VARIANTES_BELLEZA, tiendas: VARIANTES_TIENDA, empresas: VARIANTES_EMPRESAS, clinicas: VARIANTES_CLINICAS };

const RUTA_DEMO: Record<string, string> = { distribuidora: "/demos/distribuidora/", asistencia: "/demos/planilla/", clinica: "/demos/clinica/", pediatria: "/demos/pediatria/", medicina: "/demos/medicina/", perfil: "/demos/perfil-belleza/", salon: "/demos/salon/", boutique: "/demos/boutique/", ropa: "/demos/ropa/", cosmeticos: "/demos/cosmeticos/", celulares: "/demos/celulares/", restaurante: "/demos/restaurante/", tiempo: "/demos/tiempo-compartido/" };

/* Tarjetas con foto: al pasar el mouse por una, las demás se ponen borrosas; sin mouse, todas nítidas */
function TarjetasFoco({ variantes, elegida, alElegir }: { variantes: Variante[]; elegida: number; alElegir: (i: number) => void }) {
  const [encima, setEncima] = useState<number | null>(null);
  return (
    <div
      className={`md:col-span-2 grid grid-cols-2 gap-3 sm:gap-4 ${variantes.length === 4 ? "lg:grid-cols-4" : variantes.length === 3 ? "sm:grid-cols-3" : variantes.length === 2 ? "" : "sm:grid-cols-3 lg:grid-cols-5"}`}
      onMouseLeave={() => setEncima(null)}
      role="group"
      aria-label="Tipo de negocio"
    >
      {variantes.map((v, i) => {
        const borrosa = encima !== null && encima !== i;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => alElegir(i)}
            onMouseEnter={() => setEncima(i)}
            onFocus={() => setEncima(i)}
            onBlur={() => setEncima(null)}
            aria-pressed={i === elegida}
            className={`group relative overflow-hidden rounded-2xl aspect-[4/5] sm:aspect-[16/10] text-left transition-all duration-300 ease-out active:scale-[0.98] ${
              borrosa ? "blur-[3px] scale-[0.98] opacity-80" : ""
            } ${i === elegida ? "ring-[3px] ring-acento ring-offset-2 ring-offset-papel" : ""}`}
          >
            <img src={v.foto} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(28,23,20,.75),transparent_60%)]" />
            <span className="absolute left-3 right-3 bottom-2.5 sm:left-4 sm:bottom-3.5 text-white font-semibold text-[0.85rem] sm:text-[1.15rem] leading-tight">{v.nombre}</span>
          </button>
        );
      })}
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
      "Su gente marca con PIN, foto y ubicación de la obra. Nadie marca por otro.",
      "La planilla sale sola y las boletas ya quedan listas.",
      "Caja chica y viáticos, todo en el mismo lugar.",
    ],
    img: marcaje,
    alt: "Pantalla de marcaje en el celular con datos de prueba",
    demo: { texto: "Ver el marcaje en la obra", href: "/demos/planilla/" }, demo2: { texto: "Ver la planilla de la semana", href: "/demos/planilla/#oficina" },
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
    hoy: ["Los socios se llevan en una libreta o en Excel.", "No se sabe quién ya debe ni quién entró hoy."],
    sistema: [
      "Ve en vivo quién va entrando.",
      "Le avisa qué membresías ya vencieron o están por vencer.",
      "Cobros e ingresos del mes, de un vistazo.",
    ],
    img: gimnasio,
    alt: "Socia entrenando con la barra en el gimnasio",
    demo: { texto: "Ver el sistema de recepción", href: "/demos/gimnasio/#recepcion" },
    demo2: { texto: "Ver la página del gimnasio", href: "/demos/gimnasio/" },
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
    problema: "“¿Tiene libre para el 14?” y una cotización que toma toda la tarde.",
    hoy: ["El calendario es un cuaderno y a veces se alquila dos veces lo mismo.", "Sillas que no regresan y nadie sabe quién las debe."],
    sistema: [
      "El cliente ve si su fecha está libre y cuánto le sale según sus invitados.",
      "Aparta con el anticipo y el saldo queda anotado.",
      "La bodega ve la hoja de carga del fin de semana y lo que no regresó.",
    ],
    img: fotoEventos,
    alt: "Toldo blanco montado para una recepción",
    demo: { texto: "Ver la página para cotizar", href: "/demos/eventos/" },
    demo2: { texto: "Ver el sistema de la bodega", href: "/demos/eventos/#bodega" },
    nota: "Foto de ejemplo. La demo usa datos de prueba.",
  },
];

export function Rubros() {
  const [activo, setActivo] = useState(0);
  const [tipo, setTipo] = useState(0); // tipo de tienda elegido
  const botones = useRef<(HTMLButtonElement | null)[]>([]);
  const lista = useRef<HTMLDivElement>(null);

  // pestañas con cursor que se desliza: sigue al mouse y vuelve a la elegida
  const [encima, setEncima] = useState<number | null>(null);
  const [cursor, setCursor] = useState({ left: 0, width: 0, listo: false });
  const objetivo = encima ?? activo;
  useLayoutEffect(() => {
    const medir = () => {
      const b = botones.current[objetivo];
      if (b) setCursor({ left: b.offsetLeft, width: b.offsetWidth, listo: true });
    };
    medir();
    addEventListener("resize", medir);
    return () => removeEventListener("resize", medir);
  }, [objetivo]);
  // en celular, que la pestaña elegida quede a la vista dentro de la barra
  useEffect(() => {
    const b = botones.current[activo];
    const l = lista.current;
    if (!b || !l) return;
    const izq = b.offsetLeft - 16;
    const der = b.offsetLeft + b.offsetWidth + 16 - l.clientWidth;
    if (l.scrollLeft > izq) l.scrollTo({ left: izq, behavior: "smooth" });
    else if (l.scrollLeft < der) l.scrollTo({ left: der, behavior: "smooth" });
  }, [activo]);
  const r = RUBROS[activo];
  const variantes = VARIANTES[r.id];
  const v = variantes ? variantes[Math.min(tipo, variantes.length - 1)] : null;
  const problema = v?.problema ?? r.problema;
  const hoy = v?.hoy ?? r.hoy;
  const sistema = v?.sistema ?? r.sistema;

  // en celular, la tira de pestañas se desliza para que la elegida quede a la vista
  useEffect(() => {
    const b = botones.current[activo];
    const tira = b?.parentElement;
    if (b && tira) tira.scrollTo({ left: b.offsetLeft - 20, behavior: "smooth" });
  }, [activo]);

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
          <p className="mt-4 text-suave text-[1.05rem]">¿Qué problema tiene su negocio? Elija su rubro: el problema de hoy, cómo lo resuelve el sistema y una demo para probar.</p>
        </div>

        <div
          ref={lista}
          role="tablist"
          aria-label="Rubros"
          onKeyDown={teclas}
          onMouseLeave={() => setEncima(null)}
          className="relative mt-8 flex w-fit max-w-full overflow-x-auto rounded-full border border-linea bg-crema p-1 [scrollbar-width:none] aparece"
        >
          <span
            aria-hidden
            className="absolute top-1 bottom-1 rounded-full bg-acento shadow-[0_6px_16px_-8px_rgba(200,73,15,.8)] transition-[left,width] duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
            style={{ left: cursor.left, width: cursor.width, opacity: cursor.listo ? 1 : 0 }}
          />
          {RUBROS.map((x, i) => (
            <button
              key={x.id}
              ref={(el) => {
                botones.current[i] = el;
              }}
              role="tab"
              id={`tab-${x.id}`}
              aria-selected={i === activo}
              aria-controls={`panel-${x.id}`}
              tabIndex={i === activo ? 0 : -1}
              onClick={() => {
                setActivo(i);
                setTipo(0);
              }}
              onMouseEnter={() => setEncima(i)}
              className={`relative z-10 shrink-0 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-[0.95rem] font-semibold transition-colors duration-200 active:scale-95 ${
                i === objetivo ? "text-white" : "text-suave hover:text-tinta"
              }`}
            >
              {x.nombre}
            </button>
          ))}
        </div>

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
            <p className="mt-8 text-[0.95rem] text-suave">Se abre en otra pestaña con datos de ejemplo. Puede tocar todo: no se guarda nada real.</p>
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
              <figcaption className="mt-3 max-w-[270px] text-center text-xs text-suave">Foto de ejemplo. La demo usa datos de prueba.</figcaption>
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
            <figcaption className="mt-3 max-w-[250px] text-center text-xs text-suave">{r.nota ?? "Demostración con datos de prueba."}</figcaption>
          </figure>
          )}
        </div>
      </div>
    </section>
  );
}
