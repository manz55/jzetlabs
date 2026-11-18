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

/** Posición real (sin el efecto de hojas pegadas) de cualquier elemento de la Home. */
function topeReal(id: string): number | null {
  const el = document.getElementById(id);
  const main = document.querySelector("main");
  if (!el || !main) return null;
  const topes = topesDeSecciones();
  if (topes.has(id)) return topes.get(id)!;
  // elemento adentro de una sección: tope de su sección + su distancia dentro de ella
  const seccion = (Array.from(main.children) as HTMLElement[]).find((n) => n.contains(el));
  if (!seccion || !seccion.id || !topes.has(seccion.id)) return el.getBoundingClientRect().top + window.scrollY;
  return topes.get(seccion.id)! + (el.getBoundingClientRect().top - seccion.getBoundingClientRect().top);
}

/** Lleva a una sección con un solo clic, y corrige si algo cambió de tamaño mientras bajaba. */
export function irASeccion(id: string, suave = true): boolean {
  const destino = () => {
    const y = topeReal(id);
    if (y === null) return null;
    const alto = (document.querySelector("header") as HTMLElement | null)?.offsetHeight ?? 0;
    return Math.max(0, y - alto);
  };
  const y = destino();
  if (y === null) return false;
  window.scrollTo({ top: y, behavior: suave ? "smooth" : "instant" });
  let intentos = 0;
  const corregir = () => {
    const y2 = destino();
    if (y2 === null) return;
    if (Math.abs(window.scrollY - y2) > 8 && intentos < 4) {
      intentos++;
      window.scrollTo({ top: y2, behavior: "instant" });
      setTimeout(corregir, 250);
    }
  };
  setTimeout(corregir, suave ? 900 : 200);
  return true;
}
