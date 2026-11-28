/* Lo que abren los atajos de recepción: cobro rápido, mostrador (socio nuevo o visita) y recordatorio masivo. */
import { useState, type FormEvent } from "react";
import { Banknote, ChevronRight, CircleCheck, CreditCard, DoorOpen, FileText, Landmark, MessageCircle, Search, Send, Ticket, UserPlus } from "lucide-react";
import { NOMBRE_METODO, PLANES, PRECIO_VISITA, SEDES, fechaEn, planDe, qz, textoDias, type Club, type PlanId, type SedeId, type Socio } from "./datos";
import { enlaceWhatsApp, mensajeDe } from "./avisos";
import { Opciones } from "./Pago";
import { BORDE, CAMPO, ROTULO, VERDE, Ventana } from "./Piezas";

/* para buscar sin importar tildes ni mayúsculas */
export const plano = (t: string) => t.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export function CobroRapido({ club, alElegir, alCerrar }: { club: Club; alElegir: (id: number) => void; alCerrar: () => void }) {
  const [busqueda, setBusqueda] = useState("");
  /* primero quien debe y después por fecha de vencimiento */
  const lista = [...club.socios].sort((a, b) => a.dias - b.dias).filter((s) => plano(s.nombre).includes(plano(busqueda.trim())));
  return (
    <Ventana titulo="Cobro rápido" sub="Escoja al socio. Primero salen los que deben." alCerrar={alCerrar}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (lista[0]) alElegir(lista[0].id);
        }}
        className="relative"
      >
        <Search size={18} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input data-foco type="search" aria-label="Buscar socio para cobrar" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Escriba un nombre y presione Enter" className={`${CAMPO} !pl-11`} />
      </form>
      {lista.length === 0 ? (
        <p className="mt-4 text-center font-bold text-[#0F172A]">No hay socios con ese nombre.</p>
      ) : (
        <ul className="mt-3 grid max-h-[22rem] gap-2 overflow-y-auto">
          {lista.map((s) => (
            <li key={s.id}>
              <button type="button" onClick={() => alElegir(s.id)} className="flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-2.5 text-left hover:border-[#15803D] hover:bg-green-50">
                <span className="min-w-0 flex-1">
                  <b className="block truncate text-[#0F172A]">{s.nombre}</b>
                  <span className={`block text-[0.82rem] font-semibold ${s.dias <= 0 ? "text-red-700" : "text-slate-600"}`}>{textoDias(s.dias)}</span>
                </span>
                <b className="shrink-0 text-[#0F172A]">{qz(planDe(s.plan).precio)}</b>
                <ChevronRight size={18} aria-hidden className="shrink-0 text-slate-400" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Ventana>
  );
}

type Forma = "efectivo" | "pos" | "transferencia";

export function Mostrador({ club, alCerrar, alVerFicha }: { club: Club; alCerrar: () => void; alVerFicha: (id: number) => void }) {
  const [tipo, setTipo] = useState<"socio" | "visita">("socio");
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [plan, setPlan] = useState<PlanId>("ilimitado");
  const [sede, setSede] = useState<SedeId>("z14");
  const [forma, setForma] = useState<Forma>("efectivo");
  const [boleta, setBoleta] = useState("");
  const [intento, setIntento] = useState(false);
  const [hecho, setHecho] = useState<{ nombre: string; id: number | null } | null>(null);

  const socio = tipo === "socio";
  const monto = socio ? planDe(plan).precio : PRECIO_VISITA;
  const malNombre = nombre.trim().length < 3;
  const malTel = socio && tel.length !== 8;
  const malBoleta = forma === "transferencia" && boleta.trim().length < 4;

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (malNombre || malTel || malBoleta) {
      setIntento(true);
      return;
    }
    const limpio = nombre.trim().replace(/\s+/g, " ");
    if (socio) {
      const detalle = forma === "transferencia" ? `Inscripción en mostrador, boleta ${boleta.trim()}` : "Inscripción en mostrador";
      setHecho({ nombre: limpio, id: club.inscribir({ nombre: limpio, plan, sede, telefono: tel, metodo: forma, detalle }) });
    } else {
      club.visita(limpio, forma);
      setHecho({ nombre: limpio, id: null });
    }
  }

  const error = (mal: boolean, texto: string) => intento && mal && <span className="text-[0.8rem] font-semibold text-red-700">{texto}</span>;

  if (hecho)
    return (
      <Ventana titulo={hecho.id ? "Socio inscrito" : "Visita registrada"} sub={hecho.nombre} alCerrar={alCerrar}>
        <div role="status" className="flex items-center gap-3 rounded-xl bg-green-50 p-4 text-[#14532D]">
          <CircleCheck size={30} aria-hidden className="shrink-0" />
          <p className="min-w-0 font-bold">
            {hecho.id ? `Carné activo hasta el ${fechaEn(30)}. Cobrado ${qz(monto)}.` : `Talanquera abierta. Cobrado ${qz(monto)} (${NOMBRE_METODO[forma].toLowerCase()}).`}
          </p>
        </div>
        <div className="mt-4 grid gap-2.5">
          <button type="button" onClick={alCerrar} className={VERDE}>
            Listo
          </button>
          {hecho.id && (
            <button type="button" onClick={() => alVerFicha(hecho.id!)} className={BORDE}>
              <FileText size={18} aria-hidden /> Completar su ficha
            </button>
          )}
        </div>
      </Ventana>
    );

  return (
    <Ventana titulo="Mostrador" sub="Inscriba a un socio o deje pasar a una visita." alCerrar={alCerrar}>
      <form onSubmit={enviar} noValidate className="grid min-w-0 gap-5">
        <div role="group" aria-label="Qué va a registrar" className="grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 p-1.5">
          {(
            [
              ["socio", "Nuevo socio", UserPlus],
              ["visita", `Visita del día · ${qz(PRECIO_VISITA)}`, Ticket],
            ] as const
          ).map(([id, texto, Icono]) => (
            <button
              key={id}
              type="button"
              aria-pressed={tipo === id}
              onClick={() => {
                setTipo(id);
                setIntento(false);
              }}
              className={`flex min-h-12 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-2 text-[0.88rem] font-bold leading-tight ${tipo === id ? "bg-[#0F172A] text-white" : "text-[#0F172A] hover:bg-white"}`}
            >
              <Icono size={17} aria-hidden className="shrink-0" />
              {texto}
            </button>
          ))}
        </div>

        <label className={ROTULO}>
          Nombre completo
          <input data-foco value={nombre} onChange={(e) => setNombre(e.target.value.slice(0, 60))} aria-invalid={intento && malNombre} className={CAMPO} />
          {error(malNombre, "Escriba nombre y apellido.")}
        </label>

        {socio && (
          <>
            <label className={ROTULO}>
              WhatsApp (8 números)
              <input value={tel} onChange={(e) => setTel(e.target.value.replace(/\D/g, "").slice(0, 8))} inputMode="numeric" aria-invalid={intento && malTel} className={CAMPO} />
              {error(malTel, "Faltan números: deben ser 8.")}
            </label>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <label className={ROTULO}>
                Plan
                <select value={plan} onChange={(e) => setPlan(e.target.value as PlanId)} className={CAMPO}>
                  {PLANES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} · {qz(p.precio)}
                    </option>
                  ))}
                </select>
              </label>
              <label className={ROTULO}>
                Sede
                <select value={sede} onChange={(e) => setSede(e.target.value as SedeId)} className={CAMPO}>
                  {SEDES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </>
        )}

        <Opciones
          titulo="Forma de pago"
          elegida={forma}
          alElegir={(v) => {
            setForma(v);
            setIntento(false);
          }}
          opciones={[
            { id: "efectivo", nombre: "Efectivo", icono: Banknote },
            { id: "pos", nombre: "POS Tarjeta", icono: CreditCard },
            { id: "transferencia", nombre: "Transferencia", icono: Landmark },
          ]}
        />
        {forma === "transferencia" && (
          <label className={ROTULO}>
            Número de boleta
            <input value={boleta} onChange={(e) => setBoleta(e.target.value.slice(0, 20))} inputMode="numeric" aria-invalid={intento && malBoleta} className={CAMPO} />
            {error(malBoleta, "Escriba el número de boleta (mínimo 4 caracteres).")}
          </label>
        )}

        <button type="submit" className={`${VERDE} !min-h-14 !text-[1.02rem]`}>
          {socio ? <UserPlus size={19} aria-hidden /> : <DoorOpen size={19} aria-hidden />}
          {socio ? `Inscribir y cobrar ${qz(monto)}` : `Cobrar ${qz(monto)} y abrir`}
        </button>
      </form>
    </Ventana>
  );
}

export function Masivo({ club, alCerrar }: { club: Club; alCerrar: () => void }) {
  /* la lista se fija al abrir, para que no cambie mientras se revisa */
  const [ids] = useState(() => club.socios.filter((s) => s.dias <= 0).map((s) => s.id));
  const [registrados, setRegistrados] = useState(false);
  const deudores = ids.map((id) => club.socios.find((s) => s.id === id)).filter((s): s is Socio => !!s);
  const cuantos = deudores.length === 1 ? "1 socio" : `${deudores.length} socios`;

  return (
    <Ventana titulo="Recordatorio a vencidos" sub={deudores.length ? `${cuantos} con mora` : "Nadie tiene mora"} alCerrar={alCerrar}>
      {deudores.length === 0 ? (
        <p className="font-bold text-[#0F172A]">Todos los socios están al día. No hay a quién recordar.</p>
      ) : (
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
          <div className="min-w-0 rounded-xl bg-[#F8FAFC] p-4">
            <p className="text-[0.78rem] font-bold text-slate-500">Así se ve el mensaje</p>
            <p className="mt-1.5 text-[0.9rem] text-[#0F172A] [overflow-wrap:anywhere]">{mensajeDe(deudores[0])}</p>
          </div>
          <ul className="grid max-h-56 grid-cols-[minmax(0,1fr)] gap-2 overflow-y-auto">
            {deudores.map((s) => (
              <li key={s.id} className="flex items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-2">
                <span className="min-w-0 flex-1">
                  <b className="block truncate text-[#0F172A]">{s.nombre}</b>
                  <span className="block text-[0.82rem] text-slate-600">
                    {qz(planDe(s.plan).precio)} · {textoDias(s.dias)}
                  </span>
                </span>
                <a href={enlaceWhatsApp(s)} target="_blank" rel="noopener noreferrer" onClick={() => club.avisar(s.id, "whatsapp")} className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-[0.82rem] font-bold text-[#0F172A] hover:border-[#15803D]">
                  <MessageCircle size={16} aria-hidden className="text-[#15803D]" /> Abrir chat
                </a>
              </li>
            ))}
          </ul>
          {registrados ? (
            <div role="status" className="flex items-start gap-3 rounded-xl border border-green-300 bg-green-50 p-4 text-[#14532D]">
              <CircleCheck size={26} aria-hidden className="shrink-0" />
              <p className="min-w-0 text-[0.9rem]">
                <b className="block text-[1rem]">Recordatorio registrado a {cuantos}</b>
                Envío simulado: no salió ningún mensaje. Para enviarlos de una vez hay que conectar WhatsApp Business.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                club.recordarATodos(ids);
                setRegistrados(true);
              }}
              className={`${VERDE} !min-h-14 !text-[1.02rem]`}
            >
              <Send size={19} aria-hidden /> Enviar recordatorio a {cuantos}
            </button>
          )}
          <button type="button" onClick={alCerrar} className={BORDE}>
            Cerrar
          </button>
        </div>
      )}
    </Ventana>
  );
}
