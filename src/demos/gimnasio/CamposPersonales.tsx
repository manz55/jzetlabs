/* Datos personales: los llena el socio en su pase y recepción en la ficha. */
import { formatoDpi, formatoTelefono, type Personales } from "./datos";
import { CAMPO, ROTULO } from "./Piezas";

export function revisarPersonales(p: Personales) {
  return {
    nombre: p.nombre.trim().length < 3 ? "Escriba nombre y apellido." : "",
    dpi: p.dpi && p.dpi.length !== 13 ? "El DPI lleva 13 números." : "",
    nit: p.nit && !/^(CF|\d{4,12}-?[\dK])$/.test(p.nit) ? "Escriba su NIT con guion, o CF." : "",
    nacimiento: p.nacimiento && (p.nacimiento > new Date().toISOString().slice(0, 10) || p.nacimiento < "1900-01-01") ? "Revise la fecha." : "",
    telefono: p.telefono && p.telefono.length !== 8 ? "El teléfono lleva 8 números." : "",
    correo: p.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.correo) ? "Revise el correo." : "",
    emergenciaNombre: "",
    emergenciaTelefono: p.emergenciaTelefono && p.emergenciaTelefono.length !== 8 ? "El teléfono lleva 8 números." : "",
  };
}

export const soloPersonales = (p: Personales): Personales => ({ nombre: p.nombre, dpi: p.dpi, nit: p.nit, nacimiento: p.nacimiento, telefono: p.telefono, correo: p.correo, emergenciaNombre: p.emergenciaNombre, emergenciaTelefono: p.emergenciaTelefono });

const digitos = (t: string, n: number) => t.replace(/\D/g, "").slice(0, n);

export function CamposPersonales({ valor, alCambiar }: { valor: Personales; alCambiar: (v: Personales) => void }) {
  const errores = revisarPersonales(valor);
  const poner = (parte: Partial<Personales>) => alCambiar({ ...valor, ...parte });
  /* el aviso sale cuando ya se escribió algo que no cuadra */
  const error = (k: keyof Personales) => errores[k] && <span className="text-[0.8rem] font-semibold text-red-700">{errores[k]}</span>;
  return (
    <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-x-4 gap-y-5">
      <label className={ROTULO}>
        Nombre completo
        <input value={valor.nombre} onChange={(e) => poner({ nombre: e.target.value.slice(0, 60) })} aria-invalid={!!errores.nombre} className={CAMPO} />
        {error("nombre")}
      </label>
      <label className={ROTULO}>
        DPI
        <input value={formatoDpi(valor.dpi)} onChange={(e) => poner({ dpi: digitos(e.target.value, 13) })} inputMode="numeric" placeholder="Pendiente" aria-invalid={!!errores.dpi} className={CAMPO} />
        {error("dpi")}
      </label>
      <label className={ROTULO}>
        NIT para factura FEL
        <input value={valor.nit} onChange={(e) => poner({ nit: e.target.value.toUpperCase().replace(/[^0-9CFK-]/g, "").slice(0, 14) })} placeholder="CF" aria-invalid={!!errores.nit} className={CAMPO} />
        {error("nit")}
      </label>
      <label className={ROTULO}>
        Fecha de nacimiento
        <input type="date" value={valor.nacimiento} onChange={(e) => poner({ nacimiento: e.target.value })} aria-invalid={!!errores.nacimiento} className={`${CAMPO} appearance-none`} />
        {error("nacimiento")}
      </label>
      <label className={ROTULO}>
        Teléfono WhatsApp
        <input value={formatoTelefono(valor.telefono)} onChange={(e) => poner({ telefono: digitos(e.target.value, 8) })} inputMode="numeric" placeholder="Pendiente" aria-invalid={!!errores.telefono} className={CAMPO} />
        {error("telefono")}
      </label>
      <label className={ROTULO}>
        Correo electrónico
        <input type="email" value={valor.correo} onChange={(e) => poner({ correo: e.target.value.trim() })} placeholder="Pendiente" aria-invalid={!!errores.correo} className={CAMPO} />
        {error("correo")}
      </label>
      <label className={ROTULO}>
        Contacto de emergencia
        <input value={valor.emergenciaNombre} onChange={(e) => poner({ emergenciaNombre: e.target.value })} placeholder="Nombre y parentesco" className={CAMPO} />
      </label>
      <label className={ROTULO}>
        Teléfono de emergencia
        <input value={formatoTelefono(valor.emergenciaTelefono)} onChange={(e) => poner({ emergenciaTelefono: digitos(e.target.value, 8) })} inputMode="numeric" placeholder="Pendiente" aria-invalid={!!errores.emergenciaTelefono} className={CAMPO} />
        {error("emergenciaTelefono")}
      </label>
    </div>
  );
}
