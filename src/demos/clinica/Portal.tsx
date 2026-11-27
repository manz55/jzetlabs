/* Portal del paciente: menú fijo, portada, tratamientos, agenda, especialistas y estado de cuenta. */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarCheck, Clock, MapPin, Menu, Repeat, X } from "lucide-react";
import { irA, useDemora, useEscalonado } from "../hotel/animar";
import { Agendar, type Pedido } from "./Agendar";
import { Cuenta } from "./Cuenta";
import { Foto } from "./Foto";
import { Logo } from "./Pie";
import {
  ESPECIALIDADES, FOTOS, ODONTOLOGOS, bloques, fechaLarga, formatoQ, hora12, iso, proximosDias,
  type Clinica, type Especialidad,
} from "./datos";

const MENU = [
  { id: "tratamientos", nombre: "Tratamientos" },
  { id: "agendar", nombre: "Agendar" },
  { id: "especialistas", nombre: "Especialistas" },
  { id: "cuenta", nombre: "Mi cuenta" },
];

/* el espacio libre más cercano para una evaluación */
function primeraHora(clinica: Clinica) {
  for (const fecha of proximosDias()) {
    const horas = ODONTOLOGOS.filter((o) => o.atiende.includes("Preventiva"))
      .map((o) => bloques(clinica.citas, fecha, o.id, 30).find((b) => b.libre)?.hora)
      .filter((h): h is string => !!h)
      .sort();
    if (horas.length) return { fecha, hora: horas[0] };
  }
  return null;
}

export function Portal({ clinica }: { clinica: Clinica }) {
  const [menu, setMenu] = useState(false);
  const [pedido, setPedido] = useState<Pedido>({ tratamientoId: "evaluacion", vez: 0 });

  function ir(id: string) {
    setMenu(false);
    irA(id);
  }
  function pedir(cambio: Omit<Pedido, "vez">) {
    setPedido((p) => ({ ...cambio, vez: p.vez + 1 }));
    irA("agendar");
  }

  useEffect(() => {
    if (!menu) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    addEventListener("keydown", tecla);
    return () => removeEventListener("keydown", tecla);
  }, [menu]);

  const libre = primeraHora(clinica);
  const hoy = iso(new Date());

  return (
    <>
      <header className="vv-cabeza">
        <div className="vv-ancho vv-cabeza-fila">
          <button type="button" className="vv-logo-boton" onClick={() => ir("inicio")} aria-label="Ir al inicio">
            <Logo />
          </button>
          <nav className="vv-menu" aria-label="Secciones">
            {MENU.map((m) => (
              <button key={m.id} type="button" onClick={() => ir(m.id)}>
                {m.nombre}
              </button>
            ))}
          </nav>
          <div className="vv-cabeza-botones">
            <button type="button" className="vv-btn vv-accion vv-chico" onClick={() => ir("agendar")}>
              Agendar cita
            </button>
            <button type="button" className="vv-hamburguesa" onClick={() => setMenu((v) => !v)} aria-expanded={menu} aria-controls="vv-menu-movil" aria-label={menu ? "Cerrar menú" : "Abrir menú"}>
              {menu ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </div>
        {menu && (
          <nav id="vv-menu-movil" className="vv-menu-movil" aria-label="Secciones">
            {MENU.map((m) => (
              <button key={m.id} type="button" onClick={() => ir(m.id)}>
                {m.nombre} <ArrowRight size={16} aria-hidden />
              </button>
            ))}
          </nav>
        )}
      </header>

      <main>
        <section id="inicio" className="vv-portada">
          <div className="vv-ancho vv-portada-rejilla">
            <div>
              <p className="vv-ante">Odontología integral en Zona 14</p>
              <h1>Su tratamiento, con precio claro y hora respetada</h1>
              <p className="vv-bajada">
                Cuatro especialidades en una sola clínica. Elija su tratamiento, su odontólogo y su horario; antes de confirmar ya sabe cuánto va a pagar.
              </p>
              <div className="vv-acciones">
                <button type="button" className="vv-btn vv-accion" onClick={() => ir("agendar")}>
                  <CalendarCheck size={18} aria-hidden /> Agendar mi cita
                </button>
                <button type="button" className="vv-btn vv-contorno" onClick={() => ir("tratamientos")}>
                  Ver tratamientos y precios
                </button>
              </div>
              <dl className="vv-datos">
                <div>
                  <dt>Evaluación completa</dt>
                  <dd>{formatoQ(clinica.tratamientos.find((t) => t.id === "evaluacion")!.precio)}</dd>
                </div>
                <div>
                  <dt>Pagos mensuales</dt>
                  <dd>Hasta 18 sin recargo</dd>
                </div>
                <div>
                  <dt>Sábados</dt>
                  <dd>8:00 a 13:00</dd>
                </div>
              </dl>
            </div>
            <div className="vv-portada-foto">
              <Foto src={FOTOS.portada} alt="Odontólogo explicando una radiografía a una paciente en el sillón dental" prioridad />
              {libre && (
                <button type="button" className="vv-proxima" onClick={() => pedir({ tratamientoId: "evaluacion", fecha: libre.fecha, hora: libre.hora })}>
                  <span className="vv-proxima-icono">
                    <Clock size={20} aria-hidden />
                  </span>
                  <span>
                    <span className="vv-proxima-titulo">Primera hora disponible</span>
                    <span className="vv-proxima-valor">
                      {libre.fecha === hoy ? "Hoy" : fechaLarga(libre.fecha)}, {hora12(libre.hora)}
                    </span>
                  </span>
                  <ArrowRight size={18} aria-hidden />
                </button>
              )}
            </div>
          </div>
        </section>

        <Catalogo clinica={clinica} alAgendar={(id) => pedir({ tratamientoId: id })} />

        <Agendar clinica={clinica} pedido={pedido} />

        <section id="especialistas" className="vv-seccion">
          <div className="vv-ancho">
            <div className="vv-titulo">
              <h2>Quién le atiende</h2>
              <p>Cada especialidad tiene su odontólogo. Usted elige con quién y en qué día.</p>
            </div>
            <ul className="vv-equipo">
              {ODONTOLOGOS.map((o) => (
                <li key={o.id}>
                  <Foto src={o.foto} alt={`Retrato de ${o.nombre}`} />
                  <div>
                    <h3>{o.nombre}</h3>
                    <p className="vv-area">{o.area}</p>
                    <p className="vv-suave">{o.diasTexto}</p>
                    <button
                      type="button"
                      className="vv-enlace"
                      onClick={() => pedir({ tratamientoId: clinica.tratamientos.find((t) => t.especialidad === o.atiende[0])!.id, doctorId: o.id })}
                    >
                      Ver sus horarios <ArrowRight size={15} aria-hidden />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="vv-instalaciones">
              <Foto src={FOTOS.consultorio} alt="Consultorio dental iluminado, con sillón y equipo moderno" />
              <div>
                <h3>Antes de empezar, sabe qué sigue</h3>
                <ul>
                  <li>Plan de tratamiento por escrito, con el precio de cada paso.</li>
                  <li>Citas por bloques: su hora queda reservada solo para usted.</li>
                  <li>Su saldo y sus abonos, disponibles cuando quiera consultarlos.</li>
                </ul>
                <p className="vv-con-icono">
                  <MapPin size={17} aria-hidden /> Zona 14, Ciudad de Guatemala
                </p>
              </div>
            </div>
          </div>
        </section>

        <Cuenta clinica={clinica} alAgendar={pedir} />
      </main>
    </>
  );
}

type Filtro = "Todas" | Especialidad;

function Catalogo({ clinica, alAgendar }: { clinica: Clinica; alAgendar: (id: string) => void }) {
  const [filtro, setFiltro] = useState<Filtro>("Todas");
  const cargando = useDemora(filtro, 300);
  const rejilla = useRef<HTMLUListElement>(null);
  useEscalonado(rejilla, filtro, !cargando);
  const lista = clinica.tratamientos.filter((t) => filtro === "Todas" || t.especialidad === filtro);

  return (
    <section id="tratamientos" className="vv-seccion vv-hielo">
      <div className="vv-ancho">
        <div className="vv-titulo">
          <h2>Tratamientos y precios</h2>
          <p>Precios en quetzales. Los que dicen “desde” se confirman en su evaluación, antes de empezar.</p>
        </div>
        <div className="vv-filtros" role="group" aria-label="Filtrar por especialidad">
          {(["Todas", ...ESPECIALIDADES] as Filtro[]).map((f) => (
            <button key={f} type="button" aria-pressed={filtro === f} onClick={() => setFiltro(f)}>
              {f}
            </button>
          ))}
        </div>
        <ul ref={rejilla} className="vv-catalogo" aria-busy={cargando}>
          {cargando
            ? lista.map((t) => (
                <li key={t.id} className="vv-tratamiento" aria-hidden>
                  <span className="vv-hueso" style={{ width: "35%", height: 14 }} />
                  <span className="vv-hueso" style={{ width: "82%", height: 22 }} />
                  <span className="vv-hueso" style={{ width: "100%", height: 14 }} />
                  <span className="vv-hueso" style={{ width: "64%", height: 14 }} />
                  <span className="vv-hueso" style={{ width: "46%", height: 30, marginTop: "auto" }} />
                  <span className="vv-hueso" style={{ width: "100%", height: 44 }} />
                </li>
              ))
            : lista.map((t) => (
                <li key={t.id} className="vv-tratamiento" data-entra>
                  <p className="vv-especialidad">{t.especialidad}</p>
                  <h3>{t.nombre}</h3>
                  <p className="vv-suave">{t.detalle}</p>
                  <p className="vv-meta">
                    <span>
                      <Clock size={15} aria-hidden /> {t.minutos} min
                    </span>
                    <span>
                      <Repeat size={15} aria-hidden /> {t.visitas}
                    </span>
                  </p>
                  <div className="vv-precio">
                    <p>
                      {t.desde && <small>Desde </small>}
                      <strong>{formatoQ(t.precio)}</strong>
                    </p>
                    {t.cuotas && <p className="vv-suave">o {t.cuotas.at(-1)} pagos de {formatoQ(t.precio / t.cuotas.at(-1)!)}</p>}
                  </div>
                  <button type="button" className="vv-btn vv-contorno" onClick={() => alAgendar(t.id)}>
                    Agendar <ArrowRight size={16} aria-hidden />
                  </button>
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
}
