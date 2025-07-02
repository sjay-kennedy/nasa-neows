"use client";
import { useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const dark = localStorage.getItem("theme-dark");
    const isDark = dark === null ? true : dark === "true";
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    setMounted(true);
  }, []);

  if (!mounted) return null; // or a splash screen

  return <>{children}</>;
}