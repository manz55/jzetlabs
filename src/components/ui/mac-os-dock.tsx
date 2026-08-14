/**
 * MacOS Dock — adaptado para Jzet Labs
 * Fuente original: 21st.dev/@n38693842/mac-os-dock (id 7295)
 *
 * Cambios vs original:
 *  - Items de nav reemplazados por secciones reales del sitio
 *  - Comportamiento scroll-to-pill: al pasar el hero se colapsa a píldora compacta
 *  - Paleta unificada (dark-first, borde ámbar en hover)
 *  - Tema dark por defecto
 *  - Social: GitHub + WhatsApp + Email
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-is-mobile";

/* ── SVG Icons ───────────────────────────────────── */
const HomeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const GridIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
  </svg>
);

const FlowIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const UserIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const StarIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 3l2.6 5.86 6.4.56-4.85 4.24 1.46 6.24L12 16.9l-5.61 3 1.46-6.24L3 9.42l6.4-.56L12 3z" />
  </svg>
);

const QuestionIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9.4 9.3a2.6 2.6 0 015.03.87c0 1.73-2.6 2.17-2.6 3.83" />
    <path strokeLinecap="round" strokeWidth={2.4} d="M12 17.2v.1" />
  </svg>
);

const MailIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const GitHubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 438.549 438.549" fill="currentColor">
    <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8C295.736 15.166 259.057 5.365 219.271 5.365c-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z" />
  </svg>
);

const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

/* ── Tooltip ─────────────────────────────────────── */
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded shadow-lg whitespace-nowrap z-50 pointer-events-none"
            style={{
              background: "rgba(18,34,52,0.95)",
              color: "#e2edf7",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── DockItem ────────────────────────────────────── */
const DockItem = ({
  children,
  tooltip,
  small = false,
}: {
  children: React.ReactNode;
  tooltip: string;
  small?: boolean;
}) => {
  const size = small ? "w-8 h-8 sm:w-9 sm:h-9" : "w-9 h-9 sm:w-11 sm:h-11";
  return (
    <motion.div
      whileHover={{ scale: small ? 1.15 : 1.2, y: small ? -5 : -8 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="relative"
    >
      <Tooltip content={tooltip}>
        <div className={`${size} rounded-full flex items-center justify-center cursor-pointer`}>
          {children}
        </div>
      </Tooltip>
    </motion.div>
  );
};

/* ── Separator ───────────────────────────────────── */
const Separator = ({ visible = true }: { visible?: boolean }) =>
  visible ? (
    <div
      className="w-px h-6 mx-1 flex-shrink-0"
      style={{ background: "rgba(255,255,255,0.12)" }}
    />
  ) : null;

/* ── useScrollPast ───────────────────────────────── */
function useScrollPast(threshold: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return past;
}

/* ── MacOS Dock ──────────────────────────────────── */
const ICON_STYLE = {
  color: "rgba(226,237,247,0.85)",
};

const ICON_HOVER_BG = "hover:bg-white/[0.07]";

export function MacOSDock() {
  /* Collapse when scrolled past 70% of viewport height */
  const isCollapsed = useScrollPast(
    typeof window !== "undefined" ? window.innerHeight * 0.7 : 600
  );
  const isMobile = useIsMobile();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  /* Orden real de las secciones en la página — el dock navega en ese
     mismo orden, no salta directo a Portafolio como antes. */
  const navItems = [
    { id: "hero",       icon: HomeIcon,     label: "Inicio"               },
    { id: "por-que",    icon: StarIcon,     label: "Por qué elegirme"     },
    { id: "faq",        icon: QuestionIcon, label: "Preguntas frecuentes" },
    { id: "portafolio", icon: GridIcon,     label: "Portafolio"           },
    { id: "proceso",    icon: FlowIcon,     label: "Proceso"              },
    { id: "beneficios", icon: UserIcon,     label: "Beneficios"           },
  ];

  const socials = [
    { href: "https://github.com/manz55", icon: GitHubIcon, label: "GitHub" },
    {
      href: "https://wa.me/50239915890?text=Hola%20Josh%2C%20vi%20tu%20portafolio",
      icon: WhatsAppIcon,
      label: "WhatsApp",
    },
    {
      href: "mailto:joshuazet110@gmail.com",
      icon: MailIcon,
      label: "Email",
    },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2"
      style={{ willChange: "transform" }}
    >
      <motion.div
        layout
        animate={{
          borderRadius: isCollapsed ? 100 : 20,
          paddingLeft: isCollapsed ? (isMobile ? 10 : 14) : (isMobile ? 12 : 20),
          paddingRight: isCollapsed ? (isMobile ? 10 : 14) : (isMobile ? 12 : 20),
          paddingTop: isCollapsed ? 10 : 12,
          paddingBottom: isCollapsed ? 10 : 12,
          gap: isMobile ? 2 : 4,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center"
        style={{
          background: "rgba(13, 26, 38, 0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {/* Nav items */}
        <AnimatePresence mode="popLayout">
          {navItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <DockItem tooltip={item.label} small={isCollapsed}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className={`w-full h-full rounded-full flex items-center justify-center transition-colors ${ICON_HOVER_BG}`}
                  aria-label={item.label}
                  style={ICON_STYLE}
                >
                  <item.icon className={isCollapsed ? "w-3.5 h-3.5" : "w-4 h-4"} />
                </button>
              </DockItem>
            </motion.div>
          ))}
        </AnimatePresence>

        <Separator visible={!isCollapsed} />

        {/* Social links — hidden when collapsed to show only essentials */}
        <AnimatePresence mode="popLayout">
          {(!isCollapsed || true) && socials.map((s, i) => (
            <motion.div
              key={s.label}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isCollapsed && i > 0 ? 0 : 1,
                scale: isCollapsed && i > 0 ? 0.7 : 1,
                width: isCollapsed && i > 0 ? 0 : "auto",
              }}
              transition={{ duration: 0.25 }}
              style={{ overflow: "hidden" }}
            >
              <DockItem tooltip={s.label} small={isCollapsed}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full h-full rounded-full flex items-center justify-center transition-colors ${ICON_HOVER_BG}`}
                  aria-label={s.label}
                  style={ICON_STYLE}
                >
                  <s.icon className={isCollapsed ? "w-3.5 h-3.5" : "w-4 h-4"} />
                </a>
              </DockItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
