/* Inicio: el sitio público del centro. Portada, servicios, la doctora, lo que dicen los papás y cómo llegar. */
import { useEffect, useState } from "react";
import {
  ArrowRight, Baby, CalendarCheck, Car, Clock, HeartPulse, MapPin, MessageCircle, Quote, ShieldCheck, Syringe, Thermometer,
} from "lucide-react";
import { irA } from "../hotel/animar";
import type { PedidoRapido } from "./CitaRapida";
import { Foto } from "./Marca";
import { FOTOS, PEDIATRAS, enlaceWhatsApp, formatoQ, motivoPor, type MotivoId } from "./datos";

const SERVICIOS: { motivo: MotivoId; titulo: string; texto: string; icono: typeof Baby; desde?: boolean }[] = [
  { motivo: "control", titulo: "Control del niño sano", texto: "Peso, estatura, desarrollo, sueño y alimentación, con tiempo para sus preguntas.", icono: HeartPulse },
  { motivo: "vacunacion", titulo: "Vacunación", texto: "Revisión antes de aplicar y carné digital al día. El precio de cada vacuna se suma.", icono: Syringe, desde: true },
  { motivo: "sintomas", titulo: "Consulta por síntomas", texto: "Fiebre, tos, diarrea o dolor de oído, con indicaciones por escrito para la casa.", icono: Thermometer },
  { motivo: "recien", titulo: "Recién nacido y lactancia", texto: "Las primeras semanas: peso, ombligo, sueño y apoyo para amamantar.", icono: Baby },
];

/* Testimonios de muestra: se cambian por reseñas verdaderas del centro antes de publicar para un cliente. */
const TESTIMONIOS = [
  { texto: "Entramos a la hora apartada y la doctora nos explicó cada vacuna sin prisa. Salimos sabiendo cuándo volver.", quien: "Mamá de una bebé de 6 meses" },
  { texto: "Mi hijo le tenía miedo a la consulta. Le hablaron a él primero y se dejó revisar tranquilo.", quien: "Papá de un niño de 4 años" },
  { texto: "Me gusta tener el carné en el teléfono. Ya no ando buscando el papel antes de cada cita.", quien: "Mamá de dos niñas" },
];

const doctora = PEDIATRAS[0];

export function Inicio({ alAgendar, alPortal }: { alAgendar: (p?: Partial<PedidoRapido>) => void; alPortal: (seccion?: string) => void }) {
  return (
    <main>
      <section id="pa-portada" className="pa-portada">
        <div className="pa-ancho pa-portada-rejilla">
          <div>
            <p className="pa-ante">
              <MapPin size={16} aria-hidden /> Zona 15, Ciudad de Guatemala
            </p>
            <h1>Su hijo, atendido a la hora y sin carreras</h1>
            <p className="pa-bajada">
              Consultas puntuales de 30 minutos para el control del niño sano y la vacunación, con pediatras que escuchan primero y explican con palabras sencillas.
            </p>
            <div className="pa-acciones">
              <button type="button" className="pa-btn pa-cita" onClick={() => alAgendar()}>
                <CalendarCheck size={18} aria-hidden /> Agendar consulta
              </button>
              <button type="button" className="pa-btn pa-contorno" onClick={() => irA("pa-servicios")}>
                Ver servicios y tarifas <ArrowRight size={18} aria-hidden />
              </button>
            </div>
            <ul className="pa-promesas">
              <li>
                <Clock size={20} aria-hidden /> 30 minutos por consulta, con hora apartada
              </li>
              <li>
                <HeartPulse size={20} aria-hidden /> Control del niño sano de 0 a 15 años
              </li>
              <li>
                <Syringe size={20} aria-hidden /> Vacunación con carné digital
              </li>
            </ul>
          </div>
          <div className="pa-portada-foto">
            <Foto src={FOTOS.portada} alt="Pediatra vacunando a un bebé que está en brazos de su mamá" prioridad />
          </div>
        </div>
      </section>

      <section id="pa-servicios" className="pa-seccion pa-salvia">
        <div className="pa-ancho">
          <div className="pa-titulo">
            <h2>Servicios pediátricos</h2>
            <p>Tarifas claras antes de llegar. Se paga en la clínica.</p>
          </div>
          <ul className="pa-servicios">
            {SERVICIOS.map((s) => (
              <li key={s.motivo}>
                <span className="pa-servicio-icono">
                  <s.icono size={22} aria-hidden />
                </span>
                <h3>{s.titulo}</h3>
                <p className="pa-suave">{s.texto}</p>
                <div className="pa-precio">
                  <span>
                    <strong>{formatoQ(motivoPor(s.motivo).precio)}</strong>
                    <small>{s.desde ? "más la vacuna" : "por consulta"}</small>
                  </span>
                </div>
                <button type="button" className="pa-btn pa-chico pa-contorno pa-lleno" onClick={() => alAgendar({ motivo: s.motivo })}>
                  Agendar<span className="pa-oculto">: {s.titulo}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="pa-pie-vacunas">
            <button type="button" className="pa-enlace" onClick={() => alPortal("pa-vacunas")}>
              Ver el precio de cada vacuna por edad <ArrowRight size={16} aria-hidden />
            </button>
          </p>
        </div>
      </section>

      <section id="pa-doctora" className="pa-seccion">
        <div className="pa-ancho pa-doctora">
          <Foto src={doctora.foto} alt={`${doctora.nombre} en su consultorio`} />
          <div>
            <p className="pa-ante">Conozca a su pediatra</p>
            <h2>{doctora.nombre}</h2>
            <p className="pa-credencial">
              <ShieldCheck size={18} aria-hidden /> Médica pediatra · Colegiada activa, Colegio de Médicos y Cirujanos de Guatemala
            </p>
            <p className="pa-doctora-texto">
              Atiende pediatría general, recién nacidos y lactancia. Su consulta está pensada para que los papás salgan sin dudas y el niño sin miedo.
            </p>
            <ul className="pa-enfoque">
              <li>
                <strong>Primero escucha</strong>
                <span>Lo que usted ha visto en casa es parte del diagnóstico.</span>
              </li>
              <li>
                <strong>Explica sin tecnicismos</strong>
                <span>Se lleva por escrito qué hacer, qué vigilar y cuándo volver.</span>
              </li>
              <li>
                <strong>Acompaña el crecimiento</strong>
                <span>Cada control se compara con el anterior, no solo con una tabla.</span>
              </li>
            </ul>
            <button type="button" className="pa-btn pa-cita" onClick={() => alAgendar({ pediatraId: doctora.id })}>
              <CalendarCheck size={18} aria-hidden /> Agendar con la Dra. Morales
            </button>
            <p className="pa-equipo-linea">
              También atienden en el centro el {PEDIATRAS[1].nombre} ({PEDIATRAS[1].area.toLowerCase()}) y la {PEDIATRAS[2].nombre} ({PEDIATRAS[2].area.toLowerCase()}).
            </p>
          </div>
        </div>
      </section>

      <section id="pa-testimonios" className="pa-seccion pa-salvia">
        <div className="pa-ancho">
          <div className="pa-titulo">
            <h2>Lo que cuentan los papás</h2>
          </div>
          <ul className="pa-testimonios">
            {TESTIMONIOS.map((t) => (
              <li key={t.quien}>
                <Quote size={26} aria-hidden />
                <blockquote>{t.texto}</blockquote>
                <footer>{t.quien}</footer>
              </li>
            ))}
          </ul>
          <p className="pa-muestra">Testimonios ilustrativos.</p>
        </div>
      </section>

      <section id="pa-ubicacion" className="pa-seccion">
        <div className="pa-ancho">
          <div className="pa-ubicacion">
            <Foto src={FOTOS.sala} alt="Sala de espera amplia con luz natural y sillas junto a la ventana" />
            <div>
              <h2>Visítenos en Zona 15</h2>
              <dl>
                <div>
                  <dt>
                    <MapPin size={20} aria-hidden />
                    <span>Ubicación</span>
                  </dt>
                  <dd>Zona 15, Ciudad de Guatemala, con fácil acceso desde Carretera a El Salvador. La dirección exacta se la enviamos al confirmar.</dd>
                </div>
                <div>
                  <dt>
                    <Clock size={20} aria-hidden />
                    <span>Horarios</span>
                  </dt>
                  <dd>
                    Lunes a viernes de 8:00 a 12:30 y de 14:00 a 17:30.
                    <br />
                    Sábado de 8:00 a 12:30.
                  </dd>
                </div>
                <div>
                  <dt>
                    <Car size={20} aria-hidden />
                    <span>Parqueo</span>
                  </dt>
                  <dd>Parqueo para pacientes sin costo durante su consulta.</dd>
                </div>
              </dl>
              <div className="pa-ubicacion-botones">
                <a
                  className="pa-btn pa-cita"
                  href={enlaceWhatsApp("Hola, Centro Pediátrico Los Álamos. Quisiera información para llegar y apartar una consulta.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={18} aria-hidden /> Escribir por WhatsApp
                </a>
                <button type="button" className="pa-btn pa-claro" onClick={() => alAgendar()}>
                  Agendar consulta
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Flotante alAgendar={() => alAgendar()} />
    </main>
  );
}

/* en celular: el botón de cita aparece cuando la portada ya quedó arriba */
function Flotante({ alAgendar }: { alAgendar: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const portada = document.getElementById("pa-portada");
    if (!portada) return;
    const ojo = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting && e.boundingClientRect.top < 0));
    ojo.observe(portada);
    return () => ojo.disconnect();
  }, []);
  return (
    <button type="button" className="pa-btn pa-cita pa-flotante" data-visible={visible} onClick={alAgendar}>
      <CalendarCheck size={18} aria-hidden /> Agendar consulta
    </button>
  );
}
