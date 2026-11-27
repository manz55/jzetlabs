export const LETRAS = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";

const CREMA = "#FDFCFB";
const SALVIA = "#F2F6F4";
const BORDE = "#DCE5E0";
const BOSQUE = "#1E4D3B";
const BOSQUE_HONDO = "#163A2C";
const TERRACOTA = "#C26D4A";
const TERRACOTA_HONDA = "#A75A3A";
const TEXTO = "#22332C";
const SUAVE = "#586B62";
const LINEA = "#C7D4CD";

/* Todo va bajo .pa o con el prefijo pa- para no chocar con las demás demos. */
export const ESTILOS = `
.pa { background: ${CREMA}; color: ${TEXTO}; font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; font-weight: 400; font-size: 16px; line-height: 1.6; font-variant-numeric: tabular-nums lining-nums; min-height: 100vh; }
.pa h1, .pa h2, .pa h3 { color: ${BOSQUE}; font-family: inherit; font-weight: 700; letter-spacing: -.02em; line-height: 1.2; }
.pa h3 { font-size: 1.08rem; letter-spacing: -.01em; }
.pa input, .pa select, .pa textarea, .pa button { font-family: inherit; font-variant-numeric: tabular-nums lining-nums; }
.pa :focus-visible { outline: 3px solid ${TERRACOTA}; outline-offset: 2px; border-radius: 8px; }
.pa .pa-tarjeta :focus-visible, .pa .pa-pie :focus-visible, .pa .pa-barra :focus-visible { outline-color: #fff; }
.pa section[id] { scroll-margin-top: 7.5rem; }
@media (min-width: 720px) { .pa section[id] { scroll-margin-top: 5rem; } }
html:has(.pa-modal[open]) { overflow: hidden; }
.pa button:not(:disabled), .pa select:not(:disabled) { cursor: pointer; }
.pa small { font-size: .82rem; line-height: 1.45; }
.pa strong, .pa b { font-weight: 600; }
.pa-ancho { width: 100%; max-width: 74rem; margin-inline: auto; padding-inline: 1.1rem; }
.pa-suave { color: ${SUAVE}; font-size: .92rem; }
.pa-oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.pa-con-icono { display: flex; align-items: flex-start; gap: .55rem; }
.pa-con-icono svg { flex-shrink: 0; margin-top: .22rem; }

.pa-solo-ancho { display: none; }
@media (min-width: 560px) { .pa-solo-ancho { display: inline; } }

/* logo: tres álamos en fila y el nombre */
.pa-logo { display: inline-flex; align-items: center; gap: .7rem; line-height: 1; text-align: left; }
.pa-marca { display: flex; align-items: flex-end; gap: 3px; height: 32px; flex-shrink: 0; }
.pa-marca i { width: 7px; border-radius: 99px; background: ${BOSQUE}; }
.pa-marca i:nth-child(1) { height: 20px; }
.pa-marca i:nth-child(2) { height: 32px; }
.pa-marca i:nth-child(3) { height: 25px; background: ${TERRACOTA}; }
.pa-logo-tipo { display: block; font-size: .6rem; font-weight: 600; letter-spacing: .13em; color: ${SUAVE}; white-space: nowrap; }
.pa-logo-nombre { display: block; margin-top: .22rem; font-size: 1.12rem; font-weight: 800; letter-spacing: .03em; color: ${BOSQUE}; white-space: nowrap; }

/* barra de navegación fija con las tres vistas */
.pa-nav { position: sticky; top: 0; z-index: 20; background: ${CREMA}; border-bottom: 1px solid ${BORDE}; }
.pa-nav-fila { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem 1rem; padding-block: .6rem; }
.pa-nav-enlaces { display: none; gap: .15rem; }
.pa-nav-enlaces button { min-height: 40px; padding-inline: .7rem; border-radius: 99px; font-size: .88rem; font-weight: 500; color: ${SUAVE}; white-space: nowrap; }
.pa-nav-enlaces button:hover { background: ${SALVIA}; color: ${BOSQUE}; }
.pa-vistas { display: grid; grid-template-columns: .75fr 1fr 1.1fr; gap: .45rem; width: 100%; }
.pa-vistas button { display: inline-flex; align-items: center; justify-content: center; gap: .35rem; min-height: 42px; padding-inline: .5rem; border: 1.5px solid transparent; border-radius: 999px; color: ${BOSQUE}; font-size: .84rem; font-weight: 700; white-space: nowrap; transition: background-color .15s, border-color .15s, box-shadow .15s; }
.pa-vistas button[data-vista="inicio"]:hover { background: ${SALVIA}; }
.pa-vistas button[data-vista="portal"] { background: #fff; border-color: ${BOSQUE}; }
.pa-vistas button[data-vista="portal"]:hover { background: ${SALVIA}; }
.pa-vistas button[data-vista="panel"] { background: ${BOSQUE}; color: #fff; }
.pa-vistas button[data-vista="panel"]:hover { background: ${BOSQUE_HONDO}; }
.pa-vistas button[aria-current="page"] { box-shadow: 0 0 0 2px ${CREMA}, 0 0 0 4px ${TERRACOTA}; }
.pa-vistas button[data-vista="inicio"][aria-current="page"], .pa-vistas button[data-vista="portal"][aria-current="page"] { background: ${SALVIA}; }
@media (max-width: 399px) { .pa-vistas svg { display: none; } .pa-vistas button { font-size: .8rem; } }
@media (min-width: 720px) { .pa-nav-fila { min-height: 72px; } .pa-vistas { display: flex; width: auto; gap: .6rem; } .pa-vistas button { padding-inline: 1.05rem; font-size: .88rem; } }
@media (min-width: 1140px) { .pa-nav-enlaces { display: flex; } }

/* botones */
.pa-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 48px; padding: .6rem 1.3rem; border: 1px solid transparent; border-radius: 999px; font-weight: 700; font-size: .95rem; line-height: 1.25; text-align: center; text-decoration: none; transition: background-color .15s, border-color .15s, color .15s, transform .1s; }
.pa-btn:active:not(:disabled) { transform: translateY(1px); }
.pa-btn:disabled { cursor: not-allowed; }
.pa-btn svg { flex-shrink: 0; }
.pa-chico { min-height: 40px; padding: .4rem .95rem; font-size: .87rem; }
.pa-lleno { width: 100%; }
.pa-cita { background: ${TERRACOTA}; color: #fff; }
.pa-cita:hover:not(:disabled) { background: ${TERRACOTA_HONDA}; }
.pa-cita:disabled { background: #E9EDEB; color: #7C8B84; }
.pa-bosque { background: ${BOSQUE}; color: #fff; }
.pa-bosque:hover:not(:disabled) { background: ${BOSQUE_HONDO}; }
.pa-contorno { background: #fff; color: ${BOSQUE}; border-color: ${LINEA}; }
.pa-contorno:hover:not(:disabled) { border-color: ${BOSQUE}; }
.pa-claro { background: transparent; color: #fff; border-color: rgba(255,255,255,.4); }
.pa-claro:hover { border-color: #fff; }

/* fotos */
.pa-foto { display: block; overflow: hidden; background: #E3ECE7; }
.pa-foto img { width: 100%; height: 100%; object-fit: cover; }

/* portada */
.pa-portada { padding-block: 2rem 2.75rem; }
.pa-portada-rejilla { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.75rem; align-items: center; }
.pa-ante { display: inline-flex; align-items: center; gap: .45rem; color: ${TERRACOTA_HONDA}; font-weight: 700; font-size: .92rem; }
.pa .pa-portada h1 { margin-top: .6rem; font-size: clamp(2.05rem, 5vw, 3.3rem); line-height: 1.1; letter-spacing: -.035em; }
.pa-bajada { margin-top: 1rem; max-width: 33rem; color: ${SUAVE}; font-size: 1.06rem; }
.pa-acciones { display: flex; flex-direction: column; gap: .65rem; margin-top: 1.5rem; }
@media (min-width: 520px) { .pa-acciones { flex-direction: row; flex-wrap: wrap; } }
.pa-portada-foto .pa-foto { aspect-ratio: 4 / 3; border-radius: 24px 24px 24px 90px; }
.pa-portada-foto img { object-position: 55% 30%; }
.pa-promesas { display: grid; grid-template-columns: minmax(0, 1fr); gap: .5rem; margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1px solid ${BORDE}; }
.pa-promesas li { display: flex; align-items: center; gap: .6rem; color: ${BOSQUE}; font-size: .92rem; font-weight: 600; }
.pa-promesas svg { flex-shrink: 0; color: ${TERRACOTA_HONDA}; }
@media (min-width: 560px) { .pa-promesas { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; } .pa-promesas li { align-items: flex-start; flex-direction: column; gap: .4rem; font-size: .86rem; line-height: 1.4; } }
@media (min-width: 960px) {
  .pa-portada { padding-block: 3.75rem 4rem; }
  .pa-portada-rejilla { grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: 3.5rem; }
  .pa-portada-foto .pa-foto { aspect-ratio: 6 / 5; }
}

/* secciones */
.pa-seccion { padding-block: 3.25rem; }
@media (min-width: 960px) { .pa-seccion { padding-block: 4.75rem; } }
.pa-salvia { background: ${SALVIA}; border-block: 1px solid ${BORDE}; }
.pa-titulo { max-width: 40rem; margin-bottom: 1.6rem; }
.pa .pa-titulo h2 { font-size: clamp(1.6rem, 3.5vw, 2.2rem); }
.pa-titulo p { margin-top: .45rem; color: ${SUAVE}; }

/* esquema de vacunas */
.pa-etapas { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem; }
@media (min-width: 640px) { .pa-etapas { display: flex; flex-wrap: wrap; } }
.pa-etapas button { min-height: 46px; padding-inline: 1.2rem; border: 1px solid ${LINEA}; border-radius: 999px; background: #fff; font-size: .92rem; font-weight: 600; white-space: nowrap; transition: background-color .15s, border-color .15s; }
.pa-etapas button:hover { border-color: ${BOSQUE}; }
.pa-etapas button[aria-pressed="true"] { background: ${BOSQUE}; border-color: ${BOSQUE}; color: #fff; }
.pa-nota-etapa { margin-block: 1rem 1.25rem; color: ${SUAVE}; font-size: .93rem; }
.pa-vacunas { display: grid; grid-template-columns: minmax(0, 1fr); gap: .9rem; }
@media (min-width: 640px) { .pa-vacunas { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1000px) { .pa-vacunas { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.pa-vacuna { display: flex; flex-direction: column; gap: .55rem; min-height: 15.5rem; padding: 1.25rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 16px; transition: border-color .15s, box-shadow .15s; }
.pa-vacuna[data-elegida="true"] { border-color: ${BOSQUE}; box-shadow: 0 0 0 1px ${BOSQUE}; }
.pa-dosis { display: flex; flex-wrap: wrap; gap: .35rem; }
.pa-dosis span { padding: .1rem .6rem; background: ${SALVIA}; border: 1px solid ${BORDE}; border-radius: 999px; color: ${BOSQUE}; font-size: .77rem; font-weight: 600; }
.pa-precio { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .6rem; margin-top: auto; padding-top: .85rem; border-top: 1px solid ${BORDE}; }
.pa-precio > span { display: grid; line-height: 1.2; }
.pa-precio strong { color: ${BOSQUE}; font-size: 1.45rem; font-weight: 700; letter-spacing: -.02em; }
.pa-precio small { color: ${SUAVE}; }
.pa-hueso { display: block; border-radius: 7px; background: linear-gradient(100deg, #E9F0EC 30%, #F8FAF9 50%, #E9F0EC 70%); background-size: 220% 100%; animation: pa-brillo 1.2s linear infinite; }
@keyframes pa-brillo { from { background-position: 120% 0; } to { background-position: -100% 0; } }
.pa-pie-vacunas { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .9rem 2rem; margin-top: 1.25rem; }
.pa-pie-vacunas p { max-width: 38rem; color: ${SUAVE}; font-size: .86rem; }

/* crecimiento */
.pa-crece { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.25rem; align-items: start; }
@media (min-width: 960px) { .pa-crece { grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 2rem; } }
.pa-caja { min-width: 0; padding: 1.2rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 18px; }
@media (min-width: 640px) { .pa-caja { padding: 1.5rem; } }
.pa-medidas { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .6rem; margin-top: 1rem; }
.pa-campo { display: grid; grid-template-columns: minmax(0, 1fr); gap: .3rem; min-width: 0; align-content: start; }
.pa-campo > span { font-size: .85rem; font-weight: 600; }
.pa-campo input, .pa-campo select, .pa-campo textarea { width: 100%; min-width: 0; min-height: 48px; padding: .5rem .8rem; background-color: #fff; border: 1px solid ${LINEA}; border-radius: 12px; color: ${TEXTO}; font-size: 16px; }
.pa-campo input[aria-invalid="true"] { border-color: #B4533A; background: #FDF3EF; }
.pa-segmento { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 4px; background: ${SALVIA}; border: 1px solid ${BORDE}; border-radius: 999px; }
.pa-segmento button { min-height: 40px; border-radius: 999px; font-size: .9rem; font-weight: 600; }
.pa-segmento button[aria-pressed="true"] { background: ${BOSQUE}; color: #fff; }
.pa-crece-foto { display: none; }
@media (min-width: 960px) { .pa-crece-foto { display: block; height: 11.5rem; margin-top: 1.25rem; border-radius: 14px; } .pa-crece-foto img { object-position: 50% 25%; } }
.pa-resultado h3 { font-size: 1.3rem; }
.pa-medida { margin-top: 1.4rem; padding-top: 1.2rem; border-top: 1px solid ${BORDE}; }
.pa-medida-cabeza { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .25rem 1rem; }
.pa-medida-cabeza strong { color: ${BOSQUE}; font-size: 1.6rem; font-weight: 700; letter-spacing: -.02em; }
.pa-regla { position: relative; height: 14px; margin-top: .85rem; border-radius: 99px; background: linear-gradient(90deg, #EBC3B1 0 3%, #CFE1D7 3% 15%, #9CC2AE 15% 85%, #CFE1D7 85% 97%, #EBC3B1 97%); }
.pa-regla i { position: absolute; top: 50%; width: 22px; height: 22px; background: ${BOSQUE}; border: 4px solid #fff; border-radius: 50%; box-shadow: 0 2px 10px rgba(22,58,44,.4); transform: translate(-50%, -50%); transition: left .5s cubic-bezier(.2,.8,.2,1); }
.pa-regla-numeros { display: flex; justify-content: space-between; margin-top: .45rem; color: ${SUAVE}; font-size: .74rem; }
.pa-estado-medida { display: inline-flex; align-items: center; gap: .35rem; padding: .15rem .7rem; border-radius: 999px; background: #E3F0E9; color: ${BOSQUE}; font-size: .82rem; font-weight: 700; }
.pa-estado-medida[data-zona="bajo"], .pa-estado-medida[data-zona="alto"] { background: #FBE7DD; color: #8E4126; }
.pa-resultado .pa-btn { margin-top: 1.25rem; }
.pa-referencia { margin-top: .85rem; color: ${SUAVE}; font-size: .8rem; }
.pa-vacio { padding-block: 1.5rem; color: ${SUAVE}; text-align: center; }

/* servicios */
.pa-servicios { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
@media (min-width: 640px) { .pa-servicios { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1040px) { .pa-servicios { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.pa-servicios li { display: flex; flex-direction: column; gap: .65rem; padding: 1.35rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 18px; }
.pa-servicio-icono { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; background: ${SALVIA}; border: 1px solid ${BORDE}; color: ${BOSQUE}; }
.pa-servicios .pa-btn { margin-top: .35rem; }

/* doctora */
.pa-doctora { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.75rem; align-items: center; }
.pa-doctora .pa-foto { aspect-ratio: 4 / 3; border-radius: 90px 24px 24px 24px; }
.pa-doctora img { object-position: 45% 20%; }
@media (min-width: 900px) { .pa-doctora { grid-template-columns: minmax(0, .85fr) minmax(0, 1fr); gap: 3.5rem; } .pa-doctora .pa-foto { aspect-ratio: 5 / 6; } }
.pa .pa-doctora h2 { margin-top: .35rem; font-size: clamp(1.7rem, 3.6vw, 2.35rem); }
.pa-credencial { display: inline-flex; align-items: flex-start; gap: .5rem; margin-top: .85rem; padding: .5rem .85rem; background: ${SALVIA}; border: 1px solid ${BORDE}; border-radius: 12px; color: ${BOSQUE}; font-size: .86rem; font-weight: 600; line-height: 1.4; }
.pa-credencial svg { flex-shrink: 0; margin-top: .1rem; }
.pa .pa-doctora-texto { margin-top: 1rem; }
.pa-enfoque { display: grid; gap: .75rem; margin-block: 1.25rem 1.5rem; }
.pa-enfoque li { padding-left: 1rem; border-left: 3px solid ${TERRACOTA}; }
.pa-enfoque strong { display: block; color: ${BOSQUE}; }
.pa-enfoque span { color: ${SUAVE}; font-size: .92rem; }
.pa-equipo-linea { margin-top: 1rem; color: ${SUAVE}; font-size: .88rem; }

/* testimonios */
.pa-testimonios { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
@media (min-width: 820px) { .pa-testimonios { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; } }
.pa-testimonios li { display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 18px; }
.pa-testimonios svg { color: ${TERRACOTA}; }
.pa-testimonios blockquote { font-size: .98rem; }
.pa-testimonios footer { margin-top: auto; padding-top: .85rem; border-top: 1px solid ${BORDE}; color: ${SUAVE}; font-size: .85rem; font-weight: 600; }
.pa-muestra { margin-top: 1rem; color: ${SUAVE}; font-size: .8rem; }

/* ubicación */
.pa-ubicacion { display: grid; grid-template-columns: minmax(0, 1fr); overflow: hidden; background: ${BOSQUE}; color: rgba(255,255,255,.86); border-radius: 24px; }
.pa-ubicacion > .pa-foto { aspect-ratio: 16 / 10; }
.pa-ubicacion > div { padding: 1.5rem; }
@media (min-width: 900px) { .pa-ubicacion { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } .pa-ubicacion > .pa-foto { aspect-ratio: auto; height: 100%; min-height: 28rem; } .pa-ubicacion > div { padding: 2.75rem; } }
.pa .pa-ubicacion h2 { color: #fff; font-size: clamp(1.6rem, 3.4vw, 2.1rem); }
.pa-ubicacion dl { display: grid; gap: 1rem; margin-block: 1.35rem 1.6rem; }
.pa-ubicacion dl > div { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .1rem .75rem; }
.pa-ubicacion dt { display: contents; }
.pa-ubicacion dt svg { grid-row: span 2; margin-top: .2rem; color: #F0B49B; }
.pa-ubicacion dt span { color: #fff; font-weight: 700; }
.pa-ubicacion dd { grid-column: 2; font-size: .92rem; }
.pa-ubicacion-botones { display: flex; flex-wrap: wrap; gap: .65rem; }
.pa .pa-ubicacion :focus-visible { outline-color: #fff; }

/* portal padres */
.pa-bienvenida { padding-block: 1.75rem .5rem; }
.pa .pa-bienvenida h1 { font-size: clamp(1.7rem, 4vw, 2.3rem); }
.pa-bienvenida > div > p { margin-top: .35rem; color: ${SUAVE}; }
.pa-atajos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; margin-top: 1.25rem; }
@media (min-width: 720px) { .pa-atajos { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.pa-atajos button { display: flex; align-items: center; gap: .65rem; min-height: 56px; padding: .6rem .9rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 16px; color: ${BOSQUE}; font-size: .9rem; font-weight: 700; text-align: left; line-height: 1.3; }
.pa-atajos button:hover { border-color: ${BOSQUE}; background: ${SALVIA}; }
.pa-atajos svg { flex-shrink: 0; color: ${TERRACOTA_HONDA}; }
.pa-hijos { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1rem; }
.pa-hijos button { display: grid; min-width: 9.5rem; padding: .55rem 1rem; background: #fff; border: 1px solid ${LINEA}; border-radius: 16px; text-align: left; line-height: 1.35; }
.pa-hijos button span { color: ${SUAVE}; font-size: .8rem; }
.pa-hijos button[aria-pressed="true"] { background: ${BOSQUE}; border-color: ${BOSQUE}; color: #fff; }
.pa-hijos button[aria-pressed="true"] span { color: rgba(255,255,255,.8); }
.pa-carne { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; align-items: start; }
@media (min-width: 900px) { .pa-carne { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.pa-carne ul li { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem .9rem; padding-block: .75rem; border-top: 1px solid ${BORDE}; }
.pa-carne ul { margin-top: .75rem; }
.pa-carne li > span { display: grid; flex: 1 1 12rem; min-width: 0; line-height: 1.4; }
.pa-carne li strong { font-size: .92rem; }
.pa-carne li small { color: ${SUAVE}; }
.pa-carne .pa-enlace { min-height: 36px; }

/* cita rápida */
.pa-modal { width: min(34rem, calc(100vw - 1.5rem)); max-height: calc(100dvh - 1.5rem); margin: auto; padding: 0; overflow-y: auto; background: ${CREMA}; color: ${TEXTO}; border: 0; border-radius: 22px; box-shadow: 0 40px 80px -30px rgba(10,30,22,.7); }
.pa-modal::backdrop { background: rgba(14,36,27,.6); }
.pa-modal-caja { padding: 1.25rem; }
@media (min-width: 560px) { .pa-modal-caja { padding: 1.75rem; } }
.pa-modal-cabeza { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.1rem; }
.pa .pa-modal-cabeza h2 { font-size: 1.35rem; }
.pa-cerrar { display: grid; place-items: center; width: 40px; height: 40px; flex-shrink: 0; border: 1px solid ${BORDE}; border-radius: 50%; }
.pa-modal form { display: grid; grid-template-columns: minmax(0, 1fr); gap: .85rem; }
.pa-modal .pa-resumen dt { color: ${SUAVE}; }
.pa-modal-total { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .25rem 1rem; padding-top: .75rem; border-top: 1px solid ${BORDE}; }
.pa-modal-total strong { color: ${BOSQUE}; font-size: 1.7rem; font-weight: 700; }
.pa-modal-botones { display: grid; gap: .55rem; margin-top: 1rem; }
.pa-modal .pa-sello { background: ${BOSQUE}; color: #fff; }

/* agenda en vista dividida */
.pa-dividida { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.25rem; align-items: start; }
@media (min-width: 960px) { .pa-dividida { grid-template-columns: minmax(0, 1fr) 23.5rem; gap: 2rem; } }
.pa-pasos { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
.pa-paso { min-width: 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: .85rem; padding: 1.15rem; border: 1px solid ${BORDE}; border-radius: 18px; background: #fff; }
@media (min-width: 640px) { .pa-paso { padding: 1.5rem; } }
.pa-paso h3 { display: flex; align-items: center; gap: .65rem; }
.pa-paso h3 span { display: grid; place-items: center; width: 28px; height: 28px; flex-shrink: 0; border-radius: 50%; background: ${BOSQUE}; color: #fff; font-size: .85rem; }
.pa-opciones { display: grid; grid-template-columns: minmax(0, 1fr); gap: .6rem; }
.pa-opcion { display: flex; align-items: center; gap: .8rem; padding: .75rem .85rem; background: #fff; border: 1px solid ${LINEA}; border-radius: 14px; cursor: pointer; transition: border-color .15s, box-shadow .15s, background-color .15s; }
.pa-opcion:has(input:checked) { background: ${SALVIA}; border-color: ${BOSQUE}; box-shadow: 0 0 0 1px ${BOSQUE}; }
.pa-opcion input { width: 18px; height: 18px; flex-shrink: 0; accent-color: ${BOSQUE}; }
.pa-opcion img { width: 52px; height: 52px; flex-shrink: 0; border-radius: 50%; object-fit: cover; object-position: 50% 20%; background: #E3ECE7; }
.pa-opcion > span { display: grid; flex: 1; min-width: 0; line-height: 1.35; }
.pa-opcion strong { font-size: .94rem; }
.pa-opcion small { color: ${SUAVE}; }
.pa-opcion > b { flex-shrink: 0; color: ${BOSQUE}; font-size: .9rem; }
.pa-fichas { display: flex; flex-wrap: wrap; gap: .45rem; }
.pa-fichas li { display: inline-flex; align-items: center; gap: .4rem; padding: .25rem .35rem .25rem .8rem; background: ${SALVIA}; border: 1px solid ${BORDE}; border-radius: 999px; font-size: .85rem; font-weight: 600; }
.pa-fichas button { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; }
.pa-fichas button:hover { background: #fff; }
.pa-elegir-hijo { display: flex; flex-wrap: wrap; gap: .45rem; }
.pa-elegir-hijo button { min-height: 40px; padding-inline: .95rem; background: #fff; border: 1px solid ${LINEA}; border-radius: 99px; font-size: .86rem; font-weight: 600; }
.pa-elegir-hijo button[aria-pressed="true"] { background: ${BOSQUE}; border-color: ${BOSQUE}; color: #fff; }
.pa-urgente { display: flex; gap: .55rem; align-items: flex-start; padding: .7rem .85rem; background: #FBE7DD; color: #7A361F; border-radius: 12px; font-size: .88rem; }
.pa-urgente svg { flex-shrink: 0; margin-top: .18rem; }
.pa-fechas { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .5rem; }
@media (min-width: 640px) { .pa-fechas { grid-template-columns: repeat(6, minmax(0, 1fr)); } }
.pa-fechas button { display: grid; justify-items: center; padding-block: .5rem; background: #fff; border: 1px solid ${LINEA}; border-radius: 12px; line-height: 1.25; }
.pa-fechas span { font-size: .75rem; color: ${SUAVE}; }
.pa-fechas strong { font-size: 1.2rem; font-weight: 700; }
.pa-jornada > p { margin-bottom: .4rem; font-size: .85rem; font-weight: 600; }
.pa-horas { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .5rem; }
@media (min-width: 640px) { .pa-horas { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
.pa-horas button { min-height: 44px; padding-inline: .2rem; background: #fff; border: 1px solid ${LINEA}; border-radius: 10px; font-size: .84rem; font-weight: 600; white-space: nowrap; }
.pa-fechas button:hover:not(:disabled), .pa-horas button:hover:not(:disabled) { border-color: ${BOSQUE}; }
.pa-fechas button[aria-pressed="true"], .pa-horas button[aria-pressed="true"] { background: ${BOSQUE}; border-color: ${BOSQUE}; color: #fff; }
.pa-fechas button[aria-pressed="true"] span { color: rgba(255,255,255,.8); }
.pa-fechas button:disabled, .pa-horas button:disabled { background: transparent; border-style: dashed; color: #8A9891; cursor: not-allowed; }
.pa-fechas button:disabled span { color: #8A9891; }
.pa-horas button:disabled { text-decoration: line-through; }
.pa-dos { display: grid; grid-template-columns: minmax(0, 1fr); gap: .85rem; }
@media (min-width: 640px) { .pa-dos { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.pa-edad { display: grid; grid-template-columns: minmax(0, 1fr) 7.5rem; gap: .5rem; }

/* resumen fijo */
.pa-tarjeta { min-width: 0; padding: 1.4rem; background: ${BOSQUE}; color: #fff; border-radius: 20px; box-shadow: 0 28px 50px -30px rgba(22,58,44,.8); }
@media (min-width: 960px) { .pa-tarjeta { position: sticky; top: 84px; max-height: calc(100vh - 100px); overflow-y: auto; scrollbar-width: thin; } }
.pa .pa-tarjeta h3 { color: #fff; font-size: 1.15rem; }
.pa-resumen { margin-top: .85rem; }
.pa-resumen > div, .pa-cargos > div { display: flex; justify-content: space-between; gap: 1rem; padding-block: .3rem; font-size: .88rem; line-height: 1.4; }
.pa-resumen dt, .pa-cargos dt { color: rgba(255,255,255,.75); }
.pa-resumen dd, .pa-cargos dd { text-align: right; font-weight: 600; }
.pa-cargos { margin-top: .75rem; padding-top: .6rem; border-top: 1px solid rgba(255,255,255,.2); }
.pa-total { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .25rem 1rem; margin-top: .75rem; padding-top: .75rem; border-top: 1px solid rgba(255,255,255,.2); }
.pa-total span { color: rgba(255,255,255,.8); font-size: .9rem; }
.pa-total strong { font-size: 2.1rem; font-weight: 700; letter-spacing: -.025em; line-height: 1.15; }
.pa-aviso { display: flex; gap: .5rem; align-items: flex-start; margin-top: .85rem; padding: .6rem .75rem; background: #FBE7DD; color: #7A361F; border-radius: 12px; font-size: .87rem; font-weight: 600; }
.pa-aviso svg { flex-shrink: 0; margin-top: .15rem; }
.pa-tarjeta .pa-btn { margin-top: .9rem; }
.pa-tarjeta .pa-btn + .pa-btn { margin-top: .55rem; }
.pa-nota { margin-top: .65rem; text-align: center; font-size: .78rem; color: rgba(255,255,255,.75); }
.pa-sello { display: grid; place-items: center; width: 50px; height: 50px; margin-bottom: .75rem; border-radius: 50%; background: ${TERRACOTA}; }
.pa-folio { margin-top: .25rem; color: #BFE3D0; font-size: .85rem; font-weight: 600; }

/* barra compacta (celular) */
.pa-barra { position: fixed; z-index: 25; inset-inline: .75rem; bottom: calc(.75rem + env(safe-area-inset-bottom)); display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: .6rem .6rem .6rem 1.1rem; background: ${BOSQUE}; color: #fff; border: 1px solid rgba(255,255,255,.2); border-radius: 999px; box-shadow: 0 18px 36px -16px rgba(10,30,22,.75); transform: translateY(calc(100% + 2rem)); visibility: hidden; transition: transform .35s cubic-bezier(.2,.8,.2,1), visibility 0s .35s; }
.pa-barra[data-visible="true"] { transform: none; visibility: visible; transition: transform .35s cubic-bezier(.2,.8,.2,1); }
.pa-barra p { display: grid; min-width: 0; line-height: 1.3; }
.pa-barra span { font-size: .75rem; color: rgba(255,255,255,.78); }
.pa-barra strong { font-size: 1.15rem; font-weight: 700; }
@media (min-width: 960px) { .pa-barra { display: none; } }

/* botón de cita siempre a mano en la portada (celular) */
.pa-flotante { position: fixed; z-index: 15; inset-inline: .75rem; bottom: calc(.75rem + env(safe-area-inset-bottom)); box-shadow: 0 18px 34px -14px rgba(60,28,16,.6); transform: translateY(calc(100% + 2rem)); visibility: hidden; transition: transform .35s cubic-bezier(.2,.8,.2,1), visibility 0s .35s; }
.pa .pa-flotante[data-visible="true"] { transform: none; visibility: visible; transition: transform .35s cubic-bezier(.2,.8,.2,1); }
@media (min-width: 960px) { .pa-flotante { display: none; } }

/* panel del pediatra */
.pa-subbarra { background: #fff; border-bottom: 1px solid ${BORDE}; }
.pa-subbarra > div { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .6rem 1.5rem; padding-block: .75rem; }
.pa-subbarra p { display: grid; line-height: 1.3; }
.pa-subbarra p b { color: ${BOSQUE}; font-weight: 800; }
.pa-subbarra p span { color: ${SUAVE}; font-size: .8rem; }
.pa-pestanas { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; width: 100%; padding: 4px; background: ${SALVIA}; border: 1px solid ${BORDE}; border-radius: 999px; }
.pa-pestanas button { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; min-height: 40px; padding-inline: .4rem; border-radius: 999px; font-size: .83rem; font-weight: 600; white-space: nowrap; }
.pa-pestanas button[aria-pressed="true"] { background: ${BOSQUE}; color: #fff; }
@media (max-width: 479px) { .pa-pestanas svg { display: none; } }
@media (min-width: 760px) { .pa-pestanas { width: auto; grid-template-columns: repeat(3, auto); } .pa-pestanas button { padding-inline: 1.15rem; font-size: .87rem; } }
.pa-panel-fondo { min-height: 65vh; padding-block: 1.5rem 3.5rem; background: ${SALVIA}; }
.pa-panel-titulo { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: .75rem; }
.pa .pa-panel-titulo h1 { font-size: 1.55rem; }
.pa-indicadores { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; margin-block: 1.1rem; }
@media (min-width: 800px) { .pa-indicadores { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.pa-indicadores > div { padding: .9rem 1.1rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 16px; }
.pa-indicadores dt { color: ${SUAVE}; font-size: .82rem; }
.pa-indicadores dd { color: ${BOSQUE}; font-size: 1.7rem; font-weight: 700; letter-spacing: -.02em; line-height: 1.35; }
.pa .pa-caja h2 { font-size: 1.15rem; }
.pa-nuevas { margin-top: 1.1rem; padding: 1rem 1.1rem; background: #FBF1EC; border: 1px solid #EFD3C6; border-radius: 16px; }
.pa .pa-nuevas h2 { display: flex; align-items: center; gap: .5rem; font-size: 1rem; }
.pa-nuevas h2 span { display: grid; place-items: center; min-width: 24px; height: 24px; padding-inline: .35rem; border-radius: 99px; background: ${TERRACOTA_HONDA}; color: #fff; font-size: .75rem; }
.pa-nuevas ul { display: grid; grid-template-columns: minmax(0, 1fr); gap: .5rem; margin-top: .65rem; }
@media (min-width: 640px) { .pa-nuevas ul { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1000px) { .pa-nuevas ul { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.pa-nuevas button { display: grid; width: 100%; padding: .55rem .8rem; background: #fff; border: 1px solid #EFD3C6; border-radius: 12px; text-align: left; line-height: 1.4; }
.pa-nuevas button:hover { border-color: ${TERRACOTA}; }
.pa-nuevas small { color: ${SUAVE}; }
.pa-en-portal { justify-self: start; margin-top: .15rem; padding: 0 .5rem; background: #DDEDE4; color: ${BOSQUE}; border-radius: 99px; font-size: .7rem; font-weight: 700; }
.pa-rapido { display: grid; grid-template-columns: minmax(0, 1fr); gap: .65rem; align-items: end; margin-top: 1rem; padding: 1rem; background: ${SALVIA}; border: 1px solid ${BORDE}; border-radius: 16px; }
.pa-rapido h3, .pa-rapido-dosis, .pa-rapido .pa-falta { grid-column: 1 / -1; }
.pa-rapido h3 { font-size: .98rem; }
@media (min-width: 640px) { .pa-rapido { grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) auto; } }
.pa-falta { color: #8E4126; font-size: .88rem; font-weight: 700; }
.pa-barra-dias { display: flex; gap: .5rem; margin-block: 1rem .25rem; padding-bottom: .5rem; overflow-x: auto; scrollbar-width: thin; }
.pa-barra-dias button { display: grid; flex: 0 0 auto; min-width: 6rem; padding: .5rem .8rem; text-align: left; background: #fff; border: 1px solid ${BORDE}; border-radius: 14px; line-height: 1.35; }
.pa-barra-dias :is(span, small) { font-size: .75rem; color: ${SUAVE}; }
.pa-barra-dias button[aria-pressed="true"] { background: ${BOSQUE}; border-color: ${BOSQUE}; color: #fff; }
.pa-barra-dias button[aria-pressed="true"] :is(span, small) { color: rgba(255,255,255,.8); }
.pa-filtro { width: 100%; }
@media (min-width: 640px) { .pa-filtro { width: 17rem; } }
.pa-citas li { display: grid; grid-template-columns: 5.2rem minmax(0, 1fr); gap: .6rem .9rem; padding-block: 1rem; border-top: 1px solid ${BORDE}; }
.pa-citas li:first-child { border-top: 0; }
.pa-citas li[data-nueva="true"] { margin-inline: -.6rem; padding-inline: .6rem; background: #FBF1EC; border-radius: 12px; }
@media (min-width: 960px) { .pa-citas li { grid-template-columns: 5.5rem minmax(0, 1fr) 24rem; align-items: center; } }
.pa-cita-hora { display: grid; align-content: start; line-height: 1.35; }
.pa-cita-hora strong { color: ${BOSQUE}; font-size: .9rem; white-space: nowrap; }
.pa-cita-hora small, .pa-cita-quien small { color: ${SUAVE}; }
.pa-cita-quien { display: grid; min-width: 0; line-height: 1.5; }
.pa-cita-quien p { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem .6rem; }
.pa-cita-quien b { font-weight: 700; }
.pa-etiqueta { padding: .05rem .55rem; border-radius: 999px; background: ${TERRACOTA_HONDA}; color: #fff; font-size: .72rem; font-weight: 700; }
.pa-cita-acciones { grid-column: 1 / -1; display: grid; gap: .45rem; justify-items: end; }
@media (min-width: 960px) { .pa-cita-acciones { grid-column: auto; } }
.pa-estados { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 3px; width: 100%; padding: 3px; background: ${SALVIA}; border: 1px solid ${BORDE}; border-radius: 12px; }
.pa-estados button { min-height: 38px; padding-inline: .15rem; border-radius: 9px; color: ${SUAVE}; font-size: .74rem; font-weight: 600; line-height: 1.2; }
.pa-estados button[aria-pressed="true"] { color: #fff; background: ${BOSQUE}; }
.pa-estados button[aria-pressed="true"][data-estado="En sala"] { background: #93601B; }
.pa-estados button[aria-pressed="true"][data-estado="En consulta"] { background: ${TERRACOTA_HONDA}; }
.pa-estados button[aria-pressed="true"][data-estado="Atendida"] { background: #4F6B5E; }
.pa-enlace { display: inline-flex; align-items: center; gap: .35rem; min-height: 36px; color: ${BOSQUE}; font-size: .86rem; font-weight: 700; }
.pa-enlace:hover { text-decoration: underline; text-underline-offset: 4px; }
.pa-pacientes { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; align-items: start; margin-top: 1.1rem; }
@media (min-width: 960px) { .pa-pacientes { grid-template-columns: 20rem minmax(0, 1fr); } }
.pa-buscar { display: flex; align-items: center; gap: .5rem; min-height: 46px; padding-inline: .85rem; border: 1px solid ${LINEA}; border-radius: 12px; }
.pa-buscar:focus-within { border-color: ${BOSQUE}; box-shadow: 0 0 0 1px ${BOSQUE}; }
.pa-buscar input { flex: 1; min-width: 0; border: 0; background: transparent; font-size: 16px; }
.pa .pa-buscar input:focus-visible { outline: none; }
.pa-lista { max-height: 16rem; margin-top: .75rem; overflow-y: auto; }
@media (min-width: 960px) { .pa-lista { max-height: 38rem; } }
.pa-lista button { display: grid; width: 100%; padding: .6rem .75rem; border-radius: 12px; text-align: left; line-height: 1.4; }
.pa-lista button:hover { background: ${SALVIA}; }
.pa-lista button[aria-pressed="true"] { background: ${SALVIA}; box-shadow: inset 3px 0 0 ${TERRACOTA}; }
.pa-lista strong { font-size: .92rem; }
.pa-lista small { color: ${SUAVE}; }
.pa-lista small[data-pendiente="true"] { color: #8E4126; font-weight: 600; }
.pa-avance { display: block; height: 10px; margin-top: .9rem; overflow: hidden; background: ${SALVIA}; border: 1px solid ${BORDE}; border-radius: 99px; }
.pa-avance span { display: block; height: 100%; background: ${BOSQUE}; border-radius: 99px; transition: width .4s; }
.pa-grupo { margin-top: 1.5rem; }
.pa-grupo > h3 { font-size: .98rem; }
.pa-grupo li { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: .5rem .9rem; padding-block: .7rem; border-top: 1px solid ${BORDE}; }
.pa-grupo li > span { display: grid; min-width: 0; line-height: 1.4; }
.pa-grupo li strong { font-size: .92rem; }
.pa-grupo li small { color: ${SUAVE}; }
.pa-grupo ul { margin-top: .4rem; }
.pa-chip { display: inline-flex; align-items: center; gap: .3rem; padding: .15rem .65rem; border-radius: 999px; background: ${SALVIA}; color: ${SUAVE}; font-size: .77rem; font-weight: 700; white-space: nowrap; }
.pa-chip[data-tipo="puesta"] { background: #DDEDE4; color: ${BOSQUE}; }
.pa-chip[data-tipo="pendiente"] { background: #FBE7DD; color: #8E4126; }
.pa-acciones-dosis { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: .5rem; }
@media (max-width: 559px) { .pa-grupo li { grid-template-columns: minmax(0, 1fr); } .pa-acciones-dosis { justify-content: space-between; } }
.pa-formulario { grid-column: 1 / -1; display: grid; grid-template-columns: minmax(0, 1fr); gap: .65rem; padding: 1rem; background: ${SALVIA}; border: 1px solid ${BORDE}; border-radius: 14px; align-items: end; }
@media (min-width: 640px) { .pa-formulario { grid-template-columns: repeat(3, minmax(0, 1fr)); } .pa-formulario > div { grid-column: 1 / -1; } }
.pa-formulario > div { display: flex; flex-wrap: wrap; gap: .5rem; }
.pa-confirmacion { margin-top: .6rem; color: ${BOSQUE}; font-size: .9rem; font-weight: 700; }
.pa-confirmacion:empty { margin: 0; }
.pa-horarios-panel { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; margin-top: .5rem; }
@media (min-width: 640px) { .pa-horarios-panel { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
@media (min-width: 1000px) { .pa-horarios-panel { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
.pa-horarios-panel button { display: grid; justify-items: start; gap: .1rem; min-width: 0; min-height: 62px; padding: .5rem .75rem; text-align: left; background: #fff; border: 1px solid ${BOSQUE}; border-radius: 14px; line-height: 1.3; }
.pa-horarios-panel strong { color: ${BOSQUE}; font-size: .92rem; }
.pa-horarios-panel span { display: flex; align-items: center; gap: .3rem; max-width: 100%; font-size: .76rem; font-weight: 600; color: ${SUAVE}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pa-horarios-panel button[data-estado="cerrada"] { background: ${SALVIA}; border-style: dashed; border-color: #9BAEA4; }
.pa-horarios-panel button[data-estado="cerrada"] strong { color: ${SUAVE}; text-decoration: line-through; }
.pa-horarios-panel button[data-estado="cita"] { background: ${BOSQUE}; cursor: default; }
.pa-horarios-panel button[data-estado="cita"] :is(strong, span) { color: #fff; }
.pa-horarios-panel button:disabled[data-estado="pasada"] { opacity: .45; cursor: not-allowed; }
.pa-herramientas { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1rem; }
.pa-selectores { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.1rem; }
.pa-selectores button { min-height: 44px; padding-inline: 1.1rem; background: #fff; border: 1px solid ${LINEA}; border-radius: 999px; font-size: .89rem; font-weight: 600; }
.pa-selectores button[aria-pressed="true"] { background: ${BOSQUE}; border-color: ${BOSQUE}; color: #fff; }

/* pie */
.pa-pie { padding-block: 3.25rem 2rem; background: ${BOSQUE}; color: rgba(255,255,255,.84); font-size: .9rem; }
.pa-pie-columnas { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2rem; }
@media (min-width: 640px) { .pa-pie-columnas { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 960px) { .pa-pie-columnas { grid-template-columns: 1.1fr 1fr 1.15fr 1.15fr; gap: 2.5rem; } }
.pa .pa-pie h2 { margin-bottom: .6rem; color: #fff; font-size: .98rem; letter-spacing: 0; }
.pa-pie .pa-logo + p { margin-top: 1.1rem; max-width: 18rem; }
.pa-pie .pa-logo-tipo { color: rgba(255,255,255,.75); }
.pa-pie .pa-logo-nombre { color: #fff; }
.pa-pie .pa-marca i { background: #fff; }
.pa-pie .pa-marca i:nth-child(3) { background: #E0906E; }
.pa-pie p + p { margin-top: .6rem; }
.pa-horario > div { padding-block: .3rem; }
.pa-horario dt { color: #fff; font-weight: 600; }
.pa-emergencia { padding: 1rem 1.1rem; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.2); border-radius: 16px; }
.pa-emergencia strong { display: flex; align-items: center; gap: .55rem; margin-block: .1rem .4rem; color: #fff; font-size: 1.65rem; font-weight: 700; letter-spacing: -.01em; }
.pa-pie-final { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .5rem 2rem; margin-top: 2.5rem; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,.2); font-size: .82rem; }
.pa-pie-final p { margin: 0; }
.pa-pie-final p:last-child { margin-left: auto; }
.pa-pie-final a { color: #fff; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
@media (max-width: 959px) { .pa-pie[data-barra="true"] { padding-bottom: 5.5rem; } }

@media (prefers-reduced-motion: reduce) { .pa-hueso { animation: none; } .pa-barra, .pa-flotante, .pa-btn, .pa-regla i, .pa-avance span { transition: none; } }
`;
