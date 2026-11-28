import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { BandaDemos } from "../comun";
import { Catalogo } from "./Catalogo";
import { SECCIONES, aroPorId } from "./datos";
import { useClinica } from "./estado";
import { FormularioCita, type Seleccion } from "./FormularioCita";
import { SedesSeguros, Tecnologia } from "./Informacion";
import { MiReceta } from "./MiReceta";
import { Nav, type Vista } from "./Nav";
import { Panel } from "./Panel";
import { Pie } from "./Pie";
import { CitaRegistrada, Hero, Servicios } from "./Portada";
import "./oftalmologia.css";

const TEMA = {
  "--font-titulo": '"Playfair Display", Georgia, serif',
  "--color-tinta": "#0F172A",
  "--color-acento": "#1E3A8A",
  fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  fontVariantNumeric: "lining-nums tabular-nums",
} as CSSProperties;

const TITULOS: Record<Vista, string> = {
  inicio: "CLARAVISTA · Demo de Jzet Labs",
  receta: "Mi Receta Visual · CLARAVISTA",
  panel: "Panel Clínica y Taller · CLARAVISTA",
};

const DIRECCIONES: Record<Vista, string> = { inicio: "", receta: "#mi-receta", panel: "#panel" };

const leerVista = (): Vista => {
  if (location.hash === "#mi-receta") return "receta";
  return ["#panel", "#recepcion"].includes(location.hash) ? "panel" : "inicio";
};
const seccionDeLaDireccion = () => SECCIONES.find((s) => `#${s.id}` === location.hash)?.id ?? "";

const irA = (id: string) => {
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: quieto ? "instant" : "smooth", block: "start" });
};

export default function OftalmologiaDemo() {
  const clinica = useClinica();
  const [vista, setVista] = useState<Vista>(leerVista);
  const [seleccion, setSeleccion] = useState<Seleccion>({ servicio: "visual", area: "" });
  const [reservada, setReservada] = useState("");
  const [activo, setActivo] = useState("sofia");
  const [aviso, setAviso] = useState({ texto: "", alerta: false, n: 0 });
  const destino = useRef(seccionDeLaDireccion());
  const citaReservada = clinica.citas.find((c) => c.id === reservada);

  const avisar = useCallback((texto: string, alerta = false) => setAviso((a) => ({ texto, alerta, n: a.n + 1 })), []);

  useEffect(() => {
    if (!aviso.texto) return;
    const t = window.setTimeout(() => setAviso((a) => ({ ...a, texto: "" })), 3500);
    return () => window.clearTimeout(t);
  }, [aviso.n, aviso.texto]);

  useLayoutEffect(() => {
    const antes = history.scrollRestoration;
    history.scrollRestoration = "manual";
    return () => {
      history.scrollRestoration = antes;
    };
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [vista]);

  useEffect(() => {
    const cambio = () => {
      destino.current = seccionDeLaDireccion() || destino.current;
      setVista(leerVista());
    };
    addEventListener("hashchange", cambio);
    addEventListener("popstate", cambio);
    return () => {
      removeEventListener("hashchange", cambio);
      removeEventListener("popstate", cambio);
    };
  }, []);

  useEffect(() => {
    document.title = TITULOS[vista];
    const id = destino.current;
    if (!id) return;
    const t = window.setTimeout(() => {
      destino.current = "";
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    }, 60);
    return () => window.clearTimeout(t);
  }, [vista]);

  function ir(nueva: Vista) {
    if (nueva === vista) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    history.pushState(null, "", DIRECCIONES[nueva] || location.pathname);
    setVista(nueva);
  }

  function irSeccion(id: string) {
    if (vista === "inicio") {
      irA(id);
      return;
    }
    destino.current = id;
    history.pushState(null, "", location.pathname);
    setVista("inicio");
  }

  function irAgendar() {
    setReservada("");
    irSeccion("agendar");
  }

  function apartar(aroId: string) {
    const quitando = clinica.apartados.includes(aroId);
    clinica.apartarAro(aroId);
    if (quitando) return;
    const nombre = aroPorId(aroId)?.nombre;
    avisar(clinica.citaVisitante ? `Aro ${nombre} apartado para tu cita.` : `Aro ${nombre} apartado. Elige tu horario para dejarlo en tu cita.`);
  }

  return (
    <>
      <div className="relative z-50">
        <BandaDemos />
      </div>
      <div style={TEMA} className="cv flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-[#FAFAFA] text-base leading-relaxed text-[#334155]">
        <Nav vista={vista} alVista={ir} alSeccion={irSeccion} alAgendar={irAgendar} />
        <main className="flex-1">
          {vista === "inicio" && (
            <>
              <Hero
                agendador={
                  <div className="cv-tarjeta p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,.35)] sm:p-6">
                    {citaReservada ? (
                      <CitaRegistrada clinica={clinica} cita={citaReservada} alVerReceta={() => ir("receta")} alVerPanel={() => ir("panel")} alRepetir={() => setReservada("")} />
                    ) : (
                      <>
                        <h2 className="mb-4 text-2xl">Agenda tu examen</h2>
                        <FormularioCita
                          clinica={clinica}
                          seleccion={seleccion}
                          alSeleccionar={setSeleccion}
                          origen="portada"
                          alAgendar={(cita) => {
                            setReservada(cita.id);
                            setActivo(cita.pacienteId);
                            requestAnimationFrame(() => irA("agendar"));
                          }}
                        />
                      </>
                    )}
                  </div>
                }
              />
              <Servicios
                alReservar={(e) => {
                  setReservada("");
                  setSeleccion({ servicio: e.servicio, area: e.nombre });
                  irA("agendar");
                }}
              />
              <Catalogo clinica={clinica} alApartar={apartar} alAgendar={irAgendar} alVerReceta={() => ir("receta")} />
              <Tecnologia />
              <SedesSeguros />
            </>
          )}
          {vista === "receta" && <MiReceta clinica={clinica} activo={activo} alElegir={setActivo} alAvisar={avisar} alAgendar={irAgendar} />}
          {vista === "panel" && <Panel clinica={clinica} activo={activo} alElegir={setActivo} alAvisar={avisar} />}
        </main>
        <Pie />
        <div role="status" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
          {aviso.texto && (
            <p className="flex max-w-md items-center gap-2.5 rounded-2xl bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white shadow-xl">
              {aviso.alerta ? <CircleAlert size={18} aria-hidden className="shrink-0 text-[#FBBF24]" /> : <CircleCheck size={18} aria-hidden className="shrink-0 text-[#93C5FD]" />}
              {aviso.texto}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
