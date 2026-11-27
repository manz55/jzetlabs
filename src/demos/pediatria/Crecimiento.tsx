/* Calculadora de percentil: edad en meses, peso en libras y estatura en centímetros. */
import { useState } from "react";
import { ArrowRight, CircleCheck, Info } from "lucide-react";
import { FOTOS, edadTexto } from "./datos";
import { Foto } from "./Marca";
import { KG_POR_LB, medirPeso, medirTalla, textoPercentil, type Medida, type Sexo } from "./percentil";

const numero = (t: string) => (t.trim() === "" ? NaN : Number(t.replace(",", ".")));
const entre = (n: number, a: number, b: number) => Number.isFinite(n) && n >= a && n <= b;
const ZONAS = { bajo: "Por debajo del rango", esperado: "Dentro del rango", alto: "Por arriba del rango" } as const;

export function Crecimiento({ alAgendar }: { alAgendar: (meses: number) => void }) {
  const [sexo, setSexo] = useState<Sexo>("nina");
  const [edad, setEdad] = useState("12");
  const [libras, setLibras] = useState("20");
  const [estatura, setEstatura] = useState("74");

  const m = numero(edad);
  const lb = numero(libras);
  const cm = numero(estatura);
  const mal = {
    edad: edad !== "" && !entre(m, 0, 60),
    peso: libras !== "" && !entre(lb, 3, 80),
    talla: estatura !== "" && !entre(cm, 40, 130),
  };
  const listo = entre(m, 0, 60) && entre(lb, 3, 80) && entre(cm, 40, 130);
  const peso = listo ? medirPeso(sexo, m, lb * KG_POR_LB) : null;
  const talla = listo ? medirTalla(sexo, m, cm) : null;
  const bien = peso?.zona === "esperado" && talla?.zona === "esperado";

  return (
    <section id="pa-crecimiento" className="pa-seccion">
      <div className="pa-ancho">
        <div className="pa-titulo">
          <h2>¿Cómo va creciendo?</h2>
          <p>Escriba la edad, el peso y la estatura para ver en qué percentil está su hijo, de 0 a 5 años.</p>
        </div>
        <div className="pa-crece">
          <form className="pa-caja" onSubmit={(e) => e.preventDefault()}>
            <div className="pa-segmento" role="group" aria-label="Sexo">
              <button type="button" aria-pressed={sexo === "nina"} onClick={() => setSexo("nina")}>
                Niña
              </button>
              <button type="button" aria-pressed={sexo === "nino"} onClick={() => setSexo("nino")}>
                Niño
              </button>
            </div>
            <div className="pa-medidas">
              <label className="pa-campo">
                <span>Edad (meses)</span>
                <input inputMode="numeric" value={edad} aria-invalid={mal.edad} onChange={(e) => setEdad(e.target.value)} />
              </label>
              <label className="pa-campo">
                <span>Peso (lb)</span>
                <input inputMode="decimal" value={libras} aria-invalid={mal.peso} onChange={(e) => setLibras(e.target.value)} />
              </label>
              <label className="pa-campo">
                <span>Estatura (cm)</span>
                <input inputMode="decimal" value={estatura} aria-invalid={mal.talla} onChange={(e) => setEstatura(e.target.value)} />
              </label>
            </div>
            <p className="pa-referencia">Pese a su bebé sin pañal ni ropa pesada. Antes de los 2 años la estatura se mide acostado.</p>
            <Foto src={FOTOS.bebe} alt="Pediatra sosteniendo a un bebé durante su control" className="pa-crece-foto" />
          </form>

          <div className="pa-caja pa-resultado" aria-live="polite">
            {peso && talla ? (
              <>
                <h3>{bien ? "Crece dentro del rango esperado" : "Conviene revisarlo con el pediatra"}</h3>
                <p className="pa-suave">
                  {sexo === "nina" ? "Niña" : "Niño"} de {edadTexto(Math.floor(m))}.{" "}
                  {bien ? "Peso y estatura están donde se espera para su edad." : "Al menos una medida sale del rango habitual. Un solo dato no basta para sacar conclusiones."}
                </p>
                <Barra nombre="Peso" medida={peso} rango={`${(peso.desde / KG_POR_LB).toFixed(1)} a ${(peso.hasta / KG_POR_LB).toFixed(1)} lb`} />
                <Barra nombre="Estatura" medida={talla} rango={`${talla.desde.toFixed(1)} a ${talla.hasta.toFixed(1)} cm`} />
                <button type="button" className="pa-btn pa-cita pa-lleno" onClick={() => alAgendar(Math.floor(m))}>
                  Agendar control de niño sano <ArrowRight size={18} aria-hidden />
                </button>
                <p className="pa-referencia">Referencia: patrones de crecimiento infantil de la OMS. Es una orientación y no sustituye la evaluación del pediatra.</p>
              </>
            ) : (
              <p className="pa-vacio">
                {mal.edad
                  ? "La calculadora cubre de 0 a 60 meses. Para niños mayores, el pediatra evalúa el crecimiento en consulta."
                  : mal.peso || mal.talla
                    ? "Revise el dato marcado: el peso va en libras y la estatura en centímetros."
                    : "Complete los tres datos para ver el resultado."}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Barra({ nombre, medida, rango }: { nombre: string; medida: Medida; rango: string }) {
  const Icono = medida.zona === "esperado" ? CircleCheck : Info;
  const p = textoPercentil(medida.percentil);
  return (
    <div className="pa-medida">
      <div className="pa-medida-cabeza">
        <span>
          <b>{nombre}</b>{" "}
          <span className="pa-estado-medida" data-zona={medida.zona}>
            <Icono size={14} aria-hidden /> {ZONAS[medida.zona]}
          </span>
        </span>
        <strong>Percentil {p}</strong>
      </div>
      <div className="pa-regla" role="img" aria-label={`${nombre}: percentil ${p}`}>
        <i style={{ left: `${Math.min(98, Math.max(2, medida.percentil))}%` }} />
      </div>
      <div className="pa-regla-numeros" aria-hidden>
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
      <p className="pa-suave">Rango esperado a su edad: {rango}</p>
    </div>
  );
}
