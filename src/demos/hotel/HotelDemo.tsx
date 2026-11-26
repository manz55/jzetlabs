/*
 * Demo: "Posada Casa del Volcán", hotel boutique en Antigua Guatemala (negocio inventado; lo
 * dice la banda de arriba). Pensada para abrirse en el celular desde WhatsApp: fechas en la
 * portada, habitaciones con tarifa a la vista y una cápsula abajo que lleva la cuenta.
 * De las piezas compartidas solo usa la banda de demos. Sin dibujos en SVG: fotos e iconos Lucide.
 */
import { useEffect, useState } from "react";
import { CalendarCheck, Check, Coffee, MapPin, MessageCircle, Plus, SquareParking, Wifi } from "lucide-react";
import { BandaDemos } from "../comun";
import { irA } from "./animar";
import Disponibilidad from "./Disponibilidad";
import Habitaciones, { type Filtro } from "./Habitaciones";
import { Capsula, Panel } from "./Reserva";
import {
  CANCELACION, CHECK_IN, CHECK_OUT, DATOS_VACIOS, EXTRAS, FOTOS, HOTEL, MAPA, MAX_HUESPEDES, MAX_NOCHES,
  esFecha, estanciaInicial, habitacion, hoy, noches, tarifa, textoHuespedes, ultimaLlegada, whatsapp,
  type Datos, type Estancia, type ExtraId,
} from "./datos";
import { ESTILOS, LETRAS } from "./estilos";

const GUARDADO = "jz-hotel-v1";

type Reserva = { estancia: Estancia; elegida: string | null; extras: ExtraId[]; datos: Datos; iniciada: boolean };

/* la reserva sobrevive si cierran la página para ir a WhatsApp; las fechas que ya pasaron no */
function leerGuardado(): Reserva {
  const vacia: Reserva = { estancia: estanciaInicial(), elegida: null, extras: [], datos: DATOS_VACIOS, iniciada: false };
  try {
    const g = JSON.parse(localStorage.getItem(GUARDADO) ?? "null") as Partial<Reserva> | null;
    if (!g) return vacia;
    const e = g.estancia;
    const vigente =
      !!e && esFecha(e.llegada) && esFecha(e.salida) && e.llegada >= hoy() && e.llegada <= ultimaLlegada() && noches(e) >= 1 && noches(e) <= MAX_NOCHES;
    const huespedes = Number.isInteger(e?.huespedes) ? Math.max(1, Math.min(MAX_HUESPEDES, e!.huespedes)) : 2;
    const estancia = vigente ? { llegada: e.llegada, salida: e.salida, huespedes } : { ...vacia.estancia, huespedes };
    const h = habitacion(g.elegida ?? null);
    return {
      estancia,
      elegida: h && h.personas >= huespedes ? h.id : null,
      extras: EXTRAS.map((x) => x.id).filter((id) => g.extras?.includes(id)),
      datos: { ...DATOS_VACIOS, ...g.datos },
      iniciada: Boolean(g.iniciada),
    };
  } catch {
    return vacia;
  }
}

function Logo() {
  return (
    <span className="pv-logo">
      <span className="pv-rombo" aria-hidden />
      <span>
        <span className="pv-logo-tipo">Posada</span>
        <span className="pv-logo-nombre">Casa del Volcán</span>
      </span>
    </span>
  );
}

const NAV = [
  ["#la-posada", "La posada"],
  ["#habitaciones", "Habitaciones"],
  ["#extras", "Extras"],
  ["#ubicacion", "Ubicación"],
] as const;

const SERVICIOS = [
  { Icono: MapPin, nombre: "A 4 cuadras del Parque Central", texto: "Salga caminando a iglesias, cafés y mercados." },
  { Icono: Coffee, nombre: "Desayuno chapín incluido", texto: "Huevos, frijoles, plátano y café recién hecho." },
  { Icono: SquareParking, nombre: "Parqueo privado", texto: "Su vehículo queda dentro de la propiedad." },
  { Icono: Wifi, nombre: "Wi-Fi de alta velocidad", texto: "Para trabajar o llamar a casa desde su habitación." },
  { Icono: CalendarCheck, nombre: "Cancelación flexible", texto: "Sin costo hasta 72 horas antes de llegar." },
];

const GALERIA = [
  { foto: FOTOS.jardin, titulo: "El jardín del patio", alt: "Jardín de patio con árboles, setos y columnas de piedra" },
  { foto: FOTOS.desayuno, titulo: "El desayuno de la casa", alt: "Plato con huevos estrellados, frijoles negros y salsa" },
  { foto: FOTOS.volcan, titulo: "El Volcán de Agua", alt: "El Volcán de Agua detrás de un edificio colonial de Antigua" },
];

const WHATSAPP_PREGUNTA = whatsapp(`Hola, quisiera preguntar por una habitación en ${HOTEL}.`);

export default function HotelDemo() {
  const [reserva, setReserva] = useState<Reserva>(leerGuardado);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [consulta, setConsulta] = useState(0);
  const [revisando, setRevisando] = useState(false);
  const [aviso, setAviso] = useState("");
  const { estancia, elegida, extras, datos, iniciada } = reserva;
  const actual = habitacion(elegida);

  /* las letras de esta demo, también cuando se llega desde otra sin recargar */
  useEffect(() => {
    if (document.querySelector(`link[href="${LETRAS}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = LETRAS;
    document.head.appendChild(l);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(GUARDADO, JSON.stringify(reserva));
    } catch {
      /* sin almacenamiento: la reserva dura mientras la página esté abierta */
    }
  }, [reserva]);

  /* si la habitación elegida ya no recibe al grupo, se suelta y se avisa */
  const cambiarEstancia = (e: Estancia) => {
    const sobra = actual && e.huespedes > actual.personas;
    setAviso(sobra ? `La ${actual.nombre} recibe hasta ${actual.personas} personas. Elija otra para ${textoHuespedes(e.huespedes)}.` : "");
    setReserva((r) => ({ ...r, estancia: e, elegida: sobra ? null : r.elegida, iniciada: true }));
  };
  const consultar = () => {
    setReserva((r) => ({ ...r, iniciada: true }));
    setConsulta((n) => n + 1);
    irA("habitaciones");
  };
  const elegir = (id: string) => {
    setAviso("");
    setReserva((r) => ({ ...r, elegida: r.elegida === id ? null : id, iniciada: true }));
  };
  const cambiarExtra = (id: ExtraId) =>
    setReserva((r) => ({ ...r, extras: r.extras.includes(id) ? r.extras.filter((x) => x !== id) : [...r.extras, id], iniciada: true }));

  return (
    <div className="posada" data-capsula={iniciada}>
      <style>{ESTILOS}</style>
      <BandaDemos />

      <header className="border-b border-[#e5e0d8]">
        <div className="pv-ancho flex items-center justify-between gap-4 py-3.5">
          <a href="#inicio" aria-label={`${HOTEL}, inicio`}>
            <Logo />
          </a>
          <nav aria-label="Secciones" className="hidden gap-8 md:flex">
            {NAV.map(([href, nombre]) => (
              <a key={href} href={href} className="pv-enlace">
                {nombre}
              </a>
            ))}
          </nav>
          <a href="#disponibilidad" className="pv-btn pv-linea">
            Reservar
          </a>
        </div>
      </header>

      <main id="inicio">
        <section className="pv-portada pv-oscuro">
          <img src={FOTOS.portada} alt="Patio colonial con arcos blancos, faroles encendidos y una fuente" width={1400} height={1650} fetchPriority="high" />
          <div className="pv-ancho pb-20">
            <p className="text-[0.95rem] font-semibold">{HOTEL} · Antigua Guatemala</p>
            <h1 className="mt-3">Duerma en una casa de patios, en el centro de Antigua</h1>
            <p className="mt-3 max-w-[34rem] text-[1.02rem] text-white/90">A cuatro cuadras del Parque Central, con desayuno chapín incluido y parqueo privado.</p>
          </div>
        </section>
        <div className="pv-ancho">
          <Disponibilidad estancia={estancia} alCambiar={cambiarEstancia} alConsultar={consultar} />
          <p role="status" className={aviso ? "mt-3 rounded-lg border border-[#b45309] bg-white px-4 py-3 text-[0.92rem] font-semibold" : ""}>
            {aviso}
          </p>
        </div>

        <section id="la-posada" className="pv-seccion">
          <div className="pv-ancho grid items-center gap-9 md:grid-cols-2 md:gap-14">
            <div>
              <h2 className="pv-h2">Una posada tranquila, a pasos de todo</h2>
              <p className="pv-suave mt-4 max-w-[34rem]">
                Muros gruesos, corredores con plantas y habitaciones que dan hacia adentro, lejos del ruido de la calle. Aquí se descansa de verdad después de caminar
                Antigua.
              </p>
              <ul className="mt-7 grid gap-4">
                {SERVICIOS.map(({ Icono, nombre, texto }) => (
                  <li key={nombre} className="flex gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#e5e0d8] bg-[#f2efe9]">
                      <Icono size={20} aria-hidden />
                    </span>
                    <span>
                      <span className="block font-semibold">{nombre}</span>
                      <span className="pv-suave block text-[0.92rem]">{texto}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <img src={FOTOS.corredor} alt="Corredor con arcos blancos, faroles y macetas de barro" width={696} height={750} loading="lazy" className="aspect-[4/5] w-full rounded-2xl object-cover" />
          </div>
        </section>

        <Habitaciones estancia={estancia} elegida={elegida} filtro={filtro} consulta={consulta} alFiltrar={setFiltro} alElegir={elegir} />

        <section id="extras" className="pv-seccion">
          <div className="pv-ancho">
            <h2 className="pv-h2">Complete su estadía</h2>
            <p className="pv-suave mt-2">Agréguelos a su solicitud. Se suman al total de abajo.</p>
            <ul className="mt-7 grid gap-4 md:grid-cols-3">
              {EXTRAS.map((x) => {
                const puesto = extras.includes(x.id);
                return (
                  <li key={x.id} className="flex flex-col rounded-2xl border border-[#e5e0d8] bg-white p-5">
                    <h3 className="text-[1.25rem]">{x.nombre}</h3>
                    <p className="pv-suave mt-2 text-[0.92rem]">{x.detalle}</p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                      <span className="pv-num text-[1.35rem] font-bold">{tarifa(x.precio)}</span>
                      <button type="button" className={`pv-btn ${puesto ? "pv-elegido" : "pv-linea"}`} aria-pressed={puesto} aria-label={`${puesto ? "Quitar" : "Agregar"} ${x.nombre}`} onClick={() => cambiarExtra(x.id)}>
                        {puesto ? <Check size={17} aria-hidden /> : <Plus size={17} aria-hidden />} {puesto ? "Agregado" : "Agregar"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="pv-arena pv-seccion" aria-labelledby="pv-titulo-casa">
          <div className="pv-ancho">
            <h2 id="pv-titulo-casa" className="pv-h2">
              La casa y sus alrededores
            </h2>
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {GALERIA.map((g) => (
                <figure key={g.titulo}>
                  <img src={g.foto} alt={g.alt} width={900} height={675} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
                  <figcaption className="mt-2.5 font-semibold">{g.titulo}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="ubicacion" className="pv-seccion">
          <div className="pv-ancho grid items-center gap-9 md:grid-cols-2 md:gap-14">
            <img src={FOTOS.arco} alt="El Arco de Santa Catalina sobre una calle empedrada de Antigua Guatemala" width={800} height={825} loading="lazy" className="aspect-square w-full rounded-2xl object-cover md:order-2" />
            <div>
              <h2 className="pv-h2">En el centro de Antigua Guatemala</h2>
              <p className="pv-suave mt-4 max-w-[34rem]">
                La posada está a cuatro cuadras del Parque Central. El Arco de Santa Catalina, las iglesias, los cafés y el mercado se recorren a pie. Al escribirnos le
                enviamos la ubicación exacta y las indicaciones para entrar al parqueo.
              </p>
              <dl className="pv-num mt-6 grid max-w-sm grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                  <dt className="pv-suave text-[0.85rem] font-semibold">Check-in</dt>
                  <dd className="text-[1.5rem] font-bold">{CHECK_IN}</dd>
                </div>
                <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                  <dt className="pv-suave text-[0.85rem] font-semibold">Check-out</dt>
                  <dd className="text-[1.5rem] font-bold">{CHECK_OUT}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href={MAPA} target="_blank" rel="noopener noreferrer" className="pv-btn pv-linea">
                  <MapPin size={18} aria-hidden /> Ver el Parque Central en el mapa
                </a>
                <a href={WHATSAPP_PREGUNTA} target="_blank" rel="noopener noreferrer" className="pv-btn pv-linea">
                  <MessageCircle size={18} aria-hidden /> Escribir por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="pv-oscuro bg-[#1b2e26] text-white">
        <div className="pv-pie pv-ancho pt-14 pb-8">
          <div className="grid gap-10 md:grid-cols-[1.1fr_.7fr_1.4fr_.9fr]">
            <div>
              <Logo />
              <p className="mt-4 max-w-[18rem] text-[0.92rem] text-white/75">Hospedaje boutique en Antigua Guatemala.</p>
            </div>
            <nav aria-label="Enlaces del pie">
              <h2 className="text-[1.1rem]">La posada</h2>
              <ul className="mt-2">
                {NAV.map(([href, nombre]) => (
                  <li key={href}>
                    <a href={href} className="pv-enlace !min-h-[40px] text-white/80">
                      {nombre}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h2 className="text-[1.1rem]">Políticas</h2>
              <p className="pv-num mt-3 text-[0.92rem] text-white/80">
                Check-in desde las {CHECK_IN}. Check-out hasta las {CHECK_OUT}.
              </p>
              <p className="mt-2 text-[0.92rem] text-white/80">{CANCELACION}</p>
            </div>
            <div>
              <h2 className="text-[1.1rem]">Ubicación</h2>
              <p className="mt-3 text-[0.92rem] text-white/80">
                A 4 cuadras del Parque Central
                <br />
                Antigua Guatemala, Sacatepéquez
              </p>
              <a href={MAPA} target="_blank" rel="noopener noreferrer" className="pv-enlace mt-1 underline underline-offset-4">
                Abrir el mapa
              </a>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-5 text-[0.85rem] text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {HOTEL}
            </p>
            <a href="/" className="pv-enlace !min-h-[40px] !text-[0.85rem] sm:ml-auto">
              Sitio desarrollado por Jzet Labs
            </a>
          </div>
        </div>
      </footer>

      <Capsula estancia={estancia} habitacion={actual} extras={extras} visible={iniciada && !revisando} alRevisar={() => setRevisando(true)} alVerHabitaciones={() => irA("habitaciones")} />
      <Panel
        abierto={revisando && actual !== null}
        estancia={estancia}
        habitacion={actual}
        extras={extras}
        datos={datos}
        alCerrar={() => setRevisando(false)}
        alExtra={cambiarExtra}
        alEscribir={(d) => setReserva((r) => ({ ...r, datos: d }))}
      />
    </div>
  );
}
