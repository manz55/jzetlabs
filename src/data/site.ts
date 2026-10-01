export const WHATSAPP_NUMBER = "50239915890";
export const WHATSAPP_DISPLAY = "+502 3991-5890";
export const EMAIL = "joshuazet110@gmail.com";
export const GITHUB = "https://github.com/manz55";

export function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const formatQ = (n: number) => `Q${Math.round(n).toLocaleString("en-US")}`;
