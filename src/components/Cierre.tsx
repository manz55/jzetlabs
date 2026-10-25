/*
 * Cierre: nota escrita a mano, firmada, con los lentes que se dibujan solos,
 * y el footer que enlaza con La tienda.
 */
import { ArrowUpRight, Mail } from "lucide-react";
import { EMAIL, WHATSAPP_DISPLAY, laTienda, whatsappLink } from "@/data/site";
import { Gafas } from "./Gafas";
import { Logo } from "./Nav";

export function Cierre() {
  return (
    <footer id="contacto" className="relative px-4 sm:px-6 pt-12 pb-10">
      <div className="mx-auto max-w-4xl">
        <div className="relative bg-[#fffdf3] border-2 border-ink rounded-[6px] p-7 sm:p-12 shadow-[8px_8px_0_var(--color-ink)] -rotate-[0.6deg]" style={{ backgroundImage: "repeating-linear-gradient(#fffdf3 0 38px, #c9d4f2 38px 39px)" }}>
          <span className="tape -top-3 left-10 rotate-[-6deg]" aria-hidden />
          <span className="tape -top-3 right-10 rotate-[5deg]" aria-hidden />
          <Gafas dibujar className="absolute right-6 sm:right-10 top-8 w-24 sm:w-32 h-auto rotate-6" />
          <p className="hand text-[clamp(1.6rem,4.5vw,2.3rem)] leading-[39px] text-ink pr-24 sm:pr-36">
            Gracias por llegar hasta aquí.
            <br />
            Si tienes una idea, aunque sea a medias, cuéntamela. Te contesto yo, sin compromiso.
          </p>
          <p className="hand text-[clamp(1.6rem,4.5vw,2.3rem)] leading-[39px] text-tomato text-right mt-2">— Josh</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={whatsappLink("¡Hola Josh! Vi tu página y quiero platicar de un proyecto.")} target="_blank" rel="noopener noreferrer" className="btn btn-primary justify-center !text-[1.15rem] !py-4 sm:flex-1">
              Escríbeme por WhatsApp · {WHATSAPP_DISPLAY}
            </a>
            <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Quiero platicar de un proyecto")}`} className="btn btn-ghost justify-center">
              <Mail size={18} /> Correo
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-5">
          <Logo />
          <a href={laTienda()} target="_blank" rel="noopener noreferrer" className="hand text-[1.7rem] text-cobalt inline-flex items-center gap-1 hover:underline underline-offset-4">
            La tienda · por Jzetlabs <ArrowUpRight size={20} />
          </a>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-ink-2">
          <Gafas className="w-12 h-auto" />
          <span>{new Date().getFullYear()} · Hecho por Joshua Zet</span>
        </div>
      </div>
    </footer>
  );
}
