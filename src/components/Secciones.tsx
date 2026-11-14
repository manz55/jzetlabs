/*
 * Landing de Jzet Labs: llamar la atención y llevar a escribir.
 * Portada → beneficios → por qué conmigo → caso EFAMIC → llamado final.
 * Capturas: demo del sistema (datos de prueba) y pantalla de marcaje de EFAMIC
 * con nombres de ejemplo.
 */
import efamicMarcaje from "@/assets/portfolio/efamic-mob.jpg";
import efamicPanel from "@/assets/sistema/panel-hoy.jpg";
import { EMAIL, WHATSAPP_DISPLAY, WA_DIAGNOSTICO, WA_HOLA, laTienda } from "@/data/site";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cambiarTema, useTema } from "@/lib/tema";
import { topesDeSecciones } from "@/lib/hojas";
import { Logo } from "./Logo";
import { Titulo } from "./Titulo";
import { Faro } from "./Faro";
import { RubroRotando } from "./RubroRotando";

export function IconoWhatsApp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

const MENU = [
  { href: "/#trabajos", id: "trabajos", texto: "Trabajos" },
  { href: "/#que-hago", id: "que-hago", texto: "Lo que hago" },
  { href: "/#como-trabajo", id: "como-trabajo", texto: "Cómo trabajo" },
  { href: "/web", id: "", texto: "Páginas web" },
];

/* sol / luna: cambia toda la Home a claro u oscuro y las montañas se repintan */
function BotonTema() {
  const tema = useTema();
  const oscuro = tema === "oscuro";
  return (
    <button
      type="button"
      onClick={() => cambiarTema(oscuro ? "claro" : "oscuro")}
      aria-label={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={oscuro ? "Modo claro" : "Modo oscuro"}
      className="grid place-items-center w-11 h-11 rounded-full border border-tinta/15 text-tinta hover:bg-tinta/5 transition-colors"
    >
      {oscuro ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}

export function Encabezado() {
  const [activo, setActivo] = useState("");

  // marcar en el menú la sección que se está viendo (las secciones están pegadas: se usa su lugar original)
  useEffect(() => {
    let cuadro = 0;
    const revisar = () => {
      cuadro = 0;
      const topes = topesDeSecciones();
      const linea = window.scrollY + window.innerHeight * 0.45;
      let actual = "";
      for (const [id, y] of topes) if (y <= linea) actual = id;
      setActivo(MENU.some((m) => m.id === actual) ? actual : "");
    };
    const pedir = () => {
      if (!cuadro) cuadro = requestAnimationFrame(revisar);
    };
    revisar();
    addEventListener("scroll", pedir, { passive: true });
    addEventListener("resize", pedir);
    return () => {
      removeEventListener("scroll", pedir);
      removeEventListener("resize", pedir);
      cancelAnimationFrame(cuadro);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-crema/85 backdrop-blur">
      <div className="contenedor flex items-center justify-between gap-4 h-16 sm:h-[72px]">
        <Logo />
        <nav className="hidden lg:flex items-center gap-0.5 rounded-full bg-noche oscuro:bg-white/[0.07] oscuro:ring-1 oscuro:ring-white/10 p-1.5" aria-label="Principal">
          {MENU.map((m) => (
            <a
              key={m.texto}
              href={m.href}
              aria-current={activo && activo === m.id ? "true" : undefined}
              className={`rounded-full px-4 py-1.5 text-[0.93rem] transition-colors ${activo && activo === m.id ? "bg-acento text-white" : "text-white/75 hover:text-white hover:bg-white/10"}`}
            >
              {m.texto}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
        <BotonTema />
        <a
          href={WA_HOLA}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full bg-noche oscuro:bg-white/[0.07] oscuro:ring-1 oscuro:ring-white/10 text-white pl-4 pr-1.5 py-1.5 text-[0.93rem] font-semibold hover:bg-marino transition-colors"
        >
          Escríbame
          <span className="grid place-items-center w-8 h-8 rounded-full bg-acento">
            <IconoWhatsApp />
          </span>
        </a>
        </div>
      </div>
    </header>
  );
}

export function Portada() {
  return (
    <section id="inicio" className="portada-papel border-b border-linea overflow-hidden">
      <div className="contenedor grid lg:grid-cols-[1fr_1.05fr] gap-14 lg:gap-12 items-center pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div>
          <p className="nota-mano text-acento text-[1.9rem]">Hola, soy Joshua.</p>
          <h1 className="mt-3 text-[2.5rem] sm:text-[3.2rem] lg:text-[3.4rem] leading-[1.04]">
            Hago <span className="whitespace-nowrap">sistemas para</span> <RubroRotando />
          </h1>
          <p className="mt-6 text-[1.12rem] sm:text-[1.2rem] text-texto max-w-xl">
            Páginas web, sistemas y apps para que su negocio deje de hacer las cosas a mano. Usted trata conmigo de principio a fin: yo escucho, yo lo construyo y yo le doy soporte.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={WA_DIAGNOSTICO} target="_blank" rel="noopener noreferrer" className="btn btn-principal">
              <IconoWhatsApp /> Agendar diagnóstico gratis
            </a>
            <a href={laTienda("planes")} className="btn btn-secundario">
              Ver precios y planes
            </a>
          </div>
          <p className="mt-4 text-sm text-suave">Una reunión sin costo para entender cómo trabaja su negocio hoy.</p>
        </div>

        <div>
          <Faro />
        </div>
      </div>
    </section>
  );
}

const RAZONES = [
  { titulo: "Una sola persona, de principio a fin", texto: "Usted habla conmigo: yo escucho, yo lo construyo y yo le doy soporte. Sin intermediarios ni centros de llamadas." },
  { titulo: "A la medida de cómo trabaja", texto: "Parto de cómo opera su negocio hoy, no de una plantilla. Sus reglas, sus formatos, su forma de cobrar." },
  { titulo: "Reglas claras", texto: "Lo que se pacta por escrito es lo que se entrega. Si después quiere algo más, se lo cotizo antes y usted decide." },
  { titulo: "Implementación y capacitación", texto: "Configuro el sistema con sus datos y capacito a su equipo hasta que lo usen sin ayuda." },
];

export function PorQue() {
  return (
    <section className="py-16 sm:py-24 bg-fondo border-y border-linea" aria-labelledby="porque-titulo">
      <div className="contenedor grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16">
        <div className="aparece">
          <p className="etiqueta">Por qué trabajar conmigo</p>
          <h2 id="porque-titulo" className="mt-3 text-[1.75rem] sm:text-[2.2rem]">
            Un sistema hecho para su negocio, no al revés.
          </h2>
        </div>
        <ul className="divide-y divide-linea">
          {RAZONES.map((r) => (
            <li key={r.titulo} className="py-5 first:pt-0 aparece">
              <h3 className="text-[1.15rem]">{r.titulo}</h3>
              <p className="mt-1.5 text-suave">{r.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Caso() {
  return (
    <section id="caso" className="py-16 sm:py-24" aria-labelledby="caso-titulo">
      <div className="contenedor">
        <div className="max-w-3xl aparece">
          <p className="etiqueta">Caso real</p>
          <h2 id="caso-titulo" className="mt-3 text-[1.75rem] sm:text-[2.2rem]">
            EFAMIC pasó de Excel y WhatsApp a un sistema propio.
          </h2>
          <p className="mt-3 text-suave">Empresa metalmecánica · 23 empleados · En uso desde septiembre de 2026</p>
        </div>

        <div className="mt-10 grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-14 items-start">
          <div className="grid sm:grid-cols-2 gap-6 aparece">
            <div className="rounded-xl border border-linea p-6">
              <h3 className="text-[1.05rem] text-suave">Antes</h3>
              <ul className="mt-3 space-y-3 text-texto">
                <li>La asistencia se llevaba en Excel y los avisos por WhatsApp.</li>
                <li>Armar la planilla quincenal tomaba de 3 a 5 días.</li>
              </ul>
            </div>
            <div className="rounded-xl border-2 border-marino p-6">
              <h3 className="text-[1.05rem] text-marino">Ahora</h3>
              <ul className="mt-3 space-y-3 text-texto">
                <li>Cada empleado marca desde el celular con ubicación y huella o FaceID, aunque no haya señal en la obra.</li>
                <li>La planilla se calcula sola: horas extra, séptimo, bonificación e IGSS.</li>
              </ul>
            </div>
            <div className="sm:col-span-2 rounded-xl bg-marino text-white p-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <p className="text-[2rem] font-bold leading-none whitespace-nowrap">
                3 a 5 días <span className="sr-only">antes</span>
              </p>
              <p className="text-white/85">era lo que tomaba la planilla. Hoy se calcula sola con cada marcaje.</p>
            </div>
          </div>

          <figure className="aparece">
            <div className="flex items-end gap-4">
              <img src={efamicMarcaje} alt="Pantalla de marcaje de EFAMIC en el celular, con nombres de ejemplo" width={600} height={1298} className="w-[38%] rounded-2xl border border-linea shadow-sm" loading="lazy" />
              <img src={efamicPanel} alt="Panel del dueño con quién está trabajando, quién llegó tarde y quién no ha marcado" width={1600} height={1000} className="w-[62%] rounded-xl border border-linea shadow-sm" loading="lazy" />
            </div>
            <figcaption className="mt-3 text-xs text-suave">
              Izquierda: marcaje de EFAMIC, con nombres de ejemplo para proteger los datos del personal. Derecha: panel del sistema con datos de prueba.
            </figcaption>
            <a href={laTienda("proyectos")} className="mt-5 inline-flex font-semibold text-marino underline underline-offset-4 hover:text-acento">
              Ver más proyectos
            </a>
          </figure>
        </div>
      </div>
    </section>
  );
}

export function Llamado() {
  return (
    <section id="contacto" className="bg-marino text-white" aria-labelledby="llamado-titulo">
      <div className="contenedor py-20 sm:py-28">
        <Titulo id="llamado-titulo" claro antes="¿Qué le gustaría dejar de hacer" acento="a mano?" className="max-w-5xl aparece" />
        <div className="mt-10 grid lg:grid-cols-[1.3fr_1fr] gap-8 items-end aparece">
          <p className="text-white/85 text-[1.1rem] sm:text-[1.2rem] max-w-xl">
            Escríbame con confianza. Me cuenta qué necesita y le propongo opciones con tiempos y precios claros. Yo quedo a la orden.
          </p>
          <div className="flex flex-col sm:flex-row lg:justify-end gap-3 [&>a]:whitespace-nowrap">
            <a href={WA_HOLA} target="_blank" rel="noopener noreferrer" className="btn btn-principal !text-[1.05rem] !min-h-[56px] !rounded-full !px-6">
              <IconoWhatsApp /> Escribirme por WhatsApp
            </a>
            <a href={laTienda()} className="btn !min-h-[56px] !rounded-full !px-6 bg-white text-marino hover:bg-white/90">
              Ver precios completos
            </a>
          </div>
        </div>
        <p className="mt-10 text-sm text-white/70 aparece">
          WhatsApp {WHATSAPP_DISPLAY} ·{" "}
          <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Quiero platicar sobre mi negocio")}`} className="underline underline-offset-2 hover:text-white">
            {EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
}

export function Pie() {
  return (
    <footer className="bg-noche text-white/80">
      <div className="contenedor py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <Logo claro />
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label="Pie de página">
          <a href="/web" className="hover:text-white">
            Páginas web
          </a>
          <a href={laTienda()} className="hover:text-white">
            Precios y planes
          </a>
          <a href={laTienda("proyectos")} className="hover:text-white">
            Proyectos
          </a>
          <a href={WA_DIAGNOSTICO} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            WhatsApp
          </a>
        </nav>
        <p>© {new Date().getFullYear()} Joshua Zet · Guatemala</p>
      </div>
    </footer>
  );
}
