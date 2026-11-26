import { ACERO, LINEA, NAVY, ROJO, TEXTO } from "./datos";

/* Todo va bajo .industek o con el prefijo ik- para no chocar con las demás demos. */
export const ESTILOS = `
.industek { background: #fff; color: ${NAVY}; font-family: ${TEXTO}; font-weight: 500; font-size: 16px; }
.industek h1, .industek h2, .industek h3 { color: inherit; font-family: ${TEXTO}; font-weight: 700; letter-spacing: -.025em; line-height: 1.14; }
.industek :focus-visible { outline: 3px solid ${ROJO}; outline-offset: 2px; border-radius: 4px; }
.industek .ik-oscuro :focus-visible, .industek .ik-oscuro:focus-visible { outline-color: #fff; }
/* números y precios: la misma letra, con cifras del mismo ancho */
.ik-num { font-variant-numeric: tabular-nums; }
.ik-sobre { font-size: .84rem; font-weight: 700; color: ${ROJO}; }
.ik-gris { color: #475569; }
.ik-ancho { width: 100%; max-width: 80rem; margin-inline: auto; padding-inline: 1rem; }
@media (min-width: 640px) { .ik-ancho { padding-inline: 1.75rem; } }

/* logo: solo letras y un acento en CSS */
.ik-logo { display: inline-flex; align-items: center; gap: .65rem; line-height: 1; }
.ik-logo-barra { width: 9px; height: 34px; background: ${ROJO}; transform: skewX(-16deg); box-shadow: 13px 0 0 -2px #64748b; margin-right: 8px; }
.ik-logo-nombre { display: block; font-size: 1.32rem; font-weight: 700; letter-spacing: .04em; }
.ik-logo-giro { display: block; margin-top: .22rem; font-size: .7rem; font-weight: 600; letter-spacing: .02em; opacity: .75; }

.ik-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 48px; padding: .65rem 1.15rem;
  border: 1px solid transparent; border-radius: 8px; font-weight: 700; font-size: .95rem; line-height: 1.2;
  transition: background-color .15s, border-color .15s, color .15s, transform .1s; }
.ik-btn:active:not(:disabled) { transform: translateY(1px); }
.ik-btn:disabled { opacity: .5; cursor: not-allowed; }
.ik-rojo { background: ${ROJO}; color: #fff; }
.ik-rojo:hover:not(:disabled) { background: #a41818; }
.ik-navy { background: ${NAVY}; color: #fff; }
.ik-navy:hover:not(:disabled) { background: #1e293b; }
.ik-linea { background: #fff; color: ${NAVY}; border-color: #cbd5e1; }
.ik-linea:hover:not(:disabled) { border-color: ${NAVY}; }
.ik-contorno { color: #fff; border-color: #475569; }
.ik-contorno:hover { border-color: #fff; }

.ik-campo { width: 100%; min-height: 48px; padding: .6rem .8rem; background: #fff; color: ${NAVY}; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; font-weight: 500; }
.ik-campo:hover { border-color: #94a3b8; }
.ik-campo:focus { border-color: ${NAVY}; }
.ik-campo[aria-invalid="true"] { border-color: ${ROJO}; box-shadow: 0 0 0 1px ${ROJO}; }
.ik-error { margin-top: .3rem; color: #a41818; font-size: .85rem; font-weight: 700; }

.ik-tarjeta { background: #fff; border: 1px solid ${LINEA}; border-radius: 12px; }
.ik-alterna { background: ${ACERO}; border-block: 1px solid ${LINEA}; }

/* catálogo: fila compacta en celular, ficha vertical desde 640 px */
.ik-grid { display: grid; gap: .85rem; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 640px) { .ik-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.1rem; } }
@media (min-width: 960px) { .ik-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1220px) { .ik-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.ik-ficha { display: grid; grid-template-columns: 104px minmax(0, 1fr); grid-template-rows: auto 1fr; column-gap: .85rem; height: 100%; padding: .85rem;
  transition: border-color .18s, box-shadow .18s; }
.ik-foto { display: block; width: 104px; height: 104px; object-fit: cover; border-radius: 8px; background: #f1f5f9; }
.ik-compra { grid-column: 1 / -1; align-self: end; }
@media (min-width: 640px) {
  .ik-ficha { display: flex; flex-direction: column; padding: 0; overflow: hidden; }
  .ik-foto { width: 100%; height: auto; aspect-ratio: 4 / 3; border-radius: 0; border-bottom: 1px solid ${LINEA}; }
  .ik-datos { padding: .9rem 1rem 0; }
  .ik-compra { margin-top: auto; padding: 0 1rem 1rem; align-self: stretch; }
}
@media (hover: hover) { .ik-ficha:hover { border-color: #94a3b8; box-shadow: 0 14px 30px -22px rgba(15,23,42,.55); } }

.ik-pestana { flex-shrink: 0; min-height: 44px; padding: .5rem 1rem; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; color: ${NAVY}; font-weight: 600; font-size: .9rem; transition: background-color .15s, color .15s, border-color .15s; }
.ik-pestana:hover { border-color: ${NAVY}; }
.ik-pestana[aria-pressed="true"] { background: ${NAVY}; border-color: ${NAVY}; color: #fff; }

/* esqueletos con brillo suave */
.ik-hueso { display: block; border-radius: 6px; background: linear-gradient(100deg, #e9eef5 30%, #f8fafc 50%, #e9eef5 70%); background-size: 220% 100%; animation: ik-brillo 1.1s linear infinite; }
.ik-oscuro .ik-hueso { background-image: linear-gradient(100deg, #1e293b 30%, #334155 50%, #1e293b 70%); background-color: #1e293b; }
@keyframes ik-brillo { from { background-position: 120% 0; } to { background-position: -100% 0; } }

/* calculadora */
.ik-campo-obra { display: flex; align-items: center; min-height: 52px; border: 1px solid #334155; border-radius: 8px; background: #0b1222; }
.ik-campo-obra:focus-within { border-color: #94a3b8; }
.ik-campo-obra input { flex: 1; min-width: 0; height: 50px; padding: 0 .8rem; background: transparent; color: #fff; font-size: 1.15rem; font-weight: 700; outline: none; }
.ik-campo-obra:has(input[aria-invalid="true"]) { border-color: #f87171; }

/* pedido */
.ik-cajon { margin: 0 0 0 auto; padding: 0; border: 0; height: 100dvh; max-height: 100dvh; width: min(31rem, 100vw); max-width: 100vw; background: ${ACERO}; color: ${NAVY}; }
.ik-cajon::backdrop { background: rgba(15, 23, 42, .55); }
.ik-cajon[open] { animation: ik-entra .32s cubic-bezier(.2, .8, .2, 1); }
@keyframes ik-entra { from { transform: translateX(100%); } }

@media (prefers-reduced-motion: reduce) {
  .ik-hueso, .ik-cajon[open] { animation: none; }
  .ik-btn, .ik-ficha, .ik-pestana { transition: none; }
}
`;
