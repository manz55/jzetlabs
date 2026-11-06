/*
 * Movimiento mínimo: cada sección con la clase "aparece" se muestra suave al
 * entrar en pantalla. Sin JS o con "reducir movimiento", todo se ve completo.
 */
export function activarAparecer() {
  const root = document.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  root.classList.add("js");
  const io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  document.querySelectorAll(".aparece").forEach((n) => io.observe(n));
}
