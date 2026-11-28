import { MapPin, Phone, Siren } from "lucide-react";
import { FOTOS, SEDE } from "./datos";
import { Foto } from "./Piezas";

const PASOS = [
  { titulo: "Llama antes de salir", texto: "El médico de turno prepara la sala y te dice cómo trasladarlo." },
  { titulo: "No le des medicina de personas", texto: "Tampoco provoques vómito. Si comió algo, trae el empaque." },
  { titulo: "Trasládalo con cuidado", texto: "En transportadora o sobre una superficie firme, sin apretarle el pecho." },
  { titulo: "Entra directo a triaje", texto: "Los casos graves pasan primero. El papeleo se hace después." },
];

const SENALES = ["Le cuesta respirar", "Convulsiona o se desmaya", "Atropello o caída", "Comió veneno o algo tóxico", "No logra orinar"];

export function Urgencias() {
  return (
    <section id="urgencias" className="hv-seccion bg-[#FFF7ED]">
      <div className="hv-ancho grid gap-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <p className="flex items-center gap-2 text-sm font-extrabold text-[#C2410C]">
            <Siren size={18} aria-hidden /> Abierto de día y de noche
          </p>
          <h2 className="mt-2 text-3xl font-extrabold">Urgencias 24 horas</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2">
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="hv-tarjeta !border-[#FED7AA] p-5">
                <span className="grid size-8 place-items-center rounded-lg bg-[#C2410C] text-sm font-extrabold tabular-nums text-white">{i + 1}</span>
                <h3 className="mt-3 text-base font-extrabold">{p.titulo}</h3>
                <p className="mt-1 text-sm">{p.texto}</p>
              </li>
            ))}
          </ol>
          <h3 className="mt-7 text-base font-extrabold">No esperes si ves esto</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {SENALES.map((s) => (
              <li key={s} className="rounded-full border border-[#FDBA74] bg-white px-3.5 py-1.5 text-sm font-bold text-[#9A3412]">
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 overflow-hidden rounded-3xl bg-[#0F172A] text-white lg:col-span-5">
          <Foto id={FOTOS.urgencias} alt="Gato blanco examinado por un veterinario" ancho={800} alto={500} className="aspect-[8/5] h-auto w-full" />
          <div className="p-6">
            <p className="text-sm font-semibold text-[#CBD5E1]">Teléfono directo de urgencias</p>
            <a href={SEDE.enlaceTelefono} className="hv-boton hv-coral mt-3 min-h-14 w-full !text-2xl tabular-nums">
              <Phone size={22} aria-hidden /> {SEDE.telefono}
            </a>
            <p className="mt-6 flex gap-2.5 text-[0.95rem] font-semibold leading-snug">
              <MapPin size={19} aria-hidden className="mt-0.5 shrink-0 text-[#2DD4BF]" /> {SEDE.direccion}
            </p>
            <p className="mt-2 pl-7 text-sm text-[#CBD5E1]">Parqueo frente a la puerta para emergencias.</p>
            <a href={SEDE.mapa} target="_blank" rel="noopener noreferrer" className="hv-boton mt-4 w-full border-white/30 text-white hover:bg-white/10">
              Cómo llegar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
