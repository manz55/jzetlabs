import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { BandaDemos } from "../comun";
import type { Dia } from "./AgendaDelDia";
import { solicitudVacia } from "./agenda";
import { SECCIONES, hoyIso, tipoDe, type Cita, type ServicioId } from "./datos";
import { useAltamira } from "./estado";
import { Hero } from "./Hero";
import { Nav, type Vista } from "./Nav";
import { Panel } from "./Panel";
import { Pie } from "./Pie";
import { Portal } from "./Portal";
import { Especialidades, Laboratorio, Medicos, SegurosUbicacion } from "./Secciones";
import "./clinica-medica.css";

const TITULOS: Record<Vista, string> = {
  inicio: "Centro Médico Altamira · Demo de Jzet Labs",
  portal: "Portal del Paciente · Altamira",
  panel: "Panel Médico y Caja · Altamira",
};

const DIRECCIONES: Record<Vista, string> = { inicio: "", portal: "#portal", panel: "#panel" };

const leerVista = (): Vista => (location.hash === "#portal" ? "portal" : location.hash === "#panel" ? "panel" : "inicio");
const seccionDeLaDireccion = () => SECCIONES.find((s) => `#${s.id}` === location.hash)?.id ?? "";
const irA = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });

type Aviso = { texto: string; alerta: boolean; pacienteId: string; n: number };

export default function ClinicaMedicaDemo() {
  const clinica = useAltamira();
  const [vista, setVista] = useState<Vista>(leerVista);
  const [solicitud, setSolicitud] = useState(solicitudVacia);
  const [reservada, setReservada] = useState("");
  const [pacienteActivo, setPacienteActivo] = useState("carlos");
  const [dia, setDia] = useState<Dia>("hoy");
  const [resaltada, setResaltada] = useState("");
  const [aviso, setAviso] = useState<Aviso>({ texto: "", alerta: false, pacienteId: "", n: 0 });
  const destino = useRef(seccionDeLaDireccion());

  const avisar = useCallback((texto: string, alerta = false) => setAviso((a) => ({ texto, alerta, pacienteId: "", n: a.n + 1 })), []);

  useEffect(() => {
    if (!aviso.texto) return;
    const t = window.setTimeout(() => setAviso((a) => ({ ...a, texto: "" })), aviso.pacienteId ? 7000 : 3500);
    return () => window.clearTimeout(t);
  }, [aviso.n, aviso.texto, aviso.pacienteId]);

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

  function reservar(servicioId: ServicioId) {
    setReservada("");
    setSolicitud((s) => ({ ...s, tipo: tipoDe(servicioId), servicioId, fecha: "", hora: "" }));
    irSeccion("agendar");
  }

  function resaltar(cita: Cita) {
    setDia(cita.fecha === hoyIso() ? "hoy" : "proximas");
    setResaltada(cita.id);
  }

  function verEnPortal(pacienteId: string) {
    setPacienteActivo(pacienteId);
    setAviso((a) => ({ ...a, texto: "" }));
    ir("portal");
  }

  return (
    <>
      <div className="relative z-50 print:hidden">
        <BandaDemos />
      </div>
      <div className="cm-raiz flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-[#F8FAFC] text-base leading-relaxed text-[#334155]">
        <Nav vista={vista} alVista={ir} alSeccion={irSeccion} alAgendar={irAgendar} />
        <main className="flex-1">
          {vista === "inicio" && (
            <>
              <Hero
                clinica={clinica}
                solicitud={solicitud}
                alCambiar={setSolicitud}
                reservada={reservada}
                alReservar={(id) => {
                  setReservada(id);
                  setResaltada(id);
                }}
                alVerPortal={(cita) => verEnPortal(cita.pacienteId)}
                alVerPanel={(cita) => {
                  resaltar(cita);
                  ir("panel");
                }}
              />
              <Especialidades alReservar={reservar} />
              <Laboratorio alReservar={reservar} />
              <Medicos alReservar={reservar} />
              <SegurosUbicacion />
            </>
          )}
          {vista === "portal" && <Portal clinica={clinica} activo={pacienteActivo} alElegir={setPacienteActivo} alAvisar={avisar} alAgendar={irAgendar} />}
          {vista === "panel" && (
            <Panel
              clinica={clinica}
              dia={dia}
              alDia={setDia}
              resaltada={resaltada}
              alResaltar={resaltar}
              alAvisar={avisar}
              alPublicado={(texto, pacienteId) => setAviso((a) => ({ texto, alerta: false, pacienteId, n: a.n + 1 }))}
            />
          )}
        </main>
        <Pie />
        <div role="status" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 print:hidden">
          {aviso.texto && (
            <p className="flex max-w-lg flex-wrap items-center gap-2.5 rounded-2xl bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white shadow-xl">
              {aviso.alerta ? <CircleAlert size={18} aria-hidden className="shrink-0 text-[#FBBF24]" /> : <CircleCheck size={18} aria-hidden className="shrink-0 text-[#4ADE80]" />}
              <span className="min-w-0">{aviso.texto}</span>
              {aviso.pacienteId && (
                <button type="button" onClick={() => verEnPortal(aviso.pacienteId)} className="pointer-events-auto min-h-8 font-extrabold text-[#93C5FD] underline underline-offset-4">
                  Ver en el portal
                </button>
              )}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
