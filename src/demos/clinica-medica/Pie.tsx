import { SEDE } from "./datos";
import { LogoMarca } from "./Piezas";

export function Pie() {
  return (
    <footer className="bg-[#0F172A] text-sm text-[#CBD5E1] print:hidden">
      <div className="cm-ancho flex flex-wrap items-start justify-between gap-6 py-10">
        <div className="min-w-0">
          <LogoMarca claro />
          <p className="mt-3">{SEDE.direccion}</p>
        </div>
        <div>
          <p>Consultas: lunes a viernes de 8:00 a 18:00, sábado de 8:00 a 12:30</p>
          <p>Toma de muestras: lunes a sábado de 7:00 a 11:30</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="cm-ancho py-4 text-xs">
          Sitio desarrollado por{" "}
          <a href="/" className="font-bold text-white underline underline-offset-4">
            Jzet Labs
          </a>
        </p>
      </div>
    </footer>
  );
}
