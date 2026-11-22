/* Fotos que sube el dueño: se achican en el navegador antes de guardarlas. */
export function achicarFoto(archivo: Blob): Promise<string> {
  return new Promise((ok, mal) => {
    const lector = new FileReader();
    lector.onerror = mal;
    lector.onload = () => {
      const img = new Image();
      img.onerror = mal;
      img.onload = () => {
        const max = 700;
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
        ok(c.toDataURL("image/jpeg", 0.8));
      };
      img.src = String(lector.result);
    };
    lector.readAsDataURL(archivo);
  });
}

/* una foto que ya está en el sitio, convertida para guardarla con el producto */
export const urlAFoto = async (url: string) => achicarFoto(await (await fetch(url)).blob());
