/* Estilos de "Brasa & Maíz": crema, arena, carbón y terracota. Todo va bajo .bm. */
export const LETRAS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";

const CREMA = "#FAF8F5";
const ARENA = "#F2EDE4";
const CARBON = "#18181B";
const TERRA = "#C2410C";
/* tonos de la misma paleta */
const TERRA_HONDO = "#9A3412";
const TERRA_CLARO = "#FBEBE2";
const BORDE = "#E3DBCD";
const SUAVE = "#57534E";
const BLANCO = "#FFFFFF";

const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

export const ESTILOS = `
.bm { background: ${CREMA}; color: ${CARBON}; font-family: ${SANS}; font-size: 16px; line-height: 1.55; font-variant-numeric: lining-nums; min-height: 100vh; }
.bm h1, .bm h2, .bm h3 { color: inherit; font-family: ${SERIF}; font-weight: 600; letter-spacing: -.012em; line-height: 1.12; font-variant-numeric: lining-nums; }
.bm input, .bm select, .bm textarea, .bm button { font-family: inherit; font-variant-numeric: lining-nums; }
/* precios en quetzales y tiempos: cifras del mismo ancho, para que no bailen */
.bm .bm-plato-pie > strong, .bm .bm-tiempo, .bm .bm-dock-resumen strong, .bm .bm-cuentas dd, .bm .bm-lineas strong, .bm .bm-detalle strong, .bm .bm-llega b, .bm .bm-pasos small, .bm .bm-horas button, .bm .bm-reserva li, .bm .bm-pie dd, .bm .bm-libro-hora b, .bm .bm-comanda header span, .bm .bm-comanda-total, .bm .bm-entregados strong { font-variant-numeric: tabular-nums lining-nums; }
.bm b, .bm strong { font-weight: 700; }
.bm small { font-size: .8rem; line-height: 1.45; }
.bm button:not(:disabled), .bm select { cursor: pointer; }
.bm button:disabled { cursor: not-allowed; }
.bm :focus-visible { outline: 3px solid ${TERRA}; outline-offset: 2px; border-radius: 6px; }
.bm .bm-oscuro :focus-visible, .bm .bm-portada :focus-visible, .bm .bm-dock :focus-visible, .bm .bm-zona :focus-visible { outline-color: #fff; }
.bm-ancho { width: 100%; max-width: 78rem; margin-inline: auto; padding-inline: 1.1rem; }
@media (min-width: 720px) { .bm-ancho { padding-inline: 1.75rem; } }
#bm-carta, #bm-mesas { scroll-margin-top: 112px; }

/* logo de letras */
.bm-logo { font-family: ${SERIF}; font-size: 1.22rem; font-weight: 700; letter-spacing: .045em; white-space: nowrap; line-height: 1; }
.bm-logo i { color: ${TERRA}; font-weight: 500; font-size: 1.15em; padding-inline: .04em; }
.bm-oscuro .bm-logo i { color: #F08A52; }

/* botones */
.bm-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 46px; padding: .6rem 1.15rem; border: 1px solid transparent; border-radius: 999px; font-size: .92rem; font-weight: 700; line-height: 1.2; text-align: center; transition: background-color .18s, color .18s, border-color .18s, transform .12s; }
.bm-btn:not(:disabled):active { transform: scale(.97); }
.bm-btn:disabled { opacity: .45; }
.bm-btn i { display: grid; place-items: center; min-width: 22px; height: 22px; margin-right: -.45rem; border-radius: 999px; background: ${TERRA}; color: #fff; font-size: .75rem; font-style: normal; }
.bm-terra { background: ${TERRA}; color: #fff; }
.bm-terra:not(:disabled):hover { background: ${TERRA_HONDO}; }
.bm-carbon { background: ${CARBON}; color: #fff; }
.bm-carbon:not(:disabled):hover { background: #35353B; }
.bm-linea { border-color: ${CARBON}; background: transparent; color: ${CARBON}; }
.bm-linea:not(:disabled):hover { background: ${ARENA}; }
.bm-claro { border-color: rgba(250,248,245,.55); background: rgba(24,24,27,.35); color: #fff; }
.bm-claro:hover { background: ${CREMA}; color: ${CARBON}; }
.bm-lleno { width: 100%; }
.bm-enlace { display: inline-flex; align-items: center; gap: .35rem; min-height: 40px; font-size: .88rem; font-weight: 700; text-decoration: underline; text-underline-offset: 4px; }
.bm-botones { display: flex; flex-wrap: wrap; gap: .65rem; align-items: center; }

/* barra fija con las tres vistas */
.bm-nav { position: sticky; top: 0; z-index: 30; background: ${CREMA}; border-bottom: 1px solid ${BORDE}; }
.bm-nav-fila { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "logo reservar" "vistas vistas"; align-items: center; gap: .45rem .75rem; padding-block: .55rem; }
.bm-nav-logo { grid-area: logo; justify-self: start; min-height: 42px; }
.bm-nav-reservar { grid-area: reservar; min-height: 40px; padding-block: .4rem; font-size: .84rem; }
.bm-nav-reservar .bm-largo { display: none; }
.bm-vistas { grid-area: vistas; display: grid; grid-template-columns: 1.15fr .95fr 1.15fr; gap: 3px; padding: 3px; background: ${ARENA}; border-radius: 999px; }
.bm-vistas button { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; min-width: 0; min-height: 40px; padding-inline: .3rem; border-radius: 999px; color: ${SUAVE}; font-size: .78rem; font-weight: 700; white-space: nowrap; transition: background-color .15s, color .15s; }
.bm-vistas button:hover { color: ${CARBON}; }
.bm-vistas button[aria-current="page"] { background: ${CARBON}; color: #fff; }
.bm-vistas button i { display: grid; place-items: center; min-width: 19px; height: 19px; border-radius: 999px; background: ${TERRA}; color: #fff; font-size: .68rem; font-style: normal; }
.bm-vistas svg, .bm-vistas .bm-largo { display: none; }
@media (max-width: 359px) { .bm-logo { font-size: 1.05rem; } .bm-vistas button { font-size: .7rem; } }
@media (min-width: 620px) { .bm-nav-reservar .bm-largo { display: inline; } .bm-vistas svg { display: block; } }
@media (min-width: 1040px) {
  .bm-nav-fila { grid-template-columns: 1fr auto 1fr; grid-template-areas: "logo vistas reservar"; min-height: 74px; }
  .bm-vistas { display: flex; }
  .bm-vistas button { padding-inline: 1.05rem; font-size: .84rem; }
  .bm-vistas .bm-largo { display: inline; }
  .bm-vistas .bm-corto { display: none; }
  .bm-nav-reservar { justify-self: end; }
  #bm-carta, #bm-mesas { scroll-margin-top: 74px; }
}

/* portada */
.bm-portada { position: relative; display: flex; align-items: flex-end; min-height: min(640px, calc(100svh - 150px)); overflow: hidden; background: ${CARBON}; color: #fff; isolation: isolate; }
.bm-portada > img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; object-position: 66% 50%; }
.bm-portada::after { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(to top, rgba(24,24,27,.95) 14%, rgba(24,24,27,.72) 46%, rgba(24,24,27,0) 82%); }
.bm-portada-texto { padding-block: 3rem 2rem; }
.bm-sobre { color: #FDBA92; font-size: .92rem; font-weight: 700; }
.bm .bm-portada h1 { margin-top: .7rem; font-size: clamp(2.35rem, 7.4vw, 5rem); line-height: 1.04; color: #fff; }
.bm-portada h1 em { font-weight: 500; }
.bm-portada-bajada { max-width: 32rem; margin: 1rem 0 1.6rem; color: rgba(255,255,255,.86); font-size: 1.02rem; }
.bm-portada-datos { display: flex; flex-wrap: wrap; gap: .5rem 2rem; margin-top: 2rem; padding-top: 1.1rem; border-top: 1px solid rgba(255,255,255,.22); font-size: .87rem; color: rgba(255,255,255,.85); }
.bm-portada-datos li { display: flex; align-items: center; gap: .5rem; }
.bm-portada-datos svg { flex: none; color: #FDBA92; }
/* en el celular la foto va completa arriba y el texto debajo, para que el corte se vea */
@media (max-width: 899px) {
  .bm-portada { flex-direction: column; align-items: stretch; min-height: 0; }
  .bm-portada > img { position: static; height: auto; aspect-ratio: 4 / 3; max-height: 50svh; }
  .bm-portada::after { display: none; }
  .bm-portada-texto { position: relative; margin-top: -3.2rem; padding-block: 1.2rem 2rem; background: linear-gradient(to bottom, rgba(24,24,27,0), ${CARBON} 3.4rem); }
  .bm-portada-bajada { margin-block: .8rem 1.2rem; }
  .bm-portada .bm-botones { display: grid; grid-template-columns: 1fr 1fr; max-width: 30rem; }
  .bm-portada .bm-btn { padding-inline: .6rem; font-size: .86rem; }
  .bm-portada-datos { margin-top: 1.5rem; }
}
@media (max-width: 379px) { .bm-portada .bm-btn svg { display: none; } }
@media (min-width: 900px) {
  .bm-portada > img { object-position: 55% 50%; }
  .bm-portada::after { background: linear-gradient(to right, rgba(24,24,27,.95) 20%, rgba(24,24,27,.68) 48%, rgba(24,24,27,.08) 80%), linear-gradient(to top, rgba(24,24,27,.7), transparent 40%); }
  .bm-portada-texto { padding-block: 4.5rem 2.4rem; }
}

/* la cocina */
.bm-cocina { background: ${ARENA}; border-bottom: 1px solid ${BORDE}; }
.bm-cocina-fila { display: grid; gap: 1.6rem; padding-block: 2.6rem; }
.bm-cocina h2 { max-width: 16ch; font-size: clamp(1.6rem, 3.4vw, 2.2rem); }
.bm-cocina ul { display: grid; gap: 1.3rem; }
.bm-cocina li { display: flex; gap: .85rem; }
.bm-cocina li svg { flex: none; margin-top: .15rem; color: ${TERRA}; }
.bm-cocina li p { color: ${SUAVE}; font-size: .9rem; }
@media (min-width: 700px) { .bm-cocina ul { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1040px) { .bm-cocina-fila { grid-template-columns: .8fr 2.2fr; align-items: center; gap: 3rem; } }

/* títulos y filtros */
.bm-titulo-seccion h1, .bm-titulo-seccion h2 { font-size: clamp(1.9rem, 4.6vw, 2.9rem); }
.bm-titulo-seccion p { margin-top: .35rem; color: ${SUAVE}; font-size: .93rem; }
.bm-filtros { display: flex; gap: .45rem; margin-block: 1.3rem; padding: 3px; overflow-x: auto; scrollbar-width: none; }
.bm-filtros button { flex: none; min-height: 42px; padding-inline: 1.05rem; border: 1px solid ${BORDE}; border-radius: 999px; background: ${BLANCO}; font-size: .86rem; font-weight: 700; transition: background-color .15s, border-color .15s; }
.bm-filtros button:hover { border-color: ${CARBON}; }
.bm-filtros button[aria-pressed="true"] { border-color: ${CARBON}; background: ${CARBON}; color: #fff; }

/* carta */
.bm-carta { padding-block: 3.5rem; }
.bm-platos { display: grid; gap: 1.15rem; grid-template-columns: minmax(0, 1fr); align-items: stretch; }
@media (min-width: 620px) { .bm-platos { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 900px) { .bm-platos { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1160px) { .bm-platos { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.bm-plato { display: flex; flex-direction: column; overflow: hidden; border: 1px solid ${BORDE}; border-radius: 18px; background: ${BLANCO}; }
.bm-plato-foto { position: relative; aspect-ratio: 4 / 3; overflow: hidden; background: ${ARENA}; }
.bm-plato-foto img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s cubic-bezier(.2,.8,.2,1), filter .3s; }
.bm-plato:hover .bm-plato-foto img { transform: scale(1.04); }
.bm-tiempo { position: absolute; left: .7rem; bottom: .7rem; display: inline-flex; align-items: center; gap: .3rem; padding: .22rem .6rem; border-radius: 999px; background: rgba(250,248,245,.95); color: ${CARBON}; font-size: .74rem; font-weight: 700; }
.bm-sello { position: absolute; inset: 0; display: grid; place-content: center; background: rgba(24,24,27,.45); color: #fff; font-family: ${SERIF}; font-size: 1.35rem; font-style: italic; }
.bm-agotado .bm-plato-foto img { filter: grayscale(1); }
.bm-agotado:hover .bm-plato-foto img { transform: none; }
.bm-plato-cuerpo { display: flex; flex: 1; flex-direction: column; gap: .65rem; padding: 1rem; }
.bm-plato h3 { font-size: 1.28rem; }
.bm-plato h3 + small { display: block; margin-top: .15rem; color: ${TERRA_HONDO}; font-weight: 700; }
.bm-plato-cuerpo > p { color: ${SUAVE}; font-size: .88rem; }
.bm-terminos { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; padding: 3px; border-radius: 12px; background: ${ARENA}; }
.bm-terminos button { min-height: 36px; border-radius: 9px; color: ${SUAVE}; font-size: .78rem; font-weight: 700; transition: background-color .15s, color .15s; }
.bm-terminos button[aria-pressed="true"] { background: ${TERRA}; color: #fff; }
.bm-guarnicion { display: flex; flex-direction: column; gap: .25rem; font-size: .76rem; font-weight: 700; color: ${SUAVE}; }
.bm-guarnicion select { width: 100%; min-height: 40px; padding-inline: .65rem; border: 1px solid ${BORDE}; border-radius: 10px; background: ${BLANCO}; color: ${CARBON}; font-size: .86rem; font-weight: 500; }
.bm-plato-pie { display: flex; align-items: center; justify-content: space-between; gap: .75rem; margin-top: auto; padding-top: .35rem; }
.bm-plato-pie > strong { font-size: 1.25rem; font-weight: 800; }
.bm-hueso { display: block; height: 13px; border-radius: 7px; background: linear-gradient(90deg, ${ARENA} 25%, #FBF8F2 50%, ${ARENA} 75%) 0 0 / 220% 100%; animation: bm-brillo 1.1s linear infinite; }
.bm-hueso-foto { height: auto; aspect-ratio: 4 / 3; border-radius: 0; }
.bm-esqueleto .bm-plato-cuerpo { min-height: 190px; }
@keyframes bm-brillo { from { background-position: 120% 0; } to { background-position: -100% 0; } }

/* ambientes */
.bm-mesas { padding-block: 3.5rem 4rem; border-top: 1px solid ${BORDE}; background: ${ARENA}; }
.bm-zonas { display: grid; gap: 1.15rem; margin-top: 1.6rem; }
@media (min-width: 760px) { .bm-zonas { grid-template-columns: repeat(3, 1fr); } }
.bm-zona { position: relative; min-height: 340px; overflow: hidden; border-radius: 18px; background: ${CARBON}; color: #fff; isolation: isolate; display: flex; align-items: flex-end; }
.bm-zona img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; }
.bm-zona::after { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(to top, rgba(24,24,27,.94) 15%, rgba(24,24,27,.45) 55%, transparent 80%); }
.bm-zona > div { display: flex; flex-direction: column; align-items: flex-start; gap: .5rem; padding: 1.25rem; }
.bm-zona h3 { font-size: 1.7rem; }
.bm-zona p { color: rgba(255,255,255,.85); font-size: .9rem; }
.bm-zona .bm-btn { margin-top: .35rem; }
@media (min-width: 760px) { .bm-zona { min-height: 430px; } }

/* dock del pedido */
.bm-dock { position: fixed; inset-inline: 0; bottom: 0; z-index: 35; padding: .65rem .65rem calc(.65rem + env(safe-area-inset-bottom)); pointer-events: none; }
.bm-dock-caja { pointer-events: auto; display: grid; grid-template-columns: minmax(0, 1fr); gap: .55rem; width: 100%; max-width: 54rem; margin-inline: auto; padding: .65rem; border: 1px solid rgba(255,255,255,.14); border-radius: 22px; background: ${CARBON}; color: #fff; box-shadow: 0 18px 45px -14px rgba(24,24,27,.65); }
.bm-dock-resumen { display: flex; align-items: center; gap: .75rem; min-height: 44px; padding-inline: .25rem; text-align: left; }
.bm-dock-resumen > i { display: grid; flex: none; place-items: center; width: 42px; height: 42px; border-radius: 999px; background: ${CREMA}; color: ${CARBON}; font-style: normal; font-weight: 800; }
.bm-dock-resumen > span { display: flex; flex-direction: column; flex: 1; min-width: 0; line-height: 1.2; }
.bm-dock-resumen small { color: rgba(255,255,255,.68); }
.bm-dock-resumen strong { font-size: 1.35rem; font-weight: 800; }
.bm-dock-resumen > svg { flex: none; color: rgba(255,255,255,.7); }
.bm-modos { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; padding: 3px; border-radius: 999px; background: ${ARENA}; color: ${CARBON}; }
.bm-modos button { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; min-height: 40px; padding-inline: .7rem; border-radius: 999px; font-size: .82rem; font-weight: 700; white-space: nowrap; }
.bm-modos button[aria-pressed="true"] { background: ${CARBON}; color: #fff; }
.bm-dock .bm-modos { background: rgba(255,255,255,.1); color: #fff; }
.bm-dock .bm-modos button[aria-pressed="true"] { background: ${CREMA}; color: ${CARBON}; }
.bm-solo-ancho { display: none; }
@media (min-width: 520px) { .bm-ventana .bm-solo-ancho { display: inline; } }
@media (min-width: 860px) {
  .bm-dock { padding-bottom: 1.1rem; }
  .bm-dock-caja { grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: .9rem; padding: .6rem .6rem .6rem .75rem; border-radius: 999px; }
  .bm-dock .bm-solo-ancho { display: inline; }
}

/* aviso corto al agregar */
.bm-aviso { position: fixed; left: 50%; bottom: 1.25rem; z-index: 36; max-width: calc(100vw - 2rem); padding: .55rem 1rem; border: 1px solid ${BORDE}; border-radius: 999px; background: ${BLANCO}; font-size: .85rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; box-shadow: 0 10px 28px -14px rgba(24,24,27,.5); opacity: 0; transform: translate(-50%, 12px); pointer-events: none; transition: opacity .22s, transform .22s; }
.bm-aviso.bm-se-ve { opacity: 1; transform: translate(-50%, 0); }
.bm-aviso.bm-sobre-dock { bottom: calc(12.4rem + env(safe-area-inset-bottom)); }
@media (min-width: 860px) { .bm-aviso.bm-sobre-dock { bottom: 6.4rem; } }

/* ventanas */
.bm-ventana { width: 100%; max-width: 100vw; max-height: 100dvh; margin: auto auto 0; padding: 0; border: 0; background: transparent; color: ${CARBON}; overflow: visible; }
.bm-ventana::backdrop { background: rgba(24,24,27,.6); }
.bm-ventana-caja { display: flex; flex-direction: column; max-height: 92dvh; overflow: hidden; border-radius: 24px 24px 0 0; background: ${CREMA}; }
.bm-ventana[open] .bm-ventana-caja { animation: bm-sube .34s cubic-bezier(.2,.8,.2,1); }
@keyframes bm-sube { from { opacity: 0; transform: translateY(30px); } }
@media (min-width: 640px) { .bm-ventana { width: min(34rem, 94vw); margin: auto; } .bm-ventana-caja { border-radius: 24px; max-height: 90dvh; } }
.bm-ventana-alto { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding: 1.1rem 1.2rem .85rem; border-bottom: 1px solid ${BORDE}; }
.bm-ventana-alto h2 { font-size: 1.6rem; }
.bm-ventana-alto p { color: ${SUAVE}; font-size: .85rem; }
.bm-cerrar { display: grid; flex: none; place-items: center; width: 42px; height: 42px; border-radius: 999px; }
.bm-cerrar:hover { background: ${ARENA}; }
.bm-ventana-cuerpo { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 1.1rem 1.2rem 1.4rem; }
.bm-ventana-pie { padding: .85rem 1.2rem calc(.85rem + env(safe-area-inset-bottom)); border-top: 1px solid ${BORDE}; background: ${BLANCO}; }
.bm-ventana-pie .bm-cuentas { margin-bottom: .7rem; }

/* formularios */
.bm-form { display: grid; gap: 1.15rem; }
.bm-form fieldset { min-width: 0; border: 0; padding: 0; }
.bm-form legend { margin-bottom: .45rem; font-size: .82rem; font-weight: 700; }
.bm-campos { display: grid; grid-template-columns: minmax(0, 1fr); gap: .85rem; }
@media (min-width: 480px) { .bm-campos { grid-template-columns: repeat(2, minmax(0, 1fr)); } .bm-ancho-total { grid-column: 1 / -1; } }
.bm-campo { display: flex; flex-direction: column; gap: .3rem; min-width: 0; align-content: flex-start; }
.bm-campo > span:first-child { font-size: .82rem; font-weight: 700; }
.bm-campo input, .bm-campo select, .bm-campo textarea { width: 100%; min-width: 0; min-height: 46px; padding: .55rem .75rem; border: 1px solid ${BORDE}; border-radius: 12px; background: ${BLANCO}; color: ${CARBON}; font-size: 1rem; }
.bm-campo textarea { resize: vertical; }
.bm-campo [aria-invalid="true"] { border-color: ${TERRA}; background: ${TERRA_CLARO}; }
.bm-campo em, .bm-error { display: block; color: ${TERRA_HONDO}; font-size: .8rem; font-style: normal; font-weight: 700; }
.bm-error { margin-top: .4rem; }
.bm-nota { color: ${SUAVE}; font-size: .84rem; }
.bm-elige-zona + .bm-nota { margin-top: .45rem; }
.bm-elige-zona { display: grid; grid-template-columns: repeat(3, 1fr); gap: .55rem; }
.bm-elige-zona button { overflow: hidden; border: 2px solid transparent; border-radius: 14px; background: ${BLANCO}; transition: border-color .15s; }
.bm-elige-zona img { width: 100%; aspect-ratio: 16 / 11; object-fit: cover; }
.bm-elige-zona span { display: block; padding: .4rem; font-size: .84rem; font-weight: 700; }
.bm-elige-zona button[aria-pressed="true"] { border-color: ${TERRA}; }
.bm-elige-zona button[aria-pressed="true"] span { background: ${TERRA}; color: #fff; }
.bm-horas { display: grid; grid-template-columns: repeat(auto-fill, minmax(4.4rem, 1fr)); gap: .4rem; }
.bm-horas button { min-height: 42px; border: 1px solid ${BORDE}; border-radius: 10px; background: ${BLANCO}; font-size: .88rem; font-weight: 700; }
.bm-horas button:not(:disabled):hover { border-color: ${CARBON}; }
.bm-horas button[aria-pressed="true"] { border-color: ${CARBON}; background: ${CARBON}; color: #fff; }
.bm-horas button:disabled { color: #A8A29E; text-decoration: line-through; background: transparent; }
#bm-r-hora:focus { outline: none; }
.bm-contador { display: inline-flex; align-items: center; align-self: flex-start; gap: .15rem; padding: 2px; border: 1px solid ${BORDE}; border-radius: 999px; background: ${BLANCO}; }
.bm-contador button { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 999px; }
.bm-contador button:not(:disabled):hover { background: ${ARENA}; }
.bm-contador button:disabled { opacity: .3; }
.bm-contador b { min-width: 1.9rem; text-align: center; }

/* líneas, cuentas y confirmación */
.bm-lineas, .bm-detalle { display: grid; }
.bm-lineas li, .bm-detalle li { display: flex; align-items: center; gap: .75rem; padding-block: .65rem; border-bottom: 1px solid ${BORDE}; }
.bm-lineas img, .bm-detalle img { flex: none; width: 56px; height: 56px; border-radius: 12px; object-fit: cover; }
.bm-lineas li > div, .bm-detalle li > div { display: flex; flex-direction: column; flex: 1; min-width: 0; line-height: 1.35; }
.bm-lineas b, .bm-detalle b { font-size: .92rem; }
.bm-lineas small, .bm-detalle small { color: ${SUAVE}; }
.bm-lineas strong, .bm-detalle strong { font-size: .9rem; }
.bm-lineas em { color: ${TERRA_HONDO}; font-size: .8rem; font-style: normal; font-weight: 700; }
.bm-lineas .bm-contador button { width: 34px; height: 34px; }
.bm-cuentas { display: grid; gap: .15rem; }
.bm-cuentas > div { display: flex; justify-content: space-between; gap: 1rem; color: ${SUAVE}; font-size: .9rem; }
.bm-cuentas > .bm-cuentas-total { color: ${CARBON}; font-size: 1.15rem; font-weight: 800; }
.bm-listo { display: flex; flex-direction: column; align-items: stretch; gap: .75rem; text-align: center; }
.bm-listo-icono { display: grid; place-items: center; align-self: center; width: 62px; height: 62px; border-radius: 999px; background: ${TERRA}; color: #fff; }
.bm-listo-codigo { font-family: ${SERIF}; font-size: 2.1rem; font-weight: 700; font-variant-numeric: lining-nums; }
.bm-listo > p { margin-bottom: .25rem; }

/* portal del cliente */
.bm-vista { min-height: 70vh; padding-block: 2.2rem 4rem; }
.bm-portal { display: grid; gap: 1.25rem; margin-top: 1.4rem; align-items: start; }
.bm-portal > div { min-width: 0; }
.bm-portal .bm-filtros { margin-top: 0; }
@media (min-width: 960px) { .bm-portal { grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); } }
.bm-tarjeta { border: 1px solid ${BORDE}; border-radius: 20px; background: ${BLANCO}; }
.bm-vacio { display: flex; flex-direction: column; align-items: center; gap: .8rem; padding: 2.2rem 1.2rem; text-align: center; }
.bm-vacio h2 { font-size: 1.4rem; }
.bm-vacio svg { color: ${TERRA}; }
.bm-rastreo { display: grid; gap: 1.15rem; padding: 1.2rem; }
@media (min-width: 640px) { .bm-rastreo { padding: 1.6rem; } }
.bm-rastreo > header { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: .8rem; }
.bm-rastreo > header h2 { font-size: 2rem; }
.bm-rastreo > header p { color: ${SUAVE}; font-size: .88rem; }
.bm-llega { display: flex; flex-direction: column; align-items: flex-end; line-height: 1.15; }
.bm-llega small { color: ${SUAVE}; }
.bm-llega b { font-size: 1.9rem; font-weight: 800; }
.bm-estado { padding: .75rem 1rem; border-radius: 14px; background: ${TERRA_CLARO}; color: ${TERRA_HONDO}; font-size: .93rem; }
.bm-pasos { position: relative; }
.bm-pasos ol { position: relative; display: grid; gap: .9rem; }
.bm-pasos li { display: flex; align-items: center; gap: .8rem; }
.bm-pasos li i { display: grid; flex: none; place-items: center; width: 44px; height: 44px; border: 2px solid ${BORDE}; border-radius: 999px; background: ${BLANCO}; color: #8A837B; transition: background-color .3s, border-color .3s, color .3s; }
.bm-pasos li span { display: flex; flex-direction: column; line-height: 1.3; }
.bm-pasos li b { font-size: .9rem; }
.bm-pasos li small { color: ${SUAVE}; }
.bm-pasos li[data-estado="hecho"] i { border-color: ${CARBON}; background: ${CARBON}; color: #fff; }
.bm-pasos li[data-estado="ahora"] i { border-color: ${TERRA}; background: ${TERRA}; color: #fff; }
.bm-pasos li[data-estado="falta"] b { color: ${SUAVE}; }
/* la línea: vertical en el celular, horizontal desde 640px */
.bm-barra-avance { position: absolute; left: 21px; top: 22px; bottom: 22px; width: 3px; background: ${BORDE}; }
.bm-barra-avance::after { content: ""; position: absolute; inset: 0; background: ${CARBON}; transform-origin: top; transform: scaleY(var(--avance, 0)); }
@media (min-width: 640px) {
  .bm-pasos ol { grid-template-columns: repeat(4, 1fr); gap: 0; }
  .bm-pasos li { flex-direction: column; gap: .5rem; text-align: center; }
  .bm-barra-avance { left: 12.5%; right: 12.5%; top: 21px; bottom: auto; width: auto; height: 3px; }
  .bm-barra-avance::after { transform-origin: left; transform: scaleX(var(--avance, 0)); }
}
.bm-lugar { display: flex; align-items: flex-start; gap: .5rem; color: ${SUAVE}; font-size: .9rem; }
.bm-lugar svg { flex: none; margin-top: .15rem; }
.bm-portal-mesas { display: grid; gap: 1.25rem; min-width: 0; }
.bm-reserva { overflow: hidden; }
.bm-reserva > img { width: 100%; height: 150px; object-fit: cover; }
.bm-reserva > div { display: grid; gap: .85rem; padding: 1.2rem; }
.bm-reserva header { display: flex; align-items: center; justify-content: space-between; gap: .75rem; flex-wrap: wrap; }
.bm-reserva h2 { font-size: 1.4rem; }
.bm-reserva ul { display: grid; gap: .35rem; font-size: .93rem; }
.bm-reserva li { display: flex; align-items: center; gap: .55rem; }
.bm-reserva li svg { flex: none; color: ${TERRA}; }
.bm-es-cancelada > img { filter: grayscale(1); opacity: .6; }
.bm-es-cancelada ul { color: ${SUAVE}; text-decoration: line-through; }
.bm-etiqueta { padding: .25rem .7rem; border-radius: 999px; background: ${TERRA_CLARO}; color: ${TERRA_HONDO}; font-size: .76rem; font-weight: 800; white-space: nowrap; }
.bm-es-cancelada .bm-etiqueta { background: ${ARENA}; color: ${SUAVE}; }
.bm-cambio { display: grid; gap: .85rem; padding-top: .85rem; border-top: 1px solid ${BORDE}; }

/* panel de cocina y salón */
.bm-panel { background: ${ARENA}; }
.bm-panel .bm-ancho { max-width: 86rem; }
.bm-panel-alto { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 1rem; }
.bm-cifras { display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; margin-top: 1.3rem; }
@media (min-width: 760px) { .bm-cifras { grid-template-columns: repeat(4, 1fr); } }
.bm-cifras > div { display: flex; flex-direction: column; justify-content: space-between; gap: .25rem; padding: .85rem 1rem; border: 1px solid ${BORDE}; border-radius: 16px; background: ${BLANCO}; }
.bm-cifras dt { color: ${SUAVE}; font-size: .8rem; font-weight: 700; line-height: 1.3; }
.bm-cifras dd { font-size: 1.9rem; font-weight: 800; line-height: 1.1; font-variant-numeric: proportional-nums lining-nums; }
.bm-cifras dd small { color: ${SUAVE}; font-size: 1rem; }
.bm-secciones { display: flex; gap: .4rem; margin-block: 1.2rem; overflow-x: auto; padding: 3px; }
.bm-secciones button { display: inline-flex; flex: 1; align-items: center; justify-content: center; gap: .4rem; min-height: 44px; padding-inline: .9rem; border: 1px solid ${BORDE}; border-radius: 999px; background: ${BLANCO}; font-size: .87rem; font-weight: 700; }
@media (min-width: 640px) { .bm-secciones button { flex: none; } }
@media (max-width: 399px) { .bm-secciones button svg { display: none; } }
.bm-secciones button i { display: grid; place-items: center; min-width: 22px; height: 22px; padding-inline: .25rem; border-radius: 999px; background: ${ARENA}; color: ${CARBON}; font-size: .72rem; font-style: normal; }
.bm-secciones button[aria-pressed="true"] { border-color: ${CARBON}; background: ${CARBON}; color: #fff; }
.bm-secciones button[aria-pressed="true"] i { background: ${TERRA}; color: #fff; }
.bm-tablero { display: grid; gap: .85rem; align-items: start; }
@media (min-width: 680px) { .bm-tablero { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1100px) { .bm-tablero { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.bm-columna { display: grid; gap: .65rem; align-content: start; min-width: 0; padding: .65rem; border: 1px solid ${BORDE}; border-radius: 18px; background: ${CREMA}; }
.bm-columna > h2 { display: flex; align-items: center; justify-content: space-between; gap: .5rem; padding: .15rem .3rem; font-family: ${SANS}; font-size: .86rem; font-weight: 800; letter-spacing: 0; }
.bm-columna > h2 i { display: grid; place-items: center; min-width: 24px; height: 24px; border-radius: 999px; background: ${CARBON}; color: #fff; font-size: .74rem; font-style: normal; }
.bm-columna-vacia { padding: 1rem; border: 1px dashed ${BORDE}; border-radius: 12px; color: ${SUAVE}; font-size: .84rem; text-align: center; }
.bm-comanda { display: grid; gap: .55rem; padding: .85rem; border: 1px solid ${BORDE}; border-radius: 14px; background: ${BLANCO}; animation: bm-entra .35s cubic-bezier(.2,.8,.2,1); }
@keyframes bm-entra { from { opacity: 0; transform: translateY(10px); } }
.bm-comanda header { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
.bm-comanda h3 { font-size: 1.2rem; }
.bm-comanda header span { padding: .15rem .55rem; border-radius: 999px; background: ${ARENA}; font-size: .74rem; font-weight: 800; white-space: nowrap; }
.bm-comanda-quien { display: flex; align-items: center; gap: .4rem; color: ${SUAVE}; font-size: .82rem; font-weight: 700; }
.bm-comanda ul { display: grid; gap: .3rem; padding-block: .5rem; border-block: 1px solid ${BORDE}; font-size: .87rem; }
.bm-comanda li { display: flex; gap: .5rem; }
.bm-comanda li span { display: flex; flex-direction: column; min-width: 0; }
.bm-comanda li small { color: ${TERRA_HONDO}; font-weight: 700; }
.bm-comanda-nota { padding: .45rem .65rem; border-radius: 9px; background: ${TERRA_CLARO}; color: ${TERRA_HONDO}; font-size: .8rem; font-weight: 700; overflow-wrap: anywhere; }
.bm-comanda-total { font-size: .95rem; font-weight: 800; }
.bm-comanda > div { display: flex; gap: .45rem; }
.bm-comanda > div .bm-btn { flex: 1; min-height: 44px; padding-inline: .6rem; font-size: .83rem; }
.bm-regresar { display: grid; flex: none; place-items: center; width: 44px; height: 44px; border: 1px solid ${BORDE}; border-radius: 999px; background: ${BLANCO}; }
.bm-regresar:hover { border-color: ${CARBON}; }
.bm-entregados { margin-top: 1.4rem; }
.bm-entregados h2, .bm-area h2, .bm-libro h2 { font-size: 1.35rem; }
.bm-entregados ul { display: grid; gap: .5rem; margin-top: .6rem; }
.bm-entregados li { display: flex; align-items: center; gap: .8rem; padding: .5rem .5rem .5rem .9rem; border: 1px solid ${BORDE}; border-radius: 14px; background: ${BLANCO}; font-size: .87rem; }
.bm-entregados li span { flex: 1; min-width: 0; color: ${SUAVE}; }
.bm-salon { display: grid; gap: 1.2rem; align-items: start; }
.bm-salon > div { min-width: 0; }
@media (min-width: 980px) { .bm-salon { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); } }
.bm-area { margin-top: 1.1rem; }
.bm-area h2 { display: flex; align-items: baseline; gap: .6rem; }
.bm-area h2 small { color: ${SUAVE}; font-family: ${SANS}; font-weight: 700; }
.bm-mesas-rejilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(5.6rem, 1fr)); gap: .6rem; margin-top: .6rem; }
.bm-mesas-rejilla button { display: flex; flex-direction: column; align-items: center; gap: .15rem; padding: .7rem .4rem; border: 2px solid ${BORDE}; border-radius: 16px; background: ${BLANCO}; transition: background-color .18s, border-color .18s, color .18s; }
.bm-mesas-rejilla b { font-size: 1.15rem; }
.bm-mesas-rejilla small { display: inline-flex; align-items: center; gap: .25rem; }
.bm-mesas-rejilla span { font-size: .74rem; font-weight: 800; }
.bm-mesas-rejilla button[aria-pressed="true"] { border-color: ${TERRA}; background: ${TERRA}; color: #fff; }
.bm-libro { padding: 1.1rem; }
.bm-libro ul { display: grid; margin-top: .4rem; }
.bm-libro li { display: grid; grid-template-columns: 4.4rem minmax(0, 1fr); gap: .35rem .75rem; align-items: center; padding-block: .75rem; border-bottom: 1px solid ${BORDE}; }
.bm-libro li:last-child { border-bottom: 0; }
.bm-libro li > div:not(.bm-libro-botones) { display: flex; flex-direction: column; line-height: 1.35; }
.bm-libro-hora b { font-size: 1.15rem; }
.bm-libro small { color: ${SUAVE}; }
.bm-libro li > .bm-etiqueta { grid-column: 2; justify-self: start; }
.bm-libro-botones { grid-column: 2; display: flex; flex-wrap: wrap; align-items: center; gap: .4rem 1rem; }
.bm-libro-botones .bm-btn { min-height: 40px; padding-block: .35rem; font-size: .82rem; }
.bm-existencias ul { display: grid; gap: .6rem; margin-top: .8rem; }
@media (min-width: 880px) { .bm-existencias ul { grid-template-columns: 1fr 1fr; } }
.bm-existencias li { display: flex; align-items: center; gap: .75rem; padding: .6rem .75rem .6rem .6rem; border: 1px solid ${BORDE}; border-radius: 16px; background: ${BLANCO}; }
.bm-existencias img { flex: none; width: 56px; height: 56px; border-radius: 12px; object-fit: cover; }
.bm-existencias li > div { display: flex; flex-direction: column; flex: 1; min-width: 0; line-height: 1.35; }
.bm-existencias li b { font-size: .92rem; }
.bm-existencias small { color: ${SUAVE}; }
.bm-existencias .bm-sin img { filter: grayscale(1); }
.bm-interruptor { display: flex; flex: none; flex-direction: column; align-items: center; gap: .25rem; min-width: 5.4rem; min-height: 44px; justify-content: center; font-size: .74rem; font-weight: 800; }
.bm-interruptor i { position: relative; width: 46px; height: 26px; border-radius: 999px; background: #B8B0A4; transition: background-color .2s; }
.bm-interruptor i::after { content: ""; position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 999px; background: #fff; transition: transform .2s; }
.bm-interruptor[aria-checked="true"] i { background: ${TERRA}; }
.bm-interruptor[aria-checked="true"] i::after { transform: translateX(20px); }

/* pie */
.bm-pie { background: ${CARBON}; color: #fff; padding-block: 3.2rem 1.6rem; }
.bm-pie-marca p { margin-top: .6rem; color: rgba(255,255,255,.68); font-size: .92rem; }
.bm-pie-columnas { display: grid; gap: 1.8rem; margin-top: 2rem; padding-top: 1.8rem; border-top: 1px solid rgba(255,255,255,.14); }
@media (min-width: 720px) { .bm-pie-columnas { grid-template-columns: repeat(3, 1fr); gap: 3rem; } }
.bm .bm-pie h2 { display: flex; align-items: center; gap: .5rem; margin-bottom: .75rem; color: #fff; font-size: 1.15rem; }
.bm-pie h2 svg { color: #F08A52; }
.bm-pie dl { display: grid; gap: .35rem; }
.bm-pie dl > div { display: flex; justify-content: space-between; gap: 1rem; font-size: .9rem; }
.bm-pie dt, .bm-pie section p { color: rgba(255,255,255,.72); font-size: .9rem; }
.bm-pie dd { white-space: nowrap; font-weight: 700; }
.bm-pie a { text-decoration: underline; text-underline-offset: 4px; }
.bm-pie section a { display: inline-block; margin-top: .6rem; font-size: .9rem; font-weight: 700; }
.bm-privacidad { margin-top: 2rem; color: rgba(255,255,255,.55); font-size: .8rem; }
.bm-pie-final { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .5rem 1.5rem; margin-top: 1rem; padding-top: 1.1rem; border-top: 1px solid rgba(255,255,255,.14); color: rgba(255,255,255,.72); font-size: .84rem; }
.bm-pie-final a { color: #fff; font-weight: 700; }
.bm-pie-dock { padding-bottom: calc(12.5rem + env(safe-area-inset-bottom)); }
@media (min-width: 860px) { .bm-pie-dock { padding-bottom: 7rem; } }

@media (prefers-reduced-motion: reduce) {
  .bm-hueso, .bm-ventana[open] .bm-ventana-caja, .bm-comanda { animation: none; }
  .bm-plato-foto img, .bm-aviso { transition: none; }
  .bm-plato:hover .bm-plato-foto img { transform: none; }
}
`;
