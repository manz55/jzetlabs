/*
 * El dock del pedido: una barra abajo con los platillos y el total. Desde ahí sube la hoja
 * para revisar, dejar los datos y mandarlo por WhatsApp. La orden queda registrada al
 * instante en cocina y en "Mi Pedido".
 */
import { useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { animate } from "animejs";
import { Bike, Check, ChevronUp, MessageCircle, ShoppingBag, Trash2 } from "lucide-react";
import { sinMovimiento, useSalto } from "./animar";
import { Contador, Total, Ventana } from "./Piezas";
import { ENVIOS, abiertoAhora, detalleLinea, enlaceWhatsApp, envioDe, foto, mensajePedido, platoDe, qz, resumenPedido, totalPedido, type Brasa, type EnvioId, type Modo, type Pedido } from "./datos";

function Modos({ valor, alCambiar }: { valor: Modo; alCambiar: (m: Modo) => void }) {
  return (
    <div className="bm-modos" role="group" aria-label="Cómo recibe su pedido">
      <button type="button" aria-pressed={valor === "domicilio"} onClick={() => alCambiar("domicilio")}>
        <Bike size={16} aria-hidden /> A domicilio
      </button>
      <button type="button" aria-pressed={valor === "recoger"} onClick={() => alCambiar("recoger")}>
        <ShoppingBag size={16} aria-hidden />
        <span>
          Recoger<span className="bm-solo-ancho"> en restaurante</span>
        </span>
      </button>
    </div>
  );
}

export function Dock({ b, alAbrir }: { b: Brasa; alAbrir: () => void }) {
  const caja = useRef<HTMLDivElement>(null);
  const cuenta = useRef<HTMLElement>(null);
  const { cantidad, total, costoEnvio } = resumenPedido(b.estado);
  useSalto(cuenta, cantidad);

  useLayoutEffect(() => {
    if (!caja.current || sinMovimiento()) return;
    const a = animate(caja.current, { translateY: [90, 0], opacity: [0, 1], duration: 480, ease: "outCubic" });
    const seguro = window.setTimeout(() => a.complete(), 900);
    return () => {
      window.clearTimeout(seguro);
      a.revert();
    };
  }, []);

  return (
    <div className="bm-dock">
      <div ref={caja} className="bm-dock-caja" role="region" aria-label="Su pedido">
        <button type="button" className="bm-dock-resumen" onClick={alAbrir} aria-label={`Ver su pedido: ${cantidad} platillos, ${qz(total)}`}>
          <i ref={cuenta}>{cantidad}</i>
          <span>
            <small>
              {cantidad === 1 ? "platillo" : "platillos"} · {costoEnvio ? "con envío" : "sin cargo de envío"}
            </small>
            <Total valor={total} />
          </span>
          <ChevronUp size={18} aria-hidden />
        </button>
        <Modos valor={b.estado.modo} alCambiar={b.ponerModo} />
        <button type="button" className="bm-btn bm-terra" onClick={alAbrir}>
          <MessageCircle size={18} aria-hidden /> Pedir por WhatsApp
        </button>
      </div>
    </div>
  );
}

type Errores = Partial<Record<"nombre" | "telefono" | "direccion", string>>;

export function Hoja({ b, abierta, alCerrar, alSeguir }: { b: Brasa; abierta: boolean; alCerrar: () => void; alSeguir: () => void }) {
  const [errores, setErrores] = useState<Errores>({});
  const [enviado, setEnviado] = useState<Pedido | null>(null);
  const { lineas, modo, envio, cliente, agotados } = b.estado;
  const { subtotal, costoEnvio, total } = resumenPedido(b.estado);
  const sinExistencia = lineas.some((l) => agotados.includes(l.id));

  function cerrar() {
    setEnviado(null);
    setErrores({});
    alCerrar();
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault();
    const e: Errores = {};
    if (cliente.nombre.trim().length < 2) e.nombre = "Escriba su nombre.";
    if (cliente.telefono.replace(/\D/g, "").length !== 8) e.telefono = "Escriba un teléfono de 8 números.";
    if (modo === "domicilio" && cliente.direccion.trim().length < 8) e.direccion = "Escriba la dirección completa.";
    setErrores(e);
    const primero = Object.keys(e)[0];
    if (primero) {
      document.getElementById(`bm-${primero}`)?.focus();
      return;
    }
    const nuevo = b.enviarPedido();
    if (!nuevo) return;
    setEnviado(nuevo);
    window.open(enlaceWhatsApp(mensajePedido(nuevo)), "_blank", "noopener,noreferrer");
  }

  const campo = (id: keyof Errores) => ({
    id: `bm-${id}`,
    value: cliente[id],
    "aria-invalid": !!errores[id],
    onChange: (e: { target: { value: string } }) => {
      b.ponerCliente({ [id]: e.target.value });
      setErrores((x) => ({ ...x, [id]: undefined }));
    },
  });

  if (enviado) {
    return (
      <Ventana abierta={abierta} alCerrar={cerrar} titulo="Pedido registrado">
        <div className="bm-listo">
          <span className="bm-listo-icono">
            <Check size={30} aria-hidden />
          </span>
          <p className="bm-listo-codigo">{enviado.codigo}</p>
          <p>
            Cocina ya tiene su pedido por <b>{qz(totalPedido(enviado))}</b>. Envíe el mensaje en WhatsApp para confirmarlo.
          </p>
          <a className="bm-btn bm-terra" href={enlaceWhatsApp(mensajePedido(enviado))} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} aria-hidden /> Abrir WhatsApp
          </a>
          <button
            type="button"
            className="bm-btn bm-linea"
            onClick={() => {
              cerrar();
              alSeguir();
            }}
          >
            Seguir mi pedido
          </button>
        </div>
      </Ventana>
    );
  }

  return (
    <Ventana
      abierta={abierta}
      alCerrar={cerrar}
      titulo="Su pedido"
      pie={
        lineas.length > 0 && (
          <>
            <dl className="bm-cuentas">
              <div>
                <dt>Subtotal</dt>
                <dd>{qz(subtotal)}</dd>
              </div>
              {costoEnvio > 0 && (
                <div>
                  <dt>Envío a {envioDe(envio).nombre}</dt>
                  <dd>{qz(costoEnvio)}</dd>
                </div>
              )}
              <div className="bm-cuentas-total">
                <dt>Total</dt>
                <dd>{qz(total)}</dd>
              </div>
            </dl>
            <button type="submit" form="bm-pedido" className="bm-btn bm-terra bm-lleno" disabled={sinExistencia}>
              <MessageCircle size={18} aria-hidden /> Enviar pedido por WhatsApp
            </button>
          </>
        )
      }
    >
      {lineas.length === 0 ? (
        <div className="bm-listo">
          <p>Su pedido está vacío.</p>
          <button type="button" className="bm-btn bm-carbon" onClick={cerrar}>
            Volver a la carta
          </button>
        </div>
      ) : (
        <form id="bm-pedido" onSubmit={enviar} noValidate className="bm-form">
          <Modos valor={modo} alCambiar={b.ponerModo} />
          <ul className="bm-lineas">
            {lineas.map((l) => {
              const p = platoDe(l.id);
              const falta = agotados.includes(l.id);
              return (
                <li key={l.clave}>
                  <img src={foto(p.foto, 160, 160)} alt="" />
                  <div>
                    <b>{p.nombre}</b>
                    {detalleLinea(l) && <small>{detalleLinea(l)}</small>}
                    {falta ? <em>Se acaba de agotar. Quítelo para enviar.</em> : <strong>{qz(p.precio * l.cantidad)}</strong>}
                  </div>
                  {falta ? (
                    <button type="button" className="bm-cerrar" onClick={() => b.ponerCantidad(l.clave, 0)} aria-label={`Quitar ${p.nombre}`}>
                      <Trash2 size={18} aria-hidden />
                    </button>
                  ) : (
                    <Contador valor={l.cantidad} que={p.nombre} alCambiar={(n) => b.ponerCantidad(l.clave, n)} />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="bm-campos">
            <label className="bm-campo">
              <span>Nombre</span>
              <input {...campo("nombre")} autoComplete="name" />
              {errores.nombre && <em role="alert">{errores.nombre}</em>}
            </label>
            <label className="bm-campo">
              <span>Teléfono</span>
              <input {...campo("telefono")} inputMode="tel" autoComplete="tel-national" />
              {errores.telefono && <em role="alert">{errores.telefono}</em>}
            </label>
            {modo === "domicilio" && (
              <>
                <label className="bm-campo bm-ancho-total">
                  <span>Zona de entrega</span>
                  <select value={envio} onChange={(e) => b.ponerEnvio(e.target.value as EnvioId)}>
                    {ENVIOS.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.nombre} · {qz(z.precio)} · {z.minutos} min aprox.
                      </option>
                    ))}
                  </select>
                </label>
                <label className="bm-campo bm-ancho-total">
                  <span>Dirección</span>
                  <input {...campo("direccion")} autoComplete="street-address" placeholder="Calle, número, apartamento" />
                  {errores.direccion && <em role="alert">{errores.direccion}</em>}
                </label>
              </>
            )}
            <label className="bm-campo bm-ancho-total">
              <span>Notas para cocina (opcional)</span>
              <textarea rows={2} value={cliente.notas} onChange={(e) => b.ponerCliente({ notas: e.target.value })} />
            </label>
          </div>
          <p className="bm-nota">
            {abiertoAhora() ? "Paga al recibir, en efectivo o con tarjeta." : "En este momento está cerrado: su pedido se confirma al abrir. Paga al recibir."}
          </p>
        </form>
      )}
    </Ventana>
  );
}
