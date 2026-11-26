/*
 * Contenido de "Crónica Central". El medio, las firmas y las personas citadas son inventados
 * (lo dice la banda de arriba). Las notas no atribuyen nada a funcionarios, partidos, empresas
 * ni clubes reales. Fotos de archivo de Unsplash, servidas desde su propio servidor.
 */

export type SeccionId = "nacionales" | "economia" | "tecnologia" | "deportes";
export type Vista = "portada" | SeccionId;

export const SECCIONES: { id: Vista; nombre: string; lema: string }[] = [
  { id: "portada", nombre: "Portada", lema: "" },
  { id: "nacionales", nombre: "Nacionales", lema: "Infraestructura, ciudad, departamentos y cultura." },
  { id: "economia", nombre: "Economía", lema: "Exportaciones, comercio, energía y el dinero de cada día." },
  { id: "tecnologia", nombre: "Tecnología", lema: "Software, conectividad y las herramientas que cambian el trabajo." },
  { id: "deportes", nombre: "Deportes", lema: "Competencias locales, ligas de barrio y atletismo." },
];

export const nombreSeccion = (id: SeccionId | "opinion") =>
  id === "opinion" ? "Opinión" : SECCIONES.find((s) => s.id === id)!.nombre;

export type Nota = {
  id: string;
  seccion: SeccionId | "opinion";
  antetitulo: string;
  titulo: string;
  bajada: string;
  autor: string;
  cargo: string;
  /* hace cuántos minutos se publicó, contados desde que se abre el diario */
  minutos: number;
  foto?: { id: string; alt: string; pie: string };
  cuerpo: string[];
};

export const NOTAS: Nota[] = [
  /* ---------- Nacionales ---------- */
  {
    id: "paso-elevado-ingreso-sur",
    seccion: "nacionales",
    antetitulo: "Infraestructura vial",
    titulo: "El paso elevado del ingreso sur entra en su fase final y promete acortar la fila de la mañana",
    bajada: "El montaje de las últimas vigas se hará de noche para no cerrar la ruta en horas de mayor carga. Quienes bajan desde Villa Nueva y Amatitlán serán los primeros en notar el cambio.",
    autor: "Mariana Cifuentes",
    cargo: "Redacción Nacionales",
    minutos: 14,
    foto: {
      id: "photo-1708356810007-0158dea11ddf",
      alt: "Vista aérea de varios pasos elevados que se cruzan con vehículos en circulación",
      pie: "Los cruces a distinto nivel separan el tránsito que sigue de largo del que gira.",
    },
    cuerpo: [
      "La obra que busca destrabar uno de los puntos más lentos del ingreso sur a la capital llegó a su etapa más delicada: la colocación de las vigas sobre los carriles que siguen abiertos. Los encargados del proyecto prevén trabajar entre las 22:00 y las 4:00, la franja en la que el paso de vehículos cae a su nivel más bajo, y liberar la vía antes de que arranque el movimiento de buses y transporte de carga.",
      "Hoy, un recorrido de pocos kilómetros puede tomar más de una hora en la mañana. El problema no es solo la cantidad de vehículos, sino el cruce a un mismo nivel entre quienes continúan hacia el centro y quienes buscan desviarse hacia las zonas industriales. Cada giro detiene un carril y la fila se propaga varios kilómetros hacia atrás.",
      "El diseño separa esos dos movimientos. El flujo principal pasará por arriba, mientras los giros se resolverán abajo con carriles de incorporación más largos. Ingenieros consultados advierten que el beneficio dependerá también de ordenar las paradas de bus en las salidas, porque un solo vehículo detenido fuera de lugar puede anular buena parte de la capacidad ganada.",
      "Durante las noches de montaje habrá cierres parciales señalizados y personal que guiará el paso por un carril alterno. La recomendación para transportistas es programar la salida antes de las 21:30 o después de las 4:30, y para quienes viajan en vehículo propio, revisar el estado de la ruta antes de salir de casa.",
      "Si el calendario se cumple, la estructura podría habilitarse en las primeras semanas del próximo año, una vez terminadas las pruebas de carga, la capa de rodadura y la señalización. Comerciantes del sector, que reportan menos clientes desde que empezaron los trabajos, piden que los accesos a sus locales se restablezcan en la misma entrega.",
    ],
  },
  {
    id: "reasfaltado-nocturno-pacifico",
    seccion: "nacionales",
    antetitulo: "Rutas",
    titulo: "Reasfaltado nocturno en la ruta al Pacífico dejará tres tramos con paso reducido",
    bajada: "Los trabajos avanzan por segmentos cortos para entregar la calzada antes del descanso de fin de año. Piden a los pilotos bajar la velocidad en las zonas con personal.",
    autor: "Mariana Cifuentes",
    cargo: "Redacción Nacionales",
    minutos: 75,
    foto: {
      id: "photo-1595734939818-f4e0d44957df",
      alt: "Rodillo compactador amarillo trabajando sobre asfalto nuevo",
      pie: "El asfalto se compacta en caliente, por lo que cada tramo se termina en una sola jornada.",
    },
    cuerpo: [
      "Las cuadrillas comenzaron a fresar y reponer la capa de rodadura en tres segmentos de la ruta al Pacífico que acumulaban baches, deformaciones y parches sucesivos. Para reducir el impacto, cada noche se interviene un solo carril y el tránsito circula de forma alterna por el que queda libre.",
      "El reasfaltado se programó antes de diciembre porque es el mes en que más familias viajan hacia la costa. Un tramo en mal estado no solo alarga el trayecto: también obliga a maniobras bruscas para esquivar hoyos, una de las causas frecuentes de percances en carretera abierta.",
      "El método consiste en retirar el material dañado, revisar la base y colocar mezcla nueva que debe compactarse mientras conserva temperatura. Cuando la falla está en las capas inferiores, el parche superficial dura apenas unos meses, de modo que en algunos puntos se excavará más profundo.",
      "Los horarios de paso reducido van de las 20:00 a las 5:00. Se pide respetar a los banderilleros, no rebasar en las filas y mantener distancia con el vehículo de adelante, porque la señalización provisional se mueve conforme avanza la obra.",
      "Los trabajos se suspenderán en los días de mayor movimiento por las fiestas y se retomarán en enero con los segmentos pendientes. El detalle de los cierres se actualizará cada tarde en esta sección.",
    ],
  },
  {
    id: "capital-cierre-de-ano",
    seccion: "nacionales",
    antetitulo: "Ciudad",
    titulo: "La capital se alista para diciembre: horarios extendidos, ferias de barrio y calles con paso controlado",
    bajada: "Comercios y vecinos preparan las semanas de más movimiento del año. Moverse temprano y en transporte colectivo será la diferencia en el Centro Histórico.",
    autor: "Julio Estrada",
    cargo: "Jefatura de Redacción",
    minutos: 188,
    foto: {
      id: "photo-1785353442276-851086048050",
      alt: "Panorámica de la ciudad de Guatemala con tres volcanes al fondo",
      pie: "La ciudad vista hacia el suroccidente en una mañana despejada.",
    },
    cuerpo: [
      "Con el cambio de mes llegan las luces, los puestos de temporada y también las filas. La capital entra en las semanas en que coinciden el pago de prestaciones, las vacaciones escolares y las compras de fin de año, una combinación que modifica los horarios habituales de buena parte de la ciudad.",
      "En el Centro Histórico, los comerciantes esperan cerrar más tarde los fines de semana. Las calles peatonales concentran la mayor afluencia entre las 16:00 y las 20:00, cuando se suman quienes salen del trabajo con las familias que van a ver los adornos.",
      "Los barrios, por su parte, preparan convivios, ferias pequeñas y la tradicional quema del diablo del 7 de diciembre. Organizadores recomiendan hacer fogatas solo con papel o cartón, lejos de cables y vehículos, y evitar materiales plásticos que producen humo tóxico.",
      "Para quienes deben cruzar la ciudad, la sugerencia es adelantar diligencias a la primera hora, dejar el vehículo fuera de las zonas más congestionadas y prever que los tiempos de traslado pueden duplicarse los viernes por la tarde.",
      "También conviene revisar los horarios de atención de bancos y oficinas, que suelen ajustarse en las últimas dos semanas del año, y planificar con margen cualquier trámite que no pueda esperar a enero.",
    ],
  },
  {
    id: "tejedoras-solola-exportacion",
    seccion: "nacionales",
    antetitulo: "Cultura",
    titulo: "Las tejedoras de Sololá que llevan el telar de cintura a pedidos del extranjero",
    bajada: "Un grupo de artesanas organiza turnos, controla colores y firma cada pieza para vender sin intermediarios y sin renunciar a los diseños de su comunidad.",
    autor: "Rosa Tzul",
    cargo: "Corresponsal en el altiplano",
    minutos: 305,
    foto: {
      id: "photo-1745510697761-6b0a091b78a6",
      alt: "Artesana con blusa bordada tejiendo en un telar de cintura al aire libre",
      pie: "Una pieza de tamaño mediano puede requerir varias semanas de trabajo en el telar.",
    },
    cuerpo: [
      "En el patio donde se reúnen, el sonido de la madera marca el ritmo. Cada mujer sujeta su telar a la cintura y avanza hilo por hilo una pieza que, en algunos casos, tardará semanas en estar lista. Lo que cambió en los últimos años no es la técnica, sino la manera de venderla.",
      "El grupo dejó de entregar sus tejidos a revendedores y comenzó a recibir pedidos directos. Para lograrlo tuvo que aprender a cotizar por horas de trabajo, fijar fechas de entrega realistas y documentar cada diseño con fotografías, de modo que el comprador sepa qué recibirá.",
      "El mayor reto ha sido la consistencia. Quien compra desde fuera espera que diez piezas de un mismo pedido tengan medidas y tonos parecidos. Las tejedoras resolvieron el punto comprando el hilo en un solo lote y asignando una revisora que mide cada trabajo antes de empacarlo.",
      "Cada prenda sale con una tarjeta que indica el nombre de quien la tejió y el municipio de origen. Las artesanas sostienen que ese detalle protege su autoría frente a las copias hechas en máquina y permite explicar por qué el precio no puede compararse con el de un producto industrial.",
      "El siguiente paso es formar a las más jóvenes. Varias combinan los estudios con el aprendizaje del telar y se encargan de contestar mensajes y llevar las cuentas, un relevo que las mayores ven como la mejor garantía de que el oficio continuará.",
    ],
  },
  {
    id: "mercados-altiplano-fin-de-ano",
    seccion: "nacionales",
    antetitulo: "Departamentos",
    titulo: "Mercados del altiplano amplían horarios ante la demanda de fin de año",
    bajada: "Vendedores adelantan compras de verdura, flores y hoja para tamal. El transporte desde las aldeas empieza a moverse desde la madrugada.",
    autor: "Rosa Tzul",
    cargo: "Corresponsal en el altiplano",
    minutos: 430,
    foto: {
      id: "photo-1669578718614-0dec2071ce83",
      alt: "Mercado visto desde arriba con puestos de verduras y decenas de compradores",
      pie: "Los días de plaza concentran la venta de productos que llegan de aldeas vecinas.",
    },
    cuerpo: [
      "Antes de que salga el sol, los primeros bultos ya están sobre el suelo. En los mercados del altiplano, las semanas previas a las fiestas obligan a abrir más temprano y a quedarse hasta que se vende lo último de la jornada.",
      "La demanda se concentra en productos que no admiten largas bodegas: tomate, chile, hierbas, flores y hoja para tamal. Quien compra por mayor para revender en otros municipios suele cerrar trato desde el día anterior, para asegurar volumen y precio.",
      "El clima define buena parte del resultado. Las heladas de la temporada pueden afectar las hortalizas en las zonas más altas y reducir la oferta de un día para otro, por lo que los comerciantes diversifican proveedores cuando les es posible.",
      "Las autoridades locales de mercado piden mantener libres los pasillos y las salidas de emergencia, y a los compradores, llevar billetes de baja denominación para agilizar el cambio en las horas de mayor concurrencia.",
    ],
  },
  {
    id: "lancheros-atitlan-temporada-alta",
    seccion: "nacionales",
    antetitulo: "Turismo",
    titulo: "En Atitlán, lancheros ordenan turnos y salidas para la temporada alta",
    bajada: "Los muelles esperan más visitantes entre diciembre y enero. El viento de la tarde sigue siendo la regla que nadie discute.",
    autor: "Rosa Tzul",
    cargo: "Corresponsal en el altiplano",
    minutos: 610,
    foto: {
      id: "photo-1669025467316-a1bff8696c36",
      alt: "Muelle de madera sobre el lago de Atitlán con dos volcanes al fondo",
      pie: "El lago suele estar más tranquilo durante las primeras horas del día.",
    },
    cuerpo: [
      "La temporada alta se siente primero en los muelles. Los lancheros de los pueblos de la ribera revisan motores, chalecos y turnos antes de que lleguen las semanas con más visitantes del año.",
      "La organización busca evitar dos problemas conocidos: lanchas sobrecargadas en las horas punta y viajeros varados al final de la tarde. Un orden de salida visible en cada embarcadero permite saber cuándo parte la siguiente y cuántos lugares quedan.",
      "El viento que suele levantarse después del mediodía puede complicar la travesía. Por eso se recomienda planificar los recorridos más largos por la mañana y no dejar el regreso para el último viaje.",
      "Los prestadores de servicios piden a los turistas confirmar la tarifa antes de abordar, usar el chaleco durante todo el trayecto y llevar su basura de regreso. El cuidado del lago, repiten, es la condición para que haya temporadas futuras.",
    ],
  },

  /* ---------- Economía ---------- */
  {
    id: "cosecha-cafe-trazabilidad",
    seccion: "economia",
    antetitulo: "Exportaciones",
    titulo: "Arranca la cosecha de café con compradores dispuestos a pagar más por saber de dónde viene cada saco",
    bajada: "Productores de Huehuetenango registran parcela, fecha de corte y proceso de secado. La información empieza a pesar en la mesa de negociación tanto como la taza.",
    autor: "Diego Ajpop",
    cargo: "Redacción Economía",
    minutos: 32,
    foto: {
      id: "photo-1772228616071-aa344913b93e",
      alt: "Manos de un caficultor sosteniendo un recipiente lleno de cerezas de café maduras",
      pie: "Cortar solo el fruto maduro es el primer filtro de calidad de la cosecha.",
    },
    cuerpo: [
      "Los primeros sacos de la temporada comienzan a salir de las fincas con algo más que café: llevan una ficha que identifica la parcela, el día del corte y la forma en que se secó el grano. Para un número creciente de compradores, esos datos ya no son un adorno, sino un requisito para ofrecer un precio por encima del mercado corriente.",
      "En Huehuetenango, una cooperativa de pequeños productores empezó a registrar cada entrega desde el teléfono. El sistema permite separar lotes por altura y fecha, y evita que un café de perfil sobresaliente termine mezclado con otro de calidad promedio, lo que antes ocurría con frecuencia en el beneficio.",
      "La exigencia también viene de las reglas que varios mercados de destino están adoptando para comprobar que lo que importan no proviene de tierras deforestadas. Demostrar el origen toma tiempo y orden, y los grupos que ya llevan sus registros parten con ventaja frente a quienes deben reconstruirlos al final de la cosecha.",
      "El costo no es menor. Hay que capacitar a quienes reciben el fruto, mantener los equipos cargados en zonas con señal irregular y revisar que no haya datos repetidos. Los productores consultados coinciden en que la inversión se justifica cuando el comprador firma contratos de más de una temporada.",
      "La cosecha se extenderá hasta los primeros meses del próximo año, según la altura de cada finca. El comportamiento del precio internacional seguirá marcando el ingreso de las familias, pero los lotes identificados ofrecen un margen para negociar que el café anónimo no tiene.",
    ],
  },
  {
    id: "exportadores-adelantan-embarques",
    seccion: "economia",
    antetitulo: "Comercio exterior",
    titulo: "Exportadores adelantan embarques para evitar los cuellos de botella de diciembre",
    bajada: "Reservar espacio en los barcos con semanas de anticipación y escalonar la llegada de contenedores reduce costos de espera en los puertos.",
    autor: "Diego Ajpop",
    cargo: "Redacción Economía",
    minutos: 121,
    foto: {
      id: "photo-1578575437130-527eed3abbec",
      alt: "Buque de carga con contenedores atracado junto a grúas de un puerto",
      pie: "Cada hora de espera de un contenedor se refleja en el costo final del envío.",
    },
    cuerpo: [
      "Diciembre combina días de asueto, personal reducido y un aumento de carga que presiona los puertos. Para no quedar atrapadas en ese embudo, varias empresas exportadoras movieron sus calendarios y están despachando antes los pedidos que debían salir en las últimas semanas del año.",
      "La planificación empieza en la reserva de espacio con la naviera y sigue en la carretera. Un contenedor que llega demasiado pronto paga almacenaje; uno que llega tarde pierde el barco y puede esperar días hasta la siguiente salida. El punto medio exige coordinar bodega, transporte y papelería.",
      "Los productos perecederos tienen todavía menos margen. Frutas, vegetales y plantas necesitan cadena de frío sin interrupciones, por lo que cualquier atraso en la ruta se traduce en rechazo de mercadería o en descuentos al recibirla.",
      "Agentes de aduana recomiendan revisar con antelación que facturas, listas de empaque y permisos coincidan. Una diferencia pequeña entre documentos es suficiente para detener una carga completa en la revisión.",
      "Para las firmas pequeñas, que no llenan un contenedor por sí solas, la alternativa es consolidar envíos con otros exportadores. El ahorro en flete puede ser considerable, siempre que todos respeten la misma fecha límite de entrega en bodega.",
    ],
  },
  {
    id: "aguinaldo-cobro-sin-efectivo",
    seccion: "economia",
    antetitulo: "Comercio",
    titulo: "Con el aguinaldo en la puerta, los comercios apuestan por cobrar sin efectivo",
    bajada: "Tiendas de barrio suman cobro con tarjeta y transferencia antes de la quincena fuerte. La comisión sigue siendo el punto que más pesa en la decisión.",
    autor: "Ana Lucía Barrios",
    cargo: "Redacción Economía",
    minutos: 240,
    foto: {
      id: "photo-1556740720-776b84291f8e",
      alt: "Persona entregando una terminal de cobro a un cliente sobre una mesa",
      pie: "Las terminales portátiles permiten cobrar en la mesa o en la puerta.",
    },
    cuerpo: [
      "La primera quincena de diciembre concentra el pago del aguinaldo y, con él, las ventas más altas del año para miles de pequeños negocios. Muchos quieren llegar a esas fechas con más de una forma de cobrar, para no perder al cliente que no carga efectivo.",
      "La transferencia desde el teléfono ganó terreno por su sencillez, aunque exige un cuidado básico: confirmar que el dinero entró a la cuenta antes de entregar el producto. Una captura de pantalla no es comprobante suficiente y puede alterarse con facilidad.",
      "Las terminales de tarjeta, por su parte, cobran un porcentaje por cada venta. Los comerciantes con márgenes estrechos comparan esa comisión con lo que dejan de vender por aceptar solo billetes, y con el riesgo de guardar grandes cantidades en el local.",
      "Contadores recomiendan registrar por separado cada medio de pago y cuadrar la caja al final del día. Así, las diferencias se detectan a tiempo y la declaración de impuestos del mes se prepara sin sobresaltos.",
      "Para las familias, el consejo es apartar primero las deudas y los gastos escolares de enero, y definir un monto fijo para regalos antes de salir de compras.",
    ],
  },
  {
    id: "energia-solar-techos-fincas",
    seccion: "economia",
    antetitulo: "Energía",
    titulo: "La energía solar gana espacio en techos y fincas, pero las cuentas se hacen caso por caso",
    bajada: "Negocios con alto consumo diurno son los que recuperan antes la inversión. Los instaladores piden desconfiar de promesas sin estudio previo.",
    autor: "Ana Lucía Barrios",
    cargo: "Redacción Economía",
    minutos: 520,
    foto: {
      id: "photo-1723133371535-1412bc2e412e",
      alt: "Vista aérea de hileras de paneles solares separadas por franjas de césped",
      pie: "La orientación y la sombra determinan cuánto produce cada panel.",
    },
    cuerpo: [
      "Panaderías, talleres, hoteles y fincas con sistemas de bombeo están entre los interesados en producir parte de su propia electricidad. El atractivo es claro cuando la mayor parte del consumo ocurre mientras hay sol.",
      "Antes de comprar, el primer paso es revisar los recibos de al menos un año. Con ese historial se calcula el tamaño del sistema; instalar de más alarga el plazo de recuperación, e instalar de menos deja el ahorro por debajo de lo esperado.",
      "El techo también importa. Las láminas en mal estado, la sombra de árboles o edificios vecinos y una mala inclinación pueden reducir la producción. Un instalador serio visita el lugar y entrega por escrito la generación estimada.",
      "Conviene preguntar por la garantía de los paneles y del inversor, que suele tener una vida útil más corta, así como por el mantenimiento y la limpieza en zonas con polvo o ceniza volcánica.",
      "La recomendación de los especialistas es comparar al menos tres propuestas con los mismos supuestos. El precio más bajo no siempre es el más barato cuando se calcula lo que el sistema producirá durante toda su vida.",
    ],
  },

  /* ---------- Tecnología ---------- */
  {
    id: "software-servicios-exterior",
    seccion: "tecnologia",
    antetitulo: "Industria digital",
    titulo: "Equipos guatemaltecos de software venden al extranjero sin salir del país",
    bajada: "El idioma y la coincidencia de horario abren puertas. Retener al personal con experiencia es el desafío que más se repite entre las empresas pequeñas.",
    autor: "Sofía Arriola",
    cargo: "Redacción Tecnología",
    minutos: 51,
    foto: {
      id: "photo-1549692520-acc6669e2f0c",
      alt: "Programador trabajando con código en la pantalla dentro de una oficina",
      pie: "Buena parte del trabajo se coordina en vivo con clientes de otros países.",
    },
    cuerpo: [
      "Un equipo de ocho personas en la zona 10 mantiene las aplicaciones de clientes que nunca ha visto en persona. Las reuniones empiezan a primera hora, coinciden con la jornada de quienes contratan y terminan con entregas semanales que se revisan en pantalla compartida.",
      "Ese horario cercano al de Norteamérica es una de las ventajas que las empresas locales ponen sobre la mesa. La otra es la atención directa: en los equipos pequeños, quien escribe el código suele ser el mismo que explica los avances y recibe las correcciones.",
      "El inglés sigue siendo la barrera principal para sumar gente nueva. Varias compañías pagan clases dentro del horario laboral porque les resulta más rápido enseñar el idioma a un buen programador que formar desde cero a alguien que ya lo habla.",
      "La competencia por el talento es intensa. Los perfiles con experiencia reciben ofertas remotas desde otros países, de modo que las empresas intentan retenerlos con planes de carrera, horarios flexibles y participación en proyectos propios.",
      "Quienes llevan más tiempo en el sector aconsejan a los equipos que empiezan no depender de un solo cliente y poner por escrito el alcance, los plazos y la forma de pago antes de escribir la primera línea.",
    ],
  },
  {
    id: "estafas-mensajes-compras",
    seccion: "tecnologia",
    antetitulo: "Seguridad digital",
    titulo: "Compras de temporada: cómo revisar un enlace antes de pagar desde el teléfono",
    bajada: "Premios que nadie pidió, paquetes retenidos y ofertas con reloj son los ganchos más usados. Un minuto de revisión evita la mayoría de los fraudes.",
    autor: "Sofía Arriola",
    cargo: "Redacción Tecnología",
    minutos: 96,
    foto: {
      id: "photo-1556742521-9713bf272865",
      alt: "Mano sosteniendo un teléfono junto a una terminal de pago",
      pie: "Antes de pagar, confirme el nombre del comercio y el monto en la pantalla.",
    },
    cuerpo: [
      "El mensaje llega con urgencia: un paquete está detenido y basta pagar una pequeña cantidad para liberarlo. El enlace lleva a una página que se parece a la de una empresa conocida y pide los datos de la tarjeta. Es uno de los engaños que más circula cuando aumentan las compras en línea.",
      "La primera defensa es mirar la dirección completa. Letras cambiadas, palabras añadidas o terminaciones poco comunes delatan una copia. Ante la duda, lo más seguro es cerrar el mensaje y entrar al sitio escribiendo la dirección a mano o desde la aplicación oficial.",
      "Ningún banco necesita que el cliente le envíe por mensaje su clave o el código que acaba de recibir. Ese código autoriza operaciones; entregarlo equivale a entregar la llave de la cuenta, aunque quien lo pida diga estar evitando un fraude.",
      "Conviene activar las notificaciones de consumo, usar una contraseña distinta para cada servicio importante y encender la verificación en dos pasos en la aplicación de mensajería. Si alguien toma control del número, los contactos son los siguientes en la lista.",
      "En caso de haber entregado datos, hay que bloquear la tarjeta de inmediato, cambiar las contraseñas desde otro equipo y conservar capturas del mensaje para presentar la denuncia.",
    ],
  },
  {
    id: "cooperativas-registro-celular",
    seccion: "tecnologia",
    antetitulo: "Campo y datos",
    titulo: "Del cuaderno al teléfono: cooperativas prueban registrar la cosecha aun sin señal",
    bajada: "Las aplicaciones guardan la información en el equipo y la envían cuando hay conexión. La clave, dicen los usuarios, es que anotar tome segundos.",
    autor: "Sofía Arriola",
    cargo: "Redacción Tecnología",
    minutos: 355,
    foto: {
      id: "photo-1790492486327-604fe28ed113",
      alt: "Caficultora con sombrero cortando cerezas de café en un cafetal",
      pie: "El registro se hace al momento de entregar el fruto, no días después.",
    },
    cuerpo: [
      "Durante años, el peso de cada entrega se anotó en cuadernos que luego alguien transcribía por la noche. Los errores aparecían semanas después, cuando era difícil recordar quién había llevado qué y a qué hora.",
      "Algunas cooperativas comenzaron a reemplazar ese proceso por aplicaciones sencillas instaladas en un teléfono. El encargado selecciona al productor, anota el peso y toma una fotografía si hace falta. Todo queda guardado en el equipo aunque no haya señal.",
      "Cuando el teléfono vuelve a conectarse, los datos se envían y el resumen del día queda disponible en la oficina. Eso permite programar el beneficio, calcular anticipos y responder reclamos con un registro a la vista.",
      "Las primeras versiones fallaban por pedir demasiada información. Los equipos redujeron las pantallas al mínimo, agrandaron los botones y añadieron la opción de corregir un dato dejando constancia del cambio.",
      "Los promotores recomiendan mantener el cuaderno como respaldo durante la primera temporada y designar a una persona responsable de revisar que nada quede pendiente de envío.",
    ],
  },
  {
    id: "espacios-trabajo-compartido",
    seccion: "tecnologia",
    antetitulo: "Trabajo remoto",
    titulo: "Los espacios de trabajo compartido crecen fuera de la capital",
    bajada: "Internet estable, respaldo eléctrico y compañía profesional atraen a independientes en cabeceras departamentales.",
    autor: "Julio Estrada",
    cargo: "Jefatura de Redacción",
    minutos: 700,
    foto: {
      id: "photo-1522071820081-009f0129c71c",
      alt: "Grupo de personas trabajando con computadoras portátiles en una mesa de madera",
      pie: "Compartir mesa permite repartir el costo de la conexión y del respaldo eléctrico.",
    },
    cuerpo: [
      "Diseñadores, programadores, traductores y contadores que antes trabajaban desde el comedor están encontrando escritorios por día o por mes en ciudades como Quetzaltenango y Cobán.",
      "El motivo más mencionado es la estabilidad. Una videollamada que se corta o un apagón a media entrega cuestan clientes, y contratar por cuenta propia una conexión de respaldo resulta caro para una sola persona.",
      "Estos locales también funcionan como bolsa de contactos. Quien recibe un proyecto demasiado grande suele encontrar en la mesa de al lado a alguien que cubra la parte que le falta.",
      "Antes de pagar una mensualidad, los usuarios sugieren probar un día completo, medir la velocidad en las horas de mayor ocupación, preguntar por salas para llamadas y revisar la seguridad del lugar si se saldrá de noche.",
    ],
  },

  /* ---------- Deportes ---------- */
  {
    id: "circuito-altiplano-final",
    seccion: "deportes",
    antetitulo: "Ciclismo",
    titulo: "El circuito del altiplano cierra el año con una final en subida",
    bajada: "La última fecha reunirá a categorías juveniles y mayores en un trazado de ascensos cortos que castiga los errores de ritmo.",
    autor: "Kevin Maldonado",
    cargo: "Redacción Deportes",
    minutos: 64,
    foto: {
      id: "photo-1775638946697-fb4b8bb1dc88",
      alt: "Ciclistas en competencia por una carretera con efecto de velocidad",
      pie: "Guardar fuerzas dentro del grupo será decisivo antes del ascenso final.",
    },
    cuerpo: [
      "El calendario regional llega a su última parada con la clasificación todavía abierta. La final se disputará sobre un circuito de montaña en el que los corredores deberán repetir varias veces un ascenso corto antes de buscar la meta.",
      "El formato favorece a quienes saben dosificar. Un ataque temprano puede abrir ventaja, pero la altura cobra cada exceso en las últimas vueltas, cuando el grupo suele fragmentarse.",
      "Las categorías juveniles saldrán primero, por la mañana, con un recorrido reducido. Los entrenadores consideran esta fecha una prueba de madurez, porque obliga a decidir en carrera sin depender de indicaciones desde fuera.",
      "La organización cerrará el paso de vehículos en el tramo de meta y ubicará puntos de asistencia mecánica y médica. Se pide al público no cruzar la ruta cuando se acerque la caravana y mantener sujetas a las mascotas.",
      "Al terminar la jornada se premiará a los ganadores de la etapa y del circuito completo, con un reconocimiento aparte para el equipo más constante de la temporada.",
    ],
  },
  {
    id: "ligas-barriales-canchas",
    seccion: "deportes",
    antetitulo: "Fútbol aficionado",
    titulo: "Las ligas de barrio llenan las canchas sintéticas hasta cerca de la medianoche",
    bajada: "Reglas claras, árbitros fijos y calendarios publicados explican el crecimiento de torneos que antes se organizaban de palabra.",
    autor: "Kevin Maldonado",
    cargo: "Redacción Deportes",
    minutos: 155,
    foto: {
      id: "photo-1517747614396-d21a78b850e8",
      alt: "Vista aérea de una cancha de fútbol iluminada",
      pie: "Las franjas nocturnas son las primeras en reservarse.",
    },
    cuerpo: [
      "Cuando termina la jornada laboral empieza la otra. En las canchas sintéticas de la periferia, los equipos hacen fila para su turno y las franjas de las 20:00 y las 21:00 se reservan con semanas de anticipación.",
      "Los organizadores atribuyen el auge a un cambio de método. Las ligas publican fechas, tabla de posiciones y sanciones, de modo que cada capitán sabe cuándo juega y por qué un compañero no puede alinear.",
      "El arbitraje fijo redujo las discusiones. También lo hizo la ficha de inscripción, que evita refuerzos de último momento y protege a los equipos que mantienen el mismo plantel durante todo el torneo.",
      "Preparadores físicos advierten sobre las lesiones de quienes pasan de la silla al partido sin transición. Diez minutos de calentamiento, calzado adecuado para césped sintético e hidratación reducen buena parte del riesgo.",
    ],
  },
  {
    id: "futbol-nocturno-categoria-juvenil",
    seccion: "deportes",
    antetitulo: "Formación",
    titulo: "Un torneo juvenil de Mixco apuesta por entrenar sin descuidar las notas",
    bajada: "Para jugar, los inscritos deben presentar su avance escolar. Padres y entrenadores dicen que la asistencia mejoró.",
    autor: "Paola Reyes",
    cargo: "Redacción Deportes",
    minutos: 275,
    foto: {
      id: "photo-1431324155629-1a6deb1dec8d",
      alt: "Jugadores en una cancha de fútbol iluminada durante la noche",
      pie: "Los entrenamientos se programan después de la jornada escolar.",
    },
    cuerpo: [
      "La regla es sencilla y está escrita en la hoja de inscripción: quien juega debe estudiar. El torneo reúne a equipos juveniles de colonias vecinas y pide a cada participante mostrar su avance escolar al iniciar y a la mitad de la competencia.",
      "Los entrenadores aclaran que no se trata de excluir a quien tiene dificultades. Cuando alguien baja el rendimiento, el equipo acuerda horarios de refuerzo y, en algunos casos, un compañero mayor ayuda con las tareas antes de la práctica.",
      "Las familias señalan que el compromiso se nota fuera de la cancha. Los jóvenes llegan a tiempo, cuidan los uniformes que comparten y organizan turnos para dejar limpio el lugar.",
      "El reto es sostener los gastos de iluminación, arbitraje e implementos. El comité reúne aportes de padres y pequeños negocios del sector, y publica cada mes en qué se utilizó el dinero.",
    ],
  },
  {
    id: "media-maraton-preparacion",
    seccion: "deportes",
    antetitulo: "Atletismo",
    titulo: "Primera media maratón: lo que conviene hacer en las últimas semanas",
    bajada: "Entrenadores recomiendan bajar el volumen antes de la carrera, no estrenar zapatos y practicar la hidratación.",
    autor: "Paola Reyes",
    cargo: "Redacción Deportes",
    minutos: 480,
    foto: {
      id: "photo-1613936360976-8f35cf0e5461",
      alt: "Piernas de un grupo de corredores durante una carrera en calle",
      pie: "Salir más despacio de lo que pide el entusiasmo suele dar mejores resultados.",
    },
    cuerpo: [
      "Los 21 kilómetros asustan menos cuando el último tramo de la preparación se hace con calma. En las dos semanas finales, el objetivo ya no es ganar condición, sino llegar descansado.",
      "Los entrenadores sugieren reducir de forma gradual la distancia semanal y conservar algunas salidas cortas a ritmo de carrera. Intentar recuperar entrenamientos perdidos en esos días es uno de los errores más comunes.",
      "Nada debe estrenarse el día de la prueba. Zapatos, calcetines, ropa y el desayuno tienen que haberse probado antes, igual que cualquier bebida o gel que se piense consumir en la ruta.",
      "La altura y el sol exigen atención. Conviene beber en los puestos desde la primera mitad, usar protector solar y detenerse ante mareo, dolor en el pecho o desorientación. Terminar bien importa más que el reloj.",
    ],
  },

  /* ---------- Opinión ---------- */
  {
    id: "opinion-paradas-ordenadas",
    seccion: "opinion",
    antetitulo: "Análisis",
    titulo: "Un paso elevado no arregla una parada mal puesta",
    bajada: "La obra grande se inaugura una vez; el orden de la calle se sostiene todos los días.",
    autor: "Marco Tulio Xicará",
    cargo: "Ingeniero civil y columnista",
    minutos: 560,
    cuerpo: [
      "Celebramos con razón cada estructura nueva. El concreto se ve, se mide y se corta la cinta. Menos vistoso es decidir dónde se detiene un bus, por dónde cruza un peatón o quién impide que un carril de incorporación se convierta en estacionamiento.",
      "La capacidad de una vía la define su punto más estrecho. Podemos ganar dos carriles arriba y perderlos cien metros adelante si la salida desemboca en una fila de vehículos detenidos. El conductor no distingue entre un mal diseño y una mala operación: solo ve que sigue parado.",
      "Por eso cada proyecto debería entregarse con un plan de funcionamiento tan detallado como sus planos. Paradas señalizadas y protegidas de la lluvia, banquetas continuas, horarios de carga para los comercios y una autoridad con presencia constante en las primeras semanas.",
      "Medir también es obligatorio. Tiempos de recorrido antes y después, a distintas horas, publicados para que cualquiera los revise. Si la mejora es real, los datos la defenderán mejor que cualquier discurso; si no lo es, permitirán corregir a tiempo.",
    ],
  },
  {
    id: "opinion-cafe-con-nombre",
    seccion: "opinion",
    antetitulo: "Columna",
    titulo: "El café con nombre propio vale más, pero alguien tiene que escribirlo",
    bajada: "La trazabilidad es una oportunidad si su costo no recae solo en quien siembra.",
    autor: "Gabriela Solórzano",
    cargo: "Economista",
    minutos: 800,
    cuerpo: [
      "Pedir el origen de cada saco suena razonable desde una oficina. Desde una parcela empinada y sin señal, significa horas de trabajo adicional que hoy rara vez se pagan por separado.",
      "El país tiene una ventaja que muchos envidian: regiones con perfiles reconocibles y productores que conocen su tierra. Convertir ese conocimiento en datos comprobables puede sacar al grano de la competencia por precio y llevarlo a una conversación sobre valor.",
      "Para lograrlo hacen falta herramientas comunes, capacitación y compradores que compartan la factura. Si cada exportadora exige un formato distinto, el pequeño caficultor terminará llenando cinco registros para vender una misma cosecha.",
      "La trazabilidad no debe ser un nuevo filtro que deje fuera a los más vulnerables. Bien repartida, es la mejor oportunidad en años para que el nombre de quien produce llegue hasta la taza.",
    ],
  },
  {
    id: "opinion-leer-antes-de-compartir",
    seccion: "opinion",
    antetitulo: "Opinión",
    titulo: "Leer antes de reenviar también es un deber ciudadano",
    bajada: "Treinta segundos de duda protegen a la familia más que cualquier aplicación.",
    autor: "Héctor Bámaca",
    cargo: "Docente universitario",
    minutos: 980,
    cuerpo: [
      "El grupo familiar es hoy la plaza pública más concurrida. Allí circulan avisos de emergencia, ofertas imposibles y audios sin autor que alguien reenvía por si acaso.",
      "Ese por si acaso tiene consecuencias: un comercio señalado sin pruebas, una colecta falsa, un temor que se contagia. La buena intención de quien comparte no repara el daño.",
      "La verificación no exige conocimientos especiales. Basta preguntar quién lo dice, cuándo ocurrió y si algún medio o institución responsable lo confirma. Cuando no hay respuesta, lo prudente es no mover el mensaje.",
      "Enseñar este hábito en casa y en el aula cuesta poco. Una sociedad que se toma un momento antes de reenviar discute mejor, compra con más calma y es más difícil de engañar.",
    ],
  },
];

/* tamaños de letra del lector, de menor a mayor */
export const TAMANOS = [16, 17.5, 19, 21, 23] as const;

export const porId = (id: string | null) => NOTAS.find((n) => n.id === id);
export const NOTICIAS = NOTAS.filter((n) => n.seccion !== "opinion");
export const OPINION = NOTAS.filter((n) => n.seccion === "opinion");

/* de la más reciente a la más antigua */
export const recientes = (lista: Nota[]) => [...lista].sort((a, b) => a.minutos - b.minutos);

/* Foto de Unsplash recortada a la medida que se necesita */
export const foto = (id: string, ancho: number, alto: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${ancho}&h=${alto}&q=70`;

export const lectura = (n: Nota) => Math.max(1, Math.ceil([n.bajada, ...n.cuerpo].join(" ").split(/\s+/).length / 180));

export const iniciales = (nombre: string) => nombre.split(" ").slice(0, 2).map((p) => p[0]).join("");

/* ---------- Tiempo, siempre en hora de Guatemala ---------- */
const ZONA = "America/Guatemala";
const HORA = new Intl.DateTimeFormat("es-GT", { timeZone: ZONA, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const FECHA_LARGA = new Intl.DateTimeFormat("es-GT", { timeZone: ZONA, weekday: "long", day: "numeric", month: "long", year: "numeric" });
const FECHA_CORTA = new Intl.DateTimeFormat("es-GT", { timeZone: ZONA, weekday: "short", day: "numeric", month: "short" });
const FECHA_NOTA = new Intl.DateTimeFormat("es-GT", { timeZone: ZONA, day: "numeric", month: "long", year: "numeric" });

export const instante = (abierto: number, minutos: number) => new Date(abierto - minutos * 60_000);
export const hora = (d: Date) => HORA.format(d);
export const fechaLarga = (d: Date) => {
  const t = FECHA_LARGA.format(d);
  return t.charAt(0).toUpperCase() + t.slice(1);
};
export const fechaCorta = (d: Date) => {
  const t = FECHA_CORTA.format(d).replace(/\./g, "");
  return t.charAt(0).toUpperCase() + t.slice(1);
};
export const fechaNota = (d: Date) => FECHA_NOTA.format(d);
export const anio = (d: Date) => new Intl.DateTimeFormat("es-GT", { timeZone: ZONA, year: "numeric" }).format(d);

export const hace = (minutos: number) => {
  if (minutos < 60) return `Hace ${minutos} min`;
  const h = Math.floor(minutos / 60);
  return h === 1 ? "Hace 1 hora" : `Hace ${h} horas`;
};

/* Indicadores de la franja superior */
export const CAMBIO = "Q7.66";
export const CLIMA = { ciudad: "Guatemala", grados: 21, cielo: "Parcialmente nublado" };

export const DIRECTORIO = [
  ["Dirección editorial", "Silvia Monterroso"],
  ["Jefatura de redacción", "Julio Estrada"],
  ["Nacionales", "Mariana Cifuentes"],
  ["Economía", "Diego Ajpop"],
  ["Tecnología", "Sofía Arriola"],
  ["Deportes", "Kevin Maldonado"],
] as const;
