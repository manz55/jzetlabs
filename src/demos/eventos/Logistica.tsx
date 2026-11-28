/* Ventanas del Panel Logística: checklist de carga, revisión de retorno, despacho, liquidación y orden manual. */
import { useState, type FormEvent } from "react";
import { CircleCheck, PackageCheck, Truck } from "lucide-react";
import { ESTADOS, MEDIOS, PAQUETES, ZONAS, ZONA_IDS, cronograma, cuentas, dia, diaCorto, liquidacion, num, pagado, qz, renglones, saldo, sugerido, type ArtId, type Cesta, type Dano, type Imperial, type Medio, type Orden, type ZonaId } from "./datos";
import { boton, campo, rotulo } from "./estilos";
import { Contador, Ventana } from "./Piezas";

type Base = { imp: Imperial; alCerrar: () => void };
const libre = (imp: Imperial, folio: string) => imp.camiones.filter((c) => c.estado === "bodega" || c.estado === "carga" || c.orden === folio);

/* el camión asignado, si está libre; si no, el primero libre */
const camionPara = (imp: Imperial, o: Orden) => {
  const ok = libre(imp, o.folio);
  return ok.find((c) => c.id === o.camion)?.id ?? ok[0]?.id ?? "";
};

function ListaCarga({ o, imp }: { o: Orden; imp: Imperial }) {
  const cosas = renglones(o.cesta);
  const completo = cosas.every((r) => o.cargado.includes(r.id));
  const alternar = (id: ArtId) => imp.cambiarOrden(o.folio, (x) => ({ ...x, nueva: false, cargado: x.cargado.includes(id) ? x.cargado.filter((y) => y !== id) : [...x.cargado, id] }));
  return (
    <>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold text-[#1C1917]">
          {cosas.filter((r) => o.cargado.includes(r.id)).length} de {cosas.length} renglones cargados
        </p>
        <button type="button" onClick={() => imp.cambiarOrden(o.folio, (x) => ({ ...x, nueva: false, cargado: completo ? [] : cosas.map((r) => r.id) }))} className={`${boton.linea} !min-h-10`}>
          {completo ? "Desmarcar todo" : "Marcar todo"}
        </button>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {cosas.map((r) => {
          const hecho = o.cargado.includes(r.id);
          return (
            <li key={r.id}>
              <label className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 ${hecho ? "border-[#A16207] bg-[#FBF3E4]" : "border-[#E4DDD3] bg-white"}`}>
                <input type="checkbox" checked={hecho} onChange={() => alternar(r.id)} className="size-5 shrink-0 accent-[#A16207]" />
                <b className="w-11 shrink-0 text-right text-[#1C1917]">{num(r.n)}</b>
                <span className="min-w-0 text-sm">{r.art.nombre}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function SalidaCamion({ o, imp, alSalio }: { o: Orden; imp: Imperial; alSalio: () => void }) {
  const [camion, setCamion] = useState(() => camionPara(imp, o));
  const completo = renglones(o.cesta).every((r) => o.cargado.includes(r.id));
  const opciones = libre(imp, o.folio);
  const debe = saldo(o);
  return (
    <div className="mt-5 grid gap-3 rounded-xl bg-[#F3EFEA] p-4">
      <label className="block min-w-0">
        <span className={rotulo}>Camión</span>
        <select className={campo} value={camion} onChange={(e) => setCamion(e.target.value)}>
          {!opciones.length && <option value="">No hay camión libre</option>}
          {opciones.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} · {c.ton} · {c.piloto}
            </option>
          ))}
        </select>
      </label>
      <p className="text-sm">
        Llegada a {o.lugar}: {cronograma(o).llegada} h.{" "}
        {debe ? (
          <b className="text-[#9F2F1E]">Saldo de {qz(debe)}: cobrar antes de montar.</b>
        ) : (
          <b className="text-[#3F6212]">Cuenta al día.</b>
        )}
      </p>
      <button
        type="button"
        disabled={!completo || !camion}
        onClick={() => {
          imp.despachar(o.folio, camion);
          alSalio();
        }}
        className={`${boton.oscuro} !min-h-12 w-full`}
      >
        <Truck size={18} aria-hidden /> Despachar camión en ruta
      </button>
      {!completo && <p className="text-sm text-[#6B625B]">Marque cada renglón al subirlo para poder despachar.</p>}
    </div>
  );
}

export function Checklist({ o, imp, alCerrar }: Base & { o: Orden }) {
  return (
    <Ventana titulo={`Checklist de carga · ${o.folio}`} alCerrar={alCerrar} ancho="44rem">
      <p className="mt-2">
        {o.evento} · {o.cliente} · {diaCorto(o.fecha)}, {o.hora} h
      </p>
      <ListaCarga o={o} imp={imp} />
      {o.estado === "reservada" && <SalidaCamion o={o} imp={imp} alSalio={alCerrar} />}
    </Ventana>
  );
}

export function Despacho({ imp, alCerrar }: Base) {
  const porCargar = imp.ordenes.filter((o) => o.estado === "reservada").sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora));
  const [folio, setFolio] = useState(porCargar[0]?.folio ?? "");
  const o = porCargar.find((x) => x.folio === folio);
  return (
    <Ventana titulo="Despachar camión en ruta" alCerrar={alCerrar} ancho="44rem">
      {!porCargar.length ? (
        <p className="mt-4">No hay órdenes por cargar.</p>
      ) : (
        <>
          <label className="mt-4 block min-w-0">
            <span className={rotulo}>Orden</span>
            <select className={campo} value={folio} onChange={(e) => setFolio(e.target.value)}>
              {porCargar.map((x) => {
                const cosas = renglones(x.cesta);
                return (
                  <option key={x.folio} value={x.folio}>
                    {x.folio} · {diaCorto(x.fecha)} {x.hora} · {x.cliente} ({cosas.filter((r) => x.cargado.includes(r.id)).length}/{cosas.length} cargado)
                  </option>
                );
              })}
            </select>
          </label>
          {o && (
            <>
              <ListaCarga o={o} imp={imp} />
              <SalidaCamion key={o.folio} o={o} imp={imp} alSalio={alCerrar} />
            </>
          )}
        </>
      )}
    </Ventana>
  );
}

export function Liquidar({ imp, alCerrar, alRevisar }: Base & { alRevisar: (folio: string) => void }) {
  const lista = imp.ordenes.filter((o) => o.estado === "retorno" || (o.estado === "evento" && o.fecha < dia(0)));
  const fuera = imp.ordenes.filter((o) => o.estado === "evento" && o.fecha >= dia(0));
  return (
    <Ventana titulo="Liquidar retorno y depósito" alCerrar={alCerrar}>
      {lista.length ? (
        <ul className="mt-4 grid gap-2">
          {lista.map((o) => (
            <li key={o.folio}>
              <button type="button" onClick={() => alRevisar(o.folio)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#E4DDD3] bg-white p-4 text-left hover:border-[#A16207]">
                <span className="min-w-0">
                  <b className="block text-[#1C1917]">
                    {o.folio} · {o.cliente}
                  </b>
                  <span className="text-sm">
                    {o.evento} del {diaCorto(o.fecha)} · {ESTADOS[o.estado]}
                  </span>
                </span>
                <span className="shrink-0 text-right text-sm">
                  Depósito
                  <b className="block text-[#1C1917]">{qz(cuentas(o.cesta, o.zona).deposito)}</b>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4">No hay retornos por revisar.</p>
      )}
      {fuera.length > 0 && <p className="mt-4 text-sm">{fuera.length === 1 ? "1 orden sigue" : `${fuera.length} órdenes siguen`} en montaje o evento; aparecen aquí cuando regresen.</p>}
    </Ventana>
  );
}

function Cuentas({ o }: { o: Orden }) {
  const l = liquidacion(o);
  const danados = renglones(o.cesta).filter((r) => o.revision[r.id]?.faltan || o.revision[r.id]?.rotas);
  return (
    <dl className="grid gap-2 rounded-xl bg-[#F3EFEA] p-5">
      <div className="flex justify-between gap-4 font-bold text-[#1C1917]">
        <dt>Depósito en custodia</dt>
        <dd>{qz(l.deposito)}</dd>
      </div>
      {danados.map((r) => {
        const d = o.revision[r.id]!;
        return (
          <div key={r.id} className="flex justify-between gap-4 text-sm text-[#9F2F1E]">
            <dt className="min-w-0">
              {r.art.nombre}: {[d.faltan && `${d.faltan} faltante${d.faltan > 1 ? "s" : ""}`, d.rotas && `${d.rotas} rota${d.rotas > 1 ? "s" : ""}`].filter(Boolean).join(", ")} × {qz(r.art.reposicion)}
            </dt>
            <dd className="shrink-0 font-bold">− {qz((d.faltan + d.rotas) * r.art.reposicion)}</dd>
          </div>
        );
      })}
      {!danados.length && <p className="text-sm">Sin descuentos: todo regresó completo.</p>}
      <div className="mt-2 flex items-end justify-between gap-4 border-t border-[#CFC6BA] pt-3 text-[#1C1917]">
        <dt className="font-bold">Reembolso al cliente</dt>
        <dd className="text-3xl font-extrabold">{qz(l.devolver)}</dd>
      </div>
      {l.cobrar > 0 && (
        <div className="flex justify-between gap-4 font-bold text-[#9F2F1E]">
          <dt>Los daños superan el depósito; por cobrar</dt>
          <dd>{qz(l.cobrar)}</dd>
        </div>
      )}
    </dl>
  );
}

export function Revision({ o, imp, alCerrar }: Base & { o: Orden }) {
  const cerrada = o.estado === "liquidada";
  const poner = (id: ArtId, k: keyof Dano, n: number) => imp.cambiarOrden(o.folio, (x) => ({ ...x, revision: { ...x.revision, [id]: { ...(x.revision[id] ?? { faltan: 0, rotas: 0 }), [k]: n } } }));
  return (
    <Ventana titulo={`${cerrada ? "Liquidación" : "Revisión de retorno"} · ${o.folio}`} alCerrar={alCerrar} ancho="58rem">
      <p className="mt-2">
        {o.evento} · {o.cliente} · {diaCorto(o.fecha)}
      </p>
      <div className="mt-5 grid items-start gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {cerrada ? (
          <p>Orden cerrada. El detalle de descuentos queda a la derecha.</p>
        ) : (
          <div className="min-w-0">
            <p className="text-sm">Anote solo lo que falta o volvió roto; se descuenta del depósito a precio de reposición.</p>
            <ul className="mt-3 divide-y divide-[#EFE9E1]">
              {renglones(o.cesta).map((r) => {
                const d = o.revision[r.id] ?? { faltan: 0, rotas: 0 };
                return (
                  <li key={r.id} className="grid gap-2 py-3 lg:grid-cols-[minmax(0,1fr)_9.5rem_9.5rem] lg:items-end">
                    <p className="min-w-0 text-sm">
                      <b className="block text-[0.95rem] text-[#1C1917]">{r.art.nombre}</b>
                      Salieron {num(r.n)} · reposición {qz(r.art.reposicion)}
                    </p>
                    {(["faltan", "rotas"] as const).map((k) => (
                      <div key={k} className="min-w-0 max-lg:grid max-lg:grid-cols-[4rem_minmax(0,1fr)] max-lg:items-center">
                        <p className="mb-1 text-xs font-bold text-[#57534E] max-lg:mb-0">{k === "faltan" ? "Faltan" : "Rotas"}</p>
                        <Contador valor={d[k]} max={r.n - d[k === "faltan" ? "rotas" : "faltan"]} nombre={`${r.art.nombre}, ${k}`} alCambiar={(n) => poner(r.id, k, n)} />
                      </div>
                    ))}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <div className="md:sticky md:top-0">
          <Cuentas o={o} />
          {!cerrada && (
            <button
              type="button"
              onClick={() => {
                imp.cambiarOrden(o.folio, (x) => ({ ...x, estado: "liquidada" }));
                alCerrar();
              }}
              className={`${boton.bronce} mt-4 !min-h-12 w-full`}
            >
              <CircleCheck size={18} aria-hidden /> Cerrar revisión y liquidar depósito
            </button>
          )}
        </div>
      </div>
    </Ventana>
  );
}

const TIPOS = ["Boda", "Evento corporativo", "Cena de gala", "Recepción o cóctel", "Primera comunión o bautizo", "XV años", "Otro evento"];
const HORAS = ["12:00", "14:00", "16:00", "18:00", "19:00"];

export function NuevaOrden({ imp, alCerrar, alCreada }: Base & { alCreada: (folio: string) => void }) {
  const [d, setD] = useState({ cliente: "", tel: "", evento: TIPOS[0], lugar: "", zona: "ciudad" as ZonaId, fecha: dia(7), hora: "16:00", base: "invitados", invitados: "100", anticipo: false, medio: "Transferencia BI" as Medio, ref: "" });
  const [error, setError] = useState("");
  const poner = (k: keyof typeof d) => (e: { target: { value: string } }) => setD((x) => ({ ...x, [k]: e.target.value }));

  const ideal: Cesta = d.base === "invitados" ? sugerido(Math.max(10, Math.min(1500, Number(d.invitados) || 0))) : { ...PAQUETES.find((p) => p.id === d.base)!.cesta };
  /* lo que se pide, recortado a lo que queda libre esa fecha */
  const cesta: Cesta = Object.fromEntries(renglones(ideal).map((r) => [r.id, Math.min(r.n, imp.libres(d.fecha, r.id))]));
  const cortos = renglones(ideal).filter((r) => (cesta[r.id] ?? 0) < r.n);
  const c = cuentas(cesta, d.zona);

  function crear(e: FormEvent) {
    e.preventDefault();
    if (d.cliente.trim().length < 3) return setError("Escriba el nombre del cliente.");
    if (d.tel.replace(/\D/g, "").length !== 8) return setError("Escriba un teléfono de 8 dígitos.");
    if (d.lugar.trim().length < 3) return setError("Escriba la finca, salón o dirección.");
    if (d.fecha < dia(0)) return setError("La fecha ya pasó.");
    if (!renglones(cesta).length) return setError("No queda mobiliario libre para esa fecha.");
    if (d.anticipo && d.ref.trim().length < 4) return setError("Escriba la referencia del anticipo.");
    const o = imp.reservar({ cliente: d.cliente.trim(), tel: d.tel, evento: d.evento, lugar: d.lugar.trim(), zona: d.zona, fecha: d.fecha, hora: d.hora, cesta, origen: "manual" });
    if (d.anticipo) {
      imp.reportarPago(o.folio, { monto: c.anticipo, medio: d.medio, ref: d.ref.trim() });
      imp.verificarPagos(o.folio);
    }
    alCreada(o.folio);
  }

  return (
    <Ventana titulo="Nueva orden manual" alCerrar={alCerrar} ancho="46rem">
      <p className="mt-2">Para reservas que entran por teléfono o WhatsApp. El mobiliario se bloquea al crearla.</p>
      <form onSubmit={crear} noValidate className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block min-w-0">
          <span className={rotulo}>Cliente</span>
          <input className={campo} value={d.cliente} onChange={poner("cliente")} maxLength={60} />
        </label>
        <label className="block min-w-0">
          <span className={rotulo}>Teléfono</span>
          <input className={campo} value={d.tel} onChange={poner("tel")} inputMode="tel" maxLength={14} />
        </label>
        <label className="block min-w-0">
          <span className={rotulo}>Tipo de evento</span>
          <select className={campo} value={d.evento} onChange={poner("evento")}>
            {TIPOS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block min-w-0">
          <span className={rotulo}>Finca, salón o dirección</span>
          <input className={campo} value={d.lugar} onChange={poner("lugar")} maxLength={80} />
        </label>
        <label className="block min-w-0">
          <span className={rotulo}>Zona</span>
          <select className={campo} value={d.zona} onChange={poner("zona")}>
            {ZONA_IDS.map((z) => (
              <option key={z} value={z}>
                {ZONAS[z].nombre} · flete {qz(ZONAS[z].flete)}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-3">
          <label className="block min-w-0">
            <span className={rotulo}>Fecha</span>
            <input type="date" className={campo} value={d.fecha} min={dia(0)} onChange={poner("fecha")} />
          </label>
          <label className="block min-w-0">
            <span className={rotulo}>Hora</span>
            <select className={campo} value={d.hora} onChange={poner("hora")}>
              {HORAS.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block min-w-0">
          <span className={rotulo}>Mobiliario</span>
          <select className={campo} value={d.base} onChange={poner("base")}>
            <option value="invitados">Según invitados</option>
            {PAQUETES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>
        {d.base === "invitados" ? (
          <label className="block min-w-0">
            <span className={rotulo}>Invitados</span>
            <input className={campo} value={d.invitados} onChange={poner("invitados")} inputMode="numeric" maxLength={4} />
          </label>
        ) : (
          <span className="hidden sm:block" />
        )}

        <div className="rounded-xl bg-[#F3EFEA] p-4 text-sm sm:col-span-2">
          <p className="text-[#1C1917]">{renglones(cesta).map((r) => `${num(r.n)} ${r.art.nombre.toLowerCase()}`).join(" · ") || "Sin mobiliario libre"}</p>
          {cortos.length > 0 && <p className="mt-2 font-semibold text-[#9F2F1E]">No alcanza el {diaCorto(d.fecha)}: {cortos.map((r) => r.art.nombre.toLowerCase()).join(", ")}. Quedó con lo libre.</p>}
          <p className="mt-2 font-bold text-[#1C1917]">
            Total {qz(c.total)} · Anticipo {qz(c.anticipo)} · Depósito {qz(c.deposito)}
          </p>
        </div>

        <label className="flex min-h-11 items-center gap-3 font-semibold text-[#1C1917] sm:col-span-2">
          <input type="checkbox" checked={d.anticipo} onChange={(e) => setD((x) => ({ ...x, anticipo: e.target.checked }))} className="size-5 accent-[#A16207]" />
          El anticipo de {qz(c.anticipo)} ya se recibió
        </label>
        {d.anticipo && (
          <>
            <label className="block min-w-0">
              <span className={rotulo}>Medio</span>
              <select className={campo} value={d.medio} onChange={poner("medio")}>
                {MEDIOS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="block min-w-0">
              <span className={rotulo}>Autorización o boleta</span>
              <input className={campo} value={d.ref} onChange={poner("ref")} maxLength={24} />
            </label>
          </>
        )}
        {error && (
          <p role="alert" className="font-semibold text-[#9F2F1E] sm:col-span-2">
            {error}
          </p>
        )}
        <button type="submit" className={`${boton.bronce} !min-h-12 w-full sm:col-span-2`}>
          <PackageCheck size={18} aria-hidden /> Crear orden y bloquear mobiliario
        </button>
      </form>
    </Ventana>
  );
}

/* texto para avisarle al cliente según cómo va su orden */
export function avisoWhatsApp(o: Orden) {
  const { llegada, recoleccion } = cronograma(o);
  const l = liquidacion(o);
  const debe = saldo(o);
  const cuerpo = {
    reservada: `Su ${o.evento.toLowerCase()} del ${diaCorto(o.fecha)}: el camión llega a ${o.lugar} a las ${llegada} h. ${debe ? `Le recordamos el saldo de ${qz(debe)} antes del montaje.` : "Su cuenta está al día."}`,
    evento: `Su mobiliario ya está en camino o montado en ${o.lugar}. Pasamos a recogerlo el ${diaCorto(recoleccion)} de 7:00 a 11:00.`,
    retorno: `Ya recibimos su mobiliario en bodega y lo estamos revisando. Al terminar le enviamos la liquidación de su depósito de ${qz(l.deposito)}.`,
    liquidada: `Revisión terminada: se le devuelven ${qz(l.devolver)} de su depósito de ${qz(l.deposito)}${l.cargo ? ` (descuento de ${qz(l.cargo)} por piezas faltantes o rotas)` : ""}.`,
  }[o.estado];
  return `https://wa.me/${o.tel ? `502${o.tel.replace(/\D/g, "")}` : ""}?text=${encodeURIComponent(`Hola, le saluda Casa Imperial (${o.folio}). ${cuerpo}`)}`;
}

export const pagoDe = (o: Orden) => {
  const c = cuentas(o.cesta, o.zona);
  const entro = pagado(o);
  if (entro >= c.total) return { texto: "Pagado", clase: "bg-[#E7F0DA] text-[#365314]" };
  if (entro < c.anticipo) return { texto: "Sin anticipo", clase: "bg-[#FBE3DC] text-[#9F2F1E]" };
  return { texto: `Saldo ${qz(c.total - entro)}`, clase: "bg-[#FBEBC8] text-[#713F12]" };
};
