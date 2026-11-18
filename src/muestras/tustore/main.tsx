import "../../index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MuestraTuStore from "./MuestraTuStore";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MuestraTuStore />
  </StrictMode>,
);
