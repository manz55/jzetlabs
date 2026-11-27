/* Vista "Panel Admin": resumen ejecutivo arriba y las tres áreas del negocio en pestañas. */
import { useState } from "react";
import { Boxes, PackageX, Receipt, RotateCcw, TrendingUp, Wrench } from "lucide-react";
import { Cifra } from "./Cifra";
import { PanelInventario } from "./PanelInventario";
import { PanelOrdenes } from "./PanelOrdenes";
import { PanelTaller } from "./PanelTaller";
import { POCAS, esDeHoy, qz, totalDe, type Nexus } from "./datos";

export type Seccion = "ordenes" | "inventario" | "taller";

const entero = (n: number) => String(Math.round(n));

export function Panel({ n, seccion, alSeccion, alVerOrden }: { n: Nexus; seccion: Seccion; alSeccion: (s: Seccion) => void; alVerOrden: (id: string) => void }) {
  const [reiniciar, setReiniciar] = useState(false);
  const porConfirmar = n.ordenes.filter((o) => o.estado === "nueva").length;
  /* venta es lo que el dueño ya confirmó o entregó, de órdenes de hoy */
  const deHoy = n.ordenes.filter((o) => esDeHoy(o.fecha) && (o.estado === "confirmada" || o.estado === "entregada"));
  const vendido = deHoy.reduce((s, o) => s + totalDe(o), 0);
  const enTaller = n.reparaciones.filter((r) => r.estado >= 1 && r.estado <= 4).length;
  const citas = n.reparaciones.filter((r) => r.nueva).length;
  const alertas = Object.values(n.inventario).filter((v) => v.stock <= POCAS).length;

  const cifras = [
    { id: "ordenes" as const, nombre: "Órdenes por confirmar", valor: porConfirmar, formato: entero, nota: porConfirmar ? "Atender ahora" : "Todo al día", icono: Receipt, fuerte: porConfirmar > 0 },
    { id: "ordenes" as const, nombre: "Ventas del día", valor: vendido, formato: qz, nota: `${deHoy.length} ${deHoy.length === 1 ? "orden confirmada" : "órdenes confirmadas"}`, icono: TrendingUp, fuerte: false },
    { id: "taller" as const, nombre: "Equipos en taller", valor: enTaller, formato: entero, nota: citas ? `${citas} ${citas === 1 ? "cita nueva" : "citas nuevas"}` : "Sin citas nuevas", icono: Wrench, fuerte: false },
    { id: "inventario" as const, nombre: "Alertas de stock bajo", valor: alertas, formato: entero, nota: `Presentaciones con ${POCAS} o menos`, icono: PackageX, fuerte: false },
  ];
  const secciones = [
    { id: "ordenes" as const, nombre: "Órdenes de Venta", icono: Receipt, aviso: porConfirmar },
    { id: "inventario" as const, nombre: "Inventario y Precios", icono: Boxes, aviso: 0 },
    { id: "taller" as const, nombre: "Taller Técnico", icono: Wrench, aviso: citas },
  ];

  return (
    <div className="nx-panel">
      <div className="nx-ancho">
        <div className="nx-panel-cabeza">
          <div>
            <h1>Panel de Nexus Mobile</h1>
            <p className="nx-suave">Lo urgente primero: órdenes por confirmar y equipos en taller.</p>
          </div>
          <button
            type="button"
            className={`nx-btn ${reiniciar ? "nx-peligro" : "nx-contorno"}`}
            onBlur={() => setReiniciar(false)}
            onClick={() => {
              if (!reiniciar) return setReiniciar(true);
              n.reiniciar();
              setReiniciar(false);
            }}
          >
            <RotateCcw size={16} aria-hidden /> {reiniciar ? "Sí, borrar mis cambios" : "Restablecer datos"}
          </button>
        </div>

        <div className="nx-cifras">
          {cifras.map(({ id, nombre, valor, formato, nota, icono: Icono, fuerte }) => (
            <button key={nombre} type="button" data-fuerte={fuerte} onClick={() => alSeccion(id)}>
              <span className="nx-cifra-nombre">
                {nombre} <Icono size={17} aria-hidden />
              </span>
              <strong>
                <Cifra valor={valor} formato={formato} desde={0} />
              </strong>
              <small>{nota}</small>
            </button>
          ))}
        </div>

        <div className="nx-pestanas" role="group" aria-label="Secciones del panel">
          {secciones.map(({ id, nombre, icono: Icono, aviso }) => (
            <button key={id} type="button" aria-pressed={seccion === id} onClick={() => alSeccion(id)}>
              <Icono size={18} aria-hidden />
              <span>{nombre}</span>
              {aviso > 0 && <i aria-label={`${aviso} nuevas`}>{aviso}</i>}
            </button>
          ))}
        </div>

        {seccion === "ordenes" && <PanelOrdenes n={n} />}
        {seccion === "inventario" && <PanelInventario n={n} />}
        {seccion === "taller" && <PanelTaller n={n} alVer={alVerOrden} />}
      </div>
    </div>
  );
}
