/* Catálogo técnico: filtros en vivo, esqueletos de carga y entrada escalonada de las fichas. */
import { useEffect, useRef, useState } from "react";
import { Check, CircleCheck, Search, ShoppingCart, TriangleAlert } from "lucide-react";
import { useDemora, useEscalonado } from "./animar";
import Cantidad from "./Cantidad";
import Foto from "./Foto";
import { CATEGORIAS, PRODUCTOS, entero, qz, unidades, type Carro, type Categoria, type Producto, type ProductoId } from "./datos";

export type Filtro = { cat: Categoria | "Todo"; busca: string };

const sinTildes = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function filtrar({ cat, busca }: Filtro) {
  const palabras = sinTildes(busca).split(/\s+/).filter(Boolean);
  return PRODUCTOS.filter((p) => {
    if (cat !== "Todo" && p.cat !== cat) return false;
    const texto = sinTildes(`${p.nombre} ${p.sku} ${p.medida} ${p.uso} ${p.cat}`);
    return palabras.every((x) => texto.includes(x));
  });
}

function Ficha({ p, enPedido, agregar }: { p: Producto; enPedido: number; agregar: (id: ProductoId, n: number) => void }) {
  const [n, setN] = useState(1);
  const [listo, setListo] = useState(false);
  const libre = p.hay - enPedido;
  const pocas = p.hay < 6;

  useEffect(() => {
    if (!listo) return;
    const t = window.setTimeout(() => setListo(false), 1600);
    return () => window.clearTimeout(t);
  }, [listo]);

  return (
    <article className="ik-tarjeta ik-ficha">
      <Foto p={p} className="ik-foto" />
      <div className="ik-datos min-w-0">
        <p className="ik-num ik-gris text-[0.74rem] font-bold">{p.sku}</p>
        <h3 className="mt-1 text-[1.02rem] !leading-snug">{p.nombre}</h3>
        <p className="ik-num mt-1.5 text-[0.78rem]">{p.medida}</p>
        <p className="ik-gris mt-1 hidden text-[0.84rem] sm:block">{p.uso}</p>
      </div>
      <div className="ik-compra">
        <p className={`mt-3 flex items-center gap-1.5 text-[0.82rem] font-bold ${pocas ? "text-[#a41818]" : "text-[#15803d]"}`}>
          {pocas ? <TriangleAlert size={15} aria-hidden /> : <CircleCheck size={15} aria-hidden />}
          {pocas ? `Últimas ${p.hay} en bodega` : `En bodega: ${entero(p.hay)} ${unidades(p, p.hay)}`}
        </p>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2 border-t border-slate-200 pt-2">
          <span className="ik-num text-[1.5rem] font-bold">{qz(p.precio)}</span>
          <span className="ik-gris text-[0.8rem]">por {p.unidad[0]}, IVA incluido</span>
        </p>
        <div className="mt-2.5 flex gap-2">
          <Cantidad p={{ ...p, hay: Math.max(libre, 1) }} valor={Math.min(n, Math.max(libre, 1))} alCambiar={setN} />
          <button
            type="button"
            className="ik-btn ik-rojo min-w-0 flex-1 !px-2"
            disabled={libre <= 0}
            aria-label={`Agregar ${p.nombre} al pedido`}
            onClick={() => {
              agregar(p.id, Math.min(n, libre));
              setN(1);
              setListo(true);
            }}
          >
            {listo ? <Check size={17} aria-hidden /> : <ShoppingCart size={17} aria-hidden />}
            {listo ? "Agregado" : "Agregar"}
          </button>
        </div>
        <p className="ik-gris mt-1.5 min-h-[1.3rem] text-[0.8rem] font-semibold" role="status">
          {enPedido > 0 ? `En su pedido: ${entero(enPedido)} ${unidades(p, enPedido)}${libre <= 0 ? " (todo el inventario)" : ""}` : ""}
        </p>
      </div>
    </article>
  );
}

function Esqueleto() {
  return (
    <div className="ik-tarjeta ik-ficha" aria-hidden>
      <span className="ik-hueso ik-foto" />
      <div className="ik-datos space-y-2">
        <span className="ik-hueso h-3 w-20" />
        <span className="ik-hueso h-5 w-11/12" />
        <span className="ik-hueso h-3 w-3/5" />
        <span className="ik-hueso hidden h-3 w-4/5 sm:block" />
      </div>
      <div className="ik-compra">
        <span className="ik-hueso mt-3 h-4 w-40" />
        <span className="ik-hueso mt-3 h-8 w-32" />
        <span className="ik-hueso mt-3 h-12 w-full" />
        <span className="mt-1.5 block h-[1.3rem]" />
      </div>
    </div>
  );
}

export default function Catalogo({ filtro, setFiltro, carro, agregar }: { filtro: Filtro; setFiltro: (f: Filtro) => void; carro: Carro; agregar: (id: ProductoId, n: number) => void }) {
  const [aplicada, cargando] = useDemora(JSON.stringify({ cat: filtro.cat, busca: filtro.busca.trim() }), 350);
  const lista = filtrar(JSON.parse(aplicada) as Filtro);
  const rejilla = useRef<HTMLDivElement>(null);
  useEscalonado(rejilla, aplicada, !cargando);

  return (
    <section id="catalogo" className="ik-alterna scroll-mt-16">
      <div className="ik-ancho py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="ik-sobre">Catálogo técnico</p>
            <h2 className="mt-1 text-[1.9rem] sm:text-[2.4rem]">Precio y existencia antes de pedir</h2>
            <p className="ik-gris mt-1 text-[0.92rem]">Inventario verificado en bodega. Imágenes con fines ilustrativos.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search size={18} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="search" className="ik-campo !pl-10" aria-label="Buscar en el catálogo por producto o SKU" placeholder="Producto o código SKU" value={filtro.busca} onChange={(e) => setFiltro({ ...filtro, busca: e.target.value })} />
          </div>
        </div>

        <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Categorías">
          {(["Todo", ...CATEGORIAS] as const).map((c) => (
            <button key={c} type="button" className="ik-pestana" aria-pressed={filtro.cat === c} onClick={() => setFiltro({ ...filtro, cat: c })}>
              {c}
            </button>
          ))}
        </div>
        <p className="ik-gris ik-num mt-3 text-[0.8rem]" role="status">
          {cargando ? "Consultando inventario…" : `${lista.length} de ${PRODUCTOS.length} productos`}
        </p>

        <div ref={rejilla} className="ik-grid mt-3" aria-busy={cargando}>
          {cargando
            ? Array.from({ length: Math.max(1, Math.min(filtrar(filtro).length, 8)) }, (_, i) => <Esqueleto key={i} />)
            : lista.map((p) => (
                <div key={p.id} data-entra>
                  <Ficha p={p} enPedido={carro[p.id] ?? 0} agregar={agregar} />
                </div>
              ))}
        </div>
        {!cargando && lista.length === 0 && (
          <div className="ik-tarjeta p-8 text-center">
            <p className="font-bold">No encontramos ese producto en el catálogo en línea.</p>
            <p className="ik-gris mt-1 text-[0.95rem]">Pídalo por WhatsApp: en sala de ventas manejamos más referencias.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button type="button" className="ik-btn ik-linea" onClick={() => setFiltro({ cat: "Todo", busca: "" })}>Ver todo el catálogo</button>
              <a className="ik-btn ik-rojo" href={`https://wa.me/?text=${encodeURIComponent(`Hola, Industek. Busco: ${filtro.busca.trim() || filtro.cat}. ¿Lo tienen disponible?`)}`} target="_blank" rel="noopener noreferrer">
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
