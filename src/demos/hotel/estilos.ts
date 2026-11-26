export const LETRAS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";

const HUESO = "#FAF9F6";
const ARENA = "#F2EFE9";
const BORDE = "#E5E0D8";
const BOSQUE = "#1B2E26";
const TERRACOTA = "#B45309";
const TITULAR = "'Playfair Display', Georgia, serif";
const TEXTO = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
const SUAVE = "#57625B";

/* Todo va bajo .posada o con el prefijo pv- para no chocar con las demás demos. */
export const ESTILOS = `
.posada { background: ${HUESO}; color: ${BOSQUE}; font-family: ${TEXTO}; font-weight: 400; font-size: 16px; line-height: 1.6; }
.posada h1, .posada h2, .posada h3 { color: inherit; font-family: ${TITULAR}; font-weight: 600; font-variant-numeric: lining-nums; letter-spacing: -.01em; line-height: 1.18; }
.posada :focus-visible { outline: 3px solid ${TERRACOTA}; outline-offset: 2px; border-radius: 4px; }
.posada .pv-oscuro :focus-visible { outline-color: #fff; }
.posada section[id] { scroll-margin-top: .5rem; }
.pv-num { font-variant-numeric: tabular-nums lining-nums; }
.pv-suave { color: ${SUAVE}; }
.pv-ancho { width: 100%; max-width: 74rem; margin-inline: auto; padding-inline: 1.15rem; }
@media (min-width: 640px) { .pv-ancho { padding-inline: 2rem; } }
.pv-seccion { padding-block: 3.5rem; }
@media (min-width: 900px) { .pv-seccion { padding-block: 5.5rem; } }
.pv-arena { background: ${ARENA}; border-block: 1px solid ${BORDE}; }
.pv-h2 { font-size: clamp(1.75rem, 4.6vw, 2.6rem); }

/* logo: solo letras y un rombo */
.pv-logo { display: inline-flex; align-items: center; gap: .75rem; line-height: 1; }
.pv-rombo { width: 11px; height: 11px; flex-shrink: 0; transform: rotate(45deg); background: ${TERRACOTA}; box-shadow: 0 0 0 4px ${HUESO}, 0 0 0 5px currentColor; margin-left: 5px; }
.pv-logo-tipo { display: block; font-size: .72rem; font-weight: 600; letter-spacing: .02em; opacity: .75; }
.pv-logo-nombre { display: block; margin-top: .25rem; font-family: ${TITULAR}; font-size: 1.28rem; font-weight: 700; }
.pv-oscuro .pv-rombo { box-shadow: 0 0 0 4px ${BOSQUE}, 0 0 0 5px currentColor; }

.pv-enlace { display: inline-flex; align-items: center; min-height: 44px; font-weight: 500; font-size: .95rem; text-decoration: none; border-bottom: 1px solid transparent; }
.pv-enlace:hover { text-decoration: underline; text-underline-offset: 5px; }

/* botones */
.pv-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 48px; padding: .65rem 1.25rem;
  border: 1px solid transparent; border-radius: 8px; font-weight: 600; font-size: .95rem; line-height: 1.25; text-align: center;
  transition: background-color .15s, border-color .15s, color .15s, transform .1s; }
.pv-btn:active:not(:disabled) { transform: translateY(1px); }
.pv-btn:disabled { cursor: not-allowed; }
.pv-accion { background: ${TERRACOTA}; color: #fff; }
.pv-accion:hover:not(:disabled) { background: #92430A; }
.pv-accion:disabled { background: ${ARENA}; color: ${SUAVE}; border-color: ${BORDE}; }
.pv-linea { color: ${BOSQUE}; border-color: #BDB5A8; background: transparent; }
.pv-linea:hover:not(:disabled) { border-color: ${BOSQUE}; }
.pv-elegido { background: #fff; color: ${TERRACOTA}; border-color: ${TERRACOTA}; }
.pv-elegido:hover { background: #FDF3EA; }

/* portada */
.pv-portada { position: relative; isolation: isolate; display: flex; align-items: flex-end; min-height: 23rem; height: 47svh; max-height: 40rem; color: #fff; background: ${BOSQUE}; }
@media (min-width: 640px) { .pv-portada { min-height: 27rem; height: 62svh; } }
.pv-portada img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }
@media (min-width: 860px) { .pv-portada img { object-position: 50% 18%; } }
.pv-portada::after { content: ""; position: absolute; inset: 0; z-index: -1; background: rgba(14, 24, 19, .46); }
.pv-portada h1 { font-size: clamp(2.15rem, 6.6vw, 4rem); max-width: 17ch; text-wrap: balance; }

/* barra de disponibilidad */
.pv-barra { position: relative; z-index: 2; margin-top: -3rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 14px; box-shadow: 0 24px 44px -30px rgba(27,46,38,.5);
  display: grid; gap: .75rem; padding: 1rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.pv-barra > .pv-todo { grid-column: 1 / -1; }
@media (min-width: 860px) {
  .pv-barra { grid-template-columns: 1fr 1fr 12.5rem auto; align-items: end; gap: 1rem; padding: 1.25rem; }
  .pv-barra > .pv-todo { grid-column: auto; }
}
.pv-rotulo { display: flex; align-items: center; gap: .4rem; margin-bottom: .35rem; font-size: .82rem; font-weight: 600; color: ${SUAVE}; }
.pv-campo { display: block; width: 100%; min-width: 0; min-height: 50px; padding: .6rem .75rem; background: #fff; color: ${BOSQUE}; border: 1px solid #CFC8BC; border-radius: 8px;
  font-family: ${TEXTO}; font-size: 1rem; font-weight: 500; font-variant-numeric: tabular-nums lining-nums; }
.pv-campo:hover { border-color: #A9A194; }
.pv-campo:focus { border-color: ${BOSQUE}; }
.pv-campo[aria-invalid="true"] { border-color: #A32D12; box-shadow: 0 0 0 1px #A32D12; }
input.pv-campo[type="date"] { -webkit-appearance: none; appearance: none; text-align: left; }
.pv-campo::-webkit-date-and-time-value { text-align: left; }
/* el navegador escribe las fechas en letra de máquina: se obliga la de la página */
.pv-campo::-webkit-datetime-edit, .pv-campo::-webkit-datetime-edit-fields-wrapper, .pv-campo::-webkit-datetime-edit-text,
.pv-campo::-webkit-datetime-edit-day-field, .pv-campo::-webkit-datetime-edit-month-field, .pv-campo::-webkit-datetime-edit-year-field { font-family: ${TEXTO}; font-variant-numeric: tabular-nums lining-nums; }
.pv-pasos { display: flex; align-items: center; justify-content: space-between; min-height: 50px; border: 1px solid #CFC8BC; border-radius: 8px; }
.pv-paso { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 7px; }
.pv-paso:hover:not(:disabled) { background: ${ARENA}; }
.pv-paso:disabled { opacity: .3; cursor: not-allowed; }
.pv-error { margin-top: .3rem; color: #A32D12; font-size: .85rem; font-weight: 600; }

/* filtros y fichas */
.pv-filtro { flex-shrink: 0; min-height: 44px; padding: .45rem 1.1rem; border: 1px solid #CFC8BC; border-radius: 999px; background: transparent; font-weight: 600; font-size: .9rem; }
.pv-filtro:hover { border-color: ${BOSQUE}; }
.pv-filtro[aria-pressed="true"] { background: ${TERRACOTA}; border-color: ${TERRACOTA}; color: #fff; }
.pv-rejilla { display: grid; gap: 1.25rem; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 660px) { .pv-rejilla { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1040px) { .pv-rejilla { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; } }
.pv-ficha { display: flex; flex-direction: column; overflow: hidden; background: #fff; border: 1px solid ${BORDE}; border-radius: 14px; }
.pv-ficha[data-elegida="true"] { border-color: ${TERRACOTA}; box-shadow: 0 0 0 1px ${TERRACOTA}; }
.pv-foto { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; background: ${ARENA}; }
.pv-ficha[data-cabe="false"] .pv-foto { filter: grayscale(1); opacity: .65; }
.pv-datos { display: flex; flex-wrap: wrap; gap: .35rem 1rem; padding-block: .75rem; border-block: 1px solid ${BORDE}; font-size: .85rem; font-weight: 500; }
.pv-datos li { display: inline-flex; align-items: center; gap: .4rem; }
.pv-datos svg, .pv-lista svg { flex-shrink: 0; color: ${TERRACOTA}; }
.pv-lista { display: grid; gap: .3rem; font-size: .9rem; }
.pv-lista li { display: flex; align-items: flex-start; gap: .5rem; }
.pv-lista svg { margin-top: .22rem; }

/* esqueletos con brillo suave */
.pv-hueso { display: block; border-radius: 6px; background: linear-gradient(100deg, #ECE8E0 30%, #F8F6F2 50%, #ECE8E0 70%); background-size: 220% 100%; animation: pv-brillo 1.2s linear infinite; }
@keyframes pv-brillo { from { background-position: 120% 0; } to { background-position: -100% 0; } }

/* cápsula flotante */
.pv-capsula { position: fixed; z-index: 30; left: 50%; bottom: calc(.75rem + env(safe-area-inset-bottom)); width: min(44rem, calc(100vw - 1.5rem));
  display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: .6rem 1rem; padding: .85rem 1rem;
  background: ${BOSQUE}; color: #fff; border: 1px solid rgba(255,255,255,.14); border-radius: 18px; box-shadow: 0 22px 44px -18px rgba(14,24,19,.65);
  transform: translate(-50%, calc(100% + 2rem)); opacity: 0; visibility: hidden;
  transition: transform .45s cubic-bezier(.2,.8,.2,1), opacity .3s, visibility 0s .45s; }
.pv-capsula[data-visible="true"] { transform: translate(-50%, 0); opacity: 1; visibility: visible; transition: transform .45s cubic-bezier(.2,.8,.2,1), opacity .3s; }
.pv-capsula .pv-btn { grid-column: 1 / -1; min-height: 46px; }
@media (min-width: 640px) {
  .pv-capsula { grid-template-columns: minmax(0, 1fr) auto auto; padding: .8rem .8rem .8rem 1.4rem; border-radius: 999px; }
  .pv-capsula .pv-btn { grid-column: auto; border-radius: 999px; }
}
.posada[data-capsula="true"] .pv-pie { padding-bottom: calc(10.5rem + env(safe-area-inset-bottom)); }
@media (min-width: 640px) { .posada[data-capsula="true"] .pv-pie { padding-bottom: 7rem; } }

/* panel de la reserva: sube desde abajo */
.pv-panel { margin: auto auto 0; padding: 0; border: 0; width: min(40rem, 100vw); max-width: 100vw; max-height: 92dvh; overflow: hidden;
  background: ${HUESO}; color: ${BOSQUE}; border-radius: 20px 20px 0 0; box-shadow: 0 -24px 60px -24px rgba(14,24,19,.6); }
.pv-panel[open] { display: flex; flex-direction: column; animation: pv-sube .42s cubic-bezier(.2,.8,.2,1); }
.pv-panel::backdrop { background: rgba(14, 24, 19, .55); }
@keyframes pv-sube { from { transform: translateY(100%); } }
.pv-cuerpo { overflow-y: auto; overscroll-behavior: contain; padding: 1.25rem 1.15rem calc(1.5rem + env(safe-area-inset-bottom)); }
@media (min-width: 640px) { .pv-cuerpo { padding-inline: 1.75rem; } }
.pv-cuentas { display: grid; gap: .45rem; }
.pv-cuentas > div { display: flex; justify-content: space-between; gap: 1rem; }
.pv-cuentas dd { flex-shrink: 0; font-weight: 600; }
.pv-extra { display: flex; align-items: center; gap: .75rem; min-height: 52px; padding: .6rem .85rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 10px; cursor: pointer; }
.pv-extra:has(input:checked) { border-color: ${TERRACOTA}; }
.pv-extra input { width: 20px; height: 20px; flex-shrink: 0; accent-color: ${TERRACOTA}; }

@media (prefers-reduced-motion: reduce) {
  .pv-hueso, .pv-panel[open] { animation: none; }
  .pv-btn, .pv-capsula, .pv-capsula[data-visible="true"] { transition: none; }
}
`;
