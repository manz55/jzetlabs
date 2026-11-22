/*
 * Demo: "Órbita Celulares" (tienda inventada, datos de ejemplo).
 * Dos partes: la tienda que ve el cliente y el panel que solo ve el dueño
 * (#admin). Lo que hace el cliente (comprar, pagar, pedir reparación o
 * devolución) le aparece al dueño.
 */
import { useEffect, useState } from "react";
import { BandaDemos, PartesDemo, CierreJzet } from "../comun";
import { TiendaCliente } from "./Tienda";
import { PanelDueno } from "./Admin";
import { useTienda } from "./datos";
import { entroCliente, ganchos, salioCliente } from "./bot";

type Vista = "tienda" | "admin";

export default function CelularesDemo() {
  const t = useTienda();
  /* el bot puede preparar pedidos y ocultar productos desde cualquier pantalla */
  ganchos.preparar = (p) => t.setPedidos((ps) => ps.map((x) => (x.id === p.id ? { ...x, estado: "preparando", nuevo: false } : x)));
  ganchos.ocultar = (nombre) => t.setProductos((ps) => ps.map((x) => (x.nombre === nombre ? { ...x, visible: false } : x)));
  const [vista, setVista] = useState<Vista>(() => (location.hash === "#admin" ? "admin" : "tienda"));

  useEffect(() => {
    const cambio = () => setVista(location.hash === "#admin" ? "admin" : "tienda");
    addEventListener("hashchange", cambio);
    return () => removeEventListener("hashchange", cambio);
  }, []);
  /* mientras la tienda está abierta, el bot cuenta un cliente más en línea */
  useEffect(() => {
    if (vista !== "tienda") return;
    entroCliente();
    return () => salioCliente();
  }, [vista]);
  function irA(v: Vista) {
    history.replaceState(null, "", v === "admin" ? "#admin" : location.pathname);
    setVista(v);
    window.scrollTo({ top: 0 });
  }

  return (
    <div>
      <BandaDemos />
      <PartesDemo fondo={"#2a1b45"} actual={vista} alCambiar={irA} partes={[{ id: "tienda", nombre: "La tienda", quien: "Lo que ve su cliente: equipos, precios y pedido" }, { id: "admin", nombre: "Panel del dueño", quien: "Lo que ve usted: pedidos, ventas e inventario" }] as const} />

      {vista === "tienda" ? (
        <TiendaCliente t={t} />
      ) : (
        // por ahora se entra sin contraseña; en la tienda real cada quien tendrá su usuario
        <PanelDueno t={t} alSalir={() => irA("tienda")} alTienda={() => irA("tienda")} />
      )}

      {vista === "tienda" && <CierreJzet demo="tienda de celulares" />}
    </div>
  );
}
