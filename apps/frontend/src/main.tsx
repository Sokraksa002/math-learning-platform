import ReactDOM from "react-dom/client";
import AppRoutes from "./routes";
import "./index.css";
import "./locales/index";
import React from "react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);