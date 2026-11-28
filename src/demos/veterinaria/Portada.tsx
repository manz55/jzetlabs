import type { ReactNode } from "react";
import { Check, Clock3, Scissors, Siren, Truck } from "lucide-react";
import { FOTOS, SERVICIOS, qz, type ServicioId } from "./datos";
import { Foto } from "./Piezas";

const METRICAS = [
  { icono: Siren, titulo: "Urgencias 24/7", detalle: "Médico de turno toda la noche", color: "text-[#C2410C]" },
  { icono: Clock3, titulo: "Grooming con cita puntual", detalle: "Una mascota por horario", color: "text-[#0F766E]" },
  { icono: Truck, titulo: "Envío gratis en concentrado", detalle: "Zonas 10, 14, 15, 16 y Santa Catarina Pinula", color: "text-[#0F766E]" },
];

export function Hero({ agendador }: { agendador: ReactNode }) {
  return (
    <section className="bg-gradient-to-b from-[#F0FDFA] to-[#FAFAF9] pb-14 pt-8 lg:pb-20 lg:pt-12">
      <div className="hv-ancho grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-x-12">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#0F766E]">Clínica veterinaria en Vista Hermosa, zona 15</p>
          <h1 className="mt-3 text-balance text-[2rem] font-extrabold leading-[1.12] sm:text-[2.6rem] xl:text-[2.85rem]">
            Consulta veterinaria, grooming sin estrés y concentrado a domicilio con expediente digital de tu mascota
          </h1>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {METRICAS.map(({ icono: Icono, titulo, detalle, color }) => (
              <li key={titulo} className="hv-tarjeta flex items-start gap-3 p-4 sm:block">
                <Icono size={22} aria-hidden className={`shrink-0 ${color}`} />
                <div className="min-w-0 sm:mt-2">
                  <p className="text-sm font-extrabold leading-snug text-[#0F172A]">{titulo}</p>
                  <p className="mt-1 text-xs leading-snug text-[#64748B]">{detalle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div id="agendar" className="min-w-0 scroll-mt-36 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:scroll-mt-24">
          {agendador}
        </div>
        <Foto id={FOTOS.portada} alt="Perro pequeño en revisión dentro del consultorio" ancho={1200} alto={640} prioridad className="aspect-[15/8] h-auto w-full rounded-3xl lg:col-start-1" />
      </div>
    </section>
  );
}

const PILARES = [
  {
    titulo: "Consulta médica y laboratorio",
    foto: FOTOS.consulta,
    alt: "Veterinaria revisando los dientes de un perro salchicha",
    texto: "Diagnóstico con exámenes en la misma visita y resultados anotados en el expediente.",
    puntos: ["Hematología y química sanguínea", "Ultrasonido y rayos X", "Plan de vacunas con recordatorio"],
    desde: "Consulta general Q225",
  },
  {
    titulo: "Grooming dermatológico",
    foto: FOTOS.grooming,
    alt: "Poodle blanco recibiendo corte con tijera",
    texto: "Baño según el tipo de piel, sin jaulas de secado y con revisión de oídos.",
    puntos: ["Shampoo medicado cuando hace falta", "Secado a mano", "Aviso cuando está lista para recoger"],
    desde: "Desde Q180",
  },
  {
    titulo: "Hotel canino",
    foto: FOTOS.hotel,
    alt: "Dos perros jugando con una pelota en el jardín",
    texto: "Estadía con patio, paseos y médico en la misma sede. Se pide el carnet al día.",
    puntos: ["Dos paseos y patio supervisado", "Reporte diario por WhatsApp", "Atención médica en sitio"],
    desde: "Q150 por noche",
  },
];

export function Servicios() {
  return (
    <section id="servicios" className="hv-seccion">
      <div className="hv-ancho">
        <h2 className="text-3xl font-extrabold">Tres formas de cuidarlo en un mismo lugar</h2>
        <p className="mt-2 max-w-2xl">Todo queda en un solo expediente: lo que revisó el médico, su último baño y sus vacunas.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {PILARES.map((p) => (
            <article key={p.titulo} className="hv-tarjeta flex flex-col overflow-hidden">
              <Foto id={p.foto} alt={p.alt} ancho={720} alto={480} className="aspect-[3/2] h-auto w-full" />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-extrabold">{p.titulo}</h3>
                <p className="mt-2 text-sm">{p.texto}</p>
                <ul className="mt-4 grid gap-2 text-sm font-semibold text-[#0F172A]">
                  {p.puntos.map((punto) => (
                    <li key={punto} className="flex gap-2">
                      <Check size={17} aria-hidden className="mt-0.5 shrink-0 text-[#0D9488]" /> {punto}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-5 text-sm font-extrabold text-[#0F766E]">{p.desde}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const PAQUETES: { servicio: ServicioId; tamano: string; peso: string; foto: string; alt: string; duracion: string; incluye: string[] }[] = [
  {
    servicio: "bano-pequeno",
    tamano: "Pequeño",
    peso: "hasta 10 kg",
    foto: FOTOS.pequeno,
    alt: "Perro pequeño blanco recién arreglado con pañuelo",
    duracion: "1 hora 30 minutos",
    incluye: ["Baño con shampoo según su piel", "Corte de raza o a máquina", "Secado y cepillado", "Limpieza de oídos"],
  },
  {
    servicio: "bano-mediano",
    tamano: "Mediano",
    peso: "11–25 kg",
    foto: FOTOS.mediano,
    alt: "Perro mediano secándose sobre una toalla azul",
    duracion: "2 horas",
    incluye: ["Todo lo del paquete pequeño", "Limpieza de glándulas anales", "Hidratación de almohadillas"],
  },
  {
    servicio: "bano-grande",
    tamano: "Grande",
    peso: "+25 kg",
    foto: FOTOS.grande,
    alt: "Golden retriever sentado después de su baño",
    duracion: "2 horas 30 minutos",
    incluye: ["Todo lo del paquete mediano", "Secado con turbina de baja intensidad", "Dos personas durante el baño"],
  },
];

export function Tarifario({ alAgendar }: { alAgendar: (servicio: ServicioId) => void }) {
  return (
    <section id="grooming" className="hv-seccion bg-[#F0FDFA]">
      <div className="hv-ancho">
        <h2 className="flex items-center gap-3 text-3xl font-extrabold">
          <Scissors size={28} aria-hidden className="shrink-0 text-[#0D9488]" /> Grooming por tamaño
        </h2>
        <p className="mt-2 max-w-2xl">El precio se define por el peso. Si llega con nudos pegados a la piel, te avisamos antes de cortar.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {PAQUETES.map((p) => (
            <article key={p.servicio} className="hv-tarjeta flex flex-col p-6">
              <div className="flex items-center gap-4">
                <Foto id={p.foto} alt={p.alt} ancho={200} alto={200} className="size-20 shrink-0 rounded-2xl" />
                <div className="min-w-0">
                  <h3 className="text-xl font-extrabold">{p.tamano}</h3>
                  <p className="text-sm font-semibold text-[#475569]">{p.peso}</p>
                </div>
              </div>
              <p className="mt-5 text-4xl font-extrabold tabular-nums text-[#0F172A]">{qz(SERVICIOS[p.servicio].precio)}</p>
              <p className="mt-1 text-sm text-[#64748B]">{p.duracion}</p>
              <ul className="mt-5 grid gap-2.5 border-t border-[#E2E8F0] pt-5 text-sm">
                {p.incluye.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check size={17} aria-hidden className="mt-0.5 shrink-0 text-[#0D9488]" /> {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <button type="button" onClick={() => alAgendar(p.servicio)} className="hv-boton hv-turquesa w-full">
                  Agendar tamaño {p.tamano.toLowerCase()}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
