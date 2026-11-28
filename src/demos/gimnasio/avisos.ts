/* Mensajes de cobro que recepción manda por WhatsApp o correo, ya escritos. */
import { fechaEn, planDe, qz, type Socio } from "./datos";

/* abre la pasarela de ese socio */
const enlacePago = (s: Socio) => `${location.origin}/demos/gimnasio/?socio=${s.id}#pagar`;

export function mensajeDe(s: Socio) {
  const plan = planDe(s.plan);
  const nombre = s.nombre.split(" ")[0];
  if (s.dias > 7) return `Hola ${nombre}, le saluda IronPeak. Su ${plan.nombre} está al día y vence el ${fechaEn(s.dias)}. ¡Le esperamos!`;
  const cuando = s.dias <= 0 ? `venció el ${fechaEn(s.dias)}` : `vence el ${fechaEn(s.dias)}`;
  return `Hola ${nombre}, le saluda IronPeak. Su ${plan.nombre} ${cuando}. Monto a pagar: ${qz(plan.precio)}. Puede pagar en línea aquí: ${enlacePago(s)}`;
}

/* WhatsApp pide escoger el chat antes de enviar */
export const enlaceWhatsApp = (s: Socio) => `https://wa.me/?text=${encodeURIComponent(mensajeDe(s))}`;

export function enlaceCorreo(s: Socio) {
  const plan = planDe(s.plan);
  const alDia = s.dias > 7;
  const asunto = `Estado de su membresía IronPeak · N.º ${s.id}`;
  const cuerpo = [
    `Estimado(a) ${s.nombre}:`,
    "",
    "Le compartimos el estado de su membresía.",
    "",
    `Plan: ${plan.nombre}`,
    `Fecha de corte: ${fechaEn(s.dias, true)}`,
    `Estado: ${s.dias <= 0 ? "mensualidad pendiente de pago" : alDia ? "al día" : "próxima a vencer"}`,
    `${alDia ? "Próximo cobro" : "Monto a pagar"}: ${qz(plan.precio)}`,
    "",
    `Puede pagar en línea en ${enlacePago(s)} o en recepción.`,
    "",
    "Atentamente,",
    "Recepción · IronPeak Performance Club",
  ].join("\r\n");
  return `mailto:${encodeURIComponent(s.correo).replace("%40", "@")}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
}
