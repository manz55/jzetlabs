/*
 * Cobro con tarjeta. Hoy es una simulación para la demo: aprueba cualquier
 * tarjeta, menos las que terminan en 0002 (rechazo de prueba).
 *
 * Para la tienda real, aquí se conecta la pasarela de pago (la del banco o un
 * procesador local). La página nunca guarda el número de la tarjeta: lo manda
 * directo a la pasarela y solo recibe "aprobado" o "rechazado" con los últimos
 * 4 dígitos. Lo demás de la tienda (pedidos, stock, panel) no cambia.
 */
export type ResultadoPago = { aprobado: true; ultimos4: string; autorizacion: string } | { aprobado: false; ultimos4: string; motivo: string };

export async function cobrarConTarjeta(datos: { numero: string; vence: string; cvv: string; monto: number; cuotas: number }): Promise<ResultadoPago> {
  const num = datos.numero.replace(/\D/g, "");
  await new Promise((r) => setTimeout(r, 1400)); // lo que tarda la pasarela en responder
  if (num.endsWith("0002")) return { aprobado: false, ultimos4: num.slice(-4), motivo: "Fondos insuficientes" };
  return { aprobado: true, ultimos4: num.slice(-4), autorizacion: String(Date.now()).slice(-6) };
}
