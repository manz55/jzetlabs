/*
 * Panel del dueño de Taller Torque, armado con el panel CRM compartido.
 * Lo que resuelve: ver cada carro en su paso, avisar al cliente con el precio y la hora ya escritos,
 * saber a quién le toca volver (aceite, alineación), contestar el auxilio a domicilio y responder reseñas.
 */
import { useState } from "react";
import { MensajeWhatsApp, qz } from "../comun";
import { Agenda, Barras, Boton, Caja, Clientes, Equipo, Kpis, Mensajes, PanelCRM, PorAtender, Ranking, Resenas, Tablero, Titulo, type Atencion, type Tarjeta } from "../panelcrm";
import { AMARILLO, ASFALTO, PASOS } from "./datos";
import { AGENDA, AUTOMATICOS, AVISOS, CARROS, CONVERSACIONES, EQUIPO, INGRESOS_SEMANA, ORIGEN, PLANTILLAS, RESENAS_PANEL, SERVICIOS_TOP, TARJETAS, TEMA } from "./panel";

function mensajeOrden(t: Tarjeta) {
  const e = t.extra ?? {};
  const nombre = (e.cliente ?? "").split(" ")[0];
  const m = [
    `Hola, ${nombre}. Recibimos su ${e.modelo} (${e.placa}). En cuanto lo revisemos le avisamos.`,
    `Hola, ${nombre}. Estamos revisando su ${e.modelo}. Le damos el precio antes de empezar.`,
    `Hola, ${nombre}. Ya revisamos su ${e.modelo}. El trabajo (${(e.trabajo ?? "").toLowerCase()}) cuesta ${qz(t.monto ?? 0)}. ¿Nos autoriza? Responda SÍ y empezamos.`,
    `Hola, ${nombre}. Su ${e.modelo} ya está en reparación. Calculamos que queda listo hoy a las 4:30 de la tarde.`,
    `Hola, ${nombre}. Su ${e.modelo} está listo. Total: ${qz(t.monto ?? 0)}. Le esperamos hasta las 6:00 de la tarde. ¡Gracias por su confianza!`,
  ];
  return m[t.etapa];
}

function Marca() {
  return (
    <span className="flex items-center gap-2.5 text-white">
      <svg viewBox="0 0 48 48" width={34} height={34} aria-hidden className="shrink-0">
        <rect width="48" height="48" rx="8" fill={AMARILLO} />
        <path d="M14 14 H34 V20 H27 V36 H21 V20 H14 Z" fill={ASFALTO} />
      </svg>
      <span className="leading-none"><span className="block text-[1.35rem] font-extrabold uppercase" style={{ fontFamily: TEMA.titulo }}>Taller Torque</span><span className="text-[0.72rem] opacity-70">Panel del taller</span></span>
    </span>
  );
}

export default function PanelTorque() {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>(TARJETAS);
  const [msg, setMsg] = useState<string | null>(null);

  const enTaller = tarjetas.filter((t) => t.etapa < 4).length;
  const porAprobar = tarjetas.filter((t) => t.etapa === 2);
  const listos = tarjetas.filter((t) => t.etapa === 4);
  const porCobrar = listos.reduce((a, t) => a + (t.monto ?? 0), 0);

  return (
    <>
      <PanelCRM tema={TEMA} marca={<Marca />} usuario={{ nombre: "Don Chepe", rol: "Dueño" }} avisos={AVISOS} nombresMenu={{ clientes: "Carros y clientes", tablero: "Órdenes", equipo: "Mecánicos" }}>
        {(sec, q, ir) => {
          if (sec === "hoy") {
            const atender: Atencion[] = [
              ...porAprobar.map((t) => ({ id: `ap-${t.id}`, texto: `${t.titulo}: falta el visto bueno del cliente (${qz(t.monto ?? 0)}).`, boton: "Pedir aprobación", alTocar: () => setMsg(mensajeOrden(t)), urgencia: "alta" as const })),
              ...listos.map((t) => ({ id: `li-${t.id}`, texto: `${t.titulo} está listo. El cliente aún no sabe.`, boton: "Avisar", alTocar: () => setMsg(mensajeOrden(t)) })),
              { id: "au", texto: "Solicitud de auxilio sin contestar: Mixco zona 1, no arranca.", boton: "Contestar", alTocar: () => ir("mensajes"), urgencia: "alta" as const },
              { id: "ac", texto: "3 clientes con el cambio de aceite vencido.", boton: "Ver clientes", alTocar: () => ir("clientes") },
            ];
            return (
              <>
                <Titulo t="Hoy en el taller" sub="Sábado 21 de noviembre. Lo que frena el trabajo sale primero." />
                <Kpis items={[
                  { t: "Carros en el taller", v: String(enTaller), nota: "5 mecánicos" },
                  { t: "Esperando visto bueno", v: String(porAprobar.length), tono: porAprobar.length ? "alerta" : "bien" },
                  { t: "Listos para entregar", v: String(listos.length), tono: "bien" },
                  { t: "Por cobrar hoy", v: qz(porCobrar) },
                ]} />
                <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_1fr]">
                  <PorAtender items={atender} vacio="Todo al día. Nada frena el trabajo." />
                  <Caja>
                    <h2 className="text-[1.1rem] font-bold" style={{ fontFamily: TEMA.titulo }}>Órdenes de hoy</h2>
                    <ul className="mt-3 divide-y" style={{ borderColor: TEMA.borde }}>
                      {tarjetas.map((t) => (
                        <li key={t.id} className="flex flex-wrap items-center gap-3 py-2.5">
                          <span className="min-w-[10rem] flex-1"><span className="block font-bold leading-tight">{t.titulo}</span><span className="text-[0.82rem] opacity-70">{t.sub}{t.monto ? ` · ${qz(t.monto)}` : ""}</span></span>
                          <span className="rounded px-2.5 py-1 text-[0.78rem] font-bold uppercase" style={{ background: t.etapa === 4 ? "#1f7a46" : t.etapa === 2 ? "#b97800" : AMARILLO, color: t.etapa === 2 || t.etapa === 4 ? "#fff" : ASFALTO }}>{PASOS[t.etapa]}</span>
                          {t.etapa < 4 && <Boton alTocar={() => setTarjetas((l) => l.map((x) => (x.id === t.id ? { ...x, etapa: x.etapa + 1 } : x)))} chico tipo="borde">Pasar a: {PASOS[t.etapa + 1]}</Boton>}
                        </li>
                      ))}
                    </ul>
                  </Caja>
                </div>
              </>
            );
          }
          if (sec === "agenda") {
            return (<><Titulo t="Agenda del taller" sub="Una columna por mecánico y una para el auxilio a domicilio." /><Agenda eventos={AGENDA} columnas={["Luis (mecánica)", "Memo (pintura)", "Óscar (rápidos)", "Domicilio"]} horas={["07:30", "08:00", "09:00", "10:00", "11:00", "14:00"]} dia="Hoy · sábado 21 de noviembre" /></>);
          }
          if (sec === "clientes") {
            return (<><Titulo t="Carros y clientes" sub="Busque por nombre, teléfono o placa arriba. Cada carro tiene su historial y su próximo servicio." /><Clientes lista={CARROS} q={q} colEtiqueta="Estado" demo="taller mecánico" mensaje={(c) => `Hola, ${c.nombre.split(" ")[0]}. Le escribe Taller Torque sobre su ${c.datos[1][1]}. ${c.proxima === "Vencido" ? "Su cambio de aceite ya venció." : `Próximo servicio: ${c.proxima.toLowerCase()}.`} Si quiere, le apartamos su cita. Responda con el día que le queda bien.`} /></>);
          }
          if (sec === "tablero") {
            return (<><Titulo t="Órdenes por paso" sub="Cada carro avanza por cinco pasos. Un toque avisa al cliente con el texto ya escrito." /><Tablero etapas={PASOS} tarjetas={tarjetas} setTarjetas={setTarjetas} alAvisar={(t) => setMsg(mensajeOrden(t))} /></>);
          }
          if (sec === "mensajes") {
            return (<><Titulo t="Mensajes de WhatsApp" sub="Cotizaciones, auxilios y avisos en un solo lugar, con respuestas listas." /><Mensajes conversaciones={CONVERSACIONES} plantillas={PLANTILLAS} automatizaciones={AUTOMATICOS} /></>);
          }
          if (sec === "resenas") {
            return (<><Titulo t="Reseñas" sub="Se responde desde aquí y se le pide su reseña a cada cliente al entregar el carro." /><Resenas items={RESENAS_PANEL} promedio="4.8" total={78} pedirTexto="Hola. Gracias por confiar en Taller Torque. ¿Nos ayuda con una reseña en Google? Toma 30 segundos: g.page/torque-demo" /></>);
          }
          if (sec === "reportes") {
            return (
              <>
                <Titulo t="Reportes" sub="Noviembre. Lo que más importa para decidir." />
                <Kpis items={[
                  { t: "Carros del mes", v: "138", nota: "+11% que octubre", tono: "bien" },
                  { t: "Ingresos del mes", v: qz(96500) },
                  { t: "Ticket promedio", v: qz(700) },
                  { t: "Entrega promedio", v: "1.6 días", nota: "Prometido: 2 días", tono: "bien" },
                ]} />
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <Barras titulo="Ingresos de la semana" datos={INGRESOS_SEMANA} formato={(n) => `Q${(n / 1000).toFixed(1)}k`} />
                  <Ranking titulo="Servicios más pedidos" datos={SERVICIOS_TOP} />
                  <Ranking titulo="De dónde llegan los clientes" datos={ORIGEN} />
                </div>
              </>
            );
          }
          return (<><Titulo t="Mecánicos" sub="Quién trabaja en qué y cuánta carga lleva hoy." /><Equipo personas={EQUIPO} /></>);
        }}
      </PanelCRM>
      <MensajeWhatsApp mensaje={msg} alCerrar={() => setMsg(null)} demo="taller mecánico" que="el aviso" />
    </>
  );
}
