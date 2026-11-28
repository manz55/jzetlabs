import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Cat, Dog, ImageOff, X } from "lucide-react";
import { urlFoto, type Especie, type Mascota } from "./datos";

export function Foto({ id, alt, ancho, alto, className = "", prioridad = false }: { id: string; alt: string; ancho: number; alto: number; className?: string; prioridad?: boolean }) {
  const [fallida, setFallida] = useState("");
  if (fallida === id) {
    return (
      <span role="img" aria-label={alt} className={`grid place-items-center bg-[#F0FDFA] text-[#0F766E] ${className}`}>
        <ImageOff size={22} aria-hidden />
      </span>
    );
  }
  return (
    <img
      src={urlFoto(id, ancho, alto)}
      alt={alt}
      width={ancho}
      height={alto}
      loading={prioridad ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFallida(id)}
      className={`block bg-[#F0FDFA] object-cover ${className}`}
    />
  );
}

export function Retrato({ mascota, className = "size-11" }: { mascota: Mascota; className?: string }) {
  if (mascota.foto) return <Foto id={mascota.foto} alt="" ancho={160} alto={160} className={`shrink-0 rounded-full ${className}`} />;
  const Icono = mascota.especie === "perro" ? Dog : Cat;
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-full bg-[#CCFBF1] text-[#115E59] ${className}`}>
      <Icono className="size-1/2" />
    </span>
  );
}

export function SelectorEspecie({ valor, alElegir }: { valor: Especie; alElegir: (e: Especie) => void }) {
  const nombre = useId();
  return (
    <fieldset className="min-w-0">
      <legend className="hv-rotulo">Especie</legend>
      <div className="grid grid-cols-2 gap-2">
        {([["perro", "Perro", Dog], ["gato", "Gato", Cat]] as const).map(([id, texto, Icono]) => (
          <label key={id} className="hv-opcion">
            <input type="radio" name={nombre} value={id} checked={valor === id} onChange={() => alElegir(id)} className="sr-only" />
            <Icono size={18} aria-hidden /> {texto}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Ventana({ titulo, alCerrar, children, amplia = false }: { titulo: string; alCerrar: () => void; children: ReactNode; amplia?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar();
      }}
      className={`hv-ventana ${amplia ? "hv-ventana-amplia" : ""}`}
    >
      <div className="max-h-[88svh] overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id={idTitulo} className="text-xl font-extrabold">
            {titulo}
          </h2>
          <button type="button" onClick={alCerrar} aria-label="Cerrar" className="hv-boton hv-linea -mt-1.5 size-11 shrink-0 !px-0">
            <X size={18} aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
