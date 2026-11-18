/*
 * Arranque común de las demos: pinta la demo de esta dirección y deja lista
 * la barra de arriba para cambiar a las otras sin recargar la página.
 */
import { StrictMode, useEffect, useRef, useState, type ComponentType } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { RUTAS, irADemo, normalizar, precargar, registrar } from "./navegar";

/* Todas las letras que usan las demos, para que al cambiar de una a otra no brinque el texto */
const FUENTES =
  "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Caveat:wght@600&family=DM+Serif+Display:ital@0;1&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Instrument+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";

function App({ inicial, C0 }: { inicial: string; C0: ComponentType }) {
  const [actual, setActual] = useState({ ruta: inicial, C: C0 });
  const rutaActual = useRef(inicial);
  rutaActual.current = actual.ruta;
  registrar(inicial, C0, (ruta, C) => flushSync(() => setActual({ ruta, C })));

  useEffect(() => {
    // atrás y adelante del navegador
    // (los saltos dentro de la misma demo, como #tienda o #panel, no cambian nada aquí)
    const volver = () => {
      if (normalizar(location.pathname) === rutaActual.current) return;
      if (!irADemo(location.href, false)) location.reload();
    };
    addEventListener("popstate", volver);
    return () => removeEventListener("popstate", volver);
  }, []);

  const { C } = actual;
  return <C key={actual.ruta} />;
}

export function iniciar(C: ComponentType) {
  const ruta = normalizar(location.pathname);
  const root = createRoot(document.getElementById("root")!);
  // se pinta de una vez para que la página llegue completa y la transición no muestre un blanco
  flushSync(() =>
    root.render(
      <StrictMode>
        <App inicial={ruta} C0={C} />
      </StrictMode>,
    ),
  );

  // con calma, después de cargar: las letras de todas las demos y su código, para cambiar al instante
  const luego = (fn: () => void) => ("requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 3000 }) : setTimeout(fn, 1500));
  luego(() => {
    if (!document.querySelector(`link[href="${FUENTES}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = FUENTES;
      document.head.appendChild(l);
    }
    Object.keys(RUTAS).forEach((r) => r !== ruta && precargar(r));
  });
}
