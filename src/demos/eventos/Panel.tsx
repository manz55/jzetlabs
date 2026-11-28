/* Panel Organizador: cifras del día y dos pestañas (cuadre del convivio y mobiliario). */
import { useRef, useState } from "react";
import { CalendarClock, Landmark, Receipt, Truck } from "lucide-react";
import { useEscalonado } from "./animar";
import { cuentas, dia, diaLargo, num, qz, totalDe, unidades, type Imperial } from "./datos";
import { ancho, pastilla, tarjeta } from "./estilos";
import { Cuadre } from "./Cuadre";
import { Logistica } from "./Logistica";

export type Pestana = "cuadre" | "logistica";

export function Panel({ imp, pestana, alPestana }: { imp: Imperial; pestana: Pestana; alPestana: (p: Pestana) => void }) {
  const [abierta, setAbierta] = useState(() => imp.ordenes.find((o) => o.nueva)?.folio ?? imp.ordenes.find((o) => o.estado === "retorno")?.folio ?? "");
  const tarjetas = useRef<HTMLDivElement>(null);
  useEscalonado(tarjetas, "cifras");

  const activos = imp.ordenes.filter((o) => o.estado !== "liquidada");
  const enRuta = imp.ordenes.filter((o) => o.estado === "ruta");
  const sillas = enRuta.reduce((s, o) => s + unidades(o.cesta, "silla"), 0);
  const toldos = enRuta.reduce((s, o) => s + unidades(o.cesta, "toldo"), 0);
  const venta = imp.tickets.reduce((s, t) => s + totalDe(t.items), 0);
  const custodia = imp.ordenes.filter((o) => o.estado === "ruta" || o.estado === "retorno");
  const depositos = custodia.reduce((s, o) => s + cuentas(o.cesta, o.zona).deposito, 0);

  const cifras = [
    { icono: CalendarClock, nombre: "Eventos activos", valor: String(activos.length), detalle: `${activos.filter((o) => o.estado === "reservada").length} por cargar` },
    { icono: Truck, nombre: "Sillas / toldos en ruta", valor: `${num(sillas)} / ${toldos}`, detalle: `En ${enRuta.length} ${enRuta.length === 1 ? "evento" : "eventos"}` },
    { icono: Receipt, nombre: "Venta en stands hoy", valor: qz(venta), detalle: `${imp.tickets.length} tickets cobrados` },
    { icono: Landmark, nombre: "Depósitos en custodia", valor: qz(depositos), detalle: `De ${custodia.length} órdenes en ruta o por revisar` },
  ];

  return (
    <div className={`${ancho} py-8 sm:py-10`}>
      <h1 className="text-3xl sm:text-4xl">Panel Organizador</h1>
      <p className="mt-2 first-letter:uppercase">{diaLargo(dia(0))}</p>

      <div ref={tarjetas} className="mt-6 grid grid-cols-1 gap-3 min-[340px]:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {cifras.map(({ icono: Icono, nombre, valor, detalle }) => (
          <div key={nombre} data-entra className="min-w-0 rounded-2xl bg-[#F3EFEA] p-4 sm:p-7">
            <p className="flex items-start gap-2 text-sm font-semibold text-[#57534E]">
              <Icono size={17} aria-hidden className="mt-0.5 shrink-0 text-[#A16207]" /> {nombre}
            </p>
            <p className="mt-3 text-2xl font-extrabold text-[#1C1917] sm:text-3xl">{valor}</p>
            <p className="mt-1 text-sm text-[#6B625B]">{detalle}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Secciones del panel">
        {(
          [
            ["cuadre", "Cuadre Automático de Convivio"],
            ["logistica", "Logística y Retorno de Mobiliario"],
          ] as const
        ).map(([id, nombre]) => (
          <button key={id} type="button" role="tab" aria-selected={pestana === id} onClick={() => alPestana(id)} className={`${pastilla(pestana === id)} !min-h-12`}>
            {nombre}
          </button>
        ))}
      </div>

      <div role="tabpanel" className={pestana === "cuadre" ? `${tarjeta} mt-6 p-6 sm:p-7` : "mt-6"}>
        {pestana === "cuadre" ? <Cuadre imp={imp} /> : <Logistica imp={imp} abierta={abierta} alAbrir={setAbierta} />}
      </div>
    </div>
  );
}
