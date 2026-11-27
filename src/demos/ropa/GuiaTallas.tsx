/* Guía de tallas: medidas de la prenda en centímetros, tomadas en plano. */
import { useState } from "react";
import { Ventana } from "./Piezas";

export type Grupo = "superiores" | "pantalones";

const TABLAS: Record<Grupo, { nombre: string; columnas: string[]; filas: string[][]; consejo: string }> = {
  superiores: {
    nombre: "Playeras, tops y chaquetas",
    columnas: ["Talla", "Pecho", "Largo", "Hombro"],
    filas: [
      ["S", "48", "68", "42"],
      ["M", "51", "70", "44"],
      ["L", "54", "73", "46"],
      ["XL", "57", "75", "48"],
    ],
    consejo: "Extiende una prenda que te quede bien y mide el pecho de axila a axila. En chaquetas, si la usas sobre suéter, sube una talla.",
  },
  pantalones: {
    nombre: "Pantalones",
    columnas: ["Talla", "Cintura", "Cadera", "Largo"],
    filas: [
      ["S", "38", "48", "100"],
      ["M", "41", "51", "102"],
      ["L", "44", "54", "104"],
      ["XL", "47", "57", "106"],
    ],
    consejo: "La cintura y la cadera se miden con el pantalón abrochado y extendido, de orilla a orilla.",
  },
};

export function GuiaTallas({ grupo, alCerrar }: { grupo: Grupo | null; alCerrar: () => void }) {
  return (
    <Ventana abierta={grupo !== null} alCerrar={alCerrar} titulo="Guía de tallas" nota="Medidas de la prenda en centímetros">
      {grupo && <Contenido inicial={grupo} />}
    </Ventana>
  );
}

function Contenido({ inicial }: { inicial: Grupo }) {
  const [grupo, setGrupo] = useState<Grupo>(inicial);
  const t = TABLAS[grupo];
  return (
    <div className="vx-guia">
      <div className="vx-segmentos" role="group" aria-label="Tipo de prenda">
        {(["superiores", "pantalones"] as const).map((g) => (
          <button key={g} type="button" aria-pressed={grupo === g} onClick={() => setGrupo(g)}>
            {g === "superiores" ? "Superiores" : "Pantalones"}
          </button>
        ))}
      </div>
      <table>
        <caption>{t.nombre}</caption>
        <thead>
          <tr>
            {t.columnas.map((c) => (
              <th key={c} scope="col">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {t.filas.map(([talla, ...medidas]) => (
            <tr key={talla}>
              <th scope="row">{talla}</th>
              {medidas.map((m, i) => (
                <td key={i}>{m}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p>{t.consejo}</p>
      <p>
        <b>¿Dudas entre dos tallas?</b> Agrega tu estatura y peso al mensaje de WhatsApp antes de enviarlo y te recomendamos una.
      </p>
    </div>
  );
}
