/* Pie: zonas de cobertura, políticas y crédito. */
import { ZONAS, ZONA_IDS, qz } from "./datos";
import { ancho } from "./estilos";
import { Logo } from "./Piezas";

const POLITICAS = [
  "La fecha queda apartada con el anticipo del 50%.",
  "El depósito de garantía (15%) se devuelve al revisar el mobiliario.",
  "Las piezas faltantes o rotas se descuentan del depósito, con el detalle por escrito.",
  "Cambios de fecha según disponibilidad, avisando con 72 horas.",
  "Sus datos se usan solo para atender su reserva.",
];

export function Pie() {
  return (
    <footer className="bg-[#1C1917] text-[#D6CCBF]">
      <div className={`${ancho} py-14`}>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.3fr]">
          <div>
            <Logo claro />
            <p className="mt-5 max-w-xs">Alquiler de mobiliario y toldos, con control digital de stands para convivios y ferias de colonia.</p>
          </div>
          <section>
            <h2 className="text-lg !text-white">Zonas de cobertura</h2>
            <ul className="mt-4 grid gap-3">
              {ZONA_IDS.map((z) => (
                <li key={z} className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="min-w-0">{ZONAS[z].nombre}</span>
                  <span className="shrink-0 font-bold text-white">{qz(ZONAS[z].flete)}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-lg !text-white">Políticas</h2>
            <ul className="mt-4 grid gap-3">
              {POLITICAS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-3 border-t border-white/15 pt-6 text-sm">
          <p>© {new Date().getFullYear()} Casa Imperial</p>
          <p>
            Sitio desarrollado por{" "}
            <a href="/" className="font-bold text-white underline underline-offset-4">
              Jzet Labs
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
