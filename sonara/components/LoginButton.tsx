import React from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useThemeContext } from "./ThemeContext";
import { auth } from "../firebase";
import clsx from "clsx";

export default function LoginButton() {
  const { user, loading, theme } = useThemeContext();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/profile";
    } catch {
      alert("Google sign-in failed");
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  if (loading) return null;

  return user ? (
    <button
      onClick={handleSignOut}
      className={clsx(
        "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
        {
          "bg-gray-900 text-white hover:bg-gray-800": theme === "light",
          "bg-white text-gray-900 hover:bg-gray-100": theme === "dark",
          "bg-rose-700 text-rose-50 hover:bg-rose-600": theme === "pastel",
        }
      )}
    >
      Sign Out
    </button>
  ) : (
    <button
      onClick={handleGoogleSignIn}
      className={clsx(
        "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
        {
          "bg-gray-900 text-white hover:bg-gray-800": theme === "light",
          "bg-white text-gray-900 hover:bg-gray-100": theme === "dark",
          "bg-rose-700 text-rose-50 hover:bg-rose-600": theme === "pastel",
        }
      )}
    >
      <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.5 6.2 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.2 17.1 19.2 14 24 14c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.5 6.2 29.5 4 24 4c-7.2 0-13.3 4.1-16.7 10.7z"/><path fill="#FBBC05" d="M24 44c5.8 0 10.7-1.9 14.3-5.2l-6.6-5.4C29.7 35.1 27 36 24 36c-5.7 0-10.5-3.7-12.2-8.8l-7 5.4C7.9 39.9 15.3 44 24 44z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2l-7 5.4C15.2 41.9 19.2 44 24 44c7.2 0 13.3-4.1 16.7-10.7z"/></g></svg>
      Sign in with Google
    </button>
  );
}
