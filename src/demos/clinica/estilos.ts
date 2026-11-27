export const LETRAS = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";

const BLANCO = "#FFFFFF";
const HIELO = "#F8FAFC";
const BORDE = "#E2E8F0";
const PETROLEO = "#0F4C5C";
const ESMERALDA = "#0D9488";
const ESMERALDA_OSCURA = "#0F766E";
const TEXTO = "#16323B";
const SUAVE = "#526670";

/* Todo va bajo .vv o con el prefijo vv- para no chocar con las demás demos. */
export const ESTILOS = `
.vv { background: ${BLANCO}; color: ${TEXTO}; font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; font-weight: 400; font-size: 16px; line-height: 1.6; font-variant-numeric: tabular-nums lining-nums; min-height: 100vh; }
.vv h1, .vv h2, .vv h3 { color: ${PETROLEO}; font-family: inherit; font-weight: 700; letter-spacing: -.02em; line-height: 1.2; }
.vv h3 { font-size: 1.08rem; letter-spacing: -.01em; }
.vv :focus-visible { outline: 3px solid ${ESMERALDA}; outline-offset: 2px; border-radius: 6px; }
.vv-franja :focus-visible, .vv .vv-tarjeta :focus-visible, .vv .vv-pie :focus-visible, .vv .vv-barra :focus-visible { outline-color: #fff; }
.vv section[id], .vv #vv-tarjeta, .vv fieldset[id] { scroll-margin-top: 5.5rem; }
.vv button:not(:disabled), .vv select:not(:disabled) { cursor: pointer; }
.vv small { font-size: .82rem; line-height: 1.45; }
.vv strong, .vv b { font-weight: 600; }
.vv-ancho { width: 100%; max-width: 74rem; margin-inline: auto; padding-inline: 1rem; }
.vv-suave { color: ${SUAVE}; font-size: .92rem; }
.vv-oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.vv-con-icono { display: flex; align-items: flex-start; gap: .5rem; }
.vv-con-icono svg { flex-shrink: 0; margin-top: .22rem; }

/* píldora de vistas */
.vv-franja { display: flex; justify-content: center; padding: .6rem 1rem; background: ${PETROLEO}; }
.vv-pildora { display: grid; grid-template-columns: 1fr 1fr; width: 100%; max-width: 27rem; padding: 4px; gap: 4px; background: rgba(255,255,255,.12); border-radius: 999px; }
.vv-pildora button { display: inline-flex; align-items: center; justify-content: center; gap: .45rem; min-height: 40px; padding-inline: .6rem; border-radius: 999px; color: #fff; font-size: .88rem; font-weight: 600; white-space: nowrap; transition: background-color .2s, color .2s; }
.vv-pildora button[aria-pressed="true"] { background: #fff; color: ${PETROLEO}; }
.vv-solo-ancho { display: none; }
@media (min-width: 480px) { .vv-solo-ancho { display: inline; } }

/* logo */
.vv-logo { display: inline-flex; align-items: center; gap: .75rem; line-height: 1; text-align: left; }
.vv-marca { width: 13px; height: 13px; margin-left: 5px; flex-shrink: 0; transform: rotate(45deg); background: ${ESMERALDA}; box-shadow: 0 0 0 4px #fff, 0 0 0 5.5px ${PETROLEO}; }
.vv-logo-tipo { display: block; font-size: .7rem; font-weight: 500; color: ${SUAVE}; }
.vv-logo-nombre { display: block; margin-top: .2rem; font-size: 1.2rem; font-weight: 700; letter-spacing: -.025em; color: ${PETROLEO}; }

/* menú fijo */
.vv-cabeza { position: sticky; top: 0; z-index: 20; background: #fff; border-bottom: 1px solid ${BORDE}; }
.vv-cabeza-fila { display: flex; align-items: center; justify-content: space-between; gap: .75rem; min-height: 68px; }
.vv-logo-boton { flex-shrink: 0; }
.vv-menu { display: none; gap: .25rem; }
.vv-menu button { min-height: 44px; padding-inline: .8rem; font-size: .93rem; font-weight: 500; border-radius: 8px; }
.vv-menu button:hover { background: ${HIELO}; color: ${ESMERALDA_OSCURA}; }
.vv-cabeza-botones { display: flex; align-items: center; gap: .5rem; }
.vv-hamburguesa { display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid ${BORDE}; border-radius: 8px; }
.vv-menu-movil { position: absolute; inset-inline: 0; top: 100%; display: grid; padding: .35rem 1rem .75rem; background: #fff; border-bottom: 1px solid ${BORDE}; box-shadow: 0 20px 30px -22px rgba(15,76,92,.45); }
.vv-menu-movil button { display: flex; align-items: center; justify-content: space-between; min-height: 48px; border-bottom: 1px solid ${BORDE}; font-weight: 500; }
.vv-menu-movil button:last-child { border-bottom: 0; }
@media (max-width: 370px) { .vv-cabeza-botones .vv-btn { display: none; } }
@media (min-width: 960px) { .vv-menu { display: flex; } .vv-hamburguesa, .vv-menu-movil { display: none; } }

/* botones */
.vv-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 48px; padding: .6rem 1.2rem; border: 1px solid transparent; border-radius: 10px; font-weight: 600; font-size: .95rem; line-height: 1.25; text-align: center; text-decoration: none; transition: background-color .15s, border-color .15s, transform .1s; }
.vv-btn:active:not(:disabled) { transform: translateY(1px); }
.vv-btn:disabled { cursor: not-allowed; }
.vv-btn svg { flex-shrink: 0; }
.vv-chico { min-height: 40px; padding: .4rem .85rem; font-size: .87rem; }
.vv-lleno { width: 100%; }
.vv-accion { background: ${ESMERALDA}; color: #fff; }
.vv-accion:hover:not(:disabled) { background: ${ESMERALDA_OSCURA}; }
.vv-accion:disabled { background: #EDF1F5; color: #7B8B94; }
.vv-contorno { background: #fff; color: ${PETROLEO}; border-color: #CBD5E1; }
.vv-contorno:hover { border-color: ${PETROLEO}; }
.vv-claro { background: transparent; color: #fff; border-color: rgba(255,255,255,.35); }
.vv-claro:hover { border-color: #fff; }
.vv-enlace { display: inline-flex; align-items: center; gap: .35rem; min-height: 36px; color: ${ESMERALDA_OSCURA}; font-size: .9rem; font-weight: 600; white-space: nowrap; }
.vv-enlace:hover { text-decoration: underline; text-underline-offset: 4px; }

/* fotos */
.vv-foto { display: block; overflow: hidden; background: #DCE8EA; }
.vv-foto img { width: 100%; height: 100%; object-fit: cover; }

/* portada */
.vv-portada { padding-block: 2.25rem 3rem; }
.vv-portada-rejilla { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2rem; align-items: center; }
.vv-ante { color: ${ESMERALDA_OSCURA}; font-weight: 600; font-size: .95rem; }
.vv h1 { margin-top: .5rem; font-size: clamp(2rem, 5.2vw, 3.25rem); line-height: 1.12; letter-spacing: -.035em; }
.vv-bajada { margin-top: 1rem; max-width: 34rem; color: ${SUAVE}; font-size: 1.05rem; }
.vv-acciones { display: flex; flex-direction: column; gap: .65rem; margin-top: 1.5rem; }
@media (min-width: 520px) { .vv-acciones { flex-direction: row; flex-wrap: wrap; } }
.vv-datos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 2rem; border-top: 1px solid ${BORDE}; }
.vv-datos > div { padding: .85rem .75rem 0 0; }
.vv-datos dt { color: ${SUAVE}; font-size: .78rem; line-height: 1.35; }
.vv-datos dd { margin-top: .15rem; color: ${PETROLEO}; font-weight: 700; font-size: .95rem; line-height: 1.35; }
.vv-portada-foto { position: relative; min-width: 0; }
.vv-portada-foto .vv-foto { aspect-ratio: 4 / 3; border-radius: 16px; }
.vv-proxima { display: flex; align-items: center; gap: .85rem; width: calc(100% - 1.5rem); margin: -2.25rem auto 0; position: relative; padding: .85rem 1rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 14px; box-shadow: 0 20px 40px -24px rgba(15,76,92,.5); text-align: left; }
.vv-proxima > span:nth-child(2) { flex: 1; min-width: 0; }
.vv-proxima-icono { display: grid; place-items: center; width: 42px; height: 42px; flex-shrink: 0; border-radius: 10px; background: #E6F6F4; color: ${ESMERALDA_OSCURA}; }
.vv-proxima-titulo { display: block; color: ${SUAVE}; font-size: .78rem; }
.vv-proxima-valor { display: block; font-weight: 700; color: ${PETROLEO}; font-size: .93rem; line-height: 1.35; }
.vv-proxima-valor::first-letter { text-transform: uppercase; }
@media (min-width: 960px) {
  .vv-portada { padding-block: 4rem 4.5rem; }
  .vv-portada-rejilla { grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 3.5rem; }
  .vv-proxima { position: absolute; left: -1.5rem; bottom: 1.5rem; width: 22rem; margin: 0; }
}

/* secciones */
.vv-seccion { padding-block: 3.25rem; }
@media (min-width: 960px) { .vv-seccion { padding-block: 5rem; } }
.vv-hielo { background: ${HIELO}; border-block: 1px solid ${BORDE}; }
.vv-titulo { margin-bottom: 1.75rem; }
.vv-titulo h2 { font-size: clamp(1.6rem, 3.6vw, 2.15rem); }
.vv-titulo p { margin-top: .4rem; color: ${SUAVE}; }

/* catálogo */
.vv-filtros { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.5rem; }
.vv-filtros button, .vv-pagos button { min-height: 42px; padding-inline: 1rem; border: 1px solid #CBD5E1; border-radius: 999px; background: #fff; font-size: .9rem; font-weight: 600; transition: background-color .15s, border-color .15s; }
.vv-filtros button[aria-pressed="true"] { background: ${PETROLEO}; border-color: ${PETROLEO}; color: #fff; }
.vv-catalogo { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
@media (min-width: 640px) { .vv-catalogo { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 960px) { .vv-catalogo { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.vv-tratamiento { display: flex; flex-direction: column; gap: .65rem; min-height: 21.5rem; padding: 1.35rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 14px; }
.vv-especialidad { color: ${ESMERALDA_OSCURA}; font-size: .8rem; font-weight: 600; }
.vv-meta { display: flex; flex-wrap: wrap; gap: .35rem 1.1rem; color: ${SUAVE}; font-size: .83rem; }
.vv-meta span { display: inline-flex; align-items: center; gap: .35rem; }
.vv-precio { margin-top: auto; padding-top: .85rem; border-top: 1px solid ${BORDE}; }
.vv-precio strong { color: ${PETROLEO}; font-size: 1.6rem; font-weight: 700; letter-spacing: -.02em; }
.vv-precio small { color: ${SUAVE}; }
.vv-precio .vv-suave { font-size: .83rem; min-height: 1.35rem; }
.vv-hueso { display: block; border-radius: 6px; background: linear-gradient(100deg, #EDF1F5 30%, #F8FAFC 50%, #EDF1F5 70%); background-size: 220% 100%; animation: vv-brillo 1.2s linear infinite; }
@keyframes vv-brillo { from { background-position: 120% 0; } to { background-position: -100% 0; } }

/* agenda en vista dividida */
.vv-dividida { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.25rem; align-items: start; }
@media (min-width: 960px) { .vv-dividida { grid-template-columns: minmax(0, 1fr) 23.5rem; gap: 2rem; } }
.vv-pasos { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
.vv-paso { min-width: 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: .85rem; padding: 1.15rem; border: 1px solid ${BORDE}; border-radius: 14px; background: ${HIELO}; }
@media (min-width: 640px) { .vv-paso { padding: 1.5rem; } }
.vv-paso h3 { display: flex; align-items: center; gap: .65rem; }
.vv-paso h3 span { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 8px; background: ${PETROLEO}; color: #fff; font-size: .85rem; }
.vv-campo { display: grid; grid-template-columns: minmax(0, 1fr); gap: .3rem; min-width: 0; }
.vv-campo > span { font-size: .85rem; font-weight: 600; }
.vv-campo input, .vv-campo select { width: 100%; min-width: 0; min-height: 48px; padding: .5rem .8rem; background-color: #fff; border: 1px solid #CBD5E1; border-radius: 10px; color: ${TEXTO}; font-size: 16px; text-overflow: ellipsis; }
.vv-dos { display: grid; grid-template-columns: minmax(0, 1fr); gap: .85rem; }
@media (min-width: 640px) { .vv-dos { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.vv-doctores, .vv-complementos { display: grid; grid-template-columns: minmax(0, 1fr); gap: .6rem; }
.vv-opcion { display: flex; align-items: center; gap: .8rem; padding: .75rem .85rem; background: #fff; border: 1px solid #CBD5E1; border-radius: 12px; cursor: pointer; transition: border-color .15s, box-shadow .15s; }
.vv-opcion:has(input:checked) { border-color: ${ESMERALDA}; box-shadow: 0 0 0 1px ${ESMERALDA}; }
.vv-opcion input { width: 18px; height: 18px; flex-shrink: 0; accent-color: ${ESMERALDA}; }
.vv-opcion img { width: 48px; height: 48px; flex-shrink: 0; border-radius: 10px; object-fit: cover; background: #DCE8EA; }
.vv-opcion > span { display: grid; flex: 1; min-width: 0; line-height: 1.35; }
.vv-opcion strong { font-size: .94rem; }
.vv-opcion small { color: ${SUAVE}; }
.vv-opcion > b { flex-shrink: 0; font-size: .86rem; color: ${PETROLEO}; }
.vv-fechas { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .5rem; }
@media (min-width: 640px) { .vv-fechas { grid-template-columns: repeat(6, minmax(0, 1fr)); } }
.vv-fechas button { display: grid; justify-items: center; padding-block: .5rem; background: #fff; border: 1px solid #CBD5E1; border-radius: 10px; line-height: 1.25; }
.vv-fechas span { font-size: .75rem; color: ${SUAVE}; }
.vv-fechas strong { font-size: 1.2rem; font-weight: 700; }
.vv-horas { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .5rem; }
@media (min-width: 640px) { .vv-horas { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
.vv-horas button { min-height: 44px; padding-inline: .2rem; background: #fff; border: 1px solid #CBD5E1; border-radius: 10px; font-size: .84rem; font-weight: 600; white-space: nowrap; }
.vv-jornada > p { margin-bottom: .4rem; font-size: .85rem; font-weight: 600; }
.vv-fechas button:hover:not(:disabled), .vv-horas button:hover:not(:disabled), .vv-pagos button:hover { border-color: ${ESMERALDA}; }
.vv-fechas button[aria-pressed="true"], .vv-horas button[aria-pressed="true"], .vv-pagos button[aria-pressed="true"] { background: ${PETROLEO}; border-color: ${PETROLEO}; color: #fff; }
.vv-fechas button[aria-pressed="true"] span { color: rgba(255,255,255,.8); }
.vv-fechas button:disabled, .vv-horas button:disabled { background: transparent; border-style: dashed; color: #8898A1; cursor: not-allowed; }
.vv-fechas button:disabled span { color: #8898A1; }
.vv-horas button:disabled { text-decoration: line-through; }
.vv-pagos { display: flex; flex-wrap: wrap; gap: .5rem; }

/* tarjeta fija */
.vv-tarjeta { min-width: 0; padding: 1.35rem; background: ${PETROLEO}; color: #fff; border-radius: 16px; box-shadow: 0 28px 50px -30px rgba(15,76,92,.75); }
@media (min-width: 960px) { .vv-tarjeta { position: sticky; top: 84px; max-height: calc(100vh - 100px); overflow-y: auto; scrollbar-width: thin; } }
.vv .vv-tarjeta h3 { color: #fff; font-size: 1.15rem; }
.vv-resumen { margin-top: .85rem; }
.vv-resumen > div, .vv-cargos > div { display: flex; justify-content: space-between; gap: 1rem; padding-block: .3rem; font-size: .88rem; line-height: 1.4; }
.vv-resumen dt, .vv-cargos dt { color: rgba(255,255,255,.72); }
.vv-resumen dd, .vv-cargos dd { text-align: right; font-weight: 600; }
.vv-cargos { margin-top: .75rem; padding-top: .6rem; border-top: 1px solid rgba(255,255,255,.18); }
.vv-total { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .25rem 1rem; margin-top: .75rem; padding-top: .75rem; border-top: 1px solid rgba(255,255,255,.18); }
.vv-total span { color: rgba(255,255,255,.78); font-size: .9rem; }
.vv-total strong { font-size: 2.1rem; font-weight: 700; letter-spacing: -.025em; line-height: 1.15; }
.vv-cuota { margin-top: .35rem; font-size: .85rem; color: #A7F3E4; text-align: right; }
.vv-aviso { display: flex; gap: .5rem; align-items: flex-start; margin-top: .85rem; padding: .6rem .75rem; background: #FEF3C7; color: #78350F; border-radius: 10px; font-size: .87rem; font-weight: 600; }
.vv-aviso svg { flex-shrink: 0; margin-top: .15rem; }
.vv-tarjeta .vv-btn { margin-top: .9rem; }
.vv-tarjeta .vv-claro { margin-top: .55rem; }
.vv-nota { margin-top: .65rem; text-align: center; font-size: .78rem; color: rgba(255,255,255,.72); }
.vv-sello { display: grid; place-items: center; width: 50px; height: 50px; margin-bottom: .75rem; border-radius: 14px; background: ${ESMERALDA}; }
.vv-folio { margin-top: .25rem; font-size: .85rem; color: #A7F3E4; font-weight: 600; }

/* barra compacta (celular) */
.vv-barra { position: fixed; z-index: 25; inset-inline: .75rem; bottom: calc(.75rem + env(safe-area-inset-bottom)); display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: .65rem .65rem .65rem 1rem; background: ${PETROLEO}; color: #fff; border-radius: 14px; box-shadow: 0 18px 36px -16px rgba(8,40,48,.7); transform: translateY(calc(100% + 2rem)); visibility: hidden; transition: transform .35s cubic-bezier(.2,.8,.2,1), visibility 0s .35s; }
.vv-barra[data-visible="true"] { transform: none; visibility: visible; transition: transform .35s cubic-bezier(.2,.8,.2,1); }
.vv-barra p { display: grid; line-height: 1.3; }
.vv-barra span { font-size: .75rem; color: rgba(255,255,255,.75); }
.vv-barra strong { font-size: 1.15rem; font-weight: 700; }
@media (min-width: 960px) { .vv-barra { display: none; } }

/* especialistas */
.vv-equipo { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
@media (min-width: 960px) { .vv-equipo { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.25rem; } }
.vv-equipo li { overflow: hidden; border: 1px solid ${BORDE}; border-radius: 14px; }
.vv-equipo .vv-foto { aspect-ratio: 6 / 7; }
.vv-equipo li > div { padding: .85rem; }
.vv-equipo h3 { font-size: .98rem; }
.vv-area { margin-top: .25rem; font-size: .85rem; font-weight: 600; line-height: 1.4; }
.vv-equipo .vv-suave { font-size: .82rem; line-height: 1.4; margin-top: .15rem; }
.vv-instalaciones { display: grid; grid-template-columns: minmax(0, 1fr); margin-top: 2rem; overflow: hidden; background: ${HIELO}; border: 1px solid ${BORDE}; border-radius: 16px; }
.vv-instalaciones .vv-foto { aspect-ratio: 16 / 10; }
.vv-instalaciones > div { align-self: center; padding: 1.5rem; }
.vv-instalaciones h3 { font-size: 1.35rem; }
.vv-instalaciones ul { display: grid; gap: .6rem; margin-block: 1rem; padding-left: 1.1rem; list-style: square; }
.vv-instalaciones li::marker { color: ${ESMERALDA}; }
@media (min-width: 800px) { .vv-instalaciones { grid-template-columns: repeat(2, minmax(0, 1fr)); } .vv-instalaciones .vv-foto { aspect-ratio: auto; height: 100%; min-height: 19rem; } .vv-instalaciones > div { padding: 2.5rem; } }

/* mi cuenta */
.vv-saldos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; }
@media (min-width: 960px) { .vv-saldos { grid-template-columns: 1.2fr 1fr 1fr 1.5fr; } }
.vv-saldos > div, .vv-indicadores > div { padding: 1rem 1.1rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 14px; }
.vv-saldos dt, .vv-indicadores dt { color: ${SUAVE}; font-size: .82rem; }
.vv-saldos dd, .vv-indicadores dd { color: ${PETROLEO}; font-size: 1.35rem; font-weight: 700; letter-spacing: -.02em; line-height: 1.35; overflow-wrap: anywhere; }
.vv-saldos .vv-saldo-principal { background: ${PETROLEO}; border-color: ${PETROLEO}; }
.vv-saldo-principal dt { color: rgba(255,255,255,.75); }
.vv-saldos .vv-saldo-principal dd { color: #fff; }
.vv-saldos .vv-dd-texto { font-size: .95rem; }
.vv-saldos .vv-dd-nota { font-size: .8rem; font-weight: 400; letter-spacing: 0; color: ${SUAVE}; }
.vv-boca { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; margin-top: 1rem; align-items: start; }
@media (min-width: 960px) { .vv-boca { grid-template-columns: minmax(0, 1fr) 22rem; } }
.vv-panel { min-width: 0; padding: 1.1rem; background: #fff; border: 1px solid ${BORDE}; border-radius: 14px; }
@media (min-width: 640px) { .vv-panel { padding: 1.4rem; } }
.vv-arcadas { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; margin-top: 1rem; }
@media (min-width: 640px) { .vv-arcadas { grid-template-columns: repeat(2, minmax(0, 1fr)); } .vv-cuadrante:nth-child(odd) { padding-right: .6rem; border-right: 2px solid ${BORDE}; } .vv-cuadrante:nth-child(odd) > p { text-align: right; } }
.vv-cuadrante > p { margin-bottom: .35rem; font-size: .76rem; color: ${SUAVE}; }
.vv-cuadrante > div { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 3px; }
.vv-pieza { display: grid; justify-items: center; gap: .2rem; min-width: 0; padding: .3rem 0; border: 1px solid transparent; border-radius: 8px; }
.vv-pieza:hover { background: ${HIELO}; }
.vv-pieza[aria-pressed="true"] { background: #E6F6F4; border-color: ${ESMERALDA}; }
.vv-pieza i { width: 72%; max-width: 28px; height: 32px; border: 1.5px solid #94A3B8; background: #fff; border-radius: 8px 8px 45% 45%; }
.vv-abajo .vv-pieza i { border-radius: 45% 45% 8px 8px; }
.vv-pieza span { font-size: .72rem; font-weight: 600; }
.vv [data-marca="pendiente"] { --fondo: #FDE9C8; --linea: #B45309; }
.vv [data-marca="curso"] { --fondo: #BFDBE3; --linea: ${PETROLEO}; }
.vv [data-marca="tratada"] { --fondo: #B7E6DF; --linea: ${ESMERALDA_OSCURA}; }
.vv [data-marca="sana"] { --fondo: #fff; --linea: #64748B; }
.vv .vv-pieza[data-marca] i, .vv-leyenda li i { background: var(--fondo); border-color: var(--linea); }
.vv-leyenda { display: flex; flex-wrap: wrap; gap: .4rem 1.1rem; margin-top: 1.1rem; padding-top: .85rem; border-top: 1px solid ${BORDE}; font-size: .8rem; }
.vv-leyenda li { display: inline-flex; align-items: center; gap: .4rem; }
.vv-leyenda i { width: 13px; height: 13px; border: 1.5px solid; border-radius: 4px; }
.vv-estado { display: inline-block; width: fit-content; padding: .1rem .55rem; border-radius: 999px; background: var(--fondo); color: var(--linea); font-size: .76rem; font-weight: 600; }
.vv-estado[data-marca="sana"] { background: #F1F5F9; }
.vv-detalle { display: grid; grid-template-columns: minmax(0, 1fr); gap: .6rem; }
.vv-detalle li { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding-block: .65rem; border-top: 1px solid ${BORDE}; }
.vv-detalle li > span:first-child { display: grid; min-width: 0; line-height: 1.4; }
.vv-detalle small { color: ${SUAVE}; }
.vv-plan li { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: .75rem; padding-block: .75rem; border-top: 1px solid ${BORDE}; }
.vv-plan { margin-top: .75rem; }
.vv-plan li > span:nth-child(2) { display: grid; justify-items: start; gap: .2rem; min-width: 0; line-height: 1.35; }
.vv-plan strong { font-size: .9rem; }
.vv-plan b { font-size: .88rem; white-space: nowrap; }
.vv-plan-pieza { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 9px; background: ${HIELO}; border: 1px solid ${BORDE}; font-size: .84rem; font-weight: 600; }
button.vv-plan-pieza:hover:not(:disabled) { border-color: ${ESMERALDA}; }
button.vv-plan-pieza:disabled { cursor: default; }
.vv-abonos { margin-top: .75rem; }
.vv-abonos li { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding-block: .65rem; border-top: 1px solid ${BORDE}; }
.vv-abonos li > span { display: grid; line-height: 1.35; }
.vv-abonos small { color: ${SUAVE}; }
.vv-cuadre { display: grid; gap: .3rem; margin-top: .75rem; padding: .85rem; background: ${HIELO}; border-radius: 10px; font-size: .87rem; }
.vv-cuadre span { display: flex; justify-content: space-between; gap: 1rem; }
.vv-cuadre span:last-child { padding-top: .4rem; border-top: 1px solid #CBD5E1; font-weight: 700; color: ${PETROLEO}; }

/* panel de la clínica */
.vv-cabeza-panel { flex-wrap: wrap; padding-block: .6rem; }
.vv-pestanas { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; width: 100%; padding: 4px; background: ${HIELO}; border: 1px solid ${BORDE}; border-radius: 12px; }
.vv-pestanas button { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; min-height: 40px; padding-inline: .5rem; border-radius: 9px; font-size: .86rem; font-weight: 600; }
.vv-pestanas button[aria-pressed="true"] { background: ${PETROLEO}; color: #fff; }
@media (max-width: 399px) { .vv-pestanas svg { display: none; } }
@media (min-width: 640px) { .vv-pestanas { width: auto; grid-template-columns: repeat(3, auto); } .vv-pestanas button { padding-inline: 1.1rem; } }
.vv-panel-fondo { background: ${HIELO}; padding-block: 1.5rem 3.5rem; min-height: 60vh; }
.vv-panel-titulo { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: .75rem; }
.vv .vv-panel-titulo h1 { margin: 0; font-size: 1.6rem; letter-spacing: -.025em; }
.vv-indicadores { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; margin-block: 1.1rem; }
@media (min-width: 800px) { .vv-indicadores { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.vv .vv-panel h2 { font-size: 1.15rem; }
.vv-panel-encabezado { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .75rem; }
.vv-campo-linea { width: 100%; }
@media (min-width: 640px) { .vv-campo-linea { width: 17rem; } }
.vv-barra-dias { display: flex; gap: .5rem; overflow-x: auto; padding-bottom: .5rem; margin-bottom: .75rem; scrollbar-width: thin; }
.vv-barra-dias button { display: grid; flex: 0 0 auto; min-width: 5.5rem; padding: .5rem .75rem; text-align: left; background: #fff; border: 1px solid ${BORDE}; border-radius: 12px; line-height: 1.35; }
.vv-barra-dias span, .vv-barra-dias small { font-size: .75rem; color: ${SUAVE}; }
.vv-barra-dias button[aria-pressed="true"] { background: ${PETROLEO}; border-color: ${PETROLEO}; color: #fff; }
.vv-barra-dias button[aria-pressed="true"] :is(span, small) { color: rgba(255,255,255,.78); }
.vv-agenda { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; align-items: start; }
@media (min-width: 1100px) { .vv-agenda { grid-template-columns: minmax(0, 1fr) 20rem; } }
.vv-citas { margin-top: .85rem; }
.vv-citas li { display: grid; grid-template-columns: 5.25rem minmax(0, 1fr); gap: .6rem .85rem; padding-block: .95rem; border-top: 1px solid ${BORDE}; }
.vv-citas li[data-portal="true"] { margin-inline: -.6rem; padding-inline: .6rem; background: #EFFAF8; border-radius: 10px; }
@media (min-width: 800px) { .vv-citas li { grid-template-columns: 5.5rem minmax(0, 1fr) auto; align-items: center; } }
.vv-cita-hora { display: grid; align-content: start; line-height: 1.35; }
.vv-cita-hora strong { font-size: .9rem; white-space: nowrap; }
.vv-cita-hora small, .vv-cita-quien small { color: ${SUAVE}; }
.vv-cita-quien { display: grid; min-width: 0; line-height: 1.45; }
.vv-cita-quien p { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
.vv-cita-quien b { color: ${TEXTO}; }
.vv-nombre { font-weight: 700; text-align: left; }
.vv-nombre:hover { color: ${ESMERALDA_OSCURA}; text-decoration: underline; }
.vv-etiqueta { padding: .05rem .5rem; border-radius: 999px; background: ${ESMERALDA_OSCURA}; color: #fff; font-size: .72rem; font-weight: 600; }
.vv-cita-acciones { grid-column: 1 / -1; display: grid; gap: .25rem; justify-items: end; }
@media (min-width: 800px) { .vv-cita-acciones { grid-column: auto; } }
.vv-estados { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); width: 100%; padding: 3px; gap: 3px; background: ${HIELO}; border: 1px solid ${BORDE}; border-radius: 10px; }
@media (min-width: 800px) { .vv-estados { width: 19rem; } }
.vv-estados button { min-height: 36px; border-radius: 8px; font-size: .78rem; font-weight: 600; color: ${SUAVE}; white-space: nowrap; }
.vv-estados button[aria-pressed="true"] { color: #fff; }
.vv-estados button[aria-pressed="true"][data-estado="Confirmada"] { background: ${PETROLEO}; }
.vv-estados button[aria-pressed="true"][data-estado="En sala"] { background: #B45309; }
.vv-estados button[aria-pressed="true"][data-estado="Completada"] { background: ${ESMERALDA_OSCURA}; }
.vv-citas li.vv-vacio, .vv-vacio { display: block; padding-block: 1.25rem; color: ${SUAVE}; text-align: center; }
.vv-portal-lista { margin-top: .75rem; }
.vv-portal-lista li { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding-block: .7rem; border-top: 1px solid ${BORDE}; }
.vv-portal-lista li > span { display: grid; min-width: 0; line-height: 1.4; }
.vv-portal-lista small { color: ${SUAVE}; }
.vv-portal-lista button { flex-shrink: 0; }
.vv-panel > h2 + p { margin-top: .5rem; }
.vv-precios { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
.vv-precios ul { margin-top: .75rem; }
.vv-precios form { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: .6rem 1rem; padding-block: .75rem; border-top: 1px solid ${BORDE}; }
.vv-precios form > span { grid-column: 1 / -1; display: grid; line-height: 1.4; }
.vv-precios small { color: ${SUAVE}; }
@media (min-width: 640px) { .vv-precios form { grid-template-columns: minmax(0, 1fr) 10rem auto; } .vv-precios form > span { grid-column: auto; } }
.vv-dinero { display: flex; align-items: center; gap: .4rem; min-height: 42px; padding-inline: .75rem; border: 1px solid #CBD5E1; border-radius: 10px; font-weight: 600; }
.vv-dinero:focus-within { border-color: ${ESMERALDA}; box-shadow: 0 0 0 1px ${ESMERALDA}; }
.vv-dinero input { width: 100%; min-width: 0; border: 0; text-align: right; font-size: 16px; font-weight: 600; background: transparent; }
.vv-dinero input:focus-visible { outline: none; }
.vv-pacientes { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; align-items: start; }
@media (min-width: 960px) { .vv-pacientes { grid-template-columns: 21rem minmax(0, 1fr); } }
.vv-buscar { display: flex; align-items: center; gap: .5rem; min-height: 46px; padding-inline: .75rem; border: 1px solid #CBD5E1; border-radius: 10px; }
.vv-buscar:focus-within { border-color: ${ESMERALDA}; box-shadow: 0 0 0 1px ${ESMERALDA}; }
.vv-buscar input { flex: 1; min-width: 0; border: 0; font-size: 16px; }
.vv-buscar input:focus-visible { outline: none; }
.vv-lista-pacientes { max-height: 17rem; margin-top: .75rem; overflow-y: auto; }
@media (min-width: 960px) { .vv-lista-pacientes { max-height: 40rem; } }
.vv-lista-pacientes button { display: flex; align-items: center; justify-content: space-between; gap: .75rem; width: 100%; padding: .6rem .7rem; border-radius: 10px; text-align: left; }
.vv-lista-pacientes button:hover { background: ${HIELO}; }
.vv-lista-pacientes button[aria-pressed="true"] { background: #E6F6F4; box-shadow: inset 3px 0 0 ${ESMERALDA}; }
.vv-lista-pacientes span { display: grid; min-width: 0; line-height: 1.35; }
.vv-lista-pacientes strong { font-size: .9rem; }
.vv-lista-pacientes small { color: ${SUAVE}; }
.vv-lista-pacientes b { font-size: .86rem; color: ${SUAVE}; white-space: nowrap; }
.vv-lista-pacientes b[data-debe="true"] { color: #92400E; }
.vv-ficha > h3 { margin-top: 1.5rem; }
.vv-ficha-saldo { display: grid; line-height: 1.3; }
.vv-ficha-saldo span { font-size: .8rem; color: ${SUAVE}; }
.vv-ficha-saldo strong { font-size: 1.7rem; font-weight: 700; color: ${PETROLEO}; }
@media (min-width: 640px) { .vv-ficha-saldo { text-align: right; } }
.vv-aviso-panel { margin-top: .6rem; color: ${ESMERALDA_OSCURA}; font-size: .88rem; font-weight: 600; }
.vv-aviso-panel:empty { margin: 0; }
.vv-formulario { display: grid; grid-template-columns: minmax(0, 1fr); gap: .65rem; margin-top: .85rem; padding: 1rem; background: ${HIELO}; border: 1px solid ${BORDE}; border-radius: 12px; align-items: end; }
.vv-formulario h3 { grid-column: 1 / -1; font-size: .98rem; }
@media (min-width: 640px) { .vv-formulario { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto; } .vv-formulario-cargo { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) auto; } }
.vv-select-estado { min-height: 34px; padding: .15rem .5rem; border: 1px solid var(--linea); border-radius: 8px; background-color: var(--fondo); color: var(--linea); font-size: .8rem !important; font-weight: 600 !important; }
.vv-select-estado:disabled { cursor: default; }

/* pie */
.vv-pie { padding-block: 3rem 2rem; background: ${PETROLEO}; color: rgba(255,255,255,.82); font-size: .9rem; }
.vv-pie-columnas { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2rem; }
@media (min-width: 640px) { .vv-pie-columnas { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 960px) { .vv-pie-columnas { grid-template-columns: 1fr 1.3fr 1fr 1.1fr; gap: 2.5rem; } }
.vv .vv-pie h2 { margin-bottom: .5rem; color: #fff; font-size: .95rem; letter-spacing: 0; }
.vv-pie p + h2 { margin-top: 1.25rem; }
.vv-pie p + p { margin-top: .5rem; }
.vv-pie .vv-logo + p { margin-top: 1.1rem; max-width: 18rem; }
.vv-pie .vv-logo-tipo { color: rgba(255,255,255,.75); }
.vv-pie .vv-logo-nombre { color: #fff; }
.vv-pie .vv-marca { box-shadow: 0 0 0 4px ${PETROLEO}, 0 0 0 5.5px #fff; }
.vv-horarios > div { padding-block: .3rem; }
.vv-horarios dt { font-weight: 600; color: #fff; }
.vv-pie-final { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .5rem 2rem; margin-top: 2.5rem; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,.18); font-size: .82rem; }
.vv-pie-final p { margin: 0; }
.vv-pie-final p:last-child { margin-left: auto; }
.vv-pie-final a { color: #fff; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
@media (max-width: 959px) { .vv-pie { padding-bottom: 5.5rem; } }

@media (prefers-reduced-motion: reduce) { .vv-hueso { animation: none; } .vv-barra, .vv-btn { transition: none; } }
`;
