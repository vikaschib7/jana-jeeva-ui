import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./app/components/mui";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
