import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { Music } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LoginButton from "./LoginButton";

interface NavBarProps {
  theme: "light" | "dark" | "pastel";
}

export default function NavBar({ theme }: NavBarProps) {
  return (
    <nav
      className={clsx(
        "w-full flex items-center justify-between px-6 py-3 rounded-2xl shadow-lg mt-4 mb-8 transition-all",
        {
          "bg-gradient-to-r from-blue-500 to-indigo-600 text-white": theme === "light",
          "bg-gradient-to-r from-gray-800 to-indigo-900 text-white": theme === "dark",
          "bg-gradient-to-r from-rose-500 to-amber-500 text-white": theme === "pastel",
        }
      )}
      style={{ backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.15)' }}
    >
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight hover:scale-105 transition-transform">
        <span className="inline-block bg-white/20 rounded-full p-2">
          <Music className="w-7 h-7" />
        </span>
        Sonara
      </Link>
      <div className="flex gap-6 text-lg font-medium">
        <Link href="/explore" className="hover:underline underline-offset-8 decoration-2 decoration-white/60 transition-all">Explore</Link>
        <Link href="/library-curated_collections" className="hover:underline underline-offset-8 decoration-2 decoration-white/60 transition-all">Library</Link>
        <Link href="/track_id-track_details" className="hover:underline underline-offset-8 decoration-2 decoration-white/60 transition-all">Track ID</Link>
        <Link href="/about_page" className="hover:underline underline-offset-8 decoration-2 decoration-white/60 transition-all">About</Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <LoginButton />
      </div>
    </nav>
  );
}
