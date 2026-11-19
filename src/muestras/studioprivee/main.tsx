import "../../index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MuestraStudioPrivee from "./MuestraStudioPrivee";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MuestraStudioPrivee />
  </StrictMode>,
);
