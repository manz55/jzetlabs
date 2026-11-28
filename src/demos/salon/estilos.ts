/* Estilos de Atelier L'Art. Todo va bajo .al para no tocar la banda de demos ni las otras páginas. */
export const LETRAS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";

export const ESTILOS = `
.al-banda { position: relative; z-index: 50; }

.al {
  --alabastro: #FAF9F7; --arena: #F3EFEA; --espresso: #29211E; --terra: #9D5C4C; --terra-2: #83493B;
  --texto: #4E433E; --suave: #71645D; --linea: #E5DDD5; --blanco: #fff; --verde: #3F6B52;
  --titulo: "Playfair Display", Georgia, serif;
  min-height: 100vh; width: 100%; max-width: 100%; overflow-x: clip;
  background: var(--alabastro); color: var(--texto);
  font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif; font-size: 1rem; line-height: 1.6;
  font-variant-numeric: lining-nums tabular-nums;
}
.al *, .al *::before, .al *::after { box-sizing: border-box; min-width: 0; }
.al h1, .al h2, .al h3 { font-family: var(--titulo); color: var(--espresso); font-weight: 600; letter-spacing: -.01em; line-height: 1.18; overflow-wrap: break-word; }
.al h2 { font-size: clamp(1.75rem, 3.4vw, 2.5rem); }
.al h3 { font-size: 1.28rem; }
.al :where(button) { cursor: pointer; font: inherit; color: inherit; }
.al :where(button:disabled) { cursor: not-allowed; }
.al :focus-visible { outline: 3px solid var(--terra); outline-offset: 2px; }
.al fieldset { border: 0; padding: 0; margin: 0; }
.al legend { font-weight: 700; color: var(--espresso); margin-bottom: .6rem; font-size: .95rem; padding: 0; }
.al input, .al textarea, .al select {
  width: 100%; font: inherit; font-size: 1rem; color: var(--espresso); background: var(--blanco);
  border: 1px solid #D6CBC1; border-radius: .6rem; padding: .65rem .8rem;
}
.al textarea { resize: vertical; min-height: 4.4rem; }
.al-ancho { width: 100%; max-width: 76rem; margin-inline: auto; padding-inline: 1.1rem; }
@media (min-width: 640px) { .al-ancho { padding-inline: 2rem; } }
.al-suave { color: var(--suave); }
.al-oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

/* botones */
.al-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 2.75rem; padding: .6rem 1.15rem; border-radius: .6rem; border: 1px solid transparent; font-weight: 700; font-size: .93rem; line-height: 1.25; text-align: center; text-decoration: none; transition: background .15s, border-color .15s, color .15s, transform .12s; }
.al .al-btn:active { transform: scale(.98); }
.al .al-terra { background: var(--terra); color: #fff; }
.al .al-terra:hover { background: var(--terra-2); }
.al .al-linea { border-color: #CDBFB3; background: transparent; color: var(--espresso); }
.al .al-linea:hover { border-color: var(--espresso); }
.al .al-oscuro { background: var(--espresso); color: #fff; }
.al .al-claro { background: var(--alabastro); color: var(--espresso); }
.al .al-claro:hover { background: #fff; }
.al-lleno { width: 100%; }
.al-grande { min-height: 3.3rem; font-size: 1rem; padding-inline: 1.5rem; }

.al-foto { display: block; overflow: hidden; background: var(--arena); }
.al-foto img { display: block; width: 100%; height: 100%; object-fit: cover; }
.al-foto-sin { display: grid; place-items: center; height: 100%; min-height: 8rem; font-family: var(--titulo); color: var(--suave); }

/* logotipo */
.al-logo { display: flex; flex-direction: column; align-items: flex-start; line-height: 1; white-space: nowrap; }
.al-logo-nombre { font-family: var(--titulo); font-weight: 600; font-size: 1.22rem; letter-spacing: .06em; color: var(--espresso); }
.al-logo-linea { margin-top: .34rem; font-size: .52rem; font-weight: 600; letter-spacing: .27em; color: var(--terra); }
@media (max-width: 380px) { .al-logo-nombre { font-size: 1.02rem; } .al-logo-linea { font-size: .45rem; letter-spacing: .22em; } }

/* barra */
.al-nav { position: sticky; top: 0; z-index: 40; background: var(--blanco); border-bottom: 1px solid var(--linea); }
.al-nav-fila { display: flex; align-items: center; justify-content: space-between; gap: .75rem; max-width: 86rem; min-height: 4.5rem; margin-inline: auto; padding: .6rem 1.1rem; }
.al-nav-logo { background: none; border: 0; padding: .25rem 0; flex: 0 0 auto; }
.al-nav-centro { display: none; }
.al-nav-derecha { display: flex; align-items: center; gap: .5rem; flex: 0 0 auto; }
.al-nav-agendar { white-space: nowrap; }
.al-nav-menu { display: grid; place-items: center; width: 2.75rem; height: 2.75rem; border-radius: .6rem; border: 1px solid var(--linea); background: none; }
@media (max-width: 420px) { .al-nav-fila { padding-inline: .8rem; gap: .5rem; } .al .al-nav-agendar { padding-inline: .7rem; font-size: .84rem; } }
.al-vistas { display: flex; gap: .2rem; padding: .22rem; background: var(--arena); border-radius: .75rem; }
.al-vistas button, .al-menu-vistas button { display: inline-flex; align-items: center; gap: .4rem; border: 0; background: none; border-radius: .55rem; padding: .48rem .75rem; font-size: .85rem; font-weight: 700; color: var(--suave); white-space: nowrap; }
.al-vistas button[aria-current], .al-menu-vistas button[aria-current] { background: var(--espresso); color: #fff; }
.al-vistas i, .al-menu-vistas i { font-style: normal; font-size: .72rem; min-width: 1.3rem; padding: 0 .3rem; border-radius: 1rem; background: var(--terra); color: #fff; text-align: center; }
.al-accesos { display: flex; gap: .1rem; }
.al-accesos button { border: 0; background: none; padding: .45rem .5rem; font-size: .84rem; font-weight: 600; color: var(--texto); white-space: nowrap; }
.al-accesos button:hover { color: var(--terra); }
.al-menu { position: absolute; left: 0; right: 0; top: 100%; max-height: calc(100dvh - 5rem); overflow-y: auto; background: var(--blanco); border-bottom: 1px solid var(--linea); box-shadow: 0 24px 40px -24px rgba(41,33,30,.45); padding: .8rem 1.1rem 1.2rem; }
.al-menu-vistas { display: grid; gap: .3rem; }
.al-menu-vistas button { padding: .8rem .9rem; font-size: .98rem; }
.al-menu p { margin: 1rem 0 .35rem; font-size: .78rem; font-weight: 700; color: var(--suave); }
.al-menu-accesos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .4rem; }
.al-menu-accesos button { border: 1px solid var(--linea); background: none; border-radius: .6rem; padding: .7rem; font-weight: 600; font-size: .9rem; }
@media (min-width: 1240px) {
  .al-nav-centro { display: flex; align-items: center; justify-content: center; gap: 1rem; flex: 1 1 auto; }
  .al-nav-menu { display: none; }
}

/* secciones */
.al-seccion { padding-block: clamp(3rem, 7vw, 5.5rem); scroll-margin-top: 6rem; }
.al-arena { background: var(--arena); }
.al-titulo { max-width: 40rem; margin-bottom: 2rem; }
.al-titulo p { margin-top: .6rem; font-size: 1.04rem; }

/* portada */
.al-portada { padding-block: 1.6rem 3rem; }
.al-portada-rejilla { display: grid; gap: 2rem; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 940px) { .al-portada { padding-block: 2.6rem 4rem; } .al-portada-rejilla { grid-template-columns: minmax(0, 1.12fr) minmax(0, .88fr); gap: 3.5rem; align-items: center; } }
.al-sucursal-selector { display: inline-flex; flex-wrap: wrap; gap: .2rem; padding: .22rem; border: 1px solid var(--linea); background: var(--blanco); border-radius: .75rem; }
.al-sucursal-selector button { display: inline-flex; align-items: center; gap: .35rem; border: 0; background: none; border-radius: .55rem; padding: .5rem .95rem; font-weight: 700; font-size: .9rem; }
.al-sucursal-selector button[aria-checked="true"] { background: var(--espresso); color: #fff; }
.al .al-portada h1 { margin-top: 1.3rem; font-size: clamp(2rem, 4.4vw, 3.35rem); }
.al-portada h1 em { display: block; margin-top: .8rem; font-size: .56em; font-weight: 500; line-height: 1.35; color: var(--terra); }
.al-portada-botones { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.7rem; }
@media (max-width: 520px) { .al-portada-botones .al-btn { width: 100%; } }
.al-metricas { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 10.5rem), 1fr)); gap: 1rem; margin-top: 2rem; padding-top: 1.4rem; border-top: 1px solid var(--linea); }
@media (min-width: 560px) { .al-metricas { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.al-metricas dt { font-family: var(--titulo); font-size: 1.18rem; font-weight: 600; color: var(--espresso); }
.al-metricas dd { font-size: .86rem; color: var(--suave); line-height: 1.45; }
.al-portada-foto { margin: 0; }
.al-portada-foto .al-foto { aspect-ratio: 5 / 4; border-radius: 1rem 1rem 0 0; }
@media (min-width: 940px) { .al-portada-foto .al-foto { aspect-ratio: 5 / 5.2; } }
.al-portada-foto figcaption { background: var(--blanco); border: 1px solid var(--linea); border-top: 0; border-radius: 0 0 1rem 1rem; padding: .95rem 1.15rem; font-size: .9rem; }
.al-portada-foto figcaption b { color: var(--espresso); }
.al-portada-foto figcaption .al-abierta, .al-portada-foto figcaption .al-cerrada { font-weight: 800; color: var(--verde); }
.al-portada-foto figcaption .al-cerrada { color: var(--terra); }

/* compromisos */
.al-compromisos { list-style: none; padding: 0; display: grid; gap: 1.1rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr)); }
.al-compromisos li { display: flex; flex-direction: column; gap: .75rem; background: var(--blanco); border-radius: 1rem; padding: 1.5rem; border: 1px solid var(--linea); }
.al-compromiso-cabeza { display: flex; align-items: center; justify-content: space-between; }
.al-icono { display: grid; place-items: center; width: 2.9rem; height: 2.9rem; border-radius: .75rem; background: var(--arena); color: var(--terra); }
.al-numero { font-family: var(--titulo); font-size: 1.6rem; color: #C9B9AC; }
.al-sello { display: flex; align-items: center; gap: .45rem; margin-top: auto; padding-top: .8rem; border-top: 1px solid var(--linea); font-size: .84rem; font-weight: 700; color: var(--verde); }
.al-sello svg { flex: 0 0 auto; }

/* opciones en tarjeta (diagnóstico y reserva) */
.al-opciones { display: grid; gap: .6rem; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 520px) { .al-opciones.al-dos { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 720px) { .al-diag .al-opciones.al-tres { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 960px) and (max-width: 1099px) { .al-diag .al-opciones.al-tres { grid-template-columns: minmax(0, 1fr); } }
.al-opcion { position: relative; display: block; cursor: pointer; }
.al .al-opcion input { position: absolute; opacity: 0; width: 1px; height: 1px; padding: 0; }
.al-opcion > span { display: flex; flex-direction: column; gap: .25rem; height: 100%; justify-content: center; background: var(--blanco); border: 1px solid #D6CBC1; border-radius: .75rem; padding: .85rem 1rem; transition: border-color .15s, box-shadow .15s; }
.al-opcion b { color: var(--espresso); font-size: .94rem; line-height: 1.35; }
.al-opcion small { font-size: .8rem; color: var(--suave); line-height: 1.4; }
.al-opcion input:checked + span { border-color: var(--terra); box-shadow: inset 0 0 0 1px var(--terra); background: #FDF7F5; }
.al-opcion input:focus-visible + span { outline: 3px solid var(--terra); outline-offset: 2px; }

/* diagnóstico */
.al-diag { display: grid; gap: 1.6rem; grid-template-columns: minmax(0, 1fr); align-items: start; }
@media (min-width: 960px) { .al-diag { grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 2.4rem; } }
.al-diag-preguntas { display: grid; gap: 1.6rem; }
.al-resultado { background: var(--espresso); color: #E7DDD6; border-radius: 1rem; padding: clamp(1.3rem, 3vw, 2rem); display: grid; gap: .95rem; }
.al .al-resultado h3 { color: #fff; font-size: 1.65rem; }
.al-resultado-sobre { font-size: .82rem; font-weight: 700; color: #E3B3A5; margin-bottom: -.5rem; }
.al-resultado dl { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr)); gap: .8rem; }
.al-resultado dl div { border: 1px solid rgba(255,255,255,.16); border-radius: .75rem; padding: .75rem .9rem; }
.al-resultado dt { font-size: .76rem; color: #C9BAB1; }
.al-resultado dd { font-size: 1.22rem; font-weight: 800; color: #fff; }
.al-resultado-antes { display: flex; gap: .5rem; font-size: .9rem; color: #fff; }
.al-resultado-antes svg { flex: 0 0 auto; margin-top: .22rem; color: #E3B3A5; }
.al-resultado-servicios { font-size: .86rem; color: #C9BAB1; }
.al-resultado-nota { font-size: .8rem; color: #C9BAB1; text-align: center; }

/* píldoras */
.al-pildoras { display: flex; flex-wrap: wrap; gap: .45rem; margin-bottom: 1.5rem; }
.al-pildoras button { display: inline-flex; align-items: center; gap: .4rem; border: 1px solid #CDBFB3; background: var(--blanco); border-radius: 2rem; padding: .5rem 1rem; font-weight: 700; font-size: .87rem; }
.al-pildoras button[aria-pressed="true"] { background: var(--espresso); border-color: var(--espresso); color: #fff; }
.al-pildoras i { font-style: normal; font-size: .75rem; opacity: .7; }

/* catálogo */
.al-catalogo { list-style: none; padding: 0; display: grid; gap: 1.1rem; grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr)); }
.al-ficha { display: flex; flex-direction: column; background: var(--blanco); border: 1px solid var(--linea); border-radius: 1rem; overflow: hidden; }
.al-ficha.al-puesta { border-color: var(--terra); box-shadow: 0 0 0 1px var(--terra); }
.al-ficha .al-foto { aspect-ratio: 7 / 5; }
.al-ficha-cuerpo { display: flex; flex-direction: column; gap: .5rem; flex: 1; padding: 1.1rem; }
.al-ficha-cat { font-size: .76rem; font-weight: 700; color: var(--terra); }
.al .al-ficha h3 { font-size: 1.14rem; }
.al-ficha-detalle { font-size: .87rem; color: var(--suave); }
.al-ficha-datos { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .4rem; margin-top: auto; padding-block: .55rem .25rem; font-size: .86rem; }
.al-ficha-datos span { display: inline-flex; align-items: center; gap: .35rem; }
.al-ficha-datos b { font-size: 1.12rem; color: var(--espresso); }
.al-ficha-datos small { font-size: .76rem; font-weight: 600; color: var(--suave); }
.al-hueso { display: block; height: .85rem; border-radius: .4rem; background: linear-gradient(90deg, #EDE7E1 25%, #F7F4F1 50%, #EDE7E1 75%); background-size: 200% 100%; animation: al-brillo 1s linear infinite; }
.al-hueso-foto { aspect-ratio: 7 / 5; height: auto; border-radius: 0; }
.al-hueso-boton { height: 2.75rem; margin-top: .6rem; }
@keyframes al-brillo { to { background-position: -200% 0; } }

/* sucursales */
.al-sucursales { display: grid; gap: 1.3rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr)); }
.al-sucursales article { display: flex; flex-direction: column; background: var(--blanco); border: 1px solid var(--linea); border-radius: 1rem; overflow: hidden; }
.al-sucursales .al-foto { aspect-ratio: 16 / 9; }
.al-sucursal-cuerpo { display: flex; flex-direction: column; gap: .5rem; flex: 1; padding: 1.35rem; }
.al-sucursal-cuerpo dl { margin-block: .4rem; border-block: 1px solid var(--linea); padding-block: .6rem; font-size: .9rem; }
.al-sucursal-cuerpo dl div { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .25rem 1rem; }
.al-sucursal-cuerpo dd { font-weight: 700; color: var(--espresso); }
.al-sucursal-cuerpo ul { list-style: none; padding: 0; font-size: .86rem; color: var(--suave); }
.al-sucursal-cuerpo li b { color: var(--espresso); }
.al-sucursal-botones { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: auto; padding-top: .8rem; }
.al-sucursal-botones > * { flex: 1 1 11rem; }

/* barra flotante de la cita */
.al-con-dock { padding-bottom: 12rem; background: var(--espresso); }
@media (min-width: 860px) { .al-con-dock { padding-bottom: 7rem; } }
.al-dock { position: fixed; z-index: 35; left: .6rem; right: .6rem; bottom: calc(.6rem + env(safe-area-inset-bottom)); max-width: 62rem; margin-inline: auto; display: grid; grid-template-columns: minmax(0, 1fr); gap: .6rem; background: var(--espresso); color: #E7DDD6; border: 1px solid rgba(255,255,255,.14); border-radius: 1rem; padding: .8rem .9rem; box-shadow: 0 24px 50px -18px rgba(0,0,0,.55); animation: al-sube .35s cubic-bezier(.2,.8,.2,1); }
@keyframes al-sube { from { transform: translateY(1.5rem); opacity: 0; } }
.al-dock-resumen { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 .7rem; padding-right: 2.2rem; }
.al-dock-resumen b { font-size: 1.4rem; font-weight: 800; color: #fff; }
.al-dock-resumen > span { font-size: .85rem; font-weight: 600; }
.al-dock-resumen small { width: 100%; font-size: .76rem; color: #C9BAB1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
@media (max-width: 520px) { .al-dock-resumen small { display: none; } }
.al-dock-vaciar { position: absolute; top: .6rem; right: .6rem; display: grid; place-items: center; width: 2rem; height: 2rem; border-radius: .5rem; border: 0; background: rgba(255,255,255,.1); }
.al .al-dock-vaciar { color: #fff; }
.al-dock-suc { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .2rem; padding: .2rem; border-radius: .65rem; background: rgba(255,255,255,.09); }
.al-dock-suc button { border: 0; background: none; border-radius: .5rem; padding: .42rem .7rem; font-size: .82rem; font-weight: 700; white-space: nowrap; }
.al .al-dock-suc button { color: #E7DDD6; }
.al .al-dock-suc button[aria-checked="true"] { background: var(--alabastro); color: var(--espresso); }
@media (min-width: 860px) { .al-dock { grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; padding-right: 3.2rem; } .al-dock-resumen { padding-right: 0; } .al-dock-vaciar { top: 50%; transform: translateY(-50%); } }

/* hoja de reserva */
.al-hoja { margin: 0 0 0 auto; padding: 0; border: 0; width: min(34rem, 100vw); max-width: 100vw; height: 100dvh; max-height: 100dvh; background: var(--alabastro); color: var(--texto); overflow-y: auto; overscroll-behavior: contain; }
.al-hoja::backdrop { background: rgba(41,33,30,.55); }
.al-hoja[open] { animation: al-entra .35s cubic-bezier(.2,.8,.2,1); }
@keyframes al-entra { from { transform: translateX(2rem); opacity: 0; } }
.al-hoja-caja { min-height: 100%; display: flex; flex-direction: column; }
.al-hoja-cabeza { position: sticky; top: 0; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .9rem 1.2rem; background: var(--blanco); border-bottom: 1px solid var(--linea); }
.al .al-hoja-cabeza h2 { font-size: 1.35rem; }
.al-hoja-cabeza button { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; border-radius: .6rem; border: 1px solid var(--linea); background: none; }
.al-hoja-cuerpo { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.4rem; padding: 1.2rem; align-content: start; }
.al-chips { display: flex; flex-wrap: wrap; gap: .4rem; }
.al-chips button { display: inline-flex; align-items: center; gap: .35rem; text-align: left; border: 1px solid #D6CBC1; background: var(--blanco); border-radius: .6rem; padding: .45rem .7rem; font-size: .83rem; font-weight: 600; }
.al-chips small { color: var(--suave); font-size: .76rem; }
.al-chips button[aria-pressed="true"] { background: var(--espresso); border-color: var(--espresso); color: #fff; }
.al-chips button[aria-pressed="true"] small { color: #D9CCC4; }
.al-segmentos { display: flex; flex-wrap: wrap; gap: .45rem; }
.al-segmentos label { flex: 1 1 6.5rem; position: relative; cursor: pointer; }
.al .al-segmentos input { position: absolute; opacity: 0; width: 1px; height: 1px; padding: 0; }
.al-segmentos span { display: block; height: 100%; text-align: center; border: 1px solid #D6CBC1; background: var(--blanco); border-radius: .6rem; padding: .55rem .6rem; font-weight: 700; font-size: .85rem; }
.al-segmentos input:checked + span { background: var(--espresso); border-color: var(--espresso); color: #fff; }
.al-segmentos input:focus-visible + span { outline: 3px solid var(--terra); outline-offset: 2px; }
.al-segmentos input:disabled + span { opacity: .45; cursor: not-allowed; }
.al-ayuda { margin-top: .6rem; font-size: .85rem; color: var(--verde); font-weight: 600; }
.al-dias { display: flex; gap: .4rem; overflow-x: auto; padding: .15rem .15rem .5rem; max-width: 100%; }
.al-dias button { flex: 0 0 3.7rem; display: flex; flex-direction: column; align-items: center; line-height: 1.25; border: 1px solid #D6CBC1; background: var(--blanco); border-radius: .65rem; padding: .5rem 0; font-size: .72rem; }
.al-dias b { font-size: 1.15rem; }
.al-dias button[aria-pressed="true"], .al-horas button[aria-pressed="true"] { background: var(--terra); border-color: var(--terra); color: #fff; }
.al-dias button:disabled { opacity: .35; }
.al-horas { display: grid; grid-template-columns: repeat(auto-fill, minmax(6.2rem, 1fr)); gap: .4rem; }
.al-horas button { border: 1px solid #D6CBC1; background: var(--blanco); border-radius: .55rem; padding: .5rem .2rem; font-size: .83rem; font-weight: 700; white-space: nowrap; }
.al-campos { display: grid; gap: .8rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr)); }
.al-campos label { display: grid; gap: .3rem; font-size: .86rem; font-weight: 700; color: var(--espresso); }
.al-hoja-pie { display: grid; gap: .6rem; border-top: 1px solid var(--linea); padding-top: 1rem; }
.al-hoja-pie p:first-child { display: flex; justify-content: space-between; gap: 1rem; font-weight: 600; }
.al-hoja-pie b { color: var(--espresso); font-size: 1.15rem; }
.al-error { color: #9B2C1F; font-weight: 700; font-size: .9rem; }
.al-vacio { background: var(--arena); border-radius: .7rem; padding: .9rem 1rem; font-size: .9rem; }
.al-listo { text-align: center; justify-items: stretch; }
.al-listo-icono { display: grid; place-items: center; width: 4rem; height: 4rem; margin-inline: auto; border-radius: 50%; background: #E4EFE8; color: var(--verde); }
.al-resumen { text-align: left; background: var(--blanco); border: 1px solid var(--linea); border-radius: .8rem; padding: .4rem 1rem; }
.al-resumen div { display: flex; justify-content: space-between; gap: 1rem; padding-block: .55rem; border-bottom: 1px solid var(--linea); font-size: .9rem; }
.al-resumen div:last-child { border: 0; }
.al-resumen dt { color: var(--suave); flex: 0 0 auto; }
.al-resumen dd { text-align: right; font-weight: 700; color: var(--espresso); }
.al-listo-botones { display: flex; flex-wrap: wrap; gap: .6rem; }
.al-listo-botones > * { flex: 1 1 11rem; }

/* encabezado de expediente y panel */
.al-interior { padding-block: 1.8rem 4rem; }
.al-cabeza { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
.al .al-cabeza h1 { font-size: clamp(1.7rem, 4vw, 2.5rem); }
.al-cabeza label { display: grid; gap: .3rem; font-size: .8rem; font-weight: 700; color: var(--suave); width: min(100%, 18rem); }
.al-tarjeta { background: var(--blanco); border: 1px solid var(--linea); border-radius: 1rem; padding: 1.25rem; }
.al .al-tarjeta h2 { font-size: 1.3rem; margin-bottom: .8rem; }

/* expediente */
.al-exp { display: grid; gap: 1.2rem; grid-template-columns: minmax(0, 1fr); align-items: start; }
@media (min-width: 980px) { .al-exp { grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); } }
.al-columna { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.2rem; }
.al-retoque { display: flex; flex-wrap: wrap; align-items: center; gap: 1.2rem; }
.al-anillo { --avance: 0; flex: 0 0 auto; display: grid; place-items: center; width: 8.5rem; height: 8.5rem; border-radius: 50%; background: conic-gradient(var(--terra) calc(var(--avance) * 1%), var(--arena) 0); }
.al-anillo > span { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 6.9rem; height: 6.9rem; border-radius: 50%; background: var(--blanco); line-height: 1.15; text-align: center; }
.al-anillo b { font-size: 2.1rem; font-weight: 800; color: var(--espresso); }
.al-anillo small { font-size: .72rem; color: var(--suave); }
.al-retoque > div:last-child { flex: 1 1 10rem; display: grid; gap: .35rem; font-size: .9rem; }
.al-proximas { list-style: none; padding: 0; display: grid; gap: .9rem; }
.al-proximas li { display: grid; gap: .55rem; border: 1px solid var(--linea); border-radius: .8rem; padding: .95rem; }
.al-fila { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .4rem .8rem; }
.al-fila b { color: var(--espresso); }
.al-acciones { display: flex; flex-wrap: wrap; gap: .45rem; }
.al-acciones .al-btn { flex: 1 1 8rem; min-height: 2.5rem; font-size: .84rem; padding: .45rem .7rem; }
.al-estado { display: inline-block; border-radius: 2rem; padding: .18rem .7rem; font-size: .74rem; font-weight: 800; white-space: nowrap; }
.al-estado[data-estado="por-confirmar"] { background: #FBEBD3; color: #7A4B0B; }
.al-estado[data-estado="confirmada"] { background: #E3ECF3; color: #274A66; }
.al-estado[data-estado="en-sillon"] { background: var(--terra); color: #fff; }
.al-estado[data-estado="completada"] { background: #E1EEE6; color: #2D5B41; }
.al-datos-clienta { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr)); gap: .8rem; font-size: .9rem; }
.al-datos-clienta dt { font-size: .76rem; color: var(--suave); }
.al-datos-clienta dd { font-weight: 700; color: var(--espresso); line-height: 1.45; }
.al-formulas { list-style: none; padding: 0; display: grid; gap: .9rem; }
.al-formula { display: grid; gap: .7rem; border: 1px solid var(--linea); border-radius: .85rem; padding: 1.05rem; }
.al-formula.al-vigente { border-color: var(--terra); background: #FDF9F7; }
.al-formula-mezcla { font-size: 1.12rem; font-weight: 800; color: var(--espresso); line-height: 1.4; overflow-wrap: anywhere; }
.al-formula-datos { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 8rem), 1fr)); gap: .55rem; }
.al-formula-datos div { background: var(--arena); border-radius: .6rem; padding: .5rem .7rem; }
.al-formula-datos dt { font-size: .72rem; color: var(--suave); }
.al-formula-datos dd { font-weight: 700; color: var(--espresso); font-size: .9rem; line-height: 1.4; overflow-wrap: anywhere; }
.al-porosidad { display: flex; align-items: center; gap: .45rem; }
.al-porosidad i { display: inline-flex; gap: 2px; }
.al-porosidad i span { width: .8rem; height: .38rem; border-radius: 2px; background: #D6CBC1; }
.al-porosidad i span.al-on { background: var(--terra); }
.al-reprogramar { display: grid; gap: .6rem; border-top: 1px solid var(--linea); padding-top: .7rem; }

/* panel */
.al-cifras { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; margin-bottom: 1.5rem; }
@media (min-width: 860px) { .al-cifras { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.al-cifras div { background: var(--blanco); border: 1px solid var(--linea); border-radius: .9rem; padding: .95rem 1.05rem; }
.al-cifras dt { font-size: .8rem; font-weight: 700; color: var(--suave); line-height: 1.4; }
.al-cifras dd { font-size: clamp(1.5rem, 3.4vw, 2.1rem); font-weight: 800; color: var(--espresso); line-height: 1.3; overflow-wrap: anywhere; }
.al-cifras small { display: block; font-size: .75rem; color: var(--suave); line-height: 1.4; }
.al-citas { list-style: none; padding: 0; display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(min(100%, 23rem), 1fr)); align-items: start; }
.al-cita { display: grid; grid-template-columns: minmax(0, 1fr); gap: .8rem; background: var(--blanco); border: 1px solid var(--linea); border-radius: 1rem; padding: 1.1rem; }
.al-cita.al-nueva { border-color: var(--terra); box-shadow: 0 0 0 1px var(--terra); }
.al-cita-hora { font-weight: 800; color: var(--espresso); }
.al-cita-hora small { font-weight: 600; color: var(--suave); margin-left: .45rem; }
.al .al-cita h3 { font-size: 1.18rem; }
.al-cita-detalle { font-size: .87rem; color: var(--suave); line-height: 1.5; }
.al-cita .al-segmentos span { font-size: .78rem; padding: .45rem .3rem; }
.al-cita .al-segmentos label { flex-basis: 5.4rem; }
.al-editor { border: 1px solid var(--linea); border-radius: .8rem; }
.al-editor > summary { display: flex; align-items: center; justify-content: space-between; gap: .6rem; cursor: pointer; padding: .7rem .85rem; font-weight: 700; font-size: .88rem; color: var(--espresso); list-style: none; }
.al-editor > summary::-webkit-details-marker { display: none; }
.al-editor > summary span { display: inline-flex; align-items: center; gap: .45rem; }
.al-editor > summary svg:last-child { transition: transform .2s; }
.al-editor[open] > summary svg:last-child { transform: rotate(180deg); }
.al-editor form { display: grid; grid-template-columns: minmax(0, 1fr); gap: .7rem; padding: 0 .85rem .85rem; }
.al-editor label.al-campo { display: grid; gap: .25rem; font-size: .8rem; font-weight: 700; color: var(--espresso); }
.al-dos-campos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; }
.al-aviso { display: flex; align-items: flex-start; gap: .45rem; font-size: .84rem; font-weight: 700; color: var(--verde); }
.al-aviso svg { flex: 0 0 auto; margin-top: .2rem; }
.al-enlace { border: 0; background: none; padding: 0; font-weight: 700; font-size: .84rem; text-decoration: underline; text-underline-offset: 4px; }
.al .al-enlace { color: var(--terra); }

/* pie */
.al-pie { background: #29211E; color: #C9BAB1; font-size: .9rem; padding-block: 3rem 1.6rem; }
.al-pie-rejilla { display: grid; gap: 2rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)); padding-bottom: 2rem; }
.al-pie .al-logo-nombre { color: #fff; }
.al-pie .al-logo-linea { color: #E3B3A5; }
.al .al-pie h3 { color: #fff; font-size: 1.1rem; margin-bottom: .6rem; }
.al-pie dl div { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .2rem 1rem; }
.al-pie dd { color: #fff; font-weight: 600; }
.al-pie ul { list-style: none; padding: 0; display: grid; gap: .55rem; }
.al-pie-final { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .5rem 1.5rem; border-top: 1px solid rgba(255,255,255,.14); padding-top: 1.2rem; font-size: .82rem; }
.al-pie-final a { color: #fff; font-weight: 700; text-decoration: underline; text-underline-offset: 4px; }

@media (prefers-reduced-motion: reduce) {
  .al *, .al *::before, .al *::after { animation: none !important; transition: none !important; }
}
`;
