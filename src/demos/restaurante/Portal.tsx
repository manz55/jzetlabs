/* Vista "Mi Pedido / Reserva": el seguimiento de la orden en vivo y la mesa reservada. */
import { useLayoutEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { Bike, CalendarDays, Check, ClipboardCheck, Clock, Flame, MapPin, MessageCircle, Package, ShoppingBag, Users } from "lucide-react";
import { sinMovimiento } from "./animar";
import { Horas } from "./Reserva";
import {
  DIRECCION,
  ETAPAS,
  detalleLinea,
  enlaceWhatsApp,
  envioDe,
  estimado,
  fechaLarga,
  foto,
  horasConCupo,
  hoyISO,
  masDias,
  mensajePedido,
  mensajeReserva,
  nombreEtapa,
  platoDe,
  qz,
  reloj,
  totalPedido,
  zonaDe,
  type Brasa,
  type Pedido,
  type Reserva,
} from "./datos";

export function Portal({ b, alMenu, alReservar }: { b: Brasa; alMenu: () => void; alReservar: () => void }) {
  const { misPedidos, pedidos, misReservas, reservas } = b.estado;
  const mios = misPedidos.map((c) => pedidos.find((p) => p.codigo === c)).filter((p): p is Pedido => !!p);
  const [elegido, setElegido] = useState("");
  const pedido = mios.find((p) => p.codigo === elegido) ?? mios[0];
  const misMesas = misReservas.map((c) => reservas.find((r) => r.codigo === c)).filter((r): r is Reserva => !!r);

  return (
    <section className="bm-vista">
      <div className="bm-ancho">
        <div className="bm-titulo-seccion">
          <h1>Mi pedido y mi reserva</h1>
          <p>El estado cambia aquí en cuanto el restaurante lo actualiza.</p>
        </div>
        <div className="bm-portal">
          <div>
            {mios.length > 1 && (
              <div className="bm-filtros" role="group" aria-label="Mis pedidos">
                {mios.map((p) => (
                  <button key={p.codigo} type="button" aria-pressed={pedido?.codigo === p.codigo} onClick={() => setElegido(p.codigo)}>
                    {p.codigo}
                  </button>
                ))}
              </div>
            )}
            {pedido ? (
              <Rastreo key={pedido.codigo} p={pedido} />
            ) : (
              <div className="bm-tarjeta bm-vacio">
                <ShoppingBag size={28} aria-hidden />
                <h2>No tiene pedidos en curso</h2>
                <button type="button" className="bm-btn bm-terra" onClick={alMenu}>
                  Ver la carta
                </button>
              </div>
            )}
          </div>
          <aside className="bm-portal-mesas" aria-label="Mis reservas">
            {misMesas.map((r) => (
              <Mesa key={r.codigo} r={r} b={b} />
            ))}
            {!misMesas.some((r) => r.estado === "confirmada") && (
              <div className="bm-tarjeta bm-vacio">
                <CalendarDays size={28} aria-hidden />
                <h2>¿Aparta mesa?</h2>
                <button type="button" className="bm-btn bm-carbon" onClick={alReservar}>
                  Reservar mesa
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

const ICONOS = { recibido: ClipboardCheck, parrilla: Flame, empacado: Package, camino: Bike, entregado: Check };
const FRASES = {
  recibido: "Cocina ya tiene su orden.",
  parrilla: "Su comida está sobre la brasa.",
  empacado: "Todo va sellado y caliente.",
  camino: "El repartidor va hacia usted.",
  entregado: "Pedido entregado. ¡Buen provecho!",
};

function Rastreo({ p }: { p: Pedido }) {
  const barra = useRef<HTMLSpanElement>(null);
  const anterior = useRef(0);
  const pasos = ETAPAS.slice(0, 4);
  const actual = ETAPAS.indexOf(p.etapa);
  const avance = Math.min(1, actual / (pasos.length - 1));

  useLayoutEffect(() => {
    const el = barra.current;
    if (!el) return;
    const desde = anterior.current;
    anterior.current = avance;
    const poner = (n: number) => el.style.setProperty("--avance", String(n));
    if (sinMovimiento()) return poner(avance);
    const paso = { n: desde };
    poner(desde);
    const a = animate(paso, { n: avance, duration: 800, ease: "inOutCubic", onUpdate: () => poner(paso.n) });
    const seguro = window.setTimeout(() => poner(avance), 1200);
    return () => {
      window.clearTimeout(seguro);
      a.cancel();
    };
  }, [avance]);

  const entregado = p.etapa === "entregado";
  const frase = p.etapa === "camino" && p.modo === "recoger" ? "Ya puede pasar por su pedido." : FRASES[p.etapa];

  return (
    <article className="bm-tarjeta bm-rastreo">
      <header>
        <div>
          <h2>{p.codigo}</h2>
          <p>
            {p.modo === "domicilio" ? `A domicilio · ${envioDe(p.envio).nombre}` : "Recoge en restaurante"} · pedido a las {reloj(p.creado)}
          </p>
        </div>
        <div className="bm-llega">
          <small>{entregado ? "Entregado" : p.modo === "domicilio" ? "Llega cerca de" : "Listo cerca de"}</small>
          <b>{reloj(entregado ? (p.marcas.entregado ?? estimado(p)) : estimado(p))}</b>
        </div>
      </header>

      <p className="bm-estado" role="status">
        <b>{nombreEtapa(p.etapa, p.modo)}.</b> {frase}
      </p>

      <div className="bm-pasos">
        <span ref={barra} className="bm-barra-avance" aria-hidden />
        <ol>
          {pasos.map((e, i) => {
            const Icono = e === "camino" && p.modo === "recoger" ? ShoppingBag : ICONOS[e];
            const hecho = i < actual || entregado;
            return (
              <li key={e} data-estado={hecho ? "hecho" : i === actual ? "ahora" : "falta"} aria-current={i === actual && !entregado ? "step" : undefined}>
                <i>{hecho ? <Check size={20} aria-hidden /> : <Icono size={20} aria-hidden />}</i>
                <span>
                  <b>{nombreEtapa(e, p.modo)}</b>
                  <small>{p.marcas[e] ? reloj(p.marcas[e]) : "Pendiente"}</small>
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <ul className="bm-detalle">
        {p.lineas.map((l) => (
          <li key={l.clave}>
            <img src={foto(platoDe(l.id).foto, 160, 160)} alt="" />
            <div>
              <b>
                {l.cantidad} × {platoDe(l.id).nombre}
              </b>
              {detalleLinea(l) && <small>{detalleLinea(l)}</small>}
            </div>
            <strong>{qz(platoDe(l.id).precio * l.cantidad)}</strong>
          </li>
        ))}
      </ul>
      <dl className="bm-cuentas">
        {p.costoEnvio > 0 && (
          <div>
            <dt>Envío</dt>
            <dd>{qz(p.costoEnvio)}</dd>
          </div>
        )}
        <div className="bm-cuentas-total">
          <dt>Total</dt>
          <dd>{qz(totalPedido(p))}</dd>
        </div>
      </dl>
      <p className="bm-lugar">
        <MapPin size={17} aria-hidden /> {p.modo === "domicilio" ? p.cliente.direccion : DIRECCION}
      </p>
      <a className="bm-btn bm-linea" href={enlaceWhatsApp(`${mensajePedido(p)}\n\nTengo una consulta sobre este pedido.`)} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={18} aria-hidden /> Consultar por WhatsApp
      </a>
    </article>
  );
}

const ESTADOS = { confirmada: "Confirmada", sentada: "En su mesa", cancelada: "Cancelada" };

function Mesa({ r, b }: { r: Reserva; b: Brasa }) {
  const [editando, setEditando] = useState<"no" | "hora" | "cancelar">("no");
  const [fecha, setFecha] = useState(r.fecha);
  const [hora, setHora] = useState(r.hora);
  const z = zonaDe(r.zona);
  const horas = horasConCupo(fecha, r.zona, b.estado.reservas, r.codigo);
  const valida = horas.some((h) => h.hora === hora && h.libre);

  return (
    <article className={`bm-tarjeta bm-reserva bm-es-${r.estado}`}>
      <img src={foto(z.foto, 720, 300)} alt={z.alt} />
      <div>
        <header>
          <h2>Mesa en {z.nombre}</h2>
          <span className="bm-etiqueta" role="status">
            {ESTADOS[r.estado]}
          </span>
        </header>
        <ul>
          <li>
            <CalendarDays size={17} aria-hidden /> {fechaLarga(r.fecha)}
          </li>
          <li>
            <Clock size={17} aria-hidden /> {r.hora}
          </li>
          <li>
            <Users size={17} aria-hidden /> {r.personas} {r.personas === 1 ? "persona" : "personas"}
            {r.mesa ? ` · mesa ${r.mesa}` : ""}
          </li>
        </ul>
        <p className="bm-nota">
          {r.codigo} · {r.nombre}
        </p>

        {r.estado === "confirmada" && editando === "no" && (
          <div className="bm-botones">
            <button
              type="button"
              className="bm-btn bm-carbon"
              onClick={() => {
                setFecha(r.fecha);
                setHora(r.hora);
                setEditando("hora");
              }}
            >
              Modificar hora
            </button>
            <button type="button" className="bm-btn bm-linea" onClick={() => setEditando("cancelar")}>
              Cancelar
            </button>
            <a className="bm-enlace" href={enlaceWhatsApp(mensajeReserva(r))} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} aria-hidden /> Compartir por WhatsApp
            </a>
          </div>
        )}

        {r.estado === "confirmada" && editando === "hora" && (
          <div className="bm-cambio">
            <label className="bm-campo">
              <span>Fecha</span>
              <input type="date" value={fecha} min={hoyISO()} max={masDias(60)} onChange={(e) => setFecha(e.target.value)} />
            </label>
            <Horas horas={fecha <= masDias(60) ? horas : []} valor={hora} alElegir={setHora} />
            <div className="bm-botones">
              <button
                type="button"
                className="bm-btn bm-terra"
                disabled={!valida}
                onClick={() => {
                  b.cambiarHora(r.codigo, fecha, hora);
                  setEditando("no");
                }}
              >
                Guardar cambio
              </button>
              <button type="button" className="bm-btn bm-linea" onClick={() => setEditando("no")}>
                Dejar como estaba
              </button>
            </div>
          </div>
        )}

        {r.estado === "confirmada" && editando === "cancelar" && (
          <div className="bm-cambio">
            <p>
              <b>¿Cancelar su mesa?</b> El espacio queda libre para otra persona.
            </p>
            <div className="bm-botones">
              <button type="button" className="bm-btn bm-terra" onClick={() => b.cancelarReserva(r.codigo)}>
                Sí, cancelar
              </button>
              <button type="button" className="bm-btn bm-linea" onClick={() => setEditando("no")}>
                Conservar mi mesa
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
