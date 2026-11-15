/*
 * La demo vieja de tienda se dividió en tres páginas propias.
 * Este archivo solo manda los links viejos a la página nueva.
 */
const t = new URLSearchParams(location.search).get('tipo')
const destino = t === 'restaurante' ? '/demos/restaurante/' : t === 'tiempo' ? '/demos/tiempo-compartido/' : '/demos/ropa/'
location.replace(destino)
