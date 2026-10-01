/*
 * Garabatos hechos a mano (trazos propios, un poco chuecos a propósito).
 * Todos usan currentColor para pintarlos con text-*.
 */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ArrowCurly = (p: P) => (
  <svg viewBox="0 0 120 80" {...base} strokeWidth={2.6} {...p}>
    <path d="M6 12c18-6 40-4 52 10 10 12 4 26-6 24-10-2-8-18 6-24 18-8 40 4 52 30" />
    <path d="M100 44l12 9-2-15" />
  </svg>
);

export const ArrowDown = (p: P) => (
  <svg viewBox="0 0 60 90" {...base} strokeWidth={2.6} {...p}>
    <path d="M30 4c-4 20 6 34 2 52-2 10-3 18-2 28" />
    <path d="M18 70c5 6 9 11 12 16 3-6 7-11 13-15" />
  </svg>
);

export const Underline = (p: P) => (
  <svg viewBox="0 0 300 20" preserveAspectRatio="none" {...base} strokeWidth={3.2} {...p}>
    <path d="M3 13c40-6 90-9 150-7 50 2 100 3 144-4" />
    <path d="M40 17c50-4 120-5 200-3" strokeWidth={2} opacity={0.7} />
  </svg>
);

export const CircleScribble = (p: P) => (
  <svg viewBox="0 0 200 90" preserveAspectRatio="none" {...base} strokeWidth={2.6} {...p}>
    <path d="M150 10C110 0 40 4 16 24 0 38 10 66 60 78c50 12 120 2 132-24 10-22-20-40-70-44-30-2-60 2-80 10" />
  </svg>
);

export const Spark = (p: P) => (
  <svg viewBox="0 0 40 40" {...base} strokeWidth={2.4} {...p}>
    <path d="M20 3c1 9 3 14 17 17-13 2-16 6-17 17-2-11-5-15-17-17 12-3 15-8 17-17z" />
  </svg>
);

export const Squiggle = (p: P) => (
  <svg viewBox="0 0 120 24" {...base} strokeWidth={2.6} {...p}>
    <path d="M3 14c8-10 14-10 20 0s12 10 18 0 12-10 18 0 12 10 18 0 12-10 18 0 12 10 20-2" />
  </svg>
);

export const Check = (p: P) => (
  <svg viewBox="0 0 32 32" {...base} strokeWidth={3.2} {...p}>
    <path d="M5 17c3 2 6 5 8 9 4-9 9-16 15-22" />
  </svg>
);

export const Cross = (p: P) => (
  <svg viewBox="0 0 32 32" {...base} strokeWidth={3} {...p}>
    <path d="M7 6c6 7 12 13 19 21" />
    <path d="M25 6c-7 6-12 12-18 21" />
  </svg>
);

export const Bolt = (p: P) => (
  <svg viewBox="0 0 40 40" {...base} strokeWidth={2.4} {...p}>
    <path d="M23 3L8 23h11l-3 14 16-21H21z" />
  </svg>
);

/* Firma de Josh, trazo libre */
export const Signature = (p: P) => (
  <svg viewBox="0 0 160 60" {...base} strokeWidth={2.6} {...p}>
    <path d="M30 10c2 18 2 30-4 38-5 6-14 4-16-3" />
    <path d="M44 34c-6 0-9 6-6 10s10 2 11-4-3-8-5-6" />
    <path d="M66 32c-6-2-10 2-6 5 5 3 7 6 2 9-3 2-7 1-9-1" />
    <path d="M78 12c-1 12-2 24-2 34M77 36c4-6 10-8 12-3 2 4 0 9 1 13" />
    <path d="M100 50c16-4 34-6 52-4" strokeWidth={2} />
  </svg>
);
