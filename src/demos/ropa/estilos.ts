/* Estilos de "Vértice Studio": blanco, gris claro, negro y verde oliva. Todo va bajo .vx. */
export const LETRAS = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";

const BLANCO = "#FFFFFF";
const GRIS = "#F4F4F5";
const NEGRO = "#111111";
const OLIVA = "#3F4E3C";
/* tonos de la misma paleta */
const OLIVA_HONDO = "#2F3B2D";
const OLIVA_CLARO = "#ECEEEB";
const BORDE = "#E4E4E7";
const BORDE_HONDO = "#CFCFD4";
const SUAVE = "#52525B";

export const ESTILOS = `
.vx { background: ${BLANCO}; color: ${NEGRO}; font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.55; font-variant-numeric: tabular-nums lining-nums; min-height: 100vh; }
.vx h1, .vx h2, .vx h3 { color: inherit; font-family: inherit; font-weight: 800; letter-spacing: -.025em; line-height: 1.15; }
.vx input, .vx select, .vx button, .vx pre, .vx table { font-family: inherit; font-variant-numeric: tabular-nums lining-nums; }
.vx b, .vx strong { font-weight: 700; }
.vx small { font-size: .8rem; line-height: 1.45; }
.vx button:not(:disabled), .vx select { cursor: pointer; }
.vx button:disabled { cursor: not-allowed; }
.vx :focus-visible { outline: 3px solid ${OLIVA}; outline-offset: 2px; border-radius: 6px; }
.vx .vx-oscuro :focus-visible { outline-color: #fff; }
.vx-ancho { width: 100%; max-width: 78rem; margin-inline: auto; padding-inline: 1rem; }
@media (min-width: 720px) { .vx-ancho { padding-inline: 1.75rem; } }
.vx-oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

/* logo: solo letras y un corte oliva */
.vx-logo { display: inline-flex; align-items: center; gap: .45rem; line-height: 1; white-space: nowrap; }
.vx-logo-corte { width: 9px; height: 20px; background: ${OLIVA}; transform: skewX(-18deg); }
.vx-oscuro .vx-logo-corte { background: #8A9A85; }
.vx-logo-nombre { font-size: 1.12rem; font-weight: 800; letter-spacing: .03em; }
.vx-logo-giro { font-size: .66rem; font-weight: 500; letter-spacing: .26em; }

/* navegación fija con las tres vistas */
.vx-nav { position: sticky; top: 0; z-index: 30; background: ${BLANCO}; border-bottom: 1px solid ${BORDE}; }
.vx-nav-fila { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "logo orden" "vistas vistas"; align-items: center; gap: .5rem .75rem; padding-block: .55rem; }
.vx-nav-logo { grid-area: logo; justify-self: start; min-height: 42px; }
.vx-vistas { grid-area: vistas; display: grid; grid-template-columns: .8fr 1.2fr 1.1fr; gap: 3px; padding: 3px; background: ${GRIS}; border-radius: 10px; }
.vx-vistas button { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; min-height: 40px; padding-inline: .35rem; border-radius: 8px; color: ${SUAVE}; font-size: .83rem; font-weight: 700; white-space: nowrap; transition: background-color .15s, color .15s; }
.vx-vistas button:hover { color: ${NEGRO}; }
.vx-vistas button[aria-current="page"] { background: ${NEGRO}; color: #fff; }
@media (max-width: 479px) { .vx-vistas svg { display: none; } }
.vx-miorden { grid-area: orden; display: inline-flex; align-items: center; gap: .45rem; min-height: 42px; padding: 0 .45rem 0 .8rem; border: 1px solid ${NEGRO}; border-radius: 8px; font-size: .86rem; font-weight: 700; white-space: nowrap; transition: background-color .15s; }
.vx-miorden:hover { background: ${GRIS}; }
.vx-miorden i { display: grid; place-items: center; min-width: 25px; height: 25px; padding-inline: .3rem; border-radius: 5px; background: ${OLIVA}; color: #fff; font-size: .78rem; font-style: normal; }
@media (max-width: 359px) { .vx-miorden svg { display: none; } .vx-logo-giro { display: none; } .vx-vistas button { font-size: .74rem; } }
@media (min-width: 860px) {
  .vx-nav-fila { grid-template-columns: 1fr auto 1fr; grid-template-areas: "logo vistas orden"; min-height: 72px; }
  .vx-vistas { display: flex; }
  .vx-vistas button { padding-inline: 1.15rem; font-size: .88rem; }
  .vx-miorden { justify-self: end; }
}

/* botones */
.vx-btn { display: inline-flex; align-items: center; justify-content: center; gap: .45rem; min-height: 48px; padding: .6rem 1.2rem; border: 1px solid transparent; border-radius: 8px; font-size: .92rem; font-weight: 700; line-height: 1.25; text-align: center; text-decoration: none; transition: background-color .15s, border-color .15s, color .15s, transform .1s; }
.vx-btn:active:not(:disabled) { transform: translateY(1px); }
.vx-btn svg { flex-shrink: 0; }
.vx-lleno { width: 100%; }
.vx-negro { background: ${NEGRO}; color: #fff; }
.vx-negro:hover:not(:disabled) { background: #2A2A2A; }
.vx-oliva { background: ${OLIVA}; color: #fff; }
.vx-oliva:hover:not(:disabled) { background: ${OLIVA_HONDO}; }
.vx-oliva[aria-disabled="true"] { background: ${BORDE}; color: ${SUAVE}; }
.vx-contorno { background: ${BLANCO}; color: ${NEGRO}; border-color: ${BORDE_HONDO}; }
.vx-contorno:hover { border-color: ${NEGRO}; }
.vx-blanco { background: #fff; color: ${NEGRO}; }
.vx-blanco:hover { background: ${GRIS}; }
.vx-texto { color: ${SUAVE}; text-decoration: underline; text-underline-offset: 4px; padding-inline: .5rem; }
.vx-texto:hover { color: ${NEGRO}; }
.vx-negro:disabled, .vx-oliva:disabled { background: ${BORDE}; color: ${SUAVE}; }

/* fotos */
.vx-foto { display: block; overflow: hidden; background: ${BORDE}; }
.vx-foto img { width: 100%; height: 100%; object-fit: cover; }
.vx-mini { width: 3.5rem; height: 4.25rem; flex-shrink: 0; border-radius: 6px; }

/* tallas, cantidad y campos */
.vx-tallas { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .3rem; }
.vx-tallas button { min-height: 40px; border: 1px solid ${BORDE_HONDO}; border-radius: 6px; background: #fff; font-size: .82rem; font-weight: 700; transition: border-color .12s, background-color .12s; }
.vx-tallas button:only-child { grid-column: 1 / -1; }
.vx-tallas button:hover:not(:disabled) { border-color: ${NEGRO}; }
.vx-tallas button[aria-pressed="true"] { background: ${NEGRO}; border-color: ${NEGRO}; color: #fff; }
.vx-tallas button:disabled { background: linear-gradient(to top right, transparent calc(50% - 1px), ${BORDE_HONDO} 50%, transparent calc(50% + 1px)), ${GRIS}; border-color: ${BORDE}; color: #8B8B93; font-weight: 500; }
.vx-cantidad { display: inline-flex; align-items: center; width: fit-content; border: 1px solid ${BORDE_HONDO}; border-radius: 8px; background: #fff; }
.vx-cantidad button { display: grid; place-items: center; width: 40px; height: 38px; border-radius: 7px; }
.vx-cantidad button:hover:not(:disabled) { background: ${GRIS}; }
.vx-cantidad button:disabled { color: #A1A1AA; }
.vx-cantidad b { min-width: 1.75rem; text-align: center; font-size: .9rem; }
.vx-campo { display: block; width: 100%; min-width: 0; min-height: 48px; padding: .55rem .75rem; border: 1px solid ${BORDE_HONDO}; border-radius: 8px; background: #fff; color: ${NEGRO}; font-size: 1rem; }
.vx-campo:hover { border-color: #A1A1AA; }
.vx-campo::placeholder { color: #71717A; }
.vx-campo[aria-invalid="true"] { border: 2px solid ${NEGRO}; background: ${GRIS}; }
.vx-rotulo { display: block; margin: .85rem 0 .35rem; font-size: .82rem; font-weight: 700; }
.vx-error { margin-top: .4rem; padding-left: .6rem; border-left: 3px solid ${NEGRO}; font-size: .84rem; font-weight: 700; }
.vx-segmentos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3px; padding: 3px; background: ${GRIS}; border-radius: 10px; }
.vx-segmentos button { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; min-height: 42px; padding-inline: .5rem; border-radius: 8px; color: ${SUAVE}; font-size: .86rem; font-weight: 700; }
.vx-segmentos button[aria-pressed="true"] { background: ${NEGRO}; color: #fff; }

/* portada editorial */
.vx-portada { container-type: inline-size; display: grid; grid-template-columns: minmax(0, 1fr); background: ${GRIS}; }
.vx-portada-foto { order: -1; display: block; aspect-ratio: 4 / 3.3; overflow: hidden; background: ${NEGRO}; }
.vx-portada-foto img { width: 100%; height: 100%; object-fit: cover; object-position: 45% 18%; }
.vx-portada-texto { padding: 1.75rem 1rem 2rem; }
@media (min-width: 720px) { .vx-portada-texto { padding-inline: 1.75rem; } }
.vx-antetitulo { display: flex; align-items: center; gap: .6rem; color: ${OLIVA}; font-size: .84rem; font-weight: 700; }
.vx-antetitulo::before { content: ""; width: 2rem; height: 3px; background: ${OLIVA}; }
.vx .vx-portada h1 { margin-top: .9rem; font-size: clamp(2.6rem, 11vw, 5.6rem); letter-spacing: -.05em; line-height: .98; text-wrap: balance; }
.vx-portada-detalle { max-width: 30rem; margin-top: 1rem; color: ${SUAVE}; font-size: 1.02rem; }
.vx-portada-botones { display: flex; flex-direction: column; gap: .6rem; margin-top: 1.5rem; }
@media (min-width: 520px) { .vx-portada-botones { flex-direction: row; flex-wrap: wrap; } }
@media (min-width: 640px) and (max-width: 899px) { .vx-portada-foto { aspect-ratio: 16 / 12; } }
@media (min-width: 900px) {
  .vx-portada { grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); height: clamp(32rem, calc(100svh - 8rem), 44rem); }
  .vx-portada-foto { order: 0; aspect-ratio: auto; position: relative; }
  .vx-portada-foto img { position: absolute; inset: 0; object-position: 45% 22%; }
  /* el texto arranca en la misma línea que el logo y el catálogo, a cualquier ancho */
  .vx-portada-texto { align-self: center; padding: 2rem 1.75rem 2rem max(1.75rem, calc((100cqw - 78rem) / 2 + 1.75rem)); }
  .vx .vx-portada h1 { font-size: clamp(3.2rem, 7vw, 5.6rem); }
}

.vx-pilares { display: grid; grid-template-columns: minmax(0, 1fr); padding-block: .5rem; border-bottom: 1px solid ${BORDE}; }
.vx-pilares li { display: flex; align-items: center; gap: .8rem; padding-block: .75rem; }
.vx-pilares li + li { border-top: 1px solid ${BORDE}; }
.vx-pilares svg { flex-shrink: 0; color: ${OLIVA}; }
.vx-pilares b { display: block; font-size: .92rem; line-height: 1.35; }
.vx-pilares small { display: block; color: ${SUAVE}; }
@media (min-width: 800px) { .vx-pilares { grid-template-columns: repeat(3, minmax(0, 1fr)); padding-block: 1rem; } .vx-pilares li { justify-content: center; } .vx-pilares li + li { border-top: 0; border-left: 1px solid ${BORDE}; } }

/* catálogo */
.vx section[id] { scroll-margin-top: 7.75rem; }
@media (min-width: 860px) { .vx section[id] { scroll-margin-top: 5rem; } }
.vx-seccion { padding-block: 2.25rem 1rem; }
@media (min-width: 900px) { .vx-seccion { padding-block: 4rem 1.5rem; } }
.vx-titulo { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 1rem; }
.vx .vx-titulo h2 { font-size: clamp(1.7rem, 4vw, 2.6rem); letter-spacing: -.035em; }
.vx-titulo p { color: ${SUAVE}; font-size: .9rem; }
.vx-filtros { display: flex; gap: .4rem; max-width: calc(100% + 2rem); margin-inline: -1rem; padding: 2px 1rem .35rem; overflow-x: auto; scrollbar-width: none; }
.vx-filtros::-webkit-scrollbar { display: none; }
.vx-filtros button { flex-shrink: 0; min-height: 42px; padding-inline: 1rem; border: 1px solid ${BORDE_HONDO}; border-radius: 99px; font-size: .86rem; font-weight: 700; white-space: nowrap; }
.vx-filtros button:hover { border-color: ${NEGRO}; }
.vx-filtros button[aria-pressed="true"] { background: ${NEGRO}; border-color: ${NEGRO}; color: #fff; }
@media (min-width: 720px) { .vx-filtros { margin-inline: 0; padding-inline: 0; } }

.vx-rejilla { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.75rem .75rem; margin-top: 1.1rem; }
@media (min-width: 720px) { .vx-rejilla { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2.25rem 1.15rem; } }
@media (min-width: 1080px) { .vx-rejilla { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.vx-prenda { display: flex; flex-direction: column; gap: .55rem; min-width: 0; }
.vx-prenda-foto { position: relative; display: block; aspect-ratio: 4 / 5; overflow: hidden; border-radius: 10px; background: ${GRIS}; }
.vx-prenda-foto .vx-foto { width: 100%; height: 100%; }
.vx-prenda-foto img { transition: transform .5s ease; }
.vx-prenda:hover .vx-prenda-foto img { transform: scale(1.035); }
.vx-sello { position: absolute; left: .6rem; top: .6rem; padding: .2rem .55rem; border-radius: 5px; background: ${NEGRO}; color: #fff; font-size: .74rem; font-weight: 700; }
.vx-prenda-nombre { flex: 1; }
.vx .vx-prenda h3 { margin-top: .15rem; font-size: .98rem; font-weight: 700; letter-spacing: -.01em; line-height: 1.3; }
.vx-prenda-nombre p { margin-top: .15rem; color: ${SUAVE}; font-size: .8rem; line-height: 1.4; }
.vx-precio { font-size: 1.15rem; font-weight: 800; letter-spacing: -.02em; }
.vx-prenda-talla > div:first-child, .vx-paso-talla > div:first-child { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0 .5rem; font-size: .78rem; font-weight: 700; }
.vx-prenda-talla > div:first-child button, .vx-paso-talla > div:first-child button { display: inline-flex; align-items: center; gap: .3rem; min-height: 34px; color: ${OLIVA}; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
.vx-nota-talla { min-height: 1.25rem; margin-top: .25rem; color: ${OLIVA}; font-size: .76rem; font-weight: 600; line-height: 1.6; }
.vx-nota-talla b { color: ${NEGRO}; }
.vx-prenda .vx-btn { min-height: 44px; padding-inline: .5rem; }
.vx-esqueleto i { display: block; height: 14px; border-radius: 6px; background: ${BORDE}; animation: vx-late .6s ease-in-out infinite alternate; }
.vx-esqueleto .vx-prenda-foto { height: auto; border-radius: 10px; }
@keyframes vx-late { to { opacity: .45; } }

.vx-promo-caja { padding-block: 2rem 3rem; }
@media (min-width: 900px) { .vx-promo-caja { padding-block: 3.5rem 5rem; } }
.vx-promo { display: grid; gap: 1rem; justify-items: start; padding: 1.75rem 1.35rem; border-radius: 14px; background: ${OLIVA}; color: #fff; }
.vx .vx-promo h2 { font-size: clamp(1.4rem, 3vw, 2rem); }
.vx-promo p { margin-top: .35rem; color: #DDE2DA; }
@media (min-width: 800px) { .vx-promo { grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 1.75rem; padding: 2.25rem 2.5rem; } }

/* ventana de la guía de tallas */
.vx-modal { margin: auto; padding: 0; width: min(31rem, calc(100vw - 1.25rem)); max-width: none; max-height: calc(100dvh - 1.25rem); overflow-y: auto; overscroll-behavior: contain; border: 0; border-radius: 14px; background: #fff; color: ${NEGRO}; box-shadow: 0 40px 80px -30px rgba(17,17,17,.6); }
.vx-modal::backdrop, .vx-bandeja::backdrop { background: rgba(17,17,17,.6); }
.vx-modal[open] { animation: vx-sube .26s cubic-bezier(.2,.8,.2,1); }
@keyframes vx-sube { from { opacity: 0; transform: translateY(16px); } }
.vx-ventana-cabeza { position: sticky; top: 0; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .9rem .75rem .9rem 1.2rem; border-bottom: 1px solid ${BORDE}; background: #fff; }
.vx .vx-ventana-cabeza h2 { font-size: 1.2rem; }
.vx-ventana-cabeza p { color: ${SUAVE}; font-size: .82rem; }
.vx-ventana-cabeza button { display: grid; place-items: center; width: 42px; height: 42px; flex-shrink: 0; border-radius: 8px; }
.vx-ventana-cabeza button:hover { background: ${GRIS}; }
.vx-guia { display: grid; gap: .9rem; padding: 1.1rem 1.2rem 1.4rem; }
.vx-guia table { width: 100%; border-collapse: collapse; text-align: center; font-size: .95rem; }
.vx-guia caption { margin-bottom: .5rem; text-align: left; font-size: .82rem; font-weight: 700; color: ${OLIVA}; }
.vx-guia thead th { padding: .5rem; background: ${GRIS}; color: ${SUAVE}; font-size: .78rem; font-weight: 700; }
.vx-guia tbody th, .vx-guia td { padding: .65rem .5rem; border-bottom: 1px solid ${BORDE}; }
.vx-guia tbody th { font-weight: 800; }
.vx-guia > p { color: ${SUAVE}; font-size: .88rem; }
.vx-guia > p b { color: ${NEGRO}; }

/* bandeja superior: la orden baja desde arriba */
.vx-bandeja { position: fixed; inset: 0 0 auto 0; margin: 0 auto; padding: 0; width: min(60rem, 100vw); max-width: 100vw; max-height: 94dvh; overflow: hidden; border: 0; border-radius: 0 0 16px 16px; background: #fff; color: ${NEGRO}; box-shadow: 0 40px 80px -30px rgba(17,17,17,.65); }
.vx-bandeja[open] { animation: vx-baja .34s cubic-bezier(.2,.8,.2,1); }
@keyframes vx-baja { from { transform: translateY(-100%); } }
.vx-bandeja-caja { display: flex; flex-direction: column; max-height: 94dvh; }
.vx-bandeja-cabeza { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .7rem .75rem .7rem 1.2rem; background: ${NEGRO}; color: #fff; }
.vx .vx-bandeja-cabeza h2 { font-size: 1.15rem; }
.vx-bandeja-cabeza p { color: #B4B4BB; font-size: .8rem; }
.vx-bandeja-cabeza button { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 8px; }
.vx-bandeja-cabeza button:hover { background: #2A2A2A; }
.vx-bandeja-forma { display: flex; flex-direction: column; min-height: 0; }
.vx-bandeja-cuerpo { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
.vx-lineas { padding-inline: 1.15rem; }
.vx-lineas > li + li { border-top: 1px solid ${BORDE}; }
.vx-linea { display: grid; grid-template-columns: 3.5rem minmax(0, 1fr) auto; gap: .75rem; padding-block: .85rem; }
.vx-linea b { display: block; font-size: .92rem; line-height: 1.35; }
.vx-linea small { display: block; margin-bottom: .45rem; color: ${SUAVE}; }
.vx-linea-lado { display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; gap: .5rem; }
.vx-linea-lado button, .vx-linea-cabeza button { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 8px; color: ${SUAVE}; }
.vx-linea-lado button:hover, .vx-linea-cabeza button:hover { background: ${GRIS}; color: ${NEGRO}; }
.vx-linea-lado strong { font-size: .95rem; white-space: nowrap; }
.vx-linea-combo { padding-block: .75rem .85rem; }
.vx-linea-cabeza { display: flex; align-items: center; gap: .6rem; }
.vx-linea-cabeza button { margin-left: auto; }
.vx-sello-claro { padding: .15rem .5rem; border-radius: 5px; background: ${OLIVA}; color: #fff; font-size: .72rem; font-weight: 700; }
.vx-linea-combo ul { display: grid; gap: .4rem; margin-block: .25rem .6rem; }
.vx-linea-combo ul li { display: flex; align-items: center; gap: .7rem; font-size: .86rem; font-weight: 600; line-height: 1.3; }
.vx-linea-combo .vx-mini { width: 2.75rem; height: 2.75rem; }
.vx-linea-combo small { display: block; color: ${SUAVE}; font-weight: 500; }
.vx-linea-pie { display: flex; align-items: center; justify-content: space-between; gap: .75rem; }
.vx-linea-pie s { margin-right: .55rem; color: #71717A; font-size: .84rem; }
.vx-entrega { padding: .9rem 1.15rem 1.2rem; border-top: 8px solid ${GRIS}; }
.vx-entrega legend { margin-bottom: .45rem; font-size: .82rem; font-weight: 700; }
.vx-zonas { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .45rem; }
.vx-zonas label { display: grid; align-content: start; gap: .1rem; padding: .65rem .7rem; border: 1px solid ${BORDE_HONDO}; border-radius: 8px; cursor: pointer; }
.vx-zonas label[data-activa="true"] { border-color: ${OLIVA}; box-shadow: inset 0 0 0 1px ${OLIVA}; background: ${OLIVA_CLARO}; }
.vx-zonas label:has(:focus-visible) { outline: 3px solid ${OLIVA}; outline-offset: 2px; }
.vx-zonas b { font-size: .84rem; line-height: 1.3; }
.vx-zonas span { font-size: 1rem; font-weight: 800; }
.vx-zonas small { color: ${SUAVE}; font-size: .74rem; }
.vx-dos { display: grid; grid-template-columns: minmax(0, 1fr); column-gap: .6rem; }
@media (min-width: 460px) { .vx-dos { grid-template-columns: 1.4fr 1fr; } }
.vx-bandeja-pie { padding: .7rem 1.15rem .85rem; border-top: 1px solid ${BORDE_HONDO}; background: ${GRIS}; }
.vx-bandeja-pie .vx-btn { width: 100%; margin-top: .55rem; }
.vx dl div { display: flex; justify-content: space-between; gap: 1rem; }
.vx dt { color: ${SUAVE}; }
.vx dd { font-weight: 600; white-space: nowrap; }
.vx-bandeja-pie dl, .vx-resumen dl, .vx-orden dl { display: grid; gap: .1rem; font-size: .88rem; }
.vx .vx-ahorro dt, .vx .vx-ahorro dd { color: ${OLIVA}; font-weight: 700; }
.vx-apagado dd { color: #71717A; }
.vx .vx-total { align-items: baseline; margin-top: .2rem; }
.vx .vx-total dt { color: ${NEGRO}; font-weight: 700; }
.vx-total dd, .vx-total dd strong { font-size: 1.4rem; font-weight: 800; letter-spacing: -.025em; }
@media (min-width: 820px) {
  .vx-bandeja-forma { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-template-rows: minmax(0, 1fr) auto; }
  .vx-bandeja-cuerpo { display: contents; }
  .vx-lineas, .vx-entrega { min-height: 0; max-height: calc(94dvh - 4.5rem); overflow-y: auto; overscroll-behavior: contain; }
  .vx-lineas { grid-column: 1; grid-row: 1; }
  .vx-entrega { grid-column: 2; grid-row: 1 / 3; border-top: 0; border-left: 8px solid ${GRIS}; }
  .vx-bandeja-pie { grid-column: 1; grid-row: 2; }
}
.vx-listo { display: grid; justify-items: center; gap: .7rem; min-height: 0; overflow-y: auto; padding: 2rem 1.15rem 1.5rem; text-align: center; }
.vx-listo > svg { color: ${OLIVA}; }
.vx .vx-listo h3 { font-size: 1.35rem; }
.vx-listo > p { color: ${SUAVE}; }
.vx-listo pre { width: 100%; max-width: 32rem; padding: .85rem 1rem; border: 1px dashed ${BORDE_HONDO}; border-radius: 8px; background: ${GRIS}; font-size: .82rem; text-align: left; white-space: pre-wrap; }
.vx-listo-botones { display: flex; flex-wrap: wrap; justify-content: center; gap: .5rem; }

/* barra de abajo en el celular */
.vx-barra { position: fixed; z-index: 25; left: .65rem; right: .65rem; bottom: calc(.65rem + env(safe-area-inset-bottom)); display: flex; align-items: center; justify-content: space-between; gap: .75rem; max-width: 34rem; margin-inline: auto; padding: .55rem .55rem .55rem 1rem; border-radius: 12px; background: ${NEGRO}; color: #fff; box-shadow: 0 18px 36px -16px rgba(17,17,17,.65); }
.vx-barra > div { min-width: 0; }
.vx-barra small { display: block; overflow: hidden; color: #D4D4D8; text-overflow: ellipsis; white-space: nowrap; }
.vx-barra b { font-size: 1.1rem; }
.vx-barra .vx-btn { flex-shrink: 0; min-height: 44px; padding-inline: .9rem; }
.vx-barra[hidden] { display: none; }
@media (min-width: 960px) { .vx-barra { display: none; } }

/* arma tu outfit */
.vx-vista-titulo { padding-block: 1.5rem 1.15rem; }
.vx .vx-vista-titulo h1 { font-size: clamp(1.8rem, 4.5vw, 2.8rem); letter-spacing: -.04em; }
.vx-vista-titulo p { margin-top: .3rem; color: ${SUAVE}; }
.vx-outfit { padding-bottom: 2.5rem; }
.vx-outfit-rejilla { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.25rem; align-items: start; }
@media (min-width: 960px) { .vx-outfit { padding-bottom: 5rem; } .vx-outfit-rejilla { grid-template-columns: minmax(0, 1fr) 24rem; gap: 2rem; } }
.vx-pasos { display: grid; gap: 1rem; min-width: 0; }
.vx-paso { min-width: 0; padding: 1rem; border: 1px solid ${BORDE}; border-radius: 12px; }
.vx-paso-cabeza { display: flex; align-items: center; gap: .75rem; }
.vx-paso-cabeza > span { display: grid; place-items: center; width: 32px; height: 32px; flex-shrink: 0; border: 2px solid ${NEGRO}; border-radius: 99px; font-size: .84rem; font-weight: 800; }
.vx-paso-cabeza > span[data-hecho="true"] { border-color: ${OLIVA}; background: ${OLIVA}; color: #fff; }
.vx .vx-paso h2 { font-size: 1.1rem; }
.vx-paso-cabeza p { color: ${SUAVE}; font-size: .8rem; }
.vx-opciones { display: grid; grid-auto-flow: column; grid-auto-columns: 8.75rem; gap: .6rem; margin: .85rem -1rem 0; padding: 3px 1rem .5rem; overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x proximity; scroll-padding-inline: 1rem; }
@media (min-width: 720px) { .vx-opciones { grid-auto-flow: row; grid-template-columns: repeat(5, minmax(0, 1fr)); margin-inline: 0; padding-inline: 0; overflow: visible; } }
.vx-opciones li { display: flex; scroll-snap-align: start; min-width: 0; }
.vx-opciones button { display: flex; flex-direction: column; gap: .2rem; width: 100%; padding: .3rem .3rem .55rem; border: 1px solid ${BORDE}; border-radius: 10px; text-align: left; transition: border-color .12s; }
.vx-opciones button:hover:not(:disabled) { border-color: ${NEGRO}; }
.vx-opciones button[aria-pressed="true"] { border-color: ${OLIVA}; box-shadow: inset 0 0 0 2px ${OLIVA}; background: ${OLIVA_CLARO}; }
.vx-opciones button:disabled { opacity: .55; }
.vx-opciones .vx-foto { width: 100%; aspect-ratio: 4 / 5; border-radius: 7px; }
.vx-opciones b { padding-inline: .25rem; font-size: .8rem; line-height: 1.3; }
.vx-opciones span:last-child { margin-top: auto; padding-inline: .25rem; font-size: .86rem; font-weight: 800; }
.vx-paso-talla { max-width: 22rem; margin-top: .6rem; }
.vx-resumen { min-width: 0; padding: 1.15rem; border-radius: 12px; background: ${GRIS}; scroll-margin-top: 7.75rem; }
@media (min-width: 960px) { .vx-resumen { position: sticky; top: 5.5rem; max-height: calc(100dvh - 6.5rem); overflow-y: auto; } }
.vx .vx-resumen h2 { font-size: 1.2rem; }
.vx-collage { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .4rem; margin-top: .75rem; }
.vx-collage li { aspect-ratio: 3 / 4; overflow: hidden; border-radius: 8px; background: #fff; }
.vx-collage .vx-foto { width: 100%; height: 100%; animation: vx-sube .3s ease; }
.vx-hueco { display: grid; place-items: center; width: 100%; height: 100%; padding: .4rem; border: 1px dashed ${BORDE_HONDO}; border-radius: 8px; color: ${SUAVE}; font-size: .74rem; font-weight: 700; line-height: 1.3; text-align: center; }
.vx-resumen-lista { display: grid; gap: .45rem; margin-block: .85rem; }
.vx-resumen-lista:empty { margin-block: .5rem; }
.vx-resumen-lista li { display: flex; justify-content: space-between; gap: .75rem; font-size: .86rem; font-weight: 600; line-height: 1.35; }
.vx-resumen-lista small { display: block; color: ${SUAVE}; font-weight: 500; }
.vx-resumen-lista b { white-space: nowrap; }
.vx-resumen dl { padding-top: .7rem; border-top: 1px solid ${BORDE_HONDO}; }
.vx-resumen .vx-btn { margin-top: .85rem; }
.vx-resumen-nota { min-height: 1.3rem; margin-top: .55rem; color: ${SUAVE}; font-size: .82rem; font-weight: 600; text-align: center; }

/* panel admin */
.vx-admin { padding-bottom: 3rem; }
.vx-cifras { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; }
@media (min-width: 860px) { .vx-cifras { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.vx-cifras li { display: flex; flex-direction: column; gap: .15rem; min-width: 0; padding: .9rem; border: 1px solid ${BORDE}; border-radius: 10px; }
.vx-cifras span { color: ${SUAVE}; font-size: .8rem; font-weight: 700; }
.vx-cifras b { font-size: clamp(1.3rem, 5.5vw, 1.9rem); font-weight: 800; letter-spacing: -.03em; line-height: 1.2; }
.vx-cifras small { margin-top: auto; color: ${SUAVE}; font-size: .74rem; }
.vx-cifras li[data-fuerte="true"] { border-color: ${OLIVA}; background: ${OLIVA}; color: #fff; }
.vx-cifras li[data-fuerte="true"] :is(span, small) { color: #DDE2DA; }
.vx-admin-secciones { max-width: 28rem; margin-block: 1.25rem .85rem; }
.vx-admin .vx-filtros { margin-bottom: .85rem; }
.vx-vacio { padding: 2rem 1rem; border: 1px dashed ${BORDE_HONDO}; border-radius: 10px; color: ${SUAVE}; text-align: center; }
.vx-ordenes { display: grid; grid-template-columns: minmax(0, 1fr); gap: .75rem; align-items: start; }
@media (min-width: 720px) { .vx-ordenes { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1100px) { .vx-ordenes { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.vx-orden { min-width: 0; padding: 1rem; border: 1px solid ${BORDE_HONDO}; border-radius: 12px; }
.vx-orden-cabeza { display: flex; align-items: flex-start; justify-content: space-between; gap: .6rem; }
.vx .vx-orden h2 { font-size: 1.15rem; }
.vx-orden-cabeza p { color: ${SUAVE}; font-size: .78rem; }
.vx-estado { padding: .2rem .6rem; border: 1px solid transparent; border-radius: 5px; font-size: .74rem; font-weight: 800; white-space: nowrap; }
.vx-estado[data-estado="nueva"] { background: ${OLIVA}; color: #fff; }
.vx-estado[data-estado="confirmada"] { border-color: ${OLIVA}; background: ${OLIVA_CLARO}; color: ${OLIVA_HONDO}; }
.vx-estado[data-estado="enviada"] { background: ${NEGRO}; color: #fff; }
.vx-estado[data-estado="entregada"] { background: ${BORDE}; color: ${NEGRO}; }
.vx-estado[data-estado="cancelada"] { border-color: ${BORDE_HONDO}; color: ${SUAVE}; text-decoration: line-through; }
.vx-orden-cliente { margin-block: .65rem; padding: .6rem .75rem; border-radius: 8px; background: ${GRIS}; font-size: .84rem; line-height: 1.45; overflow-wrap: anywhere; }
.vx-orden-cliente p { color: ${SUAVE}; }
.vx-orden-items { display: grid; gap: .35rem; margin-bottom: .6rem; padding-bottom: .6rem; border-bottom: 1px solid ${BORDE}; }
.vx-orden-items li { display: flex; justify-content: space-between; gap: .75rem; font-size: .86rem; line-height: 1.4; }
.vx-orden-items em { display: inline-block; margin-left: .3rem; padding-inline: .35rem; border-radius: 4px; background: ${GRIS}; font-size: .72rem; font-style: normal; font-weight: 800; }
.vx-orden-items b { white-space: nowrap; }
.vx-orden-botones { display: flex; flex-wrap: wrap; align-items: center; gap: .45rem; margin-top: .8rem; }
.vx-orden-botones .vx-btn:not(.vx-texto) { flex: 1 1 10rem; }
.vx-orden-botones p { width: 100%; font-size: .84rem; font-weight: 700; }
.vx-nota { margin-bottom: .75rem; color: ${SUAVE}; font-size: .9rem; }
.vx-inventario { display: grid; grid-template-columns: minmax(0, 1fr); gap: .6rem; }
@media (min-width: 1100px) { .vx-inventario { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.vx-articulo { min-width: 0; padding: .85rem; border: 1px solid ${BORDE_HONDO}; border-radius: 12px; }
.vx-articulo-quien { display: grid; grid-template-columns: 3.5rem minmax(0, 1fr) auto; gap: .75rem; align-items: center; }
.vx .vx-articulo h2 { font-size: .96rem; font-weight: 700; letter-spacing: -.01em; }
.vx-articulo .vx-mini { height: 3.5rem; }
.vx-precio-campo { display: grid; justify-items: end; }
.vx-precio-campo span { font-size: .72rem; font-weight: 700; color: ${SUAVE}; }
.vx-precio-campo input { width: 5.75rem; min-height: 42px; padding-inline: .6rem; border: 1px solid ${BORDE_HONDO}; border-radius: 8px; text-align: right; font-size: 1rem; font-weight: 800; }
.vx-precio-campo small { max-width: 7rem; font-weight: 700; text-align: right; }
.vx-existencias { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .4rem; margin-top: .75rem; }
@media (min-width: 560px) { .vx-existencias { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.vx-existencias li { display: grid; justify-items: center; gap: .25rem; min-width: 0; padding: .45rem .25rem; border: 1px solid transparent; border-radius: 8px; background: ${GRIS}; }
.vx-existencias li[data-nivel="poco"] { border-color: ${OLIVA}; background: ${OLIVA_CLARO}; }
.vx-existencias li[data-nivel="cero"] { border-color: ${NEGRO}; border-style: dashed; background: #fff; }
.vx-existencias li > span { font-size: .78rem; font-weight: 800; }
.vx-existencias li > div { display: flex; align-items: center; max-width: 100%; border: 1px solid ${BORDE_HONDO}; border-radius: 7px; background: #fff; }
.vx-existencias button { display: grid; place-items: center; width: 34px; height: 36px; flex-shrink: 0; }
.vx-existencias button:disabled { color: #A1A1AA; }
.vx-existencias input { width: 2.5rem; min-width: 0; height: 36px; text-align: center; font-size: .95rem; font-weight: 800; }
.vx-existencias small { color: ${SUAVE}; font-size: .7rem; font-weight: 700; }
.vx-reinicio { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: .6rem; margin-top: 2rem; font-size: .9rem; }

/* pie */
.vx-pie { background: ${NEGRO}; color: #fff; padding-block: 2.75rem 1.5rem; }
.vx-pie-marca p { max-width: 24rem; margin-top: .75rem; color: #B4B4BB; font-size: .92rem; }
.vx-pie-columnas { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.75rem; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #2E2E2E; }
@media (min-width: 640px) { .vx-pie-columnas { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1000px) { .vx-pie-columnas { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.vx .vx-pie h2 { display: flex; align-items: center; gap: .5rem; margin-bottom: .7rem; font-size: .95rem; font-weight: 700; letter-spacing: 0; }
.vx-pie h2 svg { color: #A9B7A4; }
.vx-pie li, .vx-pie section p { color: #B4B4BB; font-size: .86rem; }
.vx-pie li + li { margin-top: .35rem; }
.vx-pie-final { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .6rem 1.5rem; margin-top: 2.25rem; padding-top: 1.25rem; border-top: 1px solid #2E2E2E; color: #B4B4BB; font-size: .84rem; }
.vx-pie-final a { color: #fff; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
@media (max-width: 959px) { .vx-pie-barra { padding-bottom: 6rem; } }

@media (prefers-reduced-motion: reduce) {
  .vx-prenda-foto img, .vx-btn { transition: none; }
  .vx-prenda:hover .vx-prenda-foto img { transform: none; }
  .vx-modal[open], .vx-bandeja[open], .vx-collage .vx-foto, .vx-esqueleto i { animation: none; }
}
`;
