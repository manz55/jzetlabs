import { useState, type FormEvent, type KeyboardEvent } from "react";
import { ArchiveRestore, ArchiveX, Ban, CircleCheck, CirclePlus, Plus, ReceiptText, RotateCcw, Store } from "lucide-react";
import { FOTOS_PLATILLO, IDS_STAND, MAXIMO_PORCIONES, PRODUCTOS, STANDS, productosEnCarta, qz, type Feria, type Filtro, type ProductoId, type StandId } from "./datos";
import { irA } from "./animar";
import { FiltroStands, Foto } from "./Piezas";

const soloDigitos = (texto: string, largo: number) => texto.replace(/\D/g, "").slice(0, largo);

export function GestionMenu({ feria, alCaja, alCarta }: { feria: Feria; alCaja: () => void; alCarta: () => void }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const enCarta = productosEnCarta();
  const deBaja = Object.keys(PRODUCTOS).filter((id) => PRODUCTOS[id].baja);
  const delFiltro = (id: ProductoId) => filtro === "todos" || PRODUCTOS[id].stand === filtro;
  const indicadores = [
    { nombre: "Platillos en carta", valor: enCarta.length },
    { nombre: "Porciones disponibles", valor: enCarta.reduce((s, id) => s + feria.quedan(id), 0) },
    { nombre: "Agotados", valor: enCarta.filter((id) => feria.quedan(id) <= 0).length },
    { nombre: "Dados de baja", valor: deBaja.length },
  ];

  return (
    <div className="tf-ancho !max-w-[90rem] py-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold sm:text-3xl">Gestión de Menú</h1>
          <p className="mt-1 text-sm font-semibold text-[#6B6560]">Define las porciones de cada platillo, da de alta nuevos y da de baja los que ya no se venden.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => irA("tf-alta")} className="tf-boton tf-rojo">
            <CirclePlus size={17} aria-hidden /> Nuevo platillo
          </button>
          <button type="button" onClick={alCarta} className="tf-boton tf-linea">
            <Store size={16} aria-hidden /> Ver carta pública
          </button>
          <button type="button" onClick={alCaja} className="tf-boton tf-linea">
            <ReceiptText size={16} aria-hidden /> Mesa de Cobros
          </button>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
        {indicadores.map(({ nombre, valor }) => (
          <div key={nombre} className="min-w-0 rounded-2xl bg-[#F9F5F0] px-4 py-3">
            <dt className="text-xs font-bold text-[#52525B]">{nombre}</dt>
            <dd className="text-2xl font-extrabold text-[#18181B]">{valor}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-12">
        <section aria-labelledby="tf-platillos" className="min-w-0 xl:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="tf-platillos" className="text-xl font-extrabold">Platillos y porciones</h2>
            <FiltroStands actual={filtro} alElegir={setFiltro} etiqueta="Filtrar los platillos por puesto" />
          </div>
          <ul className="mt-4 grid gap-3">
            {enCarta.filter(delFiltro).map((id) => (
              <Fila key={id} feria={feria} id={id} />
            ))}
          </ul>
          {enCarta.filter(delFiltro).length === 0 && <p className="mt-4 rounded-2xl border border-dashed border-[#D9CFC3] p-6 text-center font-semibold">No hay platillos en la carta de este puesto.</p>}

          {deBaja.filter(delFiltro).length > 0 && (
            <>
              <h3 className="mt-8 text-base font-extrabold">Dados de baja</h3>
              <p className="text-sm text-[#6B6560]">No aparecen en la carta ni en caja. Lo que ya se vendió sigue en el cierre.</p>
              <ul className="mt-3 grid gap-3">
                {deBaja.filter(delFiltro).map((id) => (
                  <li key={id} className="tf-tarjeta flex flex-wrap items-center justify-between gap-3 p-4">
                    <span className="min-w-0">
                      <b className="block break-words text-[#18181B]">{PRODUCTOS[id].nombre}</b>
                      <span className="text-sm text-[#6B6560]">
                        {STANDS[PRODUCTOS[id].stand].nombre} · {feria.vendido(id)} vendidas
                      </span>
                    </span>
                    <button type="button" aria-label={`Volver a la carta ${PRODUCTOS[id].nombre}`} onClick={() => feria.darDeBaja(id, false)} className="tf-boton tf-linea">
                      <ArchiveRestore size={16} aria-hidden /> Volver a la carta
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <Alta feria={feria} />
      </div>
    </div>
  );
}

function Fila({ feria, id }: { feria: Feria; id: ProductoId }) {
  const [borrador, setBorrador] = useState<string | null>(null);
  const p = PRODUCTOS[id];
  const disponibles = feria.quedan(id);
  const sinPorciones = feria.sobrante(id) <= 0;

  function guardar() {
    if (borrador !== null && borrador !== "" && Number(borrador) !== disponibles) feria.fijarDisponibles(id, Number(borrador));
    setBorrador(null);
  }

  function tecla(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") e.currentTarget.blur();
    if (e.key === "Escape") setBorrador(null);
  }

  return (
    <li className="tf-tarjeta grid gap-4 p-4 min-[1360px]:grid-cols-[minmax(0,1fr)_auto] min-[1360px]:items-center">
      <div className="flex min-w-0 items-center gap-4">
        <Foto id={p.foto} alt="" ancho={160} alto={160} className={`size-16 shrink-0 rounded-xl ${disponibles ? "" : "grayscale"}`} />
        <div className="min-w-0">
          <h3 className="flex flex-wrap items-center gap-2 text-base font-extrabold">
            <span className="break-words">{p.nombre}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-extrabold ${disponibles ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEE2E2] text-[#B91C1C]"}`}>{disponibles ? "Disponible" : "Agotado"}</span>
          </h3>
          <p className="text-sm text-[#6B6560]">
            {STANDS[p.stand].corto} · {qz(p.precio)} · {feria.vendido(id)} vendidas de {feria.cargado(id)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-2 min-[1360px]:justify-end">
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-[#18181B]">Disponibles</span>
          <input inputMode="numeric" autoComplete="off" aria-label={`Porciones disponibles de ${p.nombre}`} value={borrador ?? String(disponibles)} onFocus={(e) => e.target.select()} onChange={(e) => setBorrador(soloDigitos(e.target.value, 3))} onBlur={guardar} onKeyDown={tecla} className="tf-campo !h-11 !w-24 text-center !text-lg" />
        </label>
        {[10, 20].map((v) => (
          <button key={v} type="button" aria-label={`Sumar ${v} de ${p.nombre}`} disabled={feria.sobrante(id) >= MAXIMO_PORCIONES} onClick={() => feria.sumar(id, v)} className="tf-boton tf-linea !px-3">
            +{v}
          </button>
        ))}
        {p.agotado && !sinPorciones ? (
          <button type="button" aria-label={`Reactivar ${p.nombre}`} onClick={() => feria.marcarAgotado(id, false)} className="tf-boton tf-verde !px-3 md:w-40">
            <RotateCcw size={16} aria-hidden /> Reactivar
          </button>
        ) : (
          <button type="button" aria-label={`Marcar agotado ${p.nombre}`} disabled={sinPorciones} onClick={() => feria.marcarAgotado(id, true)} className="tf-boton tf-linea !px-3 md:w-40">
            <Ban size={16} aria-hidden /> Marcar agotado
          </button>
        )}
        <button type="button" aria-label={`Dar de baja ${p.nombre}`} onClick={() => feria.darDeBaja(id, true)} className="tf-boton tf-linea !px-3 !text-[#B91C1C]">
          <ArchiveX size={16} aria-hidden /> Dar de baja
        </button>
      </div>
    </li>
  );
}

const formularioVacio = { nombre: "", detalle: "", precio: "", porciones: "", stand: "antojitos" as StandId, foto: "" };

function Alta({ feria }: { feria: Feria }) {
  const [datos, setDatos] = useState(formularioVacio);
  const [aviso, setAviso] = useState("");
  const [intento, setIntento] = useState(false);
  const nombre = datos.nombre.trim();
  const precio = Number(datos.precio);
  const porciones = Number(datos.porciones);
  const repetido = Object.values(PRODUCTOS).some((p) => p.nombre.toLowerCase() === nombre.toLowerCase());
  const falta = !nombre ? "Escribe el nombre del platillo." : repetido ? "Ya existe un platillo con ese nombre (revisa los dados de baja)." : !precio ? "Escribe el precio en quetzales." : datos.porciones === "" ? "Indica con cuántas porciones arranca." : !datos.foto ? "Elige una foto para la carta." : "";

  const cambiar = (parte: Partial<typeof formularioVacio>) => {
    setDatos((d) => ({ ...d, ...parte }));
    setAviso("");
  };

  function darDeAlta(e: FormEvent) {
    e.preventDefault();
    setIntento(true);
    if (falta) return;
    const { alt } = FOTOS_PLATILLO.find((f) => f.foto === datos.foto)!;
    feria.crear({ nombre, detalle: datos.detalle.trim(), precio, cargadas: porciones, stand: datos.stand, foto: datos.foto, alt });
    setAviso(`${nombre} ya está en la carta y en Caja Central.`);
    setDatos({ ...formularioVacio, stand: datos.stand });
    setIntento(false);
  }

  return (
    <form id="tf-alta" noValidate onSubmit={darDeAlta} className="tf-tarjeta grid scroll-mt-32 gap-4 p-5 lg:scroll-mt-24 xl:col-span-4">
      <h2 className="text-xl font-extrabold">Nuevo platillo</h2>
      <label className="block">
        <span className="tf-rotulo">Nombre</span>
        <input maxLength={40} autoComplete="off" placeholder="Rellenitos de plátano" value={datos.nombre} onChange={(e) => cambiar({ nombre: e.target.value })} className="tf-campo" />
      </label>
      <label className="block">
        <span className="tf-rotulo">
          Descripción <span className="font-medium text-[#6B6560]">(opcional)</span>
        </span>
        <input maxLength={70} autoComplete="off" placeholder="Con azúcar y crema" value={datos.detalle} onChange={(e) => cambiar({ detalle: e.target.value })} className="tf-campo" />
      </label>
      <fieldset className="min-w-0">
        <legend className="tf-rotulo">Puesto</legend>
        <div className="flex flex-wrap gap-2">
          {IDS_STAND.map((s) => (
            <button key={s} type="button" aria-pressed={datos.stand === s} onClick={() => cambiar({ stand: s })} className="tf-pildora">
              {STANDS[s].corto}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid grid-cols-2 gap-3">
        <label className="block min-w-0">
          <span className="tf-rotulo">Precio (Q)</span>
          <input inputMode="numeric" autoComplete="off" placeholder="15" value={datos.precio} onChange={(e) => cambiar({ precio: soloDigitos(e.target.value, 3) })} className="tf-campo" />
        </label>
        <label className="block min-w-0">
          <span className="tf-rotulo">Porciones iniciales</span>
          <input inputMode="numeric" autoComplete="off" placeholder="30" value={datos.porciones} onChange={(e) => cambiar({ porciones: soloDigitos(e.target.value, 3) })} className="tf-campo" />
        </label>
      </div>
      <fieldset className="min-w-0">
        <legend className="tf-rotulo">Foto</legend>
        <div className="grid grid-cols-5 gap-2 xl:grid-cols-3">
          {FOTOS_PLATILLO.map((f) => (
            <button key={f.foto} type="button" aria-label={`Foto de ${f.nombre}`} aria-pressed={datos.foto === f.foto} onClick={() => cambiar({ foto: f.foto })} className={`overflow-hidden rounded-lg ring-offset-2 ${datos.foto === f.foto ? "ring-2 ring-[#B91C1C]" : datos.foto ? "opacity-60 hover:opacity-100" : "hover:ring-2 hover:ring-[#D9CFC3]"}`}>
              <Foto id={f.foto} alt="" ancho={200} alto={140} className="aspect-[10/7] w-full" />
            </button>
          ))}
        </div>
      </fieldset>
      <button type="submit" className="tf-boton tf-rojo !min-h-12">
        <Plus size={18} aria-hidden /> Dar de alta
      </button>
      <div role="status">
        {intento && falta && <p className="text-sm font-bold text-[#B91C1C]">{falta}</p>}
        {aviso && (
          <p className="flex items-start gap-2 text-sm font-bold text-[#15803D]">
            <CircleCheck size={17} aria-hidden className="mt-0.5 shrink-0" /> {aviso}
          </p>
        )}
      </div>
    </form>
  );
}
