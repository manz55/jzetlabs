/*
 * Plataformas: dónde se usa el sistema (celular, compu, app instalable, tiendas de apps).
 * Lo de "Incluido" ya existe (web adaptable + app instalable como la demo de asistencia).
 * Escritorio y tiendas de apps se hacen a la medida, con precio POR CONFIRMAR.
 * Los textos son los mismos de La tienda: si cambia uno, cambie el otro.
 */
import { Download, Monitor, MonitorSmartphone, Smartphone } from "lucide-react";

const ic = "h-5 w-5";

const OPCIONES = [
  {
    Icono: MonitorSmartphone,
    titulo: "En el celular, la tablet y la compu",
    texto: "Se abre desde cualquier navegador, sin instalar nada, y se acomoda a cada pantalla.",
    precio: "Incluido",
    porConfirmar: false,
  },
  {
    Icono: Download,
    titulo: "Como app en su celular",
    texto: "Se instala desde el navegador con su propio ícono, abre en pantalla completa y partes como el marcaje funcionan sin señal.",
    precio: "Incluido",
    porConfirmar: false,
  },
  {
    Icono: Monitor,
    titulo: "Programa para la compu",
    texto: "Para Windows o Mac, ideal para cajas, recepción o bodega: se abre con un clic, como cualquier programa.",
    precio: "Desde Q1,500",
    porConfirmar: true,
  },
  {
    Icono: Smartphone,
    titulo: "App en Play Store y App Store",
    texto: "Su app con su nombre y su logo en las tiendas de Android y iPhone.",
    precio: "Desde Q2,500 por tienda",
    porConfirmar: true,
  },
];

export function Plataformas() {
  return (
    <section id="plataformas" className="py-16 sm:py-24 border-b border-linea" aria-labelledby="plataformas-titulo">
      <div className="contenedor">
        <div className="max-w-2xl aparece">
          <p className="etiqueta">Plataformas</p>
          <h2 id="plataformas-titulo" className="mt-3 text-[1.75rem] sm:text-[2.2rem]">
            En el celular, en la compu o como app.
          </h2>
          <p className="mt-3 text-suave">
            Usted decide dónde lo usa su equipo. Todo comparte la misma información: lo que se registra en el celular aparece al instante en la compu.
          </p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {OPCIONES.map(({ Icono, titulo, texto, precio, porConfirmar }) => (
            <li key={titulo} className="flex flex-col gap-3 rounded-xl border border-linea bg-white p-6 aparece">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-marino/5 text-marino">
                <Icono className={ic} />
              </span>
              <h3 className="text-[1.12rem]">{titulo}</h3>
              <p className="text-[0.95rem] leading-snug text-suave">{texto}</p>
              <p className="mt-auto pt-2 font-semibold text-acento">
                {precio}
                {porConfirmar && (
                  <span className="ml-2 inline-block rounded bg-amber-100 px-1.5 py-0.5 align-middle text-[0.7rem] font-semibold tracking-wide text-amber-800">
                    POR CONFIRMAR
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-suave aparece">
          Para las tiendas de apps, la cuenta de desarrollador va a nombre de su negocio: Google cobra US$25 una sola vez y Apple US$99 al año.
        </p>
      </div>
    </section>
  );
}
