/*
 * Vista "Arma tu Outfit": una prenda de arriba, un pantalón y un accesorio.
 * Con las tres elegidas (y su talla) el 15% se aplica solo y pasa a la orden como combo.
 */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Ruler, ShoppingBag } from "lucide-react";
import { Cifra, Foto, Tallas } from "./Piezas";
import {
  PRODUCTOS, libres, nombreTalla, precioCombo, productoDe, qz, tallasDe,
  type Pieza, type Producto, type Talla, type Vertice,
} from "./datos";

export type Paso = "arriba" | "abajo" | "accesorio";
export type Eleccion = Partial<Record<Paso, { id: string; talla: Talla | null }>>;

const PASOS: { id: Paso; titulo: string; ayuda: string; es: (p: Producto) => boolean }[] = [
  { id: "arriba", titulo: "Prenda de arriba", ayuda: "Playera, top o chaqueta", es: (p) => p.categoria === "tops" || p.categoria === "chaquetas" },
  { id: "abajo", titulo: "Pantalón", ayuda: "El que mejor te quede", es: (p) => p.categoria === "pantalones" },
  { id: "accesorio", titulo: "Accesorio", ayuda: "Talla única", es: (p) => p.categoria === "accesorios" },
];

type Props = {
  v: Vertice;
  eleccion: Eleccion;
  alElegir: (e: Eleccion) => void;
  alPasar: (piezas: Pieza[]) => void;
  alGuia: (p: Producto) => void;
};

export function Outfit({ v, eleccion, alElegir, alPasar, alGuia }: Props) {
  const { estado } = v;
  const [aviso, setAviso] = useState("");
  /* la barra del celular se quita cuando el resumen ya está a la vista */
  const resumen = useRef<HTMLElement>(null);
  const [enResumen, setEnResumen] = useState(false);
  useEffect(() => {
    const el = resumen.current;
    if (!el) return;
    const ojo = new IntersectionObserver(([x]) => setEnResumen(x.isIntersecting), { rootMargin: "0px 0px -140px 0px" });
    ojo.observe(el);
    return () => ojo.disconnect();
  }, []);

  const elegidas = PASOS.flatMap((paso) => {
    const e = eleccion[paso.id];
    return e ? [{ paso: paso.id, p: productoDe(e.id), talla: e.talla }] : [];
  });
  const listas = elegidas.filter((x) => x.talla && libres(estado, x.p.id, x.talla) > 0);
  const completo = listas.length === PASOS.length;
  const suma = elegidas.reduce((s, x) => s + estado.precios[x.p.id], 0);
  const combo = precioCombo(estado, elegidas.map((x) => ({ id: x.p.id, talla: x.talla ?? "U" })));
  const total = completo ? combo.ahora : suma;
  const pendiente = PASOS.find((paso) => !listas.some((x) => x.paso === paso.id));
  const falta = pendiente
    ? !eleccion[pendiente.id]
      ? `Elige: ${pendiente.titulo.toLowerCase()}.`
      : !eleccion[pendiente.id]!.talla
        ? `Elige la talla: ${pendiente.titulo.toLowerCase()}.`
        : "Ya no quedan unidades en esa talla; elige otra."
    : "";

  function escoger(paso: Paso, p: Producto) {
    setAviso("");
    const antes = eleccion[paso];
    /* conserva la talla al cambiar de prenda, si la nueva la tiene */
    const unica = tallasDe(p)[0] === "U";
    const talla: Talla | null = unica ? "U" : antes?.talla && libres(estado, p.id, antes.talla) > 0 ? antes.talla : null;
    alElegir({ ...eleccion, [paso]: { id: p.id, talla } });
  }

  function pasar() {
    if (!completo) {
      setAviso(falta);
      return;
    }
    alPasar(listas.map((x) => ({ id: x.p.id, talla: x.talla! })));
  }

  return (
    <div className="vx-outfit vx-ancho">
      <header className="vx-vista-titulo">
        <h1>Arma tu Outfit</h1>
        <p>Elige una pieza de cada paso. Al completar las tres pagas 15% menos.</p>
      </header>

      <div className="vx-outfit-rejilla">
        <div className="vx-pasos">
          {PASOS.map((paso, n) => {
            const e = eleccion[paso.id];
            const actual = e ? productoDe(e.id) : null;
            const hecho = listas.some((x) => x.paso === paso.id);
            return (
              <section key={paso.id} className="vx-paso" aria-labelledby={`vx-paso-${paso.id}`}>
                <div className="vx-paso-cabeza">
                  <span data-hecho={hecho}>{hecho ? <Check size={16} aria-label="Listo" /> : n + 1}</span>
                  <div>
                    <h2 id={`vx-paso-${paso.id}`}>{paso.titulo}</h2>
                    <p>{paso.ayuda}</p>
                  </div>
                </div>
                <ul className="vx-opciones">
                  {PRODUCTOS.filter(paso.es).map((p) => {
                    const agotada = tallasDe(p).every((t) => (estado.stock[p.id]?.[t] ?? 0) === 0);
                    return (
                      <li key={p.id}>
                        <button type="button" aria-pressed={e?.id === p.id} disabled={agotada} onClick={() => escoger(paso.id, p)}>
                          <Foto p={p} decorativa />
                          <b>{p.nombre}</b>
                          <span>{agotada ? "Agotada" : qz(estado.precios[p.id])}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {actual && tallasDe(actual)[0] !== "U" && (
                  <div className="vx-paso-talla">
                    <div>
                      <span>Talla de {actual.nombre.toLowerCase()}</span>
                      <button type="button" onClick={() => alGuia(actual)}>
                        <Ruler size={14} aria-hidden /> Guía de tallas
                      </button>
                    </div>
                    <Tallas p={actual} estado={estado} valor={e!.talla} alElegir={(t) => { setAviso(""); alElegir({ ...eleccion, [paso.id]: { id: actual.id, talla: t } }); }} />
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <aside ref={resumen} className="vx-resumen" id="vx-resumen" aria-label="Tu outfit">
          <h2>Tu outfit</h2>
          <ul className="vx-collage">
            {PASOS.map((paso) => {
              const x = elegidas.find((y) => y.paso === paso.id);
              return (
                <li key={paso.id}>
                  {x ? <Foto p={x.p} /> : <span className="vx-hueco">{paso.titulo}</span>}
                </li>
              );
            })}
          </ul>
          <ul className="vx-resumen-lista">
            {elegidas.map((x) => (
              <li key={x.paso}>
                <span>
                  {x.p.nombre}
                  <small>{x.talla ? `Talla ${nombreTalla(x.talla)}` : "Falta la talla"}</small>
                </span>
                <b>{qz(estado.precios[x.p.id])}</b>
              </li>
            ))}
          </ul>
          <dl>
            <div><dt>Subtotal</dt><dd>{qz(suma)}</dd></div>
            <div className={completo ? "vx-ahorro" : "vx-apagado"}>
              <dt>Descuento de outfit (15%)</dt>
              <dd>{completo ? `-${qz(combo.ahorro)}` : `${listas.length} de 3`}</dd>
            </div>
            <div className="vx-total"><dt>Total</dt><dd aria-live="polite"><Cifra valor={total} /></dd></div>
          </dl>
          <button type="button" className="vx-btn vx-oliva vx-lleno" onClick={pasar} aria-disabled={!completo}>
            <ShoppingBag size={18} aria-hidden /> Pasar a mi orden
          </button>
          <p className="vx-resumen-nota" role="status">{aviso || (completo ? `Ahorras ${qz(combo.ahorro)}. El envío se calcula en tu orden.` : falta)}</p>
        </aside>
      </div>

      {/* en el celular, el total acompaña mientras se elige */}
      <div className="vx-barra vx-oscuro" hidden={enResumen}>
        <div>
          <small>{completo ? `Ahorras ${qz(combo.ahorro)}` : `${listas.length} de 3 piezas`}</small>
          <b>{qz(total)}</b>
        </div>
        {completo ? (
          <button type="button" className="vx-btn vx-blanco" onClick={pasar}>
            Pasar a mi orden
          </button>
        ) : (
          <button type="button" className="vx-btn vx-blanco" onClick={() => document.getElementById("vx-resumen")?.scrollIntoView({ block: "start" })}>
            Ver resumen <ArrowRight size={16} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
