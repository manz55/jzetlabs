/*
 * Chat en la página con Tawk.to (Josh contesta desde la app de Tawk en su teléfono).
 *
 * Para activarlo: pegar aquí el ID que da Tawk.to en "Chat Widget". Viene en el
 * código que entregan, en la línea  s1.src='https://embed.tawk.to/AAAA/BBBB';
 *   TAWK = "AAAA/BBBB"
 * Mientras esté vacío, los botones "Escríbame" usan la ventanita de WhatsApp.
 *
 * El script de Tawk se carga solo cuando alguien toca "Escríbame" (la página
 * no pesa más ni pone cookies de Tawk antes). La burbuja de Tawk se esconde al
 * minimizar el chat, para que no tape la página.
 */
export const TAWK: string = "6af80293beb6133c412fd152/1k7cck43b";

type TawkApi = {
  onLoad?: () => void;
  onChatMinimized?: () => void;
  maximize?: () => void;
  showWidget?: () => void;
  hideWidget?: () => void;
};

declare global {
  interface Window {
    Tawk_API?: TawkApi;
    Tawk_LoadStart?: Date;
  }
}

let estado: "nada" | "cargando" | "listo" | "fallo" = "nada";

export const tawkActivo = () => TAWK !== "" && estado !== "fallo";

/** Abre el chat de Tawk. Si no carga en 8 s, llama a `siFalla` (la ventanita de WhatsApp). */
export function abrirTawk(siFalla: () => void) {
  if (estado === "listo") {
    window.Tawk_API?.showWidget?.();
    window.Tawk_API?.maximize?.();
    return;
  }
  if (estado === "cargando") return;
  estado = "cargando";

  const api: TawkApi = (window.Tawk_API = window.Tawk_API || {});
  window.Tawk_LoadStart = new Date();
  api.onLoad = () => {
    estado = "listo";
    api.showWidget?.();
    api.maximize?.();
  };
  api.onChatMinimized = () => api.hideWidget?.();

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://embed.tawk.to/${TAWK}`;
  s.charset = "UTF-8";
  s.setAttribute("crossorigin", "*");
  s.onerror = () => {
    estado = "fallo";
    siFalla();
  };
  document.head.appendChild(s);

  window.setTimeout(() => {
    if (estado === "cargando") {
      estado = "fallo";
      siFalla();
    }
  }, 8000);
}
