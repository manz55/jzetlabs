/*
 * "¿Qué problema tiene su negocio?": pestañas por rubro.
 * Cada pestaña: el problema de hoy, lo que hace el sistema, una captura de la demo
 * (datos de prueba) y el enlace para probarla. Teclado: flechas, Inicio y Fin.
 */
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import citas from "@/assets/demos/citas-dueno.jpg";
import gimnasio from "@/assets/demos/gimnasio-dueno.jpg";
import tienda from "@/assets/demos/tienda-dueno.jpg";
import ventas from "@/assets/demos/ventas-dueno.jpg";
import marcaje from "@/assets/sistema/cel-marcaje.jpg";
// fotos libres de Unsplash (licencia Unsplash): photo-1624353656309, photo-1621996346565, photo-1623718649591
import fotoRopa from "@/assets/demos/ropa.jpg";
import fotoComida from "@/assets/demos/comida.jpg";
import fotoResort from "@/assets/demos/resort.jpg";
import { whatsappLink } from "@/data/site";
import { Titulo } from "./Titulo";

const DEMOS = "https://latienda-jzetlabs.vercel.app/";

/* Tiendas tiene tipos de negocio: cada uno cambia el antes y después y lo que se ve a la derecha */
type Variante = {
  id: string;
  nombre: string;
  foto: string;
  problema: string;
  hoy: string[];
  sistema: string[];
  visual: "foto" | "planes";
};

const VARIANTES_TIENDA: Variante[] = [
  {
    id: "ropa",
    nombre: "Ropa",
    foto: fotoRopa,
    problema: "Le preguntan talla y precio por DM, prenda por prenda.",
    hoy: ["Fotos en Instagram y el precio “por inbox”.", "Apartados y pagos anotados en el chat, y ahí se pierden."],
    sistema: ["Catálogo con tallas, colores y precios a la vista.", "El cliente arma su pedido y le llega por WhatsApp.", "Ve qué prenda se vende más y qué talla se le acabó."],
    visual: "foto",
  },
  {
    id: "comida",
    nombre: "Comida",
    foto: fotoComida,
    problema: "Pedidos por mensaje, y alguno siempre sale mal.",
    hoy: ["El menú es una foto vieja y los precios ya cambiaron.", "Los pedidos se toman a mano entre mensajes y llamadas."],
    sistema: ["Menú en línea con fotos y precios al día.", "El pedido le llega completo, con dirección y forma de pago.", "Sabe qué platillo se vende más cada semana."],
    visual: "foto",
  },
  {
    id: "tiempos",
    nombre: "Tiempos compartidos",
    foto: fotoResort,
    problema: "Explicar planes y fechas por chat se lleva horas.",
    hoy: ["Los planes y precios se mandan en PDFs y audios.", "Las semanas apartadas viven en un Excel que nadie actualiza."],
    sistema: ["Planes claros, con lo que incluye cada uno.", "Las semanas disponibles y apartadas, a la vista.", "Recordatorios de pago para cada socio."],
    visual: "planes",
  },
];

/* Tarjetas con foto: al pasar el mouse por una, las demás se ponen borrosas; sin mouse, todas nítidas */
function TarjetasFoco({ elegida, alElegir }: { elegida: number; alElegir: (i: number) => void }) {
  const [encima, setEncima] = useState<number | null>(null);
  return (
    <div className="md:col-span-2 grid grid-cols-3 gap-3 sm:gap-5" onMouseLeave={() => setEncima(null)} role="group" aria-label="Tipo de tienda">
      {VARIANTES_TIENDA.map((v, i) => {
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
  nota?: string;
};

const RUBROS: Rubro[] = [
  {
    id: "empresas",
    nombre: "Empresas",
    problema: "Armar la planilla a mano se lleva días, y siempre falta un dato.",
    hoy: ["La asistencia anda entre papel, Excel y mensajes de WhatsApp.", "Se le van días enteros sumando horas extra, séptimo e IGSS."],
    sistema: [
      "Su gente marca desde su teléfono, con ubicación y huella, aunque no haya señal.",
      "La planilla sale sola y las boletas ya quedan listas.",
      "Caja chica y viáticos, todo en el mismo lugar.",
    ],
    img: marcaje,
    alt: "Pantalla de marcaje en el celular con datos de prueba",
    demo: { texto: "Pruebe la demo de asistencia", href: `${DEMOS}asistencia/empleado.html` },
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
    img: citas,
    alt: "Agenda de una clínica de prueba con citas del día por doctor",
    demo: { texto: "Pruebe la demo de citas", href: `${DEMOS}citas/paciente.html` },
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
    alt: "Panel de un gimnasio de prueba con las entradas de hoy",
    demo: { texto: "Pruebe la demo del gimnasio", href: `${DEMOS}gimnasio/socio.html` },
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
    demo: { texto: "Pruebe la demo de la tienda", href: `${DEMOS}tienda/cliente.html` },
  },
  {
    id: "eventos",
    nombre: "Ventas y eventos",
    problema: "Tickets de papel y cuadres que no cuadran.",
    hoy: ["Filas largas y errores al cobrar en kermeses, ferias y ventas.", "Al final del día nadie sabe cuánto entró."],
    sistema: [
      "Se toca el producto en un teléfono o tablet y el total sale solo.",
      "La gente ve su número de orden en pantalla y sabe cuándo recoger.",
      "El cuadre sale por vendedor, con el reporte final del evento.",
    ],
    img: ventas,
    alt: "Tablero de ventas de prueba con el total vendido en vivo",
    nota: "La captura es del tablero de ventas. La demo para eventos viene pronto.",
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
  const v = r.id === "tiendas" ? VARIANTES_TIENDA[tipo] : null;
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
              onClick={() => setActivo(i)}
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
          {v && <TarjetasFoco elegida={tipo} alElegir={setTipo} />}
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
            <div className="mt-8 flex flex-wrap gap-3">
              {r.demo && v?.visual !== "planes" ? (
                <a href={r.demo.href} target="_blank" rel="noopener noreferrer" className="btn btn-principal">
                  {r.demo.texto}
                </a>
              ) : (
                <a
                  href={whatsappLink(`Hola, Joshua. Me interesa el sistema para ${(v?.nombre ?? r.nombre).toLowerCase()}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-principal"
                >
                  {v ? "Pregunte por su negocio" : "Pregunte por su evento"}
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
              <img src={v.foto} alt={`Ejemplo de tienda de ${v.nombre.toLowerCase()}`} className="w-[230px] sm:w-[270px] aspect-[4/5] object-cover rounded-[1.4rem] shadow-lg" loading="lazy" />
              <figcaption className="mt-3 max-w-[270px] text-center text-xs text-suave">Foto de ejemplo. La demo de la tienda usa datos de prueba.</figcaption>
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
