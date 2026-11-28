import { cambiar, nuevoId, type Clinica } from "./almacen";
import { CLIENTA, EXTRAS, PRODUCTOS, SERVICIOS, articulo, hoyIso, type Cargo, type Cita, type Metodo, type Pedido } from "./datos";

export const precioCita = (cita: Cita) => SERVICIOS[cita.servicio].precio + (cita.extras ?? []).reduce((s, e) => s + EXTRAS[e].precio, 0);
export const precioDe = (cargo: Cargo) => PRODUCTOS.find((p) => p.id === cargo.productoId)?.precio ?? 0;
export const totalPedido = (pedido: Pick<Pedido, "articulos">) => pedido.articulos.reduce((s, id) => s + (articulo(id)?.precio ?? 0), 0);

export function cargarACuenta(productoId: string) {
  cambiar((c) => ({ ...c, cargos: [...c.cargos, { id: nuevoId("g"), dueno: CLIENTA.nombre, productoId }] }));
}

export function quitarCargo(cargoId: string) {
  cambiar((c) => ({ ...c, cargos: c.cargos.filter((x) => x.id !== cargoId || x.cobro) }));
}

export function guardarDireccion(direccion: string) {
  cambiar((c) => ({ ...c, direccion: direccion.trim() }));
}

export function pedirDomicilio(mascotaId: string, articulos: string[]) {
  cambiar((c) => {
    const enCurso = c.pedidos.some((p) => p.mascotaId === mascotaId && p.estado !== "entregado");
    if (enCurso || !articulos.length) return c;
    return { ...c, pedidos: [...c.pedidos, { id: nuevoId("p"), mascotaId, dueno: CLIENTA.nombre, articulos, direccion: c.direccion, estado: "solicitado" }] };
  });
}

export function cancelarPedido(pedidoId: string) {
  cambiar((c) => ({ ...c, pedidos: c.pedidos.filter((p) => p.id !== pedidoId || p.estado !== "solicitado") }));
}

export function despacharPedido(pedidoId: string) {
  cambiar((c) => ({ ...c, pedidos: c.pedidos.map((p) => (p.id === pedidoId && p.estado === "solicitado" ? { ...p, estado: "ruta" } : p)) }));
}

export type PorCobrar = { dueno: string; citas: Cita[]; cargos: Cargo[]; pedidos: Pedido[]; total: number };

export function pendientesDeCobro(c: Clinica): PorCobrar[] {
  const grupos = new Map<string, PorCobrar>();
  const grupo = (dueno: string) => {
    const actual = grupos.get(dueno) ?? { dueno, citas: [], cargos: [], pedidos: [], total: 0 };
    grupos.set(dueno, actual);
    return actual;
  };
  c.citas
    .filter((x) => x.fecha === hoyIso() && !x.cobro && (x.estado === "lista" || x.estado === "entregada"))
    .forEach((x) => {
      const mascota = c.mascotas.find((m) => m.id === x.mascotaId);
      if (!mascota) return;
      const g = grupo(mascota.dueno);
      g.citas.push(x);
      g.total += precioCita(x);
    });
  c.cargos
    .filter((x) => !x.cobro)
    .forEach((x) => {
      const g = grupo(x.dueno);
      g.cargos.push(x);
      g.total += precioDe(x);
    });
  c.pedidos
    .filter((x) => x.estado === "ruta")
    .forEach((x) => {
      const g = grupo(x.dueno);
      g.pedidos.push(x);
      g.total += totalPedido(x);
    });
  return [...grupos.values()];
}

export function cobrar(dueno: string, metodo: Metodo) {
  cambiar((c) => {
    const pendiente = pendientesDeCobro(c).find((p) => p.dueno === dueno);
    if (!pendiente) return c;
    const ids = new Set([...pendiente.citas, ...pendiente.cargos, ...pendiente.pedidos].map((x) => x.id));
    const cobradoEl = hoyIso();
    return {
      ...c,
      citas: c.citas.map((x) => (ids.has(x.id) ? { ...x, cobro: metodo, estado: "entregada", estacion: undefined } : x)),
      cargos: c.cargos.map((x) => (ids.has(x.id) ? { ...x, cobro: metodo, cobradoEl } : x)),
      pedidos: c.pedidos.map((x) => (ids.has(x.id) ? { ...x, cobro: metodo, cobradoEl, estado: "entregado" } : x)),
    };
  });
}

export function ingresosDeHoy(c: Clinica) {
  const hoy = hoyIso();
  return (
    c.citas.filter((x) => x.fecha === hoy && x.cobro).reduce((s, x) => s + precioCita(x), 0) +
    c.cargos.filter((x) => x.cobradoEl === hoy).reduce((s, x) => s + precioDe(x), 0) +
    c.pedidos.filter((x) => x.cobradoEl === hoy).reduce((s, x) => s + totalPedido(x), 0)
  );
}
