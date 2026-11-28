import { useState, type FormEvent } from "react";
import { CalendarClock, CalendarPlus, Check, Download, MessageCircle, ReceiptText, Share2, Trash2 } from "lucide-react";
import { resumenCarnet, descargarCarnet } from "./carnet";
import { CLIENTA, ESTADOS, PRODUCTOS, SERVICIOS, diasHasta, enlaceWhatsApp, fechaCorta, fechaRelativa, hora12, hoyIso, qz, type Cita, type Estado, type Mascota } from "./datos";
import { horasLibres, porHorario, precioDe, ultimasAplicaciones, type ClinicaViva } from "./estado";
import { Retrato, Ventana } from "./Piezas";

const PASOS: Estado[] = ["espera", "atencion", "lista"];

function Refuerzo({ proxima, reforzada }: { proxima: string; reforzada: boolean }) {
  const dias = diasHasta(proxima);
  if (reforzada) return <span className="hv-chip hv-chip-neutro">Reforzada</span>;
  if (dias < 0) return <span className="hv-chip hv-chip-vencida">Vencida</span>;
  if (dias <= 14) return <span className="hv-chip hv-chip-pronto">{dias === 0 ? "Vence hoy" : `Vence en ${dias} ${dias === 1 ? "día" : "días"}`}</span>;
  return <span className="hv-chip hv-chip-bien">Al día</span>;
}

function Carnet({ mascota, alCompartir }: { mascota: Mascota; alCompartir: () => void }) {
  const vigentes = new Set([...ultimasAplicaciones(mascota).values()].map((v) => v.id));
  const filas = [...mascota.vacunas].sort((a, b) => b.aplicada.localeCompare(a.aplicada));
  const pesos = [...mascota.pesos].reverse();

  return (
    <div className="grid min-w-0 gap-6">
      <section aria-labelledby="hv-carnet" className="hv-tarjeta overflow-hidden">
        <div className="flex flex-wrap items-center gap-4 border-b border-[#E2E8F0] p-6">
          <Retrato mascota={mascota} className="size-20" />
          <div className="min-w-0 flex-1">
            <h2 id="hv-carnet" className="text-2xl font-extrabold">
              Carnet de {mascota.nombre}
            </h2>
            <p className="text-sm">
              {mascota.raza} · {mascota.edad}
              {pesos[0] && ` · ${pesos[0].kg} kg`}
            </p>
          </div>
          <button type="button" onClick={alCompartir} disabled={!filas.length} className="hv-boton hv-turquesa w-full sm:w-auto">
            <Share2 size={17} aria-hidden /> Descargar carnet / Enviar por WhatsApp
          </button>
        </div>

        <h3 className="px-6 pt-5 text-base font-extrabold">Vacunas y desparasitación</h3>
        {filas.length ? (
          <div className="min-w-0 overflow-x-auto px-6 pb-4 pt-2">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-xs text-[#64748B]">
                  <th scope="col" className="py-2 pr-3 font-bold">Aplicación</th>
                  <th scope="col" className="py-2 pr-3 font-bold">Aplicada</th>
                  <th scope="col" className="py-2 pr-3 font-bold">Próximo refuerzo</th>
                  <th scope="col" className="py-2 font-bold">Estado</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {filas.map((v) => (
                  <tr key={v.id} className="border-b border-[#F1F5F9] last:border-0">
                    <th scope="row" className="py-3 pr-3 font-bold text-[#0F172A]">
                      {v.nombre}
                      <span className="block text-xs font-medium text-[#64748B]">{v.medico}</span>
                    </th>
                    <td className="py-3 pr-3 whitespace-nowrap">{fechaCorta(v.aplicada)}</td>
                    <td className="py-3 pr-3 whitespace-nowrap font-bold text-[#0F172A]">{fechaCorta(v.proxima)}</td>
                    <td className="py-3">
                      <Refuerzo proxima={v.proxima} reforzada={!vigentes.has(v.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 pb-6 pt-2 text-sm">El carnet se llena en la primera visita, cuando el médico registra cada aplicación.</p>
        )}
      </section>

      <section aria-labelledby="hv-pesos" className="hv-tarjeta p-6">
        <h3 id="hv-pesos" className="text-base font-extrabold">Peso histórico</h3>
        {pesos.length ? (
          <ol className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {pesos.slice(0, 4).map((p, i) => {
              const anterior = pesos[i + 1];
              const cambio = anterior ? Math.round((p.kg - anterior.kg) * 10) / 10 : 0;
              return (
                <li key={p.fecha} className={`rounded-2xl p-4 ${i === 0 ? "bg-[#F0FDFA]" : "bg-[#F8FAFC]"}`}>
                  <p className="text-xs font-bold text-[#64748B]">{fechaCorta(p.fecha)}</p>
                  <p className="mt-1 text-2xl font-extrabold tabular-nums text-[#0F172A]">{p.kg} kg</p>
                  <p className="text-xs font-semibold tabular-nums text-[#475569]">
                    {!anterior ? "Primer registro" : cambio === 0 ? "Sin cambio" : `${cambio > 0 ? "Subió" : "Bajó"} ${Math.abs(cambio)} kg`}
                  </p>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="mt-2 text-sm">Se anota en la primera visita.</p>
        )}
      </section>
    </div>
  );
}

function Reprogramar({ clinica, cita, alCerrar, alAvisar }: { clinica: ClinicaViva; cita: Cita; alCerrar: () => void; alAvisar: (texto: string) => void }) {
  const [fecha, setFecha] = useState(cita.fecha);
  const [elegida, setElegida] = useState(cita.hora);
  const libres = horasLibres(clinica.citas, SERVICIOS[cita.servicio].area, fecha, cita.id);
  const hora = libres.includes(elegida) ? elegida : (libres[0] ?? "");

  function guardar(e: FormEvent) {
    e.preventDefault();
    clinica.reprogramar(cita.id, fecha, hora);
    alAvisar(`Cita movida: ${fechaRelativa(fecha).toLowerCase()} a las ${hora12(hora)}.`);
    alCerrar();
  }

  return (
    <Ventana titulo="Reprogramar cita" alCerrar={alCerrar}>
      <form onSubmit={guardar} className="grid gap-4">
        <p className="text-sm">{SERVICIOS[cita.servicio].nombre}</p>
        <label className="block">
          <span className="hv-rotulo">Nueva fecha</span>
          <input type="date" value={fecha} min={hoyIso()} onChange={(e) => setFecha(e.target.value)} className="hv-campo" />
        </label>
        <label className="block">
          <span className="hv-rotulo">Horario disponible</span>
          <select value={hora} onChange={(e) => setElegida(e.target.value)} disabled={!libres.length} className="hv-campo">
            {libres.length ? (
              libres.map((h) => (
                <option key={h} value={h}>
                  {hora12(h)}
                </option>
              ))
            ) : (
              <option value="">Sin horarios ese día</option>
            )}
          </select>
        </label>
        <button type="submit" disabled={!hora} className="hv-boton hv-turquesa">
          Guardar nuevo horario
        </button>
      </form>
    </Ventana>
  );
}

function ProximaCita({ clinica, mascota, alAgendar, alReprogramar }: { clinica: ClinicaViva; mascota: Mascota; alAgendar: () => void; alReprogramar: (c: Cita) => void }) {
  const propias = clinica.citas.filter((c) => c.mascotaId === mascota.id && c.fecha >= hoyIso()).sort(porHorario);
  const pendientes = propias.filter((c) => c.estado !== "entregada");
  const [cita, ...despues] = pendientes;
  const entregada = propias.filter((c) => c.estado === "entregada").at(-1);

  return (
    <section aria-labelledby="hv-proxima" className="hv-tarjeta p-6">
      <h2 id="hv-proxima" className="flex items-center gap-2 text-lg font-extrabold">
        <CalendarClock size={20} aria-hidden className="text-[#0D9488]" /> Próxima cita
      </h2>
      {cita ? (
        <>
          <p className="mt-4 text-xl font-extrabold leading-tight text-[#0F172A]">
            {fechaRelativa(cita.fecha)} · {hora12(cita.hora)}
          </p>
          <p className="mt-1 text-sm">
            {SERVICIOS[cita.servicio].nombre} · <span className="font-bold tabular-nums text-[#0F172A]">{qz(SERVICIOS[cita.servicio].precio)}</span>
          </p>

          <ol aria-label="Estado de la cita" aria-live="polite" className="mt-5 grid gap-0">
            {PASOS.map((paso, i) => {
              const actual = PASOS.indexOf(cita.estado);
              const hecho = i < actual;
              const activo = i === actual;
              return (
                <li key={paso} aria-current={activo ? "step" : undefined} className="flex gap-3">
                  <span className="flex flex-col items-center">
                    <span className={`grid size-8 shrink-0 place-items-center rounded-full border-2 text-xs font-extrabold ${activo ? "border-[#0F766E] bg-[#0F766E] text-white" : hecho ? "border-[#0D9488] bg-[#F0FDFA] text-[#0F766E]" : "border-[#CBD5E1] text-[#64748B]"}`}>
                      {hecho ? <Check size={15} aria-hidden /> : i + 1}
                    </span>
                    {i < PASOS.length - 1 && <span aria-hidden className={`h-5 w-0.5 ${hecho ? "bg-[#0D9488]" : "bg-[#E2E8F0]"}`} />}
                  </span>
                  <span className={`pt-1 text-sm ${activo ? "font-extrabold text-[#0F172A]" : "font-semibold text-[#64748B]"}`}>{ESTADOS[paso].dueno}</span>
                </li>
              );
            })}
          </ol>

          <button type="button" onClick={() => alReprogramar(cita)} disabled={cita.estado !== "espera"} className="hv-boton hv-linea mt-5 w-full">
            Reprogramar
          </button>
          {cita.estado !== "espera" && <p className="mt-2 text-xs text-[#64748B]">{mascota.nombre} ya está en la clínica, así que el horario no se puede cambiar.</p>}

          {despues.length > 0 && (
            <ul className="mt-5 grid gap-2 border-t border-[#E2E8F0] pt-4 text-sm">
              {despues.map((c) => (
                <li key={c.id}>
                  <span className="font-bold text-[#0F172A]">
                    {fechaRelativa(c.fecha)} · {hora12(c.hora)}
                  </span>
                  <span className="block text-xs text-[#64748B]">{SERVICIOS[c.servicio].nombre}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <p className="mt-3 text-sm">{entregada ? `${mascota.nombre} ya fue entregada hoy: ${SERVICIOS[entregada.servicio].nombre.toLowerCase()}.` : `${mascota.nombre} no tiene citas pendientes.`}</p>
          <button type="button" onClick={alAgendar} className="hv-boton hv-turquesa mt-4 w-full">
            <CalendarPlus size={17} aria-hidden /> Agendar para {mascota.nombre}
          </button>
        </>
      )}
    </section>
  );
}

type Props = {
  clinica: ClinicaViva;
  activa: string;
  alElegir: (id: string) => void;
  alAgendar: (mascota?: Mascota) => void;
  alAvisar: (texto: string) => void;
};

export function MisMascotas({ clinica, activa, alElegir, alAgendar, alAvisar }: Props) {
  const propias = clinica.mascotas.filter((m) => m.dueno === CLIENTA.nombre);
  const mascota = propias.find((m) => m.id === activa) ?? propias[0];
  const [compartiendo, setCompartiendo] = useState(false);
  const [moviendo, setMoviendo] = useState<Cita | null>(null);
  const cuenta = clinica.cargos.filter((c) => c.dueno === CLIENTA.nombre && !c.cobro);

  return (
    <div className="hv-ancho py-8 lg:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#0F766E]">Hola, {CLIENTA.nombre.split(" ")[0]}</p>
          <h1 className="text-3xl font-extrabold">Mis Mascotas</h1>
        </div>
        <button type="button" onClick={() => alAgendar()} className="hv-boton hv-linea">
          <CalendarPlus size={17} aria-hidden /> Nueva cita
        </button>
      </div>

      <div role="group" aria-label="Elegir mascota" className="mt-5 flex flex-wrap gap-2">
        {propias.map((m) => (
          <button key={m.id} type="button" aria-pressed={m.id === mascota.id} onClick={() => alElegir(m.id)} className="hv-pildora min-h-13 !pl-1.5">
            <Retrato mascota={m} className="size-10" />
            {m.nombre} · {m.raza}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="order-2 min-w-0 xl:order-1 xl:col-span-8">
          <Carnet mascota={mascota} alCompartir={() => setCompartiendo(true)} />
        </div>
        <div className="order-1 grid min-w-0 content-start gap-6 xl:order-2 xl:col-span-4">
          <ProximaCita clinica={clinica} mascota={mascota} alAgendar={() => alAgendar(mascota)} alReprogramar={setMoviendo} />
          {cuenta.length > 0 && (
            <section aria-labelledby="hv-cuenta" className="hv-tarjeta p-6">
              <h2 id="hv-cuenta" className="flex items-center gap-2 text-lg font-extrabold">
                <ReceiptText size={20} aria-hidden className="text-[#0D9488]" /> Mi cuenta
              </h2>
              <ul className="mt-3 divide-y divide-[#F1F5F9]">
                {cuenta.map((c) => {
                  const nombre = PRODUCTOS.find((p) => p.id === c.productoId)?.nombre;
                  return (
                    <li key={c.id} className="flex items-center gap-2 py-1.5 text-sm">
                      <span className="min-w-0 flex-1 font-semibold text-[#0F172A]">{nombre}</span>
                      <span className="font-bold tabular-nums">{qz(precioDe(c))}</span>
                      <button type="button" aria-label={`Quitar ${nombre}`} onClick={() => clinica.quitarCargo(c.id)} className="grid size-10 place-items-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#B91C1C]">
                        <Trash2 size={16} aria-hidden />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 flex justify-between border-t border-[#E2E8F0] pt-3 font-extrabold text-[#0F172A]">
                <span>Por pagar en clínica</span>
                <span className="tabular-nums">{qz(cuenta.reduce((s, c) => s + precioDe(c), 0))}</span>
              </p>
            </section>
          )}
        </div>
      </div>

      {compartiendo && (
        <Ventana titulo={`Carnet de ${mascota.nombre}`} alCerrar={() => setCompartiendo(false)}>
          <p className="text-sm">Útil para el hotel canino, la guardería o un viaje.</p>
          <p className="mt-4 whitespace-pre-line rounded-2xl bg-[#F0FDFA] p-4 text-sm tabular-nums text-[#0F172A]">{resumenCarnet(mascota)}</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={async () => {
                const lista = await descargarCarnet(mascota);
                setCompartiendo(false);
                alAvisar(lista ? "Carnet descargado como imagen." : "No se pudo crear la imagen. Intenta de nuevo.");
              }}
              className="hv-boton hv-linea"
            >
              <Download size={17} aria-hidden /> Descargar carnet
            </button>
            <a href={enlaceWhatsApp(resumenCarnet(mascota))} target="_blank" rel="noopener noreferrer" className="hv-boton hv-turquesa">
              <MessageCircle size={17} aria-hidden /> Enviar por WhatsApp
            </a>
          </div>
        </Ventana>
      )}

      {moviendo && <Reprogramar clinica={clinica} cita={moviendo} alCerrar={() => setMoviendo(null)} alAvisar={alAvisar} />}
    </div>
  );
}
