/* Vista "Taller y Auxilio": portada, ¿Puedo manejar así?, catálogo con precios y respaldo. */
import { useRef, useState } from "react";
import { ArrowRight, BadgeCheck, CarFront, CircleCheck, Clock, FileText, Gauge, MapPin, OctagonAlert, PackageCheck, Phone, ShieldCheck, Star, Thermometer, TriangleAlert, Truck, Vibrate, Disc3, KeyRound, ClipboardCheck, ScanLine, Crosshair, Activity, Snowflake } from "lucide-react";
import { useCarga, useEscalonado } from "./animar";
import { Cifra } from "./Piezas";
import { FILTROS, FOTOS, HORARIOS, RIESGOS, SEDES, SERVICIOS, SINTOMAS, TIPOS, foto, qz, type FallaId, type Filtro, type SintomaId, type Tipo } from "./datos";

const ICONOS: Record<SintomaId, typeof Gauge> = { check: Gauge, frenos: Disc3, temperatura: Thermometer, vibracion: Vibrate, arranque: KeyRound };
const ICONO_RIESGO = { seguro: CircleCheck, precaucion: TriangleAlert, detener: OctagonAlert };

const GARANTIAS = [
  { icono: ShieldCheck, titulo: "Garantía por escrito", texto: "6 meses o 10,000 km en mano de obra, anotada en su orden." },
  { icono: PackageCheck, titulo: "Repuestos originales y OEM", texto: "Le indicamos marca y procedencia, y le devolvemos la pieza cambiada." },
  { icono: ClipboardCheck, titulo: "Nada sin su aprobación", texto: "Si aparece algo más, se le avisa con precio y usted decide." },
  { icono: FileText, titulo: "Factura FEL", texto: "Con su NIT o como consumidor final, el mismo día de la entrega." },
];

const EQUIPOS = [
  { icono: ScanLine, titulo: "Diagnóstico Electrónico Bidireccional", equipo: ["Autel MaxiSys", "Launch X431"], texto: "Lectura de módulos ABS, airbag y transmisión, y programación de cuerpos de aceleración." },
  { icono: Crosshair, titulo: "Alineación Computarizada 3D y Balanceo", equipo: ["Bancada láser 3D", "Camber · caster · convergencia"], texto: "Ajuste de ángulos con reporte impreso antes y después." },
  { icono: Activity, titulo: "Laboratorio de Inyección y Osciloscopio", equipo: ["Ultrasonido", "Osciloscopio"], texto: "Prueba de presión de combustible, limpieza de inyectores y medición de sensores en tiempo real." },
  { icono: Snowflake, titulo: "Estación de A/C y Frenos", equipo: ["R134a / R1234yf", "Torno para discos"], texto: "Recuperadora automatizada de gas refrigerante y rectificado de discos en torno." },
];

const RESENAS = [
  { nombre: "Gabriela Ruano", carro: "Toyota RAV4", texto: "Me avisaron de los frenos con precio antes de tocarlos. Aprobé desde la oficina y recogí el carro esa tarde." },
  { nombre: "José Ajú", carro: "Nissan Frontier", texto: "Uso el pick-up para trabajar. Me dieron la hora de entrega y la cumplieron, con factura a nombre del negocio." },
  { nombre: "Lucía Monterroso", carro: "Honda Fit", texto: "Se me quedó sin batería en la Aguilar Batres. Mandé mi ubicación y llegaron a pasarme corriente." },
];

export function Inicio({
  tipo,
  alTipo,
  filtro,
  alFiltrar,
  alAgendar,
  alAuxilio,
}: {
  tipo: Tipo;
  alTipo: (t: Tipo) => void;
  filtro: Filtro;
  alFiltrar: (f: Filtro) => void;
  alAgendar: (servicio: string) => void;
  alAuxilio: (falla?: FallaId) => void;
}) {
  return (
    <>
      <section className="at-portada">
        <div className="at-ancho at-portada-fila">
          <div className="at-portada-texto">
            <p className="at-sobre">Taller automotriz en Zona 9 y Calzada Aguilar Batres</p>
            <h1>Diagnóstico claro y precio aprobado antes de reparar.</h1>
            <p className="at-bajada">Mecánica preventiva, frenos, electrónica y aire acondicionado. Usted sigue su carro por la placa y decide cada trabajo adicional.</p>
            <div className="at-botones">
              <button type="button" className="at-btn at-naranja at-grande" onClick={() => alAgendar("km5")}>
                Agendar servicio <ArrowRight size={19} aria-hidden />
              </button>
              <button type="button" className="at-btn at-rojo at-grande" onClick={() => alAuxilio()}>
                <Truck size={20} aria-hidden /> Pedir grúa / auxilio ahora
              </button>
            </div>
            <ul className="at-portada-datos">
              <li>
                <BadgeCheck size={18} aria-hidden /> Garantía escrita
              </li>
              <li>
                <PackageCheck size={18} aria-hidden /> Repuestos OEM
              </li>
              <li>
                <FileText size={18} aria-hidden /> Factura FEL
              </li>
            </ul>
          </div>
          <div className="at-portada-foto">
            <img src={foto(FOTOS.portada, 1200, 960)} alt="Mecánico revisando un vehículo con el capó abierto en un taller limpio" width={1200} height={960} fetchPriority="high" />
            <p className="at-portada-ficha">
              <Clock size={20} aria-hidden />
              <span>
                <b>Auxilio vial 24/7</b>
                Grúa, batería, llanta y calentamiento
              </span>
            </p>
          </div>
        </div>
      </section>

      <Triaje tipo={tipo} alAgendar={alAgendar} alAuxilio={alAuxilio} />
      <Catalogo tipo={tipo} alTipo={alTipo} filtro={filtro} alFiltrar={alFiltrar} alAgendar={alAgendar} />

      <section className="at-seccion at-equipo" id="at-equipo">
        <div className="at-ancho">
          <header className="at-titulo">
            <h2>Equipamiento y Tecnología de Diagnóstico</h2>
            <p>Con esto medimos su vehículo antes de recomendarle un cambio de pieza.</p>
          </header>
          <ul className="at-equipos">
            {EQUIPOS.map(({ icono: Icono, titulo, equipo, texto }) => (
              <li key={titulo}>
                <span className="at-equipo-icono">
                  <Icono size={24} aria-hidden />
                </span>
                <div>
                  <h3>{titulo}</h3>
                  <p>{texto}</p>
                  <ul aria-label="Equipo">
                    {equipo.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="at-seccion at-acero" id="at-respaldo">
        <div className="at-ancho">
          <header className="at-titulo">
            <h2>Respaldo en cada orden</h2>
            <p>Lo que recibe por escrito cuando deja su vehículo con nosotros.</p>
          </header>
          <ul className="at-garantias">
            {GARANTIAS.map(({ icono: Icono, titulo, texto }) => (
              <li key={titulo}>
                <Icono size={24} aria-hidden />
                <h3>{titulo}</h3>
                <p>{texto}</p>
              </li>
            ))}
          </ul>

          <h3 className="at-subtitulo">Lo que dicen nuestros clientes</h3>
          <ul className="at-resenas">
            {RESENAS.map((r) => (
              <li key={r.nombre}>
                <span className="at-estrellas" role="img" aria-label="5 de 5 estrellas">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <Star key={n} size={16} fill="currentColor" aria-hidden />
                  ))}
                </span>
                <blockquote>{r.texto}</blockquote>
                <p>
                  <b>{r.nombre}</b> · {r.carro}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="at-seccion" id="at-ubicacion">
        <div className="at-ancho at-ubicacion">
          <img src={foto(FOTOS.recepcion, 900, 700)} alt="Área de trabajo del taller con elevadores y vehículos en revisión" width={900} height={700} loading="lazy" />
          <div>
            <h2>Horarios y ubicación</h2>
            <ul className="at-sedes">
              {SEDES.map((s) => (
                <li key={s.nombre}>
                  <MapPin size={20} aria-hidden />
                  <div>
                    <b>{s.nombre}</b>
                    <p>{s.direccion}</p>
                    <a href={s.mapa} target="_blank" rel="noopener noreferrer">
                      Cómo llegar
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="at-horarios">
              {HORARIOS.map((h) => (
                <div key={h.dias}>
                  <dt>{h.dias}</dt>
                  <dd>{h.horas}</dd>
                </div>
              ))}
            </dl>
            <div className="at-botones">
              <button type="button" className="at-btn at-naranja" onClick={() => alAgendar("km5")}>
                Agendar servicio
              </button>
              <button type="button" className="at-btn at-rojo" onClick={() => alAuxilio("grua")}>
                <Phone size={18} aria-hidden /> Emergencia 24/7
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Triaje({ tipo, alAgendar, alAuxilio }: { tipo: Tipo; alAgendar: (servicio: string) => void; alAuxilio: (falla?: FallaId) => void }) {
  const [elegido, setElegido] = useState<SintomaId>("check");
  const s = SINTOMAS.find((x) => x.id === elegido)!;
  const Riesgo = ICONO_RIESGO[s.riesgo];
  const dictamen = useRef<HTMLDivElement>(null);
  useEscalonado(dictamen, elegido, true);

  return (
    <section className="at-seccion at-acero" id="at-triaje">
      <div className="at-ancho">
        <header className="at-titulo">
          <h2>¿Puedo manejar así?</h2>
          <p>Toque lo que siente su vehículo y reciba una orientación al instante.</p>
        </header>
        <div className="at-triaje">
          <div className="at-sintomas" role="group" aria-label="Síntomas">
            {SINTOMAS.map((x) => {
              const Icono = ICONOS[x.id];
              return (
                <button key={x.id} type="button" aria-pressed={x.id === elegido} onClick={() => setElegido(x.id)}>
                  <Icono size={22} aria-hidden />
                  <span>{x.nombre}</span>
                </button>
              );
            })}
          </div>

          <div ref={dictamen} className="at-dictamen" aria-live="polite">
            <div className="at-dictamen-alto" data-entra>
              <span className={`at-riesgo at-${s.riesgo}`}>
                <Riesgo size={18} aria-hidden /> {RIESGOS[s.riesgo]}
              </span>
              <h3>{s.nombre}</h3>
              <p>{s.resumen}</p>
            </div>
            <dl data-entra>
              <div>
                <dt>Causa probable</dt>
                <dd>{s.causa}</dd>
              </div>
              <div>
                <dt>Qué hacer ahora</dt>
                <dd>
                  <ul>
                    {s.hacer.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="at-costo">
                <dt>{s.revision}</dt>
                <dd>
                  <Cifra valor={s.precios[tipo]} formato={qz} />
                  <small>revisión para {TIPOS.find((t) => t.id === tipo)!.nombre}</small>
                </dd>
              </div>
            </dl>
            <div className="at-botones" data-entra>
              <button type="button" className="at-btn at-naranja" onClick={() => alAgendar(`sintoma-${s.id}`)}>
                Agendar ingreso <ArrowRight size={18} aria-hidden />
              </button>
              {s.riesgo === "detener" && (
                <button type="button" className="at-btn at-rojo" onClick={() => alAuxilio(s.falla ?? "grua")}>
                  <Truck size={18} aria-hidden /> Pedir grúa / auxilio
                </button>
              )}
            </div>
            <p className="at-nota" data-entra>
              Es una orientación. La causa se confirma revisando el vehículo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Catalogo({ tipo, alTipo, filtro, alFiltrar, alAgendar }: { tipo: Tipo; alTipo: (t: Tipo) => void; filtro: Filtro; alFiltrar: (f: Filtro) => void; alAgendar: (servicio: string) => void }) {
  const cargando = useCarga(filtro, 300);
  const rejilla = useRef<HTMLDivElement>(null);
  useEscalonado(rejilla, filtro, !cargando);
  const lista = SERVICIOS.filter((s) => filtro === "todos" || s.categoria === filtro);

  return (
    <section className="at-seccion" id="at-servicios">
      <div className="at-ancho">
        <header className="at-titulo">
          <h2>Servicios preventivos y correctivos</h2>
          <p>Elija su tipo de vehículo para ver el precio en quetzales, con IVA incluido.</p>
        </header>

        <div className="at-controles">
          <div className="at-segmentos" role="group" aria-label="Tipo de vehículo">
            {TIPOS.map((t) => (
              <button key={t.id} type="button" aria-pressed={tipo === t.id} onClick={() => alTipo(t.id)}>
                <CarFront size={17} aria-hidden /> {t.nombre}
              </button>
            ))}
          </div>
          <div className="at-filtros" role="group" aria-label="Categorías">
            {FILTROS.map((f) => (
              <button key={f.id} type="button" aria-pressed={filtro === f.id} onClick={() => alFiltrar(f.id)}>
                {f.nombre}
              </button>
            ))}
          </div>
        </div>

        <div ref={rejilla} className="at-rejilla" aria-busy={cargando}>
          {cargando
            ? lista.map((s) => (
                <div key={s.id} className="at-servicio at-esqueleto" aria-hidden>
                  <i className="at-hueso at-hueso-foto" />
                  <div>
                    <i className="at-hueso" style={{ width: "70%", height: 20 }} />
                    <i className="at-hueso" style={{ width: "100%" }} />
                    <i className="at-hueso" style={{ width: "45%" }} />
                    <i className="at-hueso" style={{ width: "100%", height: 46 }} />
                  </div>
                </div>
              ))
            : lista.map((s) => (
                <article key={s.id} className="at-servicio" data-entra>
                  <img src={foto(s.foto, 640, 420)} alt={s.alt} width={640} height={420} loading="lazy" />
                  <div>
                    <h3>{s.nombre}</h3>
                    <p>{s.detalle}</p>
                    <div className="at-servicio-pie">
                      <span>
                        <Cifra valor={s.precios[tipo]} formato={qz} />
                        <small>
                          <Clock size={14} aria-hidden /> {s.tiempo}
                        </small>
                      </span>
                      <button type="button" className="at-btn at-naranja" onClick={() => alAgendar(s.id)} aria-label={`Agendar ${s.nombre}`}>
                        Agendar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
        </div>
        <p className="at-nota">El precio de referencia puede variar según el modelo. Se confirma por escrito antes de trabajar.</p>
      </div>
    </section>
  );
}
