/*
 * Vista "Taller y Auxilio". Primero lo que se entiende en 5 segundos (quiénes son, qué carros,
 * qué repuestos y por qué confiar) y debajo las herramientas, reseñas y ubicación.
 */
import { useRef, useState, type CSSProperties } from "react";
import { Activity, ArrowRight, BadgeCheck, Camera, CarFront, CircleCheck, Clock, Crosshair, Disc3, Gauge, KeyRound, MapPin, OctagonAlert, PackageCheck, Phone, ScanLine, ShieldCheck, Snowflake, Star, Thermometer, TriangleAlert, Truck, UserRound, Vibrate, Wrench } from "lucide-react";
import { useAlVer, useCarga, useEscalonado, useTramos } from "./animar";
import { Cifra } from "./Piezas";
import { FILTROS, FOTOS, HORARIOS, RIESGOS, SEDES, SERVICIOS, SINTOMAS, TIPOS, foto, qz, type FallaId, type Filtro, type SintomaId, type Tipo } from "./datos";

const ICONOS: Record<SintomaId, typeof Gauge> = { check: Gauge, frenos: Disc3, temperatura: Thermometer, vibracion: Vibrate, arranque: KeyRound };
const ICONO_RIESGO = { seguro: CircleCheck, precaucion: TriangleAlert, detener: OctagonAlert };

const MARCAS = [
  { origen: "Japonés y Coreano", marcas: ["Toyota", "Mazda", "Honda", "Nissan", "Hyundai", "Kia", "Mitsubishi"] },
  { origen: "Americano", marcas: ["Ford", "Chevrolet", "Jeep"] },
  { origen: "Europeo", marcas: ["Volkswagen", "Audi", "BMW", "Mercedes-Benz"] },
];

const REGLAS = [
  { icono: ShieldCheck, titulo: "Cero sorpresas", texto: "Nadie desarma ni cambia una pieza sin su aprobación escrita por WhatsApp." },
  { icono: PackageCheck, titulo: "Devolución de repuestos", texto: "Le entregamos en caja cada pieza reemplazada para que compruebe el cambio." },
  { icono: Camera, titulo: "Evidencia en bahía", texto: "Fotos y video del hallazgo antes de autorizar trabajos adicionales." },
];

const CALIDADES = [
  { icono: BadgeCheck, titulo: "Original de Agencia", texto: "Pieza genuina importada con número de parte de fabricante.", marcas: [] },
  { icono: PackageCheck, titulo: "OEM Certificado (Equipo Original)", texto: "Marcas líderes que fabrican para las agencias, con la misma durabilidad y mejor precio.", marcas: ["Bosch", "Denso", "Brembo", "KYB", "NGK", "Aisin"] },
  { icono: Wrench, titulo: "Alternativo Garantizado", texto: "Opciones confiables seleccionadas por nuestro laboratorio para mantenimiento económico, siempre con garantía escrita.", marcas: [] },
];

const PASOS = [
  { titulo: "Recepción e inventario físico", texto: "Anotamos kilometraje, combustible, golpes y herramienta." },
  { titulo: "Diagnóstico con escáner y presupuesto claro", texto: "Recibe la falla explicada y el precio antes de decidir." },
  { titulo: "Reparación con repuesto aprobado", texto: "Se instala la calidad que usted escogió." },
  { titulo: "Prueba en ruta, limpieza y factura FEL", texto: "Probamos el vehículo y se lo entregamos limpio, con su factura." },
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

/* formatos fijos para las cifras que cuentan */
const conMas = (n: number) => `+${n}`;
const entero = (n: number) => String(n);

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
  const todo = useRef<HTMLDivElement>(null);
  const portada = useRef<HTMLElement>(null);
  const pasos = useRef<HTMLOListElement>(null);
  useEscalonado(portada, "portada", true);
  useAlVer(todo);
  useTramos(pasos, PASOS.length - 1);

  return (
    <div ref={todo}>
      <section ref={portada} className="at-portada">
        <div className="at-ancho at-portada-fila">
          <div>
            <p className="at-sobre" data-entra>
              Taller multimarca en Zona 9 y Aguilar Batres
            </p>
            <h1 data-entra>Mecánica general, diagnóstico electrónico y frenos con precio aprobado antes de tocar su carro.</h1>
            <div className="at-botones" data-entra>
              <button type="button" className="at-btn at-naranja at-grande" onClick={() => alAgendar("km5")}>
                Agendar servicio <ArrowRight size={19} aria-hidden />
              </button>
              <button type="button" className="at-btn at-rojo at-grande" onClick={() => alAuxilio("grua")}>
                <Truck size={20} aria-hidden /> Pedir grúa 24/7
              </button>
            </div>
            <ul className="at-metricas" data-entra>
              <li>
                <Cifra valor={14} formato={conMas} desdeCero />
                <span>años de experiencia</span>
              </li>
              <li>
                <Cifra valor={6} formato={entero} desdeCero />
                <span>elevadores en bahía</span>
              </li>
              <li>
                <strong>6 meses / 10,000 km</strong>
                <span>de garantía escrita</span>
              </li>
            </ul>
          </div>
          <div className="at-portada-foto" data-entra>
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

      <section className="at-marcas" id="at-marcas">
        <div className="at-ancho">
          <h2>Marcas que atendemos</h2>
          <div className="at-marcas-grupos">
            {MARCAS.map((g) => (
              <div key={g.origen} data-ver>
                <h3>{g.origen}</h3>
                <ul>
                  {g.marcas.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="at-seccion" id="at-nosotros">
        <div className="at-ancho at-nosotros">
          <img src={foto(FOTOS.recepcion, 900, 900)} alt="Área de trabajo limpia del taller, con elevadores y vehículos en revisión" width={900} height={900} loading="lazy" data-ver />
          <div>
            <div data-ver>
              <h2>Quiénes somos y cómo trabajamos</h2>
              <p className="at-nosotros-intro">Un taller multimarca de mecánica general, electrónica y frenos, donde usted decide con el presupuesto a la vista.</p>
              <p className="at-jefe-taller">
                <span>
                  <UserRound size={24} aria-hidden />
                </span>
                <span>
                  <b>Ing. Roberto Méndez</b>
                  <small>Jefe de Taller · Certificación en Diagnóstico Electrónico</small>
                </span>
              </p>
              <h3>Nuestras 3 reglas de hierro</h3>
            </div>
            <ul className="at-reglas">
              {REGLAS.map(({ icono: Icono, titulo, texto }) => (
                <li key={titulo} data-ver>
                  <Icono size={22} aria-hidden />
                  <p>
                    <b>{titulo}</b>
                    {texto}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="at-seccion at-acero" id="at-calidad">
        <div className="at-ancho">
          <header className="at-titulo" data-ver>
            <h2>Usted elige la calidad y el presupuesto</h2>
            <p>Estos son los tres tipos de repuesto que instalamos. Antes de aprobar, sabe cuál va en su carro.</p>
          </header>
          <ul className="at-calidad">
            {CALIDADES.map(({ icono: Icono, titulo, texto, marcas }) => (
              <li key={titulo} data-ver>
                <Icono size={26} aria-hidden />
                <h3>{titulo}</h3>
                <p>{texto}</p>
                {marcas.length > 0 && (
                  <ul aria-label="Marcas">
                    {marcas.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="at-seccion at-proceso" id="at-proceso">
        <div className="at-ancho">
          <h2 data-ver>Proceso blindado en 4 pasos</h2>
          <ol ref={pasos} className="at-pasos">
            {PASOS.map((p, n) => (
              <li key={p.titulo} style={{ "--i": n } as CSSProperties} data-ver>
                {n < PASOS.length - 1 && <i aria-hidden />}
                <span>{n + 1}</span>
                <div>
                  <h3>{p.titulo}</h3>
                  <p>{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Triaje tipo={tipo} alAgendar={alAgendar} alAuxilio={alAuxilio} />
      <Catalogo tipo={tipo} alTipo={alTipo} filtro={filtro} alFiltrar={alFiltrar} alAgendar={alAgendar} />

      <section className="at-seccion at-equipo" id="at-equipo">
        <div className="at-ancho">
          <header className="at-titulo" data-ver>
            <h2>Equipamiento y Tecnología de Diagnóstico</h2>
            <p>Con esto medimos su vehículo antes de recomendarle un cambio de pieza.</p>
          </header>
          <ul className="at-equipos">
            {EQUIPOS.map(({ icono: Icono, titulo, equipo, texto }) => (
              <li key={titulo} data-ver>
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

      <section className="at-seccion at-acero" id="at-resenas">
        <div className="at-ancho">
          <header className="at-titulo" data-ver>
            <h2>Reseñas de clientes</h2>
          </header>
          <ul className="at-resenas">
            {RESENAS.map((r) => (
              <li key={r.nombre} data-ver>
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
          <img src={foto(FOTOS.elevadores, 900, 700)} alt="Nave del taller con elevadores hidráulicos" width={900} height={700} loading="lazy" data-ver />
          <div data-ver>
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
    </div>
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
