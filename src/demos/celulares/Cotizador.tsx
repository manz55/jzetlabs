/* Cotizador transparente (equipo, falla, calidad y entrega) y agenda de ingreso en ventana. */
import { useState, type FormEvent } from "react";
import { BatteryCharging, CalendarCheck, Clock, Droplets, PlugZap, ShieldCheck, Smartphone, Store, Truck } from "lucide-react";
import { Cifra } from "./Cifra";
import { Ventana } from "./Ventana";
import { COSTO_RECOLECCION, FALLAS, MARCAS, MODELOS, falla, garantiaDe, nombreCalidad, precioCon, qz, textoTiempo, totalTaller, type Calidad, type Falla, type Marca, type Nexus } from "./datos";

const ICONOS = { pantalla: Smartphone, bateria: BatteryCharging, carga: PlugZap, humedad: Droplets };
const FRANJAS = ["09:00 a 11:00", "11:00 a 13:00", "14:00 a 16:00", "16:00 a 18:00"];
const DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

/* los próximos seis días en que abre el taller (domingo cerrado), desde mañana */
function proximosDias() {
  const dias: number[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (dias.length < 6) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) dias.push(d.getTime());
  }
  return dias;
}
/* el sábado solo se atiende por la mañana */
const franjasDe = (dia: number) => (new Date(dia).getDay() === 6 ? FRANJAS.slice(0, 2) : FRANJAS);

type Cotizacion = { modelo: string; falla: Falla; calidad: Calidad; recoleccion: boolean; precio: number; minutos: number };

function Agenda({ n, c, alListo }: { n: Nexus; c: Cotizacion; alListo: (id: string) => void }) {
  const [dias] = useState(proximosDias);
  const [dia, setDia] = useState(dias[0]);
  const [franja, setFranja] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");

  function confirmar(e: FormEvent) {
    e.preventDefault();
    if (nombre.trim().length < 2) return setError("Escribe tu nombre.");
    if (telefono.replace(/\D/g, "").length !== 8) return setError("Escribe tu teléfono de 8 dígitos.");
    if (!franja) return setError("Elige una franja horaria.");
    const r = n.agendar({
      cliente: nombre.trim(),
      telefono,
      modelo: c.modelo,
      falla: c.falla,
      calidad: c.calidad,
      recoleccion: c.recoleccion,
      precio: c.precio,
      tiempo: textoTiempo(c.minutos),
      cita: { dia, hora: franja },
    });
    alListo(r.id);
  }
  const limpiar = () => setError("");

  return (
    <form className="nx-agenda" onSubmit={confirmar} noValidate>
      <div className="nx-agenda-resumen">
        <p>
          <b>
            {falla(c.falla).nombre} · {c.modelo}
          </b>
          <small>{c.recoleccion ? "Recolección con mensajero asegurado" : "Entrega en el taller de Zona 10"}</small>
        </p>
        <strong>{qz(totalTaller(c))}</strong>
      </div>
      <label className="nx-rotulo" htmlFor="nx-agenda-nombre">
        Tu nombre
      </label>
      <input id="nx-agenda-nombre" className="nx-campo" value={nombre} autoComplete="name" maxLength={60} placeholder="Nombre y apellido" onChange={(e) => (setNombre(e.target.value), limpiar())} />
      <label className="nx-rotulo" htmlFor="nx-agenda-telefono">
        Teléfono
      </label>
      <input
        id="nx-agenda-telefono"
        className="nx-campo"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="8 dígitos"
        value={telefono}
        onChange={(e) => {
          const num = e.target.value.replace(/\D/g, "").slice(0, 8);
          setTelefono(num.length > 4 ? `${num.slice(0, 4)} ${num.slice(4)}` : num);
          limpiar();
        }}
      />
      <p className="nx-rotulo">{c.recoleccion ? "Día de recolección" : "Día de llegada"}</p>
      <div className="nx-dias" role="group" aria-label="Día">
        {dias.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={dia === t}
            onClick={() => {
              setDia(t);
              if (!franjasDe(t).includes(franja)) setFranja("");
            }}
          >
            <small>{DIAS_CORTOS[new Date(t).getDay()]}</small>
            <b>{new Date(t).getDate()}</b>
          </button>
        ))}
      </div>
      <p className="nx-rotulo">Franja horaria</p>
      <div className="nx-horas" role="group" aria-label="Franja horaria">
        {franjasDe(dia).map((h) => (
          <button key={h} type="button" aria-pressed={franja === h} onClick={() => (setFranja(h), limpiar())}>
            {h}
          </button>
        ))}
      </div>
      {error && (
        <p className="nx-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="nx-btn nx-azul nx-lleno nx-agenda-enviar">
        <CalendarCheck size={18} aria-hidden /> Confirmar ingreso
      </button>
    </form>
  );
}

export function Cotizador({ n, alAgendada }: { n: Nexus; alAgendada: (id: string) => void }) {
  const [marca, setMarca] = useState<Marca>("Apple");
  const [modelo, setModelo] = useState(MODELOS.Apple[0].nombre);
  const [cual, setCual] = useState<Falla>("pantalla");
  const [calidad, setCalidad] = useState<Calidad>("original");
  const [recoleccion, setRecoleccion] = useState(false);
  const [agendando, setAgendando] = useState(false);

  const elegido = MODELOS[marca].find((m) => m.nombre === modelo) ?? MODELOS[marca][0];
  const [base, minutos] = elegido.tarifa[cual];
  const sinRepuesto = cual === "humedad";
  const cotizacion: Cotizacion = { modelo: elegido.nombre, falla: cual, calidad: sinRepuesto ? "original" : calidad, recoleccion, precio: precioCon(base, calidad, cual), minutos };
  const total = totalTaller(cotizacion);

  return (
    <section className="nx-caja" id="nx-cotizar" aria-labelledby="nx-cotizador-titulo">
      <h2 id="nx-cotizador-titulo">Cotiza y agenda</h2>
      <p className="nx-suave">El costo, el tiempo y la garantía cambian mientras eliges.</p>

      <p className="nx-rotulo">1. Marca</p>
      <div className="nx-segmentos nx-cuatro" role="group" aria-label="Marca">
        {MARCAS.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={marca === m}
            onClick={() => {
              setMarca(m);
              setModelo(MODELOS[m][0].nombre);
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <label className="nx-rotulo" htmlFor="nx-modelo">
        2. Modelo
      </label>
      <select id="nx-modelo" className="nx-campo" value={elegido.nombre} onChange={(e) => setModelo(e.target.value)}>
        {MODELOS[marca].map((m) => (
          <option key={m.nombre}>{m.nombre}</option>
        ))}
      </select>

      <p className="nx-rotulo">3. Falla</p>
      <div className="nx-fallas" role="group" aria-label="Falla">
        {FALLAS.map((f) => {
          const Icono = ICONOS[f.id];
          return (
            <button key={f.id} type="button" aria-pressed={cual === f.id} onClick={() => setCual(f.id)}>
              <Icono size={22} aria-hidden />
              {f.nombre}
            </button>
          );
        })}
      </div>

      <p className="nx-rotulo">4. Calidad de repuesto</p>
      {sinRepuesto ? (
        <p className="nx-presentacion">La limpieza no cambia repuestos</p>
      ) : (
        <div className="nx-opciones" role="group" aria-label="Calidad de repuesto">
          {(["original", "oem"] as const).map((q) => (
            <button key={q} type="button" aria-pressed={calidad === q} onClick={() => setCalidad(q)}>
              <span>
                <b>{nombreCalidad(q, cual)}</b>
                <small>
                  {qz(precioCon(base, q, cual))} · {garantiaDe(cual, q).split(" en ")[0]} de garantía
                </small>
              </span>
            </button>
          ))}
        </div>
      )}

      <p className="nx-rotulo">5. Modalidad de entrega</p>
      <div className="nx-opciones" role="group" aria-label="Modalidad de entrega">
        <button type="button" aria-pressed={!recoleccion} onClick={() => setRecoleccion(false)}>
          <Store size={20} aria-hidden />
          <span>
            <b>En taller Zona 10</b>
            <small>Sin costo</small>
          </span>
        </button>
        <button type="button" aria-pressed={recoleccion} onClick={() => setRecoleccion(true)}>
          <Truck size={20} aria-hidden />
          <span>
            <b>Recolección con mensajero asegurado en ciudad</b>
            <small>+{qz(COSTO_RECOLECCION)}</small>
          </span>
        </button>
      </div>

      <div className="nx-cotizacion nx-oscuro">
        <p className="nx-cotizacion-que">
          {falla(cual).nombre} · {elegido.nombre}
        </p>
        <div className="nx-cotizacion-cifras" aria-live="polite" aria-atomic>
          <p className="nx-cotizacion-precio">
            <span>Total</span>
            <strong>
              <Cifra valor={total} formato={qz} />
            </strong>
          </p>
          <p className="nx-cotizacion-tiempo">
            <span>
              <Clock size={15} aria-hidden /> Tiempo estimado
            </span>
            <strong>
              <Cifra valor={minutos} formato={textoTiempo} />
            </strong>
          </p>
        </div>
        <dl>
          <div>
            <dt>
              <ShieldCheck size={16} aria-hidden /> Garantía
            </dt>
            <dd>{garantiaDe(cual, cotizacion.calidad)}</dd>
          </div>
          <div>
            <dt>Repuesto y mano de obra</dt>
            <dd>{qz(cotizacion.precio)}</dd>
          </div>
          {recoleccion && (
            <div>
              <dt>Recolección asegurada</dt>
              <dd>{qz(COSTO_RECOLECCION)}</dd>
            </div>
          )}
        </dl>
        {sinRepuesto && <p className="nx-nota">Incluye apertura, limpieza y diagnóstico. Si hay piezas dañadas, te cotizamos antes de cambiarlas.</p>}
        <button type="button" className="nx-btn nx-azul nx-lleno" onClick={() => setAgendando(true)}>
          <CalendarCheck size={18} aria-hidden /> Agendar ingreso
        </button>
      </div>

      <Ventana abierta={agendando} alCerrar={() => setAgendando(false)} titulo="Agendar ingreso" sub="Taller Nexus Mobile">
        <Agenda
          n={n}
          c={cotizacion}
          alListo={(id) => {
            setAgendando(false);
            alAgendada(id);
          }}
        />
      </Ventana>
    </section>
  );
}
