/*
 * Demo: "Crónica Central", diario digital de Guatemala (medio inventado; lo dice la banda de
 * arriba). Pensada para leer en el celular: encabezado fijo, secciones con esqueleto de carga,
 * lector a pantalla completa, buscador y boletín. De las piezas compartidas solo usa la banda
 * de demos. Sin dibujos en SVG: fotos, letras e iconos Lucide.
 */
import { useEffect, useRef, useState } from "react";
import { BandaDemos } from "../comun";
import { sinMovimiento, useDemora, useEscalonado } from "./animar";
import Boletin from "./Boletin";
import Buscador from "./Buscador";
import Cabecera from "./Cabecera";
import { SECCIONES, TAMANOS, porId, type Vista } from "./datos";
import { ESTILOS, LETRAS } from "./estilos";
import Lector from "./Lector";
import Pie from "./Pie";
import { Esqueleto, Portada, PortadaBaja, Seccion } from "./Portada";

const GUARDADO = "jz-medio-letra";

/* la dirección dice qué se ve: #economia es una sección y #nota/... abre el lector */
const notaDeHash = () => porId(location.hash.startsWith("#nota/") ? location.hash.slice(6) : null)?.id ?? null;
const vistaDeHash = (): Vista | null => {
  if (location.hash.startsWith("#nota/")) return null;
  return SECCIONES.find((s) => `#${s.id}` === location.hash)?.id ?? "portada";
};

function pasoGuardado() {
  try {
    const g = localStorage.getItem(GUARDADO);
    const n = g === null ? 1 : Number(g);
    return Number.isInteger(n) && n >= 0 && n < TAMANOS.length ? n : 1;
  } catch {
    return 1;
  }
}

export default function MedioDemo() {
  const [abierto] = useState(() => Date.now());
  const ahora = new Date(abierto);
  const [vista, setVista] = useState<Vista>(() => vistaDeHash() ?? "portada");
  const [notaId, setNotaId] = useState(notaDeHash);
  const [paso, setPaso] = useState(pasoGuardado);
  const [buscando, setBuscando] = useState(false);
  const principal = useRef<HTMLElement>(null);
  const cerrando = useRef(false);
  const [lista, cargando] = useDemora(vista, 300);
  useEscalonado(principal, lista, !cargando);

  /* las letras de este diario, también cuando se llega desde otra demo sin recargar */
  useEffect(() => {
    if (document.querySelector(`link[href="${LETRAS}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = LETRAS;
    document.head.appendChild(l);
  }, []);

  /* atrás y adelante del navegador */
  useEffect(() => {
    const leer = () => {
      cerrando.current = false;
      setNotaId(notaDeHash());
      const v = vistaDeHash();
      if (v) setVista(v);
    };
    addEventListener("popstate", leer);
    addEventListener("hashchange", leer);
    return () => {
      removeEventListener("popstate", leer);
      removeEventListener("hashchange", leer);
    };
  }, []);

  /* al cambiar de sección, la lectura empieza arriba, justo bajo la barra fija */
  const alInicio = () => {
    const el = principal.current;
    if (!el) return;
    const fija = (document.querySelector(".cc-franja")?.clientHeight ?? 0) + (document.querySelector(".cc-nav")?.clientHeight ?? 0);
    const destino = el.getBoundingClientRect().top + scrollY - fija - 2;
    if (scrollY > destino) scrollTo({ top: destino, behavior: "instant" });
  };

  const elegir = (v: Vista) => {
    if (v !== vista) {
      history.pushState(null, "", v === "portada" ? location.pathname : `#${v}`);
      setVista(v);
    }
    alInicio();
  };

  const abrir = (id: string) => {
    const leyendo = location.hash.startsWith("#nota/");
    /* de una nota relacionada a otra no se apila historial: "volver" regresa a la portada */
    history[leyendo ? "replaceState" : "pushState"](leyendo ? history.state : { cc: true }, "", `#nota/${id}`);
    setNotaId(id);
  };

  const cerrar = () => {
    if (cerrando.current || !location.hash.startsWith("#nota/")) return;
    if (history.state?.cc) {
      cerrando.current = true;
      history.back();
      return;
    }
    /* se entró directo por el enlace de la nota: no hay a dónde regresar */
    history.replaceState(null, "", vista === "portada" ? location.pathname : `#${vista}`);
    setNotaId(null);
  };

  const cambiarPaso = (p: number) => {
    const n = Math.max(0, Math.min(TAMANOS.length - 1, p));
    setPaso(n);
    try {
      localStorage.setItem(GUARDADO, String(n));
    } catch {
      /* sin almacenamiento: el tamaño dura mientras la página esté abierta */
    }
  };

  const irAlBoletin = () => {
    document.getElementById("boletin")?.scrollIntoView({ behavior: sinMovimiento() ? "instant" : "smooth", block: "start" });
    document.getElementById("cc-correo")?.focus({ preventScroll: true });
  };

  const nota = porId(notaId);
  useEffect(() => {
    const seccion = SECCIONES.find((s) => s.id === vista)!;
    document.title = nota ? `${nota.titulo} · Crónica Central` : vista === "portada" ? "Crónica Central · Demo de Jzet Labs" : `${seccion.nombre} · Crónica Central`;
  }, [nota, vista]);

  return (
    <div className="cronica">
      <style>{ESTILOS}</style>
      <BandaDemos />
      <Cabecera vista={vista} ahora={ahora} alElegir={elegir} alBuscar={() => setBuscando(true)} alBoletin={irAlBoletin} />

      <main ref={principal} aria-busy={cargando}>
        <div className="cc-contenido">
          {cargando ? (
            <Esqueleto />
          ) : lista === "portada" ? (
            <Portada abierto={abierto} alAbrir={abrir} />
          ) : (
            <Seccion id={lista} abierto={abierto} alAbrir={abrir} />
          )}
        </div>
        {/* siempre en el mismo lugar: la suscripción no se borra al cambiar de sección */}
        <Boletin />
        {!cargando && lista === "portada" && <PortadaBaja alAbrir={abrir} alElegir={elegir} />}
      </main>

      <Pie ahora={ahora} alElegir={elegir} alBoletin={irAlBoletin} />
      <Buscador abierto={buscando} alCerrar={() => setBuscando(false)} alAbrir={abrir} />
      <Lector nota={nota} abierto={abierto} paso={paso} alCambiarPaso={cambiarPaso} alCerrar={cerrar} alAbrir={abrir} />
    </div>
  );
}
