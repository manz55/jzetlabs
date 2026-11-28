import { MapPin, Phone } from "lucide-react";
import { SEDE } from "./datos";

export function Pie() {
  return (
    <footer className="bg-[#0F172A] py-10 text-sm text-[#CBD5E1]">
      <div className="hv-ancho flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-lg font-extrabold tracking-tight text-white">HUELLA VITAL</p>
          <p>Veterinaria, grooming y pet shop.</p>
        </div>
        <div className="grid gap-2">
          <p className="flex gap-2">
            <MapPin size={16} aria-hidden className="mt-0.5 shrink-0 text-[#2DD4BF]" /> {SEDE.direccion}
          </p>
          <p className="flex items-center gap-2">
            <Phone size={15} aria-hidden className="shrink-0 text-[#2DD4BF]" />
            <a href={SEDE.enlaceTelefono} className="tabular-nums underline-offset-4 hover:underline">
              {SEDE.telefono}
            </a>
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
