/*
 * Cómo era antes cada negocio, dibujado (no son capturas reales ni datos
 * reales: los nombres son de ejemplo). Va debajo del deslizador antes/después.
 */

function HojaRayada({ titulo, lineas, nota }: { titulo: string; lineas: { t: string; tachado?: boolean }[]; nota: string }) {
  return (
    <div className="absolute inset-0 bg-[#fffdf3] p-[6%] overflow-hidden" style={{ backgroundImage: "repeating-linear-gradient(#fffdf3 0 26px, #c9d4f2 26px 27px)" }}>
      <div className="absolute left-[11%] top-0 bottom-0 w-px bg-[#f0a8a8]" />
      <p className="hand text-[clamp(1.1rem,3.4vw,1.7rem)] leading-[27px] pl-[8%] text-ink">{titulo}</p>
      <ul className="pl-[8%] mt-1">
        {lineas.map((l, i) => (
          <li key={i} className={`hand text-[clamp(0.95rem,2.8vw,1.35rem)] leading-[27px] text-ink-2 ${l.tachado ? "line-through decoration-2" : ""}`}>
            {l.t}
          </li>
        ))}
      </ul>
      <span className="absolute right-[8%] bottom-[10%] w-16 h-16 rounded-full border-[5px] border-[#b98a5a]/30" aria-hidden />
      <p className="absolute right-[6%] bottom-[5%] hand text-[clamp(0.9rem,2.6vw,1.2rem)] text-tomato -rotate-3">{nota}</p>
    </div>
  );
}

function ChatRevuelto() {
  const msjs = [
    { t: "¿Tienen de chamoy? 🙏", der: false },
    { t: "¿Cuánto es el envío a la 3?", der: false },
    { t: "Ya te deposité 👆", der: false },
    { t: "Perdón, ¿cuál era tu dirección?", der: true },
    { t: "¿Me apartas 2 bolsas?", der: false },
    { t: "¿Siguen abiertos?", der: false },
    { t: "Ya no me acuerdo quién pidió qué 😵", der: true },
  ];
  return (
    <div className="absolute inset-0 bg-[#e9e2d5] p-[5%] overflow-hidden flex flex-col gap-[3%]">
      {msjs.map((m, i) => (
        <span
          key={i}
          className={`max-w-[70%] px-3 py-1.5 rounded-xl text-[clamp(0.7rem,2.3vw,0.95rem)] shadow-sm ${m.der ? "self-end bg-[#d9fdd3]" : "self-start bg-white"}`}
          style={{ transform: `rotate(${(i % 2 ? 1 : -1) * (i % 3)}deg)` }}
        >
          {m.t}
        </span>
      ))}
      <p className="absolute right-[5%] bottom-[4%] hand text-[clamp(1rem,2.8vw,1.35rem)] text-tomato -rotate-3 bg-[#e9e2d5]/80 px-1">pedidos perdidos entre chats</p>
    </div>
  );
}

export function Antes({ id }: { id: string }) {
  if (id === "gomideli") return <ChatRevuelto />;
  if (id === "efamic")
    return (
      <HojaRayada
        titulo="Asistencia — semana 34"
        lineas={[{ t: "Luis · 7:05 ✓" }, { t: "Marta · 7:20 ✓" }, { t: "Pedro · ¿?" }, { t: "Diego · 7:45 (tarde)" }, { t: "Julia · 7:10", tachado: true }, { t: "horas extra: ver cuaderno" }]}
        nota="la planilla, a mano en Excel"
      />
    );
  if (id === "registro")
    return (
      <HojaRayada
        titulo="Domingo — niños"
        lineas={[{ t: "Sofi (5) ✓" }, { t: "Mateo (7) ¿vino?" }, { t: "Andrés — ¿cuál Andrés?" }, { t: "Valeria (4) ✓" }, { t: "José N. / Jose Najera", tachado: true }]}
        nota="¿quién faltó? ni idea"
      />
    );
  if (id === "coder")
    return (
      <div className="absolute inset-0 bg-[#fffdf3] grid place-items-center p-6 text-center">
        <p className="hand text-[clamp(1.1rem,3.4vw,1.6rem)] text-ink-2 leading-snug">
          abrir la app → escribir → copiar → pegar → buscar el archivo → volver a escribir…
          <br />
          <span className="text-tomato">mil clics para pedir algo</span>
        </p>
      </div>
    );
  return (
    <div className="absolute inset-0 bg-[#fffdf3] grid place-items-center p-6 text-center">
      <p className="hand text-[clamp(1.1rem,3.4vw,1.6rem)] text-ink-2">
        Solo de boca en boca.
        <br />
        <span className="text-tomato">nada que enseñar en línea</span>
      </p>
    </div>
  );
}
