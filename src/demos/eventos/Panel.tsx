/*
 * Panel Logística: centro de mando de bodega y flota. Atajos (Alt+1 a Alt+4), cifras del fin de
 * semana, control de órdenes y, a la derecha, la flota en vivo y las piezas críticas del sábado.
 */
import { useEffect, useState } from "react";
import { AlertTriangle, CalendarRange, ClipboardList, Gauge, HandCoins, Landmark, MessageCircle, PackageCheck, PackageSearch, PhoneCall, Search, Truck, Undo2 } from "lucide-react";
import { irA } from "./animar";
import { ARTICULOS, ESTADOS, ESTADOS_CAMION, IDS, ZONAS, cuentas, dia, diaCorto, diaLargo, diaMes, finDeSemana, pagado, porVerificar, qz, sabado, saldo, num, type EstadoCamion, type EstadoOrden, type Imperial, type Orden } from "./datos";
import { Checklist, Despacho, Liquidar, NuevaOrden, Revision, avisoWhatsApp, pagoDe } from "./Logistica";

type V = { tipo: "nueva" } | { tipo: "despacho" } | { tipo: "liquidar" } | { tipo: "carga"; folio: string } | { tipo: "retorno"; folio: string } | null;
type Filtro = "todas" | Exclude<EstadoOrden, "liquidada">;

const COLOR: Record<EstadoOrden, string> = {
  reservada: "bg-[#F3EFEA] text-[#1C1917]",
  evento: "bg-[#1C1917] text-white",
  retorno: "bg-[#FBEBC8] text-[#713F12]",
  liquidada: "bg-[#E7F0DA] text-[#365314]",
};
const ORDEN: EstadoOrden[] = ["retorno", "evento", "reservada", "liquidada"];
const PUNTO: Record<EstadoCamion, string> = { bodega: "bg-[#3F6212]", carga: "bg-[#A16207]", ruta: "bg-[#2563EB]", montaje: "bg-[#7C3AED]", regreso: "bg-[#0891B2]", taller: "bg-[#9F2F1E]" };
const chico = "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-[0.78rem] font-bold leading-none transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-35";

export function Panel({ imp }: { imp: Imperial }) {
  const [ventana, setVentana] = useState<V>(null);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [buscar, setBuscar] = useState("");
  const [brillo, setBrillo] = useState(0);
  const cerrar = () => setVentana(null);

  function critica() {
    irA("alertas");
    setBrillo((n) => n + 1);
  }

  const atajos = [
    { nombre: "Nueva orden manual", icono: PhoneCall, clase: "border-[#1C1917] bg-[#1C1917] text-white hover:bg-[#38332F]", accion: () => setVentana({ tipo: "nueva" }) },
    { nombre: "Despachar camión en ruta", icono: Truck, clase: "border-[#A16207] bg-[#A16207] text-white hover:bg-[#854D0E]", accion: () => setVentana({ tipo: "despacho" }) },
    { nombre: "Liquidar retorno y depósito", icono: Undo2, clase: "border-[#CFC6BA] bg-white text-[#1C1917] hover:border-[#1C1917]", accion: () => setVentana({ tipo: "liquidar" }) },
    { nombre: "Ver disponibilidad crítica", icono: PackageSearch, clase: "border-[#CFC6BA] bg-white text-[#1C1917] hover:border-[#1C1917]", accion: critica },
  ];

  /* Alt+1 a Alt+4. Se usa la tecla física porque en Mac Opción+número escribe otro símbolo */
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.repeat) return;
      const cual = ["Digit1", "Digit2", "Digit3", "Digit4"].indexOf(e.code);
      if (cual < 0 || document.querySelector("dialog[open]")) return;
      e.preventDefault();
      atajos[cual].accion();
    };
    addEventListener("keydown", tecla);
    return () => removeEventListener("keydown", tecla);
  });

  const finde = finDeSemana();
  const sab = sabado();
  const abiertas = imp.ordenes.filter((o) => o.estado !== "liquidada");
  const delFinde = abiertas.filter((o) => finde.includes(o.fecha));
  const custodia = abiertas.filter((o) => pagado(o) >= cuentas(o.cesta, o.zona).deposito);
  const porCargar = imp.ordenes.filter((o) => o.estado === "reservada");
  const conSaldo = porCargar.filter((o) => saldo(o) > 0);
  const revisar = imp.ordenes.reduce((s, o) => s + porVerificar(o), 0);

  const cifras = [
    { icono: CalendarRange, nombre: "Eventos este fin de semana", valor: String(delFinde.length), nota: `${diaCorto(finde[0])} al ${diaCorto(finde[finde.length - 1])}` },
    { icono: Gauge, nombre: "Ocupación de bodega", valor: `${imp.ocupacion(sab)}%`, nota: `comprometido para el sábado ${diaMes(sab)}` },
    { icono: Landmark, nombre: "Depósitos en custodia", valor: qz(custodia.reduce((s, o) => s + cuentas(o.cesta, o.zona).deposito, 0)), nota: `de ${custodia.length} órdenes, se devuelven al revisar` },
    { icono: HandCoins, nombre: "Saldo por cobrar antes de montaje", valor: qz(conSaldo.reduce((s, o) => s + saldo(o), 0)), nota: `${conSaldo.length} órdenes${revisar ? ` · ${qz(revisar)} por verificar` : ""}` },
  ];

  const texto = buscar.trim().toLowerCase();
  const lista = imp.ordenes
    .filter((o) => filtro === "todas" || o.estado === filtro)
    .filter((o) => !texto || `${o.folio} ${o.cliente} ${o.lugar} ${o.evento}`.toLowerCase().includes(texto))
    .sort((a, b) => Number(!!b.nueva) - Number(!!a.nueva) || ORDEN.indexOf(a.estado) - ORDEN.indexOf(b.estado) || a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora));

  const elegida = ventana && "folio" in ventana ? imp.ordenes.find((o) => o.folio === ventana.folio) : undefined;

  return (
    <div className="pb-8 pt-4">
      <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="text-[1.6rem] !leading-tight">Panel Logística</h1>
          <p className="text-[0.88rem] text-[#6B625B] first-letter:uppercase">Bodega y flota · {diaLargo(dia(0))}</p>
        </div>

        <div role="group" aria-label="Atajos rápidos" className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
          {atajos.map(({ nombre, icono: Icono, clase, accion }, i) => (
            <button key={nombre} type="button" onClick={accion} aria-keyshortcuts={`Alt+${i + 1}`} title={`${nombre} (Alt+${i + 1}; en Mac, Opción+${i + 1})`} className={`flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl border px-2.5 py-2 text-[0.82rem] font-bold leading-tight transition active:scale-[0.98] sm:justify-start sm:px-3 ${clase}`}>
              <Icono size={18} aria-hidden className="shrink-0" />
              <span className="min-w-0 sm:flex-1 sm:text-left">{nombre}</span>
              <kbd aria-hidden className="hidden shrink-0 rounded border border-current/30 px-1.5 py-0.5 font-sans text-[0.68rem] font-bold opacity-80 sm:inline-block">
                Alt+{i + 1}
              </kbd>
            </button>
          ))}
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
          {cifras.map(({ icono: Icono, nombre, valor, nota }) => (
            <div key={nombre} className="min-w-0 rounded-xl border border-[#E4DDD3] bg-white p-4">
              <dt className="flex items-center gap-1.5 text-[0.76rem] font-bold leading-tight text-[#57534E]">
                <Icono size={15} aria-hidden className="shrink-0 text-[#A16207]" />
                {nombre}
              </dt>
              <dd className="mt-1 break-words text-[1.55rem] font-extrabold leading-none text-[#1C1917]">{valor}</dd>
              <dd className="mt-1 text-[0.72rem] leading-tight text-[#6B625B]">{nota}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
          <section aria-labelledby="ordenes" className="min-w-0 rounded-2xl border border-[#E4DDD3] bg-white xl:col-span-8">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#E4DDD3] p-3">
              <h2 id="ordenes" className="sr-only">
                Control de órdenes y despachos
              </h2>
              <div role="tablist" aria-label="Estado de las órdenes" className="flex flex-wrap gap-1">
                {(["todas", "reservada", "evento", "retorno"] as const).map((f) => (
                  <button key={f} type="button" role="tab" aria-selected={filtro === f} onClick={() => setFiltro(f)} className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[0.8rem] font-bold transition ${filtro === f ? "bg-[#1C1917] text-white" : "text-[#44403C] hover:bg-[#F3EFEA]"}`}>
                    {f === "todas" ? "Todas" : ESTADOS[f]}
                    <span className={`rounded-full px-1.5 text-[0.7rem] ${filtro === f ? "bg-white/20" : "bg-[#F3EFEA]"}`}>{f === "todas" ? imp.ordenes.length : imp.ordenes.filter((o) => o.estado === f).length}</span>
                  </button>
                ))}
              </div>
              <label className="relative ml-auto w-full min-w-0 sm:w-56">
                <span className="sr-only">Buscar orden, cliente o finca</span>
                <Search size={16} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8076]" />
                <input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar orden, cliente o finca" className="h-10 w-full rounded-lg border border-[#CFC6BA] bg-[#FAF8F5] pl-9 pr-3 text-sm text-[#1C1917]" />
              </label>
            </div>

            <div className="hidden grid-cols-[6rem_minmax(0,1fr)_5.6rem_6.6rem_7.4rem_auto] gap-3 border-b border-[#EFE9E1] px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[#8A8076] md:grid" aria-hidden>
              <span>Orden</span>
              <span>Cliente / finca</span>
              <span>Fecha</span>
              <span>Camión</span>
              <span>Pago</span>
              <span className="text-right">Acciones</span>
            </div>
            {lista.length === 0 && <p className="p-6 text-sm">No hay órdenes con ese filtro.</p>}
            <ul className="divide-y divide-[#EFE9E1] xl:max-h-[calc(100dvh-20rem)] xl:min-h-[24rem] xl:overflow-y-auto">
              {lista.map((o) => (
                <Fila key={o.folio} o={o} imp={imp} alCarga={() => setVentana({ tipo: "carga", folio: o.folio })} alRetorno={() => {
                  if (o.estado === "evento") imp.recibir(o.folio);
                  setVentana({ tipo: "retorno", folio: o.folio });
                }} />
              ))}
            </ul>
          </section>

          <aside className="grid min-w-0 gap-4 xl:sticky xl:top-20 xl:col-span-4">
            <Flota imp={imp} />
            <Alertas imp={imp} brillo={brillo} />
          </aside>
        </div>
      </div>

      {ventana?.tipo === "nueva" && <NuevaOrden imp={imp} alCerrar={cerrar} alCreada={(folio) => setVentana({ tipo: "carga", folio })} />}
      {ventana?.tipo === "despacho" && <Despacho imp={imp} alCerrar={cerrar} />}
      {ventana?.tipo === "liquidar" && (
        <Liquidar
          imp={imp}
          alCerrar={cerrar}
          alRevisar={(folio) => {
            if (imp.ordenes.find((o) => o.folio === folio)?.estado === "evento") imp.recibir(folio);
            setVentana({ tipo: "retorno", folio });
          }}
        />
      )}
      {ventana?.tipo === "carga" && elegida && <Checklist o={elegida} imp={imp} alCerrar={cerrar} />}
      {ventana?.tipo === "retorno" && elegida && <Revision o={elegida} imp={imp} alCerrar={cerrar} />}
    </div>
  );
}

function Fila({ o, imp, alCarga, alRetorno }: { o: Orden; imp: Imperial; alCarga: () => void; alRetorno: () => void }) {
  const camion = imp.camiones.find((c) => c.id === o.camion);
  const pago = pagoDe(o);
  const revisar = porVerificar(o);
  const opciones = imp.camiones.filter((c) => c.estado !== "taller" || c.id === o.camion);
  return (
    <li className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-4 py-3 md:grid-cols-[6rem_minmax(0,1fr)_5.6rem_6.6rem_7.4rem_auto] ${o.nueva ? "bg-[#FBF3E4]" : ""}`}>
      <div className="min-w-0 max-md:col-span-2 max-md:flex max-md:items-center max-md:gap-2">
        <b className="block text-[0.9rem] text-[#1C1917]">{o.folio}</b>
        <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[0.66rem] font-bold leading-tight ${COLOR[o.estado]}`}>{ESTADOS[o.estado]}</span>
        {o.nueva && <span className="ml-1 rounded-full bg-[#A16207] px-2 py-0.5 text-[0.66rem] font-bold text-white md:ml-0 md:mt-1 md:block md:w-fit">Nueva</span>}
      </div>
      <div className="min-w-0 max-md:col-span-2">
        <p className="truncate text-[0.9rem] font-bold text-[#1C1917]">
          {o.cliente}
          {o.origen === "manual" && <span className="ml-1.5 align-middle text-[0.66rem] font-bold text-[#A16207]">TEL/WA</span>}
        </p>
        <p className="truncate text-[0.78rem] text-[#6B625B]">
          {o.evento} · {o.lugar}, {ZONAS[o.zona].corto}
        </p>
      </div>
      <p className="text-[0.82rem] leading-tight text-[#1C1917]">
        <b className="capitalize">{diaCorto(o.fecha)}</b>
        <span className="block text-[#6B625B]">{o.hora} h</span>
      </p>
      <div className="min-w-0 text-[0.8rem]">
        {o.estado === "reservada" ? (
          <select aria-label={`Camión de ${o.folio}`} value={o.camion ?? ""} onChange={(e) => imp.cambiarOrden(o.folio, (x) => ({ ...x, camion: e.target.value || undefined }))} className="h-9 w-full rounded-lg border border-[#CFC6BA] bg-white px-1.5 text-[0.78rem] font-semibold text-[#1C1917]">
            <option value="">Sin asignar</option>
            {opciones.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        ) : (
          <span className="font-semibold text-[#1C1917]">{camion?.nombre ?? "—"}</span>
        )}
      </div>
      <div className="min-w-0 max-md:col-span-2 max-md:flex max-md:flex-wrap max-md:gap-2 md:grid md:gap-1">
        <span className={`w-fit rounded-full px-2 py-0.5 text-[0.72rem] font-bold ${pago.clase}`}>{pago.texto}</span>
        {revisar > 0 && (
          <button type="button" onClick={() => imp.verificarPagos(o.folio)} title="Marcar como verificado el pago que reportó el cliente" className="w-fit rounded-full border border-[#A16207] px-2 py-0.5 text-[0.72rem] font-bold text-[#A16207] hover:bg-[#A16207] hover:text-white">
            Verificar {qz(revisar)}
          </button>
        )}
      </div>
      <div className="flex flex-wrap justify-end gap-1.5 max-md:col-span-2 max-md:justify-start">
        <button type="button" onClick={alCarga} disabled={o.estado !== "reservada"} aria-label={`Checklist de carga de ${o.folio}`} title="Checklist de carga" className={`${chico} border-[#CFC6BA] bg-white text-[#1C1917] hover:border-[#1C1917]`}>
          <ClipboardList size={15} aria-hidden /> Carga
        </button>
        <button type="button" onClick={alRetorno} disabled={o.estado === "reservada"} aria-label={`${o.estado === "liquidada" ? "Ver liquidación" : "Revisar retorno"} de ${o.folio}`} title={o.estado === "evento" ? "Recibir en bodega y revisar retorno" : "Revisar retorno"} className={`${chico} border-[#CFC6BA] bg-white text-[#1C1917] hover:border-[#1C1917]`}>
          <PackageCheck size={15} aria-hidden /> {o.estado === "liquidada" ? "Liquidación" : "Retorno"}
        </button>
        <a href={avisoWhatsApp(o)} target="_blank" rel="noopener noreferrer" aria-label={`Avisar por WhatsApp a ${o.cliente}`} title="Avisar por WhatsApp" className={`${chico} border-[#15803D] bg-[#15803D] text-white hover:bg-[#166534]`}>
          <MessageCircle size={15} aria-hidden />
          <span className="md:sr-only">WhatsApp</span>
        </a>
      </div>
    </li>
  );
}

function Flota({ imp }: { imp: Imperial }) {
  return (
    <section aria-labelledby="flota" className="rounded-2xl border border-[#E4DDD3] bg-white p-4">
      <h2 id="flota" className="flex items-center gap-2 text-lg">
        <Truck size={18} aria-hidden className="text-[#A16207]" /> Flota en vivo
      </h2>
      <ul className="mt-3 grid gap-2">
        {imp.camiones.map((c) => {
          const o = imp.ordenes.find((x) => x.folio === c.orden);
          const donde = o && (c.estado === "ruta" || c.estado === "montaje") ? ` ${c.estado === "ruta" ? "a" : "en"} ${ZONAS[o.zona].corto} · ${o.folio}` : "";
          return (
            <li key={c.id} className="grid grid-cols-[minmax(0,1fr)_8.5rem] items-center gap-x-3 rounded-xl bg-[#FAF8F5] px-3 py-2">
              <p className="min-w-0 truncate text-[0.84rem]">
                <b className="text-[#1C1917]">
                  {c.nombre} · {c.ton}
                </b>
                <span className="text-[#6B625B]"> · {c.piloto}</span>
              </p>
              <p className="col-start-1 mt-0.5 flex min-w-0 items-center gap-2 text-[0.78rem] font-semibold text-[#1C1917]">
                <span aria-hidden className={`size-2 shrink-0 rounded-full ${PUNTO[c.estado]}`} />
                <span className="truncate">
                  {c.estado === "ruta" ? "En ruta" : c.estado === "montaje" ? "Montando" : ESTADOS_CAMION[c.estado]}
                  {donde}
                </span>
              </p>
              <select
                aria-label={`Estado de ${c.nombre}`}
                value={c.estado}
                onChange={(e) => {
                  const estado = e.target.value as EstadoCamion;
                  imp.cambiarCamion(c.id, (x) => ({ ...x, estado, orden: estado === "bodega" || estado === "taller" ? undefined : x.orden }));
                }}
                className="col-start-2 row-span-2 row-start-1 h-9 w-full rounded-lg border border-[#CFC6BA] bg-white px-1.5 text-[0.76rem] font-semibold text-[#1C1917]"
              >
                {(Object.keys(ESTADOS_CAMION) as EstadoCamion[]).map((k) => (
                  <option key={k} value={k}>
                    {ESTADOS_CAMION[k]}
                  </option>
                ))}
              </select>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Alertas({ imp, brillo }: { imp: Imperial; brillo: number }) {
  const sab = sabado();
  const [resaltar, setResaltar] = useState(false);
  useEffect(() => {
    if (!brillo) return;
    setResaltar(true);
    const t = window.setTimeout(() => setResaltar(false), 1600);
    return () => window.clearTimeout(t);
  }, [brillo]);

  /* piezas que siguen fuera (en otro evento o sin revisar) y tienen que volver listas para el sábado */
  const fuera = (id: keyof typeof ARTICULOS) => imp.ordenes.filter((o) => (o.estado === "evento" || o.estado === "retorno") && o.fecha < sab).reduce((s, o) => s + (o.cesta[id] ?? 0), 0);
  const criticas = IDS.map((id) => {
    const a = ARTICULOS[id];
    const usadas = a.total - imp.libres(sab, id);
    return { id, a, usadas, pct: Math.round((usadas / a.total) * 100), fuera: fuera(id) };
  })
    .filter((x) => x.pct > 80)
    .sort((x, y) => y.pct - x.pct);

  return (
    <section id="alertas" aria-labelledby="titulo-alertas" className={`scroll-mt-24 rounded-2xl border bg-white p-4 transition ${resaltar ? "border-[#A16207] ring-4 ring-[#A16207]/30" : "border-[#E4DDD3]"}`}>
      <h2 id="titulo-alertas" className="flex items-center gap-2 text-lg">
        <AlertTriangle size={18} aria-hidden className="text-[#A16207]" /> Stock crítico · sáb {diaMes(sab)}
      </h2>
      <p className="mt-1 text-[0.78rem] text-[#6B625B]">Piezas con más del 80% comprometido.</p>
      {criticas.length === 0 && <p className="mt-3 text-sm">Nada pasa del 80% para ese sábado.</p>}
      <ul className="mt-3 grid gap-3">
        {criticas.map(({ id, a, usadas, pct, fuera }) => {
          const falta = usadas + fuera - a.total;
          return (
            <li key={id} className="text-[0.82rem]">
              <p className="flex items-baseline justify-between gap-2">
                <b className="min-w-0 truncate text-[#1C1917]">{a.nombre}</b>
                <span className={`shrink-0 font-extrabold ${pct >= 90 ? "text-[#9F2F1E]" : "text-[#A16207]"}`}>{pct}%</span>
              </p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#EAE3DA]" aria-hidden>
                <div className={`h-full rounded-full ${pct >= 90 ? "bg-[#9F2F1E]" : "bg-[#A16207]"}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1 text-[#6B625B]">
                {num(usadas)} de {num(a.total)} apartadas.{" "}
                {falta > 0 ? (
                  <b className="text-[#9F2F1E]">
                    {num(fuera)} siguen fuera: faltan {num(falta)}, subcontratar.
                  </b>
                ) : fuera > 0 ? (
                  <b className="text-[#713F12]">{num(fuera)} vuelven de otro evento: lavar y pulir a tiempo.</b>
                ) : (
                  <b className="text-[#713F12]">Quedan {num(a.total - usadas)}: preparar lavado y pulido.</b>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
