import { MARCA } from "@/data/site";

export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <a href="#inicio" className="inline-flex items-center gap-2.5 no-underline" aria-label={`${MARCA}, inicio`}>
      <span className={`grid place-items-center w-9 h-9 rounded-lg font-bold text-[1.05rem] ${claro ? "bg-white text-marino" : "bg-marino text-white"}`} aria-hidden>
        J
      </span>
      <span className={`font-semibold text-[1.15rem] tracking-tight ${claro ? "text-white" : "text-marino"}`}>{MARCA}</span>
    </a>
  );
}
