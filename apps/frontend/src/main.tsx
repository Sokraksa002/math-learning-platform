import ReactDOM from "react-dom/client";
import AppRoutes from "./routes";
import "./index.css";
import "./locales/index";
import React from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import "katex/dist/katex.min.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  </React.StrictMode>
);