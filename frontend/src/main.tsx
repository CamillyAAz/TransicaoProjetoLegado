import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

function applyInitialTheme() {
  const pref = (localStorage.getItem("theme") as "light" | "dark" | "system" | null) ?? "system";
  const root = document.documentElement;
  if (pref === "system") {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    root.classList.toggle("dark", mql.matches);
  } else {
    root.classList.toggle("dark", pref === "dark");
  }
}

applyInitialTheme();

createRoot(document.getElementById("root")!).render(<App />);
