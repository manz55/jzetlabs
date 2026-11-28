import { CLIENTA, FOTOS, MEDICOS, enDias, hoyIso, sumarMeses, type Cita, type Especie, type Estado, type Mascota, type Pedido, type Peso, type ServicioId, type Vacuna } from "./datos";

function vacuna(nombre: string, proximaEn: number, meses: number, medico = MEDICOS[0].nombre): Vacuna {
  const proxima = enDias(proximaEn);
  return { id: `${nombre}-${proximaEn}`, nombre, proxima, aplicada: sumarMeses(proxima, -meses), medico };
}

const pesos = (...kilos: number[]): Peso[] => kilos.map((kg, i) => ({ kg, fecha: sumarMeses(hoyIso(), -3 * (kilos.length - i)) }));

function paciente(id: string, numero: string, nombre: string, especie: Especie, raza: string, edad: string, dueno: string, telefono: string, foto: string, kg: number, vacunas: Vacuna[], notas = ""): Mascota {
  return { id, expediente: `EXP-2026-${numero}`, nombre, especie, raza, edad, dueno, telefono, foto, notas, pesos: pesos(kg), vacunas, indicaciones: [] };
}

export function mascotasIniciales(): Mascota[] {
  return [
    {
      id: "max",
      nombre: "Max",
      especie: "perro",
      raza: "Golden Retriever",
      edad: "4 años",
      dueno: CLIENTA.nombre,
      telefono: CLIENTA.telefono,
      foto: FOTOS.max,
      expediente: "EXP-2026-084",
      notas: "Alérgico a la picadura de pulga.",
      alimento: "proplan",
      indicaciones: [
        {
          id: "i-max",
          fecha: enDias(-3),
          hasta: enDias(4),
          medico: MEDICOS[1].nombre,
          medicamento: "Gotas óticas antibióticas",
          dosis: "5 gotas en el oído izquierdo cada 12 horas",
          cuidados: "No mojar los oídos durante el baño.",
        },
      ],
      pesos: pesos(29.4, 30.8, 31.6, 31.2),
      vacunas: [
        vacuna("Séxtuple canina", 142, 12),
        vacuna("Antirrábica", 96, 12, MEDICOS[1].nombre),
        vacuna("Bordetella", 58, 12),
        vacuna("Desparasitación interna", 24, 3, MEDICOS[1].nombre),
      ],
    },
    {
      id: "luna",
      nombre: "Luna",
      especie: "gato",
      raza: "Gato Criollo",
      edad: "2 años",
      dueno: CLIENTA.nombre,
      telefono: CLIENTA.telefono,
      foto: FOTOS.luna,
      expediente: "EXP-2026-085",
      notas: "Nerviosa con secadora.",
      alimento: "royal-indoor",
      indicaciones: [
        {
          id: "i-luna",
          fecha: enDias(-10),
          hasta: enDias(20),
          medico: MEDICOS[0].nombre,
          medicamento: "Malta para bolas de pelo",
          dosis: "2 cm una vez al día",
          cuidados: "Cepillar tres veces por semana y dejar agua fresca a la vista.",
        },
      ],
      pesos: pesos(3.6, 3.9, 4.1, 4.2),
      vacunas: [vacuna("Triple felina", 3, 12), vacuna("Antirrábica", 118, 12), vacuna("Leucemia felina", 74, 12, MEDICOS[1].nombre), vacuna("Desparasitación interna", 41, 3)],
    },
    paciente("rocky", "031", "Rocky", "perro", "Bóxer", "5 años", "Carlos Méndez", "4478 1203", "1442605527737-ed62b867591f", 28.5, [vacuna("Séxtuple canina", 210, 12)]),
    paciente("mia", "038", "Mía", "gato", "Siamés", "1 año", "Gabriela Soto", "5901 6624", "1568152950566-c1bf43f4ab28", 3.4, [vacuna("Triple felina", 365, 12)]),
    paciente("bruno", "042", "Bruno", "perro", "Schnauzer miniatura", "3 años", "Luis Paiz", "3015 7789", "1579698374511-6017bd6db7f2", 8.2, [vacuna("Antirrábica", 190, 12)]),
    paciente("kira", "047", "Kira", "perro", "Pastor Alemán", "6 años", "Mónica Arriola", "5236 4410", "1625321483581-e4b662b8abf1", 33.1, [vacuna("Bordetella", 87, 12)]),
    paciente("coco", "052", "Coco", "perro", "French Poodle", "7 años", "Silvia de León", "4152 0937", "1772437883387-8076cf660c65", 6.8, [vacuna("Antirrábica", 5, 12)], "Muerde si le tocan las patas."),
    paciente("simon", "056", "Simón", "gato", "Persa", "8 años", "Jorge Batres", "5788 2146", "1733783506192-653df6185a7d", 5.1, [vacuna("Triple felina", 132, 12)]),
    paciente("nala", "063", "Nala", "gato", "Gato Criollo", "3 años", "Paola Estrada", "3390 5528", "1719305406153-b0d36aa305ac", 4.4, [vacuna("Triple felina", 6, 12)]),
    paciente("toby", "070", "Toby", "perro", "Cocker Spaniel", "4 años", "Ricardo Alvarado", "4620 8851", "1657088746570-0218626e8f55", 13.7, [vacuna("Séxtuple canina", 2, 12)]),
    paciente("olivia", "077", "Olivia", "perro", "Beagle", "2 años", "Fernanda Cifuentes", "5144 3072", "1685387714443-53931626d59b", 11.3, [vacuna("Séxtuple canina", 19, 12)]),
  ];
}

export function citasIniciales(): Cita[] {
  const hoy = hoyIso();
  const cita = (id: string, mascotaId: string, servicio: ServicioId, hora: string, estado: Estado, extra: Partial<Cita> = {}): Cita => ({ id, mascotaId, servicio, fecha: hoy, hora, estado, ...extra });
  return [
    cita("c1", "rocky", "consulta", "08:00", "entregada", { cobro: "Visanet" }),
    cita("c2", "mia", "consulta", "08:30", "entregada", { cobro: "Efectivo" }),
    cita("c3", "bruno", "bano-pequeno", "09:00", "entregada", { cobro: "NeoNet" }),
    cita("c4", "kira", "consulta", "09:30", "atencion", { estacion: "consultorio1" }),
    cita("c5", "coco", "bano-pequeno", "10:00", "atencion", { estacion: "grooming" }),
    cita("c6", "simon", "consulta", "10:30", "lista"),
    cita("c7", "max", "bano-grande", "11:00", "espera"),
    cita("c8", "nala", "consulta", "11:30", "espera", { solicitud: { tipo: "cambio", fecha: hoy, hora: "16:00" } }),
    cita("c9", "toby", "bano-mediano", "14:00", "espera"),
    cita("c10", "olivia", "vacuna", "15:30", "espera"),
    cita("c11", "luna", "consulta", "09:00", "espera", { fecha: enDias(3) }),
  ];
}

export function pedidosIniciales(): Pedido[] {
  return [{ id: "p1", mascotaId: "rocky", dueno: "Carlos Méndez", articulos: ["proplan"], direccion: "6a calle 3-20, Vista Hermosa I, zona 15", estado: "solicitado" }];
}
