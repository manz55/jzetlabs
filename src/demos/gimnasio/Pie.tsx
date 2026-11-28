/* Pie: horarios, sedes y crédito. */
import { HORARIO, SEDES, mapa } from "./datos";
import { ANCHO, Logo } from "./Piezas";

export function Pie() {
  return (
    <footer className="bg-[#0F172A] py-12 text-slate-300">
      <div className={ANCHO}>
        <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0">
            <span className="inline-block rounded-lg bg-white px-4 py-3">
              <Logo />
            </span>
            <p className="mt-4 text-[0.93rem]">Fuerza, clases grupales y seguimiento físico, sin contratos forzosos.</p>
          </div>
          <section>
            <h2 className="text-[1.05rem] font-extrabold text-white">Horarios</h2>
            <dl className="mt-3 grid gap-2 text-[0.93rem]">
              {HORARIO.map((h) => (
                <div key={h.dias}>
                  <dt>{h.dias}</dt>
                  <dd className="font-bold text-white">{h.horas}</dd>
                </div>
              ))}
            </dl>
          </section>
          {SEDES.map((s) => (
            <section key={s.id} className="min-w-0">
              <h2 className="text-[1.05rem] font-extrabold text-white">{s.nombre}</h2>
              <p className="mt-3 text-[0.93rem]">{s.direccion}</p>
              <p className="mt-2 text-[0.93rem]">{s.parqueo}</p>
              <a href={mapa(s.direccion)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-10 items-center font-bold text-green-300 underline underline-offset-4">
                Cómo llegar
              </a>
            </section>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-[0.86rem]">
          <p>© {new Date().getFullYear()} IronPeak Performance Club</p>
          <p>
            Sitio desarrollado por{" "}
            <a href="/" className="font-bold text-white underline underline-offset-4">
              Jzet Labs
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
