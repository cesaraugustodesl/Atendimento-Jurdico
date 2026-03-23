import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeAnalytics } from "./services/trackingService";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found.");
}

initializeAnalytics();

const app = (
  <StrictMode>
    <App initialPath={window.location.pathname} />
  </StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
