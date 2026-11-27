/* Vista "Panel Cocina y Salón": tablero de pedidos, mesas y reservas, y platillos agotados. */
import { useEffect, useState } from "react";
import { Armchair, Bike, BookOpen, ChevronRight, Flame, RotateCcw, ShoppingBag, Undo2, Users } from "lucide-react";
import { CARTA, FILTROS, ZONAS, detalleLinea, fechaCorta, fechaLarga, foto, hoyISO, nombreEtapa, platoDe, qz, reloj, totalPedido, zonaDe, type Brasa, type Etapa, type Pedido } from "./datos";

export type Seccion = "cocina" | "salon" | "carta";

const COLUMNAS: { etapa: Etapa; nombre: string }[] = [
  { etapa: "recibido", nombre: "Recibido" },
  { etapa: "parrilla", nombre: "En parrilla" },
  { etapa: "empacado", nombre: "Empacado" },
  { etapa: "camino", nombre: "En camino / Por recoger" },
];

function siguiente(p: Pedido) {
  if (p.etapa === "recibido") return "Pasar a parrilla";
  if (p.etapa === "parrilla") return "Empacar";
  if (p.etapa === "empacado") return p.modo === "domicilio" ? "Sale a domicilio" : "Avisar que está listo";
  return "Marcar entregado";
}

/* para que "hace 5 min" siga corriendo */
function useAhora() {
  const [ahora, setAhora] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setAhora(Date.now()), 20_000);
    return () => window.clearInterval(t);
  }, []);
  return ahora;
}

export function Panel({ b, seccion, alSeccion }: { b: Brasa; seccion: Seccion; alSeccion: (s: Seccion) => void }) {
  const { pedidos, mesas, reservas, agotados } = b.estado;
  const activos = pedidos.filter((p) => p.etapa !== "entregado");
  const ocupadas = mesas.filter((m) => m.ocupada).length;
  const porLlegar = reservas.filter((r) => r.estado === "confirmada" && r.fecha === hoyISO()).length;

  const secciones = [
    { id: "cocina", nombre: "Cocina", icono: Flame, cuenta: activos.length },
    { id: "salon", nombre: "Salón", icono: Armchair, cuenta: ocupadas },
    { id: "carta", nombre: "Carta", icono: BookOpen, cuenta: agotados.length },
  ] as const;

  return (
    <section className="bm-vista bm-panel">
      <div className="bm-ancho">
        <div className="bm-panel-alto">
          <div className="bm-titulo-seccion">
            <h1>Cocina y salón</h1>
            <p>{fechaLarga(hoyISO())} · turno en curso</p>
          </div>
          <button type="button" className="bm-btn bm-linea" onClick={b.reiniciar}>
            <RotateCcw size={16} aria-hidden /> Reiniciar turno
          </button>
        </div>

        <dl className="bm-cifras">
          <div>
            <dt>Pedidos activos</dt>
            <dd>{activos.length}</dd>
          </div>
          <div>
            <dt>En parrilla</dt>
            <dd>{activos.filter((p) => p.etapa === "parrilla").length}</dd>
          </div>
          <div>
            <dt>Mesas ocupadas</dt>
            <dd>
              {ocupadas}
              <small> / {mesas.length}</small>
            </dd>
          </div>
          <div>
            <dt>Reservas por llegar hoy</dt>
            <dd>{porLlegar}</dd>
          </div>
        </dl>

        <div className="bm-secciones" role="group" aria-label="Partes del panel">
          {secciones.map(({ id, nombre, icono: Icono, cuenta }) => (
            <button key={id} type="button" aria-pressed={seccion === id} onClick={() => alSeccion(id)}>
              <Icono size={17} aria-hidden /> {nombre}
              <i aria-label={id === "cocina" ? `${cuenta} activos` : id === "salon" ? `${cuenta} ocupadas` : `${cuenta} agotados`}>{cuenta}</i>
            </button>
          ))}
        </div>

        {seccion === "cocina" && <Cocina b={b} />}
        {seccion === "salon" && <Salon b={b} />}
        {seccion === "carta" && <Platillos b={b} />}
      </div>
    </section>
  );
}

function Cocina({ b }: { b: Brasa }) {
  const ahora = useAhora();
  const entregados = b.estado.pedidos.filter((p) => p.etapa === "entregado").sort((a, z) => (z.marcas.entregado ?? 0) - (a.marcas.entregado ?? 0));
  return (
    <>
      <div className="bm-tablero">
        {COLUMNAS.map((c) => {
          const lista = b.estado.pedidos.filter((p) => p.etapa === c.etapa);
          return (
            <section key={c.etapa} className="bm-columna" aria-label={c.nombre}>
              <h2>
                {c.nombre} <i>{lista.length}</i>
              </h2>
              {lista.length === 0 && <p className="bm-columna-vacia">Sin pedidos</p>}
              {lista.map((p) => (
                <article key={p.codigo} className="bm-comanda">
                  <header>
                    <h3>{p.codigo}</h3>
                    <span title={`Entró a las ${reloj(p.creado)}`}>{Math.max(0, Math.round((ahora - p.creado) / 60_000))} min</span>
                  </header>
                  <p className="bm-comanda-quien">
                    {p.modo === "domicilio" ? <Bike size={15} aria-hidden /> : <ShoppingBag size={15} aria-hidden />}
                    {p.modo === "domicilio" ? "Domicilio" : "Recoge"} · {p.cliente.nombre}
                  </p>
                  <ul>
                    {p.lineas.map((l) => (
                      <li key={l.clave}>
                        <b>{l.cantidad}×</b>
                        <span>
                          {platoDe(l.id).nombre}
                          {detalleLinea(l) && <small>{detalleLinea(l)}</small>}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {p.cliente.notas && <p className="bm-comanda-nota">{p.cliente.notas}</p>}
                  <p className="bm-comanda-total">{qz(totalPedido(p))}</p>
                  <div>
                    {p.etapa !== "recibido" && (
                      <button type="button" className="bm-regresar" onClick={() => b.mover(p.codigo, -1)} aria-label={`Regresar ${p.codigo} al paso anterior`} title="Regresar un paso">
                        <Undo2 size={17} aria-hidden />
                      </button>
                    )}
                    <button type="button" className="bm-btn bm-carbon" onClick={() => b.mover(p.codigo, 1)} aria-label={`${siguiente(p)}: ${p.codigo}`}>
                      {siguiente(p)} <ChevronRight size={16} aria-hidden />
                    </button>
                  </div>
                </article>
              ))}
            </section>
          );
        })}
      </div>
      {entregados.length > 0 && (
        <div className="bm-entregados">
          <h2>Entregados</h2>
          <ul>
            {entregados.map((p) => (
              <li key={p.codigo}>
                <b>{p.codigo}</b>
                <span>
                  {p.cliente.nombre} · {nombreEtapa("entregado", p.modo).toLowerCase()} {reloj(p.marcas.entregado ?? p.creado)}
                </span>
                <strong>{qz(totalPedido(p))}</strong>
                <button type="button" className="bm-regresar" onClick={() => b.mover(p.codigo, -1)} aria-label={`Reabrir ${p.codigo}`} title="Reabrir">
                  <Undo2 size={17} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function Salon({ b }: { b: Brasa }) {
  const { mesas, reservas } = b.estado;
  const proximas = reservas.filter((r) => r.estado !== "cancelada").sort((a, z) => `${a.fecha}${a.hora}`.localeCompare(`${z.fecha}${z.hora}`));
  return (
    <div className="bm-salon">
      <div>
        <p className="bm-nota">Toque una mesa para marcarla ocupada o libre.</p>
        {ZONAS.map((z) => {
          const suyas = mesas.filter((m) => m.zona === z.id);
          return (
            <section key={z.id} className="bm-area">
              <h2>
                {z.nombre} <small>{suyas.filter((m) => !m.ocupada).length} libres</small>
              </h2>
              <div className="bm-mesas-rejilla">
                {suyas.map((m) => (
                  <button key={m.id} type="button" aria-pressed={m.ocupada} aria-label={`Mesa ${m.id}, ${m.lugares} lugares, ${m.ocupada ? "ocupada" : "libre"}`} onClick={() => b.alternarMesa(m.id)}>
                    <b>{m.id}</b>
                    <small>
                      <Users size={13} aria-hidden /> {m.lugares}
                    </small>
                    <span>{m.ocupada ? "Ocupada" : "Libre"}</span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <section className="bm-tarjeta bm-libro" aria-label="Reservas">
        <h2>Reservas</h2>
        {proximas.length === 0 && <p className="bm-nota">No hay reservas pendientes.</p>}
        <ul>
          {proximas.map((r) => {
            const mesa = b.mesaPara(r);
            return (
              <li key={r.codigo}>
                <div className="bm-libro-hora">
                  <b>{r.hora}</b>
                  <small>{fechaCorta(r.fecha)}</small>
                </div>
                <div>
                  <b>{r.nombre}</b>
                  <small>
                    {r.personas} {r.personas === 1 ? "persona" : "personas"} · {zonaDe(r.zona).nombre} · {r.telefono}
                  </small>
                </div>
                {r.estado === "sentada" ? (
                  <span className="bm-etiqueta">Mesa {r.mesa}</span>
                ) : r.fecha === hoyISO() ? (
                  <div className="bm-libro-botones">
                    <button type="button" className="bm-btn bm-carbon" disabled={!mesa} onClick={() => b.sentar(r.codigo)}>
                      {mesa ? `Sentar en ${mesa.id}` : "Sin mesa libre"}
                    </button>
                    <button type="button" className="bm-enlace" onClick={() => b.cancelarReserva(r.codigo)} aria-label={`No llegó: ${r.nombre}`}>
                      No llegó
                    </button>
                  </div>
                ) : (
                  <span className="bm-etiqueta">Confirmada</span>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Platillos({ b }: { b: Brasa }) {
  return (
    <div className="bm-existencias">
      <p className="bm-nota">Lo que marque como agotado deja de poder pedirse en la carta al instante.</p>
      <ul>
        {CARTA.map((p) => {
          const hay = !b.estado.agotados.includes(p.id);
          return (
            <li key={p.id} className={hay ? "" : "bm-sin"}>
              <img src={foto(p.foto, 160, 160)} alt="" />
              <div>
                <b>{p.nombre}</b>
                <small>
                  {FILTROS.find((f) => f.id === p.categoria)?.nombre} · {qz(p.precio)}
                </small>
              </div>
              <button type="button" role="switch" aria-checked={hay} aria-label={`${p.nombre} disponible`} className="bm-interruptor" onClick={() => b.alternarAgotado(p.id)}>
                <span>{hay ? "Disponible" : "Agotado"}</span>
                <i aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
