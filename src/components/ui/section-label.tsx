/**
 * SectionLabel — el "// comentario" mono que abre cada sección.
 * Se "escribe" solo cuando entra en viewport (efecto typewriter, tema
 * dev-environment del sitio) con cursor parpadeante. Usa el prop
 * onViewportEnter de framer-motion (mismo sistema que whileInView, ya
 * probado en el resto del sitio) en vez del hook useInView independiente,
 * que no dispara de forma confiable. Respeta prefers-reduced-motion
 * mostrando el texto completo de inmediato.
 */

import { useRef, useState } from "react";
import { motion } from "framer-motion";

const TYPE_SPEED_MS = 26;

export function SectionLabel({ text }: { text: string }) {
  const full = `// ${text}`;
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTyping = () => {
    if (started) return;
    setStarted(true);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTyped(full);
      setDone(true);
      return;
    }

    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDone(true);
      }
    }, TYPE_SPEED_MS);
  };

  return (
    <motion.p
      viewport={{ once: true, margin: "-60px" }}
      onViewportEnter={startTyping}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.72rem",
        color: "var(--amber)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: "0.75rem",
        minHeight: "1em",
      }}
    >
      {typed}
      {started && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "0.5em",
            marginLeft: 2,
            borderRight: "2px solid var(--amber)",
            animation: done ? "label-cursor-blink 1s step-end infinite" : "none",
          }}
        />
      )}
    </motion.p>
  );
}
