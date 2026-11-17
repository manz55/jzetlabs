/*
 * Demo: perfil de la clienta de "Sofía Morales", consultora de belleza (persona inventada).
 * Es la hoja de papel de las reuniones convertida en preguntas de una en una:
 * letra grande, botones grandes y nada que escribir con formato raro.
 * La clienta lo llena en su teléfono y a la consultora le llega por WhatsApp;
 * la consultora ve sus fichas ordenadas en su panel.
 * Estética de papel: crema, tinta y vino, Fraunces y líneas finas, como una ficha impresa.
 */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Pencil, Plus, Printer, Search, Trash2, X } from "lucide-react";
import { BandaDemos, CierreJzet, MensajeWhatsApp } from "../comun";
import maquillista from "@/assets/demo-cosmeticos/maquillista.jpg";
import {
  ACABADOS, CONSULTORA, COBERTURAS, EDADES, HORAS, LABIOS, LINEA, LOOKS, MEDIOS, MESES, NECESIDADES, OJOS, PAPEL, PARENTESCOS, PIELES,
  PREOCUPACIONES, SABER_MAS, SUAVE, SUBTONOS, TINTA, TONOS, VACIO, VINO,
  fechaTexto, mensajePerfil, telTexto, usePerfiles,
  type Fecha, type Opcion, type Perfil,
} from "./datos";

const SERIF = '"Fraunces", Georgia, serif';
const MANO = '"Caveat", cursive';
const MAYUS = "uppercase tracking-[0.18em]";

type Vista = "clienta" | "panel";

/* ---------- piezas pequeñas ---------- */

/* Lista de opciones como en una hoja: una por renglón, con su casilla */
function Elegir({ opciones, valor, alCambiar, varias = false }: { opciones: Opcion[]; valor: string | string[]; alCambiar: (v: string | string[]) => void; varias?: boolean }) {
  const lista = Array.isArray(valor) ? valor : [valor];
  return (
    <div className="border-t" style={{ borderColor: LINEA }}>
      {opciones.map((o) => {
        const si = lista.includes(o.valor);
        return (
          <button
            key={o.valor}
            type="button"
            role={varias ? "checkbox" : "radio"}
            aria-checked={si}
            onClick={() => {
              if (varias) alCambiar(si ? lista.filter((x) => x !== o.valor) : [...lista, o.valor]);
              else alCambiar(si ? "" : o.valor);
            }}
            className="flex w-full items-center gap-4 border-b px-3 py-4 text-left transition"
            style={{ borderColor: LINEA, background: si ? SUAVE : "transparent" }}
          >
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center border-2 ${varias ? "rounded" : "rounded-full"}`}
              style={{ borderColor: si ? VINO : "rgba(31,26,23,.4)", background: si ? VINO : "transparent" }}
              aria-hidden
            >
              {si && <Check size={18} strokeWidth={3} className="text-white" />}
            </span>
            <span className="leading-snug">
              <span className={`block text-[1.15rem] ${si ? "font-semibold" : "font-medium"}`}>{o.valor}</span>
              {o.ayuda && <span className="mt-0.5 block text-[0.98rem] opacity-65">{o.ayuda}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Campo({ etiqueta, ayuda, children }: { etiqueta: string; ayuda?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[1.1rem] font-semibold">{etiqueta}</span>
      {ayuda && <span className="mt-0.5 block text-[0.95rem] opacity-60">{ayuda}</span>}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

const claseInput =
  "w-full rounded-md border-2 border-black/20 bg-white px-4 py-3.5 text-[1.2rem] outline-none transition focus:border-black/80 placeholder:text-black/35";

function Texto({ valor, alCambiar, ...resto }: { valor: string; alCambiar: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return <input {...resto} value={valor} onChange={(e) => alCambiar(e.target.value)} className={claseInput} />;
}

function Telefono({ valor, alCambiar }: { valor: string; alCambiar: (v: string) => void }) {
  return <Texto valor={telTexto(valor)} alCambiar={(v) => alCambiar(v.replace(/\D/g, "").slice(0, 8))} inputMode="numeric" autoComplete="tel" placeholder="5555 5555" />;
}

function FechaCampo({ valor, alCambiar }: { valor: Fecha; alCambiar: (f: Fecha) => void }) {
  const anios = useMemo(() => {
    const hoy = new Date().getFullYear();
    return Array.from({ length: 90 }, (_, i) => String(hoy - i));
  }, []);
  const sel = claseInput;
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: "0.8fr 1.4fr 1fr" }}>
      <select aria-label="Día" value={valor.d} onChange={(e) => alCambiar({ ...valor, d: e.target.value })} className={sel}>
        <option value="">Día</option>
        {Array.from({ length: 31 }, (_, i) => (
          <option key={i} value={String(i + 1)}>{i + 1}</option>
        ))}
      </select>
      <select aria-label="Mes" value={valor.m} onChange={(e) => alCambiar({ ...valor, m: e.target.value })} className={sel}>
        <option value="">Mes</option>
        {MESES.map((m, i) => (
          <option key={m} value={String(i + 1)}>{m[0].toUpperCase() + m.slice(1)}</option>
        ))}
      </select>
      <select aria-label="Año, si quieres" value={valor.a} onChange={(e) => alCambiar({ ...valor, a: e.target.value })} className={sel}>
        <option value="">Año</option>
        {anios.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    </div>
  );
}

function Subtitulo({ children }: { children: ReactNode }) {
  return (
    <p className={`mb-3 mt-8 text-[0.85rem] font-semibold first:mt-0 ${MAYUS}`} style={{ color: VINO }}>
      {children}
    </p>
  );
}

function Pastilla({ si, onClick, children }: { si: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={si} onClick={onClick} className="rounded-full border-2 px-4 py-2 text-[1.05rem] font-medium transition" style={{ borderColor: si ? TINTA : "rgba(31,26,23,.25)", background: si ? TINTA : "transparent", color: si ? "#fff" : TINTA }}>
      {children}
    </button>
  );
}

function BotonAgregar({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-2 py-2 text-[1.1rem] font-semibold underline decoration-1 underline-offset-4" style={{ color: VINO }}>
      <Plus size={20} /> {children}
    </button>
  );
}

function Quitar({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1 text-[0.95rem] font-medium opacity-60 hover:opacity-100">
      <X size={17} /> Quitar
    </button>
  );
}

/* ---------- las preguntas ---------- */

type Paso = {
  seccion: string;
  titulo: string;
  ayuda?: string;
  listo?: (p: Perfil) => boolean;
  falta?: string;
  cuerpo: (p: Perfil, set: (c: Partial<Perfil>) => void) => ReactNode;
};

const PASOS: Paso[] = [
  {
    seccion: "Tus datos",
    titulo: "¿Cómo te llamas?",
    listo: (p) => p.nombre.trim().length > 1,
    falta: "Escribe tu nombre para seguir",
    cuerpo: (p, set) => (
      <div className="grid gap-5">
        <Campo etiqueta="Nombre">
          <Texto valor={p.nombre} alCambiar={(v) => set({ nombre: v })} autoComplete="given-name" autoCapitalize="words" placeholder="Ej. María José" />
        </Campo>
        <Campo etiqueta="Apellido">
          <Texto valor={p.apellido} alCambiar={(v) => set({ apellido: v })} autoComplete="family-name" autoCapitalize="words" placeholder="Ej. López" />
        </Campo>
      </div>
    ),
  },
  {
    seccion: "Tus datos",
    titulo: "¿A qué número te escribo?",
    ayuda: "Lo uso solo para avisarte de tus productos.",
    listo: (p) => p.telefono.length === 8,
    falta: "El número debe tener 8 dígitos",
    cuerpo: (p, set) => (
      <div>
        <Telefono valor={p.telefono} alCambiar={(v) => set({ telefono: v })} />
        <Subtitulo>¿Cómo prefieres que te contacte?</Subtitulo>
        <Elegir opciones={MEDIOS} valor={p.medio} alCambiar={(v) => set({ medio: v as string })} />
        <Subtitulo>¿A qué hora te queda mejor?</Subtitulo>
        <Elegir opciones={HORAS} valor={p.hora} alCambiar={(v) => set({ hora: v as string })} />
      </div>
    ),
  },
  {
    seccion: "Tus datos",
    titulo: "¿Cuándo es tu cumpleaños?",
    ayuda: "Para mandarte un detalle ese día. El año es opcional.",
    cuerpo: (p, set) => (
      <div>
        <FechaCampo valor={p.cumple} alCambiar={(f) => set({ cumple: f })} />
        <Subtitulo>¿Y tu aniversario de bodas?</Subtitulo>
        {!p.sinAniversario && (
          <div className="mb-3">
            <FechaCampo valor={p.aniversario} alCambiar={(f) => set({ aniversario: f })} />
          </div>
        )}
        <Elegir varias opciones={[{ valor: "No aplica" }]} valor={p.sinAniversario ? ["No aplica"] : []} alCambiar={(v) => set({ sinAniversario: (v as string[]).length > 0 })} />
      </div>
    ),
  },
  {
    seccion: "Tus datos",
    titulo: "¿Quién te invitó hoy?",
    ayuda: "La persona que organizó la reunión o el facial.",
    cuerpo: (p, set) => (
      <Campo etiqueta="Nombre de quien te invitó">
        <Texto valor={p.anfitriona} alCambiar={(v) => set({ anfitriona: v })} autoCapitalize="words" placeholder="Ej. Lucía Paz" />
      </Campo>
    ),
  },
  {
    seccion: "Tus datos",
    titulo: "Unos datos más",
    ayuda: "Todo esto es opcional. Si quieres, sigue adelante.",
    cuerpo: (p, set) => (
      <div className="grid gap-5">
        <Campo etiqueta="Correo">
          <Texto valor={p.correo} alCambiar={(v) => set({ correo: v.trim() })} type="email" inputMode="email" autoComplete="email" placeholder="nombre@correo.com" />
        </Campo>
        <Campo etiqueta="¿A qué te dedicas?">
          <Texto valor={p.ocupacion} alCambiar={(v) => set({ ocupacion: v })} placeholder="Ej. Estudiante, ventas, ama de casa" />
        </Campo>
        <Campo etiqueta="Dirección" ayuda="Para llevarte tus productos">
          <Texto valor={p.direccion} alCambiar={(v) => set({ direccion: v })} autoComplete="street-address" placeholder="Calle, número, colonia y zona" />
        </Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo etiqueta="Municipio">
            <Texto valor={p.municipio} alCambiar={(v) => set({ municipio: v })} placeholder="Ej. Mixco" />
          </Campo>
          <Campo etiqueta="Departamento">
            <Texto valor={p.departamento} alCambiar={(v) => set({ departamento: v })} placeholder="Ej. Guatemala" />
          </Campo>
        </div>
      </div>
    ),
  },
  {
    seccion: "Tu piel",
    titulo: "¿Cuántos años tienes?",
    cuerpo: (p, set) => (
      <div className="grid grid-cols-2 border-l border-t" style={{ borderColor: LINEA }}>
        {EDADES.map((e) => {
          const si = p.edad === e.valor;
          return (
            <button
              key={e.valor}
              type="button"
              role="radio"
              aria-checked={si}
              onClick={() => set({ edad: si ? "" : e.valor })}
              className="border-b border-r px-4 py-5 text-[1.25rem] transition"
              style={{ borderColor: LINEA, background: si ? TINTA : "transparent", color: si ? "#fff" : TINTA, fontFamily: SERIF }}
            >
              {e.valor}
            </button>
          );
        })}
      </div>
    ),
  },
  {
    seccion: "Tu piel",
    titulo: "¿Qué necesita tu piel?",
    ayuda: "Puedes marcar varias.",
    cuerpo: (p, set) => <Elegir varias opciones={NECESIDADES} valor={p.necesidades} alCambiar={(v) => set({ necesidades: v as string[] })} />,
  },
  {
    seccion: "Tu piel",
    titulo: "Si no te pones crema, ¿cómo sientes tu piel?",
    ayuda: "Marca la que más se parezca.",
    cuerpo: (p, set) => <Elegir opciones={PIELES} valor={p.piel} alCambiar={(v) => set({ piel: v as string })} />,
  },
  {
    seccion: "Tu piel",
    titulo: "¿Qué te gustaría mejorar?",
    ayuda: "Puedes marcar varias.",
    cuerpo: (p, set) => <Elegir varias opciones={PREOCUPACIONES} valor={p.preocupaciones} alCambiar={(v) => set({ preocupaciones: v as string[] })} />,
  },
  {
    seccion: "Tu piel",
    titulo: "¿Y en ojos y labios?",
    ayuda: "Si no te preocupa nada aquí, sigue adelante.",
    cuerpo: (p, set) => (
      <div>
        <Subtitulo>Ojos</Subtitulo>
        <Elegir varias opciones={OJOS} valor={p.ojos} alCambiar={(v) => set({ ojos: v as string[] })} />
        <Subtitulo>Labios</Subtitulo>
        <Elegir varias opciones={LABIOS} valor={p.labios} alCambiar={(v) => set({ labios: v as string[] })} />
      </div>
    ),
  },
  {
    seccion: "Tu maquillaje",
    titulo: "¿Cómo te gusta tu base de maquillaje?",
    cuerpo: (p, set) => (
      <div>
        <Subtitulo>Cómo se ve</Subtitulo>
        <Elegir opciones={ACABADOS} valor={p.acabado} alCambiar={(v) => set({ acabado: v as string })} />
        <Subtitulo>Cuánto cubre</Subtitulo>
        <Elegir opciones={COBERTURAS} valor={p.tipoBase} alCambiar={(v) => set({ tipoBase: v as string })} />
      </div>
    ),
  },
  {
    seccion: "Tu maquillaje",
    titulo: "¿Cuál es tu tono de piel?",
    ayuda: "Si no estás segura, en la reunión te ayudo a elegirlo.",
    cuerpo: (p, set) => (
      <div>
        <div className="grid grid-cols-5 gap-1">
          {TONOS.map((t) => {
            const si = p.tono === t.valor;
            return (
              <button key={t.valor} type="button" role="radio" aria-checked={si} onClick={() => set({ tono: si ? "" : t.valor })} className="flex flex-col items-center gap-2 py-2">
                <span className="grid h-14 w-14 place-items-center rounded-full transition" style={{ background: t.color, boxShadow: si ? `0 0 0 3px ${PAPEL}, 0 0 0 5px ${TINTA}` : "inset 0 0 0 1px rgba(0,0,0,.08)" }}>
                  {si && <Check size={24} strokeWidth={3} className="text-white drop-shadow" />}
                </span>
                <span className={`text-center text-[0.95rem] leading-tight ${si ? "font-semibold" : ""}`}>{t.valor}</span>
              </button>
            );
          })}
        </div>
        <Subtitulo>Mira las venas de tu muñeca</Subtitulo>
        <Elegir opciones={SUBTONOS} valor={p.subtono} alCambiar={(v) => set({ subtono: v as string })} />
      </div>
    ),
  },
  {
    seccion: "Tu maquillaje",
    titulo: "¿Qué look te gustaría probar?",
    ayuda: "Puedes marcar varios.",
    cuerpo: (p, set) => <Elegir varias opciones={LOOKS} valor={p.looks} alCambiar={(v) => set({ looks: v as string[] })} />,
  },
  {
    seccion: "Tu maquillaje",
    titulo: "De lo que probaste hoy…",
    ayuda: "Escribe el nombre como lo recuerdes, yo lo encuentro.",
    cuerpo: (p, set) => (
      <div className="grid gap-5">
        <Campo etiqueta="¿Qué te quieres llevar a casa?">
          <textarea value={p.llevar} onChange={(e) => set({ llevar: e.target.value })} rows={3} placeholder="Ej. La crema de noche y el labial rojo" className={claseInput} />
        </Campo>
        <Campo etiqueta="¿Qué te gustaría tener más adelante?" ayuda="Tu lista de deseos">
          <textarea value={p.deseos} onChange={(e) => set({ deseos: e.target.value })} rows={3} placeholder="Ej. El perfume de flores" className={claseInput} />
        </Campo>
      </div>
    ),
  },
  {
    seccion: "Para terminar",
    titulo: "¿De qué te gustaría saber más?",
    ayuda: "Puedes marcar varias, o ninguna.",
    cuerpo: (p, set) => <Elegir varias opciones={SABER_MAS} valor={p.saberMas} alCambiar={(v) => set({ saberMas: v as string[] })} />,
  },
  {
    seccion: "Para terminar",
    titulo: "¿A quién le puedo enseñar tu lista de deseos?",
    ayuda: "Así, si alguien te quiere regalar algo, sabe qué te gusta.",
    cuerpo: (p, set) => (
      <div className="border-t" style={{ borderColor: LINEA }}>
        {p.compartir.map((c, i) => {
          const cambiar = (x: Partial<typeof c>) => set({ compartir: p.compartir.map((y, j) => (j === i ? { ...y, ...x } : y)) });
          return (
            <div key={i} className="border-b py-5" style={{ borderColor: LINEA }}>
              <div className="flex items-center justify-between">
                <p className="text-[1.3rem]" style={{ fontFamily: SERIF }}>Persona {i + 1}</p>
                {p.compartir.length > 1 && <Quitar onClick={() => set({ compartir: p.compartir.filter((_, j) => j !== i) })} />}
              </div>
              <div className="mt-3 grid gap-4">
                <Campo etiqueta="Nombre">
                  <Texto valor={c.nombre} alCambiar={(v) => cambiar({ nombre: v })} autoCapitalize="words" placeholder="Ej. Marta Ruiz" />
                </Campo>
                <div>
                  <span className="block text-[1.1rem] font-semibold">¿Qué es tuyo?</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {PARENTESCOS.map((r) => (
                      <Pastilla key={r} si={c.parentesco === r} onClick={() => cambiar({ parentesco: c.parentesco === r ? "" : r })}>
                        {r}
                      </Pastilla>
                    ))}
                  </div>
                </div>
                <Campo etiqueta="Teléfono">
                  <Telefono valor={c.tel} alCambiar={(v) => cambiar({ tel: v })} />
                </Campo>
              </div>
            </div>
          );
        })}
        {p.compartir.length < 3 && (
          <div className="pt-3">
            <BotonAgregar onClick={() => set({ compartir: [...p.compartir, { nombre: "", parentesco: "", tel: "" }] })}>Agregar otra persona</BotonAgregar>
          </div>
        )}
      </div>
    ),
  },
  {
    seccion: "Para terminar",
    titulo: "Regálale un facial a tus amigas",
    ayuda: "Les ofrezco un facial de cortesía. Anota a quienes les gustaría.",
    cuerpo: (p, set) => (
      <div>
        <div className="border-t" style={{ borderColor: LINEA }}>
          {p.amigas.map((a, i) => {
            const cambiar = (x: Partial<typeof a>) => set({ amigas: p.amigas.map((y, j) => (j === i ? { ...y, ...x } : y)) });
            return (
              <div key={i} className="border-b py-5" style={{ borderColor: LINEA }}>
                <div className="flex items-center justify-between">
                  <p className="text-[1.3rem]" style={{ fontFamily: SERIF }}>Amiga {i + 1}</p>
                  {p.amigas.length > 1 && <Quitar onClick={() => set({ amigas: p.amigas.filter((_, j) => j !== i) })} />}
                </div>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <Campo etiqueta="Nombre">
                    <Texto valor={a.nombre} alCambiar={(v) => cambiar({ nombre: v })} autoCapitalize="words" placeholder="Nombre de tu amiga" />
                  </Campo>
                  <Campo etiqueta="Teléfono">
                    <Telefono valor={a.tel} alCambiar={(v) => cambiar({ tel: v })} />
                  </Campo>
                </div>
              </div>
            );
          })}
        </div>
        {p.amigas.length < 10 && (
          <div className="pt-3">
            <BotonAgregar onClick={() => set({ amigas: [...p.amigas, { nombre: "", tel: "" }] })}>Agregar otra amiga</BotonAgregar>
          </div>
        )}
        {p.amigas.some((a) => a.nombre.trim()) && (
          <div className="mt-6">
            <Elegir varias opciones={[{ valor: "Mis amigas saben que les van a escribir", ayuda: "Les pedí permiso para dar su número" }]} valor={p.permisoAmigas ? ["Mis amigas saben que les van a escribir"] : []} alCambiar={(v) => set({ permisoAmigas: (v as string[]).length > 0 })} />
          </div>
        )}
      </div>
    ),
  },
];

/* ---------- la ficha (la ve la clienta al revisar y la consultora en su panel) ---------- */

function Ficha({ p, alEditar }: { p: Perfil; alEditar?: (paso: number) => void }) {
  const bloque = (titulo: string, paso: number, filas: [string, string | string[] | undefined][]) => {
    const llenas = filas.filter(([, v]) => (Array.isArray(v) ? v.length : v));
    return (
      <section className="break-inside-avoid border-t-2 pt-4" style={{ borderColor: TINTA }}>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className={`text-[0.85rem] font-semibold ${MAYUS}`} style={{ color: VINO }}>
            {titulo}
          </h3>
          {alEditar && (
            <button type="button" onClick={() => alEditar(paso)} className="inline-flex items-center gap-1.5 text-[1rem] font-semibold underline decoration-1 underline-offset-4 print:hidden">
              <Pencil size={15} /> Cambiar
            </button>
          )}
        </div>
        {llenas.length === 0 ? (
          <p className="mt-3 text-[1rem] italic opacity-55">Sin responder</p>
        ) : (
          <dl className="mt-2">
            {llenas.map(([k, v]) => (
              <div key={k} className="grid gap-3 border-b py-2.5" style={{ borderColor: LINEA, gridTemplateColumns: "minmax(6.5rem, 9rem) 1fr" }}>
                <dt className="text-[0.95rem] opacity-60">{k}</dt>
                <dd className="text-[1.05rem] leading-snug">{Array.isArray(v) ? v.join(", ") : v}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    );
  };
  const comp = p.compartir.filter((c) => c.nombre.trim());
  const amigas = p.amigas.filter((a) => a.nombre.trim());
  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-x-10 print:grid-cols-2 print:gap-4">
      {bloque("Datos", 0, [
        ["Nombre", `${p.nombre} ${p.apellido}`.trim()],
        ["Teléfono", telTexto(p.telefono)],
        ["Contacto", [p.medio, p.hora.toLowerCase()].filter(Boolean).join(", ")],
        ["Cumpleaños", fechaTexto(p.cumple)],
        ["Aniversario", p.sinAniversario ? "No aplica" : fechaTexto(p.aniversario)],
        ["La invitó", p.anfitriona],
        ["Correo", p.correo],
        ["Ocupación", p.ocupacion],
        ["Dirección", [p.direccion, p.municipio, p.departamento].filter(Boolean).join(", ")],
      ])}
      {bloque("Piel", 5, [
        ["Edad", p.edad],
        ["Necesita", p.necesidades],
        ["Sin crema", p.piel],
        ["Quiere mejorar", p.preocupaciones],
        ["Ojos", p.ojos],
        ["Labios", p.labios],
      ])}
      {bloque("Maquillaje", 10, [
        ["Base", [p.acabado, p.tipoBase && `cobertura ${p.tipoBase.toLowerCase()}`].filter(Boolean).join(", ")],
        ["Tono", [p.tono, p.subtono && p.subtono !== "No sé" ? `subtono ${p.subtono.toLowerCase()}` : p.subtono ? "subtono por ver" : ""].filter(Boolean).join(", ")],
        ["Looks", p.looks],
        ["Se lleva", p.llevar],
        ["Lista de deseos", p.deseos],
      ])}
      {bloque("Para terminar", 14, [
        ["Quiere saber de", p.saberMas],
        ["Compartir lista con", comp.map((c) => `${c.nombre}${c.parentesco ? ` (${c.parentesco.toLowerCase()})` : ""}${c.tel ? `, ${telTexto(c.tel)}` : ""}`)],
        ["Amigas para facial", amigas.map((a) => `${a.nombre}${a.tel ? `, ${telTexto(a.tel)}` : ""}`)],
      ])}
    </div>
  );
}

/* ---------- la clienta llena su perfil ---------- */

const BORRADOR = "perfil-belleza:borrador";
const leerBorrador = (): { p: Perfil; paso: number } | null => {
  try {
    const t = localStorage.getItem(BORRADOR);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
};
const dosDigitos = (n: number) => String(n).padStart(2, "0");

function Formulario({ alGuardar }: { alGuardar: (p: Perfil) => void }) {
  const inicial = useMemo(leerBorrador, []);
  const [perfil, setPerfil] = useState<Perfil>(inicial?.p ?? VACIO);
  // -1 = bienvenida, PASOS.length = revisar, PASOS.length + 1 = enviado
  const [paso, setPaso] = useState<number>(inicial ? inicial.paso : -1);
  const [aviso, setAviso] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [volverARevisar, setVolverARevisar] = useState(false);

  const REVISAR = PASOS.length;
  const ENVIADO = PASOS.length + 1;

  useEffect(() => {
    try {
      if (paso >= 0 && paso < ENVIADO) localStorage.setItem(BORRADOR, JSON.stringify({ p: perfil, paso }));
      else localStorage.removeItem(BORRADOR);
    } catch {
      /* sin almacenamiento */
    }
  }, [perfil, paso, ENVIADO]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setAviso("");
  }, [paso]);

  const set = (c: Partial<Perfil>) => setPerfil((p) => ({ ...p, ...c }));
  const actual = paso >= 0 && paso < REVISAR ? PASOS[paso] : null;

  const siguiente = () => {
    if (actual?.listo && !actual.listo(perfil)) {
      setAviso(actual.falta ?? "Falta esta respuesta");
      return;
    }
    if (volverARevisar) {
      setVolverARevisar(false);
      setPaso(REVISAR);
    } else setPaso((n) => n + 1);
  };

  const atras = () => {
    if (volverARevisar) {
      setVolverARevisar(false);
      setPaso(REVISAR);
    } else setPaso((n) => n - 1);
  };

  const enviar = () => {
    const final = { ...perfil, id: crypto.randomUUID?.() ?? String(Date.now()), creado: new Date().toISOString() };
    alGuardar(final);
    setMensaje(mensajePerfil(final));
    setPaso(ENVIADO);
  };

  const otraClienta = () => {
    setPerfil(VACIO);
    setVolverARevisar(false);
    setPaso(-1);
  };

  /* portada */
  if (paso === -1) {
    return (
      <div className="mx-auto grid max-w-5xl gap-8 px-5 pb-16 pt-6 perfil-portada md:items-center md:gap-14 md:pt-14">
        <figure className="relative md:order-2">
          <img src={maquillista} alt="Consultora aplicando maquillaje a una clienta" className="aspect-[16/10] w-full object-cover md:aspect-[4/5]" />
          <figcaption className={`mt-2 text-[0.72rem] opacity-55 ${MAYUS}`}>Reunión de belleza</figcaption>
        </figure>
        <div>
          <p className={`text-[0.8rem] font-semibold ${MAYUS}`} style={{ color: VINO }}>
            Perfil de la clienta
          </p>
          <h1 className="mt-3 text-[2.6rem] font-medium leading-[1.02] tracking-[-0.01em] sm:text-[3.4rem]" style={{ fontFamily: SERIF }}>
            Cuéntame de tu piel, <em style={{ color: VINO }}>una pregunta a la vez.</em>
          </h1>
          <p className="mt-5 max-w-md text-[1.2rem] leading-relaxed opacity-80">
            Con esto sé qué productos te van de verdad, y no te ofrezco lo que no necesitas. Solo tocas la respuesta que va contigo; si no sabes algo, sigues adelante.
          </p>
          <p className="mt-6 max-w-sm -rotate-1 text-[1.9rem] leading-[1.05]" style={{ fontFamily: MANO, color: VINO }}>
            Gracias por venir hoy. Tus datos solo los veo yo. — {CONSULTORA.corto}
          </p>
          <button type="button" onClick={() => setPaso(0)} className="mt-8 flex w-full items-center justify-center gap-2 rounded-full px-6 py-5 text-[1.25rem] font-semibold text-white transition active:scale-[0.99] sm:w-auto sm:px-10" style={{ background: TINTA }}>
            Empezar mi perfil <ArrowRight size={22} />
          </button>
          <p className={`mt-4 text-[0.78rem] opacity-55 ${MAYUS}`}>17 preguntas · unos 3 minutos</p>
        </div>
      </div>
    );
  }

  /* enviado */
  if (paso === ENVIADO) {
    return (
      <div className="mx-auto max-w-xl px-5 pb-16 pt-12">
        <p className={`text-[0.8rem] font-semibold ${MAYUS}`} style={{ color: VINO }}>
          Perfil enviado
        </p>
        <h1 className="mt-3 text-[2.6rem] font-medium leading-[1.05]" style={{ fontFamily: SERIF }}>
          ¡Listo, {perfil.nombre.split(" ")[0]}!
        </h1>
        <p className="mt-4 text-[1.2rem] leading-relaxed opacity-80">Ya tengo tu perfil. Te escribo para ayudarte con tus productos y, si anotaste amigas, para invitarlas a su facial.</p>
        <p className="mt-5 -rotate-1 text-[1.65rem]" style={{ fontFamily: MANO, color: VINO }}>
          Gracias por tu confianza. — {CONSULTORA.corto}
        </p>
        <div className="mt-8 grid gap-3">
          <button type="button" onClick={otraClienta} className="rounded-full px-6 py-5 text-[1.2rem] font-semibold text-white" style={{ background: TINTA }}>
            Pasarle el teléfono a otra clienta
          </button>
          <button type="button" onClick={() => setMensaje(mensajePerfil(perfil))} className="rounded-full border-2 px-6 py-4 text-[1.1rem] font-semibold" style={{ borderColor: TINTA }}>
            Ver el mensaje que me llegó
          </button>
        </div>
        <MensajeWhatsApp mensaje={mensaje} alCerrar={() => setMensaje(null)} demo="perfil de belleza" que="el perfil de cada clienta" />
      </div>
    );
  }

  const total = PASOS.length;

  return (
    <div className="mx-auto max-w-xl px-5 pb-40 pt-6">
      {/* avance */}
      <div className={`flex items-baseline justify-between gap-3 text-[0.8rem] ${MAYUS}`}>
        <span className="font-semibold" style={{ color: VINO }}>{actual ? actual.seccion : "Revisar"}</span>
        <span className="opacity-60">{actual ? `${paso + 1} de ${total}` : "Último paso"}</span>
      </div>
      <div className="mt-2" style={{ background: LINEA, height: 3 }} role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Math.min(paso, total)}>
        <div className="h-full transition-all duration-300" style={{ width: `${(Math.min(paso, total) / total) * 100}%`, background: TINTA }} />
      </div>

      {actual ? (
        <div key={paso} className="mt-8 animate-[aparece_.25s_ease-out]">
          <p className="text-[2.4rem] italic leading-none" style={{ fontFamily: SERIF, color: VINO }}>
            {dosDigitos(paso + 1)}
          </p>
          <h1 className="mt-2 text-[2rem] font-medium leading-[1.12] sm:text-[2.3rem]" style={{ fontFamily: SERIF }}>
            {actual.titulo}
          </h1>
          {actual.ayuda && <p className="mt-2 text-[1.12rem] leading-relaxed opacity-70">{actual.ayuda}</p>}
          <div className="mt-7">{actual.cuerpo(perfil, set)}</div>
        </div>
      ) : (
        <div className="mt-8">
          <h1 className="text-[2.2rem] font-medium leading-[1.1]" style={{ fontFamily: SERIF }}>
            Revisa que todo esté bien
          </h1>
          <p className="mt-2 text-[1.12rem] opacity-70">Si algo no está bien, toca «Cambiar».</p>
          <div className="mt-8">
            <Ficha
              p={perfil}
              alEditar={(n) => {
                setVolverARevisar(true);
                setPaso(n);
              }}
            />
          </div>
        </div>
      )}

      {/* barra de abajo, siempre a la mano */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t" style={{ borderColor: LINEA, background: "rgba(248,244,238,.96)" }}>
        <div className="mx-auto max-w-xl px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          {aviso && (
            <p role="alert" className="mb-2 border-l-4 bg-white px-4 py-2 text-[1.05rem] font-semibold" style={{ borderColor: VINO, color: VINO }}>
              {aviso}
            </p>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={atras} className="flex items-center justify-center gap-1.5 rounded-full border-2 px-5 py-4 text-[1.15rem] font-semibold" style={{ borderColor: "rgba(31,26,23,.3)" }}>
              <ArrowLeft size={21} /> Atrás
            </button>
            {actual ? (
              <button type="button" onClick={siguiente} className="flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-4 text-[1.2rem] font-semibold text-white transition active:scale-[0.99]" style={{ background: TINTA }}>
                {volverARevisar ? "Guardar" : "Siguiente"} <ArrowRight size={21} />
              </button>
            ) : (
              <button type="button" onClick={enviar} className="flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-4 text-[1.2rem] font-semibold text-white" style={{ background: VINO }}>
                <span className="whitespace-nowrap">Enviar perfil</span> <ArrowRight size={21} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- panel de la consultora ---------- */

const diasParaCumple = (p: Perfil) => {
  if (!p.cumple.d || !p.cumple.m) return 999;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  let c = new Date(hoy.getFullYear(), Number(p.cumple.m) - 1, Number(p.cumple.d));
  if (c < hoy) c = new Date(hoy.getFullYear() + 1, Number(p.cumple.m) - 1, Number(p.cumple.d));
  return Math.round((c.getTime() - hoy.getTime()) / 864e5);
};

function Panel({ store }: { store: ReturnType<typeof usePerfiles> }) {
  const { perfiles, cambiar, borrar } = store;
  const [abierto, setAbierto] = useState<string | null>(null);
  const [buscar, setBuscar] = useState("");
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(""), 3200);
    return () => clearTimeout(t);
  }, [aviso]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [abierto]);

  const lista = perfiles.filter((p) => `${p.nombre} ${p.apellido} ${p.anfitriona}`.toLowerCase().includes(buscar.toLowerCase()));
  const cumples = perfiles.filter((p) => diasParaCumple(p) <= 30).sort((a, b) => diasParaCumple(a) - diasParaCumple(b));
  const referidas = perfiles.flatMap((p) => p.amigas.filter((a) => a.nombre.trim()).map((a) => ({ ...a, de: `${p.nombre} ${p.apellido}`.trim() })));
  const p = perfiles.find((x) => x.id === abierto);

  if (p) {
    return (
      <div className="mx-auto max-w-4xl px-5 pb-16 pt-6">
        <button type="button" onClick={() => setAbierto(null)} className="inline-flex items-center gap-1.5 text-[1.05rem] font-semibold opacity-70 hover:opacity-100 print:hidden">
          <ArrowLeft size={19} /> Mis clientas
        </button>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b pb-5" style={{ borderColor: LINEA }}>
          <div>
            <p className={`text-[0.78rem] ${MAYUS} opacity-60`}>
              Ficha del {new Date(p.creado).toLocaleDateString("es-GT", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <h1 className="mt-1 text-[2.4rem] font-medium leading-tight" style={{ fontFamily: SERIF }}>
              {p.nombre} {p.apellido}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <button type="button" onClick={() => setAviso(`En su negocio, este botón abre WhatsApp con ${p.nombre}.`)} className="rounded-full px-5 py-2.5 font-semibold text-white" style={{ background: TINTA }}>
              Escribirle
            </button>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 font-semibold" style={{ borderColor: "rgba(31,26,23,.3)" }}>
              <Printer size={17} /> Imprimir
            </button>
          </div>
        </div>
        <div className="mt-8">
          <Ficha p={p} />
        </div>
        <section className="mt-10 border-l-4 bg-white p-5 print:border" style={{ borderColor: VINO }}>
          <h3 className={`text-[0.85rem] font-semibold ${MAYUS}`} style={{ color: VINO }}>
            Mis notas · la clienta no las ve
          </h3>
          <textarea
            value={p.notas}
            onChange={(e) => cambiar(p.id, { notas: e.target.value })}
            rows={4}
            placeholder="Qué se llevó, cuándo entregar, qué le recomendé…"
            className="mt-3 w-full resize-y bg-transparent text-[1.5rem] leading-snug outline-none placeholder:text-black/30"
            style={{ fontFamily: MANO }}
          />
          <p className="mt-1 text-[0.9rem] opacity-55 print:hidden">Se guarda sola.</p>
        </section>
        <button
          type="button"
          onClick={() => {
            if (confirm(`¿Borrar la ficha de ${p.nombre}? No se puede deshacer.`)) {
              borrar(p.id);
              setAbierto(null);
            }
          }}
          className="mt-8 inline-flex items-center gap-2 text-[0.98rem] font-medium opacity-55 hover:opacity-100 print:hidden"
        >
          <Trash2 size={17} /> Borrar esta ficha
        </button>
        {aviso && <Toast texto={aviso} />}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 pb-16 pt-8">
      <p className={`text-[0.8rem] font-semibold ${MAYUS}`} style={{ color: VINO }}>
        Panel de {CONSULTORA.nombre}
      </p>
      <h1 className="mt-2 text-[2.8rem] font-medium leading-none" style={{ fontFamily: SERIF }}>
        Mis clientas
      </h1>

      <div className="mt-8 grid grid-cols-3 border-y" style={{ borderColor: TINTA }}>
        {[
          [perfiles.length, "fichas"],
          [cumples.length, "cumplen este mes"],
          [referidas.length, "amigas para facial"],
        ].map(([n, t], i) => (
          <div key={t} className={`px-3 py-4 ${i ? "border-l" : ""}`} style={{ borderColor: LINEA }}>
            <p className="text-[2.2rem] leading-none" style={{ fontFamily: SERIF }}>{n}</p>
            <p className="mt-1.5 text-[0.95rem] leading-tight opacity-65">{t}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10 perfil-panel">
        <section>
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-[1.6rem] font-medium" style={{ fontFamily: SERIF }}>Fichas</h2>
          </div>
          <div className="relative mt-3">
            <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 opacity-45" />
            <input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar por nombre o anfitriona" className={claseInput} style={{ paddingLeft: "2.75rem" }} />
          </div>
          <ul className="mt-3 border-t" style={{ borderColor: LINEA }}>
            {lista.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => setAbierto(c.id)} className="flex w-full items-center gap-4 border-b px-1 py-4 text-left transition hover:bg-white" style={{ borderColor: LINEA }}>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 text-[1.15rem]" style={{ borderColor: TINTA, fontFamily: SERIF }}>
                    {(c.nombre[0] ?? "") + (c.apellido[0] ?? "")}
                  </span>
                  <span className="min-w-0 flex-1 leading-snug">
                    <span className="block truncate text-[1.15rem] font-semibold">
                      {c.nombre} {c.apellido}
                    </span>
                    <span className="block truncate text-[0.98rem] opacity-60">
                      {[c.piel && `Piel ${c.piel.toLowerCase()}`, c.edad && `${c.edad} años`, c.anfitriona && `invitó ${c.anfitriona}`].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <ChevronRight size={20} className="opacity-35" />
                </button>
              </li>
            ))}
            {lista.length === 0 && <li className="py-6 text-[1.05rem] italic opacity-55">No hay clientas con ese nombre.</li>}
          </ul>
        </section>

        <aside className="grid content-start gap-10">
          <section>
            <h2 className="text-[1.6rem] font-medium" style={{ fontFamily: SERIF }}>Cumpleaños</h2>
            {cumples.length === 0 ? (
              <p className="mt-3 italic opacity-55">Nadie cumple este mes.</p>
            ) : (
              <ul className="mt-3 border-t" style={{ borderColor: LINEA }}>
                {cumples.map((c) => {
                  const d = diasParaCumple(c);
                  return (
                    <li key={c.id} className="flex items-baseline justify-between gap-3 border-b py-3" style={{ borderColor: LINEA }}>
                      <span className="font-semibold">{c.nombre} {c.apellido}</span>
                      <span className="shrink-0 text-[0.98rem]" style={{ color: VINO }}>
                        {d === 0 ? "hoy" : d === 1 ? "mañana" : `en ${d} días`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
          {referidas.length > 0 && (
            <section>
              <h2 className="text-[1.6rem] font-medium" style={{ fontFamily: SERIF }}>Amigas para facial</h2>
              <p className="mt-1 text-[0.98rem] opacity-60">Las que te recomendaron tus clientas.</p>
              <ul className="mt-3 border-t" style={{ borderColor: LINEA }}>
                {referidas.map((r, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-3 border-b py-3" style={{ borderColor: LINEA }}>
                    <span className="min-w-0">
                      <b className="block truncate">{r.nombre}</b>
                      <span className="block truncate text-[0.92rem] opacity-55">de parte de {r.de}</span>
                    </span>
                    <span className="shrink-0 tabular-nums opacity-80">{telTexto(r.tel)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
      {aviso && <Toast texto={aviso} />}
    </div>
  );
}

function Toast({ texto }: { texto: string }) {
  return (
    <div role="status" className="fixed inset-x-4 bottom-6 z-50 mx-auto max-w-md px-5 py-4 text-center text-[1.05rem] text-white shadow-xl" style={{ background: TINTA }}>
      {texto}
    </div>
  );
}

/* ---------- la página ---------- */

export default function PerfilDemo() {
  const store = usePerfiles();
  const [vista, setVista] = useState<Vista>(() => (location.hash === "#panel" ? "panel" : "clienta"));
  const [grande, setGrande] = useState<boolean>(() => {
    try {
      return localStorage.getItem("perfil-belleza:letra") === "grande";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.style.fontSize = grande ? "125%" : "106.25%";
    try {
      localStorage.setItem("perfil-belleza:letra", grande ? "grande" : "normal");
    } catch {
      /* nada */
    }
  }, [grande]);

  useEffect(() => {
    history.replaceState(null, "", vista === "panel" ? "#panel" : location.pathname);
    document.title = vista === "panel" ? "Mis clientas · Sofía Morales" : "Tu perfil de belleza · Demo de Jzet Labs";
    window.scrollTo({ top: 0 });
  }, [vista]);

  return (
    <div className="min-h-screen text-[1.0625rem]" style={{ background: PAPEL, color: TINTA }}>
      <style>{`@keyframes aparece{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @media (min-width:768px){.perfil-panel{grid-template-columns:1.5fr 1fr}.perfil-portada{grid-template-columns:1fr 1.05fr}}
        @media print{body{background:#fff}}`}</style>
      <div className="print:hidden">
        <BandaDemos />
      </div>
      <header className="sticky top-0 z-20 border-b print:hidden" style={{ borderColor: LINEA, background: PAPEL }}>
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3">
          <button type="button" onClick={() => setVista("clienta")} className="text-left leading-none">
            <span className="block text-[1.45rem] font-semibold" style={{ fontFamily: SERIF }}>
              Sofía Morales
            </span>
            <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.32em] opacity-70">consultora de belleza</span>
          </button>
          <nav className="order-last flex w-full gap-6 sm:order-none sm:ml-auto sm:w-auto" aria-label="Quién lo usa">
            {(
              [
                ["clienta", "Soy clienta"],
                ["panel", "Soy la consultora"],
              ] as const
            ).map(([v, t]) => (
              <button
                key={v}
                type="button"
                aria-current={vista === v ? "page" : undefined}
                onClick={() => setVista(v)}
                className={`border-b-2 pb-1 text-[1rem] font-semibold transition ${vista === v ? "" : "border-transparent opacity-55 hover:opacity-100"}`}
                style={vista === v ? { borderColor: VINO, color: VINO } : undefined}
              >
                {t}
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setGrande((g) => !g)}
            aria-pressed={grande}
            aria-label={grande ? "Letra más chica" : "Letra más grande"}
            className="flex items-baseline gap-1.5 rounded-full border-2 px-4 py-2 font-semibold"
            style={{ borderColor: "rgba(31,26,23,.3)", fontFamily: SERIF }}
          >
            <span className="text-[0.95rem]">A</span>
            <span className="text-[1.35rem] leading-none">A</span>
            <span className="ml-1 hidden text-[0.9rem] sm:inline" style={{ fontFamily: "inherit" }}>
              {grande ? "Letra normal" : "Letra grande"}
            </span>
          </button>
        </div>
      </header>

      {vista === "clienta" ? <Formulario alGuardar={store.agregar} /> : <Panel store={store} />}

      {vista === "panel" && (
        <div className="print:hidden">
          <CierreJzet demo="perfil de belleza" />
        </div>
      )}
    </div>
  );
}
