/*
 * Bento Grid — basado en el componente de 21st.dev (@kokonutd/bento-grid),
 * adaptado a Jzet Labs: colores marino/verde, textos en español,
 * cada tarjeta puede ser un enlace y la tarjeta destacada queda "levantada".
 */
import type { ReactNode } from "react";

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

export interface BentoItem {
  title: string;
  description: string;
  icon: ReactNode;
  status?: string;
  statusTone?: "verde" | "marino" | "gris";
  tags?: string[];
  meta?: string;
  cta?: string;
  href?: string;
  colSpan?: 1 | 2 | 3;
  hasPersistentHover?: boolean;
}

const TONOS = {
  verde: "bg-acento/10 text-acento",
  marino: "bg-marino/10 text-marino",
  gris: "bg-black/5 text-suave",
};

export function BentoGrid({ items }: { items: BentoItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {items.map((item) => {
        const externo = item.href?.startsWith("http");
        const Tarjeta = item.href ? "a" : "div";
        return (
          <Tarjeta
            key={item.title}
            {...(item.href ? { href: item.href, ...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {}) } : {})}
            className={cn(
              "bento-card group relative block p-5 rounded-xl overflow-hidden transition-all duration-300 aparece",
              "border border-linea bg-white text-texto no-underline",
              "hover:shadow-[0_6px_24px_rgba(11,37,69,0.08)] hover:-translate-y-0.5 hover:border-marino/30 will-change-transform",
              item.colSpan === 2 && "md:col-span-2",
              item.colSpan === 3 && "md:col-span-3",
              item.hasPersistentHover && "shadow-[0_6px_24px_rgba(11,37,69,0.08)] -translate-y-0.5 border-marino/30",
            )}
          >
            <div className={cn("absolute inset-0 transition-opacity duration-300", item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,37,69,0.05)_1px,transparent_1px)] bg-[length:6px_6px]" />
            </div>

            <div className="relative flex h-full flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-marino/5 text-marino transition-colors duration-300 group-hover:bg-marino group-hover:text-white">
                  {item.icon}
                </div>
                {item.status && (
                  <span className={cn("rounded-lg px-2 py-1 text-xs font-semibold", TONOS[item.statusTone ?? "gris"])}>{item.status}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <h3 className="text-[1.15rem] tracking-tight">
                  {item.title}
                  {item.meta && <span className="ml-2 text-xs font-normal text-suave">{item.meta}</span>}
                </h3>
                <p className="text-[0.95rem] leading-snug text-suave">{item.description}</p>
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap gap-1.5 text-xs text-suave">
                  {item.tags?.map((tag) => (
                    <span key={tag} className="rounded-md bg-black/[0.04] px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                {item.cta && (
                  <span className="text-sm font-semibold text-acento transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                    {item.cta} →
                  </span>
                )}
              </div>
            </div>
          </Tarjeta>
        );
      })}
    </div>
  );
}
