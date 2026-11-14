/*
 * Efecto "hojas": cada sección de la Home sube y tapa a la anterior, que se
 * queda atrás. Cada sección es sticky; si es más alta que la pantalla, se
 * pega por abajo (top negativo) para que se lea completa antes de taparse.
 */
export function activarHojas() {
  const main = document.querySelector("main");
  if (!main) return () => {};
  const hojas = Array.from(main.children).filter((n) => n.id !== "inicio") as HTMLElement[];
  hojas.forEach((h, i) => {
    h.classList.add("hoja");
    h.style.zIndex = String(i + 2);
  });
  const acomodar = () => {
    const alto = window.innerHeight;
    hojas.forEach((h) => {
      h.style.top = `${Math.min(0, alto - h.offsetHeight)}px`;
    });
  };
  acomodar();
  const ro = new ResizeObserver(acomodar);
  hojas.forEach((h) => ro.observe(h));
  window.addEventListener("resize", acomodar);
  return () => {
    ro.disconnect();
    window.removeEventListener("resize", acomodar);
  };
}

/** Posición de cada sección en el documento, sin contar lo que se movió por estar pegada. */
export function topesDeSecciones(): Map<string, number> {
  const mapa = new Map<string, number>();
  const main = document.querySelector("main");
  if (!main) return mapa;
  let y = main.getBoundingClientRect().top + window.scrollY;
  for (const n of Array.from(main.children) as HTMLElement[]) {
    if (n.id) mapa.set(n.id, y);
    y += n.offsetHeight;
  }
  return mapa;
}
