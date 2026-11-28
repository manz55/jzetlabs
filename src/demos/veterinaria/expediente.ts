import { cambiar, nuevoId, type Clinica } from "./almacen";
import { CLIENTA, VACUNAS, diasHasta, enDias, hoyIso, sumarMeses, type Especie, type Mascota, type Vacuna } from "./datos";

export type DatosPaciente = { nombre: string; especie: Especie; raza: string; dueno: string; telefono: string };

function siguienteExpediente(mascotas: Mascota[]) {
  const ultimo = Math.max(0, ...mascotas.map((m) => Number(m.expediente.split("-").at(-1))));
  return `EXP-${hoyIso().slice(0, 4)}-${String(ultimo + 1).padStart(3, "0")}`;
}

export function fichaNueva(mascotas: Mascota[], { nombre, especie, raza, dueno, telefono }: DatosPaciente): Mascota {
  return {
    id: nuevoId("m"),
    expediente: siguienteExpediente(mascotas),
    nombre: nombre.trim().replace(/^./, (l) => l.toUpperCase()),
    especie,
    raza: raza.trim() || (especie === "perro" ? "Perro" : "Gato"),
    edad: "Paciente nuevo",
    dueno: dueno.trim(),
    telefono: telefono.trim(),
    notas: "",
    pesos: [],
    vacunas: [],
    indicaciones: [],
  };
}

export function registrarPaciente(datos: DatosPaciente, horaDeHoy: string) {
  let nueva!: Mascota;
  cambiar((c) => {
    nueva = fichaNueva(c.mascotas, datos);
    return {
      ...c,
      mascotas: [...c.mascotas, nueva],
      citas: horaDeHoy ? [...c.citas, { id: nuevoId("c"), mascotaId: nueva.id, servicio: "consulta", fecha: hoyIso(), hora: horaDeHoy, estado: "espera" }] : c.citas,
    };
  });
  return nueva;
}

export type MascotaPropia = { nombre: string; especie: Especie; raza: string; edad: string; kg: number | null; notas: string };

export function agregarMascota({ nombre, especie, raza, edad, kg, notas }: MascotaPropia) {
  let nueva!: Mascota;
  cambiar((c) => {
    nueva = {
      ...fichaNueva(c.mascotas, { nombre, especie, raza, dueno: CLIENTA.nombre, telefono: CLIENTA.telefono }),
      edad: edad.trim() || "Paciente nuevo",
      notas: notas.trim(),
      pesos: kg ? [{ fecha: hoyIso(), kg }] : [],
    };
    return { ...c, mascotas: [...c.mascotas, nueva] };
  });
  return nueva;
}

function editarMascota(mascotaId: string, editar: (m: Mascota) => Mascota) {
  cambiar((c) => ({ ...c, mascotas: c.mascotas.map((m) => (m.id === mascotaId ? editar(m) : m)) }));
}

export const guardarNotas = (mascotaId: string, notas: string) => editarMascota(mascotaId, (m) => ({ ...m, notas: notas.trim() }));
export const elegirAlimento = (mascotaId: string, alimento: string) => editarMascota(mascotaId, (m) => ({ ...m, alimento }));

export type RegistroClinico = {
  medico: string;
  kg: number | null;
  vacuna?: string;
  indicacion?: { medicamento: string; dosis: string; dias: number; cuidados: string };
};

export function registrarClinico(mascotaId: string, { medico, kg, vacuna, indicacion }: RegistroClinico) {
  const hoy = hoyIso();
  editarMascota(mascotaId, (m) => {
    const meses = VACUNAS[m.especie].find((v) => v.nombre === vacuna)?.meses ?? 12;
    return {
      ...m,
      pesos: kg ? [...m.pesos.filter((p) => p.fecha !== hoy), { fecha: hoy, kg }] : m.pesos,
      vacunas: vacuna ? [{ id: nuevoId("v"), nombre: vacuna, medico, aplicada: hoy, proxima: sumarMeses(hoy, meses) }, ...m.vacunas] : m.vacunas,
      indicaciones: indicacion
        ? [
            {
              id: nuevoId("i"),
              fecha: hoy,
              hasta: enDias(indicacion.dias),
              medico,
              medicamento: indicacion.medicamento.trim(),
              dosis: indicacion.dosis.trim(),
              cuidados: indicacion.cuidados.trim(),
            },
            ...m.indicaciones,
          ]
        : m.indicaciones,
    };
  });
}

export function ultimasAplicaciones(mascota: Mascota) {
  const porNombre = new Map<string, Vacuna>();
  mascota.vacunas.forEach((v) => {
    const actual = porNombre.get(v.nombre);
    if (!actual || v.proxima > actual.proxima) porNombre.set(v.nombre, v);
  });
  return [...porNombre.values()].sort((a, b) => a.proxima.localeCompare(b.proxima));
}

export type Recordatorio = { clave: string; mascota: Mascota; vacuna: string; proxima: string; enviado: boolean };

export function vacunasPorVencer(c: Clinica): Recordatorio[] {
  return c.mascotas
    .flatMap((mascota) =>
      ultimasAplicaciones(mascota)
        .filter((v) => diasHasta(v.proxima) >= 0 && diasHasta(v.proxima) <= 7)
        .map((v) => {
          const clave = `${mascota.id}|${v.nombre}`;
          return { clave, mascota, vacuna: v.nombre, proxima: v.proxima, enviado: c.recordados.includes(clave) };
        }),
    )
    .sort((a, b) => a.proxima.localeCompare(b.proxima));
}

export function marcarRecordados(claves: string[]) {
  cambiar((c) => ({ ...c, recordados: [...new Set([...c.recordados, ...claves])] }));
}
