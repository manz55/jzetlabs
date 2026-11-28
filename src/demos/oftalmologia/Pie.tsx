import { Clock3, MapPin } from "lucide-react";
import { SEDE } from "./datos";
import { Logo } from "./Piezas";

export function Pie() {
  return (
    <footer className="bg-[#0F172A] py-10 text-sm text-[#CBD5E1]">
      <div className="cv-ancho flex flex-wrap items-start justify-between gap-6">
        <Logo claro />
        <div className="grid gap-2">
          <p className="flex gap-2">
            <MapPin size={16} aria-hidden className="mt-0.5 shrink-0 text-[#FBBF24]" /> {SEDE.direccion}
          </p>
          <p className="flex gap-2 tabular-nums">
            <Clock3 size={16} aria-hidden className="mt-0.5 shrink-0 text-[#FBBF24]" /> Lunes a viernes 8:00 a 18:00 · Sábado 8:00 a 13:00
          </p>
        </div>
        <p className="w-full border-t border-white/15 pt-5">
          Sitio desarrollado por{" "}
          <a href="/" className="font-bold text-white underline-offset-4 hover:underline">
            Jzet Labs
          </a>
        </p>
      </div>
    </footer>
  );
}
