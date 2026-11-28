import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { BandaDemos } from "../comun";
import { Agendador } from "./Agendador";
import { SECCIONES, aplicaA, hoyIso, type Cita, type Mascota, type ServicioId } from "./datos";
import { solicitudVacia, useClinica } from "./estado";
import { irA } from "./irA";
import { MisMascotas } from "./MisMascotas";
import { Nav, type Vista } from "./Nav";
import { Panel, type Dia } from "./Panel";
import { PetShop } from "./PetShop";
import { Pie } from "./Pie";
import { Hero, Servicios, Tarifario } from "./Portada";
import { Urgencias } from "./Urgencias";
import "./veterinaria.css";

const TEMA = {
  "--font-titulo": '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  "--color-tinta": "#0F172A",
  "--color-acento": "#0D9488",
  fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  fontVariantNumeric: "lining-nums tabular-nums",
} as CSSProperties;

const TITULOS: Record<Vista, string> = {
  inicio: "Huella Vital · Demo de Jzet Labs",
  mascotas: "Mis Mascotas · Huella Vital",
  panel: "Panel Veterinaria · Huella Vital",
};

const DIRECCIONES: Record<Vista, string> = { inicio: "", mascotas: "#mis-mascotas", panel: "#panel" };

const leerVista = (): Vista => {
  if (["#mis-mascotas", "#mascota"].includes(location.hash)) return "mascotas";
  return ["#panel", "#clinica"].includes(location.hash) ? "panel" : "inicio";
};
const seccionDeLaDireccion = () => SECCIONES.find((s) => `#${s.id}` === location.hash)?.id ?? "";

export default function VeterinariaDemo() {
  const clinica = useClinica();
  const [vista, setVista] = useState<Vista>(leerVista);
  const [solicitud, setSolicitud] = useState(solicitudVacia);
  const [reservada, setReservada] = useState("");
  const [mascotaActiva, setMascotaActiva] = useState("max");
  const [dia, setDia] = useState<Dia>("hoy");
  const [aviso, setAviso] = useState({ texto: "", alerta: false, n: 0 });
  const destino = useRef(seccionDeLaDireccion());

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

  function irAgendar(mascota?: Mascota) {
    setReservada("");
    if (mascota) {
      setSolicitud((s) => ({ ...s, nombre: mascota.nombre, especie: mascota.especie, servicio: aplicaA(s.servicio, mascota.especie) ? s.servicio : "consulta" }));
    }
    irSeccion("agendar");
  }

  function agendarPaquete(servicio: ServicioId) {
    setReservada("");
    setSolicitud((s) => ({ ...s, servicio, especie: aplicaA(servicio, s.especie) ? s.especie : "perro" }));
    irA("agendar");
  }

  function verCarnet(cita: Cita) {
    setMascotaActiva(cita.mascotaId);
    ir("mascotas");
  }

  function verAgenda(cita: Cita) {
    setDia(cita.fecha === hoyIso() ? "hoy" : "proximas");
    ir("panel");
  }

  return (
    <>
      <div className="relative z-50">
        <BandaDemos />
      </div>
      <div style={TEMA} className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-[#FAFAF9] text-base leading-relaxed text-[#334155]">
        <Nav vista={vista} alVista={ir} alSeccion={irSeccion} alAgendar={() => irAgendar()} />
        <main className="flex-1">
          {vista === "inicio" && (
            <>
              <Hero
                agendador={
                  <Agendador
                    clinica={clinica}
                    solicitud={solicitud}
                    alCambiar={setSolicitud}
                    reservada={reservada}
                    alReservar={(cita) => {
                      setReservada(cita?.id ?? "");
                      if (cita) setMascotaActiva(cita.mascotaId);
                    }}
                    alVerCarnet={verCarnet}
                    alVerAgenda={verAgenda}
                  />
                }
              />
              <Servicios />
              <Tarifario alAgendar={agendarPaquete} />
              <PetShop clinica={clinica} alAvisar={avisar} alVerCuenta={() => ir("mascotas")} />
              <Urgencias />
            </>
          )}
          {vista === "mascotas" && <MisMascotas clinica={clinica} activa={mascotaActiva} alElegir={setMascotaActiva} alAgendar={irAgendar} alAvisar={avisar} />}
          {vista === "panel" && <Panel clinica={clinica} dia={dia} alDia={setDia} alAvisar={avisar} />}
        </main>
        <Pie />
        <div role="status" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
          {aviso.texto && (
            <p className="flex max-w-md items-center gap-2.5 rounded-2xl bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white shadow-xl">
              {aviso.alerta ? <CircleAlert size={18} aria-hidden className="shrink-0 text-[#FB923C]" /> : <CircleCheck size={18} aria-hidden className="shrink-0 text-[#2DD4BF]" />}
              {aviso.texto}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
