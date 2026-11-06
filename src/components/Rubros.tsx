/*
 * "¿Qué problema tiene su negocio?": pestañas por rubro.
 * Cada pestaña: el problema de hoy, lo que hace el sistema, una captura de la demo
 * (datos de prueba) y el enlace para probarla. Teclado: flechas, Inicio y Fin.
 */
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import citas from "@/assets/demos/citas-dueno.jpg";
import gimnasio from "@/assets/demos/gimnasio-dueno.jpg";
import tienda from "@/assets/demos/tienda-dueno.jpg";
import ventas from "@/assets/demos/ventas-dueno.jpg";
import marcaje from "@/assets/sistema/cel-marcaje.jpg";
import { whatsappLink } from "@/data/site";

const DEMOS = "https://latienda-jzetlabs.vercel.app/";

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
    problema: "La planilla se arma a mano y siempre falta un dato.",
    hoy: ["Asistencia en papel, Excel o mensajes de WhatsApp.", "Días enteros sumando horas extra, séptimo e IGSS."],
    sistema: [
      "Su personal marca con ubicación y huella desde el celular, aunque no haya señal.",
      "La planilla se calcula sola y las boletas salen listas.",
      "Caja chica y viáticos en el mismo lugar.",
    ],
    img: marcaje,
    alt: "Pantalla de marcaje en el celular con datos de prueba",
    demo: { texto: "Pruebe la demo de asistencia", href: `${DEMOS}asistencia/empleado.html` },
  },
  {
    id: "clinicas",
    nombre: "Clínicas y dentistas",
    problema: "Citas olvidadas y horas vacías en la agenda.",
    hoy: ["Agenda en cuaderno o en el celular de recepción.", "Pacientes que no llegan y nadie les recordó."],
    sistema: [
      "Agenda por doctor, con las citas por confirmar a la vista.",
      "El paciente aparta su cita y aparece en recepción.",
      "Expediente por paciente, armado a la medida de su clínica.",
    ],
    img: citas,
    alt: "Agenda de una clínica de prueba con citas del día por doctor",
    demo: { texto: "Pruebe la demo de citas", href: `${DEMOS}citas/paciente.html` },
  },
  {
    id: "gimnasios",
    nombre: "Gimnasios",
    problema: "Membresías vencidas que nadie cobra.",
    hoy: ["Control de socios en una libreta o en Excel.", "No se sabe quién ya debe ni quién entró hoy."],
    sistema: [
      "Registro de entradas en vivo.",
      "Aviso de membresías por vencer y vencidas.",
      "Cobros e ingresos del mes en un vistazo.",
    ],
    img: gimnasio,
    alt: "Panel de un gimnasio de prueba con las entradas de hoy",
    demo: { texto: "Pruebe la demo del gimnasio", href: `${DEMOS}gimnasio/socio.html` },
  },
  {
    id: "tiendas",
    nombre: "Tiendas",
    problema: "No sabe bien cuánto vendió ni qué se está acabando.",
    hoy: ["Pedidos regados entre WhatsApp, llamadas y el mostrador.", "El inventario se cuenta a mano, y tarde."],
    sistema: [
      "Los pedidos llegan a un solo tablero.",
      "Ventas, ticket promedio y lo más vendido del mes.",
      "Inventario con lo que hay y lo que falta.",
    ],
    img: tienda,
    alt: "Resumen de una tienda de prueba con ventas y pedidos por atender",
    demo: { texto: "Pruebe la demo de la tienda", href: `${DEMOS}tienda/cliente.html` },
  },
  {
    id: "eventos",
    nombre: "Ventas y eventos",
    problema: "Tickets de papel y cuadres que no cuadran.",
    hoy: ["Filas largas y errores al cobrar en kermeses, ferias y ventas.", "Al final del día, nadie sabe cuánto entró."],
    sistema: [
      "Menú con precios en un celular o tablet: se toca y el total sale solo.",
      "Número de orden en pantalla para que la gente sepa cuándo recoger.",
      "Cuadre automático por vendedor y reporte final del evento.",
    ],
    img: ventas,
    alt: "Tablero de ventas de prueba con el total vendido en vivo",
    nota: "La captura es del tablero de ventas. La demo para eventos viene pronto.",
  },
];

export function Rubros() {
  const [activo, setActivo] = useState(0);
  const botones = useRef<(HTMLButtonElement | null)[]>([]);
  const r = RUBROS[activo];

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
    <section id="rubros" className="py-16 sm:py-24" aria-labelledby="rubros-titulo">
      <div className="contenedor">
        <div className="max-w-2xl aparece">
          <p className="etiqueta">Véalo funcionando</p>
          <h2 id="rubros-titulo" className="mt-3 text-[1.75rem] sm:text-[2.2rem]">
            ¿Qué problema tiene su negocio?
          </h2>
          <p className="mt-3 text-suave">Elija su rubro: el problema de hoy, cómo lo resuelve el sistema y una demo para probar.</p>
        </div>

        <div
          role="tablist"
          aria-label="Rubros"
          onKeyDown={teclas}
          className="relative mt-8 -mx-5 px-5 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto pb-2 aparece"
        >
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
              className={`shrink-0 rounded-full border px-4 py-2 text-[0.95rem] font-semibold transition-colors ${
                i === activo ? "border-marino bg-marino text-white" : "border-linea bg-white text-suave hover:border-marino hover:text-marino"
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
          <div>
            <h3 className="text-[1.5rem] sm:text-[1.9rem]">{r.problema}</h3>
            <div className="mt-6 grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-suave">Hoy</p>
                <ul className="mt-2 space-y-2">
                  {r.hoy.map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <span aria-hidden className="mt-[0.7em] h-0.5 w-3 shrink-0 bg-suave/60" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-acento">Con el sistema</p>
                <ul className="mt-2 space-y-2">
                  {r.sistema.map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <span aria-hidden className="mt-[0.45em] h-2 w-3.5 shrink-0 -rotate-45 border-b-2 border-l-2 border-acento" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {r.demo ? (
                <a href={r.demo.href} target="_blank" rel="noopener noreferrer" className="btn btn-principal">
                  {r.demo.texto}
                </a>
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
        </div>
      </div>
    </section>
  );
}
