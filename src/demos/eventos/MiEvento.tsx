import { useState, type FormEvent } from "react";
import { Check, CircleCheck, Clock, Copy, CreditCard, FileText, Landmark, Lock, MapPin, Navigation, Plus, Printer, ShieldCheck, Trash2 } from "lucide-react";
import { ARTICULOS, IDS, MEDIOS, ZONAS, cronograma, cuentas, diaCorto, diaLargo, esTarjeta, liquidacion, num, pagado, porVerificar, qz, renglones, type ArtId, type Camion, type Entrega, type Imperial, type Medio, type Orden } from "./datos";
import { ancho, boton, campo, rotulo, tarjeta } from "./estilos";
import { Contador, Logo, Ventana } from "./Piezas";

type Etapa = { nombre: string; detalle: string };

function etapas(o: Orden, camion?: Camion): { lista: Etapa[]; hechas: number } {
  const c = cuentas(o.cesta, o.zona);
  const cosas = renglones(o.cesta);
  const cargados = cosas.filter((r) => o.cargado.includes(r.id)).length;
  const { llegada, recoleccion } = cronograma(o);
  const lista = [
    { nombre: "Anticipo pagado", detalle: pagado(o) >= c.anticipo ? "Fecha confirmada" : `Falta ${qz(c.anticipo - Math.min(pagado(o), c.anticipo))}` },
    { nombre: "Camión en carga", detalle: o.estado === "reservada" ? (cargados ? `${cargados} de ${cosas.length} renglones arriba` : camion ? `${camion.nombre} asignado` : "Por asignar") : "Salió de bodega" },
    { nombre: "Montaje en sitio", detalle: o.estado === "evento" ? `Desde las ${llegada} h` : o.estado === "reservada" ? `${diaCorto(o.fecha)}, ${llegada} h` : "Terminado" },
    { nombre: "Retorno y depósito", detalle: o.estado === "liquidada" ? `Devuelto ${qz(liquidacion(o).devolver)}` : o.estado === "retorno" ? "En revisión" : `${diaCorto(recoleccion)}, 7:00 h` },
  ];
  const hechas = o.estado === "liquidada" ? 4 : o.estado === "retorno" ? 3 : o.estado === "evento" ? 2 : pagado(o) >= c.anticipo ? (cargados || camion?.estado === "carga" ? 1.5 : 1) : 0;
  return { lista, hechas };
}

export function MiEvento({ imp, folio, alFolio, alCotizar }: { imp: Imperial; folio: string; alFolio: (f: string) => void; alCotizar: () => void }) {
  const mios = imp.ordenes.filter((o) => o.mia).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const o = mios.find((x) => x.folio === folio) ?? mios.find((x) => x.nueva) ?? mios[0];
  const [ventana, setVentana] = useState<"" | "pago" | "hoja">("");

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

  const camion = imp.camiones.find((c) => c.id === o.camion);

  return (
    <div className={`${ancho} py-8 sm:py-10`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#A16207]">Portal del cliente</p>
          <h1 className="mt-1 text-3xl sm:text-4xl">Mi Evento</h1>
        </div>
        <label className="block w-full min-w-0 sm:w-80">
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-[#57534E]">Reserva</span>
          <select value={o.folio} onChange={(e) => alFolio(e.target.value)} className={`${campo} font-semibold`}>
            {mios.map((x) => (
              <option key={x.folio} value={x.folio}>
                {x.folio} · {x.evento} {x.lugar}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Banner o={o} camion={camion} />

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="grid min-w-0 gap-6 lg:col-span-7">
          <Garita o={o} camion={camion} imp={imp} />
          <Manifiesto o={o} imp={imp} />
        </div>
        <div className="grid min-w-0 gap-3 lg:sticky lg:top-24 lg:col-span-5">
          <EstadoCuenta o={o} alPagar={() => setVentana("pago")} />
          <button type="button" onClick={() => setVentana("hoja")} className={`${boton.linea} w-full`}>
            <FileText size={17} aria-hidden /> Ver hoja de reserva
          </button>
        </div>
      </div>

      {ventana === "pago" && <ReportarPago o={o} imp={imp} alCerrar={() => setVentana("")} />}
      {ventana === "hoja" && <HojaReserva o={o} camion={camion} alCerrar={() => setVentana("")} />}
    </div>
  );
}

function Banner({ o, camion }: { o: Orden; camion?: Camion }) {
  const { lista, hechas } = etapas(o, camion);
  const { llegada, listo, recoleccion } = cronograma(o);
  const horas = [
    ["Llega el camión", `${llegada} h`],
    ["Montaje listo", `${listo} h`],
    ["Su evento", `${o.hora} h`],
    ["Recolección", `${diaCorto(recoleccion)}, 7:00 a 11:00`],
  ];
  return (
    <section aria-label="Avance de su evento" className="mt-6 overflow-hidden rounded-2xl bg-[#1C1917] p-6 text-[#D6CCBF] sm:p-8">
      <p className="text-sm font-bold text-[#F0CC85]">{o.folio}</p>
      <h2 className="mt-1 text-[clamp(1.6rem,3.4vw,2.4rem)] !leading-tight !text-white">
        {o.evento} · {o.lugar}
      </h2>
      <p className="mt-2 first-letter:uppercase">
        {diaLargo(o.fecha)} · {ZONAS[o.zona].nombre}
      </p>

      <ol className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
        {lista.map((e, k) => {
          const hecha = k < Math.floor(hechas);
          const actual = !hecha && k === Math.floor(hechas);
          const lleno = hecha ? 100 : actual && hechas % 1 ? 50 : actual ? 12 : 0;
          return (
            <li key={e.nombre} aria-current={actual ? "step" : undefined} className="min-w-0">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-[#F0CC85] transition-[width] duration-500" style={{ width: `${lleno}%` }} />
              </div>
              <p className={`mt-3 flex items-center gap-2 text-sm font-bold ${hecha || actual ? "text-white" : "text-[#8A8076]"}`}>
                <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs ${hecha ? "bg-[#F0CC85] text-[#1C1917]" : actual ? "border border-[#F0CC85] text-[#F0CC85]" : "border border-white/25"}`}>{hecha ? <Check size={14} aria-hidden /> : k + 1}</span>
                <span className="min-w-0">{e.nombre}</span>
              </p>
              <p className="mt-1 pl-8 text-xs">{e.detalle}</p>
            </li>
          );
        })}
      </ol>

      <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-white/15 pt-5 md:grid-cols-4">
        {horas.map(([n, v]) => (
          <div key={n} className="min-w-0">
            <dt className="text-xs">{n}</dt>
            <dd className="mt-0.5 font-bold text-white">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function semilla(texto: string) {
  let h = 2166136261;
  for (const ch of texto) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function Qr({ texto }: { texto: string }) {
  const lado = 25;
  const azar = semilla(texto);
  const enEsquina = (x: number, y: number) => {
    for (const [ex, ey] of [[0, 0], [lado - 7, 0], [0, lado - 7]]) {
      const dx = x - ex;
      const dy = y - ey;
      if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) ? 1 : 0;
      if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) return 0;
    }
    return -1;
  };
  const celdas = Array.from({ length: lado * lado }, (_, i) => {
    const e = enEsquina(i % lado, Math.floor(i / lado));
    return e === -1 ? azar() > 0.52 : e === 1;
  });
  return (
    <div role="img" aria-label={`Código del pase ${texto}`} className="grid aspect-square w-full rounded-lg bg-white p-2" style={{ gridTemplateColumns: `repeat(${lado}, minmax(0, 1fr))` }}>
      {celdas.map((negra, i) => (
        <span key={i} className={negra ? "bg-[#1C1917]" : ""} />
      ))}
    </div>
  );
}

function textoPase(o: Orden, camion?: Camion) {
  const e = o.entrega;
  return [
    `CASA IMPERIAL · Pase de ingreso ${o.folio}`,
    `${o.evento} · ${o.lugar}`,
    `${diaLargo(o.fecha)}, llegada ${cronograma(o).llegada} h`,
    camion ? `${camion.nombre} · ${camion.ton} · Placa ${camion.placa}` : "Camión por asignar",
    camion ? `Piloto: ${camion.pilotoCompleto} · DPI ${camion.dpi}` : "",
    e?.recibe ? `Recibe: ${e.recibe}` : "",
    e?.notas ? `Acceso: ${e.notas}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function Garita({ o, camion, imp }: { o: Orden; camion?: Camion; imp: Imperial }) {
  const [copiado, setCopiado] = useState<"" | "si" | "no">("");
  const salio = o.estado === "retorno" || o.estado === "liquidada";

  async function copiar() {
    try {
      await navigator.clipboard.writeText(textoPase(o, camion));
      setCopiado("si");
    } catch {
      setCopiado("no");
    }
    window.setTimeout(() => setCopiado(""), 2200);
  }

  return (
    <section className={`${tarjeta} overflow-hidden`} aria-labelledby="garita">
      <div className="p-6 sm:p-7">
        <h2 id="garita" className="flex items-center gap-2 text-2xl">
          <ShieldCheck size={22} aria-hidden className="text-[#A16207]" /> Pase de garita
        </h2>
        <p className="mt-1 text-sm">Autorización de ingreso para la seguridad de la finca o el condominio.</p>

        <div className="mt-5 grid gap-5 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
          <div className="max-w-40 rounded-xl border border-[#E4DDD3] bg-[#F3EFEA] p-2">
            <Qr texto={`${o.folio}-${camion?.placa ?? "pendiente"}`} />
            <p className="mt-1.5 text-center text-xs font-bold tracking-[0.12em] text-[#1C1917]">{o.folio}</p>
          </div>
          <dl className="grid content-start gap-3 text-[0.95rem]">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.1em] text-[#8A8076]">Vehículo</dt>
              <dd className="font-bold text-[#1C1917]">{camion ? `${camion.nombre} · ${camion.ton} · Placa ${camion.placa}` : "Se asigna 24 horas antes"}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.1em] text-[#8A8076]">Piloto</dt>
              <dd className="font-bold text-[#1C1917]">{camion ? camion.pilotoCompleto : "Por confirmar"}</dd>
              {camion && <dd className="text-sm">DPI {camion.dpi}</dd>}
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.1em] text-[#8A8076]">Ingreso</dt>
              <dd className="font-bold text-[#1C1917]">
                {diaCorto(o.fecha)}, {cronograma(o).llegada} h · con 3 montadores
              </dd>
            </div>
          </dl>
        </div>

        <button type="button" onClick={copiar} disabled={salio} className={`${copiado === "si" ? boton.oscuro : boton.bronce} mt-5 w-full`}>
          {copiado === "si" ? <Check size={17} aria-hidden /> : <Copy size={17} aria-hidden />}
          {copiado === "si" ? "Pase copiado" : copiado === "no" ? "No se pudo copiar; intente de nuevo" : "Copiar pase para seguridad / garita"}
        </button>
      </div>

      <Entregas key={o.folio} o={o} imp={imp} bloqueado={salio} />
    </section>
  );
}

function Entregas({ o, imp, bloqueado }: { o: Orden; imp: Imperial; bloqueado: boolean }) {
  const guardado: Entrega = o.entrega ?? { mapa: "", recibe: "", notas: "" };
  const [d, setD] = useState(guardado);
  const [error, setError] = useState("");
  const [listo, setListo] = useState(false);
  const cambio = d.mapa !== guardado.mapa || d.recibe !== guardado.recibe || d.notas !== guardado.notas;
  const poner = (k: keyof Entrega) => (e: { target: { value: string } }) => {
    setListo(false);
    setD((x) => ({ ...x, [k]: e.target.value }));
  };

  function guardar(e: FormEvent) {
    e.preventDefault();
    const mapa = d.mapa.trim();
    if (mapa && !/^https?:\/\/\S+\.\S+/.test(mapa)) return setError("Pegue el enlace completo de Waze o Google Maps (empieza con https://).");
    setError("");
    const limpio = { mapa, recibe: d.recibe.trim(), notas: d.notas.trim() };
    imp.cambiarOrden(o.folio, (x) => ({ ...x, entrega: limpio }));
    setD(limpio);
    setListo(true);
  }

  return (
    <form onSubmit={guardar} noValidate className="grid gap-4 border-t border-[#E4DDD3] bg-[#FAF8F5] p-6 sm:p-7">
      <h3 className="flex items-center gap-2 text-lg">
        <MapPin size={19} aria-hidden className="text-[#A16207]" /> Detalles de entrega
      </h3>
      <fieldset disabled={bloqueado} className="grid min-w-0 gap-4 disabled:opacity-60">
        <label className="block min-w-0">
          <span className={rotulo}>Link de Waze o Google Maps</span>
          <div className="flex gap-2">
            <input className={campo} value={d.mapa} onChange={poner("mapa")} inputMode="url" placeholder="https://maps.app.goo.gl/…" />
            {guardado.mapa && (
              <a href={guardado.mapa} target="_blank" rel="noopener noreferrer" aria-label="Abrir la ubicación guardada" className={`${boton.linea} size-12 shrink-0 !px-0`}>
                <Navigation size={18} aria-hidden />
              </a>
            )}
          </div>
        </label>
        <label className="block min-w-0">
          <span className={rotulo}>Teléfono de quien recibe en el evento</span>
          <input className={campo} value={d.recibe} onChange={poner("recibe")} inputMode="tel" maxLength={60} placeholder="Número y nombre" />
        </label>
        <label className="block min-w-0">
          <span className={rotulo}>Notas de acceso</span>
          <textarea className={`${campo} !h-24 py-2.5`} value={d.notas} onChange={poner("notas")} maxLength={240} placeholder="Portón de proveedores, gradas, terreno plano…" />
        </label>
      </fieldset>
      {error && (
        <p role="alert" className="text-sm font-semibold text-[#9F2F1E]">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={bloqueado || !cambio} className={boton.oscuro}>
          Guardar detalles
        </button>
        <p role="status" className="text-sm font-semibold text-[#3F6212]">
          {listo && !cambio ? "Guardado. Logística ya lo ve en su orden." : ""}
        </p>
      </div>
    </form>
  );
}

function Manifiesto({ o, imp }: { o: Orden; imp: Imperial }) {
  const editable = o.estado === "reservada";
  const cosas = renglones(o.cesta);
  const extras = IDS.filter((id) => !o.cesta[id] && imp.libres(o.fecha, id) > 0);
  const [nueva, setNueva] = useState<ArtId | "">("");
  const elegida = nueva && extras.includes(nueva) ? nueva : "";

  const poner = (id: ArtId, n: number) =>
    imp.cambiarOrden(o.folio, (x) => {
      const cesta = { ...x.cesta, [id]: n };
      if (!n) delete cesta[id];
      return { ...x, cesta, cargado: x.cargado.filter((y) => y !== id) };
    });

  function agregar() {
    if (!elegida) return;
    poner(elegida, Math.min(ARTICULOS[elegida].paso, imp.libres(o.fecha, elegida)));
    setNueva("");
  }

  return (
    <section className={`${tarjeta} p-6 sm:p-7`} aria-labelledby="manifiesto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="manifiesto" className="text-2xl">
          Manifiesto de piezas
        </h2>
        <span className="text-sm font-semibold">{num(cosas.reduce((s, r) => s + r.n, 0))} piezas</span>
      </div>
      {!editable && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-[#F3EFEA] p-3 text-sm">
          <Lock size={16} aria-hidden className="mt-0.5 shrink-0 text-[#A16207]" /> El mobiliario ya salió de bodega. Para cambios, comuníquese con logística.
        </p>
      )}

      <ul className="mt-4 divide-y divide-[#EFE9E1]">
        {cosas.map((r) => {
          const max = r.n + imp.libres(o.fecha, r.id);
          return (
            <li key={r.id} className="grid items-center gap-x-4 gap-y-2 py-3 sm:grid-cols-[minmax(0,1fr)_10.5rem_5.5rem]">
              <p className="min-w-0">
                <b className="block text-[#1C1917]">{r.art.nombre}</b>
                <span className="text-sm text-[#6B625B]">
                  {qz(r.art.precio)} c/u{editable ? ` · hasta ${num(max)} ese día` : ""}
                </span>
              </p>
              {editable ? (
                <div className="flex items-center gap-2">
                  <Contador valor={r.n} max={max} paso={r.art.paso} nombre={r.art.nombre} alCambiar={(n) => poner(r.id, n)} />
                  <button type="button" onClick={() => poner(r.id, 0)} aria-label={`Quitar ${r.art.nombre}`} className="grid size-11 shrink-0 place-items-center rounded-lg text-[#9F2F1E] hover:bg-[#FBE3DC] sm:hidden">
                    <Trash2 size={16} aria-hidden />
                  </button>
                </div>
              ) : (
                <b className="text-lg text-[#1C1917] sm:text-right">{num(r.n)}</b>
              )}
              <p className="font-semibold text-[#1C1917] max-sm:hidden sm:text-right">{qz(r.n * r.art.precio)}</p>
            </li>
          );
        })}
      </ul>
      {!cosas.length && <p className="py-4 text-sm">No quedan piezas en su reserva. Agregue alguna del catálogo.</p>}

      {editable && (
        <div className="mt-4 flex flex-col gap-2 border-t border-[#E4DDD3] pt-4 sm:flex-row">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Pieza extra del catálogo</span>
            <select className={campo} value={elegida} onChange={(e) => setNueva(e.target.value as ArtId)}>
              <option value="">Agregar pieza extra del catálogo…</option>
              {extras.map((id) => (
                <option key={id} value={id}>
                  {ARTICULOS[id].nombre} · {qz(ARTICULOS[id].precio)} · {num(imp.libres(o.fecha, id))} libres
                </option>
              ))}
            </select>
          </label>
          <button type="button" disabled={!elegida} onClick={agregar} className={boton.oscuro}>
            <Plus size={17} aria-hidden /> Agregar
          </button>
        </div>
      )}
    </section>
  );
}

function EstadoCuenta({ o, alPagar }: { o: Orden; alPagar: () => void }) {
  const c = cuentas(o.cesta, o.zona);
  const entro = pagado(o);
  const revisando = porVerificar(o);
  const debe = Math.max(0, c.total - entro);
  const favor = Math.max(0, entro - c.total);
  const l = liquidacion(o);

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
            <dd className="shrink-0 tabular-nums">{qz(v)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-t border-[#E4DDD3] pt-2 text-lg font-extrabold text-[#1C1917]">
          <dt>Total del evento</dt>
          <dd>{qz(c.total)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Pagado a la fecha</dt>
          <dd className="font-semibold text-[#3F6212]">− {qz(entro)}</dd>
        </div>
      </dl>

      <ul className="mt-5 grid gap-3">
        <li className={`flex items-center justify-between gap-4 rounded-xl p-4 ${entro >= c.anticipo ? "bg-[#EEF4E6] text-[#365314]" : "bg-[#FBEBC8] text-[#713F12]"}`}>
          <span className="flex min-w-0 items-center gap-2 font-bold">
            <CircleCheck size={18} aria-hidden className="shrink-0" />
            Anticipo 50% {entro >= c.anticipo ? "pagado" : "pendiente"}
          </span>
          <b className="shrink-0">{qz(c.anticipo)}</b>
        </li>
        <li className="rounded-xl bg-[#F3EFEA] p-4">
          <div className="flex items-end justify-between gap-4">
            <span className="min-w-0">
              <b className="block text-[#1C1917]">{favor ? "Saldo a su favor" : "Saldo pendiente"}</b>
              <span className="text-sm">{favor ? "Se aplica a su depósito o se le devuelve" : debe ? `Antes del montaje: ${diaCorto(o.fecha)}, ${cronograma(o).llegada} h` : "Su cuenta está al día"}</span>
            </span>
            <b className="shrink-0 text-3xl font-extrabold text-[#1C1917]">{qz(favor || debe)}</b>
          </div>
          {revisando > 0 && (
            <p className="mt-3 flex items-start gap-2 text-sm font-semibold text-[#713F12]">
              <Clock size={16} aria-hidden className="mt-0.5 shrink-0" /> {qz(revisando)} reportados, en verificación por logística.
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
              <ShieldCheck size={18} aria-hidden className="shrink-0 text-[#A16207]" /> Depósito en custodia
            </span>
            <b className="shrink-0 text-[#1C1917]">{qz(c.deposito)}</b>
          </div>
          <p className="mt-2 text-sm">
            {o.estado === "liquidada"
              ? `Liquidado: se le devuelven ${qz(l.devolver)}${l.cargo ? ` (descuento de ${qz(l.cargo)} por piezas faltantes o rotas)` : ", sin descuentos"}.`
              : o.estado === "retorno"
                ? "Estamos revisando su mobiliario; al terminar le enviamos el detalle y el reembolso."
                : entro >= c.deposito
                  ? `Se le devuelve al revisar el mobiliario, el ${diaLargo(cronograma(o).recoleccion)}.`
                  : "Queda en custodia al pagar su anticipo y se le devuelve al revisar el mobiliario."}
          </p>
        </li>
      </ul>

      {o.pagos.length > 0 && (
        <ul className="mt-5 divide-y divide-[#EFE9E1] border-t border-[#E4DDD3]">
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
      )}
    </section>
  );
}

function ReportarPago({ o, imp, alCerrar }: { o: Orden; imp: Imperial; alCerrar: () => void }) {
  const falta = Math.max(0, cuentas(o.cesta, o.zona).total - pagado(o) - porVerificar(o));
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
          <span className="min-w-0">Recibimos su reporte. Logística lo verifica y su saldo se actualiza aquí mismo.</span>
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
          <span className={rotulo}>{esTarjeta(medio) ? "Número de autorización" : "Número de boleta"}</span>
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

function HojaReserva({ o, camion, alCerrar }: { o: Orden; camion?: Camion; alCerrar: () => void }) {
  const c = cuentas(o.cesta, o.zona);
  const entro = pagado(o);
  const { llegada, listo, recoleccion } = cronograma(o);
  const datos = [
    ["Cliente", o.cliente],
    ["Evento", o.evento],
    ["Fecha", `${diaLargo(o.fecha)}, ${o.hora} h`],
    ["Lugar", `${o.lugar}, ${ZONAS[o.zona].nombre}`],
    ["Montaje", `${llegada} a ${listo} h`],
    ["Recolección", `${diaLargo(recoleccion)}, 7:00 a 11:00`],
    ["Vehículo", camion ? `${camion.nombre} · Placa ${camion.placa} · ${camion.pilotoCompleto}` : "Por asignar"],
    ["Recibe", o.entrega?.recibe || "Por confirmar"],
    ["Acceso", o.entrega?.notas || "Sin notas"],
  ];
  return (
    <Ventana titulo="Hoja de reserva" alCerrar={alCerrar} ancho="50rem">
      <style>{"@media print{body *{visibility:hidden}[data-hoja],[data-hoja] *{visibility:visible}[data-hoja]{position:absolute;inset:0;padding:2rem}dialog::backdrop{background:none}}"}</style>
      <article data-hoja className="mt-5 rounded-xl border border-[#E4DDD3] bg-white p-6 text-[0.92rem] sm:p-8">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#1C1917] pb-5">
          <Logo />
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A8076]">Hoja de reserva</p>
            <p className="font-(family-name:--ci-serif) text-2xl font-bold text-[#1C1917]">{o.folio}</p>
          </div>
        </header>

        <dl className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {datos.map(([n, v]) => (
            <div key={n} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-2">
              <dt className="font-bold text-[#1C1917]">{n}</dt>
              <dd className="min-w-0 first-letter:uppercase">{v}</dd>
            </div>
          ))}
        </dl>

        <table className="mt-6 w-full text-left">
          <thead>
            <tr className="border-b border-[#CFC6BA] text-xs uppercase tracking-[0.08em] text-[#8A8076]">
              <th className="py-2 pr-2 text-right font-bold">Cant.</th>
              <th className="py-2 font-bold">Pieza</th>
              <th className="py-2 text-right font-bold">Precio</th>
              <th className="py-2 text-right font-bold">Importe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE9E1]">
            {renglones(o.cesta).map((r) => (
              <tr key={r.id}>
                <td className="w-14 py-1.5 pr-2 text-right font-bold text-[#1C1917]">{num(r.n)}</td>
                <td className="py-1.5">{r.art.nombre}</td>
                <td className="py-1.5 text-right">{qz(r.art.precio)}</td>
                <td className="py-1.5 text-right text-[#1C1917]">{qz(r.n * r.art.precio)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="ml-auto mt-4 grid max-w-72 gap-1">
          {(
            [
              ["Mobiliario", c.subtotal],
              ["Flete y montaje", c.flete],
              ["Depósito de garantía (15%)", c.deposito],
              ["Total", c.total],
              ["Pagado", entro],
              ["Saldo", Math.max(0, c.total - entro)],
            ] as const
          ).map(([n, v]) => (
            <div key={n} className={`flex justify-between gap-4 ${n === "Total" || n === "Saldo" ? "border-t border-[#CFC6BA] pt-1 font-extrabold text-[#1C1917]" : ""}`}>
              <dt>{n}</dt>
              <dd>{qz(v)}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 border-t border-[#E4DDD3] pt-4 text-xs text-[#6B625B]">
          El depósito de garantía se devuelve al revisar el mobiliario; las piezas faltantes o rotas se descuentan a precio de reposición. El saldo se paga antes del montaje. Cambios de fecha con 72 horas de aviso, según disponibilidad.
        </p>
      </article>
      <button type="button" onClick={() => window.print()} className={`${boton.oscuro} mt-5 w-full`}>
        <Printer size={17} aria-hidden /> Imprimir o guardar en PDF
      </button>
    </Ventana>
  );
}
