import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { whatsappLink } from "@/data/site";

const LINKS = [
  { href: "#taller", label: "Proyectos" },
  { href: "#precios", label: "Precios" },
  { href: "#mercado", label: "Vs. agencias" },
  { href: "#proceso", label: "Cómo trabajo" },
  { href: "#preguntas", label: "Preguntas" },
];

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2 no-underline" aria-label="Jzet Labs, inicio">
      <span
        className="grid place-items-center w-9 h-9 rounded-[10px] border-2 border-ink bg-volt shadow-[2px_2px_0_var(--color-ink)] font-display font-extrabold text-lg -rotate-6"
        aria-hidden
      >
        J
      </span>
      <span className="font-display font-extrabold text-[1.3rem] tracking-tight text-ink">
        jzet<span className="text-cobalt">.</span>labs
      </span>
    </a>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-5 pt-3">
      <nav
        className={`mx-auto max-w-6xl flex items-center justify-between gap-4 px-3 sm:px-4 py-2.5 rounded-2xl transition-all duration-300 ${
          scrolled ? "bg-card/95 border-2 border-ink shadow-[3px_3px_0_var(--color-ink)] backdrop-blur" : "border-2 border-transparent"
        }`}
      >
        <Logo />

        <ul className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-3 py-1.5 rounded-lg text-[0.95rem] font-medium text-ink-2 hover:text-ink hover:bg-volt/60 transition-colors no-underline"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink("¡Hola Josh! Vi tu página y quiero platicar de un proyecto.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary !py-2 !px-4 !text-[0.92rem] hidden sm:inline-flex"
          >
            Escribime
          </a>
          <button
            className="md:hidden grid place-items-center w-10 h-10 rounded-xl border-2 border-ink bg-card shadow-[2px_2px_0_var(--color-ink)]"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mx-auto max-w-6xl mt-2 ink-card p-3"
          >
            <ul className="flex flex-col">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-3 rounded-lg font-display font-bold text-lg text-ink no-underline active:bg-volt"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={whatsappLink("¡Hola Josh! Vi tu página y quiero platicar de un proyecto.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full justify-center mt-2"
            >
              Escribime por WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
