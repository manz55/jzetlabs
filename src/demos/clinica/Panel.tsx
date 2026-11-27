/* Panel de la clínica: citas del día y sus estados, precios de tratamientos y saldos de pacientes. */
import { useState, type FormEvent } from "react";
import { CalendarDays, Check, MessageCircle, RotateCcw, Search, Tags, Wallet } from "lucide-react";
import { Logo } from "./Pie";
import {
  CLASE_ESTADO, COMPLEMENTOS, ESPECIALIDADES, ESTADOS, ESTADOS_PLAN, MEDIOS, ODONTOLOGOS, cuentaDe, diaCorto, enlaceWhatsApp, fechaCorta, fechaLarga,
  formatoQ, hora12, iso, mayus, nombreDe, odontologoPor, proximosDias, tratamientoPor,
  type Cita, type Clinica, type Medio, type Paciente, type Tratamiento,
} from "./datos";

type Pestana = "citas" | "precios" | "pacientes";
const PESTANAS = [
  { id: "citas", nombre: "Citas", icono: CalendarDays },
  { id: "precios", nombre: "Precios", icono: Tags },
  { id: "pacientes", nombre: "Pacientes", icono: Wallet },
] as const;

const porHora = (a: Cita, b: Cita) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora);

export function Panel({ clinica }: { clinica: Clinica }) {
  const dias = proximosDias();
  const hoy = iso(new Date());
  const [pestana, setPestana] = useState<Pestana>("citas");
  const [dia, setDia] = useState(dias[0]);
  const [pacienteId, setPaciente] = useState(clinica.pacientes[0].id);

  const delDia = clinica.citas.filter((c) => c.fecha === dia).sort(porHora);
  const porCobrar = clinica.pacientes.reduce((s, p) => s + Math.max(0, cuentaDe(clinica.citas, p).saldo), 0);
  const tituloDia = dia === hoy ? "Hoy" : mayus(fechaLarga(dia));

  return (
    <>
      <header className="vv-cabeza">
        <div className="vv-ancho vv-cabeza-fila vv-cabeza-panel">
          <div className="vv-logo-boton">
            <Logo />
          </div>
          <nav className="vv-pestanas" aria-label="Secciones del panel">
            {PESTANAS.map((p) => (
              <button key={p.id} type="button" aria-pressed={pestana === p.id} onClick={() => setPestana(p.id)}>
                <p.icono size={17} aria-hidden /> {p.nombre}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="vv-panel-fondo">
        <div className="vv-ancho">
          <div className="vv-panel-titulo">
            <div>
              <h1>{pestana === "citas" ? "Agenda de la clínica" : pestana === "precios" ? "Tratamientos y precios" : "Pacientes y saldos"}</h1>
              <p className="vv-suave">Recepción y doctores · {mayus(fechaLarga(hoy))}</p>
            </div>
            <button type="button" className="vv-btn vv-contorno vv-chico" onClick={() => window.confirm("¿Volver a la agenda, precios y saldos iniciales?") && clinica.restaurar()}>
              <RotateCcw size={15} aria-hidden /> Restaurar datos
            </button>
          </div>

          <dl className="vv-indicadores">
            <div>
              <dt>Citas · {dia === hoy ? "hoy" : fechaCorta(dia)}</dt>
              <dd>{delDia.length}</dd>
            </div>
            <div>
              <dt>En sala</dt>
              <dd>{delDia.filter((c) => c.estado === "En sala").length}</dd>
            </div>
            <div>
              <dt>Completadas</dt>
              <dd>{delDia.filter((c) => c.estado === "Completada").length}</dd>
            </div>
            <div>
              <dt>Saldo por cobrar</dt>
              <dd>{formatoQ(porCobrar)}</dd>
            </div>
          </dl>

          {pestana === "citas" && (
            <Citas clinica={clinica} dias={dias} dia={dia} setDia={setDia} delDia={delDia} titulo={tituloDia} verPaciente={(id) => { setPaciente(id); setPestana("pacientes"); }} />
          )}
          {pestana === "precios" && <Precios clinica={clinica} />}
          {pestana === "pacientes" && <Pacientes clinica={clinica} elegido={pacienteId} elegir={setPaciente} />}
        </div>
      </main>
    </>
  );
}

function Citas({ clinica, dias, dia, setDia, delDia, titulo, verPaciente }: {
  clinica: Clinica; dias: string[]; dia: string; setDia: (d: string) => void; delDia: Cita[]; titulo: string; verPaciente: (id: string) => void;
}) {
  const [doctor, setDoctor] = useState("todos");
  const hoy = iso(new Date());
  const lista = delDia.filter((c) => doctor === "todos" || c.doctorId === doctor);
  const delPortal = clinica.citas.filter((c) => c.origen === "portal").sort(porHora);

  return (
    <>
      <div className="vv-barra-dias" role="group" aria-label="Día de la agenda">
        {dias.map((d) => (
          <button key={d} type="button" aria-pressed={dia === d} onClick={() => setDia(d)}>
            <span>{d === hoy ? "Hoy" : mayus(diaCorto(d))}</span>
            <strong>{fechaCorta(d)}</strong>
            <small>{clinica.citas.filter((c) => c.fecha === d).length} citas</small>
          </button>
        ))}
      </div>

      <div className="vv-agenda">
        <section className="vv-panel" aria-label="Citas del día">
          <div className="vv-panel-encabezado">
            <h2>{titulo}</h2>
            <label className="vv-campo vv-campo-linea">
              <span className="vv-oculto">Filtrar por odontólogo</span>
              <select value={doctor} onChange={(e) => setDoctor(e.target.value)}>
                <option value="todos">Todos los odontólogos</option>
                {ODONTOLOGOS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ul className="vv-citas">
            {lista.map((c) => {
              const t = tratamientoPor(c.tratamientoId);
              const nombre = nombreDe(clinica, c.pacienteId);
              const extras = COMPLEMENTOS.filter((x) => c.complementos.includes(x.id)).map((x) => x.nombre);
              return (
                <li key={c.id} data-portal={c.origen === "portal"}>
                  <p className="vv-cita-hora">
                    <strong>{hora12(c.hora)}</strong>
                    <small>{c.minutos} min</small>
                  </p>
                  <div className="vv-cita-quien">
                    <p>
                      <button type="button" className="vv-nombre" onClick={() => verPaciente(c.pacienteId)}>
                        {nombre}
                      </button>
                      {c.origen === "portal" && <span className="vv-etiqueta">Portal</span>}
                    </p>
                    <small>
                      {t.nombre}
                      {extras.length ? ` + ${extras.join(", ")}` : ""} · {odontologoPor(c.doctorId).nombre}
                    </small>
                    <small>
                      <b>{formatoQ(c.total)}</b>
                      {c.meses > 1 ? ` en ${c.meses} pagos` : ""}
                    </small>
                  </div>
                  <div className="vv-cita-acciones">
                    <div className="vv-estados" role="group" aria-label={`Estado de la cita de ${nombre}`}>
                      {ESTADOS.map((e) => (
                        <button key={e} type="button" data-estado={e} aria-pressed={c.estado === e} onClick={() => clinica.cambiarEstado(c.id, e)}>
                          {e}
                        </button>
                      ))}
                    </div>
                    {c.estado === "Confirmada" && (
                      <a
                        className="vv-enlace"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={enlaceWhatsApp(`Hola, ${nombre.split(" ")[0]}. Le recordamos su cita en Clínica Dental Valleverde: ${fechaLarga(c.fecha)}, ${hora12(c.hora)}, con ${odontologoPor(c.doctorId).nombre}. Si necesita reprogramar, avísenos con 24 horas de anticipación.`)}
                      >
                        <MessageCircle size={15} aria-hidden /> Recordar
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
            {!lista.length && <li className="vv-vacio">No hay citas para este día.</li>}
          </ul>
        </section>

        <aside className="vv-panel">
          <h2>Reservadas desde el portal</h2>
          {delPortal.length ? (
            <ul className="vv-portal-lista">
              {delPortal.map((c) => (
                <li key={c.id}>
                  <span>
                    <strong>{nombreDe(clinica, c.pacienteId)}</strong>
                    <small>
                      {fechaCorta(c.fecha)} · {hora12(c.hora)} · {tratamientoPor(c.tratamientoId).nombre}
                    </small>
                    <small>Folio {c.id}</small>
                  </span>
                  <button type="button" className="vv-btn vv-contorno vv-chico" onClick={() => { setDia(c.fecha); setDoctor("todos"); }}>
                    Ver día
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="vv-suave">Las citas que los pacientes agenden en el portal aparecen aquí al instante.</p>
          )}
        </aside>
      </div>
    </>
  );
}

function Precios({ clinica }: { clinica: Clinica }) {
  return (
    <div className="vv-precios">
      <p className="vv-suave">El portal muestra el precio nuevo al instante. Las citas ya reservadas conservan el precio con el que se agendaron.</p>
      {ESPECIALIDADES.map((esp) => (
        <section key={esp} className="vv-panel">
          <h2>{esp}</h2>
          <ul>
            {clinica.tratamientos.filter((t) => t.especialidad === esp).map((t) => (
              <Precio key={`${t.id}-${t.precio}`} tratamiento={t} guardar={(n) => clinica.cambiarPrecio(t.id, n)} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Precio({ tratamiento: t, guardar }: { tratamiento: Tratamiento; guardar: (n: number) => void }) {
  const [valor, setValor] = useState(String(t.precio));
  const numero = Number(valor);
  const valido = valor.trim() !== "" && Number.isFinite(numero) && numero > 0 && numero <= 200000;
  const cambiado = valido && numero !== t.precio;
  return (
    <li>
      <form onSubmit={(e) => { e.preventDefault(); if (cambiado) guardar(Math.round(numero)); }}>
        <span>
          <strong>{t.nombre}</strong>
          <small>
            {t.minutos} min · {t.visitas}
            {t.desde ? " · precio desde" : ""}
          </small>
        </span>
        <label className="vv-dinero">
          <span aria-hidden>Q</span>
          <input type="number" inputMode="numeric" min={1} step={1} value={valor} onChange={(e) => setValor(e.target.value)} aria-label={`Precio de ${t.nombre} en quetzales`} aria-invalid={!valido} />
        </label>
        <button type="submit" className="vv-btn vv-accion vv-chico" disabled={!cambiado}>
          <Check size={15} aria-hidden /> Guardar
        </button>
      </form>
    </li>
  );
}

function Pacientes({ clinica, elegido, elegir }: { clinica: Clinica; elegido: string; elegir: (id: string) => void }) {
  const [busqueda, setBusqueda] = useState("");
  const paciente = clinica.pacientes.find((p) => p.id === elegido) ?? clinica.pacientes[0];
  const normal = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const lista = clinica.pacientes.filter((p) => normal(`${p.nombre} ${p.id}`).includes(normal(busqueda)));

  return (
    <div className="vv-pacientes">
      <section className="vv-panel" aria-label="Lista de pacientes">
        <label className="vv-buscar">
          <Search size={17} aria-hidden />
          <input type="search" placeholder="Buscar por nombre o expediente" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} aria-label="Buscar paciente" />
        </label>
        <ul className="vv-lista-pacientes">
          {lista.map((p) => {
            const saldo = cuentaDe(clinica.citas, p).saldo;
            return (
              <li key={p.id}>
                <button type="button" aria-pressed={p.id === paciente.id} onClick={() => elegir(p.id)}>
                  <span>
                    <strong>{p.nombre}</strong>
                    <small>{p.id}</small>
                  </span>
                  <b data-debe={saldo > 0}>{formatoQ(saldo)}</b>
                </button>
              </li>
            );
          })}
          {!lista.length && <li className="vv-vacio">Sin coincidencias.</li>}
        </ul>
      </section>
      <Ficha key={paciente.id} clinica={clinica} paciente={paciente} />
    </div>
  );
}

function Ficha({ clinica, paciente }: { clinica: Clinica; paciente: Paciente }) {
  const cuenta = cuentaDe(clinica.citas, paciente);
  const [monto, setMonto] = useState("");
  const [medio, setMedio] = useState<Medio>("Efectivo");
  const [concepto, setConcepto] = useState("");
  const [cargo, setCargo] = useState("");
  const [pieza, setPieza] = useState("");
  const [aviso, setAviso] = useState("");

  function abonar(e: FormEvent) {
    e.preventDefault();
    const n = Number(monto);
    if (!(n > 0 && n <= 200000)) return setAviso("Escriba un monto de abono mayor que cero.");
    clinica.abonar(paciente.id, Math.round(n * 100) / 100, medio);
    setMonto("");
    setAviso(`Abono de ${formatoQ(n)} registrado.`);
  }
  function cargar(e: FormEvent) {
    e.preventDefault();
    const n = Number(cargo);
    const p = pieza.trim() ? Number(pieza) : null;
    if (concepto.trim().length < 3 || !(n > 0 && n <= 200000)) return setAviso("Escriba el concepto y un monto mayor que cero.");
    if (p !== null && !(Number.isInteger(p) && p >= 11 && p <= 48 && p % 10 >= 1 && p % 10 <= 8)) return setAviso("La pieza va de 11 a 48 en numeración dental, o déjela vacía.");
    clinica.cargar(paciente.id, concepto.trim(), Math.round(n * 100) / 100, p);
    setConcepto("");
    setCargo("");
    setPieza("");
    setAviso(`Cargo de ${formatoQ(n)} agregado.`);
  }

  return (
    <section className="vv-panel vv-ficha" aria-label={`Cuenta de ${paciente.nombre}`}>
      <div className="vv-panel-encabezado">
        <div>
          <h2>{paciente.nombre}</h2>
          <p className="vv-suave">
            {paciente.id}
            {paciente.telefono ? ` · Tel. ${paciente.telefono.replace(/(\d{4})(\d{4})/, "$1 $2")}` : ""}
          </p>
        </div>
        <p className="vv-ficha-saldo">
          <span>{cuenta.saldo < 0 ? "Saldo a favor" : "Saldo pendiente"}</span>
          <strong>{formatoQ(Math.abs(cuenta.saldo))}</strong>
        </p>
      </div>

      <p className="vv-aviso-panel" role="status">
        {aviso}
      </p>

      <form className="vv-formulario" onSubmit={abonar} noValidate>
        <h3>Registrar abono</h3>
        <label className="vv-campo">
          <span>Monto (Q)</span>
          <input type="number" inputMode="decimal" min={1} value={monto} onChange={(e) => setMonto(e.target.value)} />
        </label>
        <label className="vv-campo">
          <span>Medio de pago</span>
          <select value={medio} onChange={(e) => setMedio(e.target.value as Medio)}>
            {MEDIOS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="vv-btn vv-accion">Registrar</button>
      </form>

      <form className="vv-formulario vv-formulario-cargo" onSubmit={cargar} noValidate>
        <h3>Agregar cargo</h3>
        <label className="vv-campo">
          <span>Concepto</span>
          <input type="text" value={concepto} onChange={(e) => setConcepto(e.target.value)} />
        </label>
        <label className="vv-campo">
          <span>Pieza (opcional)</span>
          <input type="number" inputMode="numeric" value={pieza} onChange={(e) => setPieza(e.target.value)} />
        </label>
        <label className="vv-campo">
          <span>Monto (Q)</span>
          <input type="number" inputMode="decimal" min={1} value={cargo} onChange={(e) => setCargo(e.target.value)} />
        </label>
        <button type="submit" className="vv-btn vv-contorno">Agregar</button>
      </form>

      <h3>Plan de tratamiento</h3>
      {cuenta.plan.length || cuenta.porCitas.length ? (
        <ul className="vv-plan">
          {cuenta.plan.map((i) => {
            const porCita = clinica.citas.some((c) => c.planId === i.id && c.estado === "Completada");
            return (
              <li key={i.id}>
                <span className="vv-plan-pieza">{i.pieza ?? "—"}</span>
                <span>
                  <strong>{i.concepto}</strong>
                  <select
                    className="vv-select-estado"
                    data-marca={CLASE_ESTADO[i.estado]}
                    value={i.estado}
                    disabled={porCita}
                    aria-label={`Estado de ${i.concepto}`}
                    onChange={(e) => clinica.cambiarItem(paciente.id, i.id, e.target.value as (typeof ESTADOS_PLAN)[number])}
                  >
                    {ESTADOS_PLAN.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </span>
                <b>{formatoQ(i.monto)}</b>
              </li>
            );
          })}
          {cuenta.porCitas.map((c) => (
            <li key={c.id}>
              <span className="vv-plan-pieza">—</span>
              <span>
                <strong>{tratamientoPor(c.tratamientoId).nombre}</strong>
                <small className="vv-estado" data-marca="tratada">
                  Cita completada el {fechaCorta(c.fecha)}
                </small>
              </span>
              <b>{formatoQ(c.total)}</b>
            </li>
          ))}
        </ul>
      ) : (
        <p className="vv-suave">Sin cargos todavía. Al completar una cita, su precio se suma aquí.</p>
      )}

      <h3>Abonos</h3>
      <ul className="vv-abonos">
        {[...paciente.abonos].reverse().map((a) => (
          <li key={a.id}>
            <span>
              <strong>{fechaCorta(a.fecha)}</strong>
              <small>{a.medio}</small>
            </span>
            <b>{formatoQ(a.monto)}</b>
          </li>
        ))}
        {!paciente.abonos.length && <li className="vv-suave">Sin abonos registrados.</li>}
      </ul>
    </section>
  );
}
