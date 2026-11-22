/*
 * Panel de dueño y recepción de Clínica Visual Lumen, armado con el panel CRM compartido.
 * Lo que resuelve: la sala de espera y el retraso del día (la queja más repetida de los pacientes),
 * pacientes con su ficha, el recorrido de cada paciente, mensajes con plantillas y reseñas por responder.
 */
import { useState, type ReactNode } from "react";
import { ArrowRight, Bell, Check, CircleCheck, Clock, Hourglass, Stethoscope, UserCheck } from "lucide-react";
import { MensajeWhatsApp, qz } from "../comun";
import { Agenda, Barras, Boton, Caja, Clientes, Equipo, Insignia, Kpis, Mensajes, PanelCRM, PorAtender, Ranking, Resenas, Tablero, Titulo, type Atencion, type Evento, type Tarjeta } from "../panelcrm";
import { IRIS, NOCHE, PACIENTES_INICIAL, SEDES, type Estado, type Paciente } from "./datos";
import { AUTOMATICOS, AVISOS, CONVERSACIONES, EQUIPO, PACIENTES, PACIENTES_MES, PLANTILLAS, POR_SEDE, RESENAS_PANEL, SERVICIOS_TOP, TARJETAS, TEMA } from "./panel";

const ETIQUETA: Record<Estado, { t: string; c: string; i: ReactNode; boton: string; ib: ReactNode }> = {
  cita: { t: "Todavía no llega", c: "#4a5a70", i: <Clock size={15} />, boton: "Ya llegó", ib: <UserCheck size={18} /> },
  espera: { t: "Esperando su turno", c: "#9a6400", i: <Hourglass size={15} />, boton: "Pasar a consulta", ib: <ArrowRight size={18} /> },
  consulta: { t: "Con el doctor", c: "#0f7f8c", i: <Stethoscope size={15} />, boton: "Terminó la consulta", ib: <Check size={18} /> },
  listo: { t: "Ya fue atendido", c: "#1f7a46", i: <CircleCheck size={15} />, boton: "", ib: null },
};
const ESTADO_AGENDA: Record<Estado, Evento["estado"]> = { cita: "confirmada", espera: "pendiente", consulta: "en curso", listo: "atendida" };

function sumar(h: string, min: number) {
  const [a, b] = h.split(":").map(Number);
  const t = a * 60 + b + min;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

function Marca() {
  return (
    <span className="flex items-center gap-2.5 text-white">
      <svg viewBox="0 0 48 48" width={34} height={34} aria-hidden className="shrink-0">
        <circle cx="24" cy="24" r="22" fill="#fff" />
        <circle cx="24" cy="24" r="12.5" fill={IRIS} />
        <circle cx="24" cy="24" r="6" fill={NOCHE} />
      </svg>
      <span className="leading-none"><span className="block text-[1.2rem] font-bold" style={{ fontFamily: TEMA.titulo }}>Lumen</span><span className="text-[0.72rem] opacity-70">Panel de la clínica</span></span>
    </span>
  );
}

export default function PanelLumen() {
  const [lista, setLista] = useState<Paciente[]>(PACIENTES_INICIAL);
  const [retraso, setRetraso] = useState(0);
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>(TARJETAS);
  const [msg, setMsg] = useState<string | null>(null);

  const enSala = lista.filter((p) => p.estado === "espera").length;
  const atendidos = lista.filter((p) => p.estado === "listo").length;

  function avanzar(id: string) {
    setLista((l) => l.map((p) => (p.id === id ? { ...p, estado: p.estado === "cita" ? "espera" : p.estado === "espera" ? "consulta" : "listo" } : p)));
  }
  function avisarRetraso() {
    const nuevo = retraso + 15;
    setRetraso(nuevo);
    const prox = lista.find((p) => p.estado === "espera" || p.estado === "cita");
    if (prox) setMsg(`Hola, ${prox.nombre.split(" ")[0]}. Le avisamos de Clínica Visual Lumen: hoy llevamos ${nuevo} minutos de retraso. Su nueva hora aproximada es ${sumar(prox.hora, nuevo)}. No tiene que apurarse, le esperamos.`);
  }

  const eventos: Evento[] = lista.map((p) => ({ id: p.id, hora: p.hora, titulo: p.nombre.split(" (")[0], sub: p.servicio, quien: p.doctor.replace("Lic. ", "Lic. ").replace("Dra. ", "Dra. "), estado: ESTADO_AGENDA[p.estado] }));
  const columnas = ["Dra. Mejía", "Dr. Rivas", "Lic. Castillo"];

  return (
    <>
      <PanelCRM tema={TEMA} marca={<Marca />} usuario={{ nombre: "Marta Solís", rol: "Recepción" }} sedes={SEDES.map((s) => s.nombre)} avisos={AVISOS} nombresMenu={{ clientes: "Pacientes" }}>
        {(sec, q, ir) => {
          if (sec === "hoy") {
            const atender: Atencion[] = [
              ...(retraso === 0 && enSala > 0 ? [{ id: "a1", texto: `Hay ${enSala} paciente${enSala > 1 ? "s" : ""} esperando en sala. Si hay retraso, avise antes de que se desesperen.`, boton: "Avisar retraso", alTocar: avisarRetraso, urgencia: "alta" as const }] : []),
              { id: "a2", texto: "Una reseña de 3 estrellas sin responder: se queja de la espera.", boton: "Responder", alTocar: () => ir("resenas"), urgencia: "alta" as const },
              { id: "a3", texto: "Carmen de León no ha confirmado su cita de las 11:00.", boton: "Escribirle", alTocar: () => setMsg("Hola, Carmen. Le escribimos de Clínica Visual Lumen para confirmar su cita de hoy a las 11:00 con la Dra. Mejía. ¿Nos confirma si viene?") },
              { id: "a4", texto: "2 solicitudes nuevas de WhatsApp sin contestar.", boton: "Ver mensajes", alTocar: () => ir("mensajes") },
            ];
            return (
              <>
                <Titulo t="Hoy en la clínica" sub="Sábado 21 de noviembre. Lo urgente sale primero." derecha={<Boton alTocar={avisarRetraso}><Bell size={16} /> Hay retraso: avisar a los que siguen</Boton>} />
                <Kpis items={[
                  { t: "Citas de hoy", v: String(lista.length), nota: `${atendidos} atendidos` },
                  { t: "En sala de espera", v: String(enSala), tono: enSala > 2 ? "alerta" : "normal" },
                  { t: "Espera promedio", v: "14 min", nota: "Meta: menos de 15", tono: "bien" },
                  { t: "Retraso del día", v: retraso ? `${retraso} min` : "Ninguno", tono: retraso ? "alerta" : "bien" },
                ]} />
                <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_1fr]">
                  <PorAtender items={atender} vacio="Todo al día. Nada urgente." />
                  <Caja>
                    <h2 className="text-[1.1rem] font-bold" style={{ fontFamily: TEMA.titulo }}>Sala de espera</h2>
                    <p className="mt-1 text-[0.9rem] opacity-70">Cuando pase algo, toque el botón de color de ese paciente.</p>
                    <ul className="mt-3 divide-y" style={{ borderColor: TEMA.borde }}>
                      {lista.map((p) => {
                        const e = ETIQUETA[p.estado];
                        return (
                          <li key={p.id} className="flex flex-wrap items-center gap-3 py-2.5">
                            <b className="w-12 tabular-nums">{p.hora}</b>
                            <span className="min-w-[8rem] flex-1"><span className="block font-bold leading-tight">{p.nombre}</span><span className="text-[0.82rem] opacity-70">{p.servicio} · {p.doctor}</span>{p.nota && <span className="block text-[0.8rem] font-semibold" style={{ color: TEMA.acento }}>{p.nota}</span>}</span>
                            <Insignia icono={e.i} texto={e.t} color={e.c} />
                            {p.estado !== "listo" && <Boton alTocar={() => avanzar(p.id)} chico>{e.ib} {e.boton}</Boton>}
                          </li>
                        );
                      })}
                    </ul>
                    {retraso > 0 && <button type="button" onClick={() => setRetraso(0)} className="mt-3 flex items-center gap-2 text-[0.9rem] font-bold underline"><Check size={15} /> Ya nos pusimos al día</button>}
                  </Caja>
                </div>
              </>
            );
          }
          if (sec === "agenda") {
            return (<><Titulo t="Agenda" sub="Una columna por doctor. Cambia sola cuando recepción marca que llegó o pasó a consulta." /><Agenda eventos={eventos} columnas={columnas} horas={["08:30", "09:00", "09:30", "10:00", "10:30", "11:00"]} dia="Hoy · sábado 21 de noviembre" /></>);
          }
          if (sec === "clientes") {
            return (<><Titulo t="Pacientes" sub="Busque por nombre o teléfono arriba. Toque un paciente para ver su ficha y su historial." /><Clientes lista={PACIENTES} q={q} colEtiqueta="Tipo" demo="clínica oftalmológica" mensaje={(c) => `Hola, ${c.nombre.split(" ")[0]}. Le escribimos de Clínica Visual Lumen. ${c.proxima.startsWith("Hoy") ? `Le recordamos su cita de ${c.proxima.toLowerCase()}.` : `Su próxima cita: ${c.proxima.toLowerCase()}.`} Si necesita cambiarla, responda a este mensaje.`} /></>);
          }
          if (sec === "tablero") {
            return (<><Titulo t="Recorrido del paciente" sub="Cada solicitud avanza por etapas. Lo que se queda quieto se nota." /><Tablero etapas={["Solicitud", "Cita agendada", "En sala", "Atendido", "Seguimiento"]} tarjetas={tarjetas} setTarjetas={setTarjetas} alAvisar={(t) => setMsg(`Hola, ${t.titulo.split(" ")[0]}. Le escribimos de Clínica Visual Lumen sobre ${t.sub.toLowerCase()}. Responda a este mensaje y le ayudamos.`)} /></>);
          }
          if (sec === "mensajes") {
            return (<><Titulo t="Mensajes de WhatsApp" sub="Todo en un solo lugar, con respuestas listas para los casos de siempre." /><Mensajes conversaciones={CONVERSACIONES} plantillas={PLANTILLAS} automatizaciones={AUTOMATICOS} /></>);
          }
          if (sec === "resenas") {
            return (<><Titulo t="Reseñas" sub="La queja no se queda sola en Google: se responde desde aquí, con un texto listo que se puede cambiar." /><Resenas items={RESENAS_PANEL} promedio="4.8" total={146} pedirTexto="Hola. Gracias por visitarnos en Clínica Visual Lumen. ¿Nos ayuda con una reseña en Google? Toma 30 segundos y nos ayuda a mejorar: g.page/lumen-demo" /></>);
          }
          if (sec === "reportes") {
            return (
              <>
                <Titulo t="Reportes" sub="Noviembre. Lo que más importa para decidir." />
                <Kpis items={[
                  { t: "Pacientes del mes", v: "412", nota: "+8% que octubre", tono: "bien" },
                  { t: "Inasistencias", v: "6%", nota: "Antes de los recordatorios: 14%", tono: "bien" },
                  { t: "Espera promedio", v: "14 min" },
                  { t: "Ingresos del mes", v: qz(186400) },
                ]} />
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <Barras titulo="Pacientes por semana" datos={PACIENTES_MES} />
                  <Ranking titulo="Servicios más pedidos" datos={SERVICIOS_TOP} />
                  <Ranking titulo="Pacientes por sucursal" datos={POR_SEDE} />
                </div>
              </>
            );
          }
          return (<><Titulo t="Equipo" sub="Quién atiende y cuánta carga lleva hoy." /><Equipo personas={EQUIPO} /></>);
        }}
      </PanelCRM>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="clínica oftalmológica" que="el mensaje" />
    </>
  );
}
