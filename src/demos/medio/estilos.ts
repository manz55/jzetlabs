export const LETRAS =
  "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,600;6..72,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";

const PAPEL = "#FFFFFF";
const GRIS = "#F4F4F5";
const LINEA = "#E4E4E7";
const TINTA = "#09090B";
const ROJO = "#DC2626";
const SUAVE = "#52525B";
const SERIF = "'Newsreader', Georgia, 'Times New Roman', serif";
const SANS = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

/* Todo va bajo .cronica o con el prefijo cc- para no chocar con las demás demos. */
export const ESTILOS = `
.cronica { background: ${PAPEL}; color: ${TINTA}; font-family: ${SANS}; font-size: 16px; line-height: 1.6; font-variant-numeric: lining-nums; }
.cronica h1, .cronica h2, .cronica h3 { color: inherit; font-family: ${SERIF}; font-weight: 700; letter-spacing: -.012em; line-height: 1.15; }
.cronica :focus-visible { outline: 2px solid ${ROJO}; outline-offset: 2px; border-radius: 2px; }
.cronica .cc-nav :focus-visible, .cronica .cc-pie :focus-visible { outline-color: #fff; }
.cronica h1:focus { outline: none; }
.cronica button { cursor: pointer; }
.cronica button:disabled { cursor: default; }
.cc-ancho { width: 100%; max-width: 76rem; margin-inline: auto; padding-inline: 1rem; }
@media (min-width: 768px) { .cc-ancho { padding-inline: 2rem; } }
@media (max-width: 767.98px) { .cronica .cc-solo-ancho { display: none !important; } }
@media (min-width: 768px) { .cronica .cc-solo-chico { display: none !important; } }

/* ---------- logotipo ---------- */
.cc-logo { display: inline-flex; align-items: center; gap: .34em; font-family: ${SERIF}; font-weight: 700; text-transform: uppercase; letter-spacing: -.005em; line-height: 1; white-space: nowrap; }
.cc-logo-filete { width: .17em; height: .82em; background: ${ROJO}; }

/* ---------- encabezado ---------- */
.cc-cabeza { --mancheta: 76px; position: sticky; top: calc(-1 * var(--mancheta)); z-index: 20; background: ${PAPEL}; }
@media (min-width: 768px) { .cc-cabeza { --mancheta: 112px; } }
.cc-mancheta { height: var(--mancheta); border-bottom: 1px solid ${LINEA}; }
.cc-mancheta-fila { height: 100%; display: grid; align-items: center; justify-items: center; }
@media (min-width: 768px) {
  .cc-mancheta-fila { grid-template-columns: 1fr auto 1fr; }
  .cc-mancheta-fila > :first-child { justify-self: start; }
  .cc-mancheta-fila > :last-child { justify-self: end; }
}
.cc-mancheta-logo { display: grid; justify-items: center; gap: .3rem; text-decoration: none; }
.cc-mancheta-logo .cc-logo { font-size: clamp(1.6rem, 7.4vw, 2.1rem); }
@media (min-width: 768px) { .cc-mancheta-logo .cc-logo { font-size: 3rem; } }
.cc-mancheta-lema { font-size: .72rem; font-weight: 500; color: ${SUAVE}; line-height: 1; }
.cc-mancheta-edicion { font-size: .8rem; color: ${SUAVE}; }
.cc-boton-linea { display: inline-flex; align-items: center; gap: .45rem; min-height: 38px; padding: 0 .85rem; border: 1px solid ${TINTA}; border-radius: 3px; font-size: .8rem; font-weight: 700; font-variant-numeric: tabular-nums; }
.cc-boton-linea:hover { background: ${TINTA}; color: #fff; }

.cc-franja { background: ${GRIS}; border-bottom: 1px solid ${LINEA}; font-size: .75rem; font-variant-numeric: tabular-nums; }
.cc-franja-fila { display: flex; align-items: center; justify-content: space-between; gap: .75rem; height: 32px; white-space: nowrap; }
.cc-franja p { font-weight: 600; }
.cc-indicadores { display: flex; gap: .9rem; }
@media (min-width: 768px) { .cc-indicadores { gap: 1.6rem; } }
.cc-indicadores li { display: inline-flex; align-items: center; gap: .25rem; color: ${SUAVE}; }
.cc-indicadores b { color: ${TINTA}; font-weight: 700; }

.cc-nav { background: ${TINTA}; color: #fff; }
.cc-nav-fila { display: flex; align-items: stretch; height: 48px; padding-inline: .25rem; }
@media (min-width: 768px) { .cc-nav-fila { padding-inline: 1.25rem; } }
.cc-nav-marca { display: grid; place-items: center; width: 0; overflow: hidden; opacity: 0; visibility: hidden; transition: width .22s ease, opacity .22s ease, visibility .22s; font-family: ${SERIF}; font-weight: 700; font-size: 1.15rem; text-decoration: none; }
.cc-nav-marca span { border-bottom: 3px solid ${ROJO}; line-height: 1.1; }
.cc-nav[data-fija="true"] .cc-nav-marca { width: 2.75rem; opacity: 1; visibility: visible; }
.cc-nav-lista { position: relative; display: flex; flex: 1; min-width: 0; overflow-x: auto; scrollbar-width: none; }
.cc-nav-lista::-webkit-scrollbar { display: none; }
@media (max-width: 559.98px) { .cc-nav-lista { mask-image: linear-gradient(90deg, #000 88%, transparent); padding-right: 1.5rem; } }
.cc-nav-lista a { display: flex; align-items: center; height: 100%; padding: 0 .75rem; font-size: .85rem; font-weight: 600; color: #D4D4D8; text-decoration: none; white-space: nowrap; border-bottom: 3px solid transparent; border-top: 3px solid transparent; }
.cc-nav-lista a:hover { color: #fff; }
.cc-nav-lista a[aria-current] { color: #fff; border-bottom-color: ${ROJO}; }
.cc-nav-lista a:focus-visible { outline-offset: -4px; }
.cc-nav-buscar { display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; gap: .45rem; min-width: 46px; padding: 0 .65rem; font-size: .85rem; font-weight: 600; border-left: 1px solid #27272A; }
.cc-nav-buscar:hover { background: #18181B; }

/* ---------- textos comunes ---------- */
.cc-antetitulo { font-size: .76rem; font-weight: 700; color: ${ROJO}; line-height: 1.4; }
.cc-antetitulo span { color: ${SUAVE}; font-weight: 500; }
.cc-titular a { text-decoration: none; }
.cc-titular a::after { content: ""; position: absolute; inset: 0; }
.cc-titular a:hover { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
.cc-bajada { color: ${SUAVE}; }
.cc-meta { display: flex; flex-wrap: wrap; align-items: center; column-gap: .55rem; font-size: .76rem; color: ${SUAVE}; font-variant-numeric: tabular-nums; }
.cc-meta > span + span::before, .cc-meta > time + span::before { content: "·"; margin-right: .55rem; }
.cc-meta-autor { color: ${TINTA}; font-weight: 700; }
.cc-meta-lectura svg { display: inline; vertical-align: -2px; margin-right: .15rem; }
.cc-foto { display: block; width: 100%; overflow: hidden; background: ${LINEA}; }
.cc-foto img { display: block; width: 100%; height: 100%; object-fit: cover; }

.cc-rotulo { display: flex; align-items: center; justify-content: space-between; gap: .75rem; border-top: 3px solid ${TINTA}; padding-block: .55rem .35rem; }
.cc-rotulo h2 { font-size: 1.3rem; }
.cc-envivo { background: ${ROJO}; color: #fff; font-size: .68rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; padding: .1rem .45rem; border-radius: 2px; }
.cc-ver { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: .3rem; min-height: 36px; font-size: .8rem; font-weight: 700; }
.cc-ver:hover { color: ${ROJO}; }
.cc-iniciales { display: grid; flex-shrink: 0; place-items: center; width: 2.6rem; height: 2.6rem; border-radius: 999px; background: ${TINTA}; color: #fff; font-family: ${SERIF}; font-weight: 700; font-size: .95rem; }

/* ---------- portada ---------- */
.cc-contenido { min-height: 75vh; padding-bottom: 2.5rem; }
.cc-grilla { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2rem; padding-top: 1.25rem; }
@media (min-width: 1024px) {
  .cc-grilla { grid-template-columns: minmax(0, 2.05fr) minmax(0, 1fr); gap: 0; padding-top: 1.75rem; }
  .cc-grilla > :first-child { padding-right: 2rem; }
  .cc-grilla > :last-child { padding-left: 2rem; border-left: 1px solid ${LINEA}; }
}
.cc-principal { position: relative; align-self: start; }
.cc-principal .cc-foto { margin-bottom: 1rem; }
@media (max-width: 767.98px) {
  .cc-principal .cc-foto { width: auto; margin-inline: -1rem; aspect-ratio: 16 / 10 !important; }
}
.cc-principal .cc-titular { font-size: clamp(1.85rem, 4.4vw, 2.85rem); line-height: 1.08; margin-top: .35rem; text-wrap: pretty; }
.cc-principal .cc-bajada { margin-top: .75rem; margin-bottom: .75rem; font-size: 1.02rem; max-width: 46rem; }

.cc-ultima { align-self: start; }
.cc-ultima li { position: relative; padding-block: .8rem; border-bottom: 1px solid ${LINEA}; }
.cc-ultima li:last-child { border-bottom: 0; }
.cc-marca { display: flex; align-items: baseline; gap: .55rem; font-size: .75rem; font-variant-numeric: tabular-nums; color: ${SUAVE}; }
.cc-marca time { font-weight: 700; color: ${ROJO}; font-size: .82rem; }
.cc-ultima .cc-titular { font-size: 1.08rem; font-weight: 600; line-height: 1.25; margin-top: .15rem; }

.cc-grilla-baja { margin-top: .5rem; }
@media (min-width: 1024px) { .cc-grilla-baja { margin-top: 0; } }
.cc-secundarias { display: grid; grid-template-columns: minmax(0, 1fr); align-content: start; border-top: 1px solid ${TINTA}; }
@media (min-width: 640px) { .cc-secundarias { grid-template-columns: repeat(3, minmax(0, 1fr)); column-gap: 1.25rem; padding-top: 1.25rem; } }

.cc-tarjeta { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 6.5rem; gap: .9rem; align-content: start; padding-block: 1rem; border-bottom: 1px solid ${LINEA}; }
.cc-tarjeta > .cc-foto { order: 2; align-self: start; aspect-ratio: 1 !important; }
.cc-tarjeta .cc-titular { font-size: 1.15rem; line-height: 1.22; margin-top: .2rem; margin-bottom: .45rem; }
.cc-tarjeta .cc-bajada { display: none; font-size: .88rem; line-height: 1.55; margin-bottom: .55rem; }
@media (min-width: 640px) {
  .cc-tarjeta { grid-template-columns: minmax(0, 1fr); gap: .75rem; padding-block: 0 1.25rem; border-bottom: 0; }
  .cc-tarjeta > .cc-foto { order: 0; aspect-ratio: 3 / 2 !important; }
  .cc-tarjeta .cc-bajada { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
}

.cc-opinion { align-self: start; background: ${GRIS}; padding: 0 1rem .5rem; }
@media (min-width: 1024px) { .cc-grilla > .cc-opinion:last-child { margin-left: 2rem; padding: 0 1.25rem .5rem; border-left: 0; } }
.cc-opinion li { position: relative; display: flex; gap: .85rem; padding-block: .95rem; border-bottom: 1px solid ${LINEA}; }
.cc-opinion li:last-child { border-bottom: 0; }
.cc-firma { font-size: .78rem; font-weight: 700; }
.cc-firma span { font-weight: 500; color: ${SUAVE}; }
.cc-opinion .cc-titular { font-size: 1.12rem; font-weight: 600; line-height: 1.22; margin-block: .15rem .25rem; }
.cc-cargo { font-size: .74rem; color: ${SUAVE}; }

.cc-bloques { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2rem; padding-top: 2.5rem; }
@media (min-width: 768px) {
  .cc-bloques { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0; }
  .cc-bloques > section { padding-inline: 1.25rem; border-left: 1px solid ${LINEA}; }
  .cc-bloques > section:first-child { padding-left: 0; border-left: 0; }
  .cc-bloques > section:last-child { padding-right: 0; }
}
.cc-bloque-primera { position: relative; padding-block: .4rem 1rem; }
.cc-bloque-primera .cc-titular { font-size: 1.3rem; line-height: 1.2; margin-block: .75rem .4rem; }
.cc-bloques li { position: relative; padding-block: .85rem; border-top: 1px solid ${LINEA}; }
.cc-bloques li .cc-titular { font-size: 1.06rem; font-weight: 600; line-height: 1.25; margin-bottom: .3rem; }
.cc-mas { padding-block: 2.5rem 3rem; }
.cc-rejilla { display: grid; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 640px) { .cc-rejilla { grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 1.25rem; padding-top: .6rem; } }
@media (min-width: 1024px) { .cc-mas .cc-rejilla, .cc-esqueleto-rejilla { grid-template-columns: repeat(4, minmax(0, 1fr)); } }

/* ---------- página de sección ---------- */
.cc-seccion-titulo { padding-block: 1.5rem .9rem; border-bottom: 1px solid ${TINTA}; }
.cc-seccion-titulo h1 { font-size: clamp(2.2rem, 7vw, 3.2rem); }
.cc-seccion-titulo p { color: ${SUAVE}; font-size: .95rem; margin-top: .2rem; }
.cc-rejilla-seccion { margin-top: 1.5rem; border-top: 1px solid ${LINEA}; }
@media (min-width: 640px) {
  .cc-rejilla-seccion { padding-top: 1.5rem; }
  .cc-rejilla-seccion > .cc-tarjeta:last-child:nth-child(odd) { grid-column: 1 / -1; grid-template-columns: minmax(0, 1fr) 15rem; align-items: start; gap: 1.25rem; }
  .cc-rejilla-seccion > .cc-tarjeta:last-child:nth-child(odd) > .cc-foto { order: 2; }
}

/* ---------- esqueleto ---------- */
.cc-hueso { display: block; width: 100%; background: ${LINEA}; border-radius: 2px; animation: cc-late .8s ease-in-out infinite alternate; }
@keyframes cc-late { to { opacity: .5; } }
.cc-esqueleto-lista > div { padding-block: 1.1rem; border-bottom: 1px solid ${LINEA}; }
.cc-esqueleto-rejilla { column-gap: 1.25rem; row-gap: 1.5rem; padding-top: 2rem; }

/* ---------- boletín ---------- */
.cc-boletin { background: ${GRIS}; border-block: 1px solid ${LINEA}; scroll-margin-top: 80px; }
.cc-boletin-fila { display: grid; gap: 1.5rem; padding-block: 2.25rem; }
@media (min-width: 900px) { .cc-boletin-fila { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 3rem; align-items: center; padding-block: 3rem; } }
.cc-boletin h2 { font-size: clamp(1.7rem, 4.5vw, 2.3rem); margin-top: .25rem; font-variant-numeric: lining-nums tabular-nums; }
.cc-boletin-texto { color: ${SUAVE}; margin-top: .6rem; font-size: .95rem; max-width: 32rem; }
.cc-boletin-caja { min-height: 8.5rem; display: grid; align-content: center; }
.cc-boletin label { display: block; font-size: .82rem; font-weight: 700; margin-bottom: .4rem; }
.cc-campo-fila { display: grid; gap: .6rem; }
@media (min-width: 520px) { .cc-campo-fila { grid-template-columns: minmax(0, 1fr) auto; } }
.cc-campo { position: relative; display: block; }
.cc-campo input { width: 100%; height: 50px; padding: 0 2.6rem 0 .85rem; background: ${PAPEL}; border: 1px solid #A1A1AA; border-radius: 3px; font-size: 16px; }
.cc-campo input:focus { border-color: ${TINTA}; outline: 2px solid ${TINTA}; outline-offset: 0; }
.cc-campo[data-estado="mal"] input { border-color: ${ROJO}; outline-color: ${ROJO}; }
.cc-campo svg { position: absolute; right: .8rem; top: 16px; pointer-events: none; }
.cc-campo-bien { color: #15803D; }
.cc-campo-mal { color: ${ROJO}; }
.cc-boton { display: inline-flex; align-items: center; justify-content: center; gap: .45rem; min-height: 50px; padding: 0 1.3rem; background: ${TINTA}; color: #fff; border-radius: 3px; font-weight: 700; font-size: .92rem; transition: background .15s; }
.cc-boton:hover { background: #27272A; }
.cc-gira { animation: cc-gira .8s linear infinite; }
@keyframes cc-gira { to { transform: rotate(360deg); } }
.cc-ayuda { min-height: 1.4rem; margin-top: .5rem; font-size: .82rem; color: ${SUAVE}; }
.cc-ayuda[data-mal="true"] { color: #B91C1C; font-weight: 600; }
.cc-ayuda button { font-weight: 700; color: ${TINTA}; text-decoration: underline; text-underline-offset: 3px; }
.cc-confirmado { display: flex; align-items: flex-start; gap: 1rem; background: ${PAPEL}; border: 1px solid ${LINEA}; border-top: 3px solid ${TINTA}; padding: 1.25rem; overflow-wrap: anywhere; }
.cc-confirmado:focus { outline: none; }
.cc-sello { display: grid; flex-shrink: 0; place-items: center; width: 3rem; height: 3rem; border-radius: 999px; background: ${ROJO}; color: #fff; }
.cc-confirmado-titulo { font-family: ${SERIF}; font-size: 1.35rem; font-weight: 700; line-height: 1.2; margin-bottom: .25rem; }
.cc-confirmado p { font-size: .92rem; }

/* ---------- ventanas ---------- */
.cc-dialogo { padding: 0; border: 0; background: ${PAPEL}; color: ${TINTA}; }
.cc-dialogo::backdrop { background: rgba(9, 9, 11, .6); }
.cc-dialogo { overflow: hidden; }
.cc-dialogo-caja { overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; }
.cc-lector { position: fixed; inset: 0; width: 100%; max-width: 100%; height: 100%; height: 100dvh; max-height: 100dvh; margin: 0; }
.cc-lector[open] { animation: cc-sube .28s cubic-bezier(.2,.8,.2,1); }
@keyframes cc-sube { from { opacity: 0; transform: translateY(18px); } }
.cc-lector .cc-dialogo-caja { height: 100%; }
.cc-lector-barra { position: sticky; top: 0; z-index: 3; background: ${PAPEL}; border-bottom: 1px solid ${LINEA}; }
.cc-lector-herramientas { display: flex; align-items: center; justify-content: space-between; gap: .5rem; max-width: 76rem; margin-inline: auto; padding: .45rem .6rem; }
@media (min-width: 768px) { .cc-lector-herramientas { padding-inline: 2rem; } }
.cc-lector-logo { display: none !important; font-size: 1.15rem; }
@media (min-width: 900px) { .cc-lector-logo { display: inline-flex !important; } .cc-lector-herramientas { display: grid; grid-template-columns: 1fr auto 1fr; } .cc-volver { justify-self: start; } .cc-lector-acciones { justify-self: end; } }
.cc-lector-acciones { display: flex; align-items: center; gap: .35rem; }
.cc-herramienta { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; min-width: 42px; min-height: 42px; padding: 0 .6rem; border: 1px solid ${LINEA}; border-radius: 3px; font-size: .8rem; font-weight: 700; text-decoration: none; background: ${PAPEL}; }
.cc-herramienta:hover { border-color: ${TINTA}; }
.cc-volver { border-color: transparent; }
@media (max-width: 639.98px) { .cc-lector-acciones .cc-herramienta:not(.cc-whatsapp) span { display: none; } }
@media (max-width: 359.98px) { .cc-volver span, .cc-lector-acciones .cc-whatsapp span { display: none; } }
.cc-letra { display: inline-flex; border: 1px solid ${LINEA}; border-radius: 3px; margin-right: .25rem; }
.cc-letra button { min-width: 42px; min-height: 40px; font-weight: 700; font-size: .92rem; }
.cc-letra button + button { border-left: 1px solid ${LINEA}; font-size: 1.05rem; }
.cc-letra button:hover:not(:disabled) { background: ${GRIS}; }
.cc-letra button:disabled { color: #A1A1AA; }
.cc-avance { position: absolute; left: 0; right: 0; bottom: -1px; height: 3px; background: ${ROJO}; transform: scaleX(0); transform-origin: left; }

.cc-nota { max-width: 46rem; margin-inline: auto; padding: 1.5rem 1.15rem 2.5rem; }
@media (min-width: 768px) { .cc-nota { padding-top: 2.75rem; } }
.cc-nota h1 { font-size: clamp(1.9rem, 5.6vw, 3rem); line-height: 1.1; margin-top: .45rem; text-wrap: pretty; }
.cc-nota-bajada { font-size: 1.12rem; color: ${SUAVE}; margin-top: .9rem; line-height: 1.55; }
.cc-nota-firma { display: flex; align-items: center; gap: .8rem; margin-top: 1.25rem; padding-block: .9rem; border-block: 1px solid ${LINEA}; }
@media (max-width: 639.98px) {
  .cc-nota-firma .cc-meta { flex-direction: column; align-items: flex-start; }
  .cc-nota-firma .cc-meta > time + span::before { content: none; }
}
.cc-nota figure { margin: 1.25rem -1.15rem 0; }
@media (min-width: 640px) { .cc-nota figure { margin-inline: 0; } }
@media (min-width: 960px) { .cc-nota figure { margin-inline: -3.5rem; } }
.cc-nota figcaption { font-size: .78rem; color: ${SUAVE}; padding: .5rem 1.15rem 0; }
@media (min-width: 640px) { .cc-nota figcaption { padding-inline: 0; } }
.cc-nota figcaption span { color: #71717A; }
.cc-cuerpo { margin-top: 1.5rem; line-height: 1.75; color: #18181B; }
.cc-cuerpo p + p { margin-top: 1.1em; }
.cc-nota-compartir { margin-top: 2.25rem; padding-top: 1rem; border-top: 3px solid ${TINTA}; }
.cc-nota-compartir > p:first-child { font-weight: 700; font-size: .9rem; margin-bottom: .6rem; }
.cc-nota-compartir > div { display: flex; flex-wrap: wrap; gap: .5rem; }
.cc-aviso { font-size: .8rem; color: #15803D; font-weight: 600; min-height: 1.3rem; margin-top: .4rem; }
.cc-enlace-manual { display: block; font-size: .82rem; color: ${SUAVE}; }
.cc-enlace-manual input { width: 100%; margin-top: .35rem; height: 44px; padding: 0 .7rem; border: 1px solid #A1A1AA; border-radius: 3px; color: ${TINTA}; font-size: 16px; }
.cc-relacionadas { background: ${GRIS}; border-top: 1px solid ${LINEA}; }
.cc-relacionadas > div { max-width: 56rem; margin-inline: auto; padding: 2rem 1.15rem 3rem; }
.cc-relacionadas ul { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0 1.25rem; }
.cc-relacionadas li { position: relative; display: grid; grid-template-columns: 6.5rem minmax(0, 1fr); gap: .9rem; align-items: start; padding-block: .85rem; border-bottom: 1px solid ${LINEA}; }
.cc-relacionadas .cc-titular { font-size: 1.1rem; line-height: 1.22; margin-top: .15rem; }
@media (min-width: 700px) {
  .cc-relacionadas ul { grid-template-columns: repeat(3, minmax(0, 1fr)); padding-top: .6rem; }
  .cc-relacionadas li { grid-template-columns: minmax(0, 1fr); border-bottom: 0; align-content: start; gap: .65rem; }
}

.cc-buscador { width: min(44rem, 100%); max-width: 100%; max-height: 88vh; max-height: 88dvh; margin: 0 auto auto; border-bottom: 3px solid ${ROJO}; }
.cc-buscador[open] { display: flex; flex-direction: column; animation: cc-baja .24s cubic-bezier(.2,.8,.2,1); }
@keyframes cc-baja { from { opacity: 0; transform: translateY(-14px); } }
.cc-buscador .cc-dialogo-caja { padding-bottom: .75rem; }
.cc-buscador-arriba { position: sticky; top: 0; z-index: 2; background: ${PAPEL}; padding: .85rem 1rem .7rem; border-bottom: 1px solid ${LINEA}; }
.cc-buscador form { display: flex; align-items: center; gap: .6rem; border-bottom: 2px solid ${TINTA}; }
.cc-buscador input { flex: 1; min-width: 0; height: 48px; font-family: ${SERIF}; font-size: 1.35rem; font-weight: 600; background: transparent; border: 0; outline: 0; }
.cc-buscador input::-webkit-search-cancel-button { display: none; }
.cc-buscador input:focus-visible { outline: 0; }
.cc-buscador form:focus-within { border-bottom-color: ${ROJO}; }
.cc-buscador form button { display: grid; place-items: center; width: 44px; height: 44px; }
.cc-sugerencias { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: .7rem; }
.cc-sugerencias button { min-height: 34px; padding: 0 .75rem; background: ${GRIS}; border: 1px solid ${LINEA}; border-radius: 3px; font-size: .78rem; font-weight: 600; }
.cc-sugerencias button[aria-pressed="true"] { background: ${TINTA}; border-color: ${TINTA}; color: #fff; }
.cc-resultado-cuenta { padding: .85rem 1rem .2rem; font-size: .8rem; font-weight: 700; color: ${SUAVE}; }
.cc-resultados { padding-inline: 1rem; }
.cc-resultados li { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 5.5rem; gap: .9rem; align-items: start; padding-block: .85rem; border-bottom: 1px solid ${LINEA}; }
.cc-resultados li:last-child { border-bottom: 0; }
.cc-resultados .cc-titular { font-size: 1.1rem; line-height: 1.22; margin-top: .15rem; }

.cc-hoja { width: min(36rem, 94vw); max-width: 94vw; max-height: 86vh; max-height: 86dvh; margin: auto; border-top: 3px solid ${ROJO}; }
.cc-hoja .cc-dialogo-caja { max-height: 85vh; max-height: 85dvh; }
.cc-hoja-texto { padding: 1.5rem 1.25rem 1.75rem; }
.cc-hoja-texto h2 { font-size: 1.75rem; padding-right: 2.75rem; }
.cc-hoja-texto section { margin-top: 1.1rem; padding-top: 1.1rem; border-top: 1px solid ${LINEA}; }
.cc-hoja-texto h3 { font-size: 1.15rem; }
.cc-hoja-texto p { font-size: .92rem; color: ${SUAVE}; margin-top: .3rem; }
.cc-hoja-cerrar { position: absolute; top: .75rem; right: .75rem; display: grid; place-items: center; width: 42px; height: 42px; background: ${PAPEL}; border-radius: 3px; }
.cc-hoja-cerrar:hover { background: ${GRIS}; }

/* ---------- pie ---------- */
.cc-pie { background: ${TINTA}; color: #fff; }
.cc-pie > .cc-ancho { padding-block: 2.75rem 1.75rem; }
.cc-pie-marca { padding-bottom: 1.5rem; border-bottom: 1px solid #27272A; }
.cc-pie-marca .cc-logo { font-size: clamp(1.6rem, 6vw, 2.2rem); }
.cc-pie-marca p { color: #A1A1AA; font-size: .9rem; margin-top: .5rem; }
.cc-pie-columnas { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2rem; padding-block: 1.75rem 2rem; }
@media (min-width: 640px) { .cc-pie-columnas { grid-template-columns: 1fr 1.4fr 1fr; } }
.cc-pie h2 { font-size: 1.1rem; margin-bottom: .5rem; }
.cc-pie-columnas button { min-height: 36px; color: #D4D4D8; font-size: .88rem; text-align: left; }
.cc-pie-columnas button:hover { color: #fff; text-decoration: underline; text-underline-offset: 4px; }
.cc-pie dl > div { display: flex; flex-wrap: wrap; justify-content: space-between; column-gap: 1rem; padding-block: .4rem; border-bottom: 1px solid #1F1F23; font-size: .85rem; max-width: 24rem; }
.cc-pie dt { color: #A1A1AA; }
.cc-pie dd { font-weight: 600; }
.cc-pie-final { display: flex; flex-direction: column; gap: .5rem; padding-top: 1.25rem; border-top: 1px solid #27272A; font-size: .8rem; color: #A1A1AA; font-variant-numeric: tabular-nums; }
@media (min-width: 768px) { .cc-pie-final { flex-direction: row; justify-content: space-between; } }
.cc-pie-final a { color: #fff; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  .cc-hueso, .cc-gira, .cc-lector[open], .cc-buscador[open] { animation: none; }
  .cc-nav-marca { transition: none; }
}
`;
