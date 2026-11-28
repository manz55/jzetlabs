# Reglas del Proyecto — Jzet Labs Demos

## Estilo de Código y Comentarios (Estricto)
- **Cero comentarios de contexto o meta-explicaciones:** Nunca escribas comentarios encabezando archivos para describir de qué trata el proyecto, si es una demo, el origen de las imágenes o cómo funciona la arquitectura general.
- **Cero rastros de iteración:** Nunca dejes comentarios explicando cambios respecto a versiones anteriores (ej. `"es el enlace de la versión anterior"`, `"movido aquí"`, `"agregado para..."`, `"ajuste..."`).
- **Cero separadores obvios en JSX:** No escribas comentarios marcando secciones visuales evidentes como `{/* Navbar */}`, `{/* Hero */}`, `{/* Cards */}` o `{/* Footer */}`.
- **Código autoexplicativo:** No comentes líneas obvias ni bloques de CSS, constantes o estados. Usa nombres de variables, tipos y funciones tan claros que hagan innecesario comentar.
- **Excepción única:** Solo escribe comentarios técnicos muy breves cuando exista una regla de negocio no evidente, un *workaround* de librería o una expresión regular compleja.
- **Estilos limpios:** Evita agrupar clases de Tailwind en strings gigantes en `UPPER_SNAKE_CASE` dentro de componentes `.tsx`; usa clases utilitarias directas o CSS dedicado.

## Estándares Visuales y de Producto (Guatemala)
- **Logos limpios:** Prohibido dibujar SVGs complejos, rombos o barras inclinadas para logos. Usa tipografía editorial (`Playfair Display` / `Plus Jakarta Sans`) o formas geométricas mínimas en CSS puro. Iconos únicamente de `lucide-react`.
- **Números y moneda:** Usa `font-variant-numeric: tabular-nums` para precios en Quetzales (`Q`), cantidades y totales. Prohibido usar fuentes `monospace` con ceros tachados en precios o métricas.
- **Contexto real sin disclaimers:** Nunca pongas textos dentro de la interfaz diciendo que los datos son ficticios o de ejemplo (salvo la barra superior global de `Demo de Jzet Labs`). Usa bancos, métodos de pago y ubicaciones reales de Guatemala (BI, BAC, Visanet, NeoNet, zonas y municipios reales).
- **Navbar contextual:** Muestra los enlaces de ancla de la landing y el CTA principal únicamente cuando la vista activa sea la portada; ocúltalos cuando el usuario entre a vistas internas de cliente o administración.
- **Dashboards sin scroll pesado:** En vistas administrativas, usa KPIs superiores puramente informativos (no cliqueables), atajos rápidos arriba y layouts en 2 columnas (`grid-cols-1 xl:grid-cols-12`) con filtros explícitos tipo píldora.
- **Responsive y aire visual:** Usa `overflow-x-hidden`, `min-w-0` en controles dentro de flex/grid, y espaciado generoso (`p-6`, `gap-6`) para evitar textos amontonados.

## Flujo de Entrega
- Antes de cerrar cualquier tarea, actualiza el menú global de `"Ver otras demos"` si se creó una ruta nueva, verifica que `npm run build` compile sin errores, haz `commit` limpio y `git push`.
