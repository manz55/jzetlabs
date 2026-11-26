/* Buscador de noticias: filtra mientras se escribe, sin importar tildes ni mayúsculas. */
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import Dialogo from "./Dialogo";
import { Foto, Titular } from "./Piezas";
import { NOTAS, NOTICIAS, hace, nombreSeccion, recientes } from "./datos";

const plano = (t: string) => t.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const INDICE = NOTAS.map((n) => ({ n, texto: plano([n.titulo, n.bajada, n.antetitulo, n.autor, nombreSeccion(n.seccion), ...n.cuerpo].join(" ")) }));
const SUGERENCIAS = ["café", "puertos", "ciclismo", "Atitlán", "energía"];

export default function Buscador({ abierto, alCerrar, alAbrir }: { abierto: boolean; alCerrar: () => void; alAbrir: (id: string) => void }) {
  const [consulta, setConsulta] = useState("");
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (abierto) campo.current?.focus();
    else setConsulta("");
  }, [abierto]);

  const palabras = plano(consulta).split(/\s+/).filter(Boolean);
  const halladas = palabras.length ? recientes(INDICE.filter((x) => palabras.every((p) => x.texto.includes(p))).map((x) => x.n)) : recientes(NOTICIAS).slice(0, 4);
  const abrir = (id: string) => {
    alCerrar();
    alAbrir(id);
  };

  return (
    <Dialogo abierto={abierto} alCerrar={alCerrar} titulo="Buscar noticias" className="cc-buscador">
      <div className="cc-buscador-arriba">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            campo.current?.blur();
          }}
        >
          <Search size={19} aria-hidden />
          <input ref={campo} type="search" value={consulta} onChange={(e) => setConsulta(e.target.value)} placeholder="Buscar noticias" aria-label="Buscar noticias" enterKeyHint="search" />
          <button type="button" onClick={alCerrar} aria-label="Cerrar buscador">
            <X size={19} aria-hidden />
          </button>
        </form>
        <div className="cc-sugerencias">
          {SUGERENCIAS.map((s) => (
            <button key={s} type="button" onClick={() => setConsulta(s)} aria-pressed={consulta === s}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <p className="cc-resultado-cuenta" aria-live="polite">
        {!palabras.length ? "Lo más reciente" : halladas.length === 0 ? `No hay notas sobre “${consulta.trim()}”. Pruebe con otra palabra.` : halladas.length === 1 ? "1 nota encontrada" : `${halladas.length} notas encontradas`}
      </p>
      <ul className="cc-resultados">
        {abierto &&
          halladas.map((n) => (
            <li key={n.id}>
              <div>
                <p className="cc-antetitulo">
                  {nombreSeccion(n.seccion)} <span>· {hace(n.minutos)}</span>
                </p>
                <Titular nota={n} alAbrir={abrir} />
              </div>
              <Foto nota={n} ancho={600} alto={400} tamanos="6rem" />
            </li>
          ))}
      </ul>
    </Dialogo>
  );
}
