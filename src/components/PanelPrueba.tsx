/*
 * El panel de admin de cada trabajo, con DATOS DE PRUEBA (nombres y números
 * inventados), para enseñar cómo se ve por dentro sin exponer datos reales.
 * Va en el lado "ahora" del deslizador antes/después.
 */
import type { ReactNode } from "react";

function Marco({ marca, color, menu, activo, children }: { marca: string; color: string; menu: string[]; activo: string; children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex bg-[#f6f7f9] text-[#1d2129] text-[clamp(7px,1.45vw,11px)] leading-tight">
      <aside className="w-[24%] shrink-0 p-[2.5%] text-white flex flex-col gap-[6%]" style={{ background: color }}>
        <p className="font-bold text-[1.25em]">{marca}</p>
        <ul className="space-y-[0.6em]">
          {menu.map((m) => (
            <li key={m} className={`px-[0.6em] py-[0.35em] rounded ${m === activo ? "bg-white/20 font-semibold" : "opacity-80"}`}>
              {m}
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-block self-start px-[0.6em] py-[0.25em] rounded bg-white text-[#1d2129] font-bold text-[0.85em]">datos de prueba</span>
      </aside>
      <main className="flex-1 p-[2.5%] overflow-hidden">{children}</main>
    </div>
  );
}

function Stat({ n, t, c = "#1d2129" }: { n: string; t: string; c?: string }) {
  return (
    <div className="bg-white rounded-md border border-black/10 p-[0.6em]">
      <p className="font-bold text-[1.6em]" style={{ color: c }}>
        {n}
      </p>
      <p className="opacity-60">{t}</p>
    </div>
  );
}

function Tabla({ cols, filas }: { cols: string[]; filas: ReactNode[][] }) {
  return (
    <table className="w-full mt-[0.8em] bg-white rounded-md border border-black/10 overflow-hidden">
      <thead>
        <tr className="bg-black/[.04] text-left">
          {cols.map((c) => (
            <th key={c} className="px-[0.6em] py-[0.45em] font-semibold opacity-70">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filas.map((f, i) => (
          <tr key={i} className="border-t border-black/5">
            {f.map((c, j) => (
              <td key={j} className="px-[0.6em] py-[0.45em] whitespace-nowrap">
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const Pill = ({ t, c }: { t: string; c: string }) => (
  <span className="px-[0.5em] py-[0.15em] rounded-full font-semibold" style={{ background: `${c}22`, color: c }}>
    {t}
  </span>
);

export function PanelPrueba({ id }: { id: string }) {
  if (id === "gomideli")
    return (
      <Marco marca="GomiDeli · admin" color="#b0201a" menu={["Pedidos", "Productos", "Inventario", "Clientes", "Ajustes"]} activo="Pedidos">
        <p className="font-bold text-[1.4em]">Pedidos de hoy</p>
        <div className="grid grid-cols-3 gap-[0.6em] mt-[0.6em]">
          <Stat n="12" t="pedidos" />
          <Stat n="Q1,284" t="vendido" c="#b0201a" />
          <Stat n="3" t="por entregar" />
        </div>
        <Tabla
          cols={["Pedido", "Cliente", "Total", "Estado"]}
          filas={[
            ["GD-1042", "María L.", "Q102.00", <Pill key="estado" t="Nuevo" c="#2563eb" />],
            ["GD-1041", "Carlos M.", "Q66.00", <Pill key="estado" t="En camino" c="#d97706" />],
            ["GD-1040", "Andrea P.", "Q138.00", <Pill key="estado" t="Entregado" c="#16a34a" />],
            ["GD-1039", "Luis R.", "Q36.00", <Pill key="estado" t="Entregado" c="#16a34a" />],
          ]}
        />
        <p className="mt-[0.8em] px-[0.6em] py-[0.45em] rounded bg-[#fff4e5] text-[#9a3412]">⚠️ Ositos enchilados con chamoy: quedan 6</p>
      </Marco>
    );

  if (id === "efamic")
    return (
      <Marco marca="EFAMIC · admin" color="#0f2a44" menu={["Asistencia", "Empleados", "Planilla", "Proyectos", "Cuentas"]} activo="Planilla">
        <p className="font-bold text-[1.4em]">Planilla · 1.ª quincena de octubre</p>
        <div className="grid grid-cols-3 gap-[0.6em] mt-[0.6em]">
          <Stat n="18/20" t="marcaron hoy" c="#0f766e" />
          <Stat n="26 h" t="horas extra" />
          <Stat n="2" t="sin señal, pendientes" c="#d97706" />
        </div>
        <Tabla
          cols={["Empleado", "Entrada", "Salida", "Extra", "A pagar"]}
          filas={[
            ["Ana Lucía Pérez", "7:02", "17:31", "1.5 h", "Q2,140"],
            ["Carlos Méndez", "6:58", "16:05", "—", "Q1,980"],
            ["Luis Hernández", "7:15", "18:40", "2.5 h", "Q1,870"],
            ["Marta Gómez", "7:00", "16:00", "—", "Q1,760"],
          ]}
        />
      </Marco>
    );

  if (id === "registro")
    return (
      <Marco marca="Maestros de Niños" color="#5b4bc4" menu={["Registro", "Reportes", "Familias", "Maestros", "Usuarios"]} activo="Reportes">
        <p className="font-bold text-[1.4em]">Domingo 19 de octubre</p>
        <div className="grid grid-cols-3 gap-[0.6em] mt-[0.6em]">
          <Stat n="12/14" t="Hormiguitas" c="#15803d" />
          <Stat n="18/21" t="Saltamontes" c="#b45309" />
          <Stat n="15/20" t="Exploradores" c="#1d4ed8" />
        </div>
        <p className="font-semibold mt-[0.9em]">Avisos para los maestros</p>
        <ul className="mt-[0.4em] space-y-[0.4em]">
          <li className="bg-white rounded border border-black/10 px-[0.6em] py-[0.45em]">👀 Sofía lleva 2 domingos sin venir</li>
          <li className="bg-white rounded border border-black/10 px-[0.6em] py-[0.45em]">🟡 ¿Y Mateo? Ya van 3 domingos sin verlo</li>
          <li className="bg-white rounded border border-black/10 px-[0.6em] py-[0.45em]">🔴 Andrés lleva 6 domingos — ¿le avisamos a la familia?</li>
        </ul>
      </Marco>
    );

  return null;
}
