/*
 * Mi Evento: lo que ve el cliente (o su wedding planner) de su reserva. Estado de cuenta con el
 * depósito en custodia, reporte de pagos, cronograma del día y manifiesto de piezas contratadas.
 */
import { useState, type FormEvent } from "react";
import { CalendarHeart, CircleCheck, Clock, CreditCard, Landmark, MapPin, MessageCircle, PartyPopper, ShieldCheck, Truck, Warehouse } from "lucide-react";
import { ESTADOS, MEDIOS, ZONAS, aFecha, cronograma, cuentas, dia, diaCorto, diaLargo, esTarjeta, liquidacion, num, pagado, porVerificar, qz, renglones, saldo, type ArtId, type Cesta, type Imperial, type Medio, type Orden } from "./datos";
import { ancho, boton, campo, pastilla, rotulo, tarjeta } from "./estilos";
import { Contador, Ventana } from "./Piezas";

export function MiEvento({ imp, folio, alFolio, alCotizar }: { imp: Imperial; folio: string; alFolio: (f: string) => void; alCotizar: () => void }) {
  const mios = imp.ordenes.filter((o) => o.mia).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const o = mios.find((x) => x.folio === folio) ?? mios.find((x) => x.nueva) ?? mios[0];
  const [ventana, setVentana] = useState<"" | "pago" | "ajuste">("");

  if (!o)
    return (
      <div className={`${ancho} py-16`}>
        <h1 className="text-3xl sm:text-4xl">Mi Evento</h1>
        <p className="mt-3">Todavía no tiene reservas. Arme su cotización y aparte su fecha.</p>
        <button type="button" onClick={alCotizar} className={`${boton.bronce} mt-6`}>
          Cotizar fecha
        </button>
      </div>
    );

  const faltan = Math.round((aFecha(o.fecha).getTime() - aFecha(dia(0)).getTime()) / 86400000);

  return (
    <div className={`${ancho} py-8 sm:py-10`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#A16207]">Portal del cliente</p>
          <h1 className="mt-1 text-3xl sm:text-4xl">Mi Evento</h1>
        </div>
        {mios.length > 1 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Sus reservas">
            {mios.map((x) => (
              <button key={x.folio} type="button" aria-pressed={x.folio === o.folio} onClick={() => alFolio(x.folio)} className={pastilla(x.folio === o.folio)}>
                {x.folio} · {x.evento}
              </button>
            ))}
          </div>
        )}
      </div>

      <section className="relative mt-6 overflow-hidden rounded-2xl bg-[#1C1917] p-6 text-[#D6CCBF] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
              <span className="text-[#F0CC85]">{o.folio}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white">{ESTADOS[o.estado]}</span>
            </p>
            <h2 className="mt-2 text-[clamp(1.6rem,3.4vw,2.4rem)] !leading-tight !text-white">
              {o.evento} · {o.lugar}
            </h2>
            <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
              <span className="inline-flex items-center gap-2 first-letter:uppercase">
                <CalendarHeart size={17} aria-hidden className="text-[#F0CC85]" /> {diaLargo(o.fecha)}, {o.hora} h
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={17} aria-hidden className="text-[#F0CC85]" /> {ZONAS[o.zona].nombre}
              </span>
            </p>
          </div>
          {faltan >= 0 && o.estado === "reservada" && (
            <p className="text-right">
              <span className="block font-(family-name:--ci-serif) text-5xl font-bold text-white">{faltan}</span>
              <span className="text-sm">{faltan === 0 ? "Es hoy" : faltan === 1 ? "día para su evento" : "días para su evento"}</span>
            </p>
          )}
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="grid min-w-0 gap-6 lg:col-span-7">
          <Cronograma o={o} imp={imp} />
          <Manifiesto o={o} alAjustar={() => setVentana("ajuste")} />
        </div>
        <div className="min-w-0 lg:sticky lg:top-24 lg:col-span-5">
          <EstadoCuenta o={o} alPagar={() => setVentana("pago")} />
        </div>
      </div>

      {ventana === "pago" && <ReportarPago o={o} imp={imp} alCerrar={() => setVentana("")} />}
      {ventana === "ajuste" && <Ajuste o={o} imp={imp} alCerrar={() => setVentana("")} />}
    </div>
  );
}

function EstadoCuenta({ o, alPagar }: { o: Orden; alPagar: () => void }) {
  const c = cuentas(o.cesta, o.zona);
  const entro = pagado(o);
  const revisando = porVerificar(o);
  const debe = saldo(o);
  const conAnticipo = entro >= c.anticipo;
  const l = liquidacion(o);
  const { llegada } = cronograma(o);

  return (
    <section className={`${tarjeta} p-6 sm:p-7`} aria-labelledby="cuenta">
      <h2 id="cuenta" className="text-2xl">
        Estado de cuenta
      </h2>
      <dl className="mt-5 grid gap-2 text-[0.95rem]">
        {(
          [
            ["Mobiliario", c.subtotal],
            [`Flete y montaje · ${ZONAS[o.zona].nombre}`, c.flete],
            ["Depósito de garantía (15%)", c.deposito],
          ] as const
        ).map(([n, v]) => (
          <div key={n} className="flex justify-between gap-4">
            <dt className="min-w-0">{n}</dt>
            <dd className="shrink-0">{qz(v)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-t border-[#E4DDD3] pt-2 text-lg font-extrabold text-[#1C1917]">
          <dt>Total del evento</dt>
          <dd>{qz(c.total)}</dd>
        </div>
      </dl>

      <ul className="mt-5 grid gap-3">
        <li className={`flex items-center justify-between gap-4 rounded-xl p-4 ${conAnticipo ? "bg-[#EEF4E6] text-[#365314]" : "bg-[#FBEBC8] text-[#713F12]"}`}>
          <span className="flex min-w-0 items-center gap-2 font-bold">
            <CircleCheck size={18} aria-hidden className="shrink-0" />
            Anticipo 50% {conAnticipo ? "pagado" : "pendiente"}
          </span>
          <b className="shrink-0">{qz(c.anticipo)}</b>
        </li>
        <li className="rounded-xl bg-[#F3EFEA] p-4">
          <div className="flex items-end justify-between gap-4">
            <span className="min-w-0">
              <b className="block text-[#1C1917]">Saldo pendiente</b>
              <span className="text-sm">{debe ? `Antes del montaje: ${diaCorto(o.fecha)}, ${llegada} h` : "Su cuenta está al día"}</span>
            </span>
            <b className="shrink-0 text-3xl font-extrabold text-[#1C1917]">{qz(debe)}</b>
          </div>
          {revisando > 0 && (
            <p className="mt-3 flex items-start gap-2 text-sm font-semibold text-[#713F12]">
              <Clock size={16} aria-hidden className="mt-0.5 shrink-0" /> {qz(revisando)} reportados, en verificación por la bodega.
            </p>
          )}
          {debe > revisando && (o.estado === "reservada" || o.estado === "evento") && (
            <button type="button" onClick={alPagar} className={`${boton.bronce} mt-4 w-full`}>
              <CreditCard size={17} aria-hidden /> Reportar pago
            </button>
          )}
        </li>
        <li className="rounded-xl border border-[#A16207]/35 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="flex min-w-0 items-center gap-2 font-bold text-[#1C1917]">
              <ShieldCheck size={18} aria-hidden className="shrink-0 text-[#A16207]" /> Depósito de garantía (15%)
            </span>
            <b className="shrink-0 text-[#1C1917]">{qz(c.deposito)}</b>
          </div>
          <p className="mt-2 text-sm">
            {o.estado === "liquidada"
              ? `Liquidado: se le devuelven ${qz(l.devolver)}${l.cargo ? ` (descuento de ${qz(l.cargo)} por piezas faltantes o rotas)` : ", sin descuentos"}.`
              : o.estado === "retorno"
                ? "En custodia. Estamos revisando su mobiliario; al terminar le enviamos el detalle y el reembolso."
                : entro >= c.deposito
                  ? `En custodia. Se le devuelve después de revisar el mobiliario, el ${diaLargo(cronograma(o).recoleccion)}.`
                  : "Queda en custodia al pagar su anticipo, y se le devuelve al revisar el mobiliario."}
          </p>
        </li>
      </ul>

      {o.pagos.length > 0 && (
        <>
          <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.12em] text-[#57534E]">Pagos</h3>
          <ul className="mt-2 divide-y divide-[#EFE9E1]">
            {o.pagos.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="min-w-0">
                  <b className="block text-[#1C1917]">{p.medio}</b>
                  {p.ref} · {diaCorto(p.fecha)}
                </span>
                <span className="shrink-0 text-right">
                  <b className="block text-[#1C1917]">{qz(p.monto)}</b>
                  <span className={p.verificado ? "text-[#3F6212]" : "text-[#A16207]"}>{p.verificado ? "Verificado" : "Por verificar"}</span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function Cronograma({ o, imp }: { o: Orden; imp: Imperial }) {
  const { llegada, listo, recoleccion } = cronograma(o);
  const camion = imp.camiones.find((c) => c.id === o.camion);
  const paso = { reservada: 0, evento: 2, retorno: 4, liquidada: 4 }[o.estado];
  const pasos = [
    { icono: Truck, hora: `${llegada} h`, titulo: "Llega el camión", texto: camion ? `Piloto ${camion.piloto} en ${camion.nombre} (${camion.ton}). Necesita acceso hasta el punto de montaje.` : "Le confirmamos el camión y el piloto el día anterior." },
    { icono: Warehouse, hora: `${llegada} a ${listo} h`, titulo: "Montaje", texto: "Toldos, mesas, sillas y mantelería. Queda listo una hora antes de su evento." },
    { icono: PartyPopper, hora: `${o.hora} h`, titulo: "Su evento", texto: `${o.lugar}, ${ZONAS[o.zona].nombre}.` },
    { icono: Clock, hora: `${diaCorto(recoleccion)}, 7:00 a 11:00`, titulo: "Recolección", texto: "Retiramos todo y lo contamos en bodega. Ahí se revisa su depósito." },
  ];
  return (
    <section className={`${tarjeta} p-6 sm:p-7`} aria-labelledby="crono">
      <h2 id="crono" className="text-2xl">
        Cronograma del día
      </h2>
      <ol className="mt-5 grid gap-0">
        {pasos.map(({ icono: Icono, hora, titulo, texto }, k) => {
          const hecho = k < paso;
          return (
            <li key={titulo} className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-4 pb-5 last:pb-0">
              {k < pasos.length - 1 && <span aria-hidden className={`absolute left-[1.15rem] top-10 bottom-0 w-px ${hecho ? "bg-[#A16207]" : "bg-[#E4DDD3]"}`} />}
              <span className={`grid size-[2.3rem] place-items-center rounded-full ${hecho ? "bg-[#A16207] text-white" : "bg-[#F3EFEA] text-[#A16207]"}`}>
                {hecho ? <CircleCheck size={18} aria-hidden /> : <Icono size={18} aria-hidden />}
              </span>
              <div className="min-w-0 pt-1">
                <p className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <b className="text-[#1C1917]">{titulo}</b>
                  <span className="text-sm font-bold text-[#A16207]">{hora}</span>
                </p>
                <p className="mt-0.5 text-sm">{texto}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Manifiesto({ o, alAjustar }: { o: Orden; alAjustar: () => void }) {
  const cosas = renglones(o.cesta);
  const piezas = cosas.reduce((s, r) => s + r.n, 0);
  return (
    <section className={`${tarjeta} p-6 sm:p-7`} aria-labelledby="manifiesto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="manifiesto" className="text-2xl">
          Manifiesto de piezas
        </h2>
        <span className="text-sm font-semibold">{num(piezas)} piezas</span>
      </div>
      <table className="mt-4 w-full text-left text-[0.95rem]">
        <thead className="sr-only">
          <tr>
            <th>Cantidad</th>
            <th>Pieza</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EFE9E1]">
          {cosas.map((r) => (
            <tr key={r.id}>
              <td className="w-14 py-2.5 pr-3 text-right font-extrabold text-[#1C1917]">{num(r.n)}</td>
              <td className="py-2.5">
                {r.art.nombre}
                <span className="block text-xs text-[#6B625B]">{qz(r.art.precio)} c/u</span>
              </td>
              <td className="py-2.5 text-right font-semibold text-[#1C1917]">{qz(r.n * r.art.precio)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {o.estado === "reservada" ? (
        <button type="button" onClick={alAjustar} className={`${boton.linea} mt-5 w-full sm:w-auto`}>
          <MessageCircle size={17} aria-hidden /> Pedir ajuste de cantidades por WhatsApp
        </button>
      ) : (
        <p className="mt-5 text-sm">El mobiliario ya salió de bodega; para cambios llame directo a logística.</p>
      )}
    </section>
  );
}

function ReportarPago({ o, imp, alCerrar }: { o: Orden; imp: Imperial; alCerrar: () => void }) {
  const falta = saldo(o) - porVerificar(o);
  const [monto, setMonto] = useState(String(falta));
  const [medio, setMedio] = useState<Medio>("Visanet");
  const [ref, setRef] = useState("");
  const [error, setError] = useState("");
  const [listo, setListo] = useState(false);

  function enviar(e: FormEvent) {
    e.preventDefault();
    const n = Math.round(Number(monto.replace(/[^\d.]/g, "")));
    if (!n || n <= 0) return setError("Escriba el monto que pagó.");
    if (n > falta) return setError(`El saldo por pagar es de ${qz(falta)}.`);
    if (ref.trim().length < 4) return setError(esTarjeta(medio) ? "Escriba el número de autorización del voucher." : "Escriba el número de boleta o referencia.");
    imp.reportarPago(o.folio, { monto: n, medio, ref: esTarjeta(medio) ? `Aut. ${ref.trim()}` : ref.trim() });
    setListo(true);
  }

  if (listo)
    return (
      <Ventana titulo="Pago reportado" alCerrar={alCerrar}>
        <p className="mt-4 flex items-start gap-3">
          <CircleCheck size={22} aria-hidden className="mt-0.5 shrink-0 text-[#3F6212]" />
          <span className="min-w-0">Recibimos su reporte. La bodega lo verifica y su saldo se actualiza aquí mismo.</span>
        </p>
        <button type="button" onClick={alCerrar} className={`${boton.oscuro} mt-6 w-full`}>
          Listo
        </button>
      </Ventana>
    );

  return (
    <Ventana titulo="Reportar pago" alCerrar={alCerrar}>
      <p className="mt-2">
        {o.folio} · saldo por pagar <b className="text-[#1C1917]">{qz(falta)}</b>
      </p>
      <form onSubmit={enviar} noValidate className="mt-5 grid gap-5">
        <fieldset className="min-w-0">
          <legend className={rotulo}>¿Cómo pagó?</legend>
          <div className="grid grid-cols-2 gap-2">
            {MEDIOS.map((m) => (
              <button key={m} type="button" aria-pressed={m === medio} onClick={() => setMedio(m)} className={`flex min-h-12 min-w-0 items-center gap-2 rounded-lg border px-3 text-left text-sm font-bold transition ${m === medio ? "border-[#1C1917] bg-[#1C1917] text-white" : "border-[#D6CDC1] bg-white text-[#1C1917] hover:border-[#A16207]"}`}>
                {esTarjeta(m) ? <CreditCard size={17} aria-hidden className="shrink-0" /> : <Landmark size={17} aria-hidden className="shrink-0" />}
                <span className="min-w-0">{esTarjeta(m) ? `Tarjeta · ${m}` : m}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-[#6B625B]">{esTarjeta(medio) ? `Pague con el enlace de ${medio} que le enviamos por WhatsApp y anote la autorización del voucher.` : "Deposite o transfiera a la cuenta que le enviamos por WhatsApp y anote el número de boleta."}</p>
        </fieldset>
        <label className="block min-w-0">
          <span className={rotulo}>Monto pagado (Q)</span>
          <input className={campo} value={monto} onChange={(e) => setMonto(e.target.value)} inputMode="decimal" />
        </label>
        <label className="block min-w-0">
          <span className={rotulo}>{esTarjeta(medio) ? "Número de autorización" : "Número de boleta o referencia"}</span>
          <input className={campo} value={ref} onChange={(e) => setRef(e.target.value)} maxLength={24} autoComplete="off" />
        </label>
        {error && (
          <p role="alert" className="font-semibold text-[#9F2F1E]">
            {error}
          </p>
        )}
        <button type="submit" className={`${boton.bronce} !min-h-13 w-full text-base`}>
          Enviar reporte de pago
        </button>
      </form>
    </Ventana>
  );
}

function Ajuste({ o, imp, alCerrar }: { o: Orden; imp: Imperial; alCerrar: () => void }) {
  const [nueva, setNueva] = useState<Cesta>({ ...o.cesta });
  const cambios = renglones({ ...o.cesta, ...nueva })
    .map((r) => ({ id: r.id, antes: o.cesta[r.id] ?? 0, ahora: nueva[r.id] ?? 0, nombre: r.art.nombre }))
    .filter((x) => x.antes !== x.ahora);
  const texto = [`Casa Imperial · Ajuste para ${o.folio}`, `${o.evento}, ${diaLargo(o.fecha)}`, ...cambios.map((x) => `- ${x.nombre}: de ${x.antes} a ${x.ahora}`), "¿Me confirman si hay disponibilidad? Gracias."].join("\n");
  return (
    <Ventana titulo="Ajustar cantidades" alCerrar={alCerrar} ancho="40rem">
      <p className="mt-2">Cambie lo que necesite y mándelo por WhatsApp. Logística le confirma la disponibilidad y la nueva cuenta.</p>
      <ul className="mt-5 grid gap-3">
        {renglones(o.cesta).map((r) => (
          <li key={r.id} className="grid items-center gap-2 sm:grid-cols-[minmax(0,1fr)_11rem]">
            <span className="min-w-0">
              <b className="block text-[#1C1917]">{r.art.nombre}</b>
              <span className="text-sm text-[#6B625B]">Contratadas {num(r.n)} · libres ese día {num(imp.libres(o.fecha, r.id))}</span>
            </span>
            <Contador valor={nueva[r.id] ?? 0} max={r.n + imp.libres(o.fecha, r.id)} paso={r.art.paso} nombre={r.art.nombre} alCambiar={(n) => setNueva((x) => ({ ...x, [r.id as ArtId]: n }))} />
          </li>
        ))}
      </ul>
      {cambios.length > 0 ? (
        <a href={`https://wa.me/?text=${encodeURIComponent(texto)}`} target="_blank" rel="noopener noreferrer" onClick={alCerrar} className={`${boton.bronce} mt-6 w-full`}>
          <MessageCircle size={17} aria-hidden /> Enviar {cambios.length} {cambios.length === 1 ? "cambio" : "cambios"} por WhatsApp
        </a>
      ) : (
        <button type="button" disabled className={`${boton.bronce} mt-6 w-full`}>
          Cambie una cantidad para enviar
        </button>
      )}
    </Ventana>
  );
}
