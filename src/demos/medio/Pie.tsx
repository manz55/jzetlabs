/* Pie editorial: secciones, directorio, privacidad, pauta y créditos. */
import { useState } from "react";
import { X } from "lucide-react";
import Dialogo from "./Dialogo";
import { Logo } from "./Piezas";
import { DIRECTORIO, SECCIONES, anio, type Vista } from "./datos";

const TEXTOS = {
  privacidad: {
    titulo: "Política de privacidad",
    bloques: [
      ["Qué datos pedimos", "Para el boletín matutino solo pedimos su correo electrónico. La lectura del diario no exige crear una cuenta."],
      ["Para qué se usan", "El correo se utiliza únicamente para enviar el resumen que usted solicitó. No se vende ni se comparte con anunciantes."],
      ["En su equipo", "El tamaño de letra que usted elige se guarda en su navegador para respetarlo en la próxima visita. Puede borrarlo desde la configuración del navegador."],
      ["Sus derechos", "Puede darse de baja desde el enlace incluido en cada envío y pedir que se elimine su correo de la lista."],
      ["Correcciones", "Si una nota contiene un error, la redacción la corrige e indica el cambio al pie del texto."],
    ],
  },
  pauta: {
    titulo: "Pauta publicitaria",
    bloques: [
      ["Portada", "Espacios fijos entre bloques de noticias, visibles en celular y computadora, contratados por semana o por mes."],
      ["Boletín 6:30", "Un patrocinador por edición, con mención y enlace al inicio del resumen matutino."],
      ["Contenido patrocinado", "Se publica siempre identificado como publicidad y separado de las notas de la redacción."],
      ["Criterios", "La publicidad no influye en la cobertura. No se aceptan anuncios engañosos ni propaganda disfrazada de noticia."],
    ],
  },
} as const;

export default function Pie({ ahora, alElegir, alBoletin }: { ahora: Date; alElegir: (v: Vista) => void; alBoletin: () => void }) {
  const [hoja, setHoja] = useState<keyof typeof TEXTOS | null>(null);
  const texto = hoja ? TEXTOS[hoja] : null;
  return (
    <footer className="cc-pie">
      <div className="cc-ancho">
        <div className="cc-pie-marca">
          <Logo />
          <p>Noticias de Guatemala, con hora, firma y contexto.</p>
        </div>
        <div className="cc-pie-columnas">
          <nav aria-label="Secciones del diario">
            <h2>Secciones</h2>
            <ul>
              {SECCIONES.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => alElegir(s.id)}>
                    {s.nombre}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2>Directorio editorial</h2>
            <dl>
              {DIRECTORIO.map(([cargo, nombre]) => (
                <div key={cargo}>
                  <dt>{cargo}</dt>
                  <dd>{nombre}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2>El diario</h2>
            <ul>
              <li>
                <button type="button" onClick={alBoletin}>
                  Boletín matutino
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setHoja("privacidad")}>
                  Política de privacidad
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setHoja("pauta")}>
                  Pauta publicitaria
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="cc-pie-final">
          <p>© {anio(ahora)} Crónica Central. Todos los derechos reservados.</p>
          <p>
            Sitio desarrollado por <a href="/">Jzet Labs</a>
          </p>
        </div>
      </div>

      <Dialogo abierto={hoja !== null} alCerrar={() => setHoja(null)} titulo={texto?.titulo ?? "Información"} className="cc-hoja">
        {texto && (
          <div className="cc-hoja-texto">
            <button type="button" className="cc-hoja-cerrar" onClick={() => setHoja(null)} aria-label="Cerrar">
              <X size={20} aria-hidden />
            </button>
            <h2>{texto.titulo}</h2>
            {texto.bloques.map(([t, p]) => (
              <section key={t}>
                <h3>{t}</h3>
                <p>{p}</p>
              </section>
            ))}
          </div>
        )}
      </Dialogo>
    </footer>
  );
}
