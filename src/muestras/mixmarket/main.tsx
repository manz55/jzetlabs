import "../../index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MuestraMixMarket from "./MuestraMixMarket";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MuestraMixMarket />
  </StrictMode>,
);
