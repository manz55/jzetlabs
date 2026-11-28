/* Piezas pequeñas que usan las tres vistas: el logotipo, las fotos y las cifras que cuentan. */
import { useRef, useState } from "react";
import { useCifra } from "./animar";
import { foto, qz } from "./datos";

/* logotipo solo con letras */
export function Logo() {
  return (
    <span className="al-logo">
      <span className="al-logo-nombre">ATELIER L’ART</span>
      <span className="al-logo-linea">SALÓN &amp; COLORIMETRÍA</span>
    </span>
  );
}

export function Foto({ id, alt, ancho, alto, pronto = false, className = "" }: { id: string; alt: string; ancho: number; alto: number; pronto?: boolean; className?: string }) {
  const [fallo, setFallo] = useState(false);
  return (
    <span className={`al-foto ${className}`}>
      {fallo ? (
        <span className="al-foto-sin" role="img" aria-label={alt}>
          Atelier L’Art
        </span>
      ) : (
        <img src={foto(id, ancho, alto)} alt={alt} width={ancho} height={alto} loading={pronto ? "eager" : "lazy"} decoding="async" onError={() => setFallo(true)} />
      )}
    </span>
  );
}

const entero = (n: number) => n.toLocaleString("en-US");

export function Cifra({ valor, dinero = false, desde = 0 }: { valor: number; dinero?: boolean; desde?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const formato = dinero ? qz : entero;
  useCifra(ref, valor, formato, desde);
  return <span ref={ref}>{formato(valor)}</span>;
}
