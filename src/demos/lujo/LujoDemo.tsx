/*
 * Demo: "Maison Solène" (negocio inventado, datos de ejemplo).
 * Reventa de lujo: moda, joyería e interiores de segunda mano, curados.
 * Estilo de boutique francesa: piedra y crema, letra tipo revista, mucho aire.
 * Cada pieza es única: disponible, apartada o vendida. La clienta la pide o la
 * aparta, deja piezas en consignación o se anota a la lista de deseos.
 * #panel: lo que ve la dueña (piezas con un toque, consignantes y pagos).
 * Todo se guarda en el navegador. Fotos libres de Unsplash, sin marcas.
 */
import { useEffect, useState } from "react";
import { ArrowRight, Check, Heart, } from "lucide-react";
import { Modal } from "@/components/Modal";
import PanelBoutique from "./PanelBoutique";
import { CATEGORIAS, INICIAL, PARTE_CONSIGNANTE, PIEZAS, ahorro, estadoDe, useDatos, type Categoria, type Datos, type Estado, type Pieza } from "./datos";
import { BandaDemos, PartesDemo, CierreJzet, MensajeWhatsApp, qz } from "../comun";
import percha from "@/assets/demo-lujo/percha.jpg";
import retrato from "@/assets/demo-lujo/retrato.jpg";
import butaca from "@/assets/demo-lujo/butaca.jpg";

const TINTA = "#0f2a21";
const PIEDRA = "#d3ddd0";
const HUESO = "#e6ebe3";
const BRONCE = "#9a7440";
const DIDONE = '"Bodoni Moda", "Playfair Display", Georgia, serif';
const CAPS = "tracking-[0.02em]";

export default function LujoDemo() {
  const [d, setD] = useDatos();
  const [vista, setVista] = useState<"tienda" | "panel">(() => (location.hash === "#panel" ? "panel" : "tienda"));
  useEffect(() => {
    const f = () => setVista(location.hash === "#panel" ? "panel" : "tienda");
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);
  const irA = (v: "tienda" | "panel") => {
    history.replaceState(null, "", v === "panel" ? "#panel" : location.pathname);
    setVista(v);
    scrollTo({ top: 0 });
  };
  return (
    <div>
      <BandaDemos />
      <PartesDemo fondo={"#2b2622"} actual={vista} alCambiar={irA} partes={[{ id: "tienda", nombre: "Boutique", quien: "La clienta ve las piezas y aparta" }, { id: "panel", nombre: "Panel de la dueña", quien: "Apartados, consignaciones y ventas" }] as const} />
      {vista === "tienda" ? <Boutique d={d} setD={setD} /> : <PanelBoutique d={d} setD={setD} inicial={INICIAL} alSalir={() => irA("tienda")} />}
      {vista === "tienda" && <CierreJzet demo="boutique de reventa de lujo" />}
    </div>
  );
}

type PropsDatos = { d: Datos; setD: React.Dispatch<React.SetStateAction<Datos>> };

/* ---------------- boutique ---------------- */

function Boutique({ d, setD }: PropsDatos) {
  const [cat, setCat] = useState<(typeof CATEGORIAS)[number]>("Todo");
  const [ficha, setFicha] = useState<Pieza | null>(null);
  const [mensaje, setMensaje] = useState<{ texto: string; que: string } | null>(null);
  useEffect(() => {
    document.title = "Maison Solène · Demo de Jzet Labs";
  }, []);
  const lista = PIEZAS.filter((p) => cat === "Todo" || p.categoria === cat);
  const disponibles = PIEZAS.filter((p) => estadoDe(d, p.id) === "disponible").length;
  const vendidas = PIEZAS.filter((p) => estadoDe(d, p.id) === "vendida");
  const enlace = "hover:opacity-60 transition";
  const h2 = "text-[2.4rem] sm:text-[3.6rem] leading-[1] font-normal !text-[#0f2a21]";

  return (
    <div style={{ background: HUESO, color: TINTA }} className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-black/10 backdrop-blur" style={{ background: "rgba(230,235,227,.92)" }}>
        <div className="mx-auto max-w-7xl px-5 h-[4.5rem] grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <nav className={`hidden md:flex gap-7 text-[0.88rem] ${CAPS}`}>
            <a href="#piezas" className={enlace}>
              Piezas
            </a>
            <a href="#consignar" className={enlace}>
              Vende con nosotras
            </a>
          </nav>
          <a href="#inicio" className="col-start-2 text-center leading-none">
            <span className={`block text-[0.95rem] sm:text-[1.1rem] uppercase tracking-[0.32em]`} style={{ fontFamily: DIDONE }}>
              Maison Solène
            </span>
            <span className={`mt-1 block text-[0.88rem] ${CAPS} opacity-60`}>Luxury resale · Guatemala</span>
          </a>
          <nav className={`col-start-3 hidden md:flex justify-end gap-7 text-[0.88rem] ${CAPS}`}>
            <a href="#curaduria" className={enlace}>
              Curaduría
            </a>
            <a href="#deseos" className={enlace}>
              Lista de deseos
            </a>
          </nav>
        </div>
      </header>

      {/* portada */}
      <section id="inicio" className="mx-auto max-w-7xl px-5 pt-10 sm:pt-16 pb-14 sm:pb-20">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-end">
          <div>
            <p className={`text-[0.88rem] ${CAPS}`} style={{ color: BRONCE }}>
              Moda, joyería e interiores de segunda mano
            </p>
            <h1 className="mt-6 text-[3rem] sm:text-[4.6rem] xl:text-[5.4rem] leading-[0.94] font-normal tracking-[-0.01em] !text-[#0f2a21]" style={{ fontFamily: DIDONE }}>
              Lo excepcional
              <br />
              merece una <span>segunda historia.</span>
            </h1>
            <p className="mt-7 max-w-md text-[1.05rem] opacity-75">Piezas de lujo elegidas una por una, revisadas y autenticadas. Cada una es única: cuando se va, se va.</p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <a href="#piezas" className={`inline-flex items-center gap-3 px-7 py-4 text-[0.88rem] text-white ${CAPS}`} style={{ background: TINTA }}>
                Ver las piezas <ArrowRight size={15} />
              </a>
              <a href="#consignar" className={`border-b border-current pb-1 text-[0.88rem] ${CAPS}`}>
                Vende la tuya
              </a>
            </div>
          </div>
          <div className="relative">
            <img src={percha} alt="Perchero con prendas seleccionadas en la boutique" className="w-full aspect-[4/5] object-cover" />
            <p className={`absolute left-0 bottom-0 px-4 py-3 text-[0.88rem] ${CAPS}`} style={{ background: HUESO }}>
              {disponibles} piezas disponibles hoy
            </p>
          </div>
        </div>
      </section>

      {/* promesas */}
      <section className="border-y border-black/10">
        <ul className={`mx-auto max-w-7xl px-5 py-5 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center text-[0.88rem] ${CAPS}`}>
          {["Autenticidad verificada", "Hasta 40% menos que en tienda", "Aparta 48 horas", "Entrega en toda Guatemala"].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      {/* piezas */}
      <section id="piezas" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-16 sm:py-24">
        <div className="text-center">
          <p className={`text-[0.88rem] ${CAPS}`} style={{ color: BRONCE }}>
            La selección
          </p>
          <h2 className={`mt-3 ${h2}`} style={{ fontFamily: DIDONE }}>
            Una pieza, <span>una oportunidad</span>
          </h2>
        </div>
        <div className={`mt-9 flex justify-start sm:justify-center gap-6 sm:gap-9 overflow-x-auto [scrollbar-width:none] text-[0.88rem] ${CAPS}`}>
          {CATEGORIAS.map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} aria-pressed={cat === c} className={`shrink-0 pb-2 border-b transition ${cat === c ? "border-current" : "border-transparent opacity-50 hover:opacity-100"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-12">
          {lista.map((p, i) => {
            const e = estadoDe(d, p.id);
            return (
              <button key={p.id} type="button" onClick={() => setFicha(p)} className="group text-left">
                <div className="relative overflow-hidden" style={{ background: PIEDRA }}>
                  <img src={p.foto} alt={p.nombre} className={`w-full aspect-[4/5] object-cover transition duration-700 group-hover:scale-[1.04] ${e === "vendida" ? "opacity-45 grayscale" : ""}`} loading="lazy" />
                  <span className={`absolute left-3 top-3 text-[0.88rem] ${CAPS} opacity-70`}>N.º {String(i + 1).padStart(2, "0")}</span>
                  {e !== "disponible" && (
                    <span className={`absolute inset-x-0 bottom-0 py-2.5 text-center text-[0.88rem] text-white ${CAPS}`} style={{ background: e === "vendida" ? TINTA : BRONCE }}>
                      {e === "vendida" ? "Vendida" : "Apartada"}
                    </span>
                  )}
                </div>
                <p className={`mt-4 text-[0.88rem] ${CAPS} opacity-55`}>
                  {p.categoria} · {p.condicion}
                </p>
                <p className="mt-1.5 text-[1.15rem] sm:text-[1.35rem] leading-tight" style={{ fontFamily: DIDONE }}>
                  {p.nombre}
                </p>
                <p className="mt-2 text-[0.95rem]">
                  <span className="font-semibold">{qz(p.precio)}</span> <span className="ml-1 line-through opacity-40">{qz(p.original)}</span>
                  <span className="ml-2 text-[0.8rem]" style={{ color: BRONCE }}>
                    -{ahorro(p)}%
                  </span>
                </p>
              </button>
            );
          })}
        </div>
        <p className="mt-10 text-center text-xs opacity-45">Piezas y precios de ejemplo. Las fotos son ilustrativas.</p>
      </section>

      {/* curaduría */}
      <section id="curaduria" className="scroll-mt-24" style={{ background: PIEDRA }}>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24 grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
          <img src={retrato} alt="Mujer con collar de perlas y camisa blanca" className="w-full aspect-[4/5] object-cover" loading="lazy" />
          <div>
            <p className={`text-[0.88rem] ${CAPS}`} style={{ color: BRONCE }}>
              Nuestra curaduría
            </p>
            <h2 className={`mt-3 ${h2}`} style={{ fontFamily: DIDONE }}>
              No todo entra a <span>la Maison.</span>
            </h2>
            <ol className="mt-9 space-y-7">
              {[
                ["Selección", "De cada diez piezas que nos ofrecen, aceptamos tres. Buscamos diseño, calidad y carácter."],
                ["Autenticación", "Revisamos costuras, herrajes, números de serie y procedencia. Si hay duda, no entra."],
                ["Cuidado", "Limpieza profesional y fotos reales de cada detalle, también de las señas de uso."],
              ].map(([t, x], i) => (
                <li key={t} className="grid grid-cols-[auto_1fr] gap-5">
                  <span className="text-[1.6rem] leading-none" style={{ fontFamily: DIDONE, color: BRONCE }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className={`text-[0.88rem] ${CAPS}`}>{t}</p>
                    <p className="mt-1.5 opacity-70">{x}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* vendidas */}
      {vendidas.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
          <p className={`text-center text-[0.88rem] ${CAPS} opacity-60`}>Ya encontraron nuevo hogar</p>
          <div className="mt-6 flex justify-center gap-4 overflow-x-auto [scrollbar-width:none]">
            {vendidas.map((p) => (
              <figure key={p.id} className="shrink-0 w-36 sm:w-44">
                <img src={p.foto} alt="" className="w-full aspect-square object-cover grayscale opacity-60" loading="lazy" />
                <figcaption className="mt-2 text-[0.8rem] opacity-60">{p.nombre}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <Consignar setD={setD} alEnviar={(t) => setMensaje({ texto: t, que: "la solicitud" })} />

      <Deseos setD={setD} />

      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-24 text-center">
        <img src={butaca} alt="" className="mx-auto w-40 h-40 object-cover rounded-full" loading="lazy" />
        <p className="mt-8 text-[1.5rem] sm:text-[2rem] leading-snug" style={{ fontFamily: DIDONE }}>
          “Compré mi primer bolso de diseñador aquí. Llegó impecable, con su funda y una nota escrita a mano.”
        </p>
        <p className={`mt-5 text-[0.88rem] ${CAPS} opacity-55`}>Valeria G. · Opinión de ejemplo</p>
      </section>

      {/* ficha de la pieza */}
      <Modal abierto={!!ficha} alCerrar={() => setFicha(null)} titulo={ficha?.nombre ?? "Pieza"} ancho="sm:w-[min(58rem,94vw)]">
        {ficha && (
          <Ficha
            p={ficha}
            estado={estadoDe(d, ficha.id)}
            alPedir={() => {
              setMensaje({ que: "el pedido", texto: `Hola, Maison Solène. Quiero la pieza "${ficha.nombre}" (${qz(ficha.precio)}). ¿Sigue disponible? ¿Cómo coordinamos el pago y la entrega?` });
              setFicha(null);
            }}
            alApartar={(nombre) => {
              setD((x) => ({ ...x, estados: { ...x.estados, [ficha.id]: "apartada" }, apartadoPor: { ...x.apartadoPor, [ficha.id]: nombre } }));
              setMensaje({ que: "el apartado", texto: `Hola, Maison Solène. Soy ${nombre} y quiero apartar "${ficha.nombre}" por 48 horas con el 20% (${qz(Math.round(ficha.precio * 0.2))}).` });
              setFicha(null);
            }}
          />
        )}
      </Modal>

      <MensajeWhatsApp mensaje={mensaje?.texto ?? null} que={mensaje?.que} alCerrar={() => setMensaje(null)} demo="boutique de reventa de lujo" />
    </div>
  );
}

function Ficha({ p, estado, alPedir, alApartar }: { p: Pieza; estado: Estado; alPedir: () => void; alApartar: (nombre: string) => void }) {
  const [apartando, setApartando] = useState(false);
  const [nombre, setNombre] = useState("");
  return (
    <div className="grid sm:grid-cols-2" style={{ color: TINTA }}>
      <div className="relative min-h-[300px]" style={{ background: PIEDRA }}>
        <img src={p.foto} alt={p.nombre} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-6 sm:p-9">
        <p className={`text-[0.88rem] ${CAPS}`} style={{ color: BRONCE }}>
          {p.categoria} · Pieza única
        </p>
        <h3 className="mt-2 pr-8 text-[1.9rem] leading-[1.05] font-normal !text-[#0f2a21]" style={{ fontFamily: DIDONE }}>
          {p.nombre}
        </h3>
        <p className="mt-3 opacity-70">{p.nota}</p>
        <dl className="mt-6 grid grid-cols-2 gap-px bg-black/10 text-[0.9rem]">
          {[
            ["Precio original", <span className="line-through opacity-50">{qz(p.original)}</span>],
            ["Precio Maison", <b>{qz(p.precio)}</b>],
            ["Estado", p.condicion],
            ["Ahorras", `${ahorro(p)}%`],
          ].map(([k, v]) => (
            <div key={k as string} className="p-3" style={{ background: HUESO }}>
              <dt className={`text-[0.88rem] ${CAPS} opacity-55`}>{k}</dt>
              <dd className="mt-1">{v}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-5 space-y-1.5 text-[0.9rem]">
          {[...p.detalles, "Autenticidad verificada por la Maison"].map((x) => (
            <li key={x} className="flex gap-2">
              <Check size={15} className="mt-0.5 shrink-0" style={{ color: BRONCE }} /> {x}
            </li>
          ))}
        </ul>
        {estado === "vendida" ? (
          <p className={`mt-7 py-4 text-center text-[0.88rem] text-white ${CAPS}`} style={{ background: TINTA }}>
            Esta pieza ya se vendió
          </p>
        ) : estado === "apartada" ? (
          <p className={`mt-7 py-4 text-center text-[0.88rem] text-white ${CAPS}`} style={{ background: BRONCE }}>
            Apartada por otra clienta
          </p>
        ) : apartando ? (
          <form
            className="mt-7 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (nombre.trim()) alApartar(nombre.trim());
            }}
          >
            <p className="text-sm opacity-70">La apartas 48 horas con el 20% ({qz(Math.round(p.precio * 0.2))}). Nadie más la puede comprar mientras tanto.</p>
            <input aria-label="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" required className="w-full border border-black/20 bg-white px-3 py-3 focus:outline-none focus:border-black" />
            <button type="submit" className={`w-full py-4 text-[0.88rem] text-white ${CAPS}`} style={{ background: BRONCE }}>
              Apartar la pieza
            </button>
          </form>
        ) : (
          <div className="mt-7 grid gap-2">
            <button type="button" onClick={alPedir} className={`py-4 text-[0.88rem] text-white ${CAPS}`} style={{ background: TINTA }}>
              La quiero
            </button>
            <button type="button" onClick={() => setApartando(true)} className={`border border-black/25 py-4 text-[0.88rem] ${CAPS} hover:border-black`}>
              Apartar 48 horas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* Consignación: la clienta ofrece su pieza y ve cuánto recibiría */
function Consignar({ setD, alEnviar }: { setD: PropsDatos["setD"]; alEnviar: (t: string) => void }) {
  const [f, setF] = useState({ nombre: "", pieza: "", categoria: "Bolsos" as Categoria, pagado: "" });
  const pagado = Number(f.pagado) || 0;
  const venta = Math.round(pagado * 0.6);
  const recibe = Math.round(venta * PARTE_CONSIGNANTE);
  const campo = "mt-2 w-full border-0 border-b border-black/25 bg-transparent px-0 py-2.5 focus:outline-none focus:border-black";
  return (
    <section id="consignar" className="scroll-mt-24 text-white" style={{ background: TINTA }}>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24 grid lg:grid-cols-2 gap-12">
        <div>
          <p className={`text-[0.88rem] ${CAPS}`} style={{ color: "#c9a97c" }}>
            Consignación
          </p>
          <h2 className="mt-3 text-[2.4rem] sm:text-[3.6rem] leading-[1] font-normal !text-white" style={{ fontFamily: DIDONE }}>
            Tu clóset tiene piezas que <span>merecen otra vida.</span>
          </h2>
          <p className="mt-6 max-w-md text-white/65">Nosotras la fotografiamos, la publicamos y la vendemos. Tú recibes el {PARTE_CONSIGNANTE * 100}% cuando se vende.</p>
          <ol className="mt-8 space-y-3 text-white/80">
            {["Cuéntanos qué pieza tienes.", "La revisamos y autenticamos.", "La vendemos y te pagamos por transferencia."].map((t, i) => (
              <li key={t} className="flex gap-4">
                <span style={{ fontFamily: DIDONE, color: "#c9a97c" }}>{String(i + 1).padStart(2, "0")}</span> {t}
              </li>
            ))}
          </ol>
        </div>
        <form
          className="p-6 sm:p-9"
          style={{ background: HUESO, color: TINTA }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!f.nombre.trim() || !f.pieza.trim() || !pagado) return;
            setD((x) => ({ ...x, solicitudes: [{ id: `s${Date.now()}`, nombre: f.nombre.trim(), pieza: f.pieza.trim(), categoria: f.categoria, pagado, estado: "nueva" }, ...x.solicitudes] }));
            alEnviar(`Hola, Maison Solène. Soy ${f.nombre.trim()} y quiero dejar en consignación: ${f.pieza.trim()} (${f.categoria}). La compré en ${qz(pagado)}. ¿Me dicen si les interesa?`);
            setF({ nombre: "", pieza: "", categoria: "Bolsos", pagado: "" });
          }}
        >
          <p className="text-[1.6rem]" style={{ fontFamily: DIDONE }}>
            Ofrece tu pieza
          </p>
          <label className={`mt-6 block text-[0.88rem] ${CAPS}`}>
            Tu nombre
            <input value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} required className={`${campo} normal-case tracking-normal text-base`} />
          </label>
          <label className={`mt-5 block text-[0.88rem] ${CAPS}`}>
            ¿Qué pieza es?
            <input value={f.pieza} onChange={(e) => setF({ ...f, pieza: e.target.value })} required placeholder="Marca, modelo y color" className={`${campo} normal-case tracking-normal text-base`} />
          </label>
          <div className="mt-5 grid grid-cols-2 gap-5">
            <label className={`block text-[0.88rem] ${CAPS}`}>
              Categoría
              <select value={f.categoria} onChange={(e) => setF({ ...f, categoria: e.target.value as Categoria })} className={`${campo} normal-case tracking-normal text-base`}>
                {CATEGORIAS.slice(1).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className={`block text-[0.88rem] ${CAPS}`}>
              ¿Cuánto te costó? (Q)
              <input value={f.pagado} inputMode="numeric" onChange={(e) => setF({ ...f, pagado: e.target.value.replace(/\D/g, "") })} required className={`${campo} normal-case tracking-normal text-base`} />
            </label>
          </div>
          {pagado > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-px bg-black/10">
              <div className="p-3" style={{ background: PIEDRA }}>
                <p className={`text-[0.88rem] ${CAPS} opacity-55`}>La venderíamos en</p>
                <p className="mt-1 text-[1.3rem]" style={{ fontFamily: DIDONE }}>
                  {qz(venta)} aprox.
                </p>
              </div>
              <div className="p-3" style={{ background: PIEDRA }}>
                <p className={`text-[0.88rem] ${CAPS} opacity-55`}>Tú recibirías</p>
                <p className="mt-1 text-[1.3rem]" style={{ fontFamily: DIDONE, color: BRONCE }}>
                  {qz(recibe)} aprox.
                </p>
              </div>
            </div>
          )}
          <button type="submit" className={`mt-7 w-full py-4 text-[0.88rem] text-white ${CAPS}`} style={{ background: TINTA }}>
            Enviar mi pieza
          </button>
          <p className="mt-3 text-xs opacity-50">Estimado de ejemplo. El precio final se acuerda al revisar la pieza.</p>
        </form>
      </div>
    </section>
  );
}

/* Lista de deseos: la clienta dice qué busca y se le avisa cuando llegue */
function Deseos({ setD }: { setD: PropsDatos["setD"] }) {
  const [nombre, setNombre] = useState("");
  const [busca, setBusca] = useState("");
  const [listo, setListo] = useState(false);
  return (
    <section id="deseos" className="scroll-mt-24 border-b border-black/10">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20 text-center">
        <Heart size={22} className="mx-auto" style={{ color: BRONCE }} />
        <h2 className="mt-4 text-[2rem] sm:text-[2.8rem] leading-[1.05] font-normal !text-[#0f2a21]" style={{ fontFamily: DIDONE }}>
          ¿Buscas algo <span>en especial?</span>
        </h2>
        <p className="mt-3 opacity-70">Dinos qué pieza sueñas y te escribimos antes de publicarla.</p>
        {listo ? (
          <p className="mt-7 py-4" style={{ background: PIEDRA }}>
            Anotado. Serás la primera en saber cuando llegue.
          </p>
        ) : (
          <form
            className="mt-7 grid sm:grid-cols-[1fr_1.4fr_auto] gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!nombre.trim() || !busca.trim()) return;
              setD((x) => ({ ...x, deseos: [{ id: `d${Date.now()}`, nombre: nombre.trim(), busca: busca.trim() }, ...x.deseos] }));
              setListo(true);
            }}
          >
            <input aria-label="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" required className="border border-black/20 bg-white px-3 py-3.5 focus:outline-none focus:border-black" />
            <input aria-label="Qué pieza busca" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Bolso negro mediano, talla 38…" required className="border border-black/20 bg-white px-3 py-3.5 focus:outline-none focus:border-black" />
            <button type="submit" className={`px-6 py-3.5 text-[0.88rem] text-white ${CAPS}`} style={{ background: TINTA }}>
              Avísenme
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ---------------- panel de la dueña ---------------- */
