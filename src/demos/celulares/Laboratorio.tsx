/* Estándares del laboratorio técnico y tarifario con filtro por marca. */
import { useRef, useState } from "react";
import { BadgeCheck, Cpu, LockKeyhole, ShieldCheck } from "lucide-react";
import { useEscalonado } from "./animar";
import { FALLAS, MARCAS, MODELOS, qz, type Falla, type Marca } from "./datos";

const ESTANDARES = [
  { icono: BadgeCheck, titulo: "Repuestos originales y grado OEM certificado", texto: "Tú eliges la calidad antes de instalar, y queda escrita en tu orden." },
  { icono: Cpu, titulo: "Micro-soldadura de placa", texto: "Reparamos fallas de carga, encendido y señal a nivel de componente, con microscopio." },
  { icono: LockKeyhole, titulo: "Privacidad total sin borrar datos", texto: "Tus fotos y chats se quedan donde están. Si hubiera que restaurar el equipo, te pedimos permiso antes." },
  { icono: ShieldCheck, titulo: "Garantía escrita de 6 meses", texto: "En repuesto Original Certificado. Calidad OEM lleva 3 meses y la limpieza por humedad, 30 días." },
];

const TIEMPOS: Record<Falla, string> = { pantalla: "45 min a 2 h", bateria: "35 min a 1 h", carga: "45 min a 1 h 30", humedad: "24 a 48 h" };
const OTROS = [
  { nombre: "Micro-soldadura de placa", tiempo: "2 a 5 días", precio: "Desde Q450 en cualquier marca" },
  { nombre: "Diagnóstico técnico", tiempo: "30 min", precio: "Q75, sin costo si reparas con nosotros" },
];

const desde = (marca: Marca, f: Falla) => Math.min(...MODELOS[marca].map((m) => m.tarifa[f][0]));

export function Laboratorio() {
  const [marca, setMarca] = useState<Marca | "Todas">("Todas");
  const tarjetas = useRef<HTMLUListElement>(null);
  const filas = useRef<HTMLTableSectionElement>(null);
  /* entran en orden solo la primera vez que se ven */
  useEscalonado(tarjetas, "estandares", 40);
  useEscalonado(filas, "tarifas", 40);
  const marcas = marca === "Todas" ? MARCAS : [marca];

  return (
    <section className="nx-lab" aria-labelledby="nx-lab-titulo">
      <div className="nx-ancho">
        <div className="nx-titulo">
          <h2 id="nx-lab-titulo">Estándares del laboratorio técnico</h2>
          <p>Así trabajamos cada equipo que entra al taller.</p>
        </div>
        <ul className="nx-estandares" ref={tarjetas}>
          {ESTANDARES.map(({ icono: Icono, titulo, texto }) => (
            <li key={titulo} data-entra>
              <Icono size={26} aria-hidden />
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </li>
          ))}
        </ul>

        <h3 className="nx-tarifas-titulo">Precios de referencia por servicio</h3>
        <div className="nx-filtros" role="group" aria-label="Filtrar tarifas por marca">
          {(["Todas", ...MARCAS] as const).map((m) => (
            <button key={m} type="button" aria-pressed={marca === m} onClick={() => setMarca(m)}>
              {m}
            </button>
          ))}
        </div>
        <table className="nx-tarifas" data-marcas={marcas.length}>
          <thead>
            <tr>
              <th scope="col">Servicio</th>
              <th scope="col">Tiempo</th>
              {marcas.map((m) => (
                <th key={m} scope="col">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody ref={filas}>
            {FALLAS.map((f) => (
              <tr key={f.id} data-entra>
                <th scope="row">{f.nombre}</th>
                <td className="nx-tarifa-tiempo">{TIEMPOS[f.id]}</td>
                {marcas.map((m) => (
                  <td key={m} data-marca={m}>
                    <small>desde</small> {qz(desde(m, f.id))}
                  </td>
                ))}
              </tr>
            ))}
            {OTROS.map((o) => (
              <tr key={o.nombre} data-entra>
                <th scope="row">{o.nombre}</th>
                <td className="nx-tarifa-tiempo">{o.tiempo}</td>
                <td colSpan={marcas.length} className="nx-tarifa-unica">
                  {o.precio}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="nx-suave">Precios en repuesto Original Certificado, según modelo. Incluyen repuesto y mano de obra: cotiza el tuyo arriba.</p>
      </div>
    </section>
  );
}
