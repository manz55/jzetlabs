export const MARCA = "Jzet Labs";
export const WHATSAPP_NUMBER = "50239915890";
export const WHATSAPP_DISPLAY = "+502 3991-5890";
export const EMAIL = "joshuazet110@gmail.com";

export function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** mensaje del botón principal: agendar el diagnóstico */
export const WA_DIAGNOSTICO = whatsappLink("Hola, Joshua. Quiero agendar un diagnóstico gratis para mi empresa.");

export const LA_TIENDA = "https://latienda-jzetlabs.vercel.app/portafolio/";
export const laTienda = (seccion?: string) => (seccion ? `${LA_TIENDA}#${seccion}` : LA_TIENDA);
