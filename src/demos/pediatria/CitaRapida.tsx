/* Cita rápida: la ventana que se abre desde Inicio para apartar sin salir de la página. */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CalendarCheck, Check, CircleAlert, MessageCircle, X } from "lucide-react";
import {
  MOTIVOS, PEDIATRAS, TEL_EMERGENCIAS, enlaceWhatsApp, estaLibre, faltaEnCita, fechaLarga, formatoQ, hora12, horasDelDia, mayus,
  mensajeDeCita, mesesDeEdad, motivoPor, pediatraPor, proximosDias,
  type Clinica, type MotivoId, type Unidad,
} from "./datos";

export type PedidoRapido = { motivo: MotivoId; pediatraId: string };

export function CitaRapida({ clinica, pedido, alCerrar, alPortal }: { clinica: Clinica; pedido: PedidoRapido; alCerrar: () => void; alPortal: () => void }) {
  const ventana = useRef<HTMLDialogElement>(null);
  const [motivo, setMotivo] = useState(pedido.motivo);
  const [pediatraId, setPediatra] = useState(pedido.pediatraId);
  const [fechaElegida, setFecha] = useState("");
  const [horaElegida, setHora] = useState("");
  const [nino, setNino] = useState("");
  const [edad, setEdad] = useState("");
  const [unidad, setUnidad] = useState<Unidad>("meses");
  const [tutor, setTutor] = useState("");
  const [telefono, setTelefono] = useState("");
  const [aviso, setAviso] = useState("");
  const [confirmadaId, setConfirmada] = useState("");

  useEffect(() => {
    const d = ventana.current;
    if (d && !d.open) d.showModal();
  }, []);

  const libresDe = (fecha: string) => horasDelDia(fecha).filter((h) => estaLibre(clinica, pediatraId, fecha, h));
  const dias = proximosDias().filter((d) => libresDe(d).length);
  const fecha = dias.includes(fechaElegida) ? fechaElegida : (dias[0] ?? "");
  const horas = fecha ? libresDe(fecha) : [];
  const hora = horas.includes(horaElegida) ? horaElegida : "";
  const confirmada = clinica.citas.find((c) => c.id === confirmadaId);
  const paciente = confirmada && clinica.pacientes.find((p) => p.id === confirmada.pacienteId);

  function confirmar(e: FormEvent) {
    e.preventDefault();
    const falta = faltaEnCita({ fecha, hora, nino, edad, unidad, tutor, telefono });
    if (falta) {
      setAviso(falta[1]);
      document.getElementById(`pa-m-${falta[0]}`)?.focus();
      return;
    }
    setConfirmada(clinica.agendar({ fecha, hora, pediatraId, motivo, vacunas: [], nota: "", nino, meses: mesesDeEdad(edad, unidad)!, tutor, telefono, origen: "inicio" }));
    setAviso("");
    ventana.current?.scrollTo({ top: 0 });
  }

  /* un cambio en cualquier campo quita el aviso */
  const poner = (cambio: (v: string) => void) => (e: { target: { value: string } }) => {
    cambio(e.target.value);
    setAviso("");
  };

  return (
    <dialog
      ref={ventana}
      className="pa-modal"
      aria-labelledby="pa-modal-titulo"
      onClose={alCerrar}
      onClick={(e) => e.target === ventana.current && ventana.current?.close()}
    >
      <div className="pa-modal-caja">
        <div className="pa-modal-cabeza">
          <div>
            {confirmada && (
              <span className="pa-sello">
                <Check size={26} aria-hidden />
              </span>
            )}
            <h2 id="pa-modal-titulo">{confirmada ? "Cita apartada" : "Agendar consulta"}</h2>
            <p className="pa-suave">{confirmada ? `Número ${confirmada.id}` : "Consultas de 30 minutos, a la hora apartada."}</p>
          </div>
          <button type="button" className="pa-cerrar" aria-label="Cerrar" onClick={() => ventana.current?.close()}>
            <X size={20} aria-hidden />
          </button>
        </div>

        {confirmada ? (
          <>
            <dl className="pa-resumen">
              {[
                ["Paciente", paciente?.nombre ?? ""],
                ["Motivo", motivoPor(confirmada.motivo).nombre],
                ["Pediatra", pediatraPor(confirmada.pediatraId).nombre],
                ["Fecha", mayus(fechaLarga(confirmada.fecha))],
                ["Hora", hora12(confirmada.hora)],
              ].map(([t, d]) => (
                <div key={t}>
                  <dt>{t}</dt>
                  <dd>{d}</dd>
                </div>
              ))}
            </dl>
            <p className="pa-modal-total">
              <span>Total estimado</span>
              <strong>{formatoQ(motivoPor(confirmada.motivo).precio)}</strong>
            </p>
            <div className="pa-modal-botones">
              <a className="pa-btn pa-cita" href={enlaceWhatsApp(mensajeDeCita(confirmada, paciente))} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} aria-hidden /> Enviar confirmación por WhatsApp
              </a>
              <button type="button" className="pa-btn pa-contorno" onClick={alPortal}>
                Ver el carné en Portal Padres <ArrowRight size={18} aria-hidden />
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={confirmar} noValidate>
            <label className="pa-campo">
              <span>Motivo</span>
              <select value={motivo} onChange={poner((v) => setMotivo(v as MotivoId))}>
                {MOTIVOS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} · {formatoQ(m.precio)}
                  </option>
                ))}
              </select>
            </label>
            {motivo === "vacunacion" && <p className="pa-suave">El precio de cada vacuna se suma. Puede verlo y elegirla en Portal Padres.</p>}
            {motivo === "sintomas" && (
              <p className="pa-urgente">
                <CircleAlert size={17} aria-hidden />
                <span>Si su bebé tiene menos de 3 meses y fiebre, o le cuesta respirar, no espere la cita: llame a emergencias ({TEL_EMERGENCIAS}).</span>
              </p>
            )}
            <label className="pa-campo">
              <span>Pediatra</span>
              <select value={pediatraId} onChange={poner(setPediatra)}>
                {PEDIATRAS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </label>
            <div className="pa-dos">
              <label className="pa-campo">
                <span>Fecha</span>
                <select value={fecha} onChange={poner(setFecha)}>
                  {dias.map((d) => (
                    <option key={d} value={d}>
                      {mayus(fechaLarga(d))}
                    </option>
                  ))}
                </select>
              </label>
              <label className="pa-campo">
                <span>Hora</span>
                <select id="pa-m-hora" value={hora} onChange={poner(setHora)}>
                  <option value="">Elija una hora</option>
                  {horas.map((h) => (
                    <option key={h} value={h}>
                      {hora12(h)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="pa-campo">
                <span>Nombre del niño o niña</span>
                <input id="pa-m-nino" value={nino} autoComplete="off" onChange={poner(setNino)} />
              </label>
              <div className="pa-campo">
                <span>Edad</span>
                <div className="pa-edad">
                  <input id="pa-m-edad" aria-label="Edad en números" inputMode="numeric" value={edad} onChange={poner((v) => setEdad(v.replace(/\D/g, "")))} />
                  <select aria-label="Meses o años" value={unidad} onChange={poner((v) => setUnidad(v as Unidad))}>
                    <option value="meses">meses</option>
                    <option value="años">años</option>
                  </select>
                </div>
              </div>
              <label className="pa-campo">
                <span>Mamá, papá o encargado</span>
                <input id="pa-m-tutor" value={tutor} autoComplete="name" onChange={poner(setTutor)} />
              </label>
              <label className="pa-campo">
                <span>Teléfono</span>
                <input id="pa-m-telefono" type="tel" inputMode="tel" value={telefono} autoComplete="tel" onChange={poner(setTelefono)} />
              </label>
            </div>
            <p className="pa-modal-total">
              <span>{motivoPor(motivo).nombre}</span>
              <strong>{formatoQ(motivoPor(motivo).precio)}</strong>
            </p>
            {aviso && (
              <p className="pa-falta" role="alert">
                {aviso}
              </p>
            )}
            <button type="submit" className="pa-btn pa-cita pa-lleno">
              <CalendarCheck size={18} aria-hidden /> Confirmar cita
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
