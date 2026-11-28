/* Logística: hoja de carga del camión, revisión del retorno y devolución del depósito. */
import { useState } from "react";
import { ChevronDown, CircleCheck, PackageCheck, Truck } from "lucide-react";
import { ESTADOS, ZONAS, cuentas, diaCorto, horaMontaje, liquidacion, num, qz, renglones, type ArtId, type Dano, type EstadoOrden, type Imperial, type Orden } from "./datos";
import { boton, pastilla, tarjeta } from "./estilos";
import { Contador } from "./Piezas";

const COLOR: Record<EstadoOrden, string> = {
  reservada: "bg-[#F3EFEA] text-[#1C1917]",
  ruta: "bg-[#1C1917] text-white",
  retorno: "bg-[#FBEBC8] text-[#713F12]",
  liquidada: "bg-[#E7F0DA] text-[#365314]",
};
const ORDEN: EstadoOrden[] = ["retorno", "ruta", "reservada", "liquidada"];

export function Logistica({ imp, abierta, alAbrir }: { imp: Imperial; abierta: string; alAbrir: (folio: string) => void }) {
  const [filtro, setFiltro] = useState<"todas" | EstadoOrden>("todas");
  const lista = imp.ordenes
    .filter((o) => filtro === "todas" || o.estado === filtro)
    .sort((a, b) => Number(!!b.nueva) - Number(!!a.nueva) || ORDEN.indexOf(a.estado) - ORDEN.indexOf(b.estado) || a.fecha.localeCompare(b.fecha));

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar órdenes">
        {(["todas", ...ORDEN] as const).map((f) => (
          <button key={f} type="button" aria-pressed={filtro === f} onClick={() => setFiltro(f)} className={pastilla(filtro === f)}>
            {f === "todas" ? "Todas" : ESTADOS[f]} ({f === "todas" ? imp.ordenes.length : imp.ordenes.filter((o) => o.estado === f).length})
          </button>
        ))}
      </div>
      {lista.length === 0 && <p className={`${tarjeta} mt-5 p-6 sm:p-7`}>No hay órdenes en este estado.</p>}
      <ul className="mt-5 grid gap-4">
        {lista.map((o) => {
          const ver = abierta === o.folio;
          return (
            <li key={o.folio} className={`${tarjeta} overflow-hidden`}>
              <button type="button" aria-expanded={ver} onClick={() => alAbrir(ver ? "" : o.folio)} className="flex w-full flex-wrap items-center gap-x-5 gap-y-2 p-5 text-left sm:px-7">
                <span className="min-w-0 flex-1 basis-60">
                  <span className="flex flex-wrap items-center gap-2">
                    <b className="text-[#1C1917]">{o.folio}</b>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${COLOR[o.estado]}`}>{ESTADOS[o.estado]}</span>
                    {o.nueva && <span className="rounded-full bg-[#A16207] px-2.5 py-0.5 text-xs font-bold text-white">Nueva</span>}
                  </span>
                  <span className="mt-1 block font-(family-name:--ci-serif) text-lg font-semibold text-[#1C1917]">
                    {o.evento} · {o.cliente}
                  </span>
                  <span className="block text-sm text-[#6B625B]">
                    {diaCorto(o.fecha)} · {o.hora} h · {o.lugar}, {ZONAS[o.zona].nombre}
                  </span>
                </span>
                <span className="font-extrabold text-[#1C1917]">{qz(cuentas(o.cesta, o.zona).total)}</span>
                <ChevronDown size={20} aria-hidden className={`shrink-0 transition ${ver ? "rotate-180" : ""}`} />
              </button>
              {ver && (
                <div className="border-t border-[#E4DDD3] p-5 sm:p-7">
                  {o.tel && <p className="mb-4 text-sm">Teléfono del cliente: {o.tel}</p>}
                  {o.estado === "reservada" && <Carga o={o} imp={imp} />}
                  {o.estado === "ruta" && <Ruta o={o} imp={imp} />}
                  {o.estado === "retorno" && <Revision o={o} imp={imp} />}
                  {o.estado === "liquidada" && <Cierre o={o} />}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

type Paso = { o: Orden; imp: Imperial };

function Carga({ o, imp }: Paso) {
  const cosas = renglones(o.cesta);
  const listas = cosas.filter((r) => o.cargado.includes(r.id)).length;
  const completo = listas === cosas.length;
  const c = cuentas(o.cesta, o.zona);
  const alternar = (id: ArtId) => imp.cambiarOrden(o.folio, (x) => ({ ...x, nueva: false, cargado: x.cargado.includes(id) ? x.cargado.filter((y) => y !== id) : [...x.cargado, id] }));
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg">
          Hoja de carga · {listas} de {cosas.length}
        </h3>
        <button type="button" onClick={() => imp.cambiarOrden(o.folio, (x) => ({ ...x, nueva: false, cargado: completo ? [] : cosas.map((r) => r.id) }))} className={boton.linea}>
          {completo ? "Desmarcar todo" : "Marcar todo"}
        </button>
      </div>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {cosas.map((r) => {
          const hecho = o.cargado.includes(r.id);
          return (
            <li key={r.id}>
              <label className={`flex min-h-14 cursor-pointer items-center gap-4 rounded-xl border px-4 py-3 ${hecho ? "border-[#A16207] bg-[#FBF3E4]" : "border-[#E4DDD3]"}`}>
                <input type="checkbox" checked={hecho} onChange={() => alternar(r.id)} className="size-5 shrink-0 accent-[#A16207]" />
                <b className="w-12 shrink-0 text-right text-lg text-[#1C1917]">{num(r.n)}</b>
                <span className="min-w-0">{r.art.nombre}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-sm">
        Montaje desde las {horaMontaje(o.hora)} h. Anticipo recibido {qz(c.anticipo)}; saldo por cobrar al montar <b className="text-[#1C1917]">{qz(c.total - c.anticipo)}</b>.
      </p>
      <button type="button" disabled={!completo} onClick={() => imp.cambiarOrden(o.folio, (x) => ({ ...x, estado: "ruta", nueva: false }))} className={`${boton.oscuro} mt-4 !min-h-12 w-full sm:w-auto`}>
        <Truck size={18} aria-hidden /> Confirmar salida del camión
      </button>
      {!completo && <p className="mt-2 text-sm text-[#6B625B]">Marque cada renglón al subirlo para poder sacar el camión.</p>}
    </>
  );
}

function Ruta({ o, imp }: Paso) {
  const c = cuentas(o.cesta, o.zona);
  return (
    <>
      <h3 className="text-lg">Mobiliario que salió</h3>
      <ul className="mt-3 grid gap-2 md:grid-cols-2">
        {renglones(o.cesta).map((r) => (
          <li key={r.id} className="flex gap-3">
            <b className="w-12 shrink-0 text-right text-[#1C1917]">{num(r.n)}</b> {r.art.nombre}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm">
        Saldo que se cobra al montar: <b className="text-[#1C1917]">{qz(c.total - c.anticipo)}</b>. Depósito en custodia: <b className="text-[#1C1917]">{qz(c.deposito)}</b>.
      </p>
      <button type="button" onClick={() => imp.cambiarOrden(o.folio, (x) => ({ ...x, estado: "retorno" }))} className={`${boton.oscuro} mt-4 !min-h-12 w-full sm:w-auto`}>
        <PackageCheck size={18} aria-hidden /> Recibir retorno en bodega
      </button>
    </>
  );
}

function Cuentas({ o }: { o: Orden }) {
  const l = liquidacion(o);
  const danados = renglones(o.cesta).filter((r) => o.revision[r.id]?.faltan || o.revision[r.id]?.rotas);
  return (
    <dl className="grid gap-2 rounded-xl bg-[#F3EFEA] p-5 sm:p-6">
      <div className="flex justify-between gap-4 font-bold text-[#1C1917]">
        <dt>Depósito de garantía</dt>
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
        <dt className="font-bold">Saldo a devolver al cliente</dt>
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

function Revision({ o, imp }: Paso) {
  const poner = (id: ArtId, campo: keyof Dano, n: number) =>
    imp.cambiarOrden(o.folio, (x) => ({ ...x, revision: { ...x.revision, [id]: { ...(x.revision[id] ?? { faltan: 0, rotas: 0 }), [campo]: n } } }));
  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div>
        <h3 className="text-lg">Revisión de retorno</h3>
        <p className="mt-1 text-sm">Anote solo lo que falta o volvió roto.</p>
        <ul className="mt-4 divide-y divide-[#EFE9E1]">
          {renglones(o.cesta).map((r) => {
            const d = o.revision[r.id] ?? { faltan: 0, rotas: 0 };
            return (
              <li key={r.id} className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_10.5rem_10.5rem] md:items-end">
                <p className="min-w-0">
                  <b className="block text-[#1C1917]">{r.art.nombre}</b>
                  <span className="text-sm text-[#6B625B]">
                    Salieron {num(r.n)} · reposición {qz(r.art.reposicion)}
                  </span>
                </p>
                {(["faltan", "rotas"] as const).map((campo) => (
                  <div key={campo} className="min-w-0 max-md:grid max-md:grid-cols-[4rem_minmax(0,1fr)] max-md:items-center">
                    <p className="mb-1 text-xs font-bold text-[#57534E] max-md:mb-0">{campo === "faltan" ? "Faltan" : "Rotas"}</p>
                    <Contador valor={d[campo]} max={r.n - d[campo === "faltan" ? "rotas" : "faltan"]} nombre={`${r.art.nombre}, ${campo}`} alCambiar={(n) => poner(r.id, campo, n)} />
                  </div>
                ))}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="xl:sticky xl:top-24">
        <Cuentas o={o} />
        <button type="button" onClick={() => imp.cambiarOrden(o.folio, (x) => ({ ...x, estado: "liquidada" }))} className={`${boton.bronce} mt-4 !min-h-12 w-full`}>
          <CircleCheck size={18} aria-hidden /> Cerrar revisión y liquidar depósito
        </button>
      </div>
    </div>
  );
}

function Cierre({ o }: { o: Orden }) {
  return (
    <div className="max-w-xl">
      <h3 className="mb-3 text-lg">Orden liquidada</h3>
      <Cuentas o={o} />
    </div>
  );
}
