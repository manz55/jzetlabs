import { useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { ChevronDown, ChevronUp, CircleCheck, MessageCircle, TriangleAlert } from "lucide-react";
import { animate } from "animejs";
import { sinMovimiento } from "./animar";
import { ZONAS, antes, cuentas, diaCorto, diaLargo, num, qz, renglones, type Cesta, type Imperial, type Orden } from "./datos";
import type { Plan } from "./Inicio";
import { boton, campo, rotulo } from "./estilos";
import { Ventana } from "./Piezas";

export function Dock({ imp, plan, cesta, alReservar, alAjustar, alVaciar }: { imp: Imperial; plan: Plan; cesta: Cesta; alReservar: () => void; alAjustar: () => void; alVaciar: () => void }) {
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const c = cuentas(cesta, plan.zona);
  const cosas = renglones(cesta);
  const faltan = cosas.filter((r) => r.n > imp.libres(plan.fecha, r.id));
  const piezas = cosas.reduce((s, r) => s + r.n, 0);

  useLayoutEffect(() => {
    if (!caja.current || sinMovimiento()) return;
    const a = animate(caja.current, { translateY: [90, 0], opacity: [0, 1], duration: 420, ease: "outCubic" });
    const seguro = window.setTimeout(() => a.complete(), 800);
    return () => {
      window.clearTimeout(seguro);
      a.revert();
    };
  }, []);

  const datos: [string, number][] = [
    ["Subtotal", c.subtotal],
    [`Flete`, c.flete],
    ["Depósito 15% (reembolsable)", c.deposito],
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 p-2 sm:p-4">
      <div ref={caja} role="region" aria-label="Su cotización" className="mx-auto max-h-[70dvh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-[#1C1917] text-white shadow-[0_18px_50px_-12px_rgba(0,0,0,.55)]">
        {faltan.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-b border-white/15 bg-[#7C2D12] px-4 py-3 text-sm sm:px-6">
            <TriangleAlert size={18} aria-hidden className="shrink-0" />
            <p className="min-w-0 flex-1" role="alert">
              No alcanza para el {diaCorto(plan.fecha)}: {faltan.map((r) => `${r.art.nombre.toLowerCase()} (quedan ${num(imp.libres(plan.fecha, r.id))})`).join(", ")}.
            </p>
            <button type="button" onClick={alAjustar} className="min-h-10 rounded-lg bg-white px-4 font-bold text-[#1C1917]">
              Ajustar a lo disponible
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6 sm:py-4">
          <p className="min-w-0 text-sm text-[#D6CCBF] max-lg:hidden">
            <b className="block text-base text-white">
              {num(piezas)} {piezas === 1 ? "pieza" : "piezas"}
            </b>
            {diaCorto(plan.fecha)} · {ZONAS[plan.zona].nombre}
          </p>
          <dl className={`${abierto ? "grid w-full gap-1" : "hidden"} lg:ml-auto lg:flex lg:w-auto lg:gap-6`}>
            {datos.map(([n, v]) => (
              <div key={n} className="flex items-baseline justify-between gap-4 lg:block">
                <dt className="text-sm text-[#B8AEA2] lg:text-xs">{n}</dt>
                <dd className="font-bold">{qz(v)}</dd>
              </div>
            ))}
          </dl>
          <dl className="flex min-w-0 flex-1 items-center gap-5 lg:flex-none">
            <div>
              <dt className="text-xs text-[#B8AEA2]">Total</dt>
              <dd className="text-xl font-extrabold sm:text-2xl">{qz(c.total)}</dd>
            </div>
            <div className="border-l border-white/20 pl-5">
              <dt className="text-xs text-[#E7C27D]">Anticipo 50%</dt>
              <dd className="text-xl font-extrabold text-[#F0CC85] sm:text-2xl">{qz(c.anticipo)}</dd>
            </div>
          </dl>
          <button type="button" aria-expanded={abierto} onClick={() => setAbierto((v) => !v)} className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-[#D6CCBF] lg:hidden">
            Detalle {abierto ? <ChevronDown size={16} aria-hidden /> : <ChevronUp size={16} aria-hidden />}
          </button>
          <div className="flex w-full min-w-0 gap-2 sm:w-auto">
            <button type="button" onClick={alVaciar} className="min-h-11 rounded-lg border border-white/30 px-4 text-sm font-bold hover:bg-white/10">
              Vaciar
            </button>
            <button type="button" disabled={faltan.length > 0} onClick={alReservar} className={`${boton.bronce} flex-1 sm:flex-none`}>
              Reservar fecha
            </button>
          </div>
        </div>
        {abierto && (
          <p className="px-4 pb-3 text-xs text-[#B8AEA2] lg:hidden">
            {num(piezas)} piezas · {diaCorto(plan.fecha)} · {ZONAS[plan.zona].nombre}
          </p>
        )}
      </div>
    </div>
  );
}

const TIPOS = ["Boda", "Evento corporativo", "Cena de gala", "Recepción o cóctel", "Primera comunión o bautizo", "XV años", "Otro evento"];
const HORAS = ["12:00", "14:00", "16:00", "18:00", "19:00"];

export function Reserva({ imp, plan, cesta, alCerrar, alConfirmada, alEvento }: { imp: Imperial; plan: Plan; cesta: Cesta; alCerrar: () => void; alConfirmada: () => void; alEvento: (folio: string) => void }) {
  const [pedido] = useState(cesta);
  const [hecha, setHecha] = useState<Orden | null>(null);
  const [error, setError] = useState("");
  const [d, setD] = useState({ cliente: "", tel: "", lugar: "", evento: TIPOS[0], hora: "14:00" });
  const c = cuentas(pedido, plan.zona);
  const poner = (k: keyof typeof d) => (e: { target: { value: string } }) => setD((x) => ({ ...x, [k]: e.target.value }));

  function confirmar(e: FormEvent) {
    e.preventDefault();
    if (d.cliente.trim().length < 3) return setError("Escriba su nombre.");
    if (d.tel.replace(/\D/g, "").length !== 8) return setError("Escriba su teléfono de 8 dígitos.");
    if (d.lugar.trim().length < 3) return setError("Escriba la finca, salón o dirección del evento.");
    if (renglones(pedido).some((r) => r.n > imp.libres(plan.fecha, r.id))) return setError("El inventario de esa fecha cambió. Cierre y ajuste las cantidades.");
    setHecha(imp.reservar({ ...d, cliente: d.cliente.trim(), lugar: d.lugar.trim(), zona: plan.zona, fecha: plan.fecha, cesta: pedido, origen: "web", mia: true }));
    alConfirmada();
  }

  const resumen = (
    <dl className="mt-5 grid gap-2 rounded-xl bg-[#F3EFEA] p-5 text-[0.95rem]">
      {(
        [
          ["Mobiliario", c.subtotal],
          [`Flete a ${ZONAS[plan.zona].nombre}`, c.flete],
          ["Depósito reembolsable (15%)", c.deposito],
          ["Total", c.total],
          ["Anticipo para apartar (50%)", c.anticipo],
          ["Saldo al montar", c.total - c.anticipo],
        ] as const
      ).map(([n, v]) => (
        <div key={n} className={`flex justify-between gap-4 ${n === "Total" || n.startsWith("Anticipo") ? "font-extrabold text-[#1C1917]" : ""} ${n === "Total" ? "border-t border-[#D6CDC1] pt-2" : ""}`}>
          <dt className="min-w-0">{n}</dt>
          <dd className="shrink-0">{qz(v)}</dd>
        </div>
      ))}
    </dl>
  );

  if (hecha) {
    const texto = [
      `Casa Imperial · Reserva ${hecha.folio}`,
      `${hecha.evento} de ${hecha.cliente}`,
      `Fecha: ${diaLargo(hecha.fecha)}, ${hecha.hora} h (montaje desde las ${antes(hecha.hora, 6)})`,
      `Lugar: ${hecha.lugar}, ${ZONAS[hecha.zona].nombre}`,
      ...renglones(hecha.cesta).map((r) => `- ${r.n} ${r.art.nombre}`),
      `Total ${qz(c.total)} · Anticipo ${qz(c.anticipo)} · Saldo al montar ${qz(c.total - c.anticipo)}`,
    ].join("\n");
    return (
      <Ventana titulo={`Reserva ${hecha.folio} registrada`} alCerrar={alCerrar}>
        <p className="mt-4 flex items-start gap-3">
          <CircleCheck size={22} aria-hidden className="mt-0.5 shrink-0 text-[#3F6212]" />
          <span className="min-w-0">
            El mobiliario quedó bloqueado para el {diaLargo(hecha.fecha)}. Montaje desde las {antes(hecha.hora, 6)} h. Para confirmar la fecha, reporte su anticipo desde Mi Evento.
          </span>
        </p>
        {resumen}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => alEvento(hecha.folio)} className={boton.oscuro}>
            Ver en Mi Evento
          </button>
          <a href={`https://wa.me/?text=${encodeURIComponent(texto)}`} target="_blank" rel="noopener noreferrer" className={boton.linea}>
            <MessageCircle size={17} aria-hidden /> Enviar resumen por WhatsApp
          </a>
        </div>
      </Ventana>
    );
  }

  return (
    <Ventana titulo="Reservar su fecha" alCerrar={alCerrar}>
      <p className="mt-2">
        {diaLargo(plan.fecha)} · {ZONAS[plan.zona].nombre}
      </p>
      <form onSubmit={confirmar} noValidate className="mt-5 grid gap-4">
        <label className="block min-w-0">
          <span className={rotulo}>Su nombre</span>
          <input className={campo} value={d.cliente} onChange={poner("cliente")} autoComplete="name" maxLength={60} />
        </label>
        <label className="block min-w-0">
          <span className={rotulo}>Teléfono</span>
          <input className={campo} value={d.tel} onChange={poner("tel")} inputMode="tel" autoComplete="tel" maxLength={14} />
        </label>
        <label className="block min-w-0">
          <span className={rotulo}>Finca, salón o dirección del evento</span>
          <input className={campo} value={d.lugar} onChange={poner("lugar")} maxLength={80} />
        </label>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <label className="block min-w-0">
            <span className={rotulo}>Tipo de evento</span>
            <select className={campo} value={d.evento} onChange={poner("evento")}>
              {TIPOS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="block min-w-0">
            <span className={rotulo}>Empieza a las</span>
            <select className={campo} value={d.hora} onChange={poner("hora")}>
              {HORAS.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </label>
        </div>
        {resumen}
        {error && (
          <p role="alert" className="font-semibold text-[#9F2F1E]">
            {error}
          </p>
        )}
        <button type="submit" className={`${boton.bronce} !min-h-13 w-full text-base`}>
          Confirmar reserva
        </button>
      </form>
    </Ventana>
  );
}
