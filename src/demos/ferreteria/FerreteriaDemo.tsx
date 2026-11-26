/*
 * Demo: "Grupo Ferretero Industek" (negocio inventado; lo dice la banda de arriba).
 * Pensada para el dueño de una ferretería o distribuidora grande: precio y existencia a la
 * vista, calculadora de obra, cuenta para constructoras, flete por zona y orden formal.
 * De las piezas compartidas solo usa la banda de demos. Sin dibujos en SVG: fotos e iconos Lucide.
 */
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Building2, CalendarClock, Check, Clock, CreditCard, FileCheck2, HardHat, MapPin, Search, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { whatsappLink } from "@/data/site";
import { BandaDemos } from "../comun";
import Calculadora from "./Calculadora";
import Catalogo, { type Filtro } from "./Catalogo";
import Pedido from "./Pedido";
import {
  AMBIENTE, DATOS_VACIOS, PRODUCTOS, TIENDA, ZONAS, fleteDe, lineasDe, producto, qz, subtotalDe,
  type Carro, type DatosPedido, type Item, type ProductoId,
} from "./datos";
import { ESTILOS } from "./estilos";

const GUARDADO = "jz-ferreteria-v2";
const whatsapp = (texto: string) => `https://wa.me/?text=${encodeURIComponent(texto)}`;

type Estado = { carro: Carro; datos: DatosPedido };

/* el pedido sobrevive si cierran la página; si el navegador no deja guardar, no pasa nada */
function leerGuardado(): Estado {
  const vacio: Estado = { carro: {}, datos: DATOS_VACIOS };
  try {
    const g = JSON.parse(localStorage.getItem(GUARDADO) ?? "null") as Partial<Estado> | null;
    if (!g) return vacio;
    const carro: Carro = {};
    for (const p of PRODUCTOS) {
      const n = Number(g.carro?.[p.id]);
      if (Number.isInteger(n) && n > 0) carro[p.id] = Math.min(n, p.hay);
    }
    return { carro, datos: { ...DATOS_VACIOS, ...g.datos } };
  } catch {
    return vacio;
  }
}

function Logo() {
  return (
    <span className="ik-logo">
      <span className="ik-logo-barra" aria-hidden />
      <span>
        <span className="ik-logo-nombre">INDUSTEK</span>
        <span className="ik-logo-giro">Grupo Ferretero</span>
      </span>
    </span>
  );
}

const NAV = [
  ["#catalogo", "Catálogo"],
  ["#calculadora", "Calculadora de obra"],
  ["#empresas", "Constructoras"],
  ["#cobertura", "Flete y cobertura"],
  ["#sala", "Sala de ventas"],
] as const;

export default function FerreteriaDemo() {
  const [estado, setEstado] = useState<Estado>(leerGuardado);
  const [abierto, setAbierto] = useState(false);
  const [filtro, setFiltro] = useState<Filtro>({ cat: "Todo", busca: "" });
  const { carro, datos } = estado;
  const lineas = lineasDe(carro);
  const total = subtotalDe(carro) + (lineas.length ? (fleteDe(datos) ?? 0) : 0);

  useEffect(() => {
    try {
      localStorage.setItem(GUARDADO, JSON.stringify(estado));
    } catch {
      /* sin almacenamiento: el pedido dura mientras la página esté abierta */
    }
  }, [estado]);

  const acotar = (id: ProductoId, n: number) => Math.max(0, Math.min(Math.floor(n) || 0, producto(id).hay));
  const poner = (id: ProductoId, n: number) =>
    setEstado((e) => {
      const nuevo = { ...e.carro };
      const v = acotar(id, n);
      if (v) nuevo[id] = v;
      else delete nuevo[id];
      return { ...e, carro: nuevo };
    });
  const agregar = (id: ProductoId, n: number) => setEstado((e) => ({ ...e, carro: { ...e.carro, [id]: acotar(id, (e.carro[id] ?? 0) + n) } }));

  /* desde la calculadora: suma exactamente esas cantidades, sin pasarse de la existencia */
  function agregarCalculo(items: Item[]) {
    const faltan = items.filter((i) => (carro[i.id] ?? 0) + i.n > producto(i.id).hay).map((i) => `${producto(i.id).nombre} (hay ${producto(i.id).hay})`);
    setEstado((e) => {
      const nuevo = { ...e.carro };
      for (const i of items) nuevo[i.id] = acotar(i.id, (nuevo[i.id] ?? 0) + i.n);
      return { ...e, carro: nuevo };
    });
    return faltan.length ? `Se agregó hasta la existencia de: ${faltan.join(", ")}.` : "Cálculo agregado a su pedido.";
  }

  function buscar(texto: string) {
    setFiltro({ cat: "Todo", busca: texto });
    document.getElementById("catalogo")?.scrollIntoView();
  }

  return (
    <div className="industek min-h-screen">
      <style>{ESTILOS}</style>
      <BandaDemos />

      <div className="border-b border-slate-200 bg-[#F8FAFC] text-[0.78rem] font-semibold">
        <div className="ik-ancho flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2 sm:justify-between">
          <p className="flex items-center gap-1.5"><Truck size={14} aria-hidden className="text-[#C81E1E]" /> Despacho en 4 horas en Carretera a El Salvador</p>
          <p className="ik-gris hidden items-center gap-1.5 sm:flex"><Clock size={14} aria-hidden /> Lunes a viernes 7:00 a 17:30 · Sábado 7:00 a 13:00</p>
        </div>
      </div>

      <header className="ik-oscuro sticky top-0 z-30 bg-[#0F172A] text-white">
        <div className="ik-ancho flex h-16 items-center justify-between gap-4">
          <a href="#inicio" aria-label="Grupo Ferretero Industek, inicio"><Logo /></a>
          <nav className="hidden gap-6 text-[0.88rem] font-semibold text-slate-200 lg:flex">
            {NAV.map(([href, texto]) => <a key={href} href={href} className="py-2 hover:text-white hover:underline hover:underline-offset-8">{texto}</a>)}
          </nav>
          <button type="button" className="ik-btn ik-rojo shrink-0 whitespace-nowrap !min-h-11 !px-3.5" onClick={() => setAbierto(true)}>
            <ShoppingCart size={18} aria-hidden />
            <span className="hidden sm:inline">Mi pedido</span>
            <span className="sr-only sm:hidden">Mi pedido</span>
            {lineas.length > 0 && <span className="ik-num rounded bg-white px-1.5 py-0.5 text-[0.76rem] text-[#C81E1E]">{lineas.length}</span>}
          </button>
        </div>
      </header>

      <main>
        <Portada buscar={buscar} />
        <Catalogo filtro={filtro} setFiltro={setFiltro} carro={carro} agregar={agregar} />
        <Calculadora carro={carro} agregar={agregarCalculo} verPedido={() => setAbierto(true)} />
        <Empresas />
        <Cobertura />
        <SalaDeVentas />
      </main>
      <Pie />

      {lineas.length > 0 && (
        <>
          <div className="h-[4.8rem] bg-[#0F172A] md:hidden" aria-hidden />
          <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-12px_30px_-18px_rgba(15,23,42,.45)] md:hidden">
            <p className="leading-tight">
              <span className="ik-gris block text-[0.76rem]">{lineas.length} {lineas.length === 1 ? "producto" : "productos"}</span>
              <span className="ik-num text-[1.25rem] font-bold">{qz(total)}</span>
            </p>
            <button type="button" className="ik-btn ik-rojo" onClick={() => setAbierto(true)}>Ver pedido <ArrowRight size={18} aria-hidden /></button>
          </div>
        </>
      )}

      <Pedido
        abierto={abierto}
        alCerrar={() => setAbierto(false)}
        carro={carro}
        poner={poner}
        datos={datos}
        cambiar={(d) => setEstado((e) => ({ ...e, datos: { ...e.datos, ...d } }))}
        vaciar={() => setEstado((e) => ({ ...e, carro: {} }))}
      />
    </div>
  );
}

/* ---------------- secciones ---------------- */

const RESPALDOS = [
  { Icono: Truck, t: "Despacho en 4 horas", x: "En Carretera a El Salvador, Pinula y zonas 15 y 16, con órdenes confirmadas antes de las 12:00." },
  { Icono: CreditCard, t: "Crédito empresarial", x: "Plazos de 15 y 30 días para constructoras y contratistas, previa evaluación." },
  { Icono: ShieldCheck, t: "Garantía de fábrica", x: "Herramienta y materiales con respaldo del fabricante y factura FEL por cada compra." },
];

function Portada({ buscar }: { buscar: (t: string) => void }) {
  const [texto, setTexto] = useState("");
  const enviar = (e: FormEvent) => {
    e.preventDefault();
    buscar(texto.trim());
  };
  return (
    <section id="inicio" className="bg-white">
      <div className="ik-ancho py-10 md:py-16">
        <div className="grid items-center gap-9 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <p className="ik-sobre">Distribuidor de materiales de construcción · Guatemala</p>
            <h1 className="mt-3 text-balance text-[2.35rem] sm:text-[3.3rem] xl:text-[3.7rem]">Abastecemos su obra sin atrasos.</h1>
            <p className="ik-gris mt-4 max-w-xl text-[1.04rem] leading-relaxed">
              Acero, cemento, herramienta y tubería con existencia verificada en bodega. Arme su orden en minutos, reciba factura FEL inmediata y programe el flete hasta su proyecto.
            </p>
            <form role="search" onSubmit={enviar} className="mt-6 flex max-w-xl gap-2 rounded-xl border border-slate-300 bg-white p-1.5 shadow-[0_18px_40px_-28px_rgba(15,23,42,.5)] focus-within:border-[#0F172A]">
              <Search size={20} aria-hidden className="ml-2 hidden self-center text-slate-500 sm:block" />
              <input type="search" aria-label="Buscar productos por nombre o código SKU" placeholder="Producto o SKU" value={texto} onChange={(e) => setTexto(e.target.value)} className="h-12 min-w-0 flex-1 bg-transparent px-2 text-[1rem] outline-none" />
              <button type="submit" className="ik-btn ik-rojo shrink-0">Buscar</button>
            </form>
            <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1 text-[0.84rem]">
              <span className="ik-gris mr-1 w-full sm:w-auto">Más pedidos:</span>
              {["Cemento", "Varilla", "DeWalt", "PVC"].map((x) => (
                <button key={x} type="button" className="min-h-11 rounded-md px-2.5 font-bold underline decoration-slate-300 underline-offset-4 hover:decoration-[#C81E1E]" onClick={() => buscar(x)}>
                  {x}
                </button>
              ))}
            </div>
          </div>
          <figure className="relative">
            <img src={AMBIENTE.portada} alt="Camión de plataforma cargando acero frente a una bodega" width={990} height={742} fetchPriority="high" className="block aspect-[4/3] w-full rounded-xl border border-slate-200 object-cover" />
            <figcaption className="ik-oscuro absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-lg bg-[#0F172A] px-4 py-3 text-white">
              <span className="text-[0.86rem] font-semibold">Flete propio hasta su obra</span>
              <span className="ik-num whitespace-nowrap text-[0.86rem] font-bold">desde {qz(Math.min(...ZONAS.map((z) => z.flete)))}</span>
            </figcaption>
          </figure>
        </div>

        <ul className="mt-9 grid gap-3 md:grid-cols-3">
          {RESPALDOS.map(({ Icono, t, x }) => (
            <li key={t} className="ik-tarjeta flex gap-3.5 p-4">
              <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#0F172A] text-white"><Icono size={21} /></span>
              <span>
                <b className="block text-[1rem]">{t}</b>
                <span className="ik-gris mt-0.5 block text-[0.86rem] leading-snug">{x}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Empresas() {
  return (
    <section id="empresas" className="scroll-mt-16">
      <div className="ik-ancho grid items-center gap-9 py-12 md:py-16 lg:grid-cols-2">
        <img src={AMBIENTE.tienda} alt="Pasillo de bodega con estantes de materiales" width={1200} height={900} loading="lazy" className="block aspect-[4/3] w-full rounded-xl border border-slate-200 object-cover" />
        <div>
          <p className="ik-sobre">Constructoras y maestros de obra</p>
          <h2 className="mt-1 text-[1.9rem] sm:text-[2.4rem]">Una cuenta que avanza al ritmo de su proyecto</h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {[
              { Icono: FileCheck2, t: "Factura FEL inmediata", x: "Emitida con su orden, a su NIT, y enviada a su correo." },
              { Icono: Building2, t: "Crédito empresarial", x: "Una línea para comprar hoy y pagar a 15 o 30 días." },
              { Icono: HardHat, t: "Soporte técnico en obra", x: "Asesores que le ayudan a cuantificar y a elegir medidas y grados." },
              { Icono: CalendarClock, t: "Despachos por etapas", x: "Programe entregas según el avance y evite material almacenado." },
            ].map(({ Icono, t, x }) => (
              <li key={t}>
                <Icono size={22} aria-hidden className="text-[#C81E1E]" />
                <h3 className="mt-2 text-[1.02rem]">{t}</h3>
                <p className="ik-gris mt-1 text-[0.9rem] leading-relaxed">{x}</p>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <a className="ik-btn ik-rojo" target="_blank" rel="noopener noreferrer" href={whatsapp("Hola, Industek. Quiero solicitar crédito empresarial.\nEmpresa:\nNIT:\nCompra mensual estimada:")}>
              Solicitar crédito empresarial <ArrowRight size={18} aria-hidden />
            </a>
            <a className="ik-btn ik-linea" target="_blank" rel="noopener noreferrer" href={whatsapp("Hola, Industek. Necesito soporte técnico para cuantificar materiales de mi obra.")}>
              Hablar con soporte técnico
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Cobertura() {
  return (
    <section id="cobertura" className="ik-alterna scroll-mt-16">
      <div className="ik-ancho py-12 md:py-16">
        <p className="ik-sobre">Logística propia</p>
        <h2 className="mt-1 text-[1.9rem] sm:text-[2.4rem]">Flete y tiempos de despacho por zona</h2>
        <p className="ik-gris mt-2 max-w-2xl text-[0.95rem]">Los despachos en 4 horas aplican a órdenes confirmadas antes de las 12:00 en día hábil. El retiro en sala de ventas no tiene costo.</p>
        <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="ik-tarjeta self-start overflow-hidden">
            <table className="w-full text-left text-[0.86rem]">
              <thead className="bg-[#0F172A] text-white">
                <tr>
                  <th scope="col" className="px-3 py-3 font-bold sm:px-4">Zona</th>
                  <th scope="col" className="px-2 py-3 font-bold sm:px-4">Despacho</th>
                  <th scope="col" className="px-3 py-3 text-right font-bold sm:px-4">Flete</th>
                </tr>
              </thead>
              <tbody>
                {ZONAS.map((z) => (
                  <tr key={z.id} className="border-t border-slate-200">
                    <th scope="row" className="px-3 py-3 font-semibold sm:px-4">{z.nombre}</th>
                    <td className="ik-gris px-2 py-3 sm:px-4">{z.plazo}</td>
                    <td className="ik-num whitespace-nowrap px-3 py-3 text-right font-bold sm:px-4">{qz(z.flete)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ik-tarjeta self-start overflow-hidden">
            <img src={AMBIENTE.entrega} alt="Camión de reparto y auxiliar con chaleco durante una entrega" width={1200} height={900} loading="lazy" className="block aspect-[16/10] w-full object-cover" />
            <div className="p-4 sm:p-5">
              <h3 className="text-[1.08rem]">Para despachar sin contratiempos</h3>
              <ul className="mt-3 grid gap-2.5 text-[0.9rem]">
                {[
                  "Indique en su orden si ingresa camión, picop o requiere acarreo.",
                  "Designe a una persona que reciba, cuente y firme el envío.",
                  "Prepare un área seca o tarimas para descargar el cemento.",
                ].map((x) => (
                  <li key={x} className="flex gap-2.5"><Check size={18} aria-hidden className="mt-0.5 shrink-0 text-[#15803d]" /> {x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SalaDeVentas() {
  return (
    <section id="sala" className="scroll-mt-16">
      <div className="ik-ancho grid gap-8 py-12 md:py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <p className="ik-sobre">Sala de ventas y bodega</p>
          <h2 className="mt-1 text-[1.9rem] sm:text-[2.4rem]">Retire hoy mismo, sin costo</h2>
          <p className="mt-5 flex gap-3"><MapPin size={20} aria-hidden className="mt-1 shrink-0 text-[#C81E1E]" /> <span><b className="block">{TIENDA.direccion}</b><span className="ik-gris text-[0.9rem]">Parqueo para clientes y área de carga para picop.</span></span></p>
          <dl className="mt-5 divide-y divide-slate-200 border-y border-slate-200 text-[0.94rem]">
            {[
              ["Lunes a viernes", "7:00 – 17:30"],
              ["Sábado", "7:00 – 13:00"],
              ["Domingo", "Cerrado"],
            ].map(([dia, hora]) => (
              <div key={dia} className="flex justify-between gap-4 py-2.5"><dt>{dia}</dt><dd className="ik-num font-bold">{hora}</dd></div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={TIENDA.mapa} target="_blank" rel="noopener noreferrer" className="ik-btn ik-navy">Cómo llegar <ArrowRight size={18} aria-hidden /></a>
            <a href={whatsapp("Hola, Industek. Quiero cotizar materiales.")} target="_blank" rel="noopener noreferrer" className="ik-btn ik-linea">Cotizar por WhatsApp</a>
          </div>
        </div>
        <iframe title="Mapa de la sala de ventas en el kilómetro 14.5 de Carretera a El Salvador" src={`${TIENDA.mapa}&output=embed`} className="h-80 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] lg:h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </section>
  );
}

function Pie() {
  return (
    <footer className="ik-oscuro bg-[#0F172A] text-white">
      <div className="ik-ancho py-10">
        <div className="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-slate-300">Materiales de construcción, acero, herramienta y plomería para obras en Carretera a El Salvador y la zona metropolitana.</p>
            <nav className="mt-4 flex flex-wrap gap-x-5 text-[0.86rem] font-semibold" aria-label="Secciones">
              {NAV.map(([href, texto]) => <a key={href} href={href} className="inline-flex min-h-11 items-center text-slate-200 hover:underline">{texto}</a>)}
            </nav>
          </div>
          <div className="divide-y divide-slate-700 border-y border-slate-700">
            {[
              ["Condiciones de venta", "Precios en quetzales con IVA incluido, sujetos a cambio sin previo aviso. La orden queda confirmada cuando un asesor valida existencia, total y hora de despacho."],
              ["Cambios y devoluciones", "Herramienta con factura y empaque original dentro de 8 días. Cemento, acero cortado y material a la medida se revisan al momento de recibirlos."],
              ["Privacidad de sus datos", "Su nombre, NIT, correo y dirección se utilizan únicamente para preparar, entregar y facturar sus órdenes. No se venden ni se comparten con terceros."],
            ].map(([t, x]) => (
              <details key={t}>
                <summary className="flex min-h-12 cursor-pointer items-center text-[0.92rem] font-bold">{t}</summary>
                <p className="pb-4 text-[0.86rem] leading-relaxed text-slate-300">{x}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-[0.78rem] text-slate-400">
          <p>© {new Date().getFullYear()} {TIENDA.nombre}. Marcas registradas de sus propietarios. Imágenes con fines ilustrativos.</p>
          <a className="inline-flex min-h-11 items-center font-semibold text-slate-200 underline underline-offset-4" target="_blank" rel="noopener noreferrer" href={whatsappLink("Hola, Joshua. Vi la página de Industek y quiero una así para mi ferretería.")}>
            Sitio desarrollado por Jzet Labs
          </a>
        </div>
      </div>
    </footer>
  );
}
