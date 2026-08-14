/**
 * Footer — Minimal oscuro con contacto + theme toggle
 * Basado en arihantcodes/footer-section
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const NAV_LINKS = [
  { label: "Por qué elegirme", href: "#por-que" },
  { label: "Preguntas",        href: "#faq" },
  { label: "Portafolio",       href: "#portafolio" },
  { label: "Cómo trabajo",     href: "#proceso" },
  { label: "Beneficios",       href: "#beneficios" },
];

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

function useTheme() {
  const [isDark, setIsDark] = useState(() =>
    typeof window === "undefined" ? true : !document.documentElement.classList.contains("light")
  );
  const toggle = () => {
    const nowLight = document.documentElement.classList.toggle("light");
    setIsDark(!nowLight);
    localStorage.setItem("theme", nowLight ? "light" : "dark");
  };
  return { isDark, toggle };
}

export function Footer() {
  const { isDark, toggle } = useTheme();

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      id="contacto"
      style={{ background: "var(--bg-void)", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      className="w-full py-14 sm:py-16 px-6 sm:px-10 md:px-16"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-12 mb-12">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
              Jzet<span style={{ color: "var(--amber)" }}>.</span>Labs
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--text-2)", lineHeight: 1.7, maxWidth: "240px" }}>
              Desarrollo web freelance para negocios locales en Guatemala.
            </p>
          </motion.div>

          {/* Nav */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Navegación
            </p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--text-2)", background: "none", border: "none", padding: 0, cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--amber)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-2)")}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Contacto
            </p>
            <div className="space-y-3.5">
              {[
                { href: "https://wa.me/50239915890?text=Hola%20Josh%2C%20vi%20tu%20portafolio", icon: <WhatsAppIcon />, label: "+502 3991-5890", external: true },
                { href: "mailto:joshuazet110@gmail.com",                                        icon: <MailIcon />,     label: "joshuazet110@gmail.com", external: false },
                { href: "https://github.com/manz55",                                            icon: <GitHubIcon />,   label: "github.com/manz55", external: true },
              ].map(({ href, icon, label, external }) => (
                <a
                  key={href}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-2.5"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-2)", textDecoration: "none", fontSize: "0.88rem", transition: "color 0.2s" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--amber)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-2)")}
                >
                  {icon}
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}
        >
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
            © 2025 Jzet Labs · Ciudad de Guatemala
          </p>
          <div className="flex items-center gap-4">
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
              React + Vite + Tailwind
            </p>
            <button
              onClick={toggle}
              aria-label={isDark ? "Modo claro" : "Modo oscuro"}
              style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)", transition: "background 0.2s, color 0.2s", flexShrink: 0 }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(232,168,58,0.1)"; el.style.color = "var(--amber)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.05)"; el.style.color = "var(--text-muted)"; }}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
