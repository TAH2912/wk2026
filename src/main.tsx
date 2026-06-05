import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./App";
import "./index.css";

// HashRouter (URLs met #/) werkt out-of-the-box op statische hosts zoals GitHub Pages:
// deeplinks en pagina-refresh geven geen 404, ongeacht het subpad.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
