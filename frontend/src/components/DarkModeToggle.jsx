import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const getInitial = () => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };
  const [dark, setDark] = useState(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((v) => !v)}
      className="btn btn-muted"
      title={dark ? "Mode clair" : "Mode sombre"}
    >
      {dark ? "🌙 Sombre" : "🌞 Clair"}
    </button>
  );
}
