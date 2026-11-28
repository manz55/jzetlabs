/* Panel Taller: cifras del día, ingreso por placa y las tarjetas de los vehículos en bahía. */
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Banknote, CalendarClock, CarFront, CircleCheck, Hourglass, MessageCircle, Plus, ScanLine, Search, Send, ThumbsUp, X } from "lucide-react";
import { useEscalonado } from "./animar";
import { Campo, Cifra, Placa, Ventana } from "./Piezas";
import { BAHIAS, COMBUSTIBLE, ETAPAS, JEFES, SEMAFORO, TIPOS_NOTA, enTaller, enlaceWhatsApp, fechaCorta, mensajeEstado, miles, nombreEtapa, normalizarPlaca, ordenDe, qz, totalDe, type Orden, type Taller, type TipoNota } from "./datos";

const ACCIONES = ["Recibir vehículo", "Pasar a diagnóstico", "Enviar a aprobación", "Aprobó por teléfono", "Pasar a prueba en ruta", "Entregar al cliente"];
const numero = (n: number) => String(n);
const PESTANAS: { id: FiltroPanel; nombre: string }[] = [
  { id: "todos", nombre: "Todos" },
  { id: "aprobacion", nombre: "Esperando aprobación" },
  { id: "bahia", nombre: "En bahía" },
  { id: "listos", nombre: "Listos" },
];

export type FiltroPanel = "todos" | "aprobacion" | "bahia" | "listos";

export function Panel({ taller, filtro, alFiltrar, alVer }: { taller: Taller; filtro: FiltroPanel; alFiltrar: (f: FiltroPanel) => void; alVer: (placa: string) => void }) {
  const { ordenes } = taller.estado;
  const [mensaje, setMensaje] = useState<Orden | null>(null);
  const bahia = ordenes.filter(enTaller);
  const pendientes = bahia.filter((o) => o.etapa === 3);
  const listos = bahia.filter((o) => o.etapa === 5);
  /* todo lo que se está trabajando: ni espera respuesta ni está por entregarse */
  const trabajando = bahia.filter((o) => o.etapa !== 3 && o.etapa !== 5);
  const citas = ordenes.filter((o) => o.etapa === 0);
  const entregados = ordenes.filter((o) => o.etapa === 6);
  const facturacion = [...bahia, ...entregados].reduce((s, o) => s + totalDe(o), 0);
  /* lo que espera respuesta va primero; después lo que está por entregarse */
  const peso = (o: Orden) => [9, 3, 4, 0, 2, 1][o.etapa];
  const listas: Record<FiltroPanel, Orden[]> = { todos: bahia, aprobacion: pendientes, bahia: trabajando, listos };
  const visibles = listas[filtro].slice().sort((a, b) => peso(a) - peso(b));

  const tarjetas = useRef<HTMLDivElement>(null);
  useEscalonado(tarjetas, filtro, true);

  const kpis = [
    { nombre: "Autos en bahía", valor: bahia.length, formato: numero, icono: CarFront },
    { nombre: "Pendientes de aprobación", valor: pendientes.length, formato: numero, icono: Hourglass },
    { nombre: "Listos para entrega", valor: listos.length, formato: numero, icono: CircleCheck },
    { nombre: "Facturación estimada del día", valor: facturacion, formato: qz, icono: Banknote },
  ];

  const enlaceDe = (o: Orden) => `${location.origin}${location.pathname}#seguimiento/${o.placa}`;

  return (
    <div className="at-panel">
      <div className="at-ancho">
        <header className="at-panel-alto">
          <h1>Panel Taller</h1>
          <p>{new Date().toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" })}</p>
        </header>

        <ul className="at-kpis">
          {kpis.map(({ nombre, valor, formato, icono: Icono }) => (
            <li key={nombre}>
              <Icono size={22} aria-hidden />
              <Cifra valor={valor} formato={formato} desdeCero />
              <span>{nombre}</span>
            </li>
          ))}
        </ul>

        <div className="at-panel-cuerpo">
          <div className="at-panel-lado">
            <Ingreso taller={taller} alVer={alVer} />
            {citas.length > 0 && (
              <section className="at-caja">
                <h2>
                  <CalendarClock size={19} aria-hidden /> Citas por recibir
                </h2>
                <ul className="at-citas">
                  {citas.map((o) => (
                    <li key={o.codigo}>
                      <div>
                        <b>
                          {o.placa} · {o.cita && `${fechaCorta(o.cita.fecha)}, ${o.cita.hora}`}
                        </b>
                        <span>
                          {o.cliente} · {o.vehiculo}
                        </span>
                        <span>
                          {o.servicio} · {qz(o.costo)}
                        </span>
                      </div>
                      <button type="button" className="at-btn at-pizarra" onClick={() => taller.avanzar(o.codigo)}>
                        Recibir vehículo
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <section className="at-panel-bahias">
            <div className="at-pestanas" role="group" aria-label="Filtrar vehículos">
              {PESTANAS.map(({ id, nombre }) => (
                <button key={id} type="button" aria-pressed={filtro === id} onClick={() => alFiltrar(id)}>
                  {nombre} ({listas[id].length})
                </button>
              ))}
            </div>
            <h2>Vehículos en bahía</h2>
            <div ref={tarjetas} className="at-tarjetas">
              {visibles.map((o) => (
                <Tarjeta key={o.codigo} taller={taller} orden={o} alMensaje={() => setMensaje(o)} alVer={() => alVer(o.placa)} />
              ))}
              {!visibles.length && <p className="at-vacio-corto">No hay vehículos en esta lista.</p>}
            </div>
            {entregados.length > 0 && (
              <div className="at-caja at-entregados">
                <h2>Entregados hoy</h2>
                <ul>
                  {entregados.map((o) => (
                    <li key={o.codigo}>
                      <b>{o.placa}</b>
                      <span>{o.vehiculo}</span>
                      <strong>{qz(totalDe(o))}</strong>
                      <button type="button" className="at-enlace" onClick={() => setMensaje(o)}>
                        Avisar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>

      {mensaje && (
        <Ventana
          abierta
          alCerrar={() => setMensaje(null)}
          titulo="Actualización para el cliente"
          nota={`${mensaje.cliente}${mensaje.telefono ? ` · ${mensaje.telefono}` : ""}`}
          pie={
            <a className="at-btn at-naranja at-lleno" href={enlaceWhatsApp(mensajeEstado(mensaje, enlaceDe(mensaje)), mensaje.telefono)} target="_blank" rel="noopener noreferrer">
              <Send size={18} aria-hidden /> Enviar por WhatsApp
            </a>
          }
        >
          <div className="at-burbuja">
            <p>{mensajeEstado(mensaje, enlaceDe(mensaje))}</p>
          </div>
        </Ventana>
      )}
    </div>
  );
}

function Tarjeta({ taller, orden: o, alMensaje, alVer }: { taller: Taller; orden: Orden; alMensaje: () => void; alVer: () => void }) {
  const r = o.recepcion;
  const h = o.hallazgo;
  return (
    <article className={`at-tarjeta ${o.etapa === 3 ? "at-tarjeta-espera" : ""}`} data-entra>
      <header>
        <Placa valor={o.placa} />
        <div>
          <h3>{o.vehiculo}</h3>
          <p>
            {o.cliente} · {o.codigo}
          </p>
        </div>
      </header>

      <div className="at-tarjeta-servicio">
        <p>{o.servicio}</p>
        <Cifra valor={totalDe(o)} formato={qz} />
      </div>
      <p className="at-tarjeta-falla">
        <ScanLine size={17} aria-hidden />
        <span>
          {o.falla?.codigo && <b>{o.falla.codigo}</b>}
          {o.falla ? o.falla.titulo : "Sin código ni falla registrada"}
        </span>
      </p>
      {h && <p className={`at-tarjeta-hallazgo ${h.aprobado ? "at-ok" : ""}`}>{h.aprobado ? "Aprobado" : "Sin aprobar"}: {h.nombre}, {qz(h.precio)}</p>}

      <div className="at-avance">
        <div role="img" aria-label={`Etapa ${o.etapa} de 5`}>
          {ETAPAS.map((n, i) => (
            <i key={n} className={i < o.etapa ? "at-lleno-tramo" : ""} />
          ))}
        </div>
        <p>
          <b>{o.etapa} de 5</b> · {nombreEtapa(o.etapa)}
        </p>
      </div>

      <label className="at-campo">
        <span>Bahía / elevador</span>
        <select value={o.bahia} onChange={(e) => taller.ubicar(o.codigo, e.target.value)}>
          <option value="">Sin asignar</option>
          {BAHIAS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </label>

      <label className="at-campo">
        <span>Jefe de bahía</span>
        <select value={o.jefe} onChange={(e) => taller.asignar(o.codigo, e.target.value)}>
          <option value="">Sin asignar</option>
          {JEFES.map((j) => (
            <option key={j}>{j}</option>
          ))}
        </select>
      </label>

      <Anotar taller={taller} orden={o} />

      <details className="at-recepcion" open={o.etapa === 1}>
        <summary>
          Recepción · {r.km !== null ? `${miles(r.km)} km` : "sin kilometraje"}
        </summary>
        <div>
          <label className="at-casilla">
            <input type="checkbox" checked={r.sinGolpes} onChange={(e) => taller.recibir(o.codigo, { sinGolpes: e.target.checked })} /> Sin golpes nuevos
          </label>
          <label className="at-casilla">
            <input type="checkbox" checked={r.herramienta} onChange={(e) => taller.recibir(o.codigo, { herramienta: e.target.checked })} /> Herramienta completa
          </label>
          <label className="at-campo">
            <span>Combustible</span>
            <select value={r.combustible} onChange={(e) => taller.recibir(o.codigo, { combustible: e.target.value })}>
              <option value="">Por anotar</option>
              {COMBUSTIBLE.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="at-campo">
            <span>Kilometraje</span>
            <input inputMode="numeric" value={r.km ?? ""} maxLength={7} onChange={(e) => taller.recibir(o.codigo, { km: e.target.value.replace(/\D/g, "") ? Number(e.target.value.replace(/\D/g, "")) : null })} />
          </label>
        </div>
      </details>

      <button type="button" className={`at-btn at-lleno ${o.etapa === 3 ? "at-contorno" : "at-pizarra"}`} onClick={() => (o.etapa === 3 ? taller.aprobar(o.codigo) : taller.avanzar(o.codigo))}>
        {o.etapa === 3 ? <ThumbsUp size={17} aria-hidden /> : null}
        {ACCIONES[o.etapa]}
        {o.etapa !== 3 ? <ArrowRight size={17} aria-hidden /> : null}
      </button>
      <div className="at-tarjeta-pie">
        <button type="button" className="at-enlace" onClick={alMensaje}>
          <MessageCircle size={17} aria-hidden /> Avisar por WhatsApp
        </button>
        <button type="button" className="at-enlace" onClick={alVer}>
          <Search size={17} aria-hidden /> Ver seguimiento
        </button>
      </div>
    </article>
  );
}

/* campo rápido del mecánico: lo que se anota aquí aparece de una vez en el reporte del cliente */
function Anotar({ taller, orden: o }: { taller: Taller; orden: Orden }) {
  const [tipo, setTipo] = useState<TipoNota>("optimo");
  const [texto, setTexto] = useState("");
  const [hecho, setHecho] = useState("");
  const elegido = TIPOS_NOTA.find((t) => t.id === tipo)!;

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    taller.anotar(o.codigo, tipo, texto);
    setHecho("Anotado en el reporte del cliente.");
    setTexto("");
  }

  return (
    <div className="at-anotar">
      <form onSubmit={enviar}>
        <label className="at-campo">
          <span>Anotar medición o repuesto OEM</span>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoNota)} aria-label="Tipo de anotación">
            {TIPOS_NOTA.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </label>
        <div>
          <input
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              setHecho("");
            }}
            placeholder={elegido.guia}
            aria-label={`${elegido.nombre} para ${o.placa}`}
            maxLength={80}
          />
          <button type="submit" className="at-btn at-pizarra" disabled={!texto.trim()}>
            Anotar
          </button>
        </div>
      </form>
      <p className="at-anotar-hecho" role="status">
        {hecho}
      </p>
      {o.notas.length > 0 && (
        <details>
          <summary>
            {o.notas.length} {o.notas.length === 1 ? "anotación" : "anotaciones"} en el reporte
          </summary>
          <ul>
            {o.notas.map((n) => (
              <li key={n.id}>
                <i className={`at-punto at-${n.tipo}`} title={n.tipo === "repuesto" ? "Repuesto OEM" : SEMAFORO[n.tipo]} />
                <span>
                  {n.nombre}
                  {n.valor && `: ${n.valor}`}
                </span>
                <button type="button" onClick={() => taller.borrarNota(o.codigo, n.id)} aria-label={`Borrar ${n.nombre}`}>
                  <X size={16} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

const VACIO = { cliente: "", telefono: "", placa: "", vehiculo: "", servicio: "", costo: "", km: "" };

function Ingreso({ taller, alVer }: { taller: Taller; alVer: (placa: string) => void }) {
  const [f, setF] = useState(VACIO);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [creada, setCreada] = useState<Orden | null>(null);
  const escribir = (campo: keyof typeof VACIO) => (e: { target: { value: string } }) => setF({ ...f, [campo]: e.target.value });

  function enviar(e: FormEvent) {
    e.preventDefault();
    const placa = normalizarPlaca(f.placa);
    const costo = Number(f.costo.replace(/[Q,\s]/g, ""));
    const previa = placa ? ordenDe(taller.estado.ordenes, placa) : undefined;
    const err: Record<string, string> = {};
    if (f.cliente.trim().length < 3) err.cliente = "Nombre del cliente.";
    if (!placa) err.placa = "Formato: P-123BCD.";
    else if (previa && previa.etapa < 6) err.placa = `Ya tiene la orden ${previa.codigo} abierta.`;
    if (f.vehiculo.trim().length < 3) err.vehiculo = "Marca, modelo y año.";
    if (f.servicio.trim().length < 3) err.servicio = "¿Qué se le va a hacer?";
    if (!(costo > 0 && costo <= 200000)) err.costo = "Monto en quetzales.";
    if (f.telefono && f.telefono.replace(/\D/g, "").length !== 8) err.telefono = "Son 8 dígitos.";
    setErrores(err);
    if (Object.keys(err).length) return;
    setCreada(taller.crear({ cliente: f.cliente, telefono: f.telefono, placa, vehiculo: f.vehiculo, servicio: f.servicio, costo: Math.round(costo), km: f.km ? Number(f.km.replace(/\D/g, "")) || null : null }));
    setF(VACIO);
  }

  return (
    <section className="at-caja">
      <h2>
        <Plus size={19} aria-hidden /> Ingresar vehículo por placa
      </h2>
      <form className="at-formulario" onSubmit={enviar} noValidate>
        <Campo nombre="Placa" error={errores.placa}>
          <input value={f.placa} onChange={escribir("placa")} placeholder="P-123BCD" autoCapitalize="characters" maxLength={9} />
        </Campo>
        <Campo nombre="Costo (Q)" error={errores.costo}>
          <input value={f.costo} onChange={escribir("costo")} inputMode="decimal" placeholder="850" maxLength={9} />
        </Campo>
        <Campo nombre="Cliente" error={errores.cliente} ancho>
          <input value={f.cliente} onChange={escribir("cliente")} maxLength={50} />
        </Campo>
        <Campo nombre="Vehículo" error={errores.vehiculo} ancho>
          <input value={f.vehiculo} onChange={escribir("vehiculo")} placeholder="Toyota Yaris 2020" maxLength={40} />
        </Campo>
        <Campo nombre="Servicio" error={errores.servicio} ancho>
          <input value={f.servicio} onChange={escribir("servicio")} placeholder="Cambio de clutch" maxLength={60} />
        </Campo>
        <Campo nombre="Teléfono (opcional)" error={errores.telefono}>
          <input value={f.telefono} onChange={escribir("telefono")} inputMode="tel" maxLength={9} />
        </Campo>
        <Campo nombre="Km (opcional)">
          <input value={f.km} onChange={escribir("km")} inputMode="numeric" maxLength={7} />
        </Campo>
        <button type="submit" className="at-btn at-naranja at-lleno at-campo-ancho">
          Crear orden
        </button>
      </form>
      {creada && (
        <div className="at-creada" role="status">
          <p>
            <CircleCheck size={19} aria-hidden /> {creada.codigo} creada para {creada.placa}.
          </p>
          <button type="button" className="at-enlace" onClick={() => alVer(creada.placa)}>
            Ver en Seguimiento por Placa <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      )}
    </section>
  );
}
