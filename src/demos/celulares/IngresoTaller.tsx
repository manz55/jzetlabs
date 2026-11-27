/* Panel: registro rápido de un equipo que llega al mostrador. */
import { useState, type FormEvent } from "react";
import { CircleCheck, ClipboardPlus } from "lucide-react";
import { FALLAS, MARCAS, MODELOS, PUNTOS, SIN_REVISAR, textoTiempo, type Falla, type Nexus, type Recepcion, type Reparacion } from "./datos";

const TARIFAS = MARCAS.flatMap((m) => MODELOS[m]);
/* si el modelo está en la lista de precios, se propone el costo y el tiempo */
const tarifaDe = (modelo: string, f: Falla) => TARIFAS.find((m) => m.nombre.toLowerCase() === modelo.trim().toLowerCase())?.tarifa[f];

const VACIO = { cliente: "", modelo: "", falla: "pantalla" as Falla, costo: "", imei: "", recepcion: SIN_REVISAR as Recepcion };

export function IngresoTaller({ n, alVer }: { n: Nexus; alVer: (id: string) => void }) {
  const [datos, setDatos] = useState(VACIO);
  const [error, setError] = useState("");
  const [nuevo, setNuevo] = useState<Reparacion | null>(null);
  const sugerido = tarifaDe(datos.modelo, datos.falla);
  /* lo que escriba el dueño manda sobre el precio de lista */
  const costo = datos.costo || (sugerido ? String(sugerido[0]) : "");

  const cambiar = (c: Partial<typeof VACIO>) => {
    setDatos((d) => ({ ...d, ...c }));
    setError("");
    setNuevo(null);
  };

  function registrar(e: FormEvent) {
    e.preventDefault();
    if (datos.cliente.trim().length < 2) return setError("Escribe el nombre del cliente.");
    if (datos.modelo.trim().length < 2) return setError("Escribe el modelo del equipo.");
    if (!(Number(costo) > 0)) return setError("Escribe el costo en quetzales.");
    if (datos.imei && datos.imei.length !== 4) return setError("Del IMEI van los últimos 4 dígitos.");
    const r = n.registrarIngreso({
      cliente: datos.cliente.trim(),
      modelo: datos.modelo.trim(),
      falla: datos.falla,
      precio: Number(costo),
      tiempo: sugerido ? textoTiempo(sugerido[1]) : "Por confirmar",
      recepcion: datos.recepcion,
      imei: datos.imei || undefined,
    });
    setDatos(VACIO);
    setNuevo(r);
  }

  return (
    <form className="nx-ingreso" onSubmit={registrar} noValidate aria-labelledby="nx-ingreso-titulo">
      <h2 id="nx-ingreso-titulo">
        <ClipboardPlus size={20} aria-hidden /> Registrar ingreso de equipo
      </h2>
      <div className="nx-ingreso-campos">
        <label>
          <span>Cliente</span>
          <input className="nx-campo" value={datos.cliente} maxLength={60} autoComplete="off" placeholder="Nombre y apellido" onChange={(e) => cambiar({ cliente: e.target.value })} />
        </label>
        <label>
          <span>Modelo</span>
          <input className="nx-campo" value={datos.modelo} maxLength={40} autoComplete="off" list="nx-modelos" placeholder="Ej. iPhone 14" onChange={(e) => cambiar({ modelo: e.target.value, costo: "" })} />
        </label>
        <label>
          <span>Falla</span>
          <select className="nx-campo" value={datos.falla} onChange={(e) => cambiar({ falla: e.target.value as Falla, costo: "" })}>
            {FALLAS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Costo en Q</span>
          <input className="nx-campo" value={costo} inputMode="numeric" placeholder="0" onChange={(e) => cambiar({ costo: e.target.value.replace(/\D/g, "").slice(0, 6) })} />
        </label>
        <button type="submit" className="nx-btn nx-azul">
          Registrar ingreso
        </button>
      </div>
      <fieldset className="nx-recibir">
        <legend>Checklist de recepción: marca lo que está bien</legend>
        <div className="nx-casillas">
          {PUNTOS.map((p) => (
            <label key={p.id}>
              <input type="checkbox" checked={datos.recepcion[p.id]} onChange={(e) => cambiar({ recepcion: { ...datos.recepcion, [p.id]: e.target.checked } })} />
              {p.casilla}
            </label>
          ))}
        </div>
        <label className="nx-imei">
          <span>IMEI, últimos 4 (opcional)</span>
          <input className="nx-campo" inputMode="numeric" value={datos.imei} placeholder="1234" onChange={(e) => cambiar({ imei: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
        </label>
      </fieldset>
      <datalist id="nx-modelos">
        {TARIFAS.map((m) => (
          <option key={m.nombre} value={m.nombre} />
        ))}
      </datalist>
      {error && (
        <p className="nx-error" role="alert">
          {error}
        </p>
      )}
      {nuevo && (
        <p className="nx-ingreso-listo" role="status">
          <CircleCheck size={20} aria-hidden />
          <span>
            <b>{nuevo.id} registrada</b> · {nuevo.modelo}, asignada a {nuevo.tecnico}.
          </span>
          <button type="button" className="nx-btn nx-texto" onClick={() => alVer(nuevo.id)}>
            Ver como cliente
          </button>
        </p>
      )}
    </form>
  );
}
