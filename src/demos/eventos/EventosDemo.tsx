/*
 * Demo: Casa Imperial · Eventos, mobiliario y convivios (negocio inventado). Tres vistas en la misma
 * dirección que comparten datos en vivo: Renta y Convivios (portada), Caja y Stands (#caja) y
 * Panel Organizador (#panel). De lo compartido entre demos solo usa la banda superior.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BandaDemos } from "../comun";
import { irA, useVista } from "./animar";
import { Caja, type Modo } from "./Caja";
import { Mobiliario, Paquetes } from "./Catalogo";
import { PAQUETES, SECCIONES, diaLargo, finesDeSemana, pendiente, renglones, sugerido, textoInvitados, useImperial, type ArtId, type Cesta, type Cuenta } from "./datos";
import { Dock, Reserva } from "./Dock";
import { LETRAS, TEMA } from "./estilos";
import { Cobertura, Garantias, Hero, type Plan } from "./Inicio";
import { Nav, type Vista } from "./Nav";
import { Panel, type Pestana } from "./Panel";
import { Pie } from "./Pie";

const leer = (): Vista => (location.hash === "#caja" ? "caja" : location.hash === "#panel" || location.hash === "#bodega" ? "panel" : "renta");
/* un enlace como #paquetes abre la portada en esa sección */
const seccionDeLaDireccion = () => SECCIONES.find((s) => `#${s.id}` === location.hash)?.id ?? "";

const TITULOS: Record<Vista, string> = {
  renta: "Casa Imperial · Demo de Jzet Labs",
  caja: "Caja y Stands · Casa Imperial",
  panel: "Panel Organizador · Casa Imperial",
};

export default function EventosDemo() {
  const imp = useImperial();
  const [vista, setVista] = useState<Vista>(leer);
  const [plan, setPlan] = useState<Plan>(() => ({ fecha: finesDeSemana(4)[3], invitados: 100, zona: "ciudad" }));
  const [cesta, setCesta] = useState<Cesta>({});
  const [paquete, setPaquete] = useState("");
  const [aviso, setAviso] = useState("");
  const [reservando, setReservando] = useState(false);
  const [modo, setModo] = useState<Modo>("caja");
  const [cuenta, setCuenta] = useState<Cuenta>({});
  const [pestana, setPestana] = useState<Pestana>("cuadre");
  const principal = useRef<HTMLElement>(null);
  /* sección de la portada a la que hay que bajar cuando ya esté pintada */
  const destino = useRef(seccionDeLaDireccion());
  useVista(principal, vista);

  useLayoutEffect(() => {
    if (document.querySelector(`link[href="${LETRAS}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = LETRAS;
    document.head.appendChild(l);
  }, []);

  /* cada vista empieza arriba, también al volver atrás */
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
      setReservando(false);
      destino.current = seccionDeLaDireccion() || destino.current;
      setVista(leer());
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
    let t = 0;
    /* se espera a que cargue la página y a que el catálogo cambie su esqueleto por las tarjetas */
    const bajar = () => {
      t = window.setTimeout(() => {
        destino.current = "";
        document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
      }, 450);
    };
    if (document.readyState === "complete") bajar();
    else addEventListener("load", bajar, { once: true });
    return () => {
      removeEventListener("load", bajar);
      window.clearTimeout(t);
    };
  }, [vista]);

  function ir(nueva: Vista) {
    setReservando(false);
    const direccion = nueva === "renta" ? location.pathname : `#${nueva}`;
    if (nueva === vista) {
      history.replaceState(null, "", direccion);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    history.pushState(null, "", direccion);
    setVista(nueva);
  }

  function irSeccion(id: string) {
    if (vista === "renta") {
      irA(id);
      return;
    }
    destino.current = id;
    ir("renta");
  }

  function poner(id: ArtId, n: number) {
    setPaquete("");
    setCesta((c) => ({ ...c, [id]: n }));
  }

  /* deja cada renglón dentro de lo que queda libre ese día */
  const ajustar = (c: Cesta, fecha: string): Cesta => Object.fromEntries(renglones(c).map((r) => [r.id, Math.min(r.n, imp.libres(fecha, r.id))]));

  function armar() {
    const ideal = sugerido(plan.invitados);
    const posible = ajustar(ideal, plan.fecha);
    const corto = renglones(ideal).some((r) => (posible[r.id] ?? 0) < r.n);
    setCesta(posible);
    setPaquete("");
    setAviso(
      `Armamos su cotización para ${textoInvitados(plan.invitados)} invitados el ${diaLargo(plan.fecha)}: sillas, mesas, manteles, toldo y luces. ${corto ? "Ese día no alcanza todo, así que quedó con lo disponible. " : ""}Ajuste las cantidades con + y −.`,
    );
    irA("mobiliario");
  }

  function cargar(id: string) {
    const p = PAQUETES.find((x) => x.id === id)!;
    setCesta({ ...p.cesta });
    setPaquete(id);
    setAviso("");
  }

  const hayCotizacion = renglones(cesta).length > 0;
  const conDock = vista === "renta" && hayCotizacion;
  const avisos = { renta: 0, caja: imp.tickets.filter((t) => pendiente(t)).length, panel: imp.ordenes.filter((o) => o.nueva).length };

  return (
    <>
      <div className="relative z-50">
        <BandaDemos />
      </div>
      {/* clip y no hidden: así la barra y los resúmenes pueden quedarse fijos al bajar */}
      <div style={TEMA} className="min-h-screen w-full max-w-full overflow-x-clip bg-[#FAF8F5] text-base leading-relaxed text-[#44403C]">
        <Nav vista={vista} avisos={avisos} alVista={ir} alSeccion={irSeccion} alCotizar={() => irSeccion("cotizar")} />

        <main ref={principal}>
          {vista === "renta" && (
            <>
              <Hero
                imp={imp}
                plan={plan}
                alCambiar={(p) => {
                  setPlan((x) => ({ ...x, ...p }));
                  setAviso("");
                }}
                alArmar={armar}
              />
              <Garantias />
              <Mobiliario imp={imp} fecha={plan.fecha} cesta={cesta} aviso={aviso} alPoner={poner} />
              <Paquetes imp={imp} fecha={plan.fecha} actual={paquete} alCargar={cargar} />
              <Cobertura zona={plan.zona} alElegir={(zona) => setPlan((x) => ({ ...x, zona }))} />
            </>
          )}
          {vista === "caja" && <Caja imp={imp} modo={modo} alModo={setModo} cuenta={cuenta} alCuenta={setCuenta} />}
          {vista === "panel" && <Panel imp={imp} pestana={pestana} alPestana={setPestana} />}
        </main>

        {/* espacio para que lo fijo de abajo no tape el final */}
        <div className={conDock ? "bg-[#1C1917] pb-52 sm:pb-40 lg:pb-28" : vista === "caja" ? "bg-[#1C1917] max-lg:pb-20" : undefined}>
          <Pie />
        </div>

        {conDock && (
          <Dock
            imp={imp}
            plan={plan}
            cesta={cesta}
            alReservar={() => setReservando(true)}
            alAjustar={() => setCesta(ajustar(cesta, plan.fecha))}
            alVaciar={() => {
              setCesta({});
              setPaquete("");
              setAviso("");
            }}
          />
        )}
        {reservando && (
          <Reserva
            imp={imp}
            plan={plan}
            cesta={cesta}
            alCerrar={() => setReservando(false)}
            alConfirmada={() => {
              setCesta({});
              setPaquete("");
              setAviso("");
            }}
            alPanel={() => {
              setPestana("logistica");
              ir("panel");
            }}
          />
        )}
      </div>
    </>
  );
}
