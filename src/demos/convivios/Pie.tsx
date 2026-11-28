import { MapPin } from "lucide-react";
import { CONVIVIO } from "./datos";

export function Pie() {
  return (
    <footer className="bg-[#18181B] py-10 text-sm text-white/70">
      <div className="tf-ancho flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-lg font-extrabold tracking-tight text-white">TICKETFEST</p>
          <p>Control de convivios, kermés y stands en Guatemala.</p>
        </div>
        <p className="flex items-center gap-2">
          <MapPin size={15} aria-hidden /> {CONVIVIO.lugar}, {CONVIVIO.zona}
        </p>
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
