import React from "react";
import { Sun, Moon, Palette } from "lucide-react";
import clsx from "clsx";
import { useThemeContext } from "./ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeContext();

  return (
    <div className="flex gap-2 p-1 rounded-full border">
      <button
        onClick={() => setTheme("light")}
        className={clsx(
          "p-2 rounded-full transition-all",
          {
            "bg-blue-100 text-blue-600": theme === "light",
            "hover:bg-gray-100": theme === "light",
            "hover:bg-gray-800": theme === "dark",
            "hover:bg-rose-100": theme === "pastel",
          }
        )}
        aria-label="Light theme"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={clsx(
          "p-2 rounded-full transition-all",
          {
            "bg-indigo-600 text-white": theme === "dark",
            "hover:bg-gray-100": theme === "light",
            "hover:bg-gray-800": theme === "dark",
            "hover:bg-rose-100": theme === "pastel",
          }
        )}
        aria-label="Dark theme"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("pastel")}
        className={clsx(
          "p-2 rounded-full transition-all",
          {
            "bg-rose-300 text-rose-800": theme === "pastel",
            "hover:bg-gray-100": theme === "light",
            "hover:bg-gray-800": theme === "dark",
            "hover:bg-rose-100": theme === "pastel",
          }
        )}
        aria-label="Pastel theme"
      >
        <Palette className="w-4 h-4" />
      </button>
    </div>
  );
}
