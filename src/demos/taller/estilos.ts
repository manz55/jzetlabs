/* Estilos de "Autotech": blanco, gris acero, azul pizarra, naranja técnico y rojo solo para auxilio. Todo va bajo .at. */
export const LETRAS = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";

const BLANCO = "#FFFFFF";
const ACERO = "#F8FAFC";
const BORDE = "#E2E8F0";
const PIZARRA = "#0F172A";
const NARANJA = "#EA580C";
const ROJO = "#DC2626";
/* tonos de la misma paleta */
const NARANJA_HONDO = "#C2410C";
const NARANJA_CLARO = "#FFF3EA";
const ROJO_HONDO = "#B91C1C";
const SUAVE = "#475569";
const BORDE_CAMPO = "#CBD5E1";
const VERDE = "#166534";
const VERDE_CLARO = "#E9F7EE";
const AMBAR = "#854D0E";
const AMBAR_CLARO = "#FEF6D8";

/* una sola familia: sus cifras tabulares no separan el guion de las placas */
const TITULO = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
const TEXTO = TITULO;

export const ESTILOS = `
.at { background: ${BLANCO}; color: ${PIZARRA}; font-family: ${TEXTO}; font-size: 16px; line-height: 1.55; font-variant-numeric: tabular-nums lining-nums; min-height: 100vh; }
.at h1, .at h2, .at h3 { color: inherit; font-family: ${TITULO}; font-weight: 700; letter-spacing: -.018em; line-height: 1.18; }
.at input, .at select, .at button { font-family: inherit; font-variant-numeric: tabular-nums lining-nums; }
.at b, .at strong { font-weight: 700; }
.at small { font-size: .8rem; line-height: 1.45; }
.at button:not(:disabled), .at select, .at summary { cursor: pointer; }
.at button:disabled { cursor: not-allowed; }
.at :focus-visible { outline: 3px solid ${NARANJA}; outline-offset: 2px; border-radius: 6px; }
.at .at-buscador :focus-visible, .at .at-pie :focus-visible, .at .at-ficha-alto :focus-visible { outline-color: #fff; }
.at-ancho { width: 100%; max-width: 76rem; margin-inline: auto; padding-inline: 1.1rem; }
@media (min-width: 720px) { .at-ancho { padding-inline: 1.75rem; } }
.at-oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

/* logo de letras con un acento geométrico */
.at-logo { position: relative; display: inline-flex; flex-direction: column; padding-left: 20px; line-height: 1; text-align: left; white-space: nowrap; }
.at-logo::before { content: ""; position: absolute; left: 0; top: 1px; bottom: 1px; width: 9px; background: ${NARANJA}; transform: skewX(-18deg); border-radius: 1px; }
.at-logo b { font-family: ${TITULO}; font-size: 1.18rem; letter-spacing: .07em; }
.at-logo small { margin-top: 4px; font-size: .56rem; font-weight: 600; letter-spacing: .15em; opacity: .72; }

/* botones */
.at-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 46px; padding: .6rem 1.1rem; border: 1px solid transparent; border-radius: 10px; font-size: .92rem; font-weight: 600; line-height: 1.25; text-align: center; transition: background-color .16s, border-color .16s, color .16s, transform .12s; }
.at-btn svg { flex: none; }
.at-btn:not(:disabled):active { transform: scale(.975); }
.at-btn:disabled { opacity: .5; }
.at-grande { min-height: 54px; padding-inline: 1.35rem; font-size: 1rem; }
.at-lleno { width: 100%; }
.at-naranja { background: ${NARANJA}; color: #fff; }
.at-naranja:not(:disabled):hover { background: ${NARANJA_HONDO}; }
.at-rojo { background: ${ROJO}; color: #fff; }
.at-rojo:not(:disabled):hover { background: ${ROJO_HONDO}; }
.at-pizarra { background: ${PIZARRA}; color: #fff; }
.at-pizarra:not(:disabled):hover { background: #24324F; }
.at-contorno { border-color: ${BORDE_CAMPO}; background: ${BLANCO}; color: ${PIZARRA}; }
.at-contorno:not(:disabled):hover { border-color: ${PIZARRA}; }
.at-enlace { display: inline-flex; align-items: center; gap: .35rem; min-height: 40px; font-size: .86rem; font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }
.at-botones { display: flex; flex-wrap: wrap; gap: .65rem; }
.at-nota { margin-top: .8rem; color: ${SUAVE}; font-size: .82rem; }

/* barra fija con las tres vistas: es "sticky", ocupa su lugar y no tapa nada */
.at-nav { position: sticky; top: 0; z-index: 30; background: ${BLANCO}; border-bottom: 1px solid ${BORDE}; }
.at-nav-fila { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "logo auxilio" "vistas vistas"; align-items: center; gap: .5rem .75rem; padding-block: .6rem; }
.at-nav-logo { grid-area: logo; justify-self: start; min-height: 42px; }
.at-nav-auxilio { grid-area: auxilio; min-height: 42px; padding: .4rem .8rem; font-size: .82rem; }
.at-nav-auxilio .at-largo { display: none; }
.at-vistas { grid-area: vistas; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3px; padding: 3px; background: ${ACERO}; border: 1px solid ${BORDE}; border-radius: 12px; }
.at-vistas button { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; min-width: 0; min-height: 40px; padding-inline: .3rem; border-radius: 9px; color: ${SUAVE}; font-size: .8rem; font-weight: 600; white-space: nowrap; transition: background-color .15s, color .15s; }
.at-vistas button:hover { color: ${PIZARRA}; }
.at-vistas button[aria-current="page"] { background: ${PIZARRA}; color: #fff; }
.at-vistas button i { display: grid; place-items: center; min-width: 19px; height: 19px; border-radius: 999px; background: ${NARANJA}; color: #fff; font-size: .68rem; font-style: normal; font-weight: 700; }
.at-vistas svg, .at-vistas .at-largo { display: none; }
@media (min-width: 560px) { .at-vistas svg { display: block; } .at-nav-auxilio .at-largo { display: inline; } }
@media (min-width: 700px) { .at-vistas .at-largo { display: inline; } .at-vistas .at-corto { display: none; } }
@media (min-width: 1080px) {
  .at-nav-fila { grid-template-columns: 1fr auto 1fr; grid-template-areas: "logo vistas auxilio"; min-height: 74px; }
  .at-vistas { display: flex; }
  .at-vistas button { padding-inline: 1rem; font-size: .85rem; }
  .at-nav-auxilio { justify-self: end; }
}
#at-triaje, #at-servicios, #at-equipo, #at-ubicacion { scroll-margin-top: 120px; }

/* portada */
.at-portada { border-bottom: 1px solid ${BORDE}; }
.at-portada-fila { display: grid; gap: 1.8rem; padding-block: 1.8rem 2.4rem; }
.at-sobre { color: ${NARANJA_HONDO}; font-size: .9rem; font-weight: 600; }
.at .at-portada h1 { margin-top: .7rem; font-size: clamp(2.05rem, 5.4vw, 3.5rem); line-height: 1.08; letter-spacing: -.03em; }
.at-bajada { max-width: 34rem; margin: 1rem 0 1.5rem; color: ${SUAVE}; font-size: 1.05rem; }
.at-portada-datos { display: flex; flex-wrap: wrap; gap: .5rem 1.5rem; margin-top: 1.6rem; padding-top: 1.1rem; border-top: 1px solid ${BORDE}; font-size: .88rem; font-weight: 600; }
.at-portada-datos li { display: flex; align-items: center; gap: .45rem; }
.at-portada-datos svg { color: ${NARANJA_HONDO}; }
.at-portada-foto { position: relative; align-self: stretch; }
.at-portada-foto img { width: 100%; height: 100%; max-height: 50svh; aspect-ratio: 5 / 4; object-fit: cover; border-radius: 16px; }
.at-portada-ficha { position: absolute; left: .8rem; bottom: .8rem; display: flex; align-items: center; gap: .75rem; max-width: calc(100% - 1.6rem); padding: .75rem 1rem; background: ${PIZARRA}; color: #fff; border-radius: 12px; }
.at-portada-ficha span { display: flex; flex-direction: column; font-size: .82rem; color: rgba(255,255,255,.8); line-height: 1.4; }
.at-portada-ficha b { color: #fff; font-size: .95rem; }
@media (max-width: 519px) { .at-portada .at-botones { display: grid; } }
@media (min-width: 920px) {
  .at-portada-fila { grid-template-columns: 1.05fr 1fr; gap: 3rem; align-items: center; padding-block: 3.5rem; }
  .at-portada-foto { height: 100%; min-height: 430px; }
  .at-portada-foto img { position: absolute; inset: 0; max-height: none; aspect-ratio: auto; }
}

/* secciones */
.at-seccion { padding-block: 3rem; }
@media (min-width: 900px) { .at-seccion { padding-block: 4.2rem; } }
.at-acero { background: ${ACERO}; border-bottom: 1px solid ${BORDE}; }
.at-titulo { max-width: 38rem; margin-bottom: 1.7rem; }
.at .at-titulo h2, .at .at-ubicacion h2 { font-size: clamp(1.55rem, 3.4vw, 2.15rem); }
.at-titulo p { margin-top: .5rem; color: ${SUAVE}; }

/* ¿puedo manejar así? */
.at-triaje { display: grid; gap: 1rem; }
.at-sintomas { display: grid; grid-template-columns: 1fr 1fr; gap: .55rem; }
.at-sintomas button { display: flex; align-items: center; gap: .65rem; min-height: 58px; padding: .6rem .8rem; background: ${BLANCO}; border: 1px solid ${BORDE}; border-radius: 12px; font-size: .88rem; font-weight: 600; line-height: 1.3; text-align: left; transition: border-color .15s, background-color .15s, color .15s; }
.at-sintomas button:last-child:nth-child(odd) { grid-column: 1 / -1; }
.at-sintomas button svg { flex: none; color: ${NARANJA_HONDO}; }
.at-sintomas button:hover { border-color: ${PIZARRA}; }
.at-sintomas button[aria-pressed="true"] { background: ${PIZARRA}; border-color: ${PIZARRA}; color: #fff; }
.at-sintomas button[aria-pressed="true"] svg { color: #FDBA74; }
.at-dictamen { padding: 1.2rem; background: ${BLANCO}; border: 1px solid ${BORDE}; border-radius: 16px; }
.at-riesgo { display: inline-flex; align-items: center; gap: .45rem; padding: .4rem .75rem; border: 1px solid currentColor; border-radius: 8px; font-size: .84rem; font-weight: 700; line-height: 1.3; }
.at-riesgo svg { flex: none; }
.at-riesgo.at-seguro { background: ${VERDE_CLARO}; color: ${VERDE}; }
.at-riesgo.at-precaucion { background: ${AMBAR_CLARO}; color: ${AMBAR}; }
.at-riesgo.at-detener { background: ${ROJO}; border-color: ${ROJO}; color: #fff; }
.at .at-dictamen h3 { margin-top: .9rem; font-size: 1.35rem; }
.at-dictamen-alto p { color: ${SUAVE}; }
.at-dictamen dl { display: grid; margin-block: 1.1rem 1.2rem; }
.at-dictamen dl > div { display: grid; gap: .2rem; padding-block: .85rem; border-top: 1px solid ${BORDE}; }
.at-dictamen dt { font-size: .82rem; font-weight: 600; color: ${SUAVE}; }
.at-dictamen dd ul { display: grid; gap: .25rem; padding-left: 1.1rem; list-style: disc; }
.at .at-dictamen .at-costo { grid-template-columns: 1fr auto; align-items: center; gap: 1rem; border-bottom: 1px solid ${BORDE}; }
.at-costo dd { display: flex; flex-direction: column; align-items: flex-end; }
.at-costo strong { font-family: ${TITULO}; font-size: 1.6rem; line-height: 1.2; }
.at-costo small { color: ${SUAVE}; text-align: right; }
@media (max-width: 519px) { .at-dictamen .at-botones { display: grid; } }
@media (min-width: 880px) {
  .at-triaje { grid-template-columns: 18rem minmax(0, 1fr); gap: 1.5rem; align-items: start; }
  .at-sintomas { grid-template-columns: 1fr; }
  .at-dictamen { padding: 1.8rem; }
}

/* catálogo */
.at-controles { display: grid; gap: .8rem; margin-bottom: 1.5rem; }
.at-segmentos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3px; padding: 3px; background: ${ACERO}; border: 1px solid ${BORDE}; border-radius: 12px; }
.at-segmentos button { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; min-height: 44px; padding: .3rem .4rem; border-radius: 9px; color: ${SUAVE}; font-size: .82rem; font-weight: 600; line-height: 1.25; }
.at-segmentos button svg { display: none; flex: none; }
.at-segmentos button[aria-pressed="true"] { background: ${PIZARRA}; color: #fff; }
.at-filtros { display: flex; gap: .45rem; overflow-x: auto; padding: 3px; margin-inline: -3px; scrollbar-width: none; }
.at-filtros button { flex: none; min-height: 40px; padding-inline: .95rem; border: 1px solid ${BORDE_CAMPO}; border-radius: 999px; background: ${BLANCO}; font-size: .84rem; font-weight: 600; }
.at-filtros button[aria-pressed="true"] { background: ${NARANJA_CLARO}; border-color: ${NARANJA}; color: #9A3412; }
@media (min-width: 640px) { .at-segmentos button svg { display: block; } }
@media (min-width: 1060px) {
  .at-controles { grid-template-columns: auto 1fr; align-items: center; justify-content: space-between; gap: 1.5rem; }
  .at-controles .at-segmentos { order: 2; justify-self: end; width: 25.5rem; }
  .at-filtros { flex-wrap: wrap; }
  .at-filtros button { padding-inline: .8rem; }
}
.at-rejilla { display: grid; gap: 1rem; align-content: start; }
@media (min-width: 620px) { .at-rejilla { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 980px) { .at-rejilla { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; } }
.at-servicio { display: flex; flex-direction: column; overflow: hidden; background: ${BLANCO}; border: 1px solid ${BORDE}; border-radius: 16px; }
.at-servicio > img { width: 100%; aspect-ratio: 32 / 21; object-fit: cover; background: ${BORDE}; }
.at-servicio > div { display: flex; flex-direction: column; flex: 1; gap: .45rem; padding: 1rem 1.05rem 1.1rem; }
.at .at-servicio h3 { font-size: 1.08rem; }
.at-servicio p { color: ${SUAVE}; font-size: .9rem; }
.at-servicio-pie { display: flex; align-items: flex-end; justify-content: space-between; gap: .75rem; margin-top: auto; padding-top: .8rem; border-top: 1px solid ${BORDE}; }
.at-servicio-pie > span { display: flex; flex-direction: column; }
.at-servicio-pie strong { font-family: ${TITULO}; font-size: 1.45rem; line-height: 1.2; }
.at-servicio-pie small { display: flex; align-items: center; gap: .3rem; color: ${SUAVE}; }
.at-hueso { display: block; height: 13px; border-radius: 6px; background: linear-gradient(90deg, #EDF1F6 25%, #F8FAFC 45%, #EDF1F6 65%) 0 0 / 220% 100%; animation: at-brillo 1.1s linear infinite; }
.at-hueso-foto { height: auto; aspect-ratio: 32 / 21; border-radius: 0; }
@keyframes at-brillo { to { background-position: -220% 0; } }
.at-esqueleto > div { gap: .7rem; }

/* equipamiento */
.at-equipo { border-top: 1px solid ${BORDE}; border-bottom: 1px solid ${BORDE}; }
.at-equipos { display: grid; gap: .8rem; }
@media (min-width: 860px) { .at-equipos { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; } }
.at-equipos > li { display: flex; flex-direction: column; align-items: flex-start; gap: .9rem; padding: 1.2rem; background: ${ACERO}; border: 1px solid ${BORDE}; border-radius: 14px; }
@media (min-width: 520px) { .at-equipos > li { flex-direction: row; gap: 1.1rem; padding: 1.35rem; } }
.at-equipo-icono { display: grid; flex: none; place-items: center; width: 48px; height: 48px; background: ${PIZARRA}; color: #FB923C; border-radius: 12px; }
.at .at-equipos h3 { margin-bottom: .35rem; font-size: 1.05rem; }
.at-equipos p { color: ${SUAVE}; font-size: .9rem; }
.at-equipos ul { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: .75rem; }
.at-equipos ul li { padding: .25rem .6rem; background: ${BLANCO}; border: 1px solid ${BORDE_CAMPO}; border-radius: 6px; font-size: .78rem; font-weight: 600; }

/* respaldo, reseñas y ubicación */
.at-garantias { display: grid; gap: .8rem; }
@media (min-width: 620px) { .at-garantias { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1000px) { .at-garantias { grid-template-columns: repeat(4, 1fr); gap: 1rem; } }
.at-garantias li { padding: 1.2rem; background: ${PIZARRA}; color: #fff; border-radius: 14px; }
.at-garantias svg { color: #FB923C; }
.at .at-garantias h3 { margin-block: .7rem .35rem; font-size: 1.02rem; }
.at-garantias p { color: rgba(255,255,255,.76); font-size: .88rem; }
.at .at-subtitulo { margin-block: 2.6rem 1rem; font-size: 1.3rem; }
.at-resenas { display: grid; gap: .8rem; }
@media (min-width: 880px) { .at-resenas { grid-template-columns: repeat(3, 1fr); gap: 1rem; } }
.at-resenas li { display: flex; flex-direction: column; gap: .75rem; padding: 1.2rem; background: ${BLANCO}; border: 1px solid ${BORDE}; border-radius: 14px; }
.at-estrellas { display: flex; gap: 2px; color: #F59E0B; }
.at-resenas blockquote { flex: 1; font-size: .95rem; }
.at-resenas p { color: ${SUAVE}; font-size: .86rem; }
.at-resenas p b { color: ${PIZARRA}; }
.at-ubicacion { display: grid; gap: 1.8rem; }
.at-ubicacion > img { width: 100%; height: 100%; max-height: 520px; aspect-ratio: 9 / 7; object-fit: cover; border-radius: 16px; }
.at-sedes { display: grid; gap: 1rem; margin-top: 1.2rem; }
.at-sedes li { display: flex; gap: .75rem; }
.at-sedes li > svg { flex: none; margin-top: .15rem; color: ${NARANJA_HONDO}; }
.at-sedes p { color: ${SUAVE}; font-size: .92rem; }
.at-sedes a { display: inline-block; padding-block: .25rem; font-size: .86rem; font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }
.at-horarios { margin-block: 1.4rem; border-top: 1px solid ${BORDE}; }
.at-horarios div { display: flex; justify-content: space-between; gap: 1rem; padding-block: .65rem; border-bottom: 1px solid ${BORDE}; font-size: .92rem; }
.at-horarios dd { font-weight: 700; white-space: nowrap; }
@media (min-width: 880px) { .at-ubicacion { grid-template-columns: 1.1fr 1fr; gap: 3rem; align-items: center; } }

/* placa (hecha solo con CSS) */
.at-placa { display: inline-flex; flex: none; flex-direction: column; align-items: center; min-width: 6.6rem; padding: .2rem .6rem .3rem; background: #fff; color: ${PIZARRA}; border: 2px solid ${PIZARRA}; border-radius: 8px; line-height: 1.15; }
.at-placa small { font-size: .5rem; font-weight: 700; letter-spacing: .2em; color: #1D4ED8; }
.at-placa b { font-size: 1.02rem; letter-spacing: .04em; white-space: nowrap; }
.at-placa-grande { min-width: 9.4rem; padding: .35rem .8rem .5rem; }
.at-placa-grande small { font-size: .62rem; }
.at-placa-grande b { font-size: 1.5rem; }

/* seguimiento */
.at-buscador { background: ${PIZARRA}; color: #fff; padding-block: 2.2rem 2rem; }
.at .at-buscador h1 { font-size: clamp(1.65rem, 4.4vw, 2.5rem); }
.at-buscador > div > p { margin-top: .45rem; color: rgba(255,255,255,.76); }
.at-buscador form { display: flex; gap: .55rem; max-width: 32rem; margin-top: 1.3rem; }
.at-buscador input { flex: 1; min-width: 0; min-height: 50px; padding-inline: .9rem; background: #fff; color: ${PIZARRA}; border: 0; border-radius: 10px; font-size: 1.15rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.at-buscador input::placeholder { color: #94A3B8; font-weight: 500; }
.at .at-buscar-aviso { margin-top: .6rem; color: #FDBA74; font-size: .88rem; font-weight: 600; }
.at-accesos { display: flex; flex-wrap: wrap; gap: .55rem; margin-top: 1.1rem; }
.at-accesos button { display: flex; flex-direction: column; align-items: flex-start; min-height: 54px; padding: .45rem .9rem; border: 1px solid rgba(255,255,255,.28); border-radius: 10px; text-align: left; line-height: 1.35; }
.at-accesos button span { font-size: .78rem; color: rgba(255,255,255,.72); }
.at-accesos button:hover { border-color: #fff; }
.at-accesos button[aria-pressed="true"] { background: #fff; border-color: #fff; color: ${PIZARRA}; }
.at-accesos button[aria-pressed="true"] span { color: ${SUAVE}; }
.at-ficha { overflow: hidden; background: ${BLANCO}; border: 1px solid ${BORDE}; border-radius: 18px; }
.at-ficha-alto { display: flex; flex-wrap: wrap; align-items: center; gap: .8rem 1.1rem; padding: 1.2rem; border-bottom: 1px solid ${BORDE}; }
.at-ficha-alto > div { flex: 1; min-width: 11rem; }
.at .at-ficha-alto h2 { font-size: 1.3rem; }
.at-ficha-alto p { color: ${SUAVE}; font-size: .9rem; }
.at-estado { padding: .4rem .8rem; background: ${PIZARRA}; color: #fff; border-radius: 8px; font-size: .84rem; font-weight: 600; }
.at-estado-espera { background: ${NARANJA_CLARO}; color: #9A3412; }
.at-franja { display: flex; align-items: center; gap: .6rem; margin: 1.1rem 1.2rem 0; padding: .75rem .9rem; background: ${ACERO}; border: 1px solid ${BORDE}; border-radius: 10px; font-size: .9rem; font-weight: 500; }
.at-franja svg { flex: none; }
.at-franja-ok { background: ${VERDE_CLARO}; border-color: #BBE5CA; color: ${VERDE}; }

/* línea de tiempo: --av va de 0 a 4 y cada tramo se llena con su parte */
.at-linea { --av: 0; display: grid; padding: 1.4rem 1.2rem .4rem; }
.at-linea li { position: relative; display: flex; gap: .9rem; min-width: 0; padding-bottom: 1.2rem; }
.at-linea li > span { position: relative; z-index: 1; display: grid; flex: none; place-items: center; width: 34px; height: 34px; background: #fff; border: 2px solid ${BORDE_CAMPO}; border-radius: 999px; color: ${SUAVE}; font-size: .84rem; font-weight: 700; }
.at-linea .at-hecho > span { background: ${PIZARRA}; border-color: ${PIZARRA}; color: #fff; }
.at-linea .at-actual > span { background: ${NARANJA}; border-color: ${NARANJA}; color: #fff; box-shadow: 0 0 0 5px ${NARANJA_CLARO}; }
.at-linea li > div { display: flex; flex-direction: column; padding-top: .3rem; line-height: 1.35; }
.at-linea b { font-size: .9rem; font-weight: 600; }
.at-linea li:not(.at-hecho):not(.at-actual) b { color: ${SUAVE}; font-weight: 500; }
.at-linea small { margin-top: .15rem; color: ${SUAVE}; }
.at-tramo { position: absolute; left: 15.5px; top: 34px; bottom: 0; width: 3px; background: ${BORDE}; }
.at-tramo::after { content: ""; position: absolute; inset: 0; background: ${NARANJA}; transform-origin: top; transform: scaleY(clamp(0, calc(var(--av) - var(--i)), 1)); }
@media (min-width: 860px) {
  .at-linea { grid-template-columns: repeat(5, minmax(0, 1fr)); padding: 1.8rem 1.4rem .6rem; }
  .at-linea li { flex-direction: column; gap: .7rem; padding-right: .9rem; }
  .at-tramo { left: 34px; right: 0; top: 15.5px; bottom: auto; width: auto; height: 3px; }
  .at-tramo::after { transform-origin: left; transform: scaleX(clamp(0, calc(var(--av) - var(--i)), 1)); }
}

.at-aprobar { display: grid; gap: .9rem; margin: .6rem 1.2rem 0; padding: 1.1rem; background: ${NARANJA_CLARO}; border: 1px solid #FDC9A5; border-radius: 14px; }
.at-aprobar > svg { color: ${NARANJA_HONDO}; }
.at-aprobar-rotulo { color: #9A3412; font-size: .82rem; font-weight: 700; }
.at .at-aprobar h3 { margin-block: .15rem .25rem; font-size: 1.18rem; }
.at-aprobar div p:last-child { color: ${SUAVE}; font-size: .9rem; }
@media (min-width: 820px) { .at-aprobar { grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; margin-inline: 1.4rem; } }
.at-ficha-columnas { display: grid; border-top: 1px solid ${BORDE}; }
.at-ficha-columnas > section { padding: 1.2rem; border-bottom: 1px solid ${BORDE}; }
.at-ficha-columnas > section:last-child { border-bottom: 0; }
.at .at-ficha-columnas h3 { margin-bottom: .75rem; font-size: 1rem; }
@media (min-width: 820px) {
  .at-ficha-columnas { grid-template-columns: 1.4fr 1fr; }
  .at-ficha-columnas > section { padding: 1.4rem; border-bottom: 0; border-right: 1px solid ${BORDE}; }
  .at-ficha-columnas > section:last-child { border-right: 0; }
}

/* reporte de inspección multipunto */
.at-reporte { margin-top: 1.2rem; padding: 1.2rem; border-top: 1px solid ${BORDE}; }
@media (min-width: 820px) { .at-reporte { padding: 1.4rem; } }
.at-reporte-alto { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .6rem 1rem; }
.at .at-reporte h3 { font-size: 1.15rem; }
.at-resumen { display: flex; flex-wrap: wrap; gap: .35rem 1rem; font-size: .84rem; font-weight: 600; }
.at-resumen li { display: flex; align-items: center; gap: .4rem; }
.at-punto { display: inline-block; flex: none; width: 11px; height: 11px; border-radius: 999px; background: ${SUAVE}; }
.at-punto.at-optimo { background: #16A34A; }
.at-punto.at-precaucion { background: #EAB308; }
.at-punto.at-critico { background: ${ROJO}; }
.at-recibido { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: .9rem; }
.at-recibido li { display: flex; align-items: center; gap: .4rem; padding: .35rem .65rem; background: ${ACERO}; border: 1px solid ${BORDE}; border-radius: 8px; font-size: .8rem; font-weight: 500; }
.at-recibido li svg { flex: none; color: ${SUAVE}; }
.at-codigo { display: grid; gap: .8rem; margin-top: 1rem; padding: 1.1rem; background: ${PIZARRA}; color: #fff; border-radius: 12px; }
.at-codigo > div:first-child { display: flex; flex-direction: column; }
.at-codigo small { color: #FB923C; font-weight: 600; }
.at-codigo strong { font-family: ${TITULO}; font-size: 1.7rem; letter-spacing: .03em; line-height: 1.2; }
.at-codigo b { display: block; font-size: 1.02rem; }
.at-codigo p { margin-top: .3rem; color: rgba(255,255,255,.8); font-size: .9rem; }
@media (min-width: 720px) { .at-codigo-con { grid-template-columns: 9rem minmax(0, 1fr); align-items: start; gap: 1.2rem; } }
.at-mediciones { display: grid; gap: .55rem; margin-top: .8rem; }
@media (min-width: 640px) { .at-mediciones { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1060px) { .at-mediciones { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.at-medicion { display: flex; flex-direction: column; align-items: flex-start; gap: .3rem; min-width: 0; padding: .85rem .95rem; background: ${BLANCO}; border: 1px solid ${BORDE}; border-left: 5px solid #16A34A; border-radius: 10px; overflow-wrap: anywhere; }
.at-medicion.at-precaucion { border-left-color: #EAB308; }
.at-medicion.at-critico { border-left-color: ${ROJO}; }
.at-medicion > span:first-child { color: ${SUAVE}; font-size: .82rem; font-weight: 600; }
.at-medicion strong { font-size: 1.12rem; line-height: 1.3; }
.at-medicion em { margin-top: auto; padding: .15rem .55rem; border-radius: 6px; font-size: .76rem; font-style: normal; font-weight: 700; }
.at-medicion.at-optimo em { background: ${VERDE_CLARO}; color: ${VERDE}; }
.at-medicion.at-precaucion em { background: ${AMBAR_CLARO}; color: ${AMBAR}; }
.at-medicion.at-critico em { background: #FEF2F2; color: ${ROJO_HONDO}; }
.at-medicion small { color: ${SUAVE}; font-weight: 600; }
.at-repuestos { margin-top: 1rem; }
.at-repuestos h4 { margin-bottom: .4rem; font-size: .84rem; font-weight: 700; color: ${SUAVE}; }
.at-repuestos li { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .2rem 1rem; padding-block: .55rem; border-top: 1px solid ${BORDE}; font-size: .9rem; overflow-wrap: anywhere; }
.at-repuestos li b { letter-spacing: .02em; }
.at-reporte-vacio { margin-top: .8rem; padding: 1rem; border: 1px dashed ${BORDE_CAMPO}; border-radius: 10px; color: ${SUAVE}; font-size: .9rem; }
.at-cuentas > div { display: flex; justify-content: space-between; gap: 1rem; padding-block: .6rem; border-bottom: 1px solid ${BORDE}; font-size: .9rem; }
.at-cuentas dd { font-weight: 600; white-space: nowrap; }
.at-cuentas .at-tenue { color: ${SUAVE}; }
.at-cuentas .at-tenue dd { font-weight: 500; }
.at-cuentas .at-total { align-items: baseline; border-bottom: 0; font-weight: 700; }
.at-total strong { font-family: ${TITULO}; font-size: 1.55rem; }
.at-jefe { display: flex; align-items: center; gap: .7rem; margin-bottom: .9rem; }
.at-jefe > span:first-child { display: grid; flex: none; place-items: center; width: 44px; height: 44px; background: ${PIZARRA}; color: #fff; border-radius: 10px; }
.at-jefe-datos { display: flex; flex-direction: column; line-height: 1.4; }
.at-jefe-datos small { color: ${SUAVE}; }
.at-vacio { display: grid; justify-items: center; gap: .6rem; padding: 3rem 1.2rem; background: ${BLANCO}; border: 1px solid ${BORDE}; border-radius: 18px; text-align: center; }
.at-vacio p { color: ${SUAVE}; }
.at .at-vacio h2 { font-size: 1.3rem; }

/* panel del taller */
.at-panel { background: ${ACERO}; border-bottom: 1px solid ${BORDE}; padding-block: 1.6rem 3rem; }
.at-panel-alto { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .3rem 1rem; margin-bottom: 1.1rem; }
.at .at-panel-alto h1 { font-size: 1.7rem; }
.at-panel-alto p { color: ${SUAVE}; font-size: .9rem; }
.at-panel-alto p::first-letter { text-transform: uppercase; }
.at-kpis { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; }
@media (min-width: 900px) { .at-kpis { grid-template-columns: repeat(4, 1fr); gap: .9rem; } }
.at-kpis li { display: flex; flex-direction: column; align-items: flex-start; padding: .95rem 1rem; background: ${PIZARRA}; color: #fff; border-radius: 14px; }
.at-kpis svg { color: #FB923C; }
.at-kpis strong { margin-block: .45rem .1rem; font-family: ${TITULO}; font-size: clamp(1.6rem, 4.4vw, 2.1rem); line-height: 1.15; }
.at-kpis span { color: rgba(255,255,255,.76); font-size: .82rem; line-height: 1.35; }
.at-panel-cuerpo { display: grid; gap: 1.4rem; margin-top: 1.4rem; align-items: start; }
.at-panel-lado { display: grid; gap: 1rem; }
@media (min-width: 1000px) { .at-panel-cuerpo { grid-template-columns: 22rem minmax(0, 1fr); } }
.at-caja { padding: 1.1rem; background: ${BLANCO}; border: 1px solid ${BORDE}; border-radius: 14px; }
.at .at-caja h2 { display: flex; align-items: center; gap: .5rem; margin-bottom: .9rem; font-size: 1.05rem; }
.at-citas { display: grid; gap: .9rem; }
.at-citas li { display: grid; gap: .55rem; }
.at-citas li + li { padding-top: .9rem; border-top: 1px solid ${BORDE}; }
.at-citas li div { display: flex; flex-direction: column; font-size: .88rem; }
.at-citas li span { color: ${SUAVE}; }
.at-creada { margin-top: .9rem; padding: .75rem .9rem; background: ${VERDE_CLARO}; color: ${VERDE}; border-radius: 10px; }
.at-creada p { display: flex; align-items: center; gap: .5rem; font-weight: 600; font-size: .9rem; }
.at-panel-bahias { display: grid; gap: .9rem; min-width: 0; }
.at .at-panel-bahias > h2 { font-size: 1.2rem; }
.at-pestanas { display: flex; flex-wrap: wrap; gap: .5rem; }
.at-pestanas button { min-height: 44px; padding: .5rem 1.05rem; background: ${BLANCO}; border: 1.5px solid ${BORDE_CAMPO}; border-radius: 999px; font-size: .9rem; font-weight: 600; transition: background-color .15s, border-color .15s, color .15s; }
.at-pestanas button:hover { border-color: ${PIZARRA}; }
.at-pestanas button[aria-pressed="true"] { background: ${NARANJA}; border-color: ${NARANJA}; color: #fff; }
.at-tarjetas { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr)); gap: .9rem; align-items: start; }
.at-panel .at-ancho { max-width: 88rem; }
.at-tarjeta { display: flex; flex-direction: column; gap: .75rem; padding: 1rem; background: ${BLANCO}; border: 1px solid ${BORDE}; border-radius: 14px; }
.at-tarjeta-espera { border-color: ${NARANJA}; }
.at-tarjeta > header { display: flex; align-items: center; gap: .75rem; }
.at-tarjeta > header > div { min-width: 0; }
.at .at-tarjeta h3 { font-size: .98rem; }
.at-tarjeta > header p { color: ${SUAVE}; font-size: .8rem; }
.at-tarjeta-servicio { display: flex; justify-content: space-between; gap: .75rem; padding-top: .7rem; border-top: 1px solid ${BORDE}; font-size: .9rem; }
.at-tarjeta-servicio strong { white-space: nowrap; font-size: 1.05rem; }
.at-tarjeta-falla { display: flex; gap: .55rem; padding: .55rem .65rem; background: ${ACERO}; border: 1px solid ${BORDE}; border-radius: 8px; font-size: .82rem; line-height: 1.4; }
.at-tarjeta-falla svg { flex: none; margin-top: .05rem; color: ${NARANJA_HONDO}; }
.at-tarjeta-falla b { margin-right: .4rem; }
.at-anotar { padding: .75rem; background: ${ACERO}; border: 1px solid ${BORDE}; border-radius: 10px; }
.at-anotar form { display: grid; gap: .45rem; }
.at-anotar form > div { display: flex; gap: .45rem; }
.at-anotar form > div input { flex: 1; min-width: 0; min-height: 46px; padding: .5rem .7rem; background: ${BLANCO}; color: ${PIZARRA}; border: 1px solid ${BORDE_CAMPO}; border-radius: 10px; font-size: 1rem; }
.at-anotar-hecho { color: ${VERDE}; font-size: .8rem; font-weight: 600; }
.at-anotar-hecho:not(:empty) { margin-top: .4rem; }
.at-anotar summary { min-height: 34px; padding-top: .45rem; font-size: .82rem; font-weight: 600; }
.at-anotar li { display: flex; align-items: center; gap: .5rem; border-top: 1px solid ${BORDE}; font-size: .82rem; }
.at-anotar li span { flex: 1; min-width: 0; padding-block: .35rem; overflow-wrap: anywhere; }
.at-anotar li button { display: grid; flex: none; place-items: center; width: 36px; height: 36px; border-radius: 8px; color: ${SUAVE}; }
.at-anotar li button:hover { background: ${BLANCO}; color: ${PIZARRA}; }
.at-tarjeta-hallazgo { padding: .45rem .65rem; background: ${NARANJA_CLARO}; color: #9A3412; border-radius: 8px; font-size: .8rem; font-weight: 600; }
.at-tarjeta-hallazgo.at-ok { background: ${VERDE_CLARO}; color: ${VERDE}; }
.at-avance > div { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; }
.at-avance i { height: 7px; background: ${BORDE}; border-radius: 4px; transition: background-color .35s; }
.at-avance i.at-lleno-tramo { background: ${NARANJA}; }
.at-avance p { margin-top: .4rem; font-size: .82rem; color: ${SUAVE}; }
.at-avance b { color: ${PIZARRA}; }
.at-recepcion { border: 1px solid ${BORDE}; border-radius: 10px; }
.at-recepcion summary { min-height: 42px; padding: .6rem .75rem; font-size: .84rem; font-weight: 600; }
.at-recepcion > div { display: grid; grid-template-columns: 1fr 1fr; gap: .55rem; padding: .2rem .75rem .75rem; }
.at-casilla { display: flex; grid-column: 1 / -1; align-items: center; gap: .55rem; min-height: 32px; font-size: .86rem; }
.at-casilla input { width: 19px; height: 19px; accent-color: ${PIZARRA}; }
.at-tarjeta-pie { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0 .75rem; }
.at-vacio-corto { grid-column: 1 / -1; padding: 1.6rem; background: ${BLANCO}; border: 1px dashed ${BORDE_CAMPO}; border-radius: 14px; color: ${SUAVE}; text-align: center; }
.at-entregados li { display: grid; grid-template-columns: auto minmax(0, 1fr) auto auto; align-items: center; gap: .75rem; padding-block: .35rem; border-top: 1px solid ${BORDE}; font-size: .88rem; }
.at-entregados li span { color: ${SUAVE}; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }

/* formularios */
.at-formulario { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.at-campo-ancho { grid-column: 1 / -1; }
.at-campo { display: flex; flex-direction: column; gap: .3rem; min-width: 0; }
.at-campo > span { font-size: .8rem; font-weight: 600; color: ${SUAVE}; }
.at-campo input, .at-campo select { width: 100%; min-width: 0; min-height: 46px; padding: .5rem .7rem; background: ${BLANCO}; color: ${PIZARRA}; border: 1px solid ${BORDE_CAMPO}; border-radius: 10px; font-size: 1rem; font-weight: 400; }
.at-campo select:disabled { background: ${ACERO}; color: ${SUAVE}; }
.at-campo em { color: #9A3412; font-size: .78rem; font-style: normal; font-weight: 600; }

/* ventanas */
.at-ventana { width: 100%; max-width: 100%; max-height: 92dvh; margin: auto 0 0; padding: 0; background: transparent; border: 0; color: ${PIZARRA}; }
.at-ventana::backdrop { background: rgba(15,23,42,.62); }
.at-ventana-caja { display: flex; flex-direction: column; max-height: 92dvh; overflow: hidden; background: ${BLANCO}; border-radius: 18px 18px 0 0; }
.at-ventana[open] .at-ventana-caja { animation: at-sube .28s cubic-bezier(.2,.8,.2,1) both; }
@keyframes at-sube { from { transform: translateY(24px); opacity: 0; } }
.at-ventana-alto { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding: 1.1rem 1.2rem .9rem; background: ${PIZARRA}; color: #fff; }
.at-urgente .at-ventana-alto { background: ${ROJO}; }
.at .at-ventana-alto h2 { font-size: 1.25rem; }
.at-ventana-alto p { margin-top: .25rem; color: rgba(255,255,255,.86); font-size: .84rem; }
.at-cerrar { display: grid; flex: none; place-items: center; width: 40px; height: 40px; margin: -.35rem -.4rem 0 0; border-radius: 10px; }
.at-cerrar:hover { background: rgba(255,255,255,.16); }
.at .at-ventana-alto :focus-visible { outline-color: #fff; }
.at-ventana-cuerpo { display: grid; gap: 1rem; padding: 1.1rem 1.2rem 1.3rem; overflow-y: auto; }
.at-ventana-pie { padding: .8rem 1.2rem calc(.8rem + env(safe-area-inset-bottom)); border-top: 1px solid ${BORDE}; }
@media (min-width: 640px) { .at-ventana { width: min(34rem, 94vw); margin: auto; } .at-ventana-caja { border-radius: 18px; } }
.at-fallas { display: grid; grid-template-columns: 1fr 1fr; gap: .55rem; border: 0; }
.at-fallas legend { margin-bottom: .5rem; font-size: .8rem; font-weight: 600; color: ${SUAVE}; }
.at-fallas button { display: flex; flex-direction: column; align-items: flex-start; gap: .2rem; padding: .75rem; background: ${BLANCO}; border: 2px solid ${BORDE}; border-radius: 12px; text-align: left; }
.at-fallas button svg { color: ${ROJO}; }
.at-fallas button b { font-size: .9rem; }
.at-fallas button small { color: ${SUAVE}; }
.at-fallas button[aria-pressed="true"] { border-color: ${ROJO}; background: #FEF2F2; }
.at-burbuja { padding: .8rem; background: #ECE5DD; border-radius: 12px; }
.at-burbuja p { width: fit-content; max-width: 94%; margin-left: auto; padding: .65rem .8rem; background: #D9FDD3; color: #111B21; border-radius: 12px 12px 3px 12px; font-size: .86rem; white-space: pre-line; overflow-wrap: anywhere; }
.at-confirmada { display: grid; justify-items: center; gap: .85rem; text-align: center; }
.at-confirmada > svg { color: ${VERDE}; }
.at-confirmada dl { width: 100%; text-align: left; }
.at-confirmada dl div { display: flex; justify-content: space-between; gap: 1rem; padding-block: .55rem; border-bottom: 1px solid ${BORDE}; font-size: .9rem; }
.at-confirmada dt { color: ${SUAVE}; }
.at-confirmada dd { font-weight: 600; text-align: right; }

/* pie */
.at-pie { background: ${PIZARRA}; color: #fff; padding-block: 2.6rem 1.5rem; }
.at-pie-emergencia { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem 2rem; padding-bottom: 1.8rem; border-bottom: 1px solid rgba(255,255,255,.14); }
.at .at-pie-emergencia h2 { font-size: 1.4rem; }
.at-pie-emergencia p { color: rgba(255,255,255,.72); font-size: .92rem; }
.at-pie-columnas { display: grid; gap: 1.8rem; padding-block: 1.8rem; }
@media (min-width: 760px) { .at-pie-columnas { grid-template-columns: 1.1fr 1.2fr 1fr; gap: 3rem; } }
.at .at-pie h3 { display: flex; align-items: center; gap: .5rem; margin-bottom: .7rem; font-size: 1rem; }
.at-pie h3 svg { color: #FB923C; }
.at-pie section p, .at-pie dt { color: rgba(255,255,255,.72); font-size: .88rem; }
.at-pie section p { margin-top: .55rem; }
.at-pie section a { text-decoration: underline; text-underline-offset: 4px; }
.at-pie dl { display: grid; gap: .35rem; }
.at-pie dl div { display: flex; justify-content: space-between; gap: 1rem; }
.at-pie dd { font-size: .88rem; font-weight: 600; white-space: nowrap; }
.at-pie-final { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .5rem 1.5rem; padding-top: 1.1rem; border-top: 1px solid rgba(255,255,255,.14); color: rgba(255,255,255,.68); font-size: .82rem; }
.at-pie-final p:last-child { margin-left: auto; text-align: right; }
.at-pie-final a { color: #fff; font-weight: 700; text-decoration: underline; text-underline-offset: 4px; }

@media (prefers-reduced-motion: reduce) {
  .at-hueso, .at-ventana[open] .at-ventana-caja { animation: none; }
}
`;
