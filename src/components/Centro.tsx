/*
 * Centro de soluciones: todos los rubros en un bento grid (21st.dev).
 * Estados honestos: "Demo lista" solo si la demo existe, "En uso" solo si hay
 * un cliente real, y "A la medida" para lo que se arma desde el diagnóstico.
 */
import { BookOpen, Briefcase, Church, Dumbbell, GraduationCap, Package, Sparkles, Stethoscope, Store, Ticket, TrendingUp } from "lucide-react";
import { WA_DIAGNOSTICO, whatsappLink } from "@/data/site";
import { BentoGrid, type BentoItem } from "./ui/bento-grid";

const DEMOS = "https://latienda-jzetlabs.vercel.app/";
const ic = "h-5 w-5";
const consulta = (rubro: string) => whatsappLink(`Hola, Joshua. Me interesa un sistema para ${rubro}.`);

const ITEMS: BentoItem[] = [
  {
    title: "Ventas por actividad y eventos",
    description: "Kermeses, ferias, ventas de iglesia y fiestas patrias. Se toca el producto en el celular o la tablet, el total sale solo y al final el cuadre ya está hecho.",
    icon: <Ticket className={ic} />,
    status: "A la medida",
    statusTone: "marino",
    tags: ["Sin tickets de papel", "Cuadre por vendedor", "Funciona sin internet"],
    cta: "Pregunte por su evento",
    href: consulta("ventas de una actividad o evento"),
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Colegios y academias",
    description: "Inscripciones, colegiaturas al día, notas y avisos a los padres sin cuadernos ni listas sueltas.",
    icon: <GraduationCap className={ic} />,
    status: "A la medida",
    statusTone: "marino",
    tags: ["Pagos", "Notas", "Avisos"],
    cta: "Consultar",
    href: consulta("un colegio o academia"),
  },
  {
    title: "Clínicas y dentistas",
    description: "Agenda por doctor, citas por confirmar y expediente de cada paciente.",
    icon: <Stethoscope className={ic} />,
    status: "Demo lista",
    statusTone: "verde",
    tags: ["Citas", "Expediente"],
    cta: "Probar demo",
    href: `${DEMOS}citas/paciente.html`,
  },
  {
    title: "Tiendas",
    description: "Pedidos en un solo tablero, lo más vendido del mes y el inventario a la vista.",
    icon: <Store className={ic} />,
    status: "Demo lista",
    statusTone: "verde",
    tags: ["Pedidos", "Inventario"],
    cta: "Probar demo",
    href: `${DEMOS}tienda/cliente.html`,
  },
  {
    title: "Librerías",
    description: "Inventario por título, temporada escolar sin caos, listas de útiles por colegio y apartados.",
    icon: <BookOpen className={ic} />,
    status: "A la medida",
    statusTone: "marino",
    tags: ["Inventario", "Apartados"],
    cta: "Consultar",
    href: consulta("una librería"),
  },
  {
    title: "Empresas: personal y planilla",
    description: "Marcaje con ubicación y huella aunque no haya señal, planilla automática con horas extra, séptimo e IGSS, caja chica y viáticos.",
    icon: <Briefcase className={ic} />,
    status: "En uso · EFAMIC",
    statusTone: "verde",
    tags: ["Marcaje", "Planilla", "Boletas"],
    cta: "Probar demo",
    href: `${DEMOS}asistencia/empleado.html`,
    colSpan: 2,
  },
  {
    title: "Gimnasios",
    description: "Entradas en vivo, membresías por vencer y cobros del mes.",
    icon: <Dumbbell className={ic} />,
    status: "Demo lista",
    statusTone: "verde",
    tags: ["Membresías", "Cobros"],
    cta: "Probar demo",
    href: `${DEMOS}gimnasio/socio.html`,
  },
  {
    title: "Bodegas y distribuidoras",
    description: "Entradas y salidas, y en cuántos días se acaba cada producto.",
    icon: <Package className={ic} />,
    status: "Demo lista",
    statusTone: "verde",
    tags: ["Existencias", "Salidas"],
    cta: "Probar demo",
    href: `${DEMOS}bodega/bodeguero.html`,
  },
  {
    title: "Equipos de venta",
    description: "Metas del mes, ventas del día en vivo y comisiones de cada vendedor.",
    icon: <TrendingUp className={ic} />,
    status: "Demo lista",
    statusTone: "verde",
    tags: ["Metas", "Comisiones"],
    cta: "Probar demo",
    href: `${DEMOS}ventas/vendedor.html`,
  },
  {
    title: "Iglesias y ministerios",
    description: "Registro de niños por grupo y edad en segundos, reporte de ausencias y etiquetas impresas.",
    icon: <Church className={ic} />,
    status: "Proyecto real · Maestros de Niños",
    statusTone: "verde",
    tags: ["Registro", "Ausencias"],
    cta: "Consultar",
    href: consulta("una iglesia o ministerio"),
  },
  {
    title: "¿Su rubro no está aquí?",
    description: "Si hoy lo hace a mano, en Excel o por WhatsApp, se puede convertir en un sistema. Cuénteme cómo trabaja y se lo armo.",
    icon: <Sparkles className={ic} />,
    status: "Diagnóstico gratis",
    statusTone: "verde",
    cta: "Contarle mi caso",
    href: WA_DIAGNOSTICO,
    colSpan: 3,
  },
];

export function Centro() {
  return (
    <section id="soluciones" className="py-16 sm:py-24 bg-fondo border-b border-linea" aria-labelledby="centro-titulo">
      <div className="contenedor">
        <div className="max-w-2xl aparece">
          <p className="etiqueta">Centro de soluciones</p>
          <h2 id="centro-titulo" className="mt-3 text-[1.75rem] sm:text-[2.2rem]">
            Un sistema para cada negocio.
          </h2>
          <p className="mt-3 text-suave">
            La idea es la misma en todos: quitar el error humano. El sistema calcula, cuadra, avisa y registra, y usted solo confirma.
          </p>
        </div>
        <div className="mt-10">
          <BentoGrid items={ITEMS} />
        </div>
      </div>
    </section>
  );
}
