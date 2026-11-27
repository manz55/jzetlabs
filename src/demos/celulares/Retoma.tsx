/* Plan Retoma: el cliente cotiza su teléfono actual y el abono se descuenta en "Mi Orden". */
import { useState } from "react";
import { Check, RefreshCw, ShoppingBag } from "lucide-react";
import { Cifra } from "./Cifra";
import { CONDICIONES, RETOMAS, abonoDe, condicion, partesDe, producto, qz, valorRetoma, type Condicion, type Nexus, type Retoma } from "./datos";

function Modelos({ id, valor, alCambiar }: { id: string; valor: string; alCambiar: (m: string) => void }) {
  return (
    <select id={id} className="nx-campo" value={valor} onChange={(e) => alCambiar(e.target.value)}>
      {Object.entries(RETOMAS).map(([marca, modelos]) => (
        <optgroup key={marca} label={marca}>
          {Object.keys(modelos).map((m) => (
            <option key={m}>{m}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

const INICIAL: Retoma = { modelo: "iPhone 13", estado: "normal" };

export function SeccionRetoma({ n, alVerOrden, alCatalogo }: { n: Nexus; alVerOrden: () => void; alCatalogo: () => void }) {
  const [elegido, setElegido] = useState<Retoma>(n.retoma ?? INICIAL);
  const valor = valorRetoma(elegido);
  const aplicado = n.retoma?.modelo === elegido.modelo && n.retoma.estado === elegido.estado;
  const hayTelefono = n.lineas.some((l) => !producto(partesDe(l.clave).id).accesorio);

  return (
    <section id="nx-retoma" className="nx-seccion nx-ancho">
      <div className="nx-retoma">
        <div className="nx-retoma-texto">
          <h2>Plan Retoma: entrega tu teléfono actual</h2>
          <p>Cotízalo aquí y úsalo como parte de pago de tu equipo nuevo. Pagas cuotas solo por la diferencia.</p>
          <p className="nx-rotulo">Para recibirlo, tu teléfono debe:</p>
          <ul>
            {["Encender y cargar", "Estar sin cuenta de iCloud o Google vinculada", "Tener el IMEI sin reporte de robo"].map((x) => (
              <li key={x}>
                <Check size={17} aria-hidden /> {x}
              </li>
            ))}
          </ul>
        </div>

        <div className="nx-retoma-cotizar">
          <label className="nx-rotulo" htmlFor="nx-retoma-modelo">
            1. Tu teléfono actual
          </label>
          <Modelos id="nx-retoma-modelo" valor={elegido.modelo} alCambiar={(modelo) => setElegido({ ...elegido, modelo })} />
          <p className="nx-rotulo">2. Estado físico</p>
          <div className="nx-condiciones" role="group" aria-label="Estado físico">
            {CONDICIONES.map((c) => (
              <button key={c.id} type="button" aria-pressed={elegido.estado === c.id} onClick={() => setElegido({ ...elegido, estado: c.id })}>
                <b>{c.nombre}</b>
                <small>{c.detalle}</small>
              </button>
            ))}
          </div>
          <div className="nx-abono nx-oscuro">
            <p aria-live="polite">
              <span>Tu bono de retoma es de hasta</span>
              <strong>
                <Cifra valor={valor} formato={qz} desde={0} />
              </strong>
            </p>
            {aplicado ? (
              <>
                <p className="nx-abono-listo" role="status">
                  <Check size={18} aria-hidden /> {hayTelefono ? "Bono aplicado a tu orden" : "Guardado: se descuenta al agregar un teléfono"}
                </p>
                <div className="nx-dos-botones">
                  <button type="button" className="nx-btn nx-azul" onClick={hayTelefono ? alVerOrden : alCatalogo}>
                    <ShoppingBag size={17} aria-hidden /> {hayTelefono ? "Ver mi orden" : "Elegir equipo"}
                  </button>
                  <button type="button" className="nx-btn nx-claro" onClick={() => n.ponerRetoma(null)}>
                    Quitar bono
                  </button>
                </div>
              </>
            ) : (
              <button type="button" className="nx-btn nx-azul nx-lleno" onClick={() => n.ponerRetoma(elegido)}>
                <RefreshCw size={17} aria-hidden /> {n.retoma ? "Cambiar al bono de este equipo" : "Aplicar a mi orden"}
              </button>
            )}
            <small>El valor final se confirma al revisar el equipo en tienda.</small>
          </div>
        </div>
      </div>
    </section>
  );
}

/* el mismo plan, compacto, dentro de "Mi Orden" */
export function RetomaOrden({ n }: { n: Nexus }) {
  const [abierto, setAbierto] = useState(false);
  const [elegido, setElegido] = useState<Retoma>(INICIAL);
  const abono = abonoDe(n.lineas, n.retoma);

  if (n.retoma) {
    const valor = valorRetoma(n.retoma);
    return (
      <div className="nx-bloque">
        <p className="nx-bloque-titulo">Plan Retoma</p>
        <div className="nx-retoma-puesto">
          <RefreshCw size={20} aria-hidden />
          <span>
            <b>
              {n.retoma.modelo} · {condicion(n.retoma.estado).nombre}
            </b>
            <small>
              {abono === 0
                ? `Bono de ${qz(valor)}: se descuenta cuando agregues un teléfono.`
                : abono < valor
                  ? `Se descuentan ${qz(abono)} de ${qz(valor)}: el bono cubre hasta el valor de los teléfonos.`
                  : `Bono de ${qz(valor)}, sujeto a revisión del equipo.`}
            </small>
          </span>
          <button type="button" className="nx-btn nx-texto" onClick={() => n.ponerRetoma(null)}>
            Quitar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nx-bloque">
      <p className="nx-bloque-titulo">Plan Retoma</p>
      {abierto ? (
        <div className="nx-retoma-mini">
          <label htmlFor="nx-orden-modelo" className="nx-oculto">
            Tu teléfono actual
          </label>
          <Modelos id="nx-orden-modelo" valor={elegido.modelo} alCambiar={(modelo) => setElegido({ ...elegido, modelo })} />
          <label htmlFor="nx-orden-condicion" className="nx-oculto">
            Estado físico
          </label>
          <select id="nx-orden-condicion" className="nx-campo" value={elegido.estado} onChange={(e) => setElegido({ ...elegido, estado: e.target.value as Condicion })}>
            {CONDICIONES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          <button type="button" className="nx-btn nx-negro nx-lleno" onClick={() => n.ponerRetoma(elegido)}>
            Aplicar bono de {qz(valorRetoma(elegido))}
          </button>
        </div>
      ) : (
        <button type="button" className="nx-btn nx-contorno nx-lleno" onClick={() => setAbierto(true)}>
          <RefreshCw size={17} aria-hidden /> Entregar mi teléfono actual
        </button>
      )}
    </div>
  );
}
