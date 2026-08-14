import { PrismaHero }  from "@/components/ui/prisma-hero";
import { MacOSDock }   from "@/components/ui/mac-os-dock";
import { Compare }     from "@/components/sections/Compare";
import { Faq }         from "@/components/sections/Faq";
import { Portfolio }   from "@/components/sections/Portfolio";
import { Process }     from "@/components/sections/Process";
import { Benefits }    from "@/components/sections/Benefits";
import { Footer }      from "@/components/sections/Footer";

export default function App() {
  return (
    <>
      <MacOSDock />
      <PrismaHero id="hero" />
      <Compare />
      <Faq />
      <Portfolio />
      <Process />
      <Benefits />
      <Footer />
    </>
  );
}
