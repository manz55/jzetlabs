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
  /* el bot elige técnico (el disponible con menos equipos) y resuelve devoluciones por falla */
  ganchos.asignar = (id) => {
    const enCurso = (tid: string) => t.reparaciones.filter((r) => r.tecnico === tid && r.estado !== "entregado").length;
    const x = [...t.tecnicos].filter((y) => y.activo).sort((a, b) => enCurso(a.id) - enCurso(b.id))[0];
    if (!x) return null;
    t.setReparaciones((rs) => rs.map((r) => (r.id === id ? { ...r, tecnico: x.id } : r)));
    return x.nombre;
  };
  ganchos.resolverDev = (id, ok) => {
    const d = t.devoluciones.find((y) => y.id === id);
    t.setDevoluciones((ds) => ds.map((y) => (y.id === id ? { ...y, estado: ok ? "aprobada" : "rechazada", nueva: false } : y)));
    if (ok && d) {
      const p = t.pedidos.find((y) => y.id === d.pedido);
      t.setPedidos((ps) => ps.map((y) => (y.id === d.pedido ? { ...y, estado: "devuelto" } : y)));
      if (p) t.setStock((s) => { const c = structuredClone(s); p.lineas.forEach((l) => { c[l.id] = c[l.id] ?? {}; c[l.id][p.sucursal] = (c[l.id][p.sucursal] ?? 0) + l.cantidad; }); return c; });
    }
  };
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
