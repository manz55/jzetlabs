export function irA(id: string) {
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: quieto ? "instant" : "smooth", block: "start" });
}
