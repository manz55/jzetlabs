export const LETRAS = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";

const BLANCO = "#FFFFFF";
const TITANIO = "#F4F4F5";
const BORDE = "#E4E4E7";
const BORDE_HONDO = "#D4D4D8";
const CARBON = "#09090B";
const SUAVE = "#52525B";
const COBALTO = "#2563EB";
const COBALTO_HONDO = "#1D4ED8";
const COBALTO_CLARO = "#EFF4FE";
const ROJO = "#B91C1C";

/* Todo va bajo .nx o con el prefijo nx- para no chocar con las demás demos. */
export const ESTILOS = `
.nx { background: ${BLANCO}; color: ${CARBON}; font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; font-weight: 400; font-size: 16px; line-height: 1.55; font-variant-numeric: tabular-nums lining-nums; min-height: 100vh; }
.nx h1, .nx h2, .nx h3 { color: inherit; font-family: inherit; font-weight: 700; letter-spacing: -.022em; line-height: 1.18; }
.nx h3 { font-size: 1.05rem; letter-spacing: -.012em; }
.nx input, .nx select, .nx button, .nx pre { font-family: inherit; font-variant-numeric: tabular-nums lining-nums; }
.nx b, .nx strong { font-weight: 700; }
.nx small { font-size: .82rem; line-height: 1.45; }
.nx button:not(:disabled), .nx select, .nx summary { cursor: pointer; }
.nx button:disabled { cursor: not-allowed; }
.nx :focus-visible { outline: 3px solid ${COBALTO}; outline-offset: 2px; border-radius: 8px; }
.nx .nx-oscuro :focus-visible { outline-color: #fff; }
.nx-ancho { width: 100%; max-width: 76rem; margin-inline: auto; padding-inline: 1rem; }
@media (min-width: 720px) { .nx-ancho { padding-inline: 1.75rem; } }
.nx-oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.nx-suave { color: ${SUAVE}; font-size: .93rem; }
.nx section[id] { scroll-margin-top: 7.75rem; }
@media (min-width: 800px) { .nx section[id] { scroll-margin-top: 5rem; } }

/* logo: solo letras y un cuadro con la esquina cortada */
.nx-logo { display: inline-flex; align-items: center; gap: .55rem; line-height: 1; white-space: nowrap; }
.nx-logo-cuadro { width: 15px; height: 15px; flex-shrink: 0; background: ${COBALTO}; clip-path: polygon(0 0, 62% 0, 100% 38%, 100% 100%, 0 100%); }
.nx-logo-nombre { font-size: 1.04rem; font-weight: 700; letter-spacing: -.01em; }
.nx-logo-nombre b { font-weight: 500; }
.nx-logo-pais { padding: .16rem .3rem; border: 1px solid currentColor; border-radius: 4px; font-size: .62rem; font-weight: 700; opacity: .65; }

/* navegación fija con las tres vistas */
.nx-nav { position: sticky; top: 0; z-index: 30; background: ${BLANCO}; border-bottom: 1px solid ${BORDE}; }
.nx-nav-fila { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "logo orden" "vistas vistas"; align-items: center; gap: .5rem .75rem; padding-block: .55rem; }
.nx-nav-logo { grid-area: logo; justify-self: start; min-height: 40px; }
.nx-vistas { grid-area: vistas; display: grid; grid-template-columns: .85fr 1.2fr 1.15fr; gap: 3px; padding: 3px; background: ${TITANIO}; border: 1px solid ${BORDE}; border-radius: 12px; }
.nx-vistas button { display: inline-flex; align-items: center; justify-content: center; gap: .35rem; min-height: 40px; padding-inline: .4rem; border-radius: 9px; font-size: .84rem; font-weight: 600; color: ${SUAVE}; white-space: nowrap; transition: background-color .15s, color .15s; }
.nx-vistas button:hover { color: ${CARBON}; }
.nx-vistas button[aria-current="page"] { background: ${CARBON}; color: #fff; }
@media (max-width: 419px) { .nx-vistas svg { display: none; } }
.nx-miorden { grid-area: orden; display: inline-flex; align-items: center; gap: .45rem; min-height: 42px; padding: 0 .5rem 0 .85rem; border: 1px solid ${CARBON}; border-radius: 10px; font-size: .88rem; font-weight: 700; white-space: nowrap; transition: background-color .15s; }
.nx-miorden:hover { background: ${TITANIO}; }
.nx-miorden i { display: grid; place-items: center; min-width: 24px; height: 24px; padding-inline: .3rem; border-radius: 6px; background: ${COBALTO}; color: #fff; font-size: .78rem; font-style: normal; }
/* teléfonos muy angostos */
@media (max-width: 359px) {
  .nx-logo-pais, .nx-miorden svg { display: none; }
  .nx-logo-nombre { font-size: .95rem; }
  .nx-vistas button { padding-inline: .15rem; font-size: .76rem; }
  .nx-miorden { padding-left: .65rem; font-size: .82rem; }
}
@media (min-width: 800px) {
  .nx-nav-fila { grid-template-columns: 1fr auto 1fr; grid-template-areas: "logo vistas orden"; min-height: 70px; }
  .nx-vistas { display: flex; }
  .nx-vistas button { padding-inline: 1.15rem; font-size: .9rem; }
  .nx-miorden { justify-self: end; }
}

/* botones */
.nx-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 48px; padding: .6rem 1.15rem; border: 1px solid transparent; border-radius: 10px; font-weight: 700; font-size: .93rem; line-height: 1.25; text-align: center; text-decoration: none; transition: background-color .15s, border-color .15s, color .15s, transform .1s; }
.nx-btn:active:not(:disabled) { transform: translateY(1px); }
.nx-btn svg { flex-shrink: 0; }
.nx-lleno { width: 100%; }
.nx-azul { background: ${COBALTO}; color: #fff; }
.nx-azul:hover:not(:disabled) { background: ${COBALTO_HONDO}; }
.nx-negro { background: ${CARBON}; color: #fff; }
.nx-negro:hover:not(:disabled) { background: #27272A; }
.nx-contorno { background: ${BLANCO}; color: ${CARBON}; border-color: ${BORDE_HONDO}; }
.nx-contorno:hover:not(:disabled) { border-color: ${CARBON}; }
.nx-claro { background: transparent; color: #fff; border-color: #52525B; }
.nx-claro:hover:not(:disabled) { border-color: #fff; }
.nx-texto { color: ${SUAVE}; text-decoration: underline; text-underline-offset: 4px; padding-inline: .5rem; }
.nx-texto:hover { color: ${CARBON}; }
.nx-peligro { background: ${ROJO}; color: #fff; }
.nx-azul:disabled, .nx-contorno:disabled, .nx-negro:disabled { background: #E4E4E7; border-color: #E4E4E7; color: #52525B; }
.nx-claro:disabled { color: #A1A1AA; border-color: #3F3F46; }

/* fotos */
.nx-foto { display: block; overflow: hidden; background: #E4E4E7; }
.nx-foto img { width: 100%; height: 100%; object-fit: cover; }

/* campos */
.nx-campo { display: block; width: 100%; min-width: 0; min-height: 50px; padding: .6rem .8rem; background: #fff; color: ${CARBON}; border: 1px solid ${BORDE_HONDO}; border-radius: 10px; font-size: 1rem; font-weight: 500; }
.nx-campo:hover { border-color: #A1A1AA; }
.nx-campo::placeholder { color: #71717A; font-weight: 400; }
.nx-campo[aria-invalid="true"] { border-color: ${ROJO}; }
.nx-rotulo { display: block; margin: 1.1rem 0 .45rem; font-size: .85rem; font-weight: 700; }
.nx-error { margin-top: .45rem; color: ${ROJO}; font-size: .86rem; font-weight: 600; }

/* grupos de opciones (capacidad, marca) */
.nx-segmentos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .35rem; }
.nx-cuatro { grid-template-columns: repeat(2, minmax(0, 1fr)); }
@media (min-width: 440px) { .nx-cuatro { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.nx-segmentos button, .nx-horas button { min-height: 42px; padding-inline: .3rem; background: #fff; border: 1px solid ${BORDE_HONDO}; border-radius: 9px; font-size: .86rem; font-weight: 600; white-space: nowrap; transition: border-color .15s, background-color .15s; }
.nx-segmentos button:hover:not(:disabled), .nx-horas button:hover { border-color: ${CARBON}; }
.nx-segmentos button[aria-pressed="true"], .nx-horas button[aria-pressed="true"] { background: ${CARBON}; border-color: ${CARBON}; color: #fff; }
.nx-segmentos button:disabled { background: transparent; border-style: dashed; color: #71717A; font-weight: 400; }

/* etiquetas de estado */
.nx-estado { display: inline-flex; align-items: center; width: fit-content; padding: .2rem .55rem; border: 1px solid transparent; border-radius: 6px; font-size: .74rem; font-weight: 700; white-space: nowrap; }
.nx-estado[data-tono="azul"] { background: ${COBALTO_CLARO}; color: ${COBALTO_HONDO}; border-color: #C7D7FB; }
.nx-estado[data-tono="lleno"] { background: ${COBALTO}; color: #fff; }
.nx-estado[data-tono="borde"] { background: #fff; color: ${CARBON}; border-color: ${CARBON}; }
.nx-estado[data-tono="gris"] { background: #E4E4E7; color: #3F3F46; }

/* equipo destacado */
.nx-portada { padding-top: 1rem; }
.nx-destacado { display: grid; grid-template-columns: minmax(0, 1fr); overflow: hidden; background: ${CARBON}; color: #fff; border-radius: 18px; }
.nx-destacado-foto { order: -1; display: block; width: 100%; aspect-ratio: 16 / 11; background: #18181B; }
.nx-destacado-foto .nx-foto { width: 100%; height: 100%; }
.nx-destacado-foto img { object-position: 50% 34%; }
.nx-destacado-texto { padding: 1.35rem 1.25rem 1.5rem; }
.nx-sello { display: inline-block; padding: .25rem .6rem; background: ${COBALTO}; border-radius: 6px; font-size: .76rem; font-weight: 700; }
.nx .nx-destacado h1 { margin-top: .75rem; font-size: clamp(1.9rem, 5.4vw, 3.5rem); letter-spacing: -.035em; line-height: 1.06; }
.nx-destacado-detalle { margin-top: .6rem; max-width: 30rem; color: #D4D4D8; }
.nx-destacado-botones { display: flex; flex-direction: column; gap: .6rem; margin-top: 1.25rem; }
@media (min-width: 480px) { .nx-destacado-botones { flex-direction: row; flex-wrap: wrap; } }
@media (min-width: 860px) {
  .nx-portada { padding-top: 1.5rem; }
  .nx-destacado { grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); min-height: 31rem; }
  .nx-destacado-foto { order: 0; aspect-ratio: auto; position: relative; }
  .nx-destacado-foto .nx-foto { position: absolute; inset: 0; }
  .nx-destacado-foto img { object-position: 50% 42%; }
  .nx-destacado-texto { align-self: center; padding: 3rem; }
}

.nx-pilares { display: grid; grid-template-columns: minmax(0, 1fr); margin-top: .85rem; background: ${TITANIO}; border: 1px solid ${BORDE}; border-radius: 14px; }
.nx-pilares li { display: flex; align-items: flex-start; gap: .75rem; padding: .85rem 1rem; }
.nx-pilares li + li { border-top: 1px solid ${BORDE}; }
.nx-pilares svg { flex-shrink: 0; margin-top: .15rem; color: ${COBALTO}; }
.nx-pilares b { display: block; font-size: .93rem; line-height: 1.35; }
.nx-pilares small { display: block; color: ${SUAVE}; }
@media (min-width: 860px) { .nx-pilares { grid-template-columns: repeat(3, minmax(0, 1fr)); } .nx-pilares li { padding: 1.1rem 1.35rem; } .nx-pilares li + li { border-top: 0; border-left: 1px solid ${BORDE}; } }

/* secciones y catálogo */
.nx-seccion { padding-block: 2.5rem 1rem; }
@media (min-width: 860px) { .nx-seccion { padding-block: 4rem 1.5rem; } }
.nx .nx-titulo h2 { font-size: clamp(1.5rem, 3.4vw, 2.15rem); }
.nx-titulo p { margin-top: .3rem; color: ${SUAVE}; }
.nx-filtros { display: flex; gap: .45rem; margin: 1.15rem -1rem 0; padding: 2px 1rem .5rem; overflow-x: auto; scrollbar-width: none; }
.nx-filtros::-webkit-scrollbar { display: none; }
.nx-filtros button { flex-shrink: 0; min-height: 42px; padding-inline: 1.05rem; border: 1px solid ${BORDE_HONDO}; border-radius: 99px; font-size: .88rem; font-weight: 600; white-space: nowrap; }
.nx-filtros button:hover { border-color: ${CARBON}; }
.nx-filtros button[aria-pressed="true"] { background: ${CARBON}; border-color: ${CARBON}; color: #fff; }
@media (min-width: 720px) { .nx-filtros { margin-inline: 0; padding-inline: 0; flex-wrap: wrap; } }

.nx-rejilla { display: grid; grid-template-columns: minmax(0, 1fr); gap: .85rem; margin-top: .85rem; }
@media (min-width: 620px) { .nx-rejilla { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; } }
@media (min-width: 920px) { .nx-rejilla { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1180px) { .nx-rejilla { grid-template-columns: repeat(5, minmax(0, 1fr)); } .nx-rejilla .nx-producto { padding: .7rem; } .nx-rejilla .nx-lleno { padding-inline: .5rem; font-size: .86rem; } }
.nx-producto { display: flex; flex-direction: column; gap: .75rem; min-width: 0; padding: .85rem; background: ${TITANIO}; border: 1px solid ${BORDE}; border-radius: 14px; }
.nx-producto-cabeza { display: grid; grid-template-columns: 7.25rem minmax(0, 1fr); gap: .85rem; align-items: center; }
.nx-producto-foto { aspect-ratio: 1; border-radius: 10px; }
.nx-producto-nombre h3 { margin-top: .45rem; }
.nx-producto-nombre p { margin-top: .25rem; color: ${SUAVE}; font-size: .82rem; line-height: 1.45; }
@media (min-width: 620px) {
  .nx-producto-cabeza { grid-template-columns: minmax(0, 1fr); align-content: start; flex: 1; }
  .nx-producto-foto { aspect-ratio: 4 / 3; }
  .nx-producto-nombre h3 { margin-top: .55rem; }
}
.nx-presentacion { display: grid; place-items: center; min-height: 42px; border: 1px dashed ${BORDE_HONDO}; border-radius: 9px; color: ${SUAVE}; font-size: .84rem; }
.nx-precio strong { font-size: 1.55rem; letter-spacing: -.025em; }
.nx-precio span { margin-left: .4rem; color: ${SUAVE}; font-size: .84rem; }
.nx-precio p { color: ${SUAVE}; font-size: .86rem; }
.nx-precio p b { color: ${COBALTO_HONDO}; }

.nx-esqueleto i { display: block; height: 13px; border-radius: 8px; background: #E4E4E7; animation: nx-late .9s ease-in-out infinite alternate; }
.nx-esqueleto .nx-producto-foto { height: auto; }
.nx-esqueleto .nx-producto-nombre { display: grid; gap: .55rem; }
@keyframes nx-late { to { opacity: .45; } }

/* aviso del taller */
.nx-aviso-taller { padding-block: 2rem 3rem; }
@media (min-width: 860px) { .nx-aviso-taller { padding-block: 3rem 5rem; } }
.nx-aviso-caja { display: grid; grid-template-columns: minmax(0, 1fr); overflow: hidden; background: ${TITANIO}; border: 1px solid ${BORDE}; border-radius: 18px; }
.nx-aviso-caja .nx-foto { aspect-ratio: 16 / 10; }
.nx-aviso-caja > div { padding: 1.35rem 1.25rem 1.5rem; }
.nx .nx-aviso-caja h2 { font-size: clamp(1.4rem, 3vw, 1.9rem); }
.nx-aviso-caja p { margin-top: .5rem; color: ${SUAVE}; }
.nx-aviso-caja ul { display: grid; gap: .4rem; margin-block: 1rem 1.25rem; font-size: .92rem; font-weight: 600; }
.nx-aviso-caja li { display: flex; align-items: center; gap: .5rem; }
.nx-aviso-caja li svg { flex-shrink: 0; color: ${COBALTO}; }
@media (min-width: 860px) { .nx-aviso-caja { grid-template-columns: 1fr 1fr; } .nx-aviso-caja .nx-foto { aspect-ratio: auto; position: relative; min-height: 22rem; } .nx-aviso-caja .nx-foto img { position: absolute; inset: 0; } .nx-aviso-caja > div { align-self: center; padding: 2.5rem 3rem; } }

/* abajo, a la mano: bandeja de comparación y, en celular, la orden */
.nx-flotante { position: fixed; z-index: 25; left: .65rem; right: .65rem; bottom: calc(.65rem + env(safe-area-inset-bottom)); display: grid; gap: .5rem; width: auto; max-width: 36rem; margin-inline: auto; }
.nx-barra { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: .6rem .6rem .6rem 1rem; background: ${CARBON}; color: #fff; border: 1px solid #27272A; border-radius: 14px; box-shadow: 0 18px 36px -16px rgba(9,9,11,.6); }
.nx-barra > div { min-width: 0; }
.nx-barra small { display: block; overflow: hidden; color: #D4D4D8; text-overflow: ellipsis; white-space: nowrap; }
.nx-barra b { font-size: 1.12rem; }
.nx-barra .nx-btn { flex-shrink: 0; }
@media (min-width: 800px) { .nx-barra { display: none; } }
.nx-bandeja { display: flex; align-items: center; justify-content: space-between; gap: .6rem; padding: .55rem .6rem; background: #fff; border: 1px solid ${CARBON}; border-radius: 14px; box-shadow: 0 18px 36px -16px rgba(9,9,11,.45); }
.nx-bandeja ul { display: grid; gap: .25rem; min-width: 0; }
.nx-bandeja li { display: flex; align-items: center; gap: .15rem; min-width: 0; font-size: .82rem; font-weight: 700; }
.nx-bandeja li span { overflow: hidden; padding-left: .35rem; text-overflow: ellipsis; white-space: nowrap; }
.nx-bandeja li button { display: grid; place-items: center; width: 30px; height: 26px; flex-shrink: 0; border-radius: 6px; }
.nx-bandeja li button:hover { background: ${TITANIO}; }
.nx-bandeja-falta { padding-left: .35rem; color: ${SUAVE}; font-weight: 500 !important; }
.nx-bandeja .nx-btn { flex-shrink: 0; min-height: 44px; }

/* Mi Orden: ventana centrada con forma de ticket */
.nx-modal { margin: auto; padding: 0; width: min(31rem, calc(100vw - 1.25rem)); max-width: none; max-height: calc(100dvh - 1.25rem); overflow: hidden; border: 0; border-radius: 16px; background: #fff; color: ${CARBON}; box-shadow: 0 40px 80px -30px rgba(9,9,11,.65); }
.nx-modal::backdrop { background: rgba(9,9,11,.62); }
.nx-modal[open] { animation: nx-sube .28s cubic-bezier(.2,.8,.2,1); }
@keyframes nx-sube { from { opacity: 0; transform: translateY(18px); } }
.nx-ticket { max-height: calc(100dvh - 1.25rem); overflow-y: auto; overscroll-behavior: contain; }
.nx-ticket-cabeza { position: sticky; top: 0; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .8rem .75rem .8rem 1.15rem; background: ${CARBON}; color: #fff; }
.nx .nx-ticket-cabeza h2 { font-size: 1.15rem; }
.nx-ticket-cabeza p { color: #A1A1AA; font-size: .8rem; }
.nx-ticket-cabeza button { display: grid; place-items: center; width: 42px; height: 42px; flex-shrink: 0; border-radius: 9px; }
.nx-ticket-cabeza button:hover { background: #27272A; }
.nx-lineas { padding-inline: 1.15rem; }
.nx-lineas li { display: grid; grid-template-columns: 3.75rem minmax(0, 1fr) auto; gap: .75rem; align-items: start; padding-block: .85rem; }
.nx-lineas li + li { border-top: 1px solid ${BORDE}; }
.nx-lineas .nx-foto { width: 3.75rem; height: 3.75rem; border-radius: 9px; }
.nx-lineas b { display: block; font-size: .92rem; line-height: 1.35; }
.nx-lineas small { color: ${SUAVE}; }
.nx-lineas > li > strong { font-size: .95rem; white-space: nowrap; }
.nx-cantidad, .nx-stock { display: inline-flex; align-items: center; border: 1px solid ${BORDE_HONDO}; border-radius: 9px; background: #fff; }
.nx-cantidad { display: flex; width: fit-content; margin-top: .4rem; }
.nx-cantidad button, .nx-stock button { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 8px; }
.nx-cantidad button:hover:not(:disabled), .nx-stock button:hover:not(:disabled) { background: ${TITANIO}; }
.nx-cantidad button:disabled, .nx-stock button:disabled { color: #A1A1AA; }
.nx-cantidad span { min-width: 1.75rem; text-align: center; font-size: .9rem; font-weight: 700; }
.nx-bloque { padding: 1rem 1.15rem; border-top: 1px dashed ${BORDE_HONDO}; }
.nx-bloque legend { float: left; width: 100%; margin-bottom: .55rem; font-size: .85rem; font-weight: 700; }
.nx-bloque legend + * { clear: both; }
.nx-bloque > label { display: block; margin-bottom: .45rem; font-size: .85rem; font-weight: 700; }
.nx-plazos[hidden] { display: none; }
.nx-plazos { display: grid; grid-template-columns: 1.35fr repeat(4, minmax(0, 1fr)); gap: .3rem; }
.nx-plazos button { min-height: 44px; padding-inline: .15rem; border: 1px solid ${BORDE_HONDO}; border-radius: 9px; font-size: .82rem; font-weight: 600; }
.nx-plazos button:hover { border-color: ${COBALTO}; }
.nx-plazos button[aria-pressed="true"] { background: ${COBALTO}; border-color: ${COBALTO}; color: #fff; }
@media (max-width: 439px) { .nx-plazos { grid-template-columns: repeat(4, minmax(0, 1fr)); } .nx-plazos button:first-child { grid-column: 1 / -1; } }
.nx-cuota { margin-top: .65rem; padding: .85rem 1rem; background: ${TITANIO}; border: 1px solid ${BORDE}; border-radius: 12px; text-align: center; }
.nx-cuota span { display: block; color: ${SUAVE}; font-size: .84rem; font-weight: 600; }
.nx-cuota strong { display: block; font-size: 2.15rem; letter-spacing: -.035em; line-height: 1.2; }
.nx-cuota small { display: block; color: ${SUAVE}; }
.nx-entregas { display: grid; gap: .45rem; }
.nx-entregas button { display: flex; align-items: center; gap: .75rem; min-height: 58px; padding: .55rem .85rem; border: 1px solid ${BORDE_HONDO}; border-radius: 10px; text-align: left; }
.nx-entregas button:hover { border-color: ${COBALTO}; }
.nx-entregas button[aria-pressed="true"] { border-color: ${COBALTO}; box-shadow: inset 0 0 0 1px ${COBALTO}; background: ${COBALTO_CLARO}; }
.nx-entregas svg { flex-shrink: 0; color: ${COBALTO}; }
.nx-entregas b { display: block; font-size: .9rem; line-height: 1.3; }
.nx-entregas small { display: block; color: ${SUAVE}; }
.nx-ticket-pie { padding: .9rem 1.15rem 1.1rem; background: ${TITANIO}; border-top: 1px dashed ${BORDE_HONDO}; }
.nx-ticket-pie dl { display: grid; gap: .2rem; margin-bottom: .8rem; font-size: .9rem; }
.nx-ticket-pie dl div { display: flex; justify-content: space-between; gap: 1rem; }
.nx-ticket-pie dt { color: ${SUAVE}; }
.nx-ticket-pie .nx-total { margin-top: .3rem; font-size: 1.15rem; font-weight: 700; }
.nx-ticket-pie .nx-total dt { color: ${CARBON}; }
.nx-ticket-listo { display: grid; justify-items: center; gap: .65rem; padding: 1.6rem 1.15rem 1.25rem; text-align: center; }
.nx-ticket-listo > svg { color: ${COBALTO}; }
.nx-ticket-listo h3 { font-size: 1.3rem; }
.nx-ticket-listo p { color: ${SUAVE}; font-size: .93rem; }
.nx-ticket-listo pre { width: 100%; margin-block: .35rem; padding: .85rem 1rem; background: ${TITANIO}; border: 1px dashed ${BORDE_HONDO}; border-radius: 10px; font-size: .84rem; line-height: 1.55; text-align: left; white-space: pre-wrap; }

/* taller */
.nx-taller { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; align-items: start; padding-block: 1.25rem 3rem; }
@media (min-width: 960px) { .nx-taller { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1.5rem; padding-block: 2.25rem 5rem; } }
.nx-caja { container-type: inline-size; min-width: 0; padding: 1.15rem; background: ${TITANIO}; border: 1px solid ${BORDE}; border-radius: 16px; }
@media (min-width: 720px) { .nx-caja { padding: 1.6rem; } }
.nx .nx-caja h2 { font-size: 1.4rem; }
.nx-fallas { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .45rem; }
.nx-fallas button { display: flex; flex-direction: column; align-items: flex-start; gap: .4rem; min-height: 84px; padding: .75rem; background: #fff; border: 1px solid ${BORDE_HONDO}; border-radius: 12px; font-size: .86rem; font-weight: 600; line-height: 1.3; text-align: left; }
.nx-fallas button:hover { border-color: ${CARBON}; }
.nx-fallas button[aria-pressed="true"] { border-color: ${COBALTO}; box-shadow: inset 0 0 0 1px ${COBALTO}; background: ${COBALTO_CLARO}; }
.nx-fallas svg { color: ${COBALTO}; }
.nx-cotizacion { margin-top: 1.15rem; padding: 1.15rem; background: ${CARBON}; color: #fff; border-radius: 14px; }
.nx-cotizacion-que { color: #D4D4D8; font-size: .86rem; font-weight: 600; }
.nx-cotizacion-precio { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 .6rem; margin-top: .2rem; }
.nx-cotizacion-precio strong { font-size: 2.5rem; letter-spacing: -.035em; line-height: 1.15; }
.nx-cotizacion-precio span { color: #A1A1AA; font-size: .82rem; }
.nx-cotizacion dl { display: grid; gap: .5rem; margin-block: .85rem 1rem; padding-top: .85rem; border-top: 1px solid #27272A; font-size: .9rem; }
.nx-cotizacion dl div { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
.nx-cotizacion dt { display: flex; align-items: center; gap: .4rem; flex-shrink: 0; color: #A1A1AA; }
.nx-cotizacion dd { font-weight: 600; text-align: right; }
.nx-nota { margin-block: -.25rem 1rem; color: #D4D4D8; font-size: .84rem; }
.nx-dias { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: .3rem; }
.nx-dias button { display: grid; justify-items: center; min-height: 58px; align-content: center; border: 1px solid ${BORDE_HONDO}; border-radius: 9px; line-height: 1.2; }
.nx-dias button:hover { border-color: ${CARBON}; }
.nx-dias button[aria-pressed="true"] { background: ${CARBON}; border-color: ${CARBON}; color: #fff; }
.nx-dias small { font-size: .72rem; }
.nx-dos-botones { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1rem; }
.nx-dos-botones .nx-btn { flex: 1 1 10rem; }

/* rastreador */
.nx-buscar { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: .5rem; margin-top: 1.1rem; }
.nx-buscar .nx-campo { text-transform: uppercase; }
.nx-recientes { display: flex; flex-wrap: wrap; align-items: center; gap: .45rem; margin-top: .7rem; color: ${SUAVE}; font-size: .84rem; }
.nx-recientes button { min-height: 38px; padding-inline: .85rem; background: #fff; border: 1px solid ${BORDE_HONDO}; border-radius: 99px; color: ${CARBON}; font-size: .84rem; font-weight: 700; }
.nx-recientes button:hover { border-color: ${CARBON}; }
.nx-recientes button[aria-pressed="true"] { background: ${CARBON}; border-color: ${CARBON}; color: #fff; }
.nx-vacio { margin-top: 1rem; padding: 1.5rem 1rem; background: #fff; border: 1px dashed ${BORDE_HONDO}; border-radius: 12px; color: ${SUAVE}; font-size: .93rem; text-align: center; }
.nx-avance { margin-top: 1rem; padding: 1.1rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 14px; animation: nx-sube .3s ease; }
.nx-avance-cabeza { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: .6rem; }
.nx-avance-cabeza h3 { font-size: 1.2rem; }
.nx-avance-cabeza p:last-child { font-size: .92rem; }
.nx-pasos { display: grid; margin-top: 1.25rem; }
.nx-pasos > li { position: relative; display: flex; gap: .8rem; padding-bottom: 1.1rem; }
.nx-pasos > li:last-child { padding-bottom: 0; }
.nx-paso-marca { display: grid; place-items: center; width: 32px; height: 32px; flex-shrink: 0; background: #fff; border: 2px solid ${BORDE_HONDO}; border-radius: 99px; color: #71717A; font-size: .82rem; font-weight: 700; transition: background-color .25s, border-color .25s; }
.nx-pasos > li[data-estado="hecho"] .nx-paso-marca { background: ${COBALTO}; border-color: ${COBALTO}; color: #fff; }
.nx-pasos > li[data-estado="actual"] .nx-paso-marca { border-color: ${COBALTO}; color: ${COBALTO_HONDO}; box-shadow: 0 0 0 4px ${COBALTO_CLARO}; }
.nx-paso-texto b { display: block; font-size: .92rem; line-height: 1.35; }
.nx-paso-texto small { display: block; color: ${SUAVE}; }
.nx-pasos > li[data-estado="pendiente"] b { color: #71717A; font-weight: 600; }
.nx-nota-clara { margin-top: 1rem; padding: .7rem .85rem; background: ${COBALTO_CLARO}; border-radius: 9px; font-size: .9rem; font-weight: 600; }
.nx-avance-datos { display: grid; gap: .45rem; margin-block: 1rem; padding-top: .9rem; border-top: 1px solid ${BORDE}; font-size: .9rem; }
.nx-avance-datos div { display: flex; justify-content: space-between; gap: 1rem; }
.nx-avance-datos dt { color: ${SUAVE}; }
.nx-avance-datos dd { font-weight: 600; text-align: right; }

/* panel del dueño */
.nx-panel { background: ${TITANIO}; padding-block: 1.5rem 3.5rem; }
.nx-panel-cabeza { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: .85rem; }
.nx .nx-panel-cabeza h1 { font-size: clamp(1.5rem, 4vw, 2.1rem); }
.nx-pestanas { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .4rem; margin-block: 1.35rem 1rem; }
.nx-pestanas button { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .25rem; min-height: 62px; padding: .4rem; background: #fff; border: 1px solid ${BORDE_HONDO}; border-radius: 11px; font-size: .82rem; font-weight: 700; line-height: 1.25; text-align: center; }
.nx-pestanas button:hover { border-color: ${CARBON}; }
.nx-pestanas button[aria-pressed="true"] { background: ${CARBON}; border-color: ${CARBON}; color: #fff; }
.nx-pestanas i { position: absolute; top: -7px; right: -5px; display: grid; place-items: center; min-width: 22px; height: 22px; padding-inline: .3rem; background: ${COBALTO}; border: 2px solid ${TITANIO}; border-radius: 99px; color: #fff; font-size: .72rem; font-style: normal; }
@media (min-width: 720px) { .nx-pestanas { display: flex; } .nx-pestanas button { flex-direction: row; gap: .5rem; min-height: 48px; padding-inline: 1.35rem; font-size: .9rem; } }
.nx-fichas, .nx-inventario { display: grid; grid-template-columns: minmax(0, 1fr); gap: .75rem; align-items: start; }
@media (min-width: 760px) { .nx-fichas, .nx-inventario { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1120px) { .nx-fichas { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.nx-inventario { margin-top: .85rem; }
.nx-ficha { min-width: 0; padding: 1rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 14px; }
.nx-ficha[data-nueva="true"] { border-color: ${COBALTO}; box-shadow: inset 0 0 0 1px ${COBALTO}; }
.nx-ficha-cabeza { display: flex; align-items: flex-start; justify-content: space-between; gap: .75rem; }
.nx-ficha-cabeza b { display: block; font-size: .95rem; }
.nx-ficha-cabeza small { display: block; color: ${SUAVE}; }
.nx-ficha > h3 { margin-top: .65rem; }
.nx-ficha-lineas { margin-top: .5rem; font-size: .88rem; }
.nx-ficha-lineas li { display: flex; justify-content: space-between; gap: .75rem; padding-block: .15rem; }
.nx-ficha-lineas li span:last-child { white-space: nowrap; }
.nx-ficha-datos { display: grid; gap: .2rem; margin-top: .65rem; padding-top: .65rem; border-top: 1px dashed ${BORDE_HONDO}; font-size: .88rem; }
.nx-ficha-datos div { display: flex; justify-content: space-between; gap: 1rem; }
.nx-ficha-datos dt { color: ${SUAVE}; }
.nx-ficha-datos dd { font-weight: 600; text-align: right; }
.nx-acciones { display: flex; flex-wrap: wrap; gap: .45rem; margin-top: .85rem; }
.nx-acciones .nx-btn { flex: 1 1 auto; min-height: 44px; padding-inline: .85rem; font-size: .86rem; }
.nx-acciones .nx-texto { flex: 0 1 auto; }
.nx-estados { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .35rem; }
.nx-estados button { min-height: 44px; padding: .3rem .4rem; border: 1px solid ${BORDE_HONDO}; border-radius: 9px; font-size: .82rem; font-weight: 600; line-height: 1.25; }
.nx-estados button:hover { border-color: ${COBALTO}; }
.nx-estados button[aria-pressed="true"] { background: ${COBALTO}; border-color: ${COBALTO}; color: #fff; }
.nx-inventario-cabeza { display: flex; align-items: center; gap: .75rem; }
.nx-inventario-cabeza .nx-foto { width: 3.25rem; height: 3.25rem; flex-shrink: 0; border-radius: 9px; }
.nx-inventario-cabeza small { color: ${SUAVE}; }
.nx-variantes { margin-top: .75rem; }
.nx-variante { display: grid; grid-template-columns: minmax(0, 1fr) 5.25rem 7.6rem; gap: .5rem; align-items: center; padding-block: .4rem; border-top: 1px solid ${BORDE}; font-size: .88rem; font-weight: 600; }
.nx-variante-titulos { color: ${SUAVE}; font-size: .72rem; border-top: 0; padding-block: 0; }
.nx-variante input { width: 100%; min-width: 0; height: 40px; background: #fff; color: ${CARBON}; font-size: 1rem; font-weight: 600; text-align: center; }
.nx-variante > input { border: 1px solid ${BORDE_HONDO}; border-radius: 9px; }
.nx-stock { justify-content: space-between; }
.nx-stock button { flex-shrink: 0; width: 36px; }
.nx-stock input { border: 0; }

/* pie */
.nx-pie { background: ${CARBON}; color: #D4D4D8; padding-block: 2.75rem 1.5rem; font-size: .92rem; }
.nx-pie .nx-logo { color: #fff; }
.nx-pie-columnas { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.75rem; }
@media (min-width: 620px) { .nx-pie-columnas { grid-template-columns: 1fr 1.25fr; gap: 2rem; } .nx-pie-columnas > div:first-child { grid-column: 1 / -1; } }
@media (min-width: 940px) { .nx-pie-columnas { grid-template-columns: 1.25fr 1fr 1.15fr; gap: 3rem; } .nx-pie-columnas > div:first-child { grid-column: auto; } }
.nx-pie-columnas > div > p { margin-top: .75rem; max-width: 22rem; }
.nx .nx-pie h2 { display: flex; align-items: center; gap: .45rem; color: #fff; font-size: .95rem; }
.nx-pie b { color: #fff; }
.nx-horario { display: grid; gap: .35rem; margin-top: .75rem; }
.nx-horario div { display: flex; justify-content: space-between; gap: 1rem; }
.nx-horario dd { color: #fff; font-weight: 600; white-space: nowrap; }
.nx-politicas { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0 3rem; align-items: start; margin-top: 2rem; border-top: 1px solid #27272A; }
@media (min-width: 760px) { .nx-politicas { grid-template-columns: 1fr 1fr; } }
.nx-politicas details { border-bottom: 1px solid #27272A; }
.nx-politicas summary { display: flex; align-items: center; gap: .55rem; min-height: 54px; color: #fff; font-weight: 600; list-style: none; }
.nx-politicas summary::-webkit-details-marker { display: none; }
.nx-politicas summary::after { content: "+"; margin-left: auto; color: #A1A1AA; font-size: 1.25rem; font-weight: 400; }
.nx-politicas details[open] summary::after { content: "−"; }
.nx-politicas details p { padding-bottom: 1rem; color: #A1A1AA; font-size: .87rem; line-height: 1.65; }
.nx-pie-final { display: flex; flex-direction: column; gap: .5rem; margin-top: 1.5rem; color: #A1A1AA; font-size: .84rem; }
.nx-pie-final a { display: inline-flex; align-items: center; min-height: 40px; color: #fff; font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }
@media (min-width: 760px) { .nx-pie-final { flex-direction: row; justify-content: space-between; align-items: center; } }
.nx-pie[data-bandeja="true"] { padding-bottom: 7rem; }
@media (max-width: 799px) { .nx-pie[data-barra="true"] { padding-bottom: 6.5rem; } .nx-pie[data-barra="true"][data-bandeja="true"] { padding-bottom: 12rem; } }

/* equipos que se pueden abrir */
.nx-producto-ver { display: block; width: 100%; border-radius: 10px; }
.nx-producto-ver .nx-foto { width: 100%; }
.nx-producto-ver img, .nx-destacado-foto img { transition: transform .35s ease; }
.nx-producto-ver:hover img, .nx-destacado-foto:hover img { transform: scale(1.04); }
.nx-producto-nombre h3 button { text-align: left; font: inherit; letter-spacing: inherit; }
.nx-producto-nombre h3 button:hover { color: ${COBALTO_HONDO}; text-decoration: underline; text-underline-offset: 3px; }
.nx-herramientas { display: grid; grid-template-columns: 1.15fr 1fr; gap: .35rem; }
.nx-herramientas button { display: inline-flex; align-items: center; justify-content: center; gap: .3rem; min-height: 42px; padding-inline: .2rem; border-radius: 9px; font-size: .8rem; font-weight: 700; white-space: nowrap; }
.nx-herramientas button:hover:not(:disabled) { background: #E4E4E7; }
.nx-herramientas button[aria-pressed="true"] { background: ${COBALTO_CLARO}; color: ${COBALTO_HONDO}; }
.nx-herramientas button:disabled { color: #A1A1AA; }
.nx-herramientas svg { flex-shrink: 0; }
.nx-original { display: grid; place-items: center; min-height: 42px; color: ${SUAVE}; font-size: .8rem; }
@media (min-width: 1180px) { .nx-herramientas svg { display: none; } }

/* ventana ancha: ficha técnica y comparador */
.nx-modal.nx-ancha { width: min(60rem, calc(100vw - 1.25rem)); }
.nx-ficha-equipo { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.5rem; padding: 1.15rem; }
@media (min-width: 760px) { .nx-ficha-equipo { grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 2rem; padding: 1.5rem; } }
.nx-ficha-compra figure .nx-foto { aspect-ratio: 4 / 3; border-radius: 12px; }
.nx-ficha-compra figcaption { margin-top: .35rem; color: ${SUAVE}; font-size: .76rem; }
.nx-rotulo span { font-weight: 500; color: ${SUAVE}; }
.nx-colores { display: flex; flex-wrap: wrap; gap: .5rem; }
.nx-colores button { display: grid; place-items: center; width: 44px; height: 44px; border: 2px solid transparent; border-radius: 99px; }
.nx-colores button[aria-pressed="true"] { border-color: ${COBALTO}; }
.nx-colores i { width: 30px; height: 30px; border: 1px solid rgba(9,9,11,.2); border-radius: 99px; }
.nx-ficha-precio { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem; margin-top: 1.15rem; }
.nx-cuotas { width: 100%; margin-top: .75rem; border-collapse: separate; border-spacing: 0; background: ${TITANIO}; border: 1px solid ${BORDE}; border-radius: 12px; font-size: .9rem; }
.nx-cuotas caption { margin-bottom: .45rem; font-size: .85rem; font-weight: 700; text-align: left; }
.nx-cuotas th, .nx-cuotas td { padding: .5rem .85rem; }
.nx-cuotas tr + tr > * { border-top: 1px solid ${BORDE}; }
.nx-cuotas th { font-weight: 500; text-align: left; }
.nx-cuotas td { font-weight: 700; text-align: right; }
.nx-ficha-datos-equipo h3 { display: flex; align-items: center; gap: .45rem; margin-bottom: .5rem; }
.nx-specs { margin-bottom: 1.25rem; border-top: 1px solid ${BORDE}; font-size: .9rem; }
.nx-specs div { display: grid; grid-template-columns: 7.75rem minmax(0, 1fr); gap: .75rem; padding-block: .55rem; border-bottom: 1px solid ${BORDE}; }
.nx-specs dt { color: ${SUAVE}; }
.nx-specs dd { font-weight: 600; }
.nx-incluye { display: grid; gap: .3rem; margin-bottom: .5rem; font-size: .9rem; }
.nx-caja-nota { margin-bottom: 1.15rem; color: ${SUAVE}; font-size: .78rem; }
.nx-incluye li { display: flex; align-items: center; gap: .5rem; }
.nx-incluye svg, .nx-garantia svg { flex-shrink: 0; color: ${COBALTO}; }
.nx-garantia { display: flex; align-items: flex-start; gap: .6rem; margin-bottom: .85rem; padding: .75rem .85rem; background: ${COBALTO_CLARO}; border-radius: 10px; font-size: .88rem; font-weight: 600; }
.nx-ficha-pie { position: sticky; bottom: 0; z-index: 2; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem 1rem; padding: .75rem 1.15rem; background: ${TITANIO}; border-top: 1px solid ${BORDE}; }
.nx-ficha-pie p b { display: block; font-size: 1.2rem; line-height: 1.25; }
.nx-ficha-pie p small { display: block; color: ${SUAVE}; }
.nx-ficha-pie > div { display: flex; flex: 1 1 9.5rem; flex-wrap: wrap; justify-content: flex-end; gap: .45rem; }
.nx-ficha-pie > div .nx-btn { flex: 1 1 auto; max-width: 18rem; padding-inline: .7rem; }
@media (max-width: 759px) { .nx-ficha-compra figure .nx-foto { aspect-ratio: 16 / 10; } }
@media (max-width: 419px) { .nx-ficha-pie > div .nx-btn { padding-inline: .35rem; font-size: .86rem; } .nx-ficha-pie > div .nx-btn svg { display: none; } }

.nx-comparar { width: 100%; table-layout: fixed; border-collapse: collapse; font-size: .88rem; }
.nx-comparar thead td { display: none; }
.nx-comparar tr { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: .85rem; padding: .75rem 1rem; border-bottom: 1px solid ${BORDE}; }
.nx-comparar thead th { text-align: left; }
.nx-comparar thead .nx-foto { aspect-ratio: 4 / 3; border-radius: 10px; }
.nx-comparar thead button { margin-top: .5rem; font-weight: 700; font-size: .95rem; line-height: 1.3; text-align: left; text-decoration: underline; text-underline-offset: 3px; }
.nx-comparar tbody th { grid-column: 1 / -1; margin-bottom: .3rem; color: ${SUAVE}; font-size: .76rem; font-weight: 700; text-align: left; }
.nx-comparar td { min-width: 0; line-height: 1.45; }
.nx-comparar td strong { display: block; font-size: 1.25rem; }
.nx-comparar td small { display: block; color: ${SUAVE}; }
.nx-comparar-caps { display: flex; flex-wrap: wrap; gap: .3rem; }
.nx-comparar-caps button { min-height: 38px; padding-inline: .45rem; white-space: nowrap; border: 1px solid ${BORDE_HONDO}; border-radius: 8px; font-size: .8rem; font-weight: 600; }
.nx-comparar-caps button[aria-pressed="true"] { background: ${CARBON}; border-color: ${CARBON}; color: #fff; }
.nx-comparar-agregar { position: sticky; bottom: 0; background: #fff; }
.nx-comparar .nx-comparar-agregar { border-top: 1px solid ${BORDE}; border-bottom: 0; }
.nx-comparar-agregar th { position: absolute; }
.nx-comparar-agregar .nx-btn { padding-inline: .5rem; }
@media (min-width: 720px) {
  .nx-comparar thead td { display: block; }
  .nx-comparar tr { grid-template-columns: 11rem repeat(2, minmax(0, 1fr)); column-gap: 1.5rem; padding-inline: 1.5rem; }
  .nx-comparar thead .nx-foto { aspect-ratio: 16 / 9; }
  .nx-comparar tbody th { grid-column: auto; margin: 0; font-size: .85rem; }
  .nx-comparar-agregar th { position: static; }
}

/* plan retoma */
.nx-retoma { display: grid; grid-template-columns: minmax(0, 1fr); overflow: hidden; background: ${TITANIO}; border: 1px solid ${BORDE}; border-radius: 18px; }
.nx-retoma-texto { padding: 1.35rem 1.25rem 0; }
.nx .nx-retoma-texto h2 { font-size: clamp(1.45rem, 3.2vw, 2.1rem); }
.nx-retoma-texto > p { margin-top: .6rem; color: ${SUAVE}; }
.nx .nx-retoma-texto > .nx-rotulo { color: ${CARBON}; }
.nx-retoma-texto ul { display: grid; gap: .4rem; font-size: .92rem; font-weight: 600; }
.nx-retoma-texto li { display: flex; align-items: center; gap: .5rem; }
.nx-retoma-texto li svg { flex-shrink: 0; color: ${COBALTO}; }
.nx-retoma-cotizar { padding: .25rem 1.25rem 1.35rem; }
.nx-condiciones { display: grid; gap: .45rem; }
.nx-condiciones button { padding: .6rem .8rem; background: #fff; border: 1px solid ${BORDE_HONDO}; border-radius: 10px; text-align: left; }
.nx-condiciones button:hover { border-color: ${CARBON}; }
.nx-condiciones button[aria-pressed="true"] { border-color: ${COBALTO}; box-shadow: inset 0 0 0 1px ${COBALTO}; background: ${COBALTO_CLARO}; }
.nx-condiciones b { display: block; font-size: .92rem; }
.nx-condiciones small { display: block; color: ${SUAVE}; }
@media (min-width: 560px) { .nx-condiciones { grid-template-columns: repeat(3, minmax(0, 1fr)); } .nx-condiciones button { align-self: stretch; } }
.nx-abono { margin-top: 1rem; padding: 1.15rem; background: ${CARBON}; color: #fff; border-radius: 14px; }
.nx-abono > p:first-child span { display: block; color: #D4D4D8; font-size: .86rem; font-weight: 600; }
.nx-abono > p:first-child strong { display: block; margin-bottom: .75rem; font-size: 2.5rem; letter-spacing: -.035em; line-height: 1.15; }
.nx-abono > small { display: block; margin-top: .7rem; color: #A1A1AA; }
.nx-abono-listo { display: flex; align-items: center; gap: .45rem; font-weight: 700; font-size: .95rem; }
.nx-abono .nx-dos-botones { margin-top: .75rem; }
@media (min-width: 920px) {
  .nx-retoma { grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); }
  .nx-retoma-texto { align-self: center; padding: 2.5rem 0 2.5rem 3rem; }
  .nx-retoma-cotizar { padding: 1.25rem 2.5rem 2rem; }
}
.nx-bloque-titulo { margin-bottom: .55rem; font-size: .85rem; font-weight: 700; }
.nx-retoma-puesto { display: flex; align-items: center; gap: .7rem; padding: .6rem .5rem .6rem .8rem; background: ${COBALTO_CLARO}; border: 1px solid #C7D7FB; border-radius: 10px; }
.nx-retoma-puesto > svg { flex-shrink: 0; color: ${COBALTO}; }
.nx-retoma-puesto span { flex: 1; min-width: 0; }
.nx-retoma-puesto b { display: block; font-size: .9rem; line-height: 1.35; }
.nx-retoma-puesto small { display: block; color: ${SUAVE}; }
.nx-retoma-puesto .nx-btn { flex-shrink: 0; min-height: 40px; }
.nx-retoma-mini { display: grid; gap: .45rem; }
.nx-ticket-pie .nx-descuento dt, .nx-ticket-pie .nx-descuento dd { color: ${COBALTO_HONDO}; font-weight: 700; }
.nx-lineas select { display: block; max-width: 100%; min-height: 36px; margin-top: .35rem; padding: .25rem .5rem; background: #fff; color: ${CARBON}; border: 1px solid ${BORDE_HONDO}; border-radius: 8px; font-size: .84rem; font-weight: 600; }
@media (max-height: 760px) { .nx-ticket-pie { position: static; } }

/* detalle del rastreo */
.nx-tecnico { display: flex; align-items: center; gap: .7rem; margin-top: .9rem; padding: .65rem .75rem; background: ${TITANIO}; border-radius: 10px; }
.nx-tecnico i { display: grid; place-items: center; width: 38px; height: 38px; flex-shrink: 0; background: ${CARBON}; color: #fff; border-radius: 99px; font-size: .78rem; font-style: normal; font-weight: 700; }
.nx-tecnico small { display: block; color: ${SUAVE}; }
.nx-tecnico b { display: block; font-size: .95rem; }
.nx-paso-texto { flex: 1; min-width: 0; padding-top: .1rem; }
.nx-paso-texto > p { margin-top: .35rem; color: ${SUAVE}; font-size: .86rem; }
.nx .nx-paso-texto > .nx-notas { padding: .6rem .75rem; background: ${TITANIO}; border-radius: 9px; color: ${CARBON}; overflow-wrap: anywhere; }
.nx-notas span { display: block; color: ${SUAVE}; font-size: .74rem; font-weight: 700; }
.nx-pendiente { margin-top: .65rem; padding: .6rem .75rem; border: 1px dashed ${COBALTO}; border-radius: 9px; font-size: .86rem; font-weight: 600; }

/* laboratorio */
.nx-lab { padding-block: 2.75rem 3rem; border-top: 1px solid ${BORDE}; }
@media (min-width: 960px) { .nx-lab { padding-block: 4.5rem 5rem; } }
.nx-estandares { display: grid; grid-template-columns: minmax(0, 1fr); gap: .75rem; margin-top: 1.25rem; }
@media (min-width: 620px) { .nx-estandares { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1040px) { .nx-estandares { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.nx-estandares li { padding: 1.15rem; background: ${TITANIO}; border: 1px solid ${BORDE}; border-radius: 14px; }
.nx-estandares svg { color: ${COBALTO}; }
.nx-estandares h3 { margin-top: .65rem; }
.nx-estandares p { margin-top: .4rem; color: ${SUAVE}; font-size: .88rem; }
.nx .nx-tarifas-titulo { margin-block: 2.25rem .85rem; font-size: 1.25rem; }
.nx-tarifas, .nx-tarifas tbody { display: block; width: 100%; font-size: .9rem; }
.nx-tarifas thead { display: none; }
.nx-tarifas tr { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .15rem .4rem; margin-bottom: .6rem; padding: .85rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 12px; }
.nx-tarifas tbody th { grid-column: 1 / -1; text-align: left; font-weight: 700; }
.nx-tarifa-tiempo { grid-column: 1 / -1; margin-bottom: .35rem; color: ${SUAVE}; font-size: .82rem; }
.nx-tarifas td[data-marca] { font-weight: 700; font-size: .88rem; }
.nx-tarifas td[data-marca]::before { content: attr(data-marca); display: block; color: ${SUAVE}; font-size: .72rem; font-weight: 600; }
.nx-tarifas td small { display: none; }
.nx-tarifa-unica { grid-column: 1 / -1; font-weight: 700; }
.nx-tarifa-unica::first-letter { text-transform: uppercase; }
.nx-lab .nx-suave { margin-top: .5rem; }
@media (min-width: 760px) {
  .nx-tarifas { display: table; border-collapse: separate; border-spacing: 0; overflow: hidden; border: 1px solid ${BORDE}; border-radius: 14px; }
  .nx-tarifas thead { display: table-header-group; }
  .nx-tarifas tbody { display: table-row-group; }
  .nx-tarifas tr { display: table-row; }
  .nx-tarifas th, .nx-tarifas td { display: table-cell; padding: .85rem 1rem; text-align: left; vertical-align: middle; }
  .nx-tarifas thead th { background: ${CARBON}; color: #fff; font-size: .82rem; }
  .nx-tarifas tbody tr + tr > * { border-top: 1px solid ${BORDE}; }
  .nx-tarifa-tiempo { margin: 0; white-space: nowrap; }
  .nx-tarifas td[data-marca] { white-space: nowrap; }
  .nx-tarifas td[data-marca]::before { content: none; }
  .nx-tarifas td small { display: inline; color: ${SUAVE}; font-weight: 500; }
}

/* registro de ingreso en el panel */
.nx-ingreso { margin-bottom: 1rem; padding: 1rem; background: #fff; border: 1px solid ${CARBON}; border-radius: 14px; }
.nx .nx-ingreso h2 { display: flex; align-items: center; gap: .5rem; font-size: 1.1rem; }
.nx-ingreso h2 svg { color: ${COBALTO}; }
.nx-ingreso-campos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; align-items: end; margin-top: .85rem; }
.nx-ingreso-campos label:nth-child(1), .nx-ingreso-campos > button { grid-column: 1 / -1; }
.nx-ingreso-campos label:nth-child(2) { grid-column: 1 / -1; }
.nx-ingreso-campos label span, .nx-ficha-campo > span { display: block; margin-bottom: .3rem; font-size: .8rem; font-weight: 700; }
@media (min-width: 980px) { .nx-ingreso-campos { grid-template-columns: 1.3fr 1.1fr 1.3fr .7fr auto; } .nx-ingreso-campos label:nth-child(n), .nx-ingreso-campos > button { grid-column: auto; } .nx-ingreso-campos > button { min-height: 50px; } }
.nx-ingreso-listo { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; margin-top: .75rem; padding: .6rem .75rem; background: ${COBALTO_CLARO}; border-radius: 10px; font-size: .9rem; }
.nx-ingreso-listo > svg { flex-shrink: 0; color: ${COBALTO}; }
.nx-ingreso-listo > span { flex: 1 1 12rem; }
.nx-ingreso-listo .nx-btn { min-height: 40px; }
.nx-estados .nx-entregado { grid-column: 1 / -1; border-style: dashed; }
.nx-ficha-campo { display: block; margin-top: .75rem; }
.nx-ficha-campo .nx-campo { min-height: 44px; font-size: .9rem; }
.nx textarea.nx-campo { font-family: inherit; line-height: 1.45; resize: vertical; }
.nx-ficha-retoma { display: flex; justify-content: space-between; gap: .75rem; padding-block: .15rem; color: ${COBALTO_HONDO}; font-size: .88rem; font-weight: 600; }
.nx-ficha-retoma b { white-space: nowrap; }

/* hero: la cuota manda, el contado al lado */
.nx-destacado-precios { display: grid; grid-template-columns: 1.25fr 1fr; gap: .6rem; margin-top: 1.15rem; }
.nx-destacado-precios p { display: flex; flex-direction: column; justify-content: center; min-width: 0; padding: .75rem .85rem; border: 1px solid #27272A; border-radius: 12px; }
.nx-destacado-precios .nx-destacado-cuota { border-color: ${COBALTO}; background: rgba(37,99,235,.14); }
.nx-destacado-precios span { color: #D4D4D8; font-size: .8rem; font-weight: 600; }
.nx-destacado-precios strong { font-size: clamp(1.75rem, 7.5vw, 2.5rem); letter-spacing: -.035em; line-height: 1.15; }
.nx-destacado-precios b { font-size: 1.35rem; letter-spacing: -.02em; line-height: 1.4; }
.nx-destacado-precios small { color: #A1A1AA; font-size: .76rem; }

/* buscador y orden del catálogo */
.nx-buscador { display: grid; grid-template-columns: minmax(0, 1fr); gap: .5rem; margin-top: 1.15rem; }
@media (min-width: 620px) { .nx-buscador { grid-template-columns: minmax(0, 1fr) 17rem; } }
.nx-busca { display: flex; align-items: center; gap: .55rem; min-width: 0; min-height: 50px; padding: 0 .4rem 0 .8rem; background: #fff; border: 1px solid ${BORDE_HONDO}; border-radius: 10px; }
.nx-busca:focus-within { border-color: ${COBALTO}; box-shadow: 0 0 0 1px ${COBALTO}; }
.nx-busca > svg { flex-shrink: 0; color: ${SUAVE}; }
.nx-busca input { flex: 1; min-width: 0; height: 46px; border: 0; outline: 0; background: transparent; color: ${CARBON}; font-size: 1rem; font-weight: 500; }
.nx .nx-busca input:focus-visible { outline: 0; }
.nx-busca input::-webkit-search-cancel-button { display: none; }
.nx-busca button { display: grid; place-items: center; width: 40px; height: 40px; flex-shrink: 0; border-radius: 8px; }
.nx-busca button:hover { background: ${TITANIO}; }
.nx-buscador + .nx-filtros { margin-top: .65rem; }
.nx-conteo { margin-top: .35rem; color: ${SUAVE}; font-size: .84rem; font-weight: 600; }
.nx-seccion .nx-vacio .nx-btn { margin-top: .75rem; }
.nx-etiquetas { display: flex; flex-wrap: wrap; gap: .3rem; }
.nx-producto-nombre .nx-etiquetas { margin-top: 0; }

/* puntos de color */
.nx-puntos { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .15rem .5rem; min-height: 36px; }
.nx-puntos > div { display: flex; gap: .1rem; margin-left: -.3rem; }
.nx-puntos button { display: grid; place-items: center; width: 34px; height: 34px; border: 2px solid transparent; border-radius: 99px; }
.nx-puntos button[aria-pressed="true"] { border-color: ${COBALTO}; }
.nx-puntos i { width: 20px; height: 20px; border: 1px solid rgba(9,9,11,.22); border-radius: 99px; }
.nx-puntos small { color: ${SUAVE}; font-weight: 600; font-size: .78rem; }
@media (max-width: 619px) { .nx-sin-puntos { display: none; } }
@media (min-width: 620px) { .nx-puntos { flex-direction: column; align-items: flex-start; } }
.nx-puntos button[data-agotado="true"], .nx-colores button[data-agotado="true"] { position: relative; }
.nx-puntos button[data-agotado="true"]::after, .nx-colores button[data-agotado="true"]::after { content: ""; position: absolute; left: 18%; right: 18%; top: 50%; height: 2px; background: ${CARBON}; box-shadow: 0 0 0 1px #fff; transform: rotate(-45deg); }

/* taller: cabecera compacta con los dos accesos */
.nx-taller-cabeza { position: relative; isolation: isolate; background: ${CARBON}; color: #fff; padding-block: 2.5rem 1.75rem; }
.nx-taller-cabeza > .nx-foto { position: absolute; inset: 0; z-index: -2; background: ${CARBON}; }
.nx-taller-cabeza::after { content: ""; position: absolute; inset: 0; z-index: -1; background: rgba(9,9,11,.82); }
.nx .nx-taller-cabeza h1 { font-size: clamp(1.75rem, 4.4vw, 2.5rem); }
.nx-taller-cabeza p { display: flex; flex-wrap: wrap; align-items: center; gap: .25rem .4rem; margin-top: .6rem; color: #E4E4E7; }
.nx-taller-cabeza p b { color: #fff; }
.nx-taller-accesos { display: flex; flex-direction: column; gap: .55rem; margin-top: 1.15rem; }
@media (min-width: 480px) { .nx-taller-accesos { flex-direction: row; flex-wrap: wrap; } }
@media (min-width: 960px) {
  .nx-taller-cabeza { padding-block: 3.25rem 2.5rem; }
  .nx-taller-cabeza > .nx-ancho { display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
  .nx-taller-accesos { margin-top: 0; flex-shrink: 0; }
}

/* cotizador */
.nx-opciones { display: grid; gap: .45rem; }
.nx-opciones button { display: flex; align-items: center; gap: .75rem; min-height: 56px; padding: .55rem .85rem; background: #fff; border: 1px solid ${BORDE_HONDO}; border-radius: 10px; text-align: left; }
.nx-opciones button:hover { border-color: ${CARBON}; }
.nx-opciones button[aria-pressed="true"] { border-color: ${COBALTO}; box-shadow: inset 0 0 0 1px ${COBALTO}; background: ${COBALTO_CLARO}; }
.nx-opciones svg { flex-shrink: 0; color: ${COBALTO}; }
.nx-opciones b { display: block; font-size: .9rem; line-height: 1.3; }
.nx-opciones small { display: block; color: ${SUAVE}; }
@container (min-width: 30rem) { .nx-opciones { grid-template-columns: repeat(2, minmax(0, 1fr)); } .nx-opciones button { align-self: stretch; } }
.nx-cotizacion-cifras { display: grid; grid-template-columns: 1.2fr 1fr; gap: .75rem; margin-top: .6rem; }
.nx-cotizacion-cifras p { min-width: 0; }
.nx-cotizacion-cifras span { display: flex; align-items: center; gap: .35rem; color: #A1A1AA; font-size: .8rem; font-weight: 600; }
.nx-cotizacion-cifras strong { display: block; letter-spacing: -.035em; line-height: 1.2; white-space: nowrap; }
.nx-cotizacion-precio strong { font-size: clamp(1.9rem, 8vw, 2.5rem); }
.nx-cotizacion-tiempo { align-self: stretch; padding-left: .85rem; border-left: 1px solid #27272A; }
.nx-cotizacion-tiempo strong { margin-top: .35rem; font-size: clamp(1.15rem, 5vw, 1.5rem); }

/* agenda en ventana */
.nx-agenda { padding: 1rem 1.15rem 1.15rem; }
.nx-agenda-resumen { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: .75rem .85rem; background: ${TITANIO}; border: 1px solid ${BORDE}; border-radius: 12px; }
.nx-agenda-resumen b { display: block; font-size: .9rem; line-height: 1.35; }
.nx-agenda-resumen small { display: block; color: ${SUAVE}; }
.nx-agenda-resumen strong { font-size: 1.3rem; white-space: nowrap; }
.nx-horas { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .35rem; }
.nx-agenda-enviar { margin-top: 1.15rem; }

/* rastreo: aprobación, recepción y línea que se llena */
.nx-aprobar { display: grid; gap: .6rem; margin-top: .9rem; padding: 1rem; background: ${CARBON}; color: #fff; border-radius: 14px; }
.nx-aprobar > p { display: flex; align-items: center; gap: .45rem; font-weight: 700; }
.nx-aprobar > small { color: #D4D4D8; }
.nx-aprobar .nx-btn { min-height: 56px; }
.nx-aprobado { display: flex; flex-wrap: wrap; align-items: center; gap: .3rem .5rem; margin-top: .75rem; padding: .65rem .75rem; background: ${COBALTO_CLARO}; color: ${COBALTO_HONDO}; border-radius: 9px; font-size: .86rem; font-weight: 700; }
.nx-aprobado svg { flex-shrink: 0; }
.nx-aprobado span { flex: 1 1 10rem; }
.nx-aprobado a { text-decoration: underline; text-underline-offset: 3px; }
.nx-pendiente { margin-top: .65rem; padding: .6rem .75rem; border: 1px dashed ${COBALTO}; border-radius: 9px; font-size: .86rem; font-weight: 600; }
.nx-agendada { display: grid; gap: .65rem; margin-top: .9rem; padding: .85rem; border: 1px solid ${COBALTO}; border-radius: 12px; font-size: .92rem; }
.nx-repuesto { display: flex; align-items: center; gap: .45rem; margin-top: .5rem; font-size: .86rem; font-weight: 600; }
.nx-repuesto svg { flex-shrink: 0; color: ${COBALTO}; }
.nx-recepcion { margin-top: .9rem; padding: .8rem .85rem; border: 1px solid ${BORDE}; border-radius: 12px; }
.nx-recepcion > p { display: flex; align-items: center; gap: .45rem; font-size: .86rem; font-weight: 700; }
.nx-recepcion > p svg { flex-shrink: 0; color: ${COBALTO}; }
.nx-recepcion ul { display: flex; flex-wrap: wrap; gap: .35rem; margin-top: .6rem; }
.nx-recepcion li { padding: .3rem .6rem; background: ${COBALTO_CLARO}; border: 1px solid #C7D7FB; border-radius: 7px; font-size: .8rem; }
.nx-recepcion li b { color: ${COBALTO_HONDO}; }
.nx-recepcion li[data-bien="false"] { background: #fff; border-color: ${CARBON}; border-style: dashed; }
.nx-recepcion li[data-bien="false"] b { color: ${CARBON}; }
.nx-recepcion > small { display: block; margin-top: .35rem; color: ${SUAVE}; }
.nx-tramo { position: absolute; left: 15px; top: 34px; bottom: 2px; width: 2px; background: ${BORDE}; }
.nx-tramo > span { display: block; width: 100%; height: 100%; background: ${COBALTO}; transform-origin: top; }
.nx-tramo > span[data-lleno="false"] { transform: scaleY(0); }
.nx-pasos > li[data-estado="actual"] .nx-paso-texto { padding: .6rem .75rem; background: #fff; border: 1px solid ${COBALTO}; border-radius: 12px; box-shadow: 0 10px 24px -18px rgba(37,99,235,.7); }
.nx-avance-pie { display: grid; gap: .55rem; margin-top: 1.15rem; padding-top: .9rem; border-top: 1px solid ${BORDE}; }
.nx-avance-pie p { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
.nx-avance-pie p span { color: ${SUAVE}; font-size: .9rem; }
.nx-avance-pie p strong { font-size: 1.35rem; }

/* comprobante y póliza */
.nx-recibo { padding: 1.15rem; font-size: .9rem; }
.nx-recibo-cabeza { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding-bottom: .9rem; border-bottom: 1px dashed ${BORDE_HONDO}; }
.nx-recibo-cabeza b { display: block; font-size: 1.05rem; }
.nx-recibo-cabeza small { display: block; color: ${SUAVE}; }
.nx-recibo-cabeza p { margin-top: .55rem; }
.nx-recibo-cabeza p strong { font-size: 1.2rem; }
.nx-codigo { display: grid; width: 6.5rem; height: 6.5rem; flex-shrink: 0; padding: 5px; background: #fff; border: 1px solid ${BORDE_HONDO}; border-radius: 6px; }
.nx-codigo i[data-lleno] { background: ${CARBON}; }
.nx-recibo-datos, .nx-recibo-montos { display: grid; gap: .35rem; padding-block: .85rem; border-bottom: 1px dashed ${BORDE_HONDO}; }
.nx-recibo-datos div, .nx-recibo-montos div { display: flex; justify-content: space-between; gap: 1rem; }
.nx-recibo-datos dt, .nx-recibo-montos dt { flex-shrink: 0; color: ${SUAVE}; }
.nx-recibo-datos dd, .nx-recibo-montos dd { font-weight: 600; text-align: right; }
.nx-recibo-montos .nx-total { font-size: 1.1rem; font-weight: 700; }
.nx-recibo-montos .nx-total dt { color: ${CARBON}; }
.nx-recibo-recepcion { padding-block: .75rem; border-bottom: 1px dashed ${BORDE_HONDO}; font-size: .84rem; }
.nx-poliza { margin-top: .9rem; padding: .9rem; background: ${TITANIO}; border: 1px solid ${BORDE}; border-radius: 12px; }
.nx-poliza h3 { font-size: .98rem; }
.nx-poliza p { margin-top: .35rem; font-weight: 600; font-size: .86rem; }
.nx-poliza ul { display: grid; gap: .2rem; margin-top: .55rem; padding-left: 1.1rem; list-style: disc; color: ${SUAVE}; font-size: .84rem; }

.nx-lab .nx-filtros { margin-block: 0 .65rem; }

/* panel: resumen ejecutivo */
.nx-cifras { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; margin-top: 1.15rem; }
@media (min-width: 860px) { .nx-cifras { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.nx-cifras button { display: flex; flex-direction: column; justify-content: space-between; gap: .3rem; min-width: 0; padding: .85rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 12px; text-align: left; transition: border-color .15s; }
.nx-cifras button:hover { border-color: ${CARBON}; }
.nx-cifra-nombre { display: flex; align-items: flex-start; justify-content: space-between; gap: .4rem; color: ${SUAVE}; font-size: .82rem; font-weight: 700; line-height: 1.35; }
.nx-cifra-nombre svg { flex-shrink: 0; color: ${COBALTO}; }
.nx-cifras strong { font-size: clamp(1.5rem, 6vw, 2rem); letter-spacing: -.03em; line-height: 1.15; }
.nx-cifras small { color: ${SUAVE}; font-size: .76rem; }
.nx-cifras button[data-fuerte="true"] { background: ${CARBON}; border-color: ${CARBON}; color: #fff; }
.nx-cifras button[data-fuerte="true"] :is(.nx-cifra-nombre, small) { color: #D4D4D8; }
.nx-panel .nx-filtros { margin-block: 0 .75rem; }

/* órdenes de venta */
.nx-ruta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-block: .65rem; }
.nx-ruta li { position: relative; display: grid; justify-items: center; gap: .25rem; color: #71717A; font-size: .74rem; font-weight: 700; }
.nx-ruta li + li::before { content: ""; position: absolute; top: 10px; right: calc(50% + 15px); width: calc(100% - 30px); height: 2px; background: ${BORDE}; }
.nx-ruta li[data-hecho="true"] { color: ${CARBON}; }
.nx-ruta li[data-hecho="true"]::before { background: ${COBALTO}; }
.nx-ruta i { display: grid; place-items: center; width: 22px; height: 22px; border: 2px solid ${BORDE_HONDO}; border-radius: 99px; font-size: .68rem; font-style: normal; }
.nx-ruta li[data-hecho="true"] i { background: ${COBALTO}; border-color: ${COBALTO}; color: #fff; }
.nx-ficha-datos .nx-total { font-size: 1.05rem; }
.nx-ficha-datos .nx-total dt { color: ${CARBON}; font-weight: 700; }
.nx-ficha-datos .nx-descuento :is(dt, dd) { color: ${COBALTO_HONDO}; font-weight: 700; }
.nx-ficha-pago { margin-top: .55rem; padding: .45rem .7rem; background: ${TITANIO}; border-radius: 8px; font-size: .86rem; font-weight: 700; text-align: center; }

/* inventario */
.nx-inventario-barra { display: grid; grid-template-columns: minmax(0, 1fr); gap: .5rem; margin-bottom: .75rem; }
@media (min-width: 620px) { .nx-inventario-barra { grid-template-columns: minmax(0, 1fr) auto; } }
.nx-variante em { display: block; width: fit-content; color: ${COBALTO_HONDO}; font-size: .72rem; font-style: normal; font-weight: 700; line-height: 1.35; }
@media (max-width: 439px) { .nx-ticket-pie .nx-btn { padding-inline: .4rem; font-size: .84rem; } .nx-ticket-pie .nx-btn svg { display: none; } }
.nx-variante em[data-tono="borde"] { color: ${CARBON}; text-decoration: underline; text-underline-offset: 3px; }
.nx-variante em[data-tono="gris"] { padding-inline: .35rem; background: #E4E4E7; border-radius: 4px; color: #3F3F46; }
.nx-colores-stock { display: flex; flex-wrap: wrap; gap: .3rem; margin-top: .5rem; padding-top: .65rem; border-top: 1px solid ${BORDE}; }
.nx-colores-stock button { display: inline-flex; align-items: center; gap: .35rem; min-height: 36px; padding-inline: .6rem; border: 1px solid ${BORDE_HONDO}; border-radius: 99px; font-size: .76rem; font-weight: 600; }
.nx-colores-stock button[aria-pressed="false"] { border-style: dashed; color: #71717A; text-decoration: line-through; }
.nx-colores-stock i { width: 13px; height: 13px; border: 1px solid rgba(9,9,11,.22); border-radius: 99px; }
.nx-publicar { margin-bottom: .85rem; padding: 1rem; background: #fff; border: 1px solid ${CARBON}; border-radius: 14px; }
.nx-publicar-cabeza { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-bottom: .75rem; }
.nx .nx-publicar h2 { display: flex; align-items: center; gap: .5rem; font-size: 1.1rem; }
.nx-publicar h2 svg { flex-shrink: 0; color: ${COBALTO}; }
.nx-publicar-cabeza button { display: grid; place-items: center; width: 40px; height: 40px; flex-shrink: 0; border-radius: 8px; }
.nx-publicar-cabeza button:hover { background: ${TITANIO}; }
.nx-segmentos.nx-dos { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 22rem; }
.nx-publicar-campos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; align-items: end; margin-top: .75rem; }
.nx-publicar-campos .nx-todo { grid-column: 1 / -1; }
.nx-publicar-campos :is(label, .nx-subir) > span { display: block; margin-bottom: .3rem; font-size: .8rem; font-weight: 700; }
.nx-subir .nx-btn { width: 100%; min-height: 50px; }
.nx-subir img { width: 32px; height: 32px; object-fit: cover; border-radius: 6px; }
@media (min-width: 980px) { .nx-publicar-campos { grid-template-columns: repeat(4, minmax(0, 1fr)); } .nx-publicar-campos .nx-todo { grid-column: span 2; } .nx-specs-form .nx-publicar-campos { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.nx-specs-form { margin-top: .85rem; }
.nx-specs-form summary { min-height: 40px; display: flex; align-items: center; font-weight: 700; font-size: .9rem; color: ${COBALTO_HONDO}; }
.nx-publicar-enviar { margin-top: 1rem; }
.nx-inventario-barra + .nx-ingreso-listo, .nx-publicar + .nx-ingreso-listo { margin-block: 0 .75rem; }

/* taller en el panel */
.nx-casillas { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .35rem; }
.nx-casillas label { display: flex; align-items: center; gap: .5rem; min-height: 44px; padding: .3rem .6rem; background: #fff; border: 1px solid ${BORDE_HONDO}; border-radius: 9px; font-size: .82rem; font-weight: 600; line-height: 1.25; cursor: pointer; }
.nx-casillas label:has(input:checked) { border-color: ${COBALTO}; background: ${COBALTO_CLARO}; }
.nx-casillas input { width: 18px; height: 18px; flex-shrink: 0; accent-color: ${COBALTO}; }
.nx-recibir { margin-top: .85rem; }
.nx-recibir legend { float: left; width: 100%; margin-bottom: .45rem; font-size: .8rem; font-weight: 700; }
.nx-recibir legend + * { clear: both; }
.nx-imei { display: block; max-width: 15rem; margin-top: .6rem; }
.nx-imei span { display: block; margin-bottom: .3rem; font-size: .8rem; font-weight: 700; }
@media (min-width: 980px) { .nx-recibir { display: grid; grid-template-columns: minmax(0, 1fr) 14rem; gap: 0 .6rem; align-items: end; } .nx-recibir .nx-casillas { grid-template-columns: repeat(4, minmax(0, 1fr)); } .nx-recibir legend { grid-column: 1 / -1; } .nx-imei { margin-top: 0; } }
.nx-recoleccion { display: flex; align-items: center; gap: .4rem; margin-top: .4rem; color: ${COBALTO_HONDO}; font-size: .84rem; font-weight: 700; }
.nx-estados button[data-repuesto="proveedor"][aria-pressed="true"] { background: ${CARBON}; border-color: ${CARBON}; }
.nx-detalle { margin-top: .85rem; border-block: 1px solid ${BORDE}; }
.nx-detalle summary { display: flex; align-items: center; justify-content: space-between; gap: .75rem; min-height: 48px; font-size: .88rem; font-weight: 700; list-style: none; }
.nx-detalle summary::-webkit-details-marker { display: none; }
.nx-detalle summary::after { content: "+"; color: ${SUAVE}; font-size: 1.2rem; font-weight: 400; }
.nx-detalle[open] summary::after { content: "−"; }
.nx-detalle summary small { margin-left: auto; color: ${COBALTO_HONDO}; }
.nx-detalle[open] { padding-bottom: .85rem; }

@media (prefers-reduced-motion: reduce) {
  .nx-producto-ver img, .nx-destacado-foto img { transition: none; }
  .nx-modal[open], .nx-avance, .nx-esqueleto i { animation: none; }
}
`;
