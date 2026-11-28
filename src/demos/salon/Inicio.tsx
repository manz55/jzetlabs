/* Vista "Servicios y Citas": portada, compromisos, diagnóstico capilar, catálogo y sucursales. */
import { useRef, useState } from "react";
import { ArrowRight, Check, Clock, FileSignature, FlaskConical, Leaf, MapPin, Navigation, Plus, ShieldCheck } from "lucide-react";
import { useAlVer, useCarga, useEscalonado } from "./animar";
import {
  CATEGORIAS, DIAGNOSTICO, EQUIPO, ESTADOS_PELO, FOTOS, OBJETIVOS, SERVICIOS, SUCURSALES,
  abiertaAhora, fechaCercana, hora12, nombresDe, proximaHora, qz, sucursal, tiempo,
  type Categoria, type Cita, type EstadoPelo, type Objetivo, type ServicioId, type SucId,
} from "./datos";
import { Cifra, Foto } from "./Piezas";

export type Filtro = "Todos" | Categoria;

const COMPROMISOS = [
  { icono: FlaskConical, titulo: "Prueba de elasticidad previa", texto: "Antes de aclarar probamos un mechón. Si el cabello está comprometido no lo decoloramos: primero lo recuperamos.", sello: "15 minutos, sin costo en color" },
  { icono: FileSignature, titulo: "Presupuesto cerrado por escrito", texto: "Recibe el precio total antes de empezar. No hay cargos sorpresa por gramos extra de tinte ni por largo.", sello: "Se firma antes de la primera mezcla" },
  { icono: Leaf, titulo: "Fórmulas sin amoníaco agresivo", texto: "Coloración profesional de alta gama Wella, cuidado Kérastase y protector Olaplex. Su fórmula queda anotada en su expediente.", sello: "Cada gramo queda registrado" },
];

export function Inicio({
  citas,
  suc,
  alSuc,
  filtro,
  alFiltrar,
  elegidos,
  alAlternar,
  alAgregar,
  alAgendar,
  alDiagnostico,
}: {
  citas: Cita[];
  suc: SucId;
  alSuc: (s: SucId) => void;
  filtro: Filtro;
  alFiltrar: (f: Filtro) => void;
  elegidos: ServicioId[];
  alAlternar: (id: ServicioId) => void;
  alAgregar: (ids: ServicioId[]) => void;
  alAgendar: () => void;
  alDiagnostico: () => void;
}) {
  const raiz = useRef<HTMLDivElement>(null);
  useAlVer(raiz);
  return (
    <div ref={raiz}>
      <Portada citas={citas} suc={suc} alSuc={alSuc} alAgendar={alAgendar} alDiagnostico={alDiagnostico} />
      <Garantias />
      <Diagnostico elegidos={elegidos} alAgregar={alAgregar} alAgendar={alAgendar} />
      <Catalogo filtro={filtro} alFiltrar={alFiltrar} elegidos={elegidos} alAlternar={alAlternar} />
      <Sucursales alElegir={(s) => { alSuc(s); alAgendar(); }} />
    </div>
  );
}

function Portada({ citas, suc, alSuc, alAgendar, alDiagnostico }: { citas: Cita[]; suc: SucId; alSuc: (s: SucId) => void; alAgendar: () => void; alDiagnostico: () => void }) {
  const actual = sucursal(suc);
  const libre = proximaHora(citas, suc);
  const abierta = abiertaAhora(actual);
  return (
    <section className="al-portada">
      <div className="al-ancho al-portada-rejilla">
        <div className="al-portada-texto">
          <div className="al-sucursal-selector" role="radiogroup" aria-label="Elija su sucursal">
            {SUCURSALES.map((s) => (
              <button key={s.id} type="button" role="radio" aria-checked={suc === s.id} onClick={() => alSuc(s.id)}>
                <MapPin size={15} aria-hidden /> {s.nombre}
              </button>
            ))}
          </div>
          <h1>
            Colorimetría de precisión, balayage y salud capilar
            <em> con diagnóstico previo y precio cerrado antes de iniciar.</em>
          </h1>
          <div className="al-portada-botones">
            <button type="button" className="al-btn al-terra al-grande" onClick={alAgendar}>
              Agendar cita <ArrowRight size={18} aria-hidden />
            </button>
            <button type="button" className="al-btn al-linea al-grande" onClick={alDiagnostico}>
              Diagnosticar mi cabello
            </button>
          </div>
          <dl className="al-metricas">
            <div>
              <dt>+10 años</dt>
              <dd>de experiencia</dd>
            </div>
            <div>
              <dt>Productos</dt>
              <dd>Kérastase · Wella · Olaplex</dd>
            </div>
            <div>
              <dt>Garantía de tono</dt>
              <dd>ajuste sin costo en 7 días</dd>
            </div>
          </dl>
        </div>

        <figure className="al-portada-foto">
          <Foto id={FOTOS.portada} alt="Colorista aplicando color con papel aluminio" ancho={900} alto={1080} pronto />
          <figcaption>
            <p className={abierta ? "al-abierta" : "al-cerrada"}>
              {actual.nombre} · {abierta ? "abierta ahora" : "cerrada ahora"}
            </p>
            {libre ? (
              <p>
                Próxima hora libre: <b>{fechaCercana(libre.fecha).toLowerCase()}, {hora12(libre.hora)}</b> con {libre.quien.nombre.split(" ")[0]}
              </p>
            ) : (
              <p>Agenda completa esta semana.</p>
            )}
            <p className="al-suave">{actual.direccion}</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Garantias() {
  return (
    <section id="al-garantias" className="al-seccion al-arena">
      <div className="al-ancho">
        <header className="al-titulo" data-ver>
          <h2>Tres compromisos antes de tocar su color</h2>
          <p>Así evitamos las dos cosas que más preocupan: el cabello dañado y una cuenta distinta a la conversada.</p>
        </header>
        <ol className="al-compromisos">
          {COMPROMISOS.map(({ icono: Icono, titulo, texto, sello }, i) => (
            <li key={titulo} data-ver>
              <div className="al-compromiso-cabeza">
                <span className="al-icono">
                  <Icono size={22} aria-hidden />
                </span>
                <span className="al-numero">0{i + 1}</span>
              </div>
              <h3>{titulo}</h3>
              <p>{texto}</p>
              <p className="al-sello">
                <ShieldCheck size={16} aria-hidden /> {sello}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Diagnostico({ elegidos, alAgregar, alAgendar }: { elegidos: ServicioId[]; alAgregar: (ids: ServicioId[]) => void; alAgendar: () => void }) {
  const [estado, setEstado] = useState<EstadoPelo>("natural");
  const [objetivo, setObjetivo] = useState<Objetivo>("balayage");
  const res = DIAGNOSTICO[estado][objetivo];
  const agregado = res.servicios.every((s) => elegidos.includes(s));
  const caja = useRef<HTMLDivElement>(null);
  useEscalonado(caja, estado + objetivo);
  return (
    <section id="al-diagnostico" className="al-seccion">
      <div className="al-ancho">
        <header className="al-titulo" data-ver>
          <h2>Diagnóstico capilar</h2>
          <p>Dos preguntas y sabe cuánto tiempo apartar, cuánto invertir y qué le recomendamos.</p>
        </header>
        <div className="al-diag">
          <div className="al-diag-preguntas">
            <fieldset>
              <legend>1. ¿Cómo está su cabello hoy?</legend>
              <div className="al-opciones al-tres">
                {ESTADOS_PELO.map((e) => (
                  <label key={e.id} className="al-opcion">
                    <input type="radio" name="al-estado" checked={estado === e.id} onChange={() => setEstado(e.id)} />
                    <span>
                      <b>{e.nombre}</b>
                      <small>{e.detalle}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>2. ¿Qué quiere lograr?</legend>
              <div className="al-opciones al-dos">
                {OBJETIVOS.map((o) => (
                  <label key={o.id} className="al-opcion">
                    <input type="radio" name="al-objetivo" checked={objetivo === o.id} onChange={() => setObjetivo(o.id)} />
                    <span>
                      <b>{o.nombre}</b>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div ref={caja} className="al-resultado" aria-live="polite">
            <p className="al-resultado-sobre">Su recomendación</p>
            <h3>{res.titulo}</h3>
            <dl>
              <div data-entra>
                <dt>Tiempo estimado en sillón</dt>
                <dd>{tiempo(res.minutos)}</dd>
              </div>
              <div data-entra>
                <dt>Rango de inversión</dt>
                <dd>
                  <Cifra valor={res.desde} dinero /> a <Cifra valor={res.hasta} dinero />
                </dd>
              </div>
            </dl>
            <p data-entra>{res.recomendacion}</p>
            <p data-entra className="al-resultado-antes">
              <FlaskConical size={16} aria-hidden /> Antes de empezar: {res.antes.charAt(0).toLowerCase() + res.antes.slice(1)}
            </p>
            <p data-entra className="al-resultado-servicios">Servicios: {nombresDe(res.servicios)}</p>
            <button
              type="button"
              className="al-btn al-claro al-lleno al-grande"
              onClick={() => {
                alAgregar(res.servicios);
                alAgendar();
              }}
            >
              {agregado ? "Elegir hora" : "Agendar con esta recomendación"} <ArrowRight size={18} aria-hidden />
            </button>
            <p className="al-resultado-nota">El precio final se cierra por escrito en su diagnóstico, antes de iniciar.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Catalogo({ filtro, alFiltrar, elegidos, alAlternar }: { filtro: Filtro; alFiltrar: (f: Filtro) => void; elegidos: ServicioId[]; alAlternar: (id: ServicioId) => void }) {
  const cargando = useCarga(filtro, 300);
  const lista = SERVICIOS.filter((s) => filtro === "Todos" || s.cat === filtro);
  const rejilla = useRef<HTMLUListElement>(null);
  useEscalonado(rejilla, filtro, !cargando);
  return (
    <section id="al-servicios" className="al-seccion al-arena">
      <div className="al-ancho">
        <header className="al-titulo" data-ver>
          <h2>Servicios y precios</h2>
          <p>Agregue uno o varios a su cita. El precio indicado es el inicial de cada servicio.</p>
        </header>
        <div className="al-pildoras" role="group" aria-label="Filtrar servicios">
          {(["Todos", ...CATEGORIAS] as Filtro[]).map((f) => (
            <button key={f} type="button" aria-pressed={filtro === f} onClick={() => alFiltrar(f)}>
              {f}
            </button>
          ))}
        </div>
        <ul ref={rejilla} className="al-catalogo" aria-busy={cargando}>
          {cargando
            ? lista.map((s) => (
                <li key={s.id} className="al-ficha al-esqueleto" aria-hidden>
                  <span className="al-hueso al-hueso-foto" />
                  <div className="al-ficha-cuerpo">
                    <span className="al-hueso" style={{ width: "70%", height: "1.3rem" }} />
                    <span className="al-hueso" />
                    <span className="al-hueso" style={{ width: "45%" }} />
                    <span className="al-hueso al-hueso-boton" />
                  </div>
                </li>
              ))
            : lista.map((s) => {
                const puesto = elegidos.includes(s.id);
                return (
                  <li key={s.id} className={`al-ficha ${puesto ? "al-puesta" : ""}`} data-entra>
                    <Foto id={s.foto} alt={s.alt} ancho={640} alto={460} />
                    <div className="al-ficha-cuerpo">
                      <p className="al-ficha-cat">{s.cat}</p>
                      <h3>{s.nombre}</h3>
                      <p className="al-ficha-detalle">{s.detalle}</p>
                      <div className="al-ficha-datos">
                        <span>
                          <Clock size={15} aria-hidden /> {tiempo(s.dura)}
                        </span>
                        <b>
                          <small>desde</small> {qz(s.precio)}
                        </b>
                      </div>
                      <button type="button" className={`al-btn al-lleno ${puesto ? "al-oscuro" : "al-linea"}`} aria-pressed={puesto} onClick={() => alAlternar(s.id)}>
                        {puesto ? <Check size={17} aria-hidden /> : <Plus size={17} aria-hidden />}
                        {puesto ? "Agregado" : "Agregar a mi cita"}
                      </button>
                    </div>
                  </li>
                );
              })}
        </ul>
      </div>
    </section>
  );
}

function Sucursales({ alElegir }: { alElegir: (s: SucId) => void }) {
  return (
    <section id="al-sucursales" className="al-seccion">
      <div className="al-ancho">
        <header className="al-titulo" data-ver>
          <h2>Dos salones, un mismo expediente</h2>
          <p>Su fórmula queda registrada y la puede continuar en cualquiera de las dos sucursales.</p>
        </header>
        <div className="al-sucursales">
          {SUCURSALES.map((s) => (
            <article key={s.id} data-ver>
              <Foto id={s.foto} alt={s.alt} ancho={900} alto={560} />
              <div className="al-sucursal-cuerpo">
                <h3>{s.nombre}</h3>
                <p>{s.direccion}</p>
                <p className="al-suave">{s.referencia}</p>
                <dl>
                  {s.horario.map(([d, h]) => (
                    <div key={d}>
                      <dt>{d}</dt>
                      <dd>{h}</dd>
                    </div>
                  ))}
                </dl>
                <ul>
                  {EQUIPO.filter((e) => e.suc === s.id).map((e) => (
                    <li key={e.id}>
                      <b>{e.nombre}</b> {e.rol}, {e.anios} años
                    </li>
                  ))}
                </ul>
                <div className="al-sucursal-botones">
                  <button type="button" className="al-btn al-terra" onClick={() => alElegir(s.id)}>
                    Agendar en {s.nombre}
                  </button>
                  <a className="al-btn al-linea" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.mapa)}`} target="_blank" rel="noopener noreferrer">
                    <Navigation size={16} aria-hidden /> Cómo llegar
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
