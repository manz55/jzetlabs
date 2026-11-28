/* Reserva de cita: crea una orden real que aparece en el seguimiento y en el panel. */
import { useState, type FormEvent } from "react";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { Campo, Placa, Ventana } from "./Piezas";
import { AGENDABLES, SINTOMAS, TIPOS, agendableDe, enTaller, fechaCorta, horasDe, hoyISO, masDias, normalizarPlaca, ordenDe, primerDiaConCupo, qz, type Orden, type Taller, type Tipo } from "./datos";

const GRUPOS = ["Servicios", "Revisiones por síntoma"];

export function Cita({ taller, servicioInicial, tipo, alTipo, alCerrar, alVer }: { taller: Taller; servicioInicial: string; tipo: Tipo; alTipo: (t: Tipo) => void; alCerrar: () => void; alVer: (placa: string) => void }) {
  const [servicio, setServicio] = useState(servicioInicial);
  const [f, setF] = useState({ cliente: "", telefono: "", placa: "", vehiculo: "" });
  const [fecha, setFecha] = useState(primerDiaConCupo);
  const [hora, setHora] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [lista, setLista] = useState<Orden | null>(null);
  const horas = horasDe(fecha);
  const elegida = horas.includes(hora) ? hora : "";
  const elegido = agendableDe(servicio);
  const costo = elegido.precios[tipo];
  const escribir = (campo: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [campo]: e.target.value });

  function enviar(e: FormEvent) {
    e.preventDefault();
    const placa = normalizarPlaca(f.placa);
    const previa = placa ? ordenDe(taller.estado.ordenes, placa) : undefined;
    const err: Record<string, string> = {};
    if (f.cliente.trim().length < 3) err.cliente = "Escriba su nombre.";
    if (f.telefono.replace(/\D/g, "").length !== 8) err.telefono = "Son 8 dígitos.";
    if (!placa) err.placa = "Formato: P-123BCD.";
    else if (previa && previa.etapa < 6) err.placa = enTaller(previa) ? `Esa placa ya está en el taller (${previa.codigo}).` : `Esa placa ya tiene cita (${previa.codigo}).`;
    if (f.vehiculo.trim().length < 3) err.vehiculo = "Marca, modelo y año.";
    if (!elegida) err.hora = horas.length ? "Elija una hora." : "Ese día no hay citas.";
    setErrores(err);
    if (Object.keys(err).length) return;
    const sintoma = SINTOMAS.find((s) => `sintoma-${s.id}` === servicio);
    const falla = sintoma ? { codigo: "", titulo: `Cliente reporta: ${sintoma.nombre}`, explicacion: "" } : null;
    setLista(taller.crear({ ...f, placa, servicio: elegido.nombre, costo, cita: { fecha, hora: elegida }, falla }));
  }

  if (lista)
    return (
      <Ventana abierta alCerrar={alCerrar} titulo="Cita confirmada">
        <div className="at-confirmada">
          <CalendarCheck size={34} aria-hidden />
          <p>
            Le esperamos <b>{fechaCorta(lista.cita!.fecha)}</b> a las <b>{lista.cita!.hora}</b>.
          </p>
          <Placa valor={lista.placa} grande />
          <dl>
            <div>
              <dt>Orden</dt>
              <dd>{lista.codigo}</dd>
            </div>
            <div>
              <dt>Servicio</dt>
              <dd>{lista.servicio}</dd>
            </div>
            <div>
              <dt>Precio de referencia</dt>
              <dd>{qz(lista.costo)}</dd>
            </div>
          </dl>
          <button type="button" className="at-btn at-naranja at-lleno" onClick={() => alVer(lista.placa)}>
            Ver el seguimiento <ArrowRight size={18} aria-hidden />
          </button>
        </div>
      </Ventana>
    );

  return (
    <Ventana
      abierta
      alCerrar={alCerrar}
      titulo="Agendar servicio"
      nota="El precio final se confirma por escrito antes de empezar a trabajar."
      pie={
        <button type="submit" form="at-cita" className="at-btn at-naranja at-lleno">
          Confirmar cita · {qz(costo)}
        </button>
      }
    >
      <form id="at-cita" className="at-formulario" onSubmit={enviar} noValidate>
        <Campo nombre="Servicio" ancho>
          <select value={servicio} onChange={(e) => setServicio(e.target.value)}>
            {GRUPOS.map((g) => (
              <optgroup key={g} label={g}>
                {AGENDABLES.filter((a) => a.grupo === g).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Campo>
        <div className="at-campo at-campo-ancho">
          <span>Tipo de vehículo</span>
          <div className="at-segmentos" role="group" aria-label="Tipo de vehículo">
            {TIPOS.map((t) => (
              <button key={t.id} type="button" aria-pressed={tipo === t.id} onClick={() => alTipo(t.id)}>
                {t.nombre}
              </button>
            ))}
          </div>
        </div>
        <Campo nombre="Placa" error={errores.placa}>
          <input value={f.placa} onChange={escribir("placa")} placeholder="P-123BCD" autoCapitalize="characters" maxLength={9} />
        </Campo>
        <Campo nombre="Vehículo" error={errores.vehiculo}>
          <input value={f.vehiculo} onChange={escribir("vehiculo")} placeholder="Mazda 3 2019" maxLength={40} />
        </Campo>
        <Campo nombre="Nombre" error={errores.cliente}>
          <input value={f.cliente} onChange={escribir("cliente")} autoComplete="name" maxLength={50} />
        </Campo>
        <Campo nombre="Teléfono" error={errores.telefono}>
          <input value={f.telefono} onChange={escribir("telefono")} inputMode="tel" autoComplete="tel-national" maxLength={9} />
        </Campo>
        <Campo nombre="Día">
          <input type="date" value={fecha} min={hoyISO()} max={masDias(30)} onChange={(e) => setFecha(e.target.value)} />
        </Campo>
        <Campo nombre="Hora" error={errores.hora}>
          <select value={elegida} onChange={(e) => setHora(e.target.value)} disabled={!horas.length}>
            <option value="">{horas.length ? "Elija la hora" : "Sin horarios"}</option>
            {horas.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </Campo>
      </form>
    </Ventana>
  );
}
