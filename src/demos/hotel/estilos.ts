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
.posada section[id], .posada #disponibilidad { scroll-margin-top: 5.25rem; }

/* encabezado: acompaña al bajar */
.pv-cabeza { position: sticky; top: 0; z-index: 20; background: ${HUESO}; border-bottom: 1px solid ${BORDE}; box-shadow: 0 10px 24px -22px rgba(27,46,38,.55); }
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
.pv-fecha { display: block; width: 100%; min-height: 56px; padding: .6rem .85rem; text-align: left; background: #fff; border: 1px solid #CFC8BC; border-radius: 10px; font-size: 1.12rem; font-weight: 600; }
.pv-fecha:hover { border-color: ${BOSQUE}; }
.pv-fecha[data-activa] { border-color: ${TERRACOTA}; box-shadow: 0 0 0 1px ${TERRACOTA}; background: #FDF3EA; }
.pv-pasos { display: flex; align-items: center; justify-content: space-between; min-height: 56px; border: 1px solid #CFC8BC; border-radius: 10px; }
.pv-paso { display: grid; place-items: center; width: 54px; height: 54px; border-radius: 9px; }
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
.posada[data-capsula="false"] .pv-pie { padding-bottom: 6rem; }

/* chat con recepción */
.pv-boton-chat { position: fixed; z-index: 30; right: .9rem; bottom: calc(.9rem + env(safe-area-inset-bottom)); min-height: 52px; background: ${BOSQUE}; color: #fff; border-color: rgba(255,255,255,.2); border-radius: 999px; box-shadow: 0 16px 32px -14px rgba(14,24,19,.65); }
.pv-boton-chat:hover { background: #24402F; }
@media (max-width: 639px) { .pv-boton-chat[data-sobre-barra="true"] { display: none; } }
@media (min-width: 640px) { .pv-ventana.pv-chat { width: min(30rem, calc(100vw - 2rem)); height: min(40rem, 92dvh); } }
.pv-chat .pv-cuerpo { padding-inline: 1rem; }
.pv-globo { max-width: 88%; padding: .65rem .85rem; border-radius: 14px; font-size: .92rem; line-height: 1.5; white-space: pre-line; overflow-wrap: anywhere; animation: pv-entra .28s ease-out; }
.pv-globo[data-de="posada"] { align-self: flex-start; background: #fff; border: 1px solid ${BORDE}; border-bottom-left-radius: 4px; }
.pv-globo[data-de="huesped"] { align-self: flex-end; background: ${BOSQUE}; color: #fff; border-bottom-right-radius: 4px; }
.pv-chat-pie { display: flex; flex-shrink: 0; gap: .6rem; padding: .75rem 1rem calc(.75rem + env(safe-area-inset-bottom)); background: #fff; border-top: 1px solid ${BORDE}; }

/* ventana de reserva: en celular sube desde abajo; en pantallas anchas va al centro */
.pv-ventana { margin: auto auto 0; padding: 0; border: 0; width: 100vw; max-width: 100vw; height: 94dvh; max-height: 94dvh; overflow: hidden;
  background: ${HUESO}; color: ${BOSQUE}; border-radius: 20px 20px 0 0; box-shadow: 0 -24px 60px -24px rgba(14,24,19,.6); }
@media (min-width: 640px) {
  .pv-ventana { margin: auto; width: min(46rem, calc(100vw - 2rem)); height: min(47rem, 92dvh); max-height: 92dvh; border-radius: 18px; }
  .pv-ventana[data-modo="fechas"] { height: fit-content; }
}
.pv-ventana[open] { display: flex; flex-direction: column; animation: pv-sube .42s cubic-bezier(.2,.8,.2,1); }
.pv-ventana::backdrop { background: rgba(14, 24, 19, .6); }
@keyframes pv-sube { from { transform: translateY(5rem); opacity: 0; } }
.pv-cuerpo { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 1.15rem 1rem 1.5rem; }
@media (min-width: 640px) { .pv-cuerpo { padding-inline: 1.75rem; } }
.pv-entra { animation: pv-entra .32s ease-out; }
@keyframes pv-entra { from { opacity: 0; transform: translateX(14px); } }
.pv-paso-titulo { font-size: 1.55rem; }
.posada .pv-paso-titulo:focus { outline: none; }

.pv-avance { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .4rem; margin-top: .35rem; }
.pv-avance button { display: block; width: 100%; padding-top: .45rem; text-align: left; border-top: 4px solid rgba(255,255,255,.2); font-size: .76rem; font-weight: 600; color: rgba(255,255,255,.55); }
.pv-avance button span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pv-avance button:disabled { cursor: default; }
.pv-avance button[data-estado="hecho"] { border-top-color: ${TERRACOTA}; color: rgba(255,255,255,.85); }
.pv-avance button[data-estado="actual"] { border-top-color: ${TERRACOTA}; color: #fff; }
/* en celulares angostos cada paso ocupa lo que mide su nombre, para que no se corte */
@media (max-width: 400px) { .pv-avance { grid-template-columns: repeat(4, auto); } .pv-avance button { font-size: .7rem; } }

.pv-ventana-pie { flex-shrink: 0; display: grid; gap: .6rem; padding: .8rem 1rem calc(.8rem + env(safe-area-inset-bottom)); background: #fff; border-top: 1px solid ${BORDE}; }
.pv-ventana-botones { display: flex; gap: .6rem; }
.pv-ventana-botones .pv-btn { min-height: 52px; }
@media (min-width: 640px) {
  .pv-ventana-pie { grid-template-columns: minmax(0, 1fr) auto; align-items: center; padding-inline: 1.75rem; }
  .pv-ventana-botones .pv-accion { min-width: 15rem; }
}

/* calendario */
.pv-cal { position: relative; padding: .75rem .35rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 14px; }
.pv-meses { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2rem; }
@media (min-width: 700px) { .pv-cal { padding: .85rem 1rem 1rem; } .pv-meses { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.pv-cal-flecha { position: absolute; top: .55rem; z-index: 1; display: grid; place-items: center; width: 44px; height: 44px; margin-inline: .5rem; border: 1px solid ${BORDE}; border-radius: 999px; background: #fff; }
.pv-cal-flecha:hover:not(:disabled) { border-color: ${BOSQUE}; }
.pv-cal-flecha:disabled { opacity: .3; cursor: not-allowed; }
.pv-cal-mes { display: grid; place-items: center; min-height: 44px; margin-bottom: .4rem; font-family: ${TITULAR}; font-size: 1.15rem; font-weight: 600; }
.pv-cal-mes::first-letter { text-transform: uppercase; }
.pv-dias { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); row-gap: 3px; }
.pv-semana { padding-block: .25rem; text-align: center; font-size: .78rem; font-weight: 600; color: ${SUAVE}; }
.pv-dia { height: 48px; border-radius: 10px; font-size: 1.05rem; font-weight: 600; font-variant-numeric: tabular-nums lining-nums; }
.pv-dia:hover:not(:disabled) { background: ${ARENA}; }
.pv-dia:disabled { color: #BDB7AC; font-weight: 400; cursor: not-allowed; }
.pv-dia[data-medio] { background: #F8E8D9; border-radius: 0; }
.pv-dia[data-punta], .pv-dia[data-punta]:hover:not(:disabled) { background: ${TERRACOTA}; color: #fff; font-weight: 700; }

/* opciones de la reserva */
.pv-opcion { display: grid; align-items: center; gap: .85rem; width: 100%; text-align: left; background: #fff; border: 1px solid ${BORDE}; border-radius: 12px; }
.pv-opcion:hover { border-color: #A9A194; }
.pv-opcion[aria-pressed="true"] { border-color: ${TERRACOTA}; box-shadow: 0 0 0 1px ${TERRACOTA}; background: #FFFAF5; }
.pv-opcion-nombre { display: block; font-weight: 700; line-height: 1.3; }
.pv-marca { display: grid; place-items: center; width: 26px; height: 26px; border: 2px solid #CFC8BC; border-radius: 999px; }
.pv-opcion[aria-pressed="true"] .pv-marca { background: ${TERRACOTA}; border-color: ${TERRACOTA}; color: #fff; }
.pv-sala { grid-template-columns: 84px minmax(0, 1fr) auto; padding: .6rem; }
.pv-sala img { width: 84px; height: 84px; object-fit: cover; border-radius: 8px; }
@media (min-width: 640px) { .pv-sala { grid-template-columns: 132px minmax(0, 1fr) auto; padding-right: 1rem; } .pv-sala img { width: 132px; height: 99px; } }
.pv-adicional { grid-template-columns: auto minmax(0, 1fr) auto; min-height: 84px; padding: .85rem; }
.pv-adicional .pv-marca { border-radius: 7px; }
.pv-cambiar { min-height: 44px; padding-inline: .25rem; font-size: .9rem; font-weight: 600; color: ${TERRACOTA}; text-decoration: underline; text-underline-offset: 4px; }
.pv-cuentas { display: grid; gap: .45rem; }
.pv-cuentas > div { display: flex; justify-content: space-between; gap: 1rem; }
.pv-cuentas dd { flex-shrink: 0; font-weight: 600; }

@media (prefers-reduced-motion: reduce) {
  .pv-hueso, .pv-ventana[open], .pv-entra, .pv-globo { animation: none; }
  .pv-btn, .pv-capsula, .pv-capsula[data-visible="true"] { transition: none; }
}
`;
